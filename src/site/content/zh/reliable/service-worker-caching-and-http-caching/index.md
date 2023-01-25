---
layout: post
title: Service Worker 缓存和 HTTP 缓存
subhead: 在 Service Worker 缓存和 HTTP 缓存层中使用一致或不同的过期逻辑的优缺点。
authors:
  - jonchen
date: 2020-07-17
description: 在 Service Worker 缓存和 HTTP 缓存层中使用一致或不同的过期逻辑的优缺点。
tags:
  - blog
  - network
  - service-worker
  - offline
---

虽然 Service Worker 和 PWA 正在成为现代 Web 应用程序的标准，但资源缓存变得比以往任何时候都复杂。本文涵盖了浏览器缓存的重点内容，具体包括：

- Service Worker 缓存与 HTTP 缓存的用例和区别。
- 与常规 HTTP 缓存策略相比，不同 Service Worker 缓存过期策略的优缺点。

## 缓存流程概述

概括地说，浏览器在请求资源时会遵循以下缓存顺序：

1. **Service Worker 缓存**：Service Worker 检查资源是否在其缓存中，并根据其编程的缓存策略决定是否返回资源本身。请注意，这个操作不会自动发生。您需要在 Service Worker 中创建一个 fetch 事件处理程序并拦截网络请求，这样才能从 Service Worker 的缓存而不是网络支持这些请求。
2. **HTTP 缓存（也称为浏览器缓存）**：如果资源位于 [HTTP 缓存](/http-cache)中且尚未过期，则浏览器会自动使用 HTTP 缓存中的资源。
3. **服务器端：**如果在 Service Worker 缓存或 HTTP 缓存中未找到任何内容，则浏览器将向网络请求资源。如果资源未在 CDN 中缓存，则请求必须返回到源服务器。

{% Img src="image/admin/vtKWC9Bg9dAMzoFKTeAM.png", alt="缓存流", width="800", height="585" %}

{% Aside %}请注意，有些浏览器（例如 Chrome）在 Service Worker 缓存前面有一个**内存缓存层**。内存缓存的详细信息取决于每个浏览器的实现。遗憾的是，这部分内容还没有明确的规范。{% endAside %}

## 缓存层

### Service Worker 缓存

