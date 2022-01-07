---
title: Serving
description: >
  Using the service worker's fetch event, you can intercept network requests and serve a response using different techniques.
authors:
  - firt
date: 2022-01-10
---

One of the key aspects of Progressive Web Apps is that they're reliable; they can load assets quickly, keeping users engaged and providing feedback immediately, even under poor network conditions. How is that possible? Thanks to the service worker `fetch` event.

## The fetch event

The `fetch` event lets us intercept every network request made by the PWA in the service worker's scope, for both same-origin and cross-origin requests. Once the service worker is in control, it can catch navigation (HTML) requests and all other assets needed to render the initial page and the subsequent requests.

`fetch` receives an HTTP request including the URL and all the headers that were sent. The service worker intercepts those requests and decides how to respond.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/W16FjBqEhtxIUws8H5kO.png", alt="The service worker sits between the client and the network.", width="800", height="439" %}

Your service worker can forward the request to the network, respond with a previously cached response, or create a new response, the choice is yours.
The following code intercepts every request and logs its url:

```js
self.addEventListener("fetch", event => {
    console.log(`URL requested: ${event.request.url}`);
});
```

{% Aside 'caution' %}
While you can have more than one fetch event handler per service worker, only one can respond per request. For example, you can have different handlers that will act on different URL patterns. They are executed in the order they were registered until one of them calls `respondWith`.
{% endAside %}

## Responding to a request

When a request comes into your service worker, there are two things you can do; you can ignore it, in which case it will go to the network, or you can respond to it. Responding to requests from within your service worker is how you're able to choose what, and how it gets returned to your PWA, even when the user is offline.

To respond to an incoming request, call `event.respondWith` from within a `fetch` event handler, like this:

```js/3
// fetch event handler in your service worker file
self.addEventListener("fetch", event => {
    const response = .... // a response or a Promise of response
    event.respondWith(response);
});
```

