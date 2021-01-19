---
title: Accessing hardware devices on the web
subhead: |
  Pick the appropriate API to communicate with a hardware device of your choice.
description: |
  This article helps Web developers pick the right hardware API based on a given device.
authors:
  - beaufortfrancois
date: 2021-01-19
updated: 2021-01-19
hero: hero.jpg
thumbnail: thumbnail.jpg
alt: A woman sitting in front of a wooden desk photo.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - devices
---

My goal is to help you, web developer, pick the appropriate API to communicate
with a hardware device of your choice (e.g., a webcam, a microphone, a mouse, a
keyboard, a stylus, an NFC tag, a Bluetooth device, or an exotic hardware
device).

There are many APIs to choose from. By answering a few questions on this device, you
should find out the API to use and have some documentation to get started
accessing this device.

## 1. Do you want to access video stream from this device? {: #video }

If so, use [`MediaDevices.getUserMedia()`] to get a live video stream from this
device and learn about [capturing video]. You can also [control the camera's
pan, tilt, and zoom], and other camera settings such as [brightness and
contrast], and even [take still images].

## 2. Do you want to access audio streams from this device? {: #audio }

If so, use [`MediaDevices.getUserMedia()`] to get a live audio stream from this
device and learn about [capturing audio]. You can also use [Web Audio] to add
effects to audio, create audio visualizations, or apply spatial effects (such as
panning). Check out [how to profile the performance of Web Audio apps] in Chrome
as well.

## 3. Do you want to receive input events from this device? {: #input }

If so, try listening for [Keyboard] and [Pointer] events. If this device is a
game controller, use the [Gamepad] API to know which buttons are being pressed
and which axes moved.

## 4. Is this device an NFC tag? {: #nfc }

Then, try [Web NFC] to read and write to this device when it's in close
proximity to the user's device (usually 5-10 cm, 2-4 inches).

## 5. Is this a Bluetooth device? {: #bluetooth }

Click the button below and see if you can spot a nearby Bluetooth device that
may be of interest to you. Note that this device may need to be in a special
mode to be visible.

<div class="w-text--center">
<button class="w-button w-button--secondary w-button--with-icon"
data-icon="bluetooth" onclick="navigator?.bluetooth?.requestDevice({ acceptAllDevices:true })
|| alert('This browser does not support Web Bluetooth. Try Chrome.')">
Request bluetooth device
</button>
</div>

If so, try [Web Bluetooth] to connect to this device over a Bluetooth Low Energy
connection. It should be pretty easy to communicate with when it uses
standardized Bluetooth GATT services (such as the battery service) as their
behavior is [well-documented]. If not, at this point, you either have to find
some hardware documentation for this device or reverse-engineer it. See the
[Reverse-Engineering a Bluetooth Lightbulb] article from Uri Shaked for an
example on how to do that.

## 6. Does this device expose HID interfaces? {: #hid }

Click the button below and see if you can spot a HID device that may be of
interest to you. Note that security-sensitive HID devices (such as FIDO HID
devices used for stronger authentication) are not accessible in Chrome.

<div class="w-text--center">
<button class="w-button w-button--secondary w-button--with-icon"
data-icon="videogame_asset" onclick="navigator?.hid?.requestDevice({ filters: [] })
|| alert('This browser does not support WebHID. Try Chrome on desktop.')">
Request HID device
</button>
</div>

If so, try [WebHID] to open a HID connection to this device. The next step is to
understand HID reports and report descriptors through [collections]. This can be
really hard without vendor documentation for this device. Reverse-engineering it
is also a possibility with tools like [Wireshark].

## 7. Does this device expose USB interfaces? {: #usb }

Click the button below and see if you can spot a USB device that may be of
interest to you.

<div class="w-text--center">
<button class="w-button w-button--secondary w-button--with-icon"
data-icon="usb" onclick="navigator?.usb?.requestDevice({ filters: [] })
|| alert('This browser does not support WebUSB. Try Chrome.')">
Request USB device
</button>
</div>

If so, try [WebUSB] to communicate with this device over the USB port. Without
clear documentation for this device and what USB commands this device supports,
it's really hard **but** still possible with lucky guessing. Watch [Exploring
WebUSB and its exciting potential] talk from Suz Hinton for instance. With tools
like [Wireshark], you can also reverse-engineer this device by capturing raw USB
traffic to understand it better.

## 8. Does this device expose serial ports? {: #serial }

Click the button below and see if you can spot a serial port that may be of
interest to you.

<div class="w-text--center">
<button class="w-button w-button--secondary w-button--with-icon"
data-icon="developer_board" onclick="navigator?.serial?.requestPort({ filters: [] })
|| alert('This browser does not support the Serial API. Try Chrome on desktop.')">
Request serial port
</button>
</div>

If so, try the [Serial API] to read from and write to this device. Without clear
vendor documentation for this device though, you'll need some dedicated tools to
help you inspect serial traffic and understand it.

## Acknowledgements {: #helpful }

Thank you to [Reilly Grant](https://github.com/reillyeon) and [Thomas
Steiner](/authors/thomassteiner/) for reviewing this article.

Photo by [Darya Tryfanava](https://unsplash.com/@darya_tryfanava) on
[Unsplash](https://unsplash.com/photos/uZBGDkYkvhM).

[`MediaDevices.getUserMedia()`]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
[capturing video]: https://www.html5rocks.com/en/tutorials/getusermedia/intro/
[control the camera's pan, tilt, and zoom]: /camera-pan-tilt-zoom/
[brightness and contrast]: https://developers.google.com/web/updates/2016/12/imagecapture
[take still images]: https://beaufortfrancois.github.io/sandbox/image-capture/playground
[capturing audio]: https://www.html5rocks.com/en/tutorials/getusermedia/intro/
[Web Audio]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
[how to profile the performance of Web Audio apps]: /profiling-web-audio-apps-in-chrome/
[Keyboard]: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
[Pointer]: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
[Gamepad]: /gamepad/
[Web NFC]: /nfc/
[Web Bluetooth]: /bluetooth/
[well-documented]: https://www.bluetooth.com/specifications/gatt/
[Reverse-Engineering a Bluetooth Lightbulb]: https://urish.medium.com/reverse-engineering-a-bluetooth-lightbulb-56580fcb7546
[WebHID]: /hid/
[collections]: https://webhid-collections.glitch.me/
[Wireshark]: https://gitlab.com/wireshark/wireshark/-/wikis/CaptureSetup/USB
[WebUSB]: /usb/
[Exploring WebUSB and its exciting potential]: https://www.youtube.com/watch?v=IpfZ8Nj3uiE
[Serial API]: /serial/
