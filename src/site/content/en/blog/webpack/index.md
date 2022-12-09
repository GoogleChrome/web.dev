---
layout: post
title: Webpack
subhead: |
  Bundling for modern web applications
date: 2018-02-08
updated: 2018-08-17
authors:
  - addyosmani
description: |
  Bundling for modern web applications
tags:
  - blog # blog is a required tag for the article to show up in the blog.

---

Modern web applications often use a **bundling tool** to create a production
"bundle" of files (scripts, stylesheets, etc.) that is
[optimized](/optimizing-content-efficiency-javascript-startup-optimization/),
[minified](/optimizing-content-efficiency-optimize-encoding-and-transfer/)
and can be downloaded in less time by your users. In **Web Performance
Optimization with webpack**, we will walk through how to effectively optimize
site resources using [webpack](https://webpack.js.org/). This can help users
load and interact with your sites more quickly.

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/14nTVvq5PEzMdpksfenJ.png", alt="Webpack logo.", width="800", height="311" %}
</figure>

webpack is one of the most popular bundling tools in use today. Taking advantage
of its features for optimizing modern code,
[code-splitting](/use-long-term-caching/#lazy-load-code-that-you-dont-need-right-now)
scripts into critical and non-critical pieces and stripping out unused code (to
name but a few optimizations) can ensure your app has a minimal network and
processing cost.

<figure>
    {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/9IVFhBrXUo9CU1Hwl0FK.png", alt="Before and after applying JavaScript
  optimizations. Time-to-Interactive is improved", width="800", height="575" %}
  <p>Inspired by <a href="http://www.susielu.com/data-viz/bundle-buddy">
    Code-splitting in Bundle Buddy</a> by Susie Lu</p>
</figure>

{% Aside %}
We created a training app to play with optimizations described in this
article. Try squeezing the most out of it to practice the tips:
[`webpack-training-project`](https://github.com/GoogleChromeLabs/webpack-training-project)
{% endAside %}

Let’s get started by looking at optimizing one of the costliest resources in a
modern app – JavaScript.

* [Decrease Front-end
  Size](/web/fundamentals/performance/webpack/decrease-frontend-size)
* [Make Use of Long-term
  Caching](/web/fundamentals/performance/webpack/use-long-term-caching)
* [Monitor and analyze the
  app](/web/fundamentals/performance/webpack/monitor-and-analyze)
* [Conclusions](/webpack-conclusion/)


