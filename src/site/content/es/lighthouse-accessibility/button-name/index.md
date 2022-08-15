---
layout: post
title: Los botones no tienen un nombre accesible
description: |2-

  Aprende a mejorar la accesibilidad de tu página web asegurándote de que todos los botones tienen nombres a los que pueden acceder los usuarios de tecnología de asistencia.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - button-name
---

Cuando un botón no tiene un nombre accesible, los lectores de pantalla y otras tecnologías de asistencia lo anuncian como *botón*, el cual no proporciona información a los usuarios sobre lo que hace ese botón.

## Cómo falla la auditoría Lighthouse de nombre del botón

Lighthouse marca a los botones que no tienen contenido de texto o una propiedad de `aria-label`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/evoQAq4c1CBchwNMl9Uq.png", alt="Auditoría de Lighthouse que muestra que los botones no tienen un nombre accesible", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Cómo agregar nombres accesibles a los botones

Para botones con etiquetas visibles, agrega contenido de texto al elemento del `button`. Haz que la etiqueta sea un nombre perteneciente a la acción. Por ejemplo:

```html
<button>Book room</button>
```

Para botones sin etiquetas visibles, como los botones de íconos, usa el `aria-label` para describir claramente la acción a cualquier persona que use una tecnología de asistencia, por ejemplo:

{% Glitch { id: 'lh-button-name', path: 'index.html', previewSize: 0, height: 480 } %}

{% Aside %} Esta aplicación de muestra se basa en la [fuente de Material Icon](https://google.github.io/material-design-icons/) de Google, que usa [ligaduras](https://alistapart.com/article/the-era-of-symbol-fonts/) para convertir el texto interno de los botones en glifos de íconos. Las tecnologías de asistencia se referirán a la `aria-label` en lugar de a los glifos de los iconos al anunciar los botones. {% endAside %}

También consulta [Botones y enlaces de etiquetas](/labels-and-text-alternatives#label-buttons-and-links).

## Recursos

- [El código fuente de la auditoría de **los botones no tienen un nombre accesible**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/button-name.js)
- [Los botones deben tener texto discernible (Deque University)](https://dequeuniversity.com/rules/axe/3.3/button-name)
