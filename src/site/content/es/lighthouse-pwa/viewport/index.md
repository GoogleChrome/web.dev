---
layout: post
title: No tiene una etiqueta `<meta name ="viewport">` con `width` o` initial-scale`
description: |2-

  Obtén más información sobre la auditoria de Lighthouse para "No tiene una etiqueta <meta name="viewport"> con width o initial-scale".
date: 2019-05-02
updated: 2019-08-20
web_lighthouse:
  - viewport
---

Muchos motores de búsqueda clasifican las páginas en función de su compatibilidad con dispositivos móviles. Sin una [viewport meta tag (metaetiqueta de ventana gráfica)](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag), los dispositivos móviles procesan las páginas con los anchos típicos de la pantalla de una computadora de escritorio y luego reducen el tamaño de las páginas, lo que hace que su lectura sea más difícil.

La configuración de la metaetiqueta de la ventana gráfica te permite controlar el ancho y la escala de la ventana gráfica para que tenga el tamaño correcto en todos los dispositivos.

## Cómo falla la auditoría de metaetiqueta de la ventana gráfica de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca páginas sin una metaetiqueta de ventana gráfica:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/g9La56duNlpHZntDnzY9.png", alt="La auditoría de Lighthouse muestra que a la página le falta una ventana gráfica", width="800", height="76" %}</figure>

Una página no pasa la auditoría a menos que se cumplan todas las siguientes condiciones:

- En el `<head>` del documento contiene una etiqueta de `<meta name="viewport">`.
- La metaetiqueta de la ventana gráfica contiene un atributo de `content`.
- El valor del atributo de `content` incluye el texto de `width=`.

Lighthouse *no* comprueba que el `width` sea igual al `device-width`. Tampoco busca un par clave-valor de `initial-scale`. Sin embargo, aún debes de incluir ambos para que tu página se muestre correctamente en dispositivos móviles.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Cómo agregar una metaetiqueta de ventana gráfica

Agrega una etiqueta de `<meta>` de la ventana gráfica con los pares clave-valor apropiados al `<head>` de tu página:

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <meta name="viewport" content="width=device-width, initial-scale=1">
    …
  </head>
  …
```

Esto es lo que hace cada par clave-valor:

- `width=device-width` establece el ancho de la ventana gráfica al ancho del dispositivo.
- `initial-scale=1` establece el nivel de zoom inicial cuando el usuario visita la página.

## Recursos

- [Código fuente para la auditoria de **Tiene una etiqueta `<meta name="viewport">` con `width` o `initial-scale`**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/viewport.js)
- [Conceptos básicos del diseño web responsivo](https://developers.google.com/web/fundamentals/design-and-ux/responsive/#set-the-viewport)
- [Uso de la metaetiqueta de la ventana gráfica para controlar el diseño en navegadores móviles](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag)
