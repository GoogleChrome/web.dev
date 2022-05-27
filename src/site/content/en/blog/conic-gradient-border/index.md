---
title: Use conic gradients to create a cool border
subhead: >
  Conic gradients can be used to create some interesting effects, such as this nice border example. 
date: 2022-05-27
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/xK2kXKqAmfaofSEN5XJ3.jpg
author: rachelandrew
tags:
  - blog
  - css
---

This [CodePen](https://codepen.io/terrymun/pen/mdVGjMB) created by Terry Mun shows how to use a [conic gradient](https://developer.mozilla.org/docs/Web/CSS/gradient/conic-gradient) to create a border. Move your mouse over the element and you'll see the gradient change, thanks to a little bit of JavaScript updating a CSS custom property that stores the rotation angle.

{% Codepen {
  user: 'terrymun',
  id: 'mdVGjMB',
  height: 300,
  theme: 'dark',
  tab: 'result'
} %}

The example uses the [`border-image-source`](https://developer.mozilla.org/docs/Web/CSS/border-image-source) property. This property sets the source image used to create an element's border. As with other properties that accept an image value, any CSS gradient type is valid too.

### `border-image-source`

{% BrowserCompat 'css.properties.border-image-source' %}

### Conic gradient

{% BrowserCompat 'css.types.image.gradient.conic-gradient' %}
