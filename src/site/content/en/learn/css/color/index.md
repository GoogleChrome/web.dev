---
title: Color
description:
authors:
  - andybell
date: 2021-04-01
---

# Color

Color is an important part of any website and in CSS there are many options for color types,
functions and treatments.

How do you decide which color type to use?
How do you make your colors semi-transparent?
In this lesson,
you're going to learn about what options you have to help you make the right decisions for your project and team.

CSS has [various different data types](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Types),
such as strings and numbers.
Color is one of these types and uses other types,
such as numbers for its own definitions.


## Numeric colors

It is very likely that your first exposure to colors in CSS is via numeric colors.
We can work with numerical color values in a few different forms.

### Hex colors

```css
h1 {
	color: #b71540
}
```

Hexadecimal notation (often shortened to hex) is a shorthand syntax for RGB,
which assigns a numeric value to red green and blue,
which are the three **primary colors**.

{% Aside %}
According to the Web Almanac,
[hex is the most popular color syntax type](https://almanac.httparchive.org/en/2019/css#color-types).
{% endAside %}

The hexadecimal ranges are **0-9** and **A-F**.
When used in a six digit sequence,
they are translated to the RGB numerical ranges which are 0-255
which correspond to the red, green, and blue color channels respectively.

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'BapNrPG'
} %}
</figure>

You can also define an alpha value with any numerical colors.
An alpha value is a percentage of transparency.
In hex code, you add another two digits to the six digit sequence,
making an eight digit sequence.
For example, to set black in hex code, write `#000000`.
To add a 50% transparency, change it to `#00000080`.

Because the hex scale is **0-9** and **A-F**, the transparency values are probably not quite what you'd expect them to be.
Here are some key, common values added to the black hex code, `#000000`:

- 0% alpha—which is fully transparent—is **00**: `#00000000`
- 50% alpha is **80**: `#00000080`
- 75% alpha is **BF**: `#000000BF`

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'VwPLXdr'
} %}
</figure>

To convert a two digit hex to a decimal,
take the first digit and multiply it by 16 (because hex is base 16),
then add the second digit. Using **BF** as an example for 75% alpha:

1. B is equal to 11, which when multiplied by 16 equals 176
1. F is equal to 15
1. 176 + 15 = 191
1. The alpha value is 191—75% of 255


{% Aside %}
You can also write hex codes in a three digit shorthand.
A three digit hex code is a shortcut to an equivalent six digit sequence.
For example, `#a4e` is identical to `#aa44ee`.
To add alpha, then `#a4e8` would expand to `#aa44ee88`.
{% endAside %}

### RGB (Red, Green, Blue)

```css
h1 {
	color: rgb(183, 21, 64)
}
```

RGB colors are defined with the
[`rgb()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb()) color function,
using either numbers or percentages as parameters.
The numbers need to be within the **0-255** range and the percentages are between **0% and 100%‌**.
RGB works on the 0-255 scale,
so 255 would be equivalent to 100%, and 0 to 0%.

To set black in RGB, define it as `rgb(0 0 0)`,
which is zero red, zero green and zero blue.
Black can also be defined as `rgb(0%, 0%, 0%)`.
White is the exact opposite: `rgb(255, 255, 255)` or `rgb(100%, 100%, 100%)`.

An alpha is set in `rgb()` in one of two ways.
Either add a `/` **after** the red, green and blue parameters,
or use the [`rgba()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgba()) function.
The alpha can be defined with a percentage or a decimal between 0 and 1.
For example, to set a 50% alpha black in modern browsers,  write: `rgb(0 0 0 / 50%)` or `rgb(0 0 0 / 0.5)`.
For wider support, using the `rgba()` function,
write: `rgba(0, 0, 0, 50%)` or `rgba(0, 0, 0, 0.5)`.

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'dyNomWW'
} %}
</figure>

{% Aside %}
Commas were removed from the `rgb()` and `hsl()` notation because newer color functions,
such as `lab()` and `lch()` use spaces instead of commas as a delimiter.
This change provides more consistency not just with newer color functions,
but with CSS in general.
For better backwards compatibility,
you can still use commas to define `rgb()` and `hsl()`.
{% endAside %}

### HSL (Hue, Saturation, Lightness)

```css
h1 {
	color: hsl(344, 79%, 40%)
}
```

HSL stands for hue, saturation and lightness.
Hue describes the value on the color wheel, from 0 to 360 degrees, starting with red (being both 0 and 360).
A hue of 180, or 50% would be in the blue range.
It's the origin of the color that we see.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/FvSbrk1NRzpjWAW90Mwk.jpg", alt="A color wheel with labels for degree values in 60 degree increments to help visuals what each angle value represents", width="800", height="507" %}

