---
layout: post
title: ARIA 项目没有可访问的名称
description: 了解如何通过确保辅助技术用户可以访问 ARIA 项目名称，提高网页的可访问性。
date: 2020-12-08
web_lighthouse:
  - aria-command-name
  - aria-input-field-name
  - aria-meter-name
  - aria-progressbar-name
  - aria-toggle-field-name
  - aria-tooltip-name
  - aria-treeitem-name
tags:
  - accessibility
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

{% include 'content/lighthouse-accessibility/accessible-names.njk' %}

## Lighthouse 如何识别没有可访问名称的 ARIA 项目

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 标记了辅助技术无法访问其名称的自定义 ARIA 项目：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Dnruhkr4IKtq0Pi9Pgny.png", alt="Lighthouse 审计显示了没有可访问名称的自定义切换元素", width="800", height="259" %}</figure>

有 7 项审计负责检查可访问名称，每个审计负责一组不同的 [ARIA 角色](https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex)。具有以下任何 ARIA 角色但没有可访问名称的元素将导致此审计失败：

审计名称 | ARIA 角色
--- | ---
`aria-command-name` | `button`, `link`, `menuitem`
`aria-input-field-name` | `combobox`, `listbox`, `searchbox`, `slider`, `spinbutton`, `textbox`
`aria-meter-name` | `meter`
`aria-progressbar-name` | `progressbar`
`aria-toggle-field-name` | `checkbox` ， `checkbox`, `menu`, `menuitemcheckbox`, `menuitemradio`, `radio`, `radiogroup`, `switch`
`aria-tooltip-name` | `tooltip`
`aria-treeitem-name` | `treeitem`

{% include 'content/lighthouse-accessibility/use-built-in.njk' %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 示例 1：如何向自定义 ARIA 切换字段添加可访问名称

### 选项 1：向元素添加内部文本

为大多数元素提供可访问名称的最简单方法是在元素内包含文本内容。

例如，此自定义复选框将向辅助技术用户朗读为报纸 (Newspaper)：

```html
<div id="checkbox1" role="checkbox">Newspaper</div>
```

使用[剪辑模式](https://www.a11yproject.com/posts/2013-01-11-how-to-hide-content/)，您可以隐藏屏幕上的内部文本，但仍然通过辅助技术进行朗读。如果您翻译页面进行本地化，这会特别方便。

```html
<a href="/accessible">Learn more <span class="visually-hidden">about accessibility on web.dev</span></a>
```

### 选项 2：向元素添加 `aria-label` 属性

如果您无法添加内部文本（比如您不希望元素的名称可见），那么请使用`aria-label`属性。

此自定义开关将向辅助技术用户朗读为切换蓝光 (Toggle blue light)：

```html
<div id="switch1"
    role="switch"
    aria-checked="true"
    aria-label="Toggle blue light">
    <span>off</span>
    <span>on</span>
</div>
```

### 选项 3：使用`aria-labelledby`引用另一个元素

使用`aria-labelledby`属性来标识另一个元素，使用其 ID 作为当前元素的名称。

例如，这个自定义菜单单选按钮引用`menuitem1Label`段落作为它的标签，并将被宣布为 Sans-serif：

```html
<p id="menuitem1Label">Sans-serif</p>
<ul role="menu">
    <li id="menuitem1"
        role="menuitemradio"
        aria-labelledby="menuitem1Label"
        aria-checked="true"></li>
</ul>
```

## 示例 2：如何向自定义 ARIA 输入字段添加可访问名称

为大多数元素提供可访问名称的最简单方法是在元素中包含文本内容。但是，自定义输入字段通常没有内部文本，因此您可以改用以下策略之一。

### 选项 1：向元素添加 `aria-label` 属性

使用`aria-label`属性定义当前元素的名称。

例如，此自定义组合框将向辅助技术用户朗读为国家/地区 (country)：

```html
<div id="combo1" aria-label="country" role="combobox"></div>
```

### 选项 3：使用`aria-labelledby`引用另一个元素

使用`aria-labelledby`属性来标识另一个元素，使用其 ID 作为当前元素的名称。

例如，这个自定义搜索框将`searchLabel`段落引用为它的标签，并将被宣布为搜索货币对 (Search currency pairs)：

```html
<p id="searchLabel">Search currency pairs:</p>
<div id="search"
    role="searchbox"
    contenteditable="true"
    aria-labelledby="searchLabel"></div>
```

## 资源

- [**并非所有 ARIA 切换字段都有可访问的名称**审计的源代码](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-toggle-field-name.js)
- [ARIA 按钮、链接和菜单项必须具有可访问名称（德克大学）](https://dequeuniversity.com/rules/axe/4.1/aria-command-name)
- [ARIA 输入字段必须具有可访问名称（德克大学）](https://dequeuniversity.com/rules/axe/4.1/aria-input-field-name)
- [ARIA 仪表必须具有可访问名称（德克大学）](https://dequeuniversity.com/rules/axe/4.1/aria-meter-name)
- [ARIA 进度条必须有可访问名称（德克大学）](https://dequeuniversity.com/rules/axe/4.1/aria-progressbar-name)
- [ARIA 切换字段具有可访问名称（德克大学）](https://dequeuniversity.com/rules/axe/4.1/aria-toggle-field-label)
- [ARIA 工具提示必须具有可访问名称（德克大学）](https://dequeuniversity.com/rules/axe/4.1/aria-tooltip-name)
- [ARIA 树项必须有可访问名称（德克大学）](https://dequeuniversity.com/rules/axe/4.1/aria-treeitem-name)
- [标签和文本替代品](/labels-and-text-alternatives)
- [通过语义 HTML 轻松使用键盘](/use-semantic-html)
