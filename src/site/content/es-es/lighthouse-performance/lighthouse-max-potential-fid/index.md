---
layout: post
title: Retardo potencial máximo de la primera entrada
description: Obtenga más información sobre la métrica Máximo potencial de retardo de la primera entrada de Lighthouse y cómo medirla y optimizarla.
date: '2019-05-02'
updated: '2019-10-16'
web_lighthouse:
  - max-potencial-fid
---

El retardo potencial máximo de la primera entrada (FID) es una de las métricas que se registran en la **sección Rendimiento** del informe Lighthouse. Cada métrica captura algún aspecto de la velocidad de carga de la página.

Lighthouse muestra el FID de potencial máximo en milisegundos:

<figure class="w-figure"><img class="w-screenshot" src="max-potential-fid.png" alt="Una captura de pantalla de la auditoría Lighthouse Max Potential First Input Delay."></figure>

## Qué mide Max Potential FID

Max Potential FID mide el [retardo de primera entrada en] el peor de los casos que pueden experimentar sus usuarios. First Input Delay mide el tiempo desde que un usuario interactúa por primera vez con su sitio, como hacer clic en un botón, hasta el momento en que el navegador es capaz de responder a esa interacción.

Lighthouse calcula el FID de potencial máximo al encontrar la duración de la [tarea más larga] después de [First Contentful Paint] . Las tareas anteriores a First Contentful Paint están excluidas porque es poco probable que un usuario intente interactuar con su página antes de que se haya representado el contenido en la pantalla, que es lo que mide First Contentful Paint.

## Cómo determina Lighthouse su puntaje FID de potencial máximo

<!-- TODO(kaycebasques): In the FCP doc we link to the HTTP Archive report of FCP data.
     If we get a similar report for MPFID we should link to that.
     https://web.dev/first-contentful-paint/#how-lighthouse-determines-your-fcp-score -->

Su puntaje de FID de potencial máximo es una comparación del tiempo de FID de potencial máximo de su página y los tiempos de FID de potencial máximo de sitios web reales, según los datos del [archivo HTTP](https://httparchive.org) . Por ejemplo, si su puntuación FID de potencial máximo en Lighthouse es verde, significa que su página funciona mejor que el 90% de los sitios web reales.

Esta tabla muestra cómo interpretar su puntaje TBT:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Tiempo máximo potencial de FID<br> (en milisegundos)</th>
        <th>Código de colores</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0-130</td>
        <td>Verde (rápido)</td>
      </tr>
      <tr>
        <td>130-250</td>
        <td>Naranja (moderado)</td>
      </tr>
      <tr>
        <td>Más de 250</td>
        <td>Rojo (lento)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo mejorar su puntaje FID de potencial máximo

Si está tratando de realizar mejoras importantes en su puntaje FID de potencial máximo, consulte [Cómo mejorar su puntaje TTI] . Las estrategias para mejorar en gran medida el FID Max Potential son en gran medida las mismas que las estrategias para mejorar el TTI.

Si desea optimizar específicamente la puntuación de Max Potential FID, debe reducir la duración de sus tareas más largas, ya que eso es lo que técnicamente mide Max Potential FID. La [estrategia Inactivo hasta urgente](https://philipwalton.com/articles/idle-until-urgent/) es una forma de hacerlo.

## Cómo capturar datos de campo FID

La medición de Lighthouse del FID de potencial máximo son [datos de laboratorio] . Para capturar datos FID reales a medida que los usuarios cargan sus páginas, utilice la [biblioteca First Input Delay de](https://github.com/GoogleChromeLabs/first-input-delay) Google. Una vez que esté capturando los datos de FID, puede informarlos como un evento a su herramienta de análisis preferida.

Dado que FID mide cuándo los usuarios reales interactúan por primera vez con su página, es más inherentemente variable que las métricas de rendimiento típicas. Consulte [Análisis e informes de datos FID] para obtener orientación sobre cómo evaluar los datos FID que recopila.

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fuente para la auditoría de **retardo de primera entrada potencial máximo**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/max-potential-fid.js)
- [Retardo de la primera entrada]
- [Tiempo para interactuar](/interactive/)
- [¿Las tareas largas de JavaScript están retrasando su tiempo para interactuar?](/long-tasks-devtools)
- [Primera pintura y primera pintura con contenido](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#first_paint_and_first_contentful_paint)
- [Cómo pensar en las herramientas de velocidad]


[Análisis e informes de datos FID]: https://developers.google.com/web/updates/2018/05/first-input-delay#analyzing_and_reporting_on_fid_data
[retardo de primera entrada en]: https://developers.google.com/web/updates/2018/05/first-input-delay
[Cómo mejorar su puntaje TTI]: /interactive/#how-to-improve-your-tti-score
[First Contentful Paint]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#first_paint_and_first_contentful_paint
[Retardo de la primera entrada]: https://developers.google.com/web/updates/2018/05/first-input-delay
[datos de laboratorio]: https://developers.google.com/web/fundamentals/performance/speed-tools#field_data
[tarea más larga]: https://developers.google.com/web/fundamentals/performance/speed-tools#lab_data
[Cómo pensar en las herramientas de velocidad]: /long-tasks-devtools#what-are-long-tasks