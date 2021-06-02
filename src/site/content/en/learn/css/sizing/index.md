---
title: Sizing Units
description: >
  In this module find out how to size elements using CSS,
  working with the flexible medium of the web.
audio:
  title: 'The CSS Podcast - 008: Sizing Units'
  src: 'https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_008_v1.0.mp3?dest-id=1891556'
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-04-13
tags:
  - css
---

The web is a responsive medium,
but sometimes you want to control its dimensions to improve the overall interface quality.
A good example of this is limiting line lengths to improve readability.
How would you do that in a flexible medium like the web?

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'bGgEGxj',
  tab: 'css,result'
} %}
</figure>

For this case,
you can use a `ch` unit, which is equal to the width of a "0" character in the rendered font at its computed size.
This unit allows you to limit the width of text with a unit that's designed to size text,
which in turn,
allows predictable control regardless of the size of that text.
The `ch` unit is one of a handful of units that are helpful for specific contexts like this example.

## Numbers

Numbers are used to define `opacity`, `line-height` and even for color channel values in `rgb`.
Numbers are unitless integers (1, 2, 3, 100) and decimals (.1, .2, .3).

Numbers have meaning depending on their context.
For example, when defining `line-height`,
a number is representative of a ratio if you define it without a supporting unit:

```css
p {
  font-size: 24px;
  line-height: 1.5;
}
```

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'yLgYZRK',
  tab: 'css,result'
} %}
</figure>

In this example, `1.5` is equal to **150%** of the `p` element's **computed pixel font size**.
This means that if the `p` has a `font-size` of `24px`,
the line height will be computed as `36px`.

{% Aside %}
It's a good idea to use a unitless value for `line-height`,
rather than specifying a unit.
As you learned in the [inheritance module](/learn/css/inheritance),
`font-size` can be inherited.
Defining a unitless `line-height` keeps the line-height relative to the font size.
This provides a better experience than, say, `line-height: 15px`,
which will not change and might look strange with certain font sizes.
{% endAside %}

Numbers can also be used in the following places:

- When setting values for filters: `filter: sepia(0.5)` applies a `50%` sepia filter to the element.
- When setting opacity: `opacity: 0.5` applies a `50%` opacity.
- In color channels: `rgb(50, 50, 50)`,
  where the values 0-255 are acceptable to set a color value.
  [See color lesson](/learn/css/color).
- To transform an element: `transform: scale(1.2)` scales the element by 120% of its initial size.

## Percentages

When using a percentage in CSS you need to know how the percentage is calculated.
For example,`width` is calculated as a percentage of the width of the parent element.

```css
div {
  width: 300px;
  height: 100px;
}

div p {
  width: 50%; /* calculated: 150px */
}
```

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'ZELbwwj',
  tab: 'css,result'
} %}
</figure>

In the above example, the width of `div p` is `150px`.

If you set `margin` or `padding` as a percentage,
they will be a portion of the **parent element's width**,
regardless of direction.

```css
div {
  width: 300px;
  height: 100px;
}

div p {
  margin-top: 50%; /* calculated: 150px */
  padding-left: 50%; /* calculated: 150px */
}
```

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'WNRQPqX',
  tab: 'css,result'
} %}
</figure>

In the above snippet, both the `margin-top` and `padding-left` will compute to `150px`.

```css
div {
  width: 300px;
  height: 100px;
}

div p {
  width: 50%; /* calculated: 150px */
  transform: translateX(10%); /* calculated: 15px */
}
```

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'xxgwBxv',
  tab: 'css,result'
} %}
</figure>

If you set a `transform` value as a percentage,
it is based on the element with the transform set.
In this example, the `p` has a `translateX` value of `10%` and a `width` of `50%`.
First, calculate what the width will be: `150px` because it is **50% of its parent's width**.
Then, take `10%` of `150px`, which is `15px`.

{% Aside 'key-term' %}
The transform property allows you alter an element's appearance and position by rotating, skewing, scaling and translating it.
This can be done in a 2D and 3D space.
{% endAside %}

