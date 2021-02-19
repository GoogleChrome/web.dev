---
title: How OpenSooq increased engagement by investing in the web
subhead: Learn how a small team achieved big wins by creating a compelling marketplace PWA.
authors:
  - hbatra
date: 2019-07-03
# Add an updated date to your post if you edit in the future.
# updated: 2019-06-27
hero: image/admin/AxbQe1JfE7WXPUzhFw9I.jpg
# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom
alt: The OpenSooq logo next to a smartphone displaying the OpenSooq website.
description: |
  Learn how the OpenSooq team used best practices to create a reliable,
  compelling marketplace progressive web app.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - e-commerce
  - reliable
  - case-study
  - performance
  - progressive-web-apps
---

Based in Amman, Jordan, [OpenSooq](http://jo.opensooq.com/en) is a mobile-first classifieds marketplace offering a wide range of products and services in 19 countries across the Middle East and North Africa.

## The challenge

Over 85% of OpenSooq's traffic comes from mobile devices, and that number continues to rise. Many people in the region rely on low-end devices with limited storage capacities, which creates a strong need for OpenSooq's mobile site to be as fast and light as possible. However, slow load times on OpenSooq's old mobile site were affecting customer satisfaction and led to [bounce rates](https://support.google.com/analytics/answer/1009409?hl=en--for) as high as 49% in markets like Kuwait.

To serve its customers with a consistently better experience across all platforms, the company realized it needed a faster, more responsive website. So, in June 2017, OpenSooq's engineering team launched a [Progressive Web App (PWA)](/discover-installable/).


## A focus on performance and reliability

OpenSooq's three in-house developers were able to build a full-featured PWA with [React](https://reactjs.org/) and [webpack](https://webpack.js.org/) in just two and a half months.

To ensure that the site would be fast and easily indexable by search engines, the team chose to implement server-side rendering. With almost 28% of their users accessing the PWA on patchy 2G or 3G networks, it was critical that users trust the experience to work, regardless of network constraints. So the team implemented an offline experience using [service workers](/service-workers-cache-storage) and a [cache-first-then-network strategy](https://developers.google.com/web/tools/workbox/modules/workbox-strategies#cache_first_cache_falling_back_to_network). They also used the [PRPL pattern](/apply-instant-loading-with-prpl/?hl=en) to give their users instant loading.

By adopting these best practices, the team was able to cut the average page load time ([Time to Interactive](/interactive)) from 4 seconds to less than 2 seconds. And they used [Lighthouse](https://developers.google.com/web/tools/lighthouse/) to make sure the site _stayed_ that fast. Those efforts helped OpenSooq hit over 1.8 billion pageviews a month.

<figure class="w-figure">
  {% Img src="image/admin/ItUJANptPfn2KooyDyq4.png", alt="A screenshot of the Lighthouse performance metrics for the OpenSooq PWA.", width="800", height="509", class="w-screenshot" %}
  <figcaption class="w-figcaption">OpenSooq's Lighthouse performance metrics.</figcaption>
</figure>

<blockquote>
  <p>
    Over a quarter of our users access the OpenSooq PWA from low-mid networks, so reliability was essential for keeping those users engaged. Service workers and caching strategies helped us build the reliable user experience we needed, seamlessly.
  </p>
  <cite>
    Amin Shoman, PWA Technical Manager, OpenSooq
  </cite>
</blockquote>

## Improving re-engagement

<figure class="w-figure w-figure--inline-right">
  {% Img src="image/admin/U97z7PSx8CgKACjMnLkO.png", alt="A smartphone displaying OpenSooq notifications.", width="284", height="549", class="w-screenshot" %}
  <figcaption class="w-figcaption">OpenSooq's meaningful user notifications.</figcaption>
</figure>

Having built a performant and reliable experience, the OpenSooq team wanted to make sure their users stayed engaged with the product. To do that, they enabled users to install the [PWA to their home screen](https://developers.google.com/web/fundamentals/app-install-banners/promoting-install-mobile) and added support for [meaningful notifications](https://developers.google.com/web/fundamentals/push-notifications/). This allowed the site to notify buyers about seller interaction on queries and sellers about ad activation and expiration.

These improvements increased the monthly active users of OpenSooq's web experience by 14%. For users who installed the PWA, there was a 48% increase in the number of page visits per session and a 28% jump in average session duration. OpenSooq also saw a 25% increase in users' average time on a page and a 29% drop in average bounce rates across all markets.

## Looking ahead

After just a few weeks of effort, OpenSooq created a 23 KB, full-featured PWA that delivers a consistent experience to users across all platforms and browsers. And because it's easy to update features on the web, the team has gone PWA-first by launching and testing new features and user flows on their PWA before rolling them out to other platforms.

OpenSooq is now working on adding a [platform-specific install prompt](https://developers.google.com/web/fundamentals/app-install-banners/native) and integrating the PWA with [accelerated mobile pages (AMP)](https://amp.dev/). These enhancements will further speed up page loads and make the transition to the platform-specific app as seamless as possible. By building on the foundation of their initial development effort, the OpenSooq team will continue giving their users the best possible experience.

<blockquote>
  <p>
    The importance of developing our PWA was clear to both the leadership and technical teams. After building a modern web app and making it performant, we're excited to see the business impact on our 2.5 month investment.
  </p>
  <cite>
    Ramzi Alqrainy, Chief Technology Officer, OpenSooq
  </cite>
</blockquote>
