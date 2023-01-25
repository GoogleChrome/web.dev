---
layout: post
title: 提供响应式图像
authors:
  - katiehempenius
description: |2-

  向移动设备提供桌面尺寸的图像可导致数据量比实际需求高出 2-4 倍。应取代这种“一刀切”的方法，转而为不同的设备提供不同的图像。
date: 2018-11-05
updated: 2021-06-04
codelabs:
  - codelab-specifying-multiple-slot-widths
  - codelab-art-direction
  - codelab-density-descriptors
tags:
  - performance
---

向移动设备提供桌面尺寸的图像可导致数据量比实际需求高出 2-4 倍。应取代这种“一刀切”的方法，转而为不同的设备提供不同的图像。

## 调整图像大小

最流行的两个图像调整工具是 [sharp npm package](https://www.npmjs.com/package/sharp) 和 [ImageMagick CLI 工具](https://www.imagemagick.org/script/index.php)。

Sharp package 非常适合用于自动调整图像大小（例如，为您网站上的所有视频生成多种尺寸的缩略图），它可以与构建脚本和工具轻松快速地实现集成。而 ImageMagick 则便于一次性调整图像大小，因为它完全从命令行使用。

### sharp

要将 Sharp 用作 Node 脚本，请将此代码另存为项目中的单独脚本，然后运行它以转换图像：

```javascript
const sharp = require('sharp');
const fs = require('fs');
const directory = './images';

fs.readdirSync(directory).forEach(file => {
  sharp(`${directory}/${file}`)
    .resize(200, 100) // width, height
    .toFile(`${directory}/${file}-small.jpg`);
  });
```

### ImageMagick

要将某个图像的大小调整为其原始大小的 33%，请在终端中运行以下命令：

```bash
convert -resize 33% flower.jpg flower-small.jpg
```

要将某个图像的大小调整为 300 像素（宽） x 200 像素（高），请运行以下命令：

```bash
# macOS/Linux
convert flower.jpg -resize 300x200 flower-small.jpg

# Windows
magick convert flower.jpg -resize 300x200 flower-small.jpg
```

### 您应该创建多少个图像版本？

这个问题没有确切的“正确”答案。但是，提供 3-5 种不同大小的图像很常见。提供更多的图像尺寸对性能更好，但会占用服务器上更多的空间，并且需要编写更多的 HTML。

### 其他选项

[Thumbor](https://github.com/thumbor/thumbor)（开源）和 [Cloudinary](https://cloudinary.com/) 等图像服务也值得一试。图像服务按需提供响应式图像（和图像处理）。Thumbor 需要安装在服务器上进行设置；Cloudinary 则会为您处理这些，无需服务器设置。两者都是创建响应式图像的简单方法。

## 提供多个图像版本

指定多个图像版本，浏览器将选择最好的一个来使用：

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th><strong>之前</strong></th>
        <th><strong>后</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          &lt;img src="flower-large.jpg"&gt;
        </td>
        <td>
          &lt;img src="flower-large.jpg" srcset="flower-small.jpg 480w,
          flower-large.jpg 1080w" sizes="50vw"&gt;
        </td>
      </tr>
    </tbody>
  </table>
</div>

`<img>` 标签的 [`src`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-src)、[`srcset`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-srcset) 和 [`sizes`](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-sizes) 属性都相互作用来实现这一最终结果。

### “src”属性

src 属性使得此代码向[不支持](https://caniuse.com/#search=srcset)`srcset` 和 `sizes` 属性的浏览器提供帮助。如果浏览器不支持这些属性，其会回退到加载 `src` 属性指定的资源。

{% Aside 'gotchas' %} `src` 属性指定的资源应该足够大，以适用于所有设备尺寸。 {% endAside %}

### “srcset”属性

`srcset` 属性是以逗号分隔的图像文件名及其宽度或密度描述符的列表。

此示例使用[宽度描述符](https://www.w3.org/TR/html5/semantics-embedded-content.html#width-descriptor)。`480w` 是一个宽度描述符，告诉浏览器 `flower-small.jpg` 是 480 像素宽；`1080w` 是一个宽度描述符，告诉浏览器 `flower-large.jpg` 是 1080 像素宽。

“宽度描述符”听起来很花哨，但其实只是告诉浏览器图像宽度的一种方式。这使浏览器无需下载图像以确定其大小。

{% Aside 'gotchas' %} 使用 `w` 作为单位（而非 `px` ）来书写宽度描述符。例如，一个宽为 1024 像素的图像将被写为 `1024w` 。 {% endAside %}

**额外的学分：**您无需为了提供不同的图像尺寸而了解密度描述符。但是，如果您对密度描述符的工作原理感到好奇，请查看[分辨率切换代码实验室](/codelab-density-descriptors)。密度描述符用于根据设备的[像素密度](https://en.wikipedia.org/wiki/Pixel_density)提供不同的图像。

### “尺寸”属性

尺寸属性告诉浏览器图像显示时的宽度。但是，尺寸属性对显示大小没有影响；您仍然需要 CSS。

浏览器使用此信息以及它对用户设备的了解（即设备的尺寸和像素密度）来确定要加载的图像。

如果浏览器无法识别“ `sizes` ”属性，它将退回到加载“ `src` ”属性指定的图像。（浏览器初始均设置为同时支持“ `sizes` ”和“ `srcset` ”属性，因此一个浏览器要么支持这两个属性，要么都不支持。）

{% Aside 'gotchas' %} 可以使用多种单位指定槽宽。以下是所有有效尺寸：

- `100px`
- `33vw`
- `20em`
- `calc(50vw-10px)`

以下不是有效尺寸：

- `25%` （百分比不能与尺寸属性一起使用）{% endAside %}

**额外的学分：**如果您想要花哨，还可以使用尺寸属性来指定多个插槽大小。这适用于对不同视口大小使用不同布局的网站。请参阅此[多槽代码示例](/codelab-specifying-multiple-slot-widths)以了解如何执行此操作。

### （甚至更多）额外的学分

除了已经列出的所有额外学分（图像很复杂！），您还可以将这些相同的概念用于[艺术指导](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction)。艺术指导是将外观完全不同的图像（而不是同一图像的不同版本）提供给不同视口的做法。您可以在[艺术指导代码实验室](/codelab-art-direction)了解更多信息。

## 验证

实现响应式图像后，您可以使用 Lighthouse 来确保不会遗漏任何图像。运行 Lighthouse 性能审核（ **Lighthouse &gt; 选项 &gt; 性能** ）并查找**适当大小的图像**审核的结果。这些结果将列出需要调整大小的图像。
