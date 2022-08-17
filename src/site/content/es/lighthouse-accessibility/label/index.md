---
layout: post
title: Los elementos de formulario no tienen etiquetas asociadas
description: Aprenda a hacer que los elementos de formulario sean accesibles para los usuarios de tecnologías de asistencia al proporcionar etiquetas.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - label
---

Las etiquetas garantizan que los controles de formulario se anuncien correctamente mediante tecnologías de asistencia como lectores de pantalla. Los usuarios de tecnologías de asistencia confían en estas etiquetas para navegar por los formularios. Los usuarios de mouse y pantallas táctiles también se benefician de las etiquetas, ya que el texto de la etiqueta genera un objetivo de clic más grande.

## Cómo fallar esta auditoría de Lighthouse

Lighthouse señala los elementos de formulario que no tienen etiquetas asociadas:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMWt5UyiUUskhKHUcYoN.png", alt="Auditoría de Lighthouse que muestra que los elementos del formulario no tienen etiquetas asociadas", width="800", height="185" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Cómo agregar etiquetas a elementos de formulario

Hay dos formas de asociar una etiqueta con un elemento de formulario. Coloque el elemento de entrada dentro de un elemento de etiqueta:

```html
<label>
  Receive promotional offers?
  <input type="checkbox">
</label>
```

O use la etiqueta de atributo `for` y consulte el ID del elemento:

```html
<input id="promo" type="checkbox">
<label for="promo">Receive promotional offers?</label>
```

Cuando la casilla de verificación se ha etiquetado correctamente, las tecnologías de asistencia informan que el elemento tiene la función de casilla de verificación, está en un estado marcado y se llama "¿Recibir ofertas promocionales?" Consulte también [Elementos de formulario de etiqueta](/labels-and-text-alternatives#label-form-elements) .

## Recursos

- [Código fuente para la auditoría **Los elementos de formulario no tienen etiquetas asociadas.**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/label.js)
- [Los elementos `<input>` de formulario deben tener etiquetas (Deque University)](https://dequeuniversity.com/rules/axe/3.3/label)
