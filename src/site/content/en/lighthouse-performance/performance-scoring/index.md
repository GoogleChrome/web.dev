---
layout: post
title: "Lighthouse performance scoring"
description: |
  Learn how Lighthouse generates the performance score for your page.
date: 2019-09-19
---

In general, only [metrics audits](/lighthouse-performance/#metrics)
contribute to your Lighthouse Performance score.

For each metrics audit, your page is assigned a score from 0 to 100 based on
real website performance data from the [HTTP Archive](https://httparchive.org/).
0 is the lowest possible score and usually indicates an error in Lighthouse.
100 is the highest possible score and indicates
your page is in the ninety-eighth&nbsp;percentile of websites for that metric.

Each audit is weighted based on heuristics.
More heavily weighted audits have a bigger effect on your overall Performance score.
The table below shows the weighting for each contributing performance audit.

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
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>1</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>4</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
        <td>2</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>5</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}
Your Performance score will vary somewhat each time you run Lighthouse because
of changes in underlying conditions (for example, network speed).
You can minimize variations by running Lighthouse without any programs
that affect page load, like anti-virus scanners or browser extensions.
{% endAside %}

See the [Lighthouse Scoring Guide](https://developers.google.com/web/tools/lighthouse/v3/scoring#a11y)
for more information.
