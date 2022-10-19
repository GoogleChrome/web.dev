---
layout: pattern
title: How to record audio from a microphone
date: 2022-10-19
authors:
  - beaufortfrancois
description: >
  Learn how to record audio from a microphone.
height: 800
---

Accessing the user's camera and microphone is possible on the web platform with the [Media Capture and Streams API](https://www.w3.org/TR/mediacapture-streams/). The [`getUserMedia()`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia) method prompts the user to access a camera and/or microphone to capture as a media stream. This stream can then be recorded with the [MediaRecorder API](https://developer.chrome.com/blog/mediarecorder/) or shared with others over the network. The recording can be saved to a local file via the [`showOpenFilePicker()`](https://developer.mozilla.org/docs/Web/API/Window/showOpenFilePicker) method.

The example below shows how you can record the audio from a microphone in the WebM format and save the recording to the user's file system.
```js
let stream;
let recorder;

startMicrophoneButton.addEventListener("click", async () => {
  // Prompt the user to use their microphone.
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  recorder = new MediaRecorder(stream);
});

stopMicrophoneButton.addEventListener("click", () => {
  // Stop the stream.
  stream.getTracks().forEach(track => track.stop());
});

startRecordButton.addEventListener("click", async () => {
  // For the sake of more legible code, this sample only uses the
  // `showSaveFilePicker()` method. In production, you need to
  // cater for browsers that don't support this method, as
  // outlined in https://web.dev/patterns/files/save-a-file/.

  // Prompt the user to choose where to save the recording file.
  const suggestedName = "microphone-recording.webm";
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

### MediaDevices.getUserMedia()

{% BrowserCompat 'api.MediaDevices.getUserMedia' %}

### MediaRecorder API

{% BrowserCompat 'api.MediaRecorder' %}

### File System Access API's showSaveFilePicker()

{% BrowserCompat 'api.Window.showOpenFilePicker' %}

## Further reading

- [W3C Media Capture and Streams Specification](https://www.w3.org/TR/mediacapture-streams/)
- [W3C MediaStream Recording Specification](https://w3c.github.io/mediacapture-record/#mediarecorder-api)
- [WICG File System Access Specification](https://wicg.github.io/file-system-access/)

## Demo

