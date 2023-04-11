---
title: Borders
description: >
  A border provides a frame for your boxes.
  In this module find out how to change the size, style and color of borders using CSS.
audio:
  title: 'The CSS Podcast - 016: Borders'
  src: 'https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_016_v1.0.mp3?dest-id=1891556'
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-04-30
---

In the [box model](/learn/css/box-model) module,
we considered a frame analogy to describe each section of the box model.

{% Img
src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/FBaaJXdnuSkvOx1nB0CB.jpg",
alt="Three picture frames next to each other.
The middle frame has the sections of the box model over the top of it",
width="800",
height="562" %}

The border box is the frame of your boxes,
and the `border` properties give you a huge array of options to create that frame in
nearly any style that you can think of.

## Border properties

The individual `border` properties provide a way to style the various parts of a border.

{% BrowserCompat 'css.properties.border' %}

### Style

For a border to appear,
you have to define the
[`border-style`](https://developer.mozilla.org/docs/Web/CSS/border-style).
There's a few options to choose from:

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'GRrvyxY'
} %}
</figure>

When using the `ridge`, `inset`, `outset` and `groove` styles,
the browser will darken the border color for the second shown color to provide contrast and depth.
This behaviour can vary between browsers,
especially for dark colors such as `black`.
In Chrome, these border styles will appear to be solid and in Firefox,
they will be lightened to then provide a darker second color.

Browser behaviour can vary for other border styles too,
so it's important to test your site in different browsers.
A common example of this difference is how each browser renders the `dotted` and `dashed`  styles.

<figure>
  {% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/ybLca9jmTgUtltTwfIpt.jpg",
  alt="The border demo in Chrome,
  Firefox and Safari which demonstrates the subtle differences
  in how the borders display",
  width="800",
  height="489" %}
  <figcaption>Borders displayed in Chrome, Firefox, and Safari.</figcaption>
</figure>

