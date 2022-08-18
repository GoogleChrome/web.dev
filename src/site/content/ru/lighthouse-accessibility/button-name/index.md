---
layout: post
title: Кнопки без информативных названий
description: Узнайте, как улучшить доступность веб-страницы, убедившись, что все кнопки имеют понятные названия для пользователей, применяющих специальные возможности.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - button-name
---

Когда у кнопки нет информативного названия, программы чтения с экрана и другие средства специальных возможностей объявляют ее как *кнопку*, что не дает пользователям никакой информации о ее назначении.

## Когда проверка названия кнопки считается непройденной в Lighthouse

Lighthouse отмечает кнопки, у которых нет текстового содержимого или свойства `aria-label`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/evoQAq4c1CBchwNMl9Uq.png", alt="Скриншот проверки Lighthouse, отображающий кнопки без информативного названия", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Как давать кнопкам названия с учетом доступности

Для кнопок с видимыми метками добавьте текстовое содержимое в элемент `button`. Сделайте метку четким призывом к действию. Например:

```html
<button>Book room</button>
```

Для кнопок без видимых меток, таких как кнопки со значками, используйте `aria-label`, чтобы четко описать действие для всех пользователей, использующих средства специальных возможностей, например:

{% Glitch { id: 'lh-button-name', path: 'index.html', previewSize: 0, height: 480 } %}

{% Aside %} В этом примере приложения задействован шрифт [Material icon font](https://google.github.io/material-design-icons/) от Google, использующий [лигатуры](https://alistapart.com/article/the-era-of-symbol-fonts/) для преобразования внутреннего текста кнопок в глифы значков. При объявлении кнопок средства специальных возможностей будут ссылаться на `aria-label`, а не на глифы значков. {% endAside %}

Подробнее см. в статье [«Добавление меток к кнопкам и ссылкам»](/labels-and-text-alternatives#label-buttons-and-links).

## Ресурсы

- [Исходный код проверки **Buttons do not have an accessible name** (Кнопки имеют неинформативные названия)](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/button-name.js).
- [Кнопки должны содержать информативный текст (Deque University)](https://dequeuniversity.com/rules/axe/3.3/button-name).
