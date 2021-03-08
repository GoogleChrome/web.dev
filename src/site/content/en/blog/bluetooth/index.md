---
title: Communicating with Bluetooth devices over JavaScript
subhead: |
  The Web Bluetooth API allows websites to communicate with Bluetooth devices.
authors:
  - beaufortfrancois
date: 2015-07-21
updated: 2021-02-26
hero: image/admin/CME5IVhdn0pngs7jAlFX.jpg
thumbnail: image/admin/1J1OTu90a2oH8wFogKnF.jpg
alt: A Bluetooth chip on a coin
description: |
  The Web Bluetooth API allows websites to communicate with Bluetooth devices.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: web-bluetooth
---

What if I told you websites could communicate with nearby Bluetooth devices
in a secure and privacy-preserving way? This way, heart rate monitors, singing
lightbulbs, and even [turtles] could interact directly with a website.

Until now, the ability to interact with Bluetooth devices has been possible
only for platform-specific apps. The Web Bluetooth API aims to change this and
brings it to web browsers as well.

## Before we start

This article assumes you have some basic knowledge of how Bluetooth Low
Energy (BLE) and the [Generic Attribute Profile] (GATT) work.

Even though the [Web Bluetooth API specification] is not finalized yet, the spec
authors are actively looking for enthusiastic developers to try out this API and
give [feedback on the spec] and [feedback on the implementation].

A subset of the Web Bluetooth API is available in Chrome OS, Chrome for Android
6.0, Mac (Chrome 56) and Windows 10 (Chrome 70). This means you should be able
to [request] and [connect to] nearby Bluetooth Low Energy devices,
[read]/[write] Bluetooth characteristics, [receive GATT Notifications], know
when a [Bluetooth device gets disconnected], and even [read and write to
Bluetooth descriptors]. See MDN's [Browser compatibility] table for more
information.

For Linux and earlier versions of Windows, enable the
`#experimental-web-platform-features` flag in `chrome://flags`.

### Available for origin trials

In order to get as much feedback as possible from developers using the Web
Bluetooth API in the field, Chrome has previously added this feature in Chrome
53 as an [origin trial] for Chrome OS, Android, and Mac.

The trial has successfully ended in January 2017.

## Security requirements

To understand the security tradeoffs, I recommend the [Web Bluetooth Security
Model] post from Jeffrey Yasskin, a software engineer on the Chrome team,
working on the Web Bluetooth API specification.

### HTTPS only

Because this experimental API is a powerful new feature added to the web, it is
made available only to [secure contexts]. This means you'll need to build with
[TLS] in mind.

### User gesture required

As a security feature, discovering Bluetooth devices with
`navigator.bluetooth.requestDevice` must be triggered by [a user gesture] such
as a touch or a mouse click. We're talking about listening to
[`pointerup`], `click`, and `touchend` events.

```js
button.addEventListener('pointerup', function(event) {
  // Call navigator.bluetooth.requestDevice
});
```

## Get into the code

The Web Bluetooth API relies heavily on JavaScript [Promises]. If you're not
familiar with them, check out this great [Promises tutorial]. One more thing,
`() => {}` are simply ECMAScript 2015 [Arrow functions].

### Request Bluetooth devices {: #request }

This version of the Web Bluetooth API specification allows websites, running in
the Central role, to connect to remote GATT Servers over a BLE connection. It
supports communication among devices that implement Bluetooth 4.0 or later.

When a website requests access to nearby devices using
`navigator.bluetooth.requestDevice`, the browser prompts user with a device
chooser where they can pick one device or simply cancel the request.

<figure class="w-figure">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/bluetooth/bluetooth-device-chooser.mp4">
  </video>
  <figcaption class="w-figcaption">
    <a href="https://webbluetoothcg.github.io/demos/playbulb-candle/">Bluetooth device user prompt.</a>
  </figcaption>
</figure>


The `navigator.bluetooth.requestDevice` function takes a mandatory object that
defines filters. These filters are used to return only devices that match some
advertised Bluetooth GATT services and/or the device name.

For instance, to request Bluetooth devices advertising the [Bluetooth GATT
Battery Service]:

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

If your Bluetooth GATT Service is not on the list of [the standardized Bluetooth
GATT services] though, you may provide either the full Bluetooth UUID or a short
16- or 32-bit form.

