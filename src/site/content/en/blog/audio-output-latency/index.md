---
title: Synchronize audio and video playback on the web
subhead: >
  The Web Audio API makes it possible to properly achieve AV synchronization.
date: 2022-06-01
hero: image/vvhSqZboQoZZN9wBvoXq72wzGAf1/9nYDoT45VHvNAtTfLciY.jpeg
alt: A photo of a video editing timeline in Adobe Premiere Pro
authors: 
  - beaufortfrancois
description: >
  The Web Audio API makes it possible to properly achieve AV synchronization.
tags:
  - blog
  - audio
  - media
---

The `outputLatency` property of an `AudioContext` instance provides an estimate of audio hardware's output latency (for example, that of Bluetooth earbuds or of an external USB audio interface). This property is useful when you want to:

- Synchronize the existing audio material and the newly recorded material. (in a music production scenario)
- Synchronize the [Web Audio](https://developer.mozilla.org/docs/Web/API/Web_Audio_API) output and other media (e.g. video or MIDI playback).

In this [WebCodecs demo](https://wc-talk.netlify.app/simple_video_player.html) ([source](https://github.com/chcunningham/wc-talk)), the [WebCodecs API](https://developer.mozilla.org/docs/Web/API/WebCodecs_API) is used to decode a `MediaStream` into raw video and audio data, and then played back into a HTML `<canvas>` element with audio data coming from an [Audio Worklet](https://developer.mozilla.org/docs/Web/API/AudioWorklet). The `outputLatency` property allows the demo to determine when a given audio timestamp is reaching the user's ears and then properly paint video frames to match that.

<figure>
  {% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/p61K2S4Wye34OJn4XZOj.png", alt="A screenshot of the demo, which is of an embedded video with audio controls for volume, audio buffer health, total output latency, and a checkbox to use AudioContext.outputLatency.", width="800", height="533" %}
</figure>

Try it out for yourself, play the video with your favorite Bluetooth headset (🎧), wait for the bird (🐦) (see above), and toggle the checkbox (☑️) to observe audio playback changes. The total output latency value is updated in real time.

### AudioContext outputLatency

{% BrowserCompat 'api.AudioContext.outputLatency' %}

_Hero image by [Wahid Khene](https://unsplash.com/@wahidkhene) on [Unsplash](https://unsplash.com/photos/iKdQCIiSMlQ)._
  
