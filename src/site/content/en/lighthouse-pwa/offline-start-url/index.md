---
layout: post
title: start_url does not respond with a 200 when offline
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

If Lighthouse does not receive an HTTP 200
response when accessing a page from the `start_url`,
then either the `start_url` isn't correct,
or the page isn't accessible offline
(see also [What is network reliability and how do you measure it?](/network-connections-unreliable/)).

## How this Lighthouse audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags web apps whose start URL doesn't respond with a 200 when offline:

<figure class="w-figure">
  <img class="w-screenshot" src="offline-start-url.png" alt="Lighthouse audit showing start URL doesn't respond with 200 when offline">
</figure>

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to ensure your page is available offline

1. If you don't already have one, [add a web app manifest](/add-manifest/).
1. Check that the `start_url` in your manifest is correct.
1. Add a service worker to your app.
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
