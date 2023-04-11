---
layout: post
title: 自定义指标
authors:
  - philipwalton
date: 2019-11-08
description: 自定义指标可用于对您的网站独有的使用体验的各个方面进行衡量和优化。
tags:
  - performance
  - metrics
---

[以用户为中心的指标](/user-centric-performance-metrics/)具有很大价值，从普遍意义上，通过它们可以衡量任何给定网站。这些指标允许您：

- 了解真实用户对 Web 的整体体验如何
- 轻松比较您的网站与竞争对手网站
- 在分析工具中跟踪有用且可操作的数据，无需编写自定义代码

通用指标提供了一个很好的基线，但在许多情况下，您需要测量*更多*指标，才能刻画出具体网站的完整体验。

自定义指标允许您衡量可能仅适用于您的网站的使用体验的各个方面，例如：

- 单页面应用程序 (SPA) 从一“页”转换到另一“页”需要多长时间
- 页面针对登录用户显示从数据库获取的数据需要多长时间
- 服务器端渲染 (SSR) 应用程序需要多长时间才能[注水](https://addyosmani.com/blog/rehydration/)
- 回访者加载资源的缓存命中率
- 游戏中点击或键盘事件的事件延迟

## 用于测量自定义指标的 API

从历史上看，Web 开发人员没有很多低级 API 可用来衡量性能，因此他们不得不采用一些修改技巧才能衡量网站的性能是否良好。

例如，可以运行 `requestAnimationFrame` 循环并计算相邻帧之间的增量时间，来确定主线程是否由于长时间运行 JavaScript 任务而被阻塞。如果增量时间明显长于显示帧率，则可以将其报告为一个长任务。但是，不建议使用此类修改技巧，因为实际上它们本身就会影响性能（例如，耗尽电池电量）。

有效的性能测量的第一条规则是确保性能测量技术本身不会导致性能问题。因此，对于在网站上测量的任何自定义指标，如果可能，最好使用以下 API 之一。

### 性能观察器

了解 PerformanceObserver API 对于创建自定义性能指标至关重要，因为它是从本文讨论的所有其他性能 API 获取数据的机制。

利用 `PerformanceObserver`，可以被动订阅与性能相关的事件，这意味着这些 API 通常不会干扰页面的性能，因为它们的回调通常在[空闲期间](https://w3c.github.io/requestidlecallback/#idle-periods)触发。

创建 `PerformanceObserver` 的方式是，向其传递一个只要分派新的性能条目就会运行的回调。然后告诉该观察器要通过 [`observe()`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver/observe) 方法监听哪些类型的条目：

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });

  po.observe({type: 'some-entry-type'});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

