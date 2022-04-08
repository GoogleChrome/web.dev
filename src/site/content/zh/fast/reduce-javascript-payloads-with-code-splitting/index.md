---
layout: post
title: 通过代码拆分减少 JavaScript 负载
authors:
  - houssein
description: 发送大型 JavaScript 负载会显著影响您网站的速度。在加载应用程序的第一页时，无需将所有的 JavaScript 发送给您的用户，可以将您的包分成多个部分，然后只在需要时进行发送。
date: 2018-11-05
codelabs:
  - codelab-code-splitting
tags:
  - performance
---

没有人喜欢等待。**[如果网站加载时间超过 3 秒，超过 50% 的用户会放弃网站](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/research-data/need-mobile-speed-how-mobile-latency-impacts-publisher-revenue/)**。

发送大型 JavaScript 负载会显著影响您网站的速度。在加载应用程序的第一页时，无需将所有的 JavaScript 发送给您的用户，可以将您的包分成多个部分，然后只在需要时进行发送。

## 措施

当花费大量时间在页面上执行所有 JavaScript 时，Lighthouse 会显示审计失败。

{% Img src="image/admin/p0Ahh3pzXog3jPdDp6La.png", alt="Lighthouse 审计失败，显示脚本执行时间过长。", width="797", height="100"%}

拆分 JavaScript 包以仅在用户加载应用程序时发送初始路由所需的代码。这最大限度地减少了需要解析和编译的脚本数量，从而加快了页面加载时间。

流行的模块包（如 [webpack](https://webpack.js.org/guides/code-splitting/)、[Parcel](https://parceljs.org/code_splitting.html) 和 [Rollup](https://rollupjs.org/guide/en#dynamic-import)）允许您使用[动态导入](https://v8.dev/features/dynamic-import)来拆分包。例如，考虑以下的代码片段，其中显示了在提交表单时触发的 `someFunction` 方法示例。

```js
import moduleA from "library";

form.addEventListener("submit", e => {
  e.preventDefault();
  someFunction();
});

const someFunction = () => {
  // uses moduleA
}
```

在这里，`someFunction` 使用从特定库导入的模块。如果此模块没有在其他地方使用，则可以修改代码块以使用动态导入仅在用户提交表单时获取它。

```js/2-5
form.addEventListener("submit", e => {
  e.preventDefault();
  import('library.moduleA')
    .then(module => module.default) // using the default export
    .then(someFunction())
    .catch(handleError());
});

const someFunction = () => {
    // uses moduleA
}
```

构成模块的代码不会包含在初始包中，现在被**延迟加载**，或者仅在表单提交后需要时才提供给用户。为了进一步提高页面性能，请[预加载关键块以进行优先级排序并更快地获取它们](/preload-critical-assets)。

尽管前面的代码片段是一个简单的示例，但延迟加载第三方依赖项在较大的应用程序中并不是常见的模式。通常，第三方依赖项被拆分成一个单独的供应商包，可以缓存，因为它们不会经常更新。您可以阅读有关 [**SplitChunksPlugin**](https://webpack.js.org/plugins/split-chunks-plugin/) 如何帮助您做到这一点的更多信息。

使用客户端框架时在路由或组件级别拆分是一种延迟加载应用程序不同部分的更简单方法。许多使用 webpack 的流行框架提供了抽象，使延迟加载比自己深入配置更容易。
