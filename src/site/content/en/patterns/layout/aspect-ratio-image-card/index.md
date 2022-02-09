---
layout: pattern
title: Aspect ratio image card
description: Maintains the aspect ratio of an image in a card, while letting you resize the card.
date: 2021-11-03
---

<figure>
  <video controls autoplay loop muted playsinline>
    <source src='https://storage.googleapis.com/web-dev-assets/one-line-layouts/10-aspectratio.mp4'>
  </video>
</figure>

With the [`aspect-ratio`](https://developer.mozilla.org/docs/Web/CSS/aspect-ratio) property, as you resize the card, the green visual block maintains this 16 x 9 aspect ratio. We are respecting the aspect ratio with `aspect-ratio: 16 / 9`.

```css/1
.video {
  aspect-ratio: 16 / 9;
}
```

To maintain a 16 x 9 aspect ratio without this property, you'd need to use a [`padding-top` hack](https://css-tricks.com/aspect-ratio-boxes/) and give it a padding of `56.25%` to set a top-to-width ratio. We will soon have a property for this to avoid the hack and the need to calculate the percentage. You can make a square with `1 / 1` ratio, a 2 to 1 ratio with `2 / 1`, and really just anything you need for this image to scale with a set size ratio.


```css/1
.square {
  aspect-ratio: 1 / 1;
}
```