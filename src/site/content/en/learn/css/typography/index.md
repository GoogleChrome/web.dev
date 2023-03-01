---
title: Text and typography
description: >
  In this module, learn how to style text on the web.
audio:
  title: 'The CSS Podcast - 036: Text & Typography'
  src: https://traffic.libsyn.com/secure/thecsspodcast/TCP036_v2.mp3?dest-id=1891556
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - cambickel
date: 2021-11-23
---

Text is one of the core building blocks of the web.

When making a website, you don’t necessarily need to style your text; HTML actually has some pretty reasonable default styling.

However, text will likely make up the majority of your website, so it’s worthwhile to add some styling to spruce it up. By changing a few basic properties, you can significantly improve the reading experience for your users!

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'WNEJWGy',
  height: 590
} %}
</figure>

In this module, we’ll first look at some fundamental CSS font properties like `font-family`, `font-style`, `font-weight`, and `font-size`. Then, we’ll dive into properties that affect paragraphs of text, such as `text-indent` and `word-spacing`. The module finishes with some more advanced topics such as variable fonts and pseudo-elements.

## Change the typeface
{% BrowserCompat 'css.properties.font-family' %}

Use [`font-family`](https://developer.mozilla.org/docs/Web/CSS/font-family) to change the typeface of your text.

The `font-family` property accepts a comma-separated list of strings, either referring to *specific* or *generic* font families. Specific font families are quoted strings, such as “Helvetica”, “EB Garamond”, or “Times New Roman”. Generic font families are keywords such as `serif`, `sans-serif`, and `monospace` (find the [full list of options on MDN](https://developer.mozilla.org/docs/Web/CSS/font-family#values)). The browser will display the first available typeface from the provided list.

{% Aside %}
When the browser chooses which font to display from your `font-family` declaration, it doesn’t stop at the first available font in the list. Instead, it selects fonts one character at a time. If a particular character isn’t available in the first font in the list, it moves on to the next, and so on.
{% endAside %}

When using `font-family`, you should specify at least one generic font family in case the user’s browser doesn’t have your preferred fonts. Generally, the fallback generic font family should be similar to your preferred fonts: if using `font-family: "Helvetica"` (a sans-serif font family), your fallback should be `sans-serif` to match.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'yLojraG',
  height: 470,
  tab: 'css,result'
} %}
</figure>

## Use italic and oblique fonts
{% BrowserCompat 'css.properties.font-style' %}

Use [`font-style`](https://developer.mozilla.org/docs/Web/CSS/font-style) to set whether text should be italic or not. `font-style` accepts one of the following keywords: `normal`, `italic`, and `oblique`.

{% Aside %}
Q: What’s the difference between `italic` and `oblique`?
A: In fonts that support it, `font-style: italic` is typically a cursive version of the regular typeface. `font-style: oblique` displays a slanted version of regular typeface.
{% endAside %}

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'MWvGRjx',
  height: 280
} %}
</figure>

## Make text bold
{% BrowserCompat 'css.properties.font-weight' %}

Use [`font-weight`](https://developer.mozilla.org/docs/Web/CSS/font-weight) to set the “boldness” of text. This property accepts keyword values (`normal`, `bold`), relative keyword values (`lighter`, `bolder`), and numeric values (`100` to `900`).

The keywords `normal` and `bold` are equivalent to the numeric values `400` and `700`, respectively.

The keywords `lighter` and `bolder` are calculated relative to the parent element. See MDN’s [Meaning of Relative Weights](https://developer.mozilla.org/docs/Web/CSS/font-weight#meaning_of_relative_weights) for a handy chart showing how this value is determined.

{% Aside %}
Most fonts, especially the ["web-safe" ones](#font-family), only support the weights `400` (`normal`) and `700` (`bold`). When importing fonts using `@font-face` or `@import`, you can choose specific weights you want to pull in. Still, non-variable fonts only support numeric values for `font-weight` in the 100s, e.g. `100`, `200`, `300`, etc. If you want to use `font-weight: 321` (for example), you’ll have to use a [Variable Font](#variable-fonts).
{% endAside %}

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'gOxKxNz',
  height: 580
} %}
</figure>

## Change the size of text
{% BrowserCompat 'css.properties.font-size' %}

Use [`font-size`](https://developer.mozilla.org/docs/Web/CSS/font-size) to control the size of your text elements. This property accepts length values, percentages, and a handful of keyword values.

In addition to length and percentage values, `font-size` accepts some *absolute* keyword values (`xx-small`, `x-small`, `small`, `medium`, `large`, `x-large`, `xx-large`) and a couple of *relative* keyword values (`smaller`, `larger`). The relative values are relative to the parent element’s `font-size`.

{% Aside %}
Q: What’s the difference between `em` and `rem`?
A: In CSS, `em` represents the `font-size` inherited from the element’s parent. For example, `font-size: 2em` is equivalent to the parent’s `font-size` multiplied by two. `rem` is similar, but instead represents the `font-size` inherited from the *root element*, i.e. `<html>`.
{% endAside %}


<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'eYEroda',
  height: 370
} %}
</figure>

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'vYJzYzw'
} %}
</figure>

