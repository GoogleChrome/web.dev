---
layout: post
title: A guide to enable cross-origin isolation
authors:
  - agektmr
date: 2021-02-09
updated: 2021-02-19
subhead: |
  Cross-origin isolation enables a web page to use powerful features such as
  SharedArrayBuffer. This article explains how to enable cross-origin
  isolation on your website.
description: |
  Cross-origin isolation enables a web page to use powerful features such as
  SharedArrayBuffer. This article explains how to enable cross-origin
  isolation on your website.
tags:
  - security
---

This guide shows you how to enable cross-origin isolation. Cross-origin
isolation is required if you want to use SharedArrayBuffer,
[`performance.measureUserAgentSpecificMemory()`](/monitor-total-page-memory-usage/),
or the JS Self-Profiling API.

## Do an impact analysis

Wouldn't it be great if you could assess the impact that enabling cross-origin
isolation would have on your site without actually breaking anything? The
`Cross-Origin-Opener-Policy-Report-Only` and
`Cross-Origin-Embedder-Policy-Report-Only` HTTP headers allow you to do just
that.

1. Set [`Cross-Origin-Opener-Policy-Report-Only:
   same-origin`](/coop-coep/#1.-set-the-cross-origin-opener-policy:-same-origin-header-on-the-top-level-document)
   on your top-level document. As the name indicates, this header only sends
   reports about the impact that `COOP: same-origin` **would** have on your
   site—it won't actually disable communication with popup windows.
2. Set up reporting and configure a web server to receive and save the reports.
3. Set [`Cross-Origin-Embedder-Policy-Report-Only:
   require-corp`](/coop-coep/#3.-use-the-coep-report-only-http-header-to-assess-embedded-resources)
   on your top-level document. Again, this header lets you see the impact of
   enabling `COEP: require-corp` without actually affecting your site's
   functioning yet. You can configure this header to send reports to the same
   reporting server that you set up in the previous step.

{% Aside %}
You can also [enable the **Domain**
column](https://developers.google.com/web/tools/chrome-devtools/network#information)
in Chrome DevTools **Network** panel to get a general view of which resources
would be impacted.
{% endAside %}

{% Aside 'caution' %}
Enabling cross-origin isolation will block the loading of cross-origin resources
that you don't explicitly opt-in, and it will prevent your top-level document
from being able to communicate with popup windows.
{% endAside %}

## Mitigate the impact of cross-origin isolation

After you have determined which resources will be affected by cross-origin
isolation, here are general guidelines for how you actually opt-in those
cross-origin resources:

1. On cross-origin resources loaded into iframes, set the
   `Cross-Origin-Embedder-Policy-Report-Only: require-corp` header to do an
   impact analysis.
2. On cross-origin resources such as images, scripts, stylesheets, iframes, and
   others, set the [`Cross-Origin-Resource-Policy:
   cross-origin`](https://resourcepolicy.fyi/#cross-origin) header. On same-site
   resources, set [`Cross-Origin-Resource-Policy:
   same-site`](https://resourcepolicy.fyi/#same-origin) header.
3. Set the `crossorigin` attribute in the HTML tag on top-level document if the
   resource is served with [CORS](/cross-origin-resource-sharing/) (for example,
   `<img src="example.jpg" crossorigin>`).
4. If cross-origin resources loaded into iframes involve another layer of
   iframes, recursively apply steps described in this section before moving
   forward.
5. Once you confirm that all cross-origin resources are opted-in, set the
   `Cross-Origin-Embedder-Policy: require-corp` header on the cross-origin
   resources loaded into iframes.
6. Make sure there are no cross-origin popup windows that require communication
   through `postMessage()`. There's no way to keep them working when
   cross-origin isolation is enabled. You can move the communication to another
   document that isn't cross-origin isolated, or use a different communication
   method (for example, HTTP requests).

## Enable cross-origin isolation

After you have mitigated the impact by cross-origin isolation, here are general
guidelines to enable cross-origin isolation:

1. Set the `Cross-Origin-Opener-Policy: same-origin` header on your top-level
   document. If you had set `Cross-Origin-Opener-Policy-Report-Only:
   same-origin`, replace it. This blocks communication between your top-level
   document and its popup windows.
2. Set the `Cross-Origin-Embedder-Policy: require-corp` header on your top-level
   document. If you had set `Cross-Origin-Embedder-Policy-Report-Only:
   require-corp`, replace it. This will block the loading of cross-origin
   resources that are not opted-in.
3. Check that `self.crossOriginIsolated` returns `true` in console to verify
   that your page is cross-origin isolated.

## Resources

* [Making your website "cross-origin isolated" using COOP and COEP](/coop-coep/)
* [SharedArrayBuffer updates in Android Chrome 88 and Desktop Chrome
  91](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
