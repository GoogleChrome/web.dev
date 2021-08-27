---
title: Bundling non-JavaScript resources
subhead: Learn how to import and bundle various types of assets from JavaScript.
description: Learn how to import and bundle various types of assets from JavaScript in a way that works both in browsers and bundlers.
date: 2021-09-07
hero: image/9oK23mr86lhFOwKaoYZ4EySNFp02/YxAYawQMtf7CTsT58dXD.jpg
alt: Long rows of containers at a port.
authors:
  - rreverser
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - webassembly
  - modules
  - javascript
---

Suppose you're working on a web app. In that case, it's likely that you have to deal not only with JavaScript modules, but also with all sorts of other resources—Web Workers (which are also JavaScript, but not part of the regular module graph), images, stylesheets, fonts, WebAssembly modules and others.

It's possible to include references to some of those resources directly in the HTML, but often they're logically coupled to reusable components. For example, a stylesheet for a custom dropdown tied to its JavaScript part, icon images tied to a toolbar component, or WebAssembly module tied to its JavaScript glue. In those cases, it's more convenient to reference the resources directly from their JavaScript modules and load them dynamically when (or if) the corresponding component is loaded.

{% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/QBZDTToXECua2ixAZf9U.png", alt="Graph visualising various types of asssets imported into JS.", width="800", height="496" %}

However, most large projects have build systems that perform additional optimizations and reorganization of content—for example, bundling and minification. They can't execute the code and predict what the result of execution will be, nor can they traverse every possible string literal in JavaScript and make guesses about whether it's a resource URL or not. So how can you make them "see" those dynamic assets loaded by JavaScript components, and include them in the build?

### Custom imports in bundlers

One common approach is to reuse the static import syntax. In some bundlers it might auto-detect format by the file extension, while others allow plugins to use a custom URL scheme like in the following example:

```js
// regular JavaScript import
import { loadImg } from './utils.js';

// special "URL imports" for assets
import imageUrl from 'asset-url:./image.png';
import wasmUrl from 'asset-url:./module.wasm';
import workerUrl from 'js-url:./worker.js';

loadImg(imageUrl);
WebAssembly.instantiateStreaming(fetch(wasmUrl));
new Worker(workerUrl);
```

When a bundler plugin finds an import with either an extension it recognizes or such an explicit custom scheme (`asset-url:` and `js-url:` in the example above), it adds the referenced asset to the build graph, copies it to the final destination, performs optimizations applicable for the asset's type and returns the final URL to be used during runtime.

The benefits of this approach: reusing the JavaScript import syntax, guarantees that all URLs are static and relative to the current file, which makes locating such dependencies easy for the build system.

However, it has one significant drawback: such code can't work directly in the browser, as the browser doesn't know how to handle those custom import schemes or extensions. This might be fine if you control all the code and rely on a bundler for development anyway, but it's increasingly common to use JavaScript modules directly in the browser, at least during development, to reduce the friction. Someone working on a small demo might not even need a bundler at all, even in production.

### Universal pattern for browsers and bundlers

If you're working on a reusable component, you'd want it to function in either environment, whether it's used directly in the browser or pre-built as part of a larger app. Most modern bundlers allow for this by accepting the following pattern in JavaScript modules:

```js
new URL('./relative-path', import.meta.url)
```

This pattern can be detected statically by tools, almost as if it was a special syntax, yet it's a valid JavaScript expression that works directly in the browser, too.

When using this pattern, the example above can be rewritten as:

```js
// regular JavaScript import
import { loadImg } from './utils.js';

loadImg(new URL('./image.png', import.meta.url));
WebAssembly.instantiateStreaming(
  fetch(new URL('./module.wasm', import.meta.url)),
  { /* … */ }
);
new Worker(new URL('./worker.js', import.meta.url));
```

How does it work? Let's break it up. The `new URL(...)` constructor takes a relative URL as the first argument and resolves it against an absolute URL provided as the second argument. In our case, the second argument is [`import.meta.url`](https://v8.dev/features/modules#import-meta) which gives the URL of the current JavaScript module, so the first argument can be any path relative to it.

It has similar tradeoffs to the [dynamic import](https://v8.dev/features/dynamic-import). While it's possible to use `import(...)` with arbitrary expressions like `import(someUrl)`, the bundlers give special treatment to a pattern with static URL `import('./some-static-url.js')` as a way to preprocess a dependency known at compile-time, yet [split it out into its own chunk](https://web.dev/reduce-javascript-payloads-with-code-splitting/) that's loaded dynamically.

Similarly, you can use `new URL(...)` with arbitrary expressions like `new URL(relativeUrl, customAbsoluteBase)`, yet the `new URL('...', import.meta.url)` pattern is a clear signal for bundlers to preprocess and include a dependency alongside the main JavaScript.

### Ambiguous relative URLs

You might be wondering, why can't bundlers detect other common patterns—for example, `fetch('./module.wasm')` without the `new URL` wrappers?

The reason is that, unlike import statements, any dynamic requests are resolved relatively to the document itself, and not to the current JavaScript file. Let's say you have the following structure:

- index.html: `<script src="src/main.js" type="module"></script>`
- src/
  -  main.js
  -  module.wasm

If you want to load `module.wasm` from `main.js`, it might be tempting to use a relative path like `fetch('./module.wasm')`.

However, `fetch` does not know the URL of the JavaScript file it's executed in, instead, it resolves URLs relatively to the document. As a result, `fetch('./module.wasm')` would end up trying to load `http://example.com/module.wasm` instead of the intended `http://example.com/src/module.wasm` and fail (or, worse, silently load a different resource than you intended).

By wrapping the relative URL into `new URL('...', import.meta.url)` you can avoid this problem and guarantee that any provided URL is resolved relative to the URL of the current JavaScript module (`import.meta.url`) before it's passed on to any loaders.

Replace `fetch('./module.wasm')` with `fetch(new URL('./module.wasm', import.meta.url))` and it will successfully load the expected WebAssembly module, as well as give bundlers a way to find those relative paths during the build time too.

### Tooling support

#### Bundlers

Following bundlers support the `new URL` scheme already:

-  [Webpack v5](https://webpack.js.org/guides/asset-modules/#url-assets)
-  [Rollup](https://rollupjs.org/) (via plugins—[@web/rollup-plugin-import-meta-assets](https://modern-web.dev/docs/building/rollup-plugin-import-meta-assets/) for generic assets and [@surma/rollup-plugin-off-main-thread](https://github.com/surma/rollup-plugin-off-main-thread) for Workers specifically).
-  [Parcel v2 (beta)](https://v2.parceljs.org/)
-  [Vite](https://vitejs.dev/guide/assets.html#new-url-url-import-meta-url)

#### WebAssembly

When working with WebAssembly, you will commonly not load the Wasm module by hand, but instead import the JavaScript glue emitted by the toolchain. The following toolchains can emit the described `new URL(...)` pattern under the hood for you.

##### C/C++ via Emscripten

When using Emscripten, you can ask it to emit JavaScript glue as an ES6 module instead of a regular script via one of the following options:

```shell
$ emcc input.cpp -o output.mjs
## or, if you don't want to use .mjs extension
$ emcc input.cpp -o output.js -s EXPORT_ES6
```

When using this option, the output will use the `new URL(..., import.meta.url)` pattern under the hood, so that bundlers can find the associated Wasm file automatically.

You can also use this option with [WebAssembly threads](https://web.dev/webassembly-threads/#c) by adding a `-pthread` flag:

```shell
$ emcc input.cpp -o output.mjs -pthread
## or, if you don't want to use .mjs extension
$ emcc input.cpp -o output.js -s EXPORT_ES6 -pthread
```

In this case, the generated Web Worker will be included in the same fashion and will also be discoverable by bundlers and browsers alike.

##### Rust via wasm-pack / wasm-bindgen

[wasm-pack](https://github.com/rustwasm/wasm-pack)—the primary Rust toolchain for WebAssembly—also has several output modes.

By default, it will emit a JavaScript module that relies on the [WebAssembly ESM integration proposal](https://github.com/WebAssembly/esm-integration). At the moment of writing, this proposal is still experimental, and the output will work only when bundled with Webpack.

Instead, you can ask wasm-pack to emit a browser-compatible ES6 module via `--target web`:

```shell
$ wasm-pack build –target web
```

The output will use the described `new URL(..., import.meta.url)` pattern, and the Wasm file will be automatically discovered by bundlers as well.

If you want to use WebAssembly threads with Rust, the story is a bit more complicated. Check out the [corresponding section of the guide](https://web.dev/webassembly-threads/#rust) to learn more.

Short version is that you can't use arbitrary thread APIs, but if you use [Rayon](https://github.com/rayon-rs/rayon), you can combine it with the [wasm-bindgen-rayon](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon) adapter so that it can spawn Workers on the Web. The JavaScript glue used by wasm-bindgen-rayon [also includes](https://github.com/GoogleChromeLabs/wasm-bindgen-rayon/blob/4cd0666d2089886d6e8731de2371e7210f848c5d/demo/index.js#L26) the `new URL(...)` pattern under the hood, and so the Workers will be discoverable and included by bundlers as well.

## Future features

### import.meta.resolve

A dedicated `import.meta.resolve(...)` call is a potential future improvement. It would allow resolving specifiers relatively to the current module in a more straightforward fashion, without extra params:

```js/1/0
new URL('...', import.meta.url)
await import.meta.resolve('...')
```

It would also integrate better with import maps and custom resolvers as it would go through the same module resolution system as `import`. It would also be a stronger signal for bundlers too as it's a static syntax that doesn't depend on runtime APIs like `URL`.

`import.meta.resolve` is already implemented [as an experiment in Node.js](https://nodejs.org/api/esm.html#esm_import_meta_resolve_specifier_parent) but there are still some [unresolved questions](https://github.com/WICG/import-maps/issues/79) about how it should work on the web.

### Import assertions

Import assertions are a new feature that allows to import types other than ECMAScript modules. For now they're limited to JSON:

{% Label%}foo.json:{% endLabel %}

```json
{ "answer": 42 }
```

{% Label %}main.mjs:{% endLabel %}

```js
import json from './foo.json' assert { type: 'json' };
console.log(json.answer); // 42
```

They might also be used by bundlers and replace the use-cases currently covered by the `new URL` pattern, but types in import assertions are added on a per-case basis. For now they only cover JSON, with CSS modules coming up soon, but other kinds of assets will still require a more generic solution.

Check out the [v8.dev feature explainer](https://v8.dev/features/import-assertions) to learn more about this feature.

## Conclusion

As you can see, there are various ways to include non-JavaScript resources on the web, but they have various drawbacks and don't work across various toolchains. Future proposals might let us import such assets with specialized syntax, but we're not quite there yet.

Until then, the `new URL(..., import.meta.url)` pattern is the most promising solution that already works in browsers, various bundlers and WebAssembly toolchains today.
