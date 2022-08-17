---
layout: post
title: 图像元素没有 `[alt]` 属性
description: 了解如何通过提供替代文本来确保辅助技术用户可以访问网页的图像。
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - image-alt
---

信息元素适合简短的描述性替代文本。对于空 alt 属性，可以忽略装饰元素。

## Lighthouse 图像替代文本审核为何失败

Lighthouse 标记没有 `alt` 属性的 `<img>` 元素：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hb8ypHK5xwmtUZwdxyQG.png", alt="显示 <img> 元素没有 alt 属性的 Lighthouse 审核", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 如何为图像添加替代文本

为每个 `<img>` 元素提供一个 `alt` 属性。如果图像加载失败，则会将 `alt` 文本作为占位符，这样，用户才能知道图像想要表达什么。（另请参阅[包括图像和对象的替代文本](/labels-and-text-alternatives#include-text-alternatives-for-images-and-objects)。）

大多数图像都应有简短的描述性文本：

```html
<img alt="Audits set-up in Chrome DevTools" src="...">
```

如果图像用作装饰，并且没有提供任何有用的内容，您可以给它一个空的 `alt=""` 属性，以便将其从可访问性树中删除：

```html
<img src="background.png" alt="">
```

{% Aside 'note' %} 您还可以使用 ARIA 标签来描述图像，例如 `<img aria-label="Audits set-up in Chrome DevTools" src="...">` 另请参阅[使用 aria-label 属性](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute)和[使用 aria-labelledby 属性](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute)。{% endAside %}

## 编写有效 `alt` 文本的提示

- `alt` 文本要体现图像的意图、目的和含义。
- 盲人用户要从替代文本获得的信息要与视力正常的用户从图像获得的信息多少相同。
- 避免使用“图表”、“图像”或“图形”等非特定词。

要了解更多信息，请参阅 [WebAIM 的替代文本指南](https://webaim.org/techniques/alttext/)。

## 资源

- [**没有 `[alt]` 属性的图像元素**审核的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/image-alt.js)
- [图像必须有替代文本 (Deque University)](https://dequeuniversity.com/rules/axe/3.3/image-alt)
