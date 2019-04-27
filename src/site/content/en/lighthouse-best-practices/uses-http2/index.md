---
layout: post
title: Uses HTTP/2 for its own resources
description: |
  Learn about `uses-http2` audit.
author: kaycebasques
web_lighthouse:
  - uses-http2
---

HTTP/2 can serve your page's resources faster, and with less data moving over
the wire.

See [HTTP/2 Frequently Asked Question](https://http2.github.io/faq/) for a list of benefits that HTTP/2
provides over HTTP/1.1.

See [Introduction to HTTP/2](https://developers.google.com/web/fundamentals/performance/http2/) for an in-depth technical overview.

## Recommendations

Under **URLs**, Lighthouse lists every resource that was not served over HTTP/2.
To pass this audit, serve each of those resources over HTTP/2.

To learn how to enable HTTP/2 on your servers, see [Setting Up HTTP/2](https://dassur.ma/things/h2setup/).

## More information

Lighthouse gathers all of the resources that are from the same host as the
page, and then checks the HTTP protocol version of each resource.

Lighthouse excludes resources from other hosts from this audit, because it
assumes that you have no control over how these resources are served.
