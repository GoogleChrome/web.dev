---
layout: post
title: Deploying AVIF for more responsive websites
subhead: |
  An update on how AVIF has been adopted in the ecosystem.
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/VTbul8MN3pUxggkYsc6F.jpg
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/vnBIBHxxooLvRszJMG3b.jpg
alt: A close-up photograph of pixels on an LCD display.
authors:
  - jhuoponen
  - vignesh
description: |
  An overview of how AVIF is adopted in the ecosystem, and what kind of performance and quality benefits developers can expect from AVIF for still images and animations.
date: 2023-05-24
tags:
  - blog
  - performance
  - images
---

[AVIF](https://aomedia.org/avif/) is a new image format that is quickly gaining popularity on the web because of its high compression rates, efficient performance, and broad adoption. AVIF is an open, royalty-free image format that is based on the AV1 video codec standardized by the Alliance for Open Media. This blog post will provide an overview of how AVIF is adopted in the ecosystem, and what kind of performance and quality benefits developers can expect from AVIF for still images and animations.

## What’s new with the AVIF ecosystem?

Since the introduction of AVIF in Chrome, Firefox and Safari, usage of AVIF on the web has been growing steadily; [almost all browsers](https://caniuse.com/avif) support AVIF today.

In Chrome alone, AVIF usage grew to approximately one percent in a little over a year after Chrome added AVIF support in stable.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/QunCznNR5EJf8lp4rGNe.png", alt="A line graph of AVIF usage in Chrome from May 2021 to March 2023. Support has steadily grown from 0% to just beneath 1.4%.", width="800", height="367" %}
</figure>

A number of image CDNs, such as [Akamai](https://techdocs.akamai.com/ivm/changelog/apr-07-2021-new-policy-filters-and-avif-image-format), [Cloudflare](https://blog.cloudflare.com/images-avif-blur-bundle/), [Cloudinary](https://cloudinary.com/blog/how_to_adopt_avif_for_images_with_cloudinary) and [Imgix](https://blog.imgix.com/2021/10/27/avif-limited-availability) are serving AVIF images today. In a [blog post](https://blog.imgix.com/2021/10/27/avif-limited-availability) announcing AVIF support, Imgix reported 60% file size savings compared to JPEG and 35% savings compared to WebP. These file size savings lead to significant storage savings, but also help pages load faster, yielding faster [Largest Contentful Paint (LCP)](/lcp/) times. LCP is one of the [Core Web Vitals](/learn-core-web-vitals/), and represents how quickly the largest block of content on the page has loaded. Using modern codecs to compress images is one of the [key techniques](/optimize-lcp/) to reduce LCP. [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) is a great Chrome developer tool for testing your web site and to see [how much savings AVIF would bring](https://developer.chrome.com/en/docs/lighthouse/performance/uses-webp-images/).

WordPress is the [most popular](https://www.wpbeginner.com/beginners-guide/ultimate-list-of-wordpress-stats-facts-and-other-research/) website platform in the world, and there are number of plugins available for developers to convert their images to AVIF, such as:

- [AutoOptimize](https://wordpress.org/plugins/autoptimize/)
- [Converted for Media](https://wordpress.org/plugins/webp-converter-for-media/)
- [EWWW Image Optimizer](https://ewww.io/)
- [Optimole](https://optimole.com/)
- [ShortPixel Image Optimizer](https://shortpixel.com/)

For more hands-on developers, tools like [ImageMagick](https://imagemagick.org/index.php) and [FFmpeg](https://ffmpeg.org/) are a good starting point.

## AVIF encode speed

Fast encoding speed and high visual quality are critical for deploying image compression at scale. AVIF software encoding speed has improved significantly over the past two years. Compared to other modern still image formats, AVIF produces smaller files with similar visual quality (see the following graph, lower is better) but is also [faster to encode](https://storage.googleapis.com/avif-comparison/subset1.html).

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/bmoOLQMWjYTQzWK8hPE8.png", alt="A bar chart comparing various image codec file sizes as a percentage of the output of TurboJPEG. AVIF is lowest, then JPEG XL, then WebP, and finally MozJPEG.", width="800", height="415" %}
</figure>

The chart below (higher is better) illustrates how AVIF encoding speed compares to other image formats. Previous generation codecs like WebP benefit from the less complex (but also less efficient) compression algorithms. With a multi-threaded encoding scheme, AVIF achieves similar performance for common use cases while delivering significant compression gains.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/FSzUG4d4ixJQytow1WNU.png", alt="A comparison of image codec encoding speed. The compared encoders are average AVIF, average JPEG XL, average WebP (one thread), and average MozJPEG (one thread). AVIF is generally one of the fastest image encoders in terms of best quality and default effort, but is the slowest of all encoders for on-the-fly performance.", width="800", height="433" %}
</figure>

For developers interested in more detailed encoding speed and visual quality comparisons, the [Image Coding Comparisons](https://storage.googleapis.com/avif-comparison/index.html) site contains reproducible benchmark results.

While software implementations for modern image codecs like AVIF and WebP are optimized for x86 and ARM processors architectures, compressing vast amounts of images at scale can be computationally expensive. One alternative to reduce compression costs is to explore hardware acceleration. [Bluedot](https://www.blue-dot.io/) has developed a hardware accelerated Pulsar-AVIF encoder running on programmable FPGAs, such as AMD's Alveo U250. Compared to software based avifenc, Pulsar-AVIF delivers a 7 to 23 times speed improvement with similar [compression efficiency](https://www.blue-dot.io/avif-speed-quality-benchmark/).

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Encoder</th>
        <th>Encode time (ms)</th>
        <th>Frames per second</th>
        <th>CPU utilization</th>
        <th>Hardware specification</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          Pulsar-AVIF<br>
          (FPGA)
        </td>
        <td>60</td>
        <td>409.85</td>
        <td>305%</td>
        <td>
          AMD Alveo U250 1ea + Intel(R) Xeon(R)<br>
          Platinum 8171 CPU at 2.6GHz, 10 cores
        </td>
      </tr>
      <tr>
        <td>
          avifenc<br>
          (libaom)
        </td>
        <td>405</td>
        <td>59.26</td>
        <td>3200%</td>
        <td>
          Intel(R) Xeon(R) Platinum 8370C CPU at<br>
          2.8GHz, 32 cores
        </td>
      </tr>
      <tr>
        <td>
          avifenc<br>
          (SVT-AV1)
        </td>
        <td>1325</td>
        <td>18.11</td>
        <td>3200%</td>
        <td>
          Intel(R) Xeon(R) Platinum 8370C CPU at<br>
          2.8GHz, 32 cores
        </td>
      </tr>
    </tbody>
    <caption>
      AVIF encode speed comparison<br>
      <ul>
        <li>Test set: Kodak (24 images of 768x512)</li>
        <li>Encoding 24 images simultaneously (24 processes)</li>
        <li>Each software encoding process is executed with 4 threads. (-j 4)</li>
      </ul>
    </caption>
  </table>
</div>

Developers can deploy Pulsar-AVIF encoder with cloud virtual machines, such as [Azure NP-Series](https://learn.microsoft.com/en-us/azure/virtual-machines/np-series).

## AVIF features for responsive web pages

AVIF has a few interesting features that will help to deliver more responsive web pages. This time we’ll dive a bit into animated AVIFs, which are by far the most efficient way of delivering cool animations on the web.

### Animated AVIF

Animated [GIF](https://en.wikipedia.org/wiki/GIF) is still [a popular format](https://almanac.httparchive.org/en/2022/media#gifs-animated-and-not) for animated images, despite being 35 years old. Biggest drawbacks of animated GIFs are the support for 256 colors only and poor compression leading to very large file sizes while also limiting the resolution or frame rate for practical use cases. In contrast, animated AVIF coding is actually the same as AV1 video coding scheme which provides significant file size savings compared to animated GIF.

We ran a simple benchmark where we encoded a set of animated GIFs to both AVIF and JPEG XL. Over the test set, median file size savings percentage was approximately 86% compared to original GIF files and about 73% compared to animated JPEG XL files*.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ltmx3lsTIyqiVcRAaYXL.png", alt="A comparison of animated image codec performance. AVIF outperforms GIF and JPEG XL in terms of both average and median file size.", width="600", height="371" %}
  <figcaption>
    * libavif and libjxl versions: libavif version 4cff6a3 (libaom version v3.5.0), libjxl version 176b1c03. Test set: 15 sample GIFs from <a href="https://commons.wikimedia.org/wiki/Category:Animated_GIF_files." rel="noopener">Wikipedia</a>.
  </figcaption>
</figure>

Chrome, Firefox and Safari all support animated AVIF playbacks.

FFmpeg is one tool to use for creating animated AVIF files, here’s a basic example of converting a GIF to AVIF using FFmpeg:

```bash
ffmpeg -i "$INPUT_GIF" -crf $CRF -b:v 0 "$OUTPUT.avif"
```

`$CRF` is the desired output quality on a scale of `0` to `63`. Lower values mean better quality and greater file size. `0` uses [lossless compression](https://en.wikipedia.org/wiki/Lossless_compression). Start with a value of `23` for small animated AVIF files.

FFmpeg uses libaom by default for encoding AVIF images, but it can also use [rav1e](https://github.com/xiph/rav1e) or [SVT-AV1](https://gitlab.com/AOMediaCodec/SVT-AV1) when available. More information about encoder choices, tuning the encoding parameters for speed/quality trade-offs can be found in [FFmpeg's AV1 encoding guide](https://trac.ffmpeg.org/wiki/Encode/AV1).

Another use case is to repackage an AV1 video into AVIF without re-encoding the original file. This is significantly cheaper than decoding/encoding the original AV1 file and makes the AV1 video available for use with the `<img>` element. Passing `-c:v copy` to FFmpeg can do this.

```bash
ffmpeg -i "$INPUT_AV1_VIDEO" -c:v copy -an "$OUTPUT.avif"
```

## Conclusions

AVIF use on the web has been steadily increasing since launch and is widely supported by browsers, image CDNs, WordPress plugins and encoding tools. All in all, AVIF is a great choice for serving images on the web; AVIF is fast to encode and decode while providing the best quality or smallest file size, whichever you prefer for your website. AVIF is the most efficient way to deliver animations on the web. If you have questions, comments, or feature requests, please reach out on the [av1-discuss mailing list](https://groups.google.com/a/aomedia.org/g/av1-discuss), [AOM Github community](https://github.com/AOMediaCodec/community/wiki), and [AVIF wiki](https://github.com/AOMediaCodec/av1-avif/wiki).

_Hero image from [Unsplash](https://unsplash.com/photos/oXlXu2qukGE), by [Amal S
](https://unsplash.com/@amal_z7z)._
