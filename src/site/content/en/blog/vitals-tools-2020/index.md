---
title: "Tools to measure Core Web Vitals"
subhead: Your favorite developer tools can now measure the Core Web Vitals.
authors:
  - addyosmani
  - egsweeny
date: 2020-05-28
description: |
  Read about the newly announced Core Web Vitals measurement support across popular web developer tools like Lighthouse, PageSpeed Insights, Chrome UX Report, and many others.
hero: image/admin/wNtXgv1OE2OETdiSzi8l.png
thumbnail: image/admin/KxBRBQe5CRZpCxNYyW2H.png
alt: Chrome User Experience logo, PageSpeed Insights logo, Lighthouse logo, Search Console logo, Chrome DevTools logo, Web Vitals extension logo.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - web-vitals
  - performance
---

The recently announced [Web Vitals](/vitals/) initiative provides unified guidance about quality signals that are essential for all sites to deliver a great user experience on the web. We're happy to announce that **all of Google's popular tools for web developers now support measurement of Core Web Vitals**, helping you more easily diagnose and fix user experience issues. This includes [Lighthouse](https://github.com/GoogleChrome/lighthouse), [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/), [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools), [Search Console](https://search.google.com/search-console/about), [web.dev's measure tool](/measure/), the [Web Vitals Chrome extension](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma) and a new (!) [Chrome UX Report](https://developers.google.com/web/tools/chrome-user-experience-report) API.

With Google Search now including Core Web Vitals as the foundation for evaluating [page experience](https://webmasters.googleblog.com/2020/05/evaluating-page-experience.html), it's important that these metrics are as available and actionable as possible.

<figure class="w-figure">
  {% Img src="image/admin/V00vjrHmwzljYo04f3d3.png", alt="Summary of Chrome and Search Tools that support the Core Web Vitals metrics", width="800", height="509", class="w-screenshot" %}
</figure>

{% Aside 'key-term' %}
**Lab tools** provide insight into how a _potential user_ will likely experience your website and offer reproducible results for debugging. **Field** tools provide insight into how your _real users_ are experiencing your website; this type of measurement is often called Real User Monitoring (RUM). Each [lab or field tool](/how-to-measure-speed/#lab-data-vs-field-data) offers distinct value for optimizing your user experience.
{% endAside %}

To begin your journey optimizing user-experience with Core Web Vitals, try the following workflow:

* Use Search Console's new Core Web Vitals report to identify groups of pages that require attention (based on the field data).
* Once you've identified pages that need work, use PageSpeed Insights (powered by Lighthouse and Chrome UX Report) to diagnose lab and field issues on a page. PageSpeed Insights (PSI) is available via Search Console or you can enter a URL on PSI directly.
* Ready to optimize your site locally in the lab? Use Lighthouse and Chrome DevTools to measure Core Web Vitals and get actionable guidance on exactly what to fix. The Web Vitals Chrome extension can give you a real-time view of metrics on desktop.
* Need a custom dashboard of Core Web Vitals? Use the updated CrUX Dashboard or new Chrome UX Report API for field data or PageSpeed Insights API for lab data.
* Looking for guidance? web.dev/measure can measure your page and show you a prioritized set of guides and codelabs for optimization, using PSI data.
* Finally, use Lighthouse CI on pull requests to ensure there are no regressions in Core Web Vitals before you deploy a change to production.

With that introduction, let's dive into the specific updates for each tool!

### Lighthouse

Lighthouse is an automated website auditing tool that helps developers diagnose issues and identify opportunities to improve the user experience of their sites. It measures several dimensions of user experience quality in a lab environment, including performance and accessibility. The latest version of Lighthouse ([6.0](/lighthouse-whats-new-6.0/), released mid-May 2020) includes additional audits, new metrics, and a newly composed performance score.

<figure class="w-figure">
  {% Img src="image/admin/4j72CWywp2D88Xti8zBf.png", alt="Lighthouse 6.0 showing the latest Core Web Vitals metrics", width="800", height="527", class="w-screenshot" %}
</figure>

Lighthouse 6.0 introduces three new metrics to the report. Two of these new metrics—[Largest Contentful Paint](/lcp/) (LCP) and [Cumulative Layout Shift](/cls/) (CLS)—are lab implementations of Core Web Vitals and provide important diagnostic information for optimizing user experience. Given their importance for assessing user experience, the new metrics are not only measured and included in the report, they are also factored in calculating the performance score.

The third new metric included in Lighthouse—[Total Blocking Time](/tbt/) (TBT)—correlates well with the field metric [First Input Delay](/fid/) (FID), another Core Web Vitals metric. Following the recommendations provided in the Lighthouse report and optimizing against your scores sets you up to provide the best possible experience to your users.

All of the products that Lighthouse powers are updated to reflect the latest version, including [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) which enables you to easily measure your Core Web Vitals on pull requests before they're merged and deployed.

<figure class="w-figure">
  {% Img src="image/admin/aOm5ZAIUbspjcyRMIXbn.png", alt="Lighthouse CI displaying a diff view with Largest Contentful Paint", width="800", height="498", class="w-screenshot" %}
</figure>

To learn more about the latest updates to Lighthouse, check out our
[What's New in Lighthouse 6.0](/lighthouse-whats-new-6.0/) blog post.

### PageSpeed Insights

[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) (PSI) reports on the lab and field performance of a page on both mobile and desktop devices. The tool provides an overview of how real-world users experience the page (powered by the Chrome UX Report) and a set of actionable recommendations on how a site owner can improve page experience (provided by Lighthouse).

PageSpeed Insights and the [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started) have also been upgraded to use Lighthouse 6.0 under the hood and now support measuring Core Web Vitals in both the lab and field sections of the report! Core Web Vitals are annotated with a blue ribbon as shown below.

<figure class="w-figure">
  {% Img src="image/admin/l1posckVsR7JeVGnk6Jv.png", alt="PageSpeed Insights with Core Web Vitals data displayed for field and lab", width="800", height="873", class="w-screenshot" %}
</figure>

While [Search Console](https://search.google.com/search-console/) provides site owners with a great overview of groups of pages that need attention, PSI helps identify per-page opportunities to improve page experience. In PSI, you are able to clearly see whether or not your page meets the thresholds for a good experience across all Core Web Vitals at the top of the report, indicated by **passes the Core Web Vitals assessment** or **does not pass the Core Web Vitals assessment**.

### CrUX

The [Chrome UX Report](https://developers.google.com/web/tools/chrome-user-experience-report/) (CrUX) is a public dataset of real user experience data on millions of websites. It measures field versions of all the Core Web Vitals. Unlike lab data, CrUX data comes from [opted-in users](https://developers.google.com/web/tools/chrome-user-experience-report/#methodology) in the field. Using this data, developers are able to understand the distribution of real-world user experiences on their own or even competitors' websites. Even if you don't have RUM on your site, CrUX can provide a quick and easy way to assess your Core Web Vitals. The [CrUX dataset on BigQuery](https://developers.google.com/web/tools/chrome-user-experience-report/bigquery/getting-started) includes fine-grained performance data for all Core Web Vitals and is available in monthly snapshots at the origin-level.

The only way to truly know how your site performs for your users is to actually measure its performance in the field as those users are loading and interacting with it. This type of measurement is commonly referred to as Real User Monitoring—or RUM for short. Even if you don't have RUM on your site, CrUX can provide a quick and easy way to assess your Core Web Vitals.

**Introducing the CrUX API**

Today we're happy to announce the [CrUX API](http://developers.google.com/web/tools/chrome-user-experience-report/api/reference/), a fast and free way to easily integrate your development workflows with origin and URL-level quality measurement for the following field metrics:

* Largest Contentful Paint
* Cumulative Layout Shift
* First Input Delay
* First Contentful Paint

Developers can query for an origin or URL and segment results by different form factors. The API updates daily and summarizes the previous 28 days worth of data (unlike the BigQuery dataset, which is aggregated monthly). The API also has the same relaxed public API quotas we place on our other API, the PageSpeed Insights API (25,000 requests per day).

Below is a [demo](https://developers.google.com/web/tools/chrome-user-experience-report/api/guides/getting-started) using the CrUX API to visualize the Core Web Vitals metrics with distributions for **good**, **needs improvement**, and **poor**:

<figure class="w-figure">
  {% Img src="image/admin/ye3CMKfacSItYA2lqItP.png", alt="Chrome User Experience Report API demo showing Core Web Vitals metrics", width="800", height="523", class="w-screenshot w-screenshot--filled" %}
</figure>

In future releases, we plan to expand the API to enable access to additional CrUX dataset dimensions and metrics.

**Revamped CrUX Dashboard**

The newly redesigned [CrUX Dashboard](http://g.co/chromeuxdash) allows you to easily track an origin's performance over time, and now you can use it to monitor the distributions of all of the Core Web Vitals metrics. To get started with the dashboard, check out our [tutorial](/chrome-ux-report-data-studio-dashboard/) on web.dev.

<figure class="w-figure">
  {% Img src="image/admin/OjbICyhI21RNfGXrFP1x.png", alt="Chrome UX Report dashboard displaying the Core Web Vitals metrics in a new landing page", width="800", height="497", class="w-screenshot w-screenshot--filled" %}
</figure>

We've introduced a new Core Web Vitals landing page to make it even easier to see how your site is performing at a glance. We welcome your feedback on all CrUX tooling; to share your thoughts and questions reach us at the [@ChromeUXReport](https://twitter.com/chromeuxreport) Twitter account or [Google Group](https://groups.google.com/a/chromium.org/g/chrome-ux-report).


### Chrome DevTools Performance panel

**Debug Layout Shift events in the Experience section**

The Chrome DevTools **Performance** panel has a new **[Experience section](https://developers.google.com/web/updates/2020/05/devtools#cls)** that can help you detect unexpected layout shifts. This is helpful for finding and fixing visual instability issues on your page that contribute to Cumulative Layout Shift.

<figure class="w-figure">
  {% Img src="image/admin/VMbZAgKCi5V6FiQyu631.png", alt="Cumulative Layout Shift displayed with red records in the Performance panel", width="800", height="517", class="w-screenshot w-screenshot--filled" %}
</figure>

Select a Layout Shift to view its details in the **Summary** tab. To visualize where the shift itself occurred, hover over the **Moved from** and **Moved to** fields.

**Debug interaction readiness with Total Blocking Time in the footer**

The Total Blocking Time (TBT) metric can be measured in lab tools and is an excellent proxy for First Input Delay. TBT measures the total amount of time between [First Contentful Paint (FCP)](/fcp/) and [Time to Interactive (TTI)](/tti/) where the main thread was blocked for long enough to prevent input responsiveness. Performance optimizations that improve TBT in the lab should improve FID in the field.

<figure class="w-figure">
  {% Img src="image/admin/WufuLpvrZfgbRn70C74V.png", alt="Total Blocking Time displayed in the footer of the DevTools performance panel", width="800", height="517", class="w-screenshot" %}
</figure>

TBT is now shown in the footer of the Chrome DevTools **Performance** panel when you measure page performance:

{% Instruction 'devtools-performance', 'ol' %}
1.  Click **Record**.
1.  Manually reload the page.
1.  Wait for the page to load and then stop recording.

For more information, see [What's New In DevTools (Chrome 84)](https://developers.google.com/web/updates/2020/05/devtools#cls).


### Search Console

The new [Core Web Vitals report](https://support.google.com/webmasters/answer/9205520) in Search Console helps you identify groups of pages across your site that require attention, based on real-world (field) data from CrUX. URL performance is grouped by status, metric type and URL group (groups of similar web pages).

<figure class="w-figure">
  {% Img src="image/admin/BjTUt0xdWXD9hrLsbhLK.png", alt="Search Console's new Core Web Vitals Report", width="800", height="1000", class="w-screenshot" %}
</figure>

The report is based on the three Core Web Vitals metrics: LCP, FID, and CLS.  If a URL does not have a minimum amount of reporting data for these metrics, it's omitted from the report. Try the new report to get a holistic view of performance for your origin.

Once you identify a type of page that has Core Web Vitals related issues, you can use PageSpeed Insights to learn about specific optimization suggestions for representative pages.

#### web.dev

[web.dev/measure](/measure/) allows you to measure the performance of your page over time, providing a prioritized list of guides and codelabs on how to improve. It's measurement is powered by PageSpeed Insights. The measure tool now also supports the Core Web Vitals metrics, as shown below:

<figure class="w-figure">
  {% Img src="image/admin/ryoV1T1PhxUmo9zdCsDe.png", alt="Measure Core Web Vitals metrics over time and get prioritized guidance with the web.dev measure tool", width="800", height="459", class="w-screenshot" %}
</figure>

### Web Vitals extension

The Web Vitals extension measures the three Core Web Vitals metrics in real-time for (desktop) Google Chrome. This is helpful for catching issues early on during your development workflow and as a diagnostic tool to assess performance of Core Web Vitals as you browse the web.

The extension is now available to install from the [Chrome Web Store](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en)! We hope you find it useful. We welcome any contributions to improve it as well as feedback on the project's [GitHub](https://github.com/GoogleChrome/web-vitals-extension/) repository.

<figure class="w-figure">
  {% Img src="image/admin/woROdEmNV4jlHDPryjBQ.png", alt="Core Web Vitals displayed in real-time with the Web Vitals Chrome Extension", width="800", height="459", class="w-screenshot" %}
</figure>

#### Quick highlights

That's a wrap! What can you do next:

* Use **Lighthouse** in DevTools to optimize your user experience and ensure you are setting yourself up for success with Core Web Vitals in the field.
* Use **PageSpeed Insights** to compare your lab and field Core Web Vitals performance.
* Try out the new **Chrome User Experience Report API** to easily access how well your origin and URL have performed against Core Web Vitals over the last 28 days.
* Use the **Experience** section and footer in DevTools **Performance** panel to dive deep and debug against specific Core Web Vitals.
* Use **Search Console's Core Web Vitals report** for a summary of how your origins are performing in the field.
* Use the **Web Vitals Extension** to track a page's performance against Core Web Vitals in real-time.

We will cover more about our Core Web Vitals tooling at [web.dev Live](/live/) in June. Sign up to get updates on the event!

~ by Elizabeth and Addy, WebPerf Janitors
