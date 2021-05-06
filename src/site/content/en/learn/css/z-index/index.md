---
title: Z-index and stacking contexts
description: >
  In this module find out how to control the order in which things layer on top of each other,
  by using z-index and the stacking context.
authors:
  - andybell
date: 2021-05-03
---

Say you've got a couple of elements that are absolutely positioned,
and are supposed to be positioned on top of each other.
You might write a bit of a HTML like this:

```html
<div class="stacked-items">
	<div class="item-1">Item 1</div>
	<div class="item-2">Item 2</div>
</div>
```

But which one sits on top of the other, by default?
To know which item would do that,
you need to understand z-index and stacking contexts.

## Z-index

The [`z-index`](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)
property explicitly sets a layer order for HTML based on the 3D space of the browser—the Z axis.
This is the axis which shows which layers are closer to and further from you.
The vertical axis on the web is the Y axis and the horizontal axis is the X axis.

{% Img
src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/PDglCLEK0OJY5LIHwpkI.svg",
alt="Each axis surrounding the element",
width="760",
height="467" %}

The `z-index` property accepts a numerical value which can be a positive or negative number.
Elements will appear above another element if they have a higher `z-index` value.
If no `z-index` is set on your elements
then the default behaviour is that document source order dictates the Z axis.
This means that elements further down the document sit on top of elements that appear before them.

{% Codepen {
  user: 'web-dot-dev',
  id: 'GRrMEjZ'
} %}

In normal flow,
if you set a specific value for `z-index` and it isn't working,
you need to set the element's `position` value to anything other than `static`.
This is a common place where people struggle with `z-index`.

{% Codepen {
  user: 'web-dot-dev',
  id: 'bGgoRzv'
} %}

This isn't the case if you are in a flexbox or grid context, though,
because you can modify the z-index of flex or grid items without adding `position: relative`.

{% Codepen {
  user: 'web-dot-dev',
  id: 'QWdqMOP'
} %}

## Negative z-index

To set an element *behind* another element,
add a negative value for `z-index`.

```css
.my-element {
	background: rgb(232 240 254 / 0.4);
}

.my-element .child {
	position: relative;
	z-index: -1;
}
```

As long as `.my-element` has the initial value for `z-index` of `auto`,
the `.child` element will sit behind it.

{% Codepen {
  user: 'web-dot-dev',
  id: 'XWpeayj',
  height: 400
} %}

Add the following CSS to `.my-element`,
and the `.child` element will not sit behind it anymore.

```css/1-2
.my-element {
  position: relative;
  z-index: 0;
  background: rgb(232 240 254 / 0.4);
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'bGgorZy',
  height: 400
} %}

Because `.my-element` now has a `position` value that's not `static`
and a `z-index` value that's not `auto`,
it has created a new **stacking context**.
This means that even if you set `.child` to have a `z-index` of `-999`,
it would still not sit behind `.my-parent`.

## Stacking context

A stacking context is a group of elements that have a common parent and move up and down the z axis together.

{% Codepen {
  user: 'web-dot-dev',
  id: 'JjErOXV',
  height: 600
} %}

In this example,
the first parent element has a `z-index` of `1`,
so creates a new stacking context.
Its child element has a `z-index` of `999`.
Next to this parent, there is another parent element with one child.
The parent has a `z-index` of `2` and the child element also has a `z-index` of `2`.
Because both parents create a stacking context,
the `z-index` of all children is based on that of their parent.

The `z-index` of elements inside of a stacking context
are always relative to the parent's current order in its own stacking context.

{% Aside %}
The `<html>` element is a stacking context itself and nothing can ever go behind it.
You can put stuff behind the `<body>` until you create a stacking context with it.
{% endAside %}

## Creating a stacking context

You don't need to apply `z-index` and `position` to create a new
[stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context).
You can create a new stacking context by adding a value for properties such as `opacity`,
`will-change` and `transform`.
You can
[see a full list of properties here](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context).

To explain what a composite layer is, imagine a web page is a canvas.
A browser takes your HTML and CSS and uses these to work out how big to make the canvas.
It then paints the page on this canvas.
If an element was to change—say,
it changes position—the browser then has to go back and re-work out what to paint.

To help with performance,
the browser creates new composite layers which are layered on top of the canvas.
These are a bit like post-it notes:
moving one around and changing it doesn't have a huge impact on the overall canvas.
A new composite layer is created for elements with `opacity`,
`transform` and `will-change` because these are very likely to change,
so the browser makes sure that change is performant as possible by using the GPU to apply style adjustments.

{% Aside %}
You can also create a stacking context by adding a `filter` and setting `backface-visibility: hidden`.
{% endAside %}

## Resources

- [Forcing layers](https://surma.dev/things/forcing-layers/)
- [Animations Guide: Force layer creation](https://web.dev/animations-guide/#force)
- [Understanding z-index](https://ishadeed.com/article/understanding-z-index/)
