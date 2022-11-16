---
layout: post
title: Минимизация работы основного потока
description: |2-

  Узнайте об основном потоке браузера и о том, как оптимизировать веб-страницу,

  чтобы уменьшить нагрузку на основной поток и повысить производительность.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - mainthread-work-breakdown
---

[Процесс визуализации](https://developer.chrome.com/blog/inside-browser-part3/) браузера — это то, что превращает ваш код в веб-страницу, с которой могут взаимодействовать ваши пользователи. По умолчанию [основной поток](https://developer.mozilla.org/docs/Glossary/Main_thread) процесса рендеринга обрабатывает большую часть кода: он анализирует HTML и строит DOM, анализирует CSS и применяет указанные стили, а также анализирует, оценивает и выполняет JavaScript.

Основной поток также обрабатывает пользовательские события. Таким образом, каждый раз, когда основной поток занят чем-то другим, веб-страница может не реагировать на действия пользователя, что приводит к плохому взаимодействию.

## Почему аудит работы основного потока Lighthouse завершается неудачей

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) отмечает страницы, которые во время загрузки загружают основной поток более 4 секунд:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kcHYoy1vfoJX76JVyM9T.png", alt="Снимок экрана аудита минимизации работы основного потока Lighthouse", width="800", height="408" %}</figure>

Чтобы помочь вам определить источники загрузки основного потока, Lighthouse показывает, на что было потрачено время ЦП, пока браузер загружал вашу страницу.

{% include 'content/lighthouse-performance/scoring.njk' %}

## Как минимизировать работу основного потока

Разделы ниже организованы на основе категорий, о которых сообщает Lighthouse. См. [в разделе «Анатомия фрейма»](https://aerotwist.com/blog/the-anatomy-of-a-frame/) обзор того, как Chromium отображает веб-страницы.

См. [раздел «Уменьшите объем работы основного потока»](https://developer.chrome.com/docs/devtools/speed/get-started/#main), чтобы узнать, как использовать Chrome DevTools для подробного анализа работы основного потока при загрузке страницы.

### Оценка скриптов

- [Оптимизация стороннего JavaScript](/fast/#optimize-your-third-party-resources)
- [Устранение обработчиков ввода](/debounce-your-input-handlers/)
- [Использование веб-воркеров](/off-main-thread/)

### Стили и верстка

- [Уменьшение объема и сложности расчетов стилей](/reduce-the-scope-and-complexity-of-style-calculations/)
- [Уход от больших, сложных макетов и перегрузки макетами](/avoid-large-complex-layouts-and-layout-thrashing/)

### Рендеринг

- [Применение свойств только для компоновщика и управление количеством слоев](/stick-to-compositor-only-properties-and-manage-layer-count/)
- [Упрощение сложной окраски и уменьшение площади окрашивания](/simplify-paint-complexity-and-reduce-paint-areas/)

### Анализ HTML и CSS

- [Извлечение критического CSS](/extract-critical-css/)
- [Минимизация CSS](/minify-css/)
- [Откладывание некритического CSS](/defer-non-critical-css/)

### Анализ и компиляция скрипта

- [Уменьшение полезной нагрузки JavaScript за счет разделения кода](/reduce-javascript-payloads-with-code-splitting/)
- [Удаление неиспользуемого кода](/remove-unused-code/)

### Сбор мусора

- [Контроль общего использования памяти вашей веб-страницей с помощью `measureMemory()`](/monitor-total-page-memory-usage/)

## Ресурсы

- [Исходный код для аудита **минимизации работы основного потока**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/mainthread-work-breakdown.js)
- [Основной поток (MDN)](https://developer.mozilla.org/docs/Glossary/Main_thread)
- [Взгляд изнутри на современный веб-браузер (часть 3)](https://developer.chrome.com/blog/inside-browser-part3/)
