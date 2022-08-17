---
layout: post
title: Аудит «[user-scalable="no"] используется в элементе <meta name="viewport"> или значение атрибута [maximum-scale] меньше 5»
description: Узнайте, как сделать вашу веб-страницу более доступной, убедившись, что масштабирование браузера не отключено.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - meta-viewport
---

Параметр `user-scalable="no"` для элемента `<meta name="viewport">` отключает масштабирование браузера на веб-странице. Параметр `maximum-scale` ограничивает степень, до которой пользователь может увеличить обзор. И то, и другое создает проблемы для пользователей с ослабленным зрением, которые полагаются на масштабирование браузера для просмотра содержимого веб-страницы.

## Причины плохих результатов аудита масштабирования браузера в Lighthouse

Lighthouse отмечает страницы, которые отключают масштабирование браузера:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/84cMMpBDm0rDl6hQISci.png", alt="Аудит Lighthouse, показывающий, что область просмотра отключает масштабирование текста", width="800", height="227" %}</figure>

Страница не проходит аудит, если она содержит тег `<meta name="viewport">` с любым из следующего:

- Атрибут `content` с параметром `user-scalable="no"`
- Атрибут `content` со значением параметра `maximum-scale` менее `5`

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## Как избежать отключения масштабирования браузера

Удалите параметр `user-scalable="no"` из метатега области просмотра и убедитесь, что для параметра `maximum-scale` установлено значение `5` или больше.

## Ресурсы

- [Исходный код для аудита «**`[user-scalable="no"]` используется в элементе `<meta name="viewport">` или значение атрибута `[maximum-scale]` меньше 5**» ([user-scalable="no"] is used in the <meta name="viewport"> element or the [maximum-scale] attribute is less than 5)](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/meta-viewport.js)
- [Масштабирование нельзя отключать (Университет Дек)](https://dequeuniversity.com/rules/axe/3.3/meta-viewport)
