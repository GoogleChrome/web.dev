---
layout: post
title: Carga el JavaScript de terceros de manera eficiente
subhead: Evita los errores comunes de usar scripts de terceros para mejorar los tiempos de carga y la experiencia del usuario.
authors:
  - mihajlija
date: 2019-08-14
description: |2-

  Aprende a evitar los errores comunes de usar scripts de terceros para mejorar los tiempos de carga y la experiencia del usuario.
hero: image/admin/udp7L9LSo5mfI3F0tvNY.jpg
alt: Vista aérea de contenedores de envío.
codelabs: codelab-optimize-third-party-javascript
tags:
  - performance
  - javascript
---

Si un script de terceros está [ralentizando](/third-party-javascript/) la carga de tu página, tienes dos opciones para mejorar el rendimiento:

- Eliminarlo si no agrega algún valor claro a tu sitio.

- Optimiza el proceso de carga.

Esta publicación explica cómo optimizar el proceso de carga de scripts de terceros con las siguientes técnicas:

1. Usar el atributo de `async` o de `defer` en etiquetas `<script>`

2. Establecer conexiones tempranas con los orígenes requeridos

3. Carga diferida

4. Optimización de la forma en que se sirven los scripts de terceros

## Usar `async` o `defer`

Debido a que los [scripts síncronos](/third-party-javascript/) retrasan la construcción y la representación del DOM, siempre debes de cargar scripts de terceros de forma asincrónica a menos que el script tenga que ejecutarse antes de que se pueda procesar la página.

Los atributos de `async` y `defer` le dicen al navegador que puede seguir analizando el HTML mientras carga el script en segundo plano y que luego ejecute el script después de que se cargue. De esta forma, las descargas de scripts no bloquean la construcción del DOM ni la representación de la página. El resultado es que el usuario puede ver la página antes de que todos los scripts hayan terminado de cargarse.

```html
<script async src="script.js">

<script defer src="script.js">
```

La diferencia entre `async` y `defer` recae en cuando se comienzan a ejecutar los scripts.

### `async`

