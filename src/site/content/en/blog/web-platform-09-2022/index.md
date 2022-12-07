---
layout: post
title: "New to the web platform in September"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during September 2022.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during September 2022.
date: 2022-09-30
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/CEhqfqUeK6vcU2YpPcqK.jpg
alt: A globe and some blocks with letters on them.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In September, [Firefox 105](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/105), [Chrome 106](https://developer.chrome.com/blog/new-in-chrome-106/), and [Safari 16](https://developer.apple.com/documentation/safari-release-notes/safari-16-release-notes) became stable. This means that the September post is full of exciting things for the web platform.

### Container queries

Safari 16 adds support for [container queries](/blog/has-with-cq-m105/), a feature which is now available in two engines. Safari also adds support for the new [container query units](https://www.bram.us/2021/09/21/css-container-queries-container-relative-lengths/). 

{% BrowserCompat 'css.at-rules.container' %}

### Grid layout

Safari has landed support for the `subgrid` value of `grid-template-columns` and `grid-template-rows`. Using this value on a grid that is also a grid item means that instead of defining new tracks, the grid uses those that it spans of the parent. 

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'XWzqrLR',
  height: 500,
  theme: 'dark',
  tab: 'result'
} %}

<figcaption>In Safari or Firefox the headers and footers in these cards will align, as their tracks are a subgrid of the parent.</figcaption>
</figure>

{% BrowserCompat 'css.properties.grid-template-columns.subgrid' %}

Also, in Safari, for grid layout is the ability to animate grid tracks. 

{% BrowserCompat 'css.properties.grid-template-columns.animation' %}

Safari has also added support for [offset-path](https://developer.mozilla.org/docs/Web/CSS/offset-path), [overscroll-behavior](https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior), [text-align-last](https://developer.mozilla.org/docs/Web/CSS/text-align-last), and the [resolution](https://developer.mozilla.org/docs/Web/CSS/@media/resolution) media query.

### Encoding API

Firefox 105 supports the [TextDecoderStream](https://developer.mozilla.org/docs/Web/API/TextDecoderStream) and [TextEncoderStream](https://developer.mozilla.org/docs/Web/API/TextEncoderStream) interfaces of the Encoding API. 

{% BrowserCompat 'api.TextEncoderStream' %}

### New Intl APIs

The [Intl APIs](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) help to display content in a localized format and Chrome 106 adds a slew of new number format functionality.

Like other Intl APIs, this shifts the burden to the system—so you don’t need to ship or maintain complex localization code to every user. The API knows where the currency symbol goes, how to format dates and times, or compile a list.


### The showPicker() method

Safari 16 contains the [`showPicker()`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/showPicker) method, enabling a canonical way to show a browser picker for dates, time, color, and files is included. You can find out more about this in [show a browser picker for date, time, color, and files](https://developer.chrome.com/blog/show-picker/).

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. New betas this month are [Chrome 107](/blog/chrome-107-beta/), [Safari 16.1](https://developer.apple.com/documentation/safari-release-notes/safari-16_1-release-notes), and [Firefox 106](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/106).

Chrome 107 includes the ability to animate grid tracks, that also shipped in Safari this month. Once this lands in Chrome it will be supported in all three major engines. 

Also in Chrome are some additions to [`getDisplayMedia()`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getDisplayMedia) that aim to prevent [accidental oversharing when screen sharing]((https://developer.chrome.com/blog/avoiding-oversharing-when-screen-sharing/)). 

- The [`displaySurface`](https://developer.chrome.com/docs/web-platform/screen-sharing-controls/#displaySurface) option can indicate that the web app prefers to offer a specific display surface type (tabs, windows, or screens).
- The [`surfaceSwitching`](https://developer.chrome.com/docs/web-platform/screen-sharing-controls/#surfaceSwitching) option indicates whether Chrome should allow the user to dynamically switch between shared tabs.
- The [`selfBrowserSurface`](https://developer.chrome.com/docs/web-platform/screen-sharing-controls/#selfBrowserSurface) option can be used to prevent the user from sharing the current tab. This avoids the "hall of mirrors" effect.
- The [`systemAudio`](https://developer.chrome.com/docs/web-platform/screen-sharing-controls/#systemAudio) option ensures Chrome only offers relevant audio-capture to the user.

Safari 16.1 includes an additional fix to accessibility of `display: contents`, a fix to dynamic viewport height (`dvh`) units, and support for scroll to text fragments.

_Photo by [Alexandr Podvalny](https://unsplash.com/@freestockpro?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)._
  
