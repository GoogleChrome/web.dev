---
layout: post
title: Core Web Vitals workflows with Google tools
subhead: Combine Google tools to audit, improve and monitor your website effectively.
authors:
  - antoinebisch
  - gmimani
  - addyosmani
  - egsweeny
date: 2021-08-09
updated: 2022-07-18
hero: image/PTlEGTxNW2XkfI8mA3pIGDFxdYY2/1qMzdR1XGj3HKzuW4PFG.jpg
thumbnail: image/PTlEGTxNW2XkfI8mA3pIGDFxdYY2/ApVe49OiB4KIJwcC7njy.jpg
alt: An image of icons of the various Google tools described in this article.
description: >
  With the growing importance of Core Web Vitals, site owners and developers increasingly focus on performance and key user experiences. Google provides many tools to help evaluate, optimize, and monitor pages, but users are often confused by the different sources of data and how to leverage them effectively. This article proposes a workflow combining several tools and clarifies where and how they make sense along the development process.
tags:
  - blog
  - web-vitals
  - performance
---

[Core Web Vitals](/vitals/) are a set of metrics that assess the user experience on criteria such as load performance, responsiveness to user input, and layout stability. While Core Web Vitals are valuable user experience metrics, they won't mean much without guidance on creating a development workflow to continuously improve them in both the lab and the field.

