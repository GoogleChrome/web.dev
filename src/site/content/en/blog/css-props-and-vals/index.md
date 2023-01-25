---
title: Smarter custom properties with Houdini’s new API
subhead: Transitions and data protection in CSS
authors:
  - samrichard
date: 2019-09-19
# Add an updated date to your post if you edit in the future.
# updated: 2019-06-27
hero: image/admin/H6F7W8nUez3vaOv8hD8i.jpg
alt: A black screen shows development work..

description:
  Though useful, CSS variables are hard to work with because they can take any
  value and be overridden and you can’t use transitions with them. CSS Properties
  and Values API Level 1 overcomes these issues.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - houdini
  - css
  - Chrome78
feedback:
  - api
---

CSS custom properties, also known as [CSS
variables](https://developers.google.com/web/updates/2016/02/css-variables-why-should-you-care),
let you define your own properties in CSS and use their values throughout your
CSS. While incredibly useful today, they have shortcomings that can make them
hard to work with: they can take any value so they may be accidentally
overridden with something unexpected, they always inherit their values from
their parent, and you can't transition them. With Houdini's [CSS Properties and
Values API Level 1](https://drafts.css-houdini.org/css-properties-values-api/),
now available in Chrome 78, these shortcomings are transcended, making CSS
custom properties incredibly powerful!

## What Is Houdini?

Before talking about the new API, let's talk about Houdini quickly. The CSS-TAG
Houdini Task Force, better known as CSS Houdini or simply Houdini, exists to
"develop features that explain the 'magic' of styling and layout on the web".
The collection of [Houdini specifications](https://drafts.css-houdini.org/) are
designed to open up the power of the browser's rendering engine, allowing both
deeper insight into our styles and the ability to extend our rendering engine.
With this, typed CSS values in JavaScript and polyfilling or inventing new CSS
without a performance hit are finally possible. Houdini has the potential to
superpower creativity on the web.

## CSS Properties and Values API Level 1

The [CSS Properties and Values API Level
1](https://drafts.css-houdini.org/css-properties-values-api/) (Houdini Props and
Vals) allows us to give structure to our custom properties. This is the current
situation when using custom properties:

```css
.thing {
  --my-color: green;
}
```

Because custom properties don't have types, they can be overridden in unexpected
ways. For example, consider what happens if you define `--my-color` with a URL.

```css
.thing {
  --my-color: url('not-a-color');
  color: var(--my-color);
}
```

Here, because `--my-color` isn't typed, it doesn't know that a URL isn't a valid
color value! When we use it, it falls back to default values (black for `color`,
transparent for `background`). With Houdini Props and Vals, custom properties can
be _registered_ so that the browser knows what it _should_ be!

Now, the custom property `--my-color` is registered as a color! This tells the
browser what kinds of values are allowed and how it can type and treat that
property!

### Anatomy of a registered property

Registering a property looks like this:

```js
window.CSS.registerProperty({
  name: '--my-color',
  syntax: '<color>',
  inherits: false,
  initialValue: 'black',
});
```

It supports the following options:

#### `name: string`
The name of the custom property.

#### `syntax: string`
How to parse the custom property. You can find a complete list of possible values in the <a href="https://drafts.csswg.org/css-values-3/">CSS Values and Units</a> specification. Defaults to <code>*</code>.

#### `inherits: boolean`
Whether it inherits its parent's value. Defaults to <code>true</code>.

#### `initialValue: string`
Initial value of the custom property.

Taking a closer look at `syntax`. There are a number of [valid
options](https://drafts.css-houdini.org/css-properties-values-api/#supported-names)
ranging from numbers to colors to
[`<custom-ident>`](https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident)
types. These syntaxes can also be modified by using the following values

* Appending `+` signifies that it accepts a space-separated list of values of
  that syntax. For example,  `<length>+` would be a space-separated list of
  lengths
* Appending`#` signifies that it accepts a comma-separated list of values of
  that syntax. For example,  `<color>#` would be a comma-separated list of
  colors
* Adding `|` between syntaxes or identifiers signifies that any of the provided
  options are valid. For example, `<color># | <url> | magic` would allow either
  a comma-separated list of colors, a URL, or the word `magic`.

### Gotchas

There are two gotchas with Houdini Props and Vals. The first is that, once
defined, there's no way to update an existing registered property, and trying to
re-register a property will throw an error indicating that it's already been
defined.

Second, unlike standard properties, registered properties aren't validated when
they're parsed. Rather they're validated when they're computed. That means both
that invalid values won't appear as invalid when inspecting the element's
properties, and including an invalid property after a valid one won't fall back
to the valid one; an invalid property will, however, fall back to the registered
property's default.

## Animating custom properties

A registered custom property provides a fun bonus beyond type checking: the
ability to animate it! A basic animation example looks like this:

```html
<script>
CSS.registerProperty({
  name: '--stop-color',
  syntax: '<color>',
  inherits: false,
  initialValue: 'blue',
});
</script>

<style>
button {
  --stop-color: red;
  transition: --stop-color: 1s;
}

button:hover {
  --stop-color: green;
}
</style>
```

When you hover over the button, it'll animate from red to green! Without
registering the property, it'll jump from one color to the other Because,
without being registered, the browser doesn't know what to expect between one
value and the next and therefore can't guarantee the ability to transition them.
This example can be taken a step further, though, to animate CSS gradients! The
following CSS can be written with the same registered property:

```css
button {
  --stop-color: red;
  background: linear-gradient(var(--stop-color), black);
  transition: --stop-color 1s;
}

button:hover {
  --stop-color: green;
}
```

This will animate our custom property that's part of the `linear-gradient`, thus
animating our linear gradient. Check out the Glitch below to see the full code
in action and play around with it yourself.

<!-- Copy and Paste Me -->
{% Glitch {
  id: 'houdini-props-and-vals',
  path: 'style.css',
  previewSize: 40
} %}

## Conclusion

Houdini [is on its way](http://ishoudinireadyyet.com/) to browsers, and with it,
entirely new ways of working with and extending CSS. With the [Paint
API](https://developers.google.com/web/updates/2018/01/paintapi) already shipped
and now Custom Props and Vals, our creative toolbox is expanding, allowing us to
define typed CSS properties and use them to create and animate new and exciting
designs. There's more on the way, too, in the [Houdini issue
queue](https://github.com/w3c/css-houdini-drafts/issues) where you can give
feedback and see what's next for Houdini. Houdini exists to develop features
that explain the "magic" of styling and layout on the web, so get out there and
put those magical features to good use.

<!--lint disable no-literal-urls-->
_Photo by
[Maik Jonietz](https://unsplash.com/@der_maik_?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
on
[Unsplash](https://unsplash.com/search/photos/code?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_
