---
layout: post
title: Первая отрисовка контента (FCP)
authors:
  - philipwalton
date: 2019-11-07
updated: 2022-10-19
description: В этой статье описывается метрика FCP (Первая отрисовка контента) и объясняются принципы ее измерения
tags:
  - performance
  - metrics
---

{% Aside %} Первая отрисовка контента (FCP) важная, ориентированная на пользователя метрика для измерения [воспринимаемой скорости загрузки,](/user-centric-performance-metrics/#types-of-metrics) так как она отмечает первую точку на временной шкале загрузки страницы, где пользователь может видеть появление контента на экране. Низкий показатель FCP убеждает пользователя в том, что загрузка [началась](/user-centric-performance-metrics/#questions). {% endAside %}

## Что такое FCP?

Метрика FCP (Первая отрисовка контента) измеряет время с момента начала загрузки страницы до момента, когда какая-либо часть содержимого страницы отобразится на экране. Под «содержимым» в этой метрике понимается текст, изображения (включая фоновые изображения), `<svg>` или небелые элементы `<canvas>`.

{% Img src="image/admin/3UhlOxRc0j8Vc4DGd4dt.png", alt="Временная шкала FCP с google.com", width="800", height="311", linkTo=true %}

На приведенной выше временной шкале загрузки FCP происходит во втором фрейме, так как именно тогда первые элементы изображения и текст отображаются на экране.

Заметно, что хотя некоторая часть контента была отрисована, но не вся. Это важное различие между *Первой* отрисовкой контента(FCP) и *[Скоростью загрузки основного контента (LCP)](/lcp/)*, цель метрики LCPизмерить время загрузки основного контента.

<picture>
    <source srcset="{{ "image/eqprBhZUGfb8WYnumQ9ljAxRrA72/V1mtKJenViYAhn05WxqR.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
    {% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/vQKpz0S2SGnnoXHMDidj.svg", alt="Хорошие значения FCP не более 1,8 секунды, низкие значения больше 3,0 секунд, и все, что находится между ними, требует улучшения", width="400", height="300" %}
</picture>

### Какое значение показателя FCP можно считать хорошим?

Для обеспечения удобства работы пользователей сайты должны стремиться к тому, чтобы время до первой отрисовки контента составляло **1,8 секунды** или меньше. Чтобы убедиться, что вы достигли этой цели для большинства пользователей, рекомендуется в качестве порогового значения использовать **75-й процентиль** загрузки страниц, сегментированный по мобильным и настольным устройствам.

## Как измерить FCP

FCP можно измерить в [лабораторных](/user-centric-performance-metrics/#in-the-lab) или [полевых условиях](/user-centric-performance-metrics/#in-the-field) с помощью следующих инструментов:

### Инструменты для измерения в полевых условиях

- [PageSpeed Insights](https://pagespeed.web.dev/)
- Отчет [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
- [Search Console (отчет о скорости загрузки)](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html)
- [JavaScript-библиотека `web-vitals`](https://github.com/GoogleChrome/web-vitals)

### Инструменты для измерения в лабораторных условиях

- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Измерение FCP в JavaScript

{% BrowserCompat 'api.PerformancePaintTiming' %}

Чтобы измерить FCP в JavaScript, можно воспользоваться [Paint Timing API](https://w3c.github.io/paint-timing/). В следующем примере показано, как создать [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver), который прослушивает записи `paint` с именем `first-contentful-paint` и регистрирует их в консоли.

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
    console.log('FCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'paint', buffered: true});
```

{% Aside 'warning' %}

Этот код показывает, как регистрировать в консоли записи `first-contentful-paint`, но само измерение FCP в JavaScript сложнее. Подробнее см. ниже:

{% endAside %}

В приведенном выше примере зарегистрированная запись `first-contentful-paint` сообщит, когда был отрисован первый элемент контента. Однако в некоторых случаях эта запись недействительна для измерения FCP.

Далее приведем различия между тем, что сообщает API, и тем, как рассчитывается метрика.

#### Различия между метрикой и API

- API отправит запись `first-contentful-paint` для страниц, загруженных в фоновых вкладках, но эти страницы следует игнорировать при вычислении FCP (время первой отрисовки нужно учитывать только в том случае, если страница всё время находилась на переднем плане).
- API не сообщает о записях `first-contentful-paint`, когда страницы восстанавливаются функцией [back/forward cache](/bfcache/#impact-on-core-web-vitals), но в данных случаях следует измерять FCP, поскольку пользователи воспринимают такие посещения страниц как отдельные.
- API [может не сообщать о времени отрисовки из iframe с перекрестным происхождением](https://w3c.github.io/paint-timing/#:~:text=cross-origin%20iframes), но для правильного измерения FCP следует учитывать все фреймы. Подфреймы могут использовать API, чтобы сообщать о времени отрисовки в родительский фрейм для агрегирования.

Чтобы не запоминать все эти тонкости, разработчики могут использовать для измерения FCP [JavaScript-библиотеку `web-vitals`](https://github.com/GoogleChrome/web-vitals), которая обрабатывает эти случаи (где это возможно):

```js
import {onFCP} from 'web-vitals';

// Measure and log FCP as soon as it's available.
onFCP(console.log);
```

Полный пример измерения FCP в JavaScript приводится в [исходном коде `onFCP()`](https://github.com/GoogleChrome/web-vitals/blob/main/src/onFCP.ts).

{% Aside %} В некоторых случаях (например, в iframe с перекрестным происхождением) невозможно измерить FCP в JavaScript. См. подробности в разделе [«Ограничения»](https://github.com/GoogleChrome/web-vitals#limitations) библиотеки `web-vitals`. {% endAside %}

## Как улучшить показатель FCP

Чтобы узнать, как улучшить FCP для конкретного сайта, можно запустить проверку производительности с помощью Lighthouse и обратить внимание на любые конкретные [возможности улучшения](https://developer.chrome.com/docs/lighthouse/performance/#opportunities) или [диагностики](https://developer.chrome.com/docs/lighthouse/performance/#diagnostics), предлагаемые проверкой.

Чтобы узнать, как улучшить FCP в целом (для любого сайта), обратитесь к следующим руководствам по производительности:

- [Устранение ресурсов, блокирующих рендеринг](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources/)
- [Минимизация CSS-кода](https://developer.chrome.com/docs/lighthouse/performance/unminified-css/)
- [Удаление неиспользуемого CSS-кода](https://developer.chrome.com/docs/lighthouse/performance/unused-css-rules/)
- [Предварительное подключение к нужным источникам](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preconnect/)
- [Уменьшение времени ответа сервера (TTFB)](/ttfb/)
- [Уход от переадресации нескольких страниц](https://developer.chrome.com/docs/lighthouse/performance/redirects/)
- [Предварительная загрузка ключевых запросов](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preload/)
- [Уход от огромных нагрузок на сеть](https://developer.chrome.com/docs/lighthouse/performance/total-byte-weight/)
- [Обслуживание статических объектов сайта с помощью эффективной политики кеширования](https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl/)
- [Уход от чрезмерного размера DOM](https://developer.chrome.com/docs/lighthouse/performance/dom-size/)
- [Минимизация глубины вложенности критических запросов](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/)
- [Настройка показа текста во время загрузки веб-шрифтов](https://developer.chrome.com/docs/lighthouse/performance/font-display/)
- [Поддержание малого количества запросов и объемов передаваемых данных](https://developer.chrome.com/docs/lighthouse/performance/resource-summary/)

{% include 'content/metrics/metrics-changelog.njk' %}
