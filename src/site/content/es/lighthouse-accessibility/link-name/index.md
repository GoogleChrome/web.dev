---
layout: post
title: Los enlaces no tienen un nombre discernible
description: Aprenda a hacer más accesibles los enlaces de su página web al asegurar que tengan nombres que puedan ser interpretados por tecnologías de asistencia.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - "    link-name"
---

El texto del enlace que es discernible, único y enfocable mejora la experiencia de navegación para los usuarios de lectores de pantalla y otras tecnologías de asistencia.

## Cómo fallar esta auditoría de Lighthouse

Lighthouse marca los enlaces que no tienen nombres discernibles:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6enCwSloHJSyylrNIUF4.png", alt="Auditoría de Lighthouse que muestra que los enlaces no tienen nombres discernibles", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Cómo agregar nombres accesibles a los enlaces

Al igual que los botones, los enlaces obtienen principalmente su nombre accesible de su contenido de texto. Evite palabras de relleno como "Aquí" o "Leer más"; en su lugar, coloque el texto más significativo en el propio enlace:

```html
Check out <a href="…">our guide to creating accessible web pages</a>.
</html>
```

Obtenga más información en [Botones y vínculos de etiquetas](/labels-and-text-alternatives#label-buttons-and-links).

## Recursos

- [Código fuente para la auditoría **Los enlaces no tienen un nombre discernible**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/link-name.js)
- [Los enlaces deben tener texto discernible (Deque University)](https://dequeuniversity.com/rules/axe/3.3/link-name)
