---
layout: post
title: Первая отрисовка контента (FCP)
description: Подробнее о метрике FCP (Первая отрисовка контента) и о способах ее измерения и оптимизации
date: 2019-05-02
updated: 2021-06-04
web_lighthouse:
  - first-contentful-paint
---

FCP (Первая отрисовка контента) — одна из метрик, отслеживаемых в разделе **Performance (Производительность)** отчета Lighthouse. Каждая метрика отражает определенный аспект скорости загрузки страницы.

Lighthouse показывает FCP в секундах:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Y8maVyZwGyS6gdyRjYWb.png", alt="Скриншот проверки Lighthouse для FCP", width="800", height="588" %}</figure>

## Что измеряет FCP

FCP измеряет, сколько времени требуется браузеру для отрисовки первой части контента DOM после перехода пользователя на страницу. Изображения, небелые элементы `<canvas>` и SVG на странице считаются содержимым DOM; всё, что находится внутри iframe, *не включается*.

## Как Lighthouse определяет FCP

Оценка FCP — это сравнение времени FCP вашей страницы и времени FCP реальных веб-сайтов на основе [данных из Интернет-архива](https://httparchive.org/reports/loading-speed#fcp). Например, у сайтов, входящих в 99-й процентиль, FCP составляет примерно 1,5 секунды. Если FCP вашего сайта составляет 1,5 секунды, то оценка FCP равна 99.

В этой таблице показано, как интерпретировать оценку FCP:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Время FCP<br> (в секундах)</th>
        <th>Цветовой код</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–1,8</td>
        <td>Зеленый (быстро)</td>
      </tr>
      <tr>
        <td>1,8–3</td>
        <td>Оранжевый (средне)</td>
      </tr>
      <tr>
        <td>Более 3</td>
        <td>Красный (медленно)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Как улучшить оценку FCP

Для FCP особенно важно время загрузки шрифтов. Ознакомьтесь со статьей [«Убедитесь, что текст остается видимым во время загрузки веб-шрифта»](/font-display), чтобы узнать, как ускорить загрузку шрифтов.

## Отслеживайте FCP на устройствах реальных пользователей

Чтобы узнать, как измерять FCP на реальных устройствах пользователей, см. статью [Google «Ориентированные на пользователя показатели производительности».](/user-centric-performance-metrics/) В разделе [«Отслеживание FP/FCP»](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_fpfcp) описывается, как программно получить доступ к данным FCP и отправить их в Google Analytics.

См. статью Google [«Оценка производительности загрузки в реальных условиях с помощью API Navigation Timing и API Resource Timing»](https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/), чтобы узнать больше о сборе метрик реальных пользователей.

{% include 'content/lighthouse-performance/improve.njk' %}

## Ресурсы

- [Исходный код проверки **FCP**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/first-contentful-paint.js).
- [Руководство по метрике FCP](/fcp).
- [Руководство по оценке производительности в Lighthouse](/performance-scoring).
- [Спецификация Paint Timing](https://w3c.github.io/paint-timing).
