---
layout: post
title: 链接没有可辨别的名称
description: 了解如何使您的网页上的链接更易于访问——确保它们的名称可以被辅助技术解释。
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - link-name
---

可辨别、独特且可聚焦的链接文本可改善用户对屏幕阅读器和其他辅助技术的导航体验。

## Lighthouse 审计如何失败

Lighthouse 标记没有可辨别名称的链接：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6enCwSloHJSyylrNIUF4.png", alt="显示链接没有可识别名称的 Lighthouse 审计", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 如何为链接添加可访问的名称

与按钮类似，链接主要从其文本内容中获取其可访问的名称。避免像“这里”或“阅读更多”这样的填充词；相反，将最有意义的文本放入链接本身：

```html
Check out <a href="…">our guide to creating accessible web pages</a>.
</html>
```

请在[标签按钮和链接](/labels-and-text-alternatives#label-buttons-and-links)中了解更多信息。

## 资源

- [**链接没有可辨别的名称**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/link-name.js)
- [链接必须有可辨别的文本（Deque University）](https://dequeuniversity.com/rules/axe/3.3/link-name)
