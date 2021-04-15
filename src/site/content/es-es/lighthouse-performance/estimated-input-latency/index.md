---
layout: post
title: Latencia de entrada estimada
description: Obtenga más información sobre la métrica de latencia de entrada estimada de Lighthouse y cómo medirla y optimizarla.
date: '2019-05-02'
updated: '2019-10-04'
web_lighthouse:
  - latencia de entrada estimada
---

La latencia de entrada estimada es una de las seis métricas que se registran en la **sección Rendimiento** del informe Lighthouse. Cada métrica captura algún aspecto de la velocidad de carga de la página.

Los informes Lighthouse muestran la latencia de entrada estimada en milisegundos:

<figure class="w-figure"><img class="w-screenshot w-screenshot--filled" src="estimated-input-latency.png" alt="Una captura de pantalla de la auditoría de latencia de entrada estimada de Lighthouse"></figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Qué mide la latencia de entrada estimada

La latencia de entrada estimada es una estimación de cuánto tiempo tarda tu aplicación en responder a la entrada del usuario durante la ventana de carga de página de 5 segundos más ocupada. El momento de esta auditoría es desde la [Primera pintura significativa](/first-meaningful-paint) hasta el final del seguimiento, que es aproximadamente 5 segundos después del [Tiempo para interactuar](/interactive) . Si su latencia es superior a 50 ms, los usuarios pueden percibir que su aplicación está retrasada.

El [modelo de rendimiento de RAIL](https://developers.google.com/web/fundamentals/performance/rail) recomienda que las aplicaciones respondan a la entrada del usuario en 100 ms, mientras que la puntuación objetivo de latencia de entrada estimada de Lighthouse es de 50 ms. ¿Por qué? Lighthouse usa una métrica de proxy (disponibilidad del hilo principal) para medir qué tan bien responde su aplicación a la entrada del usuario.

Lighthouse asume que su aplicación necesita 50 ms para responder completamente a la entrada del usuario (desde realizar cualquier ejecución de JavaScript hasta pintar físicamente los nuevos píxeles en la pantalla). Si su hilo principal no está disponible durante 50 ms o más, eso no deja suficiente tiempo para que su aplicación complete la respuesta.

Aproximadamente el 90% de los usuarios encontrarán la cantidad de latencia de entrada informada de Lighthouse o menos. El 10% de los usuarios puede esperar una mayor latencia.

## Cómo mejorar su puntuación de latencia de entrada estimada

Para que su aplicación responda a la entrada del usuario más rápido, optimice la forma en que se ejecuta su código en el navegador. Consulte la serie de técnicas descritas en la página[Rendimiento de representación de Google.](https://developers.google.com/web/fundamentals/performance/rendering/) Estos consejos van desde descargar la computación a los trabajadores web para liberar el hilo principal, refactorizar sus selectores CSS para realizar menos cálculos, hasta usar propiedades CSS que minimizan la cantidad de operaciones intensivas en el navegador.

{% Aside 'caution' %} La auditoría de latencia de entrada estimada no es una medida completa de la latencia de entrada. No mide cuánto tiempo realmente tarda tu aplicación en responder a la entrada de un usuario; tampoco mide que la respuesta de su aplicación a la entrada del usuario sea visualmente completa. {% endAside %}

## Cómo medir la latencia de entrada estimada manualmente

Para medir la latencia de entrada estimada manualmente, realice una grabación con la línea de tiempo de Chrome DevTools. Consulte [Hacer menos trabajo con el hilo principal](https://developers.google.com/web/tools/chrome-devtools/speed/get-started#main) para ver un ejemplo del flujo de trabajo. La idea básica es iniciar una grabación, realizar la entrada del usuario que desea medir, detener la grabación y luego analizar el gráfico de llamas para asegurarse de que [todas las etapas de la canalización de píxeles](https://developers.google.com/web/fundamentals/performance/rendering/#the_pixel_pipeline) se completen en 50 ms.

## Recursos

- [Código fuente para la auditoría de **latencia de entrada estimada**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/metrics/estimated-input-latency.js)
- [Guía de puntuación de Lighthouse v3](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Mida el rendimiento con el modelo RAIL](https://developers.google.com/web/fundamentals/performance/rail)
- [Rendimiento de renderizado](https://developers.google.com/web/fundamentals/performance/rendering/)
- [Optimice la velocidad del sitio web con Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/speed/get-started)
