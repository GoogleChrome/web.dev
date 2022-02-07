---
title: 弹性框 (Flexbox)
description: |2-

  弹性框是一种布局机制，用于在一个维度上为项目组设置布局。本模块介绍了它的用法。
audio:
  title: CSS 播客   - 010：Flexbox
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_010_v1.0.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - rachelandrew
  - andybell
date: 2021-04-21
---

侧边栏是一种在自适应设计中很难应对的设计模式，它与某些内容内联。在有视口空间的地方，这种模式效果很好，但在空间被压缩的地方，这种僵化的布局可能会出现问题。

{% Codepen { user: 'web-dot-dev', id: 'poRENWv', height: 420 } %}

弹性框布局模型 (flexbox) 是专为一维内容设计的布局模型。它擅长获取一组大小不同的项目，并为这些项目返回最佳布局。

对于侧边栏模式，这种布局模型较为理想。弹性框不仅有助于以内联方式展示侧边栏和内容，而且在剩余空间不足的情况下，侧边栏还会换行。使用弹性框，您可以提供灵活的边界来提示内容如何显示，而不是让浏览器采用僵化的尺寸。

{% Codepen { user: 'web-dot-dev', id: 'xxgERMp', height: 400 } %}

## 弹性布局的作用

弹性布局具有以下功能，您可以在本指南中进行探索。

- 可以显示为一行或一列。
- 遵照文档的书写模式。
- 默认情况下，以单行显示，但可以根据要求换成多行显示。
- 布局中的项目可以打乱在 DOM 中的顺序，重新排列显示顺序。
- 可以在项目内部分配空间，因此会根据父项中的可用空间变大或变小。
- 使用框对齐 (Box Alignment) 属性，可以在换行布局中为项目和弹性行分配空间。
- 项目本身可以沿横轴对齐。

## 主轴和横轴

要理解弹性框，关键是理解主轴和横轴的概念。主轴由 `flex-direction` 属性设置。如果该属性为 `row`，则主轴沿行方向分布，如果该属性为 `column`，则主轴沿列方向分布。

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/xKtf0cHRw0xQyiyYuuyz.svg", alt="三个框彼此相邻，共用一个从左指向右的箭头。箭头上标记有主轴", width="800", height=" 320"%}</figure>

弹性项目作为一个组沿主轴移动。请记住：我们已经获得了很多内容，并且正在努力为作为一个组的它们构建最佳布局。

相对于主轴，横轴沿另一个方向分布，因此，如果 `flex-direction` 为 `row`，则横轴沿列方向分布。

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/5wCsZcBmK5L33LS7nOmP.svg", alt="三个框高度不同，彼此相邻，共用一个从左指向右的箭头。箭头上标记有主轴。另有一个从上指向下的箭头。这个箭头上标记有横轴", width="800", height="320" %}</figure>

您可以在横轴上做两件事：可以单独移动每个项目，也可以将这些项目作为一个组移动，使它们相互对齐并与弹性容器对齐。此外，如果您已将弹性行换行，可以将这些线视为一个组，以便控制如何为这些线分配空间。本指南将向您展示这一切在实践中的应用，现在只需记住主轴方向符合 `flex-direction`。

## 创建弹性容器

让我们看看弹性框是如何获取一组不同大小的项目并使用弹性框来布置它们。

```html
<div class="container" id="container">
  <div>One</div>
  <div>Item two</div>
  <div>The item we will refer to as three</div>
</div>
```

要使用弹性框，您需要声明，您要使用弹性格式上下文而不是常规块和内联布局。为此，请将 `display` 属性的值更改为 `flex`。

```css
.container {
  display: flex;
}
```

正如您在[布局指南](/learn/css/layout)中了解到的，您将获得一个具有弹性项目子项的块级框。弹性项目直接使用它们的**初始值**开始展示一些弹性框行为。

{% Aside %} 所有 CSS 属性都有初始值，未应用任何 CSS 来更改初始行为时，这些初始值可以控制属性的“开箱即用”行为。只要弹性项目的父项设为 `display: flex`，弹性容器的子项就会成为弹性项目，所以，这些初始值意味着我们会开始看到一些弹性框行为。{% endAside %}

