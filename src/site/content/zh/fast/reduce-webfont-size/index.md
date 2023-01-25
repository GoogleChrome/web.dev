---
layout: post
title: 减小 WebFont 大小
authors:
  - ilyagrigorik
date: 2019-08-16
updated: 2020-07-03
description: |2-

  本文阐述如何减小您在站点上使用的  WebFont 大小，使版式美观而且不降低站点速度。
tags:
  - performance
  - fonts
---

版式是良好设计、品牌塑造、可读性和可访问性的基础。WebFont 可实现上述全部功能以及更多功能：文本可选择、可搜索、可缩放且有利于实现高 DPI，无论屏幕大小和分辨率如何，都能提供一致且清晰的文本呈现。WebFont 对于良好的设计、UX 和性能至关重要。

WebFont 优化是整体性能策略的关键部分。每个字体都是一个额外的资源，有些字体可能会阻止文本的呈现，但是仅仅使用 WebFont 并不意味着页面一定呈现得更慢。相反，优化的字体，加上如何在页面上加载和应用这些字体的明智策略，可以帮助减少总页面大小并缩短页面呈现时间。

## WebFont 剖析

*WebFont* 是字形的集合，每个字形都是描述字母或符号的矢量形状。因此，两个简单的变体决定了特定字体文件的大小：每个字形矢量路径的复杂性和特定字体中的字形数量。例如，最受欢迎的 WebFont 之一 Open Sans 包含 897 个字形，其中包括拉丁文、希腊文和西里尔文字符。

{% Img src="image/admin/B92rhiBJD9sx88a5CvVy.png", alt="字体字形表", width="800", height="309" %}

