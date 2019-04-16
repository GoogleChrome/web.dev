---
layout: post
title: Preload key requests
description: |
  Learn about the uses-rel-preload audit.
author: megginkearney
web_lighthouse:
  - uses-rel-preload
---

The Opportunities section of your Lighthouse report lists all key requests
that aren't yet prioritizing fetch requests with `<link rel=preload>`:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="uses-rel-preload.png" alt="Preload key requests">
  <figcaption class="w-figcaption">
    Fig. 1 — Preload key requests
  </figcaption>
</figure>

## More information

- [Preload key requests audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/uses-rel-preload.js)