---
layout: post
title: 按钮没有可访问的名称
description: 了解如何通过确保所有按钮都有使用辅助技术的用户可访问的名称，来提高网页的可访问性。
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - button-name
---

当按钮没有可访问的名称时，屏幕阅读器和其他辅助技术会将其声明为*按钮* ，这样就不会向用户提供按钮功能的信息。

## Lighthouse 按钮名称审计失败的原因

Lighthouse 会标记出缺少文本内容或 `aria-label` 属性的按钮：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/evoQAq4c1CBchwNMl9Uq.png", alt="Lighthouse 审计显示按钮没有可访问的名称", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 如何为按钮添加可访问的名称

对于带有可见标签的按钮，请将文本内容添加到 `button` 元素中。使标签成为明确的调用操作。例如：

```html
<button>Book room</button>
```

对于没有可见标签的按钮，比如图标按钮，请使用 `aria-label` 属性向使用辅助技术的用户清楚地描述操作，例如：

{% Glitch { id: 'lh-button-name', path: 'index.html', previewSize: 0, height: 480 } %}

{% Aside %} 此示例应用依赖 Google 的 [Material icon font](https://google.github.io/material-design-icons/) ，它使用[连字](https://alistapart.com/article/the-era-of-symbol-fonts/)将按钮的内部文本转换为图标字形。在宣布按钮时，辅助技术将引用 `aria-label`，而不是图标字形。{% endAside %}

另请参阅[标签按钮和链接](/labels-and-text-alternatives#label-buttons-and-links)。

## 资源

- [**按钮没有可访问的名称**审计源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/button-name.js)
- [按钮必须有可辨别的文字（德克大学）](https://dequeuniversity.com/rules/axe/3.3/button-name)
