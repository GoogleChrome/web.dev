---
layout: post
title: 'Workbox: su kit de herramientas para service worker de alto nivel'
authors:
  - jeffposnick
date: 2018-11-05
description: Workbox es un conjunto de herramientas de service worker de alto nivel construido sobre las API de service worker y almacenamiento en caché. Proporciona un conjunto de bibliotecas listas para producción para agregarles soporte sin conexión a las aplicaciones web.
feedback:
  - api
---

Dos API juegan un papel crucial en la creación de aplicaciones web confiables: [Service worker](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) y [Almacenamiento en caché](https://developer.mozilla.org/docs/Web/API/Cache). Pero usarlas de manera efectiva, sin introducir errores sutiles o chocar con casos extremos, puede ser un desafío. Por ejemplo, los errores en el código de su service worker pueden causar problemas de almacenamiento en caché; a los usuarios se les puede mostrar contenido desactualizado o enlaces rotos.

[Workbox](https://developer.chrome.com/docs/workbox/) es un conjunto de herramientas de service worker de alto nivel construido sobre las API de Service worker y Almacenamiento en caché. Proporciona un conjunto de bibliotecas listas para producción para agregarles soporte sin conexión a las aplicaciones web. El kit de herramientas está estructurado en dos colecciones: herramientas que ayudan a administrar el código que se ejecuta dentro de su service worker y herramientas que se integran con su proceso de compilación.

### Código de tiempo de ejecución

Este es el código que se ejecuta dentro de la secuencia de comandos del service worker y controla cómo éste intercepta las solicitudes salientes e interactúa con la API de almacenamiento en caché. Workbox tiene aproximadamente una [docena de módulos de biblioteca en total](https://developer.chrome.com/docs/workbox/modules/), cada una de ellas maneja una variedad de casos de uso especializados. Los módulos más importantes determinan *si* el service worker responderá (conocido como [enrutamiento](https://developer.chrome.com/docs/workbox/modules/workbox-routing/)) y *cómo* responderá (conocido como [estrategia de almacenamiento en caché](https://developer.chrome.com/docs/workbox/modules/workbox-strategies/)).

### Integración de compilación

Workbox ofrece herramientas de [línea de comando](https://developer.chrome.com/docs/workbox/modules/workbox-cli/) ,[módulo Node.js](https://developer.chrome.com/docs/workbox/modules/workbox-build/) y [complemento de paquete web](https://developer.chrome.com/docs/workbox/modules/workbox-webpack-plugin/) que brindan formas alternativas de lograr dos cosas:

- Crear un script de service worker basado en un conjunto de opciones de configuración. El service worker generado usa las bibliotecas de tiempo de ejecución de Workbox "bajo el capó" para poner en acción las estrategias de almacenamiento en caché que usted configura.
- Generar una lista de URL que se deben "[almacenar en caché](https://developer.chrome.com/docs/workbox/modules/workbox-precaching/)", con base en patrones configurables para incluir y excluir archivos generados durante su proceso de compilación.

## ¿Por qué debería utilizar Workbox?

El uso de Workbox al crear su service worker es opcional; existen varias guías que recorren [estrategias comunes de almacenamiento en caché](/offline-cookbook/) desde una perspectiva "básica" de service worker. Si decide utilizar Workbox, estos son algunos de sus beneficios.

### Gestión de caché

Workbox maneja las actualizaciones de caché por usted, ya sea vinculadas a su proceso de compilación cuando se usa el almacenamiento en caché, o mediante políticas configurables de tamaño/antigüedad cuando se usa el almacenamiento en caché en tiempo de ejecución. La API de almacenamiento en caché subyacente es poderosa, pero no tiene ningún soporte integrado para la caducidad de la caché. Herramientas como Workbox llenan ese vacío.

### Amplio registro e informes de errores

Cuando comienza con los service workers, entender *por qué* algo se almacena en caché (o, igualmente frustrante, por qué *no se* almacena en caché) es un desafío. Workbox detecta automáticamente cuándo está ejecutando una versión de desarrollo de su sitio web en `localhost` y activa el registro de depuración en la consola JavaScript de su navegador.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gvsGSU3urfjl52jRcj3j.png", alt="Registro de Workbox en la consola de DevTools", width="800", height="438" %}

SI le hace seguimiento a los mensajes de registro, puede llegar a la raíz de cualquier problema de configuración o invalidación mucho más rápidamente que si lo hiciera solo.

### Una base de código probada en varios navegadores

Workbox se desarrolla contra un conjunto de pruebas de varios navegadores y, cuando es posible, recurre automáticamente a implementaciones alternativas de funciones que faltan en ciertos navegadores.

- El [`workbox-broadcast-cache-update module`](https://developer.chrome.com/docs/workbox/modules/workbox-broadcast-update/) usa la [API de canal de transmisión](https://developer.mozilla.org/docs/Web/API/Broadcast_Channel_API) cuando está disponible, y regresa a una implementación basada en [`postMessage()`](https://developer.mozilla.org/docs/Web/API/Window/postMessage) en los navegadores que carecen de soporte.
- El [módulo workbox-background-sync](https://developer.chrome.com/docs/workbox/modules/workbox-background-sync/) usa la [API de sincronización en segundo plano](https://developer.chrome.com/blog/background-sync/) si es posible, y si no, recurre a reintentar los eventos en cola cada vez que se inicia el service worker.

## ¿Cómo debería utilizar Workbox?

### Integración del marco de trabajo

Si está comenzando un nuevo proyecto desde cero, puede aprovechar la integración de Workbox que se encuentra en muchos kits de inicio y complementos adicionales populares:

- [create-react-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- [vue-cli](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-pwa/README.md)
- [preact-cli](https://github.com/prateekbh/preact-cli-workbox-plugin/blob/master/README.md)
- [Gatsby](https://www.gatsbyjs.org/packages/gatsby-plugin-offline/)
- [Next.js](https://github.com/hanford/next-offline/blob/master/readme.md)

### Agregue Workbox a su proceso de compilación existente

Si ya tiene implementado un proceso de compilación para su sitio, integrar la [línea de comando](https://developer.chrome.com/docs/workbox/modules/workbox-cli/), el [módulo Node.js](https://developer.chrome.com/docs/workbox/modules/workbox-build/) o la [herramienta de complemento de paquete web](https://developer.chrome.com/docs/workbox/modules/workbox-webpack-plugin/) apropiados puede ser todo lo que necesita para comenzar con el uso de Workbox.

En particular, la interfaz de línea de comandos de Workbox facilita la puesta en marcha, con un modo `wizard` que verificará su entorno de desarrollo local y sugerirá una configuración predeterminada razonable que podría usar en el futuro:

```bash
workbox wizard
? ¿Cuál es el directorio raíz de su aplicación web (es decir, cuál directorio de su implementación)? src/
? ¿Cuáles tipos de archivo quisiera almacenar previamente en caché? css, js, html
? ¿Dónde quisiera que se guardara su archivo de service worker? build/sw.js
? ¿Dónde quisiera guardar estas opciones de configuración? workbox-config.js
```

Para construir su service worker, ejecute `workbox generateSW workbox-config.js` como parte de un proceso de compilación. Consulte la [documentación de `generateSW`](https://goo.gl/fdTQBf) para obtener más detalles. Puede personalizar aún más su service worker si realiza cambios en `workbox-config.js`. Consulte la [documentación de las opciones](https://goo.gl/gVo87N) para obtener más detalles.

### Use Workbox en tiempo de ejecución en un service worker existente

Si tiene un service worker existente y desea probar las bibliotecas en tiempo de ejecución de Workbox, [importe Workbox desde su CDN oficial](https://developer.chrome.com/docs/workbox/modules/workbox-sw/#using-workbox-sw-via-cdn) y comience a usarlo para el almacenamiento en caché en tiempo de ejecución de inmediato. Tenga en cuenta que este caso de uso significa que no podrá aprovechar el almacenamiento en caché (que requiere integración en el tiempo de compilación), pero es excelente para crear prototipos y probar diferentes estrategias de almacenamiento en caché sobre la marcha.

```js
// Remplace 3.6.3 con el número de versión actual de Workbox.
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox.routing.registerRoute(
  new RegExp('\.png$'),
  workbox.strategies.cacheFirst({
    cacheName: 'images-cache',
  })
);
```
