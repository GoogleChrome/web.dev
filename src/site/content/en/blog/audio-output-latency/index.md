---
title: Synchronize audio and video playback on the web
subhead: >
  A new Web Audio feature makes it possible to properly achieve AV-sync.
date: 2022-05-25
hero: image/vvhSqZboQoZZN9wBvoXq72wzGAf1/9nYDoT45VHvNAtTfLciY.jpeg
alt: Flat screen TV turn on inside room photo
authors: 
  - beaufortfrancois
description: >
  A new Web Audio feature makes it possible to properly achieve AV-sync.
tags:
  - blog
  - audio
  - media
---

The `outputLatency` property of an `AudioContext` instance provides an estimate of audio hardware’s output latency (e.g. Bluetooth earbuds or USB external audio interface). This property is necessary to coordinate/compensate the latency from the input to the output. And it is also very useful when you need to synchronize a video stream and an audio stream produced by the [Web Audio API](https://developer.mozilla.org/docs/Web/API/Web_Audio_API). The process of synchronizing video and audio streams together is called [AV-sync](https://en.wikipedia.org/wiki/Audio-to-video_synchronization).

In [Chris Cunningham's demo](https://github.com/chcunningham/wc-talk/blob/main/simple_video_player.html), [WebCodecs](https://developer.mozilla.org/docs/Web/API/WebCodecs_API) is used to decode a `MediaStream` into raw video and audio data, and then played back into a HTML canvas element with audio data coming from the Web Audio API. The `outputLatency` property allows the demo to determine when a given audio timestamp is reaching the user's ears and then properly paint video frames to match that.

{% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/p61K2S4Wye34OJn4XZOj.png", alt="A screenshot of the demo", width="800", height="533" %}

Try it out for yourself, play the video with your favorite Bluetooth headset 🎧, wait for the bird 🐦 (see above), and toggle the checkbox ☑️ to observe audio playback changes. The total output latency value is updated in real-time.

### AudioContext outputLatency

{% BrowserCompat 'api.AudioContext.outputLatency' %}

Hero image by [Wahid Khene](https://unsplash.com/@wahidkhene) on [Unsplash](https://unsplash.com/photos/iKdQCIiSMlQ)
  