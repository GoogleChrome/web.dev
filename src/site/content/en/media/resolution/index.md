---
layout: post
title: Resolution
authors:
  - joemedley
description: |
  Resolution is the amount of information in a frame of video.
date: 2017-06-30
updated: 2020-08-27
tags:
  - media
  - video
---

In previous sections I showed you how to change a media file's [codec,
containers](/containers-and-codecs), and [bitrate](/bitrate). This page
covers resolution. Then I'll move on to [adding them to a web
page](/add-media).

_Resolution_ is the amount of information in a single frame of video, given as
the number of logical pixels in each dimension. For example, a resolution of
1920 by 1080 works out to 1080 stacked horizontal lines, each of which is one
logical pixel high and 1920 logical pixels wide. This resolution is frequently
abbreviated 1080p because technically the width can vary. The dimensions 1080 by
1920 produce an [aspect
ratio](https://en.wikipedia.org/wiki/Aspect_ratio_(image)) of 16:9, which is the
ratio of movie screens and modern television sets. By the way this is the
resolution defined as [full
HD](https://www.google.com/search?q=what+is+hd+resolution&oq=what+is+hd+resolution&aqs=chrome.0.0l6.3183j0j8&sourceid=chrome&ie=UTF-8#q=full+hd+resolution).

[YouTube recommends](https://support.google.com/youtube/answer/6375112) the
following resolutions for video uploads, all in the 16:9 aspect ratio. There's
nothing specific to YouTube about this list. It's just a list of common 16:9
video resolutions.

| Abbreviation | Dimensions |
| ------------ | ---------- |
| 2160p | 3840 x 2160 |
| 1440p | 2560 x 1440 |
| 1080p | 1920 x 1080 |
| 720p | 1280 x 720 |
| 480p | 854 x 480 |
| 360p | 640 x 360 |
| 240p | 426 x 240 |

Which one should you use? That depends on your application. For simple embedding
you may chose a single resolution. If you're preparing files for DASH or HLS,
you may chose one, several, or all. Fortunately, this is one of the simplest
transformations you'll make with FFmpeg.

```bash
ffmpeg -i glocken.webm -s 640x360 glocken_640x360.webm
```

It's worth reiterating that you should start from the highest resolution and
bitrate file you have available. If you're upgrading an older site, you'll want
to find your original camera or other high resolution sources and convert from
that rather than from your older web site files (for example, flv or f4v files).

Now that your files are prepared, it's time to [add them to a web
page](/add-media).
