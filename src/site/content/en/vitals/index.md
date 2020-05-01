---
layout: page
title: Web Vitals
description: Essential metrics for a healthy site
date: 2020-04-30
updated: 2020-04-30
masthead: web-vitals.svg
---

Optimizing for quality of user experience is key to the long-term success of any
site on the web. Whether you're a business owner, marketer, or developer, Web
Vitals can help you quantify the experience of your site and identify
opportunities to improve.

## Overview

Web Vitals is an initiative by Google to provide unified guidance for quality
signals that, we believe, are essential to delivering a great user experience on
the web.

Google has provided a number of tools over the years
([Lighthouse](https://developers.google.com/web/tools/lighthouse), [Chrome
DevTools](https://developers.google.com/web/tools/chrome-devtools), [PageSpeed
Insights](https://developers.google.com/speed/pagespeed/insights/), [Search
Console Speed
Report](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html))
to measure and report on performance. Some developers are experts at using these
tools, while others have found the abundance of both tools and metrics
challenging to keep up with.

Site owners should not have to be performance gurus in order to understand the
quality of experience they are delivering to their users. The Web Vitals
initiative aims to simplify the landscape, and help sites focus on the metrics
that matter most.

Developers who want to go deep can dive into the full set of web vitals ([see
below](#other-web-vitals)), while those who want to keep it simple can focus on
the **Core Web Vitals**.

## Core Web Vitals

Core Web Vitals are the subset of Web Vitals that are relevant to all web pages,
will be surfaced in all Google tools, and every site should measure.  Each of
the Core Web Vitals represents a distinct facet of the user experience, is
measurable [in the
field](/user-centric-performance-metrics/#how-metrics-are-measured),
and reflects the real-world experience of a critical
[user-centric](/user-centric-performance-metrics/#how-metrics-are-measured)
outcome.

Core Web Vitals measure three aspects of the user experience—_loading_,
_interactivity_, and _visual stability_—and includes the following metrics (and
their respective thresholds):

<div class="w-stack w-stack--center w-stack--md">
  <img src="lcp_ux.svg" width="400px" height="350px"
       alt="Largest Contentful Paint threshold recommendations">
  <img src="fid_ux.svg" width="400px" height="350px"
       alt="First Input Delay threshold recommendations">
  <img src="cls_ux.svg" width="400px" height="350px"
       alt="Cumulative Layout Shift threshold recommendations">
</div>

* **[Largest Contentful Paint (LCP)](/lcp/):** measures _loading_ performance.
  To provide a good user experience, LCP should occur within **2.5 seconds** of
  when the page first starts loading.
* **[First Input Delay (FID)](/fid/):** measures _interactivity_. To provide a
  good user experience, pages should have a FID of less than **100
  milliseconds**.
* **[Cumulative Layout Shift (CLS)](/cls/):** measures _visual stability_. To
  provide a good user experience, pages should maintain a CLS of less than
  **0.1.**

For each of the above metrics, to ensure you're hitting the recommended target
for most of your users, a good threshold to measure is the **75th percentile**
of page loads, segmented across mobile and desktop devices.

### Tools to measure and report Core Web Vitals

Google believes that the Core Web Vitals are critical to all web experiences. As
a result, it is committed to surfacing these metrics in its tools. The following
sections details which tools support the Core Web Vitals.

#### Field tools to measure Core Web Vitals

Chrome users who have [usage-statistic
reporting](https://www.google.com/chrome/privacy/whitepaper.html#usagestats)
enabled will automatically send performance reports to Google, and that data is
made available publicly, anonymously, and in aggregate, through tools like
[Chrome User Experience
Report](https://developers.google.com/web/tools/chrome-user-experience-report),
[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/),
and [Search Console's Speed
Report](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html)'.

This data gives website owners insight into how real-world Chrome users
experience their site and the web at large. And it does so without requiring
them to manually instrument analytics on their pages.

<table class="w-table-wrapper">
  <tr>
    <td><strong>Tool</strong></td>
    <td><strong><a href="/lcp/">LCP</a></strong></td>
    <td><strong><a href="/fid/">FID</a></strong></td>
    <td><strong><a href="/cls/">CLS</a></strong></td>
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


While this data provides valuable insight into how real users experience the
web, it is not real-time and thus not recommended for diagnosing performance
issues.

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

You can also measure each of the Core Web Vitals without writing any code using
the [Web Vitals
Extension](https://github.com/GoogleChrome/web-vitals-extension). This extension
uses the [web-vitals](https://github.com/GoogleChrome/web-vitals) library to
measure each of these metrics and display them to users as they browse the web.

This can be helpful for measuring both the performance of your own sites, as
well as those of your competitors.

<table class="w-table-wrapper">
  <thead>
    <tr>
      <th>Tool</th>
      <th><a href="/lcp/">LCP</a></th>
      <th><a href="/fid/">FID</a></th>
      <th><a href="/cls/">CLS</a></th>
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

* [Measure LCP in JavaScript](/lcp/#measure-lcp-in-javascript)
* [Measure FID in JavaScript](/fid/#measure-fid-in-javascript)
* [Measure CLS in JavaScript](/cls/#measure-cls-in-javascript)

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
      <th>Tool</th>
      <th><a href="/lcp/">LCP</a></th>
      <th><a href="/fid/">FID</a></th>
      <th><a href="/cls/">CLS</a></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://developers.google.com/web/tools/chrome-devtools">
        Chrome DevTools</a></td>
      <td>✔</td>
      <td>✘</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/web/tools/lighthouse">
        Lighthouse</a></td>
      <td>✔ (v6)</td>
      <td>✘ (use <a href="/tbt/">TBT</a> instead)</td>
      <td>✔ (v6)</td>
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
capabilities, their network conditions, what extensions they're running, and how
they're interacting with the page. In fact, each of the Core Web Vitals metrics
can have its score affected by user interaction. Only field measurement can
accurately capture the complete picture.

### Recommendations for improving your scores

Once you've measured the Core Web Vitals and identified any areas for
improvement, the next step is to optimize. The following guides go into great
details on specific ways to optimize your site for each of the Core Web Vitals:

* [How to improve LCP](/lcp/#how-to-improve-lcp)
* [How to improve FID](/fid/#how-to-improve-fid)
* [How to improve CLS](/cls/#how-to-improve-cls)

## Other Web Vitals

While the Core Web Vitals are the most critical metrics in understanding and
delivering a great user experience, there are other vital metrics as well.

These other Web Vitals often serve as proxy or supplemental metrics for the Core
Web Vitals, to help capture a larger part of the experience or to aid in
diagnosing a specific issue.

For example, the metrics [Time to First Byte (TTFB)](/time-to-first-byte/) and
[First Contentful Paint (FCP)](/fcp/) are both vital aspects of the _loading_
experience, and are both useful in diagnosing issues with LCP (slow [server
response times](/overloaded-server/) or [render-blocking
resources](/render-blocking-resources/), respectively).

Similarly, metrics like [Total Blocking Time (TBT)](/tbt/) and [Time to
Interactive (TTI)](/tti/) are lab metrics that are vital in catching and
diagnosing potential _interactivity_ issues that will impact FID. However, they
are not part of the Core Web Vitals set because they are not field-measurable,
nor do they reflect a
[user-centric](/user-centric-performance-metrics/#how-metrics-are-measured)
outcome.

Finally, some metrics may eventually become part of the Core Web Vitals, but
more work is needed in order to standardize their underlying Web APIs or surface
them in Google tools.

The following sections outlines the current set of other Web Vitals (both lab
and field), along with the tools available to measure them: \

### Field vitals

<table class="w-table-wrapper">
  <thead>
    <tr>
      <th>Tool</th>
      <th><a href="/time-to-first-byte/">TTFB</a></th>
      <th><a href="/fcp/">FCP</a></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://github.com/GoogleChrome/web-vitals">web-vitals</a></td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/web/tools/chrome-user-experience-report">
        Chrome User Experience Report</a></td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/speed/pagespeed/insights/">
        PageSpeed Insights</a></td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://webmasters.googleblog.com/2019/11/search-console-speed-report.html">
        Search Console Speed Report</a></td>
      <td>✘</td>
      <td>✔</td>
    </tr>
  </tbody>
</table>

### Lab vitals

<table class="w-table-wrapper">
  <thead>
    <tr>
      <th>Tool</th>
      <th><a href="/time-to-first-byte/">TTFB</a></th>
      <th><a href="/fcp/">FCP</a></th>
      <th><a href="/speed-index/">SI</a></th>
      <th><a href="/tbt/">TBT</a></th>
      <th><a href="/tti/">TTI</a></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://developers.google.com/web/tools/chrome-devtools">
        Chrome DevTools</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✘</td>
      <td>✘</td>
      <td>✘</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/speed/pagespeed/insights/">
        PageSpeed Insights</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
      <td>(soon)</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/web/tools/lighthouse">
        Lighthouse</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
      <td>✔(beta)</td>
      <td>✔</td>
    </tr>
  </tbody>
</table>

## Evolving Web Vitals

Web Vitals and Core Web Vitals represent the best available signals developers
have today to measure quality of experience across the web, but these signals
are not perfect and future improvements or additions should be expected.

The **Core Web Vitals** are relevant to all web pages  and shared across all
performance tools at Google, and changes to these metrics will have
wide-reaching impact. As such, developers should expect the definitions and
thresholds of the Core Web Vitals to be stable, and updates to have prior notice
and a predictable, annual cadence.

The other Web Vitals are often context or tool specific, and may be more
experimental than the Core Web Vitals. As such, their definitions and thresholds
may change with greater frequency.

For all Web Vitals, changes will be clearly documented in this public
[CHANGELOG](http://bit.ly/chrome-speed-metrics-changelog).
