---
layout: post
title: 修复混合内容
authors:
  - johyphenel
  - rachelandrew
date: 2019-09-07
updated: 2020-09-23
description: |2-

  了解如何修复您网站上的混合内容错误，
  从而保护用户并确保您的所有内容都能加载。
tags:
  - security
  - network
  - privacy
  - html
  - css
  - javascript
  - images
  - media
---

让您的网站支持 HTTPS 是保护您的网站和用户免受攻击的一项重要举措，但混合内容会使这种保护失效。如[什么是混合内容？](/what-is-mixed-content)中所述，浏览器会阻止危险性日益提高的混合内容

在本指南中，我们将演示用于修复现有混合内容问题并防止新问题发生的技术和工具。

## 通过访问您的网站查找混合内容

在 Google Chrome 中访问 HTTPS 网页时，浏览器会在 JavaScript 控制台中以错误和警告的形式提醒您存在混合内容。

在[什么是混合内容？](/what-is-mixed-content)中，您可以找到许多示例，并了解 Chrome DevTools 如何报告问题。

[被动混合内容](https://passive-mixed-content.glitch.me/)的示例将给出以下警告。如果浏览器能够在`https` URL 找到被动混合内容，会自动将其升级，然后显示一条消息。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Y7b4EWAbSL6BgI07FdQq.jpg", alt="Chrome DevTools 在检测到和升级混合内容时显示的警告", width="800", height="294" %}</figure>

浏览器会阻止[主动混合内容](https://active-mixed-content.glitch.me/)并显示一条警告。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KafrfEz1adCP2eUHQEWy.jpg", alt="Chrome DevTools 在主动混合内容被阻止时显示的警告", width="800", height="304" %}</figure>

如果在您的网站上发现 `http://` URL 出现此类警告，则需要在网站的源代码中修复这些警告。将这些 URL 及其所在的网页编制列表，会有助于修复时使用。

{% Aside %}混合内容错误和警告只显示在您当前查看的网页上，每次导航到新网页时，JavaScript 控制台都会清空内容。这意味着您必须逐个查看网站的每个网页才能找到这些错误。{% endAside %}

### 查找网站中的混合内容

您可以直接在源代码中搜索混合内容。在源代码中搜索 `http://` 并查找包含 HTTP URL 属性的标签。请注意，锚标签 (`<a>`) 的 `href` 属性中包含 `http://` 通常不是混合内容问题，稍后将讨论一些值得注意的例外情况。

如果您的网站是使用内容管理系统发布的，则发布网页时可能会插入指向不安全 URL 的链接。例如，图像可能包含一个完整的 URL 而不是一个相对路径。您需要在 CMS 内容中找到并修复这些问题。

### 修复混合内容

在您的网站源代码中发现混合内容后，您可以按照以下步骤进行修复。

如果您收到一条控制台消息，表明资源请求已自动从 HTTP 升级到 HTTPS，您可以安全地将代码中资源的 `http://` URL 更改为 `https://`。您还可以通过在浏览器 URL 栏中将 `http://` 更改为 `https://` 并尝试在浏览器选项卡中打开 URL 来检查资源是否安全可用。

如果无法通过 `https://` 获得资源，您应该考虑以下方法之一：

- 添加来自不同主机的资源（如果有）。
- 如果法律允许，直接下载并托管网站上的内容。
- 将资源完全从您的网站中移除。

解决问题后，查看最初发现错误的网页并确认错误是否不再出现。

### 注意非标准标签的使用

注意您网站上对非标准标签的使用。例如，锚 (`<a>`) 标签 URL 不会导致混合内容错误，因为它们会使浏览器导航到新网页。这意味着它们通常不需要修复。然而，一些图像库脚本会覆盖 `<a>` 标签的功能，并将 `href` 属性指定的 HTTP 资源加载到网页上的灯箱显示中，从而导致发生混合内容问题。

## 批量处理混合内容

上述手动操作适合较小的网站；但是对于大型网站或拥有许多独立开发团队的网站来说，很难跟踪所有加载的内容。为了完成此任务，您可以使用内容安全策略来指示浏览器通知您混合内容的存在，并确保您的网页永远不会意外加载不安全的资源。

### 内容安全策略

[内容安全策略](/csp/) (CSP) 是一种多用途浏览器功能，可用于批量管理混合内容。CSP 报告机制可用于跟踪您网站上的混合内容，并提供执行策略，通过升级或阻止混合内容来保护用户。

您可以通过在服务器发送的响应中加入 `Content-Security-Policy` 或 `Content-Security-Policy-Report-Only` 标头来为网页启用这些功能。此外，您还可以使用网页 `<head>` 部分的 `<meta>` 标签来设置 `Content-Security-Policy`（**不是** `Content-Security-Policy-Report-Only`）。

{% Aside %}现代浏览器会强制执行它们收到的所有内容安全策略。浏览器在响应头或 `<meta>` 元素中接收到的多个 CSP 标头值会合并在一起，作为单个策略强制执行；报告策略也会像这样合并。通过取策略的交集来合并策略；也就是说，第一个策略之后的每个策略只能进一步限制允许的内容，而不能扩大。{% endAside %}

### 使用内容安全策略查找混合内容

您可以使用内容安全策略来收集您网站上混合内容的报告。要启用此功能，请通过将 `Content-Security-Policy-Report-Only` 添加为您网站的响应头来设置该指令。

响应头：

`Content-Security-Policy-Report-Only: default-src https: 'unsafe-inline' 'unsafe-eval'; report-uri https://example.com/reportingEndpoint`

{% Aside %}[report-uri](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri) 响应头已被弃用，取而代之的是 [report-to](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/report-to)。支持 `report-to` 的浏览器目前只有 Chrome 和 Edge。您可以同时提供上述两个标头，如果浏览器支持 `report-to`，则会忽略 `report-uri`。{% endAside %}

每当用户访问您网站上的网页时，他们的浏览器都会向 `https://example.com/reportingEndpoint` 发送一份 JSON 格式的报告，列举违反内容安全策略的内容。此时，只要通过 HTTP 加载子资源，就会发送报告。这些报告包括发生违反策略的网页 URL 和违反策略的子资源 URL。如果您将报告端点配置为记录这些报告，便可跟踪网站上的混合内容，而无需亲自访问每个网页。

对此有两个注意事项：

- 用户必须在能够识别 CSP 标头的浏览器中访问您的网页。大多数现代浏览器都符合此要求。
- 您只能获得用户访问过的网页的报告。因此，如果您的网页流量不太多，则可能需要一段时间才能获得整个网站的报告。

[内容安全策略](/csp/)指南包含更多信息和示例端点。

### 使用 CSP 报告的替代方法

如果您的网站由 Blogger 等平台为您托管，您可能无权修改标头和添加 CSP。一个可行的替代方法是使用 [HTTPSChecker](https://httpschecker.net/how-it-works#httpsChecker) 或 [Mixed Content Scan](https://github.com/bramus/mixed-content-scan) 等网站爬虫为您查找整个网站的问题。

### 升级不安全的请求

浏览器开始升级并阻止不安全的请求。您可以使用 CSP 指令强制自动升级或阻止这些资产。

[`upgrade-insecure-requests`](https://www.w3.org/TR/upgrade-insecure-requests/) CSP 指令指示浏览器在发出网络请求之前升级不安全的 URL。

例如，如果网页包含带有 HTTP URL 的图像标签，如 `<img src="http://example.com/image.jpg">`

浏览器改为对 `https://example.com/image.jpg` 发出安全请求，从而使用户避开混合内容。

您可以使用以下指令发送 `Content-Security-Policy` 标头来启用此行为：

```markup
Content-Security-Policy: upgrade-insecure-requests
```

或者通过使用以下 `<meta>` 元素将同样的指令内联嵌入到文档的 `<head>` 部分：

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

与浏览器自动升级一样，如果资源无法通过 HTTPS 访问，则升级请求将失败并且不会加载资源。这样可以维护您网页的安全性。`upgrade-insecure-requests` 指令将超越自动浏览器升级，尝试升级浏览器当前没有的请求。

`upgrade-insecure-requests` 指令级联到 `<iframe>` 文档中，确保整个网页都受到保护。

### 阻止所有混合内容

保护用户的另一种方法是使用 [`block-all-mixed-content`](https://www.w3.org/TR/mixed-content/#strict-checking) CSP 指令。该指令指示浏览器永不加载混合内容；所有混合内容资源请求都会被阻止，包括主动和被动混合内容。此方法还会级联到 `<iframe>` 文档中，确保整个网页都没有混合内容。

网页可以使用以下指令发送 `Content-Security-Policy` 标头来选择阻止所有混合内容：

```markup
Content-Security-Policy: block-all-mixed-content
```

或者通过使用以下 `<meta>` 元素将同样的指令内联嵌入到文档的 `<head>` 部分：

```html
<meta http-equiv="Content-Security-Policy" content="block-all-mixed-content">
```

{% Aside %}如果您同时设置 `upgrade-insecure-requests` 和 `block-all-mixed-content`，会首先评估和使用 `upgrade-insecure-requests`。浏览器不会继续阻止请求。因此，您应该使用两者之一。{% endAside %}
