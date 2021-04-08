---
layout: post
title: Speed Index
description: |
  Learn about Lighthouse's Speed Index metric and how to optimize it.
date: 2019-05-02
updated: 2019-10-10
web_lighthouse:
  - speed-index
---

Speed Index is one of six metrics
tracked in the **Performance** section of the Lighthouse report.
Each metric captures some aspect of page load speed.

Lighthouse displays Speed Index in seconds:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ksKnQH9tGEzIXsrVoUHR.png", alt="A screenshot of the Lighthouse Speed Index audit", width="800", height="588", class="w-screenshot" %}
</figure>

## What Speed Index measures

Speed Index measures how quickly content is visually displayed during page load.
Lighthouse first captures a video of the page loading in the browser and
computes the visual progression between frames.
Lighthouse then uses the [Speedline Node.js module](https://github.com/paulirish/speedline)
to generate the Speed Index score.

{% Aside %}
Speedline is based on the same principles as the
[original speed index introduced by WebpageTest.org](https://github.com/WPO-Foundation/webpagetest-docs/blob/master/user/Metrics/SpeedIndex.md),
but it computes the visual progression between frames using the
[structural similarity (SSIM) index](https://en.wikipedia.org/wiki/Structural_similarity)
instead of the histogram distance.
{% endAside %}

## How Lighthouse determines your Speed Index score

Your Speed Index score is a comparison of your page's speed index
and the speed indices of real websites, based on
[data from the HTTP Archive](https://bigquery.cloud.google.com/table/httparchive:lighthouse.2019_03_01_mobile?pli=1).

This table shows how to interpret your Speed Index score:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Speed Index<br>(in seconds)</th>
        <th>Color-coding</th>
        <th>Speed Index score</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–4.3</td>
        <td>Green (fast)</td>
        <td>75–100</td>
      </tr>
      <tr>
        <td>4.4–5.8</td>
        <td>Orange (moderate)</td>
        <td>50–74</td>
      </tr>
      <tr>
        <td>Over 5.8</td>
        <td>Red (slow)</td>
        <td>0–49</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## How to improve your Speed Index score

While anything you do to improve page load speed
will improve your Speed Index score,
addressing any issues discovered by these Diagnostic audits
should have a particularly big impact:

- [Minimize main thread work](/mainthread-work-breakdown)
- [Reduce JavaScript execution time](/bootup-time)
- [Ensure text remains visible during webfont load](/font-display)

{% include 'content/lighthouse-performance/improve.njk' %}

## Resources

- [Source code for **Speed Index** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/speed-index.js)
- [Lighthouse v3 Scoring Guide](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Speedline](https://github.com/paulirish/speedline)
- [WebPagetest Speed Index](https://github.com/WPO-Foundation/webpagetest-docs/blob/master/user/Metrics/SpeedIndex.md)
