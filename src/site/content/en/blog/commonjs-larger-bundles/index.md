---
title: How CommonJS is making your bundles larger
subhead: Learn how CommonJS modules are impacting the tree-shaking of your application
authors:
  - mgechev
date: 2020-05-08
updated: 2020-05-26
hero: image/admin/S5JWmwRRW3rEXKwJR0JA.jpg
alt: How CommonJS is making your bundles larger
description:
  CommonJS modules are very dynamic, which prevents JavaScript
  optimizers and bundles perform advanced optimizations over them.
tags:
  - blog
  - javascript
  - modules
  - commonjs
  - tree-shaking
---

In this post, we'll look into what CommonJS is and why it's making your JavaScript bundles larger than necessary.

Summary: **To ensure the bundler can successfully optimize your application, avoid depending on CommonJS modules, and use ECMAScript module syntax in your entire application.**


## What's CommonJS?

CommonJS is a standard from 2009 that established conventions for JavaScript modules. It was initially intended for use outside of the web browser, primarily for server-side applications.

With CommonJS you can define modules, export functionality from them, and import them in other modules. For example, the snippet below defines a module which exports five functions: `add`, `subtract`, `multiply`, `divide`, and `max`:

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

Later on, another module can import and use some or all of these functions:

```javascript
// index.js
const { add } = require(‘./utils');
console.log(add(1, 2));
```

Invoking `index.js` with `node` will output the number `3` in the console.

Because of the lack of a standardized module system in the browser in the early 2010s, CommonJS became a popular module format for JavaScript client-side libraries as well.


## How does CommonJS affect your final bundle size?

The size of your server-side JavaScript application is not as critical as in the browser, that's why CommonJS was not designed with reducing the production bundle size in mind. At the same time, [analysis](https://v8.dev/blog/cost-of-javascript-2019) shows that the JavaScript bundle size is still the number one reason for making browser apps slower.

JavaScript bundlers and minifiers, such as `webpack` and `terser`, perform different optimizations to reduce the size of your app. Analyzing your application at build time, they try to remove as much as possible from the source code you're not using.

For example, in the snippet above, your final bundle should only include the `add` function since this is the only symbol from `utils.js` that you import in `index.js`.

Let's build the app using the following `webpack` configuration:

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

