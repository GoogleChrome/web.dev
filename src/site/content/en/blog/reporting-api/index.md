---
layout: post
title: Monitor your web application with the Reporting API
subhead: |
  Use the Reporting API to monitor security violations, deprecated API calls, and more.
authors:
  - maudn
date: 2021-09-22
updated: 2021-09-22
description: |
  Use the Reporting API to monitor security violations, deprecated API calls, and more.
hero: image/O2RNUyVSLubjvENAT3e7JSdqSOx1/PEgnzZFQVPhP2PyOnMm8.jpg
alt: |
  A person looking into a scope, symbolizing monitoring and observation via the Reporting API.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - monitoring
  - security
---

{% Banner 'caution', 'body' %}
This is an API guide with detailed usage examples for the
**Reporting API (v1)**, which uses the `Reporting-Endpoints` header. If you're already
using the legacy Reporting API (`Report-To` header), head over to the [migration post](/reporting-api-migration) instead.
{% endBanner %}

Some errors only occur in production. You won't see them locally or during development
because **real users**, **real networks**, and **real devices** change the game. The
Reporting API helps catch some of these errors⏤such as security violations or deprecated and soon-to-be-deprecated API calls⏤across your site, and transmits them to an
endpoint you've specified. It lets you declare what you'd like to monitor via HTTP headers, and is operated **by the browser**.

Setting up the Reporting API gives you peace of mind that when users experience these
types of errors, you'll know, so you can fix them. ✨

This post covers what this API can do and how to use it. Let's dive in!

## Demo and code

