---
layout: pattern
title: GIF-style video
description: Use MP4 video as a placement for GIFs
date: 2021-08-19
updated: 2021-08-19
height: 400
---

Animated GIFs can be 5-20x larger than the equivalent MP4 video. However,
MP4 videos can be styled to look and feel like GIFs by including the
`autoplay loop muted playsinline` attributes on the `<video>` tag. In addition, to prevent layout
shifts, make sure to set the `width` and `height` attributes. For instructions
on converting GIFs to MP4, see [Create MPEG
Videos](https://web.dev/efficient-animated-content/#create-mpeg-videos).
