---
layout: post
title: "Not all ARIA input fields have accessible names"
description: |
  Learn how to improve your web page's accessibility by making sure that
  screen reader users can access the names of your input fields.
date: 2019-10-17
web_lighthouse:
  - aria-input-field-name
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

********

## How Lighthouse identifies inputs with inaccessible names

[Lighthouse](https://developers.google.com/web/tools/lighthouse)
flags input fields whose names aren't accessible to assistive technologies:

<figure class="w-figure">
  <img class="w-screenshot" src="aria-input-field-name.png"
    alt="Lighthouse audit showing input elements with inaccessible names">
</figure>

*******

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add accessible names to your input fields



## Resources

<a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-input-field-name.js" rel="noopener">Source code for **Not all ARIA input fields have accessible names** audit</a>
