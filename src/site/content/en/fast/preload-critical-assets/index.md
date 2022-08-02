---
layout: post
title: Preload critical assets to improve loading speed
authors:
  - houssein
  - mihajlija
  - jlwagner
description: |
  As soon as you open any web page, the browser requests an HTML document from a
  server, parses the contents of the HTML file, and submits separate requests
  for any other external references. The critical request chain represents the
  order of resources that are prioritized and fetched by the browser.
date: 2018-11-05
updated: 2020-08-01
codelabs:
  - codelab-preload-critical-assets
  - codelab-preload-web-fonts
tags:
  - performance
feedback:
  - api
---

When you open a web page, the browser requests the HTML document from a server, parses its contents, and submits separate requests for any referenced resources. As a developer, you already know about all the resources your page needs and which of them are the most important. You can use that knowledge to request the critical resources ahead of time and speed up the loading process. This post explains how to achieve that with `<link rel="preload">`.

## How preloading works

Preloading is best suited for resources typically discovered late by the browser.

<figure>
{% Img src="image/admin/Ad9PLq3DcQt9Ycp63z6O.png", alt="Screenshot of Chrome DevTools Network panel.", width="701", height="509" %}
<figcaption>In this example, Pacifico font is defined in the stylesheet with a <a href="/reduce-webfont-size/#defining-a-font-family-with-@font-face)"><code>@font-face</code></a> rule. The browser loads the font file only after it has finished downloading and parsing the stylesheet.</figcaption>
</figure>

By preloading a certain resource, you are telling the browser that you would like to fetch it sooner than the browser would otherwise discover it because you are certain that it is important for the current page.

<figure>
{% Img src="image/admin/PgRbERrxLGfF439yBMeY.png", alt="Screenshot of Chrome DevTools Network panel after applying preloading.", width="701", height="509" %}
<figcaption>In this example, Pacifico font is preloaded, so the download happens in parallel with the stylesheet.</figcaption>
</figure>

The critical request chain represents the order of resources that are prioritized and fetched by the browser. Lighthouse identifies assets that are on the third level of this chain as late-discovered. You can use the [**Preload key requests**](/uses-rel-preload) audit to identify which resources to preload.

{% Img src="image/admin/BPUTHBNZFbeXqb0dVx2f.png", alt="Lighthouse's preload key requests audit.", width="745", height="97" %}

You can preload resources by adding a `<link>` tag with `rel="preload"` to the head of your HTML document:

```html
<link rel="preload" as="script" href="critical.js">
```