Los scripts con el atributo de `async` se ejecutan en la primera oportunidad después de que terminan de descargarse y antes del evento de [carga](https://developer.mozilla.org/docs/Web/Events/load) de la ventana. Esto significa que es posible (y probable) que los scripts de `async` no se ejecuten en el orden en que aparecen en el HTML. También significa que pueden interrumpir la construcción del DOM si terminan de descargar mientras el analizador todavía está en funcionamiento.

{% Img src="image/admin/tCqsJ3E7m4lpKOprXu5B.png", alt="Diagrama de secuencia de comandos de bloqueo del analizador con atributo async", width="800", height="252" %}

### `defer`

Los scripts con el atributo de `defer` se ejecutan después de que el análisis de HTML esté completamente terminado, pero antes del evento de [`DOMContentLoaded`](https://developer.mozilla.org/docs/Web/Events/DOMContentLoaded). `defer` garantiza que los scripts se ejecutarán en el orden en que aparecen en el HTML y no bloquearán el analizador.

{% Img src="image/admin/Eq0mcvDALKibHe15HspN.png", alt="Diagrama del flujo del analizador con un script con atributo defer", width="800", height="253" %}

- Utiliza `async` si es importante que la secuencia de comandos se ejecute antes en el proceso de carga.

- Utiliza `defer` para recursos menos críticos. Un reproductor de video que se encuentra en la mitad inferior de la página, por ejemplo.

El uso de estos atributos puede acelerar significativamente la carga de la página. Por ejemplo, [Telegraph recientemente aplazó todos sus scripts](https://medium.com/p/a0a1000be5#4123), incluyendo los anuncios y análisis, y mejoró el tiempo de carga de anuncios en un promedio de cuatro segundos.

{% Aside %} Las secuencias de comandos de análisis generalmente se cargan temprano para que no se pierda ningún dato analítico valioso. Afortunadamente, existen [patrones para inicializar el análisis de forma diferida](https://philipwalton.com/articles/the-google-analytics-setup-i-use-on-every-site-i-build/) mientras se retienen los datos de carga de la página inicial. {% endAside %}

## Establecer conexiones tempranas con los orígenes requeridos

Puedes ahorrar entre 100 y 500 ms si [estableces conexiones tempranas](/preconnect-and-dns-prefetch/) con importantes orígenes de terceros.

Dos tipos de [`<link>`](https://developer.mozilla.org/docs/Web/HTML/Element/link) pueden ayudar aquí:

- `preconnect`

- `dns-prefetch`

### `preconnect`

`<link rel="preconnect">` le informa al navegador que tu página tiene la intención de establecer una conexión con otro origen y que desea que el proceso comience lo antes posible. Cuando se realiza la consulta de un recurso desde el origen preconectado, la descarga comienza inmediatamente.

```html
<link rel="preconnect" href="https://cdn.example.com">
```

{% Aside 'caution' %} Conéctate previamente solo a los dominios críticos que usarás pronto porque el navegador cierra cualquier conexión que no se use en 10 segundos. La preconexión innecesaria puede retrasar otros recursos importantes, así que limita la cantidad de dominios preconectados y [prueba el impacto que tiene la preconexión](https://andydavies.me/blog/2019/08/07/experimenting-with-link-rel-equals-preconnect-using-custom-script-injection-in-webpagetest/). {% endAside %}

### `dns-prefetch`

El `<link rel="dns-prefetch>` maneja un pequeño subconjunto de lo que maneja `<link rel="preconnect">`. El establecimiento de una conexión implica la búsqueda de DNS y el protocolo de enlace de TCP, y para orígenes seguros, negociaciones de TLS. `dns-prefetch` instruye al navegador solo resolver el DNS de un dominio específico antes de que se haya llamado explícitamente.

La sugerencia de `preconnect` se utiliza mejor solo para las conexiones más críticas; para dominios de terceros menos críticos, utiliza `<link rel=dns-prefetch>`.

```html
<link rel="dns-prefetch" href="http://example.com">
```

[La compatibilidad del navegador con `dns-prefetch`](https://caniuse.com/#search=dns-prefetch) es ligeramente diferente a la [compatibilidad con `preconnect`](https://caniuse.com/#search=preconnect), por lo que `dns-prefetch` puede servir como respaldo para los navegadores que no sean compatibles con `preconnect`. Utiliza etiquetas de enlace independientes para implementar esto de forma segura:

```html
<link rel="preconnect" href="http://example.com">
<link rel="dns-prefetch" href="http://example.com">
```

## Recursos de terceros de carga diferida

Los recursos de terceros integrados pueden contribuir en gran medida a reducir la velocidad de la página cuando se construyen de una forma deficiente. Si no son críticos o están en la mitad inferior de la página (es decir, si los usuarios tienen que desplazarse para verlos), la carga diferida es una buena manera de mejorar la velocidad de la página y las métricas de contenido. De esta manera, los usuarios obtendrán el contenido de la página principal más rápido y tendrán una mejor experiencia.

<figure data-float="left">{% Img src="image/admin/uzPZzkgzfrv2Oy3UQPrN.png", alt="Un diagrama de una página web que se muestra en un dispositivo móvil con contenido desplazable que se extiende más allá de la pantalla. El contenido que está debajo de la página no está saturado porque no está cargado todavía.", width="366", height="438" %}</figure>

Un enfoque eficaz es cargar contenido de terceros de forma diferida después de que se cargue el contenido de la página principal. Los anuncios son un buen candidato para este enfoque.

Los anuncios son una fuente importante de ingresos para muchos sitios, pero los usuarios vienen por el contenido. Al cargar anuncios de forma diferida y entregar el contenido principal más rápido, puedes aumentar el porcentaje de visibilidad general de un anuncio. Por ejemplo, MediaVine cambió a [anuncios de carga diferida](https://www.mediavine.com/lazy-loading-ads-mediavine-ads-load-200-faster/) y vio una mejora del 200% en la velocidad de carga de la página. DoubleClick tiene orientación sobre cómo cargar anuncios en forma diferida en su [documentación oficial](https://support.google.com/dfp_premium/answer/4578089#lazyloading).

Un enfoque alternativo es cargar contenido de terceros solo cuando los usuarios se desplazan hacia abajo en dirección hacia sección de la página.

[Intersection Observer](https://developer.chrome.com/blog/intersectionobserver/) es una API de navegador que detecta de manera eficiente cuando un elemento entra o sale de la ventana gráfica del navegador y se puede utilizar para implementar esta técnica. [lazysizes](/use-lazysizes-to-lazyload-images/) es una biblioteca popular de JavaScript cargar imágenes y [`iframes`](http://afarkas.github.io/lazysizes/#examples) de manera diferida. Es compatible con incrustaciones y [widgets de](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/unveilhooks) YouTube. También tiene [compatibilidad opcional](https://github.com/aFarkas/lazysizes/blob/097a9878817dd17be3366633e555f3929a7eaaf1/src/lazysizes-intersection.js) para IntersectionObserver.

{% Aside 'caution' %} Ten cuidado al cargar recursos de forma diferida con JavaScript. Si JavaScript no se carga, quizás debido a condiciones de red inestables, tus recursos no se cargarán. {% endAside %}

El uso del atributo de [`loading` para imágenes de carga diferida e iframes](/browser-level-image-lazy-loading/) es una excelente alternativa a las técnicas de JavaScript, ¡y recientemente ya se encuentra disponible en Chrome 76!

## Optimiza la forma en que sirves scripts de terceros

### Alojamiento en CDN de terceros

Es común que terceros proporcionen URL de archivos de JavaScript que ellos alojan, los cuales generalmente se encuentran en una [red de entrega de contenido (CDN)](https://en.wikipedia.org/wiki/Content_delivery_network). Los beneficios de este enfoque son que puedes comenzar rápidamente, simplemente es copiar y pegar la URL, y no hay gastos de mantenimiento. El proveedor externo maneja la configuración del servidor y las actualizaciones de secuencias de comandos.

Pero debido a que no están en el mismo origen que el resto de tus recursos, cargar archivos desde una CDN pública tiene un costo de red. El navegador debe realizar una búsqueda de DNS, establecer una nueva conexión HTTP y, en orígenes seguros, realizar un protocolo de enlace SSL con el servidor del proveedor.

Cuando utilizas archivos desde servidores de terceros, rara vez tienes control sobre el almacenamiento en caché. Depender de la estrategia de almacenamiento en caché de otra persona podría provocar que los scripts se recuperen innecesariamente de la red con demasiada frecuencia.

### Auto-hospedaje de scripts de terceros

Los scripts de terceros auto-hospedados es una opción que te da más control sobre el proceso de carga de un script. Al auto-hospedarse, puede:

- Reducir los tiempos de búsqueda de DNS y de ida y vuelta.
- Mejora las cabeceras de [almacenamiento en caché HTTP](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching).
- Aprovechar [HTTP/2 server push](/performance-http2/).

Por ejemplo, Casper se las arregló para [reducir en 1,7 segundos](https://medium.com/caspertechteam/we-shaved-1-7-seconds-off-casper-com-by-self-hosting-optimizely-2704bcbff8ec) el tiempo de carga al autohospedar un script de Prueba A/B.

Sin embargo, el auto-hospedaje tiene una gran desventaja: los scripts pueden quedar desactualizados y no recibirán actualizaciones automáticas cuando haya un cambio de API o una solución y cambio de seguridad.

{% Aside 'caution' %}

La actualización manual de los scripts puede agregar una gran cantidad de gastos generales a su proceso de desarrollo y es posible que se pierda actualizaciones importantes. Si no estás <br> utilizando el alojamiento CDN para servir todos los recursos, también te estás perdiendo del [almacenamiento en caché perimetral](https://www.cloudflare.com/learning/cdn/glossary/edge-server/) y debes de optimizar la compresión de tu servidor. {% endAside%}

### Utiliza los service workers para almacenar en caché los scripts de los servidores de terceros

Una alternativa al auto-hospedaje que te permite un mayor control sobre el almacenamiento en caché al mismo tiempo que obtienes los beneficios de CDN de terceros es [utilizar los service workers para almacenar en caché los scripts de servidores de terceros](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#cross-origin-considerations). Esto te da control sobre la frecuencia con la que se recuperan los scripts de la red y hace posible crear una estrategia de carga que limita las solicitudes de recursos de terceros no esenciales hasta que la página llega a un momento clave para el usuario. El uso de `preconnect` para establecer conexiones tempranas en este caso también puede mitigar los costos de la red hasta cierto punto.
