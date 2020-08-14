---
layout: post
title: Avoid non-composited animations
description: How to pass the "Avoid non-composited animations" Lighthouse audit.
date: 2020-08-12
web_lighthouse:
  - non-composited-animations
---

Non-composited animations can appear janky (i.e. not smooth) on low-end phones or when
performance-heavy tasks are running on the main thread. Janky animations can increase the
[Cumulative Layout Shift](/cls/) (CLS) of your page. Reducing CLS will improve your
Lighthouse Performance score.

## Background

The browser's algorithms for converting HTML, CSS, and JavaScript into pixels are collectively known
as the _rendering pipeline_.

<figure class="w-figure">
  <img src="rendering-pipeline.jpg" 
       alt="The rendering pipeline consists of the following sequential steps: 
            JavaScript, Style, Layout, Paint, Composite.">
  <figcaption class="w-figcaption">The rendering pipeline.</figcaption>
</figure>

It's OK if you don't understand what each step of the rendering pipeline means. The key thing to
understand right now is that at each step of the rendering pipeline the browser uses the result of
the previous operation to create new data. For example, if your code does something that triggers
Layout, the Paint and Composite steps need to run again. A non-composited animation is any animation
that triggers one of the earlier steps in the rendering pipeline (Style, Layout, or Paint).
Non-composited animations perform worse because they force the browser to do more work.

Check out the following resources to learn about the rendering pipeline in-depth:

+ [Inside look at modern web browsers (part 3)][inside]
+ [Simplify paint complexity and reduce paint areas][paint]
+ [Stick to compositor-only properties and manage layer count][compositor]

## How Lighthouse detects non-composited animations

When an animation can't be composited, Chrome reports the failure reasons to the DevTools trace,
which is what Lighthouse reads.  Lighthouse lists DOM nodes which have animations that were not
composited along with the failure reason(s) for each animation.

## How to ensure animations are composited

See [Stick to compositor-only properties and manage layer count][compositor] and
[High-performance animations][animations].

## Resources

+ [Source code for the *Avoid non-composited animations* audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/non-composited-animations.js)
+ [Stick to compositor-only properties and manage layer count][compositor]
+ [High-performance animations][animations]
+ [Simplify paint complexity and reduce paint areas][paint]
+ [Inside look at modern web browsers (part 3)][inside]

[compositor]: https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count
[animations]: https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/
[paint]: https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas
[inside]: https://developers.google.com/web/updates/2018/09/inside-browser-part3
