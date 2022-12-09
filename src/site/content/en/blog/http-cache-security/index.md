---
layout: post
title: Improve security and privacy by updating HTTP Cache
subhead: Forgetting or misusing the Cache-Control header may negatively impact the security of your website and your users' privacy.
authors:
  - arthursonzogni
description: Forgetting or misusing the Cache-Control header might negatively impact the security of your website and your users' privacy. Get recommendations for high-value websites.
date: 2022-02-07
thumbnail: image/VbsHyyQopiec0718rMq2kTE1hke2/3MnHBfutFgu2ai1F2mUH.jpg
alt: Two ducks move through the water, creating a rippling wave.
tags:
  - blog
  - security
---

By default, resources are always allowed to be cached by any type of cache.
Not using or misusing the `Cache-Control` header might negatively impact the
security of your website and your users' privacy.

For personalized responses you want to keep private, we recommend you either:

*  Prevent intermediaries from caching the resource. Set
   `Cache-Control: private`.
*  Set an appropriate [secondary cache
   key](https://datatracker.ietf.org/doc/html/rfc7234#section-4.1).
   If the response varies due to cookies&mdash;which can happen when the
   cookie stores credentials&mdash;set `Vary: Cookie`.

Read on to learn why this matters and discover:

1. Security and privacy problems you might be unaware of
2. Different types of HTTP caches and common misconceptions
3. Recommended actions for high-value websites

## Cache-related security and privacy risks

### Leaky resources from Spectre vulnerabilities

The [Spectre
vulnerability](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability))
allows a page to read an OS process's memory. This means an attacker can
gain unauthorized access to cross-origin data. As a consequence, modern web
browsers have restricted usage of some of their features&mdash;such as
[`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
or [high resolution timer](https://developer.chrome.com/blog/cross-origin-isolated-hr-timers/)&mdash;to
pages with [cross-origin
isolation](/cross-origin-isolation-guide/).

Modern web browsers enforce [Cross-Origin Embedder Policy
(COEP)](https://developer.chrome.com/blog/coep-credentialless-origin-trial/). This ensures cross-origin
resources are either:

*  Public resources, requested without cookies
*  Resources explicitly allowed to be shared cross-origin, via CORS or the
   [CORP](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))
   header

The COEP setup doesn't prevent an attacker from exploiting Spectre. However, it
ensures cross-origin resources are not valuable to the attacker (when loaded
by the browser as public resource) or allowed to be shared with the attacker (when shared with
[`CORP: cross-origin`](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))).

### How does HTTP caching affect Spectre?

If the `Cache-Control` header isn't properly set, an attacker could execute an
attack. For example:

1.  The credentialed resource is cached.
1.  The attacker loads a cross-origin isolated page.
1.  The attacker requests the resource again.
1.  [`COEP:credentialless` is set by the browser](https://developer.chrome.com/blog/coep-credentialless-origin-trial/),
    so the resource is fetched without cookies. However, a cache may return
    the credentialled response instead.
1.  The attacker can then read the personalized resource using a Spectre
    attack.

Although a web browser's HTTP cache doesn't allow this type of attack to
happen in practice, additional caches exist outside of the browser's immediate
control. This may lead to this attack's success.

## Common misconceptions about HTTP caches

### 1. Resources are cached by the browser only

There are often multiple layers of cache. Some caches are dedicated to a
single user, some to multiple users. Some are controlled by the server, some
by the user, and some by intermediaries.

*  **Browser caches**. These caches are owned by and dedicated to a single
   user, implemented in their web browser. They improve performance by
   avoiding fetching the same response multiple times.
*  **Local proxy**. This might have been installed by the user, but can also
   be managed by intermediaries: their company, their organization, or their
   internet provider. Local proxies often cache a single response for multiple
   users, which constitutes a "public" cache. Local proxies have multiple
   roles.
*  **Origin server cache / CDN**. This is controlled by the server. The Origin
   server cache's goal is to reduce the load on the origin server by caching
   the same response for multiple users. A CDN's goals are similar, but spread
   across the globe and assigned to the closest set of users to reduce latency.

<figure data-size="full">
  {% Img
     class="screenshot",
     src="image/VbsHyyQopiec0718rMq2kTE1hke2/8yvhAw0SiJi62V5yIrT3.png",
     alt="There are often multiple layers of cache between the browser and server.",
     width="800", height="712"
  %}
  <figcaption>
     There may be various layers of cache between the browser and server. For example, you may encounter a server cache, followed by a CDN and the browser cache. There may also be a local proxy setup between the CDN and browser cache.
  </figcaption>
</figure>

### 2. SSL prevents intermediaries from caching HTTPS resources

Many users regularly use locally-configured proxies, whether for access
purposes (such as sharing a metered connection), virus inspection, or for data
loss prevention (DLP) purposes. The intermediary cache is performing [TLS
interception](https://en.wikipedia.org/wiki/Transport_Layer_Security#TLS_interception).

An intermediary cache is often installed on a company employee's workstations.
Web browsers are configured to trust the local proxy's certificates.

Ultimately, some HTTPS resources may be cached by these local proxies.

## How HTTP cache works

*  Resources are
   [implicitly](https://datatracker.ietf.org/doc/html/rfc7234) allowed
   to be cached by default.
*  The [primary cache
   key](https://datatracker.ietf.org/doc/html/rfc7234#section-2) consists of the
   URL and the method. (URL, method)
*  The [secondary cache
   key](https://datatracker.ietf.org/doc/html/rfc7234#section-4.1) is
   the headers included in the `Vary` header. `Vary: Cookie` indicates the
   response depends on the `Cookie`.
*  The `Cache-Control` header gives more fine grained control.

## Take these recommended actions for your website

Developers of high-value websites, which include websites with high traffic
and websites which interact with personal identifying information, should act
now to improve security.

The greatest risk occurs when access to a resource varies depending on
cookies. An intermediary cache may return a response that was requested with
cookies for a request that wasn't if no preventative action was taken.

We recommend you take one of the following steps:

*  Prevent intermediaries from caching the resource. Set
   `Cache-Control: private`.
*  Set an appropriate [secondary cache
   key](https://datatracker.ietf.org/doc/html/rfc7234#section-4.1).
   If the response varies due to cookies&mdash;which can happen when the
   cookie stores credentials&mdash;set `Vary: Cookie`.

In particular, change the default behavior: always define `Cache-Control` or
`Vary`.

## Additional considerations

There are other, similar types of attacks using the HTTP cache, but those rely
on a different mechanism than cross-origin-isolation. For instance, Jake
Archibald describes some attacks in [How to win at
CORS](https://jakearchibald.com/2021/cors/#conditionally-serving-cors-headers).

These attacks are mitigated by some web browsers which split their HTTP cache
depending on whether the resource response was requested with credentials or
not. As of 2022, Firefox does split the cache, while Chrome and Safari don't.
Chrome  [may split the
cache](https://docs.google.com/document/d/1lvbiy4n-GM5I56Ncw304sgvY5Td32R6KHitjRXvkZ6U/edit#) in the future. Note that these attacks are different and
complementary to [splitting it per the top-level
origin](https://developer.chrome.com/blog/http-cache-partitioning).

Even if this problem can be mitigated for web browsers, the problem will
remain in local proxy caches. Therefore, we still suggest you follow the
recommendations above.

<hr />

_Header photo by [Ben Pattinson](https://unsplash.com/@benpattinson) on [Unsplash](https://unsplash.com/photos/_Wo1Oq38tVU)._
