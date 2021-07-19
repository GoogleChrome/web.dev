---
title: 'CSS Utilities'
permalink: '/design-system/css-utilities/index.html'
layout: 'design-system-documentation.njk'
---

## Flow

The flow utility provides flow and rhythm between direct sibling elements.
Where `--flow-space` is not defined: the default value is 1em, which equals
the font size of the affected element.

[More info](https://piccalil.li/quick-tip/flow-utility/)

```html
<article class="flow">
  <p>
    Nullam id dolor id nibh ultricies vehicula ut id elit. Nulla vitae elit
    libero, a pharetra augue.
  </p>
  <p>
    Nulla vitae elit libero, a pharetra augue. Cras justo odio, dapibus ac
    facilisis in, egestas eget quam.
  </p>
  <p style="--flow-space: 2em">
    Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
  </p>
</article>
```

You can also use the `flow-space` generated utility that allows you to use
the **spacing design tokens**. For example, If you want that last paragraph
to have a `Size 2` spacing, you would change the code to the following:

```html
<article class="flow">
  <p>
    Nullam id dolor id nibh ultricies vehicula ut id elit. Nulla vitae elit
    libero, a pharetra augue.
  </p>
  <p>
    Nulla vitae elit libero, a pharetra augue. Cras justo odio, dapibus ac
    facilisis in, egestas eget quam.
  </p>
  <p class="flow-space-size-2">
    Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
  </p>
</article>
```

## Focus ring

A box-shadow powered focus ring that uses a transparent outline to provide
focus for high contrast users. The box-shadow helps to support border-radius
elements.

```html
<button class="my-cool-button focus-ring">My cool button</button>
```

You can customise the `--focus-ring-padding-color`, which creates the
illusion of space, but it's actually just the background.

```css
.my-cool-button {
  --focus-ring-padding-color: goldenrod;
}
```

## Region

A container that provides consistent vertical spacing for
chunks/sections/regions of content.

```html
<div class="region">I have consistent space now.</div>
```

## Visually hidden

If you hide an element with `display: none`, it can also hide it from assistive
technology, such as screen readers. This utility allows you to get the effect
of `display: none`, without the a11y issues.

```html
<p class="visually-hidden">
  You can’t see me, but a screen reader can still access me
</p>
```

## Wrapper

A horizontally centered wrapper that provides a consistent central column.
This should be used in all contexts where the content needs to be in the
center of the page.

```html
<div class="wrapper">I am centered and have a nice, consistent gutter.</div>
```
