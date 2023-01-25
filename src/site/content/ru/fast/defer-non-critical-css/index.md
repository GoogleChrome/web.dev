---
layout: post
title: Откладывание некритичных CSS
authors:
  - demianrenzulli
description: |2-

  Как оптимизировать загрузку критичных CSS, откладывая некритичные

  Путь отрисовки и ускорение FCP (First Contentful Paint).
date: 2019-02-17
updated: 2020-06-12
tags:
  - performance
---

CSS-файлы [блокируют отрисовку](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources), поскольку эти ресурсы должны загружаться и обрабатываться до того, как браузер отобразит страницу. Поэтому объемные файлы стилей значительно замедляют отрисовку страницы.

В этом руководстве рассказывается, как оптимизировать [Critical Rendering Path](/critical-rendering-path/) (путь критичной отрисовки) и ускорить [First Contentful Paint (FCP)](/fcp/) (первая отрисовка контента), откладывая некритичные CSS.

## Неоптимальная загрузка CSS

В следующем примере показана гармошка с тремя скрытыми абзацами текста, каждый из которых оформлен с применением отдельного класса:

{% Glitch { id: 'defer-css-unoptimized', path: 'index.html' } %}

Страница запрашивает CSS-файл, который содержит восемь классов, но для отображения «видимого» контента нужны только некоторые из них.

В рамках этого руководства мы оптимизируем страницу так, чтобы синхронно загружались только **критичные** стили, а остальные (например, применяемые к абзацам) загружались, не блокируя отрисовку.

## Оценка производительности

