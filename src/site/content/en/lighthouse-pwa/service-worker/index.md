---
layout: post
title: Does not register a service worker that controls page and start_url
description: |
  Learn how to register a service worker that supports Progressive Web App
  features like offline functionality, push notifications, and installability.
web_lighthouse:
  - service-worker
date: 2019-05-04
updated: 2019-09-19
---

Registering a service worker is the first step towards enabling the following
progressive web app features:

- Offline
- Push notifications
- Add to home screen

Learn more in [Service workers and the Cache Storage API](/service-workers-cache-storage/).

## How the Lighthouse service worker audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that don't register a service worker:

<figure class="w-figure">
  <img class="w-screenshot" src="service-worker.png" alt="Lighthouse audit showing site doesn't register a service worker">
</figure>

Lighthouse checks if the [Chrome Remote Debugging Protocol](https://github.com/ChromeDevTools/devtools-protocol)
returns a service worker version. If it doesn't, the audit fails.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to register a service worker

Registering a service worker involves only a few lines of code, but the only
reason you'd use a service worker is to implement one of the progressive
web app features outlined above.
Implementing those features requires more work.
For more help on caching files for offline use, see
[What is network reliability and how do you measure it?](/network-connections-unreliable).

For enabling push notifications or "add to homescreen", complete the
following step-by-step tutorials and then use what you learn to implement
the features in your own app:

- [Make it installable](/codelab-make-installable/).
- [Enable push notifications for your web app](https://codelabs.developers.google.com/codelabs/push-notifications).

## Resources

[Source code for **Does not register a service worker that controls page and `start_url`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/service-worker.js)
