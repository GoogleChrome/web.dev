---
layout: post
title: Reducir el tiempo de ejecución de JavaScript
description: |-
  Descubra cómo la ejecución de JavaScript puede ralentizar el rendimiento de su página
  y cómo usted puede acelerarlo.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - bootup-time
tags:
  - memory
---

Cuando su JavaScript tarda mucho en ejecutarse, ralentiza el rendimiento de su página de varias formas:

- **Costo de la red**

    Más bytes equivalen a tiempos de descarga más largos.

- **Analizar y compilar el costo**

    JavaScript se analiza y compila en el hilo principal. Cuando el hilo principal está ocupado, la página no puede responder a los datos de entrada del usuario.

- **Costo de ejecución**

    JavaScript también se ejecuta en el hilo principal. Si su página ejecuta mucho código antes de que sea realmente necesario, eso también retrasa el [Time to Interactive (tiempo de interacción)](/tti/), que es una de las métricas clave relacionadas con la forma en que los usuarios perciben la velocidad de su página.

- **Costo de memoria**

    Si su JavaScript se adhiere a muchas referencias, potencialmente puede consumir mucha memoria. Las páginas se ven desordenadas o lentas cuando consumen mucha memoria. Las pérdidas de memoria pueden hacer que su página se congele por completo.

## Cómo fallar la auditoría Reducir el tiempo de ejecución de JavaScript de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) muestra una advertencia cuando la ejecución de JavaScript tarda más de 2 segundos. La auditoría falla cuando la ejecución tarda más de 3,5 segundos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BoomMoQNycPXsy34DZZs.png", alt="Una captura de pantalla de la auditoría de Lighthouse Reducir el tiempo de ejecución de JavaScript", width="800", height="321" %}</figure>

Para ayudarlo a identificar los mayores contribuyentes al tiempo de ejecución, Lighthouse informa el tiempo dedicado a ejecutar, evaluar y analizar cada archivo JavaScript que carga su página.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo acelerar la ejecución de JavaScript

{% include 'content/lighthouse-performance/js-perf.njk' %}

## Recursos

[Código fuente para la auditoría **Reducir el tiempo de ejecución de JavaScript**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/bootup-time.js)
