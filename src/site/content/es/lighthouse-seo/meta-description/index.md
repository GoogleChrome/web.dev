---
layout: post
title: El documento no tiene una metadescripción
description: |2-

  Obtenga más información sobre la auditoría Lighthouse "El documento no tiene una metadescripción".
date: 2019-05-02
updated: 2021-04-08
web_lighthouse:
  - Metadescripción
---

El elemento `<meta name="description">` proporciona un resumen del contenido de una página que los motores de búsqueda incluyen en los resultados de búsqueda. Una metadescripción única y de alta calidad hace que su página parezca más relevante y puede aumentar su tráfico de búsqueda.

## Cómo falla la auditoría de la metadescripción de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca las páginas sin una metadescripción:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dtMQ12xujHMJGuEwZ413.png", alt="Auditoría Lighthouse que muestra que el documento no tiene una metadescripción", width="800", height="74" %}</figure>

La auditoría falla si:

- Su página no tiene un elemento `<meta name=description>`.
- El atributo `content` del elemento `<meta name=description>` está vacío.

Lighthouse no evalúa la calidad de su descripción.

{% include 'content/lighthouse-seo/scoring.njk' %}

## Cómo agregar una metadescripción

Agregue un elemento `<meta name=description>` al `<head>` de cada una de sus páginas:

```html
<meta name="description" content="Ponga su descripción aquí.">
```

Si es apropiado, incluya datos claramente etiquetados en las descripciones. Por ejemplo:

```html
<meta name="description" content="Autor: A.N. Autor,
    Ilustrador: P. Imagen, Categoría: Libros, Precio: $17,99,
    Longitud: 784 páginas">
```

## Mejores prácticas de metadescripción

- Utilice una descripción única para cada página.
- Haga descripciones claras y concisas. Evite descripciones vagas como "Hogar".
- Evite el [exceso de palabras clave](https://support.google.com/webmasters/answer/66358). No ayuda a los usuarios y los motores de búsqueda pueden marcar la página como spam.
- Las descripciones no tienen que ser oraciones completas; pueden contener datos estructurados.

A continuación, se muestran ejemplos de descripciones buenas y malas:

{% Compare 'worse' %}

```html
<meta name="description" content="Una receta de donas.">
```

{% CompareCaption %} Demasiado vago. {% endCompareCaption %} {% endCompare %}

{% Compare 'better' %}

```html
<meta
  name="description"
  content="La sencilla receta de Mary para las donas de tocino
           y arce es una golosina dulce y pegajosa con solo un
           toque de sal que siempre volverás a buscar.">
```

{% CompareCaption %} Descriptivo pero conciso. {% endCompareCaption %} {% endCompare %}

Consulte la página de Google [Crear títulos y fragmentos óptimos en los resultados de búsqueda](https://support.google.com/webmasters/answer/35624#1) para obtener más sugerencias.

## Recursos

- [El código fuente de la auditoría **El documento no tiene una metadescripción**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/meta-description.js)
- [Crear títulos y fragmentos óptimos en los resultados de búsqueda](https://support.google.com/webmasters/answer/35624#1)
- [Palabras clave irrelevantes](https://support.google.com/webmasters/answer/66358)
