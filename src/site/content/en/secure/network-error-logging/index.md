---
layout: post
title: Network Error Logging (NEL)
authors:
  - ericbidelman
  - maudn
date: 2022-01-31
description: Use Network Error Logging (NEL) to collect client-side network errors.
tags:
  - monitoring
  - security
---

## Introduction {: #intro }

Network Error Logging (NEL) is a mechanism for
collecting **client-side network errors** from an origin.

It uses the `NEL` HTTP response header to tell the browser to collect network errors, then integrates with the Reporting API to report the errors to a server.

{% Aside 'caution' %}
To set up Network Error Logging for your site, you will need to use the **legacy** Reporting API that relies on the `Report-To` header.

This is because the new Reporting API, that relies on the `Reporting-Endpoints` header, does **not** support Network Error Logging. Learn more in [Browser support](/reporting-api/#browser-support).

Instead, a new mechanism for Network Error Logging will be developed in the future. Once that becomes available, switch from the legacy Reporting API to that new mechanism.
{% endAside %}

## Overview of the legacy Reporting API

### The legacy `Report-To` Header {: #header }

To use the legacy Reporting API, you'll need to set a `Report-To` HTTP response header. Its
value is an object which describes an endpoint group for the browser
to report errors to:

```http
Report-To:
{
    "max_age": 10886400,
    "endpoints": [{
    "url": "https://analytics.provider.com/browser-errors"
    }]
}
```

If your endpoint URL lives on a different origin than your site, the
endpoint should support CORS preflight requests. (e.g. `Access-Control-Allow-Origin: *; Access-Control-Allow-Methods: GET,PUT,POST,DELETE,OPTIONS; Access-Control-Allow-Headers: Content-Type, Authorization, Content-Length, X-Requested-With`).

In the example, sending this response header with your main page
configures the browser to report browser-generated warnings
to the endpoint `https://analytics.provider.com/browser-errors` for `max_age` seconds.
It's important to note that all subsequent HTTP requests made by the page
(for images, scripts, etc.) are ignored. Configuration is setup during
the response of the main page.

### Explanation of header fields {: #fields }

Each endpoint configuration contains a `group` name, `max_age`, and `endpoints`
array. You can also choose whether to consider subdomains when reporting
errors by using the `include_subdomains` field.

| Field                | Type             | Description                                                                                                                                                                                     |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `group`              | string           | Optional. If a `group` name is not specified, the endpoint is given a name of "default".                                                                                                        |
| `max_age`            | number           | **Required**. A non-negative integer that defines the lifetime of the endpoint in seconds. A value of "0" will cause the endpoint group to be removed from the user agent’s reporting cache.    |
| `endpoints`          | Array&lt;Object> | **Required**. An array of JSON objects that specify the actual URL of your report collector.                                                                                                    |
| `include_subdomains` | boolean          | Optional. A boolean that enables the endpoint group for all subdomains of the current origin's host. If omitted or anything other than "true", the subdomains are not reported to the endpoint. |

The `group` name is a unique name used to associate a string with
an endpoint. Use this name in other places that integrate
with the Reporting API to refer to a specific endpoint group.

The `max-age` field is also required and specifies how
long the browser should use the endpoint and report errors to it.

The `endpoints` field is an array to provide failover and load balancing
features. See the section on [Failover and load balancing](#load). It's
important to note that the **browser will select only one endpoint**, even
if the group lists several collectors in `endpoints`. If you want to send a
report to several servers at once, your backend will need to forward the
reports.

### How does the browser send reports? {: #send-how }

The browser periodically batches reports and sends them to the reporting
endpoints that you configure.

To send reports, the browser issues a `POST`
request with
`Content-Type: application/reports+json` and a body containing the array of
warnings/errors which were captured.

### When does the browser send reports? {: #send-when }

**Reports are delivered out-of-band from your app**, meaning the browser
controls when reports are sent to your server(s).

The browser attempts to
deliver queued reports at the most opportune time. This may be as soon as they're ready (in order to provide
timely feedback to the developer) but the browser can also delay delivery if it's
busy processing higher priority work, or if the user is on a slow and/or
congested network at the time.
The browser may also prioritize sending
reports about a particular origin first, if the user is a frequent visitor.

There's little to no performance concern
(e.g. network contention with your app) when using the Reporting API. There's
also no way to control when the browser sends queued reports.

### Configuring multiple endpoints {: #multi }

A single response can configure several endpoints at once by sending
multiple `Report-To` headers:

```http
Report-To: {
             "group": "default",
             "max_age": 10886400,
             "endpoints": [{
               "url": "https://example.com/browser-reports"
             }]
           }
Report-To: {
             "group": "network-errors-endpoint",
             "max_age": 10886400,
             "endpoints": [{
               "url": "https://example.com/network-errors"
             }]
           }
```

or by combining them into a single HTTP header:

```http
Report-To: {
             "group": "network-errors-endpoint",
             "max_age": 10886400,
             "endpoints": [{
               "url": "https://example.com/network-errors"
             }]
           },
           {
             "max_age": 10886400,
             "endpoints": [{
               "url": "https://example.com/browser-errors"
             }]
           }
```

Once you've sent the `Report-To` header, the browser caches the endpoints
according to their `max_age` values, and sends all of those nasty console
warnings/errors to your URLs.

### Failover and load balancing {: #load }

Most of the time you'll be configuring one URL collector per group. However,
since reporting can generate a good deal of traffic, the spec includes failover
and load-balancing features inspired by the DNS
[SRV record](https://tools.ietf.org/html/rfc2782#).

The browser will do its best to deliver a report to **at most one** endpoint
in a group. Endpoints can be assigned a `weight` to distribute load, with each
endpoint receiving a specified fraction of reporting traffic. Endpoints can
also be assigned a `priority` to set up fallback collectors.

Fallback collectors are only tried when uploads to primary collectors fail.

**Example**: Create a fallback collector at `https://backup.com/reports`:

```http
Report-To: {
             "group": "endpoint-1",
             "max_age": 10886400,
             "endpoints": [
               {"url": "https://example.com/reports", "priority": 1},
               {"url": "https://backup.com/reports", "priority": 2}
             ]
           }
```

## Setting up Network Error Logging {: #setup-nel }

### Setup {: #setup }

To use NEL, set up the `Report-To` header with a
collector that uses a named group:

```http
Report-To: {
    ...
  }, {
    "group": "network-errors",
    "max_age": 2592000,
    "endpoints": [{
      "url": "https://analytics.provider.com/networkerrors"
    }]
  }
```

Next, send the `NEL` response header to start collecting errors. Since NEL
is opt-in for an origin, you only need to send the header once. Both `NEL` and
`Report-To` will apply to future requests to the same origin and will continue
to collect errors according to the `max_age` value that was used to set up
the collector.

The header value should be a JSON object that contains a `max_age` and
`report_to` field. Use the latter to reference the group name of your
network errors collector:

```http
GET /index.html HTTP/1.1
NEL: {"report_to": "network-errors", "max_age": 2592000}
```

{% Aside 'caution' %}
The `Report-To` header uses a hyphen. Here, `report_to` uses an underscore.
{% endAside %}

### Subresources {: #sub }

{% Aside 'important' %}
NEL works across navigations and subresources fetches.
But for subresources, the containing page has no visibility
into the NEL reports about cross-origin requests that it makes.
{% endAside %}

**Example**: If `example.com` loads `foobar.com/cat.gif` and that resource fails
to load:

- `foobar.com`'s NEL collector is notified
- `example.com`'s NEL collector is **not** notified

The
rule of thumb is that NEL reproduces server-side logs, just generated on
the client.

Since `example.com` has no visibility into `foobar.com`'s server
logs, it also has no visibility into its NEL reports.

### Debugging report configurations {: #debug }

If you don't see reports showing up on your server, head over to
`chrome://net-export/`. That page is useful for
verifying things are configured correctly and reports are being sent
out properly.

### What about ReportingObserver? {: #reporting-observer }

[`ReportingObserver`](/reporting-observer) is a related, but different reporting mechanism. It's based on JavaScript calls.
**It's not suited for network error logging**, as network errors
can't be intercepted via JavaScript.

## Example server {: #example }

Below is an example Node server that uses Express. It shows how to configure reporting for network errors, and creates a dedicated handler to capture the result.

```js
const express = require('express');

const app = express();
app.use(
  express.json({
    type: ['application/json', 'application/reports+json'],
  }),
);
app.use(express.urlencoded());

app.get('/', (request, response) => {
  // Note: report_to and not report-to for NEL.
  response.set('NEL', `{"report_to": "network-errors", "max_age": 2592000}`);

  // The Report-To header tells the browser where to send network errors.
  // The default group (first example below) captures interventions and
  // deprecation reports. Other groups, like the network-error group, are referenced by their "group" name.
  response.set(
    'Report-To',
    `{
    "max_age": 2592000,
    "endpoints": [{
      "url": "https://reporting-observer-api-demo.glitch.me/reports"
    }],
  }, {
    "group": "network-errors",
    "max_age": 2592000,
    "endpoints": [{
      "url": "https://reporting-observer-api-demo.glitch.me/network-reports"
    }]
  }`,
  );

  response.sendFile('./index.html');
});

function echoReports(request, response) {
  // Record report in server logs or otherwise process results.
  for (const report of request.body) {
    console.log(report.body);
  }
  response.send(request.body);
}

app.post('/network-reports', (request, response) => {
  console.log(`${request.body.length} Network error reports:`);
  echoReports(request, response);
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
```

## Further reading

- [Monitor your web application with the Reporting API](/reporting-api) (main post on the Reporting API)
- [Migration guide from Reporting API v0 to v1](/reporting-api-migration)
- [Specification: legacy Reporting API (v0)](https://www.w3.org/TR/reporting/)
- [Specification: new Reporting API (v1)](https://w3c.github.io/reporting/)
