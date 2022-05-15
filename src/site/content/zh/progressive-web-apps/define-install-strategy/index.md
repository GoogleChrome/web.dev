---
layout: post
title: 如何定义安装策略
authors:
  - demianrenzulli
  - petelepage
date: 2020-05-12
updated: 2020-08-20
description: |2-

  组合不同安装产品以提高安装率并避免平台竞争和自身蚕食的最佳实践。
tags:
  - progressive-web-apps
---

{% YouTube '6R9pupbDXYw' %}

过去，只有在平台特定应用程序上下文中才能安装应用程序。而如今，现代 Web 应用程序拥有可安装体验，提供与平台特定应用程序相同级别的集成和可靠性。

您可以通过不同的方式实现这一点：

- [从浏览器](/customize-install/)安装 PWA。
- [从应用商店](https://developer.chrome.com/docs/android/trusted-web-activity/)安装 PWA。

拥有不同分销渠道是接触大量用户的有效方式，但选择正确的推广策略很有挑战性。

本指南探讨了组合不同安装产品以提高安装率并避免平台竞争和自身蚕食的最佳实践。涵盖的安装产品包括从浏览器和应用商店安装的 PWA，以及平台特定应用程序。

## 为什么要让您的 Web 应用程序可安装？

安装后的渐进式 Web 应用程序在独立窗口中运行，而不是在浏览器标签页中运行。它们可以从用户的主屏幕、程序坞、任务栏或工具架上启动。您可以在设备上搜索它们并使用应用程序切换器在它们之间跳转，从而感觉这些程序就像其所在设备的一部分。

但是同时拥有可安装 Web 应用程序和平台特定应用程序可能会让用户感到困惑。对于某些用户，平台特定应用程序可能是最佳选择，但对于其他用户，这种应用程序可能存在一些缺点：

- **存储限制：**安装新应用程序可能意味着删除其他应用程序，或通过移除有价值的内容来清理空间。这对低端设备的用户尤其不利。
- **可用带宽：**下载应用程序可能是一个成本高昂且缓慢的过程，对于连接速度较慢和数据计划成本较高的用户来说更是如此。
- **冲突：**离开网站然后转到商店下载应用程序会产生额外的冲突，并会延迟用户直接在网络上执行的操作。
- **更新周期：**在平台特定应用程序中进行更改可能需要经历应用程序审核流程，这样可能会减慢更改和试验（例如 A/B 测试）的速度。

在某些情况下，会有比较多的用户不会下载您的平台特定应用程序，例如：认为自己不会经常使用该应用程序的用户，或者不想花费数兆字节存储空间或数据的用户。您可以通过多种方式确定此部分用户的规模，例如通过使用分析设置来跟踪“仅限移动 Web”用户的百分比。

如果此部分用户的规模相当大，则表明您需要提供其他安装体验方式。

## 推广通过浏览器安装 PWA

如果您有一个优质 PWA，最好在您平台特定应用程序上推广此安装方式。例如，平台特定应用程序缺少您 PWA 提供的功能，或者已有一段时间未更新。如果没有针对更大屏幕（例如 Chrome 操作系统）优化平台特定应用程序，那么推广使用 PWA 安装也很有帮助。

对于某些应用程序，推动平台特定应用程序安装是商业模式的关键部分，在这种情况下，展示平台特定应用程序安装促销具有商业意义。但是，还是有些用户可能更愿意留在网络上。如果可以确定这部分用户，则可以只向他们显示 PWA 提示（我们称之为“PWA 备选”）。

在本节中，我们将探索不同方法，将通过浏览器安装的 PWA 安装率最大化。

### PWA 作为主要可安装体验

只要 PWA 满足[可安装性标准](/install-criteria/)，大多数浏览器便会显示可安装 PWA 的指示。例如，桌面 Chrome 会在地址栏中显示可安装图标，在移动设备上会显示迷你信息栏：

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1VOvbQjeenZOBAmzjVN5.png", alt="名为迷你信息栏的标准 Chrome 安装提示", width="800", height="417" %}<figcaption>迷你信息栏</figcaption></figure>

虽然对于某些体验来说这已足够，但如果您的目标是要推动 PWA 的安装，我们强烈建议您关注 [`BeforeInstallPromptEvent`](https://developer.mozilla.org/docs/Web/API/BeforeInstallPromptEvent) ，并遵循[推广 PWA 安装的模式](/promote-install/)。

## 防止您的 PWA 自身蚕食您平台特定应用程序安装率

在某些情况下，您可能会选择推广安装平台特定应用程序优于安装 PWA，但在这种情况下我们仍然建议您提供一种机制，允许用户安装您的 PWA。此备用选项使无法安装或不想安装您平台特定应用程序的用户可以获得相似的已安装体验。

实施此策略的第一步为，定义何时向用户显示 PWA 安装推广，例如：

**“PWA 用户是看到平台特定应用程序安装提示但尚未安装平台特定应用程序的用户。他们至少返回网站五次，或者点击过应用程序横幅，但仍然继续使用该网站。”**

然后，可以通过以下方式实现提示：

1. 显示平台特定应用程序安装横幅。
2. 如果用户关闭横幅，则使用该信息设置 cookie（例如 `document.cookie = "app-install-banner=dismissed"` ）。
3. 使用另一个 cookie 来跟踪用户访问站点的次数（例如 `document.cookie = "user-visits=1"` ）。
4. 编写一个函数（例如 `isPWAUser()` ），它使用先前存储在 cookie 中的信息以及 [`getInstalledRelatedApps()`](/get-installed-related-apps/) API 来确定是否将用户视为“PWA 用户”。
5. 在用户执行有意义的操作时，调用 `isPWAUser()` 。如果该函数返回 true 并且之前已保存 PWA 安装提示，则可以显示 PWA 安装按钮。

## 通过应用商店推广 PWA 安装

应用商店中提供的应用程序可以使用不同的技术进行构建，包括 PWA 技术。在[将 PWA 融入本地环境](https://youtu.be/V7YX4cZ_Cto)，您能找到可用于相应端的技术汇总。

在本节中，我们将商店中的应用程序分为两组：

- **平台特定应用程序：**这种应用程序大多是使用特定于平台的代码构建的。它们的大小取决于平台，在 Android 中通常大于 10MB，在 iOS 中通常为 30MB。如果您没有 PWA，或者平台特定应用程序提供了更完整的功能设置，那么您可能想要推广您的平台特定应用程序。
- **轻量级应用程序：**这种应用程序也可以使用特定于平台的代码构建，但通常使用 Web 技术构建，打包在平台特定的包装器中。也可以将全套 PWA 上传到商店。有些公司选择将这些内容作为“精简”体验提供，其他公司也将这种方法用于其旗舰（核心）应用程序。

### 推广轻量级应用程序

根据 [Google Play 研究](https://medium.com/googleplaydev/shrinking-apks-growing-installs-5d3fcba23ce2)，APK 的大小每增加 6 MB，安装转化率就会降低 1%。这意味着 10 MB 应用程序的下载完成率可能比 **100 MB 应用程序的下载完成率高大约 30%！**

为了解决这个问题，一些公司利用其 PWA，以使用受信任网络活动在 Play Store 中提供轻量级版本的应用程序。 使用[受信任网络活动](https://developer.chrome.com/docs/android/trusted-web-activity/)，可以在 Play Store 中提供您的 PWA，并且因为它是使用网络构建的，所以应用程序大小通常只有几兆字节。

Oyo 是印度最大的酒店公司之一，开发了其[精简版应用程序](/oyo-lite-twa/)，并使用 TWA 在 Play Store 中予以提供。它只有 850 KB，仅在其 Android 应用程序大小的 7%。安装后，与它们的 Android 应用程序别无二致：

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>当前提供的 OYO 精简版。</figcaption></figure>

Oyo 在商店中保留了旗舰版和“精简版”应用程序版本，将最终决定权留给用户。

#### 提供轻量级 Web 体验

在直觉上，低端设备的用户可能比高端手机用户更倾向于下载轻量级版本的应用程序。因此，如果可以识别用户的设备，则可以优先考虑轻量级应用程序安装横幅，不考虑平台特定重量级用程序版本。

在网络上，可以获取设备信号并将其大致映射到设备类别（例如“高”、“中”或“低”）。您可以使用 JavaScript API 或客户端提示以不同方式获取此信息。

#### 使用 JavaScript API

使用诸如 [navigator.hardwareConcurrency](https://developer.mozilla.org/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency) 、 [navigator.deviceMemory](https://developer.mozilla.org/docs/Web/API/Navigator/deviceMemory) 和 [navigator.connection](https://developer.mozilla.org/docs/Web/API/Navigator/connection) 等 JavaScript API，您可以分别获取有关设备 CPU、内存和网络状态的信息。例如：

```javascript
const deviceCategory = req.get('Device-Memory') < 1 ? 'lite' : 'full';`
```

#### 使用客户端提示

也可以通过[客户端提示](https://developer.mozilla.org/docs/Glossary/Client_hints)在 HTTP 请求头中推断设备信号。如何使用客户端提示为设备内存实施先前代码如下：

首先，告知浏览器您想要在任何第一方请求的 HTTP 响应请求头中接收设备内存提示：

```html
HTTP/1.1 200 OK
Content-Type: text/html
Accept-CH: Device-Memory
```

然后，您会开始在 HTTP 请求的请求头中接收设备内存信息：

```html
GET /main.js HTTP/1.1
Device-Memory: 0.5
```

您可以在后端使用此信息存储具有用户设备类别的 cookie：

```javascript
app.get('/route', (req, res) => {
  // 确定设备类别

 const deviceCategory = req.get('Device-Memory') < 1 ? 'lite' : 'full';

  // 设置 cookie
  res.setCookie('Device-Category', deviceCategory);
  …
});
```

最后，创建您自己的逻辑将此信息映射到设备类别，并在每种情况下显示相应的应用程序安装提示：

```javascript
if (isDeviceMidOrLowEnd()) {
   // 显示"精简版应用程序"安装横幅或 PWA A2HS 提示
} else {
  // 显示"核心应用程序"安装横幅
}
```

{% Aside %}本指南未深入介绍如何将设备信号映射到设备类别的技术，但您可以查阅 Addy Osmani 所著的[自适应加载指南](https://dev.to/addyosmani/adaptive-loading-improving-web-performance-on-low-end-devices-1m69)、Philip Walton 所著的[设备内存 API](https://developer.chrome.com/blog/device-memory/) 和 Jeremy Wagner 所著的[使用客户端提示适应用户](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints/)，了解有关此方面最佳实践的更多信息。{% endAside %}

## 结论

能在用户的主屏幕上显示图标是应用程序最吸引人的功能之一。鉴于之前此功能仅适用于从应用商店安装的应用程序，公司会认为显示应用商店安装横幅便足以说服用户来安装体验。目前，有更多种选择让用户安装应用程序，例如在商店中提供轻量级应用程序体验，以及通过提示用户直接从网站进行安装，让用户将 PWA 添加到主屏幕。
