---
title: Caching
description: >
  You can use the Cache Storage API to download, store, delete or update assets on the device. Then these assets can be served on the device without needing a network request.
authors:
  - firt
date: 2021-12-03
updated: 2022-03-02
---

Cache storage is a powerful tool. It makes your apps less dependent on network conditions. With good use of caches you can make your web app available offline and serve your assets as fast as possible in any network condition. As mentioned in [Assets and Data](/learn/pwa/assets-and-data/) you can decide the best strategy for caching the necessary assets. To manage the cache your service worker interacts with the [Cache Storage API](https://developer.mozilla.org/docs/Web/API/CacheStorage).
{% BrowserCompat 'api.CacheStorage' %}

{% Aside %}
When installing platform-specific apps, the device stores the icon and other app assets in the operating system, in one step. For PWAs, the process has two separate steps. A PWA can store assets on your device any time after the first visit in the browser, even without installation. Install is a separate action that is covered later in this course.
{% endAside %}

The Cache Storage API is available from different contexts:

- The window context (your PWA's main thread).
- The service worker.
- Any other workers you use.

One advantage of managing your cache using service workers is that its lifecycle is not tied to the window, which means you are not blocking the main thread. Be aware that to use the Cache Storage API most of these contexts have to be under a TLS connection.

## What to cache

The first question you may have about caching is what to cache. While there is no single answer to that question, you can start with all the minimum resources that you need to render the user interface.

Those resources should include:

- The main page HTML (your app's start_url).
- CSS stylesheets needed for the main user interface.
- Images used in the user interface.
- JavaScript files required to render the user interface.
- Data, such as a JSON file, required to render a basic experience.
- Web fonts.
- On a multi-page application, other HTML documents that you want to serve fast or while offline.

{% Aside 'warning' %}
Remember that you are downloading and storing assets on users' devices, so use that space and bandwidth responsibly. You need to find the balance between having enough on-device assets to render a fast or offline experience without consuming too much data.
{% endAside %}

### Offline-ready

While being offline-capable is one of the requirements for a Progressive Web App, it's essential to understand that not every PWA needs a full offline experience, for example cloud gaming solutions or crypto assets apps. Therefore, it's OK to offer a basic user interface guiding your users through those situations.

Your PWA should not render a browser's error message saying that the web rendering engine couldn't load the page. Instead use your service worker to show your own messaging, avoiding a generic and confusing browser error.

{% Aside 'caution' %}
If you [publish your PWA to Google Play Store](https://chromeos.dev/en/publish/pwa-in-play), your PWA should never render an HTTP error message from the browser to avoid penalizations within the store listings. Check [Changes to Quality Criteria for PWAs](https://blog.chromium.org/2020/06/changes-to-quality-criteria-for-pwas.html) for more information.
{% endAside %}

There are many different caching strategies you could use depending on the needs of your PWA. That's why it is important to design your cache usage to provide a fast and reliable experience. For example if all your app assets will download fast, don't consume a lot of space, and don't need to be updated in every request, caching all your assets would be a valid strategy. If on the other hand you have resources that need to be the latest version you might want to consider not caching those assets at all.

{% Aside 'caution' %}
The cache storage content and eviction rules are set per origin and not per PWA, since it's possible to have more than one in a single origin. If you share your origin for many PWAs, it's a good idea to add a prefix to your cache names to avoid collision problems between each PWA's data storage.
{% endAside %}

## Using the API

Use the Cache Storage API to define a set of caches within your origin, each identified with a string name you can define. Access the API through the `caches` object, and the `open` method enables the creation, or opening of an already created cache. The open method returns a promise for the cache object.

```js
caches.open("pwa-assets")
.then(cache => {
  // you can download and store, delete or update resources with cache arguments
});
```

### Downloading and storing assets

To ask the browser to download and store the assets use the `add` or `addAll` methods. The `add` method makes a request and stores one HTTP response, and `addAll` a group of HTTP responses as a transaction based on an array of requests or URLs.

```js
caches.open("pwa-assets")
.then(cache => {
  cache.add("styles.css"); // it stores only one resource
  cache.addAll(["styles.css", "app.js"]); // it stores two resources
});
```

{% Aside %}
Both `add()` and `addAll()` return a promise with no arguments; if it's fulfilled, you know the assets were downloaded and cached, and if it fails, the API couldn't download one or more resources, and it didn't modify the cache.
{% endAside %}

The cache storage interface stores the entirety of a response including all the headers and the body. Consequently, you can retrieve it later using an HTTP request or a URL as a key. You will see how to do that in [the Serving chapter](/learn/pwa/serving).

{% Aside %}
To download and store the assets, you must specify all the URLs explicitly. Otherwise the API cannot know all the assets you need or want to cache.
{% endAside %}

### When to cache

In your PWA, you are in charge of deciding when to cache files. While one approach is to store as many assets as possible when the service worker is installed, it is usually not the best idea. Caching unnecessary resources wastes bandwidth and storage space and could cause your app to serve unintended outdated resources.

You don't need to cache all the assets at once, you can cache assets many times during the lifecycle of your PWA, such as:

- On installation of the service worker.
- After the first page load.
- When the user navigates to a section or route.
- When the network is idle.

You can request caching new files in the main thread or within the service worker context.

### Caching assets in a service worker

One of the most common scenarios is to cache a minimum set of assets when the service worker is installed. To do that, you can use the cache storage interface within the `install` event in the service worker.

Because the service worker thread can be stopped at any time, you can request the browser to wait for the `addAll` promise to finish to increase the opportunity of storing all the assets and keeping the app consistent. The following example demonstrates how to do this, using the  `waitUntil` method of the event argument received in the service worker event listener.

```js/3,5
const urlsToCache = ["/", "app.js", "styles.css", "logo.svg"];
self.addEventListener("install", event => {
   event.waitUntil(
      caches.open("pwa-assets")
      .then(cache => {
         return cache.addAll(urlsToCache);
      });
   );
});
```

The [`waitUntil()` method](https://developer.mozilla.org/docs/Web/API/ExtendableEvent/waitUntil) receives a promise and asks the browser to wait for the task in the promise to resolve (fulfilled or failed) before terminating the service worker process. You may need to chain promises and return the `add()` or `addAll()` calls so that a single result gets to the `waitUntil()` method.

You can also handle promises using the async/await syntax. In that case, you need to create an asynchronous function that can call `await` and that returns a promise to `waitUntil()` after it's called, as in the following example:

```js/3
const urlsToCache = ["/", "app.js", "styles.css", "logo.svg"];
self.addEventListener("install", (event) => {
   event.waitUntil((async () => {
      const cache = await caches.open("pwa-assets");
      return cache.addAll(urlsToCache);
   })());
});
```

### Cross-domain requests and opaque responses

Your PWA can download and cache assets from your origin and cross-domains, such as content from third-party CDNs. With a cross-domain app, the cache interaction is very similar to same-origin requests. The request is executed and a copy of the response is stored in your cache. As with other cached assets it is only available to be used in your app's origin.

The asset will be stored as an [opaque response](https://fetch.spec.whatwg.org/#concept-filtered-response-opaque), which means your code won't be able to see or modify the contents or headers of that response. Also, opaque responses don't expose their actual size in the storage API, affecting quotas. Some browsers expose large sizes, such as 7Mb no matter if the file is just 1Kb.

{% Aside 'caution' %}
Remember that when you cache opaque responses from cross-domains, `cache.add()` and `cache.addAll()` will fail if those responses don't return with a 2xx status code. Therefore, if one CDN or cross-domain fails, all the assets you are downloading will be discarded, even successful downloads in the same operation.
{% endAside %}

### Updating and deleting assets

You can update assets using `cache.put(request, response)` and delete assets with `delete(request)`.

{% Aside 'caution' %}
The Cache Storage API doesn't update your assets if you change them on your server nor does it delete them. Your code should manage both situations, and for that, there are different design patterns. You'll learn about a library to help with these situations in the [Workbox chapter](/learn/pwa/workbox).
{% endAside %}

Check the [Cache object documentation](https://developer.mozilla.org/docs/Web/API/Cache) for more details.

{% Glitch 'learn-pwa-asset-caching' %}

## Debugging Cache Storage
Many browsers offer a way to debug the contents of cache storage within their DevTools Application tab. There, you can see the contents of every cache within the current origin. We'll cover more about these tools in the [Tools and Debug chapter](/learn/pwa/tools-and-debug/).

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/wY3mk9ILrGxlM9xEbfHh.png", alt="Chrome DevTools debugging Cache Storage contents.", width="800", height="506" %}

{% Aside %}
Web Inspector on Safari on macOS doesn't have a way to see the contents of cache storage. For that purpose, you can use the free [Service Worker Detector Safari extension](https://apps.apple.com/app/service-worker-detector/id1530808337?l=en&mt=12) created by [Thomas Steiner](https://twitter.com/tomayac).
{% endAside %}

##  Resources

- [Cache Storage on MDN](https://developer.mozilla.org/docs/Web/API/CacheStorage)
- [The Cache API: A quick guide](/cache-api-quick-guide/)
- [The Offline Cookbook](/offline-cookbook/)
