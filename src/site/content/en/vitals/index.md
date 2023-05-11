---
layout: post
title: Web Vitals
description: Essential metrics for a healthy site
hero: image/admin/BHaoqqR73jDWe6FL2kfw.png
authors:
  - philipwalton
date: 2020-04-30
updated: 2023-05-10
tags:
  - metrics
  - performance
  - web-vitals
---

{% Aside %}
**New:** [Interaction to Next Paint (INP)](/inp/) is no longer experimental! [Learn more](/inp-cwv/) about our plans to replace FID with INP as a Core Web Vital in March 2024.
{% endAside %}

Optimizing for quality of user experience is key to the long-term success of any
site on the web. Whether you're a business owner, marketer, or developer, Web
Vitals can help you quantify the experience of your site and identify
opportunities to improve.

## Overview

Web Vitals is an initiative by Google to provide unified guidance for quality
signals that are essential to delivering a great user experience on the web.

Google has provided a number of tools over the years to measure and report on
performance. Some developers are experts at using these tools, while others have
found the abundance of both tools and metrics challenging to keep up with.

Site owners should not have to be performance experts to understand the
quality of experience they are delivering to their users. The Web Vitals
initiative aims to simplify the landscape, and help sites focus on the metrics
that matter most, the **Core Web Vitals**.

## Core Web Vitals

