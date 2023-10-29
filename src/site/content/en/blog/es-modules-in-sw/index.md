---
title: "ES modules in service workers"
subhead: "A modern alternative to importScripts()."
description: "Service workers can use static imports of ES modules to bring in extra code, as an alternative to importScripts()."
authors:
  - jeffposnick
date: 2021-05-13
hero: image/FNkVSAX8UDTTQWQkKftSgGe9clO2/JobkNOB1V5C9bp7x4Jur.jpg
alt: Modular, abstract architecture.
tags:
  - blog
  - service-worker
---

## Background

[ES modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)
have been a developer favorite for a while now. In addition to a
[number of other benefits](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/),
they offer the promise of a universal module format where shared code can be
released once and run in browsers and in alternative runtimes like
[Node.js](https://nodejs.org/en/). While
[all modern browsers](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules#import)
offer some ES module support, they don't all offer support _everywhere_ that
code can be run. Specifically, support for importing ES modules inside of a
browser's
[service worker](https://developer.mozilla.org/docs/Web/API/Service_Worker_API/Using_Service_Workers)
is just starting to become more widely available.

This article details the current state of ES module support in service workers
across common browsers, along with some gotchas to avoid, and best practices for
shipping backwards-compatible service worker code.

## Use cases

The ideal use case for ES modules inside of service workers is for loading a
modern library or configuration code that's shared with other runtimes that
support ES modules.

Attempting to share code in this way prior to ES modules entailed using older
"universal" module formats like [UMD](https://github.com/umdjs/umd) that include
unneeded boilerplate, and writing code that made changes to globally exposed
variables.

Scripts imported via ES modules can trigger the service worker
[update](/service-worker-lifecycle/#updates)
flow if their contents change, matching the
[behavior](https://developer.chrome.com/blog/fresher-sw/#checks-for-updates-to-imported-scripts)
of
<code>[importScripts()](https://developer.mozilla.org/docs/Web/API/WorkerGlobalScope/importScripts)</code>.

## Current limitations

### Static imports only

ES modules can be imported in one of two ways: either
[statically](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import),
using the `import ... from '...'` syntax, or
[dynamically](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports),
using the `import()` method. Inside of a service worker, only the static
syntax is currently supported.

This limitation is analogous to a
[similar restriction](https://developer.chrome.com/blog/tweeks-to-addAll-importScripts/)
placed on `importScripts()` usage. Dynamic calls to `importScripts()` do not
work inside of a service worker, and all `importScripts()` calls, which are
inherently synchronous, must complete before the service worker completes its
`install` phase. This restriction ensures that the browser knows about, and is
able to implicitly cache, all JavaScript code needed for a service worker's
implementation during installation.

Eventually, this restriction might be lifted, and dynamic ES
module imports
[may be allowed](https://github.com/w3c/ServiceWorker/issues/1356#issuecomment-783220858).
For now, ensure that you only use the static syntax inside of
a service worker.

#### What about other workers?

Support for
[ES modules in "dedicated" workers](/module-workers/)—those
constructed with `new Worker('...', {type: 'module'})`—is more widespread, and
has been supported in Chrome and Edge since
[version 80](https://chromestatus.com/feature/5761300827209728), as well as
[recent versions](https://bugs.webkit.org/show_bug.cgi?id=164860) of Safari.
Both static and dynamic ES module imports are supported in dedicated workers.

Chrome and Edge have supported ES modules in
[shared workers](https://developer.mozilla.org/docs/Web/API/SharedWorker)
since [version 83](https://chromestatus.com/feature/5169440012369920), but no
other browser offers support at this time.

### No support for import maps

[Import maps](https://github.com/WICG/import-maps/blob/main/README.md) allow
runtime environments to rewrite module specifiers, to, for example, prepend the
URL of a preferred CDN from which the ES modules can be loaded.

While Chrome and Edge
[version 89](https://www.chromestatus.com/feature/5315286962012160) and above
support import maps, they currently
[cannot be used](https://github.com/WICG/import-maps/issues/2) with service
workers.

## Browser support

{% BrowserCompat 'javascript.statements.import.worker_support' %}

ES modules in service workers are supported in Chrome and Edge starting with
[version 91](https://chromestatus.com/feature/4609574738853888).

Safari added support in the
[Technology Preview 122 Release](https://webkit.org/blog/11577/release-notes-for-safari-technology-preview-122/#:~:text=Added%20support%20for%20modules%20in%20Service%20Workers),
and developers should expect to see this functionality released in the stable
version of Safari in the future.

## Example code

This is a basic example of using a shared ES module in a web app's `window`
context, while also registering a service worker that uses the same ES module:

```javascript
// Inside config.js:
export const cacheName = 'my-cache';
```

```javascript
// Inside your web app:
<script type="module">
  import {cacheName} from './config.js';
  // Do something with cacheName.

  await navigator.serviceWorker.register('es-module-sw.js', {
    type: 'module',
  });
</script>
```

```javascript
// Inside es-module-sw.js:
import {cacheName} from './config.js';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    // ...
  })());
});
```

### Backwards compatibility

The above example would work fine if all browsers supported ES modules in
service workers, but as of this writing, that's not the case.

To accommodate browsers that don't have built-in support, you can run your
service worker script through an
[ES module-compatible bundler](https://bundlers.tooling.report/) to create a
service worker that includes all of the module code inline, and will work in
older browsers. Alternatively, if the modules you're attempting to import are
already available bundled in
[IIFE](https://developer.mozilla.org/docs/Glossary/IIFE) or
[UMD](https://github.com/umdjs/umd) formats, you can import them using
`importScripts()`.

Once you have two versions of your service worker available—one that uses ES
modules, and the other that doesn't—you'll need to detect what the current
browser supports, and register the corresponding service worker script. The best
practices for detecting support are currently in flux, but you can follow the
discussion in this
[GitHub issue](https://github.com/w3c/ServiceWorker/issues/1582) for
recommendations.

_Photo by <a
href="https://unsplash.com/@vlado?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Vlado
Paunovic</a> on <a
href="https://unsplash.com/@vlado?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>_
