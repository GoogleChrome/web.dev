---
title: Detection
description: >
  Identifying how your users interact with your app is useful in customizing and improving the user experience. For example, you can check whether your app is already installed on the user's device and implement features such as transferring navigation to the standalone app from the browser.
authors:
  - firt
date: 2022-03-10
updated: 2022-03-14
---

You can detect if the user is using your PWA in the browser or in standalone mode. On Chromium-based browsers (Android and desktop), you can also detect the following events:

* Installation invitation dialog status and result.
* Installation finished.
* Navigation transfer from browser to PWA window and conversely.
* PWA installation status.
* Related app installed from an app store.

You can use this data for analytics, to understand your user's preferences, and to customize their experience. To capture these events, you can use tools such as media queries, events from the `window`, or using the capabilities APIs that you can find [listed here](https://developer.chrome.com/blog/fugu-status/).

## Detecting display mode

To track how users launch your PWA, you can use `matchMedia()` to test the `display-mode` media query.

```js
window.addEventListener('DOMContentLoaded', () => {
  let displayMode = 'browser tab';
  if (window.matchMedia('(display-mode: standalone)').matches) {
    displayMode = 'standalone';
  }
  // Log launch display mode to analytics
  console.log('DISPLAY_MODE_LAUNCH:', displayMode);
});
```

If you use this example, remember to match the display mode from your web app manifest, for instance, `standalone`, `minimal-ui` or `fullscreen`. You can also match multiple queries in the media query string using comma-separated conditions.

You can also add a query parameter to your manifest's `start_url` that you can capture with analytics to track stats about when, in what way, and how much your PWA is being used.

