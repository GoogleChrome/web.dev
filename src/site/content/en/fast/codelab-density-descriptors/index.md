---
layout: codelab
title: Use density descriptors
authors:
  - katiehempenius
description: |
  In this codelab, learn how to use density descriptors and srcset to load
  images with the right pixel density for the user's device.
glitch: responsive-images-density-descriptors
date: 2018-11-05
related_post: serve-responsive-images
tags:
  - performance
---

## Explore This Demo

{% Instruction 'preview' %}
- Reload the page using different devices to see the browser load different
  images.

You can use the device emulator for this. If you're looking for specific display
densities, here are some devices to try:

<div class="w-table-wrapper">
  <table>
    <tbody>
      <tr>
        <td>1x density</td>
        <td>Blackberry Playbook, many external monitors</td>
      </tr>
      <tr>
        <td>2x density</td>
        <td>iPad or IPhone 5/6</td>
      </tr>
      <tr>
        <td>3x density</td>
        <td>Galaxy S5 or iPhone X</td>
      </tr>
    </tbody>
  </table>
</div>

- Checkout `index.html` for the code that makes this work.

## How does it work?

The concept of density descriptors may be unfamiliar to most folks. To better
understand them, it helps to have a bit of background on how the browser works
with pixels.

## What are pixels

Let's start at the very beginning by defining what a pixel is. This sounds
simple, but "pixel" can actually have many meanings:

<dl>
  <dt>
    Device pixel (a.k.a. "physical pixel")
  </dt>
  <dd>
    The smallest dot of color that can be displayed on a device.
  </dd>
  <dt>
    Logical pixel
  </dt>
  <dd>
    Information that specifies the color at a particular location on a grid.
    This type of pixel has no inherent physical size.
  </dd>
  <dt>
    CSS pixel
  </dt>
  <dd>
    The CSS spec defines a pixel as a unit of physical measurement. 1 pixel =
1/96th of an inch.
  </dd>
</dl>

## Pixel Density

Pixel density (also referred to as "screen density" or "display density")
measures _the density of device pixels in a given physical area_. This is
commonly measured using pixels per inch (ppi).

For many years, 96 ppi was a very common display density (hence CSS defining a
pixel as 1/96th of an inch). Starting in the 1980s it was the default resolution
of Windows. In addition, it was the resolution of [CRT
monitors](https://en.wikipedia.org/wiki/Cathode_ray_tube).

This began to change as LED monitors became common in the 2000s. In particular,
Apple made a big splash in 2010 when it introduced Retina displays. These
displays had a minimum resolution of 192 ppi, which was twice the resolution of
"regular" displays (192 ppi/96 ppi = 2).

## window.devicePixelRatio

With the introduction of newer display technology, "device pixels" began to vary
in physical size and [shape](https://en.wikipedia.org/wiki/Pixel_aspect_ratio)
and were no longer the same size as "CSS pixels". The need to define the
relationship between the size of "device pixels" and "CSS pixels" is what led to
the introduction of the `devicePixelRatio` (sometimes called the "CSS Pixel
Ratio").

`devicePixelRatio` defines the relationship between device pixels and CSS pixels
for a particular device. A 192 ppi device has a `devicePixelRatio` of 2 (192
ppi/96 ppi = 2) because "2 of its display pixels are the size of 1 CSS pixel".

These days most devices have a device-pixel-ratio between 1.0 and 4.0.

{% Aside %}
This ratio doesn't have to be a whole number. `1.5`, `2.4`, and `2.5` are all
device-pixel-ratios of common devices.
{% endAside %}

- Determine the pixel density of a device by typing `window.devicePixelRatio`
in the console.

- View [this table](https://www.mydevice.io/#tab1) to see the pixel ratios of
common devices. Most are between 1.0 and 4.0.

So how do you actually apply this information?

## Size images based on device-pixel-ratios

In order for images to look their very best on high resolution screens, it's
necessary to provide different image versions for different `devicePixelRatios`.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Device Pixel Ratio</th>
        <th>Indicates that:</th>
        <th>
          On this device, an &lt;img&gt; tag with a CSS width of 250 pixels, will
          look best when the source image is...
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>1 device pixel = 1 CSS pixel</td>
        <td>250 pixels wide</td>
      </tr>
      <tr>
        <td>2</td>
        <td>2 device pixels = 1 CSS pixel</td>
        <td>500 pixels wide</td>
      </tr>
      <tr>
        <td>3</td>
        <td>3 device pixels = 1 CSS pixel</td>
        <td>750 pixels wide</td>
      </tr>
    </tbody>
  </table>
</div>

Things to note:

+  The pixel dimensions listed in image editors, file directories, and
    other places are a measurement of logical pixels.
+  For higher resolution screens and larger displays you'll need images with
    larger dimensions. Merely enlarging smaller images defeats the purpose of
    serving multiple image versions. The browser would have done this anyway if
    a high resolution image was not provided.

{% Aside %}
Tools like [sharp](https://www.npmjs.com/package/sharp) make it easy
to create multiple sizes of an image. This is covered in more detail here.
{% endAside %}

## Use Density Descriptors to serve multiple <br> images

Density descriptors, in conjunction with the "srcset " attribute, can be used to
serve different images to different devicePixelRatios.

- Take a look at the `index.html` file and note the `<img>` element.

```html
<img src="flower.jpg"
  srcset="flower-1x.jpg 1x,
          flower-2x.jpg 2x,
          flower-3x.jpg 3x">
```

This example put into words:

-  `1x`, `2x`, and `3x` are all density descriptors that tell the browser
    the pixel density that an image is intended for. This saves the browser
    from needing to download an image to determine this information.
-  The browser can choose between three images: `flower-1x.jpg` (intended
    for browsers with a `1.0` pixel density), `flower-2x.jpg` (intended for
    browsers with a `2.0` pixel density), and `flower-3x.jpg` (intended for
    browsers with a `3.0` pixel density).
-  `flower.jpg` is the fallback image for browsers that do not support
    `srcset`.

How to use this:
- Use a devicePixelRatio and the `x` unit to write density descriptors. For
example, the density descriptor for many Retina screens
(`window.devicePixelRatio = 2`) would be written as `2x`.
- If a density descriptor isn't provided, it is assumed to be `1x`.
- Including density descriptors in filenames is a common convention (and will
help you keep track of files) but is not necessary. Images can have any
filename.
- There is no need to include a `sizes` attribute. The `sizes` attribute is only
used with width descriptors.
