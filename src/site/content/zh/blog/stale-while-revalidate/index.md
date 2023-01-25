---
title: 使用 stale-while-revalidate 保持新鲜度
subhead: 另一个可帮助您在提供 Web 应用时平衡即时性和新鲜度的工具。
authors:
  - jeffposnick
date: 2019-07-18
description: stale-while-revalidate 帮助开发人员在即时性（立即加载缓存内容）和新鲜度之间取得平衡，确保将来使用对缓存内容的更新。
hero: image/admin/skgQgcT3q8fdBGGNL3o1.jpg
alt: 半漆墙的照片。
tags:
  - blog
feedback:
  - api
---

## 什么内容？

[`stale-while-revalidate`](https://tools.ietf.org/html/rfc5861#section-3) 帮助开发人员在即时性（立即*加载缓存内容）*和新鲜度*之间取得平衡，确保将来使用缓存内容的更新*。如果您维护定期更新的第三方 Web 服务或库，或者您的第一方资产的生命周期往往较短，那么 `stale-while-revalidate` 可能是您现有缓存策略的有用补充。

 [Chrome 75](https://chromestatus.com/feature/5050913014153216) 和 [Firefox 68](https://bugzilla.mozilla.org/show_bug.cgi?id=1536511) 中支持在响应标头 `Cache-Control`  中同时设置 `stale-while-revalidate` 和 `max-age`。

不支持 `stale-while-revalidate` 的浏览器将默默地忽略该配置值，并使用 [`max-age`](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#max-age) ，我将在稍后解释……

## 这是什么意思？

让我们将 `stale-while-revalidate` 分解为两部分：缓存的响应可能是陈旧的，以及重新验证的过程。

首先，浏览器如何知道缓存的响应是否“陈旧”？ 包含 `stale-while-revalidate` 的 [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control) 响应头也应该包含 `max-age` ，并且通过 `max-age` 指定的秒数决定了陈旧性。任何比 `max-age` 更新的缓存响应都被认为是新鲜的，而较旧的缓存响应是陈旧的。

如果本地缓存的响应仍然是新鲜的，则可以按原样使用它来满足浏览器的请求。从 `stale-while-revalidate` 的角度来看，在这种情况下没有什么可做的。

但是如果缓存的响应是陈旧的，那么将执行另一个基于期限的检查：缓存响应的期限是否在 `stale-while-revalidate` 设置覆盖的时间窗口内？

如果陈旧响应的期限在此窗口范围内，则它将用于满足浏览器的请求。同时，将以不延迟使用缓存响应的方式向网络发出“重新验证”请求。返回的响应可能包含与先前缓存的响应相同的信息，也可能不同。无论哪种方式，网络响应都存储在本地，替换以前缓存的内容，并重置将在任何未来 `max-age` 比较期间使用的“新鲜度”计时器。

但是，如果陈旧的缓存响应足够旧，以至于它超出了 `stale-while-revalidate` 时间窗口，那么它将无法满足浏览器的请求。浏览器将从网络中检索响应，并将其用于完成初始请求并使用新响应填充本地缓存。

## 现场示例

下面是一个简单的 HTTP API 示例，用于返回当前时间——更具体地说，是过去一小时的当前分钟数。

{% Glitch { id: 'swr-demo', path: 'server.js:20:15', height: 346 } %}

在这种情况下，Web 服务器在其 HTTP 响应中使用 `Cache-Control` 标头

```text
Cache-Control: max-age=1, stale-while-revalidate=59
```

此设置意味着，如果在接下来的 1 秒内重复请求时间，则先前缓存的值仍将是新鲜的，并按原样使用，无需任何重新验证。

如果请求在 1 到 60 秒后重复，则缓存值将失效，但将用于完成 API 请求。同时，“在后台”将发出重新验证请求，以使用新值填充缓存以备将来使用。

如果请求在超过 60 秒后重复，则根本不会使用过时的响应，并且满足浏览器的请求和缓存重新验证都将取决于从网络获取响应。

以下是这三种不同状态的细分，以及它们适用于我们示例的时间窗口：

{% Img src="image/admin/C8lg2FSeqhTKR6WmYky3.svg", alt="说明上一节信息的图表。", width="719", height="370" %}

## 有哪些常见的用例？

虽然上面的“一小时后分钟数”API 服务示例是人为设计的，但它说明了预期的用例——提供需要刷新的信息的服务，但在某种程度上陈旧是可以接受的。

非人为的示例比如当前天气状况的 API，或者过去一小时内编写的头条新闻。

通常，任何以已知间隔更新、可能被多次请求且在该间隔内是静态的响应都是通过 `max-age` 进行短期缓存的良好候选者。除 `max-age` 之外，使用 `stale-while-revalidate` 增加了可以从缓存中使用更新鲜的内容满足未来请求的可能性，而不会阻塞网络响应。

## 其如何与服务工作进程交互？

如果您听说过 `stale-while-revalidate`，那可能是在[服务工作进程](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate)中使用的 [recipes](/service-workers-cache-storage/) 相关内容中。

通过 `Cache-Control` 标头使用 stale-while-revalidate 与其在服务工作进程中的使用有一些相似之处，并且关于新鲜度权衡和最大生命周期的许多相同考虑都适用。但是，在决定是实现基于服务工作进程的方法还是仅依赖 `Cache-Control` 标头配置时，您应该考虑一些注意事项。

### 在以下情况下使用服务工作进程方法……

- 您已经在您的 Web 应用中使用了服务工作进程。
- 您需要对缓存的内容进行细粒度控制，并希望实现诸如最近最少使用的过期策略之类的东西。Workbox 的[缓存过期](https://developer.chrome.com/docs/workbox/modules/workbox-expiration/)模块可以帮助解决这个问题。
- 您希望在重新验证步骤期间当后台更改陈旧响应时收到通知。Workbox 的[广播缓存更新](https://developer.chrome.com/docs/workbox/modules/workbox-broadcast-update/)模块可以帮助解决这个问题。
- 在所有现代浏览器中，您都需要这种 `stale-while-revalidate` 行为。

### 在以下情况下使用缓存控制方法……

- 您宁愿不处理为您的 Web 应用部署和维护服务工作进程的开销。
- 您可以让浏览器的自动缓存管理防止本地缓存增长过大。
- 您可以接受目前并非所有现代浏览器都支持的方法（截至 2019 年 7 月；未来支持可能会增加）。

如果您正在使用服务工作进程，并且还通过 `Cache-Control` 标头为某些响应启用了 `stale-while-revalidate` ，则服务工作进程通常会在响应请求时进行“第一次尝试”。如果服务工作进程决定不响应，或者在生成响应的过程中使用 [`fetch()`](https://developer.mozilla.org/docs/Web/API/Fetch_API) 发出网络请求，则通过 `Cache-Control` 标头配置的行为最终将生效。

## 了解更多

- Fetch API 规范中的 [`stale-while-revalidate` 响应](https://fetch.spec.whatwg.org/#concept-stale-while-revalidate-response)。
- [RFC 5861](https://tools.ietf.org/html/rfc5861) ，涵盖最初的 `stale-while-revalidate` 规范。
- [HTTP 缓存：您的第一道防线](/http-cache/)，来自本站点的“网络可靠性”指南。

*首图作者：Samuel Zeller。*
