---
layout: post
title: Shadow DOM 201
subhead: CSS and styling
authors:
  - ericbidelman
date: 2013-03-15
updated: 2016-10-03
tags:
  - blog
---

{% Aside 'warning' %}
This article describes an old version of Shadow DOM (v0). If you're interested in using Shadow DOM, check out our new article, "[Shadow DOM v1: self-contained web components](/shadowdom-v1/)". It covers everything in the newer Shadow DOM v1 spec shipped in Chrome 53, Safari 10, and Firefox 63.
{% endAside %}

This article discusses more of the amazing things you can do with Shadow DOM.
It builds on the concepts discussed in [Shadow DOM 101](/shadowdom/).
If you're looking for an introduction, see that article.

## Introduction

Let's face it. There's nothing sexy about unstyled markup. Lucky for us, [the brilliant folks behind Web Components](https://www.w3.org/TR/2012/WD-components-intro-20120522/#acknowledgements)
foresaw this and didn't leave us hanging. The [CSS Scoping Module](https://drafts.csswg.org/css-scoping/) defines many options for styling content in a shadow tree.

{% Aside %}
In Chrome, turn on the "Enable experimental Web Platform features" in about:flags to experiment with everything covered in this article.
{% endAside %}

## Style encapsulation

One of the core features of Shadow DOM is the [shadow boundary](https://dom.spec.whatwg.org/#shadow-trees). It has a lot of nice properties,
but one of the best is that it provides style encapsulation for free. Stated another way:

{% Aside %}
CSS styles defined inside Shadow DOM are scoped to the ShadowRoot. This means styles are encapsulated by default.
{% endAside %}

```html
<div><h3>Light DOM</h3></div>
<script>
var root = document.querySelector('div').createShadowRoot();
root.innerHTML = `
  <style>
    h3 {
      color: red;
    }
  </style>
  <h3>Shadow DOM</h3>
`;
</script>
```

There are two interesting observations about this demo:

- There are other h3s on this page, but the only one that matches the h3 selector, and therefore styled
red, is the one in the ShadowRoot. Again, scoped styles by default.
- Other styles rules defined on this page that target h3s don't bleed into my content.
That's because **selectors don't cross the shadow boundary**.

Moral of the story? We have style encapsulation from the outside world. Thanks Shadow DOM!

## Styling the host element

The `:host` allows you to select and style the element hosting a shadow tree:

```html
<button class="red">My Button</button>
<script>
var button = document.querySelector('button');
var root = button.createShadowRoot();
root.innerHTML = `
  <style>
    :host {
      text-transform: uppercase;
    }
  </style>
  <content></content>
`;
</script>
```

One gotcha is that rules in the parent page have higher specificity than `:host`
rules defined in the element, but lower specificity than a `style` attribute
defined on the host element.  This allows users to override your styling from the outside.
`:host` also only works in the context of a ShadowRoot so you can't use it outside of Shadow DOM.

The functional form of `:host(<selector>)` allows you to target the host element if it matches a `<selector>`.

**Example** - match only if the element itself has the class `.different` (e.g. `<x-foo class="different"></x-foo>`):

```css
:host(.different) {
    ...
}
```

### Reacting to user states

A common use case for `:host` is when you're creating a [Custom Element](/customelements/) and want to react to different user states (:hover, :focus, :active, etc.).

```html
<style>
  :host {
    opacity: 0.4;
    transition: opacity 420ms ease-in-out;
  }
  :host(:hover) {
    opacity: 1;
  }
  :host(:active) {
    position: relative;
    top: 3px;
    left: 3px;
  }
</style>
```

### Theming an element

The `:host-context(<selector>)` pseudo class matches the host element if it or any of its ancestors matches `<selector>`.

A common use of `:host-context()` is for theming an element based on its surrounds. For example,
many people do theming by applying a class to `<html>` or `<body>`:

```html
<body class="different">
  <x-foo></x-foo>
</body>
```

You can `:host-context(.different)` to style `<x-foo>` when it's a descendant of an element with the class `.different`:

```css
:host-context(.different) {
  color: red;
}
```

This gives you the ability encapsulate style rules in an element's Shadow DOM that
uniquely style it, based on its context.

### Support multiple host types from within one shadow root

Another use for `:host` is if you're creating a theming library and want to
support styling many types of host elements from within the same Shadow DOM.

```css
:host(x-foo) {
    /* Applies if the host is a <x-foo> element.*/
}

:host(x-foo:host) {
    /* Same as above. Applies if the host is a <x-foo> element. */
}

:host(div) {
    /* Applies if the host element is a <div>. */
}
```

## Styling Shadow DOM internals from the outside

The `::shadow` pseudo-element and `/deep/` combinator are like having a Vorpal sword of CSS authority.
They allow piercing through Shadow DOM's boundary to style elements within shadow trees.

## The ::shadow pseudo-element

If an element has at least one shadow tree, the `::shadow` pseudo-element matches the shadow root itself.
It allows you to write selectors that style nodes internal to an element's shadow dom.

For example, if an element is hosting a shadow root, you can write `#host::shadow span {}` to style all of the spans within its shadow tree.

```html
<style>
  #host::shadow span {
    color: red;
  }
</style>

<div id="host">
  <span>Light DOM</span>
</div>

<script>
  var host = document.querySelector('div');
  var root = host.createShadowRoot();
  root.innerHTML = `
    <span>Shadow DOM</span>
    <content></content>
  `;
</script>
```

**Example** (custom elements) -  `<x-tabs>`  has `<x-panel>` children in its Shadow DOM. Each panel hosts its own shadow tree containing `h2` headings. To style those headings from the main page, one could write:

```css
x-tabs::shadow x-panel::shadow h2 {
    ...
}
```

### The /deep/ combinator

The `/deep/` combinator is similar to `::shadow`, but more powerful. It completely ignores all shadow boundaries and crosses into any number of shadow trees. Put simply, `/deep/` allows you to drill into an element's guts and target any node.

The `/deep/` combinator is particularly useful in the world of Custom Elements where it's common to have multiple levels of Shadow DOM. Prime examples are nesting a bunch of custom elements (each hosting their own shadow tree) or creating an element that inherits from another using [`<shadow>`](/shadowdom-301/#shadow-insertion-points).

**Example** (custom elements) -  select all `<x-panel>` elements that are descendants of
`<x-tabs>`, anywhere in the tree:

```css
x-tabs /deep/ x-panel {
    ...
}
```

**Example** - style all elements with the class `.library-theme`, anywhere in a shadow tree:

```css
body /deep/ .library-theme {
    ...
}
```

### Working with querySelector()

Just like [`.shadowRoot`](/shadowdom-301/#obtaining-a-hosts-shadow-root) opens
shadow trees up for DOM traversal, the combinators open shadow trees for selector traversal.
Instead of writing a nested chain of madness, you can write a single statement:

```js
// No fun.
document.querySelector('x-tabs').shadowRoot
        .querySelector('x-panel').shadowRoot
        .querySelector('#foo');

// Fun.
document.querySelector('x-tabs::shadow x-panel::shadow #foo');
```

### Styling native elements

Native HTML controls are a challenge to style. Many people simply give up
and roll their own. However, with `::shadow` and `/deep/`, any element in the web platform that
uses Shadow DOM can be styled. Great examples are the `<input>` types and `<video>`:

```css
video /deep/ input[type="range"] {
  background: hotpink;
}
```

{% Aside %}
Do the `::shadow` pseudo-element and `/deep/` combinator defeat the purpose of style encapsulation? Out of the box, Shadow DOM prevents __accidental__ styling from outsiders but it never promises to be a bullet proof vest. Developers should be allowed to __intentionally__ style inner parts of your Shadow tree…if they know what they're doing. Having more control is also good for flexibility, theming, and the re-usability of your elements.
{% endAside %}

## Creating style hooks

Customization is good. In certain cases, you may want to poke holes in your Shadow's
styling shield and create hooks for others to style.

### Using ::shadow and /deep/

There's a lot of power behind `/deep/`. It gives component authors a way to designate
individual elements as styleable or a slew of elements as themeable.

**Example** - style all elements that have the class `.library-theme`, ignoring all shadow trees:

```css
body /deep/ .library-theme {
    ...
}
```

### Using custom pseudo elements

Both [WebKit](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css?format=txt) and
[Firefox](https://developer.mozilla.org/docs/Web/CSS/Mozilla_Extensions#pseudo-elements_and_pseudo-classes) define pseudo elements for styling internal pieces of native browser elements. A good example
is the `input[type=range]`. You can style the slider thumb `<span style="color:blue">blue</span>` by targeting `::-webkit-slider-thumb`:

```css
input[type=range].custom::-webkit-slider-thumb {
  -webkit-appearance: none;
  background-color: blue;
  width: 10px;
  height: 40px;
}
```

Similar to how browsers provide styling hooks into some internals,
authors of Shadow DOM content can designate certain elements as styleable by
outsiders. This is done through [custom pseudo elements](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Custom-Pseudo-Elements.md).

You can designate an element as a custom pseudo element by using the `pseudo` attribute.
Its value, or name, needs to be prefixed with "x-". Doing so creates
an association with that element in the shadow tree and gives outsiders a
designated lane to cross the shadow boundary.

Here's an example of creating a custom slider widget and allowing someone to style
its slider thumb blue:

```html
<style>
  #host::x-slider-thumb {
    background-color: blue;
  }
</style>
<div id="host"></div>
<script>
  var root = document.querySelector('#host').createShadowRoot();
  root.innerHTML = `
    <div>
      <div pseudo="x-slider-thumb"></div>' +
    </div>
  `;
</script>
```

{% Aside %}
What's really neat about custom pseudo elements? You can style them with outside CSS
but can't access them via outside JS. The shadow boundary is preserved for JS
but loosened for custom pseudo element definitions.
{% endAside %}

### Using CSS Variables

A powerful way to create theming hooks will be through [CSS Variables](https://drafts.csswg.org/css-variables/). Essentially, creating "style placeholders" for other users to fill in.

Imagine a custom element author who marks out variable placeholders in their Shadow DOM. One for styling an internal button's font and another for its color:

```css
button {
  color: var(--button-text-color, pink); /* default color will be pink */
  font-family: var(--button-font);
}
```

Then, the embedder of the element defines those values to their liking. Perhaps
to match the super cool Comic Sans theme of their own page:

```css
#host {
  --button-text-color: green;
  --button-font: "Comic Sans MS", "Comic Sans", cursive;
}
```

Due to the way CSS Variables inherit, everything is peachy and this
works beautifully! The whole picture looks like this:

```html
<style>
  #host {
    --button-text-color: green;
    --button-font: "Comic Sans MS", "Comic Sans", cursive;
  }
</style>
<div id="host">Host node</div>
<script>
  var root = document.querySelector('#host').createShadowRoot();
  root.innerHTML = `
    <style>
      button {
        color: var(--button-text-color, pink);
        font-family: var(--button-font);
      }
    </style>
    <content></content>
  `;
</script>
```

{% Aside %}
I've already mentioned [Custom Elements](/customelements/) a few times in this article. For now, just know that Shadow DOM forms their structural foundation
by providing styling and DOM encapsulation. The concepts here pertain to styling Custom Elements.
{% endAside %}

## Resetting styles

Inheritable styles like fonts, colors, and line-heights continue to affect elements
in the Shadow DOM. However for maximum flexibility, Shadow DOM gives us the
`resetStyleInheritance` property to control what happens at the shadow boundary.
Think of it as a way to start fresh when creating a new component.

**resetStyleInheritance**

- `false` - Default. [inheritable CSS properties](http://www.impressivewebs.com/inherit-value-css/) continue to inherit.
- `true` - resets inheritable properties to `initial` at the boundary.

Below is a demo that shows how the shadow tree is affected by changing `resetStyleInheritance`:

```html
<div>
  <h3>Light DOM</h3>
</div>

<script>
  var root = document.querySelector('div').createShadowRoot();
  root.resetStyleInheritance = <span id="code-resetStyleInheritance">false</span>;
  root.innerHTML = `
    <style>
      h3 {
        color: red;
      }
    </style>
    <h3>Shadow DOM</h3>
    <content select="h3"></content>
  `;
</script>

<div class="demoarea" style="width:225px;">
  <div id="style-ex-inheritance"><h3 class="border">Light DOM</div>
</div>
<div id="inherit-buttons">
  <button id="demo-resetStyleInheritance">resetStyleInheritance=false</button>
</div>

<script>
  var container = document.querySelector('#style-ex-inheritance');
  var root = container.createShadowRoot();
  //root.resetStyleInheritance = false;
  root.innerHTML = '<style>h3{ color: red; }</style><h3>Shadow DOM<content select="h3"></content>';

  document.querySelector('#demo-resetStyleInheritance').addEventListener('click', function(e) {
    root.resetStyleInheritance = !root.resetStyleInheritance;
    e.target.textContent = 'resetStyleInheritance=' + root.resetStyleInheritance;
    document.querySelector('#code-resetStyleInheritance').textContent = root.resetStyleInheritance;
  });
</script>
```

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/NTs5gz9uTwQbYFtud5Ef.gif", alt="DevTools inherited properties", width="255", height="243" %}
</figure>

Understanding `.resetStyleInheritance` is a bit trickier, primarily because it
only has an affect on CSS properties which are inheritable. It says: when
you're looking for a property to inherit, at the boundary between the page and
the ShadowRoot, don't inherit values from the host but use the `initial`
value instead (per the CSS spec).

If you're unsure about which properties inherit in CSS, check out [this handy list](http://www.impressivewebs.com/inherit-value-css/) or toggle the "Show inherited" checkbox in the Element panel.


## Styling distributed nodes

Distributed nodes are elements that render at an [insertion point](/shadowdom-301/#elementgetdistributednodes) (a `<content>` element). The `<content>` element allows you to select nodes from the Light DOM and render them at predefined locations in your Shadow DOM. They're not logically in the Shadow DOM; they're still children of the host element. Insertion points are just a rendering thing.

Distributed nodes retain styles from the main document. That is, style rules
from the main page continue to apply to the elements, even when they render at an insertion point.
Again, distributed nodes are still logically in the light dom and don't move. They just render
elsewhere. However, when the nodes get distributed into the Shadow DOM, they can take on additional styles
defined inside the shadow tree.

### ::content pseudo element

Distributed nodes are children of the host element, so how can we target
them from *within* the Shadow DOM? The answer is the CSS `::content` pseudo element.
It's a way to target Light DOM nodes that pass through an insertion point. For example:

`::content > h3` styles any `h3` tags that pass through an insertion point.

Let's see an example:

```html
<div>
  <h3>Light DOM</h3>
  <section>
    <div>I'm not underlined</div>
    <p>I'm underlined in Shadow DOM!</p>
  </section>
</div>

<script>
var div = document.querySelector('div');
var root = div.createShadowRoot();
root.innerHTML = `
  <style>
    h3 { color: red; }
      content[select="h3"]::content > h3 {
      color: green;
    }
    ::content section p {
      text-decoration: underline;
    }
  </style>
  <h3>Shadow DOM</h3>
  <content select="h3"></content>
  <content select="section"></content>
`;
</script>
```

### Resetting styles at insertion points

When creating a ShadowRoot, you have the option of resetting the inherited styles.
`<content>` and `<shadow>` insertion points also have this option. When using
these elements, either set the `.resetStyleInheritance` in JS or use the boolean
`reset-style-inheritance` attribute on the element itself.

- For a ShadowRoot or `<shadow>` insertion points: `reset-style-inheritance`
means inheritable CSS properties are set to `initial` at the host, before they
hit your shadow content. **This location is known as the upper boundary**.

- For `<content>` insertion points: `reset-style-inheritance` means inheritable
CSS properties are set to `initial` before the host's children are distributed
at the insertion point. **This location is known as the lower boundary**.

{% Aside %}
Remember: styles defined in the host document continue to apply to nodes they target,
even when those nodes get distributed "inside" the Shadow DOM. Going into an
insertion point doesn't change what's applied.
{% endAside %}

## Conclusion

As authors of custom elements, we have a ton of options for controlling
the look and feel of our content. Shadow DOM forms the basis for this brave new world.

Shadow DOM gives us scoped style encapsulation and a means to let in as much (or as little)
of the outside world as we choose. By defining custom pseudo elements or including
CSS Variable placeholders, authors can provide third-parties convenient styling hooks
to further customize their content. All in all, web authors are in full control
of how their content is represented.
