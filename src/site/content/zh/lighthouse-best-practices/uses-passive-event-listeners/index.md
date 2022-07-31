---
layout: post
title: 使用被动监听器优化滚动体验
description: 了解如何通过避免被动事件监听器来提高页面的滚动响应能力。
web_lighthouse:
  - uses-passive-event-listeners
date: 2019-05-02
updated: 2019-08-28
---

触摸和滚轮事件监听器有利于跟踪用户交互和创建自定义滚动体验，但它们也可能会延迟页面滚动。目前，浏览器无法知晓事件监听器是否会阻止滚动，因此浏览器总是等待监听器完成执行后再滚动页面。被动事件监听器可以让您指示事件监听器永远不会阻止滚动，从而解决此问题。

## 浏览器兼容性

大多数浏览器都支持被动事件监听器。请参阅[浏览器兼容性](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener#Browser_compatibility)

## Lighthouse 被动事件监听器审计失败的方法

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 可以标记可能会延迟页面滚动的事件监听器：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/a59Rk7aCUDvyKNqqoYRJ.png", alt="Lighthouse 审计显示页面不使用被动事件监听器来提高滚动性能", width="800", height="213" %}</figure>

Lighthouse 使用以下过程来识别可能影响滚动性能的事件监听器：

1. 收集页面上的所有事件监听器。
2. 筛选掉非触摸和非滚轮监听器。
3. 筛选掉调用 `preventDefault()` 的监听器。
4. 筛选掉来自与页面不同主机的监听器。

Lighthouse 会筛选掉来自不同主机的监听器，因为您可能无法控制这些脚本。可能存在损害页面滚动性能的第三方脚本，但这些脚本未在您的 Lighthouse 报告中列出。

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 如何使事件监听器被动以提高滚动性能

为 Lighthouse 识别的每个事件监听器添加一个 `passive` 标志。

如果您只使用支持被动事件监听器的浏览器，则只需添加标志。例如：

```js
document.addEventListener('touchstart', onTouchStart, {passive: true});
```

如果您支持的[浏览器版本较旧，不支持被动事件监听器](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener#Browser_compatibility)，则需要使用功能检测或 polyfill。有关更多信息，请参阅 WICG [被动事件监听器](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)说明文档的[功能检测](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection)部分。

## 资源

- [**不使用被动监听器来提高滚动性能**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/uses-passive-event-listeners.js)
- [使用被动事件监听器提高滚动性能](https://developers.google.com/web/updates/2016/06/passive-event-listeners)
- [被动事件监听器说明文档](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
- [EventTarget.addEventListener()](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)