以下各部分列出了所有可进行观察的不同条目类型，但在较新的浏览器中，您可以通过静态 [`PerformanceObserver.supportedEntryTypes`](https://w3c.github.io/performance-timeline/#supportedentrytypes-attribute) 属性检查哪些条目类型可用。

{% Aside %} 传递给 `observe()` 方法的对象还可以指定一个 `entryTypes` 数组（以便通过同一个观察器观察多个条目类型）。虽然指定 `entryTypes` 是具有更广泛浏览器支持的旧选项，但现在优先使用 `type`，因为它允许指定额外的特定于条目的观察配置（例如 `buffered` 标志，接下来会讨论）。{% endAside %}

#### 观察已经发生的条目

默认情况下， `PerformanceObserver` 对象只能在条目发生时观察它们。如果您想要延迟加载性能分析代码（为了不阻止优先级更高的资源），这可能会出现问题。

要获取历史条目（在它们发生之后），请在调用 `observe()` 时将 `buffered` 标志设置为 `true`。浏览器将在第一次调用 `PerformanceObserver` 回调时包括其[性能条目缓冲区](https://w3c.github.io/performance-timeline/#dfn-performance-entry-buffer)中的历史条目。

```js
po.observe({
  type: 'some-entry-type',
  buffered: true,
});
```

{% Aside %} 为避免出现内存问题，性能条目缓冲区不是无限制的。对于大多数典型的页面加载，不太可能出现缓冲区填满和丢失条目的情况。{% endAside %}

#### 要避免使用的旧版性能 API

在性能观察器 API 之前，开发人员可以使用 [`performance`](https://w3c.github.io/performance-timeline/) 对象中定义的以下三种方法访问性能条目：

- [`getEntries()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntries)
- [`getEntriesByName()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByName)
- [`getEntriesByType()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByType)

虽然这些 API 仍然受支持，但不建议使用它们，因为它们不允许监听何时发出新条目。此外，许多新的 API（例如 Long Tasks）不通过 `performance` 对象公开，而只通过 `PerformanceObserver` 公开。

除非您明确需要 Internet Explorer 兼容性，否则最好在代码中避免使用这些方法，而是使用 `PerformanceObserver`。

### User Timing API

[User Timing API](https://w3c.github.io/user-timing/) 是基于时间的指标的通用测量 API。它允许您任意标记时间点，然后测量这些标记之间的时长。

```js
// Record the time immediately before running a task.
performance.mark('myTask:start');
await doMyTask();
// Record the time immediately after running a task.
performance.mark('myTask:end');

// Measure the delta between the start and end of the task
performance.measure('myTask', 'myTask:start', 'myTask:end');
```

虽然 `Date.now()` 或 `performance.now()` 等 API 可以提供相似功能，但使用 User Timing API 的好处是它可以与性能工具很好地集成。例如，Chrome DevTools 可以使 [Performance 面板中的 User Timing 测量值](https://developers.google.com/web/updates/2018/04/devtools#tabs)可视化，而且许多分析提供商还会自动跟踪您所做的任何测量，并将时长数据发送到他们的分析后端。

要报告 User Timing 测量值，您可以使用 [PerformanceObserver](#performance-observer) 并注册以观察 `measure` 类型的条目：

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });
  // Start listening for `measure` entries to be dispatched.
  po.observe({type: 'measure', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### Long Tasks API

[Long Tasks API](https://w3c.github.io/longtasks/) 用于了解浏览器主线程的阻塞时间何时长到足以影响帧率或输入延迟。目前，该 API 将报告执行时间超过 50 毫秒 (ms) 的任何任务。

任何时候您需要运行开销大的代码（或加载和执行大型脚本）时，跟踪该代码是否阻塞主线程都是很有用的。事实上，许多较高级别的指标都是建立在 Long Tasks API 上的（例如 [Time to Interactive (TTI)](/tti/) 和 [Total Blocking Time (TBT)](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/)）。

要确定何时发生长任务，您可以使用 [PerformanceObserver](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) 并注册以观察 `longtask` 类型的条目：

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });
  // Start listening for `longtask` entries to be dispatched.
  po.observe({type: 'longtask', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### Element Timing API

[Largest Contentful Paint (LCP)](/lcp/) 指标用于了解最大的图像或文本块何时绘制到屏幕上，但在某些情况下，您希望测量不同元素的渲染时间。

对于这些情况，您可以使用 [Element Timing API](https://wicg.github.io/element-timing/)。实际上，Largest Contentful Paint API 建立在 Element Timing API 之上，并添加了对最大内容元素的自动报告，但是您可以通过显式添加 `elementtiming` 属性来报告其他元素，并注册一个 PerformanceObserver 来观察元素条目类型。

```html
<img elementtiming="hero-image" />
<p elementtiming="important-paragraph">This is text I care about.</p>
...
<script>
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      // Log the entry and all associated details.
      console.log(entry.toJSON());
    }
  });
  // Start listening for `element` entries to be dispatched.
  po.observe({type: 'element', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
</script>
```

{% Aside 'gotchas' %} 针对 Largest Contentful Paint 考虑的元素类型与可通过 Element Timing API 观察的元素类型相同。如果您将 `elementtiming` 属性添加到不属于这些类型的元素，该属性将被忽略。{% endAside %}

### Event Timing API

[First Input Delay (FID)](/fid/) 指标测量从用户首次与页面交互到浏览器实际能够开始处理事件处理程序以响应该交互的时间。但是，在某些情况下，测量事件处理时间本身以及直到可以渲染下一帧之前的时间也可能很有用。

这可以通过 [Event Timing API](https://wicg.github.io/event-timing/)（用于测量 FID）实现，因为它公开了事件生命周期中的许多时间戳，包括：

- [`startTime`](https://w3c.github.io/performance-timeline/#dom-performanceentry-starttime)：浏览器接收到事件的时间。
- [`processingStart`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingstart)：浏览器能够开始针对该事件处理事件处理程序时的时间。
- [`processingEnd`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingend)：浏览器完成执行事件处理程序针对该事件启动的所有同步代码时的时间。
- [`duration`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingstart)：浏览器收到事件直到它能够在完成执行从事件处理程序启动的所有同步代码后绘制下一帧时的时间（出于安全原因，四舍五入到 8 毫秒）。

以下示例显示了如何使用这些值来创建自定义测量：

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  const po = new PerformanceObserver((entryList) => {
    const firstInput = entryList.getEntries()[0];

    // Measure First Input Delay (FID).
    const firstInputDelay = firstInput.processingStart - firstInput.startTime;

    // Measure the time it takes to run all event handlers
    // Note: this does not include work scheduled asynchronously using
    // methods like `requestAnimationFrame()` or `setTimeout()`.
    const firstInputProcessingTime = firstInput.processingEnd - firstInput.processingStart;

    // Measure the entire duration of the event, from when input is received by
    // the browser until the next frame can be painted after processing all
    // event handlers.
    // Note: similar to above, this value does not include work scheduled
    // asynchronously using `requestAnimationFrame()` or `setTimeout()`.
    // And for security reasons, this value is rounded to the nearest 8ms.
    const firstInputDuration = firstInput.duration;

    // Log these values the console.
    console.log({
      firstInputDelay,
      firstInputProcessingTime,
      firstInputDuration,
    });
  });

  po.observe({type: 'first-input', buffered: true});
} catch (error) {
  // Do nothing if the browser doesn't support this API.
}
```

### Resource Timing API

[Resource Timing API](https://w3c.github.io/resource-timing/) 使开发人员可以详细了解特定页面的资源是如何加载的。尽管该 API 的名称如此，但它提供的信息不局限于计时数据（虽然有[大量该数据](https://w3c.github.io/resource-timing/#processing-model)）。您可以访问的其他数据包括：

- [initiatorType](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-initiatortype)：资源的获取方式：例如从 `<script>` 或 `<link>` 标签，或者通过 `fetch()` 获取
- [nextHopProtocol](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-nexthopprotocol)：用于获取资源的协议，例如 `h2` 或 `quic`
- [encodedBodySize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-encodedbodysize)/[decodedBodySize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-decodedbodysize)：资源的编码或解码形式的大小（分别列出）
- [transferSize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-transfersize)：实际通过网络传输的资源的大小。当资源通过缓存实现时，该值可能比 `encodedBodySize` 小得多，在某些情况下还可能为零（如果不需要缓存重验证）。

请注意，您可以使用资源计时条目的 `transferSize` 属性来测量*缓存命中率*指标，甚至可以测量*总缓存资源大小*指标，在了解您的资源缓存策略对重复访问者的性能有何影响时，这些指标可能很有用。

以下示例记录了页面请求的所有资源，并指示每个资源是否通过缓存实现。

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // If transferSize is 0, the resource was fulfilled via the cache.
      console.log(entry.name, entry.transferSize === 0);
    }
  });
  // Start listening for `resource` entries to be dispatched.
  po.observe({type: 'resource', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### Navigation Timing API

[Navigation Timing API](https://w3c.github.io/navigation-timing/) 类似于 Resource Timing API，但它只报告[导航请求](https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests)。`navigation` 条目类型也类似于 `resource` 条目类型，但它包含一些仅特定于导航请求的[附加信息](https://w3c.github.io/navigation-timing/#sec-PerformanceNavigationTiming)（例如 `DOMContentLoaded` 和 `load` 事件何时触发）。

被许多开发人员跟踪以了解服务器响应时间 ([Time to First Byte](https://en.wikipedia.org/wiki/Time_to_first_byte)) 的一个指标可通过 Navigation Timing API 获得 - 具体来说，是条目的 `responseStart` 时间戳。

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // If transferSize is 0, the resource was fulfilled via the cache.
      console.log('Time to first byte', entry.responseStart);
    }
  });
  // Start listening for `navigation` entries to be dispatched.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

使用服务工作进程的开发人员可能关心的另一个指标是导航请求的服务工作进程启动时间。这是浏览器在可以开始拦截 fetch 事件之前启动服务工作进程所花费的时间。

特定导航请求的服务工作进程启动时间可以通过 `entry.responseStart` 和 `entry.workerStart` 之间的增量时间来确定。

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('Service Worker startup time:',
          entry.responseStart - entry.workerStart);
    }
  });
  // Start listening for `navigation` entries to be dispatched.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```

