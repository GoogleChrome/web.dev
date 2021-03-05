---
layout: codelab
title: Minify and compress network payloads with gzip
authors:
  - houssein
description: |
  In this codelab, learn how both minifying and compressing the JavaScript
  bundle for an application improves page performance by reducing the app's
  request size.
date: 2018-04-24
glitch: fav-kitties-compress-starter
related_post: reduce-network-payloads-using-text-compression
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

This codelab explores how both minifying and compressing the JavaScript
bundle for the following application improves page performance by reducing
the app's request size.

{% Img src="image/admin/Ga0pUShY7cQ0BDAPgPuh.png", alt="App screenshot", width="800", height="535" %}

## Measure

{% Aside %}
 Since webpack is used in this application, any changes made to the code will
 trigger a new build which can take a few seconds. Once it completes, you should
 see your changes reflected in the application.
{% endAside %}

Before diving in to add optimizations, it's always a good idea to first analyze
the current state of the application.

{% Instruction 'preview' %}

This app, which was also covered in the ["Remove unused
code"](/remove-unused-code) codelab, lets you vote for your favorite
kitten. 🐈

Now take a look at how large this application is:

{% Instruction 'devtools-network', 'ol' %}
{% Instruction 'disable-cache', 'ol' %}
{% Instruction 'reload-app', 'ol' %}

{% Img src="image/admin/Zzm8kiE2W29yGEZC7C2u.png", alt="Original bundle size in Network panel", width="800", height="186", class="w-screenshot" %}

Although a lot of progress was made in the ["Remove unused code"](/remove-unused-code)
codelab to trim this bundle size down, 225 KB is still quite large.

## Minification

Consider the following block of code.

```js
function soNice() {
  let counter = 0;

  while (counter < 100) {
    console.log('nice');
    counter++;
  }
}
```

If this function is saved in a file of its own, the file size is around
**112 B (bytes).**

If all whitespace is removed, the resulting code looks like this:

```js
function soNice(){let counter=0;while(counter<100){console.log("nice");counter++;}}
```

The file size would now be around 83 B. If it gets further mangled by reducing
the length of variable name and modifying some expressions, the final code may
end up looking like this:

```js
function soNice(){for(let i=0;i<100;)console.log("nice"),i++}
```

The file size now reaches **62 B**.

With each step, the code is becoming harder to read. However, the browser's
JavaScript engine interprets each of these in the exact same way. The
benefit of obfuscating code in this manner can help achieve smaller file
sizes. 112 B really was not much to begin with, but there was still a 50%
reduction in size!

In this application, [webpack](https://webpack.js.org/) version 4 is used as a
module bundler. The specific version can be seen in `package.json`.

```json/2
"devDependencies": {
  //...
  "webpack": "^4.16.4",
  //...
}
```

Version 4 already minifies the bundle by default during production mode. It uses
`TerserWebpackPlugin` a plugin for [Terser](https://github.com/terser-js/terser).
Terser is a popular tool used to compress JavaScript code.

To get an idea of what the minified code looks like, go ahead and click
`main.bundle.js` while still in the DevTools **Network** panel. Now click the
**Response** tab.

{% Img src="image/admin/uti2q15O2MtiEsegYoV9.png", alt="Minified response", width="800", height="249", class="w-screenshot" %}

The code in its final form, minified and mangled, is shown in the response body.
To find out how large the bundle may have been if it was not minified, open
`webpack.config.js` and update the `mode` configuration.

```js/2/1
module.exports = {
  mode: 'production',
  mode: 'none',
  //...
```

Reload the application and take a look at the bundle size again through the
DevTools **Network** panel

{% Img src="image/admin/H0lINRmM2gF6NHnzmkGM.png", alt="Bundle size of 767 KB", width="700", height="129", class="w-screenshot" %}

That's a pretty big difference! 😅

Make sure to revert the changes here before continuing.

```js/1/2
module.exports = {
  mode: 'production',
  mode: 'none',
  //...
```

Including a process to minify code in your application depends on the tools
that you use:

+ If webpack v4 or greater is used, no additional work needs to be done
since code is minified by default in production mode. 👍
+ If an older version of webpack is used, install and include `TerserWebpackPlugin`
into the webpack build process. The [documentation](https://webpack.js.org/plugins/terser-webpack-plugin/)
explains this in detail.
+ Other minification plugins also exist and can be used instead,
such as [BabelMinifyWebpackPlugin](https://github.com/webpack-contrib/babel-minify-webpack-plugin)
and [ClosureCompilerPlugin](https://github.com/roman01la/webpack-closure-compiler).
+ If a module bundler is not being used at all, use [Terser](https://github.com/terser-js/terser)
as a CLI tool or include it directly as a dependency.

## Compression

{% Aside 'warning' %}
Many hosting platforms, CDNs and reverse proxy servers either encode
assets with compression by default or allow you to easily configure them. This
means that you may rarely ever need to set up your server similar to how it is
done in the compression section of this tutorial, but you can continue to read
if you are interested in learning how compression works.
{% endAside %}

Although the term "compression" is sometimes loosely used to explain how code is
reduced during the minification process, it isn't actually compressed in the
literal sense.

**Compression** usually refers to code that has been modified using a data
compression algorithm. Unlike minification which ends up providing perfectly
valid code, compressed code needs to be _decompressed_ before being used.

With every HTTP request and response, browsers and web servers can add
[headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) to include
additional information about the asset being fetched or received. This can be
seen in the `Headers` tab within the DevTools Network panel where three types
are shown:

+ **General** represents general headers relevant to the entire request-response
  interaction.
+ **Response Headers** shows a list of headers specific to the actual response
  from the server.
+ **Request Headers** shows a list of headers attached to the request by the
  client.

Take a look at the `accept-encoding` header in the `Request Headers`.

{% Img src="image/admin/shmaD9cmjjFMITKL0TAW.png", alt="Accept encoding header", width="800", height="361", class="w-screenshot" %}

`accept-encoding` is used by the browser to specify which content
encoding formats, or compression algorithms, it supports. There are many
text-compression algorithms out there, but there are only three that are
supported here for the compression (and decompression) of HTTP network requests:

* [Gzip](https://www.gzip.org/) (`gzip`): The most widely used compression
format for server and client interactions. It builds on top of the Deflate
algorithm and is supported in all current browsers.
* Deflate (`deflate`): Not commonly used.
* [Brotli](https://github.com/google/brotli) (`br`): A newer compression
algorithm that aims to further improve compression ratios, which can result in
even faster page loads. It is supported in the
[latest versions of most browsers](https://caniuse.com/#feat=brotli).

The sample application in this tutorial is identical to the app completed in the
["Remove unused code"](/remove-unused-code) codelab except for the fact that
[Express](https://expressjs.com/) is now used as a server framework. In the next
few sections, both static and dynamic compression is explored.

## Dynamic compression

**Dynamic** compression involves compressing assets on-the-fly as they get
requested by the browser.

### Pros

+ Creating and updating saved compressed versions of assets does not need to be
done.
+ Compressing on-the-fly works especially well for web pages that are
dynamically generated.

### Cons

+ Compressing files at higher levels to achieve better compression ratios
takes longer. This can cause a performance hit as the user waits for assets to
compress before they are sent by the server.

### Dynamic compression with Node/Express

The `server.js` file is responsible for setting up the Node server that hosts
the application.

```js
const express = require('express');

const app = express();

app.use(express.static('public'));

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
```

All this currently does is import `express` and use the `express.static`
middleware to load all the static HTML, JS and CSS files in the
`public/` directory (and those files are created by webpack with every build).

To make sure all of the assets are compressed every time they're requested, the
[compression](https://github.com/expressjs/compression) middleware library can
be used. Begin by adding it as a `devDependency` in `package.json`:

```json/2
"devDependencies": {
  //...
  "compression": "^1.7.3"
},
```

And import it into the server file, `server.js`:

```js/1
const express = require('express');
const compression = require('compression');
```

And add it as a middleware **before** `express.static` is mounted:

```js/4
//...

const app = express();

app.use(compression());

app.use(express.static('public'));

//...
```

Now reload the app and take a look at the bundle size in the **Network** panel.

{% Img src="image/admin/MMtTKWPKfht8RYd8BMYF.png", alt="Bundle size with dynamic compression", width="800", height="161", class="w-screenshot" %}

From 225 KB to 61.6 KB! In the `Response Headers` now, a `content-encoding`
header shows that the server is sending down this file encoded with `gzip`.

{% Img src="image/admin/523FjNSQOK95lGzg0B6D.png", alt="Content encoding header", width="800", height="470", class="w-screenshot" %}

## Static compression

The idea behind **static** compression is to have assets compressed and saved
ahead of time.

### Pros

+ Latency due to high compression levels is not a concern anymore.
Nothing needs to happen on-the-fly to compress files as they can now be fetched directly.

### Cons

+ Assets need to compressed with every build. Build times can increase
significantly if high compression levels are used.

### Static compression with Node/Express and webpack

Since static compression involves compressing files ahead of time, webpack
settings can be modified to compress assets as part of the build step.
[`CompressionPlugin`](https://github.com/webpack-contrib/compression-webpack-plugin)
can be used for this.

Begin by adding it as a `devDependency` in `package.json`:

```json/2
"devDependencies": {
  //...
  "compression-webpack-plugin": "^1.1.11"
},
```

Like any other webpack plugin, import it in the configurations file,
`webpack.config.js:`

```js/4
const path = require("path");

//...

const CompressionPlugin = require("compression-webpack-plugin");
```

And include it within the `plugins` array:

```js/4
module.exports = {
  //...
  plugins: [
    //...
    new CompressionPlugin()
  ]
}
```

By default, the plugin compresses the build files using `gzip`. Take a look
at the [documentation](https://github.com/webpack-contrib/compression-webpack-plugin)
to learn how to add options to use a different algorithm or include/exclude
certain files.

When the app reloads and rebuilds, a compressed version of the main bundle is
now created. Open the Glitch Console to take a look at what's inside the
final `public/` directory that's served by the Node server.

{% Aside %}
The `public/` directory is included in the `.gitignore` file. Directories that
contain build files are usually included here in order to be ignored by Git, and
Glitch also hides these files from the editor tree.
{% endAside %}

+ Click the **Tools** button.
+ Click the **Console** button.
+ In the console, run the following commands to change into the `public`
  directory and see all of its files:

```bash
cd public
ls
```

{% Img src="image/admin/YQwCT87xMfMwWiH63lTS.png", alt="Final outputted files in public directory", width="800", height="188", class="w-screenshot" %}

The gzipped version of the bundle, `main.bundle.js.gz`, is now saved here as
well. `CompressionPlugin` also compresses `index.html` by default.

The next thing that needs to be done is tell the server to send these gzipped
files whenever their original JS versions are being requested. This can be done
by defining a new route in `server.js` before the files are served with
`express.static`.

<pre>
const express = require('express');
const app = express();

<strong>app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});</strong>

app.use(express.static('public'));

//...
</pre>

`app.get` is used to tell the server how to respond to a GET request for a
specific endpoint. A callback function is then used to define how to handle this
request. The route works like this:

+ Specifying `'*.js'` as the first argument means that this works for every
endpoint that is fired to fetch a JS file.
+ Within the callback, `.gz` is attached to the URL of the request and the
`Content-Encoding` response header is set to `gzip`.
+ Finally, `next()` ensures that the sequence continues to any callback
that may be next.

Once the app reloads, take a look at the `Network` panel once more.

{% Img src="image/admin/b7xYRsSdNhWX5Lc8zE51.png", alt="Bundle size reduction with static compression", width="800", height="176", class="w-screenshot" %}

Just like before, a significant reduction in bundle size!

## Conclusion

This codelab covered the process of minifying and compressing source code.
Both these techniques are becoming a default in many of the tools
available today, so it's important to find out whether your toolchain already
supports them or if you should begin applying both processes yourself.
