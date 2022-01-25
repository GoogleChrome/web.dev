---
layout: post
title: Entendiendo "same-site" y "same-origin"
authors:
  - agektmr
date: 2020-04-15
updated: 2020-06-10
description: |2-

  "same-site" y "same-origen" se citan con frecuencia, pero a menudo son términos que se malinterpretan. Este artículo te ayuda a comprender qué son, cómo son y sus diferencias.
tags:
  - security
---

"same-site" y "same-origen" se citan con frecuencia, pero a menudo son términos que se malinterpretan. Por ejemplo, se mencionan en el contexto de transiciones de página, consultas `fetch()`, cookies, ventanas emergentes, recursos integrados y en iframes.

## Origin

{% Img src="image/admin/PX5HrIMPlgcbzYac3FHV.png", alt="Origin", width="680", height="100" %}

"Origin (Origen)"  es una combinación de un [esquema](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Scheme_or_protocol) (también conocido como [protocolo](https://developer.mozilla.org/docs/Glossary/Protocol), por ejemplo [HTTP](https://developer.mozilla.org/docs/Glossary/HTTP) o [HTTPS](https://developer.mozilla.org/docs/Glossary/HTTPS)), [nombre de host](https://en.wikipedia.org/wiki/Hostname) y [puerto](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Port) (si se especifica). Por ejemplo, dada una URL de `https://www.example.com:443/foo`, el "origen" es `https://www.example.com:443`.

### "same-origin" y "cross-origin" {: #same-origin-and-cross-origin }

Los sitios web que tienen la combinación del mismo esquema, nombre de host y puerto se consideran "same-origin (mismo origen)". Todo lo demás se considera "cross-origin (origen cruzado)".

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Origen A</th>
        <th>Origen B</th>
        <th>Explicación de si el Origen A y B son "same-origin" o "cross-origin"</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="7">https://www.example.com:443</td>
        <td>https: // <strong>www.evil.com</strong>:443</td>
        <td>origen cruzado: diferentes dominios</td>
      </tr>
      <tr>
        <td>https://<strong>example.com</strong>:443</td>
        <td>origen cruzado: diferentes subdominios</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td>origen cruzado: diferentes subdominios</td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td>origen cruzado: diferentes esquemas</td>
      </tr>
      <tr>
        <td>https://www.example.com:80</td>
        <td>origen cruzado: diferentes puertos</td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>mismo origen: coincidencia exacta</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>mismo origen: coincidencias de número de puerto implícito (443)</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## Sitio

{% Img src="image/admin/oSRJzCJIr4OjGzUhcNDP.png", alt="Sitio", width="680", height="142" %}

Los dominios de nivel superior (TLD) como `.com` y `.org` se enumeran en la [Root Zone Database](https://www.iana.org/domains/root/db). En el ejemplo anterior, "sitio" es la combinación del TLD y la parte del dominio inmediatamente anterior. Por ejemplo, dada una URL de `https://www.example.com:443/foo`, el "sitio" es `example.com`.

Sin embargo, para dominios como `.co.jp` o `.github.io` , el simple hecho de usar el TLD de `.jp` o `.io` no es lo suficientemente detallado para identificar el "sitio". Y no hay forma de determinar algorítmicamente el nivel de dominios registrables para un TLD en particular. Es por eso que se creó una lista de "TLD efectivos" (eTLD). Estos se definen en la [Public Suffix List (lista de sufijos públicos)](https://wiki.mozilla.org/Public_Suffix_List). La lista de eTLD es mantenida en [publicsuffix.org/list](https://publicsuffix.org/list/).

El nombre completo del sitio se conoce como eTLD+1. Por ejemplo, dada una URL de `https://my-project.github.io`, el eTLD es `.github.io` y el eTLD+1 es `my-project.github.io`, que se considera un "sitio". En otras palabras, el eTLD+1 es el TLD efectivo y la parte del dominio inmediatamente anterior.

{% Img src="image/admin/qmr35hpnIvpouOe9591g.png", alt="eTLD+1", width="695", height="136" %}

### "same-site" y "cross-site" {: #same-site-cross-site }

Los sitios web que tienen el mismo eTLD+1 se consideran "same-site (mismo sitio)". Los sitios web que tienen un eTLD+1 diferente son "cross-site (sitio cruzado)".

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Origen A</th>
        <th>Origen B</th>
        <th>Explicación de si Origin A y B son "en el mismo sitio" o "entre sitios"</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>sitio cruzado: diferentes dominios</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td><strong>mismo sitio: los diferentes subdominios no importan</strong></td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td><strong>mismo sitio: diferentes esquemas no importan</strong></td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td><strong>mismo sitio: los diferentes puertos no importan</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>mismo sitio: coincidencia exacta</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>mismo sitio: los puertos no importan</strong></td>
      </tr>
    </tbody>
  </table>
</div>

### "schemeful same-site"

{% Img src="image/admin/Y9LbVyxYzg4k6mwSEqyE.png", alt="schemeful same-site", width="677", height="105" %}

La definición de "same-site" está evolucionando para considerar el esquema de URL como parte del sitio para evitar que HTTP se utilice como [un canal débil](https://tools.ietf.org/html/draft-west-cookie-incrementalism-01#page-8). A medida que los navegadores adopten esta interpretación, es posible que veas referencias a "scheme-less same-site (mismo sitio sin esquema)" cuando se refiera a la definición anterior y "[schemeful same-site (mismo sitio esquemático)](/schemeful-samesite/)" refiriéndose a la definición más estricta. En ese caso, `http://www.example.com` y `https://www.example.com` se consideran cross-site porque los esquemas no coinciden.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Origen A</th>
        <th>Origen B</th>
        <th>Explicación de si el origen A y B son "un mismo sitio intrépido"</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>cross-site: diferentes dominios</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td><strong>mismo sitio esquemático: los diferentes subdominios no importan</strong></td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td>sitio cruzado: diferentes esquemas</td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td><strong>mismo sitio esquemático: diferentes puertos no importan</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>mismo sitio esquemático: coincidencia exacta</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>mismo sitio esquemático: los puertos no importan</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## Cómo comprobar si una solicitud es "same-site", "same-origin" o "cross-site"

Chrome envía solicitudes junto con una cabecera HTTP de `Sec-Fetch-Site`. Ningún otro navegador es compatible con `Sec-Fetch-Site` partir de abril de 2020. Esto es parte de una propuesta más grande de [Fetch Metadata Request Headers](https://www.w3.org/TR/fetch-metadata/). La cabecera tendrá uno de los siguientes valores:

- `cross-site`
- `same-site`
- `same-origin`
- `none`

Al examinar el valor de `Sec-Fetch-Site`, puedes determinar si la solicitud es "same-site", "same-origin" o "cross-site" (el "schemeful-same-site" no se captura en `Sec-Fetch-Site`).
