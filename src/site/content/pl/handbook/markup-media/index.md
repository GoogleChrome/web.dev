---
layout: handbook
title: Images and video
date: 2019-06-26
updated: 2020-06-11
description: |
  Learn how to create the Markdown for images and video for web.dev.
---

This post is about how to format and store images on web.dev. For guidance about how to select or create images to support your writing goals, see the [Use images and video effectively](/handbook/use-media) post.

## General guidelines for all images {: #general }

* Images that appear in a post should live in the same directory as the post's `index.md` file.
* Make sure images are [accessible](/handbook/inclusion-and-accessibility#use-inclusive-images).

## Image format guidelines (JPG, PNG, or SVG) {: #format }

* JPG is usually better than PNG for photos and screenshots because it can be optimized more.
  PNG is good for preserving fine detail but in practice most web.dev images don't need to be
  preserved in fine detail.
* SVG is best for graphics because its file size is usually quite small and it can be infinitely
  scaled.

Source: [Selecting the right image format][format]

## Image sizing guidelines {: #sizing }

* [Hero images](#hero) should be `3200px` wide and `960px` tall.
* [Thumbnail images](#thumbnail) should be `376px` wide and `240px` tall.
* [Body images](#body) should be `800px` at a minimum and `1600px` wide at a maximum.

## Image optimization guidelines {: #optimization }

* Hero images should only be **lightly** optimized with [Squoosh][squoosh].
  Try to reduce the size of the image with no noticeable reduction in quality whatsoever.
  The goal here is to reduce bloat in the web.dev git repository. The web.dev image CDN
  optimizes hero images on the fly, so if you over-optimize with Squoosh, the hero image
  will end up grainy.
* Body images should be strongly optimized with [Squoosh][squoosh] or [TinyPNG][tinypng]
  (which also supports JPG). Body images are not optimized through web.dev's image CDN
  so the main goal here is to keep web.dev pages loading fast.

## Hero images {: #hero }

Add the following code to your post's front matter:

```yaml
---
…
hero: hero.png
alt: A description of the hero. # Also used by the thumbnail (when applicable).
…
---
```

{% Aside 'warning' %}
If your post does not contain a hero image it will not be displayed on the homepage.
{% endAside %}

* Hero images should be `3200px` wide and `960px` tall.
* You can adjust hero image positioning using the 
  [`hero_position`](/handbook/markup-post-codelab/#set-up-the-yaml) front matter field.
* See [Image optimization guidelines](#optimization) for information on how to optimize
  hero images.

## Thumbnail images {: #thumbnail }

Add the following code to your post's front matter:

```yaml
---
…
thumbnail: thumbnail.png
alt: A description of the thumbnail. # Also used by the hero.
…
---
```

* When a post is displayed on the home page or the blog it can contain a thumbnail.
* Thumbnails should be `376px` wide and `240px` tall.
* If you don't provide a thumbnail, the post will attempt to reuse the hero image.
* If there is no hero image, the post will omit the thumbnail entirely.

## Body images {: #body }

* Images intended to fill the full width of the content column should be `800px` wide at a minimum,
  and `1600px` wide at a maximum (to account for screens that use 2x resolution).

### Standalone images

Use Markdown syntax:

```markdown
![alt text](./image-name.png)
```

### Images with captions

Use a `<figure>` tag. Make sure the `w-figure` class is applied to the `<figure>` element
and the `w-figcaption` class is applied to the `<figcaption>` element.

```html
<figure class="w-figure">
  <img src="./a.jpg" alt="An office with two people working at a table.">
  <figcaption class="w-figcaption">A standard image.</figcaption>
</figure>
```

<figure class="w-figure">
  <img src="./a.jpg" alt="An office with two people working at a table.">
  <figcaption class="w-figcaption">A standard image.</figcaption>
</figure>

#### Differences between `alt` and `figcaption` {: #alt-vs-figcaption }

`alt` and `figcaption` should have different text because they're both announced by assistive
technology. If the text is duplicated, the assistive technology will announce the same text twice.
To use the analogy of a painting, the `alt` text would describe the painting, and the `figcaption`
text would be the little piece of paper next to the painting that mentions things like the painting's
title, the painter's name, and perhaps a description of what the painter was trying to achieve.

See [Alternative Text](https://webaim.org/techniques/alttext/) for more information.

### Images that extend slightly beyond the content column {: #fullbleed }

To make an image extend slightly beyond the width of the content column (for emphasis), add the `w-figure--fullbleed` class to the `figure` element and the `w-figcaption--fullbleed` class to the `figcaption` element:

```html
<figure class="w-figure w-figure--fullbleed">
  <img src="./a.jpg" alt="An office with two people working at a table.">
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    A full-bleed image.
  </figcaption>
</figure>
```

<figure class="w-figure w-figure--fullbleed">
  <img src="./a.jpg" alt="An office with two people working at a table.">
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    A full-bleed image.
  </figcaption>
</figure>

### Specifying a size for an image

To keep an image from growing beyond a specified size, add the `w-figure` class to the `figure` element and add a `width` attribute to the `img` element. For example, `width="400"`. All images will have a `max-width` of `100%` on mobile:

```html
<figure class="w-figure">
  <img src="./image-small.png" 
       alt="A screenshot of a section of the Chrome DevTools user interface." 
       width="400">
  <figcaption class="w-figcaption">
    A small, centered image.
    </figcaption>
</figure>
```

<figure class="w-figure">
  <img src="./image-small.png" alt="A screenshot of a section of the Chrome DevTools user interface." width="400">
  <figcaption class="w-figcaption">
    A small, centered image.
    </figcaption>
</figure>

### Inline images 

To place an image inline with text, add the `w-figure--inline-left` or `w-figure--inline-right` class to the `figure` element, depending on what alignment you want:

```html
<figure class="w-figure w-figure--inline-left">
  <img class="w-screenshot" src="./image-inline.png"
       alt="A diagram of the interactions between a client, a service worker, and the server."
       width="200">
  <figcaption class="w-figcaption">
    A left-aligned inline image.
  </figcaption>
</figure>
```

<figure class="w-figure w-figure--inline-left">
  <img class="w-screenshot" src="./image-inline.png" alt="A diagram of the interactions between a client, a service worker, and the server." width="200">
  <figcaption class="w-figcaption">
    A left-aligned inline image.
  </figcaption>
</figure>
<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at quam sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dictum a massa sit amet ullamcorper. Suspendisse auctor ultrices ante, nec tempus nibh varius at. Cras ligula lacus, porta vitae maximus a, ultrices a mauris. Vestibulum porta dolor erat, vel molestie dolor posuere in. Nam vel elementum augue. Nam quis enim blandit, posuere justo dignissim, scelerisque diam. Fusce aliquet urna ac blandit ullamcorper. Proin et semper nibh, sit amet imperdiet velit. Morbi at quam sem.
</p>

### Screenshots

#### Partial screenshots

To include a part of a screenshot, add the `w-screenshot` class to the `img` element:

```html
<figure class="w-figure">
  <img class="w-screenshot" src="./img2.png" 
       alt="A screenshot of optimization opportunities presented in Lighthouse.">
  <figcaption class="w-figcaption">
    A partial screenshot.
  </figcaption>
</figure>
```

<figure class="w-figure">
  <img class="w-screenshot" src="./img2.png" alt="A screenshot of optimization opportunities presented in Lighthouse.">
  <figcaption class="w-figcaption">
    A partial screenshot.
  </figcaption>
</figure>

#### Entire screenshots

To include an entire screenshot, also add the `w-screenshot-filled` class to the `img` element
(in addition to the `w-screenshot` class):

```html
<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" 
       src="./image-screenshot.png" 
       alt="A screenshot of the console log for the Chrome DevTools webpage.">
  <figcaption class="w-figcaption">
    A full screenshot.
  </figcaption>
</figure>
```

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./image-screenshot.png" alt="A screenshot of the console log for the Chrome DevTools webpage.">
  <figcaption class="w-figcaption">
    A full screenshot.
  </figcaption>
</figure>

## How to take screenshots

To take a screenshot on Windows:
1. Check out Microsoft's [Use Snipping Tool to capture screenshots](https://support.microsoft.com/en-us/help/13776/windows-use-snipping-tool-to-capture-screenshots) page.
1. In the Snipping Tool, use the pen to add a red box around any highlighted areas.
1. Click **Save Snip** and choose the desired options.

To take a screenshot on Mac:
1. Check out Apple's [How to take a screenshot on your Mac](https://support.apple.com/en-us/HT201361) page.
1. In Mac Preview, indicate any highlighted areas by adding a red box with borders set to the medium thickness.
1. Close Mac Preview. The screenshot image will appear on your desktop.

## Video

### Video hosted on YouTube {: #youtube }

To embed a YouTube video, use the `YouTube` component.

```text
{% raw %}{% YouTube 'your-video-id', 'optional-start-time' %}{% endraw %}
```

{% YouTube 'QDljY2I1Pfw' %}

{% Aside %}
The `optional-start-time` argument should be a single number, e.g. '473'.
You can get this number by clicking the **Share** button on YouTube and
checking the **Start at** box.
{% endAside %}

### Video hosted on web.dev

Always use video, not animated GIFs. (Check out the [Replace animated GIFs with video for faster page loads](/replace-gifs-with-videos/) post to learn how to use [FFmpeg](https://www.ffmpeg.org/) to convert GIFs to video.)

Once you have a video ready, message your content reviewer, and they'll help you upload it to the web.dev Google Cloud Storage bucket.

Embed the video in your post or codelab by following this example:
```html
  <figure class="w-figure">
    <video controls autoplay loop muted class="w-screenshot">
      <source src="https://storage.googleapis.com/web-dev-assets/portals_vp9.webm" type="video/webm">
      <source src="https://storage.googleapis.com/web-dev-assets/portals_h264.mp4" type="video/mp4">
    </video>
   <figcaption class="w-figcaption">
      Seamless embeds and navigation with Portals. Created by <a href="https://twitter.com/argyleink">Adam Argyle</a>.
    </figcaption>
  </figure>
```
<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/portals_vp9.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/portals_h264.mp4" type="video/mp4">
  </video>
 <figcaption class="w-figcaption">
    Seamless embeds and navigation with Portals. Created by <a href="https://twitter.com/argyleink">Adam Argyle</a>.
  </figcaption>
</figure>

### Full-bleed video

If you want any video to be full-bleed, put it in a `figure` element with the `w-figure--fullbleed` class. (Make sure to add the `w-figcaption--fullbleed` class to the `figcaption` element if you have one.)

[squoosh]: https://squoosh.app/
[tinypng]: https://tinypng.com/
[format]: https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization#selecting_the_right_image_format
