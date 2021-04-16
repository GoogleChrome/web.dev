---
layout: page
title: Web Vitals
subhead: Essential metrics for a healthy site
description: Essential metrics for a healthy site
authors:
  - philipwalton
date: 30-04-2020
updated: 21-07-2020
masthead: web-vitals.svg
tags:
  - metrics
  - performance
  - web-vitals
---

Optimizar la calidad de la experiencia del usuario es un factor clave para el éxito a largo plazo de cualquier sitio web. Tanto si es propietario de un negocio, especialista de marketing o desarrollador, los Web Vitals pueden ayudarle a cuantificar la experiencia de su sitio e identificar oportunidades para mejorar.

## Overview

Web Vitals es una iniciativa de Google para proporcionar una guía unificada de indicadores de calidad que son esenciales para brindar una excelente experiencia de usuario en la web.

Google ha proporcionado una serie de herramientas a lo largo de los años para medir y generar informes de rendimiento. Algunos desarrolladores son expertos en el uso de estas herramientas, mientras que a otros les resulta difícil mantenerse al día con la enorme cantidad de herramientas y métricas disponibles.

Los propietarios de sitios no deberían tener que ser gurús del rendimiento para comprender la calidad de la experiencia que brindan a sus usuarios. La iniciativa Web Vitals tiene como objetivo simplificar el panorama y ayudar a los sitios a centrarse en las métricas que más importan, los llamados **Core Web Vitals**.

## Core Web Vitals

