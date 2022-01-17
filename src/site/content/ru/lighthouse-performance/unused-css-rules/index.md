---
layout: post-old
title: Удалите неиспользуемый CSS-код
description: Узнайте о проверке неиспользуемых CSS-правил.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - unused-css-rules
---

В разделе Opportunities (Возможности) отчета Lighthouse перечислены все таблицы стилей с неиспользуемым CSS-кодом с потенциальной экономией 2 КиБ или более. Удалите неиспользуемый CSS-код, чтобы уменьшить количество ненужных байтов, потребляемых сетевой активностью:

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/m3WfvnCGJgrC5wqyvyyQ.png", alt="Скриншот проверки Remove unused CSS (Удалите неиспользуемый CSS-код) в Lighthouse", width="800", height="235", class="w-screenshot" %}</figure>

## Как неиспользуемый CSS-код снижает производительность

Использование тега `<link>` — распространенный способ добавления стилей на страницу:

```html
<!doctype html>
<html>
  <head>
    <link href="main.css" rel="stylesheet">
    ...
```

Файл `main.css`, загружаемый браузером, называется внешней таблицей стилей, поскольку хранится отдельно от HTML-кода, который его использует.

По умолчанию браузер должен загрузить, провести синтаксический анализ и обработать все внешние таблицы стилей, с которыми он сталкивается, прежде чем вывести на экран пользователя любой контент. Браузер не будет пытаться отобразить контент до обработки таблиц стилей, поскольку в них могут содержаться правила, влияющие на стиль страницы.

Каждая внешняя таблица стилей должна быть загружена из сети. Эти дополнительные обращения к сети могут увеличить время ожидания контента.

Неиспользуемый CSS-код также замедляет построение браузером [дерева рендеринга](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction). Дерево рендеринга похоже на дерево DOM, за исключением того, что оно также включает стили для каждого узла. Чтобы построить дерево рендеринга, браузер должен пройти по всему дереву DOM и проверить, какие правила CSS применяются к каждому узлу. Чем больше неиспользуемого CSS-кода, тем больше времени браузер может потратить на вычисление стилей для каждого узла.

## Как определить неиспользуемый CSS-код {: #coverage}

Вкладка Coverage в Chrome DevTools поможет обнаружить критический и некритический CSS-код. См. раздел [«Просмотр используемого и неиспользуемого CSS-кода на вкладке Coverage»](https://developers.google.com/web/tools/chrome-devtools/css/reference#coverage).

<figure class="w-figure">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ydgzuclRCAlY2nzrpDmk.png", alt="Chrome DevTools: вкладка Coverage", width="800", height="407", class="w-screenshot w-screenshot--filled" %} <figcaption class="w-figcaption"> Chrome DevTools: вкладка Coverage. </figcaption></figure>

Вы также можете извлечь эту информацию из Puppeteer. См. [Page.coverage](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagecoverage) .

## Встройте критический CSS-код и отложите некритический CSS-код

Используйте процедуру, аналогичную встраиванию кода в тег `<script>`. Встройте критические стили, необходимые для первой отрисовки контента, в блок `<style>` тега `head` HTML-страницы. Затем загрузите остальные стили асинхронно, задав для атрибута rel тега link значение `preload`.

Подумайте об автоматизации процесса извлечения и встраивания CSS-кода верхней половины полосы с помощью [инструмента Critical](https://github.com/addyosmani/critical/blob/master/README.md).

Дополнительные сведения см. в статье [«Отложите некритичный CSS-код»](/defer-non-critical-css).

## Рекомендации по стекам

### Drupal

Подумайте об удалении неиспользуемых правил CSS и прикрепите только необходимые библиотеки Drupal к соответствующей странице или компоненту на странице. Более подробно см. в разделе [«Определение библиотеки»](https://www.drupal.org/docs/8/creating-custom-modules/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-module#library).

### Joomla

Подумайте о том, чтобы сократить количество (удалить или отключить) [расширений Joomla](https://extensions.joomla.org/), загружающих неиспользуемый CSS-код на вашу страницу.

### WordPress

Подумайте о том, чтобы сократить количество (удалить или отключить) [плагинов WordPress](https://wordpress.org/plugins/), загружающих неиспользуемый CSS-код на вашу страницу.

## Ресурсы

- [Исходный код для проверки **Remove unused CSS (Удалите неиспользуемый CSS-код)**](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unused-css-rules.js).
