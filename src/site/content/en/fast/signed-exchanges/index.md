---
layout: post
title: Signed Exchanges (SXGs)
subhead: |
  An SXG is a delivery mechanism that makes it possible to authenticate the
  origin of a resource independently of how it was delivered.
authors:
  - katiehempenius
date: 2020-10-14
updated: 2021-03-02
hero: image/admin/6ll3P8MYWxvtb1ZjXIzb.jpg
alt: A pile of envelopes.
description: |
  An SXG is a delivery mechanism that makes it possible to authenticate the
  origin of a resource independently of how it was delivered.
tags:
  - blog
  - performance
---

A signed exchange (SXG) is a delivery mechanism that makes it possible to
authenticate the origin of a resource independently of how it was delivered.
This article provides an overview of SXGs.

## Browser compatibility {: #browser-compatibility }

SXGs are [supported](https://caniuse.com/#feat=sxg) by Chromium-based browsers
(starting with versions: Chrome 73, Edge 79, and Opera 64).

## Overview

Signed Exchanges (SXGs) allow a site to cryptographically sign a
request/response pair (an "HTTP exchange") in a way that makes it possible for
the browser to verify the origin and integrity of the content independently of
how the content was distributed. As a result, the browser can display the URL of
the origin site in the address bar, rather than the URL of the server that
delivered the content. Separating content attribution from content distribution
advances a variety of use cases such as privacy-preserving prefetching, offline
internet experiences, and serving content from third-party caches.

### The SXG format

An SXG is encapsulated in a [binary-encoded](https://cbor.io/) file that has two
primary components: an HTTP exchange and a
[signature](https://developer.mozilla.org/en-US/docs/Glossary/Signature/Security).
The HTTP exchange consists of a request URL, content negotiation information,
and an HTTP response.

Here's an example of a decoded SXG file:

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

The `expires` parameter in the signature indicates a SXG's expiration date. A
SXG may be valid for at most 7 days. If the expiration date of an SXG is more
than 7 days in the future, the browser will reject it. Find more information on
the signature header in the [Signed HTTP Exchanges
spec](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html#section-3.1).


### Web Packaging

SXGs are a part of the broader [Web
Packaging](https://github.com/WICG/webpackage) spec proposal family. In addition
to SXGs, the other major component of the Web Packaging spec is [Web Bundles](/web-bundles/)
("bundled HTTP exchanges"). Web Bundles are a collection of HTTP resources and
the metadata necessary to interpret the bundle.

The relationship between SXGs and Web Bundles is a common point of confusion.
SXGs and Web Bundles are two distinct technologies that don't depend on each
other—Web Bundles can be used with both signed and unsigned exchanges. The common
goal advanced by both SXGs and Web Bundles is the creation of a "web packaging"
format that allows sites to be shared in their entirety for offline consumption.

SXGs are the first part of the Web Packaging spec that Chromium-based browsers will implement.

## Loading SXGs

Initially, the primary use case of SXGs will likely be as a delivery mechanism
for a page's main document. For this use case, a SXG could be referenced using
the `<link>` or `<a>` tags, as well as the [`Link`
header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link). Like
other resources, a SXG can be loaded by entering its URL in the browser's
address bar.

```html
<a href="https://example.com/article.html.sxg">
```

```html
<link rel="prefetch" as="document" href="https://example.com/article.html.sxg">
```

SXGs can also be used to deliver subresources. For more information, refer to
[Signed Exchange subresource
substitution](https://github.com/WICG/webpackage/blob/main/explainers/signed-exchange-subresource-substitution.md).


## Serving SXGs

### Content negotiation

[Content
negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation)
is a mechanism for serving different representations of the same resource at the
same URL depending on the capabilities and preferences of a client—for example,
serving the gzip version of a resource to some clients but the Brotli version to
others. Content negotiation makes it possible to serve both SXG and non-SXG
representations of the same content depending on a browser's capabilities.

Web browsers use the
[`Accept`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept)
request header to communicate the [MIME
types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
they support. If a browser supports SXGs, the MIME type
`application/signed-exchange` will automatically be included in this list of
values.

For example, this is the `Accept` header sent by Chrome 84:

```json
accept:
text/html,
application/xhtml+xml,
application/xml;q=0.9,
image/webp,image/apng,
\*/\*;q=0.8,
application/signed-exchange;v=b3;q=0.9
```

The `application/signed-exchange;v=b3;q=0.9` portion of this string informs the
web server that Chrome supports SXGs—specifically, version `b3`. The last part
`q=0.9` indicates the
[q-value](https://developer.mozilla.org/en-US/docs/Glossary/Quality_values).

The `q-value` expresses a browser's relative preference for a particular format
using a decimal scale from `0` to `1`, with `1` representing the highest
priority. When a `q-value` is not supplied for a format, `1` is the implied
value.

### Best practices

Servers should serve SXGs when the `Accept` header indicates that the `q-value`
for `application/signed-exchange` is greater than or equal to the `q-value` for
`text/html`.

The following regular expression can be used to match the `Accept` header of
requests that should be served as SXG:

```regex
Accept: /(^|,)\s\*application\/signed-exchange\s\*;\s\*v=[[:alnum:]\_-]+\s\*(,|$)/
```

Note that the subexpression `(,|$)` matches headers where the `q-value` for SXG
has been omitted; this omission implies a `q-value` of `1` for SXG. Although an
`Accept` header could theoretically contain the substring `q=1`, [in
practice](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation/List_of_default_Accept_values)
browsers don't explicitly list a format's `q-value` when it has the default
value of `1`.

## Debugging SXGs with Chrome DevTools {: #debugging }

Signed Exchanges can be identified by looking for `signed-exchange` in the
**Type** column of the **Network** panel in Chrome DevTools.

<figure class="w-figure">
  {% Img src="image/admin/cNdohSaeXqGHFBwD7L3B.png", alt="Screenshot showing a SXG request within the 'Network' panel in DevTools", width="696", height="201" %}
  <figcaption>The <b>Network</b> panel in DevTools</figcaption>
</figure>

The **Preview** tab provides more information about the contents of a SXG.

<figure class="w-figure">
  {% Img src="image/admin/E0rBwuxk4BxFmLJ3gXhP.png", alt="Screenshot of the 'Preview' tab for a SXG", width="800", height="561" %}
  <figcaption>The <b>Preview</b> tab in DevTools</figcaption>
</figure>

To see a SXG firsthand, visit this [demo](https://signed-exchange-testing.dev/)
in [one of the browsers that supports SXG](#browser-compatibility)

## Tooling

This section discusses the tooling options and technical requirements of SXGs.

At a high level, implementing SXGs consists of generating the SXG corresponding
to a given URL and then serving that SXG to users. To generate a SXG you will
need a certificate that can sign SXGs.

### Certificates

Certificates associate an entity with a [public
key](https://en.wikipedia.org/wiki/Public-key_cryptography). Signing a SXG with
a certificate allows the content to be associated with the entity.

Production use of SXGs requires a certificate that supports the
`CanSignHttpExchanges` extension. Per
[spec](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html#section-4.2),
certificates with this extension must have a validity period no longer than 90
days and require that the requesting domain have a [DNS CAA
record](https://en.wikipedia.org/wiki/DNS_Certification_Authority_Authorization)
configured.

This [page](https://github.com/google/webpackager/wiki/Certificate-Authorities)
lists the [certificate
authorities](https://en.wikipedia.org/wiki/Certificate_authority) that can issue
this type of certificate. Certificates for SXGs are only available through a
commercial certificate authority.

### Web Packager

[Web Packager](https://github.com/google/webpackager) is an open-source,
Go-based tool that is the de facto tooling for generating ("packaging") signed
exchanges. You can use it to manually create SXGs, or as a server that
automatically creates and serves SXGs. Web Packager is currently in
[alpha](https://github.com/google/webpackager#limitations).

### Web Packager CLI

The Web Packager CLI generates a SXG corresponding to a given URL.

```shell
webpackager \
    --private\_key=private.key \
    --cert\_url=https://example.com/certificate.cbor \
    --url=https://example.com
```

Once the SXG file has been generated, upload it to your server and serve it with
the `application/signed-exchange;v=b3` MIME type. In addition, you will need to
serve the SXG certificate as `application/cert-chain+cbor`.

### Web Packager Server

The [Web Packager
server](https://github.com/google/webpackager/blob/master/cmd/webpkgserver/README.md),
`webpkgserver`, acts as a [reverse
proxy](https://en.wikipedia.org/wiki/Reverse_proxy) for serving SXGs. Given a
URL, `webpkgserver` will fetch the URL's contents, package them as an SXG, and
serve the SXG in response. For instructions on setting up the Web Packager
server, see [How to set up signed exchanges using Web
Packager](/signed-exchanges-webpackager).

In production, `webpkgserver` should not use a public endpoint. Instead, the
frontend web server should forward SXG requests to `webpkgserver`. These
[recommendations](https://github.com/google/webpackager/blob/master/cmd/webpkgserver/README.md#running-behind-front-end-edge-server)
contain more information on running `webpkgserver` behind a frontend edge
server.

### Other tooling

This section lists tooling alternatives to Web Packager. In addition to these
options, you can also choose to build your own SXG generator.


- NGINX SXG Module

  The [NGINX SXG module](https://github.com/google/nginx-sxg-module) generates
  and serves SXGs. Sites that already use NGINX should consider using this
  module over Web Packager Server.

  The NGINX SXG module only works with `CanSignHttpExchanges` certificates.
  Setup instructions can be found
  [here](/how-to-set-up-signed-http-exchanges/).


- `libsxg`

  [`libsxg`](https://github.com/google/libsxg) is a minimal, C-based library for
  generating SXGs. `libsxg` can be used to build an SXG generator that
  integrates into other pluggable servers. The NGINX SXG module is built on top
  of `libsxg`.


- `gen-signedexchange`

  [`gen-signedexchange`](https://github.com/WICG/webpackage/tree/master/go/signedexchange)
  is a tool provided by the webpackage specification as a [reference
  implementation](https://en.wikipedia.org/wiki/Reference_implementation) of
  generating SXGs. Due to its limited feature set, `gen-signedexchange` is
  useful for trying out SXGs, but impractical for larger-scale and production
  use.

## Further reading

*   [Spec draft](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html)
*   [Explainer](https://github.com/WICG/webpackage/blob/master/explainer.md)
*   [How to set up Signed Exchanges using Web Packager](/signed-exchanges-webpackager)
*   [Demo of Signed Exchanges](https://signed-exchange-testing.dev/)
