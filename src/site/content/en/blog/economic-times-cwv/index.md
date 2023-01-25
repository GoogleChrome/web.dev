---
layout: post
title: How The Economic Times passed Core Web Vitals thresholds and achieved an overall 43% better bounce rate
subhead: |
  Optimizing Core Web Vitals on The Economic Times website significantly improved the user experience and substantially reduced bounce rate across the entire website.
description: |
  Optimizing Core Web Vitals on The Economic Times website significantly improved the user experience and substantially reduced bounce rate across the entire website.
authors:
  - anshusharma
  - sumitgugnani
  - prashantmishra
date: 2021-12-21
alt: Google Core Web Vitals + Mail.ru Home Page.
tags:
  - blog
  - web-vitals
  - case-study
---

With internet speeds improving day-by-day, users expect websites to respond and behave faster than ever. [The Economic Times](https://m.economictimes.com/) handles over 45 million monthly active users. By optimizing for Core Web Vitals across the domain, on AMP and non-AMP pages, we managed to significantly reduce bounce rates and improve the reading experience.

## Measuring the Impact

We focused on [Largest Contentful Paint (LCP)](/lcp/) and [Cumulative Layout Shift (CLS)](/cls/), as they matter the most when it comes to providing a great reading experience to our users. After implementing various performance fixes as described below, The Economic Times managed to improve Chrome User Experiments (CrUX) report metrics significantly within a few months.

**Overall, CLS improved** by 250% from 0.25 to 0.09.
**Overall, LCP improved** by 80% from 4.5 seconds to 2.5 seconds.

Further, LCP values in the "Poor" range were reduced by 33% from October 2020 to July 2021:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/1mrpePbYaQeKbIDJKo8b.png", alt="LCP distributions grouped by month, starting from October 2020 and ending in July 2021. The amount of LCP values classified as 'Poor' was reduced from 15.03% to 10.08%.", width="800", height="477" %}
</figure>

Additionally, CLS values in the "Poor" range were reduced by 65%, and CLS values in the "Good" range increased by 20% in the same timeframe:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/NK3g38biuTH12zGzncHK.png", alt="CLS distributions grouped by month, starting from October 2020 and ending in July 2021. The amount of CLS values classified as 'Poor' was reduced from 25.92% to 9%, and the amount of CLS values classified as 'Good' increased from 62.62% to 76.5%.", width="800", height="463" %}
</figure>

The result was that The Economic Times&mdash;which was previously not meeting CWV thresholds&mdash;now passed CWV thresholds across its entire origin and **reduced bounce rates by 43% overall**.

<figure class="w-caption">
  {% Video src="video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/6C1gW9oQu7Njds1Gdpmv.mp4", autoplay=true, loop=true, muted=true, playsinline=true %}
  <figcaption>
    A before and after animation of The Economic Times's Article page.
  </figcaption>
</figure>

## What is LCP and how did we improve it?

The largest element is the most relevant one for improving user experience and recognizing load speed. Performance metrics like [First Contentful Paint (FCP)](/fcp/) only capture the very initial experience of page loading. On the other hand, LCP reports the render time of the largest image, text or video section visible to the user.

In addition to switching to a faster DNS provider and optimizing images, here are some of the techniques we applied we covered to improve LCP.

### Critical requests first

As all modern browsers limit the concurrent number of requests, developers need to prioritize loading the critical content first. To load a complex web page we need to download assets such as header elements, CSS, JavaScript resources, hero image, article body, comments, other related news, footer, and ads. We evaluated what elements were required for LCP, and provided the preference to load those items first to improve LCP. We also deferred the calls that were not part of the initial page rendering.

### Text appearance

We experimented with the [`font-display` property](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display) as this impacts both LCP and CLS. We tried `font-display: auto;` and then switched to `font-display: swap;`. This renders the text initially in the best matching and available font, then switches to the font when it has been downloaded. This resulted in our text rendering quickly, independent of network speed.

### Better Compression

[Brotli](http://github.com/google/brotli/) is an alternative compression algorithm to Gzip and Deflate developed by Google. We replaced our fonts and assets and changed server compression from Gzip to Brotli to achieve a smaller footprint:

- Javascript files are 15% smaller than with Gzip.
- HTML files are 18% smaller than with Gzip.
- CSS and font files are 17% smaller than with Gzip.

### Preconnect to third-party domains

[`preconnect`](/preconnect-and-dns-prefetch/#establish-early-connections-with-relpreconnect) should be used carefully as it can still take up valuable CPU time, and delay other important resources, especially on secure connections.

However, if it's known that a fetch for a resource on a third-party domain will occur, `preconnect` is good. If it only happens occasionally on a high traffic website, `preconnect` might trigger unnecessary TCP and TLS work. Thus [`dns-prefetch`](/preconnect-and-dns-prefetch/#resolve-domain-name-early-with-reldns-prefetch) was a better fit for third-party resources&mdash;for example, social media, analytics, etc.&mdash;to perform DNS lookups ahead of time.

### Break up code into chunks

In the site's head, we only loaded those resources which contain either an essential part of the business logic or were [critical](https://github.com/addyosmani/critical) for above the fold page rendering. Furthermore, we split our code into chunks with [code splitting](https://loadable-components.com/docs/code-splitting/). This helped us to further improve page LCP.

### Better caching

For all the front-end routes, we added a [Redis](https://en.wikipedia.org/wiki/Redis) layer which served templates from the cache. This reduces the computation time on the server and builds the whole UI in each request, thus decreasing LCP in subsequent requests.

### Summarizing LCP Goals and achievements

Before beginning the optimization project, the team benchmarked their LCP score at **4.5 seconds** (for the 75th percentile of their users, based on CrUX report field data). After the optimization project, it was reduced to **2.5 seconds**.

<figure class="w-caption">
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/DsNmTCU3JTpWAam7a3df.png", alt="LCP distributions from September 2020 to June 2021. Overall, the 75th percentile of LCP values observed in the Chrome User Experience report showed an 8.97% reduction in 'Poor' LCP values. The overall decrease in LCP time at the 75th percentile was 200 milliseconds, with 77.63% of LCP values falling in the 'Good' range.", width="800", height="596" %}
  <figcaption>
    Source: CrUX Report of The Economic Times overall LCP
  </figcaption>
</figure>

## What is CLS and how did we improve it?

Have you ever noticed any unexpected movement of page content while browsing a website? One cause of this is asynchronous loading of media (images, videos, ads, etc.) on the page with unknown dimensions. As soon as media resources load, they shift the layout of the page.

{% Aside %}
For more information on CLS, read the [CLS metric page](/cls/).
{% endAside %}

We're going to cover the measures we took to improve CLS on the The Economic Times website.

### Use placeholders

We used a styled placeholder for ad units and media elements of known dimensions to avoid layout shifts when the ad library loads and renders page ads. This ensures layout shifts are eliminated by reserving space for the ad.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ujvqcVK7usp89zn6njAN.jpg", alt="A side-by-side comparison of The Economic Times website as shown on a mobile phone. At left, a gray placeholder is reserved for the article hero image. At right, the placeholder is replaced with the loaded image.", width="800", height="647" %}
</figure>

### Defined container dimensions

We specified explicit dimensions for all images and containers so that the browser engine doesn't need to calculate the DOM elements' width and height once they are available. This avoided unnecessary layout shifts and extra painting work.

### Summarizing CLS goals and achievements

Before beginning the optimization project, the team benchmarked their CLS score at **0.25**. We were able to reduce it significantly by **90%** to **0.09**.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/PvfZtgjSaShtmRASx5Mw.png", alt="CLS distributions shown in the Chrome User Experience Report. 76% of CLS values are 'Good', 15% are 'Fair', and 9% are 'Poor'. The 75th percentile of user experiences on The Economic Times website overall experienced a CLS of 0.09.", width="694", height="160" %}
</figure>

## What is First Input Delay (FID) and how did we improve it?

[First Input Delay](/fid/) is the metric that tracks a website's responsiveness to user input. The primary cause of a poor FID score is heavy JavaScript work that keeps the browser's main thread busy, which can delay user interactions. We improved FID in several ways.

### Break up long JavaScript tasks

Long tasks are tasks that are 50 milliseconds or longer. Long tasks occupy the browser's main thread and prevent it from responding to user input. We broke up long running tasks into smaller tasks where possible on user request, which helped to reduce the Javascript bloat.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/rfFVGpifiTIaiMIFpTOv.png", alt="CPU time broken down by activity type in the performance panel of Chrome's DevTools. 143 milliseconds was spent scheduling the loading of resources. 4553 milliseconds was spent on JavaScript. 961 milliseconds was spent on rendering work. 191 milliseconds was spent on painting operations. 1488 milliseconds on system tasks, with 3877 milliseconds of idle time. The total timeframe was 11212 milliseconds.", width="800", height="501" %}
</figure>

### Defer unused JavaScript

We prioritized page content over third-party scripts such as analytics to keep the page more responsive. However, there are certain limitations on some libraries since they need to be loaded in the document `<head>` in order to accurately track the user journey.

### Reduce polyfills

We reduced our dependency on certain polyfills and libraries, since browsers provide support for modern APIs, and less users are using legacy browsers, such as Internet Explorer.

### Lazy load ads

Lazily loading below-the-fold ads helped cut down main thread blocking time and thereby improved FID.

### Summarizing FID goals and achievements

From routine experiments, we were able to reduce our FID from 200 ms to under 50 ms today.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/bqZP6cbsJhryp5E17dPV.png", alt="FID distributions shown in the Chrome User Experience Report. 86% of CLS values are 'Good', 10% are 'Fair', and 4% are 'Poor'. The 75th percentile of user experiences on The Economic Times website overall experienced a FID of 44 milliseconds.", width="720", height="190" %}
</figure>

## Preventing regressions

The Economics Times plans to introduce automated performance checks in production to avoid page performance regressions. They plan to evaluate Lighthouse-CI to automate lab tests, which can prevent regressions on their production branch.
