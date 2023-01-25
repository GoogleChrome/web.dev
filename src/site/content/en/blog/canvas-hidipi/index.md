---
layout: post
title: High DPI Canvas
authors:
  - paullewis
date: 2012-08-25
tags:
  - blog
---

## Introduction

HiDPI screens are lovely, they make everything look smoother and cleaner. But they also present a new set of challenges to developers. In this article we are going to take a look into the unique challenges of drawing images in the canvas in the context of HiDPI screens.

## The devicePixelRatio property

Let's start at the beginning. Back before we had HiDPI screens a pixel was a pixel (if we ignore zooming and scaling for a bit) and that was it, you didn't really need to change anything around. If you set something to be 100px wide that was all there was to it. Then the first few HiDPI mobile handsets started popping up with the slightly enigmatic devicePixelRatio property on the window object and available for use in media queries. What this property allowed us to do was understand the ratio of how pixel values (which we call the logical pixel value) in - say - CSS would translate to the __actual__ number of pixels the device would use when it came to rendering. In the case of an iPhone 4S, which has a devicePixelRatio of 2, you will see that a 100px logical value equates to a 200px device value.

That's interesting, but what does that mean for us developers? Well in the early days we all started to notice that our images were being upscaled by these devices. We were creating images at the logical pixel width of our elements and, when they were drawn out, they would be upscaled by the devicePixelRatio and they'd be blurry.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/1TY8FIbQ4pLaiSsWlxbm.png", alt="An image being upscaled and blurred due to the devicePixelRatio", width="600", height="180" %}
    <figcaption>Figure 1 - An image being upscaled and blurred due to the devicePixelRatio</figcaption>
</figure>

The de facto solution to this has been to create images scaled up by the devicePixelRatio and then use CSS to scale it down by the same amount, and the same is true for canvas!

```js
function setupCanvas(canvas) {
  // Get the device pixel ratio, falling back to 1.
  var dpr = window.devicePixelRatio || 1;
  // Get the size of the canvas in CSS pixels.
  var rect = canvas.getBoundingClientRect();
  // Give the canvas pixel dimensions of their CSS
  // size * the device pixel ratio.
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  var ctx = canvas.getContext('2d');
  // Scale all drawing operations by the dpr, so you
  // don't have to worry about the difference.
  ctx.scale(dpr, dpr);
  return ctx;
}

// Now this line will be the same size on the page
// but will look sharper on high-DPI devices!
var ctx = setupCanvas(document.querySelector('.my-canvas'));
ctx.lineWidth = 5;
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(200, 200);
ctx.stroke();
```