## Change the space between lines
{% BrowserCompat 'css.properties.line-height' %}

Use [`line-height`](https://developer.mozilla.org/docs/Web/CSS/line-height) to specify the height of each line in an element. This property accepts either a number, length, percentage, or the keyword `normal`. Generally, it’s recommended to use a number instead of a length or percentage to avoid issues with inheritance.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'XWaqQjv',
  height: 600
} %}
</figure>

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'ExvLJNx',
  height: 820
} %}
</figure>

## Change the space between characters
{% BrowserCompat 'css.properties.letter-spacing' %}

Use [`letter-spacing`](https://developer.mozilla.org/docs/Web/CSS/letter-spacing) to control the amount of horizontal space between characters in your text. This property accepts length values such as `em`, `px`,  and `rem`.

Note that the specified value *increases* the amount of natural space between characters. In the demo below, try selecting an individual letter to see the size of its letterbox and how it changes with `letter-spacing`.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'abyGxBz',
  height: 560
} %}
</figure>

## Change the space between words
{% BrowserCompat 'css.properties.word-spacing' %}

Use [`word-spacing`](https://developer.mozilla.org/docs/Web/CSS/word-spacing) to increase or decrease the length of space between each word in your text. This property accepts length values such as `em`, `px`, and `rem`. Note that the length you specify is for *extra* space in addition to the normal spacing. This means that `word-spacing: 0` is equivalent to `word-spacing: normal`.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'xxLjeRG',
  height: 280
} %}
</figure>

## `font` shorthand

You can use the shorthand [`font`](https://developer.mozilla.org/docs/Web/CSS/font) property to set many font-related properties at once. The list of possible properties are [`font-family`](#font-family), [`font-size`](#font-size), [`font-stretch`](https://developer.mozilla.org/docs/Web/CSS/font-stretch), [`font-style`](#font-style), [`font-variant`](#font-variant), [`font-weight`](#font-weight), and [`line-height`](#line-height).

Check out [MDN’s `font` article](https://developer.mozilla.org/docs/Web/CSS/font#syntax) for the specifics of how to order these properties.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'JjyvVbY',
  height: 270
} %}
</figure>

## Change the case of text
{% BrowserCompat 'css.properties.text-transform' %}

Use [`text-transform`](https://developer.mozilla.org/docs/Web/CSS/text-transform) to modify the capitalization of your text without needing to change the underlying HTML. This property accepts the following keyword values: `uppercase`, `lowercase`, and `capitalize`.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'qBXYwqb',
  height: 450
} %}
</figure>

## Add underlines, overlines, and through-lines to text
{% BrowserCompat 'css.properties.text-decoration' %}

Use [`text-decoration`](https://developer.mozilla.org/docs/Web/CSS/text-decoration) to add lines to your text. Underlines are most commonly used, but it’s possible to add lines above your text or right through it!

The `text-decoration` property is shorthand for the more specific properties detailed below.

The [`text-decoration-line`](https://developer.mozilla.org/docs/Web/CSS/text-decoration-line) property accepts the keywords `underline`, `overline`, and `line-through`. You can also specify multiple keywords for multiple lines.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'LYjmvbN',
  height: 460,
  tab: 'css,result'
} %}
</figure>

The [`text-decoration-color`](https://developer.mozilla.org/docs/Web/CSS/text-decoration-color) property sets the color of all decorations from `text-decoration-line`.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'oNedOYL',
  height: 460,
  tab: 'css,result'
} %}
</figure>

