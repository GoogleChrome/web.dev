---
layout: post
title: Web Vitals
description: Métricas esenciales para un sitio saludable
hero: image/admin/BHaoqqR73jDWe6FL2kfw.png
authors:
  - philipwalton
date: 2020-04-30
updated: 2020-07-21
tags:
  - metrics
  - performance
  - web-vitals
---

Asegurar una calidad de experiencia de usuario óptima es clave para el éxito a largo plazo de cualquier sitio web. Tanto para un propietario de un negocio, especialista de marketing o desarrollador, Web Vitals pueden ayudarle a cuantificar la experiencia de su sitio e identificar oportunidades para mejorar.

## Información general

Web Vitals es una iniciativa de Google para proporcionar una guía unificada de indicadores de calidad que son esenciales para brindar una excelente experiencia de usuario en la web.

Google ha proporcionado una serie de herramientas a lo largo de los años para medir y generar informes de rendimiento. Algunos desarrolladores son expertos en el uso de estas herramientas, mientras que a otros les resulta difícil mantenerse al día con la enorme cantidad de herramientas y métricas disponibles.

Los propietarios de sitios no deberían tener que ser gurús del rendimiento para comprender la calidad de la experiencia que brindan a sus usuarios. La iniciativa Web Vitals tiene como objetivo simplificar el panorama y ayudar a los sitios a centrarse en las métricas que más importan, los llamados **Core Web Vitals**.

## Core Web Vitals

