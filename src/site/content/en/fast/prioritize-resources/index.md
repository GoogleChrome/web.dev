---
layout: post
title: Prioritize resources
authors:
  - sgomes
description: |
  Browsers attempt to make a best-guess at the most important resources to load first, however you can influence this decision-making.
date: 2018-08-17
updated: 2020-08-05
tags:
  - performance
feedback:
  - api
---

Not every byte that is sent down the wire to the browser has the same degree of importance,
and the browser knows this.
Browsers have heuristics that attempt to make a best-guess at the most important resources to load first—such as CSS before scripts and images.

That said, as with any heuristic, it doesn't always work out;
the browser might make the wrong decision,
usually because it doesn't have enough information at that time.
There are ways that you can influence this decision-making using
`<link rel="preload">`, `<link rel="preconnect">`, and `<link rel="prefetch">`.

## Default priorities in the browser

The browser assigns different relative priorities to different types of resources based on how critical they might be.
So, for example, a `<script>` tag in your page's `<head>` would be loaded in Chrome at a **High** priority (below CSS, at **Highest**),
but that priority would change to **Low** if it has the `async` attribute (meaning it can be loaded and run asynchronously).

Priorities become important when investigating loading performance in your site.
Beyond the usual techniques of [measuring](https://developers.google.com//web/fundamentals/performance/critical-rendering-path/measure-crp)
and [analyzing the critical rendering path](https://developers.google.com//web/fundamentals/performance/critical-rendering-path/analyzing-crp),
it's useful to know Chrome's priority for each resource.
You can find that in the **Network** panel in Chrome DevTools.
Here's what it looks like:


<figure class="w-figure">
    {% Img src="image/admin/oqcdfVAVj2RajVWfs6ap.png", alt="An example of how priorities are displayed in Chrome Developer Tools", width="800", height="249", class="w-screenshot" %}
  <figcaption>
    The <b>Priority</b> column, which is hidden by default (see
    <a href="https://developers.google.com/web/tools/chrome-devtools/network/reference#columns">
      Add or remove columns
    </a>.
  </figcaption>
</figure>


These priorities give you an idea of how much relative importance the browser attributes to each resource.
And remember that subtle differences are enough for the browser to assign a different priority;
for example, an image that is part of the initial render is prioritized higher than an image that starts offscreen.
If you're curious about priorities, [Preload, Prefetch And Priorities in Chrome](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)
digs a lot deeper into the current state of priorities in Chrome.

So what can you do if you find any resources that are marked with a different priority than the one you'd want?

There are three different declarative solutions,
which are all relatively new `<link>` types.

* [`<link rel="preload">`](/preload-critical-assets/) informs the browser that a resource is needed as part of the current navigation,
and that it should start getting fetched as soon as possible.
* [`<link rel="preconnect">`](/preconnect-and-dns-prefetch/) informs the browser that your page intends to establish a connection to another origin,
and that you'd like the process to start as soon as possible.
* [`<link rel="prefetch">`](/link-prefetch/) is somewhat different from `<link rel="preload">` and `<link rel="preconnect">`,
in that it doesn't try to make something critical happen faster;
instead, it tries to make something non-critical happen earlier, if there's a chance.
