---
layout: post
title: "The business impact of Core Web Vitals"
subhead: >
  This article will help you understand how Core Web Vitals correlate with
  key business metrics by exploring examples of companies which have already see
  positive impact for their users and business.
description: >
  This article will help you understand how Core Web Vitals correlate with
  key business metrics by exploring examples of companies which have already seen
  positive impact for their users and business.
authors:
  - saurabhrajpal
  - swethagopalakrishnan
date: 2021-05-18
updated: 2021-09-30
hero: image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/m80oUd2zASInyKJJ7QNc.png
# thumbnail: image/admin/i2nyfqyVr4XWqilOxPrY.png
alt: LCP, FID, CLS.
tags:
  - blog
  - web-vitals
  - performance
  - case-study
---

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/m80oUd2zASInyKJJ7QNc.png",
alt="LCP, FID, CLS",
width="800", height="232" %}

Are you struggling to convince your stakeholders to adopt
[Core Web Vitals](/learn-core-web-vitals/)?
Or are you wondering if it actually helps your business?
This article will help you understand how Core Web Vitals correlate with
key business metrics by exploring examples of companies which have already seen
positive impact for their users and business.

If you prefer video, check out this talk from Google I/O:

{% YouTube "nPmAE0YjGK0" %}

## Why Core Web Vitals matter to your users and business

Different stakeholders in an organization can have different priorities.
Core Web Vitals can bring them all on the same page by focusing on
optimizing user-centric metrics and the resulting business growth.

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/zqgaPavQTlKrJVTs9ttR.png",
alt="Thinking about CWV.", width="800", height="318" %}

The path to good Core Web Vitals can vary from site to site
depending on where they are in the performance journey and how complex the site design is.
It can range from grabbing the low-hanging fruit and getting meaningful results;
to implementing complex solutions that fix challenging issues.
Regardless of the amount of time spent,
decision makers should treat this as a long term investment into growth of their business.
Delivering a fast and seamless navigation experience delights users
and helps turn them into loyal and returning customers.
For product managers, performance should be an important criteria
that defines the quality and success of new product features.
And product excellence and working on interesting challenges improves developer satisfaction as well.

While [Core Web Vitals as a ranking signal](https://developers.google.com/search/blog/2021/04/more-details-page-experience)
gives additional motivation to invest time in performance,
adopting Core Web Vitals has many other short- and long-term benefits beyond ranking.
Let's explore several case studies of global and local brands who adopted Core Web Vitals
(before it had impact on ranking) because of its focus on user experience.

## Case studies

### Vodafone

[Vodafone (Italy) improved LCP](/vodafone) by **31%** to achieve **8% more sales**.

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/OThyIjGk0YMLgXbvMbFT.png",
alt="8% more sales",
width="800", height="368" %}

#### Techniques

- Server Side Render the critical HTML.
- Reduce render blocking Javascript.
- Image optimization techniques.
- Resize hero image; defer non critical resources.

#### Key learnings

- A/B testing is the best way to measure the meaningful impact.
- A/B should be a server side one.

### iCook

iCook improved CLS by 15% to achieve 10% more ad revenue.

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/VUyTBGhoj9Tr17yhAcD7.png",
alt="Chart showing ad revenue increasing.",
width="800", height="422" %}

#### Techniques

- Less variability in ad unit size and fixed size ad slots pre-allocated in UI.
- Optimized ad script loading logic to prioritize header bidding and defer non-critical JS.

#### Key learnings

Fill rate might get impacted but eventually revenue uplifts with ads viewability improvement.

### Tokopedia

Tokopedia improved LCP by 55% and saw 23% better average session duration.

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/HsbbXe0pp73pfZvAlwNl.png",
alt="Before 3.78s, after 1.72s.",
width="800", height="722" %}

#### Techniques

- Server-side render (SSR) LCP element.
- Preload LCP Element.
- Image optimization (compression, WebP, lazy load non-critical images).

#### Key learnings

- Built a performance monitoring dashboard
to monitor progress and impact across teams.
- Experimented with different rendering techniques
(for example, SSR LCP element vs SSR above the fold content vs Full client-side rendering).

### Redbus

CWV fixes contributed to 80-100% mobile conversion rates(mCVR) and significant domain ranking uplift across Redbus’s global market properties.

{% Img
src="image/akX10MMTHtVhXYWSgqNknjak5KQ2/1988aZMNJ7viKhj8U3aS.png",
alt="192% domain ranking uplift in Columbia",
width="800", height="360" %}

#### Techniques

- Fixing slots for page components and removing unoptimized tag insertion scripts [improved CLS](/optimize-cls).
- [Optimizing third-party scripts](/controlling-third-party-scripts) and building microservices with single responsibility principle significantly reduced TTI and TBT.

#### Key learnings

- Reducing CLS from 1.65 to 0 significantly uplifted their domain rankings globally.
- Reducing TTI from around 8&nbsp;s to  around 4&nbsp;s and TBT from around 1200&nbsp;ms to around 700&nbsp;ms contributed to an 80-100% increase in mCVR across global properties.
- [Using RUM tools](/vitals-measurement-getting-started) helped capture the real world performance metrics in lower tier markets.
- Adopting a [performance culture](/performance-budgets-101) is very important to avoid regression. This also improves team productivity thanks to optimized code, faster releases, and fewer production issues.

