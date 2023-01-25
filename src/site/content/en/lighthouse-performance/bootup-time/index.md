---
layout: post
title: Reduce JavaScript execution time
description: |
  Learn how JavaScript execution can slow down your page performance
  and how you can speed it up.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - bootup-time
tags:
  - memory
---

When your JavaScript takes a long time to execute,
it slows down your page performance in several ways:

- **Network cost**

  More bytes equals longer download times.

- **Parse and compile cost**

  JavaScript gets parsed and compiled on the main thread.
  When the main thread is busy, the page can't respond to user input.

- **Execution cost**

  JavaScript is also executed on the main thread.
  If your page runs a lot of code before it's really needed,
  that also delays your [Time To Interactive](/interactive),
  which is one of the key metrics related to how users perceive your page speed.

- **Memory cost**

  If your JavaScript holds on to a lot of references,
  it can potentially consume a lot of memory.
  Pages appear janky or slow when they consume a lot of memory.
  Memory leaks can cause your page to freeze up completely.

## How the Lighthouse JavaScript execution time audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
shows a warning when JavaScript execution takes longer than 2&nbsp;seconds.
The audit fails when execution takes longer than 3.5&nbsp;seconds:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BoomMoQNycPXsy34DZZs.png", alt="A screenshot of the Lighthouse Reduce JavaScript execution time audit", width="800", height="321", class="w-screenshot" %}
</figure>

To help you identify the biggest contributors to execution time,
Lighthouse reports the time spent executing, evaluating, and parsing
each JavaScript file that your page loads.

{% include 'content/lighthouse-performance/scoring.njk' %}

## How to speed up JavaScript execution

{% include 'content/lighthouse-performance/js-perf.njk' %}

## Resources

[Source code for **Reduce JavaScript execution time** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/bootup-time.js)
