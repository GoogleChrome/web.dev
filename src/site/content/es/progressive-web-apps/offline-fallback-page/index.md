---
layout: post
title: Crear una página de fallback sin conexión
authors:
  - thomassteiner
  - petelepage
date: 2020-09-24
updated: 2021-05-19
description: Aprende a crear una experiencia sin conexión simple para tu aplicación.
tags:
  - progressive-web-apps
---

¿Qué tienen en común la aplicación Asistente de Google, la aplicación de Slack, la aplicación de Zoom y casi cualquier otra aplicación específica de plataforma en su teléfono o computadora? Exacto, siempre al menos te dan *algo*. Incluso cuando no tengas una conexión de red, aún puedes abrir la aplicación Asistente, ingresar a Slack o iniciar en Zoom. Es posible que no obtengas nada particularmente significativo o incluso no puedas lograr lo que querías lograr, pero al menos obtienes *algo* y la aplicación tiene el control.

<figure role="group" aria-labelledby="fig-apps-wrapper"></figure>

  <figure role="group" aria-labelledby="fig-assistant" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gr49coayhLfP1UVJ2EeR.jpg", alt="Aplicación móvil Asistente de Google sin conexión", width="621", height="1344" %} <figcaption id="fig-assistant"> Asistente de Google.</figcaption></figure>

  <figure role="group" aria-labelledby="fig-slack" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D4P00CQ15IE0plUEY3di.jpg", alt="Aplicación de Slack móvil sin conexión", width="621", height="1344" %} <figcaption id="fig-slack"> Slack. </figcaption></figure>

  <figure role="group" aria-labelledby="fig-zoom" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gw1LQG4JNYUDxQ2NOJHC.jpg", alt="Aplicación móvil de Zoom sin conexión", width = "621", height = "1344"%}<figcaption id="fig-zoom"> Zoom.</figcaption></figure>

  <figcaption id="fig-apps-wrapper">Con aplicaciones específicas de plataforma, incluso cuando no tienes una conexión de red, nunca obtendrás nada.</figcaption>



