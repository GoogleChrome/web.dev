---
layout: post
title: How Rakuten 24's investment in Core Web Vitals increased revenue per visitor by 53.37% and conversion rate by 33.13%
subhead: >
  By measuring real users' Web Vitals, Rakuten 24 also found that a good Largest Contentful Paint (LCP) can lead to a conversion rate increase of 61.13%.
description: >
  By measuring real users' Web Vitals, Rakuten 24 also found that a good Largest Contentful Paint (LCP) can lead to a conversion rate increase of 61.13%.
date: 2022-08-19
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/uB1PUfGOXOhrqUBW3tfO.jpg
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/OLBDJ1YEaVWGkR5lqNyR.jpg
alt: A banner image with the Rakuten 24 logo and branded artwork.
authors:
  - linhduong
  - shogokashiwase
  - hayounglee
  - ryunosukeakiba
tags:
  - blog
  - case-study
  - web-vitals
---

[Rakuten 24](https://24.rakuten.co.jp/) is an online store that collaborates with both major multinational and domestic consumer goods manufacturers to offer a great variety of daily necessities including healthcare, beverage, pet supplies, baby products, and more. This store is provided by Rakuten Group, Inc.—a global leader in internet services, and is among the top performers on their digital marketplace platform in Japan.

Understanding the impact of web performance on user experience, the Rakuten 24 team has been continuously measuring, optimizing and monitoring Core Web Vitals and other metrics.

As a result, over 75% of their users are experiencing good Largest Contentful Paint (LCP), First Input Delay (FID) and First Contentful Paint (FCP). However, they are still working on Cumulative Layout Shift (CLS) improvements.

After analyzing homepage data, Rakuten 24 found that a good LCP score can lead to:

- An increase of up to 61.13% in conversion rate.
- 26.09% in revenue per visitor.
- 11.26% in average order value.
- A good FID score can lead to an increase of up to 55.88% in conversion rate.

To further correlate Core Web Vitals and business metrics, Rakuten 24 also ran an A/B test focused on optimizing Core Web Vitals and related metrics, and saw an improvement of: 

- 53.37% in revenue per visitor.
- 33.13% in conversion rate.
- 15.20% in average order value.
- 9.99% in average time spent.
- A 35.12% reduction in exit rate.

## Highlight the opportunity

Though optimizing web performance is a smart investment to improve user experience and business growth, Rakuten 24 team understands how difficult it can be to convince stakeholders to adopt Core Web Vitals and focus on web performance. They believe that showing stakeholders exactly what kind of Return on Investment (ROI) performance optimization can bring is the best way to get them on board.

Being a relatively new and independent service, Rakuten 24 used their advantage of flexibility to take up the challenge. They believe that the result of their case study would help them make more data-oriented decisions in the future, as well as help other developers measure the impact of their work and convince their stakeholders that improving performance is worth the investment.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ij6fET9W23vj1IOb3e6O.jpg", alt="Example screenshots of Rakuten 24's homepage, with mobile device frames around each screenshot.", width="800", height="537" %}
  <figcaption>
    Some example screenshots of Rakuten 24's homepage.
  </figcaption>
</figure>

## Optimize JavaScript and resources

- Eliminate render-blocking resources.
- Split code and use [dynamic `import()`](https://v8.dev/features/dynamic-import).
- Split all content into separate parts and lazy load below-the-fold HTML files.
- Execute and load JavaScript on demand.
- Identify slow JavaScript resources and optimize the loading process by using the async attribute on `<script>` tags and establishing early connections to important origins (Resource hints such as `dns-prefetch`, `preconnect`, and `preload`).
- [Remove unused code](/remove-unused-code/), and [minify and compress code](/reduce-network-payloads-using-text-compression/).
- [Use a CDN](/content-delivery-networks/).
- [Control caching using Service Worker](/learn/pwa/caching/) with [Workbox](https://developer.chrome.com/docs/workbox/).

## Optimize images

- [Lazy load below-the-fold images](/lazy-loading-images/).
- [Optimize images with a CDN](/image-cdns/), deliver properly sized images, compress images, and adopt the right image formats for the job (WebP, SVG, Web Fonts).

## Optimize CLS

- Use CSS [`aspect-ratio`](https://developer.mozilla.org/docs/Web/CSS/aspect-ratio) to reserve the required space for images while the images are loading.
- Use CSS [`min-height`](https://developer.mozilla.org/docs/Web/CSS/min-height) to minimize layout shifts while elements are lazy loaded.

## Performance measuring, analyzing, and monitoring

Besides using [PageSpeed Insights](https://pagespeed.web.dev/) to audit their website, the team wanted to find a better way to know what the users are actually experiencing in the field. Therefore, Rakuten 24 decided to use the [web-vitals JavaScript library](https://github.com/GoogleChrome/web-vitals) to measure Core Web Vitals and other metrics in the field and send the data to inhouse analytics tool.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/o5Nd3IV6Yof3mfr3tVH3.jpg", alt="Rakuten 24's web vitals tracking integration flow. The first step is to integrate the web-vitals library by adding the script to the Rakuten 24 website. After that, web vitals can be measured from real user metrics, and the data is sent to Rakuten 24's in-house data collection tool.", width="800", height="495" %}
</figure>

## Analyzing

The team analyzed the collected field data to determine if there is any correlation between the Core Web Vitals and the key business metrics. They found out that the converted users tend to experience a better LCP than the users who didn’t convert.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/xWYjqq9sEJ2yQlDxl6fY.jpg", alt="A comparison of users who converted versus those who didn't by LCP. The user group who converted more frequently experienced a lower LCP.", width="800", height="391" %}
</figure>

The collected data also revealed that:

- A good LCP can lead to an increase of up to 61.13% in conversion rate, 26.09% in revenue per visitor, and 11.26% in average order value.
- A good FID can lead to an increase of up to 55.88% in conversion rate compared to the overall average data.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/kW535AoWqoPqmUWARPZt.jpg", alt="LCP bucketed by conversion rate and LCP time. Users who converted more frequently converted when LCP was lower, with 61.13% of users converting with an LCP of one second or lower.", width="800", height="376" %}
  <figcaption>
    The impact of LCP on conversion rate.
  </figcaption>
</figure>

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/MBCTKocekiENQSQBS6wO.jpg", alt="LCP bucketed by revenue per visitor and LCP time. Users with lower LCP provided more revenue, with 26.09% more revenue provided per user when LCP was one second or lower.", width="800", height="376" %}
  <figcaption>
    The impact of LCP on revenue per visitor.
  </figcaption>
</figure>

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/mFfKxOV5snRw2e6lEqC5.jpg", alt="LCP bucketed by average order value and LCP time. Users with lower LCP had a 11.26% higher average order value when LCP was one second or lower.", width="800", height="376" %}
  <figcaption>
    The impact of LCP on average order value.
  </figcaption>
</figure>

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/hzfFyMF9UM0PD0y1dq9V.jpg", alt="FID bucketed by conversion rate and FID time. Users who converted more frequently converted when FID was lower, with 55.88% of users converting with an FID of 50 milliseconds or lower.", width="800", height="362" %}
  <figcaption>
    The impact of FID on conversion rate.
  </figcaption>
</figure>

## Monitoring

The team built a performance monitoring dashboard using the data collected in the field and business intelligence tool. This is important for monitoring progress and preventing regressions.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/nd87NaZ2i9cG905ChUdU.jpg", alt="A screenshot of Rakuten 24's internal performance monitoring dashboard for each of the Core Web Vitals (LCP, CLS, and FID).", width="800", height="354" %}
  <figcaption>
    Performance monitoring dashboard.
  </figcaption>
</figure>

## A/B test

Believing that A/B tests are a good way to measure the business impact of performance optimizations, the team optimized one of their landing pages for Core Web Vitals then compared the optimized version with the original page via A/B test for a month. They picked a landing page with significant traffic and conversion so that the test could achieve meaningful results. During the test duration, 50% of the traffic was sent to the optimized landing page (version A), and 50% was sent to the original page (version B). The only difference between version A and version B was that version A was optimized for Core Web Vitals and there were no other functional or visual differences.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/pN5i17Rh7VxrObYlgdiu.jpg", alt="A screenshot of a mobile A/B test for the Rakuten 24 website. Each version was visually and functionally the same, with version A optimized for better Core Web Vitals.", width="800", height="1129" %}
</figure>

The optimized version A finished loading 0.4 seconds earlier in the mobile load test and shows no significant layout shift. In fact, the CLS of version A improved by **92.72% compared to version B**. Other Web Vitals scores also improved: **FID improved by 7.95%**, **FCP improved by 8.45%**, and **TTFB improved by 18.03%**.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ngLxHt0V3Ubss5gkT05t.jpg", alt="A startup comparison of the Rakuten 24 homepage. Version A is optimized for better loading, loading within 1.6 seconds, compared to Version B, which loaded within 2 seconds.", width="800", height="488" %}
  <figcaption>
    Mobile load test result of version A and version B.
  </figcaption>
</figure>

Comparing the optimized version A to the unoptimized version B, Rakuten 24 found that version A brings about:

- 53.37% increase in revenue per visitor.
- 33.13% increase in conversion rate.
- 15.20% increase in average order value.
- 9.99% increase in average time spent.
- 35.12% reduction in exit rate.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/m9YXxAbL0Cc3qqblK4Wu.jpg", alt="A screenshot of Core Web Vitals improvements for the Rakuten 24 homepage. The stats are a 53.37% increase in revenue per visitor, 33.13% increase in conversion rate, 15.2% increase in average order value, 9.99% increase in average time spent on pages, and 35.12% reduction in exit rate.", width="800", height="285" %}
</figure>

## Conclusion

Web performance optimization is challenging but rewarding. By taking a data-driven approach, Rakuten 24 has successfully delivered better user experience as well as measured positive impact on their business. Understanding that this is just a part of the journey not the destination, they will continue improving their website to provide online shoppers with more delightful experiences.

Optimization requires a joint effort and developers do not have to be alone on this journey. By sharing their struggles and achievements, Rakuten 24 hopes that more developers can use Core Web Vitals data to develop a mutual understanding with stakeholders then work together towards high-quality user experience and business growth.
