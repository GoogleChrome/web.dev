---
title: 使用应用程序快捷方式快速完成任务
subhead: 利用应用程序的快捷方式可快速访问用户经常需要的一些常见操作。
authors:
  - beaufortfrancois
  - jungkees
date: 2020-05-20
updated: 2021-10-12
hero: image/admin/1ekafMZjtzcd0G3TLQJ4.jpg
alt: 显示应用程序快捷方式菜单的 Android 手机照片
description: 利用应用程序快捷方式可快速访问用户经常需要的一些常见操作。
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

为了提高用户的效率并促进重新参与关键任务，网络平台现在支持应用程序快捷方式。通过这些快捷方式，Web 开发人员可以快速访问用户经常需要的一些常见操作。

本文将讲述如何定义这些应用程序快捷方式。此外，您还将了解一些相关的最佳实践。

## 关于应用程序快捷方式

应用程序快捷方式可帮助用户在您的 Web 应用程序中快速启动常见或推荐的任务。从显示应用程序图标的任何位置轻松访问这些任务将提高用户的效率并增加对 Web 应用程序的使用。

通过右键单击用户桌面上任务栏 (Windows) 或程序坞 (macOS) 中的应用程序图标，或在 Android 上长按应用程序的启动图标，可以调用应用程序快捷方式菜单。

<figure>{% Img src="image/admin/F4TsJNfRJNJSt2ZpqVAy.png", alt="Android 上打开的应用快捷菜单截图", width="800", height="420" %}<figcaption>在 Android 上打开的应用程序快捷方式菜单</figcaption></figure>

<figure>{% Img src="image/admin/RoF6k7Aw6WNvaEcsgIcb.png", alt="在 Windows 上打开的应用程序快捷菜单的屏幕截图", width="800", height="420" %}<figcaption>在 Windows 上打开的应用程序快捷方式菜单</figcaption></figure>

应用程序快捷方式菜单仅针对安装在用户桌面或移动设备上的[渐进式 Web 应用程序](/progressive-web-apps/) 显示。查看[怎样才能设置成可安装？](/install-criteria/)了解可安装性要求。

