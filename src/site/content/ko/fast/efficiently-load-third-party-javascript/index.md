---
layout: post
title: 타사 JavaScript를 효율적으로 로드
subhead: 로드 시간과 사용자 경험을 개선하기 위해 타사 스크립트를 사용하는 일반적인 함정을 피하십시오.
authors:
  - mihajlija
date: 2019-08-14
description: |2

  로드 시간과 사용자 경험을 개선하기 위해 타사 스크립트를 사용하는 일반적인 함정을 피하는 방법을 알아보십시오.
hero: image/admin/udp7L9LSo5mfI3F0tvNY.jpg
alt: 선적 컨테이너의 항공 보기입니다.
codelabs: codelab-optimize-third-party-javascript
tags:
  - performance
  - javascript
---

타사 스크립트가 페이지 로드 [속도를 늦추는](/third-party-javascript/) 경우 성능을 개선할 수 있는 두 가지 옵션이 있습니다.

- 사이트에 명확한 가치를 추가하지 않는 경우 제거하십시오.

- 로딩 프로세스를 최적화합니다.

이 게시물은 다음 기술을 사용하여 타사 스크립트의 로딩 프로세스를 최적화하는 방법을 설명합니다.

1. `<script>` 태그에서 `async` 또는 `defer` 속성 사용

2. 필요한 오리진에 대한 초기 연결 설정

3. 지연 로딩

4. 타사 스크립트 제공 방법 최적화

## `async` 또는 `defer` 사용

[동기 스크립트](/third-party-javascript/)는 DOM 생성 및 렌더링을 지연시키므로 페이지를 렌더링하기 전에 스크립트를 실행해야 하는 경우가 아니면 항상 타사 스크립트를 비동기적으로 로드해야 합니다.

`async` 및 `defer` 속성은 브라우저에 백그라운드에서 스크립트를 로드하는 동안 HTML 구문 분석을 계속하고 로드된 후 스크립트를 실행할 수 있음을 알려줍니다. 이렇게 하면 스크립트 다운로드가 DOM 구성 및 페이지 렌더링을 차단하지 않습니다. 그 결과 모든 스크립트가 로드되기 전에 사용자가 페이지를 볼 수 있습니다.

```html
<script async src="script.js">

<script defer src="script.js">
```

`async`와 `defer`의 차이점은 스크립트 실행을 시작할 때입니다.

### `async`

