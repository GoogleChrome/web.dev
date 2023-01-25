---
layout: post
title: Crie uma página substituta off-line
authors:
  - thomassteiner
  - petelepage
date: 2020-09-24
updated: 2021-05-19
description: Aprenda a criar uma experiência off-line simples para seu aplicativo.
tags:
  - progressive-web-apps
---

O que os apps Google Assistant, Slack, Zoom e quase todos os outros apps específicos de plataforma em seu telefone ou computador têm em comum? Certo, eles sempre dão pelo menos *alguma coisa*. Mesmo quando você não tem uma conexão de rede, ainda pode abrir o app Assistant, entrar no Slack ou iniciar o Zoom. Você pode não conseguir nada particularmente significativo ou até não conseguir obter o que queria, mas pelo menos obtém *algo* e o aplicativo está no controle.

<figure role="group" aria-labelledby="fig-apps-wrapper"></figure>

  <figure role="group" aria-labelledby="fig-assistant" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gr49coayhLfP1UVJ2EeR.jpg", alt="Aplicativo Google Assistant para celular off-line.", width="621", height="1344" %}<figcaption id="fig-assistant"> Google Assistant.</figcaption></figure>

  <figure role="group" aria-labelledby="fig-slack" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D4P00CQ15IE0plUEY3di.jpg", alt="App móvel Slack off-line.", width="621", height="1344" %}<figcaption id="fig-slack"> Slack.</figcaption></figure>

  <figure role="group" aria-labelledby="fig-zoom" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gw1LQG4JNYUDxQ2NOJHC.jpg", alt="Aplicativo móvel Zoom off-line.", width="621", height="1344" %}<figcaption id="fig-zoom"> Zoom. </figcaption></figure>

  <figcaption id="fig-apps-wrapper">Com aplicativos específicos de plataforma, mesmo sem ter conexão de rede, você nunca recebe nada.</figcaption>



Por outro lado, na web, via de regra você não obtém nada quando está off-line. O Chrome oferece o [jogo do dinossauro off-line](https://www.blog.google/products/chrome/chrome-dino/), mas é só isso.

<figure role="group" aria-labelledby="fig-offline-wrapper"></figure>

  <figure role="group" aria-labelledby="fig-chrome-ios" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yEf0wzIQ1hIf85xtUwse.png", alt="Aplicativo Google Chrome para celular mostrando o jogo do dinossauro  off-line.", width="800", height="1731" %}<figcaption id="fig-chrome-ios"> Google Chrome para iOS. </figcaption></figure>

  <figure role="group" aria-labelledby="fig-chrome" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vrqfLVP132LcydIWcYbh.png", alt="Aplicativo Google Chrome para desktop mostrando o jogo do dinossauro off-line.", width="800", height="607" %}<figcaption id="fig-chrome"> Google Chrome para macOS. </figcaption></figure>

  <figcaption id="fig-offline-wrapper">Na web, sem ter uma conexão de rede, por padrão, você não recebe nada.</figcaption>



## Uma página alternativa off-line com um trabalho de serviço personalizado

Mas não tem que ser assim. Graças aos [trabalhos de serviço e à API Cache Storage](/service-workers-cache-storage/), você pode fornecer uma experiência off-line personalizada para seus usuários. Pode ser uma página de marca simples com a informação de que o usuário está off-line no momento, mas também pode ser uma solução mais criativa, como, por exemplo, o famoso [jogo do labirinto off-line do trivago](https://www.trivago.com/offline), com um **botão manual de reconexão** e uma contagem regressiva para a tentativa de reconexão automática.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0yvun9EV5758sRO9wSgY.png", alt="A página off-line do trivago com o seu labirinto off-line.", width="800", height="616" %} <figcaption> O labirinto off-line do trivago. </figcaption></figure>

### Registrando o trabalho de serviço

A maneira de fazer isso acontecer é por meio de um trabalho de serviço. Você pode registrar um trabalho de serviço na sua página principal, como no exemplo de código abaixo. Normalmente isso é feito depois que o aplicativo é carregado.

```js
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
});
```

### O código do trabalho de serviço

O conteúdo do arquivo do trabalho de serviço real pode parecer um pouco complicado à primeira vista, mas os comentários no exemplo abaixo devem esclarecer as coisas. A ideia central é pré-armazenar em cache um arquivo denominado `offline.html` que só é veiculado em *solicitações de navegação com falha* e permitir que o navegador cuide de todos os outros casos:

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

### A página de fallback off-line

O arquivo `offline.html` é onde você pode ser criativo, adaptá-lo às suas necessidades e adicionar sua marca. O exemplo abaixo mostra o mínimo possível. Demonstra a recarga manual ao pressionar um botão, bem como a recarga automática com base no [evento `online`](https://developer.mozilla.org/docs/Web/API/Window/online_event) e na pesquisa regular do servidor.

{% Aside 'gotchas' %} Você precisa armazenar em cache todos os recursos exigidos por sua página off-line. Uma maneira de lidar com isso é embutir tudo, de forma que a página off-line seja independente. Isso é o que eu faço no exemplo abaixo. {% endAside %}

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

## Demonstração

Você pode ver a página de fallback off-line em ação na [demonstração](https://offline-fallback-demo.glitch.me/index.html) incorporada abaixo. Se tiver interesse, explore o [código-fonte](https://glitch.com/edit/#!/offline-fallback-demo) no Glitch.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/offline-fallback-demo?path=offline.html&amp;previewSize=100" title="offline-fallback-demo on Glitch" allow="geolocation; microphone; camera; midi; vr; encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### Observação na lateral sobre como tornar seu aplicativo instalável

Agora que seu site tem uma página de fallback off-line, você pode estar se perguntando sobre as próximas etapas. Para tornar seu aplicativo instalável, você precisa adicionar um [manifesto de aplicativo da web](/add-manifest/) e, opcionalmente, criar uma [estratégia de instalação](/define-install-strategy/).

### Observação na lateral sobre a exibição de uma página substituta off-line com o Workbox.js

Você deve ter ouvido falar do [Workbox.js](https://developer.chrome.com/docs/workbox/). Workbox.js é um conjunto de bibliotecas de JavaScript para adicionar suporte off-line a aplicativos da web. Se você preferir escrever menos código de trabalho de serviço, pode usar a receita do Workbox.js apenas para uma [página off-line](https://developer.chrome.com/docs/workbox/managing-fallback-responses/#offline-page-only).

A seguir, aprenda [a definir uma estratégia de instalação](/define-install-strategy/) para seu aplicativo.
