---
layout: post
title: Web 应用清单不符合可安装性要求
description: |2-

  了解如何使您的渐进式 Web 应用可安装。
web_lighthouse:
  - installable-manifest
codelabs:
  - codelab-make-installable
date: 2019-05-04
updated: 2019-09-19
---

可安装性是 [Progressive Web Apps (渐进式 Web 应用，PWA)](/discover-installable) 的核心要求。通过提示用户安装您的 PWA，您允许用户将其添加到他们的主屏幕。将应用添加到主屏幕的用户会更频繁地使用这些应用。

[Web 应用清单](/add-manifest/)包含使您的应用可安装所需的关键信息。

## Lighthouse Web 应用程序清单审计如何失败

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)会标记没有满足可安装性最低要求的[Web 应用程序清单](/add-manifest/)的页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/039DlaixA4drrswBzSra.png", alt="显示用户无法从其主屏幕安装 Web 应用的 Lighthouse 审计", width="800", height="98" %}</figure>

如果页面的清单不包含以下属性，则审计将失败：

- [`short_name`](https://developer.mozilla.org/docs/Web/Manifest/short_name) 或 [`name`](https://developer.mozilla.org/docs/Web/Manifest/name) 属性
- 包含 192x192 像素和 512x512 像素图标的 [`icons`](https://developer.mozilla.org/docs/Web/Manifest/icons) 属性
- [`start_url`](https://developer.mozilla.org/docs/Web/Manifest/start_url) 属性
- 设置为 `fullscreen` 、`standalone` 或 `minimal-ui` 的 [`display`](https://developer.mozilla.org/docs/Web/Manifest/display) 属性
- 设置为非 `true` 值的 [`prefer_related_applications`](https://developer.chrome.com/blog/app-install-banners-native/) 属性。

{% Aside 'caution' %}要使您的应用可安装，Web 应用清单是*必需**的，但这还不够*。要了解如何满足可安装性的所有要求，请参阅[了解可安装性](/discover-installable)帖子。 {% endAside %}

{% include 'content/lighthouse-pwa/scoring.njk' %}

## 如何使您的 PWA 可安装

确保您的应用具有符合上述条件的清单。有关创建 PWA 的更多信息，请参阅[可安装](/installable/)集。

## 如何检查您的 PWA 是否可安装

### 在 Chrome 中

当您的应用满足可安装性的最低要求时，Chrome 会触发 `beforeinstallprompt` 事件，您可以使用该事件提示用户安装您的 PWA。

{% Aside 'codelab' %}通过[使其可安装](/codelab-make-installable)代码实验室了解如何使您的应用可安装在 Chrome 中。 {% endAside %}

### 在其他浏览器中

其他浏览器对安装和触发 `beforeinstallprompt` 事件有不同的标准。请检查他们各自的网站以获取详细的信息：

- [Edge](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps#requirements)
- [Firefox](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Add_to_home_screen#How_do_you_make_an_app_A2HS-ready)
- [Opera](https://dev.opera.com/articles/installable-web-apps/)
- [Samsung Internet](https://hub.samsunginter.net/docs/ambient-badging/)
- [UC Browser](https://plus.ucweb.com/docs/pwa/docs-en/zvrh56)

## 资源

- [**Web 应用清单不符合可安装性要求**审计源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/installable-manifest.js)
- [添加 Web 应用清单](/add-manifest/)
- [了解如何具备可安装性](/discover-installable)
- [Web 应用清单](https://developer.mozilla.org/docs/Web/Manifest)
- [不使用 HTTPS](https://developer.chrome.com/docs/lighthouse/pwa/is-on-https/)
