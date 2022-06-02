---
layout: post
title: Не регистрируется сервис-воркер, управляющий страницей и `start_url`
description: Узнайте, как зарегистрировать сервис-воркер, поддерживающий возможности прогрессивных веб-приложений, такие как офлайн-работа, push-уведомления и возможность установки.
web_lighthouse:
  - service-worker
date: 2019-05-04
updated: 2020-06-10
---

Регистрация [сервис-воркера](/service-workers-cache-storage/) — это первый шаг к реализации основных функций [прогрессивного веб-приложения (PWA)](/discover-installable), таких как:

- офлайн-работа;
- поддержка push-уведомлений;
- возможность установки на устройство.

Подробнее см. в статье [Сервис-воркеры и Cache Storage API](/service-workers-cache-storage/).

## Совместимость с браузерами

Сервис-воркеры поддерживаются во всех основных браузерах, за исключением Internet Explorer; см. [Совместимость с браузерами](https://developer.mozilla.org/docs/Web/API/ServiceWorker#Browser_compatibility).

## В каких случаях проверка сервис-воркера в Lighthouse завершается неудачей

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) помечает страницы, которые не выполняют регистрацию сервис-воркера:

<figure> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URqaGD5akD2LNczr0jjQ.png", alt="Проверка Lighthouse показывает, что сайт не выполняет регистрацию сервис-воркера", width="800", height="95" %}</figure>

Lighthouse проверяет, возвращает ли [Chrome Remote Debugging Protocol](https://github.com/ChromeDevTools/devtools-protocol) номер версии сервис-воркера. Если этого не происходит, проверка завершается неудачей.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Как зарегистрировать сервис-воркер

{% include 'content/reliable/workbox.njk' %}

Для регистрации сервис-воркера требуется всего несколько строк кода, но смысл в ней есть только в том случае, если вы собираетесь реализовать одну из функций PWA, перечисленных выше. Это потребует более серьезных усилий:

- Чтобы узнать о кешировании файлов для использования в офлайн-режиме, см. статью [Что такое надежность сети и как ее измерить](/network-connections-unreliable).
- Чтобы узнать, как обеспечить возможность установки приложения, см. интерактивный урок [Добавление возможности установки](/codelab-make-installable/).
- Чтобы узнать, как добавить push-уведомления, см. интерактивный урок [Добавление push-уведомлений в веб-приложение](https://codelabs.developers.google.com/codelabs/push-notifications), созданный Google.

## Ресурсы

- [Исходный код проверки **Does not register a service worker that controls page and `start_url`**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/service-worker.js)
- [Сервис-воркеры: введение](https://developer.chrome.com/docs/workbox/service-worker-overview/)
- [Сервис-воркеры и Cache Storage API](/service-workers-cache-storage/)
- [Что такое надежность сети и как ее измерить?](/network-connections-unreliable)
- [Добавление возможности установки](/codelab-make-installable/)
- [Добавление push-уведомлений в веб-приложение](https://codelabs.developers.google.com/codelabs/push-notifications)
