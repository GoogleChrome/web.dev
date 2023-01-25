---
layout: post
title: Capture Keys with the Keyboard Lock API
subhead: Provide an immersive, full screen experience for a variety of use cases including interactive websites, games, and remote desktop or application streaming.
tags:
  - blog
  - capabilities
authors:
  - thomassteiner
description: >
  The Keyboard Lock API allows websites to capture keys that are normally reserved by the underlying operating system. It is intended for web applications that provide a full screen immersive experience (like games or remote access apps).
date: 2020-07-28
# updated:
hero: image/admin/UypqCqH1QwndHuE6xFfg.jpg
feedback:
  - api
---
With more and more users spending most of their time in the browser, richly interactive websites, games, remote desktop streaming, and application streaming strive to provide an immersive, full screen experience. To accomplish this, sites need access to special keys and keyboard shortcuts while they are in full screen mode, so that they can be used for navigation, menus, or gaming functionality. Some examples of the keys that may be required are <kbd>Esc</kbd>, <kbd>Alt</kbd>&nbsp;+&nbsp;<kbd>Tab</kbd>, <kbd>Cmd</kbd>&nbsp;+&nbsp;<kbd>`</kbd>, and <kbd>Ctrl</kbd>&nbsp;+&nbsp;<kbd>N</kbd>.

By default, these keys are not available to the web application because they are captured by the browser or the underlying operating system. The Keyboard Lock API enables websites to use all available keys allowed by the host OS (see [Browser compatibility](#browser-compatibility)).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6iFOOM7ImdtiMJHlbCnz.png", alt="Ubuntu Linux streamed to a browser tab in macOS Chrome (not running in full screen mode yet).", width="800", height="496", class="w-screenshot w-screenshot--filled" %}
  <figcaption>
    The problem: a streamed Ubuntu Linux remote desktop <em>not</em> running in full screen mode and <em>without</em> active keyboard lock,
    so system keys are still captured by the macOS host operating system and the experience is <em>not</em> immersive yet.
  </figcaption>
</figure>

## Using the Keyboard Lock API

The [`Keyboard` interface](https://developer.mozilla.org/en-US/docs/Web/API/Keyboard) of the the Keyboard API provides functions that toggle capturing of key presses from the physical keyboard as well as getting information about the used [keyboard layout](https://developer.mozilla.org/en-US/docs/Web/API/Keyboard/getLayoutMap).

### Prerequisite

There are two different types of full screen available in modern browsers: JavaScript-initiated via the [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) and user-initiated via a keyboard shortcut. The Keyboard Lock API is only available when [JavaScript-initiated full screen](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen) is active.
Here's an example of JavaScript-initiated full screen:

```js
await document.documentElement.requestFullscreen();
```

### Browser compatibility

You can see browser compatibility on [Can I use](https://caniuse.com/#feat=mdn-api_keyboard_lock). Note that not all system keys can be locked. This varies from operating system to operating system. For example, follow [crbug.com/855738](https://crbug.com/855738) for progress updates on system keyboard lock for macOS.

### Feature detection

You can use the following pattern to check if the Keyboard Lock API is supported:

```js
if ('keyboard' in navigator && 'lock' in navigator.keyboard) {
  // Supported!
}
```

### Locking the keyboard

The [`lock()`](https://developer.mozilla.org/en-US/docs/Web/API/Keyboard/lock) method of the `Keyboard` interface returns a promise after enabling the capture of key presses for any or all of the keys on the physical keyboard. This method can only capture keys that are granted access by the underlying operating system. The `lock()` method takes an array of one or more key codes to lock. If no key codes are provided, all keys will be locked. A list of valid key code values is available in the [UI Events KeyboardEvent code Values](https://www.w3.org/TR/uievents-code/#keyboard-key-codes) spec.

#### Capturing all keys

The following example captures all key presses.

```js
navigator.keyboard.lock();
```

#### Capturing specific keys

The following example captures the <kbd>W</kbd>, <kbd>A</kbd>, <kbd>S</kbd>, and <kbd>D</kbd> keys. It captures these keys regardless of which modifiers are used with the key press. Assuming a US QWERTY layout, registering `"KeyW"` ensures that <kbd>W</kbd>, <kbd>Shift</kbd>&nbsp;+&nbsp;<kbd>W</kbd>, <kbd>Control</kbd>&nbsp;+&nbsp;<kbd>W</kbd>, <kbd>Control</kbd>&nbsp;+&nbsp;<kbd>Shift</kbd>&nbsp;+&nbsp;<kbd>W</kbd>, and all other key modifier combinations with <kbd>W</kbd> are sent to the app. The same applies to `"KeyA"`, `"KeyS"`, and `"KeyD"`.

```js
await navigator.keyboard.lock([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
]);
```

You can respond to captured key presses using keyboard events. 
For example this code uses the `onkeydown` event:

```js
document.addEventListener('keydown', (e) => {
  if ((e.code === 'KeyA') && !(event.ctrlKey || event.metaKey)) {
    // Do something when the 'A' key was pressed, but only
    // when not in combination with the command or control key.
  }
});
```

### Unlocking the keyboard

The [`unlock()`](https://developer.mozilla.org/en-US/docs/Web/API/Keyboard/unlock) method unlocks all keys captured by the `lock()` method and returns synchronously.

```js
navigator.keyboard.unlock();
```

When a document is closed, the browser always implicitly calls `unlock()`.

## Demo

You can test the Keyboard Lock API by running the [demo](https://keyboard-lock.glitch.me/) on Glitch. Be sure to [check out the source code](https://glitch.com/edit/#!/keyboard-lock). Clicking the Enter full screen button below launches the demo in a new window so it can enter full screen mode.

{% Glitch {
  id: 'keyboard-lock',
  path: 'script.js'
} %}

## Security Considerations

One concern with this API is that it could be used to grab all of the keys and (in conjunction with the [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) and the [PointerLock API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API)) prevent the user from exiting the web page. To prevent this, the spec requires the browser to provide a way for the user to exit from keyboard lock even if all of the keys are requested by the API. In Chrome, this escape hatch is a long (two second) <kbd>Esc</kbd> key press to trigger an exit from Keyboard Lock.

## Helpful links

- [Specification draft](https://wicg.github.io/keyboard-lock/)
- [GitHub repository](https://github.com/WICG/keyboard-lock)
- [ChromeStatus entry](https://chromestatus.com/feature/5642959835889664)
- [Chrome tracking bug](https://crbug.com/677559)
- [Key codes for standard keyboards](https://www.w3.org/TR/uievents-code/#keyboard-key-codes)

## Acknowledgements

This article was reviewed by [Joe Medley](https://github.com/jpmedley) and [Kayce Basques](https://github.com/kaycebasques).  The Keyboard Lock spec is authored by [Gary Kacmarcik](https://www.linkedin.com/in/garykac) and [Jamie Walch](https://www.linkedin.com/in/jamie-walch-395b332b).
Hero image by [Ken Suarez](https://unsplash.com/@kensuarez) on [Unsplash](https://unsplash.com/s/photos/padlock-computer).
