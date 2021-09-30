---
title: How committing to Core Web Vitals increased Netzwelt's advertising revenues by 18%
subhead: The relaunched website also sees ad viewability of over 75%, bounce rates reduced by 50%, and page views up by 27%.
authors:
  - martinschierle
date: 2021-07-19
hero: image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/esq05YkD123DMpDMscHP.png
thumbnail: image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/XuTyBKOPVQjIt2MFMPoG.png
alt: Netzwelt logo
description: >
  Learn how German news publisher Netzwelt optimized Core Web Vitals to improve user experience and ad revenues.
tags:
  - blog
  - case-study
  - web-vitals
  - performance
---

When Google announced the Core Web Vitals initiative,
German publisher [Netzwelt](https://www.netzwelt.de/) quickly realized the potential of these new metrics
towards a great page experience and improved advertising-based monetization.
They went on a journey to relaunch their website,
applying common performance best practices while optimizing ad tags and placements in parallel.
Committing to great UX and fast pages proved to be a path
for optimizing engagement and ad revenues hand in hand,
with page views up by 27%, ad viewability over 75%, and advertising revenues improving by 18%.


<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">27<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Increase in page views</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">18<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Increase in ad revenue</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">75<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Ad viewability</p>
  </div>
</div>

## The challenge

Like many other news publishers,
Netzwelt struggled to find the right balance between optimizing user experience and page speed
while maintaining high ad revenues.
The main challenges they encountered were:

* High [Cumulative Layout Shift](/cls) (CLS) due to layout shifts triggered by ads,
especially from multisize slots and top banners.
* [Largest Contentful Paint](/lcp) (LCP) coming in late due to ads being the largest paint
or by taking bandwidth from hero image loading.
* High [First Input Delay](/fid) (FID) caused by third-party JavaScript needed for advertising,
header bidding, and other purposes.
* Side effects on Core Web Vitals from consent dialogs controlled by third-party vendors,
which also added to layout shifts and might be detected as late largest paints.

## Optimizing a news website for Core Web Vitals

When Netzwelt started working on core web vitals,
they quickly noticed that optimizing Core Web Vitals doesn't need to affect advertisement negatively
but can be used as an opportunity to improve ad viewability.
Therefore, the Netzwelt team optimized Core Web Vitals to lift ad viewability
above 75% to attract higher-value advertising
(the global average for display ads
[is less than 50%](https://www.thinkwithgoogle.com/feature/viewability/state-of-viewability)).

### Optimizing CLS

Advertisements often load late (sometimes consciously through lazy-loading),
and their real size is often not known in advance due to multisize and fluid ad placements.

The problem can be divided into two—ads above and below the fold.

**Ads above the fold** can cause massive layout jumps due to loading late with unknown sizes.
Blocking the largest space they might need can lead to bad UX,
while asking advertisers for fixed sizes may reduce ad income.
Netzwelt solved this problem by making the top ad sticky and removing some of the bigger allowed banner sizes.
The overlaid ad avoids triggering layout jumps for ads of different sizes.
Although the reduced eligible sizes do impact ad sales, the better viewability offsets this easily.

Historical data and A/B tests helped Netzwelt find the right size
and positioning for different devices and screen sizes,
and CSS media rules used to reserve space.

**Ads below the fold** offer room for significant improvement:

* A banner that is not seen but loaded creates poor ad viewability and worsens the page experience.
* A banner that is loaded at the time a user scrolls over it can introduce additional content jumps.

To maintain a good page experience and high ad viewability,
Netzwelt implemented lazy-loading and reserved space for the size of the lowest common denominator.
In a multisize zone the banners requested in the sizes 300x250 to 300x600, reserved 250px in height.
This eliminated layout shifts for the smaller sizes; and reduced them massively for larger banners.
This approach is not optimal, but it is a start and a good compromise.

To optimize further,
Netzwelt used
[Intersection Observer](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) and the
[Network Information API](https://developer.mozilla.org/docs/Web/API/Network_Information_API)
to control ad placements and reduce layout shifts.
Different ad positions and lazy loading strategies are used depending on
scroll position and network connection quality,
and ads may be changed from multiple to fixed sizes.
The aim of the algorithm is always to maximize ad viewability while minimizing layout shifts.
Browsers not supporting the NetworkInfo API use a proxy value based on a
combination of device and IP derived network type.
This
[adaptive loading](https://addyosmani.com/blog/adaptive-loading/)
strategy especially reduces CLS for users with slow internet connections.

### Optimizing FID

First Input Delay might appear to be a problem for news publishers,
as advertisement often comes with many additional JavaScript libraries.
And there does seem to be a negative impact when looking at lab data like Lighthouse.
However, looking at field data in the
[2020 Web Almanac](https://almanac.httparchive.org/en/2020/performance#fid-by-device),
many websites have sufficiently fast response.
Part of this is due to advertising JavaScript loading late (after first input),
caching well (for example getting the treatment of
[v8 code caching](https://v8.dev/blog/code-caching-for-devs)),
or being optimized well by the ad vendors.
Vendor viewability trackers make sure to avoid
long tasks—so even when the sum of the runtime is long
[Total Blocking Time](/tbt/) (TBT) and FID are not affected.
While FID was not a huge problem for Netzwelt, there were still some optimizations to make:

* Reducing ad scripts and providers, concentrating on a single stack if possible.
* Loading all scripts with defer or async.
* Using webpack or similar technologies for treeshaking and unbundling.
* Using simple BEM-like CSS rules.
* Avoiding long-running tasks, and using the
[idle-until-urgent](https://philipwalton.com/articles/idle-until-urgent/) pattern.
* Working with
[RequestAnimationFrame](https://developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution#use_requestanimationframe_for_visual_changes)
wherever layout is affected.

### Optimizing LCP

The Largest Contentful Paint can be influenced by advertisements in
two ways—explicitly by recognizing an ad as the largest paint,
and indirectly by congesting network bandwidth or affecting critical path so that the actual largest paint
(for example a hero image) can't load in fast enough.

Netzwelt had already removed medium rectangle ads from the top ad slots while optimizing for CLS.
This had the additional benefit of ads not becoming the largest element.

Netzwelt follows a strict policy to prioritize content above ads.
Netzwelt prioritized the hero images and fonts used above the fold
and optimized the critical path to take precedence over advertising scripts and adverts.
This prioritization helped LCP to be unaffected by the ads.

Besides these optimizations, Netzwelt followed other best practices:

* Separated CSS for critical rendering path and put it in the header.
* Preloaded the most important fonts, scripts, and images.
* Avoided lazy-loading images above the fold.
* Used `font-display="swap"`.

## GDPR Consent and Core Web Vitals

Consent dialogs often negatively impact Core Web Vitals.
As with advertisements, there are two ways in which a consent dialog can influence CWV:

* Explicitly if it is detected as the largest paint, or causes layout shifts.
* Implicitly, by stealing bandwidth from the actual largest paint,
blocking the critical path to the largest paint,
or delaying ads until consent is in, which can, in turn, trigger layout shifts.

Netzwelt works with a third-party consent provider,
which also implemented optimizations.
First Netzwelt made sure to avoid the straightforward pitfalls:

* Consent scripts are loaded async, so as not to block critical resources.
* Consent is formatted so that large elements are not eligible as the largest element within LCP.
* Consent overlay uses `position: fixed` to avoid shifts.
* While ads are shown only after consent is given,
adequate whitespace is preserved beforehand to avoid layout shifts when ads load in.
* Making sure the display and positioning of the consent dialog does not trigger layout shifts.
One problem found and fixed here was the scroll-lock option of the service provider,
which disabled scrolling while consent shows by moving the main content of the article on scroll,
causing layout shifts.

After this work, there were still large discrepancies between field and lab CLS.
While lab CLS was close to zero, field values were significantly above thresholds.
After investigation, the culprit was layout shifts within the consent iframe,
which currently are only correctly captured in field data.
Netzwelt continues to work with the third-party consent provider to improve this issue.

### News Subscription Models and Core Web Vitals

News publishers are moving to subscription models to fund journalism.
This model is relevant for Core Web Vitals as people will not subscribe to websites with poor user experience.
In addition, subscribers do not expect to see ads in the paid content,
but hiding ads may cause layout shifts.
The website needs to check if users are entitled to view the content and whether to display ads.
These checks may cause additional latencies, leading to content shifts or a poor user experience.

Netzwelt is using a model where content is always free,
but subscribers will not see ads.
They investigated different ways to query and store entitlements to reduce latencies and layout shifts.

An initial query of entitlement always caused latencies,
and therefore if querying the entitlements takes too long, the site will display the last cached state.
For new subscribers, this means a small risk of a paying user seeing ads once.
Users just ending a subscription might see one load without ads before the locally stored entitlements update.
Once entitlements are known, they are stored locally using the LocalStorage API,
to avoid additional latencies and layout shifts during future navigation.

## Optimization Results

The results of Netzwelt's optimizations speak for themselves.
Their PageSpeed Insights score is unrivaled within news publishers worldwide:

<figure class="w-figure w-screenshot">
{% Img
src="image/ZDZVuXt6QqfXtxkpXcPGfnygYjd2/ErZNqWVYCAkOmEu1r7pd.png",
alt="Screenshot of PageSpeed Insights for the Netzwelt.de site, showing a score of 100.",
width="800", height="622" %}
</figure>

The optimizations improved the page experience
but were made with the business in mind and enhanced ad experience,
ad viewability, and revenue.
After relaunching the optimized page,
Netzwelt saw CPM increases of 20-30%,
with an ad viewability above 75%.
However, Netzwelt assumes the overall revenue uplift to be even higher.
Traffic increased since the relaunch, probably driven by higher user engagement
and lower bounce rates due to improved UX.
These effects are hard to quantify and set in causal relation to the relaunch,
as traffic naturally fluctuates, and there are also effects from the global pandemic.
These indirect effects are one of the reasons why Netzwelt always looks at all numbers when reviewing their site,
not just CPM, which may be misleading. Core Web Vitals and UX metrics,
in combination with all ad-related metrics, provide the real picture.

## Looking into the future

Netzwelt believes that in a future without third-party cookies, contextual targeting via the content,
combined with good UX and page experience (including ad viewability), is the key to success as a news publisher.

Therefore Netzwelt doesn't stop with Core Web Vitals
but goes the extra mile by implementing many modern web capabilities such as Progressive Web Apps (PWA),
offline content, dark mode, the Web Share API, and Trusted Web Activities (TWA) using the new
[Digital Goods API](https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing/).
