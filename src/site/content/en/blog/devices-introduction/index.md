---
title: Accessing hardware devices on the web
subhead: |
  Pick the appropriate API to communicate with a hardware device of your choice.
description: |
  This article helps Web developers pick the right hardware API based on a given device.
authors:
  - beaufortfrancois
date: 2021-02-12
updated: 2021-02-12
hero: image/admin/vAnNpGQruw5EUXxob47V.jpg
alt: A woman sitting in front of a wooden desk photo.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - devices
---

The goal of this guide is to help you pick the best API to communicate with a
hardware device (e.g. webcam, microphone, etc.) on the web. By "best" I mean it
gives you everything you need with the shortest amount of work. In other words,
you know the general use case you want to solve (e.g. accessing video) but you
don't know what API to use or wonder if there's another way to achieve it.

One problem that I commonly see web developers fall into is jumping into
low-level APIs without learning about the higher-level APIs that are easier to
implement and provide a better UX. Therefore, this guide starts by recommending
higher-level APIs first, but also mentions lower-level APIs in case you have
determined that the higher-level API doesn't meet your needs.

## 🕹 Receive input events from this device {: #input }

Try listening for [Keyboard] and [Pointer] events. If this device is a game
controller, use the [Gamepad API] to know which buttons are being pressed and
which axes moved.

If none of these options work for you, a low-level API may be the solution.
Check out [Discover how to communicate with your device] to start your journey.

## 📸 Access audio and video from this device {: #audio-video }

Use [MediaDevices.getUserMedia()] to get live audio and video streams from this
device and learn about [capturing audio and video]. You can also [control the
camera's pan, tilt, and zoom], and other camera settings such as [brightness and
contrast], and even [take still images]. [Web Audio] can be used to add effects
to audio, create audio visualizations, or apply spatial effects (such as
panning). Check out [how to profile the performance of Web Audio apps] in Chrome
as well.

If none of these options work for you, a low-level API may be the solution.
Check out [Discover how to communicate with your device] to start your journey.

## 🖨 Print to this device {: #print }

Use [window.print()] to open a browser dialog that lets the user pick this
device as a destination to print the current document.

If this doesn't work for you, a low-level API may be the solution. Check out
[Discover how to communicate with your device] to start your journey.

## 🔐 Authenticate with this device {: #auth }

Use [WebAuthn] to create a strong, attested, and origin-scoped public-key
credential with this hardware security device to authenticate users. It supports
the use of Bluetooth, NFC, and USB-roaming U2F or FIDO2 authenticators —also
known as security keys— as well as a platform authenticator, which lets users
authenticate with their fingerprints or screen locks. Check out [Build your
first WebAuthn app].

If this device is another type of hardware security device (e.g. a
cryptocurrency wallet), a low-level API may be the solution. Check out [Discover
how to communicate with your device] to start your journey.

## 🗄 Access files on this device {: #files }

Use the [File System Access API] to read from and save changes directly to files
and folders on the user's device. If not available, use the [File API] to ask
the user to select local files from a browser dialog and then read the contents
of those files.

If none of these options work for you, a low-level API may be the solution.
Check out [Discover how to communicate with your device] to start your journey.

## 🧲 Access sensors on this device {: #sensors }

Use the [Generic Sensor API] to read raw sensor values from motion sensors (e.g.
accelerometer or gyroscope) and environmental sensors (e.g. ambient light,
magnetometer). If not available, use the [DeviceMotion and DeviceOrientation]
events to get access to the built-in accelerometer, gyroscope, and compass in
mobile devices.

If it doesn't work for you, a low-level API may be the solution. Check out
[Discover how to communicate with your device] to start your journey.

## 🛰 Access GPS coordinates on this device {: #gps }

Use the [Geolocation API] to get the latitude and longitude of the user's
current position on this device.

If it doesn't work for you, a low-level API may be the solution. Check out
[Discover how to communicate with your device] to start your journey.

## 🔋 Check the battery on this device {: #battery }

Use the [Battery API] to get host information about the battery charge level and
be notified when the battery level or charging status change.

If it doesn't work for you, a low-level API may be the solution. Check out
[Discover how to communicate with your device] to start your journey.

## 📞 Communicate with this device over the network {: #network }

In the local network, use the [Remote Playback API] to broadcast audio and/or
video on a remote playback device (e.g. a smart TV or a wireless speaker) or use
the [Presentation API] to render a web page on a second screen (e.g. a secondary
display connected with an HDMI cable or a smart TV connected wirelessly).

If this device exposes a web server, use the [Fetch API] and/or [WebSockets] to
fetch some data from this device by hitting appropriate endpoints. While TCP and
UDP sockets are not available on the web, check out [WebTransport] to handle
interactive, bidirectional, and multiplexed network connections. Note that
[WebRTC] can also be used to communicate data in real-time with other browsers
using a peer-to-peer protocol.

## 🧱 Discover how to communicate with your device {: #discover }

The decision of what low-level API you should use is determined by the nature of
your physical connection to the device. If it is wireless, check out Web NFC for
very short-range wireless connections and Web Bluetooth for nearby wireless
devices.

