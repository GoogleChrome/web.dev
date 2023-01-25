---
title: 从未链接过的加粗链接：文本片段
subhead: 文本片段支持在 URL 片段中指定文本代码段。当导航到带有此类文本片段的 URL 时，浏览器可以强调和/或引起用户的注意。
authors:
  - thomassteiner
date: 2020-06-17
updated: 2021-05-17
hero: image/admin/Y4NLEbOwgTWdMNoxRYXw.jpg
alt: ''
description: 文本片段支持在 URL 片段中指定文本代码段。当导航到带有此类文本片段的 URL 时，浏览器可以强调和/或引起用户的注意。
tags:
  - blog
  - capabilities
feedback:
  - api
---

## 片段标识符

Chrome 80 是一个大版本。它包含许多备受期待的功能，例如 [Web Workers 中的 ECMAScript 模块](/module-workers/)、[空值合并](https://v8.dev/features/nullish-coalescing)、[可选链](https://v8.dev/features/optional-chaining)等。此版本像往常一样在 Chromium 博客中通过[博客文章](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html)发布。您可以在下面的屏幕截图中看到博客文章的摘录。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/egsW6tkKWYI8IHE6JyMZ.png", alt="", width="400", height="628" %}<figcaption>Chromium 博客文章，其中带有 <code>id</code> 属性的元素周围带有红框。</figcaption></figure>

您可能会问所有这些红框的含义是什么。它们是在 DevTools 中运行以下代码段的结果，突出显示具有 `id` 属性的所有元素。

```js
document.querySelectorAll('[id]').forEach((el) => {
  el.style.border = 'solid 2px red';
});
```

由于具有[片段标识符](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Fragment)，我可以向任何用红框突出显示的元素添加深层链接，然后在页面 URL 的[哈希](https://developer.mozilla.org/docs/Web/API/URL/hash)中使用。假设我想深层链接到 aside 中的*在[产品论坛](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs)中提供反馈*框，我可以通过手工制作 URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#HTML1&lt;/mark&gt;</code></a> 来实现此操作。正如您在 Developer Tools 的“元素”面板中看到的，相关元素有一个值为 `HTML1` 的 `id` 属性。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/whVXhhrYwA55S3i4J3l5.png", alt="", width="600", height="97" %} <figcaption>显示元素的 <code>id</code> 的 Dev Tools。</figcaption></figure>

如果我用 JavaScript 的 `URL()` 构造函数解析此 URL，会显示不同的组件。请注意值为 `#HTML1` 的 `hash` 属性。

```js/3
new URL('https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1');
/* Creates a new `URL` object
URL {
  hash: "#HTML1"
  host: "blog.chromium.org"
  hostname: "blog.chromium.org"
  href: "https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"
  origin: "https://blog.chromium.org"
  password: ""
  pathname: "/2019/12/chrome-80-content-indexing-es-modules.html"
  port: ""
  protocol: "https:"
  search: ""
  searchParams: URLSearchParams {}
  username: ""
}
*/
```

尽管我必须打开 Developer Tools 才能找到元素的 `id`，但这一点充分说明了博客文章作者打算链接到页面中这一特定部分的可能性。

如果我想链接到没有 `id` 的内容，该怎么办？假设我想链接到 *Web Workers 中的 ECMAScript 模块*标题。正如您在下面的屏幕截图中看到的，相关的 `<h1>` 没有 `id` 属性，这意味着我无法链接到此标题。文本片段正好可以解决的问题。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1g4rTS1q5LKHEHnDoF9o.png", alt="", width="600", height="71" %} <figcaption>显示没有 <code>id</code> 的标题的 Dev Tools。</figcaption></figure>

## 文本片段

[文本片段](https://wicg.github.io/ScrollToTextFragment/)建议添加了对在 URL 哈希中指定文本代码段的支持。当导航到带有此类文本片段的 URL 时，用户代理可以强调和/或引起用户的注意。

### 浏览器兼容性

基于 Chromium 80 及更高版本的浏览器支持文本片段功能。在撰写本文时，Safari 和 Firefox 尚未公开表示有意实现此功能。请参阅[相关链接](#related-links)中 Safari 和 Firefox 讨论的链接。

{% Aside 'success' %} 这些链接过去在跨某些常见服务（如 Twitter）使用的[客户端重定向](https://developer.mozilla.org/docs/Web/HTTP/Redirections#Alternative_way_of_specifying_redirections)提供服务时不起作用。此问题已在 [crbug.com/1055455](https://crbug.com/1055455) 中进行跟踪，现已修复。常规 [HTTP 重定向](https://developer.mozilla.org/docs/Web/HTTP/Redirections#Principle)始终工作正常。{% endAside %}

出于[安全](#security)原因，该功能需要在 [`noopener`](https://developer.mozilla.org/docs/Web/HTML/Link_types/noopener) 上下文中打开链接。因此，请确保在 `<a>` 定位标记中包含 [`rel="noopener"`](https://developer.mozilla.org/docs/Web/HTML/Element/a#attr-rel)，或者将 [`noopener`](https://developer.mozilla.org/docs/Web/API/Window/open#noopener) 添加到窗口功能特性的 `Window.open()` 列表中。

### `textStart`

在最简单的形式中，文本片段的语法如下：哈希符号 `#`，后跟 `:~:text=`，最后为 `textStart`，它表示我想要链接到的[百分比编码](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)文本。

```bash
#:~:text=textStart
```

例如，假设我想链接到[宣布 Chrome 80 中的功能的博客文章](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html)中的 *Web Workers 中的 ECMAScript 模块*标题，在此情况下，URL 为：

<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript%20Modules%20in%20Web%20Workers&lt;/mark&gt;</code></a>

<mark class="highlight-line highlight-line-active">按此方式</mark>强调文本片段。如果您在 Chrome 等支持浏览器中单击该链接，文本片段将突出显示并滚动到视图中：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D3jwPrJlvN3FmJo3pADt.png", alt="", width="400", height="208" %} <figcaption>文本片段滚动到视图中并突出显示。</figcaption></figure>

### `textStart` 和 `textEnd`

现在，如果我想链接到标题为 *Web Workers 中的 ECMAScript 模块*的完整部分，而不仅仅是其标题，该怎么办？对该部分的完整文本进行百分比编码会使生成的 URL 过长。

幸运的是，有一个更好的方法。我可以使用 `textStart,textEnd` 语法框住所需文本，而非完整文本。因此，我在所需文本的开头指定了几个百分比编码的字词，并在所需文本的末尾指定了几个百分比编码的字，用逗号 `,` 分隔。

类似于：

<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers,ES%20Modules%20in%20Web%20Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript%20Modules%20in%20Web%20Workers,ES%20Modules%20in%20Web%20Workers.&lt;/mark&gt;</code></a>。

对于 `textStart`，我使用 `ECMAScript%20Modules%20in%20Web%20Workers`，然后是逗号 `,`，后跟 `ES%20Modules%20in%20Web%20Workers.` 作为 `textEnd`。当您单击 Chrome 等支持浏览器时，整个部分将突出显示并滚动到视图中：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2yTYmKnjHTnqXkcmHF1F.png", alt="", width="400", height="343" %} <figcaption>文本片段滚动到视图中并突出显示。</figcaption></figure>

现在您可能想知道我对 `textStart` 和 `textEnd` 的选择。实际上，每边只有两个字的略短的 URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules,Web%20Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript%20Modules,Web%20Workers.&lt;/mark&gt;</code></a> 也可以运行。将 `textStart` 和 `textEnd` 与之前的值进行比较。

如果我更进一步，现在 `textStart` 和 `textEnd` 只使用一个词，您会发现我遇到了麻烦。URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript,Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript,Workers.&lt;/mark&gt;</code></a> 现在更短了，但是突出显示的文本片段不再是最初想要的片段。`Workers.` 第一次出现时停止突出显示，这是正确的，但并不是我想要的。问题是所需的部分不是由当前的单字 `textStart` 和 `textEnd` 值唯一标识的：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GGbbtHBpsoFyubnISyZw.png", alt="", width="400", height="342" %} <figcaption>非预期文本片段滚动到视图中并突出显示。</figcaption></figure>

### `prefix-` 和 `-suffix`

`textStart` 和 `textEnd` 使用足够长的值是获得唯一链接的一种解决方案。然而，在某些情况下，这是不可能的。附带说明一下，为什么我选择 Chrome 80 版本博客文章作为我的示例？答案是在这个版本中引入了文本片段：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yA1p3CijeDbTRwMys9Hq.png", alt="博客文章文本：文本 URL 片段。用户或作者现在可以使用 URL 中提供的文本片段链接到页面的特定部分。当页面加载后，浏览器将突出显示文本并将片段滚动到视图中。例如，下面的 URL 加载 'Cat' 的 wiki 页面并滚动到 `text` 参数中列出的内容。", width="800", height="200" %} <figcaption>文本片段公告博客文章摘录。</figcaption></figure>

请注意，在上面的屏幕截图中，“Text“ 一词出现了四次。第四次以绿色代码字体书写。如果我想链接到这个特定的词，我会将 `textStart` 设置为 `text`。由于 “Text“ 一词只包含一个词，因此没有 `textEnd`。现在怎么办？URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=text"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=text&lt;/mark&gt;</code></a> 将匹配标题中出现的第一个词 “Text“：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nXxCskUwdCxwxejPSSZW.png", alt="", width="800", height="209" %} <figcaption>与出现的第一个 “Text“ 匹配的文本片段。</figcaption></figure>

{% Aside 'caution' %} 请注意，文本片段匹配不区分大小写。{% endAside %}

幸运的是有一个解决方案。在这种情况下，我可以指定 `prefix​-` 和 `-suffix`。绿色代码字体 “Text“ 前面的字词是 “Text“，后面的词是 “parameter”。出现的其他三个词 “Text“ 周围没有相同的词。有了这些知识，我可以调整之前的 URL 并添加 `prefix-` 和 `-suffix`。与其他参数一样，它们也需要进行百分比编码，并且可以包含多个词。<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=the-,text,-parameter"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=the-,text,-parameter&lt;/mark&gt;</code></a>。为了让解析程序清楚地识别 `prefix-` 和 `-suffix`，需要用破折号 `-` 将它们与 `textStart` 和可选的 `textEnd` 区分开。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J3L5BVSMmzGY6xdkabP6.png", alt="", width="800", height="203" %} <figcaption>与预期出现位置的 “Text“ 匹配的文本片段。</figcaption></figure>

### 完整语法

文本片段的完整语法如下所示。（方括号表示可选参数。）所有参数的值都需要进行百分比编码。此要求对于破折号 `-`、&amp; 符号 `&` 和逗号 `,` 字符尤其重要，因为这样它们就不会被解释为文本指令语法的一部分。

```bash
#:~:text=[prefix-,]textStart[,textEnd][,-suffix]
```

每个 `prefix-`、`textStart`、`textEnd` 和 `-suffix` 将只匹配一个[块级元素](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements#Elements)内的文本，但完整的 `textStart,textEnd` 范围*可以*跨多个块。例如，在以下示例中，`:~:text=The quick,lazy dog` 将无法匹配，因为起始字符串 "The quick" 没有出现在单个不间断的块级元素中：

```html
<div>
  The
  <div></div>
  quick brown fox
</div>
<div>jumped over the lazy dog</div>
```

但它在以下示例中匹配：

```html
<div>The quick brown fox</div>
<div>jumped over the lazy dog</div>
```

### 使用浏览器扩展创建文本片段 URL

手动创建文本片段 URL 很枯燥，在确保它们是否唯一时尤其如此。如果您真的想要手工创建，规范中有一些提示并列出了[生成文本片段 URL](https://wicg.github.io/ScrollToTextFragment/#generating-text-fragment-directives) 的确切步骤。我们提供了一个名为 [Link to Text Fragment](https://github.com/GoogleChromeLabs/link-to-text-fragment) 的开源浏览器扩展，支持您通过选择任何文本，然后在上下文菜单中单击“将链接复制到所选文本”，来链接到此文本。此扩展可用于以下浏览器：

- [适用于 Google Chrome 的文本片段的链接](https://chrome.google.com/webstore/detail/link-to-text-fragment/pbcodcjpfjdpcineamnnmbkkmkdpajjg)
- [适用于 Microsoft Edge 的文本片段的链接](https://microsoftedge.microsoft.com/addons/detail/link-to-text-fragment/pmdldpbcbobaamgkpkghjigngamlolag)
- [适用于 Mozilla Firefox 的文本片段的链接](https://addons.mozilla.org/firefox/addon/link-to-text-fragment/)
- [适用于 Apple Safari 的文本片段的链接](https://apps.apple.com/app/link-to-text-fragment/id1532224396)

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ASLtFCPoHvyTKrAtKAv4.png", alt="", width="800", height="500" %} <figcaption> <a href="https://github.com/GoogleChromeLabs/link-to-text-fragment">文本片段链接</a>浏览器扩展。</figcaption></figure>

### 一个 URL 中有多个文本片段

请注意，一个 URL 中可以出现多个文本片段。特定的文本片段需要用 &amp; 字符 `&` 分隔。以下是一个包含三个文本片段的示例链接：<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&amp;text=text,-parameter&amp;text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%25%20of%20a%20cat's%20diet"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=Text%20URL%20Fragments&amp;text=text,-parameter&amp;text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%25%20of%20a%20cat's%20diet&lt;mark class="highlight-line highlight-line-active"&gt;</code></a>。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ffsq7aoSoVd9q6r5cquY.png", alt="", width="800", height="324" %} <figcaption>一个 URL 中有三个文本片段。</figcaption></figure>

### 混合使用元素和文本片段

传统元素片段可以与文本片段组合使用。将两者放在同一个 URL 中是完全可以的，例如，在页面上的原始文本发生更改时提供有效回退，以便文本片段不再匹配。链接到*在[产品论坛](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs)中提供反馈*部分的 URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1:~:text=Give%20us%20feedback%20in%20our%20Product%20Forums."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#HTML1:~:text=Give%20us%20feedback%20in%20our%20Product%20Forums.&lt;/mark&gt;</code></a> 包含一个元素片段 (`HTML1`) 和一个文本片段 (`text=Give%20us%20feedback%20in%20our%20Product%20Forums.`)：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/JRKCM6Ihrq8sgRZRiymr.png", alt="", width="237", height="121" %} <figcaption>链接到元素片段和文本片段两者。</figcaption></figure>

### 片段指令

我还没有解释语法中的一个元素：片段指令 `:~:`。为了避免与上述现有 URL 元素片段的兼容性问题，[文本片段规范](https://wicg.github.io/ScrollToTextFragment/)引入了片段指令。片段指令是由代码序列 `:~:` 分隔的 URL 片段的一部分。它为用户代理指令保留，例如 `text=`，将在加载期间从 URL 中去除，以便作者脚本无法直接与其交互。用户代理指令也称为*指令*。在此具体案例中，`text=` 因此称为*文本指令*。

### 功能检测

要检测支持，请测试 `document` 上的 `fragmentDirective` 属性。片段指令是一种让 URL 指定指向浏览器而非文档的指令的机制。它旨在避免与作者脚本直接交互，以便未来可以添加用户代理指令，而不必担心对现有内容进行重大更改。未来添加内容的一个可能的示例是翻译提示。

```js
if ('fragmentDirective' in document) {
  //支持文本片段
}
```

{% Aside %} 从 Chrome 80 到 Chrome 85，在 `Location.prototype` 中定义了 `fragmentDirective` 属性。有关此更改的详细信息，请参阅 [WICG/scroll-to-text-fragment#130](https://github.com/WICG/scroll-to-text-fragment/issues/130)。{% endAside %}

功能检测主要适用于动态生成链接的情况（例如由搜索引擎生成），以避免将文本片段链接提供给不支持它们的浏览器。

### 样式化文本片段

默认情况下，浏览器样式化文本片段的方式与样式化 [`mark`](https://developer.mozilla.org/docs/Web/HTML/Element/mark) 相同（`mark`  通常是黄底黑字，即 CSS [系统颜色](https://developer.mozilla.org/docs/Web/CSS/color_value#system_colors)）。用户代理样式表包含如下所示的 CSS：

```css
:root::target-text {
  color: MarkText;
  background: Mark;
}
```

如您所见，浏览器公开了一个伪选择器 [`::target-text`](https://drafts.csswg.org/css-pseudo/#selectordef-target-text)，您可以使用它来自定义应用的突出显示。例如，您可以将文本片段设计为红底黑字。与往常一样，请务必[检查颜色对比度](https://developer.chrome.com/docs/devtools/accessibility/reference/#contrast)，这样您的重写样式就不会导致可访问性问题，并确保突出显示实际上在视觉上与其余内容不同。

```css
:root::target-text {
  color: black;
  background-color: red;
}
```

### 可修补性

文本片段功能可以在一定程度上进行 polyfill。我们提供 [polyfill](https://github.com/GoogleChromeLabs/text-fragments-polyfill)，它由[扩展](https://github.com/GoogleChromeLabs/link-to-text-fragment)内部使用，适用于不提供对文本片段的内置支持的浏览器（此功能在 JavaScript 中实现的浏览器）。

### 以编程方式生成文本片段链接

[polyfill](https://github.com/GoogleChromeLabs/text-fragments-polyfill) 包含一个文件 `fragment-generation-utils.js`，您可以导入并用它来生成文本片段的链接。以下代码示例进行了概述：

```js
const { generateFragment } = await import('https://unpkg.com/text-fragments-polyfill/dist/fragment-generation-utils.js');
const result = generateFragment(window.getSelection());
if (result.status === 0) {
  let url = `${location.origin}${location.pathname}${location.search}`;
  const fragment = result.fragment;
  const prefix = fragment.prefix ?
    `${encodeURIComponent(fragment.prefix)}-,` :
    '';
  const suffix = fragment.suffix ?
    `,-${encodeURIComponent(fragment.suffix)}` :
    '';
  const textStart = encodeURIComponent(fragment.textStart);
  const textEnd = fragment.textEnd ?
    `,${encodeURIComponent(fragment.textEnd)}` :
    '';
  url += `#:~:text=${prefix}${textStart}${textEnd}${suffix}`;
  console.log(url);
}
```

### 获取文本片段以进行分析

许多站点使用片段进行路由，这就是浏览器去除文本片段以免破坏这些页面的原因。例如，[需要](https://github.com/WICG/scroll-to-text-fragment/issues/128)向页面公开文本片段链接以进行分析，但建议的解决方案尚未实施。作为目前的解决方法，您可以使用以下代码来提取所需的信息。

```js
new URL(performance.getEntries().find(({ type }) => type === 'navigate').name).hash;
```

### 安全

仅在作为[用户激活](https://html.spec.whatwg.org/multipage/interaction.html#tracking-user-activation)结果的完整（非同一页面）导航上调用文本片段指令。此外，源自与目的地不同的来源的导航将需要在 [`noopener`](https://html.spec.whatwg.org/multipage/links.html#link-type-noopener) 上下文中进行导航，以便已知目的地页面被充分隔离。文本片段指令仅适用于主框架。这意味着不会在 iframe 内搜索文本，且 iframe 导航不会调用文本片段。

### 隐私

无论是否在页面上找到文本片段，文本片段规范的实现都不会泄漏，这一点很重要。虽然元素片段完全在原始页面作者的控制之下，但任何人都可以创建文本片段。请记住，在上面的示例中，无法链接到 *Web Workers 中的 ECMAScript 模块*标题，因为 `<h1>` 没有 `id`，但是任何人（包括我）如何只通过精心制作文本片段来链接到任何地方?

想象一下，我运行了一个邪恶的广告网络 `evil-ads.example.com`。再想象一下，在我的一个广告 iframe 中，我在 `dating.example.com` 中动态地创建了一个隐藏的跨源 iframe，当用户与广告互动时，其具有一个文本片段 URL <code>dating.example.com&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=Log%20Out&lt;/mark&gt;</code>。如果找到文本 "Log Out"，我知道受害者当前已登录到 `dating.example.com`，我可以使用它进行用户分析。由于一个简单的文本片段实现可决定成功的匹配应导致焦点切换，因此在 `evil-ads.example.com` 上，我可以监听 `blur` 事件，从而知道匹配何时发生。在 Chrome 中，我们已经实现了文本片段，以防止上述情况发生。

另一种攻击可能是基于滚动位置利用网络流量。假设我可以访问受害者的网络流量日志，例如以公司内网管理员身份。现在想象一下，有一个很长的人力资源文档 *如果您遭受了……该怎么办*，以及一个诸如*倦怠*、*焦虑*等情况的列表。我可以在列表中的每个项目旁边放置一个跟踪像素。如果我确定加载文档与加载例如*倦怠*项目旁边的跟踪像素在时间上同时发生，那么我可以以内部网管理员身份确定员工单击了带有 `:~:text=burn%20out` 的文本片段链接，员工可能认为该链接是机密的，任何人都看不到。由于可以使用此示例作为开始，且由于利用它需要满足*非常*具体的先决条件，因此 Chrome 安全团队评估认为在导航上实现滚动的风险是可管理的。其他用户代理可以决定改为显示手动滚动 UI 元素。

对于希望退出的站点，Chromium 支持他们可以发送的[文档策略](https://wicg.github.io/document-policy/)标题，这样用户代理就不会处理文本片段 URL。

```bash
Document-Policy: force-load-at-top
```

## 禁用文本片段

禁用该功能的最简单方法是使用可以注入 HTTP 响应标头（例如 [ModHeader](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj)（不是 Google 产品））的扩展，以插入响应（*不是*请求）标头的扩展，如下所示：

```bash
Document-Policy: force-load-at-top
```

另一种更复杂的退出方式是使用企业设置 [`ScrollToTextFragmentEnabled`](https://cloud.google.com/docs/chrome-enterprise/policies/?policy=ScrollToTextFragmentEnabled)。要在 macOS 上执行此操作，请将以下命令粘贴到终端中。

```bash
defaults write com.google.Chrome ScrollToTextFragmentEnabled -bool false
```

在 Windows 上，请按照 [Google Chrome Enterprise 帮助](https://support.google.com/chrome/a/answer/9131254?hl=en)支持站点上的文档进行操作。

{% Aside 'warning' %}只有在您知道自己在做什么时才尝试这样做。{% endAside %}

## 网络搜索中的文本片段

对于某些搜索，搜索引擎 Google 会使用来自相关网站的内容代码段提供快速答案或摘要。当以问题的形式进行搜索时，这些*精选代码段*最有可能出现。单击精选代码段会使用户直接转到源网页上的精选代码段文本。这要归功于自动创建的文本片段 URL。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KbZgnGxZOOymLxYPZyGH.png", alt="", width="800", height="451" %} <figcaption>显示精选代码段的 Google 搜索引擎结果页面。状态栏显示文本片段 URL。</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4Q7zk9xBnb2uw8GRaLnU.png", alt="", width="800", height="451" %} <figcaption>单击后，页面的相关部分将滚动到视图中。</figcaption></figure>

## 结论

文本片段 URL 是一个强大的功能，可以链接到网页上的任意文本。学术界可以使用它来提供高度准确的引文或参考链接。搜索引擎可以使用它来深层链接到页面上的文本结果。社交网站可以使用它让用户分享网页的特定段落，而不是无法访问的屏幕截图。我希望您开始[使用文本片段 URL](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&text=text,-parameter&text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%%20of%20a%20cat's%20diet) 并像我一样发现它很有用。请务必安装[文本片段链接](https://github.com/GoogleChromeLabs/link-to-text-fragment)浏览器扩展。

## 相关链接

- [规范草案](https://wicg.github.io/scroll-to-text-fragment/)
- [TAG 审阅](https://github.com/w3ctag/design-reviews/issues/392)
- [Chrome 平台状态条目](https://chromestatus.com/feature/4733392803332096)
- [Chrome 跟踪错误](https://crbug.com/919204)
- [发送意图线程](https://groups.google.com/a/chromium.org/d/topic/blink-dev/zlLSxQ9BA8Y/discussion)
- [WebKit-Dev 线程](https://lists.webkit.org/pipermail/webkit-dev/2019-December/030978.html)
- [Mozilla 标准定位线程](https://github.com/mozilla/standards-positions/issues/194)

## 致谢

文本片段由 [Nick Burris](https://github.com/nickburris) 和 [David Bokan](https://github.com/bokand) 实现和提供规范，[Grant Wang](https://github.com/grantjwang) 也做出了贡献。感谢 [Joe Medley](https://github.com/jpmedley) 提供全文审阅。主图作者：[Greg Rakozy](https://unsplash.com/@grakozy) 来源：[Unsplash](https://unsplash.com/photos/oMpAz-DN-9I)。
