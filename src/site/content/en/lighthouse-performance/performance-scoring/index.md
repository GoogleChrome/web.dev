---
layout: post
title: Lighthouse performance scoring
description: |
  Learn how Lighthouse generates the overall Performance score for your page.
subhead: How Lighthouse calculates your overall Performance score
date: 2019-09-19
updated: 2020-04-22
---

In general, only [metrics audits](/lighthouse-performance/#metrics)
contribute to your Lighthouse Performance score.

For each metrics audit, your page is assigned a score from 0 to 100 based on
real website performance data from the [HTTP Archive](https://httparchive.org/).
0 is the lowest possible score and usually indicates an error in Lighthouse.
100 is the highest possible score and indicates
your page is in the ninety-eighth&nbsp;percentile of websites for that metric.

## Why your score fluctuates {: #fluctuations }

A lot of the variability in your overall Performance score and metric scores is not due to Lighthouse.
[Project Lantern](https://github.com/GoogleChrome/lighthouse/blob/master/docs/lantern.md) has minimized
much of the variance in Lighthouse's measurements.

When your Performance score fluctuates it's usually because of changes in underlying conditions. Common
problems include:

* A/B tests
* Internet traffic routing changes
* Testing with different versions of Lighthouse
* Testing on different devices, such as a high-performance desktop and a low-performance laptop
* Browser extensions that inject JavaScript into all pages you visit and make network requests

Furthermore, even though Lighthouse can provide you a single overall Performance score, it might be more
useful to think of your site performance as a distribution of scores, rather than a single number.
See the introduction of [User-Centric Performance Metrics](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics)
to understand why.

## How the performance metrics are weighted {: #weightings }

Each audit is weighted based on heuristics.
More heavily weighted audits have a bigger effect on your overall Performance score.
The tables below show the weighting for each metric in each version of Lighthouse.

{% Aside %}
  The weightings have changed over time because the Lighthouse team is regularly
  doing research and gathering feedback to understand which metrics have the biggest
  impact on user-perceived performance.
{% endAside %}

### Lighthouse 6 (draft)

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/lcp/">Largest Contentful Paint</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/lighthouse-total-blocking-time/">Total Blocking Time</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/cls/">Cumulative Layout Shift</a></td>
        <td>5%</td>
      </tr>
    </tbody>
  </table>
</div>


### Lighthouse 5

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>20%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>27%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>7%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>33%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
        <td>13%</td>
      </tr>
    </tbody>
  </table>
</div>

## Historical versions

### Lighthouse 3 and 4

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>23%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>27%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>7%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>33%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
        <td>13%</td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 2

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>6%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>6%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>29%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>29%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
        <td>29%</td>
      </tr>
    </tbody>
  </table>
</div>
