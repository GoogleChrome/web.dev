---
layout: post
title: "New to the web platform in January"
subhead: >
  Discover some of the interesting features that have landed in stable and beta web browsers during January 2022. 
description: >
  Discover some of the interesting features that have landed in stable and beta web browsers during January 2022.
date: 2022-02-01
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/8j6GZWWy9wpuQfTOkrJy.png
alt: Balloons launching.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In January, Chrome 97 and Firefox 96 became stable.

Firefox 96 shipped the color function [`hwb()`](https://developer.mozilla.org/docs/Web/CSS/color_value/hwb()). This function expresses a color by hue, whiteness, and blackness.

{% BrowserCompat 'css.types.color.hwb' %}

Also in Firefox 96 is the CSS [`color-scheme`](https://developer.mozilla.org/docs/Web/CSS/color-scheme) property. This property gives you a way to indicate the color schemes an element can be rendered in. For example, to indicate that `.widget` can be rendered in the operating system's light or dark modes, use the following CSS.

```css
.widget {
  color-scheme: light dark;
}
```

With color-scheme landing in Firefox, this means the property is available in Chrome, Firefox, and Safari.

{% BrowserCompat 'css.properties.color-scheme' %}

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release.

The betas for January were [Chrome 98](https://blog.chromium.org/2022/01/chrome-98-beta-color-gradient-vector.html), [Firefox 97](https://www.mozilla.org/en-US/firefox/97.0beta/releasenotes/), and Safari 15.4 Beta 1.

Chrome 98 supports COLRv1 color gradient vector fonts as an additional new font format. A color font contains glyphs with multiple colors in them, which can be for example an emoji or a country flag or a multi-colored letter.

Read more about this new font format in [COLRv1 Color Gradient Vector Fonts in Chrome 98](https://developer.chrome.com/blog/colrv1-fonts/).

Also included is the [structuredClone()](/structured-clone/) method for making deep copies of objects, and the CSS media queries `dynamic-range` and `video-dynamic-range`. Find more features to test in the [Chrome 98 Beta post](https://blog.chromium.org/2022/01/chrome-98-beta-color-gradient-vector.html).

[Chrome 98 DevTools](https://developer.chrome.com/blog/new-in-devtools-98/) brings you a whole collection of new features including the new [Full Accessibility Tree](https://developer.chrome.com/blog/full-accessibility-tree/).

Firefox 97 Beta supports the `cap` and `ic` units for [`length`](https://developer.mozilla.org/docs/Web/CSS/length), and also implements the [`scrollbar-gutter`](https://developer.mozilla.org/docs/Web/CSS/scrollbar-gutter) property. 

There is a whole collection of good things included in Safari 15.4 Beta. Features include implementation of the [::backdrop](https://developer.mozilla.org/docs/Web/CSS/::backdrop) pseudo-element, [:focus-visible](https://developer.mozilla.org/docs/Web/CSS/:focus-visible) pseudo-class, the [accent-color](/accent-color/) property, and CSS Containment with the [contain](https://developer.mozilla.org/docs/Web/CSS/contain) property. This beta also includes the HTML [&lt;dialog&gt;](https://developer.mozilla.org/docs/Web/HTML/Element/dialog) element, the `lazy` attribute on images to enable [lazy-loading](/browser-level-image-lazy-loading/), plus support for Web App Manifest icons.

All of these beta features will land in stable browsers soon.

_Hero image by [ian dooley](https://unsplash.com/@sadswim?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)._
  
