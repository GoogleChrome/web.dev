---
layout: post
title: First Contentful Paint
description: |
  Learn about Lighthouse's First Contentful Paint metric and
  how to measure and optimize it.
date: 2019-05-02
updated: 2019-10-10
web_lighthouse:
  - first-contentful-paint
---

First Contentful Paint (FCP) is one of six metrics
tracked in the **Performance** section of the Lighthouse report.
Each metric captures some aspect of page load speed.

Lighthouse displays FCP in seconds:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Y8maVyZwGyS6gdyRjYWb.png", alt="A screenshot of the Lighthouse First Contentful Paint audit", width="800", height="588", class="w-screenshot" %}
</figure>

## What FCP measures

FCP measures how long it takes the browser
to render the first piece of DOM content
after a user navigates to your page.
Images, non-white `<canvas>` elements, and SVGs on your page are considered
DOM content; anything inside an iframe _isn't_ included.

## How Lighthouse determines your FCP score

Your FCP score is a comparison of your page's FCP time
and FCP times for real websites, based on
[data from the HTTP Archive](https://httparchive.org/reports/loading-speed#fcp).
For example, sites performing in the ninety-ninth percentile
render FCP in about 1.5&nbsp;seconds.
If your website's FCP is 1.5 seconds,
your FCP score is 99.

This table shows how to interpret your FCP score:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>FCP time<br>(in seconds)</th>
        <th>Color-coding</th>
        <th>FCP score<br>(HTTP Archive percentile)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–2</td>
        <td>Green (fast)</td>
        <td>75–100</td>
      </tr>
      <tr>
        <td>2–4</td>
        <td>Orange (moderate)</td>
        <td>50–74</td>
      </tr>
      <tr>
        <td>Over 4</td>
        <td>Red (slow)</td>
        <td>0–49</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## How to improve your FCP score

One issue that's particularly important for FCP is
font load time. Check out the
[Ensure text remains visible during webfont load](/font-display) post
for ways to speed up your font loads.

## Tracking FCP on real users' devices

To learn how to measure when FCP actually occurs on your users' devices,
see Google's [User-centric Performance Metrics][metrics] page.
The [Tracking FP/FCP][tracking] section describes
how to programmatically access FCP data and submit it to Google Analytics.

See Google's [Assessing Loading Performance in Real Life with Navigation and Resource Timing](https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/)
for more on collecting real-user metrics.

{% include 'content/lighthouse-performance/improve.njk' %}

## Resources

- [Source code for **First Contentful Paint** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/first-contentful-paint.js)
- [Lighthouse v3 Scoring Guide](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Paint Timing specification](https://w3c.github.io/paint-timing)

[metrics]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics
[tracking]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_fpfcp
