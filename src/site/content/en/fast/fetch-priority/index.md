---
layout: post
title: Optimizing resource loading with the Fetch Priority API
authors:
  - leenasohoni
  - addyosmani
  - patmeenan
  - tunetheweb
description: The Fetch Priority API indicates the relative priority of resources to the browser. It can enable optimal loading and improve Core Web Vitals.
subhead: The Fetch Priority API indicates the relative priority of resources to the browser. It can enable optimal loading and improve Core Web Vitals.
date: 2021-10-20
updated: 2023-04-18
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/WqBkrvs5LRwPIfrSOQyz.jpg
alt: A photo of a brown wooden plank fence, with a signboard attached to it. The signboard reads 'this way', with an arrow pointing to the right.
tags:
  - performance
  - network
  - blog
---

{% BrowserCompat 'api.HTMLImageElement.fetchPriority' %}

{% Aside %}
This feature was originally called Priority Hints but was renamed to Fetch Priority after standardization. See [History](#history) below for more details.
{% endAside %}

When a browser parses a web page and begins to discover and download resources such as images, scripts, or CSS, it assigns them a fetch `priority` in an attempt to download resources in an optimal order. These priorities can depend on the kind of resource and where it is in the document. For example, in-viewport images may have a `High` priority while the priority for early loaded, render-blocking CSS via `<link>`s in the `<head>` could be `Very High`. Browsers are pretty good at assigning priorities that work well but may not be optimal in all cases.

In this article, we'll discuss the Fetch Priority API and the `fetchpriority` HTML attribute, which allow you to hint at the relative priority of a resource (`high` or `low`). Fetch Priority can help optimize the Core Web Vitals.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/UQ60oFwWrVCPbFYx3pJY.png", alt="A filmstrip view comparing two tests of the Google Flights homepage. At bottom, Fetch Priority are used to boost the priority of the hero image, resulting in a 0.7 second decrease in LCP.
", width="800", height="400" %}
  <figcaption>Fetch Priority improving Largest Contentful Paint from 2.6&nbsp;s to 1.9&nbsp;s in a test of Google Flights</figcaption>
</figure>

## Summary

**A few key areas where Fetch Priority can help:**

- Boost the priority of the LCP image by specifying `fetchpriority="high"` on the image element, causing LCP to happen sooner.
- Increase the priority of `async` scripts using better semantics than the current hack that is commonly used (inserting a <code>&lt;link rel="preload"&gt;</code> for the `async` script).
- Decrease the priority of late-body scripts to allow for better sequencing with images.

Historically, developers have had some, but limited, influence over resource priority using [preload](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preload/) and [preconnect](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preconnect/). Fetch Priority complements these [Resource Hints](https://www.w3.org/TR/resource-hints/), but it's essential to understand where they all fit in. Preload lets you tell the browser about critical resources you want to load early before they are discovered naturally. This is especially useful for resources that are not easily discovered, such as fonts included in stylesheets, background images, or resources loaded from a script. Preconnect helps warm up connections to cross-origin servers and can help improve metrics like [Time-to-first-byte](/ttfb/) and is useful when you know an origin but not necessarily the exact URL of a resource that will be needed.

Fetch Priority is a markup-based signal (available through the `fetchpriority` attribute) that developers can use to indicate the relative priority of a particular resource. You can also use these hints via JavaScript and the [Fetch API](/introduction-to-fetch/) with the `priority` property to influence the priority of resource fetches made for data. Fetch Priority can also complement preload. Take a Largest Contentful Paint image, which, when preloaded, will still get a low priority. If it is pushed back by other early low-priority resources, using Fetch Priority can help how soon the image gets loaded.

Fetch Priority is [available](https://www.chromestatus.com/feature/5273474901737472) in Chrome 101 or later.

## Resource priority

The resource download sequence depends on the browser's assigned priority for every resource on the page. Different factors can affect priority computation logic. For example,

- CSS, fonts, scripts, images, and third-party resources are assigned different priorities.
- The location or order in which you reference resources in the document also affects the priority of resources.
- The [`preload`](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preload/) resource hint helps the browser to discover a resource faster and thus load it before the document loads it and affects priority.
- Priority computation changes for [`async` or `defer`](/efficiently-load-third-party-javascript/#use-async-or-defer) scripts.

The following table considers such factors to show how most resources are currently prioritized and sequenced in Chrome.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>Layout-blocking</th>
        <th>Load in layout-blocking phase</th>
        <th colspan="3">Load one-at-a-time in layout-blocking phase</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Blink<br>Priority</strong></td>
        <td><strong>VeryHigh</strong></td>
        <td><strong>High</strong></td>
        <td><strong>Medium</strong></td>
        <td><strong>Low</strong></td>
        <td><strong>VeryLow</strong></td>
      </tr>
      <tr>
        <td><strong>DevTools<br>Priority</strong></td>
        <td><strong>Highest</strong></td>
        <td><strong>High</strong></td>
        <td><strong>Medium</strong></td>
        <td><strong>Low</strong></td>
        <td><strong>Lowest</strong></td>
      </tr>
      <tr>
        <td></td>
        <td>Main resource</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td>CSS*** (early**)</td>
        <td></td>
        <td>CSS*** (late**)</td>
        <td></td>
        <td>CSS (mismatch)</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>Script (early** or not from preload scanner)</td>
        <td>Script (**late)</td>
        <td>Script (async)</td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td>Font</td>
        <td>Font (preload)</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>Import</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>Image (in viewport)</td>
        <td></td>
        <td>Image</td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>Media</td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>SVG document</td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>Prefetch</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>Preload*</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>XSL</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td>XHR (sync)</td>
        <td>XHR/fetch* (async)</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}
\* Preload using `"as"` or fetch using `"type"` use the priority of the type they are requesting (e.g., preload `as="stylesheet"` will use Highest priority). With no `"as"`, they will behave like an XHR.<br>
\*\* "Early" is defined as being requested before any non-preloaded images have been requested ("late" is after).<br>
\*\*\* CSS where the media type doesn't match is not fetched by the preload scanner and is only processed when the main parser reaches it, which usually means it will be fetched very late and with a "late" priority.
{% endAside %}

The browser downloads resources with the same computed priority in the order they are discovered. You can check the priority assigned to different resources when loading a page under the Chrome Dev Tools **Network** tab. (Ensure that you include the priority column by right-clicking on the table headings).

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Lwm9jwJF5sQ3gQ7PHSs1.png", alt="A screenshot of assets listed in the network tab of Chrome's DevTools. The columns read, from left to right: name, status, type, initiator, size, time, and priority.", width="800", height="263" %}
  <figcaption>Priority for resource <code>type = &quot;font&quot;</code> on BBC news detail page</figcaption>
</figure>


<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/K5U3maOt2TFBbtScW7TY.png", alt="A screenshot of assets listed in the network tab of Chrome's DevTools. The columns read, from left to right: name, status, type, initiator, size, time, and priority.", width="800", height="175" %}
  <figcaption>Priority for resource type = &quot;script&quot; on BBC news detail page</figcaption>
</figure>

## When would you need Fetch Priority?

Knowledge of the browser's prioritization logic provides you with a few existing knobs to tweak the order of downloads. You can

1.  Place resource tags such as `<script>` and `<link>` depending on the order you want to download them. Resources with the same priority are generally loaded in the order they are discovered.
2.  [Use the `preload` resource hint](/preload-critical-assets/) to download necessary resources earlier, particularly for resources that are not easily discovered early by the browser.
3.  Use [`async` or `defer`](/efficiently-load-third-party-javascript/#use-async-or-defer) to download scripts without blocking other resources.
4.  Lazy-load below-the-fold content so that the browser can use the available bandwidth for more critical above-the-fold resources.

These techniques help to control the browser's priority computation, thereby improving performance and [Core Web Vitals](/vitals/). For example, when a critical background image is preloaded, it can be discovered much earlier, improving the Largest Contentful Paint ([LCP](/lcp/)).

Sometimes these handles may not be enough to prioritize resources optimally for your application. Here are some of the scenarios where Fetch Priority could be helpful:

1. You have several above-the-fold images, but all of them need not have the same priority. For example, in an image carousel, only the first visible image needs a higher priority compared to the others.
2. Hero images inside the viewport start at a "Low" priority. After the layout is complete, Chrome discovers they are in the viewport and boosts their priority (unfortunately, dev tools only shows the final priority—WebPageTest will show both). This usually adds a significant delay to loading the image. Providing the Fetch Priority in markup lets the image start at a "High" priority and start loading much earlier.<br><br>Note that preload is still required for the early discovery of LCP images included as CSS backgrounds and can be combined with Fetch Priority by including the `fetchpriority='high'` on the preload, otherwise it will still start with the default "Low" priority for images.
3. Declaring scripts as `async` or `defer` tells the browser to load them asynchronously. However, as seen in the figure above, these scripts are also assigned a "low" priority. You may want to bump up their priority while ensuring asynchronous download, particularly for any scripts that are critical for the user experience.
4. You may use the JavaScript [`fetch()`](/introduction-to-fetch/) API to fetch resources or data asynchronously. Fetch is assigned a "High" priority by the browser. There may be situations where you do not want all your fetches to be executed with "High" priority and prefer using different Fetch Priority instead. This can be helpful when running background API calls and mixing them with API calls that are responding to user input, like with autocomplete. The background API calls can be tagged as "Low" priority and the interactive API calls marked as "High" priority.
5. The browser assigns CSS and fonts a "High" priority, but all such resources may not be equally important or required for LCP. You can use Fetch Priority to lower the priority of some of these resources.

## The `fetchpriority` attribute

You can provide a Fetch Priority using the `fetchpriority` HTML attribute. You can use the attribute with `link`, `img`, and `script` tags. The attribute allows you to specify the priority for resource types such as CSS, fonts, scripts, and images when downloaded using the supported tags.
The `fetchpriority` attribute accepts one of three values:

- `high`: You consider the resource a high priority and want the browser to prioritize it as long as the browser's heuristics don't prevent that from happening.
- `low`: You consider the resource a low priority and want the browser to deprioritize it if it's heuristics permit.
- `auto`: This is the default value where you don't have a preference and let the browser decide the appropriate priority.

Here are a few examples of using the `fetchpriority` attribute in markup and the script-equivalent `priority` property.

```html
<!-- We don't want a high priority for this above-the-fold image -->
<img src="/images/in_viewport_but_not_important.svg" fetchpriority="low" alt="I'm an unimportant image!">

<!-- We want to initiate an early fetch for a resource, but also deprioritize it -->
<link rel="preload" href="/js/script.js" as="script" fetchpriority="low">

<script>
  fetch('https://example.com/', {priority: 'low'})
  .then(data => {
    // Trigger a low priority fetch
  });
</script>
```

### Browser priority and `fetchpriority`

You can apply the `fetchpriority` attribute to different resources as shown in the following figure to potentially increase or reduce their computed priority. `fetchpriority="auto"` (◉) in each row denotes the default priority for that type of resource.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>Layout-blocking</th>
        <th>Load in layout-blocking phase</th>
        <th colspan="3">Load one-at-a-time in layout-blocking phase</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Blink<br>Priority</strong></td>
        <td><strong>VeryHigh</strong></td>
        <td><strong>High</strong></td>
        <td><strong>Medium</strong></td>
        <td><strong>Low</strong></td>
        <td><strong>VeryLow</strong></td>
      </tr>
      <tr>
        <td><strong>DevTools<br>Priority</strong></td>
        <td><strong>Highest</strong></td>
        <td><strong>High</strong></td>
        <td><strong>Medium</strong></td>
        <td><strong>Low</strong></td>
        <td><strong>Lowest</strong></td>
      </tr>
      <tr>
        <td>Main Resource</td>
        <td>◉</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>CSS*** (early**)</td>
        <td>⬆◉</td>
        <td>⬇</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>CSS*** (late**)</td>
        <td></td>
        <td>⬆</td>
        <td>◉</td>
        <td>⬇</td>
        <td></td>
      </tr>
      <tr>
        <td>Script (early** or not from preload scanner)</td>
        <td></td>
        <td>⬆◉</td>
        <td></td>
        <td>⬇</td>
        <td></td>
      </tr>
      <tr>
        <td>Script*** (late**)</td>
        <td></td>
        <td>⬆</td>
        <td>◉</td>
        <td>⬇</td>
        <td></td>
      </tr>
      <tr>
        <td>Script (async/defer)</td>
        <td></td>
        <td>⬆</td>
        <td></td>
        <td>◉⬇</td>
        <td></td>
      </tr>
      <tr>
        <td>Font</td>
        <td>◉</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Font (preload)</td>
        <td></td>
        <td>⬆◉</td>
        <td></td>
        <td>⬇</td>
        <td></td>
      </tr>
      <tr>
        <td>Import</td>
        <td></td>
        <td>◉</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Image (in viewport)</td>
        <td></td>
        <td>⬆◉</td>
        <td></td>
        <td>⬇</td>
        <td></td>
      </tr>
      <tr>
        <td>Image</td>
        <td></td>
        <td>⬆</td>
        <td></td>
        <td>◉⬇</td>
        <td></td>
      </tr>
      <tr>
        <td>Media (video/audio)</td>
        <td></td>
        <td>⬆</td>
        <td></td>
        <td>◉⬇</td>
        <td></td>
      </tr>
      <tr>
        <td>SVG document</td>
        <td></td>
        <td>⬆</td>
        <td></td>
        <td>◉⬇</td>
        <td></td>
      </tr>
      <tr>
        <td>XHR (sync) - deprecated</td>
        <td>◉</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>XHR/fetch* (async)</td>
        <td></td>
        <td>⬆◉</td>
        <td></td>
        <td>⬇</td>
        <td></td>
      </tr>
      <tr>
        <td>Preload*</td>
        <td></td>
        <td>⬆◉</td>
        <td></td>
        <td>⬇</td>
        <td></td>
      </tr>
      <tr>
        <td>Prefetch</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>◉</td>
      </tr>
      <tr>
        <td>Favicon</td>
        <td></td>
        <td></td>
        <td>◉</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>XSL</td>
        <td></td>
        <td>◉</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}
\* Preload using `"as"` or fetch using `"type"` use the priority of the type they are requesting (e.g., preload `as="stylesheet"` will use Highest priority). With no `"as"`, they will behave like an XHR.<br>
\*\* "Early" is defined as being requested before any non-preloaded images have been requested ("late" is after).<br>
\*\*\* CSS where the media type doesn't match is not fetched by the preload scanner and is only processed when the main parser reaches it, which usually means it will be fetched very late and with a "late" priority.<br>
◉: `fetchpriority="auto"`<br>
⬆: `fetchpriority="high"`<br>
⬇: `fetchpriority="low"`<br>
Images within the viewport start at "Low" priority and then at layout time are boosted to "High". By tagging it in markup using `fetchpriority="high"`, it can start at "High" immediately and load much faster.
{% endAside %}

Note that `fetchpriority` sets the _relative priority_—that is it raises or lowers the default priority by an appropriate amount, rather than explicitly setting the priority to "High" or "Low" and the browser decides the relative priority. Often this is "High" or "Low", but not always. For example, critical CSS with `fetchpriority="high"` will still retain the "VeryHigh"/"Highest" priority, and using `fetchpriority="low"` on these will still retain the "High" priority—in neither case is the Priority explicitly set to "High" or "Low".

### Use cases

You can use the `fetchpriority` attribute to address scenarios where you may wish to provide the browser with an extra hint as to what priority to fetch a resource with.

#### Increase the priority of the LCP image

You can specify `fetchpriority="high"` to boost the priority of the LCP or other critical images.

```html
<img src="lcp-image.jpg" fetchpriority="high">
```

The following comparison shows the Google Flights page with an LCP background image loaded with and without Fetch Priority. With the priority set to high, the [LCP improved from 2.6s to 1.9s](https://www.webpagetest.org/video/compare.php?tests=211006_AiDcG3_40871b05d6040112a05be4524565cf5d%2C211006_BiDcHR_bebed947f1b6607f2d97e8a899fdc36b&thumbSize=200&ival=100&end=visual).

<figure>
  {% Video src="video/1L2RBhCLSnXjCnSlevaDjy3vba73/BCngJfoVOy0YbUz8wFrM.mp4", autoplay=true, muted=true, playsinline=true, loop=true, controls=true %}
  <figcaption>An experiment conducted using Cloudflare workers to rewrite the Google Flights page to use Fetch Priority.</figcaption>
</figure>

#### Lower the priority of above-the-fold images

You can use `fetchpriority="low"` to lower the priority of above-the-fold images that may not be important for example in an image carousel.

```html
<ul class="carousel">
  <img src="img/carousel-1.jpg" fetchpriority="high">
  <img src="img/carousel-2.jpg" fetchpriority="low">
  <img src="img/carousel-3.jpg" fetchpriority="low">
  <img src="img/carousel-4.jpg" fetchpriority="low">
</ul>
```

In an earlier experiment with the [Oodle](https://github.com/google/oodle-demo) app, we used this to lower the priority of images that do not appear on load. It helped to cut down the load time by 2 seconds.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Tn4OkGpqPbrSQtd1j3GV.png", alt="A side-by-side comparison of Fetch Priority when used on the Oodle app's image carousel. On the left, the browser sets default priorities for carousel images, but downloads and paints those images around two seconds slower than the example on the right, which sets a higher priority on only the first carousel image.", width="800", height="460" %}
</figure>

#### Lower the priority of preloaded resources

To stop preloaded resources from competing with other critical resources, you could provide a hint to reduce their priority. You can use this technique with images, scripts, and CSS.

```html
<!-- Lower priority only for non-critical preloaded scripts -->
<link rel="preload" as="script" href="critical-script.js">
<link rel="preload" href="/js/script.js" as="script" fetchpriority="low">

<!-- Preload CSS without blocking other resources -->
<link rel="preload" as="style" href="theme.css" fetchpriority="low" onload="this.rel='stylesheet'">
```

#### Reprioritize scripts

Scripts required to make some parts of the page interactive are essential but should not block other resources. You can mark these as async with high priority.

```html
<script src="async_but_important.js" async fetchpriority="high"></script>
```

Scripts cannot be marked as async if they rely on specific DOM states. However if they are lower down on the page, they may be downloaded with a lower priority as shown.

```html
<script src="blocking_but_unimportant.js" fetchpriority="low"></script>
```

#### Lower the priority for non-critical data fetches

The browser executes `fetch` with a high priority. If you have multiple fetches that may be fired simultaneously, you can use the high default priority for the more critical data fetches and lower it for less critical data.

```javascript
// Important validation data (high by default)
let authenticate = await fetch('/user');

// Less important content data (suggested low)
let suggestedContent = await fetch('/content/suggested', {priority: 'low'});
```

## Fetch Priority implementation notes

Fetch Priority can improve performance in specific use cases, as discussed above. There are some things to be aware of:

- The `fetchpriority` attribute is a hint and not a directive. The browser will try to respect the developer's preference. It is also possible that the browser will apply its preferences for resource priority as deemed necessary in case of conflicts.
- Fetch Priority should not be confused with a preload. They are both distinct because:
    - Preload is a mandatory fetch and not a hint.
    - Preload allows the browser to discover the resource early, but it will still fetch it with the default priority. Conversely, Fetch Priority does not aid discoverability, but does allow you to increase or decrease the fetch priority.
    - It is easier to observe and measure the effects of a preload.

  Fetch Priority can complement preloads by increasing the granularity of prioritization. If you had already specified a preload as one of the first items in the `<head>` for an LCP image, then a `high` Fetch Priority may not result in significant gains. However, if the preload was after other resources, then a `high` Fetch Priority can improve the LCP. If a critical image is a CSS background image, you should preload it with `fetchpriority = "high"`.
- The noticeable gains due to prioritization will be more relevant in environments where more resources contend for the available network bandwidth. This is common for HTTP/1.x connections where parallel downloads are not possible or in low bandwidth HTTP/2 connections. Prioritization can resolve bottlenecks in these conditions.
- CDNs do [not uniformly implement HTTP/2 prioritization](https://github.com/andydavies/http2-prioritization-issues#cdns--cloud-hosting-services). Even if the browser communicates the priority suggested using Fetch Priority; the CDN may not reprioritize resources in the required order. This makes testing of Fetch Priority difficult. The priorities are applied both internally within the browser and with protocols that support prioritization (HTTP/2 and HTTP/3). It is still worth using even for just the internal browser prioritization independent of CDN or origin support, as that will often change when resources are requested by the browser—for example low priority resources like images are often held back from being requested while the browser processes the critical `<head>` items.
- It may not be possible to introduce Fetch Priority as a best practice in your initial design. It is an optimization that you can apply later in the development cycle. You can check the priorities being assigned to different resources on the page, and if they do not match your expectations, you could introduce Fetch Priority for further optimization.

### Using Preload after Chrome 95

The Fetch Priority feature was available for trial in Chrome 73 to 76 but was not released due to prioritization issues with preloads fixed in Chrome 95. Prior to Chrome 95, requests issued via `<link rel=preload>` always start before other requests seen by the preload scanner, even if the other requests have a higher priority.

With the fix in Chrome 95 and the enhancement for Fetch Priority, we hope that developers will start using preload for its [intended purpose](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/#loading-of-late-discovered-resources)—to preload resources not detected by the parser (fonts, imports, background LCP images). The placement of the `preload` hint will affect when the resource is preloaded. Some key points on using preload are:

- Including the preload in HTTP headers will cause it to jump ahead of everything else.
- Generally, preloads will load in the order the parser gets to them for anything above &quot;Medium&quot; priority—so be careful if you are including preloads at the beginning of the HTML.
- Font preloads will probably work best towards the end of the head or beginning of the body.
- Import preloads (dynamic `import()` or `modulepreload`) should be done after the script tag that needs the import (so the actual script gets loaded/parsed first). Basically, if the script tag loads a script that will trigger the load of dependencies, make sure the `<link rel=preload>` for the dependencies is after the parent script tag, otherwise the dependencies may end up loading before the main script. In the proper order, the main script can be parsed/eval'd while the dependencies are loading.
- Image preloads will have a "Low" priority (without Fetch Priority) and should be ordered relative to async scripts and other low or lowest priority tags.

## History

Fetch Priority was first experimented with in Chrome as an origin trial in 2018 and then again in 2021 using the `importance` attribute. At that time it was known as [Priority Hints](https://github.com/WICG/priority-hints). The interface has since changed to `fetchpriority` for HTML and `priority` for JavaScript's Fetch API as part of the web standards process. To reduce confusion we now refer to this API as Fetch Priority.

## Browser compatibility

{% BrowserCompat 'api.HTMLImageElement.fetchPriority' %}

As of this writing, Fetch Priority is only available in Chromium-based browsers. Other browser engines or earlier versions of Chromium browsers will ignore the attribute and use their default prioritization heuristics. Until another browser implements Fetch Priority, you may notice some references—[such as MDN](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/fetchPriority)—mark this as [_Experimental_](https://developer.mozilla.org/docs/MDN/Writing_guidelines/Experimental_deprecated_obsolete#experimental), however Fetch Priority is now standardized and included in the [HTML living standard](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#fetch-priority-attributes) and [Fetch living standard](https://fetch.spec.whatwg.org/#request-priority).

## Conclusion

Developers are likely to be interested in Fetch Priority with the fixes in preload behavior and the recent focus on Core Web Vitals and LCP. They now have additional knobs available to achieve their desired loading sequence.