Por el contrario, en la Web, tradicionalmente no obtienes nada cuando estás desconectado. Chrome te ofrece el [juego de dinosaurios sin conexión](https://www.blog.google/products/chrome/chrome-dino/), pero eso es todo.

<figure role="group" aria-labelledby="fig-offline-wrapper"></figure>

  <figure role="group" aria-labelledby="fig-chrome-ios" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yEf0wzIQ1hIf85xtUwse.png", alt="Aplicación móvil de Google Chrome que muestra el juego de dinosaurios sin conexión.", width="800", height="1731" %} <figcaption id="fig-chrome-ios"> Google Chrome para iOS.</figcaption></figure>

  <figure role="group" aria-labelledby="fig-chrome" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vrqfLVP132LcydIWcYbh.png", alt="Aplicación de escritorio de Google Chrome que muestra el juego de dinosaurios sin conexión", width="800", height="607" %} <figcaption id="fig-chrome"> Google Chrome para macOS.</figcaption></figure>

  <figcaption id="fig-offline-wrapper">En la Web, cuando no tienes una conexión de red, de forma predeterminada, no obtienes nada.</figcaption>



## Una página fallback sin conexión con un service worker personalizado

Sin embargo, no tiene por qué ser así. Gracias a [los service workers y la API de Cache Storage (almacenamiento en caché)](/service-workers-cache-storage/), puedes proporcionar una experiencia fuera de línea personalizada para tus usuarios. Esta puede ser una simple página con tu marca con la información de que el usuario está actualmente sin conexión, pero también puede ser una solución más creativa, como por ejemplo, el famoso [juego de laberintos sin conexión de trivago](https://www.trivago.com/offline) con un botón de **reconexión** manual y un intento de reconexión automática usando una cuenta regresiva.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0yvun9EV5758sRO9wSgY.png", alt="La página sin conexión de Trivago con el laberinto sin conexión de Trivago.", width="800", height="616" %} <figcaption> El laberinto sin conexión de Trivago.</figcaption></figure>

### Registrar al service worker

Para poder hacer que esto suceda es a través de un service worker. Puedes registrar un service worker desde tu página principal como en el ejemplo de código a continuación. Por lo general, haces esto una vez que se haya cargado la aplicación.

```js
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
});
```

### El código del service worker

El contenido del archivo del service worker real puede parecer un poco complicado a primera vista, pero los comentarios en el ejemplo siguiente deberían aclarar las cosas. La idea central es hacer un pre-caché de un archivo llamado `offline.html` que se sirve sólo se presentan en las solicitudes de navegación *en su defecto*, y para permitir que el navegador maneja todos los demás casos:

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

// Al incrementar el  OFFLINE_VERSION obligará a lanzar el evento de instalación y
// los caché anteriores serán actualizados desde la red.
// Esta variable está declarada intencionalmente y no se usa.
// Agrega un comentario para tu linter si lo deseas:
// eslint-disable-next-line no-unused-vars
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
// Modifica esto con una diferente URL si es necesario.
const OFFLINE_URL = "offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Al definir {cache: 'reload'} en la nueva consulta asegurara que la
      // respuesta no sea desde el caché de HTTP; i.e., esta será
      // de la red.
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );
  // Obliga al service worker que espera a que se convierta en uno activo.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Permite la navegación precargada si tiene compatibilidad
      // Mira https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  // Le dice al service worker activo que tome el control inmediato de la página.
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Solo queremos llamar al event.respondWith() si es una solicitud de navegación
  // para una página HTML.
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Primero, utiliza una respuesta de precarga de navegación.
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // Siempre usa la red primero.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // El catch solo se dispara cuando se obtiene una excepción
          // gracias a un error en la red.
          // Si fetch() regresa una respuesta HTTP valida con un codigo de respuesta en el
          // rango de 4xx o 5xx, el catch() no se llamará
          console.log("Fetch failed; returning offline page instead.", error);

          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }

  // si nuestra condición de if() es falso, el controlador de fetch no atrapará la
  // solicitud. Si hay más controladores de fetch registrados, ellos tendrán la
  // oportunidad de llamar a event.respondWith(). De lo contrario, si no hay, no se llamará a
  // event.respondWith(), la solicitud será controlada por el buscador como si no
  // los service worker no se hubieran involucrado.
});
```

### La página de respaldo sin conexión

El archivo de `offline.html` es donde puedes ser creativo y adaptarlo a tus necesidades y agregar tu marca. El siguiente ejemplo muestra lo mínimo de lo que es posible. Demuestra tanto la recarga manual basada en la pulsación de un botón como la recarga automática basada en el [evento en `online`](https://developer.mozilla.org/docs/Web/API/Window/online_event) y el sondeo regular del servidor.

{% Aside 'gotchas' %} Debes de almacenar en caché todos los recursos que requiere tu página sin conexión. Una forma de lidiar con esto es alinear todo, de modo que la página fuera de línea sea autónoma. Esto es lo que hago en el siguiente ejemplo. {% endAside %}

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
    <h1>Estás desconectado</h1>

    <p>Haz clic en el botón para intentar una recarga.</p>
    <button type="button">⤾ Recargar</button>

    <!-- Inline the page's JavaScript file. -->
    <script>
      // Metodo de recarga manual.
      document.querySelector("button").addEventListener("click", () => {
        window.location.reload();
      });

      // Escucha los cambios en la red, se recargará cuando se esté conectado.
      // Esto maneja el caso cuando el dispositivo este completamente fuera de linea.
      window.addEventListener('online', () => {
        window.location.reload();
      });

      // Checa si el servidor está respondiendo y recarga la página si lo esté.
      // Esto maneja el caso de cuando el dispositivo esté en linea, pero el servidor
      // esté fuera de linea o con problemas.
      async function checkNetworkAndReload() {
        try {
          const response = await fetch('.');
          // Verifica si tenemos una respuesta valida del servidor
          if (response.status >= 200 && response.status < 500) {
            window.location.reload();
            return;
          }
        } catch {
          // No se puede conectar al servidor, ignorar.
        }
        window.setTimeout(checkNetworkAndReload, 2500);
      }

      checkNetworkAndReload();
    </script>
  </body>
</html>
```

## Demostración

Puedes ver la página fallback sin conexión en acción en la siguiente [demostración](https://offline-fallback-demo.glitch.me/index.html) incrustada a continuación. Si estás interesado, puedes explorar el [código fuente](https://glitch.com/edit/#!/offline-fallback-demo) en Glitch.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/offline-fallback-demo?path=offline.html&amp;previewSize=100" title="offline-fallback-demo on Glitch" allow="geolocation; microphone; camera; midi; vr; encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### Hincapié en hacer tu app instalable

Ahora que tu sitio tiene una página fallback sin conexión, es posible que te preguntes acerca de los próximos pasos. Para que tu aplicación se pueda instalar, debes de agregar un [manifiesto de la aplicación web](/add-manifest/) y, opcionalmente, idear una [estrategia de instalación](/define-install-strategy/).

### Hincapié en servir una página fallback sin conexión con Workbox.js

Es posible que hayas oído hablar de [Workbox.js](https://developer.chrome.com/docs/workbox/). Workbox.js es un conjunto de bibliotecas de JavaScript para agregar soporte sin conexión a aplicaciones web. Si prefieres escribir menos código de service worker por ti mismo, puedes usar la receta de Workbox.js solo para una [página sin conexión](https://developer.chrome.com/docs/workbox/managing-fallback-responses/#offline-page-only).

A continuación, aprenderás a [definir una estrategia de instalación](/define-install-strategy/) para tu aplicación.