### Server Timing API

[Server Timing API](https://w3c.github.io/server-timing/) 允许您通过响应标头将特定于请求的计时数据从服务器传递到浏览器。例如，您可以指示在数据库中查找特定请求的数据所花费的时间 - 在调试由于服务器速度缓慢而导致的性能问题时，这可能很有用。

对于使用第三方分析提供商的开发人员来说，Server Timing API 是将服务器性能数据与这些分析工具可能测量的其他业务指标相关联的唯一方法。

要在响应中指定服务器计时数据，可以使用 `Server-Timing` 响应标头。以下是一个示例。

```http
HTTP/1.1 200 OK

Server-Timing: miss, db;dur=53, app;dur=47.2
```

然后，在页面中，可以从 Resource Timing 和 Navigation Timing API 的 `resource` 或 `navigation` 中读取此数据。

```js
// Catch errors since some browsers throw when using the new `type` option.
// https://bugs.webkit.org/show_bug.cgi?id=209216
try {
  // Create the performance observer.
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Logs all server timing data for this response
      console.log('Server Timing', entry.serverTiming);
    }
  });
  // Start listening for `navigation` entries to be dispatched.
  po.observe({type: 'navigation', buffered: true});
} catch (e) {
  // Do nothing if the browser doesn't support this API.
}
```