选取字体时，考虑哪些字符集受支持很重要。如果您需要将页面内容本地化为多种语言，应使用一种可以为用户提供一致外观和体验的字体。例如，[Google 的 Noto 字体系列](https://www.google.com/get/noto/)旨在支持世界上的所有语言。但请注意，Noto 的总大小（包括所有语言）会生成 1.1GB 以上的 ZIP 下载内容。

在本文中，您将了解如何减小已交付的 WebFont 文件大小。

### WebFont 格式

如今，Web 上使用四种字体容器格式：

- [EOT](https://en.wikipedia.org/wiki/Embedded_OpenType)
- [TTF](https://en.wikipedia.org/wiki/TrueType)
- [WOFF](https://en.wikipedia.org/wiki/Web_Open_Font_Format)
- [WOFF2](https://www.w3.org/TR/WOFF2/)。

[WOFF](http://caniuse.com/#feat=woff) 和 [WOFF 2.0](http://caniuse.com/#feat=woff2) 受支持程度最广泛，但是为了与旧浏览器兼容，您可能需要包含其他格式：

- 将 WOFF 2.0 变体提供给支持它的浏览器。
- 将 WOFF 变体提供给大多数浏览器。
- 将 TTF 变体提供给旧的 Android（低于 4.4）浏览器。
- 将 EOT 变体提供给旧的 IE（低于 IE9）浏览器。

{% Aside %} 技术上还有另一种容器格式，即 [SVG 字体容器](http://caniuse.com/svg-fonts)，但 IE 和 Firefox 从未支持过它，Chrome 现在也已将其弃用。因此，它的用途有限，本指南已有意将其省略。{% endAside %}

### 通过压缩减小字体大小

字体是字形的集合，每个字形都是描述字母形式的一组路径。各个字形不同，但它们包含许多类似的信息，这些信息可以使用 GZIP 或兼容的压缩器进行压缩：

- 默认情况下不压缩 EOT 和 TTF 格式。确保您的服务器配置为在传送这些格式时应用 [GZIP 压缩](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer#text-compression-with-gzip)。
- WOFF 具有内置压缩功能。确保您的 WOFF 压缩器使用最佳压缩设置。
- WOFF2 使用自定义的预处理和压缩算法，与其他格式相比，传送的文件大小减少了约 30%。有关更多信息，请参阅 [WOFF 2.0 评估报告](http://www.w3.org/TR/WOFF20ER/)。

最后，值得注意的是，某些字体格式包含额外的元数据，例如某些平台上可能不需要的[字体提示](https://en.wikipedia.org/wiki/Font_hinting)和[字距调整](https://en.wikipedia.org/wiki/Kerning)信息，这允许进一步优化文件大小。请查看您的字体压缩器以获取可用的优化选项，如果您采用这种方式，请确保您拥有合适的基础架构来测试这些优化的字体并将其传送到每个浏览器。例如，[Google Fonts](https://fonts.google.com/) 为每种字体维护 30 多种优化变体，并自动检测和传送适用于每个平台及浏览器的最佳变体。

{% Aside %} 考虑对 EOT、TTF 和 WOFF 格式使用 [Zopfli 压缩](http://en.wikipedia.org/wiki/Zopfli)。Zopfli 是一种与 zlib 兼容的压缩器，与 gzip 相比，传送的文件大小减少了约 5%。{% endAside %}

## 使用 @font-face 定义字体系列

`@font-face` CSS @ 规则允许您定义特定字体资源的位置、其样式特征以及应该使用它的 Unicode 代码点。此类 `@font-face` 声明的组合可用于构建“字体系列”，浏览器将使用该系列来评估需要下载的字体资源并将其应用于当前页面。

### 考虑可变字体

在需要多种字体变体的情况下，可变字体可以显著减少字体的文件大小。您可以加载包含所有信息的单个文件，而不需要加载常规和粗体样式及其斜体版本。

所有现代浏览器现在都支持可变字体，有关更多信息，请参阅 [Web 上的可变字体简介](/variable-fonts/)。

### 选择正确的格式

每个 `@font-face` 声明都提供字体系列的名称，该名称充当多个声明、[字体属性](http://www.w3.org/TR/css3-fonts/#font-prop-desc)（例如样式、粗细和拉伸）和 [src 描述符](http://www.w3.org/TR/css3-fonts/#src-desc)（指定字体资源位置的优先级列表）的逻辑组。

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome.woff2') format('woff2'),
        url('/fonts/awesome.woff') format('woff'),
        url('/fonts/awesome.ttf') format('truetype'),
        url('/fonts/awesome.eot') format('embedded-opentype');
}

@font-face {
  font-family: 'Awesome Font';
  font-style: italic;
  font-weight: 400;
  src: local('Awesome Font Italic'),
        url('/fonts/awesome-i.woff2') format('woff2'),
        url('/fonts/awesome-i.woff') format('woff'),
        url('/fonts/awesome-i.ttf') format('truetype'),
        url('/fonts/awesome-i.eot') format('embedded-opentype');
}
```

首先，请注意上面的示例定义了具有两种样式（ normal 和 *italic**）的单个 Awesome Font* 系列，每个样式都指向一组不同的字体资源。反过来，每个 `src` 描述符都包含一个以逗号分隔的资源变体的优先级列表：

- `local()` 指令允许您引用、加载和使用本地安装的字体。
- `url()` 指令允许您加载外部字体，并允许包含可选的 `format()` 提示，以指示提供的 URL 所引用的字体格式。

{% Aside %} 除非您引用默认系统字体之一，否则用户很少会在本地安装它，尤其是在移动设备上，实际上不可能“安装”其他字体。您应该始终以 `local()` 条目“以防万一”开头，然后提供 `url()` 条目的列表。{% endAside %}

当浏览器确定需要该字体时，它会按照指定的顺序遍历提供的资源列表并尝试加载适当的资源。例如，按照上面的例子：

1. 浏览器执行页面布局，并确定在页面上呈现指定文本所需的字体变体。
2. 对于每种需要的字体，浏览器会检查本地是否提供该字体。
3. 如果本地未提供该字体，浏览器将循环访问外部定义：
    - 如果存在格式提示，则浏览器会在启动下载之前检查它是否支持该提示。如果浏览器不支持该提示，则会前进到下一提示。
    - 如果没有格式提示，浏览器则会下载资源。

本地和外部指令与适当的格式提示结合使用，您可以指定所有可用的字体格式，浏览器则会处理其余事项。浏览器确定需要哪些资源并选择最佳格式。

{% Aside %} 指定字体变体的顺序很重要。浏览器选取它支持的第一种格式。因此，如果您希望较新的浏览器使用 WOFF 2.0，则应将 WOFF 2.0 声明置于 WOFF 之上。{% endAside %}

### Unicode 范围子集化

除了样式、粗细和拉伸等字体属性外，`@font-face` 规则还允许您定义每个资源支持的一组 Unicode 代码点。这使您能够将大型 Unicode 字体拆分成较小的子集（例如，拉丁文、西里尔文和希腊文子集），并且仅下载在特定页面上呈现文本所需的字形。

[unicode 范围描述符](http://www.w3.org/TR/css3-fonts/#descdef-unicode-range)允许您指定范围值的逗号分隔列表，每个范围值都可以采用以下三种不同形式之一：

- 单个代码点（例如，`U+416`）
- 区间范围（例如，`U+400-4ff`）：表示范围的开始和结束代码点
- 通配符范围（例如，`U+4??`)：`?` 字符表示任何十六进制数字

例如，您可以将 *Awesome Font* 系列拆分为拉丁文和日语子集，浏览器会根据需要下载每个子集：

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-l.woff2') format('woff2'),
        url('/fonts/awesome-l.woff') format('woff'),
        url('/fonts/awesome-l.ttf') format('truetype'),
        url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* 拉丁文字形 */
}

@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-jp.woff2') format('woff2'),
        url('/fonts/awesome-jp.woff') format('woff'),
        url('/fonts/awesome-jp.ttf') format('truetype'),
        url('/fonts/awesome-jp.eot') format('embedded-opentype');
  unicode-range: U+3000-9FFF, U+ff??; /* 日语字形 */
}
```

{% Aside %} Unicode 范围子集化对亚洲语言尤其重要，其中字形的数量比西方语言多得多，典型的“完整”字体通常以兆字节而非万字节为单位。{% endAside %}

使用 Unicode 范围子集和字体的每个风格变体的单独文件，您可以定义一个复合字体系列，该系列下载速度更快且效率更高。访问者只下载他们需要的变体和子集，他们不会被迫下载可能永远不会在页面上看到或使用的子集。

大多数浏览器[现在都支持 unicode 范围](http://caniuse.com/#feat=font-unicode-range)。为了与旧浏览器兼容，您可能需要退回到“手动子集化”。在这种情况下，您必须回退以提供包含所有必要子集的单个字体资源，并对浏览器隐藏其余部分。例如，如果页面仅使用拉丁字符，那么您可以去除其他字形并将该特定子集作为独立资源提供。

1. **确定需要哪些子集：**
    - 如果浏览器支持 unicode 范围子集化，那么它会自动选择正确的子集。页面只需要提供子集文件并在 `@font-face` 规则中指定适当的 unicode 范围。
    - 如果浏览器不支持 unicode 范围子集化，那么页面需要隐藏所有不需要的子集；也就是说，开发人员必须指定所需的子集。
2. **生成字体子集：**
    - 使用开源 [pyftsubset 工具](https://github.com/behdad/fonttools/)对字体进行子集化和优化。
    - 某些字体服务允许通过自定义查询参数手动进行子集化，您可以使用这些参数手动指定页面所需的子集。请参阅您的字体提供商的文档。

### 字体选择与合成

每个字体系列由多个样式变体（常规、粗体、斜体）和每个样式的多个粗细组成，每个样式又可能包含极其不同的字形形状 - 例如，不同的间距、大小或完全不同的形状。

{% Img src="image/admin/FNtAc2xRmx2MuUt2MADj.png", alt="字体粗细", width="697", height="127" %}

例如，上图说明了一个字体系列，该系列提供三种不同的粗细：400（常规）、700（粗体）和 900（超粗体）。浏览器会自动将所有其他中间变体（以灰色表示）对应至最接近的变体。

<blockquote>
  <p>如果对于指定的粗细不存在任何外观，则使用粗细相近的外观。通常，粗线对应线条较重的外观，而细线对应线条较浅的外观。</p>
<cite><p data-md-type="paragraph"><a href="http://www.w3.org/TR/css3-fonts/#font-matching-algorithm">CSS 字体匹配算法</a></p></cite>
</blockquote>

类似的逻辑适用于*斜体*变体。字体设计器控制它们将产生哪些变体，而您控制将在页面上使用哪些变体。因为每个变体都是单独的下载内容，所以保持变体数量较少是个不错的主意。例如，您可以为 *Awesome Font* 系列定义两个粗体变体：

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  src: local('Awesome Font'),
        url('/fonts/awesome-l.woff2') format('woff2'),
        url('/fonts/awesome-l.woff') format('woff'),
        url('/fonts/awesome-l.ttf') format('truetype'),
        url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* 拉丁文字形 */
}

@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 700;
  src: local('Awesome Font'),
        url('/fonts/awesome-l-700.woff2') format('woff2'),
        url('/fonts/awesome-l-700.woff') format('woff'),
        url('/fonts/awesome-l-700.ttf') format('truetype'),
        url('/fonts/awesome-l-700.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* 拉丁文字形 */
}
```

上面的示例声明了 *Awesome Font* 系列，它由两个资源组成，这些资源涵盖同一组拉丁文字形 ( `U+000-5FF` )，但提供两种不同的“粗细”：正常 (400) 和粗体 (700)。但是，如果您的 CSS 规则之一指定了不同的字体粗细，或将 font-style 属性设置为斜体，会发生什么情况？

- 如果精确的字体匹配不可用，浏览器将替换最接近的匹配。
- 如果没有找到样式匹配（例如，在上面的示例中未声明斜体变体），那么浏览器会合成它自己的字体变体。

{% Img src="image/admin/a8Jo2cIO1tPsj71AzftS.png", alt="字体合成", width="800", height="356" %}

{% Aside 'warning' %} 请注意，合成方法可能不适合像西里尔文这样的脚本，该语言的斜体形式极其不同。为使这些脚本的保真度合适，请使用实际斜体字体。{% endAside %}

上面的示例说明了 Open Sans 的实际和合成字体结果之间的差异。所有合成的变体都是从单个 400 粗细的字体生成的。如您所见，结果存在显著差异。如何生成粗体和倾斜变体的细节并未指定。因此，结果因浏览器而异，并且高度依赖于字体。

{% Aside %} 为了获得最佳的一致性和视觉效果，请勿依赖字体合成。相反，尽量减少所用字体变体的数量并指定其位置，以便浏览器在页面上使用它们时即会进行下载。或者，选择使用可变字体。也就是说，在某些情况下，合成变体[可能是一个可行的选项](https://www.igvita.com/2014/09/16/optimizing-webfont-selection-and-synthesis/)，但在使用合成变体时需谨慎。{% endAside %}

## WebFont 大小优化清单

- **审核并监控您的字体使用：**不要在您的页面上使用过多字体，对于每种字体，尽量减少所用变体的数量。这有助于为您的用户提供更一致且更快速的体验。
- **子集化您的字体资源：**许多字体可以是子集，或拆分为多个 unicode 范围以仅提供特定页面所需的字形。这可减小文件大小并提高资源的下载速度。但是，在定义子集时，请注意进行优化以便重用字体。例如，请勿在每个页面上下载不同但重叠的字符集。好的做法是基于脚本进行子集化：例如，拉丁文和西里尔文。
- **为每个浏览器提供优化的字体格式：**以 WOFF 2.0、WOFF、EOT 和 TTF 格式提供每种字体。确保将 GZIP 压缩应用于 EOT 和 TTF 格式，因为默认情况下它们不会被压缩。
- **`src` 列表中优先考虑 `local()`：**在 `src` 列表中首先列出 `local('Font Name')` 可确保不会对已安装的字体进行 HTTP 请求。
- **使用 [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)** 测试[文本压缩](https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression/)。
