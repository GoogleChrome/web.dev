---
layout: post
title: Using the CrUX Dashboard on Data Studio
authors:
  - rviscomi
hero: image/admin/k3hWnnwqTvg7w7URsbIK.png
description: |
  Data Studio is a powerful data visualization tool that enables you to build
  dashboards on top of big data sources, like the Chrome UX Report. In this
  guide, learn how to create your own custom CrUX Dashboard to track an origin's
  user experience.
date: 2020-06-22
tags:
  - performance
  - blog
---

[Data Studio](https://marketingplatform.google.com/about/data-studio/) is a
powerful data visualization tool that enables you to build dashboards on top of
big data sources, like the [Chrome UX Report](https://developers.google.com/web/tools/chrome-user-experience-report/)
(CrUX). In this guide, learn how to create your own custom CrUX Dashboard to
track an origin's user experience trends.

{% Img src="image/admin/AG2jdUtgsQzrxIUlLFyf.png", alt="CrUX Dashboard", width="800", height="598", class="w-screenshot" %}

The CrUX Dashboard is built with a Data Studio feature called [Community
Connectors](https://developers.google.com/datastudio/connector/).
This connector is a pre-established link between the raw CrUX data on
[BigQuery](https://console.cloud.google.com/bigquery?p=chrome-ux-report)
and the visualizations of Data Studio. It eliminates the need for users of the
dashboard to write any queries or generate any charts. Everything is built for
you; all you need is to provide an origin and a custom dashboard will be
generated for you.

## Creating a dashboard

To get started, go to [g.co/chromeuxdash](https://g.co/chromeuxdash).
This will take you to the CrUX community connector page where you can provide
the origin for which the dashboard will be generated. Note that first-time
users may need to complete permission or marketing preference prompts.

{% Img src="image/admin/SSUqCau3HiN5qBbewX6h.png", alt="CrUX Dashboard connector", width="800", height="484", class="w-screenshot" %}

The text input field only accepts origins, not full URLs. For example:

{% Compare 'better', 'Origin (Supported)' %}
```text
https://developers.google.com
```
{% endCompare %}

{% Compare 'worse', 'URL (Not supported)' %}
```text
https://developers.google.com/web/tools/chrome-user-experience-report/
```
{% endCompare %}

If you omit the protocol, HTTPS is assumed. Subdomains matter, for example
`https://developers.google.com` and `https://www.google.com` are considered to
be different origins.

Some common issues with origins are providing the wrong protocol, for example
`http://` instead of `https://`, and omitting the subdomain when needed.
Some websites include redirects, so if `http://example.com` redirects to
`https://www.example.com`, then you should use the latter, which is the
canonical version of the origin. As a rule of thumb, use whichever origin
users see in the URL bar.

If your origin is not included in the CrUX dataset, you may get an error message
like the one below. There are over 4 million origins in the dataset, but the one
you want may not have sufficient data to be included.

{% Img src="image/admin/qt0jWTgtdS93hDKW2SCm.png", alt="CrUX Dashboard error message", width="800", height="409", class="w-screenshot" %}

If the origin exists, you'll be taken to the schema page for the dashboard.
This shows you all of the fields that are included: each effective connection
type, each form factor, the month of the dataset release, the distribution of
performance for each metric, and of course the name of the origin. There's
nothing you need to do or change on this page, just click **Create Report** to
continue.

{% Img src="image/admin/DTNigYO4gUwovCuCgyhH.png", alt="CrUX Dashboard schema", width="800", height="403", class="w-screenshot" %}

## Using the dashboard

Each dashboard comes with three types of pages:

1. Core Web Vitals overview
2. Metric performance
3. User demographics

Each page includes a chart showing distributions over time for each available
monthly release. As new datasets are released, you can simply refresh the
dashboard to get the latest data.

The monthly datasets are released on the second Tuesday of every month. For
example, the dataset consisting of user experience data from the month of May
is released on the second Tuesday of June.

### Core Web Vitals overview

The first page is an overview of the origin's monthly
[Core Web Vitals](/vitals/) performance. These are the most important UX metrics that Google recommends you focus on.

{% Img src="image/admin/h8iCTgvmG4DS2zScvatc.png", alt="CrUX Dashboard Core Web Vitals overview", width="800", height="906", class="w-screenshot" %}

Use the Core Web Vitals page to understand how the origin is experienced by
desktop and phone users. By default, the most recent month at the time you
created the dashboard is selected. To change between older or newer monthly
releases, use the **Month** filter at the top of the page.

Note that tablet is omitted from these charts by default, but if needed you
could remove the **No Tablet** filter in the bar chart configuration, shown
below.

{% Img src="image/admin/lD3eZ3LipJmBGmmkrUvG.png", alt="Editing the CrUX Dashboard to show tablets on the Core Web Vitals page", width="800", height="288", class="w-screenshot" %}

### Metric performance

After the Core Web Vitals page, you'll find standalone pages for all
[metrics](https://developers.google.com/web/tools/chrome-user-experience-report/#metrics)
in the CrUX dataset.

{% Img src="image/admin/AG2jdUtgsQzrxIUlLFyf.png", alt="CrUX Dashboard LCP page", width="800", height="598", class="w-screenshot" %}

Atop each page is the **Device** filter, which you can use to restrict the form
factors included in the experience data. For example, you can drill down
specifically into phone experiences. This setting persists across pages.

The primary visualizations on these pages are the monthly distributions of
experiences categorized as "Good", "Needs Improvement", and "Poor". The
color-coded legend below the chart indicates the range of experiences included
in the category. For example, in the screenshot above, you can see the
percent of "good"
[Largest Contentful Paint](/lcp/#what-is-a-good-lcp-score) (LCP) experiences
fluctuating and getting slightly worse in recent months.

The most recent month's percentages of "good" and "poor" experiences are shown
above the chart along with an indicator of the percent difference from the
previous month. For this origin, "good" LCP experiences fell by 3.2% to 56.04%
month-over-month.

{% Aside 'caution' %}
Due to a quirk with Data Studio, you may sometimes see `No Data` here. This is
normal and due to the previous month's release not being available until the
second Tuesday.
{% endAside %}

Additionally, for metrics like LCP and other Core Web Vitals that provide
explicit percentile recommendations, you'll find the "P75" metric between the
"good" and "poor" percentages. This value corresponds to the origin's 75th
percentile of user experiences. In other words, 75% of experiences are better
than this value. One thing to note is that this applies to the overall
distribution across _all devices_ on the origin. Toggling specific devices
with the **Device** filter will not recalculate the percentile.

{% Details %}
{% DetailsSummary %}
Boring technical caveats about percentiles
{% endDetailsSummary%}

Be aware that the percentile metrics are based on the histogram data from
[BigQuery](/chrome-ux-report-bigquery/), so the granularity will be coarse:
1000ms for LCP, 100ms for FID, and 0.05 for CLS. In other words, a P75 LCP of
3800ms indicates that the true 75th percentile is somewhere between 3800ms and
3900ms.

Additionally, the BigQuery dataset uses a technique called "bin spreading" in
which densities of user experiences are intrinsically grouped into very coarse
bins of decreasing granularity. This allows us to include minute densities in
the tail of the distribution without having to exceed four digits of
precision. For example, LCP values less than 3 seconds are grouped into bins
200ms wide. Between 3 and 10 seconds, bins are 500ms wide. Beyond 10 seconds,
bins are 5000ms wide, etc. Rather than having bins of varying widths, bin
spreading ensures that all bins are a constant 100ms wide (the greatest common
divisor), and the distribution is linearly interpolated across each bin.

Corresponding P75 values in tools like PageSpeed Insights are not based on the
public BigQuery dataset and are able to provide millisecond-precision values.
{% endDetails %}

### User demographics

There are two [dimensions](https://developers.google.com/web/tools/chrome-user-experience-report/#dimensions)
included on the user demographic pages: devices and effective connection
types (ECTs). These pages illustrate the distribution of page views across the
entire origin for users in each demographic.

The device distribution page shows you the breakdown of phone, desktop, and
tablet users over time. Many origins tend to have little to no tablet data so
you'll often see "0%" hanging off the edge of the chart.

{% Img src="image/admin/6PXh8MoQTWHnHXf8o1ZU.png", alt="CrUX Dashboard device page", width="800", height="603", class="w-screenshot" %}

Similarly, the ECT distribution page shows you the breakdown of 4G, 3G, 2G,
slow 2G, and offline experiences.

{% Aside 'key-term' %}
Effective connection types are considered _effective_ because they're based
on bandwidth measurements on users' devices, and don't imply any particular
technology used. For example, a desktop user on fast Wi-Fi may be labelled as
4G while a slower mobile connection might be labelled as 2G.
{% endAside %}

The distributions for these dimensions are calculated using segments of the
[First Contentful Paint](/fcp/) (FCP) histogram data.

## FAQ

### When would I use the CrUX Dashboard as opposed to other tools?

The CrUX Dashboard is based on the same underlying data available on BigQuery,
but you don't need to write a single line of SQL to extract the data and you
don't ever have to worry about exceeding any free quotas. Setting up a
dashboard is quick and easy, all of the visualizations are generated for you,
and you have the control to share it with anyone you want.

### Are there any limitations to using the CrUX Dashboard?

Being based on BigQuery means that the CrUX Dashboard inherits all of its
limitations as well. It is restricted to origin-level data at monthly
granularity.

The CrUX Dashboard also trades away some of the versatility of the raw data on
BigQuery for simplicity and convenience. For example, metric distributions are
only given as "good", "needs improvement", and "poor", as opposed to the full
histograms. The CrUX Dashboard also provides data at a global level, while the
BigQuery dataset allows you to zoom in on particular countries.

### Where can I learn more about Data Studio?

Check out the [Data Studio features page](https://marketingplatform.google.com/about/data-studio/features/)
for more info.
