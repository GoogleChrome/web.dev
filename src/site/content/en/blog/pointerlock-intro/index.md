---
layout: post
title: Pointer lock and first person shooter controls
authors:
  - johnmccutchan
date: 2012-08-17
tags:
  - blog
---

## Introduction

The Pointer Lock API helps properly implement first-person shooter controls in a browser game. Without relative mouse movement the player's cursor could, for example, hit the right edge of the screen and any further movements to the right would be discounted - the view would not continue to pan right, and the player would not be able to pursue the bad guys and strafe them with his machine gun. The player is going to get fragged and become frustrated. With pointer lock this suboptimal behaviour can't happen.

The [Pointer Lock API](https://developer.mozilla.org/docs/API/Pointer_Lock_API) allows your application to do the following:

- Get access to raw mouse data including relative mouse movements
- Route all mouse events to a specific element

As a side effect of enabling pointer lock, the mouse cursor is hidden allowing you to choose to draw an application-specific pointer if you desire, or leave the mouse pointer hidden so that the user can move the frame with the mouse. Relative mouse movement is the mouse pointer position's delta from the previous frame regardless of absolute position.  For example, if the mouse pointer moved from (640, 480) to (520, 490) the relative movement was (-120, 10). See below for an interactive example showing raw mouse position deltas.

This tutorial covers two topics: the nuts and bolts of activating and processing pointer lock events, and implementing the first-person shooter control scheme. That's right, when you're finished reading this article you will know how to use pointer lock and implement Quake-style controls for your very own browser game!

### Browser compatibility

{% BrowserCompat 'api.Element.requestPointerLock' %}

## Pointer Lock Mechanics

### Feature Detection

To determine if the user's browser supports pointer lock you need to check for `pointerLockElement` or a vendor-prefixed version in the document object. In code:

```js
var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;
```

Currently pointer lock is only available in Firefox and Chrome. Opera and IE do not yet support it.

### Activating

Activating pointer lock is a two step process. First your application requests pointer lock be enabled for a specific element, and immediately after the user gives permission, a `pointerlockchange` event fires. The user can cancel pointer lock at any time by pressing the escape key. Your application can also progrmamatically exit pointer lock. When pointer lock is cancelled a `pointerlockchange` event fires.

```js
element.requestPointerLock = element.requestPointerLock ||
			     element.mozRequestPointerLock ||
			     element.webkitRequestPointerLock;
// Ask the browser to lock the pointer
element.requestPointerLock();

// Ask the browser to release the pointer
document.exitPointerLock = document.exitPointerLock ||
			   document.mozExitPointerLock ||
			   document.webkitExitPointerLock;
document.exitPointerLock();
```

The above code is all it takes. When the browser locks the pointer a bubble will popup letting the user know that your application has locked the pointer and instructing them that they can cancel it by pressing the 'Esc' key.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/HhdPKkAI2RlF9SK4W0Vb.png", alt="Pointer Lock info bar in Chrome.", width="443", height="50" %}
<figcaption>Pointer Lock info bar in Chrome.</figcaption>
</figure>

### Event Handling

There are two events that your application must add listeners for. The first is `pointerlockchange`, which fires whenever a change in pointer lock state occurs. The second is `mousemove` which fires whenever the mouse has moved.

```js
// Hook pointer lock state change events
document.addEventListener('pointerlockchange', changeCallback, false);
document.addEventListener('mozpointerlockchange', changeCallback, false);
document.addEventListener('webkitpointerlockchange', changeCallback, false);

// Hook mouse move events
document.addEventListener("mousemove", this.moveCallback, false);
```

{% Aside %}
Because of vendor-prefixing, you will have to listen for `pointerlockchange`, `mozpointerlockchange`, and `webkitpointerlockchange`events to be cross-browser compatible.
{% endAside %}

Inside your `pointerlockchange` callback you must check if the pointer has just been locked or unlocked. Determining if pointer lock was enabled is simple: check if document.pointerLockElement is equal to the element that pointer lock was requested for. If it is, your application successfully locked the pointer and if it is not, the pointer was unlocked by the user or your own code.

```js
if (document.pointerLockElement === requestedElement ||
  document.mozPointerLockElement === requestedElement ||
  document.webkitPointerLockElement === requestedElement) {
  // Pointer was just locked
  // Enable the mousemove listener
  document.addEventListener("mousemove", this.moveCallback, false);
} else {
  // Pointer was just unlocked
  // Disable the mousemove listener
  document.removeEventListener("mousemove", this.moveCallback, false);
  this.unlockHook(this.element);
}
```

When pointer lock is enabled `clientX`, `clientY`, `screenX`, and `screenY` remain constant. `movementX` and `movementY` are updated with the number of pixels the pointer would have moved since the last event was delivered. In pseudo-code:

```js
event.movementX = currentCursorPositionX - previousCursorPositionX;
event.movementY = currentCursorPositionY - previousCursorPositionY;
```

Inside the `mousemove` callback relative mouse motion data can be extracted from the event's `movementX` and `movementY` fields.

```js
function moveCallback(e) {
  var movementX = e.movementX ||
      e.mozMovementX          ||
      e.webkitMovementX       ||
      0,
  movementY = e.movementY ||
      e.mozMovementY      ||
      e.webkitMovementY   ||
      0;
}
```

{% Aside %}
The movement fields also have vendor-prefixes
{% endAside %}

### Catching errors
If an error is raised by either entering or exiting pointer lock the `pointerlockerror` event fires. There is no data attached to this event.

```js
document.addEventListener('pointerlockerror', errorCallback, false);
document.addEventListener('mozpointerlockerror', errorCallback, false);
document.addEventListener('webkitpointerlockerror', errorCallback, false);
```

### Full-screen Required?

Originally pointer lock was tied to the FullScreen API. Meaning that an element must be in fullscreen mode before it can have the pointer locked to it. That is no longer true and pointer lock can be used for any element in your application full-screen or not.

## First-Person Shooter Controls Example

Now that we have pointer lock enabled and receiving events, it's time for a practical example. Have you ever wanted to know how the controls in Quake work? Strap in because I'm about to explain them with code!

First-person shooter controls are built around four core mechanics:

- Moving forward and backward along the current look vector
- Moving left and right along the current strafe vector
- Rotating the view yaw (left and right)
- Rotating the view pitch (up and down)

A game implementing this control scheme needs only three pieces of data: camera position, camera look vector, and a constant up vector. The up vector is always (0, 1, 0). All four of the above mechanics just manipulate the camera position and camera look vector in different ways.

### Movement

First on deck is movement. In the demo below movement is mapped to the standard W, A, S, and D keys. The W and S keys drive the camera forward and backward. While the A and D keys drive the camera to the left and right. Moving the camera forward and backward is simple:

```js
// Forward direction
var forwardDirection = vec3.create(cameraLookVector);
// Speed
var forwardSpeed = dt * cameraSpeed;
// Forward or backward depending on keys held
var forwardScale = 0.0;
forwardScale += keyState.W ? 1.0 : 0.0;
forwardScale -= keyState.S ? 1.0 : 0.0;
// Scale movement
vec3.scale(forwardDirection, forwardScale * forwardSpeed);
// Add scaled movement to camera position
vec3.add(cameraPosition, forwardDirection);
```

Strafing left and right requires a strafe direction. The strafe direction can be computed using the cross product:

```js
// Strafe direction
var strafeDirection = vec3.create();
vec3.cross(cameraLookVector, cameraUpVector, strafeDirection);
```

Once you have the strafe direction, implementing strafe movement is the same as moving forward or backward.

Next up is rotating the view.

### Yaw
Yaw or the horizontal rotation of the camera view is just a rotation around the constant up vector. Below is general code for rotating the camera look vector around an arbitrary axis. It works by constructing a [quaternion](http://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation) representing the rotation of `deltaAngle` radians around `axis` and then uses the quaternion to rotate the camera look vector:

```js
// Extract camera look vector
var frontDirection = vec3.create();
vec3.subtract(this.lookAtPoint, this.eyePoint, frontDirection);
vec3.normalize(frontDirection);
var q = quat4.create();
// Construct quaternion
quat4.fromAngleAxis(deltaAngle, axis, q);
// Rotate camera look vector
quat4.multiplyVec3(q, frontDirection);
// Update camera look vector
this.lookAtPoint = vec3.create(this.eyePoint);
vec3.add(this.lookAtPoint, frontDirection);
```

### Pitch

Implementing pitch or the vertical rotation of the camera view is similar but instead of a rotation around the up vector you apply a rotation around the strafe vector. The first step is to compute the strafe vector and then rotate the camera look vector around that axis.

## Summary
The Pointer Lock API allows you to take control of the mouse cursor. If you're making web games your players will love it when they stop getting fragged because they excitedly moved mouse out of the window and your game stopped getting mouse updates. Usage is simple:

- Add `pointerlockchange` event listener to track the state of pointer lock
- Request pointer lock for a specific element
- Add `mousemove` event listener to get updates

## External Demos

- [Quake 3 Map Viewer](http://media.tojicode.com/q3bsp/)
- [Video demonstration](https://www.youtube.com/watch?v=onD-avVQXFk)

## References

 - [Mozilla Developer Network API documentation](https://developer.mozilla.org/API/Mouse_Lock_API)
