---
layout: post
title: 创建离线后备页面
authors:
  - thomassteiner
  - petelepage
date: 2020-09-24
updated: 2021-05-19
description: 了解如何为您的应用创建简单的离线体验。
tags:
  - progressive-web-apps
---

Google Assistant 应用、Slack 应用、Zoom 应用以及您手机或计算机上几乎所有其他特定于平台的应用有什么共同之处？对，它们的共同之处就是总能至少给您带来*一些东西*。即使没有网络连接，您仍然可以打开 Assistant 应用，或进入 Slack，或启动 Zoom。您可能不会得到任何特别有意义的东西，甚至无法实现您想要实现的目标，但至少您得到了*一些东西*并且应用处于掌控之中。

<figure role="group" aria-labelledby="fig-apps-wrapper"></figure>

  <figure role="group" aria-labelledby="fig-assistant" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gr49coayhLfP1UVJ2EeR.jpg", alt="离线 Google Assistant 移动应用。", width="621", height="1344" %}<figcaption id="fig-assistant"> Google Assistant。</figcaption></figure>

  <figure role="group" aria-labelledby="fig-slack" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D4P00CQ15IE0plUEY3di.jpg", alt="离线 Slack 移动应用。", width="621", height="1344" %}<figcaption id="fig-slack">松弛。</figcaption></figure>

  <figure role="group" aria-labelledby="fig-zoom" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gw1LQG4JNYUDxQ2NOJHC.jpg", alt="离线 Zoom 移动应用。", width="621", height="1344" %}<figcaption id="fig-zoom">飞涨。</figcaption></figure>

  <figcaption id="fig-apps-wrapper">使用特定于平台的应用，即使您没有网络连接，也不会一无所获。</figcaption>



