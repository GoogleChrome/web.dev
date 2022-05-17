---
title: Web 存储
subhead: 浏览器中有许多不同的数据存储选项。哪一种最适合您的需求？
authors:
  - petelepage
description: 浏览器中有许多不同的数据存储选项。哪一种最适合您的需求？
date: 2020-04-27
updated: 2021-02-11
tags:
  - blog
  - progressive-web-apps
  - storage
  - memory
hero: image/admin/c8u2hKEFoFfgTsmcKeuK.jpg
alt: 一堆货运集装箱
feedback:
  - api
---

Internet 连接在旅途中可能不稳定或不存在，因此离线支持和可靠的性能是[渐进式 Web 应用程序](/progressive-web-apps/)的常见功能。即使在完美的无线环境中，审慎使用缓存和其他存储技术也可以显著改善用户体验。有多种方法可以缓存您的静态应用程序资源（HTML、JavaScript、CSS、图像等）和数据（用户数据、新闻文章等）。但是，哪种才是最好的解决方案？您能存储多少？如何防止数据被逐出？

## 我应该使用什么？ {: #建议 }

以下是对存储资源的一般建议：

- 对于加载应用程序和基于文件的内容所需的网络资源，请使用[**缓存存储 API**](/cache-api-quick-guide/)（[service worker](https://developer.chrome.com/docs/workbox/service-worker-overview/) 的一部分）。
- 对于其他数据，请使用 [**IndexedDB**](https://developer.mozilla.org/docs/Web/API/IndexedDB_API)（带有 [Promise 包装器](https://www.npmjs.com/package/idb)）。

每个现代浏览器都支持 IndexedDB 和缓存存储 API。它们都是异步的，不会阻塞主线程。可以从`window`对象、Web worker 和 service worker 访问它们，从而轻松地在代码中的任何位置使用。

## 其他存储机制呢？ {: #其他 }

浏览器中还提供其他几种存储机制，但它们的用途有限，并且可能会导致严重的性能问题。

[SessionStorage](https://developer.mozilla.org/en/docs/Web/API/Window/sessionStorage) 特定于选项卡，其作用范围涵盖选项卡的整个生存期。它对于存储 IndexedDB 键等少量会话特定信息可能很有用。此机制是同步的，会阻塞主线程，因此应谨慎使用。其大小限制约为 5MB，并且只能包含字符串。由于它特定于选项卡，因此无法从 web worker 或 service worker 进行访问。

[LocalStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) 是同步的，会阻塞主线程，因此应避免使用。其大小限制约为 5MB，并且只能包含字符串。无法从 web worker 或 service worker 访问 LocalStorage。

[Cookie](https://developer.mozilla.org/docs/Web/HTTP/Cookies) 有其用途，但不应该用于存储。Cookie 随每个 HTTP 请求一起发送，因此只能存储少量数据，数据一多就会显著增加每个 Web 请求的大小。Cookie 是同步的，不能从 Web worker 进行访问。与 LocalStorage 和 SessionStorage 一样，cookie 仅限于字符串。

[文件系统 API](https://developer.mozilla.org/docs/Web/API/File_and_Directory_Entries_API/Introduction) 和 FileWriter API  提供了在沙盒文件系统中读写文件的方法。虽然它是异步的，但不推荐使用，因为它[只能在基于 Chromium 的浏览器中使用](https://caniuse.com/#feat=filesystem)。

[文件系统访问 API](/file-system-access/) 旨在使用户能够轻松读取和编辑本地文件系统上的文件。用户必须先授予权限，然后页面才能读取或写入本地文件，并且权限不会跨会话保持。

**不**应使用 WebSQL，目前使用的应迁移至 IndexedDB。几乎所有主要浏览器都已[删除](https://caniuse.com/#feat=sql-storage)此支持。W3C 已在 2010 年[停止维护 Web SQL 规范](https://www.w3.org/TR/webdatabase/)，而且没有进一步更新的计划。

**不**应使用应用程序缓存，目前使用的应迁移至  service worker 和缓存 API。此机制已被[弃用](https://developer.mozilla.org/docs/Web/API/Window/applicationCache)，未来将从浏览器中删除该支持。

## 我可以存储多少？ {: #多少 }

简而言之，**很多**，至少几百 MB，甚至可能是几百 GB 或更多。浏览器实施各不相同，但可用存储量通常取决于设备上可用的存储量。

- Chrome 允许浏览器使用多达 80% 的总磁盘空间。一个来源最多可以使用总磁盘空间的 60%。您可以使用 [StorageManager API](#check) 来确定可用的最大配额。其他基于 Chromium 的浏览器可能允许浏览器使用更多的存储空间。有关 Chrome 实施的详细信息，请参阅 [PR #3896](https://github.com/GoogleChrome/web.dev/pull/3896)。
- Internet Explorer 10 及更高版本最多可以存储 250MB，并且在使用量超过 10MB 时会提示用户。
- Firefox 允许浏览器使用多达 50% 的可用磁盘空间。[eTLD+1](https://godoc.org/golang.org/x/net/publicsuffix) 组（例如 `example.com` 、`www.example.com` 和 `foo.bar.example.com`）[最多可以使用 2GB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria#Storage_limits)。您可以使用 [StorageManager API](#check-available) 来确定还有多少空间可用。
- Safari（桌面版和移动版）似乎允许 1GB 左右。当达到限制时，Safari 会提示用户，同时以 200MB 的增量增加限制。我找不到有关这方面的任何官方文档。
    - 如果将 PWA 添加到移动 Safari 的主屏幕上，它似乎会创建一个新的存储容器，并且 PWA 和移动 Safari 之间不会共享任何内容。一旦已安装的 PWA 达到配额，似乎就没有任何方法可以请求额外的存储空间。

过去，如果站点存储的数据超过某个阈值，浏览器会提示用户授权使用更多的数据。例如，如果来源的使用量超过 50MB，浏览器会提示用户允许它最多存储 100MB，然后以 50MB 的增量再次询问。

如今，大多数现代浏览器都不会提示用户，而是允许站点最多用完为其分配的配额。Safari 好像是例外，它会在 750MB 时进行提示，请求允许存储最多 1.1GB。如果来源尝试使用的量超过为其分配的配额，则进一步尝试写入数据将失败。

## 如何检查有多少可用存储？ {: #检查 }

在[许多浏览器](https://caniuse.com/#feat=mdn-api_storagemanager)中，您可以使用 [StorageManager API](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate) 来确定来源的可用存储量及其目前使用的存储量。它会报告 IndexedDB 和缓存 API 使用的总字节数，还可以计算近似的可用剩余存储空间。

```js
if (navigator.storage && navigator.storage.estimate) {
  const quota = await navigator.storage.estimate();
  // quota.usage -> 已用字节数。
  // quota.quota -> 最大可用字节数。
  const percentageUsed = (quota.usage / quota.quota) * 100;
  console.log(`您已使用可用存储的 ${percentageUsed}%。`);
  const remaining = quota.quota - quota.usage;
  console.log(`您最多可以再写入 ${remaining} 个字节。`);
}
```

StorageManager 尚未在所有浏览器中[实施](https://caniuse.com/#feat=mdn-api_storagemanager)，因此您必须在使用前对其进行功能检测。即使它可用，您仍必须捕获超出配额错误（见下文）。在某些情况下，可用配额可能会超过实际可用存储量。

{% Aside %}其他基于 Chromium 的浏览器在报告可用配额时可能会考虑可用空间量。Chrome 则不会，它将始终报告实际磁盘大小的 60%。这有助于降低确定已存储的跨来源资源大小的能力。{% endAside %}

### 检查

在开发过程中，您可以使用浏览器的 DevTools 来检查不同的存储类型，并轻松清除所有存储的数据。

Chrome 88 中增加了一项新功能，可让您在“存储窗格”中覆盖站点的存储配额。此功能使您能够模拟不同的设备，并在磁盘可用性较低的情况下测试应用程序的行为。依次转到**应用程序**和**存储**，启用**模拟自定义存储配额**复选框，然后输入有效数字来模拟存储配额。

{% Img src="image/0g2WvpbGRGdVs0aAPc6ObG7gkud2/tYlbklNwF6DFKNV2cY0D.png", alt="DevTools 存储窗格。", width="800", height="567" %}

在撰写本文时，我编写了一个[简单工具](https://storage-quota.glitch.me/)来尝试快速使用尽可能多的存储。这是试验不同存储机制的一种快速简便的方法，而且可以查看在用尽所有配额时会发生什么。

## 如何处理超出配额？ {: #超出配额 }

超出配额时，您该怎么办？最重要的是，您应始终捕获并处理写入错误，无论是 `QuotaExceededError` 还是其他错误。然后，根据您的应用程序设计，决定如何对其进行处理。例如删除长时间未访问的内容、根据大小删除数据，或为用户提供选择要删除的内容的方法。

当超过可用配额时，IndexedDB 和缓存 API 都会抛出名为 `QuotaExceededError` 的 `DOMError`。

### IndexedDB

如果来源已超过其配额，则尝试写入 IndexedDB 将失败。系统会调用事务的 `onabort()` 处理程序，同时传递一个事件。该事件将在错误属性中包括 `DOMException`。检查错误 `name` 将返回 `QuotaExceededError`。

```js
const transaction = idb.transaction(['entries'], 'readwrite');
transaction.onabort = function(event) {
  const error = event.target.error; // DOMException
  if (error.name == 'QuotaExceededError') {
    // 此处为回退代码
  }
};
```

### 缓存 API

如果来源已超过其配额，则尝试写入缓存 API 将被拒绝并返回 `QuotaExceededError` `DOMException`。

```js
try {
  const cache = await caches.open('my-cache');
  await cache.add(new Request('/sample1.jpg'));
} catch (err) {
  if (error.name === 'QuotaExceededError') {
    // 此处为回退代码
  }
}
```

## 逐出如何运作？ {: #逐出 }

Web 存储分为两个存储桶：“最大努力”和“永久”。最大努力意味着浏览器可以在不中断用户的情况下清除存储，但对于长期或关键数据的持久性较差。当存储较少时，不会自动清除永久存储。用户需要手动清除此存储（通过浏览器设置）。

默认情况下，站点的数据（包括 IndexedDB、缓存 API 等）属于最大努力类别，这意味着除非站点已[请求永久存储](/persistent-storage/)，否则浏览器可能会自行决定逐出站点数据，例如，当设备存储较少时。

最大努力的逐出策略如下：

- 当浏览器空间不足时，基于 Chromium 的浏览器将开始逐出数据，首先从最近最少使用的来源中清除所有站点数据，然后是下一个，直到浏览器不再超过限制。
- Internet Explorer 10+ 不会逐出数据，但会阻止来源再写入新增数据。
- 当可用磁盘空间被填满时，Firefox 将开始逐出数据，首先从最近最少使用的来源中清除所有站点数据，然后是下一个，直到浏览器不再超过限制。
- Safari 以前并不逐出数据，但最近对所有可写存储实施了新的七天上限（见下文）。

从 iOS 和 iPadOS 13.4 以及 macOS 上的 Safari 13.1 开始，所有脚本可写存储都有七天的上限，包括 IndexedDB、服务工作进程注册和缓存 API。这意味着如果用户不与站点交互，Safari 将在 Safari 使用七天后从缓存中逐出所有内容。此逐出策略**不适用于已安装的 PWA**（它们已添加到主屏幕上）。有关完整的详细信息，请参阅 WebKit 博客上的[完全第三方 Cookie 拦截等](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)。

{% Aside %}您可以为您的网站请求[永久存储](/persistent-storage/)，以保护关键用户或应用程序数据。{% endAside %}

## 额外存储空间：为什么要对 IndexedDB 使用包装器

IndexedDB 为低级 API，在使用前需要进行大量设置，这对于存储简单数据而言尤其痛苦。与大多数现代基于 Promise 的 API 不同，它基于事件。Promise 包装器（比如适用于 IndexedDB 的 [idb](https://www.npmjs.com/package/idb)）隐藏了一些强大的功能，但更重要的是，隐藏了 IndexedDB 库附带的复杂机制（例如事务、架构版本控制）。

## 结论

有限存储和促使用户存储越来越多数据的日子已经一去不复返了。站点可以有效地存储它们运行所需的所有资源和数据。使用 [StorageManager API](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate)，您可以确定有多少空间可供您使用，以及您已经使用了多少。使用[永久存储](/persistent-storage/)时，除非用户将其删除，否则您可以保护它免遭逐出。

### 其他资源

- [IndexedDB 最佳实践](/indexeddb-best-practices/)
- [Chrome Web 存储和配额概念](https://docs.google.com/document/d/19QemRTdIxYaJ4gkHYf2WWBNPbpuZQDNMpUVf8dQxj4U/preview)

### 鸣谢

特别感谢 Jarryd Goodman、Phil Walton、Eiji Kitamura、Daniel Murphy、Darwin Huang、Josh Bell、Marijn Kruisselbrink 和 Victor Costan 对本文的审阅。感谢 Eiji Kitamura、Addy Osmani 和 Marc Cohen 撰写本文所基于的原始文章。Eiji 编写了一个名为 [Browser Storage Abuser](http://demo.agektmr.com/storage/) 的有用工具，可用于验证当前行为。它允许您存储尽可能多的数据并查看浏览器的存储限制。感谢 Francois Beaufort 对 Safari 的深入研究，找出其存储限制。

主图由 Guillaume Bolduc 在 [Unsplash](https://unsplash.com/photos/uBe2mknURG4) 上创作。
