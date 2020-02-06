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

<!-- TODO: Verify cut score for failure. -->

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that keep the main thread busy for longer than 4&nbsp;seconds
during load:

<figure class="w-figure">
  <img class="w-screenshot" src="mainthread-work-breakdown.png" alt="A screenshot of the Lighthouse Minimize main thread work audit">
</figure>

To help you identify the sources of main thread load,
Lighthouse shows a breakdown of where CPU time was spent
while the browser loaded your page.

{% include 'content/lighthouse-performance/scoring.njk' %}

## How to reduce load on the main thread

Many activities, like parsing CSS and laying out the page,
can keep the main thread busy.
However, parsing, compiling, and executing JavaScript is often the biggest source of work on the main thread.

Consider these tactics to improve JavaScript performance during page load:

{% include 'content/lighthouse-performance/js-perf.njk' %}

## Resources

- [Source code for **Minimize main thread work** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/mainthread-work-breakdown.js)
- [Main thread (MDN)](https://developer.mozilla.org/en-US/docs/Glossary/Main_thread)
- [Inside look at modern web browser (part 3)](https://developers.google.com/web/updates/2018/09/inside-browser-part3)
