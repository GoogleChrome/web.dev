---
title: 웹용 스토리지
subhead: 브라우저에 데이터를 저장하기 위한 다양한 옵션이 있습니다. 여러분의 요구 사항에 가장 적합한 것은 무엇일까요?
authors:
  - petelepage
description: 브라우저에 데이터를 저장하기 위한 다양한 옵션이 있습니다. 여러분의 요구 사항에 가장 적합한 것은 무엇일까요?
date: 2020-04-27
updated: 2021-02-11
tags:
  - blog
  - progressive-web-apps
  - storage
  # - indexeddb
  # - cachestorage
  - memory
hero: image/admin/c8u2hKEFoFfgTsmcKeuK.jpg
alt: 선적 컨테이너 더미
feedback:
  - api
---

인터넷 연결은 이동 중에 불안정하거나 부재할 수 있으므로 [프로그레시브 웹 앱](/progressive-web-apps/)의 공통적인 특징으로 오프라인 지원과 안정적인 성능이 포함되어야 합니다. 완벽한 무선 환경에서도 캐싱 및 기타 스토리지 기술을 적절하게 이용하면 사용자 경험을 크게 향상시킬 수 있습니다. 정적 애플리케이션 리소스(HTML, JavaScript, CSS, 이미지 등) 및 데이터(사용자 데이터, 뉴스 기사 등)를 캐싱하는 방법에는 여러 가지가 있습니다. 그렇다면 가장 좋은 솔루션은 무엇일까요? 얼마나 저장할 수 있을까요? 제거되는 것을 어떻게 방지할 수 있을까요?

## 무엇을 사용해야 할까요? {: #recommendation }

리소스 저장에 대한 일반적인 권장 사항은 다음과 같습니다.

