---
layout: pattern
title: Line up
description: A layout where the sidebar is given a minimum and maximum safe area size, and the rest of the content fills the available space.
date: 2021-11-03
---

<figure>
  <video controls autoplay loop muted playsinline>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/08-lineup.mp4'>
  </video>
</figure>

The main point demonstrated here is the use of `justify-content: space-between`, which places the first and last child elements at the edges of their bounding box, with the remaining space evenly distributed between the elements. For these cards, they are placed in a flexbox display mode, with the direction being set to column using `flex-direction: column`.

This places the title, description, and image block in a vertical column inside of the parent card. Then, applying `justify-content: space-between` anchors the first (title) and last (image block) elements to the edges of the flex container, and the descriptive text in between those gets placed with equal spacing to each endpoint.

```css/3
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```
