---
title: Improved dark mode default styling with the `color-scheme` CSS property and the corresponding meta tag
subhead: |
  The `color-scheme` CSS property and the corresponding meta tag
  allow developers to opt their pages in to the theme-specific defaults of the user agent stylesheet.
authors:
  - thomassteiner
date: 2020-04-08
updated: 2020-06-16
hero: image/admin/rOe3wxcy28m5DCKcHv7E.jpg
alt: Pigeons on a wall with a sharp black and white contrast in the background.
description: |
  The color-scheme CSS property and the corresponding meta tag
  allow developers to opt their pages in to theme-specific defaults of the user agent stylesheet,
  such as, for example, form controls, scroll bars, as well as CSS system colors.
  At the same time, this feature prevents browsers from applying any transformations on their own.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - css
  - dark-mode
  - dark-theme
  - prefers-color-scheme
  - color-scheme
feedback:
  - api
---
## Background

### The `prefers-color-scheme` user preference media feature

The
[`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
user preference media feature gives developers full control over their pages' appearances.
If you are unfamiliar with it, please read my article
[`prefers-color-scheme`: Hello darkness, my old friend](/prefers-color-scheme/),
where I documented everything I know about creating amazing dark mode experiences.

One puzzle piece that was only mentioned briefly in the article is
the `color-scheme` CSS property and the corresponding meta tag of the same name.
They both make your life as a developer easier
by allowing you to opt your page in to theme-specific defaults of the user agent stylesheet,
such as, for example, form controls, scroll bars, as well as CSS system colors.
At the same time, this feature prevents browsers from applying any transformations on their own.

### The user agent stylesheet

Before I continue, let me briefly describe what a user agent stylesheet is.
Most of the time, you can think of the word *user agent* (UA)
as a fancy way to say *browser*.
The UA stylesheet determines the default look and feel of a page.
As the name suggests, a UA stylesheet is something that depends on the UA in question.
You can have a look at
[Chrome's](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css)
(and Chromium's) UA stylesheet and compare it to
[Firefox's](https://dxr.mozilla.org/mozilla-central/source/layout/style/res/html.css) or
[Safari's](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css) (and WebKit's).
Typically, UA stylesheets agree on the majority of things.
For example, they all make links blue, general text black, and background color white,
but there are also important (and sometimes annoying) differences,
for instance, how they style form controls.

Have a closer look at
[WebKit's UA stylesheet](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)
and what it does regarding dark mode.
(Do a full text search for "dark" in the stylesheet.)
The default provided by the stylesheet changes based on whether dark mode is on or off.
To illustrate this, here is one such CSS rule using the
[`:matches`](https://css-tricks.com/almanac/selectors/m/matches/)
pseudo class and WebKit-internal variables like `-apple-system-control-background`,
as well as the WebKit-internal preprocessor directive `#if defined`:

```css
input,
input:matches([type="password"], [type="search"]) {
  -webkit-appearance: textfield;
  #if defined(HAVE_OS_DARK_MODE_SUPPORT) &&
      HAVE_OS_DARK_MODE_SUPPORT
    color: text;
    background-color: -apple-system-control-background;
  #else
    background-color: white;
  #endif
  /* snip */
}
```

You will notice some non-standard values for the `color` and `background-color` properties above.
Neither `text` nor `-apple-system-control-background` are valid CSS colors.
They are WebKit-internal *semantic* colors.

Turns out, CSS has standardized semantic system colors.
They are specified in
[CSS Color Module Level&nbsp;4](https://drafts.csswg.org/css-color/#css-system-colors).
For example,
[`Canvas`](https://drafts.csswg.org/css-color/#valdef-system-color-canvas)
(not to be confused with the `<canvas>` tag)
is for the background of application content or documents,
whereas
[`CanvasText`](https://drafts.csswg.org/css-color/#valdef-system-color-canvastext)
is for text in application content or documents.
The two go together and should not be used in isolation.

UA stylesheets can use either their own proprietary or the standardized semantic system colors,
to determine how HTML elements should be rendered by default.
If the operating system is set to dark mode or uses a dark theme,
`CanvasText` (or `text`) would be conditionally set to white,
and `Canvas` (or `-apple-system-control-background`) would be set to black.
The UA stylesheet then assigns the following CSS only once, and covers both light and dark mode.

```css
/**
  Not actual UA stylesheet code.
  For illustrative purposes only.
*/
body {
  color: CanvasText;
  background-color: Canvas
}
```

## The `color-scheme` CSS property

The [CSS Color Adjustment Module Level&nbsp;1](https://drafts.csswg.org/css-color-adjust/)
specification introduces a model and controls
over automatic color adjustment by the user agent
with the objective of handling user preferences
such as dark mode, contrast adjustment, or specific desired color schemes.

The [`color-scheme`](https://drafts.csswg.org/css-color-adjust/#color-scheme-prop)
property defined therein allows an element to indicate
which color schemes it is comfortable being rendered with.
These values are negotiated with the user's preferences, resulting in a chosen color scheme
that affects user interface (UI) things such as the default colors of form controls
and scroll bars, as well as the used values of the CSS system colors.
The following values are currently supported:

- *`normal`* Indicates that the element is not aware of color schemes at all,
  and so the element should be rendered with the browser's default color scheme.

- *`[ light | dark ]+`* Indicates that the element is aware of and can handle
  the listed color schemes, and expresses an ordered preference between them.

{% Aside 'note' %}
  Providing both keywords indicates that the first scheme is preferred (by the author),
  but the second is also acceptable if the user prefers it instead.
{% endAside %}

In this list, `light` represents a light color scheme,
with light background colors and dark foreground colors,
whereas `dark` represents the opposite, with dark background colors and light foreground colors.

{% Aside 'warning' %}
  Previously, the specification allowed an additional value `light only`
  that indicated that the element had to be rendered with a light color scheme if possible,
  even if the user's preference is for a different color scheme.
  Authors *should not* use this value, and should instead ensure their page renders well
  with whatever color scheme the user prefers.
{% endAside %}

For all elements, rendering with a color scheme should cause the colors used
in all browser-provided UI for the element to match with the intent of the color scheme.
Examples are scroll bars, spellcheck underlines, form controls, etc.

{% Aside 'note' %}
  The `color-scheme` CSS property can be used on both the `:root` level,
  as well as on an individual per-element level.
{% endAside %}

On the `:root` element, rendering with a color scheme
additionally must affect the surface color of the canvas (that is, the global background color),
the initial value of the `color` property, and the used values of the system colors,
and should also affect the viewport's scroll bars.

```css
/*
  The page supports both dark and light color schemes,
  and the page author prefers dark.
*/
:root {
  color-scheme: dark light;
}
```

## The `color-scheme` meta tag

Honoring the `color-scheme` CSS property requires the CSS to be first downloaded
(if it is referenced via `<link rel="stylesheet">`) and to be parsed.
To aid user agents in rendering the page background with the desired color scheme *immediately*,
a `color-scheme` value can also be provided in a
[`<meta name="color-scheme">`](https://html.spec.whatwg.org/multipage/semantics.html#meta-color-scheme)
element.

```html
<!--
  The page supports both dark and light color schemes,
  and the page author prefers dark.
-->
<meta name="color-scheme" content="dark light">
```

## Combining `color-scheme` and `prefers-color-scheme`

Since both the meta tag and the CSS property (if applied to the `:root` element)
eventually result in the same behavior, I always recommend specifying the color scheme
via the meta tag, so the browser can adopt to the preferred scheme faster.

While for absolute baseline pages no additional CSS rules are necessary,
in the general case you should always combine `color-scheme` with `prefers-color-scheme`.
For example, the proprietary WebKit CSS color `-webkit-link`, used by WebKit and Chrome
for the classic link blue `rgb(0,0,238)`,
has an insufficient contrast ratio of 2.23:1 on a black background and
[fails](https://webaim.org/resources/contrastchecker/?fcolor=0000EE&bcolor=000000)
both the WCAG&nbsp;AA as well as the WCAG&nbsp;AAA
[requirements](https://www.w3.org/WAI/WCAG21/Understanding/conformance#levels).

I have opened bugs for [Chrome](https://crbug.com/1066811),
[WebKit](https://bugs.webkit.org/show_bug.cgi?id=209851), and
[Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1626560)
as well as a [meta issue in the HTML Standard](https://github.com/whatwg/html/issues/5426)
to get this fixed.

## Interplay with `prefers-color-scheme`

The interplay of the `color-scheme` CSS property and the corresponding meta tag
with the `prefers-color-scheme` user preference media feature may seem confusing at first.
In fact, they play together really well.
The most important thing to understand is that `color-scheme`
exclusively determines the default appearance,
whereas `prefers-color-scheme` determines the stylable appearance.
To make this clearer, assume the following page:

```html
<head>
  <meta name="color-scheme" content="dark light">
  <style>
    fieldset {
      background-color: gainsboro;
    }
    @media (prefers-color-scheme: dark) {
      fieldset {
        background-color: darkslategray;
      }
    }
  </style>
</head>
<body>
  <p>
    Lorem ipsum dolor sit amet, legere ancillae ne vis.
  </p>
  <form>
    <fieldset>
      <legend>Lorem ipsum</legend>
      <button type="button">Lorem ipsum</button>
    </fieldset>
  </form>
</body>
```

The inline CSS code on the page
sets the `<fieldset>` element's `background-color` to `gainsboro` in the general case,
and to `darkslategray` if the user prefers a `dark` color scheme
according to the `prefers-color-scheme` user preference media feature.

Via the `<meta name="color-scheme" content="dark light">` element,
the page tells the browser that it supports a dark and a light theme,
with a preference for a dark theme.

Depending on whether the operating system is set to dark or light mode,
the whole page appears light on dark, or vice versa, based on the user agent stylesheet.
There is *no* additional developer-provided CSS involved to change the paragraph text
or the background color of the page.

Note how the `<fieldset>` element's `background-color` changes
based on whether dark mode is enabled, following the rules
in the developer-provided inline stylesheet on the page.
It is either `gainsboro` or `darkslategray`.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kSgOIiGRqjw2PvRlVCaV.png", alt="A page in light mode.", width="800", height="322", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    <strong>Light mode:</strong> Styles specified by the developer and the user agent.
    The text is black and the background is white as per the user agent stylesheet.
    The <code>&lt;fieldset&gt;</code> element's <code>background-color</code> is <code>gainsboro</code>
    as per the inlined developer stylesheet.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qqkHz83kerktbDIGCJeG.png", alt="A page in dark mode.", width="800", height="322", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    <strong>Dark mode:</strong> Styles specified by the developer and the user agent.
    The text is white and the background is black as per the user agent stylesheet.
    The <code>&lt;fieldset&gt;</code> element's <code>background-color</code> is <code>darkslategray</code>
    as per the inlined developer stylesheet.
  </figcaption>
</figure>

The `<button>` element's appearance is controlled by the user agent stylesheet.
Its `color` is set to the
[`ButtonText`](https://drafts.csswg.org/css-color/#valdef-system-color-buttontext)
system color, and its `background-color` and the four `border-color`s are set to the system color
[`ButtonFace`](https://drafts.csswg.org/css-color/#valdef-system-color-buttonface).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lSNFROIe1P94DlhoVtoV.png", alt="A light mode page that uses the ButtonFace property.", width="800", height="322", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    <strong>Light mode:</strong> The <code>background-color</code> and the various
    <code>border-color</code>s are set to the <a href="https://drafts.csswg.org/css-color/#valdef-system-color-buttonface">ButtonFace</a>
    system color.
  </figcaption>
</figure>

Now note how the `<button>` element's `border-color` changes.
The *computed* value for the `border-top-color` and the `border-bottom-color`
switches from `rgba(0, 0, 0, 0.847)` (blackish) to `rgba(255, 255, 255, 0.847)` (whitish),
since the user agent updates `ButtonFace` dynamically based on the color scheme.
The same applies for the `<button>` element's `color`
that is set to the corresponding system color `ButtonText`.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IogmyIzUhokJgnnxUkPi.png", alt="Showing that the computed color values match ButtonFace.", width="800", height="322", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    <strong>Light mode:</strong> The computed values of the <code>border-top-color</code>
    and the <code>border-bottom-color</code> that are both set to <code>ButtonFace</code>
    in the user agent stylesheet are now <code>rgba(0, 0, 0, 0.847)</code>.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3sU1uZyt3zNhEgw3gpZJ.png", alt="Showing that the computed color values still match ButtonFace while in dark mode.", width="800", height="322", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    <strong>Dark mode:</strong> The computed values of the <code>border-top-color</code>
    and the <code>border-bottom-color</code> that are both set to <code>ButtonFace</code>
    in the user agent stylesheet are now <code>rgba(255, 255, 255, 0.847)</code>.
  </figcaption>
</figure>

## Demo

You can see the effects of `color-scheme` applied to a large number of HTML elements
in a [demo on Glitch](https://color-scheme-demo.glitch.me/).
The demo *deliberately* shows the WCAG&nbsp;AA and WCAG&nbsp;AAA
[violation](https://webaim.org/resources/contrastchecker/?fcolor=0000EE&bcolor=000000)
with the link colors mentioned in the
[warning above](#using-color-scheme-in-practice).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bqXapQKcNbyE3uwEOELO.png", alt="The demo while in light mode.", width="800", height="982", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    The <a href="https://color-scheme-demo.glitch.me/">demo</a>
    toggled to <code>color-scheme: light</code>.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9G4hFdtSSwPLOm57zedD.png", alt="The demo while in dark mode.", width="800", height="982", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    The <a href="https://color-scheme-demo.glitch.me/">demo</a>
    toggled to <code>color-scheme: dark</code>.
    Note the WCAG&nbsp;AA and WCAG&nbsp;AAA
    <a href="https://webaim.org/resources/contrastchecker/?fcolor=0000EE&bcolor=000000">
      violation
    </a>
    with the link colors.
  </figcaption>
</figure>

## Acknowledgements

The `color-scheme` CSS property and the corresponding meta tag were implemented by
[Rune Lillesveen](https://github.com/lilles).
Rune is also a co-editor of the CSS Color Adjustment Module Level&nbsp;1 specification.
Hero image by
[Philippe Leone](https://unsplash.com/@philinit?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
on [Unsplash](https://unsplash.com/photos/dbFfEBOCrkU).
