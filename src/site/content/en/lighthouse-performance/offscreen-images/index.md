---
layout: post
title: Defer offscreen images
description: |
  Learn about the offscreen-images audit.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - offscreen-images
---

The Opportunities section of your Lighthouse report lists
all offscreen or hidden images in your page
along with the potential savings in kilobytes (KB).
Consider lazy-loading these images
after all critical resources have finished loading
to lower [Time to Interactive](/interactive):

<figure class="w-figure">
  <img class="w-screenshot" src="offscreen-images.png" alt="A screenshot of the Lighthouse Defer offscreen images audit">
</figure>

See also [Lazy load offscreen images with lazysizes codelab](/codelab-use-lazysizes-to-lazyload-images).

## Bug: `loading="lazy"` images are incorrectly flagged

This audit incorrectly flags [natively lazy-loaded images](/native-lazy-loading/).
See [issue #6677](https://github.com/GoogleChrome/lighthouse/issues/6677) for details.

## Resources

- [Source code for **Defer offscreen images** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/offscreen-images.js)
