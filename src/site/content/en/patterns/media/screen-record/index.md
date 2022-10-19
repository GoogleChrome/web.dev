---
layout: pattern
title: How to record the user's screen
date: 2022-10-14
authors:
  - beaufortfrancois
description: >
  Learn how to record the user's screen.
height: 800
---

Sharing tabs, windows, and screens is possible on the web platform with the [Screen Capture API](https://w3c.github.io/mediacapture-screen-share/). The [`getDisplayMedia()`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getDisplayMedia) method allows the user to select a screen to capture as a media stream. This stream can then be recorded with the [MediaRecorder API](https://developer.chrome.com/blog/mediarecorder/) or shared with others over the network. The recording can be saved to a local file via the [`showOpenFilePicker()`](https://developer.mozilla.org/docs/Web/API/Window/showOpenFilePicker) method.

The example below shows how you can record the user's screen in the WebM format, locally preview on the same page, and save the recording to the user's file system.

```js
let stream;
let recorder;

shareScreenButton.addEventListener("click", async () => {
  // Prompt the user to share their screen.
  stream = await navigator.mediaDevices.getDisplayMedia();
  recorder = new MediaRecorder(stream);
  // Preview the screen locally.
  video.srcObject = stream;
});

stopShareScreenButton.addEventListener("click", () => {
  // Stop the stream.
  stream.getTracks().forEach(track => track.stop());
  video.srcObject = null;
});

startRecordButton.addEventListener("click", async () => {
  // For the sake of more legible code, this sample only uses the
  // `showSaveFilePicker()` method. In production, you need to
  // cater for browsers that don't support this method, as
  // outlined in https://web.dev/patterns/files/save-a-file/.

  // Prompt the user to choose where to save the recording file.
  const suggestedName = "screen-recording.webm";
  const handle = await window.showSaveFilePicker({ suggestedName });
  const writable = await handle.createWritable();

  // Start recording.
  recorder.start();
  recorder.addEventListener("dataavailable", async (event) => {
    // Write chunks to the file.
    await writable.write(event.data);
    if (recorder.state === "inactive") {
      // Close the file when the recording stops.
      await writable.close();
    }
  });
});

stopRecordButton.addEventListener("click", () => {
  // Stop the recording.
  recorder.stop();
});
```

## Browser support

### MediaDevices.getDisplayMedia()

{% BrowserCompat 'api.MediaDevices.getDisplayMedia' %}

### MediaRecorder API

{% BrowserCompat 'api.MediaRecorder' %}

### File System Access API's showSaveFilePicker()

{% BrowserCompat 'api.Window.showOpenFilePicker' %}

## Further reading

- [W3C Screen Capture Specification](https://w3c.github.io/mediacapture-screen-share/)
- [W3C MediaStream Recording Specification](https://w3c.github.io/mediacapture-record/#mediarecorder-api)
- [WICG File System Access Specification](https://wicg.github.io/file-system-access/)

## Demo

