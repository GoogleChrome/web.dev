---
layout: post
title: 在 Next.js 中使用动态导入进行代码拆分
authors:
  - mihajlija
subhead: 如何通过代码拆分和智能加载策略加速 Next.js 应用。
date: 2019-11-08
feedback:
  - api
---

## 您将学到什么？

本文讲述不同类型的[代码拆分](/reduce-javascript-payloads-with-code-splitting/)以及如何使用动态导入加速 Next.js 应用。

## 基于路由和基于组件的代码拆分

默认情况下，Next.js 将您的 JavaScript 拆分为每个路由的单独块。当用户加载您的应用程序时，Next.js 仅发送初始路由所需的代码。当用户浏览应用程序时，他们获取与其他路由关联的块。基于路由的代码拆分最大限度地减少了需要一次解析和编译的脚本数量，从而加快了页面加载时间。

虽然基于路由的代码拆分是一个很好的默认设置，但您可以通过组件级别的代码拆分进一步优化加载过程。如果您的应用含有大型组件，最好将它们分成单独的块。这样，任何不重要或仅在某些用户交互（例如点击按钮）时呈现的大型组件都可以延迟加载。

Next.js 支持[动态 `import()`](https://v8.dev/features/dynamic-import) ，它允许您动态导入 JavaScript 模块（包括 React 组件）并将每个导入作为单独的块加载。这为您提供了组件级代码拆分并使您能够控制资源加载，以便用户只下载他们正在查看的站点部分所需的代码。在 Next.js 中，这些组件默认是[服务器端呈现（SSR）](/rendering-on-the-web/)。

## 动态导入操作

本文使用一个示例应用的多个版本，该示例应用由含有一个按钮的简单页面组成。当您点击该按钮时，会看到一只可爱的小狗。当您浏览应用的每个版本时，会看到动态导入和[静态导入](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import)之间的不同以及如何使用它们。

在该应用的第一个版本中，小狗位于 `components/Puppy.js` 中。为了在页面上显示小狗，应用使用静态导入语句在 `index.js` 中导入 `Puppy` 组件：

```js
import Puppy from "../components/Puppy";
```

{% Glitch { id: 'static-import', path: 'index.js', previewSize: 0, height: 480 } %}

要查看 Next.js 如何捆绑该应用，请检查 DevTools 中的网络跟踪：

{% Instruction 'preview', 'ol' %}

{% Instruction 'devtools-network', 'ol' %}

{% Instruction 'disable-cache', 'ol' %}

{% Instruction 'reload-page', 'ol' %}

加载页面时，所有必要的代码，包括 `Puppy.js` 组件，都捆绑在 `index.js` 中：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6KWlTYFhoIEIGqnuMwlh.png", alt="DevTools Network 选项卡显示了六个 JavaScript 文件：index.js、app.js、webpack.js、main.js、0.js 和 dll (动态链接库) 文件。", width="800", height="665" %}</figure>

当您按下 **Click me（点击我）**按钮时，只有对 puppy JPEG 的请求会添加到 **Network（网络）**选项卡中：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7MkXVqnqfIbW74VV48kB.png", alt="点击按钮后的 DevTools Network 选项卡，显示相同的六个 JavaScript 文件和一张图片。", width="800", height="665" %}</figure>

这种方法的缺点是，即使用户不点击按钮查看小狗，他们也必须加载 `Puppy` 组件，因为它包含在 `index.js` 中。在这个小例子中，这没什么大不了的，但在实际的应用程序中，仅在必要时加载大型组件通常是一个巨大的改进。

现在我们看看该应用的第二个版本，其中静态导入替换为动态导入。Next.js 包含 `next/dynamic` ，这使得可以对 Next 中的任何组件使用动态导入：

```js/1,5/0
import Puppy from "../components/Puppy";
import dynamic from "next/dynamic";

// ...

const Puppy = dynamic(import("../components/Puppy"));
```

{% Glitch { id: 'dynamic-import-nextjs', path: 'pages/index.js:29:10', height: 480 } %}

按照第一个示例中的步骤检查网络跟踪。

首次加载该应用时，只会下载 `index.js`。这次小了 0.5 KB（从 37.9 KB 减少到 37.4 KB），因为它不包含 `Puppy` 组件的代码：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/K7Ii3bxUkb37LrZjjWT1.png", alt="DevTools Network 显示了相同的六个 JavaScript 文件，index.js 现在为 0.5 KB 小。", width="800", height="666" %}</figure>

`Puppy` 组件现在位于一个单独的块 `1.js` 中，它仅在您按下按钮时加载：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1DfVDv5poQmwXwOKmnvd.png", alt="点击按钮后的 DevTools Network 选项卡，显示附加的 1.js 文件和添加到文件列表底部的图像。", width="800", height="665" %}</figure>

{% Aside %} 默认情况下，Next.js 将这些动态块命名为*编号*.js，其中*编号*从 1 开始。{% endAside %}

在实际应用程序中，组件通常[要大得多](https://bundlephobia.com/result?p=moment@2.24.0)，延迟加载它们可以将您的初始 JavaScript 负载减少数百 KB。

## 使用自定义加载指示器进行动态导入

当您延迟加载资源时，最好提供加载指示器以防出现任何延迟。在 Next.js 中，您可以通过向 `dynamic()` 函数提供附加参数来实现：

```js
const Puppy = dynamic(() => import("../components/Puppy"), {
  loading: () => <p>Loading...</p>
});
```

{% Glitch { id: 'dynamic-import-loading', path: 'pages/index.js:7:27', height: 480 } %}

要查看正在运行的加载指示器，请在 DevTools 中模拟慢速网络连接：

{% Instruction 'preview', 'ol' %}

{% Instruction 'devtools-network', 'ol' %}

{% Instruction 'disable-cache', 'ol' %}

1. 在 **Throttling（限制）**下拉列表中，选择 **Fast 3G（快速 3G）** 。

2. 按下 **Click me（点击我）**按钮。

现在，当您点击按钮时，加载组件需要一段时间，同时应用会显示“正在加载…”消息。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tjlpmwolBVp1jh948Fln.png", alt="一块黑屏，显示\"正在加载...\"文本。", width="800", height="663" %}</figure>

## 没有 SSR 的动态导入

如果您只需要在客户端呈现组件（例如，聊天小部件），您可以通过将 `ssr` 选项设置为 `false` 来实现：

```js
const Puppy = dynamic(() => import("../components/Puppy"), {
  ssr: false,
});
```

{% Glitch { id: 'dynamic-import-no-ssr', path: 'pages/index.js:5:0', height: 480 } %}

## 结论

凭借对动态导入的支持，Next.js 为您提供组件级代码拆分，这可以最大限度地减少 JavaScript 负载并缩短应用程序加载时间。默认情况下，所有组件都在服务器端呈现，您可以在必要时禁用此选项。
