---
layout: post
title: Largest Contentful Paint
description: |
  Learn about Lighthouse's Largest Contentful Paint metric and
  how to measure and optimize it.
date: 2019-10-14
web_lighthouse:
  - largest-contentful-paint
---

<!-- TODO https://web.dev/largest-contentful-paint already exists.
     What should the URL for this page be? -->

Largest Contentful Paint (LCP) is one of the metrics
tracked in the **Performance** section of the Lighthouse report.
Each metric captures some aspect of page load speed.

Lighthouse displays LCP in seconds:

<!-- TODO update this once LCP lands in the report UI. -->

<figure class="w-figure">
  <img class="w-screenshot" src="cat.jpg"
       alt="A screenshot of the Lighthouse Largest Contentful Paint audit">
</figure>

## What LCP measures

LCP measures when the largest content element in the viewport is
rendered to the screen. This approximates when the main content of the page is
visible to users. See [Largest Contentful Paint defined][definition] for more
details on how LCP is determined.

## How Lighthouse determines your LCP score

Native support for LCP launched in [Chrome 77][launch]. Lighthouse extracts LCP data from
[Chrome's tracing tool](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool).

<!-- TODO explain how the LCP data is mapped to a score between 0 and 100. -->

The table below shows how to interpret your LCP score:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>LCP time<br>(in seconds)</th>
        <th>Color-coding</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>TODO</td>
        <td>Green (fast)</td>
      </tr>
      <tr>
        <td>TODO</td>
        <td>Orange (average)</td>
      </tr>
      <tr>
        <td>TODO</td>
        <td>Red (slow)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## How to improve your LCP score

See [How to improve Largest Contentful Paint on your site][improve].

## Resources

- [Source code for **Largest Contentful Paint** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/largest-contentful-paint.js)
- [Largest Contentful Paint](/largest-contentful-paint/)
- [Largest Contentful Paint API](https://wicg.github.io/largest-contentful-paint/)
- [New in Chrome 77: Largest Contentful Paint][launch]

[definition]: /largest-contentful-paint/#largest-contentful-paint-defined
[launch]: https://developers.google.com/web/updates/2019/09/nic77#lcp
[improve]: /largest-contentful-paint#how-to-improve-largest-contentful-paint-on-your-site
