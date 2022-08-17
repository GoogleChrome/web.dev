---
layout: post
title: Tiempo para interactuar
description: |2-

  Obten información sobre la métrica Time to Interactive (TTI): Tiempo para interactuar de Lighthouse y cómo medirlo y optimizarlo.
date: 2019-05-02
updated: 2019-10-10
web_lighthouse:
  - interactive
---

Time to Interactive (TTI): Tiempo para interactuar es una de las seis métricas que se registran en la sección de **Rendimiento** del informe Lighthouse. Cada métrica captura algún aspecto de la velocidad de carga de la página.

Medir el TTI es importante porque algunos sitios optimizan la visibilidad del contenido a costo de la interactividad. Esto puede crear una experiencia de usuario frustrante: el sitio parece estar listo, pero cuando el usuario intenta interactuar con él, nada sucede.

Lighthouse muestra el TTI en segundos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MOXhGOQxWpolq6nhBleq.png", alt="Una captura de pantalla de la auditoría de TTI de Lighthouse", width="800", height="588" %}</figure>

## Qué mide el TTI

El TTI mide el tiempo que tarda una página en volverse *completamente* interactiva. Una página se considera completamente interactiva cuando:

- La página muestra contenido útil, que se mide con [First Contentful Paint (FCP): Primera pintura con contenido](/fcp/)
- Los controladores de eventos están registrados para la mayoría de los elementos visibles de la página
- La página responde a las interacciones del usuario en menos de 50 milisegundos

{% Aside %} Tanto la [primera CPU inactiva](/first-cpu-idle) como el TTI miden cuando la página está lista para las entradas del usuario. La primera CPU inactiva ocurre cuando el usuario puede *comenzar* a interactuar con la página; el TTI se produce cuando el usuario es *totalmente* capaz de interactuar con la página. Mira el [First Interactive and Consistently Interactive (Primer interactivo y consistentemente interactivo)](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit) de Google si estas interesado en el cálculo exacto para cada métrica. {% endAside %}

## Cómo Lighthouse determina tu puntaje TTI

La puntuación TTI es una comparación del TTI de tu página y el TTI de sitios web reales, según los [datos del HTTP Archive](https://httparchive.org/reports/loading-speed#ttci). Por ejemplo, los sitios que se desempeñan en el percentil 99 muestran su TTI en aproximadamente 2.2 segundos. Si el TTI de tu sitio web es de 2.2 segundos, tu puntuación TTI es de 99.

Esta tabla muestra cómo interpretar tu puntaje TTI:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Métrica TTI<br> (en segundos)</th>
        <th>Codificación de color</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0-3.8</td>
        <td>Verde (rápido)</td>
      </tr>
      <tr>
        <td>3.9–7.3</td>
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

## Cómo mejorar tu puntaje TTI

Una mejora que puede tener un efecto particularmente importante en el TTI es diferir o eliminar el trabajo de JavaScript innecesario. Busca oportunidades para [optimizar tu JavaScript](/fast#optimize-your-javascript). En particular, considera [la posibilidad de reducir las cargas útiles de JavaScript dividiendo el código](/reduce-javascript-payloads-with-code-splitting) y [aplicando el patrón PRPL](/apply-instant-loading-with-prpl). [La optimización de JavaScript de terceros](/fast/#optimize-your-third-party-resources) también produce mejoras significativas para algunos sitios.

Estas dos auditorías de diagnóstico brindan oportunidades adicionales para reducir el trabajo de JavaScript:

- [Minimizar el trabajo del hilo principal](/mainthread-work-breakdown)
- [Reducir el tiempo de ejecución de JavaScript](/bootup-time)

## Seguimiento del TTI en dispositivos de usuarios reales

Para saber cómo medir cuándo ocurre realmente el TTI en los dispositivos de sus usuarios, consulta la página de [métricas de rendimiento centradas en el usuario](/user-centric-performance-metrics/) de Google. La sección de [seguimiento de TTI](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_tti) describe cómo acceder, mediante la programación, a los datos de TTI y enviarlos a Google Analytics.

{% Aside %} El TTI puede ser difícil de rastrear en un ambiente real. El seguimiento del [First Input Delay (FID): Demora de la primera entrada](https://developers.google.com/web/updates/2018/05/first-input-delay) puede ser un buen indicador directo del TTI. {% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fuente para la auditoría de **Tiempo para interactuar**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/interactive.js)
- [Guía de puntuación de Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [First Interactive And Consistently Interactive (Primer interactivo y consistentemente interactivo)](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)
- [Optimización del JavaScript de arranque](/optimizing-content-efficiency-javascript-startup-optimization/)
- [Reduce las cargas útiles de JavaScript con Tree Shaking](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/)
- [Optimización de los recursos de terceros](/fast/#optimize-your-third-party-resources)
