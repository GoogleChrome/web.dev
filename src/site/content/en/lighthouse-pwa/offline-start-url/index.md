---
layout: post
title: "`start_url` does not respond with a 200 when offline"
description: |
  Learn how to configure your Progressive Web App's start_url so your app is
  accessible offline.
web_lighthouse:
  - offline-start-url
codelabs:
  - codelab-service-workers
date: 2019-05-04
updated: 2019-09-19
---

The [manifest](/add-manifest) for a [Progressive Web App (PWA)](/discover-installable) should include a `start_url`,
which indicates the URL to be loaded when the user launches the app.

If the browser doesn't receive an
[HTTP&nbsp;200 response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Successful_responses)
when accessing an app from the `start_url`,
either the `start_url` isn't correct, or the page isn't accessible offline.
This causes problems for users who have installed the app to their devices.

Learn more in the [What is network reliability and how do you measure it?](/network-connections-unreliable/) post.

## How the Lighthouse `start_url` audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags web apps whose start URL doesn't respond with a 200 when offline:

<figure class="w-figure">
  <img class="w-screenshot" src="offline-start-url.png" alt="Lighthouse audit showing start URL doesn't respond with 200 when offline">
</figure>

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to ensure your page is available offline

1. If you don't already have one, [add a web app manifest](/add-manifest/).
1. Check that the `start_url` in your manifest is correct.
1. [Add a service worker](https://developers.google.com/web/fundamentals/primers/service-workers) to your app.
1. Use the service worker to cache files locally.
1. When offline, use the service worker as a network proxy to return the locally cached version of the file.

{% Aside 'codelab' %}
Learn how to add a service worker to your app
with the [Working with service workers](/codelab-service-workers) codelab.
{% endAside %}

See the [Current page does not respond with a 200 when offline](/works-offline)
post for more information.

## Resources

- [Source code for **`start_url` does not respond with a 200 when offline** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/offline-start-url.js)
- [What is network reliability and how do you measure it?](/network-connections-unreliable/)
- [Add a web app manifest](/add-manifest/)
