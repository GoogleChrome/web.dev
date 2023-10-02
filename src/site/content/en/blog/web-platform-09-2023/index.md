---
layout: post
title: "New to the web platform in September"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during September 2023.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during September 2023.
date: 2023-10-02
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/MjXxPpwmG0mrW7nXz1OY.jpg
alt: ''
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In September 2023 [Firefox 118](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/118), [Safari 17](https://developer.apple.com/documentation/safari-release-notes/safari-17-release-notes), and [Chrome 117](https://developer.chrome.com/blog/new-in-chrome-117/) became stable. This post takes a look at what that means for the web platform.

{% Aside 'caution' %}
We include browser compatibility data pulled from MDN in these posts which may not have been updated yet for very recent browser releases. The post will show the correct information as soon as it appears in the [browser-compat-data release](https://github.com/mdn/browser-compat-data/releases).
{% endAside %}

The `subgrid` value for `grid-template-columns` and `grid-template-rows` is included in Chrome 117, making this longed for feature interoperable. You can learn more about subgrid in the article [CSS subgrid](/css-subgrid/).

{% BrowserCompat 'css.properties.grid-template-columns.subgrid' %}

Chrome also includes three new CSS features to easily add entry and exit animations, and smoothly animate to and from the top layer dismissible elements such as dialogs and popovers. You can learn about the `transition-behavior` property, `@starting-style` rule, and `overlay` property in the article [Four new CSS features for entry and exit animations](https://developer.chrome.com/blog/entry-exit-animations/).

{% BrowserCompat 'css.properties.grid-transition-behavior' %}

Also in Chrome 117 is JavaScript array grouping with the [Object.groupBy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy) and [Map.groupBy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy) static methods.

{% BrowserCompat 'javascript.builtins.Object.groupBy' %}

Safari 17 includes the `popover` attribute, to add support for the [Popover API](https://developer.chrome.com/blog/introducing-popover-api/). 

{% BrowserCompat 'html.attributes.popover' %}

Safari 17 and Firefox 118 include the HTML [`<search>`](https://developer.mozilla.org/docs/Web/HTML/Element/search) element. This element represents the parts of the page or application that contain funtionality for search or filtering content.

{% BrowserCompat 'html.elements.search' %}

There are lots of new CSS features included in Safari 17, including [`@counter-style`](https://developer.mozilla.org/docs/Web/CSS/@counter-style). This rule lets you define counter styles that are outside the predefined list of style. This feature is now available in all three engines.

{% BrowserCompat 'css.at-rules.counter-style' %}

Firefox 118 includes several additional CSS math functions: `abs()`, `sign()`, `round()`, `mod()`, `rem()`, `pow()`, `sqrt()`, `hypot()`, `log()`, and `exp()`. 

{% BrowserCompat 'css.types.exp' %}

Safari 17 also includes support for HEIC/HEIF images, and JPEG XL.

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. New betas are [Firefox 119](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/119), [Safari 17.1](https://developer.apple.com/documentation/safari-release-notes/safari-17_1-release-notes), and [Chrome 118](https://developer.chrome.com/blog/chrome-118-beta/). These releases bring many great features to the platform. Check out the release notes for all of the details, here are just a few highlights.

The `<search>` element, shipping in Firefox and Safari this month is included in Chrome 118, meaning this feature is quickly landing across all three engines. 

The [Object.groupBy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy) and [Map.groupBy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy) static methods are part of Firefox 119.

Chrome 118 includes [CSS scoped styles](https://drafts.csswg.org/css-cascade-6/#scoped-styles) with the `@scope` rule and new media features with `prefers-reduced-transparency` and `scripting`.

Safari 17.1 is currently a release that fixes a range of issues across the platform.

_Photo by [Charles Deluvio](https://unsplash.com/@charlesdeluvio)._
