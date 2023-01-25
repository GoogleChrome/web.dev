---
title: 'min(), max(), and clamp(): three logical CSS functions to use today'
subhead: Learn how to control element sizing, maintain proper spacing, and implement fluid typography using these well-supported CSS functions.
authors:
  - una
date: 2020-10-14
hero: image/admin/aVL3BEXD3AF9fFzPGKMf.jpg
alt: Set of tools on a desk.
description: Min, max, and clamp provide some powerful CSS capabilities that enable more responsive styling with fewer liens of code. This post goes over how to control element sizing, maintain proper spacing, and implement fluid typography using these well-supported CSS math functions.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - css
  - layout
feedback:
  - api
---

With responsive design evolving and becoming increasingly nuanced, CSS itself is
constantly evolving and providing authors increased control. The
[`min()`](https://developer.mozilla.org/en-US/docs/Web/CSS/min),
[`max()`](https://developer.mozilla.org/en-US/docs/Web/CSS/max), and
[`clamp()`](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp) functions,
now supported in all modern browsers, are among the latest tools in making
authoring websites and apps more dynamic and responsive.

When it comes to flexible and fluid typography, controlled element resizing, and
maintaining proper spacing, `min()`, `max()`, and `clamp()` can help.

## Background

<blockquote>
  <p>The math functions, <code>calc()</code>, <code>min()</code>, <code>max()</code>, and <code>clamp()</code> allow mathematical expressions with addition (+), subtraction (-), multiplication (*), and division (/) to be used as component values</p>
  <cite><a href="https://www.w3.org/TR/css-values-4/#calc-notation">CSS Values And Units Level 4</a></cite>
</blockquote>

Safari was the first to [ship](https://bugs.webkit.org/show_bug.cgi?id=167000)
the complete set of functions in April 2019, with Chromium following later that
year in version 79. This year, with Firefox
[75](https://bugzilla.mozilla.org/show_bug.cgi?id=1519519) shipping, we now have
browser parity for `min()`, `max()`, and `clamp()` in all evergreen browsers.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZIgePP41Quh7ubYh54vo.png", alt="", width="800", height="246", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    <a href="https://caniuse.com/css-math-functions">Caniuse</a> support table.
  </figcaption>
</figure>

## Usage

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-demo.mp4">
  </video>
  <figcaption class="w-figcaption">
    Showing how the min() function selects a value based on a list of options and its parent. <a href="https://codepen.io/una/pen/rNeGNVL">See Demo on Codepen.</a>
  </figcaption>
</figure>

You can use `min()`, `max()`, and `clamp()` on the right hand side of any CSS
expression where it would make sense. For `min()` and `max()`, you provide an
argument list of values, and the browser determines which one is either the
smallest or largest, respectively. For example, in the case of: `min(1rem, 50%, 10vw)`, the browser calculates which of these relative units is the smallest,
and uses that value as the actual value.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/max-demo.mp4">
  </video>
  <figcaption class="w-figcaption">
    Showing how the max() function selects a value based on a list of options and its parent. <a href="https://codepen.io/una/pen/RwaZXqR">See Demo on Codepen.</a>
  </figcaption>
</figure>

The `max()` function selects the largest value from a list of comma-separated
expressions.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/clamp-demo.mp4">
  </video>
  <figcaption class="w-figcaption">
    Showing how the clamp() function selects a value based on a list of options and its parent. <a href="https://codepen.io/una/pen/bGpoGdJ">See Demo on Codepen.</a>
  </figcaption>
</figure>

To use `clamp()` enter three values: a minimum value, ideal value (from which to
calculate), and maximum value.

Any of these functions can be used anywhere a `<length>`, `<frequency>`,
`<angle>`, `<time>`, `<percentage>`, `<number>`, or `<integer>` is allowed. You
can use these on their own (i.e. `font-size: max(0.5vw, 50%, 2rem)`), in
conjunction with `calc()` (i.e. `font-size: max(calc(0.5vw - 1em), 2rem)`), or
composed (i.e. `font-size: max(min(0.5vw, 1em), 2rem)`).

{% Aside %} When using a calculation inside of a `min()`, `max()`, or `clamp()`
function, you can remove the call to `calc()`. For example, writing `font-size: max(calc(0.5vw - 1em), 2rem)` would be the same as `font-size: max(0.5vw - 1em, 2rem)`. {% endAside %}

To recap:

- `min(<value-list>)`: selects the smallest (most negative) value from a list of
  comma-separated expressions
- `max(<value-list>)`: selects the largest (most positive) value from a list of
  comma-separated expressions
- `clamp(<min>, <ideal>, <max>)`: clamps a value between an upper and lower
  bound, based on a set ideal value

Let's take a look at some examples.

## The perfect width

According to [The Elements of Typographic
Style](http://webtypography.net/2.1.2#:~:text=%E2%80%9CAnything%20from%2045%20to%2075,is%2040%20to%2050%20characters.%E2%80%9D)
by Robert Bringhurst, "anything from 45 to 75 characters is widely regarded as a
satisfactory length of line for a single-column page set in a serifed text face
in a text size."

To ensure that your text blocks are not narrower than 45 characters or wider
than 75 characters, use `clamp()` and the `ch` (0-width [character advance](https://developer.mozilla.org/en-US/docs/Web/CSS/length))
unit:

```css
p {
  width: clamp(45ch, 50%, 75ch);
}
```

This allows for the browser to determine the width of the paragraph. It will set
the width to 50%, unless 50% is smaller than `45ch`, at which point `45ch` will
be selected, and visa versa for if 50% is wider than `75ch`. In this demo, the
card itself is getting clamped:

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/clamp-width.mp4">
  </video>
  <figcaption class="w-figcaption">
    Using the clamp() function to limit a minimum and maximum width. <a href="https://codepen.io/una/pen/QWyLxaL">See Demo on Codepen.</a>
  </figcaption>
</figure>

You could break this up with just the `min()` or `max()` function. If you want
the element to always be at `50%` width, and not exceed `75ch` in width (i.e. on
larger screens), write: `width: min(75ch, 50%);`. This essentially sets a "max"
size by using the `min()` function.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/max-width.mp4">
  </video>
  <figcaption class="w-figcaption">
    Using the clamp() function to limit a minimum and maximum width.
  </figcaption>
</figure>

By the same token, you can ensure a minimum size for legible text using the
`max()` function. This would look like: `width: max(45ch, 50%);`. Here, the
browser selects whichever is larger, `45ch` or `50%`, meaning the element must
be at _least_ `45ch` or larger.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-width.mp4">
  </video>
  <figcaption class="w-figcaption">
    Using the clamp() function to limit a minimum and maximum width.
  </figcaption>
</figure>

## Padding management

Using the same concept as above, where the `min()` function can set a "max"
value and `max()` sets a "min" value, you can use `max()` to set a minimum
padding size. This example comes from [CSS
Tricks](https://css-tricks.com/using-max-for-an-inner-element-max-width/), where
reader Caluã de Lacerda Pataca shared this idea: The idea is to enable an
element to have additional padding at larger screen sizes, but maintain a
minimum padding at smaller screen sizes, particularly on the inline padding. To
achieve this, use `calc()` and subtract the minimum padding from either side:
`calc((100vw - var(--contentWidth)) / 2)`, _or_ use max: `max(2rem, 50vw - var(--contentWidth) / 2)`. All together it looks like:

```css
footer {
  padding: var(--blockPadding) max(2rem, 50vw - var(--contentWidth) / 2);
}
```

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-padding.mp4">
  </video>
  <figcaption class="w-figcaption">
    Setting a minimum padding for a component using the max() function. <a href="https://codepen.io/chriscoyier/pen/qBZqNKa">See Demo on Codepen.</a>
  </figcaption>
</figure>

## Fluid typography

In order to enable [fluid
typography](https://www.smashingmagazine.com/2016/05/fluid-typography/), [Mike
Riethmeuller](https://twitter.com/mikeriethmuller) popularized a technique that
uses the `calc()` function to set a minimum font size, maximum font size, and
allow for scaling from the min to the max.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/fliud-type.mp4">
  </video>
  <figcaption class="w-figcaption">
    Creating fluid typography with clamp(). <a href="https://codepen.io/una/pen/ExyYXaN">See Demo on Codepen.</a>
  </figcaption>
</figure>

With `clamp()`, you can write this more clearly. Rather than requiring a complex
string, the browser can do the work for you. Set the minimum acceptable font
size (for example, `1.5rem` for a title, maximum size (i.e. `3rem`) and ideal
size of `5vw`.

Now, we get typography that scales with the viewport width of the page until it
reaches the limiting minimum and maximum values, in a much more succinct line of
code:

```css
p {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

{% Aside 'warning' %}
Limiting how large text can get with `max()` or `clamp()` can cause a WCAG failure
under [1.4.4 Resize text (AA)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=144#resize-text)
, because a user may be unable to scale the text to 200% of its original size.
Be certain to [test the results with zoom](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html).
{% endAside %}

## Conclusion

The CSS math functions, `min()`, `max()`, and `clamp()` are very powerful, well
supported, and could be just what you're looking for to help you build
responsive UIs. For more resources, check out:

- [CSS Values and Units on
  MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS Values and Units Level 4 Spec](https://www.w3.org/TR/css-values-4/)
- [CSS Tricks on Article on Inner-Element Width](https://css-tricks.com/using-max-for-an-inner-element-max-width/)
- [min(), max(), clamp() Overview by Ahmad Shadeed](https://ishadeed.com/article/css-min-max-clamp/)

Cover image from [@yer_a_wizard](https://unsplash.com/@yer_a_wizard) on
Unsplash.
