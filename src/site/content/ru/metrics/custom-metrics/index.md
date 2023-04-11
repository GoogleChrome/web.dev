---
layout: post
title: Пользовательские метрики
authors:
  - philipwalton
date: 2019-11-08
description: |2-

  Пользовательские метрики позволяют измерять и оптимизировать характерные аспекты работы с вашим сайтом.
tags:
  - performance
  - metrics
---

Наличие [ориентированных на пользователя показателей](/user-centric-performance-metrics/), которые вы можете измерить на любом веб-сайте, имеет большое значение. Эти показатели позволяют:

- Понять, как реальные пользователи воспринимают Интернет в целом
- Легко сравнить ваш сайт с сайтом конкурентов
- Отслеживать полезные данные при помощи ваших аналитических инструментов без необходимости писать собственный код.

Универсальные метрики дают неплохое общее представление, но во многих случаях для полного понимания того, как работает ваш сайт, измерения одних этих показателей недостаточно и требуется отслеживать *больше*.

Пользовательские метрики позволяют измерять аспекты взаимодействия, которые относятся только к вашему сайту, например:

- Сколько времени требуется одностраничному приложению (SPA), чтобы перейти с одной "страницы" на другую
- Сколько времени требуется, чтобы страница отображала данные, полученные из базы данных, для вошедших в систему пользователей
- Сколько времени требуется для [гидратации](https://addyosmani.com/blog/rehydration/) приложения с рендерингом на стороне сервера (SSR)
- Частота попаданий в кеш для ресурсов, загруженных вернувшимися посетителями
- Задержка события нажатия мыши или клавиатуры в игре

## API для измерения пользовательских метрик

Поначалу у веб-разработчиков не было большого количества низкоуровневых API-интерфейсов для измерения производительности, и в результате им приходилось использовать различные костыли, чтобы проверить, хорошо ли работает сайт.

Например, можно определить, заблокирован ли основной поток из-за длительных задач JavaScript, запустив `requestAnimationFrame` и вычислив дельту между каждым кадром. Если дельта значительно больше, чем частота смены кадров дисплея, такую задачу можно считать длительной. Однако использовать такие приемы не рекомендуется, потому что они сами по себе влияют на производительность (например, разряжают батарею).

Первое правило эффективного измерения производительности — убедиться, что ваши методы измерения сами по себе не вызывают проблем с производительностью. Поэтому для любых пользовательских метрик, которые вы измеряете на своем сайте, по возможности стоит использовать один из следующих API.

### Performance Observer

Понимание API PerformanceObserver критически важно для создания пользовательских показателей производительности, поскольку это механизм, с помощью которого вы получаете данные из всех других API производительности, обсуждаемых в этой статье.

С помощью `PerformanceObserver` можно пассивно подписаться на события, связанные с производительностью. Это означает, что эти API-интерфейсы, как правило, не будут влиять на производительность страницы, поскольку их обратные вызовы обычно запускаются во время [периодов простоя](https://w3c.github.io/requestidlecallback/#idle-periods).

`PerformanceObserver` создается при помощи передачи ему обратного вызова, который будет запускаться всякий раз, когда отправляются новые записи производительности. Затем нужно сообщить объекту-наблюдателю, какие типы записей следует прослушивать, с помощью метода [`observe()`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver/observe):

```js
// Отлавливаем ошибки, выдаваемые некоторыми браузерами при использовании новой опции `type`.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Заносим запись и все связанные с ней детали в журнал.
      console.log(entry.toJSON());
    }
  });

  po.observe({type: 'some-entry-type'});
} catch (e) {
  // Если браузер не поддерживает этот API, ничего не делаем.
}
```

В разделах ниже перечислены все различные типы записей, доступные для наблюдения, но в новых браузерах можно проверить, какие типы записей доступны через статическое свойство [`PerformanceObserver.supportedEntryTypes`](https://w3c.github.io/performance-timeline/#supportedentrytypes-attribute).

{% Aside %} Объект, переданный методу `observe()`, также может задавать массив `entryTypes` (для наблюдения за более чем одним типом записи с помощью одного и того же объект-наблюдателя). Указание `entryTypes` — более старый вариант с более широкой поддержкой браузеров, но сейчас предпочтительно использовать `type`, поскольку эта опция позволяет указать дополнительную конфигурацию наблюдения, зависящую от записи (например, метку `buffered`, описанную далее). {% endAside %}

#### Наблюдение за уже введенными записями

По умолчанию объекты `PerformanceObserver` могут только наблюдать за записями по мере их появления. Это может вызывать трудности, если вы собираетесь загружать код аналитики производительности с отсрочкой (чтобы не блокировать ресурсы с более высоким приоритетом).

Чтобы получить предыдущие записи (после того, как они были введены), присвойте метке `buffered` значение `true` при вызове `observe()`. Браузер будет включать предыдущие записи из своего [буфера записей производительности](https://w3c.github.io/performance-timeline/#dfn-performance-entry-buffer) при первом обращении к обратному вызову `PerformanceObserver`.

```js
po.observe({
  type: 'some-entry-type',
  buffered: true,
});
```

{% Aside %} Во избежание проблем с памятью буфер записей производительности ограничен. Для большинства типичных загрузок страниц маловероятно, что буфер заполнится и записи будут пропущены. {% endAside %}

#### Устаревшие API производительности, которых следует избегать

До появления Performance Observer API разработчики могли обращаться к записям производительности с помощью следующих трех методов, определенных для объекта [`performance`](https://w3c.github.io/performance-timeline/):

- [`getEntries()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntries)
- [`getEntriesByName()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByName)
- [`getEntriesByType()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByType)

Хотя эти API-интерфейсы все еще поддерживаются, их использование не рекомендуется, поскольку они не позволяют отслеживать, когда создаются новые записи. Кроме того, многие новые API-интерфейсы (например, Long Tasks) не предоставляются через объект `performance`, они доступны только через `PerformanceObserver`.

Если вам непосредственно не нужна совместимость с Internet Explorer, лучше избегать использования этих методов в коде и в дальнейшем использовать `PerformanceObserver`.

### User Timing API

[User Timing API](https://w3c.github.io/user-timing/) — это универсальный API для измерения хронологических показателей. Он позволяет произвольно отмечать точки во времени, а затем измерять продолжительность между этими отметками.

```js
// Отмечаем время прямо перед запуском задачи.
performance.mark('myTask:start');
await doMyTask();
// Отмечаем время сразу после завершения задачи.
performance.mark('myTask:end');

// Замеряем дельту между началом и завершением задачи
performance.measure('myTask', 'myTask:start', 'myTask:end');
```

Хотя такие API-интерфейсы, как `Date.now()` или `performance.now()`, предоставляют аналогичные возможности, преимущество использования User Timing API заключается в том, что он хорошо интегрируется с инструментами для повышения производительности. Например, Chrome DevTools визуализирует [измерения User Timing на панели «Производительность»](https://developers.google.com/web/updates/2018/04/devtools#tabs), и многие поставщики аналитических услуг также автоматически отслеживают любые выполняемые измерения и отправляют данные о продолжительности на свой сервер аналитики.

Чтобы получить статистику измерений User Timing, можно использовать [PerformanceObserver](#performance-observer), зарегистрировав его для наблюдения за записями типа `measure`:

```js
// Отлавливаем ошибки, выдаваемые некоторыми браузерами при использовании новой опции `type`.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Создаем объект performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Заносим запись и все связанные с ней детали в журнал.
      console.log(entry.toJSON());
    }
  });
  // Начинаем отслеживать посылаемые записи `measure`.
  po.observe({type: 'measure', buffered: true});
} catch (e) {
  // Если браузер не поддерживает этот API, ничего не делаем.
}
```

### Long Tasks API

[Long Tasks API](https://w3c.github.io/longtasks/) предназначен для выявления тех моментов, когда блокировка основного потока браузера длится настолько долго, что это влияет на частоту смены кадров или задержку ввода. В настоящее время API сообщает о любых задачах, которые выполняются дольше 50 миллисекунд (мс).

Каждый раз, когда вам нужно запустить ресурсоемкий код или загрузить и выполнить большие скрипты, полезно отслеживать, заблокировал ли этот код основной поток. Фактически, многие высокоуровневые метрики построены на основе самого Long Tasks API (например, [Time to Interactive (TTI)](/tti/) и [Total Blocking Time (TBT)](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/)).

Чтобы определить, когда возникают длительные задачи, можно использовать [PerformanceObserver](https://developer.mozilla.org/docs/Web/API/PerformanceObserver), зарегистрировав его для наблюдения за записями типа `longtask`:

```js
// Отлавливаем ошибки, выдаваемые некоторыми браузерами при использовании новой опции `type`.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Создаем объект performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Заносим запись и все связанные с ней детали в журнал.
      console.log(entry.toJSON());
    }
  });
  // Начинаем отслеживать посылаемые записи `longtask`.
  po.observe({type: 'longtask', buffered: true});
} catch (e) {
  // Если браузер не поддерживает этот API, ничего не делаем.
}
```

### Element Timing API

Метрика [Largest Contentful Paint (LCP)](/lcp/) предназначена для определения того, когда на экране было отрисовано самое большое изображение или текстовый блок, но в некоторых случаях требуется измерить время визуализации другого элемента.

В этих случаях можно использовать [Element Timing API](https://wicg.github.io/element-timing/). Фактически, Largest Contentful Paint API реализован как надстройка над Element Timing API и добавляет автоматические отчеты о самом большом осмысленном элементе, но вы можете получить отчет о дополнительных элементах, добавив в явном виде атрибут `elementtiming` и зарегистрировав PerformanceObserver для наблюдения записей типа element.

```html
<img elementtiming="hero-image" />
<p elementtiming="important-paragraph">Текст, который нас интересует.</p>
...
<script>
// Отлавливаем ошибки, выдаваемые некоторыми браузерами при использовании новой опции `type`.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Создаем объект performance observer.
  const po = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      // Заносим запись и все связанные с ней детали в журнал.
      console.log(entry.toJSON());
    }
  });
  // Начинаем отслеживать посылаемые записи `element`.
  po.observe({type: 'element', buffered: true});
} catch (e) {
  // Если браузер не поддерживает этот API, ничего не делаем.
}
</script>
```

{% Aside 'gotchas' %} Типы элементов, рассматриваемых для Largest Contentful Paint, аналогичны тем, которые наблюдаются через Element Timing API. Если добавить атрибут `elementtiming` к элементу, который не относится к одному из этих типов, атрибут будет проигнорирован. {% endAside %}

### Event Timing API

Метрика [First Input Delay (FID)](/fid/) измеряет время с момента первого взаимодействия пользователя со страницей до момента, когда браузер может фактически начать выполнять обработчики событий в ответ на это взаимодействие. Однако в некоторых случаях может быть полезно измерить само время обработки события, а также время до следующего кадра, который может быть визуализирован.

Это возможно с помощью [Event Timing API](https://wicg.github.io/event-timing/) (который используется для измерения FID), поскольку он предоставляет ряд временных меток в жизненном цикле события, в том числе:

- [`startTime`](https://w3c.github.io/performance-timeline/#dom-performanceentry-starttime): время, когда браузер получает событие.
- [`processingStart`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingstart): время, когда браузер может начать выполнение обработчиков событий для события.
- [`processingEnd`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingend): время, когда браузер завершает выполнение всего синхронного кода, инициированного обработчиками событий для этого события.
- [`duration`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingstart): время (округленное до 8 мс по соображениям безопасности) между получением события браузером и готовностью к отрисовке следующего кадра после завершения выполнения всего синхронного кода, инициированного обработчиками событий.

В следующем примере показано, как использовать эти значения для создания пользовательских измерений:

```js
// Отлавливаем ошибки, выдаваемые некоторыми браузерами при использовании новой опции `type`.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  const po = new PerformanceObserver((entryList) => {
    const firstInput = entryList.getEntries()[0];

    // Измеряем First Input Delay (FID).
    const firstInputDelay = firstInput.processingStart - firstInput.startTime;

    // Измеряем время, необходимое для запуска всех обработчиков событий
    // Примечание: сюда не входит асинхронно выполняемая работа с использованием
    // методов типа `requestAnimationFrame()` или `setTimeout()`.
    const firstInputProcessingTime = firstInput.processingEnd - firstInput.processingStart;

    // Измеряем полную длительность события от получения ввода
    // браузером до готовности к отрисовке следующего кадра
    // после выполнения всех обработчиков событий.
    // Примечание: как и выше, сюда не входит асинхронно выполняемая работа
    //  с использованием методов `requestAnimationFrame()` или `setTimeout()`.
    // Также по соображениям безопасности значение округляется до 8мс.
    const firstInputDuration = firstInput.duration;

    // Заносим эти значения в консоль.
    console.log({
      firstInputDelay,
      firstInputProcessingTime,
      firstInputDuration,
    });
  });

  po.observe({type: 'first-input', buffered: true});
} catch (error) {
  // Если браузер не поддерживает этот API, ничего не делаем.
}
```

### Resource Timing API

[Resource Timing API](https://w3c.github.io/resource-timing/) дает разработчикам подробную информацию о том, как были загружены ресурсы для конкретной страницы. Несмотря на название API, информация, которую он предоставляет, не ограничивается только данными о времени (хотя их [много](https://w3c.github.io/resource-timing/#processing-model)). Другие данные, к которым вы можете получить доступ, включают:

- [initiatorType](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-initiatortype): способ получения ресурса: например, из тегов `<script>` или `<link>`, или из метода `fetch()`
- [nextHopProtocol](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-nexthopprotocol): протокол, используемый для получения ресурса, например, `h2` или `quic`
- [encodedBodySize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-encodedbodysize)/[decodedBodySize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-decodedbodysize): размер ресурса в его закодированной или декодированной форме соответственно
- [transferSize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-transfersize): размер ресурса, который был фактически передан по сети. Когда ресурсы получены из кеша, это значение может быть намного меньше, чем `encodedBodySize`, а в некоторых случаях может равняться нулю (если не требуется повторная валидация кеша)

Обратите внимание: вы можете использовать свойство `transferSize` записей хронологии ресурсов для вычисления метрики *скорости попадания в кеш* или, возможно, даже метрики *общего размера кешированного ресурса*. Это может быть полезно для понимания того, как ваша стратегия кеширования ресурсов влияет на производительность для повторных посетителей.

В следующем примере регистрируются все ресурсы, запрошенные страницей, и для каждого из них указывается, был ли он получен из кеша.

```js
// Отлавливаем ошибки, выдаваемые некоторыми браузерами при использовании новой опции `type`.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Создаем объект performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Если значение transferSize равно 0, ресурс был получен из кеша.
      console.log(entry.name, entry.transferSize === 0);
    }
  });
  // Начинаем отслеживать получаемые записи типа `resource`.
  po.observe({type: 'resource', buffered: true});
} catch (e) {
  // Если браузер не поддерживает этот API, ничего не делаем.
}
```

### Navigation Timing API

[Navigation Timing API](https://w3c.github.io/navigation-timing/) похож на Resource Timing API, но сообщает только о [запросах навигации](https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests). Тип записей `navigation` также похож на `resource`, но содержит некоторую [дополнительную информацию,](https://w3c.github.io/navigation-timing/#sec-PerformanceNavigationTiming) относящуюся только к запросам навигации (например, когда освобождаются события `DOMContentLoaded` и `load`).

Есть метрика, которую многие разработчики отслеживают для понимания времени ответа сервера — [Time to First Byte](https://en.wikipedia.org/wiki/Time_to_first_byte). Она доступна через Navigation Timing API — точнее говоря, это метка времени `responseStart`.

```js
// Отлавливаем ошибки, выдаваемые некоторыми браузерами при использовании новой опции `type`.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Создаем объект performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Если значение transferSize равно 0, ресурс был получен из кеша.
      console.log('Time to first byte', entry.responseStart);
    }
  });
  // Начинаем отслеживать получаемые записи типа `navigation`.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Если браузер не поддерживает этот API, ничего не делаем.
}
```

Еще одна метрика, которая может понадобиться разработчикам, использующим сервис-воркер, — время запуска сервис-воркера для запросов навигации. Это количество времени, которое требуется браузеру для запуска потока сервис-воркера, прежде чем он сможет начать перехват событий считывания.

Время запуска сервис-воркера для конкретного запроса навигации можно определить по значению дельты между `entry.responseStart` и `entry.workerStart`.

```js
// Отлавливаем ошибки, выдаваемые некоторыми браузерами при использовании новой опции `type`.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Создаем объект performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('Service Worker startup time:',
          entry.responseStart - entry.workerStart);
    }
  });
  // Начинаем отслеживать получаемые записи типа `navigation`.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Если браузер не поддерживает этот API, ничего не делаем.
}
```

### Server Timing API

[Server Timing API](https://w3c.github.io/server-timing/) позволяет передавать данные о времени, связанные с запросом, с вашего сервера в браузер через заголовки ответов. Например, можно указать, сколько времени потребовалось для поиска данных в базе данных для конкретного запроса, что может быть полезно при отладке проблем с производительностью, вызванных медленной работой сервера.

Для разработчиков, использующих сторонних поставщиков аналитики, Server Timing API — единственный способ сопоставить данные о производительности сервера с другими бизнес-показателями, которые могут измеряться этими аналитическими инструментами.

Чтобы указать данные о времени сервера в своих ответах, вы можете использовать заголовок ответа `Server-Timing`. Вот пример.

```http
HTTP/1.1 200 OK

Server-Timing: miss, db;dur=53, app;dur=47.2
```

Затем вы можете считывать эти данные со своих страниц в записях `resource` или `navigation` через API-интерфейсы Resource Timing и Navigation Timing.

```js
// Отлавливаем ошибки, выдаваемые некоторыми браузерами при использовании новой опции `type`.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Создаем объект performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Заносим в журнал все данные о времени сервера для этого ответа
      console.log('Server Timing', entry.serverTiming);
    }
  });
  // Начинаем отслеживать получаемые записи типа `navigation`.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Если браузер не поддерживает этот API, ничего не делаем.
}
```
