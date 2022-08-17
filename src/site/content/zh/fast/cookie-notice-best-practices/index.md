---
layout: post
title: Cookie 通知的最佳实践
subhead: |2-

  优化 Cookie 通知以提高性能和可用性。
authors:
  - katiehempenius
date: 2021-03-30
hero: image/j2RDdG43oidUy6AL6LovThjeX9c2/V8rNgYUkkAWET3EkBL6H.png
alt: Cookie 通知的图片。
description: 了解 Cookie 通知如何影响性能、性能测量和用户体验。
tags:
  - blog
  - performance
  - web-vitals
---

本文讨论 Cookie 通知如何影响性能、性能测量和用户体验。

## 性能

Cookie 通知会对页面性能产生重大影响，因为它们通常是在页面刚开始加载时进行加载，并且会向所有用户显示，同时可能会影响广告和其他页面内容的加载。

下面介绍了 Cookie 通知如何影响 Web 的重要指标：

- **最大的内容绘制 (LCP)：**大多数 Cookie 同意通知都很小，因此，通常不包含页面的 LCP 元素。但是，这可能会发生——尤其是在移动设备上。在移动设备上，Cookie 通知通常会占据屏幕的较大部分。这通常发生在 Cookie 通知包含大块文本（文本块也可以是 LCP 元素）时。

- **首次输入延迟 (FID)：**一般来说，您的 Cookie 同意解决方案本身对 FID 的影响很小——Cookie 同意几乎不需要执行 JavaScript。但是，这些 Cookie 所启用的技术（即广告和跟踪脚本）可能会对页面交互性产生重大影响。将这些脚本延迟到接受 Cookie 后执行可以作为一种减少首次输入延迟 (FID) 的技术。

- **累积布局偏移 (CLS)：**Cookie 同意通知是导致布局偏移的一个很常见的原因。

一般来说，与自己构建的 Cookie 通知相比，来自第三方提供商的 Cookie 通知对性能的影响可能更大。这并不是 Cookie 通知才有的问题，而是因为第三方脚本的一般性质。

### 最佳实践

本节介绍的最佳实践主要讲述第三方 Cookie 通知，但其中部分原则（不是全部）也适用于第一方 Cookie 通知。

#### 异步加载 Cookie 通知脚本

Cookie 通知脚本要异步加载。为此，您要将 [`async`](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-async) 属性添加到脚本标签。

```html
<script src="https://cookie-notice.com/script.js" async>
```

非异步脚本会阻止浏览器解析器，从而导致页面加载延迟和 LCP。有关更多信息，请参阅[高效加载第三方 JavaScript](/efficiently-load-third-party-javascript/)。

{% Aside %} 如果您必须使用同步脚本（例如，某些 Cookie 通知要利用同步脚本来实现 Cookie 阻止，则要确保尽快加载请求。一种实现方法是[使用资源提示](/preconnect-and-dns-prefetch/)。{% endAside %}

#### 直接加载 Cookie 通知脚本

您要将脚本标签添加到主文档的 HTML 中，从而“直接”加载 Cookie 通知脚本——而不是通过标签管理器或其他脚本来加载。利用标签管理器或辅助脚本注入 Cookie 通知脚本会导致 Cookie 通知脚本加载延迟：它会从浏览器的先行解析器屏蔽脚本，阻止脚本在 JavaScript 执行之前加载。

#### 与 Cookie 通知来源建立早期连接

所有从第三方位置加载 Cookie 通知脚本的站点都要使用 `dns-prefetch` 或 `preconnect` 资源提示，从而与托管 Cookie 通知资源的来源建立早期连接。有关详细信息，请参阅[尽早建立网络连接以提高页面感知速度](/preconnect-and-dns-prefetch/)。

```html
<link rel="preconnect" href="https://cdn.cookie-notice.com/">
```

{% Aside %} Cookie 通知从多个来源加载资源很常见——例如，从 `www.cookie-notice.com` 和 `cdn.cookie-notice.com` 加载资源。单独的来源需要单独的连接，因此需要单独的资源提示。{% endAside %}

#### 根据情况预加载 Cookie 通知

