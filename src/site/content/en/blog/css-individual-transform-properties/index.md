---
layout: post
title: Finer grained control over CSS transforms with individual transform properties
subhead: >
  Transform elements with the `translate`, `rotate`, and `scale` properties
authors:
  - bramus
  - dbaron
description: >
  Learn how you can use the individual translate, rotate, and scale CSS properties to approach transforms in an intuitive way.
thumbnail: image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/4KSYYba8wDbfZsycAV23.svg
hero: image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/AtVvxkLmxdp0Mso8Mnnc.svg
is_baseline: true
date: 2022-08-02
updated: 2023-05-10
tags:
  - blog
  - newly-interoperable
---

{% Aside 'celebration' %}
This web feature is now available in all three browser engines!
{% BrowserCompat 'css.properties.rotate' %}
{% endAside %}

{% YouTube id="oDcb3fvtETs", startTime="844" %}

## The CSS `transform` property

To apply transforms to an element, use the [CSS `transform` Property](https://developer.mozilla.org/docs/Web/CSS/transform). The property accepts one or more `<transform-function>`s which get applied one after the other.

```css
.target {
  transform: translateX(50%) rotate(30deg) scale(1.2);
}
```

The targeted element is translated by 50% on the X-axis, rotated by 30 degrees, and finally scaled up to 120%.

While the `transform` property does its work just fine, it becomes a bit tedious when you want to alter any of those values individually.

To change the scale on hover, you must duplicate all functions in the transform property, even though their values remain unchanged.

```css
.target:hover {
  transform: translateX(50%) rotate(30deg) scale(2); /* Only the value of scale() changed */
}
```

## The individual transform properties

Shipping with Chrome 104 are individual properties for CSS transforms. The properties are `scale`, `rotate`, and `translate`, which you can use to individually define those parts of a transformation.

By doing so, Chrome joins Firefox and Safari which already support these properties.

{% BrowserCompat 'css.properties.scale' %}

{% Aside %}
Not all transformation functions have a matching individual property, for example `skewX()` and `matrix()`.
{% endAside %}

Rewriting the preceding `transform` example with the individual properties, your snippet becomes this:

```css
.target {
  translate: 50% 0;
  rotate: 30deg;
  scale: 1.2;
}
```

## Order matters

One key difference between the original CSS `transform` property and the new properties is the order in which the declared transformations get applied.

With `transform`, the transformation functions get applied in the order they’re written–from left (outside) to right (inside).

With the individual transformation properties, the order is not the order in which they are declared.  The order is always the same: first `translate` (outside), then `rotate`, and then `scale` (inside).

That means both of the following code snippets give the same result:

```css
.transform--individual {
  translate: 50% 0;
  rotate: 30deg;
  scale: 1.2;
}

.transform--individual-alt {
  rotate: 30deg;
  translate: 50% 0;
  scale: 1.2;
}
```

In both cases the targeted elements will first be translated by `50%` on the X-axis, then rotated by `30deg`, and finally scaled by `1.2`.

If one of the individual transform properties are declared along with a `transform` property, then the individual transforms get applied first (`translate`, `rotate`, and then `scale`) with the `transform` last (inside). More details are in the spec that defines [how the transformation matrix should be calculated](https://www.w3.org/TR/css-transforms-2/#ctm).

## Animations

The main reason these properties were added is to make animations easier. Say you want to animate an element as follows:

{% Img src="image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/Pn0t3nrqfBg6JhmYFslm.svg", alt="Keyframes graph.", width="800", height="745" %}

### Using `transform`

To implement this animation using `transform`, you’d have to calculate all in-between values for all defined transformations, and include those in each keyframe. For example, to do a rotation at the 10% mark, the values for the other transformations must be calculated as well, because the `transform` property needs all of them.

{% Img src="image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/AF5n6UlhcuQ5UNKemX8M.svg", alt="Keyframes graph with intermediate values calculated.", width="800", height="745" %}

The resulting CSS code becomes this:

```css
@keyframes anim {
  0% { transform: translateX(0%); }
  5% { transform: translateX(5%) rotate(90deg) scale(1.2); }
  10% { transform: translateX(10%) rotate(180deg) scale(1.2); }
  90% { transform: translateX(90%) rotate(180deg) scale(1.2); }
  95% { transform: translateX(95%) rotate(270deg) scale(1.2); }
  100% { transform: translateX(100%) rotate(360deg); }
}

.target {
  animation: anim 2s;
  animation-fill-mode: forwards;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'gOeRMZV',
  height: 360,
  theme: 'dark',
  tab: 'result'
} %}

### Using individual transform properties

With individual transform properties this becomes much easier to write. Instead of dragging all transformations from keyframe to keyframe, you can target each transform individually. You also no longer need to calculate all those in-between values.

```css
@keyframes anim {
  0% { translate: 0% 0; }
  100% { translate: 100% 0; }

  0%, 100% { scale: 1; }
  5%, 95% { scale: 1.2; }

  0% { rotate: 0deg; }
  10%, 90% { rotate: 180deg; }
  100% { rotate: 360deg; }
}

.target {
  animation: anim 2s;
  animation-fill-mode: forwards;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'NWYgrox',
  height: 360,
  theme: 'dark',
  tab: 'result'
} %}

### Using individual transform properties and several keyframes

To make your code modular you can split up each sub-animation into its own set of keyframes.

```css
@keyframes move {
  0% { translate: 0% 0; }
  100% { translate: 100% 0; }
}

@keyframes scale {
  0%, 100% { scale: 1; }
  5%, 95% { scale: 1.2; }
}

@keyframes rotate {
  0% { rotate: 0deg; }
  10%, 90% { rotate: 180deg; }
  100% { rotate: 360deg; }
}

.target {
  animation: move 2s, scale 2s, rotate 2s;
  animation-fill-mode: forwards;
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'poLwbGR',
  height: 360,
  theme: 'dark',
  tab: 'result'
} %}

Thanks to this split you can apply each separate set of keyframes as you like because the `transform` properties–which now have become individual properties–no longer overwrite each other. Above that you can give each transformation a different timing without needing to rewrite the whole lot.

## Performance

Animations using these new properties are just as efficient as animations of the existing `transform` property.

Animations of `translate`, `rotate`, and `scale` run on the compositor the same way that animations of `transform` do, so they’re good for animation performance in [the same way that `transform` is](/animations-guide/).

These new properties also work with the [`will-change`](https://developer.mozilla.org/docs/Web/CSS/will-change) property. In general, it’s best to avoid overusing `will-change` by using it on the minimum number of elements needed, and for as short an amount of time as reasonably possible. But it’s also good to be as specific as possible. For example, if you’re using `will-change` to optimize an animation with the `rotate` and `filter` properties, you should declare this using `will-change: rotate, filter`. This is slightly better than using `will-change: transform, filter` in a case where you’re animating `rotate` and `filter`, because some of the data structures that Chrome creates in advance when you use `will-change` are different for `transform` versus `rotate`.
