---
title: "Agrofy: A 70% improvement in LCP correlated to a 76% reduction in load abandonment"
subhead: By using real user monitoring tools and focusing on improving Core Web Vitals in refactoring their app, they also improved CLS by 72%, as well as application responsiveness.
authors:
  - kaycebasques
date: 2021-03-01
hero: image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/lpdEvKkrGYQcqkyfkPWw.png
thumbnail: image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/SQ1GzmbmNQz0Sr9fdr3u.png
alt: A photo of a phone showing Agrofy Market app.
description: Read how Agrofy improved their load abandoment rate by focusing on Core Web Vitals.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - case-study
  - web-vitals
---


[Agrofy](https://www.agrofy.com.ar/) is an online marketplace for Latin
America's agribusiness market. They match up buyers and sellers of farm
machines, land, equipment, and financial services. In Q3 2020 a 4-person
development team at Agrofy spent a month optimizing their website because they
hypothesized that improved performance would lead to reduced bounce rates. They
specifically focused on improving [LCP](/lcp/), which is one of
the [Core Web Vitals](/vitals/#core-web-vitals). These
performance optimizations led to a 70% improvement in LCP, which correlated to a
76% reduction in load abandonment (from 3.8% to 0.9%).

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">70<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Lower LCP</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">76<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Lower load abandonment</p>
  </div>
</div>

## Problem

While studying their business metrics, a development team at Agrofy noticed
that their bounce rates seemed higher than industry benchmarks. Technical
debt was also increasing in the website codebase.

## Solution

The Agrofy team pitched their executives and got buy-in to:

+   Migrate from an older, deprecated framework to a newer, actively
    supported one.
+   Optimize the load performance of the new codebase.

The migration took 2 months. Aside from the 4-person development team mentioned
earlier, this migration also involved product and UX specialists and a software
architect.
The optimization project took the 4-person development team 1 month. They
focused on LCP, [CLS](/cls/) (another Core Web Vitals metric),
and [FCP](/fcp/). Specific optimizations included:

+   Lazy loading all non-visible elements with the
    [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
+   Delivering static resources faster with a [content delivery
    network](/content-delivery-networks/).
+   [Lazy loading images](/browser-level-image-lazy-loading/)
    with `loading="lazy"`.
+   [Server-side rendering](https://developers.google.com/web/updates/2019/02/rendering-on-the-web)
    of
    [critical rendering path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path)
    content.
+   [Preloading and preconnecting](/fast/#optimize-your-resource-delivery)
    critical resources to minimize handshake times.
+   Using real user monitoring (RUM) tools to identify which product detail
    pages were experiencing lots of layout shifts and then make adjustments to
    the codebase's architecture.

Check out the
[Agrofy engineering blog post](https://mollar-luciano.medium.com/how-agrofy-optimised-core-web-vitals-and-improved-business-metrics-2f73311bca)
for more technical details.

After enabling the new codebase on 20% of traffic, they launched the new site to
all visitors in early September 2020.

## Results

The development team's optimizations led to measurable improvements in many
different metrics:

+   LCP improved 70%.
+   CLS improved 72%.
+   Blocking JS requests reduced 100% and blocking CSS requests 80%.
+   [Long tasks](/long-tasks-devtools/) reduced 72%.
+   [First CPU Idle](/first-cpu-idle/) improved 25%.

Over the same time frame, real user monitoring data (also known as [field
data](/how-to-measure-speed/#lab-data-vs-field-data)) showed that
the load abandonment rate on product detail pages dropped 76%, from 3.8% to
0.9%:


<figure class="w-figure">
{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/2lMYiXdjh5aLr4UIMVJF.png", alt="A graph showing load abandonment rate decrease of 76% on the product details page after performance optimizations.", width="800", height="461" %}
  <figcaption class="w-figcaption">
    Load abandonment rate trend on product detail page.
  </figcaption>
</figure>


