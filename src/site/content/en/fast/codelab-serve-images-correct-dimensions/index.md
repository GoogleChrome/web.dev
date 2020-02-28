---
layout: codelab
title: Serve images with correct dimensions
authors:
  - katiehempenius
description: |
  In this codelab, learn how to serve images with the correct dimensions to
  improve network performance.
date: 2018-11-05
glitch: correct-dimensions
related_post: serve-images-with-correct-dimensions
---

## Run Lighthouse

This Glitch is small enough that its images could be inspected by hand. However
for most websites, using a tool like Lighthouse to automate this is essential.

{% Instruction 'preview', 'ol' %}
{% Instruction 'audit-performance', 'ol' %}
1. Look for the results of the **Properly Size Images** audit.

<img class="w-screenshot" src="./notfixed-properly-size-images.png" alt="The
properly size images audit failing in Lighthouse.">

The Lighthouse audit shows that both of this page's images need to be resized.

## Fix `flower_logo.png`

Start at the top of the page and fix the logo image.

- Inspect `flower_logo.png` in the DevTools Elements panel.

<img class="w-screenshot" src="./elements-panel-logo.png" alt="The DevTools
elements panel">

This is the CSS for `flower_logo.png`:

```css
.logo {
  width: 50px;
  height: 50px;
}
```

The CSS width of this image is 50 pixels, so `flower_logo.png` should be resized
to match. You can use [ImageMagick](https://www.imagemagick.org) to resize the
image to fit. ImageMagick is a CLI tool for image editing that comes
pre-installed in the codelab environment.

{% Instruction 'remix', 'ol' %}
{% Instruction 'console', 'ol' %}
1. In the console, type:

```bash
convert flower_logo.png -resize 50x50 flower_logo.png
```

## Fix flower_photo.jpg

Next, fix the photo of the purple flowers.

- Inspect `flower_photo.jpg` in the DevTools elements panel.

<img class="w-screenshot" src="./elements-panel-photo.png" alt="The DevTools
elements panel">

This is the CSS for `flower_photo.jpg`:

```css
.photo {
  width: 50vw;
  margin: 30px auto;
  border: 1px solid black;
}
```

`50vw` sets the CSS width of `flower_photo.jpg` to "half the width of
the browser."  
([1vw](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Values_and_units)
is equal to 1% the width of the browser).

The ideal size for this image would depend on the device it is being viewed on,
so you should resize it to a size that works well for most of your users. You
can check your analytics data to learn which screen resolutions are common
amongst your users:

<img class="w-screenshot" src="./screen-resolution.png" alt="Google analytics of
screen resolutions.">

This data indicates that 95%+ of the visitors to this site use screen
resolutions 1920 pixels wide or less.

Using this information we can calculate how wide the image should be:  
(1920 pixels wide) * (50% of browser width) = 960 pixels

On resolutions greater than 1920 pixels wide, the image will be stretched to
cover the area. The resized image is still fairly large, so the effects of this
should not be very noticeable.

- Use [ImageMagick](https://www.imagemagick.org) to resize the image to 960
pixels wide. In the terminal type:

```bash
# macOS/Linux
convert flower_photo.jpg -resize 960x flower_photo.jpg

# Windows
magick convert flower_photo.jpg -resize 960x flower_photo.jpg
```

{% Aside %}
`960x` is not a typo; it specifies a width, but not a height. The
image height will be scaled in proportion to the width. This is a handy trick
for when you only care about an image's dimensions in one direction.
{% endAside %}

## Re-Run Lighthouse

- Re-run the Lighthouse Performance audit to verify that you have successfully
re-sized the images.

<img class="w-screenshot" src="./fixed-properly-size-images.png" alt="Lighthouse
properly size images audit.">

… And it fails! Why is that?

Lighthouse runs its tests on a Nexus 5x. The Nexus 5x has a 1080 x 1920 screen.
For the Nexus 5x, the optimal size of `flower_photo.jpg` would be 540 pixels
wide (1080 pixels * . 5). This is much smaller than our resized image.

Should you resize the image to be even smaller? Probably. However, the answer to
this isn't always clear-cut.

The trade-off here is between image quality on high-resolution devices and
performance. It's easy to overestimate how closely users will be inspecting
images—so you should probably make them smaller—but there are
certainly use cases where image quality is more important.

The good news is that you can bypass this tradeoff altogether by using
responsive images to serve multiple images sizes. You can learn more about this
in the [Responsive Images guide](/serve-responsive-images).
