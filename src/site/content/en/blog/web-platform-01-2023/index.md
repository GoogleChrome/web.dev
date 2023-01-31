---
layout: post
title: "New to the web platform in January"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during January 2023.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during January 2023.
date: 2023-01-31
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/FCGhFWoTI2Rmlc6vDDzh.jpg
alt: A winter scene with snow.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In January 2023, [Firefox 109](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/109), [Chrome 109](https://developer.chrome.com/blog/new-in-chrome-109/), and [Safari 16.3](https://developer.apple.com/documentation/safari-release-notes/safari-16_3-release-notes) became stable. Let's take a look at what this means for the web platform.

## MathML

Chrome 109 supports [MathML](https://developer.mozilla.org/docs/Web/MathML) Core, a language for describing mathematical notation embeddable in HTML and SVG. This release means that MathML is now interoperable across all the major engines.

## The `scrollend` event

Firefox 109 implements `scrollend`. This event provides a reliable way to detect that a scroll is complete. Find out more about this event, which is also being implemented in Chrome, in the article [Scrollend, a new JavaScript event](https://developer.chrome.com/blog/scrollend-a-new-javascript-event/).

{% BrowserCompat 'api.Element.scrollend_event' %}

## The `lh` CSS length unit and `hyphenate-limit-chars`

For CSS in Chrome we have the `lh` length unit. This unit is equivalent to the computed value of the `line-height` property on the element on which it is used. 

{% BrowserCompat 'css.types.length.lh' %}

Also, the `hyphenate-limit-chars` property specifying the minimum number of characters in a hyphenated word.

{% BrowserCompat 'css.properties.hyphenate-limit-chars' %}

## Content-Security-Policy (CSP) `prefetch-src`

Safari 16.3 is mostly a release of fixes, and resolves a number of CSS sizing issues. The only new feature listed in the notes, is the addition of the Content-Security-Policy (CSP) [`prefetch-src`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/prefetch-src) directive.

{% BrowserCompat 'http.headers.Content-Security-Policy.prefetch-src' %}

## Features for Chrome on Android

New in Chrome on Android is [Secure Payment Confirmation](https://developer.chrome.com/blog/spc-on-android/) (SPC). This is a proposed web standard that allows customers to authenticate with a credit card issuer, bank, or other payment service provider using a platform authenticator—typically activated with a device's screen unlock feature such as a fingerprint sensor.

Also new for Chrome on Android is the [Origin Private File System (OPFS)](https://developer.mozilla.org/docs/Web/API/File_System_Access_API#origin_private_file_system), part of the File System Access API on Android. This includes all of the File System Access API surface, minus the `show{OpenFile, SaveFile, Directory}Picker()` methods and the Drag and Drop API integration.

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. New betas are [Firefox 110](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/110), and [Chrome 110](https://developer.chrome.com/blog/chrome-110-beta/). 

Chrome 110 includes the CSS `initial-letter` property. This property provides a way to set the number of lines that an initial letter should sink into the text. Learn more in the article [Control your drop caps with CSS initial-letter](https://developer.chrome.com/blog/control-your-drop-caps-with-css-initial-letter/).

Also, for CSS in Chrome 110 is the `:picture-in-picture` pseudo-class. This gives you a way to target and customize the media player when videos enter and exit picture-in-picture mode.

Chrome includes the `setSinkID()` method of the `AudioContext` API. This method provides a way to [change the destination audio device when using Web Audio](https://developer.chrome.com/blog/audiocontext-setsinkid/).

Firefox 110 includes size [Container Queries](https://developer.mozilla.org/docs/Web/CSS/CSS_Container_Queries), which will bring us interoperability across the three main browser engines for this long-awaited feature.
  
_Photo by [Denys Nevozhai](https://unsplash.com/images/nature/winter?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)._