相比之下，在 Web 上，传统上您离线时什么也得不到。Chrome 为您提供[离线恐龙游戏](https://www.blog.google/products/chrome/chrome-dino/)，仅此而已。

<figure role="group" aria-labelledby="fig-offline-wrapper"></figure>

  <figure role="group" aria-labelledby="fig-chrome-ios" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yEf0wzIQ1hIf85xtUwse.png", alt="显示离线恐龙游戏的 Google Chrome 移动应用。", width="800", height="1731" %}<figcaption id="fig-chrome-ios">适用于 iOS 的 Google Chrome。</figcaption></figure>

  <figure role="group" aria-labelledby="fig-chrome" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vrqfLVP132LcydIWcYbh.png", alt="显示离线恐龙游戏的 Google Chrome 桌面应用。", width="800", height="607" %}<figcaption id="fig-chrome">适用于 macOS 的 Google Chrome。</figcaption></figure>

  <figcaption id="fig-offline-wrapper">在 Web 上，当您没有网络连接时，默认情况下您什么也得不到。</figcaption>



## 具有自定义 Service Worker 的离线后备页面

但是，情况不应就这样。借助 [Service Workers 和 Cache Storage API](/service-workers-cache-storage/) ，您可以为用户提供定制的离线体验。这可以是一个含有用户当前离线信息的简单品牌页面，但也可以是一个更有创意的解决方案，例如著名的 [trivago 离线迷宫游戏](https://www.trivago.com/offline)，具有手动**重新连接**按钮和自动重新连接尝试倒数。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0yvun9EV5758sRO9wSgY.png", alt="具有 trivago 离线迷宫游戏的 trivago 离线页面。", width="800", height="616" %}<figcaption> trivago 离线迷宫。</figcaption></figure>

### 注册 Service Worker

实现这一点的方法是通过 Service Worker。您可以像下面的代码示例一样从主页注册 Service Worker。通常，您会在应用加载后执行此操作。

```js
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
});
```

### Service Worker 代码

实际的 Service Worker 文件的内容乍一看似乎有点复杂，但下面示例中的注释应该会让事情变得更清楚。核心思想是预先缓存一个名为 `offline.html` 的文件，该文件仅在*失败的*导航请求上提供服务，并让浏览器处理所有其他情况：

```js
/*
Copyright 2015, 2019, 2020, 2021 Google LLC. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
// This variable is intentionally declared and unused.
// Add a comment for your linter if you want:
// eslint-disable-next-line no-unused-vars
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
// Customize this with a different URL if needed.
const OFFLINE_URL = "offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Setting {cache: 'reload'} in the new request will ensure that the
      // response isn't fulfilled from the HTTP cache; i.e., it will be from
      // the network.
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // First, try to use the navigation preload response if it's supported.
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // Always try the network first.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // catch is only triggered if an exception is thrown, which is likely
          // due to a network error.
          // If fetch() returns a valid HTTP response with a response code in
          // the 4xx or 5xx range, the catch() will NOT be called.
          console.log("Fetch failed; returning offline page instead.", error);

          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }

  // If our if() condition is false, then this fetch handler won't intercept the
  // request. If there are any other fetch handlers registered, they will get a
  // chance to call event.respondWith(). If no fetch handlers call
  // event.respondWith(), the request will be handled by the browser as if there
  // were no service worker involvement.
});
```

### 离线后备页面

在 `offline.html` 文件中，您可以发挥创意并根据需求进行调整并添加您的品牌。下面的示例显示了可能的最低限度。它演示了基于按钮按下的手动重新加载以及基于 [`online` 事件](https://developer.mozilla.org/docs/Web/API/Window/online_event)和定期服务器轮询的自动重新加载。

{% Aside 'gotchas' %}您需要缓存离线页面所需的所有资源。处理此问题的一种方法是内联所有内容，使得离线页面实现自包含。这就是我在下面的示例中所做的。{% endAside %}

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>You are offline</title>

    <!-- Inline the page's stylesheet. -->
    <style>
      body {
        font-family: helvetica, arial, sans-serif;
        margin: 2em;
      }

      h1 {
        font-style: italic;
        color: #373fff;
      }

      p {
        margin-block: 1rem;
      }

      button {
        display: block;
      }
    </style>
  </head>
  <body>
    <h1>You are offline</h1>

    <p>Click the button below to try reloading.</p>
    <button type="button">⤾ Reload</button>

    <!-- Inline the page's JavaScript file. -->
    <script>
      // Manual reload feature.
      document.querySelector("button").addEventListener("click", () => {
        window.location.reload();
      });

      // Listen to changes in the network state, reload when online.
      // This handles the case when the device is completely offline.
      window.addEventListener('online', () => {
        window.location.reload();
      });

      // Check if the server is responding and reload the page if it is.
      // This handles the case when the device is online, but the server
      // is offline or misbehaving.
      async function checkNetworkAndReload() {
        try {
          const response = await fetch('.');
          // Verify we get a valid response from the server
          if (response.status >= 200 && response.status < 500) {
            window.location.reload();
            return;
          }
        } catch {
          // Unable to connect to the server, ignore.
        }
        window.setTimeout(checkNetworkAndReload, 2500);
      }

      checkNetworkAndReload();
    </script>
  </body>
</html>
```

## 演示

您可以在下面嵌入的[演示](https://offline-fallback-demo.glitch.me/index.html)中看到离线后备页面的运行情况。如果您有兴趣，可以探索 Glitch 上的[源代码。](https://glitch.com/edit/#!/offline-fallback-demo)

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/offline-fallback-demo?path=offline.html&amp;previewSize=100" title="offline-fallback-demo on Glitch" allow="geolocation; microphone; camera; midi; vr; encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### 关于使您的应用程序可安装的便笺

现在您的网站有一个离线后备页面，您可能想知道接下来的步骤。为了让您的应用程序安装，您需要添加一个 [Web 应用程序清单](/add-manifest/)或者准备一个[安装策略](/define-install-strategy/)。

### 关于使用 Workbox.js 提供离线后备页面的便笺

您可能听说过 [Workbox.js](https://developer.chrome.com/docs/workbox/)。Workbox.js 是一组 JavaScript 库，用于向 Web 应用添加离线支持。如果您希望自己编写较少的 Service Worker 代码，则可以仅将 Workbox.js 用于[离线页面](https://developer.chrome.com/docs/workbox/managing-fallback-responses/#offline-page-only)。

接下来，了解针对您的应用[如何定义安装策略](/define-install-strategy/)。
