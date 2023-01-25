---
title: Get things done quickly with app shortcuts
subhead: App shortcuts give quick access to a handful of common actions that users need frequently.
authors:
  - beaufortfrancois
  - jungkees
date: 2020-05-20
updated: 2021-04-06
hero: image/admin/1ekafMZjtzcd0G3TLQJ4.jpg
alt: A photo of an Android phone showing an app shortcuts menu
description: App shortcuts give quick access to a handful of common actions that users need frequently.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

To improve users' productivity and facilitate re-engagement with key tasks, the
web platform now supports app shortcuts. They allow web developers to provide
quick access to a handful of common actions that users need frequently.

{% Aside %}
At the time of writing, app shortcuts are available on Android (Chrome 84),
Windows (Chrome 85 and Edge 85), and Chrome OS (Chrome 92).
{% endAside %}

This article will teach you how to define those app shortcuts. Additionally,
you'll learn some associated best practices.

## About app shortcuts

App shortcuts help users quickly start common or recommended tasks within your
web app. Easy access to those tasks from anywhere the app icon is displayed will
enhance users' productivity as well as increase their engagement with the web
app.

The app shortcuts menu is invoked by right-clicking the app icon in the taskbar
(Windows) or dock (macOS) on the user's desktop, or long pressing the app's
launcher icon on Android.

<figure class="w-figure">
  {% Img src="image/admin/F4TsJNfRJNJSt2ZpqVAy.png", alt="Screenshot of an app shortcuts menu opened on Android", width="800", height="420", class="w-screenshot" %}
  <figcaption class="w-figcaption">App shortcuts menu opened on Android</figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/admin/RoF6k7Aw6WNvaEcsgIcb.png", alt="Screenshot of an app shortcuts menu opened on Windows", width="800", height="420", class="w-screenshot" %}
  <figcaption class="w-figcaption">App shortcuts menu opened on Windows</figcaption>
</figure>

The app shortcuts menu is shown only for [Progressive Web Apps] that are
installed on the user's desktop or mobile device. Check out [What does it take
to be installable?] to learn about installability requirements.

Each app shortcut expresses a user intent, each of which is associated with a
URL within the [scope] of your web app. The URL is opened when users activate
the app shortcut. Examples of app shortcuts include the following:

- Top-level navigation items (e.g., home, timeline, recent orders)
- Search
- Data entry tasks (e.g., compose an email or tweet, add a receipt)
- Activities (e.g., start a chat with the most popular contacts)

{% Aside %}
Big thanks to the folks at Microsoft Edge and Intel for designing and
standardizing app shortcuts. Chrome depends on a community of committers working
together to move the Chromium project forward. Not every Chromium committer is a
Googler, and these contributors deserve special recognition!
{% endAside %}

## Define app shortcuts in the web app manifest

App shortcuts are optionally defined in the [web app manifest], a JSON file that
tells the browser about your Progressive Web App and how it should behave when
installed on the user's desktop or mobile device. More specifically, they are
declared in the `shortcuts` array member. Below is an
example of a potential web app manifest.