```js
navigator.bluetooth.requestDevice({
  filters: [{
    services: [0x1234, 0x12345678, '99999999-0000-1000-8000-00805f9b34fb']
  }]
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

You can also request Bluetooth devices based on the device name being advertised
with the `name` filters key, or even a prefix of this name with the `namePrefix`
filters key. Note that in this case, you will also need to define the
`optionalServices` key to be able to access some services. If you don't, you'll
get an error later when trying to access them.

```js
navigator.bluetooth.requestDevice({
  filters: [{
    name: 'Francois robot'
  }],
  optionalServices: ['battery_service']
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

Finally, instead of `filters` you can use the `acceptAllDevices` key to show all
nearby Bluetooth devices. You will also need to define the `optionalServices`
key to be able to access some services. If you don't, you'll get an error later
when trying to access them.

```js
navigator.bluetooth.requestDevice({
  acceptAllDevices: true,
  optionalServices: ['battery_service']
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

{% Aside 'caution' %}
This may result in a bunch of unrelated devices being shown in the chooser and
energy being wasted as there are no filters. Use it with caution.
{% endAside %}

### Connect to a Bluetooth device {: #connect }

So what do you do now that you have a `BluetoothDevice`? Let's connect to the
Bluetooth remote GATT Server which holds the service and characteristic
definitions.

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => {
  // Human-readable name of the device.
  console.log(device.name);

  // Attempts to connect to remote GATT Server.
  return device.gatt.connect();
})
.then(server => { /* … */ })
.catch(error => { console.error(error); });
```

### Read a Bluetooth Characteristic {: #read }

Here we are connected to the GATT Server of the remote Bluetooth device. Now we
want to get a Primary GATT Service and read a characteristic that belongs to
this service. Let's try, for instance, to read the current charge level of the
device's battery.

In the example below, `battery_level` is the [standardized Battery Level
Characteristic].


```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => device.gatt.connect())
.then(server => {
  // Getting Battery Service…
  return server.getPrimaryService('battery_service');
})
.then(service => {
  // Getting Battery Level Characteristic…
  return service.getCharacteristic('battery_level');
})
.then(characteristic => {
  // Reading Battery Level…
  return characteristic.readValue();
})
.then(value => {
  console.log(`Battery percentage is ${value.getUint8(0)}`);
})
.catch(error => { console.error(error); });
```

If you use a custom Bluetooth GATT characteristic, you may provide either the
full Bluetooth UUID or a short 16- or 32-bit form to
`service.getCharacteristic`.

Note that you can also add a `characteristicvaluechanged` event listener on a
characteristic to handle reading its value. Check out the [Read Characteristic
Value Changed Sample] to see how to optionally handle upcoming GATT
notifications as well.

```js
…
.then(characteristic => {
  // Set up event listener for when characteristic value changes.
  characteristic.addEventListener('characteristicvaluechanged',
                                  handleBatteryLevelChanged);
  // Reading Battery Level…
  return characteristic.readValue();
})
.catch(error => { console.error(error); });

function handleBatteryLevelChanged(event) {
  const batteryLevel = event.target.value.getUint8(0);
  console.log('Battery percentage is ' + batteryLevel);
}
```

### Write to a Bluetooth Characteristic {: #write }

Writing to a Bluetooth GATT Characteristic is as easy as reading it. This time,
let's use the Heart Rate Control Point to reset the value of the Energy Expended
field to 0 on a heart rate monitor device.

I promise there is no magic here. It's all explained in the [Heart Rate Control
Point Characteristic page].

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_control_point'))
.then(characteristic => {
  // Writing 1 is the signal to reset energy expended.
  const resetEnergyExpended = Uint8Array.of(1);
  return characteristic.writeValue(resetEnergyExpended);
})
.then(_ => {
  console.log('Energy expended has been reset.');
})
.catch(error => { console.error(error); });
```

### Receive GATT notifications {: #notifications }

Now, let's see how to be notified when the [Heart Rate Measurement]
characteristic changes on the device:

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_measurement'))
.then(characteristic => characteristic.startNotifications())
.then(characteristic => {
  characteristic.addEventListener('characteristicvaluechanged',
                                  handleCharacteristicValueChanged);
  console.log('Notifications have been started.');
})
.catch(error => { console.error(error); });

function handleCharacteristicValueChanged(event) {
  const value = event.target.value;
  console.log('Received ' + value);
  // TODO: Parse Heart Rate Measurement value.
  // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
}
```

The [Notifications Sample] shows you to how to stop notifications with
`stopNotifications()` and properly remove the added `characteristicvaluechanged`
event listener.

### Disconnect from a Bluetooth Device {: #disconnect }

To provide a better user experience, you may want to listen for disconnection events
and invite the user to reconnect:

```js
navigator.bluetooth.requestDevice({ filters: [{ name: 'Francois robot' }] })
.then(device => {
  // Set up event listener for when device gets disconnected.
  device.addEventListener('gattserverdisconnected', onDisconnected);

  // Attempts to connect to remote GATT Server.
  return device.gatt.connect();
})
.then(server => { /* … */ })
.catch(error => { console.error(error); });

function onDisconnected(event) {
  const device = event.target;
  console.log(`Device ${device.name} is disconnected.`);
}
```

You can also call `device.gatt.disconnect()` to disconnect your web app from the
Bluetooth device. This will trigger existing `gattserverdisconnected` event
listeners. Note that it will NOT stop bluetooth device communication if another
app is already communicating with the Bluetooth device. Check out the [Device
Disconnect Sample] and the [Automatic Reconnect Sample] to dive deeper.

{% Aside 'caution' %}
Bluetooth GATT attributes, services, characteristics, etc. are invalidated when
a device disconnects. This means your code should always retrieve (through
`getPrimaryService(s)`, `getCharacteristic(s)`, etc.) these attributes after
reconnecting.
{% endAside %}

### Read and write to Bluetooth descriptors {: #descriptors }

Bluetooth GATT descriptors are attributes that describe a characteristic value.
You can read and write them to in a similar way to Bluetooth GATT
characteristics.

Let's see for instance how to read the user description of the measurement
interval of the device's health thermometer.

In the example below, `health_thermometer` is the [Health Thermometer service],
`measurement_interval` the [Measurement Interval characteristic], and
`gatt.characteristic_user_description` the [Characteristic User Description
descriptor].

```js/4-9
navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('health_thermometer'))
.then(service => service.getCharacteristic('measurement_interval'))
.then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
.then(descriptor => descriptor.readValue())
.then(value => {
  const decoder = new TextDecoder('utf-8');
  console.log(`User Description: ${decoder.decode(value)}`);
})
.catch(error => { console.error(error); });
````

Now that we've read the user description of the measurement interval of the
device's health thermometer, let's see how to update it and write a custom
value.

```js/5-9
navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('health_thermometer'))
.then(service => service.getCharacteristic('measurement_interval'))
.then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
.then(descriptor => {
  const encoder = new TextEncoder('utf-8');
  const userDescription = encoder.encode('Defines the time between measurements.');
  return descriptor.writeValue(userDescription);
})
.catch(error => { console.error(error); });
```

## Samples, demos and codelabs

All [Web Bluetooth samples] below have been successfully tested. To enjoy these
samples to their fullest, I recommend you install the [BLE Peripheral Simulator
Android App] which simulates a BLE peripheral with a Battery Service, a Heart Rate
Service, or a Health Thermometer Service.

### Beginner

- [Device Info](https://googlechrome.github.io/samples/web-bluetooth/device-info.html) - retrieve basic device information from a BLE Device.
- [Battery Level](https://googlechrome.github.io/samples/web-bluetooth/battery-level.html) - retrieve battery information from a BLE Device advertising Battery information.
- [Reset Energy](https://googlechrome.github.io/samples/web-bluetooth/reset-energy.html) - reset energy expended from a BLE Device advertising Heart Rate.
- [Characteristic Properties](https://googlechrome.github.io/samples/web-bluetooth/characteristic-properties.html) - display all properties of a specific characteristic from a BLE Device.
- [Notifications](https://googlechrome.github.io/samples/web-bluetooth/notifications.html) - start and stop characteristic notifications from a BLE Device.
- [Device Disconnect](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html) - disconnect and get notified from a disconnection of a BLE Device after connecting to it.
- [Get Characteristics](https://googlechrome.github.io/samples/web-bluetooth/get-characteristics.html) - get all characteristics of an advertised service from a BLE Device.
- [Get Descriptors](https://googlechrome.github.io/samples/web-bluetooth/get-descriptors.html) - get all characteristics' descriptors of an advertised service from a BLE Device.

### Combining multiple operations

- [GAP Characteristics](https://googlechrome.github.io/samples/web-bluetooth/gap-characteristics.html) - get all GAP characteristics of a BLE Device.
- [Device Information Characteristics](https://googlechrome.github.io/samples/web-bluetooth/device-information-characteristics.html) - get all Device Information characteristics of a BLE Device.
- [Link Loss](https://googlechrome.github.io/samples/web-bluetooth/link-loss.html) - set the Alert Level characteristic of a BLE Device (readValue & writeValue).
- [Discover Services & Characteristics](https://googlechrome.github.io/samples/web-bluetooth/discover-services-and-characteristics.html) - discover all accessible primary services and their characteristics from a BLE Device.
- [Automatic Reconnect](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html) - reconnect to a disconnected BLE device using an exponential backoff algorithm.
- [Read Characteristic Value Changed](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html) - read battery level and be notified of changes from a BLE Device.
- [Read Descriptors](https://googlechrome.github.io/samples/web-bluetooth/read-descriptors.html) - read all characteristic's descriptors of a service from a BLE Device.
- [Write Descriptor](https://googlechrome.github.io/samples/web-bluetooth/write-descriptor.html) - write to the descriptor "Characteristic User Description" on a BLE Device.

Check out our [curated Web Bluetooth Demos] and [official Web Bluetooth Codelabs] as well.

## Libraries

- [web-bluetooth-utils] is a npm module that adds some convenience functions to
  the API.
- A Web Bluetooth API shim is available in [noble], the most popular Node.js BLE
  central module. This allows you to webpack/browserify noble without the need
  for a WebSocket server or other plugins.
- [angular-web-bluetooth] is a module for [Angular] that abstracts away all the
  boilerplate needed to configure the Web Bluetooth API.

## Tools

- [Get Started with Web Bluetooth] is a simple Web App that will generate all
  the JavaScript boilerplate code to start interacting with a Bluetooth device.
  Enter a device name, a service, a characteristic, define its properties and
  you're good to go.
- If you're already a Bluetooth developer, the [Web Bluetooth Developer Studio
  Plugin] will also generate the Web Bluetooth JavaScript code for your
  Bluetooth device.

## Tips

A **Bluetooth Internals** page is available in Chrome at
`chrome://bluetooth-internals` so that you can inspect everything about nearby
Bluetooth devices: status, services, characteristics, and descriptors.

