---
title: What To Expect When Dropping IE11
canonical: https://whistlr.info/2019/html-past-ie11/
subhead: >
  50+ web features you can use when you say 👋 to IE11 support
description: >
  As web developers, old browsers can consume our mindshare: what features can
  I use, or will I need a polyfill. IE11, the last major pre-evergreen browser
  had its last release on July 29, 2015—read about the features you can safely
  use once you drop it from your support matrix.
authors:
  - samthor
hero: hero.jpg
date: 2019-06-17
updated: 2020-05-12
tags:
  - blog
---

So you've decided to drop support for IE11 and move onto evergreen browsers only (as of April 2020, IE11 is &lt;1.5% globally).
That's great! 🌲

With that in mind, here's a giant list of the features you should use, _without_ polyfills or feature detection. 📃

Before we start, of course, there'll always be old browsers.
And, to be fair, browsers in emerging markets are more complex: like UC, KaiOS (based on an older Firefox), and Opera Mini.
In these cases, I suggest serving [no JS whatsoever](https://dev.to/chromiumdev/the-chrome-dev-summit-site-case-study-15ng) (if possible), or encouraging users to upgrade. 🤷

Let's go! ⬇️

## The DOM

* Choose image URL [based on resolution](https://www.youtube.com/watch?v=SyVKRnusyqM) 📽️ (via `<img srcset>` and `<picture>`)

* Frames [can load from](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9121088/) a `Blob`

* Disable form elements with [`<fieldset disabled>`](https://dev.to/chromiumdev/disable-a-html-form-while-in-flight-using-fieldset-61b), useful for in-progress forms

* HTML input types `color` [and various date/time options](https://robertnyman.com/html5/forms/input-types.html)

* HTML templates and the `<template>` element (this is also in JS, but you can specify them in your pages)

* The `<meter>` element ([goes along with `<progress>`](https://peter.sh/examples/?/html/meter-progress.html))

## JavaScript Language

* **ES Modules, through `<script type="module">` and `import`/`export`** 🎉

* Template literals (with backticks)

* Classes like `class Foo { constructor() { ... } }`

* Functions! Arrow functions, rest parameters, `async` functions that allow `await`, generators which can `yield`

## JavaScript Library

* `Promise` [and `fetch`](https://developers.google.com/web/fundamentals/primers/async-functions) (no need for `XMLHttpRequest` anymore 🚫)

  * XHR's `responseType` can also [now be set safely to "json"](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType), but why would you bother? 🤷

* Methods on `Array`: `find`, `includes`; and on `String`: `includes`, `padStart` and `padEnd`

* The `Proxy` object, allowing for interesting [approaches](https://exploringjs.com/es6/ch_proxies.html)

* Methods on `Object`: `entries` and `values`, for iteration (like `Object.keys`)

* The `URL` and `URLSearchParams` objects (useful to check for query params and work with URLs)

* The `currentScript` property (["what file am I"](https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript))

* You can safely dispatch a `new CustomEvent('....')` rather than dealing [with weird intializers](https://www.google.com.au/search?q=ie11+"new+CustomEvent"+broken)

* `Symbol` and friends

## JavaScript + The DOM

* [Better convenience methods for HTML](https://whistlr.info/2019/better-html-convenience/)

* The third argument to `addEventListener`, allowing you to set `{once: true}` and [other options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)

* `IntersectionObserver`, allowing you to tell [whether DOM nodes are visible](https://developers.google.com/web/updates/2016/04/intersectionobserver)

* The `navigator.sendBeacon` method, to send POST messages [even if a page closes](https://dev.to/chromiumdev/sure-you-want-to-leavebrowser-beforeunload-event-4eg5)

* Find the [closest matching element](https://dev.to/samthor/matching-elements-with-selectors-in-js-4991) with `closest`

* The 2nd argument to `classList.toggle`, allowing you to set or remove a class via parameter (also, the `.relList` property on links)

* Canvas blend modes ([this is the `.globalCompositeOperation` property](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation))

* Determine whether a CSS feature is supported via `CSS.supports` (but this only helps _future_ features)

## Whole New APIs

* [**Service Workers**](https://jakearchibald.github.io/isserviceworkerready/) 🥳

* [Web Assembly](https://www.youtube.com/watch?v=iPtMiqutNT4) 👩‍💻

* Gamepad API 🎮

* Web Audio API 📣

* [Pointer Lock API](https://mdn.github.io/dom-examples/pointer-lock/): useful for HTML games and rich experiences 🐁🔒

* Constraint Validation API (improved form validation) 📏

* [WebRTC](https://webrtc.org/) 📽️

* `getUserMedia` to get access to video, audio streams 🙏

## CSS

* **Grid 🎉**

* CSS Variables, such as `--foo: blue;`, used with `color: var(--foo)`

* Sticky Position

* CSS filters, allowing for visual effects like invert, drop shadow and hue changes

* **Image `object-fit`** (Edge only supports it on `<img>`), allowing you to make an image contain or cover its contents rather than _stretch_

* Improved media queries [for pointer or mouse access](https://googlechrome.github.io/samples/media-hover-pointer/) <small>Fun fact: this was one of the first demos I wrote working on Chrome.</small>

* New [CSS cursors](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) 'grab', 'zoom-in', 'zoom-out'

* The `::placeholder` pseudo-element, for styling the placeholder text inside an `<input>`

* Using `initial` or `unset` [as CSS values](https://www.quirksmode.org/css/cascading/values.html)

* The `vmax` unit, which is a percent of whichever's larger: [width or height](https://css-tricks.com/fun-viewport-units/)

* Going along with the JS method, the CSS `@supports` [at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports)

* Read-only and read-write pseudo-class selectors (`:read-write` seems [the more useful](https://developer.mozilla.org/en-US/docs/Web/CSS/:read-write) of the two)

* [Stroke and fill on text](https://webkit.org/blog/85/introducing-text-stroke/)

   * Although supported on all evergreens, you'll need to include the `-webkit-` prefixes: yes, *even for Edge and Firefox*

* Risky bugs in IE11 are no longer an issue:

  * You can now safely put `calc(...)` [inside a CSS animation](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/105834/)

  * CSS `display: flex` had a [variety of issues](https://github.com/philipwalton/flexbugs)
