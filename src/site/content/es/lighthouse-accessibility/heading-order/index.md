---
layout: post
title: Los elementos de título no están en orden descendente secuencial
description: |2-

  Aprende a asegurarse de que los usuarios de la tecnología de asistencia puedan navegar fácilmente por tu página web estructurando correctamente tus elementos de encabezados.
date: 2019-10-17
updated: 2020-05-07
web_lighthouse:
  - heading-order
---

{% include 'content/lighthouse-accessibility/why-headings.njk' %}

## Cómo falla la auditoría de niveles de encabezados de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las páginas cuyos encabezados saltan uno o más niveles:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4dd4TvMxSF6tYJ0wGM64.png", alt="Auditoría de Lighthouse que muestra encabezados que omiten niveles", width="800", height="206" %}</figure>

Por ejemplo, usar un elemento `<h1>` para el título de tu página y luego usar elementos de `<h3>` para las secciones principales de la página hará que la auditoría falle porque se omite el nivel de `<h2>`:

```html
<h1>Page title</h1>
  <h3>Section heading 1</h3>
  …
  <h3>Section heading 2</h3>
  …
```

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Cómo corregir los títulos mal estructurados

- Haz que todos los elementos del encabezado sigan un orden lógico y numérico que refleje la estructura de tu contenido.
- Asegúrate de que el texto del encabezado transmita claramente el contenido de la sección asociada.

Por ejemplo:

```html
<h1>Título de la página</h1>
<section>
  <h2Encabezado de la sección</h2>
  …
    <h3>Subencabezado de la sección</h3>
</section>
```

Una forma de verificar la estructura de los encabezados es con la siguiente pregunta: "Si alguien creara un esquema de mi página usando solo los encabezados, ¿tendría sentido?"

También puedes utilizar herramientas como la <a href="https://accessibilityinsights.io/" rel="noopener">extensión Accessibility Insights</a> de Microsoft para visualizar la estructura de tu página y detectar elementos de encabezado desordenados.

{% Aside 'caution' %} Los desarrolladores a veces se saltan los niveles de encabezado para lograr el estilo visual deseado. Por ejemplo, pueden usar un `<h3>` porque sienten que el `<h2>` es demasiado grande. Esto se considera un **anti-patrón**. En lugar de hacer eso, utiliza una estructura de encabezado secuenciada correctamente y usa CSS para diseñar visualmente los encabezados como desees. {% endAside %}

Consulta la publicación de [Encabezados y puntos de referencia](/headings-and-landmarks) para obtener más información.

## Recursos

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/heading-order.js" rel="noopener">Código fuente para auditoría de <strong>los encabezados se saltan de nivel</strong></a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/heading-order" rel="noopener">Los niveles de encabezado solo deben aumentar en uno (Deque University)</a>
