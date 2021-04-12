---
title: Richer offline experiences with the Periodic Background Sync API
subhead:
  Sync your web app's data in the background for a more-like experience
authors:
  - jeffposnick
  - joemedley
date: 2019-11-10
updated: 2020-08-18
hero: image/admin/Bz7MndcsUGPLAnQwIMfJ.jpg
alt: Colorful airplanes flying in sync
origin_trial:
  url: https://developers.chrome.com/origintrials/#/view_trial/4048736065006075905
description: |
  Periodic Background Sync enables web applications to periodically
  synchronize data in the background, bringing web apps closer to the behavior
  of an iOS/Android/desktop app.
tags:
  - capabilities
  - blog
  - progressive-web-apps
  - service-worker
  - chrome80
feedback:
  - api
---

{% Aside %}
  Web apps should be able to do anything iOS/Android/desktop apps can. The
  [Capabilities project](https://developers.google.com/web/updates/capabilities),
  of which Periodic Background Sync is only a part, aims
  to do just that. To learn about other capabilities and to keep up with their
  progress, follow [Unlocking new capabilities for the
  web](https://developers.google.com/web/updates/capabilities).
{% endAside %}

Have you ever been in any of the following situations?

* Riding a train or subway with flaky or no connectivity
* Been throttled by your carrier after watching too many videos
* Living in a country where bandwidth struggles to keep up with the demand

If you have, then you've surely felt the frustration of getting
certain things done on the web, and wondered why platform-specific apps so often do better
in these scenarios. Platform-specific apps can fetch fresh content such as news articles or weather
information ahead of time. Even if there's no network in the subway, you can still read the
news.

Periodic Background Sync enables web applications to periodically synchronize
data in the background, bringing web apps closer to the behavior of a platform-specific
app.

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
<a href="https://github.com/WICG/BackgroundSync/tree/master/explainers" >Complete</a>
</td>
</tr>
<tr>
<td markdown="block">
2. Create initial draft of specification
</td>
<td markdown="block">
<a href="https://wicg.github.io/periodic-background-sync/" rel="noopener">Complete</a>
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
4. Origin trial
</td>
<td markdown="block">
Complete
</td>
</tr>
<tr>
<td markdown="block">
<strong>5. Launch</strong>
</td>
<td markdown="block">
<strong>Chrome 80</strong>
</td>
</tr>
</table>

## Try it

You can try periodic background sync with the [live demo
app](https://webplatformapis.com/periodic_sync/periodicSync_improved.html).
Before using it, make sure that:

* You're using Chrome 80 or later.
* You
  [install](https://developers.google.com/web/fundamentals/app-install-banners/)
  the web app before enabling periodic background sync.

## Concepts and usage

Periodic background sync lets you show fresh content when a progressive web app
or service worker-backed page is launched. It does this by downloading data in
the background when the app or page is not being used. This prevents the app's
content from refreshing after launch while it's being viewed. Better yet, it
prevents the app from showing a content spinner before refreshing.

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

### Getting user engagement right

Done incorrectly, periodic background sync could be wasteful of users'
resources. Before releasing it, Chrome put it through a trial period to make
sure it was right. This section explains some of the design decisions Chrome
took to make this feature as helpful as possible.

The first design decision Chrome made is that a web app can only use periodic
background sync after a person has installed it on their device, and has
launched it as a distinct application. Periodic background sync is not available
in the context of a regular tab in Chrome.

Furthermore, since Chrome doesn't want unused or seldom used web apps to gratuitously
consume battery or data, Chrome designed periodic background sync such that
developers will have to earn it by providing value to their users. Concretely,
Chrome is using a [site engagement score](https://www.chromium.org/developers/design-documents/site-engagement)
(`chrome://site-engagement/`) to determine if and how often periodic background syncs can happen
for a given web app. In other words, a `periodicsync` event won't be fired at all unless the engagement
score is greater than zero, and its value affects the frequency at which the
`periodicsync` event fires. This ensures that the only apps syncing in the
background are the ones you are actively using.

Periodic background sync shares some similarities with existing APIs and
practices on popular platforms. For instance, one-off background sync as well as
push notifications allow a web app's logic to live a little longer (via its
service worker) after a person has closed the page. On most platforms, it's
common for people to have installed apps that periodically access the network in
the background to provide a better user experience for critical updates,
prefetching content, syncing data, and so on. Similarly, periodic background sync also
extends the lifetime of a web app's logic to run at regular periods for what
might be a few minutes at a time.

If the browser allowed this to occur frequently and without restrictions, it
could result in some privacy concerns. Here's how Chrome has addressed this
risk for periodic background sync:

* The background sync activity only occurs on a network that the device has
  previously connected to. Chrome recommends to only connect to networks operated by
  trustworthy parties.
* As with all internet communications, periodic background sync reveals the IP
  addresses of the client, the server it's talking to, and the name of the
  server. To reduce this exposure to roughly what it would be if the app only
  synced when it was in the foreground, the browser limits the frequency of an
  app's background syncs to align with how often the person uses that app. If
  the person stops frequently interacting with the app, periodic background sync
  will stop triggering. This is a net improvement over the status quo in platform-specific
  apps.

### When can it be used?

Rules for use vary by browser. To summarize from above, Chrome puts the
following requirements on periodic background sync:

* A particular user engagement score.
* Presence of a previously used network.

The timing of synchronizations are not controlled by developers. The
synchronization frequency will align with how often the app is used. (Note that
platform-specific apps currently don't do this.) It also takes into the device's power and
connectivity state.

### When should it be used?

When your service worker wakes up to handle a `periodicsync` event, you have the
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
so that multiple syncs can be registered. In the example below, the tag name is
`'content-sync'` and the `minInterval` is one day.

```js/3-5
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  try {
    await registration.periodicSync.register('content-sync', {
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
`tag` parameter matching the value used during registration. For example if a
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
  await registration.periodicSync.unregister('content-sync');
}
```

## Interfaces

Here's a quick run down of the interfaces provided by the Periodic Background
Sync API.

* `PeriodicSyncEvent`. Passed to the `ServiceWorkerGlobalScope.onperiodicsync` event handler at a
  time of the browser's choosing.
* `PeriodicSyncManager`. Registers and unregisters periodic syncs and provides tags for registered
  syncs. Retrieve an instance of this class from the ServiceWorkerRegistration.periodicSync`
  property.
* `ServiceWorkerGlobalScope.onperiodicsync`. Registers a handler to receive the `PeriodicSyncEvent`.
* `ServiceWorkerRegistration.periodicSync`. Returns a reference to the `PeriodicSyncManager`.

## Example

### Updating content

The following example uses periodic background sync to download and cache up-to-date articles for a news site or blog. Notice the tag name, which indicates the kind of sync this is (`'update-articles'`). The call to `updateArticles()` is wrapped in `event.waitUntil()` so that the service worker won't terminate before the articles are downloaded and stored.

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

### Adding periodic background sync to an existing web app

[This set of changes](https://github.com/GoogleChromeLabs/so-pwa/pull/11) were needed to add
periodic background sync to an [existing PWA](https://so-pwa.firebaseapp.com/). This example includes a number of helpful logging statements that describe the
state of periodic background sync in the web app.

## Debugging

It can be a challenge to get and end-to-end view of periodic background sync
while testing locally. Information about active registrations, approximate sync
intervals, and logs of past sync events provide valuable context while debugging
your web app's behavior. Fortunately, you can find all of that information
through an experimental feature in Chrome DevTools.

{% Aside %}
  Periodic background sync debugging is enabled in Chrome 81 and later.
{% endAside %}

### Recording local activity

The **Periodic Background Sync** section of DevTools is organized around key events
in the periodic background sync lifecycle: registering for sync, performing a
background sync, and unregistering. To obtain information about these events,
click **Start recording**.

<figure class="w-figure">
  {% Img src="image/admin/wcl5Bm6Pe9xn5Dps6IN6.png", alt="The record button in DevTools", width="708", height="90", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    The record button in DevTools
  </figcaption>
</figure>

While recording, entries will appear in DevTools corresponding to events, with
context and metadata logged for each.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/m92Art0OwiM0VyI7czFB.png", alt="An example of recorded periodic background sync data", width="800", height="357", class="w-screenshot", style="max-width: 75%" %}
  <figcaption class="w-figcaption">
    An example of recorded periodic background sync data
  </figcaption>
</figure>

After enabling recording once, it will stay enabled for up to three days,
allowing DevTools to capture local debugging information about background syncs
that might take place, even hours in the future.

### Simulating events

While recording background activity can be helpful, there are times when you'll
want to test your `periodicsync` handler immediately, without waiting for an
event to fire on its normal cadence.

You can do this via the **Service Workers** section within the Application panel in
Chrome DevTools. The **Periodic Sync** field allows you to provide a tag for the
event to use, and to trigger it as many times as you'd like.

{% Aside %}
  Manually triggering a `periodicsync` event requires Chrome 81 or later.
{% endAside %}

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BQ5QdjwaRDP42cHqW98W.png", alt="The 'Service Workers' section of the Application panel shows a 'Periodic Sync' text field and button.", width="800", height="321", class="w-screenshot", style="max-width: 90%" %}
</figure>

## Using the DevTools interface

Starting in Chrome 81, you'll see a **Periodic Background Sync** section in the
DevTools *Application* panel.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eYJtJfZ9Qo145lUQe4Ur.png", alt="The Application panel showing the Periodic Background Sync section", width="382", height="253", class="w-screenshot", style="max-width: 75%" %}
</figure>
