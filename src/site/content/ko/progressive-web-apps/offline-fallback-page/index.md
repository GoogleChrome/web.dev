---
layout: post
title: 오프라인 대체 페이지 만들기
authors:
  - thomassteiner
  - petelepage
date: 2020-09-24
updated: 2021-05-19
description: 앱을 위한 간단한 오프라인 환경을 만드는 방법을 알아보세요.
tags:
  - progressive-web-apps
---

Google Assistant 앱, Slack 앱, Zoom 앱 및 휴대전화나 컴퓨터에 있는 거의 모든 플랫폼별 앱의 공통점은 무엇입니까? 맞습니다. 그들은 항상 적어도 당신에게 *무언가*를 줍니다. 네트워크에 연결되어 있지 않아도 어시스턴트 앱을 열거나 Slack에 들어가거나 Zoom을 실행할 수 있습니다. 특히 의미 있는 것을 얻지 못하거나 달성하고자 하는 것을 달성하지 못할 수도 있지만 적어도 *무언가*를 얻고 앱이 제어할 수 있습니다.

<figure role="group" aria-labelledby="fig-apps-wrapper"></figure>

  <figure role="group" aria-labelledby="fig-assistant" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gr49coayhLfP1UVJ2EeR.jpg", alt="오프라인 시 Google Assistant 모바일 앱.", width="621", height="1344" %}<figcaption id="fig-assistant"> Google Assistant.</figcaption></figure>

  <figure role="group" aria-labelledby="fig-slack" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D4P00CQ15IE0plUEY3di.jpg", alt="오프라인 시 Slack 모바일 앱.", width="621", height="1344" %}<figcaption id="fig-slack"> Slack.</figcaption></figure>

  <figure role="group" aria-labelledby="fig-zoom" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gw1LQG4JNYUDxQ2NOJHC.jpg", alt="오프라인 시 Zoom 모바일 앱.", width="621", height="1344" %}<figcaption id="fig-zoom"> Zoom.</figcaption></figure>

  <figcaption id="fig-apps-wrapper">플랫폼별 앱을 사용하면 네트워크에 연결되어 있지 않아도 아무것도 얻을 수 없습니다.</figcaption>



대조적으로, 웹에서는 전통적으로 오프라인일 때 아무것도 얻지 못합니다. Chrome은 [오프라인 공룡 게임](https://www.blog.google/products/chrome/chrome-dino/)을 제공하지만 그게 전부입니다.

<figure role="group" aria-labelledby="fig-offline-wrapper"></figure>

  <figure role="group" aria-labelledby="fig-chrome-ios" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yEf0wzIQ1hIf85xtUwse.png", alt="오프라인 공룡 게임을 보여주는 Google Chrome모바일 앱.", width="800", height="1731" %}<figcaption id="fig-chrome-ios"> Google Chrome for iOS.</figcaption></figure>

  <figure role="group" aria-labelledby="fig-chrome" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vrqfLVP132LcydIWcYbh.png", alt="오프라인 공룡 게임을 보여주는 Google Chrome 데스크톱 앱.", width="800", height="607" %}<figcaption id="fig-chrome"> Google Chrome for macOS.</figcaption></figure>

  <figcaption id="fig-offline-wrapper">웹에서 네트워크 연결이 없으면 기본적으로 아무 것도 얻지 못합니다.</figcaption>



## 커스텀 서비스 워커가 있는 오프라인 대체 페이지

하지만 반드시 그래야 하는 것은 아닙니다. [서비스 워커와 Cache Storage API](/service-workers-cache-storage/) 덕분에 사용자에게 맞춤형 오프라인 경험을 제공할 수 있습니다. 이것은 사용자가 현재 오프라인 상태라는 정보가 포함된 단순한 브랜드 페이지일 수 있지만, 예를 들어 수동 **재연결** 버튼과 자동 재연결 시도 카운트다운이 있는 유명한 [trivago 오프라인 미로 게임](https://www.trivago.com/offline)과 같은 보다 창의적인 솔루션일 수도 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0yvun9EV5758sRO9wSgY.png", alt="trivago 오프라인 미로가 있는 trivago 오프라인 페이지.", width="800", height="616" %}<figcaption> trivago 오프라인 미로.</figcaption></figure>

### 서비스 워커 등록

이를 가능하게 하는 방법은 서비스 워커를 통하는 것입니다. 아래 코드 샘플과 같이 메인 페이지에서 서비스 워커를 등록할 수 있습니다. 일반적으로 앱이 로드되면 이 작업을 수행합니다.

```js
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
});
```

### 서비스 워커 코드

실제 서비스 워커 파일의 내용은 언뜻 보기에는 다소 복잡해 보일 수 있지만 아래 샘플의 주석을 보면 문제가 해결될 것입니다. *핵심 아이디어는 실패한* 탐색 요청에만 제공되는 `offline.html`이라는 파일을 미리 캐시하고 브라우저가 다른 모든 경우를 처리하도록 하는 것입니다.

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

### 오프라인 폴백 페이지

`offline.html` 파일은 창의력을 발휘하고 필요에 맞게 조정하고 브랜딩을 추가할 수 있는 곳입니다. 아래의 예는 가능한 최소한의 것을 보여줍니다. [`online` 이벤트](https://developer.mozilla.org/docs/Web/API/Window/online_event) 및 일반 서버 폴링을 기반으로 한 자동 재로드를 모두 보여줍니다.

{% Aside 'gotchas' %} 오프라인 페이지에 필요한 모든 리소스를 캐시해야 합니다. 이를 처리하는 한 가지 방법은 모든 것을 인라인하는 것이므로 오프라인 페이지는 독립적입니다. 이것이 내가 아래의 예에서 하는 일입니다. {% endAside %}

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

## 데모

아래에 포함된 [데모](https://offline-fallback-demo.glitch.me/index.html)에서 오프라인 폴백 페이지가 작동하는 것을 볼 수 있습니다. 관심이 있는 경우 Glitch에서 [소스 코드](https://glitch.com/edit/#!/offline-fallback-demo)를 탐색할 수 있습니다.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/offline-fallback-demo?path=offline.html&amp;previewSize=100" title="offline-fallback-demo on Glitch" allow="geolocation; microphone; camera; midi; vr; encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### 앱을 설치 가능하게 만드는 방법에 대한 참고 사항

사이트에 오프라인 폴백 페이지가 있으므로 다음 단계에 대해 궁금해할 수 있습니다. 앱을 설치 가능하게 만들려면 [웹 앱 매니페스트](/add-manifest/)를 추가하고 선택적으로 [설치 전략](/define-install-strategy/)을 제시해야 합니다.

### Workbox.js로 오프라인 폴백 페이지 제공에 대한 참고 사항

[Workbox.js](https://developer.chrome.com/docs/workbox/)에 대해 들어본 적이 있을 것입니다. Workbox.js는 웹 앱에 오프라인 지원을 추가하기 위한 JavaScript 라이브러리 세트입니다. 더 적은 서비스 워커 코드를 직접 작성하려는 경우 [오프라인 페이지](https://developer.chrome.com/docs/workbox/managing-fallback-responses/#offline-page-only)에만 Workbox.js 레시피를 사용할 수 있습니다.

다음으로 [앱의 설치 전략을 정의하는 방법](/define-install-strategy/)을 알아보세요.
