---
layout: handbook
title: Use images and video effectively
date: 2019-06-26
description: |
  Strategies for using images and video to support the author's purpose on web.dev.
---

This post is about how to use images and video to support your writing goals. If you're looking for technical details about how to create images and video for web.dev, see the [Images and video](/handbook/markup-media) post.

web.dev has two types of images:
* **Hero images** appear at the start of a post and in the post previews on the [blog](/blog).
* **Body images** appear in the text of a post or codelab.

Both types of images should be [accessible](/handbook/inclusion-and-accessibility#use-inclusive-images).

## Hero images
A hero image should represent the main idea of the post in some way. It often works well to find a visual metaphor. For example, a [post about the Layout Instability API](/layout-instability-api) uses an image of a precariously balanced tower of rocks to suggest the fragile layouts that the API detects.

Take a look at the [Stock photos that don't suck](https://medium.com/@dustin/stock-photos-that-dont-suck-62ae4bcbe01b) post on Medium for a list of sites that offer public domain or Creative Commons-licensed images.

## Body images
Body images should be related to body content in some way. Typically, an image illustrates an idea that immediately precedes it in the text of the post or codelab. Avoid including a body image just to break up text. Just as irrelevant text can be confusing, so too can an irrelevant image, especially for readers with cognitive differences.

## Image captions
Captions should be in sentence case. End all captions with a period.

{% Compare 'worse', 'Don’t' %}
> A Screenshot of the DevTools **Network** Panel

{% endCompare %}

{% Compare 'better', 'Do' %}
> A screenshot of the DevTools **Network** panel.

{% endCompare %}

A caption should typically be a noun phrase describing the image or a sentence summarizing the idea the image is showing. Examples:
* _DevTools accessibility pane showing the computed name for a button._
* _A teapot's handle is a natural affordance._

Not all images need captions. If there's a preceding sentence describing the image, a caption is usually redundant. For example, the sentence below tells the reader what to expect in the subsequent image.

{% Compare 'better', 'OK' %}
> Let's look at a web app that uses JavaScript to render a collection of cat images entirely in the browser:

![Image of a code sample next to the mobile site that it renders.](spa-kittens.png)

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
