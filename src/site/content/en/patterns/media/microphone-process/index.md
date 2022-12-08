---
layout: pattern
title: How to process audio from the user's microphone
date: 2022-10-19
authors:
  - beaufortfrancois
description: >
  Learn how to process audio from the user's microphone.
height: 800
static:
  - processor.js
---

Accessing the user's camera and microphone is possible on the web platform with the [Media Capture and Streams API](https://www.w3.org/TR/mediacapture-streams/). The [`getUserMedia()`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia) method prompts the user to access a camera and/or microphone to capture as a media stream. This stream can then be processed in a separate [Web Audio](https://developer.mozilla.org/docs/Web/API/Web_Audio_API) thread with an [AudioWorklet](https://developer.mozilla.org/docs/Web/API/AudioWorklet) that provides very low latency audio processing.

The example below shows how you can process audio from the user's microphone in a performant way.

```js
let stream;

startMicrophoneButton.addEventListener("click", async () => {
  // Prompt the user to use their microphone.
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);

  await context.audioWorklet.addModule("processor.js");
  const processor = new AudioWorkletNode(context, "processor");

  source.connect(processor).connect(context.destination);
  log("Your microphone audio is being used.");
});

stopMicrophoneButton.addEventListener("click", () => {
  // Stop the stream.
  stream.getTracks().forEach(track => track.stop());

  log("Your microphone audio is not used anymore.");
});
```

```js
// processor.js
class Processor extends AudioWorkletProcessor {
  process([input], [output]) {
    // Copy inputs to outputs.
    input[0].forEach((sample, i) => output[0][i] = sample);
    return true;
  }
}

registerProcessor("processor", Processor);
```

## Browser support

### MediaDevices.getUserMedia()

{% BrowserCompat 'api.MediaDevices.getUserMedia' %}

### Web Audio

{% BrowserCompat 'api.AudioContext' %}

### AudioWorklet

{% BrowserCompat 'api.AudioWorklet' %}

## Further reading

- [W3C Media Capture and Streams Specification](https://www.w3.org/TR/mediacapture-streams/)
- [W3C Web Audio Specification](https://webaudio.github.io/web-audio-api/)
- [Enter AudioWorklet](https://developer.chrome.com/blog/audio-worklet/)

## Demo

