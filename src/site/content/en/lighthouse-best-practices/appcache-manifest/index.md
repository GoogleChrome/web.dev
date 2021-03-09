---
layout: post
title: Uses Application Cache
description: |
  Learn how to migrate your web page from the deprecated Application Cache to
  the Cache API.
date: 2019-05-02
web_lighthouse:
  - appcache-manifest
updated: 2019-08-28
---

The Application Cache, also known as AppCache,
is [deprecated](https://html.spec.whatwg.org/multipage/browsers.html#offline).

## How the Lighthouse Application Cache audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages that use the Application Cache:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zOiY51J8avDQU8IkL2XG.png", alt="Lighthouse audit showing that a page uses the Application Cache", width="800", height="74", class="w-screenshot" %}
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
remove the manifest from your page,
and use the
[Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
via a [service worker](https://developers.google.com/web/fundamentals/primers/service-workers/)
instead.

To migrate from the Application Cache to service workers,
consider using the
[sw-appcache-behavior library](https://github.com/GoogleChrome/sw-appcache-behavior).
This library generates a service-worker-based implementation of the behavior
defined in an Application Cache manifest.

See the [Current page does not respond with a 200 when offline](/works-offline) post
for more information about using service workers to make your site work
offline.

## Resources

- [Source code for **Uses Application Cache** audit](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/appcache-manifest.js)
- MDN's [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) page
- [Current page does not respond with a 200 when offline](/works-offline)
