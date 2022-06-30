---
layout: post
title: EL archivo `robots.txt` no es válido
description: |2

  Obtenga más información sobre la auditoría de Lighthouse "robots.txt no es válido".
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - robots-txt
---

El archivo `robots.txt` le dice a los motores de búsqueda cuáles de las páginas de su sitio se pueden rastrear. Una configuración invalida del archivo `robots.txt` puede provocar dos tipos de problemas:

- Puede evitar que los motores de búsqueda rastreen las páginas públicas, lo que hace que su contenido aparezca con menos frecuencia en los resultados de búsqueda.
- Puede hacer que los motores de búsqueda rastreen páginas que quizá no desee que aparezcan en los resultados de búsqueda.

## Cómo falla la auditoría Lighthouse  de `robots.txt`

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) marca los archivos `robots.txt` inválidos:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/X29ztochZPiUVwPo2rg3.png", alt="Auditoría Lighthouse que muestra un archivo robots.txt inválido", width="800", height="203" %}</figure>

{% Aside %} La mayoría de las auditorías de Lighthouse solo se aplican a la página en la que se encuentra actualmente. Sin embargo, dado que `robots.txt` se define en el nivel del nombre de host, esta auditoría se aplica a todo su dominio (o subdominio). {% endAside %}

Expanda la auditoría **El archivo `robots.txt` es inválido** en su informe para saber qué está mal con su archivo `robots.txt`.

Los errores comunes incluyen:

- `No se especificó un agente de usuario`
- `El patrón debe estar vacío, comenzar con "/" o con "*"`
- `Directiva desconocida`
- `URL inválida del mapa del sitio`
- `Solo debería usarse $ al final del patrón`

Lighthouse no comprueba que su archivo `robots.txt` esté en la ubicación correcta. Para que funcione correctamente, el archivo debe estar en la raíz de su dominio o subdominio.

{% include 'content/lighthouse-seo/scoring.njk' %}

## Cómo solucionar problemas con `robots.txt`

### Compruebe que `robots.txt` no devuelva un código de estado HTTP 5XX

Si su servidor devuelve un error de servidor (un [código de estado HTTP](/http-status-code) en los 500) para `robots.txt`, los motores de búsqueda no sabrán qué páginas deben rastrearse. Es posible que dejen de rastrear todo su sitio, lo que evitaría que se indexe nuevo contenido.

Para verificar el código de estado HTTP, abra `robots.txt` en Chrome y [verifique la solicitud en Chrome DevTools](https://developer.chrome.com/docs/devtools/network/reference/#analyze).

### Mantenga el tamaño del archivo `robots.txt` por debajo de 500 KiB

Los motores de búsqueda pueden dejar de procesar el aarchivo `robots.txt` a mitad de camino si tiene un tamaño superior a 500 KiB. Esto puede confundir al motor de búsqueda y provocar un rastreo incorrecto de su sitio.

Para mantener pequeño un archivo `robots.txt`, céntrese menos en las páginas excluidas individualmente y más en patrones más amplios. Por ejemplo, si necesita bloquear el rastreo de archivos PDF, no desactive cada archivo individual. En su lugar, rechace todas las URL que contengan `.pdf` mediante el uso de `disallow: /*.pdf`.

### Corrija cualquier error de formato

- En el archivo `robots.txt` solo se permiten líneas vacías, comentarios y directivas que coincidan con el formato "nombre: valor".
- Compruebe que los valores `allow` y `disallow` estén vacíos o comiencen con un carácter `/` o `*`.
- No use el carácter `$` en medio de un valor (por ejemplo, `allow: /file$html`).

#### Compruebe que haya un valor para `user-agent`

Nombres de agentes de usuario para indicar a los rastreadores de los motores de búsqueda qué directivas deben seguir. Debe proporcionar un valor para cada instancia de `user-agent` para que los motores de búsqueda sepan si deben seguir el conjunto de directivas asociado.

Para especificar un rastreador de motor de búsqueda en particular, utilice un nombre de agente de usuario de su lista publicada. (Por ejemplo, está es [la lista de agentes de usuario de Google que se utilizan para rastrear](https://support.google.com/webmasters/answer/1061943)).

Utilice el carácter `*` para hacer coincidir todos los rastreadores que de otro modo no coincidan.

{% Compare 'worse', 'Don\'t' %}

```text
user-agent:
disallow: /downloads/
```

No se define ningún agente de usuario. {% endCompare %}

{% Compare 'better', 'Do' %}

```text
user-agent: *
disallow: /downloads/

user-agent: magicsearchbot
disallow: /uploads/
```

Se definen un agente de usuario general y un agente de usuario `magicsearchbot`. {% endCompare %}

#### Compruebe que no haya directivas `allow` o `disallow` antes de un `user-agent`

Los nombres de agente de usuario definen las secciones de su archivo `robots.txt`. Los rastreadores de motores de búsqueda utilizan esas secciones para determinar qué directivas seguir. Colocar una directiva *antes* del primer nombre de agente de usuario significa que ningún rastreador la seguirá.

{% Compare 'worse', 'Don\'t' %}

```text
# Inicio del archivo
disallow: /downloads/

user-agent: magicsearchbot
allow: /
```

Ningún rastreador de motores de búsqueda leerá la directiva `disallow: /downloads`. {% endCompare %}

{% Compare 'better', 'Do' %}

```text
# Inicio del archivo
user-agent: *
disallow: /downloads/
```

Todos los motores de búsqueda no pueden rastrear la carpeta `/downloads`. {% endCompare %}

Los rastreadores de motores de búsqueda solo siguen las directivas de la sección con el nombre de agente de usuario más específico. Por ejemplo, si tiene directivas para `user-agent: *` y `user-agent: Googlebot-Image`, Googlebot Images solo seguirá las directivas en la sección `user-agent: Googlebot-Image`.

#### Proporcione una URL absoluta para el `sitemap`

Los archivos de [mapa del sitio](https://support.google.com/webmasters/answer/156184) son una excelente manera para que los motores de búsqueda conozcan las páginas de su sitio web. Un archivo de mapa del sitio generalmente incluye una lista de las URL de su sitio web, junto con información sobre cuándo se modificaron por última vez.

Si opta por enviar un archivo de mapa del sitio en `robots.txt`, asegúrese de utilizar una [URL absoluta](https://tools.ietf.org/html/rfc3986#page-27) .

{% Compare 'worse', 'Don\'t' %}

```text
sitemap: /sitemap-file.xml
```

{% endCompare %}

{% Compare 'better', 'Do' %}

```text
sitemap: https://example.com/sitemap-file.xml
```

{% endCompare %}

## Recursos

- [El código fuente de la auditoría **El archivo `robots.txt` es inválido**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/robots-txt.js)
- [Cree un `robots.txt file`](https://support.google.com/webmasters/answer/6062596)
- [Robots.txt](https://moz.com/learn/seo/robotstxt)
- [Especificaciones de la metaetiqueta de robots y del encabezado HTTP X-Robots-Tag](https://developers.google.com/search/reference/robots_meta_tag)
- [Más información sobre los mapas del sitio](https://support.google.com/webmasters/answer/156184)
- [Rastreadores de Google (agentes de usuario)](https://support.google.com/webmasters/answer/1061943)
