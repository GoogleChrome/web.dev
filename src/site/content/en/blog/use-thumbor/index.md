---
title: Optimize images with Thumbor
subhead: Thumbor can be used for free to resize, compress, and transform images on-demand.
authors:
  - katiehempenius
date: 2019-09-23
hero: image/admin/yNqbzg2R9PIkqTfywZSw.jpg
alt: A pile of photos.
description: |
  Instructions on how to optimize images with Thumbor. Thumbor is an open-source image CDN and can be used for free to resize, compress, and transform images.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - images
---

[Thumbor](http://thumbor.org/) is a free, open source image CDN that makes it easy to compress, resize, and transform images. This post lets you try out Thumbor firsthand without needing to install anything. We've set up a sandbox Thumbor server for you to try out at `http://34.67.235.246:8888`. The image that you're going to experiment with is available at <a href="http://34.67.235.246:8888/unsafe/https://web.dev/backdrop-filter/hero.jpg" target="_blank" rel="noreferrer noopener">http://34.67.235.246:8888/unsafe/https://web.dev/backdrop-filter/hero.jpg</a>.


## Prequisites

This post assumes that you understand how image CDNs can improve your load performance. If not, check out [Use image CDNs to optimize images](/image-cdns). It also assumes that you've built basic websites before.

{% Aside %}

If you would like to install Thumbor on your own server and then follow along with this post, check out [How to install the Thumbor image CDN](/install-thumbor). Whenever you see `http://34.67.235.246:8888` in this post you'll need to replace that origin with your Thumbor instance's origin.

{% endAside %}


## Thumbor URL Format

As mentioned in [Use Image CDNs to Optimize Images](/image-cdns), each image CDN uses a slightly different URL format for images. Figure 1 represents Thumbor's format.

<figure class="w-figure">
  {% Img src="image/admin/lo1hS8qn53XCztrlgvl7.jpg", alt="A Thumbor URL has the following components: origin, security key, size, filters and image.", width="800", height="89", class="w-screenshot" %}
  <figcaption>Thumbor's URL format</figcaption>
</figure>


### Origin

Like all [origins](https://html.spec.whatwg.org/multipage/origin.html#concept-origin), the origin of a Thumbor URL is composed of three parts: a [scheme](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Definition) (which is almost always `http` or `https`), a host, and a port. In this example, the host is identified using an IP address, but if you're using a DNS server it might look like `thumbor-server.my-site.com`. By default, Thumbor uses port `8888` to serve images.


### Security Key

The `unsafe` part of the URL indicates that you're using Thumbor without a security key. A security key prevents a user from making unauthorized changes to your image URLs. By changing the image URL, a user could use your server (and your hosting bill) to resize their images, or, more maliciously, to overload your server. This guide won't cover setting up [Thumbor's security key feature](https://github.com/thumbor/thumbor/wiki/security).


### Size

This part of the URL specifies the desired size of the output image. This can be omitted if you don't want to change the size of the image. Thumbor will use different approaches like cropping or scaling to achieve the desired size depending on the other URL parameters. The next section of this post explains how to resize images in more detail.

Try it now:

1. Click the following URL to view the image served at its original size in a new tab: <a href="http://34.67.235.246:8888/unsafe/https://web.dev/backdrop-filter/hero.jpg" target="_blank" rel="noreferrer">http://34.67.235.246:8888/unsafe/https://web.dev/backdrop-filter/hero.jpg</a>

    <figure class="w-figure">
      {% Img src="image/admin/R2Xp5XxJi4CFGjXlPx4X.jpg", alt="Image at original size", width="800", height="500", class="w-screenshot" %}
      <figcaption>Original image</figcaption>
    </figure>

2. Resize the image to 100x100 pixels: <a href="http://34.67.235.246:8888/unsafe/100x100/https://web.dev/backdrop-filter/hero.jpg" target="_blank" rel="noreferrer">http://34.67.235.246:8888/unsafe/100x100/https://web.dev/backdrop-filter/hero.jpg</a>

<figure class="w-figure">
  {% Img src="image/admin/QXf1r4Ov6gXDtbrcmLWZ.jpg", alt="Image at 100x100 pixels", width="800", height="505", class="w-screenshot" %}
  <figcaption>Image resized to 100x100 pixels</figcaption>
</figure>


### Filters

Filters transform an image. The filters part of the URL segment starts with `filters:` followed by a colon-separated list of filters; this can be omitted if you are not using any filters. The syntax for individual filters resembles a function call (for example `grayscale()`) containing zero or more arguments.

Try it now:

1. Apply a single filter: a Gaussian [blur](https://thumbor.readthedocs.io/en/latest/blur.html) effect with a radius of 25 pixels: <a href="http://34.67.235.246:8888/unsafe/filters:blur(25)/https://web.dev/backdrop-filter/hero.jpg" target="_blank" rel="noreferrer">http://34.67.235.246:8888/unsafe/filters:blur(25)/https://web.dev/backdrop-filter/hero.jpg</a>

    <figure class="w-figure">
      {% Img src="image/admin/e5zG6ghl8IADjEKMGBzf.jpg", alt="Blurred image", width="800", height="505", class="w-screenshot" %}
      <figcaption>Blurred image</figcaption>
    </figure>


2. Apply multiple filter. Convert to [grayscale](https://thumbor.readthedocs.io/en/latest/grayscale.html) and [rotate](https://thumbor.readthedocs.io/en/latest/rotate.html) the image 90 degrees: <a href="http://34.67.235.246:8888/unsafe/filters:grayscale():blur(90)/https://web.dev/backdrop-filter/hero.jpg" target="_blank" rel="noreferrer">http://34.67.235.246:8888/unsafe/filters:grayscale():blur(90)/https://web.dev/backdrop-filter/hero.jpg</a>

<figure class="w-figure">
  {% Img src="image/admin/U9atnYPla5L93UmVx9di.jpg", alt="Grayscale image that has been rotated 90 degrees", width="800", height="505", class="w-screenshot" %}
  <figcaption>Grayscale, rotated image</figcaption>
</figure>



## Transforming Images

This section focuses on the Thumbor functionalities most relevant to performance: compression, resizing, and conversion between file formats.


### Compression

The [quality](https://thumbor.readthedocs.io/en/latest/quality.html) filter compresses JPEG images to the desired image quality level (1-100). If no quality level is provided, Thumbor compresses the image to a quality level of 80. This is a good default: quality levels 80-85 typically have little noticeable effect on image quality, but usually decrease image size by 30-40%.

Try it now:

1. Compress the image to a quality of 1 (very bad): <a href="http://34.67.235.246:8888/unsafe/filters:quality(1)/https://web.dev/backdrop-filter/hero.jpg" target="_blank" rel="noreferrer">http://34.67.235.246:8888/unsafe/filters:quality(1)/https://web.dev/backdrop-filter/hero.jpg</a>

    <figure class="w-figure">
      {% Img src="image/admin/DyC3mcwd1vn0Xnv7GUco.jpg", alt="Low-quality image", width="800", height="505", class="w-screenshot" %}
      <figcaption>Low-quality image</figcaption>
    </figure>

2. Compress the image using Thumbor's default compression settings: <a href="http://34.67.235.246:8888/unsafe/filters:quality()/https://web.dev/backdrop-filter/hero.jpg" target="_blank" rel="noreferrer">http://34.67.235.246:8888/unsafe/filters:quality()/https://web.dev/backdrop-filter/hero.jpg</a>

<figure class="w-figure">
  {% Img src="image/admin/vOZpDiHEPMTQOEZ3YG7e.jpg", alt="Compressed image with no noticible quality issues", width="800", height="505", class="w-screenshot" %}
  <figcaption>Compressed image</figcaption>
</figure>

### Resizing

To resize an image while maintaining its original proportions use the format `$WIDTHx0` or `0x$HEIGHT` within the `size` portion of the URL string.

Try it now:

1. Resize the image to a width of 200 pixels while maintaining original proportions: <a href="http://34.67.235.246:8888/unsafe/200x0/https://web.dev/backdrop-filter/hero.jpg" target="_blank" rel="noreferrer">http://34.67.235.246:8888/unsafe/200x0/https://web.dev/backdrop-filter/hero.jpg</a>

    <!-- lint disable code-block-style -->
    <figure class="w-figure">
      {% Img src="image/admin/afo1UErx1tzpBz5mO0nQ.jpg", alt="Image that is 200 pixels wide", width="800", height="505", class="w-screenshot" %}
      <figcaption>Image resized to a width of 200 pixels</figcaption>
    </figure>


2. Resize the image to a height of 500 pixels while maintaining original proportion: <a href="http://34.67.235.246:8888/unsafe/0x500/https://web.dev/backdrop-filter/hero.jpg" target="_blank" rel="noreferrer">http://34.67.235.246:8888/unsafe/0x500/https://web.dev/backdrop-filter/hero.jpg</a>

<figure class="w-figure">
  {% Img src="image/admin/ln4jTuQjlK8DDsutTH9i.jpg", alt="Image that is 500 pixels tall", width="800", height="505", class="w-screenshot" %}
  <figcaption>Image resized to a height of 500 pixels<figcaption>
</figure>



You can also resize images to a percentage of the original by using the [proportion](https://thumbor.readthedocs.io/en/latest/proportion.html) filter. If size is specified in conjunction with the proportion filter, the image will be resized, and then the proportion filter will be applied.

Try it now:

1. Resize the image to 50% of the original: <a href="http://34.67.235.246:8888/unsafe/filters:proportion(.5)/https://web.dev/backdrop-filter/hero.jpg" target="_blank" rel="noreferrer">http://34.67.235.246:8888/unsafe/filters:proportion(.5)/https://web.dev/backdrop-filter/hero.jpg</a>

    <figure class="w-figure">
      {% Img src="image/admin/KmAi5ht9IUiFPkyu6zjA.jpg", alt="Image that is 50% the size of the original", width="800", height="505", class="w-screenshot" %}
      <figcaption>Image resized to 50% the size of the original</figcaption>
    </figure>


2. Resize the image to a width of 1000 pixels, then resize the image to 10% of its current size: <a href="http://34.67.235.246:8888/unsafe/1000x/filters:proportion(.1)/https://web.dev/backdrop-filter/hero.jpg" target="_blank" rel="noreferrer">http://34.67.235.246:8888/unsafe/1000x/filters:proportion(.1)/https://web.dev/backdrop-filter/hero.jpg</a>

<figure class="w-figure">
  {% Img src="image/admin/F4jHvji47nFA7RiVdsAF.jpg", alt="Image that is 100 pixels wide", width="800", height="505", class="w-screenshot" %}
  <figcaption>Image resized to a width of 100 pixels</figcaption>
</figure>


These methods are just a few of Thumbor's many cropping and resizing options. To read about other options, check out [Usage](https://github.com/thumbor/thumbor/wiki/Usage).


### File Formats

The [format](https://thumbor.readthedocs.io/en/latest/format.html) filter converts images to `jpeg`, `webp`, `gif`, or `png`. Keep in mind that if you're optimizing for performance you should [use either JPEG or WebP](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization) as PNG and GIF files tend to be significantly larger and do not compress as well.

Try it now:

1. Convert the image to WebP. If you open the **Network** panel of DevTools the document's **Content-Type response header** shows that the server returned a WebP image: <a href="http://34.67.235.246:8888/unsafe/filters:format(webp)/https://web.dev/backdrop-filter/hero.jpg" target="_blank" rel="noreferrer">http://34.67.235.246:8888/unsafe/filters:format(webp)/https://web.dev/backdrop-filter/hero.jpg</a>

<figure class="w-figure">
  {% Img src="image/admin/78Jp9l7N0gUQtiuxbNSn.jpg", alt="DevTools screenshot showing the content-type (WebP) of an image", width="800", height="469", class="w-screenshot" %}
  <figcaption>The <code>content-type</code> response header shown in DevTools</figcaption>
</figure>


## Next Steps

Try out other [filters](https://thumbor.readthedocs.io/en/latest/filters.html) and transformations on the `hero.jpg` image.

If you're following along using your own Thumbor installation, check out the appendix below that explains how and why to use the `thumbor.conf` file.


## Appendix: `thumbor.conf`

Many of the configuration options discussed in this post, plus many others, can be established as defaults by setting up and using a `thumbor.conf` configuration file. Settings in the `thumbor.conf` file will be applied to all images unless overridden by the URL string parameters.

1. Run the `thumbor-config` command to create a new `thumbor.conf` file.

    ```bash
    thumbor-config > ./thumbor.conf
    ```

2. Open your new `thumbor.conf` file. The `thumbor-config` command generated a file that lists and explains all Thumbor configuration options.

3. Configure settings by uncommenting lines and changing the default values.
You may find it useful to set the following settings:
    <!-- lint disable no-inline-padding -->
    * `QUALITY`
    * `AUTO_WEBP`
    * `MAX_WIDTH` and `MAX_HEIGHT`
    * `ALLOW_ANIMATED_GIFS`

4. Run Thumbor with the `--conf` flag to use your `thumbor.conf` settings.

    ```bash
    thumbor --conf /path/to/thumbor.conf
    ```
