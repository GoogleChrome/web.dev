---
layout: post
title: Has a viewport tag with width or initial-scale
description: |
  Learn about `viewport` audit.
web_lighthouse:
  - viewport
---

Without a viewport meta tag, mobile devices render pages at typical desktop
screen widths, and then scale the pages to fit the mobile screens.
Lighthouse flags pages without a viewport:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="viewport.png" alt="Lighthouse audit shows page is missing a viewport">
  <figcaption class="w-figcaption">
    Fig. 1 — Page is missing a viewport
  </figcaption>
</figure>

## How this audit fails

Lighthouse checks that there's a `<meta name="viewport">` tag in the `<head>`
of the document. It also checks that the node contains a `content` attribute
and that the value of this attribute contains the text `width=`. However,
it does not check that `width` equals `device-width`. Lighthouse also does not
check for a `initial-scale` key-value pair.

## Recommendations

Add a viewport `<meta>` tag in the `<head>` of your HTML:

```html
<head>
  ...
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ...
</head>
```

The `width=device-width` key-value pair sets the width of the viewport to
the width of the device. The `initial-scale=1` key-value pair sets the initial
zoom level when visiting the page.

## Why you should include a viewport

Setting the viewport enables you to control the width and scaling of the viewport.
Check out the following links to learn more:

- [Configure the Viewport](/https://developers.google.com/speed/docs/insights/ConfigureViewport)
- [Set the Viewport](https://developers.google.com/web/fundamentals/design-and-ux/responsive/#set-the-viewport)

{% include 'content/lighthouse-pwa/scoring.njk' %}

## More information

[Page doesn't have a viewport audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/viewport.js)