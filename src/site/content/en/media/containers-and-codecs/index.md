---
layout: post
title: Containers and codecs
authors:
  - joemedley
description: |
  Media files are a bit like onions. The file that you see in your operating
  system shell is only a container multiple multiple data streams and different
  allowable types of encodings.
date: 2017-06-30
updated: 2020-09-24
tags:
  - media
  - video
---

To support multiple browsers, you'll need to use FFmpeg to convert your mov file
to two different containers: an MP4 container and a WebM container. In actual
practice, you would likely specify a codec at the same time. For now, I'm
letting FFmpeg use its defaults.

To create the MP4:

```bash
ffmpeg -i glocken.mov glocken.mp4
```

To create the WebM:

```bash
ffmpeg -i glocken.mov glocken.webm
```

{% Aside %}
To create this article, I used FFmpeg version 4.2.2-tessus. If the command
lines don't work for your version of FFmpeg, consult the FFmpeg documentation.
{% endAside %}

Webm takes longer to create than MP4. This isn't surprising when you look at the
results. While MP4 compresses to about two-thirds of the original file's size,
WebM is down to a mere fraction of the original's size. Though, your results may
vary. You can see this for yourself using the [`ls -a` bash
command](https://www.tecmint.com/15-basic-ls-command-examples-in-linux/) in the
folder where your media files are located. For example:


```bash
-rw-r--r-- 1 jmedley  eng  12080306 Apr 21 13:13 glocken.mov
-rw-r--r-- 1 jmedley  eng  10146121 Apr 21 13:25 glocken.mp4
-rw-r--r-- 1 jmedley  eng    491743 Apr 21 13:30 glocken.webm
```

## Check your work

To verify your results, use FFmpeg and Shaka Packager as already shown in
[Media Application basics](/media-application-basics):

```bash
packager input=glocken.mp4 --dump_stream_info
```

```bash
ffmpeg -i glocken.mp4
```

## Codecs

Next the codec. As stated in [Media file basics](/media-file-basics), a codec is _not_ the
same thing as a container (file type). Two files of the same container type
could hold data compressed using different codecs. The WebM format for example
allows audio to be encoded using either
[vorbis](https://en.wikipedia.org/wiki/Vorbis) or
[opus](https://en.wikipedia.org/wiki/Opus_(audio_format)). To change the codec I
use FFmpeg. For example, this command outputs an mkv file with a vorbis audio
codec and an av1 video codec.

```bash
ffmpeg -i glocken.mov -c:a vorbis -c:v av1 glocken.mkv
```

In this example, the `-c:a` flag and the `-c:v` are for specifying the audio and
video codecs respectively.

The [cheat sheet](/media-cheat-sheet#codec) lists commands needed to convert codecs.
The tables below summarize the libraries used in FFmpeg to perform the codec
conversions for WebM and MP4 files. These are the formats recommended for DASH
and HLS respectively.

## Video

| Codec | Extension    | Library    |
| ----- | ------------ | ---------- |
| av1   | WebM<br/>mkv | libaom-av1 |
| h264  | MP4          | libx264    |
| vp9   | WebM         | libvpx-vp9 |

## Audio

| Codec  | Extension | Library    |
| ------ | --------- | ---------- |
| aac    | MP4       | aac        |
| opus   | WebM      | libopus    |
| vorbis | WebM      | libvorbis  |

Next, I'll show you how to change the file's [bitrate](/bitrate).
