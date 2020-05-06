---
layout: post
title: Resolution
description: |
  Resolution is the amount of information in a frame of video.
date: 2017-06-30
updated: 2020-5-15
---

_Resolution_ is the amount of information in a single frame of video, given as
the number of logical pixels in each dimension. [Youtube
recommends](https://support.google.com/youtube/answer/6375112) the following
resolutions for video uploads, all in the 16:9 aspect ratio. There's nothing
specific to Youtube about this list. It's just a list of common 16:9 video
resolutions.

| Abbreviation | Dimensions |
| ------------ | ---------- |
| 2160p | 3840x2160 |
| 1440p | 2560x1440 |
| 1080p | 1920x1080 |
| 720p | 1280x720 |
| 480p | 854x480 |
| 360p | 640x360 |
| 240p | 426x240 |

Which one do I use? That depends on your application. For simple embedding you
may chose a single resolution. If you're preparing files for DASH or HLS, you
may chose one, several, or all. Fortunately, this is one of the simplest
transformations you'll make with FFmpeg.

```bash
ffmpeg -i glocken.webm -s 640x360 glocken_640x360.webm
```

It's worth reiterating that you should start from the highest resolution and
bitrate file you have available. If you're one of the many who are now
converting your sites from using Flash videos to HTML5 videos, you'll want to
find your original camera or other high resolution sources and convert from that
rather than from flv and f4v files.


