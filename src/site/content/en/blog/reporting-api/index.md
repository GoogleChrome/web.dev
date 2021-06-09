---
layout: post
title: Monitor your web application with the Reporting API
subhead: |
  Use the Reporting API to get security reports, deprecation reports, and more.
authors:
  - maudn
date: 2021-06-08
updated: 2021-06-08
description: |
  Use the Reporting API to get security reports, deprecation reports, and more.
hero: image/O2RNUyVSLubjvENAT3e7JSdqSOx1/PEgnzZFQVPhP2PyOnMm8.jpg
alt: |
  A person looking into a scope, symbolizing monitoring and observation via the Reporting API.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - monitoring
  - security
---

{% Banner 'caution', 'body' %}
This is an API guide with detailed usage examples for the **Reporting API (v1)**, which uses the `Reporting-Endpoints` header. If you're already using the legacy Reporting API with the `Report-To` header and need to migrate to the new version, head over to the [migration post](/reporting-api-migration) instead.
{% endBanner %}

Some errors only occur in production. You never see them locally or during development because **real users**, **real networks**, and **real devices** change the game.
The Reporting API helps catch some of these errors across your site and transmit them to an endpoint you've specified.

This API enables you to activate a reporting mechanism that's operated by the browser.
With Reporting API configured, reports can be generated when certain policies are violated (or when deprecated APIs are used, when the browser intervenes on your site, when the browser crashes, and more). The browser then sends those report(s) to the endpoint(s) you’ve configured.

Setting up the Reporting API gives you peace of mind that when users experience these types of unforeseen errors, you'll be aware and able to fix them if needed. ✨

```http
  Reporting-Endpoints: main-endpoint="https://reports.example/main", default="https://reports.example/default"
  Content-Security-Policy: "script-src 'self'; object-src 'none'; report-to main-endpoint;"
```

This post covers what this API can do, how it works, and how you can use it.

Let's dive in!

## Demo and code

