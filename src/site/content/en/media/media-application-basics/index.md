---
layout: post
title: Media application basics
authors:
  - joemedley
  - derekherman
description: |
  Working with media often requires changing the characteristics of media files.
  On this page, you'll learn about the tools used and how to install them quickly.
date: 2017-06-09
updated: 2021-07-05
tags:
  - media
  - video
---

Working with media often requires changing the characteristics of media files,
such as bitrate or resolution. Finding a straightforward way to get started can
be pretty intimidating. On this page, you will learn about the tools used and how
to install them quickly.

First, we describe the basic usage for two common command-line media utilities:
[Shaka Packager] and [FFmpeg] and then we help you quickly get the tools installed.
Why cover two applications? While both are powerful and useful by themselves,
neither does everything needed to prepare media for the web. We also created the
[Media conversion](/media-conversion/) and [Media encryption](/media-encryption/)
pages which show many more common operations with these two applications.

These applications aren't the only options available for file manipulation tasks,
but they are two of the most common and powerful. Other options include the GUI
applications [Miro], [HandBrake], and [VLC]. There are also encoding/transcoding
services such as [Zencoder], [Amazon Elastic Encoder], and [Google Transcoder API]
(currently in beta).

{% Aside %}
You'll notice in what follows that the word 'resolution' doesn't appear. What
the two applications output are just the dimensions; the numbers themselves.
That's because resolution is just an informal shorthand for the dimensions of a
video. In every case that follows, We talk about specific numbers.
{% endAside %}

## Shaka Packager

[Shaka Packager] is a free media packaging SDK. If you were using a media player
on your site, Shaka Packager is what you would use to prepare the files. It
supports conversion for the two most common video streaming protocols: Dynamic
Adaptive Streaming over HTTP ([DASH]) or HTTP Live Streaming ([HLS]). Shaka
Packager supports key security features: common encryption and Widevine digital
rights management (DRM). It can also handle live-streaming, and video-on-demand.

Despite what it says on the package, this utility is for more than C++
developers. You can use it as both a library for building media software and as
a command-line utility for preparing media files for web playback. It's the
latter capacity that's useful for us here. In fact, for web media creators,
Shaka Packager is the only way to do some tasks without spending money on
expensive commercial applications.

Here's the basic pattern for a Shaka Packager command:

```bash
packager stream_descriptor [stream_descriptor-2 [stream_descriptor-n]] [flags]
```

This isn't quite what you get if you type `packager -help`. This example is
easier to reason about, and this reflects the examples in the
[Shaka Packager documentation]. Note that there are multiple `stream_descriptor`
items in the pattern. Though we don't show it, you could manipulate the video
and audio streams of a file separately in a single command.

Compare this basic pattern with a simple use that displays file characteristics.
In the example, We've lined up equivalent parts.

```bash
packager stream_descriptor [stream_descriptor-n] [flags]

packager input=glocken.mp4                       --dump_stream_info
```

The command outputs this:

```bash
File "glocken.mp4":
Found 2 stream(s).
Stream [0] type: Video
 codec_string: avc1.640028
 time_scale: 30000
 duration: 300300 (10.0 seconds)
 is_encrypted: false
 codec: H264
 width: 1920
 height: 1080
 pixel_aspect_ratio: 1:1
 trick_play_factor: 0
 nalu_length_size: 4

Stream [1] type: Audio
 codec_string: mp4a.40.2
 time_scale: 48000
 duration: 481280 (10.0 seconds)
 is_encrypted: false
 codec: AAC
 sample_bits: 16
 num_channels: 2
 sampling_frequency: 48000
 language: eng
 seek_preroll_ns: 20833
```

Look for the characteristics discussed in [Media file basics](/media-file-basics/)
and notice a few things. The height and width are correct for full HD, and the
audio and video codecs are among the preferred codecs for their container types,
AAC for audio and H264 for video. Notice also that streams are identified with
numbers. These are useful for operations that manipulate the audio and video
separately.

Notice that the output above doesn't show the bitrate. Despite what's missing,
this output is easier to read, so we use it whenever we can. When we need
information that Shaka Packager can't get, such as the bitrate, we use FFmpeg.

## FFmpeg

[FFmpeg] is also a free application for recording, converting, and streaming
media files. Its capabilities aren't better or worse than Shaka Packager's.
They're just different.

The basic pattern for an FFmpeg command looks like this:

```bash
ffmpeg [GeneralOptions] [InputFileOptions] -i input [OutputFileOptions] output
```

Like Shaka Packager this application can handle multiple streams. Some of its
options are used in multiple locations and manipulate the file output differently
depending on where they are in the command. Be aware of this as you
look at [FFmpeg questions on Stack Overflow] and similar sites.

We'll again compare the basic pattern to the example for displaying file
characteristics.

```bash
    ffmpeg [GeneralOptions] [InputFileOptions] -i input        [OutputFileOptions] output

    ffmpeg                                     -i glocken.mp4
```

In addition to the information we requested, this also prints an error message
as shown in the example below. That's because this is technically an incorrect
usage of FFmpeg. We use it because it displays information we care about.

