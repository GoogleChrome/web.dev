---
layout: post
title: 如何安装？
authors:
  - petelepage
date: 2020-02-14
updated: 2021-05-19
description: 渐进式 Web 应用程序安装条件。
tags:
  - progressive-web-apps
---

渐进式 Web 应用程序 (PWA) 是利用 Web 技术构建的现代高质量应用程序。PWA 可以提供与 iOS/Android/桌面应用程序类似的功能，而且在不稳定的网络条件下也很可靠，为了更便于找到和使用，用户还可以安装这种应用程序。

大多数用户都熟悉安装应用程序以及安装体验的好处。安装的应用程序会显示在操作系统启动界面上，例如 Mac OS X 上的应用程序文件夹，Windows 上的开始菜单以及 Android 和 iOS 上的主屏幕。安装的应用程序还会显示在活动切换器、设备搜索引擎（如 Spotlight）和内容共享表中。

大多数浏览器会向用户说明，在满足特定条件时，可以安装渐进式 Web 应用程序 (PWA)。示例指示器包括地址栏中的安装按钮，或溢出菜单中的安装菜单项。

<div class="switcher">
  <figure id="browser-install-promo">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/O9KXz4aQXm3ZOzPo98uT.png", alt="安装指示器可见的多功能地址栏屏幕截图。", width="800", height="307" %}<figcaption>浏览器提供的安装推广栏（桌面）</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bolh05TCEeT7xni4eUTG.png", alt="浏览器提供安装推广栏的截图。", width="800", height="307" %}<figcaption>浏览器提供的安装推广栏（移动）</figcaption></figure>
</div>

此外，当满足条件时，许多浏览器将触发 `beforeinstallprompt` 事件，从而允许您提供自定义的应用内用户体验，这种体验可以触发应用内安装流程。

## 安装条件 {: #criteria }

在 Chrome 中，渐进式 Web 应用程序必须满足以下条件才能触发 `beforeinstallprompt` 事件和显示浏览器内安装推广栏：

- 未安装 Web 应用程序
- 符合用户参与启发式
- 通过 HTTPS 提供服务
- 具有一个 [Web 应用清单](/add-manifest/)，其中包括：
    - `short_name` 或 `name`
    - `icons` - 必须包含一个 192 像素和一个 512 像素的图标
    - `start_url`
    - `display` - 必须是 `fullscreen`、`standalone` 或 `minimal-ui`
    - 不能有 `prefer_related_applications`，或值为 `false`
- 使用 `fetch` 处理程序注册服务工作进程

其他浏览器具有类似的安装条件，但可能存在细微区别。检查相应的站点以获取完整详细信息：

- Edge
- Firefox
- [Opera](https://dev.opera.com/articles/installable-web-apps/)

{% Aside %} 在 Android 上，如果 Web 应用程序清单包括 `related_applications` 和 `"prefer_related_applications": true`，则会将用户引导至 Google Play 商店，并[提示安装指定 Android 应用程序](https://developer.chrome.com/blog/app-install-banners-native/)。{% endAside %}
