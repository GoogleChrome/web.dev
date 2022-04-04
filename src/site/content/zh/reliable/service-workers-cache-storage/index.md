---
layout: post
title: 服务工作进程和缓存存储 API
authors:
  - jeffposnick
date: 2018-11-05
updated: 2020-02-27
description: 浏览器的 HTTP 缓存是您的第一道防线。它不一定是最强大或最灵活的方法，并且您对缓存响应的生命周期的控制有限。但是有几个经验法则可以让您无需太多工作即可获得合理的缓存实现，因此您应该始终尝试遵循它们。
---

陷入网络可靠性的斗争中时，浏览器的 HTTP 缓存是您的第一道防线，但正如您所了解的，它只有在加载您之前访问过的版本化 URL 时才真正有效。仅靠 HTTP 缓存是不够的。

幸运的是，有两个更新的工具可以帮助您扭转局面：[服务工作进程](https://developer.mozilla.org/docs/Web/API/Service_Worker_API)和[缓存存储 API](https://developer.mozilla.org/docs/Web/API/CacheStorage) 。由于它们经常一起使用，因此值得同时了解它们。

## 服务工作进程

服务工作进程内置于浏览器中，并由您负责创建的一些额外 JavaScript 代码控制。您可以将其与构成实际 Web 应用程序的其他文件一起部署。

服务工作进程有一些特殊的功能。除其他职责外，它会耐心等待您的 Web 应用发出传出请求，然后通过拦截它而立即采取行动。服务工作进程对该拦截请求执行的动作由您决定。

对于某些请求，最好的做法可能只是允许请求继续发送到网络，就像根本没有服务工作进程时会发生的情况一样。

但是，对于其他请求，您可以利用比浏览器的 HTTP 缓存更灵活的途径，并返回可靠且快速的响应，而不必担心网络。这需要使用另一个搭档：缓存存储 API。

## 缓存存储 API

缓存存储 API 开辟了全新的可能性范围，让开发人员可以完全控制缓存的内容。缓存存储 API 不依赖于 HTTP 标头和浏览器的内置[启发式](https://httpwg.org/specs/rfc7234.html#heuristic.freshness)的组合，而是公开了一种代码驱动的缓存方法。当从服务工作进程的 JavaScript 调用时，缓存存储 API 特别有用。

### 等等……现在还要考虑其他的缓存吗？

您可能会问自己这样的问题：“我还需要配置我的 HTTP 标头吗？”、“我可以用这个新缓存实现哪些 HTTP 缓存无法实现的功能？”。别担心——这些都是自然反应。

仍然建议您在网络服务器上配置 `Cache-Control` 标头，即使您知道自己正在使用缓存存储 API。您通常可以为未版本化的 URL 设置 `Cache-Control: no-cache`，和/或为包含版本信息的网址设置 `Cache-Control: max-age=31536000` ，就像哈希一样。

填充缓存存储 API 缓存时，浏览器[默认检查](https://jakearchibald.com/2016/caching-best-practices/#the-service-worker-the-http-cache-play-well-together-dont-make-them-fight)HTTP 缓存中的现有条目，并在找到时使用这些条目。如果您将版本化 URL 添加到缓存存储 API 缓存，浏览器会避免额外的网络请求。另一面是，如果您使用错误配置的 `Cache-Control` 标头，例如为未版本化的 URL 指定长期缓存生命周期，则将过时的内容添加到缓存存储 API 最终会使事情[变得更糟](https://jakearchibald.com/2016/caching-best-practices/#a-service-worker-can-extend-the-life-of-these-bugs)。对 HTTP 缓存行为进行排序是有效使用缓存存储 API 的先决条件。

至于现在该新的 API 可以带来什么，答案是：很多。其可以实现 HTTP 缓存很难或不可能实现的一些操作，包括：

- 对缓存内容使用“后台刷新”方法，称为 stale-while-revalidate。
- 对要缓存的最大资产数量设置上限，并实施自定义过期策略以在达到该期限后删除项目。
- 比较以前缓存的和新的网络响应，看看是否有任何更改，并允许用户在数据实际更新时更新内容（例如，使用按钮）。

请查看[缓存 API：快速指南](/cache-api-quick-guide/)了解更多信息。

### API 的组件

API 的设计需要注意以下几点：

- [`Request`](https://developer.mozilla.org/docs/Web/API/Request) 对象在读取和写入这些缓存时用作唯一键。为方便起见，您可以传入类似 `'https://example.com/index.html'` 的 URL 字符串作为键，而不是实际的 `Request` 对象，API 会自动为您处理。
- [`Response`](https://developer.mozilla.org/docs/Web/API/Response) 对象用作这些缓存中的值。
- 缓存数据时，给定 `Response` 上的 `Cache-Control` 标头会被有效地忽略。没有自动的、内置的过期或新鲜度检查，一旦您将项目存储在缓存中，它将一直存在，直到您的代码明确删除它。（有一些库可以代表您简化缓存维护。本系列后面内容将介绍它们。）
- 与 [`LocalStorage`](https://developer.mozilla.org/docs/Web/API/Storage/LocalStorage) 等较旧的同步 API 不同，所有缓存存储 API 操作都是异步的。

## 快速绕道：promises 和 async/await

服务工作进程和缓存存储 API 使用[异步编程概念](https://en.wikipedia.org/wiki/Asynchrony_(computer_programming))。特别是，它们严重依赖承诺来表示异步操作的未来结果。深入使用前，您应熟悉 [promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function) 和相关的 [`async`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)/[`await`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/await) 语法。

{% Aside 'codelab' %}[通过注册服务工作进程使应用程序可靠](/codelab-service-workers)。 {% endAside %}

## 不要部署相关代码……还没有

虽然它们提供了一个重要的基础，并且可以按原样使用，但服务工作进程和缓存存储 API 都是有效的低级构建块，具有许多边缘情况和“陷阱”。有一些更高级别的工具可以帮助解决这些 API 的困难部分，并提供构建生产就绪服务工作进程所需的一切。下一个指南将介绍其中这样一个工具：[Workbox](https://developer.chrome.com/docs/workbox/)。

{% Aside 'success' %}边玩边学。探索新的[服务工作进程游戏！](https://serviceworkies.com/)。{% endAside %}
