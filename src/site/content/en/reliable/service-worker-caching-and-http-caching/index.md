---
layout: post
title: Service worker caching and HTTP caching
subhead: >
  The pros and cons of using consistent or different expiry logic across the service worker
  cache and HTTP cache layers.
authors:
  - jonchen
date: 2020-07-17
description: >
  The pros and cons of using consistent or different expiry logic across the service worker
  cache and HTTP cache layers.
tags:
  - blog
  - network
  - service-worker
  - offline
---

While service workers and PWAs are becoming standards of modern web applications, resource caching
has become more complex than ever. This article covers the big picture of browser caching,
including:

+   The use cases of and differences between service worker caching and HTTP caching.
+   The pros and cons of different service worker caching expiry strategies compared to regular
    HTTP caching strategies.

## Overview of caching flow

At a high-level, a browser follows the caching order below when it requests a resource:

1.  **Service worker cache**: The service worker checks if the resource is in its cache and
    decides whether to return the resource itself based on its programmed caching strategies. Note
    that this does not happen automatically. You need to create a fetch event handler in your
    service worker and intercept network requests so that the requests are served from the service
    worker's cache rather than the network. 
1.  **HTTP cache (also known as the browser cache)**: If the resource is found in the [HTTP
    Cache](/http-cache) and has not yet expired, the browser automatically uses the
    resource from the  HTTP cache.
1.  **Server-side:** If nothing is found in the service worker cache or the HTTP cache, the
    browser goes to the network to request the resource. If the resource isn't cached in a CDN, the
    request must go all the way back to the origin server. 

{% Img src="image/admin/vtKWC9Bg9dAMzoFKTeAM.png", alt="Caching flow", width="800", height="585" %}

{% Aside %}Note that some browsers like Chrome have a **memory cache** layer in front of the service
worker cache. The details of the memory cache depend on each browser's implementation.
Unfortunately, there is no clear specification for this part yet.{% endAside %}

## Caching layers

### Service worker caching

