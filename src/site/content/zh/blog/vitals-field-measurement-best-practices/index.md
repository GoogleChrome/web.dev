---
title: 实测 Web 指标的最佳实践
subhead: 如何使用您当前的分析工具测量 Web 指标。
authors:
  - philipwalton
description: 如何使用您当前的分析工具测量 Web 指标
date: 2020-05-27
updated: 2020-07-21
hero: image/admin/WNrgCVjmp8Gyc8EbZ9Jv.png
alt: 如何使用您当前的分析工具测量 Web 指标
tags:
  - blog
  - performance
  - web-vitals
---

能够测量和报告页面的真实世界性能对于诊断和不断改进性能至关重要。如果没有[实际数据](/user-centric-performance-metrics/#in-the-field)，就无法确定您对网站所做的更改是否确实达到了预期的结果。

许多热门[真实用户监控 (RUM)](https://en.wikipedia.org/wiki/Real_user_monitoring) 分析供应商已经在他们的工具中支持[核心 Web 指标](/vitals/#other-web-vitals)（以及许多[其他 Web 指标](/vitals/#core-web-vitals)）。如果您目前正在使用其中一种 RUM 分析工具，那么您就可以很好地评估您的网站页面针对[核心 Web 指标建议阈值](/vitals/#core-web-vitals)的实现情况，并防止将来出现回归。

虽然我们建议您使用支持核心 Web 指标的分析工具，但如果您当前使用的分析工具不提供该支持，您也不一定需要更换工具。几乎所有分析工具都提供了一种定义和测量[自定义指标](https://support.google.com/analytics/answer/2709828)或[事件](https://support.google.com/analytics/answer/1033068)的方法，也就是说，您或许可以使用当前的分析供应商来测量核心 Web 标并将这些指标添加到您现有的分析报告和仪表板中。

本篇指南探讨了使用第三方或内部分析工具测量核心 Web 指标（或任何自定义指标）的最佳实践。对于希望在自己的服务中添加核心 Web 指标支持的分析供应商来说，这篇文章也可以作为一篇指南。

## 使用自定义指标或事件

如上所述，大多数分析工具可以让您测量自定义数据。如果您的分析工具支持这一功能，那么您应该能够使用下方的机制测量各项核心 Web 指标。

在分析工具中测量自定义指标或事件通常分为三个步骤：

1. 在您的工具管理中[定义或注册](https://support.google.com/analytics/answer/2709829?hl=en&ref_topic=2709827)自定义指标（如有需要）。*（注意：并非所有分析供应商都要求提前定义自定义指标。）*
2. 在您的前端 JavaScript 代码中计算指标值。
3. 将指标值发送到您的分析后端，确保名称或 ID 与步骤 1 中定义的内容*（如有需要）*相匹配。

对于步骤 1 和步骤 3，您可以参考您分析工具的文档说明。对于步骤 2，您可以使用 [web-vitals](https://github.com/GoogleChrome/web-vitals) JavaScript 库来计算每项核心 Web 指标的值。

以下代码示例展示了在代码中跟踪这些指标并将其发送到分析服务十分轻松简单。

```js
import {getCLS, getFID, getLCP} from 'web-vitals';

function sendToAnalytics({name, value, id}) {
  const body = JSON.stringify({name, value, id});
  // 可以的话，使用 `navigator.sendBeacon()`, 回退到 `fetch()`.
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
      fetch('/analytics', {body, method: 'POST', keepalive: true});
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

## 确保您可以报告分布情况

您在计算了每项核心 Web 指标的值并使用自定义指标或事件将这些指标值发送到您的分析服务后，下一步就是构建一个报告或仪表板，用以显示已收集的值。

为确保您满足[核心 Web 指标建议阈值](/vitals/#core-web-vitals)，您会需要报告显示每项指标在第 75 个百分位数的值。

如果您的分析工具不提供内置的分位数报告功能，您应该仍然可以通过生成一份将各项指标按升序排列的报告来手动获取此数据。报告生成后，所有数值构成的完整排序列表中处于 75% 位置的结果将是该指标的第 75 个百分位数，而且这适用于您的任何数据细分方式（按设备类型、连接类型、国家/地区等）。

如果您的分析工具默认不为您提供指标级别的报告粒度，那么在您的分析工具支持[自定义维度](https://support.google.com/analytics/answer/2709828)的情况下，您还是能够获得相同的结果。通过为您跟踪的每项单独指标实例设置唯一的自定义维度值，您就应该能够在报告配置中包含了自定义维度的前提下，生成按单个指标实例进行细分的报告。由于每个实例将具有唯一的维度值，因此不会发生分组。

[Web 指标报告](https://github.com/GoogleChromeLabs/web-vitals-report)是通过 Google 分析使用上述技巧的一个示例。该报告的代码是[开源的](https://github.com/GoogleChromeLabs/web-vitals-report)，因此开发者可以将其作为本节所介绍技巧的参考示例。

![Web 指标报告的屏幕截图](https://user-images.githubusercontent.com/326742/101584324-3f9a0900-3992-11eb-8f2d-182f302fb67b.png)

{% Aside %} 提示： [`web-vitals`](https://github.com/GoogleChrome/web-vitals) JavaScript 库为所报告的每个指标实例提供一个 ID，从而可以在大多数分析工具中建立分布。请参阅[`Metric`](https://github.com/GoogleChrome/web-vitals#metric)接口文档了解更多详情。{% endAside %}

## 在正确的时间发送您的数据

一些性能指标可以在页面完成加载后进行计算，而其他指标（如 CLS）则会将页面的整个生命周期纳入考量范围，且只有在页面开始卸载后才会完成计算。

然而，这可能会导致一些问题，因为`beforeunload`和`unload`事件都不可靠（特别是在移动设备上），因此我们[不建议](https://developer.chrome.com/blog/page-lifecycle-api/#legacy-lifecycle-apis-to-avoid)您使用这些事件（因为这些事件会导致页面不符合[往返缓存](https://developer.chrome.com/blog/page-lifecycle-api/#what-is-the-back-forward-cache)的条件）。

对于跟踪整个页面生命周期的指标，最好一旦在页面的可见性状态更改为`hidden`时，就在`visibilitychange`事件的过程中发送指标的当前值。这是因为一旦页面的可见性状态更改为`hidden`，就无法保证该页面上的任何脚本都能够再次运行。这一点在移动操作系统上尤其如此，在这些操作系统中，浏览器应用程序本身就可以在无需触发任何页面回调的情况下被关闭。

请注意，移动操作系统通常会在切换选项卡、切换应用程序或关闭浏览器应用程序本身时触发`visibilitychange`事件。这些操作系统还会在关闭选项卡或导航到新页面时触发`visibilitychange`事件。这使得`visibilitychange`事件比`unload`或`beforeunload`事件更为可靠。

{% Aside 'gotchas' %} 由于[一些浏览器错误](https://github.com/w3c/page-visibility/issues/59#issue-554880545)，`visibilitychange`事件在少数情况下不会触发。如果您正在构建自己的分析库，那么知道这些错误的存在就非常重要。请注意，[web-vitals](https://github.com/GoogleChrome/web-vitals) JavaScript 库已经考虑到了所有这些错误。{% endAside %}

## 监控性能随时间推移的变化

在您更新了您的分析实施措施来对核心 Web 指标进行跟踪和报告后，下一步就是跟踪您对网站做出的更改如何随着时间的推移影响性能表现。

### 对您做的更改进行版本管理

一种天真（且最终并不可靠）的对更改进行跟踪的方法是将更改部署到生产环境中，然后假定部署日期之后收到的所有指标都对应于新版本的网站，而部署日期之前收到的所有指标都对应于旧版本的网站。然而，任何因素（包括在 HTTP、Service Worker 或 CDN 层中的缓存）都可以导致差错。

更好的方法是为每个已部署的更改创建一个独特的版本，然后在您的分析工具中跟踪该版本。大多数分析工具都支持版本设置。如果您的工具中不行，则可以创建一个自定义维度并将该维度设置为您部署的版本。

### 运行实验

您可以同时跟踪多个版本（或实验）来实现进一步的版本管理。

如果您的分析工具允许您定义实验组，请使用该功能。否则，您可以使用自定义维度来确保您的每个指标值都可以关联到报告中的一个特定实验组。

您还可以在分析中进行实验，向部分用户推出实验性更改，并将该更改的性能与对照组中的用户性能进行比较。当您确信某个更改确实可以提高性能后，就可以将其推广给所有用户。

{% Aside %} 您始终应该将实验组设置在服务器上。请避免在客户端上使用任何实验或 A/B 测试工具。在确定用户的实验组之前，这些工具通常会阻塞渲染，因而可能会影响您的 LCP 时间。{% endAside %}

## 确保测量不会影响性能

在测量真实用户性能时，至关重要的一点是您正在运行的任何性能测量代码都不会对您的页面性能产生负面影响。如果产生了负面影响，那么您在性能如何对业务产生影响方面试图得出的任何结论都是不可靠的，因为您永远无法知道分析代码本身的存在是否会产生最大的负面影响。

在您的生产环境网站上部署 RUM 分析代码时，请始终遵循以下原则：

### 延迟加载您的分析代码

分析代码应该始终以异步、非阻塞的方式加载，并且通常应该最后加载。如果您以阻塞方式加载分析代码，则会对 LCP 产生负面影响。

用于测量核心 Web 指标的所有 API 都是特别为支持异步和延迟脚本加载（通过[`buffered`](https://www.chromestatus.com/feature/5118272741572608)标志）而设计的，因此无需急于提前加载脚本。

如果您测量的指标无法在页面加载时间轴的后期进行计算，您应该*只*将需要提前运行的代码内联到`<head>`中（这样就不是一个[阻塞渲染请求](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources/)）并延迟加载其余的代码。不要仅仅因为单项指标的需要而提前加载所有分析代码。

### 不要创建长任务

分析代码通常为响应用户输入而运行，但如果您的分析代码正在执行大量 DOM 测量或使用其他处理器密集型 API，那么分析代码本身可能会导致较差的输入响应度。此外，如果包含您分析代码的 JavaScript 文件很大，则执行该文件可能会阻塞主线程并对 FID 产生负面影响。

### 使用非阻塞 API

诸如<code>[sendBeacon()](https://developer.mozilla.org/docs/Web/API/Navigator/sendBeacon)</code>和<code>[requestIdleCallback()](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback)</code>这样的 API 是专门为运行不会阻塞用户关键任务的非关键任务而设计的。

这些 API 是适于在 RUM 分析库中使用的绝佳工具。

一般来说，所有分析信标都应该使用`sendBeacon()` API（如果可用）来发送，而所有被动分析测量代码都应该在空闲期运行。

{% Aside %} 有关如何最大限度地利用空闲期，同时仍能确保可以在需要时（例如当用户卸载页面时）紧急运行代码的指导，请参阅[空闲直到紧急](https://philipwalton.com/articles/idle-until-urgent/)模式。{% endAside %}

### 不要跟踪超出您需要的数据

浏览器会公开大量性能数据，但数据可用并不一定意味着您应该进行记录并将其发送到您的分析服务器。

例如，[资源计时 API](https://w3c.github.io/resource-timing/) 为页面上加载的每个资源提供详细的计时数据。但并非所有这些数据对于改善资源加载性能都是必要或有用的。

简而言之，不要仅仅因为数据存在就进行跟踪，先确保会使用数据，再消耗资源跟踪该数据。
