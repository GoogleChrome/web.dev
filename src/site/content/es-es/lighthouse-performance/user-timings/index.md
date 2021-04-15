---
layout: post
title: Marcas y medidas de temporización del usuario
description: Descubra cómo la API User Timing puede ayudarle a obtener datos de rendimiento del mundo real para su página web.
date: '2019-05-02'
updated: '2019-10-04'
web_lighthouse:
  - tiempos de usuario
---

## ¿Qué es la API de sincronización del usuario?

Hacer que su aplicación web sea rápida y receptiva es crucial para una buena experiencia de usuario. El primer paso para mejorar el desempeño es identificar dónde se invierte el tiempo.

La [API User Timing](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) le ofrece una forma de medir el rendimiento de JavaScript de su aplicación. Lo hace insertando llamadas a la API en su JavaScript y luego extrayendo datos de tiempo detallados que puede usar para optimizar su código. Puede acceder a esos datos desde JavaScript utilizando la API o viéndolos en las [grabaciones de la línea de tiempo de Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference) .

Consulte la [página HTML5 Rocks sobre la API de sincronización del usuario](https://www.html5rocks.com/en/tutorials/webperformance/usertiming/) para obtener una introducción rápida a su uso.

## Cómo informa Lighthouse los datos de sincronización del usuario

Cuando su aplicación usa la API de sincronización del usuario para agregar marcas (es decir, marcas de tiempo) y medidas (es decir, medidas del tiempo transcurrido entre marcas), las verá en su informe de [Lighthouse:](https://developers.google.com/web/tools/lighthouse/)

<figure class="w-figure"><img class="w-screenshot" src="user-timings.png" alt="Una captura de pantalla de la auditoría de marcas y medidas de sincronización del usuario de Lighthouse"></figure>

Lighthouse extrae los datos de sincronización del usuario de [la herramienta de creación de perfiles de eventos de seguimiento](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) de Chrome.

Esta auditoría no está estructurada como una prueba para aprobar o reprobar. Es solo una oportunidad para descubrir una API útil que puede ayudarlo a medir el rendimiento de su aplicación.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Recursos

- [Código fuente para la auditoría de **marcas y medidas de tiempo de usuario**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/user-timings.js)
- [API de tiempo de usuario (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API)
- [API de tiempo de usuario (HTML5 Rocks)](https://www.html5rocks.com/en/tutorials/webperformance/usertiming/)
