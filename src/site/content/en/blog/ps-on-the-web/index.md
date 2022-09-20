---
layout: post
title: Photoshop's journey to the web
subhead: >
  The idea of running software as complex as Photoshop directly in the browser would have been hard to imagine just a few years ago. However, by using various new web technologies, Adobe has now brought a public beta of Photoshop to the web.
authors:
  - nattestad
  - nabeelalshamma
description: >
  Over the last three years, Chrome has been working to empower web applications that want to push the boundaries of what's possible in the browser. One such web application has been Photoshop. The idea of running software as complex as Photoshop directly in the browser would have been hard to imagine just a few years ago. However, by using various new web technologies, Adobe has now brought a public beta of Photoshop to the web.
date: 2021-10-26
updated: 2022-05-12
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/pYiISdhsJe3oEL871Dqp.png
alt: A part of Photoshop's user interface.
tags:
  - blog
  - capabilities
---

Over the last three years, Chrome has been working to empower web applications that want to push the boundaries of what's possible in the browser. One such web application has been Photoshop. The idea of running software as complex as Photoshop directly in the browser would have been hard to imagine just a few years ago. However, by using various new web technologies, Adobe has now brought a public beta of Photoshop to the web.

{% YouTube "CF5zZZy0R9U" %}

(If you prefer watching over reading, this article is also available as a
[video](https://www.youtube.com/watch?v=CF5zZZy0R9U).)

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/kfFAUTzDHzvE3hXISyQO.png", alt="The Photoshop web app running in a browser with an image showing an elephant on the canvas and the 'selection tools' menu item open. ", width="800", height="500" %}

In this post, we'd like to share for the first time the details of how our collaboration is extending Photoshop to the web. You can use all the APIs Adobe used and more in your own apps as well. Be sure to check out our [web capabilities related blog posts](/tags/capabilities/) for inspiration and watch our [API tracker](https://fugu-tracker.web.app/) for the latest and greatest we're working on.

## Why Photoshop came to the web

As the web has evolved, one thing that hasn't changed are the core advantages that websites and web apps offer over platform-specific applications. These advantages include many unique capabilities such as being linkable, ephemeral, and universal, but they boil down to enabling simple access, easy sharing, and great collaboration.

The simple power of a URL is that anyone can click it and instantly access it. All you need is a browser. There is no need to install an application or worry about what operating system you are running on. For web applications, that means users can have access to the application and their documents and comments. This makes the web the ideal collaboration platform, something that is becoming more and more essential to creative and marketing teams.

[Google Docs](https://docs.google.com/) was a pioneer of this simplified access. Most of us know how easy it is to start a document, send the link to someone, and immediately jump into not only the application, but the specific document or comment as well. Since then, a plethora of amazing applications, such as [those we've shown off in the past](https://www.youtube.com/watch?v=Nrm5G9A_dfs), have adopted this model and now Photoshop, too, will benefit.

## How Photoshop came to the web

The web started out as a platform only suited for documents, but has grown dramatically throughout its history. Early apps like [Gmail](https://www.google.com/gmail/) showed that more complex interactivity and applications were at least possible. Since then, we've seen impressive co-development where web apps push the boundaries of what's possible, and browser vendors respond by further expanding web capabilities. The latest iteration of this virtuous loop is what has enabled Photoshop on the web.

Adobe previously brought [Spark](https://spark.adobe.com/sp/) and [Lightroom](https://lightroom.adobe.com/) to the web and had been interested in bringing Photoshop to the web for many years. However, they were blocked by the performance limitations of JavaScript, the absence of a good compile target for their code, and the lack of web capabilities. Read on to learn what Chrome built in the browser to solve these problems.

## WebAssembly porting with Emscripten

WebAssembly and its C++ toolchain [Emscripten](https://emscripten.org/) have been the key to unlocking Photoshop's ability to come to the web, as it meant that Adobe would not have to start from scratch, but could leverage their existing Photoshop codebase. WebAssembly is a portable binary instruction set shipping in all browsers that was designed as a compilation target for programming languages. This means that applications such as Photoshop that are written in C++ can be ported directly to the web without requiring a rewrite in JavaScript. To get started porting yourself, check out the full [Emscripten documentation](https://emscripten.org/docs/index.html), or follow this [guided example of how to port a library](https://developers.google.com/web/updates/2018/03/emscripting-a-c-library).

Emscripten is a fully-featured toolchain that not only helps you compile your C++ to Wasm, but provides a translation layer that turns POSIX API calls into web API calls and even converts OpenGL into WebGL. For example, you can port applications that reference the local filesystem and [Emscripten will provide an emulated file system](https://emscripten.org/docs/porting/files/file_systems_overview.html#file-system-overview) to maintain functionality.

Emscripten has been capable of bringing most parts of Photoshop to the web for a while, but it wasn't necessarily fast enough. We have continually worked with Adobe to figure out where bottlenecks are and improve Emscripten. Photoshop depends upon multithreading. Bringing dynamic [multithreading](https://emscripten.org/docs/porting/pthreads.html) to WebAssembly was a critical requirement.

Also, exception-based error handling is very common in C++, but wasn't well supported in Emscripten and WebAssembly. We have worked with the [WebAssembly Community Group](https://www.w3.org/community/webassembly/) in the W3C to improve the WebAssembly standard and the tooling around it to bring C++ exceptions to WebAssembly.

Emscripten doesn't just work on large applications, but also lets you port libraries or smaller projects! For example, you can see [how you can compile the popular OpenCV library](https://docs.opencv.org/3.4/d4/da1/tutorial_js_setup.html) to the web through Emscripten.

Lastly, WebAssembly offers advanced performance primitives such as [SIMD instructions](https://emscripten.org/docs/porting/simd.html) which dramatically improve your web app performance. For example, [Halide](https://halide-lang.org/) is essential to Adobe's performance, and here SIMD provides a 3–4× speedup on average and in some cases a 80–160× speedup.

## WebAssembly debugging

No large project can be successfully completed without the appropriate tools for the job, and it's for this reason that the Chrome team developed full featured WebAssembly debugging support. It provides support for stepping through the source code, setting breakpoints and pausing on exceptions, variable inspection with rich type support, and even basic support for evaluation in the DevTools console!

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/ZwSsG07jcIvFZOdid5yd.png", alt="WebAssembly debugging in DevTools showing breakpoints in the code so it can be stepped through.", width="800", height="325" %}

Be sure to check out the [authoritative guide on how to utilize WebAssembly Debugging](https://developer.chrome.com/blog/wasm-debugging-2020/).

## High performance storage

Given how large Photoshop documents can be, a critical need for Photoshop is the ability to dynamically move data from on-disk to in-memory as the user pans around. On other platforms, this is accomplished usually through memory mapping via [`mmap`](https://en.wikipedia.org/wiki/Mmap), but this hasn't been performantly possible on the web—that is until origin private file system access handles were developed and implemented as an origin trial! You can read how to leverage this new API [in the documentation](/file-system-access/#accessing-files-optimized-for-performance-from-the-origin-private-file-system).

## P3 color space for canvas

Historically, colors on the web have been specified in the [sRGB](https://en.wikipedia.org/wiki/SRGB) color space, which is a standard from the mid-nineties, based on the capabilities of cathode-ray tube monitors. Cameras and monitors have come a long way in the intervening quarter-century, and many larger and more capable color spaces have been standardized. One of the most popular modern color spaces is [Display P3](https://en.wikipedia.org/wiki/DCI-P3). Photoshop uses a [Display P3 Canvas](https://github.com/WICG/canvas-color-space/blob/main/CanvasColorSpaceProposal.md) to display images more accurately in the browser. In particular, images with bright whites, bright colors, and details in shadows will display as best as possible on modern displays that support Display P3 data.
The Display P3 Canvas API is being further built upon to enable [high dynamic range](https://github.com/w3c/ColorWeb-CG/blob/master/hdr_html_canvas_element.md) displays.

## Web Components and Lit

Photoshop is a famously large and feature-rich application, with hundreds of UI elements supporting dozens of workflows. The app is built by multiple teams using a variety of tools and development practices, but its disparate parts need to come together into a cohesive, high-performing whole.

To meet this challenge, Adobe turned to [Web Components](https://developer.mozilla.org/docs/Web/Web_Components) and the [Lit library](https://lit.dev). Photoshop's UI elements come from Adobe's [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) library, a lightweight, performant implementation of the Adobe design system that works with any framework, or no framework at all.

What's more, the entire Photoshop app is built using Lit-based Web Components. Leaning on the browser's built-in component model and Shadow DOM encapsulation, the team found it easy to cleanly integrate a few "islands" of React code provided by other Adobe teams.

## Service worker caching with Workbox

[Service workers](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) act as a programmable local proxy, intercepting network requests and responding with data from the network, long-lived caches, or a mixture of both.

As part of the [V8](https://v8.dev/) team's efforts to improve performance, the first time a service worker responds with a cached WebAssembly response, Chrome generates and stores an optimized version of the code—even for multi-megabyte WebAssembly scripts, which are common in the Photoshop codebase. A similar precompilation takes place when [JavaScript is cached](https://v8.dev/blog/code-caching-for-devs#use-service-worker-caches) by a service worker during its [`install` step](/service-worker-lifecycle/#install). In both cases, Chrome is able to load and execute the optimized versions of cached scripts with minimal runtime overhead.

Photoshop on the web takes advantage of this by deploying a service worker that precaches many of its JavaScript and WebAssembly scripts. Because the URLs for these scripts are generated at build time, and because the logic of keeping caches up to date can be complex, they turned to a set of libraries maintained by Google called [Workbox](https://developer.chrome.com/docs/workbox/) to generate their service worker as part of their build process.

A Workbox-based service worker along with the V8 engine's script caching led to measurable performance improvements. The specific numbers vary based on the device executing the code, but the team estimates these optimizations decreased the time spent on code initialization by 75%.

## What's next for Adobe on the web

The launch of the Photoshop beta is just the beginning, and we've got several performance and feature improvements already underway as Photoshop tracks towards their full launch after this beta. Adobe isn't stopping with Photoshop and plans to aggressively expand [Creative Cloud](https://www.adobe.com/creativecloud.html) to the web, making it a primary platform for both creative content creation and collaboration. This will enable millions of first-time creators to tell their story and benefit from innovative workflows on the web.

As Adobe continues to push the boundaries of what's possible, the Chrome team will continue our collaboration to drive the web forward for Adobe and the vibrant web developer ecosystem in general. As other browsers also catch up on these modern browser capabilities, we're excited to see Adobe make their products available there as well. Stay tuned for future updates as we continue to push the web forward!

You can learn more about accessing Photoshop on the web (beta) in the [Adobe Help Center](https://helpx.adobe.com/photoshop/using/photoshop-web-faq.html).
