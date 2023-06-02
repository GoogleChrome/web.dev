---
title: Use conic gradients to create a cool border
subhead: >
  Conic gradients can be used to create some interesting effects, such as this nice border example.
date: 2022-05-27
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/xK2kXKqAmfaofSEN5XJ3.jpg
author: rachelandrew
is_baseline: true
tags:
  - blog
  - css
---

This [CodePen](https://codepen.io/argyleink/pen/pogZxaZ) created by [Adam
Argyle](/authors/adamargyle/), originally shared via this
[tweet](https://twitter.com/argyleink/status/1282889809782927360) on Twitter,
shows how to use a [conic
gradient](https://developer.mozilla.org/docs/Web/CSS/gradient/conic-gradient) to
create a border.

```css
.conic-gradient-border {
  border: 25px solid;
  border-image-slice: 1;
  border-image-source: conic-gradient(
    hsl(100 100% 60%),
    hsl(200 100% 60%),
    hsl(100 100% 60%)
  );
}
```

[Terry Mun](https://twitter.com/teddyrised) creatively
[forked](https://twitter.com/teddyrised/status/1283326930717114370?s=20&t=S-qpKkaAetTCgPmQ6HNjxQ)
Adam's codepen and created this
[CodePen](https://codepen.io/terrymun/pen/mdVGjMB). Move your mouse over the
element and you'll see the gradient change, thanks to a little bit of JavaScript
updating a CSS custom property that stores the rotation angle.

{% Codepen {
  user: 'terrymun',
  id: 'mdVGjMB',
  height: 500,
  theme: 'dark',
  tab: 'result'
} %}

These examples uses the
[`border-image-source`](https://developer.mozilla.org/docs/Web/CSS/border-image-source)
property. This property sets the source image used to create an element's
border. As with other properties that accept an image value, any CSS gradient
type is valid too.

### `border-image-source`

{% BrowserCompat 'css.properties.border-image-source' %}

### Conic gradient

{% BrowserCompat 'css.types.image.gradient.conic-gradient' %}
