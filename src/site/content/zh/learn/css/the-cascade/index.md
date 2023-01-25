---
title: 级联
description: 有时两个或多个相互冲突的 CSS 规则可能会应用于一个元素。在本模块中了解浏览器如何选择使用哪个规则，以及如何控制此选择。
audio:
  title: CSS 播客   - 004：级联
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_004_v1.0_FINAL.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
tags:
  - css
---

CSS 代表级联样式表。级联是解决多个 CSS 规则应用于一个 HTML 元素所产生冲突的算法。这就是使用以下 CSS 样式设置的按钮文本将呈现蓝色的原因。

```css
button {
  color: red;
}

button {
  color: blue;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'GRrgMOm', height: 200 } %}</figure>

了解级联算法可以帮助您了解浏览器如何解决此类冲突。级联算法分为 4 个不同的阶段。

1. **出现的位置和顺序**：CSS 规则出现的顺序
2. **特异性**：一种确定哪个 CSS 选择器具有最强匹配的算法
3. **来源**：CSS 出现的顺序及其来源，无论是浏览器样式、浏览器扩展中的 CSS 还是您创作的 CSS
4. **重要性**：某些 CSS 规则的权重高于其他规则，尤其是具有 `!important` 规则类型的规则

## 出现的位置和顺序

在计算冲突解决方案时，级联会考虑 CSS 规则出现的顺序及其出现方式。

本课开头的演示是最直接的位置示例。有两条规则的选择器具有相同的特异性，所以最后一个规则获胜。

样式可以来自 HTML 页面上的各种来源，例如 `<link>` 标记、嵌入的 `<style>` 标记和在元素的 `style` 属性中定义的内联 CSS。

如果一个 `<link>` 中包括您的 HTML 页面顶部的 CSS，另一个 `<link>` 中包括您的页面底部的 CSS：底部 `<link>` 将具有最多的特异性。嵌入的 `<style>` 元素情况相同。它们更具体，越往页面下方越具体。

<figure>{% Codepen { user: 'web-dot-dev', id: 'NWdPaWv' } %} <figcaption>该按钮具有蓝色背景，由 CSS 定义，包含在 <code>&lt;link /&gt;</code> 元素中。将其设置为深色的 CSS 规则位于第二个链接样式表中，并因其位置在较后面而被应用。</figcaption></figure>

此顺序也适用于嵌入的 `<style>` 元素。如果它们在 `<link>` 之前声明，则链接样式表的 CSS 将具有最多的特异性。

<figure>{% Codepen { user: 'web-dot-dev', id: 'xxgbLoB' } %} <figcaption><code>&lt;style&gt;</code> 元素在 <code>&lt;head&gt;</code> 中声明，而 <code>&lt;link /&gt;</code> 元素在 <code>&lt;body&gt;</code> 中声明。这意味着它比 <code>&lt;style&gt;</code> 元素具有更多的特异性</figcaption></figure>

声明了 CSS 的内联 `style` 属性将覆盖所有其他 CSS，无论其位置如何，除非声明定义了 `!important`。

您的 CSS 规则顺序还应用了位置。在此示例中，元素有紫色背景，因为 `background: purple` 是最后声明的。因为绿色背景是在紫色背景之前声明的，所以现在被浏览器忽略了。

```css
.my-element {
  background: green;
  background: purple;
}
```

能够为同一属性指定两个值是一种为不支持特定值的浏览器创建回退的简单方法。在下一个示例中，`font-size` 被声明了两次。如果浏览器支持 `clamp()`，那么之前的 `font-size` 声明将被丢弃。如果浏览器不支持 `clamp()`，则初始声明将被采用，字体大小将为 1.5rem

```css
.my-element {
  font-size: 1.5rem;
  font-size: clamp(1.5rem, calc(1rem + 3vw), 2rem);
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'xxgbPMP' } %}</figure>

{% Aside %} 这种将同一属性声明两次的方法有效，因为浏览器会忽略它们不理解的值。与其他一些编程语言不同，CSS 在检测到无法解析的行时不会引发错误或中断您的程序，它无法解析的值是无效的，因此会被忽略。然后浏览器继续处理其余的 CSS，而不会中断它已经理解的内容。{% endAside %}

{% Assessment 'position' %}

## 特异性

