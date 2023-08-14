---
title: '语义化 HTML'
authors:
  - estelleweyl
description: 使用正确的 HTML 元素来描述你的文档内容
date: 2022-09-27
tags:
  - html
---

有无数种方式可以用来标记你的内容，比如使用多达 100 种 HTML 元素又或是自定义元素。然而，当中有一些内容——尤其是「语义化」——会比其他方式更好。

「语义化」意味着「与意义相关」。编写语义化的 HTML 意味着基于元素的含义而不是表现形式来使用 HTML 元素结构化你的内容。

尽管本系列尚未涵盖许多 HTML 元素，但即使不了解 HTML，以下两个代码片段展示了语义化标记如何为内容提供上下文。为了节省你在滚动时想象将「thirty words」扩展为 30 个词的时间，两个代码片段都使用了单词计数而不是「ipsum lorem」。

第一个代码片段使用了 `<div>` 和 `<span>` 两个元素，但这两个元素并没有语义值。

```html
<div>
  <span>Three words</span>
  <div>
    <a>one word</a>
    <a>one word</a>
    <a>one word</a>
    <a>one word</a>
  </div>
</div>
<div>
  <div>
    <div>five words</div>
  </div>
  <div>
    <div>three words</div>
    <div>forty-six words</div>
    <div>forty-four words</div>
  </div>
  <div>
    <div>seven words</h2>
    <div>sixty-eight words</div>
    <div>forty-four words</div>
  </div>
</div>
<div>
   <span>five words</span>
</div>
```

你搞清楚到这些词的意义所在吗？完全不清楚。

现在，让我们使用语义化元素重写这段代码：

```html
<header>
  <h1>Three words</h1>
  <nav>
    <a>one word</a>
    <a>one word</a>
    <a>one word</a>
    <a>one word</a>
  </nav>
</header>
<main>
  <header>
    <h1>five words</h1>
  </header>
  <section>
    <h2>three words</h2>
    <p>forty-six words</p>
    <p>forty-four words</p>
  </section>
  <section>
    <h2>seven words</h2>
    <p>sixty-eight words</p>
    <p>forty-four words</p>
  </section>
</main>
<footer>
  <p>five words</p>
</footer>
```

哪个代码块表达了含义？显而易见，仅使用 `<div>` 和 `<span>` 这些非语义元素，你就无法确定第一个代码块中的内容代表什么。而在第二个代码示例中，使用了语义元素能为非编程人员提供足够的上下文来解释目的和含义，即使他们从未接触过 HTML 标记；即便开发者不理解内容（比如外文内容），它也为他们提供了足够多上下文来理解页面大纲。

在第二个代码块中，我们可以通过语义元素理解结构，而不必理解内容，因为语义元素提供了含义和上下文结构。你可以看出第一个 `header` 表示站点的横幅，而 `<h1>` 很可能是站点名称。`footer` 是站点的页脚：`five words` 可能是版权声明或商业地址。

语义化标记不仅仅是为了方便开发者阅读标记，更重要的是为了让自动化工具能够理解标记。而开发者工具也展示了语义元素如何提供为机器可读的结构的方式。

## 无障碍对象模型（AOM）

当浏览器解析接收到的内容时，它会构建文档对象模型（DOM）和 CSS 对象模型（CSSOM）。然后还会构建无障碍功能树（AOM）。辅助设备（如屏幕阅读器）可以使用 AOM 解析和解释内容。DOM 则是文档中所有节点构成的树形结构，而 AOM 则是类似于 DOM 的语义版本。

让我们比较一下这两种文档结构在 Firefox 的无障碍功能面板中的呈现方式：

