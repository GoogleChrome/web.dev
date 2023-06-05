---
layout: post
title: New CSS color spaces and functions in all major engines
subhead: All major engines now support the new CSS color spaces and functions. Find out how they can bring vibrancy to your designs. 
authors:
  - rachelandrew
description: Start using HD color to bring vibrancy to your designs.
date: 2023-06-02
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/Kp4WW9nvbo5JexN1MMuN.jpg
alt: ""
tags:
  - blog
  - css
  - newly-interoperable
---

{% Aside 'celebration' %}
This web feature is now available in all three major browser engines!
{% endAside %}

CSS now supports color spaces that allow us to access colors outside of the sRGB [gamut](https://developer.chrome.com/articles/high-definition-css-color-guide/#what-is-a-color-gamut). This means that you can support HD (high definition) displays, using colors from HD gamuts. This support comes with new functions to make better use of color on the web.

## Accessing color spaces from CSS

We already have a number of functions that allow us to access colors within the sRGB gamut—`rgb()`, `hsl()`, and `hwb()`. Now supported in browsers is the `color()` function, a normalized way to access colors within any RGB color space. This includes sRGB, Display P3, and Rec2020. You can see some examples in the following CSS:

```css
.valid-css-color-function-colors {
  --srgb: color(srgb 1 1 1);
  --srgb-linear: color(srgb-linear 100% 100% 100% / 50%);
  --display-p3: color(display-p3 1 1 1);
  --rec2020: color(rec2020 0 0 0);
  --a98-rgb: color(a98-rgb 1 1 1 / 25%);
  --prophoto: color(prophoto-rgb 0% 0% 0%);
  --xyz: color(xyz 1 1 1);
}
```

{% BrowserCompat 'css.types.color.color' %}

Also supported are several functions allowing access to color spaces other than sRGB using `lch()`, `lab()`, `oklch()`, and `oklab()`.

{% BrowserCompat 'css.types.color.lch' %}

You can learn about all of these different color spaces in the [High definition CSS color guide](https://developer.chrome.com/articles/high-definition-css-color-guide/).


## The `color-mix()` function

As well as these new color spaces, all engines now support the `color-mix()` function. This function enables mixing of one color into another, in any of the color spaces. In the following CSS, 25% of blue is mixed into white, in the srgb color space.

```css
.example {
  background-color: color-mix(in srgb, blue 25%, white);
}
```

{% BrowserCompat 'css.types.color.color-mix' %}

[Learn more about `color-mix()`](https://developer.chrome.com/blog/css-color-mix/)

These new functions and color spaces promise to bring vibrant HD color to the web. For inspiration, make a start by creating some beautiful gradients using the HD gradient generator at [gradient.style](https://gradient.style/).

_Hero image by [Daniele Levis Pelusi](https://unsplash.com/fr/@yogidan2012)_
