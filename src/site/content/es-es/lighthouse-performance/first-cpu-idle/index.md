---
layout: post
title: Primera CPU inactiva
description: Obtenga información sobre la métrica Primera CPU inactiva de Lighthouse y cómo optimizarla.
date: '2019-05-02'
updated: '2019-11-05'
web_lighthouse:
  - primera-cpu-inactiva
---

{% Aside 'caution' %} La primera CPU inactiva está obsoleta en Lighthouse 6.0. Si bien algunos han descubierto que First CPU Idle ofrece una medida más significativa que [Time To Interactive](/interactive) , la diferencia no es lo suficientemente significativa como para justificar el mantenimiento de dos métricas similares. En el futuro, considere usar el [Tiempo total de bloqueo](/lighthouse-total-blocking-time/) y el [Tiempo para interactuar en su](/interactive) lugar. {% endAside %}

La primera CPU inactiva es una de las seis métricas que se registran en la **sección Rendimiento** del informe Lighthouse. Cada métrica captura algún aspecto de la velocidad de carga de la página.

Lighthouse muestra la primera CPU inactiva en segundos:

<figure class="w-figure"><img class="w-screenshot" src="first-cpu-idle.png" alt="Una captura de pantalla de la auditoría de inactividad de la CPU de Lighthouse First"></figure>

## Lo que mide la primera CPU inactiva

First CPU Idle mide el tiempo que tarda una página en volverse *mínimamente* interactiva. Una página se considera mínimamente interactiva cuando:

- La mayoría de los elementos de la interfaz de usuario de la pantalla, aunque no necesariamente todos, son interactivos y
- La página responde, en promedio, a la mayoría de las entradas de los usuarios en un período de tiempo razonable.

{% Aside %} Tanto la primera CPU inactiva como el [tiempo para interactuar](/interactive) miden cuando la página está lista para la entrada del usuario. La primera CPU inactiva ocurre cuando el usuario puede *comenzar* a interactuar con la página; TTI se produce cuando el usuario es *totalmente* capaz de interactuar con la página. Vea el [primer interactivo y consistentemente interactivo de](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit) Google si está interesado en el cálculo exacto para cada métrica. {% endAside %}

## Cómo Lighthouse determina su primera puntuación de CPU inactiva

La puntuación de la primera CPU inactiva es una comparación del tiempo de inactividad de la primera CPU y los tiempos de inactividad de la primera CPU para sitios web reales, según los [datos del archivo HTTP](https://httparchive.org/reports/loading-speed#ttfi) . Por ejemplo, los sitios que se desempeñan en el percentil noventa y cinco hacen que la primera CPU esté inactiva en aproximadamente 3 segundos. Si la primera CPU inactiva de su sitio web es de 3 segundos, la puntuación de la primera CPU inactiva es 95.

Esta tabla muestra cómo interpretar la puntuación de la primera CPU inactiva:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Primera métrica de CPU inactiva<br> (en segundos)</th>
        <th>Código de colores</th>
        <th>Primera puntuación de CPU inactiva<br> (Percentil de archivo HTTP)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–4,7</td>
        <td>Verde (rápido)</td>
        <td>75-100</td>
      </tr>
      <tr>
        <td>4,8–6,5</td>
        <td>Naranja (moderado)</td>
        <td>50–74</td>
      </tr>
      <tr>
        <td>Más de 6.5</td>
        <td>Rojo (lento)</td>
        <td>0–49</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo mejorar la puntuación de la primera CPU inactiva

Consulte [Cómo mejorar su puntuación TTI] . Las estrategias para mejorar First CPU Idle son en gran medida las mismas que las estrategias para mejorar TTI.

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fuente para la primera auditoría de **CPU inactiva**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/first-cpu-idle.js)
- [Guía de puntuación de Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Primero interactivo y consistentemente interactivo](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)
- [Tiempo para interactuar](/interactive/)


[Cómo mejorar su puntuación TTI]: /interactive/#how-to-improve-your-tti-score