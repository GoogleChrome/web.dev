---
layout: post
title: Bitrate
description: |
  Bitrate_ is the maximum number of bits used to encode one second of a stream.
  The more bits used to encode a second of stream, the higher the fidelity.
date: 2017-06-30
updated: 2020-06-10
---


I've unpeeled the onion. Yet if you compare what I've done to the list of stated
goals you'll see that I'm not quite done. Among the remaining items are bitrate
and resolution. These properties correlate to the amount of data in a media
file. It probably goes without saying, but I'm going to say it anyway, that you
can always lower bitrate and resolution, but increasing them is a problem.
Without special software and algorithms, quality is going to take a hit.

The first step in changing bitrate and resolution is to [display the file
characteristics](/web/fundamentals/media/manipulating/cheatsheet#display_characteristics)
and verify that your source file has a higher bitrate or resolution than your
desired result.


##

_Bitrate_ is the maximum number of bits used to encode one second of a stream.
The more bits used to encode a second of stream, the higher the fidelity.

Unsurprisingly, bitrates for the web are low. The table below compares web
bitrates with common home video formats. Values are given in megabits per second
(Mbs).

Note: The web numbers are approximations. This chart should not be a substitute for
doing your own testing.

| Format | Bitrate |
| ------ | ------- |
| Blu-ray | 20Mbs |
| DVD | 6 Mbs |
| Desktop web video | 2 Mbs |
| 4G mobile video | 0.7 Mbs |
| 3G mobile video | 0.35 Mbs |
| 2G mobile video | Depends on network type.<ul><li>EDGE: 0.4 Mbs</li><li>GPRS: 0.04Mbs</li></ul> |

Which value should I use for video on my web pages? The short answer is at least
desktop, 4G, and 3G. If you're serving video in one of the markets referred to
as "the next billion users", say India, for example, you'll want to include 2G
as well. For demonstration purposes, I'm going to target 3G.

In FFmpeg you set the bitrate with the (surprise!) bitrate (`-b`) flag.

```bash
ffmpeg -i glocken.mov -b:v 350k glocken.mp4
ffmpeg -i glocken.mov -b:a 64k glocken.m4a
```

Notice that there are two bitrate flags, `-b:a` and `-b:v`. One is for audio and the
other is for video.

