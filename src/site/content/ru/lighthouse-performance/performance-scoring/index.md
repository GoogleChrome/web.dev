---
layout: post
title: Расчет оценки производительности Lighthouse
description: |
  Узнайте, как Lighthouse определяет общую оценку производительности для вашей страницы.
subhead: Как Lighthouse рассчитывает общую оценку производительности
date: 2019-09-19
updated: 2021-06-04
---

Как правило, на оценку производительности Lighthouse влияют только [метрики](/lighthouse-performance/#metrics), а не результаты разделов Возможности или Диагностика.
Тем не менее, улучшение разделов Возможности и Диагностика, вероятно, улучшит значение метрик, так что косвенная зависимость между ними есть.

Ниже мы объяснили, почему оценка может колебаться, из чего она состоит, и как Lighthouse оценивает каждую отдельную метрику.

## Почему оценка колеблется {: #fluctuations }

Значительная часть колебаний общей оценки производительности и значений метрик не связана с Lighthouse. Колебания вашей оценки производительности обычно происходят из-за изменений определяющих условий. Общие
проблемы включают:

* A/B тесты или изменения в показываемой рекламе
* Изменения в маршрутизации интернет трафика
* Тестирование на разных устройствах, таких, например, как высокопроизводительный десктопный компьютер и низкопроизводительный ноутбук
* Расширения браузера, которые встраиваются в JavaScript и добавляют/изменяют сетевые запросы
* Антивирусные программы

[Данный раздел документации Lighthouse](https://github.com/GoogleChrome/lighthouse/blob/master/docs/variability.md) освещает это более подробно.

Более того, даже если Lighthouse может предоставить вам единую общую оценку производительности, более полезно
может быть рассматривать производительность вашего сайта как распределение оценок, а не как общее число.
См. Введение в [Метрики производительности, ориентированные на пользователя](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics),
чтобы понять почему.

## Как рассчитывается оценка производительности {: #weightings }

Оценка производительности представляет собой [средневзвешенное](https://www.wikihow.com/Calculate-Weighted-Average#Weighted_Averages_without_Percentages_sub) от _значений метрик_. Естественно, что более весомые метрики сильнее влияют на общую оценку производительности.
Значения метрик не отображаются в отчете, но рассчитываются скрытым образом.

{% Aside %}
  Веса выбраны, чтобы обеспечить сбалансированное представление воспринимаемой пользователем производительности. Веса со временем менялись, потому что команда Lighthouse регулярно
  проводит исследования и собирает фидбэк, чтобы понять, что оказывает наибольшее влияние на производительность,
  воспринимаемую пользователем.
{% endAside %}

<figure class="w-figure">
  <a href="https://googlechrome.github.io/lighthouse/scorecalc/">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rLftIdSA8JJYruHOHrOn.png", alt="Lighthouse scoring calculator webapp", width="600", height="414" %}
  </a>
  <figcaption class="w-figcaption">
    Исследуйте, как рассчиьывается оценка производительности с помощью <a href="https://googlechrome.github.io/lighthouse/scorecalc/">калькулятора Lighthouse</a>
  </figcaption>
</figure>

### Lighthouse 8

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Аудит</th>
        <th>Вес</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>10%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>10%</td>
      </tr>
      <tr>
        <td><a href="/lcp/">Largest Contentful Paint</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>10%</td>
      </tr>
      <tr>
        <td><a href="/lighthouse-total-blocking-time/">Total Blocking Time</a></td>
        <td>30%</td>
      </tr>
      <tr>
        <td><a href="/cls/">Cumulative Layout Shift</a></td>
        <td>15%</td>
      </tr>
    </tbody>
  </table>
</div>

### Lighthouse 6

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Аудит</th>
        <th>Вес</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/first-contentful-paint/">First Contentful Paint</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/speed-index/">Speed Index</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/lcp/">Largest Contentful Paint</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/interactive/">Time to Interactive</a></td>
        <td>15%</td>
      </tr>
      <tr>
        <td><a href="/lighthouse-total-blocking-time/">Total Blocking Time</a></td>
        <td>25%</td>
      </tr>
      <tr>
        <td><a href="/cls/">Cumulative Layout Shift</a></td>
        <td>5%</td>
      </tr>
    </tbody>
  </table>
</div>

### Как определяются значения метрик {: #metric-scores }

После того, как Lighthouse завершит сбор показателей производительности (в основном, в миллисекундах), он преобразует каждое необработанное значение метрики в оценку от 0 до 100, в зависимости от того, куда значение метрики попадает в распределение оценок Lighthouse. Это распределение представляет собой
нормальное логарифмическое распределение, полученное на основе реальных показателей производительности из [HTTP Archive](https://httparchive.org/).

Например, Largest Contentful Paint (LCP) измеряет, в какой момент пользователь начинает воспринимать, что наибольшая часть контента отрисована. Значение метрики для LCP показывает промежуток времени между
моментом, когда пользователь инициировал загрузку страницы, и моментом, когда отрендерилась основная часть контента страницы. Основываясь на реальных
данных сайтов, наилучшие по производительности сайты рендерят LCP примерно за 1,220мс, так что такое значение метрики ставится в соответствие с оценкой 99.

Если пойти немного глубже, модель подсчета баллов Lighthouse использует данные из HTTPArchive, чтобы определить 2 контрольные точки, которые задают форму кривой [логнормального распределения](https://en.wikipedia.org/wiki/Weber%E2%80%93Fechner_law). 25-й процентиль данных HTTPArchive ставится в соответствие оценке 50 (средняя контрольная точка), а 8-й процентиль - оценке 90 (хорошая/зеленая контрольная точка). Изучая приведенный ниже график кривой оценки, обратите внимание, что между 0,50 и 0,92 существует почти линейная зависимость между значением метрики и оценкой. Примерно 0,96 - это «точка убывающей отдачи», так как над ней кривая уходит в сторону, требуя все большего улучшения метрик для улучшения и без того высокого балла.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/y321cWrLLbuY4SHlvYCc.png", alt="Image of the scoring curve for TTI", width="600", height="329" %}
  <figcaption class="w-figcaption">
    <a href="https://www.desmos.com/calculator/o98tbeyt1t">Изучите кривую оценки для TTI</a>.
  </figcaption>
</figure>


### Различия в обработке для десктопных и мобильных устройств {: #desktop }

Как упоминалось выше, кривые оценки рассчитываются на основе реальных данных о производительности. До Lighthouse v6 все кривые оценки базировались на основании данных о производительности на мобильных устройствах, однако в случае запусков Lighthouse на десктопе использовались те же данные. На практике это приводило к тому, что оценка для десктопа искусственно завышалась. В Lighthouse v6 этот баг пофиксили с помощью отдельной системы оценок для десктопа. Хотя вы, безусловно, можете ожидать общих изменений вашей производительности с 5 до 6, любые оценки для десктопа будут значительно отличаться.

### Как оценки обозначаются цветом {: #color-coding }

Значения метрик и оценки производительности окрашены в соответствии с этими диапазонами:

* 0 to 49 (красный): Плохо
* 50 to 89 (оранжевый): Нуждается в улучшении
* 90 to 100 (зеленый): Хорошо

Чтобы обеспечить удобство работы пользователей, сайты должны стремиться иметь хорошие баллы (90–100). "Идеальную оценку" в 100 баллов получить крайне сложно, и это и не ожидается. Например, для того, чтобы получить оценку от 99 до 100, потребуется примерно такое же улучшение показателей, как и для оценки от 90 до 94.

### Что могут сделать разработчики для улучшения оценки производительности?

Во-первых, используйте [Калькулятор Lighthouse для рассчета оценки](https://googlechrome.github.io/lighthouse/scorecalc/), чтобы понять, к каким пороговым значениям вам нужно стремиться для достижения конкретной оценки Lighthouse.

В отчете Lighthouse в разделе **Возможности** есть подробные предложения и документация по их реализации. Кроме того, в разделе **Диагностика** приведены дополнительные рекомендации, которые разработчики могут изучить для дальнейшего улучшения своей производительности.

<!--
Мы не думаем, что пользователей волнуют исторические рубрики оценки, но мы все же предпочли бы оставить их
## Исторические версии

### Lighthouse 5

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Аудит</th>
        <th>Вес</th>
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

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Аудит</th>
        <th>Вес</th>
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

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Аудит</th>
        <th>Вес</th>
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
