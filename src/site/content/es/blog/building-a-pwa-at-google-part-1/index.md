---
title: Construyendo una PWA en Google, parte 1
subhead: Lo que el equipo de Bulletin aprendió sobre los service workers mientras desarrollaba una PWA.
date: 2020-07-29
authors:
  - joelriley
  - douglasparker
  - msdikla
hero: image/admin/mgB3j6NZa6F1CkoD9YI4.jpg
alt: Un grupo de personas en una mesa trabajando con sus computadoras.
description: Lo que el equipo de Bulletin aprendió sobre los service workers mientras desarrollaba una PWA.
tags:
  - blog
  - progressive-web-apps
  - service-worker
  - performance
  - storage
  - testing
---

Esta es la primera de una serie de publicaciones de blog sobre las lecciones que aprendió el equipo de Google Bulletin al crear una PWA externa. En estas publicaciones, compartiremos algunos de los desafíos que enfrentamos, los enfoques que elegimos para superarlos y consejos generales para evitar obstáculos o problemas. Esta no es una descripción completa de las PWA. El objetivo es compartir los aprendizajes de la experiencia de nuestro equipo.

Para esta primera entrega, cubriremos primero un poco de información general y luego profundizaremos en todo lo que aprendimos sobre los service workers.

{% Aside %} Bulletin se cerró en 2019 debido a la falta de ajuste de producto/mercado. ¡Aún así aprendimos mucho sobre las PWA a lo largo del camino! {% endAside %}

## Antecedentes {: #background}

Bulletin estuvo en desarrollo activo desde mediados de 2017 hasta mediados de 2019.

### Por qué elegimos crear una PWA {: #why-pwa }

Antes de profundizar en el proceso de desarrollo, examinemos por qué crear una PWA fue una opción atractiva para este proyecto:

- **Capacidad para iterar rápidamente**. Especialmente valiosa ya que Bulletin se probaría en múltiples mercados.
- **Base de código único**. Nuestros usuarios se dividieron aproximadamente en partes iguales entre Android e iOS. Una PWA significaba que podíamos crear una única aplicación web que funcionara en ambas plataformas. Esto aumentó la velocidad y el impacto del equipo.
- **Actualización rápida e independiente del comportamiento del usuario**. Las PWA pueden actualizarse automáticamente, lo que reduce la cantidad de clientes desactualizados. Pudimos impulsar cambios importantes en el backend con un tiempo de migración muy corto para los clientes.
- **Integración fácil con aplicaciones propias y de terceros**. Tales integraciones eran un requisito para la aplicación. Con una PWA, a menudo significaba simplemente abrir una URL.
- **Eliminación de la fricción al instalar una aplicación.**

### Nuestro marco {: #framework }

