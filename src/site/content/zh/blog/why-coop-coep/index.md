---
title: 为何需要“跨源隔离”才能获得强大的功能
subhead: |-
  了解为什么需要跨域隔离才能使用强大的功能，例如
  `SharedArrayBuffer`、`performance.measureUserAgentSpecificMemory()` 和高
  精度高分辨率计时器。
description: |-
  某些 Web API 会增加诸如 Spectre 之类的侧信道攻击的风险。为了减轻这种风险，浏览器提供了基于选择加入的隔离环境，称为跨域隔离。了解为什么需要使用跨域隔离强大的功能，如`SharedArrayBuffer`、`performance.measureUserAgentSpecificMemory()`
  和更高精度的高分辨率计时器。
authors:
  - agektmr
  - domenic
hero: image/admin/h8g1TQjkfkJSpWJrPakB.jpg
date: 2020-05-04
updated: 2021-08-05
tags:
  - blog
  - security
feedback:
  - api
---

## 介绍

在[使用 COOP 和 COEP 使您的网站“跨域隔离”](/coop-coep/)中，我们解释了如何使用 COOP 和 COEP 实现“跨域隔离”状态。这是一篇配套文章，解释了为什么需要跨域隔离才能在浏览器上启用强大的功能。

{% Aside 'key-term' %}本文使用了许多听起来相似的术语。为了让事情更清楚，让我们定义它们：

