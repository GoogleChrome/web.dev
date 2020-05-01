---
layout: page
title: Web Vitals
description: Essential metrics for a healthy site
date: 2020-04-30
updated: 2020-05-01
masthead: web-vitals.svg
---

Optimizing for quality of user experience is key to the long-term success of any
site on the web. Whether you're a business owner, marketer, or developer, Web
Vitals can help you quantify the experience of your site and identify
opportunities to improve.

## Overview

Web Vitals is an initiative by Google to provide unified guidance for quality
signals that are essential to delivering a great user experience on the web.

Google has provided a number of tools over the years
([Lighthouse](https://developers.google.com/web/tools/lighthouse), [Chrome
DevTools](https://developers.google.com/web/tools/chrome-devtools), [PageSpeed
Insights](https://developers.google.com/speed/pagespeed/insights/), [Search
Console's Speed
Report](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html))
to measure and report on performance. Some developers are experts at using these
tools, while others have found the abundance of both tools and metrics
challenging to keep up with.

Site owners should not have to be performance gurus in order to understand the
quality of experience they are delivering to their users. The Web Vitals
initiative aims to simplify the landscape, and help sites focus on the metrics
that matter most, the **Core Web Vitals**.

## Core Web Vitals

Core Web Vitals are the subset of Web Vitals that apply to all web pages, should
be measured by all site owners, and surfaced across all Google tools. Each of
the Core Web Vitals represents a distinct facet of the user experience, is
measurable [in the
field](https://web.dev/user-centric-performance-metrics/#how-metrics-are-measured),
and reflects the real-world experience of a critical
[user-centric](https://web.dev/user-centric-performance-metrics/#how-metrics-are-measured)
outcome.

The metrics that make up Core Web Vitals will [evolve](#evolving-web-vitals)
over time. The current set for 2020 focuses on three aspects of the user
experience—_loading_, _interactivity_, and _visual stability_—and includes the
following metrics (and their respective thresholds):

<div class="w-stack w-stack--center w-stack--md">
  <img src="lcp_ux.svg" width="400px" height="350px"
       alt="Largest Contentful Paint threshold recommendations">
  <img src="fid_ux.svg" width="400px" height="350px"
       alt="First Input Delay threshold recommendations">
  <img src="cls_ux.svg" width="400px" height="350px"
       alt="Cumulative Layout Shift threshold recommendations">
</div>

- **[Largest Contentful Paint (LCP)](https://web.dev/lcp/)**: measures _loading_
  performance. To provide a good user experience, LCP should occur within **2.5
  seconds** of when the page first starts loading.
- **[First Input Delay (FID)](https://web.dev/fid/)**: measures _interactivity_.
  To provide a good user experience, pages should have a FID of less than **100
  milliseconds**.
- **[Cumulative Layout Shift (CLS)](https://web.dev/cls/)**: measures _visual
  stability_. To provide a good user experience, pages should maintain a CLS of
  less than **0.1.**

For each of the above metrics, to ensure you're hitting the recommended target
for most of your users, a good threshold to measure is the **75th percentile**
of page loads, segmented across mobile and desktop devices.

### Tools to measure and report Core Web Vitals

Google believes that the Core Web Vitals are critical to all web experiences. As
a result, it is committed to surfacing these metrics in its tools. The following
sections details which tools support the Core Web Vitals.

#### Field tools to measure Core Web Vitals

The [Chrome User Experience
Report](https://developers.google.com/web/tools/chrome-user-experience-report)
collects anonymized, real user measurement data for each Core Web Vital. This
data enables site owners to quickly assess their performance without requiring
them to manually instrument analytics on their pages, and powers tools like
[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/),
and [Search Console's Speed
Report](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html).

<table class="w-table-wrapper">
  <tr>
    <td>&nbsp;</td>
    <td>LCP</td>
    <td>FID</td>
    <td>CLS</td>
  </tr>
  <tr>
    <td><a href="https://developers.google.com/web/tools/chrome-user-experience-report">
      Chrome User Experience Report</a></td>
    <td>✔</td>
    <td>✔</td>
    <td>✔</td>
  </tr>
  <tr>
    <td><a href="https://developers.google.com/speed/pagespeed/insights/">
      PageSpeed Insights</a></td>
    <td>(soon)</td>
    <td>✔</td>
    <td>(soon)</td>
  </tr>
  <tr>
    <td><a href="https://webmasters.googleblog.com/2019/11/search-console-speed-report.html">
      Search Console (Speed Report)</a></td>
    <td>(soon)</td>
    <td>✔</td>
    <td>(soon)</td>
  </tr>
</table>

The data provided by Chrome User Experience Report offers a quick way to assess
the performance of sites, but it does not provide the detailed, per-pageview
telemetry that is often necessary to accurately diagnose, monitor, and quickly
react to regressions. As a result, we strongly recommend that all sites set up
their own real-user monitoring.

#### Measure Core Web Vitals in JavaScript

Each of the Core Web Vital can be measured in JavaScript using standard web
APIs.

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
// Example of using web-vitals to measure & report CLS, FID, and LCP.
import {getCLS, getFID, getLCP} from 'web-vitals';

function reportToAnalytics(data) {
  const body = JSON.stringify(data);
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
      fetch('/analytics', {body, method: 'POST', keepalive: true});
}

getCLS((metric) => reportToAnalytics({cls: metric.value}));
getFID((metric) => reportToAnalytics({fid: metric.value}));
getLCP((metric) => reportToAnalytics({lcp: metric.value}));
```

You can also report on each of the Core Web Vitals without writing any code
using the [Web Vitals Chrome
Extension](https://github.com/GoogleChrome/web-vitals-extension). This extension
uses the [web-vitals](https://github.com/GoogleChrome/web-vitals) library to
measure each of these metrics and display them to users as they browse the web.

This extension can be helpful in understanding the performance of your own
sites, your competitor's sites, and the web at large.

<table class="w-table-wrapper">
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

Alternatively, developers who prefer to measure these metrics directly via the
underlying web APIs can refer to these metric guides for implementation details:

- [Measure LCP in JavaScript](https://web.dev/lcp/#measure-lcp-in-javascript)
- [Measure FID in JavaScript](https://web.dev/fid/#measure-fid-in-javascript)
- [Measure CLS in JavaScript](https://web.dev/cls/#measure-cls-in-javascript)

#### Lab tools to measure Core Web Vitals

While all of the Core Web Vitals are, first and foremost, field metrics, many of
them are also measurable in the lab.

Lab measurement is the best way to test the performance of features during
development—before they've been released to users. It's also the best way to
catch performance regressions before they happen.

The following tools can be used to measure the Core Web Vitals in a lab
environment:

<table class="w-table-wrapper">
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
      <td><a href="https://developers.google.com/web/tools/chrome-devtools">
        Chrome DevTools</a></td>
      <td>✔</td>
      <td>✘ (use <a href="/tbt/">TBT</a> instead)</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/web/tools/lighthouse">
        Lighthouse</a></td>
      <td>✔ (v6)</td>
      <td>✘ (use <a href="/tbt/">TBT</a> instead)</td>
      <td>✔ (v6)</td>
    </tr>
  </tbody>
</table>

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
the next step is to optimize. The following guides go into great details on
specific ways to optimize your site for each of the Core Web Vitals:

- [How to improve LCP](https://web.dev/lcp/#how-to-improve-lcp)
- [How to improve FID](https://web.dev/fid/#how-to-improve-fid)
- [How to improve CLS](https://web.dev/cls/#how-to-improve-cls)

## Other Web Vitals

While the Core Web Vitals are the critical metrics for understanding and
delivering a great user experience, there are other vital metrics as well.

These other Web Vitals often serve as proxy or supplemental metrics for the Core
Web Vitals, to help capture a larger part of the experience or to aid in
diagnosing a specific issue.

For example, the metrics [Time to First Byte
(TTFB)](https://web.dev/time-to-first-byte/) and [First Contentful Paint
(FCP)](https://web.dev/fcp/) are both vital aspects of the _loading_ experience,
and are both useful in diagnosing issues with LCP (slow [server response
times](https://web.dev/overloaded-server/) or [render-blocking
resources](https://web.dev/render-blocking-resources/), respectively).

Similarly, metrics like [Total Blocking Time (TBT)](https://web.dev/tbt/) and
[Time to Interactive (TTI)](https://web.dev/tti/) are lab metrics that are vital
in catching and diagnosing potential _interactivity_ issues that will impact
FID. However, they are not part of the Core Web Vitals set because they are not
field-measurable, nor do they reflect a
[user-centric](https://web.dev/user-centric-performance-metrics/#how-metrics-are-measured)
outcome.

## Evolving Web Vitals

Web Vitals and Core Web Vitals represent the best available signals developers
have today to measure quality of experience across the web, but these signals
are not perfect and future improvements or additions should be expected.

The **Core Web Vitals** are relevant to all web pages  and featured across
relevant Google tools. Changes to these metrics will have wide-reaching impact;
as such, developers should expect the definitions and thresholds of the Core Web
Vitals to be stable, and updates to have prior notice and a predictable, annual
cadence.

The other Web Vitals are often context or tool specific, and may be more
experimental than the Core Web Vitals. As such, their definitions and thresholds
may change with greater frequency.

For all Web Vitals, changes will be clearly documented in this public
[CHANGELOG](http://bit.ly/chrome-speed-metrics-changelog).
