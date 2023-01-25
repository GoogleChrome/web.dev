---
layout: post
title: Métricas personalizadas
authors:
  - philipwalton
date: 2019-11-08
description: |2-

  Las métricas personalizadas te permiten medir y optimizar aspectos de las experiencias que son exclusivas de tu sitio.
tags:
  - performance
  - metrics
---

Es muy valioso tener [métricas centradas en el usuario](/user-centric-performance-metrics/) que puedas medir, universalmente, en cualquier sitio web. Estas métricas te permiten:

- Comprender cómo los usuarios reales experimentan la web en su totalidad
- Comparar fácilmente tu sitio con la competencia
- Realizar un seguimiento de datos útiles y procesables en tus herramientas de análisis sin necesidad de escribir código personalizado

Las métricas universales ofrecen una buena línea de base, pero en muchos casos es necesario medir *más* que estas métricas para capturar la experiencia completa de su sitio en particular.

Las métricas personalizadas te permiten medir aspectos de la experiencia de tu sitio que solo pueden aplicarse a tu sitio, como lo pueden ser:

- Cuánto tiempo tarda una aplicación de una sola página (SPA) en pasar de una "página" a otra
- Cuánto tiempo tarda una página en mostrar los datos obtenidos de una base de datos para los usuarios que han iniciado sesión
- Cuánto tiempo tarda una aplicación renderizada en el lado del servidor (SSR) en [hydrate](https://addyosmani.com/blog/rehydration/)
- La tasa de aciertos de caché para los recursos cargados por visitantes recurrentes
- La latencia de eventos de un clic o de un teclado en un juego

## API para medir métricas personalizadas

Históricamente, los desarrolladores web no han tenido muchas API de bajo nivel para medir el rendimiento y como resultado han tenido que recurrir a hacks para medir si un sitio estaba funcionando bien.

Por ejemplo, es posible determinar si el hilo principal está bloqueado debido a tareas de JavaScript de larga duración mediante el uso de `requestAnimationFrame` y calculando el delta entre cada fotograma. Si el delta es significativamente más largo que la velocidad de fotogramas de la pantalla, puedes determinarlo como una tarea larga. Sin embargo, estos trucos no se recomiendan porque en realidad ellos mismos afectan el rendimiento (por ejemplo, drenando la batería del dispositivo).

La primera regla de la medición del desempeño efectiva es asegurarse de que tus técnicas de medición del desempeño no causen problemas de desempeño. Por lo tanto, para cualquier métrica personalizada que midas en tu sitio, es mejor usar una de las siguientes API si es posible.

### Performance Observer (Observador de desempeño)

Comprender la API de PerformanceObserver es fundamental para crear métricas de rendimiento personalizadas porque es el mecanismo mediante el cual obtiene datos de todas las demás API de rendimiento que se analizan en este artículo.

Con `PerformanceObserver`, podrás suscribirse pasivamente a eventos relacionados con el rendimiento, lo que significa que estas API generalmente no interferirán con el rendimiento de la página, ya que sus retrollamadas (callbacks) generalmente se activan durante los [períodos de inactividad](https://w3c.github.io/requestidlecallback/#idle-periods).

Puedes crear un `PerformanceObserver` pasándole una retrollamada para que se ejecute siempre que se envíen nuevas entradas de rendimiento. Luego le dice al observador qué tipos de entradas debe escuchar a través del método [`observe()`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver/observe):

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });

  po.observe({type: 'some-entry-type'});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

