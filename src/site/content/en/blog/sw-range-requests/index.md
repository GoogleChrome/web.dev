---
title: Handling range requests in a service worker
subhead: Make sure your service worker knows what to do when a partial response is requested.
authors:
  - jeffposnick
description: Make sure your service worker knows what to do when a partial response is requested.
date: 2020-10-06
updated: 2020-10-06
hero: image/admin/5HWlDEheVYh9LAs0p8vg.jpg
hero_position: center
alt: |
  Photo of sliced cucumbers.
tags:
  - blog
  - audio
  - caching
  - media
  - offline
  - service-worker
  - video
feedback:
  - api
---

Some HTTP requests contain a [`Range:` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range), indicating that only a portion of the full resource should be returned. They're commonly used for streaming audio or video content to allow smaller chunks of media to be loaded on demand, instead of requesting the entirety of the remote file all at once.

A [service worker](https://developers.google.com/web/fundamentals/primers/service-workers) is JavaScript code that sits in between your web app and the network, potentially intercepting outgoing network requests and generating responses for them.

Historically, range requests and service workers haven't played nicely together. It's been necessary to take special steps to avoid bad outcomes in your service worker. Fortunately, this is starting to change. In browsers exhibiting the correct behavior, range requests will "just work" when passing through a service worker.

## What's the issue?

Consider a service worker with the following `fetch` event listener, which takes every incoming request and passes it to the network:

```javascript
self.addEventListener('fetch', (event) => {
  // The Range: header will not pass through in
  // browsers that behave incorrectly.
  event.respondWith(fetch(event.request));
});
```

{% Aside %}
This sort of trivial `fetch` event listener should [normally be avoided](https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#never_use_a_passthrough_fetch_handler); it's used here for illustrative purposes.
{% endAside %}

In browsers with the incorrect behavior, if `event.request` included a `Range:` header, that header would be silently dropped. The request that was received by the remote server would not include `Range:` at all. This would not necessarily "break" anything, since a server is _technically_ allowed to return the full response body, with a [`200` status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200), even when a `Range:` header is present in the original request. But it would result in more data being transferred than is strictly needed from the perspective of the browser.

Developers who were aware of this behavior could work around it by explicitly checking for the presence of a `Range:` header, and not calling `event.respondWith()` if one is present. By doing this, the service worker effectively removes itself from the response generation picture, and the default browser networking logic, which knows how to preserve range requests, is used instead.

```javascript
self.addEventListener('fetch', (event) => {
  // Return without calling event.respondWith()
  // if this is a range request.
  if (event.request.headers.has('range')) {
    return;
  }

  event.respondWith(fetch(event.request));
});
```

It's safe to say that most developers were not aware of the need to do this, though. And it wasn't clear _why_ that should be required. Ultimately, this limitation was due to [browsers](https://bugs.chromium.org/p/chromium/issues/detail?id=847428) needing to catch up to [changes in the underlying specification](https://github.com/whatwg/fetch/pull/560), which added support for this functionality.

## What's been fixed?

Browsers that behave correctly preserve the `Range:` header when `event.request` is passed to `fetch()`. This means the service worker code in my initial example will allow the remote server to see the `Range:` header, if it was set by the browser:

```javascript
self.addEventListener('fetch', (event) => {
  // The Range: header will pass through in browsers
  // that behave correctly.
  event.respondWith(fetch(event.request));
});
```

The server now gets a chance to properly handle the range request and return a partial response with a [`206` status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206).

## Which browsers behave correctly?

Recent versions of Safari have the [correct functionality](https://trac.webkit.org/changeset/252047/webkit). Chrome and Edge, starting with [version 87](https://chromestatus.com/feature/5648276147666944), behave correctly as well.

As of this October 2020, Firefox has not yet fixed this behavior, so you may still need to account for it while deploying your service worker's code to production.

Checking the "Include range header in network request" row of the [Web Platform Tests dashboard](https://wpt.fyi/results/fetch/range/sw.https.window.html?label=master&label=experimental&aligned) is the best way to confirm whether or not a given browser has corrected this behavior.

## What about serving range requests from the cache?

Service workers can do much more than just pass a request through to the network. A common use case is to add resources, like audio and video files, to a [local cache](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage). A service worker can then fulfill requests from that cache, bypassing the network entirely.

All browsers, including Firefox, support inspecting a request inside a `fetch` handler, checking for the presence of the `Range:` header, and then locally fulfilling the request with a [`206` response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206) that comes from a cache. The service worker code to properly parse the `Range:` header and return only the appropriate segment of the complete cached response is not trivial, though.

Fortunately, developers who want some help can turn to [Workbox](https://developers.google.com/web/tools/workbox/), which is a set of libraries that simplifies common service worker use cases. The [`workbox-range-request module`](https://developers.google.com/web/tools/workbox/modules/workbox-range-requests) implements all the logic necessary to serve partial responses directly from the cache. A full recipe for this use case can be found [in the Workbox documentation](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#cached-av).

_The hero image on this post is by [Natalie Rhea Riggs](https://unsplash.com/photos/OnAwTs0tu3k) on Unsplash._
