---
title: Extending Workbox
subhead: >
  Write your own reusable, shareable strategies and plugins.
description: >
  Write your own reusable, shareable strategies and plugins.
authors:
  - jeffposnick
date: 2020-12-10
thumbnail: image/admin/XwmqHMJ27IY2gatiI6Ly.png
hero: image/admin/KW5Rgyo01HyimeALdCZD.png
alt: The Workbox logo.
tags:
  - blog
  - service-worker
  - offline
  - network
  - progressive-web-apps
  - performance
---

In this article, we're going to take a quick tour of some ways of extending
[Workbox](https://developers.google.com/web/tools/workbox). By the end, you'll
be writing your own strategies and plugins, and hopefully sharing them with the
world.

If you're more of a visual person, you can watch a recording of a Chrome
Dev Summit talk covering the same material:

{% YouTube 'jR9-aDWZeSE' %}

## What's Workbox?

At its core, Workbox is a set of libraries to help with common service worker
caching scenarios. And when we've written about Workbox in the past, the
emphasis has been on "common" scenarios. For most developers, the
[caching strategies](https://developers.google.com/web/tools/workbox/modules/workbox-strategies)
that Workbox already provides will handle your caching needs.

The built-in strategies include
[stale-while-revalidate](https://developers.google.com/web/tools/workbox/modules/workbox-strategies#stale-while-revalidate),
where a cached response is used to respond to a request immediately, while the
cache is also updated so that it's fresh the next time around. They also include
[network-first](https://developers.google.com/web/tools/workbox/modules/workbox-strategies#network_first_network_falling_back_to_cache),
falling back to the cache when the network is unavailable, and a few more.

## Custom strategies

But what if you wanted to go beyond those common caching scenarios? Let's cover
writing your own custom caching strategies.
[Workbox v6](https://github.com/GoogleChrome/workbox/releases/tag/v6.0.0) offers
a new [`Strategy` base class](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-strategies.Strategy) that sits in front of lower-level APIs, like
[Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and
[Cache Storage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage).
You can extend the `Strategy` base class, and then implement your own logic in
the [`_handle()` method](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-strategies.Strategy#_handle).

### Handle simultaneous, duplicate requests with DedupeNetworkFirst

For instance, imagine that you want to implement a strategy that can handle
multiple, simultaneous requests for the same URL by deduplicating them. A copy
of the response is then used to fulfill all of the in-flight requests, saving
bandwidth that would otherwise be wasted.

Here's the code you can use to implement that, by extending the [`NetworkFirst`
strategy](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-strategies.NetworkFirst) (which itself extends the `Strategy` base):

```javascript
// See https://developers.google.com/web/tools/workbox/guides/using-bundlers
import {NetworkFirst} from 'workbox-strategies';

class DedupeNetworkFirst extends NetworkFirst {
  constructor(options) {
    super(options);
    // This maps inflight requests to response promises.
    this._requests = new Map();
  }

  // _handle is the standard entry point for our logic.
  async _handle(request, handler) {
    let responsePromise = this._requests.get(request.url);

    if (responsePromise) {
      // If there's already an inflight request, return a copy
      // of the eventual response.
      const response = await responsePromise;
      return response.clone();
    } else {
      // If there isn't already an inflight request, then use
      // the _handle() method of NetworkFirst to kick one off.
      responsePromise = super._handle(request, handler);
      this._requests.set(request.url, responsePromise);
      try {
        const response = await responsePromise;
        return response.clone();
      } finally {
        // Make sure to clean up after a batch of inflight
        // requests are fulfilled!
        this._requests.delete(request.url);
      }
    }
  }
}
```

{% Aside %}
This code assumes that all requests for the same URL can be
satisfied with the same response, which won't always be the case if cookies or
session state information comes into play.
{% endAside %}

### Create a race between the cache and network with CacheNetworkRace

Here's another example of a custom strategy—one that's a twist on
stale-while-revalidate, where both the network and cache are checked at the same
time, with a race to see which will return a response first.

```javascript
// See https://developers.google.com/web/tools/workbox/guides/using-bundlers
import {Strategy} from 'workbox-strategies';

// Instead of extending an existing strategy,
// this extends the generic Strategy base class.
class CacheNetworkRace extends Strategy {
  // _handle is the standard entry point for our logic.
  _handle(request, handler) {
    // handler is an instance of the StrategyHandler class,
    // and exposes helper methods for interacting with the
    // cache and network.
    const fetchDone = handler.fetchAndCachePut(request);
    const matchDone = handler.cacheMatch(request);

    // The actual response generation logic relies on a "race"
    // between the network and cache promises.
    return new Promise((resolve, reject) => {
      fetchDone.then(resolve);
      matchDone.then((response) => response && resolve(response));

      // Promise.allSettled() is implemented in recent browsers.
      Promise.allSettled([fetchDone, matchDone]).then(results => {
        if (results[0].status === 'rejected' &&
            !results[1].value) {
          reject(results[0].reason);
        }  
      });
    });
  }
}
```

## StategyHandler: the recommended approach for creating custom strategies

Although it's not required, it's strongly recommended that when interacting with
the network or cache, you use the instance of the [`StrategyHandler` class](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-strategies.StrategyHandler) that's
passed to your `_handle()` method. It's the second parameter, called `handler`
in the example code.

This `StrategyHandler` instance will automatically pick up the cache name you've
configured for the strategy, and calling its methods will invoke the expected
plugin lifecycle callbacks that we'll describe soon.

A `StrategyHandler` instance supports the following methods:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>fetch</code></td>
        <td>Calls <code>fetch()</code>, invokes lifecycle events.</td>
      </tr>
      <tr>
        <td><code>cachePut</code></td>
        <td>Calls <code>cache.put()</code> on the configured cache, invokes lifecycle events.</td>
      </tr>
      <tr>
        <td><code>cacheMatch</code></td>
        <td>Calls <code>cache.match()</code> on the configured cache, invokes lifecycle events.</td>
      </tr>
      <tr>
        <td><code>fetchAndCachePut</code></td>
        <td>Calls <code>fetch()</code> and then <code>cache.put()</code> on the configured cache, invokes
        lifecycle events.</td>
      </tr>
    </tbody>
  </table>
</div>

### Drop-in support for routing

Writing a Workbox strategy class is a great way to package up response logic in
a reusable, and shareable, form. But once you've written one, how do you use it
within your larger Workbox service worker? That's the best part—you can drop any
of these strategies directly into your existing Workbox
[routing rules](https://developers.google.com/web/tools/workbox/guides/route-requests),
just like any of the "official" strategies.

```javascript
// See https://developers.google.com/web/tools/workbox/guides/using-bundlers
import {ExpirationPlugin} from 'workbox-expiration';
import {registerRoute} from 'workbox-routing';

// DedupeNetworkFirst can be defined inline, or imported.

registerRoute(
  ({url}) => url.pathname.startsWith('/api'),
  // DedupeNetworkFirst supports the standard strategy
  // configuration options, like cacheName and plugins.
  new DedupeNetworkFirst({
    cacheName: 'my-cache',
    plugins: [
      new ExpirationPlugin({...}),
    ]
  })
);
```

A properly written strategy should automatically work with all plugins as well.
This applies to the standard plugins that Workbox provides, like the one that
handles
[cache expiration](https://developers.google.com/web/tools/workbox/modules/workbox-expiration).
But you're not limited to using the standard set of plugins! Another great way
to extend Workbox is to write your own reusable plugins.

## Custom plugins

Taking a step back, what is a Workbox plugin, and why would you write your own?
A plugin doesn't fundamentally change the order of network and cache operations
performed by a strategy. Instead, it allows you to add in extra code that will
be run at critical points in the lifetime of a request, like when a network
request fails, or when a cached response is about to be returned to the page.

### Lifecycle event overview

Here's an overview of all the events that a plugin could listen to. Technical
details about implementing callbacks for these events is in the
[Workbox documentation](https://developers.google.com/web/tools/workbox/guides/using-plugins).

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Lifecycle Event</th>
        <th>Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>cacheWillUpdate</code></td>
        <td>Change response before it's written to cache.</td>
      </tr>
      <tr>
        <td><code>cacheDidUpdate</code></td>
        <td>Do something following a cache write.</td>
      </tr>
      <tr>
        <td><code>cacheKeyWillBeUsed</code></td>
        <td>Override the cache key used for reads or writes.</td>
      </tr>
      <tr>
        <td><code>cachedResponseWillBeUsed</code></td>
        <td>Change response read from cache before it's used.</td>
      </tr>
      <tr>
        <td><code>requestWillFetch</code></td>
        <td>Change request before it's sent to the network.</td>
      </tr>
      <tr>
        <td><code>fetchDidFail</code></td>
        <td>Do something when a network request fails.</td>
      </tr>
      <tr>
        <td><code>fetchDidSucceed</code></td>
        <td>Do something when a network request succeeds.</td>
      </tr>
      <tr>
        <td><code>handlerWillStart</code></td>
        <td>Take note of when a handler starts up.</td>
      </tr>
      <tr>
        <td><code>handlerWillRespond</code></td>
        <td>Take note of when a handler is about to respond.</td>
      </tr>
      <tr>
        <td><code>handlerDidRespond</code></td>
        <td>Take note of when a handler finishes responding.</td>
      </tr>
      <tr>
        <td><code>handlerDidComplete</code></td>
        <td>Take note of when a handler has run all its code.</td>
      </tr>
      <tr>
        <td><code>handlerDidError</code></td>
        <td>Provide a fallback response if a handler throws an error.</td>
      </tr>
    </tbody>
  </table>
</div>

When writing your own plugin, you'll only implement callbacks for the limited
number of events that match your purpose—there's no need to add in callbacks for
_all_ of the possible events. Additionally, it's up to you whether you implement
your plugin as an
<code>[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)</code>
with properties that match the lifecycle event names, or as a class that exposes
methods with those names.

### Lifecycle events example: FallbackOnErrorPlugin

For instance, here's a custom plugin class that implements callback methods for
two events: `fetchDidSucceed`, and `handlerDidError`.

```javascript
class FallbackOnErrorPlugin {
  constructor(fallbackURL) {
    // Pass in a URL that you know is cached.
    this.fallbackURL = fallbackURL;
  }

  fetchDidSucceed({response}) {
    // If the network request returned a 2xx response,
    // just use it as-is.
    if (response.ok) {
      return response;
    };

    // Otherwise, throw an error to trigger handlerDidError.
    throw new Error(`Error response (${response.status})`);
  }

  // Invoked whenever the strategy throws an error during handling.
  handlerDidError() {
    // This will match the cached URL regardless of whether
    // there's any query parameters, i.e. those added
    // by Workbox precaching.
    return caches.match(this.fallbackURL, {
      ignoreSearch: true,
    });
  }
}
```

This plugin class provides a "fallback" whenever a strategy would otherwise
generate an error response. It can be added to any strategy class, and if
running that strategy does not result in a `2xx OK` response, it will use a
backup response from the cache instead.

## Custom strategy or custom plugin?

Now that you know more about custom strategies and plugins, you might be
wondering which one to write for a given use case.

A good rule of thumb is to sketch out a diagram of your desired request and
response flow, taking into account the network and cache interactions. Then,
compare that to the
[diagrams](https://developers.google.com/web/tools/workbox/modules/workbox-strategies)
of the built-in strategies. If your diagram has a set of connections then that's
fundamentally different, that's a sign that a custom strategy is the best
solution.

Conversely, if your diagram ends up looking mostly like a standard strategy but
with a few extra pieces of logic injected at keys points, then you should
probably write a custom plugin.

## Takeaways

Whichever approach to customizing Workbox you go with, I hope this article has
inspired you write your own strategies and plugins, and then release them on
[npm](https://www.npmjs.com/), tagged with `workbox-strategy` or
`workbox-plugin`.

Using those tags, you can search npm for
[strategies](https://www.npmjs.com/search?q=workbox-strategy) and
[plugins](https://www.npmjs.com/search?q=workbox-plugin) that have already been
released.

Go out there and extend Workbox, and then share what you build!