Core Web Vitals are the subset of Web Vitals that apply to all web pages, should
be measured by all site owners, and will be surfaced across all Google tools.
Each of the Core Web Vitals represents a distinct facet of the user experience,
is measurable [in the
field](/user-centric-performance-metrics/#how-metrics-are-measured),
and reflects the real-world experience of a critical
[user-centric](/user-centric-performance-metrics/#how-metrics-are-measured)
outcome.

The metrics that make up Core Web Vitals will [evolve](#evolving-web-vitals)
over time. The current set for 2020 focuses on three aspects of the user
experience—_loading_, _interactivity_, and _visual stability_—and includes the
following metrics (and their respective thresholds):

<div class="auto-grid" style="--auto-grid-min-item-size: 200px;">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZZU8Z7TMKXmzZT2mCjJU.svg", alt="Largest Contentful Paint threshold recommendations", width="400", height="350" %}
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iHYrrXKe4QRcb2uu8eV8.svg", alt="First Input Delay threshold recommendations", width="400", height="350" %}
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dgpDFckbHwwOKdIGDa3N.svg", alt="Cumulative Layout Shift threshold recommendations", width="400", height="350" %}
</div>

- **[Largest Contentful Paint (LCP)](/lcp/)**: measures _loading_ performance.
  To provide a good user experience, LCP should occur within **2.5 seconds** of
  when the page first starts loading.
- **[First Input Delay (FID)](/fid/)**: measures _interactivity_. To provide a
  good user experience, pages should have a FID of **100 milliseconds** or less.
- **[Cumulative Layout Shift (CLS)](/cls/)**: measures _visual stability_. To
  provide a good user experience, pages should maintain a CLS of **0.1.** or
  less.

For each of the above metrics, to ensure you're hitting the recommended target
for most of your users, a good threshold to measure is the **75th percentile**
of page loads, segmented across mobile and desktop devices.

Tools that assess Core Web Vitals compliance should consider a page passing if
it meets the recommended targets at the 75th percentile for all of the above
three metrics.

{% Aside %}
To learn more about the research and methodology behind these recommendations,
see: [Defining the Core Web Vitals metrics
thresholds](/defining-core-web-vitals-thresholds/)
{% endAside %}

### Lifecycle

Metrics on the Core Web Vitals track go through a lifecycle consisting of three phases: experimental, pending, and stable.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/gCO4TElL05PwDZJiu3r9.svg", alt="The three lifecycle phases of Core Web Vitals metrics, visualized as a series of three chevrons. From left to right, the phases are Experimental, Pending, and Stable.", style="background-color: transparent; min-width: 100%; height: auto;", width="300", height="31" %}
</figure>

The table below reflects where all Core Web Vitals currently are in their lifecycle:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <th>
        Experimental
      </th>
      <th>
        Pending
      </th>
      <th>
        Stable
      </th>
    </thead>
    <tbody>
      <td>
        &nbsp;
      </td>
      <td style="vertical-align: top;">
        <a href="/inp/" rel="noopener">INP</a>
      </td>
      <td style="vertical-align: top;">
        <a href="/lcp/" rel="noopener">LCP</a><br>
        <a href="/cls/" rel="noopener">CLS</a><br>
        <a href="/fid/" rel="noopener">FID</a>
      </td>
    </tbody>
  </table>
</div>

Each phase is designed to signal to developers how they should think about each metric:

- **Experimental metrics** are prospective Core Web Vitals that may still be undergoing significant changes depending on testing and community feedback.
- **Pending metrics** are future Core Web Vitals that have passed the testing and feedback stage and have a well-defined timeline to becoming stable.
- **Stable metrics** are the current set of Core Web Vitals that Chrome considers essential for great user experiences.

#### Experimental

When a metric is initially developed and enters the ecosystem, it is considered an _experimental metric_.

The purpose of the experimental phase is to assess a metric's fitness, first by exploring the problem to be solved, and possibly iterate on what previous metrics may have failed to address. For example, [Interaction to Next Paint (INP)](/inp/) was initially developed as an experimental metric to address the runtime performance issues present on the web more comprehensively than [First Input Delay (FID)](/fid/).

The experimental phase of Core Web Vitals lifecycle is also intended to give flexibility in a metric's development by identifying bugs and even exploring changes to its initial definition. It's also the phase in which community feedback is most important.

#### Pending

When the Chrome team determines that an experimental metric has received sufficient feedback and proven its efficacy, it becomes a _pending metric_. Pending metrics are held in this phase for a minimum of six months to give the ecosystem time to adapt. The only remaining hurdle for a metric to advance beyond the pending phase is to wait out the transition period. Community feedback remains an important aspect of this phase, as more developers begin to use the metric.

#### Stable

When a Core Web Vital candidate metric is finalized, it becomes a _stable metric_—for metrics that are on the Core Web Vitals track, this means the metric becomes a Core Web Vital.

Stable metrics are actively supported, and may be subject to bug fixes and definition changes. Stable Core Web Vitals metrics won't change more than once per year. Any change to a Core Web Vital will be clearly communicated in the metric's official documentation, as well as in the metric's CHANGELOG. Core Web Vitals are also included in any assessments.

{% Aside 'important' %}
Metrics that are stable are not necessarily permanent. While stable metrics are long-lived, a stable metric can be retired and replaced by another metric if it addresses the problem area more effectively.
{% endAside %}

### Tools to measure and report Core Web Vitals

Google believes that the Core Web Vitals are critical to all web experiences. As
a result, it is committed to surfacing these metrics [in all of its popular
tools](/vitals-tools/). The following sections details which tools support the
Core Web Vitals.

#### Field tools to measure Core Web Vitals

The [Chrome User Experience
Report](https://developer.chrome.com/docs/crux/)
collects anonymized, real user measurement data for each Core Web Vital. This
data enables site owners to quickly assess their performance without requiring
them to manually instrument analytics on their pages, and powers tools like
[PageSpeed Insights](https://pagespeed.web.dev/),
and Search Console's [Core Web Vitals
report](https://support.google.com/webmasters/answer/9205520).

<div class="table-wrapper">
  <table>
    <tr>
      <td>&nbsp;</td>
      <td>LCP</td>
      <td>FID</td>
      <td>CLS</td>
    </tr>
    <tr>
      <td><a href="https://developer.chrome.com/docs/crux/">
        Chrome User Experience Report</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/speed/pagespeed/insights/">
        PageSpeed Insights</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://support.google.com/webmasters/answer/9205520">
        Search Console (Core Web Vitals report)</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
  </table>
</div>

{% Aside %}
For guidance on how to use these tools, and which tool is right for your use
case, see: [Getting started with measuring Web
Vitals](/vitals-measurement-getting-started/)
{% endAside %}

The data provided by Chrome User Experience Report offers a quick way to assess
the performance of sites, but it does not provide the detailed, per-pageview
telemetry that is often necessary to accurately diagnose, monitor, and quickly
react to regressions. As a result, we strongly recommend that sites set up their
own real-user monitoring.

#### Measure Core Web Vitals in JavaScript

Each of the Core Web Vitals can be measured in JavaScript using standard web
APIs.

{% Aside %}
Note that the Core Web Vitals measured in JavaScript using public APIs may differ from the Core Web Vitals reported by CrUX. Read [this article](/crux-and-rum-differences/) for more info.
{% endAside %}

The easiest way to measure all the Core Web Vitals is to use the
[web-vitals](https://github.com/GoogleChrome/web-vitals) JavaScript library, a
small, production-ready wrapper around the underlying web APIs that measures
each metric in a way that accurately matches how they're reported by all the
Google tools listed above.

With the [web-vitals](https://github.com/GoogleChrome/web-vitals) library,
measuring each metric is as simple as calling a single function (see the
documentation for complete
[usage](https://github.com/GoogleChrome/web-vitals#usage) and
[API](https://github.com/GoogleChrome/web-vitals#api) details):

```js
import {onCLS, onFID, onLCP} from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
    fetch('/analytics', {body, method: 'POST', keepalive: true});
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
```

Once you've configured your site to use the
[web-vitals](https://github.com/GoogleChrome/web-vitals) library to measure and
send your Core Web Vitals data to an analytics endpoint, the next step is to
aggregate and report on that data to see if your pages are meeting the
recommended thresholds for at least 75% of page visits.

While some analytics providers have built-in support for Core Web Vitals
metrics, even those that don't should include basic custom metric features that
allow you to measure Core Web Vitals in their tool.

One example of this is the [Web Vitals
Report](https://github.com/GoogleChromeLabs/web-vitals-report), which allows
site owners to measure their Core Web Vitals using Google Analytics. For
guidance on measuring Core Web Vitals using other analytics tools, see [Best
practices for measuring Web Vitals in the
field](/vitals-field-measurement-best-practices/).

You can also report on each of the Core Web Vitals without writing any code
using the [Web Vitals Chrome
Extension](https://github.com/GoogleChrome/web-vitals-extension). This extension
uses the [web-vitals](https://github.com/GoogleChrome/web-vitals) library to
measure each of these metrics and display them to users as they browse the web.

This extension can be helpful in understanding the performance of your own
sites, your competitor's sites, and the web at large.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>LCP</th>
        <th>FID</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/GoogleChrome/web-vitals">web-vitals</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://github.com/GoogleChrome/web-vitals-extension">
          Web Vitals Extension</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

Alternatively, developers who prefer to measure these metrics directly via the
underlying web APIs can refer to these metric guides for implementation details:

- [Measure LCP in JavaScript](/lcp/#measure-lcp-in-javascript)
- [Measure FID in JavaScript](/fid/#measure-fid-in-javascript)
- [Measure CLS in JavaScript](/cls/#measure-cls-in-javascript)

{% Aside %}
For additional guidance on how to measure these metrics using popular
analytics services (or your own in-house analytics tools), see: [Best
practices for measuring Web Vitals in the
field](/vitals-field-measurement-best-practices/)
{% endAside %}

#### Lab tools to measure Core Web Vitals

While all of the Core Web Vitals are, first and foremost, field metrics, many of
them are also measurable in the lab.

Lab measurement is the best way to test the performance of features during
development—before they've been released to users. It's also the best way to
catch performance regressions before they happen.

The following tools can be used to measure the Core Web Vitals in a lab
environment:

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>LCP</th>
        <th>FID</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://developer.chrome.com/docs/devtools/">
          Chrome DevTools</a></td>
        <td>✔</td>
        <td>✘ (use <a href="/tbt/">TBT</a> instead)</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://developer.chrome.com/docs/lighthouse/overview/">
          Lighthouse</a></td>
        <td>✔</td>
        <td>✘ (use <a href="/tbt/">TBT</a> instead)</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}
Tools like Lighthouse that load pages in a simulated environment without a
user cannot measure FID (there is no user input). However, the Total Blocking
Time (TBT) metric is lab-measurable and is an excellent proxy for FID.
Performance optimizations that improve TBT in the lab should improve FID in
the field (see performance recommendations below).
{% endAside %}

While lab measurement is an essential part of delivering great experiences, it
is not a substitute for field measurement.

The performance of a site can vary dramatically based on a user's device
capabilities, their network conditions, what other processes may be running on
the device, and how they're interacting with the page. In fact, each of the Core
Web Vitals metrics can have its score affected by user interaction. Only field
measurement can accurately capture the complete picture.

### Recommendations for improving your scores

Once you've measured the Core Web Vitals and identified areas for improvement,
the next step is to optimize. The following guides offer specific
recommendations for how to optimize your pages for each of the Core Web Vitals:

- [Optimize LCP](/optimize-lcp/)
- [Optimize FID](/optimize-fid/)
- [Optimize CLS](/optimize-cls/)

## Other Web Vitals

While the Core Web Vitals are the critical metrics for understanding and
delivering a great user experience, there are other vital metrics as well.

These other Web Vitals often serve as proxy or supplemental metrics for the Core
Web Vitals, to help capture a larger part of the experience or to aid in
diagnosing a specific issue.

For example, the metrics [Time to First Byte (TTFB)](/ttfb/) and
[First Contentful Paint (FCP)](/fcp/) are both vital aspects of the _loading_
experience, and are both useful in diagnosing issues with LCP (slow [server
response times](/overloaded-server/) or [render-blocking
resources](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources/), respectively).

Similarly, metrics like [Total Blocking Time (TBT)](/tbt/) and [Time to
Interactive (TTI)](/tti/) are lab metrics that are vital in catching and
diagnosing potential _interactivity_ issues that will impact FID. However, they
are not part of the Core Web Vitals set because they are not field-measurable,
nor do they reflect a
[user-centric](/user-centric-performance-metrics/#how-metrics-are-measured)
outcome.

## Evolving Web Vitals

Web Vitals and Core Web Vitals represent the best available signals developers
have today to measure quality of experience across the web, but these signals
are not perfect and future improvements or additions should be expected.

The **Core Web Vitals** are relevant to all web pages and featured across
relevant Google tools. Changes to these metrics will have wide-reaching impact;
as such, developers should expect the definitions and thresholds of the Core Web
Vitals to be stable, and updates to have prior notice and a predictable, annual
cadence.

The other Web Vitals are often context or tool specific, and may be more
experimental than the Core Web Vitals. As such, their definitions and thresholds
may change with greater frequency.

For all Web Vitals, changes will be clearly documented in this public
[CHANGELOG](http://bit.ly/chrome-speed-metrics-changelog).