```json
{
  "name": "Player FM",
  "start_url": "https://player.fm?utm_source=homescreen",
  …
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

Each member of the `shortcuts` array is a dictionary that contains at least a
`name` and a `url`. Other members are optional.

### name

The human-readable label for the app shortcut when
displayed to the user.

### short_name (optional)

The human-readable label used where space is limited. It is recommended
that you provide it, even though it's
optional.

### description (optional)

The human-readable purpose for the app shortcut.
It is not used at the time of writing but may be exposed to assistive technology
in the future.

### url

The URL opened when a user activates the app
shortcut. This URL must exist within the scope of the web app manifest. If it is
a relative URL, the base URL will be the URL of the web app manifest.

### icons (optional)

An array of image resource objects. Each object must
include the `src` and a `sizes` property. Unlike [web app manifest icons], the
`type` of image is optional.

SVG files are not supported at the time of writing, use PNG instead.

If you want pixel-perfect icons, provide them in increments of 48dp (i.e. 36x36,
48x48, 72x72, 96x96, 144x144, 192x192 pixel icons). Otherwise, it is recommended
that you use a single 192x192 pixel icon.

As a quality measure, icons must be at least half of the device's ideal size on
Android, which is 48dp. For example, to display on an [xxhdpi screen], the icon
must be at least 72 by 72 pixels. (This is derived from the
[formula for converting] dp units for pixel units.)

## Test your app shortcuts

To verify your app shortcuts are setup correctly, use the **Manifest** pane in the
**Application** panel of DevTools.

<figure class="w-figure">
  {% Img src="image/admin/rEL0r8lEfYHlsj0ylLSL.png", alt="Screenshot of app shortcuts in DevTools", width="800", height="534" %}
  <figcaption class="w-figcaption">App shortcuts shown in DevTools</figcaption>
</figure>

This pane provides a human-readable version of many of your manifest's
properties, including app shortcuts. It makes it easy to verify that all of the
shortcut icons, if provided, are loading properly.

App shortcuts may not be available right away to all users because Progressive
Web App updates are capped to once a day.  Find out more about
[how Chrome handles updates to the web app manifest].

## Best practices

### Order app shortcuts by priority

You are encouraged to order app shortcuts by priority, with the most critical
app shortcuts appearing first in the `shortcuts` array as the limit on the
number of app shortcuts displayed varies depending on the platform. Chrome and
Edge on Windows for instance limit the number of app shortcuts to 10 while
Chrome for Android only takes the first 4 app shortcuts into account.

### Use distinct app shortcut names

You should not rely on icons to differentiate app shortcuts as they may not
always be visible. For instance, macOS doesn't support icons in the dock
shortcuts menu. Use distinct names for each app shortcut.

### Measure app shortcuts usage

You should annotate app shortcuts `url` entries like you would do with
`start_url` for analytics purposes (e.g. `url:
"/my-shortcut?utm_source=homescreen"`).

## Browser support

App shortcuts are available on Android (Chrome 84), Windows (Chrome 85 and
Edge 85), and Chrome OS (Chrome 92 behind the experimental
`chrome://flags/#enable-desktop-pwas-app-icon-shortcuts-menu-ui` flag).
More desktop platform support will follow.

<figure class="w-figure">
  {% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/6KgvySxUcryuD0gwXa0u.png",alt="Screenshot of an app shortcuts menu opened on Chrome OS", width="800", height="450", class="w-screenshot" %}
  <figcaption class="w-figcaption">App shortcuts menu opened on Chrome OS</figcaption>
</figure>

## Trusted Web Activity support

[Bubblewrap], the recommended tool to build Android apps that use [Trusted Web
Activity], reads app shortcuts from the web app manifest and automatically
generates the corresponding configuration for the Android app. Note that icons
for app shortcuts are [required] and must be at least 96 by 96 pixels in
Bubblewrap.

[PWABuilder], a great tool to easily turn a Progressive Web App into a Trusted
Web Activity, supports app shortcuts with some [caveats].

For developers integrating Trusted Web Activity manually into their Android
application, [Android app shortcuts] can be used to implement the same
behaviors.

## Sample

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot"
    src="https://storage.googleapis.com/web-dev-assets/app-shortcuts/app-shortcuts-recording.mp4">
  </video>
</figure>

Check out the [app shortcuts sample] and its [source].

{% Glitch {
  id: 'app-shortcuts',
  path: 'public/manifest.json',
  height: 480
} %}

## Helpful links

* [Explainer][explainer]
* [Spec][spec]
* [App shortcuts sample][app shortcuts sample] | [App shortcuts sample source][source]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* Blink Component: [`UI>Browser>WebAppInstalls`]

[Progressive Web Apps]: /progressive-web-apps/
[What does it take to be installable?]: /install-criteria/
[scope]: /add-manifest/#scope
[web app manifest]: /add-manifest
[web app manifest icons]: /add-manifest/#icons
[explainer]: https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Shortcuts/explainer.md
[spec]: https://w3c.github.io/manifest/#shortcuts-member
[app shortcuts sample]: https://app-shortcuts.glitch.me
[source]: https://glitch.com/edit/#!/app-shortcuts
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=955497
[cr-status]: https://chromestatus.com/feature/5706099464339456
[`UI>Browser>WebAppInstalls`]: https://crbug.com/?q=component:UI>Browser>WebAppInstalls
[bubblewrap]: https://github.com/GoogleChromeLabs/bubblewrap
[required]: https://github.com/GoogleChromeLabs/bubblewrap/issues/116
[Trusted Web Activity]: /using-a-pwa-in-your-android-app/
[PWABuilder]: https://www.pwabuilder.com/
[caveats]: https://github.com/pwa-builder/CloudAPK/issues/25
[Android app shortcuts]: https://developer.android.com/guide/topics/ui/shortcuts
[xxhdpi screen]: https://developer.android.com/training/multiscreen/screendensities#TaskProvideAltBmp
[formula for converting]: https://developer.android.com/training/multiscreen/screendensities#dips-pels
[how Chrome handles updates to the web app manifest]: /manifest-updates