初始值意味着：

- 项目显示为一行。
- 项目不换行。
- 项目不会增长到填满容器。
- 项目在容器开始处对齐。

## 控制项目的方向

即使您尚未添加 `flex-direction` 属性，项目也会显示为一行，因为 `flex-direction` 的初始值为 `row` 。如果您希望显示为一行，则不需要添加该属性。要更改方向，请添加该属性和以下四个值之一：

- `row`：项目显示为一行。
- `row-reverse`：项目在弹性容器结尾处显示为一行。
- `column`：项目显示为一列。
- `column-reverse`：项目在弹性容器结尾处显示为一列。

您可以在下面的演示中使用我们给出的这组项目尝试所有值。

{% Codepen { user: 'web-dot-dev', id: 'bGgKNXq' } %}

### 反转项目流向以及无障碍功能

如果属性在对视觉显示进行重新排序时不遵守内容在 HTML 文档中的排序方式，在使用这些属性时，需要格外小心，因为它可能会对无障碍功能产生负面影响。 `row-reverse` 和 `column-reverse` 就是两个很好的示例。重新排序只影响视觉顺序，而不影响逻辑顺序。理解这一点很重要，因为逻辑顺序是屏幕阅读器读取内容的顺序，任何人在使用键盘导航时都会采用该顺序。

在以下视频中，您可以看到，在反向列布局中，当键盘导航遵循 DOM 而不是视觉显示时，链接之间的制表符是如何断开连接的。

