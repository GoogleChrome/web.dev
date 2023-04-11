---
layout: post
title: "New to the web platform in November"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during November 2022.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during November 2022.
date: 2022-11-30
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/zS2ZSLPhuxBXwPuelJNi.jpg
alt: View through a porthole to the sea.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In November, [Firefox 107](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/107), and [Chrome 108](https://developer.chrome.com/blog/new-in-chrome-108/) became stable. Let's take a look at what this means for the web platform.

### A change to Layout Viewport behavior in Chrome on Android

There's a change to how the Layout Viewport behaves from Chrome 108 on Android when the on-screen keyboard is shown. Read [Prepare for viewport resize behavior changes coming to Chrome on Android](https://developer.chrome.com/blog/viewport-resize-behavior/) to learn more.

### New viewport units

Also in Chrome 108 are the new CSS Viewport Units. These include small (`svw`, `svh`, `svi`, `svb`, `svmin`, `svmax`), large (`lvw`, `lvh`, `lvi`, `lvb`, `lvmin`, `lvmax`), dynamic (`dvw`, `dvh`, `dvi`, `dvb`, `dvmin`, `dvmax`), and logical (`vi`, `vb`) units. These units are already implemented in Firefox and Safari, meaning that we now have interop across the three main browser engines for these units.

Read [The large, small, and dynamic viewport units](/viewport-units/).

{% BrowserCompat 'css.types.length.viewport_percentage_units_large' %}

The [`contain-intrinsic-size`](https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-size) shorthand CSS property is supported in Firefox 107, along with the longhand [`contain-intrinsic-width`](https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-width), [`contain-intrinsic-height`](https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-height) and logical properties [`contain-intrinsic-block-size`](https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-block-size) and [`contain-intrinsic-inline-size`](https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-inline-size).

These are applied to specify the size of a UI element that is subject to size containment. This allows a user agent to determine the size of an element without needing to render its child elements. They are useful when an element is subject to [size containment](https://developer.mozilla.org/docs/Web/CSS/CSS_Containment#size_containment).

{% BrowserCompat 'css.properties.contain-intrinsic-size' %}

### Support for the CSS fragmentation `avoid` keyword

Chrome 108 includes support for the `avoid` value of the CSS fragmentation properties `break-before`, `break-after`, and `break-inside` when printing. This value tell the browser to avoid breaking before, after or inside the element it is applied to. For example, the following CSS avoids a figure being broken at a page break.

```css
figure {
    break-inside: avoid;
}
```

This addition is due to the inclusion of print support using LayoutNG, this brings a modern, lessy buggy experience. [Learn more about LayoutNG](https://developer.chrome.com/articles/layoutng/).

### Federated Credential Management API

The Federated Credential Management API (FedCM) provides an abstraction for federated identity flows on the web. It exposes a browser mediated dialog that allows users to choose accounts from identify providers to login to websites. FedCM is shipping in Chrome 108, find out more about it in the [FedCM announcement blog post](https://developer.chrome.com/blog/fedcm-shipping/).


## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. Due to where release dates fall, the only new beta this month is [Firefox 108](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/108), with [Safari 16.2 beta](https://developer.apple.com/documentation/safari-release-notes/safari-16_2-release-notes) still ongoing.

Firefox 108 supports `height` and `width` attributes for the [`<source>`](https://developer.mozilla.org/docs/Web/HTML/Element/source) element, when it is a child of a `<picture>` element. These attributes accept the height or width of the image, in pixels, as an integer without a unit.

Implementation of container queries is underway in Firefox. Behind the `layout.css.container-queries.enabled` flag in Firefox 108 beta, you will find the container query length units—`cqw`, `cqh`, `cqi`, `cqb`, `cqmin`, `cqmax`. These are units of length relative to the size of a query container.

_Photo by [Matt Seymour](https://unsplash.com/@mattseymour?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)._
