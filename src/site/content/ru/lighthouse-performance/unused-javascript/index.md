---
layout: post
title: Удалите неиспользуемый JavaScript
description: Узнайте, как пройти проверку Lighthouse «Удаление неиспользуемого JavaScript».
web_lighthouse:
  - unused-javascript
date: 2020-07-07
---

Неиспользуемый JavaScript может замедлить скорость загрузки вашей страницы:

- Если JavaScript [блокирует рендеринг](/critical-rendering-path-adding-interactivity-with-javascript/), браузер должен загрузить, проанализировать, скомпилировать и оценить скрипт, прежде чем он сможет продолжить всю остальную работу, необходимую для рендеринга страницы.
- Даже если JavaScript является асинхронным (т. е. не блокирует рендеринг), код во время загрузки конкурирует за пропускную способность с другими ресурсами, что значительно снижает производительность. Отправка неиспользованного кода по сети также расточительна для мобильных пользователей, у которых нет безлимитных тарифных планов.

## Причины плохих результатов проверки неиспользуемого JavaScript

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) отмечает каждый файл JavaScript с более чем 20 кибибайтами неиспользуемого кода:

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jYbX7CFrcOaaqMHaHa6f.jpg", alt = "Скриншот проверки.", width = "800", height = "332"%}<figcaption> Щелкните значение в столбце <b>URL</b>, чтобы открыть исходный код сценария в новой вкладке.</figcaption></figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Как удалить неиспользуемый JavaScript

### Выявите неиспользуемый JavaScript

Вкладка [Coverage](https://developer.chrome.com/docs/devtools/coverage/) в Chrome DevTools предоставляет построчную разбивку неиспользуемого кода.

Класс [`Coverage`](https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-coverage) в Puppeteer может помочь автоматизировать процесс обнаружения неиспользуемого кода и извлечения используемого кода.

### Инструмент сборки для поддержки удаления неиспользуемого кода

Ознакомьтесь со следующими тестами [Tooling.Report](https://tooling.report), чтобы узнать, поддерживает ли ваш сборщик проектов функции, которые упрощают удаления кода или не дают ему накапливаться.

- [Разделение кода](https://bundlers.tooling.report/code-splitting/).
- [Удаление неиспользуемого кода](https://bundlers.tooling.report/transformations/dead-code/).
- [Неиспользуемый импортированный код](https://bundlers.tooling.report/transformations/dead-code-dynamic/).

## Рекомендации по стекам

### Angular

Если вы используете Angular CLI, включите карты кода в производственную сборку кода, чтобы [проверить свои бандлы](https://angular.io/guide/deployment#inspect-the-bundles).

### Drupal

Подумайте об удалении неиспользуемых ресурсов JavaScript и прикрепите только необходимые библиотеки Drupal к соответствующей странице или компоненту на странице. Более подробно см. в статье [«Определение библиотеки»](https://www.drupal.org/docs/8/creating-custom-modules/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-module#library).

### Joomla

Подумайте о том, чтобы сократить количество (удалить или отключить) [расширений Joomla](https://extensions.joomla.org/), загружающих неиспользуемый JavaScript на вашу страницу.

### Magento

Отключите встроенный в Magento [бандлинг JavaScript](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/themes/js-bundling.html).

### React

Если вы не выполняете рендеринг на стороне сервера, [разделите бандлы JavaScript](/code-splitting-suspense/) с помощью `React.lazy()`. В противном случае разделите код с помощью сторонней библиотеки, такой как [loadable-components](https://www.smooth-code.com/open-source/loadable-components/docs/getting-started/).

### Vue

Если вы не выполняете рендеринг на стороне сервера и используете [маршрутизатор Vue](https://next.router.vuejs.org), разделите бандлы для [отложенной загрузки маршрутов](https://next.router.vuejs.org/guide/advanced/lazy-loading.html).

### WordPress

Подумайте о том, чтобы сократить количество (удалить или отключить) [плагинов WordPress](https://wordpress.org/plugins/), загружающих неиспользуемый JavaScript на вашу страницу.

## Ресурсы

- [Исходный код для проверки **Remove unused code** (Удалите неиспользуемый код)](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unused-javascript.js).
- [Удалите неиспользуемый код](/remove-unused-code/).
- [Добавление интерактивности с помощью JavaScript](/critical-rendering-path-adding-interactivity-with-javascript/).
- [Разделение кода](https://bundlers.tooling.report/code-splitting/).
- [Устранение мертвого кода](https://bundlers.tooling.report/transformations/dead-code/).
- [Мертвый импортированный код](https://bundlers.tooling.report/transformations/dead-code-dynamic/).
- [Найдите неиспользуемый код JavaScript и CSS с помощью вкладки Coverage в Chrome DevTools](https://developer.chrome.com/docs/devtools/coverage/).
- [Класс: `Coverage`](https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-coverage).
