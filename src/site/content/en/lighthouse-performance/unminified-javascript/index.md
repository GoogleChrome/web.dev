---
layout: post
title: Minify JavaScript
description: |
  Learn about the unminified-javascript audit.
author: megginkearney
web_lighthouse:
  - unminified-javascript
---

The Opportunities section of your Lighthouse report lists
all unminified JavaScript files,
along with the potential savings in kilobytes (KB)
when these files are minified:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="unminified-javascript.png" alt="Minify JavaScript">
  <figcaption class="w-figcaption">
    Fig. 1 — Minify JavaScript
  </figcaption>
</figure>

## More information

- [Unminified JavaScript audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unminified-javascript.js)
- [Minify and compress network payloads with gzip codelab](/fast/reduce-network-payloads-using-text-compression/codelab-text-compression)
- [Minify and compress network payloads with brotli](/fast/reduce-network-payloads-using-text-compression/codelab-text-compression-brotli)