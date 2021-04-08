---
layout: post
title: Serve static assets with an efficient cache policy
description: |
  Learn how caching your web page's static resources can improve performance
  and reliability for repeat visitors.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - uses-long-cache-ttl
---

HTTP caching can speed up your page load time on repeat visits.

When a browser requests a resource,
the server providing the resource can tell the browser
how long it should temporarily store or *cache* the resource.
For any subsequent request for that resource,
the browser uses its local copy rather than getting it from the network.

## How the Lighthouse cache policy audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags all static resources that aren't cached:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vtRp9i6zzD8EDlHYkHtQ.png", alt="A screenshot of the Lighthouse Serve static assets with an efficient cache policy audit", width="800", height="490", class="w-screenshot" %}
</figure>

Lighthouse considers a resource cacheable
if all the following conditions are met:

- The resource is a font, image, media file, script, or stylesheet.
- The resource has a `200`, `203`, or `206` [HTTP status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).
- The resource doesn't have an explicit no-cache policy.

When a page fails the audit,
Lighthouse lists the results in a table with three columns:

<div class="w-table-wrapper">
  <table>
    <tbody>
      <tr>
        <td><strong>URL</strong></td>
        <td>The location of the cacheable resource</td>
      </tr>
      <tr>
        <td><strong>Cache TTL</strong></td>
        <td>The current cache duration of the resource</td>
      </tr>
      <tr>
        <td><strong>Size</strong></td>
        <td>An estimate of the data your users would save if the flagged resource had been cached</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## How to cache static resources using HTTP caching

Configure your server to return the `Cache-Control` HTTP response header:

```js
Cache-Control: max-age=31536000
```

The `max-age` directive tells the browser how long it should cache the resource in seconds.
This example sets the duration to `31536000`, which corresponds to 1 year:
60&nbsp;seconds × 60&nbsp;minutes × 24&nbsp;hours × 365&nbsp;days = 31536000&nbsp;seconds.

When possible, cache immutable static assets for a long time,
such as a year or longer.

{% Aside %}
One risk of long cache durations is that your users won't see updates to static files.
You can avoid this issue by configuring your build tool
to embed a hash in your static asset filenames so that each version is unique,
prompting the browser to fetch the new version from the server.
(To learn how to embed hashes using webpack, see webpack's
[Caching](https://webpack.js.org/guides/caching/) guide.)
{% endAside %}

Use `no-cache` if the resource changes and freshness matters,
but you still want to get some of the speed benefits of caching.
The browser still caches a resource that's set to `no-cache`
but checks with the server first to make sure that the resource is still current.

A longer cache duration isn't always better.
Ultimately,
it's up to you to decide what the optimal cache duration is for your resources.

There are many directives for customizing how the browser caches different resources.
Learn more about caching resources in
[The HTTP cache: your first line of defense guide](/http-cache)
and [Configuring HTTP caching behavior codelab](/codelab-http-cache).

## How to verify cached responses in Chrome DevTools

To see which resources the browser is getting from its cache,
open the **Network** tab in Chrome DevTools:

{% Instruction 'devtools-network', 'ol' %}

The **Size** column in Chrome DevTools can help you verify that a resource has been cached:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dc7QffBFDTcTHyUNNevi.png", alt="The Size column.", width="800", height="565", class="w-screenshot w-screenshot--filled" %}
</figure>

Chrome serves the most requested resources from the memory cache, which is very fast,
but is cleared when the browser is closed.

To verify a resource's `Cache-Control` header is set as expected,
check its HTTP header data:

1. Click the URL of the request, under the **Name** column of the Requests table.
1. Click the **Headers** tab.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dGDjkwsoUBwFVLYM0sVy.png", alt="Inspecting the Cache-Control header via the Headers tab", width="800", height="597", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    Inspecting the <code>Cache-Control</code> header via the <b>Headers</b> tab.
  </figcaption>
</figure>

## Stack-specific guidance

### Drupal

Set the **Browser and proxy cache maximum age** in the **Administration** >
**Configuration** > **Development** page. See [Drupal performance
resources](https://www.drupal.org/docs/7/managing-site-performance-and-scalability/caching-to-improve-performance/caching-overview#s-drupal-performance-resources).

### Joomla

See [Cache](https://docs.joomla.org/Cache).

### WordPress

See [Browser Caching](https://wordpress.org/support/article/optimization/#browser-caching).

## Resources

- [Source code for **Serve static assets with an efficient cache policy** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-long-cache-ttl.js)
- [Cache-Control specification](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9)
- [Cache-Control (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
