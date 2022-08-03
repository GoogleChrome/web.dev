---
layout: post
title: 未配置自定义初始屏幕
description: 了解如何为渐进式 Web 应用创建自定义初始屏幕。
web_lighthouse:
  - splash-screen
date: 2019-05-04
updated: 2019-09-19
---

自定义初始屏幕使您的[渐进式 Web 应用 (PWA)](/discover-installable) 感觉更像是为特定设备专门构建。默认情况下，当用户从主屏幕启动您的 PWA 时，Android 会显示一个白屏，直到 PWA 准备就绪。用户可能会看着这个空白的白色屏幕长达 200 毫秒。通过设置自定义初始屏幕，您可以向用户显示自定义背景颜色和 PWA 图标，提供品牌化、吸引人的体验。

## Lighthouse 初始屏幕审计如何失败

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会标记没有自定义初始屏幕的页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CKrrTDSCZ0XLZ7ABKlZt.png", alt="Lighthouse 审计显示站点未配置自定义初始屏幕", width="800", height="98" %}</figure>

{% include 'content/lighthouse-pwa/scoring.njk' %}

## 如何创建自定义初始屏幕

只要您在 [Web 应用清单](/add-manifest)中满足以下要求，Android 版 Chrome 就会自动显示您的自定义初始屏幕：

- `name` 属性设置为您的 PWA 的名称。
- `background_color` 属性设置为有效的 CSS 颜色值。
- `icons` 数组指定一个至少为 512x512 像素的图标。
- 指定的图标存在且为 PNG。

有关更多信息，请参阅[为 Chrome 47 中已安装的 Web 应用添加初始屏幕。](https://developers.google.com/web/updates/2015/10/splashscreen)

{% Aside %}虽然存在单个 512x512 像素图标时 Lighthouse 的审计会通过，但对于 PWA 应包含哪些图标存在一些分歧。有关不同方法的优缺点的讨论，请参阅[审计：图标大小覆盖范围](https://github.com/GoogleChrome/lighthouse/issues/291)。{% endAside %}

## 资源

[**未配置自定义初始屏幕**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/splash-screen.js)
