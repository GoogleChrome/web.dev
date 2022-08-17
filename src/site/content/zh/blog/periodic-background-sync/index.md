---
layout: post
title: 使用后台定期同步 API 提供更丰富的离线体验
subhead: 在后台同步网络应用程序的数据以获得更相似的体验
authors:
  - jeffposnick
  - joemedley
date: 2019-11-10
updated: 2020-08-18
hero: image/admin/Bz7MndcsUGPLAnQwIMfJ.jpg
alt: 同步飞行的彩色飞机
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/4048736065006075905"
description: 后台定期同步可让 Web 应用程序在后台定期同步数据，从而使 Web 应用程序的行为更接近 iOS/Android/桌面应用程序。
tags:
  - capabilities
  - blog
  - progressive-web-apps
  - service-worker
  - chrome-80
feedback:
  - api
---

{% Aside %} Web 应用程序要像 iOS/Android/桌面应用程序一样具有强大的功能。为了实现这一目标，[Capabilities 项目](https://developer.chrome.com/blog/capabilities/)中的后台定期同步只是其中一个功能。要了解其他功能和关注其进展，请关注 [Web 新功能揭秘](https://developer.chrome.com/blog/capabilities/)。{% endAside %}

您是否遇到过下面的情况？

- 乘坐火车或地铁时网络连接不稳定或没有网络
- 观看太多视频后被运营商限制连接
- 生活在带宽难以满足需求的乡村

如果您遇到过，您一定会觉得在 Web 上做某些事情令人沮丧，您还会想知道为什么特定于平台的应用程序在这些情况下通常表现得更出色。特定于平台的应用程序可以提前获取新鲜内容，比如说新闻或天气信息。即使在没有网络的地铁内，您仍然可以阅读新闻。

后台定期同步可让 Web 应用程序在后台定期同步数据，从而使 Web 应用程序的行为更接近特定于平台的应用程序。

## 当前状态

下表介绍了后台定期同步 API 的当前状态。

<table>
<tr>
<th markdown="block">步骤</th>
<th markdown="block">状态</th>
</tr>
<tr>
<td markdown="block">1. 创建解释文档</td>
<td markdown="block"><a href="https://github.com/WICG/BackgroundSync/tree/master/explainers">完成</a></td>
</tr>
<tr>
<td markdown="block">2. 创建规范初稿</td>
<td markdown="block"><a href="https://wicg.github.io/periodic-background-sync/" rel="noopener">完成</a></td>
</tr>
<tr>
<td markdown="block">3. 收集反馈与迭代设计</td>
<td markdown="block">进行中</td>
</tr>
<tr>
<td markdown="block">4. 来源测试</td>
<td markdown="block"><a>完成</a></td>
</tr>
<tr>
<td markdown="block"><strong>5. 发布</strong></td>
<td markdown="block"><strong>Chrome 80</strong></td>
</tr>
</table>

## 试用一下

您可以对[实时演示应用程序](https://webplatformapis.com/periodic_sync/periodicSync_improved.html)尝试使用后台定期同步。使用之前，请确保：

- 使用的是 Chrome 80 或更高版本。
- 启用后台定期同步之前先[安装](https://developers.google.com/web/fundamentals/app-install-banners/) Web 应用程序。

## 概念和用法

后台定期同步可让您在渐进式 Web 应用程序或服务工程进程支持的页面启动时显示新内容。在未使用应用程序或页面时，它通过在后台下载数据来实现此目的。这可以防止在查看时，应用程序内容在启动后刷新。更好的一点是，它可以防止应用程序在刷新之前显示内容旋转图标。

如果没有后台定期同步，Web 应用程序必须使用替代方法来下载数据。一个常见的例子是使用推送通知来唤醒服务工作进程。用户会被“新数据可用”之类的消息干扰。更新数据在本质上会产生负面效果。您仍然可以选择为真正重要的更新推送通知，例如重大突发新闻。

后台定期同步很容易与后台同步混淆。虽然它们的名称相似，但用例截然不同。其中，后台同步最常用于在前一个请求失败时将数据重新发送到服务器。

### 确保适当的用户参与度

如果执行不当，后台定期同步可能会浪费用户的资源。为了确保正确，在发布之前，Chrome 会试运行一段时间。本节介绍了 Chrome 为了让该功能尽可能有用而采取的一些设计决策。

Chrome 的第一个设计决策是，Web 应用程序只能在用户将其安装到设备上并作为独特应用程序启动后才能使用后台定期同步。Chrome 的常规选项卡上下文中不会提供后台定期同步。

此外，由于 Chrome 不希望未使用或很少使用的 Web 应用程序无故消耗电池或数据，因此，Chrome 在设计后台定期同步时，要求开发人员必须向用户提供价值才能使用此功能。具体而言，Chrome 使用[站点参与度分数](https://www.chromium.org/developers/design-documents/site-engagement) (`about://site-engagement/`) 来确定特定 Web 应用程序是否以及多久会发生后台定期同步。换句话说，除非参与度分数大于零，否则根本不会触发 `periodicsync` 事件，并且分数值会影响触发 `periodicsync` 事件的频率。这可以确保只有正在频繁使用的应用程序才会在后台同步。

后台定期同步与流行平台上的现有 API 及实践有一些相似点。例如，一次性后台同步以及推送通知允许 Web 应用程序的逻辑在用户关闭页面后继续活动一段时间（通过应用程序的服务工作进程）。在大多数平台上，人们通常会安装在后台定期访问网络的应用程序，以便为关键更新、预取内容、同步数据等提供更好的用户体验。同样，后台定期同步也会延长 Web 应用程序逻辑的生命周期，让其定期运行，一次可能只运行几分钟。

如果浏览器允许这种情况频繁发生而不加以限制，则可能会导致一些隐私问题。下面是 Chrome 解决后台定期同步风险的方法：

- 仅设备之前连接过的网络上会发生后台同步活动。Chrome 建议仅连接到由可信方运营的网络。
- 与所有 Internet 通信一样，后台定期同步会显示客户端的 IP 地址，与之通信的服务器以及服务器的名称。为了将这种暴露程度降低到应用程序仅在前台同步时的大致程度，浏览器会限制应用程序后台同步的频率，使其与用户使用应用程序的频率保持一致。如果用户停止频繁与应用程序交互，则停止触发后台定期同步。这是对特定平台应用程序现状的净改进。

### 何时可以使用？

可利用的规则因浏览器而异。综上所述，Chrome 对后台定期同步提出了以下要求：

- 特定的用户参与度分数。
- 存在之前使用过的网络。

同步时间不受开发人员控制。同步频率与应用程序的使用频率保持一致。（请注意，特定于平台的应用程序目前不这样做。）它还考虑了设备的电源和连接状态。

### 何时需要使用？

当服务工作进程启动来处理 `periodicsync` 事件时，您有*机会*请求数据，但没有*义务*这样做。在处理事件时，您要考虑网络条件和可用存储空间，并下载不同数量的数据来进行响应。以下资源可以为您提供帮助：

- [网络信息 API](https://developer.mozilla.org/docs/Web/API/Network_Information_API)
- [检测流量节省模式](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/save-data/#detecting_the_save-data_setting)
- [估计可用存储空间](https://developers.google.com/web/updates/2017/08/estimating-available-storage-space)

### 权限

安装服务工作进程后，使用[权限 API](https://developer.mozilla.org/docs/Web/API/Permissions_API) 查询`periodic-background-sync`。您可以从窗口或服务工作进程上下文中执行此操作。

```js
const status = await navigator.permissions.query({
  name: 'periodic-background-sync',
});
if (status.state === 'granted') {
  // 可使用后台定期同步。
} else {
  // 不能使用后台定期同步。
}
```

### 注册定期同步

如前所述，后台定期同步需要服务工作进程。使用 `ServiceWorkerRegistration.periodicSync` 检索`PeriodicSyncManager` 并在其中调用 `register()`。注册需要标签和最小同步间隔 (`minInterval`)。该标签可标识注册的同步，以便注册多个同步。在下面的示例中，标签名称是 `'content-sync'`，而 `minInterval` 是一天。

```js/3-5
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  try {
    await registration.periodicSync.register('content-sync', {
      // An interval of one day.
      minInterval: 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    // Periodic background sync cannot be used.
  }
}
```

### 验证注册

调用 `periodicSync.getTags()` 来检索注册标签数组。下面的示例使用标签名称来确认缓存更新处于活动状态，从而避免再次更新。

```js/2,4
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  const tags = await registration.periodicSync.getTags();
  // 仅在未设置同步时更新内容。
  if (!tags.includes('content-sync')) {
    updateContentOnPageLoad();
  }
} else {
  // 如果不支持后台定期更新，则始终更新。
  updateContentOnPageLoad();
}
```

您还可以使用 `getTags()`，以便在 Web 应用程序的设置页面上显示活动注册列表，从而让用户启用或禁用特定类型的更新。

### 响应后台定期同步事件

要响应后台定期同步事件，请向服务工作进程添加 `periodicsync` 事件处理程序。传递给它的 `event` 对象将包含一个与注册期间使用的值匹配的 `tag` 参数。例如，如果已使用名称 `'content-sync'` 注册后台定期同步，则 `event.tag` 将为 `'content-sync'`。

```js
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    // 查看"先思考后同步"一节，
    // 了解在同步之前可执行的检查。
    event.waitUntil(syncContent());
  }
  // 根据需要为不同的标签提供其他逻辑。
});
```

### 取消注册同步

要结束注册的同步，请使用要取消注册的同步的名称调用 `periodicSync.unregister()`。

```js
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  await registration.periodicSync.unregister('content-sync');
}
```

## 接口

下面是对后台定期同步 API 提供的接口的简要介绍。

- `PeriodicSyncEvent`。在浏览器选择的时间传递给 `ServiceWorkerGlobalScope.onperiodicsync`。
- `PeriodicSyncManager`。注册和取消注册定期同步并为注册的同步提供标签。从 ServiceWorkerRegistration.periodicSync` 属性中检索此类的实例。
- `ServiceWorkerGlobalScope.onperiodicsync`。注册一个处理程序来接收 `PeriodicSyncEvent`。
- `ServiceWorkerRegistration.periodicSync`。返回 `PeriodicSyncManager` 的引用。

## 示例

### 更新内容

以下示例使用后台定期同步来下载和缓存新闻站点或博客的最新文章。请注意标签名称，它表示同步的类型 (`'update-articles'`)。`updateArticles()` 的调用包含在 `event.waitUntil()` 中，从而使服务工作进程不会在完成文章下载和存储之前终止。

```js/7
async function updateArticles() {
  const articlesCache = await caches.open('articles');
  await articlesCache.add('/api/articles');
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-articles') {
    event.waitUntil(updateArticles());
  }
});
```

### 向现有 Web 应用程序添加后台定期同步

需要[进行这一组更改](https://github.com/GoogleChromeLabs/so-pwa/pull/11)才能将后台定期同步添加到[现有 PWA](https://so-pwa.firebaseapp.com/)。该示例包含许多有用的日志记录语句，它们描述了 Web 应用程序中后台定期同步的状态。

## 调试

在本地测试时获取后台定期同步的端到端视图可能是一项挑战。在调试 Web 应用程序的行为时，有关活动注册、大致同步间隔和过去同步事件日志的信息提供了有价值的上下文。幸运的是，您可以通过 Chrome DevTools 中的实验功能找到所有这些信息。

{% Aside %}Chrome 81 及更高版本已启用后台定期同步调试。{% endAside %}

### 记录本地活动

DevTools 的**后台定期同步**部分围绕后台定期同步生命周期中的关键事件进行组织：注册同步、执行后台同步和取消注册。要获取有关这些事件的信息，请单击**开始记录**。

<figure>{% Img src="image/admin/wcl5Bm6Pe9xn5Dps6IN6.png", alt="DevTools 中的记录按钮", width="708", height="90" %}<figcaption>DevTools 中的记录按钮</figcaption></figure>

记录时，条目将出现在与事件对应的 DevTools 中，并为每个条目记录上下文和元数据。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/m92Art0OwiM0VyI7czFB.png", alt="记录的后台定期同步数据示例", width="800", height="357", style="max-width: 75%" %} <figcaption>记录的后台定期同步数据示例</figcaption></figure>

启用记录一次后，它最多会保持启用状态三天，从而允许 DevTools 获取有关可能发生的后台同步的本地调试信息（甚至在未来几小时内）。

### 模拟事件

虽然记录后台活动可能会有所帮助，但有时您需要立即测试 `periodicsync` 处理程序，而不是等待事件按照正常进程触发。

您可以通过 Chrome DevTools 的应用程序面板中的**服务工作进程**部分执行此操作。**定期同步**字段允许您为要使用的事件提供一个标签，并根据需要多次触发它。

{% Aside %} 手动触发 `periodicsync` 事件需要 Chrome 81 或更高版本。{% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BQ5QdjwaRDP42cHqW98W.png", alt="应用程序面板中的“服务工作进程”部分显示了“定期同步”文本字段和按钮。", width="800", height=" 321", style="max-width: 90%" %}</figure>

## 使用 DevTools 界面

从 Chrome 81 开始，您将在 DevTools *应用程序*面板中看到**后台定期同步**部分。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eYJtJfZ9Qo145lUQe4Ur.png", alt="显示后台定期同步部分的应用程序面板", width="382", height="253", style="max-width: 75%" %}</figure>
