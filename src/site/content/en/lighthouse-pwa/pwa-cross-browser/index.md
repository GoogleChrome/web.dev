---
layout: post
title: Site works cross-browser
description: |
  Learn how to use Workbox to make sure your web page works across browsers.
web_lighthouse:
  - pwa-cross-browser
date: 2019-05-04
updated: 2019-09-19
---

To reach the most users, sites should work on every major browser.

## Recommendations

Test your site in Chrome, Edge, Firefox, and Safari, and
fix any issues that appear in each browser.

If your page is a [Progressive Web App](/discover-installable),
consider using [Workbox](https://developers.google.com/web/tools/workbox),
a high-level [service worker](/service-workers-cache-storage) toolkit.
Workbox is developed against a cross-browser test suite, and when possible,
automatically falls back to alternative implementations
of features that are missing from certain browsers:

- The [`workbox-broadcast-cache-update`](https://developers.google.com/web/tools/workbox/modules/workbox-broadcast-cache-update)
  module uses the [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
  if possible and falls back to a
  [`postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
  implementation.
- The [`workbox-background-sync`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
  module uses the [Background Sync API](https://developers.google.com/web/tools/workbox/modules/workbox-background-sync)
  if possible and falls back to retrying queued events
  each time the service worker starts up.

Learn more in [Workbox: your high-level service worker toolkit](/workbox).

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Resources

[Source code for **Site works cross-browser** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/manual/pwa-cross-browser.js)
