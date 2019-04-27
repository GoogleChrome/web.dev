---
layout: post
title: Avoids application cache
description: |
  Learn about appcache-manifest audit.
author: kaycebasques
web_lighthouse:
  - appcache-manifest
---

Application Cache, also known as AppCache, is [deprecated](https://html.spec.whatwg.org/multipage/browsers.html#offline).

## Recommendations

Consider using the service worker [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) instead.

To help migrate from AppCache to service workers, consider the
[sw-appcache-behavior](https://github.com/GoogleChrome/sw-appcache-behavior) library. This library generates a
service-worker-based implementation of the behavior defined in an AppCache
manifest.

See the [URL Responds With a 200 When Offline](works-offline) audit
reference for more resources on using service workers to make your site work
offline.

## More information

The audit passes if no AppCache manifest is detected.

[Audit source](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/appcache-manifest.js)