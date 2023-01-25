---
title: 通过 JavaScript 与蓝牙设备通信
subhead: |2-

  Web Bluetooth API 允许网站与蓝牙设备进行通信。
authors:
  - beaufortfrancois
date: 2015-07-21
updated: 2021-10-01
hero: image/admin/CME5IVhdn0pngs7jAlFX.jpg
thumbnail: image/admin/1J1OTu90a2oH8wFogKnF.jpg
alt: 硬币上的蓝牙芯片
description: |2-

  Web Bluetooth API 允许网站与蓝牙设备进行通信。
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: web-bluetooth
---

如果我告诉您网站能以安全和隐私保护的方式与附近的蓝牙设备进行通信，您会怎么想？如此一来，心率监测器、会唱歌的灯，甚至[海龟](https://www.youtube.com/watch?v=1LV1Fk5ZXwA)都可以直接与网站交互了。

到目前为止，仅有部分针对特定平台的应用可以实现与蓝牙设备的交互。Web Bluetooth API 旨在改变这一现状，以期将此功能赋予 Web 浏览器。

## 前言

本文假定您对低功耗蓝牙 (BLE) 和[通用属性配置文件](https://www.bluetooth.com/specifications/gatt/)(GATT) 的工作原理已有一定的了解。

尽管 [Web Bluetooth API 规范](https://webbluetoothcg.github.io/web-bluetooth/)尚未最终确定，但规范的作者们正在积极寻找热情的开发人员来试用此 API，并就[规范](https://github.com/WebBluetoothCG/web-bluetooth/issues)和[实施](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EBluetooth)提供反馈。

ChromeOS、Chrome for Android 6.0、Mac (Chrome 56) 和 Windows 10 (Chrome 70) 中有一个可用的 Web Bluetooth API 子集。这意味着您应该能够[请求](#request)并[连接](#connect)到附近的低功耗蓝牙设备、[读取](#read)/[写入](#write)蓝牙特性、[接收 GATT 通知](#notifications)、了解[蓝牙设备何时断开连接](#disconnect)，甚至[读取和写入蓝牙描述符](#descriptors)。有关更多信息，请参阅 MDN 的[浏览器兼容性](https://developer.mozilla.org/docs/Web/API/Web_Bluetooth_API#Browser_compatibility)表。

对于 Linux 和更早版本的 Windows，请在 `about://flags` 中启用 `#experimental-web-platform-features` 标志。

### 初步试用

为了尽可能多地获得开发人员对使用 Web Bluetooth API 的一手反馈，Chrome 此前已在 Chrome 53 中添加了此功能，以供在 ChromeOS、Android 和 Mac 中[初步试用。](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)

试用已于 2017 年 1 月顺利结束。

## 安全要求

要了解安全权衡，推荐您查阅由 Chrome 团队的软件工程师 Jeffrey Yasskin 发表的 [Web 蓝牙安全模型](https://medium.com/@jyasskin/the-web-bluetooth-security-model-666b4e7eed2)帖子，他致力于 Web Bluetooth API 规范。

### 仅限 HTTPS

由于该试验性 API 是添加到 Web 中的一项强大的新功能，因此仅可用于[保护上下文](https://w3c.github.io/webappsec-secure-contexts/#intro)。这意味着您在构建时需要考虑 [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) 。

### 需要用户手势

作为一项安全功能，使用 `navigator.bluetooth.requestDevice` 发现蓝牙设备必须由[用户手势](https://html.spec.whatwg.org/multipage/interaction.html#activation)（例如触摸或鼠标点击）触发。我们正在谈论对 [`pointerup`](https://developer.chrome.com/blog/pointer-events/) 、 `click` 和 `touchend` 事件的侦听。

```js
button.addEventListener('pointerup', function(event) {
  // Call navigator.bluetooth.requestDevice
});
```

## 了解代码

Web Bluetooth API 严重依赖于 JavaScript [Promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) 。如果您不熟悉它们，请参阅这个很棒的 [Promises 教程](/promises)。还有一件事， `() => {}` 是简单的 ECMAScript 2015 [箭头函数](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)。

### 请求蓝牙设备 {: #request }

此版本的 Web Bluetooth API 规范允许以 Central 角色运行的网站通过 BLE 连接实现到远程 GATT 服务器的连接。支持使用蓝牙 4.0 或更高版本的设备之间的通信。

当网站使用 `navigator.bluetooth.requestDevice` 请求访问附近的设备时，浏览器会通过设备选择器提示用户，用户可以在该选择器中选择一台设备或简单地取消请求。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/bluetooth/bluetooth-device-chooser.mp4">
  </source></video>
  <figcaption>
    <p data-md-type="paragraph"><a href="https://webbluetoothcg.github.io/demos/playbulb-candle/">蓝牙设备用户提示。</a></p>
  </figcaption></figure>

`navigator.bluetooth.requestDevice()` 函数采用定义筛选器的强制对象。这些筛选器仅用于返回与某些公布的蓝牙 GATT 服务和/或设备名称匹配的设备。

#### 服务筛选器

例如，要请求公布[蓝牙 GATT 电池服务](https://www.bluetooth.com/specifications/gatt/)的蓝牙设备：

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

如果您的蓝牙 GATT 服务不在[标准化蓝牙 GATT 服务](https://www.bluetooth.com/specifications/assigned-numbers/)列表中，您可以提供完整的蓝牙 UUID 或简短的 16 位或 32 位形式。

```js
navigator.bluetooth.requestDevice({
  filters: [{
    services: [0x1234, 0x12345678, '99999999-0000-1000-8000-00805f9b34fb']
  }]
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

#### 名称筛选器

您还可以根据使用 `name` 筛选键公布的设备名称请求蓝牙设备，甚至可以使用 `namePrefix` 筛选键根据此名称的前缀来请求蓝牙设备。请注意，在这种情况下，您还需要定义 `optionalServices` 键才能访问未包含在服务筛选器中的任何服务。否则，稍后在尝试访问它们时会出现错误。

```js
navigator.bluetooth.requestDevice({
  filters: [{
    name: 'Francois robot'
  }],
  optionalServices: ['battery_service'] // Required to access service later.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

#### 制造商数据筛选器

还可以根据使用 `manufacturerData` 筛选键公布的制造商规范数据请求蓝牙设备。此键是一个对象数组，其中包含一个名为 `companyIdentifier` 的强制[蓝牙公司标识符](https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers/)键。您还可以提供一个数据前缀，从以它开头的蓝牙设备中筛选制造商数据。请注意，您还需要定义 `optionalServices` 键才能访问未包含在服务筛选器中的任何服务。否则，稍后在尝试访问它们时会出现错误。

```js
// Filter Bluetooth devices from Google company with manufacturer data bytes
// that start with [0x01, 0x02].
navigator.bluetooth.requestDevice({
  filters: [{
    manufacturerData: [{
      companyIdentifier: 0x00e0,
      dataPrefix: new Uint8Array([0x01, 0x02])
    }]
  }],
  optionalServices: ['battery_service'] // Required to access service later.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

掩码还可以与数据前缀一起使用，以匹配制造商数据中的某些模式。请查看[蓝牙数据筛选器解释器](https://github.com/WebBluetoothCG/web-bluetooth/blob/main/data-filters-explainer.md)以了解更多信息。

{% Aside %} 在撰写本文时，Chrome 92 中有可用的 `manufacturerData` 筛选键。如果需要向后兼容老版本的浏览器，您必须提供后备选项，因为制造商数据筛选器被认为是空的。请参阅[示例](https://groups.google.com/a/chromium.org/g/blink-dev/c/5Id2LANtFko/m/5SIig7ktAgAJ)。{% endAside %}

#### 没有筛选器

最后，您可以使用 `acceptAllDevices` 键代替 `filters` 来显示附近的所有蓝牙设备。您还需要定义 `optionalServices` 键才能访问某些服务。否则，稍后在尝试访问它们时会出现错误。

```js
navigator.bluetooth.requestDevice({
  acceptAllDevices: true,
  optionalServices: ['battery_service'] // Required to access service later.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

{% Aside 'caution' %} 这可能会导致选择器中显示一堆不相关的设备，并且由于没有筛选器而浪费能源。请谨慎使用。{% endAside %}

### 连接到蓝牙设备 {: #connect }

那么现在有一个 `BluetoothDevice` 该怎么办？让我们将其连接到包含服务和特征定义的蓝牙远程 GATT 服务器。

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

### 读取蓝牙特征 {: #read }

现在，我们被连接到了远程蓝牙设备的 GATT 服务器。我们想要获取一个主 GATT 服务并读取属于该服务的特征。例如，让我们尝试读取设备电池的当前电量。

在下面的示例中，`battery_level` 是[标准的电池电量特征](https://www.bluetooth.com/specifications/gatt/) 。

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

如果您在使用自定义蓝牙 GATT 特征，则可以向 `service.getCharacteristic` 提供完整的蓝牙 UUID 或简短的 16 位或 32 位形式。

请注意，您还可以在特征上添加 `characteristicvaluechanged` 事件侦听器来处理读取其值。请查看[读取特征值更改示例](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html)，了解如何选择性地处理即将到来的 GATT 通知。

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

### 写入蓝牙特征 {: #write }

写入蓝牙 GATT 特征就像读取它一样简单。这一次，让我们使用心率控制点将心率监测设备上的能量消耗字段的值重置为 0。

我保证这里没有魔法。这一切都在[心率控制点特征页面](https://www.bluetooth.com/specifications/gatt/)中进行了解释。

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

### 接收 GATT 通知 {: #notifications }

现在，让我们看看当设备上的[心率测量](https://www.bluetooth.com/specifications/gatt/)特征发生变化时如何得到通知：

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

[通知示例](https://googlechrome.github.io/samples/web-bluetooth/notifications.html)向您展示了如何使用 `stopNotifications()` 停止通知并正确删除添加的 `characteristicvaluechanged` 事件侦听器。

### 与蓝牙设备断开连接 {: #disconnect }

为了提供更好的用户体验，您可能需要侦听断开连接事件并邀请用户重新连接：

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

您还可以调用 `device.gatt.disconnect()` 以断开您的网络应用与蓝牙设备的连接。这将触发现有的 `gattserverdisconnected` 事件侦听器。请注意，如果另一个应用已经与蓝牙设备通信，则不会停止蓝牙设备通信。请查看[设备断开连接示例](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html)和[自动重新连接示例](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html)以深入了解。

{% Aside 'caution' %} 蓝牙 GATT 属性、服务、特征等在设备断开连接后会失效。这意味着您的代码应始终在重新连接后取回这些属性（通过 `getPrimaryService(s)` 、 `getCharacteristic(s)`等）。{% endAside %}

### 读写蓝牙描述符 {: #descriptors }

蓝牙 GATT 描述符是描述特征值的属性。您可以以类似于蓝牙 GATT 特征的方式读取和写入它们。

例如，让我们看看如何读取设备健康温度计测量间隔的用户描述。

在下面的示例中，`health_thermometer` 是[健康温度计服务](https://www.bluetooth.com/specifications/gatt/)， `measurement_interval` 是[测量间隔特征](https://www.bluetooth.com/specifications/gatt/)， `gatt.characteristic_user_description` 是[特征性用户描述描述符](https://www.bluetooth.com/specifications/assigned-numbers/)。

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
```

现在我们已经读取了设备健康温度计测量间隔的用户描述，让我们看看如何更新它并写入自定义值。

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

## 示例、演示和代码实验室

以下所有的 [Web 蓝牙示例](https://googlechrome.github.io/samples/web-bluetooth/index.html)均已成功测试。为了充分享受这些示例，建议您安装 [BLE Peripheral Simulator Android 应用](https://play.google.com/store/apps/details?id=io.github.webbluetoothcg.bletestperipheral)，该应用可以模拟提供电池服务、心率服务或健康温度计服务的 BLE 外围设备。

### 初学者

- [设备信息](https://googlechrome.github.io/samples/web-bluetooth/device-info.html)- 从 BLE 设备检索基本的设备信息。
- [电池电量](https://googlechrome.github.io/samples/web-bluetooth/battery-level.html)- 从公布电池信息的 BLE 设备中检索电池信息。
- [重置能量](https://googlechrome.github.io/samples/web-bluetooth/reset-energy.html)- 重置公布心率的 BLE 设备消耗的能量。
- [特征属性](https://googlechrome.github.io/samples/web-bluetooth/characteristic-properties.html)- 显示 BLE 设备的特定特征的所有属性。
- [通知](https://googlechrome.github.io/samples/web-bluetooth/notifications.html)- 启动和停止 BLE 设备的特征通知。
- [设备断开连接](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html)- 断开连接，并在连接到 BLE 设备后收到断开连接的通知。
- [获取特征](https://googlechrome.github.io/samples/web-bluetooth/get-characteristics.html)- 从 BLE 设备获取已公布服务的所有特性。
- [获取描述符](https://googlechrome.github.io/samples/web-bluetooth/get-descriptors.html)- 从 BLE 设备获取已公布服务的所有特征的描述符。
- [制造商数据筛选器](https://googlechrome.github.io/samples/web-bluetooth/manufacturer-data-filter.html)- 从匹配制造商数据的 BLE 设备中检索基本的设备信息。

### 组合多个操作

- [GAP 特征](https://googlechrome.github.io/samples/web-bluetooth/gap-characteristics.html)- 获取 BLE 设备的所有 GAP 特征。
- [设备信息特征](https://googlechrome.github.io/samples/web-bluetooth/device-information-characteristics.html)- 获取 BLE 设备的所有设备信息特征。
- [链路丢失](https://googlechrome.github.io/samples/web-bluetooth/link-loss.html)- 设置 BLE 设备的警报级别特征（readValue 和 writeValue）。
- [发现服务和特征](https://googlechrome.github.io/samples/web-bluetooth/discover-services-and-characteristics.html)- 从 BLE 设备发现所有可访问的主要服务及其特征。
- [自动重新连接](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html)- 使用指数退避算法重新连接到断开连接的 BLE 设备。
- [读取已更改的特征值](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html)- 读取电池电量和来自 BLE 设备的更改通知。
- [读取描述符](https://googlechrome.github.io/samples/web-bluetooth/read-descriptors.html)- 从 BLE 设备读取服务的所有特征描述符。
- [写入描述符](https://googlechrome.github.io/samples/web-bluetooth/write-descriptor.html)- 写入 BLE 设备上的描述符“特征用户描述”。

另请查阅我们的[精心策划的网络蓝牙演示](https://github.com/WebBluetoothCG/demos)和[官方网络蓝牙代码实验室](https://github.com/search?q=org%3Agooglecodelabs+bluetooth)。

## 库

- [web-bluetooth-utils](https://www.npmjs.com/package/web-bluetooth-utils) 是一个 npm 模块，向 API 添加一些便捷函数。
- 最流行的 Node.js BLE 中央模块 [noble](https://github.com/sandeepmistry/noble) 中提供了 Web Bluetooth API 填充码。这使您无需 WebSocket 服务器或其他插件即可 webpack（模块化管理和打包）/browserify（在浏览器端组织） noble。
- [angular-web-bluetooth](https://github.com/manekinekko/angular-web-bluetooth) 是 [Angular](https://angularjs.org)的一个模块，它提取配置 Web Bluetooth API 所需的所有样板。

## 工具

- [Get Started with Web Bluetooth](https://beaufortfrancois.github.io/sandbox/web-bluetooth/generator) 是一款简单的网络应用，其会生成与蓝牙设备进行交互的所有 JavaScript 样板代码。您只需输入设备名称、服务、特征，定义其属性即可。
- 如果您已经是蓝牙开发人员，[Web Bluetooth Developer Studio 插件](https://github.com/beaufortfrancois/sandbox/tree/gh-pages/web-bluetooth/bluetooth-developer-studio-plugin)还将为您的蓝牙设备生成 Web Bluetooth JavaScript 代码。

## 提示

在 Chrome 中的 `about://bluetooth-internals` <br> 位置可查看**蓝牙内部**页面，以便您可以检查附近蓝牙设备的所有信息：状态、服务、特征和描述符。

<figure>{% Img src="image/admin/nPX2OfcQKwKtU9xBNhMe.jpg", alt="Chrome 中用于调试蓝牙的内部页面的截图", width="800", height="572" %}<figcaption> Chrome 中用于调试蓝牙设备的内部页面。</figcaption></figure>

还建议您查阅官方[如何提交 Web 蓝牙错误](https://sites.google.com/a/chromium.org/dev/developers/how-tos/file-web-bluetooth-bugs)页面，因为调试蓝牙有时比较麻烦。

{% Aside 'caution' %} 并行读取和写入蓝牙特征可能会引发错误，具体取决于平台。强烈建议您在适当的时候手动对 GATT 操作请求进行排队。请参阅[“正在进行的 GATT 操作 - 如何处理？”](https://github.com/WebBluetoothCG/web-bluetooth/issues/188) 。{% endAside %}

## 下一步行动

首先检查[浏览器和平台实现状态，](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md)以了解当前正在实现 Web Bluetooth API 的哪些部分。

虽然它仍然不完整，但我们可以了解不久的将来它要实现的功能：

- 将使用 `navigator.bluetooth.requestLEScan()`[扫描附近的 BLE 广告](https://github.com/WebBluetoothCG/web-bluetooth/pull/239)。
- 新的 `serviceadded` 事件将跟踪新发现的蓝牙 GATT 服务，而 `serviceremoved` 事件将跟踪已删除的服务。向蓝牙 GATT 服务中添加任何特征和/或描述符或从中删除这些时，将触发新的`servicechanged` 事件。

### 展示您对 API 的支持

您是否打算使用 Web Bluetooth API？您公开的支持将帮助 Chrome 团队竭力打造功能，并为其他浏览器供应商提供动力，这弥足珍贵。

请向 [@ChromiumDev](https://twitter.com/ChromiumDev) 发送带有 [`#WebBluetooth`](https://twitter.com/search?q=%23WebBluetooth&src=typed_query&f=live) <br> 标签的推文，让我们知道您在哪里以及以何种方式在使用它。

## 资源

- 堆栈溢出： [https://stackoverflow.com/questions/tagged/web-bluetooth](https://stackoverflow.com/questions/tagged/web-bluetooth)
- Chrome 功能状态： [https://www.chromestatus.com/feature/5264933985976320](https://www.chromestatus.com/feature/5264933985976320)
- Chrome 实现错误： [https://crbug.com/?q=component:Blink&gt;Bluetooth](https://crbug.com/?q=component:Blink%3EBluetooth)
- Web 蓝牙规范： [https://webbluetoothcg.github.io/web-bluetooth](https://webbluetoothcg.github.io/web-bluetooth)
- 规范问题： [https://github.com/WebBluetoothCG/web-bluetooth/issues](https://github.com/WebBluetoothCG/web-bluetooth/issues)
- BLE 外设模拟器应用： [https://github.com/WebBluetoothCG/ble-test-peripheral-android](https://github.com/WebBluetoothCG/ble-test-peripheral-android)

{% YouTube '_BUwOBdLjzQ' %}

## 致谢

非常感谢 [Kayce Basques](https://github.com/kaycebasques) 审阅本文。首图提供者：[美国博尔德的 SparkFun Electronics](https://commons.wikimedia.org/wiki/File:Bluetooth_4.0_Module_-_BR-LE_4.0-S2A_(16804031059).jpg)。
