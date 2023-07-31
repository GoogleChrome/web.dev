---
layout: post
title: "New to the web platform in July"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during July 2023.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during July 2023.
date: 2023-07-31
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/2sZ4etEBuCrtkddUJeH6.jpg
alt: ''
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In July 2023 [Firefox 115](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/115) and [Chrome 115](https://developer.chrome.com/blog/new-in-chrome-115/) became stable. This post takes a look at what that means for the web platform.

{% Aside 'caution' %}
We include browser compatibility data pulled from MDN in these posts which may not have been updated yet for very recent browser releases. The post will show the correct information as soon as it appears in the [browser-compat-data release](https://github.com/mdn/browser-compat-data/releases).
{% endAside %}

### Multiple values for the CSS `display` property

Chrome 115 includes multiple values for the CSS `display` property. This means that `display: flex` becomes `display: block flex` and `display: block` becomes `display: block flow`. The single values are maintained as legacy keywords, these values are now available in the three major engines.

{% BrowserCompat 'css.properties.display.multi-keyword_values' %}

### Scroll-driven animations

Also in Chrome 115 are the `ScrollTimeline` and `ViewTimeline` extensions to the Web Animations specification. These enable [scroll-driven animations](https://developer.chrome.com/articles/scroll-driven-animations/) via CSS and JavaScript. 

{% BrowserCompat 'api.ScrollTimeline' %}

### Privacy Sandbox APIs

The Privacy Sandbox [relevance and measurement APIs](https://developer.chrome.com/blog/privacy-sandbox-launch/) shipped in Chrome 115. This includes the Topics, Protected Audience, Attribution Reporting, Private Aggregation, Shared Storage, and Fenced Frames APIs.

To understand more about these APIs check out the [Privacy Sandbox demos](https://developer.chrome.com/blog/privacy-sandbox-demos/). 

### The `animation-composition` property

Firefox 115 supports the CSS [`animation-composition`](https://developer.mozilla.org/docs/Web/CSS/animation-composition) property. Making `animation-composition` supported in all three major engines. Learn more in the article [Specify how multiple animation effects should composite with animation-composition](https://developer.chrome.com/articles/css-animation-composition/).

{% BrowserCompat 'css.properties.animation-composition' %}

### Array methods

Also reaching interoperability with Firefox 115 are a set of methods for `Array` and `TypedArray`.  `Array.toReversed()`, `Array.toSorted()`, `Array.toSpliced()`, `Array.with()`, `TypedArrays.toReversed()`, `TypedArrays.toSorted()`, and `TypedArrays.with()` return a new array with elements that have been shallow copied.

{% BrowserCompat 'javascript.builtins.Array.toReversed' %}

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. New betas are [Firefox 116](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/116) and [Chrome 116](https://developer.chrome.com/blog/chrome-116-beta/). The [Safari 17](https://developer.apple.com/documentation/safari-release-notes/safari-16_6-release-notes)  and [Safari 16.6](https://developer.apple.com/documentation/safari-release-notes/safari-16_6-release-notes) betas are still ongoing. These releases bring many great features to the platform. Check out the release notes for all of the details, here are just a few highlights.

Firefox 116 supports the [Audio Output Devices API](https://developer.mozilla.org/docs/Web/API/Audio_Output_Devices_API) on all platforms except for Android. This API allows web applications to redirect audio output to a permitted Bluetooth headset, speakerphone, or other device, instead of having to use the browser or underlying OS default.

Chrome 116 includes CSS Motion Path allowing any graphical object to be animated it along a path specified by the developer. This allows a number of powerful new transform possibilities, such as positioning using polar coordinates (with the `ray()` function) rather than the standard rectangular coordinates used by the `translate()` function, or animating an element along a defined path. This makes it easier to define complex and beautiful 2d spatial transitions. A path can be specified as `circle()`, `ellipse()`, `rect()`, `inset()`, `xywh()`, `polygon()`, `ray()` and `url()`.

Also in Chrome 116 is the [Document Picture-in-Picture API](https://developer.chrome.com/docs/web-platform/document-picture-in-picture/). This enables an always-on-top window that can be populated with arbitrary HTMLElements. This is an expansion upon the existing HTMLVideoElement API that only allows for an HTMLVideoElement to be put into a Picture-in-Picture (PiP) window. 

_Photo by [Jason Leung](https://unsplash.com/@ninjason)._
