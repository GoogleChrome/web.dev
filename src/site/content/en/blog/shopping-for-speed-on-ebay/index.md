---
title: Shopping for speed on eBay.com
subhead: Optimizing the performance of eBay's sites and apps for a faster user experience.
authors:
  - addyosmani
date: 2020-01-22
hero: image/admin/UMFt6kc3YZIaF2Qzqd0d.png
thumbnail: image/admin/58uctmJLRxZK0KKV2igl.png
# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom
alt: The eBay Logo and a screenshot of the eBay site
description: |
  This case study explains how eBay increased key business metrics by optimizing the performance of
  their web and app experiences.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - case-study
  - reliable
  - e-commerce
  - test-post
  - performance
---

Speed was a [company-wide initiative][cuts] for eBay in 2019, with many teams determined to make the
site and apps as fast as possible for users. In fact, **for every 100 milliseconds improvement in
search page loading time, eBay saw a 0.5% increase in "Add to Cart" count.**

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">100<sub class="w-stat__sub">ms</sub></p>
    <p class="w-stat__desc">Improvement in load time</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">0.5<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Increase in "Add to Cart" count</p>
  </div>
</div>

Through the adoption of [Performance Budgets](/performance-budgets-101/) (derived
after doing a competitive study with the [Chrome User Experience
Report](https://developers.google.com/web/tools/chrome-user-experience-report)) and a focus on key
[user-centric performance metrics](/user-centric-performance-metrics/), eBay was able to make
significant improvements to site speed.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/JXQCBQRuezhMQhfQShXq.png", alt="The optimization efforst led to a 10% improvement on the homepage, a 13% improvement on the search page, and 3% improvement on item pages.", width="800", height="186", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    eBay's speed improvements.
  </figcaption>
</figure>

…and their Chrome User Experience Report data highlights these improvements, too.

<figure class="w-figure">
  {% Img src="image/admin/YeJPjxdDBrdbgLxcbl7E.png", alt="Screenshots of PageSpeed Insights view of Chrome User Experience Report data highlighting fast FCP of 70% and fast FID of 88% for eBay.com", width="800", height="237", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Chrome User Experience Report data for <a href="/fcp/">First Contentful Paint</a> and <a href="/fid/">First Input Delay</a> for the eBay.com origin.
  </figcaption>
</figure>

There's still more work ahead but here's eBay's learnings so far.

## Web Performance "cuts"

The improvements eBay made were possible due to the reduction or "cuts" (in the size and time) of
various entities that take part in a user's journey.  This post covers topics that are relevant to
the web developer community at large, rather than eBay-specific topics.

## Reduce payload across all text resources

One way to make sites fast is to simply load less code. eBay reduced their text payloads by trimming
all the [unused and unnecessary bytes](/remove-unused-code/) of JavaScript, CSS,
HTML, and JSON responses served to users. Previously, with every new feature, eBay kept increasing
the payload of their responses, without cleaning up what was unused. This added up over time and
became a performance bottleneck. Teams usually procrastinated on this cleanup activity, but you'd
be surprised by how much eBay saved.

The "cut" here is the wasted bytes in the response payload.

## Critical path optimization for above-the-fold content

Not every pixel on the screen is equally important. The content [above-the-fold][atf] is [more
critical](/extract-critical-css/) than something below-the-fold. iOS/Android/desktop and web apps
are aware of this, but what about services? eBay's service architecture has a layer called
[Experience
Services](https://tech.ebayinc.com/engineering/experience-services-ebays-solution-to-multi-screen-application-development/),
which the frontends (platform-specific apps and web servers) talk to.
This layer is specifically designed to be view- or device-based, rather than entity-based like item,
user, or order. eBay then introduced the concept of the critical path for Experience Services.
When a request comes to these services, they work on getting the data for above-the-fold
content immediately, by calling other upstream services in parallel. Once data is ready, it is
instantly flushed.
The below-the-fold data is sent in a later chunk or lazy-loaded. The outcome: users get to see
above-the-fold content quicker.

The "cut" here is the time spent by services to display relevant
content.

## Image optimizations

Images are [one of the largest contributors to page
bloat](https://almanac.httparchive.org/en/2019/media). Even
small optimizations go a long way. eBay did two optimizations for images.

First, eBay standardized on the [WebP image format](/serve-images-webp/) for search
results across all platforms, including iOS, Android, and [supported browsers][webp]. The search
results page is the most image-heavy page at eBay, and they were already using WebP, but not in a
consistent pattern.

<figure class="w-figure">
  {% Img src="image/admin/wxY64wQbCvgdEuI8DlUY.png", alt="Screenshots of the DevTools network panel filtered to show WebP image requests from eBay.com", width="800", height="506", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    WebP images being served to supported browsers on eBay.com.
  </figcaption>
</figure>

Second, though eBay's listing images are heavily optimized (in both size and format), the same rigor
did not apply for curated images (for example, the top module on the
[homepage](https://www.ebay.com/)). eBay has a lot of hand-curated images, which are uploaded
through various tools. Previously the optimizations were up to the uploader, but now eBay enforces
the rules within the tools, so all images uploaded will be optimized appropriately.

The "cut" here is the wasted image bytes sent to users.

## Predictive prefetch of static assets

A user session on eBay is not just one page. It is a flow. For example, the flow can be a navigation from the homepage to a search page to an item page. So why don't pages in the flow help each other? That is the idea of [predictive prefetch](/predictive-prefetching/), where one page prefetches the static assets required for the next likely page.

With predictive prefetch, when a user navigates to the predicted page, the assets are already in the browser cache. This is done for CSS and JavaScript assets, where the URLs can be retrieved ahead of time. One thing to note here is that it helps only on first-time navigations. On subsequent navigations, the static assets will already be in the cache.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dcipECBEv200bO8CWkrs.png", alt="eBay is doing predictive prefetching of static assets. Home prefetches assets for Search, Search prefetches assets for Item, and so on. Machine-learning- and analytics-based prefetching is under consideration.", width="800", height="448", class="w-screenshot" %}
</figure>

The "cut" here is the network time for CSS and JavaScript static assets on the first navigation.

## Prefetching top search results

When a user searches eBay, eBay's analytics data suggests that it is highly likely that the user
will navigate to an item in the top 10 of the search results. So eBay now prefetches the
items from search and keeps them ready for when the user navigates. The prefetching happens at two levels.

The first level happens server-side, where the item service caches the top 10 items in search results. When the user
goes to one of those items, eBay now saves server processing time. Server-side caching is leveraged by
platform-specific apps and is rolled out globally.

The other level happens in the browser cache, which is available
in Australia. Item prefetch was an advanced optimization due to the dynamic nature of items. There
are also many nuances to it: page impressions, capacity, auction items, and so on. You can learn more
about it in [LinkedIn's Performance Engineering Meetup
presentation](https://www.youtube.com/watch?v=ogEhUnQdQiU&t=984s), or stay tuned for a detailed blog
post on the topic from eBay's engineers.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6wW7yHAD7vMBDUDCzm2B.png", alt="eBay prefetches the top 5 items in search result pages for fast subsequent loads. This happens during idle time with requestIdleCallback(). This resulted in a 759ms faster median above-the-fold time, a custom metric that is similar to First Meaningful Paint. eBay saw a positive impact on conversions from prefetching.", width="800", height="451", class="w-screenshot" %}
</figure>

The "cut" here can either be server processing time or network time,
depending on where the item is cached.

## Eager downloading of search images

In the search results page, when a query is issued at a high level, two things happen. One is the recall/ranking step, where the most relevant items matching the query are returned. The second step is augmenting the recalled items with additional user-context related information such as shipping costs.
eBay now immediately sends the first 10 item images to the browser in a chunk along with the header, so the downloads can start before the rest of the markup arrives. As a result, the images will now appear quicker. This change is rolled out globally for the web platform.

The "cut" here is the download start time for search result images.

## Edge caching for autosuggestion data

When users type in letters in the search box, suggestions pop-up. These suggestions do not change for letter combinations for at least a day. They are ideal candidates to be cached and served from a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) (for a max of 24 hours), instead of requests going all the way to a data center. International markets especially benefit from CDN caching.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5HVWuq5nIvQ6aCoaltIl.png", alt="A screenshot of eBay's search box displaying autocomplete suggestions for a search query.", width="800", height="417", class="w-screenshot" %}
</figure>

There was a catch, though. eBay had some elements of personalization in the suggestions pop-up,
which can't be cached efficiently. Fortunately, it was not an issue in the platform-specific apps, as the user
interface for personalization and suggestions could be separated. For the web, in international
markets, latency was more important than the small benefit of personalization. With that out of the
way, eBay now has autosuggestions served from a CDN cache globally for platform-specific apps and non-US
markets for eBay.com.

The "cut" here is the network latency and server processing time for
autosuggestions.

## Edge caching for unrecognized homepage users

For the web platform, the homepage content for unrecognized users is the same for a particular region. These are users who are either using eBay for the first time or starting a fresh session, hence no personalization. Though the homepage creatives keep changing frequently there is still room for caching.

eBay decided to cache the unrecognized user content (HTML) on their edge network ([PoPs](https://en.wikipedia.org/wiki/Point_of_presence)) for a short period. First-time users can now get homepage content served from a server near them, instead of from a faraway data center. eBay is still experimenting with this in international markets, where it will have a bigger impact.

The "cut" here is again both network latency and server processing time for unrecognized users.

## Optimizations for other platforms

### iOS/Android app parsing improvements

iOS/Android apps talk to backend services whose response format is typically JSON. These JSON payloads can be large. Instead of parsing the whole JSON to render something on the screen, eBay introduced an efficient parsing algorithm that optimizes for content that needs to be displayed immediately.

Users can now see the content quicker. In addition, for the Android app, eBay starts initializing the search view controllers as soon as the user starts typing in the search box (iOS already had this optimization). Previously this happened only after users pressed the search button. Now users can get to their search results faster. The "cut" here is the time spent by devices to display relevant content.

### Android app startup time improvements

This applies to [cold start](https://developer.android.com/topic/performance/vitals/launch-time#cold) time optimizations for Android apps. When an app is cold started, a lot of initialization happens both at the OS level and application level. Reducing the initialization time at the application level helps users see the home screen quicker. eBay did some profiling and noticed that not all initializations are required to display content and that some can be done lazily.

More importantly, eBay observed that there was a blocking third-party analytics call that delayed the rendering on the screen. Removing the blocking call and making it async further helped cold start times. The "cut" here is the unnecessary startup time for Android apps.

## Conclusions

All the performance "cuts" eBay made collectively contributed towards moving the needle, and it happened over a period of time. The releases were phased in throughout the year, with each release shaving off tens of milliseconds, ultimately reaching the point where eBay is now:

<figure class="w-figure">
  {% Img src="image/admin/GxKfB8GHUd9cQWLb0Pkj.png", alt="Screenshots of Chrome UX Report showing field data improvements for eBay.com.", width="800", height="529", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The impact of eBay's speed efforts on their field metrics over time, as illustrated by the <a href="https://g.co/chromeuxdash">Chrome UX Report Dashboard</a>.
  </figcaption>
</figure>

Performance is a feature and a [competitive advantage](/value-of-speed/). Optimized experiences lead to higher user engagement, conversions, and ROI. In eBay's case, these optimizations varied from things that were low-effort to a few that were advanced.

Check out [Speed by a thousand cuts][cuts] to learn more and be on the lookout for more detailed articles by eBay engineers on their performance work in the near future.

[atf]: https://www.optimizely.com/optimization-glossary/above-the-fold/
[cuts]: https://tech.ebayinc.com/engineering/speed-by-a-thousand-cuts/
[webp]: https://caniuse.com/#feat=webp