- 앱 및 파일 기반 콘텐츠를 로드하는 데 필요한 네트워크 리소스의 경우, [**Cache Storage API**](/cache-api-quick-guide/)([서비스 작업자](https://developer.chrome.com/docs/workbox/service-worker-overview/)의 일부)를 사용합니다.
- 다른 데이터의 경우, [**IndexedDB**](https://developer.mozilla.org/docs/Web/API/IndexedDB_API)([promise wrapper](https://www.npmjs.com/package/idb) 포함)를 사용합니다.

IndexedDB 및 Cache Storage API는 모든 최신 브라우저에서 지원됩니다. 둘 모두 비동기식이며 메인 스레드를 차단하지 않습니다. 이러한 API는 `window` 개체, 웹 작업자 및 서비스 작업자에서 액세스할 수 있으므로 코드의 어디에서나 쉽게 사용할 수 있습니다.

## 다른 스토리지 메커니즘은 어떻습니까? {: #other }

브라우저에서 사용할 수 있는 몇 가지 다른 스토리지 메커니즘이 있지만 사용이 제한되어 있어 심각한 성능 문제를 일으킬 수 있습니다.

[SessionStorage](https://developer.mozilla.org/en/docs/Web/API/Window/sessionStorage)는 탭에 특정하며 탭의 수명으로 범위가 한정됩니다. 이는 IndexedDB 키와 같은 소량의 세션 특정 정보를 저장하는 데 유용할 수 있습니다. 하지만 동기식이고 기본 스레드를 차단하므로 주의해서 사용해야 합니다. 약 5MB로 제한되며 문자열만 포함할 수 있습니다. 탭에 특정하기 때문에 웹 작업자나 서비스 작업자는 액세스할 수 없습니다.

[LocalStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage)는 동기식이며 기본 스레드를 차단하므로 사용을 피해야 합니다. 약 5MB로 제한되며 문자열만 포함할 수 있습니다. LocalStorage는 웹 작업자 또는 서비스 작업자가 액세스할 수 없습니다.

[쿠키](https://developer.mozilla.org/docs/Web/HTTP/Cookies)는 제 역할이 있지만 스토리지 목적으로는 사용하지 않아야 합니다. 쿠키는 모든 HTTP 요청과 함께 전송되므로 소량의 데이터 이상을 저장하면 모든 웹 요청의 크기가 크게 증가합니다. 동기식이며 웹 작업자가 액세스할 수 없습니다. LocalStorage 및 SessionStorage와 마찬가지로 쿠키는 문자열로만 제한됩니다.

[File System API](https://developer.mozilla.org/docs/Web/API/File_and_Directory_Entries_API/Introduction) 및 FileWriter API는 샌드박스 파일 시스템에 파일을 읽고 쓰기 위한 메서드를 제공합니다. 비동기식이지만 [Chromium 기반 브라우저에서만 사용할 수](https://caniuse.com/#feat=filesystem) 있으므로 권장하지 않습니다.

[File System Access API](/file-system-access/)는 사용자가 로컬 파일 시스템에서 파일을 쉽게 읽고 편집할 수 있도록 설계되었습니다. 페이지가 로컬 파일을 읽거나 쓸 수 있으려면 사용자가 권한을 부여해야 하며 권한은 세션 사이에서 유지되지 않습니다.

WebSQL은 사용하지 **않아야** 하며 기존의 사용은 IndexedDB로 마이그레이션해야 합니다. 거의 모든 주요 브라우저에서 지원이 [제거](https://caniuse.com/#feat=sql-storage)되었습니다. W3C는 2010년에 [Web SQL 사양 유지를 중단](https://www.w3.org/TR/webdatabase/)했으며 추가 업데이트 계획이 없습니다.

애플리케이션 캐시는 사용하지 **않아야** 하며 기존의 사용은 서비스 작업자와 Cache API로 마이그레이션해야 합니다. 이것은 [더 이상 사용되지 않으며](https://developer.mozilla.org/docs/Web/API/Window/applicationCache) 향후 브라우저에서 지원이 제거됩니다.

## 얼마나 많이 저장할 수 있나요? {: #how-much }

간단히 말해서, **많이 저장할 수 있으며** 적어도 수백 MB, 경우에 따라 수 GB 이상까지도 될 수 있습니다. 브라우저 구현은 다를 수 있지만 사용 가능한 저장 공간의 양은 일반적으로 장치에서 사용 가능한 저장 공간의 양에 따라 결정됩니다.

- Chrome은 브라우저가 전체 디스크 공간의 최대 80%까지 사용할 수 있도록 합니다. 오리진은 전체 디스크 공간의 최대 60%를 사용할 수 있습니다. [StorageManager API](#check)를 사용하여 사용 가능한 최대 할당량을 결정할 수 있습니다. 다른 Chromium 기반 브라우저에서는 더 많은 스토리지 사용을 허용할 수도 있습니다. Chrome 구현에 대한 자세한 내용은 [PR #3896](https://github.com/GoogleChrome/web.dev/pull/3896)을 참조하세요.
- Internet Explorer 10 이상은 최대 250MB까지 저장할 수 있으며 10MB 이상을 사용하면 사용자에게 메시지를 표시합니다.
- Firefox에서는 브라우저가 디스크 여유 공간의 최대 50%를 사용하도록 허용합니다. [eTLD+1](https://godoc.org/golang.org/x/net/publicsuffix) 그룹(예: `example.com`, `www.example.com` 및 `foo.bar.example.com`)은 [최대 2GB를 사용할 수 있습니다](https://developer.mozilla.org/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria#Storage_limits). [StorageManager API](#check-available)를 사용하여 아직 사용 가능한 공간을 확인할 수 있습니다.
- Safari(데스크톱 및 모바일 모두)는 약 1GB를 허용하는 것으로 보입니다. 제한에 도달하면 Safari에서 사용자에게 메시지를 표시하여 제한을 200MB 단위로 늘립니다. 이에 대한 공식 문서는 찾을 수 없었습니다.
    - PWA가 모바일 Safari의 홈 화면에 추가되면 새 스토리지 컨테이너를 생성하는 것으로 보이며 PWA와 모바일 Safari 간에는 아무것도 공유되지 않습니다. 설치된 PWA의 할당량에 도달하면 추가 스토리지를 요청할 방법이 없는 것 같습니다.

과거에는 사이트가 저장 데이터의 특정 한계를 초과하면 브라우저가 사용자에게 더 많은 데이터를 사용할 수 있는 권한을 부여하라는 메시지를 표시했습니다. 예를 들어, 오리진이 50MB 이상을 사용한 경우 브라우저는 사용자에게 최대 100MB까지 저장할 수 있도록 허용하라는 메시지를 표시하고 그 이후로는 50MB 단위로 다시 요청합니다.

오늘날 대부분의 최신 브라우저는 사용자에게 메시지를 표시하지 않으며 사이트에서 지정된 할당량까지 사용할 수 있도록 합니다. 750MB에서 메시지를 표시하여 최대 1.1GB까지 저장할 수 있는 권한을 요청하는 Safari의 경우는 예외입니다. 오리진이 지정된 할당량보다 더 많이 사용하려고 하면 추가적인 데이터 쓰기 시도가 실패합니다.

## 사용 가능한 저장 용량을 어떻게 확인할 수 있나요? {: #check }

[많은 브라우저](https://caniuse.com/#feat=mdn-api_storagemanager)에서 [StorageManager API](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate)를 사용하여 오리진에서 사용 가능한 스토리지의 양과 사용 중인 스토리지의 양을 확인할 수 있습니다. 이 API는 IndexedDB 및 Cache API에서 사용한 총 바이트 수를 보고하며 사용 가능한 대략적인 잔여 저장 공간을 계산할 수 있습니다.

```js
if (navigator.storage && navigator.storage.estimate) {
  const quota = await navigator.storage.estimate();
  // quota.usage -> Number of bytes used.
  // quota.quota -> Maximum number of bytes available.
  const percentageUsed = (quota.usage / quota.quota) * 100;
  console.log(`You've used ${percentageUsed}% of the available storage.`);
  const remaining = quota.quota - quota.usage;
  console.log(`You can write up to ${remaining} more bytes.`);
}
```

StorageManager는 아직 모든 브라우저에서 [구현](https://caniuse.com/#feat=mdn-api_storagemanager)되지 않았으므로 사용하기 전에 기능이 있는지 찾아야 합니다. 사용 가능한 경우에도 여전히 할당량 초과 오류를 파악해야 합니다(아래 참조). 경우에 따라 사용 가능한 할당량이 실제 사용 가능한 스토리지의 양을 초과할 수 있습니다.

{% Aside %} 다른 Chromium 기반 브라우저는 사용 가능한 할당량을 보고할 때 여유 공간의 양을 고려할 수 있습니다. Chrome은 그렇지 않으며 항상 실제 디스크 크기의 60%를 보고합니다. 그러면 저장된 교차 출처 리소스의 크기를 결정하기가 더 어려워집니다. {% endAside %}

### 검사

개발하는 동안 브라우저의 DevTools를 사용하여 다양한 스토리지 유형을 검사하고 저장된 모든 데이터를 쉽게 지울 수 있습니다.

스토리지 창에서 사이트의 스토리지 할당량을 무시할 수 있는 새로운 기능이 Chrome 88에 추가되었습니다. 이 기능을 사용하면 다양한 장치를 시뮬레이션하고 사용 가능한 디스크의 양이 부족할 때를 가정하고 앱의 동작을 테스트할 수 있습니다. **Application(애플리케이션)**, 그 다음 **Storage(스토리지)**로 이동하고 **Simulate custom storage quota(사용자 지정 스토리지 할당량 시뮬레이션)** 확인란을 선택한 후, 유효한 숫자를 입력하여 스토리지 할당량을 시뮬레이션합니다.

{% Img src="image/0g2WvpbGRGdVs0aAPc6ObG7gkud2/tYlbklNwF6DFKNV2cY0D.png", alt="DevTools 스토리지 창", width="800", height="567" %}

이 기사를 작성하는 동안 가능한 한 많은 스토리지를 빠르게 사용하기 위해 [간단한 도구](https://storage-quota.glitch.me/)를 작성했습니다. 이것은 다양한 저장 메커니즘을 실험하고 할당량을 모두 사용하면 어떻게 되는지 확인할 수 있는 빠르고 쉬운 방법입니다.

## 할당량 초과를 처리하는 방법은 무엇인가요? {: #over-quota }

할당량을 초과하면 어떻게 해야 할까요? `QuotaExceededError`이든 다른 무엇이든 쓰기 오류를 항상 포착하고 처리하는 것이 가장 중요합니다. 그런 다음 앱 설계에 따라 처리 방법을 결정합니다. 예를 들어 오랫동안 액세스하지 않은 콘텐츠를 삭제하거나, 크기를 기준으로 데이터를 제거하거나, 사용자가 삭제할 항목을 선택할 수 있는 방법을 제공합니다.

사용 가능한 할당량을 초과하면 IndexedDB와 Cache API 모두 `QuotaExceededError`라는 `DOMError`를 발생시킵니다.

### IndexedDB

오리진이 할당량을 초과하면 IndexedDB에 대한 쓰기 시도가 실패합니다. 그리고 트랜잭션의 `onabort()` 핸들러가 호출되어 이벤트를 전달합니다. 이 이벤트에는 오류 속성에 `DOMException`이 포함됩니다. `name` 오류를 확인하면 `QuotaExceededError`가 반환됩니다.

```js
const transaction = idb.transaction(['entries'], 'readwrite');
transaction.onabort = function(event) {
  const error = event.target.error; // DOMException
  if (error.name == 'QuotaExceededError') {
    // Fallback code goes here
  }
};
```

### Cache API

오리진이 할당량을 초과하면 Cache API에 대한 쓰기 시도가 `QuotaExceededError` `DOMException`을 발생시키며 거부됩니다.

```js
try {
  const cache = await caches.open('my-cache');
  await cache.add(new Request('/sample1.jpg'));
} catch (err) {
  if (error.name === 'QuotaExceededError') {
    // Fallback code goes here
  }
}
```

## 제거는 어떻게 이루어지나요? {: #eviction }

웹 스토리지는 "Best Effort"와 "Persistent"의 두 가지 버킷으로 분류됩니다. Best Effort는 사용자의 개입 없이 브라우저에서 저장소를 지울 수 있음을 의미하지만 장기 또는 중요한 데이터에는 내구성이 떨어집니다. Persistent 스토리지는 스토리지가 부족할 때 자동으로 지워지지 않습니다. 사용자가 브라우저 설정을 통해 이 스토리지를 직접 지워야 합니다.

기본적으로, 사이트의 데이터(IndexedDB, Cache API 등 포함)는 Best Effort의 범주에 속합니다. 즉, 사이트에서 [Persistent 스토리지를 요청](/persistent-storage/)하지 않았다면 브라우저가 예를 들어 장치 스토리지가 부족할 때 자유 판단에 따라 사이트 데이터를 제거할 수 있습니다.

Best Effort의 제거 정책은 다음과 같습니다.

- Chromium 기반 브라우저는 브라우저의 공간이 부족할 때 데이터 제거를 시작합니다. 최근 사용 빈도가 적은 오리진부터 시작하여 차례로 브라우저의 사용량 제한이 더 이상 초과되지 않을 때까지 모든 사이트 데이터가 삭제됩니다.
- Internet Explorer 10+는 데이터를 제거하지 않지만 오리진이 더 이상 쓰지 못하도록 합니다.
- Firefox는 사용 가능한 디스크 공간이 가득 차면 데이터를 제거하기 시작합니다. 최근 사용 빈도가 적은 오리진부터 시작하여 차례로 브라우저의 사용량 제한이 더 이상 초과되지 않을 때까지 모든 사이트 데이터가 삭제됩니다.
- Safari는 이전에 데이터를 제거하지 않았지만 최근에는 쓰기 가능한 모든 스토리지에 대해 새로운 7일 제한을 구현했습니다(아래 참조).

iOS 및 iPadOS 13.4, 및 macOS의 Safari 13.1부터 시작하여 IndexedDB, 서비스 작업자 등록 및 Cache API를 포함하여 모든 스크립트 쓰기 가능 스토리지에 7일 제한이 시행됩니다. 즉, 사용자가 사이트와 상호 작용하지 않으면 Safari가 Safari 사용 7일 후에 캐시에서 모든 콘텐츠를 제거합니다. 이 제거 정책은 홈 화면에 추가된 **설치된 PWA에는 적용되지 않습니다.** 자세한 내용은 WebKit 블로그에서 [전체 타사 쿠키 차단 등](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)을 참조하십시오.

{% Aside %} 중요한 사용자 또는 애플리케이션 데이터를 보호하기 위해 사이트에 [Persistent 스토리지](/persistent-storage/)를 요청할 수 있습니다. {% endAside %}

## 보너스: IndexedDB에 래퍼를 사용하는 이유

IndexedDB는 사용하기 전에 상당한 설정이 필요한 저수준 API로, 단순한 데이터를 저장할 때 특히 힘이 들 수 있습니다. 대부분의 최신 promise 기반 API와 달리 이 API는 이벤트 기반입니다. IndexedDB용 [idb](https://www.npmjs.com/package/idb)와 같은 Promise 래퍼는 일부 강력한 기능을 숨기지만, 더 중요한 것으로, IndexedDB 라이브러리와 함께 제공되는 복잡한 처리 작용(예: 트랜잭션, 스키마 버전 관리)도 숨깁니다.

## 결론

스토리지가 제한적인 시대는 지났고 사용자들은 더욱 더 많은 데이터를 저장하고 있습니다. 사이트는 실행에 필요한 모든 리소스와 데이터를 효과적으로 저장할 수 있습니다. [StorageManager API](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate)를 사용하면 사용 가능한 스토리지 양과 사용한 양을 확인할 수 있습니다. 그리고 [Persistent 스토리지](/persistent-storage/)를 사용하면 사용자가 제거하지 않는 한 데이터가 제거되지 않도록 보호할 수 있습니다.

### 추가 리소스

- [IndexedDB 모범 사례](/indexeddb-best-practices/)
- [Chrome 웹 스토리지 및 할당량 개념](https://docs.google.com/document/d/19QemRTdIxYaJ4gkHYf2WWBNPbpuZQDNMpUVf8dQxj4U/preview)

### 감사의 말

이 기사를 검토해준 Jarryd Goodman, Phil Walton, Eiji Kitamura, Daniel Murphy, Darwin Huang, Josh Bell, Marijn Kruissselbrink 및 Victor Costan에게 특별한 감사의 말을 전합니다. 이 글의 배경이 된 원본 기사를 작성한 Eiji Kitamura, Addy Osmani, Marc Cohen에게도 감사의 말을 전합니다. Eiji는 현재 동작을 확인하는 데 유용한 [Browser Storage Abuser](http://demo.agektmr.com/storage/)라는 유용한 도구를 제작했습니다. 이 도구를 사용하면 가능한 한 많은 데이터를 저장하고 브라우저의 스토리지 제한을 볼 수 있습니다. Safari를 파헤쳐 스토리지 한계를 알아낸 Francois Beaufort에게 감사드립니다.

영웅 이미지는 [Unsplash](https://unsplash.com/photos/uBe2mknURG4)에서 Guillaume Bolduc이 제공했습니다.
