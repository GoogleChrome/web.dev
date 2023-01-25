---
title: 'New aspect-ratio CSS property supported in Chromium, Safari Technology Preview, and Firefox Nightly'
subhead: The new CSS property that helps maintain spacing in responsive layouts.
authors:
  - una
date: 2021-01-28
hero: image/admin/I14dS86oJT2f0uHaDLEM.jpg
alt: Image of colorful telephones resized with the same aspect ratio.
description: Maintaining aspect ratio within images and elements is now
    easier to achieve with the new aspect-ratio CSS property.
tags:
  - blog
  - css
---

{% Aside %}

Summary: Maintaining a consistent width-to-height ratio, called an *aspect ratio*, is critical in
responsive web design and for preventing [cumulative layout shift](/cls/). Now,
there's a more straightforward way to do this with the new `aspect-ratio` property launching in
[Chromium 88](https://www.chromestatus.com/feature/5738050678161408), [Firefox
87](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Experimental_features#property_aspect-ratio), and [Safari Technology Preview
118](https://developer.apple.com/safari/technology-preview/release-notes/).

{% endAside %}

## Aspect ratio

Aspect ratio is most commonly expressed as two integers and a colon in the dimensions of:
width:height, or x:y. The most common aspect ratios for photography are 4:3 and 3:2, while video,
and more recent consumer cameras, tend to have a 16:9 aspect ratio.

<figure class="w-figure">
  {% Img src="image/admin/od54hUUe21UABpbWxSFG.jpg", alt="Two images with the same aspect ratio. One is 634 x 951px while the other is 200 x 300px. Both have a 2:3 aspect ratio.", width="800", height="526", class="w-screenshot" %}
  <figcaption class="w-figcaption">Two images with the same aspect ratio. One is 634 x 951px while the other is 200 x 300px. Both have a 2:3 aspect ratio.</figcaption>
</figure>

With the advent of responsive design, maintaining aspect ratio has been increasingly important for
web developers, especially as image dimensions differ and element sizes shift based on available
space.

Some examples of where maintaining aspect ratio become important are:

- Creating responsive iframes, where they are 100% of a parent's width, and the height should remain
  a specific viewport ratio
- Creating intrinsic placeholder containers for images, [videos](http://fitvidsjs.com/), and embeds
  to prevent re-layout when the items load and take up space
- Creating uniform, responsive space for interactive data visualizations or SVG animations
- Creating uniform, responsive space for multi-element components such as cards or calendar dates
- Creating uniform, responsive space for multiple images of varying dimension (can be used alongside
  `object-fit`)

## Object-fit

Defining an aspect ratio helps us with sizing media in a responsive context. Another tool in this
bucket is the `object-fit` property, which enables users to describe how an object (such an as image)
within a block should fill that block:

<figure class="w-figure">
  {% Img src="image/admin/A7uj6u5MULodlw4lVsI2.jpg", alt="Object-fit demo visualization", width="800", height="236", class="w-screenshot" %}
  <figcaption class="w-figcaption">Showcasing various <code>object-fit</code> values. See <a href="https://codepen.io/una/pen/mdrLGjR">demo on Codepen</a>.</figcaption>
</figure>

The `initial` and `fill` values re-adjust the image to fill the space. In our example, this causes
the image to be squished and blurry, as it re-adjusts pixels. Not ideal. `object-fit: cover` uses
the image's smallest dimension to fill the space and crops the image to fit into it based on this
dimension. It "zooms in" at its lowest boundary. `object-fit: contain` ensures that the entire image
is always visible, and so the opposite of `cover`, where it takes the size of the largest boundary
(in our example above this is width), and resizes the image to maintain its intrinsic aspect ratio
while fitting into the space. The `object-fit: none` case shows the image cropped in its center
(default object position) at its natural size.

`object-fit: cover` tends to work in most situations to ensure a nice uniform interface when dealing
with images of varying dimensions, however, you lose information this way (the image is cropped at
its longest edges).

If these details are important (for example, when working with a flat lay of beauty products),
cropping important content is not acceptable. So the ideal scenario would be responsive images of
varying sizes that fit the UI space without cropping.

## The old hack: maintaining aspect ratio with `padding-top`

<figure class="w-figure">
  {% Img src="image/admin/j3YJicINXjly349uEEUt.jpg", alt="Using padding-top to set a 1:1 aspect ratio on post preview images within a carousel.", width="800", height="296", class="w-screenshot" %}
  <figcaption class="w-figcaption"> Using <code>padding-top</code> to set a 1:1 aspect ratio on post preview images within a carousel.</figcaption>
</figure>

In order to make these more responsive, we can use aspect ratio. This allows for us to set a
specific ratio size and base the rest of the media on an individual axis (height or width).

A currently well-accepted cross-browser solution for maintaining aspect ratio based on an image's
width is known as the "Padding-Top Hack". This solution requires a parent container and an
absolutely placed child container. One would then calculate the aspect ratio as a percentage to set
as the `padding-top`. For example:

- 1:1 aspect ratio = 1 / 1 = 1 = `padding-top: 100%`
- 4:3 aspect ratio = 3 / 4 = 0.75 = `padding-top: 75%`
- 3:2 aspect ratio = 2 / 3 = 0.66666 = `padding-top: 66.67%`
- 16:9 aspect ratio = 9 / 16 = 0.5625 = `padding-top: 56.25%`

Now that we have identified the aspect ratio value, we can apply that to our parent container.
Consider the following example:

```html
<div class="container">
  <img class="media" src="..." alt="...">
</div>
```

We could then write the following CSS:

```css
.container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.media {
  position: absolute;
  top: 0;
}
```

## Maintaining aspect ratio with `aspect-ratio`

<figure class="w-figure">
  {% Img src="image/admin/XT8PbPiYx1IJq3Pvmanz.jpg", alt="Using aspect-ratio to set a 1:1 aspect ratio on post preview images within a carousel.", width="800", height="296", class="w-screenshot" %}
  <figcaption class="w-figcaption">Using <code>aspect-ratio</code> to set a 1:1 aspect ratio on post preview images within a carousel.</figcaption>
</figure>

Unfortunately, calculating these `padding-top` values is not very intuitive, and requires some
additional overhead and positioning. With the new intrinsic `aspect-ratio` [CSS
property](https://drafts.csswg.org/css-sizing-4/#aspect-ratio), the language for maintaining aspect
ratios is much more clear.

With the same markup, we can replace: `padding-top: 56.25%` with `aspect-ratio: 16 / 9`, setting
`aspect-ratio` to a specified ratio of `width` / `height`.

<div class="w-columns">
{% Compare 'worse', 'Using padding-top' %}
```css
.container {
  width: 100%;
  padding-top: 56.25%;
}
```
{% endCompare %}

{% Compare 'better', 'Using aspect-ratio' %}
```css
.container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
```
{% endCompare %}
</div>

Using `aspect-ratio` instead of `padding-top` is much more clear, and does not overhaul the padding
property to do something outside of its usual scope.

This new property also adds the ability to
set aspect ratio to `auto`, where "replaced elements with an intrinsic aspect ratio use that aspect
ratio; otherwise the box has no preferred aspect ratio." If both `auto` and a `<ratio>` are
specified together, the preferred aspect ratio is the specified ratio of `width` divided by `height` unless
it is a [replaced element](https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element) with
an intrinsic aspect ratio, in which case that aspect ratio is used instead.

## Example: consistency in a grid

This works really well with CSS layout mechanisms like CSS Grid and Flexbox as well. Consider a list
with children that you want to maintain a 1:1 aspect ratio, such as a grid of sponsor icons:

```html
<ul class="sponsor-grid">
  <li class="sponsor">
    <img src="..." alt="..."/>
  </li>
  <li class="sponsor">
    <img src="..." alt="..."/>
  </li>
</ul>
```

```css
.sponsor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.sponsor img {
  aspect-ratio: 1 / 1;
  width: 100%;
  object-fit: contain;
}
```

<figure class="w-figure">
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/aspect-ratio/gridimages2.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Images in a grid with their parent element at various aspect ratio dimensions. <a href="https://codepen.io/una/pen/PoGddaw">See demo on Codepen.</a>
  </figcaption>
</figure>

## Example: preventing layout shift

Another great feature of `aspect-ratio` is that it can create placeholder space to prevent
[Cumulative Layout Shift](/cls/) and deliver better [Web Vitals](/learn-web-vitals/). In this first
example, loading an asset from an API such as [Unsplash](https://source.unsplash.com/) creates a
layout shift when the media is finished loading.

<figure class="w-figure">
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/aspect-ratio/aspect-ratio-missing.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Video of cumulative layout shift that happens when no aspect ratio is set on a loaded asset. This video is recorded with an emulated 3G network.
  </figcaption>
</figure>

Using `aspect-ratio`, on the other hand, creates a placeholder to prevent this layout shift:

```css
img {
  width: 100%;
  aspect-ratio: 8 / 6;
}
```

<figure class="w-figure">
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/aspect-ratio/aspect-ratio-set.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Video with a set aspect ratio is set on a loaded asset. This video is recorded with an emulated 3G network. <a href="https://codepen.io/una/pen/GRjLZmG">See demo on Codepen.</a>
  </figcaption>
</figure>

### Bonus tip: image attributes for aspect ratio

Another way to set an image's aspect ratio is through [image attributes](https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/). If you know the dimensions of the image ahead of time, it is a [best practice](/image-aspect-ratio/#check-the-image's-width-and-height-attributes-in-the-html) to
set these dimensions as its `width` and `height`.

For our example above, knowing the dimensions are 800px by 600px, the image markup would look like: `<img src="image.jpg"
alt="..." width="800" height="600">`. If the image sent has the same aspect
ratio, but not necessarily those exact pixel values, we could still use image
attribute values to set the ratio, combined with a style of `width: 100%` so
that the image takes up the proper space. All together that would look like:

```markup
<!-- Markup -->
<img src="image.jpg" alt="..." width="8" height="6">
```

```css
/* CSS */
img {
  width: 100%;
}
```

In the end, the effect is the same as setting the `aspect-ratio` on the
image via CSS, and cumulative layout shift is avoided ([see demo on
Codepen](https://codepen.io/una/pen/gOwJWoz)).

## Conclusion

With the new `aspect-ratio` CSS property, launching across multiple modern browsers, maintaining proper
aspect ratios in your media and layout containers gets a little bit more straightforward.


Photos by [Amy Shamblen](https://unsplash.com/photos/TXg_38oImi0) and [Lionel
Gustave](https://unsplash.com/photos/c1rOy44wuts) via Unsplash.
