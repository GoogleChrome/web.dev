---
layout: post
title: Preload critical assets to improve loading speed
authors:
  - houssein
  - mihajlija
description: |
  As soon as you open any web page, the browser requests an HTML document from a
  server, parses the contents of the HTML file, and submits separate requests
  for any other external references. The critical request chain represents the
  order of resources that are prioritized and fetched by the browser.
date: 2018-11-05
updated: 2020-05-27
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

<figure class="w-figure">
{% Img src="image/admin/Ad9PLq3DcQt9Ycp63z6O.png", alt="Screenshot of Chrome DevTools Network panel.", width="701", height="509" %}
<figcaption class="w-figcaption">In this example, Pacifico font is defined in the stylesheet with a <a href="/reduce-webfont-size/#defining-a-font-family-with-@font-face)"><code>@font-face</code></a> rule. The browser loads the font file only after it has finished downloading and parsing the stylesheet.</figcaption>
</figure>

By preloading a certain resource, you are telling the browser that you would like to fetch it sooner than the browser would otherwise discover it because you are certain that it is important for the current page.

<figure class="w-figure">
{% Img src="image/admin/PgRbERrxLGfF439yBMeY.png", alt="Screenshot of Chrome DevTools Network panel after applying preloading.", width="701", height="509" %}
<figcaption class="w-figcaption">In this example, Pacifico font is preloaded, so the download happens in parallel with the stylesheet.</figcaption>
</figure>

The critical request chain represents the order of resources that are prioritized and fetched by the browser. Lighthouse identifies assets that are on the third level of this chain as late-discovered. You can use the [**Preload key requests**](/uses-rel-preload) audit to identify which resources to preload.

{% Img src="image/admin/BPUTHBNZFbeXqb0dVx2f.png", alt="Lighthouse's preload key requests audit.", width="745", height="97", class="w-screenshot" %}

You can preload resources by adding a `<link>` tag with `rel="preload"` to the head of your HTML document:

```html
<link rel="preload" as="script" href="critical.js">
```

The browser caches preloaded resources so they are available immediately when needed. (It doesn't execute the scripts or apply the stylesheets.)

{% Aside %}
After implementing preloading, many sites, including [Shopify, Financial Times and Treebo, saw 1-second improvements](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf) in user-centric metrics such as [Time to Interactive](/interactive) and [First Contentful Paint](/first-contentful-paint).
{% endAside %}

Resource hints, for example, [`preconnect`](/preconnect-and-dns-prefetch)and [`prefetch`](/link-prefetch), are executed as the browser sees fit. The `preload`, on the other hand, is mandatory for the browser. Modern browsers are already pretty good at prioritizing resources, that's why it's important to use `preload` sparingly and only preload the most critical resources.

Unused preloads trigger a Console warning in Chrome, approximately 3 seconds after the `load` event.

{% Img src="image/admin/z4FbCezjXHxaIhq188TU.png", alt="Chrome DevTools Console warning about unused preloaded resources.", width="800", height="228", class="w-screenshot" %}

{% Aside %}
[`preload` is supported](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content#Browser_compatibility) in all modern browsers.
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

Supplying the `as` attribute helps the browser set the priority of the prefetched resource according to its type, set the right headers, and determine whether the resource already exists in the cache. Accepted values for this attribute include: `script`, `style`, `font`, `image`, and [others](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#Attributes).

{% Aside %}
Take a look at the [Chrome Resource Priorities and Scheduling](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit) document to learn more about how the browser prioritizes different types of resources.
{% endAside %}

{% Aside 'caution' %}
Omitting the `as` attribute, or having an invalid value is equivalent to an [XHR request,](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) where the browser doesn't know what it is fetching so it can't determine the correct priority. It can also cause some resources, such as scripts, to be fetched twice.
{% endAside %}

Some types of resources, such as fonts, are loaded in [anonymous mode](https://www.w3.org/TR/css-fonts-3/#font-fetching-requirements). For those you must set the `crossorigin` attribute with `preload`:

```html
<link rel="preload" href="ComicSans.woff2" as="font" type="font/woff2" crossorigin>
```

{% Aside 'caution' %}
Fonts preloaded without the `crossorigin` attribute will be fetched twice!
{% endAside %}

`<link>` elements also accept a [`type` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-type), which contains the [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the linked resource. The browsers use the value of the `type` attribute to make sure that resources get preloaded only if their file type is supported. If a browser doesn't support the specified resource type, it will ignore the `<link rel="preload">`.

{% Aside 'codelab' %}
[Improve the performance of a page by preloading web fonts](/codelab-preload-web-fonts).
{% endAside %}

You can also preload any type of resource via the [`Link` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link):

`Link: </css/style.css>; rel="preload"; as="style"`

A benefit of specifying `preload` in the HTTP Header is that the browser doesn't need to parse the document to discover it, which can offer small improvements in some cases.

### Preloading JavaScript modules with webpack

If you are using a module bundler that creates build files of your application, you need to check if it supports the injection of preload tags. With [webpack](https://webpack.js.org/) version 4.6.0 or later, preloading is supported through the use of [magic comments](https://webpack.js.org/api/module-methods/#magic-comments) inside `import()`:

```js
import(_/* webpackPreload: true */_ "CriticalChunk")
```

If you are using an older version of webpack, use a third-party plugin such as [preload-webpack-plugin](https://github.com/GoogleChromeLabs/preload-webpack-plugin).

## Conclusion

To improve page speed, preload important resources that are discovered late by the browser. Preloading everything would be counterproductive so use `preload` sparingly and [measure the impact in the real-world](/fast#measure-performance-in-the-field).
