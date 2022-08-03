---
layout: post
title: Los elementos `[aria-hidden =" true"]` contienen descendientes enfocables
description: |2

  Aprenda a asegurarse de que los usuarios de tecnología de asistencia no puedan navegar a

  elementos enfocables que se supone que están ocultos.
date: 2019-10-17
web_lighthouse:
  - aria-hidden-focus
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

El uso del `aria-hidden="true"` en un elemento oculta el elemento y todos sus elementos secundarios de los lectores de pantalla y otras tecnologías de asistencia. Si el elemento oculto contiene un **elemento enfocable**, las tecnologías de asistencia no leerán el elemento enfocable, pero los usuarios de teclado aún podrán navegar hacia él, lo que puede causar confusión.

## Cómo identifica Lighthouse los elementos enfocables parcialmente ocultos

<a href="https://developer.chrome.com/docs/lighthouse/overview/" rel="noopener">Lighthouse</a> señala los elementos enfocables que tienen padres con el atributo `aria-hidden="true"`

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqhdHogcBrLR4W0uiECZ.png", alt="Auditoría de Lighthouse que muestra elementos enfocables que tienen padres con el atributo aria-hidden", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/focusable-els.njk' %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Cómo corregir los elementos enfocables parcialmente ocultos

Si está ocultando un elemento contenedor en su página usando `aria-hidden`, también debe evitar que los usuarios naveguen a cualquier elemento enfocable dentro de ese contenedor.

Una forma de hacerlo es usar JavaScript para aplicar un `tabindex="-1"` a todos los elementos enfocables en el contenedor. Sin embargo, como implica la lista anterior, una consulta que capture todos los elementos enfocables puede complicarse rápidamente.

Si está ocultando el elemento contenedor a usuarios videntes, considere usar una de las siguientes estrategias en su lugar:

- Agregue un atributo `hidden` al elemento contenedor.
- Aplique la propiedad CSS `display: none` o `visibility: hidden` al elemento contenedor.

Si no puede ocultar visualmente el elemento contenedor, por ejemplo, si está detrás de un diálogo modal con un fondo translúcido, considere usar <a href="https://github.com/WICG/inert" rel="noopener">el polyfill <code>inert</code> WICG</a>. El polyfill emula el comportamiento de un atributo `inert` propuesto, evitando que los elementos se lean o seleccionen.

{% Aside 'caution' %} El polyfill `inert` es experimental y es posible que no funcione como se espera en todos los casos. Haga pruebas cuidadosamente antes de usar en producción. {% endAside %}

## Recursos

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-hidden-focus.js" rel="noopener">El código fuente de los elementos <strong><code>[aria-hidden="true"]</code> contiene una auditoría de descendientes enfocables</strong> </a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-hidden-focus" rel="noopener">Los elementos aria-hidden no contienen elementos enfocables (Universidad Deque)</a>
- <a href="https://github.com/WICG/inert" rel="noopener">Polyfill <code>inert</code> de WICG</a>
