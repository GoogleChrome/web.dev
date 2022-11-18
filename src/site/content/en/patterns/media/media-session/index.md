---
layout: pattern
title: How to customize media notifications
date: 2022-11-03
authors:
  - beaufortfrancois
description: >
  Learn how to let the user control media playback on the lock screen, in a widget, or with hardware keys.
height: 800
---

The [Media Session API](https://developer.mozilla.org/docs/Web/API/Media_Session_API) allows websites to let users know what's currently playing in their browser and control it without returning to the page that launched it. The user experience can be customized through metadata in custom media notifications, media events such as playing, pausing, seeking, and track changing. These customizations are available in several contexts, including desktop media hubs, media notifications on mobile, and even on wearable devices.

{% BrowserCompat 'api.MediaSession' %}

<figure>
  {% Img src="image/admin/qwTz64KKq4rq7WeA3rlT.jpg", alt="Screenshots of Media Session contexts.", width="800", height="330" %}
  <figcaption>Media hub on desktop, media notification on mobile, and a wearable device.</figcaption>
</figure>

When a website is playing audio or video, users automatically get media notifications either in the notification tray on mobile, or the media hub on desktop. The browser does its best to show appropriate information by using the document's title and the largest icon image it can find. The Media Session API allows you to customize the media notification with some richer media metadata such as the title, artist name, album name, and artwork as shown below.

<figure>
  {% Img src="image/admin/eiavbbCE6TlI8osR1tYT.jpg", alt="Media Session interfaces illustration.", width="800", height="353" %}
  <figcaption>Anatomy of a media notification on mobile.</figcaption>
</figure>

The example below shows you how to create a custom media notification and respond to basic media actions such as play and pause.

```js
const video = document.querySelector("video");

navigator.mediaSession.metadata = new MediaMetadata({
  title: "Never Gonna Give You Up",
  artist: "Rick Astley",
  album: "Whenever You Need Somebody",
  artwork: [
    { src: "https://via.placeholder.com/96",  sizes: "96x96" },
    { src: "https://via.placeholder.com/128", sizes: "128x128" },
    { src: "https://via.placeholder.com/256", sizes: "256x256" },
    { src: "https://via.placeholder.com/512", sizes: "512x512" },
  ],
});

navigator.mediaSession.setActionHandler("play", async () => {
  // Resume playback
  try {
    await video.play();
  } catch (err) {
    console.error(err.name, err.message);
  }
});

navigator.mediaSession.setActionHandler("pause", () => {
  // Pause active playback
  video.pause();
});

video.addEventListener("play", () => {
  navigator.mediaSession.playbackState = "playing";
});

video.addEventListener("pause", () => {
  navigator.mediaSession.playbackState = "paused";
});
```

## Further reading

- [W3C Media Session Specification](https://w3c.github.io/mediasession/)
- [Customize media notifications and playback controls with the Media Session API](/media-session/)
- [MDN Media Session API](https://developer.mozilla.org/docs/Web/API/Media_Session_API)

## Demo
