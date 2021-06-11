---
layout: post
title: Migrate to the Reporting API v1
subhead: |
  A new version of the Reporting API is available. It's simpler, more private, and more likely to be supported across browsers.
authors:
  - maudn
date: 2021-06-14
updated: 2021-06-14
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

{% Banner 'caution', 'body' %} This post covers how to migrate to the new version of the
Reporting API (v1). If you're new to the Reporting API or need detailed usage examples,
head over to the [main post on the Reporting API](/reporting-api) instead. {% endBanner %}

The Reporting API informs you about errors that happen across your site as visitors use
it. It gives you visibility on browser interventions, browser crashes,
Content-Security-Policy violations, COOP/COEP violations, deprecation warnings and more.

**A new version of the Reporting API is available. It's simpler, more private, and more
likely to be supported across browsers.**

{% Aside %} The legacy Reporting API is named _Reporting API v0_. The new Reporting API is
named _Reporting API v1_. {% endAside %}

## Summary

{% Banner 'info', 'body' %}

If you already have reporting functionality for your site, **migrate to v1** but keep
using v0 simultaneously for some time. Make sure to set the `Reporting-Endpoint` header on
**all responses** that might generate reports.

If you're adding reporting functionality to your site just now, use only v1, except if you
need **Network Error Logging**.

If you're maintaining an endpoint service or are operating your own, expect **more
traffic** as you or external developers migrate to v1.

{% endBanner %}

Keep reading for details and example code!

## Demo and code

