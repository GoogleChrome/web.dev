---
layout: pattern
title: <picture> tag
description: Avoid layout shifts when using the <picture> tag
date: 2021-08-18
updated: 2021-08-18
height: 300
---

The
[`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
tag provides a mechanism for displaying diffearent images depending on the size
of the browser window. This practice is sometimes known as [art
direction](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#art_direction).

Currently, there is not a comprehensive solution for avoiding [layout
shifts](https://web.dev/debug-layout-shifts/) when using art direction. If the
[`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source)
tag and `<img>` tag images all have the same aspect ratio, then setting the
`width` and `height` attributes on the `<img>` tag will prevent layout shifts.
However, if these images have different aspect ratios, this approach does not
work. Browsers are looking into the the best way to address this issue - for
example, considering whether image dimensions should be specified on `<source>`
tags.
