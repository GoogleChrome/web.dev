---
layout: post
title: Content is not sized correctly for the viewport
description: |
  Learn how to size your web page content to fit on mobile screens.
web_lighthouse:
  - content-width
date: 2019-05-04
updated: 2019-09-19
---

When content width is smaller or larger than viewport width,
that's often a cue that the page is not optimized for mobile screens.

## How the Lighthouse content width audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages whose width isn't equal to the width of the viewport:

<figure class="w-figure">
  <img class="w-screenshot" src="content-width.png" alt="Lighthouse audit showing content not correctly sized for viewport">
</figure>

The audit fails if `window.innerWidth` does not equal `window.outerWidth`.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to make your page fit on mobile screens

This audit is a roundabout way of determining
if your page is optimized for mobile devices.
If your site is not optimized and you want it to be, then see
[Responsive Web Design Basics](https://developers.google.com/web/fundamentals/design-and-ux/responsive/)
to get started.

You can ignore this audit if:

- Your site does not need to be optimized for mobile screens.
- The content width of your page is intentionally smaller or larger than the
  viewport width.

## Resources

- [Source code for **Content is not sized correctly for the viewport** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/content-width.js)
- [Responsive Web Design Basics](https://developers.google.com/web/fundamentals/design-and-ux/responsive/)
