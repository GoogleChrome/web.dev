---
layout: codelab
title: Implement runtime caching
author: mdiblasio
date: 2019-05-07
description: |
  In this section you'll learn how to implement runtime caching with a service
  worker to cache external assets.
glitch: spot-bottle
web_lighthouse: N/A
---

In previous sections of this project you learned how to create a
[Workbox](https://developers.google.com/web/tools/workbox/)-based service
worker that precaches essential assets from your app and handles navigation
requests. In this section you'll learn how to add runtime caching so that your
service worker can cache external assets. For this project, you'll set up your
app to fetch and cache Wikipedia articles and images.

{% Aside %}
If you've finished previous sections of this project in your own Glitch, you
can continue working in it. Otherwise, you can use the Glitch provided here.
{% endAside %}

Runtime caching refers to gradually adding responses to a cache as the browser
requests them. While runtime caching doesn't help with the reliability of the
current request, it can help make future requests for the same URL more
reliable.

When implementing runtime caching, choose the most appropriate caching strategy
for each asset type that your app uses. Workbox has the following caching
strategies built in:

+  __Stale While Revalidate__

   This strategy uses a cached response for a request if it is available and
   updates the cache in the background with a response from the network. (If
   the response isn't cached, Workbox will wait for the network response and
   use that.) This is a fairly safe strategy as it means users are regularly
   updating their cache. The downside is that Workbox requests an asset from
   the network in all cases, using up the user's bandwidth.

+  __Network First__

   This strategy tries to get a request from the network first. If it receives
   a response, it'll pass that to the browser and also save it to the cache.
   If the network request fails, the last cached response is used.

+  __Cache First__

   This strategy checks the cache for a response first and uses that if one is
   available. If the response isn't in the cache, the network will be used and
   any valid response will be added to the cache before being passed to the
   browser.

+  __Network Only__

   Force the response to come from the network.

+  __Cache Only__

   Force the response to come from the cache.

To choose an appropriate caching strategy for Wikipedia articles, it's
important to consider that most articles are updated fairly infrequently:
+  __Network-first__ is best for requests that are updated frequently, so this
   strategy wouldn't serve articles from the cache for instant repeat views.
+  __Cache-first__ could work, but assuming Wikipedia articles are updated
   somewhat regularly, users could receive stale content indefinitely.
+  __Stale-while-revalidate__ will serve articles from the cache to
   dramatically improve the load time of subsequent views, while keeping
   articles up-to-date. This is an ideal choice for this use case.

To implement a __stale-while-revalidate__ runtime caching strategy, call
`workbox.routing.registerRoute(match, handler)` to register a route in
`src/service-worker.js`:

```js
// cache Wikimedia REST API calls
workbox.routing.registerRoute(
  new RegExp("\/api\/wiki"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'wiki-articles'
  })
);
```

The first parameter, `new RegExp("\/api\/wiki")`, is a regular expression used
to match against the full URL. If a requested URL matches the expression, the
route will be triggered.

The second parameter is Workbox's built-in
[`StaleWhileRevalidate` handler](https://developers.google.com/web/tools/workbox/modules/workbox-strategies#stale-while-revalidate).
The `cacheName` option sets a custom cache name for the specified assets, which
makes it convenient to manage related groups of assets.

This route will match against all Wikimedia REST API requests and apply a
__stale-while-revalidate__ caching strategy. To see it in action, update the
service worker by refreshing the page and search for a Wikipedia article. You
should see two Wikimedia REST API requests:

<figure class="w-figure w-figure--center">
  <img class="w-screenshot" src="./wiki-api-requests.png" alt="A screenshot
  showing the two requests to the Wikimedia REST API made by the sample app.">
</figure>

The first request is from the client but is handled by the service worker. The
second request is made from the service worker to the network and responds to
the client. In the DevTools console, you should see Workbox messages confirming
that the __stale-while-revalidate__ strategy was applied:

<figure class="w-figure w-figure--center">
  <img class="w-screenshot" src="./stale-while-revalidate.png" alt="A
  screenshot of the DevTools console showing messages confirming that the
  stale-while-revalidate strategy was applied.">
</figure>

In the __Cache Storage__ panel of the __Application__ tab in DevTools, you
should now see a new cache named `wiki-api` that contains the Wikipedia article:

<figure class="w-figure w-figure--center">
  <img class="w-screenshot" src="./wiki-api-cache.png" alt="A screenshot
  of Chrome DevTools showing that the wiki-api cache has been created.">
</figure>

Since the service worker will return this Wikipedia article from the cache on
repeat visits, repeat searches for this same article will be dramatically
faster. In the __Network__ tab in DevTools, filter by XHR requests and complete
another search for the same article.

Notice that the repeat search is near instant! You can see that the service
worker immediately responded to the client's request from the cache while
fetching an updated copy in the background:

<figure class="w-figure w-figure--center">
  <img class="w-screenshot" src="./service-worker-responds.png" alt="A
  screenshot of Chrome DevTools showing that the service worker responded to
  the client request for a Wikipedia article.">
</figure>

Now refresh the page and search for the same article once more, this time while
offline. While the Wikipedia page itself is now cached and available offline,
users will see broken images since this runtime cache policy doesn't match
against Wikipedia image URLs:

<figure class="w-figure w-figure--center">
  <img class="w-screenshot" src="./broken-images.png" alt="A screenshot
  of Chrome DevTools showing that the Wikipedia images couldn't be retrieved.">
</figure>

To improve this experience, add another route to runtime cache Wikipedia image
assets, which take the form `https://upload.wikimedia.org/…(png|svg|jpeg|jpg)`.
Note that these assets are from a different origin.

For the sample app we'll assume Wikipedia images are unlikely to change and use
a __cache-first__ strategy. This requires assigning a separate cache name,
`wiki-images`:

```js
// cache Wikipedia article image assets
workbox.routing.registerRoute(
  new RegExp("https?:\/\/upload\.wikimedia\.org\/.*\.(png|jpg|svg|jpeg)$"),
  new workbox.strategies.CacheFirst({
    cacheName: 'wiki-images'
  })
);
```

One concern with this strategy is that the cache size can quickly grow out of
control if users view many image-heavy articles. To control storage size, use
the [workbox.expiration.Plugin](https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.expiration.Plugin)
to enforce a limit on the age and number of cached image requests.

```js
// cache Wikipedia article image assets
workbox.routing.registerRoute(
  new RegExp("https?:\/\/upload\.wikimedia\.org\/wikipedia\/.*\.(png|jpg|svg|jpeg)$", "i"),
  new workbox.strategies.CacheFirst({
    cacheName: 'wiki-images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 500, // max 500 images
        maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
      })
    ]
  })
);
```

A quick explanation of the parameters:
+  `maxAgeSeconds` specifies the maximum age of an entry before it's treated as
   stale and removed, in this case 30 days.
+  `maxEntries` specifies the maximum number of entries to cache, in this case
   500. Entries used the least will be removed as the maximum is reached.

Whenever a cached request is used or updated, this plugin will look at the used
cache and remove any old or extra requests.

{% Aside %}
When using maxAgeSeconds, requests may be used once after expiring because the
expiration clean up will not have occurred until after the cached request has
been used. If the request has a "Date" header, then a light weight expiration
check is performed and the request will not be used immediately.
{% endAside %}

Try viewing a cached article while offline to verify the image assets are
served offline from the cache!

## What's next
[Create an offline fallback](../codelab-reliability-offline-fallback/)
