---
title: 'HTML APIs'
authors:
  - estelleweyl
description: Learn how HTML information can be exposed and manipulated using JavaScript.
date: 2023-02-21
tags:
  - html
---

In the introduction to this series it says "HTML elements are the nodes that make up the [Document Object Model](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)."
We've discussed the type of element nodes. In this section we discuss element APIs that enable querying those nodes.

## The DOM and AOM

The DOM is an API for accessing and manipulating documents. The DOM is the tree of all the nodes in the document.
Some nodes can have children, others can't. The tree includes elements, along with their attributes, and text nodes.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/xsvSa8YkwHyPWNnQ8Tpi.png", alt="MLW Node tree showing elements and text nodes.", width="800", height="431" %}

Browser tools don't provide tree visualizations like the one above, but you can see the nodes in the element inspector.

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/rX9myUwejCW2Ab0xUu0l.png", alt="The DOM/ARIA.", width="800", height="836" %}

The tree representation that can be inspected in browser developer tools is the [accessibility tree](/learn/accessibility/aria-html/#the-accessibility-tree). The AOM is based
off the DOM; similarly, the accessibility tree contains objects representing all the markup elements, attributes, and text
nodes:

{% Img src="image/cGQxYFGJrUUaUZyWhyt9yo5gHhs1/KMEuk7ub4ejE7zdr5Vyk.png", alt="An example of AOM.", width="800", height="527" %}

## HTML Element APIs

The middle letter of DOM is "object." Just like the `person` or `car` object example from most intro to object-oriented programming
classes, every node in the document tree is an object that can be manipulated with JavaScript.

The browser provides numerous
APIs providing natively supported methods, events, and property querying and updating.
Element nodes contain information about all the attributes set on the element. You can use HTML interfaces to access
information about an element's attributes. For example, we can use [`HTMLImageElement.alt`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/alt)
get the `alt` attributes of all the images:

```js
let allImages = document.querySelectorAll('img');
allImages.forEach((imageInstance) => {
  console.log(imageInstance.alt);
});
```

HTML interfaces provide more than just access to an element's attributes; you can access a lot more information. We can
find the read-only [`HTMLElement.offsetHeight`](https://developer.mozilla.org/docs/Web/API/HTMLElement/offsetHeight) to get the height of each section in our page, relative to the layout.

```js
let allSections = document.querySelectorAll('section');
allSections.forEach((sectionInstance) => {
  console.log(sectionInstance.offsetHeight);
});
```

If the user changes their device orientation or otherwise changes the width of the viewport, the height of each `<section>`
will change and the DOM properties will automatically update with it.

The HTML interface APIs is not limited to accessing attribute values. The DOM provides insight into the current state of the UI.
HTML APIs can access all of that information. You can access the length of a video, where a view is in the current playback,
and if the video (or audio) has finished playing with [`HTMLMediaElement.duration`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/duration),
[`HTMLMediaElement.currentTime`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/currentTime), and
[`HTMLMediaElement.ended`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/ended) respectively.

## Available element interfaces

Most HTML element we've covered thus far in this series and have yet to cover, other than some [sectioning elements](/learn/html/headings-and-sections/), have
an associated DOM interface. The base interface for all elements is aptly named [Element](https://developer.mozilla.org/docs/Web/API/Element).
The [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) inherits from Element and all HTML element-specific
interfaces inherit from it. Some element-specific interfaces are implemented by multiple, similar elements.

The interfaces include:

* [`HTMLAnchorElement`](https://developer.mozilla.org/docs/Web/API/HTMLAnchorElement) - `<a>`
* [`HTMLAreaElement`](https://developer.mozilla.org/docs/Web/API/HTMLAreaElement) - `<area>`
* [`HTMLAudioElement`](https://developer.mozilla.org/docs/Web/API/HTMLAudioElement) - `<audio>`
* [`HTMLBaseElement`](https://developer.mozilla.org/docs/Web/API/HTMLBaseElement) - `<base>`
* [`HTMLButtonElement`](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement) - `<button>`
* [`HTMLCanvasElement`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement) - `<canvas>`
* [`HTMLDataElement`](https://developer.mozilla.org/docs/Web/API/HTMLDataElement) - `<data>`
* [`HTMLDataListElement`](https://developer.mozilla.org/docs/Web/API/HTMLDataListElement) - `<datalist>`
* [`HTMLDetailsElement`](https://developer.mozilla.org/docs/Web/API/HTMLDetailsElement) - `<details>`
* [`HTMLDialogElement`](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement) - `<dialog>`
* [`HTMLEmbedElement`](https://developer.mozilla.org/docs/Web/API/HTMLEmbedElement) - `<embed>`
* [`HTMLFieldSetElement`](https://developer.mozilla.org/docs/Web/API/HTMLFieldSetElement) - `<fieldset>`
* [`HTMLFormElement`](https://developer.mozilla.org/docs/Web/API/HTMLFormElement) - `<form>`
* [`HTMLHtmlElement`](https://developer.mozilla.org/docs/Web/API/HTMLHtmlElement) - `<html>`
* [`HTMLIFrameElement`](https://developer.mozilla.org/docs/Web/API/HTMLIFrameElement) - `<iframe>`
* [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement) - `<img>`
* [`HTMLInputElement`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement) - `<input>`
* [`HTMLLabelElement`](https://developer.mozilla.org/docs/Web/API/HTMLLabelElement) - `<label>`
* [`HTMLLegendElement`](https://developer.mozilla.org/docs/Web/API/HTMLLegendElement) - `<legend>`
* [`HTMLLIElement`](https://developer.mozilla.org/docs/Web/API/HTMLLIElement) - `<li>`
* [`HTMLLinkElement`](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement) - `<link>`
* [`HTMLMapElement`](https://developer.mozilla.org/docs/Web/API/HTMLMapElement) - `<map>`
* [`HTMLMediaElement`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement) - `<audio>`, `<video>`
* [`HTMLMenuElement`](https://developer.mozilla.org/docs/Web/API/HTMLMenuElement) - `<menu>`
* [`HTMLMetaElement`](https://developer.mozilla.org/docs/Web/API/HTMLMetaElement) - `<meta>`
* [`HTMLMeterElement`](https://developer.mozilla.org/docs/Web/API/HTMLMeterElement) - `<meter>`
* [`HTMLModElement`](https://developer.mozilla.org/docs/Web/API/HTMLModElement) - `<ins>`, `<del>`
* [`HTMLObjectElement`](https://developer.mozilla.org/docs/Web/API/HTMLObjectElement) - `<object>`
* [`HTMLOListElement`](https://developer.mozilla.org/docs/Web/API/HTMLOListElement) - `<ol>`
* [`HTMLOptGroupElement`](https://developer.mozilla.org/docs/Web/API/HTMLOptGroupElement)- `<optgroup>`
* [`HTMLOptionElement`](https://developer.mozilla.org/docs/Web/API/HTMLOptionElement) - `<option>`
* [`HTMLOutputElement`](https://developer.mozilla.org/docs/Web/API/HTMLOutputElement) - `<output>`
* [`HTMLPictureElement`](https://developer.mozilla.org/docs/Web/API/HTMLPictureElement) - `<picture>`
* [`HTMLProgressElement`](https://developer.mozilla.org/docs/Web/API/HTMLProgressElement) - `<progress>`
* [`HTMLQuoteElement`](https://developer.mozilla.org/docs/Web/API/HTMLQuoteElement) - `<q>`, `<blockquote>`, `<cite>`
* [`HTMLScriptElement`](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement) - `<script>`
* [`HTMLSelectElement`](https://developer.mozilla.org/docs/Web/API/HTMLSelectElement) - `<select>`
* [`HTMLSlotElement`](https://developer.mozilla.org/docs/Web/API/HTMLSlotElement) - `<slot>`
* [`HTMLSourceElement`](https://developer.mozilla.org/docs/Web/API/HTMLSourceElement) - `<source>`
* [`HTMLStyleElement`](https://developer.mozilla.org/docs/Web/API/HTMLStyleElement) -  `<style>`
* [`HTMLTableCellElement`](https://developer.mozilla.org/docs/Web/API/HTMLTableCellElement) - `<td>`, `<th>`
* [`HTMLTableColElement`](https://developer.mozilla.org/docs/Web/API/HTMLTableColElement) - `<col>`, `<colgroup>`
* [`HTMLTableElement`](https://developer.mozilla.org/docs/Web/API/HTMLTableElement) - `<table>`
* [`HTMLTableRowElement`](https://developer.mozilla.org/docs/Web/API/HTMLTableRowElement) - `<tr>`
* [`HTMLTableSectionElement`](https://developer.mozilla.org/docs/Web/API/HTMLTableSectionElement) - `<thead>`, `<tbody>`, `<tfoot>`
* [`HTMLTemplateElement`](https://developer.mozilla.org/docs/Web/API/HTMLTemplateElement) - `<template>`
* [`HTMLTextAreaElement`](https://developer.mozilla.org/docs/Web/API/HTMLTextAreaElement) - `<textarea>`
* [`HTMLTimeElement`](https://developer.mozilla.org/docs/Web/API/HTMLTimeElement) - `<time>`
* [`HTMLTitleElement`](https://developer.mozilla.org/docs/Web/API/HTMLTitleElement) - `<title>`
* [`HTMLTrackElement`](https://developer.mozilla.org/docs/Web/API/HTMLTrackElement) - `<track>`
* [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement) - `<video>`

The naming convention is "HTML" followed by an element or grouping of elements in upper camel case, followed by "Element",
but the element or grouping of elements part follows no exact pattern. Don't worry. There is no need to memorize these.
It's just important to know that they exist so you can look them up when you need to.

If you have a collection of elements, there are also come collection interfaces. For example, the
[`HTMLCollection.namedItem()`](https://developer.mozilla.org/docs/Web/API/HTMLCollection/namedItem) method returns the first
element in the collection whose `id` or `name` attribute matches the parameter, or null if no element matches.

Over 30 elements don't have an associated DOM interface other than `HTMLElement` including `<address>`, `<article>`,
`<section>`, `<nav>`, `<header>`, `<footer>`, `<aside>`, and `<hgroup>`. Many elements that don't support any non-deprecated,
non-global attributes have element specific interfaces, like `HTMLPElement` (the `<p>` element) and [`HTMLUnknownElement`](https://developer.mozilla.org/docs/Web/API/HTMLUnknownElement)
( `<😃>` or any other elements that are not defined), but those interfaces don't implement any additional properties or methods
on top of the properties and methods inherited from `HTMLElement`, and are not listed above.

### Redundant API methods and properties

If an interface has the same method or property name as and interface it inherits, the inheriting method or property overwrites
the inherited one. When we accessed the `alt` and `offsetHeight` properties above with `imageInstance.alt` and `sectionInstance.offsetHeight`
respectively, the code didn't identify which API was being accessed.

Generally, as with these two examples, this isn't an issue. But, it can be. For example, the [`HTMLCollection.length`](https://developer.mozilla.org/docs/Web/API/HTMLCollection/length)
is read only, while the inheriting [`HTMLOptionsCollection`](https://developer.mozilla.org/docs/Web/API/HTMLOptionsCollection) interface's
length property (returned only by the `options` property of `<select>`) can also be used to set collection size.

## Other interfaces

There are additional interfaces that enable manipulating the branch locations of DOM nodes. The [`EventTarget`](https://developer.mozilla.org/docs/Web/API/EventTarget) interface, which provides
us with [`addEventListener()`](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener) and [`removeEventListener()`](https://developer.mozilla.org/docs/Web/API/EventTarget/removeEventListener), is inherited by the [`Node`](https://developer.mozilla.org/docs/Web/API/Node) and [`Window`](https://developer.mozilla.org/docs/Web/API/Window) interfaces. In turn, the Element, Document, and DocumentFragment (which we saw in [custom elements](/learn/html/template)) interfaces inherit from Node, and the HTMLElement interface inherits from Element.

### The `node` interface

Every type of DOM node is represented by an interface based on [`Node`](https://developer.mozilla.org/docs/Web/API/Node),
which provides information and methods as elements relate to the DOM tree. The `Node` interface enables querying and adding nodes to the node tree.

Douglas Crockford's famous "walk the DOM" function, makes use of Node's [`firstChild`](https://developer.mozilla.org/docs/Web/API/Node/firstChild)
and the [`nextSibling`](https://developer.mozilla.org/docs/Web/API/Node/nextSibling) properties.

```javascript
const walk_the_DOM = function walk(node, callback) {
  callback(node);
  node = node.firstChild;
  while (node) {
    walk(node, callback);
    node = node.nextSibling;
  }
};
```

We used Node's [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) and
[`cloneNode()`](https://developer.mozilla.org/docs/Web/API/Node/cloneNode) methods in defining [custom elements](/learn/html/template).
The Node interface provides many useful properties and methods for querying and manipulating the DOM.

```javascript
customElements.define('star-rating',
  class extends HTMLElement {
    constructor() {
      super(); // Always call super first in constructor
      const starRating = document.getElementById('star-rating-template').content;
      const shadowRoot = this.attachShadow({
        mode: 'open'
      });
      shadowRoot.appendChild(starRating.cloneNode(true));
    }
  });
```

The [`attachShadow()`](https://developer.mozilla.org/docs/Web/API/Element/attachShadow) method is a method of the Element
interface. There is also a [`shadowRoot`](https://developer.mozilla.org/docs/Web/API/ShadowRoot) interface for the
[Shadow DOM API](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM) rendered separately from a
document's main DOM tree.

### The `Document` and `HTMLDocument` interfaces

The [`Document`](https://developer.mozilla.org/docs/Web/API/Document) interface inherits from `Node`. It represents the
web page loaded in the browser, whether the document is HTML, SVG, XML, MathML, or other. The `Document` interface also
inherits from the `HTMLDocument` interface.

The `document` enables quick access to node types and the ability to create collections of specific element types, such as
`document.body` and `document.styleSheets`. The HTMLDocument enables accessing information relevant to the document that
are not found in HTML nodes, such as the [`Document.location`](https://developer.mozilla.org/docs/Web/API/Document/location),
[`Document.lastModified`](https://developer.mozilla.org/docs/Web/API/Document/lastModified), and [`Document.Cookie`](https://developer.mozilla.org/docs/Web/API/Document/cookie).

Several APIs are available based on features surfaced through the document interface, including the [Drag and Drop API](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)
and the [FullScreen API](https://developer.mozilla.org/docs/Web/API/Fullscreen_API). Both inherit from `Element`.

### The `Window` interface

The Window interface includes globally available items beyond the DOM that can be used to manipulate the DOM. Window provides
functions, namespaces, objects, and constructors documented in MDN's [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference)
and [DOM References](https://developer.mozilla.org/docs/Web/API/Document_Object_Model).

The Window interface is the API for the object containing the document. The global `window` object is the window in which the
script is running. Every browser tab contains its own Window object. The Window interface can query the contents of the tab
as well as the overall window and device. For example, the [`resizeTo()`](https://developer.mozilla.org/docs/Web/API/Window/resizeTo)
method can be used to resize the browser window, the [`devicePixelRatio`](https://developer.mozilla.org/docs/Web/API/Window/devicePixelRatio)
property provides access to the device display pixels. When accessing information about the tab the content
is in rather than the DOM tree the tab displays, the window is likely the interface you're looking for.

Several APIs are available based on features surfaced through the Window interface, including the [Web Workers](https://developer.mozilla.org/docs/Web/API/Worker)
and [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API) APIs.

{% Assessment 'apis' %}
