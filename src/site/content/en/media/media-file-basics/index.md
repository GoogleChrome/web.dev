---
layout: post
title: Media file basics
authors:
  - joemedley
  - derekherman
description: |
  You might think that you can take a video from a camera and upload it to the web as
  is. Preparing a video for serving from your own site is a bit more
  complicated.
date: 2020-06-19
updated: 2021-07-05
tags:
  - media
  - video
---

In this article you will learn about media file basics such as the concepts of a
container, and a few of the many available codec formats that you can use in a
stream. Plus lightly touch on topics such as adaptive streaming, bitrate, and
resolution—but we'll dive deeper into all these in later sections.

## Serving video files

You might think that you can take a raw file from a video camera and just upload
it to the web as-is. Indeed, video streaming sites such as [YouTube] or [Vimeo]
let you do just that, and even provide live-streaming capabilities—typically by
connecting to your camera's HDMI port and then processing it through a capture
card. These services greatly simplify video processing and uploading, which
includes generating the many files and manifests needed for adaptive streaming
and various resolutions. Plus the many other complicated and nuanced requirements
that make self-hosting a bit of a chore. Preparing and serving a video from your
own site, and likely a separate media server, is a bit more complicated than just
uploading a raw camera file if you care how your users experience your site.

Video files come in a variety of formats. The format that comes off your camera is
typically a `.mov` file, or an `.mp4` if you have a good modern mirrorless camera.
However, while a `.mov` is good for recording and for editing and other early
post-production processes, the file size means it's not good for streaming over
the web. As well, the file size of a raw `.mp4` in 4K is going to make playing that
file on mobile very prohibitive. Because browsers support different file formats,
you'll need to create multiple optimized files and potentially a manifest if you
plan to support adaptive streaming. Before converting files you need to understand
a few basics about them and about their characteristics.

## Containers and codecs, and streams?

The file that you see in your operating system shell is a _container_,
identified by a file extension (`.mp4`, `.webm`, `.ogg` etc.). The container
houses one or more _streams_. A media file can have any number of streams, of
many more [formats] than we'll go into here.

The sample files used later in this section contain at most two streams: an
audio stream and a video stream. Among the other types you might encounter are
captions and data, both of which are beyond the scope of this article. There are
instances where audio and video streams are dealt with separately. Most files
you'll encounter will only contain a single audio stream and a single video
stream.

Within the audio and video streams, the actual data is compressed using a codec.
A _codec_, or coder/decoder, is a compression format for video or audio data. The
distinction between a container and a codec is important because files with the
same container can have their contents encoded with different codecs.

The image below illustrates this structure. On the left is the basic container
structure with two streams. On the right are the specifics of that structure for
a single WebM file.

<figure class="w-figure  w-figure--inline-right">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QwNEBBa8LEMpedJh5imG.png", alt="Comparing media file structure with a hypothetical media file.", width="560", height="250" %}
  <figcaption class="w-figcaption">Parts of a media file.</figcaption>
</figure>

Files in WebM containers can be orders of magnitude smaller than other formats,
making them a good choice for mobile sites to stream. Unfortunately, not all
browsers support up-to-date containers and codecs. For example, WebM was created
specifically for the web as a high-quality and open source option, but its support
is not yet universal. Safari in particular does not, according to [Can I use] at
the time of this writing, support WebM for embedded video. However, WebM does have
partial support with the VP8 and VP9 codec used in WebRTC. So your best option is
to provide a fallback video.

{% Aside %}
All modern browsers support MP4 files, making them a good general choice for a
media container and the best choice as the backup container for WebM.
{% endAside %}

### Codec formats

Many file types support multiple codecs within the same container. A complete list
of available [video codecs] and [audio codecs] would be a whole website to itself.
The links just provided are for MDN's practical lists of what's usable on the web.
Listed below are the currently preferred file types, and the codecs they might use.
Follow the file type links to view the browsers that support them.

| File type | Video Codec | Audio Codec |
| ---- | ----- | ---- |
| [MP4] | [AV1], [AVC (H.264)]*, [VP9] | [AAC] |
| [WebM] | [AV1], [VP9]* | [Vorbis], [Opus] |

&#42; Indicates the preferred video codec.

## Bitrate and resolution

**Bitrate** is the maximum number of bits used to encode one second of a stream.
The more bits used to encode a second of stream, the higher the potential detail
and fidelity. We provide more information about this concept in [Bitrate](/bitrate/).

**Resolution** is the amount of information in a single frame of video, given as
the number of logical pixels in each dimension. We provide more information about
this concept in [Resolution](/resolution/).

Up next, in [Media application basics](/media-application-basics/), we'll show you
how to examine these characteristics using two command line tools: Shaka Packager
and FFmpeg.

[YouTube]: https://www.youtube.com/
[Vimeo]: https://vimeo.com/
[formats]: https://developer.mozilla.org/en-US/docs/Web/Media/Formats
[Can I Use]: https://caniuse.com/#feat=webm
[video codecs]: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs
[audio codecs]: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs
[MP4]: https://caniuse.com/#search=mp4
[WebM]: https://caniuse.com/#feat=webm
[AV1]: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs#AV1
[AVC (H.264)]: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs#AVC_H.264
[VP9]: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs#VP9
[AAC]: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs#AAC
[Vorbis]: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs#Vorbis
[Opus]: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs#Opus
