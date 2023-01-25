---
layou: post
title: Evolving Cumulative Layout Shift in web tooling
subhead: >
  Starting today,
  a change to CLS has been rolled out across a number of Chrome's web tooling surfaces including
  Lighthouse, PageSpeed Insights, and Chrome UX Report.
date: 2021-06-02
updated: 2022-07-18
hero: image/1L2RBhCLSnXjCnSlevaDjy3vba73/ENrTmCSZl69N9gmf0twL.jpeg
alt: The Lighthouse Scoring Calculator
description: >
  Starting today,
  a change to CLS has been rolled out across a number of Chrome's web tooling surfaces including
  Lighthouse, PageSpeed Insights, and Chrome UX Report.
tags:
  - blog
  - web-vitals
  - lighthouse
  - chrome-ux-report
authors:
  - addyosmani
  - egsweeny
---

Today we would like to share how we are evolving measurement of the
[Cumulative Layout Shift](/cls) (CLS)
metric across a number of Chrome's web tooling surfaces.
For developers, these changes will better reflect the user-experience for
[long-lived pages](/evolving-cls/)
(such as those with infinite scroll or single-page apps).
These updates to CLS will be rolling out to tools including Lighthouse,
PageSpeed Insights, and Chrome UX Report.

We all wish we saw fewer layout shifts on the web.
This is where the CLS metric has proved useful in measuring the visual stability of a web page.
It helps to encourage sites to better set dimensions for content,
such as images or ads,
that may contribute to surprising jumps of content for their users.

The metric is named "cumulative"
because the score of each individual shift is summed throughout the lifespan of a page.
While all layout shifts on the web cause poor user experiences,
long-lived pages like Single-Page Apps (SPAs) or infinite scroll apps naturally accumulate more CLS over time.
By capping the aggregation to the worst 'window' of shifts,
CLS can now be more consistently measured regardless of session duration.

As we announced in [Evolving the CLS metric](/evolving-cls/), we are adjusting the CLS metric to a
[maximum session window with a 1 second gap, capped at 5 seconds](/evolving-cls/),
this update better reflects the user experience for long lived pages.
With this change in place,
70% of origins should not expect to see any CLS change at the 75th percentile,
and the remaining 30% of origins will see an improvement.

## Rolling out the windowing adjustment to CLS

We've talked about the updated CLS definition being a max session window with a 1 second gap,
capped at 5 seconds. What does that mean for tools?

Starting today,
this change to CLS has been rolled out across a number of Chrome's web tooling surfaces including
Lighthouse, PageSpeed Insights, and Chrome UX Report.
Below you can see a summary of the CLS windowing adjustment rollout,
as well as which tools still provide the ability to benchmark against the original implementation.

<div>
  <table>
    <thead>
      <tr>
        <th>Tool</th>
        <th>CLS windowing adjustment  'live'</th>
        <th>"Old" CLS Availability</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Lighthouse DevTools Panel</td>
        <td>Canary channel, 2 June 2021</td>
        <td>N/A</td>
      </tr>
      <tr>
        <td><a href="https://developers.google.com/web/tools/lighthouse#cli">
        Lighthouse CLI</a></td>
        <td>v8, released 1 June 2021</td>
        <td>Available as totalCumulativeLayoutShift in Lighthouse v8</td>
      </tr>
      <tr>
        <td><a href="https://github.com/GoogleChrome/lighthouse-ci">Lighthouse CI</a></td>
        <td>v0.7.3, 3 June 2021</td>
        <td>N/A</td>
      </tr>
      <tr>
        <td><a href="https://developers.google.com/speed/pagespeed/insights/">
        PageSpeed Insights</a> (PSI)</td>
        <td>1 June 2021</td>
        <td>NA</td>
      </tr>
      <tr>
        <td><a href="https://developers.google.com/speed/docs/insights/v5/get-started">
        PSI API</a></td>
        <td>1 June 2021</td>
        <td>Available in the <code>lighthouseResult</code> as <code>totalCumulativeLayoutShift</code>. Not available in the field <code>loadingExperience</code> data</td>
      </tr>
      <tr>
        <td><a href="/chrome-ux-report-bigquery/">
        Chrome UX Report (CrUX) - BigQuery</a></td>
        <td>202105 dataset, published 8 June 2021</td>
        <td>Available as <code>experimental.uncapped_cumulative_layout_shift</code> through 202111</td>
      </tr>
      <tr>
        <td><a href="https://developer.chrome.com/docs/crux/api/">
        Chrome UX Report (CrUX) - API</a></td>
        <td>1 June 2021</td>
        <td>After 1 June 2021, available as
        <code>experimental_uncapped_cumulative_layout_shift</code>
        December 14th, 2021</td>
      </tr>
      <tr>
    </tbody>
  </table>
</div>

