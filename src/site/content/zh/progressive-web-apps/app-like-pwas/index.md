---
layout: post
title: 让渐进式 Web 应用 (PWA) 更像应用
subhead: 让您的渐进式 Web 应用不像网站，更接近“真正的”应用
authors:
  - thomassteiner
description: 通过理解如何使用 web 技术实现平台特定的应用模式，了解如何让您的渐进式 Web 应用程序更像“真正的”应用。
date: 2020-06-15
updated: 2020-07-23
tags:
  - capabilities
---

在玩渐进式 Web 应用 (PWA) 流行语字谜游戏时，选“PWA 只是网站”是一个稳赢的选择。微软的 PWA 文档[认同](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/#progressive-web-apps-on-windows:~:text=PWAs%20are%20just%20websites)这个说法，我们在这个网站上也[这么说](/progressive-web-apps/#content:~:text=Progressive%20Web%20Apps,Websites)，甚至提出 PWA 的 Frances Berriman 和 Alex Russell 也是[这么写的](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/#post-2263:~:text=they%E2%80%99re%20just%20websites)。是的，PWA 只是网站，但它们也远不止于此。只要实现得当，PWA 不会给人网站的感觉，而是像一个“真正的”应用。那么，像真正的应用意味着什么呢？

为了回答这个问题，让我拿 Apple [Podcasts](https://support.apple.com/en-us/HT201859) 这个应用举例。它可在桌面版 macOS 和移动设备上的 iOS（还有 iPadOS）上使用。虽然 Podcasts 是媒体应用，但我在本例中阐述的核心思想也适用于其他类别的应用。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aNYiT2EkVkjNplAIKbLU.png", alt="iPhone 和 MacBook 上的 Podcasts 应用。", width="800", height="617" %}<figcaption> iPhone 和 macOS 上的 Apple Podcasts（<a href="https://support.apple.com/en-us/HT201859">来源</a>）。</figcaption></figure>

{% Aside 'caution' %}下面列出的每个 iOS/Android/桌面应用功能都提供了**如何在 web 上实现**的部分，可以打开来了解更多详细信息。请注意，并非各种操作系统上的所有浏览器都支持所有列出的 API 或功能。请务必仔细查看链接文章中的兼容性说明。 {% endAside %}

## 可离线运行

假设我们后退一步，思考下手机或台式电脑上安装的特定于平台的应用程序，那么能发现一件明显的事：永远不会看不到内容。即使是离线状态的 Podcasts 应用，也会显示一些东西。虽然没有网络，但应用程序仍会自然打开。**Top Charts** 不显示任何内容，而是展示了**现在无法连接**消息与**重试**按钮。虽然我没有受到热烈的欢迎，但依然看到了一些内容。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TMbGLQkbLROxmUMdxLET.png", alt="当没有网络连接时，Podcasts 应用显示“现在无法连接”消息。", width="800", height="440" %}<figcaption>没有网络连接时的 Podcasts 应用。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} Podcasts 应用遵循所谓的应用外壳 (app shell) 模型。显示核心应用所需的所有静态内容都缓存在本地，包括左侧菜单图标和核心播放器 UI 图标等装饰性图像。而 <b>Top Charts</b> 等动态内容的数据仅会按需加载；如果加载失败，则会显示本地缓存的后备内容。请查看<a href="https://developers.google.com/web/fundamentals/architecture/app-shell">应用外壳模型</a>一文，了解如何在您的 web 应用使用此架构模型。 {% endDetails %}

## 可使用离线内容且可播放媒体数据

离线时，我依然可以通过左侧抽屉导航到**已下载**部分并欣赏下载好的播客剧集，应用可以播放这些播客剧集并显示所有元数据（如插图和描述）。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/onUIDiaFNNHOmnwXzRh1.png", alt="Podcasts 应用下载了一集可播放的播客。", width="800", height="440" %}<figcaption>即使没有网络也可以播放下载的播客剧集。</figcaption></figure>

{% Details %} {% DetailsSummary %}如何在 web 上实现{% endDetailsSummary %} 可以从缓存提供以前下载的媒体内容，例如使用 <a href="https://developer.chrome.com/docs/workbox/">Workbox</a> 库中的<a href="https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/">提供缓存的音频和视频</a>方法。其他内容可以随时存储在缓存或 IndexedDB 中。请查阅 <a href="/storage-for-the-web/">Web 存储</a>一文了解所有详细信息，以及何时使用何种存储技术。如果您的数据需要持久存储，不想在可用内存变低时被清除，则可以使用 <a href="/persistent-storage/">Persistent Storage API</a> 。 {% endDetails %}

## 后台主动下载

当我重新上线时，当然可以使用诸如 `http 203` 之类的查询来搜索内容，当我决定订阅搜索结果 [HTTP 203 播客时](/podcasts/)，会自动下载该系列的最新一集。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WbCk4nPpBS3zwkPVRGuo.png", alt="订阅后立即下载播客最新一集的 Podcasts 应用。", width="800", height="658" %}<figcaption>订阅播客后，会立即下载最新的剧集。</figcaption></figure>

{% Details %} {% DetailsSummary %}如何在 web 上实现{% endDetailsSummary %} 下载播客剧集这项操作可能需要更长时间。您可以通过 <a href="https://developers.google.com/web/updates/2018/12/background-fetch">Background Fetch API</a> 将下载委托给浏览器后台处理。在 Android 上，浏览器甚至可以将这些下载进一步委托给操作系统，因此不需要持续运行浏览器。下载完成后，应用的服务工作进程将被唤醒，您可以决定如何处理响应。 {% endDetails %}

## 与其他应用共享和交互

Podcasts 应用会自然地与其他应用集成。例如当我右键单击喜欢的剧集时，可以把它分享给设备上的其他程序，比如 Messages 应用。它还自然地与系统剪贴板集成。我可以右键单击任何剧集并复制它的链接。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gKeFGOAZ2muuYeDNFbBW.png", alt="通过选择 Share Episode &gt; Messages，在 Podcasts 应用的上下文菜中调用了剧集。", width="800", height=" 392"%}<figcaption>将播客剧集分享给 Messages 应用。</figcaption></figure>

{% Details %} {% DetailsSummary %}如何在 web 上实现{% endDetailsSummary %} 您可以使用 <a href="/web-share/">Web Share API</a> 和 <a href="/web-share-target/">Web Share Target API</a> 将您的应用与设备上的其他应用分享和接收文本、文件和链接。尽管 Web 应用尚无法将菜单项添加到操作系统的内置右键单击菜单中，但仍有许多其他方法可以与设备的其他应用共享链接。通过 <a href="/image-support-for-async-clipboard/">Async Clipboard API</a> ，您可以以编程方式将文本和图像数据（PNG 图像）读写到系统剪贴板。在 Android 上，您可以使用 <a href="/contact-picker/">Contact Picker API</a> 从设备的联系人管理器中选择联系人。如果您同时提供平台特定应用和 PWA，那么可以使用 <a href="/get-installed-related-apps/">Get Installed Related Apps API</a> 来检查是否安装了平台特定应用；在这种情况下，您不需要鼓励用户安装 PWA 或接受网络推送通知。 {% endDetails %}

## 后台应用刷新

我可以在 Podcasts 应用的设置中配置为自动下载新剧集。这样更新内容会随时自动下载。真神奇。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iTKgVVjX0EM0RQS3ap4X.png", alt="Podcasts 应用的设置菜单中的”常规“区，”刷新播客“选项设为”每小时“", width="800", height="465" %} <figcaption>Podcasts 设置为每小时检查一次新博客。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} <a href="/periodic-background-sync/">Periodic Background Sync API</a> 可以让应用在后台定期刷新内容，而无需运行。这意味着可以主动提供新内容，使用户可以在需要时随时畅享。 {% endDetails %}

## 通过云同步状态

同时，我的订阅会在所有设备上同步。这是一个无缝的世界，我不必手动同步播客订阅。同样，我也不必担心移动设备的内存会被已经在桌面上听过的剧集占用，反之亦然。播放状态会保持同步，并会自动删除已收听的剧集。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uVJJ40Zxi5jx1AP1jd9U.png", alt="Podcasts 应用设置菜单中的“高级”部分，“跨设备同步订阅”选项已激活。", width="800", height="525" %}<figcaption>状态通过云同步。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现{% endDetailsSummary %} 同步应用状态数据可以交给 <a href="https://developers.google.com/web/updates/2015/12/background-sync">Background Sync API</a>。不必立刻开始同步操作，只是时间<em>早晚</em>问题，甚至可能在用户已经再次关闭应用时发生。 {% endDetails %}

## 硬件媒体键控制

当我在使用其他应用，比如在 Chrome 浏览器中阅读新闻页面时，仍然可以使用笔记本电脑上的媒体键控制 Podcasts 应用。无需为了跳转剧集就切换到其他应用。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TqRtzNtfhahjX93hI1P6.png", alt="带注释媒体控制键的 Apple MacBook Pro Magic Keyboard。", width="800", height="406" %}<figcaption>可以用媒体键控制 Podcasts 应用（<a href="https://support.apple.com/guide/macbook-pro/magic-keyboard-apdd0116a6a2/mac">来源</a>）。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} <a href="/media-session/">Media Session API</a> 支持媒体键。这样用户就可以通过物理键盘、耳机上的硬件媒体键，甚至是智能手表上的软件媒体键来控制 web 应用。平滑搜寻操作的另一个方法是在用户搜索内容的重要部分时（比如通过开场字幕或章节边界）发送<a href="https://developer.mozilla.org/docs/Web/API/Vibration_API">振动模式</a>。 {% endDetails %}

## 多任务处理和应用快捷方式

当然，我随时可以从任何地方通过多任务处理回到 Podcasts 应用。Podcasts 有一个清晰可辨的图标，可以放在桌面或应用程序坞，从而可以根据需要随时启动该应用。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l5EzElV5BGweYXLAqF4u.png", alt="macOS 任务切换器上有许多应用图标可供选择，其中一个就是 Podcasts。", width="800", height="630" %}<figcaption>通过多任务处理回到 Podcasts 应用。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} 桌面和移动设备上的 PWA 可以安装到主屏幕、开始菜单或应用程序坞。安装可以基于主动提示进行，也可以完全由应用开发人员控制。<a href="/install-criteria/">《需要什么才能安装？》</a>一文涵盖您需要了解的所有内容。在进行多任务处理时，PWA 看起来独立于浏览器。 {% endDetails %}

## 上下文菜单中的快速操作

最常见的应用操作，比如**搜索**新内容和**检查新剧集**，可以直接从应用程序坞中应用的上下文菜单中调用。通过**选项**菜单，我还可以设置是否在登录时打开应用。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SnA6Thz5xaopuTWRzWgQ.png", alt="显示“搜索”和“检查新剧集”选项的 Podcasts 应用图标上下文菜单。", width="534", height="736" %}<figcaption>可以直接从应用图标立即使用快速操作。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现{% endDetailsSummary %}通过在 PWA 的 web 应用清单中指定<a href="/app-shortcuts/">应用图标快捷方式</a>，您可以注册用户可以直接从应用图标访问的常见任务的快速路线。在 macOS 等操作系统上，用户还可以右键单击应用图标并将应用设置为登录时启动。 关于<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/RunOnLogin/Explainer.md">登录时运行</a>的提案正在讨论中。 {% endDetails %}

## 用作默认应用

其他 iOS 应用甚至网站或电子邮件都可以通过利用 `podcasts://` URL 方案与 Podcasts 应用集成。假设我在浏览器中点击 [`podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903`](podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903) 这样的链接，就会直接进入 Podcasts 应用来订阅或收听播客。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/x8mjOWiMO4CVigvtV8Kg.png", alt="Chrome 浏览器显示确认对话框，询问用户是否要打开 Podcasts 应用。", width="800", height="492" %}<figcaption>Podcasts 应用可以直接从浏览器打开。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} 现在尚无法处理完全自定义 URL 的方案，但我们目前正在为 PWA 的 <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md">URL 协议处理</a>提案努力。目前带有 <code>web+</code> 的 <a href="https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a> 是最好的选择。 {% endDetails %}

## 本地文件系统集成

您可能不会立即想到，但 Podcasts 应用自然而然地与本地文件系统集成。下载播客剧集时，它会被下载到电脑的 `~/Library/Group Containers/243LU875E5.groups.com.apple.podcasts/Library/Cache` 。与 `~/Documents` 不同，这个目录当然不是普通用户可以直接访问的，但它就在那里。[离线内容](#offline-content-available-and-media-playable)部分引用了文件以外的其他存储机制。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Og60tp5kB9lVZsi3Prdt.png", alt="macOS Finder 导航到 Podcasts 应用的系统目录。", width="800", height="337" %}<figcaption>播客剧集存储在特殊的系统应用文件夹中。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} <a href="/file-system-access/">File System Access API</a> 使开发人员能够访问设备的本地文件系统。您可以直接使用它或通过 <a href="https://github.com/GoogleChromeLabs/browser-fs-access">browser-fs-access</a> 支持库使用。这个库为不支持 API 的浏览器提供回退。出于安全原因，系统目录不可通过网络访问。 {% endDetails %}

## 平台外观

对于像 Podcasts 这样的 iOS 应用，还有一个更微妙的事情是不言而喻的：文本标签都不可选的，所有文本都与机器的系统字体融合在一起。我对系统颜色主题（深色模式）的选择也得到了保留。

<div class="switcher">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OAppP9uGUje6CkS7cKcZh.png", alt="深色模式下的 Podcasts 应用。", width="800", height="463" %}<figcaption>Podcasts 应用支持浅色与深色模式。</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cnVihfFR2anSBlIVfCSW.png", alt="浅色模式下的 Podcasts 应用。", width="800", height="463" %}<figcaption>该应用程序使用默认系统字体。</figcaption></figure>
</div>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} 通过将 <a href="https://developer.mozilla.org/docs/Web/CSS/user-select"><code>user-select</code></a> CSS 属性的值设为 <a href="https://developer.mozilla.org/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>none</code></a>，您可以防止 UI 元素被意外选择。但是，请确保不要滥用此属性，从而导致无法选择<em>应用内容</em>。只应把它应用于按钮文本等 UI 元素。将 <a href="https://developer.mozilla.org/docs/Web/CSS/font-family"><code>font-family</code></a> CSS 属性的值设为 <a href="https://developer.mozilla.org/docs/Web/CSS/font-family#&lt;generic-name&gt;:~:text=system%2Dui,-Glyphs"><code>system-ui</code></a> 可以让您的应用使用系统默认 UI 字体。最后，您的应用可以通过尊重用户的 <a href="/prefers-color-scheme/"><code>prefers-color-scheme</code></a> 选择来遵守用户的配色方案偏好，并使用可选的<a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">深色模式切换</a>来覆盖它。另一个需要决定的事情可能是浏览器在到达滚动区域的边界时应该采取何种操作，例如，实现自定义 <em>pull to refresh</em> 。这可以通过<a href="https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior"><code>overscroll-behavior</code></a> CSS 属性实现。 {% endDetails %}

## 自定义标题栏

查看 Podcasts 应用窗口时，您会注意到它没有经典的集成标题栏和工具栏（例如 Safari 浏览器窗口），而是采用了一种自定义外观，看起来像停靠在主播放器窗口的侧边栏。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cB7G2e31JXU71EfvhG3i.png", alt="Safari 浏览器的集成图块栏和工具栏。", width="800", height="40" %}<figcaption></figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mFvLbyQ90wsDPQ9l86s3.png", alt="Podcasts 应用的自定义拆分自定义标题栏。", width="800", height="43" %}<figcaption> Safari 和 Podcasts 的自定义标题栏。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} 虽然目前无法实现，但我们正在研究<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/TitleBarCustomization/explainer.md">标题栏自定义</a>。不过，您可以（并且应该）指定 <a href="/add-manifest/#display"><code>display</code></a> 和 <a href="/add-manifest/#theme-color"><code>theme-color</code></a> 属性，以确定应用窗口的外观，并决定应该显示哪些默认浏览器控件（可能都不显示）。 {% endDetails %}

