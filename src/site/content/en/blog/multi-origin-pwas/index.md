---
layout: post
title: Progressive Web Apps in multi-origin sites
subhead: Challenges and workarounds for building Progressive Web Apps in multi-origin sites.
authors:
  - demianrenzulli
date: 2019-08-19
hero: image/admin/4bvbhJ3F0uGKvw5DLTMy.jpg
# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom
alt: Multiple Shifting Gears.
description: Multi-origin architectures presents many challenges when building PWAs. Explore the good and bad uses of multiple origins, and some workarounds to build PWAs in multi-origin sites.
tags:
  - blog
  - progressive-web-apps
  - service-worker
---

## Background

In the past, there were some advantages to using multi-origin architectures, but for Progressive Web Apps, that approach presents many challenges. In particular, the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), imposes restrictions for sharing things like service workers and caches, permissions, and for achieving a standalone experience across multiple origins. This article will describe the good and bad uses of multiple origins, and explain the challenges and workarounds for building Progressive Web Apps in multi-origin sites.

## Good and bad uses of multiple origins

There are a few legitimate reasons for sites to employ a multi-origin architecture, mostly related to providing an independent set of web applications, or to create experiences that are completely isolated from each other. There are also uses that should be avoided.

### The good

Let's look at the useful reasons first:

- **Localization / Language:** Using a [country-code top-level domain](https://developer.mozilla.org/en-US/docs/Glossary/TLD), to separate sites to be served in different countries (e.g. `https://www.google.com.ar`), or using subdomains to divide sites targeted to different locations (e.g.: `https://newyork.craigslist.org`) or to offer content for a specific language (e.g. `https://en.wikipedia.org`).

- **Independent webapps:** Using different subdomains to provide experiences whose purpose differs considerably from the site on the main origin. For example, in a news site, the crosswords webapp could be intentionally served from `https://crosswords.example.com`, and installed and used as an independent PWA, without having to share any resources or functionality with the main website.

### The bad

If you're not doing any of these things, it's likely that using a multi-origin architecture will be a disadvantage when building Progressive Web Apps.

Despite this, many sites continue being structured this way for no particular reason, or for 'legacy' reasons. One example is using subdomains to arbitrarily separate parts of a site that should be part of a unified experience.

The following patterns, for example, are highly discouraged:

- **Site sections:** Separating different sections of a site on subdomains. In news sites, it's not uncommon to see the home page at: `https://www.example.com`, while the sports section lives at `https://sports.example.com`, politics at `https://politics.example.com`, and so forth. In the case of an e-commerce site, using something like `https://category.example.com` for product categories, `https://product.example.com` for product pages, etc.

- **User Flow:** Another approach that's discouraged is to separate different smaller parts of the site, like pages for the login or purchase flows in subdomains. For example, using `https://login.example.com`, and `https://checkout.example.com`.

{% Aside %}
When building a site from scratch it's highly recommended to avoid dividing it into subdomains. For existing sites, migrating to a single origin is the best approach.
{% endAside %}

For those cases where migrating to a single origin is not possible, what follows is a list of challenges, and (where possible), workarounds that can be considered when building Progressive Web Apps.

## Challenges and Workarounds for PWAs across different origins

When building a website on multiple origins, providing a unified PWA experience is challenging, mostly because of the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), which imposes a number of constraints. Let's look at them one at a time.

### Service workers

