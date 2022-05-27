---
layout: post
title: Mixing positional audio and WebGL
authors:
  - ilmariheikkinen
date: 2012-02-16
tags:
  - blog
---

## Introduction

In this article I’m going to talk about how to use the positional audio feature in the [Web Audio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html) to add 3D sound into your WebGL scenes. To make the audio more believable, I will also introduce you to the environmental effects possible with the Web Audio API. To get a more thorough introduction to the Web Audio API, check out the [Getting started with Web Audio API](http://www.html5rocks.com/tutorials/webaudio/intro/) article by Boris Smus.

To do positional audio, you use the AudioPannerNode in the Web Audio API. The AudioPannerNode defines the position, orientation and velocity of a sound. Additionally, the Web Audio API audio context has a listener attribute that lets you define the position, orientation and velocity of the listener. With these two things you can create directional sounds with doppler effects and 3D panning.

Let's see what the audio code looks like for the above scene. This is very basic Audio API code. You create a bunch of Audio API nodes and connect them together. The audio nodes are individual sounds, volume controllers, effect nodes and analyzers and suchlike. After you have built this graph, you need to hook it up to the audio context destination to make it audible.

```js
// Detect if the audio context is supported.
window.AudioContext = (
  window.AudioContext ||
  window.webkitAudioContext ||
  null
);

if (!AudioContext) {
  throw new Error("AudioContext not supported!");
} 

// Create a new audio context.
var ctx = new AudioContext();

// Create a AudioGainNode to control the main volume.
var mainVolume = ctx.createGain();
// Connect the main volume node to the context destination.
mainVolume.connect(ctx.destination);

// Create an object with a sound source and a volume control.
var sound = {};
sound.source = ctx.createBufferSource();
sound.volume = ctx.createGain();

// Connect the sound source to the volume control.
sound.source.connect(sound.volume);
// Hook up the sound volume control to the main volume.
sound.volume.connect(mainVolume);

// Make the sound source loop.
sound.source.loop = true;

// Load a sound file using an ArrayBuffer XMLHttpRequest.
var request = new XMLHttpRequest();
request.open("GET", soundFileName, true);
request.responseType = "arraybuffer";
request.onload = function(e) {

  // Create a buffer from the response ArrayBuffer.
  ctx.decodeAudioData(this.response, function onSuccess(buffer) {
    sound.buffer = buffer;

    // Make the sound source use the buffer and start playing it.
    sound.source.buffer = sound.buffer;
    sound.source.start(ctx.currentTime);
  }, function onFailure() {
    alert("Decoding the audio buffer failed");
  });
};
request.send();
```
  
## Position

Positional audio uses the position of your audio sources and the position of the listener to determine how to mix the sound to the speakers. An audio source on the left side of the listener would be louder in the left speaker, and vice versa for the right side.

To get started, create an audio source and attach it to an AudioPannerNode. Then set the position of the AudioPannerNode. Now you have a movable 3D sound. The audio context listener position is at (0,0,0) by default, so when used in this way, the AudioPannerNode position is relative to the camera position. Whenever you move the camera, you need to update the AudioPannerNode position. To make the AudioPannerNode position relative to the world, you need to change the audio context listener position to your camera position.

To set up the position tracking, we need to create an AudioPannerNode and wire it up to the main volume.

```js
...
sound.panner = ctx.createPanner();
// Instead of hooking up the volume to the main volume, hook it up to the panner.
sound.volume.connect(sound.panner);
// And hook up the panner to the main volume.
sound.panner.connect(mainVolume);
...
```

On every frame, update the positions of the AudioPannerNodes. I'm going to be using Three.js in the examples below.

```js
...
// In the frame handler function, get the object's position.
object.position.set(newX, newY, newZ);
object.updateMatrixWorld();
var p = new THREE.Vector3();
p.setFromMatrixPosition(object.matrixWorld);

// And copy the position over to the sound of the object.
sound.panner.setPosition(p.x, p.y, p.z);
...
```

To track the listener position, set the audio context's listener position to match the camera position.

```js
...
// Get the camera position.
camera.position.set(newX, newY, newZ);
camera.updateMatrixWorld();
var p = new THREE.Vector3();
p.setFromMatrixPosition(camera.matrixWorld);

// And copy the position over to the listener.
ctx.listener.setPosition(p.x, p.y, p.z);
...
```

## Velocity

Now that we have the positions of the listener and the AudioPannerNode, let’s turn our attention to their velocities. By changing the velocity properties of the listener and the AudioPannerNode, you can add a doppler effect to the sound. There are some nice doppler effect examples on the Web Audio API [examples page](http://chromium.googlecode.com/svn/trunk/samples/audio/index.html).

The easiest way to get the velocities for the listener and the AudioPannerNode is to keep track of their per-frame positions. The velocity of the listener is the camera’s current position minus the camera’s position in the previous frame. Similarly, the velocity of the AudioPannerNode is its current position minus its previous position.

Tracking the velocity can be done by getting the object's previous position, subtracting it from the current position and dividing the result by the time elapsed since last frame. Here's how to do it in Three.js:

```js
...
var dt = secondsSinceLastFrame;

var p = new THREE.Vector3();
p.setFromMatrixPosition(object.matrixWorld);
var px = p.x, py = p.y, pz = p.z;

object.position.set(newX, newY, newZ);
object.updateMatrixWorld();

var q = new THREE.Vector3();
q.setFromMatrixPosition(object.matrixWorld);
var dx = q.x-px, dy = q.y-py, dz = q.z-pz;

sound.panner.setPosition(q.x, q.y, q.z);
sound.panner.setVelocity(dx/dt, dy/dt, dz/dt);
...
```


## Orientation

Orientation is the direction the sound source is pointing to and the direction the listener is facing. With orientation, you can simulate directional sound sources. For an example, think of a directional speaker. If you stand in front of the speaker, the sound is going to be louder than if you stand behind the speaker. More importantly, you need listener orientation to determine which side of the listener the sounds are coming from. A sound coming from your left needs to switch to the right when you turn around.

To get the orientation vector for the AudioPannerNode, you need to take the rotation part of the model matrix of the sound-emitting 3D object and multiply a vec3(0,0,1) with it to see where it ends up pointing. For the context listener orientation, you need to get the camera’s orientation vector. The listener orientation also needs an up vector, since it needs to know the roll angle of the listener's head. To compute the listener orientation, get the rotation part of the camera's view matrix and multiply a vec3(0,0,1) for the orientation and a vec3(0,-1,0) for the up-vector.

For orientation to have an effect on your sounds, you also need to define the cone for the sound. The sound cone takes an inner angle, outer angle and outer gain. The sound plays at the normal volume inside the inner angle and gradually changes gain to outer gain as you approach the outer angle. Outside the outer angle the sound plays at outer gain.

Tracking the orientation in Three.js is a bit trickier as it involves some vector math and zeroing the translation part of the 4x4 world matrices. Still, not many lines of code.

```js
...
var vec = new THREE.Vector3(0,0,1);
var m = object.matrixWorld;

// Save the translation column and zero it.
var mx = m.elements[12], my = m.elements[13], mz = m.elements[14];
m.elements[12] = m.elements[13] = m.elements[14] = 0;

// Multiply the 0,0,1 vector by the world matrix and normalize the result.
vec.applyProjection(m);
vec.normalize();

sound.panner.setOrientation(vec.x, vec.y, vec.z);

// Restore the translation column.
m.elements[12] = mx;
m.elements[13] = my;
m.elements[14] = mz;
...
```

Camera orientation tracking also requires the up vector, so you need to multiply an up vector with the transformation matrix.

```js
...
// The camera's world matrix is named "matrix".
var m = camera.matrix;

var mx = m.elements[12], my = m.elements[13], mz = m.elements[14];
m.elements[12] = m.elements[13] = m.elements[14] = 0;

// Multiply the orientation vector by the world matrix of the camera.
var vec = new THREE.Vector3(0,0,1);
vec.applyProjection(m);
vec.normalize();

// Multiply the up vector by the world matrix.
var up = new THREE.Vector3(0,-1,0);
up.applyProjection(m);
up.normalize();

// Set the orientation and the up-vector for the listener.
ctx.listener.setOrientation(vec.x, vec.y, vec.z, up.x, up.y, up.z);

m.elements[12] = mx;
m.elements[13] = my;
m.elements[14] = mz;
...
```

To set the sound cone for your sound, you set the appropriate properties of the panner node. The cone angles are in degrees and run from 0 to 360.

```js
...
sound.panner.coneInnerAngle = innerAngleInDegrees;
sound.panner.coneOuterAngle = outerAngleInDegrees;
sound.panner.coneOuterGain = outerGainFactor;
...
```

## All together

Putting it all together, the audio context listener follows the position, orientation and velocity of the camera, and the AudioPannerNodes follow the positions, orientations and velocities of their respective audio sources. You need to update the positions, velocities and orientations of the AudioPannerNodes and the audio context listener on every frame.
  
## Environmental effects

After you’ve got positional audio set up, you can set the environmental effects for your audio to enhance the immersiveness of your 3D scene. Suppose your scene is set inside a large cathedral. On default settings, the sounds in your scene sound like you’re standing outdoors. This discrepancy between the visuals and audio breaks immersion and makes your scene less impressive.

The Web Audio API has a ConvolverNode that lets you set the environmental effect for a sound. Add it to the processing graph for the audio source and you’ll be able to make the sound fit the setting. You can find impulse response samples on the web that you can use with ConvolverNodes, and you can also make your own. It may be slightly cumbersome experience as you need to record the impulse response of the place you wish to simulate, but the capability is there if you need it.

Using ConvolverNodes to do environmental audio requires rewiring the audio processing graph. Instead of passing sound directly to the main volume, you need to route it through the ConvolverNode. And as you may want to control the strength of the environmental effect, you also need to route the audio around the ConvolverNode. To control the mix volumes the ConvolverNode and the plain audio need to have GainNodes attached to them.
  
The final audio processing graph I'm using has the audio from the objects going through a GainNode used as a pass-through mixer. From the mixer I pass the audio into the ConvolverNode and another GainNode, which is used to control the volume of the plain audio. The ConvolverNode is hooked into its own GainNode to control the convolved audio volume. The outputs of the GainNodes are connected to the main volume controller.
  
```js
...
var ctx = new webkitAudioContext();
var mainVolume = ctx.createGain();

// Create a convolver to apply environmental effects to the audio.
var convolver = ctx.createConvolver();

// Create a mixer that receives sound from the panners.
var mixer = ctx.createGain();

sounds.forEach(function(sound){
  sound.panner.connect(mixer);
});

// Create volume controllers for the plain audio and the convolver.
var plainGain = ctx.createGain();
var convolverGain = ctx.createGain();

// Send audio from the mixer to plainGain and the convolver node.
mixer.connect(plainGain);
mixer.connect(convolver);

// Hook up the convolver to its volume control.
convolver.connect(convolverGain);

// Send audio from the volume controls to the main volume control.
plainGain.connect(mainVolume);
convolverGain.connect(mainVolume);

// Finally, connect the main volume to the audio context's destination.
volume.connect(ctx.destination);
...
``` 

To make the ConvolverNode work, you need to load an impulse response sample into a buffer and make the ConvolverNode use it. Loading the sample happens in the same way as with normal sound samples. Below is an example of one way to do it:

```js
...
loadBuffer(ctx, "impulseResponseExample.wav", function(buffer){
  convolver.buffer = buffer;
  convolverGain.gain.value = 0.7;
  plainGain.gain.value = 0.3;
})
...
function loadBuffer(ctx, filename, callback) {
  var request = new XMLHttpRequest();
  request.open("GET", soundFileName, true);
  request.responseType = "arraybuffer";
  request.onload = function() {
    // Create a buffer and keep the channels unchanged.
    ctx.decodeAudioData(request.response, callback, function() {
      alert("Decoding the audio buffer failed");
    });
  };
  request.send();
}
```
## Summary

In this article you learned how to add positional audio to your 3D scenes using the Web Audio API. The Web Audio API gives you a way to set the position, orientation and velocity of audio sources and the listener. By setting those to track the objects in your 3D scene, you can create a rich soundscape for your 3D applications.

To make the audio experience even more compelling, you can use the ConvolverNode in the Web Audio API to set up the general sound of the environment. From cathedrals to closed rooms, you can simulate a variety of effects and environments using the Web Audio API.

## References

- [Web Audio API specification](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html)
- [Impulse response](http://en.wikipedia.org/wiki/Impulse_response)
- [Three.js](https://github.com/mrdoob/three.js)
- [A cool 3D Positional Audio example](http://apps.playcanvas.com/dave/tutorials/3d_audio)
- [Web Audio Examples](http://chromium.googlecode.com/svn/trunk/samples/audio/index.html) has a lot of good examples on using Web Audio API features.