<div class="switcher">
  <figure>
    {% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/R2d9f5NfZTo1j9mOul0d.png", alt="A list of nodes which are all link or text leaf.", width="312", height="762" %}
    <figcaption>
      The first code snippet.
    </figcaption>
  </figure>
  <figure>
    {% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/3pwHvhjyjewbiEfHoVwQ.png", alt="A list of nodes with clear landmarks.", width="332", height="888" %}
    <figcaption>
      The second code snippet.
    </figcaption>
  </figure>
</div>

在第二张屏幕截图中，第二个代码块中有四个标志性角色（landmark roles）。它使用了方便命名的语义化界标 `<header>`、`<main>`、`<footer>` 和 `<nav>` 用于「导航」。界标为网页内容提供了结构，并确保屏幕阅读器用户可以轻松地通过键盘导航到重要的内容部分。

请注意，当 `<header>` 和 `<footer>` 不嵌套在其他界标中时，它们分别具有 `banner` 和 `contentinfo` 的角色名称。Chrome 的 AOM 如下所示：

<div class="switcher">
  <figure>
    {% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/D2dsfO1wm6UrdorarkC0.png", alt="All text nodes are listed as static text.", width="456", height="602" %}
    <figcaption>
      The first code snippet.
    </figcaption>
  </figure>
  <figure>
    {% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/svdGvQhpNlk7UiFgoCpH.png", alt="The text nodes all have descriptions.", width="582", height="1046" %}
    <figcaption>
      The second code snippet.
    </figcaption>
  </figure>
</div>

在查看 Chrome 开发者工具时，你会注意到在使用语义元素和未使用语义元素时，辅助功能对象模型之间存在显著差异。

很明显，使用语义元素有助于改善无障碍功能，反之，则会影响无障碍功能。HTML 通常默认情况下是无障碍的。作为开发人员，我们的任务是保护 HTML 的默认无障碍特性，并确保最大程度地改进无障碍功能。你可以 [在开发者工具中检查辅助功能对象模型](https://developer.chrome.com/docs/devtools/accessibility/reference/#explore-tree)。

### `role` 属性

`role` 属性描述了元素在文档上下文中的角色。`role` 属性是一个全局属性，即对所有元素都有效，它是由 [ARIA 规范](https://w3c.github.io/aria/#dfn-role) 定义的，而不是由 [WHATWG HTML 规范](https://html.spec.whatwg.org/dev/) 所定义的，而它也定义了这个系列中几乎所有内容。

语义元素各自具有隐含的角色，其中一些则会取决于上下文。如我们在 Firefox 辅助功能开发工具的截图中所见，顶层的 `<header>`、`<main>`、`<footer>` 和 `<nav>` 都是界标（landmarks），而嵌套在 `<main>` 中的 `<header>` 是一个部分（section）。Chrome 的截图列出了这些元素的 [ARIA 角色](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles)：`<main>` 是 `main`，`<nav>` 是 `navigation`，而 `<footer>` 作为文档的页脚，则是 `contentinfo`。当 `<header>` 是文档的标题时，其默认角色是 `banner`，用于定义该部分的全局站点头部。当 `<header>` 或 `<footer>` 嵌套在其他部分元素中时，它们不是界标。这两个开发工具的截图都显示了这一点。

元素角色名称在构建 AOM 时非常重要。元素的语义或「角色」对于辅助技术和某些情况下的搜索引擎非常重要。辅助技术用户依赖语义来浏览和理解内容的含义。元素的角色使用户能够快速获取所需的内容，当被聚焦时，角色也会告知屏幕阅读器用户如何与交互元素进行交互。

交互元素（如按钮、链接、范围和复选框）都具有隐式角色，这些元素都会自动添加到键盘的 Tab 键序列中，并且都具有默认的用户操作支持。隐式角色或显式的 `role` 值能告知用户可以期望元素按特定的默认用户交互行为进行交互。

使用 `role` 属性，你可以为任何元素指定一个角色，包括与原标签所表示角色不同的角色。例如，`<button>` 元素具有的隐式角色是 `button`。通过使用 `role="button"`，你可以将任何元素在语义上转换为按钮：`<p role="button">点击我</p>`。

虽然给一个元素添加 `role="button"` 会告知屏幕阅读器该元素是一个按钮，但它并不会改变元素的外观或功能。`button` 元素在不进行任何处理的情况下已经提供了许多功能。`button` 元素会自动添加到文档的 Tab 键顺序中，默认情况下可以通过键盘聚焦。按下回车键和空格键都会触发按钮。按钮还具有由 [HTMLButtonElement](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement) 接口提供的所有方法和属性。如果你不使用语义化的按钮，那么你就需要重新编写所有这些功能。所以使用 `<button>` 要简单得多。

回到非语义代码块的 AOM 截图。你会注意到非语义元素没有隐式角色。但我们可以通过为每个元素分配角色，使非语义版本具有语义：

```html
<div role="banner">
  <span role="heading" aria-level="1">Three words</span>
  <div role="navigation">
    <a>one word</a>
    <a>one word</a>
    <a>one word</a>
    <a>one word</a>
  </div>
</div>
```

虽然 `role` 属性可以用来为任何元素添加语义，但你应该使用具有隐式角色的元素来实现你的需要。

## 语义化元素

问问你自己：「哪个元素最能代表这个标记的部分的功能？」这通常会帮助你选择最适合的元素。你所选择的元素，以及你使用的标签，都应该与你展示的内容相符，因为标签具有语义上的含义。

HTML 应该用于结构化内容，而不是定义内容的外观，控制外观是 CSS 的领域。虽然某些元素的外观已经被定义成一定的样式，但不要根据用户代理样式表中元素的默认外观来选择元素，相反，而是根据元素的语义含义和功能来选择每个元素。以逻辑、语义和有意义的方式编写 HTML 更有助于确保 CSS 的正确应用。

在编写代码时选择适当的元素意味着你不需要重构或对你的 HTML 进行注释。如果你考虑使用适当的元素，你通常就能选择正确的元素。否则，可能会弄巧成拙。当你了解每个元素的语义，并意识到选择正确的元素的重要性时，就可以在不大费周章的情况下做出正确的选择。

在下一节中，你将使用语义元素来构建你的 [文档结构](/learn/html/document-structure/)。

{% Assessment 'semantic-html' %}
