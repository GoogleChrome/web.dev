---
layout: post
title: Web app manifest does not meet the installability requirements
description: |
  Learn how to make your Progressive Web App installable.
web_lighthouse:
  - installable-manifest
codelabs:
  - codelab-make-installable
date: 2019-05-04
updated: 2019-09-19
---

Installability is a core requirement of [Progressive Web Apps (PWAs)](/discover-installable).
By prompting users to install your PWA, you allow them to add it to their home screens.
Users who add apps to home screens engage with those apps more frequently.

## How the Lighthouse web app manifest audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that aren't installable:

<figure class="w-figure">
  <img class="w-screenshot" src="installable-manifest.png" alt="Lighthouse audit showing user can't install the web app from their home screen">
</figure>

If a page doesn't meet _all_ the following criteria, it will fail the audit:

- The page links to a [web app manifest](/add-manifest/) that includes:
  - A [`short_name`](https://developer.mozilla.org/en-US/docs/Web/Manifest/short_name)
    or [`name`](https://developer.mozilla.org/en-US/docs/Web/Manifest/name) property
  - An [`icons`](https://developer.mozilla.org/en-US/docs/Web/Manifest/icons)
    property that includes a 192x192&nbsp;px and a 512x512&nbsp;px icon
  - A [`start_url`](https://developer.mozilla.org/en-US/docs/Web/Manifest/start_url) property
  - A [`display`](https://developer.mozilla.org/en-US/docs/Web/Manifest/display)
    property set to `fullscreen`, `standalone`, or `minimal-ui`
  - A [`prefer_related_applications`](https://developers.google.com/web/fundamentals/app-install-banners/native)
    property set to a value other than `true`.
- The page is served over [HTTPS](/is-on-https), which is required for service workers.
- The page registers a
  [service worker](/service-workers-cache-storage) with a `fetch` event handler.
- The page doesn't prompt users to install it until they've demonstrated some level of engagement.
  (Currently, Lighthouse requires that the user interact with the domain for at least 30&nbsp;seconds before being prompted.)


{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to make your PWA installable

### In Chrome
Check that your app meets the above criteria.
When these criteria are met,
Chrome fires a `beforeinstallprompt` event
that you can use to prompt the user to install your PWA.

{% Aside 'codelab' %}
Learn how to make your app installable in Chrome
with the [Make it installable](/codelab-make-installable) codelab.
{% endAside %}

### In other browsers
Other browsers have different criteria for installation
and for triggering the `beforeinstallprompt` event.
Check their respective sites for full details:
- [Edge](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps#requirements)
- [Firefox](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen#How_do_you_make_an_app_A2HS-ready)
- [Opera](https://dev.opera.com/articles/installable-web-apps/)
- [Samsung Internet](https://hub.samsunginter.net/docs/ambient-badging/)
- [UC Browser](https://plus.ucweb.com/docs/pwa/docs-en/zvrh56)

## Resources

- [Source code for **Web app manifest does not meet the installability requirements** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/installable-manifest.js)
- [Add a web app manifest](/add-manifest/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Does not use HTTPS](http://localhost:8080/is-on-https/)
- [Service workers and the Cache Storage API](/service-workers-cache-storage)
