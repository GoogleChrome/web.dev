---
title: The Layout Instability API
subhead: Detect unexpected layout shifts in JavaScript.
authors:
  - philipwalton
date: 2019-06-11
hero: hero.jpg
# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
hero_position: bottom
alt: An unstable stack of rocks on a beach
description: |
  This post introduces the Layout Instability API, its key concepts, and
  explains how to use the API and provide feedback
tags:
  - post # post is a required tag for the article to show up in the blog.
  - performance
  - origin-trials
---

Have you ever been reading an article online when something suddenly changes on
the page? Without warning, the text moves, and you've lost your place.

Or even worse: you're about to tap a link or a button, but in the instant
before your finger lands&mdash;**BOOM**&mdash;the link moves, and you end up
clicking something else!

Most of the time these kinds of experiences are just a mild annoyance or
frustration. But in some cases, they can actually cause real damage or harm.

<figure class="w-figure w-figure--center">
  <video autoplay controls loop muted
    class="w-screenshot"
    poster="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability-poster.png"
    width="658" height="510">
    <source
      src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability.webm"
      type="video/webm; codecs=vp8">
    <source
      src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability.mp4"
      type="video/mp4; codecs=h264">
  </video>
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    A screencast illustrating how layout instability can negatively affect users.
  </figcaption>
</figure>

Unexpected movement of page content usually happens because resources are
loaded asynchronously or DOM elements get dynamically added to the page above
existing content. The culprit might be an image or video with unknown
dimensions, a font that renders larger or smaller than its fallback, or a
third-party ad or widget that dynamically resizes itself.

What makes this issue even more problematic is that how a site functions in
development is often quite different from how users experience it in
production: personalized or third-party content often doesn't behave the same
in development as it does in production, test images are often already in the
developer's browser cache, and API calls that run locally are often so fast
that the delay isn't noticeable.