{% Aside 'key-term' %}
[**Lab data**](/lab-and-field-data-differences/#lab-data) describes how _hypothetical_ users _may_ experience your website. [**Field data**](/lab-and-field-data-differences/#field-data) describes how _real_ users _actually_ experienced your website. Field data is also known as Real User Monitoring (RUM).
{% endAside %}

A workflow for improving Core Web Vitals for your website will be explored in this guide, but where that workflow begins depends on whether you're collecting your own field data. Where it ends may depend on which of Google's tools you'll find useful in diagnosing and fixing user experience problems.

## Collect your own field data if possible

While lab tools are invaluable, [the data they provide isn't always predictive of how a website performs for real users](https://discuss.httparchive.org/t/lighthouse-scores-as-predictors-of-page-level-crux-data/2232).

For example, Lighthouse runs tests with simulated throttling in a simulated desktop or mobile environment. While such simulations of slower network and device conditions often help surface user experience problems better than native network and device conditions, [they're just a single slice](/lab-and-field-data-differences/) of the large variety in network conditions and device capabilities across a website's entire user base.

{% Aside %}
To learn more about how simulated throttling works and how it differs from other types of throttling, [this bit of Lighthouse documentation](https://github.com/GoogleChrome/lighthouse/blob/master/docs/throttling.md#network-throttling) is your time.
{% endAside %}

### First or third-party tools

The best dataset for assessing website performance in the field is the one _you_ build. That starts with collecting field data from your website's visitors. How you do this depends on the size of your organization, and whether you want to pay for [a third-party solution](https://en.wikipedia.org/wiki/Real_user_monitoring#RUM_software) or create your own.

Paid solutions will almost certainly measure Core Web Vitals (and other performance metrics). In large organizations with significant resources, this may be the preferred method.

However, you may not be part of a large organization or even one with enough money to afford a third-party solution. In these cases, Google's [`web-vitals` library](https://github.com/GoogleChrome/web-vitals) will help you gather _all_ Web Vitals. However, you'll be responsible for how that data is reported, stored, and analyzed.

{% Aside 'caution' %}
If you're building your own metrics collection and reporting system, [this guide of best practices](/vitals-field-measurement-best-practices/) is worth a read to avoid common pitfalls.
{% endAside %}

### If you're using Google Analytics

If you're already using Google Analytics, but you haven't started collecting your own field data, there may be an opportunity for you to use the `web-vitals` library to send Web Vitals collected in the field to Google Analytics and use the [`web-vitals-report` tool](https://github.com/GoogleChromeLabs/web-vitals-report). The primary advantage of using `web-vitals-report` is that it simplifies analysis and visualization of field data by using an existing and widely-used analytics product.

## Understanding Google's tools

Regardless of whether you're collecting your own field data, there are several Google tools that may be useful in analyzing Core Web Vitals. Before establishing a workflow, a high-level overview of each tool can help you to understand which tools may&mdash;or may not&mdash;be best for you.

{% Aside %}
As you continue, understand that it's not necessary for you to use _all_ of the tools in this guide&mdash;only those that you believe will help you in improving your website's Core Web Vitals.
{% endAside %}

### Chrome User Experience Report (CrUX)

[CrUX](https://developer.chrome.com/docs/crux/) is a [BigQuery dataset](https://developer.chrome.com/docs/crux/bigquery/) of field data gathered from [a segment of real Google Chrome users](https://developer.chrome.com/docs/crux/methodology/#user-eligibility) from millions of websites. It also presents Core Web Vitals for websites with sufficient traffic, but only at the origin level. However, the [CrUX API](https://developer.chrome.com/docs/crux/api/) can provide field data at the URL level, provided a URL has enough samples in the CrUX dataset.

#### When to use CrUX

Even if you gather your own field data, CrUX is still useful. Though CrUX represents a subset of Chrome users, it's helpful to compare your website's field data to see how it aligns with its CrUX data. If you currently don't gather _any_ field data for your website, CrUX is especially valuable&mdash;provided your website is represented in its dataset.

#### When _not_ to use CrUX

Websites that don't receive enough traffic are not represented in the CrUX dataset. If this is the case for you, you'll need to gather your own field data to understand how your website performs in the field, as CrUX won't be an option.

{% Aside 'caution' %}
Since the data CrUX provides is a rolling average over the previous 28 days, it's not an ideal tool during development, as it will take a fair amount of time for improvements to be reflected in the CrUX dataset.
{% endAside %}

### PageSpeed Insights (PSI)

[PSI](https://pagespeed.web.dev/) is a tool that reports field data from CrUX _and_ field lab from Lighthouse for a given page.

#### When to use PSI

PSI is great for assessing performance at the page level. It's a good choice for those in non-developer roles who wish to assess how specific pages are performing in the field, which is valuable if you're not gathering your own field data. PSI also provides recommendations for non-developers who are not already using Lighthouse, and from a more consistent baseline than running Lighthouse from your own laptop.

#### When _not_ to use PSI

PSI may not be worth using for developers already using Lighthouse. From the field data perspective, it's not a fit for websites that aren't represented in the CrUX dataset.

### Search Console

[Search Console](https://search.google.com/search-console/about) measures your site's search traffic and performance, [including Core Web Vitals](https://support.google.com/webmasters/answer/9205520). A valuable feature of Search Console is that it assesses groups of similar pages (for example, pages that use the same template). Search Console also includes a Core Web Vitals report based on field data from CrUX.

#### When to use Search Console

Search Console is well-suited for both developers and those in non-developer roles to assess both search and page performance in ways other Google tools don't. Its presentation of CrUX data and grouping of pages by similarity offers novel insight into how performance improvements impact entire categories of pages.

#### When _not_ to use Search Console

Search Console may not be a fit for projects that use different third-party tools which group pages by similarity, or if a website isn't represented in the CrUX dataset.

### Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) is a lab tool that provides specific opportunities for improving page performance. [Lighthouse user flows](/lighthouse-user-flows/) also allow developers to script interaction flows for performance testing beyond page startup.

{% Aside %}
Because Lighthouse is a lab tool and [First Input Delay (FID)](/fid/) is a field metric, it reports [Total Blocking Time](/tbt/) instead.
{% endAside %}

[Lighthouse-CI](https://github.com/GoogleChrome/lighthouse-ci) is a related tool that runs Lighthouse during project builds and deploys to assist with performance regression testing. It presents a Lighthouse report along with pull requests, and tracks performance metrics over time.

#### When to use Lighthouse

Lighthouse is excellent for finding performance improvement opportunities during development in both local and staging environments. Lighthouse CI is similarly useful in the build and deploy phases to staging and production environments, where performance regression testing is needed to preserve good user experiences.

{% Aside 'caution' %}
Don't rely solely on Lighthouse CI during production deployments, as you may miss performance regressions that you'd otherwise catch in local and staging environments during development with Lighthouse.
{% endAside %}

#### When _not_ to use Lighthouse

Lighthouse (or Lighthouse CI) is not ideal for those in non-developer roles, and **is _not_ a substitute for field data**. Those in non-developer roles may find PageSpeed Insights more convenient for gathering Lighthouse recommendations, as well as view field data provided by CrUX.

### Web Vitals extension

The [Web Vitals Chrome extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma) is a diagnostic tool that measures changes in Core Web Vitals in real time on desktop devices. It also includes CrUX data for the current page if it is represented in the CrUX dataset.

#### When to use the Web Vitals extension

The Web Vitals extension can be used by anyone in any role to assess a page's Core Web Vitals at all points of the page lifecycle. It reports changes as they occur, and signals changes in accordance with the [Core Web Vitals thresholds](/defining-core-web-vitals-thresholds/).

#### When _not_ to use the Web Vitals extension

The Web Vitals extension isn't a holistic assessment of page performance, and should be supplemented by more comprehensive tools. Lighthouse user flows in particular are useful as, with the Web Vitals extension, it monitors changes in Core Web Vitals _after_ the page has loaded. Unlike the Web Vital extension, though, Lighthouse user flows provide more insight into _what_ causes changes in Core Web Vitals.

### The performance tab in Chrome's DevTools

[Chrome DevTools](https://developer.chrome.com/docs/devtools/) is a collection of in-browser development tools, including the [performance tab](https://developer.chrome.com/docs/devtools/#performance). The performance tab is a lab tool that profiles all page activity during startup or a recorded time period. It offers deep insight into everything it observes across dimensions such as network, rendering, painting and scripting activity, as well as a page's Core Web Vitals.

#### When to use the performance tab

The performance tab should be used by developers during development to gain deep insight into page performance. It can be used with Lighthouse or other tools that export performance traces which can later be [loaded in the performance tab](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#load).

#### When _not_ to use the performance tab

The performance tab is a developer tool that provides lab data only. It's not a substitute for field data, and may not be easy to use for novice developers or those in non-developer roles.

## A three step workflow for ensuring your website's Core Web Vitals stay healthy

When working to improve the user experience, it's best to think of the process as a continuous cycle. For improving Core Web Vitals and other performance metrics, one approach could be:

1. Evaluate website health and identify pain points.
2. Debug and optimize.
3. Monitor with continuous integration tools to catch and prevent regressions.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/9k3o679FUq63WT1kbxHe.png", alt="A diagram of a three step process, rendered as a continuous cycle. The first step reads 'Evaluate website health and identify paint points', the second 'Debug and optimize', and the third 'Monitor and continuous development'.", width="800", height="465" %}
</figure>

### Step 1: Evaluate website health and identify opportunities for improvement

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ZMqqyP9cuwY1DEGE3Qky.png", alt="A flow for evaluating website health and identifying opportunity for improvement. From left to right, the steps are 'CrUX Dashboard/Field Data', 'Search Console', and 'PageSpeed Insights'.", width="800", height="358" %}
</figure>

1. Interpret field data provided by [CrUX Dashboard](http://g.co/chromeuxdash) and/or your own field data to assess website health.
2. Use [Search Console](https://search.google.com/search-console/about) to identify pages which need improvement. **Note:** If you're already collecting your own field data, it may be easier to rely on that rather than using Search Console.
3. Use [PageSpeed Insights](https://pagespeed.web.dev/) to get specific information on user experience metrics for those pages as well as opportunities for improvement.

Whether you analyze field data you collect yourself or CrUX data, the first step is vital. If you're not gathering field data, CrUX data may be enough to guide you&mdash;again, provided your website is represented in the dataset.

#### Measure website health with the CrUX dashboard and collected field data

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/oF2PQELFtdICPN10aZge.png", alt="A screenshot of the CrUX dashboard. The dashboard breaks down LCP, FID, and CLS into desktop and mobile categories, with each category showing the distribution of values that lie within 'Good', 'Needs Improvement' and 'Poor' thresholds for the previous month.", width="800", height="837" %}
</figure>

To get a snapshot of your website's performance, you can [create a CrUX Dashboard](/chrome-ux-report-data-studio-dashboard/) which reports the following:

- **Site overview**, which segments Core Web Vitals into desktop and mobile device types.
- **Historical trend by metric type**, which is a distribution of metrics over time for each available monthly release of CrUX report data.
- **User demographics**, which illustrates the distribution of page views across an entire origin for users in each demographic including device and [effective connection](https://developer.mozilla.org/docs/Glossary/Effective_connection_type) types.

Even if your website is represented in CrUX, you should still collect your own field data, since CrUX doesn't include _all_ users of Chrome or even other browsers&mdash;but it's certainly a good place to start in the absence of any field data.

#### Identify poorly performing pages in Search Console

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/DWdv878oyTdEWQViRh06.png", alt="A screenshot of a Core Web Vitals report in Search Console. The report is broken down into Desktop and Mobile categories, with line graphs detailing the distribution of pages with Core Web Vitals in the 'Good', 'Needs Improvement', and 'Poor' categories over time.", width="800", height="639" %}
</figure>

While the [Core Web Vitals report in Search Console](https://support.google.com/webmasters/answer/9205520) shows the big picture of your website's performance, you can still drill down into specific pages that need attention. With Search Console, you can also:

- Identify individual pages that need improvement and those that currently provide a good user experience.
- Get granular data on performance by URL grouped by status, metric, and groups of similar web pages (such all product detail pages on an e-commerce website, for example).
- Get detailed reports that bucket URLs in each user experience quality category for both mobile and desktop.

{% Aside 'caution' %}
The data in Search Console is different from what's shown in CrUX dashboard. This is because Search Console organizes information by URL, whereas CrUX Dashboard organizes data by origin. If you have few poorly performing URLs, but those URLs receive a large portion of overall traffic, Search Console will only show a few poorly performing URLs while CrUX dashboard will show a high percentage of poor user experiences.
{% endAside %}

#### Analyze performance by page with PageSpeed Insights

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/qobynTXHVaEPD2Ng8ZLb.png", alt="A screenshot of how PageSpeed Insights portrays CrUX data for a URL's Core Web Vitals. Each of the Core Web Vitals is displayed separately, while grouping each Core Web Vital in the 'Good', 'Needs Improvement', and 'Poor' thresholds for the last 28 days.", width="800", height="268" %}
</figure>

PageSpeed Insights displays a subset of CrUX data at the URL level covering the last 28 days of user experience data at the 75th percentile. This means that if 75% of user experiences meet the [threshold set for a given metric](/defining-core-web-vitals-thresholds/), then the experience is considered "good".

The lab data component of PageSpeed Insights is represented by the Lighthouse score, which also provides specific opportunities for improvement. At this point, you're ready to debug and fix performance issues.

### Step 2: Debug and optimize

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/8HckQw23SkwcDwgMGp33.png", alt="A two-step flow, with the Lighthouse and Web Vitals Extension icons at left, then an arrow, then the Chrome DevTools icon at the right.", width="800", height="187" %}
</figure>

1. Run Lighthouse to audit a page to get page-level guidance and use the Web Vitals extension to analyze Core Web Vitals in real time.
2. Use the performance tab in Chrome's DevTools to debug performance issues and test code changes.

#### Uncover opportunities with Lighthouse

Though PageSpeed Insights runs Lighthouse for you, it's more convenient during local development to run Lighthouse from Chrome's DevTools.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/k6HffrY6tUbreyzi2mVk.png", alt="A screenshot of a Lighthouse report within Chrome's DevTools. The report breaks down scores across five categories, with the report focused on the 'Performance' category, with results at the bottom of the report window.", width="800", height="526" %}
</figure>

{% Aside %}
Out of the box, Lighthouse only assesses the user experience during page startup. Since it's a lab tool, it also excludes FID in favor of TBT and [Time to Interactive (TTI)](/tti/). If you need to profile specific interactions or page behaviors that occur after startup, read the [Lighthouse user flows guide](/lighthouse-user-flows/) for more information.
{% endAside %}

Lighthouse runs simulate a mid-tier mobile device on a throttled slow 4G connection. This may find issues that wouldn't ordinarily appear on high-speed devices or fast internet connections.

Even so, this simulated throttling may not be representative of the variety of user experiences among your website's user base at the 75th percentile. However, these metrics are an indicator of where performance problems exist, and may translate into better performance overall in the field if the problems Lighthouse finds are addressed.

#### Analyze in real time with the Web Vitals extension

The Web Vitals Chrome extension shows Core Web Vitals in real time during startup _and_ while browsing a page. Because of this, it can capture FID, as well as layout shifts that occur after startup.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/FfyQpEEpJYkjW39eDz4S.png", alt="A screenshot of the Web Vitals Chrome extension panel. It shows the state of each Core Web Vital, and how the current page experience compares with the 75th percentile of end user experiences as gathered by CrUX (if available).", width="800", height="556" %}
</figure>

It's best to think of the Web Vitals extension as a spot-checking tool to find performance issues, not a comprehensive debugging tool&mdash;that's a job for the performance tab in Chrome's DevTools.

#### Drill down with the performance tab

The performance tab in Chrome's DevTools profiles all page behavior during a recorded period of time. When populated, a layer in the timeline labeled "experience" appears, which highlights layout shifts and the elements that shifted.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/vCzfCMzllJfrbHw5up3j.png", alt="A screenshot of a populated performance tab in Chrome's DevTools. The interface shows a row labeled 'Experience', which shows a single layout shift. The layout shift is focused in the tab, with information about the layout shift (such as the duration) in the bottom pane.", width="800", height="509" %}
</figure>

Additionally, there's a checkbox near the top of the performance tab labeled "Web Vitals", which plots Web Vitals on the timeline as well as long tasks:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/N8XSXfHenREUQxnw84HH.png", alt="A screenshot of a populated performance tab in Chrome's DevTools. The interface is composed of many rows, including one for each of the Core Web Vitals, which shows when each Core Web Vital metric occurred in time. The interface is also accompanied by bars representing where long tasks occurred, and how long.", width="800", height="509" %}
</figure>

These features&mdash;as well as information in other parts of the performance tab&mdash;can help you determine whether fixes are having any effect on a page's Core Web Vitals.

{% Aside %}
To ensure fixes are helping your website's users to meet the thresholds defined for Core Web Vitals at the 75th percentile, consider connecting a low to mid-tier Android device to your development machine and use [remote debugging](https://developer.chrome.com/docs/devtools/remote-debugging/). If you don't have an Android device for performance testing, the CPU throttling dropdown simulates slower devices.
{% endAside %}

In addition to Core Web Vitals, you can observe the TBT for a given page in the lower-left hand corner of the performance tab window.

{% Aside %}
When debugging performance issues related to LCP, TBT, and FID, and general loading performance issues, consider using the [coverage tool](https://developer.chrome.com/docs/devtools/coverage/) to track how much code goes unused during a recording. This may help identify [code splitting opportunities](/reduce-javascript-payloads-with-code-splitting/).
{% endAside %}

#### Debug Core Web Vitals in the field

Lab tools can't always identify the cause of all Core Web Vitals issues affecting your users. This is one reason why it's so important to collect your own field data, as it takes factors into account that lab data cannot. Additionally, [learning how to debug Core Web Vitals in the field](/debug-web-vitals-in-the-field/) can help you make sense of changes in your website's Core Web Vitals in the field.

### Step 3: Monitor with continuous integration tools

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/LqEnonUKd8j3QGK3Ax7w.png", alt="A collection of icons for Google tools. From left to right, the icons represent 'CrUX on BigQuery', 'CrUX API', 'PSI API', 'web-vitals.js', with 'Lighthouse CI' at the far right.", width="800", height="185" %}
</figure>

The last step in the performance improvement workflow cycle is two-fold:

1. Use [CrUX on BigQuery](/chrome-ux-report-bigquery/), [CrUX API](/chrome-ux-report-api/), [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started), and/or the [`web-vitals`](https://www.npmjs.com/package/web-vitals) JavaScript library to automate a website's field data collection, and optionally use this data to power custom dashboards and alerting systems.
2. Use [Lighthouse-CI](https://github.com/GoogleChrome/lighthouse-ci) for performance regression testing.

{% Aside %}
[Research by Google](https://youtu.be/YJGCZCaIZkQ?t=112) has shown that most performance improvements tend to regress within six months. A website needs continuous monitoring in both the lab _and_ the field to identify worsening trends in Core Web Vitals and other performance metrics to avoid regressions.
{% endAside %}

The tools listed in the first step may seem like a lot, but you don't necessarily need _all_ of them&mdash;only those that will give you the level of coverage you need to assess performance and preserve good user experiences. The table below can help you determine which tools you need:

<div class="table-wrapper scrollbar">
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
        <td>Breaks down data into meaningful dimensions, such as country, connection, device, and other factors, all with more detailed distribution data</td>
        <td>RESTful access to CrUX data programmatically. More filtering possibilities and faster than PSI API (also higher quota).</td>
        <td>RESTful access to CrUX and Lighthouse data programmatically.</td>
        <td>Collect real-time Core Web Vitals metrics from real user experiences on a website (needs to be integrated in pages).</td>
      </tr>
      <tr>
        <td>Default users can query 1TB of data per month. Beyond that, the standard rates apply.</td>
        <td>Free within API quota.</td>
        <td>Free within API quota.</td>
        <td>Free.</td>
      </tr>
    </tbody>
  </table>
</div>

You don't need to follow the workflow in this article to the letter, but the following tools can still help to keep you on track for improving your website's performance:

- Record field data from real users using the `web-vitals` library.
- Identify specific pages with poor user experiences in Search Console.
- Complement the data from Search Console with a site-wide Core Web Vitals assessment from CrUX (if available).
- Identify user experience issues with Lighthouse and the performance tab in Chrome's DevTools.
- Catch regressions with Lighthouse-CI.

Any workflow is better than none at all, as no plan for addressing problems with your website's Core Web Vitals will likely result in worse user experiences that escape your notice.

## Conclusion

Ensuring fast and delightful user experiences requires a performance-first mindset and adoption of a workflow to ensure progress. With the right tools and processes to audit, debug, monitor, and provide governance, building great user experiences and staying within the thresholds defined for good Core Web Vitals is within your reach.
