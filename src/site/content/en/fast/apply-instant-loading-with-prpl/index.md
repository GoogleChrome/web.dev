---
layout: post
title: Apply instant loading with the PRPL pattern
authors:
  - houssein
description: |
  PRPL is an acronym that describes a pattern used to make web pages load and
  become interactive, faster. In this guide, learn how each of these techniques
  fit together but still can be used independently to achieve performance
  results.
date: 2018-11-05
tags:
  - performance
---

PRPL is an acronym that describes a pattern used to make web pages load and
become interactive, faster:

+  **Push** (or **preload**) the most important resources.
+  **Render** the initial route as soon as possible.
+  **Pre-cache** remaining assets.
+  **Lazy load** other routes and non-critical assets.

In this guide, learn how each of these techniques fit together but still can be
used independently to achieve performance results.

## Audit your page with Lighthouse

Run Lighthouse to identify opportunities for improvement aligned with the PRPL
techniques:

{% Instruction 'devtools-lighthouse', 'ol' %}
1. Select the **Performance** and **Progressive Web App** checkboxes.
1. Click **Run Audits** to generate a report.

For more information, see [Discover performance opportunities with Lighthouse](/discover-performance-opportunities-with-lighthouse).

## Preload critical resources

Lighthouse shows the following failed audit if a certain resource is parsed and
fetched late:

{% Img src="image/admin/tgcMfl3HJLmdoERFn7Ji.png", alt="Lighthouse: Preload key requests audit", width="745", height="97", class="w-screenshot" %}

[**Preload**](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)
is a declarative fetch request that tells the browser to request a resource as
soon as possible. Preload critical resources by adding a `<link>` tag with
`rel="preload"` to the head of your HTML document:

```html
<link rel="preload" as="style" href="css/style.css">
```

The browser sets a more appropriate priority level for the resource in order to
try to download it sooner while not delaying the `window.onload` event.

For more information about preloading critical resources, refer to the
[Preload critical assets](/preload-critical-assets) guide.

## Render the initial route as soon as possible

Lighthouse provides a warning if there are resources that delay [**First Paint**](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#first_paint_and_first_contentful_paint),
the moment when your site renders pixels to the screen:

{% Img src="image/admin/gvj0jlCYbMdpLNtHu0Ji.png", alt="Lighthouse: Eliminate render-blocking resources audit", width="800", height="111", class="w-screenshot" %}

To improve First Paint, Lighthouse recommends inlining critical JavaScript and
deferring the rest using
[`async`](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript),
as well as inlining critical CSS used above-the-fold. This improves performance
by eliminating round-trips to the server to fetch render-blocking assets.
However, inline code is harder to maintain from a development perspective and
cannot be cached separately by the browser.

Another approach to improve First Paint is to **server-side render** the initial
HTML of your page. This displays content immediately to the user while scripts
are still being fetched, parsed, and executed. However, this can increase the
payload of the HTML file significantly, which can harm [**Time to Interactive**](/interactive),
or the time it takes for your application to become interactive and can respond
to user input.

There is no single correct solution to reduce the First Paint in your
application, and you should only consider inlining styles and server-side
rendering if the benefits outweigh the tradeoffs for your application. You can
learn more about both of these concepts with the following resources.

+  [Optimize CSS Delivery](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery)
+  [What is Server-Side Rendering?](https://www.youtube.com/watch?v=GQzn7XRdzxY)

<figure class="w-figure w-figure--inline-right">
  {% Img src="image/admin/xv1f7ZLKeBZD83Wcw6pd.png", alt="Requests/responses with service worker", width="800", height="1224" %}
</figure>

## Pre-cache assets

By acting as a proxy, **service workers** can fetch assets directly from the cache
rather than the server on repeat visits. This not only allows users to use your
application when they are offline, but also results in faster page load times on
repeat visits.

Use a third-party library to simplify the process of generating a service worker
unless you have more complex caching requirements than what a library can
provide. For example,
[Workbox](/workbox) provides a
collection of tools that allow you to create and maintain a service worker to
cache assets. For more information on service workers and offline reliability,
refer to the [service worker guide](/service-workers-cache-storage) in the reliability learning path.

## Lazy load

Lighthouse displays a failed audit if you send too much data over the network.

{% Img src="image/admin/Ml4hOCqfD4kGWfuKYVTN.png", alt="Lighthouse: Has enormous network payloads audit", width="800", height="99", class="w-screenshot" %}

This includes all asset types, but large JavaScript payloads are especially
costly due to the time it takes the browser to parse and compile them.
Lighthouse also provides a warning for this when appropriate.

{% Img src="image/admin/aKDCV8qv3nuTVFt0Txyj.png", alt="Lighthouse: JavaScript boot-up time audit", width="797", height="100", class="w-screenshot" %}

To send a smaller JavaScript payload that contains only the code needed when a
user initially loads your application, split the entire bundle and [lazy load](/reduce-javascript-payloads-with-code-splitting) chunks on demand.

Once you've managed to split your bundle, preload the chunks that are more
important (see the [Preload critical assets](/preload-critical-assets) guide).
Preloading ensures more important resources are fetched and downloaded sooner
by the browser.

Aside from splitting and loading different JavaScript chunks on demand,
Lighthouse also provides an audit for lazy-loading non-critical images.

{% Img src="image/admin/sEgLhoYadRCtKFCYVM1d.png", alt="Lighthouse: Defer offscreen images audit", width="800", height="90", class="w-screenshot" %}

If you load many images on your web page, defer all that are below the fold, or
outside the device viewport, when a page is loaded (see [Use lazysizes to lazyload images](/use-lazysizes-to-lazyload-images)).

## Next Steps

Now that you understand some of the basic concepts behind the PRPL pattern,
continue to the next guide in this section to learn more.
It's important to remember that not all of the techniques need to be
applied together. Any efforts made with any of the following will provide
noticeable performance improvements.

+  **Push** (or **preload**) critical resources.
+  **Render** the initial route as soon as possible.
+  **Pre-cache** remaining assets.
+  **Lazy load** other routes and non-critical assets.
