---
layout: post
title: Handling navigation requests
subhead: |
  Respond to navigation requests without waiting on the network by using
  a service worker.
authors:
  - jeffposnick
date: 2020-07-13
hero: image/admin/YekhsmFaDpnxwhG14CQv.jpg
alt: Picture of a compass.
description: |
  Navigation requests are requests for HTML made whenever you enter a new URL in the navigation bar,
  or follow a link on a page. This is where service workers make their biggest impact on
  performance: by using a service worker to respond without waiting for the network, you can ensure
  that navigations are reliably fast and resilient.
tags:
  - blog
  - network
  - service-worker
  - offline
feedback:
  - api
---

Navigation requests are requests for HTML documents made by your browser whenever you enter a new
URL in the navigation bar, or follow a link on a page taking you to a new URL. This is where service
workers make their biggest impact on performance: if you use a service worker to respond to
navigation requests without waiting for the network, you can ensure that navigations are reliably
fast, in addition to being resilient when the network is unavailable. This is the single biggest
performance win that comes from a service worker, versus what's possible with [HTTP
caching](/http-cache/).

As detailed in the [Identify resources loaded from the
network](/identify-resources-via-network-panel/) guide, a navigation request is the first of
potentially many requests made in the
["waterfall"](https://developers.google.com/web/tools/chrome-devtools/network/reference#waterfall)
of network traffic. The HTML that you load via a navigation request kicks off the flow of all other
requests for subresources like images, scripts, and styles. 

Inside of a service worker's `fetch` event handler, you can determine whether a request is a
navigation by checking the `request.mode` property on the `FetchEvent`. If it's set to `'navigate'`,
then it's a navigation request.

As a general rule, do not use long-lived <code>[Cache-Control headers](/http-cache/)</code> to cache
the HTML response for a navigation request. They should normally be satisfied via the network, with
<code>Cache-Control: no-cache</code>, to ensure that the HTML, along with the chain of subsequent
network requests, is (reasonably) fresh. Going against the network each time the user navigates to a
new page unfortunately means that each navigation <em>might</em> be slow. At the very least, it
means that it won't be <em>reliably</em> fast.

{% Aside %}
`Cache-Control: no-cache` means the browser must check (or "revalidate") with the server before
using a previously cached resource. This requires a round-trip network communication to complete
before the resource can be used.
{% endAside %}

## Different approaches for architectures

Figuring out _how_ to respond to navigation requests while avoiding the network can be tricky. The
right approach depends very much on your web site's architecture and the number of unique URLs that
users might navigate to.

While there's no one-size-fits all solution, the following general guidelines should help you decide
which approach is the most viable.

### Small static sites

If your web app consists of a relatively small number (think: a couple of dozen) unique URLs, and
each of those URLs corresponds to a different static HTML file, then one viable approach is to just
cache all of those HTML files, and respond to navigation requests with the appropriate cached HTML.

Using [precaching](/precache-with-workbox/), you can cache the HTML in advance, as soon as the
service worker is installed, and update the cached HTML each time you rebuild your site and redeploy
your service worker.

Alternatively, if you would rather avoid precaching all of your HTML—perhaps because users tend to
navigate to only a subset of URLs on your site—you can use a
[stale-while-revalidate](/runtime-caching-with-workbox/#stale-while-revalidate) runtime caching
strategy. Be careful about this approach, though, as each individual HTML document is cached and
updated separately. Using runtime caching for HTML is most appropriate if you have a small number of
URLs that are revisited **frequently** by the same set of users, and if you feel comfortable about
those URLs being revalidated independently of each other.


### Single-page apps

A single-page architecture is frequently used by modern web applications. In it, client-side
JavaScript modifies the HTML in response to user actions. This model uses the [History
API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) to modify the current URL as the
user interacts with the web app, leading to what's effectively a "simulated" navigation. While
subsequent navigations might be "fake", the initial navigation is real, and it's still important to
make sure that it isn't blocked on the network.

Fortunately, if you're using the single-page architecture, there's a straightforward pattern to
follow for serving the initial navigation from the cache: the [application
shell](https://developers.google.com/web/fundamentals/architecture/app-shell). In this model, your
service worker responds to navigation requests by returning the same, single HTML file that has
already been precached—regardless of the URL being requested. This HTML should be bare-bones,
consisting of, perhaps, a generic loading indicator or [skeleton
content](https://css-tricks.com/building-skeleton-screens-css-custom-properties/). Once the browser
has loaded this HTML from the cache, your existing client-side JavaScript takes over, and renders
the correct HTML content for the URL from the original navigation request.

Workbox provides the tools that you need to implement this approach; the <code>[navigateFallback
option](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.generateSW)</code>
allows you to specify which HTML document to use as your app shell, along with an optional allow and
deny list to limit this behavior to a subset of your URLs.

### Multi-page apps

If your web server generates your site's HTML dynamically, or if you have more than a few dozen
unique pages,  then it's much harder to avoid the network when handling navigation requests. The
advice in [Everything else](#everything-else) will likely apply to you.

But for a certain subset of multi-page apps, you might be able to implement a service worker that
fully replicates the logic used in your web server to generate HTML. This works best if you can
share routing and templating information between the server and service worker environments, and in
particular, if your web server uses JavaScript (without relying on
[Node.js](https://nodejs.org)-specific features, like file system access).

If your web server falls into that category and you would like to explore one approach to moving
HTML generation off the network and into your service worker, the guidance in [Beyond SPAs:
alternative architectures for your
PWA](https://developers.google.com/web/updates/2018/05/beyond-spa) can get you started.

### Everything else {: #everything-else }

If you can't respond to navigation requests with cached HTML, you must take steps to ensure that
adding a service worker to your site (to handle other, non-HTML requests) doesn't end up slowing
down your navigations. Starting up the service worker without using it to respond to a navigation
request will introduce a small amount of latency (as explained in [Building Faster, More Resilient
Apps with Service Worker](https://youtu.be/25aCD5XL1Jk)). You can mitigate this overhead by enabling
a feature called [navigation
preload](https://developers.google.com/web/updates/2017/02/navigation-preload), and then [using the
network
response](https://developers.google.com/web/updates/2017/02/navigation-preload#using_the_preloaded_response)
that's been preloaded inside of your `fetch` event handler.

Workbox [provides a helper
library](https://developers.google.com/web/tools/workbox/modules/workbox-navigation-preload) that
feature-detects whether navigation preload is supported, and if so, simplifies the process of
telling your service worker to use the network response.

_<span>Photo by <a href="https://unsplash.com/@aaronburden?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Aaron Burden</a> on <a href="https://unsplash.com/s/photos/navigate?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>,_
