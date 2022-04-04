---
layout: post
title: Service workers y la API de almacenamiento en caché
authors:
  - jeffposnick
date: 2018-11-05
updated: 2020-02-27
description: La caché HTTP del navegador es su primera línea de defensa. No es necesariamente el enfoque más poderoso o flexible, además tiene un control limitado sobre la vida útil de las respuestas en caché. Pero hay varias reglas generales que le ofrecen una implementación de almacenamiento en caché sensata sin mucho trabajo, por lo que siempre debería intentar seguirlas.
---

Usted está atrapado en una lucha por la confiabilidad de la red. La caché HTTP del navegador es su primera línea de defensa, pero como ha aprendido, solo es realmente eficaz cuando se cargan URL versionadas que ha visitado anteriormente. Por sí sola, la caché HTTP no es suficiente.

Afortunadamente, hay dos herramientas más nuevas disponibles para ayudar a cambiar el rumbo a su favor: los [service workers](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) y la [API de almacenamiento en caché](https://developer.mozilla.org/docs/Web/API/CacheStorage). Dado que se usan en conjunto con tanta frecuencia, vale la pena aprender sobre ambas al mismo tiempo.

## Service workers

Un service worker está integrado en el navegador y es controlado por algo de código JavaScript adicional que usted es responsable de crear. Usted implementa esto junto con los otros archivos que componen su aplicación web real.

Un service worker tiene algunos poderes especiales. Entre otras tareas, espera pacientemente que su aplicación web realice una solicitud saliente y luego entra en acción interceptándola. Lo que haga el service worker con esta solicitud interceptada depende de usted.

Para algunas solicitudes, el mejor curso de acción podría ser simplemente permitir que la solicitud continúe en la red, al igual que lo que sucedería si no hubiera ningún service worker.

Sin embargo, para otras solicitudes, puede aprovechar algo más flexible que la caché HTTP del navegador y devolver una respuesta rápida y confiable sin tener que preocuparse por la red. Eso implica usar la otra pieza del rompecabezas: la API de almacenamiento en caché.

## La API de almacenamiento en caché

La API de almacenamiento en caché abre una gama completamente nueva de posibilidades, al brindar a los desarrolladores un control total sobre el contenido de la caché. En lugar de depender de una combinación de encabezados HTTP y la [heurística](https://httpwg.org/specs/rfc7234.html#heuristic.freshness) incorporada del navegador, la API de almacenamiento en caché expone un enfoque basado en código para el almacenamiento en caché. La API de almacenamiento en caché es particularmente útil cuando se invoca desde el JavaScript de su service worker.

### Espere … ¿hay otra caché en la que pensar ahora?

Probablemente se esté haciendo preguntas como "¿Todavía necesito configurar mis encabezados HTTP?" y "¿Qué puedo hacer con esta nueva caché que no fuera posible con la caché HTTP?". No se preocupe, esas son reacciones naturales.

Aún se recomienda que configure los encabezados `Cache-Control` en su servidor web, incluso cuando sepa que está utilizando la API de almacenamiento en caché. Por lo general, puede salirse con la suya mediante la configuración de `Cache-Control: no-cache` para las URL sin versión o `Cache-Control: max-age=31536000` para las URL que contienen información de versiones, como hashes.

Al llenar la caché de la API de almacenamiento en caché, el navegador [busca de forma predeterminada las entradas existentes](https://jakearchibald.com/2016/caching-best-practices/#the-service-worker-the-http-cache-play-well-together-dont-make-them-fight) en la caché HTTP y las usa si las encuentra. Si está agregando URL versionadas a la caché de la API de almacenamiento en caché, el navegador evita una solicitud de red adicional. La otra cara de la moneda es que si está utilizando encabezados `Cache-Control` mal configurados, como especificar una vida útil de caché de larga duración para una URL sin versión, puede terminar [empeorando las cosas](https://jakearchibald.com/2016/caching-best-practices/#a-service-worker-can-extend-the-life-of-these-bugs) al agregar ese contenido obsoleto a la API de almacenamiento de caché. Ordenar el comportamiento de la caché HTTP es un requisito previo para utilizar eficazmente la API de almacenamiento en caché.

En cuanto a lo que ahora es posible con esta nueva API, la respuesta es: mucho. Algunos usos comunes que serían difíciles o imposibles con solo la caché de HTTP incluyen:

- Utilice un enfoque de "actualización en segundo plano" para el contenido almacenado en caché, que se sabe que es obsoleto mientras se revalida.
- Imponga un límite en la cantidad máxima de activos para almacenar en caché e implemente una política de vencimiento personalizada para eliminar elementos una vez que se alcance ese límite.
- Compare las respuestas de red actualizadas y almacenadas previamente en caché para ver si algo ha cambiado y permita que el usuario actualice el contenido (con un botón, por ejemplo) cuando los datos se hayan actualizado realmente.

Consulte la [API de caché: una guía rápida](/cache-api-quick-guide/) para obtener más información.

### Tuercas y tornillos de la API

Hay algunas cosas a tener en cuenta sobre el diseño de la API:

- Los objetos [`Request`](https://developer.mozilla.org/docs/Web/API/Request) de solicitud se utilizan como claves únicas al leer y escribir en estas cachés. Para su comodidad, puede pasar una cadena de URL como `'https://example.com/index.html'` como clave en lugar de un objeto `Request` real y la API lo manejará automáticamente por usted.
- Los objetos [`Response`](https://developer.mozilla.org/docs/Web/API/Response) de respuesta se utilizan como valores en estos cachés.
- El encabezado `Cache-Control` en una `Response` dada se ignora efectivamente cuando se almacenan datos en l caché. No hay comprobaciones automáticas de caducidad o actualización incorporadas y una vez que almacena un elemento en la caché, persistirá hasta que su código lo elimine explícitamente. (Existen bibliotecas para simplificar el mantenimiento de la caché en su nombre. Se tratarán más adelante en esta serie).
- A diferencia de las API síncronas más antiguas, como[`LocalStorage`](https://developer.mozilla.org/docs/Web/API/Storage/LocalStorage), todas las operaciones de la API de almacenamiento en caché son asincrónicas.

## Un desvío rápido: promesas y async/await

Los service workers y la API de almacenamiento en caché utilizan [conceptos de programación asincrónica](https://en.wikipedia.org/wiki/Asynchrony_(computer_programming)). En particular, dependen en gran medida de las promesas para representar el resultado futuro de las operaciones asincrónicas. Usted debe familiarizarse con las [promesas](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) y la sintaxis relacionada [`async`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)/[`await`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/await) antes de la inmersión.

{% Aside 'codelab' %} [Cree una aplicación confiable al registrar un service worker](/codelab-service-workers). {% endAside %}

## No implemente ese código … todavía

Si bien proporcionan una base importante y se pueden usar tal cual, tanto los service workers como la API de almacenamiento en caché son bloques de construcción de nivel inferior, con una serie de casos extremos y "errores". Hay algunas herramientas de nivel superior que pueden ayudar a suavizar las partes difíciles de esas API y proporcionar todo lo que necesita para crear un service worker listo para la producción. La siguiente guía cubre una de estas herramientas: [Workbox](https://developer.chrome.com/docs/workbox/).

{% Aside 'success' %} Aprenda mientras se divierte. ¡Échele un vistazo al nuevo [juego Service Workies](https://serviceworkies.com/)! {% endAside %}
