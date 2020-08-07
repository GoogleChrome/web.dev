---
layout: post
title: Accessibility with the <track> tag
authors:
  - petelepage
  - samdutton
description: |
  Accessibility isn't like icing on a cake. It's never anything you put on a backlog with the hope of introducing later.

  Accessibility isn't a feature. Users who can't hear or see won't be able to
  experience a video without captions or descriptions. The time it takes to add
  these to your video is much less than the bad experience you're delivering to
  users.
date: 2014-14-15
updated: 2020-08-20
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
fo this article.

<figure class="w-figure  w-figure--inline-right">
  <img src="./chrome-android-track-landscape-5x3.jpg" alt="Screenshot showing captions displayed using the track element in Chrome on Android">
  <figcaption class="w-figcaption">Screenshot showing captions displayed using the
track element in Chrome on Android</figcaption>
</figure>

An example `<video>` tag with two `<track>` tags is shown below. There's also a sample you can play with on [glitch](https://track-demonstration.glitch.me)

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

### Define captions in track file

A track file consists of timed "cues" in WebVTT format:

```text
WEBVTT

00:00.000 --> 00:04.000
Man sitting on a tree branch, using a laptop.

00:05.000 --> 00:08.000
The branch breaks, and he starts to fall.

...
```
