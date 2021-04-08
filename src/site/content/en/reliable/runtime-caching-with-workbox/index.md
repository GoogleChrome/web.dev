---
layout: post
title: Runtime caching with Workbox
authors:
  - jeffposnick
date: 2018-11-05
description: |
  Runtime caching refers to gradually adding responses to a cache "as you go".
  While runtime caching doesn't help with the reliability of the current
  request, runtime caching with Workbox can help make future requests for the
  same URL more reliable.
feedback:
  - api
---

Runtime caching refers to gradually adding responses to a cache "as you go".
While runtime caching doesn't help with the reliability of the _current_
request, it can help make _future_ requests for the same URL more reliable.

The browser's HTTP cache is an example of runtime caching; it's only populated
after a request for a given URL. But service workers allow you to implement
runtime caching that goes beyond what the HTTP cache alone can offer.

## Getting strategic

As opposed to [precaching](/precache-with-workbox/) (which always tries
to serve a set of predefined files from a cache), runtime caching can combine
network and cache access in multiple ways. Each combination is generally
referred to as a caching strategy. Key caching strategies include:

+  Network-first
+  Cache-first
+  Stale-while-revalidate

### Network-first

In this approach, your service worker first attempts to retrieve a response from
the network. If the network request succeeds, great! The response is returned to
your web app, and a copy of the response is stored using the Cache Storage
API—either creating a new entry, or updating a previous entry for the same
URL.

{% Img src="image/admin/AyTKqrG1aBH2JOkz3LzL.png", alt="Diagram showing the request going from the page to the service worker and from the service worker to the network. The network request fails so the request goes to the cache.", width="800", height="388" %}

If the network request fails entirely, or
[takes too long](https://developers.google.com/web/tools/workbox/guides/common-recipes#force_a_timeout_on_network_requests)
to return a response, then the most recent response from the cache is returned
instead.

### Cache-first

A cache-first strategy is effectively the opposite of network-first. In this
approach, when your service worker intercepts a request, it first uses the Cache
Storage API to see whether there's a cached response available. If there is,
that response is returned to the web app.

If there's a cache miss, though, then the service worker will go to the network
and attempt to retrieve a response there. Assuming that network request is
successful, it's returned to your web app and a copy is saved in a cache. This
cached copy will be used to bypass the network the next time a request for the
same URLs is made.

{% Img src="image/admin/HR4BhK1uWqjve9bC5h6u.png", alt="Diagram showing the request going from the page to the service worker and from the service worker to the cache. The cache request fails so the request goes to the network.", width="800", height="395" %}

### Stale-while-revalidate

Stale-while-revalidate is something of a hybrid. When using it, your service
worker will immediately check for a cached response and, if one is found, pass
it back to your web app.

In the meantime, regardless of whether there was a cache match, your service
worker also fires off a network request to get back a "fresh" response. This
response is used to update any previously cached response. If the initial cache
check was a miss, a copy of the network response is also passed back to your web
app.

{% Img src="image/admin/lPpEfVFxdd9qGqLIx1gy.png", alt="Diagram showing the request going from the page to the service worker and from the service worker to the cache. The cache immediately returns a response while also fetching an update from the network for future requests.", width="800", height="388" %}

### Why should you use Workbox?

These caching strategies amount to recipes that you would normally have to
rewrite in your own service worker, again and again. Instead of resorting to
that, Workbox offers them packaged up as part of its
[strategies library](https://developers.google.com/web/tools/workbox/modules/workbox-strategies),
ready for you to drop in to your service worker.

Workbox also provides versioning support, allowing you to automatically
[expire](https://developers.google.com/web/tools/workbox/modules/workbox-cache-expiration)
cached entries, or notify your web app when
[updates](https://developers.google.com/web/tools/workbox/modules/workbox-broadcast-cache-update)
to a previously cached entry occur.

## Which of your assets should be cached, with which strategies?

Runtime caching can be viewed as a complement to precaching. If all of your
assets are already being precached, then you're done—there's nothing that needs
to be cached at runtime. Chances are, for any relatively complex web app, you're
not going to be precaching _everything_ though.

Larger media files, assets that are served from a third-party host like a CDN,
or API responses, are just a few examples of the types of assets that can't be
effectively precached. Use the Network panel in DevTools to identify requests
that fall into this category, and for each of them, think about what tradeoff of
freshness vs. reliability is appropriate.

### Use stale-while-revalidate to prioritize reliability over freshness

Since a stale-while-revalidate strategy returns a cached response almost
immediately—after the cache has been populated via the first request—you'll end
up seeing reliably fast performance when using this strategy. This comes with
the tradeoff of getting back response data that could be stale in comparison to
what would have been retrieved from the network. Using this strategy works best
for assets like user profile images or the initial API responses used to
populate a view, when you know that showing something _immediately_ is key, even
if it's an older value.

### Use network-first to prioritize freshness over reliability

In some sense, using a network-first strategy is admitting defeat in your battle
against the network—it's given priority, but that brings with it uncertainty
about reliability. For certain types of assets, seeing a fresh response is
preferable to getting back stale information. You might prefer freshness when
making an API request for the text of an article that is updated frequently, for
instance.

By using a network-first strategy inside of a service worker, instead of just
going against the network directly, you have the benefit of being able to fall
back to _something_, even if it's a potentially stale response. You won't be
reliably fast, but at least you'll be reliable while offline.

### Use cache-first for versioned URLs

In a cache-first strategy, once an entry is cached, it's never updated. For that
reason, make sure that you only use it with assets that you know are unlikely to
change. In particular, it works best for URLs that contain versioning
information—the same sort of URLs that should also be served with a
`Cache-Control: max-age=31536000` response header.
