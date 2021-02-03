---
layout: post
title: A guide to enable cross-origin isolation
authors:
  - agektmr
date: 2021-02-08
description: |
  Cross-origin isolation enables a web page to use powerful features such as
  SharedArrayBuffer. This article concisely explains how to enable cross-origin
  isolation on your website.
tags:
  - security
---

Cross-origin isolation enables a web page to use SharedArrayBuffer, (As of
Chrome 88 and [Firefox
89](https://hacks.mozilla.org/2020/07/safely-reviving-shared-memory/). In future
versions,
[`performance.measureUserAgentSpecificMemory()`](/monitor-total-page-memory-usage/),
[JS Self-Profiling API](https://wicg.github.io/js-self-profiling/), etc will
also be available). In return, the page will:

* Block loading cross-origin resources that are not opt-in.
* Give up the communication channel with popup windows.

Follow these steps to make your site [cross-origin
isolated](/coop-coep/) whereby steps 1 to 3 will show issues when
opting-in and steps 4 to 6 trigger the switch:

1. Set the [`Cross-Origin-Opener-Policy-Report-Only:
    same-origin`](/coop-coep/#1.-set-the-cross-origin-opener-policy:-same-origin-header-on-the-top-level-document)
    on the top-level document. You can do a dry run of the
    `Cross-Origin-Opener-Policy` header and determine the potential impacts on
    your implementation. The browser will [send
    reports](/coop-coep/#observe-issues-using-the-reporting-api)
    without making an isolation happening.
2. Set the [`Cross-Origin-Embedder-Policy-Report-Only:
    require-corp`](/coop-coep/#3.-use-the-coep-report-only-http-header-to-assess-embedded-resources)
    on the top-level document. You can do a dry run of the
    `Cross-Origin-Embedder-Policy-Report-Only` header and determine the affected
    cross-origin resources on your implementation. The browser will [send
    reports](/coop-coep/#observe-issues-using-the-reporting-api)
    without blocking cross-origin resources.
3. Ensure resources are opt-in to be loaded
    * Determine affected cross-origin resources by checking [the reported
      resources](/coop-coep/#observe-issues-using-the-reporting-api)
      or by [using the DevTools' **Network**
      panel](https://developers.google.com/web/tools/chrome-devtools/network#information)
      with "Domain" column.
    * Set cross-origin iframes loaded in the page to send
      `Cross-Origin-Embedder-Policy: require-corp` header.
    * Set cross-origin resources (images, scripts, styles, iframes, etc) to send
      [`Cross-Origin-Resource-Policy: cross-origin`](https://resourcepolicy.fyi)
      header.
    * Set the `crossorigin` attribute in the loading HTML tag if the resource is
      served with [CORS](/cross-origin-resource-sharing/).
    * Make sure there's no cross-origin popup windows that require communication
      through `postMessage()`. Since there's no way to keep them working, you
      have to move the integration to a document which isn't cross-origin
      isolated or change how it communicates.* * Determine affected cross-origin
      resources by checking [the reported
      resources](/coop-coep/#observe-issues-using-the-reporting-api)
      or by [using the DevTools' **Network**
      panel](https://developers.google.com/web/tools/chrome-devtools/network#information)
      with "Domain" column.
4. Replace `Cross-Origin-Opener-Policy-Report-Only: same-origin` with
   `Cross-Origin-Opener-Policy: same-origin` header. This will start blocking
   communication between your window and its popup windows.
5. Replace `Cross-Origin-Embedder-Policy-Report-Only: require-corp` with
   `Cross-Origin-Embedder-Policy: require-corp` header. This will start blocking
   loading cross-origin resources that are not opt-in.
6. Check that `self.crossOriginIsolated` returns `true` in console to see if
   your page is cross-origin isolated.

More detailed guidance can be found at [Making your website "cross-origin
isolated" using COOP and COEP](/coop-coep).

## Resources

* [Deploy COOP and COEP to make your website cross-origin
  isolated](https://web.dev/coop-coep/#1.-set-the-cross-origin-opener-policy:-same-origin-header-on-the-top-level-document)
* [SharedArrayBuffer updates in Android Chrome 88 and Desktop Chrome
  91](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