<figure class="w-figure">
  {% Img src="image/admin/nPX2OfcQKwKtU9xBNhMe.jpg", alt="Screenshot of the internal page to debug Bluetooth in Chrome", width="800", height="572", class="w-screenshot" %}
  <figcaption class="w-figcaption">Internal page in Chrome for debugging Bluetooth devices.</figcaption>
</figure>

I also recommend checking out the official [How to file Web Bluetooth bugs]
page as debugging Bluetooth can be hard sometimes.

## What's next

Check the [browser and platform implementation status] first to know which parts
of the Web Bluetooth API are currently being implemented.

Though it's still incomplete, here's a sneak peek of what to expect in the near
future:

- [Scanning for nearby BLE advertisements](https://github.com/WebBluetoothCG/web-bluetooth/pull/239)
  will happen with `navigator.bluetooth.requestLEScan()`.
- A new `serviceadded` event will track newly discovered Bluetooth GATT Services
  while `serviceremoved` event will track removed ones. A new `servicechanged`
  event will fire when any characteristic and/or descriptor gets added or
  removed from a Bluetooth GATT Service.

### Show support for the API

Are you planning to use the Web Bluetooth API? Your public support helps the Chrome team
prioritize features and shows other browser vendors how critical it is to support them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#WebBluetooth`](https://twitter.com/search?q=%23WebBluetooth&src=typed_query&f=live)
and let us know where and how you are using it.

## Resources

- Stack Overflow: [https://stackoverflow.com/questions/tagged/web-bluetooth](https://stackoverflow.com/questions/tagged/web-bluetooth)
- Chrome Feature Status: [https://www.chromestatus.com/feature/5264933985976320](https://www.chromestatus.com/feature/5264933985976320)
- Chrome Implementation Bugs: [https://crbug.com/?q=component:Blink>Bluetooth](https://crbug.com/?q=component:Blink>Bluetooth)
- Web Bluetooth Spec: [https://webbluetoothcg.github.io/web-bluetooth](https://webbluetoothcg.github.io/web-bluetooth)
- Spec Issues: [https://github.com/WebBluetoothCG/web-bluetooth/issues](https://github.com/WebBluetoothCG/web-bluetooth/issues)
- BLE Peripheral Simulator App: [https://github.com/WebBluetoothCG/ble-test-peripheral-android](https://github.com/WebBluetoothCG/ble-test-peripheral-android)

{% YouTube '_BUwOBdLjzQ' %}

## Acknowledgements

Thanks to [Kayce Basques] for reviewing this article.
Hero image by [SparkFun Electronics from Boulder, USA].

[turtles]: https://www.youtube.com/watch?v=1LV1Fk5ZXwA
[Generic Attribute Profile]: https://www.bluetooth.com/specifications/gatt/
[Web Bluetooth API specification]: https://webbluetoothcg.github.io/web-bluetooth/
[feedback on the spec]: https://github.com/WebBluetoothCG/web-bluetooth/issues
[feedback on the implementation]: https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EBluetooth
[request]: #request
[connect to]: #connect
[read]: #read
[write]: #write
[receive GATT Notifications]: #notifications
[Bluetooth device gets disconnected]: #disconnect
[read and write to Bluetooth descriptors]: #descriptors
[Browser compatibility]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API#Browser_compatibility
[origin trial]: https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md
[Web Bluetooth Security Model]: https://medium.com/@jyasskin/the-web-bluetooth-security-model-666b4e7eed2
[secure contexts]: https://w3c.github.io/webappsec-secure-contexts/#intro
[TLS]: https://en.wikipedia.org/wiki/Transport_Layer_Security
[a user gesture]: https://html.spec.whatwg.org/multipage/interaction.html#activation
[`pointerup`]: https://developers.google.com/web/updates/2016/10/pointer-events
[Promises]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Promises tutorial]: /promises
[Arrow functions]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions
[Bluetooth GATT Battery Service]: https://www.bluetooth.com/specifications/gatt/
[the standardized Bluetooth GATT services]: https://www.bluetooth.com/specifications/assigned-numbers/
[standardized Battery Level Characteristic]: https://www.bluetooth.com/specifications/gatt/
[Read Characteristic Value Changed Sample]: https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html
[Heart Rate Control Point Characteristic page]: https://www.bluetooth.com/specifications/gatt/
[Heart Rate Measurement]: https://www.bluetooth.com/specifications/gatt/
[Notifications Sample]: https://googlechrome.github.io/samples/web-bluetooth/notifications.html
[Device Disconnect Sample]: https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html
[Automatic Reconnect Sample]: https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html
[Health Thermometer service]: https://www.bluetooth.com/specifications/gatt/
[Measurement Interval characteristic]: https://www.bluetooth.com/specifications/gatt/
[Characteristic User Description descriptor]: https://www.bluetooth.com/specifications/assigned-numbers/
[Web Bluetooth samples]: https://googlechrome.github.io/samples/web-bluetooth/index.html
[BLE Peripheral Simulator Android App]: https://play.google.com/store/apps/details?id=io.github.webbluetoothcg.bletestperipheral
[curated Web Bluetooth Demos]: https://github.com/WebBluetoothCG/demos
[official Web Bluetooth Codelabs]: https://github.com/search?q=org%3Agooglecodelabs+bluetooth
[web-bluetooth-utils]: https://www.npmjs.com/package/web-bluetooth-utils
[noble]: https://github.com/sandeepmistry/noble
[angular-web-bluetooth]: https://github.com/manekinekko/angular-web-bluetooth
[Angular]: https://angularjs.org
[Polymer]: https://www.polymer-project.org/
[Get Started with Web Bluetooth]: https://beaufortfrancois.github.io/sandbox/web-bluetooth/generator
[Web Bluetooth Developer Studio Plugin]: https://github.com/beaufortfrancois/sandbox/tree/gh-pages/web-bluetooth/bluetooth-developer-studio-plugin
[How to file Web Bluetooth bugs]: https://sites.google.com/a/chromium.org/dev/developers/how-tos/file-web-bluetooth-bugs
[browser and platform implementation status]: https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md
[Kayce Basques]: https://github.com/kaycebasques
[SparkFun Electronics from Boulder, USA]: https://commons.wikimedia.org/wiki/File:Bluetooth_4.0_Module_-_BR-LE_4.0-S2A_(16804031059).jpg
[cr-dev-twitter]: https://twitter.com/ChromiumDev
