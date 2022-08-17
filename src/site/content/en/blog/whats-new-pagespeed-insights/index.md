---
title: What's new in PageSpeed Insights
authors:
  - leenasohoni
  - addyosmani
  - egsweeny
description: Learn about the latest in PageSpeed Insights to help you better measure and optimize your page and site quality.
subhead: Learn about the latest in PageSpeed Insights to help you better measure and optimize your page and site quality.
date: 2021-11-03
updated: 2022-07-18
hero: image/1L2RBhCLSnXjCnSlevaDjy3vba73/6zX4bWZp46B9dGbMHhb4.jpeg
alt: A photo of a Chevrolet Corvette Speedometer.
tags:
  - performance
  - web-vitals
  - lighthouse
  - blog
---


Over the years, [PageSpeed
Insights](https://pagespeed.web.dev/) (PSI) has
evolved into a one-stop source for both
[field](https://developers.google.com/web/fundamentals/performance/speed-tools#field_data)
and
[lab data](https://developers.google.com/web/fundamentals/performance/speed-tools#lab_data).
It integrates information from the
[Chrome UX Report](https://developer.chrome.com/docs/crux/)
(CrUX) and [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
diagnostics to provide insights that help improve the performance of your
website.

Today, we are excited to announce an updated version of PSI! While it is a
critical element in our [speed tooling suite](/vitals-tools/),
the PSI code base was ten years old, contained a lot of legacy code, and was due
for a redesign. We used this as an opportunity to address interface-related
issues in PSI which have sometimes made it difficult for users to navigate the
report. Our primary goals were to:

+   Make the UI more intuitive by clearly differentiating between data
    derived from a synthetic environment and data collected from users in the
    field.
+   Clearly communicate how the [Core Web Vitals](/vitals/) assessment is calculated in the UI.
+   Modernize the look and feel of PSI, leveraging [Material Design](https://material.io/design).

This post introduces the new features in PSI which will be released later this
year.

## What's new?

The PSI UI redesign aims to improve the presentation of the report data and add
clarity and granularity to the data available in the report. The new UI is aimed
to be more intuitive and helps developers quickly discover lab and field
performance insights for their pages. The fundamental changes to the UI
include:

### Clear separation of field and lab data

We have changed the UI to distinctly separate field data from lab data. Labels
for "Field Data" and "Lab data" have been replaced with text that indicates what
the data means and how it can help. We have also brought the Field data section
to the top. The traditional lab-based performance score, which is currently
shown at the top, has been moved down to the Lab data section to avoid ambiguity
about the origin of the score.

{% Aside %}
If you don't know the difference between lab and field data, check
out the [explainer on web.dev](/how-to-measure-speed/).
{% endAside %}

<figure>
{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/jM0GYMrQZcPymVXdLOLP.png", alt="discover what your real users are experiencing", width="800", height="436" %}
  <figcaption>
    Section for field data
  </figcaption>
</figure>

<figure>
{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/wQ9RGcJAcBBc4SUDK7Dz.png", alt="Diagnose performance issues", width="800", height="355" %}
  <figcaption>
    Section for lab data
  </figcaption>
</figure>


### Core Web Vitals assessment

The Core Web Vitals assessment result, which earlier appeared as a single word
"passed" or "failed" in Field Data, now stands out as a separate subsection with
a distinct icon.

Note that there is no change in the assessment process for Core Web Vitals. The
Core Web Vitals metrics FID, LCP, and CLS, may be aggregated at either the page
or origin level. For aggregations with sufficient data in all three metrics, the
aggregation passes the Core Web Vitals assessment if the 75th percentiles of all
three metrics are Good. Otherwise, the aggregation does not pass the assessment.
If the aggregation has insufficient FID data, it will pass the assessment if
both the 75th percentiles of LCP and CLS are Good. If either LCP or CLS has
insufficient data, the page or origin-level aggregation cannot be assessed.

### Labels for mobile and desktop performance

We changed the navigation menu at the top and included links for mobile and
desktop centrally on the report page. The links are now easily visible and
distinctly indicate the platform for which the data is being shown. Doing this
also helped make the navigation bar cleaner.

<figure>
  {% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/hEv5XuTeVV98Z3AS59bQ.png", alt="Older (at the time of writing) version of PageSpeed Insights", width="800", height="97" %}
  <figcaption>
    PSI mobile and desktop labels before
  </figcaption>
</figure>

<figure>
  {% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/vi5j7ouZtmWwqN9BRsUD.png", alt="Newer version of the navigation bar", width="800", height="149" %}
  <figcaption>
        PSI mobile and desktop labels after
  </figcaption>
</figure>


### Origin Summary

The Origin Summary, which provides the aggregated CrUX score for all pages from
the origin, currently appears on click of a checkbox. We have moved this report
section to a new tab, "Origin", under the Field Data section.

{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/5Kn5meWq0sWwCLT69lMb.png", alt="Origin summary for the new PageSpeed Insights refresh.", width="800", height="381" %}

### Additional helpful information

The report now includes a new information section at the bottom of each field
and lab card sharing the following details about the sampled data:

+   Data collection period
+   Visit durations
+   Devices
+   Network connections
+   Sample size
+   Chrome versions

This information should enhance the distinction between lab and field data and
help users who have previously been uncertain how the two data sources (lab and
field) might differ.

{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/jVxqisC0x6I5viUGgjAD.png", alt="Enhanced section of information sharing data about field and lab sampling and configuration data", width="800", height="368" %}

### Expand view

We have a new "Expand view" feature that adds a drill-down function to the field
data section and allows you to view granular details for the Core Web Vitals
metrics.

{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/UFVgoK1gJBYk5DLhFwIn.png", alt="Newly expanded view with a drill-down for field data metrics.", width="800", height="515" %}

### Page image

We have removed the image of the loaded page, which appears right next to the
field data. The image and thumbnails of the page displaying the loading sequence
will both be available in the lab data section.

{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/dnIsJA35tj7vs6qgybRM.png", alt="Loaded page image next to the lab data.", width="800", height="444" %}

For up to date product documentation, visit
[https://developers.google.com/speed/docs/insights/.](https://developers.google.com/speed/docs/insights/v5/about)

## Updates to web.dev/measure

To reduce inconsistency between the different tools in our performance toolbox,
we are also updating [web.dev/measure](/measure) to be directly powered by the [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started).

Previously, developers would run reports via both the PSI tool and /measure
and see different Lighthouse numbers. One of the main reasons for differences
was because /measure originated all tests from the U.S. (due to it previously
having a cloud backend that was US-based).

With /measure calling the same API directly as the PSI UI, developers will get
 a more consistent experience when using PSI and /measure. We have also made
 a few tweaks to /measure based on how users use the tool. This means that the
 signed-in experience for /measure will be going away, but the most used
 functionality—seeing multiple categories—will still be available for use.


<figure>
  {% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/KFZmLMU2iSxkPDph7FTV.png", alt="The old version of the measure page.", width="800", height="377" %}
  <figcaption>
    web.dev/measure before
  </figcaption>
</figure>

<figure>
  {% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/C04zQEkxtSQqPEQedNN7.png", alt="The refreshed version of the measure tool focusing on offering page quality measurement.", width="800", height="696" %}
  <figcaption>
    web.dev/measure after
  </figcaption>
</figure>


## PSI today

Taking a step back, let's look at what the current PageSpeed Insights report
offers. The PSI report includes performance data for both mobile and desktop
devices in individual tabs and suggests how you may improve a page. The key
components of the report in each case are similar and consist of the
following:

**Performance Score:** The performance score appears at the top of the PSI
report and summarizes the overall page performance. This score is determined by
running [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) to
collect and analyze [lab
data](https://developers.google.com/speed/docs/insights/v5/about#lab) about the
page. A score of 90 or above is considered good, 50-90 needs improvement, and
below 50 is poor.

**Field Data:** Field data, sourced from the
[CrUX report](https://developer.chrome.com/docs/crux/)
dataset, provides insights into the real-world user experience. The data
includes metrics such as [First Contentful Paint](/fcp/) (FCP),
and measures Core Web Vitals  ([First Input Delay](/fid/) (FID),
[Largest Contentful Paint](/lcp/) (LCP), and [Cumulative Layout
Shift](/cls/) (CLS). Along with the metric values, you can also
see the distribution of pages where the value of a particular metric was Good,
Needs Improvement, or Poor, indicated by green, amber, and red bars,
respectively. The distribution and scores are shown based on page loads for
users in the CrUX dataset. Scores are calculated for the last 28 days and are
not available for new pages where sufficient real-user data may not be
available.

{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/A7xrSBFuqf9puSgBJH4l.png", alt="breakdown of different sections of data in the current PageSpeed Insight report", width="800", height="497" %}

**Origin Summary:** Users can click on the _Show Origin Summary_ checkbox to
view the aggregated score for the metrics for all pages served from the same
origin over the last 28 days.

**Lab Data:** Lab performance score, calculated using Lighthouse, helps debug
performance issues, as it is collected in a controlled environment. The report
shows the performance using metrics like[First Contentful
Paint](/fcp/), [Largest Contentful Paint](/lcp/),
[Speed Index](/speed-index/), [Cumulative Layout
Shift](/cls/), [Time to
Interactive](/tti/), and [Total Blocking
Time](/tbt/). Each metric is
[scored](/performance-scoring/) and labeled with an icon
indicating Good, Needs improvement, or Poor. This section provides a good
indication of performance bottlenecks pre-release and can help to diagnose
problems, but may not capture real-world issues.

**Audits:** This section lists all the audits run by Lighthouse and lists down
the passed audits along with opportunities for improvement and additional
diagnostic information.

### Challenges with the current PSI design

As seen in the screenshot above, the different data points from lab and field
data are not isolated clearly, and developers who are new to PSI may not easily
understand the context of the data and what to do next. This confusion has
resulted in many "How to" blog posts on deciphering the PSI report.

With the redesign, we hope to make interpreting the report easier for developers
so that they move quickly from generating the PSI report to acting upon the
insights included in it.

## Learn more

For more details on performance tooling updates, watch the keynote for [Chrome
Dev Summit 2021](https://developer.chrome.com/devsummit/schedule/keynote/).
We will keep you posted on the release date for PSI and the changes to web.dev/measure.

*With thanks to Milica Mihajlija, Philip Walton, Brendan Kenny and
Ewa Gasperowicz for their feedback on this article*

