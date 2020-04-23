---
layout: post
title: Application basics
description: |
  Much media work requires changing characteristics of media files. In this
  section, I provide an onramp into that world.
date: 2017-06-09
updated: 2020-04-30
tags:
  - FFmpeg
  - files
  - Shaka
---

Much media work requires changing characteristics of media files, such as
bitrate or resolution. Finding a straightforward way to get started can be
bewildering and intimidating. In this section, I provide an onramp into that
world.

This page has basics for two common media command-line utilities: [Shaka
Packager](https://github.com/google/shaka-packager) and
[FFmpeg](https://ffmpeg.org/download.html). Why cover two applications? While
both are powerful and useful by themselves, neither does everything needed to
prepare media for the web. I've also created a [cheat sheet](cheatsheet) showing
common operations with those applications.



## Shaka Packager

[Shaka Packager](https://github.com/google/shaka-packager) is a free media
packaging SDK for creating packager applications for [Dynamic Adaptive Streaming
over HTTP
(DASH)](https://developer.mozilla.org/en-US/docs/Web/HTML/DASH_Adaptive_Streaming_for_HTML_5_Video)
or [HTTP Live Streaming
(HLS)](https://developer.apple.com/documentation/http_live_streaming). Shaka
Packager provides common encryption support, Widevine digital rights management
(DRM) support, live video, and video-on-demand for these technologies. Don't
worry if you don't know what all those words mean. You won't need them to
understand the rest of this article.

Despite what it says on the package, this utility is for more than C++
developers. You can use it as both a library for building media software and as
a command-line utility for preparing media files for playback. It's the later
capacity that interests me here. In fact, for web media creators, Shaka Packager
is the only way to do some tasks without spending money on expensive commercial
applications.

Here's the basic pattern for a Shaka Packager command:

```bash
packager stream_descriptor [stream_descriptor-2 [stream_descriptor-n]] [flags]
```

This isn't quite what you get if you type `packager -help`. This is how I think
of it, and this reflects the examples in the [Shaka Packager
documentation](https://google.github.io/shaka-packager/html/). Note that there are multiple
`stream_descriptor` items in the pattern. Though I don't show it, you could
hypothetically manipulate the video and audio streams of a file simultaneously.

Compare this basic pattern with a simple use of it to display file
characteristics. In the example, I've lined up equivalent parts.

```bash
packager stream_descriptor [stream_descriptor-2 [stream_descriptor-n]] [flags]

packager input=glocken.mp4                                              --dump_stream_info
```

The command outputs this:

```bash
[0416/140029:INFO:demuxer.cc(88)] Demuxer::Run() on file 'glocken.mp4'.
[0416/140029:INFO:demuxer.cc(160)] Initialize Demuxer for file 'glocken.mp4'.

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

Packaging completed successfully.
```

Look for the characteristics discussed in the last section and notice a few
things. The height and width are correct for full HD, and the audio and video
codecs are among the preferred codecs for their container types, AAC for audio
and H264 for video. Notice also that streams are identified with numbers. These
are useful for operations that manipulate the audio and video separately.

Notice that it doesn't show the bitrate. Despite what's missing, it's easier to
read, which is why I use it whenever I can. When I need information that Shaka
Packager can't get, such as the bitrate, I use FFmpeg.

## FFmpeg

[FFmpeg](https://ffmpeg.org/download.html) is also a free application for
recording, converting, and streaming media files. Its capabilities aren't better
or worse than Shaka Packager's. They're just different.

The basic pattern for an FFmpeg command looks like this:

```bash
ffmpeg [GeneralOptions] [InputFileOptions] -i input [OutputFileOptions] output
```

Like Shaka Packager this application can handle multiple streams. Some of its
options can be used in multiple locations and have different meanings depending
on where they are in the command. Be aware of this as you look at command line
examples on sites such as StackOverflow and similar sites.

I'll again compare the basic pattern to the example for displaying file characteristics.

```bash
    ffmpeg [GeneralOptions] [InputFileOptions] -i input        [OutputFileOptions] output

    ffmpeg                                     -i glocken.mp4
```

In additon to the information I requested, this also prints an error message as
shown in the example below. That's because this is technically an incorrect
usage of FFmpeg. I use it because it displays information I care about.

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
