---
title: New functionality for developers—brought to you by WebAssembly
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/UgDbKE3G0klQHevSBbQr.jpg
alt: Low angle photo of a library in Dublin, Ireland
subhead: |
  A showcase of tools now available on the web thanks to WebAssembly.
authors:
 - nattestad
date: 2023-04-03
description: |
  A showcase of tools now available on the web thanks to WebAssembly.
tags:
 - blog
 - webassembly
---

WebAssembly enables developers to bring new performant functionality to the web from other languages. Over the past few years developers have really taken advantage of the possibilities. This post showcases just a few of the shiny new tools that you can benefit from, thanks in part to WebAssembly.

## Tools and libraries you can use now

Without further ado, let's jump into the good stuff :D

### SQLite

This complete port of SQLite brings a lightweight, embedded, relational database management system into your hands. To learn more read this [blog post that showcases this incredible port and how to use it](https://developer.chrome.com/blog/sqlite-wasm-in-the-browser-backed-by-the-origin-private-file-system/).

### FFmpeg.wasm

FFmpeg is a free and open-source software project consisting of a suite of libraries and programs for handling video, audio, and other multimedia files and streams. You can find [a wasm compiled version here](https://ffmpegwasm.netlify.app/) ([github repo](https://github.com/ffmpegwasm/ffmpeg.wasm)) that lets you do all of this functionality directly in the browser.

### Universal Scene Descriptor (USD)

Universal Scene Description (USD) is a framework for 3D computer graphics data that focuses on collaboration, non-destructive editing, and enabling multiple views and opinions about graphics data. It's an industry standard supported by the likes of Pixar, Autodesk, Nvidia, and many more. It's still early days for their web support but [Autodesk already open sourced a web based USD viewer](https://www.keanw.com/2022/02/autodesk-open-sources-web-based-usd-viewing-implementation.html) which you can [see here](https://github.com/autodesk-forks/USD/tree/hdJavaScript).

### CanvasKit

[CanvasKit](https://skia.org/docs/user/modules/canvaskit/) is Skia, the rendering engine of Chrome and Android, compiled directly to WebAssembly. With it, you get simple JavaScript API access to practically all the power of the Skia rendering engine. The functionality includes complex rendering, text shaping, animation, inking, and more. Check out the [npm package](https://www.npmjs.com/package/canvaskit-wasm) and [quickstart guide](https://skia.org/docs/user/modules/quickstart/).

### TensorFlow.js

[TensorFlow.js](https://www.tensorflow.org/js) brings the power of TensorFlow directly into the browser with a simple JavaScript API. Under the hood, it optimizes models both across the GPU and CPU (including SIMD optimizations) to maximize performance. You can see the [getting started guide](https://www.tensorflow.org/js/tutorials) or look at [some of their demos directly](https://www.tensorflow.org/js/demos).

### OpenCV

OpenCV is an industry standard of programming functions mainly for real-time computer vision. There is an [easy-to-use npm package here](https://www.npmjs.com/package/opencv-wasm), and for Emscripten users there are also [detailed instructions for doing a full build](https://docs.opencv.org/4.x/d4/da1/tutorial_js_setup.html). For a look at how SIMD and threads are improving performance of these workloads, you can watch [this section of the Modern WebAssembly Chrome Dev Summit talk](https://youtu.be/kZrl91SPSpc?t=688).

### Cocos

[Cocos](https://www.cocos.com/en) is a powerful and popular game engine that enables developers to build games with cross platform support and this now includes the web. It joins the long list of game engines that enable web export through wasm. To get started, jump into the Cocos editor and follow [these instructions](https://docs.cocos.com/creator/2.3/manual/en/publish/publish-web.html). 

## Conclusion

In addition to these specific examples, there is much to be excited about in terms of [WebAssembly's potential to change the pace of new web functionality](https://docs.google.com/document/d/1zxd16LkkjnP5uLCN6p1nKCHoPDC7dcpsorrlBiPOROk/edit?resourcekey=0-qjEEvdLPu85cCVqiI9Ef6g#bookmark=id.3kxce262j7ed). Chrome has even set up [the Advanced Web Apps Fund](https://developer.chrome.com/blog/advanced-web-apps-fund/) that can help developers fund their work to advance the web functionality available to all developers!

_Hero image from [Pexels](https://www.pexels.com/photo/low-angle-photography-of-library-1296000/), by [Ann Marie Kennon](https://www.pexels.com/@ann-marie-kennon-547933/)._
