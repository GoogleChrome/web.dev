---
layout: post
title: |
  GEDI reduced mobile bounce rate by 8% with Core Web Vitals
subhead: |
  By focusing development effort on performance improvement and applying the
  latest web technologies and techniques, GEDI has created sites among
  the fastest newspaper sites.
authors:
  - maurizioparadisi
date: 2021-12-10
hero: image/VbsHyyQopiec0718rMq2kTE1hke2/IY9FEuclK1ky89V6zwaP.jpg
alt: GEDI logo
description: |
  By focusing development effort on performance improvement and applying the
  latest web technologies and techniques, GEDI has created sites among
  the fastest newspaper sites.
tags:
  - blog
  - case-study
  - web-vitals
---

Based in Rome, Italy, and formed in 1976, [GEDI](http://www.gedispa.it/) is a
media company that publishes 12 newspapers, several magazines, radio stations,
and 15 news sites. Their stable of publications includes
[La Stampa](https://www.lastampa.it/) and
[La Repubblica](https://www.repubblica.it/).

While GEDI is present in traditional publishing and broadcasting, its content
is increasingly being consumed on the web, and web is now contributing
significantly to their advertising revenue. Therefore, user retention and user
experience on the web are vital to the company's overall prosperity.

## Challenge

According to Giuseppe Covato, Head of Innovation and New Technologies at GEDI
Digital, before 2017, they didn't have a strategic path for web performance.
Knowledge sharing between teams was minimal and inefficient. In particular, it
was hard to get marketing on board on technical topics such as Core Web Vitals.

## Optimizations

To address performance, the team first applied
[critical rendering path
optimization](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path),
making sure there was no CSS or JavaScript that could slow down the rendering
time of editorial content.  This included deferring third-party scripts and
non-critical CSS, inlining critical CSS, and avoiding JavaScript lazy loading
on the first in-viewport images.

<figure>
{% Img src="image/VbsHyyQopiec0718rMq2kTE1hke2/h2MYvRTJMxFS4VrFRYTA.png",
   alt="Google Data Studio shows a 26% improvement in time for Largest Contentful Paint from March 1 through July 5, 2021",
   width="800", height="390"
%}
  <figcaption>
    Largest Contentful Paint (LCP) improvement trend for La Repubblica
  </figcaption>
</figure>

The team then spent some time optimizing the site layout for stability. For
example, they reserved space for images based on their aspect ratio. They also
reserved space for the top ad in the viewport and later for the mid-page ads.
This ensured users can read an article without interruption from annoying
content jumps.

<figure>
{% 
   Img src="image/VbsHyyQopiec0718rMq2kTE1hke2/f5ZizQnDMyeFMDUJzmMj.png",
   alt="There was a 77% reduction in Cumulative Layout Shift as shown on Google Data Studio. A step decline occurs between October 20, 2020 to December 7, 2020, and it continues to decline slightly until November 8, 2021.",
   width="800", height="390"
%}
  <figcaption>
    Cumulative Layout Shift improvement trend. The first improvement came from reserving space for ads at the top of the page in November 2020, and the second improvement from reserving space for mid-page Ads in August 2021.
  </figcaption>
</figure>

## Results 

The new site became one of the fastest GEDI newspaper sites based on the key
metrics such as [Time to First Byte](/ttfb/) (TTFB) and [First Contentful Paint](/fcp/) (FCP). The team used
what they learned to scale this innovation to other high-traffic sites, such as
La Stampa and La Repubblica. 

<ul class="stats">
 <div class="stats__item">
   <p class="stats__figure">
     77
     <sub>%</sub>
   </p>
   <p>Reduction in CLS</p>
 </div>
 <div class="stats__item">
   <p class="stats__figure">
     26
     <sub>%</sub>
   </p>
   <p>Faster LCP</p>
 </div>
 <div class="stats__item">
   <p class="stats__figure">
     8
     <sub>%</sub>
   </p>
   <p>Improved mobile bounce rate</p>
 </div>
</ul>

And, the benefits were measurable: on the La Repubblica mobile site, for
example, they measured a 77% reduction in [Cumulative Layout Shift](/cls/)
(CLS) and a 26% improvement in time to [Largest Contentful Paint](/lcp/)
(LCP). Overall, the team found they reduced La Repubblica's mobile bounce
rate by 8%.

GEDI’s next steps will be to focus on minimizing Desktop CLS in the near
future while balancing Ad Monetization and Layout Stability objectives.
