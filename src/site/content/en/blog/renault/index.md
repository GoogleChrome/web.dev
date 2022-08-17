---
layout: post
title: How Renault improved its bounce and conversion rates by measuring and optimizing Largest Contentful Paint
subhead: The team analyzed data from 10 million visits on its landing pages and found a strong correlation between Largest Contentful Paint and conversion rate.
authors:
  - tcoustillac
  - antoinebisch
  - cédricbazureau
date: 2021-10-08
updated: 2022-07-18
hero: image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/PHqBoMdg3WgcQWWIIkWj.jpg
alt: Renault Group logo.
description: |
  This post explains how Renault and its global data partner fifty-five approached measuring and optimizing the Core Web Vitals. The team analyzed data from 10 million visits on its landing pages, found a strong correlation between Largest Contentful Paint and conversions, and doubled up on its optimization effort. We will look at these data points and understand how the teams have organized for optimizations.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - case-study
  - web-vitals
---

Groupe Renault is a French multinational automobile manufacturer with a presence in over 130 countries. For an automotive group such as Renault, performant brand sites driving more user engagement and conversions mean more business. All of its brand sites aim at providing the best user experience at scale while maintaining flexibility of content and features for localized sites. In this context, performance monitoring is a key stake for the customer experience team which is in charge of developing and maintaining the global platform.

## Measuring the business impact of Core Web Vitals

### Measurement in Google Analytics

