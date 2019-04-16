---
layout: post
title: Efficiently encode images
description: |
  Learn about the uses-optimized-images audit.
author: megginkearney
web_lighthouse:
  - uses-optimized-images
---

The Opportunities section of your Lighthouse report lists
all unoptimized images, with potential savings in killobytes.
Optimize these images so that the page loads faster and consumes less data:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="uses-optimized-images.png" alt="Efficiently encode images">
  <figcaption class="w-figcaption">
    Fig. 1 — Efficiently encode images
  </figcaption>
</figure>


## More information

- [Efficiently encode images audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-optimized-images.js)
- [Use Imagemin to compress images](https://web.dev/fast/use-imagemin-to-compress-images)