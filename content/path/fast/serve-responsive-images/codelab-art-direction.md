---
title: Art direction
author: khempenius
page_type: glitch
glitch: responsive-images-art-direction
---

## Try out this demo

1. Reload this demo using different browser sizes. Notice how different the
images are - they are not just different sizes but also different croppings and
aspect ratios.

## What's going on here?

[Art direction](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction)
shows different images on different display sizes.

A responsive image loads different sizes of the same image. Art direction takes
this a step further and loads completely different images depending on the
display.

Use art direction to improve visual presentation. For example, the different
image croppings in this demo ensure that the point of interest ( the flower) is
always shown in detail, regardless of the display. Art direction's benefits are
purely aesthetic - it provides no performance benefit over responsive images.

## View the code

1. View `index.html` to see the art direction code for this demo.

## How the code works

Art direction uses the
[<picture>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture),
[<source>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source),
and `<img>` tags.

<table>
<thead>
<tr>
<th><strong>Tag</strong></th>
<th><strong>Role</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><picture></td>
<td>The <code><picture></code> tag provides a wrapper for zero or more
<code><source></code> tags and one <code><image></code> tag. </td>
</tr>
<tr>
<td><source></td>
<td>The <code><source></code> tag specifies a media resource.<br>
<br>
The browser uses the first <code><source></code> tag with a <a
href="https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries">media
query</a> that returns true. If none of the media queries match, the
browser falls back to loading the image specified by the <code><img></code>
tag.<br>
<br>
<strong>Gotchas:</strong><br>
✔️Be careful when ordering source tags. The browser uses the first
<code><source></code> tag with a matching media query - even if subsequent
<code><source></code> tags also have matching media queries.<br>
✔️The value of the <code>srcset</code> attribute is an image filepath.<br>
✔️Use images that are <u>appropriately sized</u>. Just because art
direction is used for aesthetic purposes, doesn't mean that it shouldn't be
performant too.</td>
</tr>
<tr>
<td><img></td>
<td>The <code><img></code> tag makes this code work on browsers that don't
support the <code><picture></code> tag.<br>
<br>
If a browser does not support the <code><picture></code> tag, it loads the
image specified by the <code><img></code> tag.  <br>
<strong>Gotchas:</strong><br>
✔️The <code><img></code> tag should always be included, and it should
always be listed last, after all <code><source></code> tags.<br>
✔️The resource specified by the <code><img></code> tag should be a
size that works on all devices, so it can be used as a fallback.</td>
</tr>
</tbody>
</table>