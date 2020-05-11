---
title: Content Delivery Networks (CDNs)
subhead: |
  This article discusses how CDNs work and provides platform-agnostic guidance on choosing, configuring, and optimizing a CDN setup.
authors:
  - katiehempenius
date: 2020-05-11
hero: hero.png
description: |
  This article discusses how CDNs work and provides platform-agnostic guidance on choosing, configuring, and optimizing a CDN setup.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
---

## Overview

Content delivery networks (CDNs) improve site performance by delivering resources to users quickly. They are well-suited for handling traffic spikes and are useful for reducing server load. This article discusses how CDNs work and provides platform-agnostic guidance on choosing, configuring, and optimizing a CDN setup.

## How does a CDN work?

A content delivery network (CDN) consists of a large network of servers. These servers cache content and are located close to users. The closer a server is to a user, the less time it takes for data to travel between the user and the server.

Traditionally, CDNs have been used to serve static content. Static content consists of files that can be served to the user without any processing. For example, images are usually static content, while API responses are not. In recent years some CDNs have begun to support serving dynamic content (this is sometimes referred to as ["edge computing"](https://en.wikipedia.org/wiki/Edge_computing)). Although some CDNs offer this as a feature, it is a separate topic and will not be covered in this article.

### Adding Resources

There are two approaches to populating a cache: push and pull. Most CDNs support both approaches - however a particular CDN instance can only use one or the other.

**Push CDN:** With a push CDN a site owner manually adds files to the cache. Although this gives site owners more control over caching, it can also be cumbersome, so push CDNs are significantly less common than pull CDNs. Push CDNs are most commonly used with large files like videos. A cache miss for a large file can result in a significant time delay while the resource is fetched from the origin; site owners can avoid this by manually adding the file to the cache before it is needed.

**Pull CDN**: Pull CDNs automatically populate the cache. The first time that a particular resource is requested, the CDN will request it from the origin server and cache the response. In this manner, the contents of the cache are built-up over time. Because the first request for a particular resource is always a cache miss, pull CDNs are technically less performant than push CDNs. However, in practice this difference in negligible and pull CDNs are ubiquitous due to their easy setup and maintenance. 

### Removing resources

CDNs use cache eviction to periodically remove resources from pull caches. In addition, site owners can manually remove resources through purging.

**Cache eviction**: Caches have a limited storage capacity. When a pull cache nears its capacity, it makes room for new resources by removing resources that haven't been accessed recently. This process is known as cache eviction. A resource being evicted from one server does not necessarily mean that it has been evicted from all servers in a CDN network.

**Purging:** Purging allows site owners to remove a resource from the cache without waiting for it to expire or be evicted. There are two approaches to purging: invalidation and deletion. 

* **Invalidation** marks a resource as invalid. Once a resource has been marked invalid, the next time it is requested the CDN will send a [conditional](https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests) [`If-Modified-Since`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) request to the origin server. If the content has been modified since the specified date, the origin will respond with the new version. Otherwise, the CDN will continue to serve the existing content.
* **Deletion** removes a resource from all CDN caches. On the next request for the resource, the CDN will request the resource from the origin server.

Implementations of purging vary somewhat across CDNs. Some CDNs charge a fee for purging a resource, others do not. In addition, some CDNs do not make a distinction between "invalidation" and "deletion" and only support one method or the other.

## Choosing a CDN

### CDN distribution and performance

The most important consideration when choosing a CDN is how well a CDN's server distribution matches the location of your users. If a CDN's servers are located far away from your users, you'll miss out on the biggest benefit of using a CDN. Sites with particularly large or geographically diverse user bases will occasionally use multiple CDNs to achieve the geographic coverage or redundancy that they need - but this would be overkill for the vast majority sites.

Although it's always a good idea to do your own research on a CDN's performance, it can be difficult to predict the exact performance you'll get from a CDN. CDN performance can vary depending on geography, time of day, and even current events.

### Technology and features

In addition to factors like pricing and support (which are very important to consider), CDNs can be differentiated by the technologies they support and the additional features that they offer.

CDNs commonly offer the following features as add-ons. Some sites will have a need for these features, others won't.

* **Load balancing:** [Load balancing](https://en.wikipedia.org/wiki/Load_balancing_(computing)) distributes incoming traffic across multiple servers. Load balancing is essential for high-traffic sites; it also improves resilience by making it possible to route traffic away from degraded servers.
* **Image optimization:** [Image optimization](https://images.guide/) reduces the transfer size of images through techniques like compression and resizing. 
* **Video delivery:** Streaming video has technical requirements that differ from those of other content types. Video delivery products handle all aspects of this process: storage, transcoding, delivery, and playback.
* **Dynamic content delivery:** CDNs can sometimes be used to serve dynamic content. This further reduces the load on the origin server and improves performance by moving dynamic content closer to users.

The following new technologies provide performance benefits over the status quo but lack universal CDN support. For more information on these technologies and their benefits, refer to the ["Enable performance features"](#enable-performance-features) section of this article. 

*   [Brotli compression](https://en.wikipedia.org/wiki/Brotli)
*   [TLS 1.3](https://en.wikipedia.org/wiki/Transport_Layer_Security#TLS_1.3)
*   [HTTP/3](https://en.wikipedia.org/wiki/HTTP/3)

## Setup

The CDN setup process varies by provider, however the steps listed below should give you an idea of what to expect. Note: If your site uses a CMS, there's a likely CDN plugin available that will make the process even simpler.

1.  Sign up with a CDN provider.
1.  Create a CDN instance and choose whether it will use the push or pull method. Once created, the CDN will assign a URL to the CDN instance - for example `me.cdn.com`.
1.  Optional step: If you want your CDN instance to be aliased to your own domain (for example, `cdn.mysite.com` rather than `me.cdn.com`), you'll need to update your DNS records. Create a CNAME record that points from `cdn.mysite.com` to `me.cdn.com.` This change can take a couple hours up to a day to propagate.
1.  Update your site's URLs to point at the CDN-hosted resources. For example, `https://mysite.com/cat.jpg` would become `https://cdn.mysite.com/cat.jpg`. Most frameworks and build tools have configuration options to facilitate this.
1.  (Push CDNs only) Upload your resources to the CDN.

Once set up, pay attention to the CDN's dashboards and logs - these will help you identify any issues with your configuration.

To quantify the performance impact of the CDN, look at real user monitoring (RUM) data. [RUM data](https://web.dev/time-to-first-byte/), rather than underlying network metrics like latency, better quantify the impact that a CDN (or any other performance technique) has on user experience.

## Optimization

Once a CDN is set up, there's usually room to improve its configuration. Increasing cache hits and enabling performance features are two strategies that will increase a CDN's impact on your site.

### Improve cache hit ratio (CHR)

Cache hit ratio (CHR) provides a measurement of a CDN's effectiveness and is typically included in a CDN's dashboards. It is defined as the number of cache hits divided by the number of total requests during a given time interval.

A freshly initialized cache will have a CHR of 0 but this increases as the cache is populated with resources. A CHR of 90% is a good goal for most sites. 

Out of the box, it's common to encounter resources that could be cached, but aren't due to issues such as incorrect HTTP headers and suboptimal handling of cookies and query parameters.

#### HTTP Cache Headers

HTTP headers communicate how a resource should be cached. At a minimum, these headers need to be set in order for a resource to be cached by a CDN:

*  `Cache-Control: Public`
*  `Cache-Control: max-age=<seconds>`, `Cache-Control: s-max-age=<seconds>`, or `Expires`.

In addition, some CDNs require that the `Content-Length` header (or similar) be set:
*   `Content-Length`, `Content-Range`, or `Transfer-Encoding`

The above is not an exhaustive list of caching directives. For a more detailed explanation of HTTP caching, refer to [Prevent unnecessary network requests with the HTTP Cache](https://web.dev/http-cache/).

#### Vary Header

CDNs use a resource's URL as the key when caching a resource. However, sometimes the server response for a given URL varies depending on the headers (for example, [`Accept-Language`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) or [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding)) set on the request. The [Vary](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) response header informs the CDN about the request headers that cause the server response to "vary". As a result, the CDN will know to cache and serve these variations separately.

The Vary header can be vital to delivering the correct content to users, however when overused, it hurts CHR. `Vary: Accept-Language` and `Vary: Accept-Encoding` are two Vary headers that are generally appropriate to use. However, other Vary headers should be used sparingly - if at all.

If you do use Vary, normalizing request headers will help improve CHR. For example, without normalization the request headers `Accept-Language: en-US` and `Accept-Language: en-US,en;q=0.9` would result in two separate cache entries, even though their contents would likely be identical.

#### Query Params

By default, CDNs include query params when caching a resource. Small adjustments to query param handling can have a significant impact on CHR. For example:

*   **Ignore unnecessary query params:** Social media platforms commonly append referrer params to outgoing URLs. By default, a CDN would cache `example.com/blog` and `example.com/blog?clickid=2zjk` separately even though they are likely the same underlying resource. Adjusting CDN settings to ignore the `clickid` query param would fix this issue and improve CHR.
*   **Sort query params:** A CDN will cache `example.com/blog?id=123&query=dogs` separately from `example.com/blog?query=dogs&id=123`. For most sites, query param order does not matter, so configuring the CDN to sort the query params (which standardizes the URL used to cache the server response) will increase CHR.

#### Cookies

Using the [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) response header to set cookies on the origin server's response may prevent a response from being cached. Cookies are a mechanism for storing stateful information - however CDNs traditionally serve stateless content. CDNs handle this conflict in different ways: some will strip the cookies from the server response, others will not cache the response at all. Evaluating your usage of `Set-Cookie` as well as adjusting your CDN's settings for cookie handling (for example whitelisting cookies you want to preserve) will ensure correct handling of server responses and possibly allow more resources to be cached.

### Enable performance features

The following features are commonly offered by CDNs and provide additional performance benefits when enabled.

#### Compression

All text-based responses should be compressed with either [gzip](https://en.wikipedia.org/wiki/Gzip) or [Brotli](https://en.wikipedia.org/wiki/Brotli). If you have the choice, choose Brotli over gzip. Brotli is a newer compression algorithm and files compressed with Brotli are typically [~15-20%](https://blogs.akamai.com/2016/02/understanding-brotlis-potential.html) smaller than their gzip [equivalent](https://tools.paulcalvano.com/compression.php). However, if gzip is the only option available, it is still worthwhile enabling. Although the file savings from gzip are smaller - it still reduces file size by [60-80%](https://blogs.akamai.com/2016/02/understanding-brotlis-potential.html).

#### Image optimization

CDNs typically focus on automatic, data-saving image transformations that can be applied automatically. Examples of these optimizations include stripping [EXIF](https://en.wikipedia.org/wiki/Exif) data, applying lossless compression, resizing images, and converting images to newer file formats (e.g. [WebP](https://web.dev/serve-images-webp/)). Given that images make up ~50% of the transfer bytes on the median web page, optimizing images can be one of the best techniques for reducing page size.

#### Minification

Minification removes unnecessary characters from JavaScript, CSS, and HTML. It's preferable to do minification at the origin server, rather than the CDN. Site owners, because they have more context about the code to be minified, can often use more aggressive minification techniques than those employed by CDNs. However, if minifying code at the origin is not an option, minification by the CDN is a good alternative.

#### TLS 1.3

[Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) is the cryptographic protocol used by [HTTPS](https://en.wikipedia.org/wiki/HTTPS). TLS 1.3 is the newest version of TLS and was introduced in 2018. In addition to being more secure than TLS 1.2, it shortens the TLS handshake from two roundtrips to one. This means that if a connection previously took 200ms to set up (in other words, a 100ms [RTT](https://en.wikipedia.org/wiki/Round-trip_delay_time) latency), it would now take 100ms.

TLS 1.3 contains an option that is typically supported and enabled separately from the rest of the TLS 1.3 protocol: zero roundtrip time connection resumption (0-RTT). With this feature existing sessions can immediately send data to the server - they don't need to wait for a handshake to complete. However, this performance improvement comes with a drawback: 0-RTT is vulnerable to [replay attacks](https://en.wikipedia.org/wiki/Replay_attack). To mitigate this, sites that choose to enable 0-RTT often limit its usage to a subset of requests that have been deemed safe for use with 0-RTT.

#### HTTP/3

[HTTP/3](https://en.wikipedia.org/wiki/HTTP/3) is the successor to [HTTP/2](https://en.wikipedia.org/wiki/HTTP/2). As of April 2020, all major browsers have experimental support for HTTP/3 and some CDNs support HTTP/3. Performance is the primary benefit of HTTP/3 over HTTP/2. Specifically:

* **No head-of-line blocking:** HTTP/2 introduced multiplexing, a feature that allows a single connection to be used to transmit multiple streams of data simultaneously. However, with HTTP/2, a single dropped packet blocks all streams on a connection (a phenomena known as a head-of-line blocking). With HTTP/3, a dropped packet only blocks a single stream. This makes HTTP/3 particularly well-suited for usage on congested networks.
* **Reduced connection setup time:** HTTP/3 only requires a single round-trip to establish a new connection. In addition, it supports 0-RTT. (Note: This is the same paradigm as TLS 1.3; HTTP/3 is built upon TLS 1.3.)

HTTP/3 will have the biggest impact on users on poor network connections: not only because HTTP/3 handles packet loss better than its predecessors, but also because the absolute time savings resulting from a 0-RTT or 1-RTT connection setup is greater on networks with high latency.

On average, HTTP/3 [reduced](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46403.pdf) the latency of Google Search responses by 4% for mobile users and 8% for desktop users. It reduced Youtube rebuffer rates of playbacks by 15% for mobile users and 18% for desktop users.

## Summary
* CDNs improve site performance by delivering resources to users quickly. They are well-suited for handling traffic spikes and are useful for reducing server load.
* When evaluating a CDN it is important to consider the geographic distribution of its servers, the technology and features that it supports, and the pricing and support offered.
* After a CDN has been setup, further performance improvements can be achieved by increasing cache hit ratio (CHR) and enabling performance features like Brotli compression and TLS 1.3.