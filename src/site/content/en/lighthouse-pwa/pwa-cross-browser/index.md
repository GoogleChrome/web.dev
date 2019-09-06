---
layout: post
title: Site works cross-browser
description: |
  Learn about `pwa-cross-browser` audit.
date: 2019-05-02
web_lighthouse:
  - pwa-cross-browser
---

To reach the most number of users, sites should work across every major browser.
Test your site in Chrome, Edge, Firefox and Safari;
fix issues that occur when running the app cross-browser.

## Recommendations

Consider using Workbox to manage site's offline reliability.
Workbox is high-level service worker toolkit built on top
Workbox is developed against a cross-browser test suite, and when possible,
automatically falls back to alternative implementations
of features that are missing from certain browsers.

- The [`workbox-broadcast-cache-update`](https://developers.google.com/web/tools/workbox/modules/workbox-broadcast-cache-update) module uses the [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) when available, and falls back to a [`postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) implementation on browsers that lack support.
- The [`workbox-background-sync`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
module uses the [Background Sync API](https://developers.google.com/web/tools/workbox/modules/workbox-background-sync) if possible, and if not, falls back to retrying queued events each time the service worker starts up.

Learn more in [Workbox your high-level service worker toolkit](/workbox).

{% include 'content/lighthouse-pwa/scoring.njk' %}

## More information

[Site doesn't work cross-browser audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/manual/pwa-cross-browser.js)