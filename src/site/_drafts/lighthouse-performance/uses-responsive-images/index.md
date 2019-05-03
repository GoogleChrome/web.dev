---
layout: post
title: Properly size images
description: |
  Learn about the uses-responsive-images audit.
author: megginkearney
web_lighthouse:
  - uses-responsive-images
---

The Opportunities section of your Lighthouse report lists all images in your page
that aren't appropriately sized,
along with the potential savings in kilobytes (KB).
Resize these images to save data and improve page load time:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="uses-responsive-images.png" alt="Properly size images">
  <figcaption class="w-figcaption">
    Fig. 1 — Properly size images
  </figcaption>
</figure>

## More information

- [Properly size images audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-responsive-images.js)
- [Serve images with correct dimensions codelab](/fast/serve-images-with-correct-dimensions/codelab-serve-images-correct-dimensions)