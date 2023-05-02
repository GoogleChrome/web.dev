---
layout: post
title: Web Components v1 - the next generation
subhead: Web Components are gaining cross-browser support, the community is growing in leaps and bounds, and there’s a brand-new Web Component catalog to find exactly the component you need.
authors:
  - taylorsavage
description: |
  Web Components are gaining cross-browser support, the community is growing in leaps and bounds, and there’s a brand-new Web Component catalog to find exactly the component you need.
date: 2017-01-10
updated: 2017-01-10
tags:
  - blog

---

Ever wanted to build your own self-contained JavaScript component, that you can
easily use across multiple projects or share with other developers regardless of
what JavaScript framework they use? Web Components may be for you.

Web Components are a set of new web platform features that let you create your
own HTML elements. Each new custom element can have a custom tag like
`<my-button>`, and have all the goodness of built-in elements - custom elements
can have properties and methods, fire and respond to events, and even have an
encapsulated style and DOM trees to bring along their own look and feel.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/xJG9oEv9gPswKbN6hyzo.gif", alt="Animation of paper-progress element.", width="576", height="174" %}
</figure>

By providing a platform-based, low-level component model, Web Components let you
build and share re-usable elements for everything from specialized buttons to
complex views like datepickers. Because Web Components are built with platform
API’s which include powerful encapsulation primitives, you can even use these
components within other JavaScript libraries or frameworks as if they were
standard DOM elements.

You may have heard of Web Components before - an early version of the Web
Components spec - v0 - was [shipped in Chrome
33](https://www.chromestatus.com/feature/4642138092470272).

Today, thanks to broad collaboration between browser vendors, the
next-generation of the Web Components spec - v1 - is gaining wide support.
Chrome supports the two major specs that make up Web Components - [Shadow
DOM](/shadowdom-v1/) and [Custom
Elements](/custom-elements-v1/)
- as of [Chrome 53](https://www.chromestatus.com/feature/4667415417847808) and
[Chrome 54](https://www.chromestatus.com/feature/4696261944934400) respectively.
Safari shipped support for [Shadow DOM v1 in Safari
10](https://webkit.org/status/#feature-shadow-dom), and has completed
implementation of [Custom Elements v1 in
WebKit](https://webkit.org/blog/7027/introducing-custom-elements/). Firefox is
currently developing [Shadow
DOM](https://mozilla.github.io/standards-positions/#declarative-shadow-dom) and [Custom
Elements](https://mozilla.github.io/standards-positions/#custom-elements) v1, and both
[Shadow
DOM](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/shadowdom/)
and [Custom
Elements](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/customelements/)
are on the roadmap for Edge.

To define a new custom element using the v1 implementation, you simply create a
new class that extends `HTMLElement` using ES6 syntax and register it with the
browser:

```js
class MyElement extends HTMLElement {...}
window.customElements.define('my-element', MyElement);
```

The new v1 specs are extremely powerful - we’ve put together tutorials on using
[Custom Elements v1](/custom-elements-v1/)
and [Shadow DOM v1](/shadowdom-v1/) to help
you get started.

## webcomponents.org

The Web Component community is also growing in leaps and bounds. We’re excited
to see the launch of an updated
[webcomponents.org](https://www.webcomponents.org/) site - the focal point of
the web components community - including an integrated catalog for developers to
share their elements.


<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/b3XhRqdMM107Vb3P8pKI.gif", alt="webcomponents.org", width="600", height="652" %}
</figure>

The webcomponents.org site contains information about the Web Components
[specs](https://www.webcomponents.org/specs), updates and content from the [web
components community](https://www.webcomponents.org/community), and displays
documentation for [open-source
elements](https://www.webcomponents.org/element/PolymerElements/paper-button)
and [collections of
elements](https://www.webcomponents.org/collection/PolymerElements/paper-elements)
built by other developers.

You can get started building your first element using a library like Google’s
[Polymer](https://www.polymer-project.org/), or just use the low-level Web
Component API’s directly. Then [publish your
element](https://www.webcomponents.org/publish) on webcomponents.org.

Happy componentizing!
