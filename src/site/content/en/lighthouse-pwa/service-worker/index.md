---
layout: post
title: "Does not register a service worker that controls page and `start_url`"
description: |
  Learn how to register a service worker that supports Progressive Web App
  features like offline functionality, push notifications, and installability.
web_lighthouse:
  - service-worker
date: 2019-05-04
updated: 2020-06-10
---

Registering a [service worker](/service-workers-cache-storage/)
is the first step towards enabling key [Progressive Web App (PWA)](/discover-installable) features:

- Works offline
- Supports push notifications
- Can be installed to the device

Learn more in the [Service workers and the Cache Storage API](/service-workers-cache-storage/) post.

## Browser compatibility

All major browsers except Internet Explorer support service workers. See
[Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker#Browser_compatibility).

## How the Lighthouse service worker audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that don't register a service worker:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URqaGD5akD2LNczr0jjQ.png", alt="Lighthouse audit showing site doesn't register a service worker", width="800", height="95", class="w-screenshot" %}
</figure>

Lighthouse checks if the [Chrome Remote Debugging Protocol](https://github.com/ChromeDevTools/devtools-protocol)
returns a service worker version. If it doesn't, the audit fails.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to register a service worker

{% include 'content/reliable/workbox.njk' %}

Registering a service worker involves only a few lines of code,
but the only reason you'd use a service worker
is to make it possible to implement one of the PWA features outlined above.
Actually implementing those features requires more work:

- To learn how to cache files for offline use, see the
[What is network reliability and how do you measure it?](/network-connections-unreliable) post.
- To learn how to make your app installable, see the [Make it installable](/codelab-make-installable/) codelab.
- To learn how to enable push notifications, see Google's
  [Adding Push Notifications to a Web App](https://codelabs.developers.google.com/codelabs/push-notifications).

## Resources

- [Source code for **Does not register a service worker that controls page and `start_url`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/service-worker.js)
- [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers)
- [Service workers and the Cache Storage API](/service-workers-cache-storage/)
- [What is network reliability and how do you measure it?](/network-connections-unreliable)
- [Make it installable](/codelab-make-installable/)
- [Adding Push Notifications to a Web App](https://codelabs.developers.google.com/codelabs/push-notifications)
