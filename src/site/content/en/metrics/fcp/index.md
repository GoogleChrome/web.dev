---
layout: post
title: First Contentful Paint (FCP)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-04-30
description: |
  This post introduces the First Contentful Paint (FCP) metric and explains
  how to measure it
tags:
  - performance
  - metrics
---

{% Aside %}
  First Contentful Paint (FCP) is an important, user-centric metric for
  measuring [perceived load
  speed](/user-centric-performance-metrics/#types-of-metrics) because it marks
  the first point in the page load timeline where the user can see anything on
  the screen&mdash;a fast FCP helps reassure the user that something is
  [happening](/user-centric-performance-metrics/#questions).
{% endAside %}

## What is FCP?

The First Contentful Paint (FCP) metric measures the time from when the page
starts loading to when any part of the page's content is rendered on the screen.
For this metric, "content" refers to text, images (including background images),
`<svg>` elements, or non-white `<canvas>` elements.

[![FCP timeline from google.com](fcp-filmstrip.png)](fcp-filmstrip.png)

In the above load timeline, FCP happens in the second
frame, as that's when the first text and image elements are rendered to the
screen.

You'll notice that though some of the content has rendered, not all of it has
rendered. This is an important distinction to make between _First_ Contentful
Paint (FCP) and _[Largest Contentful Paint (LCP)](/lcp/)_
&mdash;which aims to measure when the page's main contents have finished
loading.

## How to measure FCP

FCP can be measured [in the lab](/user-centric-performance-metrics/#in-the-lab)
or [in the field](/user-centric-performance-metrics/#in-the-field), and it's
available in the following tools:

### Field tools

- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
- [Chrome User Experience
  Report](https://developers.google.com/web/tools/chrome-user-experience-report)
- [Search Console (Speed
  Report)](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html)
- [Firebase Performance
  Monitoring](https://firebase.google.com/docs/perf-mon/get-started-web) (beta)

### Lab tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/)
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)

### Measure FCP in JavaScript

The easiest way to measure FCP (as well as all Web Vitals [field
metrics]((/metrics/#in-the-field))) is with the [`web-vitals` JavaScript
library](https://github.com/GoogleChrome/web-vitals), which wraps all the
complexity of manually measuring FCP into a single function:

```js
import {getFCP} from 'web-vitals';

// Measure and log the current FCP value,
// any time it's ready to be reported.
getFCP(console.log);
```

To manually measure FCP, you can use the [Paint Timing
API](https://w3c.github.io/paint-timing/). The following example shows how to
create a
[`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
that listens for paint timing entries and logs the start time of the
`first-contentful-paint` entry to the console:

{% set entryType = 'paint' %}
{% set entryCallback = 'onPaintEntry' %}

```js
{% include 'content/metrics/first-hidden-time.njk' %}
{% include 'content/metrics/send-to-analytics.njk' %}
{% include 'content/metrics/performance-observer-try.njk' %}
  function onPaintEntry(entry) {
    // Only report FCP if the page wasn't hidden prior to
    // the entry being dispatched. This typically happens when a
    // page is loaded in a background tab.
    if (entry.name === 'first-contentful-paint' &&
        entry.startTime < firstHiddenTime) {
      // Report the FCP value to an analytics endpoint.
      sendToAnalytics({fcp: entry.startTime});
    }
  }

{% include 'content/metrics/performance-observer-init.njk' %}
{% include 'content/metrics/performance-observer-catch.njk' %}
```

## What is a good FCP score?

To provide a good user experience, sites should strive to have First Contentful
Paint occur within **1 second** of the page starting to load. To ensure you're
hitting this target for most of your users, a good threshold to measure is the
**75th percentile** of page loads, segmented across mobile and desktop devices.

## How to improve FCP

To learn how to improve FCP for a specific site, you can run a Lighthouse
performance audit and pay attention to any specific
[opportunities](/lighthouse-performance/#opportunities) or
[diagnostics](/lighthouse-performance/#diagnostics) the audit suggests.

To learn how to improve FCP in general (for any site), refer to the following
performance guides:

- [Eliminate render-blocking resources](/render-blocking-resources/)
- [Minify CSS](/unminified-css/)
- [Remove unused CSS](/unused-css-rules/)
- [Preconnect to required origins](/uses-rel-preconnect/)
- [Reduce server response times (TTFB)](/time-to-first-byte/)
- [Avoid multiple page redirects](/redirects/)
- [Preload key requests](/uses-rel-preload/)
- [Avoid enormous network payloads](/total-byte-weight/)
- [Serve static assets with an efficient cache policy](/uses-long-cache-ttl/)
- [Avoid an excessive DOM size](/dom-size/)
- [Minimize critical request depth](/critical-request-chains/)
- [Ensure text remains visible during webfont load](/font-display/)
- [Keep request counts low and transfer sizes small](/resource-summary/)

{% include 'content/metrics/metrics-changelog.njk' %}
