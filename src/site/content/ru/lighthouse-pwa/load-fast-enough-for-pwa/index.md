---
layout: post
title: Страница загружается недостаточно быстро в мобильных сетях (Page load is not fast enough on mobile networks)
description: |2-

  Как ускорить загрузку веб-страницы в мобильных сетях.
web_lighthouse:
  - load-fast-enough-for-pwa
date: 2019-05-04
updated: 2020-06-10
---

Многие пользователи заходят на веб-страницы, используя медленное мобильное подключение. Ускорив загрузку страниц при подключении с мобильной сети, вы сделаете работу с сайтом более удобной для мобильных пользователей.

{% Aside 'note' %} Быстрая загрузка страниц в мобильной сети — базовое требование для того, чтобы сайт считался современным веб-приложением. Смотрите [основные требования для современного веб-приложения](/pwa-checklist/#core). {% endAside %}

## Аудит скорости загрузки страницы Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) помечает страницы, которые на мобильном подключении загружаются недостаточно быстро.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Cg0UJ1Lykj672ygYYeXo.png", alt="Аудит Lighthouse показывает, что страница на мобильном подключении загружается недостаточно быстро", width="800", height="98" %}</figure>

На восприятие времени загрузки влияют две основные метрики:

- [Первая отрисовка контента](/first-meaningful-paint) (First Meaningful Paint, FMP) — показывает, как быстро основное содержимое страницы начинает выглядеть визуально завершенным.
- [Время загрузки для взаимодействия](/tti/) (Time to Interactive, TTI) — показывает, как быстро страница становится полностью интерактивной.

Например, если страница кажется визуально законченной через 1 секунду, но пользователь не может взаимодействовать с ней в течение 10 секунд, то время загрузки, скорее всего, будет восприниматься как 10 секунд.

Lighthouse вычисляет, каким будет TTI при медленном сетевом подключении 4G. Если время загрузки для взаимодействия превышает 10 секунд, аудит считается непройденным.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Улучшение времени загрузки страницы

{% include 'content/lighthouse-performance/improve.njk' %}

## Материалы

- [Исходный код для аудита **Страница загружается недостаточно быстро в мобильных сетях** (Page load is not fast enough on mobile networks)](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/load-fast-enough-for-pwa.js).
- [Основные требования для современного веб-приложения](https://developers.google.com/web/progressive-web-apps/checklist#baseline).
- [Процесс визуализации](/critical-rendering-path/).
- [С чего начать анализ производительности времени выполнения](https://developer.chrome.com/docs/devtools/evaluate-performance/).
- [Запись данных о производительности во время загрузки](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#record-load).
- [Оптимизация контента](/performance-optimizing-content-efficiency/).
- [Производительность визуализации](/rendering-performance/).
