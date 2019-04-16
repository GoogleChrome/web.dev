---
layout: post
title: Preload key requests
description: |
  Learn about the uses-rel-preconnect audit.
author: megginkearney
web_lighthouse:
  - uses-rel-preconnect
---

The Opportunities section of your Lighthouse report lists all URLs
requested later in the page load.
Consider using <link rel=preload> to prioritize fetching resources
that are currently requested later in page load:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="uses-rel-preconnect.png" alt="Preconnect to required origins">
  <figcaption class="w-figcaption">
    Fig. 1 — Preconnect to required origins
  </figcaption>
</figure>

## More information

- [Preconnect to required origins audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/uses-rel-preconnect.js)