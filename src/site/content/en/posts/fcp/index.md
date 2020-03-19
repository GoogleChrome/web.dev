---
layout: post
title: First Contentful Paint (FCP)
authors:
  - philipwalton
date: 2019-11-07
updated: 2019-11-07
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
Paint (FCP) and _[Largest Contentful Paint (LCP)](/largest-contentful-paint/)_
&mdash;which aims to measure when the page's main contents have finished
loading.

## How to measure FCP

FCP can be measured [in the lab](/user-centric-performance-metrics/#in-the-lab) or [in the
field](/user-centric-performance-metrics/#in-the-field), and it's available in the following
tools:

### Lab tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- [WebPageTest](https://www.webpagetest.org/)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/)
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)

### Field tools

- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
- [Chrome User Experience
  Report](https://developers.google.com/web/tools/chrome-user-experience-report)
- [Firebase Performance
  Monitoring](https://firebase.google.com/docs/perf-mon/get-started-web) (beta)

### Measure FCP in JavaScript

You can measure FCP in JavaScript using the [Paint Timing
API](https://w3c.github.io/paint-timing/). The following example shows how to
create a
[`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
that listens for paint timing entries and logs the start time of the
`first-contentful-paint` entry to the console:

```js
// Create the Performance Observer instance.
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntriesByName('first-contentful-paint')) {
    // Log the value of FCP to the console.
    console.log('FCP:', entry.startTime);
    observer.disconnect();
  }
});

// Start observing paint entry types.
observer.observe({
  type: 'paint',
  buffered: true,
});
```

Note, in your own code, you'd likely replace the `console.log()` with code that
sends the FCP value to your analytics service.

## What is a good FCP?

[RAIL](https://developers.google.com/web/fundamentals/performance/rail)
guidelines suggest that after 1000 milliseconds (ms), users may lose focus if
nothing happens after performing a task. Since FCP is the first indication users
have that something is happening, it's best if the majority of page loads report
FCP is less than a second (1000 ms).

**For field measurement:** Page Speed Insights will
[report](https://developers.google.com/speed/docs/insights/v5/about#distribution)
FCP as "fast" for values 1 second or less, "moderate" for values between 1 and 3
seconds, and "slow" for any values above 3 seconds.

**For lab measurement:** Lighthouse will give a perfect score (100) to an FCP
value 1 second or less, and the score will go down as FCP gets slower. Refer to
the [Lighthouse scoring
guide](https://developers.google.com/web/tools/lighthouse/v3/scoring#perf) for
more details.

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
