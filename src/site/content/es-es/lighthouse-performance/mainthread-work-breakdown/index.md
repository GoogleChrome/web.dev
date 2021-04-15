---
layout: post
title: Minimizar el trabajo del hilo principal
description: Obtenga información sobre el hilo principal del navegador y cómo puede optimizar su página web para reducir la carga del hilo principal y mejorar el rendimiento.
date: '2019-05-02'
updated: '2019-10-04'
web_lighthouse:
  - mainthread-work-breakdown
---

[El proceso de representación](https://developers.google.com/web/updates/2018/09/inside-browser-part3) del navegador es lo que convierte su código en una página web con la que sus usuarios pueden interactuar. De forma predeterminada, el [hilo principal](https://developer.mozilla.org/en-US/docs/Glossary/Main_thread) del proceso de renderizado normalmente maneja la mayor parte del código: analiza el HTML y crea el DOM, analiza el CSS y aplica los estilos especificados, y analiza, evalúa y ejecuta JavaScript.

El hilo principal también procesa eventos de usuario. Por lo tanto, cada vez que el hilo principal está ocupado haciendo otra cosa, es posible que su página web no responda a las interacciones del usuario, lo que genera una mala experiencia.

## Cómo falla la auditoría de trabajo del hilo principal de Lighthouse

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) marca las páginas que mantienen ocupado el hilo principal durante más de 4 segundos durante la carga:

<figure class="w-figure"><img class="w-screenshot" src="mainthread-work-breakdown.png" alt="Una captura de pantalla de la auditoría de trabajo del hilo principal de Lighthouse Minimize"></figure>

Para ayudarlo a identificar las fuentes de carga del hilo principal, Lighthouse muestra un desglose de dónde se gastó el tiempo de CPU mientras el navegador cargaba su página.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo minimizar el trabajo del hilo principal

Las secciones siguientes están organizadas en función de las categorías que informa Lighthouse. Consulte [La anatomía de un marco](https://aerotwist.com/blog/the-anatomy-of-a-frame/) para obtener una descripción general de cómo Chromium representa las páginas web.

Consulte [Hacer menos trabajo en el hilo principal](https://developers.google.com/web/tools/chrome-devtools/speed/get-started#main) para aprender a usar Chrome DevTools para investigar exactamente qué está haciendo su hilo principal mientras se carga la página.

### Evaluación de guiones

- [Optimizar JavaScript de terceros](/fast/#optimize-your-third-party-resources)
- [Rebote de sus controladores de entrada](https://developers.google.com/web/fundamentals/performance/rendering/debounce-your-input-handlers)
- [Utilizar trabajadores web](/off-main-thread/)

### Estilo y maquetación

- [Reducir el alcance y la complejidad de los cálculos de estilo.](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations)
- [Evite los diseños grandes y complejos y los golpes de diseño](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing)

### Representación

- [Siga las propiedades exclusivas del compositor y administre el recuento de capas](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)
- [Simplifique la complejidad de la pintura y reduzca las áreas de pintura](https://developers.google.com/web/fundamentals/performance/rendering/simplify-paint-complexity-and-reduce-paint-areas)

### Analizando HTML y CSS

- [Extraer CSS crítico](/extract-critical-css/)
- [Minificar CSS](/minify-css/)
- [Aplazar CSS no crítico](/defer-non-critical-css/)

### Análisis y compilación de scripts

- [Reduzca las cargas útiles de JavaScript con la división de código](/reduce-javascript-payloads-with-code-splitting/)
- [Eliminar el código no utilizado](/remove-unused-code/)

### Recolección de basura

- [Supervise el uso total de memoria de su página web con `measureMemory()`](/monitor-total-page-memory-usage/)

## Recursos

- [Código fuente para minimizar la auditoría de **trabajo del hilo principal**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/mainthread-work-breakdown.js)
- [Hilo principal (MDN)](https://developer.mozilla.org/en-US/docs/Glossary/Main_thread)
- [Vista interior del navegador web moderno (parte 3)](https://developers.google.com/web/updates/2018/09/inside-browser-part3)
