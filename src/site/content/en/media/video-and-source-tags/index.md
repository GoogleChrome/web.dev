---
layout: post
title: The <video> and <source> tags
authors:
  - samdutton
  - joemedley
description: |
  You've properly prepared a video file for the web. You've given it correct
  dimensions and the correct resolution. You've encrypted it. You've even
  created separate webm and mp4 files for different browsers. For anyone to see
  it, you still need to add it to a web page.
date: 2014-14-15
updated: 2020-06-19
---

You've properly [prepared a video file](prepare-media/) for the web. You've
given it correct dimensions and the correct resolution. You've encrypted it.
You've even created separate webm and mp4 files for different browsers.

For anyone to see it, you still need to add it to a web page. Doing so properly
requies two HTML elements: the `<video>` element and the `<source>`.  Because it
makes no sense to cover them separately, the page explains both. It also
explains attributes you should add to those tags to craft a good user
experience.

{% Aside %}
You always have the option of uploading your file to YouTube or Vimeo. In many
cases, this is preferable to the procedure described here. Those services
handle formatting and filetype conversion for you, as well as provide the means
to embedd a video in your web page. If need to manage this yourself, read on.
{% endAside %}

## Specify a single file

Although it's not recommended, you can use the video element by itself. Always
use the `type` attribute as shown below. the browser uses this to determine if
it can play the provided video file. If it can't, the enclosed text displays.

```html
<video src="chrome.webm" type="video/webm">
    <p>Your browser cannot play the provided video file.</p>
</video>
```

### Specify multiple file formats

Recall from [File basics](../file-basics) that not all browsers support the same
video formats. The `<source>` element lets you specify multiple formats as a
fallback in case the user's browser doesn't support one of them.

For example the code below produces the ebedded video that immediately follows.

```html
<video controls>
  <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.webm" type="video/webm">
  <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4" type="video/mp4">
    <p>Your browser cannot play the provided video file.</p>
</video>
```

<video controls>
  <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.webm" type="video/webm">
  <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4" type="video/mp4">
  <p>This browser does not support the video element.</p>
</video>

When the browser parses the `<source>` tags, it uses the (optional) `type`
attribute to determine which file to download and play. If the browser
supports WebM, it plays that; if not, it checks whether it can play
MPEG-4 videos.

This approach has several advantages over serving different HTML or server-side
scripting, especially on mobile:

* You can list formats in order of preference.
* Native client-side switching reduces latency; only one request is made to
  get content.
* Letting the browser choose a format is simpler, quicker, and potentially
  more reliable than using a server-side support database with user-agent detection.
* Specifying each file source's type improves network performance; the browser can select a
  video source without having to download part of the video to "sniff" the format.

These issues are especially important in mobile contexts, where bandwidth and
latency are at a premium and the user's patience is likely limited. Omitting the
type attribute can affect performance when there are multiple sources with
unsupported types.

