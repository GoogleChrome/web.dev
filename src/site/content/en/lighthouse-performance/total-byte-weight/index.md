---
layout: post
title: Avoid enormous network payloads
description: |
  Learn how to improve your web page's load time by reducing the total file
  size of resources you serve to your users.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - total-byte-weight
---

Large network payloads cost users real money and are highly correlated with long load times.

## How the Lighthouse network payload audit fails

Lighthouse shows the total size in kilobytes of all resources
requested by your page. The largest requests are presented first:

<figure class="w-figure">
  <img class="w-screenshot" src="total-byte-weight.png" alt="A screenshot of the Lighthouse Avoid enormous network payloads audit">
</figure>

The audit fails when your network payload exceeds 5,000&nbsp;KB.

## How network payload affects performance and costs

An average network payload is between 4,000 and 5,000&nbsp;KB.
See [Highest Correlation To Load Time](https://httparchive.org/reports/state-of-the-web?start=latest#onLoad)
to view the correlation between requests and load time.

Reducing the total size of network requests speeds up page load time and
saves your users money that they would have spent on cellular data.
See [What Does My Site Cost](https://whatdoesmysitecost.com/)
to calculate the cost of viewing your site around the world.
You can adjust the results to factor in purchasing power.

## How to reduce payload size

Aim for total byte size to stay 1,600&nbsp;KB;
The 1,600&nbsp;KB target is based on
what a page can theoretically download on a 3G connection
while still achieving a [Time to Interactive](/interactive) of 10&nbsp;seconds or less.
See [googlechrome/lighthouse/pull/1759](https://github.com/GoogleChrome/lighthouse/pull/1759).

- Defer requests until they're needed.
  See [The PRPL Pattern](/apply-instant-loading-with-prpl) for one possible approach.
- Optimize requests to be as small as possible. Possible techniques include:
  - [Minify and compress network payloads](/reduce-network-payloads-using-text-compression).
  - [Use WebP instead of JPEG or PNG](/serve-images-webp).
  - [Set the compression level of JPEG images to 85](/use-imagemin-to-compress-images).
- Cache requests so that the page doesn't re-download the resources
  on repeat visits. (See [The options in your caching toolbox](/reliable#the-options-in-your-caching-toolbox).)

## Resources

[Source code for **Avoid enormous network payloads** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/total-byte-weight.js)
