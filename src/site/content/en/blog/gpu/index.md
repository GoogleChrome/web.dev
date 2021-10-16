---
title: Access modern GPU features with WebGPU
subhead: |
  WebGPU enables high-performance 3D graphics and data-parallel computation on
  the web.
authors:
  - beaufortfrancois
  - cwallez
date: 2021-08-26
updated: 2021-09-06
hero: image/vvhSqZboQoZZN9wBvoXq72wzGAf1/SN6GIsxmcINXJZKszOTr.jpeg
thumbnail: image/vvhSqZboQoZZN9wBvoXq72wzGAf1/SN6GIsxmcINXJZKszOTr.jpeg
description: |
  WebGPU enables high-performance 3D graphics and data-parallel computation on
  the web.
origin_trial:
    url: https://developer.chrome.com/origintrials/#/view_trial/118219490218475521
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - games
feedback:
  - api
stack_overflow_tag: webgpu
---

## What is WebGPU? {: #what }

[WebGPU] is a new web API that exposes modern computer graphics capabilities,
specifically Direct3D 12, Metal, and Vulkan, for performing rendering and
computation operations on a graphics processing unit (GPU).

<figure class="w-figure">
  {% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/WHoJmX2IU7roV4iabH6M.png", alt="Architecture diagram showing WebGPUs connection between OS APIs and Direct3D 12, Metal, and Vulkan.", width="800", height="313" %}
  <figcaption class="w-figcaption">WebGPU architecture diagram</figcaption>
</figure>

This goal is similar to the [WebGL] family of APIs, but WebGPU enables access to
more advanced features of GPUs. Whereas WebGL is mostly for drawing images but
can be repurposed with great effort for other kinds of computations, WebGPU
provides first-class support for performing general computations on the GPU.

After four years of development in the [W3C's "GPU for the Web" Community
Group], WebGPU is now ready for developers to try in Chrome and give feedback on
the API and the shading language.

{% Blockquote 'Mr.doob, Creator of Three.js' %}
"After a decade of WebGL bringing 3D graphics to the web and enabling all sorts
of new experiences, it's now time to upgrade the stack and help web developers
take full advantage of modern graphics cards. WebGPU arrives just in time!"
{% endBlockquote %}

{% Blockquote 'David Catuhe, Creator of Babylon.js' %}
WebGPU gets us closer to the metal and it also unlocks the power of compute
shader for Web developers. New 3D experiences can be built today on [Babylon.js
Playground].
{% endBlockquote %}

<figure class="w-figure">
  {% Video src="video/vvhSqZboQoZZN9wBvoXq72wzGAf1/Xb7LvsJ5e8efTssp94c6.mov", autoplay=true, muted=true, playsinline=true, loop=true %}
  <figcaption class="w-figcaption">
    A Babylon.js demo of a rough sea being simulated using WebGPU's compute shader capability.
  </figcaption>
</figure>

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [Complete][explainer]    |
| 2. Create initial draft of specification | [In progress][spec]      |
| 3. Gather feedback & iterate on design   | [In progress](#feedback) |
| 4. **Origin trial**                      | **[In progress][ot]**    |
| 5. Launch                                | Not started              |

</div>

## How to use WebGPU {: #use }

### Enabling via about://flags

To experiment with WebGPU locally, without an origin trial token, enable the
`#enable-unsafe-webgpu` flag in `about://flags`.

### Enabling support during the origin trial phase

Starting in Chrome&nbsp;94, WebGPU is available as an origin trial in Chrome. The
origin trial is expected to end in Chrome&nbsp;97 (Jan 26, 2022).

{% Aside 'caution' %}
Server-side A/B testing will be used to progressively rollout WebGPU in Chrome.
{% endAside %}

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Feature detection {: #feature-detection }

To check if WebGPU is supported, use:

```js
if ("gpu" in navigator) {
  // WebGPU is supported! 🎉
}
```

{% Aside 'caution' %}
The GPU adapter returned by `navigator.gpu.requestAdapter()` may be `null`.
{% endAside %}

### Get started {: #get-started }

WebGPU is a low-level API, like WebGL. It is very powerful, quite verbose, and
requires understanding key concepts before diving into it. That's why I'll link
to existing high-quality content in this article for you to get started with
WebGPU.

- [Get started with GPU Compute on the web]
- [A Taste of WebGPU in Firefox]
- [WebGPU for Metal Developers, Part One]
- [Learn what key data structures and types are needed to draw in WebGPU]
- [WebGPU Explainer]

## Browser support {: #browser-support }

WebGPU is available on select devices on Chrome OS, macOS, and Windows 10 in
Chrome&nbsp;94 with more devices being supported in the future. Linux
experimental support is available by running Chrome with
`--enable-features=Vulkan`. More support for more platforms will
follow.

The full list of known issues is available in the [Origin Trial Caveats document].

At the time of writing, WebGPU support is in progress in [Safari] and [Firefox].

## Platform support {: #platform-support }

As in WebGL's world, some libraries implement WebGPU as well:

- [Dawn] is a C++ implementation of WebGPU used in Chromium. It can be used to
  target WebGPU in C and C++ applications that can then be ported to
  [WebAssembly] using [Emscripten] and automatically take advantage of WebGPU in
  the browser.
- [Wgpu] is a Rust implementation of WebGPU used in Firefox. It is used by
  various GPU applications in the Rust ecosystem, for example [Veloren], a
  multiplayer voxel RPG.

## Demos {: #demos }

- [WebGPU Samples]
- [Metaballs rendered in WebGPU]
- [WebGPU Clustered Forward Shading]

## Security and privacy  {: #security-privacy }

To ensure a web page can only work with its own data, all the commands are
strictly validated before they reach the GPU. Check out the [Malicious use
considerations] section of the WebGPU spec to learn more about the security
tradeoffs regarding driver bugs for instance.

## Feedback {: #feedback }

The Chrome team wants to hear about your experiences with WebGPU.

### Tell us about the API design

Is there something about the API or the shading language that does not work like
you expected? Or are there missing methods or properties that you need to
implement your idea? Have a question or comment on the security model? File a
spec issue on the corresponding [GitHub repo], or add your thoughts to an
existing issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation
different from the spec? File a bug at [new.crbug.com](https://new.crbug.com).
Be sure to include as much detail as you can like the content of the internal
`about:gpu` page, simple instructions for reproducing, and enter `Blink>WebGPU`
in the **Components** box. [Glitch](https://glitch.com/) works great for sharing
quick and easy repros.

### Show support for WebGPU

Are you planning to use WebGPU? Your public support helps the Chrome team
prioritize features and show other browser vendors how critical it is to support
them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#WebGPU`](https://twitter.com/search?q=%23WebGPU&src=recent_search_click&f=live)
and let us know where and how you are using it. Ask a question on StackOverflow
with the hashtag [`#webgpu`](https://stackoverflow.com/questions/tagged/webgpu).

## Helpful links {: #helpful }

- [Public explainer][explainer]
- [WebGPU API Spec][spec]
- [WebGPU Shading Language (WGSL)][wgsl-spec]
- [Chromium tracking bug][cr-bug]
- [ChromeStatus.com entry][cr-status]
- Blink Component: [`Blink>WebGPU`][blink-component]
- [TAG Review](https://github.com/w3ctag/design-reviews/issues/626)
- [Intent to Experiment](https://groups.google.com/a/chromium.org/g/blink-dev/c/K4_egTNAvTs/m/ApS804L_AQAJ)
- [WebGPU's matrix channel][matrix]

## Acknowledgements {: #acknowledgements }

Hero image via [Maxime Rossignol](https://unsplash.com/@maxoor) on
[Unsplash](https://unsplash.com/photos/ukOCJ09jpgc).

[WebGPU]: https://gpuweb.github.io/gpuweb/
[WebGL]: https://developer.mozilla.org/docs/Web/API/WebGL_API
[W3C's "GPU for the Web" Community Group]: https://www.w3.org/community/gpu/
[Babylon.js Playground]: https://playground.babylonjs.com/#XCNL7Y
[Get started with GPU Compute on the web]: /gpu-compute/
[A Taste of WebGPU in Firefox]: https://hacks.mozilla.org/2020/04/experimental-webgpu-in-firefox/
[WebGPU for Metal Developers, Part One]: https://metalbyexample.com/webgpu-part-one/
[Learn what key data structures and types are needed to draw in WebGPU]: https://alain.xyz/blog/raw-webgpu
[WebGPU Explainer]: https://gpuweb.github.io/gpuweb/explainer/
[Origin Trial Caveats document]: https://hackmd.io/QcdsK_g7RVKRCIIBqgs5Hw
[Safari]: https://webkit.org/blog/9528/webgpu-and-wsl-in-safari/
[Firefox]: https://hacks.mozilla.org/2020/04/experimental-webgpu-in-firefox/
[Dawn]: https://dawn.googlesource.com/dawn
[WebAssembly]: https://developer.mozilla.org/docs/WebAssembly
[Emscripten]: https://emscripten.org/
[Wgpu]: https://sotrh.github.io/learn-wgpu/#what-is-wgpu
[Veloren]: https://veloren.net/devblog-125/
[WebGPU Samples]: https://austin-eng.com/webgpu-samples/
[Metaballs rendered in WebGPU]: https://toji.github.io/webgpu-metaballs/
[WebGPU Clustered Forward Shading]: https://toji.github.io/webgpu-clustered-shading/
[Malicious use considerations]: https://gpuweb.github.io/gpuweb/#malicious-use
[GitHub repo]: https://github.com/gpuweb/gpuweb/issues/
[spec]: https://gpuweb.github.io/gpuweb/
[wgsl-spec]: https://gpuweb.github.io/gpuweb/wgsl/
[issues]: https://github.com/gpuweb/gpuweb/issues
[explainer]: https://gpuweb.github.io/gpuweb/explainer/
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=1156646
[cr-status]: https://chromestatus.com/feature/6213121689518080
[blink-component]: https://chromestatus.com/features#component%3ABlink%3EWebGPU
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[ot]: https://developer.chrome.com/origintrials/#/view_trial/118219490218475521
[matrix]: https://matrix.to/#/#WebGPU:matrix.org
