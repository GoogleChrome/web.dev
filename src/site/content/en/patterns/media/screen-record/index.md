---
layout: pattern
title: How to record screen
date: 2022-10-14
authors:
  - beaufortfrancois
description: >
  Learn how to record screen.
height: 800
---

Sharing tabs, windows, and screens is already possible on the web platform with the [Screen Capture API](https://w3c.github.io/mediacapture-screen-share/). In short, `getDisplayMedia()` allows the user to select a screen to capture as a media stream. This stream can then be recorded with [MediaRecorder](https://developer.chrome.com/blog/mediarecorder/) or shared with others over the network. [showOpenFilePicker()](/file-system-access/) allows us finally to save the recording file locally.

The example below shows how user's screen can be recorded as webm content, locally previewed on the same page, and saved to the local file system.

```js
let recorder;

shareScreenButton.addEventListener("click", async () => {
  // Prompt user to share their screen.
  const stream = await navigator.mediaDevices.getDisplayMedia();
  recorder = new MediaRecorder(stream);
  // Preview screen locally.
  video.srcObject = stream;
});

startRecordButton.addEventListener("click", async () => {
  // For the sake of more legible code, it only uses the
  // showSaveFilePicker() method. In production, you need to
  // cater for browsers that don't support this method, as
  // outlined in https://web.dev/patterns/files/save-a-file/.

  // Prompt user to choose where to save the recording file.
  const suggestedName = "screen-record.webm";
  const handle = await window.showSaveFilePicker({ suggestedName });
  const writable = await handle.createWritable();

  // Start recording.
  recorder.start();
  recorder.addEventListener("dataavailable", async (event) => {
    // Write chunks to the file.
    await writable.write(event.data);
    if (recorder.state == "inactive") {
      // Close file when recording stops.
      await writable.close();
    }
  });
});

stopRecordButton.addEventListener("click", () => {
  // Stop recording.
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