Las siguientes secciones enumeran todos los tipos de entradas disponibles para la observación, pero en los navegadores más recientes puedes inspeccionar qué tipos de entrada están disponibles a través de la propiedad [`PerformanceObserver.supportedEntryTypes`](https://w3c.github.io/performance-timeline/#supportedentrytypes-attribute).

{% Aside %} El objeto pasado al `observe()` también puede especificar un arreglo de `entryTypes` (para observar más de un tipo de entrada a través del mismo observador). Si bien especificar `entryTypes` es una opción más antigua con un soporte de navegador más amplio, hoy en día se recomienda usar `type` ya que permite especificar una configuración de observación adicional específica de la entrada (como la bandera de `buffered`, que se analizará a continuación). {% endAside %}

#### Observando entradas que ya sucedieron

De forma predeterminada, los objetos de `PerformanceObserver` solo pueden observar las entradas a medida que ocurren. Esto puede ser problemático si deseas cargar tu código de análisis de rendimiento de forma diferida (para no bloquear los recursos de mayor prioridad).

Para obtener entradas históricas (después de que hayan ocurrido), define la bandera de `buffered` a  `true` cuando llames a `observe()`. El navegador incluirá entradas históricas de su [búfer de entrada de rendimiento](https://w3c.github.io/performance-timeline/#dfn-performance-entry-buffer) la primera vez que se llame a la retrollamada  de `PerformanceObserver`.

```js
po.observe({
  type: 'some-entry-type',
  buffered: true,
});
```

{% Aside %} Para evitar problemas de memoria, el búfer de entrada de rendimiento no es ilimitado. Para la mayoría de las cargas de páginas típicas, es poco probable que el búfer se llene y se pierdan las entradas. {% endAside %}

#### API de rendimiento obsoletas que se deben de evitar

Antes de la API de Performance Observer, los desarrolladores podían acceder a las entradas de rendimiento mediante los siguientes tres métodos definidos en el objeto de [`performance`](https://w3c.github.io/performance-timeline/):

- [`getEntries()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntries)
- [`getEntriesByName()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByName)
- [`getEntriesByType()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByType)

Si bien estas API aún son compatibles, no se recomienda su uso porque no te permiten escuchar cuándo se emiten nuevas entradas. Además, muchas API nuevas (como Long Tasks) no se exponen a través del `performance`, solo se exponen a través del `PerformanceObserver`.

A menos que necesites específicamente compatibilidad con Internet Explorer, es mejor evitar estos métodos en su código y usar `PerformanceObserver` en el futuro.

### API de User Timing

La [API de User Timing (Tiempo de usuario)](https://w3c.github.io/user-timing/) es un API de medición de propósito general para métricas basadas en el tiempo. Te permite marcar arbitrariamente puntos en el tiempo y luego medir la duración entre esas marcas.

```js
// Record the time immediately before running a task.
performance.mark('myTask:start');
await doMyTask();
// Record the time immediately after running a task.
performance.mark('myTask:end');

// Measure the delta between the start and end of the task
performance.measure('myTask', 'myTask:start', 'myTask:end');
```

Si bien las API como `Date.now()` o `performance.now()` brindan capacidades similares, el beneficio de usar la API de User Timing es que se integra bien con las herramientas de rendimiento. Por ejemplo, Chrome DevTools visualiza las [mediciones de User Timing en el panel de Rendimiento](https://developers.google.com/web/updates/2018/04/devtools#tabs), y muchos proveedores de análisis también realizarán un seguimiento automático de cualquier medición que se realice y enviarán los datos de duración a su back-end de análisis.

Para informar las mediciones del User Timing puede utilizar [PerformanceObserver](#performance-observer) y registrarlas para observar las entradas de tipo `measure`:

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });
  // Start listening for `measure` entries to be dispatched.
  po.observe({type: 'measure', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### API de Long Tasks

La [API de Long Tasks (Tareas largas)](https://w3c.github.io/longtasks/) es útil para saber cuándo el hilo principal del navegador está bloqueado durante el tiempo suficiente para afectar la velocidad de fotogramas o la latencia de entrada. Actualmente, la API informará sobre cualquier tarea que se ejecute durante más de 50 milisegundos (ms).

Siempre que necesites ejecutar un código costoso (o cargar y ejecutar scripts de gran tamaño), es útil realizar un seguimiento de si ese código bloqueó o no el hilo principal. De hecho, muchas métricas de nivel superior se construyen sobre la API de Long Tasks (como [Time to Interactive (TTI): Tiempo para interactividad](/tti/) y [Total Blocking Time (TBT): Tiempo total de bloqueo](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/)).

Para determinar cuándo ocurren las tareas largas, puedes usar [PerformanceObserver](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) y registrarlas para observar entradas de tipo `longtask`:

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });
  // Start listening for `longtask` entries to be dispatched.
  po.observe({type: 'longtask', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### API de Element Timing

La [métrica de Largest Contentful Paint (LCP): Despliegue del contenido más extenso](/lcp/) es útil para saber cuándo se pintó la imagen o el bloque de texto más grande en la pantalla, pero en algunos casos se desea medir el tiempo de renderizado de un elemento diferente.

Para estos casos, puedes utilizar la [API Element Timing (Tiempo de elementos)](https://wicg.github.io/element-timing/). De hecho, la API de Largest Contentful Paint en realidad se basa en la API de Element Timing y agrega informes automáticos del elemento con contenido más grande, pero puede informar sobre elementos adicionales agregando explícitamente el `elementtiming` y registrando un PerformanceObserver para su observación del tipo de entrada del elemento.

```html
<img elementtiming="hero-image" />
<p elementtiming="important-paragraph">This is text I care about.</p>
...
<script>
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });
  // Start listening for `element` entries to be dispatched.
  po.observe({type: 'element', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
</script>
```

{% Aside 'gotchas' %} Los tipos de elementos considerados para la Pintura de contenido más grande son los mismos que los observables a través de la API de Element Timing. Si agregas el atributo de `elementtiming` a un elemento que no es de esos tipos, el atributo se ignorará. {% endAside %}

### API de Event Timing

La [métrica First Input Delay (FID): Demora de la primera entrada](/fid/) mide el tiempo desde que un usuario interactúa por primera vez con una página hasta el momento en que el navegador puede comenzar a procesar los controladores de eventos en respuesta a esa interacción. Sin embargo, en algunos casos también puede ser útil medir el tiempo de procesamiento del evento en sí, así como el tiempo hasta que se pueda procesar el siguiente fotograma.

Esto es posible con la [API de Event Timing (Tiempo del evento)](https://wicg.github.io/event-timing/) (que se utiliza para medir el FID), ya que expone una serie de marcas de tiempo en el ciclo de vida del evento, que incluyen:

- [`startTime`](https://w3c.github.io/performance-timeline/#dom-performanceentry-starttime): el tiempo cuando el navegador recibe el evento.
- [`processingStart`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingstart): el tiempo en que el navegador puede comenzar a procesar los controladores de eventos para el evento.
- [`processingEnd`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingend): el tiempo en que el navegador termina de ejecutar todo el código síncrono iniciado desde los controladores de eventos para este evento.
- [`duration`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingstart): el tiempo (redondeado a 8 ms por razones de seguridad) entre el momento en que el navegador recibe el evento hasta que puede pintar el siguiente cuadro después de terminar de ejecutar todo el código síncrono iniciado desde los controladores de eventos.

El siguiente ejemplo muestra cómo utilizar estos valores para crear medidas personalizadas:

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  const po = new PerformanceObserver((entryList) => {
    const firstInput = entryList.getEntries()[0];

    // Measure First Input Delay (FID).
    const firstInputDelay = firstInput.processingStart - firstInput.startTime;

    // Measure the time it takes to run all event handlers
    // Note: this does not include work scheduled asynchronously using
    // methods like `requestAnimationFrame()` or `setTimeout()`.
    const firstInputProcessingTime = firstInput.processingEnd - firstInput.processingStart;

    // Measure the entire duration of the event, from when input is received by
    // the browser until the next frame can be painted after processing all
    // event handlers.
    // Note: similar to above, this value does not include work scheduled
    // asynchronously using `requestAnimationFrame()` or `setTimeout()`.
    // And for security reasons, this value is rounded to the nearest 8ms.
    const firstInputDuration = firstInput.duration;

    // Log these values the console.
    console.log({
      firstInputDelay,
      firstInputProcessingTime,
      firstInputDuration,
    });
  });

  po.observe({type: 'first-input', buffered: true});
} catch (error) {
  // Do nothing if the browser doesn't support this API.
}
```

### API de tiempo de recursos

La [API Resource Timing (Tiempo de recursos)](https://w3c.github.io/resource-timing/) ofrece a los desarrolladores información detallada sobre cómo se cargaron los recursos para una página en particular. A pesar del nombre de la API, la información que proporciona no se limita solo a los datos de tiempo (aunque hay [mucho de eso](https://w3c.github.io/resource-timing/#processing-model)). Otros datos a los que se pueden acceder incluyen:

- [InitiatorType](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-initiatortype): cómo se obtuvo el recurso, por ejemplo, de una etiqueta de `<script>` o `<link>`, o de `fetch()`
- [nextHopProtocol](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-nexthopprotocol): el protocolo utilizado para obtener el recurso, como `h2` o `quic`
- [encodedBodySize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-encodedbodysize)/[decodedBodySize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-decodedbodysize)]: el tamaño del recurso en su forma codificada o decodificada (respectivamente)
- [transferSize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-transfersize): el tamaño del recurso que realmente se transfirió a través de la red. Cuando los recursos se completan a través de la caché, este valor puede ser mucho menor que `encodedBodySize` y en algunos casos, puede ser cero (si no se requiere una revalidación de la caché).

Ten en cuenta que puedes utilizar la propiedad de `transferSize` de las entradas de tiempo de recursos para medir una *métrica de tasa de aciertos de caché* o incluso una *métrica de tamaño total de recursos almacenados en caché*, que puede ser útil para comprender cómo tu estrategia de almacenamiento en caché de recursos afecta el rendimiento de los visitantes habituales.

El siguiente ejemplo registra todos los recursos consultados por la página e indica si cada recurso se completó o no a través de la caché.

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // If transferSize is 0, the resource was fulfilled via the cache.
      console.log(entry.name, entry.transferSize === 0);
    }
  });
  // Start listening for `resource` entries to be dispatched.
  po.observe({type: 'resource', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### API de Navigation Timing

La [API de Navigation Timing (Tiempo de navegación)](https://w3c.github.io/navigation-timing/) es similar a la API de Resource Timing, pero solo informa sobre [las consultas de navegación](https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests). El tipo de entrada de `navigation` también es similar al tipo de entrada de `resource`, pero contiene [información adicional](https://w3c.github.io/navigation-timing/#sec-PerformanceNavigationTiming) específica solo para las consultas de navegación (como cuando se disparan los eventos de `DOMContentLoaded` y `load`).

Una métrica que muchos desarrolladores siguen para comprender el tiempo de respuesta del servidor ([Time to First Byte (TTFB): Tiempo hasta el primer byte](https://en.wikipedia.org/wiki/Time_to_first_byte)) está disponible a través de la API de Navigation Timing, específicamente, la marca de tiempo de `responseStart`.

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // If transferSize is 0, the resource was fulfilled via the cache.
      console.log('Time to first byte', entry.responseStart);
    }
  });
  // Start listening for `navigation` entries to be dispatched.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

Otra métrica que les puede interesar a los desarrolladores de métricas que utilizan el service worker es el tiempo de inicio del service worker para las consultas de navegación. Esta es la cantidad de tiempo que le toma al navegador iniciar el subproceso del service worker antes de que pueda comenzar a interceptar eventos de fetch (recuperación).

El tiempo de inicio del service worker para una solicitud de navegación en particular se puede determinar a partir del delta entre `entry.responseStart` y `entry.workerStart`.

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('Service Worker startup time:',
          entry.responseStart - entry.workerStart);
    }
  });
  // Start listening for `navigation` entries to be dispatched.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### API de Server Timing

La [API de Server Timing (Tiempo del servidor)](https://w3c.github.io/server-timing/) te permite pasar datos de tiempos específicos de la solicitud desde tu servidor al navegador a través de cabeceras de respuesta. Por ejemplo, se puede indicar cuánto tiempo se tardó en buscar datos en una base de datos para una solicitud en particular, lo que puede ser útil para depurar problemas de rendimiento causados por la lentitud en el servidor.

Para los desarrolladores que utilizan proveedores de análisis de terceros, la API de Server Timing es la única forma de correlacionar los datos de rendimiento del servidor con otras métricas comerciales que estas herramientas de análisis pueden estar midiendo.

Para especificar los datos de tiempo del servidor en sus respuestas, puedes usar la cabecera de respuesta de `Server-Timing`. Aquí un ejemplo.

```http
HTTP/1.1 200 OK

Server-Timing: miss, db;dur=53, app;dur=47.2
```

Luego, desde tus páginas, puedes leer estos datos en `resource` o en `navigation` de las API de Resource Timing y Navigation Timing respectivamente.

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Logs all server timing data for this response
      console.log('Server Timing', entry.serverTiming);
    }
  });
  // Start listening for `navigation` entries to be dispatched.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```
