---
layout: post
title: State of CSS 2022
subhead: Web styling features of today and tomorrow, as seen at Google IO 2022, plus some extras.
authors:
  - adamargyle
description: Web styling features of today and tomorrow, as seen at Google IO 2022, plus some extras.
date: 2022-05-11
updated: 2022-05-12
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/iOfuipzyniP6aec4cOss.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/uT454OnumDCJbV0PWmvu.png
alt: Colorful lettering using a Colr Font saying State of CSS 2022
tags:
  - blog
  - css
  - html
---

The year 2022 is set to be one of CSS's greatest years, in both features and
cooperative browser feature releases, with a collaborative goal to implement 14
features!

{% Aside %}
  Watch the talk [The State of CSS](https://www.youtube.com/watch?v=Xy9ZXRRgpLk) from Google I/O '22:
  {% YouTube "Xy9ZXRRgpLk" %}
{% endAside %}

## Overview

This post is the article form of [the talk](https://www.youtube.com/watch?v=Xy9ZXRRgpLk) given at Google IO 2022. It's not
meant to be an in-depth guide on each feature, rather an introduction and brief
overview to pique your interest, providing breadth instead of depth. If your
interest is piqued, check the end of a section for resource links to more information.

### Table of contents

Use the list below to jump to topics of interest:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th><b>Fresh in 2022</b></th>
        <th><b>2022 and beyond</b></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="#browser-compatibility">2022 Browser compatibility</a>
        </td>
        <td>
          <a href="#scoping-styles-is-really-hard">@scope</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#cascade-layers">@layer</a>
        </td>
        <td>
          <a href="#nesting-selectors-is-so-nice">@nest</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#subgrid">subgrid</a>
        </td>
        <td>
          <a href="#css-can't-help-users-reduce-data">@media (prefers-reduced-data)</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#container-queries">@container</a>
        </td>
        <td>
          <a href="#no-media-query-variables">@custom-media</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#hwb()">hwb()</a>
        </td>
        <td>
          <a href="#was-in-min-width-or-max-width">Media query ranges</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#color-spaces">lch, oklch, lab, oklab, display-p3, etc</a>
        </td>
        <td>
          <a href="#loosely-typed-custom-properties">@property</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#color-mix()">color-mix()</a>
        </td>
        <td>
          <a href="#scroll-start">scroll-start</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#color-contrast()">color-contrast()</a>
        </td>
        <td>
          <a href="#:snap-target">:snap-target</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#relative-color-syntax">Relative color syntax</a>
        </td>
        <td>
          <a href="#snapchanging()">snapChanging() and snapChanged()</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#gradient-color-spaces">Gradient color spaces</a>
        </td>
        <td>
          <a href="#cycling-between-known-states">toggle()</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#accent-color">accent-color</a>
        </td>
        <td>
          <a href="#anchoring-an-element-to-another">anchor()</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#inert">inert</a>
        </td>
        <td>
          <a href="#customizing-select-elements">&#60;selectmenu&#62;</a>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#colrv1-fonts">Color fonts v1</a>
        </td>
        <td></td>
      </tr>
      <tr>
        <td>
          <a href="#viewport-units">Viewport unit variants</a>
        </td>
        <td></td>
      </tr>
      <tr>
        <td>
          <a href="#:has()">:has()</a>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

## Browser compatibility

A primary reason so many CSS features are set to cooperatively release is due to
the efforts of [Interop 2022](/interop-2022/). Before studying
the Interop efforts, it's important to look at [Compat
2021](/compat2021/)’s efforts.

### Compat 2021

The goals for 2021, driven by developer feedback via surveys, were to stabilize
current features, improve the test suite and increase passing scores of browsers
for five features:

1. `sticky` positioning
1. `aspect-ratio` sizing
1. `flex` layout
1. `grid` layout
1. `transform` positioning and animation

Test scores were raised across the board, demonstrating upgraded stability and
reliability. Big congratulations to the teams here!

### Interop 2022

This year, browsers met together to discuss the features and priorities they
intended to work on, uniting their efforts. They planned to deliver the
following web features for developers:

1. `@layer`
1. Color spaces and functions
1. Containment
1. `<dialog>`
1. Form compatibility
1. Scrolling
1. Subgrid
1. Typography
1. Viewport units
1. Web compat

This is an exciting and ambitious list that I can't wait to see unfold.

## Fresh for 2022

Unsurprisingly, the state of CSS 2022 is dramatically impacted by the Interop
2022 work.

### Cascade layers

{% BrowserCompat 'css.at-rules.layer' %}

Before `@layer`, the discovered order of loaded stylesheets was very important,
as styles loaded last can overwrite previously loaded styles. This led to
meticulously managed entry stylesheets, where developers needed to load less
important styles first and more important styles later. Entire methodologies
exist to assist developers in managing this importance, such as
[ITCSS](https://www.youtube.com/watch?v=1OKZOV-iLj4).

With `@layer`, the entry file can pre-define layers, and their order, ahead of
time. Then, as styles load, are loaded or defined, they can be placed within a
layer, allowing a preservation of style override importance but without the
meticulously managed loading orchestration.

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/MQJ5WhdqY78qTwIU2Bt6.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}

The video shows how the defined cascade layers allow for a more liberated and
freestyle authoring and loading process, while still maintaining the cascade as
needed.

Chrome DevTools is helpful for visualizing which styles are coming from which
layers:

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/17n44fLAbpo0wd6O6Gae.png",
  alt="Screenshot of the Styles sidebar of Chrome Devtools, highlighting how styles appear within new Layer groups.",
  width="771",
  height="689"
%}

#### Resources

