---
layout: pattern
title: How to add effects to audio
date: 2022-09-01
authors:
  - conwayt
description: >
  Learn how to use the Web Audio API to add effects to audio sources.
height: 800
---

## The modern way
The Web Audio API uses the `AudioContext()` interface to manage sources, filters, and destinations. Once you’ve created a new `AudioContext()`, create an audio source node, like an `AudioBufferSourceNode` or `OscillatorNode`.  As an example, consider a basic oscillator with a [low pass filter](https://en.wikipedia.org/wiki/Low-pass_filter) applied.

{% BrowserCompat 'api.AudioContext' %}
### Using the `createBiquadFilter()` method

First, create a new `AudioContext()`. Then create an audio source node, like an [`AudioBufferSourceNode`](https://developer.mozilla.org/docs/Web/API/AudioBufferSourceNode) or [`OscillatorNode`](https://developer.mozilla.org/docs/Web/API/OscillatorNode).  You'll create a `sine` oscillator node, for this example, which has a frequency of 420 hertz from the moment it starts playing.

```js
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioCtx.createOscillator()
oscillator.type = 'sine';
 // Value is in hertz.
oscillator.frequency.setValueAtTime(420, audioCtx.currentTime);
```

Next, create an effect node using `createBiquadFilter()`. Set the type to `lowpass` and the frequency to start 1 second after the start of playback. Then connect the `biquadFilter` to the `oscillator`.

```js
const biquadFilter = audioCtx.createBiquadFilter();
biquadFilter.type = 'lowpass';
biquadFilter.frequency.setValueAtTime(200, audioCtx.currentTime + 1);
oscillator.connect(biquadFilter);
```

Finally connect the `biquadFilter` to the destination of the `audioCtx`, before starting the `oscillator` and stopping it after 2 seconds of playback.

```js
biquadFilter.connect(audioCtx.destination);
oscillator.start();
oscillator.stop(2);
```

The sound from the oscillator is passed through the unaffected filter, and on to the destination, which is your computer's speakers. After 1 second of playback, the `lowpass` filter comes into effect. After 2 seconds, the oscillator is stopped.

{% BrowserCompat 'api.BiquadNodeFilter' %}
### Other available filters and effects

Other filter nodes can be added to an `AudioContext` to create different effects:

- [`createWaveShaper()`](https://developer.mozilla.org/docs/Web/API/BaseAudioContext/createWaveShaper) is used to add distortion to a source.
- [`createGain()`](https://developer.mozilla.org/docs/Web/API/BaseAudioContext/createGain) is used to boost the overall signal of the source it's applied to.
- [`createConvolver()`](https://developer.mozilla.org/docs/Web/API/BaseAudioContext/createConvolver) is most commonly used to add reverb to a source.
- [`createDelay()`](https://developer.mozilla.org/docs/Web/API/BaseAudioContext/createDelay) is used to add delay to the start of a source.
- [`createDynamicsCompressor()`](https://developer.mozilla.org/docs/Web/API/BaseAudioContext/createDynamicsCompressor) is used to raise the volume of the quietest part of a source, and lower the volume of the loudest parts.
- [`createPanner()`](https://developer.mozilla.org/docs/Web/API/BaseAudioContext/createPanner) and [`createStereoPanner()`](https://developer.mozilla.org/docs/Web/API/BaseAudioContext/createStereoPanner) are used for changing the spatial position of sound output.

## The classic way

Before the availability of the Web Audio API, there was no way to add effects to audio in the browser.  Workarounds using server-side rendering and switching between streams are possible, but this can incur a lot of network overhead.

### Using the audio element

The only audio effects that can be directly controlled are playback and volume.

```js
const audio = document.querySelector('audio');
 // Sets audio volume to 50%
audio.volume = 0.5;
// Doubles the playback rate.
audio.playbackRate = 2;
```

{% BrowserCompat 'api.HTMLAudioElement' %}

## Further reading

- [W3C Web Audio Specification](https://webaudio.github.io/web-audio-api/)
- [Getting started with Web Audio API](/webaudio-intro/)
- [Web Audio API](https://developer.mozilla.org/docs/Web/API/Web_Audio_API)