每个应用程序快捷方式都表达了一个用户意向，每个意向都与您的 Web 应用程序[范围内的 URL 相关联。](/add-manifest/#scope)在用户激活应用程序快捷方式时打开 URL。应用程序快捷方式的示例包括以下内容：

- 顶层导航项（例如，主页、时间表、最近的订单）
- 搜索
- 数据录入任务（例如，编写电子邮件或推文，添加收据）
- 活动（例如，开始与最受欢迎的联系人聊天）

{% Aside %}非常感谢 Microsoft Edge 和 Intel 设计和标准化应用程序快捷方式的工作人员。Chrome 依赖于提交者社区的共同协作来推进 Chromium 项目的发展。并非每个 Chromium 提交者都是 Google 员工，这些做出贡献的人值得特别表扬！{% endAside %}

## 在 Web 应用程序清单中定义应用程序快捷方式

应用程序快捷方式可以选择在 [Web 应用程序清单](/add-manifest)中定义，它是一个 JSON 文件，告知浏览器您的渐进式 Web 应用程序，以及在用户桌面或移动设备上安装时其应如何表现。更具体地说，它们是在 `shortcuts` 数组成员中声明的。下面是一个潜在的 Web 应用程序清单的示例。

```json
{
  "name": "Player FM",
  "start_url": "https://player.fm?utm_source=homescreen",
  …
  "shortcuts": [
    {
      "name": "Open Play Later",
      "short_name": "Play Later",
      "description": "View the list of podcasts you saved for later",
      "url": "/play-later?utm_source=homescreen",
      "icons": [{ "src": "/icons/play-later.png", "sizes": "192x192" }]
    },
    {
      "name": "View Subscriptions",
      "short_name": "Subscriptions",
      "description": "View the list of podcasts you listen to",
      "url": "/subscriptions?utm_source=homescreen",
      "icons": [{ "src": "/icons/subscriptions.png", "sizes": "192x192" }]
    }
  ]
}
```

`shortcuts` 数组的每个成员都是至少包含一个 `name` 和一个 `url` 的字典。其他成员是可选的。

### name

向用户显示时应用程序快捷方式的用户可读标签。

### short_name（可选）

有有限空间下使用的用户可读标签。此项是可选项，但仍建议您提供。

### description（可选）

应用程序快捷方式的用户可读目的。在编写本文时尚未使用，但将来可能会应用于辅助技术。

### url

用户激活应用程序快捷方式时打开的 URL。此 URL 必须存在于 Web 应用程序清单的范围内。如果它是相对的 URL，则基准 URL 将是 Web 应用程序清单的 URL。

### icons（可选）

一组图像资源对象。每个对象都必须包含 `src` 和 `sizes` 属性。与 [Web 应用程序清单图标](/add-manifest/#icons)不同，图像的 `type` 是可选的。

编写本文时不支持 SVG 文件，请改用 PNG。

如果您想要像素完美的图标，请以 48dp（即 36x36、48x48、72x72、96x96、144x144、192x192 像素图标）的递增量提供它们。否则，建议您使用单个 192x192 像素图标。

作为质量衡量标准，图标必须至少是 Android 设备理想尺寸的一半，即 48dp。例如，要在 [xxhdpi 屏幕上](https://developer.android.com/training/multiscreen/screendensities#TaskProvideAltBmp)显示，图标必须至少为 72 x 72 像素。（这是从将 dp 单位转换为像素单位的[公式](https://developer.android.com/training/multiscreen/screendensities#dips-pels)得出的。）

## 测试您的应用程序快捷方式

要验证您的应用程序快捷方式设置是否正确，请使用 DevTools 的**应用程序**面板中的**清单**窗格。

<figure>{% Img src="image/admin/rEL0r8lEfYHlsj0ylLSL.png", alt="DevTools 中应用程序快捷方式的屏幕截图", width="800", height="534" %}<figcaption> DevTools 中显示的应用程序快捷方式</figcaption></figure>

此窗格提供了许多清单属性的用户可读版本，包括应用程序快捷方式。它可以轻松验证所有快捷方式图标（如果提供）是否正确加载。

应用程序快捷方式可能无法立即对所有用户可用，因为渐进式 Web 应用程序更新仅限于每天一次。了解更多关于 [Chrome 如何处理网络应用程序清单的更新](/manifest-updates)的信息。

## 最佳实践

### 按优先顺序排序应用快捷方式

鼓励您按优先顺序排列应用程序快捷方式，最关键的应用程序快捷方式首先出现在 `shortcuts` 数组中，因为显示的应用程序快捷方式数量限制因平台而异。例如，Windows 上的 Chrome 和 Edge 将应用程序快捷方式的数量限制为 10 个，而用于 Android 的 Chrome 仅考虑前 4 个应用程序快捷方式。

{% Aside %}用于 Android 7 的 Chrome 92 现在仅允许 3 个应用程序快捷方式。增加了站点设置的快捷方式，占用应用程序的可用快捷方式槽之一。 {% endAside %}

### 使用不同的应用程序快捷方式名称

您不应依赖图标来区分应用程序快捷方式，因为图标可能并不总是可见的。例如，macOS 不支持 Dock 快捷方式菜单中的图标。为每个应用程序快捷方式使用不同的名称。

### 衡量应用程序快捷方式的使用情况

您应该像处理 `start_url` 的方式一样对应用程序快捷方式 `url` 条目进行注释以进行分析（例如 `url: "/my-shortcut?utm_source=homescreen"` ）。

## 浏览器支持

应用程序快捷方式可在 Android (Chrome 84)、Windows（Chrome 85 和 Edge 85）、ChromeOS（Chrome 92）、macOS 和 Linux（Chrome 96 和 Edge 96）上可用。

<figure>{% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/6KgvySxUcryuD0gwXa0u.png",alt="Chrome 操作系统上打开的应用快捷菜单截图", width="800", height="450" %}<figcaption>在 Chrome 操作系统上打开的应用程序快捷方式菜单</figcaption></figure>

## 支持可信的 Web 活动

[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) 是构建使用[可信 Web 活动](/using-a-pwa-in-your-android-app/) 的 Android 应用程序的推荐工具，它从 Web 应用程序清单中读取应用程序快捷方式并自动为 Android 应用程序生成相应的配置。请注意，应用程序快捷方式的图标是[必需的](https://github.com/GoogleChromeLabs/bubblewrap/issues/116)，并且在 Bubblewrap 中必须至少为 96 x 96 像素。

[PWABuilder](https://www.pwabuilder.com/) 是一个很好的工具，可以轻松地将渐进式 Web 应用程序转换为可信 Web 活动，支持应用程序快捷方式，但有一些[注意事项](https://github.com/pwa-builder/CloudAPK/issues/25)。

对于将可信 Web 活动手动集成到他们的 Android 应用程序中的开发人员，可以使用 [Android 应用程序快捷方式](https://developer.android.com/guide/topics/ui/shortcuts)来实现相同的行为。

## 示例

<figure>
  <video controls autoplay loop muted src="https://storage.googleapis.com/web-dev-assets/app-shortcuts/app-shortcuts-recording.mp4">
  </video></figure>

查看[应用程序快捷方式示例](https://app-shortcuts.glitch.me)及其[源代码](https://glitch.com/edit/#!/app-shortcuts)。

{% Glitch { id: 'app-shortcuts', path: 'public/manifest.json', height: 480 } %}

## 有用的链接

- [解释说明](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Shortcuts/explainer.md)
- [具体说明](https://w3c.github.io/manifest/#shortcuts-member)
- [应用程序快捷方式示例](https://app-shortcuts.glitch.me)|[应用程序快捷方式示例源](https://glitch.com/edit/#!/app-shortcuts)
- [跟踪错误](https://bugs.chromium.org/p/chromium/issues/detail?id=955497)
- [ChromeStatus.com 条目](https://chromestatus.com/feature/5706099464339456)
- 闪烁组件： [`UI>Browser>WebAppInstalls`](https://crbug.com/?q=component:UI%3EBrowser%3EWebAppInstalls)
