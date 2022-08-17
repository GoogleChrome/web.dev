---
layout: post
title: Индекс скорости
description: |2

  Узнайте о метрике индекса скорости Lighthouse и о том, как ее оптимизировать.
date: 2019-05-02
updated: 2021-06-04
web_lighthouse:
  - speed-index
---

Индекс скорости — один из шести показателей, отслеживаемых в разделе «**Производительность**» отчета Lighthouse. Каждый показатель отражает определенный аспект скорости загрузки страницы.

Lighthouse отображает индекс скорости в секундах:

<figure>{% Img src="image/MtjnObpuceYe3ijODN3a79WrxLU2/LFN6FPQ2uQ4LnwcHiZWq.png", alt="Снимок экрана аудита индекса скорости Lighthouse", width="800", height="588" %}</figure>

## Что измеряет индекс скорости

Индекс скорости измеряет, насколько быстро контент отображается визуально во время загрузки страницы. Сначала Lighthouse снимает видео загрузки страницы в браузере и вычисляет визуальный переход между кадрами, затем использует [модуль Speedline Node.js](https://github.com/paulirish/speedline) для расчета индекса скорости.

{% Aside %} Speedline основан на тех же принципах, что и [исходный индекс скорости, представленный WebpageTest.org](https://github.com/WPO-Foundation/webpagetest-docs/blob/master/user/Metrics/SpeedIndex.md). {% endAside %}

## Как Lighthouse оценивает ваш индекс скорости

Оценка вашего индекса скорости — это сравнение индекса скорости вашей страницы и индексов скорости реальных веб-сайтов на основе [данных из HTTP-архива](https://bigquery.cloud.google.com/table/httparchive:lighthouse.2019_03_01_mobile?pli=1).

В этой таблице показано, как интерпретировать оценку индекса скорости:

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Индекс скорости<br> (в секундах)</th>
        <th>Цветовой код</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–3.4</td>
        <td>Зеленый (быстро)</td>
      </tr>
      <tr>
        <td>3.4–5.8</td>
        <td>Оранжевый (средне)</td>
      </tr>
      <tr>
        <td>Более 5,8</td>
        <td>Красный (медленно)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Как улучшить свой индекс скорости

Все, что вы делаете для повышения скорости загрузки страницы, улучшит вашу оценку индекса скорости, но решение проблем, обнаруженных в ходе этих диагностических аудитов, должно повлиять на нее особенно сильно:

- [Минимизация работы основного потока](/mainthread-work-breakdown)
- [Уменьшение времени выполнения JavaScript](/bootup-time)
- [Убедитесь, что текст остается видимым во время загрузки веб-шрифта](/font-display)

{% include 'content/lighthouse-performance/improve.njk' %}

## Ресурсы

- [Исходный код для аудита **индекса скорости**](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/speed-index.js)
- [Руководство по оценкам Lighthouse v3](/performance-scoring)
- [Speedline](https://github.com/paulirish/speedline)
- [Индекс скорости WebPagetest](https://github.com/WPO-Foundation/webpagetest-docs/blob/main/src/metrics/SpeedIndex.md)
