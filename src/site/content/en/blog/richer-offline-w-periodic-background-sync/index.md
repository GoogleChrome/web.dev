---
title: Richer offline experiences with periodic background sync
subhead:
  Sync your apps data in the background for a more native-like experience.
authors:
  - joemedley
date: 2019-11-08
updated: 2019-11-08
hero: hero.jpg
description: |
  Periodic Background Sync enables web applications to periodically
  synchronize data in the background, bringing web apps closer to the behavior
  of a native app.
tags:
  - capabilities
  - post
  - progressive-web-apps
  - service-worker
---

{% Aside %}
  The Periodic Background Sync API, part of Google's [capabilities project](https://developers.google.com/web/updates/capabilities), is currently in development. This post will be updated as the implementation progresses.
{% endAside %}


Have you ever been in any of the following situations: riding a train or subway
with flaky or no connectivity; being throttled by your carrier after watching
too many videos; or living in a country where bandwidth struggles to keep up
with the demand? If you have, then you've surely felt the frustration of getting
certain things done on the web, and wondered why native apps so often do better
in these scenarios.

Native apps can fetch fresh content such as news articles or weather information
ahead of time. Even if there's no network in the subway, you can still read the
news.

Periodic Background Sync enables web applications to periodically synchronize
data in the background, bringing web apps closer to the behavior of a native
app.

## Concepts and usage

Periodic background sync lets you show fresh content when a progessive web app
or service worker-backed page is launched. It does this by downloading data in
the background when the app or page is not being used. Without it, the app's
content will refresh after launch, leading to content changing while the user is
viewing it. Worse yet, the app may only show a content spinner.

Without periodic background sync, web apps must use alternative methods to
download data. A common example is using a push notification to wake a service
worker. The user is interrupted by a message such as 'new data available'.
Updating the data is essentially a side effect. You still have the option of
using push notifications for truly important updates, such as significant
breaking news.

Periodic background sync is easily confused with background sync. Though they
have similar names, their use cases are different. Among other things,
background sync is most commonly used for resending data to a server when a
previous request has failed.

### Getting this right

We are putting periodic background sync through a trial period so that you can
help us make sure that we get it right. This section explains some of the design
decisions we took to make this feature as helpful as possible.

The first design decision we made is that a web app can only use periodic
background sync after a person has installed it on their device, and has
launched it as a distinct application. Periodic background sync is not available
in the context of a regular tab in Chrome.

Furthermore, since we don't want unused or seldom used web apps to gratuitously
consume battery or data, we designed periodic background sync such that
developers will have to earn it by providing value to their users. Concretely,
we are using a site engagement score to determine if and how often periodic
background syncs can happen for a given web app. In other words, a
`periodicsync` event won't be fired at all unless the engagement score is
greater than zero, and its value affects the frequency at which the
`periodicsync` event fires. This ensures that the only apps syncing in the
background are the ones you are actively using.

Periodic background sync shares some similarities with existing APIs and
practices on popular platforms. For instance, one-off background sync as well as
push notifications allow a web app's logic to live a little longer (via its
service worker) after a person has closed the page. On most platforms, it's
common for people to have installed apps that periodically access the network in
the background to provide a better user experience for critical updates,
prefetching content, syncing data, etc. Similarly, periodic background sync also
extends the lifetime of a web app's logic to run at regular periods for what
might be a few minutes at a time.

If the browser allowed this to occur frequently and without restrictions, it
could result in so me privacy concerns. Here's how Chrome has addressed this
risk for periodic background sync:

* The background sync activity only occurs on a network that the device has
  previously connected to. We recommend to only connect to networks operated by
  trustworthy parties.
* As with all internet communications, periodic background sync reveals the IP
  addresses of the client, the server it's talking to, and the name of the
  server. To reduce this exposure to roughly what it would be if the app only
  synced when it was in the foreground, the browser limits the frequency of an
  app's background syncs to align with how often the person uses that app. If
  the person stops frequently interacting with the app, periodic background sync
  will stop triggering. This is a net improvement over the status quo in native
  apps.

### When can it be used?

Rules for use vary by browser. To summarize from above, Chrome puts the
following requirements on periodic background sync:

* A particular user engagement score.
* Presence of a previously used network.

