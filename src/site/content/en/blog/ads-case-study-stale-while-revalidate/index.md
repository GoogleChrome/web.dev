---
title: How Google improved ads performance with stale-while-revalidate
subhead: |
    Find out how loading third-party resources faster can increase revenue.
date: 2020-03-05
authors:
  - thebengeu
  - jimper
hero: image/admin/CYbrrEv8KBJtPHCvLV4Y.jpg
thumbnail: image/admin/KriMXq0cv6h8IhzVjyst.jpg
alt: Dew on a thin leaf in macro
description: |
    This case study explains how Google increased key ads business metrics by
    optimizing the performance of their third-party ads script with stale-while-revalidate.
tags:
  - blog
  - case-study
  - performance
  - ads
---

This case study highlights how improving the performance of third-party resources can boost business metrics. While a [previous study](/fast-ads-matter/#fast-ads-make-you-more-money) measured the cost of added ads latency, this study demonstrates the value of a real-world performance improvement:

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">0.5<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Revenue lift for publishers</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">2<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Increase in early ad script loads</p>
  </div>
</div>

Source: Google Internal Data, June to July 2019.

## Background

The [Google Publisher Tag (GPT)](https://support.google.com/admanager/answer/181073) is the ad tagging script for Google Ad Manager that requests and renders display ads on the web. By implementing a simple [`stale-while-revalidate`](/stale-while-revalidate/) HTTP header for GPT, the GPT team was able to improve the speed and performance of Google display ads for its publisher partners. This same technique can be applied to any other scenario where loading scripts as quickly as possible is more important than loading the freshest code.

## The problem

GPT is deployed as a bootstrapping script, `gpt.js`, which is given a short time to live (TTL) of 15 minutes. This short TTL allows the script to be updated or rolled back quickly. Once loaded, `gpt.js` requests and loads additional implementation scripts, which have a longer TTL.

Once the 15 minute TTL expires, the version of `gpt.js` in cache goes stale and needs to be revalidated. Previously, this revalidation process involved making a synchronous network request to fetch a fresh copy of the script, adding latency to the first ad request.

## The solution

The [`stale-while-revalidate`](https://tools.ietf.org/html/rfc5861#section-3) attribute is used by the `Cache-Control` header and defines an extra window of time during which a cache can use a stale asset while the asset is revalidated asynchronously. This helps developers balance between immediacy—*loading cached content right away*—and
freshness—*ensuring updates to the cached content are used in the future*.

## Google display ads case study

The GPT team added this `Cache-Control` header in the `gpt.js` HTTP response in 2016, in anticipation of browsers implementing `stale-while-revalidate`:

```text
cache-control: private, max-age=900, stale-while-revalidate=3600
```

This setting means that if `gpt.js` is requested between 15 and 60 minutes after the previous cached value, then the cached value will be used to fulfill the request even though it's stale. At the same time, a revalidation request will be made in the background to populate the cache with a fresh value for future use.

Chrome rolled out `stale-while-revalidate` in version 75 to 99% of all traffic, leaving 1% of traffic with the feature disabled temporarily to measure its impact. The GPT team logged metrics from this 1% (the experimental group) as well as a 1% sample of traffic with the feature enabled (the control group), to test the effectiveness of `stale-while-revalidate` for ad scripts. Over the course of 2 weeks of metrics logged from a sample size of 5.2 billion Google display ad impressions, the control group observed:

- 0.3% increase in ad impressions.
- 0.5% increase in revenue.
- 2% increase in early ad script loads (<500ms from the start of page load).
- 1.1% increase in successful ad script loads overall.

<figure class="w-figure">
  {% Img src="image/admin/ZRKz2IHKdGNTDM3WdsvX.svg", alt="Percentage point change in number of ad script loads vs. Time from page load start to ad script load (ms)", width="800", height="600" %}
  <figcaption class="w-figcaption">Source: Google Internal Data, June to July 2019.</figcaption>
</figure>

As shown in the chart above, the results of this experiment can be attributed to an increase in successful ad script loads, with a majority occurring early in the page load process.

## Implementing stale-while-revalidate on your site

The GPT team has seen that making a relatively simple change to HTTP headers with `stale-while-revalidate` can improve speed and boost business metrics. Check out the [Keeping things fresh with stale-while-revalidate](/stale-while-revalidate) post for more on implementing `stale-while-revalidate` on your own site.

Photo by [Kahica](https://unsplash.com/@kahika) on [Unsplash](https://unsplash.com/photos/XSSibD1bt80)
