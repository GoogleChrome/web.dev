---
layout: post
title: '`[user-scalable =" no "]` se usa en el elemento `<meta name =" viewport ">` o el atributo `[maximum-scale]` es menor que `5`'
description: Aprenda a hacer que su página web sea más accesible al asegurar que el acercamiento del navegador  no se desactive.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - meta-viewport
---

El parámetro `user-scalable="no"` para el elemento `<meta name="viewport">` desactiva el zoom del navegador en una página web. El parámetro `maximum-scale` limita la cantidad de zoom que el usuario puede hacer. Ambos son problemáticos para los usuarios con visión deficiente que dependen del zoom del navegador para ver el contenido de una página web.

## Cómo falla la auditoría Lighthouse del zoom del navegador

Lighthouse marca las páginas que deshabilitan el zoom del navegador:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/84cMMpBDm0rDl6hQISci.png", alt="Auditoría Lighthouse que muestra que la ventana gráfica deshabilita el escalado y el zoom del texto", width="800", height="227" %}</figure>

Una página no supera la auditoría si contiene una etiqueta `<meta name="viewport">` con cualquiera de los siguientes:

- Un atributo `content` con un parámetro `user-scalable="no"`
- Un atributo `content` con un parámetro `maximum-scale` establecido en un valor menor que `5`

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Cómo evitar que el zoom del navegador se desactive

Elimine el parámetro `user-scalable="no"` de la metaetiqueta de la ventana gráfica y verifique que el parámetro `maximum-scale` esté establecido en `5` o más.

## Recursos

- [El código fuente de la auditoría **`[user-scalable="no"]` se usa en el elemento `<meta name="viewport">` o el atributo `[maximum-scale]` es menor que 5**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/meta-viewport.js)
- [El zoom y el escalado no deben estar deshabilitados (Universidad de Deque)](https://dequeuniversity.com/rules/axe/3.3/meta-viewport)