## Dimensions and lengths

If you attach a unit to a number, it becomes a dimension.
For example, `1rem` is a dimension.
In this context, the unit that is attached to a number is referred to in specifications as a dimension token.
Lengths are **dimensions that refer to distance** and they can either be absolute or relative.

### Absolute lengths

All absolute lengths resolve against the same base,
making them predictable wherever they're used in your CSS.
For example, if you use `cm` to size your element and then print,
it should be accurate if you compared it to a ruler.

```css
div {
  width: 10cm;
  height: 5cm;
  background: black;
}
```

If you printed this page, the `div` would print as a 10x5cm black rectangle.
Keep in mind, CSS is used not only for digital content, but also to style print content.
Absolute lengths can really come in handy when designing for print.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Unit</th>
        <th>Name</th>
        <th>Equivalent to</th>
      </tr>
    </thead>
  <tbody>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#cm">cm</a></td>
      <td>Centimeters</td>
      <td>1cm = 96px/2.54</td>
    </tr>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#mm">mm</a></td>
      <td>Millimeters</td>
      <td>1mm = 1/10th of 1cm</td>
    </tr>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#q">Q</a></td>
      <td>Quarter-millimeters</td>
      <td>1Q = 1/40th of 1cm</td>
    </tr>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#in">in</a></td>
      <td>Inches</td>
      <td>1in = 2.54cm = 96px</td>
    </tr>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#pc">pc</a></td>
      <td>Picas</td>
      <td>1pc = 1/6th of 1in</td>
    </tr>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#pt">pt</a></td>
      <td>Points</td>
      <td>1pt = 1/72th of 1in</td>
    </tr>
    <tr>
      <td><a href="https://www.w3.org/TR/css-values-4/#px">px</a></td>
      <td>Pixels</td>
      <td>1px = 1/96th of 1in</td>
    </tr>
    </tbody>
  </table>
</div>

### Relative lengths

A relative length is calculated against a base value, much like a percentage.
The difference between these and percentages is that you can contextually size elements.
This means that CSS has units such as `ch` that use the text size as a basis,
and `vw` which is based on the width of the viewport (your browser window).
Relative lengths are particularly useful on the web due to its responsive nature.

#### Font-size-relative units

CSS provides helpful units that are relative to the size of elements of rendered typography,
such as the size of the text itself (`em` units) or width of the typefaces characters (`ch` units).

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>unit</th>
        <th>relative to:</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#em">em</a></td>
        <td>Relative to the font size,
        i.e. 1.5em will be 50% larger than the base computed font size of its parent.
        (Historically, the height of the capital letter "M").</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#ex">ex</a></td>
        <td>Heuristic to determine whether to use the x-height,
        a letter "x", or `.5em` in the current computed font size of the element.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#cap">cap</a></td>
        <td>Height of the capital letters in the current computed font size of the element.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#ch">ch</a></td>
        <td>Average <a href="https://www.w3.org/TR/css-values-4/#length-advance-measure">character advance</a>
        of a narrow glyph in the element's font
        (represented by the "0" glyph).</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#ic">ic</a></td>
        <td>Average
        <a href="https://www.w3.org/TR/css-values-4/#length-advance-measure">character advance</a>
        of a full width glyph in the element's font,
        as represented by the "水" (CJK water ideograph, U+6C34) glyph.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#rem">rem</a></td>
        <td>Font size of the root element (default is 16px).</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#lh">lh</a></td>
        <td>Line height of the element.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#rlh">rlh</a></td>
        <td>Line height of the root element.</td>
      </tr>
    </tbody>
  </table>
</div>

