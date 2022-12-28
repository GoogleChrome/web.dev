---
layout: post
title: "New to the web platform in December"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during December 2022.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during December 2022.
date: 2022-12-28
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/OtTl9DZJArFDEmUfbF7b.jpg
alt: Tree and winter lights in soft focus.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In December, [Firefox 108](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/108), and [Safari 16.2](https://developer.apple.com/documentation/safari-release-notes/safari-16_2-release-notes) became stable. Let's take a look at what this means for the web platform.

### Support for `height` and `width` attributes of `<source>`

Firefox 108 supports `height` and `width` attributes for the [`<source>`](https://developer.mozilla.org/docs/Web/HTML/Element/source) element, when it is a child of a `<picture>` element. These attributes accept the height or width of the image, in pixels, as an integer without a unit.

{% BrowserCompat 'html.elements.source.height' %}

### Trigonometric CSS functions

Firefox also now supports trigonometric functions in CSS—`sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()`, and `atan2()`.

{% BrowserCompat 'css.types.sin' %}

### Support for last baseline in all three engines

In addition to a number of CSS fixes, Safari 16.2 includes `last baseline` alignment for CSS grid and flexbox layout, which means this feature now supported in the three main browser engines. 

### CSS `font-variant-alternates`

Safari also adds support for additional values for the `font-variant-alternates` CSS property: annotation(value-name), character-variant(value-name), ornaments(value-name), styleset(value-name), stylistic(value-name), swash(value-name), along with the associated `@font-feature-values` at-rule.

{% BrowserCompat 'css.properties.font-variant-alternates' %}

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. New betas are [Firefox 109](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/109), [Safari 16.3](https://developer.apple.com/documentation/safari-release-notes/safari-16_3-release-notes), and [Chrome 109](https://developer.chrome.com/blog/chrome-109-beta/). 

The only new feature listed for Safari 16.3 is the addition of the Content-Security-Policy (CSP) [`prefetch-src`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/prefetch-src) directive. There are also a number of fixes in this beta.

Chrome 109 supports [MathML](https://developer.mozilla.org/docs/Web/MathML) Core, a language for describing mathematical notation embeddable in HTML and SVG. 

New in Chrome on Android is [Secure Payment Confirmation](https://developer.chrome.com/blog/spc-on-android/) (SPC). This is a proposed web standard that allows customers to authenticate with a credit card issuer, bank, or other payment service provider using a platform authenticator—typically activated with a device's screen unlock feature such as a fingerprint sensor.

Also new for Chrome on Android is the Origin Private File System (OPFS), part of the File System Access API on Android. This includes all of the File System Access API surface, minus the `show{OpenFile, SaveFile, Directory}Picker()` methods and the Drag and Drop API integration.

For CSS in Chrome we have the `lh` length unit. This unit is equivalent to the computed value of the line-height property on the element on which it is used. Also, the `hyphenate-limit-chars` property specifying the minimum number of characters in a hyphenated word. 

At the time of writing, and perhaps due to the holiday season, Firefox release notes haven't been updated.

## Other news

This post marks the 12th edition of this [blog post series](/tags/new-to-the-web/), bringing you a selection of interesting things landing in browsers each month in 2022. I'll be back in 2023 to continue sharing some of the interesting things landing on the web platform each month.

Many of the features landing in browsers over this past year, and lots of those things mentioned as "CSS fixes," were part of Interop 2022. For more information, read the Chrome team's [end-of-year report](/interop-2022-wrapup/) on this cross-browser initiative to improve some of the top interoperability pain points on the web platform.

And finally, of interest to people who read this post, is this [list of updates](https://developer.mozilla.org//plus/updates) based on the MDN browser compatibility data, released by our friends over at MDN. 
  
_Photo by [Patrick Hendry](https://unsplash.com/@worldsbetweenlines?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)._
  