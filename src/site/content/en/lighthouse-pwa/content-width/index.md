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

The viewport is the part of the browser window
in which your page's content is visible.
When your page's content width is smaller or larger than the viewport width,
it may not render correctly on mobile screens.
For example, if the content width is too large,
content may be scaled down to fit, making text difficult to read.

## How the Lighthouse content width audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages whose width isn't equal to the width of the viewport:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/y8JKlbJTu7ERetHUGuaA.png", alt="Lighthouse audit showing content not correctly sized for viewport", width="800", height="98", class="w-screenshot" %}
</figure>

The audit fails if `window.innerWidth` does not equal `window.outerWidth`.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to make your page fit on mobile screens

This audit is a roundabout way of determining
if your page is optimized for mobile devices.
See Google's
[Responsive Web Design Basics](https://developers.google.com/web/fundamentals/design-and-ux/responsive/)
for an overview of how to create a mobile-friendly page.

You can ignore this audit if:

- Your site does not need to be optimized for mobile screens.
- The content width of your page is intentionally smaller or larger than the
  viewport width.

## Resources

- [Source code for **Content is not sized correctly for the viewport** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/content-width.js)
- [Responsive Web Design Basics](https://developers.google.com/web/fundamentals/design-and-ux/responsive/)
