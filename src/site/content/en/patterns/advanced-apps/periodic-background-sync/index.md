---
layout: pattern
title: How to periodically synchronize data in the background
date: 2022-10-10
description: >
  Learn how to use Periodic Background Sync to enable web applications to periodically synchronize
  data in the background.
authors:
  - chuijun
height: 800
static:
  - sw.js
  - assets/manifest.json
  - assets/favicon.png
  - assets/favicon.svg
---

## The modern way

Periodic background sync lets you show fresh content when a progressive web app or service
worker-backed page is launched. It does this by downloading data in the background when the app or
page is not being used.

### Using the Periodic Background Sync API

After the service worker is installed, use the
[Permissions API](https://developer.mozilla.org/docs/Web/API/Permissions_API) to query for
`periodic-background-sync`. You can do this from either a window or a service worker context.

```js
const status = await navigator.permissions.query({
  name: 'periodic-background-sync',
});
if (status.state === 'granted') {
  // Periodic background sync can be used.
} else {
  // Periodic background sync cannot be used.
}
```

Registering a periodic sync requires both a tag and a minimum synchronization interval
(`minInterval`). The tag identifies the registered sync so that multiple syncs can be registered. In
the example below, the tag name is `'content-sync'` and the `minInterval` is one day.

```js
navigator.serviceWorker.ready.then(async registration => {
  try {
	await registration.periodicSync.register('get-cats', { minInterval: 24 * 60 * 60 * 1000 });
    console.log(Periodic background sync registered.');
  } catch (err) {
    console.error(err.name, err.message);
  }
});
```

Call `periodicSync.getTags()` to retrieve an array of registration tags. The example below uses tag
names to confirm that cache updating is active to avoid updating again.

```js
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  const tags = await registration.periodicSync.getTags();
  // Only update content if sync isn't set up.
  if (!tags.includes('content-sync')) {
    updateContentOnPageLoad();
  }
} else {
  // If periodic background sync isn't supported, always update.
  updateContentOnPageLoad();
}
```

To respond to a periodic background sync event add a `periodicsync` event handler to your service
worker. The event object passed to it will contain a tag parameter matching the value used during
registration. For example, if a periodic background sync was registered with the name
`'content-sync'`, then `event.tag` will be `'content-sync'`.

```js
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});
```

### Browser compatibility

{% BrowserCompat 'api.PeriodicSyncManager' %}

## The classic way

Rather than updating data in the background so it's ready when the user loads the app, the classic
way simply consists of updating the data on load.

## Further reading

- [Richer offline experiences with the Periodic Background Sync API](/i18n/en/periodic-background-sync/)
- [Web Periodic Background Synchronization API](https://developer.mozilla.org/docs/Web/API/Web_Periodic_Background_Synchronization_API)

## Demo
