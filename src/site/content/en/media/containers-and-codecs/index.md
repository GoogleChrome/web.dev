---
layout: post
title: Containers and codecs
description: |
  Media files are a bit like onions. The file that you see in your operating
  system shell is only a container multiple multiple data streams and different
  allowable types of encodings.
date: 2017-06-30
updated: 2020-06-10
tags:
  - FFmpeg
  - files
  - Shaka
---



## Change the container

To support multiple browsers, you'll need to use FFmpeg to convert your mov file
to two different containers: an mp4 container and a webm container. In actual
practice, you would likely specify a codec at the same time. For now, I'm
letting FFmpeg use its defaults.

```bash
ffmpeg -i glocken.mov glocken.mp4
```
{% Aside %}
To create this article, I used FFmpeg version 4.2.2-tessus. If the command
lines don't work for your version of FFmpeg, consult the FFmpeg documentation.
{% endAside %}

Webm takes quite a bit longer to create than mp4. This isn't surprising when you
look at the results. While mp4 compresses to about two-thirds of the original
file's size, webm is down to a mere fraction of the original's size. Though,
your results may vary.

```bash
-rw-r--r-- 1 jmedley  eng  12080306 Apr 21 13:13 glocken.mov
-rw-r--r-- 1 jmedley  eng  10146121 Apr 21 13:25 glocken.mp4
-rw-r--r-- 1 jmedley  eng    491743 Apr 21 13:30 glocken.webm
```

## Check your work

This is a good place to remind you that you can verify the results of these
tasks using the same applications you're using to do the work. Remember that, as described in
[Application basics](../application-basics), you'll need both FFmpeg and Shaka
Packager since neither shows you everything.

```bash
packager input=glocken.mp4 --dump_stream_info
```

```bash
ffmpeg -i glocken.mp4
```

## Codecs

Next the codec. As stated in [File basics](../file-basics), a codec is _not_ the
same thing as a container (file type). Two files of the same container type
could hold data compressed using completely different codecs. The webm format
for example allows audio to be encoded using either
[vorbis](https://en.wikipedia.org/wiki/Vorbis) or
[opus](https://en.wikipedia.org/wiki/Opus_(audio_format)). To change the codec I
use FFmpeg. For example, this command outputs an mkv file with a vorbis audio
codec and an av1 video codec.

```bash
ffmpeg -i glocken.mov -c:a vorbis -c:v av1 glocken.mkv
```

In this example, the `-c:a` flag and the `-c:v` are for specifying the audio and
video codecs respectively.

The [cheat sheet](.../cheatsheet#codec) lists commands needed to convert codecs.
The tables below summarize the libraries used in FFmpeg to perform the codec
conversions for webm and mp4 files. These are the formats recommended for DASH
and HLS respectively.

## Video

| Codec | Extension | Library    |
| ----- | --------- | ---------- |
| av1   | mkv       | libaom-av1 |
|       | webm      | libaom-av1 |
| h264  | mp4       | libx264    |
| vp9   | webm      | libvpx-vp9 |

## Audio

| Codec  | Extension | Library    |
| ------ | --------- | ---------- |
| aac    | mp4       | aac        |
| opus   | webm      | libopus    |
| vorbis | webm      | libvorbis  |


