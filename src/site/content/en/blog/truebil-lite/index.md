---
title: How Truebil made the web its channel of growth
subhead: A startup's story of building a best-in-class web experience.
authors:
  - hbatra
date: 2019-08-16
# Add an updated date to your post if you edit in the future.
# updated: 2019-06-27
hero: image/admin/fRR1RuZTZdMm95ibKQu4.png
# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom
thumbnail: image/admin/7aqJGgqNmVMxuRYk5DUt.png
alt: The Truebil logo and a screenshot of the Truebil Lite web app.
description: |
  This case study explains how the Truebil team increased conversions and
  engagement by optimizing their web app for speed and reliability.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - reliable
  - e-commerce
  - case-study
  - performance
  - progressive-web-apps
---

## About

Founded in 2015, Truebil is an Indian online marketplace that sells 100% certified used cars. With over 1.4 million monthly active users, it's a one-stop solution that includes title transfer, insurance, loans, and service warranties. Prospective customers can see individual product pages with images and detailed inspection reports and get vehicle evaluations with the site's "Compare" and "Truescore" features. Truebil differentiates its product with rich features, including personalized recommendations based on machine learning, an add-to-favorites feature, a share-a-car feature, and more.

## Challenge

Truebil is a lean startup with low-frequency, high-value transactions, so it was critical to choose the right platform to prioritize and invest in.

