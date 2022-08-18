---
layout: post
title: Using the Chrome UX Report on PageSpeed Insights
authors:
  - rviscomi
  - tunetheweb
description: |
  PageSpeed Insights (PSI) is a tool for web developers to understand what a
  page's performance is and how to improve it. In this guide, learn how to use
  PSI to extract insights from CrUX and better understand the user experience.
date: 2020-05-28
updated: 2022-08-15
tags:
  - performance
  - chrome-ux-report
---

[PageSpeed Insights](https://pagespeed.web.dev/)
(PSI) is a tool for web developers to understand what a page's performance is
and how to improve it. It uses [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
to audit the page and identify opportunities to improve performance. It also
integrates with the [Chrome UX Report](https://developer.chrome.com/docs/crux/) (CrUX)
to show how real users experience the page and the origin in
aggregate. In this guide, learn how to use PSI to extract insights from CrUX
and better understand the user experience.

{% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/oJIQroFHkp8unHziyoxn.png", alt="Field data from CrUX in PageSpeed Insights", width="800", height="786" %}

## Reading the data

To get started, go to [https://pagespeed.web.dev/](https://pagespeed.web.dev/)
and enter the URL of the page you want to test and click **Analyze**.

{% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/GoTgDw7qJzuGdz0SHL8V.png", alt="Enter a URL to get started on PageSpeed Insights", width="800", height="106" %}

After a few seconds, Lighthouse
audits will be performed and you will see sections with data from CrUX ("Discover what your real users are experiencing") and Lighthouse ("Diagnose performance issues"). CrUX is a collection of real-user experiences from the field, while Lighthouse is a controlled test in the lab.

{% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/jZSP6YZQHE8vBOJIMhCH.png", alt="Field data from CrUX in PageSpeed Insights", width="800", height="491" %}

In the real-user experiences section, metrics are grouped by [Core Web Vitals](/vitals/#core-web-vitals) and [other notable metrics](/vitals/#other-web-vitals). The three Core Web Vitals metrics are listed first: [Largest Contentful Paint](/lcp/) (LCP), [First Input Delay](/fid/) (FID), and [Cumulative Layout Shift](/cls/). These are followed by the other notable metrics: [First Contentful Paint](/fcp/) (FCP), [Interaction to Next Paint](/inp/) (INP), and [Time to First Byte](/ttfb/) (TTFB).

### Core Web Vitals

- **LCP** measures the time until the page displays what is likely its main
  content, like a hero image or heading.
- **FID** measures the interactivity of the page, from the user's first
  interaction to the time the page responds to it.
- **CLS** measures the degree of layout instability on the page, due to shifts
  like asynchronously loaded content being injected.

### Other notable metrics

- **FCP** measures the time until the page displays something in the
 foreground, like some text or a logo.
- **INP** is an experimental metric that measures the latency of all interactions a user has made with the page, and reports a single value which all (or nearly all) interactions were below.
- **TTFB** is an experimental metric that measures the the time between the request for a resource and when the first byte of a response begins to arrive.

### Metric thresholds

This table describes how values for these metrics are categorized as either
"good", "needing improvement", or "poor".

Metric | "Good" | "Needs Improvement" | "Poor"
-- | -- | -- | --
LCP | 0–2500ms | 2500–4000ms | 4000ms+
FID | 0–100ms | 100–300ms | 300ms+
CLS | 0.00-0.10 | 0.10–0.25 | 0.25+
FCP | 0–1800ms | 1800ms–3000ms | 3000ms+
INP | 0–200ms | 200ms–500ms | 500ms+
TTFB | 0–800ms | 800ms–1800ms | 1800ms+

The three Core Web Vitals metrics are the most important metrics, and are directly experienced by real users. The other metrics may be used as diagnostics, but they're not necessarily perceptible by real users. Thus, these metrics are not factored into the Core Web Vitals assessment, and failing to meet the "good" thresholds only matters if they're adversely affecting the Core Web Vitals.

There are three ways that the user experience is displayed in PSI:

- a label summarizing the page as passing or not passing the Core Web Vitals
  assessment
- percentiles measured in seconds or milliseconds (CLS is unitless)
- a distribution representing the percent of "good", "needing improvement", and "poor" experiences is available by clicking on **Expand view** in the top right of this section.

{% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/6ykCy8x82DN4syjcxoyJ.png", alt="Expanded view of CrUX data in PageSpeed Insights", width="800", height="719" %}

In the screenshot above, the page is labelled as "passing" the Core Web Vitals
assessment. To pass, the percentile must be categorized as "good" in all three
Core Web Vitals. Otherwise, the assessment appears as "failed".  Some pages may not have sufficient FID data, in which case the page is assessed on the other two Core Web Vitals metrics.

The percentiles shown for all metrics correspond to the 75th percentile. In
statistics, a percentile is a measure that indicates the value below which a
given percentage of samples fall. For example, the screenshot above shows that
FID's 75th percentile is 13ms, meaning that 75% of FID experiences are faster
than 13ms. These values are color-coded according to the threshold table above
where "good" values are green, values "needing improvement" are orange, and
"poor" values are red.

Finally, the distributions for each metric are illustrated using the "good",
"needs improvement", and "poor" grouping. For example, LCP experiences on this
page are "good" (less than 2.5 seconds) 90% of the time. FID is "poor" (at least
300 milliseconds) 1% of the time. These distributions represent all user
experiences on the page and their shapes indicate the tendency to be either
"good" or "poor".

## Summary of origin performance

PSI also includes a summary of origin performance. This is an aggregation of
user experiences across all pages of an origin. You can get the same stats for an entire origin that are available for individual pages. This data is
closely aligned with what is available on [BigQuery](/chrome-ux-report-bigquery/), while the page-level
performance is not made available to query.

{% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/Mer6ovkOuMxHZH6fhHY7.png", alt="Origin CrUX performance in PageSpeed Insights", width="800", height="426" %}

There is one major difference between the origin-level data on PSI versus
BigQuery. The datasets on BigQuery are released once a month and encompass the data from the previous calendar month. For example, the 202005 dataset
includes all user experiences that occurred in May 2020.
On the other hand, PSI aggregates new data every day encompassing the previous 28 days. So
the results you see today may be different tomorrow and they would not
necessarily be the same as what you'd see in the current month's aggregation on
BigQuery.

## Responses when URL data is not available in CrUX

If the URL you entered is not available in CrUX, PageSpeed Insights will attempt to fallback to origin-level data as shown below. Clicking on the icon beside the disabled **This URL** button will show more explanation.

{% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/A6hRLMwSCWUj1qcDUOTn.png", alt="No URL-level CrUX data on PageSpeed Insights, so showing Origin data", width="800", height="269" %}

If the origin-level data is also not available in CrUX, then PSI is not able to display this section and you will see **No Data**. Lab data from Lighthouse is still available to give you an approximation of the page's performance.

{% Img src="image/W3z1f5ZkBJSgL1V1IfloTIctbIF3/tzZlOJKTVZB72Pr4LRgh.png", alt="No CrUX data on PageSpeed Insights", width="800", height="129" %}

## FAQ

### When would I use PageSpeed Insights as opposed to other tools?

PSI combines the real-world user experience data of CrUX with the lab-based
performance diagnostics of Lighthouse. This makes it easy to see how fast a
page is experienced and how to make it faster all in one place. The daily
aggregation of field data in PSI makes it a great place to more closely
monitor origin or URL performance than tools with less frequent aggregations.

### Are there any limitations to using PageSpeed Insights?

PSI only provides the most recent daily aggregation, so you wouldn't necessarily be able to see how a site's performance is trending. There are also some non-vital metrics included in the CrUX dataset that are not exposed in PSI.

### Where can I learn more about PageSpeed Insights?

Check out the [PSI documentation](https://developers.google.com/speed/docs/insights/v5/about)
for more info.
