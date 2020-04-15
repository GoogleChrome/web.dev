---
layout: post
title: Streams
description: |
  When you package media resources for DASH you'll need to separate the
  video and audio streams.
date: 2017-06-30
updated: 2020-04-30
tags:
  - FFmpeg
  - files
  - Shaka
  - streams
---

When you package media resources for Dynamic Adaptive Streaming over HTTP (DASH)
you'll need to separate the video and audio streams. Splitting the audio and
video streams of a file is often referred to as _demultiplexing_ or _demuxing_
for short. Professional content creators often record audio and video to
separate files to begin with. If resources come from a consumer-grade device,
audio and video will be in the same file and you'll need to split them.

In the context of preparing media for the web, demuxing is basically a file
copying operation where I copy one of the streams to a new file. Using Shaka
Packager I might, for example, pull out the video stream.

```bash
packager input=glocken.mp4,stream=video,output=glocken_video.mp4
```

Notice that the stream descriptor has an input, an output, and a stream type.
Despite the mp4 extension this output file wouldn't have any sound. To get an
audio file, I'd rerun this command with `stream=audio` and output it to a
different file name. But, you might remember from [Application
basics](application-basics) that Shaka Packager can take multiple stream
descriptors. This means that Shaka Packager lets me split the audio and video in
a single command.

```bash
packager \
  input=glocken.mp4,stream=video,output=glocken_video.mp4 \
  input=glocken.mp4,stream=audio,output=glocken_audio.m4a
```

A full discussion of audio and video formats is beyond the scope of this
article, though in the next section I'll cover what you need for DASH and HTTP
Live Streaming (HLS). One thing to note is that the audio stream of an mp4 file
is the [advanced audio
coding](https://en.wikipedia.org/wiki/Advanced_Audio_Coding) format for which
`m4a` is a common file extension.

Shaka Packager presents demuxing as though you're _extracting_ a stream into a
new file. It's a little different in FFmpeg, which presents as though you're
_stripping_ the stream you don't want. With FFmpeg, you need two operations.

```bash
ffmpeg -i glocken.webm -vcodec copy -an glocken_video.webm
ffmpeg -i glocken.webm -acodec copy -vn glocken_audio.webm
```

Just as with Shaka Packager, there are both an input and an output file. Another
difference from Shaka Packager is that the streams are identified with flags
that refer their codecs. The `-vcodec copy` and `-acodec copy` portions of the
command tell FFmpeg to copy the streams I want while the `-an` and `-vn` flags
strip the streams I don't want. The keyword `copy` means I'm moving the streams
without changing their codecs.

A list of
[demuxing commands](/web/fundamentals/media/manipulating/cheatsheet#demux_split_audio_and_video)
is provided on the cheat sheet.