Truebil identified mobile as their target platform, and they chose the web for their first app, [Truebil Lite](https://m.truebil.com), because of the web's easy discovery and low friction. Web technology provides lower development costs, less data and memory usage, and significantly lower customer acquisition costs than building an Android/iOS app. And by building a progressive web app (PWA), Truebil could get all the perks of the web _and_ the benefits of iOS/Android.

## Solution

An in-house team took four months to develop Truebil Lite using React, Django, and Preact (for production migration). They set clear guiding principles for the web app based on user goals. The experience had to be:

*   **Fast** on first load and subsequent navigations,
*   **Reliable**, independent of the user's network or device constraints, and
*   **Engaging**, especially for small mobile screens, so users would want to return to it.


### Optimize for fast first load and navigations

Using [Lighthouse](https://developers.google.com/web/tools/lighthouse/) to guide performance optimizations, the team adopted a performance-first culture while implementing new features. Truebil was able to significantly improve user experience by prioritizing the [First Contentful Paint](/first-contentful-paint) and [Time to Interactive (TTI)](/interactive) metrics and optimizing for fast first loads, repeat visits, and smooth navigation. The team achieved those results by setting performance budgets and using a variety of techniques to achieve them.

#### Set performance budgets

With a performance-first mindset, the Truebil team chose to architect their experience as a single page app with server-side rendering for first load and client-side rendering for subsequent loads. Keeping web apps with client side rendering performant can be difficult, so Truebil set very strict [performance budgets](/fast#set-performance-budgets) to ensure they don't compromise on speed, especially as they add more features.

The team set strict milestone-based budgets for TTI with the goal of keeping it below five seconds. To meet that goal they manually ensured no build would exceed a 250 KB JavaScript bundle size, kept a constant check on image sizes, and continually tracked the app's Lighthouse performance score.

#### Optimize JavaScript bundles

The team started with the basics by using the [PRPL pattern](/apply-instant-loading-with-prpl) to precache and optimize JavaScript payloads and by moving to HTTP/2 to serve critical JavaScript bundles.

To lazy-load non-critical resources, they used their framework-level lazy-loading components to load below-the-fold fragments.

To remove any JavaScript bundle bottlenecks, the team [reduced payloads via code splitting](/reduce-javascript-payloads-with-code-splitting). They used component- and route-based chunking to to reduce main bundle size and **improve their loading time by 44%,** with TTI falling from 6 seconds to about 5 seconds and [First Meaningful Paint (FMP)](/first-meaningful-paint) from 4.1 seconds to 3.6 seconds.

<figure class="w-figure">
  {% Img src="image/admin/BHIhtRrQcc2Ec22vLYtT.png", alt="Screenshots of Chrome DevTools showing Truebil Lite's build size before and after code splitting.", width="800", height="350", class="w-screenshot" %}
  <figcaption class="w-figcaption">Impact of reducing chunk size.</figcaption>
</figure>

#### Inline critical CSS

To further improve FMP, the team used Lighthouse to find opportunities for and validate the impact of performance optimizations. Lighthouse indicated that reducing render blocking CSS would have the biggest effect, so Truebil inlined all critical CSS and [deferred non-critical CSS](/defer-non-critical-css). This technique **reduced FMP by around 2 seconds**.

<figure class="w-figure">
  {% Img src="image/admin/GnQDJz27SuLuLgdvM6Q3.png", alt="Screenshots of Chrome DevTools showing Truebil Lite's time to First Meaningful Paint before and after inlining CSS.", width="800", height="496", class="w-screenshot" %}
  <figcaption class="w-figcaption">Impact of inlining critical CSS.</figcaption>
</figure>

#### Avoid multiple, costly round trips to any origin

To mitigate overhead from DNS and TLS, Truebil used [`<link rel="preconnect">`](/uses-rel-preconnect) and `<link rel="dns-prefetch">`. This approach causes the browser to complete the TLS handshake as soon as possible on page load and pre-resolve cross-origin domain names, allowing for a secure, snappy user experience.

<figure class="w-figure">
  {% Img src="image/admin/e1taLW99INISJAsEP0xe.png", alt="Screenshots of Chrome DevTools showing the effect of rel=preconnect.", width="800", height="350", class="w-screenshot" %}
  <figcaption class="w-figcaption">Impact of adding <code>&#60;link rel=preconnect&#62;</code>.</figcaption>
</figure>

#### Dynamically prefetch the next page

By analyzing their data, the team identified the most common user journeys that they could optimize for. In these cases, the app dynamically downloads the next page resource by using `<link rel=prefetch>` to ensure smooth navigation for users. While the team manually identifies the links to prefetch, they use webpack to bundle the JS for those links.

<figure class="w-figure">
  {% Img src="image/admin/fuxD2hQlNcTPKUHMQpN2.png", alt="Screenshots of the Truebil Lit app and Chrome DevTools showing that network requests aren't needed on common navigations because the assets have already been prefetched.", width="800", height="1006", class="w-screenshot" %}
  <figcaption class="w-figcaption">The effect of prefetching assets for common user journeys.</figcaption>
</figure>

#### Optimize images and fonts

Images are a critical part of Truebil's product experience and credibility, with each product listing including up to 40 pictures. To ensure that images do not block page load, the team chose to [serve all their resources from a CDN](/image-cdns) and use [imagemagick](https://imagemagick.org/index.php) for image optimization. They also Gzipped all compressible resources, including images, JavaScript, and CSS, to further cut down load time.

To [avoid a flash of invisible text](/avoid-invisible-text) while keeping load time as low as possible, Truebil set up their CSS to use system fonts as a fallback until external fonts have loaded.

#### Further optimizations

When the app was ready, the team wanted to further reduce the vendor bundle size and JavaScript execution time, so they switched their React app to Preact in production. (Learn more in the [React](/react) collection.) This approach helped them reduce the vendor bundle size from 82.3 KB to 51.2 KB.

### Build in reliability

With a focus on the Indian market, a vast majority of Truebil's users access their product on patchy networks that sometimes fall into bandwidths as low as 2G. So building a resilient experience was critical not only to improving performance under constrained network conditions but also to delivering a product that their users could rely on—one that _always_ works.

#### A hybrid caching strategy for reliable loading

The interactivity and rate of change for Truebil's content vary a lot. To ensure that _all_ its content is both fresh and reliable, the Truebil team implemented [API caching](/runtime-caching-with-workbox) using a combination of network-first, cache-first, and fastest-first strategies.

For static pages, such as the subscriptions page, Truebil uses a cache-first strategy to go to their subscription API cache first, falling back to the network.

For pages with dynamic content that rarely changes, such as their product listing or details pages, Truebil uses a network-first strategy so that the browser first checks the network for content before falling back to the API cache if the network is unavailable.

And for dynamic pages that change often, such as the home, filter, search, and city pages, Truebil uses a fastest-first strategy to choose between network or cache based on whichever comes first. To ensure that content is fresh, the cache is updated whenever the network response differs from what's in the cache.

#### Service workers for a full offline experience

Even though a large part of Truebil's content is highly dynamic—cars can be added or bought at any time—the team wanted to ensure that their users had _some_ content to engage with, even if they were going through patchy networks or were completely offline.

Using [service workers](/service-workers-cache-storage/), the team was able to cache both static data and the dynamic data that a user has already interacted with so that the user can view it offline. To make sure users know that content might change when they come back online, the team changed the UI to grayscale to indicate offline mode. Browsing product pages is a critical part of the Truebil user journey. Users who have visited the PWA at least once can browse listings and product pages that they have visited before but won't be able to see any updates to the listing or the product.

<figure class="w-figure">
  {% Img src="image/admin/XMJug442wdtUbxe86r2h.png", alt="A screenshot of the Truebil Lite app in offline mode.", width="800", height="384" %}
  <figcaption class="w-figcaption">
    Truebil Lite in offline mode.
  </figcaption>
</figure>

### Improve engagement to keep users coming back

#### An engaging first experience

Since most of their users come from paid channels, Truebil needed to supplement their fast loading web app with a product that surfaces highly relevant recommendations to increase conversions. While the team uses a recommendation system based on sophisticated filtering for existing users, their system doesn't work for users who log in for the first time.

To avoid giving their first-time users a cold start, the team integrated a recommendation system using their digital marketing efforts. They add product details such as car model, price, and body type into an ad's destination URL through a UTM parameter, which is read by their recommendation system and reflected in the products surfaced. In case the sysme reads no such details in the URL, it falls back to popular cars, which is a combination of popular models, popular budgets, and cars that have been popular in the last few weeks or days.

#### An installable web app

Having built a fast, full-featured web app with a compelling user experience, Truebil wanted to ensure that their users would keep coming back. They realized that making the app installable would make repeat visits much more seamless.

The team implemented the [Add to Home Screen](https://developers.google.com/web/fundamentals/app-install-banners/) feature to make their product a full progressive web app (PWA). This approach allowed users to add Truebil Lite to the home screen and launch it in full-screen mode. And since they had already implemented an offline mode, the team was able to add the new feature easily.

To ensure that their users weren't spammed and to increase the probability that users would install the app, the team recently updated their strategy for [promoting PWA installation](https://developers.google.com/web/fundamentals/app-install-banners/promoting-install-mobile) so that  installation prompts appear when they'll actually be useful to different kinds of users. Truebil settled on a three-part strategy:

*   Show prompts when the user has completed an action or is idle.
*   Show contextual prompts to mature users.
*   Show a banner when the user has spent a set amount of time on the site.

#### Default banners on process completion and on high-traffic pages

The team decided to show an installation banner when a user completes a task or is on high-traffic pages but idle (that is, not taking an action, such as scrolling or filling out a form). This approach allowed them to avoid interrupting the user's activity.

{% Img src="image/admin/geEMVQf4YjnkVr9HPRzt.png", alt="Screenshots of Truebil Lite's installation banner.", width="800", height="549" %}

#### Contextual prompts for mature users

For users who had interacted with the app for a while, the team used highly contextual custom messages to show the value of installing the app to the home screen:

{% Img src="image/admin/uPxqbyldE0kNurRPsk2S.png", alt="Screenshots of Truebil Lite's contextual installation prompts for mature users.", width="800", height="514" %}

#### A custom banner for time-based prompts

Finally, the team built in a non-intrusive banner with a notification-like design that's triggered at specific events, such as opening a listing page or after the user has spent a set amount of time spent in the app:

<figure class="w-figure">
  {% Img src="image/admin/5UN2g9g7NWq85CMVoRYf.png", alt="A screenshot of Truebil Lite's time-based installation prompt banner.", width="452", height="868" %}
</figure>

Because of these improvements, Truebil's conversion and engagement rates have grown significantly with **26% longer user sessions** and **61% more conversions**, which is significant for their business given the high transaction value of each conversion.

<blockquote>
  <p>For a startup with limited resources, choosing the right platform can be critical to the success of the business. Moving to a PWA focused on speed, resilience, and engagement, enabled us to increase our revenue-to-marketing spend by <strong>80%</strong> thanks to increased conversions and the frictionless reach of the web.</p>
  <cite>Rakesh Raman, Co-Founder and Chief of Product & Data Science at Truebil</cite>
</blockquote>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">44<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Improvement in loading time</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">26<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Longer user sessions</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">61<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Increase in conversions</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">80<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Increase in revenue-to-marketing spend</p>
  </div>
</div>
