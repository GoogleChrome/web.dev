---
layout: post
title: Containers and codecs
description: |
  Media files are a bit like onions. The file that you see in your operating
  system shell is only a container multiple multiple data streams and different
  allowable types of encodings.
date: 2017-06-30
updated: 2020-04-30
tags:
  - FFmpeg
  - files
  - Shaka
---

Now that I've introduced you to [applications used for manipulating media
files](application-basics), I'm going to take a raw video file off a camera and
transform it into an encrypted resource that you can embed in a web page. I'm
specifically going to show you how to format your video for mobile playback.

{% Aside %}
This article provides explanations of file manipulation concepts,
with command lines only to illustrate the concepts. There is a companion [cheat
sheet](cheatsheet) that shows more commands and is designed as a quick reference
for someone who knows the concepts.
{% endAside %}

The result of these procedures will be media resources with the following
characteristics:

+  Versions of the video file in mp4 and webm format.
+  Versions of the audio file in m4a and webm format.
+  A bitrate of 0.35 Megabits per second (Mbs).
+  Resolution of 640 by 360.
+  Encrypted.
+  Viewable on all major browsers using appropriate technologies.

By "appropriate technologies" I mean Dynamic Adaptive Streaming over HTTP (DASH)
or HTTP Live Streaming (HLS), which are the two primary means of providing video
in HTML on the major browsers. What those terms mean and how to use them is a
whole topic itself. I won't be getting into those, but by the end of this
article, you'll be able to create media files that are ready for use in DASH and
HLS.

One final note: selection of the file formats, bitrate, and resolution are not
arbitrary. I've selected these values for speedy playback on the mobile web.

If you want to play along at home, you'll need a raw video file off a camera,
preferably one that contains both audio and video. If you don't have one handy,
then here's [ten seconds of an mov
file](https://storage.googleapis.com/webfundamentals-assets/fundamentals/media/videos/glocken.mov)
that I took of the
[Rathaus-Glockenspiel](https://en.wikipedia.org/wiki/Rathaus-Glockenspiel)
in Munich's MarienPlatz.

## How are media Files put together?

Before I start manipulating media files, I want to talk a bit about how media
files are put together. I think of them as being like an onion. The file that
you see in your operating system shell is a _container_, identified by a file
extension (mp4, webm, etc.). The container houses one or more _streams_. Media
files may contain many streams of varying types and even multiple streams of the
same type. Most files you'll encounter will only contain a single audio and a
single video stream. (Some may also contain captions and data, but I won't be
covering those.)

Within the audio and video streams, the actual data is compressed using a
_codec_. As explained in [Media file characteristics](application-basics#Media
file characteristics), the distinction between a container and a codec is
important becasue files with the same container can have their contents encoded with
different codecs.

The image below illustrates this. On the left is the basic structure. On the
right are the specifics of that structure for an mp4. I'll explain file
manipulation by moving downward through these layers.

<figure class="w-figure">
  <img src="./a.jpg" alt="Comparing media file structure with a hypothetical media file.">
  <figcaption class="w-figcaption">Media container onion.</figcaption>
</figure>

## Change the container

I'll start by changing the file container. You'll recall that I'm starting
with a file that has an mov extension. I'm going to use FFmpeg to change the
container type from mov to mp4 and webm. In actual practice, you would likely
specify a codec at the same time. For this lesson, I'm letting FFmpeg use its
defaults.

```bash
ffmpeg -i glocken.mov glocken.mp4
```
{% Aside %}
To create this article, I used FFmpeg version 3.2.2-tessus. If the command
lines don't work for your version of FFmpeg, consult the FFmpeg documentation.
{% endAside %}

Creating a webm file is a bit more complicated. FFmpeg has no trouble converting
a mov file to a webm file that will play in Chrome and Firefox. For whatever
reason, the file created using FFmpeg's defaults (at least for the version I
used) doesn't quite conform to the webm spec. (For the curious, it sets a
`DisplayUnit` size that isn't defined by the webm spec.) Fortunately, I can fix
this using a video filter. Do so with the `-vf` flag and the setsar filter.

```bash
ffmpeg -i glocken.mov -vf setsar=1:1 glocken.webm
```

Webm takes quite a bit longer to create than mp4. This isn't surprising when
you look at the results. While mp4 compresses to about a quarter of the original
file's size, webm is down in the single digits, though results may vary.

```bash
-rw-r--r--. 1 fr  12M Jun 27 11:48 glocken.mov
-rw-rw-r--. 1 fr 9.7M Jun 27 14:47 glocken.mp4
-rw-rw-r--. 1 fr 480K Jun 27 14:50 glocken.webm
```

## Check your work

This is a good place to remind you that you can verify the results of these
tasks using the same applications you're using to do the work. Remember that, as described in
[Application basics](application-basics), you'll need both FFmpeg and Shaka
Packager since neither shows you everything.

```bash
packager input=glocken.mp4 --dump_stream_info
```

```bash
ffmpeg -i glocken.mp4
```

## Codecs

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



