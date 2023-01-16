---
layout: pattern
title: Sample pattern
subhead: >-
  A catchy subhead that previews the content and is a bit wordy to test what
  happens when a subhead wraps.
description: Sample pattern
date: 2022-10-10
authors:
  - thomassteiner
height: 800
static:
  - assets/fugu.png
  - assets/fugu.svg
---

The pattern layout supports the full range of markdown elements/blocks as demonstrated in
the [example post](/handbook/content-types/example-post).

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at.

{% Aside 'codelab' %}
[Sample link](#)
{% endAside %}

## Image, Inline

<figure data-float="right">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WHh2eQoyBxylhgPdYOis.png", alt="", width="200", height="306" %}
  <figcaption>
    Inline right, outlined image.
  </figcaption>
</figure>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem. Integer et erat ac mi scelerisque suscipit et vitae nulla. Aliquam
scelerisque efficitur ante ut facilisis. Aenean et risus fringilla, hendrerit
sapien et, tincidunt orci. Aenean sed tellus aliquam, consectetur metus in,
tempus enim.

## Sample snippet

```js
const button = document.querySelector('button');

button.addEventListener('click', async () => {
  console.log('Testing 123');
});
```

## Demo
