---
title: "The business impact of core web vitals"
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
date: 2021-05-17
hero: image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/m80oUd2zASInyKJJ7QNc.png
# thumbnail: image/admin/i2nyfqyVr4XWqilOxPrY.png
alt: LCP, FID, CLS.
tags:
  - blog
  - web-vitals
  - performance
---

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/m80oUd2zASInyKJJ7QNc.png",
alt="LCP, FID, CLS",
width="800", height="232" %}

Are you struggling to convince your stakeholders to adopt
[Core Web Vitals](https://web.dev/learn-web-vitals/)?
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

## Case Studies

### Vodafone

Vodafone (Italy) improved LCP by **31%** to achieve **8% more sales**.

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/OThyIjGk0YMLgXbvMbFT.png",
alt="8% more sales",
width="800", height="368" %}

#### Techniques

- Server Side Render the critical HTML.
- Reduce render blocking Javascript.
- Image optimization techniques.
- Resize hero image; defer non critical.

#### Key Learnings

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

#### Key Learnings

Fill rate might get impacted but eventually revenue uplifts with ads viewability improvement.

### Tokopedia

Tokopedia improved LCP by 55% and saw 23% better average session duration.

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/HsbbXe0pp73pfZvAlwNl.png",
alt="Before 3.78s, After 1.72s",
width="800", height="722" %}

#### Techniques

- Server-side render (SSR) LCP element.
- Preload LCP Element.
- Image optimization (compression, WebP, lazy load non-critical images).

#### Key Learnings

- Built a performance monitoring dashboard
to monitor progress and impact across teams.
- Experimented with different rendering techniques
(for example, SSR LCP element vs SSR above the fold content vs Full client-side rendering).

The case studies above show that you can achieve a lot
by adopting best practices and implementing quick wins.
Here are a few more real-world examples of this point.

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/hIDblcgodY2P2ltWd9nt.png",
alt="GEDI saw 77% reduction in CLS and 8% reduction in bounce rate,
Lazada saw 3xLCP and 16.9 increase in conversion rate on mobile,
GYAO saw 3.1x LCP and 108% improvement in click-thorugh rate",
width="800", height="447" %}

The above results were achieved by grabbing low hanging fruit such as:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th><a href="https://web.dev/fast/#i18n.paths.fast.topics.optimize_your_images">
        Image Optimization</a></th>
        <th><a href="/optimize-lcp/">JavaScript Optimization</a></th>
        <th><a href="/optimize-cls/#ads-embeds-and-iframes-without-dimensions">
        Ads and Dynamic Content</a></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>WebP image format</td>
        <td>Defer third-party JS</td>
        <td>Reserve space for ads above-the-fold</td>
      </tr>
      <tr>
        <td>Image CDN</td>
        <td>Remove render-blocking and unused JS</td>
        <td>Set height for dynamic content</td>
      </tr>
      <tr>
        <td>Compression</td>
        <td>Lazy-load non-critical JS</td>
        <td></td>
      </tr>
      <tr>
        <td>Defer non-critical images</td>
        <td>Preload critical JS</td>
        <td></td>
      </tr>
      <tr>
        <td>Preloading the hero images</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td><a href="/image-aspect-ratio/">Specify aspect ratio</a></td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

