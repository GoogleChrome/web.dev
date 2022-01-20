---
layout: pattern
title: Pancake stack
description: Commonly referred to as a sticky footer, this layout is often used for both websites and apps.
date: 2021-11-03
---

<figure>
  <video controls autoplay loop muted playsinline>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/04-pancake-stack.mp4'>
  </video>
</figure>

Unlike the [deconstructed pancake](/patterns/layout/deconstructed-pancake), this example does not wrap its children when the screen size changes. Commonly referred to as a [sticky footer](https://developer.mozilla.org/docs/Web/CSS/Layout_cookbook/Sticky_footers), this layout is used for both websites and apps, across mobile applications (the footer is commonly a toolbar), and websites—in particular single page applications.

Adding `display: grid` to the component will give you a single column grid, however the main area will only be as tall as the content with the footer below it.

To make the footer stick to the bottom,  add:

```css/2
.parent {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
```

This sets the header and footer content to automatically take the size of their children, and applies the remaining space (`1fr`) to the main area, while the `auto` sized row will take the size of the minimum content of its children, so as that content increases in size, the row itself will grow to adjust.
