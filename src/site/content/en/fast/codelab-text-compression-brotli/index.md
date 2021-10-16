---
layout: codelab
title: Minify and compress network payloads with brotli
authors:
  - mdiblasio
description: |
  In this codelab, learn how Brotli compression can further reduce compression
  ratios and your app's overall size.
date: 2019-05-05
glitch: fav-kitties-compress-starter
related_post: reduce-network-payloads-using-text-compression
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

This codelab is an extension of the [Minify and compress network payloads
codelab](/codelab-text-compression)
and assumes you are familiar with the basics concepts of compression. As
compared to other compression algorithms like `gzip`, this codelab explores how
Brotli compression can further reduce compression ratios and your app's overall
size.

{% Img src="image/admin/k94QI9lhJ39aXpwUrMNk.png", alt="App screenshot", width="800", height="535" %}

## Measure

{% Aside %}
Since [webpack](https://webpack.js.org) is used in this application,
any changes made to the codewill trigger a new build which can take a few
seconds. Once it completes, you should see your changes reflectedin the
application.
{% endAside %}

Before diving in to add optimizations, it's always a good idea to first analyze
the current state of the application.

{% Instruction 'remix', 'ol' %}
{% Instruction 'preview', 'ol' %}

In the previous [Minify and compress network payloads
codelab](/codelab-text-compression),
we reduced the size of `main.js` from 225 KB to 61.6 KB. In this codelab, you
will explore how Brotli compression can reduce this bundle size even further.

## Brotli Compression

{% Aside 'warning' %}
Many hosting platforms, CDNs and reverse proxy servers either encode assets with
compression by default or allow you to easily configure them. If your hosting
platform supports Brotli, you may not need to setup your server to compress your
assets with Brotli as described in this tutorial.
{% endAside %}

[Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html)
is a newer compression algorithm which can provide even better text compression
results than `gzip`. According to
[CertSimple](https://certsimple.com/blog/nginx-brotli), Brotli performance is:
+  14% smaller than `gzip` for JavaScript
+  21% smaller than `gzip` for HTML
+  17% smaller than `gzip` for CSS

To use Brotli, your server must support HTTPS. Brotli is supported in the
[latest versions of most browsers](https://caniuse.com/#feat=brotli). Browsers
that support Brotli will include `br` in `Accept-Encoding` headers:

<pre>
Accept-Encoding: gzip, deflate, <strong>br</strong>
</pre>

You can determine which compression algorithm is used via the `Content-Encoding`
field in the Chrome Developer Tools Network tab (`Command+Option+I` or
`Ctrl+Alt+I`):

{% Img src="image/admin/ZddI1FFjEckeO8mabgYl.png", alt="Network panel", width="800", height="136", class="w-screenshot" %}

## Enabling Brotli

### Dynamic compression

**Dynamic compression** involves compressing assets on-the-fly as they get
requested by the browser.

#### Pros
* Creating and updating saved compressed versions of assets does not need to be
  done.
* Compressing on-the-fly works especially well for web pages that are
  dynamically generated.

#### Cons
+  Compressing files at higher levels to achieve better compression ratios takes
   longer. This can cause a performance hit as the user waits for assets to
   compress before they are sent by the server.

#### Dynamic compression with Node/Express

The `server.js` file is responsible for setting up the Node server that hosts
the application.

```js
var express = require('express');

var app = express();

app.use(express.static('public'));

var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
```

All this currently does is import `express` and use the `express.static`
middleware to load all the static HTML, JS and CSS files in the
`public/directory` (and those files are created by webpack with every build).

To make sure all of the assets are compressed using brotli every time they're
requested, the [`shrink-ray`](https://github.com/aickin/shrink-ray#readme)
module can be used. Begin by adding it as a `devDependency` in `package.json`:

```json/2
"devDependencies": {
  //...
  "shrink-ray": "^0.1.3"
},
```

And import it into the server file, `server.js`:

```js/1
var express = require('express');
var shrinkRay = require('shrink-ray');
```

And add it as a middleware before `express.static` is mounted:

```js/6
//...
var app = express();

app.use(express.static('public'));

// compress all requests
app.use(shrinkRay());
```

Now reload the app, and take a look at the bundle size in the Network panel:

{% Img src="image/admin/KXDWBC6aH4o6MVJvBu8X.png", alt="Bundle size with dynamic Brotli compression", width="724", height="97", class="w-screenshot" %}

You can now see `brotli` is applied from `bz` in the `Content-Encoding` header.
`main.bundle.js` is reduced from **225 KB to 53.1 KB**! This is ~14% smaller
compared to `gzip` (61.6 KB).

{% Aside %}
Brotli has eleven quality levels  from `0` (no compression) to
`9` (maximum compression). A quality of `1` is very fast
but less effective, whereas a quality setting of `11` is very slow
but provides big savings in file size. Note that unlike the standard brotli
library, which defaults to quality `11`, `shrink-ray`
defaults to quality `4`, which is generally more appropriate for
dynamic content. You can adjust the parameters of the brotli algorithm by
passing in an `options` parameters to
`shrinkRay([options])`.
{% endAside %}

### Static compression

The idea behind static compression is to have assets compressed and saved ahead
of time.

#### Pros
+  Latency due to high compression levels is not a concern anymore. Nothing
   needs to happen on-the-fly to compress files as they can now be fetched
   directly.

#### Cons
+  Assets need to compressed with every build. Build times can increase
   significantly if high compression levels are used.

#### Static compression with Node/Express and webpack

Since **static compression** involves compressing files ahead of time, webpack
settings can be modified to compress assets as part of the build step. The
`brotli-webpack-plugin` can be used for this.

Begin by adding it as a `devDependency` in `package.json`:

```js/2
"devDependencies": {
  //...
 "brotli-webpack-plugin": "^1.1.0"
},
```

Like any other webpack plugin, import it in the configurations file,
`webpack.config.js`:

```js/3
var path = require("path");

//...
var BrotliPlugin = require('brotli-webpack-plugin');
```

And include it within the plugins array:

<pre>
module.exports = {
  // ...
  plugins: [
    // ...
    <strong>new BrotliPlugin({
      asset: '[file].br',
      test: /\.(js)$/
    })</strong>
  ]
},
</pre>

The following arguments are used in the plugin array:
+  `asset`: The target asset name.
+  `[file]` is replaced with the original asset file name
+  `test`: All assets that match this RegExp (i.e. javascript assets ending in
   `.js`) are processed

For example, `main.js` would be renamed to `main.js.br`.

When the app reloads and rebuilds, a compressed version of the main bundle is
now created. Open the Glitch Console to take a look at what's inside the final
`public/` directory that's served by the Node server.

1. Click the **Tools** button.
1. Click the **Console** button.
1. In the console, run the following commands to change into the `public`
   directory and see all of its files:

```bash
cd public
ls -lh
```

{% Img src="image/admin/GOlRrAhdDWO7yi7Bm1Pg.png", alt="Bundle size with static Brotli compression", width="489", height="133", class="w-screenshot" %}

The brotli compressed version of the bundle, `main.bundle.js.br`, is now saved
here as well and is **~76% smaller in size** (225 KB vs. 53 KB) than
`main.bundle.js`.

Next, tell the server to send these brotli-compressed files whenever their
original JS versions are being requested. This can be done by defining a new
route in `server.js` before the files are served with `express.static`.

<pre>
var express = require('express');

var app = express();

<strong>app.get('*.js', (req, res, next) => {
  req.url = req.url + '.br';
  res.set('Content-Encoding', 'br');
  res.set('Content-Type', 'application/javascript; charset=UTF-8');
  next();
});</strong>

app.use(express.static('public'));
</pre>

`app.get` is used to tell the server how to respond to a `GET` request for a
specific endpoint. A callback function is then used to define how to handle this
request. The route works like this:
+ Specifying `'*.js'` as the first argument means that this works for every
  endpoint that is fired to fetch a JS file.
+ Within the callback, `.br` is attached to the URL of the request and the
  `Content-Encoding` response header is set to `br`.
+ The `Content-Type` header is set to `application/javascript; charset=UTF-8` to
  specify the MIME type.
+ Finally, `next()` ensures that the sequence continues to any callback that may
  be next.

Because some browsers may not support brotli compression, confirm brotli is
supported before returning the brotli-compressed file by checking the
`Accept-Encoding` request header includes `br`:

```js/5,10
var express = require('express');

var app = express();

app.get('*.js', (req, res, next) => {
  if (req.header('Accept-Encoding').includes('br')) {
    req.url = req.url + '.br';
    console.log(req.header('Accept-Encoding'));
    res.set('Content-Encoding', 'br');
    res.set('Content-Type', 'application/javascript; charset=UTF-8');
  }
  next();
});

app.use(express.static('public'));
```


Once the app reloads, take a look at the Network panel once more.

{% Img src="image/admin/2rJrkqLzWt3MT4XxNsYn.png", alt="Bundle size of 53.1 KB (from 225KB)", width="724", height="97", class="w-screenshot" %}

Success! You have used Brotli compression to further compress your assets!

## Conclusion

This codelab illustrated how `brotli` can further reduce your app's overall
size. Where supported, `brotli` is a more powerful compression algorithm than
`gzip`.

{% Aside 'warning' %}
Remember to check if your CDN supports `brotli` before manually
implementing. If you need to implement `brotli` manually (as
described in this codelab) but have CDN support for other compression algorithms
such as `gzip`, it is a good idea to weigh the benefits of
`brotli` against the effort required to implement.
{% endAside %}
