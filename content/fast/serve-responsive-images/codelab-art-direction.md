---
title: Art direction
author: khempenius
page_type: glitch
glitch: responsive-images-art-direction
order: 2
---

## Try out this demo

- Click the **Show Live** button to preview the app.

<web-screenshot type="show-live"></web-screenshot>

- Reload the app using different browser sizes. Notice how different the images
  are - they are not just different sizes but also different croppings and
  aspect ratios.

## What's going on here?

[Art direction](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction)
shows different images on different display sizes.

A responsive image loads different sizes of the same image. Art direction takes
this a step further and loads completely different images depending on the
display.

Use art direction to improve visual presentation. For example, the different
image croppings in this demo ensure that the point of interest (the flower) is
always shown in detail, regardless of the display. Art direction's benefits are
purely aesthetic - it provides no performance benefit over responsive images.

## View the code

- View `index.html` to see the art direction code for this demo.

## How the code works

Art direction uses the
[`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture),
[`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source),
and `<img>` tags.

### `<picture>`

The `<picture>` tag provides a wrapper for zero or more `<source>` tags and one `<image>` tag.

### `<source>`

The `<source>` tag specifies a media resource.

The browser uses the first `<source>` tag with a [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
 that returns true. If none of the media queries match, the
browser falls back to loading the image specified by the `<img>`.
tag.

**Gotchas:**

✔️ Be careful when ordering source tags. The browser uses the first
`<source>` tag with a matching media query - even if subsequent
`<source>` tags also have matching media queries.

✔️ The value of the `srcset` attribute is an image filepath.

✔️ Use images that are appropriately sized. Just because art
direction is used for aesthetic purposes, doesn't mean that it shouldn't be
performant too.

### `<img>`

The `<img>` tag makes this code work on browsers that don't
support the `<picture>` tag.

If a browser does not support the `<picture>` tag, it loads the
image specified by the `<img>` tag.

**Gotchas:**

✔️ The `<img>` tag should always be included, and it should
always be listed last, after all `<source>` tags.

✔️ The resource specified by the `<img>` tag should be a
size that works on all devices, so it can be used as a fallback.
