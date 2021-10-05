---
layout: post
title: Prepare media files for the web
authors:
  - joemedley
  - derekherman
description: |
  In this section you'll learn how to format video for mobile web playback, and how
  to create multiple files to cover a range of browsers, plus how to encrypt them.
date: 2017-06-30
updated: 2021-07-05
tags:
  - media
  # - video
---

Now that we've introduced you to the [applications](/media-application-basics/)
we use when manipulating media files, over the next few pages, we're going to
take a raw video file from a camera and transform it into a resource that you
can embed in a web page. We're going to show you how to format your
video for mobile web playback, and how to create multiple files to cover a
range of browsers. Specifically, we'll create a WebM file for use on Chrome and
an MP4 file for use on other browsers.

{% Aside 'objective' %}
The result of this section will be media resources with the following
characteristics:

* Versions of a media file in common web-friendly formats containing both audio
  and video streams.
* A [**Resolution**](/resolution/) appropriate for your users' devices.
* A [**Bitrate**](/bitrate/) that doesn't overload your users' network bandwidth.
* A result that's viewable on all major browsers using **appropriate technologies**.
{% endAside %}

Plus we will dive deeper into common commands used for
[Media conversion](/media-conversion/) and [Media encryption](/media-encryption/)
that will serve as a good reference for later.

By "**appropriate technologies**" we mean Dynamic Adaptive Streaming over HTTP
([DASH]) or HTTP Live Streaming ([HLS]), which are the two primary means of
providing video in HTML on the major browsers. By the end of this section,
you'll be able to create media files that are ready for use in DASH and HLS.

If you want to play along at home, you'll need a raw video file off a camera,
preferably one that contains both audio and video. If you don't have one handy,
then here's ten seconds of an `.mov` file named [glocken.mov] that was taken of
the [Rathaus-Glockenspiel] in Munich's MarienPlatz.

{% Aside %}
The selection of the file formats, bitrate, and resolution are not arbitrary.
We've selected these values for speedy web playback on mobile devices.
{% endAside %}

Next, let's get started with [Containers and codecs](/containers-and-codecs/).

[DASH]: https://developer.mozilla.org/docs/Web/HTML/DASH_Adaptive_Streaming_for_HTML_5_Video
[HLS]: https://developer.apple.com/documentation/http_live_streaming
[glocken.mov]: https://storage.googleapis.com/web-dev-assets/prepare-media/glocken.mov
[Rathaus-Glockenspiel]: https://en.wikipedia.org/wiki/Rathaus-Glockenspiel
