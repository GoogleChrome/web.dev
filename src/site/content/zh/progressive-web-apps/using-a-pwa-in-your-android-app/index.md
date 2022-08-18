---
layout: post
title: 在 Android 应用程序中使用 PWA
authors:
  - andreban
date: 2020-03-19
updated: 2021-12-06
description: 如何在 Android 应用程序中打开渐进式 Web 应用程序。
tags:
  - progressive-web-apps
---

## 在 Android 应用程序中启动 PWA

[渐进式 Web 应用程序](/progressive-web-apps/) (PWA) 是使用类似应用程序的功能来创造快速、可靠且引人入胜的高质量体验的 Web 应用程序。

Web 具有令人难以置信的影响力，并为用户提供了发现新体验的强大途径。但是用户也习惯于在操作系统商店中搜索应用程序。在许多情况下，这些用户已经熟悉他们寻找的品牌或服务，并且具有高度的意向性，从而导致其参与度指标高于平均值。

Play 商店是 Android 应用程序的商店，开发人员通常希望从他们的 Android 应用程序打开渐进式 Web 应用程序。

Trusted Web Activity 是一个开放标准，它允许浏览器提供一个完全兼容 Web 平台的容器，以在 Android 应用程序中渲染 PWA。[Chrome](https://play.google.com/store/apps/details?id=com.android.chrome) 支持该功能，[Firefox Nightly](https://play.google.com/store/apps/details?id=org.mozilla.fenix) 的支持正在开发中。

### 现有解决方案受限

一直可以在 Android 应用程序中包含 Web 体验，方法是使用 [Android WebView](https://developer.android.com/reference/android/webkit/WebView) 之类的技术或 [Cordova](https://cordova.apache.org/) 等框架。

Android WebView 的局限性在于它并非是浏览器的替代。Android WebView 是用于在 Android 应用程序中使用 Web UI 的开发者工具，不提供对现代 Web 平台功能（如[联系人选取器](/contact-picker/)或[文件系统](/file-system-access/)[等](https://developer.chrome.com/blog/fugu-status/)）的完整访问。

Cordova 旨在弥补 WebView 的缺点，但 API 仅限于 Cordova 环境。这意味着需要维护一个额外的代码库才能将 Cordova API 用于 Android 应用程序，与开放 Web 上的 PWA 分离。

此外，功能可发现性通常并不总是按预期工作，Android 版本和 OEM 之间的兼容性问题也可能是一个问题。使用其中一个解决方案时，开发人员需要额外的质量保证流程，并产生额外的开发成本来检测和创建变通方法。

### Trusted Web Activity 是 Android 上的 Web 应用程序的新容器

开发人员现在可以使用 [Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity/) 作为容器，包含 PWA 作为 Android 应用程序的启动活动。该技术利用浏览器来全屏渲染 PWA，确保 Trusted Web Activity 与底层浏览器兼容相同的 Web 平台功能和 API。还有一些开源实用程序，可以更轻松地使用 Trusted Web Activity 来实现 Android 应用程序。

其他解决方案不具备的另一个优势是容器与浏览器共享存储。登录状态和用户首选项可跨体验无缝共享。

#### 浏览器兼容性

Chrome 75 及更高版本已支持该功能，Firefox 的 nightly 版本正在实现中。

### 质量标准

当 Web 开发人员想要在 Android 应用程序中包含 Web 内容时，应该使用 Trusted Web Activity。

Trusted Web Activity 中的 Web 内容必须满足 PWA 可安装性标准。

此外，为了符合用户对 Android 应用程序的行为预期，[Chrome 86 引入了一项更改](https://blog.chromium.org/2020/06/changes-to-quality-criteria-for-pwas.html)，未能处理以下情况将被视为崩溃：

- 未能在应用程序启动时验证数字资产链接。
- 未能为离线网络资源请求返回 HTTP 200。
- 导航请求返回 HTTP 404 或 5xx 错误。

当 Trusted Web Activity 中出现其中一种情况时，会导致用户可见的 Android 应用程序崩溃。请查看有关在服务工作进程中处理这些情况的[指南](https://developer.chrome.com/docs/android/trusted-web-activity/whats-new/#updates-to-the-quality-criteria)，

应用程序还必须满足额外的特定于 Android 的标准，例如[政策合规性](https://play.google.com/about/developer-content-policy/)。

{% Aside 'caution' %} 如果您的应用程序主要面向 13 岁以下的儿童设计，则额外的 [Play 家庭政策](https://play.google.com/about/families/)适用，这可能与使用 Trusted Web Activity 不兼容。{% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9Z70W3aCI8ropKpMXHcz.png", alt="显示 AirHorn 的 Lighthouse 分数的屏幕截图，带有 PWA 徽章，性能分数为 100。",  width="800", height="141" %} <figcaption> Lighthouse 中的 PWA 徽章显示您的 PWA 是否通过可安装性标准。</figcaption></figure>

## 工具

想要利用 Trusted Web Activity 的 Web 开发人员不需要学习新技术或 API 即可将其 PWA 转换为 Android 应用程序。Bubblewrap 和 PWABuilder 一起提供了库、命令行界面 (CLI) 和图形用户界面 (GUI) 形式的开发人员工具。

### Bubblewrap

[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) 项目可生成 NodeJS 库和命令行界面 (CLI) 形式的 Android 应用程序。

通过运行该工具并传递 Web 清单的 URL 来启动新项目：

```shell
npx @bubblewrap/cli init --manifest=https://pwa-directory.appspot.com/manifest.json
```

该工具还可以构建项目，运行以下命令将输出可以上传到 Play 商店的 Android 应用程序：

```shell
npx @bubblewrap/cli build
```

运行此命令后，项目的根目录中将出现一个名为 `app-release-signed.apk` 的文件。这是将[上传到 Play 商店](https://support.google.com/googleplay/android-developer/answer/3131213?hl=en-GB)的文件。

### PWABuilder

[PWABuilder](https://pwabuilder.com/) 帮助开发人员将现有网站转换为渐进式 Web 应用程序。它还与 Bubblewrap 集成，提供一个 GUI 界面来将这些 PWA 包装成一个 Android 应用程序。PWABuilder 团队整理了一篇关于如何使用该工具生成 Android 应用程序的[精彩博客文章](https://www.davrous.com/2020/02/07/publishing-your-pwa-in-the-play-store-in-a-couple-of-minutes-using-pwa-builder/)。

## 验证 Android 应用程序中的 PWA 的所有权

构建了优秀渐进式 Web 应用程序的开发人员不希望其他开发人员在未经他们许可的情况下使用它构建 Android 应用程序。为确保不会发生这种情况，必须使用一个名为[数字资产链接](https://developers.google.com/digital-asset-links/v1/getting-started)的工具将 Android 应用程序与渐进式 Web 应用程序配对。

Bubblewrap 和 PWABuilder 处理 Android 应用程序上的必要配置，但还有最后一步：将 `assetlinks.json` 文件添加到 PWA 中。

要生成此文件，开发人员需要特定密钥的 SHA-256 签名，该密钥用于对用户下载的 APK 进行签名。

该密钥可以通过多种方式生成，查找哪个密钥为提供给最终用户的 APK 签名的最简单方法是从 Play 商店下载该 APK。

为避免向用户显示损坏的应用程序，请将应用程序部署到[封闭式测试通道](https://support.google.com/googleplay/android-developer/answer/3131213?hl=en-GB)，将其安装到测试设备中，然后使用 [Peter 的资产链接工具](https://play.google.com/store/apps/details?id=dev.conn.assetlinkstool)为应用程序生成正确的 `assetlinks.json` 文件。使生成的 `assetlinks.json` 文件成为正在验证的域中的 `/.well-known/assetlinks.json`。

## 下一步做什么

渐进式 Web 应用程序提供高质量 Web 体验。Trusted Web Activity 是在满足最低质量标准的情况下从 Android 应用程序开启这些高质量体验的新方法。

如果您刚刚入门渐进式 Web 应用程序，请阅读[有关如何构建优秀的 PWA 的指南](/progressive-web-apps/)。对于已经有 PWA 的开发人员，请使用 [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 验证它是否符合质量标准。

然后，使用 [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) 或 [PWABuilder](https://pwabuilder.com/) 生成 Android 应用程序，[将该应用程序上传到 Play 商店的封闭式测试通道](https://support.google.com/googleplay/android-developer/answer/3131213?hl=en-GB)，并使用 [Peter 的资产链接工具](https://play.google.com/store/apps/details?id=dev.conn.assetlinkstool) 将其与 PWA 配对。

最后，将您的应用程序从封闭式测试通道移至生产！
