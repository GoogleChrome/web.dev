---
layout: post
title: Does not use HTTP/2 for all of its resources
description: |
  Learn why HTTP/2 is important for your page's load time and how to enable
  HTTP/2 on your server.
web_lighthouse:
  - uses-http2
date: 2019-05-02
updated: 2020-06-24
---

HTTP/2 serves your page's resources faster
and with less data moving over the wire.

## How the Lighthouse HTTP/2 audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) lists all resources not served over HTTP/2:

<figure class="w-figure">
  <img class="w-screenshot" src="uses-http2.png" alt="Lighthouse audit shows resources not served over HTTP/2 ">
</figure>

Lighthouse gathers all resources from the same host as the page
and checks the HTTP protocol version of each resource.

Lighthouse doesn't check resources from other hosts
because it assumes that you have no control
over how third-party resources are served.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to pass this audit

Serve your resources over HTTP/2.

To learn how to enable HTTP/2 on your servers,
see [Setting up HTTP/2](https://dassur.ma/things/h2setup/).

## Resources

- [Source code for **Does not use HTTP/2 for all of its resources** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/uses-http2.js)
- [Introduction to HTTP/2](https://developers.google.com/web/fundamentals/performance/http2/)
- [HTTP/2 Frequently Asked Questions](https://http2.github.io/faq/)
