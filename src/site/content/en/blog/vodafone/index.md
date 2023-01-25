---
title: "Vodafone: A 31% improvement in LCP increased sales by 8%"
subhead: >
  By running an A/B test specifically focused on optimizing Web Vitals,
  Vodafone found that a 31% improvement in LCP led to 8% more sales,
  a 15% improvement in their lead to visit rate, and a 11% improvement
  in their cart to visit rate.
description: >
  By running an A/B test specifically focused on optimizing Web Vitals,
  Vodafone found that a 31% improvement in LCP led to 8% more sales,
  a 15% improvement in their lead to visit rate, and a 11% improvement
  in their cart to visit rate.
date: 2021-03-17
hero: image/BrQidfK9jaQyIHwdw91aVpkPiib2/EEaOcO1E9B4ZI4hHgJAb.png
# thumbnail: image/admin/i2nyfqyVr4XWqilOxPrY.png
alt: An illustration of an A/B test.
tags:
  - blog
  - case-study
  - web-vitals
  - performance
  - scale-on-web
---

[Vodafone](https://www.vodafone.com/) is a leading telecommunications company in
Europe and Africa operating fixed and mobile networks in 21 countries and
partnering with mobile networks in 48 more. By running an A/B test on a landing
page (where version A was optimized for Web Vitals and had a 31% better LCP
score in the
[field](https://www.searchenginejournal.com/google-explains-why-field-data-is-more-reliable-than-lab-data/372404/)
than version B), Vodafone determined that optimizing for Web Vitals generated 8%
more sales.

<div class="w-stats">
 <div class="w-stat">
   <p class="w-stat__figure">31<sub class="w-stat__sub">%</sub></p>
   <p class="w-stat__desc">A 31% improvement in LCP led to…</p>
 </div>
 <div class="w-stat">
   <p class="w-stat__figure"><sub class="w-stat__sub">+</sub>8<sub class="w-stat__sub">%</sub></p>
   <p class="w-stat__desc">Increase in total sales</p>
 </div>
 <div class="w-stat">
   <p class="w-stat__figure"><sub class="w-stat__sub">+</sub>15<sub class="w-stat__sub">%</sub></p>
   <p class="w-stat__desc">Uplift in the lead to visit rate</p>
 </div>
 <div class="w-stat">
   <p class="w-stat__figure"><sub class="w-stat__sub">+</sub>11<sub class="w-stat__sub">%</sub></p>
   <p class="w-stat__desc">Uplift in the cart to visit rate</p>
 </div>
</div>

## Highlighting the opportunity {: #opportunity }

Vodafone knew that faster websites generally correlate to improved business metrics and were
interested in optimizing their Web Vitals scores as a potential strategy for increasing sales, but
they needed to determine exactly what kind of ROI they would get.

<figure class="w-figure">
  {% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/3OKAembHLoX5QAdP1vya.png", alt="Two screenshots of the Vodafone website.", width="800", height="751" %}
  <figcaption>
    Some example screenshots of Vodafone's website. Note that these are <b>not</b> version
    A and version B from the A/B test. Both versions were visually and functionally identical.
  </figcaption>
</figure>

## The approach they used {: #approach }

### A/B test

The traffic for the A/B test came from different paid media channels, including display,
iOS/Android, search, and social. 50% of the traffic was sent to the optimized landing page (version
A), and 50% was sent to the baseline page (version B). Version A and version B both got around 100K
clicks and 34K visits per day. As mentioned before, the only difference between version A and
version B was that version A was optimized for Web Vitals. There were no functional or visual
differences between the two versions other than that. Vodafone used the
[`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) API to
measure LCP on real user sessions and sent the
[field data](https://www.searchenginejournal.com/google-explains-why-field-data-is-more-reliable-than-lab-data/372404/)
to their analytics provider.

{% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/bDOhlrGwsiuknDTBjUJg.png", alt="A diagram of the A/B test setup.", width="800", height="398" %}

### Optimizations

Vodafone made the following changes on the optimized page (version A):

-  **Moved the rendering logic for a widget from client-side to server-side**, which resulted in
   less [render-blocking JavaScript](/render-blocking-resources/)
-  **Server-side rendered** critical HTML
-  **Optimized images**, including [resizing](/uses-responsive-images/) the hero
   image, [optimizing SVG images](https://jakearchibald.github.io/svgomg/), using media queries to
   [avoid loading images](/browser-level-image-lazy-loading/) that weren't yet
   visible in the viewport, and [optimizing PNG images](/squoosh-v2/)

## Overall business results {: #results }

<div class="w-columns">
  <div>
    <p>
      After optimizing version A for Web Vitals and comparing it to the
      unoptimized version B, Vodafone found that version A led to:
    </p>
    <ul>
      <li>An 8% increase in sales</li>
      <li>
        A 15% improvement in the lead to visit rate (the number of users who became
        a lead versus the total number of visitors)
      </li>
      <li>
        An 11% improvement in the cart to visit rate (the number of users
        who visited their cart versus the total number of visitors)
      </li>
    </ul>
  </div>
  <figure class="w-figure">
    {% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/ADfHPOlQ19oaiuRrzmWZ.png", alt="An illustration that reiterates the business results.", width="800", height="1175" %}
  </figure>
</div>

The following table shows the values for `DOMContentLoaded` ("DCL") and LCP that
Vodafone observed on version A ("Optimized Page") and version B ("Default
Page"). Note that DCL actually *increased* 15%. The absolute values related to
business metrics have been redacted.

{% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/cvDjZ2T3CfWzp8BlFw6Z.png", alt="Optimized Page had a DCL of 4.05s and a LCP of 5.7s. Default Page had a DCL of 3.52s and a LCP of 8.3s.", width="800", height="413" %}

<blockquote>
  <p style="font-style: italic; font-size: 1.5rem;">
    At Vodafone, we test new solutions, measure results, keep what worked and question what didn't,
    learning from mistakes. We call it "Experiment, Learn Fast". Thanks to the collaboration with Google
    and the introduction of LCP as the main KPI for page performance, it was possible to
    significantly improve the customer experience of our e-commerce.
  </p>
  <cite>Davide Grossi, Head of Digital Marketing, Business</cite>
</blockquote>

Check out the [Scale on web case studies](/tags/scale-on-web) page for more
success stories.
