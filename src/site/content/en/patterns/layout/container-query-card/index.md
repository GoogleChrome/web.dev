---
layout: pattern
title: Container query card ⚠️
description: Card that owns its independent style logic and is styled based on its parent's inline width.
date: 2021-11-03
height: 500
---

{% Aside 'warning' %}
This demo uses an experimental web technology that is not currently supported in all browsers. To try it out, open Chrome Canary and enable the `#enable-container-queries` flag.
{% endAside %}

This demo uses [container queries](https://developer.mozilla.org/docs/Web/CSS/CSS_Container_Queries) to create an intrinsic, responsive card. The card goes from a single-column layout at more narrow sizes to a two-column layout when it is at wider sizes.

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-uploads/video/HodOHWjMnbNw56hvNASHWSgZyAf2/LgWuKF0DH9QhoicKgbvA.mp4">
  </video>
</figure>

To create the container, first set containment on the parent:

```css
/* Set containment on parent */
.container {
  container-name: myContainer;
  container-type: inline-size;
  /* You can also use the shorthand property `container: myContainer / inline-size`.
}
```

You can set some base styles:

```css
.desc {
  display: none;
}

.card {
  text-align: center;
  padding: 0.5rem;
}
```

And update those base styles according to that parent container's inline width:

```css
/* 2-column grid layout at >=350px */
@container (min-width: 350px) {
  .card {
    display: grid;
    grid-template-columns: 40% 1fr;
    align-items: center;
    gap: 1rem;
    text-align: left;
  }
}

/* Display description at >=500px */
@container (min-width: 500px) {
  .desc {
    display: block;
  }
}
```

This means that if you have this exact same component in different parts of your UI, it's able to use its own logic to resize and best fit its container. You have better control over the card's layout than you would if you only had the global viewport to rely on. The following illustrates this by placing the container query card in a grid with varying column widths:

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-uploads/video/HodOHWjMnbNw56hvNASHWSgZyAf2/YkkfwOM5iKqsKo6gn8oF.mp4">
  </video>
</figure>

Explore this [Demo on Codepen](https://codepen.io/una/pen/xxLPwBX)
