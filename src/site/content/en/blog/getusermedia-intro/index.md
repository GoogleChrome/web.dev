---
layout: post
title: Capture audio and video in HTML5
authors:
  - ericbidelman
  - samdutton
date: 2012-02-22
updated: 2020-11-24
tags:
  - blog
---

## Introduction

Audio/Video capture has been *the* "Holy Grail" of web development for a long time.
For many years we've had to rely on browser plugins ([Flash](http://www.kevinmusselman.com/2009/02/access-webcam-with-flash/) or
[Silverlight](http://www.silverlightshow.net/items/Capturing-the-Webcam-in-Silverlight-4.aspx))
to get the job done. [Come on!](https://www.youtube.com/watch?v=SP_9zH9Q44o)

HTML5 to the rescue. It might not be apparent, but the rise of HTML5 has brought
a surge of access to device hardware. [Geolocation](https://caniuse.com/?search=geolocation) (GPS),
the [Orientation API](https://caniuse.com/screen-orientation) (accelerometer), [WebGL](https://caniuse.com/?search=webgl) (GPU),
and the [Web Audio API](https://caniuse.com/?search=webgl) (audio hardware) are perfect examples. These features
are ridiculously powerful, exposing high level JavaScript APIs that sit
on top of the system's underlying hardware capabilities.

This tutorial introduces a new API, [GetUserMedia](https://caniuse.com/?search=webgl), which allows
web apps to access a user's camera and microphone.

## The road to getUserMedia()

If you're not aware of its history, the way we arrived at the `getUserMedia()` API is an interesting tale.

Several variants of "Media Capture APIs" have evolved over the past few years.
Many folks recognized the need to be able to access native devices on the web, but
that led everyone and their mom to put together a new spec. Things got
so messy that the W3C finally decided to form a working group. Their sole purpose?
Make sense of the madness! The [Device APIs Policy (DAP) Working Group](http://www.w3.org/2009/dap/)
has been tasked to consolidate + standardize the plethora of proposals.

I'll try to summarize what happened in 2011…

### Round 1: HTML Media Capture

[HTML Media Capture](http://dev.w3.org/2009/dap/camera/) was the DAP's first go at
standardizing media capture on the web. It works by overloading the `<input type="file">`
and adding new values for the `accept` parameter.

If you wanted to let users take a snapshot of themselves with the webcam,
that's possible with `capture=camera`:

```html
<input type="file" accept="image/*;capture=camera">
```

Recording a video or audio is similar:

```html
<input type="file" accept="video/*;capture=camcorder">
<input type="file" accept="audio/*;capture=microphone">
```

Kinda nice right? I particularly like that it reuses a file input. Semantically,
it makes a lot of sense. Where this particular "API" falls short is the ability to do realtime effects
(e.g. render live webcam data to a `<canvas>` and apply WebGL filters).
HTML Media Capture only allows you to record a media file or take a snapshot in time.

**Support:**

- [Android 3.0 browser](http://developer.android.com/sdk/android-3.0.html) -
one of the first implementations. Check out [this video](http://davidbcalhoun.com/2011/android-3-0-honeycomb-is-first-to-implement-the-device-api) to see it in action.
- Chrome for Android (0.16)
- Firefox Mobile 10.0
- iOS6 Safari and Chrome (partial support)

### Round 2: device element

Many thought HTML Media Capture was too limiting, so a new spec
emerged that supported any type of (future) device. Not surprisingly, the design called
for a new element, the [`<device>` element](http://dev.w3.org/html5/html-device/),
which became the predecessor to `getUserMedia()`.

Opera was among the first browsers to create [initial implementations](http://my.opera.com/core/blog/2011/03/14/web-meet-device)
of video capture based on the `<device>` element. Soon after
([the same day](http://my.opera.com/core/blog/2011/03/23/webcam-orientation-preview) to be precise),
the WhatWG decided to scrap the `<device>` tag in favor of another up and comer, this time a JavaScript API called
`navigator.getUserMedia()`. A week later, Opera put out new builds that included
support for the updated `getUserMedia()` spec. Later that year,
Microsoft joined the party by releasing a [Lab for IE9](http://blogs.msdn.com/b/ie/archive/2011/12/09/media-capture-api-helping-web-developers-directly-import-image-video-and-sound-data-into-web-apps.aspx)
supporting the new spec.

Here's what `<device>` would have looked like:

```html
<device type="media" onchange="update(this.data)"></device>
<video autoplay></video>
<script>
    function update(stream) {
    document.querySelector('video').src = stream.url;
    }
</script>
```

**Support:**

Unfortunately, no released browser ever included `<device>`.
One less API to worry about I guess :) `<device>` did have two great things going
for it though: 1.) it was semantic, and 2.) it was easily extendible to support
more than just audio/video devices.

Take a breath. This stuff moves fast!

### Round 3: WebRTC

The `<device>` element eventually went the way of the Dodo.

The pace to find a suitable capture API accelerated thanks to the larger [WebRTC][webrtc-spec] (Web Real Time Communications) effort. That spec is overseen by the [W3C WebRTC Working Group](http://www.w3.org/2011/04/webrtc/). Google, Opera, Mozilla, and [a few others](http://webrtc.org) have
implementations.

`getUserMedia()` is related to WebRTC because it's the gateway into that set of APIs.
It provides the means to access the user's local camera/microphone stream.

**Support:**

`getUserMedia()` has been supported since Chrome 21, Opera 18, and Firefox 17.

## Getting started

With `navigator.getUserMedia()`, we can finally tap into webcam and microphone input without a plugin.
Camera access is now a call away, not an install away. It's baked directly into the browser. Excited yet?

### Feature detection

Feature detecting is a simple check for the existence of `navigator.getUserMedia`:


```js
function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
    // Good to go!
} else {
    alert('getUserMedia() is not supported in your browser');
}
```

You can also [use Modernizr](http://modernizr.com/) to detect `getUserMedia` to avoid the vendor prefix dance yourself:

```js
if (Modernizr.getusermedia){
    var gUM = Modernizr.prefixed('getUserMedia', navigator);
    gUM({video: true}, function( //...
    //...
}
```

### Gaining access to an input device

To use the webcam or microphone, we need to request permission.
The first parameter to `getUserMedia()` is an object specifying the details and
requirements for each type of media you want to access. For example, if you want to access the webcam, the first parameter should be `{video: true}`. To use both the microphone and camera,
pass `{video: true, audio: true}`:

```html
<video autoplay></video>

<script>
    var errorCallback = function(e) {
    console.log('Reeeejected!', e);
    };

    // Not showing vendor prefixes.
    navigator.getUserMedia({video: true, audio: true}, function(localMediaStream) {
    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(localMediaStream);

    // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
    // See crbug.com/110938.
    video.onloadedmetadata = function(e) {
        // Ready to go. Do some stuff.
    };
    }, errorCallback);
</script>
```

OK. So what's going on here? Media capture is a perfect example of new HTML5 APIs
working together. It works in conjunction with our other HTML5 buddies, `<audio>` and `<video>`.
Notice that we're not setting a `src` attribute or including `<source>` elements
on the `<video>` element. Instead of feeding the video a URL to a media file, we're feeding
it a [Blob URL](/tutorials/workers/basics/#toc-inlineworkers-bloburis) obtained
from a `LocalMediaStream` object representing the webcam.

I'm also telling the `<video>` to `autoplay`, otherwise it would be frozen on
the first frame. Adding `controls` also works as you'd expected.

If you want something that works cross-browser, try this:

```js
navigator.getUserMedia  = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;

var video = document.querySelector('video');

if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: true, video: true}, function(stream) {
    video.src = window.URL.createObjectURL(stream);
    }, errorCallback);
} else {
    video.src = 'somevideo.webm'; // fallback.
}
```

### Setting media constraints (resolution, height, width)

The first parameter to `getUserMedia()` can also be used to specify more requirements
(or constraints) on the returned media stream. For example, instead of just indicating you want basic access to video (e.g. `{vide: true}`), you can additionally require the stream
to be HD:

```js
var hdConstraints = {
    video: {
    mandatory: {
        minWidth: 1280,
        minHeight: 720
    }
    }
};

navigator.getUserMedia(hdConstraints, successCallback, errorCallback);

...

var vgaConstraints = {
    video: {
    mandatory: {
        maxWidth: 640,
        maxHeight: 360
    }
    }
};

navigator.getUserMedia(vgaConstraints, successCallback, errorCallback);
```

For more configurations, see the [constraints API](http://dev.w3.org/2011/webrtc/editor/getusermedia.html#idl-def-MediaTrackConstraints)

### Selecting a media source

In Chrome 30 or later, `getUserMedia()` also supports selecting the video/audio source
using the `MediaStreamTrack.getSources()` API.

In this example, the last microphone and camera that's found is selected as the
media stream source:

```js
MediaStreamTrack.getSources(function(sourceInfos) {
    var audioSource = null;
    var videoSource = null;

    for (var i = 0; i != sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === 'audio') {
        console.log(sourceInfo.id, sourceInfo.label || 'microphone');

        audioSource = sourceInfo.id;
    } else if (sourceInfo.kind === 'video') {
        console.log(sourceInfo.id, sourceInfo.label || 'camera');

        videoSource = sourceInfo.id;
    } else {
        console.log('Some other kind of source: ', sourceInfo);
    }
    }

    sourceSelected(audioSource, videoSource);
});

function sourceSelected(audioSource, videoSource) {
    var constraints = {
    audio: {
        optional: [{sourceId: audioSource}]
    },
    video: {
        optional: [{sourceId: videoSource}]
    }
    };

    navigator.getUserMedia(constraints, successCallback, errorCallback);
}
```

Check out Sam Dutton's [great demo](https://simpl.info/getusermedia/sources/) of how
to let users select the media source.

### Security

Some browsers throw up an infobar upon calling `getUserMedia()`,
which gives users the option to grant or deny access to their camera/mic.
The spec unfortunately is very quiet when it comes to security. For example, here
is Chrome's permission dialog:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/Z5cVe361mrgghnmWMVw1.png", alt="Permission dialog in Chrome", width="800", height="231" %}
<figcaption>Permission dialog in Chrome</figcaption>
</figure>

If your app is running from SSL (`https://`), this permission will be persistent.
That is, users won't have to grant/deny access every time.

### Providing fallback

For users that don't have support for `getUserMedia()`, one option is to fallback
to an existing video file if the API isn't supported and/or the call fails for some reason:

```js
// Not showing vendor prefixes or code that works cross-browser:

function fallback(e) {
    video.src = 'fallbackvideo.webm';
}

function success(stream) {
    video.src = window.URL.createObjectURL(stream);
}

if (!navigator.getUserMedia) {
    fallback();
} else {
    navigator.getUserMedia({video: true}, success, fallback);
}
```
