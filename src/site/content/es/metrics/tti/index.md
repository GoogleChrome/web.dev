---
layout: post
title: Time to Interactive (TTI)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-06-15
description: En esta publicación se presenta la métrica Time to Interactive (TTI) y se explica como medirla
tags:
  - performance
  - metrics
---

{% Aside %} Time to Interactive: Tiempo de interacción (TTI) es una [métrica de laboratorio](/user-centric-performance-metrics/#in-the-lab) importante para medir la [capacidad de respuesta de la carga](/user-centric-performance-metrics/#types-of-metrics). Ayuda a identificar casos en los que una página *parece* interactiva pero en realidad no lo es. Una TTI rápida ayuda a garantizar que la página sea [útil](/user-centric-performance-metrics/#questions). {% endAside %}

## ¿Qué es TTI?

La métrica TTI mide el tiempo que transcurre desde que se inicia la carga de la página hasta que se cargan sus principales recursos secundarios y es capaz de responder de manera confiable a la entrada del usuario rápidamente.

Para calcular la TTI a partir de un [seguimiento](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/) de rendimiento de una página web, siga estos pasos:

1. Comience en [First Contentful Paint: Despliegue de la primera entrada (FCP)](/fcp/).
2. Busque en el tiempo una ventana tranquila de al menos cinco segundos, donde la *ventana tranquila* se define como: ninguna [tarea larga](/custom-metrics/#long-tasks-api) y no más de dos solicitudes GET en la red de abordaje.
3. Busque hacia atrás la última tarea larga antes de la ventana tranquila, que se detiene en FCP si no se encuentran tareas largas.
4. TTI es la hora de finalización de la última tarea larga antes de la ventana tranquila (o el mismo valor que FCP si no se encuentran tareas largas).

El siguiente diagrama debería ayudar a visualizar los pasos anteriores:

{% Img src="image/admin/WZM0n4aXah67lEyZugOT.svg", alt="Una línea de tiempo para cargar la página que muestra cómo calcular TTI", width="800", height="473", linkTo=true %}

Históricamente, los desarrolladores han optimizado las páginas para obtener tiempos de renderizado rápidos, a veces a expensas de TTI.

Técnicas como el renderizado del lado del servidor (SSR) pueden llevar a escenarios en los que una página *parece* interactiva (es decir, los enlaces y botones son visibles en la pantalla), pero en *realidad* no es interactiva porque el subproceso principal está bloqueado o porque el código JavaScript que controla esos elementos no se ha cargado.

Cuando los usuarios intentan interactuar con una página que parece interactiva pero que en realidad no lo es, es probable que respondan de una de estas dos formas:

- En el mejor de los casos, les molestará que la página tarde en responder.
- En el peor de los casos, asumirán que el enlace de la página está roto y probablemente se irán. Incluso pueden perder la confianza o la confianza en el valor de su marca.

Para evitar este problema, haga todo lo posible para minimizar la diferencia entre FCP y TTI. Y en los casos en que exista una diferencia notable, déjelo claro, mediante indicadores visuales, que los componentes de su página aún no son interactivos.

## Cómo medir TTI

TTI es una métrica que se mide mejor [en el laboratorio](/user-centric-performance-metrics/#in-the-lab) . La mejor manera de medir TTI es ejecutar una auditoría de desempeño Lighthouse en su sitio. Consulte la [documentación de Lighthouse sobre TTI](/tti/) para obtener información sobre su uso.

### Herramientas de laboratorio

- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest](https://www.webpagetest.org/)

{% Aside %} Si bien es posible medir TTI en el campo, no se recomienda ya que la interacción del usuario puede afectar la TTI de su página de manera que genere muchas variaciones en sus reportes. Para comprender la interactividad de una página en el campo, debe medir [First Input Delay (FID)](/fid/). {% endAside %}

## ¿Qué es una buena puntuación TTI?

Para ofrecer una buena experiencia de usuario, los sitios deben esforzarse por tener un Time to Interactive inferior a **5 segundos** cuando se prueban en el **hardware de un dispositivo móvil promedio**.

Para obtener más información sobre cómo la TTI de su página afecta a su puntuación de rendimiento de Lighthouse, consulte [Cómo determina Lighthouse su puntuación TTI](https://developer.chrome.com/docs/lighthouse/performance/interactive/#how-lighthouse-determines-your-tti-score).

## Cómo mejorar TTI

Para aprender a mejorar TTI para un sitio específico, puede ejecutar una auditoría de desempeño Lighthouse y prestar atención a cualquier [oportunidad](https://developer.chrome.com/docs/lighthouse/performance/#opportunities) específica que sugiera la auditoría.

Para saber cómo mejorar la TTI en general (para cualquier sitio), consulte las siguientes normas de rendimiento:

- [Minificar JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unminified-javascript/)
- [Preconectar a los orígenes requeridos](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preconnect/)
- [Precargar solicitudes clave](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preload/)
- [Reducir el impacto en el código de terceros](https://developer.chrome.com/docs/lighthouse/performance/third-party-summary/)
- [Minimizar la profundidad de la solicitud crítica](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/)
- [Reducir el tiempo de ejecución de JavaScript](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/)
- [Minimizar el trabajo del subproceso principal](https://developer.chrome.com/docs/lighthouse/performance/mainthread-work-breakdown/)
- [Mantener la cantidad de solicitudes bajas y los tamaños de transferencia reducidos](https://developer.chrome.com/docs/lighthouse/performance/resource-summary/)
