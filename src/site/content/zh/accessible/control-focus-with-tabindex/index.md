---
layout: post
title: 使用 tabindex 控制焦点
authors:
  - robdodson
date: 2018-11-18
description: 标准 HTML 元素（如 <button> 或 <input>）免费内置了键盘可访问性。如果您正在构建自定义交互组件，请使用 tabindex 确保它们可以通过键盘访问。
---

标准 HTML 元素（如 `<button>` 或 `<input>`）免费内置了键盘可访问性。不过，如果您正在构建*自定义*交互组件，请使用 `tabindex` 属性确保它们可以通过键盘访问。

{% Aside %} 尽可能使用内置 HTML 元素，而不是构建您自己的自定义版本。例如，`<button>` 非常容易设置样式并且已经具有完整的键盘支持。这样您就无需管理 `tabindex` 或添加 ARIA 语义。{% endAside %}

## 检查您的控件是否可通过键盘访问

像 Lighthouse 这样的工具非常适合检测某些可访问性问题，但有些东西只能由人来测试。

尝试按 `Tab` 键浏览您的网站。您是否能够访问页面上的所有交互式控件？如果不能，您可能需要使用 [`tabindex`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/tabindex) 来提高这些控件的可聚焦性。

{% Aside 'warning' %} 如果您完全看不到焦点指示器，它可能已被 CSS 隐藏。请检查任何提及 `:focus { outline: none; }` 的样式。您可以在我们的[样式焦点](/style-focus)指南中了解如何解决此问题。{% endAside %}

## 将元素插入到 Tab 键顺序中

使用 `tabindex="0"` 将元素插入到自然的 Tab 键顺序中。例如：

```html
<div tabindex="0">Focus me with the TAB key</div>
```

要聚焦某个元素，请按 `Tab` 键或调用该元素的 `focus()` 方法。

{% Glitch { id: 'tabindex-zero', path: 'index.html', height: 346 } %}

## 从 Tab 键顺序中删除元素

使用 `tabindex="-1"` 删除元素。例如：

```html
<button tabindex="-1">Can't reach me with the TAB key!</button>
```

这将从自然的 Tab 键顺序中删除一个元素，但仍然可以通过调用该元素的 `focus()` 方法来聚焦该元素。

{% Glitch { id: 'tabindex-negative-one', path: 'index.html', height: 346 } %}

请注意，对元素应用 `tabindex="-1"` 不会影响其子元素；如果它们本来就处在 Tab 键顺序中或由于 `tabindex` 值的原因，它们将保留在 Tab 键顺序中。要从 Tab 键顺序中删除一个元素及其所有子元素，请考虑使用 [WICG 的 `inert` polyfill](https://github.com/WICG/inert)。该 polyfill 模拟提议的 `inert` 属性的行为，可防止元素被辅助技术选择或读取。

{% Aside 'caution' %} `inert` polyfill 是实验性的，可能无法在所有情况下都按预期工作。在生产中使用前请仔细测试。 {% endAside %}

## 避免 `tabindex > 0`

任何大于 0 的 `tabindex` 都会使元素跳到自然 Tab 键顺序的前面。如果有多个元素的 `tabindex` 大于0，则 Tab 键顺序从大于 0 的最低值开始，依次向上。

使用大于 0 的 `tabindex` 被认为是一种**反模式**，因为屏幕阅读器按 DOM 顺序导航页面，而不是按 Tab 键顺序。如果您需要某个元素在 Tab 键顺序中更早出现，则应将其移至 DOM 中较早的位置。

使用 Lighthouse 可以轻松识别 `tabindex` &gt; 0 的元素。运行可访问性审计（Lighthouse &gt; Options（选项）&gt; Accessibility（可访问性））并查找“没有元素的 [tabindex] 值大于 0”审计的结果。

## 通过“漫游 `tabindex`”创建可访问组件

如果您正在构建一个复杂的组件，您可能需要添加除聚焦之外的额外键盘支持。请考虑内置的 `select` 元素。它是可聚焦的元素，并且您可以使用箭头键来揭示附加功能（可选选项）。

要在您自己的组件中实现类似功能，请使用一种称为“漫游 `tabindex`”的技术。漫游 tabindex 的工作原理是将所有子元素的 `tabindex` 设置为 -1，但当前活动的子元素除外。该组件随后使用键盘事件侦听器来确定用户按下了哪个键。

当发生按键事件时，组件将先前被聚焦的子元素的 `tabindex` 设置为 -1，将要被聚焦的子元素的 `tabindex` 设置为 0，然后对其调用 `focus()` 方法。

**之前**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Undo</div>
  <button tabindex="0">Redo</div>
  <button tabindex="-1">Cut</div>
</div>
```

**之后**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Undo</div>
  <button tabindex="-1">Redo</div>
  <button tabindex="0">Cut</div>
</div>
```

{% Glitch { id: 'roving-tabindex', path: 'index.html', height: 346 } %}

{% Aside %} 好奇那些 `role=""` 属性的作用是什么吗？通过它们可更改元素的语义，以便屏幕阅读器正确通告该元素。您可以在我们的[屏幕阅读器基础知识](/semantics-and-screen-readers)指南中了解更多信息。{% endAside %}

{% Assessment 'self-assessment' %}

## 键盘访问秘诀

如果您不确定您的自定义组件可能需要什么级别的键盘支持，可以参考 [ARIA 创作实践 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/)。这个方便的指南列出了常见的 UI 模式并确定您的组件应该支持哪些键。
