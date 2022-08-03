---
layout: post
title: Evite encadenar solicitudes críticas
description: |2-

  Conozca qué son las cadenas de solicitudes críticas, cómo afectan el rendimiento de la página web,

  y cómo se puede reducir su efecto.
date: 2019-05-02
updated: 2020-04-29
web_lighthouse:
  - cadenas-de-solicitudes-críticas
---

[Las cadenas de solicitudes críticas](https://developers.google.com/web/fundamentals/performance/critical-rendering-path) son una serie de solicitudes de red dependientes importantes para la representación de páginas. Cuanto mayor sea la longitud de las cadenas y los tamaños de descarga, más significativo será el impacto en el rendimiento de carga de la página.

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) informa sobre las solicitudes críticas cargadas con una prioridad alta:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/apWYFAWSuxf9tQHuogSN.png", alt="Una captura de pantalla de la auditoría de Minimización de profundidad de solicitudes críticas de Lighthouse", width="800", height="452" %}</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo identifica Lighthouse las cadenas de solicitudes críticas

Lighthouse utiliza la prioridad de red como proxy para identificar los recursos críticos que bloquean el renderizado. Consulte la [Programación y prioridades de recursos de Chrome](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit) de Google para obtener más información sobre cómo Chrome define estas prioridades.

Los datos sobre las cadenas de solicitudes críticas, el tamaño de los recursos y el tiempo dedicado a descargar recursos se extraen del [Protocolo de depuración remota de Chrome](https://github.com/ChromeDevTools/devtools-protocol) .

## Cómo reducir el efecto de las cadenas de solicitudes críticas en el rendimiento

Utilice los resultados de la auditoría de cadenas de solicitudes críticas para enfocarse en los recursos que tienen el mayor efecto en la carga de la página:

- Minimice la cantidad de recursos críticos: elimínelos, difiera su descarga, márquelos como `async` , etc.
- Optimice el número de bytes críticos para reducir el tiempo de descarga (número de viajes de ida y vuelta).
- Optimice el orden en el que se cargan los recursos críticos restantes: descargue todos los activos críticos lo antes posible para acortar la longitud de la ruta crítica.

Obtenga más información sobre cómo optimizar sus [imágenes](/use-imagemin-to-compress-images), [JavaScript](/apply-instant-loading-with-prpl), [CSS](/defer-non-critical-css) y [fuentes web](/avoid-invisible-text).

## Directrices específicas según la pila

### Magento

Si no está agrupando sus activos de JavaScript, considere usar [baler](https://github.com/magento/baler).

## Recursos

[Código fuente para minimizar la auditoría de **Minimización de profundidad de solicitudes críticas**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/critical-request-chains.js)
