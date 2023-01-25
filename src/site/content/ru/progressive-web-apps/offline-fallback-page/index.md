---
layout: post
title: Создание резервной страницы для автономного режима
authors:
  - thomassteiner
  - petelepage
date: 2020-09-24
updated: 2021-05-19
description: Узнайте, как создать простой интерфейс для работы приложения в автономном режиме.
tags:
  - progressive-web-apps
---

Что общего у приложений Google Assistant, Slack и Zoom, а также почти у всех других приложений, созданных для определенных платформ, на телефоне или компьютере? Да, они всегда предоставляют хоть *какие-то* возможности. Даже если нет подключения к сети, вы все равно можете открыть приложение Assistant, войти в приложение Slack или запустить приложение Zoom. Возможно, вы не получите ничего особенно значимого или даже не сможете сделать то, что хотели, но, по крайней мере, вам будет доступен хотя бы *минимальный* набор функций и вы сможете управлять приложением.

<figure role="group" aria-labelledby="fig-apps-wrapper"></figure>

  <figure role="group" aria-labelledby="fig-assistant" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gr49coayhLfP1UVJ2EeR.jpg", alt="Мобильное приложение Google Assistant, работающее в автономном режиме.", width="621", height="1344" %} <figcaption id="fig-assistant"> Google Assistant. </figcaption></figure>

  <figure role="group" aria-labelledby="fig-slack" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D4P00CQ15IE0plUEY3di.jpg", alt="Мобильное приложение Slack, работающее в автономном режиме.", width="621", height="1344" %} <figcaption id="fig-slack"> Slack. </figcaption></figure>

  <figure role="group" aria-labelledby="fig-zoom" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gw1LQG4JNYUDxQ2NOJHC.jpg", alt="Мобильное приложение Zoom, работающее в автономном режиме.", width="621", height="1344" %} <figcaption id="fig-zoom"> Zoom. </figcaption></figure>

  <figcaption id="fig-apps-wrapper">Если вы используете приложения, созданные для определенной платформы, вы всегда получаете хоть какие-то возможности, даже если нет подключения к сети.</figcaption>



