---
layout: post
title: Minimize main-thread work
description: |
  Learn about the mainthread-work-breakdown audit.
author: megginkearney
web_lighthouse:
  - mainthread-work-breakdown
---

Consider reducing the time spent parsing, compiling, and executing JS.
Lighthouse shows a breakdown of execution timings on the main thread
in the Diagnostics section:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="mainthread-work-breakdown.png" alt="Lighthouse: Minimize main-thread work">
  <figcaption class="w-figcaption">
    Fig. 1 — Minimize main-thread work
  </figcaption>
</figure>

## More information

- [Minimize main-thread work audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/mainthread-work-breakdown.js)