---
layout: post
title: La carga de la página no es lo suficientemente rápida en las redes móviles
description: |2

  Aprenda a hacer que su página web se cargue rápidamente en redes móviles.
web_lighthouse:
  - load-fast-enough-for-pwa
date: 2019-05-04
updated: 2020-06-10
---

Muchos usuarios de su página visitan usando una conexión de red celular lenta. Hacer que su página se cargue rápidamente en una red móvil ayuda a garantizar una experiencia positiva para sus usuarios móviles.

{% Aside 'note' %} La carga rápida de una página en una red móvil es un requisito básico para que un sitio se considere una aplicación web progresiva. Consulte la [lista de verificación de requisitos esenciales para una aplicación web progresiva](/pwa-checklist/#core). {% endAside %}

## Cómo la auditoría de Lighthouse de velocidad de carga de páginas falla

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las páginas que no se cargan lo suficientemente rápido en dispositivos móviles:

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Cg0UJ1Lykj672ygYYeXo.png", alt = "La auditoría de Lighthouse muestra que la página no se carga lo suficientemente rápido en el dispositivo móvil", width = "800", height = "98"%}</figure>

Dos métricas principales afectan la forma en que los usuarios perciben el tiempo de carga:

- [First Meaningful Paint: Primer despliegue significativo (FMP)](/first-meaningful-paint), que mide cuándo el contenido principal de la página aparece visualmente completo
- [Time to Interactive: Tiempo de interacción (TTI)](/tti/), que mide cuándo la página es completamente interactiva

Por ejemplo, si una página aparece visualmente completa después de 1 segundo, pero el usuario no puede interactuar con ella durante 10 segundos, es probable que los usuarios perciban que el tiempo de carga de la página es de 10 segundos.

Lighthouse calcula lo que sería el TTI en una conexión de red 4G lenta. Si el tiempo para interactuar es más de 10 segundos, la auditoría falla.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Cómo mejorar el tiempo de carga de su página

{% include 'content/lighthouse-performance/improve.njk' %}

## Recursos

- [Código fuente para la **Page load is not fast enough on mobile networks** (carga de la página no es lo suficientemente rápido) en la auditoría de redes móviles](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/load-fast-enough-for-pwa.js)
- [Lista de verificación de la aplicación web progresiva base](https://developers.google.com/web/progressive-web-apps/checklist#baseline)
- [Ruta de renderización crítica](/critical-rendering-path/)
- [Empiece a analizar el rendimiento en tiempo de ejecución](https://developer.chrome.com/docs/devtools/evaluate-performance/)
- [Registro de rendimiento de carga](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#record-load)
- [Optimización de la eficiencia del contenido](/performance-optimizing-content-efficiency/)
- [Rendimiento de renderizado](/rendering-performance/)
