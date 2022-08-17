---
layout: post
title: Time to First Byte (TTFB)
authors:
  - jlwagner
  - tunetheweb
date: 2021-10-26
updated: 2022-07-26
description: |
  This post introduces the Time to First Byte (TTFB) metric and explains
  how to measure it.
tags:
  - performance
  - metrics
  - web-vitals
---

{% Aside %}
Time to First Byte (TTFB) is a foundational metric for measuring connection setup time and web server responsiveness in both the lab and the field. It helps identify when a web server is too slow to respond to requests. In the case of navigation requests&mdash;that is, requests for an HTML document&mdash;it precedes every other meaningful loading performance metric.
{% endAside %}

## What is TTFB?

TTFB is a metric that measures the time between the request for a resource and when the first byte of a response begins to arrive.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ccT8ltSPrTri3tz7AA3h.png", alt="A diagram of network request timings. The phases from left to right are Redirect (which overlaps with Prompt for Unload), Cache, DNS, TCP, Request, Response, Processing, and Load. The associated timings are redirectStart and redirectEnd (which overlap with the Prompt for Unload's unloadEventStart and unloadEventEnd), fetchStart, domainLookupStart, domainLookupEnd, connectStart, secureConnectionStart, connectEnd, requestStart, responseStart, responseEnd, domInteractive, domContentLoadedEventStart, domContentLoadedEventEnd, domComplete, loadEventStart, and loadEventEnd.", width="800", height="337" %}
  <figcaption>
    A diagram of network request phases and their associated timings. TTFB measures the elapsed time between <code>startTime</code> and <code>responseStart</code>.
  </figcaption>
</figure>

TTFB is the sum of the following request phases:

- Redirect time
- Service worker startup time (if applicable)
- DNS lookup
- Connection and TLS negotiation
- Request, up until the point at which the first byte of the response has arrived

Reducing latency in connection setup time and on the backend will contribute to a lower TTFB.

### What is a good TTFB score?

Because TTFB precedes [user-centric metrics](/user-centric-performance-metrics/) such as [First Contentful Paint (FCP)](/fcp/) and [Largest Contentful Paint (LCP)](/lcp/), it's recommended that your server responds to navigation requests quickly enough so that the **75th percentile** of users experience an [FCP within the "good" threshold](/fcp/#what-is-a-good-fcp-score). As a rough guide, most sites should strive to have Time To First Byte of **0.8 seconds** or less.

<figure>
  <picture>
    <source
      srcset="{{ "image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/ILJ1xKjzVisqOPPyHYVA.svg" | imgix }}"
      media="(min-width: 640px)"
      width="800"
      height="200">
    {%
      Img
        src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/eNXaxPi9NdUVSTDRJFkV.svg",
        alt="Good TTFB values are 0.8 seconds or less, poor values are greater than 1.8 seconds, and anything in between needs improvement",
        width="640",
        height="480"
    %}
  </picture>
</figure>

{% Aside %}
  TTFB is not a [Core Web Vitals](/vitals) metric, so it's not absolutely necessary that sites meet the "good" TTFB threshold, provided that it doesn't impede their ability to score well on the metrics that matter.
{% endAside %}

## How to measure TTFB

TTFB can be measured in [the lab](/user-centric-performance-metrics/#in-the-lab) or in [the field](/user-centric-performance-metrics/#in-the-field) in the following ways.

### Field tools

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
- [`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals)

### Lab tools

- In the [network panel](https://developer.chrome.com/docs/devtools/network/) of Chrome's DevTools
- [WebPageTest](https://www.webpagetest.org/)

### Measure TTFB in JavaScript

You can measure the TTFB of [navigation requests](https://developer.mozilla.org/docs/Web/API/Request/mode) in the browser with the [Navigation Timing API](https://developer.mozilla.org/docs/Web/API/Navigation_timing_API). The following example shows how to create a [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) that listens for a `navigation` entry and logs it to the console:

```javascript
new PerformanceObserver((entryList) => {
  const [pageNav] = entryList.getEntriesByType('navigation');

  console.log(`TTFB: ${pageNav.responseStart}`);
}).observe({
  type: 'navigation',
  buffered: true
});
```

{% Aside 'caution' %}
Not all browsers support `PerformanceObserver` or its `buffered` flag. To get the largest possible browser support, consider adopting the `web-vitals` package, which is discussed below.
{% endAside %}

The [`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals) can also measure TTFB in the browser with less complexity:

```javascript
import {getTTFB} from 'web-vitals';

// Measure and log TTFB as soon as it's available.
getTTFB(console.log);
```

### Measuring resource requests

TTFB applies to _all_ requests, not just navigation requests. In particular, resources hosted on cross-origin servers can introduce latency due to the need to set up connections to those servers. To measure TTFB for resources in the field, use the [Resource Timing API](https://developer.mozilla.org/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API) within a `PerformanceObserver`:

```javascript
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();

  for (const entry of entries) {
    // Some resources may have a responseStart value of 0, due
    // to the resource being cached, or a cross-origin resource
    // being served without a Timing-Allow-Origin header set.
    if (entry.responseStart > 0) {
      console.log(`TTFB: ${entry.responseStart}`, entry.name);
    }
  }
}).observe({
  type: 'resource',
  buffered: true
});
```

The above code snippet is similar to the one used to measure the TTFB for a navigation request, except instead of querying for `'navigation'` entries, you query for `'resource'` entries instead. It also accounts for the fact that some resources loaded from the primary origin may return a value of `0`, since the connection is already open, or a resource is instantaneously retrieved from a cache.

{% Aside 'gotchas' %}
TTFB for cross-origin requests will not be measurable in the field if cross-origin servers fail to set a [`Timing-Allow-Origin` header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin).
{% endAside %}

## How to improve TTFB

Improving TTFB is largely dependent on your hosting provider and backend application stack. High TTFB values could be due to one or more of the following problems:

- Hosting services with inadequate infrastructure to handle high traffic loads
- Web servers with insufficient memory that can lead to [thrashing](https://en.wikipedia.org/wiki/Memory_paging#Thrashing)
- Unoptimized database tables
- Suboptimal database server configuration

Minimizing TTFB is often done by choosing a suitable hosting provider with infrastructure to ensure high uptime and responsiveness. This&mdash;in combination with a CDN&mdash;can help.

{% Aside %}
Use the [Server-Timing API](https://developer.mozilla.org/docs/Web/HTTP/Headers/Server-Timing) to gather additional field data on the performance of application backend processes. This can help identify opportunities for improvements that might otherwise go unnoticed.
{% endAside %}

Other opportunities to improve high TTFB times and related perceptual delays include:

- [Avoid multiple page redirects](/redirects/).
- [Preconnect to required origins](/uses-rel-preconnect/) for cross-origin resources.
- Submit your origin to the [HSTS preload list](https://hstspreload.org/) to eliminate HTTP-to-HTTPS redirect latency.
- [Use HTTP/2](/uses-http2/) or [HTTP/3](https://en.wikipedia.org/wiki/HTTP/3).
- Consider [predictive prefetching](/predictive-prefetching/) for fast page navigations for users who have not specified [a preference for reduced data usage](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-data).
- Use server-side generation (SSG) for markup instead of SSR where possible and appropriate.
