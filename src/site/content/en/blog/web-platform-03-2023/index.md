---
layout: post
title: "New to the web platform in March"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during March 2023.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during March 2023.
date: 2023-03-31
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/pI6R8rAPgyCUhAKQLmUe.jpg
alt: Spring blossom.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In March 2023, [Firefox 111](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/111), [Chrome 111](https://developer.chrome.com/blog/new-in-chrome-111/), and [Safari 16.4](https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes) became stable. Let's take a look at what this means for the web platform.

{% Aside 'caution' %}
We include browser compatibility data pulled from MDN in these posts which may not have updated for very recent browser releases. The post will show the correct information as soon as it appears in the [browser-compat-data release](https://github.com/mdn/browser-compat-data/releases).
{% endAside %}

### Global HTML attributes

Firefox 111 adds support for a couple of useful [global HTML attributes](/learn/html/attributes/#global-attributes). The [`autocapitalize`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/autocapitalize) attribute controls whether text may be automatically capitalized when the user is typing on a virtual keyboard. 

{% BrowserCompat 'html.global_attributes.autocapitalize' %}

The [`translate`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/translate) attribute indicates whether an element should be translated when a page is localized. 

{% BrowserCompat 'html.global_attributes.translate' %}

### Origin Private File System (OPFS)

Firefox adds support for the [Origin Private File System (OPFS)](https://developer.mozilla.org/docs/Web/API/File_System_Access_API#origin_private_file_system) when using the File System Access API. [Learn more about the OPFS](https://developer.chrome.com/articles/origin-private-file-system/).

### The View Transitions API

Chrome 111 adds the [View Transitions API](https://developer.mozilla.org/docs/Web/API/View_Transitions_API), making the creation of polished transitions in Single-Page Apps (SPAs) simpler by snapshotting views and allowing the DOM to change without any overlap between states.

Find out more in the launch post [SPA view transitions land in Chrome 111](https://developer.chrome.com/blog/spa-view-transitions-land/).

{% BrowserCompat 'api.ViewTransition' %}

### New CSS color spaces and functions

Also included in Chrome 111 are a whole new set of ways to use color on the web. Chrome now supports color spaces that access colors outside of the RGB gamut, along with the `color()` and `color-mix()` functions. Learn more in our [High definition CSS color guide](https://developer.chrome.com/articles/high-definition-css-color-guide/) and [blog post on `color-mix()`](https://developer.chrome.com/blog/css-color-mix/).

{% BrowserCompat 'css.types.color_value.color-mix' %}

The Chrome release also includes [new DevTools](https://developer.chrome.com/blog/new-in-devtools-111/#color) to help you work with this new color functionality.

{% Aside %}
You can also test the new color functions `color()`, `lab()`, `lch()`, `oklab()`, and `oklch()` in Firefox 111, currently behind a preference `layout.css.more_color_4.enabled`.
{% endAside %}

### More control over `:nth-child()` selections

Chrome 111 adds the ability to pass a selector list into `:nth-child()` and `nth-last-child()`. Learn more about this, and see examples in the post [More control over :nth-child() selections with the of S syntax](https://developer.chrome.com/articles/css-nth-child-of-s/).

{% BrowserCompat 'css.selectors.nth-child.of_syntax' %}

### Support for previous and next slide in the Media Session API

Finally in this list of Chrome 111 additions are the [Presenting slides actions](/media-session/#presenting-slides-actions) for the media session API—`"previousslide"` and `"nextslide"`.

{% BrowserCompat 'api.MediaSession.nextslide_type' %}

### Pseudo-class support in Safari

Safari 16.4 is an amazing release for the web platform. This article won't cover all of the additions, so check out the full list of features in the [Safari 16.4 release notes](https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes). 

There's a bunch of additional CSS pseudo-classes with support in this release: `:user-invalid`, `:user-valid`, `:dir()`, `:modal`, and `:fullscreen`.

### New range syntax for media queries

This Safari release makes the far more elegant and useful range syntax for media queries interoperable across all three engines. See examples of this syntax in [this post](https://developer.chrome.com/blog/media-query-range-syntax/), published when the syntax shipped in Chrome. 

{% BrowserCompat 'css.at-rules.media.range_syntax' %}

### CSS Properties and Values

Safari 16.4 adds support for [`@property`](https://developer.mozilla.org/docs/Web/CSS/@property), enabling CSS custom property registration directly in a stylesheet. Learn more about this in [@property: giving superpowers to CSS variables](/at-property/).

{% BrowserCompat 'css.at-rules.property' %}

### CSS API support

The great additions for CSS keep coming, with support for the [CSS Typed OM](https://developer.mozilla.org/docs/Web/API/CSS_Typed_OM_API). This API exposes CSS values as typed JavaScript objects rather than strings. It makes working with CSS from JavaScript easier, and is more performant than existing methods.

{% BrowserCompat 'api.CSSStyleValue' %}

There is also support for constructable stylesheets with `CSSStyleSheet()`. This enables the sharing of stylesheets between a document and its shadow DOM subtrees. With this version of Safari, constructable stylesheets are now supported in all three engines.

{% BrowserCompat 'api.CSSStyleSheet.CSSStyleSheet' %}

### Web Push and the Badging API

Safari now suports Web Push, along with the [Badging API](https://developer.mozilla.org/docs/Web/API/Badging_API), which is great news for app developers. In particular, this version means that [push notifications are supported](/push-notifications-in-all-modern-browsers/) in all major engines. 

{% BrowserCompat 'api.PushEvent.PushEvent' %}

### Import maps

Another addition that brings a feature to interoperable status is the addition of JavaScript [Import maps](/import-maps-in-all-modern-browsers/), making importing ES modules much easier.

{% BrowserCompat 'html.elements.script.type.importmap' %}

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. New betas are [Firefox 112](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/112), [Safari 16.5](https://developer.apple.com/documentation/safari-release-notes/safari-16_5-release-notes), and [Chrome 112](https://developer.chrome.com/blog/chrome-112-beta/). These releases bring many great features to the platform. Check out the release notes for all of the details, here are just a few highlights.

Firefox 112 adds support for the `inert` attribute, which will make this useful attribute available across all engines. You can learn more about inert in [Introducing inert](https://developer.chrome.com/articles/inert/). Firefox will also enable support for the `linear()` easing function.

Chrome 112 and Safari 16.5 both add support for [CSS Nesting](https://developer.chrome.com/articles/css-nesting/), a feature that is highly anticipated by many developers. 

Chrome 112 also includes support for `animation-composition`. Learn how this property works in [Specify how multiple animation effects should composite with animation-composition](https://developer.chrome.com/articles/css-animation-composition/).

If you use Chrome's Headless mode, for example with Puppeteer, then 112 brings an all new Headless mode. Learn about it in [Chrome's Headless mode gets an upgrade](https://developer.chrome.com/articles/new-headless/).

_Photo by [Tali Khrab](https://unsplash.com/@taliscope?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)._
