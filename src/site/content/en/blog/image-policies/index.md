---
title: Image policies for fast load times and more
subhead: Use optimized image policies to ensure your site is using the best performing images.
authors:
  - lunalu
date: 2019-05-23
hero: pankaj-patel-721645-unsplash.jpg
alt: A description of the hero image for screen reader users.
description: |
  Images take up a significant amount of visual space and make up the
  majority of the downloaded bytes on a web site. Use the new feature
  policies to identify oversized images.
tags:
  - post
  - images
  - origin-trials
---
Images often take up a significant amount of visual space and make up the
majority of the downloaded bytes on a web site. Optimizing images can improve
loading performance and reduce network traffic.

Surprisingly, more than half of the sites on the web are serving poorly
compressed or unnecessarily large images. This leaves a lot of room for
performance improvements simply by optimizing the images.

You may ask, how do I know if my images are optimized and how should I optimize
them? We are experimenting with a new set of feature policies for image
optimization: `oversized-images` and `unoptimized-{lossy,lossless}-images`.
Both are now available for [origin
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
in either dimension will be replaced with a placeholder image. The 'X' is
specified by the user has has the value 2 in the examples below.

#### Why?

Serving images larger than what the viewing device can render&mdash;for example,
serving desktop images to mobile contexts, or serving high-pixel-density images
to a low-pixel-density device&mdash;is wasting network traffic and device memory.

#### Examples




#### How to use it

If you are new to feature policy, please check out [Introduction to Feature
Policy](https://developers.google.com/web/updates/2018/06/feature-policy) for
more details.

To summarize, `oversized-images` policy can be specified through either:

* `Feature-Policy` HTTP header
* `<iframe>` `allow` attribute

To declare `oversized-images` policy, you need to provide:

* The feature name, `oversized-images` (Required)
* A list of origins (Optional)
* The threshold values (i.e., the downscaling ratio X) for the origins, specified in
  parenthesis (Optional)

We recommend a downscaling ratio of 2.0 or lower. Consider using responsive
images with different resolutions to best serve images on various screen sizes,
resolutions, etc..

##### Examples

`Feature-Policy: oversized-images \*(2.0)`

The policy is enforced on all origins with a threshold value of 2.0. Any
&lt;img&gt; element with an image whose downscaling ratio that is greater than
2.0 is disallowed and will be replaced with a placeholder image.

`Feature-Policy: oversized-images \*(inf) 'self'(1.5)`

The policy is enforced on the site's origin with a threshold value of 1.5.
`<img>` elements in top-level browsing contexts and same origin nested
browsing contexts will only render normally if the downscaling ratio is less
than or equal to 1.5. `<img>` elements everywhere else will render normally
without any enforcement.

### unoptimized-{lossy,lossless}-images
`unoptimized-lossy-images`, `unoptimized-lossless-images`,
`unoptimized-lossless-images-strict` are feature policies that restrict the file
size of an image in relation to its intrinsic resolution:

<dl>
  <dt>`unoptimized-lossy-images` policy</dt>
  <dd><code>&lt;img&gt;</code> elements of lossy formats should not exceed a
byte-per-pixel ratio of X, with a fixed **1KB** overhead allowance. For a W x
H image, the file size threshold is calculated as W x H x X + 1024.</dd>
  <dt>`unoptimized-lossless-images` policy</dt>
  <dd><code>&lt;img&gt;</code> elements of lossless formats should not exceed a
byte-per-pixel ratio of X, with a fixed **10KB** overhead allowance. For a W x
H image, the file size threshold is calculated as W x H x X + 10240.</dd>
  <dt>`unoptimized-lossless-images-strict` policy</dt>
  <dd><code>&lt;img&gt;</code> elements of lossless formats should not exceed a
byte-per-pixel ratio of X, with a fixed **1KB** overhead allowance. For a W x
H image, the file size threshold is calculated as W x H x X + 1024.</dd>
</dl>

When a document uses any of these policies, any `<img>` element violating
the constraint will be replaced with a placeholder image.

#### Why?

The larger the download size is, the longer it takes for an image to load. The
file size should be kept as small as possible when optimizing an image:
stripping metadata, picking a good image format, using image compression, etc.

#### Example

#### How to use?

If you are new to feature policy, please check out [Introduction to Feature
Policy](https://developers.google.com/web/updates/2018/06/feature-policy) for
more details.

To summarize, `unoptimized-{lossy,lossless}-images` policies can be either
specified through:

* `Feature-Policy` HTTP header
* `<iframe>` `allow` attribute

To declare an `unoptimized-{lossy,lossless}-images` policy, you will need to
provide:

* The feature name, for example, `unoptimized-lossy-images` (Required)
* A list of origins (Optional)
* The threshold values (i.e., byte-per-pixel ratio X) for the origins, specified
  in parenthesis (Optional)

We recommend a byte-per-pixel ratio of 0.5 or lower for
`unoptimized-lossy-images` and a byte-per-pixel ratio of 1 or lower for
`unoptimized-lossless-images` and `unoptimized-lossless-images-strict`.

WebP formats have better compression ratios than other formats. Serve all your
images in WebP lossy format if you can. If that is not sufficient, try WebP
lossless format. Use JPEG on browsers that don't support WebP formats. Use PNG
if none of the formats above works.

If you are using WebP formats, try with stricter thresholds: 0.2 for WEBPV8 and
0.5 for WEBPL.

##### Examples

```
Feature-Policy:  unoptimized-lossy-images *(0.5);
                 unoptimized-lossless-images *(1.0);
                 unoptimized-lossless-images-strict *(1.0);
```

This policy is enforced on all origins with a threshold value of 0.5 (for lossy
formats) and 1 (for lossless formats). Any `<img>` element with an image
with a byte-per-pixel ratio exceeding the constraint is disallowed and will be
replaced with a placeholder image.

```
Feature-Policy: unoptimized-lossy-images *(inf) 'self'(0.3);
                unoptimized-lossless-images *(inf) 'self'(0.8);
                unoptimized-lossless-images-strict *(inf) 'self'(0.8);
```

This policy is enforced on the site's origin with a threshold value of 0.3 (for
lossy formats) and 0.8 (for lossless formats). `<img>` elements in top-level
browsing contexts and same origin nested browsing contexts will only render
normally if the byte-per-pixel ratio meets the constraint. `<img>` elements
everywhere else will render normally without any enforcement.

### Report-only mode in the wild

Publishing a site with placeholder images may not be what you want. You can use
the policies in enforcement mode (with unoptimized images rendered as
placeholder images) during development / staging, and use report-only mode in
production. (Check out [Feature Policy
Reporting](https://github.com/w3c/webappsec-feature-policy/blob/master/reporting.md)
for more details.) Similar to `Feature-Policy` HTTP header, you can specify the
image policies in `Feature-Policy-Report-Only` HTTP header to observe violation
reports in the wild without any enforcement.

### Limitations

Image policies only work on HTML image elements (`<img>`, `<source>`,
etc.) and are not yet supported on background images or generated content. If you
would like to have policies supported on broader contents, please let us know!

## Experiment with the policies in origin trials

Image policies are available in Chrome 75 via an origin trial.

To participate, [request a token](https://developers.chrome.com/origintrials/#/view_trial/2562548187973812225):

1. Provide the token on any pages in your origin using an `Origin-Trial` HTTP
  header:

  `Origin-Trial: \*\*token as provided in the developer console\*\*`

1. Specify an image policy via HTTP header Feature-Policy header:

  `Feature-Policy: \*\*image policies specified here\*\*`

Check out  [Origin Trials Guide for Web
Developers](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)
for more details.

## Please give us feedback

Hopefully this article has given you a good understanding of the image policies
and gotten you excited! We'd really love for you to try out the policies and
give us feedback.

You can give us feedback for each of the features mentioned in this article to
our mailing list: [feature-control@](mailto:feature-control@chromium.org)[chromium.org](mailto:feature-control@chromium.org).

We would love to know what threshold values you used and found useful. We would
love to know whether `unoptimized-lossless-images` or
`unoptimized-lossless-images-strict` is more intuitive and easy to use, or if we
should use a difference overhead allowance instead. We will be sending out a
survey near the end of the trials. Stay tuned!