Here we specify that we want to use production mode optimizations and use `index.js` as an entry point. After invoking `webpack`, if we  explore the [output](https://github.com/mgechev/commonjs-example/blob/master/commonjs/dist/out.js) size, we'll see something like this:

```shell
$ cd dist && ls -lah
625K Apr 13 13:04 out.js
```

Notice that **the bundle is 625KB**. If we look into the output, we'll find all the functions from `utils.js` plus a lot of modules from [`lodash`](https://lodash.com/)**. Although we do not use `lodash` in `index.js` it's part of the output**, which adds a lot of extra weight to our production assets.

Now let us change the module format to [ECMAScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and try again. This time, `utils.js` would look like this:

```javascript
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

import { maxBy } from 'lodash-es';

export const max = arr => maxBy(arr);
```

And `index.js` would import from `utils.js` using ECMAScript module syntax:

```javascript
import { add } from './utils';

console.log(add(1, 2));
```

Using the same `webpack` configuration, we can build our application and open the output file. **It is now 40 bytes** with the following [output](https://github.com/mgechev/commonjs-example/blob/master/esm/dist/out.js):

```javascript
(()=>{"use strict";console.log(1+2)})();
```

Notice that the final bundle does not contain any of the functions from `utils.js` that we don't use, and there's no trace from `lodash`! Even further, `terser` (the JavaScript minifier that `webpack` uses) inlined the `add` function in `console.log`.

A fair question you might ask is, **why does using CommonJS cause the output bundle to be almost 16,000 times bigger**? Of course, this is a toy example, in reality, the size difference might not be that large, but the chances are that CommonJS adds significant weight to your production build.

**CommonJS modules are harder to optimize in the general case because they are much more dynamic than ES modules. To ensure your bundler and minifier can successfully optimize your application, avoid depending on CommonJS modules, and use ECMAScript module syntax in your entire application.**

Notice that even if you're using ECMAScript modules in `index.js`, if the module you're consuming is a CommonJS module, your app's bundle size will suffer.


## Why does CommonJS make your app larger?

To answer this question, we'll look at the behavior of the `ModuleConcatenationPlugin` in `webpack` and, after that, discuss static analyzability. This plugin concatenates the scope of all your modules into one closure and allows for your code to have a faster execution time in the browser. Let's look at an example:

```javascript
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

```javascript
// index.js
import { add } from ‘./utils';
const subtract = (a, b) => a - b;

console.log(add(1, 2));
```

Above, we have an ECMAScript module, which we import in `index.js`. We also define a `subtract` function. We can build the project using the same `webpack` configuration as above, but this time, we'll disable minimization:

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

Let us look at the produced output:

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

In the output above, all the functions are inside the same namespace. To prevent collisions, webpack renamed the `subtract` function in `index.js` to `index_subtract`.

If a minifier processes the source code above, it will:

* Remove the unused functions `subtract` and `index_subtract`
* Remove all the comments and redundant whitespace
* Inline the body of the `add` function in the `console.log` call

Often developers refer to this **removal of unused imports as tree-shaking**. Tree-shaking was only possible because webpack was able to statically (at build time) understand which symbols we are importing from `utils.js` and what symbols it exports.

This behavior is enabled by default for **ES modules** because they **are more statically analyzable**, compared to CommonJS.

Let us look at the exact same example, but this time change `utils.js` to use CommonJS instead of ES modules:

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

This small update will significantly change the output. Since it's too long to embed on this page, I've shared only a small portion of it:

```javascript
...
(() => {

"use strict";
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(288);
const subtract = (a, b) => a - b;
console.log((0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .add */ .IH)(1, 2));

})();
```

Notice that the final bundle contains some `webpack` "runtime": injected code that is responsible for importing/exporting functionality from the bundled modules. This time, instead of placing all the symbols from `utils.js` and `index.js` under the same namespace, we require dynamically, at runtime, the `add` function using `__webpack_require__`.

This is necessary because with CommonJS we can get the export name from an arbitrary expression. For example, the code below is an absolutely valid construct:

```javascript
module.exports[localStorage.getItem(Math.random())] = () => { … };
```

There's no way for the bundler to know at build-time what the name of the exported symbol is since this requires information that's only available at runtime, in the context of the user's browser.

**This way, the minifier is incapable of understanding what exactly `index.js` uses from its dependencies so it can't tree-shake it away.** We'll observe the exact same behavior for third-party modules as well. **If we import a CommonJS module from `node_modules`, your build toolchain will not be able to optimize it properly.**


## Tree-shaking with CommonJS

It's much harder to analyze CommonJS modules since they are dynamic by definition. For example, the import location in ES modules is always a string literal, compared to CommonJS, where it is an expression.

In some cases, if the library you're using follows specific conventions on how it uses CommonJS, it's possible to remove unused exports at build time using a third-party `webpack` [plugin](https://github.com/indutny/webpack-common-shake). Although this plugin adds support for tree-shaking, it does not cover all the different ways your dependencies could use CommonJS. This means that you're not getting the same guarantees as with ES modules. Additionally, it adds an extra cost as part of your build process on top of the default `webpack` behavior.


## Conclusion

**To ensure the bundler can successfully optimize your application, avoid depending on CommonJS modules, and use ECMAScript module syntax in your entire application.**

Here are a few actionable tips to verify you're on the optimal path:

- Use Rollup.js's [node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)
  plugin and set the `modulesOnly` flag to specify that you want to depend only on ECMAScript modules.
- Use the package [`is-esm`](https://github.com/mgechev/is-esm)
  to verify that an npm package uses ECMAScript modules.
- If you're using Angular, by default you'll get a warning if you depend on non-tree-shakeable modules.
