---
title: 'Human interface devices on the web: a few quick examples'
subhead: Connecting to uncommon devices from your app.
authors:
  - joemedley
  - mattreynolds
description: |
  There is a long tale of human interface devices (HID) that are too new, too
  old, or too uncommon to be accessible by systems' device drivers. The WebHID
  API solves this by providing a way to implement device-specific logic in
  JavaScript.
date: 2020-07-22
updated: 2021-01-25
tags:
  - blog
  - capabilities
  - hid
  - games
  - devices
hero: image/admin/8TCwHOfb8SUWaVEtCx6j.jpg
alt: A generic game controller
---

{% Aside 'success' %}
The [WebHID API](/hid), part of the [capabilities project](/fugu-status/),
launched in Chrome&nbsp;89.
{% endAside %}

## What is the WebHID API? {: #what }

There is a long tail of human interface devices (HIDs) that are too new, too
old, or too uncommon to be accessible by systems' device drivers. The [WebHID
API](/hid) solves this by providing a way to implement device-specific logic in
JavaScript.

### Suggested use cases for the WebHID API {: #use-cases }

An HID takes input from or provides output to humans. Examples of devices
include keyboards, pointing devices (mice, touchscreens, etc.), and gamepads.
The [HID protocol](https://www.usb.org/hid) makes it possible to access these
devices on desktop computers using operating system drivers. The web platform
supports HIDs by relying on these drivers.

The inability to access uncommon HID devices is particularly painful when it
comes to gamepad support. Gamepads designed for PC often use HID for gamepad
inputs (buttons, joysticks, triggers) and outputs (LEDs, rumble). However,
gamepad inputs and outputs are not well standardized and web browsers often
require custom logic for specific devices. This is unsustainable and results in
poor support for the long tail of older and uncommon devices. It also causes the
browser to depend on quirks present in the behavior of specific devices.

## Demos, demos, demos {: #demos }

If you're curious about how any of these samples work, the source code for all
of them is available on GitHub. [There's a barebones code example][example] in
the explainer.

### MacBook Pro keyboard backlight

The biggest barrier to trying out any of these demos is lack of access to the
device. Fortunately, if you have a MacBook Pro with a TouchBar, you don't need
to buy anything. This demo lets you use the API right from your laptop. It also
shows how WebHID can be used to unlock functionality of built-in devices, not
just peripherals.

**Author:** FWeinb<br/>
**Demo/Source:** [Keyboard Backlight](https://codesandbox.io/s/webhid-demo-keyboard-backlight-qlq95)

## Game controllers

### PlayStation&nbsp;4 Wireless controller

Next up is something fewer of you are likely to have. Sony's DualShock&nbsp;4 is a
wireless controller for PlayStation&nbsp;4 game consoles.

The DualShock&nbsp;4 Demo uses WebHID to receive the raw input reports from the
DualShock&nbsp;4 and provides a high-level API to access the controller's gyroscope,
accelerometer, touchpad, button, and thumbstick inputs. It also supports rumble
and setting the color of an RGB LED housed within the controller.

**Author:** TheBITLINK<br/>
**Demo:** [DualShock&nbsp;4 Demo](https://thebitlink.github.io/WebHID-DS4/) ([Source](https://github.com/TheBITLINK/WebHID-DS4))

### Nintendo Switch Joy-Con controllers

Play the Chrome dino 🦖 offline game by actually jumping with a Nintendo Switch Joy-Con
controller in your pants pockets. This demo is powered by
[Joy-Con WebHID](https://github.com/tomayac/joy-con-webhid), a WebHID driver for the
Nintendo Switch Joy-Con controllers.

**Author:** [Thomas Steiner](/authors/thomassteiner/)<br/>
**Demo:** [Chrome Dino WebHID](https://tomayac.github.io/chrome-dino-webhid/)
([demo source](https://github.com/tomayac/chrome-dino-webhid),
[driver source](https://github.com/tomayac/joy-con-webhid))

### The BlinkStick Strip

BlinkStick Strip is a HID-compliant light strip with 8&nbsp;RGB LEDs. The demo allows
the user to select from several blink patterns including chase, blink, and
Larson scanner (aka Cylon).

**Author:** Robat Williams<br/>
**Demo:** [blinkstick-strip](https://robatwilliams.github.io/webhid-demos/blinkstick-strip/) ([source](https://github.com/robatwilliams/webhid-demos))

### Blink, blink, blink

What does this demo do? (Wait for it.) It blinks. Actually it's three demos that
use the blink(1) USB notification light.

blink(1) is simple and well-documented, which makes it a great option for
getting started with HID.

**Author:** Tod E. Kurt<br/>
**Demos:** [blink(1)](https://blink1.thingm.com/) ([source](https://github.com/todbot/blink1-webhid))

## Acknowledgements {: #acknowledgements }

Thank you to [Pete LePage](/authors/petelepage/) and [Kayce
Basques](https://github.com/kaycebasques) for reviews of this article.

<span>Photo by <a
href="https://unsplash.com/@ugur?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Ugur
Akdemir</a> on <a
href="https://unsplash.com/s/photos/game-controllers?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>

[spec]: https://wicg.github.io/webhid/
[issues]: https://github.com/WICG/webhid/issues
[explainer]: https://github.com/WICG/webhid/blob/master/EXPLAINER.md
[wicg-discourse]: https://discourse.wicg.io/t/human-interface-device-hid-api/3070
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=890096
[cr-status]: https://chromestatus.com/feature/5172464636133376
[blink-component]: https://chromestatus.com/features#component%3A%20Blink%3EHID
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[example]: https://github.com/WICG/webhid/blob/master/EXPLAINER.md#example
