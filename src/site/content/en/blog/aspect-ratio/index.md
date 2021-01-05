---
title: 'Maintaining Aspect Ratio in CSS'
subhead: TBD
authors:
  - una
date: 2021-01-12
hero: hero.jpg
alt: Image of colorful telephones resized with the same aspect ratio.
description: TBD
tags:
  - blog
  - css
---

Aspect ratio is a width-to-height ratio. When resizing some media, in many cases, a design calls to maintain this ratio and ensure the image resizes in an even distribution.

<figure class="w-figure">
  <img class="w-screenshot" src="aspect-ratio.jpg" alt="">
  <figcaption class="w-figcaption">
    Two images with the same aspect ratio. One is 634 x 951px while the other is 200 x 300px. Both have a 2:3 aspect ratio.
  </figcaption>
</figure>

## Why maintain aspect ratio

With the advent of responsive design, maintaining aspect ratio has been increasingly challenging for web developers. Historically, it has been difficult to maintain a layout size and place media like video, iframes, and background images fit within a parent block. To resolve this, the CSS `object-fit` property emerged, which enables users describe how content within a block should fill that block:

<figure class="w-figure">
  <img class="w-screenshot" src="coffees.jpg" alt="">
  <figcaption class="w-figcaption">
    Showcasing various <code>object-fit</code> values. See <a href="https://codepen.io/una/pen/mdrLGjR">demo on Codepen</a>.
  </figcaption>
</figure>

The `initial` and fill value will re-adjust the image to fill the space. In our example, this causes the image to be squished and blurry, as it re-adjusts pixels. This is not ideal. `object-fit: cover` uses the image’s smallest dimension to fill the space and crops the image to fit into it based on this dimension. It “zooms in at its lowest boundary. `object-fit: contain` will ensure that the entire image is always visible, and so the opposite of `cover`: where it takes the largest boundary (in our example above this is width), and resize the image to maintain its intrinsic aspect-ratio while fitting into the space. The `object-fit: none` case shows the image cropped in it’s center (default object position) at its natural size.

`object-fit: cover` tends to work in most situations to ensure a nice uniform interface when dealing with images of varying dimensions, however, you lose data this way (the image is cropped at its longest edges). 



If these details are important (for example, when working with a flat lay of beauty products), cropping important content is not acceptable. So the ideal scenario would be responsive images of varying sizes that fit the UI space without cropping.

## Maintaining aspect ratio with `padding-top`

In order to make these more responsive, we can use aspect-ratio. This allows for us to set a specific ratio size and base the rest of the media on an individual axis (height or width).

A currently well-accepted cross-browser solution for maintaining aspect ratio based on an image’s width is known as the “Padding-top Hack”. And it does feel like a hack. This solution requires a parent container and an absolutely placed child container. One would then calculate the aspect ratio as a percentage to set as the `padding-top`. For example:

1:1 aspect ratio = 1 / 1 = 1 = `padding-top: 100%`
4:3 aspect ratio = 3 / 4 = 0.75 = `padding-top: 75%`
3:2 aspect ratio = 2 / 3 = 0.66666 = `padding-top: 66.67%`
16:9 aspect ratio = 9 / 16 = 0.5625 = `padding-top: 56.25%`

Now that we have identified the aspect ratio value, we can apply that to our parent container. Consider the following example:

<figure class="w-figure">
  <img class="w-screenshot" src="aspectratio-current.jpg" alt="">
  <figcaption class="w-figcaption">
    Using `padding-top` to set an aspect ration on images within a carousel.
  </figcaption>
</figure>


```html
<div class=”container”>
  <img class=”media” src=”...” alt=””>
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

Unfortunately, calculating these `padding-top` values is not very intuitive, and requires some additional overhead and positioning. With the new intrinsic `aspect-ratio` [CSS property](https://www.w3.org/TR/css-sizing-4/#aspect-ratio), coming to Chromium 88, the language for maintaining aspect ratios is much more clear.

With the same markup, we can replace: `padding-top: 56.25%` with `aspect-ratio: 16 / 9`, setting `aspect-ratio` to a specified ratio of `width` / `height`.

<figure class="w-figure">
  <img class="w-screenshot" src="aspectratio-future.jpg" alt="">
  <figcaption class="w-figcaption">
    Using `aspect-ratio` to set an aspect ration on images within a carousel.
  </figcaption>
</figure>

--- WEB.DEV MARKUP TO SHOW LEFT AND RIGHT w/BEFORE and AFTER ---

Photos by [Amy Shamblen](https://unsplash.com/photos/TXg_38oImi0) and [Lionel Gustave](https://unsplash.com/photos/c1rOy44wuts) via Unsplash.