---
layout: post
title: 跨域隔离的启用指南
authors:
  - agektmr
date: 2021-02-09
updated: 2021-08-05
subhead: 跨域隔离使网页能够使用例如 SharedArrayBuffer 等强大功能。本篇文章解释了如何在您的网站上启用跨域隔离。
description: 跨域隔离使网页能够使用例如 SharedArrayBuffer 等强大功能。本篇文章解释了如何在您的网站上启用跨域隔离。
tags:
  - security
---

本篇指南将向您展示跨域隔离的启用方式。如果您想使用[`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)、[`performance.measureUserAgentSpecificMemory()`](/monitor-total-page-memory-usage/)或 [更精确的高精度计时器](https://developer.chrome.com/blog/cross-origin-isolated-hr-timers/)，就会需要跨域隔离。

如果您打算启用跨域隔离，请评估这对您网站上的其他跨域资源（例如广告展示位置）将产生的影响。

{% Details %} {% DetailsSummary %} 确定您网站中`SharedArrayBuffer`的使用位置

从 Chrome 92 开始，使用`SharedArrayBuffer`的功能在没有跨域隔离的情况下将停止工作。如果您是因为收到`SharedArrayBuffer`已弃用的消息而造访此页面，那么很可能是因为您的网站或其中嵌入的某项资源正在使用`SharedArrayBuffer`。为确保您的网站不会因弃用而中断，请首先确定`SharedArrayBuffer`的使用位置。

{% endDetailsSummary %}

{% Aside 'objective' %}

- 开启跨域隔离来继续使用`SharedArrayBuffer`。
- 如果您依赖使用`SharedArrayBuffer`的第三方代码，请通知第三方提供商采取相应措施。{% endAside %}

如果您不确定您网站中`SharedArrayBuffer`的使用位置，有两种方法可以找到：

- 使用 Chrome 开发者工具
- （进阶）使用弃用报告

如果您已经知道`SharedArrayBuffer`的使用位置，请跳至[分析跨域隔离的影响](#analysis)。

### 使用 Chrome 开发者工具

[Chrome 开发者工具](https://developer.chrome.com/docs/devtools/open/)允许开发者对网站进行检查。

1. 在您怀疑可能正在使用`SharedArrayBuffer`的页面上[打开 Chrome 开发者工具](https://developer.chrome.com/docs/devtools/open/)。
2. 选择**控制台**面板。
3. 如果该页面正在使用`SharedArrayBuffer`，则会显示以下消息：
    ```text
    [Deprecation] SharedArrayBuffer will require cross-origin isolation as of M92, around May 2021. See https://developer.chrome.com/blog/enabling-shared-array-buffer/ for more details. common-bundle.js:535
    ```
4. 消息末尾的文件名和行号（例如，`common-bundle.js:535`）表明`SharedArrayBuffer`的来源。如果来源是第三方库，请联系开发者解决问题。如果是作为您网站的一部分来执行的，请按照以下指南启用跨域隔离。

<figure>
{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/GOgkyjAabePTc8AG22F7.png", alt="在没有跨域隔离的情况下使用 SharedArrayBuffer 时，开发者工具控制台发出警告", width="800", height="163"  %}
<figcaption>在没有跨域隔离的情况下使用 SharedArrayBuffer 时，开发者工具控制台发出警告。</figcaption>
</figure>

### （进阶）使用弃用报告

某些浏览器有向指定端点[报告已弃用 API 的功能](https://wicg.github.io/deprecation-reporting/)。

1. [设置弃用报告服务器并获取报告 URL](/coop-coep/#set-up-reporting-endpoint)。您可以通过使用公共服务或自己进行搭建来实现这一目标。
2. 使用 URL，对可能正在提供`SharedArrayBuffer`的页面设置以下 HTTP 标头。
    ```http
    Report-To: {"group":"default","max_age":86400,"endpoints":[{"url":"THE_DEPRECATION_ENDPOINT_URL"}]}
    ```
3. 一旦标头开始传播，您注册的端点就应该能够开始收集弃用报告。

请在此处查看执行示例：[https://cross-origin-isolation.glitch.me](https://cross-origin-isolation.glitch.me)。

{% endDetails %}

## 分析跨域隔离的影响 {:#analysis}

如果能在不进行任何破坏的情况下就可以评估启用跨域隔离对您的网站的影响，那该多好啊？[`Cross-Origin-Opener-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)和[`Cross-Origin-Embedder-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) HTTP 标头恰恰能帮助您实现这一愿望。

1. 在您的顶级文档上设置[`Cross-Origin-Opener-Policy-Report-Only: same-origin`](/coop-coep/#1.-set-the-cross-origin-opener-policy:-same-origin-header-on-the-top-level-document)。正如标头名称所示，该标头只发送有关`COOP: same-origin`**将会**对您网站产生的影响的报告，而不会实际弹出窗口来禁止通信。
2. 设置报告内容并配置一个网络服务器来接收和保存报告。
3. 在顶级文档上设置[`Cross-Origin-Embedder-Policy-Report-Only: require-corp`](/coop-coep/#3.-use-the-coep-report-only-http-header-to-assess-embedded-resources)。与之前一样，该标头能够让您看到启用`COEP: require-corp`后的影响，而不会实际影响您的网站功能。您可以配置该标头，将报告发送到您在上一步中设置的同一个报告服务器。

{% Aside %}您也可以在 Chrome 开发者工具的**网络**面板中[启用**域**列](https://developer.chrome.com/docs/devtools/network/#information)，从而对哪些资源会受到影响形成总体的概念。{% endAside %}

{% Aside 'caution' %}

启用跨域隔离将阻止您未明确选择加入的跨域资源进行加载，并且会阻止您的顶级文档与弹出窗口进行通信。

由于跨域隔离要求所有子资源明确选择加入，所以我们一直在探索大规模部署`Cross-Origin-Resource-Policy`的方法。我们提出了相反方向的想法：[一种新的 COEP "无凭据"模式](https://github.com/mikewest/credentiallessness/)，允许通过剥离所有资源凭据来加载没有 CORP 标头的资源。我们正在研究该模式运作方式的具体细节，但我们希望这个模式能在确保子资源发送`Cross-Origin-Resource-Policy`标头方面为您减轻负担。

此外，众所周知`Cross-Origin-Opener-Policy: same-origin`标头会破坏需要跨域窗口交互（例如 OAuth 和支付）的集成。为了缓解这个问题，我们正在探索通过[放宽条件](https://github.com/whatwg/html/issues/6364)来为`Cross-Origin-Opener-Policy: same-origin-allow-popups`启用跨域隔离。这样就可以让该标头与其打开的窗口进行通信。

如果您想启用跨域隔离，却面临这些挑战的阻碍，那么我们建议您[注册一个原始试验](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial)，同时等待可用的新模式。在这些新模式可用之前，我们不打算终止原始试验。

{% endAside %}

## 减轻跨域隔离的影响

在确定哪些资源将受到跨域隔离的影响后，以下是有关如何实际让这些跨域资源选择加入的一般准则：

1. 在图像、脚本、样式表、iframe 等跨域资源上设置[`Cross-Origin-Resource-Policy: cross-origin`](https://resourcepolicy.fyi/#cross-origin)标头。在同站资源上设置[`Cross-Origin-Resource-Policy: same-site`](https://resourcepolicy.fyi/#same-origin)标头。
2. 如果资源是用 [CORS](/cross-origin-resource-sharing/)（例如，`<img src="example.jpg" crossorigin>`）提供的，那么请在顶级文档的 HTML 标签中设置`crossorigin`。
3. 如果加载到 iframe 中的跨域资源涉及另一层 iframe，则在进行下一步之前递归地运用本节中描述的步骤。
4. 在您确认所有跨域资源都已选择加入后，请在加载到 iframe 中的跨域资源上设置`Cross-Origin-Embedder-Policy: require-corp`标头。
5. 请确保没有需要通过`postMessage()`进行通信的跨域弹出窗口。这些弹出窗口无法在启用跨域隔离时继续运行。您可以将通信移动到另一个非跨域隔离文档中，或使用一种不同的通信方法（例如，HTTP 请求）。

## 启用跨域隔离

在减轻跨域隔离的影响后，以下是启用跨域隔离的一般准则：

1. 在顶级文档上设置`Cross-Origin-Opener-Policy: same-origin`标头。如果您之前已经设置了`Cross-Origin-Opener-Policy-Report-Only: same-origin`，请将其替换。这会阻止顶级文档与其弹出窗口之间的通信。
2. 在顶级文档上设置`Cross-Origin-Embedder-Policy: require-corp`标头。如果您之前已经设置了`Cross-Origin-Embedder-Policy-Report-Only: require-corp`，请将其替换。这会阻止未选择加入的跨域资源进行加载。
3. 检查并确认`self.crossOriginIsolated`在控制台中返回`true`，从而验证您的页面已启用跨域隔离。

{% Aside 'gotchas' %}

在本地服务器上启用跨域隔离可能非常麻烦，因为轻量服务器不支持发送标头。您可以使用命令行标志`--enable-features=SharedArrayBuffer`启动 Chrome，从而在不启用跨域隔离的情况下启用`SharedArrayBuffer`。了解[如何使用命令行标志在各个平台上运行 Chrome](https://www.chromium.org/developers/how-tos/run-chromium-with-flags)。

{% endAside %}

## 资源

- [使用 COOP 和 COEP 将您的网站"跨域隔离"](/coop-coep/)
- [安卓 Chrome 88 和桌面 Chrome 92 中的 SharedArrayBuffer 更新](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
