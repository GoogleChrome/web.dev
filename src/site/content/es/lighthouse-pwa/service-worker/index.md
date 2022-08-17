---
layout: post
title: No registra un service worker que controla la página y el `start_url`
description: Aprenda a registrar un service worker compatible con las características de la aplicación web progresiva como funcionalidad fuera de línea, notificaciones emergentes, e instalación.
web_lighthouse:
  - service-worker
date: 2019-05-04
updated: 2020-06-10
---

El registro de un [service worker](/service-workers-cache-storage/) es el primer paso para habilitar las funciones clave de la [aplicación web progresiva (PWA)](/discover-installable):

- Funcionar sin conexión
- Admitir notificaciones emergentes
- Se puede instalar en el dispositivo

Obtenga más información en la publicación [Service Workers y API de almacenamiento en caché.](/service-workers-cache-storage/)

## Compatibilidad del navegador

Todos los navegadores principales, excepto Internet Explorer, son compatibles con los service workers. Consulte [Compatibilidad del navegador](https://developer.mozilla.org/docs/Web/API/ServiceWorker#Browser_compatibility).

## Cómo fallar la auditoría del service worker de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las páginas que no registran un service worker:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URqaGD5akD2LNczr0jjQ.png", alt="Auditoría de Lighthouse que muestra que el sitio no registra un service worker", width="800", height="95" %}</figure>

Lighthouse comprueba si el [Protocolo de depuración remota de Chrome](https://github.com/ChromeDevTools/devtools-protocol) devuelve una versión del service worker. Si no es así, la auditoría falla.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Cómo registrar un service worker

{% include 'content/reliable/workbox.njk' %}

El registro de un trabajador del servicio implica solo unas pocas líneas de código, pero la única razón por la que usaría un service worker es para hacer posible la implementación de una de las características de la PWA descritas anteriormente. La implementación real de esas características requiere más trabajo:

- Para saber cómo almacenar archivos en caché para su uso sin conexión, consulte la publicación [¿Qué es la confiabilidad de la red y cómo se mide?](/network-connections-unreliable).
- Para saber cómo hacer que su aplicación sea instalable, consulte el laboratorio de códigos [Hacerlo instalable](/codelab-make-installable/).
- Para saber cómo habilitar las notificaciones emergentes, consulte [Añadir notificaciones emergentes a una página Web](https://codelabs.developers.google.com/codelabs/push-notifications) de Google.

## Recursos

- [Código fuente para la auditoría **No registra un service worker que controla la página y el `start_url`**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/service-worker.js)
- [Service workers: una introducción](https://developer.chrome.com/docs/workbox/service-worker-overview/)
- [Service workers y la API de almacenamiento en caché](/service-workers-cache-storage/)
- [¿Qué es la confiabilidad de la red y cómo se mide?](/network-connections-unreliable)
- [Hágalo instalable](/codelab-make-installable/)
- [Agregar notificaciones emergentes a una aplicación web](https://codelabs.developers.google.com/codelabs/push-notifications)
