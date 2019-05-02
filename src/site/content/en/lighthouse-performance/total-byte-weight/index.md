---
layout: post
title: Avoid enormous network payloads
description: |
  Learn about the total-byte-weight audit.
web_lighthouse:
  - font display
---

Large network payloads cost users real money and are highly correlated with long load times.
Lighthouse reports the total byte size in killobytes of all network resources
in the Diagnostics section: 

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="total-byte-weight.png" alt="Lighthouse: Avoid enormous network payloads">
  <figcaption class="w-figcaption">
    Fig. 1 — Avoid enormous network payloads
  </figcaption>
</figure>


## Understand how network payload affects performance and costs

Lighthouse sums up the total byte size of all resources that the page requested.
Click View Details to see your page's requests.
The largest requests are presented first. 


Aim for total byte size to stay 1600 KB;
The target score of 1600KB is based on what a page can theoretically download on a 3G connection,
while still achieving a time-to-interactive of 10 seconds or less.
See [googlechrome/lighthouse/pull/1759](https://github.com/GoogleChrome/lighthouse/pull/1759).

An average network payload is between 4000 and 5000 KB.
The audit fails, once your network payload exceeds 5000 KB.
See [Highest Correlation To Load Time](https://httparchive.org/reports/state-of-the-web?start=latest#onLoad)
to view the correlation between requests and load time.

Reducing the total size of network requests speeds up page load time and
saves your users money that they would have spent on cellular data.
See [What Does My Site Cost](https://whatdoesmysitecost.com/) to calculate the cost of viewing your site around the world.
You can adjust the results to factor in purchasing power.

## Strategies for reducing payload size

Here are some strategies for reducing payload size:

- Defer requests until they're needed. See [The PRPL Pattern](/apply-instant-loading-with-prpl) for one possible approach.
- Optimize requests to be as small as possible. Possible techniques include:
  - [Minify and compress network payloads](/reduce-network-payloads-using-text-compression).
  - [Use WebP instead of JPEG or PNG](/serve-images-webp).
  - [Set the compression level of JPEG images to 85](/use-imagemin-to-compress-images).
- Cache requests so that the page doesn't re-download the resources on repeat visits (see [The options in your caching toolbox](/reliable#the-options-in-your-caching-toolbox)).

## More information

- [Avoid enormous network payloads audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/total-byte-weight.js)