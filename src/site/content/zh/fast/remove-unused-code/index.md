---
layout: post
title: 删除未使用的代码
subhead: 通过 npm 可以轻而易举地向项目添加代码。但是这些额外的字节真的都能用到吗？
authors:
  - houssein
date: 2018-11-05
description: 像 npm 这样的仓库使 JavaScript 世界变得更美好，它们允许任何人轻松下载和使用超过 50 万个公开的软件包。但是我们经常会包含我们没有充分利用的库。要解决这个问题，请分析您的代码包以检测未使用的代码。
codelabs:
  - codelab-remove-unused-code
tags:
  - performance
---

像 [npm](https://docs.npmjs.com/getting-started/what-is-npm) 这样的仓库使 JavaScript 世界变得更美好，它们允许任何人轻松下载和使用超过 *50 万*个公开的软件包。但是我们经常会包含我们没有充分利用的库。要解决这个问题，请**分析您的代码包**以检测未使用的代码，然后删除**未使用**和**不需要**的库。

## 分析代码包

通过 DevTools 可以轻松查看所有网络请求的大小：{% Instruction 'devtools-network', 'ol' %} {% Instruction 'disable-cache', 'ol' %} {% Instruction 'reload-page', 'ol' %}

{% Img src="image/admin/aq6QZj5p4KTuaWnUJnLC.png", alt="包含代码包请求的网络面板", width="800", height="169" %}

DevTools 中的 [Coverage](https://developer.chrome.com/docs/devtools/coverage/)（覆盖）选项卡还会告诉您应用程序中有多少 CSS 和 JS 代码未使用。

{% Img src="image/admin/xlPdOMaeykJhYqGcaMJr.png", alt="DevTools 中的代码覆盖", width="800", height="562" %}

通过 Node CLI 指定完整的 Lighthouse 配置后，还可以使用“未使用的 JavaScript”审计来追踪您的应用程序附带了多少未使用的代码。

{% Img src="image/admin/tdC0d65gEIiHZy6eyo82.png", alt="Lighthouse 未使用的 JS 审计", width="800", height="347" %}

如果您恰巧使用 [webpack](https://webpack.js.org/) 作为打包器，[Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 将帮助您调查代码包的组成。像包含任何其他插件一样，将该插件包含在 webpack 配置文件中：

```js/4
module.exports = {
  //...
  plugins: [
    //...
    new BundleAnalyzerPlugin()
  ]
}
```

虽然 webpack 通常用于构建单页应用程序，但其他打包器（例如 [Parcel](https://parceljs.org/) 和 [Rollup](https://rollupjs.org/guide/en)）也具有可视化工具，可用于分析代码包。

重新加载包含了此插件的应用程序，将显示整个代码包的可缩放树状图。

{% Img src="image/admin/pLAHEtl5C011wTk2IJij.png", alt="Webpack Bundle Analyzer", width="800", height="468" %}

使用此可视化，您可以检查代码包的哪些部分比其他部分大，并更好地了解正在导入的所有库。这有助于确定是否正在使用任何未使用或不必要的库。

## 删除未使用的库

在之前的树状图中，单个 `@firebase` 域中有许多软件包。如果您的网站只需要 firebase 数据库组件，请更新导入以获取该库：

```js/1-2/0
import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/database';
```

需要强调的是，对于较大的应用程序，此过程要复杂得多。

对于看上去很神秘，并且您非常确定没有在任何地方使用的软件包，请退后一步，看看哪个顶级依赖项正在使用它。尝试找到一种方法仅导入您需要的组件。如果某个库用不到，则将其删除。如果初始页面加载不需要库，请考虑是否可以[延迟加载](/reduce-javascript-payloads-with-code-splitting)。

如果您正在使用 webpack，请查看[自动从流行库中删除未使用代码的插件列表](https://github.com/GoogleChromeLabs/webpack-libs-optimizations)。

{% Aside 'codelab' %} [删除未使用的代码。](/codelab-remove-unused-code) {% endAside %}

## 删除不需要的库

并非所有库都可以轻松分解为多个部分并有选择地导入。在这些情况下，请考虑是否可以完全删除库。构建自定义解决方案或利用更轻量级的替代方案应该总是值得考虑的选项。但是，在从应用程序中完全删除库之前，权衡上述两种方案的复杂程度和工作量是很重要的。
