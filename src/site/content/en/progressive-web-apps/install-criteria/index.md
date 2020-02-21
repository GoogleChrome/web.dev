---
layout: post
title: What does it take to be installable?
authors:
  - petelepage
date: 2020-02-14
updated: 2020-02-24
description: |
  Progressive Web App installability criteria.
---

Many browsers indicate to the user that your Progressive Web App (PWA) is
installable when it meets certain criteria. Example indicators include an
Install button in the address bar, or an Install menu item in the overflow
menu. In addition, when the criteria is met, many browsers will fire a
`beforeinstallprompt` event, allowing you to enable an install flow, directly
from your PWA.

In Chrome, your Progressive Web App must meet the following criteria before
it will fire the `beforeinstallprompt` event and show the in-browser install
promotion:

* The web app is not already installed
* Meets a user engagement heuristic
* Be served over HTTPS
* Includes a [Web App Manifest][add-manifest] that includes:
  * `short_name` or `name`
  * `icons` - must include a 192px and a 512px icon
  * `start_url`
  * `display` - must be one of `fullscreen`, `standalone`, or `minimal-ui`
  * Note: `prefer_related_applications` must not be present, or be `false`
* Registers a service worker with a functional `fetch` handler

Other browsers have similar criteria for installation, though there may be
minor differences. Check the respective sites for full details:

* [Edge](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps#requirements)
* [Firefox](https://developer.mozilla.org/en-US/Apps/Progressive/Add_to_home_screen#How_do_you_make_an_app_A2HS-ready)
* [Opera](https://dev.opera.com/articles/installable-web-apps/)
* [Samsung Internet](https://hub.samsunginter.net/docs/ambient-badging/)
* [UC Browser](https://plus.ucweb.com/docs/pwa/docs-en/zvrh56)

{% Aside %}
On Android, if the web app manifest includes `related_applications` and
`"prefer_related_applications": true`, the user will be directed to the
Google Play store and
[prompted to install the specified native app](https://developers.google.com/web/fundamentals/app-install-banners/native)
instead.
{% endAside %}

[add-manifest]: /add-manifest/
