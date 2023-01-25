---
layout: post
title: "`start_url` does not respond with a 200 when offline"
description: |
  Learn how to configure your Progressive Web App's start_url so your app is
  accessible offline.
web_lighthouse:
  - offline-start-url
date: 2019-05-04
updated: 2020-04-29
---

The [manifest](/add-manifest) for a [Progressive Web App](/what-are-pwas/) (PWA) should include a `start_url`,
which indicates the URL to be loaded when the user launches the app.

If the browser doesn't receive an
[HTTP&nbsp;200 response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#Successful_responses)
when accessing an app from the `start_url`,
either the `start_url` isn't correct, or the page isn't accessible offline.
This causes problems for users who have installed the app to their devices.

## How the Lighthouse `start_url` audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags web apps whose start URL doesn't respond with a 200 when offline:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZR8gYzKNpBkrXEgQQnbl.png", alt="Lighthouse audit showing start URL doesn't respond with 200 when offline", width="800", height="76", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to ensure your page is available offline

{% include 'content/reliable/workbox.njk' %}

1. If you don't already have one, [add a web app manifest](/add-manifest/).
1. Check that the `start_url` in your manifest is correct.
1. Add a service worker to your app.
1. Use the service worker to cache files locally.
1. When offline, use the service worker as a network proxy to return the locally cached version of the file.

See the [Current page does not respond with a 200 when offline](/works-offline)
guide for more information.

## Resources

- [What is network reliability and how do you measure it?](/network-connections-unreliable/)
- [Add a web app manifest](/add-manifest/)
- [Workbox: Your high-level service worker toolkit](/workbox/)
