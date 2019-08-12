---
layout: post
title: Has a <meta name="viewport"> tag with width or initial-scale
description: |
  Learn about the "Has a <meta name="viewport"> tag with width or initial-scale"
  Lighthouse audit.
web_lighthouse:
  - viewport
---

Without a [viewport meta tag](https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag),
mobile devices render pages at typical desktop screen widths and then scale the
pages to fit mobile screens. Setting the viewport meta tag lets you control the
width and scaling of the viewport so that it's sized correctly on all devices.

Lighthouse flags pages without a viewport meta tag:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="viewport.png" alt="Lighthouse audit shows page is missing a viewport">
</figure>

{% Aside 'note' %}
Google Search started boosting the ranking of mobile-friendly pages
on mobile search results in 2015.
See [Rolling out the mobile-friendly update](https://webmasters.googleblog.com/2015/04/rolling-out-mobile-friendly-update.html).
{% endAside %}

## How this audit fails

Lighthouse checks that there's a `<meta name="viewport">` tag in the `<head>`
of the document. It also checks that the tag contains a `content` attribute
and that the value of this attribute contains the text `width=`. However,
it doesn't check that `width` equals `device-width`. Lighthouse also doesn't
check for an `initial-scale` key-value pair.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to add a viewport meta tag

Add a viewport `<meta>` tag to the `<head>` of your page:

```html
<!doctype html>
<html lang="en">
  <head>
    …
    <meta name="viewport" content="width=device-width, initial-scale=1">
    …
  </head>
  <body>
    …
  </body>
</html>
```

Here's what each key-value pair does:
- `width=device-width` sets the width of the viewport to the width of the device.
- `initial-scale=1` sets the initial zoom level when the user visits the page.

## More information

- [**Has a `<meta name="viewport">` tag with `width` or `initial-scale`** audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/viewport.js)
- [Set the viewport](https://developers.google.com/web/fundamentals/design-and-ux/responsive/#set-the-viewport) on [Web Fundamentals](https://developers.google.com/web/fundamentals/)
