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


JavaScript is single-threaded, which means only one operation can be performed at a time. This is intuitive and works well for lots of cases on the web, but can become problematic when we need to do heavy lifting tasks like data processing, parsing, computation or analysis. As more and more complex applications are delivered on the Web Platform, there’s an increased need for multi-threaded processing.

On the Web Platform, the main primitive for threading and parallelism is the [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). Workers are a lightweight abstraction on top of [Operating System threads](https://en.wikipedia.org/wiki/Thread_%28computing%29) that expose a message passing API for inter-thread communication. This can be immensely useful when performing costly computations or operating on large datasets, allowing the main thread to run smoothly while performing the expensive operations on one or more background threads.

Here’s a typical example of Worker usage, where a worker script listens for messages from the main thread and responds by sending back messages of its own:


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

Since Module Workers are JS Modules, they can use standard JavaScript import and export statements. As with all JS Modules, dependencies are only executed once in a given context (main thread, worker, etc), and all future imports reference the already-executed module instance. The loading and execution of JS Modules is also optimized by browsers - because a Module’s dependencies can be loaded prior to the Module being executed, entire module trees can be loaded in parallel. Module loading also caches parsed code, which means modules that are used on the main thread and in a Worker only need to be parsed once.

Moving to JS Modules also enables the use of [dynamic import](https://v8.dev/features/dynamic-import) for lazy-loading code without blocking execution of the worker. Dynamic Import is much more explicit than using importScripts to load dependencies, since the imported module’s exports are returned rather than relying on global variables.

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

To ensure great performance, the old `importScripts()` API is not available within Module Workers. Switching Workers to use JS Modules means all code is loaded in [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode), and HTML-style comments are not supported. Another notable change is that the value of `this` in the top-level scope of a JS Module is `undefined`, whereas in Classic Workers the value was the worker’s global scope. Fortunately, there has always been a `self` global that provides a reference to the global scope - it’s available in all types of Workers including Service Workers, as well as in the DOM.

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

Preloaded modules can also be used by both the main thread and Module Workers. This is useful for modules that are imported in both contexts, or in cases where it’s not possible to know in advance whether a module will be used on the main thread or in a Worker.

Previously, the options available for preloading Web Worker scripts were limited and not necessarily reliable. Classic Workers had their own “worker” resource type for preloading, but no browsers implemented `<link rel="preload" as="worker">`. As a result, the primary technique available for preloading Worker scripts was to use `<link rel="prefetch">`, which relied entirely on the HTTP cache. When used in combination with caching headers were set up correctly, this made it possible to avoid `new Worker()` having to wait to download the Worker script, but did not support preloading dependencies or pre-parsing.

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


<!--
Bundling a full website as a single file and making it shareable
opens up new use cases for the web. Imagine a world where you can: 

* Create your own content and distribute it in all sorts of ways without being
  restricted to the network
* Share a web app or piece of web content with your friends via Bluetooth or Wi-Fi Direct
* Carry your site on your own USB or even host it on your own local network

The Web Bundles API is a bleeding edge proposal that lets you do all of this.

## Introducing the Web Bundles API

A Web Bundle is a file format for encapsulating one or more HTTP resources in a
single file. It can include one or more HTML files, JavaScript files,
images, or stylesheets.

 Web Bundles, more formally known as [Bundled HTTP
 Exchanges](https://wicg.github.io/webpackage/draft-yasskin-wpack-bundled-exchanges.html),
 are part of the [Web Packaging](https://goto.google.com/webpackaging-one-pager)
 proposal.

<figure class="w-figure  w-figure--center">
  <img src="webbundle.png" 
       alt="A figure demonstrating that a Web Bundle is a collection of web resources." 
       style="max-width: 75%">
  <figcaption class="w-figcaption">
    How Web Bundles work
  </figcaption>
</figure>

HTTP resources in a Web Bundle are indexed by request URLs, and can optionally
come with signatures that vouch for the resources. Signatures allow browsers to
understand and verify where each resource came from, and treats each as coming
from its true origin. This is similar to how [Signed HTTP Exchanges][exchanges],
a feature for signing a single HTTP resource, are handled.

This article walks you through what a Web Bundle is and how to use one.

## Explaining Web Bundles

To be precise, a Web Bundle is a [CBOR file](https://cbor.io/) with a `.wbn` extension (by convention) which
packages HTTP resources into a binary format, and is served with the `application/webbundle` MIME
type. You can read more about this in the [Top-level structure](https://wicg.github.io/webpackage/draft-yasskin-wpack-bundled-exchanges.html#top-level)
section of the spec draft.

Web Bundles have multiple unique features:

* Encapsulates multiple pages, enabling bundling of a complete website into a single file
* Enables executable JavaScript, unlike MHTML
* Uses [HTTP Variants](https://tools.ietf.org/id/draft-ietf-httpbis-variants-00.html) to do
  content negotiation, which enables internationalization with the `Accept-Language`
  header even if the bundle is used offline
* Loads in the context of its origin when cryptographically signed by its publisher
* Loads nearly instantly when served locally

These features open multiple scenarios. One common scenario is the ability to
build a self-contained web app that's easy to share and usable without an
internet connection. For example, say you're on an airplane from Tokyo to San Francisco with
your friend. You don't like the in-flight entertainment. Your friend is playing an interesting
web game called [PROXX](https://proxx.app/), and tells you that she downloaded the game as a Web
Bundle before boarding the plane. It works flawlessly offline. Before Web
Bundles, the story would end there and you would either have to take turns
playing the game on your friend's device, or find something else to pass the
time. But with Web Bundles, here's what you can now do:

1. Ask your friend to share the `.wbn` file of the game. For example the file
   could easily be shared peer-to-peer using a file sharing app.
2. Open the `.wbn` file in a browser that supports Web Bundles.
3. Start playing the game on your own device and try to beat your friend's high
   score.

Here's a video that explains this scenario.

{% YouTube 'xAujz66la3Y' %}

As you can see, a Web Bundle can contain every resource, making it work offline
and load instantly.

{% Aside %}
  Currently Chrome 80 only supports unsigned bundles (that is, Web Bundles without
  origin signatures). Bundling PROXX without signatures doesn't work
  well due to web worker cross-origin issues. Chrome is working on fixing this. In
  the meantime, check out [Dealing with Common Problems in Unsigned
  Bundles](https://chromium.googlesource.com/chromium/src/+/refs/heads/master/content/browser/web_package/using_web_bundles.md#Dealing-with-Common-Problems-in-Unsigned-Bundles)
  to learn how to avoid cross-origin issues.
{% endAside %}

## Building Web Bundles

The [`go/bundle`](https://github.com/WICG/webpackage/tree/master/go/bundle) CLI is currently the
easiest way to bundle a website. `go/bundle` is a reference implementation of the Web Bundles
specification built in [Go](https://golang.org/).

1. [Install Go](https://golang.org/doc/install).
1. Install `go/bundle`.

   ```bash
   go get -u github.com/WICG/webpackage/go/bundle/cmd/...
   ```

1. Clone the [preact-todomvc](https://github.com/developit/preact-todomvc) repository and build
   the web app to get ready to bundle the resources.

    ```bash
    git clone https://github.com/developit/preact-todomvc.git
    cd preact-todomvc
    npm i
    npm run build
    ```

2. Use the `gen-bundle` command to build a `.wbn` file.

    ```bash
    gen-bundle -dir build -baseURL https://preact-todom.vc/ -primaryURL https://preact-todom.vc/ -o todomvc.wbn
    ```

Congratulations! TodoMVC is now a Web Bundle.

There are other options for bundling and more are coming. The `go/bundle` CLI
lets you build a Web Bundle using a HAR file or a custom list of resource
URLs. Visit the [GitHub
repo](https://github.com/WICG/webpackage/tree/master/go/bundle) to learn more
about `go/bundle`. You can also try out the experimental Node.js module for bundling, 
[`wbn`](https://www.npmjs.com/package/wbn). Note that `wbn` is still in the early stages of
development.

## Playing around with Web Bundles

To try out a Web Bundle:

1. Go to `chrome://version` to see what version of Chrome you're running. If you're running version
   80 or later, skip the next step.
1. Download [Chrome Canary](https://www.google.com/chrome/canary/) if you're not running Chrome 80
   or later.
1. Open `chrome://flags/#web-bundles`.
1. Set the **Web Bundles** flag to **Enabled**.

   <figure class="w-figure  w-figure--center">
     <img src="chromeflag.png" alt="A screenshot of chrome://flags" style="max-width: 75%">
     <figcaption class="w-figcaption">
       Enabling Web Bundles in <code>chrome://flags</code>
     </figcaption>
   </figure>

1. Relaunch Chrome.
1. Drag-and-drop the `todomvc.wbn` file into Chrome if you're on desktop, or tap it in a file
   management app if you're on Android.

Everything magically works.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/web-bundles/preact-todomvc.mp4" 
            type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    The Preact implementation of TodoMVC working offline as a web bundle
  </figcaption>
</figure>

You could also try out other sample web bundles:

- [web.dev.wbn](https://storage.googleapis.com/web-dev-assets/web-bundles/web.dev.wbn) is a 
   snapshot of the entire web.dev site, as of 2019 October 15.
- [proxx.wbn](https://storage.googleapis.com/web-dev-assets/web-bundles/proxx.wbn):
  [PROXX](/proxx-announce/) is a Minesweeper clone that works offline.
- [squoosh.wbn](https://storage.googleapis.com/web-dev-assets/web-bundles/squoosh.wbn): 
  [Squoosh](https://squoosh.app) is a convenient and fast image optimization tool that
  lets you do side-by-side comparisons of various image compression formats, with support for
  resizing and format conversions.

{% Aside %}
  Currently you can only navigate into a Web Bundle stored in a local file, but
  that's only a temporary restriction.
{% endAside %}

## Send feedback

The Web Bundle API implementation in Chrome is experimental and incomplete.
Not everything is working and it might fail or crash. That's why
it's behind an experimental flag. But the API is ready enough for you to explore it in Chrome.
Feedback from web developers is crucial to the design of
new APIs, so please try it out and tell the people working on Web Bundles what you think.

* Send general feedback to
  [webpackage-dev@chromium.org](mailto:webpackage-dev@chromium.org).
* If you have feedback on the spec visit
  [https://github.com/WICG/webpackage/issues/new](https://github.com/WICG/webpackage/issues/new)
  to file a new spec issue, or email [wpack@ietf.org](mailto:wpack@ietf.org).
* If you find any issues in Chrome's behavior visit
  [https://crbug.com/new](https://crbug.com/new) to file a Chromium bug.
* Any contributions to the spec discussion and tooling are also more than
  welcome. Visit the [spec repo](https://github.com/WICG/webpackage) to get involved.

**Acknowledgements**

We would like to give a big shout-out to the wonderful Chrome engineering team,
[Kunihiko Sakamoto](https://github.com/irori), [Tsuyoshi
Horo](https://twitter.com/horo), [Takashi
Toyoshima](https://twitter.com/toyoshim), [Kinuko
Yasuda](https://twitter.com/kinu) and [Jeffrey
Yasskin](https://twitter.com/jyasskin) that worked hard contributing to the
spec, building the feature on Canary and reviewing this article. During the
standardization process [Dan York](http://danyork.me/) has helped navigate the
IETF discussion and also [Dave Cramer](https://twitter.com/dauwhe) has been a
great resource on what publishers actually need. We also want to thank [Jason
Miller](https://twitter.com/_developit) for the amazing preact-todomvc and his
restless effort on making the framework better.

[exchanges]: https://developers.google.com/web/updates/2018/11/signed-exchanges
[go/bundle]: https://github.com/WICG/webpackage/tree/master/go/bundle
-->