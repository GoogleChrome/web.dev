---
layout: post
title: Prepare media files for the web
description: |
  TBD
date: 2017-06-30
updated: 2020-05-21
tags:
  - FFmpeg
  - files
  - Shaka
---

Now that I've introduced you to [applications used for manipulating media
files](../application-basics), over the next few pages, I'm going to take a raw
video file off a camera and transform it into an encrypted resource that you can
embed in a web page. I'm specifically going to show you how to format your video
for mobile playback, and how to create multiple files to cover a range of
browsers.

{% Aside %}
This section provides explanations of file manipulation concepts,
with command lines only to illustrate the concepts. There is a companion [cheat
sheet](../cheatsheet) that shows more commands and is designed as a quick reference
for someone who knows the concepts.
{% endAside %}

The result of this procedure will be media resources with the following
characteristics:

+  Versions of a media file in common web-friendly formats containing both audio
   and video streams.
+  A bitrate of 0.35 Megabits per second (Mbs).
+  Resolution of 640 by 360.
+  Encrypted.
+  Viewable on all major browsers using appropriate technologies.

By "appropriate technologies" I mean [Dynamic Adaptive Streaming over HTTP
(DASH)](https://developer.mozilla.org/en-US/docs/Web/HTML/DASH_Adaptive_Streaming_for_HTML_5_Video)
or [HTTP Live Streaming
(HLS)](https://developer.apple.com/documentation/http_live_streaming), which are
the two primary means of providing video in HTML on the major browsers. What
those terms mean and how to use them is a whole topic itself. I won't be getting
into those, but by the end of this article, you'll be able to create media files
that are ready for use in DASH and HLS.

One final note: my selection of the file formats, bitrate, and resolution are
not arbitrary. I've selected these values for speedy playback on the mobile web.

If you want to play along at home, you'll need a raw video file off a camera,
preferably one that contains both audio and video. If you don't have one handy,
then here's [ten seconds of an mov
file](https://storage.googleapis.com/webfundamentals-assets/fundamentals/media/videos/glocken.mov)
that I took of the
[Rathaus-Glockenspiel](https://en.wikipedia.org/wiki/Rathaus-Glockenspiel)
in Munich's MarienPlatz.

