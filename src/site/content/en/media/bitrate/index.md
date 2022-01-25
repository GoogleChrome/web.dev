---
layout: post
title: Bitrate
authors:
  - joemedley
  - derekherman
description: |
  Bitrate is the maximum number of bits used to encode one second of a stream.
  The more bits used to encode a second of stream, the higher the fidelity.
date: 2017-06-30
updated: 2021-07-05
tags:
  - media
  # - video
---

In the previous [Containers and codecs](/containers-and-codecs/) article, you
learned how to change the container (extension) and codec of a media file. In
this article, we'll show you how to change bitrate before explaining
[resolution](/resolution/).

Bitrate and resolution correlate to the amount of data in a media file. It
probably goes without saying, but we're going to say it anyway. You can always
lower bitrate and resolution, but increasing them is a problem. Without special
software and algorithms, quality is going to take a hit.

So always start your conversion process with the highest quality source file you
can get your hands on. Before doing anything, even before changing the codec or
container, check the file's
[display characteristics](/media-conversion/#display-characteristics) and verify
that your source file has a higher bitrate or resolution than your desired result.

**Bitrate** is the maximum number of bits used to encode one second of a media
stream. The more bits used to encode a second of stream, the higher the
fidelity.

Unsurprisingly, the different bitrates the web can handle are low. The table
below shows you what bitrate you should target for common network conditions. For
the sake of comparison, we've thrown in values for Blu-rays and DVDs.

{% Aside 'warning' %}
The web numbers are approximations. This chart should **not** be a substitute for
doing your own testing.
{% endAside %}

| Delivery method | Bitrate |
| --------------- | ------- |
| Blu-ray | 20Mbs |
| DVD | 6 Mbs |
| Desktop web | 2 Mbs |
| 4G mobile | 0.7 Mbs |
| 3G mobile | 0.35 Mbs |
| 2G mobile | **Depends on network type.**<br><br>EDGE: 0.4 Mbs<br>GPRS: 0.04Mbs |

Which value should I use for video on my web pages? The short answer is at
least: desktop, 4G, and 3G. If you're serving video in one of the markets
referred to as "the next billion users", say India, for example, you'll want to
include 2G as well. For demonstration purposes, we're going to target 3G.

Using FFmpeg you set the bitrate with the (surprise!) bitrate (`-b`) flag.

If you don't have FFmpeg installed read
[Media application basics](/media-application-basics/#installing-applications-with-docker)
to get it set up with Docker.

1. MP4

    ```bash
    /media # ffmpeg -i glocken.mov -b:v 350k -b:a 64k glocken_3g.mp4
    ```

1. WebM

    ```bash
    /media # ffmpeg -i glocken.mov -b:v 350k -b:a 64k glocken_3g.webm
    ```

Notice that there are two bitrate flags, `-b:a` and `-b:v`. One is for the audio
stream, and the other is for the video stream.

```bash
/media # ls -l
-rw-r--r-- 1 root root  12080306 Mar  7 12:16 glocken.mov
-rwx------ 1 root root    531117 Mar  7 13:42 glocken_3g.mp4
-rwx------ 1 root root    706119 Mar  7 13:46 glocken_3g.webm
```

Now that your files are prepared, it's time to [adjust their resolutions](/resolution).