The case studies above show that you can achieve a lot
by adopting best practices and implementing quick wins.
Here are a few more real-world examples of this point.

{% Img
src="image/akX10MMTHtVhXYWSgqNknjak5KQ2/zqcmwjQjSsuTqswQOxqR.png",
alt="Netzwelt saw 18 percent increase ads revenue,
Lazada saw 3x LCP and 16.9 percent increase in conversion rate on mobile,
GYAO saw 3.1x LCP and 108 percent improvement in click-through rate",
width="800", height="437" %}

The above results were achieved by grabbing low hanging fruit such as:

<div>
  <table>
    <thead>
      <tr>
        <th><a href="/fast/#i18n.paths.fast.topics.optimize_your_images">
        Image optimization</a></th>
        <th><a href="/optimize-lcp/">JavaScript optimization</a></th>
        <th><a href="/optimize-cls/#ads-embeds-and-iframes-without-dimensions">
        Ads and dynamic content</a></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Using WebP image format</td>
        <td>Deferring third-party JS</td>
        <td>Reserving space for ads above-the-fold</td>
      </tr>
      <tr>
        <td>Using image CDNs</td>
        <td>Removing render-blocking and unused JS</td>
        <td>Setting height for dynamic content</td>
      </tr>
      <tr>
        <td>Compression</td>
        <td>Lazy loading non-critical JS</td>
        <td></td>
      </tr>
      <tr>
        <td>Deferring non-critical images</td>
        <td>Preloading critical JS</td>
        <td></td>
      </tr>
      <tr>
        <td>Preloading hero images</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td><a href="/image-aspect-ratio/">Specifying aspect ratio</a></td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

For more best practices, check out the
[Web Vitals guidance](/learn-core-web-vitals/).
Use
[PageSpeed Insights](https://pagespeed.web.dev/)
to audit your website and get actionable recommendations immediately.

There are several more global brands which have also benefited from investing in Core Web Vitals.

{% Img
src="image/akX10MMTHtVhXYWSgqNknjak5KQ2/uKMplYNMdeDswi14lWhM.png",
alt="",
width="800", height="400" %}

- Tencent Video saw **70% better CTR** for videos by passing Core Web Vitals.
- Cdiscount improved all 3 metrics which contributed to **6% revenue uplift** in their Black Friday sale.
- Wix increased mobile origins passing Core Web Vitals by **over 250% year-on-year**.
- Nykaa found that a 40% improvement in LCP led to **28% more organic traffic** from T2/T3 cities.
- NIKKEI STYLE's 18% LCP improvement resulted in **9% more pageviews per session**.
- <a href="/ndtv">NDTV gained a **50% better bounce rate** after halving LCP, along with other product changes.</a>.
- <a href="/agrofy/">Agrofy Market's 70% better LCP correlated to **76% reduction in load abandonment**.</a>.
- Flipkart achieved **2.6% reduction in bounce rate** by improving Core Web Vitals metrics.
- Ameba Manga improved the **number of comics read by 2-3 times** by improving the CLS score 10 times.
- <a href="/yahoo-japan-news/">Yahoo! Japan fixed CLS which led to a 98% reduction in poor pages and **15% uplift in page views per session**.</a>.
- AliExpress improved CLS by 10 times and LCP by double, which translated to **15% lesser bounce rates**.
- GEDI saw 77% reduction in CLS and an **8% reduction in bounce rate**.

## How can you get started now?

### Step 1: Start measuring

Start by measuring field data for your site using Real User Monitoring (RUM) tools. There are various Google and third-party (3P) RUM tools available already.

{% Img src="image/akX10MMTHtVhXYWSgqNknjak5KQ2/RR58abBFQBGphUgjvHaa.png", alt="RUM tools", width="800", height="397" %}

#### Google RUM tools

- Search Console
- PageSpeed Insights
- web-vitals JavaScript library
- Chrome User Experience Report (CrUX)

#### Third-party RUM tools

- Cloudflare
- New Relic
- Akamai
- Calibre
- Blue Triangle
- Sentry
- SpeedCurve
- Raygun

Pick the tool that works best for you.
You can go a step further and [integrate with
Google Analytics 4](/vitals-ga4)
to correlate Core Web Vitals with your business metrics.

### Step 2: Convince your stakeholders

- Educate your stakeholders about the importance of adopting Core Web Vitals
to improve user experience and its correlation with company's business metrics.
- Get a sponsor internally to start a small experiment.
- Create a shared goal among stakeholders to improve Core Web Vitals across teams.

### Step 3: Deliver successful implementation using these tips

- **Prioritize**: Pick a page with high traffic and/or conversion significance
to deliver meaningful results (for example, ads landing page, conversion page, or popular pages).
- **A/B Test**: Use server side testing to avoid any rendering cost.
Compare results between optimized and unoptimized versions.
- **Monitor**: Use continuous monitoring to prevent regressions.

Lastly, we believe that performance is a journey not a destination.
On that note, we plan to keep this article updated with the latest case study highlights.
If you also have a compelling business win and would like to be featured in this article,
[submit a content proposal](/handbook/quick-start/).