Para Bulletin, usamos [Polymer](https://www.polymer-project.org/), pero cualquier marco moderno y bien soportado funcionará.

## Lo que aprendimos sobre los service workers {: #lesson-learned }

No puede tener una PWA sin un [service worker](https://developer.chrome.com/docs/workbox/service-worker-overview/). Los service workers le brindan mucho poder, como estrategias avanzadas de almacenamiento en caché, capacidades fuera de línea, sincronización en segundo plano, etc. Si bien los service workers agregan cierta complejidad, descubrimos que sus beneficios superan la complejidad agregada.

### Genérelo si puede {: #generate }

Evite escribir un guion de service worker a mano, ya que esto requiere administrar manualmente los recursos almacenados en caché y reescribir la lógica que es común a la mayoría de las bibliotecas de service workers, como [Workbox](https://developer.chrome.com/docs/workbox/).

Dicho esto, debido a nuestra pila de tecnología interna, no pudimos usar una biblioteca para generar y administrar nuestro service worker. Nuestros aprendizajes a continuación reflejarán en ocasiones eso. Puede leer más en [Obstáculos para los service workers no generados](#pitfalls).

### No todas las bibliotecas son compatibles con los service workers {: #libraries }

Algunas bibliotecas JS hacen suposiciones que no funcionan como se esperaba cuando las ejecuta un service worker. Por ejemplo, suponiendo que `window` o `document` estén disponibles, o utilizando una API no disponible para los service workers (`XMLHttpRequest`, almacenamiento local, etc.). Asegúrese de que las bibliotecas críticas que necesite para su aplicación sean compatibles con los service workers. Para esta PWA en particular, queríamos usar [gapi.js](https://github.com/google/google-api-javascript-client) para la autenticación, pero no pudimos porque no era compatible con los service workers. Los autores de bibliotecas también deben reducir o eliminar las suposiciones innecesarias sobre el contexto de JavaScript, siempre que sea posible, para respaldar los casos de uso de service workers, como evitar las API incompatibles con los service workers y [evitar el estado global](#global-state).

### Evite acceder a IndexedDB durante la inicialización {: #idb }

No lea [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API) al inicializar su script de service worker, o puede entrar en esta situación no deseada:

1. El usuario tiene una aplicación web con IndexedDB (IDB) versión N
2. Se incluye una nueva aplicación web con la versión N+1 de IDB
3. El usuario visita la PWA, lo que desencadena la descarga de un nuevo service worker
4. El nuevo service worker lee el IDB antes de registrar el controlador de evento `install`, lo que desencadena un ciclo de actualización del IDB para pasar de N a N+1
5. Dado que el usuario tiene un cliente antiguo con la versión N, el proceso de actualización del service worker se bloquea ya que las conexiones activas todavía están abiertas a la versión anterior de la base de datos
6. El service worker cuelga y nunca se instala

En nuestro caso, la caché se invalidaba en la instalación del service worker, por lo que si el service worker nunca se instaló, los usuarios nunca recibieron la aplicación actualizada.

### Hágalo resistente {: #resilient}

Aunque los scripts del service worker se ejecutan en segundo plano, también se pueden finalizar en cualquier momento, incluso cuando se encuentran en medio de operaciones de I/O (red, IDB, etc.). Cualquier proceso de larga duración debería poder reanudarse en cualquier momento.

En el caso de un proceso de sincronización que cargó archivos grandes al servidor y se guardó en IDB, nuestra solución para cargas parciales interrumpidas fue aprovechar el sistema reanudable de nuestra biblioteca de carga interna, guardando la URL de carga reanudable en IDB antes de cargar y usar esa URL para reanudar una carga si no se completó la primera vez. Además, antes de cualquier operación de I/O de larga ejecución, el estado se guardaba en IDB para indicar en qué parte del proceso estábamos para cada registro.

### No dependa del estado global {: #global-state }

Debido a que los service workers existen en un contexto diferente, muchos símbolos que podría esperar que existan no están presentes. Gran parte de nuestro código se ejecutó tanto en un contexto `window`, como de service worker (como registro, indicadores, sincronización, etc.). El código debe actuar a la defensiva con respecto a los servicios que utiliza, como el almacenamiento local o las cookies. Puede usar [`globalThis`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/globalThis) para referirse al objeto global de una manera que funcione en todos los contextos. También use los datos almacenados en variables globales con moderación, ya que no hay garantía de cuándo finalizará el script y se desalojará el estado.

### Desarrollo local {: #local-development }

Un componente importante de los service workers es el almacenamiento local en caché de los recursos. Sin embargo, durante el desarrollo, esto es exactamente lo *contrario* de lo que desea, especialmente cuando las actualizaciones se realizan de forma diferida. Todavía desea instalar el service worker para poder depurar problemas con él o trabajar con otras API, como sincronización en segundo plano o notificaciones. En Chrome, puede lograr esto a través de Chrome DevTools habilitando la casilla de verificación **Omitir para la red** (Panel de **aplicaciones** &gt; Panel de **service workers**) además de habilitar la casilla de verificación **Deshabilitar caché** en el panel **Red** para deshabilitar también la memoria caché. Para cubrir más navegadores, optamos por una solución diferente al incluir una bandera para deshabilitar el almacenamiento en caché en nuestro service worker, que está habilitado de forma predeterminada en las compilaciones de desarrolladores. Esto asegura que los desarrolladores siempre obtengan sus cambios más recientes sin problemas de almacenamiento en caché. Es importante incluir el encabezado `Cache-Control: no-cache` para [evitar que el navegador almacene en caché cualquier activo](/http-cache/#unversioned-urls).

### Lighthouse {: #lighthouse}

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) proporciona una serie de herramientas de depuración útiles para las PWA. Para ello, escanea un sitio y genera informes que cubren las PWA, rendimiento, accesibilidad, SEO y otras mejores prácticas. Recomendamos [ejecutar Lighthouse en integración continua](https://github.com/GoogleChrome/lighthouse-ci) para alertarle si incumple uno de los criterios para ser una PWA. En realidad, esto nos sucedió una vez, donde el service worker no estaba instalando y no nos dimos cuenta antes de un impulso de producción. Tener Lighthouse como parte de nuestro CI lo habría evitado.

### Adoptar la entrega continua {: #continuous-delivery }

Debido a que los service workers pueden actualizar automáticamente, los usuarios carecen de la capacidad de limitar las actualizaciones. Esto reduce significativamente la cantidad de clientes desactualizados. Cuando el usuario abría nuestra aplicación, el service worker servía al cliente anterior mientras descargaba el nuevo cliente de manera diferida. Una vez que se descargó el nuevo cliente, le pedirá al usuario que actualice la página para acceder a nuevas funciones. Incluso si el usuario ignoraba esta solicitud, la próxima vez que actualizara la página, recibiría la nueva versión del cliente. Como resultado, es bastante difícil para un usuario rechazar las actualizaciones de la misma manera que lo haría para las aplicaciones de iOS/Android.

Pudimos llevar a cabo cambios importantes en el backend con un tiempo de migración muy corto para los clientes. Por lo general, damos un mes para que los usuarios se actualicen a clientes más nuevos antes de realizar cambios importantes. Dado que la aplicación funcionaría mientras estaba obsoleta, en realidad era posible que los clientes más antiguos existieran si el usuario no había abierto la aplicación durante mucho tiempo. En iOS, los service workers son [desalojados después de un par de semanas](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/#post-10218:~:text=7%2DDay%20Cap%20on%20All%20Script%2DWriteable%20Storage), por lo que este caso no ocurre. Para Android, este problema podría mitigarse si no se publica mientras está obsoleto o si el contenido expira manualmente después de algunas semanas. En la práctica nunca encontramos problemas de clientes obsoletos. Lo estricto que un equipo determinado quiera ser aquí, depende de su caso de uso específico, pero las PWA brindan una flexibilidad significativamente mayor que las aplicaciones de iOS/Android.

### Obtener valores de cookies en un service worker {: #cookies }

A veces es necesario acceder a los valores de las cookies en el contexto de un service worker. En nuestro caso, necesitábamos acceder a los valores de las cookies para generar un token para autenticar las solicitudes de API de origen. En un service worker, las API sincrónicas como `document.cookies` no están disponibles. Siempre puede enviar un mensaje a los clientes activos (con ventana) desde el service worker para solicitar los valores de las cookies, aunque es posible que el service worker se ejecute en segundo plano sin ningún cliente con ventana disponible, como durante una sincronización en segundo plano. Para solucionar esto, creamos un punto final en nuestro servidor frontend que simplemente devolvía el valor de la cookie al cliente. El service worker realizó una solicitud de red a este punto final y leyó la respuesta para obtener los valores de las cookies.

Con el lanzamiento de la [API de tienda de cookies](https://developers.google.com/web/updates/2018/09/asynchronous-access-to-http-cookies), esta solución ya no debería ser necesaria para los navegadores que la admiten, ya que proporciona acceso asincrónico a las cookies del navegador y el service worker puede utilizarla directamente.

## Obstáculos para los service workers no generados {: #pitfalls }

### Asegure el cambio del script del service worker si cambia algún archivo estático en caché {: #regeneration }

Un patrón común de PWA es que un service worker instale todos los archivos de aplicaciones estáticos durante su fase `install`, lo que permite a los clientes acceder directamente a la caché de la API de almacenamiento en caché para todas las visitas posteriores. Los service workers solo se instalan cuando el navegador detecta que el script del service worker ha cambiado de alguna manera, por lo que teníamos que asegurarnos de que el archivo del script del service worker cambiara de alguna manera cuando cambiaba un archivo en caché. Hicimos esto manualmente al incrustar un hash del conjunto de archivos de recursos estáticos dentro de nuestro script de service worker, por lo que cada versión produjo un archivo JavaScript de service worker distinto. Las bibliotecas de service workers como [Workbox](https://developer.chrome.com/docs/workbox/) automatizan este proceso por usted.

### Prueba unitaria {: #unit-testing }

Las API de service worker funcionan agregando detectores de eventos al objeto global. Por ejemplo:

```js
self.addEventListener('fetch', (evt) => evt.respondWith(fetch('/foo')));
```

Esto puede ser difícil de probar porque necesita simular el activador del evento, el objeto del evento, esperar la respuesta `respondWith()` y luego esperar la promesa, antes de finalmente afirmar el resultado. Una forma más fácil de estructurar esto es delegar toda la implementación a otro archivo, lo cual es más fácil de probar.

```js
import fetchHandler from './fetch_handler.js';
self.addEventListener('fetch', (evt) => evt.respondWith(fetchHandler(evt)));
```

Debido a las dificultades de la prueba unitaria de un script de service worker, mantuvimos el script de service worker central lo más básico posible, dividiendo la mayor parte de la implementación en otros módulos. Dado que esos archivos eran solo módulos JS estándar, podrían probarse unitariamente de manera más sencilla con bibliotecas de prueba estándar.

## Estén atentos a las partes 2 y 3 {: #stay-tuned}

En las partes 2 y 3 de esta serie hablaremos sobre la gestión de contenido multimedia y problemas específicos de iOS. Si desea preguntarnos más sobre la creación de una PWA en Google, visite nuestros perfiles de autor para saber cómo contactarnos:

- [Joel](/authors/joelriley)
- [Douglas](/authors/douglasparker)
- [Dikla](/authors/msdikla)
