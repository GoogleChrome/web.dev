---
layout: post
title: Media conversion
authors:
  - joemedley
  - derekherman
description: |
  Commands needed to convert a raw mov file to media assets packaged for DASH or HLS.
date: 2018-09-20
updated: 2021-07-05
tags:
  - media
  # - video
  - audio
---

In this article we are going to learn some common commands for converting and
manipulating specific characteristics of media files. Although we've tried to
show equivalent operations for all procedures, not all operations are possible
in both applications.

In many cases, the commands we're showing may be combined in a single command
line operation, and would be when actually used. For example, there's nothing
preventing you from setting an output file's bitrate in the same operation as
a file conversion. For this article, we often show these operations as separate
commands for the sake of clarity.

Conversion is done with these applications:

* [Shaka Packager](https://github.com/google/shaka-packager) ([on Stack Overflow](https://stackoverflow.com/questions/tagged/shaka))
* [FFmpeg](https://ffmpeg.org/download.html), ([on Stack Overflow](https://stackoverflow.com/questions/tagged/ffmpeg))

## Display characteristics

Both Shaka Packager and FFmpeg can be used to inspect the content of a media
file and then display the characteristics of a stream. However, both provide
different output for the same media.

### Characteristics using Shaka Packager

```bash
packager input=glocken.mp4 --dump_stream_info
```

The output looks like:

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

### Characteristics using FFmpeg

```bash
ffmpeg -i glocken.mp4
```

The output looks like:

```bash
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'glocken.mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    encoder         : Lavf57.83.100
  Duration: 00:00:10.03, start: 0.000000, bitrate: 8063 kb/s
    Stream #0:0(eng): Video: h264 (High) (avc1 / 0x31637661), yuvj420p(pc), 1920x1080, 7939 kb/s, 29.97 fps, 29.97 tbr, 30k tbn, 59.94 tbc (default)
    Metadata:
      handler_name    : VideoHandler
    Stream #0:1(eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 127 kb/s (default)
    Metadata:
      handler_name    : SoundHandler
At least one output file must be specified
```

{% Aside 'gotchas' %}
Technically, FFmpeg always requires an output file format. Calling FFmpeg this
way will give you an error message explaining that; however, it lists
information not available using Shaka Packager so feel free to ignore the error.
{% endAside %}

## Demux (separate) the audio and video streams

Shaka Packager requires demuxing when converting files. This is also required
for using media frameworks.

### Shaka Packager demuxing

**MP4**

```bash
packager input=myvideo.mp4,stream=video,output=myvideo_video.mp4
packager input=myvideo.mp4,stream=audio,output=myvideo_audio.m4a
```

Or:

```bash
packager \
  input=myvideo.mp4,stream=video,output=myvideo_video.mp4 \
  input=myvideo.mp4,stream=audio,output=myvideo_audio.m4a
```

**WebM**

```bash
packager \
  input=myvideo.webm,stream=video,output=myvideo_video.webm \
  input=myvideo.webm,stream=audio,output=myvideo_audio.webm
```
### FFmpeg demuxing

**MP4**

```bash
ffmpeg -i myvideo.mp4 -vcodec copy -an myvideo_video.mp4
ffmpeg -i myvideo.mp4 -acodec copy -vn myvideo_audio.m4a
```

**WebM**

```bash
ffmpeg -i myvideo.webm -vcodec copy -an myvideo_video.webm
ffmpeg -i myvideo.webm -acodec copy -vn myvideo_audio.webm
```

## Remux (combine) the audio and video streams

In some situation you will need to combine the audio and video back into a single
container. Especially when not using a media framework. This is something FFmpeg
can handle quite well and is something Shaka Packager does not currently support.

```bash
ffmpeg -i myvideo_video.webm -i myvideo_audio.webm -c copy myvideo.webm
```

## Change characteristics

### Bitrate

For FFmpeg, we can do this while converting to `.mp4` or `.webm`.

```bash
ffmpeg -i myvideo.mov -b:v 350K myvideo.mp4
ffmpeg -i myvideo.mov -vf setsar=1:1 -b:v 350K myvideo.webm
```

### Dimensions (resolution)

```bash
ffmpeg -i myvideo.webm -s 1920x1080 myvideo_1920x1080.webm
```

### File type

Shaka Packager cannot process `.mov` files and hence cannot be used to convert
files from that format.

**`.mov` to `.mp4`**

```bash
ffmpeg -i myvideo.mov myvideo.mp4
```

**`.mov` to `.webm`**

```bash
ffmpeg -i myvideo.mov myvideo.webm
```

### Synchronize audio and video

To ensure that audio and video synchronize during playback, insert keyframes.

```bash
ffmpeg -i myvideo.mp4 -keyint_min 150 -g 150 -f webm -vf setsar=1:1 out.webm
```

{% Aside %}
Visit _Containers and codecs_ to view the audio and video [**codecs**](/containers-and-codecs/#codecs)
and the associated encoding and decoding library the codec uses.
{% endAside %}

***MP4/H.264***

```bash
ffmpeg -i myvideo.mp4 -c:v libx264 -c:a copy myvideo.mp4
```

***Audio for an MP4***

```bash
ffmpeg -i myvideo.mp4 -c:v copy -c:a aac myvideo.mp4
```

***WebM/VP9***

```bash
ffmpeg -i myvideo.webm -v:c libvpx-vp9 -v:a copy myvideo.webm
```

***Audio for a WebM***

```bash
ffmpeg -i myvideo.webm -v:c copy -v:a libvorbis myvideo.webm
ffmpeg -i myvideo.webm -v:c copy -v:a libopus myvideo.webm
```

## Video-on-demand and live-streaming

There are two types of streaming protocols we are going to demonstrate in this
article. The first is Dynamic Adaptive Streaming over HTTP (DASH), which is an
adaptive bitrate streaming technique and [web-standards-based] method of
presenting video-on-demand. The second is HTTP Live Streaming (HLS), which is
[Apple's standard] for live-streaming and video-on-demand for the web.

### DASH/MPD

This example generates the Media Presentation Description (MPD) output file
from the audio and video streams.

```bash
packager \
  input=myvideo.mp4,stream=audio,output=myvideo_audio.mp4 \
  input=myvideo.mp4,stream=video,output=myvideo_video.mp4 \
  --mpd_output myvideo_vod.mpd
```

## HLS

These examples generate an `M3U8` output file from the audio and video streams,
which is a UTF-8 encoded multimedia playlist.

```bash
ffmpeg -i myvideo.mp4 -c:a copy -b:v 8M -c:v copy -f hls \
  -hls_time 10 -hls_list_size 0 myvideo.m3u8
```

OR:

```bash
packager \
  'input=myvideo.mp4,stream=video,segment_template=output$Number$.ts,playlist_name=video_playlist.m3u8' \
  'input=myvideo.mp4,stream=audio,segment_template=output_audio$Number$.ts,playlist_name=audio_playlist.m3u8,hls_group_id=audio,hls_name=ENGLISH' \
  --hls_master_playlist_output="master_playlist.m3u8"
```

Now that we hopefully have a good grasp on how to convert files, we can build on
what we've learned in this article and go learn about
[Media encryption](/media-encryption/) next.

[web-standards-based]: https://developer.mozilla.org/docs/Web/HTML/DASH_Adaptive_Streaming_for_HTML_5_Video
[Apple's standard]: https://developer.apple.com/streaming/
