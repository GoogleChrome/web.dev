---
layout: post-old
title: Optimizing resource loading with Priority Hints
authors:
  - leenasohoni
  - addyosmani
  - patmeenan
description: Priority hints indicate the relative importance of resources to the browser. They can enable optimal loading and improve Core Web Vitals.
subhead: Priority hints indicate the relative importance of resources to the browser. They can enable optimal loading and improve Core Web Vitals.
date: 2021-10-20
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/WqBkrvs5LRwPIfrSOQyz.jpg
alt: A photo of a brown wooden plank fence, with a signboard attached to it. The signboard reads "this way", with an arrow pointing to the right.
tags:
  - performance
  - network
  - blog
---

When a browser parses a web page and begins to discover and download resources such as images, scripts, or CSS, it assigns them a fetch `priority` in an attempt to download resources in an optimal order. These priorities can depend on the kind of resource and where it is in the document. For example, in-viewport images may have a `High` priority while the priority for early `<link>` loaded, render-blocking CSS in the `<head>` could be `Very High`. Browsers are pretty good at assigning priorities that work well but may not be optimal in all cases.

In this article, we'll discuss Priority Hints and the `importance` attribute, which allow you to hint at the relative importance of a resource (`high` or `low`). Priority Hints can help optimize the Core Web Vitals.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/UQ60oFwWrVCPbFYx3pJY.png", alt="A filmstrip view comparing two tests of the Google Flights homepage. At bottom, Priority Hints are used to boost the priority of the hero image, resulting in a 0.7 second decrease in LCP.
", width="800", height="400", class="w-screenshot" %}
  <figcaption>Priority Hints improving Largest Contentful Paint from 2.6&nbsp;s to 1.9&nbsp;s in a test of Google Flights</figcaption>
</figure>

## Summary

**A few key areas where priority hints can help:**

- Boost the priority of the LCP image by specifying `importance="high"` on the image element, causing LCP to happen sooner.
- Increase the priority of `async` scripts using better semantics than the current hack that is commonly used (inserting a <code>&lt;link rel="preload"&gt;</code> for the `async` script).
- Decrease the priority of late-body scripts to allow for better sequencing with images.

