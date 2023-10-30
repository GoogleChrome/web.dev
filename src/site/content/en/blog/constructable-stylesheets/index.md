---
layout: post
title: Constructable Stylesheets
subhead: Seamless reusable styles.
authors:
  - developit
date: 2019-02-08
updated: 2023-09-23
description: Constructable Stylesheets provide a seamless way to create and distribute styles to documents or shadow roots without worrying about FOUC.
tags:
  - blog
  - css
---

[Constructable Stylesheets](https://wicg.github.io/construct-stylesheets) are a
way to create and distribute reusable styles when using [Shadow
DOM](/shadowdom-v1/).

{% BrowserCompat 'api.CSSStyleSheet.CSSStyleSheet' %}

It has always been possible to create stylesheets using JavaScript. However, the
process has historically been to create a `<style>` element using
`document.createElement('style')`, and then access its sheet property to obtain
a reference to the underlying
[CSSStyleSheet](https://developer.mozilla.org/docs/Web/API/CSSStyleSheet)
instance. This method can produce duplicate CSS code and its attendant bloat,
and the act of attaching leads to a flash of unstyled content whether there is
bloat or not. The `CSSStyleSheet` interface is the root of a collection of CSS
representation interfaces referred to as the
[CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model),
offering a programmatic way to manipulate stylesheets as well as eliminating the
problems associated with the old method.

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/ZGONaG0tsbRHWzCZpAlo.png",
alt="Diagram showing preparation and application of CSS.",
width="800", height="610" %}

Constructable Stylesheets make it possible to define and prepare shared CSS
styles, and then apply those styles to multiple Shadow Roots or the Document
easily and without duplication. Updates to a shared CSSStyleSheet are applied to
all roots into which it has been adopted, and [adopting a
stylesheet](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets)
is fast and synchronous once the sheet has been loaded.

The association set up by Constructable Stylesheets lends itself well to a
number of different applications. It can be used to provide a centralized theme
used by many components: the theme can be a `CSSStyleSheet` instance passed to
components, with updates to the theme propagating out to components
automatically. It can be used to distribute [CSS Custom
Property](https://developer.mozilla.org/docs/Web/CSS/--*) values to
specific DOM subtrees without relying on the
[cascade](https://developer.mozilla.org/docs/Web/CSS/Cascade). It can even
be used as a direct interface to the browser's CSS parser, making it easy to
preload stylesheets without injecting them into the DOM.

## Constructing a stylesheet

Rather than introducing a new API to accomplish this, the [Constructable
StyleSheets](https://www.w3.org/TR/cssom-1/#dom-cssstylesheet-cssstylesheet)
specification makes it possible to create stylesheets imperatively by invoking
the `CSSStyleSheet()` constructor. The resulting CSSStyleSheet object has two
new methods that make it safer to add and update stylesheet rules without
triggering [Flash of Unstyled
Content](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) (FOUC).
The
[`replace()`](https://developer.mozilla.org/docs/Web/API/CSSStyleSheet/replace)
and
[`replaceSync()`](https://developer.mozilla.org/docs/Web/API/CSSStyleSheet/replaceSync)
methods both replace the stylesheet with a string of CSS, and `replace()`
returns a Promise. In both cases, external stylesheet references are not
supported—any `@import` rules are ignored and will produce a warning.

```js
const sheet = new CSSStyleSheet();

// replace all styles synchronously:
sheet.replaceSync('a { color: red; }');

// replace all styles:
sheet.replace('a { color: blue; }')
  .then(() => {
    console.log('Styles replaced');
  })
  .catch(err => {
    console.error('Failed to replace styles:', err);
  });

// Any @import rules are ignored.
// Both of these still apply the a{} style:
sheet.replaceSync('@import url("styles.css"); a { color: red; }');
sheet.replace('@import url("styles.css"); a { color: red; }');
// Console warning: "@import rules are not allowed here..."
```

{% Aside 'gotchas' %}
In earlier versions of the specification,
`replace()` allowed `@import` rules and returned
a Promise that resolved when these were finished loading. This feature was
[removed from the specification](https://github.com/WICG/construct-stylesheets/issues/119#issuecomment-642300024)
and `@import` rules are
ignored with a warning as of Chrome 84.
{% endAside %}

## Using constructed stylesheets

The second new feature introduced by Constructable StyleSheets is an
[adoptedStyleSheets](https://www.w3.org/TR/cssom-1/#extensions-to-the-document-or-shadow-root-interface)
property available on [Shadow
Roots](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)
and [Documents](https://developer.mozilla.org/en/docs/Web/API/Document). This
lets us explicitly apply the styles defined by a `CSSStyleSheet` to a given DOM
subtree. To do so, we set the property to an array of one or more stylesheets to
apply to that element.

```js
// Create our shared stylesheet:
const sheet = new CSSStyleSheet();
sheet.replaceSync('a { color: red; }');

// Apply the stylesheet to a document:
document.adoptedStyleSheets.push(sheet);

// Apply the stylesheet to a Shadow Root:
const node = document.createElement('div');
const shadow = node.attachShadow({ mode: 'open' });
shadow.adoptedStyleSheets.push(sheet);
```

{% Aside 'gotchas' %}
In earlier versions of the specification, `adoptedStyleSheets` was implemented
as a frozen array, meaning in-place mutations like `push()` threw an exception.
Adding a new stylesheet required redefiningthe array: `document.adoptedStyleSheets = [...document.adoptedStyleSheets, newSheet]`
This is no longer the case as the [spec](https://www.w3.org/TR/cssom-1/#extensions-to-the-document-or-shadow-root-interface)
has been updated to allow for array mutations.
{% endAside %}

## Putting it all together

With Constructable StyleSheets, web developers now have an explicit solution for
creating CSS StyleSheets and applying them to DOM trees. We have a new
Promise-based API for loading StyleSheets from a string of CSS source that uses
the browser's built-in parser and loading semantics. Finally, we have a
mechanism for applying stylesheet updates to all usages of a StyleSheet,
simplifying things like theme changes and color preferences.

{% Video src="video/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/0wKHfcRTB7tn9vWkrqcU.mp4",
autoplay=true,
playsinline=true %}

**[View Demo](https://construct-stylesheets.glitch.me/)**

## Looking ahead

The initial version of Constructable Stylesheets shipped with the API
described here, but there's work underway to make things easier to use. There's
a [proposal](https://github.com/WICG/construct-stylesheets/issues/45) to extend
the `adoptedStyleSheets` FrozenArray with dedicated methods for inserting and
removing stylesheets, which would obviate the need for array cloning and avoid
potential duplicate stylesheet references.

## More information

* [Chrome Platform Status](https://www.chromestatus.com/feature/5394843094220800)
* [Example](https://construct-stylesheets.glitch.me/)
* [API](https://wicg.github.io/construct-stylesheets/)
* [Explainer](https://github.com/WICG/construct-stylesheets/blob/gh-pages/explainer.md)
* [Intent to Implement](https://groups.google.com/a/chromium.org/d/topic/blink-dev/irhrlr6n5YQ/discussion)
* [Intent to Ship](https://groups.google.com/a/chromium.org/d/topic/blink-dev/gL2EVBzO5og/discussion)
* [Discourse](https://discourse.wicg.io/t/proposal-constructable-stylesheet-objects/2572)
