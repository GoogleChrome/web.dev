---
layout: post
title: Tiempo para interactuar
description: Obtenga información sobre la métrica Time to Interactive de Lighthouse y cómo medirla y optimizarla.
date: '2019-05-02'
updated: '2019-10-10'
web_lighthouse:
  - interactivo
---

Time to Interactive (TTI) es una de las seis métricas que se registran en la **sección Rendimiento** del informe Lighthouse. Cada métrica captura algún aspecto de la velocidad de carga de la página.

Medir el TTI es importante porque algunos sitios optimizan la visibilidad del contenido a expensas de la interactividad. Esto puede crear una experiencia de usuario frustrante: el sitio parece estar listo, pero cuando el usuario intenta interactuar con él, no sucede nada.

Lighthouse muestra TTI en segundos:

<figure class="w-figure"><img class="w-screenshot" src="interactive.png" alt="Una captura de pantalla de la auditoría Lighthouse Time to Interactive"></figure>

## Qué mide el TTI

TTI mide el tiempo que tarda una página en volverse *completamente* interactiva. Una página se considera completamente interactiva cuando:

- La página muestra contenido útil, que se mide con la [Primera pintura con contenido](/first-contentful-paint) ,
- Los controladores de eventos están registrados para la mayoría de los elementos visibles de la página y
- La página responde a las interacciones del usuario en 50 milisegundos.

{% Aside %} Tanto la [primera CPU inactiva](/first-cpu-idle) como el TTI miden cuando la página está lista para la entrada del usuario. La primera CPU inactiva ocurre cuando el usuario puede *comenzar* a interactuar con la página; TTI se produce cuando el usuario es *totalmente* capaz de interactuar con la página. Vea el [primer interactivo y consistentemente interactivo de](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit) Google si está interesado en el cálculo exacto para cada métrica. {% endAside %}

## Cómo Lighthouse determina su puntaje TTI

El puntaje TTI es una comparación del TTI de su página y el TTI de sitios web reales, basado en [datos del Archivo HTTP](https://httparchive.org/reports/loading-speed#ttci) . Por ejemplo, los sitios que se desempeñan en el percentil nonagésimo noveno muestran TTI en aproximadamente 2.2 segundos. Si el TTI de su sitio web es de 2,2 segundos, su puntuación TTI es 99.

Esta tabla muestra cómo interpretar su puntaje TTI:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Métrica TTI<br> (en segundos)</th>
        <th>Código de colores</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0-3,8</td>
        <td>Verde (rápido)</td>
      </tr>
      <tr>
        <td>3,9–7,3</td>
        <td>Naranja (moderado)</td>
      </tr>
      <tr>
        <td>Más de 7.3</td>
        <td>Rojo (lento)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo mejorar su puntaje TTI

Una mejora que puede tener un efecto particularmente importante en TTI es aplazar o eliminar el trabajo de JavaScript innecesario. Busque oportunidades para [optimizar su JavaScript](/fast#optimize-your-javascript) . En particular, considere [la posibilidad de reducir las cargas útiles de JavaScript dividiendo el código](/reduce-javascript-payloads-with-code-splitting) y [aplicando el patrón PRPL](/apply-instant-loading-with-prpl) . [La optimización de JavaScript de terceros] también produce mejoras significativas para algunos sitios.

Estas dos auditorías de diagnóstico brindan oportunidades adicionales para reducir el trabajo de JavaScript:

- [Minimizar el trabajo del hilo principal](/mainthread-work-breakdown)
- [Reducir el tiempo de ejecución de JavaScript](/bootup-time)

## Seguimiento de TTI en dispositivos de usuarios reales

Para saber cómo medir cuándo ocurre realmente la TTI en los dispositivos de sus usuarios, consulte la página de [métricas de rendimiento centradas en el usuario de Google.] La [sección Seguimiento de TTI] describe cómo acceder mediante programación a los datos de TTI y enviarlos a Google Analytics.

{% Aside %} TTI puede ser difícil de rastrear en la naturaleza. El seguimiento del [retardo de la primera entrada](https://developers.google.com/web/updates/2018/05/first-input-delay) puede ser un buen indicador de TTI. {% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fuente para la auditoría de **Time to Interactive**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/interactive.js)
- [Guía de puntuación de Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Primero interactivo y consistentemente interactivo](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)
- [Optimización de inicio de JavaScript](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/javascript-startup-optimization/)
- [Reduzca las cargas útiles de JavaScript con Tree Shaking](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/)
- [Optimice los recursos de terceros](/fast/#optimize-your-third-party-resources)


[métricas de rendimiento centradas en el usuario de Google.]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics
[sección Seguimiento de TTI]: https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_tti
[La optimización de JavaScript de terceros]: /fast/#optimize-your-third-party-resources