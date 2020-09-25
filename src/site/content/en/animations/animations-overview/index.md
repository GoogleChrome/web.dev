---
layout: post
title: Why are some animations slow?
authors:
  - rachelandrew
description: |
  Animating well is core to a great web experience.
  This post explains why certain types of animation perform better than others.
date: 2020-09-25
tags:
  - performance
---

Modern browsers can animate two properties cheaply `transform` and `opacity`.
If you animate anything else,
the chances are you're not going to hit a silky smooth 60fps.
This post explains why this is the case.

## Animation performance and frame rate

It is widely accepted that a frame rate of 60 frames per second (fps) is the target when animating anything on the web.
This frame rate will ensure that your animations look smooth.
On the web a frame is the time that it takes to do all of the work required to update and repaint the screen.
If each frame does not complete within 16.7ms, then the delay will be perceivable by your user.

## Animations and the browser

To display something on a webpage the browser has to go through the following steps.
When you animate something on a page that has already loaded
these steps have to happen again.
This process begins from the step that has to be changed in order to allow the animation to take place.

1. **Style**: Calculate the styles that apply to the elements.
2. **Layout**: Generate the geometry and position for each element.
3. **Paint**: Fill out the pixels for each element into layers.
4. **Composite**: Draw the layers out to screen.

Animating something that changes layout,
is therefore more expensive than animating something that only changes compositing.
As the layout change will involve the layout, paint, and composite steps.

{% Aside %}
For an in-depth look at exactly how this process happens in the browser
read [From Braces to Pixels](https://alistapart.com/article/braces-to-pixels/).
{% endAside %}

You should try to restrict animations to changes to `translate`, `scale`,
and `rotation` using the [`transform`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) property,
and [`opacity`](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity).
These things can be animated relatively cheaply.

## Animating layout properties

Layout changes involve calculating the geometry (position and size) of all the elements affected by the change.
If you change one element,
the geometry of other elements may need to be recalculated.
For example, if you change the width of the `<html>` element any of its children may be affected.
Due to the way elements overflow and affect one another,
changes further down the tree can sometimes result in layout calculations all the way back up to the top.

The larger the tree of visible elements,
the longer it takes to perform layout calculations.

For example, to animate an item from the top left of a box to the bottom right you could change the values to `top` and `left`.
This would involve layout.

```
.box {
  position: absolute;
  top: 10px;
  left: 10px;
  animation: move 3s ease infinite;
}

@keyframes move {
  50% {
     top: calc(90vh - 160px);
     left: calc(90vw - 200px);
  }
}
```

[See this example on Glitch](https://glitch.com/~animation-with-top-left).

Instead, you could use `transform` and all of the work could be done in the composite step, skipping layout and paint.

```
.box {
  position: absolute;
  top: 10px;
  left: 10px;
  animation: move 3s ease infinite;
}

@keyframes move {
  50% {
     transform: translate(calc(90vw - 200px), calc(90vh - 160px));
  }
}
```

[See this example on Glitch](https://glitch.com/~animation-with-transform).

## Animating paint properties

If layout has been triggered then the next step is to move onto paint.
In addition, animating some properties may allow the browser to skip the layout step and start with paint.

The majority of painting in modern browsers is done in software rasterizers.
Depending on how the elements in your app are grouped into layers,
other elements besides the one that changed may also need to be painted.

## Animating composite properties

The last step is composite,
if your property only triggers this step then it is likely to perform well.

This is why the `opacity` property is included in the list of things which are cheap to animate.
As long as this property is in its own layer, changes to it can be handled by the GPU during the compositing step.
Chromium-based browsers and WebKit create a new layer for any element which has a CSS transition or animation on `opacity`.

Many developers use `translateZ(0)` or `translate3d(0,0,0)` to manually force layer creation.
Forcing layers to be created ensures both that the layer is painted and ready-to-go as soon as the animation starts,
and that there's no sudden change in appearance due to antialiasing changes.
Promoting layers should done sparingly, though;
having too many layers can cause jank as GPUs have limited video memory.

{% Aside %}
For an in-depth look at compositing see the article
[GPU Animation: Doing It Right](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)
{% endAside %}

## Conclusion

When making a decision to animate something,
consider if it is possible to use the `transform` or `opacity` properties rather than a more expensive animation.
