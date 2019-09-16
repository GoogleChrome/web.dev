---
layout: post
title: Background and foreground colors do not have a sufficient contrast ratio
description: |
  Learn how to improve your web page's accessibility by making sure that
  all text has sufficient color contrast.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - color-contrast
---

Some people with low vision experience low contrast.
Everything tends to appear about the same brightness,
which makes it hard to distinguish outlines, borders, edges, and details.

Text that is too close in luminance (brightness) to the background can be hard to read,
especially for people with low vision,
but all users can benefit from sufficient contrast.

## How the Lighthouse color contrast audit fails

Lighthouse flags text whose background and
foreground colors don't have a sufficiently high contrast ratio:

<figure class="w-figure">
  <img class="w-screenshot" src="color-contrast.png" alt="Lighthouse audit showing background and foreground colors do not have sufficient contrast ratio">
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to make text have sufficient color contrast

Ensure color contrast of at least 4.5:1 for small text or 3:1 for large text.
Large text is defined as 18pt or 14pt bold.

Try the Color Contrast Analyzer in
[Text elements must have sufficient color contrast against the background](https://dequeuniversity.com/rules/axe/3.3/color-contrast).

## Resources

- [Source code for **Background and foreground colors do not have a sufficient contrast ratio** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/color-contrast.js)
- [Text elements must have sufficient color contrast against the background](https://dequeuniversity.com/rules/axe/3.3/color-contrast)
