---
layout: post
title: 页面缺少 HTML 文档类型，因此触发了 Quirks 模式
description: 了解如何确保页面不会触发旧版浏览器中的 Quirks 模式。
web_lighthouse:
  - 文档类型
date: 2019-05-02
updated: 2019-08-28
---

指定文档类型可防止浏览器切换到 [Quirks 模式](https://developer.mozilla.org/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)，从而导致页面以[意外方式呈现](https://quirks.spec.whatwg.org/#css)。

## Lighthouse 文档类型审核为何失败

没有 `<!DOCTYPE html>` 声明的 [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 标记页面：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l6IEjHdtgCa45QimENjb.png", alt="Lighthouse 审核显示缺少文档类型", width="800", height="76" %}</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 如何添加文档类型声明

将 `<!DOCTYPE html>` 声明添加到 HTML 文档的顶部：

```html
<!DOCTYPE html>
<html lang="en">
…
```

有关更多信息，请参阅 MDN 的 [Doctype](https://developer.mozilla.org/docs/Glossary/Doctype) 页面。

## 资源

- 页面的[源代码**缺少 HTML 文档类型，因此触发了 Quirks 模式**审核](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/doctype.js)
- [Doctype](https://developer.mozilla.org/docs/Glossary/Doctype)
- [Quirks 模式和标准模式](https://developer.mozilla.org/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)
