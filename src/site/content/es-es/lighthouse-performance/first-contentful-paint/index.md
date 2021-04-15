---
layout: post
title: Primera pintura con contenido
description: Obtenga información sobre la primera métrica de pintura con contenido de Lighthouse y cómo medirla y optimizarla.
date: '2019-05-02'
updated: '2019-10-10'
web_lighthouse:
  - primera pintura con contenido
---

First Contentful Paint (FCP) es una de las seis métricas que se registran en la **sección Rendimiento** del informe Lighthouse. Cada métrica captura algún aspecto de la velocidad de carga de la página.

Lighthouse muestra FCP en segundos:

<figure class="w-figure"><img class="w-screenshot" src="first-contentful-paint.png" alt="Una captura de pantalla de la auditoría de Lighthouse First Contentful Paint"></figure>

## Qué mide FCP

FCP mide cuánto tiempo le toma al navegador procesar la primera parte del contenido DOM después de que un usuario navega a su página. Las imágenes, los `<canvas>` no son blancos y los SVG de su página se consideran contenido DOM; *no se* incluye nada dentro de un iframe.

## Cómo Lighthouse determina su puntaje FCP

Su puntuación FCP es una comparación del tiempo FCP de su página y los tiempos FCP de sitios web reales, según los [datos del Archivo HTTP](https://httparchive.org/reports/loading-speed#fcp) . Por ejemplo, los sitios que se desempeñan en el percentil nonagésimo noveno procesan FCP en aproximadamente 1,5 segundos. Si el FCP de su sitio web es de 1,5 segundos, su puntuación FCP es 99.

Esta tabla muestra cómo interpretar su puntuación FCP:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Tiempo FCP<br> (en segundos)</th>
        <th>Código de colores</th>
        <th>Puntuación FCP<br> (Percentil de archivo HTTP)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0-2</td>
        <td>Verde (rápido)</td>
        <td>75-100</td>
      </tr>
      <tr>
        <td>2-4</td>
        <td>Naranja (moderado)</td>
        <td>50–74</td>
      </tr>
      <tr>
        <td>Más de 4</td>
        <td>Rojo (lento)</td>
        <td>0–49</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo mejorar su puntuación FCP

Un tema que es particularmente importante para FCP es el tiempo de carga de la fuente. Consulte la [publicación Asegúrese de que el texto permanezca visible durante la carga de fuentes web](/font-display) para ver formas de acelerar la carga de fuentes.

## Seguimiento de FCP en dispositivos de usuarios reales

Para saber cómo medir cuándo ocurre realmente el FCP en los dispositivos de sus usuarios, consulte la página de [métricas de rendimiento centradas en el usuario de Google.] La [sección Seguimiento de FP / FCP] describe cómo acceder mediante programación a los datos de FCP y enviarlos a Google Analytics.

Consulte [Evaluación del rendimiento de carga en la vida real de](https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/) Google con navegación y sincronización de recursos para obtener más información sobre la recopilación de métricas de usuarios reales.

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fuente para la primera auditoría de **Contentful Paint**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/first-contentful-paint.js)
- [Guía de puntuación de Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Especificación de tiempo de pintura](https://w3c.github.io/paint-timing)


[métricas de rendimiento centradas en el usuario de Google.]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics
[sección Seguimiento de FP / FCP]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_fpfcp