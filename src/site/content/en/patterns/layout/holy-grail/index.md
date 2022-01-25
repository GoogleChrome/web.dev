---
layout: pattern
title: Holy grail layout
description: Classic layout with a header, footer, and two sidebars flanking a main content area.
date: 2021-11-03
---

<figure>
  <video controls autoplay loop muted playsinline>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/05-holy-grail.mp4'>
  </video>
</figure>

For this classic holy grail layout, there is a header, footer, left sidebar, right sidebar, and main content. It's similar to the previous layout, but now with sidebars!

To write this entire grid using a single line of code, use the `grid-template` property. This enables you to set both the rows and columns at the same time.

The property and value pair is: `grid-template: auto 1fr auto / auto 1fr auto`. The slash between the first and second space-separated lists is the break between rows and columns.

```css/2
.parent {
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
}
```

As in the last example, where the header and footer had auto-sized content, here the left and right sidebar are automatically sized based on their children's intrinsic size. However, this time it is horizontal size (width) instead of vertical (height).
