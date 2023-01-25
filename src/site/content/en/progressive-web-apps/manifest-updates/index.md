---
layout: post
title: How Chrome handles updates to the web app manifest
subhead: What it takes to change icons, shortcuts, colors, and other metadata for your PWA
authors:
  - petelepage
  - ajara
date: 2020-10-14
updated: 2021-04-05
description: What it takes to change icons, shortcuts, colors, and other metadata in your web app manifest for your PWA.
tags:
  - progressive-web-apps
---

{% Aside %}
We are currently gathering data on browsers other than Chrome. If you would
like to help us gather this data or add content to this page, please leave a
comment in [issue #4038](https://github.com/GoogleChrome/web.dev/issues/4038).
{% endAside %}

When a PWA is installed, the browser uses information from the web app
manifest for the app name, the icons the app should use, and the URL that
should be opened when the app is launched. But what if you need to update
app shortcuts or try a new theme color? When and how are those changes
reflected in the browser?

{% Aside 'caution' %}
Do not change the name or location of your web app manifest file, doing so
may prevent the browser from updating your PWA.
{% endAside %}

In most cases, changes should be reflected within a day or two of the
PWA being launched, after the manifest has been updated.

## Updates on desktop Chrome {: #cr-desktop }

When the PWA is launched, or opened in a browser tab, Chrome determines the
last time the local manifest was checked for changes. If the manifest hasn't
been checked since the browser last started, or it hasn't been checked in the
last 24 hours, Chrome will make a network request for the manifest, then
compare it against the local copy.

If select properties in the manifest have changed (see list below), Chrome
queues the new manifest, and after all windows have been closed, installs it.
Once installed, all fields from the new manifest (except `name`, `short_name`,
`start_url` and `icons`) are updated.

### Which properties will trigger an update? {: #cr-desktop-trigger }

* `display` (see below)
* `scope`
* `shortcuts`
* `theme_color`

{% Aside 'caution' %}
Changes to `name`, `short_name`, `icons` and `start_url` are **not**
currently supported on desktop Chrome, though work is underway to support them.
{% endAside %}

<!-- CrBug for name/shortname https://crbug.com/1088338 -->
<!-- CrBug for start_url https://crbug.com/1095947 -->

### What happens when the `display` field is updated?

If you update your app's display mode from `browser` to `standalone` your
existing users will not have their apps open in a window after updating. There
are two display settings for a web app, the one from the manifest (that you
control) and a window/browser tab setting controlled by the user. The user
preference is always respected.

### Testing manifest updates {: #cr-desktop-test }

The `chrome://internals/web-app` page (available in Chrome 85 or later),
includes detailed information about all of the PWAs installed on the device,
and can help you understand when the manifest was last updated, how often
it's updated, and more.

To manually force Chrome to check for an updated manifest, restart Chrome
(use `chrome://restart`), this resets the timer so that Chrome will check for
an updated manifest when the PWA is next launched. Then launch the PWA.
After closing the PWA, it should be updated with the new manifest properties.

### References {: #cr-desktop-ref }

* [Updatable Web Manifest Fields][updatable-manifest-doc]

## Updates on Chrome for Android {: #cr-android }

When the PWA is launched, Chrome determines the last time the local manifest
was checked for changes. If the manifest hasn't been checked in the last 24
hours, Chrome will schedule a network request for the manifest, then compare
it against the local copy.

If select properties in the manifest have changed (see list below), Chrome
queues the new manifest, and after all windows of the PWA have been closed,
the device is plugged in, and connected to WiFi, Chrome requests an updated
WebAPK from the server. Once updated, all fields from the new manifest are
used.

### Which properties will trigger an update? {: #cr-android-trigger }

* `background_color`
* `display`
* `orientation`
* `scope`
* `shortcuts`
* `start_url`
* `theme_color`
* `web_share_target`

If Chrome is unable to get an updated manifest from the server, it may
increase the time between checks to 30 days.

{% Aside 'caution' %}
Changes to `name`, `short_name` and `icons` are **not** currently supported
on Android Chrome, though work is underway to support them.
{% endAside %}

### Testing manifest updates {: #cr-android-test }

The `chrome://webapks` page includes detailed information about all of the
PWAs installed on the device, and can tell you when the manifest was last
updated, how often it's updated, and more.

To manually schedule an update to the manifest, overriding the timer and
local manifest do the following:

1. Plug in the device and ensure it's connected to WiFi.
2. Use the Android task manager to shut down the PWA, then use the App panel
   in Android settings to force stop the PWA.
3. In Chrome, open `chrome://webapks` and click the "Update" button for the
   PWA. "Update Status" should change to "Pending".
4. Launch the PWA, and verify it's loaded properly.
5. Use the Android task manager to shut down the PWA, then use the App panel
   in Android settings to force stop the PWA.

The PWA usually updates within a few minutes, once the update has completed,
"Update Status" should change to "Successful"

### References {: #cr-android-ref }

* [`UpdateReason` enum][update-enum] for Chrome on Android

[updatable-manifest-doc]: https://docs.google.com/document/d/1twU_yAoTDp4seZMmqrDzJFQtrM7Z60jXHkXjMIO2VpM/preview
[update-enum]: https://cs.chromium.org/chromium/src/chrome/browser/android/webapk/webapk.proto?l=35