## 生动的动画

Podcasts 中的动画生动流畅。例如，当我打开右侧的**剧集笔记**抽屉时，它会优雅地滑入。当我从下载中删除一集时，剩余的剧集会漂浮起来并占用被删除的剧集释放的屏幕空间。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ucob9t4Ga3jMK20RVvSD.png", alt="展开“剧集笔记”抽屉的 Podcasts 应用。", width="800", height="463" %}<figcaption>应用内动画（例如打开抽屉时）非常生动流畅。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} 如果考虑到<a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">动画和性能</a>一文中概述的许多最佳实践，网络上的高性能动画当然是可能的。使用 <a href="https://developers.google.com/web/updates/2018/07/css-scroll-snap">CSS Scroll Snap</a> 功能可以大幅改进分页内容或媒体轮播中常见的滚动动画。为了实现全面控制，您可以使用 <a href="https://developer.mozilla.org/docs/Web/API/Web_Animations_API">Web Animations API</a> 。 {% endDetails %}

## 在应用之外浮现的内容

iOS 上的 Podcasts 应用可以在应用之外的其他位置显示内容，例如，在系统的小组件视图中，或以 Siri 建议的形式。拥有主动的、基于使用情况的调用操作，只需点击即可与之交互，可以大大提高 Podcasts 等应用程序的再参与率。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w8zhRHcKzRfgjXZu7y4h.png", alt="iOS 小组件视图显示 Podcasts 应用建议的播客新剧集。", width="751", height="1511" %}<figcaption>应用内容显示在主 Podcasts 应用之外。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} <a href="/content-indexing-api/">Content Index API</a> 可以让应用告诉浏览器可离线使用 PWA 的哪些内容。这样一来，浏览器就可以在主应用之外显示此内容。通过将应用中有趣的内容标记为适合<a href="https://developers.google.com/search/docs/data-types/speakable">朗读</a>音频播放并使用一般<a href="https://developers.google.com/search/docs/guides/search-gallery">结构化标记</a>，您可以让搜索引擎和虚拟助手（如 Google 智能助理）以理想的方式呈现您的产品。 {% endDetails %}

