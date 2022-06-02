---
layout: post
title: El contenido no tiene el tamaño correcto para la ventana gráfica
description: Aprende a ajustar el tamaño del contenido de tu página web para que se ajuste a las pantallas de los dispositivos móviles.
web_lighthouse:
  - content-width
date: 2019-05-04
updated: 2019-09-19
---

La ventana gráfica es la parte de la ventana del navegador en la que se ve el contenido de tu página. Cuando el ancho del contenido de tu página es más pequeño o más grande que el ancho de la ventana gráfica, es posible que no se muestre correctamente en las pantallas de los dispositivos móviles. Por ejemplo, si el ancho del contenido es demasiado grande, el contenido puede reducirse para ajustarse, lo que dificulta la lectura del texto.

## Cómo falla la auditoría de ancho de contenido de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las páginas cuyo ancho no es igual al ancho de la ventana gráfica:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/y8JKlbJTu7ERetHUGuaA.png", alt="Auditoría Lighthouse que muestra contenido que no tiene el tamaño correcto para la ventana gráfica", width="800", height="98" %}</figure>

La auditoría falla si `window.innerWidth` no es igual a `window.outerWidth`.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Cómo hacer que tu página se ajuste a las pantallas de los dispositivos móviles

Esta auditoría es una forma indirecta de determinar si tu página está optimizada para dispositivos móviles. Consulta los [conceptos básicos del diseño web responsivo](/responsive-web-design-basics/) de Google para obtener una descripción general de cómo crear una página compatible con dispositivos móviles.

Puedes ignorar esta auditoría si:

- Tu sitio no necesita estar optimizado para pantallas móviles.
- El ancho del contenido de tu página es intencionalmente más pequeño o más grande que el ancho de la ventana gráfica.

## Recursos

- [El código fuente para la auditoría de **El contenido no tiene el tamaño correcto para la ventana gráfica**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/content-width.js)
- [Conceptos básicos del diseño web responsivo](/responsive-web-design-basics/)
