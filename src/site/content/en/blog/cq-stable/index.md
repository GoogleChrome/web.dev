---
layout: post
title: Container queries land in stable browsers
subhead: >
  This Valentine's day, we're celebrating size container queries and container query units landing in all stable browsers.
description: >
  This week size container queries and container query units are landing in all stable browsers.
date: 2023-02-14
authors:
  - una
hero: image/HodOHWjMnbNw56hvNASHWSgZyAf2/CIEGE8v8IvH4MDgI7EfO.jpg
alt: 'TBD'
thumbnail: image/HodOHWjMnbNw56hvNASHWSgZyAf2/CIEGE8v8IvH4MDgI7EfO.jpg
tags:
  - blog
  - css
  - newly-interoperable
---

{% Aside 'celebration' %}
This web feature is now available in all three major browser engines!
{% endAside %}

Container query love is in the air! This Valentine’s day, size container queries and container query units are stable in all modern browsers.

{% BrowserCompat 'css.at-rules.container' %}

With container queries you can query  the styling information of a parent element, such as its `inline-size`. With media queries, you could query the size of the viewport,  container queries enable components that can change based on where they are in the UI.

{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/hmzfwE5nyg017bX0GEeP.png", alt="Media queries vs container queries.", width="800", height="388" %}

Container queries are especially handy for responsive design and reusable components. For example, enabling a card component that can lay out in one way when placed in a sidebar, and in a different configuration within a product grid.

## Using container queries

To use container queries, first set containment on a parent element. Do this by setting a `container-type` on the parent container, or use the `container` shorthand to give it both a type and name simultaneously:


```css
.card-container {
  container: card / inline-size;
}
```

Setting the `container-type` to `inline-size` queries the inline-direction size of the parent. In latin languages like English, this would be the width of the card, as the text flows inline from left to right.


Now, you can use that container to apply styles to any of its children using `@container`:


```css
.card-child {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

@container (max-width: 400px) {
 .card-child {
  grid-template-columns: 1fr;
 }
}
```

{% Codepen {
  user: 'web-dot-dev',
  id: 'ZEMzNGj',
  height: 600,
  tab: 'result'
} %}

{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/2MWkjhnK2TLqZ3S63NfK.mp4", controls=true, autoplay=true, loop=true, muted=true %}

Additionally, you can use [container query length unit values](https://developer.mozilla.org/docs/Web/CSS/CSS_Container_Queries#container_query_length_units) in the same way that you would viewport-based unit values. The difference being that the container units correspond to the container rather than the viewport. The following example demonstrates responsive typography using container query units and the `clamp()` function to give a minimum and maximum size value:

```css
.card-child h2 {
  font-size: clamp(2rem, 15cqi, 4rem);
}
```

The `15cqi` above refers to 15% of the container’s inline size. The `clamp()` function gives this a minimum value of 2rem, and a maximum of 4rem. In the meantime, if `15cqi` is between these values, the text will shrink and grow correspondingly.

## A container query Valentine
To celebrate the container query love this holiday, we’ve made a Valentine for you all to enjoy, regardless of what (latest version) stable browser you’re viewing this in!

{% Codepen {
  user: 'web-dot-dev',
  id: 'rNrbPQw',
  height: 700,
  tab: 'result'
} %}

{% Video src="video/HodOHWjMnbNw56hvNASHWSgZyAf2/ge0SICG5Hoyy6EEm4zpv.mp4", controls=true, loop=true, muted=true %}
