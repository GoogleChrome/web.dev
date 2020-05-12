---
layout: post
title: Use video formats for animated content
description: |
  Learn about the efficient-animated-content audit.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - efficient-animated-content
---

The Opportunities section of your Lighthouse report lists
all animated GIFs, along with estimated savings in seconds
achieved by converting these GIFs to video:

<figure class="w-figure">
  <img class="w-screenshot" src="efficient-animated-content.png" alt="A screenshot of the Lighthouse Use video formats for animated content audit">
</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Why you should replace animated GIFs with video

Large GIFs are inefficient for delivering animated content.
By converting large GIFs to videos, you can save big on users' bandwidth.
Consider using MPEG4/WebM videos for animations and PNG/WebP
for static images instead of GIF to save network bytes.

## Create MPEG videos
There are a number of ways to convert GIFs to video.
[FFmpeg](https://ffmpeg.org/) is the tool used in this guide.
To use FFmpeg to convert the GIF, `my-animation.gif` to an MP4 video,
run the following command in your console:

`ffmpeg -i my-animation.gif my-animation.mp4`  

This tells FFmpeg to take `my-animation.gif` as the input,
signified by the `-i` flag,
and to convert it to a video called `my-animation.mp4`.

## Create WebM videos

WebM videos are much smaller than MP4 videos,
but not all browsers support WebM so it makes sense to generate both.

To use FFmpeg to convert `my-animation.gif` to a WebM video,
run the following command in your console:

`ffmpeg -i my-animation.gif -c vp9 -b:v 0 -crf 41 my-animation.webm`

## Replace the GIF image with a video
Animated GIFs have three key traits that a video needs to replicate:

- They play automatically.
- They loop continuously (usually, but it is possible to prevent looping).
- They're silent.

Luckily, you can recreate these behaviors using the `<video>` element.

```html
<video autoplay loop muted playsinline>  
  <source src="my-animation.webm" type="video/webm">  
  <source src="my-animation.mp4" type="video/mp4">  
</video>  
```

## Resources

- [Source code for **Use video formats for animated content** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/efficient-animated-content.js)
- [Replace animated GIFs with video for faster page loads](/replace-gifs-with-videos)
- [Replace GIFs with video codelab](/codelab-replace-gifs-with-video)
