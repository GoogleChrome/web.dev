---
layout: post
title: Cumulative Layout Shift (CLS)
authors:
  - philipwalton
  - mihajlija
date: 2019-06-11
updated: 2020-04-30
description: |
  This post introduces the Cumulative Layout Shift (CLS) metric and explains
  how to measure it
tags:
  - performance
  - metrics
---

{% Aside %}
  Cumulative Layout Shift (CLS) is an important, user-centric metric for
  measuring [visual
  stability](/user-centric-performance-metrics/#types-of-metrics) because it
  helps quantify how often users experience unexpected layout shifts&mdash;a low
  CLS helps ensure that the page is
  [delightful](/user-centric-performance-metrics/#questions).
{% endAside %}

Have you ever been reading an article online when something suddenly changes on
the page? Without warning, the text moves, and you've lost your place. Or even
worse: you're about to tap a link or a button, but in the instant before your
finger lands&mdash;BOOM&mdash;the link moves, and you end up clicking something
else!

Most of the time these kinds of experiences are just annoying, but in some
cases, they can cause real damage.

<figure class="w-figure">
  <video autoplay controls loop muted
    class="w-screenshot"
    poster="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability-poster.png"
    width="658" height="510">
    <source
      src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.webm"
      type="video/webm; codecs=vp8">
    <source
      src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.mp4"
      type="video/mp4; codecs=h264">
  </video>
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    A screencast illustrating how layout instability can negatively affect
    users.
  </figcaption>
</figure>

Unexpected movement of page content usually happens because resources are loaded
asynchronously or DOM elements get dynamically added to the page above existing
content. The culprit might be an image or video with unknown dimensions, a font
that renders larger or smaller than its fallback, or a third-party ad or widget
that dynamically resizes itself.

What makes this issue even more problematic is that how a site functions in
development is often quite different from how users experience it. Personalized
or third-party content often doesn't behave the same in development as it does
in production, test images are often already in the developer's browser cache,
and API calls that run locally are often so fast that the delay isn't
noticeable.

The Cumulative Layout Shift (CLS) metric helps you address this problem by
measuring how often it's occurring for real users.

## What is CLS?

CLS measures the sum total of all individual _layout shift scores_ for every
_unexpected layout shift_ that occurs during the entire lifespan of the page.

A _layout shift_ occurs any time a visible element changes its position from one
frame to the next. (See below for details on how individual [layout shift
scores](#layout-shift-score) are calculated.)

<picture>
  <source srcset="../vitals/cls_8x2.svg" media="(min-width: 640px)">
  <img class="w-screenshot w-screenshot--filled"
      src="../vitals/cls_4x3.svg"
      alt="Good fid values are 2.5 seconds, poor values are greater than 4.0
            seconds and anything in between needs improvement">
</picture>

### What is a good CLS score?

To provide a good user experience, sites should strive to have a CLS score of
less than **0.1**. To ensure you're hitting this target for most of your users,
a good threshold to measure is the **75th percentile** of page loads, segmented
across mobile and desktop devices.

## Layout shifts in detail

Layout shifts are defined by the [Layout Instability
API](https://github.com/WICG/layout-instability), which reports `layout-shift`
entries any time an element that is visible with the viewport changes its start
position (for example, its top and left position in the default [writing
mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode)) between
two frames. Such elements are considered _unstable elements_.

Note that layout shifts only occur when existing elements change their start
position. If a new element is added to the DOM or an existing element changes
size, it doesn't count as a layout shift&mdash;as long as the change doesn't
cause other visible elements to change their start position.

### Layout shift score

To calculate the _layout shift score_, the browser looks at the viewport size
and the movement of unstable elements in the viewport between two rendered
frames. The layout shift score is a product of two measures of that movement:
the _impact fraction_ and the _distance fraction_ (both defined below).

```text
layout shift score = impact fraction * distance fraction
```

### Impact fraction

The [impact
fraction](https://github.com/WICG/layout-instability#Impact-Fraction) measures
how unstable elements impact the viewport area between two frames.

The union of the visible areas of all unstable elements for the previous frame
_and_ the current frame&mdash;as a fraction of the total area of the
viewport&mdash;is the _impact fraction_ for the current frame.

[![Impact fraction example with one unstable
element](layout-shift-1.png)](layout-shift-1.png)

In the image above there's an element that takes up half of the viewport in one
frame. Then, in the next frame, the element shifts down by 25% of the viewport
height. The red, dotted rectangle indicates the union of the element's visible
area in both frames, which, in this case, is 75% of the total viewport, so its
_impact fraction_ is `0.75`.

### Distance fraction

The other part of the layout shift score equation measures the distance that
unstable elements have moved, relative to the viewport. The _distance fraction_
is the greatest distance any unstable element has moved in the frame (either
horizontally or vertically) divided by the viewport's largest dimension (width
or height, whichever is greater).

[![Distance fraction example with one unstable
element](layout-shift-2.png)](layout-shift-2.png)

In the example above, the largest viewport dimension is the height, and the
unstable element has moved by 25% of the viewport height, which makes the
_distance fraction_ 0.25.

So, in this example the _impact fraction_ is `0.75` and the _distance fraction_
is `0.25`, so the _layout shift score_ is `0.75 * 0.25 = 0.1875`.

{% Aside %}
  Initially, the layout shift score was calculated based only on _impact
  fraction_. The _distance fraction_ was introduced to avoid overly penalizing
  cases where large elements shift by a small amount.
{% endAside %}

The next example illustrates how adding content to an existing element affects
the layout shift score:

[![Layout shift example with stable and unstable elements and viewport
clipping](layout-shift-3.png)](layout-shift-3.png)

The "Click Me!" button is appended to the bottom of the gray box with black
text, which pushes the green box with white text down (and partially out of the
viewport).

In this example, the gray box changes size, but its start position does not
change so it's not an unstable element.

The "Click Me!" button was not previously in the DOM, so its start position
doesn't change either.

The start position of the green box, however, does change, but since it's been
moved partially out of the viewport, the invisible area is not considered when
calculating the _impact fraction_. The union of the visible areas for the green
box in both frames (illustrated by the red, dotted rectangle) is the same as the
area of the green box in the first frame&mdash;50% of the viewport. The _impact
fraction_ is `0.5`.

The _distance fraction_ is illustrated with the purple arrow. The green box has
moved down by about 14% of the viewport so the _distance fraction_ is `0.14`.

The layout shift score is `0.5 x 0.14 = 0.07`.

This last example illustrates multiple unstable elements:

[![Layout shift example with multiple stable and unstable
elements](layout-shift-4.png)](layout-shift-4.png)

In the first frame above there are four results of an API request for animals,
sorted in alphabetical order. In the second frame, more results are added to the
sorted list.

The first item in the list ("Cat") does not change its start position between
frames, so it's stable. Similarly, the new items added to the list were not
previously in the DOM, so their start positions don't change either. But the
items labelled "Dog", "Horse", and "Zebra" all shift their start positions,
making them unstable elements.

Again, the red, dotted rectangles represent the union of these three unstable
elements' before and after areas, which in this case is around 38% of the
viewport's area (_impact fraction_ of `0.38`).

The arrows represent the distances that unstable elements have moved from their
starting positions. The "Zebra" element, represented by the blue arrow, has
moved the most, by about 30% of the viewport height. That makes the _distance
fraction_ in this example `0.3`.

The layout shift score is `0.38 x 0.3 = 0.1172`.

### Expected vs. unexpected layout shifts

Not all layout shifts are bad. In fact, many dynamic web applications frequently
change the start position of elements on the page.

#### User-initiated layout shifts

A layout shift is only bad if the user isn't expecting it. On the other hand,
layout shifts that occur in response to user interactions (clicking a link,
pressing a button, typing in a search box and similar) are generally fine, as
long as the shift occurs close enough to the interaction that the relationship
is clear to the user.

For example, if a user interaction triggers a network request that may take a
while to complete, it's best to create some space right away and show a loading
indicator to avoid an unpleasant layout shift when the request completes. If the
user doesn't realize something is loading, or doesn't have a sense of when the
resource will be ready, they may try to click something else while
waiting&mdash;something that could move out from under them.

Layout shifts that occur within 500 milliseconds of user input will have the
[`hadRecentInput`](https://wicg.github.io/layout-instability/#dom-layoutshift-hadrecentinput)
flag set, so they can be excluded from calculations.

#### Animations and transitions

Animations and transitions, when done well, are a great way to update content on
the page without surprising the user. Content that shifts abruptly and
unexpectedly on the page almost always creates a bad user experience. But
content that moves gradually and naturally from one position to the next can
often help the user better understand what's going on, and guide them between
state changes.

CSS [`transform`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
property allows you to animate elements without triggering layout shifts:

* Instead of changing the `height` and `width` properties, use `transform:
  scale()`.
* To move elements around, avoid changing the `top`, `right`, `bottom`, or
  `left` properties and use `transform: translate()` instead.

## How to measure CLS

CLS can be measured [in the lab](/user-centric-performance-metrics/#in-the-lab)
or [in the field](/user-centric-performance-metrics/#in-the-field), and it's
available in the following tools:

### Field tools

- [Chrome User Experience
  Report](https://developers.google.com/web/tools/chrome-user-experience-report)

### Lab tools

- [Lighthouse (v6)](https://developers.google.com/web/tools/lighthouse/)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/)

### Measure CLS in JavaScript

The easiest way to measure CLS (as well as all Web Vitals [field
metrics]((/metrics/#in-the-field))) is with the [`web-vitals` JavaScript
library](https://github.com/GoogleChrome/web-vitals), which wraps all the
complexity of manually measuring CLS into a single function:

```js
import {getCLS} from 'web-vitals';

// Measure and log the current CLS value,
// any time it's ready to be reported.
getCLS(console.log);
```

To manually measure CLS, you can use the [Layout Instability
API](https://github.com/WICG/layout-instability). The following example shows
how to create a
[`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
that listens for individual `layout-shift` entries and logs them to the console:

{% set entryType = 'layout-shift' %}

```js
{% include 'content/metrics/performance-observer-try.njk' %}
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(entry);
    }
  });

  po.observe({type: 'layout-shift', buffered: true});
{% include 'content/metrics/performance-observer-catch.njk' %}
```

CLS is the sum of those individual `layout-shift` entries that didn't occur with
recent user input. To calculate CLS, declare a variable that stores the current
score, and then increment it any time a new, unexpected layout shift is
detected.

Rather than reporting every change to CLS (which could happen very frequently),
it's better to keep track of the current CLS value and report it any time the
page's [lifecycle
state](https://developers.google.com/web/updates/2018/07/page-lifecycle-api)
changes to hidden:

{% set entryCallback = 'onLayoutShiftEntry' %}

```js
{% include 'content/metrics/send-to-analytics.njk' %}
{% include 'content/metrics/performance-observer-try.njk' %}
  // Store the current layout shift score for the page.
  let cls = 0;

  function onLayoutShiftEntry(entry) {
    // Only count layout shifts without recent user input.
    if (!entry.hadRecentInput) {
      cls += entry.value;
    }
  }

{% include 'content/metrics/performance-observer-init.njk' %}

  // Log the current CLS score any time the
  // page's lifecycle state changes to hidden.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Force any pending records to be dispatched.
      po.takeRecords().forEach(onLayoutShiftEntry);

      // Report the CLS value to an analytics endpoint.
      sendToAnalytics({cls});
    }
  });
{% include 'content/metrics/performance-observer-catch.njk' %}
```

{% Aside %}
  Note: CrUX buckets CLS values as percentages with 5% granularity. This means a
  score of `0.01` when using the code example above would appear in the 0–5
  bucket in CrUX, and a score of `0.07` would appear in the 5–10 bucket in CrUX.
{% endAside %}

## How to improve CLS

For most websites, you can avoid all unexpected layout shifts by sticking to a
few guiding principles:

- **Always include size attributes on your images and video elements, or
  otherwise reserve the required space with something like [CSS aspect ratio
  boxes](https://css-tricks.com/aspect-ratio-boxes/).** This approach ensures
  that the browser can allocate the correct amount of space in the document
  while the image is loading. Note that you can also use the [unsized-media
  feature
  policy](https://github.com/w3c/webappsec-feature-policy/blob/master/policies/unsized-media.md)
  to force this behavior in browsers that support feature policies.
- **Never insert content above existing content, except in response to a user
  interaction.** This ensures any layout shifts that occur are expected.
- **Prefer transform animations to animations of properties that trigger layout
  changes.** Animate transitions in a way that provides context and continuity
  from state to state.

For a deep dive on how to improve CLS, see [Optimize
CLS](https://web.dev/optimize-cls/).

## Additional resources

- [Understanding Cumulative Layout Shift](https://youtu.be/zIJuY-JCjqw) by [Annie
  Sullivan](https://anniesullie.com/) at
  [#PerfMatters](https://perfmattersconf.com/) (2020)

{% include 'content/metrics/metrics-changelog.njk' %}
