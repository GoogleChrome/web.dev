---
title: CSS `size-adjust` for `@font-face`
subhead: As a web font loads, you can now adjust its scale, to normalize the document font sizes and prevent layout shift when switching between fonts
authors:
  - adamargyle
description: As a web font loads, you can now adjust its scale to normalize the document font sizes and prevent layout shift when switching between fonts
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/fL3dWSY7YBfagFP0ikMW.jpg
alt: Well used letters from a letterpress, set into rows
tags:
  - blog
  - css
date: 2021-06-09
updated: 2022-07-25
---

Consider the following
[demo](https://codepen.io/argyleink/pen/8ace843980e2fd24bf15c8bd1bd072e4?editors=1100)
where the `font-size` is a consistent `64px`, and the only difference between each of these headers is the `font-family`. The examples on the left have not been adjusted and
have an inconsistent final size. The examples on the right use `size-adjust` to
ensure `64px` is the consistent final size.

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/6xhatUhszn7M6pDFcVgV.mp4",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
   In this example Chrome DevTools CSS grid layout debug tools are used to show heights.
  </figcaption>
</figure>

This post explores a [new CSS font-face
descriptor](https://drafts.csswg.org/css-fonts-5/#size-adjust-desc) called
`size-adjust`. It also demonstrates a few ways to correct and normalize font sizes
for smoother user experience, consistent design systems and more predictable
page layout. One important use case is optimizing web font rendering to prevent
[cumulative layout shift](/cls/) (CLS).

{% BrowserCompat 'css.at-rules.font-face.size-adjust' %}

Here's an interactive [demo](https://codepen.io/argyleink/pen/rNyMjxR) of the
problem space. Try changing the typeface with the dropdown and observe:
1. The height differences in the results.
1. Visually jarring content shifts.
1. Moving interactive target areas (the dropdown jumps around!).

{% Codepen {
  user: 'web-dot-dev',
  id: 'WNpzRKd'
} %}

{% Aside 'key-term' %}
Font family vs Typeface: A **typeface** is referred to by
its family name plus its font face. `Helvetica Bold` is referring to the
specific bold typeface while `Helvetica` is generically referring to the entire
family of 8+ typefaces (normal, bold, italic, etc). With CSS `@font-face` you'll be dealing with typefaces, even
though to use them you need to write `font-family`.
{% endAside %}

## How to scale fonts with `size-adjust`

An introduction to the syntax:

```css/2
@font-face {
  font-family: "Adjusted Typeface";
  size-adjust: 150%;
  src: url(some/path/to/typeface.woff2) format('woff2');
}
```

1. Creates a custom typeface named `Adjusted Typeface`.
1. Uses `size-adjust` to scale up each glyph to 150% their default size.
1. Affects only the single imported typeface.

Use the above custom typeface like this:

```css
h1 {
  font-family: "Adjusted Typeface";
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'yLMKgRx'
} %}

{% Aside 'warning' %}
If the second headline in the above demo is not larger than the
first one, your browser does not support `size-adjust`.
{% endAside %}

### Mitigating CLS with seamless font swapping

In the following gif, watch the examples on the left and how there's a shift
when the font is changed. This is just a small example with a single headline
element and the issue is very noticeable.

<figure>
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/6xhatUhszn7M6pDFcVgV.mp4",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    The example on the left has layout shift, the one on the right does not.
  </figcaption>
</figure>

To improve font rendering, a great technique is [font
swapping](/font-display/). Render a quick-loading
system font to show the content first, then swap that with a web font when
the web font finishes loading. This gives you the best of both worlds: the
content is visible as soon as possible, and you get a nicely styled page without
sacrificing your user's time to content. The problem however, is that sometimes
when the web font loads, it shifts the entire page around since it presents at a
slightly different box height size.

<figure>
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/F7CwbZuMHaapGTeXRfSJ.mp4",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    more content equals more potential layout shift when font swaps
  </figcaption>
</figure>

By putting `size-adjust` in the `@font-face` rule, it sets a global glyph
adjustment for the font face. Timing this right will lead to minimal visual
change, a seamless swap. To create a seamless swap, hand adjust or try this
[size-adjust
calculator](https://deploy-preview-15--upbeat-shirley-608546.netlify.app/perfect-ish-font-fallback)
by [Malte Ubl](https://twitter.com/cramforce).

<figure>
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Tw8J2e0ymyGogeA7NJjY.mp4",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    Choose a <a href="https://fonts.google.com/">Google Web Font</a>, get back a pre-adjusted <code>@font-face</code> snippet.
  </figcaption>
</figure>

At the beginning of this post, fixing the font size issue was done by trial and
error. `size-adjust` was nudged in the source code until the same header in
`Cookie` and `Arial` rendered the same `64px` as `Press Start 2P` did naturally.
I aligned two fonts to a target font size.

```css
@font-face {
  font-family: 'Adjusted Arial';
  size-adjust: 86%;
  src: local(Arial);
}

@font-face {
  font-family: 'Cookie';
  size-adjust: 90.25%;
  src: url(...woff2) format('woff2');
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'jOBzyop'
} %}

### Calibrating fonts

You as the author determine the calibration target(s) for normalizing font
scale. You might normalize on Times, Arial, or a system font, then adjust custom
fonts to match. Or, you might adjust local fonts to match what you download.

Strategies for `size-adjust` calibration:
1. **Remote target:**<br>Adjust local fonts towards downloaded fonts.
1. **Local target:**<br>Adjust downloaded fonts towards local target fonts.

#### Example 1: Remote target

Consider the following snippet which adjusts a locally available font to size
match a remote src custom font. A remote custom font is the target for
calibration, a brand font perhaps:

```css/2-3
@font-face {
  font-family: "Adjusted Regular Arial For Brand";
  src: local(Arial);
  size-adjust: 90%;
}

@font-face {
  font-family: "Rad Brand";
  src: url(some/path/to/a.woff2) format('woff2');
}

html {
  font-family: "Rad Brand", "Adjusted Regular Arial For Brand";
}
```

In this example, local font Arial is adjusting in anticipation of a loaded custom font, for a
seamless swap.

This strategy has an advantage of offering designers and developers the same
font for sizing and typography. **The brand is the calibration target.** This is
great news for design systems.

Having a brand typeface as the target is also how Malte's calculator works.
Choose a Google Font and it will calculate how to adjust Arial to seamlessly
swap with it. Here's an example of Roboto CSS from [the
calculator](https://deploy-preview-15--upbeat-shirley-608546.netlify.app/perfect-ish-font-fallback),
where Arial is loaded and named "Roboto-fallback":

```css
@font-face {
    font-family: "Roboto-fallback";
    size-adjust: 100.06%;
    src: local("Arial");
}
```

{% Aside "warning" %}
The order of `font-family` is critical. It's where order
and priority go. Ensure the typeface you want the most, is first. Furthermore,
`local(Arial)` may not be available on all your user's devices, therefore it's
important to provide multiple fallbacks in the font-family.
{% endAside %}

To create a fully cross platform adjustment, see the following example which provides 2 adjusted local fallback fonts in anticipation of a brand font.

```css
@font-face {
    font-family: "Roboto-fallback-1";
    size-adjust: 100.06%;
    src: local("Arial");
}

@font-face {
    font-family: "Roboto-fallback-2";
    size-adjust: 99.94%;
    src: local("Arimo");
}

@font-face {
  font-family: "Roboto Regular";
  src: url(some/path/to/roboto.woff2) format('woff2');
}

html {
  font-family: "Roboto Regular", "Roboto-fallback-1", "Roboto-fallback-2";
}
```

#### Example 2: Local target

Consider the following snippet which adjusts a brand custom font to match Arial:

```css/3
@font-face {
  font-family: "Rad Brand - Adjusted For Arial";
  src: url(some/path/to/a.woff2) format('woff2');
  size-adjust: 110%;
}

html {
  font-family: "Rad Brand - Adjusted For Arial", Arial;
}
```


This strategy has the advantage of rendering without any adjustments, then
adjusting any incoming fonts to match.

## Finer tuning with `ascent-override`, `descent-override` and `line-gap-override`

If generic scaling of glyphs isn't enough adjustment for your design or loading
strategies, here are some finer tuning options that work along with
`size-adjust`. The
[`ascent-override`](https://developer.mozilla.org/docs/Web/CSS/@font-face/ascent-override),
[`descent-override`](https://developer.mozilla.org/docs/Web/CSS/@font-face/descent-override),
and
[`line-gap-override`](https://developer.mozilla.org/docs/Web/CSS/@font-face/line-gap-override)
properties are currently implemented in Chromium 87+, and Firefox 89+.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/R0VZLOdnHUWpAomfMK3g.png",
alt="scissors above and blow the word overrides, demonstrating the areas the
features can trim to", width="800", height="136" %}

### `ascent-override`

{% BrowserCompat 'css.at-rules.font-face.ascent-override' %}

The `ascent-override` descriptor defines the height above the baseline of a
font.

```css/3
@font-face {
  font-family: "Ascent Adjusted Arial Bold";
  src: local(Arial Bold);
  ascent-override: 71%;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'ZEexebZ'
} %}

The red headline (unadjusted) has space above it's capital letter A and O, while
the blue headline has been adjusted so it's [cap
height](https://en.wikipedia.org/wiki/Cap_height) fits snug against the overall
bounding box.

### `descent-override`

{% BrowserCompat 'css.at-rules.font-face.descent-override' %}

The `descent-override` descriptor defines the height below the baseline of the
font.

```css/3
@font-face {
  font-family: "Ascent Adjusted Arial Bold";
  src: local(Arial Bold);
  descent-override: 0%;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'OJpvpNQ'
} %}

The red headline (unadjusted) has space below it's D and O
[baselines](https://en.wikipedia.org/wiki/Baseline_(typography)), while the blue
headline has been adjusted so it's letters rest snug on the baseline.

### `line-gap-override`

{% BrowserCompat 'css.at-rules.font-face.line-gap-override' %}

 The `line-gap-override` descriptor defines the line-gap metric for the font.
 This is the font recommended line-gap or external leading.

```css/3
@font-face {
  font-family: "Line Gap Adjusted Arial";
  src: local(Arial);
  line-gap-override: 50%;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'xxqWqOw'
} %}

The red headline (unadjusted) has no `line-gap-override`, essentially it's at
`0%`, while the blue headline has been adjusted up by 50%, creating space above
and below the letters accordingly.

### Putting it all together

Each of these overrides offer an additional way to trim excess from the web's
safe text bounding box. You can tailor the text box for precise presentation.

{% Codepen {
  user: 'web-dot-dev',
  id: 'poeLebG'
} %}

{% Aside 'warning' %} If any of the above demos aren't showing differences, your
browser does not support the overrides. {% endAside %}

## Conclusion

The `@font-face` `size-adjust` CSS feature is an exciting way to customize the
text bounding box of your web layouts to improve the font swapping experience
thus avoiding layout shift for your users. To learn more, check out these
resources:
- [CSS Fonts Level 5
  Spec](https://drafts.csswg.org/css-fonts-5/#size-adjust-desc)
- [Size Adjust on
  MDN](https://developer.mozilla.org/docs/Web/CSS/@font-face/size-adjust)
- [Seamless swap @font-face
  generator](https://deploy-preview-15--upbeat-shirley-608546.netlify.app/perfect-ish-font-fallback/?font=Montserrat)
- [Cumulative Layout Shift (CLS) on web.dev](/cls/)
- [A New Way To Reduce Font Loading Impact: CSS Font Descriptors
  ](https://www.smashingmagazine.com/2021/05/reduce-font-loading-impact-css-descriptors/)

*Photo by [Kristian Strand](https://unsplash.com/@kristianstrand) on [Unsplash](https://unsplash.com/photos/p8gzCnZf39k)*