{% Banner 'info', 'body' %}
[Demo site: report generation page](https://reporting-api-demo.glitch.me). This page uses the new Reporting API via the `Reporting-Endpoints` header. See the [code](https://glitch.com/edit/#!/reporting-api-demo).
[Demo site: reporting endpoint](https://reports-endpoint.glitch.me). This server receives and displays reports. See the
[code](https://glitch.com/edit/#!/reports-endpoint).
{% endBanner %}

## Use cases and report types

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Report type</th>
        <th>Example of a situation when a report would be generated</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP">CSP</a> violation (Level 3 only)</td>
        <td>You've set a Content-Security-Policy on your site, but one of your pages is trying to load a script that's not allowed by your CSP.</td>
      </tr>
      <tr>
        <td><a href="https://web.dev/why-coop-coep/#coop">COOP</a> violation</td>
        <td>You've set a Cross-Origin-Opener-Policy on your site, but a cross-origin window is trying to interact directly with your document.</td>
      </tr>
      <tr>
        <td><a href="https://web.dev/why-coop-coep/#coep">COEP</a> violation</td>
        <td>You've set a Cross-Origin-Embedder-Policy on your site, but a page on your site includes a cross-origin iframe that has not opted into being loaded by cross-origin documents.</td>
      </tr>
      <tr>
        <td>Document Policy violation</td>
        <td>Your site has a document policy that prevents usage of <code>document.write</code>, but a script on your page tries to use <code>document.write</code>.</td>
      </tr>
      <tr>
        <td>Deprecation warning</td>
        <td>Your site is using an API that is deprecated (directly or via a top-level third-party script).
        </td>
      </tr>
      <tr>
        <td>Intervention</td>
        <td>Your site is trying to do something that the browser decides not to honor, for security, performance or user experience reasons. Example in Chrome: your site uses <a href="https://developers.google.com/web/updates/2016/08/removing-document-write"><code>document.write</code> on slow networks</a> or uses <code>navigator.vibrate</code> in a cross-origin frame that the user hasn't interacted with yet.</td>
      </tr>
      <tr>
        <td>Crash</td>
        <td>The browser crashes while your site is open.</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}
Note:

- **Network Error Logging** isn't listed because it isn't supported in the new version of the API. Check the [migration guide](/reporting-api-migration) for details.
- **Permissions policy (formerly feature policy)** violation reports may be supported by default in the future. Right now, they're experimental. Once configured, these reports would be generated for example if your site has a permission policy to prevent microphone usage, but a script is requesting audio input.

{% endAside %}

## How it works

<figure class="w-figure">
{% Img src="image/O2RNUyVSLubjvENAT3e7JSdqSOx1/RgiT3KRy6w99wG1cAhha.png", alt="Diagram summarizing the steps below, from report generation to report access by the developer", width="800", height="240" %}
  <figcaption class="w-figcaption">
    Diagram: how reports are generated and sent
  </figcaption>
</figure>

Let's assume that your site, `site.example`, has a few policies configured.

You decide to monitor your site in order to know when these policies are violated. To do so, you configure a `Reporting-Endpoints` header, and map these endpoint names via `'report-to'` in your policies where needed.

```http
    Reporting-Endpoints: main-endpoint="https://reports.example/main", default="https://reports.example/default"
```

```http
// Content-Security-Policy violations and Document-Policy violations will be sent to main-endpoint
Content-Security-Policy: "script-src 'self'; object-src 'none'; report-to main-endpoint;"
Document-Policy: "document-write=?0;report-to=main-endpoint;"
// Deprecation reports don't need an explicit endpoint; these reports are always sent to the `default` endpoint
```

Something unforeseen happens, and these policies get violated for some of your users.

The browser generates the reports that capture these issues.

With a little bit of delay—up to a minute—the browser sends the reports to the endpoint that was configured for this violation type. The reports are sent **[out-of-band](https://en.wikipedia.org/wiki/Out-of-band_data)**—not by your site, but by the browser itself.

Example report:

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

The endpoint(s) receive(s) these reports.

You can access the reports on these endpoints, monitor what went wrong, and start troubleshooting to solve the problem that's affecting your users.

{% Aside %}
Note:

- In the legacy Reporting API (v0), reports were sent in batches. The new Reporting API works differently: the browser will only batch together reports in the same request if they are generated by the same document. Reports are not sent in the same request if they come from different origins, or even different documents on the same origin). Learn more in the [migration guide](/reporting-api-migration).
- Reports are sent with a delay to increase the chances that reports are sent in batches, to save bandwidth and be respectful to the user's network connection. This is especially important on mobile.
  {% endAside %}

## Report format

What the browser sends to the endpoint are requests that look as follows:

```http
Request Method: POST
Content-Type: application/reports+json
```

The payload of these requests is a list of reports. For example:

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

Here's the data you can find in each of these reports:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Field</th>
        <th>Explanation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>age</code></td>
        <td>The number of milliseconds between the report's timestamp and the current time.</td>
      </tr>
      <tr>
        <td><code>body</code></td>
        <td>The actual report data, serialized into a JSON string. The fields contained in a report's <code>body</code> are determined by the report's type.
        To check the exact format of each report type, check out the <a href="https://reports-endpoint.glitch.me">demo reporting endpoint<a>.</td>
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

<!-- ! For example, for a CSP violation:z

{
blockedURL: "https://site.example/script.js",
disposition: "enforce",
documentURL: "https://site.example/v1",
effectiveDirective: "script-src-elem",
originalPolicy: "script-src 'self'; object-src 'none'; report-to main-endpoint;",
referrer: "https://site.example/",
sample: "",
statusCode: 200
} -->

{% Aside %}
In the new Reporting API, reports are scoped to **documents**. This means that for one given origin, different documents (`site.example/page1` and `site.example/page2`) can send reports to different endpoints. If you're migrating from the legacy Reporting API to the new Reporting API, check the [migration guide](/reporting-api-migration).
{% endAside %}

## Browser support

{% Banner 'caution', 'body' %}
The table below sums up browser support for the **Reporting API v1**, that is with the `Reporting-Endpoints` header.
Browser support for the legacy Reporting API (`Report-To` header) is the same, except for one report type: Network Error Logging isn't supported in the new Reporting API. Check the [migration guide](/reporting-api-migration) for details.
{% endBanner %}

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
        <td>All other: COOP/COEP violation, Document Policy violation, Deprecation, Intervention, Crash</td>
        <td>✔ Yes</td>
        <td>✘ No</td>
        <td>✘ No</td>
        <td>✘ No</td>
        <td>✔ Yes</td>
      </tr>
    </tbody>

  </table>
</div>

{% Details %}

{% DetailsSummary 'h3' %}

About CSP reports

{% endDetailsSummary %}

There are two ways CSP reports can be configured:

- [Recommended once browser support for the Reporting API evolves] With the Reporting API via the `Reporting-Endpoints` header (or `Report-To` for the [legacy Reporting API](link to migration guide)). This is supported only by Chrome 69+ and Edge. Report requests have the same format as other Reporting API requests, and have, like them, the content-type "application/reports+json".
- With the CSP header alone via the `report-uri` directive. This has wide browser support, across Chrome, Firefox, Safari and Edge. Reports are sent with the content-type `application/csp-report` and have a unique format. These reports are called "CSP Level 2 Reports" and do _not_ rely on the Reporting API.

Using the Reporting API is convenient, because it means you're using only one way to set up reporting for all report types: CSP violations but also all other event types you want to monitor. Another upside of using the Reporting API over custom CSP reporting is that all report requests generated via the Reporting API have the [same format](link to above), so you can use a generic endpoint.
However, until there's wider browser support for the Reporting API (see [browser support]), switching your CSP reporting from `report-uri` to the Reporting API means that you'll lose CSP reports generated in Firefox and Safari.

{% endDetails %}

## How-to: Configure report sending

### Configure the Reporting-Endpoints header

- If you're migrating from the legacy Reporting API to the new Reporting API, it may make sense to configure both `Reporting-Endpoints` and `Report-To`. Head over to the [migration blogpost](/reporting-api-migration).
- When configuring `Reporting-Endpoints`, ensure you have an endpoint named `default` if you want to receive intervention, deprecation and crash reports.
  To define your endpoints, head over to [How-to: Receive reports](/#how-to:-receive-reports).

{% Aside 'gotchas' %}

- **Deprecation**, **intervention**, and **crash** reports are only sent to the endpoint named `default`. If the `Reporting-Endpoints` header defines no `default` endpoint, reports of this type won't ever be sent (although they will be generated).
- `default` is **not** a fallback endpoint. If you set up `report-to my-endpoint` e.g. for `Document-Policy` and omit to define `my-endpoint` in `Reporting-Endpoints`, `Document-Policy` violations reports of this type won't ever be sent (although they will be generated).
  {% endAside %}

### Configure the policies

**Deprecation**, **intervention\_ and **crash** reports are generated automatically and sent as long as you have a **default\*\* endpoint set up; there's no dedicated policy. These reports are sent to the default endpoint.

By contrast, the **other report types** are generated only if an **explicit policy** is set up. They'll be sent to the endpoint that's specified by the policy via the `report-to` keyword.

{% Banner 'caution', 'body' %}
Getting the syntax right for declaration can be tricky, because not all policies use the same header structure. Depending on the policy, it may look like `report-to=main-endpoint`, `report-to main-endpoint`, or report-to="main-endpoint".
Head over to the [demo](https://glitch.com/edit/#!/reporting-api-demo?path=server.js%3A1%3A0) for code examples.
{% endBanner %}

### Example code

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/reporting-api-demo?path=server.js&previewSize=0"
    title="reporting-api-demo on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## How-to: Receive reports

When deciding where to send your reports, you have two options:

- Use an existing report collector service
- Or build and operate your own reporting collector.

{% Banner 'info', 'body'%}
You can set multiple endpoints. This can be handy to separate reports:

- Maybe your analytics provider takes care of some kinds of reports, and you have an in-house solution for the others.
- Maybe you want to route these reports to different endpoints, depending on their type: `endpoint.example/coop` `endpoint.example/csp` `endpoint.example/default`

{% endBanner %}

### Option 1: Use an existing report collector service

Some examples of report collector services are [report-uri](https://report-uri.com) and [uriports](https://uriports.com).
If you know of other solutions, please [let us know](https://github.com/GoogleChrome/web.dev) and we'll update this post!

🧐 Things to consider when selecting a service for your endpoints:

- Does this collector support all report types? For example, some reporting endpoint solutions support COOP/COEP reports, but not all do.
- Does the pricing work for you?
- Is it OK to share your application's URLs with a third-party report collector? Even if the browser strips sensitive information from these URLs, it's possible that sensitive information [gets leaked this way](https://w3c.github.io/reporting/#capability-urls). If this sounds too risky for your application, operate your own reporting endpoint.

### Option 2: Build your own report collector

Building your own server that receives reports isn't that trivial. To get started, you can use our lightweight boilerplate. It's built with express and can receive and display reports.

- Head over to the [boilerplate report collector](https://glitch.com/edit/#!/reports-endpoint)
- Click **Remix to edit**
- You now have your clone ✨ You can customize it for your own purposes.

🧐 Things to consider when building your own report collector:

- If your endpoint URL lives on a different origin than your site, the endpoint should support [CORS preflight requests](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request).
- To recognize reports requests sent by the browser to your endpoint, check for `POST` requests with a `Content-Type` of `application/reports+json`.

Our boilerplate report collector linked above does both these things.

## How-to: Debug your reporting setup

### Generating reports

When debugging, you may want to intentionally violate your policies in order to trigger report sending. To see example code that violates policies and does other bad things that will trigger reports of all types, check out the [demo](#demo-and-code).

### Saving time

Reports may be sent with a delay, up to a minute, to preserve user experience.
But when debugging, a minute is a long time 😴. Luckily, when debugging in Chrome, you can launch it with `--short-reporting-delay` to receive reports almost immediately. Run this command in your terminal:

```bash
path/to/executable/Chrome --short-reporting-delay
```

On Mac, `path/to/executable/Chrome` looks like `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome`.

### Troubleshooting

In case reports don't show up as expected in your endpoint, something is wrong. Here are a few tips to troubleshoot this.

#### Is the report generated?

To answer this, use the console errors and the issues as an indirect debugging technique:

- If violation errors and issues are generated, you can be sure that the report is generated—but it doesn't mean it will be sent, for example if there's an issue with your `Reporting-Endpoints` setup. So, if you get a console error but no report, it means there's an issue with your `Reporting-Endpoints` setup. Check [](link to next section) for troubleshooting tips.
- If not, the issue may be in your policy configuration.

{% Aside %}
In Chrome DevTools, features are being developed to enable you to see the reports your page generated.
Once this is released, you'll be able to see reports within Chrome DevTools.
{% endAside %}

#### Is the report properly sent and received?

{% Aside 'gotchas' %}
Because the report is sent out-of-band by the browser itself and not by a certain site, **the `POST` requests with the reports are **not** visible in the Network panel of your Developer Tools.** Dedicated DevTools support is being implemented to surface these requests.
{% endAside %}

To answer this, try the following:

- Make sure to use [short delays](link to section above). Maybe the reason you can't see the report is because it hasn't been sent yet!
- Check your header configuration. If there's an issue with it, reports that have been generated correctly will not be sent. Common mistakes:

  - The report group is used but not configured. Example:
    ```http
    Cross-Origin-Embedder-Policy: "require-corp;report-to='coep-endpoint'"
    Reporting-Endpoints: default= "https://reports.example/default",
    ```
    COEP reports should be sent to coep-endpoint, but this endpoint name isn't configured in `Reporting-Endpoints`.
  - The default endpoint is missing; some reports like deprecation and others _need_ the endpoint named `default`.

- Look for issues in your policy configuration, such as missing quotes. [See details](link to above).
- Make sure that your endpoint is CORS-configured. One common mistake is when the endpoint doesn't support CORS preflight requests.
- Check if your endpoint itself can handle incoming requests. To do so, instead of generating reports manually, you can emulate the browser by sending to your endpoint requests that look like what the browser would send. Run the following:

```bash
curl --header "Content-Type: application/reports+json" \
  --request POST \
  --data '[{"age":420,"body":{"columnNumber":12,"disposition":"enforce","lineNumber":11,"message":"Document policy violation: document-write is not allowed in this document.","policyId":"document-write","sourceFile":"https://dummy.example/script.js"},"type":"document-policy-violation","url":"https://dummy.example/","user_agent":"xxx"},{"age":510,"body":{"blockedURL":"https://dummy.example/img.jpg","destination":"image","disposition":"enforce","type":"corp"},"type":"coep","url":"https://dummy.example/","user_agent":"xxx"}]' \
  YOUR_ENDPOINT
```

Your endpoint should answer with OK or similar, and should receive the reports. If not, there's an issue with the endpoint's configuration.

## Further reading

- [Specification: legacy Reporting API (v0)](https://www.w3.org/TR/reporting/)
- [Specification: new Reporting API (v1)](https://w3c.github.io/reporting/)
- [Migration guide](/reporting-api-migration)
- [ReportingObserver](/reporting-observer)
