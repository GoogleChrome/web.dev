---
layout: post
title: Jumping the hurdles with the Gamepad API
date: 2012-08-06
authors:
  - marcinwichary
tags:
  - blog # blog is a required tag for the article to show up in the blog.

---

## Introduction

Let the novices keep their keyboards for adventure games, their precious multi-touchy-feely fingertips for fruit cutting, and their fancy newfangled motion sensors for pretending they can dance like Michael Jackson. (Newsflash: They can't.) But you're different. You're better. You're a pro. For you, the games begin and end with a gamepad in your hands.

But wait. Aren't you out of luck if you want to support a gamepad in your web app? Not anymore. The brand new [Gamepad API](http://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html) comes to the rescue, allowing you to use JavaScript to read the state of any gamepad controller attached to your computer. It's so fresh off the presses, that it only landed in Chrome 21 last week – and it's also on the verge of being supported in Firefox (currently available in a [special build](http://people.mozilla.com/~tmielczarek/gamepad/)).

That turned out to be pretty great timing, because we get a chance to use it recently in the [Hurdles 2012 Google doodle](http://www.google.com/doodles/hurdles-2012). This article will briefly explain how we added Gamepad API to the doodle, and what we learned during the process.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/T4oshCTuLhNguN14Vuht.png", alt="Hurdles 2012 Google doodle", width="522", height="207" %}
<figcaption>Hurdles 2012 Google doodle</figcaption>
</figure>

## Gamepad tester

Ephemeral as they are, interactive doodles tend to be pretty complex under the hood. So that it's easier to demonstrate what we're talking about, we took the gamepad code from the doodle, and put together a simple gamepad tester. You can use it to see whether your USB gamepad works correctly – and also look under the hood to examine how it's done.

## What browsers support it today?

As of early August 2012:

- Chrome 21 and newer on Windows, Mac, Linux, and Chrome OS
- [special builds of Firefox](http://people.mozilla.com/~tmielczarek/gamepad/) with Gamepad API support.

## What gamepads can be used?

Generally, any modern gamepad that is supported by your system natively should work. We tested various gamepads from off-brand USB controllers on a PC, through PlayStation 2 gamepads connected via a dongle to a Mac, all the way to Bluetooth controllers paired with a Chrome OS notebook.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/DZxDnKUwgi5p28CJTX5x.jpg", alt="Gamepads", width="300", height="400" %}
<figcaption>Gamepads</figcaption>
</figure>

This is a photo of some controllers we used for testing our doodle – "Yes, mom, that really is what I do at work." If your controller doesn't work, or if the controls are mapped incorrectly, please [file a bug against Chrome](https://code.google.com/p/chromium/issues/entry?template=Defect%20report%20from%20user&cc=scottmg@chromium.org&labels=Type-Feature,Pri-2,Area-Internals,Feature-Gamepad) or [Firefox](https://bugzilla.mozilla.org/) . (Please test in the absolutely newest version of each browser to make sure it's not already fixed.)

{% Aside %}
Some gamepads have a switch at the back telling them to use a different mode of operation. Toggling that might make them work better.
{% endAside %}

{% Aside %}
Some gamepads have a compatibility mode switch up front that makes four-axis d-pad and the left analogue stick switch places (logically).
{% endAside %}

## Feature Detecting the Gamepad API<

Easy enough in Chrome:

```js
var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
```

It does not seem possible to detect this in Firefox just yet – everything is event-based, and all the event handlers need to be attached to window, which prevents a typical technique of detecting event handlers from working.

But we're sure that is temporary. The ever-so-awesome [Modernizr](http://modernizr.com/) already tells you about the Gamepad API, so we recommend this for all your current and future detecting needs:

```js
var gamepadSupportAvailable = Modernizr.gamepads;
```

## Finding out about connected gamepads

Even if you connect the gamepad, it won't manifest itself in any way unless the user presses any of its buttons first. This is to prevent fingerprinting, although proves to be a bit of a challenge for user experience: you can't ask the user to press the button or provide gamepad-specific instructions because you have no idea whether they connected their controller.

Once you clear that hurdle (sorry…), however, more await.

### Polling

Chrome's implementation of the API exposes a function – `navigator.webkitGetGamepads()` – you can use to get a list of all the gamepads currently plugged into to the system, alongside with their current state (buttons + sticks). The first connected gamepad will be returned as the first entry in the array, and so on.

(This function call just recently replaced an array you could access directly – `navigator.webkitGamepads[]`. As of early August 2012, accessing this array is still necessary in Chrome 21, while the function call works in Chrome 22 and newer. Moving forward, the function call is the recommended way to use the API, and will slowly trickle to all the installed Chrome browsers.)

The so-far-implemented part of the spec requires you to continuously check the state of connected gamepads (and compare it to the previous one if necessary), instead of firing events when things change. We relied on [requestAnimationFrame()](http://www.html5rocks.com/tutorials/speed/animations/) to set up polling in the most efficient and battery-friendly way. For our doodle, even though we already have a `requestAnimationFrame()` loop to support animations, we created a second completely separate one – it was simpler to code and shouldn't affect performance in any way.

Here is the code from the tester:

```js
/**
 * Starts a polling loop to check for gamepad state.
 */
startPolling: function() {
    // Don't accidentally start a second loop, man.
    if (!gamepadSupport.ticking) { 
    gamepadSupport.ticking = true;
    gamepadSupport.tick();
    }
},

/**
 * Stops a polling loop by setting a flag which will prevent the next
 * requestAnimationFrame() from being scheduled.
 */
stopPolling: function() {
    gamepadSupport.ticking = false;
},

/**
 * A function called with each requestAnimationFrame(). Polls the gamepad
 * status and schedules another poll.
 */  
tick: function() {
    gamepadSupport.pollStatus();
    gamepadSupport.scheduleNextTick();
},

scheduleNextTick: function() {
    // Only schedule the next frame if we haven't decided to stop via
    // stopPolling() before.
    if (gamepadSupport.ticking) {
    if (window.requestAnimationFrame) {
        window.requestAnimationFrame(gamepadSupport.tick);
    } else if (window.mozRequestAnimationFrame) {
        window.mozRequestAnimationFrame(gamepadSupport.tick);
    } else if (window.webkitRequestAnimationFrame) {
        window.webkitRequestAnimationFrame(gamepadSupport.tick);
    }
    // Note lack of setTimeout since all the browsers that support
    // Gamepad API are already supporting requestAnimationFrame().
    }    
},

/**
 * Checks for the gamepad status. Monitors the necessary data and notices
 * the differences from previous state (buttons for Chrome/Firefox, 
 * new connects/disconnects for Chrome). If differences are noticed, asks 
 * to update the display accordingly. Should run as close to 60 frames per 
 * second as possible.
 */
pollStatus: function() {
    // (Code goes here.)
},
```

If you only care about one gamepad, getting its data might be as simple as:

```js
var gamepad = navigator.webkitGetGamepads && navigator.webkitGetGamepads()[0];
```
/
If you want to be a bit more clever, or support more than one player simultaneously, you will need to add a few more lines of code to react to more complex scenarious (two or more gamepads connected, some of them getting disconnected mid-way, etc.). You can look at the [source code](https://github.com/html5rocks/www.html5rocks.com/blob/master/content/tutorials/doodles/gamepad/static/gamepad-tester/gamepad.js#L187) of our tester, function `pollGamepads()`, for one approach on how to solve this.

### Events

Firefox uses an alternative, better way described in the Gamepad API spec. Instead of asking you to poll, it exposes two events – `MozGamepadConnected` and `MozGamepadDisconnected` – which are fired whenever a gamepad gets plugged in (or, more precisely, plugged in and "announced" by pressing any of its buttons) or unplugged. The gamepad object that will continue to reflect its future state is passed as the `.gamepad` parameter of the event object.

From the tester source code:

```js
/**
 * React to the gamepad being connected. Today, this will only be executed 
 * on Firefox.
 */
onGamepadConnect: function(event) {
    // Add the new gamepad on the list of gamepads to look after.
    gamepadSupport.gamepads.push(event.gamepad);
    
    // Start the polling loop to monitor button changes.
    gamepadSupport.startPolling();    

    // Ask the tester to update the screen to show more gamepads.
    tester.updateGamepads(gamepadSupport.gamepads);
},
```

### Summary

In the end, our initialization function in the tester, supporting both approaches, looks like this:

```js
/**
 * Initialize support for Gamepad API.
 */
init: function() {
    // As of writing, it seems impossible to detect Gamepad API support
    // in Firefox, hence we need to hardcode it in the third clause. 
    // (The preceding two clauses are for Chrome.)
    var gamepadSupportAvailable = !!navigator.webkitGetGamepads || 
        !!navigator.webkitGamepads ||
        (navigator.userAgent.indexOf('Firefox/') != -1);

    if (!gamepadSupportAvailable) {
    // It doesn't seem Gamepad API is available – show a message telling
    // the visitor about it.
    tester.showNotSupported();
    } else {
    // Firefox supports the connect/disconnect event, so we attach event
    // handlers to those.
    window.addEventListener('MozGamepadConnected', 
                            gamepadSupport.onGamepadConnect, false);
    window.addEventListener('MozGamepadDisconnected', 
                            gamepadSupport.onGamepadDisconnect, false);

    // Since Chrome only supports polling, we initiate polling loop straight
    // away. For Firefox, we will only do it if we get a connect event.
    if (!!navigator.webkitGamepads || !!navigator.webkitGetGamepads) {
        gamepadSupport.startPolling(); 
    }
    }
},
```

## Gamepad info

Every gamepad connected to the system will be represented by an object looking something like this:

```js
id: "﻿PLAYSTATION(R)3 Controller (STANDARD GAMEPAD Vendor: 054c Product: 0268)"
index: 1
timestamp: 18395424738498
buttons: Array[8]
    0: 0
    1: 0
    2: 1
    3: 0
    4: 0
    5: 0
    6: 0.03291
    7: 0
axes: Array[4]
    0: -0.01176
    1: 0.01961
    2: -0.00392
    3: -0.01176
```

### Basic info

The top few fields are simple metadata:

- `id`: a textual description of the gamepad
- `index`: an integer useful to tell different gamepads attached to one computer apart
- `timestamp`: the timestamp of the last update of the button/axes state (currently only supported in Chrome)

### Buttons and sticks

Today's gamepads are not exactly what your grandpa might have used to save the princess in the wrong castle – they typically have at least sixteen separate buttons (some discrete, some analogue), in addition to two analogue sticks. Gamepad API will tell you about all the buttons and analogue sticks that are reported by the operating system.

Once you get the current state in the gamepad object, you can access the buttons via `.buttons[]` and sticks via `.axes[]` arrays. Here's a visual summary of what they correspond to:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/e0FBSNiQGkWsx45BgIMA.png", alt="Gamepad Diagram", width="800", height="503" %}
<figcaption>Gamepad Diagram</figcaption>
</figure>

The spec asks the browser to map first sixteen buttons and four axes to:

```js
gamepad.BUTTONS = {
    FACE_1: 0, // Face (main) buttons
    FACE_2: 1,
    FACE_3: 2,
    FACE_4: 3,
    LEFT_SHOULDER: 4, // Top shoulder buttons
    RIGHT_SHOULDER: 5,
    LEFT_SHOULDER_BOTTOM: 6, // Bottom shoulder buttons
    RIGHT_SHOULDER_BOTTOM: 7,
    SELECT: 8,
    START: 9,
    LEFT_ANALOGUE_STICK: 10, // Analogue sticks (if depressible)
    RIGHT_ANALOGUE_STICK: 11,
    PAD_TOP: 12, // Directional (discrete) pad
    PAD_BOTTOM: 13,
    PAD_LEFT: 14,
    PAD_RIGHT: 15
};

gamepad.AXES = {
    LEFT_ANALOGUE_HOR: 0,
    LEFT_ANALOGUE_VERT: 1,
    RIGHT_ANALOGUE_HOR: 2,
    RIGHT_ANALOGUE_VERT: 3
};
```

The extra buttons and axes will be appended to the ones above. Please note that neither sixteen buttons nor four axes are guaranteed, though – be ready for some of them to simply be undefined.

The buttons can take values from 0.0 (not pressed) to 1.0 (pressed completely). The axes go from -1.0 (completely left or up) through 0.0 (center) to 1.0 (completely right or down).

### Analogue or discrete?

Ostensibly, every button could be an analogue one – this is somewhat common for shoulder buttons, for example. Therefore, it is best to set a threshold rather than just compare it bluntly to 1.00 (what if an analogue button happens to be slightly dirty? It might never reach 1.00). In our doodle we do it this way:

```js
gamepad.ANALOGUE_BUTTON_THRESHOLD = .5;

gamepad.buttonPressed_ = function(pad, buttonId) {
    return pad.buttons[buttonId] && 
            (pad.buttons[buttonId] > gamepad.ANALOGUE_BUTTON_THRESHOLD);
};
```

You can do the same to turn analogue sticks into digital joysticks. Sure, there is always the digital pad (d-pad), but your gamepad might not have one. Here's our code to handle that:

```js
gamepad.AXIS_THRESHOLD = .75;

gamepad.stickMoved_ = function(pad, axisId, negativeDirection) {
    if (typeof pad.axes[axisId] == 'undefined') {
    return false;
    } else if (negativeDirection) {
    return pad.axes[axisId] < -gamepad.AXIS_THRESHOLD;
    } else {
    return pad.axes[axisId] > gamepad.AXIS_THRESHOLD;
    }
};
```

## Button presses and stick movements

### Events

In some cases, like a flight simulator game, continuously checking and reacting to stick positions or button presses makes more sense… but for things like Hurdles 2012 doodle? You might wonder: Why do I need to check for buttons every single frame? Why can't I get events like I do for keyboard or mouse up/down? 

Good news is, you can. Bad news is – in the future. It's in the spec, but not implemented in any browser yet.

### Polling

In the meantime, your way out is comparing the current and previous state, and calling functions if you see any difference. For example:

```js
if (buttonPressed(pad, 0) != buttonPressed(oldPad, 0)) { 
    buttonEvent(0, buttonPressed(pad, 0) ? 'down' : 'up'); 
}
```

{% Aside %}
Compare timestamps of the current and previously polled gamepad data (the timestamp field). If they're defined (Firefox doesn't support it yet) and identical, it means the state didn't change from the last time you looked at it, and no further work is necessary. From the tester source code:
{% endAside %}

```js    
for (var i in gamepadSupport.gamepads) {
    var gamepad = gamepadSupport.gamepads[i];

    // Don't do anything if the current timestamp is the same as previous
    // one, which means that the state of the gamepad hasn't changed.
    // This is only supported by Chrome right now, so the first check
    // makes sure we're not doing anything if the timestamps are empty
    // or undefined.
    if (gamepadSupport.prevTimestamps[i] && 
        (gamepad.timestamp == gamepadSupport.prevTimestamps[i])) {
    continue;
    }
    gamepadSupport.prevTimestamps[i] = gamepad.timestamp;

    gamepadSupport.updateDisplay(i);
}
```

### The keyboard-first approach in the Hurdles 2012 doodle

Since without a gamepad, our today's doodle's preferred input method is the keyboard, we decided for the gamepad to emulate it rather closely. This meant three decisions:

1. The doodle only needs three buttons – two for running, and one for jumping – but the gamepad is likely to have many more. We therefore mapped all the sixteen known buttons and two known sticks onto those three logical functions in a way we thought made most sense, so that people could run by: alternating A/B buttons, alternating shoulder buttons, pressing left/right on the d-pad, or swinging either stick violently left and right (some of those will, of course, be more efficient than the others). For example:
    ```js
    newState[gamepad.STATES.LEFT] =
        gamepad.buttonPressed_(pad, gamepad.BUTTONS.PAD_LEFT) ||
        gamepad.stickMoved_(pad, gamepad.AXES.LEFT_ANALOGUE_HOR, true) ||
        gamepad.stickMoved_(pad, gamepad.AXES.RIGHT_ANALOGUE_HOR, true),

    newState[gamepad.STATES.PRIMARY_BUTTON] =
        gamepad.buttonPressed_(pad, gamepad.BUTTONS.FACE_1) ||
        gamepad.buttonPressed_(pad, gamepad.BUTTONS.LEFT_SHOULDER) ||
        gamepad.buttonPressed_(pad, gamepad.BUTTONS.LEFT_SHOULDER_BOTTOM) ||
        gamepad.buttonPressed_(pad, gamepad.BUTTONS.SELECT) ||
        gamepad.buttonPressed_(pad, gamepad.BUTTONS.START) ||
        gamepad.buttonPressed_(pad, gamepad.BUTTONS.LEFT_ANALOGUE_STICK),
    ```

1. We treated each analogue input as a discrete one, using the threshold functions described previously.

1. We went as far as bolting the gamepad input onto the doodle, instead of baking it in – our polling loop actually synthesizes necessary keydown and keyup events (with a proper keyCode) and sends them back to DOM:
    ```js
    // Create and dispatch a corresponding key event.
    var event = document.createEvent('Event');    
    var eventName = down ? 'keydown' : 'keyup';
    event.initEvent(eventName, true, true);
    event.keyCode = gamepad.stateToKeyCodeMap_[state];    
    gamepad.containerElement_.dispatchEvent(event);
    ```

And that's all there is to it!

## Tips and tricks

- Remember that the gamepad won't be visible in your browser at all before a button is pressed.
- If you are testing the gamepad in different browsers simultaneously, note that only one of them can sense the controller. If you're not receiving any events, make sure to close the other pages that might be using it. Plus, from our experience, sometimes a browser can "hold onto" the gamepad even if you close the tab or quit the browser itself. Restarting the system is sometimes the only way to fix things.
- As always, use [Chrome Canary](https://tools.google.com/dlpage/chromesxs/) and the equivalents for other browsers to make sure you're experiencing the best support – and then act appropriately if you see older versions behaving differently.

## The Future

We hope this helps to shed some light on this new API – still a bit precarious, but already a lot of fun. 

In addition to the missing pieces of the API (e.g. events) and broader browser support, we're also hoping to eventually see things like rumble control, access to built-in gyroscopes, etc. And, more support for different types of gamepads – please [file a bug against Chrome](https://code.google.com/p/chromium/issues/entry?template=Defect%20report%20from%20user&cc=scottmg@chromium.org&labels=Type-Feature,Pri-2,Area-Internals,Feature-Gamepad) and/or [file a bug against Firefox](https://bugzilla.mozilla.org/) if you see find one that works incorrectly or not at all.

But before that, go and play with our [Hurdles 2012 doodle](http://www.google.com/doodles/hurdles-2012) and see how much more fun it is on the gamepad. Oh, did you just say you could do better than 10.7 seconds? Bring it.

## Further reading

- [W3C Gamepad API specification](http://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html)
- [MDN Gamepad API Docs](https://developer.mozilla.org/API/Gamepad/Using_Gamepad_API)