{% Aside %} There are a few ways you can dig into the details. Check out [A
Digital Media Primer for Geeks](//www.xiph.org/video/vid1.shtml) to find out
more about how video and audio work on the web. You can also use [remote
debugging](https://developers.google.com/web/tools/chrome-devtools/remote-debugging)
in DevTools to compare network activity [with type
attributes](https://googlesamples.github.io/web-fundamentals/fundamentals/media/video-main.html)
and [without type
attributes](https://googlesamples.github.io/web-fundamentals/fundamentals/design-and-ux/responsive/notype.html).

Also check the response headers in your browser developer tools to
[ensure your server reports the right MIME type](//developer.mozilla.org/en/docs/Properly_Configuring_Server_MIME_Types);
otherwise video source type checks won't work.
{% endAside %}

### Specify start and end times

Save bandwidth and make your site feel more responsive: use media fragments to
add start and end times to the video element.

<video controls>
  <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.webm#t=5,10" type="video/webm">
  <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4#t=5,10" type="video/mp4">
  <p>This browser does not support the video element.</p>
</video>

To use a media fragment, add `#t=[start_time][,end_time]` to the media URL. For
example, to play the video from seconds 5 to 10, specify:

```html
<source src="video/chrome.webm#t=5,10" type="video/webm">
```

You can use this feature to deliver multiple views on the same video&ndash;like
cue points in a DVD&ndash;without having to encode and serve multiple files.

{% Aside 'caution' %}
By default, most servers enable range requests, which is required for media
fragments to work. Because some hosting services turn them off, you should test
this feature with your server before using it on a live site.
{% endAside %}

Using your browser developer tools, check for `Accept-Ranges: bytes` in the
response headers:

<figure class="w-figure">
  <img src="./accept-ranges-chrome-devtools.png" alt="Chrome DevTools screenshot: Accept-Ranges: bytes.">
  <figcaption class="w-figcaption">Chrome DevTools screenshot: Accept-Ranges: bytes.</figcaption>
</figure>

### Include a poster image

Add a poster attribute to the `video` element so that viewers have an idea of
the content as soon as the element loads, without needing to download video or
start playback.

```html
<video poster="poster.jpg" ...>
  ...
</video>
```


A poster can also be a fallback if the video `src` is broken or if none of the
video formats supplied are supported. The only downside to poster images is
an additional file request, which consumes some bandwidth and requires
rendering. For more information see [Image Optimization](/web/fundamentals/performance/optimizing-content-efficiency/image-optimization).


<div class="w-columns">
{% Compare 'worse' %}
<figure class="w-figure" w-figure--inline-left>
  <img src="./chrome-android-video-no-poster.png" alt="Without a fallback poster, the video just looks broken.">
</figure>

{% CompareCaption %}
Without a fallback poster, the video just looks broken.
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better' %}
<figure class="w-figure" w-figure--inline-right>
  <img src="./chrome-android-video-poster.png" alt="A fallback poster makes it seem as if the first frame has been captured.">
</figure>

{% CompareCaption %}
A fallback poster makes it seem as if the first frame has been captured.
{% endCompareCaption %}

{% endCompare %}
</div>

### Ensure videos don't overflow containers

When video elements are too big for the viewport, they may overflow their
container, making it impossible for the user to see the content or use the
controls.

<div class="w-columns">
  <figure class="w-figure">
    <img src="./chrome-android-portrait-video-unstyled.png" alt="Android Chrome screenshot, portrait: unstyled video element overflows
    viewport.">
    <figcaption class="w-figcaption">Android Chrome screenshot, portrait: unstyled video element overflows
    viewport.</figcaption>
  </figure>
  <figure class="w-figure">
    <img src="./chrome-android-landscape-video-unstyled.png" alt="Android Chrome screenshot, landscape: unstyled video element overflows
    viewport.">
    <figcaption class="w-figcaption">Android Chrome screenshot, landscape: unstyled video element overflows
    viewport.</figcaption>
  </figure>
</div>

You can control video dimensions using JavaScript or CSS. JavaScript libraries
and plugins such as [FitVids](http://fitvidsjs.com/) make it possible to
maintain appropriate size and aspect ratio, even for videos from YouTube and
other sources.

Use [CSS media
queries](/web/fundamentals/design-and-ux/responsive/#css-media-queries) to
specify the size of elements depending on the viewport dimensions; `max- width:
100%` is your friend.

For media content in iframes (such as YouTube videos), try a responsive approach
(like the one [proposed by John
Surdakowski](http://avexdesigns.com/responsive-youtube-embed/)).

{% Aside 'caution' %}
Don't force element sizing that results in an aspect ratio different from the
original video. Squashed or stretched looks bad.
{% endAside %}

**CSS:**

```css
.video-container {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 0;
    height: 0;
    overflow: hidden;
}

.video-container iframe,
.video-container object,
.video-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
```

**HTML:**

```html
<div class="video-container">
  <iframe src="//www.youtube.com/embed/l-BA9Ee2XuM"
          frameborder="0" width="560" height="315">
  </iframe>
</div>
```

---ADD SAMPLES HERE---

### Device orientation

Device orientation isn't an issue for desktop monitors or laptops, but it's
hugely important when considering web page design for mobile devices and
tablets.

Safari on iPhone do a good job of switching between portrait and landscape
orientation:

<div class="w-columns">
<figure class="w-figure">
  <img src="./iphone-video-playing-portrait.png" alt="Screenshot of video playing in Safari on iPhone, portrait.">
  <figcaption class="w-figcaption">Screenshot of video playing in Safari on iPhone, portrait.</figcaption>
</figure>
<figure class="w-figure">
  <img src="./iphone-video-playing-landscape.png" alt="Screenshot of video playing in Safari on iPhone, landscape.">
  <figcaption class="w-figcaption">Screenshot of video playing in Safari on iPhone, landscape.</figcaption>
</figure>
</div>

Device orientation on an iPad and Chrome on Android can be problematic.
For example, without any customization a video playing on an iPad in landscape
orientation looks like this:


<figure class="w-figure">
  <img src="./ipad-retina-landscape-video-playing.png" alt="Screenshot of video playing in Safari on iPad Retina, landscape.">
  <figcaption class="w-figcaption">Screenshot of video playing in Safari on iPad Retina, landscape.</figcaption>
</figure>

Setting the video `width: 100%` or `max-width: 100%` with CSS can resolve
many device orientation layout problems.

### Autoplay

On desktop, `autoplay` tells the browser to download and play the video
immediately. On mobile, don't assume `autoplay` will always work. See the [WebKit
blog](https://webkit.org/blog/6784/new-video-policies-for-ios/), for instance.

Even on platforms where autoplay is possible, you need to consider whether
it's a good idea to enable it:

* Data usage can be expensive.
* Playing media before the user wants it can hog bandwidth and CPU, and thereby
  delay page rendering.
* Users may be in a context where playing video or audio is intrusive.

### Preload

The `preload` attribute provides a hint to the browser as to how much
information or content to preload.

<table class="responsive">
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-th="Value"><code>none</code></td>
      <td data-th="Description">The user might chose not to watch the video, so don't
      preload anything.</td>
    </tr>
    <tr>
      <td data-th="Value"><code>metadata</code></td>
      <td data-th="Description">Metadata (duration, dimensions, text tracks) should be
      preloaded, but with minimal video.</td>
    </tr>
    <tr>
      <td data-th="Value"><code>auto</code></td>
      <td data-th="Description">Downloading the entire video right away is considered
      desirable. An empty string produces the same result.</td>
    </tr>
  </tbody>
</table>

The `preload` attribute has different effects on different platforms.
For example, Chrome buffers 25 seconds of video on desktop but none on iOS or
Android. This means that on mobile, there may be playback startup delays
that don't happen on desktop. See [Steve Souders'
blog](https://www.stevesouders.com/blog/2013/04/12/html5-video-preload/) for
full details.
