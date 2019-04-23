---
layout: post
title: Enable text compression
description: |
  Learn about the uses-text-compression audit.
author: megginkearney
web_lighthouse:
  - uses-text-conmpression
---

The Opportunities section of your Lighthouse report lists all text-based resources
that aren't compressed. 
Text-based resources should be served with compression
(gzip, deflate or brotli) to minimize total network bytes:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="uses-text-compression.png" alt="Enable text compression">
  <figcaption class="w-figcaption">
    Fig. 1 — Enable text compression
  </figcaption>
</figure>

## More information

- [Enable text compression audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-text-compression.js)