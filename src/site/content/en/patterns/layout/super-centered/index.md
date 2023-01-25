---
layout: pattern
title: Super centered
description: Centering a child div in one line of code
date: 2021-11-03
---

Use `place-items: center` to center an element within its parent.

First specify grid as the display method, and then write `place-items: center` on the same element. `place-items` is a shorthand to set both `align-items` and `justify-items` at once. By setting it to `center`, both `align-items` and `justify-items` are set to `center`.

```css
.parent {
  display: grid;
  place-items: center;
}
```

This enables the content to be perfectly centered within the parent, regardless of intrinsic size.
