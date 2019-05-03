---
title: Replacing a hot path in your app's JavaScript with WebAssembly
subhead: It's consistently fast, yo.
authors: 
  - robdodson
  - megginkearney
date: 2018-12-06
hero: hero.jpg
alt: A description for the hero image
description: |
  This post is a test to demonstrate all of the components that can go into
  an article.
wf_blink_components: Blink>Accessibility
tags:
  - post
  - accessibility
  - ux
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem. Integer et erat ac mi scelerisque suscipit et vitae nulla. Aliquam
scelerisque efficitur ante ut facilisis. Aenean et risus fringilla, hendrerit
sapien et, tincidunt orci. Aenean sed tellus aliquam, consectetur metus in,
tempus enim.

<div class="w-aside w-aside--codelab">
  <strong>Codelab:</strong>
  <a href="#">Using Imagemin with Grunt</a>
</div>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem. Integer et erat ac mi scelerisque suscipit et vitae nulla. Aliquam
scelerisque efficitur ante ut facilisis. Aenean et risus fringilla, hendrerit
sapien et, tincidunt orci. Aenean sed tellus aliquam, consectetur metus in,
tempus enim.

<figure class="w-figure w-figure--fullbleed">
  <img src="a.jpg" alt="">
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    Fig. 1 — Large image.
  </figcaption>
</figure>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

<figure class="w-figure">
  <img src="image-small.png" alt="" style="max-width: 400px;">
  <figcaption class="w-figcaption">
    Fig. 2 — Small image.
  </figcaption>
</figure>

<div class="w-aside w-aside--note">
  Lorem ipsum dolor sit amet,
  <a href="#">consectetur adipiscing elit</a>. Proin dictum a massa sit
  amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh
  varius at. <code>Cras ligula lacus</code>, porta vitae maximus a,
  ultrices a mauris. <a href="#"><code>Vestibulum porta</code></a> dolor
  erat, vel molestie dolor posuere in. Nam vel elementum augue.
</div>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

## Image, Inline

<figure class="w-figure w-figure--inline-right">
  <img class="w-screenshot" src="image-inline.png" alt="" style="max-width: 200px;">
  <figcaption class="w-figcaption">
    Fig. 3 — Inline right, outlined image.
  </figcaption>
</figure>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum
a massa sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh
varius at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris.
Vestibulum porta dolor erat, vel molestie dolor posuere in. Nam vel elementum
augue. Nam quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce
aliquet urna ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet
velit. Morbi at quam sem.

<figure class="w-figure w-figure--inline-left">
  <img class="w-screenshot" src="image-inline.png" alt="" style="max-width: 200px;">
  <figcaption class="w-figcaption">
    Fig. 4 — Inline left, outlined image.
  </figcaption>
</figure>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum
a massa sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh
varius at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris.
Vestibulum porta dolor erat, vel molestie dolor posuere in. Nam vel elementum
augue. Nam quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce
aliquet urna ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet
velit. Morbi at quam sem.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="image-screenshot.png" alt="">
  <figcaption class="w-figcaption">
    Fig. 5 — Filled screenshot.
  </figcaption>
</figure>

<div class="w-aside w-aside--caution">
  <strong>Caution:</strong>
  <a href="#">This type of callout</a> suggests proceeding with caution.
</div>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

<div class="w-table-wrapper">
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
        <td><a href="#">imagemin-mozjpeg</a></td>
        <td><a href="#">imagemin-jpegtran</a></td>
      </tr>
      <tr>
        <td>PNG</td>
        <td><a href="#">imagemin-pngquant</a></td>
        <td><a href="#">imagemin-optipng</a></td>
      </tr>
      <tr>
        <td>GIF</td>
        <td><a href="#">imagemin-giflossy</a></td>
        <td><a href="#">imagemin-gifsicle</a></td>
      </tr>
      <tr>
        <td>SVG</td>
        <td><a href="#">Imagemin-svgo</a></td>
        <td></td>
      </tr>
      <tr>
        <td>WebP</td>
        <td><a href="#">imagemin-webp</a></td>
        <td></td>
      </tr>
    </tbody>
    <caption>Table 1 — Imagemin plugins for filetypes.</caption>
  </table>
</div>

<div class="w-aside w-aside--warning">
  <strong>Warning:</strong>
  This type of callout is stronger than a Caution; it means "Don't do
  this."
</div>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

## Ordered list

1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

<ol>
  <li>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
  sit amet ullamcorper.
  </li>
  <li>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
  sit amet ullamcorper.
  <figure class="w-figure">
    <img class="w-screenshot w-screenshot--filled" src="image-screenshot.png" alt="">
    <figcaption class="w-figcaption">
      Fig. 5 — Filled screenshot.
    </figcaption>
  </figure>
  </li>
  <li>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
  sit amet ullamcorper.
  </li>
</ol>

<div class="w-aside w-aside--success">
  <strong>Success:</strong>
  This type of callout describes a successful action or an error-free
  status.
</div>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

## Unordered list

- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

<ul>
  <li>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
  sit amet ullamcorper.
  </li>
  <li>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
  sit amet ullamcorper.
  <figure class="w-figure">
    <img class="w-screenshot w-screenshot--filled" src="image-screenshot.png" alt="">
    <figcaption class="w-figcaption">
      Fig. 5 — Filled screenshot.
    </figcaption>
  </figure>
  </li>
  <li>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
  sit amet ullamcorper.
  </li>
</ul>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

```js
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");

(async () => {
  const files = await imagemin(
    ["source_dir/*.jpg", "another_dir/*.jpg"],
    "destination_dir",
    { plugins: [imageminMozjpeg({ quality: 50 })] }
  );
  console.log(files);
})();
```

<div class="w-aside w-aside--objective">
  <strong>Objective:</strong>
  This type of callout defines the goal of a procedure.
</div>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris.

<div class="w-aside w-aside--gotchas">
  <strong>Gotchas!</strong>
  <p>
    The value of the <code>type</code> attribute should be the MIME type
    corresponding to the image format. An image's MIME type and its file
    extension are often similar, but they aren't necessarily the same
    thing (e.g. <code>.jpg</code> vs. <code>image/jpeg</code>).
  </p>
</div>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

<blockquote class="w-blockquote">
  <p class="w-blockquote__text">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum
    a massa sit amet ullamcorper.
  </p>
  <cite class="w-blockquote__cite">
    by Jon Doe
  </cite>
</blockquote>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    allow="geolocation; microphone; camera; midi; encrypted-media"
    src="https://glitch.com/embed/#!/embed/fav-kitties-starter?path=src/index.js&amp;previewSize=0"
    alt="fav-kitties-starter on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

<div class="w-aside w-aside--key-term">
  <strong>Key Term:</strong>
  This type of callout defines important terminology.
</div>

<!-- TODO (robdodson): Need to add w-tabs -->

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">30<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Lower cost per conversion</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">13<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Higher CTR</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">4<sub class="w-stat__sub">x</sub></p>
    <p class="w-stat__desc">Faster load times</p>
  </div>
</div>

<div class="w-text--center">
  <a href="https://example.com/some.pdf" class="w-button w-button--with-icon" data-icon="file_download">
    Download case study 
  </a>
</div>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

<!-- TODO (robdodson): Add recommended/not recommended -->