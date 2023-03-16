---
layout: pattern
title: How to create app shortcuts
date: 2022-10-10
authors:
  - beaufortfrancois
description: |
  Learn how to create app shortcuts.
height: 800
static:
  - sw.js
  - assets/manifest.json
  - icons/favicon.png
  - icons/blue.png
  - icons/red.png
  - blue.html
  - red.html
---

App shortcuts help users quickly start common or recommended tasks within your web app. Easy access to those tasks from anywhere the app icon is displayed will enhance users' productivity as well as increase their engagement with the web app.

## The modern way

### Define app shortcuts in the web app manifest

The app shortcuts menu is invoked by right-clicking the app icon in the taskbar (Windows) or dock (macOS) on the user's desktop, or by touch & holding the app's launcher icon on Android.

<div class="switcher" >
  <figure>
    {% Img src="image/admin/F4TsJNfRJNJSt2ZpqVAy.png", alt="An opened app shortcuts menu on Android.", width="800", height="420" %}
    <figcaption>App shortcuts menu opened on Android</figcaption>
  </figure>

  <figure>
    {% Img src="image/admin/RoF6k7Aw6WNvaEcsgIcb.png", alt="An opened app shortcuts menu on Windows.", width="800", height="420" %}
    <figcaption>App shortcuts menu opened on Windows</figcaption>
  </figure>
</div>

The app shortcuts menu is shown only for [Progressive Web Apps](/progressive-web-apps/) that are installed. Check out [Installation](/learn/pwa/installation/) in our [Learn PWA](/learn/pwa/) module to learn about installability requirements.

Each app shortcut expresses a user intent, each of which is associated with a URL within the scope of your web app. The URL is opened when a user activates the app shortcut.

App shortcuts are optionally declared in the `shortcuts` array member of the [web app manifest](/learn/pwa/web-app-manifest/). Below is an example of a potential web app manifest.

```json
{
  "name": "Player FM",
  "start_url": "https://player.fm?utm_source=homescreen",
  "shortcuts": [
    {
      "name": "Open Play Later",
      "short_name": "Play Later",
      "description": "View the list of podcasts you saved for later",
      "url": "/play-later?utm_source=homescreen",
      "icons": [{ "src": "/icons/play-later.png", "sizes": "192x192" }]
    },
    {
      "name": "View Subscriptions",
      "short_name": "Subscriptions",
      "description": "View the list of podcasts you listen to",
      "url": "/subscriptions?utm_source=homescreen",
      "icons": [{ "src": "/icons/subscriptions.png", "sizes": "192x192" }]
    }
  ]
}
```

{% BrowserCompat 'html.manifest.shortcuts' %}

## The classic way

### Let user drag links to the bookmark bar

If the app is not installed yet, you can suggest the user to drag some links from your web page and release them in their browser bookmark bar. That way, they can quickly start common or recommended tasks within your web app.

{% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/9KJ65kyrc7nxs04Ycc7R.mp4", controls=true, autoplay=true, loop=true, muted=true %}

## Further reading

- [Get things done quickly with app shortcuts](app-shortcuts/)

## Demo
