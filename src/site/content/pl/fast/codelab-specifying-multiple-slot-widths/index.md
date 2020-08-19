---
layout: codelab
title: Specifying multiple slot widths
authors:
  - katiehempenius
description: |
  In this codelab, learn how to use the sizes attribute to size images correctly
  depending on the user's viewport.
glitch: responsive-images-multiple-sizes
date: 2018-11-05
related_post: serve-responsive-images
tags:
  - performance
---

## Try out this demo

{% Instruction 'preview' %}

- Reload the app in differently sized browser windows to see the browser load
different images and use different layouts at different browser sizes.

## View the code

- Checkout `index.html` for the code that makes this work:

```html
<img src="flower.jpg"
  srcset="flower-small.jpg 480w, flower-large.jpg 800w"
  sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 800px">
```

## What's going on here?

The value of the `sizes` attribute dictates that image display width will be:
"100% of the viewport width" on viewports up to 480px wide, "50% of the viewport
width" on screens 481–1024px wide, and 800px on screens wider than 1024px. These
widths match the widths specified in the CSS.

The ability to specify multiple slot widths accommodates page layouts that use
different styling (i.e. image widths) for different viewport sizes.

## How to specify multiple slot widths

- Use a comma-separated list to specify multiple slot widths. Each list item,
except for the last item, consists of a media condition (e.g. `max-width` or
`min-width`) and a slot width.
- The last item in this list is the default slot width. It is the default, so
you do not need to specify a media condition.
- You can list as many slot widths as you want - the number of images listed in
`srcset` does not matter.
- Slot width can be specified using a variety of units. The following are all
valid widths:

- `100px`
- `33vw`
- `20em`
- `calc(50vw-10px)`

The following is not a valid width:

- `25%` (percentages cannot be used with the sizes attribute)
