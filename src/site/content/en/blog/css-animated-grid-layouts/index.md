---
layout: post
title: CSS Animated Grid Layouts
authors:
  - bramus
subhead: >
  In CSS Grid, the `grid-template-columns` and `grid-template-rows` properties allow you to define line names and track sizing of grid columns and rows, respectively. Supporting interpolation for these properties allows grid layouts to smoothly transition between states, instead of snapping at the halfway point of an animation or transition.
description: >
  In CSS Grid, the `grid-template-columns` and `grid-template-rows` properties allow you to define line names and track sizing of grid columns and rows, respectively. Supporting interpolation for these properties allows grid layouts to smoothly transition between states, instead of snapping at the halfway point of an animation or transition.
date: 2022-10-25
hero: image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/DBUXaF63Cw1X5wMlI7Jh.jpg
alt: Two people in a museum watching a Mondrian painting.
tags:
  - blog
  - css
  - newly-interoperable
---

{% Aside 'celebration' %}
This web feature is now available in all three browser engines!
{% endAside %}

{% BrowserCompat 'css.properties.grid-template-columns.animation' %}

## Value Interpolation in CSS

In CSS you can smoothly transition properties from one value to the other using the `transition` property.

```css
#target {
  opacity: 0.5;
  transition: opacity ease-in-out 0.25s;
}

#target:hover {
  opacity: 1;
}
```

The rendering engine will automatically detect the type of the targeted property’s value, and use that information to smoothly transition to the new value.

For example:

- Transitioning `opacity` from `0` to `1`?
  That’s a numerical interpolation.
- Transitioning `background-color` from `white` to `black`?
  Fade between the source and target colors.
- Transitioning `width`?
  Interpolate numerically, converting units along the way if needed.

The same applies to CSS animations, where the browser will do value interpolation between keyframes.

{% Aside %}
When using Custom Properties, [use `@property`](/at-property) to indicate which type they are. That way the browser knows how to transition from one value to the other.
{% endAside %}

## Interpolating `grid-template-columns` and `grid-template-rows`

Thanks to our contributors at Microsoft, Chrome–as of version 107–is able to interpolate `grid-template-columns` and `grid-template-rows` values.

Grid layouts can smoothly transition between states, instead of snapping at the halfway point of an animation or transition.

In the demo below a grid is showing several avatars. To conserve space, the avatars are laid out on top of each other by limiting the width of each column using `grid-template-columns`. On hover, each column is given more space.

```css
.avatars {
  display: grid;
  gap: 0.35em;

  grid-auto-flow: column;
  grid-template-columns: repeat(4, 2em);
  transition: all ease-in-out 0.25s;
}

.avatars:hover {
  grid-template-columns: repeat(4, 4em);
}
```

With the `transition` property in place, the grid smoothly interpolates between values.

{% Codepen {
  user: 'web-dot-dev',
  id: 'XWqVowx',
  height: 480,
  theme: 'light',
  tab: 'result'
} %}

The effect also applies to animations that change the `grid-template-columns` or `grid-template-rows` values.

{% Codepen {
  user: 'web-dot-dev',
  id: 'jOxRdzw',
  height: 780,
  theme: 'light',
  tab: 'result'
} %}

Photo by [Ernest Ojeh](https://unsplash.com/@namzo) on [Unsplash](https://unsplash.com/photos/rTpPZD9PAk4)
