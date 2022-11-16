---
layout: post
title: 使用 document.write()
description: 了解如何通过避免使用 document.write() 来加快页面加载速度。
web_lighthouse:
  - no-document-write
date: 2019-05-02
updated: 2020-06-04
---

使用 [`document.write()`](https://developer.mozilla.org/docs/Web/API/Document/write) 会导致页面内容显示延迟数十秒，对于网络连接速度较慢的用户来说，这更是一个问题。因此，在许多情况下，Chrome 会阻止执行 `document.write()`，这就意味着您不能依赖这种方法。

在 Chrome DevTools 控制台中使用 `document.write()` 时，您会看到以下消息：

```text
[Violation] Avoid using document.write().
```

在 Firefox DevTools 控制台中，您会看到以下消息：

```text
An unbalanced tree was written using document.write() causing
data from the network to be reparsed.
```

## Lighthouse `document.write()` 审核为何失败

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 对未被 Chrome 阻止的 `document.write()` 的调用：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5YbEaKuzO2kzulClv1qj.png", alt="显示 document.write 使用的 Lighthouse 审核", width="800", height="213" %}</figure>

对于最容易产生问题的用途，Chrome 将阻止对 `document.write()` 的调用或发出相关的控制台警告，具体取决于用户的连接速度。无论采用哪种方式，受影响的调用都会显示在 DevTools 控制台中。有关详细信息，请参阅 Google 的<a href="https://developers.google.com/web/updates/2016/08/removing-document-write" data-md-type="link">干预 `document.write()`</a>。

Lighthouse 会报告对 `document.write()` 的任何其他调用，因为无论如何使用，它都会对性能产生不利影响，并且我们有更好的替代方法。

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 避免使用 `document.write()`

删除代码中对 `document.write()` 的所有使用。如果已将其注入第三方脚，请尝试使用[异步加载](/critical-rendering-path-adding-interactivity-with-javascript/#parser-blocking-versus-asynchronous-javascript)。

如果第三方代码正在使用 `document.write()`，请要求提供程序支持异步加载。

## 资源

- [**使用 `document.write()`**审核的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/no-document-write.js)
- [干预 `document.write()`](https://developer.chrome.com/blog/removing-document-write/)
- [解析器阻止与异步 JavaScript](/critical-rendering-path-adding-interactivity-with-javascript/#parser-blocking-versus-asynchronous-javascript)
- [预解析](https://developer.mozilla.org/docs/Glossary/speculative_parsing)
