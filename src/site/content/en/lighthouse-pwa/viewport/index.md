---
layout: post
title: Does not have a `<meta name="viewport">` tag with `width` or `initial-scale`
description: |
  Learn about the "Does not have a <meta name="viewport"> tag with width or
  initial-scale" Lighthouse audit.
date: 2019-05-02
updated: 2019-08-20
web_lighthouse:
  - viewport
---

Many search engines rank pages based on how mobile-friendly they are.
Without a [viewport meta tag](https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag),
mobile devices render pages at typical desktop screen widths and then scale the
pages down, making them difficult to read.

Setting the viewport meta tag lets you control the
width and scaling of the viewport so that it's sized correctly on all devices.

## How the Lighthouse viewport meta tag audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages
without a viewport meta tag:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/g9La56duNlpHZntDnzY9.png", alt="Lighthouse audit shows page is missing a viewport", width="800", height="76", class="w-screenshot w-screenshot" %}
</figure>

A page fails the audit unless all of these conditions are met:
- The document's `<head>` contains a `<meta name="viewport">` tag.
- The viewport meta tag contains a `content` attribute.
- The `content` attribute's value includes the text `width=`.

Lighthouse _doesn't_ check that `width` equals `device-width`. It also doesn't
check for an `initial-scale` key-value pair. However, you still need to include
both for your page to render correctly on mobile devices.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to add a viewport meta tag

Add a viewport `<meta>` tag with the appropriate key-value pairs to the `<head>`
of your page:

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <meta name="viewport" content="width=device-width, initial-scale=1">
    …
  </head>
  …
```

Here's what each key-value pair does:
- `width=device-width` sets the width of the viewport to the width of the device.
- `initial-scale=1` sets the initial zoom level when the user visits the page.

## Resources

- [Source code for **Has a `<meta name="viewport">` tag with `width` or `initial-scale`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/viewport.js)
- [Responsive Web Design Basics](https://developers.google.com/web/fundamentals/design-and-ux/responsive/#set-the-viewport)
- [Using the viewport meta tag to control layout on mobile browsers](https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag)
