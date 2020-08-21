---
title: Profiling Web Audio apps in Chrome
subhead: >
  Learn how to profile the performance of Web Audio apps in Chrome using 
  `chrome://tracing` and the **WebAudio** tab in DevTools.
description: >
  Learn how to profile the performance of Web Audio apps in Chrome using
  `chrome://tracing` and the **WebAudio** panel in DevTools.
date: 2020-05-04
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - media
  - webaudio
authors:
  - hongchanchoi
hero: hero.jpg
alt: Artistic image of microphone and pop filter
---

You reached this documentation probably because you're developing an app
that uses the [Web Audio API](https://developer.mozilla.org/docs/Web/API/Web_Audio_API)
and experienced some unexpected glitches such as popping noises from the
output. You might already be involved in a [crbug.com](https://crbug.com)
discussion and a Chrome engineer has asked you to upload "tracing data". This
guide shows how to obtain the data so you can help engineers triage, and
eventually fix, the issue.

## Web Audio profiling tools

There are two tools that will help you when profiling Web Audio,
`chrome://tracing` and the **WebAudio** tab in Chrome DevTools.

### When do you use `chrome://tracing`?

When mysterious "glitches" happen. Profiling the app with the tracing tools
gives you insights on:

* **Time slices spent by specific function calls** on different threads
* **Audio callback timing** in the timeline view

It usually shows the missed deadlines or the big garbage collection stops that
might cause unexpected audio glitches. This information is useful for triaging
a bug. Chromium engineers will ask for tracing data if a local reproduction of the issue
is not feasible. See [The Trace Event Profiling Tool][chromium-tracing] for
general instructions on how to trace.

### When do you use the **WebAudio** tab?

When you want to get a feel for how the application performs in the real world.
DevTools shows you a running estimate of render capacity, which indicates
how the web audio rendering engine is handling render tasks over a given
render budget (for example, approximately 2.67ms @ 48KHz). If the capacity
goes near 100%, that means your app is likely to produce glitches because the
renderer is failing to finish the work in the render budget.

## Use `chrome://tracing`

### How to capture tracing data

*The instructions below written are for Chrome 80 and later.*

For best results, close all other tabs and windows, and disable extensions.
Alternatively you can either [launch a new instance of Chrome][new-chrome-instance]
or use other builds from [different release channels][diff-channel] (e.g.
Beta or Canary). Once you have the browser ready, follow the steps below:

1. Open your application (web page) on a tab.
1. Open another tab and go to `chrome://tracing`.
1. Press the **Record** button and select **Manually select settings**.
1. Press the **None** buttons on both the **Record Categories** and
   **Disabled by Default Categories** sections.
1. In the **Record Categories** section, select the following:
    * `audio`
    * `blink_gc`
    * `media`
    * `v8.execute` (if you're interested in `AudioWorklet` JS code performance)
    * `webaudio`
1. In the **Disabled by Default Categories** section, select the following:
    * `audio-worklet` (if you're interested in where the `AudioWorklet` thread starts)
    * `webaudio.audionode` (if you need the detailed trace for each `AudioNode`)
1. Press the **Record** button at the bottom.
1. Go back to your application tab and redo the steps that triggered the issue.
1. When you have enough trace data, go back to the tracing tab and press **Stop**.
1. The tracing tab will visualize the result.

   <img src="1-hello-audio-worklet.jpg" class="w-screenshot w-screenshot--filled"
     alt="Screen shot after tracing has completed.">

1. Press **Save** to save the tracing data.

### How to analyze tracing data

The tracing data visualizes how Chrome's web audio engine renders the audio.
The renderer has two different render modes: **Native mode** and
**Worklet mode**. Each mode uses a different threading model, so the tracing
results also differ.

#### Native mode

In Native mode, the [`AudioOutputDevice`][cr-audio-output-device] thread runs
all the web audio code. The `AudioOutputDevice` is a real-time priority thread
originating from the browser's Audio Service that is driven by the audio
hardware clock. If you see irregularity from the trace data in this lane,
it means the callback timing from the device may be jittery. The combination
of Linux and Pulse Audio is known to have this problem. See the following Chromium issues
for more details: [#825823](https://crbug.com/825823),
[#864463](https://crbug.com/864463).

<img src="2e-box2d.jpg" class="w-screenshot w-screenshot--filled"
     alt="Screen shot of native mode tracing result." >

#### Worklet mode

In Worklet Mode, which is characterized by one thread jump from
`AudioOutputDevice` to the [`AudioWorklet` thread][cr-audio-worklet-thr], you
should see well-aligned traces in two thread lanes as shown below.  When the
worklet is activated all the web audio operations are rendered by the
`AudioWorklet` thread. This thread is currently not a real-time priority one.
The common irregularity here is a big block caused by the garbage collection
or missed render deadlines. Both cases lead to glitches in the audio stream.

<img src="3e-hello-audio-worklet.png" class="w-screenshot w-screenshot--filled"
     alt="Screen shot of worklet mode tracing result.">

In both cases, the ideal tracing data is characterized by well-aligned audio
device callback invocations and render tasks being completed well within the
given render budget. The two screenshots above are great examples of the ideal
tracing data.

### Learning from real-world examples

#### Example 1: Render tasks going beyond render budget

The screenshot below ([Chromium issue #796330](https://crbug.com/796330)) is a
typical example of when code in `AudioWorkletProcessor` takes too long and
goes beyond a given render budget. The callback timing is well behaved but
the audio processing function call of the Web Audio API failed to complete the
work before the next device callback.

<img src="5e-render-budget.png" class="w-screenshot w-screenshot--filled"
     alt="Diagram showing audio glitch due to render task overflowing budget.">

**Your options:**

* Reduce the workload of the audio graph by using fewer `AudioNode` instances.
* Reduce the workload of your code in the `AudioWorkletProcessor`.
* Increase the base latency of `AudioContext`.

#### Example 2: Significant garbage collection on the worklet thread

Unlike on the native audio rendering thread, garbage collection is managed
on the worklet thread. That means if your code does memory allocation/deallocation
(e.g. new arrays) it eventually triggers a garbage collection which
synchronously blocks the thread. If the workload of web audio operations and
garbage collection is bigger than a given render budget, it results in
glitches in the audio stream. The following screenshot is an extreme example of this
case.

<img src="6e-garbage-collection.png" class="w-screenshot w-screenshot--filled"
     alt="Audio glitches caused by garbage collection.">

{% Aside %}
  Chrome's `AudioWorkletProcessor` implementation generates `Float32Array` instances for
  the input and output buffer every audio processing callback. This also
  slowly builds up the memory usage over time. The team has a plan to improve
  the design once the related specification is finalized.
{% endAside %}

**Your options:**

* Allocate the memory up front and reuse it whenever possible.
* Use different design patterns based on `SharedArrayBuffer`. Although this
  is not a perfect solution, several web audio apps use a similar pattern with
  `SharedArrayBuffer` to run the intensive audio code. Examples:
  * [Audio Worklet Design Pattern (Web Audio Power House)][webfu-audio-worklet-dp]
  * [Audio Device Client Prototype][aud-dev-client-proto]

#### Example 3: Jittery audio device callback from `AudioOutputDevice`

The precise timing of audio callback is the most important thing for web audio.
This should be the most precise clock in your system. If the operating system
or its audio subsystem cannot guarantee a solid callback timing, all the
subsequent operations will be affected. The following image is an example
of jittery audio callback. Compared to the previous two images, the interval
between each callback varies significantly.

<img src="4e-pulse-audio.png" class="w-screenshot w-screenshot--filled"
     alt="Screen shot comparing unstable vs stable callback timing.">

This is a known issue on Linux, which uses Pulse Audio as an audio
backend. This is still under investigation ([Chromium issue #825823](https://crbug.com/825823)).

## Use the **WebAudio** tab in Chrome DevTools

You also can use the DevTools tab specifically designed for web audio. This
is less comprehensive compared to the tracing tool, but it is useful if you
want to gauge the running performance of your application.

Access the panel by opening the **Main Menu** of
DevTools, then go to **More tools** > **WebAudio**.

<img src="7e-devtools.jpg" class="w-screenshot w-screenshot--filled"
     alt="Screen shot showing how to open WebAudio panel in Chrome DevTools.">

<img src="8e-devtools.png" class="w-screenshot w-screenshot--filled"
     alt="Screen shot of WebAudio panel in Chrome DevTools.">

This tab shows information about running instances of `BaseAudioContext`.
Use it to see how the web audio renderer is performing on the page.

Since a page can have multiple `BaseAudioContext` instances, the **Context Selector**
(which is the drop-down menu that says `realtime (4e1073)` in the last screenshot), 
allows you to choose what you want to inspect. The inspector
view shows the properties (e.g. sample rate, buffer size, channel count, and
context state) of a `BaseAudioContext` instance that you select, and it
dynamically changes when properties change.

The most useful thing in this view is the status bar at the bottom. It is only
active when the selected `BaseAudioContext` is an `AudioContext`, which runs
in real-time. This bar shows the instantaneous audio stream quality of a
selected `AudioContext` and is updated every second. It provides the following
information:

* **Callback interval** (ms): Displays the weighted mean/variance of callback
  interval. Ideally the mean should be stable and the variance should be
  close to zero. Otherwise the operating system's audio infra might have
  problems in deeper layers.
* **Render Capacity** (percent): Follows this formula: (*time spent in actual
  rendering / instantaneous callback interval*) &times; 100. When the capacity
  gets close to 100 percent, it means that the renderer is doing too much for a
  given render budget, so you should consider doing less in the web audio code.

You can manullay trigger a garbage collector by clicking the trash can icon.

## Conclusion

Debugging audio is hard. Debugging audio in the browser is even harder.
However, these tools can ease the pain by providing you with useful insights
on how the web audio code performs. In some cases, you may find that web
audio does not behave as it should - then do not be afraid to
[file a bug on Chromium Bug Tracker][cr-file-a-bug]. While filling out the information,
you can follow the guideline above and submit the tracing data you captured
with a reproducible test case. With this data the Chrome engineers will be able
to fix your bug much faster.

Photo by Jonathan Velasquez on [Unsplash](https://unsplash.com/photos/c1ZN57GfDB0)

[cr-file-a-bug]: https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EWebAudio
[webfu-audio-worklet-dp]: https://developers.google.com/web/updates/2018/06/audio-worklet-design-pattern#webaudio_powerhouse_audio_worklet_and_sharedarraybuffer
[aud-dev-client-proto]: https://github.com/GoogleChromeLabs/audio-device-client-prototype
[cr-audio-worklet-thr]: https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/modules/webaudio/audio_worklet_thread.h
[chromium-tracing]: https://www.chromium.org/developers/how-tos/trace-event-profiling-tool
[new-chrome-instance]: https://developer.chrome.com/devtools/docs/clean-testing-environment
[diff-channel]: https://www.chromium.org/getting-involved/dev-channel
[cr-audio-output-device]: https://source.chromium.org/chromium/chromium/src/+/master:media/audio/audio_output_device.h
