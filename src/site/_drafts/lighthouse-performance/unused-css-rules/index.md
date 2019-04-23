---
layout: post
title: Remove unused CSS
description: |
  Learn about the unused-css-rules audit.
author: megginkearney
web_lighthouse:
  - unused-css-rules
---

The Opportunities section of your Lighthouse report lists
all stylesheets with unused CSS.
Remove the unused CSS
to reduce unnecessary bytes consumed by network activity:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="unused-css-rules.png" alt="Remove unused CSS">
  <figcaption class="w-figcaption">
    Fig. 1 — Remove unused CSS
  </figcaption>
</figure>

## More information

- [Remove unused CSS audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/render-blocking-resources.js)
- [Defer non-critical CSS](https://web.dev/fast/defer-non-critical-css)