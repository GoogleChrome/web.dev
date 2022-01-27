---
title: WebAssembly feature detection
subhead: Learn how to use the newest WebAssembly features while supporting users across all browsers.
description: Learn how to use the newest WebAssembly features while supporting users across all browsers.
date: 2022-01-27
hero: image/9oK23mr86lhFOwKaoYZ4EySNFp02/AQnv9b8SVDwo3y5wSQdG.png
alt: Spectral lines of phosphorus.
authors:
  - rreverser
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - webassembly
---

WebAssembly 1.0 was released four years ago, but development didn't stop there. New features are added through the [proposal standardization process](https://github.com/WebAssembly/meetings/blob/main/process/phases.md). As is generally the case with new features on the web, their implementation order and timelines can differ significantly between different engines. If you want to use those new features, you need to ensure that none of your users are left out. In this article you’ll learn an approach for achieving this.

Some new features improve code size by adding new instructions for common operations, some add powerful performance primitives, and others improve developer experience and integration with the rest of the web.

You can find the complete list of proposals and their respective stages in the [official repo](https://github.com/WebAssembly/proposals) or track their implementation status in engines on the official [feature roadmap](https://webassembly.org/roadmap/) page.

To ensure that users of all browsers can use your application, you need to figure out which features you want to use. Then, split them up into groups based on browser support. Then, compile your codebase separately for each of those groups. Finally, on the browser side you need to detect supported features and load the corresponding JavaScript and Wasm bundle.

## Picking and grouping features

Let's walk through those steps by picking some arbitrary feature set as an example. Let's say I've identified that I want to use SIMD, threads, and exception handling in my library for size and performance reasons. Their [browser support](https://webassembly.org/roadmap/) is as follows:

<figure>
{% Img src="image/9oK23mr86lhFOwKaoYZ4EySNFp02/2HAGqxkbSoNhK03itXBK.png", alt="A table showing browser support of the chosen features.", width="800", height="813" %}
  <figcaption>
    View this feature table on <a href="https://webassembly.org/roadmap/">webassembly.org/roadmap</a>.
  </figcaption>
</figure>

You can split browsers into the following cohorts to make sure that each user gets the most optimized experience:

* Chrome-based browsers: Threads, SIMD, and exception handling are all supported.
* Firefox: Thread and SIMD are supported, exception handling is not.
* Safari: Threads are supported, SIMD and exception handling are not.
* Other browsers: assume only baseline WebAssembly support.

This breakdown splits by feature support in the latest version of each browser. Modern browsers are evergreen and auto-update, so in the majority of cases you only need to worry about the latest release. However, as long as you include baseline WebAssembly as a fallback cohort, you can still provide a working application even for users with outdated browsers.

## Compiling for different feature sets

WebAssembly doesn't have a built-in way to detect supported features in runtime,  therefore all instructions in the module must be supported on the target. Because of that, you need to compile the source code into Wasm separately for each of those different feature sets.

Each toolchain and build system is different, and you'll need to consult the documentation of your own compiler for how to tweak those features. For the sake of simplicity, I'll use a single-file C++ library in the following example and show how to compile it with Emscripten.

I'll use [SIMD](https://v8.dev/features/simd) via [SSE2 emulation](https://emscripten.org/docs/porting/simd.html#compiling-simd-code-targeting-x86-sse-instruction-set), threads via [Pthreads](https://emscripten.org/docs/porting/pthreads.html) library support, and choose between [Wasm exception handling](https://emscripten.org/docs/porting/exceptions.html#webassembly-exception-handling-proposal) and the [fallback JavaScript implementation](https://emscripten.org/docs/porting/exceptions.html#javascript-based-exception-support):

```bash
# First bundle: threads + SIMD + Wasm exceptions
$ emcc main.cpp -o main.threads-simd-exceptions.mjs -pthread -msimd128 -msse2 -fwasm-exceptions
# Second bundle: threads + SIMD + JS exceptions fallback
$ emcc main.cpp -o main.threads-simd.mjs -pthread -msimd128 -msse2 -fexceptions
# Third bundle: threads + JS exception fallback
$ emcc main.cpp -o main.threads.mjs -pthread -fexceptions
# Fourth bundle: basic Wasm with JS exceptions fallback
$ emcc main.cpp -o main.basic.mjs -fexceptions
```

The C++ code itself can use `#ifdef __EMSCRIPTEN_PTHREADS__` and `#ifdef __SSE2__` to conditionally choose between parallel (threads and SIMD) implementations of the same functions and the serial implementations at compile-time. It would look like this:

```cpp
void process_data(std::vector<int>& some_input) {
#ifdef __EMSCRIPTEN_PTHREADS__
#ifdef __SSE2__
  // …implementation using threads and SIMD for max speed
#else
  // …implementation using threads but not SIMD
#endif
#else
  // …fallback implementation for browsers without those features
#endif
}
```

The exception handling doesn't need `#ifdef` directives, because it can be used in the same way from C++ regardless of the underlying implementation chosen via the compilation flags.

## Loading the correct bundle

Once you have built bundles for all feature cohorts, you need to load the correct one from the main JavaScript application. To do that, first, detect which features are supported in the current browser. You can do that with the [wasm-feature-detect](https://github.com/GoogleChromeLabs/wasm-feature-detect) library. By combining it with [dynamic import](https://v8.dev/features/dynamic-import), you can load the most optimized bundle in any browser:

```js
import { simd, threads, exceptions } from 'https://unpkg.com/wasm-feature-detect?module';

let initModule;
if (await threads()) {
  if (await simd()) {
    if (await exceptions()) {
      initModule = import('./main.threads-simd-exceptions.mjs');
    } else {
      initModule = import('./main.threads-simd.mjs');
    }
  } else {
    initModule = import('./main.threads.mjs');
  }
} else {
  initModule = import('./main.basic.mjs');
}

const Module = await initModule();
// now you can use `Module` Emscripten object like you normally would
```

## Final words

In this post, I've shown how to choose, build and switch between bundles for different feature sets.

As the number of features grows,the number of feature cohorts may become unmaintainable. To alleviate this problem, you can choose feature cohorts based on your real-world user data, skip the less popular browsers and let them fall back to slightly less optimal cohorts. As long as your application still works for all users, this approach can provide a reasonable balance between progressive enhancement and runtime performance.

In the future, WebAssembly might get a built-in way to detect supported features and switch between different implementations of the same function within the module. However, such a mechanism would itself be a post-MVP feature that you would need to detect and load conditionally using the approach above. Until then, this approach remains the only way to build and load code using new WebAssembly features across all browsers.
