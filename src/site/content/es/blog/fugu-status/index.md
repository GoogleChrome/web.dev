---
layout: post
title: Estado de las nuevas capacidades
subhead: Las aplicaciones web deberían ser capaces de hacer todo lo que las aplicaciones de escritorio/iOS/Android pueden hacer. Los miembros del proyecto de capacidades entre empresas quieren hacer posible que usted cree y entregue aplicaciones en la web abierta que nunca antes habían sido posibles.
date: 2018-11-12
updated: 2021-11-04
tags:
  - blog
  - capabilities
---

<figure data-float="right"> {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/uIIvM9xocYkjmBfHSrJE.svg", alt="Un pez fugu (pez globo), el logo de Project Fugu", width="150", height="150" %}</figure>

El [proyecto de capacidades](https://developers.google.com/web/updates/capabilities) es un esfuerzo entre empresas con el objetivo de hacer posible que las aplicaciones web hagan todo lo que pueden hacer las aplicaciones de escritorio/iOS/Android, al exponer las capacidades de estas plataformas a la plataforma web, mientras se mantiene la seguridad, privacidad y confianza del usuario. y otros principios básicos de la web.

Este trabajo, entre muchos otros ejemplos, permitió a [Adobe llevar Photoshop a la web](/ps-on-the-web/), a [Excalidraw desaprobar su aplicación Electron](/deprecating-excalidraw-electron/) y a [Betty Crocker aumentar los indicadores de intención de compra en un 300%](/betty-crocker/).

Puede ver la lista completa de capacidades nuevas y potenciales y la etapa en la que se encuentra cada propuesta en el [Rastreador de API de Fugu](https://goo.gle/fugu-api-tracker). Vale la pena señalar que muchas ideas nunca pasan de la etapa de explicación o prueba de origen. El objetivo del proceso es enviar las funciones adecuadas. Eso significa que debemos aprender e iterar rápidamente. Está bien no enviar una función si no resuelve la necesidad del desarrollador.

## Capacidades disponibles en estable {: #in-stable }

Las siguientes API superaron la versión de prueba original y están disponibles en la última versión de Chrome y, en muchos casos, en otros navegadores basados en Chromium.

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#shipped"> Todas las API enviadas </a>

## Capacidades disponibles como prueba de origen {: #origin-trial }

Estas API están disponibles en Chrome como [pruebas de origen](https://developers.chrome.com/origintrials/#/trials/active). Las pruebas de origen brindan una oportunidad para que Chrome valide las funciones experimentales y las API, y le permite dar retroalimentación sobre su usabilidad y efectividad en una implementación más amplia.

Optar por una prueba de origen le permite crear demostraciones y prototipos que los usuarios de la prueba beta pueden probar durante la duración de la prueba, sin necesidad de que cambien ninguna marca en su navegador. Aunque normalmente es más estable que las funciones disponibles detrás de una bandera (ver más abajo), es posible que la superficie de una API cambie en función de sus comentarios. Hay más información sobre las pruebas de origen en la [Guía de pruebas de origen para desarrolladores web](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md).

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#origin-trial"> Todas las API actualmente en prueba de origen </a>

## Capacidades disponibles detrás de una bandera {: #flag }

Estas API solo están disponibles detrás de una bandera. Son experimentales y aún están en desarrollo. No están listos para su uso en producción. Es muy probable que haya errores, que estas API se rompan o que la superficie de la API cambie.

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#developer-trial"> Todas las API actualmente detrás de una bandera </a>

## Capacidades que están en inicio {: #started }

El trabajo en estas API acaba de comenzar. Todavía no hay mucho que ver, pero los desarrolladores interesados pueden querer destacar los errores relevantes de Chromium para mantenerse actualizados sobre el progreso que se está realizando.

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#started">Todas las API en las que se ha comenzado a trabajar</a>

## Capacidades que están bajo consideración {: #under-consider }

Estas son las API e ideas que siguen bajo consideración. Vale la pena destacar los errores más relevantes en Chromium para votar por una función y estar informado una vez que comience el trabajo.

<a style="text-decoration: none;" class="w-button w-button--primary" href="https://fugu-tracker.web.app/#under-consideration">Todas las API en consideración</a>

## Sugerir una nueva capacidad {: #suggest-new }

¿Tiene alguna sugerencia para una capacidad que cree que Chromium debería considerar? Cuéntenoslo presentando una [nueva solicitud de función](https://goo.gl/qWhHXU). Asegúrese de incluir tantos detalles como pueda, como el problema que está tratando de resolver, los casos de uso sugeridos y cualquier otra cosa que pueda ser útil.

{% Aside %} ¿Quieres probar algunas de estas nuevas capacidades? Consulte el [laboratorio de códigos de capacidades web](https://developers.google.com/codelabs/project-fugu#0). {% endAside %}
