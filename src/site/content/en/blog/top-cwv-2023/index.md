---
layout: post
title: Our top Core Web Vitals recommendations for 2023
subhead: A collection of the best practices that the Chrome DevRel team believes are the most effective ways to improve Core Web Vitals performance in 2023.
description: A collection of best practices for optimizing websites' Core Web Vitals performance based on the state of the web in 2023.
authors:
  - philipwalton
  - rviscomi
  - tunetheweb
  - bckenny
  - jlwagner
date: 2023-01-10
#updated: 2023-01-10
hero: image/STd8eW8CSiNp5B1bX0R6Dww2eH32/5YsYz2bJSPUpNSPHRQRx.jpg
alt: A handheld lens in the foreground focuses a far away city skyline.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - web-vitals
---

Over the years, we at Google have made a lot of recommendations to web developers on how to improve performance.

While each of these recommendations, individually, may improve performance for many sites, the full set of recommendations is admittedly overwhelming and, realistically, there's no way any one person or site could follow all of them.

Unless web performance is your day job, it's probably not obvious which recommendations are going to have the largest positive impact on your site. For example, you might have read that implementing critical CSS can improve load performance, and you may have also heard that it's important to optimize your images. But, if you don't have time to work on both things, how would you decide which one to pick?

On the Chrome team, we've spent the last year trying to answer this question:* what are the most important recommendations we can give to developers to help them improve performance for their users?*

To adequately answer this question we have to consider not just the technical merits of any given recommendation, but also human and organizational factors that influence the likelihood that developers will actually be able to adopt these recommendations. In other words, some recommendations may be hugely impactful in theory, but in reality very few sites will have the time or resources to implement them. Similarly, some recommendations are critical, but most websites are already following these practices.

In short, we wanted our list of top web performance recommendations to focus on:

-   Recommendations we believe will have the **largest real-world impact**
-   Recommendations that are **relevant and applicable to most sites**
-   Recommendations that are **realistic for most developers to implement**

Over the past year we've spent a lot of time auditing the full set of performance recommendations we make, and assessing each of them (both qualitatively and quantitatively) against the above three criteria.

