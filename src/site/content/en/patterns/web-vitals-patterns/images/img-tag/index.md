---
layout: pattern
title: <img> tag
description: This image loads without causing layout shifts.
date: 2021-08-17
updated: 2021-08-17
height: 400
---

Setting the `width` and `height` attributes on `<img>` tags helps prevent
[layout shifts](/debug-layout-shifts/). This information
allows the browser to reserve the correct amount of space for the image.

* **Set the `width` and `height` attributes:** The values of these attributes should
  be set to match the dimensions of the image itself (that is, its [intrinsic
  size](https://developer.mozilla.org/docs/Glossary/Intrinsic_Size)) -
  rather than dimensions that the image will be displayed at.

* **Adjust image styling as needed:** Depending on the image's existing styling,
  adding `width` and `height` attributes may cause the image to render
  differently. In many cases, this can be fixed by adding `height: auto` or
  `width: auto` to the existing styling.

| Previous CSS styling | Change to |
|------------------------|-----|
| img { width: 100%; } | img { width: 100%; height: auto; }|
| img { max-width: 100%; } | img { max-width: 100% height: auto; }|
| img { height: 100%; } | img { height: 100%; width: auto }|
