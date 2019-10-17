---
layout: post
title: Current page does not respond with a 200 when offline
description: |
  Learn how to make your Progressive Web App work offline.
web_lighthouse:
  - works-offline
date: 2019-05-04
updated: 2019-09-19
codelabs:
  - codelab-service-workers
---

[Progressive Web Apps (PWAs)](/discover-installable) must work offline.
To determine whether a page is accessible while the user is offline,
Lighthouse checks that the page sends an [HTTP&nbsp;200 response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Successful_responses),
which indicates that the request for the page was successful.

Learn more in the [What is network reliability and how do you measure it?](/network-connections-unreliable/) post.

## How the Lighthouse offline audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that don't respond with a 200 when offline:

<figure class="w-figure">
  <img class="w-screenshot" src="works-offline.png" alt="Lighthouse audit showing page doesn't respond with a 200 when offline">
</figure>

Lighthouse emulates an offline connection using the [Chrome Remote Debugging Protocol](https://github.com/ChromeDevTools/devtools-protocol)
and then attempts to retrieve the page using [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to make your PWA work offline

1. Add a [service worker](https://developers.google.com/web/fundamentals/primers/service-workers) to your app.
2. Use the service worker to cache files locally.
3. When offline, use the service worker as a network proxy to return the
   locally cached version of the file.

{% Aside 'codelab' %}
Learn how to add a service worker to your app
with the [Working with service workers](/codelab-service-workers) codelab.
{% endAside %}

## Resources

- [Source code for **Current page does not respond with a 200 when offline** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/works-offline.js)
- [What is network reliability and how do you measure it?](/network-connections-unreliable/)
- [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers)
