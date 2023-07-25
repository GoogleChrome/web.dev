---
layout: post
title: How Back/forward Cache Helped Yahoo! JAPAN News Increase Revenue by 9% on Mobile
subhead: |
  Instant page loading by Back/forward Cache provides users with seamless experience
description: |
  Yahoo! JAPAN News, one of the most popular news platforms in Japan, drove a concerted effort to improve their bfcache hit rate and saw significant user experience and business improvements as a result. Specifically, the results of the A/B test they conducted showed that pages that use bfcache had a 9% increase in ads revenue.
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/iyoxhI76AJ7l8sH6OtUe.png
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/stTQH6TS9oLBON1LvoKG.png
alt: A hero image displaying the Yahoo JAPAN News logo at left. At right is a comparison of two filmstrips showing the benefits of bfcache (page loads in 0.3 seconds) versus without (page loads in 3.3 seconds).
authors:
  - yurikohirota
date: 2023-07-25
tags:
  - blog
  - performance
  - case-study
---

{% Blockquote 'web.dev article on bfcache ' %}
[Back/forward cache](/bfcache/) (or bfcache) is a browser optimization that enables instant back and forward navigation. It significantly improves the browsing experience for users, especially for websites that involve many back and forth navigations.
{% endBlockquote %}

Yahoo! JAPAN News, one of the most popular news platforms in Japan, drove a concerted effort to improve their bfcache hit rate and saw significant user experience and business improvements as a result. Specifically, the results of the A/B test they conducted showed that pages that use bfcache had a **9% increase in ads revenue**.

This case study will explain how Yahoo! JAPAN News removed the blockers for bfcache, and how bfcache drastically improved the user experience.

## Removing blockers for bfcache

bfcache has been available since Chrome 86, and is also available on all modern browsers. However, taking full advantage of bfcache requires removing potential blockers on one's website. Some major blockers that Yahoo! JAPAN News faced were:

