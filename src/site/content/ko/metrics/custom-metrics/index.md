---
layout: post
title: 사용자 지정 메트릭
authors:
  - philipwalton
date: 2019-11-08
description: 사용자 지정 메트릭을 사용하면 사이트 고유의 사이트 경험 측면을 측정하고 최적화할 수 있습니다.
tags:
  - performance
  - metrics
---

주어진 웹 사이트에서 보편적으로 측정할 수 있는 [사용자 중심 메트릭](/user-centric-performance-metrics/)을 확보하면 많은 가치를 누릴 수 있습니다. 이러한 메트릭을 통해 다음을 수행할 수 있습니다.

- 실제 사용자가 웹을 전반적으로 어떻게 경험하는지 이해
- 해당 사이트를 경쟁업체 사이트와 쉽게 비교
- 사용자 지정 코드를 작성할 필요없이 분석 도구에서 유용하고 실행 가능한 데이터 추적

범용 메트릭이 좋은 기준을 제공하기는 하지만, 많은 경우에 특정 사이트에 대한 전반적인 경험을 파악하려면 이러한 메트릭 이외에 *더 많은* 메트릭을 측정할 필요가 있습니다.

사용자 지정 메트릭을 사용하면 다음과 같이 해당 사이트에만 적용될 수 있는 사이트 경험 측면을 측정할 수 있습니다.

