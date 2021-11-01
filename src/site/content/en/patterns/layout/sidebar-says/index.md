---
layout: pattern
title: Sidebar Says
description: A layout where the sidebar is given a minimum and maximum safe area size, and the rest of the content fills the available space.
date: 2021-10-20
draft: true
---

<figure class='w-figure'>
  <video controls autoplay loop muted playsinline class='w-screenshot'>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/03-sidebar-says.mp4'>
  </video>
</figure>

This demo takes advantage of the [minmax](https://developer.mozilla.org/docs/Web/CSS/minmax) function for grid layouts. What we're doing here is setting the minimum sidebar size to be `100px`, but on larger screens, letting that stretch out to `25%`. The sidebar will always take up `25%` of its parent's horizontal space until that `25%` becomes smaller than `100px`.

Add this as a value of grid-template-columns with the following value:
`minmax(100px, 25%) 1fr`. The item in the first column (the sidebar in this case) gets a `minmax` of `100px` at `25%`, and the second item (the `main` section here) takes up the rest of the space as a single `1fr` track.

```css/2
.parent {
  display: grid;
  grid-template-columns: minmax(100px, 25%) 1fr;
}
```
