---
layout: pattern
title: 12-span grid
description: A grid broken up into 12 segments where you can place areas onto the tracks evenly.
date: 2021-11-03
height: 400
---

<figure>
  <video controls autoplay loop muted playsinline>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/06-12-span-1.mp4'>
  </video>
</figure>

Another classic: the 12-span grid. You can quickly write grids in CSS with the `repeat()` function. Using: `repeat(12, 1fr);` for the grid template columns gives you 12 columns each of `1fr`.

```css/2,6
.parent {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.child-span-12 {
  grid-column: 1 / 13;
}
```

Now you have a 12 column track grid, you can place child elements on the grid. One way to do this would be to place them using grid lines. For example, `grid-column: 1 / 13` would span all the way from the first line to the last (13th) and span 12 columns. `grid-column: 1 / 5;` would span the first four.

<figure>
  <video controls autoplay loop muted playsinline>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/06-12-span-2.mp4'>
  </video>
</figure>

Another way to write this is by using the `span` keyword. With `span`, you set the starting line and then how many columns to span into from that starting point. In this case, `grid-column: 1 / span 12` would be equivalent to `grid-column: 1 / 13`, and `grid-column: 2 / span 6` would be equivalent to `grid-column: 2 / 8`.

```css/1
.child-span-12 {
  grid-column: 1 / span 12;
}
```
