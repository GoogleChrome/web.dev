---
layout: post
title: The <video> tag
description: |
  TBD
date: 2014-14-15
updated: 2020-06-10
---

Add the `video` element to load, decode, and play video in your site:

---EMBEDD HERE---

```html
<video src="chrome.webm" type="video/webm">
    <p>Your browser does not support the video element.</p>
</video>
```

### Specify multiple file formats

Not all browsers support the same video formats. The `<source>` element lets
you specify multiple formats as a fallback in case the user's browser  doesn't
support one of them.

For example:

```html
<video controls>
  <source src="https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm" type="video/webm">
  <source src="https://storage.googleapis.com/webfundamentals-assets/videos/chrome.mp4" type="video/mp4">
  <p>This browser does not support the video element.</p>
</video>
```


[Try it](https://googlesamples.github.io/web-fundamentals/fundamentals/media/video-main.html)

When the browser parses the `<source>` tags, it uses the optional `type`
attribute to help decide which file to download and play. If the browser
supports `WebM`, it plays chrome.webm; if not, it checks whether it can play
MPEG-4 videos.

Check out [A Digital Media Primer for Geeks](//www.xiph.org/video/vid1.shtml) to
find out more about how video and audio work on the web.

This approach has several advantages over serving different HTML or server-side
scripting, especially on mobile:

* Developers can list formats in order of preference.
* Native client-side switching reduces latency; only one request is made to
  get content.
* Letting the browser choose a format is simpler, quicker, and potentially
  more reliable than using a server-side support database with user-agent detection.
* Specifying each file source's type improves network performance; the browser can select a
  video source without having to download part of the video to "sniff" the format.

All of these points are especially important in mobile contexts, where bandwidth
and latency are at a premium and the user's patience is likely to be limited.
Not including a type attribute can affect performance when there are
multiple sources with unsupported types.

Using your mobile browser developer tools, compare network activity
[with type attributes](https://googlesamples.github.io/web-fundamentals/fundamentals/media/video-main.html)
and [without type attributes](https://googlesamples.github.io/web-fundamentals/fundamentals/design-and-ux/responsive/notype.html).

Also check the response headers in your browser developer tools to
[ensure your server reports the right MIME type](//developer.mozilla.org/en/docs/Properly_Configuring_Server_MIME_Types);
otherwise video source type checks won't work.

### Specify start and end times

Save bandwidth and make your site feel more responsive: use the Media
Fragments API to add start and end times to the video element.

---EMBED HERE---

To add a media fragment, you simply add `#t=[start_time][,end_time]` to the
media URL. For example, to play the video between seconds 5 through 10,
specify:

```html
<source src="video/chrome.webm#t=5,10" type="video/webm">
```

You can also use the Media Fragments API to deliver multiple views on the same
video&ndash;like cue points in a DVD&ndash;without having to encode and
serve multiple files.


Caution: Most platforms except iOS support the Media Fragments API. Also, make
sure that your server supports Range Requests. By default, most servers enable
Range Requests, but some hosting services may turn them off.

Using your browser developer tools, check for `Accept-Ranges: bytes` in the
response headers:

<img class="center" alt="Chrome DevTools screenshot: Accept-Ranges: bytes"
src="images/Accept-Ranges-Chrome-Dev-Tools.png">

### Include a poster image

Add a poster attribute to the `video` element so that your users have an idea
of the content as soon as the element loads, without needing to download
video or start playback.

```html
<video poster="poster.jpg" ...>
  ...
</video>
```


A poster can also be a fallback if the video `src` is broken or if none of the
video formats supplied are supported. The only downside to poster images is
an additional file request, which consumes some bandwidth and requires
rendering. For more information see [Image Optimization](/web/fundamentals/performance/optimizing-content-efficiency/image-optimization).

Here's a side-by-side comparison of videos without and with a poster
image&ndash;we've made the poster image grayscale to prove it's not the video:

<div class="attempt-left">
  <figure>
    <img alt="Android Chrome screenshot, portrait: no poster"
    src="images/Chrome-Android-video-no-poster.png">
    <figcaption>
      Android Chrome screenshot, portrait: no poster
     </figcaption>
  </figure>
</div>
<div class="attempt-right">
  <figure>
    <img alt="Android Chrome screenshot, portrait: with poster"
    src="images/Chrome-Android-video-poster.png">
    <figcaption>
      Android Chrome screenshot, portrait: with poster
     </figcaption>
  </figure>
</div>

<div style="clear:both;"></div>


## Provide alternatives for legacy platforms

Not all video formats are supported on all platforms. Check which formats
are supported on the major platforms and make sure your video works in each
of these.


### Check which formats are supported {: #check-formats }

Use `canPlayType()` to find out which video formats are supported. The method
takes a string argument consisting of a `mime-type` and optional codecs and
returns one of the following values:

<table class="responsive">
  <thead>
    <tr>
      <th colspan="2">Return value and Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-th="Return value">(empty string)</td>
      <td data-th="Description">The container and/or codec isn't supported.</td>
    </tr>
    <tr>
      <td data-th="Return value"><code>maybe</code></td>
      <td data-th="Description">
        The container and codec(s) might be supported, but the browser
        will need to download some video to check.
      </td>
    </tr>
    <tr>
      <td data-th="Return value"><code>probably</code></td>
      <td data-th="Description">The format appears to be supported.
      </td>
    </tr>
  </tbody>
</table>

Here are some examples of `canPlayType()` arguments and return values when
run in Chrome:

<table class="responsive">
  <thead>
    <tr>
      <th colspan="2">Type and Response</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-th="Type"><code>video/xyz</code></td>
      <td data-th="Response">(empty string)</td>
    </tr>
    <tr>
      <td data-th="Type"><code>video/xyz; codecs="avc1.42E01E, mp4a.40.2"</code></td>
      <td data-th="Response">(empty string)</td>
    </tr>
    <tr>
      <td data-th="Type"><code>video/xyz; codecs="nonsense, noise"</code></td>
      <td data-th="Response">(empty string)</td>
    </tr>
    <tr>
      <td data-th="Type"><code>video/mp4; codecs="avc1.42E01E, mp4a.40.2"</code></td>
      <td data-th="Response"><code>probably</code></td>
    </tr>
    <tr>
      <td data-th="Type"><code>video/webm</code></td>
      <td data-th="Response"><code>maybe</code></td>
    </tr>
    <tr>
      <td data-th="Type"><code>video/webm; codecs="vp8, vorbis"</code></td>
      <td data-th="Response"><code>probably</code></td>
    </tr>
  </tbody>
</table>


### Produce video in multiple formats

There are lots of tools to help save the same video in different formats:

* Desktop tools: [FFmpeg](//ffmpeg.org/)
* GUI applications: [Miro](http://www.mirovideoconverter.com/),
  [HandBrake](//handbrake.fr/), [VLC](//www.videolan.org/)
* Online encoding/transcoding services:
  [Zencoder](//en.wikipedia.org/wiki/Zencoder),
  [Amazon Elastic Encoder](//aws.amazon.com/elastictranscoder)

### Check which format was used

Want to know which video format was actually chosen by the browser?

In JavaScript, use the video's `currentSrc` property to return the source used.
