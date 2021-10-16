---
layout: post
title: Using the Chrome UX Report on PageSpeed Insights
authors:
  - rviscomi
description: |
  PageSpeed Insights (PSI) is a tool for web developers to understand what a
  page's performance is and how to improve it. In this guide, learn how to use
  PSI to extract insights from CrUX and better understand the user experience.
date: 2020-05-28
tags:
  - performance
---

[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
(PSI) is a tool for web developers to understand what a page's performance is
and how to improve it. It uses [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
to audit the page and identify opportunities to improve performance. It also
integrates with the [Chrome UX Report](https://developers.google.com/web/tools/chrome-user-experience-report/) (CrUX)
to show how real users experience the page and the origin in
aggregate. In this guide, learn how to use PSI to extract insights from CrUX
and better understand the user experience.

{% Img src="image/admin/8ORarOdBzgJ5FAMkws7p.png", alt="Field data from CrUX in PageSpeed Insights", width="800", height="703", class="w-screenshot" %}

## Reading the data

To get started, go to [https://developers.google.com/speed/pagespeed/insights/](https://developers.google.com/speed/pagespeed/insights/)
and enter the URL of the page you want to test.

{% Img src="image/admin/5bnx9Xt0LT2XWk8Gpy3s.png", alt="Enter a URL to get started on PageSpeed Insights", width="800", height="203", class="w-screenshot" %}

After a few seconds, Lighthouse
audits will be performed and you will see sections for Field and Lab data. CrUX
is a collection of real user experiences from the field, while Lighthouse is a
controlled test in the lab.

{% Img src="image/admin/bKoL7v3vnO6Ttl70FkZe.png", alt="Field data from CrUX in PageSpeed Insights", width="800", height="296", class="w-screenshot" %}

In the **Field Data** section, you'll see four metrics:
[First Contentful Paint](/fcp/) (FCP), [First Input Delay](/fid/) (FID),
[Largest Contentful Paint](/lcp/) (LCP), and
[Cumulative Layout Shift](/cls/) (CLS). FID, LCP, and CLS are
considered the [Core Web Vitals](/vitals/#core-web-vitals) metrics. These
metrics are representative of the user experience in different ways:

- **FCP** measures the time until the page displays something in the
 foreground, like some text or a logo.
- **FID** measures the interactivity of the page, from the user's first
  interaction to the time the page responds to it.
- **LCP** measures the time until the page displays what is likely its main
  content, like a hero image or heading.
- **CLS** measures the degree of layout instability on the page, due to shifts
  like asynchronously loaded content being injected.

Metric | "Good" | "Needs Improvement" | "Poor"
-- | -- | -- | --
FCP | 0–1000ms | 1000ms–3000ms | 3000ms+
FID | 0–100ms | 100–300ms | 300ms+
LCP | 0–2500ms | 2500–4000ms | 4000ms+
CLS | 0.00-0.10 | 0.10–0.25 | 0.25+

This table describes how values for these metrics are categorized as either
"good", "needing improvement", or "poor".

There are three ways that the user experience is displayed in PSI:

- a label summarizing the page as passing or not passing the Core Web Vitals
  assessment
- percentiles measured in seconds or milliseconds (CLS is unitless)
- a distribution representing the percent of "good", "needing improvement", and
  "poor" experiences

In the screenshot above, the page is labelled as "passing" the Core Web Vitals
assessment. To pass, the percentile must be categorized as "good".
Otherwise, the page is labelled as "not passing".

The percentiles shown for all metrics correspond to the 75th percentile. In
statistics, a percentile is a measure that indicates the value below which a
given percentage of samples fall. For example, the screenshot above shows that
FID's 75th percentile is 15ms, meaning that 75% of FID experiences are faster
than 15ms. These values are color-coded according to the threshold table above
where "good" values are green, values "needing improvement" are orange, and
"poor" values are red.

Finally, the distributions for each metric are illustrated using the "good",
"needs improvement", and "poor" grouping. For example, FCP experiences on this
page are "good" (less than 1 second) 44% of the time. FID is "poor" (at least
300 milliseconds) 1% of the time. These distributions represent all user
experiences on the page and their shapes indicate the tendency to be either
"good" or "poor".

## Summary of origin performance

PSI also includes a summary of origin performance. This is an aggregation of
user experiences across all pages of an origin. You can get the same stats for an entire origin that are available for individual pages. This data is
closely aligned with what is available on [BigQuery](/chrome-ux-report-bigquery/), while the page-level
performance is not made available to query.

{% Img src="image/admin/7Xr7VVdZMbRlEMlgq3cj.png", alt="Origin CrUX performance in PageSpeed Insights", width="800", height="371", class="w-screenshot" %}

There is one major difference between the origin-level data on PSI versus
BigQuery. The datasets on BigQuery are released once a month and encompass the data from the previous calendar month. For example, the 202005 dataset
includes all user experiences that occurred in May 2020. On the other
hand, PSI aggregates new data every day encompassing the previous 28 days. So
the results you see today may be different tomorrow and they would not
necessarily be the same as what you'd see in the monthly aggregations on
BigQuery.

## Null response when URL not available

If the URL you entered is not available in CrUX, you will see a null response
like the one below, indicating that there is not enough field data.
Lab data from Lighthouse is still available to give you an approximation of the page's performance.

{% Img src="image/admin/TQSwqryJR9phVV5vjDs4.png", alt="No CrUX data on PageSpeed Insights", width="800", height="202", class="w-screenshot" %}

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
