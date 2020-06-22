---
layout: post
title: Service workers and the Cache Storage API
authors:
  - jeffposnick
date: 2018-11-05
updated: 2020-02-27
description: |
  The browser's HTTP cache is your first line of defense. It's not necessarily
  the most powerful or flexible approach, and you have limited control over the
  lifetime of cached responses. But there are several rules of thumb that give
  you a sensible caching implementation without much work, so you should always
  try to follow them.
---

You're locked in a struggle for network reliability. The browser's HTTP cache is
your first line of defense, but as you've learned, it's only really effective
when loading versioned URLs that you've previously visited. On its own, the HTTP
cache is not enough.

Fortunately, two newer tools are available to help turn the tide in your favor:
[service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
and the
[Cache Storage API](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage).
Since they're so often used together, it's worth learning about them both at the
same time.

## Service workers

A service worker is built into the browser and controlled by a bit of extra
JavaScript code that you are responsible for creating. You deploy this alongside
the other files that make up your actual web application.

A service worker has some special powers. Among other duties, it patiently waits
for your web app to make an outgoing request, and then springs into action by
intercepting it. What the service worker does with this intercepted request is
up to you.

For some requests, the best course of action might be just to allow the request
to continue on to the network, just like what would happen if there were no
service worker at all.

For other requests, though, you can take advantage of something more flexible
than the browser's HTTP cache, and return a reliably fast response without
having to worry about the network. That entails using the other piece of the
puzzle: the Cache Storage API.

## The Cache Storage API

The Cache Storage  API opens up a whole new range of possibilities, by giving
developers complete control over the contents of the cache. Instead of relying
on a combination of HTTP headers and the browser's built-in [heuristics](https://httpwg.org/specs/rfc7234.html#heuristic.freshness),
the Cache
Storage API exposes a code-driven approach to caching. The Cache Storage API
is particularly useful when called from your service worker's JavaScript.

### Wait… there's another cache to think about now?

You're probably asking yourself questions like "Do I still need to configure my
HTTP headers?" and "What can I do with this new cache that wasn't possible with
the HTTP cache?" Don't worry—those are natural reactions.

It's still recommended that you configure the `Cache-Control` headers on your web
server, even when you know that you're using the Cache Storage API. You can
usually get away with setting `Cache-Control: no-cache` for unversioned URLs,
and/or `Cache-Control: max-age=31536000` for URLs that contain versioning
information, like hashes.

When populating the Cache Storage API cache, the browser
[defaults to checking for existing entries](https://jakearchibald.com/2016/caching-best-practices/#the-service-worker-the-http-cache-play-well-together-dont-make-them-fight)
in the HTTP cache, and uses those if found. If you're adding versioned URLs to
the Cache Storage API cache, the browser avoids an additional network request. The
flip side of this is that if you're using misconfigured `Cache-Control` headers,
like specifying a long-lived cache lifetime for an unversioned URL, you can end
up
[making things worse](https://jakearchibald.com/2016/caching-best-practices/#a-service-worker-can-extend-the-life-of-these-bugs)
by adding that stale content to the Cache Storage API. Getting your HTTP cache
behavior sorted is a prerequisite for effectively using the Cache Storage API.

As for what's now possible with this new API, the answer is: a lot. Some common
uses that would be difficult or impossible with just the HTTP cache include:

+  Use a "refresh in the background" approach to cached content, known as
    stale-while-revalidate.
+  Impose a cap on the maximum number of assets to cache, and implement a
    custom expiration policy to remove items once that limit is reached.
+  Compare previously cached and fresh network responses to see if
    anything's changed, and enable the user to update content (with a button,
    for example)  when data has actually been updated.

Check out [The Cache API: A quick guide](/cache-api-quick-guide/) to learn more.

### API nuts and bolts

There are some things to keep in mind about the API's design:

+  [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)
    objects are used as the unique keys when reading and writing to these
    caches. As a convenience, you can pass in a URL string like
    `'https://example.com/index.html'` as the key instead of an actual
    `Request` object, and the API will automatically handle that for you.
+  [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
    objects are used as the values in these caches.
+  The `Cache-Control` header on a given `Response` is effectively ignored
    when caching data. There are no automatic, built-in expiration or freshness
    checks, and once you store an item in the cache, it will persist until your
    code explicitly removes it. (There are libraries to simplify cache
    maintenance on your behalf. They'll be covered later on in this series.)
+  Unlike with older, synchronous APIs such as
    [`LocalStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage),
    all Cache Storage API operations are asynchronous.

## A quick detour: promises and async/await

Service workers and the Cache Storage API use
[asynchronous programming concepts](https://en.wikipedia.org/wiki/Asynchrony_(computer_programming)).
In particular, they rely heavily on promises to represent the future result of
async operations. You should familiarize yourself with
[promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise),
and the related
[`async`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)/[`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
syntax, before diving in.

{% Aside 'codelab' %}
[Make an application reliable by registering a service worker](/codelab-service-workers).
{% endAside %}

## Don't deploy that code… yet

While they provide an important foundation, and can be used as-is, both service
workers and the Cache Storage API are effectively lower-level building blocks,
with a number of edge cases and "gotchas". There are some higher-level tools
that can help smooth the difficult bits of those APIs, and provide all you need
to build a production-ready service worker. The next guide covers one such tool:
[Workbox](https://developers.google.com/web/tools/workbox/).

{% Aside 'success' %}
Learn while having fun. Check out the new [Service Workies game!](https://serviceworkies.com/).
{% endAside %}