The [`text-decoration-style`](https://developer.mozilla.org/docs/Web/CSS/text-decoration-style) property accepts the keywords `solid`, `double`, `dotted`, `dashed`, and `wavy`.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'dyzeLOp',
  height: 460,
  tab: 'css,result'
} %}
</figure>

The [`text-decoration-thickness`](https://developer.mozilla.org/docs/Web/CSS/text-decoration-thickness) property accepts any length values and sets the stroke width of all decorations from `text-decoration-line`.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'VwzxNmm',
  height: 460,
  tab: 'css,result'
} %}
</figure>

The `text-decoration` property is a shorthand for all the above properties.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'YzxLMpN',
  height: 460,
  tab: 'css,result'
} %}
</figure>

{% Aside %}
Use [`text-underline-position`](https://developer.mozilla.org/docs/Web/CSS/text-underline-position) to offset the underline of a `text-decoration: underline` by the specified amount. This property doesn’t work for `overline` or `line-through`.
{% endAside %}

## Add an indent to your text
{% BrowserCompat 'css.properties.text-indent' %}

Use [`text-indent`](https://developer.mozilla.org/docs/Web/CSS/text-indent) to add an indent to your blocks of text. This property takes either a length (for example, `10px`, `2em`) or a percentage of the containing block’s width.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'RwZyOoV',
  height: 300
} %}
</figure>

## Deal with overflowing or hidden content
{% BrowserCompat 'css.properties.text-overflow' %}

Use [`text-overflow`](https://developer.mozilla.org/docs/Web/CSS/text-overflow) to specify how hidden content is represented. There are two options: `clip` (the default), which truncates the text at the point of overflow; and `ellipsis`, which displays an ellipsis (…) at the point of overflow.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'GRvdLNv',
  height: 250,
  tab: 'css,result'
} %}
</figure>

## Control white-space
{% BrowserCompat 'css.properties.white-space' %}

The [`white-space`](https://developer.mozilla.org/docs/Web/CSS/white-space) property is used to specify how whitespace in an element should be handled. For more details, check out the [`white-space` article on MDN](https://developer.mozilla.org/docs/Web/CSS/white-space).

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'PoKegbO',
  height: 970
} %}
</figure>

`white-space: pre` can be useful for rendering [ASCII art](https://en.wikipedia.org/wiki/ASCII_art) or carefully indented code blocks.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'OJjZGbz',
  height: 440
} %}
</figure>

## Control how words break
{% BrowserCompat 'css.properties.word-break' %}

Use [`word-break`](https://developer.mozilla.org/docs/Web/CSS/word-break) to change how words should be “broken” when they would overflow the line. By default, the browser will not split words. Using the keyword value `break-all` for `word-break` will instruct the browser to break words at individual characters if necessary.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'BadxEQY'
} %}
</figure>

## Change text alignment
{% BrowserCompat 'css.properties.text-align' %}

Use [`text-align`](https://developer.mozilla.org/docs/Web/CSS/text-align) to specify the horizontal alignment of text in a block or table-cell element. This property accepts the keyword values `left`, `right`, `start`, `end`, `center`, `justify`, and `match-parent`.

The values `left` and `right` align the text to the left and right sides of the block, respectively.

Use `start` and `end` to represent the location of the start and end of a line of text in the current writing mode. Therefore, `start` maps to `left` in English, and to `right` in Arabic script which is written right to left (RTL). They're logical alignments, learn more in our [logical properties](/learn/css/logical-properties/) module.

Use `center` to align the text to the center of the block.

The value of `justify` organizes the text and changes word spacings automatically so that the text lines up with both the left and right edges of the block.


<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'bGrMJBM',
  height: 570
} %}
</figure>

## Change the direction of text
{% BrowserCompat 'css.properties.direction' %}

