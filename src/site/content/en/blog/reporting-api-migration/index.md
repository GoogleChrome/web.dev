---
layout: post
title: Migrate to the Reporting API v1
subhead: |
  A new version of the Reporting API is available. It's simpler, more private, and more likely to be supported across browsers.
authors:
  - maudn
date: 2021-06-08
updated: 2021-06-08
description: |
  Migrate to the new version of the Reporting API.
hero: image/O2RNUyVSLubjvENAT3e7JSdqSOx1/PYEe5UP3bVYzPMXdQc0X.jpg
alt: |
  A person and their refection on wet sand, symbolizing the migration from the legacy to the new Reporting API.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - monitoring
  - security
---

{% Banner 'caution', 'body' %}
This post covers how to migrate to the new version of the Reporting API (v1). If you're new to the Reporting API or need detailed usage examples, head over to the [main post on the Reporting API](/reporting-api) instead.
{% endBanner %}

The Reporting API informs you about errors that happen across your site as visitors use it. It gives you visibility on browser interventions, browser crashes, Content-Security-Policy violations, COOP/COEP violations, deprecation warnings and more.

**A new version of the Reporting API is available. It's simpler, more private, and more likely to be supported across browsers.**

{% Aside %}
The legacy Reporting API is named _Reporting API v0_.
The new Reporting API is named _Reporting API v1_.
{% endAside %}

## Summary

{% Banner 'info', 'body' %}

