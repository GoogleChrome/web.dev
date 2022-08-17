---
layout: post
title: 标签和文本替代
authors:
  - robdodson
date: 2018-11-18
description: 为了让屏幕阅读器向用户呈现鲜明的 UI，有意义的元素必须有适当的标签或文本替代。标签或文本替代为元素提供其可访问的名称，这是用于在可访问性树中表达元素语义的关键属性之一。
---

为了让屏幕阅读器向用户呈现鲜明的 UI，有意义的元素必须有适当的标签或文本替代。标签或文本替代为元素提供了可访问的**名称**，这是[在可访问性树中表达元素语义](/semantics-and-screen-readers/#semantic-properties-and-the-accessibility-tree)的关键属性之一。

当元素的名称与元素的**角色**结合使用时，它会提供用户上下文，以便用户可以了解他们正在交互的元素类型以及它在页面上的表示方式。如果名称不存在，则屏幕阅读器只会宣布元素的角色。想象一下在没有任何附加上下文的情况下尝试导航页面并听到“按钮”、“复选框”、“图像”。这就是为什么标签和文本替代方案对于良好的、可访问的体验至关重要。

## 检查元素的名称

使用 Chrome 的 DevTools 可以轻松检查元素的可访问名称：

1. 右键点击一个元素并选择 **Inspect（检查）**。这将打开 DevTools Elements 面板。
2. 在“元素”面板中，找到 **Accessibility（辅助功能）**窗格。它可能隐藏在 `»` 符号后面。
3. 在 **Computed Properties（计算出的属性）**下拉列表中，找到**Name（名称）**属性。

<figure>{% Img src="image/admin/38c68DmamTCqt2LFxTmu.png", alt="", width="800", height="471" %}<figcaption> 显示按钮的计算名称的 DevTools 辅助功能窗格。</figcaption></figure>

{% Aside %}要了解更多信息，请查阅 [DevTools 辅助功能参考](https://developer.chrome.com/docs/devtools/accessibility/reference/)。 {% endAside %}

无论您是查看具有 `alt` 文本的 `img`，还是具有 `label` 的 `input`，所有这些场景都会产生相同的结果：为元素提供可访问的名称。

## 检查缺少的名称

根据元素的类型，有不同的方法可以为元素添加可访问的名称。下表列出了需要可访问名称的最常见元素类型以及指向如何添加它们的说明的链接。

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>元素类型</th>
        <th>如何添加名称</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>HTML 文件</td>
        <td><a href="#label-documents-and-frames">标签文档和框架</a></td>
      </tr>
      <tr>
        <td>
<code>&lt;frame&gt;</code> 或 <code>&lt;iframe&gt;</code> 元素</td>
        <td><a href="#label-documents-and-frames">标签文档和框架</a></td>
      </tr>
      <tr>
        <td>图像元素</td>
        <td><a href="#include-text-alternatives-for-images-and-objects">包括图像和对象的文本替代</a></td>
      </tr>
      <tr>
        <td>
<code>&lt;input type="image"&gt;</code> 元素</td>
        <td><a href="#include-text-alternatives-for-images-and-objects">包括图像和对象的文本替代</a></td>
      </tr>
      <tr>
        <td>
<code>&lt;object&gt;</code> 元素</td>
        <td><a href="#include-text-alternatives-for-images-and-objects">包括图像和对象的文本替代</a></td>
      </tr>
      <tr>
        <td>按钮</td>
        <td><a href="#label-buttons-and-links">标签按钮和链接</a></td>
      </tr>
      <tr>
        <td>链接</td>
        <td><a href="#label-buttons-and-links">标签按钮和链接</a></td>
      </tr>
      <tr>
        <td>表单元素</td>
        <td><a href="#label-form-elements">标签表单元素</a></td>
      </tr>
    </tbody>
  </table>
</div>

## 标签文档和框架

每个页面都应该有一个 [`title`](https://developer.mozilla.org/docs/Web/HTML/Element/title) 元素，简要说明页面的内容。`title` 元素为页面提供了可访问的名称。当屏幕阅读器进入页面时，这是宣布的第一个文本。

例如，下面的页面标题为“Mary's Maple Bar Fast-Baking Recipe”：

```html/3
<!doctype html>
  <html lang="en">
    <head>
      <title>Mary's Maple Bar Fast-Baking Recipe</title>
    </head>
  <body>
    …
  </body>
</html>
```

{% Aside %}有关编写有效标题的提示，请参阅[编写描述性标题指南](/write-descriptive-text)。 {% endAside %}

同样，任何 `frame` 或 `iframe` 元素都应该具有 `title` 属性：

```html
<iframe title="An interactive map of San Francisco" src="…"></iframe>
```

虽然 `iframe` 的内容可能包含它们自己的内部 `title` 元素，但屏幕阅读器通常会停在框架边界处并宣布元素的角色——“框架”——以及它的可访问名称，由 `title` 属性提供。这让用户可以决定他们是希望进入框架还是绕过它。

## 包括图像和对象的文本替代

一个 `img` 应该总是伴随着一个 [`alt`](https://developer.mozilla.org/docs/Web/HTML/Element/img#Attributes) 属性来给图像一个可访问的名称。如果图像加载失败，`alt` 文本将用作占位符，以便用户了解图像试图传达的内容。

编写好的 `alt` 文本是一门艺术，但您可以遵循以下几条准则：

1. 确定图像是否提供了通过阅读周围文本难以获得的内容。
2. 如果是这样，请尽可能简洁地传达内容。

如果图像用作装饰并且没有提供任何有用的内容，您可以给它一个空的 `alt=""` 属性以将其从可访问性树中删除。

{% Aside %}请查看 [WebAIM 的替代文本指南](https://webaim.org/techniques/alttext/)了解有关编写有效的 `alt` 文本的更多信息。 {% endAside %}

### 图像作为链接和输入

包含在链接中的图像应使用 `img` 的 `alt` 属性来描述用户单击链接时将导航到的位置：

```html
<a href="https://en.wikipedia.org/wiki/Google">
  <img alt="Google's wikipedia page" src="google-logo.jpg">
</a>
```

同样，如果 `<input type="image">` 元素用于创建图像按钮，它应该包含描述用户单击按钮时发生的操作的 `alt`

```html/5
<form>
  <label>
    Username:
    <input type="text">
  </label>
  <input type="image" alt="Sign in" src="./sign-in-button.png">
</form>
```

### 嵌入对象

`<object>` 元素通常用于嵌入（如 Flash、PDF 或 ActiveX），也应包含替代文本。与图像类似，如果元素无法呈现，则会显示此文本。替代文本作为常规文本出现在 `object` 元素中，如下面的“年度报告”：

```html
<object type="application/pdf" data="/report.pdf">
Annual report.
</object>
```

## 标签按钮和链接

按钮和链接通常对于网站的体验至关重要，并且两者都具有易于访问的名称非常重要。

### 按钮

`button` 元素总是尝试使用其文本内容计算其可访问名称。对于不属于 `form` 的按钮，编写一个清晰的动作作为文本内容可能是创建一个良好的可访问名称所需的全部。

```html
<button>Book Room</button>
```

{% Img src="image/admin/tcIDzNpCHS9AlfwflQjI.png", alt="含有“Book Room”按钮的移动表单。", width="800", height="269" %}

此规则的一个常见例外是图标按钮。图标按钮可以使用图像或图标字体来为按钮提供文本内容。例如，所见即所得 (WYSIWYG) 编辑器中用于格式化文本的按钮通常只是图形符号：

{% Img src="image/admin/ZmQ77kLPbqd5iFOmn4SU.png", alt="左对齐图标按钮。", width="800", height="269" %}

使用图标按钮时，使用 `aria-label` 属性为它们提供一个明确的可访问名称会很有帮助。`aria-label` <br> 会覆盖按钮内的任何文本内容，让您可以向使用屏幕阅读器的任何人清楚地描述操作。

```html
<button aria-label="Left align"></button>
```

### 链接

与按钮类似，链接主要从其文本内容中获取其可访问的名称。创建链接时的一个好技巧是将最有意义的文本放入链接本身，而不是像“这里”或“阅读更多”这样的填充词。

{% Compare 'worse', 'Not descriptive enough' %}

```html
Check out our guide to web performance <a href="/guide">here</a>.
```

{% endCompare %}

{% Compare 'better', 'Useful content!' %}

```html
Check out <a href="/guide">our guide to web performance</a>.
```

{% endCompare %}

这对于提供列出页面上所有链接的快捷方式的屏幕阅读器特别有用。如果链接充满了重复的填充文本，这些快捷方式就会变得不那么有用：

<figure>{% Img src="image/admin/IPxS2dwHMyGRvGxGi5n2.jpg", alt="VoiceOver 的链接菜单充满了“这里”这个词。", width="519", height="469" %}<figcaption> macOS 屏幕阅读器 VoiceOver 示例，显示按链接导航菜单。</figcaption></figure>

## 标签表单元素

有两种方法可以将标签与表单元素（例如复选框）相关联。这两种方法中的任何一种都会使标签文本也成为复选框的点击目标，这对鼠标或触摸屏用户也很有帮助。要将标签与元素关联，可以：

- 将输入元素放在标签元素内

```html
<label>
  <input type="checkbox">Receive promotional offers?</input>
</label>
```

- 或者使用标签的 `for` 属性并引用元素的 `id`

```html
<input id="promo" type="checkbox"></input>
<label for="promo">Receive promotional offers?</label>
```

当复选框被正确标记后，屏幕阅读器可以报告该元素具有复选框的作用，处于选中状态，并被命名为“接收促销优惠？”就像下面的 VoiceOver 示例一样：

<figure>{% Img src="image/admin/WklT2ymrCmceyrGUNizF.png", alt="显示'接收促销优惠？'的 VoiceOver 文本输出", width="640", height="174" %}</figure>

{% Assessment 'self-assessment' %}
