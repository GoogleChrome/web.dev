---
layout: post
title: Оценка производительности в Lighthouse
description: Узнайте, как Lighthouse оценивает общую производительность вашей страницы.
subhead: Как Lighthouse оценивает общую производительность страницы
date: 2019-09-19
updated: 2021-06-04
---

В целом, только [метрики](/lighthouse-performance/#metrics) влияют на оценку производительности в Lighthouse, а не результаты из разделов Opportunities (Возможности) или Diagnostics (Диагностика). Однако работа с этими разделами, вероятно, улучшит значения метрик, поэтому существует косвенная связь.

Ниже мы описали, почему оценка может меняться, как она формируется, и как Lighthouse оценивает каждую отдельную метрику.

## Почему оценка меняется {: #fluctuations}

Большая часть изменений в общей оценке производительности и значениях метрик не связана с Lighthouse. Если оценка производительности меняется, это обычно связано с изменениями в основных условиях. Типичные причины:

- A/B-тесты или изменения в показываемой рекламе.
- Изменения в маршрутизации интернет-трафика.
- Тестирование на разных устройствах, например, на высокопроизводительном настольном компьютере и низкопроизводительном ноутбуке.
- Расширения браузера, которые внедряют JavaScript и добавляют/изменяют сетевые запросы.
- Антивирусное программное обеспечение.

Эта проблема более подробно рассмотрена в [документации Lighthouse по изменчивости оценки](https://github.com/GoogleChrome/lighthouse/blob/master/docs/variability.md).

Более того, даже если Lighthouse может предоставить вам единую общую оценку производительности, более полезно рассматривать производительность сайта как распределение оценок, а не как единое число. Ознакомьтесь с вводной статьей [«Ориентированные на пользователя показатели производительности»](/user-centric-performance-metrics/), чтобы понять причины такого подхода.

## Как рассчитывается средневзвешенная оценка производительности {: #weightings}

Оценка производительности — это [средневзвешенная](https://www.wikihow.com/Calculate-Weighted-Average#Weighted_Averages_without_Percentages_sub) *оценка метрик*. Естественно, метрики с большим весом оказывают большее влияние на общую оценку производительности. Оценки метрик не видны в отчете.

{% Aside %} Весовые коэффициенты выбраны, чтобы обеспечить сбалансированное представление о восприятии пользователем производительности. Веса со временем менялись, потому что команда Lighthouse регулярно проводит исследования и собирает отзывы, чтобы понять, что больше всего влияет на воспринимаемую пользователем производительность. {% endAside %}

<figure>
  <p data-md-type="paragraph"><a href="https://googlechrome.github.io/lighthouse/scorecalc/">{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rLftIdSA8JJYruHOHrOn.png", alt = "Веб-приложение для подсчета оценки Lighthouse", width = "600", height = "414"%}</a></p>
  <figcaption>Ознакомьтесь с системой подсчета оценки с помощью <a href="https://googlechrome.github.io/lighthouse/scorecalc/">Lighthouse scoring calculator</a></figcaption></figure>

### Lighthouse 8

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Проверка</th>
        <th>Вес</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">Первая отрисовка контента (FCP)</a></td>
        <td>10%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Индекс скорости</a></td>
        <td>10%</td>
      </tr>
      <tr>
        <td><a href="/lcp/">Скорость загрузки основного контента (LCP)</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Время до интерактивности (TTI)</a></td>
        <td>10%</td>
      </tr>
      <tr>
        <td><a href="/lighthouse-total-blocking-time/">Общее время блокировки (TBT)</a></td>
        <td>30%</td>
      </tr>
      <tr>
        <td><a href="/cls/">Совокупное смещение макета (CLS)</a></td>
        <td>15%</td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 6

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Проверка</th>
        <th>Вес</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">Первая отрисовка контента (FCP)</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Индекс скорости</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/lcp/">Скорость загрузки основного контента (LCP)</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Время до интерактивности (TTI)</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/lighthouse-total-blocking-time/">Общее время блокировки (TBT)</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/cls/">Совокупное смещение макета (CLS)</a></td>
        <td>5%</td>
      </tr>
    </tbody>
  </table>
</div>

### Как определяются оценки метрик {: #metric-scores}

После того как Lighthouse завершит сбор значений метрик производительности (в большинстве случаев значения измеряются в миллисекундах), он преобразует каждое необработанное значение метрики в оценку метрики от 0 до 100, изучив, куда попадает значение метрики в распределении оценок Lighthouse. Распределение оценок — это логарифмическое нормальное распределение, полученное на основе метрик производительности реального веб-сайта из [Интернет-архива](https://httparchive.org/).

Например, LCP (Скорость загрузки основного контента) измеряет время до отображения основного контента для пользователя. Значение метрики LCP представляет собой временной промежуток между началом загрузки страницы и появлением основного контента. По данным реальной статистики, сайты с наилучшими показателями отображают LCP примерно за 1220 мс, поэтому это значение метрики соответствует оценке 99.

Если немного углубиться в тему, модель кривой подсчета оценки Lighthouse использует данные Интернет-архива для определения двух контрольных точек, которые затем задают форму кривой [логарифмического нормального распределения](https://en.wikipedia.org/wiki/Weber%E2%80%93Fechner_law). 25-й процентиль данных Интернет-архива становится оценкой 50 (медианная контрольная точка), а 8-й процентиль становится оценкой 90 (хорошая/зеленая контрольная точка). Изучая приведенный ниже график кривой оценки, обратите внимание, что между 0,50 и 0,92 существует почти линейная зависимость между значением метрики и оценкой. Примерно 0,96 — это «точка падения эффективности», поскольку выше нее кривая уходит в сторону, требуя всё большего улучшения метрики для повышения и без того высокого балла.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/y321cWrLLbuY4SHlvYCc.png", alt="Изображение кривой оценки для TTI", width="600", height="329" %} <figcaption> <a href="https://www.desmos.com/calculator/o98tbeyt1t">Ознакомьтесь с кривой оценки TTI</a>. </figcaption></figure>

### Как сравниваются компьютеры и мобильные устройства {: #desktop}

Как упоминалось выше, кривые оценки определяются на основе реальных данных о производительности. До Lighthouse версии 6 все кривые оценки основывались на данных о производительности мобильных устройств, однако для настольных компьютеров  Lighthouse использовал именно эти данные. На практике это приводило к искусственно завышенным показателям у настольных компьютеров. Lighthouse версии 6 исправил эту ошибку, используя специальные показатели для компьютеров. Скорее всего, любые оценки производительности сайтов для настольных компьютеров при переходе с 5-й на 6-ю версию  будут значительно отличаться.

### Цветовая кодировка оценок {: #color-coding}

Оценки метрик и производительности окрашиваются в соответствии с этими диапазонами:

- От 0 до 49 (красный): плохо.
- От 50 до 89 (оранжевый): требуется улучшение.
- От 90 до 100 (зеленый): хорошо.

Чтобы обеспечить удобство работы пользователей, сайты должны стремиться к хорошей оценке (90–100). «Отличную» оценку, равную 100, крайне сложно получить, но никто от вас этого и не ждет. Например, для того, чтобы получить оценку от 99 до 100, потребуется примерно такое же улучшение метрик, как от 90 до 94.

### Что могут сделать разработчики, чтобы улучшить оценку производительности?

Во-первых, используйте [Lighthouse scoring calculator](https://googlechrome.github.io/lighthouse/scorecalc/), чтобы понять, к каким пороговым значениям вам следует стремиться для достижения определенной оценки производительности Lighthouse.

В отчете Lighthouse в разделе **Opportunities** есть подробные предложения и документация по их реализации. Кроме того, в разделе **Diagnostics** перечислены дополнительные рекомендации, которые разработчики могут изучить для дальнейшего повышения производительности.

<!--
We don't think users care about the historical scoring rubrics, but we'd still prefer to keep them around because X
## Historical versions

### Lighthouse 5

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>20%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>27%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>7%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>33%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
        <td>13%</td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 3 and 4

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>23%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>27%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>7%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>33%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 2

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>6%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>6%</td>
      </tr>
      <tr>
        <td><a href="/first-meaningful-paint/">First Meaningful Paint</a></td>
        <td>29%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>29%</td>
      </tr>
      <tr>
        <td><a href="/first-cpu-idle/">First CPU Idle</a></td>
        <td>29%</td>
      </tr>
    </tbody>
  </table>
</div>

-->
