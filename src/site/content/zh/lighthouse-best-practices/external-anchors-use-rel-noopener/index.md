---
layout: post
title: 指向跨源目的地的链接不安全
description: |2

  了解如何安全地链接到另一台主机上的资源。
web_lighthouse:
  - external-anchors-use-rel-noopener
date: 2019-05-02
updated: 2019-08-28
---

当您使用 `target="_blank"` 属性链接到另一个网站上的页面时，您的网站可能会面临性能和安全问题：

- 另一个页面可能与您的页面在同一进程上运行。如果另一个页面运行大量 JavaScript，您的页面的性能可能会受到影响。
- 另一个页面可以使用 `window.opener` 属性访问您的 `window` 对象。这可能允许其他页面将您的页面重定向到恶意 URL。

将 `rel="noopener"` 或 `rel="noreferrer"` 添加到您的 `target="_blank"` 链接避免这些问题。

{% Aside %} 从 Chromium 88 版开始，默认情况下，带有 `target="_blank"` 的锚点会自动获得 [`noopener` 行为](https://www.chromestatus.com/feature/6140064063029248)。`rel="noopener"` 的显式规范有助于保护旧版浏览器（包括 Edge Legacy 和 Internet Explorer）的用户。 {% endAside %}

## Lighthouse 跨源目的地审计如何失败

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 标记指向跨源目的地的不安全链接：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ztiQKS8eOfdzONC7bocp.png", alt="显示指向跨源目的地的不安全链接的 Lighthouse 审计", width="800", height="213" %}</figure>

Lighthouse 使用以下过程将链接识别为不安全：

1. 收集所有包含 `target="_blank"` 属性但不包含 `rel="noopener"` 或 `rel="noreferrer"` 属性的 `<a>` 标签。
2. 过滤掉任何同主机链接。

因为 Lighthouse 会过滤掉同主机链接，所以如果您在大型站点上工作，您应该注意一种边缘情况：如果一个页面包含指向您站点上另一个页面的 `target="_blank"` 链接，而未使用 `rel="noopener"`，此审计对性能的影响仍然适用。 但是，您不会在 Lighthouse 结果中看到这些链接。

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 如何提高站点性能并防止安全漏洞

将 `rel="noopener"` 或 `rel="noreferrer"` 添加到 Lighthouse 报告中标识的每个链接。通常，当您使用 `target="_blank"` 时，请始终添加 `rel="noopener"` 或 `rel="noreferrer"` ：

```html
<a href="https://examplepetstore.com" target="_blank" rel="noopener">
  Example Pet Store
</a>
```

- `rel="noopener"` 阻止新页面访问 `window.opener` 属性，并确保它在单独的进程中运行。
- `rel="noreferrer"` 具有相同的效果，但还会阻止将 `Referer` 标头发送到新页面。请参阅[链接类型“noreferrer”](https://html.spec.whatwg.org/multipage/links.html#link-type-noreferrer) 。

有关更多信息，请参阅[安全地共享跨源资源](/cross-origin-resource-sharing/)帖文。

## 资源

- [**指向跨源目的地的链接不安全**审计源代码](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/external-anchors-use-rel-noopener.js)
- [安全地共享跨源资源](/cross-origin-resource-sharing/)
- [面向 Web 开发人员的站点隔离](https://developers.google.com/web/updates/2018/07/site-isolation)