某些站点可以获得使用 [`preload`](https://developer.mozilla.org/docs/Web/HTML/Preloading_content) 资源提示来加载 Cookie 通知脚本的好处。`preload` 资源提示可以通知浏览器尽早发起对指定资源的请求。

```html
<link rel="preload" href="https://www.cookie-notice.com/cookie-script.js">
```

在仅用于获取每个页面的几个关键资源时，`preload` 非常强大。因此，预加载 Cookie 通知脚本的作用因情况而异。

#### 设置 Cookie 通知样式时注意性能权衡

自定义第三方 Cookie 通知的界面和体验可能会增加性能成本。例如，第三方 Cookie 通知并非总是能够重复使用页面上其他位置使用的相同资源（例如，Web 字体）。此外，第三方 Cookie 通知往往会在长请求链的末尾加载样式。为了避免任何意外，请注意 Cookie 通知加载和应用样式以及相关资源的方式。

#### 避免布局偏移

下面是与 Cookie 通知相关的一些最常见布局偏移问题：

- **屏幕顶部的 Cookie 通知：**屏幕顶部的 Cookie 通知是一个导致布局偏移的常见来源。如果在周围的页面渲染后将 Cookie 通知插入 DOM 中，它会进一步将其下方的页面元素向下页面底部推动。您可以在 DOM 中为同意通知保留空间，从而消除此类布局偏移。如果此解决方案不可行——例如，如果 Cookie 通知的尺寸因地理位置而异，请考虑使用粘性页脚或模式来显示 Cookie 通知。由于这两种替代方法都会将 Cookie 通知显示为页面其余部分顶部的“叠加层”，因此 Cookie 通知在加载时不会导致内容偏移。
- **动画**：很多 Cookie 通知会使用动画——例如，“滑入”Cookie 通知是一种常见的设计模式。根据这些效果的实现方式，它们可能会导致布局偏移。有关更多信息，请参阅[调试布局偏移](/debugging-layout-shifts/)。
- **字体**：延迟加载字体可能会阻止渲染和/或导致布局偏移。这种现象在连接速度较慢时表现得更明显。

#### 高级加载优化

这些技术需要做更多的工作才能实现，但可以进一步优化 Cookie 通知脚本的加载：

- 从自己的服务器缓存和提供第三方 Cookie 通知脚本可以提高这些资源的交付速度。
- 使用[服务工作进程](https://developer.mozilla.org/docs/Web/API/Service_Worker_API/Using_Service_Workers)可以更好地控制[第三方脚本（](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#cross-origin-considerations)例如，Cookie 通知脚本）的获取和缓存。

## 性能测量

Cookie 通知可能影响性能测量。本节讨论其中部分影响和一些可减轻影响的技术。

### 真实用户监控 (RUM)

一些分析和 RUM 工具使用 Cookie 来收集性能数据。如果用户拒绝使用 Cookie，这些工具将无法获取性能数据。

网站要注意到这种现象；您还需要了解 RUM 工具收集数据的机制。不过，对于典型的站点，考虑到数据倾斜的方向和幅度，这种差异可能不是导致风险的原因。Cookie 的使用不是性能测量的技术要求。[web-vitals](https://github.com/GoogleChrome/web-vitals) JavaScript 库是不使用 Cookie 的库示例。

根据站点使用 Cookie 收集性能数据的方式（即 Cookie 是否包含个人信息）以及相关法律，使用 Cookie 进行性能测量可能不需要遵守与站点上某些用于其他目的的 Cookie（例如，广告 Cookie）相同的法律要求。一些站点会在征求用户同意时会选择将性能 Cookie 作为单独的 Cookie 类别。

### 综合监控

如果没有自定义配置，大多数综合工具（例如 Lighthouse 和 WebPageTest）将仅测量未响应 Cookie 同意通知的首次用户体验。但是，在收集性能数据时，不仅需要考虑缓存状态的变化（例如，初始访问和重复访问），还需要考虑 Cookie 接受状态（接受、拒绝或未响应）的变化。

下面几节讨论了 WebPageTest 和 Lighthouse 设置，它们有助于将 Cookie 通知融合到性能测量工作流中。但是，Cookie 和 Cookie 通知只是在实验环境下难以完美模拟的众多因素之一。因此，重要的是让 [RUM 数据](/user-centric-performance-metrics/#how-metrics-are-measured)成为性能基准测试的基础，而不是综合工具。

### 利用 WebPageTest 测试 Cookie 通知

#### 编写脚本

通过编写脚本，您可以让 [WebPageTest](https://webpagetest.org/) 在收集跟踪信息时“单击”Cookie 同意横幅。

请转到**脚本**选项卡来添加脚本。下面的脚本会导航至要测试的 URL，然后单击 ID 为 `cookieButton` 的 DOM 元素。

{% Aside 'caution' %} WebPageTest 脚本以[制表符分隔](https://github.com/WPO-Foundation/webpagetest-docs/blob/main/src/scripting.md#scripting)。{% endAside %}

```shell
combineSteps
navigate    %URL%
clickAndWait    id=cookieButton
```

使用该脚本时，请注意：

- `combineSteps` 会告诉 WebPageTest 将后续脚本步骤的结果“合并”到一组跟踪和测量中。在不使用 `combineSteps` 的情况下运行此脚本也很有用——单独的跟踪可以让您轻松查看资源是在 Cookie 接受之前还是之后加载。
- `%URL%` 遵循 WebPageTest 约定，表示正在测试的 URL。
- `clickAndWait` 会告诉 WebPageTest 单击由 `attribute=value` 表示的元素，并等待后续浏览器活动完成。它遵循 `clickAndWait attribute=Value` 格式。

如果您已正确配置此脚本，则 WebPageTest 获取的截屏不会显示 Cookie 通知（因为已接受 Cookie 通知）。

有关 WebPageTest 脚本的更多信息，请查看 [WebPageTest 文档](https://docs.webpagetest.org/scripting/)。

#### 设置 Cookie

要使用 Cookie 集运行 WebPageTest，请转到**高级**选项卡并将 Cookie 标头添加到**自定义标头**字段中：

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/qSccrAxF0H4yoSzYRYdh.png", alt="显示 WebPageTest 中的“自定义标题”字段截屏", width="800", height="181" %}

#### 更改测试位置

要更改 WebPageTest 使用的测试位置，请单击**高级测试**选项卡上的**测试位置**下拉菜单。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/J27NcDQ5LTtXYloaA1DN.png", alt="WebPageTest 中的'测试位置'下拉菜单截屏", width="800", height="267" %}

### 使用 Lighthouse 测试 Cookie 通知

在 Lighthouse 运行时设置 Cookie 可以作为一种机制，让页面进入特定状态以供 Lighthouse 进行测试。Lighthouse 的 Cookie 行为因环境（DevTools、CLI 或 PageSpeed Insights）而异。

#### DevTools

从 DevTools 运行 Lighthouse 时不会清除 Cookie。但是，默认情况下会清除其他类型的存储。使用 **Lighthouse** 设置面板中的**清除存储**选项可以更改此行为。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/nmNDeSoGEQUVKeTP7q7R.png", alt="Lighthouse“清除存储”选项的截屏", width="800", height="304" %}

#### CLI

从 CLI 运行 Lighthouse 使用会全新的 Chrome 实例，因此默认情况下不会设置 Cookie。要使用特定 Cookie 集从 CLI 运行 Lighthouse，请使用以下[命令](https://github.com/GoogleChrome/lighthouse#cli-options)：

```shell
lighthouse <url> --extra-headers "{\"Cookie\":\"cookie1=abc; cookie2=def; \_id=foo\"}"
```

有关在 Lighthouse CLI 中设置自定义请求标头的更多信息，请参阅[在经过身份验证的页面上运行 Lighthouse](https://github.com/GoogleChrome/lighthouse/blob/master/docs/authenticated-pages.md)。

#### PageSpeed Insights 网页速度测量工具

从 PageSpeed Insights 网页速度测量工具运行 Lighthouse 会使用全新的 Chrome 实例，并且不会设置任何 Cookie。无法对 PageSeed Insights 网页速度测量工具进行配置来设置特定的 Cookie。

## 用户体验

不同 Cookie 同意通知的用户体验 (UX) 主要取决于两个决策：Cookie 通知在页面中的位置，以及用户可在多大程度上自定义站点对 Cookie 的使用。本节讨论这两个决策的可能方法。

{% Aside 'caution' %} 通常，法律（具体法律可能因地域而异）会对 Cookie 通知的用户体验造成很大影响。因此，本节讨论的某些设计模式可能与特定情况无关。不能将本文视为法律建议的替代方法。{% endAside %}

考虑 Cookie 通知的可能设计时，需要注意以下几点：

- 用户体验：它的用户体验好吗？这种特殊设计会对现有页面元素和用户流造成怎样的影响？
- 业务：网站的 Cookie 策略是什么？Cookie 通知的目的是什么？
- 法律：是否符合法律要求？
- 工程：实施和维护工作量如何？改变难度如何？

### 位置

Cookie 通知可以显示为页眉、内联元素或页脚，也可以使用模式或作为[插页式广告](https://en.wikipedia.org/wiki/Interstitial_webpage)显示在页面内容的顶部。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/LLqHAhp7W6x4E3rZh0Oc.png", alt="显示 Cookie 通知不同位置选项的示例的图表", width="800", height="345" %}

#### 页眉、页脚和内联 Cookie 通知

Cookie 通知通常放置在页眉或页脚中。对于这两个选项，页脚位置通常更可取，因为它不那么引人注目，不会影响用户查看横幅广告或通知的注意力，并且通常不会导致 CLS。此外，这也是放置隐私政策和使用条款的常见位置。

尽管内联 Cookie 通知也是一种选择，但它很难集成到现有的用户界面中，因此并不常见。

#### 模式

显示在页面内容顶部的 Cookie 同意通知叫模式。模态的外观和性能因尺寸而异。

对于正在努力以不会导致[布局偏移](/cls/)的方式实施 Cookie 通知的站点，占用部分屏幕的小尺寸模式可能是一个不错的选择。

另一方面，要谨慎使用覆盖大部分页面内容的大尺寸模式。尤其是在小站点上，用户可能会退回，而不是接受内容模糊的陌生站点的 Cookie 通知。尽管不一定是同义概念，但如果您正在考虑使用全屏 Cookie 同意模式，则要了解有关 [Cookie 墙](https://techcrunch.com/2020/05/06/no-cookie-consent-walls-and-no-scrolling-isnt-consent-says-eu-data-protection-body/)的法律。

{% Aside %} 可将大型模式视为一种插页式广告。如果以符合法律规定的方式使用插页式广告（例如 Cookie 横幅），Google 搜索[不会](https://developers.google.com/search/blog/2016/08/helping-users-easily-access-content-on)施行处罚。但是，在其他情况下使用插页式广告（特别是当它们具有侵入性，或者会造成用户体验不佳时）可能会受到处罚。{% endAside %}

### 可配置能力

对于接受哪一种 Cookie，Cookie 通知界面提供了不同级别的控件。

#### 无可配置能力

这些通知样式的 Cookie 横幅不会向用户提供直接的用户体验控件来选择退出 Cookie。它们通常会包含指向站点 Cookie 策略的链接，该链接可能会为用户提供有关使用他们的 Web 浏览器管理 Cookie 的信息。这些通知通常包括“拒绝”和/或“接受”按钮。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/RlAg8DCjBC0bX7Ki5MuE.png", alt="显示没有 Cookie 可配置能力的 Cookie 通知示例的图表", width="800", height="518" %}

#### 一定的可配置能力

这些 Cookie 通知为用户提供拒绝 Cookie 的选项，但不支持更精细的控制。这种 Cookie 通知方法不太常见。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/MOl8u9NcnyjCWogxzjdz.png", alt="显示具有一定的 Cookie 可配置能力的 Cookie 通知示例的图表", width="800", height="508" %}

#### 完整可配置能力

这些 Cookie 通知为用户提供更精细的控制来配置他们接受的 Cookie 使用方法。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/QfFoqkkmdKHAYlftIH0n.png", alt="显示具有完整 Cookie 可配置能力的 Cookie 通知示例的图表", width="800", height="467" %}

- **用户体验：**用于配置 Cookie 使用方法的控件最常使用单独的模式显示，这种模式在用户响应初始 Cookie 同意通知时启动。但是，如果空间允许，某些站点将在初始 Cookie 同意通知中内联显示这些控件。

- **粒度：**实施 Cookie 可配置能力的最常见方法是允许用户按 Cookie“类别”选择接受 Cookie。常见 Cookie 类别的示例包括功能、定向和社交媒体 Cookie。

    但是，某些站点会提供更精细的控制能力，允许用户根据每个 Cookie 选择接受。或者，还有一种为用户提供更具体控制的方法，即将“广告”等 Cookie 类别划分为特定用例——例如，允许用户分别选择“基本广告”和“个性化广告”。

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/z7zFPtCkFi8GEpkfubek.png", alt="显示具有完整 Cookie 可配置能力的 Cookie 通知示例的图表", width="800", height="372" %}
