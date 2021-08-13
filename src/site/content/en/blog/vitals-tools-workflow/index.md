---
title: A performance-focused workflow based on Google tools
subhead: Combine Google tools to audit, improve and monitor your website effectively.
authors:
  - antoinebisch
  - gmimani
date: 2021-08-09
hero: image/PTlEGTxNW2XkfI8mA3pIGDFxdYY2/1qMzdR1XGj3HKzuW4PFG.jpg
thumbnail: image/PTlEGTxNW2XkfI8mA3pIGDFxdYY2/ApVe49OiB4KIJwcC7njy.jpg
alt: An image of the various tools described in this article.
description: >
  With the growing importance of Core Web Vitals, site owners and developers increasingly focus on performance and key user experiences. Google provides many tools to help evaluate, optimize, and monitor pages, but users are often confused by the different sources of data and how to leverage them effectively. This article proposes a workflow combining several tools and clarifies where and how they make sense along the development process.
tags:
  - blog
  - web-vitals
  - performance
---

With the [Core Web Vitals](/vitals/) (CWV)
metrics now incorporated into
[Page experience signals](https://developers.google.com/search/docs/guides/page-experience#signals),
user experience optimization has increasingly become top of mind for website owners.
This article will suggest how the
[various performance-focused tools](/vitals-tools/)
that Google has made freely available can be combined to effectively evaluate
website health and identify pain points,
debug and optimize pages that need attention,
and continuously monitor and prevent regression.

<figure class="w-figure">
{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/aQKhuF8mZNiQNrMXhpkm.png",
alt="A diagram of the cycle outlined in this article: evaluate website health and identify pain points, debug and optimize, monitor and continuous development.",
width="800", height="465" %}
  <figcaption class="w-figcaption">
    Suggested workflow to optimize Core Web Vitals.
  </figcaption>
</figure>

CWV are evaluated from real user experiences on a website.
The more data that can be collected and analyzed based on real users,
the more successful website owners will be at optimizing their pages.
To this effect,
we strongly recommend implementing
[Real User Measurement](/vitals-field-measurement-best-practices/) (RUM)
monitoring in addition to this workflow.

## Step A: Evaluate website health and identify pain points

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/i1Uk3GTajiHlylHL4wP1.png",
alt="Image of the three tools used in this step: CrUX Dashboard, Search Console, PageSpeed Insights.",
width="800",
height="203" %}

