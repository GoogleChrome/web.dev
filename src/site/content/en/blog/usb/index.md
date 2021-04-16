---
title: Access USB Devices on the Web
subhead: |
  The WebUSB API makes USB safer and easier to use by bringing it to the Web.
authors:
  - beaufortfrancois
date: 2016-03-30
updated: 2021-02-23
hero: image/admin/hhnhxiNuRWMfGqy4NSaH.jpg
thumbnail: image/admin/RyaGPB8fHCuuXUc9Wj9Z.jpg
alt: A photo of an Arduino Micro board
description: |
  The WebUSB API makes USB safer and easier to use by bringing it to the Web.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webusb
---

If I said plainly and simply "USB", there is a good chance that you will
immediately think of keyboards, mice, audio, video, and storage devices. You're
right but you'll find other kinds of Universal Serial Bus (USB) devices out
there.

These non-standardized USB devices require hardware vendors to write platform-specific
drivers and SDKs in order for you (the developer) to take advantage of them.
Sadly this platform-specific code has historically prevented these devices from being used
by the Web. And that's one of the reasons the WebUSB API has been created: to
provide a way to expose USB device services to the Web. With this API, hardware
manufacturers will be able to build cross-platform JavaScript SDKs for their
devices.
But most importantly this will **make USB safer and easier to use by bringing
it to the Web**.

Let's see the behavior you could expect with the WebUSB API:

1. Buy a USB device.
2. Plug it into your computer. A notification appears right away, with the right
   website to go to for this device.
3. Click the notification. The website is there and ready to use!
4. Click to connect and a USB device chooser shows up in Chrome where you can
   pick your device.

Tada!

What would this procedure be like without the WebUSB API?

1. Install a platform-specific application.
2. If it's even supported on my operating system, verify that I've downloaded
   the right thing.
3. Install the thing. If you're lucky, you'll get no scary OS prompts or popups
   warning you about installing drivers/applications from the internet. If
   you're unlucky, the installed drivers or applications malfunction and harm
   your computer. (Remember, the web is built to [contain malfunctioning
   websites]).
4. If you only use the feature once, the code stays on your computer until you
   think to remove it. (On the Web, the space for unused is eventually
   reclaimed.)

## Before I start

This article assumes you have some basic knowledge of how USB works. If not, I
recommend reading [USB in a NutShell]. For background information about USB,
check out the [official USB specifications].

The [WebUSB API] is available in Chrome 61.

### Available for origin trials

In order to get as much feedback as possible from developers using the WebUSB
API in the field, we've previously added this feature in Chrome 54 and Chrome
57 as an [origin trial].

The latest trial has successfully ended in September 2017.

## Privacy and security

### HTTPS only

Because of this feature's power, it only works on [secure contexts]. This means
you'll need to build with [TLS] in mind.

### User gesture required

As a security precaution, `navigator.usb.requestDevice()` may only
be called through a user gesture such as a touch or mouse click.

### Feature Policy

A [feature policy] is a mechanism that allows developers to selectively enable
and disable various browser features and APIs. It can be defined via an HTTP
header and/or an iframe "allow" attribute.

You can define a feature policy that controls whether the usb attribute is
exposed on the Navigator object, or in other words if you allow WebUSB.

Below is an example of a header policy where WebUSB is not allowed:

```http
Feature-Policy: fullscreen "*"; usb "none"; payment "self" https://payment.example.com
```

Below is another example of a container policy where USB is allowed:

```html
<iframe allowpaymentrequest allow="usb; fullscreen"></iframe>
```

## Let's start coding

The WebUSB API relies heavily on JavaScript [Promises]. If you're not familiar
with them, check out this great [Promises tutorial]. One more thing, `() => {}`
are simply ECMAScript 2015 [Arrow functions].

### Get access to USB devices

You can either prompt the user to select a single connected USB device using
`navigator.usb.requestDevice()` or call `navigator.usb.getDevices()` to get a
list of all connected USB devices the origin has access to.

The `navigator.usb.requestDevice()` function takes a mandatory JavaScript object
that defines `filters`. These filters are used to match any USB device with the
given vendor (`vendorId`) and, optionally, product (`productId`) identifiers.
The `classCode`, `protocolCode`, `serialNumber`, and `subclassCode` keys can
also be defined there as well.

<figure class="w-figure">
  {% Img src="image/admin/KIbPwUfEqgZZLxugxBOY.png", alt="Screenshot of the USB device user prompt in Chrome", width="800", height="533", class="w-screenshot" %}
  <figcaption class="w-figcaption">USB device user prompt.</figcaption>
</figure>

For instance, here's how to get access to a connected Arduino device configured
to allow the origin.

```js
navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(device => {
  console.log(device.productName);      // "Arduino Micro"
  console.log(device.manufacturerName); // "Arduino LLC"
})
.catch(error => { console.error(error); });
```

