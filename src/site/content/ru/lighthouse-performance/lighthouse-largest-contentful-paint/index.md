---
layout: post
title: Скорость загрузки основного контента (LCP)
description: Подробнее о метрике LCP (Скорость загрузки основного контента) и о способах ее измерения и оптимизации
date: 2020-01-10
updated: 2021-06-04
web_lighthouse:
  - largest-contentful-paint
---

LCP (Скорость загрузки основного контента) — одна из метрик, отслеживаемых в разделе **Performance (Производительность)** отчета Lighthouse. Каждая метрика отражает определенный аспект скорости загрузки страницы.

Lighthouse отображает LCP в секундах:

<figure>   {% Img src="image/MtjnObpuceYe3ijODN3a79WrxLU2/NcBzUBQFmSzhZaxshxLS.png", alt="Скриншот проверки Lighthouse для LCP", width="800", height="592" %}</figure>

## Что измеряет LCP

LCP измеряет время до вывода на экран самого большого элемента контента в области просмотра. Это время примерно соответствует моменту, когда основное содержимое страницы становится видимым для пользователей. См. статью [«Скорость загрузки основного контента (LCP)»](/largest-contentful-paint/#largest-contentful-paint-defined) для получения дополнительных сведений о том, как определяется LCP.

## Как Lighthouse определяет LCP

Браузерная поддержка LCP запущена в [Chrome 77](https://developers.google.com/web/updates/2019/09/nic77#lcp). Lighthouse извлекает данные LCP из [инструмента Chrome Tracing](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool).

В таблице ниже показано, как интерпретировать вашу оценку LCP:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>LCP время<br> (в секундах)</th>
        <th>Цветовое кодирование</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–2,5</td>
        <td>Зеленый (быстрая загрузка)</td>
      </tr>
      <tr>
        <td>2,5–4</td>
        <td>Оранжевый (средняя загрузка)</td>
      </tr>
      <tr>
        <td>Более 4</td>
        <td>Красный (медленная загрузка)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Как улучшить свою оценку LCP

Ознакомьтесь с этой статьей [«Скорость загрузки основного контента (LCP)»](/largest-contentful-paint#how-to-improve-largest-contentful-paint-on-your-site), чтобы узнать, как улучшить LCP для вашего сайта.

## Ресурсы

- [Исходный код проверки **LCP**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/largest-contentful-paint.js).
- скорость загрузки основного контента (LCP);
- [API LCP](https://wicg.github.io/largest-contentful-paint/).
- [Новое в Chrome 77: LCP (Скорость загрузки основного контента)](https://developers.google.com/web/updates/2019/09/nic77#lcp).
