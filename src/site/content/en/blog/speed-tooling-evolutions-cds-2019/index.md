---
title: "Speed tooling evolutions: highlights from Chrome Developer Summit 2019"
subhead: New performance metrics, updates to PageSpeed Insights and Chrome User Experience Report (CrUX), and more.
authors:
  - egsweeny
date: 2019-12-16
description: |
  Read about the latest developments in speed tooling including new performance metrics, updates to PageSpeed Insights and Chrome User Experience Report (CrUX), and insights from Web Almanac analysis of the web ecosystem.
hero: image/admin/lWKSX0b7pvSUX1BDd3IH.jpg
thumbnail: image/admin/NhCeOuBEiIGJHYIS9TxB.png
alt: Chrome User Experience logo, PageSpeed Insights logo, and a metrics chart.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
---

At Chrome Developer Summit, Paul Irish and I announced updates to
Lighthouse—[Lighthouse CI, new performance score formula, and
more](/lighthouse-evolution-cds-2019). Along with big Lighthouse news, we
presented exciting performance tooling developments including new performance
metrics, updates to PageSpeed Insights and Chrome User Experience Report (CrUX),
and insights from the Web Almanac's analysis of the web ecosystem.

## New performance metrics

Measuring the nuances of a user's experience is the key to quantifying the
impact it has on your bottom line and tracking improvements and regressions.
Over time, new metrics have evolved to capture those nuances and fill in the
gaps in measuring user experience. The newest addition to the metrics story are
two [field metrics](/user-centric-performance-metrics/#in-the-field)—[Largest
Contentful Paint (LCP)](/lcp) and [Cumulative Layout Shift (CLS)](/cls)—which
are being incubated in W3C Web Performance Working Group, and a new [lab
metric](/user-centric-performance-metrics/#in-the-lab)—[Total Blocking Time
(TBT)](/tbt).

### Largest Contentful Paint (LCP)

[Largest Contentful Paint (LCP)](/lcp/) reports the time when the largest
content element becomes visible in the viewport.

