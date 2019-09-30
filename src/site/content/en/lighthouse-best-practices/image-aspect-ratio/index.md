---
layout: post
title: Displays images with incorrect aspect ratio
description: |
  Learn how to display responsive images with the correct aspect ratio.
web_lighthouse:
  - image-aspect-ratio
date: 2019-05-02
updated: 2019-08-28
---

If a rendered image has an aspect ratio that's significantly different
from the aspect ratio in its source file (the _natural_ aspect ratio),
the rendered image may look distorted,
possibly creating an unpleasant user experience.

## How the Lighthouse image aspect ratio audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags any
image with a rendered aspect ratio
5 percent or more different from its natural ratio:

<figure class="w-figure">
  <img class="w-screenshot" src="image-aspect-ratio.png" alt="Lighthouse audit shows images displayed with incorrect aspect ratio">
</figure>

There are two common causes for an incorrect image aspect ratio:

- An image is set to explicit width and height values that differ from the source image's dimensions.
- An image is set to a width and height as a percentage of a variably-sized container.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Ensure images display with the correct aspect ratio

There are two places to check for incorrect image dimensions: your CSS and
the `<img>` tag in your HTML.

### Check the CSS that affects the image's aspect ratio
If you're having trouble finding the CSS that's causing the incorrect aspect ratio,
Chrome DevTools can show you the CSS declarations that affect a given image.
See Google's [View only the CSS that's actually applied to an element](https://developers.google.com/web/tools/chrome-devtools/css/reference#computed)
page for more information.


### Check the image's `width` and `height` attributes in the HTML

When possible, it's good practice to specify each image's `width` and `height`
attributes in your HTML so that the browser can allocate space for the image.
This approach helps to ensure that content below the image doesn't shift once
the image is loaded.

However, specifying image dimensions in HTML can be difficult
if you're working with responsive images
because there's no way to know the width and height
until you know the viewport dimensions. Consider using the
[CSS Aspect Ratio](https://www.npmjs.com/package/css-aspect-ratio) library or
[aspect ratio boxes](https://css-tricks.com/aspect-ratio-boxes/)
to help preserve aspect ratios for responsive images.

Finally, check out the [Serve images with correct dimensions](/serve-images-with-correct-dimensions)
post to learn how to serve images that are the right size for each user's device.

## Resources

- [Source code for **Displays images with incorrect aspect ratio** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/image-aspect-ratio.js)
- [CSS Aspect Ratio](https://www.npmjs.com/package/css-aspect-ratio)
- [Aspect Ratio Boxes](https://css-tricks.com/aspect-ratio-boxes/)
- [Serve images with correct dimensions](/serve-images-with-correct-dimensions)
