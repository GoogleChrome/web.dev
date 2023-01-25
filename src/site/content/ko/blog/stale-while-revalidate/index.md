---
title: stale-while-revalidate로 최신 상태 유지
subhead: 웹 앱을 제공할 때 즉시성과 최신성의 균형을 유지하는 데 도움이 되는 추가 도구입니다.
authors:
  - jeffposnick
date: 2019-07-18
description: stale-while-revalidate는 개발자가 캐시된 콘텐츠를 즉시 로드하는 즉시성과 캐시된 콘텐츠에 대한 업데이트가 향후에 사용되도록 보장하는 최신성 간의 균형을 유지하는 데 도움이 됩니다.
hero: image/admin/skgQgcT3q8fdBGGNL3o1.jpg
alt: 반쯤 칠한 벽의 사진입니다.
tags:
  - blog
feedback:
  - api
---

## 제공된 것은?

[`stale-while-revalidate`](https://tools.ietf.org/html/rfc5861#section-3)는 개발자가 캐시된 *콘텐츠를 즉시 로드*하는 즉시성과 *캐시된 콘텐츠에 대한 업데이트가 향후에 사용되도록 보장*하는 최신성 간의 균형을 유지하는 데 도움이 됩니다. 정기적으로 업데이트되는 서드파티 웹 서비스 또는 라이브러리를 유지 관리하거나 자사 자산의 수명이 짧은 경향이 있는 경우 `stale-while-revalidate`가 기존 캐싱 정책에 유용한 추가 기능이 될 수 있습니다.

`Cache-Control`에서 `max-age`와 함께 `stale-while-revalidate` 설정 지원은 [Chrome 75](https://chromestatus.com/feature/5050913014153216) 및 [Firefox 68](https://bugzilla.mozilla.org/show_bug.cgi?id=1536511)에서 사용할 수 있습니다.

`stale-while-revalidate`를 지원하지 않는 브라우저는 해당 구성 값을 자동으로 무시하고 [`max-age`](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#max-age)를 사용합니다. 간단히 설명하겠습니다…

## 무슨 뜻인가요?

`stale-while-revalidate`를 다음과 같은 두 부분으로 나누겠습니다. 캐시된 응답이 오래될 수 있다는 아이디어와 재검증 프로세스입니다.

첫째, 브라우저는 캐시된 응답이 "오래된 것"인지 여부를 어떻게 알 수 있나요? `stale-while-revalidate`를 포함한 [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control) 응답 헤더는 `max-age` 또한 포함해야 하며, 오래된 것인지 여부를 결정하는 `max-age`를 통해 지정된 시간(초)을 포함해야 합니다.  `max-age` 보다 새로운 캐시된 응답은 최신 것으로 간주되고 더 오래된 캐시된 응답은 오래된 것으로 간주됩니다.

로컬로 캐시된 응답이 아직 최신 상태이면 그대로 사용하여 브라우저의 요청을 이행할 수 있습니다. `stale-while-revalidate`의 관점에서 보면 이 시나리오에서는 할 일이 없습니다.

그러나 캐시된 응답이 오래된 경우 다른 연령 기반 검사가 수행됩니다. 캐시된 응답의 기간이 `stale-while-revalidate` 설정에 포함된느 기간 내에 포함됩니까?

오래된 응답 기간이 이 창에 해당하는 경우 브라우저의 요청을 이행하는 데 사용됩니다. 동시에 캐시된 응답의 사용을 지연시키지 않는 방식으로 네트워크에 대해 "재검증" 요청이 이루어집니다. 반환된 응답은 이전에 캐시된 응답과 동일한 정보를 포함하거나 다를 수 있습니다. 어느 쪽이든 네트워크 응답은 로컬에 저장되어 이전에 캐시된 항목을 대체하고 향후 `max-age` 비교 중에 사용되는 "최신성" 타이머를 재설정합니다.

그러나 오래된 캐시된 응답이 오래되어 `stale-while-revalidate` 기간을 벗어나면 브라우저의 요청을 이행하지 않습니다. 브라우저는 대신 네트워크에서 응답을 검색하고 이를 사용하여 초기 요청을 수행하고 로컬 캐시를 새로운 응답으로 채웁니다.

## 실전 예시

다음은 현재 시간을 반환하기 위한 HTTP API의 간단한 예입니다. 보다 구체적으로 말하면 현재 시간이 지난 시간(분)입니다.

{% Glitch { id: 'swr-demo', path: 'server.js:20:15', height: 346 } %}

이 시나리오에서 웹 서버는 HTTP 응답에서 이 `Cache-Control` 헤더를 사용합니다.

```text
Cache-Control: max-age=1, stale-while-revalidate=59
```

이 설정은 시간에 대한 요청이 다음 1초 이내에 반복되는 경우 이전에 캐시된 값이 여전히 최신 상태이며 재검증 없이 그대로 사용됨을 의미합니다.

1초에서 60초 사이에 요청이 반복되면 캐시된 값은 유효하지 않지만 API 요청을 이행하는 데 사용됩니다. 동시에 "백그라운드에서" 나중에 사용할 수 있도록 캐시를 새 값으로 채우기 위해 유효성 재확인 요청이 수행됩니다.

요청이 60초 이상 지난 후 반복되면 오래된 응답이 전혀 사용되지 않으며 브라우저의 요청을 이행하고 캐시 재검증이 모두 네트워크에서 응답을 받는 데 달려 있습니다.

다음은 이 세 가지 상태에 대한 분석과 각 상태가 우리 예에 적용되는 기간입니다.

{% Img src="image/admin/C8lg2FSEqhTKR6WmYky3.svg", alt="이전 섹션의 정보를 보여주는 다이어그램입니다.", width="719", height="370" %}

## 일반적인 사용 사례는 무엇인가요?

"시간 후 몇 분" API 서비스에 대한 위의 예는 고안되었지만 예상되는 사용 사례를 보여줍니다. 새로 고쳐야 하지만 어느 정도의 진부함을 수용할 수 있는 정보를 제공하는 서비스입니다.

덜 인위적인 예는 현재 기상 조건에 대한 API 또는 지난 한 시간 동안 작성된 주요 뉴스 헤드라인일 수 있습니다.

일반적으로 알려진 간격으로 업데이트되는 모든 응답은 여러 번 요청될 가능성이 있으며 해당 간격 내에서 정적이며 `max-age`를 통한 단기 캐싱의 좋은 후보입니다. `max-age`와 함께 `stale-while-revalidate`를 사용하면 네트워크 응답을 차단하지 않고도 캐시에서 최신 콘텐츠로 향후 요청을 이행할 수 있는 가능성이 높아집니다.

## 서비스 워커와 어떻게 상호 작용하나요?

`stale-while-revalidate` 기회에 대해 들어본 적이 있다면 이것은 [서비스 워커](/service-workers-cache-storage/) 내에서 사용되는 [레시피](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate)의 컨텍스트에 있다는 것입니다.

`Cache-Control` 헤더를 통해 stale-while-revalidate를 사용하는 것은 서비스 워커에서 사용하는 것과 몇 가지 유사점을 공유하며 최신성 절충 및 최대 수명에 대한 동일한 고려 사항이 많이 적용됩니다. `Cache-Control` 헤더 구성에만 의존할지 결정할 때 고려해야 할 몇 가지 고려 사항이 있습니다.

### 다음과 같은 경우 서비스 워커 접근 방식을 사용하세요…

- 웹 앱에서 이미 서비스 워커를 사용하고 있습니다.
- 캐시 콘텐츠에 대한 세밀한 제어가 필요하고 가장 최근에 사용한 만료 정책과 같은 것을 구현하려고 합니다. Workbox의 [Cache Expiration](https://developer.chrome.com/docs/workbox/modules/workbox-expiration/) 모듈이 도움이 될 수 있습니다.
- 재검증 단계 동안 백그라운드에서 오래된 응답이 변경될 때 알림을 받고 싶습니다. Workbox의 [브로드캐스트 캐시 업데이트](https://developer.chrome.com/docs/workbox/modules/workbox-broadcast-update/) 모듈이 이에 도움이 될 수 있습니다.
- 모든 최신 브라우저에서 `stale-while-revalidate` 동작이 필요합니다.

### 다음과 같은 경우 캐시 제어 접근 방식을 사용하세요…

- 웹 앱용 서비스 작업자를 배포하고 유지 관리하는 오버헤드를 처리하지 않는 것이 좋습니다.
- 브라우저의 자동 캐시 관리로 로컬 캐시가 너무 커지는 것을 방지할 수 있습니다.
- 현재 모든 최신 브라우저에서 지원되지 않는 접근 방식은 문제가 없습니다(2019년 7월 기준, 향후 지원이 늘어날 수 있음).

서비스 워커를 사용하고 있고 `Cache-Control` 헤더를 통해 일부 응답에 대해 `stale-while-revalidate`를 활성화한 경우 서비스 워커는 일반적으로 요청에 응답할 때 "첫 번째 크랙"을 갖게 됩니다. 서비스 워커가 응답하지 않기로 결정하거나 응답을 생성하는 과정에서 [`fetch()`](https://developer.mozilla.org/docs/Web/API/Fetch_API)를 사용한 다음 `Cache-Control` 헤더를 통해 구성된 동작이 적용됩니다.

## 더 알아보기

- Fetch API 사양의 [`stale-while-revalidate` 응답.](https://fetch.spec.whatwg.org/#concept-stale-while-revalidate-response)
- [RFC 5861](https://tools.ietf.org/html/rfc5861), 초기 `stale-while-revalidate` 사양을 다룹니다.
- [HTTP 캐시: 첫 번째 방어선](/http-cache/), 이 사이트의 "네트워크 안정성" 가이드에 있습니다.

*사무엘 젤러의 영웅 이미지.*
