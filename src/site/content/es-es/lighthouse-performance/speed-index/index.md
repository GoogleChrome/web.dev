---
layout: post
title: Índice de velocidad
description: Obtenga más información sobre la métrica del índice de velocidad de Lighthouse y cómo optimizarla.
date: '2019-05-02'
updated: '2019-10-10'
web_lighthouse:
  - índice de velocidad
---

El índice de velocidad es una de las seis métricas que se registran en la **sección Rendimiento** del informe Lighthouse. Cada métrica captura algún aspecto de la velocidad de carga de la página.

Lighthouse muestra el índice de velocidad en segundos:

<figure class="w-figure"><img class="w-screenshot" src="speed-index.png" alt="Una captura de pantalla de la auditoría del índice de velocidad de Lighthouse"></figure>

## Qué mide el índice de velocidad

El índice de velocidad mide la rapidez con la que se muestra visualmente el contenido durante la carga de la página. Lighthouse primero captura un video de la carga de la página en el navegador y calcula la progresión visual entre cuadros. Luego, Lighthouse usa el [módulo Speedline Node.js](https://github.com/paulirish/speedline) para generar la puntuación del índice de velocidad.

{% Aside %} Speedline se basa en los mismos principios que el [índice de velocidad original introducido por WebpageTest.org](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index) , pero calcula la progresión visual entre fotogramas utilizando el [índice de similitud estructural (SSIM) en](https://en.wikipedia.org/wiki/Structural_similarity) lugar de la distancia del histograma. {% endAside %}

## Cómo Lighthouse determina su puntaje de índice de velocidad

Su puntaje de índice de velocidad es una comparación del índice de velocidad de su página y los índices de velocidad de sitios web reales, según los [datos del archivo HTTP](https://bigquery.cloud.google.com/table/httparchive:lighthouse.2019_03_01_mobile?pli=1) .

Esta tabla muestra cómo interpretar su puntaje de índice de velocidad:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Índice de velocidad<br> (en segundos)</th>
        <th>Código de colores</th>
        <th>Puntuación del índice de velocidad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–4,3</td>
        <td>Verde (rápido)</td>
        <td>75-100</td>
      </tr>
      <tr>
        <td>4.4–5.8</td>
        <td>Naranja (moderado)</td>
        <td>50–74</td>
      </tr>
      <tr>
        <td>Más de 5.8</td>
        <td>Rojo (lento)</td>
        <td>0–49</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo mejorar la puntuación de su índice de velocidad

Si bien cualquier cosa que haga para mejorar la velocidad de carga de la página mejorará su puntaje de índice de velocidad, abordar cualquier problema descubierto por estas auditorías de diagnóstico debería tener un impacto particularmente grande:

- [Minimizar el trabajo del hilo principal](/mainthread-work-breakdown)
- [Reducir el tiempo de ejecución de JavaScript](/bootup-time)
- [Asegúrese de que el texto permanezca visible durante la carga de la fuente web](/font-display)

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fuente para la auditoría del **índice de velocidad**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/speed-index.js)
- [Guía de puntuación de Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Linea de alta velocidad](https://github.com/paulirish/speedline)
- [Índice de velocidad de WebPagetest](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/metrics/speed-index)
