---
page_type: guide
title: Use Imagemin to compress images
author: khempenius
web_lighthouse:
    - uses-optimized-images
wf_blink_components: N/A
---

# Use Imagemin to compress images

## Why should you care?

Uncompressed images bloat your pages with unnecessary bytes. The photo on the
right is 40% smaller than the one on the left, yet would probably look identical
to the average user. 

<table>
<thead>
<tr>
<th><p><img src=./20kb.jpg width="100%"></p>

20KB</th>
<th><p><img src=./12kb.jpg width="100%"></p>

12KB</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Imagemin

Imagemin is an excellent choice for image compression because it supports a wide
variety of image formats and is easily integrated with build scripts and build
tools. Imagemin is available as both a
[CLI](https://github.com/imagemin/imagemin-cli) and an [npm
module](https://www.npmjs.com/package/imagemin). Generally, the npm module is
the best choice because it offers more configuration options, but the CLI can be
a decent alternative if you want to try Imagemin without touching any code.

### Plugins

Imagemin is built around "plugins." A plugin is an npm package that compresses a
particular image format (e.g. "mozjpeg" compresses JPEGs). Popular image formats
may have multiple plugins to pick from.

The most important thing to consider when choosing a plugin is whether it is
"lossy" or "lossless." In lossless compression, no data is lost. Lossy
compression reduces file size, but at the expense of possibly reducing image
quality. If a plugin doesn't mention whether it is "lossy" or "lossless," you
can tell by its API: if you can specify the image quality of the output, then it
is "lossy."

For most people, lossy plugins are the best choice. They offer significantly
greater filesize savings, and you can customize the compression levels to meet
your needs. The table below lists popular Imagemin plugins. These aren't the only plugins
available, but they'd all be good choices for your project.

<table>
<thead>
<tr>
<th>Image Format</th>
<th>Lossy Plugin(s)</th>
<th>Lossless Plugin(s)</th>
</tr>
</thead>
<tbody>
<tr>
<td>JPEG</td>
<td><a
href="https://www.npmjs.com/package/imagemin-mozjpeg">imagemin-mozjpeg</a></td>
<td><a
href="https://www.npmjs.com/package/imagemin-jpegtran">imagemin-jpegtran</a></td>
</tr>
<tr>
<td>PNG</td>
<td><a
href="https://www.npmjs.com/package/imagemin-pngquant">imagemin-pngquant</a></td>
<td><a
href="https://www.npmjs.com/package/imagemin-optipng">imagemin-optipng</a></td>
</tr>
<tr>
<td>GIF</td>
<td><a
href="https://www.npmjs.com/package/imagemin-giflossy">imagemin-giflossy</a></td>
<td><a
href="https://www.npmjs.com/package/imagemin-gifsicle">imagemin-gifsicle</a></td>
</tr>
<tr>
<td>SVG</td>
<td><a
href="https://www.npmjs.com/package/imagemin-svgo">Imagemin-svgo</a></td>
<td></td>
</tr>
<tr>
<td>WebP</td>
<td><a
href="https://www.npmjs.com/package/imagemin-webp">imagemin-webp</a></td>
<td></td>
</tr>
</tbody>
</table>

### Imagemin CLI

The Imagemin CLI works with 5 different plugins: imagemin-gifsicle,
imagemin-jpegtran, imagemin-optipng, imagemin-pngquant, and imagemin-svgo.
Imagemin uses the appropriate plugin based on the image format of the
input.

To compress the images in the "images/" directory and save them to the same
directory, run the following command (overwrites the original files):  

```
$ imagemin images/* --out-dir=images
```

### Imagemin npm module

If you use one of these build tools,
checkout out the codelabs for Imaginemin with
[Webpack](./codelab-imagine-webpack.md), [Gulp](./codelab-imagine-gulp.md), and
[Grunt](./codelab-imagine-grunt.md).

You can also use Imagemin by itself as a Node script.
This code uses the "imagemin-mozjpeg" plugin to compress JPEG files to a quality
of 50 (‘0' being the word; ‘100' being the best):

```
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async() => {
  const files = await imagemin(
      ['source_dir/*.jpg', 'another_dir/*.jpg'],
      'destination_dir',
      {plugins: [imageminMozjpeg({quality: 50})]}
  );
  console.log(files);
})();
```

