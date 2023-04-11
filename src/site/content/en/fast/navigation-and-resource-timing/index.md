---
layout: post
title: Assessing loading performance in the field with Navigation Timing and Resource Timing
subhead: Learn the basics of using the Navigation and Resource Timing APIs to assess loading performance in the field.
description: Learn the basics of using the Navigation and Resource Timing APIs to assess loading performance in the field.
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/MUBswEscMLnKkCODccWz.jpg
alt: A photo of a fallow field in late fall, with many hay bales strewn about.
authors:
  - jlwagner
tags:
  - performance
  - javascript
  - metrics
  - network
  - blog
date: 2021-10-08
updated: 2023-02-20
---

If you've used connection throttling in the network panel in a browser's developer tools (or [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) in Chrome) to assess loading performance, you know how convenient those tools are for performance tuning. You can quickly measure the impact of performance optimizations with a consistent and stable baseline connection speed. The only problem is that this is synthetic testing, which yields [lab data](/lab-and-field-data-differences/#lab-data), not [field data](/lab-and-field-data-differences/#field-data).

Synthetic testing isn't inherently _bad_, but it's not representative of how fast your website is loading for real users. That requires field data, which you can collect from the Navigation Timing and Resource Timing APIs.

## APIs to help you assess loading performance in the field

Navigation Timing and Resource Timing are two similar APIs with significant overlap that measure two distinct things:

- [Navigation Timing](https://w3c.github.io/navigation-timing/) measures the speed of requests for HTML documents (that is, navigation requests).
- [Resource Timing](https://w3c.github.io/resource-timing/) measures the speed of requests for document-dependent resources such as CSS, JavaScript, images, and so on.

These APIs expose their data in a _performance entry buffer_, which can be accessed in the browser with JavaScript. There are multiple ways to query a performance buffer, but a common way is by using [`performance.getEntriesByType`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByType):

```javascript
// Get Navigation Timing entries:
performance.getEntriesByType('navigation');

// Get Resource Timing entries:
performance.getEntriesByType('resource');
```

`performance.getEntriesByType` accepts a string describing the type of entries you want to retrieve from the performance entry buffer. `'navigation'` and `'resource'` retrieve timings for the Navigation Timing and Resource Timing APIs, respectively.

{% Aside %}
Try loading a website and then enter either of the commands in the above code snippet in your browser's console to see actual timings captured by your browser.
{% endAside %}

The amount of information these APIs provide can be overwhelming, but they're your key to measuring loading performance in the field, as you can gather these timings from users as they visit your website.

## The life and timings of a network request

Gathering and analyzing navigation and resource timings is sort of like archeology in that you're reconstructing the fleeting life of a network request after the fact. Sometimes it helps to visualize concepts, and where network requests are concerned, your browser's developer tools can help.

<figure>
{% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/BxgZyzAEyFnk846wvzNa.png", alt="A diagram of network timings as shown in Chrome's DevTools. The timings depicted are for request queueing, connection negotiation, the request itself, and the response in color-coded bars.", width="800", height="583" %}
  <figcaption>A visualization of a network request in the <a href="https://developer.chrome.com/docs/devtools/network/" rel="noopener">network panel of Chrome's DevTools</a></figcaption>
</figure>

The life of a network request has distinct phases, such as DNS lookup, connection establishment, TLS negotiation, and so on. These timings are represented as a [`DOMHighResTimestamp`](https://developer.mozilla.org/docs/Web/API/DOMHighResTimeStamp). Depending on your browser, the granularity of timings may be down to the microsecond, or be rounded up to milliseconds. Let's examine these phases in detail, and how they relate to Navigation Timing and Resource Timing.

{% Aside %}
As you read this guide, [this diagram](https://www.w3.org/TR/navigation-timing-2/#processing-model) for both Navigation Timing and Resource Timing may help you to visualize the order of the timings they provide.
{% endAside %}

### DNS lookup

When a user goes to a URL, the Domain Name System (DNS) is queried to translate a domain to an IP address. This process may take significant time&mdash;time you'll want to measure in the field, even. Navigation Timing and Resource Timing expose two DNS-related timings:

- `domainLookupStart` is when DNS lookup begins.
- `domainLookupEnd` is when DNS lookup ends.

Calculating total DNS lookup time can be done by subtracting the start metric from the end metric:

```javascript
// Measuring DNS lookup time
const [pageNav] = performance.getEntriesByType('navigation');
const totalLookupTime = pageNav.domainLookupEnd - pageNav.domainLookupStart;
```

{% Aside 'caution' %}
You can't _always_ rely on timings to be populated. Timings provided in both APIs will have a value of `0` in some cases. For example, a DNS lookup may be served by a local cache. Additionally, any timings for cross-origin requests may be unavailable if those origins don't set a [`Timing-Allow-Origin` response header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin).
{% endAside %}

### Connection negotiation

Another contributing factor to loading performance is connection negotiation, which is latency incurred when connecting to a web server. If HTTPS is involved, this process will also include TLS negotiation time. The connection phase consists of three timings:

- `connectStart` is when the browser starts to open a connection to a web server.
- `secureConnectionStart` marks when the client begins TLS negotiation.
- `connectEnd` is when the connection to the web server has been established.

Measuring total connection time is similar to measuring total DNS lookup time: you subtract the start timing from the end timing. However, there's an additional `secureConnectionStart` property that may be `0` if HTTPS isn't used or [if the connection is persistent](https://en.wikipedia.org/wiki/HTTP_persistent_connection). If you want to measure TLS negotiation time, you'll need to keep that in mind:

```javascript
// Quantifying total connection time
const [pageNav] = performance.getEntriesByType('navigation');
const connectionTime = pageNav.connectEnd - pageNav.connectStart;
let tlsTime = 0; // <-- Assume 0 to start with

// Was there TLS negotiation?
if (pageNav.secureConnectionStart > 0) {
  // Awesome! Calculate it!
  tlsTime = pageNav.connectEnd - pageNav.secureConnectionStart;
}
```

Once DNS lookup and connection negotiation ends, timings related to fetching documents and their dependent resources come into play.

### Requests and responses

Loading performance is affected by two types of factors:

- **Extrinsic factors:** These are things like latency and bandwidth. Beyond choosing a hosting company and a CDN, they're (mostly) out of our control, as users can access the web from anywhere.
- **Intrinsic factors:** These are things like server and client-side architectures, as well as resource size and our ability to optimize for those things, which are within our control.

Both types of factors affect loading performance. Timings related to these factors are vital, as they describe how long resources take to download. Both Navigation Timing and Resource Timing describe loading performance with the following metrics:

- `fetchStart` marks when the browser begins to fetch a resource (Resource Timing) or a document for a navigation request (Navigation Timing). This precedes the actual request, and is the point at which the browser is checking caches (for example, HTTP and [`Cache` instances](https://developer.mozilla.org/docs/Web/API/Cache)).
- `workerStart` marks when a request starts being handled within a service worker's [`fetch` event handler](https://developer.mozilla.org/docs/Web/API/FetchEvent). This will be `0` when no service worker is controlling the current page.
- `requestStart` is when the browser makes the request.
- `responseStart` is when the first byte of the response arrives.
- `responseEnd` is when the last byte of the response arrives.

These timings allow you to measure multiple aspects of loading performance, such as cache lookup within a service worker _and_ download time:

```javascript
// Cache seek plus response time of the current document
const [pageNav] = performance.getEntriesByType('navigation');
const fetchTime = pageNav.responseEnd - pageNav.fetchStart;

// Service worker time plus response time
let workerTime = 0;

if (pageNav.workerStart > 0) {
  workerTime = pageNav.responseEnd - pageNav.workerStart;
}
```

You can also measure other aspects of request/response latency:

```javascript
const [pageNav] = performance.getEntriesByType('navigation');

// Request time only (excluding redirects, DNS, and connection/TLS time)
const requestTime = pageNav.responseStart - pageNav.requestStart;

// Response time only (download)
const responseTime = pageNav.responseEnd - pageNav.responseStart;

// Request + response time
const requestResponseTime = pageNav.responseEnd - pageNav.requestStart;
```

### Other measurements you can make

Navigation Timing and Resource Timing is useful for more than what the examples above outline. Here are some other situations with relevant timings that may be worth exploring:

- **Page redirects:** Redirects are an overlooked source of added latency, especially redirect chains. Latency gets added in a number of ways, such as HTTP-to-HTTPs hops, as well as 302/uncached 301 redirects. The `redirectStart`, `redirectEnd`, and `redirectCount` timings are helpful in assessing redirect latency.
- **Document unloading:** In pages that run code in an [`unload` event handler](https://developer.mozilla.org/docs/Web/Events/unload), the browser must execute that code before it can navigate to the next page. `unloadEventStart` and `unloadEventEnd` measure document unloading.
- **Document processing:** Document processing time may not be consequential unless your website sends very large HTML payloads. If this describes your situation, the `domInteractive`, `domContentLoadedEventStart`, `domContentLoadedEventEnd`, and `domComplete` timings may be of interest.

{% Aside 'warning' %}
Timings related to document unloading and processing are available only in Navigation Timing, as they only apply to navigation requests.
{% endAside %}

## Acquiring timings in application code

All of the examples shown so far use `performance.getEntriesByType`, but there are other ways to query the performance entry buffer, such as [`performance.getEntriesByName`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByName) and [`performance.getEntries`](https://developer.mozilla.org/docs/Web/API/Performance/getEntries). These methods are fine when only light analysis is needed. In other situations, though, they can introduce excessive main thread work by iterating over a large number of entries, or even repeatedly polling the performance buffer to find new entries.

The recommended approach for collecting entries from the performance entry buffer is to use a [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver). `PerformanceObserver` listens for performance entries, and provides them as they're added to the buffer:

```javascript
// Create the performance observer:
const perfObserver = new PerformanceObserver((observedEntries) => {
  // Get all resource entries collected so far:
  const entries = observedEntries.getEntries();

  // Iterate over entries:
  for (let i = 0; i < entries.length; i++) {
    // Do the work!
  }
});

// Run the observer for Navigation Timing entries:
perfObserver.observe({
  type: 'navigation',
  buffered: true
});

// Run the observer for Resource Timing entries:
perfObserver.observe({
  type: 'resource',
  buffered: true
});
```

{% Aside %}
Adding the `buffered` option to a performance observer's `observe` event ensures that performance entries added to the buffer prior to the instantiation of the performance observer are observable.
{% endAside %}

This method of collecting timings may feel awkward when compared to directly accessing the performance entry buffer, but it's preferable to tying up the main thread with work that doesn't serve a critical and user-facing purpose.

## Phoning home

Once you've collected all the timings you need, you can send them to an endpoint for further analysis. Two ways to do this are with either [`navigator.sendBeacon`](https://developer.mozilla.org/docs/Web/API/Navigator/sendBeacon) or a [`fetch` with the `keepalive` option](https://developer.mozilla.org/docs/Web/API/fetch) set. Both methods will send a request to a specified endpoint in a non-blocking way, and the request will be queued in a way that outlives the current page session if need be:

```javascript
// Caution: If you have lots of performance entries, don't
// do this. This is an example for illustrative purposes.
const data = JSON.stringify(performance.getEntries()));

// The endpoint to transmit the encoded data to
const endpoint = '/analytics';

// Check for fetch keepalive support
if ('keepalive' in Request.prototype) {
  fetch(endpoint, {
    method: 'POST',
    body: data,
    keepalive: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });
} else if ('sendBeacon' in navigator) {
  // Use sendBeacon as a fallback
  navigator.sendBeacon(endpoint, data);
}
```

In this example, the JSON string will arrive in a `POST` payload that you can decode and process/store in an application backend as needed.

## Wrapping up

Once you have metrics collected, it's up to you to figure out how to analyze that field data. When analyzing field data, there are a few general rules to follow to ensure you're drawing meaningful conclusions:

- [Avoid averages](https://www.igvita.com/2016/01/12/the-average-page-is-a-myth/), as they're not representative of any one user's experience, and may be skewed by outliers.
- Rely on percentiles. In datasets of time-based performance metrics, lower is better. This means that when you prioritize low percentiles, you're only paying attention to the fastest experiences.
- [Prioritize the long tail of values](https://timkadlec.com/remembers/2018-06-07-prioritizing-the-long-tail-of-performance/). When you prioritize experiences at the 75th percentile or higher, you're putting your focus where it belongs: on the slowest experiences.

This guide isn't meant to be an exhaustive resource on Navigation or Resource Timing, but a starting point. Below are some additional resources you may find helpful:

- [Navigation Timing Spec](https://www.w3.org/TR/navigation-timing-2/).
- [Resource Timing Spec](https://www.w3.org/TR/resource-timing-2/).
- [ResourceTiming in Practice](https://nicj.net/resourcetiming-in-practice/).
- [Navigation Timing API (MDN)](https://developer.mozilla.org/docs/Web/API/Navigation_timing_API)
- [Resource Timing API (MDN)](https://developer.mozilla.org/docs/Web/API/Resource_Timing_API)

With these APIs and the data they provide, you'll be better equipped to understand how loading performance is experienced by real users, which will give you more confidence in diagnosing and addressing loading performance problems in the field.