This post outlines our top recommendations to improve performance for each of the [Core Web Vitals](https://web.dev/vitals/#core-web-vitals) metrics. If you're new to web performance, or if you're trying to decide what will give you the biggest bang for your buck, we think these recommendations are the best place to start.

# Largest Contentful Paint (LCP)

Our first set of recommendations are for [Largest Contentful Paint (LCP)](https://web.dev/lcp/), which is a measure of load performance. Of the three Core Web Vitals metrics, LCP is the one that the largest number of sites struggle with—only [about half](https://datastudio.google.com/s/nw4gcbKA5o4) of all sites on the web today meet the [recommended threshold](https://web.dev/lcp/#what-is-a-good-lcp-score)—so let's start there.

## Ensure the LCP resource is discoverable from the HTML source

According to the [2022 Web Almanac](https://almanac.httparchive.org/en/2022/) by HTTP Archive, [72%](https://almanac.httparchive.org/en/2022/performance#fig-8) of mobile pages have an image as their LCP element, which means that for most sites to ensure their LCP is good, they'll need to ensure those images can load quickly.

What may not be obvious to many developers is that the time it takes to load an image is just one part of the challenge. Another critical part is the time *before* an image starts loading, and HTTP Archive data suggests that's actually where many sites get tripped up.

In fact, of the pages where the LCP element was an image, [39%](https://almanac.httparchive.org/en/2022/performance#lcp-static-discoverability) of those images had source URLs that were not [discoverable](https://web.dev/optimize-lcp/#optimize-when-the-resource-is-discovered) from the HTML document source. In other words, those URLs were not found in standard HTML attributes (such as `<img src="...">` or `<link rel="preload" href="...">`), which would allow the browser to quickly discover them and start loading them right away.

If a page needs to wait for CSS or JavaScript files to be fully downloaded, parsed, and processed before the image can even start loading, it may already be too late.

As a general rule, if your LCP element is an image, the image's URL should always be discoverable from the HTML source. Some tips to make that possible are:

- **Load the image using an `<img>` element with the `src` or `srcset` attribute.** Do not use non-standard attributes like `data-src` that require JavaScript in order to render, as that will always be slower. [9%](https://almanac.httparchive.org/en/2022/performance#lcp-lazy-loading) of pages obscure their LCP image behind `data-src`.

- **Prefer server-side rendering (SSR) over client-side rendering (CSR),** as SSR implies that the full page markup (including the image) is present in the HTML source. CSR solutions require JavaScript to run before the image can be discovered.

- **If your image needs to be referenced from an external CSS or JS file, you can still include it in the HTML source via a `<link rel="preload">` tag.** Note that inline styles are not discoverable by the browser's [preload scanner](https://web.dev/preload-scanner/), so even though they're found in the HTML source, discovery of them might still be blocked on the loading of other resources, so preloading can help in these cases.

To help you understand if your LCP image has discoverability problems, Lighthouse will be releasing a [new audit](https://github.com/GoogleChrome/lighthouse/issues/13738) in version 10.0 (expected January 2023).

Ensuring the LCP resource is discoverable from the HTML source can lead to measurable improvements and it also unlocks additional opportunities to prioritize the resource, which is our next recommendation.

## Ensure the LCP resource is prioritized

Making sure the LCP resource can be discovered from the HTML source is a critical first step in ensuring the LCP resource can start loading early, but another important step is ensuring that the loading of that resource is [prioritized](https://web.dev/optimize-lcp/#optimize-the-priority-the-resource-is-given) and doesn't get queued behind a bunch of other, less important resources.

For example, even if your LCP image is present in the HTML source using a standard `<img>` tag, if your page includes a dozen `<script>` tags in the `<head>` of your document before that `<img>` tag, it may be a while before your image resource starts loading.

The easiest way to solve this problem is to provide a hint to the browser about what resources are the highest priority by setting the new `[fetchpriority="high"](https://web.dev/priority-hints/)` attribute on the `<img>` or `<link>` tag that loads your LCP image. This instructs the browser to load it earlier, rather than waiting for those scripts to complete.

According to the Web Almanac, only [0.03%](https://almanac.httparchive.org/en/2022/performance#lcp-prioritization) of eligible pages are taking advantage of this new API, meaning there is plenty of opportunity for most sites on the web to improve LCP with very little work. While the `fetchpriority` attribute is currently only supported in Chromium-based browsers, this API is a progressive enhancement that other browsers just ignore, so we strongly recommend developers use it now.

For non-Chromium browsers, the only way to ensure the LCP resource is prioritized above other resources is to reference it earlier in the document. Using the example again of a site with lots of `<script>` tags in the `<head>` of the document, if you wanted to ensure your LCP resource was prioritized ahead of those script resources, you could add a `<link rel="preload">` tag before any of those scripts, or you could move those scripts to below the `<img>` later in the `<body>`. While this works, it's less ergonomic than using `fetchpriority`, so we hope other browsers add support soon.

Another critical aspect of prioritizing the LCP resource is to ensure you don't do anything that causes it to be **deprioritized**, such as adding the `loading="lazy"` attribute. Today, [10%](https://almanac.httparchive.org/en/2022/performance#lcp-lazy-loading) of pages actually set `loading="lazy"` on their LCP image. Beware of image optimization solutions that indiscriminately apply lazy-loading behavior to all images. If they provide a way to override that behavior, be sure to use it for the LCP image. If you're not sure which image will be the LCP, try using heuristics to pick a reasonable candidate.

Deferring non-critical resources is another way to effectively boost the relative priority of the LCP resource. For example, scripts that are not powering the user interface (like analytics scripts or social widgets) can be safely postponed until after the `load` event fires, which ensures they won't compete with other critical resources (such as the LCP resource) for network bandwidth.

To summarize, you should follow these best practices to ensure that the LCP resource is loaded early, and at high priority:

- **Add `fetchpriority="high"` to the `<img>` tag of your LCP image.** If the LCP resource is loaded via a` <link rel="preload">` tag, fear not because you can also set `fetchpriority="high"` on that!\
- **Never set `loading="lazy"` on the `<img>` tag of your LCP image.** Doing this will deprioritize your image and delay when it starts loading.\
- **Defer non-critical resources when possible.** Either by moving them to the end of your document, or loading them asynchronously via script.

## Use a CDN to optimize document and resource TTFB

The previous two recommendations focused on making sure your LCP resource is discovered early and prioritized so it can start loading right away. The final piece to this puzzle is making sure the initial document response arrives as quickly as possible too.

The browser cannot start loading any subresources until it receives the first byte of the initial HTML document response, and the sooner that happens, the sooner everything else can start happening as well.

This time is known as [Time to First Byte (TTFB)](https://web.dev/ttfb/), and the best way to reduce TTFB is to:

-   Serve your content as geographically close to your users as possible
-   Cache that content so recently-requested content can be served again quickly.

The best way to do both of these things is to [use a CDN](https://web.dev/content-delivery-networks/). CDNs distribute your resources to [edge servers](https://en.wikipedia.org/wiki/Edge_computing), which are spread across the globe, thus limiting the distance those resources have to travel over the wire to your users. CDNs also usually have fine-grained caching controls that can be customized and optimized for your site's needs.

Many developers are familiar with using a CDN to host static assets, but CDNs can serve and cache HTML documents as well, even those that are dynamically generated.

According to the Web Almanac, only [29%](https://almanac.httparchive.org/en/2022/cdn#cdn-adoption) of HTML document requests were served from a CDN, which means there is significant opportunity for sites to claim additional savings.

Some tips for configuring your CDNs are:

-   Consider increasing how long content is cached for (e.g. is it actually critical that content is always fresh? Or can it be a few minutes stale?).
-   Consider maybe even caching content indefinitely, and then purging the cache if/when you make an update.
-   Explore whether you can move dynamic logic currently running on your origin server to the [edge](https://en.wikipedia.org/wiki/Edge_computing) (a feature of most modern CDNs).

In general, any time you can serve content directly from the edge (avoiding a trip to your origin server) it's a performance win. And even in cases where you *do* have to make the journey all the way back to your origin server, CDNs are generally optimized to do that much more quickly, so it's a win either way.

# Cumulative Layout Shift (CLS)

The next set of recommendations are for [Cumulative Layout Shift (CLS)](https://web.dev/cls/), which is a measure of visual stability on web pages. While CLS has [improved a lot](https://datastudio.google.com/s/gFjrTptD140) on the web since 2020, about a quarter of websites still do not meet the [recommended threshold](https://web.dev/cls/#what-is-a-good-cls-score), so there remains a big opportunity for many sites to improve their user experience.

## Set explicit sizes on any content loaded from the page

[Layout shifts](https://web.dev/cls/#layout-shifts-in-detail) usually happen when existing content moves after other content finishes loading. Therefore, the primary way to mitigate this is to reserve any required space in advance as much as possible.

The most straightforward way to fix layout shifts caused by unsized images is to **explicitly set ``width`` and ``height`` attributes** (or equivalent CSS properties). However, according to HTTP Archive, [72%](https://almanac.httparchive.org/en/2022/performance#explicit-dimensions) of pages have at least one unsized image. Without an explicit size, browsers will initially set a default height of `0px` and may cause a noticeable layout shift when the image is finally loaded and the dimensions are discovered. This represents both a huge opportunity for the collective web—and that opportunity requires much less effort than some of the other recommendations suggested in this article.

It's also important to keep in mind that images are not the only contributors to CLS. Layout shifts may be caused by other content that typically loads in after the page is initially rendered, including third-party ads or embedded videos. **The `[`aspect-ratio`](https://web.dev/aspect-ratio/)` property** can help combat this. It's a relatively new CSS feature that allows developers to explicitly provide an aspect ratio to images as well as non-image elements. This will allow you to set a dynamic ``width` `(for example based on screen size), and have the browser automatically calculate the appropriate height, in much the same way as they do for images with dimensions.

Sometimes it's not possible to know the exact size of dynamic content since it is, by its very nature, dynamic. However, even if you don't know the exact size, you can still take steps to reduce the severity of layout shifts. **Setting a sensible ``min-height``** is almost always better than allowing the browser to use the default height of ``0px`` for an empty element. Using a ``min-height`` is also usually an easy fix as it still allows the container to grow to the final content height if needed—it has just reduced that amount of growth from the full amount to a hopefully more tolerable level.

## Ensure pages are eligible for bfcache

Browsers use a navigation mechanism called the [back/forward cache](https://web.dev/bfcache/)—or bfcache for short—to instantly load a page from earlier or later in the browser history directly from a memory snapshot.

The bfcache is a significant browser-level performance optimization, and it entirely eliminates the layout shifts during page load, which for many sites is where most of their CLS occurs. The introduction of the bfcache caused [the biggest improvement in CLS](https://twitter.com/anniesullie/status/1491399685961293828?s=20&t=k7JgTjdO21uMpeOuOofroA) that we saw in 2022.

Despite this, [a significant number of websites](https://almanac.httparchive.org/en/2022/performance#bfcache-eligibility) are ineligible for the bfcache and so are missing out on this free web performance win for a significant number of navigations. Unless your page is loading sensitive information that you don't want to be restored from memory, you'll want to make sure that your pages are eligible.

Site owners should check that their pages are [eligible for the bfcache](https://web.dev/bfcache/#optimize-your-pages-for-bfcache) and work on any reasons why they are not. Chrome already [has a bfcache tester in DevTools](https://web.dev/bfcache/#test-to-ensure-your-pages-are-cacheable) and this year we plan to enhance tooling here with [a new Lighthouse audit performing a similar test](https://github.com/GoogleChrome/lighthouse/issues/13960) and [an API to measure this in the field](https://chromestatus.com/feature/5684908759449600).

While we have included the bfcache in the CLS section, as we saw the biggest gains there so far, the bfcache will also improve the other Core Web Vitals, i.e. with 0 LCP and much improved FID and INP. It is one of [a number of instant navigations](https://calendar.perfplanet.com/2022/fast-is-good-instant-is-better/) available to drastically improve page navigations.

## Avoid animations/transitions that use layout-inducing CSS properties

Another common source of layout shifts is when elements are animated. For example, cookie banners or other notification banners can push content out of their way, and will cause a layout shift if they do.

While HTTP Archive data can't conclusively connect animations to layout shifts, the data does show that pages that animate any CSS property that *could* affect layout are 15% less likely to have "good" CLS than pages overall. Some properties are associated with worse CLS than others. For instance, pages that animate `margin` or `border` widths have "poor" CLS at almost twice the rate that pages are assessed as poor overall.

If an element must change its location or the area it takes up, the easiest way to avoid these shifts is to pull the animations outside of the normal document flow. The most common way is to **use animations that don't affect layout**, like `transform`. Animating with `transform` can have the added benefit of [improving page performance overall](https://web.dev/animations-guide/) by moving more animation work onto the GPU and off the main thread. A page could also remove the element itself from the document flow, like with `position: absolute` or `fixed`, though animating some properties (like `top`) could still trigger a layout shift on the element itself.

The Lighthouse audit [Avoid non-composited animations](https://developer.chrome.com/docs/lighthouse/performance/non-composited-animations/) will warn when a page animates potentially slow CSS properties, a large number of which can cause layout shifts.

# First Input Delay (FID)

Our last set of recommendations are for [First Input Delay (FID)](https://web.dev/fid/), which is a measure of a page's responsiveness to user interactions. While most sites on the web currently [score very well](https://datastudio.google.com/s/vax9YUKhRN0) on FID, we've [documented](https://web.dev/better-responsiveness-metric/#what-improvements-are-we-considering) shortcomings of the FID metric in the past, and we believe there is still a lot of opportunity for sites to improve their overall responsiveness to user interactions.

Our new [Interaction to Next Paint (INP)](https://web.dev/inp/) metric is a possible successor to FID, and all of the recommendations below apply equally well to both FID and INP. Given that sites [perform worse](https://almanac.httparchive.org/en/2022/performance#inp-as-a-hypothetical-cwv-metric) on INP than FID, especially on mobile, we encourage developers to seriously consider these responsiveness recommendations, despite having "good" FID.

## Avoid or break up long tasks

Tasks are any piece of discrete work that the browser does. Tasks include rendering, layout, parsing, and compiling and executing scripts. When tasks become [long tasks](https://web.dev/long-tasks-devtools/#what-are-long-tasks)—that is, 50 milliseconds or longer—they block the main thread from being able to respond quickly to user inputs.

Per the Web Almanac, there's [plenty of evidence](https://almanac.httparchive.org/en/2022/javascript#long-tasksblocking-time) to suggest that developers could be doing more to avoid or break up long tasks. While breaking up long tasks may not be as low of an effort as other recommendations in this article, it's less effort than other techniques not offered in this article.

While you should always strive to do as little work as possible in JavaScript, you can help the main thread quite a bit by [breaking up long tasks into smaller ones](https://web.dev/optimize-long-tasks/). You can accomplish this by **[yielding to the main thread**](https://web.dev/optimize-long-tasks/#use-asyncawait-to-create-yield-points) often so that rendering updates and other user interactions can occur more quickly.

Another option is to consider using APIs such as `isInputPending` and the Scheduler API. [`isInputPending](https://web.dev/optimize-long-tasks/#yield-only-when-necessary)` is a function that returns a boolean value that indicates whether a user input is pending. If it returns true, you can yield to the main thread so it can handle the pending user input. [The Scheduler API](https://web.dev/optimize-long-tasks/#a-dedicated-scheduler-api) is a more advanced approach, which allows you to schedule work based on a system of priorities that take into account whether the work being done is user-visible or backgrounded.

By breaking up long tasks, you're giving the browser more opportunities to fit in critical user-visible work, such as dealing with interactions and any resulting rendering updates.

## Avoid unnecessary JavaScript

There's no doubt about it: [websites are shipping more JavaScript than ever before](https://almanac.httparchive.org/en/2022/javascript#how-much-javascript-do-we-load), and the trend doesn't look like it's changing any time soon. When you ship too much JavaScript, you're creating an environment where tasks are competing for the main thread's attention. This can definitely affect your website's responsiveness, especially during that crucial startup period.

This is not an unsolvable problem, however. You do have some options:

-   Use the [coverage tool](https://developer.chrome.com/docs/devtools/coverage/) in Chrome DevTools to find unused code in your website's resources. By reducing the size of the resources you need during startup, you can ensure your website spends less time parsing and compiling code, which leads to a smoother initial user experience.
-   Sometimes the unused code you find using the coverage tool is marked "unused" because it wasn't executed during startup, but is still necessary for some functionality in the future. This is code that you can move to a separate bundle via [code splitting](https://web.dev/reduce-javascript-payloads-with-code-splitting/).
-   If you're using a tag manager, be sure to [periodically check your tags to make sure they are optimized](https://web.dev/tag-best-practices/), or even if they're still being used. Older tags with unused code can be cleared out to make your tag manager's JavaScript smaller and more efficient.

## Avoid large rendering updates

JavaScript isn't the only thing that can affect your website's responsiveness. Rendering can be a type of expensive work in its own right—and when large rendering updates happen, they can interfere with your website's ability to respond to user inputs.

Optimizing rendering work isn't a straightforward process, and it often depends on what you're trying to achieve. Even so, there are some things you can do to ensure that your rendering updates are reasonable, and don't sprawl into long tasks:

-   Avoid using [`requestAnimationFrame()](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame)` for doing any non-visual work. `requestAnimationFrame()` calls are handled during the rendering phase of the event loop, and when too much work is done during this step, rendering updates can be delayed. It's essential that any work you're doing with `requestAnimationFrame()` is reserved strictly for tasks that involve rendering updates.
-   [Keep your DOM size small](https://developer.chrome.com/docs/lighthouse/performance/dom-size/). DOM size and the intensity of layout work are correlated. When the renderer has to update the layout for a very large DOM, the work required to recalculate its layout can increase significantly.
-   [Use CSS containment](https://developer.mozilla.org/docs/Web/CSS/CSS_Containment). CSS containment relies on the CSS `contain` property, which gives instructions to the browser about how to do layout work for the container the `contain` property is set on, including even isolating the scope of layout and rendering to a specific root in the DOM. It's not always an easy process, but by isolating areas containing complex layouts, you can avoid doing layout and rendering work for them that isn't necessary.

# Conclusion

Improving page performance can seem like a daunting task, especially when you consider that there is a mountain of guidance across the web to consider. By focusing on these recommendations, however, you can approach the problem with focus and purpose, and hopefully move the needle for your website's Core Web Vitals in 2023.

Based on careful analysis of the state of the web, these recommendations represent the subset of best practices that we believe are the *most effective* ways to improve Core Web Vitals performance. If you find that some or all of this guidance doesn't apply to your specific situation, there's always more you can do. Check out these optimization guides for each of the metrics discussed in this article for more information:

-   [Optimize LCP](https://web.dev/optimize-lcp/)
-   [Optimize CLS](https://web.dev/optimize-cls/)
-   [Optimize FID](https://web.dev/optimize-fid/)
-   [Optimize INP](https://web.dev/optimize-inp/)

Here's to a new year, and a faster web for all! May your sites be fast for your users in all the ways that matter most.


_Photo by [Devin Avery](https://unsplash.com/@devintavery)_