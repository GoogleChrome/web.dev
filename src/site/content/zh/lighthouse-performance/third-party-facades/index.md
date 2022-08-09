---
layout: post
title: 使用 Facade （外观）延迟加载第三方资源
description: 了解使用 Facade 延迟加载第三方资源的机会。
date: 2020-12-01
web_lighthouse:
  - third-party-facades
---

[第三方资源](/third-party-javascript/)通常用于展示广告或视频以及集成社交媒体。默认方法是在页面加载后立即加载第三方资源，但这可能会不必要地减慢页面的加载速度。如果第三方内容不是那么重要，则可以通过[延迟加载](/fast/#lazy-load-images-and-video)来降低这种性能消耗。

此审计重点介绍了可以在交互时延迟加载的第三方嵌入内容。在这种情况下，在用户与其交互之前，将使用*{nbsp}facade*替换掉第三方内容。

{% Aside 'key-term' %}

*Facade* 是一个静态元素，它外表与实际嵌入的第三方内容相似，但没有功能性，因此对页面加载的消耗要小得多。

{% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cvQ4fxFUG5MIXtUfi77Z.jpg", alt="一个加载 YouTube 嵌入式播放器的示例，facade 的大小是 3 KB，交互时会加载大小为 540 KB 的播放器。", width="800", height="521" %} <figcaption> 使用 facade 加载 YouTube 嵌入式播放器。</figcaption></figure>

## Lighthouse 检测可延迟加载的第三方嵌入内容的方法

Lighthouse 会寻找可延迟加载的第三方产品，例如社交按钮小部件或视频嵌入内容（例如 YouTube 嵌入式播放器）。

有关可延迟加载的产品和可用 facade 的数据[在第三方网络中维护](https://github.com/patrickhulce/third-party-web/)。

如果网页加载隶属这些第三方嵌入之一的资源，则本次审计将失败。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/R0osncucBqYCIZfC85Hu.jpg", alt="Lighthouse 第三方 facade 审计突出显示 Vimeo 嵌入式播放器和 Drift 实时聊天。", width="800", height="517" %}<figcaption>Lighthouse 第三方 facade 审计。</figcaption></figure>

## 如何使用 Facade 延迟加载第三方资源

不要将第三方嵌入直接添加到 HTML 中，而是在加载网页时使用外观类似于实际嵌入的第三方的静态元素。交互模式应该如下所示：

1. 加载时：向页面添加 facade。

2. 鼠标悬停时：facade 预连接到第三方资源。

3. 单击时：facade 会将自己替换为第三方产品。

## 推荐的 Facade

一般来说，视频嵌入、社交按钮小部件和聊天小部件都可以采用 facade 模式。我们在下面列出了推荐的开源 facade。在选择 facade 时，请考虑大小和功能集之间的平衡。您还可以使用延迟 iframe 加载器，例如 [vb/lazyframe](https://github.com/vb/lazyframe)。

### YouTube 嵌入式播放器

- [paulirish/lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed)

- [justinribeiro/lite-youtube](https://github.com/justinribeiro/lite-youtube)

- [Daugilas/lazyYT](https://github.com/Daugilas/lazyYT)

### Vimeo 嵌入式播放器

- [luwes/lite-vimeo-embed](https://github.com/luwes/lite-vimeo-embed)

- [slightlyoff/lite-vimeo](https://github.com/slightlyoff/lite-vimeo)

### 实时聊天（Intercom, Drift, Help Scout, Facebook Messenger）

- [calibreapp/react-live-chat-loader](https://github.com/calibreapp/react-live-chat-loader) （[博客文章](https://calibreapp.com/blog/fast-live-chat)）

{% Aside 'caution' %}

在使用 Facade 延迟加载第三方时需要有一些权衡，因为它们其实不具有实际嵌入产品的全部功能。例如，Drift Live Chat 的聊天气泡使用一个标记来提示新消息的数量。如果使用了 facade 延迟加载了这个实时聊天气泡，那么在浏览器触发 `requestIdleCallback` 后加载实际聊天小部件时会出现气泡。对于视频嵌入，如果延迟加载，自动播放可能无法总是正常工作。

{% endAside %}

## 编写自己的 facade

您可以选择构建使用上述交互模式的[自定义 facade 解决方案。](https://wildbit.com/blog/2020/09/30/getting-postmark-lighthouse-performance-score-to-100#:~:text=What%20if%20we%20could%20replace%20the%20real%20widget)与延迟加载的第三方产品相比，facade 应该小得多，并且只会包含用来模仿产品外观的代码。

如果您希望将自己的解决方案加入上面的列表中，请查看[提交流程](https://github.com/patrickhulce/third-party-web/blob/master/facades.md)。

## 资源

[使用 Facade 延迟加载第三方资源审计](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/third-party-facades.js)的源代码。
