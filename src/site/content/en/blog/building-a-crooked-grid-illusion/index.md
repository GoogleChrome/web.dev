---
layout: post
title: Building a crooked grid illusion
subhead: A fun exploration of ways to recreate an optical illusion with CSS.
authors:
  - adamargyle
description: A fun exploration of ways to recreate an optical illusion with CSS.
date: 2022-08-24
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/wn35IKyCSBIGPCLe5zNS.png
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/rNdAD4YjP4wKd2iHMBfg.png
tags:
  - blog
  - css
---

In this post we're going to have a little bit of fun! There must be 100 ways to
achieve this optical illusion, and I'm only going to share with you my thoughts,
but encourage you to try your style. [Try the
demo](https://gui-challenges.web.app/crooked-illusion/dist/) and [view the
source](https://github.com/argyleink/gui-challenges).

If you prefer video, here's a YouTube version of this post:

{% YouTube 'oHcTn83M1ls' %}

## Overview

The name of this illusion is the [Cafe Wall
Illusion](https://en.wikipedia.org/wiki/Caf%C3%A9_wall_illusion). There's no
crooked lines to be found anywhere, but our eyes perceive slants. It may be hard
to believe, but rebuilding it will definitely help you see through the illusion.

{% Aside %}
To help you kick off this challenge, [here's a Codepen you can
fork](https://codepen.io/web-dot-dev/pen/WNzmMvq) which has all the HTML ready
for you to style your way.
{% endAside %}

## Markup

The HTML for this is straightforward rows and columns. The `<body>` is the
container with `<div class="row">` for children. Each row contains five `<div
class="square">` elements.

```html
<div class="row">
  <div class="square"></div>
  <div class="square"></div>
  <div class="square"></div>
  <div class="square"></div>
  <div class="square"></div>
</div>
…
```

## Styles

I chose [CSS grid](https://developer.mozilla.org/docs/Web/CSS/grid)
because it seemed fitting given the presentation style of rows, and it also
features
[`justify-content`](https://developer.mozilla.org/docs/Web/CSS/justify-content)
which seemed like a good way to offset row children.

### Body styles

Starting with the body styles, I used `display: grid` and `grid-auto-rows` to
provide the row layouts. The `calc()` you see for the row sizes takes into
account the border on each row, and helps the effect fit the full viewport.

```css
body {
  display: grid;
  grid-auto-rows: calc(20vh - 4px);
  gap: 4px;
  background: gray;
  margin: 0;
}
```

### Row styles

Here I chose grid again, but instead of creating rows with it I used
`grid-auto-flow: column` to change the direction to columns. I then define
column sizes and add a little inline padding to the row, so boxes don't run into
the viewport edge. Then I target certain rows and justify the content to either
`center` or `end`, creating that offset that fuels the illusion.

```css
.row {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 9vw;
  padding-inline: 4vw;
  gap: 10vw;
  background: white;
}

.row:nth-child(even) {
  justify-content: center;
}

.row:nth-child(3n) {
  justify-content: end;
}
```

### Square styles

All that's left now is to change the squares color and add a border:

```css
.square {
  border-inline: 4px solid gray;
  background: black;
}
```

## Conclusion

Now that you know how I did it, how would you?! 🙂 Floats? Flexbox? Gradient?!

Let's diversify our approaches and learn all the ways to build on the web.

Create a demo, [tweet me](https://twitter.com/argyleink) links, and I'll add it
to the community remixes section below!

## Community remixes

*nothing to see here yet*