- With [Web NFC], read and write to this device when it's in close proximity to
  the user's device (usually 5–10 cm, 2–4 inches). Tools like [NFC TagInfo by
  NXP] allow you to browse the content of this device for reverse-engineering
  purposes.

- With [Web Bluetooth], connect to this device over a Bluetooth Low Energy
  connection. It should be pretty easy to communicate with when it uses
  standardized Bluetooth GATT services (such as the battery service) as their
  behavior is [well-documented]. If not, at this point, you either have to find
  some hardware documentation for this device or reverse-engineer it. You can
  use external tools like [nRF Connect for Mobile] and built-in browser tools
  such as the internal page `about://bluetooth-internals` in Chromium-based
  browsers for that. Check out [Reverse-Engineering a Bluetooth Lightbulb] from
  Uri Shaked. Note that Bluetooth devices may also speak the HID or serial
  protocols.

If wired, check out these APIs in this specific order:

1. With [WebHID], understanding HID reports and report descriptors through
   [collections] is key to your comprehension of this device. This can be
   challenging without vendor documentation for this device. Tools like
   [Wireshark] can help you reverse-engineering it.

2. With [Web Serial], without vendor documentation for this device and what
   commands this device supports, it's hard but still possible with lucky
   guessing. Reverse-engineering this device can be done by capturing raw USB
   traffic with tools like [Wireshark]. You can also use the [Serial Terminal
   web app] to experiment with this device if it uses a human-readable protocol.

3. With [WebUSB], without clear documentation for this device and what USB
   commands this device supports, it's hard but still possible with lucky
   guessing. Watch [Exploring WebUSB and its exciting potential] from Suz
   Hinton. You can also reverse-engineer this device by capturing raw USB
   traffic and inspecting [USB descriptors] with external tools like Wireshark
   and built-in browser tools such as the internal page `about://usb-internals`
   in Chromium-based browsers.

## Acknowledgements {: #acknowledgements }

Thanks to [Reilly Grant], [Thomas Steiner], and [Kayce Basques] for reviewing this article.

Photo by [Darya Tryfanava] on [Unsplash].


[Keyboard]: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
[Pointer]: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
[Gamepad API]: /gamepad/
[MediaDevices.getUserMedia()]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
[capturing audio and video]: https://www.html5rocks.com/en/tutorials/getusermedia/intro/
[control the camera's pan, tilt, and zoom]: /camera-pan-tilt-zoom/
[brightness and contrast]: https://developers.google.com/web/updates/2016/12/imagecapture
[take still images]: https://beaufortfrancois.github.io/sandbox/image-capture/playground
[Web Audio]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
[how to profile the performance of Web Audio apps]: /profiling-web-audio-apps-in-chrome/
[window.print()]: https://developer.mozilla.org/en-US/docs/Web/API/Window/print
[WebAuthn]: https://webauthn.io/
[Build your first WebAuthn app]: https://codelabs.developers.google.com/codelabs/webauthn-reauth/
[File System Access API]: /file-system-access/
[File API]: https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
[Generic Sensor API]: /generic-sensor/
[DeviceMotion and DeviceOrientation]: https://developers.google.com/web/fundamentals/native-hardware/device-orientation
[Geolocation API]: https://developers.google.com/web/fundamentals/native-hardware/user-location
[Battery API]: https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API
[Remote Playback API]: https://www.chromestatus.com/feature/5778318691401728
[Presentation API]: https://developers.google.com/web/updates/2018/04/present-web-pages-to-secondary-attached-displays
[Fetch API]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[WebSockets]: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
[WebTransport]: /webtransport/
[WebRTC]: /webrtc-standard-announcement/
[Web NFC]: /nfc
[NFC TagInfo by NXP]: https://play.google.com/store/apps/details?id=com.nxp.taginfolite
[Web Bluetooth]: /bluetooth/
[well-documented]: https://www.bluetooth.com/specifications/gatt/
[nRF Connect for Mobile]: https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp
[Reverse-Engineering a Bluetooth Lightbulb]: https://urish.medium.com/reverse-engineering-a-bluetooth-lightbulb-56580fcb7546
[WebHID]: /hid/
[collections]: https://webhid-collections.glitch.me/
[Wireshark]: https://gitlab.com/wireshark/wireshark/-/wikis/CaptureSetup/USB
[Web Serial]: /serial/
[Serial Terminal web app]: https://googlechromelabs.github.io/serial-terminal/
[WebUSB]: /usb/
[Exploring WebUSB and its exciting potential]: https://www.youtube.com/watch?v=IpfZ8Nj3uiE
[USB descriptors]: https://www.beyondlogic.org/usbnutshell/usb5.shtml
[Reilly Grant]: https://github.com/reillyeon
[Thomas Steiner]: /authors/thomassteiner/
[Kayce Basques]: /authors/kaycebasques/
[Darya Tryfanava]: https://unsplash.com/@darya_tryfanava
[Unsplash]: https://unsplash.com/photos/uZBGDkYkvhM
[Discover how to communicate with your device]: #discover
