---
layout: post
title: 清单没有可屏蔽的图标
description: 了解如何向 PWA 添加可屏蔽图标支持。
web_lighthouse:
  - maskable-icon
date: 2020-05-06
---

[可屏蔽图标](/maskable-icon/)是一种新的图标格式，可确保您的 PWA 图标在所有 Android 设备上看起来都很棒。在较新的 Android 设备上，不遵循可屏蔽图标格式的 PWA 图标被赋予白色背景。当您使用可屏蔽图标时，它可以确保该图标占用 Android 为其提供的所有空间。

## Lighthouse 可屏蔽图标审计如何失败

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 会标记没有可屏蔽图标支持的页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0lXCcsZdOeLZuAw3wbY.jpg", alt="Lighthouse Report UI 中的可屏蔽图标审计。", width="800", height="110" %}</figure>

为了通过审计：

- 必须存在 Web 应用清单。
- Web 应用清单必须有一个 `icons` 数组。
- `icons` 数组必须包含具有 `purpose` 属性的对象，并且 `purpose` 属性的值必须包含 `maskable` 。

{% Aside 'caution' %} Lighthouse 不会检查指定为可屏蔽图标的图像。您需要手动验证图像是否显示良好。 {% endAside %}

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 如何向 PWA 添加可屏蔽图标支持

1. 使用 [Maskable.app Editor](https://maskable.app/editor) 将现有图标转换为可屏蔽图标。

2. 将` purpose` 属性添加到您的[Web 应用清单](/add-manifest/)中的其中一个 `icons` 对象中。将` purpose` 的值设置为 `maskable` 或 `any maskable`。请参阅[值](https://developer.mozilla.org/docs/Web/Manifest/icons#Values)。

    ```json/8
    {
      …
      "icons": [
        …
        {
          "src": "path/to/maskable_icon.png",
          "sizes": "196x196",
          "type": "image/png",
          "purpose": "any maskable"
        }
      ]
      …
    }
    ```

3. 使用 Chrome DevTools 验证可屏蔽图标是否正确显示。请参阅[我当前的图标是否准备就绪？](/maskable-icon/#are-my-current-icons-ready)

## 资源

- [**清单没有可屏蔽的图标**审计源代码](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/maskable-icon.js)
- [PWA 中具有可屏蔽图标的自适应图标支持](/maskable-icon/)
- [Maskable.app Editor](https://maskable.app/editor)
- [添加 Web 应用清单](/add-manifest/)
- [MDN 上的 `icons` 属性](https://developer.mozilla.org/docs/Web/Manifest/icons)
