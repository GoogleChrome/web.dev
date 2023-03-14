---
layout: post
title: 6 CSS snippets every front-end developer should know in 2023
subhead: Toolbelt worthy, powerful and stable CSS you can use today.
authors:
  - adamargyle
description: Toolbelt worthy, powerful and stable CSS you can use today.
date: 2023-03-14
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/8A29dtYK0wfkRh8a8wMe.jpg
alt: A wooden table with a hammer and a wrench neatly placed on it.
tags:
  - blog
  - css
---

I believe every front-end developer should know how to use [container
queries](https://developer.mozilla.org/docs/Web/CSS/CSS_Container_Queries),
create a [scroll snap](https://codepen.io/collection/KpqBGW) experience, avoid
`position: absolute` with
[grid](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout),
swiftly hammer out a circle, use [cascade
layers](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Cascade_layers),
and reach more with less via [logical
properties](/learn/css/logical-properties/). Here's a quick
overview of each of those expectations.

## 1. A container query

The top requested CSS feature for 10 years straight, is [now
stable](/cq-stable/) across browsers and available for you to use
for width queries in 2023.

```css
.panel {
  container: layers-panel / inline-size;
}

.card {
  padding: 1rem;
}

@container layers-panel (min-width: 20rem) {
  .card {
    padding: 2rem;
  }
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'OJovdLN',
  height: 500,
  tab: 'css,result'
} %}

<div class="compat-subject"><code>@container</code></div>
{% BrowserCompat 'css.at-rules.container' %}

<div class="compat-subject"><code>container</code></div>
{% BrowserCompat 'css.properties.container' %}

<style>
.compat-subject ~ .wdi-browser-compat {
  margin-block-start: 0;
}
</style>

## 2. Scroll snap

Well orchestrated scroll experiences set your experience apart from the rest,
and [scroll
snap](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-type) is the
perfect way to match system scroll UX while providing meaningful stopping
points.

```css
.snaps {
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
}

.snap-target {
  scroll-snap-align: center;
}

.snap-force-stop {
  scroll-snap-stop: always;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'QWVmYLv',
  height: 700,
  tab: 'result'
} %}

Learn more about the potential of this CSS feature in this [huge and inspiring
Codepen collection](https://codepen.io/collection/KpqBGW) of ~25 demos.

<div class="compat-subject"><code>scroll-snap-type</code></div>
{% BrowserCompat 'css.properties.scroll-snap-type' %}

<div class="compat-subject"><code>scroll-snap-align</code></div>
{% BrowserCompat 'css.properties.scroll-snap-align' %}

<div class="compat-subject"><code>scroll-snap-stop</code></div>
{% BrowserCompat 'css.properties.scroll-snap-stop' %}

<div class="compat-subject"><code>overscroll-behavior</code></div>
{% BrowserCompat 'css.properties.overscroll-behavior' %}

## 3. Grid pile

Avoid position absolute with a single cell CSS grid. Once they're [piled on top
of each other](/shows/gui-challenges/m4DKhRJeYx4/), use justify
and align properties to position them.

```css
.pile {
  display: grid;
  place-content: center;
}

.pile > * {
  grid-area: 1/1;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'MWqVLgQ',
  height: 300,
  tab: 'css,result'
} %}

<div class="compat-subject"><code>grid</code></div>
{% BrowserCompat 'css.properties.grid' %}

## 4. Quick circle

There are lots of ways to make circles in CSS, but this is definitely the most
minimal.

```css
.circle {
  inline-size: 25ch;
  aspect-ratio: 1;
  border-radius: 50%;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'rNZdPBK',
  height: 300,
  tab: 'css,result'
} %}

<div class="compat-subject"><code>aspect-ratio</code></div>
{% BrowserCompat 'css.properties.aspect-ratio' %}

## 5. Control variants with @layer

[Cascade
layers](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Cascade_layers)
can [help insert variants](https://nerdy.dev/cascade-layer-async-overrides)
discovered or created later, into the right place in the cascade with the
original set of variants.

```css
/* file buttons.css */
@layer components.buttons {
  .btn.primary {
    …
  }
}
```

Then, in some entirely different file, loaded at some other random time, append
a new variant to the button layer as if it was there with the rest of them this
whole time.

```css
/* file video-player.css */
@layer components.buttons {
  .btn.player-icon {
    …
  }
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'LYJdqPv',
  height: 300,
  tab: 'css,result'
} %}

<div class="compat-subject"><code>@layer</code></div>
{% BrowserCompat 'css.at-rules.layer' %}

## 6. Memorize less and reach more with logical properties

Memorize this [one new box model](/learn/css/logical-properties/)
and [never have to worry](https://css-tricks.com/late-to-logical/) about
changing left and right padding or margin for international [writing
modes](https://developer.mozilla.org/docs/Web/CSS/writing-mode) and
[document
directions](https://developer.mozilla.org/docs/Web/CSS/direction) again.
Adjust your styles from physical properties to logical ones like
[`padding-inline`](https://developer.mozilla.org/docs/Web/CSS/padding-inline),
[`margin-inline`](https://developer.mozilla.org/docs/Web/CSS/margin-inline),
[`inset-inline`](https://developer.mozilla.org/docs/Web/CSS/inset-inline),
and now the browser will do the adjusting work.

```css
button {
  padding-inline: 2ch;
  padding-block: 1ch;
}

article > p {
  text-align: start;
  margin-block: 2ch;
}

.something::before {
  inset-inline: auto 0;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'mdGxvdJ',
  height: 450,
  tab: 'css,result'
} %}

<div class="compat-subject"><code>padding-inline</code></div>
{% BrowserCompat 'css.properties.padding-inline' %}

<div class="compat-subject"><code>margin-block</code></div>
{% BrowserCompat 'css.properties.margin-block' %}

<div class="compat-subject"><code>inset-inline</code></div>
{% BrowserCompat 'css.properties.inset-inline' %}