В противоположность этому, вы не сможете получить никакие возможности в Интернете, если нет подключения к сети. В Chrome можно поиграть в [оффлайн-игру с динозавром](https://www.blog.google/products/chrome/chrome-dino/), но это все, что доступно.

<figure role="group" aria-labelledby="fig-offline-wrapper"></figure>

  <figure role="group" aria-labelledby="fig-chrome-ios" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yEf0wzIQ1hIf85xtUwse.png", alt="Мобильное приложение Google Chrome, в котором отображается оффлайн-игра с динозавром.", width="800", height="1731" %} <figcaption id="fig-chrome-ios"> Google Chrome для iOS. </figcaption></figure>

  <figure role="group" aria-labelledby="fig-chrome" style="display: inline-block">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vrqfLVP132LcydIWcYbh.png", alt="Приложение Google Chrome для компьютеров, в котором отображается оффлайн-игра с динозавром.", width="800", height="607" %} <figcaption id="fig-chrome"> Google Chrome для macOS. </figcaption></figure>

  <figcaption id="fig-offline-wrapper">Если у вас нет подключения к сети, то по умолчанию вам недоступны никакие возможности в Интернете.</figcaption>



## Резервная страница для автономного режима с адаптированным служебным сценарием

Тем не менее всё необязательно должно быть именно так. С помощью [служебных сценариев и Cache Storage API](/service-workers-cache-storage/) вы можете предоставить своим пользователям адаптированный интерфейс для работы в автономном режиме. Возможно, это будет простая страница с фирменной символикой и информацией о том, что в данный момент пользователь не подключен к сети. Но это может быть и более творческое решение, как, например, знаменитая [оффлайн-игра Trivago с лабиринтом](https://www.trivago.com/offline) с кнопкой ручного **повторного подключения к сети** и автоматическим таймером, отсчитывающим время до следующей попытки подключения к сети.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0yvun9EV5758sRO9wSgY.png", alt="Страница Trivago для автономного режима, на которой отображается оффлайн-игра с лабиринтом.", width="800", height="616" %} <figcaption> Оффлайн-игра Trivago с лабиринтом. </figcaption></figure>

### Регистрация служебного сценария

Реализовать страницу для автономного режима можно с помощью служебного сценария. Вы можете зарегистрировать служебный сценарий со своей главной страницы, как в приведенном ниже примере кода. Обычно это следует делать после загрузки приложения.

```js
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
  }
});
```

### Код служебного сценария

На первый взгляд содержимое реального файла служебного сценария кажется немного запутанным, но с помощью комментариев в приведенном ниже примере можно разобраться в ситуации. Основная идея состоит в том, чтобы предварительно кэшировать файл `offline.html`, который передается только при *неудачных* запросах на переход между страницами, и позволить браузеру обрабатывать все остальные случаи:

```js
/*
© Google LLC, 2015, 2019, 2020, 2021. Все права защищены.
 Данный файл лицензирован на условиях лицензии Apache License 2.0 ("Лицензия");
 использовать этот файл разрешено только в соответствии с Лицензией.
 Текст Лицензии можно получить по адресу
 http://www.apache.org/licenses/LICENSE-2.0
 За исключением случаев, предусмотренных действующим законодательством или согласованных в письменной форме, программное обеспечение,
 распространяемое на условиях Лицензии, предоставляется на УСЛОВИЯХ "КАК ЕСТЬ",
 БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ ИЛИ УСЛОВИЙ, явных или подразумеваемых.
 Сведения об основных разрешениях и ограничениях в рамках Лицензии для определенных языков
 см. в тексте Лицензии.
*/

// Если увеличить значение переменной OFFLINE_VERSION, будет создано событие установки и
// ранее кэшированные ресурсы будут обновлены из сети.
// Эта переменная намеренно объявлена и не используется.
// Если нужно, добавьте комментарий для своего анализатора кода:
// eslint-disable-next-line no-unused-vars
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
// При необходимости укажите здесь другой URL-адрес.
const OFFLINE_URL = "offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Если настроить {cache: 'reload'} в новом запросе,
      // ответ гарантированно не будет получен из кэша HTTP; т. е. он будет получен из
      // сети.
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );
  // Принудительный перевод ожидающего служебного сценария в активное состояние.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Включение предварительной загрузки при переходе между страницами, если эта функция поддерживается.
      // См. сведения по ссылке https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  // Сообщаем активному служебному сценарию, что необходимо немедленно получить контроль над страницей.
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Нам нужно вызвать функцию event.respondWith(), только если это запрос на переход между
  // HTML-страницами.
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Прежде всего попытаемся использовать ответ предварительной загрузки при переходе между страницами, если эта функция поддерживается.
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // Всегда сначала проверяйте сеть.
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // Событие catch появляется только при возникновении исключения, которое, вероятно,
          // вызвано ошибкой сети.
          // Если функция fetch() возвращает допустимый ответ HTTP с кодом ответа в
          // диапазоне 4xx или 5xx, функция catch() НЕ будет вызвана.
          console.log("Не удалось получить данные; вместо этого возвращаем страницу для автономного режима.", error);

          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }

  // Если выражение в условии if() ложно, то этот обработчик операции получения данных не перехватит
  // запрос. Если зарегистрированы любые другие обработчики операций получения данных, они
  // смогут вызвать метод event.respondWith(). Если ни один обработчик операций получения данных не вызовет метод
  // event.respondWith(), браузер обработает запрос таким образом, как если бы
  // не были задействованы никакие служебные сценарии.
});
```

### Резервная страница для автономного режима

Работая с файлом `offline.html`, вы можете проявить свои творческие способности, адаптировать файл к своим потребностям и добавить фирменное оформление вашей компании. В приведенном ниже примере показан минимум из того, что можно сделать. Здесь продемонстрированы ручная перезагрузка при нажатии кнопки, автоматическая перезагрузка по [событию `online`](https://developer.mozilla.org/docs/Web/API/Window/online_event) и регулярный опрос сервера.

{% Aside 'gotchas' %} Вам потребуется кэшировать все ресурсы страницы для автономного режима. Один из способов сделать это — встроить в нее все необходимые ресурсы. Именно это мы делаем в приведенном ниже примере. {% endAside %}

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Отсутствует подключение к сети</title>

    <!-- Встраиваем таблицу стилей страницы. -->
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
    <h1>Отсутствует подключение к сети</h1>

    <p>Чтобы перезагрузить страницу, нажмите расположенную ниже кнопку.</p>
    <button type="button">⤾ Перезагрузить</button>

    <!-- Встраиваем файл JavaScript страницы. -->
    <script>
      // Функция ручной перезагрузки.
      document.querySelector("button").addEventListener("click", () => {
        window.location.reload();
      });

      // Прослушиваем изменения состояния сети, при подключении к сети перезагружаем страницу.
      // Здесь мы обрабатываем случай, когда устройство полностью отключено от сети.
      window.addEventListener('online', () => {
        window.location.reload();
      });

      // Проверяем, отвечает ли сервер. Если он отвечает, перезагружаем страницу.
      // Здесь мы обрабатываем случай, когда устройство подключено к сети, но сервер
      // недоступен или работает неправильно.
      async function checkNetworkAndReload() {
        try {
          const response = await fetch('.');
          // Проверяем, что мы получили допустимый ответ с сервера
          if (response.status >= 200 && response.status < 500) {
            window.location.reload();
            return;
          }
        } catch {
          // Не удается подключиться к серверу, игнорируем.
        }
        window.setTimeout(checkNetworkAndReload, 2500);
      }

      checkNetworkAndReload();
    </script>
  </body>
</html>
```

## Демонстрация

В приведенной ниже [демонстрации](https://offline-fallback-demo.glitch.me/index.html) можно посмотреть, как работает резервная страница для автономного режима. Ее [исходный код](https://glitch.com/edit/#!/offline-fallback-demo) можно изучить на Glitch.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/offline-fallback-demo?path=offline.html&amp;previewSize=100" title="offline-fallback-demo on Glitch" allow="geolocation; microphone; camera; midi; vr; encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### Примечание о том, как добавить поддержку установки для приложения

Теперь, когда на вашем сайте есть резервная страница для автономного режима, у вас может появиться вопрос, что делать дальше. Чтобы ваше приложение можно было установить, необходимо добавить [манифест веб-приложения](/add-manifest/) и (при желании) разработать [стратегию установки](/define-install-strategy/).

### Примечание о том, как передавать резервную страницу для автономного режима с помощью Workbox.js

Возможно, вы слышали о [Workbox.js](https://developer.chrome.com/docs/workbox/). Workbox.js — это набор библиотек JavaScript для поддержки автономного режима в веб-приложениях. Если вы не хотите самостоятельно писать код служебного сценария, вы можете использовать рецепт Workbox.js [только для оффлайн-страницы](https://developer.chrome.com/docs/workbox/managing-fallback-responses/#offline-page-only).

Далее узнайте, [как разработать стратегию установки](/define-install-strategy/) для приложения.
