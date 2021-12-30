---
layout: post-old
title: Ссылки имеют неинформативные названия
description: Узнайте, как повысить доступность ссылок на веб-странице, сделав их названия более информативными для пользователей вспомогательных технологий.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - link-name
---

Для того чтобы упростить навигацию пользователям программ чтения с экрана и других вспомогательных технологий, необходимо следить, чтобы текст ссылок был информативным, уникальным и достаточно объемным, чтобы на нем было легко сфокусироваться.

## Причины плохих результатов этой проверки в Lighthouse

Lighthouse помечает ссылки с неинформативными названиями:

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6enCwSloHJSyylrNIUF4.png", alt="Скриншот проверки Lighthouse, отображающей ссылки с неинформативными названиями", width="800", height="206", class="w-screenshot" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Как давать ссылкам названия с учетом доступности

Как и в случае с кнопками, для идентификации ссылок при использовании вспомогательных технологий используется в первую очередь их текстовое содержимое. Избегайте слов, не несущих смысловой нагрузки, таких как «здесь» или «читать далее»; вместо этого старайтесь сделать текст ссылки как можно более осмысленным:

```html
Check out <a href="…">our guide to creating accessible web pages</a>.
</html>
```

Подробнее см. в статье [Добавление меток к кнопкам и ссылкам](/labels-and-text-alternatives#label-buttons-and-links).

## Ресурсы

- [Исходный код проверки **Links do not have a discernible name** («Ссылки имеют неинформативные названия»)](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/link-name.js)
- [Ссылки должны содержать информативный текст (Deque University)](https://dequeuniversity.com/rules/axe/3.3/link-name)
