---
layou: post
title: 准备进行 AppCache 移除
subhead: Chrome 85 默认取消了对 AppCache 的支持。大多数开发人员应立即从 AppCache 迁移，不要再等待。
authors:
  - jeffposnick
description: Chrome 和其他浏览器的 AppCache 移除计划的详细信息。
date: 2020-05-18
updated: 2021-08-23
tags:
  - blog
  - chrome-84
  - origin-trials
  - service-worker
hero: image/admin/YDs2H4gLPhIwPMjPtc8o.jpg
alt: 一个老式的存储容器。
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/1776670052997660673"
---

继[之前的公告](https://blog.chromium.org/2020/01/appcache-scope-restricted.html)之后，Chrome 和其他基于 Chromium 的浏览器将不再[支持 AppCache](https://developer.mozilla.org/docs/Web/API/Window/applicationCache)。我们鼓励开发人员立即从 AppCache 迁移，不要再继续等待。

当前浏览器广泛支持的 [Service worker](https://developer.chrome.com/docs/workbox/service-worker-overview/) 是一种替代方案，可以提供 AppCache 所提供的离线体验。请参阅[迁移策略](#migration-strategies)。

## 时间线

Chrome 发布时间表[最近的变化](https://blog.chromium.org/2020/03/chrome-and-chrome-os-release-updates.html)意味着其中一些步骤的时间可能会有所不同。我们会尽量实时更新该时间表，但此时，请尽快从 AppCache 迁移，不要再继续等待特定的里程碑。

“已弃用”的功能仍然存在，但会记录不鼓励使用的警告消息。在“已移除”的功能会从浏览器中消失。

<div>
  <table>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/UKF8cK0EwMI/m/NLhsIrs-AQAJ">在非安全上下文中弃用</a></td>
    <td>Chrome 50（2016 年 4 月）</td>
    </tr>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/ANnafFBhReY/m/1Xdr53KxBAAJ?pli=1">从非安全上下文中移除</a></td>
    <td>Chrome 70（2018 年 10 月）</td>
    </tr>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/FvM-qo7BfkI/m/0daqyD8kCQAJ">在安全上下文中弃用</a></td>
    <td>Chrome 79（2019 年 12 月）</td>
    </tr>
    <tr>
    <td><a href="https://blog.chromium.org/2020/01/appcache-scope-restricted.html">AppCache 范围限制</a></td>
    <td>Chrome 80（2020 年 2 月）</td>
    </tr>
    <tr>
    <td>“反向”初始试用开始</td>
    <td>Chrome 84（2020 年 7 月）</td>
    </tr>
    <tr>
    <td>
<a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/FvM-qo7BfkI/m/AvxoE6JpBgAJ">从安全上下文中移除</a>，选择加入初始试用的用户除外</td>
    <td>Chrome 85（2020 年 8 月）</td>
    </tr>
    <tr>
    <td>完全从每个人的安全上下文中移除，初始试用已完成</td>
    <td>2021 年 10 月 5 日（大约是 Chrome 95）</td>
    </tr>
  </table>
</div>

{% Aside %} 该时间表适用于**除 iOS 之外的所有平台**上的 Chrome。在 [Android WebView](https://developer.android.com/reference/android/webkit/WebView) 中使用的 AppCache 也有一个调整后的时间表。有关更多信息，请参阅本文后面的[跨平台详情](#the-cross-platform-story)。{% endAside %}

## 初始试用

时间表列出了两个即将到来的待移除里程碑。从 Chrome 85 开始，默认情况下，Chrome 中将不再提供 AppCache。需要更多时间从 AppCache 迁移的开发人员可以[注册](https://developers.chrome.com/origintrials/#/register_trial/1776670052997660673)“反向” [初始试用](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)，以扩展 AppCache 对其 Web 应用程序的可用性。初始试用将在 Chrome 84 中开始（在 Chrome 85 中的默认移除之前），并将持续到 2021 年 10 月 5 日（大约是 Chrome 95）。届时，所有人都将完全移除 AppCache，包括那些已注册初始试用的用户。

{% Aside %} 为什么我们称其为“反向”初始试用？通常，初始试用可以让开发人员在新功能在 Chrome 中默认发布之前选择提前进行访问。在这种情况下，开发人员可以在旧技术从 Chrome 中移除后仍然可以选择继续使用，但只限暂时使用。{% endAside %}

参与“反向”初始试用：

<ol>
<li>为您的初始试用<a href="https://developers.chrome.com/origintrials/#/register_trial/1776670052997660673">申请一个令牌</a>。</li>
<li>将该令牌添加到您的 HTML 页面。这可以通过<a href="https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md#how-do-i-enable-an-experimental-feature-on-my-origin">两种方法</a>实现：<ul>
<li>在每个页面的头部添加一个 <code>origin-trial</code> <code>&lt;meta&gt;</code> 标记。例如：<code>&lt;meta http-equiv="origin-trial" content="TOKEN_GOES_HERE"&gt;</code> </li> <li> 或者，将您的服务器配置为返回包含 <code>Origin-Trial</code> HTTP 标头的响应。生成的响应标头应该类似于：<code>Origin-Trial: TOKEN_GOES_HERE</code> </li> </ul>
</li>
<li>将同一令牌添加到您的 AppCache 清单。通过清单中的新字段完成此操作，格式为：</li>
</ol>

```text
ORIGIN-TRIAL:
TOKEN_GOES_HERE
```

（`ORIGIN-TRIAL` 与您的令牌之间需要换行。）





{% Aside %} 清单的令牌**必须**位于清单本身的 `ORIGIN-TRIAL` 字段中。与 HTML 页面的令牌不同，它不能通过 HTTP 标头提供。{% endAside %}

您可以看到下面嵌入的示例项目，该项目演示了如何将正确的初始试用令牌添加到 `index.html` 和 `manifest.appcache` 文件中。

{% Glitch { id: 'appcache-reverse-ot', path: 'manfiest.appcache', height: 480 } %}

### 为什么在多个地方都需要令牌？

**同一个初始试用令牌**需要与下列各项进行关联：

- 使用 AppCache 的**所有 HTML 页面**。
- **您的所有 AppCache 清单（**通过`ORIGIN-TRIAL` 清单字段。

如果您过去参与过初始试用，您可能只是将令牌添加到您的 HTML 页面中。AppCache“反向”初始试用的特殊之处在于您还需要将令牌与您的每个 AppCache 清单相关联。

将初始试用令牌添加到您的 HTML 页面可从您的 Web 应用程序中启用 `window.applicationCache` 接口。未与令牌关联的页面将无法使用 `window.applicationCache` 方法和事件。没有令牌的页面也无法从 AppCache 加载资源。从 Chrome 85 开始，页面行为就会像 AppCache 不存在一样。

将初始试用令牌添加到您的 AppCache 清单表明每个清单仍然有效。从 Chrome 85 开始，任何没有 `ORIGIN-TRIAL` 字段的清单都将被视为格式错误，并且清单中的规则将被忽略。

### 初始试用部署时间和相关工作

虽然“反向”初始试用正式从 Chrome 84 开始，但您现在就可以[注册](https://developers.chrome.com/origintrials/#/register_trial/1776670052997660673)初始试用并将令牌添加到您的 HTML 和 AppCache 清单中。随着您的网络应用的受众逐渐升级到 Chrome 84，您已添加的任何令牌都将生效。

将令牌添加到 AppCache 清单后，请访问 `about://appcache-internals` 以确认您的本地 Chrome 实例（版本 84 或更高版本）已将初始试用令牌与清单的缓存条目正确关联。如果您的初始试用被识别，您应该在该页面上看到一个包含 `Token Expires: Tue Apr 06 2021...` 的字段与您的清单相关联：

<figure>{% Img src="image/admin/Xid94kdPT5yGbQzBL4at.jpg", alt="about://appcache-internals 界面显示了一个已识别的令牌。", width="550", height="203" %}</figure>

## 移除前测试

我们强烈建议您尽快从 AppCache 迁移。如果您想在 Web 应用上测试 AppCache 的移除，可使用 `about://flags/#app-cache` [标志](https://www.chromium.org/developers/how-tos/run-chromium-with-flags)来模拟它的移除。此标志从 Chrome 84 开始可用。

## 迁移策略 {: #migration-strategies }

[当前浏览器广泛支持的](https://developer.mozilla.org/docs/Web/API/ServiceWorker#Browser_compatibility) Service worker 是一种替代方案，可以提供 AppCache 所提供的离线体验。

我们提供了一个 [Polyfill](https://github.com/GoogleChromeLabs/sw-appcache-behavior)，它使用 Service worker 来复制 AppCache 的一些功能，但它不会复制整个 AppCache 接口。特别是，它不提供 `window.applicationCache` 接口或相关 AppCache 事件的替代。

对于更复杂的情况，像 [Workbox](https://developer.chrome.com/docs/workbox/) 这样的库提供了一种简单的方法来为您的 Web 应用创建现代 Service worker。

### Service worker 和 AppCache 不能同时使用

在制定您的迁移策略时，请记住，Chrome 将禁用在 Service worker [控制](/service-worker-lifecycle/#scope-and-control)下加载的任何页面上的 AppCache 功能。换句话说，一旦您部署了控制给定页面的 Service worker，您就无法再在该页面上使用 AppCache。

因此，我们建议您不要尝试逐个迁移到 Service worker。部署一个只包含一部分缓存逻辑的 Service worker 是错误的。您不能回退到让 AppCache 来“填补空白”。

同样，如果您在移除 AppCache 之前部署了 Service worker，然后发现需要回滚到之前的 AppCache 实现，则需要确保[取消注册](https://stackoverflow.com/a/33705250/385997)该 Service worker。只要给定页面的范围内有注册的 Service worker，就不会使用 AppCache。

## 跨平台详情

如果您想了解有关 AppCache 移除计划的更多信息，我们建议您与特定的浏览器供应商联系。

### 所有平台上的 Firefox

Firefox 在第 44 版（2015 年 9 月）中[弃用了](https://www.fxsitecompat.dev/en-CA/docs/2015/application-cache-api-has-been-deprecated/) AppCache，并在 2019 年 9 月的 Beta 和 Nightly 版本中[移除了](https://www.fxsitecompat.dev/en-CA/docs/2019/application-cache-storage-has-been-removed-in-nightly-and-early-beta/)对它的支持。

### iOS 和 macOS 上的 Safari

Safari 在 2018 年初[弃用了 AppCache](https://bugs.webkit.org/show_bug.cgi?id=181764)。

### iOS 上的 Chrome

适用于 iOS 的 Chrome 是一个特例，因为它使用与其他平台上的 Chrome 不同的浏览器引擎：[WKWebView](https://developer.apple.com/documentation/webkit/wkwebview)。使用 WKWebView 的 iOS 应用目前不支持 Service worker，并且 Chrome 的 AppCache 移除公告不包括 [AppCache 在 iOS 版 Chrome 上的可用性](https://webkit.org/status/#specification-application-cache)。如果您知道您的 Web 应用拥有大量的 iOS 版 Chrome 受众，请谨记这一点。

### Android WebView

一些 Android 应用程序的开发人员使用 Chrome [WebView](https://developer.android.com/reference/android/webkit/WebView) 来显示 Web 内容，也可能使用 AppCache。但是，无法为 WebView 启用初始试用。因此，Chrome WebView 将支持 AppCache，无初始试用，直到预计在 Chrome 90 进行的最终移除。

## 了解更多

以下是一些供开发人员从 AppCache 迁移到 Service worker 的资源。

### 文章

- [Service worker：简介](https://developer.chrome.com/docs/workbox/service-worker-overview/)
- [Service worker 生命周期](/service-worker-lifecycle/)
- [渐进式 Web 应用培训](https://developers.google.com/web/ilt/pwa)
- [网络可靠性](/reliable/)

### 工具

- [AppCache Polyfill](https://github.com/GoogleChromeLabs/sw-appcache-behavior)
- [Workbox](https://developer.chrome.com/docs/workbox/)
- [PWA 生成器](https://www.pwabuilder.com/)

## 获得帮助

如果您使用特定工具遇到问题，请在其 GitHub 存储库中提出问题。

您可以使用标签 <code>[html5-appcache](https://stackoverflow.com/questions/tagged/html5-appcache)</code> 标签在 [Stack Overflow](https://stackoverflow.com/) 上询问有关迁移 AppCache 的一般问题。

如果您遇到与 Chrome 的 AppCache 移除相关的错误，请使用 Chromium 问题跟踪器[报告](https://crbug.com/new)。

*主图取材于[史密森学会档案馆，Acc. 11-007，Box 020, 图像编号 MNH-4477。](https://www.si.edu/object/usnm-storage-drawer:siris_arc_391797)*
