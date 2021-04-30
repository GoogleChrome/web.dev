---
title: '@property: giving superpowers to CSS variables'
subhead: The Houdini Properties and Values API is coming to your CSS file in Chromium 85.
authors:
  - una
date: 2020-07-21
# updated: 2020-07-22
hero: image/admin/Iajld9FPY089XWDAZVQ4.jpg
alt: A sparkler.
description: Learn how to implement CSS custom properties with semantic typing, a fallback value, and more, directly in your CSS file.
tags:
  - blog
  - css
  - houdini
feedback:
  - api
---

[CSS Houdini](https://ishoudinireadyyet.com) is an umbrella term that covers a
set of low-level APIs that expose parts of the CSS rendering engine, and give
developers access to the CSS Object Model. This is a huge
change for the CSS ecosystem, as it enables developers to tell the browser how
to read and parse custom CSS without waiting for browser vendors to provide
built-in support for these features. So exciting!

One of the most exciting additions to CSS within the Houdini umbrella is the
[Properties and Values
API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Properties_and_Values_API).
This API supercharges your CSS custom properties (also commonly referred to as
CSS variables) by giving them semantic meaning (defined by a syntax) and even
fallback values, enabling CSS testing.

## Writing Houdini custom properties

Here's an example of setting a custom property (think: CSS variable), but now
with a syntax (type), initial value (fallback), and inheritance boolean (does
it inherit the value from it's parent or not?). The current way to do this is
through `CSS.registerProperty()` in JavaScript, but in Chromium 85 and later, the
`@property` syntax will be supported in your CSS files:

<div class="w-columns">
{% Compare 'worse', 'Separate JavaScript file (Chromium 78)' %}
```js
CSS.registerProperty({
  name: '--colorPrimary',
  syntax: '<color>',
  initialValue: 'magenta',
  inherits: false
});
```
{% endCompare %}

{% Compare 'better', 'Included in CSS file (Chromium 85)' %}
```css
@property --colorPrimary {
  syntax: '<color>';
  initial-value: magenta;
  inherits: false;
}
```
{% endCompare %}
</div>

Now you can access `--colorPrimary` like any other CSS custom property, via
`var(--colorPrimary)`. However, the difference here is that `--colorPrimary` isn't
just read as a string. It has data!

{% Aside 'gotchas' %}
  When writing a registered custom property with a specified `syntax`, you *must* also include an `initial-value`.
{% endAside %}

## Fallback values

As with any other custom property, you can get (using var) or set
(write/rewrite) values, but with Houdini custom properties, if you set a falsey
value when overriding it, the CSS rendering engine will send the initial value
(its fallback value) instead of ignoring the line.

Consider the example below. The `--colorPrimary` variable has an
`initial-value` of `magenta`. But the developer has given it the invalid
value "23". Without `@property`, the CSS parser would ignore the
invalid code. Now, the parser falls back to `magenta`. This allows for
true fallbacks and testing within CSS. Neat!

```css
.card {
  background-color: var(--colorPrimary); /* magenta */
}

.highlight-card {
  --colorPrimary: yellow;
  background-color: var(--colorPrimary); /* yellow */
}

.another-card {
  --colorPrimary: 23;
  background-color: var(--colorPrimary); /* magenta */
}
```

## Syntax

With the syntax feature, you can now write semantic CSS by specifying
a type. The current types that are allowed include:

- `length`
- `number`
- `percentage`
- `length-percentage`
- `color`
- `image`
- `url`
- `integer`
- `angle`
- `time`
- `resolution`
- `transform-list`
- `transform-function`
- `custom-ident` (a custom identifier string)


Setting a syntax enables the browser to type-check custom properties.
This has many benefits.

To illustrate this point, I'll show you how to animate a gradient. Currently,
there is no way to smoothly animate (or interpolate) between gradient values, as
each gradient declaration is parsed as a string.

<figure class="w-figure">
  <img class="w-screenshot" src="https://storage.googleapis.com/web-dev-assets/at-property/support1.gif">
  <figcaption class="w-figcaption">
    Using a custom property with a "number" syntax, the gradient on the left shows a smooth
    transition between stop values. The gradient on the right uses a default custom property
    (no syntax defined) and shows an abrupt transition.
  </figcaption>
</figure>

<!-- <figure class="w-figure">
  <video controls autoplay loop muted playsinline class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/at-property/support1.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Using a custom property with a "number" syntax, the gradient on the left shows a smooth
    transition between stop values. The gradient on the right uses a default custom property
    (no syntax defined) and shows an abrupt transition.
  </figcaption>
</figure>
-->

In this example, the gradient stop percentage is being animated from a starting
value of 40% to an ending value of 100% via a hover interaction. You should see a
smooth transition of that top gradient color downward.

The browser on the left supports the Houdini Properties and Values API,
enabling a smooth gradient stop transition. The browser on the right does not. The
non-supporting browser is only able to understand this change as a string going
from point A to point B. There is no opportunity to interpolate the values, and
thus you don't see that smooth transition.

However, if you declare syntax type when writing custom properties, and then use
those custom properties to enable the animation, you'll see the transition. You
can instantiate the custom property `--gradPoint` like so:

```css
/* Check for Houdini support & register property */
@supports (background: paint(something)) {
  @property --gradPoint {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 40%;
  }
}
```

And then when it comes time to animate it, you can update the value from the initial `40%` to `100%`:

```css
@supports (background: paint(something)) {
  .post:hover,
  .post:focus {
    --gradPoint: 100%;
  }
}
```

This will now enable that smooth gradient transition.

<figure class="w-figure">
  <img class="w-screenshot" src="https://storage.googleapis.com/web-dev-assets/at-property/demo.gif">
  <figcaption class="w-figcaption">
    Smoothly transitioning gradient borders. <a href="https://glitch.com/~houdini-gradient-borders">See Demo on Glitch</a>
  </figcaption>
</figure>

<!--
<figure class="w-figure">
  <video controls autoplay loop muted playsinline class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/at-property/demo.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Smoothly transitioning gradient borders. <a href="https://glitch.com/~houdini-gradient-borders">See Demo on Glitch</a>
  </figcaption>
</figure>
-->

## Multiple declarations

Another neat feature of `@property` is that you can declare multiple
new custom properties at the same time. For example, if you wanted
to set multiple values with the same syntax but a unique `initial-value`,
you could write something like:

```css
@property --colorPrimary,
@property --colorSecondary,
@property --colorText {
  syntax: '<color>';
  inherits: true;
}

@property --colorPrimary {
  initial-value: magenta;
}

@property --colorSecondary {
  initial-value: aliceblue;
}

@property --colorText {
  initial-value: dimgray;
}
```

## Conclusion

The `@property` rule makes an exciting technology even more accessible by
allowing you to write semantically meaningful CSS within CSS itself. To learn
more about CSS Houdini and the Properties and Values API, check out these
resources:

- [Is Houdini Ready Yet?](http://ishoudinireadyyet.com/)
- [MDN Houdini Reference](https://developer.mozilla.org/en-US/docs/Web/Houdini)
- [Smarter custom properties with Houdini's new API](/css-props-and-vals/)
- [Houdini CSSWG Issue Queue](https://github.com/w3c/css-houdini-drafts/issues)

Photo by [Cristian Escobar](https://unsplash.com/@cristian1) on Unsplash.
