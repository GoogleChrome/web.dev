---
layout: post
title: CSS `accent-color`
subhead: Bring your brand color to built-in HTML form inputs with one line of code.
authors:
  - adamargyle
  - jarhar
description: Bring your brand color to built-in HTML form inputs with one line of code.
date: 2021-08-11
updated: 2022-07-25
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/WOcuCLCwMr0M2lF17bmm.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/huEpiCoJQ6dAo8rHGsZT.png
tags:
  - blog
  - css
---

Today's HTML form elements are [difficult to
customize](https://codepen.io/GeoffreyCrofte/pen/BiHzp). It feels as if it's
a choice between few or no custom styles, or resetting input styles and
build it up from scratch. Building it up from scratch ends up being much more
work than anticipated. It can also lead to forgotten styles for element states
([indeterminate](https://developer.mozilla.org/docs/Web/CSS/:indeterminate),
I'm looking at you), and the loss of built-in accessibility features.
To fully recreate what the browser provides may be more
work than you're looking to take on.

```css
accent-color: hotpink;
```

CSS `accent-color` from the [CSS UI
specification](https://www.w3.org/TR/css-ui-4/#widget-accent) is here to tint
elements with one line of CSS, saving you from customization efforts by
providing a way to bring your brand into elements.

{% BrowserCompat 'css.properties.accent-color' %}

<figure>
  {% Img
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/CfSS3F1XUsfCHIB86xeE.png",
    alt="A light theme screenshot of an accent-color demo where
    checkbox, radio buttons, a range slider and progress element
    are all tinted hotpink.",
    width="800", height="548"
  %}
  <figcaption>
    <a href="https://codepen.io/web-dot-dev/pen/PomBZdy">Demo</a>
  </figcaption>
</figure>

The `accent-color` property also works with
[`color-scheme`](/color-scheme/), allowing authors to tint both
the light and dark elements.
In the following example the user has a dark theme active, the page uses
`color-scheme: light dark`, and uses the same `accent-color: hotpink` for dark
themed hotpink tinted controls.

<figure>
  {% Img
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/3gxeeZoSLY34tsMxkyt9.png",
    alt="A dark theme screenshot of an accent-color demo where
    checkbox, radio buttons, a range slider and progress element
    are all tinted hotpink.",
    width="800", height="548"
  %}
  <figcaption>
    <a href="https://codepen.io/web-dot-dev/pen/PomBZdy">Demo</a>
  </figcaption>
</figure>

## Supported elements

Currently, only four elements will tint via the `accent-color` property:
[checkbox](#checkbox), [radio](#radio), [range](#range) and
[progress](#progress). Each can be previewed here
[https://accent-color.glitch.me](https://accent-color.glitch.me) in light and
dark color schemes.

{% Aside "warning" %}
If the following demo elements are all the same color,
then your browser doesn't support `accent-color` yet.
{% endAside %}

### Checkbox

{% Codepen {
  user: 'web-dot-dev',
  id: 'dyWjGqZ'
} %}

### Radio

{% Codepen {
  user: 'web-dot-dev',
  id: 'WNjKrgB'
} %}

### Range

{% Codepen {
  user: 'web-dot-dev',
  id: 'yLbqeRy'
} %}

### Progress

{% Codepen {
  user: 'web-dot-dev',
  id: 'rNmrxqL'
} %}

## Guaranteeing contrast

To prevent inaccessible elements from existing, browsers with `accent-color`
need to determine an [eligible contrast
color](https://webaim.org/articles/contrast/) to be used alongside the custom
accent. Below is a screenshot demonstrating how Chrome 94 (left) and Firefox 92
Nightly (right) differ in their algorithms:

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/DJhB56n10Eh8O29RsRdE.png",
   alt="A screenshot of Firefox and Chromium side by side,
  rendering a full spectrum of checkboxes in various hues and darknesses.",
  width="800", height="832"
%}

The most important thing to take away from this, is to **trust the browser**.
Provide a brand color, and trust that it will make smart decisions for you.

{% Aside %}
The browser will not change your color in a dark theme.
{% endAside %}

## Extra: More tinting

You may be wondering how to tint more than these four form elements? Here's a
minimal sandbox which tints:
- the focus ring
- text selection highlights
- list [markers](/css-marker-pseudo-element/)
- arrow indicators (Webkit only)
- scrollbar thumb (Firefox only)

```css
html {
  --brand: hotpink;
  scrollbar-color: hotpink Canvas;
}

:root { accent-color: var(--brand); }
:focus-visible { outline-color: var(--brand); }
::selection { background-color: var(--brand); }
::marker { color: var(--brand); }

:is(
  ::-webkit-calendar-picker-indicator,
  ::-webkit-clear-button,
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button
) {
  color: var(--brand);
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'RwVBreJ'
} %}

### Potential future

The spec does not limit the application of `accent-color` to the four elements
shown in this article, more support could be added later. Elements like the
selected `<option>` in a `<select>` could be highlighted with the
`accent-color`.

What else do you like to tint on the web? Tweet
[@argyleink](https://twitter.com/argyleink) with your selector and it might get
added to this article!