- If you already have reporting functionality in your site, migrate to v1 but keep using v0 simultaneously for some time. Make sure to set the `Reporting-Endpoint` header on **all responses** that might generate reports.
- If you're adding reporting functionality to your site just now, use only v1, except if you need Network Error Logging.
- If you're maintaining an endpoint service or are operating your own, expect more traffic with as you or external developers migrate to v1.
- Check out the new API in action on this [demo site](https://reporting-api-demo.glitch.me), and the [resulting reports](https://reports-endpoint.glitch.me/).

{% endBanner %}

Keep reading for details and example code!

## Demo

- [Demo site: new reporting API (v1)](https://reporting-api-demo.glitch.me)
- [Code](https://glitch.com/edit/#!/reporting-api-demo)

## Differences between v0 and v1

### What's changing

- The API surface is different.

  {% Compare 'worse', 'v0 (legacy)' %}

  ```http
  Report-To: { group: "main-endpoint", "max_age": 86400, "endpoints": [ { "url": ... }, { "url": ... }] }, { group: "default-endpoint", "max_age": 86400, "endpoints": [ { "url": ... }, { "url": ... }] }
  ```

  {% CompareCaption %}
  v0 uses the `Report-To` header to configure **named endpoint groups**.
  {% endCompareCaption %}

  {% endCompare %}

  {% Compare 'better', 'v1 (new)' %}

  ```http
  Reporting-Endpoints: main-endpoint="https://reports.example/main", default="https://reports.example/default"
  ```

  {% CompareCaption %}
  v1 uses the `Reporting-Endpoints` header to configure **named endpoints**.
  {% endCompareCaption %}
  {% endCompare %}

- The scope of the report is different.

  {% Compare 'worse', 'v0 (legacy)' %}

  With v0, you can set reporting endpoints on some responses only. Other documents on that origin would automatically use these ambient endpoints.

  {% endCompare %}

  {% Compare 'better', 'v1 (new)' %}

  With v1, you need to set the `Reporting-Endpoints` header on all responses that might generate reports.
  {% endCompare %}

- Both APIs support the same report types, with one exception: v1 does not support **Network Error reports**. Read more in the [migration steps](/#migration-steps-if-you-already-have-reporting-functionality-with-v0).
- v0 is not and will not be supported across browsers. v1 is likely to be supported across multiple browsers in the future.

### What remains unchanged

- The format and structure of the reports is unchanged.
- The request sent by the browser to the endpoint remains a POST request of "Content-type" `application/reports+json`.
- Mapping certain endpoints to certain report types is supported in both v0 and v1.
- The formatting of the rules that generate reports when violated is unchanged.
- The role of the default endpoint is unchanged.
- The ReportingObserver API is unchanged. It still gets access to all observable reports, and their format is identical.

{% Details %}
{% DetailsSummary 'h3' %}

All differences between v0 and v1

{% endDetailsSummary %}

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Legacy Reporting API (v0), `Report-To` header</th>
        <th>New Reporting API (v1), `Reporting-Endpoints` headers</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Browser support</td>
        <td>Chrome 69+ and Edge only.</td>
        <td>Chrome 93+ and Edge. Firefox is supportive. Safari doesn't object. See <a href="https://chromestatus.com/feature/5712172409683968">browser signals</a>.</td>
      </tr>
      <tr>
        <td>Endpoints</td>
        <td>Sends reports to any of <strong>multiple</strong> report collectors (multiple URLs defined per endpoint group).</td>
        <td>Sends reports to <strong>specific</strong> report collectors (only one URL defined per endpoint).</td>
      </tr>
      <tr>
        <td>API surface</td>
        <td>Uses the <code>`Report-To`</code> header to configure named<strong>endpoint groups</strong>.</td>
        <td>Uses the <code>`Reporting-Endpoints`</code> header to configure named<strong>endpoints</strong>.</td>
      </tr>
      <tr>
        <td>Types of report that can be generated via this API</td>
        <td>Deprecation, Intervention, Crash, COOP/COEP, Permissions Policy, Document Policy, Content-Security-Policy Level 3 (CSP Level 3), Network Error Logging (NEL).</td>
        <td>Unchanged, except from <strong>Network Error Logging (NEL) that is not supported</strong>.</td>
      </tr>
      <tr>
        <td>Report scope</td>
        <td>Origin. A document's <code>Report-To</code> header affects other documents from that origin.The <code>url</code> field of a report still varies per-document.
        </td>
        <td>Document. A document's <code>Reporting-Endpoints</code> header only affects that document. The <code>url<c/ode> field of a report still varies per-document.
      </tr>
      <tr>
        <td>Report isolation (batching)</td>
        <td>Different documents (sites) that generate a report around the same time and that have the same reporting endpoint will be batched together, and sent in the same message to the reporting endpoint.</td>
        <td>Reports from different documents are never sent together. Reports from the same document may be sent together. Even if two documents from the same origin generate a report at the same time, for the same endpoint, these won't be batched, as a mechanism to mitigate privacy attacks.
        </td>
      </tr>
      <tr>
        <td>Support for load balancing / priorities</td>
        <td>Yes ✔</td>
        <td>No 	✘
        </td>
      </tr>
    </tbody>
  </table>
</div>

{% endDetails %}

## Application developers: Migrate to `Reporting-Endpoints` (v1)

{% Banner 'info', 'body' %}
Using the new Reporting API (v1) has several benefits:

- Browser signals are [positive](https://chromestatus.com/feature/5712172409683968), which means that cross-browser support can be expected for v1 (unlike v0 that is only supported in Chrome and Edge).
- The API surface is simpler.
- Tooling is being developed around the new Reporting API (v1).
  {% endBanner %}

Note: only Chrome and Edge support the API v0, and this won't change.

### Migration steps if you already have reporting functionality with v0

If you already have reporting functionality, your goal in this migration is to not lose reports you used to get with v0.

1. **Step 1 (do now)**: Use both headers: `Report-To` (v0) and `Reporting-Endpoints` (v1).

   With this, you get reports for newer Chrome and Edge clients (93+) thanks to `Reporting-Endpoints` (v1). You get reports from older Chrome and Edge clients (up to 91) thanks to `Report-To` (v0). Browser instances that support `Reporting-Endpoints` will use `Reporting-Endpoints`, and instances that don't will fallback to `Report-To`.
   The request and report format is the same for v0 and v1.

2. **Step 2 (do now):** Set the `Reporting-Endpoints` header on all responses that might generate reports.

   With v0, you could set reporting endpoints on some responses only, and other documents on that origin would use this "ambient" endpoint.
   With v1, because of the difference in scoping, you'll need to set the `Reporting-Endpoints` header on all responses that might generate reports.

3. **Step 3 (start later):** Once all or most of your users have updated to later Chrome installs (93 and later), adapt your headers.

   - If you don't need Network Error Logging reports, remove **Report-To** (v0).
   - If you do need Network Error Logging reports, keep **Report-To** during this transition phase, in order to get reports from older Chrome clients.

### If you're adding reporting functionality for the first time

If you're adding reporting functionality to your codebase now, use only the new `Reporting-Endpoints` header (v1).

**There’s one exception to this**: if you need Network Error Logging, use `Report-To` (v0) because Network Error Logging isn't supported in the Reporting API v1. A new mechanism for Network Error Logging will be developed⏤until that's available, the Reporting API v0 should be used.
If you need Network Error Logging **alongside** other report types, use **both** `Report-To` (v0) and `Reporting-Endpoints` (v1). v0 gives you Network Error Logging and v1 gives you reports of all other types.

See an example in the [cookbook](/#migration-cookbook).

## Endpoint developers: Expect more traffic

This section is relevant if you've set up your own server as a reporting endpoint, or you're developing or maintaining a report collector as a service.

Reports aren't batched with the Reporting API v1 as they are with the Reporting API v0.
Therefore, as application developers start migrating to the Reporting API v1, the **number of reports** will remain similar, but the **volume of requests** to the endpoint server will increase.

## What about ReportingObserver?

The Reporting API v1 has no impact on the ReportingObserver API.
The ReportingObserver API continues getting access to all observable reports, and their format is identical.

## Migration cookbook

### Basic migration

{% Compare 'worse', 'v0 (legacy)' %}

```http
Report-To: { group: "main-endpoint", "max_age": 86400, "endpoints": [ { "url": "https://reports.example/main" }] }, { group: "default-endpoint", "max_age": 86400, "endpoints": [ { "url": "https://reports.example/default" }] }
```

{% endCompare %}

{% Compare 'better', 'v1 (new)' %}

```http
Reporting-Endpoints: main-endpoint="https://reports.example/main", default="https://reports.example/default"
# Optional: keep `Report-To`
Report-To: { group: "main-endpoint", "max_age": 86400, "endpoints": [ { "url": "https://reports.example/main" }] }, { group: "default-endpoint", "max_age": 86400, "endpoints": [ { "url": "https://reports.example/default" }] }
```

{% CompareCaption %}
Keep `Report-To` _temporarily_ to avoid losing reports, if you already have reporting functionality in your site.
Keep `Report-To` _until Network Error Logging has a new replacement_, if you need Network Error Logging.

Note that with v1, you can still send specific report types to specific endpoints, but you can have only one URL per endpoint.
{% endCompareCaption %}

{% endCompare %}

### Observing all pages

{% Compare 'worse', 'Legacy code (with v0), for example with express' %}

```javascript
app.get("/", (request, response) => {
  response.set("Report-To", …)
  response.render(...)
});
app.get("/page1", (request, response) => {
  response.render(...)
});
```

{% CompareCaption %}
With v0, you can set reporting endpoints on some responses only. Other documents on that origin automatically use these ambient endpoints. Here, the endpoints set for `"/"` are used for all responses, for example for `page1`.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Legacy code (with v1), for example with express' %}

```javascript
// Use a middleware to set the reporting endpoint(s) for *all* requests.
app.use(function(request, response, next) {
  response.set("Reporting-Endpoints", …);
  next();
});

app.get("/", (request, response) => {
  response.render(...)
});

app.get("/page1", (request, response) => {
  response.render(...)
});
```

{% CompareCaption %}
With v1, you need to set the `Reporting-Endpoints` header on all responses that might generate reports.
{% endCompareCaption %}

{% endCompare %}

## Further reading

- [Specification: legacy Reporting API (v0)](https://www.w3.org/TR/reporting/)
- [Specification: new Reporting API (v1)](https://w3c.github.io/reporting/)
