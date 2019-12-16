---
title: "Threading the Web with Module Workers"
subhead: |
  Moving heavy lifting into background threads is now easier with JS Modules in Workers.
date: 2019-12-17
hero: hero.jpg
alt: Module Workers
authors:
  - developit
description: |
  JavaScript is single-threaded, but Web Workers can be used to move expensive operations into
  background threads. Module Workers bring modern JavaScript
tags:
  - post
  - web-workers
  - js-modules
---

<!--lint disable no-heading-punctuation heading-increment -->

JavaScript is single-threaded, which means only one operation can be performed at a time. This is intuitive and works well for lots of cases on the web, but can become problematic when we need to do heavy lifting tasks like data processing, parsing, computation or analysis. As more and more complex applications are delivered on the Web Platform, there's an increased need for multi-threaded processing.

On the Web Platform, the main primitive for threading and parallelism is the [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). Workers are a lightweight abstraction on top of [Operating System threads](https://en.wikipedia.org/wiki/Thread_%28computing%29) that expose a message passing API for inter-thread communication. This can be immensely useful when performing costly computations or operating on large datasets, allowing the main thread to run smoothly while performing the expensive operations on one or more background threads.

Here's a typical example of Worker usage, where a worker script listens for messages from the main thread and responds by sending back messages of its own:


##### page.js:

```js
const worker = new Worker('worker.js');
worker.addEventListener(e => {
  console.log(e.data);
});
worker.postMessage('hello');
```

##### worker.js:

```js
addEventListener('message', e => {
  if (e.data === 'hello') {
    postMessage('world');
  }
});
```


Web Workers have actually been available in most browsers for over 10 years. While that means they have excellent browser support and are well-optimized, it also means they long predate JavaScript Modules. Since there was no module system when Workers were designed, the API for loading code into a Worker and composing scripts has remained similar to the synchronous script loading approaches common in 2009.

## History: Classic Workers

The Worker constructor takes a [Classic Script](https://html.spec.whatwg.org/multipage/webappapis.html#classic-script) URL, which is relative to the document URL. It immediately returns a reference to the new Worker instance, which exposes a messaging interface as well as a `terminate()` method that immediately stops and destroys the worker.

```js
const worker = new Worker('worker.js');
```

An `importScripts()` function is available within Web Workers for loading additional code, but it pauses execution of the worker in order to fetch and evaluate each script. It also executes scripts in the global scope like a classic `<script>` tag, meaning the variables in one script can be overwritten by the variables in another.

##### worker.js:

```js
importScripts('greet.js');
// ^ could block for seconds
addEventListener('message', e => {
  postMessage(sayHello());
});
```

##### greet.js:

```js
// global to the whole worker
function sayHello() {
  return 'world';
}
```

For this reason, using Web Workers has historically imposed an outsized effect on the architecture of an application. Developers have had to create clever tooling and workarounds to make it possible to use Web Workers without giving up modern development practises. As an example, bundlers like Webpack embed a small module loader implementation into generated code that uses `importScripts` for code loading, but wraps modules in functions to avoid variable collisions and simulate dependency imports and exports.


## Enter Module Workers

A new mode for Web Workers with the ergonomics and performance benefits of [JavaScript Modules](https://v8.dev/features/modules) is shipping in Chrome 80, called Module Workers. The Worker constructor accepts a new `{type:"module"}` option, which changes script loading and execution to match `<script type="module">`.

```js
const worker = new Worker('worker.js', {
  type: 'module'
});
```

Since Module Workers are JS Modules, they can use standard JavaScript import and export statements. As with all JS Modules, dependencies are only executed once in a given context (main thread, worker, etc), and all future imports reference the already-executed module instance. The loading and execution of JS Modules is also optimized by browsers - because a Module's dependencies can be loaded prior to the Module being executed, entire module trees can be loaded in parallel. Module loading also caches parsed code, which means modules that are used on the main thread and in a Worker only need to be parsed once.

Moving to JS Modules also enables the use of [dynamic import](https://v8.dev/features/dynamic-import) for lazy-loading code without blocking execution of the worker. Dynamic Import is much more explicit than using importScripts to load dependencies, since the imported module's exports are returned rather than relying on global variables.

##### worker.js:

```js
import { sayHello } from './greet.js';
addEventListener('message', e => {
  postMessage(sayHello());
});
```

##### greet.js:

```js
import greetings from './data.js';
export function sayHello() {
  return greetings.hello;
}
```

To ensure great performance, the old `importScripts()` API is not available within Module Workers. Switching Workers to use JS Modules means all code is loaded in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode), and HTML-style comments are not supported. Another notable change is that the value of `this` in the top-level scope of a JS Module is `undefined`, whereas in Classic Workers the value was the worker's global scope. Fortunately, there has always been a `self` global that provides a reference to the global scope - it's available in all types of Workers including Service Workers, as well as in the DOM.

## Preload Workers with modulepreload

One substantial performance improvement that comes with Module Workers is the ability to preload workers and their dependencies. With Module Workers, scripts are loaded and executed as standard JavaScript Modules, which means they can be preloaded and even pre-parsed using `modulepreload`:

```html
<!-- preloads worker.js and its dependencies: -->
<link rel="modulepreload" href="worker.js">

<script>
  addEventListener('load', () => {
    // our worker code is likely already parsed and ready to execute!
    const worker = new Worker('worker.js', { type: 'module' });
  });
</script>
```

Preloaded modules can also be used by both the main thread and Module Workers. This is useful for modules that are imported in both contexts, or in cases where it's not possible to know in advance whether a module will be used on the main thread or in a Worker.

Previously, the options available for preloading Web Worker scripts were limited and not necessarily reliable. Classic Workers had their own "worker" resource type for preloading, but no browsers implemented `<link rel="preload" as="worker">`. As a result, the primary technique available for preloading Worker scripts was to use `<link rel="prefetch">`, which relied entirely on the HTTP cache. When used in combination with caching headers were set up correctly, this made it possible to avoid `new Worker()` having to wait to download the Worker script, but did not support preloading dependencies or pre-parsing.

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/worker-preloading?previewSize=100&attributionHidden=true"
    alt="worker-preloading on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## What about Service Worker?

The Service Worker specification [has already been updated](https://w3c.github.io/ServiceWorker/#service-worker-concept) to support accepting a JS Module as the entry point, using the same `{type:"module"}` option as Module Workers, however this change has yet to be implemented in any browsers. Once that happens, it will be possible to instantiate a Service Worker using a JS Module using the following code:

```js
navigator.serviceWorker.register("/sw.js", {
  type: 'module'
});
```

Now that the specification has been updated, browsers are beginning to implement the new behavior. This takes time because there are some extra complications associated with bringing JS Modules to Service Worker. Service Worker registration needs to [compare imported scripts with their previous cached versions](https://chromestatus.com/feature/6533131347689472) when determining whether to trigger an update, and this needs to be implemented for JS Modules when used for Service Workers. Also, Service Worker needs to be able to [bypass the cache](https://chromestatus.com/feature/5897293530136576) for scripts in certain cases when checking for updates.


## Additional resources and further reading

*   [Feature status, browser consensus and standardization](https://www.chromestatus.com/feature/5761300827209728)
*   [Original Module Workers spec addition](https://github.com/whatwg/html/pull/608)
*   JS Modules for Service Worker: [Chrome Implementation Status](https://bugs.chromium.org/p/chromium/issues/detail?id=824647)
