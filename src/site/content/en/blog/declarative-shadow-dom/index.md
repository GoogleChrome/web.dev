---
title: Declarative Shadow DOM
subhead: |
  A new way to implement and use Shadow DOM directly in HTML.
date: 2020-09-30
updated: 2021-04-14
hero: image/admin/IIPe5m8edvp0XMPpzrz9.jpg
alt: decorative shadow dome
authors:
  - developit
  - masonfreed
description: |
  Declarative Shadow DOM is a new way to implement and use Shadow DOM directly in HTML.
tags:
  - blog
  - dom
  - html
  - javascript
  - layout
  - rendering
feedback:
  - api
---

{% Aside %}
Declarative Shadow DOM is a proposed web platform feature that the Chrome team is looking for
feedback on. Try it out using the [experimental flag](#detection-support) or [polyfill](#polyfill).
{% endAside %}

[Shadow DOM](https://developers.google.com/web/fundamentals/web-components/shadowdom)
is one of the three Web Components standards, rounded out by
[HTML templates](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots)
and
[Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).
Shadow DOM provides a way to scope CSS styles to a specific DOM subtree and isolate that subtree
from the rest of the document. The `<slot>` element gives us a way to control where the children
of a Custom Element should be inserted within its Shadow Tree. These features combined enable a
system for building self-contained, reusable components that integrate seamlessly into existing
applications just like a built-in HTML element.

Until now, the only way to use Shadow DOM was to construct a shadow root using JavaScript:

```js
const host = document.getElementById('host');
const shadowRoot = host.attachShadow({mode: 'open'});
shadowRoot.innerHTML = '<h1>Hello Shadow DOM</h1>';
```

An imperative API like this works fine for client-side rendering: the same JavaScript modules that
define our Custom Elements also create their Shadow Roots and set their content. However, many web
applications need to render content server-side or to static HTML at build time. This can be an
important part of delivering a reasonable experience to visitors who may not be capable of running
JavaScript.

The justifications for
[Server-Side Rendering](https://developers.google.com/web/updates/2019/02/rendering-on-the-web)
(SSR) vary from project to project. Some websites must provide fully functional server-rendered
HTML in order to meet accessibility guidelines, others choose to deliver a baseline no-JavaScript
experience as a way to guarantee good performance on slow connections or devices.

Historically, it has been difficult to use Shadow DOM in combination with Server-Side Rendering
because there was no built-in way to express Shadow Roots in the server-generated HTML. There are
also performance implications when attaching Shadow Roots to DOM elements that have already been
rendered without them. This can cause layout shifting after the page has loaded, or temporarily
show a flash of unstyled content ("FOUC") while loading the Shadow Root's stylesheets.

[Declarative Shadow DOM](https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md)
(DSD) removes this limitation, bringing Shadow DOM to the server.

## Building a Declarative Shadow Root {: #building }

A Declarative Shadow Root is a `<template>` element with a `shadowroot` attribute:

```html
<host-element>
  <template shadowroot="open">
    <slot></slot>
  </template>
  <h2>Light content</h2>
</host-element>
```

A template element with the `shadowroot` attribute is detected by the HTML parser and immediately
applied as the shadow root of its parent element. Loading the pure HTML markup from the above
sample results in the following DOM tree:

```html
<host-element>
  #shadow-root (open)
  <slot>
    ↳
    <h2>Light content</h2>
  </slot>
</host-element>
```

{% Aside %}
This code sample is following the Chrome DevTools Elements panel's conventions
for displaying Shadow DOM content. For example, the `↳` character represents
slotted Light DOM content.
{% endAside %}

This gives us the benefits of Shadow DOM's encapsulation and slot projection in static HTML. No
JavaScript is needed to produce the entire tree, including the Shadow Root.

## Serialization {: #serialization }

In addition to introducing the new `<template>` syntax for creating shadow roots and attaching
them to elements, Declarative Shadow Dom also includes a new API for getting the HTML contents of
an element. The new `getInnerHTML()` method works like `.innerHTML`, but provides an option to
control whether shadow roots should be included in the returned HTML:

```js
const html = element.getInnerHTML({includeShadowRoots: true});
`<host-element>
  <template shadowroot="open"><slot></slot></template>
  <h2>Light content</h2>
</host-element>`;
```

Passing the `includeShadowRoots:true` option serializes the entire subtree of an element,
**including its shadow roots**. The included shadow roots are serialized using the
`<template shadowroot>` syntax.

In order to preserve encapsulation semantics, any
[closed shadow roots](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode) within an
element will not be serialized by default. To include closed shadow roots in the serialized HTML,
an array of references to those shadow roots can be passed via a new `closedRoots` option:

```js
const html = element.getInnerHTML({
  includeShadowRoots: true,
  closedRoots: [shadowRoot1, shadowRoot2, ...]
});
```

When serializing the HTML within an element, any closed shadow roots that are present in the
`closedRoots` array will be serialized using the same template syntax as open shadow roots:

```html
<host-element>
  <template shadowroot="closed">
    <slot></slot>
  </template>
  <h2>Light content</h2>
</host-element>
```

Serialized closed shadow roots are indicated by a `shadowroot` attribute with a value of `closed`.

## Component hydration {: #hydration }

Declarative Shadow DOM can be used on its own as a way to encapsulate styles or customize child
placement, but it's most powerful when used with Custom Elements. Components built using Custom
Elements get automatically upgraded from static HTML. With the introduction of Declarative Shadow
DOM, it's now possible for a Custom Element to have a shadow root before it gets upgraded.

A Custom Element being upgraded from HTML that includes a Declarative Shadow Root will already have
that shadow root attached. This means the element will have a `shadowRoot` property already
available when it is instantiated, without your code explicitly creating one. It's best to check
`this.shadowRoot` for any existing shadow root in your element's constructor. If there is already
a value, the HTML for this component included a Declarative Shadow Root. If the value is null,
there was no Declarative Shadow Root present in the HTML or the browser doesn't support Declarative
Shadow DOM.

```html
<menu-toggle>
  <template shadowroot="open">
    <button>
      <slot></slot>
    </button>
  </template>
  Open Menu
</menu-toggle>

<script>
  class MenuToggle extends HTMLElement {
    constructor() {
      super();

      // Detect whether we have SSR content already:
      if (this.shadowRoot) {
        // A Declarative Shadow Root exists!
        // wire up event listeners, references, etc.:
        const button = this.shadowRoot.firstElementChild;
        button.addEventListener('click', toggle);
      } else {
        // A Declarative Shadow Root doesn't exist.
        // Create a new shadow root and populate it:
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `<button><slot></slot></button>`;
        shadow.firstChild.addEventListener('click', toggle);
      }
    }
  }

  customElements.define('menu-toggle', MenuToggle);
</script>
```

Custom Elements have been around for a while, and until now there was no reason to check for an
existing shadow root before creating one using `attachShadow()`. Declarative Shadow DOM includes a
small change that allows existing components to work despite this: calling the `attachShadow()`
method on an element with an existing **Declarative** Shadow Root will **not** throw an error.
Instead, the Declarative Shadow Root is emptied and returned. This allows older components not
built for Declarative Shadow DOM to continue working, since declarative roots are preserved until
an imperative replacement is created.

For newly-created Custom Elements, a new
[ElementInternals.shadowRoot](https://github.com/w3c/webcomponents/issues/871) property provides
an explicit way to get a reference to an element's existing Declarative Shadow Root, both open and
closed. This can be used to check for and use any Declarative Shadow Root, while still falling back
to`attachShadow()` in cases where one was not provided.

```js
class MenuToggle extends HTMLElement {
  constructor() {
    super();

    const internals = this.attachInternals();

    // check for a Declarative Shadow Root:
    let shadow = internals.shadowRoot;
    if (!shadow) {
      // there wasn't one. create a new Shadow Root:
      shadow = this.attachShadow({mode: 'open'});
      shadow.innerHTML = `<button><slot></slot></button>`;
    }

    // in either case, wire up our event listener:
    shadow.firstChild.addEventListener('click', toggle);
  }
}
customElements.define('menu-toggle', MenuToggle);
```

## One shadow per root {: #shadow-per-root }

A Declarative Shadow Root is only associated with its parent element. This means shadow roots are
always colocated with their associated element. This design decision ensures shadow roots are
streamable like the rest of an HTML document. It's also convenient for authoring and generation,
since adding a shadow root to an element does not require maintaining a registry of existing shadow
roots.

The tradeoff of associating shadow roots with their parent element is that it is not possible for
multiple elements to be initialized from the same Declarative Shadow Root `<template>`. However,
this is unlikely to matter in most cases where Declarative Shadow DOM is used, since the contents
of each shadow root are seldom identical. While server-rendered HTML often contains repeated
element structures, their content generally differs–slight variations in text, attributes, etc.
Because the contents of a serialized Declarative Shadow Root are entirely static, upgrading
multiple elements from a single Declarative Shadow Root would only work if the elements happened to
be identical. Finally, the impact of repeated similar shadow roots on network transfer size is
relatively small due to the effects of compression.

In the future, it might be possible to revisit shared shadow roots. If the DOM gains support for
[built-in templating](https://w3c.github.io/webcomponents/proposals/Template-Instantiation.html),
Declarative Shadow Roots could be treated as templates that are instantiated in order to construct
the shadow root for a given element. The current Declarative Shadow DOM design allows for this
possibility to exist in the future by limiting shadow root association to a single element.

## Timing is everything {: #timing }

Associating Declarative Shadow Roots directly with their parent element simplifies the process of
upgrading and attaching them to that element. Declarative Shadow Roots are detected during HTML
parsing, and attached immediately when their **closing** `</template>` tag is encountered.

```html
<div id="el">
  <script>
    el.shadowRoot; // null
  </script>

  <template shadowroot="open">
    <!-- shadow realm -->
  </template>

  <script>
    el.shadowRoot; // ShadowRoot
  </script>
</div>
```

Prior to being attached, the contents of a `<template>` element with the `shadowroot` attribute
are an inert Document Fragment and are not accessible via the `.content` property like a standard
template. This security measure prevents JavaScript from being able to obtain a reference to closed
shadow roots. As a result, the contents of a Declarative Shadow Root are not rendered until its
closing `</template>` tag is parsed.

```html
<div>
  <template id="shadow" shadowroot="open">
    shadow realm
    <script>
      shadow.content; // null
    </script>
  </template>
</div>
```

## Parser-only {: #parser-only }

Declarative Shadow DOM is a feature of the HTML parser. This means that a Declarative Shadow Root
will only be parsed and attached for `<template>` tags with a `shadowroot` attribute that are
present during HTML parsing. In other words, Declarative Shadow Roots can be constructed during
initial HTML parsing:

```html
<some-element>
  <template shadowroot="open">
    shadow root content for some-element
  </template>
</some-element>
```

Setting the `shadowroot` attribute of a `<template>` element does nothing, and the template
remains an ordinary template element:

```js
const div = document.createElement('div');
const template = document.createElement('template');
template.setAttribute('shadowroot', 'open'); // this does nothing
div.appendChild(template);
div.shadowRoot; // null
```

To avoid some important security considerations, Declarative Shadow Roots also can't be created
using fragment parsing APIs like `innerHTML` or `insertAdjacentHTML()`. The only way to parse
HTML with Declarative Shadow Roots applied is to pass a new `includeShadowRoots` option to
`DOMParser`:

```html
<script>
  const html = `
    <div>
      <template shadowroot="open"></template>
    </div>
  `;
  const div = document.createElement('div');
  div.innerHTML = html; // No shadow root here
  const fragment = new DOMParser().parseFromString(html, 'text/html', {
    includeShadowRoots: true
  }); // Shadow root here
</script>
```

## Server-rendering with style {: #styling }

Inline and external stylesheets are fully supported inside Declarative Shadow Roots using the
standard `<style>` and `<link>` tags:

```html
<nineties-button>
  <template shadowroot="open">
    <style>
      button {
        color: seagreen;
      }
    </style>
    <link rel="stylesheet" href="/comicsans.css" />
    <button>
      <slot></slot>
    </button>
  </template>
  I'm Blue
</nineties-button>
```

Styles specified this way are also highly optimized: if the same stylesheet is present in multiple
Declarative Shadow Roots, it is only loaded and parsed once. The browser uses a single backing
`CSSStyleSheet` that is shared by all of the shadow roots, eliminating duplicate memory overhead.

[Constructable Stylesheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets)
are not supported in Declarative Shadow DOM. This is because there is currently no way to serialize
constructable stylesheets in HTML, and no way to refer to them when populating `adoptedStyleSheets`.

## Feature detection and browser support {: #detection-support }

Declarative Shadow DOM is available in Chrome&nbsp;90 and Edge&nbsp;91. It can also be enabled
using the **Experimental Web Platform Features** flag in Chrome&nbsp;85. Navigate to
`chrome://flags/#enable-experimental-web-platform-features` to find that setting.

As a new web platform API, Declarative Shadow DOM does not yet have widespread support across all
browsers. Browser support can be detected by checking for the existence of a `shadowroot` property
on the prototype of `HTMLTemplateElement`:

```js
function supportsDeclarativeShadowDOM() {
  return HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot');
}
```

## Polyfill {: #polyfill }

Building a simplified polyfill for Declarative Shadow DOM is relatively straightforward, since a
polyfill doesn't need to perfectly replicate the timing semantics or parser-only characteristics
that a browser implementation concerns itself with. To polyfill Declarative Shadow DOM, we can scan
the DOM to find all `<template shadowroot>` elements, then convert them to attached Shadow Roots
on their parent element. This process can be done once the document is ready, or triggered by more
specific events like Custom Element lifecycles.

```js
document.querySelectorAll('template[shadowroot]').forEach(template => {
  const mode = template.getAttribute('shadowroot');
  const shadowRoot = template.parentNode.attachShadow({ mode });
  shadowRoot.appendChild(template.content);
  template.remove();
});
```

## Further Reading {: #further-reading }

- [Explainer with alternatives and performance analysis](https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md)
- [Chromestatus for Declarative Shadow DOM](https://www.chromestatus.com/feature/5191745052606464)
- [Intent to Prototype](https://groups.google.com/a/chromium.org/g/blink-dev/c/nJDc-1s3R9U/m/uCJKsEqpAwAJ)
