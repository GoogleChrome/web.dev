---
layout: codelab
title: Building resilient search experiences with Workbox
authors:
  - demianrenzulli
  - jeffposnick
date: 2020-06-23
description: |
  How to implement a resilient search experience with Workbox, using  Background Sync and the Push API.
glitch: resilient-search-codelab
related_post: resilient-search-experiences
---

This codelab shows you how to implement a resilient search experience with Workbox. The demo app it uses contains a search box that calls a server endpoint, and redirects the user to a basic HTML page.

{% Aside %} 
This codelab uses [Chrome DevTools](https://www.google.com/chrome/). Download Chrome if you don't already have it. 
{% endAside %}

## Measure

Before adding optimizations, it's always a good idea to first analyze the current state of the application.

{% Instruction 'remix' %}
{% Instruction 'preview' %}

In the new tab that just opened, check how the website behaves when going offline:

{% Instruction 'devtools-network', 'ol' %}
1. Open Chrome DevTools and select the Network panel.
1. In the [Throttling drop-down list](https://developers.google.com/web/tools/chrome-devtools/network/reference#throttling), select **Offline**.
1. In the demo app enter a search query, then click the **Search** button.

The standard browser error page is shown:

{% Img src="image/admin/g4Naxj1RnipuqxqzC62x.png", alt="A screenshot of the default offline UX in the browser.", width="800", height="465" %}

## Provide a fallback response

The service worker contains the code to add the offline page to the [precache list](https://developers.google.com/web/tools/workbox/modules/workbox-precaching#explanation_of_the_precache_list), so it can always be cached at the service worker `install` event.

Usually you would need to instruct Workbox to add this file to the precache list at build time, by integrating the library with your build tool of choice (e.g. [webpack](https://webpack.js.org/) or [gulp](https://gulpjs.com/)).

For simplicity, we've already done it for you. The following code at `public/sw.js` does that:

```javascript
const FALLBACK_HTML_URL = ‘/index_offline.html’;
…
workbox.precaching.precacheAndRoute([FALLBACK_HTML_URL]);
```

{% Aside %} 
To learn more about how to integrate Workbox with build tools, check out the [webpack Workbox plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin) and the [Gulp Workbox plugin](https://developers.google.com/web/tools/workbox/guides/codelabs/gulp).
{% endAside %}

Next, add code to use the offline page as a fallback response:

{% Instruction 'source', 'ol' %}
1. Add the following code to the bottom of `public/sw.js`:

```javascript
workbox.routing.setDefaultHandler(new workbox.strategies.NetworkOnly());

workbox.routing.setCatchHandler(({event}) => {
  switch (event.request.destination) {
    case 'document':
      return caches.match(FALLBACK_HTML_URL);
      break;
    default:
      return Response.error();
  }
});
```

{% Aside %}
  The Glitch UI says `workbox is not defined` because it doesn't realize that the
  `importScripts()` call on line 1 is importing the library.
{% endAside %}

The code does the following:

- Defines a default [Network Only strategy](https://developers.google.com/web/tools/workbox/modules/workbox-strategies#network_only) that will apply to all requests.
- Declares a global error handler, by calling `workbox.routing.setCatchHandler()` to manage failed requests. When requests are for documents, a fallback offline HTML page will be returned.

To test this functionality:

1. Go back to the other tab that is running your app.
1. Set the **Throttling** drop-down list back to **Online**.
1. Press Chrome's **Back** button to navigate back to the search page.
1. Make sure that the **Disable cache** checkbox in DevTools is disabled.
1. Long-press Chrome's **Reload** button and select
   [**Empty cache and hard reload**](https://stackoverflow.com/q/14969315/1669860)
   to ensure that your service worker is updated.
1. Set the **Throttling** drop-down list back to **Offline** again.
1. Enter a search query, and click the **Search** button again.

The fallback HTML page is shown:

{% Img src="image/admin/2o0feM6Ib4GnLdKQqV9G.png", alt="A screenshot of the custom offline UX in the browser.", width="800", height="456" %}

## Request notification permission

For simplicity, the offline page at `views/index_offline.html` already contains the code to request notification permissions in a script block at the bottom:

```javascript
function requestNotificationPermission(event) {
  event.preventDefault();

  Notification.requestPermission().then(function (result) {
    showOfflineText(result);
  });
}
```

The code does the following:

- When the user clicks **subscribe to notifications** the `requestNotificationPermission()` function is called, which calls `Notification.requestPermission()`, to show the default browser permission prompt. The promise resolves with the permission picked by the user, which can be either `granted`, `denied`, or `default`.
- Passes the resolved permission to  `showOfflineText()` to show the appropriate text to the user.

## Persist offline queries and retry when back online

Next, implement [Workbox Background Sync](https://developers.google.com/web/tools/workbox/modules/workbox-background-sync) to persist offline queries, so they can be retried when the browser detects that connectivity has returned.

1. Open `public/sw.js` for edit.
1. Add the following code at the end of the file:

```javascript
const bgSyncPlugin = new workbox.backgroundSync.Plugin('offlineQueryQueue', {
  maxRetentionTime: 60,
  onSync: async ({queue}) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        const response = await fetch(entry.request);
        const cache = await caches.open('offline-search-responses');
        const offlineUrl = `${entry.request.url}&notification=true`;
        cache.put(offlineUrl, response);
        showNotification(offlineUrl);
      } catch (error) {
        await this.unshiftRequest(entry);
        throw error;
      }
    }
  },
});
```

The code does the following:

- `workbox.backgroundSync.Plugin` contains the logic to add failed requests to a queue so they can be retried later. These requests will be persisted in [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).
- `maxRetentionTime` indicates the amount of time a request may be retried. In this case we have chosen 60 minutes (after which it will be discarded).
- `onSync` is the most important part of this code. This callback will be called when connection is back so that queued requests are retrieved and then fetched from the network. 
- The network response is added to the `offline-search-responses` cache, appending the `&notification=true` query param, so that this cache entry can be picked up when a user clicks on the notification.

To integrate background sync with your service, define a [NetworkOnly](https://developers.google.com/web/tools/workbox/modules/workbox-strategies#network_only) strategy for requests to the search URL (`/search_action`) and pass the previously defined `bgSyncPlugin`. Add the following code to the bottom of `public/sw.js`:

```javascript
const matchSearchUrl = ({url}) => {
  const notificationParam = url.searchParams.get('notification');
  return url.pathname === '/search_action' && !(notificationParam === 'true');
};

workbox.routing.registerRoute(
  matchSearchUrl,
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
);
```

This tells Workbox to always go to the network, and, when requests fail, use the background sync logic.

Next, add the following code to the bottom of `public/sw.js` to define a caching strategy for requests coming from notifications. Use a [CacheFirst](https://developers.google.com/web/tools/workbox/modules/workbox-strategies#cache_first_cache_falling_back_to_network) strategy, so they can be served from the cache.

```javascript
const matchNotificationUrl = ({url}) => {
  const notificationParam = url.searchParams.get('notification');
  return (url.pathname === '/search_action' && (notificationParam === 'true'));
};

workbox.routing.registerRoute(matchNotificationUrl,
  new workbox.strategies.CacheFirst({
     cacheName: 'offline-search-responses',
  })
);
```

Finally, add the code to show notifications:

```javascript
function showNotification(notificationUrl) {
  if (Notification.permission) {
     self.registration.showNotification('Your search is ready!', {
        body: 'Click to see you search result',
        icon: '/img/workbox.jpg',
        data: {
           url: notificationUrl
        }
     });
  }
}

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
     clients.openWindow(event.notification.data.url)
  );
});
```

## Test the feature

1. Go back to the other tab that is running your app.
1. Set the **Throttling** drop-down list back to **Online**.
1. Press Chrome's **Back** button to navigate back to the search page.
1. Long-press Chrome's **Reload** button and select
   [**Empty cache and hard reload**](https://stackoverflow.com/q/14969315/1669860)
   to ensure that your service worker is updated.
1. Set the **Throttling** drop-down list back to **Offline** again.
1. Enter a search query, and click the **Search** button again.
1. Click **subscribe to notifications**.
1. When Chrome asks you if you want to grant the app permission to send notifications,
   click **Allow**.
1. Enter another search query and click the **Search** button again.
1. Set the **Throttling** drop-down list back to **Online** again.

Once the connection is back a notification will be shown:

{% Img src="image/admin/kvnl2PlazBdppGF4eMi0.png", alt="A screenshot of the full offline flow.", width="800", height="315" %}

## Conclusion

Workbox provides many built-in features to make your PWAs more resilient and engaging.
In this codelab you have explored how to implement the Background Sync API by way of the Workbox abstraction, to ensure that offline user queries are not lost, and can be retried once connection is back.
The demo is a simple search app, but you can use a similar implementation for more complex scenarios and use cases, including chat apps, posting messages on a social network, etc.