`respondWith` must be called synchronously and must return a [Response](https://developer.mozilla.org/docs/Web/API/Response). Because you can't call `respondWith` after the fetch event handler has finished, like within an async call, if you need to wait for the complete response, you can instead pass a Promise into `respondWith` that will resolve with a Response.

### Creating responses

Thanks to the [Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API), you can create HTTP responses in your JavaScript code, and those responses can be cached in the Cache Storage as if they were coming from a web server.

To create a response, create a new `Response` object, setting its body and options, like status and headers:. 

```js
const simpleResponse = new Response("Body of the HTTP response");

const options = {
   status: 200,
   headers: {
	'Content-type': 'text/html'
   }
};
const htmlResponse = new Response("<b>HTML</b> content", options)
```

{% Aside 'warning' %}
When creating responses with a service worker, you need to be extra careful as buggy code can lead to corner cases and hard to debug issues, like when the browser can't even load the HTML document that will render your PWA. While debugging, you can always use your browser's reload button with the Shift key pressed, which will bypass the service worker; or use service worker devtools on supported browsers as we'll see in [Tools and Debug](/learn/pwa/tools-and-debug/).
{% endAside %}

{% Glitch 'mlearn-pwa-serving-synthesize' %}


### Responding from the cache

Now that you know how to serve HTTP responses from a service worker, 
it's time to go back to the Cache Storage interface used in the [Caching chapter](/learn/pwa/caching) to store assets on the device.

You can use the cache storage API to check if the request received from the PWA is available in the cache, and if it is, respond to `respondWith` with it.
To do that, you first need to search within the cache. The `match` function, available at the top-level `caches` interface searches all stores in your origin, or on a single open cache object.

The `match` function receives an HTTP request or a URL as an argument and it returns a promise of a Response associated with the corresponding key.

```js
// Global search on all caches in the current origin
caches.match(urlOrRequest).then(response => {
   console.log(response ? response : "It's not in the cache");
});

// Cache-specific search
caches.open("pwa-assets").then(cache => {
  cache.match(urlOrRequest).then(response) {
    console.log(response ? response : "It's not in the cache");
  }
});
```

{% Aside 'gotchas' %}
When using `match` with `respondWith`, the match promise will resolve either with the found item or with nothing. It will only reject if there was a problem that prevented the search operation from completing. To throw an error if no results are found, you'll need to inspect the results before returning a response to `respondWith`.
{% endAside %}

## Caching Strategies

Serving files only from the browser cache doesn't fit every use case, for example the user or the browser can evict the cache, that's why you should define your own strategies for delivering assets for your PWA. 
You don't need to provide only one strategy for all your requests, you can define different ones based on URL patterns. For example, one strategy for the minimum set of assets for rendering the UI, another approach for the API calls, and a third for image and data URLs.

{% Aside %}
To decide the strategy to be used, based on a URL pattern, you can read the `request.url` from the argument at the `fetch` event and parse it manually, through regular expressions or a [URL Pattern](/urlpattern/) on supported platforms.
{% endAside %}

The most common strategies are usually called:

Cache First
: Searches for a cached response first falling back to the network.  

Network First
: Requests a response from the network first and in case of failing to do so, checks for response in the cache.

Stale While Revalidate
: Serves a response from the cache, while in the background requests the latest version of the asset and saves it to the cache for the next time the asset is requested.

Network-Only
: Always replies with a response from the network or errors out. Never consults the cache.

Cache-Only
: Always replies with a response from the cache or errors out, will never consult the network. The assets that will be served using this strategy must be added to the cache before they are requested.

### Cache First

Using this strategy, the service worker checks to see if the request is in the cache and returns the corresponding response from the cache, otherwise it retrieves the response from the network (optionally, updating the cache for future calls). If there is neither a cache response nor a network response, the request will error. Since serving assets without going to the network tends to be faster, this strategy prioritizes performance over freshness.

{% Aside %}
Remember the cache storage interface won't send you a Response object, the reference will be `undefined`, if the request is not cached.
{% endAside %}

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/WOO3rRQZDIx2eLUBE3Wo.png", alt="The Cache First strategy in a diagram", width="800", height="439" %}

```js
self.addEventListener("fetch", event => {
   event.respondWith(
     caches.match(event.request).then(cachedResponse => {
	   // It can update the cache to serve updated content on the next request
         return cachedResponse || fetch(event.request);
     }
   )
  )
});
```

{% Glitch 'mlearn-pwa-serving-offline' %}

### Network First

This strategy is the mirror of the Cache First strategy; it checks if the request can be fulfilled from the network and, if it can't, tries to retrieve it from the cache. Like Cache First, if there is neither a network response nor a cache response, the request will error. Getting the response from the network is usually slower than getting it from the cache, this strategy prioritizes updated content instead of performance.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/f0elXWiI0avF7Nb8CwCH.png", alt="The Network First strategy in a diagram", width="800", height="439" %}

```js
self.addEventListener("fetch", event => {
   event.respondWith(
     fetch(event.request).catch(error => {
       return caches.match(event.request) ;
     })
   );
});
```

### Stale while revalidate

The stale while revalidate strategy first tries to respond with a cached response, and falls back to the network response if needed. This strategy always makes a network request, because even if a cached resource is found, it will try to update what was in the cache with what was received from the network, to use the updated version in the next request. This strategy, therefore, provides a way for you to benefit from the quick serving of the cache first strategy and update the cache in the background.

{% Aside %}
With this strategy, the assets are updated in the background. This means your users won't get the new version of the assets until the next time that path is requested. At that time the strategy will again check if a new version exists and the cycle repeats.
{% endAside %}

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/XJm7wA2rCfTmhYIIXPRR.png", alt="The Stale While Revalidate strategy in a diagram", width="800", height="439" %}

```js
self.addEventListener("fetch", event => {
   event.respondWith(
     caches.match(event.request).then(cachedResponse => {
         const networkFetch = fetch(event.request).then(response => {
           // update the cache with a clone of the network response
           caches.open("pwa-assets").then(cache => {
               cache.put(event.request, response.clone());
           });
         });
         // prioritize cached response over network
         return cachedResponse || networkFetch;
     }
   )
  )
});
```

{% Aside 'caution' %}
The Response's body is a [ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream), it can only be consumed once. That means that if you use the `fetch` API to deliver the response to the PWA because the asset was not cached, you can not re-use the same response for updating it in the cache. You'll need to clone the response so that you may use it twice.
{% endAside %}

{% Glitch 'mlearn-pwa-serving-stale-while-revalidate' %}

### Network Only

The network only strategy can be thought of as being similar to how browsers behave without the use of a service worker or the Cache Storage API. Requests will only be able to respond with a resource if it can be fetched from the network. This is often useful for resources like online-only API requests.


{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/k8FNm7zopERPFRiY8p2v.png", alt="The Network Only strategy in a diagram", width="800", height="439" %}


### Cache Only

The Cache Only strategy ensures that requests never go to the network; all incoming requests are responded to with a pre-populated cache item. The following code uses the `fetch` event handler with the `match` method of the cache storage to respond cache only:

```js
self.addEventListener("fetch", event => {
   event.respondWith(caches.match(event.request));
});
```

{% Aside %}
With a Cache only strategy you populate the cache with the assets you'll serve with the strategy before you need them, usually in the service worker's `install` event handler. Because this strategy never goes to the network, these assets will get updated only when you update your service worker and a new `install` event is fired.
{% endAside %}

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/xzCJEYBUdof34CbhDE29.png", alt="Cache Only strategy in a diagram.", width="800", height="439" %}

{% Glitch 'mlearn-pwa-serving-cache-only' %}

### Custom strategies

While the above are common caching strategies, you are in charge of your service worker and how requests are handled. If none of these work for your needs, create your own.

You can, for example, use a network first strategy with a timeout to prioritize updated content, but only if the response appears within a threshold you set, or you can merge a cached response with a network response and build a complex response for your PWA from the service worker.

## Updating assets

Keeping your PWA's cached assets up-to-date can be a challenge. While the stale while revalidate strategy is one way to do so, it's not the only one. In the [Update chapter](/learn/pwa/update) you will learn different techniques to keep your app's content and assets updated.

##  Resources

- [Fetch event on MDN](https://developer.mozilla.org/docs/Web/API/FetchEvent)
- [Service Worker Cookbook](https://serviceworke.rs/)
- [The Offline Cookbook](/offline-cookbook/)
- [Cache Match on MDN](https://developer.mozilla.org/docs/Web/API/Cache/match)
