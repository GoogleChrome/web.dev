---
layout: post
title: Accessibility with the <track> tag
authors:
  - samdutton
description: |
  TBD
date: 2020-06-10
updated: 2020-06-10
---

Accessibility isn't a feature. Users who can't hear or see won't be able to
experience a video without captions or descriptions. The time it takes to
add these to your video is much less than the bad experience you're delivering
to users. Provide at least a base experience for all users.

### Include captions to improve accessibility

<figure class="w-figure  w-figure--inline-right">
  <img src="./chrome-android-track-landscape-5x3.jpg" alt="Screenshot showing captions displayed using the track element in Chrome on Android">
  <figcaption class="w-figcaption">Screenshot showing captions displayed using the
track element in Chrome on Android</figcaption>
</figure>

To make media more accessible on mobile, include captions or descriptions
using the track element.

### Add track element

It's easy to add captions to your video&ndash;simply add a track
element as a child of the video element:

```html/3
<video controls>
  <source src="https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm" type="video/webm" />
  <source src="https://storage.googleapis.com/webfundamentals-assets/videos/chrome.mp4" type="video/mp4" />
  <track src="chrome-subtitles-en.vtt" label="English captions"
         kind="captions" srclang="en" default>
  <p>This browser does not support the video element.</p>
</video>
```

[Try it](https://googlesamples.github.io/web-fundamentals/fundamentals/media/track.html)

The track element `src` attribute gives the location of the track file.

### Define captions in track file

A track file consists of timed "cues" in WebVTT format:

```
WEBVTT

00:00.000 --> 00:04.000
Man sitting on a tree branch, using a laptop.

00:05.000 --> 00:08.000
The branch breaks, and he starts to fall.

...
```