Before you ask, I didn't magically come up with this `0x2341` hexadecimal
number. I simply searched for the word "Arduino" in this [List of USB ID's].

The USB `device` returned in the fulfilled promise above has some basic, yet
important information about the device such as the supported USB version,
maximum packet size, vendor, and product IDs, the number of possible
configurations the device can have. Basically it contains all fields in the
[device USB Descriptor].

By the way, if a USB device announces its [support for WebUSB], as well as
defining a landing page URL, Chrome will show a persistent notification when the
USB device is plugged in. Clicking this notification will open the landing page.

<figure class="w-figure">
  {% Img src="image/admin/1gRIz2wY4LYofeFq5cc3.png", alt="Screenshot of the WebUSB notification in Chrome", width="800", height="450", class="w-screenshot" %}
  <figcaption class="w-figcaption">WebUSB notification.</figcaption>
</figure>

From there, you can simply call `navigator.usb.getDevices()` and access your
Arduino device as shown below.

```js
navigator.usb.getDevices().then(devices => {
  devices.forEach(device => {
    console.log(device.productName);      // "Arduino Micro"
    console.log(device.manufacturerName); // "Arduino LLC"
  });
})
```

### Talk to an Arduino USB board

Okay, now let's see how easy it is to communicate from a WebUSB compatible
Arduino board over the USB port. Check out instructions at
[https://github.com/webusb/arduino] to WebUSB-enable your [sketches].

Don't worry, I'll cover all the WebUSB device methods mentioned below later in
this article.

```js
let device;

navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(selectedDevice => {
    device = selectedDevice;
    return device.open(); // Begin a session.
  })
.then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
.then(() => device.claimInterface(2)) // Request exclusive control over interface #2.
.then(() => device.controlTransferOut({
    requestType: 'class',
    recipient: 'interface',
    request: 0x22,
    value: 0x01,
    index: 0x02})) // Ready to receive data
.then(() => device.transferIn(5, 64)) // Waiting for 64 bytes of data from endpoint #5.
.then(result => {
  const decoder = new TextDecoder();
  console.log('Received: ' + decoder.decode(result.data));
})
.catch(error => { console.error(error); });
```

Please keep in mind that the WebUSB library I'm using here is just implementing
one example protocol (based on the standard USB serial protocol) and that
manufacturers can create any set and types of endpoints they wish.
Control transfers are especially nice for small configuration commands as
they get bus priority and have a well defined structure.

And here's the sketch that has been uploaded to the Arduino board.

```arduino
// Third-party WebUSB Arduino library
#include <WebUSB.h>

WebUSB WebUSBSerial(1 /* https:// */, "webusb.github.io/arduino/demos");

#define Serial WebUSBSerial

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // Wait for serial port to connect.
  }
  Serial.write("WebUSB FTW!");
  Serial.flush();
}

void loop() {
  // Nothing here for now.
}
```

The third-party [WebUSB Arduino library] used in the sample code above does
basically two things:
- The device acts as a WebUSB device enabling Chrome to read the [landing page
  URL].
- It exposes a WebUSB Serial API that you may use to override the default one.

Look at the JavaScript code again. Once I get the `device` picked by the user,
`device.open()` runs all platform-specific steps to start a session with the USB
device. Then, I have to select an available USB Configuration with
`device.selectConfiguration()`. Remember that a configuration specifies how the
device is powered, its maximum power consumption and its number of interfaces.
Speaking of interfaces, I also need to request exclusive access with
`device.claimInterface()` since data can only be transferred to an interface or
associated endpoints when the interface is claimed. Finally calling
`device.controlTransferOut()` is needed to set up the Arduino device with the
appropriate commands to communicate through the WebUSB Serial API.

From there, `device.transferIn()` performs a bulk transfer onto the
device to inform it that the host is ready to receive bulk data. Then, the
promise is fulfilled with a `result` object containing a [DataView] `data` that
has to be parsed appropriately.

If you're familiar with USB, all of this should look pretty familiar.

### I want more

The WebUSB API lets you interact with the all USB transfer/endpoint types:

- CONTROL transfers, used to send or receive configuration or command
  parameters to a USB device, are handled with `controlTransferIn(setup,
  length)` and `controlTransferOut(setup, data)`.
- INTERRUPT transfers, used for a small amount of time sensitive data, are
  handled with the same methods as BULK transfers with
  `transferIn(endpointNumber, length)` and `transferOut(endpointNumber, data)`.
- ISOCHRONOUS transfers, used for streams of data like video and sound, are
  handled with `isochronousTransferIn(endpointNumber, packetLengths)` and
 `isochronousTransferOut(endpointNumber, data, packetLengths)`.
- BULK transfers, used to transfer a large amount of non-time-sensitive data in
  a reliable way, are handled with `transferIn(endpointNumber, length)` and
 `transferOut(endpointNumber, data)`.

You may also want to have a look at Mike Tsao's [WebLight project] which
provides a ground-up example of building a USB-controlled LED device designed
for the WebUSB API (not using an Arduino here). You'll find hardware, software,
and firmware.

## Tips

Debugging USB in Chrome is easier with the internal page `chrome://device-log`
where you can see all USB device related events in one single place.

<figure class="w-figure">
  {% Img src="image/admin/ssq2mMZmxpWtALortfZx.png", alt="Screenshot of the device log page to debug WebUSB in Chrome", width="800", height="442", class="w-screenshot" %}
  <figcaption class="w-figcaption">Device log page in Chrome for debugging the WebUSB API.</figcaption>
</figure>

The internal page `chrome://usb-internals` also comes in handy and allows you
to simulate connection and disconnection of virtual WebUSB devices.
This is be useful for doing UI testing without for real hardware.

<figure class="w-figure">
  {% Img src="image/admin/KB5z4p7fZRsvkfhVTNkb.png", alt="Screenshot of the internal page to debug WebUSB in Chrome", width="800", height="294",  class="w-screenshot" %}
  <figcaption class="w-figcaption">Internal page in Chrome for debugging the WebUSB API.</figcaption>
</figure>

On most Linux systems, USB devices are mapped with read-only permissions by
default. To allow Chrome to open a USB device, you will need to add a new [udev
rule]. Create a file at `/etc/udev/rules.d/50-yourdevicename.rules` with the
following content:

```vim
SUBSYSTEM=="usb", ATTR{idVendor}=="[yourdevicevendor]", MODE="0664", GROUP="plugdev"
```

where `[yourdevicevendor]` is `2341` if your device is an Arduino for instance.
`ATTR{idProduct}` can also be added for a more specific rule. Make sure your
`user` is a [member] of the `plugdev` group.  Then, just reconnect your device.

{% Aside  %}
Microsoft OS 2.0 Descriptors used by the Arduino examples only work on Windows
8.1 and later. Without that Windows support still requires manual installation
of an INF file.
{% endAside %}

## Resources

- Stack Overflow: [https://stackoverflow.com/questions/tagged/webusb](https://stackoverflow.com/questions/tagged/webusb)
- WebUSB API Spec: [http://wicg.github.io/webusb/](https://wicg.github.io/webusb/)
- Chrome Feature Status: [https://www.chromestatus.com/feature/5651917954875392](https://www.chromestatus.com/feature/5651917954875392)
- Spec Issues: [https://github.com/WICG/webusb/issues](https://github.com/WICG/webusb/issues)
- Implementation Bugs: [http://crbug.com?q=component:Blink>USB](http://crbug.com?q=component:Blink>USB)
- WebUSB ❤ ️Arduino: [https://github.com/webusb/arduino](https://github.com/webusb/arduino)
- IRC: [#webusb](irc://irc.w3.org:6665/#webusb) on W3C's IRC
- WICG Mailing list: [https://lists.w3.org/Archives/Public/public-wicg/](https://lists.w3.org/Archives/Public/public-wicg/)
- WebLight project: [https://github.com/sowbug/weblight](https://github.com/sowbug/weblight)

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#WebUSB`](https://twitter.com/search?q=%23WebUSB&src=typed_query&f=live)
and let us know where and how you're using it.

## Acknowledgements

Thanks to [Joe Medley] for reviewing this article.

[contain malfunctioning websites]: https://www.youtube.com/watch?v=29e0CtgXZSI
[USB in a NutShell]: http://www.beyondlogic.org/usbnutshell
[official USB specifications]: https://www.usb.org/
[WebUSB API]: https://wicg.github.io/webusb/
[origin trial]: https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md
[secure contexts]: https://w3c.github.io/webappsec/specs/powerfulfeatures/#intro
[TLS]: https://en.wikipedia.org/wiki/Transport_Layer_Security
[feature policy]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy
[Promises]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Promises tutorial]: /promises
[Arrow functions]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions
[List of USB ID's]: http://www.linux-usb.org/usb.ids
[device USB Descriptor]: http://www.beyondlogic.org/usbnutshell/usb5.shtml#DeviceDescriptors
[support for WebUSB]: https://wicg.github.io/webusb/#webusb-platform-capability-descriptor
[https://github.com/webusb/arduino]: https://github.com/webusb/arduino
[sketches]: http://www.arduino.cc/en/Tutorial/Sketch
[WebUSB Arduino library]: https://github.com/webusb/arduino/tree/gh-pages/library/WebUSB
[landing page URL]: https://wicg.github.io/webusb/#webusb-platform-capability-descriptor
[DataView]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
[WebLight project]: https://github.com/sowbug/weblight
[udev rule]: https://www.freedesktop.org/software/systemd/man/udev.html
[member]: https://wiki.debian.org/SystemGroups
[Shared Worker]: https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker
[Service Worker]: https://jakearchibald.github.io/isserviceworkerready/resources.html
[#webusb]: https://twitter.com/search?q=%23webusb&src=typed_query&f=live
[Joe Medley]: https://github.com/jpmedley
