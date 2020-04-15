---
layout: post
title: Codecs
description: |
  Codec, which is short for coder-decoder_, is a compression format for video
  or audio data.  A codec is not the same thing as a container.
date: 2017-06-30
updated: 2020-04-30
---

Continuing downward, we arrive at the codec. _Codec_, which is short for _coder-
decoder_, is a compression format for video or audio data.  As stated earlier, a
codec is _not_ the same thing as a container. Two files of the same container
type could hold data compressed using completely different codecs. The webm
format for example allows audio to be encoded using either
[vorbis](https://en.wikipedia.org/wiki/Vorbis) or
[opus](https://en.wikipedia.org/wiki/Opus_(audio_format)). To change the codec I
need FFmpeg.

In the last section I demuxed the audio and video like this:

```bash
ffmpeg -i glocken.webm -vcodec copy -an glocken_video.webm
ffmpeg -i glocken.webm -acodec copy -vn glocken_audio.webm
```

If I need to change the audio and video codec, I would replace the `copy` keyword
with the name of a codec. For example, this command outputs an audio file
encoded with the aac codec.

```bash
ffmpeg -i glocken.webm -vn -c:a vorbis glocken.m4a
```

The [cheat sheet](/web/fundamentals/media/manipulating/cheatsheet#codec) lists
commands needed to convert codecs. The tables summarize the libraries used in
FFmpeg to perform the codec conversions for webm and mp4 files. These are the
formats recommended for DASH and HLS respectively.

## Video

| Extension | Codec | Library |
| --- | ----- | --- |
| mp4 | H264  | libx264 |
| webm| VP9   | libvpx-vp9 |

## Audio

| Extension | Codec | Library |
| --- | ----- | --- |
| mp4 | aac   | aac |
| webm| vorbis | libvorbis |
|     | opus | libopus |

