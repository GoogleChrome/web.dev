---
layout: post
title: Evite encadenar solicitudes críticas
description: Conozca qué son las cadenas de solicitudes críticas, cómo afectan el rendimiento de la página web y cómo puede reducir el efecto.
date: '2019-05-02'
updated: '2020-04-29'
web_lighthouse:
  - cadenas-de-solicitudes-críticas
---

[Las cadenas de solicitudes críticas](https://developers.google.com/web/fundamentals/performance/critical-rendering-path) son una serie de solicitudes de red dependientes importantes para la representación de páginas. Cuanto mayor sea la longitud de las cadenas y los tamaños de descarga, más significativo será el impacto en el rendimiento de carga de la página.

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) informa solicitudes críticas cargadas con una prioridad alta:

<figure class="w-figure"><img class="w-screenshot" src="critical-request-chains.png" alt="Una captura de pantalla de la auditoría de profundidad de solicitudes críticas de Lighthouse Minimize"></figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo identifica Lighthouse las cadenas de solicitudes críticas

Lighthouse utiliza la prioridad de la red como proxy para identificar los recursos críticos que bloquean el procesamiento. [Consulte Programación y prioridades de recursos de Chrome](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit) de Google para obtener más información sobre cómo Chrome define estas prioridades.

Los datos sobre las cadenas de solicitudes críticas, el tamaño de los recursos y el tiempo dedicado a la descarga de recursos se extraen del [Protocolo de depuración remota de Chrome](https://github.com/ChromeDevTools/devtools-protocol) .

## Cómo reducir el efecto de las cadenas de solicitudes críticas en el rendimiento

Utilice los resultados de la auditoría de cadenas de solicitudes críticas para apuntar primero a los recursos que tienen el mayor efecto en la carga de la página:

- Minimice la cantidad de recursos críticos: elimínelos, posponga su descarga, `async` como asíncronos, etc.
- Optimice el número de bytes críticos para reducir el tiempo de descarga (número de viajes de ida y vuelta).
- Optimice el orden en que se cargan los recursos críticos restantes: descargue todos los activos críticos lo antes posible para acortar la longitud de la ruta crítica.

Obtenga más información sobre cómo optimizar sus [imágenes](/use-imagemin-to-compress-images) , [JavaScript](/apply-instant-loading-with-prpl) , [CSS](/defer-non-critical-css) y [fuentes web](/avoid-invisible-text) .

## Recursos

[Código fuente para minimizar la auditoría de **profundidad de solicitudes críticas**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/critical-request-chains.js)
