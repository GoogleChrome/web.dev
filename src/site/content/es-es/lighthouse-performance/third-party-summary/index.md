---
layout: post
title: Reducir el impacto del código de terceros
description: Descubra cómo el código de terceros, como las redes publicitarias y los servicios de análisis, afecta el rendimiento de carga de la página y cómo puede optimizar el código de terceros.
date: '2019-05-02'
updated: '2019-10-04'
web_lighthouse:
  - resumen de terceros
---

Para agregar una red de publicidad, un botón de redes sociales, una prueba A / B o un servicio de análisis a su página, generalmente necesita agregar un script de terceros a su HTML. Estos [scripts de terceros pueden afectar significativamente el rendimiento de carga de su página](/third-party-javascript/) .

## Cómo falla la auditoría de Lighthouse para código de terceros

Lighthouse marca las páginas que tienen código de terceros que bloquea el [hilo principal] durante 250 ms o más:

<figure class="w-figure"><img class="w-screenshot" src="third-party-summary.png" alt="Una captura de pantalla de Lighthouse Reduce el impacto de la auditoría de código de terceros"></figure>

Un script de terceros es cualquier script alojado en un dominio que es diferente al dominio de la URL que auditó con Lighthouse. A medida que se carga la página, Lighthouse calcula cuánto tiempo cada uno de los scripts de terceros bloquea el hilo principal. Si el tiempo total de bloqueo es superior a 250 ms, la auditoría falla.

## Cómo reducir el impacto del código de terceros

Consulte [Identificar scripts lentos de terceros](/identify-slow-third-party-javascript/) para aprender a usar Chrome DevTools y otras auditorías Lighthouse para detectar código de terceros problemático, y consulte [Cargar JavaScript de terceros de manera eficiente](/efficiently-load-third-party-javascript/) para estrategias de optimización.

## Recursos

- [Código fuente para **reducir el impacto de la** auditoría de código de terceros](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/third-party-summary.js)
- [Cargando JavaScript de terceros](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript/)


[hilo principal]: https://developer.mozilla.org/en-US/docs/Glossary/Main_thread