---
layout: pattern
title: Line Up
description: A layout where the sidebar is given a minimum and maximum safe area size, and the rest of the content fills the available space.
date: 2021-10-20
draft: true
---

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/08-lineup.mp4'>
  </video>
</figure>

For the next layout, the main point to demonstrate here is `justify-content: space-between`, which places the first and last child elements at the edges of their bounding box, with the remaining space evenly distributed between the elements. For these cards, they are placed in a Flexbox display mode, with the direction being set to column using `flex-direction: column`.

This places the title, description, and image block in a vertical column inside of the parent card. Then, applying `justify-content: space-between` anchors the first (title) and last (image block) elements to the edges of the flexbox, and the descriptive text in between those gets placed with equal spacing to each endpoint.

```css/3
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```
