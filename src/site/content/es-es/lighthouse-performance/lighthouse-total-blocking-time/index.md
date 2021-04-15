---
layout: post
title: Tiempo total de bloqueo
description: Obtenga información sobre la métrica Tiempo total de bloqueo de Lighthouse y cómo medirla y optimizarla.
web_lighthouse:
  - tiempo de bloqueo total
date: '2019-10-09'
---

El tiempo total de bloqueo (TBT) es una de las métricas que se registran en la **sección Rendimiento** del informe Lighthouse. Cada métrica captura algún aspecto de la velocidad de carga de la página.

El informe Lighthouse muestra TBT en milisegundos:

<figure class="w-figure"><img class="w-screenshot" src="total-blocking-time.jpg" alt="Una captura de pantalla de la auditoría de Lighthouse Total Blocking Time"></figure>

## Qué medidas OTC

TBT mide la cantidad total de tiempo que una página está bloqueada para que no responda a la entrada del usuario, como los clics del mouse, los toques de la pantalla o las pulsaciones del teclado. La suma se calcula sumando la *parte* de bloqueo de todas [las tareas largas] entre [First Contentful Paint] y [Time to Interactive] . Cualquier tarea que se ejecute durante más de 50 ms es una tarea larga. La cantidad de tiempo después de 50 ms es la parte de bloqueo. Por ejemplo, si Lighthouse detecta una tarea de 70 ms de duración, la porción de bloqueo sería de 20 ms.

## Cómo Lighthouse determina su puntaje TBT

Su puntaje TBT es una comparación del tiempo TBT de su página y los tiempos TBT para los 10,000 sitios principales cuando se cargan en dispositivos móviles. Los datos del sitio principal incluyen 404 páginas.

Esta tabla muestra cómo interpretar su puntaje TBT:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Tiempo TBT<br> (en milisegundos)</th>
        <th>Código de colores</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–300</td>
        <td>Verde (rápido)</td>
      </tr>
      <tr>
        <td>300-600</td>
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

Consulte [¿Qué está causando mis tareas largas?](/long-tasks-devtools/#what-is-causing-my-long-tasks) para aprender a diagnosticar la causa raíz de tareas largas con el panel Rendimiento de Chrome DevTools.

En general, las causas más comunes de tareas largas son:

- Carga, análisis o ejecución de JavaScript innecesarios. Al analizar su código en el panel Rendimiento, es posible que descubra que el hilo principal está realizando un trabajo que no es realmente necesario para cargar la página. [Reducir las cargas útiles de JavaScript con la división de código] , [eliminar el código no utilizado] o [cargar JavaScript de terceros de manera eficiente] debería mejorar su puntaje TBT.
- Declaraciones de JavaScript ineficientes. Por ejemplo, después de analizar su código en el panel Rendimiento, suponga que ve una llamada a `document.querySelectorAll('a')` que devuelve 2000 nodos. Refactorizar su código para usar un selector más específico que solo devuelva 10 nodos debería mejorar su puntaje TBT.

{% Aside %} La carga, el análisis o la ejecución innecesarios de JavaScript suelen ser una oportunidad mucho mayor de mejora en la mayoría de los sitios. {% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fuente para la auditoría de **tiempo total de bloqueo**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/total-blocking-time.js)
- [¿Las tareas largas de JavaScript están retrasando su tiempo para interactuar?](/long-tasks-devtools)
- [Primera pintura con contenido](/first-contentful-paint/)
- [Tiempo para interactuar](/interactive/)
- [Reduzca las cargas útiles de JavaScript con la división de código](/reduce-javascript-payloads-with-code-splitting/)
- [Eliminar el código no utilizado](/remove-unused-code/)
- [Cargue de manera eficiente los recursos de terceros](/efficiently-load-third-party-javascript/)


[las tareas largas]: /long-tasks-devtools
[First Contentful Paint]: /first-contentful-paint/
[Time to Interactive]: /interactive/
[Reducir las cargas útiles de JavaScript con la división de código]: /reduce-javascript-payloads-with-code-splitting/
[eliminar el código no utilizado]: /remove-unused-code/
[cargar JavaScript de terceros de manera eficiente]: /efficiently-load-third-party-javascript/