---
layout: pattern
title: Deconstructed pancake
description: Create a layout that stretches to fit the space, and snaps to the next line at a minimum size.
date: 2021-11-03
---

This is a common layout for marketing sites, for example, which may have a row of three items, usually with an image, title, and then some text, describing some features of a product. On smaller screens, you'll want those to stack nicely, and expand as you increase the screen size.

By using flexbox for this effect, you won't need media queries to adjust the placement of these elements when the screen resizes.

The [flex](https://developer.mozilla.org/docs/Web/CSS/flex) shorthand stands for: `flex: <flex-grow> <flex-shrink> <flex-basis>`.

## `flex-grow` Stretching

If you want the boxes to stretch and fill the space as they wrap to the next line, set the value of `<flex-grow>` to 1, for example:

```css/5
.parent {
  display: flex;
}

.child {
  flex: 1 1 150px;
}
```

<figure>
  <video controls autoplay loop muted playsinline>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-2.mp4'>
  </video>
</figure>

Now, as you increase or decrease the screen size, these flex items both shrink and grow.

## No stretching

If you want your boxes to fill out to their `<flex-basis>` size, shrink on smaller sizes, but not stretch to fill any additional space, write: `flex: 0 1 <flex-basis>`. In this case, your `<flex-basis>` is 150px:

```css/5
.parent {
  display: flex;
}

.child {
  flex: 0 1 150px;
}
```

<figure>
  <video controls autoplay loop muted playsinline>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-1.mp4'>
  </video>
</figure>
