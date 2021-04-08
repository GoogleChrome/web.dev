---
layout: post
title: Time to Interactive
description: |
  Learn about Lighthouse's Time to Interactive metric and
  how to measure and optimize it.
date: 2019-05-02
updated: 2019-10-10
web_lighthouse:
  - interactive
---

Time to Interactive (TTI) is one of six metrics
tracked in the **Performance** section of the Lighthouse report.
Each metric captures some aspect of page load speed.

Measuring TTI is important because
some sites optimize content visibility at the expense of interactivity.
This can create a frustrating user experience:
the site appears to be ready, but when the user tries to interact with it,
nothing happens.

Lighthouse displays TTI in seconds:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MOXhGOQxWpolq6nhBleq.png", alt="A screenshot of the Lighthouse Time to Interactive audit", width="800", height="588", class="w-screenshot" %}
</figure>

## What TTI measures

TTI measures how long it takes a page to become _fully_ interactive.
A page is considered fully interactive when:

- The page displays useful content, which is measured by the
[First Contentful Paint](/first-contentful-paint),
- Event handlers are registered for most visible page elements, and
- The page responds to user interactions within 50&nbsp;milliseconds.

{% Aside %}
Both [First CPU Idle](/first-cpu-idle) and TTI
measure when the page is ready for user input.
First CPU Idle occurs when the user can _start_ to interact with the page;
TTI occurs when the user is _fully_ able to interact with the page.
See Google's [First Interactive And Consistently Interactive](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)
if you're interested in the exact calculation for each metric.
{% endAside %}

## How Lighthouse determines your TTI score

The TTI score is a comparison of your page's TTI
and the TTI for real websites, based on
[data from the HTTP Archive](https://httparchive.org/reports/loading-speed#ttci).
For example, sites performing in the ninety-ninth percentile
render TTI in about 2.2&nbsp;seconds.
If your website's TTI is 2.2&nbsp;seconds, your TTI score is 99.

This table shows how to interpret your TTI score:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>TTI metric<br>(in seconds)</th>
        <th>Color-coding</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–3.8</td>
        <td>Green (fast)</td>
      </tr>
      <tr>
        <td>3.9–7.3</td>
        <td>Orange (moderate)</td>
      </tr>
      <tr>
        <td>Over 7.3</td>
        <td>Red (slow)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## How to improve your TTI score

One improvement that can have a particularly big effect on TTI is
deferring or removing unnecessary JavaScript work.
Look for opportunities to [optimize your JavaScript](/fast#optimize-your-javascript).
In particular, consider [reducing JavaScript payloads with code splitting](/reduce-javascript-payloads-with-code-splitting)
and [applying the PRPL pattern](/apply-instant-loading-with-prpl). [Optimizing third-party JavaScript][3p]
also yields significant improvements for some sites.

These two Diagnostic audits provide additional opportunities
to reduce JavaScript work:

- [Minimize main thread work](/mainthread-work-breakdown)
- [Reduce JavaScript execution time](/bootup-time)

## Tracking TTI on real users' devices

To learn how to measure when TTI actually occurs on your users' devices,
see Google's [User-centric Performance Metrics][metrics] page.
The [Tracking TTI][tracking] section describes
how to programmatically access TTI data and submit it to Google Analytics.

{% Aside %}
TTI can be difficult to track in the wild.
Tracking [First Input Delay](https://developers.google.com/web/updates/2018/05/first-input-delay)
can be a good proxy for TTI.
{% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## Resources

- [Source code for **Time to Interactive** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/interactive.js)
- [Lighthouse v3 Scoring Guide](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [First Interactive And Consistently Interactive](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)
- [JavaScript Start-up Optimization](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/javascript-startup-optimization/)
- [Reduce JavaScript Payloads with Tree Shaking](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/)
- [Optimize third-party resources][3p]

[metrics]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics
[tracking]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_tti
[3p]: /fast/#optimize-your-third-party-resources
