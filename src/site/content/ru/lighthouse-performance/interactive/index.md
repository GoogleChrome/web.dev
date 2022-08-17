---
layout: post
title: Время до интерактивности (TTI)
description: |2-

  Узнайте о метрике Lighthouse Time to Interactive (время до интерактивности), а также о том,

  как ее измерять и оптимизировать.
date: 2019-05-02
updated: 2021-06-04
web_lighthouse:
  - interactive
---

Time to Interactive (TTI) — это один из шести показателей, отслеживаемых в разделе «**Производительность**» отчета Lighthouse. Каждый показатель отражает определенный аспект скорости загрузки страницы.

Измерение TTI важно, потому что некоторые сайты оптимизируют видимость контента за счет интерактивности. Это может расстроить пользователя: сайт выглядит готовым, но когда пользователь пытается с ним взаимодействовать, ничего не происходит.

Lighthouse отображает TTI в секундах:

<figure>{% Img src="image/MtjnObpuceYe3ijODN3a79WrxLU2/JtyY7nYUTCt2Q9oFYvEL.png", alt="Снимок экрана аудита Time to Interactive Lighthouse", width="800", height="592" %}</figure>

## Что измеряет TTI

TTI измеряет, сколько времени требуется странице, чтобы стать *полностью* интерактивной. Страница считается полностью интерактивной, если:

- На странице отображается полезный контент, который измеряется с помощью показателя [First Contentful Paint](/fcp/),
- Обработчики событий регистрируются для наиболее видимых элементов страницы, и
- Страница реагирует на действия пользователя в течение 50 миллисекунд.

{% Aside %} И показатель [First CPU Idle](/first-cpu-idle), и TTI измеряют, когда страница готова для ввода пользователем. First CPU Idle показывает, когда пользователь может *начать* взаимодействовать со страницей; TTI отмечает, когда пользователь *полностью* может взаимодействовать со страницей. См. [«Первая интерактивность и полная интерактивность» (First Interactive And Consistently Interactive)](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit) от Google, если вас интересует точный расчет для каждого показателя. {% endAside %}

## Как Lighthouse рассчитывает оценку вашего TTI

Оценка TTI — это сравнение TTI вашей страницы и TTI для реальных веб-сайтов на основе [данных из HTTP-архива](https://httparchive.org/reports/loading-speed#ttci). Например, сайты, работающие в девяносто девятом процентиле, отображают TTI примерно за 2,2 секунды. Если TTI вашего сайта составляет 2,2 секунды, ваша оценка TTI равна 99.

В этой таблице показано, как интерпретировать оценку TTI:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Метрика TTI<br> (в секундах)</th>
        <th>Цветовой код</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–3,8</td>
        <td>Зеленый (быстро)</td>
      </tr>
      <tr>
        <td>3,9–7,3</td>
        <td>Оранжевый (средне)</td>
      </tr>
      <tr>
        <td>Более 7,3</td>
        <td>Красный (медленно)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Как улучшить оценку TTI

Одним из улучшений, которое может особенно сильно повлиять на TTI, является отсрочка или удаление ненужной работы JavaScript. Ищите возможности для [оптимизации вашего JavaScript](/fast#optimize-your-javascript). В частности, рассмотрите возможность [уменьшения полезной нагрузки JavaScript за счет разделения кода](/reduce-javascript-payloads-with-code-splitting) и [применения шаблона PRPL](/apply-instant-loading-with-prpl). [Оптимизация стороннего JavaScript](/fast/#optimize-your-third-party-resources) также дает значительные улучшения для некоторых сайтов.

Эти два диагностических аудита предоставляют дополнительные возможности для сокращения объема работы JavaScript:

- [Минимизация работы основного потока](/mainthread-work-breakdown)
- [Уменьшение времени выполнения JavaScript](/bootup-time)

## Отслеживание TTI на устройствах реальных пользователей

Чтобы узнать, как измерить реальное значение TTI на устройствах ваших пользователей, см. страницу Google [с показателями производительности, ориентированными на пользователя](/user-centric-performance-metrics/). В разделе [«Отслеживание TTI»](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_tti) описывается, как программно получить доступ к данным TTI и отправить их в Google Analytics.

{% Aside %} TTI может быть сложно отследить в естественных условиях. Отслеживая показатель [First Input Delay (задержка первого ввода)](https://developers.google.com/web/updates/2018/05/first-input-delay), можно получить достаточно близкое к TTI значение. {% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## Ресурсы

- [Исходный код для аудита **Time to Interactive**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/interactive.js)
- [Руководство по оценкам Lighthouse](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Первая интерактивность и полная интерактивность](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)
- [Оптимизация запуска JavaScript](/optimizing-content-efficiency-javascript-startup-optimization/)
- [Уменьшение полезной нагрузки JavaScript с помощью Tree Shaking](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/)
- [Оптимизация сторонних ресурсов](/fast/#optimize-your-third-party-resources)