The browser caches preloaded resources so they are available immediately when needed. (It doesn't execute the scripts or apply the stylesheets.)

{% Aside %}
After implementing preloading, many sites, including [Shopify, Financial Times and Treebo, saw 1-second improvements](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf) in user-centric metrics such as [Time to Interactive](/tti/) and [First Contentful Paint](/fcp/).
{% endAside %}

Resource hints, for example, [`preconnect`](/preconnect-and-dns-prefetch)and [`prefetch`](/link-prefetch), are executed as the browser sees fit. The `preload`, on the other hand, is mandatory for the browser. Modern browsers are already pretty good at prioritizing resources, that's why it's important to use `preload` sparingly and only preload the most critical resources.

Unused preloads trigger a Console warning in Chrome, approximately 3 seconds after the `load` event.

{% Img src="image/admin/z4FbCezjXHxaIhq188TU.png", alt="Chrome DevTools Console warning about unused preloaded resources.", width="800", height="228" %}

{% Aside %}
[`preload` is supported](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility) in all modern browsers.
{% endAside %}

## Use cases

{% Aside 'caution' %}
At the time of writing, Chrome has an open
[bug](https://bugs.chromium.org/p/chromium/issues/detail?id=788757) for preloaded requests that are
fetched sooner than other higher priority resources. Until this is resolved, be wary of how
preloaded resources can "jump the queue" and be requested sooner than they should.
{% endAside %}

### Preloading resources defined in CSS

Fonts defined with [`@font-face`](/reduce-webfont-size/#defining-a-font-family-with-@font-face) rules or background images defined in CSS files aren't discovered until the browser downloads and parses those CSS files. Preloading these resources ensures they are fetched before the CSS files have downloaded.

### Preloading CSS files

If you are using the [critical CSS approach](/extract-critical-css), you split your CSS into two parts. The critical CSS required for rendering the above-the-fold content is inlined in the `<head>` of the document and non-critical CSS is usually lazy-loaded with JavaScript. Waiting for JavaScript to execute before loading non-critical CSS can cause delays in rendering when users scroll, so it's a good idea to use `<link rel="preload">` to initiate the download sooner.

### Preloading JavaScript files

Because browsers don't execute preloaded files, preloading is useful to separate fetching from [execution](/bootup-time) which can improve metrics such as Time to Interactive. Preloading works best if you [split](/reduce-javascript-payloads-with-code-splitting) your JavaScript bundles and only preload critical chunks.

## How to implement rel=preload

The simplest way to implement `preload` is to add a `<link>` tag to the `<head>` of the document:

```html
<head>
  <link rel="preload" as="script" href="critical.js">
</head>
```

Supplying the `as` attribute helps the browser set the priority of the prefetched resource according to its type, set the right headers, and determine whether the resource already exists in the cache. Accepted values for this attribute include: `script`, `style`, `font`, `image`, and [others](https://developer.mozilla.org/docs/Web/HTML/Element/link#Attributes).

{% Aside %}
Take a look at the [Chrome Resource Priorities and Scheduling](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit) document to learn more about how the browser prioritizes different types of resources.
{% endAside %}

{% Aside 'caution' %}
Omitting the `as` attribute, or having an invalid value is equivalent to an [XHR request,](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) where the browser doesn't know what it is fetching so it can't determine the correct priority. It can also cause some resources, such as scripts, to be fetched twice.
{% endAside %}

Some types of resources, such as fonts, are loaded in [anonymous mode](https://www.w3.org/TR/css-fonts-3/#font-fetching-requirements). For those you must set the `crossorigin` attribute with `preload`:

```html
<link rel="preload" href="ComicSans.woff2" as="font" type="font/woff2" crossorigin>
```

{% Aside 'caution' %}
Fonts preloaded without the `crossorigin` attribute will be fetched twice!
{% endAside %}

`<link>` elements also accept a [`type` attribute](https://developer.mozilla.org/docs/Web/HTML/Element/link#attr-type), which contains the [MIME type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the linked resource. The browsers use the value of the `type` attribute to make sure that resources get preloaded only if their file type is supported. If a browser doesn't support the specified resource type, it will ignore the `<link rel="preload">`.

{% Aside 'codelab' %}
[Improve the performance of a page by preloading web fonts](/codelab-preload-web-fonts).
{% endAside %}

You can also preload any type of resource via the [`Link` HTTP header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Link):

`Link: </css/style.css>; rel="preload"; as="style"`

A benefit of specifying `preload` in the HTTP Header is that the browser doesn't need to parse the document to discover it, which can offer small improvements in some cases.

### Preloading JavaScript modules with webpack

If you are using a module bundler that creates build files of your application, you need to check if it supports the injection of preload tags. With [webpack](https://webpack.js.org/) version 4.6.0 or later, preloading is supported through the use of [magic comments](https://webpack.js.org/api/module-methods/#magic-comments) inside `import()`:

```js
import(_/* webpackPreload: true */_ "CriticalChunk")
```

If you are using an older version of webpack, use a third-party plugin such as [preload-webpack-plugin](https://github.com/GoogleChromeLabs/preload-webpack-plugin).

## Effects of preloading on Core Web Vitals

Preloading is a powerful performance optimization that has an effect on loading speed. Such optimizations can lead to changes in your site's [Core Web Vitals](/vitals/), and it's important to be aware them.

### Largest Contentful Paint (LCP)

Preloading has a powerful effect on [Largest Contentful Paint (LCP)](/lcp/) when it comes to fonts and images, as both images and text nodes can be [LCP candidates](/lcp/#what-elements-are-considered). Hero images and large runs of text that are rendered using web fonts can benefit significantly from a well-placed preload hint, and should be used when there are opportunities to deliver these important bits of content to the user faster.

However, you want to be careful when it comes to preloading&mdash;and other optimizations! In particular, avoid preloading too many resources. If too many resources are prioritized, effectively none of them are. The effects of excessive preload hints will be especially detrimental to those on slower networks where bandwidth contention will be more evident.

Instead, focus on a few high-value resources that you know will benefit from a well-placed preload. When preloading fonts, ensure that you're serving fonts in WOFF 2.0 format to reduce resource load time as much as possible. Since WOFF 2.0 has [excellent browser support](https://caniuse.com/woff2), using older formats such as WOFF 1.0 or TrueType (TTF) will delay your LCP if the LCP candidate is a text node.

When it comes to LCP and JavaScript, you'll want to ensure that you're sending complete markup from the server in order for the [browser's preload scanner](/preload-scanner/) to work properly. If you're serving up an experience that relies entirely on JavaScript to render markup and can't send server-rendered HTML, it would be advantageous to step in where the browser preload scanner can't and preload resources that would only otherwise be discoverable when the JavaScript finishes loading and executing.

### Cumulative Layout Shift (CLS)

[Cumulative Layout Shift (CLS)](/cls/) is an especially important metric where web fonts are concerned, and CLS has significant interplay with web fonts that use the [`font-display` CSS property](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display) to manage how fonts are loaded. To minimize web font-related layout shifts, consider the following strategies:

1. **Preload fonts while using the default `block` value for `font-display`.** This is a delicate balance. Blocking the display of fonts without a fallback can be considered a user experience problem. On one hand, loading fonts with `font-display: block;` eliminates web font-related layout shifts. On the other hand, you still want to get those web fonts loaded as soon as possible if they're crucial to the user experience. Combining a preload with `font-display: block;` may be an acceptable compromise.
2. **Preload fonts while using the `fallback` value for `font-display`.** `fallback` is a compromise between `swap` and `block`, in that it has an extremely short blocking period.
3. **Use the `optional` value for `font-display` without a preload.** If a web font isn't crucial to the user experience, but it is still used to render a significant amount of page text, consider using the `optional` value. In adverse conditions, `optional` will display page text in a fallback font while it loads the font in the background for the next navigation. The net result in these conditions is improved CLS, as system fonts will render immediately, while subsequent page loads will load the font immediately without layout shifts.

CLS is a difficult metric to optimize for when it comes to web fonts. As always, experiment in the [lab](/lab-and-field-data-differences/#lab-data), but trust your [field data](/lab-and-field-data-differences/#field-data) to determine if your font loading strategies are improving CLS or making it worse.

### Responsiveness metrics

[First Input Delay (FID)](/fid/) and [Interaction to Next Paint](/inp/) are two metrics that gauge responsiveness to user input. Since the lion's share of interactivity on the web is driven by JavaScript, preloading JavaScript that powers important interactions may help to keep your FID and INP metrics as low as they can possibly be. However, be aware that FID is a load responsiveness metric and INP observes interactions throughout the entire page lifecycle&mdash;including during startup. Preloading too much JavaScript during startup can carry unintended negative consequences if too many resources are contending for bandwidth.

You'll also want to be careful about how you go about [code splitting](/reduce-javascript-payloads-with-code-splitting/). Code splitting is an excellent optimization for reducing the amount of JavaScript loaded during startup, but interactions can be delayed if they rely on JavaScript loaded right at the start of the interaction. To compensate for this, you'll need to examine the user's intent, and inject a preload for the necessary chunk(s) of JavaScript before the interaction takes place. One example could be preloading JavaScript required for validating a form's contents when any of the fields in the form are focused.

## Conclusion

To improve page speed, preload important resources that are discovered late by the browser. Preloading everything would be counterproductive so use `preload` sparingly and [measure the impact in the real-world](/fast#measure-performance-in-the-field).
