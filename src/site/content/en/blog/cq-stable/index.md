---
layout: post
title: Container queries land in stable browsers
subhead: >
  Celebrating size container query and container query units landing in stable browsers.
description: >
  This week size container queries and container query units are landing in all stable browsers.
date: 2023-02-14
authors:
  - unakravets
hero: image/HodOHWjMnbNw56hvNASHWSgZyAf2/CIEGE8v8IvH4MDgI7EfO.jpg
alt: 'TBD'
thumbnail: image/HodOHWjMnbNw56hvNASHWSgZyAf2/CIEGE8v8IvH4MDgI7EfO.jpg
tags:
  - css
---

{% Aside 'celebration' %}
This web feature is now available in all three major browser engines!
{% endAside %}

Container query love is in the air! This Valentine’s day, size container queries and container query units are stable in all modern browsers.

– support table –  

With container queries you can query  the styling information of a parent element, such as its `inline-size`. With media queries, you could query the size of the viewport,  container queries enable components that can change based on where they are in the UI.


{% Img src="image/HodOHWjMnbNw56hvNASHWSgZyAf2/n97pThL5vsttcRrVGmJy.avif", alt="Media query vs container query.", width="800", height="372" %}


Container queries are especially handy for responsive design and reusable components. For example, enabling a card component that can lay out in one way when placed in a sidebar, and in a different configuration within a product grid.

## Using container queries

To use container queries, first set containment on a parent element. Do this by setting a `container-type` on the parent container, or use the `container` shorthand to give it both a type and name simultaneously:


```css
.card-container {
  container-type: card / inline-size;
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

– visual –

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
  height: 450,
  tab: 'result'
} %}

– screenshot of the heart in 3 different browsers, all at different inline sizes –
