---
layout: post
title: Observing compute pressure
subhead: An experimental API for reacting to changes in CPU use.
authors:
  - jeffposnick
date: 2021-06-03
updated: 2021-06-07
description: An experimental API for reacting to changes in CPU use.
hero: image/FNkVSAX8UDTTQWQkKftSgGe9clO2/H9cVTFMj4cYmoIfGYQqd.jpg
alt: A pressure gauge and pipes.
tags:
  - blog
  - capabilities
origin_trial:
  url: https://developer.chrome.com/origintrials/#/view_trial/1838594547874004993
---

{% Aside %}
The Compute Pressure API is part of the
[capabilities project](https://web.dev/fugu-status/) and is currently in
development. This post will be updated as the implementation progresses.
{% endAside %}

## Background

The sound of fans revving up inside of a laptop's body, or a phone that's warm
to the touch are unpleasant, if all too familiar, sensations. They're signs that
the hardware inside of a device is being pushed to its limit, and the only
options are dissipating the associated heat, or deliberately slowing down the
speed of the processors so that they'll run cooler. Most installed applications
are able to detect when a device is under this type of CPU stress, and can
selectively disable features or reduce their workloads in response.
Increasingly, there are web applications that would benefit from the same
information.

[Compute Pressure](https://github.com/oyiptong/compute-pressure/) is a new,
experimental API allows web applications to gain insight into the CPU
utilization of the browser's device. The API provides a callback
that receives periodic updates, allowing developers to observe changes in CPU
utilization over time. A web app that uses this API can enable or
disable heavyweight features in response to these
observations. It's a feedback mechanism that unlocks new doors for adaptive
behavior, which can in turn lead to smoother, cooler experiences across a range
of hardware devices.

## Use cases

The motivating use cases are helping video conferencing and video game web
applications adapt to CPU utilization. The initial experimental implementation
of the API aims to support the decisions listed here.

### Video conferencing

- Dynamically adjusting the number of live video feeds displayed on the screen at
  once.
- Adjusting the video resolution or frame rate.
- Skipping non-essential video processing, such as cosmetic filters.
- Disabling non-essential audio processing, such as noise suppression.
- Skewing the quality-vs-speed and size-vs-speed knobs towards "speed" in video and
  audio encoding.

### Video games

- Using lower-quality video and audio assets as needed.
- Disabling optional effects like reflections, glare, or particle animations that
  don't affect gameplay.
- Tweaking quality-vs-speed knobs in the game's rendering engine, affecting areas
  like shadow quality, texture filtering, and view distance.

The secondary use case is measuring the CPU resource consumption of a feature.
This ultimately supports the main goal of avoiding driving user devices into
high CPU utilization. The API helps developers make the types of decisions
listed here.

- Comparing the CPU consumption of alternative implementations of the same
  feature to find out which is more efficient. The API supports measuring CPU
  utilization in the field via
  [A/B tests](https://en.wikipedia.org/wiki/A/B_testing) because a feature's
  CPU utilization depends on the hardware it's running on. Most developers
  cannot afford performance measurement labs covering all the devices owned by
  their users.
- Estimating the impact on CPU consumption of enabling a feature. This cost
  estimate feeds into the decisions outlined in the primary use case.

## CPU utilization

The CPU utilization of a device is the average of the utilization of all the
device's [CPU cores](https://en.wikipedia.org/wiki/Multi-core_processor),
represented in the API as a number between `0.0` and `1.0`.

A CPU core's utilization is the fraction of time that the core has been
executing code belonging to a thread, as opposed to being in an idle state.

A CPU utilization close to `0.0` indicates that the processor has been almost
entirely idle. A CPU utilization close to `1.0` is very likely to
generate excessive heat. Web applications can help avoiding bad
user experiences by reducing their compute demands when the CPU utilization is
high.

## CPU clock speed

Modern CPU cores support a set of clock speeds. The device's firmware or
operating system can set the core clock speed in order to trade off the
available CPU computational resources with power consumption.

From a user experience standpoint, the following are the most interesting clock
speeds:

- The minimum clock speed, which results in the lowest power consumption.
- The base clock speed, which results in a moderate level of power consumption
  and heat generation. This tends to be the speed advertised in marketing
  materials.
- The maximum clock speed, sometimes marketed as "turbo boost." Running at this
  speed causes unsustainable amounts of heating. It can only be used for short
  periods of time, to satisfy bursts in demand for computing power.

When a device's CPU utilization gets high, the device may increase clock speeds
across its CPU cores, in an attempt to meet the demand for computing power. As
the speeds exceed the base clock speed, the elevated power consumption increases
the CPU's temperature. At some point, the device enters a
[thermal throttling regime](https://en.wikipedia.org/wiki/Dynamic_frequency_scaling),
where the CPU clock speed is reduced in order to bring the temperature down.

As with CPU utilization, values from `0.0` (minimal) to `1.0` (boosted) are used
to normalize clock speeds. A value of `0.5` represents the base clock speed for
a given CPU.

## Using the API

The following code creates a `ComputePressureObserver`, configured with specific
triggering thresholds, along with an associated callback function that may be
invoked when a threshold is crossed. The callback is intentionally rate-limited,
with the current implementation maxing out at one invocation per second for a
page in the foreground, and once per ten seconds for background pages.

Inside the callback function, your web application can respond to the changing
utilization and clock speed levels by enabling or disabling CPU-intensive
functionality.

```javascript
function callback(update) {
  if (update.cpuSpeed > 0.5) {
    // The CPU is running at faster than base speed.
  } else {
    // The CPU is running at normal or reduced speed.
  }

  if (update.cpuUtilization >= 0.9) {
    // CPU utilization is over 90%.
  } else if (update.cpuUtilization >= 0.75) {
    // CPU utilization is over 75%.
  } else if (update.cpuUtilization >= 0.5) {
    // CPU utilization is over 50%.
  } else {
    // CPU utilization is under 50%.
  }
}

const observer = new ComputePressureObserver(callback, {
  // Thresholds divide the interval [0.0 .. 1.0] into ranges.
  cpuUtilizationThresholds: [0.5, 0.75, 0.9],
  // The minimum clock speed is 0.0, and the maximum speed is 1.0.
  // 0.5 represents the base clock speed.
  cpuSpeedThresholds: [0.5],
});

// Begin observing changes and triggering callbacks:
observer.observe();

// ...later on, to stop observing changes:
observer.unobserve();
```

### Exposing limited information via thresholds and buckets

One of the key API design goals is to provide enough information for an
application to make useful decisions based on compute pressure, while not
exposing information that might
[harm a user's privacy](https://github.com/oyiptong/compute-pressure/blob/main/security-privacy-self-assessment.md).

With this in mind, the API reports normalized, unitless values between
`0.0` and `1.0` instead of more identifiable values like clock speeds in GHz.
The values passed to the callback fall into one of the "buckets" defined by the
thresholds used to configure the observer. The actual value will be the midpoint
between the upper and lower bounds for the bucket. In other words, they will be
values determined by how you configure the observer, and not based on the actual
device.

To give an example, the configuration in the preceding section uses
`cpuUtilizationThresholds: [0.5, 0.75, 0.9]`. This configuration sets up a total
of four possible buckets that the reported values might fall into, covering the
ranges 0.0 to 0.5, 0.5 to 0.75, 0.75 to 0.9, and 0.9 to 1.0. To represent bucket
membership, the value reported to the callback is the average between
the lower and upper bounds for the bucket.

<figure class="w-figure">
  {% Img src="image/FNkVSAX8UDTTQWQkKftSgGe9clO2/VUrr3MykViLDtHuTkjYG.svg", alt="A diagram illustrating the bucketing for different actual CPU utilizations", width="800", height="549" %}
  <figcaption class="w-figcaption">
    This diagram illustrates the relationship between three thresholds and the
    four buckets that they form.
  </figcaption>
</figure>

Here's how some "real" CPU utilization values, as reported by the operating
system to the browser, would be represented as values passed to your callback:

- "Real" 0% utilization would map to the 0.0 to 0.5 bucket, and would be
  reported as `cpuUtilization: 0.25`, since 0.25 is the average of 0.0 and 0.5.
- "Real" 40% utilization would similarly map to the 0.0 to 0.5 bucket, and be
  reported as `cpuUtilization: 0.25`
- "Real" 60% utilization would map to the 0.5 to 0.75 bucket, and be reported as
  `cpuUtilization: 0.625`
- "Real" 80% utilization would map to the 0.75 to 0.9 bucket, and be reported as
  `cpuUtilization: 0.825`

The same threshold and bucket system applies to the exposed CPU speed values.

{% Aside %}
The values reported by the API reflect the overall state of the CPU,
due to utilization across all applications currently running. Therefore, even if
your own web application is almost entirely idle, you may see high utilization
and clock speed values reported, due to the activities of other applications.
{% endAside %}

## Try a demo

When accessed on a browser that supports the origin trial (currently Chrome 92
or later), [this demo](https://googlechrome.github.io/samples/compute-pressure/index.html)
will display an ongoing readout of your device's CPU utilization and speed.

## API status

<div class="w-table-wrapper">

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [Complete](https://github.com/oyiptong/compute-pressure/blob/main/README.md)    |
| 2. Create initial draft of specification | [In Progress](https://oyiptong.github.io/compute-pressure/)      |
| 3. Gather feedback & iterate on design   | In progress |
| 4. **Origin trial**                      | [In progress](#ot)    |
| 5. Launch                                | Not started              |

</div>

## API Availability

### Enabling support during the origin trial phase {: #ot }

Starting in Chrome 92, the Compute Pressure API can be used as part of an origin
trial.

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Enabling via about://flags

To experiment with the API locally, without an origin trial token, enable the
`#enable-experimental-web-platform-features` flag in about://flags.

### Feature detection

You should check for the presence of `ComputePressureObserver` in the `window`
scope to see if the feature is available:

```javascript
if ('ComputePressureObserver' in window) {
  // The Compute Pressure API is available.
}
```

## Acknowledgements

This blog post is derived on the sample code and
[API explainer](https://github.com/oyiptong/compute-pressure/blob/main/README.md)
created by Olivier Yiptong and Victor Costan.

The hero image was created by Robert Anasch on
[Unsplash](https://unsplash.com/photos/-C7IKRBZHrg). The diagram illustrating
bucketing was created by [Adam Argyle](/authors/adamargyle/).
