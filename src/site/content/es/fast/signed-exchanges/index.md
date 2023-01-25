---
layout: post
title: Intercambios firmados (SXG)
subhead: Un SXG es un mecanismo de entrega que permite autenticar el origen de un recurso independientemente de cómo haya sido entregado.
authors:
  - katiehempenius
date: 2020-10-14
updated: 2021-04-21
hero: image/admin/6ll3P8MYWxvtb1ZjXIzb.jpg
alt: Un montón de sobres.
description: Un SXG es un mecanismo de entrega que permite autenticar el origen de un recurso independientemente de cómo haya sido entregado.
tags:
  - blog
  - performance
---

Un signed exchange (intercambio firmado) SXG es un mecanismo de entrega que permite autenticar el origen de un recurso independientemente de cómo haya sido entregado. Este desacoplamiento avanza en una variedad de casos de uso, como la captura o búsqueda previa para preservar la privacidad, las experiencias de Internet sin conexión y el servicio desde caché de terceros. Además, la implementación de SXG puede mejorar el Largest Contentful Paint o despliegue del contenido más extenso (LCP) para algunos sitios.

Este artículo proporciona una descripción general de los SXG: cómo funcionan, casos de uso y herramientas.

## Compatibilidad del navegador {: #browser-compatibility}

Los SXG son [compatibles](https://caniuse.com/#feat=sxg) con los navegadores basados en Chromium (a partir de las versiones: Chrome 73, Edge 79 y Opera 64).

## Descripción general

Los intercambios firmados (SXG) permiten a un sitio firmar criptográficamente un par de solicitud/respuesta (un "intercambio HTTP") de tal manera que el navegador pueda verificar el origen y la integridad del contenido independientemente de cómo se distribuyó. Como resultado, el navegador puede mostrar la URL del sitio de origen en la barra de direcciones, en lugar de la URL del servidor que entregó el contenido.

La implicación más amplia de los SXG es que hacen que el contenido sea portátil: el contenido entregado a través de un SXG puede ser distribuido fácilmente por terceros, mientras se mantiene la plena seguridad y atribución de su origen. Históricamente, la única forma de que un sitio utilice a un tercero para distribuir su contenido mientras mantiene la atribución, ha sido que el sitio comparta sus certificados SSL con el distribuidor. Esto tiene inconvenientes de seguridad y además, está muy lejos de hacer que el contenido sea realmente portátil.

A largo plazo, el contenido verdaderamente portátil se puede utilizar para lograr casos de uso como experiencias completamente fuera de línea. En el plazo inmediato, el caso de uso principal de los SXG es la entrega de experiencias de usuario más rápidas al proporcionar contenido en un formato de fácil almacenamiento en caché. Específicamente, la [Búsqueda de Google](#google-search) almacenará en caché y, a veces, buscará previamente los SXG. Para los sitios que reciben una gran parte de su tráfico de la Búsqueda de Google, los SXG pueden ser una herramienta importante para entregar cargas de página más rápidas a los usuarios.

### El formato SXG

Un SXG está encapsulado en un archivo con [codificación binaria](https://cbor.io/) que tiene dos componentes principales: un intercambio HTTP y una [firma](https://developer.mozilla.org/docs/Glossary/Signature/Security). El intercambio HTTP consta de una URL de solicitud, información de negociación de contenido y una respuesta HTTP.

A continuación, se muestra un ejemplo de un archivo SXG decodificado:

```html
format version: 1b3
request:
  method: GET
  uri: https://example.org/
  headers:
response:
  status: 200
  headers:
    Cache-Control: max-age=604800
    Digest: mi-sha256-03=kcwVP6aOwYmA/j9JbUU0GbuiZdnjaBVB/1ag6miNUMY=
    Expires: Mon, 24 Aug 2020 16:08:24 GMT
    Content-Type: text/html; charset=UTF-8
    Content-Encoding: mi-sha256-03
    Date: Mon, 17 Aug 2020 16:08:24 GMT
    Vary: Accept-Encoding
signature:
    label;cert-sha256=*ViFgi0WfQ+NotPJf8PBo2T5dEuZ13NdZefPybXq/HhE=*;
    cert-url="https://test.web.app/ViFgi0WfQ-NotPJf8PBo2T5dEuZ13NdZefPybXq_HhE";
    date=1597680503;expires=1598285303;integrity="digest/mi-sha256-03";sig=*MEUCIQD5VqojZ1ujXXQaBt1CPKgJxuJTvFlIGLgkyNkC6d7LdAIgQUQ8lC4eaoxBjcVNKLrbS9kRMoCHKG67MweqNXy6wJg=*;
    validity-url="https://example.org/webpkg/validity"
header integrity: sha256-Gl9bFHnNvHppKsv+bFEZwlYbbJ4vyf4MnaMMvTitTGQ=

The exchange has a valid signature.
payload [1256 bytes]:
<!doctype html>
<html>
<head>
    <title>SXG example</title>
    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
    }
    </style>
</head>
<body>
<div>
    <h1>Hello</h1>
</div>
</body>
</html>
```

El parámetro `expires` en la firma indica la fecha de expiración de un SXG. Un SXG puede tener una validez máxima de 7 días. Si la fecha de vencimiento de un SXG es de más de 7 días en el futuro, el navegador lo rechazará. Encuentre más información sobre el encabezado de la firma en la [especificación de intercambios HTTP firmados](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html#section-3.1).

### Empaquetado web

Los SXG son parte de la familia más amplia de propuestas de especificaciones de [empaquetado web.](https://github.com/WICG/webpackage) Además de los SXG, el otro componente principal de la especificación de empaquetado web son los [paquetes web](/web-bundles/) ("intercambios HTTP empaquetados"). Los paquetes web son una colección de recursos HTTP y metadatos necesarios para interpretar el paquete.

La relación entre SXG y los paquetes web es un punto común de confusión. Se trata de dos tecnologías distintas que no dependen entre sí: los paquetes web se pueden utilizar con intercambios firmados y sin firmar. El objetivo común propuesto tanto por SXG como por los paquetes es la creación de un formato de "empaquetado web" que permita que los sitios se compartan en su totalidad para el consumo fuera de línea.

Los SXG son la primera parte de la especificación de empaquetado web que implementarán los navegadores basados en Chromium.

## Cargar SXG

En un inicio, el caso de uso principal de SXG probablemente sea como mecanismo de entrega para el documento principal de una página. Para este caso de uso, se puede hacer referencia a un SXG mediante las etiquetas `<link>` o `<a>`, así como la cabecera [`Link`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Link). Al igual que otros recursos, un SXG se puede cargar ingresando su URL en la barra de direcciones del navegador.

```html
<a href="https://example.com/article.html.sxg">
```

```html
<link rel="prefetch" as="document" href="https://example.com/article.html.sxg">
```

Los SXG también se pueden utilizar para entregar subrecursos. Para obtener más información, consulte [Sustitución de subrecursos de intercambio firmado](https://github.com/WICG/webpackage/blob/main/explainers/signed-exchange-subresource-substitution.md).

## Servir SXG

### Negociación de contenido

La [negociación de contenido](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation) es un mecanismo para servir diferentes representaciones del mismo recurso en la misma URL dependiendo de las capacidades y preferencias de un cliente, por ejemplo, entregar la versión gzip de un recurso a algunos clientes, pero la versión Brotli a otros. La negociación de contenido permite ofrecer representaciones SXG y no SXG del mismo contenido, según las capacidades de un navegador.

Los navegadores web utilizan el encabezado de solicitud [`Accept`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept)para comunicar los [tipos MIME](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types) que admiten. Si un navegador admite SXG, el tipo MIME `application/signed-exchange` se incluirá automáticamente en esta lista de valores.

Por ejemplo, este es el encabezado `Accept` enviado por Chrome 84:

```json
accept:
text/html,
application/xhtml+xml,
application/xml;q=0.9,
image/webp,image/apng,
\*/\*;q=0.8,
application/signed-exchange;v=b3;q=0.9
```

La parte `application/signed-exchange;v=b3;q=0.9` de esta cadena informa al servidor web que Chrome admite SXG, específicamente, la versión `b3`. La última parte `q=0.9` indica el [q-value](https://developer.mozilla.org/docs/Glossary/Quality_values).

El `q-value` expresa la preferencia relativa de un navegador por un formato particular usando una escala decimal de `0` a `1`, donde `1` representa la prioridad más alta. Cuando no se proporciona un `q-value` para un formato, `1` es el valor implícito.

### Mejores prácticas

Los servidores deben servir SXG cuando el encabezado `Accept` indica que el `q-value` para `application/signed-exchange` es mayor o igual que el `q-value` para `text/html`. En la práctica, esto significa que un servidor de origen entregará SXG a los rastreadores, pero no a los navegadores.

Los SXG pueden ofrecer un rendimiento superior cuando se utilizan con el almacenamiento en caché o la captura previa. Sin embargo, para el contenido que se carga directamente desde el servidor de origen sin el beneficio de estas optimizaciones, el formato `text/html` ofrece un mejor rendimiento que los SXG. Ofrecer contenido como SXG permite a los rastreadores y otros intermediarios almacenar en caché los SXG para una entrega más rápida a los usuarios.

La siguiente expresión regular se puede utilizar para hacer coincidir el encabezado `Accept` de las solicitudes que deben servirse como SXG:

```regex
Accept: /(^|,)\s\*application\/signed-exchange\s\*;\s\*v=[[:alnum:]\_-]+\s\*(,|$)/
```

Tenga en cuenta que la subexpresión `(,|$)` coincide con los encabezados donde el `q-value` se ha omitido para SXG; esta omisión implica un `q-value` de `1` para SXG. Aunque teóricamente un encabezado`Accept` podría contener la subcadena `q=1`, [en la práctica](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation/List_of_default_Accept_values) los navegadores no enumeran explícitamente el `q-value` de un formato cuando tiene el valor predeterminado de `1`.

## Depuración de SXG con Chrome DevTools {: #debugging}

Los intercambios firmados se pueden identificar buscando `signed-exchange` en la columna **Tipo** del panel **Red** en Chrome DevTools.

<figure>{% Img src="image/admin/cNdohSaeXqGHFBwD7L3B.png", alt="Captura de pantalla que muestra una solicitud SXG dentro del panel 'Red' en DevTools", width="696", height="201"%} <figcaption>El panel de <b>red</b> en DevTools</figcaption></figure>

La pestaña **Vista previa** proporciona más información sobre el contenido de un SXG.

<figure>{% Img src="image/admin/E0rBwuxk4BxFmLJ3gXhP.png", alt="Captura de pantalla de la pestaña 'Vista previa' para un SXG", width="800", height="561"%} <figcaption>La pestaña <b>Vista previa</b> en DevTools</figcaption></figure>

Para ver un SXG de primera mano, visite esta [demostración](https://signed-exchange-testing.dev/) en [uno de los navegadores compatibles con SXG](#browser-compatibility)

## Casos de uso

Los SXG se pueden usar para entregar contenido directamente desde un servidor de origen a un usuario, pero esto frustraría en gran medida el propósito de los SXG. Más bien, el uso previsto y los beneficios de los SXG se logran principalmente cuando los SXG generados por un servidor de origen se almacenan en caché y un intermediario los envía a los usuarios.

Aunque esta sección analiza principalmente el almacenamiento en caché y el servicio de SXG por parte de la Búsqueda de Google, es una técnica que se aplica a cualquier sitio que desee proporcionar a sus enlaces externos una experiencia de usuario más rápida o una mayor resistencia al acceso limitado a la red. Esto no solo incluye motores de búsqueda y plataformas de redes sociales, sino también portales de información que ofrecen contenido para consumo fuera de línea.

### Búsqueda de Google

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/oMtUUAVj5hAGwBZMDwct.png", alt="Diagrama que muestra un SXG precargado que se entrega desde una caché.", width="800", height="396" %}

La Búsqueda de Google utiliza SXG para proporcionar a los usuarios una experiencia de carga de página más rápida para las páginas cargadas desde los resultados de búsqueda. Los sitios que reciben un tráfico importantes de la Búsqueda de Google pueden ver mejoras de rendimiento significativas al ofrecer contenido como SXG.

La Búsqueda de Google ahora rastreará, almacenará en caché y buscará previamente los SXG cuando corresponda. Google y otros motores de búsqueda a veces [buscan previamente](https://developer.mozilla.org/docs/Web/HTTP/Link_prefetching_FAQ) el contenido que es probable que el usuario visite, por ejemplo, la página correspondiente al primer resultado de búsqueda. Los SXG son especialmente adecuados para la búsqueda previa, debido a sus beneficios de privacidad sobre los formatos que no son SXG.

{% Aside %} Existe una cierta cantidad de información de usuario inherente a todas las solicitudes de red, independientemente de cómo o por qué se hicieron: esto incluye información como la dirección IP, la presencia o ausencia de cookies y el valor de encabezados como `Accept-Language`. Esta información se "da a conocer" al servidor de destino cuando se realiza una solicitud. Debido a que los SXG se obtienen previamente de una caché, en vez del servidor de origen, el interés de un usuario en un sitio solo se revelará al servidor de origen una vez que el usuario navegue al sitio, en lugar de en el momento de la búsqueda previa. Además, el contenido obtenido previamente a través de SXG no establece cookies ni accede a `localStorage` a menos que el usuario cargue el contenido. Así mismo, esto no revela información de usuario nueva al referente de SXG. El uso de SXG para la búsqueda previa es un ejemplo del concepto de captura previa para preservar la privacidad. {% endAside %}

#### Rastreadores

El encabezado [`Accept`](https://developer.mozilla.org/docs/Web/HTTP/Content_negotiation) enviado por el rastreador de búsqueda de Google expresa una preferencia igual por `text/html` y `application/signed-exchange`. Como se describe en la [sección anterior](#best-practices), los sitios que deseen utilizar SXG deben servirlos cuando el encabezado `Accept` de una solicitud exprese una preferencia igual o mayor por SXG sobre `text/html`. En la práctica, solo los rastreadores expresarán una preferencia por los SXG sobre el `text/html`.

#### Indexación

Las representaciones SXG y no SXG de una página no están clasificadas ni indexadas por separado por la Búsqueda de Google. SXG es, en última instancia, un mecanismo de entrega, no cambia el contenido subyacente. Dado esto, no tendría sentido que la Búsqueda de Google indexara por separado o clasificara de diferentes maneras el mismo contenido entregado.

#### Web Vitals

Para los sitios que reciben una parte significativa de su tráfico de la Búsqueda de Google, los SXG se pueden utilizar para mejorar [Web Vitals](/vitals/), a saber, [LCP](/lcp/). Los SXG almacenados en caché y capturados previamente se pueden entregar a los usuarios de manera increíblemente rápida y esto produce un LCP más rápido. Aunque los SXG pueden ser una herramienta poderosa, funcionan mejor cuando se combinan con otras optimizaciones de rendimiento, como el uso de CDN y la reducción de subrecursos que bloquean el renderizado.

### AMP

El contenido AMP se puede entregar mediante SXG. SXG permite que el contenido AMP sea capturado previamente y mostrado usando su URL canónica, en lugar de su URL de AMP.

Todos los conceptos descritos en este documento aún se aplican al caso de uso de AMP; sin embargo, AMP tiene sus propias [herramientas](https://github.com/ampproject/amppackager) independientes para generar SXG.

{% Aside%} Obtenga información sobre cómo servir AMP mediante intercambios firmados en [amp.dev](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/signed-exchange/). {% endAside %}

## Herramientas

La implementación de SXG consiste en generar el SXG correspondiente a una URL determinada y luego entregar ese SXG a los solicitantes (generalmente rastreadores). Para generar un SXG, necesitará un certificado que pueda firmar SXG.

### Certificados

El uso de producción de SXG requiere un certificado que admita la extensión `CanSignHttpExchanges`. Según las [especificaciones](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html#section-4.2), los certificados con esta extensión deben tener un período de validez no mayor a 90 días y requieren que el dominio solicitante tenga configurado un [registro CAA de DNS.](https://en.wikipedia.org/wiki/DNS_Certification_Authority_Authorization)

[Esta página](https://github.com/google/webpackager/wiki/Certificate-Authorities) enumera las autoridades de certificación que pueden emitir este tipo de certificado. Los certificados para SXG solo están disponibles a través de una autoridad certificadora comercial.

### Herramientas SXG específicas de la plataforma

Estas herramientas admiten pilas de tecnología específicas. Si ya está utilizando una plataforma compatible con una de estas herramientas, le resultará más fácil de configurar que una herramienta de uso general.

- [`sxg-rs/cloudflare_worker`](https://github.com/google/sxg-rs/tree/main/cloudflare_worker) se ejecuta en [Cloudflare Workers](https://workers.cloudflare.com/).

- [`sxg-rs/fastly_compute`](https://github.com/google/sxg-rs/tree/main/fastly_compute) se ejecuta en [Fastly Compute@Edge](https://www.fastly.com/products/edge-compute/serverless).

- Los [intercambios firmados automáticos](https://blog.cloudflare.com/automatic-signed-exchanges/) son una función de Cloudflare que adquiere certificados y genera intercambios firmados automáticamente.

- El [módulo NGINX SXG](https://github.com/google/nginx-sxg-module) genera y sirve SXG para sitios que usan [nginx](https://nginx.org/). Las instrucciones de configuración se pueden encontrar [aquí](/how-to-set-up-signed-http-exchanges/).

- [Envoy SXG Filter](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/sxg_filter) genera y sirve SXG para sitios que usan [Envoy](https://www.envoyproxy.io/).

### Herramientas SXG de uso general

#### CLI de Web Packager

La [CLI de Web Packager](https://github.com/google/webpackager) genera un SXG correspondiente a una URL determinada.

```shell
webpackager \
    --private\_key=private.key \
    --cert\_url=https://example.com/certificate.cbor \
    --url=https://example.com
```

Una vez que se haya generado el archivo SXG, cárguelo en su servidor y sírvalo con el tipo MIME `application/signed-exchange;v=b3`. Además, deberá entregar el certificado SXG como `application/cert-chain+cbor`.

#### Servidor de Web Packager

El [servidor de Web Packager](https://github.com/google/webpackager/blob/main/cmd/webpkgserver/README.md), `webpkgserver`, actúa como un [proxy inverso](https://en.wikipedia.org/wiki/Reverse_proxy) para servir SXG. Dada una URL, `webpkgserver` buscará el contenido de la URL, lo empaquetará como un SXG y entregará el SXG en respuesta. Para obtener instrucciones sobre cómo configurar el servidor del empaquetador web, consulte [Cómo configurar intercambios firmados con Web Packager](/signed-exchanges-webpackager).

### Bibliotecas SXG

Estas bibliotecas podrían usarse para construir su propio generador SXG:

- [`sxg_rs`](https://github.com/google/sxg-rs/tree/main/sxg_rs) es una biblioteca de Rust para generar SXG. Es la biblioteca SXG con más funciones y se utiliza como base para las herramientas `cloudflare_worker` y `fastly_compute`.

- [`libsxg`](https://github.com/google/libsxg) es una biblioteca C mínima para generar SXG. Se utiliza como base para el módulo NGINX SXG y el filtro Envoy SXG.

- [`go/signed-exchange`](https://github.com/WICG/webpackage/tree/main/go/signedexchange)  es una biblioteca Go mínima proporcionada por la especificación del paquete web como [implementación de referencia](https://en.wikipedia.org/wiki/Reference_implementation) para generar SXG. Se utiliza como base para su herramienta CLI de referencia, [`gen-signedexchange`](https://github.com/WICG/webpackage/tree/main/go/signedexchange) y las herramientas de Web Packager que cuentan con más funciones.

## Conclusión

Los intercambios firmados son un mecanismo de entrega que permite verificar el origen y la validez de un recurso independientemente de cómo haya sido entregado el recurso. Como resultado, los SXG pueden ser distribuidos por terceros mientras se mantiene la atribución total del editor.

## Lecturas relacionadas

- [Borrador de especificaciones para intercambios HTTP firmados](https://wicg.github.io/webpackage/draft-yasskin-http-origin-signed-responses.html)
- [Explicaciones de empaquetado web](https://github.com/WICG/webpackage/tree/main/explainers)
- [Empiece a utilizar intercambios firmados en la Búsqueda de Google](https://developers.google.com/search/docs/advanced/experience/signed-exchange)
- [Cómo configurar intercambios firmados usando Web Packager](/signed-exchanges-webpackager)
- [Demostración de intercambios firmados](https://signed-exchange-testing.dev/)
