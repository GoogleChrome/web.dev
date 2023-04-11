---
title: Architecture
Authors:
  - firt
description: >
  You make some decisions when developing a PWA, such as whether to create a single page application or a multi-page application, and whether you will host it in the root of your domain or within a folder.
date: 2022-04-15
---

Designing your application to make the most out of the technology that makes PWAs reliable, installable, and capable starts with understanding your application and its constraints, and choosing an appropriate architecture for both.

## SPA versus MPA

Today, there are two primary architectural patterns in web development: single-page apps, or SPAs, and multi-page apps, or MPAs.

Single-page apps are defined by having client-side JavaScript control most or all of the HTML rendering of a page based on data retrieved by or provided to the app. The app overrides the browser's built-in navigation, replacing it with its routing and view handling functionality.

Multi-page apps usually have pre-rendered HTML sent directly to the browser, often enhanced with client-side JavaScript after the browser has finished loading the HTML, and relying on the browser's built-in navigation mechanisms to display subsequent views.

Both architectures can be used to create PWAs.

Each has advantages and disadvantages, and selecting the right one for your use case and context is key to providing a fast and reliable experience for your users.

### Single page apps

{% Compare 'better', 'Pros' %}
* Mostly atomic in-page updates.
* Client-side dependencies loaded on start-up.
* Subsequent loads are fast, because of cache usage.
{% endCompare %}

{% Compare 'worse', 'Cons' %}
* High initial load cost.
* Performance depends on device hardware and network connection.
* Additional app complexity is required.
{% endCompare %}

Single page apps are a good architectural fit if:

* User interaction is mainly centered around atomic updates of interconnected data displayed on the same page, for instance, a real-time data dashboard or a video-editing app.
* Your application has client-side-only initialization dependencies, for instance, a third-party authentication provider with a prohibitively high startup cost.
* The data required for a view to load relies on a specific client-side-only context, for instance, displaying controls for a piece of connected hardware.
* The app is small and simple enough that its size and complexity do not have an impact on the cons listed above.

SPAs might not be a good architecture choice if:

* Initial load performance is essential. SPAs usually need to load more JavaScript to determine what to load and how to display it. The parsing and execution time of this JavaScript, combined with retrieving content, is slower than sending rendered HTML.
* Your app runs mostly on low-to-average-powered devices. Because SPAs depend on JavaScript for rendering, the user experience depends much more significantly on the power of their specific device than it would in an MPA.

Because SPAs need to replace the browser's built-in navigation with their routing, SPAs require a minimum level of complexity around efficiently updating the current view, managing navigation changes, and cleaning up previous views that would otherwise be handled by the browser, making them harder overall to maintain and more taxing on the user's device.

### Multi-page apps

{% Compare 'better', 'Pros' %}
* Mostly full-page updates.
* Initial render speed is critical.
* Client-side scripting can be an enhancement.
{% endCompare %}

{% Compare 'worse', 'Cons' %}
* Secondary views require another server call.
* Context doesn't carry over between views.
* Requires a server or pre-rendering.
{% endCompare %}


Multi-page apps are a good architectural choice if:

* User interaction is mainly centered around views of a single piece of data with optional context-based data, for instance, a news or e-commerce app.
* Initial render speed is critical, as sending already rendered HTML to the browser is faster than assembling it from a data request after loading, parsing, and executing a JavaScript-based alternative.
* Client-side interactivity or context can be included as an enhancement after initial load, for instance, layering a profile onto a rendered page or adding secondary client-side context-dependent components.

MPAs might not be a good architecture choice if:

* Re-downloading, re-parsing, and re-executing your JavaScript or CSS is prohibitively expensive. This con is mitigated in PWAs with service workers.
* Client-side context, such as user location, doesn't seamlessly carry over between views, and re-obtaining that context may be expensive. It either needs to be captured and retrieved, or re-requested between views.

Because individual views need to be dynamically rendered by a server or pre-rendered before access, potentially limiting hosting or adding data complexity.

### Which one to choose?

Even with these pros and cons, both architectures are valid for creating your PWA. You can even mix them for different parts of your app, depending on its needs, for instance, having store listings follow an MPA architecture and the checkout flow follow an SPA architecture.

Regardless of choice, the next step is understanding how to best use service workers to provide the best experience.

## The power of service worker

The service worker has a lot of power beyond basic routing and delivery of cached and network responses. We can create complex algorithms that can improve the user's experience and performance.

### Service worker includes (SWI)

