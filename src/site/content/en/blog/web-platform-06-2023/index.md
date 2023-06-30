---
layout: post
title: "New to the web platform in June"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during June 2023.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during June 2023.
date: 2023-06-30
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/NM89OHbrQizcSeWCjbaG.jpg
alt: ''
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In June 2023 [Firefox 114](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/114) became stable, so it's a single browser issue this month. Check out the beta browser releases section for details of several features that are about to become interoperable once those betas become stable.

{% Aside 'caution' %}
We include browser compatibility data pulled from MDN in these posts which may not have been updated yet for very recent browser releases. The post will show the correct information as soon as it appears in the [browser-compat-data release](https://github.com/mdn/browser-compat-data/releases).
{% endAside %}

### WebTransport API

Firefox 114 includes the [WebTransport API](https://developer.mozilla.org/docs/Web/API/WebTransport_API), a modern update to WebSockets providing support for multiple streams, unidirectional streams, and out-of-order delivery.

{% BrowserCompat 'api.WebTransport' %}

### The SVG `crossorigin` attribute

Firefox 114 also includes the [`crossorigin` attribute](https://developer.mozilla.org/docs/Web/SVG/Attribute/crossorigin), on the `<image>` and `<feImage>` elements in SVG, provides support for configuration of the Cross-Origin Resource Sharing (CORS) requests for the element's fetched data. This works in the same way as the HTML [`crossorigin`](https://developer.mozilla.org/docs/Web/HTML/Attributes/crossorigin) attribute.

{% BrowserCompat 'api.SVGImageElement.crossOrigin' %}

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. New betas are [Firefox 115](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/115), and [Safari 17](https://developer.apple.com/documentation/safari-release-notes/safari-16_6-release-notes) with [Chrome 115](https://developer.chrome.com/blog/chrome-115-beta/) and [Safari 16.6](https://developer.apple.com/documentation/safari-release-notes/safari-16_6-release-notes) still ongoing. These releases bring many great features to the platform. Check out the release notes for all of the details, here are just a few highlights.

Firefox 115 supports the CSS [`animation-composition`](https://developer.mozilla.org/docs/Web/CSS/animation-composition) property. Once this version of Firefox becomes stable on July 4th, `animation-composition` will be supported in all three major engines. Learn more in the article [Specify how multiple animation effects should composite with animation-composition](https://developer.chrome.com/articles/css-animation-composition/).

Also reaching interoperability with Firefox 115 are a set of methods for `Array` and `TypedArray`.  `Array.toReversed()`, `Array.toSorted()`, `Array.toSpliced()`, `Array.with()`, `TypedArrays.toReversed()`, `TypedArrays.toSorted()`, and `TypedArrays.with()` return a new array with elements that have been shallow copied.

There is a whole stack of new features and fixes in the Safari 17 beta. Safari 17 adds [Web Apps](https://blog.tomayac.com/2023/06/07/web-apps-on-macos-sonoma-14-beta/) to macOS Sonoma. This means you can add a website to the Dock from the File menu or Share Sheet, and it will open in its own window.

Safari 17 also brings some features to interoperable status—[`contain-intrinsic-size`](https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-size), [`@counter-style`](https://developer.mozilla.org/docs/Web/CSS/@counter-style), [@font-face size-adjust](https://developer.mozilla.org/docs/Web/CSS/@font-face/size-adjust), and the [`overflow-block`](https://developer.mozilla.org/docs/Web/CSS/@media/overflow-block) and [`overflow-inline`](https://developer.mozilla.org/docs/Web/CSS/@media/overflow-inline) media features will be available in all major engines when Safari 17 ships.


_Photo by [Rodrigo Abreu](https://unsplash.com/@rodrigospabreu)._
