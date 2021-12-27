---
title: CommonJS 如何让您的捆绑包变得更大
subhead: 了解 CommonJS 模块如何影响应用程序的摇树
authors:
  - mgechev
date: 2020-05-08
updated: 2020-05-26
hero: image/admin/S5JWmwRRW3rEXKwJR0JA.jpg
alt: CommonJS 如何让您的捆绑包变得更大
description: CommonJS 模块的动态范围非常大，这会阻止 JavaScript 优化器和捆绑包对它们执行高级优化。
tags:
  - blog
  - javascript
  - modules
---

我们将在本文中研究什么是 CommonJS，以及它为什么会使您的 JavaScript 捆绑包变得异常大。

总结：**为确保捆绑程序能够成功优化您的应用程序，避免依赖 CommonJS 模块，并在整个应用程序中使用 ECMAScript 模块语法。**

## 什么是 CommonJS？

CommonJS 是 2009 年的标准，它为 JavaScript 模块建立了约定规范。它最初并没有打算用在 Web 浏览器上，主要用于服务器端应用程序。

使用 CommonJS，您可以定义模块，导出模块中的功能，并将它们导入到其他模块中。例如，下面的代码片段定义了一个模块，该模块导出五个函数：`add`、`subtract`、`multiply`、`divide`和`max` ：

```javascript
// utils.js
const { maxBy } = require('lodash-es');
const fns = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  max: arr => maxBy(arr)
};

Object.keys(fns).forEach(fnName => module.exports[fnName] = fns[fnName]);
```

稍后，另一个模块可以导入并使用部分或全部这些函数：

```javascript
// index.js
const { add } = require('./utils');
console.log(add(1, 2));
```

使用`node`调用`index.js`将在控制台中输出数字`3`

由于 2010 年代初期的浏览器缺乏标准化的模块系统，CommonJS 也成为 JavaScript 客户端库的流行模块格式。

## CommonJS 如何影响最终捆绑包大小？