Working with fifty-five, its global data partner, Renault set up the [web-vitals](https://github.com/GoogleChrome/web-vitals) library, which allows sending to Google Analytics all the Web Vitals metrics from real users in a way that accurately matches how they're measured by Chrome and reported to other Google tools.

The following analysis showcases a dataset captured using these tools over four months between December 2020 and March 2021.

### Optimized LCP strongly correlates with user engagement and business metrics

The teams have identified a particularly strong correlation between a low Largest Contentful Paint (LCP) and favorable bounce rates and conversion rates, shown in the visualization below.

{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/A3ghcv1u3qxQKjgnb5Ru.png", alt="A chart showing a negative correlation between LCP and bounce rate and conversion rate.", width="782", height="372" %}

The dataset captures over 10 million visits in 33 countries over four months and shows how lower LCP measures correlates with:

-  Lower bounce rates
-  More conversions (lead forms completed)

Interestingly, as the website runs as a Single Page Application (SPA), all these measures are captured on landing pages only. The data shows that it is worth optimizing the website until the LCP reaches below 1 second. The group's brand sites can never be too optimized!

{% Blockquote 'Eja Rakotoarimanana, Consultant, fifty-five' %}
This dataset not only shows the negative correlation between LCP and business metrics, but also highlights performance discrepancies among the best performing landing pages. In the context of this website, getting LCP under 1 second leads to large increases in conversions and reductions in bounce.
{% endBlockquote %}

1 second LCP improvement can lead to a 14 percentage points (ppt) decrease in bounce rate and 13% increase in conversions.

<div>
  <table>
    <thead>
      <tr>
        <th>1 second LCP improvement</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>LCP around 1&nbsp;s</td>
        <td>+13% CVR</td>
      </tr>
      <tr>
        <td>LCP under 1.6&nbsp;s</td>
        <td>-14 ppt bounce rate</td>
      </tr>
      <tr>
        <td>LCP above 1.6&nbsp;s</td>
        <td>-5 ppt bounce rate</a></td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}
The numbers above are derived from linear regressions computed over the dataset to understand the relationship between LCP and other technical and business metrics. The numbers linking LCP and bounce show that the marginal gain on bounce rates increases as LCP gets low (below 1.6 seconds).
{% endAside %}

## Renault's approach to optimizing Core Web Vitals at scale

Since early 2020, in the brand's top 5 European markets, the number of visitors experiencing a **fast LCP (under 2.5&nbsp;s) has improved by an average of 22 ppt for Renault domains** (from 51% to 73%).

{% Img src="image/vgdbNJBYHma2o62ZqYmcnkq3j0o1/itCYyzXJL57ZM1t31L4B.jpg", alt="A chart showing how Renault's LCP measured by RUM improved over time by 22 ppt.", width="800", height="365" %}

Here is how they've approached it.

### A central optimization of the SPA

From a platform standpoint, performance has been a priority for years and including Core Web Vitals (CWV) as key metrics was a smooth process. Central teams have set up a comprehensive monitoring solution (with [Google Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) and [Chrome UX Report API](https://developer.chrome.com/docs/crux/api/)) and established a performance culture across the organization. There were several strategies to optimize their Single Page Application, including:

+   [Server side rendering (SSR)](/rendering-on-the-web/) to ensure a fast First Contentful Paint (FCP).
+   [Code splitting](/codelab-code-splitting/) to deliver only the JS and CSS chunks needed for the landing page (for better LCP and FID).
+   [CDN](/content-delivery-networks/) with a high level of resource caching (including a [Lambda@Edge](https://aws.amazon.com/lambda/edge/) to sort and remove unnecessary query parameters). This helped avoid the drawbacks of SSR (slower TTFB due to server computation) and deliver content closer to the final user (for better TTFB and LCP).
+   [Optimizing compression with brotli](/codelab-text-compression-brotli/) to reduce the code size.
+   [HTTP2](/performance-http2/) to enable multiplexing of requests and responses.
+   Using responsive images with [WebP support](/serve-images-webp/) and [`srcset`](/use-srcset-to-automatically-choose-the-right-image/#help-the-browser-choose-the-right-image-size) and [`sizes`](/use-srcset-to-automatically-choose-the-right-image/#what-about-the-display-size-of-the-image) attribute to serve the most appropriate image size and format to users.
+   Lazy-loading images, videos, and iframes using [`IntersectionObserver`](/lazy-loading-images/#images-inline-intersection-observer) and FPOs (small 1&nbsp;KB thumbnails).
+   Removing blocking scripts and [adjusting transpilation to browser targets](/serve-modern-code-to-modern-browsers/#use-@babelpreset-env) to reduce JS file sizes (by avoiding unnecessary polyfills).
+   [Reducing the size of the Google Tag Manager container](https://support.google.com/tagmanager/answer/2772488?hl=en) to load third-party scripts only where and when needed.
+   [Reducing the number of custom fonts](/font-best-practices/#use-fewer-web-fonts), [using woff/woff2 formats with unicode-range](/font-best-practices/#best-practices-2), and  [`font-display:swap`](/font-display/#how-to-avoid-showing-invisible-text) to reduce font file sizes and show text as soon as possible even if custom fonts are not yet available.
+   [Preloading hero images](/preload-responsive-images/) which are often LCP elements.

The team is still working on future improvements such as:

+   [Server push](https://en.wikipedia.org/wiki/HTTP/2_Server_Push) to improve FCP by delivering CSS faster. (On standby due to lack of AWS support and [deprecation proposal](https://groups.google.com/a/chromium.org/g/blink-dev/c/K3rYLvmQUBY/m/vOWBKZGoAQAJ?pli=1).
+   [Progressive hydration](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#rehydration) to improve FID.
+   [ES6 Module support](/codelab-serve-modern-code/#use-lessscript-type%22module%22greater) to deliver a faster experience by using ES6 builds for modern browsers.

The SPA approach can be beneficial for performance as a full page reload is not necessary when users navigate across pages. That being said, current CWV measurement methodology on SPA can be perceived as a downside as route transitions are not being measured; hence comparatively faster page loads within a session, due to UI caching, are not taken into account. It also makes it difficult to compare CWV metrics against a Multi Page Application competitor website where a warm cache would bring the measures down on each page a user would browse during a session. Read the [Web Vitals SPA FAQ](/vitals-spa-faq/) for more details.

These are [known limitations](/vitals-spa-faq/) that are being investigated by the [Chrome product teams](https://github.com/GoogleChrome/web-vitals/issues/119#issuecomment-767298992). An [update to the CLS metric](/better-layout-shift-metric/) has already been shipped to improve measurement on SPAs.

{% Blockquote 'Cedric Bazureau, Tech Lead, Renault' %}
Performance requires constant monitoring as various technical teams can impact it. Despite limitations in how they are measured on SPAs, CWV metrics allow us to track the impact of the actions our teams take. Hopefully route transitions will be taken into account soon!
{% endBlockquote %}

## Local guidelines promoting performance optimization as a shared responsibility

Performance is communicated as both a global (central) and local responsibility. Teams have put together a series of best practices that local content owners are meant to follow. Here are a few examples from these guidelines:

-  Optimize local Google Tag Manager container to improve site performance. for example conditionally trigger certain tags.
-  Limit size of video content by compressing it using internal tools or hosting it on a external platform (such as YouTube).
-  Avoid uploading pictures via Google Tag Manager.

{% Blockquote 'Alexandre Perruche, Head of Performance, Renault' %}
A deep understanding of our digital performance is key to ensuring a continuous optimization of our brand sites. Our customer experience team's approach is to provide a global platform that positively impacts local teams' business outcomes while empowering these teams with guidelines and best practices to maintain this performance at a high level.
{% endBlockquote %}

To conclude, website performance has always been a priority at Renault, and its website platform is continuously optimized. Measuring Core Web Vitals alongside business metrics has allowed them to promote this topic as a globally shared responsibility, and local guidelines equip teams with the ability to participate in this beneficial effort.
