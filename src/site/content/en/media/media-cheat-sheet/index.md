---
layout: post
title: Media manipulation cheat sheet
authors:
  - joemedley
description: |
  An ordered rundown of commands needed to get from a raw mov file to encrypted
  assets packaged for DASH or HLS.
date: 2018-09-20
updated: 2020-09-24
tags:
  - media
  - video
  - audio
---

This page offers these resources:

* Commands for manipulating specific characteristics of media files.
* The sequence of commands needed to get from a raw mov file to encrypted media assets.

Conversion is done with these applications:

* [Shaka Packager](https://github.com/google/shaka-packager) ([on Stack Overflow](https://stackoverflow.com/questions/tagged/shaka))
* [FFmpeg](https://ffmpeg.org/download.html), version 4.2.2-tessus ([on Stack Overflow](https://stackoverflow.com/questions/tagged/ffmpeg))
* [OpenSSL](https://www.openssl.org/)  ([on Stack Overflow](https://stackoverflow.com/questions/tagged/openssl))


Although I've tried to show equivalent operations for all procedures, not all
operations are possible in both applications.

In many cases, the commands I'm showing may be combined in a single command line
operation, and in actual use would be. For example, there's nothing preventing
you from setting an output file's bitrate in the same operation as a file
conversion. For this cheat sheet, I often show these operations as separate
commands for the sake of clarity.

Please let me know of useful additions or corrections.
[Pull requests are welcome](/media-cheat-sheet).

{% Aside %}
This page contains a few more commands than are covered in this section. Not
only are there plans to cover these topics (we have drafts already), we also
hope this page will be a resource for multiple levels of expertise.
{% endAside %}

## Display characteristics

```bash
packager input=myvideo.mp4 --dump_stream_info

ffmpeg -i myvideo.mp4
```

Technically, FFmpeg always requires an output file format. Calling FFmpeg this
way will give you an error message explaining that; however, it lists
information not available using Shaka Packager.

## Demux (split) audio and video

Shaka Packager requires demuxing when converting files. This is also required
for using media frameworks.

### Shaka Packager

***MP4***

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

***WebM***

```bash
packager \
  input=myvideo.webm,stream=video,output=myvideo_video.webm \
  input=myvideo.webm,stream=audio,output=myvideo_audio.webm
```
### FFmpeg

***MP4***

```bash
ffmpeg -i myvideo.mp4 -vcodec copy -an myvideo_video.mp4
ffmpeg -i myvideo.mp4 -acodec copy -vn myvideo_audio.m4a
```

***WebM***

```bash
ffmpeg -i myvideo.webm -vcodec copy -an myvideo_video.webm
ffmpeg -i myvideo.webm -acodec copy -vn myvideo_audio.webm
```

## Change characteristics

### Bitrate

For FFmpeg, I can do this while I'm converting to mp4 or WebM.

```bash
ffmpeg -i myvideo.mov -b:v 350K myvideo.mp4
ffmpeg -i myvideo.mov -vf setsar=1:1 -b:v 350K myvideo.webm
```

### Dimensions (resolution)

```bash
ffmpeg -i myvideo.webm -s 1920x1080 myvideo_1920x1080.webm
```

### File type

Shaka Packager cannot process mov files and hence cannot be used to convert
files from that format.

***mov to MP4***

```bash
ffmpeg -i myvideo.mov myvideo.mp4
```

***mov to WebM***

```bash
ffmpeg -i myvideo.mov myvideo.webm
```

### Synchronize audio and video

To ensure that audio and video synchronize during playback, insert keyframes.

```bash
ffmpeg -i myvideo.mp4 -keyint_min 150 -g 150 -f webm -vf setsar=1:1 out.webm
```


### Codec

The tables below list common containers and codecs for both audio and video, as
well as the FFmpeg library needed for conversion. A conversion library must be
specified when converting files using FFmpeg.

#### Video

| Codec | Container | Library    |
| ----- | --------- | ---------- |
| av1   | mkv       | libaom-av1 |
|       | WebM      | libaom-av1 |
| h264  | MP4       | libx264    |
| vp9   | WebM      | libvpx-vp9 |

#### Audio

| Codec  | Container | Library    |
| ------ | --------- | ---------- |
| aac    | MP4       | aac        |
| opus   | WebM      | libopus    |
| vorbis | WebM      | libvorbis  |

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

## Packager

### DASH/MPD

Dynamic Adaptive Streaming over HTTP is a
[web-standards-based](https://developer.mozilla.org/en-US/docs/Web/HTML/DASH_Adaptive_Streaming_for_HTML_5_Video)
method of presenting video-on-demand for the web.

```bash
packager \
  input=myvideo.mp4,stream=audio,output=myvideo_audio.mp4 \
  input=myvideo.mp4,stream=video,output=myvideo_video.mp4 \
  --mpd_output myvideo_vod.mpd
```

### HLS

HTTP Live Streaming (HLS) is
[Apple's standard](https://developer.apple.com/streaming/)
for live streaming and video on demand for the web.

```bash
ffmpeg -i myvideo.mp4 -c:a copy -b:v 8M -c:v copy -f hls -hls_time 10 \
        -hls_list_size 0 myvideo.m3u8
```

