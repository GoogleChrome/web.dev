---
layout: post
title: CSS Border Animations
subhead: >
  Looking at several ways to animate a border in CSS
description: >
  Looking at several ways to animate a border in CSS
authors:
  - bramus
tags:
  - blog
date: 2022-07-29
---

## Setting borders

There are a few methods available to set a border on an element: `border`, `outline`, and `box-shadow`. As detailed in [The 3 CSS Methods for Adding Element Borders](https://moderncss.dev/the-3-css-methods-for-adding-element-borders/) by Stephanie Eckles, each approach comes with its own advantages and disadvantages–especially when it comes to animating the borders.

<figure>
  {% Codepen {
    user: 'kevinpowell',
    id: 'LYRBxQQ',
    height: 585,
    tab: 'result'
  } %}
  <figcaption>Border Animations using <code>outline-offset</code> by Kevin J. Powell</figcaption>
</figure>

An article that recently caught my attention is [Fantastic CSS border animation](​​https://dev.to/chokcoco/fantastic-css-border-animation-5166), where author Coco explored more options. By injecting [generated content](https://developer.mozilla.org/docs/Web/CSS/CSS_Generated_Content) using `::before` and `::after` they create a faux border which is then animated.

What stands out the most to me are the supporting animated visualizations used in the article. They really help explain what exactly is being done to achieve the desired effect.

{% Codepen {
  user: 'Chokcoco',
  id: 'YzGdEMZ',
  height: 485,
  tab: 'result'
} %}

By fading the white layer in and out, it becomes clear how the colored lines are animated.

## Retaining the box model

A disadvantage of using Generated Content to imitate a border is that you end up with a broken [box model](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/The_box_model): the content can now obscure the faux border because said “border” is painted underneath. To mitigate, you have to apply the desired `border-width` as the `padding`.

To have a true border–and thus retain the workings of the box model–you can use [multiple backgrounds](https://developer.mozilla.org/docs/Web/CSS/CSS_Backgrounds_and_Borders/Using_multiple_backgrounds) which you then stretch out into the border area.

### The basics

Let’s start by creating a dotted border and adding the multiple backgrounds.

```css
/* Size of the border */
--border-size: 0.5rem;

/* Create a dotted border */
border: var(--border-size) dotted lime;

/* Create two background layers:
   1. A white semi-transparent
   2. A layer with the colored boxes
 */
background-image:
  linear-gradient(to right, rgb(255 255 255 / 0.5), rgb(255 255 255 / 0.5)),

  conic-gradient(
    from 45deg,
    #d53e33 0deg 90deg,
    #fbb300 90deg 180deg,
    #377af5 180deg 270deg,
    #399953 270deg 360deg
  )
;
```

{% Codepen {
  user: 'bramus',
  id: 'NWYaJrB',
  height: 485,
  tab: 'result'
} %}

### Sizing the backgrounds

As you can see there is something funny going on with those backgrounds here: they are painted into the border, but the `conic-gradient` one is all wrong. That’s because it is not sized appropriately. To solve this problem, you need to stretch out the backgrounds so they take up all the space.

```css
background-position: calc(var(--border-size) * -1) calc(var(--border-size) * -1);
background-size: calc(var(--border-size) * 2 + 100%) calc(var(--border-size) * 2 + 100%);
```


{% Codepen {
  user: 'bramus',
  id: 'rNdGRMB',
  height: 485,
  tab: 'result'
} %}

### Shrinking the white background layer

With the backgrounds taking up all the space now, the semi-transparent layer needs to be shrunk down again. Instead of fiddling with `background-size` again, there is an easier way to do so: use [`background-clip`](https://developer.mozilla.org/docs/Web/CSS/background-clip) and set it to `padding-box`. That way the background is no longer drawn underneath the area of the border.

{% BrowserCompat 'css.properties.background-clip' %}

```css
background-clip:
  padding-box, /* Clip white semi-transparent to the padding-box */
  border-box /* Clip colored boxes to the border-box (default) */
;
```

{% Codepen {
  user: 'bramus',
  id: 'eYMGrdv',
  height: 785,
  tab: 'result'
} %}

Finally, make the border `transparent` to have the full effect.

```css
border: 0.3rem dotted transparent;
```

{% Codepen {
  user: 'bramus',
  id: 'PoRJLGQ',
  height: 485,
  tab: 'result'
} %}

### Animation

To restore animation of the border, you can manipulate the start angle of the `conic-gradient`.

```css
--angle: 0deg;
conic-gradient(
  from var(--angle),
  #d53e33 0deg 90deg,
  #fbb300 90deg 180deg,
  #377af5 180deg 270deg,
  #399953 270deg 360deg
);
```

Thanks to [@property](/at-property) this becomes a breeze in browsers that support it:

{% BrowserCompat 'css.at-rules.property' %}

```css
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}
```

All combined, the code becomes this:

{% Codepen {
  user: 'bramus',
  id: 'VwXMvbM',
  height: 485,
  tab: 'result'
} %}

## Bonus Content: `border-image`

A [previously covered](/conic-gradient-border/) approach to draw a gradient border is to use CSS [`border-image`](https://developer.mozilla.org/docs/Web/CSS/border-image).

{% BrowserCompat 'css.properties.border-image' %}

It allows for more simplified code as you do not need to deal with overlapping backgrounds. Animation can be applied in the same manner as before.

```css
/* Create a border */
border: 0.5rem solid transparent;

/* Paint an image in the border */
border-image:
  conic-gradient(
    from var(--angle),
    #d53e33 0deg 90deg,
    #fbb300 90deg 180deg,
    #377af5 180deg 270deg,
    #399953 270deg 360deg
  ) 1
;
```

{% Codepen {
  user: 'bramus',
  id: 'ZExXVMJ',
  height: 485,
  tab: 'result'
} %}

However, you’ll notice a few things no longer work with this approach:

- The `border-image` does not follow the `border-radius`; it will always remain rectangular
- When setting `border-image-slice` to fill, the `border-image` is not painted underneath the set `background` but on top. This can be troublesome if you want the background to be semi-transparent.

## In closing

There’s a multitude of possibilities to animate borders in CSS. Depending on the use-case, you might lean into one or the other.
