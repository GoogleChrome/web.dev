---
title: "Scroll snapping after layout changes"
subhead: |
  Starting in Chrome 81, you no longer need to add event listeners to force
  resnapping.
authors:
  - yigu
  - alsan
  - adamargyle
date: 2020-02-22

description: |
  Starting in Chrome 81, scrollers remain snapped when the page layout changes.
  In other words, you no longer need to add event listeners to force resnapping.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
feedback:
  - api
---

[CSS Scroll Snap](https://developers.google.com/web/updates/2018/07/css-scroll-snap)
allows web developers to create well-controlled scroll experiences by declaring
scroll snapping positions. One shortcoming of the current implementation is that
scroll snapping does not work well when the layout changes, such as when the viewport is
resized or the device is rotated. This shortcoming is fixed in Chrome 81.

## Interoperability
Many browsers have basic support for CSS Scroll Snap. See [Can I use CSS
Scroll Snap?](https://caniuse.com/#feat=css-snappoints) for more information.

Chrome is currently the only browser to implement scroll snapping after layout
changes.  Firefox has a
[ticket](https://bugzilla.mozilla.org/show_bug.cgi?id=1530253) open for
implementing this and Safari also has an open
[ticket](https://bugs.webkit.org/show_bug.cgi?id=144826) for re-snapping after a
scroller's content changes. For now, you can simulate this behaviour by adding
the following code to event listeners to force a snapping to execute:
```javascript
scroller.scrollBy(0,0);
```
However, this will not guarantee that the scroller snaps back to the same
element.

## Background
### CSS Scroll Snap
The CSS Scroll Snap feature allows web developers to create well-controlled
scroll experiences by declaring scroll snapping positions. These positions
ensure that scrollable content is properly aligned with its container to
overcome the issues of imprecise scrolling. In other words, scroll snapping:
- Prevents awkward scroll positions when scrolling.
- Creates the effect of paging through content.

Paginated articles and image carousels are two common use cases for scroll
snaps.
<figure class="w-figure">
  {% Img src="image/admin/MzdzDJ2j4jJtfAYgg9e6.png", alt="Example of CSS scroll snap.", width="800", height="356" %}
  <figcaption class="w-figcaption">Example of CSS scroll snap. At the end of
    scrolling an image's horizontal center is aligned with the horizontal center
    of the scroll container.
  </figcaption>
</figure>

### Shortcomings
<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/snap-after-layout/resizing-breaks-snap-positions.webm" type="video/webm;">
    <source src="https://storage.googleapis.com/web-dev-assets/snap-after-layout/resizing-breaks-snap-positions.mp4" type="video/mp4;">
  </video>
 <figcaption class="w-figcaption">
    Snap positions get lost when resizing a window.
  </figcaption>
</figure>

Scroll snapping allows users to effortlessly navigate through content, but its
inability to adapt to changes in content and layout blocks some of its potential
benefits. As shown in the [example](https://codepen.io/argyleink/pen/MWWpOmz)
above, users have to re-adjust scroll positions whenever resizing a window to
find the previously snapped element. Some common scenarios that cause layout
change are:
- Resizing a window
- Rotating a device
- Opening DevTools

The first two scenarios make CSS Scroll Snap less appealing for users and the
third one is a nightmare for developers when debugging. Developers also need to
consider these shortcomings when trying to make a dynamic experience that
supports actions such as adding, removing, or moving content.

A common fix for this is to add listeners that execute a programmatic scroll via
JavaScript to force snapping to execute whenever any of these mentioned layout
changes happen. This workaround can be ineffective when the user expects the
scroller to snap back to the same content as before. Any further handling with
JavaScript seems to almost defeat the purpose of this CSS feature.

## Built-in support for re-snapping after layout changes in Chrome 81
The mentioned shortcomings no longer exist in Chrome 81: scrollers will remain
snapped even after changing layout. They will re-evaluate scroll positions after
changing their layout, and re-snap to the closest snap position if necessary. If
the scroller was previously snapped to an element that still exists after the
layout change, then the scroller will try to snap back to it. Pay attention to
what happens when the layout changes in the following
[example](https://codepen.io/argyleink/full/YzXyOaX).

<div class="w-columns">
{% Compare 'worse', 'Snap position lost' %}
<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/snap-after-layout/snap-positions-lost.webm" type="video/webm;">
    <source src="https://storage.googleapis.com/web-dev-assets/snap-after-layout/snap-positions-lost.mp4" type="video/mp4;">
  </video>
</figure>

{% CompareCaption %}
Rotating a device **does not** preserve the snap positions in Chrome 80.
After scrolling to the slide that says `NOPE` and changing the device orientation
from portrait to landscape, a blank screen is shown, which indicates that the
scroll snap position was lost.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Snap position preserved' %}
<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/snap-after-layout/snap-positions-preserved.webm" type="video/webm;">
    <source src="https://storage.googleapis.com/web-dev-assets/snap-after-layout/snap-positions-preserved.mp4" type="video/mp4;">
  </video>
</figure>

{% CompareCaption %}
Rotating a device **does** preserve the snap positions in Chrome 81. The slide that
says `NOPE` remains in view even though the device orientation changes multiple times.
{% endCompareCaption %}

{% endCompare %}
</div>

See the [Re-snapping after layout changes
specification](https://drafts.csswg.org/css-scroll-snap-1/#re-snap) for more
details.

{% Aside 'caution' %} Snapping is also executed when the page loads. This
affects the initial scroll offset of scrollers using the scroll snap feature.
{% endAside %}

## Example: Sticky scrollbars
With "Snap after layout changes", developers can implement sticky scrollbars with a few
lines of CSS:
```css
.container {
  scroll-snap-type: y proximity;
}

.container::after {
  scroll-snap-align: end;
  display: block;
}
```
Want to learn more? See the following [demo chat
UI](https://codepen.io/argyleink/pen/RwPWqKe) for visuals.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/snap-after-layout/scroll-snap-bottom.webm" type="video/webm;">
    <source src="https://storage.googleapis.com/web-dev-assets/snap-after-layout/scroll-snap-bottom.mp4" type="video/mp4;">
  </video>
  <figcaption class="w-figcaption">
    Adding a new message triggers re-snap which makes it stick to the bottom in
    Chrome 81.
  </figcaption>
</figure>

## Future work
All re-snapping scroll effects are currently instant; a potential follow-up is
to support re-snapping with [smooth scrolling
effects](https://developers.google.com/web/updates/2016/02/smooth-scrolling-in-chrome-49).
See the [specification issue](https://github.com/w3c/csswg-drafts/issues/4609)
for details.

## Feedback

Your feedback is invaluable in making re-snapping after layout changes better, so go on
and try it out and [let the Chromium engineers
know](https://bugs.chromium.org/p/chromium/issues/detail?id=866127) what you
think.
