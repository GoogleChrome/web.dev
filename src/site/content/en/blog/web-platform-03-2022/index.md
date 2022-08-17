---
layout: post
title: "New to the web platform in March"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during March 2022. 
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during March 2022.
date: 2022-03-31
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/PTLdV9YgDfQdXSW9PnL2.jpg
alt: A DJ cross-fading tracks.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In March, [Chrome 99](https://developer.chrome.com/blog/new-in-chrome-99/), [Chrome 100](https://developer.chrome.com/blog/new-in-chrome-100/), [Firefox 98](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/98), and [Safari 15.4](https://developer.apple.com/documentation/safari-release-notes/safari-15_4-release-notes) became stable. This brought a whole batch of new features to the platform, and many of these additions meant that the feature became available in all three browser engines. In this post I've concentrated on those additions that give us interoperability cross-browser, but do check out the release notes to see all of the features added to each engine. 

{% Aside %}
With Chrome reaching version 100 we had a look back at some of the fun, cool, and interesting things that have happened over the past 14 years. Take a look at [#100CoolWebMoments](https://developer.chrome.com/100/).
{% endAside %}

Chrome 99 and Safari 15.4 included [Cascade Layers](https://developer.mozilla.org/docs/Web/CSS/@layer). The `@layer` at-rule defines a cascade layer, helping you to control specificity. They join Firefox, and so Cascade Layers is now available in all three browser engines. Find out more about Cascade Layers in [Cascade layers are coming to your browser](https://developer.chrome.com/blog/cascade-layers/).

{% BrowserCompat 'css.at-rules.layer' %}

Chrome 100 includes the new value of `plus-lighter` for the CSS [mix-blend-mode](https://developer.mozilla.org/docs/Web/CSS/mix-blend-mode) property. This value is useful when cross-fading two elements when all or a subset of pixels have the same values. You can read more about the problem this solves in [Cross-fading any two DOM elements is currently impossible](https://jakearchibald.com/2021/dom-cross-fade/). 

{% BrowserCompat 'css.properties.mix-blend-mode.plus-lighter' %}

Safari 15.4 includes the [`contain`](https://developer.mozilla.org/docs/Web/CSS/contain) property, allowing for CSS containment. 

{% BrowserCompat 'css.properties.contain' %}

Also in Safari 15.4 is [`accent-color`](/accent-color/), which gives control over the accent color used on some form controls. 

{% BrowserCompat 'css.properties.accent-color' %}

Firefox 98 and Safari 15.4 landed the [`<dialog>`](https://developer.mozilla.org/docs/Web/HTML/Element/dialog) element, which represents a dialog box. 

{% BrowserCompat 'html.elements.dialog' %}

Safari 15.4 also completed support for the [`:focus-visible`](https://developer.mozilla.org/docs/Web/CSS/:focus-visible) pseudo-class. The [implementation work](https://blogs.igalia.com/mrego/2021/06/07/focus-visible-in-webkit-may-2021/) on this was by Igalia.

{% BrowserCompat 'css.selectors.focus-visible' %}

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release.

New betas in March were [Chrome 101](https://blog.chromium.org/2022/03/chrome-101-federated-credential.html), and [Firefox 99](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/99). 

Chrome 101 beta includes [hwb color notation](https://developer.mozilla.org/docs/Web/CSS/color_value/hwb). This specifies color according to its hue, whiteness, and blackness. As with other color notation, an optional alpha component specifies opacity.

```css
h1 {
  color: hwb(194 0% 0% / .5) /* #00c3ff with 50% opacity */
}
```

{% BrowserCompat 'css.types.color.hwb' %}

Firefox 99 includes the [`pdfViewerEnabled`](https://developer.mozilla.org/docs/Web/API/Navigator/pdfViewerEnabled) property of the Navigator interface. This property indicates if the browser supports inline display of PDF files.

```js
if (!navigator.pdfViewerEnabled) {
  // The browser does not support inline viewing of PDF files.
}
```

{% BrowserCompat 'api.Navigator.pdfViewerEnabled' %}

These beta features will land in stable browsers soon.

_Hero image by [Brandon Zack](https://unsplash.com/@brandonzack)_
  
  