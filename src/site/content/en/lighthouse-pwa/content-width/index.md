---
layout: post
title: Content is not sized correctly for the viewport
description: |
  Learn about `content-width` audit.
date: 2019-05-02
web_lighthouse:
  - content-width
---

When content width is smaller or larger than viewport width,
that's often a cue that the page is not optimized for mobile screens.
This audit checks that the width of the content on your page is equal
to the width of the viewport:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="content-width.png" alt="Lighthouse audit showing content not correctly sized for viewport">
  <figcaption class="w-figcaption">
    Content not correctly sized for viewport.
  </figcaption>
</figure>

## How this audit fails

The audit fails if `window.innerWidth` does not equal `window.outerWidth`.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Recommendations

This audit is a roundabout way of determining
if your page is optimized for mobile devices.
If your site is not optimized and you want it to be, then see
[Responsive Web Design Basics](https://developers.google.com/web/fundamentals/design-and-ux/responsive/)
to get started.

You can ignore this audit if:

- Your site does not need to be optimized for mobile screens.
- The content width of your page is intentionally smaller or larger than the
  viewport width.

## More information

[Content not sized correctly for viewport audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/content-width.js)