服务器端 JavaScript 应用程序的大小并不像在浏览器中那么重要，这就是为什么 CommonJS 在设计时没有考虑减少生产包的大小。同时，[分析](https://v8.dev/blog/cost-of-javascript-2019)表明 JavaScript 捆绑包的大小仍然是导致浏览器应用程序变慢的头号原因。

JavaScript 打包器和压缩器，例如`webpack`和`terser` ，会执行不同的优化以减小应用程序的大小。它们会在构建时分析应用程序，尝试从您未使用的源代码中尽可能多地删除无用代码。

例如，在上面的代码片段中，最终捆绑包应该只包含`add`函数，因为这是您在`index.js`中导入来自`utils.js`的唯一符号。

让我们使用以下`webpack`配置构建应用程序：

```javascript
const path = require('path');
module.exports = {
  entry: 'index.js',
  output: {
    filename: 'out.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};
```

这里我们指定要使用生产模式优化并使用`index.js`作为入口点。在调用`webpack`后，如果我们探索[输出](https://github.com/mgechev/commonjs-example/blob/master/commonjs/dist/out.js)大小，将看到如下内容：

```shell
$ cd dist && ls -lah
625K Apr 13 13:04 out.js
```

请注意，**捆绑包的大小是 625KB** 。现在看看输出，我们会发现`utils.js`的所有函数以及来自[`lodash`](https://lodash.com/)的许多模块**。尽管我们没有在`index.js`中使用`lodash`，但它也成为了输出的一部分**，这为我们的生产资产增加了很多额外的大小。

现在将模块格式更改为 [ECMAScript 模块](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import)，然后再试一次。这一次，`utils.js`看起来是这样：

```javascript
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

import { maxBy } from 'lodash-es';

export const max = arr => maxBy(arr);
```

`index.js`将使用 ECMAScript 模块语法从`utils.js`导入：

```javascript
import { add } from './utils';

console.log(add(1, 2));
```

使用相同的`webpack`配置，我们可以构建应用程序并打开输出文件。**它现在的大小是 40 个字节**，[输出](https://github.com/mgechev/commonjs-example/blob/master/esm/dist/out.js)如下：

```javascript
(()=>{"use strict";console.log(1+2)})();
```

请注意，最终的捆绑包里没有`utils.js`中未使用的函数以及`lodash` ！更进一步，`terser`（即`webpack`使用的 JavaScript 压缩器）在`console.log`中内联了`add`函数。

你可能会问，**为什么使用 CommonJS 会导致输出包几乎变大了 16000 倍**？当然，这只是随便举的一个例子，实际上大小差异可能不会那么大，但 CommonJS 很可能为您的生产构建增加了显著的大小。

**CommonJS 模块在一般情况下更难优化，因为它们比 ES 模块的动态程度更高。为确保您的捆绑程序和压缩器能够成功优化应用程序，请避免依赖 CommonJS 模块，并在整个应用程序中使用 ECMAScript 模块语法。**

请注意，即便您在`index.js`中使用 ECMAScript 模块，但如果您使用的是 CommonJS 模块，那么应用程序的捆绑包大小也会受到影响。

## 为什么 CommonJS 会让应用变得更大？

要回答这个问题，我们先看看`webpack`中的`ModuleConcatenationPlugin`行为，然后讨论静态分析性。该插件将所有模块的范围连接到一个闭包中，并允许您的代码在浏览器中具有更快的执行时间。让我们看一个例子：

```javascript
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

```javascript
// index.js
import { add } from './utils';
const subtract = (a, b) => a - b;

console.log(add(1, 2));
```

在上面示例中，我们使用了一个 ECMAScript 模块，并将其导入了`index.js`。此外，我们还定义了一个`subtract`函数。我们可以使用与上述相同的`webpack`配置来构建项目，但这一次，我们将禁用最小化：

```javascript
const path = require('path');

module.exports = {
  entry: 'index.js',
  output: {
    filename: 'out.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false
  },
  mode: 'production',
};
```

让我们看看产生的输出：

```javascript
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// CONCATENATED MODULE: ./utils.js**
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

// CONCATENATED MODULE: ./index.js**
const index_subtract = (a, b) => a - b;**
console.log(add(1, 2));**

/******/ })();
```

在上面的输出中，所有函数都在同一个命名空间内。为了防止冲突，webpack 将`index.js` 中的`subtract`函数重命名为`index_subtract` 。

如果缩小器处理上面的源代码，它将：

- 删除未使用的函数`subtract`和`index_subtract`
- 删除所有注释和多余的空格
- 在`console.log`调用中内联`add`函数的正文

开发人员通常将**移除未使用的导入称为摇树**。摇树之所以成为可能，是因为 webpack 能够静态地（在构建时）了解我们从`utils.js`导入哪些符号以及它导出哪些符号。

**ES 模块**默认启用此行为，因为与 CommonJS 相比，**它们更易于静态分析。**

让我们看一个完全相同的例子，但这次将`utils.js`改为使用 CommonJS 模块，而不是 ES 模块：

```javascript
// utils.js
const { maxBy } = require('lodash-es');

const fns = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  max: arr => maxBy(arr)
};

Object.keys(fns).forEach(fnName => module.exports[fnName] = fns[fnName]);
```

这个小更新将显着改变输出。由于代码太长无法完全嵌入此页面，所以我只分享了其中的一小部分：

```javascript
...
(() => {

"use strict";
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(288);
const subtract = (a, b) => a - b;
console.log((0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .add */ .IH)(1, 2));

})();
```

请注意，最终捆绑包包含一些`webpack`“运行时”：即负责从捆绑模块导入/导出功能的注入代码。这一次，我们没有将`utils.js`和`index.js`中的所有符号都放在同一个命名空间下，而是在运行时使用`__webpack_require__`动态调用`add`函数。

这是必要的，因为使用 CommonJS 我们可以从任意表达式中获取导出名称。例如，下面的代码是一个绝对有效的构造：

```javascript
module.exports[localStorage.getItem(Math.random())] = () => { … };
```

打包程序无法在构建时知道导出符号的名称是什么，因为这需要仅在运行时才能提供的信息，在用户浏览器的上下文中。

**这样，缩小器就无法理解`index.js`到底使用了依赖项的什么内容，所以它不能将它摇树。**我们还将观察第三方模块的完全相同的行为。**如果我们从`node_modules`导入 CommonJS 模块，您的构建工具链将无法正确优化它。**

## 使用 CommonJS 进行摇树

分析 CommonJS 模块要困难得多，因为它们从定义上来说是动态的。例如，ES 模块中的导入位置始终是字符串，而 CommonJS 则是表达式。

在某些情况下，如果您使用的库遵循有关如何使用 CommonJS 的特定约定，则可以在构建时使用第三方`webpack`[插件](https://github.com/indutny/webpack-common-shake)删除未使用的导出。虽然这个插件增加了对摇树的支持，但它并没有涵盖您的依赖项可以使用 CommonJS 的所有不同方式。这意味着您无法获得与 ES 模块相同的功能保证。此外，作为构建过程的一部分，它会在默认的`webpack`行为之上增加额外的成本。

## 总结

**<strong>为确保捆绑程序能够成功优化您的应用程序，请避免依赖 CommonJS 模块，并在整个应用程序中使用 ECMAScript 模块语法。</strong>**

以下是一些可操作的提示，以验证您是否处于最佳路径上：

- 使用 Rollup.js 的 [node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) 插件并设置`modulesOnly`标志，以指定您只想依赖 ECMAScript 模块。
- 使用包[`is-esm`](https://github.com/mgechev/is-esm)来验证 npm 包是否使用 ECMAScript 模块。
- 如果您使用的是 Angular，默认情况下，如果您依赖于不可摇树的模块，则将收到警告。
