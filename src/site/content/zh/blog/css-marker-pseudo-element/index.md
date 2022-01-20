---
layout: post
title: "使用 CSS ::marker 自定义项目符号"
subhead: 现在，当使用 <ul> 或 <ol> 时，自定义数字或项目符号的颜色、大小或类型非常简单。
authors:
  - adamargyle
  - loirooriol
description: 现在，当使用 <ul> 或 <ol> 时，自定义数字或项目符号的颜色、大小或类型非常简单。
tags:
  - blog
  - css
date: 2020-09-02
updated: 2020-09-02
scheduled: 'true'
hero: image/admin/GPGTyXJOh0cH0wa1PvXH.png
thumbnail: image/admin/jbdOq0tGGzobMtaBsajn.png
alt: 通过在项目符号和文本周围添加单独的方框来显示单个列表项的结构
feedback:
  - api
---

感谢 Bloomberg 赞助的 Igalia，我们终于可以把这些技巧加入样式列表中了。瞧！

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOmqXrog0YoriZqqIzEZ.png", alt="", width="665", height="384" %} <figcaption> <a href="https://glitch.com/edit/#!/marker-fun-example">查看源代码</a> </figcaption></figure>

凭借 [CSS `::marker`](https://www.w3.org/TR/css-lists-3/#marker-pseudo)，我们可以更改项目符号和数字的内容以及一些样式。

## 浏览器兼容性

桌面版和 Android 版 Firefox、桌面版 Safari 和 iOS Safari 支持 `::marker`（但仅支持 `color` 和 `font-*` 属性，请参阅[错误 204163](https://bugs.webkit.org/show_bug.cgi?id=204163)），基于 Chromium 的桌面版和 Android 浏览器也支持该元素。有关更新，请参阅 MDN 的[浏览器兼容性表](https://developer.mozilla.org/docs/Web/CSS/::marker#Browser_compatibility)。

## 伪元素

考虑以下基本 HTML 无序列表：

```html
<ul>
  <li>Lorem ipsum dolor sit amet consectetur adipisicing elit</li>
  <li>Dolores quaerat illo totam porro</li>
  <li>Quidem aliquid perferendis voluptates</li>
  <li>Ipsa adipisci fugit assumenda dicta voluptates nihil reprehenderit consequatur alias facilis rem</li>
  <li>Fuga</li>
</ul>
```

这会产生以下预期中的渲染：

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-plain-list?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

`<li>` 项开头的点是可选的！浏览器会绘制和创建生成的标记框。

今天，我们高兴地讨论了 `::marker` 伪元素，它可以为浏览器创建的项目符号元素设置样式。

{% Aside 'key-term' %} 伪元素表示在文档中，除文档树中的元素之外的元素。例如，您可以使用伪元素 `p::first-line` 来选中段落的第一行，即使该行文本不包含任何 HTML 元素。{% endAside %}

### 创建标记

`::marker` 伪元素标记框在每个列表项元素的内部自动生成，位于实际内容和 `::before` 伪元素之前。

```css
li::before {
  content: "::before";
  background: lightgray;
  border-radius: 1ch;
  padding-inline: 1ch;
  margin-inline-end: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 340px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-before-example?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

通常，列表项是 `<li>` HTML 元素，但其他元素也可以通过使用 `display: list-item` 而成为列表项。

```html
<dl>
  <dt>Lorem</dt>
  <dd>Lorem ipsum dolor sit amet consectetur adipisicing elit</dd>
  <dd>Dolores quaerat illo totam porro</dd>

  <dt>Ipsum</dt>
  <dd>Quidem aliquid perferendis voluptates</dd>
</dl>
```

```css/1
dd {
  display: list-item;
  list-style-type: "🤯";
  padding-inline-start: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-definition-list?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### 设置标记样式

在 `::marker` 之前，可以使用 `list-style-type` 和 `list-style-image` 来设置列表的样式，从而更改第 1 行 CSS 的列表项符号：

```css
li {
  list-style-image: url(/right-arrow.svg);
  /* OR */
  list-style-type: '👉';
  padding-inline-start: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-list-style-type?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

这非常方便，但我们需要更多功能。比如说，如何更改颜色、大小、间距等？这就是 `::marker` 能够派上用场的地方。它支持以单独和全局的方式从 CSS 定位这些伪元素：

```css
li::marker {
  color: hotpink;
}

li:first-child::marker {
  font-size: 5rem;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-style-introduction?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

{% Aside 'caution' %} 如果上面的列表没有粉红色的项目符号，则说明您的浏览器不支持 `::marker`。{% endAside %}

`list-style-type` 属性提供了非常有限的样式类型。`::marker` 伪元素支持定位标记本身，并允许直接对其应用样式，从而实现更多的控制。

也就是说，您不能在 `::marker` 上使用每个 CSS 属性。规范中明确规定了允许和不允许的属性列表。如果您尝试使用此伪元素执行一些有趣的操作，但发现不起作用，则可以参考下面的列表，其中介绍了允许和不允许的 CSS 属性：

#### 允许的 CSS `::marker` 属性

- `animation-*`
- `transition-*`
- `color`
- `direction`
- `font-*`
- `content`
- `unicode-bidi`
- `white-space`

`::marker` 的内容通过 `content`（而不是 `list-style-type`）进行更改。在下一个示例中，第一项使用 `list-style-type` 设置样式，第二项使用 `::marker` 设置样式。第一种情况下的属性适用于整个列表项，而不仅仅是标记，这意味着文本和标记一样具有动画效果。当使用 `::marker` 时，我们可以只定位标记框，而不是文本。

另外，请注意不允许的 `background` 属性为何没有效果。

<div class="switcher">{% Compare 'worse', 'List Styles' %} ```css li:nth-child(1) { list-style-type: '?'; font-size: 2rem; background: hsl(200 20% 88%); animation: color-change 3s ease-in-out infinite; } ```</div>
<p data-md-type="paragraph">{% CompareCaption %} 标记与列表项之间的混合结果 {% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'better', 'Marker Styles' %}</p>
<pre data-md-type="block_code" data-md-language="css"><code class="language-css">li:nth-child(2)::marker {
  content: '!';
  font-size: 2rem;
  background: hsl(200 20% 88%);
  animation: color-change 3s ease-in-out infinite;
}
</code></pre>
<p data-md-type="paragraph">{% CompareCaption %} 标记与列表项之间的焦点结果 {% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

<br>

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-style-vs-list-style-type?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

{% Aside 'gotchas' %} 在 Chromium 中，`white-space` 仅适用于内部定位标记。对于外部定位标记，样式调整器始终强制执行 `white-space: pre` 以保留尾随空间。{% endAside %}

#### 更改标记的内容

下面是设置标记样式的一些方法。

**更改所有列表项**

```css
li {
  list-style-type: "😍";
}

/* OR */

li::marker {
  content: "😍";
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-change-all?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

**仅更改一个列表项**

```css
li:last-child::marker {
  content: "😍";
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-change-one?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

**将列表项更改为 SVG**

```css
li::marker {
  content: url(/heart.svg);
  content: url(#heart);
  content: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='24' width='24'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='none' stroke='hotpink' stroke-width='3'/></svg>");
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-inline-svg?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

**更改编号列表**`<ol>` 怎么样？默认情况下，有序列表项上的标记是数字，而不是项目符号。CSS 中将其称为[计数器](https://developer.mozilla.org/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters)，这是一个非常强大的功能。它们甚至具有设置和重置开始/结束序号的属性，或者将序号改成罗马数字。我们可以设置这样的样式吗？当然可以，我们甚至可以使用标记内容值来构建自己的编号。

```css
li::marker {
  content: counter(list-item) "› ";
  color: hotpink;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-numbered-lists?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### 调试

Chrome DevTools 已准备就绪，可帮助您检查、调试和修改应用到 `::marker` 伪元素的样式。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PYKVXEzycrMhQujXsNxQ.png", alt="DevTools 打开，显示来自用户代理和用户样式的样式", width="776", height="574", style="max-inline-size: 480px" %}</figure>

### 未来的伪元素样式

您可以从以下位置找到有关 ::marker 的更多信息：

- [Smashing Magazine](https://www.smashingmagazine.com/2019/07/css-lists-markers-counters/) 提供的 [CSS 列表、标记和计数器](https://www.smashingmagazine.com/)
- 使用 [CSS-Tricks](https://css-tricks.com/) 提供的 [CSS 计数器和 CSS 网格计数](https://css-tricks.com/counting-css-counters-css-grid/)
- 使用 [MDN](https://developer.mozilla.org/) 中的 [CSS 计数器](https://developer.mozilla.org/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters)

对于曾经难以设置样式的对象，现在能够找到一些办法真是太棒了。您可能希望为其他自动生成的元素设置样式，可能对 `<details>` 或搜索输入自动完成指示器感到失望，这些元素在浏览器中的实现方式不同。要分享您的愿望吗？您可以在 [https://webwewant.fyi](https://webwewant.fyi) 上创建需求。
