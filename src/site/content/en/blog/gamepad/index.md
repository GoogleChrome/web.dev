---
title: Play the Chrome dino game with your gamepad
subhead: Learn how to use the Gamepad API to push your web games to the next level.
description: |
  Learn to control web games with the Gamepad API.
authors:
  - thomassteiner
date: 2020-11-03
updated: 2020-11-04
hero: image/admin/nnmBquEmUtTIh89pkhvp.jpg
alt: The hands of a person playing the Chrome dino game on a game console.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - gamepad
  - devices
---

Chrome's offline page easter egg is one of the worst-kept secrets in history
(`[citation needed]`, but claim made for the dramatic effect).
If you press the <kbd>space</kbd> key or, on mobile devices, tap the dinosaur,
the offline page becomes a playable arcade game.
You might be aware that you do not actually have to go offline
when you feel like playing: in Chrome, you can just navigate to `chrome://dino`, or,
for the geek in you, browse to
`chrome://network-error/-106`.
But did you know that there are currently
[270 million Chrome dino games played every month](https://www.blog.google/products/chrome/chrome-dino#jump-content:~:text=There%20are%20currently%20270%20million%20games%20played%20every%20month)?

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BQ9zVNGfI0PjH6LTwxj5.png", alt="Chrome's offline page with the Chrome dino game.", width="800", height="647", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    Press the space bar to play!
  </figcaption>
</figure>

Another fact that arguably is more useful to know and that you might not be aware of
is that in arcade mode you can play the game with a gamepad.
Gamepad support was added roughly one year ago as of the time of this writing in a
[commit](https://github.com/chromium/chromium/commit/fcafd36b23c535e307da4213b7d639f8c13b8da2)
by [Reilly Grant](https://github.com/reillyeon).
As you can see, the game, just like the rest of the Chromium project,
is fully
[open source](https://github.com/chromium/chromium/tree/master/components/neterror/resources).
In this post, I want to show you how to use the Gamepad API.

## Using the Gamepad API

{% Aside %}
  The [Gamepad API](https://w3c.github.io/gamepad/) has been around for a long time.
  This post disregards all the legacy features and vendor prefixes.
{% endAside %}

### Feature detection and browser support

The Gamepad API has universally great [browser support](https://caniuse.com/gamepad)
across both desktop and mobile.
You can detect if the Gamepad API is supported using the snippet below:

```js
if ('getGamepads' in navigator) {
  // The API is supported!
}
```

### How the browser represents a gamepad

The browser represents gamepads as `Gamepad` objects.
A `Gamepad` has the following fields:

- `id`:
  An identification string for the gamepad.
  This string identifies the brand or style of connected gamepad device.
- `index`:
  The index of the gamepad in the navigator.
- `connected`:
  Indicates whether the gamepad is still connected to the system.
- `timestamp`: The last time the data for this gamepad was updated.
- `mapping`: The button and axes mapping in use for this device. Currently the only mapping is `"standard"`.
- `axes`: An array of values for all axes of the gamepad, linearly normalized to the range of
  `-1.0`–`1.0`.
- `buttons`: An array of button states for all buttons of the gamepad.

Note that buttons can be digital (pressed or not pressed) or analog (for example, 78% pressed).
This is why buttons are reported as `GamepadButton` objects, with the following attributes:

- `pressed`: The pressed state of the button (`true` if the button is currently pressed,
  and `false` if it is not pressed.
- `touched`: The touched state of the button. If the button is capable of detecting touch,
  this property is `true` if the button is currently being touched, and `false` otherwise.
- `value`: For buttons that have an analog sensor, this property represents the amount by
  which the button has been pressed, linearly normalized to the range of `0.0`–`1.0`.

One additional thing that you might encounter, depending on your browser and the gamepad you have,
is a `vibrationActuator` property.
This field is currently implemented in Chrome and earmarked for
[merging](https://github.com/w3c/gamepad/pull/68) into the
[Gamepad Extensions](https://w3c.github.io/gamepad/extensions.html) spec.

The schematic overview below, taken
[straight from the spec](https://w3c.github.io/gamepad/#fig-visual-representation-of-a-standard-gamepad-layout:~:text=Figure%201%20Visual%20representation%20of%20a%20standard%20gamepad%20layout.),
shows the mapping and the arrangement of the buttons and axes on a generic gamepad.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qy6OxKmPAE5dpfLCMhZt.svg", alt="Schematic overview of the button and axes mappings of a common gamepad.", width="800", height="566" %}
  <figcaption class="w-figcaption">
    Visual representation of a standard gamepad layout
    (<a href="https://w3c.github.io/gamepad/#fig-visual-representation-of-a-standard-gamepad-layout:~:text=Figure%201%20Visual%20representation%20of%20a%20standard%20gamepad%20layout.">Source</a>).
  </figcaption>
</figure>

### Being notified when a gamepad gets connected

To learn when a gamepad is connected, listen for the `gamepadconnected`
event that triggers on the `window` object.
When the user connects a gamepad, which can either happen via USB or via Bluetooth,
a `GamepadEvent` is fired that has the gamepad's details in an aptly named `gamepad` property.
Below, you can see an example from an Xbox 360 controller that I had lying around
(yes, I am into retro gaming).

```js
window.addEventListener('gamepadconnected', (event) => {
  console.log('✅ 🎮 A gamepad was connected:', event.gamepad);
  /*
    gamepad: Gamepad
    axes: (4) [0, 0, 0, 0]
    buttons: (17) [GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton]
    connected: true
    id: "Xbox 360 Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)"
    index: 0
    mapping: "standard"
    timestamp: 6563054.284999998
    vibrationActuator: GamepadHapticActuator {type: "dual-rumble"}
  */
});
```

### Being notified when a gamepad gets disconnected

Being notified of gamepad disconnects happens analogously to the way connections are detected.
This time the app listens for the `gamepaddisconnected` event.
Note how in the example below `connected` is now `false`
when I unplug the Xbox 360 controller.

```js/6
window.addEventListener('gamepaddisconnected', (event) => {
  console.log('❌ 🎮 A gamepad was disconnected:', event.gamepad);
  /*
    gamepad: Gamepad
    axes: (4) [0, 0, 0, 0]
    buttons: (17) [GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton, GamepadButton]
    connected: false
    id: "Xbox 360 Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)"
    index: 0
    mapping: "standard"
    timestamp: 6563054.284999998
    vibrationActuator: null
  */
});
```

### The gamepad in your game loop

Getting a hold of a gamepad starts with a call to `navigator.getGamepads()`,
which returns a `GamepadList` object with `Gamepad` items.
The `GamepadList` object in Chrome *always* has a fixed length of four items.
If zero or less than four gamepads are connected, an item may just be `null`.
Always be sure to check all items of the `GamepadList` and be aware that
gamepads "remember" their slot and may not always be present at the first available slot.

```js
// When no gamepads are connected:
navigator.getGamepads();
// GamepadList {0: null, 1: null, 2: null, 3: null, length: 4}
```

If one or several gamepads are connected,
but `navigator.getGamepads()` still reports `null` items,
you may need to "wake" each gamepad by pressing any of its buttons.
You can then poll the gamepad states in your game loop as shown below.

```js
const pollGamepad = () => {
  // Always call `navigator.getGamepads()` inside of
  // the game loop, not outside.
  const gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    // Disregard empty slots.
    if (!gamepad) {
      continue;
    }
    // Process the gamepad state.
    console.log(gamepad);
  }
  // Call yourself upon the next animation frame.
  // (Typically this happens every 60 times per second.)
  window.requestAnimationFrame(pollGamepad)
};
// Kick off the initial game loop iteration.
pollGamepad();
```

{% Aside 'gotchas' %}
  Do not store a lasting reference to the `GamepadList` result *outside* of the game loop,
  since the method returns a static snapshot, not a live object.
  Call `navigator.getGamepads()` each time anew *in your game loop*.
{% endAside %}

### Making use of the vibration actuator

The `vibrationActuator` property returns a `GamepadHapticActuator`
object, which corresponds to a configuration of motors or other actuators
that can apply a force for the purposes of haptic feedback.
Haptic effects can be played by calling `Gamepad.vibrationActuator.playEffect()`.
The only currently valid effect type is `'dual-rumble'`.
Dual-rumble describes a haptic configuration with an eccentric rotating mass vibration motor
in each handle of a standard gamepad.
In this configuration, either motor is capable of vibrating the whole gamepad.
The two masses are unequal so that the effects of each can be combined
to create more complex haptic effects.
Dual-rumble effects are defined by four parameters:

- `duration`:
   Sets the duration of the vibration effect in milliseconds.
- `startDelay`:
  Sets the duration of the delay until the vibration is started.
- `strongMagnitude` and `weakMagnitude`:
  Set the vibration intensity levels for the heavier and lighter eccentric rotating mass
  motors, normalized to the range `0.0`–`1.0`.

```js
// This assumes a `Gamepad` as the value of the `gamepad` variable.
const vibrate = (gamepad, delay = 0, duration = 100, weak = 1.0, strong = 1.0) {
  if (!('vibrationActuator' in gamepad)) {
    return;
  }
  gamepad.vibrationActuator.playEffect('dual-rumble', {
    // Start delay in ms.
    startDelay: delay,
    // Duration is ms.
    duration: duration,
    // The magnitude of the weak actuator (between 0 and 1).
    weakMagnitude: weak,
    // The magnitude of the strong actuator (between 0 and 1).
    strongMagnitude: strong,
  });
};
```

### Integration with Permissions Policy

The Gamepad API spec defines a
[policy-controlled feature](https://w3c.github.io/webappsec-permissions-policy/)
identified by the string `"gamepad"`. Its default `allowlist` is `"self"`.
A document's permissions policy determines whether any content in that document is allowed
to access `navigator.getGamepads()`.
If disabled in any document, no content in the document will be allowed to use
`navigator.getGamepads()`, nor will the `gamepadconnected` and
`gamepaddisconnected` events fire.

```html
<iframe src="index.html" allow="gamepad"></iframe>
```

## Demo

A simple [gamepad tester demo](https://gamepad-demo.glitch.me/) is embedded below.
The source code is available [on Glitch](https://glitch.com/edit/#!/gamepad-demo).
Try the demo by connecting a gamepad via USB or Bluetooth and pressing any of its buttons
or moving any of its axis.

{% Glitch { id: 'gamepad-demo', path: 'script.js', height: 1000, allow: 'gamepad' } %}

## Bonus: play Chrome dino on web.dev

You can play
[Chrome dino](https://tomayac.github.io/chrome-dino-gamepad/)
with your gamepad on this very site.
The source code is available
[on GitHub](https://github.com/tomayac/chrome-dino-gamepad).
Check out the gamepad polling implementation in
[`trex-runner.js`](https://github.com/tomayac/chrome-dino-gamepad/blob/885eb6134805345bf31eeb9971830adeb84747ab/trex-runner.js#L529-L571)
and note how it is emulating key presses.

<div style="height: 420px; width: 100%;">
  <iframe
    src="https://tomayac.github.io/chrome-dino-gamepad/"
    title="Chrome dino gamepad"
    allow="gamepad; fullscreen"
    style="height: 100%; width: 100%; border: 0;"
    loading="lazy">
  </iframe>
</div>

For the [Chrome dino gamepad](https://tomayac.github.io/chrome-dino-gamepad/) demo to work,
I have ripped out the Chrome dino game from the core Chromium project
(updating an [earlier effort](https://github.com/arnellebalane/trex-runner) by
[Arnelle Ballane](https://arnellebalane.com/)),
placed it on a standalone site, extended the existing gamepad API implementation by adding ducking
and vibration effects, created a full screen mode,
and [Mehul Satardekar](https://github.com/mehulsatardekar)
contributed a dark mode implementation.
Happy gaming!

## Useful links

- [Gamepad API spec](https://w3c.github.io/gamepad/)
- [Gamepad API extensions spec](https://w3c.github.io/gamepad/extensions.html)
- [GitHub repository](https://github.com/w3c/gamepad/)

## Acknowledgements

This article was reviewed by [François Beaufort](https://github.com/beaufortfrancois)
and [Joe Medley](https://github.com/jpmedley).
The Gamepad API spec is currently edited by
[Steve Agoston](https://github.com/sagoston),
[James Hollyer](https://www.linkedin.com/in/james-hollyer-981110a3/), and
[Matt Reynolds](https://github.com/nondebug). The former spec editors are
[Brandon Jones](https://blog.tojicode.com/),
[Scott Graham](https://h4ck3r.net/), and
[Ted Mielczarek](http://ted.mielczarek.org/).
The Gamepad Extensions spec is edited by [Brandon Jones](https://blog.tojicode.com/).
Hero image by Laura Torrent Puig.
