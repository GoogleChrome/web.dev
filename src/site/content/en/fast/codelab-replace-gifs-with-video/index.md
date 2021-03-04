---
layout: codelab
title: Replace GIFs with video
authors:
  - robdodson
date: 2018-11-05
updated: 2019-08-29
description: |
  In this codelab, learn how to improve performance by replacing an animated GIF
  with a video.
glitch: gif-to-video
related_post: replace-gifs-with-videos
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

In this codelab, improve performance by replacing an animated GIF with a
video.

## Measure first

First measure how the website performs:

{% Instruction 'preview', 'ol' %}
{% Instruction 'audit-performance', 'ol' %}

When you're finished, you should see that Lighthouse has flagged the GIF as an
issue in its "Use video formats for animated content" audit.

## Get FFmpeg

There are a number of ways you can convert GIFs to video; this guide uses
**[FFmpeg](https://www.ffmpeg.org/)**. It's already installed in the Glitch VM,
and, if you want, you can follow [these instructions to install it on your
local
machine](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/replace-animated-gifs-with-video/#converting_animated_gifs_to_video)
as well.

## Open the console

Double-check that FFmpeg is installed and working:

{% Instruction 'remix', 'ol' %}
{% Instruction 'console', 'ol' %}
1. In the console, run:

```bash
which ffmpeg
```

You should get a file path back:

```bash
/usr/bin/ffmpeg
```

## Change GIF to video

- In the console, run `cd images` to enter the images directory.
- Run `ls` to see the contents.

You should see something like this:

```bash
$ ls
cat-herd.gif
```

- In the console, run:

```bash
ffmpeg -i cat-herd.gif -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p cat-herd.mp4
```

This tells FFmpeg to take the **input**, signified by the `-i` flag, of
cat-herd.gif and convert it to a video called cat-herd.mp4. This should take a
second to run. When the command finishes, you should be able to type `ls` again
and see two files:

```bash
$ ls
cat-herd.gif  cat-herd.mp4
```

## Create WebM videos

While MP4 has been around since 1999, WebM is a relative newcomer having been
initially released in 2010. WebM videos can be much smaller than MP4 videos, so
it makes sense to generate both. Thankfully the `<video>` element will let you
add multiple sources, so if a browser doesn't support WebM, it can fallback to
MP4.

- In the console, run:

```bash
ffmpeg -i cat-herd.gif -c vp9 -b:v 0 -crf 41 cat-herd.webm
```

- To check the file sizes run:

```bash
ls -lh
```

You should have one GIF, and two videos:

```bash
$ ls -lh
total 4.5M
-rw-r--r-- 1 app app 3.7M May 26 00:02 cat-herd.gif
-rw-r--r-- 1 app app 551K May 31 17:45 cat-herd.mp4
-rw-r--r-- 1 app app 341K May 31 17:44 cat-herd.webm
```

Notice that the original GIF is 3.7M, whereas the MP4 version is 551K, and the
WebM version is only 341K. That's a huge savings!

## Update HTML to recreate GIF effect

Animated GIFs have three key traits that videos need to replicate:

- They play automatically.
- They loop continuously (usually, but it is possible to prevent looping).
- They're silent.

Luckily, you can recreate these behaviors using the `<video>` element.

- In the `index.html` file, replace the line with the `<img>` with:

```html/1/0
<img src="/images/cat-herd.gif" alt="Cowboys herding cats.">
<video autoplay loop muted playsinline></video>
```

A `<video>` element using these attributes will play automatically, loop
endlessly, play no audio, and play inline (i.e., not fullscreen), all the
behaviors expected of animated GIFs! 🎉

## Specify your sources

All that's left to do is specify your video sources. The `<video>` element requires
one or more `<source>` child elements pointing to different video files the
browser can choose from, depending on format support.
Update the `<video>` with `<source>` elements that link to your cat-herd videos:

```html/1-2
<video autoplay loop muted playsinline>
  <source src="/images/cat-herd.webm" type="video/webm">
  <source src="/images/cat-herd.mp4" type="video/mp4">
</video>
```

{% Aside %}
Browsers don't speculate about which `<source>` is optimal, so the order
of `<source>`s matters. For example, if you specify an MP4 video first and the
browser supports WebM, browsers will skip the WebM `<source>` and use the MPEG-4
instead. If you prefer a WebM `<source>` be used first, specify it first!
{% endAside %}

## Preview

{% Instruction 'preview' %}

The experience should look the same. So far so good.

## Verify with Lighthouse

With the live site open:
{% Instruction 'audit-performance', 'ol' %}

You should see that the "Use video formats for animated content" audit is now
passing! Woohoo! 💪
