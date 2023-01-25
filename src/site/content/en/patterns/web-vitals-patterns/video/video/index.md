---
layout: pattern
title: Video
description: This video loads without causing layout shifts and
  displays a poster image.
date: 2021-08-19
updated: 2021-08-19
height: 500
---

When optimizing video for Core Web Vitals make sure to set the `width` and
`height` attributes on the `<video>` tag. Depending on the situation, you may
also want to utilize the `poster` attribute.

* **`width` and `height` attributes**: To prevent layout shifts, set the `width`
  and `height` attributes on the `<video>` tag. This allows the browser to
  determine the dimensions of the video (and reserve the correct amount of
  space) - without having to wait for the video to download.

* **`poster` attribute (optional)**: The
  [`poster`](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-poster)
  attribute specifies the image that should be displayed while a video is
  downloading. If a video is the LCP element, LCP is determined by the time that
  the poster image is rendered - rather than when the overall video loads. If
  this attribute is not specified, the browser will wait until the first frame
  of the video is available, then use this as the poster image; videos without
  a `poster` attribute are currently [not considered for Largest Contentful
  Paint](/lcp/#what-elements-are-considered).

In this example, CSS is used to ensure that the video resizes to fit its
container. This has no impact on Web Vitals but is a useful technique.
