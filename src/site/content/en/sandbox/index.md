---
layout: sandbox/article
title: components
---

## Source

To see how to use each component, [view this page's source on GitHub](https://github.com/GoogleChrome/web.dev/blob/master/src/site/content/en/sandbox/index.md).

## Sections

1. [Asides](#asides)
1. [Blockquotes](#blockquotes)
1. [Buttons](#buttons)
1. [Code](#code)
1. [Compare](#compare)
1. [Details](#details)
1. [Glitch](#glitch)
1. [Images](#images)
1. [Lists](#lists)
1. [Stats](#stats)
1. [Tables](#tables)

## Asides

{% Aside 'note' %}
  Lorem ipsum dolor sit amet, [consectetur adipiscing elit](#). Proin dictum a
  massa sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh
  varius at. `Cras ligula lacus`, porta vitae maximus a, ultrices a mauris.
  [`Vestibulum porta`](#) dolor erat, vel molestie dolor posuere in. Nam vel
  elementum augue.
{% endAside %}

{% Aside 'caution' %}
  [This type of callout](#) suggests proceeding with caution.
{% endAside %}

{% Aside 'warning' %}
  This type of callout is stronger than a Caution; it means "Don't do
  this."
{% endAside %}

{% Aside 'success' %}
  This type of callout describes a successful action or an error-free
  status.
{% endAside %}

{% Aside 'objective' %}
  This type of callout defines the goal of a procedure.
{% endAside %}

{% Aside 'gotchas' %}
  The value of the `type` attribute should be the MIME type corresponding to the
  image format. An image's MIME type and its file extension are often similar,
  but they aren't necessarily the same thing (e.g. `.jpg` vs. `image/jpeg`).
{% endAside %}

{% Aside 'key-term' %}
  This type of callout defines important terminology.
{% endAside %}

{% Aside 'codelab' %}
  [Using Imagemin with Grunt](#)
{% endAside %}

## Blockquotes

<blockquote class="w-blockquote">
  <p class="w-blockquote__text">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum
    a massa sit amet ullamcorper.
  </p>
  <cite class="w-blockquote__cite">
    by Jon Doe
  </cite>
</blockquote>

## Buttons

<div>
  <button class="w-button">
    Text button
  </button>
  <button class="w-button w-button--with-icon" data-icon="file_download">
    Text button with icon
  </button>
</div>
<br>

<div>
  <button class="w-button w-button--primary">
    Primary button
  </button>
  <button class="w-button w-button--primary w-button--with-icon" data-icon="file_download">
    Primary button with icon
  </button>
</div>
<br>

<div>
  <button class="w-button w-button--secondary">
    Secondary button
  </button>
  <button class="w-button w-button--secondary w-button--with-icon" data-icon="file_download">
    Secondary button with icon
  </button>
</div>

## Code

The value of the `type` attribute should be the MIME type
corresponding to the image format. An image's MIME type and its file
extension are often similar, but they aren't necessarily the same
thing (e.g. `.jpg` vs. `image/jpeg`).

- The value of the `type` attribute should be the MIME type.
- (e.g. `.jpg` vs. `image/jpeg`)

### Code block

```js
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

### Highlight code

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

### Remove code

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

### Add/Remove code

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

## Compare

```
Bad code example
```

{% Compare 'worse' %}
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
{% endCompare %}

```
Good code example
```

{% Compare 'better' %}
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
{% endCompare %}

### Compare with custom labels

```
Bad code example
```

{% Compare 'worse', 'Not helpful' %}
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
{% endCompare %}

```
Good code example
```

{% Compare 'better', 'Helpful' %}
Lorem ipsum [dolor sit amet](#), consectetur adipiscing elit. Proin dictum a massa
sit amet ullamcorper. `Suspendisse` auctor ultrices ante, nec tempus nibh varius
at.
{% endCompare %}

## Details

<details>
  <summary>Developer tools for Lighthouse</summary>
  <p>
    The browser uses the first listed source that’s in a format it
    supports. If the browser does not support any of the formats.
  </p>
</details>

## Glitch

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/tabindex-zero?path=index.html&previewSize=100&attributionHidden=true"
    alt="tabindex-zero on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Images

<figure class="w-figure w-figure--fullbleed">
  <img src="./a.jpg" alt="">
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    Fig. 1 — Large image.
  </figcaption>
</figure>

<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
  sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
  at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
  porta dolor erat, vel molestie dolor posuere in.
</p>

<figure class="w-figure">
  <img src="./image-small.png" alt="" style="max-width: 400px;">
  <figcaption class="w-figcaption">
    Fig. 2 — Small image.
  </figcaption>
</figure>

<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
  sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
  at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
  porta dolor erat, vel molestie dolor posuere in.
</p>

<figure class="w-figure  w-figure--center">
  <img src="./image-small.png" alt="" style="max-width: 400px;">
  <figcaption class="w-figcaption">
    Fig. 2a — Centered, small image.
  </figcaption>
</figure>

<figure class="w-figure w-figure--inline-right">
  <img class="w-screenshot" src="./image-inline.png" alt="" style="max-width: 200px;">
  <figcaption class="w-figcaption">
    Fig. 3 — Inline right, outlined image.
  </figcaption>
</figure>

<p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a
    massa sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus
    nibh varius at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris.
    Vestibulum porta dolor erat, vel molestie dolor posuere in. Nam vel
    elementum augue. Nam quis enim blandit, posuere justo dignissim, scelerisque
    diam. Fusce aliquet urna ac blandit ullamcorper. Proin et semper nibh, sit
    amet imperdiet velit. Morbi at quam sem. Lorem ipsum dolor sit amet,
    consectetur adipiscing elit. Proin dictum a massa sit amet ullamcorper.
    Suspendisse auctor ultrices ante, nec tempus nibh varius at. Cras ligula
    lacus, porta vitae maximus a, ultrices a mauris. Vestibulum porta dolor
    erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam quis enim
    blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna ac
    blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi
    at quam sem.
</p>

<figure class="w-figure w-figure--inline-left">
  <img class="w-screenshot" src="./image-inline.png" alt="" style="max-width: 200px;">
  <figcaption class="w-figcaption">
    Fig. 4 — Inline left, outlined image.
  </figcaption>
</figure>

<p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a
    massa sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus
    nibh varius at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris.
    Vestibulum porta dolor erat, vel molestie dolor posuere in. Nam vel
    elementum augue. Nam quis enim blandit, posuere justo dignissim, scelerisque
    diam. Fusce aliquet urna ac blandit ullamcorper. Proin et semper nibh, sit
    amet imperdiet velit. Morbi at quam sem. Lorem ipsum dolor sit amet,
    consectetur adipiscing elit. Proin dictum a massa sit amet ullamcorper.
    Suspendisse auctor ultrices ante, nec tempus nibh varius at. Cras ligula
    lacus, porta vitae maximus a, ultrices a mauris. Vestibulum porta dolor
    erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam quis enim
    blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna ac
    blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi
    at quam sem.
</p>

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./image-screenshot.png" alt="">
  <figcaption class="w-figcaption">
    Fig. 5 — Filled screenshot.
  </figcaption>
</figure>

<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
  sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius
  at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum
  porta dolor erat, vel molestie dolor posuere in.
</p>

<figure class="w-figure">
  <img class="w-screenshot" src="./img2.png" alt="">
  <figcaption class="w-figcaption">
    Fig. 5 — Regular screenshot.
  </figcaption>
</figure>

## Lists

### Ordered list

1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
   sit amet ullamcorper.
1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
   sit amet ullamcorper.
  <figure class="w-figure">
    <img class="w-screenshot w-screenshot--filled" src="./image-screenshot.png" alt="">
    <figcaption class="w-figcaption">
      Fig. 5 — Filled screenshot.
    </figcaption>
  </figure>
1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
   sit amet ullamcorper.

### Unordered list

- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
  sit amet ullamcorper.
- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa
  sit amet ullamcorper.

## Stats

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


Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt, numquam
laboriosam reprehenderit aliquam possimus natus magnam nulla illo blanditiis
corporis nam sed, velit fugiat dolorum placeat. Odio, aut nisi. Fuga!

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">30<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Lower cost per conversion</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">13<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Higher CTR</p>
  </div>
</div>


Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt, numquam
laboriosam reprehenderit aliquam possimus natus magnam nulla illo blanditiis
corporis nam sed, velit fugiat dolorum placeat. Odio, aut nisi. Fuga!

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">30<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Lower cost per conversion</p>
  </div>
</div>

## Tables

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

<p>
Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim necessitatibus
incidunt harum reprehenderit laboriosam labore consequuntur quod. Doloribus,
deleniti! Atque aliquam facilis labore odio similique provident illo culpa
assumenda perspiciatis.
</p>

<div class="w-table-wrapper">
  <table>
    <caption>
      Table 2 — Desktop analysis of doggos.io
    </caption>
    <tbody>
      <tr>
        <th>Desktop</th>
        <th>FCP</th>
        <th>TTI</th>
      </tr>
      <tr>
        <td>Homepage</td>
        <td>1,680 ms</td>
        <td>5,550 ms</td>
      </tr>
      <tr>
        <td>Results page</td>
        <td>2,060 ms</td>
        <td>6,690 ms</td>
      </tr>
    </tbody>
  </table>
</div>

<p>
Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim necessitatibus
incidunt harum reprehenderit laboriosam labore consequuntur quod. Doloribus,
deleniti! Atque aliquam facilis labore odio similique provident illo culpa
assumenda perspiciatis.
</p>

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Before</th>
        <th>After</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>@font-face {
  font-family: Helvetica;
}
</code>
        </td>
        <td><code>@font-face {
  font-family: Helvetica;
  <strong>font-display: swap;</strong>
}
</code>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<p>
Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim necessitatibus
incidunt harum reprehenderit laboriosam labore consequuntur quod. Doloribus,
deleniti! Atque aliquam facilis labore odio similique provident illo culpa
assumenda perspiciatis.
</p>

<div class="w-table-wrapper">
  <table>
    <tbody>
      <tr>
        <th>Network</th>
        <th>Device</th>
        <th>JS</th>
        <th>Images</th>
        <th>CSS</th>
        <th>HTML</th>
        <th>Fonts</th>
        <th>Total</th>
        <th>Time to Interactive budget</th>
      </tr>
      <tr>
        <td>Slow 3G</td>
        <td>Moto G4</td>
        <td>100</td>
        <td>30</td>
        <td>10</td>
        <td>10</td>
        <td>20</td>
        <td>~170 KB</td>
        <td>5s</td>
      </tr>
      <tr>
        <td>Slow 4G</td>
        <td>Moto G4</td>
        <td>200</td>
        <td>50</td>
        <td>35</td>
        <td>30</td>
        <td>30</td>
        <td>~345 KB</td>
        <td>3s</td>
      </tr>
      <tr>
        <td>WiFi</td>
        <td>Desktop</td>
        <td>300</td>
        <td>250</td>
        <td>50</td>
        <td>50</td>
        <td>100</td>
        <td>~750 KB</td>
        <td>2s</td>
      </tr>
    </tbody>
  </table>
</div>

<p>
Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim necessitatibus
incidunt harum reprehenderit laboriosam labore consequuntur quod. Doloribus,
deleniti! Atque aliquam facilis labore odio similique provident illo culpa
assumenda perspiciatis.
</p>

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th><strong>Property</strong></th>
        <th><strong>Use</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
        <code><strong>short_name</strong></code> (required)
        </td>
        <td>
          Short human-readable name for the application. This is intended for when
          there is insufficient space to display the full name of the web
          application, like device homescreens.
        </td>
      </tr>
      <tr>
        <td><code><strong>name</strong></code> (required)</td>
        <td>Human-readable name for the site when displayed to the user.</td>
      </tr>
      <tr>
        <td><code><strong>description</strong></code> (recommended)</td>
        <td>General description of what the PWA does.</td>
      </tr>
      <tr>
        <td><code><strong>icons</strong></code> (required)</td>
        <td>
          An array of image files that can serve as application icons. Chrome
          requires a 192x192px and a 512x512px icon. Additional sizes are
          optional, and recommended for those who want to ensure pixel perfect
          icons.
        </td>
      </tr>
      <tr>
        <td><code><strong>start_url</strong></code> (required)</td>
        <td>
          The URL that loads when a user launches the application. This has to be
          a relative URL, relative to the manifest url.
        </td>
      </tr>
      <tr>
        <td><code><strong>background_color</strong></code> (recommended)</td>
        <td>
          The background color used on the auto-generated splash screen when the
          PWA is launched.
        </td>
      </tr>
      <tr>
        <td><code><strong>display</strong></code> (required)</td>
        <td>The developers' preferred display mode for the PWA.</td>
      </tr>
      <tr>
        <td><code><strong>scope</strong></code> (recommended)</td>
        <td>
          The navigation scope of this website's context. This restricts what web
          pages can be viewed while the manifest is applied. If the user navigates
          outside the scope, it returns to a normal web page inside a browser
          tab/window.
        </td>
      </tr>
      <tr>
        <td><code><strong>theme_color</strong></code> (recommended)</td>
        <td>
          The default theme color for an application. This affects how the OS
          displays the site. <br>
          <ol>
            <li>
              On Android's task switcher, the theme color surrounds the site.
            </li>
            <li>On desktop, the theme color is used to style the title bar.</li>
          </ol>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Dicta nam possimus doloribus minima repellendus!
          <ul>
            <li>
              On Android's task switcher, the theme color surrounds the site.
            </li>
            <li>On desktop, the theme color is used to style the title bar.</li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>