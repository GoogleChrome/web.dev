---
layout: post
title: Building a Settings component
subhead: A foundational overview of how to build a settings component of sliders and checkboxes.
authors:
  - adamargyle
description: A foundational overview of how to build a settings component of sliders and checkboxes.
date: 2021-03-17
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/SUaxDTgOYvv2JXxaErBP.png
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

In this post I want to share thinking on building a Settings component for the
web that is responsive, supports multiple device inputs, and works across
browsers. Try the [demo](https://gui-challenges.web.app/settings/dist/).

<figure class="w-figure w-figure--fullbleed">
  {% Video 
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/WuIwd9jPb30KmmnjJn75.mp4",
    className="w-screenshot", 
    autoplay="true", 
    loop="true", 
    muted="true" 
  %}
  <figcaption class="w-figure">
    <a href="https://gui-challenges.web.app/settings/dist/">Demo</a>
  </figcaption>
</figure>

If you prefer video, or want a UI/UX preview of what we're building, here's a
shorter walkthrough on YouTube:

{% YouTube 'mMBcHcvxuuA' %}

## Overview

I've broken out the aspects of this component into the following sections:

1. [Layouts](#layouts)
1. [Color](#color)
1. [Custom Range Input](#custom-range)
1. [Custom Checkbox Input](#custom-checkbox)
1. [Accessibility Considerations](#accessibility)
1. [JavaScript](#javascript)

## Layouts

This is the first GUI Challenge demo to be **all CSS Grid**! Here's all of them
turned on with the [Chrome DevTools for grid](https://goo.gle/devtools-grid):

{% Img
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/h6LZhScslprBcFol4gGp.png",
  alt="Colorful outlines and gap spacing overlays that help show all the boxes that make up the settings layout",
  class="w-screenshot",
  width="800", height="563"
%}

{% Banner 'neutral' %}
I captured the above picture by:
1. Opening the Chrome DevTools with `cmd+opt+i` or `ctrl+alt+i`
1. Select the Layout tab next to the Styles tab
1. Under the Grid layouts section, check on all the layouts
1. Change all the layout's colors
{% endBanner %}

### Just For Gap

The most common layout:

```css
foo {
  display: grid;
  gap: var(--something);
}
```

I call it "just for gap" because the default layout of the web is in blocks, so
setting `display: grid` doesn't have much of an initial effect. Then we add
`gap` and it all becomes clear. We're just using grid for it's gap in the block
axis. 

`5` layouts use this strategy, here's all of them displayed:

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/zYWSVLzdtrh1K8p8yUuA.png", 
  alt="Vertical grid layouts highlighted with outlines and filled in gaps", 
  width="800", 
  height="568" 
%}

The `fieldset` element, which contains each input group (`.fieldset-item`), is using `gap: 1px` to
create the hairline borders between elements. No tricky border solution!

<div class="w-columns">
{% Compare 'better', 'Filled gap' %}

```css
.grid {
  display: grid;
  gap: 1px;
  background: var(--bg-surface-1);

  & > .fieldset-item {
    background: var(--bg-surface-2);
  }
}
```

{% endCompare %}

{% Compare 'worse', 'Border trick' %}

```css
.grid {
  display: grid;

  & > .fieldset-item:not(:last-child) {
    background: var(--bg-surface-2);
    border-bottom: 1px solid var(--bg-surface-1);
  }
}
```
{% endCompare %}
</div>

### Natural grid wrapping

The most complex layout ended up being the macro layout, the logical layout
system between `<main>` and `<form>`. 

#### Centering wrapping content

A common learning moment with CSS layout is distinguishing centering of `items`
vs `content`. Flexbox and grid both provide abilities to `align-items` or
`align-content`, and when dealing with wrapping elements, `content` layout
features are what you should reach for.

```css
main {
  display: grid;
  gap: var(--space-xl);
  place-content: center;
}
```

The main element is using `place-content: center` so that regardless of a 2 or 1
column layout, the children should be centered vertically and horizontally,
together as a group.

{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/IQI2PofA6gpNFUkDrvKo.mp4",
  className="w-screenshot", 
  autoplay="true", 
  loop="true", 
  muted="true" 
%}

Watch in the above video how the "content" stays centered, even though wrapping
has occurred.

#### Repeat auto-fit minmax

The adaptive grid layout which naturally goes to 2 columns based on available
space is a powerful and tricky layout to master. The `<form>` uses it to layout
each of it's sections. 

```css
form {
  display: grid;
  gap: var(--space-xl) var(--space-xxl);
  grid-template-columns: repeat(auto-fit, minmax(min(10ch, 100%), 35ch));
  align-items: flex-start;
  max-width: 89vw;
}
```

This grid has a separate row gap (--space-xl) than the column gap (--space-xxl)
to put that custom touch on the responsive layout. When the columns stack, we
want a large gap, but not as large as if we're on a wide screen.

The template columns is using 3 CSS functions: `repeat()`, `minmax()` and
`min()`. [Una Kravets](#) has a [great layout blog
post](https://web.dev/one-line-layouts/) about this, calling it
[RAM](https://web.dev/one-line-layouts/#07.-ram-(repeat-auto-minmax):-grid-template-columns(auto-fit-minmax(lessbasegreater-1fr))).

There's 3 special additions in our layout, if you compare it to Una's:

1. We passed an extra `min()` function
1. We specify `align-items: flex-start`
1. There's a `max-width: 89vw` style?

The extra `min()` function is well described by Evan Minto on their blog in the
post [Intrinsically Responsive CSS Grid with minmax() and
min()](https://evanminto.com/blog/intrinsically-responsive-css-grid-minmax-min/).
I recommend giving that a read. The `flex-start` alignment correction is to
remove the default stretching effect, so that the children of this layout don't
need to have equal heights, they can have natural, intrinsic heights. The
YouTube video has a quick breakdown of this alignment addition.

`max-width: 89vw` is worth a small breakdown in this post. It's partly a
bug, and partly a learning moment. Let me show you the layout with and without
the style applied:

{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/gdldf7hyaBrHWwxQbSaT.mp4",
  className="w-screenshot", 
  autoplay="true", 
  loop="true", 
  muted="true" 
%}

What's happening? When `max-width` is specified, it's providing context,
explicit sizing or [definite
sizing](https://drafts.csswg.org/css-sizing-3/#definite) for the [`auto-fit`
layout algorythym](https://drafts.csswg.org/css-grid/#auto-repeat) to know how
many repetitions it can fit into the space. While it seems obvious that the
space is "full width", per the CSS grid spec, a definite size or max-size must
be provided. I've provided a max-size.

The bug part of this is, why `89vw`? Because "it worked" for my layout… We're
internally investigating why a more reasonable value, like `100vw` isn't
sufficient. I learned a lot from this layout requirement.

### Spacing

A majority of the harmony of this layout is from a limited palette of spacing, 7
to be exact. 

```css
:root {
  --space-xxs: .25rem;
  --space-xs:  .5rem;
  --space-sm:  1rem;
  --space-md:  1.5rem;
  --space-lg:  2rem;
  --space-xl:  3rem;
  --space-xxl: 6rem;
}
```

Usage of these flows really nicely with grid, [CSS @nest](https://drafts.csswg.org/css-nesting-1/), and [level 5 syntax
of @media](https://drafts.csswg.org/mediaqueries-5/). Here's an example, the fully `<main>` layout set of styles.

```css
main {
  display: grid;
  gap: var(--space-xl);
  place-content: center;
  padding: var(--space-sm);

  @media (width >= 540px) {
    & { 
      padding: var(--space-lg); 
    }
  }

  @media (width >= 800px) {
    & { 
      padding: var(--space-xl); 
    }
  }
}
```

A grid with centered content, moderately padded by default (like on mobile). But
as more viewport space becomes available, it spreads out by increasing padding.
2021 CSS is looking pretty good!

Remember the earlier layout, "just for gap"? Here's a more complete version of
how they look in this component:

```css
header {
  display: grid;
  gap: var(--space-xxs);
}

section {
  display: grid;
  gap: var(--space-md);
}
```

## Color

A controlled use of color helped this design stand out as expressive yet
minimal. I do it like this:

```css
:root {
  --surface1: lch(10 0 0);
  --surface2: lch(15 0 0);
  --surface3: lch(20 0 0);
  --surface4: lch(25 0 0);

  --text1: lch(95 0 0);
  --text2: lch(75 0 0);
}
```

{% Aside 'gotchas' %} [PostCSS `lab()` and `lch()`
plugin](https://github.com/csstools/postcss-lab-function) is part of [PostCSS
Preset Env](https://preset-env.cssdb.org/features#lch-function), and will output
`rgb()` colors. Author within CIElab, output supported color. {% endAside %}

I name my surface and text colors with numbers as opposed to names like
`surface-dark` and `surface-darker` because in a media query, I'll be flipping
them, and light and dark won't be meaningful. 

I flip them in a preference media query like this:

```css
:root {
  ...

  @media (prefers-color-scheme: light) {
    & {
      --surface1: lch(90 0 0);
      --surface2: lch(100 0 0);
      --surface3: lch(98 0 0);
      --surface4: lch(85 0 0);

      --text1: lch(20 0 0);
      --text2: lch(40 0 0);
    }
  }
}
```

It's important to get a quick glimpse at the overall picture and strategy before
we dive into color syntax details. But, since I've gotten a bit ahead of myself,
let me back up a bit. 

### LCH?

Without getting too deep into color theory land, LCH is a human oriented syntax,
that caters to how we percieve color, not how we measure color with math (like
255). This gives it a distinct advantage, humans can write it easier and other
humans will be in tune with these adjustments.

<figure class="w-figure w-screenshot">
  {% Img 
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/160dWLSrMhFISwWMVd4w.png", 
    alt="A screenshot of pod.link/csspodcast webpage, with Color 2: Perception episode pulled up", 
    width="800", 
    height="329" 
  %}
  <figcaption class="w-figure">
    Learn about perceptual color (and more!) on the <a href="https://pod.link/thecsspodcast">CSS Podcast</a>
  </figcaption>
</figure>

For today, in this demo, let's focus on the syntax and what values I'm flipping
to make light and dark. Let's look at 1 surface and 1 text color:

```css
:root {
  --surface1: lch(10 0 0);
  --text1:    lch(95 0 0);

  @media (prefers-color-scheme: light) {
    & {
      --surface1: lch(90 0 0);
      --text1:    lch(40 0 0);
    }
  }
}
```

`--surface1: lch(10 0 0)` translates to `10%` lightness, 0 chroma and 0 hue: a
very dark colorless gray. Then, in the media query for light mode, the lightness
is flipped to `90%` with `--surface1: lch(90 0 0);`. And that's the gist of the
strategy. Start by just changing lightness between the 2 themes, maintaining the
contrast ratios the design calls for or what can maintain accessibility. 

The bonus with `lch()` here is that lightness is human oriented, and we can feel
good about a `%` change to it, that it will be perceptually and consistently
that `%` different. `hsl()` for example is [not as
reliable](https://twitter.com/argyleink/status/1201908189257555968).

There's more to learn about color spaces and `lch()` if you're interested. It's
coming!

### Adaptive form controls with color-scheme

Many browsers ship dark theme controls, currently Safari and Chromium, but you
have to specify in your styles or HTML that your design wants them.

{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/0VVtEAWM6jHeIxahqnFy.mp4",
  className="w-screenshot", 
  autoplay="true", 
  loop="true", 
  muted="true" 
%}

The above is demonstrating the effect of the property from the Styles panel of
DevTools, but the demo ships with the HTML tag, which in my opinion is generally
a better location:

```html
<meta name="color-scheme" content="dark light">
```

Learn all about it in [this `color-scheme`
article](https://web.dev/color-scheme/) by [Thomas
Steiner](https://web.dev/authors/thomassteiner/). There's a lot more to gain
than dark checkbox inputs!

### CSS `accent-color`

There's been [recent
activity](https://twitter.com/argyleink/status/1360022120810483715?s=20) around
`accent-color` on form elements, being a single CSS style that can change the
tint color used in the browsers input element. Read more about it [here on
GitHub](https://github.com/w3c/csswg-drafts/issues/5187). I've included it in my
styles for this component, and as browsers support it, my checkboxes will be
more on theme with the pink and purple color pops.

```css
input[type="checkbox"] {
  accent-color: var(--brand);
}
```

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/J9pbhB0ImoDzbsXkBGtG.png", 
  alt="A screenshot from Chromium on Linux of pink checkboxes", 
  width="800", 
  height="406" 
%}

### Color pops with fixed gradients and focus-within

Color pops most when it's used sparingly, and one of the ways I like to achieve
that is through colorful UI interactions. 

{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Pm75QwVToKkiqedqPtmm.mp4",
  className="w-screenshot", 
  autoplay="true", 
  loop="true", 
  muted="true",
  width="480px"
%}

1. Highlight context
1. UI feedback of "how full" the value is in the range
1. UI feedback that it's accepting input

There are many layers of UI feedback and interaction in the above video, all of
which give the interface a tangibility, a personality and responsive to the
interaction. Color specifically is assisting in so much with so little. CSS is
using the `:focus-within` pseudo class to change the appearance of various
elements, let's break down the `.fieldset-item`, it's super interesting:

```css
.fieldset-item {
  ...
  
  &:focus-within {
    background: var(--surface2);

    & svg {
      fill: white;
    }

    & picture {
      clip-path: circle(50%);
      background: var(--brand-bg-gradient) fixed;
    }
  }
}
```

`@nest` syntax sure makes this centeralized and easy to manage doesn't it? The
`.fieldset-item` itself get a higher contrast surface color applied, the `svg`
fills white, and the `<picture>` containing the svg icon fills with a background
color and expands it's `clip-path `to a full circle. 

## Custom Range
- preseve-3d translateZ
- transform order matters
- box-shadow trick
- gradient syntax

## Custom Checkbox
- display contents label

## Accessibility

## JavaScript

## Conclusion

Now that you know how I did it, how would you?! This makes for some fun
component architecture! Who's going to make the 1st version with slots in their
favorite framework? 🙂

Let's diversify our approaches and learn all the ways to build on the web.
Create a demo, [tweet me](https://twitter.com/argyleink) links, and I'll add it
to the [Community remixes](#community-remixes) section below!

## Community remixes

<i>awaiting submissions</i>
