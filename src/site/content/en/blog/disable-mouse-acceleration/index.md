---
title: Disable mouse acceleration to provide a better FPS gaming experience
subhead: |
  Web apps can now disable mouse acceleration when capturing pointer events.
authors:
  - beaufortfrancois
date: 2020-11-26
hero: image/admin/8cpTXMJGUfcdNXLc6obE.jpg
thumbnail: image/admin/kA7qbVPt0ovuNzReFanO.jpg
alt: Gamer girl is playing FPS online video game on her computer
description: |
  Web apps can now disable mouse acceleration when capturing pointer events.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - games
  - devices
feedback:
  - api
---

Accelerated movement is an ergonomic feature when using a mouse or trackpad to
move the pointer on screen. It allows precise movement by moving slowly while
also allowing the pointer to cross the entire screen with a quick short motion.
Specifically, for the same physical distance that you move the mouse, the
pointer on screen travels further if the distance was traveled faster.

Operating systems enable mouse acceleration by default. For some [first-party
perspective] games, commonly first party shooters (FPS), raw mouse input data is
used to control camera rotation without an acceleration adjustment. The same
physical motion, slow or fast, results in the same rotation. This results in a
better gaming experience and higher accuracy according to professional gamers.

<figure class="w-figure">
  {% Img src="image/admin/4x9YZ7nC3SJMN9FI46zN.png", alt="Screenshot of the pointer motion control in Windows 10 settings.", width="800", height="260", class="w-screenshot" %}
  <figcaption class="w-figcaption">Pointer motion control in Windows 10 settings.</figcaption>
</figure>

Starting in Chrome 88, web apps can switch back and forth between accelerated
and non-accelerated mouse movement data thanks to the [updated Pointer Lock
API].

Web-based gaming platforms such as [Google Stadia] and [Nvidia GeForce Now]
already use these new capabilities to please FPS gamers.

## Using the API {: #use }

### Request a pointer lock {: #request }

A pointer lock is the canonical term for when a desktop application hides the
pointer icon and interprets mouse motion for something else, e.g. looking around
in a 3D world.

The  `movementX` and `movementY` attributes from the `mousemove` document events
tell you how much the mouse pointer moved since the last move event. However,
those are not updated when the pointer moves outside of the web page.

```js
document.addEventListener("mousemove", (event) => {
  console.log(`movementX: ${event.movementX} movementY: ${event.movementY}`);
});
```

Capturing the mouse pointer (or requesting a pointer lock) allows you to not
worry about the pointer moving outside anymore. This is especially useful for
immersive web games. When the pointer is locked, all mouse events go to the
target element of the pointer lock.

Call `requestPointerLock()` on the target element to request a pointer lock, and
listen to `pointerlockchange` and `pointerlockerror` events to monitor pointer
lock changes.

```js
const myTargetElement = document.body;

// Call this function to request a pointer lock.
function requestPointerLock() {
  myTargetElement.requestPointerLock();
}

document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement) {
    console.log(`pointer is locked on ${document.pointerLockElement}`);
  } else {
    console.log("pointer is unlocked");
  }
});

document.addEventListener("pointerlockerror", () => {
  console.log("pointer lock error");
});
```

### Disable mouse acceleration {: #disable-mouse-acceleration }

Call `requestPointerLock()` with  `{ unadjustedMovement: true }` to disable
OS-level adjustment for mouse acceleration, and access raw mouse input.
This way, mouse movement data from `mousemove` events won't include mouse
acceleration when the pointer is locked.

Use the new returned promise from `requestPointerLock()` to know if the request
was successful.

```js
function requestPointerLockWithUnadjustedMovement() {
  const promise = myTargetElement.requestPointerLock({
    unadjustedMovement: true,
  });

  if (!promise) {
    console.log("disabling mouse acceleration is not supported");
    return;
  }

  return promise
    .then(() => console.log("pointer is locked"))
    .catch((error) => {
      if (error.name === "NotSupportedError") {
        // Some platforms may not support unadjusted movement.
        // You can request again a regular pointer lock.
        return myTargetElement.requestPointerLock();
      }
    });
}
```

It is possible to toggle between accelerated and non-accelerated mouse movement
data without releasing the pointer lock. Simply request the pointer lock again
with the desired option. If that request fails, the original lock will remain
intact and the returned promise will reject. No pointer lock events will fire
for a failed change request.

### Browser support {: #browser-support }

The Pointer Lock API is [well supported across browsers]. However Chromium-based
browsers (e.g. Chrome, Edge, etc.) are the only ones to support disabling
OS-level adjustment for mouse acceleration as of October 2020.
See MDN's [Browser compatibility] table for updates.

### Operating system support {: #os-support }

Disabling OS-level adjustment for mouse acceleration is supported on Chrome OS,
macOS Catalina 10.15.1, and Windows. Linux will follow.

## Sample  {: #sample }

You can play with the Pointer Lock API by running the [sample] on Glitch. Be
sure to [check out the source code].

{% Glitch { id: 'unadjusted-movement', path: 'script.js' } %}

## Helpful links {: #helpful }

- [Explainer](https://github.com/slightlyoff/unadjusted_pointer_lock_explainer)
- [Specification PR](https://github.com/w3c/pointerlock/pull/49)
- [GitHub repository](https://github.com/w3c/pointerlock)
- [ChromeStatus entry](https://www.chromestatus.com/feature/5723553087356928)
- [Chrome tracking bug](https://bugs.chromium.org/p/chromium/issues/detail?id=982379)
- [Intent to ship](https://groups.google.com/a/chromium.org/d/msg/blink-dev/cQn7OwcMQ64/OWmA9KMKBQAJ)
- [Mozilla's position](https://github.com/mozilla/standards-positions/issues/448)
- [WebKit's position](https://lists.webkit.org/pipermail/webkit-dev/2020-October/031473.html)

## Acknowledgements

Thanks to [James Hollyer], [Thomas Steiner], [Joe Medley], [Kayce Basques], and
[Vincent Scheib] for their reviews of this article.

[first-party perspective]: https://en.wikipedia.org/wiki/First-person_(video_games)
[updated Pointer Lock API]: https://github.com/w3c/pointerlock/pull/49
[Google Stadia]: https://en.wikipedia.org/wiki/Google_Stadia
[Nvidia GeForce Now]: https://en.wikipedia.org/wiki/GeForce_Now
[well supported across browsers]: https://caniuse.com/?search=pointerlock
[Browser compatibility]: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API#Browser_compatibility
[sample]: https://unadjusted-movement.glitch.me/
[check out the source code]: https://glitch.com/edit/#!/unadjusted-movement?path=script.js
[James Hollyer]: https://github.com/jameshollyergoogle
[Thomas Steiner]: https://github.com/tomayac
[Joe Medley]: https://github.com/jpmedley
[Kayce Basques]: https://github.com/kaycebasques
[Vincent Scheib]: https://github.com/scheib