The origin of the service worker script URL has to be the same as the origin of the page calling [register()](https://w3c.github.io/ServiceWorker/#navigator-service-worker-register). This means that, for example, a page at `https://www.example.com` can't call `register()` with a service worker url at `https://section.example.com`.

Another consideration is that a service worker can only control pages hosted under the origin and path it belongs to. This means that, if the service worker is hosted at `https://www.example.com` it can only control URLs from that origin (according to the path defined in the [scope parameter](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameters)), but won't control any page in other subdomains such as, for example, those in `https://section.example.com`.

In this case, the only workaround is to use multiple service workers (one per origin).

{% Aside 'caution' %}
Registering, and having multiple active service workers consumes additional resources (memory, CPU, etc.), so use your best judgement on how many active service workers a user will likely need to navigate across the site.
{% endAside %}

### Caching

The Cache object, indexedDB, and localStorage are also constrained to a single origin. This means it's not possible to access the caches that belong to `https://www.example.com`, from, for example: `https://www.section.example.com`.

Here are some things you can do to manage caches properly in scenarios like this:

- **Leverage browser caching:** Using [traditional browser caching best practices](https://webkit.org/blog/8090/workers-at-your-service/) is always recommended. This technique provides the added benefit of reusing cached resources across origins, which can't be done with the service worker's cache. For best practices on how to use HTTP Cache with service workers, you can take a look at [this post](https://jakearchibald.com/2016/caching-best-practices/#the-service-worker-the-http-cache-play-well-together-dont-make-them-fight).

- **Keep service worker installation lightweight:** If you are maintaining multiple service workers, avoid making users pay a big installation cost every time they navigate to a new origin. In other words: only pre-cache resources that are absolutely necessary.

{% Aside 'gotchas' %}
Once the service worker is active and running, the same-origin policy also restricts cross-origin requests made **_inside_** service workers. Fortunately this has a recommended workaround, which is to use [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) (as explained [here](https://developers.google.com/web/ilt/pwa/working-with-the-fetch-api#cross-origin_requests)). Using the [no-cors mode](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters) when fetching resources inside the service worker is not recommended.
{% endAside %}

### Permissions

Permissions are also scoped to origins. This means that if a user granted a given permission to the origin `https://section.example.com`, it won't carry over to other origins, like `https://www.example.com`.

Since there's no way to share permissions across origins, the only solution here is to ask for permission on each of subdomain where a given feature is required (e.g. location). For things like web push, you can maintain a cookie to track if the permission has been accepted by the user in another subdomain, to avoid requesting it again.

### Installation

To install a PWA, each origin must have its own manifest with a `start_url` that's [relative to itself](https://w3c.github.io/manifest/#start_url-member). This means that a user receiving the installation prompt on a given origin (i.e: `https://section.example.com`) won't be able to install the PWA with a `start_url` on a different one (i.e: `https://www.example.com`).
In other words, users receiving the installation prompt in a subdomain will only be able to install PWAs for the subpages, not for the main URL of the app.

There's also the issue that the same user could receive multiple installation prompts when navigating the site, if each subdomain meets the [installation criteria](https://developers.google.com/web/fundamentals/app-install-banners/#criteria), and prompts the user to install the PWA.

To mitigate this problem you can make sure that the prompt is shown only on the main origin. When a user visits a subdomain that passes the installation criteria:

1. [Listen for `beforeinstallprompt` event](https://developers.google.com/web/fundamentals/app-install-banners/#listen_for_beforeinstallprompt).
1. [Prevent the prompt from appearing](https://developers.google.com/web/fundamentals/app-install-banners/#preventing_the_mini-infobar_from_appearing), calling `event.preventDefault()`.

That way, you make sure the prompt is not shown in unintended parts of the site, while you can continue showing it, for example, in the main origin (e.g. Home page).

### Standalone Mode

While navigating in a standalone window, the browser will behave differently when the user moves outside of the scope set by the PWA's manifest. The behavior depends on each browser version and vendor. For example, the latest Chrome versions open a [Chrome Custom Tab](https://developer.chrome.com/multidevice/android/customtabs), when a user moves out of the scope in standalone mode.

In most cases, there's no solution for this, but a workaround can be applied for small parts of the experience that are hosted in subdomains (for example: login workflows):

1. The new URL, `https://login.example.com`, could open inside a full screen iframe.
1. Once the task is completed inside the iframe (for example, the login process), [postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) can be used, to pass any resulting information from the iframe back to the parent page.
1. As a final step, once the message is received by the main page, the listeners can be unregistered, and the iframe finally be removed from the DOM.

{% Aside 'caution' %}
The previous technique can help mitigating the potential UI change in a small part of the site, where the user can perform an action in a subdomain and return to the main origin (like in a login flow), but won't be an efficient technique to implement for entire paths, including many pages hosted in subdomains (like entire site sections).
{% endAside %}

{% Aside %}
In the context of [Trusted Web Actitivies](https://developers.google.com/web/updates/2019/02/using-twa), there's a recommended way of avoiding this issue, by [validating all origins using Digital Asset Links](https://developers.google.com/web/updates/2020/01/twa-multi-origin).
{% endAside %}

### Conclusion

Same-origin policy imposes many restrictions for sites built on top of multiple origins that want to achieve a coherent PWA experience. For that reason, to provide the best experience to users, we strongly recommend against dividing sites into different origins.

For existing sites that are already built in this way, it can be challenging to make multi-origin PWAs work correctly, but we have explored some potential workarounds. Each can come with tradeoffs, so use your judgement when deciding which approach to take on your website.

When evaluating a long-term strategy or site redesign, consider migrating to a single origin, unless there's an important reason to keep the multi-origin architecture.

_With many thanks for their technical reviews and suggestions: Penny Mclachlan, Paul Covell, Dominick Ng, Alberto Medina, Pete LePage, Joe Medley, Cheney Tsai, Martin Schierle, and Andre Bandarra._
