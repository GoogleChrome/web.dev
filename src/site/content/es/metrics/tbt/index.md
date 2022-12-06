---
layout: post
title: Total Blocking Time (TBT)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-06-15
description: En esta publicación se presenta la métrica Total Blocking Time (TBT) y se explica como medirla
tags:
  - performance
  - metrics
---

{% Aside %}

Total Blocking Time: Tiempo de bloqueo total (TBT) es una [métrica de laboratorio](/user-centric-performance-metrics/#in-the-lab) importante para medir la [capacidad de respuesta de la carga](/user-centric-performance-metrics/#types-of-metrics) porque ayuda a cuantificar la gravedad de la falta de interacción de una página antes de que se vuelva interactiva de manera confiable: una TBT baja ayuda a garantizar que la página sea [útil](/user-centric-performance-metrics/#questions).

{% endAside %}

## ¿Qué es TBT?

La métrica Total Blocking Time (TBT) mide la cantidad total de tiempo entre [First Contentful Paint: Primer despliegue del contenido (FCP)](/fcp/) y [Time to Interactive: Tiempo para interactuar (TTI)](/tti/) donde el subproceso principal estuvo bloqueado durante el tiempo suficiente para evitar la respuesta de entrada.

El subproceso principal se considera "bloqueado" cada vez que hay una [Tarea larga](/custom-metrics/#long-tasks-api), una tarea que se ejecuta en el subproceso principal durante más de 50 milisegundos (ms). Decimos que el subproceso principal está "bloqueado" porque el navegador no puede interrumpir una tarea que está en curso. Así que en el caso de que un usuario *interactúe* con la página en medio de una tarea larga, el navegador debe esperar a que la tarea termine antes de que pueda responder.

Si la tarea es lo suficientemente larga (por ejemplo, cualquier cosa que supere los 50 ms), es probable que el usuario se dé cuenta de la demora y perciba que la página es lenta o poco funcional.

El *tiempo de bloqueo* de una tarea larga determinada es su duración superior a 50 ms. Y el *tiempo de bloqueo total* de una página es la suma del *tiempo de bloqueo* para cada tarea larga que se produce entre FCP y TTI.

Por ejemplo, considere consultar el siguiente diagrama del subproceso principal del navegador durante la carga de la página:

{% Img src="image/admin/clHG8Yv239lXsGWD6Iu6.svg", alt="Una línea de tiempo de tareas en el subproceso principal", width="800", height="156", linkTo=true %}

La línea de tiempo anterior tiene cinco tareas, tres de las cuales son tareas largas porque su duración supera los 50 ms. En el siguiente diagrama se muestra el tiempo de bloqueo para cada una de las tareas largas:

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xKxwKagiz8RliuOI2Xtc.svg", alt="Una línea de tiempo de tareas en el subproceso principal que muestra el tiempo de bloqueo", width="800", height="156", linkTo=true %}

Entonces, mientras que el tiempo total dedicado a ejecutar tareas en el subproceso principal es de 560 ms, solo 345 ms de ese tiempo se considera como tiempo de bloqueo.

<table>
  <tr>
    <th></th>
    <th>Duración de la tarea</th>
    <th>Tiempo de bloqueo de la tarea</th>
  </tr>
  <tr>
    <td>Tarea uno</td>
    <td>250 ms</td>
    <td>200 ms</td>
  </tr>
  <tr>
    <td>Tarea dos</td>
    <td>90 ms</td>
    <td>40 ms</td>
  </tr>
  <tr>
    <td>Tarea tres</td>
    <td>35 ms</td>
    <td>0 ms</td>
  </tr>
  <tr>
    <td>Tarea cuatro</td>
    <td>30 ms</td>
    <td>0 ms</td>
  </tr>
  <tr>
    <td>Tarea cinco</td>
    <td>155 ms</td>
    <td>105 ms</td>
  </tr>
  <tr>
    <td colspan="2"><strong>Tiempo total de bloqueo</strong></td>
    <td><strong>345 ms</strong></td>
  </tr>
</table>

### ¿Cómo se relaciona TBT con TTI?

TBT es una gran métrica complementaria para TTI porque ayuda a cuantificar la gravedad de la falta de interactividad de una página antes de que se convierta en interactiva confiable.

TTI considera que una página es "confiablemente interactiva" si el subproceso principal ha estado libre de tareas largas durante al menos cinco segundos. Esto significa que tres tareas de 51 ms repartidas a lo largo de 10 segundos pueden demorar el TTI tanto como una sola tarea de 10 segundos de duración, pero estos dos escenarios serían muy diferentes para un usuario que intenta interactuar con la página.

En el primer caso, tres tareas de 51 ms tendrían un TBT de **3 ms**. Mientras que una sola tarea de 10 segundos de duración tendría un TBT de **9, 950 ms**. El valor mayor de TBT en el segundo caso cuantifica la peor experiencia.

## Cómo medir TBT

TBT es una métrica que debe medirse [en el laboratorio](/user-centric-performance-metrics/#in-the-lab) . La mejor manera de medir TBT es ejecutar una auditoría de desempeño Lighthouse en su sitio. Consulte la [documentación de Lighthouse sobre TBT](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/) para obtener información sobre su uso.

### Herramientas de laboratorio

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest](https://www.webpagetest.org/)

{% Aside %} Si bien es posible medir TBT en el campo, no se recomienda ya que la interacción del usuario puede afectar la TBT de su página de manera que genere muchas variaciones en sus reportes. Para comprender la interactividad de una página en el campo, debe medir [First Input Delay (FID)](/fid/). {% endAside %}

## ¿Qué es una buena puntuación TBT?

Para ofrecer una buena experiencia de usuario, los sitios deben esforzarse por tener un Total Blocking Time inferior a **300 milisegundos** cuando se prueban en el hardware de un **dispositivo móvil promedio**.

Para obtener más información sobre cómo la TBT de su página afecta a su puntuación de rendimiento de Lighthouse, consulte [Cómo determina Lighthouse su puntuación TBT](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/#how-lighthouse-determines-your-tbt-score)

## Cómo mejorar TBT

Para aprender a mejorar TBT para un sitio específico, puede ejecutar una auditoría de desempeño Lighthouse y prestar atención a cualquier [oportunidad](https://developer.chrome.com/docs/lighthouse/performance/#opportunities) específica que sugiera la auditoría.

Para saber cómo mejorar la TBT en general (para cualquier sitio), consulte las siguientes normas de rendimiento:

- [Reducir el impacto en el código de terceros](https://developer.chrome.com/docs/lighthouse/performance/third-party-summary/)
- [Reducir el tiempo de ejecución de JavaScript](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/)
- [Minimizar el trabajo del subproceso principal](https://developer.chrome.com/docs/lighthouse/performance/mainthread-work-breakdown/)
- [Mantener la cantidad de solicitudes bajas y los tamaños de transferencia reducidos](https://developer.chrome.com/docs/lighthouse/performance/resource-summary/)
