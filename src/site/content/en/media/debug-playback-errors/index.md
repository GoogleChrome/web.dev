---
layout: post
title: Debug media playback errors on the web
authors:
  - beaufortfrancois
description: |
  Learn how to debug media playback errors on the web.
date: 2022-04-12
tags:
  - media
---

Debugging HTML media elements, such as `<video>` and `<audio>`, can be hard as decoder implementations vary in what they consider errors (hardware decoders generally being the most strict), especially when a playback may use more esoteric features of a particular codec. Luckily for us, there are a variety of tools we can leverage to help.

{% Aside 'objective' %}
The goal of this section is to give you some tools to debug media playback errors on the web.
{% endAside %}

When debugging media playback errors, the first thing we usually check out is the [MediaError] `error` attribute on the HTML media element. This attribute is a high level hint of what caused the media playback error. The property [`MediaError.code`] returns a numeric value which represents the kind of error that occurred on a media element. The other property `MediaError.message` may provide a string with some diagnostic information from the browser.

```js
const video = document.querySelector('video');
video.addEventListener('error', () => {
  console.log('Error code: ' + video.error.code);
  console.log('Error message: ' + video.error.message);
});
```

These properties are most useful for telemetry analysis, and may not always provide enough information to debug playback errors. For privacy reasons, the full error text must sometimes be omitted.

To access complete error information use the Chrome DevTools ["Media Panel"] to view media logs. You will find plenty of information such as events, warnings, and error messages that will give you some good hints of the media playback errors.

<figure>
  {% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/rD4O3Aqj42MAMxHbBK4X.png", alt="Screenshot of the Media Panel in Chrome DevTools", width="800", height="375" %}
  <figcaption>Media Panel in Chrome DevTools.</figcaption>
</figure>

You can also use the [FFmpeg] free application to [check media file integrity] thanks to this command:

```bash
ffmpeg -err_detect explode -i <file> -f null -
```

Here are some errors you could get with these commands for a video file with invalid codec:

```bash
[mov,mp4,m4a,3gp,3g2,mj2 @ 0x7fc62df05380] Could not find codec parameters for stream 0 (Video: none (zzzz / 0x7A7A7A7A), none(smpte170m/smpte170m/bt709, progressive), 320x240, 4 kb/s): unknown codec
Consider increasing the value for the 'analyzeduration' (0) and 'probesize' (5000000) options
```

```bash
[matroska,webm @ 0x7fd45b705380] Unknown EBML doctype '0000'
```

```bash
[matroska,webm @ 0x7f8d17904d40] Element at 0x8b ending at 0x10400000095 exceeds containing master element ending at 0x9b
Truncating packet of size 9069 to 94
```

The [MP4Box.js / ISOBMFF Box Structure Viewer] is a useful tool to debugging bitstream issues. It does require already understanding MP4 to use though.

Finally, some video stream analysis professional tools like [VQAnalyzer], [Elecard StreamEye], and [Codecian CodecVisa], may be worth your money.

[mediaerror]: https://developer.mozilla.org/en-US/docs/Web/API/MediaError
[`mediaerror.code`]: https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code#media_error_code_constants
["media panel"]: https://developer.chrome.com/docs/devtools/media-panel/
[ffmpeg]: /media-application-basics/#ffmpeg
[check media file integrity]: https://www.ffmpeg.org/ffmpeg-codecs.html#:~:text=err_detect
[mp4box.js / isobmff box structure viewer]: https://gpac.github.io/mp4box.js/test/filereader.html
[vqanalyzer]: https://vicuesoft.com/vq-analyzer/
[elecard streameye]: https://www.elecard.com/products/video-analysis/streameye
[codecian codecvisa]: http://www.codecian.com/
