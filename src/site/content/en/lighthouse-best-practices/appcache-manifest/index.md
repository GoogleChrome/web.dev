---
layout: post
title: Uses Application Cache
description: |
  Learn how to migrate your web page from the deprecated Application Cache to
  the Cache API.
web_lighthouse:
  - appcache-manifest
updated: 2019-08-28
---

The Application Cache, also known as AppCache,
is [deprecated](https://html.spec.whatwg.org/multipage/browsers.html#offline).

## How the Lighthouse Application Cache audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages that use the Application Cache:

<figure class="w-figure">
  <img class="w-screenshot" src="appcache-manifest.png" alt="Lighthouse audit showing document uses the Application Cache">
</figure>

This audit fails when Lighthouse finds a reference to
the Application Cache manifest in a page's `<html>` tag.
For example, this markup causes the audit to fail:

```html
<html manifest="example.appcache">
  ...
</html>
```

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Use the Cache API instead of the Application Cache

To pass this audit,
remove the manifest from your document,
and use the
[service worker Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) instead.

To help migrate from the Application Cache to service workers,
consider using the
[sw-appcache-behavior library](https://github.com/GoogleChrome/sw-appcache-behavior).
This library generates a service-worker-based implementation of the behavior
defined in an Application Cache manifest.

See the [URL Responds With a 200 When Offline](/works-offline) audit
reference for more resources on using service workers to make your site work
offline.

## Resources

[Source code for **Uses Application Cache** audit](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/appcache-manifest.js)
