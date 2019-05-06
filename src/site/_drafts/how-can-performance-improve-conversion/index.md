---
title: How can performance improve conversion?
subhead: Optimize your site's performance and improve conversions.
authors: 
  - martinschierle
date: 2019-05-05
hero: funnel1.png
alt: Image of the different steps of a conversion funnel
description: |
  Learn what impact website performance has on different parts of the e-commerce funnel
wf_blink_components: Blink>Performance
tags:
  - performance
  - ecommerce
---

In our other e-commerce guides you have learned about building a successful e-commerce website, which can easily be discovered, is good at engaging users, converts well and re-engages users. It shouldn't be surprising that each of these steps can also be impacted by the website's performance, and low performance will lead to additional dropoffs in the funnel.

<figure class="w-figure  w-figure--center">
  <img src="./funnel1.png" alt="" style="max-width: 400px;">
  <figcaption class="w-figcaption">
    Fig. 1 - Conversion funnel
  </figcaption>
</figure>

In this guide we'll address the different ways in which a website should be optimized for speed to yield maximum conversions at the end of the funnel.

## Discovery

New users discover a website in most cases through organic search, social sharing, website links or paid campaigns. Some important discovery mechanisms are directly affected by website performance. Website crawlers may have difficulty indexing sites that are slow to load or have extensive [client side rendering and Javascript](https://developers.google.com/search/docs/guides/dynamic-rendering).

Speed can also be a direct ranking factor, for example on [web search](https://webmasters.googleblog.com/2018/01/using-page-speed-in-mobile-search.html), [ad campaigns](https://developers.google.com/web/updates/2018/07/search-ads-speed#the_mobile_speed_score_for_ads_landing_pages) or [social networks](https://newsroom.fb.com/news/2017/08/news-feed-fyi-showing-you-stories-that-link-to-faster-loading-webpages/).  
Keep in mind that new users who discover your website will get an uncached first load, so basically the worst possible experience. This can be especially frustrating if good money was spent to get the user to the website, just to see her dropping off due to a long first load. 

Make sure to use appropriate tools as described in [Fast Load Times](https://web.dev/fast) to optimize towards a first load, because first impressions matter—if the first load is too slow, the user may never see the optimized second load or stay around to look at your products. In general loading times of a website map [very well](https://developer.akamai.com/blog/2015/09/01/mobile-web-performance-monitoring-conversion-rate) to bounce rates, which in turn often correlate well with conversions.

## Engagement

After getting users to your site, you need to keep them engaged with your content, which you can verify in your analytics of choice by looking at session length, time-on-page, pages-per-session and general [user flows](https://support.google.com/analytics/answer/1709395?hl=en).

<figure class="w-figure  w-figure--center">
  <img src="./ga_flow.png" alt="" style="max-width: 400px;">
  <figcaption class="w-figcaption">
    Fig. 2 - A user flow through the funnel as seen by Google Analytics
  </figcaption>
</figure>

Besides various UX best practices, a smooth, fast and responsive experience is key here. While optimizing a website for discovery means optimizing for first load, optimizing for engagement means fast navigations and fast repeat loads. Analyze at which steps of the flow users drop out, and then relate back to speed metrics for these navigations. This can be analyzed for example via [WebPageTest](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/scripting#TOC-Sample-scripts), [Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md) or via the Chrome DevTools [Record](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/#record) feature. We will show you more examples of those in the following guides.

## Conversion

While website conversions are often bound to good discovery paired with great engagement, there are a couple of additional points to remember. Users expect hero images to [load fast](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_fmp_using_hero_elements), call-to-action buttons should be rendered and [labeled](https://developers.google.com/web/updates/2018/05/lighthouse#all_text_remains_visible_during_web_font_loads) quickly, page should be [responsive](https://developers.google.com/web/updates/2018/05/first-input-delay) and [layout jumps](https://css-tricks.com/content-jumping-avoid/) should be avoided. A user won't buy anything if she can't click the _Buy Now_ button due to busy CPU or a jumping or unlabeled button.  
In general it's best to measure and track the time-to-action towards a conversion or a subgoal for it, for example the median time it takes shoppers to get from landing on your site, to viewing a product, to completing payment .

## Re-Engagement

It turns out that only 2% of users [convert on first visit](https://retargeter.com/what-is-retargeting-and-how-does-it-work/), so it is important to get the other 98% to come back, and re-engage them with your content. Modern websites have different ways to do this, for example via mail, tailored display ads in [remarketing](https://support.google.com/google-ads/answer/2453998?hl=en) or notifications. This works best if the flow from reengagement to website is as smooth as possible. Unfortunately this is not always the case, as for example mail apps often open links in their in-app webview, slowing down page load and complicating logins through different cache and cookie storage.  
Make sure to optimize for fast repeat loads and smooth UX flows to increase chances of reengagement.

## Recap

E-commerce sites always strive for conversions, which are at the end of a purchase funnel. Every step along the funnel needs to be optimized for website speed to minimize bounce rates and drop-offs, and for each step there are different things to optimize, different pitfalls and culprits:

<figure class="w-figure  w-figure--center">
  <img src="./funnel2.png" alt="An e-commerce funnel showing which metric to optimize in which step." style="max-width: 400px;">
  <figcaption class="w-figcaption">
    Fig. 3 - An e-commerce funnel showing which metric to optimize in which step.
  </figcaption>
</figure>

In the following guide and codelab we will show you what and how to measure these steps.
