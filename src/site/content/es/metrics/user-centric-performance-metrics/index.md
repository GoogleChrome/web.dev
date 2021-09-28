---
layout: post
title: Métricas de rendimiento centradas en el usuario
authors:
  - philipwalton
date: 2019-11-08
description: Las métricas de rendimiento centradas en el usuario son una herramienta fundamental para comprender y mejorar la experiencia de su sitio web de forma que beneficie a los usuarios reales.
tags:
  - performance
  - metrics
---

Todos hemos oído hablar de la importancia del rendimiento. Pero cuando hablamos de rendimiento, y de hacer que los sitios web sean "rápidos", ¿a qué nos referimos específicamente?

La verdad es que el rendimiento es relativo:

- Un sitio puede ser rápido para un usuario (en una red rápida con un dispositivo potente) pero lento para otro (en una red lenta con un dispositivo de gama baja).
- Dos sitios pueden terminar de cargarse al mismo tiempo, pero uno puede *parecer* más rápido (si carga el contenido de forma progresiva en vez de esperar hasta el final para mostrar algo).
- Puede *parecer* que un sitio se carga rápidamente, pero luego responde lentamente (o no responde en absoluto) a la interacción del usuario.

Por eso, cuando se habla de rendimiento, es importante ser preciso y referirse al rendimiento en términos de criterios objetivos que pueden medirse cuantitativamente. Estos criterios se conocen como *métricas*.

Pero el hecho de que una métrica se base en criterios objetivos y pueda medirse cuantitativamente no significa necesariamente que esas medidas sean útiles.

## Definición de las métricas

