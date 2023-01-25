---
title: 在 Web 上访问 USB 设备
subhead: |2-

  WebUSB API 通过将 USB 引入 Web 使 USB 更安全、更易于使用。
authors:
  - beaufortfrancois
date: 2016-03-30
updated: 2021-02-23
hero: image/admin/hhnhxiNuRWMfGqy4NSaH.jpg
thumbnail: image/admin/RyaGPB8fHCuuXUc9Wj9Z.jpg
alt: Arduino 微型板照片
description: |2

  WebUSB API 通过将 USB 引入 Web 使 USB 更安全、更易于使用。
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webusb
---

如果我简单地说“USB”，您很有可能会立即想到键盘、鼠标、音频、视频和存储设备。您说得没错，但您会发现还有一些其他类型的通用串行总线 (USB) 设备。

这些非标准化 USB 设备需要硬件供应商编写特定于平台的驱动程序和 SDK，您（开发人员）才能够利用它们。遗憾的是，特定于平台的代码历来阻止这些设备被 Web 使用。这就是创建 WebUSB API 的原因之一：提供一种向 Web 公开 USB 设备服务的方法。借助此 API，硬件制造商将能够为其设备构建跨平台的 JavaScript SDK。但最重要的是，通过将 **USB 引入 Web，使得 USB 更安全、更易于使用**。

让我们看看使用 WebUSB API 所需的操作：

1. 购买 USB 设备。
2. 将其插入您的计算机。立即出现一条通知，其中包含要访问此设备的正确网站。
3. 点击该通知。打开网站，准备使用！
4. 点击进行连接，Chrome 中会显示一个 USB 设备选择器，可以在其中选择您的设备。

Tada!

如果没有 WebUSB API，这个过程会是什么样的？

