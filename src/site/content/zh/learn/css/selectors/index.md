---
title: 选择器
description: 要将 CSS 应用于元素，您需要选择它。CSS 为您提供了许多不同的方法来做到这一点，您可以在本模块中探索它们。
audio:
  title: CSS 播客   - 002：选择器
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_002_v2.0_FINAL.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
---

如果您有一些文本，且是文章的第一段，您只想将其放大和变红，该怎么办？

```html
<article>
  <p>I want to be red and larger than the other text.</p>
  <p>I want to be normal sized and the default color.</p>
</article>
```

您可以使用 CSS 选择器来查找特定元素并应用 CSS 规则，如下所示。

```css
article p:first-of-type {
  color: red;
  font-size: 1.5em;
}
```

从简单到复杂，CSS 为您提供了许多选项来选择元素并将规则应用于它们，以帮助解决此类情况。

{% Codepen { user: 'web-dot-dev', id: 'XWprGYz', height: 250 } %}

## CSS 规则的组成部分

要了解选择器的工作原理及其在 CSS 中的作用，了解 CSS 规则的组成部分很重要。CSS 规则是一段代码，包含一个或多个选择器和一个或多个声明。

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/hFR4OOwyH5zWc5XUIcyu.svg", alt="含有选择器 .my-css-rule 的 CSS 规则的图像", width="800", height="427" %}</figure>

在该 CSS 规则中，**选择器**是 `.my-css-rule` ，它在页面上找到所有类为 `my-css-rule` 的元素。大括号内有三个声明。声明是一个属性和值对，它将样式应用于选择器匹配的元素。CSS 规则可以有任意多的声明和选择器。

## 简单的选择器

最直接的选择器组针对 HTML 元素以及类、ID 和其他可能添加到 HTML 标签的属性。

### 通用选择器