Históricamente, el rendimiento web se ha medido con el evento <code>[load](https://developer.mozilla.org/docs/Web/API/Window/load_event)</code>. Sin embargo, aunque <code>load</code> es un momento bien definido en el ciclo de vida de una página, ese momento no corresponde necesariamente con algo que le interese al usuario.

Por ejemplo, un servidor podría responder con una página mínima que se "cargue" inmediatamente, pero que luego retrase la búsqueda de contenido y la visualización de cualquier cosa en la página hasta varios segundos después de que se active el evento `load`. Si bien esta página podría tener técnicamente un tiempo de carga rápido, ese tiempo no correspondería con la forma en que el usuario experimenta realmente la carga de la página.

En los últimos años, los miembros del equipo de Chrome, en colaboración con el [Grupo de trabajo de rendimiento web del W3C](https://www.w3.org/webperf/), han estado trabajando para estandarizar un conjunto de nuevas API y métricas que miden con mayor precisión cómo los usuarios experimentan el rendimiento de una página web.

Para ayudar a garantizar que las métricas sean relevantes para los usuarios, las enmarcamos en torno a algunas preguntas clave:

<table id="questions">
  <tr>
    <td><strong>¿Está sucediendo?</strong></td>
    <td>¿La navegación se inició correctamente? ¿Ha respondido el servidor?</td>
  </tr>
  <tr>
    <td><strong>¿Es útil?</strong></td>
    <td>¿Se ha renderizado suficiente contenido para que los usuarios puedan interactuar con él?</td>
  </tr>
  <tr>
    <td><strong>¿Es utilizable?</strong></td>
    <td>¿Los usuarios pueden interactuar con la página o está ocupada?</td>
  </tr>
  <tr>
    <td><strong>¿Es delicioso?</strong></td>
    <td>¿Son las interacciones fluidas y naturales, libres de retrasos y bloqueos?</td>
  </tr>
</table>

## Cómo se miden las métricas

Las métricas de rendimiento generalmente se miden de dos maneras:

- **En el laboratorio:** uso de herramientas para simular la carga de una página en un entorno controlado y uniforme
- **En el campo**: en usuarios reales que realmente cargan e interactúan con la página

Ninguna de estas opciones es necesariamente mejor o peor que la otra; de hecho, por lo general, conviene utilizar ambas para garantizar un buen rendimiento.

### En el laboratorio

Probar el rendimiento en el laboratorio es esencial cuando se desarrollan nuevas funciones. Antes de que las funciones se emitan en el proceso de producción, es imposible medir sus características de rendimiento en usuarios reales, por lo que probarlas en el laboratorio antes de que se lancen es la mejor manera de evitar regresiones en el rendimiento.

### En el campo

Por otro lado, si bien las pruebas en el laboratorio son una aproximación razonable del rendimiento, no necesariamente reflejan lo que experimentan todos los usuarios de su sitio en la realidad.

El rendimiento de un sitio puede variar drásticamente según las capacidades del dispositivo del usuario y las condiciones de su red. También puede variar en función de si el usuario interactúa con la página (o cómo lo hace).

Además, la carga de las páginas puede que no sea determinista. Por ejemplo, los sitios que cargan contenido o anuncios personalizados pueden experimentar características de rendimiento muy diferentes de un usuario a otro. Una prueba de laboratorio no captará esas diferencias.

La única forma de saber realmente cómo es el rendimiento de su sitio para sus usuarios es medir realmente su rendimiento conforme esos usuarios lo cargan e interactúan con él. Este tipo de medidas se conoce comúnmente como [Monitoreo de usuarios reales](https://en.wikipedia.org/wiki/Real_user_monitoring), o RUM para abreviar.

## Tipos de métricas

Hay otros tipos de métricas que son relevantes para cómo los usuarios perciben el rendimiento.

- **Perceived load speed: Velocidad de carga percibida.** Mide la rapidez con la que una página puede cargar y renderizar todos sus elementos visuales en la pantalla.
- **Load responsiveness: Capacidad de respuesta de la carga.** Mide la rapidez con la que una página puede cargar y ejecutar cualquier código de JavaScript necesario para que los componentes respondan rápidamente a las interacciones con el usuario.
- **Runtime responsiveness: Capacidad de respuesta para el tiempo de ejecución.** Después de que carga la página, ¿qué tan rápido puede responder la página a la interacción del usuario?
- **Visual stability: Estabilidad visual.** ¿Los elementos de la página cambian de una forma inesperada para los usuarios y pueden interferir en sus interacciones?
- **Smoothness: Fluidez.** ¿Las transiciones y animaciones se renderizan con una frecuencia de cuadros por segundo constante y tienen fluidez de un estado a otro?

Al tener en cuenta todos los tipos de métricas de rendimiento anteriores, se espera que quede claro que ninguna métrica por sí sola es suficiente para captar todas las características de rendimiento de una página.

## Métricas importantes que se deben medir

- **[First Contentful Paint: Despliegue del primer contenido (FCP)](/fcp/):** Mide el tiempo que transcurre desde que la página comienza a cargarse hasta que cualquier parte del contenido de la página se renderiza en la pantalla. *([laboratorio](#in-the-lab), [campo](#in-the-field))*
- **[Largest Contentful Paint: Despliegue del contenido más extenso (LCP)](/lcp/):** Mide el tiempo que transcurre desde que la página comienza a cargarse hasta que el bloque de texto o elemento de imagen más extenso se representa en la pantalla. *([laboratorio](#in-the-lab), [campo](#in-the-field))*
- **[First Input Delay: Demora de la primera entrada](/fid/):** Mide el tiempo que transcurre desde que un usuario interactúa por primera vez con su sitio web (es decir, cuando hace clic en un enlace, pulsa un botón o utiliza un control personalizado basado en JavaScript) hasta el momento en que el navegador es capaz de responder a esa interacción. *([campo](#in-the-field))*
- **[Time to Interactive: Tiempo para interactuar  (TTI)](/tti/):** Mide el tiempo que transcurre desde que la página comienza a cargarse hasta que se renderiza visualmente, sus scripts iniciales (si los hay) se cargan y son capaces de responder de forma confiable y rápida a las entradas del usuario. *([laboratorio](#in-the-lab))*
- **[Total Blocking Time: Tiempo de bloqueo total (TBT)](/tbt/):** Mide la cantidad total de tiempo entre FCP y TTI donde el subproceso principal estuvo bloqueado el tiempo suficiente para impedir la respuesta de la entrada. *([laboratorio](#in-the-lab))*
- **[Cumulative Layout Shift: Cambio Acumulativo del diseño (CLS)](/cls/):** Mide la puntuación acumulada de todos los cambios de diseño inesperados que se producen entre el momento en que la página comienza a cargarse y cuando su [estado de ciclo de vida](https://developers.google.com/web/updates/2018/07/page-lifecycle-api) cambia a oculto. *([laboratorio](#in-the-lab), [campo](#in-the-field))*

Aunque esta lista incluye métricas que miden muchos de los diversos aspectos del rendimiento relevantes para los usuarios, no incluye todo (por ejemplo, la capacidad de respuesta y la fluidez en el tiempo de ejecución no están cubiertas actualmente).

En algunos casos, se introducirán nuevas métricas para cubrir las áreas que faltan, pero en otros casos, las mejores métricas son las que se adaptan específicamente a su sitio.

## Métricas personalizadas

Las métricas de rendimiento enumeradas anteriormente son buenas para obtener una comprensión general de las características de rendimiento de la mayoría de los sitios en la web. También son buenas para tener un conjunto común de métricas para que los sitios puedan comparar su rendimiento con el de sus competidores.

Sin embargo, puede haber ocasiones en las que un sitio específico sea único de alguna manera que requiera métricas adicionales para capturar la imagen completa del rendimiento. Por ejemplo, la métrica LCP está pensada para medir cuándo termine de cargarse el contenido principal de una página, pero podría haber casos en los que el elemento más grande no forme parte del contenido principal de la página y, por tanto, LCP puede que no sea relevante.

Para abordar estos casos, el Grupo de trabajo de rendimiento web también estandarizó la API de nivel inferior que pueden ser útiles para implementar sus propias métricas personalizadas:

- [API para sincronizar usuarios](https://w3c.github.io/user-timing/)
- [API de tareas largas](https://w3c.github.io/longtasks/)
- [API para sincronizar elementos](https://wicg.github.io/element-timing/)
- [API para sincronizar la navegación](https://w3c.github.io/navigation-timing/)
- [API para sincronizar los recursos](https://w3c.github.io/resource-timing/)
- [Sincronizador de servidores](https://w3c.github.io/server-timing/)

Consulte la guía sobre [métricas personalizadas](/custom-metrics/) para saber cómo utilizar estas API para medir las características de rendimiento específicas de su sitio.
