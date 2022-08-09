---
layout: post
title: Total Blocking Time
description: |2-

  Obtenga información sobre la métrica Total Blocking Time de Lighthouse, cómo medirlo y optimizarlo.
web_lighthouse:
  - total-blocking-time
date: 2019-10-09
updated: 2021-06-04
---

El Total Blocking Time o TBT (tiempo de bloqueo total) es una de las métricas que se registran en la sección **Rendimiento** del informe Lighthouse. Cada métrica captura algún aspecto de la velocidad de carga de la página.

El informe Lighthouse muestra el TBT en milisegundos:

<figure>{% Img src="image/MtjnObpuceYe3ijODN3a79WrxLU2/wk3OTIdxFPoUImDCnjic.png", alt="Una captura de pantalla de la auditoría Lighthouse Tiempo total de bloqueo", width="800", height="592" %}</figure>

## Qué mide la TBT

La TBT mide la cantidad total de tiempo que una página está bloqueada para que no responda a la entrada del usuario, como los clics del ratón, toques de la pantalla o pulsaciones del teclado. La suma se calcula sumando la *parte de bloqueo* de todas [las tareas largas](/long-tasks-devtools) entre [First Contentful Paint (primer despliegue de contenido)](/fcp/) y [Time to Interactive (tiempo de interacción)](/tti/). Cualquier tarea que se ejecute durante más de 50 ms es una tarea larga. La cantidad de tiempo después de 50 ms es la parte de bloqueo. Por ejemplo, si Lighthouse detecta una tarea de 70 ms de duración, la porción de bloqueo sería de 20 ms.

## Cómo determina Lighthouse su puntaje TBT

Su puntaje TBT es una comparación del tiempo TBT de su página y el tiempo TBT de millones de sitios reales cuando se carga en dispositivos móviles. Consulte [Cómo se determinan las puntuaciones de métricas](/performance-scoring/#metric-scores) para saber cómo se establecen los umbrales de puntuación de Lighthouse.

Esta tabla muestra cómo interpretar su puntaje TBT:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Tiempo TBT<br> (en milisegundos)</th>
        <th>Codificación de color</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0-200</td>
        <td>Verde (rápido)</td>
      </tr>
      <tr>
        <td>200-600</td>
        <td>Naranja (moderado)</td>
      </tr>
      <tr>
        <td>Más de 600</td>
        <td>Rojo (lento)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo mejorar su puntaje TBT

Consulte [¿Qué está causando mis tareas largas?](/long-tasks-devtools/#what-is-causing-my-long-tasks) para aprender a diagnosticar la causa principal de tareas largas con el panel Rendimiento de Chrome DevTools.

En general, las causas más comunes de tareas largas son:

- Carga, análisis o ejecución de JavaScript innecesarios. Al analizar su código en el panel Rendimiento, es posible que descubra que el hilo principal está realizando un trabajo que no es realmente necesario para cargar la página. [Reducir las cargas útiles de JavaScript con la división de código](/reduce-javascript-payloads-with-code-splitting/), [eliminar el código no utilizado](/remove-unused-code/) o [cargar JavaScript de terceros de manera eficiente](/efficiently-load-third-party-javascript/) debería mejorar su puntaje TBT.
- Declaraciones de JavaScript ineficientes. Por ejemplo, después de analizar su código en el panel Rendimiento, suponga que ve una llamada a `document.querySelectorAll('a')` que devuelve 2000 nodos. Refactorizar su código para usar un selector más específico que solo devuelva 10 nodos debería mejorar su puntaje TBT.

{% Aside %} La carga, el análisis o la ejecución innecesarios de JavaScript suelen ser una oportunidad mucho mayor de mejora en la mayoría de los sitios. {% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fuente para la auditoría **Total Blocking Time**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/total-blocking-time.js)
- [¿Las tareas largas de JavaScript están retrasando su Time to Interactive?](/long-tasks-devtools)
- [Optimizar la demora de la primera entrada](/optimize-fid)
- [Primer despliegue de contenido](/fcp/)
- [Tiempo de interacción](/tti/)
- [Reducir las cargas útiles de JavaScript con la división de código](/reduce-javascript-payloads-with-code-splitting/)
- [Eliminar el código no utilizado](/remove-unused-code/)
- [Cargar de manera eficiente los recursos de terceros](/efficiently-load-third-party-javascript/)