```bash
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'glocken.mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    encoder         : Lavf58.17.100
  Duration: 00:01:47.53, start: 0.000000, bitrate: 10715 kb/s
    Stream #0:0(eng): Video: h264 (High) (avc1 / 0x31637661), yuvj420p(pc), 1920x1080, 10579 kb/s, 29.97 fps, 29.97 tbr, 30k tbn, 59.94 tbc (default)
    Metadata:
      handler_name    : VideoHandler
    Stream #0:1(eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 128 kb/s (default)
    Metadata:
      handler_name    : SoundHandler
At least one output file must be specified
```

## Installing applications with Docker

If you plan to follow along and try our commands you could either install the
required tools manually, or take the easy path and use [Docker]. We suggest using
Docker, because this is going to save you a lot of time. On top of that we've
provided the instructions to get you set up quickly.

1. Start by creating a new directory somewhere on your computer named `media-tools`;
   you can use whatever name you like, just note that the following instructions
   assume you are using `media-tools` as the directory name.

1. Create a `docker` and `media` directory inside of `media-tools`.
   This will keep your `media` directory out of the build context. This is important
   because `media` is where files are stored that we plan to do operations on, and
   some of them could be quite large. Putting the `Dockerfile` directly in
   `media-tools` would slow down building the image if you ever rebuild it down the
   road—perhaps to change the versions installed.

1. Create `/media-tools/docker/Dockerfile`, and add the following build instructions:

    ```dockerfile
    FROM google/shaka-packager:release-v2.4.3 as packager
    FROM jrottenberg/ffmpeg:4.3.2-alpine38
    COPY --from=packager /usr/bin /usr/bin
    ENTRYPOINT  ["sh"]
    ```

1. Build the image:

    ```bash
    docker build -t media-tools ./docker
    ```

1. Run the image as an interactive shell:

    ```bash
    docker run -w /media -v ${PWD}/media:/media -it --rm media-tools
    /media #
    ```

{% Aside 'gotchas' %}
Make sure you run the previous `docker` commands from inside the `media-tools`
directory.
{% endAside %}

While running the image you can check versions for both FFmpeg and Shaka Packager
to validate everything was successful by running `ffmpeg -version` and
`packager --version`. The output should look like this:

```bash
/media # ffmpeg -version
ffmpeg version 4.3.2 Copyright (c) 2000-2021 the FFmpeg developers
built with gcc 6.4.0 (Alpine 6.4.0)
configuration: --disable-debug --disable-doc --disable-ffplay --enable-shared --enable-avresample --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-gpl --enable-libass --enable-fontconfig --enable-libfreetype --enable-libvidstab --enable-libmp3lame --enable-libopus --enable-libtheora --enable-libvorbis --enable-libvpx --enable-libwebp --enable-libxcb --enable-libx265 --enable-libxvid --enable-libx264 --enable-nonfree --enable-openssl --enable-libfdk_aac --enable-postproc --enable-small --enable-version3 --enable-libbluray --enable-libzmq --extra-libs=-ldl --prefix=/opt/ffmpeg --enable-libopenjpeg --enable-libkvazaar --enable-libaom --extra-libs=-lpthread --enable-libsrt --enable-libaribb24 --extra-cflags=-I/opt/ffmpeg/include --extra-ldflags=-L/opt/ffmpeg/lib
libavutil      56. 51.100 / 56. 51.100
libavcodec     58. 91.100 / 58. 91.100
libavformat    58. 45.100 / 58. 45.100
libavdevice    58. 10.100 / 58. 10.100
libavfilter     7. 85.100 /  7. 85.100
libavresample   4.  0.  0 /  4.  0.  0
libswscale      5.  7.100 /  5.  7.100
libswresample   3.  7.100 /  3.  7.100
libpostproc    55.  7.100 / 55.  7.100
```

```bash
/media # packager --version
packager version v2.4.3-dd9870075f-release
```

Now that you've tried your hand at using Shaka Packager and FFmpeg, you can continue
learning the basic concepts, next up [Media streaming basics](/media-streaming-basics/).

[Shaka Packager]: https://github.com/google/shaka-packager
[FFmpeg]: https://ffmpeg.org/download.html
[Miro]: http://www.mirovideoconverter.com/
[HandBrake]: https://handbrake.fr/
[VLC]: https://www.videolan.org/
[Zencoder]: https://en.wikipedia.org/wiki/Zencoder
[Amazon Elastic Encoder]: https://aws.amazon.com/elastictranscoder
[Google Transcoder API]: https://cloud.google.com/transcoder/docs
[DASH]: https://developer.mozilla.org/en-US/docs/Web/HTML/DASH_Adaptive_Streaming_for_HTML_5_Video
[HLS]: https://developer.apple.com/documentation/http_live_streaming
[Shaka Packager documentation]: https://google.github.io/shaka-packager/html/
[FFmpeg questions on Stack Overflow]: https://stackoverflow.com/questions/tagged/ffmpeg
[Docker]: https://www.docker.com/whatisdocker
