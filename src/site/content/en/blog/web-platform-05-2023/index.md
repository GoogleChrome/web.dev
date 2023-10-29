---
layout: post
title: "New to the web platform in May"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during May 2023.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during May 2023.
date: 2023-05-31
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/ozivqeizYMb6e6KTwiob.jpg
alt: A selection of colored pencils.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In May 2023, [Firefox 113](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/113), [Chrome 113](https://developer.chrome.com/blog/new-in-chrome-113/), [Chrome 114](https://developer.chrome.com/blog/new-in-chrome-114/), and [Safari 16.5](https://developer.apple.com/documentation/safari-release-notes/safari-16_5-release-notes) became stable. Let's take a look at what this means for the web platform.

{% Aside 'caution' %}
We include browser compatibility data pulled from MDN in these posts which may not have been updated yet for very recent browser releases. The post will show the correct information as soon as it appears in the [browser-compat-data release](https://github.com/mdn/browser-compat-data/releases).
{% endAside %}

### WebGPU

Chrome 113 includes [WebGPU](https://developer.chrome.com/blog/webgpu-release/), the successor to the WebGL and WebGL 2 graphics APIs for the web. It provides modern features such as GPU compute, lower overhead access to GPU hardware, the ability to render to multiple canvases from a single graphics device, and better, more predictable performance.

{% BrowserCompat 'api.GPU' %}

### First-Party Sets

[First-Party Sets (FPS)](https://developer.chrome.com/docs/privacy-sandbox/first-party-sets/) is part of the [Privacy Sandbox](https://privacysandbox.com/). It is a way for organizations to declare relationships among sites, so that browsers can decide when to allow limited third-party cookie access for sites within a set. FPS began a staged rollout in Chrome 113. 

### CSS media features and more

For CSS, Chrome 113 includes the `overflow-inline` and `overflow-block` media features. 

{% BrowserCompat 'css.at-rules.media.overflow-inline' %}

And the `update` media feature.

{% BrowserCompat 'css.at-rules.media.update' %}

Also included is the `linear()` easing function, which you can learn more about in the article [Create complex animation curves in CSS with the `linear()` easing function](https://developer.chrome.com/articles/css-linear-easing-function/).

{% BrowserCompat 'css.types.easing-function.linear-function' %}

### CSS Color Level 4 features

Firefox 113 includes the `color()`, `lab()`, `lch()`, `oklab()`, `oklch()`, and `color-mix()` functional notations, along with the forced-color-adjust property. This means that the new color spaces and functions are now supported across all three major engines. You can learn more about these color spaces and functions in the [High definition CSS color guide](https://developer.chrome.com/articles/high-definition-css-color-guide/).

{% BrowserCompat 'css.types.color.color-mix' %}

### More control over `:nth-child()` selections

Firefox 113 also adds the ability to pass a selector list into `:nth-child()` and `nth-last-child()`. Learn more about this, and see examples in the post [More control over :nth-child() selections with the of S syntax](https://developer.chrome.com/articles/css-nth-child-of-s/).

{% BrowserCompat 'css.selectors.nth-child.of_syntax' %}

### Compressions Streams API

Now supported in all three major engines due to inclusion in Firefox 113, the Compressions Streams API enables the compression and decompression of streams. This means that JavaScript applications no longer need to bundle a compression library.

{% BrowserCompat 'api.CompressionStream' %}

### CSS nesting

Safari 16.5 mostly resolved issues, but also adds support for [CSS Nesting](https://developer.chrome.com/articles/css-nesting/), with the new nesting selector `>`, used to nest related style rules, in a way that will be familiar to developers who have used pre-processors:

```css
.nesting {
  color: hotpink;

  > .is {
    color: rebeccapurple;

    > .awesome {
      color: deeppink;
    }
  }
}
```

{% BrowserCompat 'css.selectors.nesting' %}

### Balancing headlines with `text-wrap: balance`

From Chrome 114 you can use `text-wrap: balance`. This allows you to balance headlines, avoiding the issue of having a single word on the final line, providing a more pleasing and readable result. You can find out more in [CSS text-wrap: balance](https://developer.chrome.com/blog/css-text-wrap-balance/).

{% BrowserCompat 'css.properties.text-wrap' %}

### CHIPS: Cookies Having Independent Partitioned State

As part of the work to [phase out third-party cookies](https://developer.chrome.com/docs/privacy-sandbox/third-party-cookie-phase-out/), [CHIPS](https://developer.chrome.com/docs/privacy-sandbox/chips/) enables opting-in to third-party cookies being partitioned by top-level site using the new cookie attribute `Partitioned`. CHIPS is available in Chrome 114. 

### The Popover API

Also in Chrome 114 is the [Popover API](https://developer.mozilla.org/docs/Web/API/Popover_API) making it easier to build transient user interface (UI) elements that are displayed on top of all other web app UI.

These include user-interactive elements like action menus, form element suggestions, content pickers, and teaching UI.

The new popover attribute enables any element to be displayed in the [top layer](https://developer.chrome.com/blog/top-layer-devtools/) automatically. This means no more worrying about positioning, stacking elements, focus or keyboard interactions for the developer.

Learn more in [Introducing the popover API](https://developer.chrome.com/blog/introducing-popover-api/).

{% BrowserCompat 'api.ToggleEvent' %}

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. New betas are [Firefox 114](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/114), [Chrome 115](https://developer.chrome.com/blog/chrome-115-beta/), and [Safari 16.6](https://developer.apple.com/documentation/safari-release-notes/safari-16_6-release-notes). These releases bring many great features to the platform. Check out the release notes for all of the details, here are just a few highlights.

Chrome 115 includes multiple values for the CSS `display` property. This means that `display: flex` becomes `display: block flex` and `display: block` becomes `display: block flow`. The single values are maintained as legacy keywords, and once in Chrome Stable this makes the multiple values available accross all engines. 

Also in Chrome 115 are the `ScrollTimeline` and `ViewTimeline` extensions to the Web Animations specification. These enable [scroll-driven animations](https://developer.chrome.com/articles/scroll-driven-animations/) via CSS and JavaScript. 

Firefox 114 includes the [WebTransport API](https://developer.mozilla.org/docs/Web/API/WebTransport_API), a modern update to WebSockets providing support for multiple streams, unidirectional streams, and out-of-order delivery.

_Photo by [Photoz ace](https://unsplash.com/@photozace)._