The timing of synchronizations are not controlled by developers. The
synchronization frequency will align with how often the app is used. (Note that
native apps currently don't do this.) It also takes into the device's power and
connectivity state.

### When should it be used?

When your service worker wakes up to handle a `periodicSync` event, you have the
_opportunity_ to request data, but not the _obligation_ to do so. When handling
the event you should take network conditions and available storage into
consideration and download different amounts of data in response. You can use
the following resources to help:

* [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
* [Detecting data saver mode](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/save-data/#detecting_the_save-data_setting)
* [Estimating available storage](https://developers.google.com/web/updates/2017/08/estimating-available-storage-space)

### Permissions

After the service worker is installed, use the [Permissions
API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API) to query
for `periodic-background-sync`. You can do this from either a window or a
service worker context.

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

### Registering a periodic sync

As already stated, periodic background sync requires a service worker. Retrieve
a `PeriodicSyncManager` using `ServiceWorkerRegistration.periodicSync` and call
`register()` on it. Registering requires both a tag and a minimum
synchronization interval (`minInterval`). The tag identifies the registered sync
so that multiple sync can be registered. In the example below, the tag name is
`'content-sync'` and the `minInterval` is one day.

```js/3-5
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  try {
    registration.periodicSync.register('content-sync', {
      // An interval of one day.
      minInterval: 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    // Periodic background sync cannot be used.
  }
}
```

### Verifying a registration

Call `periodicSync.getTags()` to retrieve an array of registration tags. The
example below uses tag names to confirm that cache updating is active to avoid
updating again.

```js/2,4
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

You can also use `getTags()` to show a list of active registrations in your web
app's settings page so that users can enable or disable specific types of
updates.

### Responding to a periodic background sync event

To respond to a periodic background sync event add a `periodicsync` event
handler to your service worker. The `event` object passed to it will contain a
`tag` parameter matching the value used during registration. For example a
periodic background sync was registered with the name `'content-sync'`, then
`event.tag` will be `'content-sync'`.

```js
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    // See the "Think before you sync" section for
    // checks you could perform before syncing.
    event.waitUntil(syncContent());
  }
  // Other logic for different tags as needed.
});
```

### Unregistering a sync

To end a registered sync, call `periodicSync.unregister()` with the name of the
sync you want to unregister.

```js
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  registration.periodicSync.unregister('content-sync');
}
```

## Interfaces

Here's a quick run down of the interfaces provided by the Periodic Background
Sync API.

<dl>
  <dt>PeriodicSyncEvent</dt>
  <dd>Passed to the `ServiceWorkerGlobalScope.onperiodicsync` event handler at a time of the browser's choosing.</dd>
  <dt>PeriodicSyncManager</dt>
  <dd>Registers and unregisters periodic syncs and provides tags for registered sync. Retrieve an instance of this class from the ServiceWorkerRegistration.periodicSync` property.</dd>
  <dt>ServiceWorkerGlobalScope.onperiodicsync</dt>
  <dd>Registers a handler to receive the `PeriodicSyncEvent`.</dd>
  <dt>ServiceWorkerRegistration.periodicSync</dt>
  <dd>Returns a reference to the `PeriodicSyncManager`.</dd>
</dl>

## Example

### Updating content

The following example uses periodic background sync to download and cache up-to-date articles for a news site or blog. Notice the tag name, which indicates the kind of sync this is (`'update-articles'`). The call to `updatearticles()` is wrapped in `event.waitUntil()` so that the service worker won't terminate before the articles are downloaded and stored.

```js/7
async function updateArticles() {
  const articlesCache = await caches.open('articles');
  await articlesCache.add('/api/articles');
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-articles') {
    event.waitUntil(updateArticles());
  }
});
```

## Current Status
## Current status

The table below explains the current status of the Periodic Background Sync API.

<table>
<tr>
<th markdown="block">
Step
</th>
<th markdown="block">
Status
</th>
</tr>
<tr>
<td markdown="block">
1. Create explainer
</td>
<td markdown="block">
<a href="https://github.com/beverloo/periodic-background-sync" >Complete</a>
</td>
</tr>
<tr>
<td markdown="block">
2. Create initial draft of specification
</td>
<td markdown="block">
In Progress
</td>
</tr>
<tr>
<td markdown="block">
3. Gather feedback and iterate on design
</td>
<td markdown="block">
In Progress
</td>
</tr>
<tr>
<td markdown="block">
<strong>4. Origin trial</strong>
</td>
<td markdown="block">
<strong><a href="https://developers.chrome.com/origintrials/#/view_trial/4048736065006075905">Started in Chrome 77<a></strong><br/>
Expected to run through Chrome 80
</td>
</tr>
<tr>
<td markdown="block">
5. Launch
</td>
<td markdown="block">
Not started
</td>
</tr>
</table>


## Privacy and Security Concerns

## Feedback
[Copy from original]
## Helpful Links
[Copy from original]
