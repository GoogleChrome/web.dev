---
layout: post
title: Eliminar JavaScript no utilizado
description: Aprenda a aprobar la auditoría "Eliminar JavaScript no utilizado" de Lighthouse.
web_lighthouse:
  - JavaScript no utilizado
date: '2020-07-07'
---

El JavaScript no utilizado puede ralentizar la velocidad de carga de su página:

- Si JavaScript [bloquea el procesamiento] , el navegador debe descargar, analizar, compilar y evaluar el script antes de que pueda continuar con todo el trabajo que se necesita para procesar la página.
- Incluso si el JavaScript es asíncrono (es decir, no bloquea el procesamiento), el código compite por el ancho de banda con otros recursos mientras se descarga, lo que tiene importantes implicaciones en el rendimiento. Enviar código no utilizado a través de la red también es un desperdicio para los usuarios móviles que no tienen planes de datos ilimitados.

## Cómo falla la auditoría de JavaScript no utilizada

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) marca cada archivo JavaScript con más de 20 kibibytes de código no utilizado:

<figure class="w-figure"><img class="w-screenshot" src="remove-unused-javascript.jpg" alt="Una captura de pantalla de la auditoría."><figcaption class="w-figcaption"> Haga clic en un valor en la <b>columna URL</b> para abrir el código fuente del script en una nueva pestaña.</figcaption></figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo eliminar JavaScript no utilizado

### Detectar JavaScript no utilizado

La [pestaña Cobertura] en Chrome DevTools puede brindarle un desglose línea por línea del código no utilizado.

La [`Coverage`](https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-coverage) en Titiritero puede ayudarlo a automatizar el proceso de detección de código no utilizado y extracción de código usado.

### Herramienta de compilación de soporte para eliminar código no utilizado

Consulte las siguientes [pruebas de Tooling.Report] para averiguar si su agrupador admite funciones que facilitan evitar o eliminar el código no utilizado:

- [División de código]
- [Eliminación de código no utilizado]
- [Código importado no utilizado]

## Recursos

- [Código fuente para la auditoría **Eliminar código no utilizado**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unused-javascript.js)
- [Eliminar el código no utilizado](/remove-unused-code/)
- [Agregar interactividad con JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript)
- [División de código](https://bundlers.tooling.report/code-splitting/)
- [Eliminación de código muerto](https://bundlers.tooling.report/transformations/dead-code/)
- [Código importado muerto](https://bundlers.tooling.report/transformations/dead-code-dynamic/)
- [Encuentre código JavaScript y CSS no utilizado con la pestaña Cobertura en Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/coverage)
- [clase: `Coverage`](https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-coverage)


[bloquea el procesamiento]: https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript
[pestaña Cobertura]: https://developers.google.com/web/tools/chrome-devtools/coverage
[División de código]: https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-coverage
[Eliminación de código no utilizado]: https://bundlers.tooling.report/code-splitting/
[Código importado no utilizado]: https://bundlers.tooling.report/transformations/dead-code/
[pruebas de Tooling.Report]: https://bundlers.tooling.report/transformations/dead-code-dynamic/