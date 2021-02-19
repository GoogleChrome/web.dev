---
layout: post
title: Using the Chrome UX Report API
subhead: >
  Learn how to use the Chrome UX Report API to get easy, RESTful access to 
  real-user experience data across millions of websites.
authors:
  - rviscomi
  - exterkamp
hero: image/admin/TQ4U8BZanGFSfJI973xn.png
description: |
  Learn how to use the Chrome UX Report API to get easy, RESTful access to 
  real-user experience data across millions of websites.
date: 2020-06-25
tags:
  - blog
  - chrome-ux-report
  - web-vitals
  - performance
  - metrics
---

The [Chrome UX Report](https://developers.google.com/web/tools/chrome-user-experience-report) (CrUX) dataset represents how real-world Chrome users experience popular destinations on the web. Since 2017, when the queryable dataset was first released on [BigQuery](/chrome-ux-report-bigquery/), field data from CrUX has been integrated into developer tools like [PageSpeed Insights](/chrome-ux-report-pagespeed-insights/), the [CrUX Dashboard](/chrome-ux-report-data-studio-dashboard/), and Search Console's [Core Web Vitals report](https://support.google.com/webmasters/answer/9205520), enabling developers to easily measure and monitor real-user experiences. The piece that has been missing all this time has been a tool that provides free and RESTful access to CrUX data programmatically. To help bridge that gap, we're excited to announce the release of the all new [Chrome UX Report API](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference)!

This API has been built with the goal of providing developers with simple, fast, and comprehensive access to CrUX data. The CrUX API only reports [_field_](/how-to-measure-speed/#lab-data-vs-field-data) user experience data, unlike the existing [PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started), which also reports _lab_ data from the Lighthouse performance audits. The CrUX API is streamlined and can quickly serve user experience data, making it ideally suited for real-time auditing applications.

To ensure that developers have access to all of the metrics that matter the most—the [Core Web Vitals](/vitals/#core-web-vitals)—the CrUX API audits and monitors [Largest Contentful Paint](/lcp/) (LCP), [First Input Delay](/fid/) (FID), and [Cumulative Layout Shift](/cls/) (CLS) at both the origin and URL level.

So let's dive in and see how to use it!

## Querying origin data

Origins in the CrUX dataset encompass all underlying page-level experiences. The example below demonstrates how to query the CrUX API for an origin's user experience data using cURL on the command line.

```bash/0,3
API_KEY="[YOUR_API_KEY]"
curl "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=$API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{"origin": "https://web.dev"}'
```

Run this query interactively in the [CrUX API explorer](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference/rest/v1/records/queryRecord?apix=true&apix_params=%7B%22resource%22%3A%7B%22origin%22%3A%22https%3A%2F%2Fwww.google.com%22%7D%7D).

{% Aside %}
All API requests must provide a value for the `key` parameter—`[YOUR_API_KEY]` in the example above is left as a placeholder. Get your own private CrUX API key at the click of a button in the official [CrUX API documentation](https://goo.gle/crux-api-key). For convenience, the interactive [CrUX API explorer](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference/rest/v1/records/queryRecord?apix=true) does not require an API key.
{% endAside %}

The `curl` command is made up of three parts:

1. The URL endpoint of the API, including the caller's private API key.
2. The `Content-Type: application/json` header, indicating that the request body contains JSON.
3. The JSON-encoded [request body](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference/rest/v1/records/queryRecord#request-body), specifying the `https://web.dev` origin.

To do the same thing in JavaScript, use the <a name="crux-api-util">`CrUXApiUtil`</a> utility, which makes the API call and returns the decoded response.

```js/2
const CrUXApiUtil = {};
// Get your CrUX API key at https://goo.gle/crux-api-key.
CrUXApiUtil.API_KEY = '[YOUR_API_KEY]';
CrUXApiUtil.API_ENDPOINT = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${CrUXApiUtil.API_KEY}`;
CrUXApiUtil.query = function (requestBody) {
  if (CrUXApiUtil.API_KEY == '[YOUR_API_KEY]') {
    throw 'Replace "YOUR_API_KEY" with your private CrUX API key. Get a key at https://goo.gle/crux-api-key.';
  }
  return fetch(CrUXApiUtil.API_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(requestBody)
  }).then(response => response.json()).then(response => {
    if (response.error) {
      return Promise.reject(response);
    }
    return response;
  });
};
```

Replace `[YOUR_API_KEY]` with your [key](https://goo.gle/crux-api-key). Next, call the `CrUXApiUtil.query` function and pass in the [request body](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference/rest/v1/records/queryRecord#request-body) object.

```js/1
CrUXApiUtil.query({
  origin: 'https://web.dev'
}).then(response => {
  console.log(response);
}).catch(response => {
  console.error(response);
});
```

If data exists for this origin, the API response is a JSON-encoded object containing [metrics](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference/rest/v1/Metric) representing the distribution of user experiences. The distribution metrics are histogram bins and percentiles.

```json/11,24
{
  "record": {
    "key": {
      "origin": "https://web.dev"
    },
    "metrics": {
      "largest_contentful_paint": {
        "histogram": [
          {
            "start": 0,
            "end": 2500,
            "density": 0.7925068547983514
          },
          {
            "start": 2500,
            "end": 4000,
            "density": 0.1317422195536863
          },
          {
            "start": 4000,
            "density": 0.07575092564795324
          }
        ],
        "percentiles": {
          "p75": 2216
        }
      },
      // ...
    }
  }
}
```

The `start` and `end` properties of the `histogram` object represent the range of values users experience for the given metric. The `density` property represents the proportion of user experiences within that range. In this example, 79% of LCP user experiences across all web.dev pages are under 2,500 milliseconds, which is the "[good](/lcp/#what-is-lcp)" LCP threshold. The `percentiles.p75` value means that 75% of user experiences in this distribution are less than 2,216 milliseconds. Learn more about the response structure in the [response body](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference/rest/v1/records/queryRecord#response-body) documentation.

### Errors

When the CrUX API doesn't have any data for a given origin, it responds with a JSON-encoded error message:

```json
{
  "error": {
    "code": 404,
    "message": "chrome ux report data not found",
    "status": "NOT_FOUND"
  }
}
```

To debug this error, first check that the requested origin is publicly navigable. You can test this by entering the origin into your browser's URL bar and comparing it against the final URL after any redirects. Common problems include unnecessarily adding or omitting the subdomain and using the wrong HTTP protocol.

{% Compare 'worse', 'Error' %}
```json
{"origin": "http://www.web.dev"}
```
{% CompareCaption %}
This origin incorrectly includes the `http://` protocol and `www.` subdomain.
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better', 'Success' %}
```json
{"origin": "https://web.dev"}
```
{% CompareCaption %}
This origin is publicly navigable.
{% endCompareCaption %}
{% endCompare %}

If the requested origin _is_ the navigable version, this error may also occur if the origin has an insufficient number of samples. All origins and URLs included in the dataset must have a sufficient number of samples to anonymize individual users. Additionally, origins and URLs must be [publicly crawlable](https://developers.google.com/search/reference/robots_txt). Refer to the [CrUX methodology](https://developers.google.com/web/tools/chrome-user-experience-report#methodology) to learn more about how websites are included in the dataset.

## Querying URL data

You've seen how to query the CrUX API for the overall user experience on an origin. To restrict the results to a particular page, use the `url` request parameter.

```bash/0,3
API_KEY="[YOUR_API_KEY]"
curl "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=$API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{"url": "https://web.dev/fast/"}'
```

This cURL command is similar to the origin example, except that the request body uses the `url` parameter to specify the page to look up.

To query URL data from the CrUX API in JavaScript, call the [`CrUXApiUtil.query`](#crux-api-util) function using the `url` parameter in the request body.

```js/1
CrUXApiUtil.query({
  url: 'https://web.dev/fast/'
}).then(response => {
  console.log(response);
}).catch(response => {
  console.error(response);
});
```

If data for this URL exists in the CrUX dataset, the API will return a JSON-encoded response like the one below.

```json/11,24
{
  "record": {
    "key": {
      "url": "https://web.dev/fast/"
    },
    "metrics": {
      "largest_contentful_paint": {
        "histogram": [
          {
            "start": 0,
            "end": 2500,
            "density": 0.8477304539092148
          },
          {
            "start": 2500,
            "end": 4000,
            "density": 0.08988202359528057
          },
          {
            "start": 4000,
            "density": 0.062387522495501155
          }
        ],
        "percentiles": {
          "p75": 1947
        }
      },
      // ...
    }
  }
}
```

True to form, the results show that `https://web.dev/fast/` has 85% "good" LCP experiences and a 75th percentile of 1,947 milliseconds, which is slightly better than the origin-wide distribution.

### URL normalization

The CrUX API may normalize requested URLs to better match the list of known URLs. For example, querying for the URL `https://web.dev/fast/#measure-performance-in-the-field` will result in data for `https://web.dev/fast/` due to normalization. When this happens, a `urlNormalizationDetails` object will be included in the response.

```json/8-9
{
  "record": {
    "key": {
      "url": "https://web.dev/fast/"
    },
    "metrics": { ... }
  },
  "urlNormalizationDetails": {
    "normalizedUrl": "https://web.dev/fast/",
    "originalUrl": "https://web.dev/fast/#measure-performance-in-the-field"
  }
}
```

Learn more about [URL normalization](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference/rest/v1/records/queryRecord#urlnormalization) in the CrUX documentation.

## Querying by form factor

{% Aside 'key-term' %}
A form factor is the type of device on which a user visits a website. Common device types include desktop, phone, and tablet.
{% endAside%}

User experiences can vary significantly depending on website optimizations, network conditions, and users' devices. To better understand these differences, drill down into origin and URL performance using the [`formFactor`](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference/rest/v1/records/queryRecord#formfactor) dimension of the CrUX API.

The API supports three explicit form factor values: `DESKTOP`, `PHONE`, and `TABLET`. In addition to the origin or URL, specify one of these values in the [request body](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference/rest/v1/records/queryRecord#request-body) to restrict results to only those user experiences. The example below demonstrates how to query the API by form factor using cURL.

```bash/0,3
API_KEY="[YOUR_API_KEY]"
curl "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=$API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{"url": "https://web.dev/fast/", "formFactor": "PHONE"}'
```

To query the CrUX API for form factor-specific data using JavaScript, call the [`CrUXApiUtil.query`](#crux-api-util) function using the `url` and `formFactor` parameters in the request body.

```js/1-2
CrUXApiUtil.query({
  url: 'https://web.dev/fast/',
  formFactor: 'PHONE'
}).then(response => {
  console.log(response);
}).catch(response => {
  console.error(response);
});
```

Omitting the `formFactor` parameter is equivalent to requesting data for all form factors combined.

```json/11,24
{
  "record": {
    "key": {
      "url": "https://web.dev/fast/",
      "formFactor": "PHONE"
    },
    "metrics": {
      "largest_contentful_paint": {
        "histogram": [
          {
            "start": 0,
            "end": 2500,
            "density": 0.778631284916204
          },
          {
            "start": 2500,
            "end": 4000,
            "density": 0.13943202979515887
          },
          {
            "start": 4000,
            "density": 0.08193668528864119
          }
        ],
        "percentiles": {
          "p75": 2366
        }
      },
    // ...
    }
  }
}
```

The `key` field of the response will echo back the `formFactor` request configuration to confirm that only phone experiences are included.

{% Aside 'caution' %}
The more fine-grained the request is, for example a specific combination of URL and form factor, the fewer user experiences it will include. This may lead to more frequent "not found" errors, especially when querying less popular URLs or the less popular tablet device type.
{% endAside %}

Recall from the previous section that 85% of user experiences on this page had "good" LCP. Compare that to phone-specific experiences, of which only 78% are considered "good". The 75th percentile is also slower among phone experiences, up from 1,947 milliseconds to 2,366 milliseconds. Segmenting by form factor has the potential to highlight more extreme disparities in user experiences.

## Assessing Core Web Vitals performance

The [Core Web Vitals](/vitals/#core-web-vitals) program defines targets that help determine whether a user experience or a distribution of experiences can be considered "good". In the following example, we use the CrUX API and the [`CrUXApiUtil.query`](#crux-api-util) function to assess whether a web page's distribution of Core Web Vitals metrics (LCP, FID, CLS) are "good".

```js/1
CrUXApiUtil.query({
  url: 'https://web.dev/fast/'
}).then(response => {
  assessCoreWebVitals(response);
}).catch(response => {
  console.error(response);
});

function assessCoreWebVitals(response) {
  // See https://web.dev/vitals/#core-web-vitals.
  const CORE_WEB_VITALS = [
    'largest_contentful_paint',
    'first_input_delay',
    'cumulative_layout_shift'
  ];
  CORE_WEB_VITALS.forEach(metric => {
    const data = response.record.metrics[metric];
    if (!data) {
      console.log('No data for', metric);
      return;
    }
    const p75 = data.percentiles.p75;
    const threshold = data.histogram[0].end;
    // A Core Web Vitals metric passes the assessment if
    // its 75th percentile is under the "good" threshold.
    const passes = p75 < threshold;
    console.log(`The 75th percentile (${p75}) of ${metric} ` +
        `${passes ? 'passes' : 'does not pass'} ` +
        `the Core Web Vitals "good" threshold (${threshold}).`)
  });
}
```

{% Aside 'gotchas' %}
The API may only be called with one origin or URL at a time. To assess multiple websites or pages, make separate calls to the API.
{% endAside %}

The results show that this page passes the Core Web Vitals assessments for all three metrics.

```text
The 75th percentile (1973) of largest_contentful_paint passes the Core Web Vitals "good" threshold (2500).
The 75th percentile (20) of first_input_delay passes the Core Web Vitals "good" threshold (100).
The 75th percentile (0.05) of cumulative_layout_shift passes the Core Web Vitals "good" threshold (0.10).
```

Combined with an automated way to monitor API results, data from CrUX can be used to ensure that real-user experiences **get fast** and **stay fast**. For more information about Core Web Vitals and how to measure them, check out [Web Vitals](/vitals) and [Tools to measure Core Web Vitals](/vitals-tools).

## What's next?

The features included in the initial version of the CrUX API only scratch the surface of the kinds of insights that are possible with CrUX. Users of the [CrUX dataset on BigQuery](/chrome-ux-report-bigquery/) may be familiar with some of the more advanced features including:

- Additional metrics
  - `first_paint`
  - `dom_content_loaded`
  - `onload`
  - `time_to_first_byte`
  - `notification_permissions`
- Additional dimensions
  - month
  - country
  - effective connection type (ECT)
- Additional granularity
  - detailed histograms
  - more percentiles

Over time, we hope to integrate more of these features with the CrUX API's ease of use and free pricing to enable new ways of exploring the data and discovering insights about the state of user experiences on the web.

Check out the official [CrUX API docs](https://developers.google.com/web/tools/chrome-user-experience-report/api/reference) to [acquire your API key](https://goo.gle/crux-api-key) and explore more example applications. We hope you'll give it a try and we'd love to hear any questions or feedback you may have, so please reach out to us on the [CrUX discussion forum](https://groups.google.com/a/chromium.org/forum/#!forum/chrome-ux-report). And to stay up to date on everything we have planned for the CrUX API, subscribe to the [CrUX announcement forum](https://groups.google.com/a/chromium.org/forum/#!forum/chrome-ux-report-announce) or follow us on Twitter at [@ChromeUXReport](https://twitter.com/ChromeUXReport).