`async` 속성이 있는 스크립트는 다운로드가 완료된 후 창의 [로드](https://developer.mozilla.org/docs/Web/Events/load) 이벤트 전에 첫 번째 기회에 실행됩니다. `async` 스크립트가 HTML에 나타나는 순서대로 실행되지 않을 가능성이 있음을 의미합니다. 또한 파서가 작동하는 동안 다운로드를 마치면 DOM 구축을 중단할 수 있음을 의미합니다.

{% Img src="image/admin/tCqsJ3E7m4lpKOprXu5B.png", alt="비동기 속성이 있는 파서 차단 스크립트 다이어그램", width="800", height="252" %}

### `defer`

`defer` 속성이 있는 스크립트는 HTML 구문 분석이 완전히 완료된 후 [`DOMContentLoaded`](https://developer.mozilla.org/docs/Web/Events/DOMContentLoaded) 이벤트 전에 실행됩니다. `defer`는 스크립트가 HTML에 나타나는 순서대로 실행되도록 보장하고 파서를 차단하지 않습니다.

{% Img src="image/admin/Eq0mcvDALKibHe15HspN.png", alt="지연 속성이 있는 스크립트가 있는 파서 흐름 다이어그램", width="800", height="253" %}

- 로드 프로세스 초기에 스크립트를 실행해야 하는 경우 `async`를 사용합니다.

- 덜 중요한 리소스에 대해 `defer`를 사용합니다. 예를 들어 스크롤 없이 볼 수 있는 동영상 플레이어입니다.

이러한 속성을 사용하면 페이지 로드 속도를 크게 높일 수 있습니다. 예를 들어 [Telegraph는 최근 광고 및 분석을 포함한 모든 스크립트를 연기](https://medium.com/p/a0a1000be5#4123)하고 광고 로딩 시간을 평균 4초 개선했습니다.

{% Aside %} 분석 스크립트는 일반적으로 일찍 로드되므로 귀중한 분석 데이터를 놓치지 않습니다. 다행히 초기 페이지 로드 데이터를 유지하면서 [분석을 느리게 초기화](https://philipwalton.com/articles/the-google-analytics-setup-i-use-on-every-site-i-build/)하는 패턴이 있습니다. {% endAside %}

## 필요한 원본에 대한 초기 연결 설정

중요한 타사 출처에 대한 [초기 연결](/preconnect-and-dns-prefetch/)을 설정하여 100–500ms를 절약할 수 있습니다.

두 가지 [`<link>`](https://developer.mozilla.org/docs/Web/HTML/Element/link) 유형이 여기에 도움이 될 수 있습니다.

- `preconnect`

- `dns-prefetch`

### `preconnect`

`<link rel="preconnect">`는 귀하의 페이지가 다른 출처에 대한 연결을 설정하고 가능한 한 빨리 프로세스를 시작하기를 원한다는 것을 브라우저에 알립니다. 미리 연결된 오리진에서 리소스를 요청하면 즉시 다운로드가 시작됩니다.

```html
<link rel="preconnect" href="https://cdn.example.com">
```

{% Aside 'caution' %} 브라우저는 10초 이내에 사용되지 않는 모든 연결을 닫기 때문에 곧 사용할 중요한 도메인에만 사전 연결합니다. 불필요한 사전 연결은 다른 중요한 리소스를 지연시킬 수 있으므로 사전 연결 도메인의 수를 제한하고 [사전 연결이 미치는 영향을 테스트](https://andydavies.me/blog/2019/08/07/experimenting-with-link-rel-equals-preconnect-using-custom-script-injection-in-webpagetest/)하십시오. {% endAside %}

### `dns-prefetch`

`<link rel="dns-prefetch>`은 `<link rel="preconnect">`가 처리하는 것의 작은 부분집합을 처리합니다. 연결 설정에는 DNS 조회 및 TCP 핸드셰이크가 포함되며 보안 출처의 경우 TLS 협상이 포함됩니다. `dns-prefetch`는 브라우저가 명시적으로 호출되기 전에 특정 도메인의 DNS만 확인하도록 지시합니다.

`preconnect` 힌트는 가장 중요한 연결에만 사용하는 것이 가장 좋습니다. 덜 중요한 타사 도메인의 경우 `<link rel=dns-prefetch>`를 사용하십시오.

```html
<link rel="dns-prefetch" href="http://example.com">
```

[`dns-prefetch`에 대한 브라우저 지원](https://caniuse.com/#search=dns-prefetch)은 [`preconnect` 지원](https://caniuse.com/#search=preconnect)과 약간 다르기 때문에, `dns-prefetch`는 `preconnect`가 지원하지 않는 브라우저에 대한 대체 역할을 할 수 있습니다. 이를 안전하게 구현하려면 별도의 링크 태그를 사용하십시오.

```html
<link rel="preconnect" href="http://example.com">
<link rel="dns-prefetch" href="http://example.com">
```

## 타사 리소스 지연 로드

내장된 타사 리소스는 제대로 구성되지 않은 경우 느린 페이지 속도에 크게 기여할 수 있습니다. 중요하지 않거나 스크롤 없이 볼 수 있는 경우(즉, 사용자가 보기 위해 스크롤해야 하는 경우) 지연 로드는 페이지 속도와 페인트 메트릭을 개선하는 좋은 방법입니다. 이렇게 하면 사용자는 기본 페이지 콘텐츠를 더 빨리 얻을 수 있고 더 나은 경험을 할 수 있습니다.

<figure data-float="left">{% Img src="image/admin/uzPZzkgzfrv2Oy3UQPrN.png", alt="스크롤 가능한 콘텐츠가 화면 너머로 확장되는 모바일 기기에 표시되는 웹페이지의 다이어그램입니다. 스크롤 없이 볼 수 있는 콘텐츠는 로드되지 않았기 때문에 채도가 낮습니다. 아직.", width="366", height="438" %}</figure>

한 가지 효과적인 접근 방식은 기본 페이지 콘텐츠가 로드된 후 타사 콘텐츠를 지연 로드하는 것입니다. 광고는 이 접근 방식의 좋은 후보입니다.

광고는 많은 사이트에서 중요한 수입원이지만 사용자는 콘텐츠를 찾아옵니다. 광고를 지연 로드하고 주요 콘텐츠를 더 빠르게 전달하면 광고의 전체 조회가능성 비율을 높일 수 있습니다. 예를 들어 MediaVine은 [지연 로드 광고](https://www.mediavine.com/lazy-loading-ads-mediavine-ads-load-200-faster/)로 전환하여 페이지 로드 속도가 200% 향상되었습니다. DoubleClick은 [공식 문서](https://support.google.com/dfp_premium/answer/4578089#lazyloading)에서 광고를 지연 로드하는 방법에 대한 지침을 제공합니다.

다른 접근 방식은 사용자가 페이지의 해당 섹션으로 스크롤할 때만 타사 콘텐츠를 로드하는 것입니다.

[Intersection Observer](https://developer.chrome.com/blog/intersectionobserver/)는 요소가 브라우저의 뷰포트에 들어오거나 나갈 때 효율적으로 감지하는 브라우저 API이며 이 기술을 구현하는 데 사용할 수 있습니다. [lazysizes](/use-lazysizes-to-lazyload-images/)는 [`iframes`](http://afarkas.github.io/lazysizes/#examples)을 지연 로드하는 인기 있는 JavaScript 라이브러리입니다. YouTube 임베드 및 [위젯](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/unveilhooks)을 지원합니다. IntersectionObserver에 대한 [선택적 지원](https://github.com/aFarkas/lazysizes/blob/097a9878817dd17be3366633e555f3929a7eaaf1/src/lazysizes-intersection.js)도 있습니다.

{% Aside 'caution' %} 자바스크립트로 리소스를 지연 로드할 때 주의하세요. 불안정한 네트워크 상태로 인해 JavaScript가 로드되지 않으면 리소스가 전혀 로드되지 않습니다. {% endAside %}

[이미지 및 iframe을 지연 로드하기 위해 `loading`](/browser-level-image-lazy-loading/) 속성을 사용하는 것은 JavaScript 기술에 대한 훌륭한 대안이며 최근에 Chrome 76에서 사용할 수 있게 되었습니다!

## 타사 스크립트 제공 방법 최적화

### 타사 CDN 호스팅

타사 공급업체는 일반적으로 [CDN(콘텐츠 전송 네트워크)](https://en.wikipedia.org/wiki/Content_delivery_network)에서 호스팅하는 JavaScript 파일의 URL을 제공하는 것이 일반적입니다. 이 접근 방식의 이점은 URL을 복사하여 붙여넣기만 하면 빠르게 시작할 수 있고 유지 관리 오버헤드가 없다는 것입니다. 타사 공급업체가 서버 구성 및 스크립트 업데이트를 처리합니다.

그러나 나머지 리소스와 동일한 출처에 있지 않기 때문에 공용 CDN에서 파일을 로드하려면 네트워크 비용이 듭니다. 브라우저는 DNS 조회를 수행하고, 새 HTTP 연결을 설정하고, 보안 출처에서 공급업체 서버와 SSL 핸드셰이크를 수행해야 합니다.

타사 서버의 파일을 사용하는 경우 캐싱을 거의 제어할 수 없습니다. 다른 사람의 캐싱 전략에 의존하면 스크립트가 불필요하게 네트워크에서 너무 자주 다시 가져올 수 있습니다.

### 타사 스크립트 자체 호스트

자체 호스팅 타사 스크립트는 스크립트의 로드 프로세스를 더 잘 제어할 수 있는 옵션입니다. 자체 호스팅을 통해 다음을 수행할 수 있습니다.

- DNS 조회 및 왕복 시간을 줄입니다.
- [HTTP 캐싱](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching) 헤더를 개선합니다.
- [HTTP/2 서버 푸시](/performance-http2/)를 활용합니다.

예를 들어 Casper는 A/B 테스트 스크립트를 자체 호스팅하여 로드 시간을 [1.7초 단축](https://medium.com/caspertechteam/we-shaved-1-7-seconds-off-casper-com-by-self-hosting-optimizely-2704bcbff8ec)했습니다.

자체 호스팅에는 한 가지 큰 단점이 있습니다. 스크립트가 오래될 수 있고 API 변경이나 보안 수정이 있을 때 자동 업데이트를 받지 못한다는 것입니다.

{% Aside 'caution' %}

스크립트를 수동으로 업데이트하면 개발 프로세스에 많은 오버헤드가 추가될 수 있으며 중요한 업데이트를 놓칠 수 있습니다. 모든 리소스를 제공하기 위해 CDN 호스팅을 사용하지 않는다면 [에지 캐싱](https://www.cloudflare.com/learning/cdn/glossary/edge-server/)도 놓치게 되며 서버 압축을 최적화해야 합니다. {% endAside%}

### 서비스 워커를 사용하여 타사 서버의 스크립트 캐시

타사 CDN 이점을 유지하면서 캐싱을 더 잘 제어할 수 있는 자체 호스팅의 대안은 [서비스 워커를 사용하여 타사 서버의 스크립트를 캐시하는 것](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#cross-origin-considerations)입니다. 이렇게 하면 네트워크에서 스크립트를 다시 가져오는 빈도를 제어할 수 있으며 페이지가 주요 사용자 순간에 도달할 때까지 중요하지 않은 타사 리소스에 대한 요청을 조절하는 로드 전략을 만들 수 있습니다. `preconnect`을 사용하여 초기 연결을 설정하면 네트워크 비용을 어느 정도 완화할 수도 있습니다.
