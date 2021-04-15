---
layout: post
title: Reducir el tiempo de ejecución de JavaScript
description: |2

  Descubra cómo la ejecución de JavaScript puede ralentizar el rendimiento de su página

  y cómo puedes acelerarlo.
date: '2019-05-02'
updated: '2019-10-04'
web_lighthouse:
  - tiempo de arranque
---

Cuando su JavaScript tarda mucho en ejecutarse, ralentiza el rendimiento de su página de varias formas:

- **Costo de la red**

    Más bytes equivalen a tiempos de descarga más largos.

- **Analizar y compilar el costo**

    JavaScript se analiza y compila en el hilo principal. Cuando el hilo principal está ocupado, la página no puede responder a la entrada del usuario.

- **Costo de ejecución**

    JavaScript también se ejecuta en el hilo principal. Si su página ejecuta mucho código antes de que sea realmente necesario, eso también retrasa su [tiempo de interacción](/interactive) , que es una de las métricas clave relacionadas con la forma en que los usuarios perciben la velocidad de su página.

- **Costo de memoria**

    Si su JavaScript se aferra a muchas referencias, potencialmente puede consumir mucha memoria. Las páginas se ven desordenadas o lentas cuando consumen mucha memoria. Las pérdidas de memoria pueden hacer que su página se congele por completo.

## Cómo falla la auditoría de tiempo de ejecución de Lighthouse JavaScript

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) muestra una advertencia cuando la ejecución de JavaScript tarda más de 2 segundos. La auditoría falla cuando la ejecución tarda más de 3,5 segundos:

<figure class="w-figure"><img class="w-screenshot" src="bootup-time.png" alt="Una captura de pantalla de la auditoría del tiempo de ejecución de Lighthouse Reduce JavaScript"></figure>

Para ayudarlo a identificar los mayores contribuyentes al tiempo de ejecución, Lighthouse informa el tiempo dedicado a ejecutar, evaluar y analizar cada archivo JavaScript que carga su página.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo acelerar la ejecución de JavaScript

{% include 'content/lighthouse-performance/js-perf.njk' %}

## Recursos

[Código fuente para la auditoría **Reducir el tiempo de ejecución de JavaScript**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/bootup-time.js)