Service Worker 拦截网络类型的 HTTP 请求并使用[缓存策略](/offline-cookbook/#serving-suggestions)来确定应将哪些资源返回给浏览器。 Service Worker 缓存和 HTTP 缓存的通用目的相同，但 Service Worker 缓存提供了更多的缓存功能，例如，对缓存内容和缓存完成方式进行精细控制。

#### 控制 Service Worker 缓存

Service Worker 使用[事件侦听器](https://github.com/mdn/sw-test/blob/gh-pages/sw.js#L19)（通常是 `fetch` 事件）拦截 HTTP 请求。以下[代码片段](https://github.com/mdn/sw-test/blob/gh-pages/sw.js#L19)演示了[缓存优先](https://developer.chrome.com/docs/workbox/modules/workbox-strategies/#cache-first-cache-falling-back-to-network)这一缓存策略的逻辑。

{% Img src="image/admin/INLfnhEpmL4KpMmFXnTL.png", alt="该图展示了 Service Worker 如何拦截 HTTP 请求", width="800", height="516" %}

强烈建议使用[工具箱](https://developer.chrome.com/docs/workbox/)以免白费力气重复工作。例如，您可以[使用一行正则表达式代码来注册资源 URL 路径](https://developer.chrome.com/docs/workbox/modules/workbox-routing/#how-to-register-a-regular-expression-route)。

```js
import {registerRoute} from 'workbox-routing';

registerRoute(new RegExp('styles/.*\\.css'), callbackHandler);
```

#### Service Worker 缓存策略和用例

下表概述了常见的 Service Worker 缓存策略以及每种策略的适用场合。

<table>
<thead><tr>
<th><strong>策略</strong></th>
<th><strong>新鲜度理论</strong></th>
<th><strong>用例</strong></th>
</tr></thead>
<tbody>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-only">仅网络</a></p></strong></td>
<td>内容必须始终保持最新。</td>
<td><ul>
<li>付款和结帐</li>
<li>余额表</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-falling-back-to-cache">网络回退到缓存</a></p></strong></td>
<td>最好提供新内容。但是，如果网络出现故障或不稳定，也可以提供稍旧的内容。</td>
<td><ul>
<li>及时数据</li>
<li>价格和费率（需要免责声明）</li>
<li>订单状态</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="/stale-while-revalidate/">重新验证时过期 (Stale-while-revalidate)</a></p></strong></td>
<td>可以立即提供缓存内容，但将来应该使用更新的缓存内容。</td>
<td><ul>
<li>新闻提要</li>
<li>产品列表页面</li>
<li>留言</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-then-network">缓存优先，回退到网络</a></p></strong></td>
<td>内容不重要，并且可以从缓存中获得以提高性能，但 Service Worker 应该偶尔检查是否有更新。</td>
<td><ul>
<li>应用外壳</li>
<li>公共资源</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-only">仅缓存</a></p></strong></td>
<td>内容很少改变。</td>
<td><ul><li>静态内容</li></ul></td>
</tr>
</tbody>
</table>

#### Service Worker 缓存的其他优势

除了对缓存逻辑的精细控制外，Service Worker 缓存还具有以下优势：

- **为您的源提供更多内存和存储空间：**浏览器基于每个[源](/same-site-same-origin/#origin)分配 HTTP 缓存资源。换句话说，如果您有多个子域，它们将共享相同的 HTTP 缓存。无法保证您的源/域的内容会长时间保留在 HTTP 缓存中。例如，用户可以通过以下方式清除缓存：在浏览器的设置 UI 中进行手动清理或者触发页面上的硬重新加载。使用 Service Worker 缓存，您的缓存内容保持缓存状态的可能性要高得多。请参阅[持久存储](/persistent-storage/)以了解更多信息。
- **网络不稳定或离线时提高灵活性：**使用 HTTP 缓存，您只能做二元选择：要么缓存资源，要么不缓存。使用 Service Worker 缓存，您可以更轻松地缓解小“小问题”（使用“重新验证时过期”策略）、提供完整的离线体验（使用“仅缓存”策略），或者是介于二者之间，例如，对于自定义 UI，必要时，页面的一部分来自 Service Worker 缓存，而某些部分被排除在外（使用“设置捕获处理程序“策略）。

### HTTP 缓存

浏览器第一次加载网页和相关资源时，会将这些资源存储在其 HTTP 缓存中。 HTTP 缓存通常由浏览器自动启用，除非最终用户明确禁用它。

使用 HTTP 缓存便意味着，由服务器来确定何时缓存资源以及缓存多长时间。

#### 使用 HTTP 响应标头控制 HTTP 缓存过期

当服务器响应浏览器对资源的请求时，服务器使用 HTTP 响应标头来告诉浏览器应该将该资源缓存多长时间。请参阅[响应标头：配置您的 Web 服务器](/http-cache/#response-headers)以了解更多信息。

#### HTTP 缓存策略和用例

HTTP 缓存比 Service Worker 缓存简单得多，因为 HTTP 缓存只处理基于时间 (TTL) 的资源过期逻辑。请参阅[您应该使用哪些响应标头值？](/http-cache/#response-header-strategies)和[摘要](/http-cache/#summary)以了解有关 HTTP 缓存策略的更多信息。

## 设计您的缓存过期逻辑

本部分介绍在 Service Worker 缓存和 HTTP 缓存层中使用一致的过期逻辑的优缺点，以及在这些层中使用单独的过期逻辑的优缺点。

下面的 Glitch 演示了 Service Worker 缓存和 HTTP 缓存在不同场景中的应用情况：

{% Glitch { id: 'compare-sw-and-http-caching', height: 480 } %}

### 在所有缓存层中使用一致的过期逻辑

为了演示优缺点，我们比较 3 种场景：长期缓存、中期缓存和短期缓存。

<table>
<thead><tr>
<th>场景</th>
<th>长期缓存</th>
<th>中期缓存</th>
<th>短期缓存</th>
</tr></thead>
<tbody>
<tr>
<td>Service Worker 缓存策略</td>
<td>缓存，回退到网络</td>
<td>重新验证时过期</td>
<td>网络回退到缓存</td>
</tr>
<tr>
<td>Service Worker 缓存 TTL</td>
<td><strong>30 天</strong></td>
<td><strong>1 天</strong></td>
<td><strong>10 分钟</strong></td>
</tr>
<tr>
<td>HTTP 缓存最长时限</td>
<td><strong>30 天</strong></td>
<td><strong>1 天</strong></td>
<td><strong>10 分钟</strong></td>
</tr>
</tbody>
</table>

#### 场景：长期缓存（缓存，回退到网络）

- 当缓存的资源有效（&lt;= 30 天）时：Service Worker 立即返回缓存的资源，无需访问网络。
- 当缓存的资源过期（&gt; 30 天）时：Service Worker 访问网络来获取资源。浏览器的 HTTP 缓存中没有该资源的副本，因此它会在服务器端获取该资源。

缺点：在这种情况下，HTTP 缓存的价值较小，因为当 Service Worker 中的缓存过期时，浏览器始终将请求传递到服务器端。

#### 场景：中期缓存（重新验证时过期）

- 当缓存的资源有效（&lt;= 1 天）时：Service Worker 立即返回缓存的资源，并访问网络来获取资源。浏览器的 HTTP 缓存中有资源的副本，因此，它将该副本返回给 Service Worker。
- 当缓存的资源过期（&gt; 1 天）时：Service Worker 立即返回缓存的资源，并访问网络来获取资源。浏览器的 HTTP 缓存中没有资源的副本，因此，它会在服务器端获取该资源。

缺点：Service Worker 需要额外使用缓存破坏逻辑来替换 HTTP 缓存，从而充分利用”重新验证“步骤。

#### 场景：短期缓存（网络回退到缓存）

- 当缓存的资源有效（&lt;= 10 分钟）时：Service Worker 访问网络来获取资源。浏览器的 HTTP 缓存中有资源的副本，因此，它无需转到服务器端即可将该副本返回给 Service Worker。
- 当缓存的资源过期（&gt; 10 分钟）时：Service Worker 立即返回缓存的资源，并访问网络来获取资源。浏览器的 HTTP 缓存中没有资源的副本，因此，它在服务器端获取该资源。

缺点：与中期缓存场景类似，Service Worker 需要额外使用缓存破坏逻辑来替换 HTTP 缓存，从而在服务器端获取最新的资源。

#### 所有场景中的 Service Worker

在所有场景中，如果网络不稳定，Service Worker 缓存仍可返回缓存的资源。另一方面，当网络不稳定或中断时，HTTP 缓存将变得不可靠。

### 在 Service Worker 缓存和 HTTP 层中使用不同的缓存过期逻辑

为了演示优缺点，我们再来比较长期缓存、中期缓存和短期缓存场景。

<table>
<thead><tr>
<th>场景</th>
<th>长期缓存</th>
<th>中期缓存</th>
<th>短期缓存</th>
</tr></thead>
<tbody>
<tr>
<td>Service Worker 缓存策略</td>
<td>缓存，回退到网络</td>
<td>重新验证时过期</td>
<td>网络回退到缓存</td>
</tr>
<tr>
<td>Service Worker 缓存 TTL</td>
<td><strong>90 天</strong></td>
<td><strong>30 天</strong></td>
<td><strong>1 天</strong></td>
</tr>
<tr>
<td>HTTP 缓存最长时限</td>
<td><strong>30 天</strong></td>
<td><strong>1 天</strong></td>
<td><strong>10 分钟</strong></td>
</tr>
</tbody>
</table>

#### 场景：长期缓存（缓存，回退到网络）

- 当缓存的资源在 Service Worker 缓存中有效（&lt;= 90 天）时：Service Worker 立即返回缓存的资源。
- 当缓存的资源在 Service Worker 缓存中过期（&gt; 90 天）时：Service Worker 访问网络来获取资源。浏览器的 HTTP 缓存中没有资源的副本，因此，它转到服务器端。

优缺点：

- 优点：当 Service Worker 立即返回缓存的资源时，用户会体验到即时响应。
- 优点：Service Worker 可以更精细地控制何时使用其缓存以及何时请求新版本资源。
- 缺点：需要明确定义的 Service Worker 缓存策略。

#### 场景：中期缓存（重新验证时过期）

- 当缓存的资源在 Service Worker 缓存中有效（&lt;= 30 天）时：Service Worker 立即返回缓存的资源。
- 当缓存的资源在 Service Worker 缓存中过期（&gt; 30 天）时：Service Worker 访问网络来获取资源。浏览器的 HTTP 缓存中没有资源的副本，因此，它转到服务器端。

优缺点：

- 优点：当 Service Worker 立即返回缓存的资源时，用户会体验到即时响应。
- 优点：由于重新验证“在后台”执行，Service Worker 可以确保给定 URL 的**下一个**请求使用的是来自网络的新响应。
- 缺点：需要明确定义的 Service Worker 缓存策略。

#### 场景：短期缓存（网络回退到缓存）

- 当缓存的资源在 Service Worker 缓存中有效（&lt;= 1 天）时：Service Worker 访问网络来获取资源。如果 HTTP 缓存中有资源，浏览器会从 HTTP 缓存返回该资源。如果网络中断，Service Worker 将从 Service Worker 缓存返回该资源。
- 当缓存的资源在 Service Worker 缓存中过期（&gt; 1 天）时：Service Worker 访问网络来获取资源。浏览器通过网络获取资源，因为其 HTTP 缓存中的缓存版本已过期。

优缺点：

- 优点：当网络不稳定或中断时，Service Worker 会立即返回缓存的资源。
- 缺点：Service Worker 需要额外使用缓存破坏逻辑来替换 HTTP 缓存并发出“网络优先”请求。

## 结论

鉴于缓存场景组合的复杂性，无法设计出一种可涵盖所有情况的规则。但是，根据前面几部分的研究结果，在设计缓存策略时，可以考虑以下几项建议：

- Service Worker 缓存逻辑不需要与 HTTP 缓存过期逻辑保持一致。如果可能，请在 Service Worker 中使用更长的过期逻辑以授予 Service Worker 更多控制权。
- HTTP 缓存仍然扮演着重要的角色，但是当网络不稳定或中断时它会变得不可靠。
- 重新审视每个资源的缓存策略，确保您的 Service Worker 缓存策略具有相应的价值，而不会与 HTTP 缓存发生冲突。

## 了解更多

- [网络可靠性](/reliable/)
- [使用 HTTP 缓存避免不必要的网络请求](/http-cache)
- [HTTP 缓存代码实验室](/codelab-http-cache/)
- [衡量 Service Worker 对性能的真实影响](https://developers.google.com/web/showcase/2016/service-worker-perf)
- [缓存控制 (Cache-Control) 与过期](https://stackoverflow.com/questions/5799906/what-s-the-difference-between-expires-and-cache-control-headers)
