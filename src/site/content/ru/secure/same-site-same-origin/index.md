---
layout: post
title: Понятия same-site и same-origin
authors:
  - agektmr
date: 2020-04-15
updated: 2020-06-10
description: На термины same-site и same-origin часто ссылаются, однако зачастую их неправильно трактуют. Эта статья объясняет, что они из себя представляют и чем отличаются.
tags:
  - security
---

На термины same-site и same-origin часто ссылаются, однако зачастую их неправильно трактуют. Например, они упоминаются в контексте переходов страниц, запросов `fetch()`, файлов cookie, открытия всплывающих окон, встроенных ресурсов и фреймов.

## Источник

{% Img src="image/admin/PX5HrIMPlgcbzYac3FHV.png", alt="Источник", width="680", height="100" %}

Источник (origin) — это комбинация [схемы](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Scheme_or_protocol) (также известной как [протокол](https://developer.mozilla.org/docs/Glossary/Protocol), например, [HTTP](https://developer.mozilla.org/docs/Glossary/HTTP) или [HTTPS](https://developer.mozilla.org/docs/Glossary/HTTPS)), [имени хоста](https://en.wikipedia.org/wiki/Hostname) и [порта](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Port) (если он указан). Например, для URL `https://www.example.com:443/foo` значение origin будет таким: `https://www.example.com:443`.

### "same-origin" и "cross-origin" {: #same-origin-and-cross-origin }

Веб-сайты, использующие одну и ту же схему, имя хоста и порт, считаются имеющими одинаковый источник (same-origin). Все остальное считается перекрестными источниками (cross-origin).

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Источник A</th>
        <th>Источник B</th>
        <th>Пояснение, считаются ли источники A и B same-origin или cross-origin</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="7">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>cross-origin: разные домены</td>
      </tr>
      <tr>
        <td>https://<strong>example.com</strong>:443</td>
        <td>cross-origin: разные поддомены</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td>cross-origin: разные поддомены</td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td>cross-origin: разные протоколы</td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td>cross-origin: разные порты</td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>same-origin: точное совпадение</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>same-origin: неявный номер порта (443) совпадает</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## Сайт

{% Img src="image/admin/oSRJzCJIr4OjGzUhcNDP.png", alt="Сайт", width="680", height="142" %}

Домены верхнего уровня (TLD), такие как `.com` и `.org`, перечислены в [базе данных корневой зоны](https://www.iana.org/domains/root/db). В приведенном выше примере сайт (site) — это комбинация TLD и части домена непосредственно перед ним. Например, для URL `https://www.example.com:443/foo` значение site будет таким: `example.com`.

Однако для таких доменов, как `.co.jp` или `.github.io`, простое использование TLD `.jp` или `.io` недостаточно детализировано для определения сайта. И нет никакого способа алгоритмически определить уровень регистрируемых доменов для конкретного TLD. Вот почему был создан список «эффективных TLD» (eTLD). Они определены в [списке общедоступных суффиксов](https://wiki.mozilla.org/Public_Suffix_List). Список eTLD поддерживается по адресу [publicsuffix.org/list](https://publicsuffix.org/list/).

Полное имя сайта — это eTLD+1. Например, если указан URL `https://my-project.github.io`, eTLD будет `.github.io` а eTLD+1 — `my-project.github.io`, что считается сайтом. Другими словами, eTLD+1 — это действующий TLD и часть домена непосредственно перед ним.

{% Img src="image/admin/qmr35hpnIvpouOe9591g.png", alt="eTLD+1", width="695", height="136" %}

### "same-site" и "cross-site" {: #same-site-cross-site }

Веб-сайты с одинаковым eTLD+1 считаются одинаковыми (same-site). Веб-сайты с отличающимися eTLD+1 являются перекрестными (cross-site).

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Источник A</th>
        <th>Источник B</th>
        <th>Пояснение, считаются ли источники A и B same-site или cross-site</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>cross-site: разные домены</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td><strong>same-site: разные субдомены не имеют значения</strong></td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td><strong>same-site: разные схемы не имеют значения</strong></td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td><strong>same-site: разные порты не имеют значения</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>same-site: точное совпадение</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>same-site: порты не имеют значения</strong></td>
      </tr>
    </tbody>
  </table>
</div>

### "schemeful same-site"

{% Img src="image/admin/Y9LbVyxYzg4k6mwSEqyE.png", alt="schemeful same-site", width="677", height="105" %}

Определение same-site развивается, чтобы рассматривать схему URL как часть сайта, чтобы предотвратить использование HTTP в качестве [слабого канала](https://tools.ietf.org/html/draft-west-cookie-incrementalism-01#page-8). По мере того, как браузеры переходят к этой интерпретации, вы можете видеть ссылки на «один и тот же сайт без схемы» (scheme-less same-site) при обращении к старому определению и на «[тот же сайт со схемой](/schemeful-samesite/)» (schemeful same-site) при обращении к более строгому определению. В этом случае `http://www.example.com` и `https://www.example.com` покажут значение cross-site, поскольку протоколы не совпадают.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Источник A</th>
        <th>Источник B</th>
        <th>Пояснение, считаются ли источники A и B schemeful same-site</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6">https://www.example.com:443</td>
        <td>https://<strong>www.evil.com</strong>:443</td>
        <td>cross-site: разные домены</td>
      </tr>
      <tr>
        <td>https://<strong>login</strong>.example.com:443</td>
        <td><strong>schemeful same-site: разные поддомены не имеют значения</strong></td>
      </tr>
      <tr>
        <td>
<strong>http</strong>://www.example.com:443</td>
        <td>cross-site: разные протоколы</td>
      </tr>
      <tr>
        <td>https://www.example.com:<strong>80</strong>
</td>
        <td><strong>schemeful same-site: разные порты не имеют значения</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com:443</strong></td>
        <td><strong>schemeful same-site: точное совпадение</strong></td>
      </tr>
      <tr>
        <td><strong>https://www.example.com</strong></td>
        <td><strong>schemeful same-site: порты не имеют значения</strong></td>
      </tr>
    </tbody>
  </table>
</div>

## Как проверить, относится ли запрос к same-site, same-origin или cross-site

Chrome отправляет запросы вместе с HTTP-заголовком `Sec-Fetch-Site`. По состоянию на апрель 2020 года другие браузеры не поддерживают `Sec-Fetch-Site`. Это часть более крупного предложения [Fetch Metadata Request Headers](https://www.w3.org/TR/fetch-metadata/). Заголовок будет иметь одно из следующих значений:

- `cross-site`
- `same-site`
- `same-origin`
- `none`

Просмотрев значение `Sec-Fetch-Site`, вы можете определить, относится ли запрос к типу same-site, same-origin или cross-site (тип schemeful-same-site не фиксируется в `Sec-Fetch-Site`).
