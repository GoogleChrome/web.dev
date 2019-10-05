---
layout: post
title: Minimize main-thread work
description: |
  Learn about the mainthread-work-breakdown audit.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - mainthread-work-breakdown
---

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
shows a breakdown of where CPU time was spent while the browser loads your page:

<figure class="w-figure">
  <img class="w-screenshot" src="mainthread-work-breakdown.png" alt="A screenshot of the Lighthouse Minimize main-thread work audit">
</figure>

## How to reduce load on the main thread

Many activities, like parsing CSS and laying out the page,
can keep the main thread busy.
However, parsing, compiling, and executing JavaScript is often the
the biggest source of work on the main thread.
Consider these tactics to improve JavaScript performance during page load:

- [Reduce JavaScript payloads with code splitting](/reduce-javascript-payloads-with-code-splitting).
- [Remove unused code](/remove-unused-code).
- [Minify and compress network payloads](/reduce-network-payloads-using-text-compression).

For other ways to improve page load, check out the
[Performance audits landing page](/lighthouse-performance).

## Resources

[Source code for **Minimize main-thread work** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/mainthread-work-breakdown.js)
