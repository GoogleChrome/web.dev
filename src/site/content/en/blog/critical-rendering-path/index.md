---
layout: post
title: Critical Rendering Path
authors:
  - ilyagrigorik
date: 2014-03-31
updated: 2018-08-17
description: >
  Optimizing the critical rendering path refers to prioritizing the display of content that relates to the current user action.
---

_Optimizing the critical rendering path_ refers to prioritizing the display of
content that relates to the current user action.

Delivering a fast web experience requires a lot of work by the browser. Most of
this work is hidden from us as web developers: we write the markup, and a nice
looking page comes out on the screen. But how exactly does the browser go from
consuming our HTML, CSS, and JavaScript to rendered pixels on the screen?

Optimizing for performance is all about understanding what happens in these
intermediate steps between receiving the HTML, CSS, and JavaScript bytes and
the required processing to turn them into rendered pixels - that's
the **critical rendering path**.

{% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/yIiIUEYItai4zX07ZJda.png", alt="progressive page rendering", width="611", height="300" %}

By optimizing the critical rendering path we can significantly improve the
time to first render of our pages. Further, understanding the critical
rendering path also serves as a foundation for building well-performing
interactive applications. The interactive updates process is the same, just done in a continuous loop and ideally at 60 frames per second!
But first, an overview of how the browser displays a simple page.

## Critical Rendering Path

You will learn how to optimize any website for speed by diving into the details of how mobile and desktop browsers render pages.
You’ll learn about the Critical Rendering Path, or the set of steps browsers must take to convert HTML, CSS and JavaScript into living,
breathing websites. From there, you’ll start exploring and experimenting with tools to measure performance and simple strategies to deliver the first
pixels to the screen as early as possible. You’ll learn how to dive into recommendations from PageSpeed Insights and the Timeline view of Google Chrome’s Developer
Tools to find the data you need to achieve immediate performance boosts!

This is a free course offered through [Udacity](https://www.udacity.com/course/website-performance-optimization--ud884).

## Additional resources

- [Constructing the Object Model](https://web.dev/critical-rendering-path-constructing-the-object-model/)
- [Render-tree Construction, Layout, and Paint](https://web.dev/critical-rendering-path-render-tree-construction/)
- [Render Blocking CSS](https://web.dev/critical-rendering-path-render-blocking-css/)
- [Adding Interactivity with JavaScript](https://web.dev/critical-rendering-path-adding-interactivity-with-javascript/)

- [Measuring the Critical Rendering Path](critical-rendering-path-measure-crp/)
- [Analyzing Critical Rendering Path Performance](https://web.dev/critical-rendering-path-analyzing-crp/)
- [Optimizing the Critical Rendering Path](https://web.dev/critical-rendering-path-optimizing-critical-rendering-path/)
- [PageSpeed Rules and Recommendations](https://web.dev/critical-rendering-path-page-speed-rules-and-recommendations/)

## Feedback {: #feedback }