Use [`direction`](https://developer.mozilla.org/docs/Web/CSS/direction) to set the direction of your text, either `ltr` (left to right, the default) or `rtl` (right to left). Some languages like Arabic, Hebrew, or Persian are written right to left, so `direction: rtl` should be used. For English and all other left-to-right languages, use `direction: ltr`.

{% Aside 'caution' %}
Generally, you should favor using the [HTML attribute `dir`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/dir) instead of `direction`. Check out [this StackOverflow discussion](https://stackoverflow.com/a/5375907) for more details.
{% endAside %}

## Change the flow of text
{% BrowserCompat 'css.properties.writing-mode' %}

Use [`writing-mode`](https://developer.mozilla.org/docs/Web/CSS/writing-mode) to change the way text flows and is arranged. The default is `horizontal-tb`, but you can also set `writing-mode` to `vertical-lr` or `vertical-rl` for text that you want to flow horizontally.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'WNEJWoK',
  height: 680
} %}
</figure>

## Change the orientation of text
{% BrowserCompat 'css.properties.text-orientation' %}

Use [`text-orientation`](https://developer.mozilla.org/docs/Web/CSS/text-orientation) to specify the orientation of characters in your text. The valid values for this property are `mixed` and `upright`. This property is only relevant when [`writing-mode`](#writing-mode) is set to something other than `horizontal-tb`.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'QWMrPGV',
  height: 660
} %}
</figure>

## Add a shadow to text
{% BrowserCompat 'css.properties.text-shadow' %}

Use [`text-shadow`](https://developer.mozilla.org/docs/Web/CSS/text-shadow) to add a shadow to your text. This property expects three lengths (`x-offset`, `y-offset`, and `blur-radius`) and a color.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'jOLxRVe',
  height: 530
} %}
</figure>

Check out [the `text-shadow` section of our module on Shadows](/learn/css/shadows/#text-shadow) to learn more.

## Variable fonts

Typically, “normal” fonts require importing different files for different versions of the typeface, e.g. bold, italic, or condensed. Variable fonts are fonts that can contain many different variants of a typeface in one file.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/variable-fonts/roboto-dance.mp4" type="video/mp4">
  </video>
  <figcaption>
    Roboto Flex in random combinations of Width and Weight
  </figcaption>
</figure>

Check out [our article on Variable Fonts](/variable-fonts/) for more details.

## Pseudo-elements

{% Aside 'key-term' %}
A *pseudo-element* is a part of an element that you can target via CSS keywords without having to add more HTML. Check out [our module on pseudo-elements](/learn/css/pseudo-elements) for a deep-dive into this subject!
{% endAside %}

## `::first-letter` and `::first-line` pseudo-elements
{% BrowserCompat 'css.selectors.first-letter' %}

The [`::first-letter`](https://developer.mozilla.org/docs/Web/CSS/::first-letter) and [`::first-line`](https://developer.mozilla.org/docs/Web/CSS/::first-line) pseudo-elements target a text element’s first letter and first line respectively.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'KKvRYNr',
  height: 270
} %}
</figure>

## `::selection` pseudo-element
{% BrowserCompat 'css.selectors.selection' %}

Use the [`::selection`](https://developer.mozilla.org/docs/Web/CSS/::selection) pseudo-element to change the appearance of user-selected text.

When using this pseudo-element, only certain CSS properties can be used: `color`, `background-color`, `text-decoration`, `text-shadow`, `stroke-color`, `fill-color`, `stroke-width`.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'MWvGRbx',
  height: 390,
  tab: 'css,result'
} %}
</figure>

## font-variant
{% BrowserCompat 'css.properties.font-variant' %}

The [`font-variant`](https://developer.mozilla.org/docs/Web/CSS/font-variant) property is a shorthand for a number of CSS properties that let you choose font variants like `small-caps` and `slashed-zero`. The CSS properties this shorthand includes are [`font-variant-alternates`](https://developer.mozilla.org/docs/Web/CSS/font-variant-alternates), [`font-variant-caps`](https://developer.mozilla.org/docs/Web/CSS/font-variant-caps), [`font-variant-east-asian`](https://developer.mozilla.org/docs/Web/CSS/font-variant-east-asian), [`font-variant-ligatures`](https://developer.mozilla.org/docs/Web/CSS/font-variant-ligatures), and [`font-variant-numeric`](https://developer.mozilla.org/docs/Web/CSS/font-variant-numeric). Check out the links on each property for more details about its usage.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'eYEroBa',
  height: 260
} %}
</figure>

{% Assessment 'typography' %}

## Resources

* [Font best practices](/font-best-practices/) discusses importing fonts, rendering fonts, and other best practices for using fonts on the web.
* [MDN Fundamental text and font styling](https://developer.mozilla.org/docs/Learn/CSS/Styling_text/Fundamentals).
