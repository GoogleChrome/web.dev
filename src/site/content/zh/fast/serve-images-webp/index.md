---
layout: post
title: 使用 WebP 图像
authors:
  - katiehempenius
description: WebP 图像比对应的 JPEG 和 PNG 图像要小——文件大小通常减小 25–35%。这可以减小页面大小并提高性能。
date: 2018-11-05
updated: 2020-04-06
codelabs:
  - codelab-serve-images-webp
tags:
  - performance
feedback:
  - api
---

## 为什么应关注？

WebP 图像比对应的 JPEG 和 PNG 图像要小——文件大小通常减小 25–35%。这可以减小页面大小并提高性能。

- YouTube 发现，切换到 WebP 缩略图可以使[页面加载速度提高 10%](https://www.youtube.com/watch?v=rqXMwLbYEE4)。
- Facebook 的[经验](https://code.fb.com/android/improving-facebook-on-android/)是，在转为使用 WebP 后，文件大小比 JPEG 小 25-35%，比 PNG 小 80%。

WebP 是 JPEG、PNG 和 GIF 图像的绝佳替代者。此外，WebP 提供无损和有损压缩。无损压缩不会丢失任何数据。有损压缩可减小文件大小，但代价是可能降低图像质量。

## 将图像转换为 WebP

人们通常使用以下方法之一将图像转换为 WebP：[cwebp 命令行工具](https://developers.google.com/speed/webp/docs/using)或 [Imagemin WebP 插件](https://github.com/imagemin/imagemin-webp)（npm 包）。如果您的项目使用构建脚本或构建工具（例如 Webpack 或 Gulp），Imagemin WebP 插件通常是最佳选择，而对于简单项目或者只需要转换一次图像时，CLI 是不错的选择。

将图像转换为 WebP 时，可以设定各种压缩设置——但对于大多数人来说，唯一需要关心的是质量设置。您可以指定从 0（最差）到 100（最好）的质量级别。这需要反复尝试，才能找到哪个级别可以在所需的图像质量和文件大小之间取得适当平衡。

### 使用 cwebp

使用 cwebp 的默认压缩设置转换单个文件：

```bash
cwebp images/flower.jpg -o images/flower.webp
```

使用质量级别 `50` 转换单个文件：

```bash
cwebp -q 50 images/flower.jpg -o images/flower.webp
```

转换一个目录中的所有文件：

```bash
for file in images/*; do cwebp "$file" -o "${file%.*}.webp"; done
```

### 使用 Imagemin

Imagemin WebP 插件可以单独使用，也可以与您喜欢的构建工具（Webpack/Gulp/Grunt 等）一起使用。这通常需要向构建脚本或构建工具的配置文件添加约 10 行代码。以下是如何针对 [Webpack](https://glitch.com/~webp-webpack) 、[Gulp](https://glitch.com/~webp-gulp) 和 [Grunt](https://glitch.com/~webp-grunt) 执行该操作的示例。

如果您不使用这些构建工具，可以将 Imagemin 本身用作一个 Node 脚本。该脚本将转换 `images` 目录中的文件并将转换后的文件保存在 `compressed_images` 目录中。

```js
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

imagemin(['images/*'], {
  destination: 'compressed_images',
  plugins: [imageminWebp({quality: 50})]
}).then(() => {
  console.log('Done!');
});
```

## 提供 WebP 图像

如果您的网站仅支持兼容 WebP 的[浏览器](https://caniuse.com/#search=webp)，那么您不用再往下看了。否则，为较新的浏览器提供 WebP，为旧浏览器提供后备图像：

**之前：**

```html
<img src="flower.jpg" alt="">
```

**之后：**

```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

[`<picture>`](https://developer.mozilla.org/docs/Web/HTML/Element/picture)、[`<source>`](https://developer.mozilla.org/docs/Web/HTML/Element/source) 和 `<img>` 标签，包括它们相对于彼此的排序方式，都相互作用以实现这一最终结果。

### picture

`<picture>` 标签为零个或多个 `<source>` 标签和一个 `<img>` 标签提供包装器。

### source

`<source>` 标签指定媒体资源。

浏览器会使用列出的第一个采用它支持的格式的源。如果浏览器不支持 `<source>` 标签中列出的任何格式，它会回退加载 `<img>` 标签指定的图像。

{% Aside 'gotchas' %}

- “首选”图像格式（在本例中为 WebP）的 `<source>` 标签应最先列出，排在其他 `<source>` 标签之前。

- `type` 属性的值应该是与图像格式对应的 MIME 类型。图像的 [MIME 类型](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)及其文件扩展名通常相似，但不一定相同（例如 `.jpg` 与 `image/jpeg`）。

{% endAside %}

### img

`<img>` 标签使该代码在不支持 `<picture>` 标签的浏览器上也能工作。如果浏览器不支持 `<picture>` 标签，它将忽略它不支持的标签。因此，它只会“看到”`<img src="flower.jpg" alt="">` 标签并加载该图像。

{% Aside 'gotchas' %}

- 始终应该包括 `<img>` 标签，并且始终将其列在最后，即所有 `<source>` 标签之后。
- `<img>` 标签指定的资源应该采用普遍支持的格式（例如 JPEG），因此它可以用作后备。{% endAside %}

## 验证 WebP 的使用

Lighthouse 可用于验证网站上的所有图像是否都以 WebP 格式提供。运行 Lighthouse 性能审计（**Lighthouse &gt; Options（选项）&gt; Performance（性能）**），并查找 **Serve images in next-gen formats**（提供下一代格式的图像）审计的结果。Lighthouse 将列出所有未以 WebP 格式提供的图像。
