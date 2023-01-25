---
title: An example blog post used for screenshot testing.
subhead: |
  A catchy subhead that previews the content and is a bit wordy to test what
  happens when a subhead wraps.
description: |
  A description of the article that will appear in search results.
draft: true

# A list of authors. Supports more than one.
authors:
  - robdodson

date: 2019-10-31
# Add an updated date to your post if you edit in the future.
updated: 2020-11-01

# !!! IMPORTANT: If your post does not contain a hero image it will not appear
# on the homepage.
hero: image/admin/t8pdBQKAaLW8lDp4UqfO.jpg
# You can adjust the fit of your hero image with this property.
# Values: contain | cover (default)
# hero_fit: contain

# You can adjust the position of your hero image with this property.
# Values: top | bottom | center (default)
# hero_position: bottom

# You can provide an optional cropping of your hero image to be used as a
# thumbnail. Note the alt text will be the same for both the thumbnail and
# the hero.
# thumbnail: thumbnail.jpg

alt: A description of the hero image for screen reader users.

# You can provide a custom thumbnail and description for social media cards.
# Images should be 1200 x 630.
# If no social thumbnail is provided then the post will attempt to fallback to
# the post's thumbnail or hero from above. It will also reuse the alt.
# social:
#   google:
#     title: A title for Google search card.
#     description: A description for Google search card.
#     thumbnail: google_thumbnail.jpg
#     alt: Provide an alt for your thumbnail.
#   facebook:
#     title: A title for Facebook card.
#     description: A description for Facebook card.
#     thumbnail: facebook_thumbnail.jpg
#     alt: Provide an alt for your thumbnail.
#   twitter:
#     title: A title for Twitter card.
#     description: A description for Twitter card.
#     thumbnail: twitter_thumbnail.jpg
#     alt: Provide an alt for your thumbnail.

tags:
  - blog # blog is a required tag for the article to show up in the blog.
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

{% Aside 'codelab' %}
  [Using Imagemin with Grunt](#)
{% endAside %}

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
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Z77AxApfjYjrUlRWwWdW.jpg", alt="", width="800", height="533" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    Large image.
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
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wBf0W2V9bVA7Clh01Rf7.png", alt="", width="400", height="78" %}
  <figcaption class="w-figcaption">
    Small image.
  </figcaption>
</figure>

{% Aside %}
  Lorem ipsum dolor sit amet, [consectetur adipiscing elit](#). Proin dictum a
  massa sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh
  varius at. `Cras ligula lacus`, porta vitae maximus a, ultrices a mauris.
  [`Vestibulum porta`](#) dolor erat, vel molestie dolor posuere in. Nam vel
  elementum augue.
{% endAside %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

## Image, Inline

<figure class="w-figure w-figure--inline-right">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WHh2eQoyBxylhgPdYOis.png", alt="", width="200", height="306", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Inline right, outlined image.
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
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WHh2eQoyBxylhgPdYOis.png", alt="", width="200", height="306", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Inline left, outlined image.
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
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/V9sy0IErc3V19nrodKb1.png", alt="", width="800", height="475", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    Filled screenshot.
  </figcaption>
</figure>

{% Aside 'caution' %}
  [This type of callout](#) suggests proceeding with caution.
{% endAside %}

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

{% Aside 'warning' %}
  This type of callout is stronger than a Caution; it means "Don't do this."
{% endAside %}

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
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/V9sy0IErc3V19nrodKb1.png", alt="", width="800", height="475", class="w-screenshot w-screenshot--filled" %}
    <figcaption class="w-figcaption">
      Filled screenshot.
    </figcaption>
  </figure>
  </li>
  <li>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
  sit amet ullamcorper.
  </li>
</ol>

{% Aside 'success' %}
  This type of callout describes a successful action or an error-free status.
{% endAside %}

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
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/V9sy0IErc3V19nrodKb1.png", alt="", width="800", height="475", class="w-screenshot w-screenshot--filled" %}
    <figcaption class="w-figcaption">
      Filled screenshot.
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

{% Aside 'objective' %}
  This type of callout defines the goal of a procedure.
{% endAside %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

```js/1
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

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris.

{% Aside 'gotchas' %}
  The value of the `type` attribute should be the MIME type corresponding to the
  image format. An image's MIME type and its file extension are often similar,
  but they aren't necessarily the same thing (e.g. `.jpg` vs. `image/jpeg`).
{% endAside %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

```js//1
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

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

```js/6/5
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async() => {
  const files = await imagemin(
      ['source_dir/*.jpg'],
      ['source_dir/*.jpg', 'another_dir/*.jpg'],
      'destination_dir',
      {plugins: [imageminMozjpeg({quality: 50})]}
  );
  console.log(files);
})();
```

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam
quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna
ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at
quam sem.

<blockquote>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum
    a massa sit amet ullamcorper.
  </p>
  <cite>
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

{% if site.percy %}
<div style="background: aquamarine; width: 400px; height: 400px;">
  Glitch iframe placeholder
</div>
{% else %}
{% Glitch {
  id: 'tabindex-zero',
  path: 'index.html'
} %}
{% endif %}

{% Aside 'key-term' %}
  This type of callout defines important terminology.
{% endAside %}

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
