---
layout: handbook
title: Use images and video effectively
date: 2019-06-26
description: |
  Strategies for using images and video to support the author's purpose on web.dev.
---

This post is about how to use images and video to support your writing goals. If you're looking for technical details about how to create images and video for web.dev, see the [Images and video](/handbook/markup-media) post.

There are three types of images associated with a web.dev post:
* The **thumbnail image** appears in a post's card if the post is added to the [Blog](/blog) page.
* The **hero image** appears at the start of a post.
* **Body images** appear in the text of a post or codelab.

All images should be [accessible](/handbook/inclusion-and-accessibility#use-inclusive-images).

## Thumbnail and hero images
To maintain continuity between the blog page and the post page, the thumbnail image should generally be the same as the hero image. In some cases, it may be necessary to crop the two images differently or shift some visual elements to account for the different aspect ratios of the thumbnail and hero images.

Thumbnail and hero images should represent the main idea of the post in some way. It often works well to find a visual metaphor. For example, a [post about the Layout Instability API](/layout-instability-api) uses an image of a precariously balanced tower of rocks to suggest the fragile layouts that the API detects.

Take a look at the [Stock photos that don't suck](https://medium.com/@dustin/stock-photos-that-dont-suck-62ae4bcbe01b) post on Medium for a list of sites that offer public domain or Creative Commons-licensed images.

## Body images
Body images should be related to body content in some way. Typically, an image illustrates an idea that immediately precedes it in the text of the post or codelab. Avoid including a body image just to break up text. Just as irrelevant text can be confusing, so too can an irrelevant image, especially for readers with cognitive differences.

## Image captions
Captions should be in sentence case. End all captions with a period.

<div class="w-columns">
{% Compare 'worse' %}
A Screenshot of the DevTools **Network** Panel
{% endCompare %}

{% Compare 'better' %}
A screenshot of the DevTools **Network** panel.
{% endCompare %}
</div>

A caption should typically be a noun phrase describing the image or a sentence summarizing the idea the image is showing. Examples:
* _DevTools accessibility pane showing the computed name for a button._
* _A teapot's handle is a natural affordance._

Not all images need captions. If there's a preceding sentence describing the image, a caption is usually redundant. For example, the sentence below tells the reader what to expect in the subsequent image.

{% Compare 'better', 'OK' %}
Let's look at a web app that uses JavaScript to render a collection of cat images entirely in the browser:

{% Img src="image/admin/tdiMrqek791ayJmw72di.png", alt="Image of a code sample next to the mobile site that it renders.", width="800", height="447" %}
{% endCompare %}

## Video
Video has some tradeoffs that are worth considering when deciding whether to use it:
* Video is highly engaging.
* Video is generally much better than images for showing things that change over time.
* Video files are comparatively big.
* Videos require more authoring time (for example, to create closed captions).
* Beyond simple screencasts, producing videos requires a fair amount of effort.

Taking these tradeoffs into account, try to use video primarily when:
* You need to show something moving or changing
* You need to show a recording of an event (e.g., a conference talk)