1. Use the [CrUX Dashboard](http://g.co/chromeuxdash)
to measure the health of your website.
2. Use [Search Console](https://search.google.com/search-console/about)
to identify pages that need attention.
3. Use [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
to deep dive on user experience metrics for a specific page.

As a developer embarking on website optimization,
knowing where to start can be overwhelming.
The questions that usually come to mind are:

- How is my website performing, and does it need attention?
- Has the website's experience improved or degraded recently?
- What pages, metrics, and devices should I prioritize?

### Measure the health of your website with the CrUX Dashboard

<figure class="w-figure w-screenshot">
{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/ZR8BFHyDN6vBaiL1Zm59.png",
alt="A screenshot of the landing page of a Chrome UX Report.",
width="800", height="837" %}
  <figcaption class="w-figcaption">
    The landing page of a Chrome UX Report.
  </figcaption>
</figure>

To get a snapshot of a website's performance you can
[generate a CrUX Dashboard](/chrome-ux-report-data-studio-dashboard/)
at [g.co/chromeuxdash](http://g.co/chromeuxdash),
based on the [Chrome UX Report](/chrome-ux-report/) (CrUX) data.
CrUX is powered by key user experience metrics across the public web,
aggregated from real Chrome users who have opted-in to syncing their browsing history
(as such, it does not report the experience of all users of a website).

{% Aside %}
A website might not have enough eligible traffic
to be included in the CrUX dataset to generate this report.
You can capture real-time key user metrics by
[integrating the web-vitals.js library](/vitals/#measure-core-web-vitals-in-javascript)
or using other RUM solutions.
This is a good practice even for websites with enough CrUX data as it allows monitoring on a larger user base.
{% endAside %}

The CrUX report provides information on:

- **Overview of the site:**
split by desktop and mobile for the key CWV Metrics
(Largest Contentful Paint, Cumulative Layout shift, and First Input Delay)
in addition to other metrics such as First Contentful Paint and Time To First Byte.
- **Historical Trend by Metric type:**
each page includes a chart showing distributions over time
for each available monthly release of the CrUX report data.
- **User Demographics:**
these pages illustrate the distribution of page views across the entire origin
for users in each demographic (devices and effective connection types).

With this dashboard you can:

- Get insights on overall website stability
and performance per device type, and identify areas of improvement.
- Understand how architectural changes or builds to the site
have impacted user experience over time
(overlaying your historical release data with the CrUX dashboard monthly results,
to understand what caused regressions).
- Narrow down on regression timelines, providing the focus for further investigation.

To know more about how to use the CruX dashboard, read
[Using the dashboard](/chrome-ux-report-data-studio-dashboard/#using-the-dashboard).

Once you get the overall picture,
the next step is to identify which pages or templates need the most attention.
These origin-level reports do not provide this insight,
but the Search Console does.

### Identify poor performing pages using Google Search Console

<figure class="w-figure">
{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/w3CgACGvcnqjORHfWVNg.png",
alt="A screenshot of Core Web Vitals charts.",
width="800", height="639" %}
  <figcaption class="w-figcaption">
    Core Web Vitals report in the Search Console.
  </figcaption>
</figure>

[The Core Web Vitals report in Search Console](https://support.google.com/webmasters/answer/9205520)
provides a holistic site-wide view of your performance
and helps identify the types of pages that need the most attention.
Using this tool you can:

- Identify the number of pages that have a poor experience,
those that need improvements, and those that give a good experience,
broken down by mobile and desktop views.
- Get granular information on URL performance grouped by status,
metric, and URL groups (groups of similar web pages).
- Identify key templates of pages to improve based on the URL groups surfaced.
(Each group contains URLs that provide a similar user experience).
- Get detailed device-specific reports
showing how many URLs are in the different experience buckets for either mobile or desktop.

Here are a few things that you should consider when using Search Console:

- While other tools have free access,
the Search Console requires authorized user access.
If you do not have access to this tool,
reach out to the relevant team to get access or share insights.
- Only indexed URLs can appear in this report,
except for the coverage report where you can see URLs that were crawled but not indexed.
The URLs shown are the actual URLs for which data was recorded
(that is, data is not assigned only to a page's canonical URL,
as it is in most other reports).
- Data showcased in this report might look different from the data displayed in the CrUX Dashboard.
Search Console charts show status by URL,
whereas the CrUX Dashboard shows status by visit.
Therefore, if you have a few poorly performing URLs with a high volume of visits,
the Search Console chart will show only a few poor URLs,
while the CrUX Dashboard will show a high percentage of poor experiences
(visits broken down per metrics).

Analyzing your website using the Search Console tool
narrows your analysis to pages and page types that need the most attention.
With this knowledge,
the next step is to get into the performance details of these pages.

### Analyzing page performance details with PageSpeed Insights

[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) (PSI)
provides two types of data:
field data surfaced from CrUX
(the same data powering the CrUX Dashboard and the Search Console)
and lab data, generated by
[Lighthouse](/lighthouse-performance/).

<figure class="w-figure">
{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/pVPH2WmTHsb7Es5KSfYb.png",
alt="A screenshot of the URL-level CrUX data.",
width="800", height="268" %}
  <figcaption class="w-figcaption">
    URL-level CrUX data in PSI.
  </figcaption>
</figure>

One of the most exciting features of PSI
is that it is the only web-based tool able to display a subset of CrUX data
(FCP, LCP, FID and CLS) at URL-level,
provided it has enough traffic eligible for data collection.
This data covers the last 28 days of user experience.
With this tool, you can get the user experience metrics evaluated at the 75th percentile.
In other words, if 75% of user experiences are equal to,
or better than the threshold set for the metric,
then the performance is considered 'good.'
A URL passes the CWV assessment when 75% of all visits to the page
performed at or above CWV thresholds for FID, LCP, and CLS.
You can compare the URL-level data with origin-level data
to see if the individual URLs are better or worse than
the origin-level metrics and understand what is unique about the particular page.

#### Lab data, generated by Lighthouse

The overall Lighthouse score for the URL displays at the top of the page.
Below the field data section is the lab data section
that provides metrics collected from a real-time Lighthouse run
and surfaces opportunities for the page.

Running PSI for different types of pages—analyzing the
field data and opportunities—will provide you with
a high-level understanding of metrics and improvements to focus on.
With that information,
you are now ready to debug and optimize your pages which we will discuss in the next section.

## Step B: Debug and optimize

{% Img src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/qWh67N9ZOLOu12FzO7oz.png",
alt="Image showing the tools used in this step: Lighthouse, Web Vitals Extension, Chrome DevTools.",
width="800", height="188" %}

1. Use [Lighthouse](/lighthouse-performance/)
to audit a page and uncover improvements.
2. Use the
[Web Vitals extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en)
to analyze CWV metrics in real-time on a page.
3. Use [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
to debug performance issues and test code changes.

Once you have identified the pages and metrics that need attention,
the next questions to ask are:

- How can these pages be optimized?
- What are the low-hanging fruits to tackle immediately?
- What improvements require more planning?

### Uncover opportunities with Lighthouse

The first step to answer these questions is using Lighthouse.
It provides a snapshot of opportunities to improve the load performance
for specific pages based on a lab run.
You can access Lighthouse in several ways, including:

- Running
[Lighthouse from Chrome DevTools](https://developers.google.com/web/tools/lighthouse#devtools).
- At [web.dev/measure](/measure/).
- From [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/).

Lighthouse identifies critical areas of optimization at load time
and by how much they could potentially improve the user experience.
Quickly identifying low-effort fixes helps to start the optimization process
before handling the bigger tasks.

While the metrics' absolute values may be interesting to look at,
keep in mind that they change based on the environment Lighthouse is running in
and many other factors,
such as the network conditions of the servers hosting the website and its third parties.
In addition,
Lighthouse simulates a user's experience on a mid-tier mobile on a slow-4G connection,
and might not represent your users' experience at the 75th percentile
(which the CWV metrics are based on).
The metrics are a good indication of what is going on in a website,
but we recommend focusing more on the optimization opportunities in the report.

{% Aside %}
Lighthouse analyzes pages at load time in a lab environment.
While lab assessments of LCP are often useful for debugging and optimizing LCP in the field,
user actions affect CLS and FID in ways that are not always captured by lab measurements of page load alone.
TTI and TBT are proxy metrics to diagnose FID issues,
but they may not always correlate with FID for a particular site.
{% endAside %}

<figure class="w-figure">
{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/9ziD4RGJizuyuUtctUZv.png",
alt="A screenshot of web.dev/measure.",
width="800", height="336" %}
  <figcaption class="w-figcaption">
    Lighthouse opportunities seen in web.dev/measure.
  </figcaption>
</figure>

### Real-time analysis with the Web Vitals extension

The [Web Vitals extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en)
shows real-time CWV metrics when loading and browsing a page.

One of the main benefits of using the extension over other tools
is that it measures the FID and CLS metrics during the interaction with the page,
in contrast with Lighthouse,
which only captures metrics until the page is loaded (and excludes FID).

{% Aside %}
The Web Vitals extension only works on Chrome desktop.
To assess the performance of a mobile site, use it in mobile emulation mode.
Also, switch to
[phone field data](/field-data-in-the-web-vitals-extension/#comparing-field-data-from-phones)
for more comparable results.
{% endAside %}

<figure class="w-figure w-screenshot">
{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/Yc4KfWt47zYfcNRTcLq6.png",
alt="A screenshot from the Web Vitals extension.",
width="800", height="556" %}
  <figcaption class="w-figcaption">
    Real-time information surfaced by the Web Vitals extension.
  </figcaption>
</figure>

While these tools provide a lot of useful information,
a developer may want to dig deeper into the underlying issues
and test changes before releasing their code.
Chrome DevTools (CDT) is a great help for doing just that.

### Deep dive with Chrome DevTools

If you are new to CDT,
you can get an overview of all the cool features—analyzing runtime performance,
optimizing website speed, debugging JavaScript,
simulating mobile devices,
overriding JavaScript and HTML, CSS,
and JavaScript coverage—in
[this post](https://developer.chrome.com/docs/devtools/).

Some features we recommend exploring in the context of CWV are the following:

- Load the page in the **Performance** tab to analyze the waterfall,
identify bottlenecks and
[observe the CWV flags](https://developer.chrome.com/blog/new-in-devtools-88/#web-vitals).
- Enable the
**[Layout Shift Regions](https://developer.chrome.com/blog/new-in-devtools-77/#layoutshifts)**
checkbox in the
**[Command Menu](https://developer.chrome.com/docs/devtools/command-menu/)**
and load the page in the **Network** tab to highlight layout shifts at load time
(also useful while browsing the page).
- Analyze code usage with the
**[Coverage](https://developer.chrome.com/docs/devtools/coverage/)**
tab and remove unused code to improve the LCP and FID metrics.
- Enable the
**[Local Overrides](https://developer.chrome.com/blog/new-in-devtools-65/#overrides)**
to test code changes on a live page.
Changes made through Chrome DevTools will persist,
and you can perform audits such as those discussed above,
allowing for a quick analysis of the impact on user experience.

<figure class="w-figure w-screenshot">
{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/81399qdVF2p7kVz5klUG.png",
alt="A screenshot from Chrome DevTools.",
width="484", height="306" %}
  <figcaption class="w-figcaption">
    The network tab in Chrome DevTools highlighting layout shift regions with the option activated.
  </figcaption>
</figure>

After going through the steps discussed so far,
the analyzed and fixed website should be in a better state.

To ensure the changes made had an actual positive impact on users,
you should carry out step A (Evaluate website health and Identify pain points)
of this article again.
Note that as CrUX data is aggregated over a 28-day period,
changes to user experience metrics may not be immediately apparent on PSI and CrUX.
This is why implementing RUM solutions is critical,
as they will surface metrics and validate fixes much faster.

User experience work is an iterative process
and to ensure new releases do not regress improvements made,
it is critical to have a robust monitoring and continuous development process in place.

## Step C: Monitor and continuous development

{% Img src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/YwmFzHT6SJmi8sJta7G7.png",
alt="An image of the tools used in step 3: CrUX on BigQuery, CrUX API, PSI API, web-vitals.js, and Lighthouse-CI.",
width="800", height="184" %}

1. Use
[CrUX on BigQuery](/chrome-ux-report-bigquery/),
[CrUX API](/chrome-ux-report-api/),
[PSI API](https://developers.google.com/speed/docs/insights/v5/get-started) and
[web-vitals.js](https://github.com/GoogleChrome/web-vitals)
to automate a website's real user data collection,
to power custom dashboards and build alerting systems.
2. Use
[Lighthouse-CI](/lighthouse-ci/)
to automate lab tests and prevent regressions.

Every organization spends a considerable amount of time and resources
on improving the performance of its website.
[Research by Google](https://youtu.be/YJGCZCaIZkQ?t=112)
has shown that most sites that optimize their web performance regress within six months.
A website needs continuous monitoring to understand trends,
identify issues, track regressions,
and alert developers to act on them to prevent regressions.

Most site owners use RUM tools to monitor their site performance.
These tools provide a view of their pages across different dimensions
such as browser, network, mobile devices, and traffic.
However, not everyone has this kind of tooling in place for continuous monitoring.

We provide APIs of the tools discussed in this article
which you can integrate into your systems
to automate the collection of data and power your solutions:

- [Querying the CrUX on BigQuery](/chrome-ux-report-bigquery/).
- [Using the CrUX API](/chrome-ux-report-api/).
- [Using the PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started).
- [Integrating web-vitals.js](https://github.com/GoogleChrome/web-vitals).

These may seem like a lot of APIs to integrate, so which tool should you prefer?
This table will help you choose the right APIs to suit your needs.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>CrUX on BigQuery</th>
        <th>CrUX API</th>
        <th>PSI API</th>
        <th>web-vitals.js</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Origin-level data (Field only)</td>
        <td>URL and Origin-level data (Field only)</td>
        <td>URL and Origin-level data (Lab and Field)</td>
        <td>URL-level data (Field only)</td>
      </tr>
      <tr>
        <td>Monthly aggregated data</td>
        <td>28 days rolling</td>
        <td>28 days rolling</td>
        <td>Real-time</td>
      </tr>
      <tr>
        <td>Allows slicing of data in meaningful ways
        which can be joined with other public datasets
        like the
          <a href="https://httparchive.org/">HTTP Archive</a> for advanced insights.</td>
        <td>RESTful access to CrUX data programmatically.
More filtering possibilities and faster than PSI API (also higher quota).</td>
        <td>RESTful access to CrUX and Lighthouse data programmatically.</td>
        <td>Collect real-time CWV metrics from real user experiences on a website
        (needs to be integrated in pages).</td>
      </tr>
      <tr>
        <td>Recommended for most accurate insights.
Default users can query 1TB of data per month.
Beyond that, the standard rates apply.</td>
        <td>Free within API quota.</td>
        <td>Free within API quota.</td>
        <td>Free.</td>
      </tr>
    </tbody>
  </table>
</div>


Collecting and reporting on metrics
is just one piece of adding governance to prevent regression
but it occurs after you have made changes to the site.
It would be ideal to identify potential pull requests that would degrade the performance ahead of code releases.
To this end, you can use
[Lighthouse-CI](https://web.dev/lighthouse-ci/)
with most continuous integration tools.
Using this,
you will be able to identify degrading PRs
and work on optimizations before code releases go live
and have an otherwise unexpected impact on users.

Keep in mind that the ideal setup to best identify areas of improvement
involves continuous capturing of your own RUM data by leveraging tools
and libraries such as
[web-vitals.js](https://github.com/GoogleChrome/web-vitals).

## Conclusion

<figure class="w-figure">
{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/aQKhuF8mZNiQNrMXhpkm.png",
alt="A diagram of the cycle outlined in this article: evaluate website health and identify pain points, debug and optimize, monitor and continuous development.",
width="800", height="465" %}
  <figcaption class="w-figcaption">
    Suggested workflow to optimize Core Web Vitals.
  </figcaption>
</figure>

Ensuring great user experience requires a performance-first mindset
and adopting the right strategy.
With the right tools and processes to audit, debug, monitor,
and add governance,
we believe that attaining great user experience and passing CWV is within anyone's reach.
