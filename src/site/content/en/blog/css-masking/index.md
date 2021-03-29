---
title: Apply effects to images with CSS's mask-image property
subhead: >
  CSS masking gives you the option of using an image as a mask layer.
  This means that you can use an image, an SVG, or a gradient as your mask,
  to create interesting effects without an image editor.
description: >
  CSS masking gives you the option of using an image as a mask layer.
  This means that you can use an image, an SVG, or a gradient as your mask,
  to create interesting effects without an image editor.
authors:
  - rachelandrew
date: 2020-09-14
hero: image/admin/uNWkHLVFNcTDk09OplrA.jpg
alt: A teddy bear wearing a facemask.
tags:
  - blog
  - css
feedback:
  - api
---

When you [clip an element](/css-clipping) using the `clip-path` property the clipped area becomes invisible.
If instead you want to make part of the image opaque or apply some other effect to it, then you need to use masking.
This post explains how to use the [`mask-image`](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image) property in CSS,
which lets you specify an image to use as a mask layer.
This gives you three options. You can use an image file as your mask, an SVG, or a gradient.

## Browser compatibility

Most browsers only have partial support for the standard CSS masking property.
You will need to use the `-webkit-` prefix in addition to the standard property in order to achieve the best browser compatibility.
See [Can I use CSS Masks?](https://caniuse.com/#feat=css-masks) for full browser support information.

While browser support using the prefixed property is good,
when using masking to make text on top of an image visible take care of what will happen if masking is unavailable.
It may be worth using feature queries to detect support for `mask-image` or `-webkit-mask-image`
and providing a readable fallback before adding your masked version.

```css
@supports(-webkit-mask-image: url(#mask)) or (mask-image: url(#mask)) {
  /* code that requires mask-image here. */
}
```

## Masking with an image

The `mask-image` property works in a similar way to the `background-image` property.
Use a `url()` value to pass in an image.
Your mask image needs to have a transparent or semi-transparent area.

A fully transparent area will cause the part of the image under that area to be invisible.
Using an area which is semi-transparent however will allow some of the original image to show through.
You can see the difference in the Glitch below.
The first image is the original image of balloons with no mask.
The second image has a mask applied which has a white star on a fully transparent background.
The third image has a white star on a background with a gradient transparency.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/mask-image?path=index.html&previewSize=100"
    title="mask-image on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

In this example I am also using the `mask-size` property with a value of `cover`.
This property works in the same way as [`background-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size).
You can use the keywords `cover` and `contain` or you can give the background a size using any valid length unit, or a percentage.

You can also repeat your mask just as you might repeat a background image,
in order to use a small image as a repeating pattern.

## Masking with SVG

Rather than using an image file as the mask, you could use SVG.
There are a couple of ways this can be achieved.
The first is to have a `<mask>` element inside the SVG and reference the ID of that element in the `mask-image` property.

```html
<svg width="0" height="0" viewBox="0 0 400 300">
  <defs>
    <mask id="mask">
      <rect fill="#000000" x="0" y="0" width="400" height="300"></rect>
      <circle fill="#FFFFFF" cx="150" cy="150" r="100" />
      <circle fill="#FFFFFF" cx="50" cy="50" r="150" />
    </mask>
  </defs>
</svg>

<div class="container">
    <img src="balloons.jpg" alt="Balloons">
</div>
```

```css
.container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  -webkit-mask-image: url(#mask);
  mask-image: url(#mask);
}
```

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3HnPhISiVazDTwezxfcy.jpg", alt="An example of using an SVG mask", width="699", height="490", class="w-screenshot" %}
</figure>

The advantage of this approach is that the mask could be applied to any HTML element, not just an image.
Unfortunately Firefox is the only browser that supports this approach.

All is not lost however, as for the most common scenario of masking an image,
we can include the image in the SVG.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/mask-image-svg-image?path=README.md&previewSize=100"
    title="mask-image-svg-image on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Masking with a gradient

Using a CSS gradient as your mask is an elegant way of achieving a masked area without needing to go to the trouble of creating an image or SVG.

A simple linear gradient used as a mask could ensure that the bottom part of an image will not be too dark underneath a caption, for example.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/mask-linear-gradient?path=README.md&previewSize=100"
    title="mask-linear-gradient on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

You can use any of the supported gradient types, and get as creative as you like.
This next example uses a radial gradient to create a circular mask to illuminate behind the caption.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/mask-radial-gradient?path=README.md&previewSize=100"
    title="mask-radial-gradient on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Using multiple masks

As with background images you can specify multiple mask sources,
combining them to get the effect that you want.
This is particularly useful if you want to use a pattern generated with CSS gradients as your mask.
These typically will use multiple background images and so can be translated easily into a mask.

As an example, I found a nice checkerboard pattern in [this article](https://cssgradient.io/blog/gradient-patterns/).
The code, using background images, looks like this:

```css
background-image:
  linear-gradient(45deg, #ccc 25%, transparent 25%),
  linear-gradient(-45deg, #ccc 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #ccc 75%),
  linear-gradient(-45deg, transparent 75%, #ccc 75%);
background-size:20px 20px;
background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

To turn this, or any other pattern designed for background images, into a mask,
you will need to replace the `background-*` properties with the relevant `mask` properties,
including the `-webkit` prefixed ones.

```css
-webkit-mask-image:
  linear-gradient(45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(-45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(45deg, rgba(0,0,0,0.2) 75%, #000000 75%),
  linear-gradient(-45deg, rgba(0,0,0,0.2) 75%, #000000 75%);
-webkit-mask-size:20px 20px;
  -webkit-mask-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

There are some really nice effects to be made by applying gradient patterns to images.
Try remixing the Glitch and testing out some other variations.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/mask-checkers?path=README.md&previewSize=100"
    title="mask-checkers on Glitch"
    allow="encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Along with clipping,
CSS masks are a way to add interest to images and other HTML elements without needing to use a graphics application.

_<span>Photo by <a href="https://unsplash.com/@juliorionaldo">Julio Rionaldo</a> on Unsplash</span>._