<figure class="w-figure">
{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/ttaikDgwEC572lrGgWlG.svg", alt="The text, CSS is 10x great with labels for ascender height, descender height and x-height. The x-height represents 1ex and the 0 represents 1ch", width="800", height="203" %}
</figure>

#### Viewport-relative units

You can use the dimensions of the viewport (browser window) as a relative basis.
These units portion up the available viewport space.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>unit</th>
        <th>relative to</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#vw">vw</a></td>
        <td>1% of viewport's width. People use this unit to do cool font tricks,
        like resizing a header font based on the width of the page so as the user resizes,
        the font will also resize.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#vh">vh</a></td>
        <td>1% of viewport's height.
        You can use this to arrange items in a UI,
        if you have a footer toolbar for example.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#vi">vi</a></td>
        <td>1% of viewport's size in the root element's <a href="https://www.w3.org/TR/css-writing-modes-4/#inline-axis">inline axis</a>.
        Axis refers to writing modes.
        In horizontal writing modes like English,
        the inline axis is horizontal.
        In vertical writing modes like some Japanese typefaces, the inline axis runs top to bottom.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#vb">vb</a></td>
        <td>1% of viewport's size in the root element's <a href="https://www.w3.org/TR/css-writing-modes-4/#block-axis">block axis</a>.
        For the block axis, this would be the directionality of the language.
        LTR languages like English would have a vertical block axis,
        since English language readers parse the page from top to bottom.
        A vertical writing mode has a horizontal block axis.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#vmin">vmin</a></td>
        <td>1% of the viewport's smaller dimension.</td>
      </tr>
      <tr>
        <td><a href="https://www.w3.org/TR/css-values-4/#vmax">vmax</a></td>
        <td>1% of the viewport's larger dimension.</td>
      </tr>
    </tbody>
  </table>
</div>

```css
div {
  width: 10vw;
}

p {
  max-width: 60ch;
}
```

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'JjEYqXa'
} %}
</figure>

In this example, the `div` will be 10% of the viewport's width because `1vw` is **1% of the viewport width**.
The `p` element has a `max-width` of `60ch`
which means it can't exceed the width of 60 "0" characters in the calculated font and size.

{% Aside 'objective' %}

By sizing text with relative units like `em` or `rem`,
rather than an absolute unit, like `px`, the size of your text can respond to user preferences.
This can include the system font size or parent element's font size, such as the `<body>`.
The base size of the `em` is the element's parent and the base size of the `rem` is the base font size of the document.

If you don't define a `font-size` on your `html` element,
this user-preferred system font size will be honoured if you use relative lengths,
such as `em` and `rem`.
If you use `px` units for sizing text,
this preference will be ignored.

{% Video
  src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/cUEl77VN4ZtAdElV4fd6.mp4",
  autoplay=true,
  controls=true,
  muted=true
%}

{% endAside %}

## Miscellaneous units

There are some other units which have been specified to deal with particular types of values.

### Angle units

In the [color module](/learn/css/color/),
we looked at **angle units**,
which are helpful for defining degree values,
such as the hue in `hsl`.
They are also useful for rotating elements within transform functions.

```css
div {
  width: 150px;
  height: 150px;
  transform: rotate(60deg);
}
```

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'VwPvRbK',
  tab: 'css,result'
} %}
</figure>

Using the `deg` angle unit, you can rotate a `div` 90° on its center axis.

```css
div {
  background-image: url('a-low-resolution-image.jpg');
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  div {
    background-image: url('a-high-resolution-image.jpg');
  }
}
```

{% Aside %}
Other angle units include `rad` (radians), `grad` (gradians), and `turn` units,
which represent a part of an angle, where `1turn` = `360deg`, and `0.5turn` = `180deg`.
{% endAside %}

#### Resolution units

In the previous example the value of `min-resolution` is `192dpi`.
The `dpi` unit stands for **dots per inch**.
A useful context for this is detecting very high resolution screens,
such as Retina displays in a media query and serving up a higher resolution image.

{% Assessment 'sizing' %}

## Resources

- [CSS Spec Values and Units Level 4](https://www.w3.org/TR/css-values-4)
- [Sizing and Units on MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [All About Ems](https://learn.scannerlicker.net/2014/07/31/so-how-much-is-an-em/)
- [A percentages explainer](https://wattenberger.com/blog/css-percents)