特异性是一种算法，它确定哪个 CSS 选择器最具体，其使用加权或评分系统进行这些计算。通过使规则更具体，即使在 CSS 中稍后出现与选择器匹配的某些其他 CSS 时，您也可以应用它。

在[下一课](/learn/css/specificity)中，您可以了解如何计算特异性的详细信息，但记住一些事项将帮助您避免过多的特异性问题。

针对元素上的类的 CSS 将使该规则更具体，因此被视为比单独针对元素的 CSS 更应该被应用。这意味着对于以下 CSS，即使两个规则都匹配且在样式表中 `h1` 选择器的规则在后面出现，则 `h1` 将设为红色。

```html
<h1 class="my-element">Heading</h1>
```

```css
.my-element {
  color: red;
}

h1 {
  color: blue;
}
```

`id` 使 CSS 更具体，因此应用于 ID 的样式将覆盖许多以其他方式应用的样式。这是为什么通常不要将样式附加到 `id` 的原因之一。用其他内容覆盖此样式可能会很困难。

### 特异性是累积的

正如您在下一课中所了解的那样，每种类型的选择器都会获得分数，表示其具体程度，且用于针对某个元素的所有选择器的分数都会加在一起。这意味着如果针对某个具有选择器列表（例如 `a.my-class.another-class[href]:hover`）的元素，则您会得到一些很难用其他 CSS 覆盖的内容。出于这个原因，并且为了帮助您提高 CSS 的可重用性，最好让您的选择器尽可能简单。在需要时使用特异性作为获取元素的工具，但如果可以，请始终考虑重构较长的、具体的选择器列表。

## 来源

您创作的 CSS 并不是应用于页面的唯一 CSS。级联考虑 CSS 的来源。此来源包括浏览器的内部样式表、浏览器扩展或操作系统添加的样式以及您创作的 CSS。**这些来源的特异性顺序**，从最不具体到最具体排序如下：

1. **用户代理基本样式**。这些样式是您的浏览器默认应用于 HTML 元素的样式。
2. **本地用户样式**。这些样式可能来自操作系统级别，例如基本字体大小或减少运动的偏好。它们也可以来自浏览器扩展，例如允许用户为网页编写自己的自定义 CSS 的浏览器扩展。
3. **创作的 CSS**。您创作的 CSS。
4. **创作的 `!important`**。您添加到创作声明中的任何 `!important`。
5. **本地用户样式 `!important`**。任何来自操作系统级别或浏览器扩展级别 CSS 的 `!important`。
6. **用户代理 `!important`**。任何在浏览器提供的默认 CSS 中定义的 `!important`。

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/zPdaZ6G11oYrgJ78EfF7.svg", alt="同样在列表中解释的来源顺序的视觉演示。", width="800", height="347" %}</figure>

如果您创作的 CSS 中有 `!important` 规则类型，而用户自定义的 CSS 中有 `!important` 规则类型，那么谁的 CSS 会胜出？

{% Assessment 'origin' %}

## 重要性

并非所有 CSS 规则的计算方式都相同，或者彼此具有相同的特异性。

**重要性顺序**按从最不重要到最重要排序如下：

1. 普通规则类型，例如 `font-size`、`background` 或 `color`
2. `animation` 规则类型
3. `!important` 规则类型（按照与来源相同的顺序）
4. `transition` 规则类型

活动的动画和过渡规则类型比普通规则具有更高的重要性。在过渡重要性高于 `!important` 规则类型的情况下。这是因为当动画或过渡变为活动状态时，其预期行为是改变视觉状态。

## 使用 DevTools 找出未应用某些 CSS 的原因

浏览器 DevTools 通常会显示所有可以匹配元素的 CSS，没有使用的被划掉。

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/Z6aLsqcqjGAUsWzq7DZs.png", alt="被覆盖的 CSS 被划掉的浏览器 DevTools 的图像", width="800", height="446" %}</figure>

如果您希望应用的 CSS 根本没有出现，则它与元素不匹配。在这种情况下，您需要查找其他原因，可能是类或元素名称中有拼写错误或某些 CSS 无效。

{% Assessment 'conclusion' %}

## 资源

- [级联的高度互动解释](https://wattenberger.com/blog/css-cascade)
- [MDN 级联参考](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)
