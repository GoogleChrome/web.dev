---
layout: post
title: Max Potential First Input Delay
description: |
  Learn about Lighthouse's Max Potential First Input Delay metric and
  how to measure and optimize it.
date: 2019-05-02
updated: 2019-10-16
web_lighthouse:
  - max-potential-fid
---

Max Potential First Input Delay (FID) is one of the metrics
tracked in the **Performance** section of the Lighthouse report.
Each metric captures some aspect of page load speed.

Lighthouse displays Max Potential FID in milliseconds:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/VPy7DxOpD2tSd3O4Vrai.png", alt="A screenshot of the Lighthouse Max Potential First Input Delay audit.", width="800", height="588", class="w-screenshot" %}
</figure>

## What Max Potential FID measures

Max Potential FID measures the worst-case [First Input Delay][fid] that your users might experience.
First Input Delay measures the time from when a user first interacts with your site, such as
clicking a button, to the time when the browser is actually able to respond to that interaction.

Lighthouse calculates Max Potential FID by finding the duration of the [longest task][longtask]
after [First Contentful Paint][fcp]. Tasks before First Contentful Paint are excluded because it's
unlikely that a user will attempt to interact with your page before any content has been rendered to
the screen, which is what First Contentful Paint measures.

## How Lighthouse determines your Max Potential FID score

<!-- TODO(kaycebasques): In the FCP doc we link to the HTTP Archive report of FCP data.
     If we get a similar report for MPFID we should link to that.
     https://web.dev/first-contentful-paint/#how-lighthouse-determines-your-fcp-score -->

Your Max Potential FID score is a comparison of your page's Max Potential FID time
and Max Potential FID times for real websites, based on
data from the [HTTP Archive](https://httparchive.org).
For example, if your Max Potential FID score in Lighthouse is green, it means
that your page performs better than 90% of real websites.

This table shows how to interpret your TBT score:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Max Potential FID time<br>(in milliseconds)</th>
        <th>Color-coding</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–130</td>
        <td>Green (fast)</td>
      </tr>
      <tr>
        <td>130-250</td>
        <td>Orange (moderate)</td>
      </tr>
      <tr>
        <td>Over 250</td>
        <td>Red (slow)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## How to improve your Max Potential FID score

If you're trying to make major improvements to your Max Potential FID score, see
[How to improve your TTI score][tti]. The strategies for majorly improving Max Potential FID are
largely the same as the strategies for improving TTI.

If you want to optimize your Max Potential FID score specifically, you need to reduce the duration
of your longest tasks, since that is what Max Potential FID technically measures. The [Idle Until
Urgent](https://philipwalton.com/articles/idle-until-urgent/) strategy is one way to do that.

## How to capture FID field data

Lighthouse's measurement of Max Potential FID is [lab data][lab]. To capture real
FID data as your users load your pages, use Google's 
[First Input Delay library](https://github.com/GoogleChromeLabs/first-input-delay).
Once you're capturing FID data, you can report it as an event
to your preferred analytics tool.

Since FID measures when actual users first interact with your page,
it's more inherently variable than typical performance metrics.
See [Analyzing and reporting on FID data][analysis] for guidance
about how to evaluate the FID data you collect.

{% include 'content/lighthouse-performance/improve.njk' %}

## Resources

- [Source code for **Max Potential First Input Delay** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/max-potential-fid.js)
- [First Input Delay][fid]
- [Time to Interactive](/interactive/)
- [Are long JavaScript tasks delaying your Time to Interactive?](/long-tasks-devtools)
- [First paint and first contentful paint][fcp]
- [How To Think About Speed Tools][tools]

[analysis]: https://developers.google.com/web/updates/2018/05/first-input-delay#analyzing_and_reporting_on_fid_data
[fid]: https://developers.google.com/web/updates/2018/05/first-input-delay
[tti]: /interactive/#how-to-improve-your-tti-score
[fcp]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#first_paint_and_first_contentful_paint
[fid]: https://developers.google.com/web/updates/2018/05/first-input-delay
[rum]: https://developers.google.com/web/fundamentals/performance/speed-tools#field_data
[lab]: https://developers.google.com/web/fundamentals/performance/speed-tools#lab_data
[longtask]: /long-tasks-devtools#what-are-long-tasks
[tools]: https://developers.google.com/web/fundamentals/performance/speed-tools