## 锁屏媒体控制小组件

播放播客剧集时，Podcasts 应用会在锁屏界面显示一个漂亮的控制小组件，其中包含剧集插图、剧集标题和播客名称等元数据。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Lr9R2zpjDEgHtyJ7hjHf.png", alt="iOS 锁屏界面上的媒体播放小组件显示了具有丰富元数据的播客剧集。", width="751", height="1511" %}<figcaption>可以从锁屏界面控制应用中的媒体播放。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} 您可以通过 <a href="/media-session/">Media Session API</a> 指定插图、曲目标题等元数据，然后显示在锁屏界面、智能手表或浏览器中的其他媒体小组件上 {% endDetails %}

## 推送通知

推送通知现在已经成了网上的烦恼（尽管[通知提示现在安静了很多](https://blog.chromium.org/2020/01/introducing-quieter-permission-ui-for.html)）。但如果使用得当，它们可以增加很多价值。例如，iOS Podcasts 应用可以选择性地通知我订阅的播客的新剧集或推荐新的播客，以及提醒新的应用功能。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IFnNRo6BnHL6BxDmiqF7.png", alt="“通知”设置屏幕中的 iOS Podcasts 应用显示“新剧集”通知已激活。", width="751", height="1511 "%}<figcaption>应用可以通过推送通知向用户告知新内容。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %}您可以使用 <a href="https://developers.google.com/web/fundamentals/push-notifications">Push API</a> 允许应用接收推送通知，从而通知用户有关 PWA 的重要事件。对于应该在未来已知时间触发且不需要网络连接的通知，您可以使用 <a href="/notification-triggers/">Notification Triggers API</a>。 {% endDetails %}

## 应用图标标记

当我订阅的播客推出了新剧集时，Podcasts 主屏幕图标上的应用图标标记就会出现，再次鼓励我以不打扰的方式重新使用该应用。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3smO2sJz5oMwy4RYpQoF.png", alt="iOS 设置屏幕显示“标记”切换已激活。", width="751", height="1511" %}<figcaption>标记是应用通知用户新内容的一种不起眼的方式。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %}您可以使用 <a href="/badging-api/">Badging API</a> 设置应用图标标记。当您的 PWA 有一些“未读”项目的概念时，或者当您需要不引人注意地将用户的注意力吸引回应用时，这尤其有用。 {% endDetails %}

## 媒体播放优先于节能设置

播放播客媒体时，屏幕可能会关闭，但系统不会进入待机模式。应用也可以选择让屏幕保持唤醒状态，例如显示歌词或字幕。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CRkipfmdkLJrND83qvQw.png", alt="macOS 的'节能'的首选项。", width="800", height="573" %}<figcaption>应用可以使屏幕保持唤醒状态。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} <a href="/wakelock/">Screen Wake Lock API</a> 可防止屏幕关闭。Web 上的媒体播放会自动阻止系统进入待机模式。 {% endDetails %}

## 通过应用商店发现应用

虽然 Podcasts 应用是 macOS 桌面系统内置的软件，但在 iOS 上，它需要从 App Store 安装。快速搜索 `podcast` 、`podcasts` 或 `apple podcasts` 可立即在 App Store 中打开该应用。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZLr5quaQWA9VJGAHNrLd.png", alt="在 iOS App Store 搜索“podcasts”会显示 Podcasts 应用。", width="751", height="1511" %}<figcaption>用户已经学会了在应用商店中发现应用。</figcaption></figure>

{% Details %} {% DetailsSummary %} 如何在 web 上实现 {% endDetailsSummary %} 虽然 Apple 不允许在 App Store 上使用 PWA，但在 Android 上，您可以提交<a href="/using-a-pwa-in-your-android-app/">使用 Trusted Web Activity 封装</a>的 PWA。通过 <a href="https://github.com/GoogleChromeLabs/bubblewrap"><code>bubblewrap</code></a> 脚本，封装操作非常方便。此脚本也支持 <a href="https://www.pwabuilder.com/">PWABuilder</a> 的 Android 应用导出功能，您无需用到命令行即可使用该功能。 {% endDetails %}

## 功能概要

下表显示了所有功能的简要概述，并提供了在 Web 上实现这些功能的实用资源列表。

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>功能</th>
        <th>在 web 上实现的实用资源</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="#capable-of-running-offline">可离线运行</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/architecture/app-shell">应用外壳模型</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#offline-content-available-and-media-playable">可使用离线内容且可播放媒体数据</a></td>
        <td>
          <ul>
            <li><a href="https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/">提供缓存的音频和视频</a></li>
            <li><a href="https://developer.chrome.com/docs/workbox/">Workbox 库</a></li>
            <li><a href="/storage-for-the-web/">Storage API</a></li>
            <li><a href="/persistent-storage/">Persistent Storage API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#proactive-background-downloading">后台主动下载</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/updates/2018/12/background-fetch">Background Fetch API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#sharing-to-and-interacting-with-other-applications">与其他应用程序共享并与之交互</a></td>
        <td>
          <ul>
            <li><a href="/web-share/">Web Share API</a></li>
            <li><a href="/web-share-target/">Web Share Target API</a></li>
            <li><a href="/image-support-for-async-clipboard/">Async Clipboard API</a></li>
            <li><a href="/contact-picker/">Contact Picker API</a></li>
            <li><a href="/get-installed-related-apps/">Get Installed Related Apps API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#background-app-refreshing">后台应用刷新</a></td>
        <td>
          <ul>
            <li><a href="/periodic-background-sync/">Periodic Background Sync API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#state-synchronized-over-the-cloud">通过云同步状态</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/updates/2015/12/background-sync">Background Sync API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#hardware-media-key-controls">硬件媒体键控制</a></td>
        <td>
          <ul>
            <li><a href="/media-session/">Media Session API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#multitasking-and-app-shortcut">多任务处理和应用快捷方式</a></td>
        <td>
          <ul>
            <li><a href="/install-criteria/">可安装性标准</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#quick-actions-in-context-menu">上下文菜单中的快速操作</a></td>
        <td>
          <ul>
            <li><a href="/app-shortcuts/">应用图标快捷方式</a></li>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/tree/master/RunOnLogin">登录时运行</a>（早期）</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#act-as-default-app">用作默认应用</a></td>
        <td>
          <ul>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md">URL 协议处理</a>（早期）</li>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#local-file-system-integration">本地文件系统集成</a></td>
        <td>
          <ul>
            <li><a href="/file-system-access/">File System Access API</a></li>
            <li><a href="https://github.com/GoogleChromeLabs/browser-fs-access">browser-fs-access 库</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#platform-look-and-feel">平台外观</a></td>
        <td>
          <ul>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>user-select: none</code></a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/CSS/font-family"><code>font-family: system-ui</code></a>
            </li>
            <li>
              <a href="/prefers-color-scheme/"><code>prefers-color-scheme</code></a>
            </li>
            <li><a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">深色模式切换</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#customized-title-bar">自定义标题栏</a></td>
        <td>
          <ul>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/TitleBarCustomization/explainer.md">标题栏定制</a>（前期）</li>
            <li><a href="/add-manifest/#display">显示模式</a></li>
            <li><a href="/add-manifest/#theme-color">主题颜色</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#snappy-animations">生动的动画</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">动画和性能技巧</a></li>
            <li><a href="https://developers.google.com/web/updates/2018/07/css-scroll-snap">CSS Scroll Snap</a></li>
            <li><a href="https://developer.mozilla.org/docs/Web/API/Web_Animations_API">Web Animations API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#content-surfaced-outside-of-app">在应用之外浮现的内容</a></td>
        <td>
          <ul>
            <li><a href="/content-indexing-api/">Content Index API</a></li>
            <li><a href="https://developers.google.com/search/docs/data-types/speakable">可读出的内容</a></li>
            <li><a href="https://developers.google.com/search/docs/guides/search-gallery">结构化标记</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#lock-screen-media-control-widget">锁屏媒体控制小组件</a></td>
        <td>
          <ul>
            <li><a href="/media-session/">Media Session API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#push-notifications">推送通知</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/push-notifications">Push API</a></li>
            <li><a href="/notification-triggers/">Notification Triggers API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#app-icon-badging">应用图标标记</a></td>
        <td>
          <ul>
            <li><a href="/badging-api/">Badging API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#media-playback-takes-precedence-over-energy-saver-settings">媒体播放优先于节能设置</a></td>
        <td>
          <ul>
            <li><a href="/wakelock/">Screen Wake Lock API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#app-discovery-through-an-app-store">通过应用商店发现应用</a></td>
        <td>
          <ul>
            <li><a href="/using-a-pwa-in-your-android-app/">Trusted Web Activity</a></li>
            <li><a href="https://github.com/GoogleChromeLabs/bubblewrap"><code>bubblewrap</code>库</a></li>
            <li><a href="https://www.pwabuilder.com/">PWABuilder 工具</a></li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## 结论

自 2015 年推出以来，PWA 已经取得了长足的进步。在 [Fugu 计划🐡](https://developer.chrome.com/blog/fugu-status)的背景下，跨公司的 Chromium 团队正在努力缩小最后剩余的差距。通过遵循本文中的一些建议，您可以一点一点地接近那种类似应用的感觉，让用户忘记他们正在处理“只是一个网站”，因为老实说，大多数用户并不关心应用的构建方式（以及构建原因），只要它感觉像一个*真正的*应用就可以了。

## 鸣谢

本文由 [Kayce Basques](/authors/kaycebasques/) 、[Joe Medley](/authors/joemedley/) 、[Joshua Bell](https://github.com/inexorabletash) 、[Dion Almaer](https://blog.almaer.com/) 、[Ade Oshineye](https://blog.oshineye.com/) 、[Pete LePage](/authors/petelepage/) 、[Sam Thorogood](/authors/samthor/) 、[Reilly Grant](https://github.com/reillyeon) 和 [Jeffrey Yasskin](https://github.com/jyasskin) 共同审阅。
