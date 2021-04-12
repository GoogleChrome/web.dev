---
layout: post
title: A guide to enable cross-origin isolation
authors:
  - agektmr
date: 2021-02-09
updated: 2021-03-16
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
isolation is required if you want to use
[`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer),
[`performance.measureUserAgentSpecificMemory()`](/monitor-total-page-memory-usage/),
or the JS Self-Profiling API.

{% Banner 'info', 'body' %}
Starting in Chrome 91, functionalities that use `SharedArrayBuffer` will no longer 
work without cross-origin isolation. If you landed on this page due to a 
`SharedArrayBuffer` deprecation message, it's likely either your website or one of 
the resources embedded on it is using `SharedArrayBuffer`. To ensure nothing breaks 
on your website due to deprecation, follow the steps in this post.
{% endBanner %}


{% Aside 'objective' %}
* Turn on cross-origin isolation to keep using `SharedArrayBuffer`.
* If you rely on third-party code that uses `SharedArrayBuffer`, notify the third-party 
  provider to take action.
{% endAside %}

## Determine where in your website `SharedArrayBuffer` is used

If you are not sure where in your site a `SharedArrayBuffer` is used, there are
two ways find out:

* Using Chrome DevTools
* (Advanced) Using Deprecation Reporting

If you already know where you are using `SharedArrayBuffer`, skip to 
[Analyze the impact of cross-origin isolation](#analysis).

### Using Chrome DevTools

[Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/open)
allows developers to inspect websites. 

1. [Open the Chrome
   DevTools](https://developers.google.com/web/tools/chrome-devtools/open) on
   the page you suspect might be using `SharedArrayBuffer`.
2. Select the **Console** panel.
3. If the page is using `SharedArrayBuffer`, the following message will show up:
      ```text
      [Deprecation] SharedArrayBuffer will require cross-origin isolation as of M91, around May 2021. See https://developer.chrome.com/blog/enabling-shared-array-buffer/ for more details. common-bundle.js:535
      ```
4. The filename and the line number at the end of the message (for example, `common-bundle.js:535`) 
   indicate where the `SharedArrayBuffer` is coming from. If it's a third-party library, 
   contact the developer to fix the issue. If it's implemented as part of your website, follow 
   the guide below to enable cross-origin isolation.

<figure class="w-figure">
{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/GOgkyjAabePTc8AG22F7.png", alt="DevToools Console warning when SharedArrayBuffer is used without cross-origin isolation", width="800", height="163", class="w-screenshot" %}
   <figcaption>
      DevToools Console warning when SharedArrayBuffer is used without cross-origin isolation.
   </figcaption>
</figure>

### (Advanced) Using Deprecation Reporting

Some browsers have [a reporting functionality of deprecating
APIs](https://wicg.github.io/deprecation-reporting/) to a specified endpoint.

1. [Set up a deprecation report server and get the reporting
   URL](/coop-coep/#set-up-reporting-endpoint). You can achieve this by either
   using a public service or building one yourself.
2. Using the URL, set the following HTTP header to pages that are potentially
   serving `SharedArrayBuffer`.
      ```http
      Report-To: {"group":"default","max_age":86400,"endpoints":[{"url":"THE_DEPRECATION_ENDPOINT_URL"}]}
      ```
3. Once the header starts to propagate, the endpoint you registered to should
   start collecting deprecation reports.

See an example implementation here:
[https://first-party-test.glitch.me](https://first-party-test.glitch.me).

## Analyze the impact of cross-origin isolation  {: #analysis}

Wouldn't it be great if you could assess the impact that enabling cross-origin
isolation would have on your site without actually breaking anything? The
[`Cross-Origin-Opener-Policy-Report-Only`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) and
[`Cross-Origin-Embedder-Policy-Report-Only`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) 
HTTP headers allow you to do just that.

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

1. On cross-origin resources such as images, scripts, stylesheets, iframes, and
   others, set the [`Cross-Origin-Resource-Policy:
   cross-origin`](https://resourcepolicy.fyi/#cross-origin) header. On same-site
   resources, set [`Cross-Origin-Resource-Policy:
   same-site`](https://resourcepolicy.fyi/#same-origin) header.
2. Set the `crossorigin` attribute in the HTML tag on top-level document if the
   resource is served with [CORS](/cross-origin-resource-sharing/) (for example,
   `<img src="example.jpg" crossorigin>`).
3. If cross-origin resources loaded into iframes involve another layer of
   iframes, recursively apply steps described in this section before moving
   forward.
4. Once you confirm that all cross-origin resources are opted-in, set the
   `Cross-Origin-Embedder-Policy: require-corp` header on the cross-origin
   resources loaded into iframes.
5. Make sure there are no cross-origin popup windows that require communication
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
