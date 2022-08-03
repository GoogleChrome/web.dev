---
layout: post
title: First Contentful Paint (FCP)
authors:
  - philipwalton
date: 2019-11-07
updated: 2022-07-18
description: En esta publicación se presenta la métrica First Contentful Paint (FCP) y se explica como medirla
tags:
  - performance
  - metrics
---

{% Aside %} First Contentful Paint: Primer despliegue de contenido (FCP) es una métrica importante, centrada en el usuario, para medir la [velocidad de carga percibida](/user-centric-performance-metrics/#types-of-metrics) porque marca el primer punto en la línea de tiempo de carga de la página en el que el usuario puede ver algo en la pantalla: una FCP rápida ayuda a tranquilizar al usuario de que algo está [ocurriendo](/user-centric-performance-metrics/#questions). {% endAside %}

## ¿Qué es FCP?

La métrica "First Contentful Paint" (FCP) mide el tiempo que transcurre desde que la página comienza a cargarse hasta que cualquier parte del contenido de la página se representa en la pantalla. Para esta métrica, el "contenido" se refiere al texto, las imágenes (incluidas las imágenes que están en segundo plano), los elementos `<svg>` o los elementos `<canvas>` que no están en blanco.

{% Img src="image/admin/3UhlOxRc0j8Vc4DGd4dt.png", alt="Línea de tiempo de FCP de google.com", width="800", height="311", linkTo=true %}

En la carga anterior de la línea de tiempo, FCP ocurre en el segundo marco, ya que es cuando los primeros elementos de texto e imagen se renderizan en la pantalla.

Notará que, aunque se ha renderizado parte del contenido, no se ha renderizado todo. Esta es una distinción importante que se debe hacer entre *First* Contentful Paint (FCP) y *[Largest Contentful Paint (LCP)](/lcp/)*, cuyo objetivo es medir cuándo se terminó de cargar el contenido principal de la página.

<picture>
  <source srcset="{{ "image/eqprBhZUGfb8WYnumQ9ljAxRrA72/V1mtKJenViYAhn05WxqR.svg" | imgix }}" media="(min-width: 640px)" width="400" height="100">
  {% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/vQKpz0S2SGnnoXHMDidj.svg", alt="Los buenos valores de FCP son 1,8 segundos o menos, los valores malos son superiores a 3,0 segundos y cualquier cosa intermedia necesita mejora", width="400", height="300" %}
</picture>

### ¿Qué es una buena puntuación FCP?

Para brindar una buena experiencia de usuario, los sitios deberían esforzarse por tener una First Contentful Paint de **1.8 segundos** o menos. Para asegurarse de que está alcanzando este objetivo para la mayoría de sus usuarios, un buen umbral para medir es el **percentil 75** de cargas de páginas, segmentado en dispositivos móviles y equipos de escritorio.

## Cómo medir FCP

FCP se puede medir [en el laboratorio](/user-centric-performance-metrics/#in-the-lab) o [en el campo](/user-centric-performance-metrics/#in-the-field) y está disponible en las siguientes herramientas:

### Herramientas de campo

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
- [Search Console (informe de velocidad)](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html)
- [Biblioteca de JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals)

### Herramientas de laboratorio

- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Medir FCP en JavaScript

Para medir FCP en JavaScript, puede utilizar la [API de Paint Timing](https://w3c.github.io/paint-timing/). En el siguiente ejemplo se muestra cómo crear un [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) que capta una entrada de `paint` con el nombre `first-contentful-paint` y la registra en la consola.

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
    console.log('FCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'paint', buffered: true});
```

{% Aside 'warning' %}

En este código se muestra cómo registrar la entrada `first-contentful-paint` en la consola, pero medir FCP en JavaScript es más complicado. Vea a continuación los detalles:

{% endAside %}

En el ejemplo anterior, la entrada registrada `first-contentful-paint` le indicará cuándo se desplegó el primer elemento de contenido. Sin embargo, en algunos casos esta entrada no es válida para medir FCP.

En la siguiente sección se enumeran las diferencias entre lo que reporta la API y cómo se calcula la métrica.

#### Diferencias entre la métrica y la API

- La API enviará una entrada `first-contentful-paint` para las páginas cargadas en una pestaña de segundo plano, pero esas páginas deben ser ignoradas cuando se calcule el FCP (los tiempos del primer despliegue solo deben considerarse si la página estuvo en primer plano todo el tiempo).
- La API no reporta `first-contentful-paint` cuando la página se restaura desde la [caché de retroceso/avance](/bfcache/#impact-on-core-web-vitals), pero LCP debe medirse en estos casos, ya que los usuarios las experimentan como visitas de página distintas.
- Es [posible que la API no reporte los tiempos de despliegue de los iframes de origen cruzado](https://w3c.github.io/paint-timing/#:~:text=cross-origin%20iframes), pero para medir correctamente el FCP, debe considerar todos los marcos. Los sub-marcos pueden usar la API para reportar sus tiempos de despliegue al marco principal para su incorporación.

En vez de memorizar todas estas diferencias sutiles, los desarrolladores pueden utilizar la [Biblioteca de JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals) para medir FCP, que maneja estas diferencias por usted (cuando sea posible):

```js
import {getFCP} from 'web-vitals';

// Measure and log FCP as soon as it's available.
getFCP(console.log);
```

Puede consultar [el código fuente de `getFCP()`](https://github.com/GoogleChrome/web-vitals/blob/master/src/getFCP.ts) para obtener un ejemplo completo de cómo medir FCP en JavaScript.

{% Aside %} En algunos casos (como los iframes de origen cruzado) no es posible medir LCP en JavaScript. Consulte la sección de [limitaciones](https://github.com/GoogleChrome/web-vitals#limitations) `web-vitals` para obtener más información. {% endAside %}

## Cómo mejorar FCP

Para aprender a mejorar FCP para un sitio específico, puede ejecutar una auditoría de desempeño Lighthouse y prestar atención a cualquier [oportunidad](/lighthouse-performance/#opportunities) específica que sugiera la auditoría.

Para saber cómo mejorar la FCP en general (para cualquier sitio), consulte las siguientes normas de rendimiento:

- [Eliminar los recursos que bloquean el renderizado](/render-blocking-resources/)
- [Minificar CSS](/unminified-css/)
- [Eliminar CSS no utilizado](/unused-css-rules/)
- [Preconectar a los orígenes requeridos](/uses-rel-preconnect/)
- [Reducir los tiempos de respuesta del servidor (TTFB)](/ttfb/)
- [Evitar los redireccionamientos de varias páginas](/redirects/)
- [Precargar solicitudes clave](/uses-rel-preload/)
- [Evitar cargas útiles de red enormes](/total-byte-weight/)
- [Publicar activos estáticos con una política de caché eficiente](/uses-long-cache-ttl/)
- [Evitar un tamaño de DOM excesivo](/dom-size/)
- [Minimizar la profundidad de la solicitud crítica](/critical-request-chains/)
- [Asegurarse de que el texto permanezca visible durante la carga de la fuente web](/font-display/)
- [Mantener la cantidad de solicitudes bajas y los tamaños de transferencia reducidos](/resource-summary/)

{% include 'content/metrics/metrics-changelog.njk' %}