Before Largest Contentful Paint, [First Meaningful Paint
(FMP)](/first-meaningful-paint/) and [Speed Index (SI)](/speed-index/) served to
capture the loading experience after the initial paint, but these metrics are
complex and often do not identify when the main content of the page has loaded.
Research has shown that simply looking at when [the largest element on the
page](/lcp/#examples) is rendered better represents when the main content of a
page is loaded.

The new Largest Contentful Paint metric will soon be available in Lighthouse
reports and in the meantime you can [measure LCP in
JavaScript](/lcp/#measure-lcp-in-javascript).

### Total Blocking Time (TBT)

[Total Blocking Time (TBT)](/tbt/) metric measures the total amount of time
between [First Contentful Paint (FCP)](/first-contentful-paint/) and [Time to
Interactive (TTI)](/interactive/) where the main thread was blocked for long
enough to prevent input responsiveness.

A [task is considered long](/custom-metrics/#long-tasks-api) if it runs on the
main thread for more than 50 milliseconds. Any millisecond over that is counted
towards that task's blocking time.

<figure class="w-figure">
  {% Img src="image/admin/73CEd4i55qCVQKdOb6iK.png", alt="A diagram representing a 150 millisecond task which has 100 miliseconds of blocking time.", width="633", height="292", class="w-screenshot" %}
</figure>

The Total Blocking Time for a page is the sum of the blocking times of all long
tasks that occured between FCP and TTI.

<figure class="w-figure">
  {% Img src="image/admin/OGlrzhJ7ViNsywtZmUAh.png", alt="A diagram representing a five tasks with 60 miliseconds of total blocking time out of 270 milliseconds of main thread time.", width="800", height="236", class="w-screenshot" %}
</figure>

While Time to Interactive does a good job of identifying when the main thread
calms down later in load, Total Blocking Time aims to quantify how strained the
main thread is throughout load. This way, TTI and TBT complement each other and
provide balance.

### Cumulative Layout Shift (CLS)

[Cumulative Layout Shift (CLS)](/cls/) measures visual stability of a page and
quantifies how often users experience unexpected layout shifts. Unexpected
movement of content can be very frustrating and this new metric helps you
address that problem by measuring how often it's occurring for your users.

<figure class="w-figure">
  <video autoplay controls loop muted
    class="w-screenshot"
    poster="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability-poster.png"
    width="658" height="510">
    <source
      src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.webm"
      type="video/webm; codecs=vp8">
    <source
      src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.mp4"
      type="video/mp4; codecs=h264">
  </video>
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    A screencast illustrating how layout instability can negatively affect
    users.
  </figcaption>
</figure>

Check out the [detailed guide to Cumulative Layout Shift](/cls) to learn how
it's calculated and how to measure it.

The new Lighthouse performance score formula will soon de-emphasize FMP and FCI
and include the three new metrics—LCP, TBT, and CLS—as they better capture when
a page feels usable.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wB1bqc1tymL2uPuDgqpP.png", alt="In Lighthouse v6 First Contentful Paint, Speed Index, and Largest Contentful Paint are the main load performance metrics; Time To Interactive, First Input Delay, Max Potential First Input Delay, and Total Blocking Time are the main interactivity metrics; And Cumulative Layout Shift is the main predictability metric.", width="800", height="375", class="w-screenshot" %}
</figure>

Check out [Lighthouse performance scoring](/performance-scoring/) and the new
[web.dev metrics collection](/metrics/) to learn more.

## Field data (CrUX) thresholds adjusted in PageSpeed Insights

Over the past year we have been analyzing [web performance from the
field](/user-centric-performance-metrics/#in-the-field) via [Chrome User
Experience](https://developers.google.com/web/tools/chrome-user-experience-report)
(CrUX) data. With insights from that data we reassessed the thresholds that we
use to label a website "slow", "moderate", or "fast" in field performance.

{% Aside %} The term "average" that used to describe sites that are in between
"slow" and "fast" is now changed to "moderate" which is more fitting since this
middle group was not related to a statistical average. {% endAside %}

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jvGzonBGrlqZD2LtzaPB.png", alt="Two bar charts showing the distribution of slow, fast, and moderate speed for FCP and FID.", width="748", height="200", class="w-screenshot" %}
</figure>

In order to get an overall assessment for a site, [PageSpeed Insights
(PSI)](https://developers.google.com/speed/pagespeed/insights) uses a certain
percentile of the total distribution of field data as the golden number for that
site; the previous thresholds used were 90th percentile for First Contentful
Paint and 95th percentile for First Input Delay (FID).

For example, if a site has an FCP distribution of 50% fast, 30% moderate, 20%
slow, the 90th percentile FCP is in the slow section, making the overall field
score for the site slow.

This has been adjusted to have a better overall distribution across websites and
the new breakdown is:

<table>
  <tr>
    <td>Metric</td> <td>Overall Percentile</td> <td>Fast (ms)</td> <td>Moderate
    (ms)</td> <td>Slow (ms)</td>
  </tr> <tr>
    <td>FCP</td> <td>75th percentile</td> <td>1000</td> <td>1000-3000</td>
    <td>3000+</td>
  </tr> <tr>
    <td>FID</td> <td>95th percentile</td> <td>100</td> <td>100-300</td>
    <td>300+</td>
  </tr>
</table>

For example, now if a site has an FCP distribution of 50% fast, 30% moderate,
20% slow, the 75th percentile FCP is in the moderate section, making the overall
field score for the site moderate.

## Canonical URL redirects in PageSpeed Insights

To enable you to measure the user's experience as accurately as possible, the
PageSpeed Insights team has added a reanalyze prompt to PSI. For sites that are
redirected to a new URL, you're prompted to rerun the report on the landing URL
for a more complete picture of your actual performance.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K299AL6Ni7dO5W4ksqXF.png", alt="PSI user interface showing the URL redirect and the 'Reanalyze' button", width="800", height="223", class="w-screenshot" %}
</figure>

## CrUX in the new Search Console Speed report

Search Console rolled out their [new Speed
report](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html)
a week before Chrome Dev Summit. It uses data from the Chrome User Experience
Report to help site owners discover potential user experience problems. The
Speed report automatically assigns groups of similar URLs into "Fast",
"Moderate," and "Slow" buckets, and helps prioritize performance improvements
for specific issues.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ny8QAjPaET6sIUX4z3Pz.png", alt="Search Console Speed report.", width="800", height="801", class="w-screenshot" %}
</figure>

## Web Almanac

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lVldn64qc3gc5UDHeMBo.png", alt="Dion Almaer presenting Web Almanac at CDS 2019.", width="800", height="450", class="w-screenshot" %}
</figure>

In the opening keynote we announced the launch of the [Web
Almanac](https://almanac.httparchive.org/en/2019/), an annual project that
matches the stats and trends about the state of the web with the expertise of
the web community. 85 contributors, made up of Chrome developers and the web
community, have volunteered to work on the project, which analyzes 20 core
aspects about the web addressing how sites are built, delivered, and
experienced. Start exploring the Web Almanac to learn more about the state of [performance](https://almanac.httparchive.org/en/2019/performance), [JavaScript](https://almanac.httparchive.org/en/2019/javascript), and [third-party](https://almanac.httparchive.org/en/2019/third-parties) code on the web.

## Learn more

For more details about performance tooling updates from
Chrome Developer Summit, watch the Speed tooling evolutions talk:

{% YouTube 'iaWLXf1FgI0' %}
