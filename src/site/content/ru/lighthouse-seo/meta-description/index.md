---
layout: post
title: У документа нет метаописания
description: |2-

  Узнайте об аудите Lighthouse «У документа нет метаописания».
date: 2019-05-02
updated: 2021-04-08
web_lighthouse:
  - meta-description
---

Элемент `<meta name="description">` предоставляет сводку содержимого страницы, которую поисковые системы включают в результаты поиска. Качественное и уникальное метаописание делает вашу страницу более релевантной и может увеличить поисковый трафик.

## Причины плохих результатов аудита метаописания в Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) отмечает страницы без метаописания:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dtMQ12xujHMJGuEwZ413.png", alt="Аудит Lighthouse показывает, что у документа нет метаописания", width="800", height="74" %}</figure>

Аудит считается неудачным, если:

- На странице нет элемента `<meta name=description>`
- Атрибут `content` элемента `<meta name=description>` пуст.

Lighthouse не оценивает качество вашего описания.

{% include 'content/lighthouse-seo/scoring.njk' %}

## Как добавить метаописание

Добавьте элемент `<meta name=description>` в `<head>` каждой из своих страниц:

```html
<meta name="description" content="Добавьте свое описание.">
```

При необходимости включите в описания четкие факты. Например:

```html
<meta name="description" content="Автор: A.N. Author,
    Иллюстратор: P. Picture, Категория: Книги, Цена: $17.99,
    Объем: 784 страницы">
```

## Рекомендованные стандарты метаописания

- Используйте уникальное описание для каждой страницы.
- Делайте описания четкими и краткими. Избегайте расплывчатых описаний вроде «Дом».
- Избегайте переполнения [ключевыми словами](https://support.google.com/webmasters/answer/66358). Это не помогает пользователям, а поисковые системы могут пометить страницу как спам.
- Описания не обязательно должны быть полными предложениями; они могут содержать структурированные данные.

Вот примеры хороших и плохих описаний:

{% Compare 'worse' %}

```html
<meta name="description" content="Рецепт пончиков.">
```

{% CompareCaption %} Слишком расплывчато. {% endCompareCaption %} {% endCompare %}

{% Compare 'better' %}

```html
<meta
  name="description"
  content="По простому рецепту пончиков с беконом в кленовом
           сиропе от Мэри вы сможете испечь мягкие сладости,
           от которых не сможете оторваться, используя всего
           щепотку соли.">
```

{% CompareCaption %} Содержательно, но кратко. {% endCompareCaption %} {% endCompare %}

Дополнительные советы см. на странице Google «[Как управлять ссылками-заголовками в результатах поиска](https://support.google.com/webmasters/answer/35624#1)».

## Ресурсы

- [Исходный код для аудита «**У документа нет метаописания**»](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/meta-description.js)
- [Как управлять ссылками-заголовками в результатах поиска](https://support.google.com/webmasters/answer/35624#1)
- [Нерелевантные ключевые слова](https://support.google.com/webmasters/answer/66358)
