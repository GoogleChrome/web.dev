---
layout: post
title: Connecting to uncommon HID devices
subhead: |
  The WebHID API allows websites to access alternative auxiliary keyboards and exotic gamepads.
authors:
  - beaufortfrancois
date: 2020-09-15
updated: 2022-07-26
hero: image/admin/05NRg2Lw0w5Rv6TToabY.jpg
thumbnail: image/admin/AfLwyZZbL7bh4S4RikYi.jpg
alt: Elgato Stream Deck photo.
description: |
  The WebHID API allows websites to access alternative auxiliary keyboards and exotic gamepads.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webhid
---

{% Aside 'success' %}
The WebHID API, part of the [capabilities project](https://developer.chrome.com/blog/fugu-status/), launched in
Chrome&nbsp;89.
{% endAside %}

There is a long tail of human interface devices (HIDs), such as alternative
keyboards or exotic gamepads, that are too new, too old, or too uncommon to be
accessible by systems' device drivers. The WebHID API solves this by providing a
way to implement device-specific logic in JavaScript.

## Suggested use cases {: #use-cases }

An HID device takes input from or provides output to humans. Examples of devices
include keyboards, pointing devices (mice, touchscreens, etc.), and gamepads.
The [HID protocol] makes it possible to access these devices on desktop
computers using operating system drivers. The web platform supports HID devices
by relying on these drivers.

The inability to access uncommon HID devices is particularly painful when it
comes to alternative auxiliary keyboards (e.g. [Elgato Stream Deck], [Jabra
headsets], [X-keys]) and exotic gamepad support. Gamepads designed for desktop
often use HID for gamepad inputs (buttons, joysticks, triggers) and outputs
(LEDs, rumble). Unfortunately, gamepad inputs and outputs are not well
standardized and web browsers often require custom logic for specific devices.
This is unsustainable and results in poor support for the long tail of older and
uncommon devices. It also causes the browser to depend on quirks in the behavior
of specific devices.

## Current status {: #status }

<div>

| Step                                         | Status                       |
| -------------------------------------------- | ---------------------------- |
| 1. Create explainer                          | [Complete][explainer]        |
| 2. Create initial draft of specification     | [Complete][spec]             |
| 3. Gather feedback & iterate on design       | [Complete](#feedback)        |
| 4. Origin trial                              | [Complete][ot]               |
| **5. Launch**                                | **Complete**                 |

</div>

## Terminology {: #terminology }

HID consists of two fundamental concepts: reports and report descriptors.
Reports are the data that is exchanged between a device and a software client.
The report descriptor describes the format and meaning of data that the device
supports.

An HID (Human Interface Device) is a type of device that takes input from or
provides output to humans. It also refers to the HID protocol, a standard for
bi-directional communication between a host and a device that is designed to
simplify the installation procedure. The HID protocol was originally developed
for USB devices, but has since been implemented over many other protocols,
including Bluetooth.

Applications and HID devices exchange binary data through three report types:

<div>
  <table>
    <thead>
      <tr>
        <th>Report type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Input&nbsp;report</td>
        <td>Data that is sent from the device to the application (e.g. a button is pressed.)</td>
      </tr>
      <tr>
        <td>Output&nbsp;report</td>
        <td>Data that is sent from the application to the device (e.g. a request to turn on the keyboard backlight.)</td>
      </tr>
      <tr>
        <td>Feature&nbsp;report</td>
        <td>Data that may be sent in either direction. The format is device-specific.</td>
      </tr>
    </tbody>
  </table>
</div>

A report descriptor describes the binary format of reports supported by the
device. Its structure is hierarchical and can group reports together as distinct
collections within the top-level collection. The [format] of the descriptor is
defined by the HID specification.

An HID usage is a numeric value referring to a standardized input or output.
Usage values allow a device to describe the intended use of the device and the
purpose of each field in its reports. For example, one is defined for the left
button of a mouse. Usages are also organized into usage pages, which provide an
indication of the high-level category of the device or report.

## Using the WebHID API {: #use }

### Feature detection {: #feature-detection }

To check if the WebHID API is supported, use:

```js
if ("hid" in navigator) {
  // The WebHID API is supported.
}
```

### Open an HID connection {: #open }

The WebHID API is asynchronous by design to prevent the website UI from
blocking when awaiting input. This is important because HID data can be received
at any time, requiring a way to listen to it.

To open an HID connection, first access a `HIDDevice` object. For this, you can
either prompt the user to select a device by calling
`navigator.hid.requestDevice()`, or pick one from `navigator.hid.getDevices()`
which returns a list of devices the website has been granted access to
previously.

The `navigator.hid.requestDevice()` function takes a mandatory object that
defines filters. Those are used to match any device connected with a USB vendor
identifier (`vendorId`), a USB product identifier (`productId`), a usage page
value (`usagePage`), and a usage value (`usage`). You can get those from [the
USB ID Repository] and the [HID usage tables document].

The multiple `HIDDevice` objects returned by this function represent multiple
HID interfaces on the same physical device.

```js
// Filter on devices with the Nintendo Switch Joy-Con USB Vendor/Product IDs.
const filters = [
  {
    vendorId: 0x057e, // Nintendo Co., Ltd
    productId: 0x2006 // Joy-Con Left
  },
  {
    vendorId: 0x057e, // Nintendo Co., Ltd
    productId: 0x2007 // Joy-Con Right
  }
];

// Prompt user to select a Joy-Con device.
const [device] = await navigator.hid.requestDevice({ filters });
```

```js
// Get all devices the user has previously granted the website access to.
const devices = await navigator.hid.getDevices();
```

<figure>
  {% Img src="image/admin/gaZo8LxG3Y8eU2VirlZ4.jpg", alt="Screenshot of an HID device prompt on a website.", width="800", height="513" %}
  <figcaption>User prompt for selecting a Nintendo Switch Joy-Con.</figcaption>
</figure>

You can also use the optional `exclusionFilters` key in
`navigator.hid.requestDevice()` to exclude some devices from the browser picker
that are known to be malfunctioning for instance.

```js
// Request access to a device with vendor ID 0xABCD. The device must also have
// a collection with usage page Consumer (0x000C) and usage ID Consumer
// Control (0x0001). The device with product ID 0x1234 is malfunctioning.
const [device] = await navigator.hid.requestDevice({
  filters: [{ vendorId: 0xabcd, usagePage: 0x000c, usage: 0x0001 }],
  exclusionFilters: [{ vendorId: 0xabcd, productId: 0x1234 }],
});
```

A `HIDDevice` object contains USB vendor and product identifiers for device
identification. Its `collections` attribute is initialized with a hierarchical
description of the device's report formats.

```js
for (let collection of device.collections) {
  // An HID collection includes usage, usage page, reports, and subcollections.
  console.log(`Usage: ${collection.usage}`);
  console.log(`Usage page: ${collection.usagePage}`);

  for (let inputReport of collection.inputReports) {
    console.log(`Input report: ${inputReport.reportId}`);
    // Loop through inputReport.items
  }

  for (let outputReport of collection.outputReports) {
    console.log(`Output report: ${outputReport.reportId}`);
    // Loop through outputReport.items
  }

  for (let featureReport of collection.featureReports) {
    console.log(`Feature report: ${featureReport.reportId}`);
    // Loop through featureReport.items
  }

  // Loop through subcollections with collection.children
}
```

The `HIDDevice` devices are by default returned in a "closed" state and must be
opened by calling `open()` before data can be sent or received.

```js
// Wait for the HID connection to open before sending/receiving data.
await device.open();
```

### Receive input reports {: #receive-input-reports }

Once the HID connection has been established, you can handle incoming input
reports by listening to the `"inputreport"` events from the device. Those events
contain the HID data as a [`DataView`] object (`data`), the HID device it belongs
to (`device`), and the 8-bit report ID associated with the input report
(`reportId`).

<figure>
  {% Img src="image/admin/Hr4EXZcunl7r2TJwVvQ8.jpg", alt="Red and blue nintendo switch photo.", width="800", height="575" %}
  <figcaption>Nintendo Switch Joy-Con devices.</figcaption>
</figure>

Continuing with the previous example, the code below shows you how to detect
which button the user has pressed on a Joy-Con Right device so that you can
hopefully try it at home.

```js
device.addEventListener("inputreport", event => {
  const { data, device, reportId } = event;

  // Handle only the Joy-Con Right device and a specific report ID.
  if (device.productId !== 0x2007 && reportId !== 0x3f) return;

  const value = data.getUint8(0);
  if (value === 0) return;

  const someButtons = { 1: "A", 2: "X", 4: "B", 8: "Y" };
  console.log(`User pressed button ${someButtons[value]}.`);
});
```

{% Glitch { id: 'webhid-joycon-button', path: 'script.js', height: 480, allow: 'hid' } %}

### Send output reports {: #send-output-reports }

To send an output report to an HID device, pass the 8-bit report ID associated
with the output report (`reportId`) and bytes as a [`BufferSource`] (`data`) to
`device.sendReport()`. The returned promise resolves once the report has been
sent. If the HID device does not use report IDs, set `reportId` to 0.

The example below applies to a Joy-Con device and shows you how to make it
rumble with output reports.

```js
// First, send a command to enable vibration.
// Magical bytes come from https://github.com/mzyy94/joycon-toolweb
const enableVibrationData = [1, 0, 1, 64, 64, 0, 1, 64, 64, 0x48, 0x01];
await device.sendReport(0x01, new Uint8Array(enableVibrationData));

// Then, send a command to make the Joy-Con device rumble.
// Actual bytes are available in the sample below.
const rumbleData = [ /* ... */ ];
await device.sendReport(0x10, new Uint8Array(rumbleData));
```

{% Glitch { id: 'webhid-joycon-rumble', path: 'script.js', height: 480, allow: 'hid' } %}

### Send and receive feature reports {: #feature-reports }

Feature reports are the only type of HID data reports that can travel in both
directions. They allow HID devices and applications to exchange non standardized
HID data. Unlike input and output reports, feature reports are not received or
sent by the application on a regular basis.

<figure>
  {% Img src="image/admin/QJiKwOCVAtUsAWUnqLxi.jpg", alt="Black and silver laptop computer photo.", width="800", height="575" %}
  <figcaption>Laptop keyboard</figcaption>
</figure>

To send a feature report to an HID device, pass the 8-bit report ID associated
with the feature report (`reportId`) and bytes as a [`BufferSource`] (`data`) to
`device.sendFeatureReport()`. The returned promise resolves once the report has
been sent. If the HID device does not use report IDs, set `reportId` to 0.

The example below illustrates the use of feature reports by showing you how to
request an Apple keyboard backlight device, open it, and make it blink.

```js
const waitFor = duration => new Promise(r => setTimeout(r, duration));

// Prompt user to select an Apple Keyboard Backlight device.
const [device] = await navigator.hid.requestDevice({
  filters: [{ vendorId: 0x05ac, usage: 0x0f, usagePage: 0xff00 }]
});

// Wait for the HID connection to open.
await device.open();

// Blink!
const reportId = 1;
for (let i = 0; i < 10; i++) {
  // Turn off
  await device.sendFeatureReport(reportId, Uint32Array.from([0, 0]));
  await waitFor(100);
  // Turn on
  await device.sendFeatureReport(reportId, Uint32Array.from([512, 0]));
  await waitFor(100);
}
```

{% Glitch { id: 'webhid-apple-keyboard-backlight', path: 'script.js', height: 480, allow: 'hid' } %}

To receive a feature report from an HID device, pass the 8-bit report ID
associated with the feature report (`reportId`)  to
`device.receiveFeatureReport()`. The returned promise resolves with a
[`DataView`] object that contains the contents of the feature report. If the HID
device does not use report IDs, set `reportId` to 0.

```js
// Request feature report.
const dataView = await device.receiveFeatureReport(/* reportId= */ 1);

// Read feature report contents with dataView.getInt8(), getUint8(), etc...
```

### Listen to connection and disconnection {: #connection-disconnection }

When the website has been granted permission to access an HID device, it can
actively receive connection and disconnection events by listening to `"connect"`
and `"disconnect"` events.

```js
navigator.hid.addEventListener("connect", event => {
  // Automatically open event.device or warn user a device is available.
});

navigator.hid.addEventListener("disconnect", event => {
  // Remove |event.device| from the UI.
});
```

### Revoke access to an HID device {: #revoke-access }

The website can clean up permissions to access an HID device it is no longer
interested in retaining by calling `forget()` on the `HIDDevice` instance. For
example, for an educational web application used on a shared computer with many
devices, a large number of accumulated user-generated permissions creates a poor
user experience.

Calling `forget()` on a single `HIDDevice` instance will revoke access to all
the HID interfaces on the same physical device.

```js
// Voluntarily revoke access to this HID device.
await device.forget();
```

As `forget()` is available in Chrome 100 or later, check if this feature is
supported with the following:

```js
if ("hid" in navigator && "forget" in HIDDevice.prototype) {
  // forget() is supported.
}
```

## Dev Tips {: #dev-tips }

Debugging HID in Chrome is easy with the internal page, `about://device-log`
where you can see all HID and USB device related events in one single place.

<figure>
  {% Img src="image/admin/zwpr1W7oDsRw0DKsFQ9D.jpg", alt="Screenshot of the internal page to debug HID.", width="800", height="575" %}
  <figcaption>Internal page in Chrome to debug HID.</figcaption>
</figure>

Check out the [HID explorer][hid-explorer] for dumping HID device
info into a human-readable format. It maps from usage values to names for each
HID usage.

On most Linux systems, HID devices are mapped with read-only permissions by
default. To allow Chrome to open an HID device, you will need to add a new [udev
rule]. Create a file at `/etc/udev/rules.d/50-yourdevicename.rules` with the
following content:

```vim
KERNEL=="hidraw*", ATTRS{idVendor}=="[yourdevicevendor]", MODE="0664", GROUP="plugdev"
```

In the line above, `[yourdevicevendor]` is `057e` if your device is a Nintendo Switch
Joy-Con for instance. `ATTRS{idProduct}` can also be added for a more specific
rule. Make sure your `user` is a [member] of the `plugdev` group. Then, just
reconnect your device.

## Browser support {: #browser-support }

The WebHID API is available on all desktop platforms (ChromeOS, Linux, macOS,
and Windows) in Chrome 89.

## Demos {: #demos }

Some WebHID demos are listed at [web.dev/hid-examples]. Go have a look!

## Security and privacy {: #security-privacy }

The spec authors have designed and implemented the WebHID API using the core
principles defined in [Controlling Access to Powerful Web Platform Features],
including user control, transparency, and ergonomics. The ability to use this
API is primarily gated by a permission model that grants access to only a single
HID device at a time. In response to a user prompt, the user must take active
steps to select a particular HID device.

To understand the security tradeoffs, check out the [Security and Privacy
Considerations] section of the WebHID spec.

On top of this, Chrome inspects the usage of each top-level collection and if a
top-level collection has a protected usage (e.g. generic keyboard, mouse), then
a website won't be able to send and receive any reports defined in that
collection. The full list of protected usages is [publicly available].

Note that security-sensitive HID devices (such as FIDO HID devices used for
stronger authentication) are also blocked in Chrome. See the [USB blocklist] and
[HID blocklist] files.


## Feedback {: #feedback }

The Chrome team would love to hear about your thoughts and experiences with the
WebHID API.

### Tell us about the API design

Is there something about the API that doesn't work as expected? Or are there
missing methods or properties that you need to implement your idea?

File a spec issue on the [WebHID API GitHub repo][issues] or add your thoughts
to an existing issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation
different from the spec?

Check out [How to file WebHID bugs][how-to-file]. Be sure to include as much
detail as you can, provide simple instructions for reproducing the bug, and have
*Components* set to `Blink>HID`. [Glitch](https://glitch.com) works great for
sharing quick and easy repros.

### Show support

Are you planning to use the WebHID API? Your public support helps the Chrome
team prioritize features and shows other browser vendors how critical it is to
support them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#WebHID`](https://twitter.com/search?q=%23WebHID&src=typed_query&f=live) and let us know
where and how you're using it.

## Helpful links {: #helpful }

* [Specification][spec]
* [Tracking bug][cr-bug]
* [ChromeStatus.com entry][cr-status]
* Blink Component: [`Blink>HID`](https://chromestatus.com/features#component%3ABlink%3EHID)

## Acknowledgements

Thanks to [Matt Reynolds] and [Joe Medley] for their reviews of this article.
Red and blue Nintendo Switch photo by [Sara Kurfeß], and black and silver laptop
computer photo by [Athul Cyriac Ajay] on Unsplash.

[Capabilities project]: /fugu-status/
[HID protocol]: https://www.usb.org/hid
[Elgato Stream Deck]: https://www.elgato.com/en/gaming/stream-deck
[Jabra headsets]: https://www.jabra.com/business/office-headsets
[X-keys]: https://xkeys.com/xkeys.html
[explainer]: https://github.com/WICG/webhid/blob/main/EXPLAINER.md
[spec]: https://wicg.github.io/webhid/
[format]: https://gist.github.com/beaufortfrancois/583424dfef66be1ade86231fd1a260c7
[the USB ID Repository]: http://www.linux-usb.org/usb-ids.html
[HID usage tables document]: https://usb.org/document-library/hid-usage-tables-12
[`DataView`]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView
[`BufferSource`]: https://developer.mozilla.org/docs/Web/API/BufferSource
[hid-explorer]: https://nondebug.github.io/webhid-explorer/
[web.dev/hid-examples]: /hid-examples/
[udev rule]: https://www.freedesktop.org/software/systemd/man/udev.html
[member]: https://wiki.debian.org/SystemGroups
[Controlling Access to Powerful Web Platform Features]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[Security and Privacy Considerations]: https://wicg.github.io/webhid/#security-and-privacy
[publicly available]: https://source.chromium.org/chromium/chromium/src/+/main:services/device/public/cpp/hid/hid_usage_and_page.cc
[USB blocklist]: https://source.chromium.org/chromium/chromium/src/+/main:chrome/browser/usb/usb_blocklist.cc
[HID blocklist]: https://source.chromium.org/chromium/chromium/src/+/main:services/device/public/cpp/hid/hid_blocklist.cc
[issues]: https://github.com/wicg/webhid/issues
[how-to-file]: https://www.chromium.org/developers/how-tos/file-web-hid-bugs/
[cr-dev-twitter]: https://twitter.com/chromiumdev
[ot]: https://developers.chrome.com/origintrials/#/register_trial/1074108511127863297
[cr-bug]: https://crbug.com/890096
[cr-status]: https://chromestatus.com/feature/5172464636133376
[Matt Reynolds]: https://github.com/nondebug
[Joe Medley]: https://github.com/jpmedley
[Sara Kurfeß]: https://unsplash.com/photos/jqpRECmiNEU
[Athul Cyriac Ajay]: https://unsplash.com/photos/ndokCrfQWrI