Chrome DevTools will also be updated to support the windowing adjustment shortly. The update to CLS has also been made to [Search Console](https://search.google.com/search-console/about) and will be reflective from 1 June, 2021.

For most developers,
this change is expected to happen seamlessly with no action needed to take advantage of data from the fix.


## "Old" CLS

As a reminder, the "old" CLS measures layout shift over the entire lifespan of the page. As some developers may wish to monitor the older definition of CLS alongside the windowing-adjustment,
we have good news to share: we are exposing "old CLS" in Lighthouse and CrUX.

In Lighthouse v8,
it's available in the JSON as
`audits['cumulative-layout-shift'].details.items[0].totalCumulativeLayoutShift`.

You'll find it as
`experimental_uncapped_cumulative_layout_shift`
in the CrUX API and as
`experimental.uncapped_cumulative_layout_shift` in CrUX BigQuery.

After June 1st, CrUX API requests will return the "old CLS" metric:

```js
{
  "origin": "https://web.dev",
  "metrics": [
    "experimental_uncapped_cumulative_layout_shift"
  ]
}
```

After June 8, the following
[CrUX BigQuery](https://developer.chrome.com/docs/crux/bigquery/)
will compare old and new CLS:

```sql
WITH
  new_data AS (
  SELECT
    cls
  FROM
    `chrome-ux-report.all.202105`,
    UNNEST(layout_instability.cumulative_layout_shift.histogram.bin) AS cls
  WHERE
    origin = 'https://web.dev'
    AND effective_connection_type.name = '4G'
    AND form_factor.name = 'phone'),
  old_data AS (
  SELECT
    uncapped_cls
  FROM
    `chrome-ux-report.all.202105`,
    UNNEST(experimental.uncapped_cumulative_layout_shift.histogram.bin) AS uncapped_cls
  WHERE
    origin = 'https://web.dev'
    AND effective_connection_type.name = '4G'
    AND form_factor.name = 'phone')
SELECT
  cls.start AS start,
  cls.`END` AS `end`,
  cls.density AS cls_density,
  uncapped_cls.density AS uncapped_cls_density
FROM
  new_data
INNER JOIN
  old_data
ON
  new_data.cls.start = old_data.uncapped_cls.start
```

You will be able to continue relying on this data to be present for a period of up to 6 months,
with "old CLS" being retired on December 14th, 2021.

## Updating the CLS weighting in Lighthouse

When CLS was first introduced in Lighthouse,
it was a brand new sparkly metric.
As such, in order to make sure developers had time to test, benchmark,
and optimize against it, CLS was weighed less heavily in the performance score.

Now, after having had some time in the hands of developers,
the Lighthouse score has increased the weight of CLS from 5% to 15%,
consistent with the methodology of having Core Web Vitals
be the most heavily weighted metrics in the Lighthouse score.

You can find the updated weightings of metrics in Lighthouse v8 in the
[scoring calculator](https://googlechrome.github.io/lighthouse/scorecalc/).

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/UAslFmRMON2y5qtY1TZE.png",
alt="Lighthouse scoring calculator",
width="800", height="405" %}

Lighthouse 8.0's CLS implementation includes both windowing and CLS contribution from subframes. Prior to 8.0, CLS in Lighthouse didn't include subframes' CLS in the metric calculation, but now does. And just for confirmation, field CLS measured by CrUX also handles windowing and subframes similarly.

Still, the primary difference between lab and field CLS is that lab CLS's window of observation ends at "fully loaded" as determined under lab conditions, whereas in the field, the window of observation extends to the entire page lifetime, including post-load activity. That said, the windowing adjustment does mitigate this difference substantially.

## Measuring in the field yourself

Should you wish to measure the latest CLS implementation,
you can also record this for your field data via RUM using the [following](/cls/#measure-cls-in-javascript) PerformanceObserver snippet.

Or by relying directly on the
[Web Vitals JavaScript library](https://github.com/GoogleChrome/web-vitals),
which has also been updated with this change.

## Additional updates

Outside of the updates to Cumulative Layout Shift,
the following metrics-related updates have also been made to our web tooling:

- We're updating to
[the most recent definition of the Largest Contentful Paint metric](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/speed/metrics_changelog/2020_11_lcp.md).
CrUX API, PSI, PSI API, Search Console will update on June 1, 2021. CrUX BigQuery will update on June 8, 2021.
- In CrUX, First Contentful Paint tri-binning thresholds have been updated to be,
Good: [0-1.8s], Needs Improvement: (1.8s-3s), Poor: [3s-∞]

## Conclusions

We expect this change to reflect a smooth transition for most sites and encourage you to check out
[Web Vitals](/vitals/) and
[Optimize CLS](/optimize-cls)
for tips and tricks on how to measure and optimize your layout shifts away.
As always, feel free to reach out on the
[web-vitals-feedback group](https://groups.google.com/g/web-vitals-feedback)
for feedback about the metrics and our tooling specific feedback forums for
[Lighthouse](https://github.com/GoogleChrome/lighthouse), and
[Chrome UX Report](https://groups.google.com/a/chromium.org/g/chrome-ux-report)
for tooling issues. Cheers!

_With thanks to Johannes Henkel, Rick Viscomi, Vivek Sekhar, Rachel Andrew, Milica Mihajlija, Jeff Jose and Paul Irish for their feedback._

_Hero image by Barn Images / @barnimages on [Unsplash](https://unsplash.com/photos/t5YUoHW6zRo)_
