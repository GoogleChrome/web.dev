---
layout: post
title: 使用带有本地字体的高级排版
subhead: |2-

  了解本地字体访问 API 如何允许您访问用户本地安装的字体并获取有关它们的低级详细信息。
tags:
  - blog
  - fonts
  - capabilities
authors:
  - thomassteiner
description: 本地字体 API 枚举用户安装的本地字体并提供对各种 TrueType/OpenType 表的低级访问。
date: 2020-08-24
updated: 2021-07-30
hero: image/admin/oeXwG1zSwnivzpvcUJly.jpg
alt: 字体书页面。
feedback:
  - api
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/-7289075996899147775"
---

{% Aside %} 本地字体访问 API 是[功能项目](https://developer.chrome.com/blog/capabilities/)的一部分，目前正在开发中。本文将随着实施的进展而更新。{% endAside %}

## Web 安全字体

如果您从事 Web 开发的时间足够长，您可能会记得 [Web 安全字体](https://developer.mozilla.org/docs/Learn/CSS/Styling_text/Fundamentals#Web_safe_fonts)。众所周知，这些字体几乎可用于最常用的操作系统（即 Windows、macOS、最常见的 Linux 发行版、Android 和 iOS）的所有实例。在 2000 年代初期，Microsoft 甚至率先发起了一项名为 *Web TrueType 核心字体*的[计划](https://web.archive.org/web/20020124085641/http://www.microsoft.com/typography/fontpack/default.htm)，该计划提供这些字体供免费下载，其目标是*“每当您访问指定它们的网站时，您将看到与网站设计者所期望的完全相同的页面”* 。是的，这包括以 [Comic Sans MS](https://docs.microsoft.com/en-us/typography/font-list/comic-sans-ms) 设置的站点。下面是一个经典的 Web 安全字体堆栈（带有任何 [`sans-serif`](https://developer.mozilla.org/docs/Web/CSS/font-family#%3Cgeneric-name%3E:~:text=sans%2Dserif,-Glyphs) 字体的最终回退）：

```css
body {
  font-family: Helvetica, Arial, sans-serif;
}
```

## Web 字体

Web 安全字体无比重要的日子早已一去不复返了。今天，我们有[Web 字体](https://developer.mozilla.org/docs/Learn/CSS/Styling_text/Web_fonts)，其中一些甚至是[可变字体](/variable-fonts/)，我们可以通过更改各种公开轴的值来进一步调整。您可以通过在 CSS 开头声明一个 [`@font-face`](https://developer.mozilla.org/docs/Web/CSS/@font-face) 块来使用 Web 字体，该块指定了要下载的字体文件：

```css
@font-face {
  font-family: 'FlamboyantSansSerif';
  src: url('flamboyant.woff2');
}
```

在此之后，您可以像往常一样通过指定 [`font-family`](https://developer.mozilla.org/docs/Web/CSS/font-family) 来使用自定义 Web 字体：

```css
body {
  font-family: 'FlamboyantSansSerif';
}
```

## 本地字体作为指纹媒介

大多数 Web 字体来自 Web。不过，`@font-face` 声明中的 [`src`](https://developer.mozilla.org/docs/Web/CSS/@font-face/src) 属性，除了 [`url ()`](https://developer.mozilla.org/docs/Web/CSS/@font-face/src#Values:~:text=%3Curl%3E%20%5B%20format(%20%3Cstring%3E%23%20)%20%5D%3F,-Specifies) 函数外，还接受 [`local()`](https://developer.mozilla.org/docs/Web/CSS/@font-face/src#format():~:text=downloaded.-,%3Cfont%2Dface%2Dname%3E) 函数。 这允许在本地加载自定义字体（惊喜！）。 如果用户碰巧在其操作系统上安装了 *FlamboyantSansSerif*，则将使用本地副本而不是进行下载：

```css
@font-face {
  font-family: 'FlamboyantSansSerif';
  src: local('FlamboyantSansSerif'), url('flamboyant.woff2');
}
```

这种方法提供了一种很好的回退机制，可以节省带宽。 遗憾的是，互联网上没有完美的东西。`local()` 函数的问题在于它可能会被滥用于浏览器指纹识别。事实证明，用户安装的字体列表可以很容易识别。许多公司都有自己的企业字体，这些字体安装在员工的笔记本电脑上。例如，Google 有一种名为 *Google Sans* 的企业字体。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xivl6c1xM2VlqFf9GvgQ.png", alt="显示 Google Sans 字体预览的 macOS 字体书应用。", width="800", height="420" %}<figcaption>安装在 Google 员工笔记本电脑上的 Google Sans 字体。</figcaption></figure>

攻击者可以通过测试是否存在大量已知的公司字体（如*Google Sans）*来尝试确定某人为哪家公司工作。攻击者会尝试在画布上渲染以这些字体设置的文本并测量字形。如果字形与公司字体的已知形状相匹配，攻击者就会成功。如果字形不匹配，攻击者就知道使用了默认替代字体，因为没有安装公司字体。有关这类攻击和其他浏览器指纹识别攻击的完整详细信息，请阅读 Laperdix *等人*的[调查论文](http://www-sop.inria.fr/members/Nataliia.Bielova/papers/Lape-etal-20-TWEB.pdf)。

除了公司字体，甚至只是安装的字体列表也可以识别。这种攻击媒介的情况已经变得如此糟糕，以至于最近 WebKit 团队[决定](https://webkit.org/tracking-prevention/#table-of-contents-toggle:~:text=Changed%20font%20availability%20to%20web%20content,but%20not%20locally%20user%2Dinstalled%20fonts)*“只包括 [在可用字体列表中] Web 字体和操作系统附带的字体，但不包括本地用户安装的字体”* 。（这里，我有一篇关于授予对本地字体的访问权限的文章。）

## 本地字体访问 API

本文的开头可能会让您感到失落。真的不能有点好东西吗？别担心。我们认为我们可以，也许[一切都还有希望](http://hyperboleandahalf.blogspot.com/2013/05/depression-part-two.html#Blog1:~:text=like-,hopeless)。但首先，让我回答一个您可能会问自己的问题。

### 有 Web 字体时为什么需要本地字体访问 API？

专业品质的设计和图形工具历来难以在网络上传输。其中一个绊脚石就是无法访问和使用设计师在本地安装的各种专业构造和提示的字体。Web 字体支持某些发布用例，但无法以编程方式访问光栅器用来渲染字形轮廓的矢量字形形状和字体表。同样也无法访问 Web 字体的二进制数据。

- 设计工具需要访问字体字节来执行它们自己的 OpenType 布局实现，并允许设计工具在较低级别挂钩，以对字形形状执行矢量过滤或转换等操作。
- 开发人员可能会为他们带到 Web 的应用程序使用遗留字体堆栈。要使用这些堆栈，它们通常需要直接访问字体数据，而 Web 字体不提供这些数据。
- 某些字体可能未获得通过 Web 传输的许可。例如，Linotype 拥有仅供[台式机使用](https://www.linotype.com/25/font-licensing.html)的一些字体的许可证。

本地字体访问 API 是解决这些挑战的一种尝试。它由两部分组成：

- **字体枚举 API** ，允许用户授权访问整套可用系统字体。
- 从每个枚举结果中，能够请求包含完整字体数据的低级（面向字节的）**SFNT 容器访问**。

### 当前状态 {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">步骤</th>
<th data-md-type="table_cell">状态</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. 创建解释器</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/local-font-access" data-md-type="link">完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 创建规范初稿</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/local-font-access/" data-md-type="link">进行中</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3.<strong data-md-type="double_emphasis">收集反馈并迭代设计</strong>
</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link"><strong data-md-type="double_emphasis">进行中</strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. 初始试用</td>
<td data-md-type="table_cell"><a>完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. 启动</td>
<td data-md-type="table_cell">未开始</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

### 如何使用本地字体访问 API

#### 通过 about://flags 启用

要在本地试验本地字体访问 API，请在  `about://flags` 中启用 `#font-access` 标志。

#### 功能检测

要检查是否支持本地字体访问 API，请使用：

```js
if ('fonts' in navigator) {
  // 支持本地字体访问 API
}
```

#### 请求权限

对用户本地字体的访问受 `"local-fonts"` 权限的限制，您可以使用 [`navigator.permissions.request()`](https://w3c.github.io/permissions/#requesting-more-permission) 来请求该权限。

```js
// 请求使用 API 的权限
try {
  const status = await navigator.permissions.request({
    name: 'local-fonts',
  });
  if (status.state !== 'granted') {
    throw new Error('Permission to access local fonts not granted.');
  }
} catch (err) {
  // `TypeError` 指示 'local-fonts'
  // 权限尚未实现，因此，
  // 只有这不是问题时，才会 `throw`。
  if (err.name !== 'TypeError') {
    throw err;
  }
}
```

#### 枚举本地字体

授予权限后，您可以从 `navigator.fonts` 上公开的 `FontManager` 接口调用 `query()` 向浏览器询问本地安装的字体，它将显示在选择器中供用户选择与页面共享全部或一部分。这会产生一个您可以循环的数组。每个字体都表示为一个 `FontMetadata` 对象，具有属性 `family`（如 `"Comic Sans MS"`）、`fullName`（如 `"Comic Sans MS"`）和 `postscriptName`（如 `"ComicSansMS"`）。

```js
// 查询所有可用字体和日志元数据。
try {
  const pickedFonts = await navigator.fonts.query();
  for (const metadata of pickedFonts) {
    console.log(metadata.postscriptName);
    console.log(metadata.fullName);
    console.log(metadata.family);
  }
} catch (err) {
  console.error(err.name, err.message);
}
```

#### 访问 SFNT 数据

通过 `FontMetadata` 对象的 `blob()` 方法可以获得完整的 [SFNT](https://en.wikipedia.org/wiki/SFNT) 访问。SFNT 是一种字体文件格式，可以包含其他字体，例如 PostScript、TrueType、OpenType、Web Open Font Format (WOFF) 字体等。

```js
try {
  const pickedFonts = await navigator.fonts.query();
  for (const metadata of pickedFonts) {
    // 我们只对特定字体感兴趣。
    if (metadata.family !== 'Comic Sans MS') {
      continue;
    }
    // `blob()` 返回一个包含有效且完整的
    // SFNT 包装字体数据的 Blob。
    const sfnt = await metadata.blob();

    const sfntVersion = new TextDecoder().decode(
      // 只选取我们需要的字节：前 4 个字节是 SFNT
      // 版本信息。
      // 规范：https://docs.microsoft.com/en-us/typography/opentype/spec/otff#organization-of-an-opentype-font
      await sfnt.slice(0, 4).arrayBuffer(),
    );

    let outlineFormat = 'UNKNOWN';
    switch (sfntVersion) {
      case '\x00\x01\x00\x00':
      case 'true':
      case 'typ1':
        outlineFormat = 'truetype';
        break;
      case 'OTTO':
        outlineFormat = 'cff';
        break;
    }
    console.log('Outline format:', outlineFormat);
  }
} catch (err) {
  console.error(err.name, err.message);
}
```

## 演示

您可以在下面的[演示](https://local-font-access.glitch.me/demo/)中看到本地字体访问 API 的运行情况。务必还要检查[源代码](https://glitch.com/edit/#!/local-font-access?path=README.md%3A1%3A0)。该演示展示了一个名为 [`<font-select>`](https://github.com/tomayac/font-select) 的自定义元素，它实现了一个本地字体选择器。

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/local-font-access?path=index.html&amp;previewSize=100" title="local-font-access on Glitch" allow="local-fonts" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## 隐私考虑

`"local-fonts"` 权限似乎提供了一个高度可指纹化的表面。然而，浏览器可以自由地返回它们喜欢的任何东西。例如，注重匿名的浏览器可能会选择仅提供浏览器内置的一组默认字体。同样，浏览器不需要完全按照磁盘上显示的方式提供表数据。

在可能的情况下，本地字体访问 API 旨在仅公开启用上述用例所需的确切信息。系统 API 可能不会以随机或排序的顺序生成已安装字体的列表，而是以字体安装的顺序。准确返回由此类系统 API 给出的已安装字体列表会公开可用于指纹识别的其他数据，我们想要启用的用例不会因为保留这个顺序而得到帮助。因此，该 API 要求返回的数据在返回之前进行排序。

## 安全和权限

Chrome 团队已使用[控制对强大 Web 平台功能的访问](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md)中定义的核心原则设计并实现了本地字体访问 API，包括用户控制、透明度和人体工程学。

### 用户控制

对用户字体的访问完全在他们的控制之下，除非获得了[权限注册表](https://w3c.github.io/permissions/#permission-registry)中列出的 `"local-fonts"` 权限，否则不允许访问。

### 透明度

[站点信息表](https://support.google.com/chrome/answer/114662?hl=en&co=GENIE.Platform=Desktop)中将显示站点是否已获得访问用户本地字体的权限。

### 权限持久化

`"local-fonts"` 权限将在页面重新加载之间保持不变。该权限可以通过*站点信息*表进行撤销。

## 反馈 {: #feedback }

Chrome 团队希望了解您对本地字体访问 API 的体验。

### 告诉我们您对 API 设计的看法

API 是否存在无法按预期工作的情况？或者是否缺少实现您的想法所需的属性？请在 [performance.measureUserAgentSpecificMemory() GitHub 存储库](https://github.com/WICG/local-font-access/issues)上提交规范问题，或将您的想法添加到现有问题中。

### 报告实现问题

您是否发现了 Chrome 实现的错误？或者实现与规范之间的不同？请在 [new.crbug.com](https://new.crbug.com)上提交错误。请尽可能详尽，对重现进行简单的说明，并在**组件**框中输入 `Blink>Storage>FontAccess`。[Glitch](https://glitch.com/) 非常适合共享快速简单的重现。

### 表示对该 API 的支持

您是否打算使用本地字体访问 API？您的公开支持有助于 Chrome 团队确定功能的优先级，并向其他浏览器供应商展示支持这些功能的重要性。

请使用标签 [`#LocalFontAccess`](https://twitter.com/search?q=%23LocalFontAccess&src=typed_query&f=live) 向 @ChromiumDev 发送推文，让我们知道您在哪里以及如何使用它。

## 实用链接

- [解释器](https://github.com/WICG/local-font-access)
- [规范草案](https://wicg.github.io/local-font-access/)
- [字体枚举的 Chromium 错误](https://bugs.chromium.org/p/chromium/issues/detail?id=535764)
- [字体表访问的 Chromium 错误](https://crbug.com/982054)
- [ChromeStatus 条目](https://chromestatus.com/feature/6234451761692672)
- [GitHub 存储库](https://github.com/WICG/local-font-access/issues)
- [标签审查](https://github.com/w3ctag/design-reviews/issues/399)
- [Mozilla 标准立场](https://github.com/mozilla/standards-positions/issues/401)
- 初始试用

## 鸣谢

本地字体访问 API 规范由 [Emil A. Eklund](https://www.linkedin.com/in/emilaeklund/)、[Alex Russell](https://infrequently.org/)、[Joshua Bell](https://www.linkedin.com/in/joshuaseanbell/) 和 [Olivier Yiptong](https://github.com/oyiptong/) 编辑。本文由 [Joe Medley](https://github.com/jpmedley)、[Dominik Röttsches](https://fi.linkedin.com/in/dominik-r%C3%B6ttsches-7323684) 和 [Olivier Yiptong](https://github.com/oyiptong/) 审阅。主图作者：[Brett Jordan](https://unsplash.com/@brett_jordan) 来源：[Unsplash](https://unsplash.com/photos/qrjvkj-oS-M)。
