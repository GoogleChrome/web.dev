---
layout: post
title: Containers
description: |
  Let's take a raw video file off a camera and transform it into an encrypted res
date: 2017-06-30
updated: 2020-04-30
---

Now that I've introduced you to applications that do media file
manipulation, I'm going to take a raw video file off a camera and transform it
into an encrypted resource that you can play back using a video library such as
[Google's Shaka Player](https://shaka-player-demo.appspot.com/demo/). I'm
specifically going to show you how to format your video for mobile playback.

Objective: This article provides explanations of file manipulation concepts,
with command lines only to illustrate the concepts. There is a companion [cheat
sheet](cheatsheet) that shows more commands and is designed as a quick reference
for someone who knows the concepts.

To be more specific about the goals, the result of the procedures described here
will be media resources with the following characteristics:

+  Audio and video streams are split into separate files
+  Versions of the video file are in mp4 and webm format
+  Versions of the audio file are in m4a and webm format
+  A bitrate of 0.35 Megabits per second (Mbs)
+  Resolution of 640 by 360
+  Encrypted
+  Viewable on all major browsers using appropriate technologies

By "appropriate technologies" I mean **DASH** and **HLS**, which are the two
primary means of providing video in HTML on the major browsers. What those terms
mean and how to use them is a whole topic itself. I won't be getting into those,
but by the end of this article, you'll be able to create media files that are
ready for use in DASH and HLS.

One final note: selection of the file formats, bitrate and resolution are not
arbitrary. I've selected these values for speedy playback on the mobile web.

If you want to play along at home, you'll need a raw video file off a camera,
preferably one that contains both audio and video. If you don't have one handy,
then here's
<a href="https://storage.googleapis.com/webfundamentals-assets/fundamentals/media/videos/glocken.mov">ten seconds of an mov file</a>
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
_codec_. As we'll see later, the distinction between a container and a codec is
important as files with the same container can have their contents encoded with
different codecs.

(If these terms are new
to you, I explain them in
[Media file characteristics](/web/fundamentals/media/manipulating/applications#media_file_characteristics).)

The image below illustrates this. On the left is the basic structure. On the
right are the specifics of that structure for an mp4. I'll explain file
manipulation by moving downward through these layers.

![Media container onion](images/media-container-onion.png)

## Change the container

Let's start by changing the file container. You'll recall that we're starting
with a file that has an mov extension. I'm going to use FFmpeg to change the
container type from mov to mp4 and webm. In actual practice, you would likely
specify a codec at the same time. For this lesson, I'm letting FFmpeg use its
defaults.

```bash
ffmpeg -i glocken.mov glocken.mp4
```

Note: To create this article, I used FFmpeg version 3.2.2-tessus.

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

This is a good place to remind you that you can verify the results of any task
in this article using the same applications you're using to do the work.
Remember that, as [described in the primers](applications), you'll need both
FFmpeg and Shaka Packager since neither shows you everything.

```bash
packager input=glocken.mp4 --dump_stream_info
```

```bash
ffmpeg -i glocken.mp4
```




