---
title: 通过可遮罩图标使 PWA 支持自适应图标
subhead: 一种允许在支持平台上使用自适应图标的新图标格式。
description: 可遮罩图标是一种新的图标格式，可让您拥有更多控制权，并让您的渐进式 Web 应用程序使用自适应图标。通过提供可遮罩图标，您的图标在所有 Android 设备上都会美观地显示。
authors:
  - tigeroakes
  - thomassteiner
date: 2019-12-19
updated: 2021-05-19
hero: image/admin/lzLo9JCh6bcehH2nSH0n.png
alt: 包含在白色圆形内的图标，与覆盖整个圆形的图标相对比
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

## 什么是可遮罩图标？{: #what }

如果您在最近的 Android 手机上安装了渐进式 Web 应用程序，您可能会注意到其图标以白色背景显示。Android Oreo 引入了自适应图标，在不同的设备型号上显示不同形状的应用图标。不遵循这种新格式的图标将以白色背景显示。

<figure>{% Img src="image/admin/jzjx6dGkXN9EdqnUzAeg.png", alt="Android 上白色圆形中的 PWA 图标", width="400", height="100" %}<figcaption>在 Android 上，透明的 PWA 图标显示在白色圆形内</figcaption></figure>

可遮罩图标是一种新的图标格式，可让您拥有更多控制权，并让您的渐进式 Web 应用程序使用自适应图标。如果您提供可遮罩图标，您的图标可以填满整个形状并且在所有 Android 设备上都可以美观地显示。Firefox 和 Chrome 最近增加了对这种新格式的支持，您可以在应用程序中加以采用。

<figure>{% Img src="image/admin/J7gkg9ylP2ANlFawblze.png", alt="Android 上覆盖整个圆形的 PWA 图标", width="400", height="100" %}<figcaption>而可遮罩图标会覆盖整个圆形</figcaption></figure>

## 当前图标是否就绪？

由于可遮罩图标需要支持多种形状，因此您需要提供带有一些填充的不透明图像，浏览器稍后可以将其裁剪为所需的形状和大小。最好不要依赖任何特定的形状，因为最终选择的形状会因浏览器和平台而异。

<figure data-float="right">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/mx1PEstODUy6b5TXjo4S.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tw7QbXq9SBjGL3UYW0Fq.mp4"], autoplay=true, loop=true, muted=true, playsinline=true %} <figcaption> 特定于不同平台的形状 </figcaption></figure>

幸运的是，所有平台都遵守一个明确定义且[标准化](https://w3c.github.io/manifest/#icon-masks)的“最小安全区”。图标的重要部分（例如徽标）应位于图标中心的圆形区域内，且半径等于图标宽度的 40%。外围 10% 的边缘可能会被裁剪掉。

您可以使用 Chrome DevTools 检查图标的哪些部分位于安全区域内。在您的渐进式 Web 应用程序处于打开状态的情况下，启动 DevTools 并导航到 **Application**（应用程序）面板。在 **Icons**（图标）部分中，可以选择 **Show only the minimum safe area for maskable icons**（仅显示可遮蔽图标的最小安全区域）。您的图标将被修剪，以便只有安全区域可见。如果您的徽标在此安全区域内可见，您就可以放心继续了。

<figure>{% Img src="image/admin/UeKTJM2SE0SQhgnnyaQG.png", alt="DevTools 中的 Applications（应用程序）面板，显示边缘被裁剪的 PWA 图标", width="762", height="423" %}<figcaption>Applications（应用程序）面板</figcaption></figure>

要使用各种 Android 形状测试可遮罩图标，请使用我创建的 [Maskable.app](https://maskable.app/) 工具。打开一个图标，然后使用 Maskable.app 可尝试各种形状和大小，您可以与团队中的其他人分享预览。

## 如何采用可遮罩图标？

如果要基于现有图标创建可遮罩图标，可以使用 [Maskable.app Editor](https://maskable.app/editor)。上传您的图标，调整颜色和大小，然后导出图像。

<figure>{% Img src="image/admin/MDXDwH3RWyj4po6daeXw.png", alt="Maskable.app Editor 截图", width="670", height="569" %}<figcaption>在 Maskable.app Editor 中创建图标</figcaption></figure>

创建可遮罩图标图像并在 DevTools 中测试后，您需要将 [Web 应用程序清单](/add-manifest/)更新为指向新资产。Web 应用程序清单在一个 JSON 文件中提供有关 Web 应用程序的信息，并包含一个 [`icons` 数组](/add-manifest/#icons)。

包含可遮罩图标后，Web 应用程序清单中列出的图像资源即增加了一个新的属性值。`purpose` 字段告诉浏览器应该如何使用图标。默认情况下，图标的 purpose 为 `"any"`。在 Android 上，这些图标将在白色背景上调整大小。

可遮罩图标应使用不同的 purpose：`"maskable"`。这表示图像将与图标遮罩一起使用，让您对结果有更多的控制权。这样，您的图标将不会有白色背景。如果您希望在其他设备上使用可遮罩图标而不使用遮罩。还可以指定多个用空格分隔的 purpose（例如，`"any maskable"`）。

{% Aside %} 虽然您*可以*指定多个以空格分隔的 purpose，例如 `"any maskable"` ，但在实践中*不应该*这样做。使用 `"maskable"` 图标作为 `"any"` 图标是次优之选，因为图标将按原样使用，导致填充过多并使核心图标内容变小。理想情况下，purpose 为 `"any"` 的图标应该具有透明区域并且没有额外填充（例如网站的收藏夹图标），因为浏览器不会为它们添加填充内容。{% endAside %}

```json
{
  …
  "icons": [
    …
    {
      "src": "path/to/regular_icon.png",
      "sizes": "196x196",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "path/to/maskable_icon.png",
      "sizes": "196x196",
      "type": "image/png",
      "purpose": "maskable" // <-- New property value `"maskable"`
    },
    …
  ],
  …
}
```

这样，您就可以开始创建您自己的可遮罩图标，确保您的应用程序图标具有漂亮的无边框外观（以及值得一提的无圆圈边框、无椭圆边框 😄）。

## 致谢

本文由 [Joe Medley](https://github.com/jpmedley) 审阅。
