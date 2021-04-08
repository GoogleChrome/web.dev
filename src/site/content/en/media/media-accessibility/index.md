---
layout: post
title: Media accessibility
authors:
  - joemedley
description: |
  Accessibility isn't like icing on a cake. It's never anything you put on a
  backlog with the hope of introducing later. Captions and screen reader
  descriptions are the only way many users can experience your videos, and in
  some jurisdictions, they're even required by law or regulation.
date: 2020-08-20
updated: 2020-08-27
tags:
  - media
  - video
  - accessibility
---

Accessibility isn't like icing on a cake. It's never anything you put on a
backlog with the hope of introducing it later. Captions and screen reader
descriptions are the only way many users can experience your videos, and in some
jurisdictions, they're even required by law or regulation.

To add captions or screen reader descriptions to a web video, add a
[`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track) tag
to a `<video>` tag. In addition to captions and screen reader descriptions, tags
may also be used for subtitles and chapter titles. The can also help search
engines understand what's in a video. Those capabilities are outside the scope
of this article.

<figure class="w-figure  w-figure--inline-right">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vbNDp5R05MwQmsxZ0RLI.jpg", alt="Screenshot showing captions displayed using the track element in Chrome on Android", width="800", height="480" %}
  <figcaption class="w-figcaption">Screenshot showing captions displayed using the
track element in Chrome on Android</figcaption>
</figure>

An example `<video>` tag with two `<track>` tags is shown below. There's also a
sample you can [view on Glitch](https://track-demonstration.glitch.me)
([source](https://glitch.com/edit/#!/track-demonstration)).

To add captions to your video add a track element as a child of the video
element:

```html/3
<video controls>
  <source src="https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm" type="video/webm" />
  <source src="https://storage.googleapis.com/webfundamentals-assets/videos/chrome.mp4" type="video/mp4" />
  <track src="chrome-subtitles-en.vtt" label="English captions"
         kind="captions" srclang="en" default>
  <track src="chrome-subtitles-zh.vtt" label="中文字幕"
         kind="captions" srclang="zh">
  <p>This browser does not support the video element.</p>
</video>
```

The `<track>` tag is similar to the `<source>` element in that both have a `src`
attribute that points to referenced content. For a `<track>` tag, it points to a
[WebVTT file](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API).  The
`label` attribute specifies the how a particular track will be identified in the
interface. To provide tracks for multiple languages add a separate `<track>` tag
for each WebVTT file you're providing and indicate the language using the
`srclang` attribute. The `default` attribute indicates which language track is
the default.

## Define captions in track file

Below is a hypothetical WebVTT file for the demo linked to above. The file is a text file containing a series of *cues*. Each cue is a block of text to display on screen and the time range during which it will be displayed.

```text
WEBVTT

00:00.000 --> 00:04.999
Man sitting on a tree branch, using a laptop.

00:05.000 --> 00:08.000
The branch breaks, and he starts to fall.

...
```

Each item in a track file is called a cue. Each cue has a start time and end
time separated by an arrow, with cue text in the line below. Cues can optionally
also have IDs: `railroad` and `manuscript` in the example below. Cues are
separated by an empty line.

```text
WEBVTT

railroad
00:00:10.000 --> 00:00:12.500
Left uninspired by the crust of railroad earth

manuscript
00:00:13.200 --> 00:00:16.900
that touched the lead to the pages of your manuscript.
```

Cue times are in hours:minutes:seconds:milliseconds format. Parsing is strict.
Numbers must be zero padded if necessary: hours, minutes, and seconds must have
two digits (00 for a zero value) and milliseconds must have three digits (000
for zero). There is an excellent WebVTT validator at [Live WebVTT
Validator](https://quuz.org/webvtt/), which checks for errors in time
formatting, and problems such as non-sequential times.

You can create a VTT file by hand, thought there are [services that will create
them for you](https://www.google.com/search?q=webvtt+services).