Los Core Web Vitals son el subconjunto de Web Vitals que se aplica a todas las páginas web, todos los propietarios de sitios deben medirlos y aparecerán en todas las herramientas de Google. Cada uno de los Core Web Vitals representa una faceta distinta de la experiencia del usuario, se puede medir [sobre el terreno](/user-centric-performance-metrics/#how-metrics-are-measured) y refleja la experiencia en el mundo real de un resultado crítico [centrado en el usuario](/user-centric-performance-metrics/#how-metrics-are-measured).

Las métricas que componen los Core Web Vitals [evolucionarán](#evolving-web-vitals) con el tiempo. El conjunto actual para 2020 se centra en tres aspectos de la experiencia del usuario: *carga* , *interactividad* y *estabilidad visual*, e incluye las siguientes métricas (y sus respectivos umbrales):

<div class="w-stack w-stack--center w-stack--md">   <img src="lcp_ux.svg" width="400px" height="350px" alt="Largest Contentful Paint threshold recommendations">   <img src="fid_ux.svg" width="400px" height="350px" alt="First Input Delay threshold recommendations">   <img src="cls_ux.svg" width="400px" height="350px" alt="Cumulative Layout Shift threshold recommendations"> </div>

- **[Largest Contentful Paint (LCP)](/lcp/)** : mide el rendimiento de *carga.* Para proporcionar una buena experiencia de usuario, el LCP debe producirse dentro de los **2,5 segundos desde** que la página comienza a cargarse.
- **[First Input Delay (FID)](/fid/)**: mide la *interactividad*. Para proporcionar una buena experiencia de usuario, las páginas deben tener un FID de menos de **100 milisegundos**.
- **[Cumulative Layout Shift (CLS)](/cls/)**: mide *la estabilidad visual*. Para proporcionar una buena experiencia de usuario, las páginas deben mantener un CLS de menos de **0,1.**

For each of the above metrics, to ensure you're hitting the recommended target for most of your users, a good threshold to measure is the **75th percentile** of page loads, segmented across mobile and desktop devices.

Las herramientas que evalúan el cumplimiento de los Core Web Vitals deben considerar la aprobación de una página si cumple con los objetivos recomendados en el percentil 75 para las tres métricas anteriores.

{% Aside %} Para obtener más información sobre la investigación y la metodología en que se basan estas recomendaciones, consulte: [Definición de los umbrales de métricas de Core Web Vitals](/defining-core-web-vitals-thresholds/) {% endAside %}

### Herramientas para medir y generar informes de Core Web Vitals

Google cree que los Core Web Vitals son fundamentales para todas las experiencias web. Como resultado, se compromete a hacer aflorar estas métricas [en todas sus herramientas populares](/vitals-tools/). Las siguientes secciones detallan qué herramientas son compatibles con los Core Web Vitals.

#### Herramientas sobre el terreno para medir los Core Web Vitals

El [Chrome User Experience Report (Informe de experiencia del usuario de Chrome)](https://developers.google.com/web/tools/chrome-user-experience-report) recopila datos de medición de usuarios reales y anónimos para cada Core Web Vital. Estos datos permiten a los propietarios de sitios evaluar rápidamente su rendimiento sin tener que instrumentar manualmente los análisis en sus páginas, y potencian herramientas como [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) y el [informe de Core Web Vitals](https://support.google.com/webmasters/answer/9205520) de la Search Console.

<div class="w-table-wrapper">
  <table>
    <tr>
      <td> </td>
      <td>LCP</td>
      <td>FID</td>
      <td>CLS</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/web/tools/chrome-user-experience-report" class="">Chrome User Experience Report</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/speed/pagespeed/insights/">         PageSpeed Insights</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://support.google.com/webmasters/answer/9205520" class="">Search Console (Core Web Vitals Report)</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
  </table>
</div>

{% Aside %} Para obtener orientación sobre cómo utilizar estas herramientas y qué herramienta es la adecuada para su caso de uso, consulte: [Getting started with measuring Web Vitals (Introducción a la medición de Web Vitals)](/vitals-measurement-getting-started/) {% endAside %}

Los datos proporcionados por el Chrome User Experience Report ofrecen una forma rápida de evaluar el rendimiento de los sitios, pero no proporcionan la telemetría detallada por página vista que a menudo es necesaria para diagnosticar, monitorizar y reaccionar rápidamente a las regresiones con precisión. Como resultado, recomendamos encarecidamente que los sitios configuren su propia monitorización de usuarios reales.

#### Medir los Core Web Vitals en JavaScript

Each of the Core Web Vitals can be measured in JavaScript using standard web APIs.

La forma más sencilla de medir todos los Core Web Vitals es utilizar la biblioteca de JavaScript de [web-vitals](https://github.com/GoogleChrome/web-vitals), una pequeña envoltura alrededor de las API web subyacentes lista para la producción que mide cada métrica de una manera que coincide con la forma en que son informadas por todas las herramientas de Google enumeradas anteriormente.

With the [web-vitals](https://github.com/GoogleChrome/web-vitals) library, measuring each metric is as simple as calling a single function (see the documentation for complete [usage](https://github.com/GoogleChrome/web-vitals#usage) and [API](https://github.com/GoogleChrome/web-vitals#api) details):

```js
import {getCLS, getFID, getLCP} from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
      fetch('/analytics', {body, method: 'POST', keepalive: true});
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

También puede informar sobre cada uno de los Core Web Vitals sin escribir ningún código utilizando la [Extensión para Chrome de Web Vitals](https://github.com/GoogleChrome/web-vitals-extension). Esta extensión utiliza la biblioteca de [web-vitals](https://github.com/GoogleChrome/web-vitals) para medir cada una de estas métricas y mostrarlas a los usuarios mientras navegan por la web.

This extension can be helpful in understanding the performance of your own sites, your competitor's sites, and the web at large.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th> </th>
        <th>LCP</th>
        <th>FID</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://github.com/GoogleChrome/web-vitals">web-vitals</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://github.com/GoogleChrome/web-vitals-extension">           Web Vitals Extension</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

Como alternativa, los desarrolladores que prefieren medir estas métricas directamente a través de las API web subyacentes pueden consultar estas guías de métricas para obtener detalles de implementación:

- [Measure LCP in JavaScript](/lcp/#measure-lcp-in-javascript)
- [Measure FID in JavaScript](/fid/#measure-fid-in-javascript)
- [Measure CLS in JavaScript](/cls/#measure-cls-in-javascript)

{% Aside %} Para obtener orientación adicional sobre cómo medir estas métricas mediante servicios de análisis populares (o sus propias herramientas de análisis internas), consulte: [Prácticas recomendadas para medir Web Vitals sobre el terreno](/vitals-field-measurement-best-practices/) {% endAside %}

#### Lab tools to measure Core Web Vitals

Si bien todos los Core Web Vitals son, ante todo, métricas sobre el terreno, muchas de ellas también se pueden medir en el laboratorio.

La medición en el laboratorio es la mejor manera de probar el rendimiento de las funciones durante el desarrollo, antes de que se publiquen a los usuarios. También es la mejor forma de detectar las regresiones de rendimiento antes de que sucedan.

The following tools can be used to measure the Core Web Vitals in a lab environment:

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th> </th>
        <th>LCP</th>
        <th>FID</th>
        <th>CLS</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://developers.google.com/web/tools/chrome-devtools">           Chrome DevTools</a></td>
        <td>✔</td>
        <td>✘ (use <a href="/tbt/">TBT</a> instead)</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://developers.google.com/web/tools/lighthouse">           Lighthouse</a></td>
        <td>✔</td>
        <td>✘ (use <a href="/tbt/">TBT</a> instead)</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %} Las herramientas como Lighthouse que cargan páginas en un entorno simulado sin un usuario no pueden medir FID (no hay entrada de usuario). Sin embargo, la métrica Total Blocking Time (TBT) se puede medir en laboratorio y es un excelente proxy para FID. Las optimizaciones de rendimiento que mejoran el TBT en el laboratorio deberían mejorar la FID sobre el terreno (consulte las recomendaciones de rendimiento a continuación). {% endAside %}

Si bien la medición de laboratorio es una parte esencial para brindar excelentes experiencias, no sustituye a la medición sobre el terreno.

El rendimiento de un sitio puede variar drásticamente según las capacidades del dispositivo de un usuario, las condiciones de su red, qué otros procesos pueden estar ejecutándose en el dispositivo y cómo interactúan con la página. De hecho, la puntuación de cada una de las métricas de Core Web Vitals puede verse afectada por la interacción del usuario. Solo la medición sobre el terreno puede capturar con precisión la imagen completa.

### Recomendaciones para mejorar sus puntuaciones

Once you've measured the Core Web Vitals and identified areas for improvement, the next step is to optimize. The following guides offer specific recommendations for how to optimize your pages for each of the Core Web Vitals:

- [Optimize LCP](/optimize-lcp/)
- [Optimize FID](/optimize-fid/)
- [Optimize CLS](/optimize-cls/)

## Otros Web Vitals

While the Core Web Vitals are the critical metrics for understanding and delivering a great user experience, there are other vital metrics as well.

These other Web Vitals often serve as proxy or supplemental metrics for the Core Web Vitals, to help capture a larger part of the experience or to aid in diagnosing a specific issue.

Por ejemplo, las métricas [Time to First Byte (TTFB)](/time-to-first-byte/) y [First Contentful Paint (FCP)](/fcp/) son aspectos vitales de la *experiencia de carga* y son útiles para diagnosticar problemas con LCP ([tiempos de respuesta del servidor](/overloaded-server/) lentos o [recursos de bloqueo de renderizado](/render-blocking-resources/), respectivamente).

De manera similar, métricas como [Total Blocking Time (TBT)](/tbt/) y [Time to Interactive (TTI)](/tti/) son métricas de laboratorio que son vitales para detectar y diagnosticar posibles *problemas de interactividad* que afectarán a la FID. Sin embargo, no forman parte del conjunto Core Web Vitals porque no se pueden medir sobre el terreno ni reflejan un resultado [centrado en el usuario.](/user-centric-performance-metrics/#how-metrics-are-measured)

## Evolución de los Web Vitals

Los Web Vitals y los Core Web Vitals son los mejores indicadores disponibles que los desarrolladores tienen en la actualidad para medir la calidad de la experiencia en la web, pero estos indicadores no son perfectos y se deben esperar mejoras o adiciones futuras.

Los **Core Web Vitals** son relevantes para todas las páginas web y aparecen en las herramientas relevantes de Google. Los cambios en estas métricas tendrán un impacto de gran alcance; por ello, los desarrolladores deben esperar que las definiciones y los umbrales de Core Web Vitals sean estables y que las actualizaciones tengan un aviso previo y una cadencia anual predecible.

Los otros Web Vitals suelen ser específicos del contexto o de la herramienta, y pueden ser más experimentales que los Core Web Vitals. Sus definiciones y umbrales pueden cambiar con mayor frecuencia.

Para todos los Web Vitals, los cambios se documentarán de manera clara en este [REGISTRO DE CAMBIOS](http://bit.ly/chrome-speed-metrics-changelog) público.

<web-feedback></web-feedback>
