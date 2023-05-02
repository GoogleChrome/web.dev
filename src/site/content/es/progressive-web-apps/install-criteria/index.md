---
layout: post
title: "¿Qué se requiere para su instalación?"
authors:
  - petelepage
date: 2020-02-14
updated: 2021-05-19
description: Criterios de instalación de las Aplicaciones Web Progresivas.
tags:
  - progressive-web-apps
---

Las Aplicaciones Web Progresivas (PWA) son aplicaciones modernas y de alta calidad construidas con tecnología de Internet. Las PWA ofrecen funciones similares a las de las aplicaciones para iOS/Android/escritorio, son confiables incluso en condiciones inestables de la red y pueden instalarse, lo que facilita que los usuarios las encuentren y las utilicen.

La mayoría de los usuarios están familiarizados con la instalación de aplicaciones y con las ventajas de contar con una experiencia instalada. Las aplicaciones instaladas se encuentran en las superficies de arranque del sistema operativo, como la carpeta de Aplicaciones en Mac OS X, el menú de Inicio en Windows y la pantalla de inicio en Android e iOS. Las aplicaciones instaladas también aparecen en el selector de actividades, en los motores de búsqueda de los dispositivos, como Spotlight, y en las hojas para compartir contenidos.

La mayoría de los navegadores indican al usuario que su Aplicación Web Progresiva (PWA) se puede instalar cuando cumple determinados criterios. Algunos ejemplos de estos indicadores son un botón de instalación en la barra de direcciones o un elemento del menú de instalación en el menú desplegable.

<div class="switcher">
  <figure id="browser-install-promo">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/O9KXz4aQXm3ZOzPo98uT.png", alt="Captura de pantalla de omnibox con el indicador de instalación visible", width="800", height="307" %} <figcaption> Promoción de la instalación proporcionada por el navegador (de escritorio) </figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bolh05TCEeT7xni4eUTG.png", alt="Captura de pantalla para la promoción de instalación proporcionada por el navegador.", width="800", height="307" %} <figcaption> Promoción de instalación proporcionada por el navegador (para dispositivos móviles) </figcaption></figure>
</div>

Además, cuando se cumplen los criterios, muchos navegadores lanzarán un evento `beforeinstallprompt`, lo que le permitirá proporcionar una UX personalizada en la aplicación que activará el flujo de instalación dentro de su aplicación.

## Criterios de instalación {: #criteria}

En Chrome, su Aplicación Web Progresiva debe cumplir los siguientes criterios antes de que se active el evento `beforeinstallprompt` y se muestre la promoción de instalación en el navegador:

- La aplicación web aún no está instalada
- Cumple con una heurística de participación del usuario
- Se publica por medio de HTTPS
- Contiene un [manifiesto de la aplicación web](/add-manifest/) que incluye:
    - `short_name` o `name`
    - `icons` : debe incluir un icono de 192 px y uno de 512 px
    - `start_url`
    - `display`: debe ser de `fullscreen`, `standalone` o `minimal-ui`
    - `prefer_related_applications` no debe estar presente o ser `false`
- Registre a un service worker con un controlador de `fetch`

Otros navegadores tienen criterios similares de instalación, aunque puede haber pequeñas diferencias. Consulte los sitios correspondientes para conocer todos los detalles:

- [Edge](https://docs.microsoft.com/microsoft-edge/progressive-web-apps#requirements)
- [Firefox](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Installable_PWAs)
- [Opera](https://dev.opera.com/articles/installable-web-apps/)

{% Aside %} En Android, si el manifiesto de la aplicación web incluye `related_applications` y `"prefer_related_applications": true`, el usuario se dirigirá a la tienda de Google Play y [se le pedirá que instale la aplicación de Android especificada](https://developer.chrome.com/blog/app-install-banners-native/). {% endAside %}
