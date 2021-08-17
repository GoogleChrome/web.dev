---
layout: pattern
title: <img> tag
description: Use the width and height attributes to avoid layout shifts
date: 2021-08-17
updated: 2021-08-17
---

Setting the `width` and `height` attributes on `<img>` tags helps prevent
[layout shifts](https://web.dev/debug-layout-shifts/). The values of the `width`
and `height` attributes should reflect the dimensions of the image itself (that
is, its [intrinsic
size](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size)) -
rather than dimensions that the image will be displayed at. This information
allows the browser to reserve the correct amount of space for an image.

When working with `<img>` tags, it is sometimes helpful to also use the
[`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
property. `object-fit` allows you to specify how an image should be resized to
fit its container - for example, when an image is displayed in a container that
is smaller or larger than its intrinsic size.