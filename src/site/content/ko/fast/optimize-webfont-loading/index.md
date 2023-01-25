---
layout: post
title: WebFont 로딩 및 렌더링 최적화
authors:
  - ilyagrigorik
date: 2019-08-16
updated: 2020-07-03
description: |2

  이 게시물은 페이지가 로드될 때 WebFont를 사용할 수 없을 때 레이아웃 이동 및 빈 페이지를 방지하기 위해 WebFont를 로드하는 방법을 설명합니다.
tags:
  - performance
  - fonts
feedback:
  - api
---

필요하지 않을 수 있는 모든 문체 변형과 사용되지 않을 수 있는 모든 글리프를 포함하는 "전체" WebFont는 쉽게 메가바이트 다운로드를 초래할 수 있습니다. 이 게시물에서는 방문자가 사용할 항목만 다운로드하도록 WebFont 로드를 최적화하는 방법을 알아봅니다.

모든 변형이 포함된 대용량 파일의 문제를 해결하기 위해 `@font-face` CSS 규칙은 글꼴 패밀리를 리소스 모음으로 분할할 수 있도록 특별히 설계되었습니다. 예를 들어 유니코드 하위 집합 및 고유한 스타일 변형이 있습니다.

이러한 선언이 주어지면 브라우저는 필요한 하위 집합과 변형을 파악하고 텍스트를 렌더링하는 데 필요한 최소 집합을 다운로드하므로 매우 편리합니다. 그러나 주의하지 않으면 중요한 렌더링 경로에 성능 병목 현상이 발생하고 텍스트 렌더링이 지연될 수도 있습니다.

### 기본 동작

글꼴의 지연 로딩은 텍스트 렌더링을 지연시킬 수 있는 중요한 숨겨진 의미를 전달합니다. 브라우저는 텍스트를 렌더링하기 위해 필요한 글꼴 리소스를 알기 전에 DOM 및 CSSOM 트리에 종속된 [렌더링 트리를 구성](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction)해야 합니다. 결과적으로 글꼴 요청은 다른 중요한 리소스보다 훨씬 늦게 지연되고 브라우저는 리소스를 가져올 때까지 텍스트를 렌더링하지 못하도록 차단될 수 있습니다.

{% Img src="image/admin/NgSTa9SirmikQAq1G5fN.png", alt="글꼴 중요 렌더링 경로", width="800", height="303" %}

1. 브라우저는 HTML 문서를 요청합니다.
2. 브라우저는 HTML 응답을 구문 분석하고 DOM을 구성하기 시작합니다.
3. 브라우저는 CSS, JS 및 기타 리소스를 검색하고 요청을 발송합니다.
4. 브라우저는 모든 CSS 콘텐츠가 수신된 후 CSSOM을 구성하고 이를 DOM 트리와 결합하여 렌더링 트리를 구성합니다.
    - 페이지에서 지정된 텍스트를 렌더링하는 데 필요한 글꼴 변형을 렌더링 트리가 표시한 후 글꼴 요청이 전달됩니다.
5. 브라우저는 레이아웃을 수행하고 콘텐츠를 화면에 그립니다.
    - 글꼴을 아직 사용할 수 없는 경우 브라우저에서 텍스트 픽셀을 렌더링하지 못할 수 있습니다.
    - 글꼴을 사용할 수 있게 되면 브라우저는 텍스트 픽셀을 그립니다.

렌더링 트리가 빌드된 직후에 수행할 수 있는 페이지 콘텐츠의 첫 번째 페인트와 글꼴 리소스에 대한 요청 사이의 "경합"은 브라우저가 페이지 레이아웃을 렌더링할 수 있지만 아무 것도 생략하는 "빈 텍스트 문제"를 생성하는 원인입니다. 텍스트.

WebFont를 미리 로드하고 `font-display`를 사용하여 사용할 수 없는 글꼴로 브라우저가 작동하는 방식을 제어하면 글꼴 로드로 인한 빈 페이지 및 레이아웃 이동을 방지할 수 있습니다.

### WebFont 리소스 미리 로드