A service worker intercepts network-type HTTP requests and uses a
[caching strategy](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#serving-suggestions)
to determine what resources should be returned to the browser. The service worker cache and the HTTP
cache serve the same general purpose, but the service worker cache offers more caching capabilities,
such as fine-grained control over exactly what is cached and how caching is done.

#### Controlling the service worker cache

A service worker intercepts HTTP requests with [event
listeners](https://github.com/mdn/sw-test/blob/gh-pages/sw.js#L19) (usually the `fetch` event). This
[code snippet](https://github.com/mdn/sw-test/blob/gh-pages/sw.js#L19) demonstrates the logic of a
[Cache-First](https://developers.google.com/web/tools/workbox/modules/workbox-strategies#cache_first_cache_falling_back_to_network)
caching strategy. 

{% Img src="image/admin/INLfnhEpmL4KpMmFXnTL.png", alt="A diagram showing how service workers intercept HTTP requests", width="800", height="516" %}

It's highly recommended to use [Workbox](https://developers.google.com/web/tools/workbox) to avoid
reinventing the wheel. For example, you can
[register resource URL paths with a single line of regex code](https://developers.google.com/web/tools/workbox/modules/workbox-routing#how_to_register_a_regular_expression_route).

```js
import {registerRoute} from 'workbox-routing';

registerRoute(new RegExp('styles/.*\\.css'), callbackHandler);
```

#### Service worker caching strategies and use cases

The next table outlines common service worker caching strategies and when each strategy is useful.

<table>
<thead>
<tr>
<th><strong>Strategies</strong></th>
<th><strong>Freshness rationale</strong></th>
<th><strong>Use cases</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong><a
href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-only">Network
only</strong></a></td>
<td>The content has to be up-to-date at all times.</td>
<td><ul><li>Payments and checkouts</li>
<li>Balance statements</li>
</ul>
</td>
</tr>
<tr>
<td><strong><a
href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-falling-back-to-cache">Network
falling back to cache </strong></a></td>
<td>It's preferable to serve the fresh content. However if the network fails or is unstable, it's
acceptable to serve slightly old content.</td>
<td><ul><li>Timely data</li>
<li>Prices and rates (requires disclaimers)</li>
<li>Order statuses</li>
</ul>
</td>
</tr>
<tr>
<td><strong><a
href="/stale-while-revalidate/">Stale-while-revalidate</strong></a>
</td>
<td>It's okay to serve cached content right away, but updated cached content should be used in the
future.</td>
<td><ul><li>News feeds</li>
<li>Product listing pages</li>
<li>Messages</li>
</ul>
</td>
</tr>
<tr>
<td><strong><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-then-network">Cache first, fall back to network</a></strong></td>
<td>The content is non-critical and can be served from the cache for performance gains, but the
service worker should occasionally check for updates.</td>
<td><ul><li>App shells</li>
<li>Common resources</li>
</ul>
</td>
</tr>
<tr>
<td><strong><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-only">Cache only</a></strong></td>
<td>The content rarely changes.</td>
<td><ul><li>Static content</li>
</ul>
</td>
</tr>
</tbody>
</table>

#### Additional benefits of service worker caching

In addition to fine-grained control of caching logic, service worker caching also provides:

+   **More memory and storage space for your origin:** The browser allocates HTTP cache
    resources on a per-[origin](/same-site-same-origin/#origin) basis. In other
    words, if you have multiple subdomains, they all share the same HTTP cache. There is no
    guarantee that the content of your origin/domain stays in the HTTP cache for a long time. For
    example, a user may purge the cache by manually cleaning up from a browser's settings UI, or
    triggering a hard-reload on a page. With a service worker cache you have a much higher
    likelihood that your cached content stays cached. See [Persistent
    storage](https://developers.google.com/web/updates/2016/06/persistent-storage) to learn more.
+   **Higher flexibility with flaky networks or offline experiences:** With the HTTP cache you
    only have a binary choice: either the resource is cached, or not. With service worker caching
    you can mitigate little "hiccups" much easier (with the "stale-while-revalidate" strategy),
    offer a complete offline experience (with the "Cache only" strategy) or even something in
    between, like customized UIs with parts of the page coming from the service worker cache and
    some parts excluded (with the "Set catch handler" strategy) where appropriate.

### HTTP caching

The first time a browser loads a web page and related resources, it stores these resources in its
HTTP cache. The HTTP cache is usually enabled automatically by browsers, unless it has been
explicitly disabled by the end user. 

Using HTTP caching means relying on the server to determine when to cache a resource and for how
long.

#### Control HTTP cache expiry with HTTP response headers

When a server responds to a browser request for a resource, the server uses HTTP response headers to
tell a browser how long it should cache the resource. See [Response headers: configure your web
server](/http-cache/#response-headers) to learn more.

#### HTTP caching strategies and use cases

HTTP caching is much simpler than service worker caching, because HTTP caching only deals with
time-based (TTL) resource expiration logic. See
[Which response header values should you use?](/http-cache/#response-header-strategies)
and [Summary](/http-cache/#summary) to learn more about HTTP caching strategies.

## Designing your cache expiry logic

This section explains the pros and cons of using consistent expiry logic across the service worker
cache and HTTP cache layers, as well as the pros and cons of separate expiry logic across these
layers.

The Glitch below demonstrates how service worker caching and HTTP caching work in action across
different scenarios:

{% Glitch {
  id: 'compare-sw-and-http-caching',
  height: 480
} %}

### Consistent expiry logic for all cache layers

To demonstrate the pros and cons, we'll look at 3 scenarios: long-term, medium-term, and
short-term.

<table>
<thead>
<tr>
<th>Scenarios</th>
<th>Long-term caching</th>
<th>Medium-term caching</th>
<th>Short-term caching</th>
</tr>
</thead>
<tbody>
<tr>
<td>Service worker caching strategy</td>
<td>Cache, falling back to network</td>
<td>Stale-while-revalidate</td>
<td>Network falling back to cache</td>
</tr>
<tr>
<td>Service worker cache TTL</td>
<td><strong>30 days</strong></td>
<td><strong>1 day</strong></td>
<td><strong>10 mins</strong></td>
</tr>
<tr>
<td>HTTP cache max-age</td>
<td><strong>30 days</strong></td>
<td><strong>1 day</strong></td>
<td><strong>10 mins</strong></td>
</tr>
</tbody>
</table>

#### Scenario: Long-term caching (Cache, falling back to network)

+   When a cached resource is valid (<= 30 days): The service worker returns the cached
    resource immediately without going to the network. 
+   When a cached resource is expired (> 30 days): The service worker goes to the network to
    fetch the resource. The browser doesn't have a copy of the resource in its HTTP cache, so it
    goes server-side for the resource.

Con: In this scenario, HTTP caching provides less value because the browser will always
pass the request to the server-side when the cache expires in the service worker.

#### Scenario: Medium-term caching (Stale-while-revalidate)

+   When a cached resource is valid (<= 1 day): The service worker returns the cached
    resource immediately, and goes to the network to fetch the resource. The browser has a copy of
    the resource in its HTTP cache, so it returns that copy to the service worker.
+   When a cached resource is expired (> 1 day): The service worker returns the cached
    resource immediately, and goes to the network to fetch the resource. The browser doesn't have a
    copy of the resource in its HTTP cache, so it goes server-side to fetch the resource.

Con: The service worker requires additional cache-busting to override the HTTP cache in
order to make the most of the "revalidate" step.

#### Scenario: Short-term caching (Network falling back to cache)

+   When a cached resource is valid (<= 10 mins): The service worker goes to the network
    to fetch the resource. The browser has a copy of the resource in its HTTP cache so it returns
    that to the service worker without going server-side.
+   When a cached resource is expired (> 10 mins): The service worker returns the cached
    resource immediately, and goes to the network to fetch the resource. The browser doesn't have a
    copy of the resource in its HTTP cache, so it goes server-side to fetch the resource.

Con: Similar to the medium-term caching scenario, the service worker requires additional
cache-busting logic to override the HTTP cache in order to fetch the latest resource from the
server-side.

#### Service worker in all scenarios

In all scenarios, the service worker cache can still return cached resources when the network is
unstable. On the other hand, the HTTP cache is not reliable when the network is unstable or down.

### Different cache expiry logic at the service worker cache and HTTP layers 

To demonstrate the pros and cons, we'll again look at long-term, medium-term, and short-term
scenarios.

<table>
<thead>
<tr>
<th>Scenarios</th>
<th>Long-term caching</th>
<th>Medium-term caching</th>
<th>Short-term caching</th>
</tr>
</thead>
<tbody>
<tr>
<td>Service worker caching strategy</td>
<td>Cache, falling back to network</td>
<td>Stale-while-revalidate</td>
<td>Network falling back to cache</td>
</tr>
<tr>
<td>Service worker cache TTL</td>
<td><strong>90 days</strong></td>
<td><strong>30 days</strong></td>
<td><strong>1 day</strong></td>
</tr>
<tr>
<td>HTTP cache max-age</td>
<td><strong>30 days</strong></td>
<td><strong>1 day</strong></td>
<td><strong>10 mins</strong></td>
</tr>
</tbody>
</table>

#### Scenario: Long-term caching (Cache, falling back to network)

+   When a cached resource is valid in the service worker cache (<= 90 days): The service
    worker returns the cached resource immediately.
+   When a cached resource is expired in the service worker cache (> 90 days): The service
    worker goes to the network to fetch the resource. The browser doesn't have a copy of the
    resource in its HTTP cache, so it goes server-side.

Pros and cons:

+   Pro: Users experience instant response as the service worker returns cached resources
    immediately.
+   Pro: The service worker has more fine-grained control of when to use its cache and when
    to request new versions of resources.
+   Con: A well-defined service worker caching strategy is required.

#### Scenario: Mid-term caching (Stale-while-revalidate)

+   When a cached resource is valid in the service worker cache (<= 30 days): The service
    worker returns the cached resource immediately.
+   When a cached resource is expired in the service worker cache (> 30 days): The service
    worker goes to the network for the resource. The browser doesn't have a copy of the resource in
    its HTTP cache, so it goes server-side.

Pros and cons:

+   Pro: Users experience instant response as the service worker returns cached resources
    immediately.
+   Pro: The service worker can ensure that the **next** request for a given URL uses a
    fresh response from the network, thanks to the revalidation that happens "in the background."
+   Con: A well-defined service worker caching strategy is required.

#### Scenario: Short-term caching (Network falling back to cache)

+   When a cached resource is valid in the service worker cache (<= 1 day): The service
    worker goes to the network for the resource. The browser returns the resource from the HTTP
    cache if it's there. If the network is down, the service worker returns the resource from the
    service worker cache
+   When a cached resource is expired in the service worker cache (> 1 day): The service
    worker goes to the network to fetch the resource. The browser fetches the resources over the
    network as the cached version in its HTTP cache is expired.

Pros and cons:

+   Pro: When the network is unstable or down, the service worker returns cached
    resources immediately.
+   Con: The service worker requires additional cache-busting to override the HTTP Cache and
    make "Network first" requests.

## Conclusion

Given the complexity of the combination of caching scenarios, it's not possible to design one rule
that covers all cases. However, based on the findings in the previous sections, there are a few
suggestions to look at when designing your cache strategies:

+   Service worker caching logic doesn't need to be consistent with HTTP caching expiry
    logic. If possible, use longer expiry logic in the service worker to grant the service worker
    more control.
+   HTTP caching still plays an important role, but it's not reliable when the network is
    unstable or down.
+   Revisit your caching strategies for each resource to make sure your service worker caching
    strategy provides its value, without conflicting with the HTTP cache.

## Learn more

+   [Network reliability](/reliable/)
+   [Prevent unnecessary network requests with the HTTP Cache](/http-cache)
+   [HTTP cache codelab](/codelab-http-cache/)
+   [Measuring the real-world performance impact of service workers](https://developers.google.com/web/showcase/2016/service-worker-perf)
+   [Cache-Control vs. Expires](https://stackoverflow.com/questions/5799906/what-s-the-difference-between-expires-and-cache-control-headers)