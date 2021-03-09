---
layout: post
title: First Contentful Paint (FCP)
authors:
  - philipwalton
date: 2019-11-07
updated: 2021-01-18
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

{% Img src="image/admin/3UhlOxRc0j8Vc4DGd4dt.png", alt="FCP timeline from google.com", width="800", height="311", linkTo=true %}

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
- [`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals)

### Lab tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/)
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)

### Measure FCP in JavaScript

To measure FCP in JavaScript, you can use the [Paint Timing
API](https://w3c.github.io/paint-timing/). The following example shows how to
create a
[`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
that listens for a `paint` entry with the name `first-contentful-paint` and logs
it to the console.

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
    console.log('FCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'paint', buffered: true});
```

{% Aside 'warning' %}

  This code shows how to log the `first-contentful-paint` entry to the console,
  but measuring FCP in JavaScript is more complicated. See below for details:

{% endAside %}

In the above example, the logged `first-contentful-paint` entry will tell you
when the first contentful element was painted. However, in some cases this entry
is not valid for measuring FCP.

The following section lists the differences between what the API reports and how
the metric is calculated.

#### Differences between the metric and the API

- The API will dispatch a `first-contentful-paint` entry for pages loaded in a
  background tab, but those pages should be ignored when calculating FCP (first
  paint timings should only be considered if the page was in the foreground the
  entire time).
- The API does not report `first-contentful-paint` entries when the page is
  restored from the [back/forward cache](/bfcache/#impact-on-core-web-vitals),
  but FCP should be measured in these cases since users experience them as
  distinct page visits.
- The API [may not report paint timings from cross-origin
  iframes](https://w3c.github.io/paint-timing/#:~:text=cross-origin%20iframes),
  but to properly measure FCP you should consider all frames. Sub-frames can use
  the API to report their paint timings to the parent frame for aggregation.

Rather than memorizing all these subtle differences, developers can use the
[`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals) to
measure FCP, which handles these differences for you (where possible):

```js
import {getFCP} from 'web-vitals';

// Measure and log FCP as soon as it's available.
getFCP(console.log);
```

You can refer to [the source code for
`getFCP()`](https://github.com/GoogleChrome/web-vitals/blob/master/src/getFCP.ts)
for a complete example of how to measure FCP in JavaScript.

{% Aside %}
  In some cases (such as cross-origin iframes) it's not possible to measure FCP
  in JavaScript. See the
  [limitations](https://github.com/GoogleChrome/web-vitals#limitations) section
  of the `web-vitals` library for details.
{% endAside %}

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
