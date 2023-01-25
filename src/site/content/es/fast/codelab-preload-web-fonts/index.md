---
layout: codelab
title: Precargue fuentes web para mejorar la velocidad de carga
authors:
  - gmimani
description: |2-

  En este codelab, aprenda cómo mejorar el rendimiento de una página mediante la precarga de fuentes web.
date: 2018-04-23
glitch: web-dev-preload-webfont?path=index.html
related_post: preload-critical-assets
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

Este laboratorio de código le muestra cómo precargar fuentes web usando `rel="preload"` para eliminar cualquier destello de texto sin estilo (FOUT).

## Medición

Primero, mida el rendimiento del sitio web antes de agregar optimizaciones.
{% Instruction 'preview', 'ol' %}
{% Instruction 'audit-performance', 'ol' %}

El informe Lighthouse que se genera le mostrará la secuencia de búsqueda de recursos en **Latencia máxima de la ruta crítica**.

{% Img src ="image/admin/eperh8ZUnjhsDlnJdNIG.png", alt="Las fuentes web están presentes en la cadena de solicitudes críticas.", width="704", height="198" %}

En la auditoría anterior, las fuentes web forman parte de la cadena de solicitudes críticas y se recuperan en último lugar. La [**cadena de solicitudes críticas**](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/) representa el orden de los recursos priorizados y encontrados por el navegador. En esta aplicación, las fuentes web (Pacifico y Pacifico-Bold) se definen utilizando la regla [@font-face](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#defining_a_font_family_with_font-face) y son el último recurso obtenido por el navegador en la cadena de solicitudes críticas. Normalmente, las fuentes web se cargan de forma diferida, lo que significa que no se cargan hasta que se descargan los recursos críticos (CSS, JS).

Aquí está la secuencia de los recursos obtenidos en la aplicación:

{% Img src="image/admin/9oBNjZORrBj6X8RVlr9t.png", alt ="Las fuentes web se cargan de forma diferida.", width="583", height="256" %}

## Precarga de fuentes web

Para evitar el FOUT, puede precargar las fuentes web que se requieren de inmediato. Agregue el elemento `Link` para esta aplicación al inicio del documento:

```html
<head>
 <!-- ... -->
 <link rel="preload" href="/assets/Pacifico-Bold.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

Los `as="font" type="font/woff2"` dicen al navegador que descargue este recurso como una fuente y ayudan a priorizar la cola de recursos.

El atributo `crossorigin` indica si el recurso debe buscarse con una solicitud CORS, ya que la fuente puede provenir de un dominio diferente. Sin este atributo, el navegador ignora la fuente precargada.

Dado que se usa Pacifico-Bold en el encabezado de la página, agregamos una etiqueta de precarga para recuperarla mucho antes. Precargar la fuente Pacifico.woff2 no tiene importancia porque le da estilo al texto que está después del encabezado.

Vuelva a cargar la aplicación y vuelva a ejecutar lighthouse. Verifique la sección **Latencia máxima de la ruta crítica.**

{% Img src = "image/admin/lC85s7XSc8zEXgtwLsFu.png", alt = "La fuente web Pacifico-Bold está precargada y eliminada de la cadena de solicitudes cricical", width = "645", height = "166", class = "w- captura de pantalla" %}

Observe cómo `Pacifico-Bold.woff2` de la cadena de solicitudes críticas. Se obtiene anteriormente en la aplicación.

{% Img src="image/admin/BrXidcKZfCbbUbkcSwas.png", alt="La fuente web Pacifico-Bold está precargada", width="553", height="254" %}

Con la precarga, el navegador sabe que necesita descargar este archivo antes. Es importante tener en cuenta que si no se utiliza correctamente, la precarga puede perjudicar el rendimiento al realizar solicitudes innecesarias de recursos que no se utilizan.
