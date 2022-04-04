---
layout: post
title: 서비스 워커와 Cache Storage API
authors:
  - jeffposnick
date: 2018-11-05
updated: 2020-02-27
description: 브라우저의 HTTP 캐시는 첫 번째 방어선입니다. 이것은 반드시 가장 강력하거나 유연한 접근 방식이 아니며, 캐시 된 응답의 수명을 제한적으로 통제할 수 있습니다. 하지만 많은 작업 없이 합리적인 캐싱을 구현하는 여러 가지 경험에 바탕을 둔 법칙이 있으므로, 이를 항상 따라야 합니다.
---

네트워크 안정성을 갖추는 것은 어렵습니다. 브라우저의 HTTP 캐시는 첫 번째 방어선이지만 이미 배웠듯이 이전에 방문한 적이 있는 버전이 지정된 URL을 로드할 때만 실제로 효과적입니다. HTTP 캐시만으로는 충분하지 않습니다.

다행스럽게도 [서비스 워커](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) 와 [Cache Storage API](https://developer.mozilla.org/docs/Web/API/CacheStorage) 라는 두 가지 새로운 도구를 사용하여 상황을 쉽게 바꿀 수 있습니다. 함께 사용되는 경우가 많아서 두 가지를 동시에 배울 가치가 있습니다.

## 서비스 워커

서비스 워커는 브라우저에 내장되어 있으며 생성을 담당하는 약간의 추가 JavaScript 코드가 이를 제어합니다. 실제 웹 애플리케이션을 구성하는 다른 파일과 함께 이를 배포합니다.

서비스 워커에게는 몇 가지 특별한 권한이 있습니다. 다른 임무 도중 웹 앱이 외부로 나가는 요청 할 때까지 참을성 있게 기다린 다음 이를 가로채서 조치를 취합니다. 이 가로채어진 요청으로 서비스 워커가 수행하는 작업은 사용자에게 달려 있습니다.

일부 요청의 경우 서비스 작업자가 전혀 없는 경우와 마찬가지로 네트워크에서 요청을 계속하도록 허용하는 것이 최선의 조치일 수 있습니다.

그러나 다른 요청의 경우 브라우저의 HTTP 캐시보다 유연한 것을 활용하고 네트워크에 대해 걱정할 필요 없이 안정적으로 빠른 응답을 반환할 수 있습니다. 여기에는 퍼즐의 다른 부분인 Cache Storage API를 사용해야 합니다.

## Cache Storage API

Cache Storage API는 개발자가 캐시 내용을 완벽하게 제어할 수 있도록 하여 완전히 새로운 가능성을 열어줍니다. Cache Storage API는 HTTP 헤더와 브라우저의 기본 제공 [휴리스틱](https://httpwg.org/specs/rfc7234.html#heuristic.freshness)의 조합에 의존하는 대신 캐싱에 대한 코드 기반 접근 방식을 제공합니다. Cache Storage API는 서비스 워커의 JavaScript에서 호출할 때 특히 유용합니다.

### 잠깐… 지금 생각할 다른 캐시가 있습니까?

"아직도 HTTP 헤더를 구성해야 합니까?"와 같은 질문을 스스로에게 하고 있을 것입니다. "HTTP 캐시로는 불가능했던 이 새로운 캐시로 무엇을 할 수 있습니까?" 걱정하지 마세요. 자연스러운 반응입니다.

Cache Storage API를 사용하고 있다는 것을 알고 있더라도 웹 서버 `Cache-Control` 헤더를 구성하는 것이 좋습니다. 일반적으로 버전이 지정되지 않은 URL의 경우 `Cache-Control: no-cache`를 설정하고, 해시와 같은 버전 정보가 포함된 URL의 경우 `Cache-Control: max-age=31536000`를 설정합니다.

Cache Storage API 캐시를 채울 때 브라우저는 [기본적으로 HTTP 캐시의 기존 항목을 확인하고](https://jakearchibald.com/2016/caching-best-practices/#the-service-worker-the-http-cache-play-well-together-dont-make-them-fight) 발견된 경우 이를 사용합니다. 버전이 지정된 URL을 Cache Storage API 캐시에 추가하는 경우 브라우저는 추가 네트워크 요청을 방지합니다. 반대로 버전이 지정되지 않은 URL에 대해 수명이 긴 캐시 수명을 지정하는 것과 같이 `Cache-Control` 헤더를 사용하는 경우 해당 오래된 콘텐츠를 Cache Storage API에 추가하여 [상황을 악화시킬 수 있습니다.](https://jakearchibald.com/2016/caching-best-practices/#a-service-worker-can-extend-the-life-of-these-bugs) HTTP 캐시 동작을 정렬하는 것은 Cache Storage API를 효과적으로 사용하기 위한 전제 조건입니다.

이 새로운 API로 현재 가능한 일은 많습니다. HTTP 캐시만으로는 어렵거나 불가능한 몇 가지 일반적인 용도는 다음과 같습니다.

- stale-while-revalidate라고 하는 캐시 된 콘텐츠에 "백그라운드에서 새로 고침" 접근 방식을 사용합니다.
- 캐시 할 자산의 최대 수에 상한선을 설정하고 해당 제한에 도달하면 항목을 제거하는 사용자 지정 만료 정책을 구현합니다.
- 이전에 캐시 된 네트워크 응답과 최신 네트워크 응답을 비교하여 변경된 사항이 있는지 확인하고 데이터가 실제로 업데이트되었을 때 사용자가 콘텐츠(예: 버튼 사용)를 업데이트할 수 있도록 합니다.

[Cache API: 빠른 가이드](/cache-api-quick-guide/)에서 자세한 내용을 확인하세요.

### API 너트 및 볼트

API 설계에 대해 염두에 두어야 할 몇 가지 사항이 있습니다.

- [`Request`](https://developer.mozilla.org/docs/Web/API/Request) 개체는 이러한 캐시를 읽고 쓸 때 고유 키로 사용됩니다. 편의상 실제 `Request` `'https://example.com/index.html'`과 같은 URL 문자열을 키로 전달할 수 있으며 API가 자동으로 이를 처리합니다.
- [`Response`](https://developer.mozilla.org/docs/Web/API/Response) 개체는 이러한 캐시의 값으로 사용됩니다.
- 주어진 `Response`의 `Cache-Control` 헤더는 데이터를 캐싱할 때 효과적으로 무시됩니다. 자동 만료, 빌트인 만료 또는 새로고침 검사가 없으며 캐시에 항목을 저장하면 코드에서 명시적으로 제거할 때까지 유지됩니다. (사용자를 대신하여 캐시 유지 관리를 단순화하는 라이브러리가 있습니다. 이 시리즈의 뒷부분에서 다룰 것입니다.)
- [`LocalStorage`](https://developer.mozilla.org/docs/Web/API/Storage/LocalStorage)와 같은 이전의 동기 API와 달리 모든 Cache Storage API 작업은 비동기입니다.

## 빠른 우회: promise 및 async/await

서비스 워커와 Cache Storage API는 [비동기 프로그래밍 개념](https://en.wikipedia.org/wiki/Asynchrony_(computer_programming))을 사용합니다. 특히 비동기 작업의 미래 결과를 나타내기 위해 promise에 크게 의존합니다. 들어가기 전에 [promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) 및 관련 [`async`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)/[`await`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/await) 문법에 익숙해져야 합니다.

{% Aside 'codelab' %} [서비스 워커를 등록하여 애플리케이션을 안정적으로 만드세요](/codelab-service-workers). {% endAside %}

## 아직… 해당 코드를 배포하지 마세요

서비스 워커와 Cache Storage API는 중요한 기반을 제공하고, 있는 그대로 사용할 수 있지만, 여러 가지 경우와 "문제가 있는 부분"이 있는 사실상 낮은 수준의 빌딩 블록입니다. 이러한 API의 어려운 부분을 매끄럽게 하고 프로덕션 준비 서비스 작업자를 구축하는 데 필요한 모든 것을 제공할 수 있는 몇 가지 상위 수준 도구가 있습니다. 다음 가이드에서는 이러한 도구 중 하나인 [Workbox](https://developer.chrome.com/docs/workbox/)에 대해 설명합니다.

{% Aside 'success' %} 즐기면서 배우세요. [새로운 Service Workies 게임](https://serviceworkies.com/)을 확인하세요!{% endAside %}
