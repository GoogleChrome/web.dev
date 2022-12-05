---
layout: post
title: Los enlaces no tienen texto descriptivo
description: |2-

  Obtén más información sobre la auditoría Lighthouse de "Los enlaces no tienen texto descriptivo".
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - link-text
---

El texto del vínculo es la palabra o frase en la que se puede hacer clic en un hipervínculo. Cuando el texto del enlace transmite claramente el objetivo de un hipervínculo, tanto los usuarios como los motores de búsqueda pueden comprender de una manera más sencilla tu contenido y cómo se relaciona con otras páginas.

## Cómo falla la auditoría de texto del enlace de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca los enlaces sin textos descriptivos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hiv184j4TFNCsmqTCTNY.png", alt="Auditoría de Lighthouse que muestra los enlaces que no tienen texto descriptivo", width="800", height="191" %}</figure>

Lighthouse marca los siguientes textos de enlace genéricos:

- `click here`
- `click this`
- `go`
- `here`
- `this`
- `start`
- `right here`
- `more`
- `learn more`

{% include 'content/lighthouse-seo/scoring.njk' %}

## Cómo agregar texto de enlace descriptivo

Reemplaza frases genéricas como "haz clic aquí" y "obtenga más información" con descripciones específicas. En general, escribe un texto de enlace que indique claramente qué tipo de contenido obtendrán los usuarios si siguen el hipervínculo.

```html
<p>Para ver todos nuestros videos sobre basquetbol, <a href="videos.html">haz clic aquí</a>.</p>
```

{% Compare 'worse', 'Don\'t' %} "Haz clic aquí" no le indica a los usuarios a dónde los llevará el hipervínculo. {% endCompare %}

```html
<p>Mira todos nuestros <a href="videos.html">videos de basquetbol</a>.</p>
```

{% Compare 'better', 'Do' %} "Videos de basquetbol" transmite claramente que el hipervínculo llevará a los usuarios a una página de videos. {% endCompare %}

{% Aside %} A menudo, deberás de revisar la oración que lo rodea para que el texto del vínculo sea descriptivo. {% endAside %}

## Prácticas recomendadas para el texto de enlaces

- Permanecer en el tema. No utilices texto de enlace que no tenga relación con el contenido de la página.
- No utilices la URL de la página como descripción del enlace a menos que tengas una buena razón para hacerlo, por ejemplo: hacer referencia a la nueva dirección de un sitio.
- Mantén las descripciones concisas. Apunta a unas pocas palabras o una frase corta.
- También presta atención a tus enlaces internos. Mejorar la calidad de los enlaces internos puede ayudar tanto a los usuarios como a los motores de búsqueda a navegar por tu sitio más fácilmente.

Consulta la sección de Google de [Utiliza enlaces de forma adecuada](https://support.google.com/webmasters/answer/7451184#uselinkswisely) de la [Guía de optimización en buscadores (SEO) para principiantes](https://support.google.com/webmasters/answer/7451184) para obtener más consejos.

## Recursos

- [El código fuente para la auditoría **Los enlaces no tienen texto descriptivo**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/seo/link-text.js)
- [Guía de optimización en buscadores (SEO) para principiantes](https://support.google.com/webmasters/answer/7451184)