Saturation is how vibrant the selected hue is.
A fully desaturated color (with a saturation of `0%`) will appear grayscale.
And finally, lightness is the parameter which describes the scale from white to black of added light.
A lightness of `100%` will always give you white.

Using the [`hsl()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl()) color function,
you define a true black by writing `hsl(0 0% 0%)`, or even `hsl(0deg 0% 0%)`.
This is because the hue parameter defines the degree on the color wheel,
which if you use the number type, is **0-360**.
You can also use the angle type, which is (`0deg`) or `(0turn)`.
Both saturation and lightness are defined with percentages.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/jXKJgvvjfOZduxOxgD26.jpg", alt="The HSL color function broken down visually. The hue uses the color wheel. The saturation shows grey blending into teal. The lightness shows black into white.", width="800", height="478" %}

{% Aside %}
[The angle type](https://developer.mozilla.org/en-US/docs/Web/CSS/angle)
in CSS is great for defining hue because it represents the angle of the color wheel really well.
This type accepts degrees, turns, radians and gradians.
{% endAside %}

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'poRJLQo'
} %}
</figure>

Alpha is defined in `hsl()`,
in the same way as `rgb()` by adding a `/` after the hue, saturation and lightness parameters *or* by using the
[`hsla()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsla()) function.
The alpha can be defined with a percentage or a decimal between 0 and 1.
For example, to set a 50% alpha black, use: `hsl(0 0% 0% / 50%)` or `hsl(0 0% 0% / 0.5)`.
Using the `hsla()` function, write: `hsla(0, 0%, 0%, 50%)` or `hsla(0, 0%, 0%, 0.5)`.

{% Aside %}
There are some newer color types coming to CSS.
These include [lab()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lab())
and [lch()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lab()),
which allow a far wider range of color to be specified than is possible in RGB.
{% endAside %}

## Color Keywords

There are [148 named colors in CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#color_keywords).
These are plain English names such as purple, tomato and goldenrod.
Some of the most popular names,
according to the [Web Almanac](https://almanac.httparchive.org/en/2019/css),
are black, white, red, blue and gray.
Our favorites include goldenrod, aliceblue, and hotpink.

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'ZELGraM'
} %}
</figure>

Aside from standard colors, there are also special keywords available:

- `transparent` is a fully transparent color.
It is also the initial value of `background-color`
- `currentColor` is the contextual computed dynamic value of the `color` property.
If you have a text color of `red` and then set the `border-color` to be `currentColor`, it will also be red.
If the element that you define `currentColor` on doesn't have a value for `color` defined,
`currentColor` will be computed by the cascade instead

{% Aside %}
System keywords are colors that are defined by your operating system theme.
Some examples of these colors are `Background`,
which is the desktop background color or `Highlight`,
which is the highlight color of selected items. These are just two of
[many options](https://www.w3.org/wiki/CSS/Properties/color/keywords#System_Colors).

All color keywords are case-insensitive,
however you will often see system colors with capitalization in order to differentiate them from standard color keywords.
{% endAside %}

## Where to use color in CSS rules

If a CSS property accepts the
[`<color>`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) data type as a value,
it will accept any of the above methods of expressing color.
For styling text, use the `color`, `text-shadow` and `text-decoration-color` properties
which all accept color as the value or color as part of the value.

For backgrounds, you can set a color as the value for `background` or `background-color`.
Colors can also be used in gradients, such as `linear-gradient`.
Gradients are a type of image that can be programmatically defined in CSS.
Gradients accept two or more colors in any combination of color format, such as hex, rgb or hsl.

{% Aside %}
There's lots to learn with gradients so we wrote a whole lesson on how to use them.

@@TODO link to gradients lesson
{% endAside %}

Finally, `border-color`, and `outline-color` set the color for borders and outlines on your boxes.
The `box-shadow` property also accepts color as one of the values.

<figure class="w-figure">
{% Codepen {
  user: 'web-dot-dev',
  id: 'bGgdJKd'
} %}
</figure>

{% Assessment 'color' %}

## Resources

- [A handy demo showing how you can use angles with HSL](https://codepen.io/argyleink/pen/ExjReJa)
- [A comprehensive guide on color](https://css-tricks.com/nerds-guide-color-web/)
- [[video] An explainer on how to read hex codes](https://www.youtube.com/watch?v=eqZqx6lRPe0)
- [How hexadecimal codes work](https://medium.com/basecs/hexs-and-other-magical-numbers-9785bc26b7ee)
