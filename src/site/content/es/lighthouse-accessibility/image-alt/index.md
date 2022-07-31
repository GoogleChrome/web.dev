---
layout: post
title: Los elementos de la imagen no tienen atributos "[alt]".
description: Aprenda a asegurarse de que los usuarios de tecnología auxiliar puedan acceder a las imágenes de su página web al introducir un texto alternativo.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - image-alt
---

Los elementos informativos deben tener un texto alternativo corto y descriptivo. Los elementos decorativos se pueden ignorar con un atributo vacío alt.

## Cómo falla la auditoría del texto alternativo para imágenes de Lighthouse

Lighthouse marca los elementos `<img>` que no tienen atributos `alt`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hb8ypHK5xwmtUZwdxyQG.png", alt="La auditoría de Lighthouse muestra que los elementos <img> no tienen atributos alt", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Cómo agregar texto alternativo a las imágenes

Proporcione un atributo `alt` para cada elemento `<img>`. Si la imagen no se carga, el `alt` text o texto alternativo se utiliza como marcador de posición para que los usuarios tengan una idea de lo que la imagen trataba de transmitir. (Consulte también [Cómo incluir alternativas de texto para imágenes y objetos](/labels-and-text-alternatives#include-text-alternatives-for-images-and-objects)).

La mayoría de las imágenes deben tener un texto breve y descriptivo:

```html
<img alt="Audits set-up in Chrome DevTools" src="...">
```

Si la imagen actúa como decoración y no proporciona ningún contenido útil, asigne un atributo `alt=""` para eliminarla del árbol de accesibilidad.

```html
<img src="background.png" alt="">
```

{% Aside 'note' %} También puede usar etiquetas ARIA para describir sus imágenes, por ejemplo, `<img aria-label="Audits set-up in Chrome DevTools" src="...">` Consulte también [Uso del atributo aria-label](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) y [Uso el atributo aria-labelledby](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) . {% endAside %}

## Consejos para escribir un `alt` text eficaz

- El `alt` text debe dar la intención, el propósito y el significado de la imagen.
- Los usuarios con problemas visuales deben obtener tanta información del texto alternativo como un usuario normal la obtendría de la imagen.
- Evite palabras imprecisas como "tabla", "imagen" o "diagrama".

Obtenga más información en [la guía de WebAIM sobre texto alternativo](https://webaim.org/techniques/alttext/) .

## Recursos

- [El código fuente para los **elementos de la imagen no tiene atributos `[alt]`** de auditoría](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/image-alt.js)
- [Las imágenes deben tener texto alternativo (Deque University)](https://dequeuniversity.com/rules/axe/3.3/image-alt)