{% Aside 'caution' %}
If you use a query parameter on your `start_url` to capture metrics, make sure to set the `id` field on your manifest to uniquely identify your app. Read how to set up this field in [Uniquely identifying PWAs with the web app manifest id property](https://developer.chrome.com/blog/pwa-manifest-id/)
{% endAside %}

## App installation

When a user accepts the install prompt in the browser, the `appinstalled` event fires on Chromium-based browsers. A great use for this event handler is to remove any in-app installation promotion you've added.

```js
window.addEventListener('appinstalled', () => {
  // If visible, hide the install promotion
  hideInAppInstallPromotion();
  // Log install to analytics
  console.log('INSTALL: Success');
});
```

Remember, on Android devices with WebAPK, the event is fired when the user accepts the dialog, and not after the WebAPK is minted and installed. There may be a delay of some seconds before the app is fully installed.

The [Installation Prompt chapter](/learn/pwa/installation-prompt) explains how to detect if the installation prompt is available and what choice the user makes.

{% Aside 'warning' %}
The `appinstalled` event is available only in Chromium-based browsers, and it's part of an [incubator for the manifest spec](https://wicg.github.io/manifest-incubations/#onappinstalled-attribute)
{% endAside %}

## Session transfer

Users can use your PWA within the browser and in the installed standalone form. On desktop browsers, you can transfer the current navigation between these contexts using badges or menu items, as seen in the following image.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/260YbAY9W4qFitqUHhQ5.png", alt="Navigation transfer between a browser tab and a PWA window.", width="800", height="321" %}

On Android, there is a menu item similar to the one on desktop from the browser that transfers the navigation to the app. In this case, the current URL is opened but it will be a new page navigation in the app.

In the following image you can see the menu item in Android when the app is already installed.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/rpMHjK1uhwwJONJKTj2r.png", alt="Chrome on Android shows menu item to open a new navigation in a PWA window.", width="800", height="1689" %}

### Transfer after installation

From desktop browsers, the current navigation is immediately transferred to the app on installation. The browser's tab is closed, and the newly installed app is opened, continuing what the user was doing.

On mobile browsers, your current navigation stays in the browser when you install the app. If the users want to move to the app, they need to open the app manually, and it will be a new navigation.

### Detecting the transfer

To detect the the transfer between browser and window, you can use a media query:

```js
window.addEventListener('DOMContentLoaded', () => {
  // replace standalone with your display used in manifest
  window.matchMedia('(display-mode: standalone)')
      .addListener(event => {
          if (event.matches) {
             // From browser to standalone
          } else {
             // From standalone to browser
          }
      });
});
```

### iOS and iPadOS storage isolation

On iOS and iPadOS, there is no navigation or URL transfer between the browser and the installed icon. Even if it's the same PWA, every PWA icon that the user installs will have its own storage, isolated from Safari's tab and other icons.
When a user opens the installed icon, no storage is shared with Safari. If your PWA needs a login, the user will need to log in again. If the app was added to the home screen several times, for each PWA instance, the user has a different session.

## Related applications

A website indicates a relationship with an app via the manifest. To do so, use the [`related_applications` member](https://developer.mozilla.org/docs/Web/Manifest/related_applications) of the Web App Manifest spec.
The `related_applications` key is an array of objects that represent each related application. Each entry contains `platform`, `url`, and an optional `id`.

These are the possible [platform values](https://github.com/w3c/manifest/wiki/Platforms):
* `play`: Google Play apps (Android and ChromeOS).
* `itunes`: Apple App Store (macOS, iOS, and iPadOS).
* `windows`: Microsoft Store (Windows 10 and 11).
* `amazon`: Amazon AppStore (FireOS).
* `webapp`: installed PWA.

### Prefer a related app

When the user installs an app, you can redirect the user to a related app if you set the `prefer_related_applications` field to `true` in your manifest. With this setup, on compatible browsers the install flows won't install the PWA; instead they trigger a store installation from the `url` or `id` that you specified in the `related_applications` entry.

The related application could be your PWA and it will be installed via an app store. One advantage of this configuration is that, at the moment, only apps installed through the app store are recovered with a backup or when you switch to a new device.

```json
{
  ...
  "related_applications:" [
     {
       "platform": "play",
       "url": "https://play.google.com/..."
     }
  ],
  "prefer_related_applications": true
}
```

{% Aside %}
Using `prefer_related_applications: true` with only a `webapp` preferred application doesn't make any difference in how your PWA is offered and installed.
{% endAside %}

#### Apple Smart App Banners

Safari doesn't support the `related_applications` member, but it offers [Smart App Banners](https://developer.apple.com/documentation/webkit/promoting_apps_with_smart_app_banners) for apps in the App Store. So if you want to promote a PWA or other app you have published in the App Store, you can include meta tags in your PWA's HTML to invite the user to install the app (see the link just provided), or transfer the navigation if it is already installed.

### Detecting related installed apps

The [`getInstalledRelatedApps()`](/get-installed-related-apps/) method allows your website to check whether your iOS/Android/desktop app or PWA is installed on the user's device.

Checking if a related app is installed already helps you to implement features such as hiding custom-installed prompts or redirecting the user directly to the installed app, instead of going to a general purpose website.
To use the `getInstalledRelatedApps()` method, both the installed app and the website need to configure their connection with each other. Each app, depending on its platform, includes metadata to recognize the website and the website includes the expected installed app in the `related_applications` field in the manifest.

Tools such as [BubbleWrap](https://github.com/GoogleChromeLabs/bubblewrap) or [PWA Builder](https://www.pwabuilder.com/), which allow you to publish your PWA to app stores, already add the required metadata so your website can use `getInstalledRelatedApps()` right away.
To detect whether a PWA is already installed using `getInstalledRelatedApps()`, define `webapp` in the manifest `related_applications` field with the URL to your manifest:

```json
...
"related_applications": [{
   "platform": "webapp",
   "url": "https://example.com/manifest.json",
}],
...
```

`getInstalledRelatedApps()` returns an array of app objects. If the array is empty, the related app is not installed.

```js
const relatedApps = await navigator.getInstalledRelatedApps();
const PWAisInstalled = relatedApps.length > 0;
```

#### Detect installation from outside the PWA's scope

From Chrome on Android 89, you can detect if a PWA is installed, even from outside the PWA's scope. Your PWA must set a JSON file within the `/.well-known/` folder, giving permission to the other scope, as described in [this article](/get-installed-related-apps/#check-pwa-out-of-scope).

##  Resources

- [Is your app installed? getInstalledRelatedApps() will tell you!](/get-installed-related-apps/)
- [MDN: Related Applications](https://developer.mozilla.org/docs/Web/Manifest/related_applications)
- [MDN: AppInstalled event](https://developer.mozilla.org/docs/Web/API/Window/appinstalled_event)
- [Apple: Promoting Apps with Smart App Banners](https://developer.apple.com/documentation/webkit/promoting_apps_with_smart_app_banners)

