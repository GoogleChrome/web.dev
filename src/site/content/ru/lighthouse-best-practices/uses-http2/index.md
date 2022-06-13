---
layout: post
title: Не использует HTTP/2 для всех своих ресурсов
description: |2-

  Узнайте, какую роль играет HTTP/2 во времени загрузки вашей страницы и как включить HTTP/2 на вашем сервере.
web_lighthouse:
  - uses-http2
date: 2019-05-02
updated: 2019-08-28
---

Протокол HTTP/2 передает ресурсы вашей страницы быстрее, при этом объем передаваемых по сети данных сокращен.

## Причины плохих результатов аудита HTTP/2 в Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) перечисляет все ресурсы, которые не обслуживаются через HTTP/2:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Gs0J63479ELUkMeI8MRS.png", alt="Аудит Lighthouse показывает, что ресурсы не обслуживаются через HTTP/2", width="800", height="191" %}</figure>

Lighthouse собирает все ресурсы, запрашиваемые страницей, и проверяет версию протокола HTTP для каждого из них. В некоторых случаях запросы, отличные от HTTP/2, игнорируются в результатах аудита. См. [реализацию](https://github.com/GoogleChrome/lighthouse/blob/9fad007174f240982546887a7e97f452e0eeb1d1/lighthouse-core/audits/dobetterweb/uses-http2.js#L138) для получения более подробной информации.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Как пройти этот аудит

Передавайте свои ресурсы через HTTP/2.

Чтобы узнать, как включить HTTP/2 на своих серверах, см. раздел «[Настройка HTTP/2](https://dassur.ma/things/h2setup/)».

## Ресурсы

- [Исходный код для аудита «**Не использует HTTP/2 для всех своих ресурсов**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/uses-http2.js)»
- [Введение в HTTP/2](/performance-http2/)
- [Часто задаваемые вопросы о HTTP/2](https://http2.github.io/faq/)
