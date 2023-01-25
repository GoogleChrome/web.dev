---
layout: post
title: 缩小和压缩网络有效负载
authors:
  - houssein
date: 2018-11-05
description: 有两种实用技术可用于提高网页性能，缩小和数据压缩。结合使用这两种技术，可以减少有效负载大小，进而缩短页面加载时间。
codelabs:
  - codelab-text-compression
  - codelab-text-compression-brotli
tags:
  - performance
---

有两种实用技术可用于提高网页的性能：

- 缩小
- 数据压缩

结合使用这两种技术，可以减少有效负载大小，进而缩短页面加载时间。

## 测量

如果 Lighthouse 在您的页面上检测到任何可以缩小的 CSS 或 JS 资源，则会显示审计失败。

{% Img src="image/admin/ZT9ESeCStegt0SklYbni.png", alt="Lighthouse 缩小 CSS 审计", width="800", height="90" %}

{% Img src="image/admin/vDaAnUSvQxmGcoasQj1k.png", alt="Lighthouse 缩小 JS 审计", width="800", height="112" %}

它还会审计任何未压缩的资产。

{% Img src="image/admin/xfqzdLuu3w3lanxo5Ggc.png", alt="Lighthouse: 启用文本压缩", width="800", height="123" %}

## 缩小

**缩小**是删除空格和不需要的代码，从而创建较小但完全有效的代码文件的过程。[Terser](https://github.com/terser-js/terser) 是一种流行的 JavaScript 压缩工具，[webpack](https://webpack.js.org/) v4 默认为这个库提供一个插件，用于创建缩小的构建文件。

- 如果您使用的是 webpack v4 或更高版本，那么无需任何额外工作就可以直接使用。 👍
- 如果您使用的是旧版 webpack，请安装`TerserWebpackPlugin`，并将其包含到您的 webpack 配置设置中。请按照[文档](https://webpack.js.org/plugins/terser-webpack-plugin/)中的介绍操作。
- 如果您不使用模块捆绑程序，那么请将`Terser`用作 CLI 工具或将其直接包含为您的应用程序的依赖项。项目[文档](https://github.com/terser-js/terser)提供了相关说明。

## 数据压缩

**压缩**是使用压缩算法修改数据的过程。[Gzip](https://www.youtube.com/watch?v=whGwm0Lky2s&feature=youtu.be&t=14m11s) 是用于服务器和客户端交互的最广泛使用的压缩格式。[Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html) 是一种较新的压缩算法，可以提供比 Gzip 更好的压缩结果。

{% Aside %} 压缩文件可以显著提高网页的性能，但很少需要您亲自执行此操作。许多托管平台、CDN 和反向代理服务器默认情况下都会对资产进行压缩编码，或允许您轻松配置它们。在尝试推出您自己的解决方案之前，请阅读您正在使用工具的文档以查看是否已经支持压缩。 {% endAside %}

有两种不同的方法可以压缩发送到浏览器的文件：

- 动态压缩
- 静态压缩

这两种方法各有优缺点，下一节将介绍这些方法。请使用最适合您的应用的方法。

## 动态压缩

此过程涉及在浏览器请求时即时压缩资产。这可能比手动或使用构建过程压缩文件更简单，但如果使用高压缩级别会导致延迟。

[Express](https://expressjs.com/) 是一个流行的 Node web 框架，它提供了一个[压缩](https://github.com/expressjs/compression)中间件库。使用它来在请求时压缩任何资产。下面列出了正确使用它压缩整个服务器文件的示例：

```js/5
const express = require('express');
const compression = require('compression');

const app = express();

app.use(compression());

app.use(express.static('public'));

const listener = app.listen(process.env.PORT, function() {
	console.log('Your app is listening on port ' + listener.address().port);
});
```

上述代码会使用`gzip`压缩您的资产。如果您的 web 服务器支持它，请考虑使用一个单独的模块（如[shrink-ray](https://github.com/aickin/shrink-ray#readme)）通过 Brotli 进行压缩，以实现更好的压缩率。

{% Aside 'codelab' %} 使用 express.js 通过 [gzip](/codelab-text-compression) 和 [Brotli](/codelab-text-compression-brotli) 压缩资产。 {% endAside %}

## 静态压缩

静态压缩涉及提前压缩和保存资产。这会使构建过程花费更长的时间，尤其是在使用高压缩级别的情况下，但可确保浏览器获取压缩资源时不会出现延迟。

如果您的 web 服务器支持 Brotli，那么请使用 [BrotliWebpackPlugin](https://github.com/mynameiswhm/brotli-webpack-plugin) 等插件通过 webpack 压缩您的资产，将其纳入构建步骤。否则，请使用 [CompressionPlugin](https://github.com/webpack-contrib/compression-webpack-plugin) 通过 gzip 压缩您的资产。它可以像 webpack 配置文件中的任何其他插件一样包含在内：

```js/4
module.exports = {
	//...
	plugins: [
		//...
		new CompressionPlugin()
	]
}
```

当压缩文件成为构建文件夹的一部分后，去在服务器中创建一个路由来处理所有 JS 端点以提供压缩文件。下面的示例说明了如何使用 Node 和 Express 为使用 gzip 压缩的资产完成此操作。

<pre>const express = require('express');
const app = express();

&lt;strong&gt;app.get('*.js', (req, res, next) =&gt; {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	next();
});&lt;/strong&gt;

app.use(express.static('public'));
</pre>
