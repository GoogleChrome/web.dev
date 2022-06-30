---
layout: post
title: El documento no tiene un `rel=canonical` válido
description: Conozca la auditoría de Lighthouse "El documento no tiene un rel=canonical válido".
date: 2019-05-02
updated: 2019-08-20
web_lighthouse:
  - canónico
---

Cuando varias páginas tienen contenido similar, los motores de búsqueda las consideran versiones duplicadas de la misma página. Por ejemplo, las versiones de escritorio y móviles de una página de producto a menudo se consideran duplicadas.

Los motores de búsqueda seleccionan una de las páginas como la *versión canónica* o principal y la **rastrean** más. Los enlaces canónicos válidos le permiten indicar a los motores de búsqueda qué versión de una página deben rastrear y mostrar a los usuarios en los resultados de búsqueda.

{% Aside 'key-term' %} *Rastreo* es la forma en que un motor de búsqueda actualiza su índice de contenido en la web. {% endAside %}

El uso de enlaces canónicos tiene muchas ventajas:

- Ayuda a los motores de búsqueda a consolidar varias URL en una única URL preferida. Por ejemplo, si otros sitios colocan parámetros de consulta al final de los enlaces a la página de usted, los motores de búsqueda consolidan esas URL en su versión preferida.
- Simplifica los métodos de seguimiento. Dar seguimiento a una URL es más fácil que a muchas.
- Mejora la clasificación de la página del contenido sindicado al consolidar los enlaces sindicados a su contenido original de regreso a su URL preferida.

## Cómo falla la auditoría de enlaces canónicos de Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca cualquier página con un enlace canónico no válido:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TLhOThFgDllifsEEeOH3.png", alt = "Auditoría de Lighthouse mostrando documento con enlace canónico no válido", width="800", height="76" %}</figure>

Una página falla en esta auditoría si se cumple alguna de las siguientes condiciones:

- Hay más de un enlace canónico.
- El enlace canónico no es una URL válida.
- El enlace canónico apunta a una página de una región o idioma diferente.
- El enlace canónico apunta a un dominio diferente.
- El enlace canónico apunta a la raíz del sitio. Tenga en cuenta que este escenario puede ser válido en algunos escenarios, como AMP o variaciones de la página móvil, pero Lighthouse, no obstante, lo trata como un error.

{% include 'content/lighthouse-seo/scoring.njk' %}

## Cómo agregar enlaces canónicos a sus páginas

Hay dos opciones para especificar un enlace canónico.

**Opción 1:** agregue un elemento `<link rel=canonical>` al `<head>` de la página:

```html/4
<!doctype html>
<html lang="en">
  <head>
    …
    <link rel="canonical" href="https://example.com"/>
    …
  </head>
  <body>
    …
  </body>
</html>
```

**Opción 2:** agregue un encabezado `Link` a la respuesta HTTP:

```html
Link: https://example.com; rel=canonical
```

Para obtener una lista de los pros y los contras de cada enfoque, consulte la página [Consolidar URL duplicadas](https://support.google.com/webmasters/answer/139066) de Google.

### Reglas generales

- Asegúrese de que la URL canónica sea válida.
- Utilice URL canónicas [HTTPS](/why-https-matters/) seguras en lugar de HTTP siempre que sea posible.
- Si usa [enlaces `hreflang`](/hreflang) para ofrecer diferentes versiones de una página según el idioma o el país del usuario, asegúrese de que la URL canónica apunte a la página adecuada para ese idioma o país respectivo.
- No apunte la URL canónica a un dominio diferente. Yahoo y Bing no lo permiten.
- No apunte las páginas de nivel inferior a la página raíz del sitio a menos que su contenido sea el mismo.

### Pautas específicas de Google

- Utilice la [Consola de búsqueda de Google](https://search.google.com/search-console/index) para ver qué URL considera Google canónicas o duplicadas en todo su sitio.
- No utilice la herramienta de eliminación de URL de Google para la canonización. Eso elimina *todas* las versiones de una URL de la búsqueda.

{% Aside 'note' %} Se agradecen las recomendaciones para otros motores de búsqueda. [Edite esta página](https://github.com/GoogleChrome/web.dev/blob/master/src/site/content/en/lighthouse-seo/canonical/index.md). {% endAside %}

## Recursos

- [Código fuente de **El documento no tiene una auditoría `rel=canonical`** válida](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/canonical.js)
- [5 errores comunes con rel=canonical](https://webmasters.googleblog.com/2013/04/5-common-mistakes-with-relcanonical.html)
- [Consolide URL duplicadas](https://support.google.com/webmasters/answer/139066)
- [Bloquear el rastreo de contenido duplicado parametrizado](https://support.google.com/webmasters/answer/6080548)
- [Consola de búsqueda de Google](https://search.google.com/search-console/index)
