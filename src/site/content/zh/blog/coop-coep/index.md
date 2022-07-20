---
layout: post
title: 使用 COOP 和 COEP“跨源隔离”网站
subhead: |-
  使用 COOP 和 COEP 设置跨源隔离环境并启用
  强大的功能，如“SharedArrayBuffer”、“performance.measureUserAgentSpecificMemory()”以及更高精度的高解析性能计时器。
description: 某些 Web API 会导致 Spectre 等旁道攻击的风险增加。为了减轻这种风险，浏览器提供了一个基于选择加入的隔离环境，称为“跨源隔离”。请使用 COOP 和 COEP 来设置此类环境并启用强大的功能，如“SharedArrayBuffer”、“performance.measureUserAgentSpecificMemory()”或进度更高的高解析性能计时器。
authors:
  - agektmr
hero: image/admin/Rv8gOTwZwxr2Z7b13Ize.jpg
alt: 用户正在浏览包含弹出窗口、iframe 和图像的网站的插图。
date: 2020-04-13
updated: 2021-11-26
tags:
  - blog
  - security
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/register_trial/2780972769901281281"
feedback:
  - api
---

{% Aside '注意' %}

从 Chrome 92 开始，Chrome 桌面版的 `SharedArrayBuffer` 需要跨源隔离。要了解更多信息，请查看 [Android 版 Chrome 88 和桌面版 Chrome 92 的 SharedArrayBuffer 更新](https://developer.chrome.com/blog/enabling-shared-array-buffer/)。

{% endAside %}

**更新**

- **2021 年 8 月 5 日**：JS Self-Profiling API 被列为需要跨源隔离的 API 之一，但反映[最新方向变化](https://github.com/shhnjk/shhnjk.github.io/tree/main/investigations/js-self-profiling#conclusion)的内容已被删除。
- **2021 年 5 月 6 日**：根据反馈和报告的问题，我们决定调整在 Chrome M92 中限制的非跨源隔离站点中 `SharedArrayBuffer` 用法的时间表。
- **2021 年 4 月 16 日**：添加了关于[新的 COEP 无凭据模式](https://github.com/mikewest/credentiallessness/)和 [COOP 同源允许弹出窗口（作为跨源隔离宽松条件）](https://github.com/whatwg/html/issues/6364)的注释。
- **2021 年 3 月 5 日**：删除了对 `SharedArrayBuffer`、`performance.measureUserAgentSpecificMemory()` 和调试功能的限制。现在，Chrome 89 中已完全启用这些功能。添加了即将推出的功能 `performance.now()` 和 `performance.timeOrigin`，新功能具有更高的精度。
- **2021 年 2 月 19 日**：在 DevTools 上添加了关于功能策略 `allow="cross-origin-isolated"` 和调试功能的注释。
- **2020 年 10 月 15 日**：Chrome 87 中已提供 `self.crossOriginIsolated`。为了反映这一点，`self.crossOriginIsolated` 返回 `true` 时，`document.domain` 不可变。`performance.measureUserAgentSpecificMemory()` 正在结束来源试验，在 Chrome 89 中将默认启用。Chrome 88 中将提供 Android 版 Chrome 上的共享数组缓冲区。

{% YouTube 'XLNJYhjA-0c' %}

某些 Web API 会导致 Spectre 等旁道攻击的风险增加。为了减轻这种风险，浏览器提供了一个基于选择加入的隔离环境，称为“跨源隔离”。在跨源隔离状态下，网页能够使用特权功能，包括：

<div>
  <table>
    <thead>
      <tr>
        <th>API</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer">
          <code>SharedArrayBuffer</code></a>
        </td>
        <td>WebAssembly 线程需要。Android 版 Chrome 88 中提供了此 API。桌面版目前在<a href="https://www.chromium.org/Home/chromium-security/site-isolation">站点隔离</a>的帮助下默认启用，但需要跨源隔离状态，并且在 <a href="https://developer.chrome.com/blog/enabling-shared-array-buffer/">Chrome 92 中默认禁用</a>。</td>
      </tr>
      <tr>
        <td>
          <a href="/monitor-total-page-memory-usage/">
          <code>performance.measureUserAgentSpecificMemory()</code></a>
        </td>
        <td>Chrome 89 中提供。</td>
      </tr>
      <tr>
        <td><a href="https://crbug.com/1180178"><code>performance.now()</code> , <code>performance.timeOrigin</code></a></td>
        <td>目前已在许多浏览器中提供，解析时间限制为 100 微秒或更短。通过跨源隔离，解析时间可以达到 5 微秒或更短。</td>
      </tr>
    </tbody>
    <caption>将在跨源隔离状态之后可用的功能。</caption>
  </table>
</div>

跨源隔离状态还可以防止修改 `document.domain`。（如果能够修改 `document.domain`，则允许同站文档之间相互通信，这是同源策略中的一个漏洞。）

要选择跨源隔离状态，您需要在主文档上发送以下 HTTP 标头：

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

这些标头指示浏览器阻止加载未选择由跨源文档加载的资源或 iframe，并防止跨源窗口直接与您的文档交互。这也意味着跨源加载的资源需要选择加入。

通过检查 [`self.crossOriginIsolated`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated) 来确定网页是否处于跨源隔离状态。

本文介绍了如何使用这些新标头。在[后续文章中](/why-coop-coep)中，我会提供更多背景和上下文。

{% Aside %}

本文针对希望准备好网站，从而以更可靠的方式跨浏览器平台使用 `SharedArrayBuffer`、WebAssembly 线程、`performance.measureUserAgentSpecificMemory()` 或精度更高的高解析性能计时器的用户。

{% endAside %}

{% Aside 'key-term' %} 本文使用了许多相似的术语。为了便于理解，我们先确定每个术语的定义：

- [COEP：跨源嵌入器策略](https://wicg.github.io/cross-origin-embedder-policy/)
- [COOP：跨源打开程序策略](https://github.com/whatwg/html/pull/5334/files)
- [CORP：跨源资源策略](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))
- [CORS：跨源资源共享](https://developer.mozilla.org/docs/Web/HTTP/CORS)
- [CORB：跨源读取阻止](https://www.chromium.org/Home/chromium-security/corb-for-developers){% endAside %}

## 通过部署 COOP 和 COEP 来让网站跨源隔离

{% Aside %}阅读[启用跨源隔离指南](/cross-origin-isolation-guide/)，了解启用跨源隔离的实践步骤。{% endAside %}

### 整合 COOP 和 COEP

#### 1. 在顶级文档上设置 `Cross-Origin-Opener-Policy: same-origin`

通过在顶级文档上启用 `COOP: same-origin`，则除非位于具有相同 COOP 设置的相同源中，否则同源窗口和从该文档打开的窗口将具有单独的浏览上下文组。因此，对打开的窗口强制执行隔离，同时禁止两个窗口相互通信。

{% Aside 'caution' %}

这将破坏需要跨源窗口交互（例如 OAuth 和支付）的集成。为了缓解此问题，我们正在[探索放宽条件](https://github.com/whatwg/html/issues/6364)，从而支持 `Cross-Origin-Opener-Policy: same-origin-allow-popups` 跨源隔离。这样就可以让该标头与其打开的窗口进行通信。

如果您想启用跨源隔离，但被此问题阻碍，那么我们建议您[注册来源试验](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial)，同时等待可用的新条件。在安全解决此问题之前，我们不打算终止来源试验。

{% endAside %}

浏览上下文组是一组共享相同上下文的选项卡、窗口或 iframe。例如，如果网站 (`https://a.example`) 打开一个弹出窗口 (`https://b.example`)，打开程序窗口和弹出窗口共享相同的浏览上下文，并且它们可以通过 DOM API (`window.opener`) 相互进行访问。

{% Img src="image/admin/g42eZMpIKNbUL0cN6yjC.png", alt="浏览上下文组", width="470", height="469" %}

您可以[从 DevTools](#devtools-coop) 检查窗口打开程序及其 openee 是否位于单独的浏览器上下文组中。

{% Aside 'codelab' %}[查看不同 COOP 参数的影响](https://cross-origin-isolation.glitch.me/coop)。{% endAside %}

#### 2. 确保资源已启用 CORP 或 CORS

确保页面中的所有资源都已加载 CORP 或 CORS HTTP 标头。[第四步：启用 COEP](#enable-coep) 将需要此步骤。

根据资源的性质，您需要执行以下操作：

- 如果预计**仅从相同来源**加载资源，请设置 `Cross-Origin-Resource-Policy: same-origin` 标头。
- 如果预计**仅从同一站点跨源**加载资源，请设置 `Cross-Origin-Resource-Policy: same-site` 标头。
- 如果是**从您控制的跨源加载**资源，则要尽可能设置 `Cross-Origin-Resource-Policy: cross-origin` 标头。
- 对于您无法控制的跨源资源：
    - 如果使用 CORS 提供资源，请在加载 HTML 标记中使用 `crossorigin`（例如，`<img src="***" crossorigin>` 。）
    - 要求资源所有者支持 CORS 或 CORP。
- 对于 iframe，请使用 CORP 和 COEP 标头，如下所示：`Cross-Origin-Resource-Policy: same-origin`（或根据上下文使用 `same-site` 或 `cross-origin`）和 `Cross-Origin-Embedder-Policy: require-corp`。

{% Aside 'gotchas' %} 通过将 `allow="cross-origin-isolated"` 功能策略应用到 `<iframe>` 标签并满足本文档中所述的相同条件，您可以对嵌入在 iframe 中的文档启用跨源隔离。请注意，包括父框架和子框架在内的整个文档链也必须跨源隔离。{% endAside %}

{% Aside 'key-term' %}了解“同站”和“同源”之间的区别很重要。要了解区别，请查看[了解“同站”和“同源”](/same-site-same-origin)。{% endAside %}

#### 3. 使用 COEP 仅报告 HTTP 标头评估嵌入资源

在完全启用 COEP 之前，您可以使用 `Cross-Origin-Embedder-Policy-Report-Only` 标头进行试运行，检查策略是否确实有效。您将收到不阻止嵌入内容的报告。以递归方式将其应用到所有文档。有关“仅报告 HTTP 标头”的信息，请参阅[使用报告 API 观察问题](#observe-issues-using-the-reporting-api)。

#### 4. 启用 COEP {: #enable-coep }

确认一切正常且可以成功加载所有资源后，请将 `Cross-Origin-Embedder-Policy: require-corp` HTTP 标头应用到所有文档（包括通过 iframe 嵌入的文档）。

{% Aside 'codelab' %} [查看不同 COEP/CORP 参数的影响](https://cross-origin-isolation.glitch.me/coep)。{% endAside %}

{% Aside %} [Squoosh](https://squoosh.app)（一种图像优化 PWA）[现在，使用 COOP/COEP](https://github.com/GoogleChromeLabs/squoosh/pull/829/files#diff-316f969413f2d9a065fcc08c7a5589c088dd1e21deebadccfc5a4372ac5e0cbbR22-R23) 来访问 Wasm 线程（和共享数组缓冲区）以及 Android Chrome。{% endAside %}

{% Aside 'caution' %}

我们一直在探索大规模部署 `Cross-Origin-Resource-Policy` 的方法，因为跨源隔离要求所有子资源明确选择加入。我们提出了一种逆向思维：[新的 COEP“无凭据”模式](https://github.com/mikewest/credentiallessness/)，从而允许通过剥离所有凭据来加载没有 CORP 标头的资源。我们正在解决它的工作方式的细节问题，希望这会减轻您确保子资源发送 `Cross-Origin-Resource-Policy` 标头的负担。

如果您想启用跨源隔离，但面临此问题的阻碍，那么我们建议您[注册来源试验](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial)，同时等待可用的新模式。在新模式可用之前，我们不会终止来源试验。

{% endAside %}

### 利用 `self.crossOriginIsolated` 确定隔离是否成功

当网页处于跨源隔离状态且所有资源和窗口在同一浏览上下文组中隔离时，`self.crossOriginIsolated` 属性会返回 `true`。您可以使用此 API 来确定是否已成功隔离浏览上下文组，并获得对 `performance.measureUserAgentSpecificMemory()` 等强大功能的访问权限。

### 使用 Chrome DevTools 调试问题

{% YouTube 'D5DLVo_TlEA' %}

对于在屏幕上呈现的资源（例如图像），很容易检测 COEP 问题，因为请求会被阻止且页面会指示缺少图像。但是，对于不一定具有视觉影响的资源（例如脚本或样式），可能无法注意到 COEP 问题。对于这些问题，请使用“DevTools 网络”面板。如果 COEP 有问题，您会在**状态**栏看到 `(blocked:NotSameOriginAfterDefaultedToSameOriginByCoep)`。

<figure>{% Img src="image/admin/iGwe4M1EgHzKb2Tvt5bl.jpg", alt="网络面板状态栏中的 COEP 问题。", width="800", height="444" %}</figure>

随后，您可以单击此条目以查看更多详细信息。

<figure>{% Img src="image/admin/1oTBjS9q8KGHWsWYGq1N.jpg", alt="单击“网络”面板中的网络资源后，COEP 问题的详细信息会显示在“标题”选项卡中。", width="800", height=" 241" %}</figure>

您还可以通过**应用程序**面板确定 iframe 和弹出窗口的状态。转到左侧的“框架”部分并展开“顶部”即可查看详细资源结构。

<span id="devtools-coep-iframe">您可以检查 iframe 的状态，例如“SharedArrayBuffer”的可用性等。</span>

<figure>{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/9titfaieIs0gwSKnkL3S.png", alt="Chrome DevTools iframe 检查器", width="800", height="480" %}</figure>

<span id="devtools-coop">您还可以检查弹出窗口的状态，例如它是否已跨源隔离。</span>

<figure>{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/kKvPUo2ZODZu8byK7gTB.png", alt="Chrome DevTools 弹出窗口检查器", width="800", height="480" %}</figure>

### 使用报告 API 观察问题

[报告 API](/reporting-api) 是另一种可以检测各种问题的机制。您可以配置报告 API 来指示用户浏览器在 COEP 阻止加载资源或 COOP 隔离弹出窗口时发送报告。从 69 版本开始，Chrome 就支持将报告 API 用于各种用途，包括 COEP 和 COOP。

{% Aside %}

您是否已经将报告 API 与`Report-To` 标头一起使用？Chrome 正在转换为新版本的报告 API，它会将 `Report-To` 替换为 `Reporting-Endpoints`；请考虑迁移到新版本。要了解详细信息，请查看[迁移到报告 API v1](/reporting-api-migration)。

{% endAside %}

要了解如何配置报告 API 和设置服务器以接收报告，请转到[使用报告 API](/reporting-api/#using-the-reporting-api)。

#### COEP 报告示例

当跨源资源被阻止时，示例 [COEP 报告](https://html.spec.whatwg.org/multipage/origin.html#coep-report-type)内容如下所示：

```json
[{
  "age": 25101,
  "body": {
    "blocked-url": "https://third-party-test.glitch.me/check.svg?",
    "blockedURL": "https://third-party-test.glitch.me/check.svg?",
    "destination": "image",
    "disposition": "enforce",
    "type": "corp"
  },
  "type": "coep",
  "url": "https://cross-origin-isolation.glitch.me/?coep=require-corp&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4249.0 Safari/537.36"
}]
```

{% Aside 'caution' %} `blocked-url` 仅向后兼容，并且[最终会将其删除](https://github.com/whatwg/html/pull/5848)。{% endAside %}

#### COOP 报告示例

当弹出窗口被隔离打开时，示例 [COOP 报告](https://html.spec.whatwg.org/multipage/origin.html#reporting)内容如下所示：

```json
[{
  "age": 7,
  "body": {
    "disposition": "enforce",
    "effectivePolicy": "same-origin",
    "nextResponseURL": "https://third-party-test.glitch.me/popup?report-only&coop=same-origin&",
    "type": "navigation-from-response"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
}]
```

当不同的浏览上下文组尝试相互访问时（仅在“仅报告”模式下），COOP 也会发送报告。 `postMessage()`时的报告如下所示：

```json
[{
  "age": 51785,
  "body": {
    "columnNumber": 18,
    "disposition": "reporting",
    "effectivePolicy": "same-origin",
    "lineNumber": 83,
    "property": "postMessage",
    "sourceFile": "https://cross-origin-isolation.glitch.me/popup.js",
    "type": "access-from-coop-page-to-openee"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?report-only&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
},
{
  "age": 51785,
  "body": {
    "disposition": "reporting",
    "effectivePolicy": "same-origin",
    "property": "postMessage",
    "type": "access-to-coop-page-from-openee"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?report-only&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
}]
```

## 总结

使用 COOP 和 COEP HTTP 标头的组合将网页选择加入特定跨源隔离状态。您将能够检查 `self.crossOriginIsolated`，从而确定网页是否处于跨源隔离状态。

随着新功能可用于这种跨源隔离状态，我们将不断更新此帖子，并继续围绕 COOP 和 COEP 对 DevTools 进行改进。

## 资源

- [为何需要“跨源隔离”才能获得强大的功能](/why-coop-coep/)
- [跨源隔离的启用指南](/cross-origin-isolation-guide/)
- [Android 版 Chrome 88 和桌面版 Chrome 92 中的 SharedArrayBuffer 更新](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
- [利用 `measureUserAgentSpecificMemory()` 监控网页的总内存使用量](/monitor-total-page-memory-usage/)
