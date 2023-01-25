---
layout: post
title: Resolution
authors:
  - joemedley
  - derekherman
description: |
  Resolution is the amount of information in a frame of video.
date: 2017-06-30
updated: 2021-07-05
tags:
  - media
  # - video
---

In the previous articles you learned how to change the
[containers, codecs](/containers-and-codecs/), and [bitrate](/bitrate/) of the
[glocken.mov] media file. This article focuses on changing the resolution.

**Resolution** is the amount of information in a single frame of video, given as
the number of logical pixels in each dimension. For example, a resolution of
1920 by 1080 works out to 1080 stacked horizontal lines, each of which is one
logical pixel high and 1920 logical pixels wide. This resolution is frequently
abbreviated 1080p because technically the width can vary. The dimensions 1080 by
1920 produce an [aspect ratio] of 16:9, which is the ratio of movie screens and
modern television sets. By the way this is the resolution defined as [full HD].

[YouTube recommends] the following resolutions for video uploads, all in the 16:9
aspect ratio. There's nothing specific to YouTube about this list. It's just a
list of common 16:9 video resolutions.

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
you may decide to chose only a single resolution. If you're preparing files for
DASH or HLS, you may chose one, several, or all. Fortunately, this is one of the
simplest transformations you'll make with FFmpeg.

If you don't have FFmpeg installed read
[Media application basics](/media-application-basics/#installing-applications-with-docker)
to get it set up with Docker.

1. MP4

    ```bash
    /media # ffmpeg -i glocken.mov -b:v 350k -b:a 64k -s 1280x720 glocken_3g_720p.mp4
    ```

1. WebM

    ```bash
    /media # ffmpeg -i glocken.mov -b:v 350k -b:a 64k -s 1280x720 glocken_3g_720p.webm
    ```

The following files should now exist:

```bash
/media # ls -l
-rw-r--r-- 1 root root  12080306 Mar  7 12:16 glocken.mov
-rwx------ 1 root root    531117 Mar  7 13:42 glocken_3g.mp4
-rwx------ 1 root root    706119 Mar  7 13:46 glocken_3g.webm
-rwx------ 1 root root    539414 Mar  7 14:15 glocken_3g_720p.mp4
-rwx------ 1 root root    735930 Mar  7 14:19 glocken_3g_720p.webm
```

It's worth reiterating that you should start from the highest resolution and
bitrate file you have available. If you're upgrading an older site, you'll want
to find your original camera or other high resolution sources and convert from
that rather than from older web files.

Now that your files are prepared, you can either [add them to a web page](/add-media/)
as they are now or dive a bit deeper and continue to learn more command line options
by reading the [Media conversion](/media-conversion/) page, and then close out the
section with [Media encryption](/media-encryption/).

[glocken.mov]: https://storage.googleapis.com/web-dev-assets/prepare-media/glocken.mov
[aspect ratio]: https://en.wikipedia.org/wiki/Aspect_ratio_(image)
[full HD]:https://en.wikipedia.org/wiki/1080p
[YouTube recommends]: https://support.google.com/youtube/answer/6375112