For more best practices, check out the
[Web Vitals guidance](/learn-web-vitals).
Use
[PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
to audit your website and get actionable recommendations immediately.

There are several more global brands which have also benefited from investing in Core Web Vitals.

<div class="w-columns">
  <figure class="w-figure">
    {% Img
    src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/xUxJrOzRfTYKn9ajq6N7.png",
    alt="Tencent Video",
    width="800", height="220" %}
    <figcaption class="w-figcaption">
      Tencent Video saw 70% better CTR for videos by passing Core Web Vitals.
    </figcaption>
  </figure>
  <figure class="w-figure">
    {% Img
    src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/xnFd4iZ5k4ELdmdzIzu1.png",
    alt="CDiscount",
    width="566", height="89" %}
    <figcaption class="w-figcaption">
      Improving all 3 metrics contributed to 6% revenue uplift in their Black Friday sale.
    </figcaption>
  </figure>
  <figure class="w-figure">
    {% Img
    src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/s4ujWz7virwA2sXNw9iD.png",
    alt="Wix", width="128", height="128" %}
    <figcaption class="w-figcaption">
      Wix increased mobile origins passing Core Web Vitals by &gt;250% YoY.
    </figcaption>
  </figure>
  <figure class="w-figure">
    {% Img
    src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/LnCIQw56eVtZM0e9bTH7.png",
    alt="Nykaa",
    width="800", height="269" %}
    <figcaption class="w-figcaption">
      40% improvement in LCP led to 28% more organic traffic from T2/T3 cities.
    </figcaption>
  </figure>
  <figure class="w-figure">
    {% Img
    src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/UdX8P8rpskeDdZNyVAzT.png",
    alt="NIKKEI", width="800", height="420" %}
    <figcaption class="w-figcaption">
      NIKKEI STYLE's 18% LCP improvement resulted in 9% more pageviews per session.
    </figcaption>
  </figure>
  <figure class="w-figure">
    {% Img
    src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/mhbUA0b7UfDwlYmtvo8p.png",
    alt="NDTV", width="800", height="166" %}
    <figcaption class="w-figcaption">
      50% better bounce rate after halving LCP (along with other product changes).
      <a href="/ndtv">Full case study</a>.
    </figcaption>
  </figure>
  <figure class="w-figure">
    {% Img
    src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/PvgwbCL9AL73DFQMxGk9.png",
    alt="Agrofy", width="800", height="208" %}
    <figcaption class="w-figcaption">
      Agrofy Market's 70% better LCP correlated to 76% reduction in load abandonment.
      <a href="/agrofy/">Full case study</a>.
    </figcaption>
  </figure>
  <figure class="w-figure">
    {% Img
    src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/RiMnjY8SXzkaWAnIjy89.png",
    alt="Flipkart",
    width="300", height="168" %}
    <figcaption class="w-figcaption">
      Flipkart achieved 2.6% reduction in bounce rate by improving Core Web Vitals metrics.
    </figcaption>
  </figure>
  <figure class="w-figure">
    {% Img
    src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/yalKca4outCrHHp63fHn.png",
    alt="CyberAgent", width="800", height="178" %}
    <figcaption class="w-figcaption">
      Ameba Manga improved 2-3x #Comics read by improving 10x CLS score.
    </figcaption>
  </figure>
  <figure class="w-figure">
    {% Img
    src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/c6mCCaG5W8eOwxXasfQl.png",
    alt="Yahoo! Japan", width="412", height="68" %}
    <figcaption class="w-figcaption">
      Fixing CLS led to 98% reduction in poor pages and 15% uplift in PV / session.
      <a href="/yahoo-japan-news/">Full case study</a>.
    </figcaption>
  </figure>
  <figure class="w-figure">
    {% Img
    src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/ySdaV4MbJ2LyikTwgD4A.png",
    alt="AliExpress", width="398", height="92" %}
    <figcaption class="w-figcaption">
      10X CLS & 2X LCP improvements translated to 15% lesser bounce rates.
    </figcaption>
  </figure>
</div>

## How can you get started now?

### Step 1: Start Measuring

Start by measuring your site using field tools! There are various tools available:

{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/BZbi6hd4OUfKmwyDgQeR.png",
alt="Chart showing Google and third party tools for measuring.",
width="800", height="459" %}

Pick the tool that works best for you.
You can go a step further and integrate with
[Google Analytics 4](https://web.dev/vitals-ga4)
to correlate Core Web Vitals with your business metrics.

### Step 2: Convince your stakeholders

- Educate your stakeholders about the importance of adopting Core Web Vitals
to improve user experience and its correlation with your company's business metrics.
- Get a sponsor internally to start a small experiment.
- Create a shared goal among stakeholders to improve Core Web Vitals across teams.

### Step 3: Deliver successful implementation using these tips

- **Prioritize**: Pick a page with high traffic and/or conversion significance
to deliver meaningful results (eg. ads landing page or conversion page, popular pages).
- **A/B Test**: Use server side testing to avoid any rendering cost.
Compare results between optimized and unoptimized versions.
- **Monitor**: Use continuous monitoring to prevent regressions.

Lastly, we believe that performance is a journey not a destination.
On that note, we plan to keep this article updated with the latest case study highlights.
If you also have a compelling business win and would like to be featured in this article,
[submit a content proposal](https://web.dev/handbook/quick-start/).
