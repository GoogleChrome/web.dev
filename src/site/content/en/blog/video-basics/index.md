---
title: Going beyond images with basic video for the web
subhead: Learn basic video. Increase engagement.
authors:
  - dougsillars
date: 2019-09-03
hero: image/admin/ZzDrBdBMFxBtALr0uCz6.jpg
alt: A description of the hero image for screen reader users.
description: |
  Research shows that web video lead to higher engagement and sales. Even if you haven't added video to your sites yet, it's just a matter of time until you do.
tags:
  - media
  - blog
  - video
---

Are you thinking about adding video to your website? As devices and network
connections have become faster and more powerful, you can move beyond images and
add video to your toolchest of techniques to build the web.
[Research
shows](https://www.foodbloggerpro.com/blog/how-we-improved-our-landing-page-conversion-rate-by-138/)
that websites with video lead to higher engagement and sales. So even if you
haven't added video to your sites yet, it's probably just a matter of time
until you do.

In all likelihood, the video files you add to your site will be the largest
files that are downloaded. For that reason, it's extremely important to ensure
that the files are built for fast and steady playback to all of your customers.
Even though video can increase engagement and customer satisfaction, a video
that doesn't play or stalls during playback can lead to customer frustration.
This post focuses on using the HTML5 `<video>` tag for delivering video, and
therefore will not cover streaming video.

So let's get started!

## The &lt;video> tag

It seems obvious, right? To add video, you have to add the `<video>` tag, point to a
source, and then you're off to the races!

```html
<video src="myVideo.mp4">
```
And, you're right. At the highest level, this is all you need to add a video to
the web. But there are a lot of attributes that you can add to the video tag to
improve the layout and delivery of the video.

## The &lt;source> tag

Perhaps the best way to improve the delivery of video on the web is to optimize
the files that are delivered to the browser. The way to do this is using the
`<source>` tag:

```html
<video>
  <source src="myWebmVideo.webm" type="video/webm">
  <source src="myh265Video.mp4" type="video/mp4">
  <source src="myh264Video.mp4" type="video/mp4">
</video>
```

This references three separate source files. The browser starts at the top, and
picks the first format and codec that it can use. In the video world, the file
format, usually called the container, can be saved with different codecs, each
with different attributes. ([More on this
here](https://developers.google.com/web/fundamentals/media/manipulating/applications).)
In the example above, the first choice is the WebM format ([which can be encoded
with VP8 or VP9 codecs](https://www.webmproject.org/about/)), and is supported
(at the time of writing) by 78% of [global
users](https://caniuse.com/#search=webm). The second choice is the the H.265
codec of mp4, which is supported on [iOS and newer
Macs](https://caniuse.com/#search=h265). These codecs are newer and have
improved data compression, while delivering the same quality video as older
video formats.

The final choice in our list is H.264 mp4, which boasts support on 92% of all
[global
users](https://caniuse.com/#search=h264),
but is an older format, and as such, is generally a lot larger than WebM or H.265
videos. In one example, you can see the difference for a two minute movie:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Codec</th>
        <th>File size</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>VP8</th>
        <th>5.5 MB</th>
      </tr>
      <tr>
        <th>VP9</th>
        <th>4.2 MB</th>
      </tr>
      <tr>
        <th>H.265</th>
        <th>5.4 MB</th>
      </tr>
      <tr>
        <th>H.264</th>
        <th>16.1 MB</th>
      </tr>
    </tbody>
  </table>
</div>

Delivering files that are smaller is the best performance optimization you can
make to better deliver your videos. When a smaller video is downloaded, video
playback occurs sooner, and the video buffer fills up faster. This leads to
fewer stalls during video playback. Additionally, server load is
decreased, which makes up for the increased storage requirements of multiple
video files.

## The preload attribute

Videos cannot begin playback until there is some video downloaded and stored
locally. Using the preload attribute, you can control how much video is
downloaded on page load. There are three values for the preload attribute:
`auto`, `metadata`, and `none`.

### preload='auto'

If `'auto'` is used, the entire video will be downloaded, no matter if
the user presses play or not. This enables fast video playback as the video is
downloaded locally before the user presses play. From a data usage (and server
load perspective) this should only be used when it is highly probable that the
video is to be watched. Otherwise all the data of a full video download will be
wasted.

### preload='metadata'

This is the default setting for preload on Chrome and Safari. When `'metadata'`
is used, the first 3% of the video is downloaded. Though this shares caveats
with `'auto'`, downloading just 3% of the video holds a much smaller server/data
usage cost than the entire video, while still ensuring a portion of the video is
stored locally for fast video startup.

### preload='none'

This saves the most data, but will lead to slower video startup when play is
pressed, because as the setting states, zero kilobytes of the video is
preloaded locally on the device. For videos that are present, but unlikely to
be played, this is the appropriate setting. This might also be used if the user
has enabled [Lite mode](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html) in their browser.

## poster

You may want to have a poster image that displays over the video
window before the video starts playing:

```html
<video src="myVideo.mp4" poster="/image/myVideoImage.jpg">
```

<figure class="w-figure">
  {% Img src="image/admin/g25bdsYqmAWM39KhjGTj.png", alt="A video without a poster shows a black screen before it starts.", width="478", height="269" %}
</figure>
{% Compare 'worse', 'No poster image' %}
  A video without a poster shows a black screen before it starts.
{% endCompare %}

<figure class="w-figure">
  {% Img src="image/admin/QVLwk1zEOzqllD8eY3pc.png", alt="A video with a poster is much more engaging.", width="478", height="269" %}
</figure>
{% Compare 'better', 'With a poster image' %}
  A video with a poster is much more engaging.
{% endCompare %}

By adding a photo instead of a black box on the page, you make your website more
engaging and interactive. However, using the `poster` attribute adds an image
download before the video download begins. For that reason, you might consider
avoiding adding a poster for videos that autoplay (as the additional download
will delay the video download).

## Playback controls

Adding a `controls` attribute adds playback controls. Without these, your
customers cannot start or stop your video. You should add this for videos so
that users can stop and pause, change the volume, and so on. For background or
looping videos, you may wish to omit this attribute.

## muted

The `muted` attribute causes playback to begin in a muted state. If no controls
are supplied, it will remain muted for the entirety of playback. If that is
intended it might make sense to remove the audio track from the video. This
further reduces the size of the video file being delivered to the customer.

As with containers and codecs, removing the audio file, also called demuxing, is
also beyond the scope of this article. You can find instructions in the [Media
Manipulation Cheat
Sheet](https://developers.google.com/web/fundamentals/media/manipulating/cheatsheet#demux_split_audio_and_video).

## loop

To deliver a video that loops the content (like an animated GIF), add the `loop`
attribute. As video files are typically much smaller than animated GIFs, this
mechanism allows you to [replace your GIFs with video
files](https://dougsillars.com/2017/04/12/animated-gifs-vs-video-files/).

## Autoplaying video

If you want your video to play immediately (for example as a background video, or a
video that loops like an animated GIF) you can add the `autoplay` attribute:

```html
<video src="myVideo.mp4" autoplay>
```

That said, in order for a video to autoplay on mobile browsers, the `muted`
attribute must also be added:

```html
<video src="myVideo.mp4" autoplay muted>
```

## Conclusion

Simply adding a video to your website will add a new realm of engagement for
your customers, but it is important that you deliver the content
properly&mdash;ensuring that the playback of the video is seamless and without
stalls. Using the built in attributes of the &lt;video> tag can greatly help you
deliver flawless video to everyone who visits your website.
