---
layout: post
title: Minify CSS
description: |
  Learn about the unminified-css audit.
author: megginkearney
web_lighthouse:
  - unminified-css
---

The Opportunities section of your Lighthouse report lists
all unminified CSS files,
along with the potential savings in kilobytes (KB)
when these files are minified:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="unminified-css.png" alt="Minify CSS">
  <figcaption class="w-figcaption">
    Fig. 1 — Minify CSS
  </figcaption>
</figure>

## More information

- [Unminified CSS audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unminified-css.js)
- [Minify CSS](/fast/minify-css)