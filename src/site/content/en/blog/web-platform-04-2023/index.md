---
layout: post
title: "New to the web platform in April"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during April 2023.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during April 2023.
date: 2023-04-28
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/3vEfHlKANPV72jfIhUcR.jpg
alt: A nest with eggs in it.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In April 2023, [Firefox 112](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/112), and [Chrome 112](https://developer.chrome.com/blog/new-in-chrome-112/) became stable. Let's take a look at what this means for the web platform.

{% Aside 'caution' %}
We include browser compatibility data pulled from MDN in these posts which may not have updated for very recent browser releases. The post will show the correct information as soon as it appears in the [browser-compat-data release](https://github.com/mdn/browser-compat-data/releases).
{% endAside %}

### The `inert` attribute

Firefox 112 includes the `inert` global attribute. This attribute tells the browser to ignore the element, indicating content that should not be interactive. It:

- Prevents `click` events being fired.
- Prevents the element from gaining focus.
- Excludes the element and its contents from the accessibility tree.

This attribute is now interoperable in all three engines. 

{% BrowserCompat 'html.global_attributes.inert' %}

### The `linear()` easing function

The `linear()` easing function enables linear interpolation between a number of points. This enables more complex animations such as bounce and elastic effects. This function is in Firefox 112.

{% BrowserCompat 'css.types.easing-function.linear-function' %}

### CSS nesting

Chrome 112 adds support for [CSS Nesting](https://developer.chrome.com/articles/css-nesting/), a feature that is highly anticipated by many developers. This introduces a new nesting selector `>`, used to nest related style rules, in a way that will be familiar to developers who have used pre-processors:

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

### CSS `animation-composition`

Chrome 112 also includes support for `animation-composition`. Learn how this property works in [Specify how multiple animation effects should composite with animation-composition](https://developer.chrome.com/articles/css-animation-composition/).

{% BrowserCompat 'css.properties.animation-composition' %}

### New headless mode

If you use Chrome's Headless mode, for example with Puppeteer, then 112 brings an all new Headless mode. Learn about it in [Chrome's Headless mode gets an upgrade](https://developer.chrome.com/articles/new-headless/).

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. New betas are [Firefox 113](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/113) and [Chrome 113](https://developer.chrome.com/blog/chrome-113-beta/), with the [Safari 16.5](https://developer.apple.com/documentation/safari-release-notes/safari-16_5-release-notes) beta still ongoing. These releases bring many great features to the platform. Check out the release notes for all of the details, here are just a few highlights.

Firefox 113 includes the `color()`, `lab()`, `lch()`, `oklab()`, and `oklch()` functions. Also included is the [`color-mix()`](https://developer.chrome.com/blog/css-color-mix/) function from CSS Color 5, and the `forced-color-adjust` property.

Firefox also includes the [`nth-child of <selector>`](https://developer.mozilla.org/docs/Web/CSS/:nth-child#the_of_selector_syntax) syntax, giving finer control of which elements you want to select. Read more in [More control over :nth-child() selections with the of S syntax](https://developer.chrome.com/articles/css-nth-child-of-s/).

For CSS, Chrome 113 includes the `overflow-inline`, `overflow-block`, and `update` media features. Also included in the `linear()` easing function, and the unprefixed `image-set()` type.

Chrome 113 also includes [WebGPU](https://developer.chrome.com/blog/webgpu-release/), the successor to the WebGL and WebGL 2 graphics APIs for the Web. It provides modern features such as GPU compute, lower overhead access to GPU hardware, the ability to render to multiple canvases from a single graphics device, and better, more predictable performance.

_Photo by [Karen Ciocca](https://unsplash.com/@moonflowerstudiocreativet)._