[通用选择器](https://developer.mozilla.org/docs/Web/CSS/Universal_selectors)——也称为通配符——匹配任何元素。

```css
* {
  color: hotpink;
}
```

此规则使页面上的每个 HTML 元素都具有热粉色文本。

### 类型选择器

[类型选择器](https://developer.mozilla.org/docs/Web/CSS/Type_selectors)直接匹配 HTML 元素。

```css
section {
  padding: 2em;
}
```

此规则导致每个 `<section>` 元素的所有边都有 `2em` 的 `padding`。

### 类选择器

一个 HTML 元素可以在其 `class` 属性中定义一个或多个项目。[类选择器](https://developer.mozilla.org/docs/Web/CSS/Class_selectors)匹配应用类的任何元素。

```html
<div class="my-class"></div>
<button class="my-class"></button>
<p class="my-class"></p>
```

任何应用了该类的元素都将变为红色：

```css
.my-class {
  color: red;
}
```

请注意，`.` 只存在于 CSS 中**而非** HTML 中。这是因为 `.` 字符指示 CSS 语言匹配类属性成员。这是 CSS 中的一种常见模式，其中使用特殊字符或字符集来定义选择器类型。

具有 `.my-class` 类的 HTML 元素仍将与上述 CSS 规则匹配，即使它们有多个其他类，如下所示：

```html
<div class="my-class another-class some-other-class"></div>
```

这是因为 CSS 在查找*包含*已定义类的`class` 属性，而不是完全匹配该类。

{% Aside %} 类属性的值几乎可以是您想要的任何值。但有一件事可能会让您失望，那就是您不能用数字来开始一个类（或一个 ID），比如 `.1element`。可在[规范](https://www.w3.org/TR/CSS21/syndata.html#characters)中阅读更多内容。 {% endAside %}

### ID 选择器

具有 `id` 属性的 HTML 元素应该是页面上具有 ID 值的唯一元素。您可以使用[ID 选择器](https://developer.mozilla.org/docs/Web/CSS/ID_selectors)选择元素，如下：

```css
#rad {
  border: 1px solid blue;
}
```

此 CSS 会将蓝色边框应用于 `id` 为 `rad` 的 HTML 元素，如下所示：

```html
<div id="rad"></div>
```

与类选择器 `.` 类似，使用 `#` 字符指示 CSS 查找与其后面的 `id` 匹配的元素。

{% Aside %} 如果浏览器遇到多个 `id` 实例，它仍会应用与其选择器匹配的任何 CSS 规则。但是，任何具有 `id` 属性的元素都应该具有唯一的值，因此除非您为单个元素编写非常具体的 CSS，否则请避免使用 `id` 选择器应用样式，因为这意味着您无法重复使用其他地方的那些风格。 {% endAside %}

### 属性选择器

您可以使用[属性选择器](https://developer.mozilla.org/docs/Web/CSS/Attribute_selectors)查找具有特定 HTML 属性或具有特定 HTML 属性值的元素。可通过用方括号  (`[ ]`) 将选择器括起来的方式指示 CSS 查找属性。

```css
[data-type='primary'] {
  color: red;
}
```

该 CSS 查找具有 `data-type` 属性且值为 `primary` 的所有元素，如下所示：

```html
<div data-type="primary"></div>
```

除了查找 `data-type` 的特定值之外，您还可以查找具有该属性的元素，而不管其值如何。

```css
[data-type] {
  color: red;
}
```

```html
<div data-type="primary"></div>
<div data-type="secondary"></div>
```

这两个 `<div>` 元素都将具有红色文本。

您可以通过向属性选择器添加 `s` 运算符来使用区分大小写的属性选择器。

```css
[data-type='primary' s] {
  color: red;
}
```

这意味着，如果一个 HTML 元素的 `data-type` 值是 `Primary` 而非 `primary` ，则其不会得到红色文本。您可以使用 `i` 运算符来执行相反的操作——不区分大小写。

除了 case 运算符，您还可以访问与属性值内的字符串部分匹配的运算符。

```css
/* A href that contains "example.com" */
[href*='example.com'] {
  color: red;
}

/* A href that starts with https */
[href^='https'] {
  color: green;
}

/* A href that ends with .com */
[href$='.com'] {
  color: blue;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'BapBbOy' } %}<figcaption>在该演示中，属性选择器中的 `$` 操作符从 `href` 属性中获取文件类型。这使得可以使用伪元素根据该文件类型为标签添加前缀。</figcaption></figure>

### 分组选择器

选择器不必只匹配单个元素。您可以用逗号分隔多个选择器：

```css
strong,
em,
.my-class,
[lang] {
  color: red;
}
```

此示例将颜色更改扩展到 `<strong>` 和 `<em>` 元素。它还扩展到一个名为 `.my-class` 的类，以及一个具有 `lang` 属性的元素。

{% Assessment 'simple-selectors' %}

## 伪类和伪元素

CSS 提供有用的选择器类型，它们专注于特定的平台状态，例如元素悬停时、元素成为*内部*结构或元素的一部分结构。

### 伪类

HTML 元素发现自己处于各种状态，要么是因为它们与之互动，要么是因为它们的一个子元素处于某种状态。

例如，用户可以用鼠标指针悬停 HTML 元素，*或者*用户也可以将子元素悬停。对于这些情况，请使用 `:hover` 伪类。

```css
/* Our link is hovered */
a:hover {
  outline: 1px dotted green;
}

/* Sets all even paragraphs to have a different background */
p:nth-child(even) {
  background: floralwhite;
}
```

在[伪类模块](/learn/css/pseudo-classes)中了解更多信息。

### 伪元素

伪元素与伪类不同，因为它们不是响应平台状态，而是像使用 CSS 插入新元素一样。伪元素也在语法上与伪类不同，因为不使用单个冒号（ `:` ），我们使用双冒号（ `::` ）。

{% Aside %} 双冒号 ( `::` ) 是伪元素与伪类的区别，但由于旧版本的 CSS 规范中不存在这种区别，因此浏览器支持原始伪元素使用单个冒号，例如 `:before` 和 `:after` 以帮助向后兼容旧浏览器，如 IE8。 {% endAside %}

```css
.my-element::before {
  content: 'Prefix - ';
}
```

就像在上面的演示中一样，您在链接的标签前面加上了文件类型的前缀，您可以使用 `::before` 伪元素**在元素的开头**插入内容，或使用 `::after` 伪元素**在元素的末尾**插入内容。

不过，伪元素不限于插入内容。您还可以使用它们来定位元素的特定部分。例如，假设您有一个列表，则可以使用 `::marker` 为列表中的每个项目符号点（或数字）设置样式

```css
/* Your list will now either have red dots, or red numbers */
li::marker {
  color: red;
}
```

您还可以使用 `::selection` 为用户突出显示的内容设置样式。

```css
::selection {
  background: black;
  color: white;
}
```

在[伪元素模块](/learn/css/pseudo-elements)中了解更多信息。

{% Assessment 'pseudo-selectors' %}

## 复杂的选择器

您已经看到了大量的选择器，但有时，您需要对 CSS 进行*更精细的控制*。这是复杂选择器介入的地方。

在这一点上值得记住的是，虽然下面的选择器给了我们更多的权力，但我们只能**向下级联**，选择子元素。我们无法向上定位并选择父元素。我们将在[后面的课程](/learn/css/the-cascade)中介绍级联是什么以及它是如何工作的。

### 连结符

连结符位于两个选择器之间。例如，如果选择器是 `p > strong` ，则连结符是 `>` 字符。使用这些连结符的选择器可帮助您根据项目在文档中的位置选择项目。

#### 后代连结符

要了解后代连结符，您首先需要了解父元素和子元素。

```html
<p>A paragraph of text with some <strong>bold text for emphasis</strong>.</p>
```

父元素是包含文本的 `<p>`。在该 `<p>` 元素内是一个 `<strong>` 元素，使其内容加粗。因为它在 `<p>` 内部，所以它是一个子元素。

后代连结符允许我们定位子元素。这使用了一个空格 (` `) 指示浏览器查找子元素：

```css
p strong {
  color: blue;
}
```

此代码段仅选择 `<p>` 元素的子元素的所有 `<strong>` 元素，使它们递归地变为蓝色。

<figure>{% Codepen { user: 'web-dot-dev', id: 'BapBbGN' } %}<figcaption>由于后代连结符是递归的，因此会应用添加到每个子元素的填充，从而产生交错效果。</figcaption></figure>

在上面的示例中，使用连结符选择器 `.top div` 可以更好地可视化这种效果。该 CSS 规则为这些 `<div>` 元素添加了左填充。因为连结符是递归的， `.top` 中的所有 `<div>` 元素都将应用相同的填充。

查看此演示中的 HTML 面板，了解 `.top` 元素如何具有多个 `<div>` 子元素，而这些子元素本身又具有 `<div>` 子元素。

#### 下一个同级连结符

您可以在选择器中使用 `+` 字符来查找紧跟在另一个元素之后的元素。

{% Codepen { user: 'web-dot-dev', id: 'JjEPzwB' } %}

要在堆叠元素之间添加空格，请*仅*在元素是 `.top` 的子元素的**下一个同级**时使用下一个同级连接符添加空格。

您可以使用下面的选择器向 `.top` 的所有子元素添加边距：

```css
.top * {
  margin-top: 1em;
}
```

这样做的问题在于，因为您要选择 `.top` 的每个子元素，所以此规则可能会创建额外的、不必要的空格。与**通用选择器**混合的**下一个同级连结符**使您不仅可以控制哪些元素获得空格，还可以将空格应用于**任何元素**。这为您提供了一些长期的灵活性，无论 `.top` 中出现什么 HTML 元素。

#### 后续同级连结符

后续连结符与下一个同级选择器非常相似。但是，其不使用 `+` 字符，而是使用 `~` 字符。不同之处在于一个元素只需要跟随另一个具有相同父元素的元素，而不是成为具有相同父元素的下一个元素。

<figure>{% Codepen { user: 'web-dot-dev', id: 'ZELzPPX', height: 400 } %} <figcaption>使用后续选择器和 `:checked` 伪类可创建纯 CSS 开关元素。</figcaption></figure>

该后续连结符提供一定的灵活性，这在像上面的示例这样的上下文中很有用，当其关联的复选框具有 `:checked` 状态时，我们可更改自定义开关的颜色。

#### 子级连结符

子级连结符（也称为直接后代）允许您更好地控制连结符选择器附带的递归。通过使用 `>` 字符，您可以将连结符选择器限制为**仅**应用于直接子级。

以上面的“下一个同级选择器”为例。每个**下一个同级**都添加了空格，但如果这些元素中有一个也以**下一个同级元素**作为子元素，则可能会导致不受欢迎的额外空格。

{% Codepen { user: 'web-dot-dev', id: 'ExZYMJL' } %}

为了缓解该问题，可更改**下一个同级选择器**以合并子级连结符：`> * + *` 。该规则现在**仅**适用于 `.top` 的直接子级。

{% Codepen { user: 'web-dot-dev', id: 'dyNbrEr' } %}

### 复合选择器

您可以组合选择器以提高特异性和可读性。例如，要定位同样具有 `.my-class` 类的 `<a>` 元素，请编写以下内容：

```css
a.my-class {
  color: red;
}
```

这不会将红色应用于所有链接，而且**如果**其位于 `<a>` 元素上，则只会将红色应用于 `.my-class`。有关这方面的更多信息，请参阅[特异性模块](/learn/css/specificity)。

{% Assessment 'complex-selectors' %}

## 资源

- [CSS 选择器参考](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors)
- [交互式选择器游戏](https://flukeout.github.io/)
- [伪类和伪元素参考](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements)
- [将 CSS 选择器转换为纯英文解释器的工具](https://kittygiraudel.github.io/selectors-explained/)