1. Use of `unload` handlers
2. Use of the [`no-store` directive](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#no-store) on `Cache-control` headers

You can check what major blockers there are for your website by going to **Chrome Dev Tools > Applications > Back/forward Cache** ([more details](/bfcache/#test-to-ensure-your-pages-are-cacheable)), or by using the [`notRestoredReasons` API](https://developer.chrome.com/docs/web-platform/bfcache-notrestoredreasons/) to get a more comprehensive view of blockers based on actual usage in the field.

Here's how Yahoo! JAPAN News has removed their blockers:

- **Unload Handlers:** Use the `pagehide` event instead of `unload` event, as the `unload` event is [very unreliable](/bfcache/#never-use-the-unload-event). Also, `permission-policy: unload` was [launched in Chrome 115](https://chromestatus.com/feature/5579556305502208) so that the websites can reliably remove `unload` handlers for specific origins. Chrome is also planning to [gradually deprecate `unload` handlers](https://github.com/fergald/docs/blob/master/explainers/permissions-policy-deprecate-unload.md#logistics-of-deprecation).
- **`Cache-control: no-store`** (or CCNS for short): Changing the `Cache-control` header from **`no-store`** to **`no-cache`** can enable bfcache. Chrome is also planning to start [caching for bfcache even with a `no-store` header in certain circumstances](https://chromestatus.com/feature/6705326844805120).

CCNS is intended for pages that should never be cached under any circumstances. This comes with the caveat that any page with CCNS will not be able to benefit from any caching technology, including CDN edge servers and local caches.

If you have a CCNS header, this is a great opportunity to discuss what the right `Cache-control` strategies are for your website. Here are the main differences between `no-store` and `no-cache`.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th><code>Cache-control: <strong>no-store</strong></code></th>
        <th><code>Cache-control: <strong>no-cache</strong></code></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <ul>
            <li>The response is not allowed to be stored in caches.</li>
            <li>Consequently, the response is fetched in full on every request.</li>
            <li>This should be used for private responses.</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>The response is allowed to be stored in caches as long as it's revalidated with the server before each use.</li>
            <li>This should be public responses you want revalidated every time (for example, the home page of a news website - though even then a very short caching time can improve performance and offload work from the main servers).</li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>

If you are interested in learning more about `Cache-control` options, [this flowchart](/http-cache/?hl=en#flowchart) is a great help.

## Impact of bfcache in numbers

To measure the impact of bfcache, Yahoo! JAPAN News conducted an A/B test for 2 weeks, where they served a version of their pages with their bfcache fixes to one group, and a version with pages ineligible for bfcache to another. They picked the URL paths with a significant amount of traffic so that the test could achieve meaningful results. There were no other visual or functional difference between the 2 versions.

Here's a video comparing the website with bfcache and without bfcache. You can see that the website with bfcache enabled loads significantly faster during a back or forward navigation.

<style>
  .bfcache-video video {
    height: auto;
  }
</style>
<figure class="bfcache-video">
  {% Video src="video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/2qqiTs9XuedWvtjfKuMu.mp4", controls="true", autoplay="true", loop="true", width="800", height="800", muted="true" %}
</figure>

What's really promising is that the group with bfcache enabled had a **significant increase in page views and ads revenue**, especially on mobile devices.

Here are details about the impact observed by Yahoo! JAPAN News with their bfcache A/B test. (Further information can be found in [their case study article](https://techblog.yahoo.co.jp/entry/2023072430429932/)).

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <td>
        <strong>Metrics</strong>
      </td>
      <td>
        <strong>Uplift % (mobile)</strong>
      </td>
      <td>
        <strong>Uplift % (desktop)</strong>
      </td>
    </thead>
    <tbody>
      <tr>
        <td>bfcache hit rate</td>
        <td>
          <strong>+54.03 points</strong> (0.04% → 54.07%)
        </td>
        <td>+47.28 points (0.02% → 47.30%)</td>
      </tr>
      <tr>
        <td>Page views</td>
        <td>
          <strong>+2.26%</strong>
        </td>
        <td>+0.65%</td>
      </tr>
      <tr>
        <td>Ads revenue</td>
        <td>
          <strong>+9.0%</strong>
        </td>
        <td>+0.6%</td>
      </tr>
    </tbody>
  </table>
</div>

When back/forward navigations between pages become instantaneous with bfcache, users tend to stay on pages longer, thus increasing ad views, leading to an increase of ad revenue.

## bfcache enhances seamless user experience on the website

When pages load instantly, **navigations feel more seamless.**

In Yahoo! JAPAN News, one of the major user journey is as follows:

1. Go to the article list
2. Click on one article to read
3. Go back to the article list
4. Click on another article to read

Before bfcache, when users finished reading an article (step 2), they had to wait for the article list page to load again. This could be a friction factor for users who just want to go back to the article list to pick out another article to read.

Another source of friction during backward navigation was the scroll position. In practice, the browser tries to restore the scroll position when a backward navigation happens. However, because of dynamically-added ads or other layout changes, the scroll position often gets incorrectly restored, which could cause users to lose their bearings or even leave the page. This is never an issue when a backward navigation is powered by bfcache: the scroll position is immediately and correctly restored.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/WlJn1GZnDrSLpEPPHWAn.png", alt="Two filmstrips of a backward navigation from an article to the article listing page. The top is a filmstrip of the process being handled with bfcache which takes 0.3 seconds, whereas the bottom is of the same process being handled without bfcache, which takes 3.3 seconds.", width="800", height="343" %}
</figure>

Now with bfcache, the friction in the user journey is gone—users can instantly navigate back to the article list page and pick another article to read without having to wait for the article list page to load.

The same thing happens when users browse from one article directly to another and back:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/pk7QmKzBA49ADdcJGE7q.gif", alt="An animated image showing the backward navigation flow from an article to the article listing page with and without bfcache. With bfcache, the backward navigation is not only faster, but the scroll position is accurately maintained. Without bfcache, these guarantees cannot be made.", width="800", height="450" %}
</figure>

In a nutshell, the benefits of using bfcache for Yahoo! JAPAN News includes:

- Increased pageviews: Users were more likely to navigate within the website when pages were cached with bfcache.
- Increased revenue: As a result of increased pageviews per session, ads impression increased, which resulted in a 9% increase in revenue on mobile compared with the test group without bfcache.

## Conclusion

In short, bfcache not only makes your website instant, but can also reduce friction in overall user experience and increase engagement within your website.

The Chrome team is continually looking at bfcache blockers—especially the two reasons listed in this article as they are common reasons bfcache is not used. In the future, these may not prevent bfcache usage, but there's no need to wait until then. You can benefit from bfcache by looking at your bfcache blockers and avoiding these common, and other less common, patterns.
