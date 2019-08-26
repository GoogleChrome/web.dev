---
layout: post
title: Detected JavaScript libraries
description: |
  Learn about the "Detected JavaScript libraries" Lighthouse audit.
web_lighthouse:
  - js-libraries
---

Lighthouse lists all front-end JavaScript libraries detected on the page:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="js-libraries.png" alt="Lighthouse audit showing all front-end JavaScript libraries detected on page">
  <figcaption class="w-figcaption">
    Page uses these front-end JavaScript libraries.
  </figcaption>
</figure>

## This is a diagnostic audit

This audit simply lists all front-end JavaScript libraries.
Lighthouse also reports
[front-end JavaScript libraries with known security risks](/no-vulnerable-libraries).
Watch closely for these vulnerabities.

## Resources

[Source code for **Detected JavaScript libraries** audit](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/js-libraries.js)