To set border style on each side of your box,
you can use
[`border-top-style`](https://developer.mozilla.org/docs/Web/CSS/border-top-style),
[`border-right-style`](https://developer.mozilla.org/docs/Web/CSS/border-right-style),
[`border-left-style`](https://developer.mozilla.org/docs/Web/CSS/border-left-style),
and [`border-bottom-style`](https://developer.mozilla.org/docs/Web/CSS/border-bottom-style).


### Shorthand

As with `margin` and `padding`,
you can use the
[`border`](https://developer.mozilla.org/docs/Web/CSS/border)
shorthand property to define all the parts of your border in one declaration.

```css
.my-element {
	border: 1px solid red;
}
```

The order of values in the `border` shorthand are `border-width`,
`border-style` and then, `border-color`.

### Color

You can set color on all sides of your box or on each individual side with
[`border-color`](https://developer.mozilla.org/docs/Web/CSS/border-color).
By default, it uses the box's current text color: `currentColor`.
This means that if you only declare border properties,
like width,
the color will be that computed value unless you explicitly set it.

```css
.my-element {
	color: blue;
	border: solid; /* Will be a blue border */
}

.my-element {
	color: blue;
	border: solid yellow;
}
```
<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'yLgovoX'
} %}
</figure>


To set a border color on each side of your box,
use
[`border-top-color`](https://developer.mozilla.org/docs/Web/CSS/border-top-color),
[`border-right-color`](https://developer.mozilla.org/docs/Web/CSS/border-right-color),
[`border-left-color`](https://developer.mozilla.org/docs/Web/CSS/border-left-color) and
[`border-bottom-color`](https://developer.mozilla.org/docs/Web/CSS/border-bottom-color).

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'MWJvQVO'
} %}
</figure>

### Width

The width of a border is how thick the line is, and is controlled by
[`border-width`](https://developer.mozilla.org/docs/Web/CSS/border-width).
The default border width is `medium`.
This won't be visible unless you define a style, though.
You can use other named widths such as `thin` and `thick`.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'PoWKQxN'
} %}
</figure>

The `border-width` properties also accept a length unit such as
`px`, `em`, `rem` or `%`.
To set border width on each side of your box, use
[`border-top-width`](https://developer.mozilla.org/docs/Web/CSS/border-top-width),
[`border-right-width`](https://developer.mozilla.org/docs/Web/CSS/border-right-width),
[`border-left-width`](https://developer.mozilla.org/docs/Web/CSS/border-left-width) and
[`border-bottom-width`](https://developer.mozilla.org/docs/Web/CSS/border-bottom-width).

## Logical properties

In the
[Logical Properties](/learn/css/logical-properties) module you discovered how to refer to block flow and inline flow,
rather than explicit top, right, bottom or left sides.

You have this capability with borders, too:

```css
.my-element {
	border: 2px dotted;
	border-inline-end: 2px solid red;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'poRraBp'
} %}
</figure>

In this example, `.my-element` has all sides defined as having a `2px`,
dotted border that is the current text color.
The `inline-end` border is then defined as `2px`, solid and red.
This means that in left-to-right languages—like English—
the red border will be on the right side of the box.
In right-to-left languages—like Arabic—
the red border will be on the left side of the box.

Browser support is varied for logical properties in borders,
so make sure you check support before using.

## Border radius

To give a box rounded corners use the
[`border-radius`](https://developer.mozilla.org/docs/Web/CSS/border-radius) property.

```css
.my-element {
	border-radius: 1em;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'LYxjQoK'
} %}
</figure>

This shorthand adds a consistent border to each corner of your box.
As with the other border properties,
you can define the border radius for each side with
[`border-top-left-radius`](https://developer.mozilla.org/docs/Web/CSS/border-top-left-radius),
[`border-top-right-radius`](https://developer.mozilla.org/docs/Web/CSS/border-top-right-radius),
[`border-bottom-right-radius`](https://developer.mozilla.org/docs/Web/CSS/border-bottom-right-radius) and
[`border-bottom-left-radius`](https://developer.mozilla.org/docs/Web/CSS/border-bottom-left-radius).

You can also specify each corner's radius in the shorthand,
which follows the order: top left, top right, bottom right then bottom left.

```css
.my-element {
	border-radius: 1em 2em 3em 4em;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'yLgovdK'
} %}
</figure>

By defining a single value for a corner,
you are using another shorthand because a border radius is split into two parts:
the vertical and horizontal sides.
This means that when you set `border-top-left-radius: 1em`,
you are setting the top-left-**top** radius and the top-left-**left** radius.

You can define both properties, per corner like this:

```css
.my-element {
	border-top-left-radius: 1em 2em;
}
```
<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'WNRqoPM'
} %}
</figure>

This adds a `border-top-left-top` value of `1em`,
and a border top-left-left value of `2em`.
This converts the top left border radius into an elliptical radius,
rather than the default circular radius.

You can define these values in the `border-radius` shorthand,
using a `/` to define the elliptical values, after the standard values.
This enables you to get creative and make some complex shapes.

```css
.my-element {
	border: 2px solid;
  border-radius: 95px 155px 148px 103px / 48px 95px 130px 203px;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'abpyqeM'
} %}
</figure>

## Border images

You don't just have to use a stroke-based border in CSS.
You can also use any type of image, using
[`border-image`](https://developer.mozilla.org/docs/Web/CSS/border-image).
This shorthand property allows you to set the source image,
how that image is sliced, the image width,
how far the border is outset from the edge and how it should repeat.

```css
.my-element {
  border-image-source: url(https://assets.codepen.io/174183/border-image-frame.jpg);
  border-image-slice: 61 58 51 48;
  border-image-width: 20px 20px 20px 20px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: stretch stretch;
}
```

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'zYNdWNX'
} %}
</figure>

The [`border-image-width`](https://developer.mozilla.org/docs/Web/CSS/border-image-width)
property is like `border-width`:
it is how you set the width of your border image.
The [`border-image-outset`](https://developer.mozilla.org/docs/Web/CSS/border-image-outset)
property lets you set the distance between your border image and the box that it wraps around.

### `border-image-source`

 The [`border-image-source`](https://developer.mozilla.org/docs/Web/CSS/border-image-source)
 (source of the border image) can be a `url` for any valid image, which includes CSS gradients.

```css
.my-element {
	border-image-source: url('path/to/image.png');
}

.my-element {
	border-image-source: linear-gradient(to bottom, #000, #fff);
}
```

### `border-image-slice`

The [`border-image-slice`](https://developer.mozilla.org/docs/Web/CSS/border-image-slice)
property is a useful property that allows you to slice an image into 9 parts, made up of 4 split lines.
It works like the `margin` shorthand where you define the top, right, bottom and left **offset value**.

```css
.my-element {
	border-image: url('image.jpg');
	border-image-slice: 61 58 51 48;
}
```

{% Img
src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/WETsTwhFSfl30VfyfMTA.png",
alt="The image used in the demo with the four slices shown with blue lines",
width="800",
height="380" %}

With the offset values defined,
you now have 9 sections of the image: 4 corners, 4 edges and a middle section.
The corners are applied to the corners of the element with the border image.
The edges are applied to the edges of that element.
The [`border-image-repeat`](https://developer.mozilla.org/docs/Web/CSS/border-image-repeat)
property defines how those edges fill their space and the
[`border-image-width`](https://developer.mozilla.org/docs/Web/CSS/border-image-width)
property controls the size of the slices.

Lastly, the `fill` keyword determines whether the middle section, left by the slicing, is used as the element's background image or not.

### `border-image-repeat`

[`border-image-repeat`](https://developer.mozilla.org/docs/Web/CSS/border-image-repeat)
is how you instruct CSS how you would like your border image to repeat.
It works the same as `background-repeat`.

- The initial value is `stretch`,
which stretches the source image to fill available space where possible.
- The `repeat` value tiles the source image's edges as many times as possible,
and may clip the edge regions to achieve this.
- The `round` value is the same as repeat,
but instead of clipping the image edge regions to fit as many as possible,
it stretches the image as well as repeating it to achieve a seamless repeat
- The `space` value is again, the same as repeat,
but this value adds space between each edge region to create a seamless pattern.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'GRrvBYv'
} %}
</figure>

{% Assessment 'borders' %}
