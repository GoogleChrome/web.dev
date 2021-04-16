---
layout: post
title: Cumulative Layout Shift (CLS)
authors:
  - philipwalton
  - mihajlija
date: 2019-06-11
updated: 2020-10-09
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
rendered frame to the next. (See below for details on how individual [layout
shift scores](#layout-shift-score) are calculated.)

<picture>
  <source srcset="../vitals/cls_8x2.svg" media="(min-width: 640px)">
  <img class="w-screenshot w-screenshot--filled"
      src="../vitals/cls_4x3.svg"
      alt="Good CLS values are under 0.1, poor values are greater than 0.25
            and anything in between needs improvement">
</picture>

### What is a good CLS score?

To provide a good user experience, sites should strive to have a CLS score of
**0.1** or less. To ensure you're hitting this target for most of your users, a
good threshold to measure is the **75th percentile** of page loads, segmented
across mobile and desktop devices.

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
mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode)) between
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

[![Impact fraction example with one _unstable
element_](layout-shift-1.png)](layout-shift-1.png)

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

[![Distance fraction example with one _unstable
element_](layout-shift-2.png)](layout-shift-2.png)

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

[![Layout shift example with stable and _unstable elements_ and viewport
clipping](layout-shift-3.png)](layout-shift-3.png)

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

[![Layout shift example with multiple stable and _unstable
elements_](layout-shift-4.png)](layout-shift-4.png)

In the first frame above there are four results of an API request for animals,
sorted in alphabetical order. In the second frame, more results are added to the
sorted list.

The first item in the list ("Cat") does not change its start position between
frames, so it's stable. Similarly, the new items added to the list were not
previously in the DOM, so their start positions don't change either. But the
items labelled "Dog", "Horse", and "Zebra" all shift their start positions,
making them _unstable elements_.

Again, the red, dotted rectangles represent the union of these three _unstable
elements_' before and after areas, which in this case is around 38% of the
viewport's area (_impact fraction_ of `0.38`).

The arrows represent the distances that _unstable elements_ have moved from
their starting positions. The "Zebra" element, represented by the blue arrow,
has moved the most, by about 30% of the viewport height. That makes the
_distance fraction_ in this example `0.3`.

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

{% Aside 'caution' %}
  Lab tools typically load pages in a synthetic environment and are thus only
  able to measure layout shifts that occur during page load. As a result, CLS
  values reported by lab tools for a given page may be less than what real users
  experience in the field.
{% endAside %}

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

### Measure CLS in JavaScript

To measure CLS in JavaScript, you can use the [Layout Instability
API](https://github.com/WICG/layout-instability). The following example shows
how to create a
[`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
that listens for unexpected `layout-shift` entries, accumulates them, and logs them to the console:

```js
let cls = 0;

new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      cls += entry.value;
      console.log('Current CLS value:', cls, entry);
    }
  }
}).observe({type: 'layout-shift', buffered: true});
```

{% Aside 'warning' %}
  This code shows how to log and accumulate unexpected `layout-shift` entries.
  However, measuring CLS in JavaScript is more complicated. See below for
  details:
{% endAside %}

In the above example, all `layout-shift` entries whose `hadRecentInput` flag is
set to false are accumulated to determine the current CLS value. In most cases,
the current CLS value at the time the page is being unloaded is the final CLS
value for that page, but there are a few important exceptions:

The following section lists the differences between what the API reports and how
the metric is calculated.

#### Differences between the metric and the API

- If a page is in the background state for its entire lifetime, it should not
  report any CLS value.
- If a page is restored from the [back/forward
  cache](/bfcache/#impact-on-core-web-vitals), its CLS value should be reset to
  zero since users experience this as a distinct page visit.
- The API does not report `layout-shift` entries for shifts that occur within
  iframes, but to properly measure CLS you should consider them. Sub-frames can
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
event](https://developers.google.com/web/updates/2018/07/page-lifecycle-api#event-visibilitychange)
covers both of these scenarios). And analytics systems receiving this data will
then need to calculate the final CLS value on the backend.

Rather than memorizing and grappling with all of these cases yourself, developers can use the
[`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals) to
measure CLS, which accounts for everything mentioned above:

```js
import {getCLS} from 'web-vitals';

// Measure and log CLS in all situations
// where it needs to be reported.
getCLS(console.log);
```



You can refer to [the source code for
`getCLS)`](https://github.com/GoogleChrome/web-vitals/blob/master/src/getCLS.ts)
for a complete example of how to measure CLS in JavaScript.

{% Aside %}
  In some cases (such as cross-origin iframes) it's not possible to measure CLS
  in JavaScript. See the
  [limitations](https://github.com/GoogleChrome/web-vitals#limitations) section
  of the `web-vitals` library for details.
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
CLS](/optimize-cls/).

## Additional resources

- Google Publisher Tag's guidance on
  [minimizing layout shift](https://developers.google.com/doubleclick-gpt/guides/minimize-layout-shift)
- [Understanding Cumulative Layout Shift](https://youtu.be/zIJuY-JCjqw) by
  [Annie Sullivan](https://anniesullie.com/) and [Steve
  Kobes](https://kobes.ca/) at [#PerfMatters](https://perfmattersconf.com/)
  (2020)

{% include 'content/metrics/metrics-changelog.njk' %}