Los Core Web Vitals son el subconjunto de Web Vitals que se aplica a todas las páginas web, todos los propietarios de sitios deben medirlos y aparecerán en todas las herramientas de Google. Cada uno de los Core Web Vitals representa una faceta distinta de la experiencia del usuario, se puede medir [en el campo](/user-centric-performance-metrics/#how-metrics-are-measured) y refleja la experiencia en el mundo real de un resultado indispensable [centrado en el usuario](/user-centric-performance-metrics/#how-metrics-are-measured).

Las métricas que componen los Core Web Vitals [evolucionarán](#evolving-web-vitals) con el tiempo. El conjunto actual en el 2020 se centra en tres aspectos de la experiencia del usuario: *carga* , *interactividad* y *estabilidad visual*, e incluye las siguientes métricas (y sus respectivos umbrales):

<div class="auto-grid" style="--auto-grid-min-item-size: 200px;">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZZU8Z7TMKXmzZT2mCjJU.svg", alt="Recomendaciones de umbral para LCP", width="400", height="350" %}   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iHYrrXKe4QRcb2uu8eV8.svg", alt="Recomendaciones de umbral para FID", width="400", height="350" %}   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dgpDFckbHwwOKdIGDa3N.svg", alt="Recomendaciones de umbral para CLS", width="400", height="350" %} </div>

- **[Largest Contentful Paint (LCP)](/lcp/)** : se refiere al tiempo para el despliegue del contenido más extenso, LCP por sus siglas en inglés, mide el rendimiento de *carga.* Para proporcionar una buena experiencia de usuario, el LCP debe producirse dentro de los **2,5 segundos desde** que la página comienza a cargarse.
- **[First Input Delay (FID)](/fid/)**: se refiere a la demora para la primera entrada, FID por sus siglas en inglés, mide la *interactividad*. Para proporcionar una buena experiencia de usuario, las páginas deben tener un FID de menos de **100 milisegundos**.
- **[Cumulative Layout Shift (CLS)](/cls/)**: se refiere a el cambio acumulativo en el diseño CLS por sus siglás en inglés, mide *la estabilidad visual*. Para proporcionar una buena experiencia de usuario, las páginas deben mantener un CLS de menos de **0,1.**

Con cada una de las métricas anteriores, para asegurarse de que está alcanzando el objetivo recomendado para la mayoría de sus usuarios, un buen umbral para medir es el **percentil 75** de cargas de página, segmentado en dispositivos móviles y de escritorio.

Las herramientas que evalúan el cumplimiento de los Core Web Vitals deben considerar la aprobación de una página si cumple con los objetivos recomendados en el percentil 75 para las tres métricas anteriores.

{% Aside %} Para obtener más información sobre la investigación y la metodología en que se basan estas recomendaciones, consulte: [Definición de los umbrales de métricas de Core Web Vitals](/defining-core-web-vitals-thresholds/) {% endAside %}

### Herramientas para medir y generar informes de Core Web Vitals

Google cree que los Core Web Vitals son fundamentales para todas las experiencias web. Como resultado, se compromete a hacer aflorar estas métricas [en todas sus herramientas populares](/vitals-tools/). Las siguientes secciones detallan qué herramientas son compatibles con los Core Web Vitals.

#### Herramientas en el campo para medir los Core Web Vitals

El [Chrome User Experience Report (Informe de experiencia del usuario de Chrome)](https://developer.chrome.com/docs/crux/) recopila datos de medición de usuarios reales y anónimos para cada Core Web Vital. Estos datos permiten a los propietarios de sitios evaluar rápidamente su rendimiento sin tener que instrumentar manualmente los análisis en sus páginas, y potencian herramientas como [PageSpeed Insights](https://pagespeed.web.dev/) y el [informe de Core Web Vitals](https://support.google.com/webmasters/answer/9205520) de la Search Console.

<div class="table-wrapper">
  <table>
    <tr>
      <td> </td>
      <td>LCP</td>
      <td>FID</td>
      <td>CLS</td>
    </tr>
    <tr>
      <td><a href="https://developer.chrome.com/docs/crux/">Chrome User Experience Report</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://developers.google.com/speed/pagespeed/insights/">PageSpeed Insights</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
    <tr>
      <td><a href="https://support.google.com/webmasters/answer/9205520">Search Console (Core Web Vitals Report)</a></td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
    </tr>
  </table>
</div>

{% Aside %} Para obtener información sobre cómo utilizar estas herramientas y qué herramienta es la adecuada para su caso de uso, consulte: [Getting started with measuring Web Vitals (Introducción a la medición de Web Vitals)](/vitals-measurement-getting-started/) {% endAside %}

Los datos proporcionados por el Chrome User Experience Report ofrecen una forma rápida de evaluar el rendimiento de los sitios, pero no proporcionan la telemetría detallada por página vista que a menudo es necesaria para diagnosticar, monitorizar y reaccionar rápidamente a las regresiones con precisión. Como resultado, recomendamos encarecidamente que los sitios configuren su propia monitorización de usuarios reales.

#### Medir los Core Web Vitals en JavaScript

Cada uno de los Core Web Vitals se puede medir en JavaScript utilizando APIs estándares del web.

La forma más sencilla de medir todos los Core Web Vitals es utilizar la biblioteca de JavaScript de [web-vitals](https://github.com/GoogleChrome/web-vitals), una pequeña envoltura alrededor de las API web subyacentes lista para la producción que mide cada métrica de una manera que coincide con la forma en que son informadas por todas las herramientas de Google enumeradas anteriormente.

Con la [biblioteca web-vitals](https://github.com/GoogleChrome/web-vitals), medir cada métrica es tan simple como llamar a una sola función (consulte la documentación para conocer el [uso](https://github.com/GoogleChrome/web-vitals#usage) completo y los detalles de la [API):](https://github.com/GoogleChrome/web-vitals#api)

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

Una vez que haya configurado su sitio para usar la biblioteca [web-vitals](https://github.com/GoogleChrome/web-vitals) para medir y enviar sus datos de Core Web Vitals a un punto final de análisis, el siguiente paso es agregar y hacer un reporte sobre esos datos para ver si sus páginas cumplen con los umbrales recomendados para al menos el 75% de las visitas a la página.

Algunos proveedores de análisis tienen soporte integrado para métricas de Core Web Vitals, incluso aquellos que no lo tienen, deberían incluir funciones de métricas personalizadas básicas que le permitan medir Core Web Vitals en su herramienta.

Un ejemplo de esto es el [Web Vitals Report](https://github.com/GoogleChromeLabs/web-vitals-report), que permite a los propietarios de sitios medir sus Core Web Vitals utilizando Google Analytics. Para obtener una guía sobre cómo medir los valores fundamentales de la Web mediante otras herramientas de análisis, consulte el artículo sobre [prácticas recomendadas para medir Core Web Vitals en el campo](/vitals-field-measurement-best-practices/).

También se puede reportar sobre cada uno de los Core Web Vitals sin escribir código utilizando la [Extensión para Chrome de Web Vitals](https://github.com/GoogleChrome/web-vitals-extension). Esta extensión utiliza la biblioteca de [web-vitals](https://github.com/GoogleChrome/web-vitals) para medir cada una de estas métricas y mostrarlas a los usuarios mientras navegan por la web.

Esta extensión puede resultar útil para comprender el rendimiento de sus propios sitios, los de la competencia y la web en general.

<div class="table-wrapper">
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
        <td><a href="https://github.com/GoogleChrome/web-vitals-extension">Extensión Web Vitals</a></td>
        <td>✔</td>
        <td>✔</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

Como alternativa, los desarrolladores que prefieren medir estas métricas directamente a través de las API web subyacentes pueden consultar estas guías de métricas para obtener detalles de implementación:

- [Medir LCP en JavaScript](/lcp/#measure-lcp-in-javascript)
- [Medir FID en JavaScript](/fid/#measure-fid-in-javascript)
- [Medir CLS en JavaScript](/cls/#measure-cls-in-javascript)

{% Aside %} Para obtener información adicional sobre cómo medir estas métricas mediante servicios de análisis populares (o sus propias herramientas de análisis internas), consulte: [Prácticas recomendadas para medir Web Vitals en el campo](/vitals-field-measurement-best-practices/) {% endAside %}

#### Herramientas de laboratorio para medir Core Web Vitals

Si bien todos los Core Web Vitals son, ante todo, métricas en el campo, muchas de ellas también se pueden medir en el laboratorio.

La medición en el laboratorio es la mejor manera de probar el rendimiento de las funciones durante el desarrollo, antes de que se publiquen a los usuarios. También es la mejor forma de detectar las regresiones de rendimiento antes de que sucedan.

Las siguientes herramientas se pueden utilizar para medir los Core Web Vitals en un entorno de laboratorio:

<div class="table-wrapper">
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
        <td><a href="https://developer.chrome.com/docs/devtools/">DevTools de Chrome</a></td>
        <td>✔</td>
        <td>✘ (use <a href="/tbt/">TBT</a> en su lugar)</td>
        <td>✔</td>
      </tr>
      <tr>
        <td><a href="https://developer.chrome.com/docs/lighthouse/overview/" class="_active_edit_href"> Lighthouse</a></td>
        <td>✔</td>
        <td>✘ (use <a href="/tbt/">TBT</a> en su lugar)</td>
        <td>✔</td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %} Las herramientas como Lighthouse que cargan páginas en un entorno simulado sin un usuario no pueden medir FID (no hay entrada de usuario). Sin embargo, la métrica Total Blocking Time (TBT) se puede medir en laboratorio y es un excelente proxy para FID. Las optimizaciones de rendimiento que mejoran el TBT en el laboratorio deberían mejorar la FID en el campo (consulte las recomendaciones de rendimiento a continuación). {% endAside %}

Si bien la medición de laboratorio es una parte esencial para brindar excelentes experiencias, no sustituye a la medición en el campo.

El rendimiento de un sitio puede variar drásticamente según las capacidades del dispositivo de un usuario, las condiciones de su red, qué otros procesos pueden estar ejecutándose en el dispositivo y cómo interactúan con la página. De hecho, la puntuación de cada una de las métricas de Core Web Vitals puede verse afectada por la interacción del usuario. Solo la medición en el campo puede capturar con precisión la imagen completa.

### Recomendaciones para mejorar sus puntuaciones

Una vez que haya medido los Core Web Vitals e identificado las áreas de mejora, el siguiente paso es optimizar. Las siguientes guías ofrecen recomendaciones específicas sobre cómo optimizar sus páginas para cada uno de los Core Web Vitals:

- [Optimizar LCP](/optimize-lcp/)
- [Optimizar FID](/optimize-fid/)
- [Optimizar CLS](/optimize-cls/)

## Otros Web Vitals

Si bien los Core Web Vitals son las métricas críticas para comprender y brindar una excelente experiencia de usuario, también existen otras métricas vitales.

Estos otros Web Vitals a menudo sirven como métricas proxy o suplementarias para los Core Web Vitals, para ayudar a capturar una mayor parte de la experiencia o para ayudar a diagnosticar un problema específico.

Por ejemplo, las métricas [Time to First Byte (TTFB)](/ttfb/) y [First Contentful Paint (FCP)](/fcp/) son aspectos vitales de la *experiencia de carga* y son útiles para diagnosticar problemas con LCP ([tiempos de respuesta del servidor](/overloaded-server/) lentos o [recursos de bloqueo de renderizado](/render-blocking-resources/), respectivamente).

De manera similar, métricas como [Total Blocking Time (TBT)](/tbt/) y [Time to Interactive (TTI)](/tti/) son métricas de laboratorio que son vitales para detectar y diagnosticar posibles *problemas de interactividad* que afectarán a la FID. Sin embargo, no forman parte del conjunto Core Web Vitals porque no se pueden medir en el campo ni reflejan un resultado [centrado en el usuario.](/user-centric-performance-metrics/#how-metrics-are-measured)

## Evolución de los Web Vitals

Los Web Vitals y los Core Web Vitals son los mejores indicadores disponibles que los desarrolladores tienen en la actualidad para medir la calidad de la experiencia en la web, pero estos indicadores no son perfectos y se deben esperar mejoras o adiciones futuras.

Los **Core Web Vitals** son relevantes para todas las páginas web y aparecen en las herramientas relevantes de Google. Los cambios en estas métricas tendrán un impacto de gran alcance; por ello, los desarrolladores deben esperar que las definiciones y los umbrales de Core Web Vitals sean estables y que las actualizaciones ocurran con un previo aviso y una cadencia anual predecible.

Los otros Web Vitals suelen ser específicos del contexto o de la herramienta, y pueden ser más experimentales que los Core Web Vitals. Sus definiciones y umbrales pueden cambiar con mayor frecuencia.

Para todos los Web Vitals, los cambios se documentarán de manera clara en este [REGISTRO DE CAMBIOS](http://bit.ly/chrome-speed-metrics-changelog) público.
