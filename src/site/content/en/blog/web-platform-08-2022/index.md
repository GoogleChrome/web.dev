---
layout: post
title: "New to the web platform in August"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during August 2022.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during August 2022.
date: 2022-08-31
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/S1QCCeuPNPnSGPMLqOgn.JPG
alt: A balloon and ferris wheel.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In July, [Firefox 104](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/104), [Chrome 104](https://developer.chrome.com/blog/new-in-chrome-104/), and [Chrome 105](https://developer.chrome.com/blog/new-in-chrome-105/) became stable.

### Individual transforms

Chrome 104 includes [individual properties for CSS Transforms](/css-individual-transform-properties/). The properties are `scale`, `rotate`, and `translate`, which you can use to individually define those parts of a transformation.

By doing so, Chrome joins Firefox and Safari which already support these properties.

{% BrowserCompat 'css.properties.scale' %}

### New media query syntax

Chrome 104 also includes [the media query range syntax](https://developer.chrome.com/blog/media-query-range-syntax/). This has already been shipped by Firefox, and helps streamline media queries. For example the following media query:

```css
@media (min-width: 400px) {
  // Styles for viewports with a width of 400 pixels or greater.
}
``` 

Can be written using a comparison operator:

```css
@media (width >= 400px) {
  // Styles for viewports with a width of 400 pixels or greater.
}
```

{% BrowserCompat 'css.at-rules.media.range_syntax' %}

### Container queries

Chrome 105 is an exciting release bringing the long-awaited feature of container queries to the web platform. While media queries give you a way to query against the size of the viewport, container queries provide a method of querying against the size of a container.

{% BrowserCompat 'css.at-rules.container' %}

To use container queries, turn on containment using the `container-type` property.

```css
.card-container {
  container-type: inline-size;
}
```

Setting the `container-type` to `inline-size` queries the inline-direction size of the parent. In latin languages like english, this would be the width of the card, since the text flows inline from left to right.

Now, we can use that container to apply styles to any of its children using `@container`:

```css
.card {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

@container (max-width: 400px) {
  .card {
    grid-template-columns: 1fr;
  }
}
```

You can find out more about container queries in the post [@container and :has(): two powerful new responsive APIs landing in Chromium 105](https://developer.chrome.com/blog/has-with-cq-m105/).

### The :has() parent pseudo-class

The post mentioned above also mentions `:has()`. This new pseudo-class The CSS :has() pseudo-class gives you a way to target the parent element and siblings based on conditions. Learn more in [:has() the family selector](https://developer.chrome.com/blog/has-m105/).

{% BrowserCompat 'css.selectors.has' %}

### The findLast() and findLastIndex() methods

Firefox 104 adds support for the methods [Array.prototype.findLast()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast), 
[Array.prototype.findLastIndex()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex), 
[TypedArray.prototype.findLast()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/findLast), and [TypedArray.prototype.findLastIndex()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/findLastIndex). These are used to find the value and index (respectively) of the last element in an Array or TypedArray that matches a supplied test function.

{% BrowserCompat 'javascript.builtins.Array.findLast' %}

### Sanitizer API

Also in Chrome 105 is the [Sanitizer API](https://developer.chrome.com/blog/new-in-chrome-105/#sanitizer-api). This API builds sanitization into the platform to help remove cross-site scripting vulnerabilities. 

{% BrowserCompat 'api.Sanitizer' %}

Also in Chrome 105 is the [:modal](https://developer.mozilla.org/docs/Web/CSS/:modal) CSS pseudo-class. This matches an element that is in a state in which it excludes all interaction with elements outside it. For example, a `<dialog>` opened with the `showModal()` API.

{% BrowserCompat 'css.selectors.modal' %}

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release.

Due to release dates falling just outside the month, the only new beta in August was [Firefox 105](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/105), which is currently light on details.

The Safari 16 beta [mentioned in June](/web-platform-06-2022/#safari-16-brings-several-key-features-to-the-browser) is also still ongoing. 
