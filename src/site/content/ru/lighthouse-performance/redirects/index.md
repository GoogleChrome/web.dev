---
layout: post
title: Как избежать множественной переадресации страницы
description: |
  Почему переадресация страниц снижает скорость загрузки веб-страницы и как этого избежать.
web_lighthouse:
  - redirects
date: 2019-05-04
updated: 2019-09-19
---

Переадресация снижает скорость загрузки страницы.
Когда браузер запрашивает переадресованный ресурс,
сервер обычно возвращает примерно такой HTTP-ответ:

```js
HTTP/1.1 301 Moved Permanently
Location: /путь/к/новому/местоположению
```

И чтобы получить ресурс, браузер теперь должен сделать еще один HTTP-запрос
по новому местоположению.
Такой дополнительный переход по сети может задержать
загрузку ресурса на сотни миллисекунд.

## Аудит множественной переадресации в Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
помечает страницы с множественной переадресацией:

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uGOmnhqZoJnMoBgAiFJj.png", alt="", width="800", height="276" %}
</figure>

Страница не проходит этот аудит, если на ней есть как минимум две переадресации.

## Как избавиться от переадресаций

Поставьте актуальные ссылки
на помеченные в отчете ресурсы.
Особенно важно избегать переадресации ресурсов,
необходимых для [пути критичной отрисовки](/critical-rendering-path/).

Если вы посредством переадресации направляете смартфоны на мобильную версию
страницы, попробуйте изменить дизайн сайта —
использовать [адаптивный дизайн](/responsive-web-design-basics/).

## Рекомендации по стекам

### React

Если вы используете React Router, старайтесь меньше использовать компонент `<Redirect>`
для [навигации по маршруту](https://reacttraining.com/react-router/web/api/Redirect).

## Материалы

- [Исходный код для аудита **Избежание множественной переадресации страниц** (Avoid multiple page redirects)](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/redirects.js).
- [Переадресация в HTTP](https://developer.mozilla.org/docs/Web/HTTP/Redirections).
- [Избежание переадресации целевой страницы (Avoid Landing Page Redirects)](https://developers.google.com/speed/docs/insights/AvoidRedirects).