- [CSS Cascade 5 specification](https://www.w3.org/TR/css-cascade-5/#layering)
- [Cascade layers explainer](https://css.oddbird.net/layers/explainer/)
- [Cascade layers on MDN](https://developer.mozilla.org/docs/Web/CSS/@layer)
- [Una Kravets](https://twitter.com/Una): [Cascade
  Layers](https://developer.chrome.com/blog/cascade-layers/)
- [Ahmad Shadeed](https://twitter.com/shadeed9): [Hello, CSS Cascade
  Layers](https://ishadeed.com/article/cascade-layers/)

### Subgrid

{% BrowserCompat 'css.properties.grid-template-rows.subgrid' %}

Before `subgrid`, a grid inside of another grid couldn't align itself to its
parent cells or grid lines. Each grid layout was unique. Many designers place a
single grid over their whole design and constantly align items within it, which
couldn't be done in CSS.

After `subgrid`, a child of a grid can adopt its parents’ columns or rows as its
own, and align itself or children to them!

In the following demo, the body element creates a classic grid of three columns:
the middle column is called `main`, and the left and right columns [name their
lines](https://rachelandrew.co.uk/archives/2017/06/01/breaking-out-with-css-grid-explained)
`fullbleed`. Then, each element in the body, `<nav>` and `<main>`, adopts the
named lines from body by setting `grid-template-columns: subgrid`.

```css
​​body {
  display: grid;
  grid-template-columns:
    [fullbleed-start]
    auto [main-start] min(90%, 60ch) [main-end] auto
    [fullbleed-end]
  ;
}

body > * {
  display: grid;
  grid-template-columns: subgrid;
}
```

Lastly, children of `<nav>` or `<main>` can align or size themselves using the
`fullbleed` and `main` columns and lines.

```css
.main-content {
  grid-column: main;
}

.fullbleed {
  grid-column: fullbleed;
}
```

{% Codepen {
 user: 'web-dot-dev',
 id: 'JjMQzVV',
 tab: 'result'
} %}

Devtools can help you see the lines and subgrids (Firefox only at the moment).
In the following image, the parent grid and subgrids have been overlaid. It now
resembles how designers were thinking about the layout.

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/9V3fShGvncWBFIkfetY3.png",
  alt="Screenshot of a subgrid demo, using the Chrome Devtools grid overlay tooling to show the lines defined by CSS.",
  width="800",
  height="765"
%}

In the elements panel of devtools you can see which elements are grids and
subgrids, which is very helpful for debugging or validating layout.

<figure data-size="full">
  {% Img
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/2kDFaCapNPGWL2a8XCwI.png",
    alt="Screenshot of the Chrome Devtools Elements panel labelling which elements have grid or subgrid layouts.",
    width="800",
    height="509"
  %}
  <figcaption>
    Screenshot from Firefox Devtools
  </figcaption>
</figure>

#### Resources

- [Subgrid specification](https://www.w3.org/TR/css-grid-2/#subgrids)
- [Subgrid on MDN](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Subgrid)
- [Bramus](https://twitter.com/bramus): [Practical CSS Subgrid Video
  Tutorials](https://www.bram.us/2021/11/04/practical-css-subgrid-video-tutorials/)

### Container queries

{% BrowserCompat 'css.at-rules.container' %}

Before `@container`, elements of a webpage could only respond to the size of the
whole viewport. This is great for macro layouts, but for micro layouts, where
their outer container isn't the whole viewport, it's impossible for the layout
to adjust accordingly.

After `@container`, elements can respond to a parent container size or style!
The only caveat is the containers must declare themselves as possible query
targets, which is a small requirement for a large benefit.

```css
/* establish a container */
.day {
  container-type: inline-size;
  container-name: calendar-day;
}
```

These styles are what make the Mon, Tues, Wed, Thurs, and Fri columns in the
following video able to be queried by the event elements.

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/XihhgjHu2BuxrxctmPvd.mp4",
    autoplay="true",
    loop="true",
    muted="true",
    class="adjusted-aspect-ratio"
  %}
  <figcaption>
    <a href="https://codepen.io/una/pen/RwodQZw">Demo</a>
    by <a href="https://twitter.com/Una">Una Kravets</a>
  </figcaption>
</figure>

Here is the CSS for querying the `calendar-day` container for its size, then
adjusting a layout and font sizes:

```css
@container calendar-day (max-width: 200px) {
  .date {
    display: block;
  }

  .date-num {
    font-size: 2.5rem;
    display: block;
  }
}
```

Here's another example: one book component adapts itself to the space available
in the column that it's dragged to:

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/tkapAWihYLshmp4w7Dcp.mp4",
    autoplay="true",
    loop="true",
    muted="true",
    class="adjusted-aspect-ratio"
  %}
  <figcaption>
    <a href="https://codepen.io/mxbck/full/XWMrMOp">Demo</a>
    by <a href="https://twitter.com/mxbck">Max Böck</a>
  </figcaption>
</figure>

Una is correct in assessing the situation as [the new
responsive](/new-responsive/#responsive-to-the-container). There
are many exciting and meaningful design decisions to make when using
`@container`.

#### Resources

- [Container Queries specification](https://www.w3.org/TR/css-contain-3/#container-queries)
- [Container Queries explainer](https://css.oddbird.net/rwd/query/explainer/)
- [Container Queries on MDN](https://developer.mozilla.org/docs/Web/CSS/CSS_Container_Queries)
- [The new responsive on web.dev](/new-responsive/#responsive-to-the-container)
- [Calendar demo by Una](https://codepen.io/una/pen/RwodQZw)
- [Awesome container queries collection](https://github.com/sturobson/Awesome-Container-Queries)
- [How we built Designcember on web.dev](/how-we-built-designcember/)
- [Ahmad Shadeed](https://twitter.com/shadeed9): [Say Hello To CSS
  Container
  Queries](https://ishadeed.com/article/say-hello-to-css-container-queries/)

### `accent-color`

{% BrowserCompat 'css.properties.accent-color' %}

Before `accent-color`, when you wanted a form with brand matching colors, you
could end up with complex libraries or CSS solutions that became hard to manage
over time. While they gave you all the options, and hopefully included
accessibility, the choice to use the built-in components or adopt your own
becomes tedious to continue to choose.

After `accent-color`, one line of CSS brings a brand color to the built-in
components. In addition to a tint, the browser intelligently chooses proper
contrasting colors for ancillary parts of the component and adapts to system
color schemes (light or dark).

```css
/* tint everything */
:root {
  accent-color: hotpink;
}

/* tint one element */
progress {
  accent-color: indigo;
}
```

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/s0P0uAcTQiyQpwKGwLiA.png",
  alt="Light and dark accented HTML elements side by side for comparison.",
  width="800",
  height="348"
%}

To learn more about `accent-color`, [check out my post on
web.dev](/accent-color/) where I explore many more aspects of
this useful CSS property.

#### Resources

- [accent-color specification](https://www.w3.org/TR/css-ui-4/#widget-accent)
- [accent-color on MDN](https://developer.mozilla.org/docs/Web/CSS/accent-color)
- [accent-color on web.dev](/accent-color/)
- [Bramus](https://twitter.com/bramus): [Tint User-Interface Controls with CSS
  accent-color](https://www.bram.us/2021/08/23/tint-user-interface-controls-with-css-accent-color/)

### Color level 4 and 5

The web has been dominated by sRGB for the past decades, but in an expanding
digital world of high-definition displays and mobile devices pre-equipped with
OLED or QLED screens, sRGB is not enough. Furthermore, dynamic pages that adapt
to user preferences are expected, and color management has been a growing
concern for designers, design systems, and code maintainers.

Not in 2022 though—CSS has a number of new color functions and spaces:
- Colors that reach into the HD color capabilities of displays.
- Color spaces that match an intent, such as perceptual uniformity.
- Color spaces for gradients that drastically change the interpolation outcomes.
- Color functions to help you mix and contrast, and choose which space you do
  the work in.

Before all these color features, design systems needed to precalculate proper
contrasting colors, and ensure appropriately vibrant palettes, all while
preprocessors or JavaScript did the heavy lifting.

After all these color features, the browser and CSS can do all the work,
dynamically and just in time. Instead of sending many KBs of CSS and JavaScript
to users to enable theming and data visualization colors, CSS can do the
orchestrating and calculations. CSS is also better equipped to check for support
before usage or handle fallbacks gracefully.

```css
@media (dynamic-range: high) {
  .neon-pink {
    --neon-glow: color(display-p3 1 0 1);
  }
}

@supports (color: lab(0% 0 0)) {
  .neon-pink {
    --neon-glow: lab(150% 160 0);
  }
}
```

#### `hwb()`

{% BrowserCompat 'css.types.color.hwb' %}

HWB stands for hue, whiteness, and blackness. It presents itself as a
human-friendly way of articulating color, as it's just a hue and an amount of
white or black to lighten or darken. Artists who mix colors with white or black
may find themselves appreciating this color syntax addition.

{% Codepen {
 user: 'web-dot-dev',
 id: 'KKZdeep',
 height: 500,
 tab: 'css,result'
} %}

Using this color function results in colors from the sRGB color space, the same
as HSL and RGB. In terms of newness for 2022, this doesn’t give you new colors,
but it may make some tasks easier for fans of the syntax and mental model.

##### Resources

- [HWB specification](https://www.w3.org/TR/css-color-4/#the-hwb-notation)
- [HWB on MDN](https://developer.mozilla.org/docs/Web/CSS/color_value/hwb())
- [Stefan Judis](https://twitter.com/stefanjudis/): [hwb() – a color notation for
  humans?](https://www.stefanjudis.com/blog/hwb-a-color-notation-for-humans/)

#### Color spaces

The way colors are represented is done with a color space. Each color space
offers various features and trade-offs for working with color. Some may pack all
the bright colors together; some may line them up first based on their
lightness.

2022 CSS is set to offer 10 new color spaces, each with unique features to
assist designers and developers in displaying, picking, and mixing colors.
Previously, sRGB was the only option for working with color, but now CSS unlocks
new potential and a new default color space, LCH.

#### `color-mix()`

{% BrowserCompat 'css.types.color.color-mix' %}

Before `color-mix()`, developers and designers needed preprocessors like
[Sass](https://sass-lang.com/) to mix the colors before the browser saw them.
Most color-mixing functions also didn't provide the option to specify which
color space to do the mixing in, sometimes resulting in confusing results.

After `color-mix()`, developers and designers can mix colors in the browser,
alongside all their other styles, without running build processes or including
JavaScript. Additionally, they can specify which color space to do the mixing
in, or use the default mixing color space of LCH.

Often, a brand color is used as a base and variants are created from it, such as
lighter or darker colors for hover styles. Here's what that looks like with
`color-mix()`:

```css
.color-mix-example {
  --brand: #0af;

  --darker: color-mix(var(--brand) 25%, black);
  --lighter: color-mix(var(--brand) 25%, white);
}
```

and if you wanted to mix those colors in a different color space, like srgb,
change it:

```css
.color-mix-example {
  --brand: #0af;

  --darker: color-mix(in srgb, var(--brand) 25%, black);
  --lighter: color-mix(in srgb, var(--brand) 25%, white);
}
```

Here follows a theming demo using `color-mix()`. Try changing the brand color
and watch the theme update:

{% Codepen {
 user: 'web-dot-dev',
 id: 'yLpYqVb',
 height: 500,
 tab: 'css,result'
} %}

Enjoy mixing colors in various color spaces in your stylesheets in 2022!

##### Resources

- [color-mix() specification](https://www.w3.org/TR/css-color-5/#color-mix)
- [color-mix() on MDN](https://developer.mozilla.org/docs/Web/CSS/color_value/color-mix())
- [Theming demo](https://codepen.io/argyleink/pen/WNoWadG)
- [Another theming demo](https://codepen.io/argyleink/pen/YzZQYMq)
- [Fabio Giolito](https://twitter.com/fabiogiolito): [Create a color theme with
  these upcoming CSS
  features](https://dev.to/fabiogiolito/create-a-color-theme-with-these-upcoming-css-features-4o83)

#### `color-contrast()`

{% BrowserCompat 'css.types.color.color-contrast' %}

Before `color-contrast()`, stylesheet authors needed to know accessible colors
ahead of time. Often a palette would show black or white text on a color swatch,
to indicate to a user of the color system which text color would be needed to
properly contrast with that swatch.

<figure data-size="full">
  {% Img
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/DZbWoSszQOrV0ts5oSu7.png",
    alt="Screenshot of 3 Material palettes, showing 14 colors and their appropriate white or black contrast colors for text.",
    width="760",
    height="632"
  %}
  <figcaption>
    Example from <a href="https://material.io/design/color/the-color-system.html#tools-for-picking-colors">2014 Material Design color palettes</a>
  </figcaption>
</figure>

After `color-contrast()`, stylesheet authors can offload the task entirely to
the browser. Not only can you employ the browser to automatically pick a black
or white color, you can give it a list of design system appropriate colors and
have it pick the first to pass your desired contrast ratio.

Here's a screenshot of an [HWB color palette set
demo](https://codepen.io/web-dot-dev/pen/qBpzwZW) where the text colors are
automatically chosen by the browser based on the swatch color:

<figure data-size="full">
  {% Img
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/LvVQghfnQr2aEXmLUnn4.png",
    alt="Screenshot of the HWB demo where each palette has a different pairing of light or dark text, as determined by the browser.",
    width="800",
    height="394"
  %}
  <figcaption>
    Try the <a href="https://codepen.io/web-dot-dev/pen/qBpzwZW">demo</a>
  </figcaption>
</figure>

The basics of the syntax look like this, where gray is passed to the function
and the browser determines if black or white have the most contrast:

```css
color: color-contrast(gray);
```

The function can also be customized with a list of colors, from which it will
pick the highest contrasting color from the selection:

```css
color: color-contrast(gray vs indigo, rebeccapurple, hotpink);
```

Lastly, in case it's preferable not to pick the highest contrasting color from
the list, a target contrast ratio can be provided, and the first color to pass
it is chosen:

```css
color: color-contrast(
  var(--bg-blue-1)
  vs
  var(--text-lightest), var(--text-light), var(--text-subdued)
  to AA /* 4.5 could also be passed */
);
```

This function can be used for more than just text color, though I estimate that
will be its primary use case. Think about how much easier it will be to deliver
accessible and legible interfaces once the choosing of proper contrasting colors
is built into the CSS language itself.

##### Resources

- [color-contrast()
  specification](https://www.w3.org/TR/css-color-5/#colorcontrast)
- [color-contrast() on
  MDN](https://developer.mozilla.org/docs/Web/CSS/color_value/color-contrast())
- [Demo](https://codepen.io/web-dot-dev/pen/qBpzwZW)

#### Relative color syntax

{% BrowserCompat 'css.types.color.color' %}

Before relative color syntax, to compute on color and make adjustments, the
color channels needed to be individually placed into custom properties. This
limitation also made HSL the primary color function for manipulating colors
because the hue, saturation, or lightness could all be adjusted in a
straightforward way with `calc()`.

After relative color syntax, any color in any space can be deconstructed,
modified, and returned as a color, all in one line of CSS. No more limitations
to HSL—manipulations can be done in any color space desired, and many less
custom properties need to be created to facilitate it.

In the following syntax example, a base hex is provided and two new colors are
created relative to it. The first color `--absolute-change` creates a new color
in LCH from the base color, then proceeds to replace the base color’s lightness
with `75%`, maintaining the chroma (`c`) and hue (`h`). The second color
`--relative-change` creates a new color in LCH from the base color, but this
time reduces the chroma (`c`) by 20%.

```css
.relative-color-syntax {
  --color: #0af;
  --absolute-change: lch(from var(--color) 75% c h);
  --relative-change: lch(from var(--color) l calc(c-20%) h);
}
```

It's akin to mixing colors, but it's more similar to alterations than it is
mixing. You get to cast a color from another color, getting access to the three
channel values as named by the color function used, with an opportunity to
adjust those channels. All in all, this is a very cool and powerful syntax for
color.

In the following demo I've used relative color syntax to create lighter and
darker variants of a base color, and used `color-contrast()` to ensure the
labels have proper contrast:

<figure data-size="full">
  {% Img
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/lwCQAQJ3qc80Ap96Bn1J.png",
    alt="Screenshot with 3 columns, each column is either darker or lighter than the center column.",
    width="800",
    height="449"
  %}
  <figcaption>
    Try the <a href="https://codepen.io/web-dot-dev/pen/dyJBLWG">demo</a>
  </figcaption>
</figure>

This function can also be used for color palette generation. Here is a demo
where entire palettes are generated off a provided base color. This one set of
CSS powers all the various palettes, each palette simply provides a different
base. As a bonus, since I've used LCH, look at how perceptually even the
palettes are—no hot or dead spots to be seen, thanks to this color space.

```css
:root {
  --_color-base: #339af0;

  --color-0:  lch(from var(--_color-base) 98% 10 h);
  --color-1:  lch(from var(--_color-base) 93% 20 h);
  --color-2:  lch(from var(--_color-base) 85% 40 h);
  --color-3:  lch(from var(--_color-base) 75% 46 h);
  --color-4:  lch(from var(--_color-base) 66% 51 h);
  --color-5:  lch(from var(--_color-base) 61% 52 h);
  --color-6:  lch(from var(--_color-base) 55% 57 h);
  --color-7:  lch(from var(--_color-base) 49% 58 h);
  --color-8:  lch(from var(--_color-base) 43% 55 h);
  --color-9:  lch(from var(--_color-base) 39% 52 h);
  --color-10: lch(from var(--_color-base) 32% 48 h);
  --color-11: lch(from var(--_color-base) 25% 45 h);
  --color-12: lch(from var(--_color-base) 17% 40 h);
  --color-13: lch(from var(--_color-base) 10% 30 h);
  --color-14: lch(from var(--_color-base) 5% 20 h);
  --color-15: lch(from var(--_color-base) 1% 5 h);
}
```

<figure data-size="full">
  {% Img
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/crmXDxirpYLGCl1jutSW.png",
    alt="Screenshot of 15 palettes all generated dynamically by CSS.",
    width="800",
    height="433"
  %}
  <figcaption>
    Try the <a href="https://codepen.io/web-dot-dev/pen/dyJBLWG">demo</a>
  </figcaption>
</figure>

Hopefully by now you can see how color spaces and different color functions can
all be used for different purposes, based on their strengths and weaknesses.

##### Resources

- [Relative color syntax
  specification](https://www.w3.org/TR/css-color-5/#relative-color-function)
- [Building color palettes with relative color
  syntax](https://codepen.io/web-dot-dev/pen/GRybLvm)
- [Building color variants with relative color
  syntax](https://codepen.io/web-dot-dev/pen/dyJBLWG)

#### Gradient color spaces

Before gradient color spaces, sRGB was the default color space used. sRGB is
generally reliable, but does have some weaknesses like the [gray dead
zone](https://css-tricks.com/the-gray-dead-zone-of-gradients/).

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/9mFuKPk1iIt47F9Z08An.png",
  alt="4 gradients in a grid, all from cyan to deeppink. LCH and LAB have more consistent vibrancy, where sRGB goes a bit desaturated in the middle.",
  width="800",
  height="430"
%}

After gradient color spaces, tell the browser which color space to use for the
color interpolation. This gives developers and designers the ability to choose
the gradient they prefer. The default color space also changes to LCH instead of
sRGB.

The syntax addition goes after the gradient direction, uses the new `in` syntax,
and is optional:

```css
background-image: linear-gradient(
  to right in hsl,
  black, white
);

background-image: linear-gradient(
  to right in lch,
  black, white
);
```

Here's a basic and essential gradient from black to white. Look at the range of
results in each color space. Some reach dark black earlier than others, some
fade to white too late.

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/LJXw2oaCcDOY8XIlgNa5.png",
  alt="11 color spaces shown comparing black to white.",
  width="800",
  height="1157"
%}

In this next example, black is transitioned to blue because it's a known problem
space for gradients. Most color spaces creep into purple during color
interpolation or, as I like to think of it, as colors travel inside their color
space from point A to point B. Since the gradient will take a straight line from
point A to point B, the shape of the color space drastically changes the stops
that the path takes along the way.

{% Aside %}
`okLCH` and `okLAB` are specialized color spaces that account for various drifts,
like this one into purple, making them especially accurate for gradients.
{% endAside %}

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/lIQwuIMIe58R76IOhnRS.png",
  alt="11 color spaces shown comparing blue to black.",
  width="800",
  height="1160"
%}

For more deep explorations, examples and comments, read [this Twitter
thread](https://twitter.com/argyleink/status/1490376117064065025?s=20&t=r1JAaqTwoeEitkVmUhTw0Q).

##### Resources

- [Gradient interpolation
  specification](https://drafts.csswg.org/css-images-4/#linear-gradients)
- [Demo comparing gradients in spaces](https://codepen.io/argyleink/pen/OJObWEW)
- [Observable notebook comparing
  gradients](https://observablehq.com/@argyleink/colorjs-notebook-fade-to-white)

### `inert`

{% BrowserCompat 'api.HTMLElement.inert' %}

Before `inert`, it was good practice to guide the user's focus to areas of the
page or app that needed immediate attention. This guided focus strategy became
known as focus trapping because developers would place focus into an interactive
space, listen for focus change events and, if the focus left the interactive
space, then it was forced back in. Users on keyboards or screen readers are
guided back to the interactive space to ensure the task is complete before
moving on.

After `inert`, no trapping is required because you can freeze or guard entire
sections of the page or app. Clicks and focus change attempts are just simply
not available while those parts of a document are inert. One could also think of
this like guards instead of a trap, where `inert` is not interested in making
you stay somewhere, rather making other places unavailable.

A good example of this is the JavaScript `alert()` function:

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/gjWn8LZ22HdGX8pGZgwv.mp4",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    Website is shown as interactive, then an alert() is called, and the page is no longer active.
  </figcaption>
</figure>

Notice in the preceding video how the page was mouse and keyboard accessible
until an `alert()` was called. Once the alert dialog popup was shown, the rest
of the page was frozen, or `inert`. Users’ focus is placed inside the alert
dialog and has nowhere else to go. Once the user interacts and completes the
alert function request, the page is interactive again. `inert` empowers
developers to achieve this same guided focus experience with ease.

Here's a small code sample to show how it works:

```css/7
<body>
  <div class="modal">
    <h2>Modal Title</h2>
    <p>...<p>
    <button>Save</button>
    <button>Discard</button>
  </div>
  <main inert>
    <!-- cannot be keyboard focused or clicked -->
  </main>
</body>
```

A dialog is a great example, but `inert` is also helpful for things such as the
slide-out side menu user experience. When a user slides out the side menu, it's
not OK to let the mouse or keyboard interact with the page behind it; that's a
bit tricky for users. Instead, when the side menu is showing, make the page
inert, and now users must close or navigate within that side menu, and won't
ever find themselves lost somewhere else in the page with an open menu.

#### Resources

- [Inert
  specification](https://html.spec.whatwg.org/multipage/interaction.html#inert)
- [Inert on MDN](https://developer.mozilla.org/docs/Web/API/HTMLElement/inert)
- [Chrome Developers: Introducing
  inert](https://developer.chrome.com/blog/inert/)

### COLRv1 Fonts

Before COLRv1 fonts, the web had
[OT-SVG](https://helpx.adobe.com/fonts/using/ot-svg-color-fonts.html) fonts,
also an open format for fonts with gradients and built-in colors and effects.
These could grow very large though, and while they allowed editing the text,
there wasn't much scope for customization.

After [COLRv1](https://developer.chrome.com/blog/colrv1-fonts/) fonts, the web
has smaller footprint, vector-scalable, repositionable, gradient-featuring, and
blend-mode powered fonts that accept parameters to customize the font per use
case or to match a brand.

<figure data-size="full">
  {% Img
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/vnSKm0j2gzr0uFfticVT.png",
    alt="Comparison visualization and bar chart, showing how COLRv1 fonts are sharper and smaller.",
    width="800",
    height="240"
  %}
  <figcaption>
    Image sourced from <a href="https://developer.chrome.com/blog/colrv1-fonts/">https://developer.chrome.com/blog/colrv1-fonts/</a>
  </figcaption>
</figure>

Here's an example from the Chrome Developer blog post about emojis. Maybe you've
noticed that if you scale up the font size on an emoji, it doesn't stay sharp.
It's an image and not vector art. Often in applications when an emoji is used,
it's swapped out for a higher quality asset. With COLRv1 fonts, the emojis are
vector and beautiful:

{% Glitch {
  id: 'colrv1-emoji-grid'
} %}

Icon fonts could do some amazing things with this format, offering custom
duo-tone color palettes, and more. Loading a COLRv1 font is just like any other
font file:

```css
@import url(https://fonts.googleapis.com/css2?family=Bungee+Spice);
```

Customizing the COLRv1 font is done with `@font-palette-values`, a special CSS
at-rule for grouping and naming a set of customization options into a bundle for
later reference. Notice how you specify a custom name just like a custom
property, starting with `--`:

```css/2-6
@import url(https://fonts.googleapis.com/css2?family=Bungee+Spice);

@font-palette-values --colorized {
  font-family: "Bungee Spice";
  base-palette: 0;
  override-colors: 0 hotpink, 1 cyan, 2 white;
}
```

With `--colorized` as an alias for the customizations, the last step is to apply
the palette to an element that is using the color font family:

```css/8-11
@import url(https://fonts.googleapis.com/css2?family=Bungee+Spice);

@font-palette-values --colorized {
  font-family: "Bungee Spice";
  base-palette: 0;
  override-colors: 0 hotpink, 1 cyan, 2 white;
}

.spicy {
  font-family: "Bungee Spice";
  font-palette: --colorized;
}
```

<figure data-size="full">
  {% Img
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/nccC2TpW80F5xXfLF6hq.png",
    alt="Screenshot of the Bungee Spice font with the word DUNE.",
    width="564",
    height="169"
  %}
  <figcaption>
    Bungee Spice font shown with custom colors, source from <a href="https://developer.chrome.com/blog/colrv1-fonts/">https://developer.chrome.com/blog/colrv1-fonts/</a>
  </figcaption>
</figure>

With more and more variable fonts and color fonts becoming available, web
typography is on a very magnificent path towards rich customization and creative
expression.

#### Resources

- [Colrv1 specification on
  Github](https://github.com/googlefonts/colr-gradients-spec)
- [Chrome Developers: Colrv1
  Fonts](https://developer.chrome.com/blog/colrv1-fonts/)
- [BlinkOn developer explainer
  video](https://www.youtube.com/watch?v=BmqYm5Wwz8M)

### Viewport units

{% BrowserCompat 'css.types.length.dvh' %}

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/jE6JZPgLnHO8HQWtfgNE.png",
  alt="Graphic showing how the device screen and the browser window and an iframe, all have different viewports.",
  width="800",
  height="501"
%}

Before the new viewport variants, the web offered physical units to assist in
fitting viewports. There was one for height, width, smallest size (vmin), and
largest side (vmax). These worked well for many things, but mobile browsers
introduced a complexity.

On mobile, when loading a page, the status bar with the url is shown, and this
bar consumes some of the viewport space. After a few seconds and some
interactivity, the status bar may slide away to allow a bigger viewport
experience for the user. But when that bar slides out, the viewport height has
changed, and any `vh` units would shift and resize as their target size changed.
In later years, the `vh` unit specifically needed to decide which of the two
viewport sizes it was going to use, because it was causing jarring visual layout
issues on mobile devices. It was determined that the `vh` would always represent
the largest viewport.

```css
.original-viewport-units {
  height: 100vh;
  width: 100vw;
  --size: 100vmin;
  --size: 100vmax;
}
```

After the new viewport variants, small, large, and dynamic viewport units are
made available, with the addition of [logical
equivalents](/learn/css/logical-properties/) to the physical ones. The idea is
to give developers and designers the ability to choose which unit they want to
use for their given scenario. Maybe it's ok to have a small jarring layout shift
when the status bar goes away, so then `dvh` (dynamic viewport height) could be
used without worry.

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/KtZ9bXwtzmo7hguwQOWO.png",
  alt="A graphic with three phones to help illustrate DVH, LVH and SVH. The DVH
   example phone has two vertical lines, one between the bottom of the search bar
   and the bottom of the viewport and one between above the search bar (under the
   system status bar) to the bottom of the viewport; showing how DVH can be either
   of these two lengths. LVH is shown in the middle with one line between the
   bottom of the device status bar and the button of the phone viewport. The last is
   the SVH unit example, showing a line from the bottom of the browser search bar
   to the bottom of the viewport",
  width="800",
  height="664"
%}

Here's a complete list of all the new viewport unit options made available with
the new viewport variants:

<div class="switcher">
{% Compare 'better', 'Height viewport units' %}
```css
​​.new-height-viewport-units {
  height: 100vh;
  height: 100dvh;
  height: 100svh;
  height: 100lvh;
  block-size: 100vb;
  block-size: 100dvb;
  block-size: 100svb;
  block-size: 100lvb;
}
```
{% endCompare %}

{% Compare 'better', 'Width viewport units' %}
```css
.new-width-viewport-units {
  width: 100vw;
  width: 100dvw;
  width: 100svw;
  width: 100lvw;
  inline-size: 100vi;
  inline-size: 100dvi;
  inline-size: 100svi;
  inline-size: 100lvi;
}
```
{% endCompare %}
</div>

<div class="switcher">
{% Compare 'better', 'Smallest viewport side units' %}
```css
.new-min-viewport-units {
  --size: 100vmin;
  --size: 100dvmin;
  --size: 100svmin;
  --size: 100lvmin;
}
```
{% endCompare %}

{% Compare 'better', 'Largest viewport side units' %}
```css
.new-max-viewport-units {
  --size: 100vmax;
  --size: 100dvmax;
  --size: 100svmax;
  --size: 100lvmax;
}
```
{% endCompare %}
</div>

Hopefully these will give developers and designers the flexibility needed to
achieve their viewport responsive designs.

#### Resources

- [Viewport relative units
  specification](https://drafts.csswg.org/css-values-4/#viewport-relative-lengths)
- [Bramus](https://twitter.com/bramus): [The Large, Small, and Dynamic
  Viewports](https://www.bram.us/2021/07/08/the-large-small-and-dynamic-viewports/)

### `:has()`

{% BrowserCompat 'css.selectors.has' %}

Before `:has()`, the
[subject](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors#:~:text=The%20element%20or%20elements%20which%20are%20selected%20by%20the%20selector%20are%20referred%20to%20as%20the%20subject%20of%20the%20selector.)
of a [selector](/learn/css/selectors/) was always at the end. For example, the
subject of this selector is a list item: `ul > li`. Pseudo selectors can alter
the selector but they don't change the subject: `ul > li:hover` or `ul >
li:not(.selected)`.

After `:has()`, a subject higher in the element tree can remain the subject
while providing a query about children: `ul:has(> li)`. It is easy to understand
how `:has()` got a common name of "parent selector", as the subject of the
selector is now the parent in this case.

Here's a basic syntax example where the class `.parent` remains the subject but
is only selected if a child element has the `.child` class:

```css
.parent:has(.child) {...}
```

Here's an example where a `<section>` element is the subject, but the selector
only matches if one of the children has `:focus-visible`:

```css
section:has(*:focus-visible) {...}
```

{% Aside %}
[`:focus-within`](/learn/css/pseudo-classes/#:focus-:focus-within-and-:focus-visible)
already behaves similarly to `section:has(*:focus-visible)` and
should be used instead.
{% endAside %}

The `:has()` selector starts to become a fantastic utility once more practical
use cases become apparent. For example, it's not currently possible to select
`<a>` tags when they wrap images, making it difficult to teach the anchor tag
how to change its styles when in that use case. It is possible with `:has()`
though:

```css
a:has(> img) {...}
```

These have all been examples where `:has()` only looks like a parent selector.
Consider the use case of images inside of `<figure>` elements and adjusting
styles on the images if the figure has a `<figcaption>`. In the following
example, figures with figcaptions are selected and then images within that
context. `:has()` is used and doesn't change the subject, as the subject we're
targeting is images not figures:

```css
figure:has(figcaption) img {...}
```

The combinations are seemingly endless. Combine `:has()` with [quantity
queries](https://alistapart.com/article/quantity-queries-for-css/) and adjust
CSS grid layouts based on the number of children. Combine `:has()` with
[interactive pseudo class
states](/learn/css/pseudo-classes/#interactive-states) and create
applications that respond in new creative ways.

Checking for support is made simple with
[`@supports`](https://developer.mozilla.org/docs/Web/CSS/@supports) and
its
[`selector()`](https://developer.mozilla.org/docs/Web/CSS/@supports#function_syntax)
function, which tests if the browser understands the syntax before using it:

```css
@supports (selector(:has(works))) {
  /* safe to use :has() */
}
```

#### Resources

- [:has() specification](https://www.w3.org/TR/selectors-4/#relational)
- [:has() on MDN](https://developer.mozilla.org/docs/Web/CSS/:has)
- [The CSS `:has()` selector is way more than a "parent
  selector"](https://www.bram.us/2021/12/21/the-css-has-selector-is-way-more-than-a-parent-selector/)

## 2022 and beyond

There are still a number of things that will be hard to do after all these
amazing features land in 2022. The next section takes a look at some of the
remaining problems and the solutions that are actively being developed to
resolve them. These solutions are experimental, even though they may be
specified or available behind flags in browsers.

The upshot from the next sections should be comfort that the problems listed
have many people from many companies seeking resolution—not that these solutions
are going to be released in 2023.

### Loosely typed custom properties

{% BrowserCompat 'css.at-rules.property' %}

CSS [custom properties](https://developer.mozilla.org/docs/Web/CSS/--*)
are amazing. They allow all sorts of things to be stored inside of a named
variable, which then can be extended, calculated upon, shared, and more. In
fact, they're so flexible, it would be nice to have some that are less flexible.

Consider a scenario where a `box-shadow` uses custom properties for its values:

```css
box-shadow: var(--x) var(--y) var(--blur) var(--spread) var(--color);
```

This all works well until any one of the properties is changed into a value that
CSS doesn't accept there, such as `--x: red`. The entire shadow breaks if any
one of the nested variables is missing or is set to an invalid value type.

This is where [`@property`](/at-property/) comes in: `--x` can
become a typed custom property, no longer loose and flexible, but safe with some
defined boundaries:

```css
@property --x {
  syntax: '<length>';
  initial-value: 0px;
  inherits: false;
}
```

Now, when the `box-shadow` uses `var(--x)` and later `--x: red` is attempted,
`red` will be ignored as it's not a `<length>`. This means the shadow continues
to work, even though an invalid value was given to one of its custom properties.
Instead of failing, it reverts to its `initial-value` of `0px`.

#### Animation

In addition to type safety, it also opens up many doors for animation. The
flexibility of CSS syntax makes animating some things impossible, such as
gradients. `@property` helps here because the typed CSS property can inform the
browser about a developer's intent inside of otherwise overly complex
interpolation. It essentially limits the scope of possibility insomuch that a
browser can animate aspects of a style that it couldn't before.

Consider this demo example, where a radial gradient is used to make a portion of
an overlay, creating a spotlight focus effect. JavaScript sets the mouse x and y
when the alt/opt key is pressed, and then changes the focal-size to a smaller
value such as 25%, creating the spotlight focus circle at the mouse position:

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/xFOY3xaBXBjszS1tCkuq.mp4",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    Try the <a href="https://codepen.io/web-dot-dev/pen/gOoVWrz">demo</a>
  </figcaption>
</figure>

```css
.focus-effect {
  --focal-size: 100%;
  --mouse-x: center;
  --mouse-y: center;

  mask-image: radial-gradient(
    circle at var(--mouse-x) var(--mouse-y),
    transparent 0%,
    transparent var(--focal-size),
    black 0%
  );
}
```

Gradients can't be animated though. They are too flexible and too complex for
the browser to "just derive" how you want them to animate. With `@property`,
though, one property can be typed and animated in isolation, for which the
browser can easily understand the intent.

Video games that use this focus effect always animate the circle, from a large
circle to a pinhole circle. Here's how to use `@property` with our demo so the
browser animates the gradient mask:

```css/0-4/18
@property --focal-size {
  syntax: '<length-percentage>';
  initial-value: 100%;
  inherits: false;
}

.focus-effect {
  --focal-size: 100%;
  --mouse-x: center;
  --mouse-y: center;

  mask-image: radial-gradient(
    circle at var(--mouse-x) var(--mouse-y),
    transparent 0%,
    transparent var(--focal-size),
    black 0%
  );

  transition: --focal-size .3s ease;
}
```

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/SfL7gzXbGW0Ct5Zucbyx.mp4",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    Try the <a href="https://codepen.io/web-dot-dev/pen/RwxXVGx">demo</a>
  </figcaption>
</figure>

The browser is now able to animate the gradient size because we've reduced the
surface area of the modification to just one property and typed the value so the
browser can intelligently interpolate the lengths.

`@property` can do so much more, but these small enablements can go a long way.

#### Resources

- [@property
  specification](https://www.w3.org/TR/css-properties-values-api-1/#at-property-rule)
- [@property on MDN](https://developer.mozilla.org/docs/Web/CSS/@property)
- [@property on web.dev](/at-property/)
- [Zoom focus demo](https://codepen.io/argyleink/pen/rNwWwor)
- [CSS Tricks: Exploring @property and its animating
  powers](https://css-tricks.com/exploring-property-and-its-animating-powers/)

### Was in `min-width` or `max-width`

{% BrowserCompat 'css.at-rules.media.ranges' %}

Before media query ranges, a CSS media query uses `min-width` and `max-width` to
articulate over and under conditions. It may look like this:

```css
@media (min-width: 320px) {
  …
}
```

After media query ranges, the same media query could look like this:

```css
@media (width >= 320px) {
  …
}
```

A CSS media query using both `min-width` and `max-width` may look like this:

```css
@media (min-width: 320px) and (max-width: 1280px) {
  …
}
```

After media query ranges, the same media query could look like this:

```css
@media (320px <= width <= 1280px) {
  …
}
```

Depending on your coding background, one of those will look much more legible
than the other. Thanks to the spec additions, developers will be able to choose
which they prefer, or even use them interchangeably.

#### Resources

- [Media query range syntax
  specification](https://www.w3.org/TR/mediaqueries-5/#mq-range-context)
- [Media query range syntax on
  MDN](https://developer.mozilla.org/docs/Web/CSS/Media_Queries/Using_media_queries#syntax_improvements_in_level_4)
- [Media query range syntax PostCSS
  plugin](https://github.com/postcss/postcss-media-minmax)

### No media query variables

{% BrowserCompat 'css.at-rules.media.custom' %}

Before `@custom-media`, media queries had to repeat themselves over and over, or
rely on preprocessors to generate the proper output based on static variables
during build time.

After `@custom-media`, CSS allows aliasing media queries and the referencing of
them, just like a custom property.

Naming things is very important: it can align purpose with the syntax, making
things easier to share and easier to use in teams. Here are a few custom media
queries that follow me between projects:

```css
@custom-media --OSdark  (prefers-color-scheme: dark);
@custom-media --OSlight (prefers-color-scheme: light);

@custom-media --pointer (hover) and (pointer: coarse);
@custom-media --mouse   (hover) and (pointer: fine);

@custom-media --xxs-and-above (width >= 240px);
@custom-media --xxs-and-below (width <= 240px);
```

Now that they're defined, I can use one of them like this:

```css
@media (--OSdark) {
  :root {
    …
  }
}
```

Find a [full list of custom media
queries](https://open-props.style/#media-queries) I use inside my CSS custom
property library [Open Props](https://open-props.style).

#### Resources

- [Custom media queries
  specification](https://www.w3.org/TR/mediaqueries-5/#custom-mq)
- [Custom media queries PostCSS
  plugin](https://github.com/postcss/postcss-custom-media)

### Nesting selectors is so nice

{% BrowserCompat 'css.at-rules.nest' %}

Before `@nest`, there was a lot of repetition in stylesheets. It became
especially unwieldy when selectors were long and each was targeting small
differences. The convenience of nesting is one of the most common reasons for
adopting a preprocessor.

After `@nest`, the repetition is gone. Nearly every feature of
preprocessor-enabled nesting will be made available built into CSS.

```css
article {
  color: darkgray;
}

article > a {
  color: var(--link-color);
}

/* with @nest becomes */

article {
  color: darkgray;

  & > a {
    color: var(--link-color);
  }
}
```

{% Aside %}
Use the syntax today with [PostCSS](https://postcss.org/) and the
[PostCSS
Nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)
plugin.
{% endAside %}

What's most important about nesting to me, besides not repeating `article` in
the nested selector, is the styling context remains within one style block.
Instead of bouncing from one selector, and its styles, to another selector with
styles (example 1), the reader can remain within the context of an article and
see the article owns links inside of it. The relationship and style intent are
bundled together, so `article` gets to appear to own its own styles.

The ownership could also be thought of as centralization. Instead of looking
around a stylesheet for relevant styles, they can all be found nested together
within a context. This works with parent to child relationships, but also with
child to parent relationships.

Consider a component child that wants to adjust itself when in a different
parent context, as opposed to the parent owning the style and changing a child:

```css
/* parent owns this, adjusting children */
section:focus-within > article {
  border: 1px solid hotpink;
}

/* with @nest becomes */

/* article owns this, adjusting itself when inside a section:focus-within */
article {
  @nest section:focus-within > & {
     border: 1px solid hotpink;
  }
}
```

`@nest` helps overall with healthier style organization, centralization, and
ownership. Components can group and own their own styles, instead of having them
spread amongst other style blocks. It may seem small in these examples, but it
can have very large impacts, for both convenience and legibility.

{% Aside 'warning' %}
Nesting more than four or five levels can become more troublesome
than repeating selectors. We advise you to not nest so deep, and instead
begin a new selector blog and nest within it.
{% endAside %}

#### Resources

- [@nest specification](https://www.w3.org/TR/css-nesting-1/)
- [@nest PostCSS
  plugin](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)
- [Bramus](https://twitter.com/bramus): [The future of CSS: Nesting
  Selectors](https://www.bram.us/2019/03/17/the-future-of-css-nesting-selectors/)

### Scoping styles is really hard

{% BrowserCompat 'css.at-rules.scope' %}

Before `@scope`, many strategies existed because styles in CSS cascade, inherit,
and are globally scoped by default. These features of CSS are very convenient
for many things, but for complex sites and applications, with potentially many
different styles of components, the global space and nature of the cascade can
make styles feel like they're leaking.

After `@scope`, not only can styles be scoped to only within a context, like a
class, they can also articulate where the styles end and do not continue to
cascade or inherit.

In the following example, [BEM](http://getbem.com/naming/) naming convention
scoping can be reversed into the actual intent. The BEM selector is attempting
to scope the color of a `header` element to a `.card` container with naming
conventions. This requires that the header has this classname on it, completing
the goal. With `@scope`, no naming conventions are required in order to complete
the same goal without marking up the header element:

```css
.card__header {
  color: var(--text);
}

/* with @scope becomes */

@scope (.card) {
  header {
    color: var(--text);
  }
}
```

Here's another example, less component-specific and more about the global scope
nature of CSS. Dark and light themes have to coexist inside a stylesheet, where
order matters in determining a winning style. Usually this means dark theme
styles come after the light theme; this establishes light as the default and
dark as the optional style. Avoid the ordering and scope battling with `@scope`:

```css
​​@scope (.light-theme) {
  a { color: purple; }
}

@scope (.dark-theme) {
  a { color: plum; }
}
```

To complete the story here, `@scope` also allows the establishing of where the
style scope ends. This can't be done with any naming convention or preprocessor;
it's special and only something CSS built-in to the browser can do. In the
following example, `img` and `.content` styles are exclusively applied when a
child of a `.media-block` is a sibling or parent of `.content`:

```css
@scope (.media-block) to (.content) {
  img {
    border-radius: 50%;
  }

  .content {
    padding: 1em;
  }
}
```

#### Resources

- [@scope specification](https://www.w3.org/TR/css-scoping-1/)
- [@scope explainer](https://css.oddbird.net/scope/explainer/)

### No CSS way for a masonry layout

Before CSS masonry with grid, JavaScript was the best way to achieve a masonry
layout, as any of the CSS methods with columns or flexbox would inaccurately
represent the content order.

After CSS masonry with grid, no JavaScript libraries will be required and the
content order will be correct.

<figure data-size="full">
  {% Img
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/xfOiyctwsXa8wnfkuoS2.png",
    alt="Screenshot of the masonry layout which shows numbers traveling along the top, then going down.",
    width="800",
    height="547"
  %}
  <figcaption>
    Image and demo from Smashing Magazine<br>
    <a href="https://www.smashingmagazine.com/native-css-masonry-layout-css-grid/">https://www.smashingmagazine.com/native-css-masonry-layout-css-grid/</a>
  </figcaption>
</figure>

The preceding demo is achieved with the following CSS:

```css/3
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: masonry;
}
```

It's comforting to know that this is on the radar as a missing layout strategy,
plus you can [try it today in
Firefox](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Masonry_Layout).

#### Resources

- [Masonry layout
  specification](https://drafts.csswg.org/css-grid-3/#masonry-layout-algorithm)
- [Masonry layout on
  MDN](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Masonry_Layout)
- [Smashing Magazine: Native CSS Masonry Layout with CSS
  Grid](https://www.smashingmagazine.com/native-css-masonry-layout-css-grid/)

### CSS can't help users reduce data

{% BrowserCompat 'css.at-rules.media.prefers-reduced-data' %}

Before the `prefers-reduced-data` media query, JavaScript and a server could
change their behavior based on a user’s operating system or browser "data saver"
option, but CSS could not.

After the `prefers-reduced-data` media query, CSS can join the user experience
enhancement and play its part in saving data.

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/3Vwnp23TzTTBjFCan6oG.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}

```css
@media (prefers-reduced-data: reduce) {
  picture, video {
    display: none;
  }
}
```

The preceding CSS is used in [this media scroll
component](https://gui-challenges.web.app/media-scroller/dist/) and the savings
can be huge. Depending on how large the visiting viewport is, the more savings
to be had on page load. Saving continues as users interact with the media
scrollers. The images all have `loading="lazy"` attributes on them and that,
combined with CSS hiding the element entirely, means a network request for the
image is never made.

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/BgbeJDFy5t2i8EfaBW8i.jpeg",
  alt="Screenshot of a TV show carousel interface with many thumbnails and titles shown.",
  width="800",
  height="528"
%}

For my testing, on a medium sized viewport, 40 requests and 700kb of resources
were initially loaded. As a user scrolls the media selection, more requests and
resources are loaded. With CSS and the reduced data media query, 10 requests and
172kb of resources are loaded. That's half a megabyte of savings and the user
hasn't even scrolled any of the media, at which point there are no additional
requests made.

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/BcSDhqSWMsbCnNH4zXbR.jpeg",
  alt="Screenshot of a TV show carousel interface with no thumbnails and many titles shown.",
  width="800",
  height="528"
%}

There are more advantages to this reduced data experience than just data
savings. More titles can be seen and there's no distracting cover images to
steal attention. Many users browse in a data saver mode because they pay per
megabyte of data—it's really nice to see CSS able to help out here.

#### Resources

- [prefers-reduced-data
  specification](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-data)
- [prefers-reduced-data on
  MDN](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-data)
- [prefers-reduced-data in a GUI
  Challenge](https://gui-challenges.web.app/media-scroller/dist/)
- [Smashing Magazine: Improving Core Web Vitals, A Smashing Magazine Case
  Study](https://www.smashingmagazine.com/2021/12/core-web-vitals-case-study-smashing-magazine/#savedata-and-prefers-reduced-data)

### Scroll snap features are too limited

Before these scroll snap proposals, writing your own JavaScript to manage a
carousel, slider, or gallery could quickly get complex, with all the observers
and state management. Also, if not careful, the natural scrolling speeds could
get normalized by script, making user interaction feel a bit unnatural and
potentially clunky.

#### New APIs

##### `snapChanging()`

As soon as the browser has released a snap child, this event fires. This allows
UI to reflect the lack of a snap child and the indeterminate snap state of the
scroller, as it's now being used and will land somewhere new.

```js
document.querySelector('.snap-carousel').addEventListener('snapchanging', event => {
  console.log('Snap is changing', event.snappedTargetsList);
});
```

##### `snapChanged()`

As soon as the browser has snapped to a new child and the scroller is rested,
this event fires. This lets any UI that depends on the snapped child to update
and reflect the connection.

```js
document.querySelector('.snap-carousel').addEventListener('snapchanged', event => {
  console.log('Snap changed', event.snappedTargetsList);
});
```

##### `scroll-start`

Scrolling doesn't always begin at the start. Consider swipeable components where
swiping left or right triggers different events, or a search bar that on page
load is initially hidden until you scroll to the top. This CSS property lets
developers specify that a scroller should begin at a specific point.

```css
:root { --nav-height: 100px }

.snap-scroll-y {
  scroll-start-y: var(--nav-height);
}
```

##### `:snap-target`

This CSS selector will match elements in a scroll snap container that are
currently snapped by the browser.

```css
.card {
  --shadow-distance: 5px;
  box-shadow: 0 var(--shadow-distance) 5px hsl(0 0% 0% / 25%);
  transition: box-shadow 350ms ease;
}

.card:snapped {
  --shadow-distance: 30px;
}
```

After these scroll snap proposals, making a slider, carousel, or gallery is much
easier as the browser now offers conveniences for the task, eliminating
observers and scroll orchestration code in favor of using built-in APIs.

It's still very early days for these CSS and JS features, but be on the lookout
for polyfills that can help adoption, and testing, of them soon.

#### Resources

- [Scroll Snap 2 draft
  specification](https://drafts.csswg.org/css-scroll-snap-2/)
- [Scroll Snap 2
  explainers](https://github.com/argyleink/ScrollSnapExplainers/blob/main/css-snap-target/readme.md)
- [Snap demos](https://snap-gallery.netlify.app/)

### Cycling between known states

Before `toggle()`, only states built into the browser already could be leveraged
for styling and interaction. The checkbox input, for example, has `:checked`, an
internally managed browser state for the input that CSS is able to use for
changing the element visually.

After `toggle()`, custom states can be created on any element for CSS to change
and use for styling. It allows groups, cycling, directed toggling, and more.

In the following example, the same effect of a list item strikethrough on
complete is achieved but without any checkbox elements:

```html
<ul class='ingredients'>
   <li>1 banana
   <li>1 cup blueberries
  ...
</ul>
```

And the relevant CSS `toggle()` styles:

```css
li {
  toggle-root: check self;
}

li:toggle(check) {
  text-decoration: line-through;
}
```

If you're familiar with state machines, you may notice how much crossover there
is with `toggle()`. This feature will let developers build more of their state
into CSS, hopefully resulting in clearer and more semantic ways of orchestrating
interaction and state.

#### Resources

- [toggle() draft specification](https://tabatkins.github.io/css-toggle/)
- [Bramus](https://twitter.com/bramus): [The Future of CSS: CSS
  Toggles](https://www.bram.us/2022/04/20/the-future-of-css-css-toggles/)

### Customizing select elements

Before `<selectmenu>`, CSS didn't have the ability to customize `<option>`
elements with rich HTML or change much about the display of a list of options.
This led developers to load external libraries that recreated much of the
functionality of a `<select>`, which ended up being a lot of work.

After `<selectmenu>`, developers can provide rich HTML for options elements and
style them as much as they need, while still meeting accessibility requirements
and providing semantic HTML.

In the following example, taken from the `<selectmenu>` [explainer
page](https://open-ui.org/prototypes/selectmenu), a new select menu is created
with some basic options:

```html
<selectmenu>
  <option>Option 1</option>
  <option>Option 2</option>
  <option>Option 3</option>
</selectmenu>
```

CSS can target and style the element's parts:

```css
.my-select-menu::part(button) {
  color: white;
  background-color: red;
  padding: 5px;
  border-radius: 5px;
}

.my-select-menu::part(listbox) {
  padding: 10px;
  margin-top: 5px;
  border: 1px solid red;
  border-radius: 5px;
}
```

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/wOUKMguhg268udindKlK.png",
  alt="A select looking menu with red accent colors.",
  width="186",
  height="265"
%}

You can try the `<selectmenu>` element on Chromium in Canary with the web
experiments flag enabled. Watch out in 2023 and beyond for customizable select
menu elements.

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/tpPE2zZPCWW6e63mjP1I.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}

#### Resources

- [Selectmenu specification](https://open-ui.org/prototypes/selectmenu)
- [Selectmenu demo](https://microsoftedge.github.io/Demos/selectmenu/)

### Anchoring an element to another

Before `anchor()`, position absolute and relative were position strategies
provided for developers to have child elements move around within a parent
element.

After `anchor()`, developers can position elements to other elements, regardless
of them being a child or not. It also allows developers to specify which edge to
position against, and other niceties for creating position relationships between
elements.

The explainer has a few great examples and code samples provided, if you're
interested in learning more.

#### Resources

- [anchor()
  explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/CSSAnchoredPositioning/explainer.md)
