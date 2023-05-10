---
layout: post
title: Cumulative Layout Shift (CLS)
authors:
  - philipwalton
  - mihajlija
date: 2019-06-11
updated: 2023-04-12
description: |
  This post introduces the Cumulative Layout Shift (CLS) metric and explains
  how to measure it.
tags:
  - performance
  - metrics
  - web-vitals
---

{% BrowserCompat 'api.LayoutShift' %}

{% Aside 'key-term' %}
  Cumulative Layout Shift (CLS) is a stable Core Web Vital metric. It is an important, user-centric metric for
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

<figure>
  <video autoplay controls loop muted
    poster="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability-poster.png"
    width="658" height="510">
    <source
      src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.webm"
      type="video/webm; codecs=vp8">
    <source
      src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.mp4"
      type="video/mp4; codecs=h264">
  </video>
  <figcaption>
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

CLS is a measure of the largest burst of _layout shift scores_ for every
[unexpected](/cls/#expected-vs-unexpected-layout-shifts) layout shift that
occurs during the entire lifespan of a page.

A _layout shift_ occurs any time a visible element changes its position from one
rendered frame to the next. (See below for details on how individual [layout
shift scores](#layout-shift-score) are calculated.)

A burst of layout shifts, known as a [_session
window_](/evolving-cls/#why-a-session-window), is when one or more individual
layout shifts occur in rapid succession with less than 1-second in between each
shift and a maximum of 5 seconds for the total window duration.

The largest burst is the session window with the maximum cumulative score of all
layout shifts within that window.

<figure>
  <video controls autoplay loop muted
    width="658" height="452">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.mp4" type="video/mp4">
  </video>
  <figcaption>
    Example of session windows. Blue bars represent the scores of each individual layout shift.
  </figcaption>
</figure>

{% Aside 'caution' %}
Previously CLS measured the sum total of _all individual layout shift scores_
that occurred during the entire lifespan of the page.
To see which tools still provide the ability to benchmark against the original
implementation, check out [Evolving Cumulative Layout Shift in web tooling](/cls-web-tooling).
{% endAside %}

### What is a good CLS score?

To provide a good user experience, sites should strive to have a CLS score of
**0.1** or less. To ensure you're hitting this target for most of your users, a
good threshold to measure is the **75th percentile** of page loads, segmented
across mobile and desktop devices.

<figure>
  <picture>
    <source
      srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9mWVASbWDLzdBUpVcjE1.svg" | imgix }}"
      media="(min-width: 640px)"
      width="800"
      height="200">
    {%
      Img
        src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg",
        alt="Good CLS values are 0.1 or less, poor values are greater than 0.25, and anything in between needs improvement",
        width="640",
        height="480"
    %}
  </picture>
</figure>

{% Aside %}
  To learn more about the research and methodology behind this recommendation,
  see: [Defining the Core Web Vitals metrics
  thresholds](/defining-core-web-vitals-thresholds/)
{% endAside %}

## Layout shifts in detail

Layout shifts are defined by the [Layout Instability
API](https://github.com/WICG/layout-instability), which reports `layout-shift`
entries any time an element that is visible within the viewport changes its
start position (for example, its top and left position in the default [writing
mode](https://developer.mozilla.org/docs/Web/CSS/writing-mode)) between
two frames. Such elements are considered _unstable elements_.

Note that layout shifts only occur when existing elements change their start
position. If a new element is added to the DOM or an existing element changes
size, it doesn't count as a layout shift&mdash;as long as the change doesn't
cause other visible elements to change their start position.

### Layout shift score

To calculate the _layout shift score_, the browser looks at the viewport size
and the movement of _unstable elements_ in the viewport between two rendered
frames. The layout shift score is a product of two measures of that movement:
the _impact fraction_ and the _distance fraction_ (both defined below).

```text
layout shift score = impact fraction * distance fraction
```

### Impact fraction

The [impact
fraction](https://github.com/WICG/layout-instability#Impact-Fraction) measures
how _unstable elements_ impact the viewport area between two frames.

The union of the visible areas of all _unstable elements_ for the previous frame
_and_ the current frame&mdash;as a fraction of the total area of the
viewport&mdash;is the _impact fraction_ for the current frame.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BbpE9rFQbF8aU6iXN1U6.png", alt="Impact fraction example with one _unstable element_", width="800", height="600", linkTo=true %}

In the image above there's an element that takes up half of the viewport in one
frame. Then, in the next frame, the element shifts down by 25% of the viewport
height. The red, dotted rectangle indicates the union of the element's visible
area in both frames, which, in this case, is 75% of the total viewport, so its
_impact fraction_ is `0.75`.

### Distance fraction

The other part of the layout shift score equation measures the distance that
unstable elements have moved, relative to the viewport. The _distance fraction_
is the greatest distance any _unstable element_ has moved in the frame (either
horizontally or vertically) divided by the viewport's largest dimension (width
or height, whichever is greater).

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ASnfpVs2n9winu6mmzdk.png", alt="Distance fraction example with one _unstable element_", width="800", height="600", linkTo=true %}

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

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xhN81DazXCs8ZawoCj0T.png", alt="Layout shift example with multiple stable and _unstable elements_", width="800", height="600", linkTo=true %}

The "Click Me!" button is appended to the bottom of the gray box with black
text, which pushes the green box with white text down (and partially out of the
viewport).

In this example, the gray box changes size, but its start position does not
change so it's not an _unstable element_.

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

This last example illustrates multiple _unstable elements_:

{% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/J8AWG72qYlmbAHxjxuLg.png", alt="Layout shift example with stable and _unstable elements_ and viewport clipping", width="800", height="600", linkTo=true %}

In the first frame above there are four results of an API request for animals,
sorted in alphabetical order. In the second frame, more results are added to the
sorted list.

The first item in the list ("Cat") does not change its start position between
frames, so it's stable. Similarly, the new items added to the list were not
previously in the DOM, so their start positions don't change either. But the
items labelled "Dog", "Horse", and "Zebra" all shift their start positions,
making them _unstable elements_.

Again, the red, dotted rectangles represent the union of these three _unstable
elements_' before and after areas, which in this case is around 60% of the
viewport's area (_impact fraction_ of `0.60`).

The arrows represent the distances that _unstable elements_ have moved from
their starting positions. The "Zebra" element, represented by the blue arrow,
has moved the most, by about 30% of the viewport height. That makes the
_distance fraction_ in this example `0.3`.

The layout shift score is `0.60 x 0.3 = 0.18`.

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

{% Aside 'caution' %}
  The `hadRecentInput` flag will only be true for discrete input events like tap,
  click, or keypress. Continuous interactions such as scrolls, drags, or pinch
  and zoom gestures are not considered "recent input". See the
  [Layout Instability Spec](https://github.com/WICG/layout-instability#recent-input-exclusion)
  for more details.
{% endAside %}


#### Animations and transitions

Animations and transitions, when done well, are a great way to update content on
the page without surprising the user. Content that shifts abruptly and
unexpectedly on the page almost always creates a bad user experience. But
content that moves gradually and naturally from one position to the next can
often help the user better understand what's going on, and guide them between
state changes.

Be sure to respect [`prefers-reduced-motion`](/prefers-reduced-motion/) browser settings, as some site visitors
can experience ill effects or attention issues from animation.

CSS [`transform`](https://developer.mozilla.org/docs/Web/CSS/transform)
property allows you to animate elements without triggering layout shifts:

* Instead of changing the `height` and `width` properties, use `transform:
  scale()`.
* To move elements around, avoid changing the `top`, `right`, `bottom`, or
  `left` properties and use `transform: translate()` instead.

## How to measure CLS

CLS can be measured [in the lab](/user-centric-performance-metrics/#in-the-lab)
or [in the field](/user-centric-performance-metrics/#in-the-field), and it's
available in the following tools:

{% Aside 'caution' %}
  Lab tools typically load pages in a synthetic environment and are thus only
  able to measure layout shifts that occur during page load. As a result, CLS
  values reported by lab tools for a given page may be less than what real users
  experience in the field.
{% endAside %}

### Field tools

- [Chrome User Experience
  Report](https://developer.chrome.com/docs/crux/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Search Console (Core Web Vitals
  report)](https://support.google.com/webmasters/answer/9205520)
- [`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals)

### Lab tools

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://webpagetest.org/)

### Measure layout shifts in JavaScript

To measure layout shifts in JavaScript, you use the [Layout Instability API](https://github.com/WICG/layout-instability).

The following example shows how to create a [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) to log `layout-shift` entries to the console:

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('Layout shift:', entry);
  }
}).observe({type: 'layout-shift', buffered: true});
```

### Measure CLS in JavaScript

To measure CLS in JavaScript, you need to group these unexpected `layout-shift` entries into sessions, and calculate the maximum session value. You can refer to the [`web vitals` JavaScript library source code](https://github.com/GoogleChrome/web-vitals/blob/main/src/onCLS.ts) which contains a reference implementation on how CLS is calculated.

In most cases, the current CLS value at the time the page is being unloaded is the final CLS value for that page, but there are a few important exceptions as noted in the next section. The `web vitals` JavaScript library accounts for these as much as possible, within the limitations of the Web APIs.

#### Differences between the metric and the API

- If a page is loaded in the background, or if it's backgrounded prior to the
  browser painting any content, then it should not report any CLS value.
- If a page is restored from the [back/forward
  cache](/bfcache/#impact-on-core-web-vitals), its CLS value should be reset to
  zero since users experience this as a distinct page visit.
- The API does not report `layout-shift` entries for shifts that occur within
  iframes but the metric does as they are part of the user experience of the
  page. This can
  [show as a difference between CrUX and RUM](/crux-and-rum-differences/#iframes).
  To properly measure CLS you should consider them. Sub-frames can
  use the API to report their `layout-shift` entries to the parent frame for
  [aggregation](https://github.com/WICG/layout-instability#cumulative-scores).

In addition to these exceptions, CLS has some added complexity due to the fact
that it measures the entire lifespan of a page:

- Users might keep a tab open for a _very_ long time&mdash;days, weeks, months.
  In fact, a user might never close a tab.
- On mobile operating systems, browsers typically do not run page unload
  callbacks for background tabs, making it difficult to report the "final"
  value.

To handle such cases, CLS should be reported any time a page is
background&mdash;in addition to any time it's unloaded (the [`visibilitychange`
event](https://developer.chrome.com/blog/page-lifecycle-api/#event-visibilitychange)
covers both of these scenarios). And analytics systems receiving this data will
then need to calculate the final CLS value on the backend.

Rather than memorizing and grappling with all of these cases yourself, developers can use the
[`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals) to
measure CLS, which accounts for everything mentioned above:

```js
import {onCLS} from 'web-vitals';

// Measure and log CLS in all situations
// where it needs to be reported.
onCLS(console.log);
```

{% Aside %}
  In some cases (such as cross-origin iframes) it's not possible to measure CLS
  in JavaScript. See the
  [limitations](https://github.com/GoogleChrome/web-vitals#limitations) section
  of the `web-vitals` library for details.
{% endAside %}

## How to improve CLS

A full guide on [optimizing CLS](/optimize-cls/) is available to guide you through the process of identifying layout shifts in the field and using lab data to drill down and optimize them.

## Additional resources

- Google Publisher Tag's guidance on
  [minimizing layout shift](https://developers.google.com/doubleclick-gpt/guides/minimize-layout-shift)
- [Understanding Cumulative Layout Shift](https://youtu.be/zIJuY-JCjqw) by
  [Annie Sullivan](https://anniesullie.com/) and [Steve
  Kobes](https://kobes.ca/) at [#PerfMatters](https://perfmattersconf.com/)
  (2020)

{% include 'content/metrics/metrics-changelog.njk' %}
