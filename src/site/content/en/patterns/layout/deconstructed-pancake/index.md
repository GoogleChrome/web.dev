---
layout: pattern
title: Deconstructed Pancake
description: Create a layout that stretches to fit the space, and snaps to the next line at a minimum size.
date: 2021-10-20
draft: true
---

This is a common layout for marketing sites, for example, which may have a row of 3 items, usually with an image, title, and then some text, describing some features of a product. On smaller screens, you'll want those to stack nicely, and expand as you increase the screen size.

By using Flexbox for this effect, you won't need media queries to adjust the placement of these elements when the screen resizes.

The [flex](https://developer.mozilla.org/docs/Web/CSS/flex) shorthand stands for: `flex: <flex-grow> <flex-shrink> <flex-basis>`.

## `flex-grow` Stretching

If you want the boxes to stretch and fill the space as they wrap to the next line, set the <flex-grow> to 1, so it would look like:

```css/5
.parent {
  display: flex;
}

.child {
  flex: 1 1 150px;
}
```

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-2.mp4'>
  </video>
</figure>

Now, as you increase or decrease the screen size,  these flex items both shrink and grow.

## No Stretching

If you want your boxes to fill out to their `<flex-basis>` size, shrink on smaller sizes, but not stretch to fill any additional space, write: `flex: 0 1 <flex-basis>`. In this case, your `<flex-basis>` is 150px so it looks like:

```css/5
.parent {
  display: flex;
}

.child {
  flex: 0 1 150px;
}
```

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-1.mp4'>
  </video>
</figure>
