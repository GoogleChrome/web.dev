---
layout: post
title: "New to the web platform in August"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during August 2023.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during August 2023.
date: 2023-08-31
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/ygBqztUvoZg39i0SM2MZ.jpg
alt: ''
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In August 2023 [Firefox 116](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/116), [Firefox 117](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/117), [Safari 16.6](https://developer.apple.com/documentation/safari-release-notes/safari-16_6-release-notes), and [Chrome 116](https://developer.chrome.com/blog/new-in-chrome-116/) became stable. This post takes a look at what that means for the web platform.

{% Aside 'caution' %}
We include browser compatibility data pulled from MDN in these posts which may not have been updated yet for very recent browser releases. The post will show the correct information as soon as it appears in the [browser-compat-data release](https://github.com/mdn/browser-compat-data/releases).
{% endAside %}

Firefox 116 supports the [Audio Output Devices API](https://developer.mozilla.org/docs/Web/API/Audio_Output_Devices_API) on all platforms except for Android. This API allows web applications to redirect audio output to a permitted Bluetooth headset, speakerphone, or other device, instead of having to use the browser or underlying OS default.

{% BrowserCompat 'api.MediaDevices.selectAudioOutput' %}

Chrome 116 includes CSS Motion Path allowing any graphical object to be animated it along a path specified by the developer. This allows a number of powerful new transform possibilities, such as positioning using polar coordinates (with the `ray()` function) rather than the standard rectangular coordinates used by the `translate()` function, or animating an element along a defined path. This makes it easier to define complex and beautiful 2d spatial transitions. A path can be specified as `circle()`, `ellipse()`, `rect()`, `inset()`, `xywh()`, `polygon()`, `ray()` and `url()`.

{% BrowserCompat 'css.properties.offset-path.basic-shape' %}

Also in Chrome 116 is the [Document Picture-in-Picture API](https://developer.chrome.com/docs/web-platform/document-picture-in-picture/). This enables an always-on-top window that can be populated with arbitrary HTMLElements. This is an expansion upon the existing HTMLVideoElement API that only allows for an HTMLVideoElement to be put into a Picture-in-Picture (PiP) window. 

{% BrowserCompat 'api.DocumentPictureInPicture' %}

Firefox 117 supports [CSS Nesting](https://developer.mozilla.org/docs/Web/CSS/CSS_nesting) and the [`&` nesting selector](https://developer.mozilla.org/docs/Web/CSS/Nesting_selector). This enables the nesting of one style rule inside another. This makes CSS Nesting interoperable with a caveat, Safari and Chrome implemented an older version of the spec, which did not allow nesting of [type selectors](https://developer.mozilla.org/docs/Web/CSS/Type_selectors). Firefox has implemented the new version of the spec which does not require the `&` nesting selector. You can see examples of both versions in [Using CSS Nesting](https://developer.mozilla.org/docs/Web/CSS/CSS_nesting/Using_CSS_nesting).

{% BrowserCompat 'css.selectors.nesting' %}

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. New betas are [Firefox 118](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/118) and [Chrome 117](https://developer.chrome.com/blog/chrome-117-beta/). The [Safari 17](https://developer.apple.com/documentation/safari-release-notes/safari-17-release-notes) beta is still ongoing. These releases bring many great features to the platform. Check out the release notes for all of the details, here are just a few highlights.

There's not a lot of information available as yet for the next Firefox release. However, Chrome 117 promises some exciting features. For example, some new CSS features that [enable entry and exit animations](https://developer.chrome.com/blog/entry-exit-animations/).

The `subgrid` value for `grid-template-columns` and `grid-template-rows` is included in Chrome 117, making this longed for feature interoperable.

Also in Chrome 117 is JavaScript array grouping with the [Object.groupBy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy) and [Map.groupBy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy) static methods.

Safari 17 beta includes the `popover` attribute, to add support for the [Popover API](https://developer.chrome.com/blog/introducing-popover-api/). 

_Photo by [Courtney Cook](https://unsplash.com/@courtneymcook)._