[Demo site: report generation page 💥](https://reporting-api-demo.glitch.me). This page
uses the new Reporting API via the `Reporting-Endpoints` header. See the
[code](https://glitch.com/edit/#!/reporting-api-demo).

[Demo site: reporting endpoint 📬](https://reports-endpoint.glitch.me). This page
receives and displays reports. See the
[code](https://glitch.com/edit/#!/reports-endpoint).

## Overview

<figure class="w-figure">
{% Img src="image/O2RNUyVSLubjvENAT3e7JSdqSOx1/RgiT3KRy6w99wG1cAhha.png", alt="Diagram summarizing the steps below, from report generation to report access by the developer", width="800", height="240" %}
  <figcaption class="w-figcaption">
    How reports are generated and sent.
  </figcaption>
</figure>

Let's assume that your site, `site.example`, has a Content-Security-Policy and a Document-Policy (you don't need to know what these do in order to understand this example!).

You decide to monitor your site in order to know when these policies are violated, but also because
you want to keep an eye on deprecated or soon-to-be-deprecated APIs your codebase may be using.

To do
so, you configure a `Reporting-Endpoints` header, and map these endpoint names via the
`'report-to'` directive in your policies where needed.

```http
Reporting-Endpoints: main-endpoint="https://reports.example/main", default="https://reports.example/default"
```

```http
# Content-Security-Policy violations and Document-Policy violations will be sent to main-endpoint
Content-Security-Policy: script-src 'self'; object-src 'none'; report-to main-endpoint;
Document-Policy: document-write=?0; report-to=main-endpoint;
# Deprecation reports don't need an explicit endpoint because these reports are always sent to the `default` endpoint
```

Something unforeseen happens, and these policies get violated for some of your users.

{% Details %}

{% DetailsSummary 'h4' %}

Example violations

{% endDetailsSummary %}

`index.html`

```html
<script src="script.js"></script>
<!-- CSP VIOLATION: Try to load a script that's forbidden as per the Content-Security-Policy -->
<script src="https://example.com/script.js"></script>
```

`script.js`, loaded by `index.html`

```javascript
// DOCUMENT-POLICY VIOLATION: Attempt to use document.write despite the document policy
try {
  document.write('<h1>hi</h1>');
} catch (e) {
  console.log(e);
}
// DEPRECATION: Call a deprecated API
const webkitStorageInfo = window.webkitStorageInfo;
```

{% endDetails %}

The browser generates a CSP violation report, a Document-Policy violation report, and a Deprecation report that capture these issues.

With a short delay—up to a minute—the browser then sends the reports to the endpoint
that was configured for this violation type. The reports are sent
**[out-of-band](https://en.wikipedia.org/wiki/Out-of-band_data)** by
the browser itself (not by your server nor by your site).

The endpoint(s) receive(s) these reports.

You can now access the reports on these endpoints and monitor what went wrong. You're ready
start troubleshooting to solve the problem that's affecting your users.

{% Details %}

{% DetailsSummary 'h4' %}

Example report

{% endDetailsSummary %}

```json
{
  "age": 2,
  "body": {
    "blockedURL": "https://site2.example/script.js",
    "disposition": "enforce",
    "documentURL": "https://site.example",
    "effectiveDirective": "script-src-elem",
    "originalPolicy": "script-src 'self'; object-src 'none'; report-to main-endpoint;",
    "referrer": "https://site.example",
    "sample": "",
    "statusCode": 200
  },
  "type": "csp-violation",
  "url": "https://site.example",
  "user_agent": "Mozilla/5.0... Chrome/92.0.4504.0"
}
```

{% endDetails %}

## Use cases and report types

The Reporting API can be configured to help you monitor many types of interesting warnings/issues that happen throughout
your site:

{% Banner 'caution', 'body' %}

[Network Error Logging](https://w3c.github.io/network-error-logging/) isn't listed because it isn't supported in the new version of
the API. Check the [migration guide](/reporting-api-migration/#network-error-logging) for details.

{% endBanner %}

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Report type</th>
        <th>Example of a situation where a report would be generated</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://developer.mozilla.org/docs/Web/HTTP/CSP">CSP</a> violation (Level 3 only)</td>
        <td>You've set a <code>Content-Security-Policy</code> (CSP) on one of your pages, but the page is trying to load a script that's not allowed by your CSP.</td>
      </tr>
      <tr>
        <td><a href="/why-coop-coep/#coop">COOP</a> violation</td>
        <td>You've set a <code>Cross-Origin-Opener-Policy</code> on a page, but a cross-origin window is trying to interact directly with the document.</td>
      </tr>
      <tr>
        <td><a href="/why-coop-coep/#coep">COEP</a> violation</td>
        <td>You've set a <code>Cross-Origin-Embedder-Policy</code> on a page, but the document includes a cross-origin iframe that has not opted into being loaded by cross-origin documents.</td>
      </tr>
      <tr>
        <td>Document Policy violation</td>
        <td>The page has a document policy that prevents usage of <code>document.write</code>, but a script tries to call <code>document.write</code>.</td>
      </tr>
      <tr>
        <td>Deprecation warning</td>
        <td>The page is using an API that is deprecated or will be deprecated, directly or via a top-level third-party script.
        </td>
      </tr>
      <tr>
        <td>Intervention</td>
        <td>The page is trying to do something that the browser decides not to honor, for security, performance or user experience reasons. Example in Chrome: the page uses <a href="https://developers.google.com/web/updates/2016/08/removing-document-write"><code>document.write</code> on slow networks</a> or calls <code>navigator.vibrate</code> in a cross-origin frame that the user hasn't interacted with yet.</td>
      </tr>
      <tr>
        <td>Crash</td>
        <td>The browser crashes while your site is open.</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}
[Permissions
policy](https://developer.mozilla.org/docs/Web/HTTP/Headers/Feature-Policy)
(formerly feature policy) violation reports may be supported by default in the future.
Right now, they're experimental. One example situation where such reports would be
generated is if your site has a permission policy to prevent microphone usage, and a
script requests audio input.

{% endAside %}

## Reports

### What do reports look like?

The browser sends reports to the endpoint you've configured, in requests that look as follows:

```http
POST
Content-Type: application/reports+json
```

The payload of these requests is a list of reports.

{% Details %}

{% DetailsSummary 'h4' %}

Example list of reports

{% endDetailsSummary %}

```json
[
  {
    "age": 420,
    "body": {
      "columnNumber": 12,
      "disposition": "enforce",
      "lineNumber": 11,
      "message": "Document policy violation: document-write is not allowed in this document.",
      "policyId": "document-write",
      "sourceFile": "https://site.example/script.js"
    },
    "type": "document-policy-violation",
    "url": "https://site.example/",
    "user_agent": "Mozilla/5.0... Chrome/92.0.4504.0"
  },
  {
    "age": 510,
    "body": {
      "blockedURL": "https://site.example/img.jpg",
      "destination": "image",
      "disposition": "enforce",
      "type": "corp"
    },
    "type": "coep",
    "url": "https://dummy.example/",
    "user_agent": "Mozilla/5.0... Chrome/92.0.4504.0"
  }
]
```

{% endDetails %}

Here's the data you can find in each
of these reports:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Field</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>age</code></td>
        <td>The number of milliseconds between the report's timestamp and the current time.</td>
      </tr>
      <tr>
        <td><code>body</code></td>
        <td>The actual report data, serialized into a JSON string. The fields contained in a report's <code>body</code> are determined by the report's <code>type</code>. <strong>⚠️ Reports of different types will have different bodies</strong>.
        To check the exact body of each report type, check out the <a href="https://reports-endpoint.glitch.me">demo reporting endpoint<a>.</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td>A report type, for example <code>csp-violation</code> or <code>coep</code>.</td>
      </tr>
      <tr>
        <td><code>url</code></td>
        <td>The address of the document or worker from which the report was generated. Sensitive data such as username, password, and fragment are <a href="https://w3c.github.io/reporting/#capability-urls">stripped<a> from this URL.</td>
      </tr>
      <tr>
        <td><code>user_agent</code></td>
        <td>User-Agent header of the request from which the report was generated.</td>
      </tr>
    </tbody>
  </table>
</div>

### When and how does the browser send reports?

**Reports are delivered out-of-band from your site**, meaning that the browser
controls when reports are sent to your endpoint(s). It captures, queues, and sends reports automatically
at a suitable time.

This means that there's little to no performance concern when using the Reporting API, and there's
also no way to control when the browser sends queued reports.

Reports are sent with a delay⏤up to a minute⏤to increase the chances to send reports in batches. This saves bandwidth to be respectful to the user's network connection, which is especially important on mobile. The browser can also delay delivery if it's
busy processing higher priority work, or if the user is on a slow and/or
congested network at the time.

{% Aside %}
When you're debugging locally, you can turn off this delay for convenience. See [how](#save-time).
{% endAside %}

### What reports are sent?

If you've set up `Reporting-Endpoints` and a few policies on your page:

- Reports that are generated due to violations or deprecations happening on your
  page **will** be sent to the endpoint(s) you've configured. This includes violations committed
  by third-party scripts running on your page.
- Violations or deprecations that happened in a cross-origin iframe embedded in your page will **not** be reported to your endpoint(s) (at least not by default). An iframe could set up its own reporting and even
  report to your site's⏤that is, the first-party's⏤reporting service; but that's up to the framed site.

{% Aside 'gotchas' %}

In Chrome DevTools, you'll see a console error or warning pop up for violations that are committed
by third-party scripts _and_ third-party iframes. Not all of these will translate to reports being sent to your endpoint.

{% endAside %}

## Browser support

The table below sums up browser support for the **Reporting API v1**, that is with the
`Reporting-Endpoints` header. Browser support for the Reporting API v0 (`Report-To`
header) is the same, except for one report type: Network Error Logging isn't supported in
the new Reporting API. Read the [migration
guide](/reporting-api-migration/#network-error-logging) for details.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Report type</th>
        <th>Chrome</th>
        <th>Chrome iOS</th>
        <th>Safari</th>
        <th>Firefox</th>
        <th>Edge</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>CSP violation (Level 3 only)</td>
        <td>✔ Yes</td>
        <td>✘ No</td>
        <td>✘ No</td>
        <td>✘ No</td>
        <td>✔ Yes</td>
      </tr>
      <tr>
        <td>Network Error Logging</td>
        <td>✘ No</td>
        <td>✘ No</td>
        <td>✘ No</td>
        <td>✘ No</td>
        <td>✘ No</td>
      </tr>
      <tr>
        <td>All other types: COOP/COEP violation, Document Policy violation, Deprecation, Intervention, Crash</td>
        <td>✔ Yes</td>
        <td>✘ No</td>
        <td>✘ No</td>
        <td>✘ No</td>
        <td>✔ Yes</td>
      </tr>
    </tbody>
  </table>
</div>

## Using the Reporting API

### Step 1: Decide where reports should be sent

You have two options:

- Send reports to an existing report collector service.
- Send report to a reporting collector you build and operate yourself.

#### Option 1: Use an existing report collector service

Some examples of report collector services are:

- [report-uri](https://report-uri.com)
- [uriports](https://uriports.com)

If you know of other solutions, please [open an
issue](https://github.com/GoogleChrome/web.dev/issues) to let us know, and we'll update
this post!

**Beside pricing, a few aspects should be considered when selecting a report collector as a service:** 🧐

- Does this collector support all report types? For example, not all reporting endpoint
  solutions support COOP/COEP reports.
- Are you comfortable sharing any of your application's URLs with a third-party report collector? Even if
  the browser strips sensitive information from these URLs, sensitive
  information [may get leaked this way](https://w3c.github.io/reporting/#capability-urls). If
  this sounds too risky for your application, operate your own reporting endpoint.

#### Option 2: Build and operate your own report collector

Building your own server that receives reports isn't that trivial. To get started, you can
use our lightweight boilerplate. It's built with express and can receive and display
reports.

1. Head over to the [boilerplate report
   collector](https://glitch.com/edit/#!/reports-endpoint).

1. {% Instruction 'remix' %}

1. You now have your clone! You can customize it for your own purposes.

If you're not using the boilerplate and are building your own server from scratch:

- Check for `POST` requests with a `Content-Type` of `application/reports+json` to recognize reports requests sent by the browser to your endpoint.
- If your endpoint lives on a different origin than your site, ensure it supports [CORS preflight
  requests](https://developer.mozilla.org/docs/Glossary/Preflight_request).

{% Aside 'gotchas' %}
Make sure your endpoint
supports [CORS preflight
requests](https://developer.mozilla.org/docs/Glossary/Preflight_request).
{% endAside %}

#### Option 3: Combine Option 1 and 2

You may want to let a specific provider take care of some types of reports, but have an in-house solution for others.

In this case, set multiple endpoints as follows:

```http
Reporting-Endpoints: endpoint-1="https://reports-collector.example", endpoint-2="https://my-custom-endpoint.example"
```

### Step 2: Configure the `Reporting-Endpoints` header

#### Configure the header

Set a `Reporting-Endpoints` response header. Its value must be one or a series of comma-separated key-value pairs:

```http
Reporting-Endpoints: main-endpoint="https://reports.example/main", default="https://reports.example/default"
```

- Each key can be a name of your choice, such as `main-endpoint` or `endpoint-1`. You can decide to set different named endpoints for different report types⏤for example, `my-coop-endpoint`, `my-csp-endpoint`. With this, you can route reports to different endpoints depending on their type.
- If you want to receive **intervention**, **deprecation** and/or **crash** reports, set an endpoint named `default`.

{% Aside 'gotchas' %}

- If the `Reporting-Endpoints` header defines no `default` endpoint, reports of this type will **not** be sent (although they will be generated).
- Despite its name, `default` is **not** a fallback endpoint. For example, if you set up `report-to my-endpoint` for `Document-Policy` and omit to define `my-endpoint` in `Reporting-Endpoints`, `Document-Policy` violations reports will not be sent (although they will be generated).

{% endAside %}

- Each value is a URL of your choice, where the reports will be sent to; the URL to set here depends on what you've decided in Step 1.
- If you're migrating from the legacy Reporting API to the new Reporting API, it may make
  sense to set **both** `Reporting-Endpoints` and `Report-To`. See details in the
  [migration guide](/reporting-api-migration/#migration-steps). In particular, if you're using reporting for `Content-Security-Policy` violations via the
  `report-uri` directive only, check the [Migration steps for
  CSP reporting](/reporting-api-migration/#migration-steps-for-csp-reporting).

##### Examples

```http
Reporting-Endpoints: my-coop-endpoint="https://reports.example/coop", my-csp-endpoint="https://reports.example/csp", default="https://reports.example/default"
```

You can then use each named endpoint in the appropriate policy.

```http
Reporting-Endpoints: main-endpoint="https://reports.example/main", default="https://reports.example/default"
Report-To: ..
```

##### What's a valid endpoint URL?

An endpoint URL:

- Must start with a slash (`/`). Relative paths are **not** supported.
- Can be cross-origin; but in that case credentials are **not** sent with the reports.

##### Where to set the header?

In the new Reporting API⏤the one that is covered in this post⏤ reports are scoped to **documents**. This means that for one
given origin, different documents (`site.example/page1` and `site.example/page2`) can send reports to different endpoints.

If you're migrating from the legacy Reporting API
to the new Reporting API, check the [migration guide](/reporting-api-migration).

#### Edit your policies

Add a `report-to` directive to each policy for which you wish to receive violation reports; the value of the directive
should be one of the named endpoints you've configured.

This is not needed for **deprecation**, **intervention** and **crash** reports. These reports are
generated as long as a `default` endpoint is set up, and they're sent to this `default` endpoint.

Example

```http
# Content-Security-Policy violations and Document-Policy violations will be sent to main-endpoint
Content-Security-Policy: script-src 'self'; object-src 'none'; report-to main-endpoint;
Document-Policy: document-write=?0;report-to=main-endpoint;
# Deprecation reports don't need an explicit endpoint because these reports are always sent to the default endpoint
```

{% Banner 'caution', 'body' %} Getting the syntax right can be tricky,
because not all policies use the same header structure. Depending on the policy, the right
syntax may be `report-to=main-endpoint` or `report-to main-endpoint`. Head over to the
[demo](https://glitch.com/edit/#!/reporting-api-demo?path=server.js%3A1%3A0) for code
examples. {% endBanner %}

#### Example code

To see all this in context, below is an example Node server that uses Express and brings together all the pieces discussed in this article.
It shows how to configure reporting for several different report types and displays the results.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/reporting-api-demo?path=server.js&previewSize=0"
    title="Reporting API demo on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Debug your reporting setup

### Intentionally generate reports

When debugging, you may want to intentionally violate your policies in order to receive
reports. To see example code that violates policies and does other bad things that
will generate reports of all types, check out the [demo](#demo-and-code).

### Save time

Reports may be sent with a delay⏤about a minute, which is a _long_ time when debugging. 😴 Luckily, when debugging in Chrome, you can use the flag `--short-reporting-delay` to receive reports as soon as they're generated.

Run this command in your terminal to turn on this flag:

```bash
YOUR_PATH/TO/EXECUTABLE/Chrome --short-reporting-delay
```

{% Aside %}
This flag is not available via the Chrome UI, it's a command line flag only. See [How to run Chromium with flags](https://www.chromium.org/developers/how-tos/run-chromium-with-flags).
{% endAside %}

### Troubleshooting

Are reports not showing up as expected?
Here are a few tips to troubleshoot this.

#### Is the report generated?

To answer this, use the console errors and the issues as an indirect debugging technique.
**Are violation errors and issues generated?**

- If yes: you can be sure that the report is generated—but it doesn't mean it will be sent
  to your endpoint.
  - It won't be sent to your endpoint if there's an issue with your `Reporting-Endpoints`
    setup. So, if you get a console error but no report, it means there may be an issue
    with your `Reporting-Endpoints` setup. Check [Is the report properly sent and
    received?](#is-the-report-properly-sent-and-received) for troubleshooting tips.
  - It won't be sent to your endpoint if the issue is generated by a cross-site iframe on
    your site. [See details](#reports-you-get).
- If no: your policy may be misconfigured.

<figure class="w-figure">
{% Img src="image/O2RNUyVSLubjvENAT3e7JSdqSOx1/6w0hKHGRQJZkp6NNT3n2.jpg", alt="Screenshot: errors and issues in Chrome DevTools", width="800", height="566" %}
  <figcaption class="w-figcaption">
    Errors and isisuesin Chroe DevTools
  </figcaption>
</figure>

{% Aside %} In Chrome DevTools, [features are being
developed](https://bugs.chromium.org/p/chromium/issues/detail?id=1217725) to enable you to
see the reports your page generated. Once this is released, you'll be able to see reports
within Chrome DevTools. {% endAside %}

#### Is the report properly sent and received?

{% Aside 'gotchas' %} Because the report is sent out-of-band by the browser itself and not
by a certain site, **the `POST` requests with the reports are not visible in the Network
panel of your Developer Tools.** Dedicated DevTools support is being implemented to
surface these requests. {% endAside %}

To answer this, try the following:

- Make sure to use [short delays](#saving-time). Maybe the reason you can't see the report
  is because it hasn't been sent yet!
- Check your header configuration. If there's an issue with it, reports that have been
  generated correctly will not be sent. Common mistakes:

  - The report group is used but not configured. Example:
    {% Compare 'worse', 'Code with a mistake' %}

    ```http
    Cross-Origin-Embedder-Policy: "require-corp;report-to='coep-endpoint'"
    Reporting-Endpoints: default= "https://reports.example/default",
    ```

    {% CompareCaption %}

    COEP reports should be sent to `coep-endpoint`, but this endpoint name isn't configured
    in `Reporting-Endpoints`.

    {% endCompareCaption %}

    {% endCompare %}

  - The default endpoint is missing; some reports like deprecation and others _need_ the
    endpoint named `default`.

- Look for issues in your policy configuration, such as missing quotes. [See details](#configure-the-policies).
- Make sure that your endpoint is CORS-configured. One common mistake is when the endpoint
  doesn't support CORS preflight requests.
- Check if your endpoint itself can handle incoming requests. To do so, instead of
  generating reports manually, you can emulate the browser by sending to your endpoint
  requests that look like what the browser would send. Run the following:

```bash
curl --header "Content-Type: application/reports+json" \
  --request POST \
  --data '[{"age":420,"body":{"columnNumber":12,"disposition":"enforce","lineNumber":11,"message":"Document policy violation: document-write is not allowed in this document.","policyId":"document-write","sourceFile":"https://dummy.example/script.js"},"type":"document-policy-violation","url":"https://dummy.example/","user_agent":"xxx"},{"age":510,"body":{"blockedURL":"https://dummy.example/img.jpg","destination":"image","disposition":"enforce","type":"corp"},"type":"coep","url":"https://dummy.example/","user_agent":"xxx"}]' \
  YOUR_ENDPOINT
```

Your endpoint should answer with `200 OK` or similar, and should receive the reports. If not,
there's an issue with the endpoint's configuration.

## Related reporting mechanisms

### Report-Only

CSP, COOP and COEP headers each have a `Report-Only` variant:
[`Content-Security-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only),
[`Cross-Origin-Embedder-Policy-Report-Only`](https://web.dev/coop-coep/#group) and
[`Cross-Origin-Opener-Policy-Report-Only`](https://web.dev/coop-coep/#group). Both the
main headers and their `Report-Only` variant are configured using `report-to`. Once
`report-to` is configured, you need to specify endpoints.

To specify endpoints, use the Reporting API header⏤preferably, the new header `Reporting-Endpoints`
(Reporting API v1) instead of the legacy one `Report-To` (v0). CSP has its own
specificities with `report-uri`. See details in the [migration
guide](/reporting-api-migration).

### `ReportingObserver`

The [`ReportingObserver`](/reporting-observer) JavaScript API can help you observe client-side
warnings.

Both `ReportingObserver` and the `Reporting-Enpoints` header are part of the same Reporting API
spec, but they enable slightly different uses cases.

`ReportingObserver` can surface client-side warnings such as deprecations and browser interventions;
**the reports will look the same as the ones generated via `Reporting-Endpoints`**. However, unlike
`Reporting-Endpoints`, `ReportingObserver` doesn't capture any other types of reports, such as CSP
or COOP/COEP violations.

Use `ReportingObserver` if:

- You only want to monitor deprecations and/or browser interventions.
- You need to react to these violations in real-time (`ReportingObserver` makes it possible to
  attach a callback to a violation event).
- You want to attach additional information to a report to aid in debugging.

Note that with `ReportingObserver`, reports are not automatically sent to a server (unless you
choose to do so in the callback).

Another point to highlight is that `ReportingObserver` is configured only client-side, which means
you can use it event if you have no control over server-side headers⏤you can't do that with
Reporting API.

## Further reading

- [Migration guide from reporting API v0 to v1](/reporting-api-migration)
- [ReportingObserver](/reporting-observer)
- [Specification: legacy Reporting API (v0)](https://www.w3.org/TR/reporting/)
- [Specification: new Reporting API (v1)](https://w3c.github.io/reporting/)

_Hero image by [Nine Koepfer / @enka80](https://unsplash.com/@enka80) on
[Unsplash](https://unsplash.com/photos/iPbwEiWkVMQ), edited._ _With many thanks to Ian
Clevelland, Eiji Kitamura and Milica Mihajlija for their reviews and suggestions on this
article._
