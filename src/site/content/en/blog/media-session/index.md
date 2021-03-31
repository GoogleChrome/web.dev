---
title: Customize media notifications and playback controls with the Media Session API
subhead: How to integrate with hardware media keys, customize media notifications, and more.
authors:
  - beaufortfrancois
date: 2020-03-06
updated: 2021-03-31
hero: image/admin/IhujMvzGa5Mf0aNWYRXW.jpg
thumbnail: image/admin/Q6CqQNLucogBCxGMsSU2.jpg
description: |
  Web developers can customize media notifications and respond to media
  related events such as seeking or track changing with the Media Session API.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - media
  - audio
  - video
feedback:
  - api
---

To let users know what's currently playing in their browser and control it
without returning to the page that launched it, the Media Session API has been
introduced. It allows web developers to customize this experience through
metadata in custom media notifications and media events such as playing,
pausing, and even seeking and track changing. These customizations are available
in several contexts including desktop media hubs, media notifications on mobile,
and even on wearable devices. I'll describe these customizations in this
article.

<figure class="w-figure">
  {% Img src="image/admin/qwTz64KKq4rq7WeA3rlT.jpg", alt="Screenshots of Media Session contexts", width="800", height="330" %}
  <figcaption class="w-figcaption">Media hub on desktop, media notification on mobile, and a wearable device.</figcaption>
</figure>

## Cross-browser support

