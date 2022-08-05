---
layout: post
title: "New to the web platform in July"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during July 2022.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during July 2022.
date: 2022-07-29
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/hW4gJsL1RMhkKWMgKn71.jpg
alt: A balloon heading towards the bright sun.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In July, [Firefox 103](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/103) and [Safari 15.6](https://developer.apple.com/documentation/safari-release-notes/safari-15_6-release-notes) became stable, and with this we get interoperability on a couple of nice CSS features.

### The `backdrop-filter` property

Firefox 103 includes the [`backdrop-filter`](https://developer.mozilla.org/docs/Web/CSS/backdrop-filter) property which is used to apply effects such as blurring to the area behind an element. With this value in Firefox, it is now available in all three engines, though Safari requires the `-webkit` prefix.

{% Codepen {
  user: 'web-dot-dev',
  id: 'LYdOrLv',
  height: 520,
  tab: 'result'
} %}

{% BrowserCompat 'css.properties.backdrop-filter' %}

### The `scroll-snap-stop` property

Firefox also implemented the [`scroll-snap-stop`](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-stop) property. This property gives you control over whether a scrolling element passes over possible snap positions (with the default value of `normal`) or must snap to the first (with the value `always`). The `scroll-snap-stop` property is now in all three browser engines.

{% BrowserCompat 'css.properties.scroll-snap-stop' %}

Safari 15.6 was a release mostly dedicated to resolving issues, however it did land one new CSS feature with the `:modal` pseudo-class. This feature was also shipped in Firefox 103. The `:modal` pseudo-class selects an element when everything outside of that element cannot be interacted with until the element is dismissed. For example, a [`dialog`](https://developer.mozilla.org/docs/Web/HTML/Element/dialog) element opened with `showModal()`.

{% BrowserCompat 'css.selectors.modal' %}

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release.

Due to release dates falling just outside the month, the only new beta in June was [Firefox 104](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/104).

Included in Firefox 104 is the [CSS Font Loading API](https://developer.mozilla.org/docs/Web/API/CSS_Font_Loading_API) in Web Workers, and the CSS `animation-composition` property, that defines the composition operation used when multiple animations affect the same property simultaneously.

The Safari 16 beta [mentioned last month](/web-platform-06-2022/#safari-16-brings-several-key-features-to-the-browser) is also still ongoing. 

These beta features will land in stable browsers soon.

_Hero image by [Nick Fewings](https://unsplash.com/@jannerboy62)._