페이지에 미리 알고 있는 URL에서 호스팅되는 특정 WebFont가 필요할 가능성이 높은 경우 [리소스 우선 순위](https://developers.google.com/web/fundamentals/performance/resource-prioritization)를 활용할 수 있습니다. `<link rel="preload">`를 사용하면 CSSOM이 생성될 때까지 기다릴 필요 없이 중요한 렌더링 경로 초기에 WebFont에 대한 요청이 트리거됩니다.

### 텍스트 렌더링 지연 사용자 지정

미리 로드하면 페이지의 콘텐츠가 렌더링될 때 WebFont를 사용할 수 있을 가능성이 높아지지만 보장되지는 않습니다. 아직 사용할 수 없는 `font-family`을 사용하는 텍스트를 렌더링할 때 브라우저가 어떻게 작동하는지 고려해야 합니다.

[글꼴 로드 중 보이지 않는 텍스트 방지](/avoid-invisible-text/) 게시물에서 기본 브라우저 동작이 일관되지 않음을 확인할 수 있습니다. [`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display)를 사용하여 최신 브라우저에서 원하는 동작 방식을 알릴 수 있습니다.

일부 브라우저에서 구현하는 기존 글꼴 시간 초과 동작과 유사하게 `font-display`는 글꼴 다운로드 수명을 세 가지 주요 기간으로 분할합니다.

1. 첫 번째 기간은 **글꼴 차단 기간**입니다. 이 기간 동안 글꼴이 로드되지 않으면 이를 사용하려는 모든 요소는 대신 보이지 않는 대체 글꼴로 렌더링해야 합니다. 차단 기간 동안 글꼴이 성공적으로 로드되면 글꼴이 정상적으로 사용됩니다.
2. **글꼴 교체 기간**은 글꼴 차단 기간 직후에 발생합니다. 이 기간 동안 글꼴이 로드되지 않으면 이를 사용하려는 모든 요소는 대신 대체 글꼴로 렌더링해야 합니다. 스왑 기간 동안 글꼴이 성공적으로 로드되면 글꼴이 정상적으로 사용됩니다.
3. **글꼴 오류 기간**은 글꼴 교체 기간 직후에 발생합니다. 이 기간이 시작될 때 글꼴이 아직 로드되지 않은 경우 로드 실패로 표시되어 정상적인 글꼴 폴백이 발생합니다. 그렇지 않으면 글꼴이 정상적으로 사용됩니다.

이 기간을 이해한다는 것은 `font-display`를 사용하여 다운로드 여부 또는 다운로드 시기에 따라 글꼴을 렌더링하는 방법을 결정할 수 있음을 의미합니다.

`font-display` 속성을 사용하려면 `@font-face` 규칙에 추가하세요.

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  font-display: auto; /* or block, swap, fallback, optional */
  src: local('Awesome Font'),
       url('/fonts/awesome-l.woff2') format('woff2'), /* will be preloaded */
       url('/fonts/awesome-l.woff') format('woff'),
       url('/fonts/awesome-l.ttf') format('truetype'),
       url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Latin glyphs */
}
```

`font-display`는 현재 다음 값 범위를 지원합니다.

- `auto`
- `block`
- `swap`
- `fallback`
- `optional`

글꼴 미리 로드 및 `font-display` 속성에 대한 자세한 내용은 다음 게시물을 참조하세요.

- [글꼴 로드 중 보이지 않는 텍스트 방지](/avoid-invisible-text/)
- [font-display를 사용하여 글꼴 성능 제어](https://developers.google.com/web/updates/2016/02/font-display)
- [선택적 글꼴을 미리 로드하여 레이아웃 이동 및 보이지 않는 텍스트(FOIT) 깜박임을 방지](/preload-optional-fonts/)

### 글꼴 로딩 API

`<link rel="preload">`와 CSS `font-display`를 사용하면 많은 오버헤드를 추가하지 않고도 글꼴 로드 및 렌더링을 크게 제어할 수 있습니다. 그러나 추가 사용자 정의가 필요하고 JavaScript를 실행하여 발생하는 오버헤드를 기꺼이 발생시키려는 경우 다른 옵션이 있습니다.

[글꼴 로딩 API](https://www.w3.org/TR/css-font-loading/)는 CSS 글꼴을 정의 및 조작하고 다운로드 진행률을 추적하고 기본 지연 로드 동작을 재정의하는 스크립팅 인터페이스를 제공합니다. 예를 들어 특정 글꼴 변형이 필요하다고 확신하는 경우 이를 정의하고 브라우저에 글꼴 리소스를 즉시 가져오도록 지시할 수 있습니다.

```javascript
var font = new FontFace("Awesome Font", "url(/fonts/awesome.woff2)", {
  style: 'normal', unicodeRange: 'U+000-5FF', weight: '400'
});

// don't wait for the render tree, initiate an immediate fetch!
font.load().then(function() {
  // apply the font (which may re-render text and cause a page reflow)
  // after the font has finished downloading
  document.fonts.add(font);
  document.body.style.fontFamily = "Awesome Font, serif";

  // OR... by default the content is hidden,
  // and it's rendered after the font is available
  var content = document.getElementById("content");
  content.style.visibility = "visible";

  // OR... apply your own render strategy here...
});
```

또한 글꼴 상태([`check()`](https://www.w3.org/TR/css-font-loading/#font-face-set-check)를 통해) 방법을 확인하고 다운로드 진행률을 추적할 수 있으므로 페이지에 텍스트를 렌더링하기 위한 사용자 정의 전략을 정의할 수도 있습니다.

- 글꼴을 사용할 수 있을 때까지 모든 텍스트 렌더링을 보류할 수 있습니다.
- 각 글꼴에 대해 사용자 지정 시간 초과를 구현할 수 있습니다.
- 대체 글꼴을 사용하여 렌더링 차단을 해제하고 글꼴을 사용할 수 있게 된 후 원하는 글꼴을 사용하는 새 스타일을 삽입할 수 있습니다.

무엇보다도 페이지의 다양한 콘텐츠에 대해 위의 전략을 혼합하고 일치시킬 수도 있습니다. 예를 들어 글꼴을 사용할 수 있을 때까지 일부 섹션에서 텍스트 렌더링을 지연하고 대체 글꼴을 사용한 다음 글꼴 다운로드가 완료된 후 다시 렌더링할 수 있습니다.

{% Aside %} Font Loading API는 [이전 브라우저에서 사용할 수 없습니다](http://caniuse.com/#feat=font-loading). 추가 JavaScript 종속성으로 인해 더 많은 오버헤드가 발생하더라도 유사한 기능을 제공하기 위해 [FontLoader 폴리필](https://github.com/bramstein/fontloader) 또는 [WebFontloader 라이브러리](https://github.com/typekit/webfontloader)를 사용하는 것을 고려하십시오. {% endAside %}

### 적절한 캐싱은 필수

글꼴 리소스는 일반적으로 자주 업데이트되지 않는 정적 리소스입니다. 결과적으로 긴 최대 사용 기간 만료에 이상적입니다. [조건부 ETag 헤더](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#validating-cached-responses-with-etags)와 모든 글꼴 리소스에 대한 [최적의 캐시 제어 정책](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#cache-control)을 모두 지정해야 합니다.

웹 애플리케이션이 [Service Worker](https://developer.chrome.com/docs/workbox/service-worker-overview/)를 사용하는 경우 [캐시 우선 전략](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-then-network)으로 글꼴 리소스를 제공하는 것이 대부분의 사용 사례에 적합합니다.

[`localStorage`](https://developer.mozilla.org/docs/Web/API/Window/localStorage) 또는 [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API)를 사용하여 글꼴을 저장해서는 안 됩니다. 이들 각각에는 고유한 성능 문제 세트가 있습니다. 브라우저의 HTTP 캐시는 브라우저에 글꼴 리소스를 제공하는 가장 강력하고 강력한 메커니즘을 제공합니다.

## WebFont 로딩 체크리스트

- **`<link rel="preload">` , `font-display` 또는 글꼴 로드 API를 사용하여 글꼴 로드 및 렌더링을 사용자 정의**합니다. 기본 지연 로드 동작으로 인해 텍스트 렌더링이 지연될 수 있습니다. 이러한 웹 플랫폼 기능을 사용하면 특정 글꼴에 대해 이 동작을 재정의하고 페이지의 다양한 콘텐츠에 대해 사용자 지정 렌더링 및 시간 초과 전략을 지정할 수 있습니다.
- **재확인 및 최적의 캐싱 정책 지정:** 글꼴은 자주 업데이트되지 않는 정적 리소스입니다. 서로 다른 페이지 간에 글꼴을 효율적으로 재사용할 수 있도록 서버가 수명이 긴 최대 사용 기간 타임 스탬프와 재검증 토큰을 제공하는지 확인하십시오. 서비스 워커를 사용하는 경우 캐시 우선 전략이 적합합니다.

## Lighthouse를 사용한 WebFont 로딩 동작에 대한 자동화된 테스트

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 웹 글꼴 최적화 모범 사례를 따르고 있는지 확인하는 프로세스를 자동화하는 데 도움이 될 수 있습니다.

다음 감사는 페이지가 시간이 지남에 따라 웹 글꼴 최적화 모범 사례를 계속 따르고 있는지 확인하는 데 도움이 될 수 있습니다.

- [키 요청 미리 로드](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preload/)
- [정적 자산에 비효율적인 캐시 정책 사용](https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl/)
- [WebFont가 로드되는 동안 모든 텍스트 계속 표시](https://developer.chrome.com/docs/lighthouse/performance/font-display/)