At the time of writing, Chrome is the only browser that supports the Media
Session API both on desktop and mobile. Firefox has partial support for the
Media Session API on desktop behind a flag, and Samsung Internet also has
partial support. See [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession#Browser_compatibility)
for up-to-date information.

## About the Media Session API

The Media session API provides several benefits and capabilities:

- Hardware media keys are supported.
- Media notifications are customized on mobile, Chrome OS, and paired wearable device.
- The [media hub] is available on desktop.
- Lock screen media controls are available on [Chrome OS] and mobile.
- Picture-in-Picture window controls are available.
- Assistant integration on mobile is available.

A few examples will illustrate some of these points.

<b>Example 1:</b> If users press the "next track" media key of their keyboard,
web developers can handle this user action whether Chrome is in the foreground
or the background.

<b>Example 2:</b> If users listen to a podcast on the web while their device
screen is locked, they can still hit the "seek backward" icon from the lock
screen media controls so that web developers move playback time backward by few
seconds.

<b>Example 3:</b> If users have tabs playing audio, they can easily stop
playback from the media hub on desktop so that web developers have a chance to
clear their state.

This is all done through two different interfaces: The `MediaSession` interface
and the `MediaMetadata` interface. The first lets users control whatever's
playing. The second is how you tell `MediaSession` what needs to be controlled.

To illustrate, the image below shows how these interfaces relate to specific
media controls, in this case a media notification on mobile.

<figure class="w-figure">
  {% Img src="image/admin/eiavbbCE6TlI8osR1tYT.jpg", alt="Media Session interfaces illustration", width="800", height="353" %}
  <figcaption class="w-figcaption">Anatomy of a media notification on mobile.</figcaption>
</figure>

## Let users know what's playing

When a website is playing audio or video, users automatically get media
notifications either in the notification tray on mobile, or the media hub on
desktop. Chrome does its best to show appropriate information by using the
document's title and the largest icon image it can find. With the Media Session
API, it's possible to customize the media notification with some richer media
metadata such as the title, artist name, album name, and artwork as shown below.

Chrome requests "full" audio focus to show media notifications only when the
media duration is [at least 5 seconds]. This ensures that incidental sounds
such as dings don't show notifications.

```js
// After media (video or audio) starts playing
await document.querySelector("video").play();

if ("mediaSession" in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    album: 'Whenever You Need Somebody',
    artwork: [
      { src: 'https://via.placeholder.com/96',   sizes: '96x96',   type: 'image/png' },
      { src: 'https://via.placeholder.com/128', sizes: '128x128', type: 'image/png' },
      { src: 'https://via.placeholder.com/192', sizes: '192x192', type: 'image/png' },
      { src: 'https://via.placeholder.com/256', sizes: '256x256', type: 'image/png' },
      { src: 'https://via.placeholder.com/384', sizes: '384x384', type: 'image/png' },
      { src: 'https://via.placeholder.com/512', sizes: '512x512', type: 'image/png' },
    ]
  });

  // TODO: Update playback state.
}
```

When playback ends, there is no need to "release" the media session as the
notification will automatically disappear. Keep in mind that
`navigator.mediaSession.metadata` will be used when the next playback starts
though. This is why it's important to update it when the media playback source
changes to make sure relevant information is shown in the media notification.

There are a few things to note about the media metadata.

- Notification artwork array supports blob URLs and data URLs.
- If no artwork is defined and there is an icon image (specified using `<link rel=icon>`) at a desirable size, media notifications will use it.
- Notification artwork target size in Chrome for Android is `512x512`. For
  low-end devices, it is `256x256`.
- The `title` attribute of the media HTML element is used in the "Now playing"
  macOS widget.
- If the media resource is embedded (for example in a iframe), Media Session API
  information must be set from the embedded context. See snippet below.

```js
<iframe id="iframe">
  <video>...</video>
</iframe>
<script>
  iframe.contentWindow.navigator.mediaSession.metadata = new MediaMetadata({
    title: 'Never Gonna Give You Up',
    ...
  });
</script>
```

## Let users control what's playing

A media session action is an action (for example "play" or "pause") that a website can
handle for users when they interact with the current media playback. Actions are
analogous to and work much the same as events. Like events, actions are
implemented by setting handlers on an appropriate object, an instance of
`MediaSession`, in this case. Some actions are triggered when users press
buttons from a headset, another remote device, a keyboard, or interact with a
media notification.

<figure class="w-figure">
  {% Img src="image/admin/9rN4x5GXdhg4qjC0ZEmk.jpg", alt="Screenshot of a media notification in Windows 10", width="800", height="450" %}
  <figcaption class="w-figcaption">Customized media notification in Windows 10.</figcaption>
</figure>

Because some media session actions may not be supported, it is recommended to
use a `try…catch` block when setting them.

```js
const actionHandlers = [
  ['play',          () => { /* ... */ }],
  ['pause',         () => { /* ... */ }],
  ['previoustrack', () => { /* ... */ }],
  ['nexttrack',     () => { /* ... */ }],
  ['stop',          () => { /* ... */ }],
  ['seekbackward',  (details) => { /* ... */ }],
  ['seekforward',   (details) => { /* ... */ }],
  ['seekto',        (details) => { /* ... */ }],
];

for (const [action, handler] of actionHandlers) {
  try {
    navigator.mediaSession.setActionHandler(action, handler);
  } catch (error) {
    console.log(`The media session action "${action}" is not supported yet.`);
  }
}
```

Unsetting a media session action handler is as easy as setting it to `null`.

```js
try {
  // Unset the "nexttrack" action handler at the end of a playlist.
  navigator.mediaSession.setActionHandler('nexttrack', null);
} catch (error) {
  console.log(`The media session action "nexttrack" is not supported yet.`);
}
```

Once set, media session action handlers will persist through media playbacks.
This is similar to the event listener pattern except that handling an event
means that the browser stops doing any default behavior and uses this as a
signal that the website supports the media action. Hence, media action controls
won't be shown unless the proper action handler is set.

<figure class="w-figure">
  {% Img
    src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/WBZAf1ymhtXInsWumHtw.jpg",
    alt="Screenshot of the Now Playing widget in macOS Big Sur",
    width="800",
    height="450"
  %}
  <figcaption class="w-figcaption">Now Playing widget in macOS Big Sur (requires Chrome 91).</figcaption>
</figure>

### Play / pause

The `"play"` action indicates that the user wants to resume the media playback
while `"pause"` indicates a desire to temporarily halt it.

The "play/pause" icon is always shown in a media notification and the related
media events are handled automatically by the browser. To override their default
behavior, handle "play" and "pause" media actions as shown below.

The browser may consider a website to not be playing media when seeking or
loading for instance. In this case, override this behavior by setting
`navigator.mediaSession.playbackState` to `"playing"` or `"paused"` to make sure
the website UI stays in sync with media notification controls.

```js
navigator.mediaSession.setActionHandler('play', async () => {
  // Resume playback
  await document.querySelector('video').play();
  navigator.mediaSession.playbackState = 'playing';
});

navigator.mediaSession.setActionHandler('pause', () => {
  // Pause active playback
  document.querySelector('video').pause();
  navigator.mediaSession.playbackState = 'paused';
});
```

### Previous track

The `"previoustrack"` action indicates that the user either wants to start the
current media playback from the beginning if the media playback has a notion of
beginning, or move to the previous item in the playlist if the media playback
has a notion of a playlist.

```js
navigator.mediaSession.setActionHandler('previoustrack', () => {
  // Play previous track.
});
```

### Next track

The `"nexttrack"` action indicates that the user wants to move media playback to
the next item in the playlist if the media playback has a notion of a playlist.

```js
navigator.mediaSession.setActionHandler('nexttrack', () => {
  // Play next track.
});
```

### Stop

The `"stop"` action indicates that the user wants to stop the media playback and
clear the state if appropriate.

```js
navigator.mediaSession.setActionHandler('stop', () => {
  // Stop playback and clear state if appropriate.
});
```

### Seek backward / forward

The `"seekbackward"` action indicates that the user wants to move the media
playback time backward by a short period while `"seekforward"` indicates a desire
to move the media playback time forward by a short period. In both cases, a
short period means a few seconds.

The `seekOffset` value provided in the action handler is the time in seconds to
move the media playback time by. If it is not provided (for example `undefined`), then
you should use a sensible time (for example 10-30 seconds).

```js
const video = document.querySelector('video');
const defaultSkipTime = 10; /* Time to skip in seconds by default */

navigator.mediaSession.setActionHandler('seekbackward', (details) => {
  const skipTime = details.seekOffset || defaultSkipTime;
  video.currentTime = Math.max(video.currentTime - skipTime, 0);
  // TODO: Update playback state.
});

navigator.mediaSession.setActionHandler('seekforward', (details) => {
  const skipTime = details.seekOffset || defaultSkipTime;
  video.currentTime = Math.min(video.currentTime + skipTime, video.duration);
  // TODO: Update playback state.
});
```

### Seek to a specific time

The `"seekto"` action indicates that the user wants to move the media playback
time to a specific time.

The `seekTime` value provided in the action handler is the time in seconds to
move the media playback time to.

The `fastSeek` boolean provided in the action handler is true if the action is
being called multiple times as part of a sequence and this is not the last call
in that sequence.

```js
const video = document.querySelector('video');

navigator.mediaSession.setActionHandler('seekto', (details) => {
  if (details.fastSeek && 'fastSeek' in video) {
    // Only use fast seek if supported.
    video.fastSeek(details.seekTime);
    return;
  }
  video.currentTime = details.seekTime;
  // TODO: Update playback state.
});
```

## Set playback position

Accurately displaying the media playback position in a notification is as simple
as setting the position state at an appropriate time as shown below. The
position state is a combination of the media playback rate, duration, and
current time.

<figure class="w-figure">
  {% Img src="image/admin/Rlw13wMoaJrDziraXgUc.jpg", alt="Screenshot of lock screen media controls in Chrome OS", width="800", height="450" %}
  <figcaption class="w-figcaption">Lock screen media controls in Chrome OS.</figcaption>
</figure>

The duration must be provided and positive. The position must be positive and
less than the duration. The playback rate must be greater than 0.

```js
const video = document.querySelector('video');

function updatePositionState() {
  if ('setPositionState' in navigator.mediaSession) {
    navigator.mediaSession.setPositionState({
      duration: video.duration,
      playbackRate: video.playbackRate,
      position: video.currentTime,
    });
  }
}

// When video starts playing, update duration.
await video.play();
updatePositionState();

// When user wants to seek backward, update position.
navigator.mediaSession.setActionHandler('seekbackward', (details) => {
  /* ... */
  updatePositionState();
});

// When user wants to seek forward, update position.
navigator.mediaSession.setActionHandler('seekforward', (details) => {
  /* ... */
  updatePositionState();
});

// When user wants to seek to a specific time, update position.
navigator.mediaSession.setActionHandler('seekto', (details) => {
  /* ... */
  updatePositionState();
});

// When video playback rate changes, update position state.
video.addEventListener('ratechange', (event) => {
  updatePositionState();
});
```

Resetting the position state is as easy as setting it to `null`.

```js
// Reset position state when media is reset.
navigator.mediaSession.setPositionState(null);
```

## Samples

Check out some [Media Session samples] featuring [Blender Foundation] and
[Jan Morgenstern's work].

 <figure class="w-figure">
  <video controls autoplay loop muted poster="https://storage.googleapis.com/webfundamentals-assets/videos/media-hub-desktop-720.jpg">
    <source src="https://storage.googleapis.com/webfundamentals-assets/videos/media-hub-desktop-720.webm" type="video/webm; codecs=vp9">
    <source src="https://storage.googleapis.com/webfundamentals-assets/videos/media-hub-desktop-720.mp4" type="video/mp4; codecs=h264">
  </video>
  <figcaption class="w-figcaption">
    A screencast illustrating the Media Session API.
  </figcaption>
</figure>

## Resources

- Media Session Spec:
  [wicg.github.io/mediasession](https://wicg.github.io/mediasession)
- Spec Issues:
  [github.com/WICG/mediasession/issues](https://github.com/WICG/mediasession/issues)
- Chrome Bugs:
  [crbug.com](https://crbug.com/?q=component:Internals>Media>Session)

[media hub]: https://blog.google/products/chrome/manage-audio-and-video-in-chrome/
[chrome os]: https://www.blog.google/products/chromebooks/whats-new-december2019/
[at least 5 seconds]: https://chromium.googlesource.com/chromium/src/+/5d8eab739eb23c4fd27ba6a18b0e1afc15182321/media/base/media_content_type.cc#10
[cache api]: /web/fundamentals/instant-and-offline/web-storage/offline-for-pwa
[media session samples]: https://googlechrome.github.io/samples/media-session/
[web audio api]: /web/updates/2012/02/HTML5-audio-and-the-Web-Audio-API-are-BFFs
[blender foundation]: http://www.blender.org/
[jan morgenstern's work]: http://www.wavemage.com/category/music/
[pip window controls]: https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture#show_canvas_element_in_picture-in-picture_window
