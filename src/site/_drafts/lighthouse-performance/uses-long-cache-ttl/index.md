---
layout: post
title: Serve static assets with an efficient cache policy
description: |
  Learn about the uses-long-cache-ttl audit.
author: megginkearney
web_lighthouse:
  - uses-long-cache-ttle
---

A long cache lifetime can speed up repeat visits to your page.
Lighthouse reports all static resources that aren't cached
in the Diagnostics section: 

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="uses-long-cache-ttl.png" alt="Lighthouse: Serve static assets with an efficient cache policy">
  <figcaption class="w-figcaption">
    Fig. 1 — Serve static assets with an efficient cache policy
  </figcaption>
</figure>

## More information

- [Serve static assets with an efficient cache policy](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-long-cache-ttl.js)