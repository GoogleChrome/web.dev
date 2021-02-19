---
title: Image policies for fast load times and more
subhead: Use optimized image policies to ensure your site is using the best performing images.
authors:
  - lunalu
date: 2019-05-31
codelabs:
  - codelab-serve-images-webp
hero: image/admin/OHtpn2oJuumNzReNNI6f.jpg
alt: A description of the hero image for screen reader users.
description: |
  Images take up a significant amount of visual space and make up the
  majority of the downloaded bytes on a website. Use the new feature
  policies to identify oversized images.
tags:
  - blog
  - images
  - origin-trials
---

Images often take up a significant amount of visual space and make up the
majority of the downloaded bytes on a website. Optimizing images can improve
loading performance and reduce network traffic.

Surprisingly, more than half of the sites on the web are serving poorly
compressed or unnecessarily large images. This leaves a lot of room for
performance improvements simply by optimizing the images.

You may ask, how do I know if my images are optimized and how should I optimize
them? We are experimenting with a new set of feature policies for image
optimization: `oversized-images`, `unoptimized-lossy-images`,
`unoptimized-lossless-images`, and`unoptimized-lossless-images-strict`.
All are now available for [origin
trials](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md).

## Optimized image policies

Feature policy is introducing a new set restrictions on images that can be
applied with development-time enforcement. Images violating any of the
restrictions will be rendered as placeholder images, which are easy to identify
and fix. These policies can be specified in report-only mode where images will
render normally without enforcement while violations are being observed via
reports. (See [Report-only mode in the wild](#report-only-mode-in-the-wild),
below for details.)

### oversized-images

The `oversized-images` feature policy restricts the intrinsic dimensions
of an image in relation to its container size.

When a document uses the `oversized-images` policy, any `<img>` element
whose intrinsic resolution is more than X times larger than the container size
in either dimension will be replaced with a placeholder image.

#### Why?

Serving images larger than what the viewing device can render&mdash;for example,
serving desktop images to mobile contexts, or serving high-pixel-density images
to a low-pixel-density device&mdash;is wasting network traffic and device
memory. Read [Serve images with correct dimensions](/serve-images-with-correct-dimensions/)
and [Serve responsive images](/serve-responsive-images/)
for information on optimizing your images.

#### Examples

A few examples illustrate this. The following shows the default behavior when cutting an image's display size in half.

<figure class="w-figure">
  {% Img src="image/admin/QR01OUN3VXTbOhhSOZBz.png", alt="The default resizing behavior.", width="326", height="401" %}
  <figcaption class="w-figcaption">The default resizing behavior.</figcaption>
</figure>

If I apply the following feature policy, I get a placeholder image instead.

`Feature-Policy: oversized-images *(2);`

<figure class="w-figure">
  {% Img src="image/admin/NErIMVS4qsSVHek2UtDZ.png", alt="When the image is too large for the container.", width="326", height="401" %}
  <figcaption class="w-figcaption">When the image is too large for the container.</figcaption>
</figure>

I get similar results if I lower only the width or the height.

<figure class="w-figure">
  {% Img src="image/admin/S11HV1w6uqkXq6GDRKVx.png", alt="Resized width", width="326", height="401" %}
  {% Img src="image/admin/dMPfyFsJ5qexNSj0Q8Ia.png", alt="Resized height", width="326", height="401" %}
  <figcaption class="w-figcaption">
    Resize width and height.
  </figcaption>
</figure>

#### How to use

To summarize, `oversized-images` policy can be specified through either:

- `Feature-Policy` HTTP header
- `<iframe>` `allow` attribute

To declare the `oversized-images` policy, you need to provide:

- The feature name, `oversized-images` (Required)
- A list of origins (Optional)
- The threshold values (i.e., the downscaling ratio X) for the origins, specified in
  parenthesis (Optional)

We recommend a downscaling ratio of 2.0 or lower. Consider using
[responsive images](/serve-responsive-images/) with different resolutions to
best serve images on various screen sizes, resolutions, and so on.

#### More examples

`Feature-Policy: oversized-images *(2.0)`

The policy is enforced on all origins with a threshold value of 2.0. Any
`<img>` element with an image whose downscaling ratio that is greater than
2.0 is disallowed and will be replaced with a placeholder image.

`Feature-Policy: oversized-images *(inf) 'self'(1.5)`

The policy is enforced on the site's origin with a threshold value of 1.5.
`<img>` elements in top-level browsing contexts and same origin nested
browsing contexts will only render normally if the downscaling ratio is less
than or equal to 1.5. `<img>` elements everywhere else will render normally.

### unoptimized-{lossy,lossless}-images

The `unoptimized-lossy-images`, `unoptimized-lossless-images`,
`unoptimized-lossless-images-strict` feature policies restrict the file
size of an image in relation to its intrinsic resolution:

<dl>
  <dt><code>unoptimized-lossy-images</code></dt>
  <dd>Lossy formats should not exceed a byte-per-pixel ratio of X, with a fixed <strong>1KB</strong> overhead allowance. For a W x H image, the file size threshold is calculated as W x H x X + 1024.</dd>
  <dt><code>unoptimized-lossless-images</code></dt>
  <dd>Lossless formats should not exceed a byte-per-pixel ratio of X, with a fixed <strong>10KB</strong> overhead allowance. For a W x H image, the file size threshold is calculated as W x H x X + 10240.</dd>
  <dt><code>unoptimized-lossless-images-strict</code></dt>
  <dd>Lossless formats should not exceed a byte-per-pixel ratio of X, with a fixed <strong>1KB</strong> overhead allowance. For a W x H image, the file size threshold is calculated as W x H x X + 1024.</dd>
</dl>

When a document uses any of these policies, any `<img>` element violating
the constraint will be replaced with a placeholder image.

#### Why?

The larger the download size is, the longer it takes for an image to load. The
file size should be kept as small as possible when optimizing an image:
stripping metadata, picking a good image format, using image compression, and so on.
Read [Use Imagemin to compress images](/use-imagemin-to-compress-images/) and
[Use WebP images](/serve-images-webp/) for information on
optimizing your images.

#### Example

The following shows the default browser behavior. Without the feature policy an unoptimized lossy image can be displayed just the same as an optimized image.

<figure class="w-figure">
  {% Img src="image/admin/kxabc5874fW5IvPnqR9E.png", alt="Comparing an optimized image with an unoptimized image.", width="326", height="401" %}
  <figcaption class="w-figcaption">Comparing an optimized image with an unoptimized image.</figcaption>
</figure>

If I apply the following feature policy, I get a placeholder image instead.

`Feature-Policy: unoptimized-lossy-images *(0.5);`

<figure class="w-figure">
  {% Img src="image/admin/Y0cCIEuFI1M3DaKfxBkI.png", alt="When the image is not optimized.", width="326", height="401" %}
  <figcaption class="w-figcaption">When the image is not optimized.</figcaption>
</figure>

#### How to use

If you are new to feature policy, please check out [Introduction to Feature
Policy](https://developers.google.com/web/updates/2018/06/feature-policy) for
more details.

To summarize, `unoptimized-{lossy,lossless}-images` policies can be either
specified through:

- `Feature-Policy` HTTP header
- `<iframe>` `allow` attribute

To declare an `unoptimized-{lossy,lossless}-images` policy, you will need to
provide:

- The feature name, for example, `unoptimized-lossy-images` (Required)
- A list of origins (Optional)
- The threshold values (i.e., byte-per-pixel ratio X) for the origins, specified
  in parenthesis (Optional)

We recommend a byte-per-pixel ratio of 0.5 or lower for
`unoptimized-lossy-images` and a byte-per-pixel ratio of 1 or lower for
`unoptimized-lossless-images` and `unoptimized-lossless-images-strict`.

WebP formats have better compression ratios than other formats. Serve all your
images in WebP lossy format if you can. If that is not sufficient, try WebP
lossless format. Use JPEG on browsers that don't support WebP formats. Use PNG
if none of thes formats work.

If you are using WebP formats, try with stricter thresholds:

- 0.2 for WEBPV8
- 0.5 for WEBPL

#### More examples

```text
Feature-Policy:  unoptimized-lossy-images *(0.5);
                 unoptimized-lossless-images *(1.0);
                 unoptimized-lossless-images-strict *(1.0);
```

This policy is enforced on all origins with a threshold value of 0.5 (for lossy
formats) and 1 (for lossless formats). Any `<img>` element whose image has a
byte-per-pixel ratio exceeding the constraint is disallowed and will be replaced
with a placeholder image.

```text
Feature-Policy: unoptimized-lossy-images *(inf) 'self'(0.3);
                unoptimized-lossless-images *(inf) 'self'(0.8);
                unoptimized-lossless-images-strict *(inf) 'self'(0.8);
```

This policy is enforced on the site's origin with a threshold value of 0.3 (for
lossy formats) and 0.8 (for lossless formats). The `<img>` elements in top-level
browsing contexts and same origin nested browsing contexts will only render
normally if the byte-per-pixel ratio meets these constraints. The `<img>` elements
everywhere else will render normally.

### Report-only mode in the wild

Publishing a site with placeholder images may not be what you want. You can use
the policies in enforcement mode (with unoptimized images rendered as
placeholder images) during development and staging, and use report-only mode in
production. (Check out [Feature Policy
Reporting](https://github.com/w3c/webappsec-feature-policy/blob/master/reporting.md)
for more details.) Similar to `Feature-Policy` HTTP header, the
`Feature-Policy-Report-Only` header lets you observe violation reports in the
wild without any enforcement.

### Limitations

Image policies only work on HTML image elements (`<img>`, `<source>`,
etc.) and are not yet supported on background images or generated content. If you
would like to have policies supported on broader contents, please let us know.

## Optimizing your images

I've talked quite a bit about optimizing your images, but haven't said how to do it. That topic is out of scope for this article, but you can learn more from the links below and from the codelabs listed at the end of the article.

- [Optimizing images](/fast#optimize-your-images)
- [Serve images with correct dimensions](/serve-images-with-correct-dimensions/)

## Experiment with the policies in origin trials

Image policies are available in Chrome 75 via an origin trial.

To participate:

1. [request a token](https://developers.chrome.com/origintrials/#/view_trial/2562548187973812225)

1. Add the token on any pages in your origin using an `Origin-Trial` HTTP
   header:<br/>
   <br/>
   `Origin-Trial: **token as provided in the developer console**`

1. Specify an image policy via HTTP header Feature-Policy header:<br/>
   <br/>
   `Feature-Policy: **image policies specified here**`

Check out [Origin Trials Guide for Web
Developers](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)
for more details.

## Please give us feedback

Hopefully this article has given you a good understanding of the image policies
and gotten you excited. We'd really love for you to try out the policies and
give us feedback.

You can give us feedback for each of the features mentioned in this article to
our mailing list: [feature-control@](mailto:feature-control@chromium.org)[chromium.org](mailto:feature-control@chromium.org).

We would love to know what threshold values you used and found useful. We would
love to know whether `unoptimized-lossless-images` or
`unoptimized-lossless-images-strict` is more intuitive and easy to use, or if we
should use a difference overhead allowance instead. We will be sending out a
survey near the end of the trial. Stay tuned!