The first step toward properly solving this problem is to give developers the
tools to measure it and understand how often it's occurring for real users. The
[Layout Instability API](https://github.com/WICG/layout-instability), currently
being incubated in the [WICG](https://www.w3.org/community/wicg/), aims to
address this.

## How is layout instability determined?

Layout Instability is determined by calculating a _layout shift_ score every
time the browser renders a new frame. Developers and analytics providers can
then monitor these scores in the wild, identify the culprits, and improve the
experience for their users.

### Layout shift defined

For each element that's visible in the viewport, if the element's block-start
and inline-start positions (e.g., its top and left position in the default
[writing mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode))
relative to its [containing
element](https://www.w3.org/TR/CSS2/visudet.html#containing-block-details) has
changed between the frame currently being rendered and the frame that was
previously rendered, the element is identified as unstable.

The union of the visible areas of all unstable elements for the previous frame
_and_ the current frame&mdash;as a fraction of the total area of the
viewport&mdash;is the **layout shift score** for the current frame.

Here are a few examples of how the layout shift score is calculated:

![Layout shift example with one unstable element](layout-shift-1.png)

In the image above there's an element that takes up half of the viewport in one
frame. Then, in the next frame, the element shifts down by 25% of the viewport
height. The red, dotted rectangle indicates the union of the element's visible
area in both frames, which, in this case, is 75% of the total viewport, so its
layout shift score is 0.75.

The next example illustrates how adding content to an existing element affects
the layout shift score:

![Layout shift example with stable and unstable elements and viewport
clipping](layout-shift-2.png)

Here the "Click Me!" button is appended to the bottom of the gray box with
black text, which pushes the green box with white text down (and partially out
of the viewport).

In this example, the gray box changes size, but its start position does not
change so it's not an unstable element. The start position of the green box,
however, does change, but since it's been moved partially out of the viewport,
the invisible area is not considered when calculating the layout shift score.
The union of the visible areas for the green box in both frames is the same as
the area of the green box in the first frame, which is 50%, and its layout
shift score is therefore 0.5 (as illustrated by the red, dotted rectangle).

This last example illustrates multiple unstable elements:

![Layout shift example with multiple stable and unstable
elements](layout-shift-3.png)

In the first frame above we have the initial results of an API request for
animals, sorted in alphabetical order. In the second frame we have some more
results that get added to the sorted list.

The first item in the list ("Cat") does not change its start position between
frames, so it's stable. Similarly, the new items added to the list were not
previously in the DOM, so their start positions don't change either. But the
items labelled "Dog", "Horse", and "Zebra" all shift their start positions, so
they're unstable elements.

Again, the red, dotted rectangles represent the union of these three unstable
elements' before and after areas, which in this case represents around 38% of
the viewport's area (a layout shift score of 0.38).

A key point that's hopefully clear from these examples is that layout shifts
only occur when _existing_ elements change their _start position_. If a new
element is added to the DOM or an existing element changes size, it doesn't
count as a layout shift&mdash;**as long as the change doesn't cause other visible
elements to change their start position**.

### Expected vs unexpected layout shifts

Not all layout shifts are bad. In fact, many dynamic web applications will
frequently change the start position of elements on the page.

#### User-initiated layout shifts

A layout shift is only bad if the user isn't expecting it. On the other hand,
layout shifts that occur in response to user interactions (e.g., clicking a
link, pressing a button, typing in a search box, etc.) are generally fine, as
long as the shift occurs close enough to the interaction that the relationship
is clear to the user.

For example, if a user interaction triggers a network request that may take a
while to complete, it's best to create some space right away and show a loading
indicator to avoid an unpleasant layout shift when the request completes. If
the user doesn't realize something is loading, or doesn't have a sense of when
the resource will be ready, they may try to click something else while
waiting&mdash;something that could move out from under them.

#### Animations and transitions

Animations and transitions, when done well, are a great way to update content
on the page without surprising the user. Content that shifts abruptly and
unexpectedly on the page almost always creates a bad user experience. But
content that moves gradually and naturally from one position to the next can
often help the user better understand what's going on, and guide them between
state changes.

To ensure that effective uses of animations and transitions do not produce
negative layout shift scores in the Layout Instability API, elements whose
start position has changed by less than three pixels since the previous frame
are not considered unstable elements.

### A cumulative layout shift score

Layout shift scores are calculated per-frame, and they are reported regardless
of whether the shift was triggered as a result of user input.

But users can experience layout instability throughout their entire browser
session, and as I mentioned above, not all layout shifts are perceived
negatively.

The cumulative layout shift (CLS) score is determined by calculating the sum of
all unexpected layout shift scores from page load until the page's [lifecycle
state](https://developers.google.com/web/updates/2018/07/page-lifecycle-api)
changes to hidden. In the current Chrome implementation, "unexpected layout
shifts" are those that don't occur within 500 milliseconds of a discrete user
interaction (i.e., click, taps, and key presses, but not scrolls or mouse
moves)

A page that has no unexpected layout shifts will have a cumulative layout shift
score of 0. Most typical content sites and web applications should strive for a
score of 0 to provide the best experience for their users.

In addition, the cumulative layout shift score has been added as an
experimental metric in the [Chrome User Experience
Report](https://developers.google.com/web/tools/chrome-user-experience-report/)
(CrUX), a dataset that captures how real-world Chrome users experience popular
destinations on the web. With the addition of CLS as of the May 2019 release,
developers can get a better understanding of how users experience layout
instability on their sites, on their competitors' sites, and on the web as a
whole.

<div class="w-aside w-aside--objective">
  <p><strong>Important:</strong>
  while most sites should strive for a CLS score of 0, it's certainly
  possible that some sites employ layout shifts deliberately  (for example, in
  multimedia presentations, progressive visualisations, slideshows, etc.).</p>
  <p>
  This is perfectly fine. CLS scores are intended to help developers who may
  not be aware of the problems caused by unexpected layout shifts; they're not
  intended to suggest that sites that deliberately shift the layout are
  necessarily problematic.</p>
</div>

## How to use the Layout Instability API

The Layout Instability API is available in Chrome 74+ with the experimental web
platform features flag enabled
(`chrome://flags/#enable-experimental-web-platform-features`) or by through the
[Layout Instability Origin
Trial](https://developers.chrome.com/origintrials/#/view_trial/1215971899390033921),
which will be available until Sept. 3, 2019.

Similar to other performance APIs, Layout Instability can be observed via the
`PerformanceObserver` interface, where you can subscribe to entries of type
`layoutShift`.

The following code logs all layout shift entries as they happen:

```js
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry);
  }
})

observer.observe({entryTypes: ['layoutShift']});
```

If you want to calculate the cumulative layout shift score for your pages and
track them in your analytics back end, you can declare a variable that stores
the current cumulative layout shift score, and then increment it any time a new
layout shift is detected. You'll typically want to record scores from the
initial page load until the page's lifecycle state changes to hidden:

```js
// Stores the current layout shift score for the page.
let cumulativeLayoutShiftScore = 0;

// Detects new layout shift occurrences and updates the
// `cumulativeLayoutShiftScore` variable.
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    cumulativeLayoutShiftScore += entry.value;
  }
});

observer.observe({entryTypes: ['layoutShift']});

// Sends the final score to your analytics back end once
// the page's lifecycle state becomes hidden.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    // Force any pending records to be dispatched.
    observer.takeRecords();

    // Send the final score to your analytics back end
    // (assumes `sendToAnalytics` is defined elsewhere).
    sendToAnalytics({cumulativeLayoutShiftScore});
  }
});
```

<div class="w-aside w-aside--note">
  <p><strong>Note:</strong>
  The Layout Instability API does not currently expose whether a layout shift
  entry occurred shortly after a user input event. The goal is to eventually
  expose it, but the exact format and duration is still being discussed.</p>
  <p>In the meantime, developers wanting to track CLS scores themselves can
  manually ignore specific layout shift entries by comparing `event.timeStamp`
  with `entry.startTime` for events they expect to cause layout shifts. For
  consistency with the CLS scores reported to CrUX, you can ignore entries that
  occur within 500 milliseconds of user input.</p>
</div>

## How to avoid unexpected layout shifts

For most websites, you can avoid all unexpected layout shifts by sticking to a
few guiding principles:


<ul>
  <li>
    <strong>Always include size attributes on your images and video elements,
    or otherwise reserve the required space with something like
    <a href="https://css-tricks.com/aspect-ratio-boxes/">CSS aspect ratio
    boxes</a>.</strong><br>
    This approach ensures that the browser can allocate the correct amount of
    space in the document while the image is loading. Note that you can also
    use the
    <a href="https://github.com/w3c/webappsec-feature-policy/blob/master/policies/unsized-media.md">
    unsized-media feature policy</a> to force this behavior in browsers that
    support feature policies. And in the future you'll be able to use the
    <a href="https://github.com/WICG/intrinsicsize-attribute">
    <code>intrinsicSize</code> attribute</a> to more easily address this issue.
  </li>
  <li>
    <strong>Never insert content above existing content, except in response to
    a user interaction.</strong><br>
    This ensures any layout shifts that occur are expected.
  </li>
  <li>
    <strong>When layout shifts are necessary, use transitions or animation to
    provide context and continuity to the user.</strong><br>
    This creates continuity from state to state that's easier for users to
    follow.
  </li>
</ul>

## Feedback wanted

The Layout Instability API is being incubated in the WICG, and this is the time
feedback from the developer community is the most helpful&mdash;specifically
feedback on how well the API works on real websites and with the actual
development techniques used today.

* Are there any false positives (good experiences reported as unexpected layout
  shifts)?
* Are there any false negatives (clear examples of layout instability not being
  reported)?
* Are the scores meaningful and the data actionable?

You can give feedback by opening up an issue on the [Layout Instability Spec's
GitHub repo](https://github.com/WICG/layout-instability), or by contributing to
the discussion already happening there.

Also, if your site is available in the CrUX dataset, you [can
query](https://console.cloud.google.com/bigquery?p=chrome-ux-report&d=all&t=201905&page=table)
to see how real Chrome users are experiencing the stability of your site's
layout, and you can compare these results to the results you're seeing when
testing your site locally. If the results you see in CrUX are unexpected, you
can sign up for the [Layout Instability Origin
Trial](https://developers.chrome.com/origintrials/#/view_trial/1215971899390033921)
and monitor your user's experience via the JavaScript API.

As I mentioned in the introduction of this post. The first step toward properly
solving layout instability is to measure it and understand how often it occurs
for real users.