- [Demo site: new reporting API (v1)](https://reporting-api-demo.glitch.me)
- [Code](https://glitch.com/edit/#!/reporting-api-demo) for the demo site

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
  v1 uses the `Reporting-Endpoints` header to configure **named
  endpoints**.
  {% endCompareCaption %}
  {% endCompare %}

- The scope of the report is different.

  {% Compare 'worse', 'v0 (legacy)' %}

  With v0, you can set reporting endpoints on some responses only. Other documents (pages)
  on that origin would automatically use these ambient endpoints.

  {% endCompare %}

  {% Compare 'better', 'v1 (new)' %}

  With v1, you need to set the `Reporting-Endpoints` header on all responses that might
  generate reports. {% endCompare %}

- Both APIs support the same report types, with one exception: v1 does not support
  **Network Error reports**. Read more in the [migration steps](#migration-steps).
- v0 is not and will not be supported across browsers. v1 is more likely to be supported
  across multiple browsers in the future.

### What remains unchanged

- The format and structure of the reports is unchanged.
- The request sent by the browser to the endpoint remains a POST request of "Content-type"
  `application/reports+json`.
- Mapping certain endpoints to certain report types is supported in both v0 and v1.
- The formatting of the rules that generate reports when violated is unchanged.
- The role of the default endpoint is unchanged.
- The Reporting API v1 has no impact on the [ReportingObserver](/reporting-observer).
  ReportingObserver continues getting access to all observable reports, and their format is
  identical.

{% Details %} {% DetailsSummary 'h3' %}

All differences between v0 and v1

{% endDetailsSummary %}

<div class="w-table-wrapper">
  <table class="w-table--top-align">
    <thead>
      <tr>
        <th></th>
        <th>Legacy Reporting API (v0)<br/>
        <code>Report-To</code> header</th>
        <th>New Reporting API (v1)<br/>
        <code>Reporting-Endpoints</code> header</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Browser support</td>
        <td>Chrome 69+ and Edge 69+.</td>
        <td>Chrome 93+ and Edge 93+. Firefox is supportive. Safari doesn't object. See <a href="https://chromestatus.com/feature/5712172409683968">browser signals</a>.</td>
      </tr>
      <tr>
        <td>Endpoints</td>
        <td>Sends reports to any of <strong>multiple</strong> report collectors (multiple URLs defined per endpoint group).</td>
        <td>Sends reports to <strong>specific</strong> report collectors (only one URL defined per endpoint).</td>
      </tr>
      <tr>
        <td>API surface</td>
        <td>Uses the <code>`Report-To`</code> header to configure named <strong>endpoint groups</strong>.</td>
        <td>Uses the <code>`Reporting-Endpoints`</code> header to configure named <strong>endpoints</strong>.</td>
      </tr>
      <tr>
        <td>Types of report that can be generated via this API</td>
        <td>
          <ul>
            <li>Deprecation</li>
            <li>Intervention</li>
            <li>Crash</li>
            <li>COOP/COEP</li>
            <li>Content-Security-Policy Level 3 (CSP Level 3)</li>
            <li>Network Error Logging (NEL)</li>
          </ul>
          <sub>Learn more about the report types in the <a href="/reporting-api">Reporting API post</a>.</sub>
        </td>
        <td>Unchanged, except from <strong>Network Error Logging (NEL) that is not supported</strong>.</td>
      </tr>
      <tr>
        <td>Report scope</td>
        <td>Origin.<br/> A document's <code>Report-To</code> header affects other documents (pages) from that origin. 
        The <code>url</code> field of a report still varies per-document.
        </td>
        <td>Document.<br/> A document's <code>Reporting-Endpoints</code> header only affects that document. 
        The <code>url</code> field of a report still varies per-document.
      </tr>
      <tr>
        <td>Report isolation (batching)</td>
        <td>Different documents (pages) or sites/origins that generate a report around the same time and that have the same reporting endpoint will be batched together: they'll be sent in the same message to the reporting endpoint.</td>
        <td>
          <ul>
            <li>Reports from <strong>different</strong> documents (pages) are never sent together. Even if two documents (pages) from the same origin generate a report at the same time, for the same endpoint, these won't be batched. This is a mechanism to mitigate privacy attacks.</li>
            <li>Reports from the <strong>same</strong> document (page) may be sent together.</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>Support for load balancing / priorities</td>
        <td>Yes ✔</td>
        <td>No  ✘
        </td>
      </tr>
    </tbody>
  </table>
</div>

{% endDetails %}

## Endpoint developers: Expect more traffic

If you've set up your own server as a reporting endpoint, or if you're developing or
maintaining a report collector as a service, expect more traffic to that endpoint.

Reports aren't batched with the Reporting API v1 as they are with the Reporting API v0.
Therefore, as application developers start migrating to the Reporting API v1, the **number
of reports** will remain similar, but the **volume of requests** to the endpoint server
will increase.

## Application developers: Migrate to `Reporting-Endpoints` (v1)

### What should you do?

✅ Using the new Reporting API (v1) has several benefits:

- Browser signals are [positive](https://chromestatus.com/feature/5712172409683968), which
  means that cross-browser support can be expected for v1 (unlike v0 that is only
  supported in Chrome and Edge).
- The API surface is simpler.
- Tooling is being developed around the new Reporting API (v1).

With this in mind:

- If your site already uses the Reporting API v0 with the `Report-To` header, migrate to
  the Reporting API v1 (see the [migration steps](#migration-steps)). If your site already
  uses reporting functionality for Content-Security-Policy violations, check the specific [migration
  steps for CSP reporting](#migration-steps-for-csp-reporting).
- If your site doesn't use the Reporting API yet and you're adding reporting functionality
  to your site now: use only the new Reporting API (v1) i.e. the `Reporting-Endpoints`
  header. You can skip this migration guide. **There's one exception to this**: if you
  need Network Error Logging, use `Report-To` (v0) because Network Error Logging isn't
  supported in the Reporting API v1. A new mechanism for Network Error Logging will be
  developed⏤until that's available, the Reporting API v0 should be used. If you need
  Network Error Logging **alongside** other report types, use **both** `Report-To` (v0)
  and `Reporting-Endpoints` (v1). v0 gives you Network Error Logging and v1 gives you
  reports of all other types.

### Migration steps

Your goal in this migration is to **not lose reports** you used to get with v0.

{% Aside %} Because only Chrome and Edge support the Reporting API v0, you don't need to
focus on other browsers during your migration to v1. However, keep in mind that broader
browser support may be coming. There are no tracking bugs for
these browsers at the moment but this may change. {% endAside
%}

1. **Step 1 (do now)**: Use both headers: `Report-To` (v0) and `Reporting-Endpoints` (v1).

   With this, you get:

   - Reports from newer Chrome and Edge clients thanks to `Reporting-Endpoints` (v1).
   - Reports from older Chrome and Edge clients thanks
     to `Report-To` (v0).

   Browser instances that support `Reporting-Endpoints` will use
   `Reporting-Endpoints`, and instances that don't will fallback to `Report-To`.
   The
   request and report format is the same for v0 and v1.

2. **Step 2 (do now):** Ensure that the `Reporting-Endpoints` header is set on all
   responses that might generate reports.

   With v0, you could set reporting endpoints on some responses only, and other documents
   (pages) on that origin would use this "ambient" endpoint. With v1, because of the
   difference in scoping, you need to set the `Reporting-Endpoints` header on all
   responses that might generate reports.

3. **Step 3 (start later):** Once all or most of your users have updated to later Chrome
   or Edge installs (93 and later), remove **Report-To** (v0) and keep only
   `Reporting-Endpoints`.

   One exception: if you do need Network Error Logging reports, keep **Report-To** until a
   new mechanim is in place for Network Error Logging.

### Migration steps for CSP reporting

There are two ways CSP violation reports can be configured:

- With the CSP header alone via the `report-uri` directive. This has wide browser support, across Chrome, Firefox, Safari and Edge. Reports are sent with the content-type `application/csp-report` and have a format that's specific to CSP. These reports are called "CSP Level 2 Reports" and do **not** rely on the Reporting API.
- With the Reporting API, that is via `Report-To` header (v0, legacy) or the `Reporting-Endpoints` (v1). This is supported only by Chrome and Edge. Report requests have the same format as other Reporting API requests, and the same content-type "application/reports+json".

✅ Using the Reporting API has benefits over custom CSP reporting:

- You're using a single way to set up reporting for all report types.
- All report requests generated via the Reporting API have the same format, so you can use a generic endpoint.
- Tooling is being developed around the Reporting API (for v1).

However, because of the state of browser support, it's recommended that you keep `report-uri` alongside the newer `report-to` and `Reportig-Endpoints` in order to get CSP violation reports from multiple browsers.

1. **Step 1 (do now)**: If you haven't added it yet, add `report-to` alongside `report-uri`.
   Browsers that support only `report-uri` (Firefox) will use `report-uri`, and browsers
   that also support `report-to`(Chrome, Edge) will use `report-to`.

2. **Step 2 (do now)**: To specify the named endpoints you'll use in `report-to`, use both
   headers `Report-To` and `Reporting-Endpoints`. This ensures that you get reports from
   both older and newer Chrome and Edge clients.

3. **Step 3 (start later):** Once all or most of your users have updated to later Chrome
   or Edge installs (93 and later), remove **Report-To** (v0) and keep only
   `Reporting-Endpoints`. Keep `report-uri` so you still get reports for browsers that
   only support it.

### Migration Cookbook

#### Basic migration

{% Compare 'worse', 'v0 (legacy)' %}

```http
Report-To: { group: "main-endpoint", "endpoints": [ { "url": "https://reports.example/main" }] }, { group: "default-endpoint", "endpoints": [ { "url": "https://reports.example/default" }] }
```

{% endCompare %}

{% Compare 'better', 'v1 (new) alongisde v0 (legacy)' %}

```http
Reporting-Endpoints: main-endpoint="https://reports.example/main", default="https://reports.example/default"
Report-To: { group: "main-endpoint", "max_age": 86400, "endpoints": [ { "url": "https://reports.example/main" }] }, { group: "default-endpoint", "max_age": 86400, "endpoints": [ { "url": "https://reports.example/default" }] }
```

{% CompareCaption %}

Note that with v1, you can still send specific report types to specific endpoints, but you
can have only one URL per endpoint.
Keep `Report-To` _temporarily_ to avoid losing reports, if you
already have reporting functionality in your site. Keep `Report-To` _until Network Error
Logging has a new replacement_, if you need Network Error Logging.

{% endCompareCaption %}

{% endCompare %}

#### Observing all pages

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

{% CompareCaption %} With v0, you can set reporting endpoints on some responses only.
Other documents (pages) on that origin automatically use these ambient endpoints. Here,
the endpoints set for `"/"` are used for all responses, for example for `page1`. {%
endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'New code (with v1), for example with express' %}

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

{% CompareCaption %} With v1, you need to set the `Reporting-Endpoints` header on all
responses that might generate reports. {% endCompareCaption %}

{% endCompare %}

## Further reading

- [Specification: legacy Reporting API (v0)](https://www.w3.org/TR/reporting/)
- [Specification: new Reporting API (v1)](https://w3c.github.io/reporting/)

_Hero image by [Nine Koepfer / @enka80](https://unsplash.com/@enka80) on
[Unsplash](https://unsplash.com/photos/tJC6I9S3nBw), edited._ _With many thanks to Ian
Clevelland, Eiji Kitamura and Milica Mihajlija for their reviews and suggestions on this
article._