- 단일 페이지 앱(SPA)이 한 "페이지"에서 다른 "페이지"로 전환되는 데 걸리는 시간
- 로그인한 사용자를 위해 데이터베이스에서 가져온 데이터를 페이지에 표시하는 데 걸리는 시간
- 서버 측 렌더링(SSR) 앱이 [수화](https://addyosmani.com/blog/rehydration/)되는 데 걸리는 시간
- 재방문자가 로드한 리소스의 캐시 적중률
- 게임에서 클릭 또는 키보드 이벤트의 이벤트 지연 시간

## 사용자 지정 메트릭을 측정하는 API

지금까지 웹 개발자들은 성능을 측정할 수 있는 저수준 API를 많이 이용할 수 없었고, 이 때문에 사이트의 성능을 측정하기 위해 해킹에 의존해야 했습니다.

예를 들어, `requestAnimationFrame` 루프를 실행하고 각 프레임 간의 델타를 계산하는 식으로 장기 실행되는 JavaScript 작업으로 인해 메인 스레드가 차단되는지 여부를 확인할 수 있습니다. 델타가 디스플레이의 프레임 속도보다 훨씬 길면 이를 긴 작업으로 보고할 수 있습니다. 그러나 이러한 해킹은 실제로 성능 자체에 영향을 미치므로 권장되지 않습니다(예: 배터리 소모).

효과적인 성능 측정을 위한 첫 번째 규칙은 성능 측정 기술 자체가 성능 문제를 일으키지 않는지 확인하는 것입니다. 따라서 사이트에서 측정하는 모든 사용자 지정 메트릭에 대해 가능한 경우 다음 API 중 하나를 사용하는 것이 가장 좋습니다.

### 성능 관찰자

PerformanceObserver API를 이해하는 것은 사용자 지정 성능 메트릭을 만드는 데 매우 중요합니다. 이 문서에서 논의된 다른 모든 성능 API에서 데이터를 가져오는 메커니즘이기 때문입니다.

`PerformanceObserver`를 사용하면 성능 관련 이벤트를 수동적으로 구독할 수 있습니다. 즉, 이러한 API는 일반적으로 페이지 성능을 방해하지 않는데, 일반적으로 [유휴 기간](https://w3c.github.io/requestidlecallback/#idle-periods) 동안 콜백이 실행되기 때문입니다.

새로운 성능 항목이 보내질 때마다 실행할 콜백을 전달하여 `PerformanceObserver`를 생성합니다. 그런 다음 [`observe()`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver/observe) 메서드를 통해 어떤 유형의 항목에 수신 대기할지 관찰자에게 알려줍니다.

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

아래 섹션에는 관찰에 사용할 수 있는 다양한 항목 유형이 모두 나열되어 있지만 최신 브라우저에서는 정적 [`PerformanceObserver.supportedEntryTypes`](https://w3c.github.io/performance-timeline/#supportedentrytypes-attribute) 속성을 통해 사용 가능한 항목 유형을 검사할 수 있습니다.

{% Aside %} `observe()` 메서드에 전달된 개체는 `entryTypes` 배열을 지정할 수도 있습니다(동일한 관찰자를 통해 둘 이상의 항목 유형을 관찰하기 위해). `entryTypes`를 지정하는 것이 더 광범위한 브라우저 지원을 제공하는 지금까지의 선택이지만, 이제는 `type`을 사용하는 것이 더 권장됩니다. 추가적인 항목별 관찰 구성을 지정할 수 있게 해주기 때문입니다(다음으로 논의하는 `buffered` 플래그 등). {% endAside %}

#### 이미 발생한 항목 관찰

기본적으로, `PerformanceObserver` 개체는 항목이 발생할 때에만 이를 관찰할 수 있습니다. 성능 분석 코드를 느리게 로드하려는 경우(우선순위가 높은 리소스를 차단하지 않기 위해)에는 이것이 문제가 될 수 있습니다.

항목 내역을 가져오려면(발생한 후) `observe()`를 호출할 때 `buffered` 플래그를 `true`로 설정합니다. 그러면 브라우저가 `PerformanceObserver` 콜백이 처음 호출될 때 [성능 항목 버퍼](https://w3c.github.io/performance-timeline/#dfn-performance-entry-buffer)의 항목 내역을 포함시킵니다.

```js
po.observe({
  type: 'some-entry-type',
  buffered: true,
});
```

{% Aside %} 메모리 문제를 피하기 위해 성능 항목 버퍼는 무제한이 아닙니다. 대부분의 일반적인 페이지 로드의 경우 버퍼가 가득 차고 항목이 누락될 가능성은 거의 없습니다. {% endAside %}

#### 피해야 할 레거시 성능 API

Performance Observer API 이전에 개발자들은 [`performance`](https://w3c.github.io/performance-timeline/) 개체에 정의된 다음 세 가지 메서드를 사용하여 성능 항목에 액세스할 수 있었습니다.

- [`getEntries()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntries)
- [`getEntriesByName()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByName)
- [`getEntriesByType()`](https://developer.mozilla.org/docs/Web/API/Performance/getEntriesByType)

이러한 API는 계속 지원되지만 새 항목이 방출될 때 이를 수신 대기할 수 없기 때문에 사용을 권장하지 않습니다. 또한 많은 새로운 API(예: Long Tasks)가 `performance`를 통해서는  노출되지 않고, `PerformanceObserver`를 통해서만 노출됩니다.

Internet Explorer 호환성이 특별히 필요한 경우가 아니면 코드에서 이러한 메서드를 피하고 앞으로 `PerformanceObserver`를 사용하는 것이 가장 좋습니다.

### 사용자 타이밍 API

[사용자 타이밍 API](https://w3c.github.io/user-timing/)는 시간 기반 메트릭을 위한 범용 측정 API입니다. 이를 통해 임의의 시점을 표시한 다음 나중에 해당 표시 사이의 기간을 측정할 수 있습니다.

```js
// Record the time immediately before running a task.
performance.mark('myTask:start');
await doMyTask();
// Record the time immediately after running a task.
performance.mark('myTask:end');

// Measure the delta between the start and end of the task
performance.measure('myTask', 'myTask:start', 'myTask:end');
```

`Date.now()` 또는 `performance.now()`와 같은 API가 유사한 기능을 제공하지만 사용자 타이밍 API를 사용하면 성능 도구와 잘 통합된다는 이점이 있습니다. 예를 들어 Chrome DevTools는 [성능 패널에서 사용자 타이밍 측정](https://developers.google.com/web/updates/2018/04/devtools#tabs)을 시각화하고, 많은 분석 제공자가 사용자가 수행하는 모든 측정을 자동으로 추적하고 기간 데이터를 분석 백엔드로 보냅니다.

사용자 타이밍 측정을 보고하려면 [PerformanceObserver](#performance-observer)를 사용하고 `measure` 유형의 항목을 관찰하도록 등록할 수 있습니다.

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

### 긴 작업 API

[긴 작업 API](https://w3c.github.io/longtasks/)는 브라우저의 메인 스레드가 프레임 속도나 입력 대기 시간에 영향을 줄 만큼 충분히 오랫동안 차단되는 경우 이를 파악하는 데 유용합니다. 현재, 이 API는 50밀리초(ms) 이상 실행되는 모든 작업을 보고합니다.

값비싼 코드를 실행해야 할 때(또는 대용량 스크립트를 로드하고 실행해야 할 때) 해당 코드가 메인 스레드를 차단했는지 여부를 추적하는 것이 유용합니다. 실제로 많은 상위 수준의 메트릭이 긴 작업 API 자체를 기반으로 구축됩니다(예: [상호 작용까지의 시간(TTI)](/tti/) 및 [전체 차단 시간(TBT)](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/)).

긴 작업이 언제 발생하는지 확인하려면 [PerformanceObserver](https://developer.mozilla.org/docs/Web/API/PerformanceObserver)를 사용하고 `longtask` 유형의 항목을 관찰하도록 등록할 수 있습니다.

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

### 요소 타이밍 API

[최대 콘텐츠풀 페인트(LCP)](/lcp/) 메트릭은 가장 큰 이미지 또는 텍스트 블록이 화면에 그려진 시점을 파악하는 데 유용하지만 경우에 따라 다른 요소의 렌더링 시간을 측정해야 합니다.

이러한 경우 [요소 타이밍 API](https://wicg.github.io/element-timing/)를 사용할 수 있습니다. 가장 큰 콘텐츠풀 페인트 API는 실제로 요소 타이밍 API를 기반으로 구축되고 가장 큰 콘텐츠풀 요소에 대한 자동 보고를 추가하지만 `elementtiming` 속성을 명시적으로 추가하고 요소 항목 유형을 관찰하도록 PerformanceObserver를 등록하여 추가 요소에 대해 보고할 수 있습니다.

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

{% Aside 'gotchas' %} 최대 콘텐츠풀 페인트에 대해 고려되는 요소 유형은 요소 타이밍 API를 통해 관찰할 수 있는 유형과 동일합니다. 이러한 유형 중 하나가 아닌 요소에 `elementtiming` 속성을 추가하면 속성이 무시됩니다. {% endAside %}

### 이벤트 타이밍 API

[최초 입력 지연(FID)](/fid/) 메트릭은 사용자가 페이지와 처음 상호 작용할 때부터 브라우저가 실제로 해당 상호 작용에 대한 응답으로 이벤트 핸들러 처리를 시작할 수 있는 시간까지의 시간을 측정합니다. 그러나 경우에 따라 이벤트 처리 시간 자체와 다음 프레임을 렌더링할 수 있을 때까지의 시간을 측정하는 것도 유용할 수 있습니다.

이것은 FID를 측정하는 데 사용되는 [이벤트 타이밍 API](https://wicg.github.io/event-timing/)로 가능한데, 다음을 포함한 이벤트 수명 주기의 여러 타임스탬프를 노출할 수 있기 때문입니다.

- [`startTime`](https://w3c.github.io/performance-timeline/#dom-performanceentry-starttime): 브라우저가 이벤트를 수신하는 시간입니다.
- [`processingStart`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingstart): 브라우저가 이벤트에 대한 이벤트 핸들러 처리를 시작할 수 있는 시간입니다.
- [`processingEnd`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingend): 브라우저가 이 이벤트에 대한 이벤트 핸들러에서 시작된 모든 동기 코드 실행을 완료하는 시간입니다.
- [`duration`](https://wicg.github.io/event-timing/#dom-performanceeventtiming-processingstart): 브라우저가 이벤트를 수신한 때부터 이벤트 핸들러에서 시작된 모든 동기 코드 실행을 완료한 후 다음 프레임을 그릴 수 있을 때까지의 시간(보안상의 이유로 8ms로 반올림됨)입니다.

다음 예는 이러한 값을 사용하여 사용자 지정 측정을 만드는 방법을 보여줍니다.

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

### 리소스 타이밍 API

[리소스 타이밍 API](https://w3c.github.io/resource-timing/)는 개발자에게 특정 페이지의 리소스가 로드되는 방식에 대한 상세한 통찰력을 제공합니다. 이 API의 이름에도 불구하고, 제공되는 정보는 타이밍 데이터로 제한되지 않습니다([타이밍 데이터가 많기는 하지만](https://w3c.github.io/resource-timing/#processing-model)). 액세스할 수 있는 다른 데이터는 다음과 같습니다.

- [initiatorType](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-initiatortype): 리소스를 가져온 방식(예: `<script>` 또는 `<link>` 태그 또는 `fetch()` 이용)
- [nextHopProtocol](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-nexthopprotocol): 리소스를 가져오는 데 사용되는 프로토콜(예: `h2` 또는 `quic`)
- [encodingBodySize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-encodedbodysize)/[decodedBodySize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-decodedbodysize): 각각 인코딩 또는 디코딩된 형식의 리소스 크기
- [transferSize](https://w3c.github.io/resource-timing/#dom-performanceresourcetiming-transfersize): 실제로 네트워크를 통해 전송된 리소스의 크기입니다. 리소스가 캐시를 통해 처리되면 이 값은 `encodedBodySize`보다 훨씬 작을 수 있으며 경우에 따라 0이 될 수 있습니다(캐시 재검증이 필요하지 않은 경우).

리소스 타이밍 항목의 `transferSize` 속성을 사용하여 *캐시 적중률* 메트릭, 또는 경우에 따라 *전체 캐시된 리소스 크기* 메트릭까지도 측정할 수 있습니다. 이는 해당 리소스 캐싱 전략이 반복 방문자가 경험하는 성능에 미치는 영향을 이해하는 데 유용할 수 있습니다.

다음 예는 페이지에서 요청한 모든 리소스를 기록하고 각 리소스가 캐시를 통해 처리되었는지 여부를 나타냅니다.

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

### 탐색 타이밍 API

[탐색 타이밍 API](https://w3c.github.io/navigation-timing/)는 리소스 타이밍 API와 유사하지만 [탐색 요청](https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests)만 보고합니다. `navigation` 항목 유형은 `resource` 항목 유형과도 유사하지만 탐색 요청에만 해당하는 몇 가지 [추가 정보](https://w3c.github.io/navigation-timing/#sec-PerformanceNavigationTiming)(`DOMContentLoaded` 및 `load` 이벤트가 발생하는 시기 등)를 포함합니다.

많은 개발자가 서버 응답 시간([첫 바이트까지의 시간](https://en.wikipedia.org/wiki/Time_to_first_byte))을 이해하기 위해 추적하는 한 가지 메트릭을 탐색 타이밍 API를 통해 사용할 수 있습니다. 구체적으로, 항목의 `responseStart` 타임스탬프가 이용됩니다.

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

서비스 작업자를 사용하는 개발자가 관심을 가질 수 있는 또 다른 메트릭은 탐색 요청에 대한 서비스 작업자 시작 시간입니다. 이는 브라우저가 가져오기 이벤트를 가로채기 시작하기 전에 서비스 작업자 스레드를 시작하는 데 걸리는 시간입니다.

특정 탐색 요청에 대한 서비스 작업자 시작 시간은 `entry.responseStart`와 `entry.workerStart` 사이의 델타로부터 결정할 수 있습니다.

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

### 서버 타이밍 API

[서버 타이밍 API](https://w3c.github.io/server-timing/)를 사용하면 응답 헤더를 통해 서버에서 브라우저로 요청별 타이밍 데이터를 전달할 수 있습니다. 예를 들어, 특정 요청에 대해 데이터베이스에서 데이터를 조회하는 데 걸린 시간을 나타낼 수 있습니다. 이는 서버의 속도 저하로 인한 성능 문제를 디버깅하는 데 유용할 수 있습니다.

타사 분석 제공자를 사용하는 개발자의 경우, 서버 타이밍 API는 서버 성능 데이터를 이러한 분석 도구가 측정할 수 있는 다른 비즈니스 메트릭과 상관시킬 수 있는 유일한 방법입니다.

응답에 서버 타이밍 데이터를 지정하려면 `Server-Timing` 응답 헤더를 사용할 수 있습니다. 예를 들면 다음과 같습니다.

```http
HTTP/1.1 200 OK

Server-Timing: miss, db;dur=53, app;dur=47.2
```

그런 다음, 페이지에서 리소스 타이밍 및 탐색 타이밍 API를 통해 `resource` 또는 `navigation` 항목 모두에서 이 데이터를 읽을 수 있습니다.

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
