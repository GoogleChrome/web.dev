---
layout: post
title: Detected JavaScript libraries
description: |
  Learn about Lighthouse's diagnostic "Detected JavaScript libraries" audit.
web_lighthouse:
  - js-libraries
date: 2019-05-02
updated: 2020-06-24
---

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) lists all front-end JavaScript libraries detected on the page:

<figure class="w-figure">
  <img class="w-screenshot" src="js-libraries.png" alt="Lighthouse audit showing all front-end JavaScript libraries detected on page">
</figure>

## This is a diagnostic audit

This audit simply lists all the front-end JavaScript libraries your page uses.

Lighthouse also reports
[front-end JavaScript libraries with known security risks](/no-vulnerable-libraries).
Make sure to update any insecure libraries.

## Resources

[Source code for **Detected JavaScript libraries** audit](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/js-libraries.js)
