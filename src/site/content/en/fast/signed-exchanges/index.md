---
layout: post
title: Signed Exchanges (SXGs)
subhead: |
  An SXG is a delivery mechanism that makes it possible to authenticate the
  origin of a resource independently of how it was delivered.
authors:
  - katiehempenius
  - twifkak
date: 2020-10-14
updated: 2022-09-03
hero: image/admin/6ll3P8MYWxvtb1ZjXIzb.jpg
alt: A pile of envelopes.
description: |
  An SXG is a delivery mechanism that makes it possible to authenticate the
  origin of a resource independently of how it was delivered.
tags:
  - blog
  - performance
---

Signed exchanges (SXG) are a delivery mechanism that makes it possible to authenticate the origin of a resource independently of how it was delivered. Implementing SXG can improve Largest Contentful Paint (LCP) by enabling [privacy-preserving cross-origin prefetch](#speeding-up-page-loads-with-signed-exchanges). Additionally, this decoupling advances a variety of use cases such as offline internet experiences and serving from third-party caches.

This article provides a comprehensive overview of SXG: how it works, use cases, and tooling.

## Browser compatibility {: #browser-compatibility }

SXG is [supported](https://caniuse.com/#feat=sxg) by Chromium-based browsers
(starting with versions: Chrome 73, Edge 79, and Opera 64).

## Overview

As its primary use case, SXG uses a cache to prefetch and serve content that has been cryptographically signed by the origin. This helps speed cross origin navigations from referer sites while also ensuring that pages remain unaltered and properly attributed to their origin. Any potentially identifying information is hidden until after the user navigates to a site thereby protecting the user’s privacy.
Google Search is an early adopter of SXG prefetching capabilities and for sites that receive a large portion of their traffic from Google Search, SXG can be an important tool for delivering faster page loads to users. Over time, we hope this impact will expand to additional referrers. 

### How it Works

A site signs a request/response pair (an "HTTP exchange") in a way that makes it possible for
the browser to verify the origin and integrity of the content independently of
how the content was distributed. As a result, the browser can display the URL of
the origin site in the address bar, rather than the URL of the server that
delivered the content.

{% Img src="image/GiC3si2rdySvEXRggAJBPhgTHFr2/kGUL8NalZ2OaC81a5q8g.PNG", alt="Diagram explaining how Signed Exchanges Works. Browser communicating with the cache which communicates with the destination site", width="800", height="392" %}

Historically, the only way for a
site to use a third-party to distribute its content while maintaining
attribution has been for the site to share its SSL certificates with the
distributor. This has security drawbacks; moreover, it is a far stretch from
making content truly portable.

### The SXG format

An SXG is encapsulated in a [binary-encoded](https://cbor.io/) file that has two
primary components: an HTTP exchange and a
[signature](https://developer.mozilla.org/docs/Glossary/Signature/Security)
that covers the exchange. The HTTP exchange consists of a request URL, content
negotiation information, and an HTTP response.

{% Details %}
{% DetailsSummary %}

Here's an example of a decoded SXG file.
{% endDetailsSummary %}

```html
format version: 1b3
request:
  method: GET
  uri: https://example.org/
  headers:
response:
  status: 200
  headers:
    Cache-Control: max-age=604800
    Digest: mi-sha256-03=kcwVP6aOwYmA/j9JbUU0GbuiZdnjaBVB/1ag6miNUMY=
    Expires: Mon, 24 Aug 2020 16:08:24 GMT
    Content-Type: text/html; charset=UTF-8
    Content-Encoding: mi-sha256-03
    Date: Mon, 17 Aug 2020 16:08:24 GMT
    Vary: Accept-Encoding
signature:
    label;cert-sha256=*ViFgi0WfQ+NotPJf8PBo2T5dEuZ13NdZefPybXq/HhE=*;
    cert-url="https://test.web.app/ViFgi0WfQ-NotPJf8PBo2T5dEuZ13NdZefPybXq_HhE";
    date=1597680503;expires=1598285303;integrity="digest/mi-sha256-03";sig=*MEUCIQD5VqojZ1ujXXQaBt1CPKgJxuJTvFlIGLgkyNkC6d7LdAIgQUQ8lC4eaoxBjcVNKLrbS9kRMoCHKG67MweqNXy6wJg=*;
    validity-url="https://example.org/webpkg/validity"
header integrity: sha256-Gl9bFHnNvHppKsv+bFEZwlYbbJ4vyf4MnaMMvTitTGQ=

The exchange has a valid signature.
payload [1256 bytes]:
<!doctype html>
<html>
<head>
    <title>SXG example</title>
    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
    }
    </style>
</head>
<body>
<div>
    <h1>Hello</h1>
</div>
</body>
</html>
```

{% endDetails %}

The `expires` parameter in the signature indicates a SXG's expiration date. A
SXG may be valid for at most 7 days. Find more information on
the signature header in the [Signed HTTP Exchanges
spec](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html#section-3.1).

#### Support for server-side personalization

An SXG containing a `Vary: Cookie` header will be shown only to users who don't
have cookies for the signed request URL. If your site presents different HTML
to its logged-in users, you can use this feature to take advantage of SXGs
without altering that experience. See details on [server-side personalization
with Dynamic SXG](/blog/sxg-desktop/#support-for-server-side-personalization).

### Web Packaging

SXG is part of the broader [Web
Packaging](https://github.com/WICG/webpackage) spec proposal family. In addition
to SXGs, the other major component of the Web Packaging spec is [Web Bundles](/web-bundles/)
("bundled HTTP exchanges"). Web Bundles are a collection of HTTP resources and
the metadata necessary to interpret the bundle.

The relationship between SXGs and Web Bundles is a common point of confusion.
SXG and Web Bundles are two distinct technologies that don't depend on each
other—Web Bundles can be used with both signed and unsigned exchanges. A common
goal advanced by both SXGs and Web Bundles is the creation of a "web packaging"
format that allows sites to be shared in their entirety for offline consumption.


## Speeding up Page Loads with Signed Exchanges

Enabling Signed Exchanges can help speed up web page performance and thereby impact your site’s Core Web Vitals, in Particular [Largest Contentful Paint (LCP)](/lcp/). As an early adopter, Google Search uses SXG to provide users with a faster page load experience for pages loaded from the search results page. 


Google Search crawls and caches SXGs when available and prefetches SXG that the user is likely to visit—for example, the page corresponding to the first search result.

SXG works best in tandem with other performance optimizations such as use of CDNs and reduction of render-blocking subresources. After implementing, follow [these recommendations](https://developer.chrome.com/blog/optimizing-lcp-using-signed-exchanges/) to maximize the LCP benefit from prefetching SXGs. In many cases, such optimization can result in nearly instant page loads coming from Google Search:

{% Video src="video/rULxC7pPw3PFS4o9xr7v8isFmCv1/MQwtXWQD41XWNTzRHLie.mp4", controls=true, poster="image/rULxC7pPw3PFS4o9xr7v8isFmCv1/cdP5lEt76GS8N3Bix2X2.jpg" %}

### Impact of Signed Exchanges 

From past experiments we have observed an average of 300ms to 400ms reduction in LCP from SXG-enabled prefetches. This helps sites make a better first-impression on users and often has a positive impact on business metrics. 

Several global brands and sites have already benefited from Signed Exchanges. As a case study, lets look at how implementing Signed Exchanges helped [RebelMouse](https://www.rebelmouse.com/signed-exchange?utm_medium=post&utm_source=google&utm_campaign=signed-exchange-co-marketing&utm_content=signed-exchange), a prominent Content Management System (CMS), improve their customers' performance and business metrics:

- Narcity **improved LCP by 41%**
- Paper Magazine noticed a **27% increase in Sessions per user** 
- MLT Blog **decreased Page Load time by 21%**

[Cloudflare found](https://blog.cloudflare.com/automatic-signed-exchanges-desktop-android/) that SXG **improved TTFB for 98% of sites** it tested, and **improved LCP for 85% of sites**, with a median improvement of over 20% in SXG-eligible page loads.

{% Aside %}
SXG enables [cross-origin prefetching](https://developer.chrome.com/blog/cross-origin-prefetch/) because it allows prefetch requests via an SXG cache server operated by the referrer, ensuring that the user's potentially identifying information is not revealed to the origin server until they navigate. This technique is available to any site that wishes to make its outlinks faster or more resilient to limited network access.
{% endAside %}

#### Indexing

The SXG and non-SXG representations of a page are not ranked or indexed
differently by Google Search. SXG is ultimately a delivery mechanism—it does not
change the underlying content. 

### AMP

AMP content can be delivered using SXG. SXG allows AMP content to be prefetched
and displayed using its canonical URL, rather than its AMP URL.AMP has its own separate
[tooling](https://github.com/ampproject/amppackager) for generating SXGs.Learn how to serve AMP using signed exchanges on
[amp.dev](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/signed-exchange/).


## Debugging SXGs with Chrome DevTools {: #debugging }

To see a SXG firsthand, use a Chromium browser, open DevTools, open the Network panel, and visit this [example search page](https://www.google.com/search?q=site%3Asigned-exchange-testing.dev+valid). Signed Exchanges can be identified by looking for `signed-exchange` in the **Type** column.

<figure>
  {% Img src="image/admin/cNdohSaeXqGHFBwD7L3B.png", alt="Screenshot showing a SXG request within the 'Network' panel in DevTools", width="696", height="201" %}
  <figcaption>The <b>Network</b> panel in DevTools</figcaption>
</figure>

The **Preview** tab provides more information about the contents of a SXG.

<figure>
  {% Img src="image/admin/E0rBwuxk4BxFmLJ3gXhP.png", alt="Screenshot of the 'Preview' tab for a SXG", width="800", height="561" %}
  <figcaption>The <b>Preview</b> tab in DevTools</figcaption>
</figure>

## Tooling

Implementing SXGs consists of generating the SXG corresponding to a given URL
and then serving that SXG to requestors (usually crawlers). 

### Certificates

To generate a SXG you will need a certificate that can sign SXGs, although some tools acquire these automatically. [This page](https://github.com/google/webpackager/wiki/Certificate-Authorities) lists the certificate authorities that can issue this type of certificate.
Certificates can be obtained automatically from the Google certificate authority using any ACME client. Web Packager Server has a built-in ACME client, and sxg-rs will soon.

{% Aside %}
Production use of SXGs requires a certificate that supports the
`CanSignHttpExchanges` extension. Per
[spec](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html#section-4.2),
certificates with this extension must have a validity period no longer than 90
days and require that the requesting domain have a [DNS CAA
record](https://en.wikipedia.org/wiki/DNS_Certification_Authority_Authorization)
configured.
{% endAside %}

### Platform-specific SXG tooling

These tools support specific technology stacks. If you are already using a
platform supported by one of these tools, you may find it easier to set up than
a general-purpose tool.

- [`sxg-rs/cloudflare_worker`](https://github.com/google/sxg-rs/tree/main/cloudflare_worker)
  runs on [Cloudflare Workers](https://workers.cloudflare.com/).

- [`sxg-rs/fastly_compute`](https://github.com/google/sxg-rs/tree/main/fastly_compute)
  runs on [Fastly
  Compute@Edge](https://www.fastly.com/products/edge-compute/serverless).

- [Automatic Signed
  Exchanges](https://blog.cloudflare.com/automatic-signed-exchanges/) is a
  Cloudflare feature that automatically acquires certificates and generates
  Signed Exchanges.

- [NGINX SXG module](https://github.com/google/nginx-sxg-module) generates
  and serves SXGs for sites that use [nginx](https://nginx.org/). Setup
  instructions can be found [here](/how-to-set-up-signed-http-exchanges/).

- [Envoy SXG
  Filter](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/sxg_filter)
  generates and serves SXGs for sites that use
  [Envoy](https://www.envoyproxy.io/).

### General-purpose SXG tooling

#### sxg-rs HTTP server

The [sxg-rs
http\_server](https://github.com/google/webpackager/blob/main/cmd/webpkgserver/README.md)
acts as a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy) for
serving SXGs. For requests from SXG crawlers, `http_server` will sign the
responses from the backend and respond with an SXG. For installation
instructions, see [the
README](https://github.com/google/webpackager/blob/main/cmd/webpkgserver/README.md).

#### Web Packager Server

The [Web Packager
Server](https://github.com/google/webpackager/blob/main/cmd/webpkgserver/README.md),
`webpkgserver`, is an alternative to sxg-rs http\_server, written in Go. For
instructions on setting up the Web Packager server, see [How to set up signed
exchanges using Web Packager](/signed-exchanges-webpackager).

#### Web Packager CLI

The [Web Packager CLI](https://github.com/google/webpackager) generates a SXG
corresponding to a given URL.

```shell
webpackager \
    --private\_key=private.key \
    --cert\_url=https://example.com/certificate.cbor \
    --url=https://example.com
```

Once the SXG file has been generated, upload it to your server and serve it with
the `application/signed-exchange;v=b3` MIME type. In addition, you will need to
serve the SXG certificate as `application/cert-chain+cbor`.

### SXG libraries

These libraries could be used to build your own SXG generator:

- [`sxg_rs`](https://github.com/google/sxg-rs/tree/main/sxg_rs) is a Rust library for
  generating SXGs. It is the most featureful SXG library and is used as the
  basis for the `cloudflare_worker` and `fastly_compute` tools.

- [`libsxg`](https://github.com/google/libsxg) is a minimal C library for
  generating SXGs. It is used as the basis for the NGINX SXG module and the
  Envoy SXG Filter.

- [`go/signed-exchange`](https://github.com/WICG/webpackage/tree/main/go/signedexchange)
  is a minimal Go library provided by the webpackage specification as a
  [reference
  implementation](https://en.wikipedia.org/wiki/Reference_implementation) of
  generating SXGs. It is used as the basis for its reference CLI tool,
  [`gen-signedexchange`](https://github.com/WICG/webpackage/tree/main/go/signedexchange)
  and the more featureful Web Packager tools.
  
### Content negotiation

Servers should serve SXG when the Accept header indicates that the q-value for application/signed-exchange is greater than or equal to the q-value for text/html. In practice, this means that an origin server will serve SXG to crawlers, but not browsers. Many of the above tools do this by default, but for other tools, the following regular expression can be used to match the Accept header of requests that should be served as SXG:
```http
Accept: /(^|,)\s\*application\/signed-exchange\s\*;\s\*v=[[:alnum:]\_-]+\s\*(,|$)/
```

[This recommendation](https://github.com/google/webpackager/blob/main/cmd/webpkgserver/README.md#content-negotiation) includes examples for Apache and nginx.

{% Aside %}
SXG can deliver superior performance when used with caching or prefetching. However, for content that is loaded directly from the origin server without the benefit of these optimizations, text/html delivers better performance than SXG. Serving content as SXG allows crawlers and other intermediaries to cache SXGs for faster delivery to users.
{% endAside %}

### Linking to SXG

Any site can cache, serve, and prefetch SXGs of the pages that it links to, where available, using the <link> and <a> tags:
```html
<a href="https://example.com/article.html.sxg">
<link rel="prefetch" as="document" href="https://example.com/article.html.sxg">
```
[This article](/how-to-distribute-signed-http-exchanges/) illustrates how to use nginx to distribute SXGs.

## Unique Advantages

SXG is one of many possible technologies to enable cross-origin prefetching. When deciding which technology to use, you may need to trade off between optimizing different aspects. The following sections illustrate a few of the unique values that SXG provides in the space of possible solutions. These factors may change over time as the space of available solutions evolves.

### Fewer requests to serve

With cross-site prefetching, your server may need to serve additional requests. This corresponds to cases where a page was prefetched, but either the user didn't visit the page, or the prefetched bytes couldn't be shown to the user. For SXG, these additional unused requests can be significantly reduced:

- SXGs are cached and may be sent to users until they expire. Thus, many prefetches can be handled solely by the cache server.
- SXGs can be shown to users both with and without cookies on your site. Thus, there are fewer times when the page will need to be fetched again after navigation.

### Page speed improvement

You may see additional page speed improvement due to the prefetch surfaces and capabilities it currently supports:

- SXGs can be shown to users with cookies for your site.
- SXG also prefetches subresources for your pages, such as JavaScript, CSS, fonts, and images, when specified using a `Link` header.
- In the near future, SXG prefetching from Google Search will be available on more search result types.

## Roadmap

We are continuing to invest in SXG with new features and capabilities. Here is a preview of some improvements coming over the next few months, which address common limitations for sites looking to implement SXG.

### Update Cache API

The Google SXG Cache will soon launch an API that site owners can use to remove SXGs from the cache. This can help ensure freshness in cases where `max-age` isn't enough.

## Conclusion
 
Signed Exchanges are a delivery mechanism that make it possible to verify the
origin and validity of a resource independently of how the resource was
delivered. As a result, SXGs can be distributed by third-parties while
maintaining full publisher attribution.

## Further reading

*   [Draft spec for Signed HTTP Exchanges](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html)
*   [Web Packaging explainers](https://github.com/WICG/webpackage/tree/main/explainers)
*   [Get started with signed exchanges on Google Search](https://developers.google.com/search/docs/advanced/experience/signed-exchange)
*   [How to set up Signed Exchanges using Web Packager](/signed-exchanges-webpackager)
*   [Demo of Signed Exchanges](https://signed-exchange-testing.dev/)
