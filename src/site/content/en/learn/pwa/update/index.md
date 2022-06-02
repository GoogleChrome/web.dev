---
title: Update
description: >
  Chances are your PWA needs updating. This chapter gives you the tools to update different parts of your PWA, from assets to metadata.
authors:
  - firt
date: 2022-03-10
updated: 2022-03-14
---

You have published your PWA: some users use it from the browser, others install it on their devices. When you update the app, it's important to apply best practices to avoid pitfalls.

You may update:

* App data.
* Assets already cached in devices.
* The service worker file, or its dependencies.
* Manifest metadata.

Let's check out the best practices for each of these elements.

## Updating data

To update data, such as that stored in IndexedDB, you can use tools such as Fetch, WebRTC, or WebSockets API. If your app supports any offline features, remember to keep the data that supports the features updated too.

On compatible browsers, there are options to sync data, not only when the user opens the PWA but also in the background. These options are:

* [Background synchronization](https://developer.mozilla.org/docs/Web/API/Background_Synchronization_API): saves requests that failed and retries them using sync from the service worker.
* [Web periodic background sync](https://developer.mozilla.org/docs/Web/API/Web_Periodic_Background_Synchronization_API): syncs data periodically in the background, at specific times, allowing the app to provide updated data even if the user hasn't opened the app yet.
* [Background Fetch](https://developer.mozilla.org/docs/Web/API/Background_Fetch_API): downloads large files, even when the PWA is closed.
* [Web push](https://developer.mozilla.org/docs/Web/API/Push_API): sends a message from the server that wakes up the service worker and notifies the user. This is commonly called a 'push notification'. This API requires the user's permission.

All these APIs are executed from the service worker context. They are currently available only on Chromium-based browsers, on Android, and desktop operating systems. When you use one of these APIs, you can run code in the service worker thread; for example, to download data from your server and update your IndexedDB data.

{% Aside %}
The Web Push API is the only API to notify the user from the background and its `push` message can include a small amount of data: it can carry a payload of up to around 2KB.
{% endAside %}

## Updating assets

Updating assets includes any changes to files you use to render the app's interface, such as HTML, CSS, JavaScript, and images. For example, a change in your app's logic, an image that is part of your interface, or a CSS stylesheet.

### Update patterns

Here are some common patterns to handle app updates, but you can always customize the process to your own needs:

* Full update: every change, even a minor one, triggers the replacement of the entire cache content. This pattern mimics how device-specific apps handle updates, and it will consume more bandwidth and will take more time.
* Changed assets update: only the assets that have changed since the last update get replaced in cache. It is often implemented using a library such as [Workbox](/learn/pwa/workbox). It involves creating a list of cached files, a hash representation of the file, and timestamps. With this information, the service worker compares this list with the cached assets and decides which assets to update.
* Individual assets update: each asset is updated individually when it changes. The stale while revalidate strategy described in the [Serving chapter](/learn/pwa/serve) is an example of updating assets individually.

### When to update

Another good practice is to find a good time to check for updates and apply them. Here are some options:

* When the service worker wakes up. There is no event to listen for this moment, but the browser will execute any code in the service worker's global scope when it wakes up.
* In the main window context of your PWA, after the browser loaded the page, to avoid making the app load slower.
* When background events are triggered, such as when your PWA receives a push notification or a background sync fires. You can update your cache then and your users will have the asset's new version the next time they open the app.

{% Aside 'warning' %}
When checking for updates, make sure you don't interrupt the loading process and impact your app's performance. Do not wait for an update check before rendering the app as it will harm your user experience and reflect on your [core web vitals](/web-vitals). If you need to udate part of your app frequently, use the [stale while revalidate](/learn/pwa/serving/#stale-while-revalidate) caching strategy.
{% endAside %}

### Live updates

You can also choose whether to apply an update when the app is open (live) or closed. With the app closed approach, even though the app has downloaded new assets, it won't make any changes and will use the new versions on the next load.

A live update means as soon as the asset is updated in the cache, your PWA replaces the asset in the current load. It is a complex task not covered in this course. Some tools that help to implement this update are [livereload-js](https://www.npmjs.com/package/livereload-js) and CSS asset update [CSSStyleSheet.replace() API](https://developer.mozilla.org/docs/Web/API/CSSStyleSheet/replace).

## Updating the service worker

The browser triggers an update algorithm when your service worker or its dependencies change. The browser detects updates using a byte-by-byte comparison between the cached files and the resources coming from the network.

Then the browser tries to install the new version of the service worker, and the new service worker will be in the *waiting* state, as described in the [Service workers chapter](/learn/pwa/service-workers/#updating-a-service-worker). The new installation will run the `install` event for the new service worker. If you are caching assets in that event handler, assets will also be re-cached.

{% Aside 'caution' %}
If you delete or rename your service worker file, the browser won't remove the previously registered service worker from its clients. To completely remove a service worker, you need to use the [getRegistrations()](https://developer.mozilla.org/docs/Web/API/ServiceWorkerContainer/getRegistrations) and the [unregister()](https://developer.mozilla.org/docs/Web/API/ServiceWorkerRegistration/unregister) methods.
{% endAside %}


{% Aside %}
Installing a new service worker version doesn't automatically remove previously cached assets. You should explicitly delete assets you no longer need.
{% endAside %}

### Detecting service worker changes

To detect that a new service worker is ready and installed, we use the `updatefound` event from the service worker registration. This event is fired when the new service worker starts installing. We need to wait for its state to change to `installed` with the `statechange` event; see the following:

```js
async function detectSWUpdate() {
  const registration = await navigator.serviceWorker.ready;

  registration.addEventListener("updatefound", event => {
    const newSW = registration.installing;
    newSW.addEventListener("statechange", event => {
      if (newSW.state == "installed") {
         // New service worker is installed, but waiting activation
      }
    });
  })
}
```

### Force override

The new service worker will be installed but waiting for activation by default. The wait prevents the new service worker from taking over old clients that might not be compatible with the new version.

Even though it is not recommended, the new service worker can skip that waiting period and start the activation immediately.

{% Aside 'caution' %}
`skipWaiting()` means that your new service worker is probably controlling pages that were loaded with an older version. This means some of your page's fetches will have been handled by your old service worker, but your new service worker will be handling subsequent fetches. If this might prevent your app from working, don't use `skipWaiting()`.
This warning comes from [service worker lifecycle](/service-worker-lifecycle/). Check out the article for more best practice advice.
{% endAside %}

```js
self.addEventListener("install", event => {
   // forces a service worker to activate immediately
   self.skipWaiting();
  });

self.addEventListener("activate", event => {
  // when this SW becomes activated, we claim all the opened clients
  // they can be standalone PWA windows or browser tabs
  event.waitUntil(clients.claim());
});
```

The `controllerchange` event fires when the service worker controlling the current page changes. For example, a new worker has skipped waiting and become the new active worker.

```js
navigator.serviceWorker.addEventListener("controllerchange", event => {
   // The service worker controller has changed
 });
```

## Updating metadata

You can also update your app's metadata, which is mainly set in the [web app manifest](/learn/pwa/web-app-manifest). For example, update its icon, name, or start URL, or you can add a new feature such as [app shortcuts](/app-shortcuts/).
But what happens with all the users who have already installed the app with the old icon on their devices? How and when do they get the updated version?

The answer depends on the platform. Let's cover the options available.

{% Aside 'gotchas' %}
The `id` property uniquely identifies your PWA; changing `id` means your PWA will be considered a completely new PWA. To avoid unexpected behavior, before you set or change the `id` property, read [Uniquely identifying PWAs with the web app manifest id property](https://developer.chrome.com/blog/pwa-manifest-id/).
{% endAside %}

### Safari on iOS, iPadOS, and Android browsers

On these platforms, the only way to get the new manifest metadata is to re-install the app from the browser.

{% Aside %}
If you modify your `start_url` the browser may install the app as a completely new app. However, it has been a common practice to add a manual version identifier within the `start_url` property, such as `/?version=3` to identify the version. From Chrome 96 [you can add an `id` into the manifest](​​https://developer.chrome.com/blog/pwa-manifest-id/) to identify your app.
{% endAside %}

### Google Chrome on Android with WebAPK

When the user has installed your PWA on Android using Google Chrome with [WebAPK](/learn/pwa/installation/#webapks) activated (most of the Chrome PWA installations), the update will be detected and applied based on an algorithm. Check out  the details in this [manifest updates](/manifest-updates/) article.

Some additional notes about the process:

If the user doesn't open your PWA, its WebAPK won't be updated.
If the server doesn't respond with the manifest file (there is a 404 error), Chrome won't check for updates for a minimum of 30 days, even if the user opens the PWA.

Go to `about:webapks` in Chrome on Android to see the status of the "needing update" flag, and request an update. In the [Tools and debug chapter](/learn/pwa/tools-and-debug), you can read more about this debugging tool.


### Samsung Internet on Android with WebAPK

The process is similar to the Chrome version. In this case, if the PWA manifest requires an update, during the next 24 hours the WebAPK will be updated on Wi-Fi after [minting the updated WebAPK](/learn/pwa/installation/#webapks).

### Google Chrome and Microsoft Edge on desktop

On desktop devices, when the PWA is launched, the browser determines the last time it checked the local manifest for changes. If the manifest hasn't been reviewed since the browser last started or hasn't been checked in the last 24 hours, the browser will make a network request for the manifest and then compare it against the local copy.

When [selected properties](/manifest-updates/#cr-desktop-trigger) are updated, it will trigger an update after all windows have been closed.

## Alerting the user

Some updating strategies need a reload or a new navigation from the clients. You'll want to let the user know there is an update waiting but give them the chance to update the page when it is best for them.

To inform the user, there are these options:

* Use the DOM or [canvas API](https://developer.mozilla.org/docs/Web/API/Canvas_API) to render a notice on the screen.
* Use the [Web Notifications API](https://developer.mozilla.org/docs/Web/API/notification). This API is part of the push permission to generate a notification in the operating system. You will need to request web push permission to use it, even if you don't use the push messaging protocol from your server. This is the only option we have if the PWA is not opened.
* Use the [Badging API](/badging-api/) to show that updates are available in the PWA's installed icon

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/s20eK3XJWqdxYvH4HwZV.png", alt="An update notification shown in the DOM.", width="800", height="821" %}.


### More about the Badging API

The [Badging API](/badging-api/) lets you mark your PWA's icon with a badge number, or a badge dot on compatible browsers. A badge dot is a tiny mark within the installed icon that expresses something is waiting inside the app.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/yicjcQZkdbS2sj732BEp.webp", alt="Example of Twitter with eight notifications and another app showing a flag type badge.", width="800", height="252" %}

You need to call `setAppBadge(count)` on the `navigator` object to set a badge number. You can do this from the window or service worker's context when you know there is an update to alert the user.

```js
let unreadCount = 125;
navigator.setAppBadge(unreadCount);
```
To clear the badge, you call `clearAppBadge()` on the same object:

```js
navigator.clearAppBadge();
```

{% Aside %}
The Badging API works on a best-effort mechanism; the browser will do its best to match your request, but sometimes the browser will revert to a different approach. For example, a badge number is not available on some Android devices, so a dot badge is used, no matter the number you specify.
{% endAside %}

##  Resources

- [Service Worker Lifecycle](/service-worker-lifecycle/)
- [How Chrome handles updates to the web app manifest](/manifest-updates/)
- [Synchronize and update a PWA in the Background](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/background-syncs)
- [Richer offline experiences with the Periodic Background Sync API](/periodic-background-sync/)
- [Push API](https://developer.mozilla.org/docs/Web/API/Push_API)
- [Push notifications overview](/push-notifications-overview/)
- [Badging for app icons](/badging-api/)
- [Workbox 4: Implementing refresh-to-update-version flow using the workbox-window module](https://medium.com/google-developer-experts/workbox-4-implementing-refresh-to-update-version-flow-using-the-workbox-window-module-41284967e79c)

