---
layout: post-old
title: Избегайте переадресации нескольких страниц
description: |2

  Узнайте, почему перенаправление страниц снижает скорость загрузки вашей веб-страницы и

  как их избежать.
web_lighthouse:
  - перенаправляет
date: 2019-05-04
updated: 2019-09-19
---

Перенаправления замедляют скорость загрузки вашей страницы. Когда браузер запрашивает ресурс, который был перенаправлен, сервер обычно возвращает HTTP-ответ, подобный этому:

```js
HTTP/1.1 301 Moved Permanently
Location: /path/to/new/location
```

Затем браузер должен сделать еще один HTTP-запрос в новом месте, чтобы получить ресурс. Этот дополнительный переход по сети может задержать загрузку ресурса на сотни миллисекунд.

## Как не удается выполнить аудит множественных перенаправлений Lighthouse

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) отмечает страницы с несколькими переадресациями:

<figure class="w-figure">{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uGOmnhqZoJnMoBgAiFJj.png", alt = "", width = "800", height = "276", class = "w-screenshot"%}</figure>

Страница не проходит этот аудит, если у нее есть два или более перенаправления.

## Как устранить редиректы

Укажите ссылки на отмеченные ресурсы на текущее расположение ресурсов. Особенно важно избегать перенаправления ресурсов, необходимых для вашего [критического пути рендеринга](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/) .

Если вы используете переадресацию для перенаправления мобильных пользователей на мобильную версию своей страницы, подумайте о переделке своего сайта для использования [адаптивного дизайна](https://developers.google.com/web/fundamentals/design-and-ux/responsive/) .

## Руководство по стекам

### Реагировать

Если вы используете React Router, минимизируйте использование компонента `<Redirect>` для [навигации](https://reacttraining.com/react-router/web/api/Redirect) по маршруту.

## Ресурсы

- [Исходный код для аудита **Избегайте множественных перенаправлений страниц**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/redirects.js)
- [Перенаправления в HTTP](https://developer.mozilla.org/docs/Web/HTTP/Redirections)
- [Избегайте переадресации целевой страницы](https://developers.google.com/speed/docs/insights/AvoidRedirects)