{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/IgpaIRZd7kOq8sd46eaR.mp4", autoplay=true, controls=true %}

只要可以更改项目在弹性框或网格中的顺序，就会导致这个问题。因此，只要进行重新排序，都应当进行全面测试，从而确保重新排序并不会让某些人不方便使用您的网站。

有关更多信息，请参阅：

- [内容重新排序](/content-reordering/)
- [弹性框和键盘导航断开](https://tink.uk/flexbox-the-keyboard-navigation-disconnect/)

### 书写模式和方向

默认情况下，弹性项目排成一行。这一行与句子在书写模式和脚本方向上的走向相同。这意味着，如果您使用阿拉伯语，即脚本方向为从右到左 (rtl)，则项目将在右侧对齐。制表符顺序也将从右侧开始，因为这是用阿拉伯语读取句子的方式。

{% Codepen { user: 'web-dot-dev', id: 'ExZgwWN' } %}

如果您使用垂直书写模式，例如某些日语字体，则这一行将从上往下垂直分布。以下演示使用垂直书写模式，请尝试更改其中的 `flex-direction`。

{% Codepen { user: 'web-dot-dev', id: 'qBRaPXX', height: 600 } %}

因此，默认情况下，弹性项目的行为与文档的书写模式相关。大多数教程使用英语编写，或者采用另一种从左到右的水平书写模式编写。这样就可以很容易地假设弹性项目**在左侧**对齐并沿**水平方向**分布。

考虑了主轴、横轴加上书写模式，可能就更容易理解我们在弹性框中说**开头**和**结尾**，而不是上下左右。每个轴都有起点和终点。主轴的起点称为**主起点 (main-start)** 。因此，我们的弹性项目最初在主起点对齐。主轴的终点为**主终点 (main-end)** 。横轴的起点为**交叉起点 (cross-start)** ，终点为**交叉终点 (cross-end)** 。

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/uSH4TxRv8KNQDTK7Vn8h.svg", alt="标注了上述术语的图", width="800", height="382" %}

## 弹性项目换行

`flex-wrap` 属性的初始值为 `nowrap`。这意味着，如果容器中没有足够的空间，项目就会溢出。

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/VTUdLS9PeBziBvbOSc4q.jpg", alt="弹性容器包含九个项目，各个项目已经缩减为一个词一行，但仍没有足够的空间来并排显示它们，因此弹性项目扩展到了容器框外。", width="800", height="282" %}<figcaption> 一旦它们达到最小内容 (min-content) 大小，弹性项目将开始溢出其容器 </figcaption></figure>

在溢出发生之前，使用初始值显示的项目将尽可能缩小到 `min-content` 大小。

要使项目换行，请将 `flex-wrap: wrap` 添加到弹性容器。

```css
.container {
  display: flex;
  flex-wrap: wrap;
}
```

{% Codepen { user: 'web-dot-dev', id: 'WNRGdNZ', height: 601 } %}

弹性容器在换行后会创建多个**弹性行**。在空间分布方面，每一行就像一个新的弹性容器。因此，如果您要换行，则无法让第 2 行中的某些内容与它上面第 1 行中的某些内容对齐。这就是所谓的弹性框是一维框。您可以控制在一个轴、一行或一列上对齐，但不能像我们在网格中那样控制同时沿二者对齐。

### flex-flow 速记

您可以使用速记 `flex-flow` 来设置 `flex-direction` 和 `flex-wrap` 属性。例如，将 `flex-direction` 设置为 `column` 并允许项目换行：

```css
.container {
  display: flex;
  flex-flow: column wrap;
}
```

## 控制弹性项目内的空间

假设我们容器的空间比显示项目所需的空间多，则项目在开头处对齐，而不会增长以填充空间。它们在达到最大内容 (max-content) 大小时停止增长。这是因为 `flex-` 属性的初始值如下：

- `flex-grow: 0`：项目不增长。
- `flex-shrink: 1`：项目可以收缩到比它们的 `flex-basis` 小。
- `flex-basis: auto`：项目为基本大小 `auto` 。

这可以使用 `flex: initial` 的关键字值表示。 `flex` 速记属性或者普通写法 `flex-grow`、`flex-shrink` 和 `flex-basis` 适用于弹性容器的子项。

{% Codepen { user: 'web-dot-dev', id: 'LYxRebE' } %}

要使项目增长，同时允许大项目比小项目拥有更多空间，请使用 `flex:auto`。您可以使用上面的演示来尝试此操作。将属性设置为：

- `flex-grow: 1`：项目可以增大到超过其 `flex-basis`。
- `flex-shrink: 1`：项目可以收缩到小于其 `flex-basis`。
- `flex-basis: auto`：项目为基本大小 `auto` 。

使用 `flex: auto` 意味着项目最终具有不同的大小，因为项目之间共享的空间将在每个项目被设为最大内容大小*之后*被均分。因此，大项目会获得更多空间。要强制所有项目的大小一致并忽略内容的大小，请在演示中将 `flex:auto` 更改为 `flex: 1`。

这将解析为：

- `flex-grow: 1`：项目可以增长到超过其 `flex-basis`。
- `flex-shrink: 1`：项目可以收缩到比它们的 `flex-basis` 小。
- `flex-basis: 0`：项目为基本大小 `0` 。

使用 `flex: 1` 表示所有项目的大小都为零，因此，弹性容器中的所有空间均可供分配。由于所有项目的 `flex-grow` 因子均为 `1`，因此，它们可以平均增长并共享空间。

{% Aside %} 还有一个值 `flex: none`，可用于让弹性项目变得不灵活，既不增长，也不收缩。如果您只是使用弹性框来访问对齐属性但不需要任何弹性行为，该值可能很有用。{% endAside %}

### 允许项目以不同速率增长

您不必将所有项目的 `flex-grow` 因子均设为 `1` 。您可以为弹性项目指定不同的 `flex-grow` 因子。在下面的演示中，第一个项目设为 `flex: 1`，第二个项目设为 `flex: 2`，第三个项目设为 `flex: 3` 。当这些项目从 `0` 开始增长时，弹性容器中的可用空间被分成六份。一份给第一个项目，两份给第二个项目，三份给第三个项目。

{% Codepen { user: 'web-dot-dev', id: 'OJWRzEz' } %}

将 `flex-basis` 设为 `auto` 可以实现相同的目的，但您需要指定三个值。第一个值为 `flex-grow`，第二个值为 `flex-shrink`，第三个值为 `flex-basis`。

```css
.item1 {
  flex: 1 1 auto;
}

.item2 {
  flex: 2 1 auto;
}
```

这个用例不太常见，因为将 `flex-basis` 设为 `auto` 的原因是为了让浏览器计算空间分配。不过，如果想让一个项目增长得比算法确定的值多一点，它可能很有用。

## 为弹性项目重新排序

使用 `order` 属性可以为弹性容器中的项目重新排序。此属性可用于对**有序组**中的项目进行排序。项目按照 `flex-direction` 指定的方向排列，最小值在最前面。如果多个项目具有相同的值，它将与具有该值的其他项目一起显示。

下面的示例演示了这种排序。

{% Codepen { user: 'web-dot-dev', id: 'NWdRXoL' } %}

{% Aside 'warning' %} `order` 在使用时与 `flex-direction` 的值 `row-reverse` 和 `column-reverse` 存在相同的问题。它很容易让某些用户感觉到连接已断开。请勿使用 `order`，因为您需要修复文档中的乱序问题。如果项目在逻辑上应该以不同的顺序排列，请更改您的 HTML！{% endAside %}

{% Assessment 'flex' %}

## 弹性盒对齐概述

弹性盒提供了一组用于对齐项目以及在项目之间分配空间的属性。这些属性非常有用，它们已经移入自己的规范中，您在网格布局 (Grid Layout) 中也会看到它们。在这里，您可以了解，在使用弹性盒时它们如何工作。

这组属性可以分为两组：空间分配属性和对齐属性。用于分配空间的属性如下：

- `justify-content`：沿主轴分配空间。
- `align-content`：沿横轴分配空间。
- `place-content`：用于同时设置上述属性的速记。

用于在弹性盒中对齐的属性如下：

- `align-self`：沿横轴对齐单个项目
- `align-items`：将所有项目作为一个组沿横轴对齐

如果使用主轴，这些属性以 `justify-` 开头。使用横轴时，这些属性以 `align-` 开头。

## 沿主轴分配空间

在之前使用的 HTML 中，弹性项目排成一行，主轴上有空间。这些项目不够大，无法完全填满弹性容器。由于 `justify-content` 的初始值为 `flex-start`，所以项目在弹性容器的开头处对齐。项目在开头处对齐，所有的多余空间都位于结尾处。

向弹性容器添加 `justify-content` 属性，为它赋值 `flex-end`，项目将在容器结尾处对齐，空闲空间将位于开头。

```css
.container {
  display: flex;
  justify-content: flex-end;
}
```

您也可以使用 `justify-content: space-between` 在项目之间分配空间。

在演示中尝试一些值，并[查看 MDN](https://developer.mozilla.org/docs/Web/CSS/justify-content) 以获取一组完整的可能值。

{% Codepen { user: 'web-dot-dev', id: 'JjERpGb' } %}

{% Aside %} 要使 `justify-content` 属性起作用，您必须在容器中主轴方向上留出空闲空间。如果您的项目填满了该轴，没有可供分配的空间，那么该属性不会执行任何操作。{% endAside %}

### 使用 `flex-direction: column`

如果将 `flex-direction` 更改为 `column`，则 `justify-content` 将作用于列。在按列来处理项目时要想在容器中留出空闲空间，您需要为容器指定 `height` 或 `block-size` 。否则，没有空闲空间可供分配。

这次，使用弹性框列布局来尝试不同的值。

{% Codepen { user: 'web-dot-dev', id: 'bGgwLgz', height: 600 } %}

## 在弹性行之间分配空间

使用换行式弹性容器，您可以在横轴上分配空间。在这种情况下，您可以使用 `align-content` 属性，它的值与 `justify-content` 相同。默认情况下，`justify-content` 将项目与 `flex-start` 对齐，与它不同的是，`align-content` 的初始值为 `stretch`。将属性 `align-content` 添加到弹性容器可更改该默认行为。

```css
.container {
  align-content: center;
}
```

在演示中试一试。以下示例将弹性项目换行，容器设置了 `block-size`，因此，有一些空闲空间。

{% Codepen { user: 'web-dot-dev', id: 'poREawo' } %}

### `place-content` 简述

要同时设置 `justify-content` 和 `align-content`，您可以为 `place-content` 指定一个或两个值。指定一个值时，该值同时作用于两个轴，如果指定两个值，第一个值将作用于 `align-content`，第二个值将作用于 `justify-content`。

```css
.container {
  place-content: space-between;
  /* 将二者均设置为 space-between */
}

.container {
  place-content: center flex-end;
  /* 横轴换行居中，
   主轴上的项目沿弹性容器结尾处对齐 */
}
```

## 沿横轴对齐项目

在横轴上，您还可以使用 `align-items` 和 `align-self` 在弹性行内对齐项目。此对齐方式的可用空间取决于弹性容器的高度，如果是一组换行的项目，则取决于弹性行。

`align-self` 的初始值为 `stretch`，这就是一行中的弹性项目默认会拉伸到最高项目的高度的原因。要更改此设置，请将 `align-self` 属性添加到您的任意弹性项目。

```css
.container {
  display: flex;
}

.item1 {
  align-self: flex-start;
}
```

可使用以下任一值来对齐项目：

- `flex-start`
- `flex-end`
- `center`
- `stretch`
- `baseline`

请参阅 [MDN 上的完整值列表](https://developer.mozilla.org/docs/Web/CSS/align-self)。

下一个演示中有一行弹性项目，它们设置了 `flex-direction: row`。最后一个项目定义弹性容器的高度。第一个项目设置了 `align-self` 属性，属性值为 `flex-start` 。请尝试更改该属性的值，以了解它如何在横轴上的空间内移动。

{% Codepen { user: 'web-dot-dev', id: 'RwKGQee', height: 600 } %}

`align-self` 属性作用于单个项目。可以将 `align-items` 属性应用于弹性容器，以将所有单个 `align-self` 属性设置为一个组。

```css
.container {
  display: flex;
  align-items: flex-start;
}
```

在下一个演示中，请尝试更改 `align-items` 的值以将所有项目作为一个组沿横轴对齐。

{% Codepen { user: 'web-dot-dev', id: 'QWdKmby', height: 600 } %}

## 为什么弹性框中没有自我对齐 (justify-self)？

弹性项目在主轴上充当一个组。因此，没有将单个项目从该组中分离出来的概念。

在网格布局中，`justify-self` 和 `justify-items` 属性作用于内联轴，以沿该轴将其网格区域内的项目对齐。由于弹性布局是将项目视为一个组，因此，这些属性未在弹性上下文中实现。

值得注意的是，弹性框非常适合自动边距。如果您需要将一个项目从一个组中分离出来，或者要将该组分成两个组，可以应用边距来执行此操作。在下面的示例中，最后一个项目的左边距为 `auto`。自动边距会吸收其所应用到的方向上的所有空间。这意味着它会将项目向右推，从而拆分组。

{% Codepen { user: 'web-dot-dev', id: 'poRELbR' } %}

## 如何将项目垂直和水平居中显示

对齐属性可用于将项目在另一个框内居中放置。 `justify-content` 属性用于沿主轴（即行）对齐项目。`align-items` 属性用于沿横轴对齐项目。

```css
.container {
  width: 400px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

{% Aside %} 将来，我们可能无需将父项设为弹性容器即可实现这种对齐。对齐属性适用于块和内联布局。目前还没有浏览器实现这些功能。但是，切换到弹性格式上下文可以让您访问这些属性。如果您需要对齐某些内容，建议使用这个方法。{% endAside %}

{% Assessment 'conclusion' %}

## 资源

- [MDN CSS 弹性框布局](https://developer.mozilla.org/docs/Web/CSS/CSS_Flexible_Box_Layout)包含一系列详细的指南和示例。
- [CSS Tricks 弹性框使用指南](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [创建弹性框弹性容器时会发生什么](https://www.smashingmagazine.com/2018/08/flexbox-display-flex-container/)
- [关于弹性框对齐，您需要了解的一切](https://www.smashingmagazine.com/2018/08/flexbox-alignment/)
- [这个弹性框有多大？](https://www.smashingmagazine.com/2018/09/flexbox-sizing-flexible-box/)
- [弹性框用例](https://www.smashingmagazine.com/2018/10/flexbox-use-cases/)
