---
layout: post
title: Minify and compress network payloads
authors:
  - houssein
  - jlwagner
date: 2018-11-05
updated: 2023-01-13
description: |
  There are two useful techniques that can be used to improve the performance of
  your web page, minification and data compression. Incorporating both of these
  techniques reduces payload sizes and in turn improves page load times.
codelabs:
  - codelab-text-compression
  - codelab-text-compression-brotli
tags:
  - performance
---

There are two useful techniques that can be used to improve the performance of
your web page:

* Minification
* Data compression

Incorporating both of these techniques reduces payload sizes and in turn
improves page load times.

## Measure

Lighthouse displays a failed audit if it detects any CSS or JS resources on your
page that can be minified.

{% Img src="image/admin/ZT9ESeCStegt0SklYbni.png", alt="Lighthouse Minify CSS Audit", width="800", height="90" %}

{% Img src="image/admin/vDaAnUSvQxmGcoasQj1k.png", alt="Lighthouse Minify JS Audit", width="800", height="112" %}

It also audits for any uncompressed assets.

{% Img src="image/admin/xfqzdLuu3w3lanxo5Ggc.png", alt="Lighthouse: Enable text compression", width="800", height="123" %}

## Minification

**Minification** is the process of removing whitespace and any code that is not
necessary to create a smaller but perfectly valid code file.
[Terser](https://github.com/terser-js/terser) is a popular JavaScript
compression tool and [webpack](https://webpack.js.org/) v4 includes a plugin
for this library by default to create minified build files.

* If you're using webpack v4 or greater, you should be good to go
    without doing any additional work. 👍
* If you are using an older version of webpack, install and include
`TerserWebpackPlugin` into your webpack configuration settings. Follow
the [documentation](https://webpack.js.org/plugins/terser-webpack-plugin/) to
learn how.
* If you are not using a module bundler, use `Terser` as a CLI tool or
include it directly as a dependency to your application. The project
[documentation](https://github.com/terser-js/terser) provides instructions.

## Data compression

**Compression** is the process of modifying data using a compression algorithm.
[Gzip](https://www.youtube.com/watch?v=whGwm0Lky2s&feature=youtu.be&t=14m11s) is
the most widely used compression format for server and client interactions.
[Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html)
is a newer compression algorithm which can provide even better compression
results than Gzip.

{% Aside %}
Compressing files can significantly improve the performance of a
webpage, but you rarely need to do this yourself. Many hosting
platforms, CDNs and reverse proxy servers either encode assets with compression
by default or allow you to easily configure them. Read the documentation for the
tool that you are using to see if compression is already supported before
attempting to roll out your own solution.
{% endAside %}

There are two different ways to compress files sent to a browser:

* Dynamically
* Statically

Both approaches have their own advantages and disadvantages which is covered in
the next section. Use whichever works best for your application.

## Dynamic compression

This process involves compressing assets on-the-fly as they get requested by the
browser. This can be simpler than compressing files manually or with a build
process, but can cause delays if high compression levels are used.

[Express](https://expressjs.com/) is a popular web framework for Node and
provides a [compression](https://github.com/expressjs/compression) middleware
library. Use it to compress any asset as it gets requested. Here is an example
of an entire server file that uses it correctly:

```js/5
const express = require('express');
const compression = require('compression');

const app = express();

app.use(compression());

app.use(express.static('public'));

const listener = app.listen(process.env.PORT, function() {
	console.log('Your app is listening on port ' + listener.address().port);
});
```

This compresses your assets using `gzip`. If your web server supports it,
consider using a separate module like
[shrink-ray](https://github.com/aickin/shrink-ray#readme) to compress via
Brotli to achieve better compression ratios.

{% Aside 'codelab' %}
Use express.js to compress assets with [gzip](/codelab-text-compression) and [Brotli](/codelab-text-compression-brotli).
{% endAside %}

## Static compression

Static compression involves compressing and saving assets ahead of time. This
can make the build process take longer, especially if high compression levels
are used, but ensures that no delays happen when the browser fetches the
compressed resource.

If your web server supports Brotli, use a plugin like
[BrotliWebpackPlugin](https://github.com/mynameiswhm/brotli-webpack-plugin) with
webpack to compress your assets as part of your build step. Otherwise, use
[CompressionPlugin](https://github.com/webpack-contrib/compression-webpack-plugin)
to compress your assets with gzip. It can be included just like any other plugin
in the webpack configurations file:

```js/4
module.exports = {
	//...
	plugins: [
		//...
		new CompressionPlugin()
	]
}
```

Once compressed files are part of the build folder, create a route in your
server to handle all JS endpoints to serve the compressed files. Here is an
example of how this can be done with Node and Express for gzipped assets.

<pre>
const express = require('express');
const app = express();

<strong>app.get('*.js', (req, res, next) => {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	next();
});</strong>

app.use(express.static('public'));
</pre>

## Effects on Core Web Vitals

Depending the type of resource, both compression and minification can have a variety of effects on Core Web Vitals. Since both minification and compression reduce the payload size of the delivered resource, it's important to understand what Core Web Vitals are affected by these performance optimizations.

### CSS

When CSS resources are compressed and minified, a number of performance improvements may be observed in your Core Web Vitals metrics.

CSS is render-blocking so the quicker it can be downloaded and parsed, the quicker these renders can happen which can help both [First Contentful Paint (FCP)](/fcp/) and [Largest Contentful Paint (LCP)](/lcp/).

### JavaScript

Compressing and minifying JavaScript can have positive impacts on your website:

- Making the JavaScript resources smaller allows the JavaScript to download faster, allowing it to be to be processed earlier, allowing your page to become interactive earlier. However, it's also important that you're only serving the JavaScript that a given page needs, otherwise you may risk delays in responding to user inputs during that crucial startup period.
- If your JavaScript is providing markup for a page, then it is especially critical to allow this to happen as fast as possible. As always, smaller payloads will download faster. In the case of JavaScript, reducing resource load time means you're going to arrive at the parsing, compiling, and execution steps sooner. This may result in faster LCP times if the client-rendered markup contains the page's LCP element. Beyond that, you should try to avoid rendering markup on the client, as [it defeats the preload scanner](/preload-scanner/#rendering-markup-with-client-side-javascript).

### SVG images

Raster image types are inherently compressed, be it lossy or lessless formats. However, SVG—being a vector image format and text-based—benefits greatly from compression and minification in the same way that other text-based resources can.

The primary benefit of compression and minifying SVG images depends on whether the SVG image is the LCP element for the given page. If this is the case, you could expect to see lower LCP times.

### Caveats on dynamic versus static compression

Dynamic compression means that the resource is compressed on the server at the time of the request. The inherent nature of this type of compression is that this process takes time on the server to complete, which can delay the resource's [Time to First Byte](/ttfb/). This delay means that—depending on the compression algorithm and level—dynamic compression could actually _delay_ the resource download time.

For static assets such as CSS, JavaScript, and images, you should try to avoid dynamic compression. Static compression is an alternative compression method where the resource is compressed ahead of time and stored on disk, which means that there's no server time involved in compressing the resource at the time of the request. It's the best of both worlds: you get reduced resource payloads, without any of the delays that come with dynamic compression.

The only exception to this rule is with dynamically generated HTML. This is HTML that changes based on the user, such as HTML payloads generated for authenticated users. You can't statically compress this type of markup. However, if you're running a website that doesn't perform personalization of markup on the server, you can safely compress it statically.
