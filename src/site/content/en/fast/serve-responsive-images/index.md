---
layout: post
title: Serve responsive images
authors:
  - katiehempenius
description: |
  Serving desktop-sized images to mobile devices can use 2–4x more data than
  needed. Instead of a "one-size-fits-all" approach to images, serve different
  image sizes to different devices.
date: 2018-11-05
codelabs:
  - codelab-specifying-multiple-slot-widths
  - codelab-art-direction
  - codelab-density-descriptors
tags:
  - performance
---

Serving desktop-sized images to mobile devices can use 2–4x more data than
needed. Instead of a "one-size-fits-all" approach to images, serve different
image sizes to different devices.

## Resize images

Two of the most popular image resizing tools are the [sharp npm
package](https://www.npmjs.com/package/sharp) and the [ImageMagick CLI
tool](https://www.imagemagick.org/script/index.php).

The sharp package is a good choice for automating image resizing (for example,
generating multiple sizes of thumbnails for all the videos on your website). It
is fast and easily integrated with build scripts and tools. On the other hand,
ImageMagick is convenient for one-off image resizing because it is used entirely
from the command line.

### sharp

To use sharp as a Node script, save this code as a separate script in your project,
and then run it to convert your images:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const directory = './images';

fs.readdirSync(directory).forEach(file => {
  sharp(`${directory}/${file}`)
    .resize(200, 100) // width, height
    .toFile(`${directory}/${file}-small.jpg`);
  });
```

### ImageMagick

To resize an image to 33% of its original size, run the following command in
your terminal:

```bash
convert -resize 33% flower.jpg flower-small.jpg
```

To resize an image to fit within 300px wide by 200px high, run the following command:

```bash
# macOS/Linux
convert flower.jpg -resize 300x200 flower-small.jpg

# Windows
magick convert flower.jpg -resize 300x200 flower-small.jpg
```

### How many image versions should you create?

There is no single "correct" answer to this question. However, it's common to
serve 3-5 different sizes of an image. Serving more image sizes is better for
performance, but will take up more space on your servers and require writing a
tiny bit more HTML.

### Other options

Image services like [Thumbor](https://github.com/thumbor/thumbor) (open-source)
and [Cloudinary](https://cloudinary.com/) are also worth checking out. Image
services provide responsive images (and image manipulation) on-demand. Thumbor
is setup by installing it on a server; Cloudinary takes care of these details
for you and requires no server setup. Both are easy ways to create responsive
images.

## Serve multiple image versions

Specify multiple image versions and the browser will choose the best one to
use:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th><strong>Before</strong></th>
        <th><strong>After</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          &lt;img src="flower-large.jpg"&gt;
        </td>
        <td>
          &lt;img src="flower-large.jpg" srcset="flower-small.jpg 480w,
          flower-large.jpg 1080w" sizes="50vw"&gt;
        </td>
      </tr>
    </tbody>
  </table>
</div>


The `<img>` tag's
[`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-src),
[`srcset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset),
and
[`sizes`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes)
attributes all interact to achieve this end result.

### The "src" attribute

The src attribute makes this code work for browsers that don't
[support](https://caniuse.com/#search=srcset) the `srcset` and `sizes`
attributes. If a browser does not support these attributes, it will fall back to
loading the resource specified by the `src` attribute.

{% Aside 'gotchas' %}
The resource specified by the `src` attribute should be large enough to work
well on all device sizes.
{% endAside %}

### The "srcset" attribute

The `srcset` attribute is a comma-separated list of image filenames and their
width or density descriptors.

This example uses
[width descriptors](https://www.w3.org/TR/html5/semantics-embedded-content.html#width-descriptor).
`480w` is a width descriptor tells the browser that `flower-small.jpg` is
480px wide; `1080w` is a width descriptor tells the browser that
`flower-large.jpg` is 1080px wide.

"Width descriptor" sounds fancy but is just a way to tell the browser the width
of an image. This saves the browser from needing to download the image to
determine its size.

{% Aside 'gotchas' %}
Use the `w` unit (instead of `px`) to write width descriptors. For example, a
1024px wide image would be written as `1024w`.
{% endAside %}

**Extra Credit:**
You don't need to know about density descriptors to serve different image sizes.
However, if you're curious about how density descriptors work, check out the
[Resolution Switching code lab](/codelab-density-descriptors).
Density descriptors are used to serve different images based on the_ device's
[pixel density](https://en.wikipedia.org/wiki/Pixel_density).

### The "sizes" attribute

The sizes attribute tells the browser how wide the image will be when it is
displayed. However, the sizes attribute has no effect on display size; you
still need CSS for that.

The browser uses this information, along with what it knows about the user's
device (i.e. its dimensions and pixel density), to determine which image to
load.

If a browser does not recognize the "`sizes`" attribute, it will fallback to
loading the image specified by the "`src`" attribute. (Browsers shipped support
for the "`sizes`" and "`srcset`" attributes at the same time, so a browser will
either support both attributes or neither.)

{% Aside 'gotchas' %}
Slot width can be specified using a variety of units. The following are all
valid sizes:

- `100px`
- `33vw`
- `20em`
- `calc(50vw-10px)`

The following is not a valid size:

+  `25%` (percentages cannot be used with the sizes attribute)
{% endAside %}

**Extra Credit:**
If you want to be fancy, you can also use the sizes attribute to specify
multiple slot sizes. This accommodates websites that use different layouts for
different viewport sizes. Check out this [multiple slot code sample](/codelab-specifying-multiple-slot-widths)
to learn how to do this.

### (Even more) Extra Credit

In addition to all the extra credit already listed (images are complex!), you
can also use these same concepts for
[art direction](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction).
Art direction is the practice of serving completely different looking images
(rather than different versions of the same image) to different viewports. You
can learn more in the [Art Direction code lab](/codelab-art-direction).

## Verify

Once you've implemented responsive images, you can use Lighthouse to make sure
that you didn't miss any images. Run the Lighthouse Performance Audit
(**Lighthouse > Options > Performance**) and look for the results of the
**Properly size images** audit. These results will list the images that need to
be resized.
