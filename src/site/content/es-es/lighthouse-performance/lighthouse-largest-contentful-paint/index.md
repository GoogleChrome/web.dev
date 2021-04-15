---
layout: post
title: Pintura con contenido más grande
description: Obtenga información sobre la métrica de pintura con contenido más grande de Lighthouse y cómo medirla y optimizarla.
date: '2020-01-10'
web_lighthouse:
  - pintura de mayor contenido
---

La pintura de contenido más grande (LCP) es una de las métricas de la **sección Rendimiento** del informe Lighthouse. Cada métrica captura algún aspecto de la velocidad de carga de la página.

Lighthouse muestra LCP en segundos:

<figure class="w-figure"><img class="w-screenshot" src="largest-contentful-paint.png" alt="Una captura de pantalla de la auditoría de pintura con contenido más grande de Lighthouse"></figure>

## Qué mide LCP

LCP mide cuándo se representa en la pantalla el elemento de contenido más grande de la ventana gráfica. Esto se aproxima cuando el contenido principal de la página es visible para los usuarios. Consulte [Definición de pintura con contenido más grande] para obtener más detalles sobre cómo se determina el LCP.

## Cómo Lighthouse determina su puntaje LCP

Soporte de navegador para LCP lanzado en [Chrome 77] . Lighthouse extrae datos LCP de [la herramienta de rastreo](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) de Chrome.

La siguiente tabla muestra cómo interpretar su puntuación LCP:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Tiempo LCP<br> (en segundos)</th>
        <th>Código de colores</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0-2,5</td>
        <td>Verde (rápido)</td>
      </tr>
      <tr>
        <td>2.5-4</td>
        <td>Naranja (moderado)</td>
      </tr>
      <tr>
        <td>Más de 4</td>
        <td>Rojo (lento)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo mejorar su puntuación LCP

Consulte [Cómo mejorar la pintura con contenido más grande en su sitio] .

## Recursos

- [Código fuente para la mayor auditoría **Contentful Paint**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/largest-contentful-paint.js)
- [Pintura con contenido más grande](/largest-contentful-paint/)
- [La API de pintura con contenido más grande](https://wicg.github.io/largest-contentful-paint/)
- [Nuevo en Chrome 77: pintura con contenido más grande](https://developers.google.com/web/updates/2019/09/nic77#lcp)


[Definición de pintura con contenido más grande]: /largest-contentful-paint/#largest-contentful-paint-defined
[Chrome 77]: https://developers.google.com/web/updates/2019/09/nic77#lcp
[Cómo mejorar la pintura con contenido más grande en su sitio]: /largest-contentful-paint#how-to-improve-largest-contentful-paint-on-your-site