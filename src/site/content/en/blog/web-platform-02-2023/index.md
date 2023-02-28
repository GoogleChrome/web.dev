---
layout: post
title: "New to the web platform in February"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during February 2023.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during February 2023.
date: 2023-02-28
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/B99XwoFGRglrLQZuEcUL.jpg
alt: Colorful wooden boards.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In February 2023, [Firefox 110](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/110) and [Chrome 110](https://developer.chrome.com/blog/new-in-chrome-110/) became stable. Let's take a look at what this means for the web platform.

### Container queries in all three engines

Firefox 110 included support for [size container queries](/cq-stable/), making this key feature available in all three engines. 

{% BrowserCompat 'css.at-rules.container' %}

### CSS initial letters

Chrome 110 adds support for the CSS [`initial-letter`](https://developer.mozilla.org/docs/Web/CSS/initial-letter) property. This property sets the number of lines an initial letter should sink into the following lines of text. Learn more in the post [Control your drop caps with CSS initial-letter](https://developer.chrome.com/blog/control-your-drop-caps-with-css-initial-letter/).

{% BrowserCompat 'css.properties.initial-letter' %}

### ReadableStream async iteration

Firefox added support for the [async interable protocol in `ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream#async_iteration). 

{% BrowserCompat 'api.ReadableStream.async_iterable' %}

### AudioContext.setSinkId()

In Chrome [`AudioContext.setSinkId`](https://developer.mozilla.org/docs/Web/API/AudioContext/setSinkId) sets the ID of the audio device to use for output. This allows the `AudioContext` to route audio to a connected output device of the user's choosing.

Learn more about this feature in the post [Change the destination output device in Web Audio](https://developer.chrome.com/blog/audiocontext-setsinkid/).

{% BrowserCompat 'api.AudioContext.setSinkId' %}

### IFrame credentialless

Also in Chrome, [IFrame credentialless](https://developer.mozilla.org/docs/Web/Security/IFrame_credentialless) gives developers a way to load documents in third party iframes using new and ephemeral contexts. Iframe credentialless are a generalization of COEP credentialless to support third-party iframes that may not deploy COEP. This removes the constraint that third-party iframes must support COEP in order to be embedded in a COEP page and will unblock developers looking to adopt cross-origin-isolation.

Learn more about [iframe credentialless](https://developer.chrome.com/blog/iframe-credentialless/).

{% BrowserCompat 'html.elements.iframe.credentialless' %}

### Early stable

Chrome 110 also marked a change in the Chrome release schedule. The _early stable_ release will roll out a week earlier than the general release, to a small percentage of users. You can learn more about this change in the article [change in release schedule from Chrome 110](https://developer.chrome.com/blog/early-stable/).

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. New betas are [Firefox 111](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/111), [Safari 16.4](https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes), and [Chrome 111](https://developer.chrome.com/blog/chrome-111-beta/). These releases bring many great features to the platform. Check out the release notes for all of the details, here are just a few highlights.

Firefox adds support for the [Origin Private File System (OPFS)](https://developer.mozilla.org/docs/Web/API/File_System_Access_API#origin_private_file_system) when using the File System Access API.

Chrome includes all features described in CSS Color Level 4. This includes four device-independent color types (lab, Oklab, lch and Oklch), the `color()` function, and user-defined color spaces for gradients and animations. Also included is the [`color-mix()`](https://developer.chrome.com/blog/css-color-mix/) function from CSS Color 5.

Read the [High definition CSS color guide](https://developer.chrome.com/articles/high-definition-css-color-guide/) to learn about these new color types and spaces.

Chrome also includes the View Transitions API, that enables polished transitions in Single-Page Applications (SPAs). Find out more in the documentation for [View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions/).

Also in Chrome 111 is the [declarative shadow DOM](https://developer.chrome.com/articles/declarative-shadow-dom/), a new way to implement and use shadow DOM directly in HTML.

Safari 16.4 promises to be a huge release for the platform. For CSS the release includes support for the [`:user-invalid`](https://developer.mozilla.org/docs/web/css/:user-invalid) and [`:user-valid`](https://developer.mozilla.org/docs/web/css/:user-valid) pseudo-classes, the [`margin-trim`](https://developer.mozilla.org/docs/web/css/margin-trim) property, the [range syntax for media queries](https://developer.chrome.com/blog/media-query-range-syntax/), and support for the CSS Properties and Values API and [`@property`](https://developer.mozilla.org/docs/web/css/@property).

Safari also includes support for Web Push, and the [Badging API](https://developer.mozilla.org/docs/Web/API/Badging_API), along with a number of other Web APIs. It's a really exciting release that will see a number of features [reach interoperability](/tags/newly-interoperable/).
  
_Photo by [Robert Katzki](https://unsplash.com/fr/@ro_ka?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)._
