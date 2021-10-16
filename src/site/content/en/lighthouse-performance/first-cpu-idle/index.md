---
layout: post
title: First CPU Idle
description: |
  Learn about Lighthouse's First CPU Idle metric and how to optimize it.
date: 2019-05-02
updated: 2019-11-05
web_lighthouse:
  - first-cpu-idle
---

{% Aside 'caution' %}
  First CPU Idle is deprecated in Lighthouse 6.0. While some have found that First CPU Idle
  offers a more meaningful measurement than [Time To Interactive](/interactive), the difference
  isn't significant enough to justify maintaining two similar metrics. Moving forward, 
  consider using [Total Blocking Time](/lighthouse-total-blocking-time/) and
  [Time To Interactive](/interactive) instead.
{% endAside %}

First CPU Idle is one of six metrics
tracked in the **Performance** section of the Lighthouse report.
Each metric captures some aspect of page load speed.

Lighthouse displays First CPU Idle in seconds:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Du6ioJcZ6qNBBniOIKN2.png", alt="A screenshot of the Lighthouse First CPU Idle audit", width="800", height="588", class="w-screenshot" %}
</figure>

## What First CPU Idle measures

First CPU Idle measures how long it takes a page to become _minimally_ interactive.
A page is considered minimally interactive when:

- Most—but not necessarily all—UI elements on the screen are interactive, and
- The page responds, on average, to most user input
  in a reasonable amount of time.

{% Aside %}
Both First CPU Idle and
[Time to Interactive](/interactive)
measure when the page is ready for user input.
First CPU Idle occurs when the user can _start_ to interact with the page;
TTI occurs when the user is _fully_ able to interact with the page.
See Google's [First Interactive And Consistently Interactive](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)
if you're interested in the exact calculation for each metric.
{% endAside %}

## How Lighthouse determines your First CPU Idle score

Your First CPU Idle score is a comparison of your page's First CPU Idle time
and First CPU Idle times for real websites, based on
[data from the HTTP Archive](https://httparchive.org/reports/loading-speed#ttfi).
For example, sites performing in the ninety-fifth percentile
render First CPU Idle in about 3&nbsp;seconds.
If your website's First CPU Idle is 3&nbsp;seconds,
your First CPU Idle score is 95.

This table shows how to interpret your First CPU Idle score:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>First CPU Idle metric<br>(in seconds)</th>
        <th>Color-coding</th>
        <th>First CPU Idle score<br>(HTTP Archive percentile)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–4.7</td>
        <td>Green (fast)</td>
        <td>75–100</td>
      </tr>
      <tr>
        <td>4.8–6.5</td>
        <td>Orange (moderate)</td>
        <td>50–74</td>
      </tr>
      <tr>
        <td>Over 6.5</td>
        <td>Red (slow)</td>
        <td>0–49</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## How to improve your First CPU Idle score

See [How to improve your TTI score][tti]. The strategies for improving First CPU Idle are
largely the same as the strategies for improving TTI.

{% include 'content/lighthouse-performance/improve.njk' %}

## Resources

- [Source code for **First CPU Idle** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/first-cpu-idle.js)
- [Lighthouse v3 Scoring Guide](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [First Interactive And Consistently Interactive](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)
- [Time to Interactive](/interactive/)

[tti]: /interactive/#how-to-improve-your-tti-score
