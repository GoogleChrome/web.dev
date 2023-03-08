---
layout: post
title: Trigonometric functions in CSS
authors:
  - bramus
subhead: >
  Calculate the sine, cosine, tangent, and more in CSS.
description: >
  Calculate the sine, cosine, tangent, and more in CSS.
date: 2023-03-08
hero: image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/dG0sJst2uPCE6Z1g4AZm.jpg
alt: Colorful triangles.
tags:
  - blog
  - css
  - newly-interoperable
---

{% Aside 'celebration' %}
This web feature is now available in all three browser engines!
{% endAside %}

## Trigonometric functions

In CSS it’s possible to write [mathematical expressions](/learn/css/functions/#mathematical-expressions). At the base sits the `calc()` function to do calculations, but most likely you’ve also heard of [`min()`, `max()`, and `clamp()`](/min-max-clamp/) as well.

Joining these functions in Chrome 111 are the trigonometric functions `sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()`, and `atan2()`. These functions are [defined in the CSS Values and Units Module Level 4](https://www.w3.org/TR/css-values-4/#trig-funcs) and are available in all browsers.

{% BrowserCompat 'css.types.cos' %}

### `sin()`, `cos()`, and `tan()`

The core three “trig functions” are:


- `cos()`: Returns the cosine of an angle, which is a value between `-1` and `1`.
- `sin()`: Returns the sine of an angle, which is a value between `-1` and `1`.
- `tan()`: Returns the tangent of an angle, which is a value between `−∞` and `+∞`.

Unlike their JavaScript counterparts, these functions accept both angles and radians as their argument.

In the demo below, these functions are used to draw the lines that make up the triangle surrounding the set `--angle`:

- The “hypotenuse” _(yellow line)_ is a line from the center of the circle to the position of the dot. Its length is equal to the `--radius` of the circle.
- The “adjacent” _(red line)_ is a line from the center of the circle along the X-axis. Its length is equal to the `--radius` multiplied by the cosine of the `--angle`.
- The “opposite” _(blue line)_ is a line from the center of the circle along the Y-axis. Its length is equal to the `--radius` multiplied by the sine of the `--angle`.
- The `tan()` function of the `--angle` is used to draw the green line from the dot towards the X-axis.

{% Codepen {
  user: 'web-dot-dev',
  id: 'NWLxROo',
  height: 740,
  theme: 'dark',
  tab: 'result'
} %}

{% Aside %}
For a good introduction on Trigonometry go check [Math is Fun](https://www.mathsisfun.com/sine-cosine-tangent.html)
{% endAside %}

### `asin()`, `acos()`, `atan()`, and `atan2()`

The “arc” or “inverse” counterparts to `sin()`, `cos()`, and `tan()` are `asin()`, `acos()`, and `atan()` respectively. These functions do the calculation in the opposite direction: they take a numeric value as their argument and return the corresponding angle for it.

Finally there’s `atan2()` which accepts two arguments `A` and `B`. The function returns the angle between the positive X-axis and the point `(B,A)`.

## Examples

There are various use-cases for these functions. What follows is a small selection.

### Move items on a circular path around a central point

In the demo below, the dots revolve around a central point. Instead of rotating each dot around its own center and then moving it outwards, each dot is translated on the X and Y axes. The distances on the X and Y axes are determined by taking the `cos()` and, respectively, the `sin()` of the `--angle` into account.

```css
:root {
  --radius: 20vmin;
}

.dot {
  --angle: 30deg;
  translate: /* Translation on X-axis */
             calc(cos(var(--angle)) * var(--radius))

             /* Translation on Y-axis */
             calc(sin(var(--angle)) * var(--radius) * -1)
  ;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'ExePgOg',
  height: 600,
  theme: 'dark',
  tab: 'result'
} %}

To distribute the dots evenly around the central point, each dot is given an additional offset based on its `nth-child` index. For example, if there are three dots, there’s a distance of `120deg` (= `360deg / 3`) between each dot.

- The first child element out of three gets offset by `0 x 120deg` = `0deg`.
- The second child element out of three gets offset by `1 x 120deg` = `120deg`.
- The third child element out of three gets offset by `2 x 120deg` = `240deg`.

### Rotate an element to face its origin

The `atan2()` function calculates the relative angle from one point to another. The function accepts two comma-separated values as its parameters: the `y` and `x` position of the other point, relative to the originating point which sits at origin `0,0`.

With the calculated value it’s possible to rotate elements so that they face each other, by using the [Individual Transform Properties](/css-individual-transform-properties/).

In the example below, the boxes are rotated so that they face the location of the mouse. The mouse position is synced to a custom property through JavaScript.

```css
div.box {
  --my-x: 200;
  --my-y: 300;

  /* Position the box inside its parent */
  position: absolute;
  width: 50px;
  aspect-ratio: 1;
  translate: calc((var(--my-x) * 1px)) calc(var(--my-y) * 1px);

  /* Rotate so that the box faces the mouse position */
  /* For this, take the box its own position and size (25 = half the width) into account */
  rotate: atan2(
            calc((var(--mouse-x) - var(--my-x) - 25) * 1),
            calc((var(--mouse-y) - var(--my-y) - 25) * -1)
          );
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'dyqGpQV',
  height: 720,
  theme: 'dark',
  tab: 'result'
} %}

### Community highlight

As demonstrated in this [Animated Möbius strip by Ana Tudor](https://codepen.io/thebabydino/pen/wvybyMo), `cos()` and `sin()` can be used for more than just translations. Here their outcome is used to manipulate the the `s` and `l` components of [the `hsl()` color function](https://developer.chrome.com/articles/high-definition-css-color-guide/#hsl).

{% Codepen {
  user: 'thebabydino',
  id: 'wvybyMo',
  height: 600,
  theme: 'dark',
  tab: 'result'
} %}

_Cover photo by [Tamanna Rumee](https://unsplash.com/@tamanna_rumee) on [Unsplash](https://unsplash.com/photos/7OCUyev2M9E)_
