---
title: Firefox and Chrome now support SharedArrayBuffer (again) for cross-origin isolated pages
subhead: >
  The API for sharing memory between the main thread and worker threads is available (again)
  on the desktop and Android versions of Firefox and Chrome. SharedArrayBuffer is only available for
  websites that have implemented COOP and COEP.
description: >
  The API for sharing memory between the main thread and worker threads is available (again)
  on the desktop and Android versions of Firefox and Chrome. SharedArrayBuffer is only available for
  websites that have implemented COOP and COEP.
authors:
  - kaycebasques
date: 2021-02-01
# updated: 2020-07-22
hero: hero.jpg
alt: An illustration of a person browsing a website that has a popup, an iframe, and an image.
tags:
  - blog
  - security
  - performance
  - memory
feedback:
  - api
---

Here's some quick browser compatibility updates regarding [`SharedArrayBuffer`][mdn]:

* In [SharedArrayBuffer updates in Android Chrome 88 and
  Desktop Chrome 91][announcement] Chrome recently announced that
  it's enabling `SharedArrayBuffer` in Android Chrome 88.
  It will only be enabled for [cross-origin isolated](/coop-coep/) pages.
* Chrome also announced that, starting in Desktop Chrome 91, it will start
  restricting `SharedArrayBuffer` to cross-origin isolated pages.
  Currently it's available for all pages. Sites that can't meet the cross-origin
  isolation requirements in time can request an origin trial to extend the
  current behavior until Chrome 93. In other words, any existing implementations
  that don't opt-in to cross-origin isolation and don't request an origin trial will
  no longer work in Chrome 91 and beyond.
* `SharedArrayBuffer` is already supported in Firefox 79 (Desktop and Android).
  Firefox was the first browser to re-enable `SharedArrayBuffer` with the
  cross-origin isolation requirements. See [Browser compatibility][compat] for
  updates on other browsers.

### Background {: #background }

By default, JavaScript runs on the main thread of your page. If you execute a
lot of JavaScript, the general responsiveness of your page can be negatively
affected. Offloading JavaScript work to a web worker can help with this problem
because web workers run on a separate thread. However, up until
`SharedArrayBuffer`, web workers could not share memory with the main thread. Data
had to be copied over, which can be slow and inefficient when working with big
data structures. `SharedArrayBuffer` enables the main thread and web workers to
share memory. But when the Spectre and Meltdown security vulnerabilities were
discovered browser vendors had to disable `SharedArrayBuffer` because
they were concerned that it could be used for those security exploits. Chrome
was able to re-introduce the API on Chrome Desktop after mitigations for Spectre
and Meltdown were in place. They're updating the Chrome Desktop behavior now for
consistency with web standards and to achieve total cross-origin isolation.
Check out [How did we get here?][history] for more details on the history of
`SharedArrayBuffer`.

[mdn]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
[workers]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
[compat]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#browser_compatibility
[announcement]: https://developer.chrome.com/blog/enabling-shared-array-buffer/
[history]: https://developer.chrome.com/blog/enabling-shared-array-buffer/#history