- [COEP：跨源嵌入器策略](https://wicg.github.io/cross-origin-embedder-policy/)
- [COOP：跨源打开程序策略](https://github.com/whatwg/html/pull/5334/files)
- [CORP：跨源资源策略](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))
- [CORS：跨源资源共享](https://developer.mozilla.org/docs/Web/HTTP/CORS)
- [CORB：跨源读取阻塞](https://www.chromium.org/Home/chromium-security/corb-for-developers){% endAside %}

## 背景

网络建立在[同源策略上](/same-origin-policy/)：一种安全功能，它限制文档和脚本如何与来自另一个来源的资源进行交互。这一原则限制了网站访问跨域资源的方式。例如，来自 `https://a.example` 的文档无法访问托管在 `https://b.example` 上的数据。

然而，同源策略有一些历史例外。任何网站都可以：

- 嵌入跨域 iframe
- 包括跨源资源，例如图像或脚本
- 使用 DOM 引用打开跨域弹出窗口

如果网络可以从头开始设计，这些例外就不会存在。不幸的是，当网络社区意识到严格的同源策略的主要好处时，网络已经依赖于这些例外。

这种宽松的同源策略的安全副作用以两种方式修补。一种方法是通过引入称为[跨源资源共享 (CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS) 的新协议，其目的是确保服务器允许与给定源共享资源。另一种方法是隐式删除对跨源资源的直接脚本访问，同时保持向后兼容性。这种跨域资源被称为“不透明”资源。例如，这就是为什么除非将 CORS 应用于图像，否则通过 `CanvasRenderingContext2D` 操作跨源图像的像素会失败。

所有这些策略决定都发生在浏览上下文组中。

{% Img src="image/admin/z1Gr4mmJMo383dR9FQUk.png", alt="浏览上下文组", width="800", height="469" %}

长期以来，CORS 和不透明资源的结合足以让浏览器变得安全。有时会发现边缘情况（例如 [JSON 漏洞](https://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/)），需要修补，但总体而言，不允许直接读取跨域资源原始字节的原则是成功的。

这一切都随着 [Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability)) 发生了变化，这使得加载到与您的代码相同的浏览上下文组的任何数据都可能具有可读性。通过测量某些操作所花费的时间，攻击者可以猜测 CPU 缓存的内容，进而猜测进程内存的内容。这种计时攻击可以通过平台中存在的低粒度计时器进行，但可以通过高粒度计时器加速，包括显式（如 `performance.now()` ）和隐式（如 `SharedArrayBuffer` s）。如果 `evil.com` 嵌入跨域图像，他们可以使用 Spectre 攻击读取其像素数据，这使得依赖于“不透明性”的保护无效。

{% Img src="image/admin/wN636enwMtBrrOfhzEoq.png", alt="Spectr", width="800", height="500" %}

理想情况下，所有跨域请求都应该由拥有资源的服务器明确审查。如果资源拥有服务器不提供审查，那么数据将永远不会进入恶意行为者的浏览上下文组，因此将远离网页可能执行的任何 Spectre 攻击。我们称之为跨域隔离状态。这正是 COOP+COEP 的意义所在。

在跨域隔离状态下，请求站点被认为不那么危险，这解锁了强大的功能，例如 `SharedArrayBuffer`、`performance.measureUserAgentSpecificMemory()` 和具有更高精度的[高分辨率计时器](https://www.w3.org/TR/hr-time/)，否则这些功能可用于类似 Spectre 的攻击。它还可以防止修改 `document.domain` 。

### 跨源嵌入器策略 {: #coep }

[跨源嵌入器策略 (COEP)](https://wicg.github.io/cross-origin-embedder-policy/) 可防止文档加载任何未明确授予文档权限（使用 CORP 或 CORS）的跨源资源。使用此功能，您可以声明文档无法加载此类资源。

{% Img src="image/admin/MAhaVZdShm8tRntWieU4.png", alt="COEP 的工作原理", width="800", height="410" %}

要激活此策略，请将以下 HTTP 标头附加到文档：

```http
Cross-Origin-Embedder-Policy: require-corp
```

`require-corp`关键字是 COEP 唯一接受的值。这强制执行了文档只能从同一来源加载资源或明确标记为可从另一个来源加载的资源的策略。

对于可从另一个源加载的资源，它们需要支持跨源资源共享 (CORS) 或跨源资源策略 (CORP)。

### 跨域资源共享 {: #cors }

如果跨源资源支持[跨源资源共享 (CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS) ，您可以使用 [`crossorigin` 属性](https://developer.mozilla.org/docs/Web/HTML/Attributes/crossorigin)将其加载到您的网页，而不会被 COEP 阻止。

```html
<img src="https://third-party.example.com/image.jpg" crossorigin>
```

例如，如果此图像资源使用 CORS 标头提供，请使用 `crossorigin` 属性，以便获取资源的请求将使用 [CORS 模式](https://developer.mozilla.org/docs/Web/API/Request/mode)。这也会阻止加载图像，除非它设置了 CORS 标头。

类似地，您可以通过 `fetch()` 方法获取跨源数据，只要服务器以[正确的 HTTP 标头](https://developer.mozilla.org/docs/Web/HTTP/CORS#The_HTTP_response_headers)响应，就不需要特殊处理。

### 跨源资源策略 {: #corp }

[跨源资源策略 (CORP)](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP)) 最初是作为选择加入的，以保护您的资源不被其他源加载。在 COEP 的上下文中，CORP 可以为加载资源的人指定资源所有者的策略。

`Cross-Origin-Resource-Policy` 标头采用三个可能的值：

```http
Cross-Origin-Resource-Policy: same-site
```

标记为 `same-site` 的资源只能从同一站点加载。

```http
Cross-Origin-Resource-Policy: same-origin
```

标记为 `same-origin` 的资源只能从同源加载。

```http
Cross-Origin-Resource-Policy: cross-origin
```

任何网站都可以加载标记为 `cross-origin` 的资源（[此值](https://mikewest.github.io/corpp/#integration-fetch)与 COEP 一起添加到 CORP 规范中。）

{% Aside %} 添加 COEP 标头后，您将无法使用服务工作进程绕过限制。如果文档受 COEP 标头保护，则在响应进入文档进程之前或在它进入控制文档的服务工作者之前遵守该策略。 {% endAside %}

### 跨源打开程序策略 {: #coop }

[跨源打开程序策略 (COOP)](https://github.com/whatwg/html/pull/5334/files) 允许您通过将顶级窗口放在不同的浏览上下文组中来确保顶级窗口与其他文档隔离，这样它们就无法直接与顶级窗口交互。 例如，如果带有 COOP 的文档打开一个弹出窗口，其 `window.opener` 属性将为 `null`。 此外，打开器对其的引用的 `.closed` 属性将返回 `true`。

{% Img src="image/admin/eUu74n3GIlK1fj9ACxF8.png", alt="COOP", width="800", height="452" %}

`Cross-Origin-Opener-Policy` 标头采用三个可能的值：

```http
Cross-Origin-Opener-Policy: same-origin
```

标记为 `same-origin` 的文档可以与也明确标记为 `same-origin` 的同源文档共享相同的浏览上下文组。

{% Img src="image/admin/he8FaRE2ef67lamrFG60.png", alt="COOP", width="800", height="507" %}

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

`same-origin-allow-popups` 的顶级文档保留对其任何弹出窗口的引用，这些弹出窗口要么不设置 COOP，要么通过将 COOP 设置为 `unsafe-none` 来选择退出隔离。

{% Img src="image/admin/AJdm6vFq4fQXUWOTFeFa.png", alt="COOP", width="800", height="537" %}

```http
Cross-Origin-Opener-Policy: unsafe-none
```

`unsafe-none` 是默认值，允许将文档添加到其打开程序的浏览上下文组，除非打开程序本身具有 `same-origin` 的 COOP。

{% Aside %} [`noopener`](https://developer.mozilla.org/docs/Web/API/Window/open#Window_features) 属性具有与您期望从 COOP 获得的效果类似的效果，只是它只能从打开程序端工作。（当窗口被第三方打开时，您无法取消关联）。当您通过执行诸如 `window.open（url， '_blank'， 'noopener'）` 或 `<a target="_blank" rel="noopener">` 之类的操作来附加 `noopener` 时，您可以故意将窗口与打开的窗口断开关联。

虽然 `noopener` 可以被 COOP 取代，但当您想在不支持 COOP 的浏览器中保护您的网站时，它仍然很有用。 {% endAside %}

## 总结 {: #summary }

如果您想保证访问强大的功能，例如 `SharedArrayBuffer`、`performance.measureUserAgentSpecificMemory()` 或具有更高精度的[高分辨率计时器](https://www.w3.org/TR/hr-time/)，请记住您的文档需要使用值为 `require-corp` 的 COEP 和值为 `same-origin` 的 COOP。如果两者都没有，浏览器将无法保证足够的隔离来安全地启用这些强大的功能。您可以通过检查 [`self.crossOriginIsolated`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated) 是否返回 `true` 来确定您的页面情况。

在[使用 COOP 和 COEP 使您的网站“跨域隔离”](/coop-coep/)中了解实现此目的的步骤。

## 资源

- [COOP 和 COEP 解释](https://docs.google.com/document/d/1zDlfvfTJ_9e8Jdc8ehuV4zMEu9ySMCiTGMS9y0GU92k/edit)
- [对共享内存的计划更改 - JavaScript | MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes)
