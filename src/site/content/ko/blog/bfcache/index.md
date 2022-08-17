---
layout: post
title: 캐시 뒤로/앞으로
subhead: 브라우저의 뒤로 및 앞으로 버튼을 사용할 때 페이지를 즉시 로드하도록 최적화하십시오.
description: |2

  브라우저의 뒤로 및 앞으로 버튼을 사용할 때 페이지를 즉시 로드하도록 최적화하는 방법을 알아보세요.
authors:
  - philipwalton
date: 2020-11-10
updated: 2021-11-15
hero: image/admin/Qoeb8x3a11BdGgRzYJbY.png
alt: 뒤로 및 앞으로 버튼
tags:
  - blog
  - performance
  - web-vitals
---

뒤로/앞으로 캐시(또는 bfcache)는 즉각적인 뒤로 및 앞으로 탐색을 가능하게 하는 브라우저 최적화입니다. 사용자, 특히 느린 네트워크나 장치를 사용하는 사용자의 검색 경험을 크게 향상시킵니다.

웹 개발자는 사용자가 이점을 누릴 수 있도록 모든 브라우저에서 [bfcache에 페이지를 최적화](#optimize-your-pages-for-bfcache)하는 방법을 이해하는 것이 중요합니다.

## 브라우저 호환성

bfcache는 데스크톱과 모바일에서 수년 동안 [Firefox](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/1.5/Using_Firefox_1.5_caching)와 [Safari](https://webkit.org/blog/427/webkit-page-cache-i-the-basics/) 모두에서 지원되었습니다.

버전 86부터 Chrome은 소수의 사용자를 위해 Android에서 [사이트 간](/same-site-same-origin/) 탐색을 위해 bfcache를 활성화했습니다. 후속 릴리스에서는 추가 지원이 천천히 롤아웃되었습니다. 버전 96부터 bfcache는 데스크톱 및 모바일의 모든 Chrome 사용자가 사용할 수 있습니다.

## bfcache 기본 사항

bfcache는 사용자가 다른 곳으로 이동할 때 페이지의 전체 스냅샷(JavaScript 힙 포함)을 저장하는 메모리 내 캐시입니다. 전체 페이지를 메모리에 저장하면 사용자가 돌아가기로 결정하면 브라우저에서 빠르고 쉽게 페이지를 복원할 수 있습니다.

웹사이트를 방문하고 다른 페이지로 이동하기 위해 링크를 클릭한 적이 몇 번이나 있었는데, 원하는 페이지가 아님을 깨닫고 뒤로 버튼을 클릭했습니까? 그 순간에 bfcache는 이전 페이지가 로드되는 속도에 큰 차이를 만들 수 있습니다.

<div class="table-wrapper">
  <table data-alignment="top">
    <tr>
      <td width="30%">
        <strong>bfcache가 활성화되지 <em>않은 경우</em></strong>
      </td>
      <td>이전 페이지를 로드하기 위해 새 요청이 시작되고 해당 페이지가 반복 방문에 대해 얼마나 <a href="/reliable/#the-options-in-your-caching-toolbox">최적화</a>되었는지에 따라 브라우저는 리소스의 일부(또는 전체)를 다시 다운로드하고, 다시 구문 분석하고, 다시 실행해야 할 수 있습니다. 방금 다운로드했습니다.</td>
    </tr>
    <tr>
      <td><strong>bfcache가 활성화된 <em>경우</em></strong></td>
      <td>이전 페이지를 로드하는 것은 <em>본질적으로 즉각적입니다</em> . 네트워크에 전혀 연결하지 않고도 전체 페이지를 메모리에서 복원할 수 있기 때문입니다.</td>
    </tr>
  </table>
</div>

bfcache가 작동하는 동영상을 확인하여 탐색 속도를 높일 수 있는지 알아보십시오.

{% YouTube 'cuPsdRckkF0' %}

위의 비디오에서 bfcache가 있는 예제는 없는 예제보다 훨씬 빠릅니다.

bfcache는 탐색 속도를 높일 뿐만 아니라 리소스를 다시 다운로드할 필요가 없기 때문에 데이터 사용량도 줄입니다.

Chrome 사용 데이터에 따르면 데스크톱의 탐색 10개 중 1개, 모바일의 탐색 5개 중 1개가 뒤로 또는 앞으로 이동하는 것으로 나타났습니다. bfcache가 활성화되면 브라우저는 데이터 전송과 매일 수십억 개의 웹 페이지를 로드하는 데 소요되는 시간을 없앨 수 있습니다!

### "캐시" 작동 방식

bfcache에서 사용하는 "캐시"는 [HTTP 캐시](/http-cache/)와 다릅니다(반복 탐색 속도를 높이는 데 유용함). bfcache는 메모리에 있는 전체 페이지의 스냅샷(JavaScript 힙 포함)인 반면 HTTP 캐시에는 이전에 작성된 요청에 대한 응답만 포함됩니다. 페이지를 로드하는 데 필요한 모든 요청이 HTTP 캐시에서 이행될 수 있는 경우는 매우 드물기 때문에 bfcache 복원을 사용한 반복 방문은 가장 잘 최적화된 비 bfcache 탐색보다 항상 빠릅니다.

그러나 메모리에 페이지의 스냅샷을 만드는 것은 진행 중인 코드를 가장 잘 보존하는 방법의 측면에서 약간의 복잡성을 수반합니다. 예를 들어, 페이지가 bfcache에 있는 동안 시간 초과에 도달한 `setTimeout()` 호출을 어떻게 처리합니까?

대답은 브라우저가 보류 중인 타이머나 확인되지 않은 약속 실행을 일시 중지하고(기본적으로 [JavaScript 작업 대기열](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue)의 모든 보류 중인 작업) bfcache에서 페이지가 복원될 때(또는 그러한 경우) 처리 작업을 다시 시작한다는 것입니다.

어떤 경우에는 이것은 상당히 낮은 위험(예: 시간 초과 또는 약속)이지만 다른 경우에는 매우 혼란스럽거나 예기치 않은 동작으로 이어질 수 있습니다. 예를 들어 브라우저가 [IndexedDB 트랜잭션](https://developer.mozilla.org/docs/Web/API/IDBTransaction)의 일부로 필요한 작업을 일시 중지하면 동일한 출처의 다른 열린 탭에 영향을 미칠 수 있습니다(동일한 IndexedDB 데이터베이스는 여러 탭에서 동시에 액세스할 수 있기 때문). 결과적으로 브라우저는 일반적으로 IndexedDB 트랜잭션 중간에 페이지를 캐시하거나 다른 페이지에 영향을 줄 수 있는 API를 사용하지 않습니다.

다양한 API 사용이 페이지의 bfcache 자격에 미치는 영향에 대한 자세한 내용은 아래의 [bfcache에 맞게 페이지 최적화](#optimize-your-pages-for-bfcache)를 참조하세요.

### bfcache를 관찰하는 API

bfcache는 브라우저가 자동으로 수행하는 최적화이지만 개발자는 [페이지를 최적화](#optimize-your-pages-for-bfcache)하고 그에 따라 [모든 메트릭 또는 성능 측정을 조정할 수 있도록 언제 발생하는지 아는 것](#implications-for-analytics-and-performance-measurement)이 여전히 중요합니다.

bfcache를 관찰하는 데 사용되는 주요 이벤트는 [페이지 전환 이벤트](https://developer.mozilla.org/docs/Web/API/PageTransitionEvent)(`pageshow` 및 `pagehide`)로, bfcache가 있는 동안 계속 존재했으며 [현재 사용 중인 거의 모든 브라우저](https://caniuse.com/page-transition-events)에서 지원됩니다.

새로운 [페이지 수명 주기](https://developer.chrome.com/blog/page-lifecycle-api/) 이벤트(`freeze` 및 `resume`)는 페이지가 bfcache에 들어오거나 나갈 때뿐만 아니라 다른 상황에서도 전달됩니다. 예를 들어 CPU 사용량을 최소화하기 위해 백그라운드 탭이 정지되는 경우입니다. 페이지 수명 주기 이벤트는 현재 Chromium 기반 브라우저에서만 지원됩니다.

#### bfcache에서 페이지가 복원될 때 관찰

`pageshow` 이벤트는 페이지가 처음 로드될 때와 페이지가 bfcache에서 복원될 때 `load` 이벤트 직후에 발생합니다. `pageshow` 이벤트에는 <code>[persisted](https://developer.mozilla.org/docs/Web/API/PageTransitionEvent/persisted)</code> 속성이 있으며, 페이지가 bfcache에서 복원된 경우 <code>true</code>이고 그렇지 않은 경우 <code>false</code>입니다. <code>persisted</code> 속성을 사용하여 일반 페이지 로드와 bfcache 복원을 구별할 수 있습니다. 예시:

```js
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    console.log('This page was restored from the bfcache.');
  } else {
    console.log('This page was loaded normally.');
  }
});
```

페이지 수명 주기 API를 지원하는 브라우저에서 `resume` 이벤트는 `pageshow` 이벤트 직전에 페이지가 bfcache에서 복원될 때도 발생하지만, 사용자가 고정된 배경 탭을 다시 방문할 때도 발생합니다. 페이지 고정 후(bfcache에 페이지 포함) 페이지 상태를 복원하려면 `resume` 이벤트를 사용할 수 있지만 사이트의 bfcache 적중률을 측정하려면 `pageshow` 이벤트를 사용해야 합니다. 어떤 경우에는 둘 다 사용해야 할 수도 있습니다.

{% Aside %} bfcache 측정 권장사항에 대한 자세한 내용은 [성능 및 분석에 대한 의미](#how-bfcache-affects-analytics-and-performance-measurement)를 참조하세요. {% endAside %}

#### 페이지가 bfcache에 들어갈 때 관찰

`pagehide` 이벤트는 `pageshow` 이벤트에 대응합니다. `pageshow` 이벤트는 페이지가 정상적으로 로드되거나 bfcache에서 복원될 때 발생합니다. `pagehide` 이벤트는 페이지가 정상적으로 언로드되거나 브라우저가 이를 bfcache에 넣으려고 할 때 발생합니다.

`pagehide` 이벤트에도 `persisted` 속성이 있으며 이것이 `false` 이면 페이지가 bfcache에 들어가지 않을 것이라고 확신할 수 있습니다. 그러나 `persisted` 속성이 `true` 페이지가 캐시된다는 보장이 없습니다. 즉, 브라우저 *가 페이지를 캐시하려고* 하지만 캐시를 불가능하게 하는 요인이 있을 수 있습니다.

```js
window.addEventListener('pagehide', (event) => {
  if (event.persisted === true) {
    console.log('This page *might* be entering the bfcache.');
  } else {
    console.log('This page will unload normally and be discarded.');
  }
});
```

유사하게, `freeze` 이벤트는 `pagehide` 이벤트 직후에 실행되지만(이벤트의 `persisted` 속성이 `true`인 경우), 다시 말하지만 이는 브라우저가 페이지를 캐시*하려고 한다는 의미*일 뿐입니다. 아래에 설명된 여러 가지 이유로 여전히 이를 버려야 할 수 있습니다.

## bfcache에 맞게 페이지 최적화

모든 페이지가 bfcache에 저장되는 것은 아니며 페이지가 거기에 저장되더라도 무기한 유지되지는 않습니다. 개발자가 캐시 적중률을 최대화하기 위해 페이지가 bfcache에 적합한(및 부적격) 이유를 이해하는 것이 중요합니다.

다음 섹션에서는 가능한 한 브라우저가 페이지를 캐시할 수 있도록 하는 모범 사례에 대해 설명합니다.

### `unload` 이벤트 사용 금지

모든 브라우저에서 bfcache를 최적화하는 가장 중요한 방법은 `unload` 이벤트를 사용하지 않는 것입니다. 항상!

`unload` 이벤트는 bfcache보다 앞서고 `unload` 이벤트가 발생한 후 페이지가 계속 존재하지 않을 것이라는 (합리적) 가정 하에 인터넷 상의 많은 페이지가 작동하기 때문에 브라우저에 문제가 있습니다. *또한*, 이러한 페이지의 대부분은 사용자가 탐색할 때마다 `unload` 이벤트가 발생한다는 가정 하에 작성되었기 때문에 더 이상 사실이 아니며 [오랫동안 사실이 아니었습니다](https://developer.chrome.com/blog/page-lifecycle-api/#the-unload-event).

따라서 브라우저는 딜레마에 직면해 있으며 사용자 경험을 개선할 수 있지만 페이지가 깨질 위험이 있는 것 중에서 선택해야 합니다.

`unload` 리스너를 추가하는 경우 bfcache에 부적격 페이지를 선택했습니다. 이는 덜 위험하지만 *많은* 페이지의 자격을 박탈합니다. `unload` 이벤트 리스너를 사용하여 일부 페이지를 캐시하려고 시도하지만 잠재적인 파손을 줄이기 위해 `unload` 이벤트를 실행하지 않아 이벤트를 매우 신뢰할 수 없게 만듭니다.

`unload` 이벤트를 사용하는 대신 페이지 `pagehide` 이벤트를 사용하십시오. `pagehide` 이벤트 모든 경우에 화재 `unload` 페이지가 bfcache에 넣어 때 이벤트가 현재 발사, *또한* 발생합니다.

실제로, [Lighthouse v6.2.0](https://github.com/GoogleChrome/lighthouse/releases/tag/v6.2.0)는 <code>[no-unload-listeners audit](https://github.com/GoogleChrome/lighthouse/pull/11085)</code>를 추가했는데, 이는 (타사 라이브러리의 JavaScript를 포함하여) 페이지에 있는 JavaScript가 <code>unload</code> 이벤트 수신기를 추가할 경우 개발자에게 경고합니다.

{% Aside 'warning' %} `unload` 이벤트 리스너를 추가하지 마세요! 대신 페이지 `pagehide` 이벤트를 사용하십시오. `unload` 이벤트 리스너를 추가하면 Firefox에서 사이트 속도가 느려지고 대부분의 경우 Chrome 및 Safari에서 코드가 실행되지 않습니다. {% endAside %}

#### 조건부로 `beforeunload` 리스너만 추가

`beforeunload` 이벤트는 Chrome 또는 Safari에서 페이지를 bfcache에 부적격하게 만들지 않지만 Firefox에서는 부적격하게 만들므로 절대적으로 필요한 경우가 아니면 사용하지 마십시오.

`unload` 이벤트와 달리 `beforeunload`에 대한 합법적인 용도가 있습니다. 예를 들어 저장하지 않은 변경 사항이 있음을 사용자에게 경고하려는 경우 사용자가 페이지를 떠나면 손실됩니다. 이 경우 `beforeunload` 리스너를 추가하고 저장되지 않은 변경 사항이 저장된 직후 제거하는 것이 좋습니다.

{% Compare 'worse' %}

```js
window.addEventListener('beforeunload', (event) => {
  if (pageHasUnsavedChanges()) {
    event.preventDefault();
    return event.returnValue = 'Are you sure you want to exit?';
  }
});
```

{% CompareCaption %} 위의 코드는 `beforeunload` 리스너를 추가합니다. {% endCompareCaption %} {% endCompare %}

{% Compare 'better' %}

```js
function beforeUnloadListener(event) {
  event.preventDefault();
  return event.returnValue = 'Are you sure you want to exit?';
};

// A function that invokes a callback when the page has unsaved changes.
onPageHasUnsavedChanges(() => {
  window.addEventListener('beforeunload', beforeUnloadListener);
});

// A function that invokes a callback when the page's unsaved changes are resolved.
onAllChangesSaved(() => {
  window.removeEventListener('beforeunload', beforeUnloadListener);
});
```

{% CompareCaption %} 위의 코드는 `beforeunload` 리스너를 추가합니다(필요하지 않은 경우 제거). {% endCompareCaption %} {% endCompare %}

### window.opener 참조 피하기

일부 브라우저(Chromium 기반 브라우저 포함)에서 <code>[window.open()](https://developer.mozilla.org/docs/Web/API/Window/open)</code> 또는 <code>[target=_blank](https://developer.mozilla.org/docs/Web/HTML/Element/a#target)</code>가 있는 링크에서 ([버전 88에 대해 Chromium 기반 브라우저 우선](https://crbug.com/898942))를 사용하여 페이지를 열었을 경우(<code>[rel="noopener"](https://developer.mozilla.org/docs/Web/HTML/Link_types/noopener)</code>를 지정하지 않고) 열린 페이지의 창 오브젝트에 대한 참조가 열립니다.

[보안 위험이 있을](https://mathiasbynens.github.io/rel-noopener/) 뿐만 아니라 null이 아닌 <code>[window.opener](https://developer.mozilla.org/docs/Web/API/Window/opener)</code> 참조가 있는 페이지는 bfcache에 안전하게 넣을 수 없습니다. 액세스를 시도하는 모든 페이지가 손상될 수 있습니다.

`rel="noopener"`를 사용하여 `window.opener` 참조를 생성하지 않는 것이 가장 좋습니다. 사이트에서 창을 열고 <code>[window.postMessage()](https://developer.mozilla.org/docs/Web/API/Window/postMessage)</code>를 통해 창을 제어하거나 창 개체를 직접 참조해야 하는 경우 열린 창 둘 다 오프너도 bfcache에 적합하지 않습니다.

### 사용자가 다른 곳으로 이동하기 전에 항상 열려 있는 연결 닫기

위에서 언급했듯이 페이지를 bfcache에 넣으면 모든 예약된 JavaScript 작업이 일시 중지되고 페이지가 캐시에서 제거될 때 다시 시작됩니다.

이러한 예약된 JavaScript 작업이 DOM API에만 액세스하거나 현재 페이지에만 격리된 다른 API에 액세스하는 경우 페이지가 사용자에게 표시되지 않는 동안 이러한 작업을 일시 중지해도 문제가 발생하지 않습니다.

그러나 이러한 작업이 동일한 출처의 다른 페이지에서도 액세스할 수 있는 API에 연결된 경우(예: IndexedDB, Web Locks, WebSockets 등) 이러한 작업을 일시 중지하면 다른 탭의 코드가 실행되지 않을 수 있으므로 문제가 될 수 있습니다. .

결과적으로 일부 브라우저는 다음 시나리오에서 페이지를 bfcache에 넣지 않습니다.

- [IndexedDB 연결](https://developer.mozilla.org/docs/Web/API/IDBOpenDBRequest)이 열려 있는 페이지
- 진행 중인 [fetch()](https://developer.mozilla.org/docs/Web/API/Fetch_API) 또는 [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)가 있는 페이지
- [열린 WebSocket](https://developer.mozilla.org/docs/Web/API/WebSocket) 또는 [WebRTC](https://developer.mozilla.org/docs/Web/API/WebRTC_API) 연결이 있는 페이지

`pagehide` 또는 `freeze` 이벤트 중에 항상 연결을 닫고 관찰자를 제거하거나 연결을 끊는 것이 가장 좋습니다. 그러면 브라우저가 열려 있는 다른 탭에 영향을 줄 위험 없이 페이지를 안전하게 캐시할 수 있습니다.

그런 다음 페이지가 bfcache에서 복원되면 해당 API를 다시 열거나 다시 연결할 수 있습니다(`pageshow` 또는 `resume` 이벤트).

다음 예는 `pagehide` 이벤트 수신기에서 열린 연결을 닫아서 IndexedDB를 사용할 때 페이지가 bfcache에 적합한지 확인하는 방법을 보여줍니다.

```js
let dbPromise;
function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open('my-db', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('keyval');
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  }
  return dbPromise;
}

// Close the connection to the database when the user is leaving.
window.addEventListener('pagehide', () => {
  if (dbPromise) {
    dbPromise.then(db => db.close());
    dbPromise = null;
  }
});

// Open the connection when the page is loaded or restored from bfcache.
window.addEventListener('pageshow', () => openDB());
```

### bfcache 복원 후 오래되거나 민감한 데이터 업데이트

사이트에서 사용자 상태(특히 민감한 사용자 정보)를 유지하는 경우 bfcache에서 페이지를 복원한 후 해당 데이터를 업데이트하거나 지워야 합니다.

예를 들어, 사용자가 체크아웃 페이지로 이동한 다음 장바구니를 업데이트하는 경우 bfcache에서 오래된 페이지가 복원되면 뒤로 탐색 시 잠재적으로 오래된 정보가 표시될 수 있습니다.

더 중요한 또 다른 예는 사용자가 공용 컴퓨터의 사이트에서 로그아웃하고 다음 사용자가 뒤로 버튼을 클릭하는 경우입니다. 이는 사용자가 로그아웃할 때 지워졌다고 가정한 개인 데이터를 잠재적으로 노출할 수 있습니다.

`event.persisted`가 `true`인 경우 `pageshow` 이벤트 이후에 항상 페이지를 업데이트하는 것이 좋습니다.

`pageshow` 이벤트에 사이트별 쿠키가 있는지 확인하고 쿠키가 없으면 다시 로드합니다.

```js
window.addEventListener('pageshow', (event) => {
  if (event.persisted && !document.cookie.match(/my-cookie/)) {
    // Force a reload if the user has logged out.
    location.reload();
  }
});
```

### 페이지가 캐시 가능한지 테스트

Chrome DevTools는 페이지를 테스트하여 bfcache에 최적화되어 있는지 확인하고 해당 페이지가 자격을 갖추지 못하게 하는 문제를 식별하는 데 도움이 될 수 있습니다.

특정 페이지를 테스트하려면 Chrome에서 해당 페이지로 이동한 다음 DevTools에서 **애플리케이션** &gt; **캐시 뒤로-앞으로**로 이동합니다. 다음으로 **테스트 실행** 버튼을 클릭하면 DevTools가 페이지를 bfcache에서 복원할 수 있는지 여부를 확인하기 위해 이전 및 뒤로 탐색을 시도합니다.

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/QafTzULUNflaSh77zBgT.png", alt="DevTools의 캐시 패널 뒤로-앞으로", width="800", height="313" %}

{% Aside %} DevTools의 뒤로/앞으로 캐시 기능은 현재 개발 중입니다. 개발자는 Chrome Canary에서 페이지를 테스트하여 최신 버전의 DevTools를 실행하고 최신 bfcache 권장 사항을 받을 것을 적극 권장합니다. {% endAside %}

성공하면 패널에서 "역방향 캐시에서 복원됨"을 보고합니다.

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/vPwN0z95ZBTiwZIpdZT4.png", alt="DevTools 보고 페이지가 bfcache에서 성공적으로 복원되었습니다", width="800", height="313" %}

실패하면 패널에 페이지가 복원되지 않았으며 이유가 나열됩니다. 그 이유가 개발자로서 해결할 수 있는 것이라면 다음과 같이 표시됩니다.

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/ji3ew4DoP6joKdJvtGwa.png", alt="DevTools가 bfcache에서 페이지 복원 실패 보고", width="800", height="313" %}

위의 스크린샷에서 `unload` 이벤트 리스너를 사용하면 페이지가 bfcache에 [적합하지 않습니다](/bfcache/#never-use-the-unload-event). 대신 `unload`에서 `pagehide`를 사용하여 이 문제를 해결할 수 있습니다.

{% Compare 'worse' %}

```js
window.addEventListener('unload', ...);
```

{% endCompare %}

{% Compare 'better' %}

```js
window.addEventListener('pagehide', ...);
```

{% endCompare %}

## bfcache가 분석 및 성능 측정에 미치는 영향

분석 도구를 사용하여 사이트 방문을 추적하는 경우 Chrome에서 더 많은 사용자를 위해 bfcache를 계속 활성화함에 따라 보고된 총 페이지뷰 수가 감소하는 것을 알 수 있습니다.

사실, 대부분의 인기 있는 분석 라이브러리가 bfcache 복원을 새 페이지뷰로 추적하지 않기 때문에 bfcache를 구현하는 다른 브라우저의 페이지뷰를 *이미* 과소보고하고 있을 수 있습니다.

Chrome에서 bfcache를 활성화하여 페이지뷰 수가 감소하지 않도록 하려면 `pageshow` 이벤트를 듣고  `persisted` 속성을 확인하여 bfcache 복원을 페이지뷰(권장)로 보고할 수 있습니다.

다음 예는 Google Analytics로 이 작업을 수행하는 방법을 보여줍니다. 로직은 다른 분석 도구와 유사해야 합니다.

```js
// Send a pageview when the page is first loaded.
gtag('event', 'page_view');

window.addEventListener('pageshow', (event) => {
  if (event.persisted === true) {
    // Send another pageview if the page is restored from bfcache.
    gtag('event', 'page_view');
  }
});
```

### 성능 측정

bfcache는 또한 [필드에서](/user-centric-performance-metrics/#in-the-field) 수집된 성능 메트릭, 특히 페이지 로드 시간을 측정하는 메트릭에 부정적인 영향을 미칠 수 있습니다.

bfcache 탐색은 새 페이지 로드를 시작하지 않고 기존 페이지를 복원하므로 bfcache가 활성화되면 수집된 총 페이지 로드 수가 감소합니다. 그러나 중요한 것은 bfcache 복원으로 대체되는 페이지 로드가 데이터 세트에서 가장 빠른 페이지 로드 중 일부였을 가능성이 있다는 것입니다. 이는 정의상 뒤로 및 앞으로 탐색이 반복 방문이고 반복 페이지 로드가 일반적으로 첫 번째 방문자의 페이지 로드보다 빠르기 때문입니다(앞서 언급한 [HTTP 캐싱](/http-cache/)으로 인해).

결과적으로 데이터 세트의 빠른 페이지 로드가 줄어들어 사용자가 경험하는 성능이 향상되었을 수 있음에도 불구하고 분포가 더 느리게 왜곡될 수 있습니다!

이 문제를 처리하는 몇 가지 방법이 있습니다. 하나는 모든 페이지 로드 메트릭에 각각의 [탐색 유형(](https://www.w3.org/TR/navigation-timing-2/#sec-performance-navigation-types)`navigate` , `reload` , `back_forward` 또는 `prerender`)을 주석으로 추가하는 것입니다. 이렇게 하면 전체 분포가 음수로 치우치더라도 이러한 탐색 유형 내에서 성능을 계속 모니터링할 수 있습니다. 이 접근 방식은 [TTFB(Time to First Byte)](/ttfb/)와 같은 사용자 중심이 아닌 페이지 로드 메트릭에 권장됩니다.

[Core Web Vitals](/vitals/)와 같은 사용자 중심 메트릭의 경우 더 나은 옵션은 사용자 경험을 보다 정확하게 나타내는 값을 보고하는 것입니다.

{% Aside 'caution' %} [Navigation Timing API](https://www.w3.org/TR/navigation-timing-2/#sec-performance-navigation-types)에서 `back_forward` 탐색 유형은 bfcache 복원과 혼동되어서는 안 됩니다. Navigation Timing API는 페이지 로드에만 주석을 다는 반면 bfcache 복원은 이전 탐색에서 로드된 페이지를 재사용합니다. {% endAside %}

### 핵심 Web Vitals에 미치는 영향

[Core Web Vitals](/vitals/)는 다양한 차원(로딩 속도, 상호 작용, 시각적 안정성)에 걸쳐 웹 페이지에 대한 사용자 경험을 측정하고 사용자는 bfcache 복원을 기존 페이지 로드보다 더 빠른 탐색으로 경험하기 때문에 Core Web Vitals 메트릭이 이를 반영하는 것이 중요합니다. 결국 사용자는 bfcache가 활성화되었는지 여부를 신경 쓰지 않고 탐색이 빠르기만 하면 됩니다!

Core Web Vitals 측정항목을 수집하고 보고하는 [Chrome 사용자 경험 보고서](https://developer.chrome.com/docs/crux/)와 같은 도구는 bfcache 복원을 데이터세트에서 별도의 페이지 방문으로 처리합니다.

bfcache 복원 후 이러한 메트릭을 측정하기 위한 전용 웹 성능 API는 (아직) 없지만 기존 웹 API를 사용하여 해당 값을 근사화할 수 있습니다.

- [가장 큰 콘텐츠가 포함된 페인트(LCP)](/lcp/)의 `pageshow` 이벤트의 타임스탬프와 다음으로 칠해진 프레임의 타임스탬프 사이의 델타를 사용할 수 있습니다(프레임의 모든 요소가 동시에 칠해지기 때문). bfcache 복원의 경우 LCP와 FCP가 동일합니다.
- [FID(First Input Delay](/fid/) )의 경우 `pageshow` 이벤트에서 이벤트 리스너([FID polyfill](https://github.com/GoogleChromeLabs/first-input-delay)에서 사용하는 것과 동일)를 다시 추가하고 FID를 bfcache 복원 후 첫 번째 입력의 지연으로 보고할 수 있습니다.
- [CLS(Cumulative Layout Shift)](/cls/)의 경우 기존 성능 관찰자를 계속 사용할 수 있습니다. 현재 CLS 값을 0으로 재설정하기만 하면 됩니다.

bfcache가 각 측정항목에 미치는 영향에 대한 자세한 내용은 개별 핵심 핵심 성능 [메트릭 가이드 페이지](/vitals/#core-web-vitals)를 참조하세요. 그리고 코드에서 이러한 메트릭의 bfcache 버전을 구현하는 방법에 대한 구체적인 예는 [web-vitals JS 라이브러리에 추가](https://github.com/GoogleChrome/web-vitals/pull/87)하는 PR을 참조하십시오.

{% Aside %} `v1`부터 [web-vitals](https://github.com/GoogleChrome/web-vitals) JavaScript 라이브러리는 보고하는 메트릭에서 [bfcache 복원을 지원](https://github.com/GoogleChrome/web-vitals/pull/87)합니다. `v1` 이상을 사용하는 개발자는 코드를 업데이트할 필요가 없습니다. {% endAside %}

## 추가 리소스

- [Firefox 캐싱](https://developer.mozilla.org/Firefox/Releases/1.5/Using_Firefox_1.5_caching) *(Firefox의 bfcache)*
- [페이지 캐시](https://webkit.org/blog/427/webkit-page-cache-i-the-basics/) *(Safari의 bfcache)*
- [캐시 뒤로/앞으로: 웹에 노출된 동작](https://docs.google.com/document/d/1JtDCN9A_1UBlDuwkjn1HWxdhQ1H2un9K4kyPLgBqJUc/edit?usp=sharing) *(브라우저 간 bfcache 차이)*
- [bfcache 테스터](https://back-forward-cache-tester.glitch.me/?persistent_logs=1) *(다양한 API와 이벤트가 브라우저에서 bfcache에 미치는 영향 테스트)*
