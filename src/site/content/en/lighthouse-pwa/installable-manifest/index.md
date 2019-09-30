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

The prompt to install a Progressive Web App (PWA) lets users add your app to their home screen.
Users who add apps to home screens engage with those apps more frequently.
Learn more in the [Discover what it takes to be installable](/discover-installable/) post.

## How the Lighthouse web app manifest audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages missing an installable manifest:

<figure class="w-figure">
  <img class="w-screenshot" src="installable-manifest.png" alt="Lighthouse audit showing user can't install the web app from their home screen">
</figure>

A page fails the audit when the following criteria aren't met:

- The web app is not already installed and
[`prefer_related_applications`](https://developers.google.com/web/fundamentals/app-install-banners/native)
is not `true`.
- Meets a user engagement heuristic
(currently, the user has interacted with the domain for at least 30 seconds)
- Includes a [web app manifest](/add-manifest/) that includes:
  - `short_name` or `name`
  - `icons` must include a 192&nbsp;px and a 512&nbsp;px sized icons
  - `start_url`
  - `display` must be one of: `fullscreen`, `standalone`, or `minimal-ui`
- Served over [HTTPS](/is-on-https) (required for service workers)
- Has registered a
[service worker](/service-workers-cache-storage) with a `fetch` event handler

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to make your PWA installable

In order for a user to be able to install your Progressive Web App,
check that it meets the above criteria.
When these criteria are met,
the browser fires a `beforeinstallprompt` event that you can use to prompt the user to install your Progressive Web App, and may show a [mini-info bar](https://developers.google.com/web/fundamentals/app-install-banners/#mini-info-bar).

Other browsers have different criteria for installation, or to trigger the `beforeinstallprompt` event. Check their respective sites for full details:
[Edge](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps#requirements),
[Firefox](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen#How_do_you_make_an_app_A2HS-ready),
[Opera](https://dev.opera.com/articles/installable-web-apps/),
[Samsung Internet](https://hub.samsunginter.net/docs/ambient-badging/), and
[UC Browser](https://plus.ucweb.com/docs/pwa/docs-en/zvrh56).

In addition, the scope of the service worker includes the page you audited
and the page specified in the `start_url` property of the web app manifest.

{% Aside 'codelab' %}
Learn how to make your app installable
with the [Make it installable](/codelab-make-installable) codelab.
{% endAside %}

Learn more in [Add a Web App Manifest](/add-manifest/).

## Resources

[Source code for **Web app manifest does not meet the installability requirements** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/installable-manifest.js)