1. 安装特定于平台的应用程序。
2. 即使操作系统支持，也需要验证下载了正确的内容。
3. 进行安装。如果幸运的话，您将不会收到可怕的操作系统提示或弹出窗口，警告您从 Internet 安装驱动程序/应用程序。如果您不走运，安装的驱动程序或应用程序会出现故障并损害您的计算机。（请记住，Web 是为[包含故障网站](https://www.youtube.com/watch?v=29e0CtgXZSI)而构建的）。
4. 只要使用功能一次，代码就会保留在您的计算机上，直到您删除它为止。（在 Web 上，未使用的空间最终会被回收。）

## 开始之前

本文假设您对 USB 的工作原理有一些基本的了解。如果没有，建议您阅读 [USB in a NutShell](http://www.beyondlogic.org/usbnutshell)。有关 USB 的背景信息，请查阅[官方 USB 规范](https://www.usb.org/)。

[WebUSB API](https://wicg.github.io/webusb/) 在 Chrome 61 中可用。

### 初步试用

为了尽可能多地获得开发人员对使用 WebUSB API 的一手反馈，我们此前已在 Chrome 54 和 Chrome 57 中添加了此功能，以供[初步试用](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)。

试用已于 2017 年 9 月顺利结束。

## 隐私和安全

### 仅 HTTPS

由于此功能强大，它仅适用于[安全上下文](https://w3c.github.io/webappsec/specs/powerfulfeatures/#intro)。这意味着您需要在构建时考虑 [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) 。

### 需要用户手势

作为安全预防措施，`navigator.usb.requestDevice()` 只能通过用户手势（例如触摸或鼠标点击）调用。

### 功能策略

[功能策略](https://developer.mozilla.org/docs/Web/HTTP/Feature_Policy)是一种机制，允许开发人员有选择地启用和禁用各种浏览器功能和 API。它可以通过 HTTP 标头和/或 iframe“允许”属性定义。

您可以定义一个功能策略来控制是否在 Navigator 对象上公开 usb 属性，或者换句话说，是否允许 WebUSB。

以下是不允许 WebUSB 的标头策略示例：

```http
Feature-Policy: fullscreen "*"; usb "none"; payment "self" https://payment.example.com
```

以下是允许 USB 的容器策略的另一个示例：

```html
<iframe allowpaymentrequest allow="usb; fullscreen"></iframe>
```

## 让我们开始编码

WebUSB API 严重依赖于 JavaScript [Promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) 。如果您不熟悉它们，请参阅这个很棒的 [Promises 教程](/promises)。还有一件事， `() => {}` 是简单的 ECMAScript 2015 [箭头函数](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)。

### 访问 USB 设备

您可以使用 `navigator.usb.requestDevice()` 提示用户选择一个连接的 USB 设备，也可以调用 `navigator.usb.getDevices()` 以获取所有初始访问已连接的 USB 设备的列表。

`navigator.usb.requestDevice()` 函数采用定义 `filters` 的强制性 JavaScript 对象。这些过滤器用于匹配具有给定供应商 (`vendorId`) 和可选的产品 (`productId`) 标识符的任何 USB 设备。也可以定义 `classCode`、`protocolCode`、`serialNumber` 和 `subclassCode`。

<figure>{% Img src="image/admin/KIbPwUfEqgZZLxugxBOY.png", alt="Chrome 中 USB 设备用户提示的截图", width="800", height="533" %}<figcaption> USB 设备用户提示。</figcaption></figure>

例如，这里是如何访问配置为允许初始连接的 Arduino 设备。

```js
navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(device => {
  console.log(device.productName);      // "Arduino Micro"
  console.log(device.manufacturerName); // "Arduino LLC"
})
.catch(error => { console.error(error); });
```

在您问之前，我没有想出这个 `0x2341` 十六进制数。我只是在这个[USB ID 列表中](http://www.linux-usb.org/usb.ids)搜索了“Arduino”这个词。

上面已履行的承诺中返回的 USB `device`具有一些关于设备的基本但重要的信息，例如支持的 USB 版本、最大数据包大小、供应商和产品 ID，设备可以具有的可能配置的数量。基本上它包含[设备 USB 描述符](http://www.beyondlogic.org/usbnutshell/usb5.shtml#DeviceDescriptors)中的所有字段。

顺便说一下，如果 USB 设备宣布[支持 WebUSB](https://wicg.github.io/webusb/#webusb-platform-capability-descriptor) 并定义了登陆页面 URL，Chrome 将在 USB 设备插入时显示持久通知。点击此通知将打开登陆页面。

<figure>{% Img src="image/admin/1gRIz2wY4LYofeFq5cc3.png", alt="Chrome 中的 WebUSB 通知截图", width="800", height="450" %}<figcaption> WebUSB 通知。</figcaption></figure>

从那里，您可以简单地调用 `navigator.usb.getDevices()` 并访问您的 Arduino 设备，如下所示。

```js
navigator.usb.getDevices().then(devices => {
  devices.forEach(device => {
    console.log(device.productName);      // "Arduino Micro"
    console.log(device.manufacturerName); // "Arduino LLC"
  });
})
```

### 与 Arduino USB 板交谈

好的，现在让我们看看通过 USB 端口从兼容 WebUSB 的 Arduino 板进行通信是多么容易。请前往 [https://github.com/webusb/arduino](https://github.com/webusb/arduino) 查阅说明以 WebUSB 启用您的[草图](http://www.arduino.cc/en/Tutorial/Sketch)。

别担心，我将在本文后面介绍所有 WebUSB 设备方法。

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

请记住，我在这里使用的 WebUSB 库只是实现了一个示例协议（基于标准 USB 串行协议），制造商可以创建他们希望的任何一组和类型的端点。控制传输对于小型配置命令特别有用，因为它们获得总线优先级并具有明确定义的结构。

这是已上传到 Arduino 板的草图。

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

上面示例代码中使用的第三方 [WebUSB Arduino 库](https://github.com/webusb/arduino/tree/gh-pages/library/WebUSB)基本上做了两件事：

- 该设备充当 WebUSB 设备，使 Chrome 能够读取[登录页面 URL](https://wicg.github.io/webusb/#webusb-platform-capability-descriptor) 。
- 它公开了一个 WebUSB 串行 API，您可以使用它来覆盖默认 API。

再次看一下 JavaScript 代码。一旦我让用户选择 `device`，`device.open()` 将运行所有特定于平台的步骤来启动与 USB 设备的会话。然后，我必须使用 `device.selectConfiguration()` 选择可用的 USB 配置。请记住，配置指定了设备的供电方式、最大功耗和接口数量。说到接口，我还需要使用 `device.claimInterface()` 请求独占访问，因为只有在声明接口时数据才能传输到接口或关联的端点。最后需要调用 `device.controlTransferOut()` 以使用适当的命令设置 Arduino 设备以通过 WebUSB 串行 API 进行通信。

从那里， `device.transferIn()` 对设备执行批量传输，以通知它主机已准备好接收批量数据。然后，使用包含必须适当解析的 [DataView](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) `data` 的 `result` 对象来实现承诺。

如果您熟悉 USB，所有这些都应该很熟悉。

### 我想要更多

WebUSB API 允许您与所有 USB 传输/端点类型交互：

- 用于向 USB 设备发送或接收配置或命令参数的控制传输使用 `controlTransferIn(setup, length)` 和 `controlTransferOut(setup, data)` 处理。
- 用于少量时间敏感数据的中断传输使用与通过 `transferIn(endpointNumber, length)` 和 `transferOut(endpointNumber, data)` 进行的批量传输相同的方法处理。
- 用于视频和声音等数据流的常时等量传输使用 `isochronousTransferIn(endpointNumber, packetLengths)` 和 `isochronousTransferOut(endpointNumber, data, packetLengths)` 处理。
- 用于以可靠的方式传输大量非时间敏感数据的批量传输使用 `transferIn(endpointNumber, length)` 和 `transferOut(endpointNumber, data)` 处理。

您可能还想查看 Mike Tsao 的 [WebLight 项目](https://github.com/sowbug/weblight)，该项目提供了构建专为 WebUSB API 设计的 USB 控制 LED 设备的基本示例（此处不使用 Arduino）。您将找到硬件、软件和固件。

## 提示

使用内部页面 `about://device-log` 在 Chrome 中调试 USB 更容易，其中您可以在同一个位置查看所有与 USB 设备相关的事件。

<figure>{% Img src="image/admin/ssq2mMZmxpWtALortfZx.png", alt="Chrome 中调试 WebUSB 的设备日志页面截图", width="800", height="442" %}<figcaption> Chrome 中用于调试 WebUSB API 的设备日志页面。</figcaption></figure>

内部页面 `about://usb-internals` 也派上用场，可让您模拟虚拟 WebUSB 设备的连接和断开。这对于在没有真实硬件的情况下进行 UI 测试非常有用。

<figure>{% Img src="image/admin/KB5z4p7fZRsvkfhVTNkb.png", alt="Chrome 中调试 WebUSB 的内部页面截图", width="800", height="294" %}<figcaption> Chrome 中用于调试 WebUSB API 的内部页面。</figcaption></figure>

在大多数 Linux 系统上，USB 设备默认映射为只读权限。要允许 Chrome 打开 USB 设备，您需要添加新的[udev 规则](https://www.freedesktop.org/software/systemd/man/udev.html)。在 `/etc/udev/rules.d/50-yourdevicename.rules` 上创建如下内容的文件：

```vim
SUBSYSTEM=="usb", ATTR{idVendor}=="[yourdevicevendor]", MODE="0664", GROUP="plugdev"
```

例如，如果您的设备是 Arduino，则 `[yourdevicevendor]` 为 `2341`。还可以为更具体的规则添加 `ATTR{idProduct}`。确保您的 `user` 是 `plugdev` 组的[成员](https://wiki.debian.org/SystemGroups)。然后，只需重新连接您的设备。

{% Aside  %} Arduino 示例使用的 Microsoft OS 2.0 描述符仅适用于 Windows 8.1 及更高版本。如果没有 Windows 支持，仍然需要手动安装 INF 文件。 {% endAside %}

## 资源

- 堆栈溢出：[https://stackoverflow.com/questions/tagged/webusb](https://stackoverflow.com/questions/tagged/webusb)
- WebUSB API 规范：[http://wicg.github.io/webusb/](https://wicg.github.io/webusb/)
- Chrome 功能状态：[https://www.chromestatus.com/feature/5651917954875392](https://www.chromestatus.com/feature/5651917954875392)
- 规范问题：[https://github.com/WICG/webusb/issues](https://github.com/WICG/webusb/issues)
- 实现中的一些错误：[http://crbug.com?q=component:Blink&gt;USB](http://crbug.com?q=component:Blink%3EUSB)
- WebUSB ❤️Arduino：[https://github.com/webusb/arduino](https://github.com/webusb/arduino)
- IRC：[#webusb](irc://irc.w3.org:6665/#webusb) on W3C's IRC
- WICG 邮件列表：[https://lists.w3.org/Archives/Public/public-wicg/](https://lists.w3.org/Archives/Public/public-wicg/)
- WebLight 项目：[https://github.com/sowbug/weblight](https://github.com/sowbug/weblight)

请向 [@ChromiumDev][cr-dev-twitter] 发送带有 [`#WebUSB`](https://twitter.com/search?q=%23WebUSB&src=typed_query&f=live) 标签的推文，让我们知道您在哪里以及以何种方式在使用它。

## 致谢

衷心感谢 [Joe Medley](https://github.com/jpmedley) 审阅本文。
