---
layout: post
title: 表单元素没有关联标签
description: 了解如何通过提供标签使表单元素可供辅助技术用户访问。
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - label
---

标签可确保通过诸如屏幕阅读器等辅助技术正确地朗读表单控件。辅助技术用户依靠这些标签在表单中导航。鼠标和触摸屏用户也可以从标签中受益，因为标签文本会使点击目标更大。

## 此 Lighthouse 审计是如何失败的

 Lighthouse 会将没有关联标签的元素标记出来：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMWt5UyiUUskhKHUcYoN.png", alt="Lighthouse 审计显示表单元素没有关联标签", width="800", height="185" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 如何为表单元素添加标签

有两种方法可以将标签与表单元素相关联。将输入元素放在标签元素中：

```html
<label>
  Receive promotional offers?
  <input type="checkbox">
</label>
```

或者使用标签的 `for` 属性并引用元素的 ID：

```html
<input id="promo" type="checkbox">
<label for="promo">Receive promotional offers?</label>
```

已经正确标记复选框时，辅助技术会报告该元素有复选框的作用，处于选中状态，并命名为“接收促销优惠？”另请参阅 [标签表单元素](/labels-and-text-alternatives#label-form-elements)。

## 资源

- [**表单元素没有关联标签**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/label.js)
- [表单 `<input>` 元素必须有标签 (Deque University)](https://dequeuniversity.com/rules/axe/3.3/label)