Historically, developers have had some, but limited, influence over resource priority using [preload](/uses-rel-preload/) and [preconnect](/uses-rel-preconnect/). Priority Hints complement these [Resource Hints](https://www.w3.org/TR/resource-hints/), but it's essential to understand where they all fit in. Preload lets you tell the browser about critical resources you want to load early before they are discovered naturally. This is especially useful for not easily discoverable resources, such as fonts included in stylesheets, background images, or resources loaded from a script. Preconnect helps warm up connections to cross-origin servers and can help improve metrics like [Time-to-first-byte](/ttfb/) and is useful when you know an origin but not necessarily the exact URL of a resource that will be needed.

Priority hints are a markup-based signal (available through the `importance` attribute) that developers can use to indicate the importance of a particular resource. You can also use these hints via JavaScript and the [Fetch API](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) to influence the priority of resource fetches made for data. Priority hints can also complement preload. Take a Largest Contentful Paint image, which, when preloaded, will still get a low priority. If it is pushed back by other early low-priority resources, using Priority Hints can still help how soon the image gets loaded.

Priority Hints are an [experimental feature](https://www.chromestatus.com/feature/5273474901737472) available as an [origin trial](https://developer.chrome.com/origintrials/#/view_trial/365917469723852801) in Chrome 96+ (Chrome Beta at the time of writing, Chrome Stable in four weeks). We hope that developers will try it and provide their feedback. The feature being able to stick around depends on developer feedback. You can also try out Priority Hints via a flag in Chrome.

## Resource priority

The resource download sequence depends on the browser's assigned priority for every resource on the page. Different factors can affect priority computation logic. For example,

- CSS, fonts, scripts, images, and third-party resources are assigned different priorities.
- The location or order in which you reference resources in the document also affects the priority of resources.
- The [`preload`](/uses-rel-preload/) resource hint helps the browser to discover a resource faster and thus load it before the document loads it and affects priority.
- Priority computation changes for [`async` or `defer`](/efficiently-load-third-party-javascript/#use-async-or-defer) scripts.

The following table considers such factors to show how most resources are currently prioritized and sequenced in Chrome.

<div class="w-table-wrapper">
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
        <td><strong>Blink Priority</strong></td>
        <td><strong>VeryHigh</strong></td>
        <td><strong>High</strong></td>
        <td><strong>Medium</strong></td>
        <td><strong>Low</strong></td>
        <td><strong>VeryLow</strong></td>
      </tr>
      <tr>
        <td><strong>DevTools Priority</strong></td>
        <td><strong>Highest</strong></td>
        <td><strong>High</strong></td>
        <td><strong>Medium</strong></td>
        <td><strong>Low</strong></td>
        <td><strong>Lowest</strong></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>Main resource</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>CSS*** (early**)</td>
        <td>&nbsp;</td>
        <td>CSS*** (late**)</td>
        <td>&nbsp;</td>
        <td>CSS (mismatch)</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>Script (early** or not from preload scanner)</td>
        <td>Script (**late)</td>
        <td>Script (async)</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>Font</td>
        <td>Font (preload)</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>Import</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>Image (in viewport)</td>
        <td>&nbsp;</td>
        <td>Image</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>Media</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>SVG document</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>Prefetch</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>Preload*</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>XSL</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>XHR (sync)</td>
        <td>XHR/fetch* (async)</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>Favicon</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}
\* Preload using `"as"` or fetch using `"type"` use the priority of the type they are requesting (e.g., preload `as="stylesheet"` will use Highest priority). With no `"as"`, they will behave like an XHR.

\*\* "Early" is defined as being requested before any non-preloaded images have been requested ("late" is after).

\*\*\* CSS where the media type doesn't match is not fetched by the preload scanner and is only processed when the main parser reaches it, which usually means it will be fetched very late and with a "late" priority.
{% endAside %}

The browser downloads resources with the same computed priority in the order they are discovered. You can check the priority assigned to different resources when loading a page under the Chrome Dev Tools **Network** tab. (Ensure that you check the priority column by right-clicking on the table headings).

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Lwm9jwJF5sQ3gQ7PHSs1.png", alt="A screenshot of assets listed in the network tab of Chrome's DevTools. The columns read, from left to right: name, status, type, initiator, size, time, and priority.", width="800", height="263" %}
  <figcaption>Priority for resource <code>type = &quot;font&quot;</code> on BBC news detail page</figcaption>
</figure>


<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/K5U3maOt2TFBbtScW7TY.png", alt="A screenshot of assets listed in the network tab of Chrome's DevTools. The columns read, from left to right: name, status, type, initiator, size, time, and priority.", width="800", height="175" %}
  <figcaption>Priority for resource type = &quot;script&quot; on BBC news detail page</figcaption>
</figure>

## When would you need priority hints

Knowledge of the browser's prioritization logic provides you with a few existing knobs to tweak the order of downloads. You can

1.  Place resource tags such as `<script>` and `<link>` depending on the order you want to download them. Resources with the same priority are generally loaded in the order they are discovered.
2.  [Use the `preload` resource hint](/preload-critical-assets/) to download necessary resources earlier, particularly for resources that are not easily discovered early by the browser.
3.  Use [`async` or `defer](/efficiently-load-third-party-javascript/#use-async-or-defer) to download scripts without blocking other resources.
4.  Lazy-load below-the-fold content so that the browser can use the available bandwidth for more critical above-the-fold resources.

These techniques help to control the browser's priority computation, thereby improving performance and [Core Web Vitals](/vitals/). For example, when a critical background image is preloaded, it can be discovered much earlier, improving the Largest Contentful Paint ([LCP](/lcp/)).

Sometimes these handles may not be enough to prioritize resources optimally for your application. We can think of the following scenarios where priority hints could be helpful.

1. You have several above-the-fold images, but all of them need not have the same priority. For example, in an image carousel, only the first visible image needs a higher priority compared to the others.
2. Hero images inside the viewport start at a low priority. After the layout is complete, Chrome discovers they are in the viewport and boosts their priority (unfortunately, dev tools only shows the final priority - WebPageTest will show both). This usually adds a significant delay to loading the image. Providing the priority hint in markup lets the image start at a high priority and start loading much earlier.<br><br>Note that preload is still required for the early discovery of LCP images included as CSS backgrounds and can be combined with priority hints by including the importance='high' on the preload, otherwise it will still start with the default "Low" priority for images.
3. Declaring scripts as `async` or `defer` tells the browser to load them asynchronously. However, as seen in the figure above, these scripts are also assigned a "low" priority. You may want to bump up their priority while ensuring asynchronous download, particularly for any scripts that are critical for the user experience.
4. You may use the JavaScript [`fetch()`](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) API to fetch resources or data asynchronously. Fetch is assigned a high priority by the browser. There may be situations where you do not want all your fetches to be executed with high priority and prefer using different priority hints instead. This can be helpful when running background API calls and mixing them with API calls that are responding to user input, like with autocomplete. The background API calls can be tagged as low priority and the interactive API calls marked as high priority.
5. The browser assigns CSS and fonts a high priority, but all such resources may not be equally important or required for LCP. You can use priority hints to lower the priority of some of these resources.

## The `importance` attribute

With the experimental feature for priority hints available as an Origin Trial, you can provide a priority hint using the `importance` attribute. You can use the attribute with `link`, `img`, `script`, and `iframe` tags. The attribute allows you to specify the priority for resource types such as CSS, fonts, scripts, images, and iframe when downloaded using the supported tags.
The importance attribute accepts one of three values:

- `high`: You consider the resource a high priority and want the browser to prioritize it as long as the browser's heuristics don't prevent that from happening.
- `low`: You consider the resource a low priority and want the browser to deprioritize it if it's heuristics permit.
- `auto`: This is the default value where you don't have a preference and let the browser decide the appropriate priority.

Here are a few examples of using the importance attribute in markup and script.

```html
<!-- We don't want a high priority for this above-the-fold image -->
<img src="/images/in_viewport_but_not_important.svg" importance="low" alt="I'm an unimportant image!">

<!-- We want to initiate an early fetch for a resource, but also deprioritize it -->
<link rel="preload" href="/js/script.js" as="script" importance="low">

<script>
  fetch('https://example.com/', {importance: 'low'}).then(data => {
    // Trigger a low priority fetch
  });
</script>

<!-- The third-party contents of this iframe can load with a low priority -->
<iframe src="https://example.com" width="600" height="400" importance="low"></iframe>
```

{% Aside %}
When a priority hint is set on an `iframe`, the priority is applied only to the main resource for the iframe. All of the subresources that the `iframe` loads will be prioritized using the same rules that apply to all other resources.
{% endAside %}

### Browser priority and `importance`

You can apply the `importance` attribute to different resources as shown in the following figure to potentially increase or reduce their computed priority. Importance = `auto` (◉) in each row denotes the default priority for that type of resource.

<div class="w-table-wrapper">
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
        <td><strong>Blink Priority</strong></td>
        <td><strong>VeryHigh</strong></td>
        <td><strong>High</strong></td>
        <td><strong>Medium</strong></td>
        <td><strong>Low</strong></td>
        <td><strong>VeryLow</strong></td>
      </tr>
      <tr>
        <td><strong>DevTools Priority</strong></td>
        <td><strong>Highest</strong></td>
        <td><strong>High</strong></td>
        <td><strong>Medium</strong></td>
        <td><strong>Low</strong></td>
        <td><strong>Lowest</strong></td>
      </tr>
      <tr>
        <td>Main Resource</td>
        <td>◉</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>CSS*** (early**)</td>
        <td>⬆◉</td>
        <td>⬇</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>CSS*** (late**)</td>
        <td>&nbsp;</td>
        <td>⬆</td>
        <td>◉</td>
        <td>⬇</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>Script (early** or not from preload scanner)</td>
        <td>&nbsp;</td>
        <td>⬆◉</td>
        <td>&nbsp;</td>
        <td>⬇</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>Script*** (late**)</td>
        <td>&nbsp;</td>
        <td>⬆</td>
        <td>◉</td>
        <td>⬇</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>Script (async/defer)</td>
        <td>&nbsp;</td>
        <td>⬆</td>
        <td>&nbsp;</td>
        <td>◉⬇</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>Font</td>
        <td>◉</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>Font (preload)</td>
        <td>&nbsp;</td>
        <td>⬆◉</td>
        <td>&nbsp;</td>
        <td>⬇</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>Import</td>
        <td>&nbsp;</td>
        <td>◉</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>Image (in viewport)</td>
        <td>&nbsp;</td>
        <td>⬆◉</td>
        <td>&nbsp;</td>
        <td>⬇</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>Image</td>
        <td>&nbsp;</td>
        <td>⬆</td>
        <td>&nbsp;</td>
        <td>◉⬇</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>Media (video/audio)</td>
        <td>&nbsp;</td>
        <td>⬆</td>
        <td>&nbsp;</td>
        <td>◉⬇</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>SVG document</td>
        <td>&nbsp;</td>
        <td>⬆</td>
        <td>&nbsp;</td>
        <td>◉⬇</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>XHR (sync) - deprecated</td>
        <td>◉</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>XHR/fetch* (async)</td>
        <td>&nbsp;</td>
        <td>⬆◉</td>
        <td>&nbsp;</td>
        <td>⬇</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>Preload*</td>
        <td>&nbsp;</td>
        <td>⬆◉</td>
        <td>&nbsp;</td>
        <td>⬇</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>Prefetch</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>◉</td>
      </tr>
      <tr>
        <td>Favicon</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>◉</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      <tr>
        <td>XSL</td>
        <td>&nbsp;</td>
        <td>◉</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %}
\* Preload using `"as"` or fetch using `"type"` use the priority of the type they are requesting (e.g., preload `as="stylesheet"` will use Highest priority). With no `"as"`, they will behave like an XHR.

\*\* "Early" is defined as being requested before any non-preloaded images have been requested ("late" is after).

\*\*\* CSS where the media type doesn't match is not fetched by the preload scanner and is only processed when the main parser reaches it, which usually means it will be fetched very late and with a "late" priority.

◉: `importance="auto"`
⬆: `importance="high"`
⬇: `importance="low"`

Images within the viewport start at low priority and then at layout time are boosted to high. By tagging it in markup using `importance`, it can start at high immediately and load much faster.
{% endAside %}

### Use cases

You can use the `importance` attribute to address scenarios where you may need priority hints.

#### Increase the priority of the LCP image

You can specify `importance="high"` to boost the priority of the LCP or other critical images.

```html
<img src="lcp-image.jpg" importance="high">
```

The following comparison shows the Google Flights page with an LCP background image loaded with and without priority hints. With the priority set to high, the [LCP improved from 2.6s to 1.9s](https://www.webpagetest.org/video/compare.php?tests=211006_AiDcG3_40871b05d6040112a05be4524565cf5d%2C211006_BiDcHR_bebed947f1b6607f2d97e8a899fdc36b&thumbSize=200&ival=100&end=visual).

<figure>
  {% Video src="video/1L2RBhCLSnXjCnSlevaDjy3vba73/BCngJfoVOy0YbUz8wFrM.mp4", autoplay=true, muted=true, playsinline=true, loop=true, controls=true %}
  <figcaption>An experiment conducted using Cloudflare workers to rewrite the Google Flights page to use priority hints.</figcaption>
</figure>

#### Lower the priority of above-the-fold images

You can use the `importance` attribute to lower the priority of above-the-fold images that may not be important for example in an image carousel.

```html
<ul class="carousel">
  <img src="img/carousel-1.jpg" importance="high">
  <img src="img/carousel-2.jpg" importance="low">
  <img src="img/carousel-3.jpg" importance="low">
  <img src="img/carousel-4.jpg" importance="low">
</ul>
```

In an earlier experiment with the [Oodle](https://github.com/google/oodle-demo) app, we used this to lower the priority of images that do not appear on load. It helped to cut down the load time by 2 seconds.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Tn4OkGpqPbrSQtd1j3GV.png", alt="A side-by-side comparison of Priority Hints when used on the Oodle app's image carousel. On the left, the browser sets default priorities for carousel images, but downloads and paints those images around two seconds slower than the example on the right, which sets a higher priority on only the first carousel image.", width="800", height="460" %}
</figure>

#### Lower the priority of preloaded resources

To stop preloaded resources from competing with other critical resources, you could provide a hint to reduce their priority. You can use this technique with images, scripts, and CSS.

```html
<!-- Lower priority only for non-critical preloaded scripts -->
<link rel="preload" as="script" href="critical-script.js">
<link rel="preload" href="/js/script.js" as="script" importance="low">

<!-- Preload CSS and hero images without blocking other resources -->
<link rel="preload" as="style" href="theme.css" importance="low" onload="this.rel=stylesheet">
```

#### Reprioritize scripts

Scripts required to make some parts of the page interactive are essential but should not block other resources. You can mark these as async with high priority.

```html
<script src="async_but_important.js" async importance="high"></script>
```

Scripts cannot be marked as async if they rely on specific DOM states. However if they are lower down on the page, they may be downloaded with a lower priority as shown.

```html
<script src="blocking_but_unimportant.js" importance="low"></script>
```

#### Lower the priority for non-critical data fetches

The browser executes `fetch` with a high priority. If you have multiple fetches that may be fired simultaneously, you can use the high default priority for the more critical data fetches and lower it for less critical data.

```javascript
// Important validation data (high by default)
let authenticate = await fetch('/user');

// Less important content data (suggested low)
let suggestedContent = await fetch('/content/suggested', {importance: 'low'});
```

## Priority Hints implementation notes

Priority hints can improve performance in specific use cases, as discussed above. We want to use the Origin Trial as an opportunity to get a better insight into the real impact of the change. It is essential we set clear expectations for quality feedback.

- The `importance` attribute is a hint and not a directive. The browser will try to respect the developer's preference. It is also possible that the browser will apply its preferences for resource priority as deemed necessary in case of conflicts.
- Priority hints should not be confused with a preload. They are both distinct because:
    - Preload is a mandatory fetch and not a hint.
    - It is easier to observe and measure the effects of a preload.

  Priority hints can complement preloads by increasing the granularity of prioritization. If you had already specified a preload at the top of the page for an LCP image, then a "high" priority hint may not result in significant gains. However, if the preload was after other less important resources, then a high-priority hint can boost the LCP. If a critical image is a CSS background image, you should preload it with `importance = "high"`.
- The noticeable gains due to prioritization will be more relevant in environments where more resources contend for the available network bandwidth. This is possible for HTTP/1.x connections where parallel downloads are not possible or in low bandwidth HTTP/2 connections. Prioritization can resolve bottlenecks in these conditions.
- CDNs do [not uniformly implement HTTP/2 prioritization](https://github.com/andydavies/http2-prioritization-issues#cdns--cloud-hosting-services). Even if the browser communicates the priority suggested using priority hints; the CDN may not reprioritize resources in the required order. This makes testing of priority hints difficult. The priorities are applied both internally within the browser and with protocols that support prioritization (HTTP/2 and HTTP/3) so it is still worth using even for just the internal browser prioritization independent of CDN or origin support.
- It may not be possible to introduce priority hints as a best practice in your initial design. It is an optimization that you can apply later in the development cycle. You can check the priorities being assigned to different resources on the page, and if they do not match your expectations, you could introduce priority hints for further optimization.

### Using Preload after Chrome 95

The priority hints feature was available for trial in Chrome 73 to 76 but was not released due to prioritization issues with preloads fixed in Chrome 95. Prior to Chrome 95, requests issued via `<link rel=preload>` always start before other requests seen by the preload scanner, even if the other requests have a higher priority.

With the fix in Chrome 95 and the enhancement for priority hints, we hope that developers will start using preload for its [intended purpose](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/#loading-of-late-discovered-resources) - to preload resources not detected by the parser (fonts, imports, background LCP images). The placement of the `preload` hint will affect when the resource is preloaded. Some key points on using preload are:

- Including the preload in HTTP headers will cause it to jump ahead of everything else.
- Generally, preloads will load in the order the parser gets to them for anything above &quot;Medium&quot; priority - so be careful if you are including preloads at the beginning of the HTML.
- Font preloads will probably work best towards the end of the head or beginning of the body.
- Import preloads (dynamic import() or modulepreload) should be done after the script tag that needs the import (so the actual script gets loaded/parsed first). Basically, if the script tag loads a script that will trigger the load of dependencies, make sure the `<link rel=preload>` for the dependencies is after the parent script tag, otherwise the dependencies may end up loading before the main script. In the proper order, the main script can be parsed/eval'd while the dependencies are loading.
- Image preloads will have a low priority (without priority hints) and should be ordered relative to async scripts and other low or lowest priority tags.

## Origin Trial

The priority hints feature will be available as an [Origin Trial](https://developer.chrome.com/origintrials/#/view_trial/365917469723852801) from Chrome 96 to 99. Version 96 is already available in [Canary](https://www.google.com/intl/en_sg/chrome/canary/) for developers who wish to try it out early. You can register your domain for the trial and include the token in the `head` of the page you want to test.

You can also enable the **Experimental Web Platform Features** flag in Chrome to test the feature.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/NNupmBrjCHQ6maB4U6NA.png", alt="A screenshot of Chrome's experimental web features toggled on under the hood. This screen is accessible by navigating to chrome://flags in Chrome.", width="800", height="260" %}
</figure>

### Using the trial

The following is a comparison between a set of images and a script file loaded with different priorities. Note that the default priorities for images and scripts are applied on Chrome 94. On the other hand, the priority set through the importance attribute is applied when tested on Chrome 96.

Following is the relevant mark-up included in the HTML file.

```html
<!-- include trial token in the <head> -->
<meta http-equiv="origin-trial" content="{Replace with origin trial token}">

<!-- Lower the priority of script file -->
<script src="script.js" importance="low"></script>

<!-- Alter the priority of images -->
<img src="Background.jpg" width="400" importance="low">
<img src="Sunset.jpg" width="400" importance="high">

<!-- Note that importance="auto" is the default based on the spec if not specified -->
<img src="Flower.jpg">
```

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/mmjf9CVbs0wqLSq4Y6Hg.png", alt="A screenshot of Chrome's DevTools open for a page in Chrome 94 with a largely unstyled document. The document includes a few images, as well as a script asset. Because this is Chrome 94 and Priority Hints were not implemented at that time, the priority hints take no effect, and the browser assigns the default priorities.", width="800", height="499" %}
  <figcaption>Priority on Chrome 94 - stable version</figcaption>
</figure>

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/4fIgpdvgryzGkfYyrAbt.png", alt="A screenshot of the same document with Chrome's DevTools open, only in Chrome 96. This time, the Priority Hints take effect when set for resources, and the effect is shown in the priority column at right.", width="800", height="499" %}
  <figcaption>Priority on Chrome 96 - Canary</figcaption>
</figure>

## Conclusion

Developers are likely to be interested in priority hints with the fixes in preload behavior and the recent focus on Core Web Vitals and LCP. They now have additional knobs available to achieve their desired loading sequence. We hope that more developers will register for the trial and report their feedback through the available [channels](https://github.com/WICG/priority-hints/issues).
