---
title: Filters
description: >
  Filters in CSS mean that you can apply effects you might only think possible in a graphics application.
  In this module, you can discover what is available.
audio:
  title: 'The CSS Podcast - 023: Filters'
  src: 'https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_023_v1.0.mp3?dest-id=1891556'
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-05-04
---

Say you need to build an element that's got a slightly opaque,
frosted glass effect that sits over the top of an image.
The text needs to be live text and not an image.
How do you do that?

{% Codepen {
  user: 'web-dot-dev',
  id: 'KKaQLoL'
} %}

A combination of CSS filters and the `backdrop-filter`
allow us to apply effects and blur what's needed in real time.
Blur and opacity are two of many available filters,
so let's have a quick run through what they all do and how to use them.

{% Aside %}
Take care when placing text over images,
that the text is still readable should the filter effect not be supported in a user's browser.
For example, at the moment
[`backdrop-filter`](https://developer.mozilla.org/docs/Web/CSS/backdrop-filter)
is not supported in Firefox,
and so you should check that Firefox users aren't left with text they cannot easily read.
{% endAside %}

## The `filter` property

You can apply one or many of the following filters as a value for
[`filter`](https://developer.mozilla.org/docs/Web/CSS/filter).
If you incorrectly apply a filter,
the rest of the filters defined for `filter` will not work.

### `blur`

This applies a gaussian blur and the only argument you can pass is a `radius`,
which is
[how much blur is applied](https://dbaron.org/log/20110225-blur-radius).
This needs to be a length unit, like `10px`. Percentages are not accepted.

```css
.my-element {
	filter: blur(0.2em);
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'VwPQJwX',
  height: 450
} %}

### `brightness`

To increase or decrease the brightness of an element,
use the brightness function.
The brightness value is expressed as a percentage with the unchanged image being expressed as a value of 100%.
A value of 0% turns the image completely black,
therefore values between 0% and 100% make the image less bright.
Use values over 100% to increase the brightness.

```css
.my-element {
	filter: brightness(80%);
}
```

{% Aside %}
You can also use decimal values,
instead of percentage values in filters like `brightness`.
To set 80% brightness with a decimal, write `0.8`.
{% endAside %}

{% Codepen {
  user: 'web-dot-dev',
  id: 'KKaQjpp',
  height: 450
} %}

### `contrast`

Set a value between 0% and 100% to decrease or increase the contrast, respectively.

```css
.my-element {
	filter: contrast(160%);
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'rNjJEOW',
  height: 450
} %}

### `grayscale`

You can apply a completely grayscale effect by using `1` as a value for `grayscale()`,
or `0` to have a completely saturated element.
You can also use percentage or decimal values to only apply a partial grayscale effect.
If you pass no arguments, the element will be completely grayscale.
If you pass a value greater than 100%, it will be capped at 100%.

```css
.my-element {
	filter: grayscale(80%);
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'MWJQMKe',
  height: 450
} %}

### `invert`

Just like `grayscale`,
you can pass `1` or `0` to the `invert()` function to turn it on or off.
When it is on, the element's colors are completely inverted.
You can also use percentage or decimal values to only apply a partial inversion of colors.
If you don't pass any arguments into the `invert()` function,
the element will be completely inverted.

```css
.my-element {
	filter: invert(1);
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'yLgvdOO',
  height: 450
} %}

### `opacity`

The `opacity()` filter works just like the `opacity` property,
where you can pass a number or percentage to increase or reduce opacity.
If you pass no arguments, the element is fully visible.

```css
.my-element {
	filter: opacity(0.3);
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'RwKQzae',
  height: 450
} %}

### `saturate`

The saturate filter is very similar to the `brightness` filter and accepts the same argument:
number or percentage.
Instead of increasing or decreasing the brightness effect,
`saturate` increases or decreases color saturation.

 ```css
.my-element {
	filter: saturate(155%);
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'BapYgQg',
  height: 450
} %}

### `sepia`

You can add a sepia tone effect with this filter that works like `grayscale()`.
The sepia tone is a photographic printing technique that converts black tones to brown tones to warm them up.
You can pass a number or percentage as the argument for `sepia()`
which increases or decreases the effect.
Passing no arguments adds a full sepia effect (equivalent to `sepia(100%)`).

```css
.my-element {
	filter: sepia(70%);
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'WNRMqpb',
  height: 450
} %}

### `hue-rotate`

You learned about how the hue in `hsl` references a rotation of the color wheel in the
[colors lesson](/learn/css/color) and this filter works in a similar way.
If you pass an angle, such as degrees or turns,
it shifts the hue of all the element's colors,
changing the part of the color wheel it references. If you pass no argument, it does nothing.

```css
.my-element {
	filter: hue-rotate(120deg);
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'ExZQBWw',
  height: 450
} %}

### `drop-shadow`

You can apply a curve-hugging drop shadow like you would in a design tool,
such as Photoshop with
[`drop-shadow`](https://developer.mozilla.org/docs/Web/CSS/filter-function/drop-shadow()).
This shadow is applied to an alpha mask which makes it very useful for adding a shadow to a cutout image.
The `drop-shadow` filter takes a shadow parameter which contains space separated offset-x, offset-y, blur and color values.
It is almost identical to `box-shadow`,
but the `inset` keyword and spread value are not supported.

```css
.my-element {
	filter: drop-shadow(5px 5px 10px orange);
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'PoWQrJr',
  height: 450
} %}

Learn more about the different types of shadows in the [shadows](/learn/css/shadows) module.

### `url`

The `url` filter allows you to apply an SVG filter from a linked SVG element or file.
You can
[read more about SVG filters here](https://developer.mozilla.org/docs/Web/SVG/Element/filter)

{% Codepen {
  user: 'web-dot-dev',
  id: 'mdRNgyp',
  height: 450
} %}

## Backdrop filter

The [backdrop-filter](https://developer.mozilla.org/docs/Web/CSS/backdrop-filter)
property accepts all of the same filter function values as `filter`.
The difference between `backdrop-filter` and `filter`
is that the `backdrop-filter` property only applies the filters to the background,
where the `filter` property applies it to the whole element.

The example right at the start of this lesson is the perfect example,
because you don't want the text to be blurred and ideally you don't want to have to add extra HTML elements.
Being able to apply filters only to the backdrop enables that.

{% Codepen {
  user: 'web-dot-dev',
  id: 'KKaQLoL'
} %}

{% Assessment 'filters' %}
