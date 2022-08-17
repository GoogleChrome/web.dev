---
layout: post
title: "New to the web platform in February"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during February 2022. 
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during February 2022.
date: 2022-03-02
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/BSVGQQg5QVVwhibIwsTG.jpg
alt: Layers of color.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In February, Chrome 98 and Firefox 97 became stable.

Chrome 98 shipped the `self.structuredClone` method. It creates a deep clone of a value using the structured clone algorithm. [Read more about `structuredClone()`](/structured-clone/).

{% BrowserCompat 'api.structuredClone' %}

Firefox 97 includes [Cascade Layers](https://developer.mozilla.org/docs/Web/CSS/@layer). The `@layer` at-rule defines a cascade layer, helping you to control specificity.

```css
@layer framework {
  /* creates a new layer named framework */
}
```

Firefox is the first browser to land this in a release version. However, check out the section of this post on [beta releases](#beta-browser-releases), as it won't be too long before this feature is available everywhere. Find out more about Cascade Layers in [Cacade layers are coming to your browser](https://developer.chrome.com/blog/cascade-layers/).

{% BrowserCompat 'css.at-rules.layer' %}

Firefox also lands the [`scrollbar-gutter`](https://developer.mozilla.org/docs/Web/CSS/scrollbar-gutter) property. This property helps to remove layout shifts caused by a scrollbar appearing as content grows. 

A scrollbar gutter is the space between the inner border edge and the outer padding edge. This is where a scrollbar will appear if needed. If no scrollbar is present, the gutter displays as an extension of the padding. The following CSS would add spacing accounting for the scrollbar size to both sides of the box, to keep the appearance symmetrical.

```css
.container {
  scrollbar-gutter: stable both-edges;
}
```

{% BrowserCompat 'css.properties.scrollbar-gutter' %}

Chrome 98 supports COLRv1 color gradient vector fonts as an additional new font format. A color font contains glyphs with multiple colors in them, which can be for example an emoji or a country flag or a multi-colored letter.

Read more about this new font format in [COLRv1 Color Gradient Vector Fonts in Chrome 98](https://developer.chrome.com/blog/colrv1-fonts/).

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release.

New betas in February were [Chrome 99](https://blog.chromium.org/2022/02/chrome-99-css-cascade-layers-new-picker.html), and [Firefox 98](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/98). Safari Beta 15.4 is still ongoing, I covered some of the things included [last month](/web-platform-01-2022/).

Chrome 99 includes Cascade Layers, with Cascade Layers also in [Safari Beta 15.4](https://developer.apple.com/documentation/safari-release-notes/safari-15_4-release-notes) we can expect to see this feature in all evergreen browsers very soon.

Also in Chrome 99 are several new attributes for `CanvasRenderingContext2D`, and a new `showPicker()` method on `HTMLInputElement` which is a way to [show a browser picker for date, time, color, and files](https://developer.chrome.com/blog/show-picker/). 

In Firefox 98 you'll find the [`<dialog>`](https://developer.mozilla.org/docs/Web/HTML/Element/dialog) element. Another feature that will be in all evergreen browsers once the Firefox and Safari betas become stable. 

All of these beta features will land in stable browsers soon.

_Hero image by [Erfan Moradi](https://unsplash.com/@eurphan)_
  