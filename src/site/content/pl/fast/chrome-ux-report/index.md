---
layout: post
title: Using the Chrome UX Report to look at performance in the field
authors:
  - rviscomi
description: |
  The Chrome UX Report (informally known as CrUX) is a public dataset of real
  user experience data on millions of websites. Unlike lab data, CrUX data
  actually comes from opted-in users in the field.
date: 2020-07-13
tags:
  - performance
---

The [Chrome UX Report](https://developers.google.com/web/tools/chrome-user-experience-report/) (informally known as CrUX) is a public dataset of real user experience data on millions of websites. Unlike lab data, CrUX data actually comes from [opted-in users](https://developers.google.com/web/tools/chrome-user-experience-report/#methodology) in the field. It measures the [Core Web Vitals](/vitals/) metrics, including Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS), as well as diagnostic metrics like Time to First Byte (TTFB) and First Contentful Paint (FCP).

The dataset also contains qualitative dimensions
about the user experience, for example, the device and connection types, which
enables drilling down into user experiences grouped by similar technologies.
See the
[CrUX documentation](https://developers.google.com/web/tools/chrome-user-experience-report/#metrics)
for the full list of metrics.

Using this data, developers are able to understand the wide distribution of real
world user experiences between websites, segments of the web, or the web as a
whole. This is a big deal! The Chrome UX Report dataset is the first of its kind
to enable web developers to compare their real user performance against the
competition and industry.

## How to use it

There are four primary ways to extract insights from the Chrome UX Report,
ranging in complexity. For quick and easy analysis of website performance, the [CrUX Dashboard](http://g.co/chromeuxdash) and
[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
are the recommended tools. [BigQuery](https://console.cloud.google.com/bigquery?p=chrome-ux-report)
trades some of the simplicity of the analysis for the power of customization
and more granular insights. And the [API](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference) enables the integration of high-level data with other applications.

### CrUX Dashboard

The [CrUX Dashboard](http://g.co/chromeuxdash) is a customizable data
visualization tool of websites' historical performance built on
[Data Studio](https://marketingplatform.google.com/about/data-studio/).
The data is sourced from the BigQuery dataset and all of the SQL queries are
handled for you under the hood. The dashboard shows the distribution of user
experiences, as captured by key performance metrics, and how it changes over
time. It also shows how the distributions of qualitative metrics like device
type and effective connection type change over time. Try the
[Data Studio Dashboard guide](/chrome-ux-report-data-studio-dashboard).

### PageSpeed Insights

[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
(PSI) shows the most recent performance distributions broken down by desktop and
mobile users. Performance data is available for individual web pages
(in addition to entire origins) and is aggregated for the most recent 28 days of
data (as opposed to the previous calendar month on BigQuery). Using this tool is
as easy as entering a URL or origin in the search box on the web interface, and
the field performance data is displayed alongside prescriptive suggestions to
optimize the page. Try the
[PageSpeed Insights guide](/chrome-ux-report-pagespeed-insights).

### CrUX on BigQuery

The CrUX database on [BigQuery](https://console.cloud.google.com/bigquery?p=chrome-ux-report),
part of the Google Cloud Platform (GCP) with a web and command line interface,
hosts the raw data that aggregates key UX performance metrics for top origins
on the web. New tables are periodically added to the database covering the
previous calendar month. Developers can handcraft queries to mine the dataset
for specific insights. BigQuery requires knowledge of SQL and a GCP project with
billing enabled to run the queries. This is an especially useful tool for power
users who require low-level access to the data to create custom reports,
benchmarks, and reports about the state of the web. Try the
[BigQuery guide](/chrome-ux-report-bigquery).

### CrUX API

The CrUX API is a free and RESTful interface for looking up origin or URL-level user experience data. The data is updated daily and aggregates the previous 28 days of data, similar to PageSpeed Insights. You can use this API to build your own applications on top of the real-user experience data in CrUX. Try the [CrUX API](/chrome-ux-report-api) guide.

## How to get help

If you need any kind of support, there are a few channels to reach someone who
can help. The
[CrUX Google Group](https://groups.google.com/a/chromium.org/forum/#!forum/chrome-ux-report)
is a public forum for users of the dataset to ask questions and share analyses.
There is also a
[CrUX tag for Stack Overflow](https://stackoverflow.com/questions/tagged/chrome-ux-report)
if you need programming help with SQL or API access. And finally,
[@ChromeUXReport](https://twitter.com/ChromeUXReport) is the Twitter account you
can follow to ask questions and listen for product announcements.

## See it in action

In order to get more acquainted with the available data, walk through
step-by-step guides for using BigQuery, Data Studio Dashboard, and PageSpeed
Insights:

- [CrUX: Data Studio Dashboard](/chrome-ux-report-data-studio-dashboard)
- [CrUX: PageSpeed Insights](/chrome-ux-report-pagespeed-insights)
- [CrUX: BigQuery](/chrome-ux-report-bigquery)
- [CrUX: API](/chrome-ux-report-api)
