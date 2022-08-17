---
title: Mantener las cosas frescas con stale-while-revalidate
subhead: Una herramienta adicional para ayudarlo a equilibrar la inmediatez y la frescura al poner en servicio su aplicación web.
authors:
  - jeffposnick
date: 2019-07-18
description: La herramienta stale-while-revalidate ayuda a que los desarrolladores equilibren la inmediatez (cargar el contenido en caché de inmediato) y la frescura, lo que garantiza que las actualizaciones del contenido en caché se utilicen en el futuro.
hero: image/admin/skgQgcT3q8fdBGGNL3o1.jpg
alt: Una fotografía de una pared a medio pintar.
tags:
  - blog
feedback:
  - api
---

## ¿Qué se envió?

La herramienta [`stale-while-revalidate`](https://tools.ietf.org/html/rfc5861#section-3) ayuda a que los desarrolladores equilibren la inmediatez (*cargar el contenido en caché de inmediato)* y la frescura, lo que *garantiza que las actualizaciones del contenido en caché se utilicen en el futuro*. Si mantiene un servicio web o una biblioteca de terceros que se actualiza con regularidad, o si sus activos propios tienden a tener una vida útil corta, entonces la herramienta `stale-while-revalidate` puede ser una adición útil a sus políticas existentes de almacenamiento en caché.

La compatibilidad para configurar `stale-while-revalidate` junto con `max-age` en su encabezado de respuesta `Cache-Control` está disponible en  [Chrome 75](https://chromestatus.com/feature/5050913014153216) y en [Firefox 68](https://bugzilla.mozilla.org/show_bug.cgi?id=1536511).

Los navegadores que no admiten `stale-while-revalidate` ignorarán silenciosamente ese valor de configuración y usarán [`max-age`](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#max-age), como explicaré en breve…

## ¿Qué significa?

Desglosemos `stale-while-revalidate` en dos partes: la idea de que una respuesta almacenada en caché puede quedar obsoleta y el proceso de revalidación.

Primero, ¿cómo sabe el navegador si una respuesta almacenada en caché quedó "obsoleta"? Un encabezado de respuesta [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control) que contiene `stale-while-revalidate` también debe contener `max-age` y el número de segundos especificado mediante `max-age` es lo que determina la obsolescencia. Cualquier respuesta almacenada en caché más reciente que `max-age` se considera nueva y las respuestas almacenadas en caché más antiguas se consideran obsoletas.

Si la respuesta almacenada en caché local aún es reciente, entonces se puede usar tal cual para cumplir con la solicitud de un navegador. Desde la perspectiva de `stale-while-revalidate`, no hay nada que hacer en este escenario.

Pero si la respuesta almacenada en caché está obsoleta, entonces se realiza otra verificación basada en la antigüedad: ¿la antigüedad de la respuesta almacenada en caché dentro de la ventana de tiempo está cubierta por la configuración `stale-while-revalidate`?

Si la antigüedad de una respuesta obsoleta cae en esta ventana, se utilizará para cumplir con la solicitud del navegador. Al mismo tiempo, se realizará una solicitud de "revalidación" contra la red de una manera que no retrase el uso de la respuesta almacenada en caché. La respuesta devuelta puede contener la misma información que la respuesta almacenada en caché anteriormente o puede ser diferente. De cualquier manera, la respuesta de la red se almacena localmente, para reemplazar lo que estaba previamente en caché y restablecer el temporizador de "frescura" utilizado durante cualquier comparación `max-age`.

Sin embargo, si la respuesta obsoleta almacenada en caché es lo suficientemente antigua como para quedar fuera de la ventana de tiempo `stale-while-revalidate`, entonces no cumplirá con la solicitud del navegador. En cambio, el navegador recuperará una respuesta de la red y la usará tanto para cumplir con la solicitud inicial como para completar la memoria caché local con una nueva respuesta.

## Ejemplo en vivo

A continuación se muestra un ejemplo simple de una API HTTP para devolver la hora actual, más específicamente, la cantidad actual de minutos después de la hora.

{% Glitch { id: 's-w-r-demo', path: 'server.js:20:15', height: 346 } %}

En este escenario, el servidor web usa este encabezado `Cache-Control` en su respuesta HTTP:

```text
Cache-Control: max-age=1, stale-while-revalidate=59
```

Esta configuración significa que, si se repite una solicitud de tiempo en el siguiente segundo, el valor almacenado en caché anterior seguirá estando actualizado y se utilizará tal cual, sin ninguna revalidación.

Si una solicitud se repite entre 1 y 60 segundos después, el valor almacenado en caché quedará obsoleto, pero se utilizará para cumplir con la solicitud de la API. Al mismo tiempo, "en segundo plano", se realizará una solicitud de revalidación para llenar la caché con un valor nuevo para uso futuro.

Si una solicitud se repite después de más de 60 segundos, la respuesta obsoleta no se usa en absoluto, y tanto el cumplimiento de la solicitud del navegador como la revalidación de la caché dependerán de la obtención de una respuesta de la red.

Este es un desglose de esos tres estados distintos, junto con la ventana de tiempo en la que cada uno de ellos se aplica a nuestro ejemplo:

{% Img src="image/admin/C8lg2FSEqhTKR6WmYky3.svg", alt="Un diagrama que ilustra la información de la sección anterior.", width="719", height="370" %}

## ¿Cuáles son los casos de uso comunes?

Si bien el ejemplo anterior para un servicio de API "minutos después de la hora" es artificioso, ilustra el caso de uso y los servicios esperados que brindan información que debe actualizarse, pero donde cierto grado de obsolescencia es aceptable.

Ejemplos menos elaborados pueden ser una API para las condiciones climáticas actuales o los titulares de noticias principales que se escribieron en la última hora.

En general, cualquier respuesta que se actualice en un intervalo conocido, que sea probable que se solicite varias veces y que sea estática dentro de ese intervalo será una buena candidata para el almacenamiento en caché a corto plazo mediante `max-age`. El uso de `stale-while-revalidate` además de `max-age` aumenta la probabilidad de que las solicitudes futuras se puedan cumplir desde la caché con contenido más actualizado, sin bloquear una respuesta de la red.

## ¿Cómo interactúa con los service workers?

Si ha oído hablar de `stale-while-revalidate` es probable que haya sido en el contexto de [recetas](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate) utilizadas por un [service worker](/service-workers-cache-storage/).

El uso de stale-while-revalidate a través de un encabezado `Cache-Control` comparte algunas similitudes con su uso en un service worker y se aplican muchas de las mismas consideraciones sobre las compensaciones de frescura y la vida útil máxima. Sin embargo, hay algunas consideraciones que debe tener en cuenta al decidir si implementar un enfoque basado en service workers o simplemente confiar en la configuración del encabezado `Cache-Control`.

### Utilice un enfoque de service worker si…

- Ya está utilizando un service worker en su aplicación web.
- Necesita un control detallado sobre el contenido de sus cachés y desea implementar algo como una política de vencimiento utilizada menos recientemente. El módulo de [Vencimiento de caché](https://developer.chrome.com/docs/workbox/modules/workbox-expiration/) de Workbox puede ayudar con esto.
- Desea recibir una notificación cuando una respuesta obsoleta cambie en segundo plano durante el paso de revalidación. El módulo [Transmisión de actualización de caché](https://developer.chrome.com/docs/workbox/modules/workbox-broadcast-update/) de Workbox puede ayudar con esto.
- Necesita este comportamiento `stale-while-revalidate` en todos los navegadores modernos.

### Utilice un enfoque de control de caché si…

- Preferiría no lidiar con la sobrecarga de implementar y mantener un service worker para su aplicación web.
- Está de acuerdo con permitir que la administración automática de caché del navegador evite que sus cachés locales crezcan demasiado.
- Está de acuerdo con un enfoque que actualmente no es compatible con todos los navegadores modernos (a partir de julio de 2019; el soporte puede crecer en el futuro).

Si está utilizando un service worker y también tiene habilitado `stale-while-revalidate` para algunas respuestas a través de un encabezado `Cache-Control`, entonces el service worker, en general, tendrá la "primera grieta" al responder a una solicitud. Si el service worker decide no responder o si en el proceso de generar una respuesta realiza una solicitud de red mediante [`fetch()`](https://developer.mozilla.org/docs/Web/API/Fetch_API), entonces el comportamiento configurado a través del encabezado `Cache-Control` terminará por entrar en vigencia.

## Aprenda más

- [Respuesta `stale-while-revalidate`](https://fetch.spec.whatwg.org/#concept-stale-while-revalidate-response) en la especificación de la API de recuperación.
- [RFC 5861](https://tools.ietf.org/html/rfc5861) , que cubre la especificación inicial `stale-while-revalidate`.
- [La caché HTTP: su primera línea de defensa](/http-cache/), de la guía "Confiabilidad de la red" en este sitio.

*Imagen hero de Samuel Zeller.*
