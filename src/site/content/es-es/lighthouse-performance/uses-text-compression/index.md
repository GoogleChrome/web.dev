---
layout: post
title: Habilitar la compresión de texto
description: Obtenga información sobre cómo habilitar la compresión de texto puede mejorar el rendimiento de carga de su página web.
date: '2019-05-02'
updated: '2020-06-04'
web_lighthouse:
  - usa-compresión-de-texto
---

Los recursos basados en texto deben servirse con compresión para minimizar el total de bytes de la red. La sección Oportunidades de su informe Lighthouse enumera todos los recursos basados en texto que no están comprimidos:

<figure class="w-figure"><img class="w-screenshot" src="uses-text-compression.png" alt="Una captura de pantalla de la auditoría de compresión de texto Lighthouse Enable"></figure>

## Cómo maneja Lighthouse la compresión de texto

Lighthouse recopila todas las respuestas que:

- Tener tipos de recursos basados en texto.
- No incluya un encabezado de `content-encoding` `br` , `gzip` o `deflate` .

Luego, Lighthouse comprime cada uno de estos con [GZIP](https://www.gnu.org/software/gzip/) para calcular los ahorros potenciales.

Si el tamaño original de una respuesta es inferior a 1,4 KB, o si el posible ahorro de compresión es inferior al 10% del tamaño original, Lighthouse no marca esa respuesta en los resultados.

{% Aside 'note' %} Los ahorros potenciales que enumera Lighthouse son los ahorros potenciales cuando la respuesta se codifica con GZIP. Si se utiliza Brotli, es posible ahorrar aún más. {% endAside %}

## Cómo habilitar la compresión de texto en su servidor

Habilite la compresión de texto en los servidores que entregaron estas respuestas para aprobar esta auditoría.

Cuando un navegador solicita un recurso, utilizará el [`Accept-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) para indicar qué algoritmos de compresión admite.

```text
Accept-Encoding: gzip, compress, br
```

Si el navegador es compatible con [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html) ( `br` ), debe usar Brotli porque puede reducir el tamaño del archivo de los recursos más que los otros algoritmos de compresión. Busque `how to enable Brotli compression in <X>` , donde `<X>` es el nombre de su servidor. A partir de junio de 2020, Brotli es compatible con todos los navegadores principales, excepto Internet Explorer, Safari de escritorio y Safari en iOS. Consulte [Compatibilidad del navegador](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding#Browser_compatibility) para obtener actualizaciones.

Utilice GZIP como alternativa a Brotli. GZIP es compatible con todos los navegadores principales, pero es menos eficiente que Brotli. Consulte [Configuraciones del servidor](https://github.com/h5bp/server-configs) para ver ejemplos.

Su servidor debe devolver el [`Content-Encoding`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding) para indicar qué algoritmo de compresión utilizó.

```text
Content-Encoding: br
```

## Compruebe si una respuesta se comprimió en Chrome DevTools

Para comprobar si un servidor comprimió una respuesta:

{% Instruction 'devtools-network', 'ol' %}

1. Haga clic en la solicitud que generó la respuesta que le interesa.
2. Haga clic en la pestaña **Encabezados.**
3. Verifique el encabezado de `content-encoding` en la sección **Encabezados de respuesta.**

<figure class="w-figure"><img class="w-screenshot w-screenshot--filled" src="content-encoding.svg" alt="El encabezado de respuesta de codificación de contenido"><figcaption class="w-figcaption"> El encabezado de respuesta de <code>content-encoding</code></figcaption></figure>

Para comparar los tamaños comprimidos y descomprimidos de una respuesta:

{% Instruction 'devtools-network', 'ol' %}

1. Habilite filas de solicitud grandes. Consulte [Usar filas de solicitud grandes](https://developers.google.com/web/tools/chrome-devtools/network/reference#request-rows) .
2. Busque en la **columna Tamaño** la respuesta que le interesa. El valor superior es el tamaño comprimido. El valor inferior es el tamaño descomprimido.

Consulte también [Minificar y comprimir cargas útiles de red](/reduce-network-payloads-using-text-compression) .

## Recursos

- [Código fuente para habilitar la auditoría de **compresión de texto**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/uses-text-compression.js)
