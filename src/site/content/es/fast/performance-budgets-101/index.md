---
layout: post
title: Presupuestos para rendimiento 101
authors:
  - mihajlija
description: El buen rendimiento rara vez es un efecto secundario. Obtenga información sobre los presupuestos de rendimiento y cómo pueden encaminarlo hacia el éxito.
date: 2018-11-05
tags:
  - performance
---

El rendimiento es una parte importante de la experiencia del usuario y [afecta las métricas comerciales](https://wpostats.com/). Es tentador pensar que si eres un buen desarrollador terminarás con un sitio de alto rendimiento, pero la verdad es que un buen rendimiento rara vez es un efecto secundario. Como ocurre con la mayoría de las cosas, para alcanzar una meta hay que definirla con claridad. Empiece estableciendo un **presupuesto de rendimiento**.

## Definición

Un presupuesto de rendimiento es un conjunto de límites impuestos a las métricas que afectan el rendimiento del sitio. Este podría ser el tamaño total de una página, el tiempo que tarda en cargarse en una red móvil o incluso el número de solicitudes HTTP que se envían. Definir un presupuesto ayuda a iniciar la conversación sobre el rendimiento web. Sirve como punto de referencia para tomar decisiones sobre diseño, tecnología y agregar funciones.

Tener un presupuesto permite a los diseñadores pensar en los efectos de las imágenes de alta resolución y la cantidad de fuentes web que eligen. También ayuda a los desarrolladores a comparar diferentes enfoques ante un problema y evaluar marcos y bibliotecas en función de su tamaño y [costo de análisis](https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4).

## Elegir las métricas

### Métricas basadas en la cantidad ⚖️

Estas métricas son útiles en las primeras etapas de desarrollo porque resaltan el impacto de incluir imágenes y scripts pesados. También son fáciles de comunicar tanto a diseñadores como a desarrolladores.

Ya hemos mencionado algunas cosas que se pueden incluir en un presupuesto de rendimiento, como el peso de la página y la cantidad de solicitudes HTTP, pero puede dividirlas en límites más granulares como:

- Tamaño máximo de imágenes
- Número máximo de fuentes web
- Tamaño máximo de scripts, incluyendo marcos
- Número total de recursos externos, como scripts de terceros

Sin embargo, estos números no le dicen mucho sobre la experiencia del usuario. Dos páginas con la misma cantidad de solicitudes o el mismo peso se pueden procesar de manera diferente según el orden en que se soliciten los recursos. Si un [recurso crítico](/critical-rendering-path/) como una imagen principal o una hoja de estilo en una de las páginas se carga tarde en el proceso, los usuarios esperarán más para ver algo útil y percibirán la página como más lenta. Si en la otra página las partes más importantes se cargan rápidamente, es posible que ni siquiera se den cuenta si el resto de la página no lo hace.

<figure>{% Img src ="image/admin/U0QhA82KFyED4r1y3tAq.png", alt="Imagen del procesamiento progresivo de la página basada en la ruta crítica", width="611", height="300" %}</figure>

Por eso es importante realizar un seguimiento de otro tipo de métrica.

### Tiempos de hito ⏱️

Los tiempos de hito marcan eventos que suceden durante la carga de la página, como [DOMContentLoaded](https://developer.mozilla.org/docs/Web/Events/DOMContentLoaded) o un evento de [carga.](https://developer.mozilla.org/docs/Web/Events/load) Los tiempos más útiles sonlas  [métricas de rendimiento centradas en el usuario](/user-centric-performance-metrics/) que le dicen algo sobre la experiencia al cargar una página. Estas métricas están disponibles a través de las [API del navegador](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#measuring_these_metrics_on_real_users_devices) y como parte de los informes [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/).

La métrica [First Contentful Paint o primer despliegue de contenido (FCP)](/fcp/) mide el momento en que el navegador muestra el primer fragmento de contenido del DOM, como texto o imágenes.

[Time to Interactive o tiempo de interacción (TTI)](/tti/) mide el tiempo que tarda una página en volverse completamente interactiva y responder de manera confiable a la entrada del usuario. El seguimiento de esta métrica es muy importante si espera algún tipo de interacción del usuario en la página, como hacer clic en enlaces, botones, escribir o usar elementos de formulario.

### Métricas basadas en reglas 💯

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) y [WebPageTest](https://www.webpagetest.org/) calculan [las puntuaciones de rendimiento](https://developers.google.com/web/tools/lighthouse/scoring#perf-scoring) en función de las reglas generales de mejores prácticas, que puede utilizar como directrices. Como beneficio adicional, Lighthouse también le ofrece sugerencias para optimizaciones simples.

Obtendrá los mejores resultados si realiza un seguimiento de una combinación de métricas de rendimiento basadas en la cantidad y centradas en el usuario. Concéntrese en el tamaño de los activos en las primeras fases de un proyecto y comience a rastrear FCP y TTI en cuanto sea posible.

## Establecer una base de referencia

La única forma de saber realmente qué funciona mejor para su sitio es probarlo: investigar y luego probar sus hallazgos. Analice la competencia para realizar una comparación. 🕵️

Si no tiene tiempo para eso, aquí hay buenos números predeterminados para comenzar:

- Menos de **5 s** Tiempo para interactuar
- Menos de **170 KB** de recursos de [ruta crítica](/critical-rendering-path/) (comprimidos/minificados)

Estos [números](https://infrequently.org/2017/10/can-you-afford-it-real-world-web-performance-budgets/) se calculan en función de los dispositivos de referencia del mundo real y **la velocidad de la red 3G**. [Más de la mitad del tráfico de Internet](https://www.statista.com/statistics/277125/share-of-website-traffic-coming-from-mobile-devices/) actual ocurre en redes móviles, por lo que debe usar la velocidad de la red 3G como punto de partida.

### Ejemplos de presupuestos

Debe tener un presupuesto establecido para los diferentes tipos de páginas de su sitio, ya que el contenido variará. Por ejemplo:

- Nuestra página de producto debe enviar menos de 170 KB de JavaScript en dispositivos móviles
- Nuestra página de búsqueda debe incluir menos de 2 MB de imágenes en el escritorio
- Nuestra página de inicio debe cargarse y volverse interactiva en &lt; 5 s con 3G lento en un teléfono Moto G4
- Nuestro blog debe obtener una puntuación &gt; 80 en las auditorías de rendimiento de Lighthouse

## Agregue presupuestos de desempeño a su proceso de construcción

{% Img src="image/admin/YKJcgI9Yd8qEZM0nzPuv.png", alt="Logotipos de Webpack, tamaño de paquete y Lighthouse", width="800", height="267" %}

La elección de una herramienta dependerá mucho de la escala de su proyecto y de los recursos que pueda dedicar a la tarea. Hay algunas herramientas de código abierto que pueden ayudarlo a agregar presupuestos a su proceso de construcción:

- [Funciones de rendimiento de Webpack](https://webpack.js.org/configuration/performance/)
- [bundlesize](https://github.com/siddharthkp/bundlesize)
- [CI Lighthouse](https://github.com/GoogleChrome/lighthouse-ci)

Si algo supera un umbral definido, puede:

- Optimizar una característica o activo existente 🛠️
- Eliminar una característica o activo existente 🗑️
- No agregar la nueva característica o activo ✋⛔

## Seguimiento del rendimiento

Asegurarse de que su sitio sea lo suficientemente rápido significa que debe seguir midiendo después del lanzamiento inicial. El seguimiento de estas métricas a lo largo del tiempo y la [obtención de datos de usuarios reales](https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/) le mostrará la manera en que los cambios en el rendimiento afectan las métricas comerciales clave.

## En conclusión

El propósito de un presupuesto de rendimiento es asegurarse de que se concentre en el rendimiento a lo largo de un proyecto; establecerlo temprano ayudará a evitar retroceder más adelante. Debe ser el punto de referencia para ayudarle a descubrir qué incluir en su sitio web. La idea principal es establecer objetivos para que pueda equilibrar mejor el rendimiento sin dañar la funcionalidad o la experiencia del usuario.

La siguiente guía lo llevará a través de la definición de su primer presupuesto de desempeño en unos pocos pasos.