An emerging pattern for using service workers as an integral part of a site's architecture is service worker includes (SWI).
SWI divides individual assets, usually an HTML page, into pieces based on their caching needs, then stitches them back together in the service worker to improve consistency, performance, and reliability, while reducing cache size.
{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/xDjYv2TYJik4xm1h7nyS.png", alt="A website with a global header, a content area, a sidebar and a footer.", width="800", height="520" %}

This image is a sample web page. It has five different sections that break the page down into:

* Overall layout.
* Global header (top dark bar).
* Content area (middle left lines and image).
* Sidebar (tall medium-dark bar on the middle right).
* Footer (dark bottom bar).

#### Overall layout

The overall layout isn't likely to change often and has no dependencies. It's a good candidate for [precaching](/learn/pwa/assets-and-data/#frequently-used-cache-approaches).

#### Header and footer

The global header and footer contain things like the top menu and site footer, and present a particular challenge: if the page were to be cached as a whole, these might change between page loads, depending on when the given page was cached.

By separating them and caching them independently of the content, you can ensure that users will always get the same version, regardless of when they are cached. Because they are infrequently updated, they're good candidates for precaching, too. They have a dependency, though: the site's CSS and JavaScript.

#### CSS and JavaScript

Ideally, the site's CSS and JavaScript should be cached with a stale while revalidate strategy to allow incremental updates without needing to update the service worker, as it is the case with precached assets. Still, they also need to be kept at a minimum version whenever the service worker updates with a new global header or footer. Because of this, their cache should also be updated with the latest version of assets when the service worker installs.

#### Content area

Next is the content area. Depending on the frequency of updates, either network first or stale while revalidate is a good strategy here. Images should be cached with a cache first strategy, as has been previously [discussed](/learn/pwa/serving/#caching-strategies).

#### Sidebar

Finally, presuming the sidebar content contains secondary content such as tags and related items, it's not critical enough to pull from the network. A stale while revalidate strategy works for this.

Now, after going through all that, you may be thinking that you can only do this kind of per-section caching for single-page apps. But, by adopting patterns inspired by [edge side includes](https://en.wikipedia.org/wiki/Edge_Side_Includes) or [server side includes](https://en.wikipedia.org/wiki/Server_Side_Includes) in your service worker, with some advanced service worker features, you can do this for either architecture.

#### Try it yourself

You can try the service worker includes with the next codelab:

{% Aside 'codelab' %}
[Service worker includes](https://developers.google.com/codelabs/pwa-training/pwa06--service-worker-includes).
{% endAside %}

### Streaming responses

The previous page could be created using the app shell model in the SPA world, where the app shell is cached, then served, and content is loaded on the client side. With the introduction and wide availability of the [Streams API](https://developer.mozilla.org/docs/Web/API/Streams_API), both app shell and content can be combined in the service worker and streamed to the browser, giving you the caching flexibility of app shell with the speed of MPAs.

It does this because:

* Streams can be built asynchronously, allowing different pieces of a stream to come from other sources.
* The requester of a stream can start working on the response as soon as the first chunk of data is available, instead of waiting for the entire item to be complete.
* Parsers optimized for streaming, including the browser, can progressively display the content of the stream before it's complete, speeding up the perceived performance of the response.

Thanks to these three properties of streams, architectures built around streaming usually have a faster perceived performance than those that aren't.

Working with the Streams API can be challenging as it's complex and low level. Fortunately, there's a [Workbox module](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-streams) that can help with setting up streaming responses for your service workers.

## Domains, origins, and PWA scope

Web workers, including service workers, storage, even an installed PWA's window, are all governed by one of the most critical security mechanisms on the web: the same-origin policy. Within the same origin, permissions are granted, data can be shared, and the service worker can talk to different clients. Outside of the same origin, permissions are not automatically granted and data is isolated and not accessible between different origins.

### Same-origin policy

Two URLs are defined as having the exact origin if the protocol, port, and host are the same.

For example: `https://squoosh.app`, and `https://squoosh.app/v2` have the same origin, but `http://squoosh.app`, `https://squoosh.com`, `https://app.squoosh.app` and `https://squoosh.app:8080` are in different origins. Check the [same-origin policy MDN reference](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy) for more information and examples.

Changing subdomains isn't the only way a host can change. Each host is made up of a top-level domain (TLD), a secondary level domain (SLD), and zero or more labels (sometimes called subdomains), separated by dots in between and read from right to left in an URL. A change in any of the items results in a different host.

In the [window management module](/learn/pwa/window), we've already seen how the in-app browser looks when a user navigates to a different origin from an installed PWA.

That in-app browser will appear even if the websites have the same TLD and SLD, but with different labels, as they are then considered different origins.

One of the key aspects of an origin in a web-browsing context is how storage and permissions work. One origin shares many features among all content and PWAs within it, including:

- Storage quota and data (IndexedDB, cookies, web storage, cache storage).
- Service worker registrations.
- Permissions granted or denied (such as web push, geolocation, sensors).
- Web push registrations.

When you move from one origin to another, all the previous access is revoked, so permissions have to be granted again, and your PWA can't access all the data saved in the storage.

{% Aside 'caution' %}
Having different subdomains for different parts of a website or different TLDs for other locales, such as `admin.example.com` or `example.co.uk`, makes building PWAs harder, each subdomain will have isolated storage, its own service worker registration, and web app manifest. It may also lead to a disjointed experience if the subdomains are designed to look like the same app, as one will be displayed in the in-app browser while the main PWA won't.
{% endAside %}

{% Video src="video/RK2djpBgopg9kzCyJbUSjhEGmnw1/V1OWWZnCGpwVcaZE152Z.mp4", autoplay=true, controls=true, loop=true %}

##  Resources

- [Beyond SPAs: Alternative architectures for your PWA](https://developer.chrome.com/blog/beyond-spa)
- [Progressive web apps Structure](https://developer.mozilla.org/docs/Web/Progressive_web_apps/App_structure)
- [Streams: The definitive guide](/streams/)
