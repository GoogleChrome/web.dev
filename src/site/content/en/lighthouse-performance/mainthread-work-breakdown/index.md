---
layout: post
title: Minimize main thread work
description: |
  Learn about the browser's main thread and how you can optimize your web page
  to reduce main thread load and improve performance.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - mainthread-work-breakdown
---

The browser's [renderer process](https://developers.google.com/web/updates/2018/09/inside-browser-part3)
is what turns your code into a web page that your users can interact with.
By default, the [main thread](https://developer.mozilla.org/en-US/docs/Glossary/Main_thread)
of the renderer process typically handles most code:
it parses the HTML and builds the DOM, parses the CSS and applies the specified styles,
and parses, evaluates, and executes the JavaScript.

The main thread also processes user events.
So, any time the main thread is busy doing something else,
your web page may not respond to user interactions,
leading to a bad experience.

## How the Lighthouse main thread work audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that keep the main thread busy for longer than 4&nbsp;seconds
during load:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kcHYoy1vfoJX76JVyM9T.png", alt="A screenshot of the Lighthouse Minimize main thread work audit", width="800", height="408", class="w-screenshot" %}
</figure>

To help you identify the sources of main thread load,
Lighthouse shows a breakdown of where CPU time was spent
while the browser loaded your page.

{% include 'content/lighthouse-performance/scoring.njk' %}

## How to minimize main thread work

The sections below are organized based on the categories that Lighthouse reports.
See [The anatomy of a frame](https://aerotwist.com/blog/the-anatomy-of-a-frame/)
for an overview of how Chromium renders web pages.

See [Do less main thread work](https://developers.google.com/web/tools/chrome-devtools/speed/get-started#main)
to learn how to use Chrome DevTools to to investigate exactly what your main thread is doing
as the page loads.

### Script evaluation

* [Optimize third-party JavaScript](/fast/#optimize-your-third-party-resources)
* [Debounce your input handlers](https://developers.google.com/web/fundamentals/performance/rendering/debounce-your-input-handlers)
* [Use web workers](/off-main-thread/)

### Style and layout

* [Reduce the scope and complexity of style calculations](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations)
* [Avoid large, complex layouts and layout thrashing](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing)

### Rendering

* [Stick to compositor only properties and manage layer count](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)
* [Simplify paint complexity and reduce paint areas](https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas)

### Parsing HTML and CSS

* [Extract critical CSS](/extract-critical-css/)
* [Minify CSS](/minify-css/)
* [Defer non-critical CSS](/defer-non-critical-css/)

### Script parsing and compilation

* [Reduce JavaScript payloads with code splitting](/reduce-javascript-payloads-with-code-splitting/)
* [Remove unused code](/remove-unused-code/)

### Garbage collection

* [Monitor your web page's total memory usage with `measureMemory()`](/monitor-total-page-memory-usage/)

## Resources

- [Source code for **Minimize main thread work** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/mainthread-work-breakdown.js)
- [Main thread (MDN)](https://developer.mozilla.org/en-US/docs/Glossary/Main_thread)
- [Inside look at modern web browser (part 3)](https://developers.google.com/web/updates/2018/09/inside-browser-part3)
