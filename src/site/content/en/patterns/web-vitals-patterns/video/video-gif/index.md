---
layout: pattern
title: GIF-style video
description: This &ltvideo&gt; tag looks and feels like a
  GIF but is far more performant.
date: 2021-08-19
updated: 2021-08-19
height: 500
---

Animated GIFs can be 5-20x larger than the equivalent MP4 video. However, MP4
videos can be configured to look and feel like GIFs by including the `autoplay loop
muted playsinline` attributes on the `<video>` tag. In addition, to prevent
layout shifts, make sure to set the `width` and `height` attributes. For
instructions on converting GIFs to MP4, see [Create MPEG
Videos](https://developer.chrome.com/docs/lighthouse/performance/efficient-animated-content/#create-mpeg-videos).
