---
title: "How we're bringing Google Earth to the web"
subhead: |
  Improving cross-browser access to Google Earth with WebAssembly.
date: 2019-06-20
authors:
  - jormears
hero: image/admin/W2buTZDHpZeTqiO1pbCQ.jpg
alt: A globe with code overlaid
description: |
  Improving cross-browser access to Google Earth with WebAssembly
tags:
  - blog
  - webassembly
  - Earth
  - Web App
  - case-study
---

In an ideal world, every application that developers build, regardless of technology, would be available in the browser. But there are barriers to bringing projects to the web, depending on the technology they were built with and how well that technology is supported by the various browser vendors. [WebAssembly](https://webassembly.org/) (Wasm) is a compile target standardized by the [W3C](https://www.w3.org/) that helps us solve this problem by allowing us to run codebases from languages other than JavaScript on the web.


We've done just that with Google Earth, available today in [preview beta](https://g.co/earth/beta) on WebAssembly. Keep in mind that this is still a beta of Google Earth and may not be as smooth as you're used to (try out regular [Earth for web](https://earth.google.com/web/)). You can experiment with this beta in Chrome and other Chromium-based browsers, including Edge (Canary version) and Opera, as well as Firefox. Consider this beta your inspiration if you too are looking for better cross-browser support for your platform-specific applications.


## Why we chose WebAssembly for Google Earth

We originally wrote most of Google Earth in C++ because it was a desktop application intended for install. Then we were able to port it to Android and iOS as smartphones took hold, retaining most of our C++ codebase using [NDK](https://developer.android.com/ndk) and [Objective-C++](https://www.wikipedia.org/wiki/Objective-C#Objective-C++). In 2017, when we brought Earth to the web, we used [Native Client](https://developer.chrome.com/native-client) (NaCl) to compile the C++ code and run it in the Chrome browser.

 At the time, NaCl was the only browser technology that allowed us to port our C++ code to the browser and give us the kind of performance Earth needed. Unfortunately, NaCl was a Chrome-only technology that never saw adoption across browsers. Now we're starting to switch to WebAssembly, which lets us take that same code and run it across browsers. This means Earth will be available to more people across the web.

 {% Img src="image/admin/xZ614l31AdC5L8qd44Kq.webp", alt="A screenshot of Earth showing Eiffel Tower", width="800", height="447", class="w-screenshot" %}

## A thread on threading

WebAssembly is still evolving as a standard, and browsers continue to get extended with more features and functionality. From the Earth perspective, the most significant difference in support for WebAssembly between browsers is support for threading. Some browsers offer multi-threading support and others don't. Think of Earth like a huge 3D video game of the real world. As such, we're constantly streaming data to the browser, decompressing it and making it ready for rendering to the screen. Being able to do this work on a background thread has shown a clear improvement in [the performance of Earth in the browser](https://medium.com/google-earth/performance-of-web-assembly-a-thread-on-threading-54f62fd50cf7).

Multi-threaded WebAssembly relies on a browser feature called SharedArrayBuffer, which was pulled from browsers after the Spectre and Meltdown security vulnerabilities were revealed. To mitigate potential damage from attacks, Chrome's security team [introduced Site Isolation](https://security.googleblog.com/2018/07/mitigating-spectre-with-site-isolation.html) in Chrome for all desktop operating systems. Site Isolation limits each renderer process to documents from a single site. With this security feature in place, Chrome re-enabled SharedArrayBuffer for desktop—which allowed us to use multi-threaded WebAssembly with Earth for Chrome.

Other browsers are working on Site Isolation or other mitigations in order to re-enable SharedArrayBuffer. In the meantime, Earth runs single-threaded in those browsers.

## How WebAssembly works with different browsers

We've learned a lot about the state of WebAssembly support in browsers porting Earth. If you're going to develop applications using WebAssembly, it's important to understand the current state of how WebAssembly works with different browsers.

### Edge
Edge is on the verge of becoming two distinct development experiences based on Microsoft's choice to move from the EdgeHTML renderer over to a Chromium-based renderer. At the moment, the Google Earth beta on WebAssembly won't run on the current public version of Edge due to lack of support for WebGL2. That will be fixed once the new version of Edge, based on Chromium, ships in the near future. In the meantime, you can [download the Canary version of Edge](https://www.microsoftedgeinsider.com/download) and see that Earth works quite well.

### Chrome
Chrome has strong support for WebAssembly, including multi-threading on desktop, so you can expect Earth to run smoother as a result. However, we look forward to Chrome adding support for dynamic memory allocation with multi-threading in WebAssembly. Until then, Earth may fail to start on devices with limited amounts of memory (such as 32-bit machines).

### Firefox
Firefox offers good support for WebAssembly, but has disabled support for multi-threading. As a result, you can expect a slower experience with Earth. We look forward to Mozilla bringing back support for multi-threading in future versions. On the upside, Firefox does support dynamic memory allocation.

### Opera
Opera is based on Chromium just as Chrome is, along with upcoming versions of Edge. However, the current version of Opera only offers single-threaded support of WebAssembly. Earth does run in Opera, but at a somewhat degraded experience. Hopefully newer versions of Opera will have support for multi-threading and more robust WebAssembly support.

### Safari
Safari has a strong implementation of WebAssembly, but it lacks full support for WebGL2. Therefore, Earth with WebAssembly does not run in Safari. Specifically, some of our shaders require GLSL 1.2. We hope that Earth will be available on Safari as well, once better support for WebGL2 is added.

## Looking forward to more adoption of WebAssembly features
It's been a long road to make Earth available on the web. About six years ago, we started with an initial [asm.js](http://asmjs.org/)-based internal demo that was maintained and expanded over the years. It was then converted into a WebAssembly build of Earth, as WebAssembly became the W3C adopted standard.

We still have a ways to go for WebAssembly and Earth. Specifically, we'd like to move to the LLVM backend using Emscripten (the toolchain to generate WebAssembly out of C++ code). This change will enable future SIMD support, as well as stronger debugging tools like source maps for source-language code. Other things we hope to see are adoption of [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) and full support for dynamic memory allocation in WebAssembly. But we know we're on the right track: WebAssembly is the long-term future for Earth on the web.

Please take a moment to try our [beta](https://g.co/earth/beta). Let us know how it works for you by leaving feedback directly in Earth.
