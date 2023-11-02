---
layout: post
title: Use Imagemin to compress images
authors:
  - katiehempenius
date: 2018-11-05
updated: 2020-08-24
description: |
  Uncompressed images bloat your pages with unnecessary bytes. Run Lighthouse to
  check for opportunities to improve page load by compressing images.
codelabs:
  - codelab-imagemin-webpack
  - codelab-imagemin-gulp
  - codelab-imagemin-grunt
tags:
  - performance
  - web-vitals
---

## Why should you care?

Uncompressed images bloat your pages with unnecessary bytes. Because images can be [candidates for Largest Contentful Paint (LCP)](/lcp/#what-elements-are-considered), those unnecessary bytes can add unnecessary [resource load time](/optimize-lcp/#3-reduce-resource-load-time), which can result in longer LCP times.

The photo on the right is 40% smaller than the one on the left, yet would probably look identical to the average user.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>
          <p>{% Img src="image/admin/LRE2JJAuShXTjQF5ZSaR.jpg", alt="", width="376", height="250" %}</p>
          20 KB
        </th>
        <th>
          <p>{% Img src="image/admin/u9hncwN4TsT7zw2ObU10.jpg", alt="", width="376", height="250" %}</p>
          12 KB
        </th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>

## Measure

Run Lighthouse to check for opportunities to improve page load by compressing images.
These opportunities are listed under "Efficiently encode images":

{% Img src="image/admin/LnIukPEZHuVJwBtuJ7mc.png", alt="image", width="800", height="552" %}

{% Aside %}
Lighthouse currently reports on opportunities to compress images in JPEG format
only.
{% endAside %}

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

<div class="table-wrapper">
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
        <td>
          <a href="https://www.npmjs.com/package/imagemin-mozjpeg"
            >imagemin-mozjpeg</a
          >
        </td>
        <td>
          <a href="https://www.npmjs.com/package/imagemin-jpegtran"
            >imagemin-jpegtran</a
          >
        </td>
      </tr>
      <tr>
        <td>PNG</td>
        <td>
          <a href="https://www.npmjs.com/package/imagemin-pngquant"
            >imagemin-pngquant</a
          >
        </td>
        <td>
          <a href="https://www.npmjs.com/package/imagemin-optipng"
            >imagemin-optipng</a
          >
        </td>
      </tr>
      <tr>
        <td>GIF</td>
        <td>
          <a href="https://www.npmjs.com/package/imagemin-giflossy"
            >imagemin-giflossy</a
          >
        </td>
        <td>
          <a href="https://www.npmjs.com/package/imagemin-gifsicle"
            >imagemin-gifsicle</a
          >
        </td>
      </tr>
      <tr>
        <td>SVG</td>
        <td>
          <a href="https://www.npmjs.com/package/imagemin-svgo">imagemin-svgo</a>
        </td>
        <td></td>
      </tr>
      <tr>
        <td>WebP</td>
        <td>
          <a href="https://www.npmjs.com/package/imagemin-webp">imagemin-webp</a>
        </td>
        <td>
          <a href="https://www.npmjs.com/package/imagemin-webp">imagemin-webp</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>

### Imagemin CLI

The Imagemin CLI works with 5 different plugins: imagemin-gifsicle,
imagemin-jpegtran, imagemin-optipng, imagemin-pngquant, and imagemin-svgo.
Imagemin uses the appropriate plugin based on the image format of the
input.

To compress the images in the "images/" directory and save them to the same
directory, run the following command (overwrites the original files):

```bash
$ imagemin images/* --out-dir=images
```

### Imagemin npm module

If you use one of these build tools,
checkout the codelabs for Imagemin with
[webpack](/codelab-imagemin-webpack), [gulp](/codelab-imagemin-gulp),
or [grunt](/codelab-imagemin-grunt).

You can also use Imagemin by itself as a Node script.
This code uses the "imagemin-mozjpeg" plugin to compress JPEG files to a quality
of 50 ('0' being the worst; '100' being the best):

```js
import imageminMozjpeg from 'imagemin-mozjpeg';
import imagemin from 'imagemin';
(async () => {
    try {
        const files = await imagemin(
            ['source_dir/*.jpg', 'another_dir/*.jpg'],
            {
                destination: 'destination_dir',
                plugins: [imageminMozjpeg({ quality: 50 })]
            }
        );
        console.log(files);
    } catch (error) {
        console.log({ error })
    }
})();
```