Запустите [Lighthouse](/discover-performance-opportunities-with-lighthouse/#run-lighthouse-from-chrome-devtools) для [этой страницы](https://defer-css-unoptimized.glitch.me/) и перейдите в раздел **Performance**.

В отчете у метрики **First Contentful Paint** указано значение «1s» (1 секунда) и приведена рекомендация **Eliminate render-blocking resources** (уберите ресурсы, блокирующие отрисовку) с указанием на файл **style.css**:

<figure>   {% Img src="image/admin/eZtuQ2IwL3Mtnmz09bmp.png", alt="Lighthouse report for unoptimized page, showing FCP of '1s' and 'Eliminate blocking resources' under 'Opportunities'", width="800", height="640" %}</figure>

{% Aside %} CSS-файл в рамках этой демонстрации не очень большого размера. Если запросить CSS большего размера (обычное дело на реальных проектах) и Lighthouse обнаружит, что на странице как минимум 2048 байт CSS-правил, не использованных при отрисовке контента **видимой части страницы**, появится также рекомендация **Remove Unused CSS** (удалите неиспользуемые CSS). {% endAside %}

Посмотрим, как именно такой CSS блокирует отрисовку:

1. Откройте [эту страницу](https://defer-css-unoptimized.glitch.me/) в Chrome. {% Instruction 'devtools-performance', 'ol' %}
2. На панели «Performance» (Производительность) нажмите кнопку **перезагрузки**.

В полученной трассировке метка **FCP** размещена сразу после завершения загрузки CSS:

<figure>{% Img src="image/admin/WhpaDYb98Rf03JmuPenp.png", alt="Трассировка производительности в DevTools для неоптимизированной страницы. FCP начинается после загрузки CSS.", width="800", height="352" %}</figure>

Это означает, что браузеру, прежде чем отрисовать первый пиксель на экране, необходимо дождаться загрузки и обработки всех CSS.

## Оптимизация

Чтобы оптимизировать страницу, надо знать, какие классы считаются критичными. Для этого используем [Coverage Tool](https://developer.chrome.com/docs/devtools/css/reference/#coverage) (инструмент «Покрытие»):

1. В DevTools откройте [командное меню](https://developer.chrome.com/docs/devtools/command-menu/), нажав `Control+Shift+P` или `Command+Shift+P` (Mac).
2. Введите «coverage» (область действия) и выберите **Show Coverage** (Показать область действия).
3. Нажмите кнопку **перезагрузки** — страница будет обновлена и начнется сбор данных.

<figure>   {% Img src="image/admin/JTFK7wjhlTzd2cCfkpps.png", alt="Покрытие для CSS-файла. Показано, что не используются 55,9 % байтов.", width="800", height="82" %}</figure>

Дважды щелкните отчет — будут показаны классы, выделенные двумя цветами:

- Зеленый (**критичные**): классы, необходимые браузеру для отрисовки видимого контента (например, заголовка, подзаголовка и кнопок-гармошек).
- Красный (**некритичные**): стили, применяемые к контенту, который отображается не сразу (например, абзацы внутри гармошек).

Опираясь на эту информацию, оптимизируем CSS так, чтобы браузер начинал обрабатывать критичные стили сразу после загрузки страницы, а некритичные откладывал на потом:

- Извлеките определения «зеленых» классов и поместите их в блок `<style>` в элементе «head» страницы:

```html
<style type="text/css">
.accordion-btn {background-color: #ADD8E6;color: #444;cursor: pointer;padding: 18px;width: 100%;border: none;text-align: left;outline: none;font-size: 15px;transition: 0.4s;}.container {padding: 0 18px;display: none;background-color: white;overflow: hidden;}h1 {word-spacing: 5px;color: blue;font-weight: bold;text-align: center;}
</style>
```

- Затем задайте асинхронную загрузку остальных классов, применив следующий шаблон:

```html
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

Это не стандартный способ загрузки CSS, и работает он так:

- `link rel="preload" as="style"` запрашивает таблицу стилей асинхронным образом. Подробнее о `preload` смотрите в [Руководстве по предварительной загрузке критичных объектов](/preload-critical-assets).
- Атрибут `onload` для `link` позволяет обрабатывать CSS после завершения загрузки.
- Указывая значение «null» для обработчика <code>onload</code> после его использования, мы позволяем некоторым браузерам избежать его повторного вызова обработчика при переключении атрибута «rel».
- Ссылка на таблицу стилей внутри элемента `noscript` — резервный вариант для браузеров, которые не выполняют JavaScript.

{% Aside %} Здесь для оптимизации мы используем базовый код. На реальных проектах рекомендуется использовать функции вроде [loadCSS](https://github.com/filamentgroup/loadCSS/blob/master/README.md), которые могут инкапсулировать это поведение и учитывать особенности разных браузеров. {% endAside %}

[Полученная страница](https://defer-css-optimized.glitch.me/) выглядит так же, как и предыдущая версия, но при этом большинство стилей на ней загружаются асинхронно. В HTML-файле встроенные стили и асинхронный запрос к CSS-файлу выглядят следующим образом:

<!-- Copy and Paste Me -->

{% Glitch { id: 'defer-css-optimized', path: 'index.html', previewSize: 0 } %}

## Мониторинг

С помощью DevTools запустите трассировку **Performance** (Производительность) на уже [оптимизированной странице](https://defer-css-optimized.glitch.me/).

Теперь метка **FCP** появляется перед тем, как страница запрашивает CSS — то есть, браузеру не приходится ждать загрузки стилей, чтобы начать отрисовку:

<figure>   {% Img src="image/admin/0mVq3q760y37JSn2MmCP.png", alt="Трассировка производительности DevTools для оптимизированной страницы. FCP начинается до загрузки CSS.", width="800", height="389" %}</figure>

Наконец, запустим Lighthouse для оптимизированной страницы.

В отчете видно, что время FCP страницы снизилось на **0,2 с** — то есть, на целых 20 %:

<figure>   {% Img src="image/admin/oTDQFSlfQwS9SbqE0D0K.png", alt="Отчет Lighthouse. Показано значение FCP, равное «0.8 s».", width="800", height="324" %}</figure>

Подсказка **Eliminate render-blocking resources** из раздела **Opportunities** (Варианты оптимизации) перешла в **Passed Audits** (Пройденные проверки):

<figure>   {% Img src="image/admin/yDjEvZAcjPouC6I3I7qB.png", alt="Отчет Lighthouse. Пункт «Eliminate blocing resources» показан в разделе «Passed Audits».", width="800", height="237" %}</figure>

## Дальнейшие действия и дополнительные материалы

В этом руководстве мы разобрались, как отложить некритичные CSS. Для этого мы вручную извлекли неиспользуемый код на странице. Дополнительно можете ознакомиться с [руководством по извлечению критичных CSS](/extract-critical-css/): в нем рассмотрены популярные инструменты для извлечения критичных CSS и есть демонстрационное [практическое задание](/codelab-extract-and-inline-critical-css/).
