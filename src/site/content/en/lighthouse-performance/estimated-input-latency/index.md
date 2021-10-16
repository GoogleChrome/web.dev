---
layout: post
title: Estimated Input Latency
description: |
  Learn about Lighthouse's Estimated Input Latency metric and
  how to measure and optimize it.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - estimated-input-latency
---

Estimated Input Latency is one of six metrics
tracked in the **Performance** section of the Lighthouse report.
Each metric captures some aspect of page load speed.

The Lighthouse reports displays Estimated Input Latency in milliseconds:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ofvYff7EQ5oDMME20mmF.png", alt="A screenshot of the Lighthouse Estimated Input Latency audit", width="800", height="512", class="w-screenshot w-screenshot--filled" %}
</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## What Estimated Input Latency measures

Estimated Input Latency is an estimate of how long your app takes to respond to user input
during the busiest 5&nbsp;second window of page load.
The timing of this audit is from
[First Meaningful Paint](/first-meaningful-paint)
to the end of the trace, which is roughly 5&nbsp;seconds after
[Time to Interactive](/interactive).
If your latency is higher than 50&nbsp;ms, users may perceive your app as laggy.

The [RAIL performance model](https://developers.google.com/web/fundamentals/performance/rail)
recommends that apps respond to user input within 100&nbsp;ms,
while Lighthouse's Estimated Input Latency target score is 50&nbsp;ms. Why?
Lighthouse uses a proxy metric—availability of the main thread—to measure
how well your app responds to user input.

Lighthouse assumes that your app needs 50&nbsp;ms to completely respond to the user's input
(from performing any JavaScript executions to physically painting the new pixels to the screen).
If your main thread is unavailable for 50&nbsp;ms or more,
that doesn't leave enough time for your app to complete the response.

Approximately 90% of users will encounter Lighthouse's reported amount of input latency or less.
10% of users can expect higher latency.

## How to improve your Estimated Input Latency score

To make your app respond to user input faster,
optimize how your code runs in the browser.
Check out the series of techniques outlined on Google's
[Rendering Performance](https://developers.google.com/web/fundamentals/performance/rendering/) page.
These tips range from offloading computation to web workers to free up the main thread,
to refactoring your CSS selectors to perform fewer calculations,
to using CSS properties that minimize the amount of browser-intensive operations.

{% Aside 'caution' %}
The Estimated Input Latency audit isn't a complete measurement of input latency.
It doesn't measure how long your app truly takes to respond to a user input;
nor does it does measure that your app's response to the user's input is visually complete.
{% endAside %}

## How to measure Estimated Input Latency manually

To measure Estimated Input Latency manually,
make a recording with the Chrome DevTools Timeline.
See [Do less main thread work](https://developers.google.com/web/tools/chrome-devtools/speed/get-started#main)
for an example of the workflow.
The basic idea is to start a recording, perform the user input that you want to measure,
stop the recording, and then analyze the flame chart to ensure that
[all stages of the pixel pipeline](https://developers.google.com/web/fundamentals/performance/rendering/#the_pixel_pipeline)
are complete within 50&nbsp;ms.

## Resources

- [Source code for **Estimated Input Latency** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/estimated-input-latency.js)
- [Lighthouse v3 Scoring Guide](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Measure Performance with the RAIL Model](https://developers.google.com/web/fundamentals/performance/rail)
- [Rendering Performance](https://developers.google.com/web/fundamentals/performance/rendering/)
- [Optimize Website Speed With Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/speed/get-started)
