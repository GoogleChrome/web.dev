---
layout: post
title: Largest Contentful Paint (LCP)
authors:
  - philipwalton
date: 2019-08-08
updated: 2020-06-17
description: |
  This post introduces the Largest Contentful Paint (LCP) metric and explains
  how to measure it
tags:
  - performance
  - metrics
---

{% Aside %}
  Largest Contentful Paint (LCP) is an important, user-centric metric for
  measuring [perceived load
  speed](/user-centric-performance-metrics/#types-of-metrics) because it marks
  the point in the page load timeline when the page's main content has likely
  loaded&mdash;a fast LCP helps reassure the user that the page is
  [useful](/user-centric-performance-metrics/#questions).
{% endAside %}

Historically, it's been a challenge for web developers to measure how quickly
the main content of a web page loads and is visible to users.

Older metrics like
[load](https://developer.mozilla.org/en-US/docs/Web/Events/load) or
[DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded)
are not good because they don't necessarily correspond to what the user sees on
their screen. And newer, user-centric performance metrics like [First Contentful
Paint (FCP)](/fcp/) only capture the very beginning of the loading experience.
If a page shows a splash screen or displays a loading indicator, this moment is
not very relevant to the user.

In the past we've recommended performance metrics like [First Meaningful Paint
(FMP)](/first-meaningful-paint/) and [Speed Index (SI)](/speed-index/) (both
available in Lighthouse) to help capture more of the loading experience after
the initial paint, but these metrics are complex, hard to explain, and often
wrong&mdash;meaning they still do not identify when the main content of the page
has loaded.

Sometimes simpler is better. Based on discussions in the [W3C Web
Performance Working Group](https://www.w3.org/webperf/) and research done at
Google, we've found that a more accurate way to measure when the main content
of a page is loaded is to look at when the largest element was rendered.

## What is LCP?

The Largest Contentful Paint (LCP) metric reports the render time of the largest
[image or text block](#what-elements-are-considered) visible within the
viewport, relative to when the page [first started
loading](https://w3c.github.io/hr-time/#timeorigin-attribute).

<picture>
  <source srcset="../vitals/lcp_8x2.svg" media="(min-width: 640px)">
  <img class="w-screenshot w-screenshot--filled"
      src="../vitals/lcp_4x3.svg"
      alt="Good LCP values are 2.5 seconds, poor values are greater than 4.0
            seconds and anything in between needs improvement">
</picture>

### What is a good LCP score?

To provide a good user experience, sites should strive to have Largest
Contentful Paint of **2.5 seconds** or less. To ensure you're hitting this
target for most of your users, a good threshold to measure is the **75th
percentile** of page loads, segmented across mobile and desktop devices.

{% Aside %}
  To learn more about the research and methodology behind this recommendation,
  see: [Defining the Core Web Vitals metrics
  thresholds](/defining-core-web-vitals-thresholds/)
{% endAside %}

### What elements are considered?

As currently specified in the [Largest Contentful Paint
API](https://wicg.github.io/largest-contentful-paint/), the types of elements
considered for Largest Contentful Paint are:

* `<img>` elements
* `<image>` elements inside an `<svg>` element
* `<video>` elements (the poster image is used)
* An element with a background image loaded via the
  [`url()`](https://developer.mozilla.org/en-US/docs/Web/CSS/url()) function
  (as opposed to a
  [CSS gradient](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Images/Using_CSS_gradients))
* [Block-level](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
  elements containing text nodes or other inline-level text elements children.

Note, restricting the elements to this limited set was intentional in order to
keep things simple in the beginning. Additional elements (e.g. `<svg>`,
`<video>`) may be added in the future as more research is conducted.

### How is an element's size determined?

The size of the element reported for Largest Contentful Paint is typically the
size that's visible to the user within the viewport. If the element extends
outside of the viewport, or if any of the element is clipped or has non-visible
[overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow), those
portions do not count toward the element's size.

For image elements that have been resized from their [intrinsic
size](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size), the
size that gets reported is either the visible size or the intrinsic size,
whichever is smaller. For example, images that are shrunk down to a much
smaller than their intrinsic size will only report the size they're displayed
at, whereas images that are stretched or expanded to a larger size will only
report their intrinsic sizes.

For text elements, only the size of their text nodes is considered (the smallest
rectangle that encompasses all text nodes).

For all elements, any margin, padding, or border applied via CSS is not
considered.

{% Aside %}
  Determining which text nodes belong to which elements can sometimes
  be tricky, especially for elements whose children includes inline elements and
  plain text nodes but also block-level elements. The key point is that every
  text node belongs to (and only to) its closest block-level ancestor element.
  In [spec
  terms](https://wicg.github.io/element-timing/#set-of-owned-text-nodes):
  each text node belongs to the element that generates its [containing
  block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block).
{% endAside %}

### When is largest contentful paint reported?

Web pages often load in stages, and as a result, it's possible that the largest
element on the page might change.

To handle this potential for change, the browser dispatches a
[`PerformanceEntry`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry)
of type `largest-contentful-paint` identifying the largest contentful element
as soon as the browser has painted the first frame. But then, after rendering
subsequent frames, it will dispatch another
[`PerformanceEntry`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry)
any time the largest contentful element changes.

For example, on a page with text and a hero image the browser may initially just
render the text&mdash;at which point the browser would dispatch a
`largest-contentful-paint` entry whose `element` property would likely reference
a `<p>` or `<h1>`. Later, once the hero image finishes loading, a second
`largest-contentful-paint` entry would be dispatched and its `element` property
would reference the `<img>`.

It's important to note that an element can only be considered the largest
contentful element once it has rendered and is visible to the user. Images that
have not yet loaded are not considered "rendered". Neither are text nodes using
web fonts during the [font block
period](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display#The_font_display_timeline).
In such cases a smaller element may be reported as the largest contentful
element, but as soon as the larger element finishes rendering, it'll be
reported via another  `PerformanceEntry` object.

In addition to late-loading images and fonts, a page may add new elements to
the DOM as new content becomes available. If any of these new elements is
larger than the previous largest contentful element, a new `PerformanceEntry`
will also be reported.

If an element that is currently the largest contentful element is removed from
the viewport (or even removed from the DOM), it will remain the largest
contentful element unless a larger element is rendered.

{% Aside %}
  Prior to Chrome 88, removed elements were not considered as largest contentful
  elements, and removing the current candidate would trigger a new
  `largest-contentful-paint` entry to be dispatched. However, due to popular UI
  patterns such as image carousels that often removed DOM elements, the metric
  was updated to more accurately reflect what users experience. See the
  [CHANGELOG](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_11_lcp.md)
  for more details.
{% endAside %}

The browser will stop reporting new entries as soon as the user interacts with
the page (via a tap, scroll, or keypress), as user interaction often changes
what's visible to the user (which is especially true with scrolling).

For analysis purposes, you should only report the most recently dispatched
`PerformanceEntry` to your analytics service.

{% Aside 'caution' %}
  Since users can open pages in a background tab, it's possible that the largest
  contentful paint will not happen until the user focuses the tab, which can be
  much later than when they first loaded it.
{% endAside %}

#### Load time vs. render time

For security reasons, the render timestamp of images is not exposed for
cross-origin images that lack the
[`Timing-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Timing-Allow-Origin)
header. Instead, only their load time is exposed (since this is already exposed
via many other web APIs).

The [usage example](#measure-lcp-in-javascript)
below shows how to handle elements whose render time is not available. But,
when possible, it's always recommended to set the
[`Timing-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Timing-Allow-Origin)
header, so your metrics will be more accurate.

### How are element layout and size changes handled?

To keep the performance overhead of calculating and dispatching new performance
entries low, changes to an element's size or position do not generate new LCP
candidates. Only the element's initial size and position in the viewport is
considered.

This means images that are initially rendered off-screen and then transition
on-screen may not be reported. It also means elements initially rendered in the
viewport that then get pushed down, out of view will still report their
initial, in-viewport size.

However, (as mentioned above) an element will be removed from consideration if
it's removed from the DOM or if its associated image resource changes.

### Examples

Here are some examples of when the Largest Contentful Paint occurs on a few
popular websites:

{% Img src="image/admin/bsBm8poY1uQbq7mNvVJm.png", alt="Largest Contentful Paint timeline from cnn.com", width="800", height="311" %}

{% Img src="image/admin/xAvLL1u2KFRaqoZZiI71.png", alt="Largest Contentful Paint timeline from techcrunch.com", width="800", height="311" %}

In both of the timelines above, the largest element changes as content loads.
In the first example, new content is added to the DOM and that changes what
element is the largest. In the second example, the layout changes and content
that was previously the largest is removed from the viewport.

While it's often the case that late-loading content is larger than content
already on the page, that's not necessarily the case. The next two examples
show the Largest Contentful Paint occurring before the page fully loads.

{% Img src="image/admin/uJAGswhXK3bE6Vs4I5bP.png", alt="Largest Contentful Paint timeline from instagram.com", width="800", height="311" %}

{% Img src="image/admin/e0O2woQjZJ92aYlPOJzT.png", alt="Largest Contentful Paint timeline from google.com", width="800", height="311" %}

In the first example, the Instagram logo is loaded relatively early and it
remains the largest element even as other content is progressively shown. In
the Google search results page example, the largest element is a paragraph of
text that is displayed before any of the images or logo finish loading. Since
all the individual images are smaller than this paragraph, it remains the
largest element throughout the load process.

{% Aside %}
  In the first frame of the Instagram timeline, you may notice the camera logo
  does not have a green box around it. That's because it's an `<svg>` element,
  and `<svg>` elements are not currently considered LCP candidates. The first
  LCP candidate is the text in the second frame.
{% endAside %}

## How to measure LCP

LCP can be measured [in the lab](/user-centric-performance-metrics/#in-the-lab)
or [in the field](/user-centric-performance-metrics/#in-the-field), and it's
available in the following tools:

### Field tools

- [Chrome User Experience
  Report](https://developers.google.com/web/tools/chrome-user-experience-report)
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
- [Search Console (Core Web Vitals
  report)](https://support.google.com/webmasters/answer/9205520)
- [`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals)

### Lab tools

- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- [WebPageTest](https://webpagetest.org/)

### Measure LCP in JavaScript

To measure LCP in JavaScript, you can use the [Largest Contentful Paint
API](https://wicg.github.io/largest-contentful-paint/). The following example
shows how to create a
[`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
that listens for `largest-contentful-paint` entries and logs them to the
console.

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('LCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'largest-contentful-paint', buffered: true});
```

{% Aside 'warning' %}

  This code shows how to log `largest-contentful-paint` entries to the console,
  but measuring LCP in JavaScript is more complicated. See below for details:

{% endAside %}

In the above example, each logged `largest-contentful-paint` entry represents
the current LCP candidate. In general, the `startTime` value of the last entry
emitted is the LCP value&mdash;however, that is not always the case. Not all
`largest-contentful-paint` entries are valid for measuring LCP.

The following section lists the differences between what the API reports and how
the metric is calculated.

#### Differences between the metric and the API

- The API will dispatch `largest-contentful-paint` entries for pages loaded in a
  background tab, but those pages should be ignored when calculating LCP.
- The API will continue to dispatch `largest-contentful-paint` entries after a
  page has been backgrounded, but those entries should be ignored when
  calculating LCP (elements may only be considered if the page was in the
  foreground the entire time).
- The API does not report `largest-contentful-paint` entries when the page is
  restored from the [back/forward cache](/bfcache/#impact-on-core-web-vitals),
  but LCP should be measured in these cases since users experience them as
  distinct page visits.
- The API does not consider elements within iframes, but to properly measure LCP
  you should consider them. Sub-frames can use the API to report their
  `largest-contentful-paint` entries to the parent frame for aggregation.

Rather than memorizing all these subtle differences, developers can use the
[`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals) to
measure LCP, which handles these differences for you (where possible):

```js
import {getLCP} from 'web-vitals';

// Measure and log LCP as soon as it's available.
getLCP(console.log);
```

You can refer to [the source code for
`getLCP()`](https://github.com/GoogleChrome/web-vitals/blob/master/src/getLCP.ts)
for a complete example of how to measure LCP in JavaScript.

{% Aside %}
  In some cases (such as cross-origin iframes) it's not possible to measure LCP
  in JavaScript. See the
  [limitations](https://github.com/GoogleChrome/web-vitals#limitations) section
  of the `web-vitals` library for details.
{% endAside %}

### What if the largest element isn't the most important?

In some cases the most important element (or elements) on the page is not the
same as the largest element, and developers may be more interested in measuring
the render times of these other elements instead. This is possible using the
[Element Timing API](https://wicg.github.io/element-timing/), as described in
the article on [custom metrics](/custom-metrics/#element-timing-api).

## How to improve LCP

LCP is primarily affected by four factors:

* Slow server response times
* Render-blocking JavaScript and CSS
* Resource load times
* Client-side rendering

For a deep dive on how to improve LCP, see [Optimize
LCP](/optimize-lcp/). For additional guidance on individual
performance techniques that can also improve LCP, see:

* [Apply instant loading with the PRPL
  pattern](/apply-instant-loading-with-prpl)
* [Optimizing the Critical Rendering
  Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)
* [Optimize your CSS](/fast#optimize-your-css)
* [Optimize your Images](/fast#optimize-your-images)
* [Optimize web Fonts](/fast#optimize-web-fonts)
* [Optimize your JavaScript](/fast#optimize-your-javascript) (for
  client-rendered sites)

## Additional resources

- [Lessons learned from performance monitoring in
  Chrome](https://youtu.be/ctavZT87syI) by [Annie
  Sullivan](https://anniesullie.com/) at
  [performance.now()](https://perfnow.nl/) (2019)

{% include 'content/metrics/metrics-changelog.njk' %}
