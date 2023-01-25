---
layout: post
title: Entenda os termos "mesmo site" e "mesma origem"
authors:
  - agektmr
date: 2020-04-14
updated: 2020-06-10
description: Os termos "mesmo site" e "mesma origem" são citados com frequência, mas muitas vezes mal interpretados. Este artigo ajuda você a entender o que eles significam e como diferem.
tags:
  - security
---

Os termos "mesmo site" (same-site) e "mesma origem" (same-origin) são citados com frequência, mas muitas vezes mal interpretados. Por exemplo, eles são mencionados no contexto de transições de página, solicitações de `fetch()`, cookies, abertura de pop-ups, recursos incorporados e iframes.

## Origem

{% Img src="image/admin/PX5HrIMPlgcbzYac3FHV.png", alt="Origem", width="680", height="100" %}

A "origem" é a combinação de um [esquema](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Scheme_or_protocol) (também conhecido como [protocolo](https://developer.mozilla.org/docs/Glossary/Protocol), por exemplo, [HTTP](https://developer.mozilla.org/docs/Glossary/HTTP) ou [HTTPS](https://developer.mozilla.org/docs/Glossary/HTTPS)), um [nome de host](https://en.wikipedia.org/wiki/Hostname) e uma [porta](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Port) (se especificada). Por exemplo, no URL `https://www.example.com:443/foo`, a "origem" é `https://www.example.com:443`.

### "mesma origem" e "origem cruzada" {: #same-origin-and-cross-origin }

Os sites que possuem a mesma combinação de esquema, nome de host e porta são considerados de "mesma origem". Todos os outros são considerados de "origem cruzada" (cross-origin).

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Origem A</th>
        <th>Origem B</th>
        <th>Classificação da Origem A e B em "mesma origem" ou "origem cruzada" e justificativa</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="7">https://www.example.com:443</td>
        <td>https: // <strong>www.evil.com</strong> : 443</td>
        <td>origem cruzada: domínios diferentes</td>
      </tr>
      <tr>
        <td>https://<strong>example.com</strong>:443</td>
        <td>origem cruzada: subdomínios diferentes</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong> .example.com:443</td>
        <td>origem cruzada: subdomínios diferentes</td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td>origem cruzada: esquemas diferentes</td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td>origem cruzada: portas diferentes</td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>mesma origem: correspondência exata</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>mesma origem: correspondência do número de porta implícito (443)</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## Site

{% Img src="image/admin/oSRJzCJIr4OjGzUhcNDP.png", alt="Site", width="680", height="142" %}

Os domínios de nível superior (TLDs), como `.com` e `.org`, estão listados em [Root Zone Database](https://www.iana.org/domains/root/db). No exemplo acima, "site" é a combinação do TLD e da parte do domínio que o precede. Por exemplo, no URL `https://www.example.com:443/foo`, o "site" é `example.com`.

No entanto, para domínios como `.co.jp` ou `.github.io`, usar apenas o TLD de `.jp` ou `.io` não é detalhado o suficiente para identificar o "site". Além disso, não há como determinar algoritmicamente o nível de domínios registráveis para um determinado TLD. É por isso que uma lista de "TLDs efetivos" (eTLDs) foi criada. Eles são definidos na [Public Suffix List](https://wiki.mozilla.org/Public_Suffix_List) (Lista Pública de Sufixos). A lista de eTLDs está disponível em [publicsuffix.org/list](https://publicsuffix.org/list/).

O nome completo do site é o eTLD+1. Por exemplo, no URL `https://my-project.github.io`, o eTLD é `.github.io` e o eTLD+1 é `my-project.github.io`, que é considerado um "site". Em outras palavras, o eTLD+1 é o TLD efetivo e a parte do domínio que o precede.

{% Img src="image/admin/qmr35hpnIvpouOe9591g.png", alt="eTLD+1", width="695", height="136" %}

### "mesmo site" e "vários sites" {: #same-site-cross-site }

Os sites com o mesmo eTLD+1 são considerados o "mesmo site", enquanto aqueles com eTLD+1 diferentes são "vários sites" (cross-site).

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Origem A</th>
        <th>Origem B</th>
        <th>Classificação da Origem A e B em "mesmo site" ou "vários sites" e justificativa</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>vários sites: domínios diferentes</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td><strong>mesmo site: os subdomínios diferentes não importam</strong></td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td><strong>mesmo site: os esquemas diferentes não importam</strong></td>
      </tr>
      <tr>
        <td>https://www.example.com:<br><strong>80</strong>
</td>
        <td><strong>mesmo site: as portas diferentes não importam</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>mesmo site: correspondência exata</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>mesmo site: as portas não importam</strong></td>
      </tr>
    </tbody>
  </table>
</div>

### "schemeful same-site"

{% Img src="image/admin/Y9LbVyxYzg4k6mwSEqyE.png", alt="schemeful same-site", width="677", height="105" %}

A definição de "mesmo site" está evoluindo ao considerar o esquema de URL como parte do site, a fim de evitar que o HTTP seja usado como um [canal fraco](https://tools.ietf.org/html/draft-west-cookie-incrementalism-01#page-8). À medida que os navegadores mudam para essa interpretação, talvez você veja referências a "scheme-less same-site", relacionadas à definição mais antiga, e "[schemeful same-site](/schemeful-samesite/)", relacionadas à definição mais estrita. Nesse caso, `http://www.example.com` e `https://www.example.com` são considerados vários sites porque os esquemas não correspondem.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Origem A</th>
        <th>Origem B</th>
        <th>Classificação da Origem A e B em "schemeful same-site" ou "vários sites" e justificativa</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>vários sites: domínios diferentes</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td><strong>schemeful same-site: os subdomínios diferentes não importam</strong></td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td>vários sites: esquemas diferentes</td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td><strong>schemeful same-site: as portas diferentes não importam</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>schemeful same-site: correspondência exata</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>schemeful same-site: as portas não importam</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## Como verificar se uma solicitação é de "mesmo site", "mesma origem" ou "vários sites"

O Chrome envia solicitações junto com um cabeçalho HTTP `Sec-Fetch-Site`. Nenhum outro navegador é compatível com `Sec-Fetch-Site` desde abril de 2020. Isso faz parte de uma proposta mais ampla de [Cabeçalhos de Solicitação de Metadados Fetch](https://www.w3.org/TR/fetch-metadata/) (Fetch Metadata Request Headers). O cabeçalho terá um dos seguintes valores:

- `cross-site`
- `same-site`
- `same-origin`
- `none`

Ao examinar o valor de `Sec-Fetch-Site`, é possível determinar se a solicitação é de "mesmo site", "mesma origem" ou "vários sites" ("schemeful-same-site" não é capturado em `Sec-Fetch-Site`).
