---
title: 최대 콘텐츠풀 페인트 최적화
subhead: 메인 콘텐츠를 더 빠르게 렌더링하는 방법.
authors:
  - houssein
date: 2020-05-05
updated: 2020-08-20
hero: image/admin/qqTKhxUFqdLXnST2OFWN.jpg
alt: LCP 배너 최적화
description: Largest Contentful Paint(최대 콘텐츠풀 페인트, LCP)는 페이지의 메인 콘텐츠가 화면에 모두 렌더링되었을 때를 결정하는 데 사용됩니다. 느린 서버 응답 시간, 리소스 로드 시간, 클라이언트 측 렌더링을 개선해 LCP를 최적화하는 방법을 알아보세요.
tags:
  - blog
  - performance
  - web-vitals
---

{% YouTube id='AQqFZ5t8uNc', startTime='1073' %}

<blockquote>
  <p>쓸 만한 콘텐츠가 보이지 않아요! 로드하는 데 왜 이렇게 오래 걸리는 거죠? 😖</p>
</blockquote>

열악한 사용자 경험에 큰 영향을 미치는 요소 중 하나는 사용자가 화면에 렌더링되는 콘텐츠를 보기까지 얼마나 많은 시간이 걸리느냐입니다. [First Contentful Paint](/fcp)(최초 콘텐츠풀 페인트, FCP)는 초기 DOM 콘텐츠가 렌더링되는 데 걸리는 시간을 측정하지만 페이지에서 가장 크고 일반적으로 가장 의미 있는 콘텐츠를 렌더링하는 데 걸린 시간은 포착하지 않습니다.

[Large Contentful Paint](/lcp)(최대 콘텐츠풀 페인트, LCP)는 [Core Web Vitals](/vitals/) 메트릭이며 뷰포트에서 가장 큰 콘텐츠 요소가 표시되는 시점을 측정합니다. 페이지의 메인 콘텐츠가 화면에서 렌더링을 완료한 시점을 결정하는 데 사용할 수 있습니다.

  <picture>
    <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/elqsdYqQEefWJbUM2qMO.svg" | imgix }}" media="(min-width: 640px)">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9trpfS9wruEPGekHqBdn.svg", alt="좋은 LCP 값은 2.5초이고 나쁜 값은 4.0초보다 크며 그 사이에는 개선이 필요합니다.", width="384", height="96" %}
  </picture>

열악한 LCP 값이 발생하는 일반적인 이유는 다음과 같습니다.

- [느린 서버 응답 시간](#slow-servers)
- [렌더링 차단 JavaScript 및 CSS](#render-blocking-resources)
- [느린 리소스 로드 시간](#slow-resource-load-times)
- [클라이언트 측 렌더링](#client-side-rendering)

## 느린 서버 응답 시간 {: #slow-servers }

브라우저가 서버에서 콘텐츠를 수신하는 데 시간이 오래 걸릴수록 화면에 무엇이든 렌더링하는 데 더 오래 걸립니다. 더 빠른 서버 응답 시간은 LCP를 포함한 모든 단일 페이지 로드 메트릭을 직접적으로 향상시킵니다.

가장 먼저 해야 할 것은 서버에서 콘텐츠를 처리하는 방법과 위치를 개선하는 것입니다. [**Time to First Byte**](/ttfb/)(최초 바이트까지의 시간, TTBT)로 서버 응답 시간을 측정하세요. 다음과 같이 다양한 방식으로 TTBT를 개선할 수 있습니다.

- 서버 최적화
- 사용자를 가까운 CDN으로 라우팅
- 자산 캐시
- HTML 페이지 캐시 우선 제공
- 조기에 타사 연결 구축
- 서명된 교환 사용

### 서버 최적화

서버가 완료하는 데 상당한 시간이 걸리는 쿼리를 실행하고 있나요? 아니면 서버 측에서 진행되는 다른 복잡한 작업으로 인해 페이지 콘텐츠를 반환하는 프로세스를 지연되나요? 서버 측 코드의 효율성을 분석하고 개선하면 브라우저가 데이터를 수신하는 데 걸리는 시간이 빨라집니다.

대부분의 서버 측 웹 프레임워크는 브라우저에서 요청할 때 고정 페이지를 즉시 제공하는 것이 아니라, 웹 페이지를 동적으로 생성해야 합니다. 즉, 브라우저가 요청할 때 이미 준비된 완전한 HTML 파일을 보내는 것이 아니라 프레임워크에서 페이지를 구성하는 논리를 실행해야 한다는 의미입니다. 이는 데이터베이스 쿼리의 결과가 보류 중이거나 구성 요소가 UI 프레임워크(예: [React](https://reactjs.org/docs/react-dom-server.html) )에 의해 마크업으로 생성되어야 하기 때문일 수 있습니다. 서버에서 실행되는 여러 가지 웹 프레임워크에는 이 프로세스의 속도를 높이는 데 사용할 수 있는 성능 지침이 있습니다.

{% Aside %} 자세한 내용은 [과부하 서버 수정](/overloaded-server/)을 확인하세요. {% endAside %}

### 사용자를 가까운 CDN으로 라우팅

콘텐츠 전송 네트워크(CDN)은 여러 위치에 분산된 서버 네트워크입니다. 웹 페이지의 콘텐츠가 단일 서버에서 호스팅되는 경우 지리적으로 멀리 떨어져 있는 사용자에게는 해당 웹사이트가 느리게 표시될 수 있습니다. 브라우저 요청이 말 그대로 세계를 한 바퀴 돌아야 하기 때문이죠. 사용자가 멀리 떨어진 서버에 대한 네트워크 요청을 기다리지 않도록 하려면 CDN을 사용하는 것이 좋습니다.

### 자산 캐시

HTML이 고정적이며 모든 요청에 대해 변경할 필요가 없는 경우 캐싱을 통해 HTML이 불필요하게 다시 생성되는 것을 방지할 수 있습니다. 서버 측 캐싱은 생성된 HTML의 복사본을 디스크에 저장해 TTFB를 줄이고 리소스 사용을 최소화할 수 있습니다.

도구 체인에 따라 서버 캐싱을 적용하는 다양한 방법이 있습니다.

- 캐시된 콘텐츠를 제공하거나 애플리케이션 서버 앞에 설치된 경우 캐시 서버 역할을 하도록 역방향 프록시([Varnish](https://varnish-cache.org/) , [nginx](https://www.nginx.com/)) 구성
- 클라우드 공급자([Firebase](https://firebase.google.com/docs/hosting/manage-cache), [AWS](https://aws.amazon.com/caching/), [Azure](https://docs.microsoft.com/en-us/azure/architecture/best-practices/caching))의 캐시 동작 구성 및 관리
- 콘텐츠가 캐시되어 사용자에게 더 가까운 곳에 저장되도록 엣지 서버를 제공하는 CDN 사용

### HTML 페이지 캐시 우선 제공

설치되면 [서비스 작업자](https://developer.mozilla.org/docs/Web/API/Service_Worker_API)가 브라우저 백그라운드에서 실행되고 서버의 요청을 가로챌 수 있습니다. 이 수준의 프로그래밍 방식 캐시 제어를 사용하면 HTML 페이지 콘텐츠의 일부 또는 전체를 캐시하고 콘텐츠가 변경된 경우에만 캐시를 업데이트할 수 있습니다.

다음 차트는 이 패턴을 사용하여 사이트에서 LCP 분포가 어떻게 감소했는지 보여줍니다.

<figure>
  {% Img
    src="image/admin/uB0Sm56R88MRF16voQ1k.png",
    alt="HTML 캐싱 전후 최대 콘텐츠풀 페인트 분포",
    width="800",
    height="495"
  %}
</figure>

<figure>
  {% Img
    src="image/admin/uB0Sm56R88MRF16voQ1k.png",
    alt="HTML 캐싱 전후 최대 콘텐츠풀 페인트 분포",
    width="800",
    height="495"
  %}
  <figcaption> 페이지 로드 시 서비스 작업자 여부에 따른 최대 콘텐츠풀 분포 - <a href="https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/">philipwalton.com</a> </figcaption>
</figure>

이 차트는 지난 28일 동안 단일 사이트의 LCP 분포를 서비스 작업자 상태별로 분류하여 보여줍니다. 캐시 우선 HTML 페이지 서비스가 서비스 작업자(차트의 파란색 부분)에 도입된 후 얼마나 많은 페이지 로드가 더 빨라진 LCP 값을 갖게 됐는지 확인하세요.

{% Aside %} 전체 또는 부분 캐시 우선 HTML 페이지를 제공하는 기술에 대해 자세히 알아보려면 [서비스 작업자가 있는 더 작은 HTML 페이로드](https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/)를 참조하세요. {% endAside %}

### 조기에 타사 연결 구축

타사 출처에 대한 서버 요청은 특히 페이지에 중요한 콘텐츠를 표시해야 하는 경우 LCP에 영향을 줄 수 있습니다. `rel="preconnect"`를 사용하여 페이지가 최대한 빨리 연결을 구축할 것임을 브라우저에 알립니다.

```html
<link rel="preconnect" href="https://example.com" />
```

`dns-prefetch`를 사용하여 DNS 조회를 더 빠르게 해결할 수도 있습니다.

```html
<link rel="dns-prefetch" href="https://example.com" />
```

두 힌트 모두 다르게 작동하지만 `preconnect`를 지원하지 않는 브라우저에 대한 대체로 `dns-prefetch`를 사용할 수도 있습니다.

```html
<head>
  …
  <link rel="preconnect" href="https://example.com" />
  <link rel="dns-prefetch" href="https://example.com" />
</head>
```

{% Aside %} 인지된 페이지 속도를 개선하려면 [초기에 네트워크 연결 구축](/preconnect-and-dns-prefetch/)을 읽고 자세히 알아보세요. {% endAside %}

### 서명된 교환(SXG) 사용

[서명된 교환(SXG)](/signed-exchanges)이란 쉽게 캐시할 수 있는 형식으로 콘텐츠를 제공하여 더 빠른 사용자 경험을 가능하게 하는 전달 메커니즘입니다. 특히 [Google 검색](https://developers.google.com/search/docs/advanced/experience/signed-exchange)은 SXG를 캐시하고 때로는 미리 가져옵니다. Google 검색에서 트래픽의 많은 부분을 수신하는 사이트의 경우 SXG는 LCP를 개선하기 위한 중요한 도구가 될 수 있습니다. 자세한 내용은 [서명된 교환](/signed-exchanges)을 참조하세요.

## 렌더링 차단 JavaScript 및 CSS {: #render-blocking-resources }

브라우저에서 콘텐츠를 렌더링하려면 먼저 HTML 마크업을 DOM 트리로 구문 분석해야 합니다. HTML 파서는 외부 스타일시트( `<link rel="stylesheet">`) 또는 동기 JavaScript 태그( `<script src="main.js">`)를 만나면 일시 중지됩니다.

스크립트와 스타일시트는 모두 FCP를 지연시키고 결과적으로 LCP까지 지연시키는 렌더링 차단 리소스입니다. 중요하지 않은 JavaScript 및 CSS를 지연시키면 웹 페이지의 메인 콘텐츠 로드 속도를 빠르게 할 수 있습니다.

### CSS 차단 시간 단축

다음과 같은 방법으로 필요한 최소 CSS만 사이트에서 렌더링을 차단하도록 합니다.

- CSS 축소
- 중요하지 않은 CSS 지연
- 중요 CSS 즉시 처리

### CSS 축소

가독성을 높이기 위해 CSS 파일에는 공백, 들여쓰기 또는 주석과 같은 문자를 포함할 수 있습니다. 이런 문자는 모두 브라우저에 필요하지 않으며, 이러한 파일을 축소하면 제거됩니다. 궁극적으로 CSS 차단량을 줄이면 페이지의 메인 콘텐츠를 완전히 렌더링하는 데 걸리는 시간(LCP)이 항상 향상됩니다.

모듈 번들러 또는 빌드 도구를 사용하는 경우 적절한 플러그인을 포함하여 모든 빌드에서 CSS 파일을 축소합니다.

- Webpack: [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)
- Gulp: [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)
- Rollup: [rollup-plugin-css-porter](https://www.npmjs.com/package/rollup-plugin-css-porter)

<figure>
  {% Img
    src="image/admin/vQXSKrY1Eq3CKkNbu9Td.png",
    alt="LCP 개선 예시: CSS 축소 이전/이후",
    width="800",
    height="139"
  %}
  <figcaption>
    LCP 개선 예시: CSS 축소 이전/이후
  </figcaption>
</figure>

{% Aside %} 자세한 내용은 [CSS](/minify-css/) 축소 가이드를 참조하세요. {% endAside %}

### 중요하지 않은 CSS 지연

Chrome DevTools의 [Coverage](https://developer.chrome.com/docs/devtools/coverage/) 탭을 사용하여 웹 페이지에서 사용하지 않는 CSS를 찾습니다.

{% Img src="image/admin/wjS4NrU5EsJeCuvK0zhn.png", alt="Chrome DevTools의 Coverage 탭", width="800", height="559" %}

다음과 같은 방법으로 최적화할 수 있습니다.

- 사용하지 않는 CSS를 완전히 제거하거나 사이트의 별도 페이지에서 사용하는 경우 다른 스타일시트로 이동합니다.
- 초기 렌더링에 필요하지 않은 CSS의 경우 [loadCSS](https://github.com/filamentgroup/loadCSS/blob/master/README.md)를 사용해 `rel="preload"` 및 `onload`를 활용해 비동기식으로 파일을 로드합니다.

```html
<link
  rel="preload"
  href="stylesheet.css"
  as="style"
  onload="this.rel='stylesheet'"
/>
```

<figure>
  {% Img
    src="image/admin/2fcwrkXQRQrM8w1qyy3P.png",
    alt="LCP 개선 예시: 중요하지 않은 CSS 지연 이전/이후",
    width="800",
    height="139"
  %}
  <figcaption>
    LCP 개선 예시: 중요하지 않은 CSS 지연 이전/이후
  </figcaption>
</figure>

{% Aside %} 자세한 내용은 [중요하지 않은 CSS 지연](/defer-non-critical-css/) 가이드를 참조하세요. {% endAside %}

### 중요 CSS 즉시 처리

스크롤 없이 볼 수 있는 콘텐츠에 사용되는 중요 경로 CSS를 `<head>`에 포함해 즉시 처리합니다

<figure>
  {% Img
    src="image/admin/m0n0JsLpH9JsNnXywSwz.png",
    alt="중요 CSS 즉시 처리됨",
    width="800", height="325"
  %}
  <figcaption>중요 CSS 즉시 처리됨</figcaption>
</figure>

중요한 스타일을 즉시 처리하면 중요한 CSS를 가져오기 위해 왕복 요청을 할 필요가 없습니다. 나머지를 연기하면 CSS 차단 시간이 최소화됩니다.

사이트에 즉시 처리 스타일을 수동으로 추가할 수 없다면 라이브러리를 사용해 프로세스를 자동화하세요. 예시는 다음과 같습니다.

- [Critical](https://github.com/addyosmani/critical), [CriticalCSS](https://github.com/filamentgroup/criticalCSS) 및 [Penthouse](https://github.com/pocketjoso/penthouse) 는 모두 스크롤 없이 볼 수 있는 CSS를 추출하고 즉시 처리하는 패키지입니다.
- [Critters](https://github.com/GoogleChromeLabs/critters)는 중요한 CSS를 즉시 처리하고 나머지는 지연 로드하는 웹팩 플러그인입니다.

<figure>
  {% Img
    src="image/admin/L8sc51bd3ckxwnUfczC4.png",
    alt="LCP 개선 예시: 중요 CSS 즉시 처리 이전/이후",
    width="800",
    height="175"
  %}
  <figcaption>
    LCP 개선 예시: 중요 CSS 즉시 처리 이전/이후
  </figcaption>
</figure>

{% Aside %} 자세히 알아보려면 [중요 CSS 추출](/extract-critical-css/) 가이드를 살펴보세요. {% endAside %}

### <a>JavaScript 차단 시간 단축</a>

필요한 최소한의 JavaScript를 다운로드하여 사용자에게 제공합니다. 차단하는 JavaScript의 양을 줄이면 렌더링 속도가 빨라지고 결과적으로 LCP가 향상됩니다.

몇 가지 다른 방법으로 스크립트를 최적화하여 이를 수행할 수 있습니다.

- [JavaScript 파일 축소 및 압축](/reduce-network-payloads-using-text-compression/)
- [사용하지 않는 JavaScript 지연](/reduce-javascript-payloads-with-code-splitting/)
- [사용하지 않는 Polyfills 최소화](/serve-modern-code-to-modern-browsers/)

{% Aside %} [최초 입력 지연 최적화](/optimize-fid/) 가이드에서는 JavaScript 차단 시간을 줄이는 데 필요한 모든 기술을 조금 더 자세히 설명합니다. {% endAside %}

## 느린 리소스 로드 시간 {: #slow-resource-load-times }

CSS 또는 JavaScript 차단 시간이 증가는 성능 저하에 직접적 영향을 미치지만, 다른 많은 유형의 리소스를 로드하는 데 걸리는 시간도 페인트 시간에 영향을 줄 수 있습니다. LCP에 영향을 미치는 요소 유형은 다음과 같습니다.

- `<img>` 요소
- `<svg>` 요소 내부의 `<image>`
- `<video>` 요소([포스터](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-poster) 이미지는 LCP 측정에 사용됨)
- [`url()`](https://developer.mozilla.org/docs/Web/CSS/url) 함수를 통해 로드된 배경 이미지가 있는 요소<a>(CSS 그라데이션</a>과는 대조적임)
- 텍스트 노드 또는 기타 인라인 수준 텍스트 요소를 포함하는 [블록 수준 요소](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements)

스크롤 없이 볼 수 있는 상태로 렌더링된 경우 이러한 요소를 로드하는 데 걸리는 시간은 LCP에 직접적인 영향을 미칩니다. 이러한 파일이 가능한 한 빨리 로드되도록 하는 몇 가지 방법이 있습니다.

- 이미지 최적화 및 압축
- 중요한 리소스 미리 로드
- 텍스트 파일 압축
- 네트워크 연결을 기반으로 다양한 자산 제공(적응형 서비스)
- 서비스 작업자를 사용하여 자산 캐시

### 이미지 최적화 및 압축

대부분의 사이트에서 이미지는 페이지 로드가 완료되었을 때 표시되는 가장 큰 요소입니다. 대표 이미지, 대형 캐러셀 또는 배너 이미지 등이 이러한 예시에 속합니다.

<figure>
  {% Img
    src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/unWra6cq0hPJJJT7Y3ye.png",
    alt="",
    width="459",
    height="925"
  %}
  <figcaption>이미지가 가장 큰 페이지 요소인 경우: <a href="https://design.google/">design.google</a></figcaption>
</figure>

이러한 유형의 이미지를 로드하고 렌더링하는 데 걸리는 시간을 개선하면 LCP 속도 향상에 직접적인 영향을 미칩니다. 이를 달성하는 방법은 다음과 같습니다.

- 처음부터 이미지를 사용하지 않는 것이 좋습니다. 콘텐츠와 관련이 없는 경우 삭제하세요.
- 이미지 압축(예: [Imagemin](/use-imagemin-to-compress-images) 사용)
- 이미지를 최신 형식(JPEG 2000, JPEG XR 또는 WebP)으로 변환
- 반응형 이미지 사용
- 이미지 CDN 사용 고려

{% Aside %} 이러한 모든 기술을 자세히 설명하는 가이드 및 리소스를 확인하려면 [이미지 최적화](/fast/#optimize-your-images)를 참조하세요. {% endAside %}

### 중요한 리소스 미리 로드

특정 CSS 또는 JavaScript 파일에서 선언되거나 사용되는 중요한 리소스는 애플리케이션의 수많은 CSS 파일 중 하나에 저장된 글꼴처럼 생각보다 늦게 가져오게 될 수 있습니다.

특정 리소스에 우선순위를 지정해야 하는 경우 `<link rel="preload">`를 사용해 더 빨리 가져옵니다. [다양한 유형의 리소스](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#What_types_of_content_can_be_preloaded)를 미리 로드할 수 있지만 먼저 글꼴, 스크롤 없이 볼 수 있는 이미지 또는 동영상, 중요한 경로 CSS 또는 JavaScript와 같은 [중요한 자산을 미리 로드](/preload-critical-assets/)하는 데 집중해야 합니다.

```html
<link rel="preload" as="script" href="script.js" />
<link rel="preload" as="style" href="style.css" />
<link rel="preload" as="image" href="img.png" />
<link rel="preload" as="video" href="vid.webm" type="video/webm" />
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />
```

Chrome 73부터 [반응형 이미지](/preload-responsive-images/)와 함께 사전 로드를 사용해 더 빠른 이미지 로드를 위한 두 가지 패턴을 조합할 수 있습니다.

```html
<link
  rel="preload"
  as="image"
  href="wolf.jpg"
  imagesrcset="wolf_400px.jpg 400w, wolf_800px.jpg 800w, wolf_1600px.jpg 1600w"
  imagesizes="50vw"
/>
```

### 텍스트 파일 압축

[Gzip](https://www.youtube.com/watch?v=whGwm0Lky2s&feature=youtu.be&t=14m11s) 및 [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html)와 같은 압축 알고리즘은 서버와 브라우저 사이에 전송되는 텍스트 파일(HTML, CSS, JavaScript)의 크기를 크게 줄일 수 있습니다. Gzip은 모든 브라우저에서 효과적으로 지원되며 더 나은 압축 결과를 제공하는 Brotli 역시 [거의 모든 최신 브라우저에서 사용할 수 있습니다](https://caniuse.com/#feat=brotli).

리소스를 압축하면 전달 크기가 최소화되어 로드 시간이 향상되고 결과적으로 LCP가 향상됩니다.

1. 먼저 서버에서 이미 파일을 자동으로 압축하는 것은 아닌지 확인하세요. 대부분의 호스팅 플랫폼, CDN 및 역방향 프록시 서버는 기본적으로 자산을 압축으로 인코딩하거나 쉽게 구성할 수 있도록 지원합니다.
2. 파일을 압축하기 위해 서버를 수정해야 하는 경우 gzip 대신 더 나은 압축 비율을 제공하는 Brotli를 사용하는 것이 좋습니다.
3. 사용할 압축 알고리즘을 선택한 후에는 브라우저에서 요청하는 즉시 자산을 압축하는 대신 빌드 프로세스 중에 미리 자산을 압축하세요. 이렇게 하면 서버 오버헤드가 최소화되고, 특히 높은 압축률을 사용한 경우 요청 시 지연이 방지됩니다.

<figure>
  {% Img
    src="image/admin/Ckh2Jjkoh7ojLj5Wxeqc.png",
    alt="LCP 개선 예시: Brotli 압축 이전/이후",
    width="800",
    height="139"
  %}
  <figcaption>
    LCP 개선 예시: Brotli 압축 이전/이후
  </figcaption>
</figure>

{% Aside %} 자세한 내용은 [네트워크 페이로드 축소 및 압축](/reduce-network-payloads-using-text-compression/) 가이드를 참조하세요. {% endAside %}

### 적응형 게재

페이지의 메인 콘텐츠를 구성하는 리소스를 로드할 때 사용자의 기기나 네트워크 상황에 따라 조건부로 다른 자산을 가져오는 것이 효과적일 수 있습니다. [네트워크 정보](https://wicg.github.io/netinfo/), [장치 메모리](https://www.w3.org/TR/device-memory/) 및 [HardwareConcurrency](https://html.spec.whatwg.org/multipage/workers.html#navigator.hardwareconcurrency) API를 사용하여 수행할 수 있습니다.

초기 렌더링에 중요한 큰 자산이 있는 경우 사용자의 연결 또는 장치에 따라 동일한 리소스의 다양한 변형을 사용할 수 있습니다. 예를 들어, 4G보다 연결 속도가 낮다면 동영상 대신 이미지를 표시할 수 있습니다.

```js
if (navigator.connection && navigator.connection.effectiveType) {
  if (navigator.connection.effectiveType === '4g') {
    // Load video
  } else {
    // Load image
  }
}
```

사용할 수 있는 유용한 속성 목록은 다음과 같습니다.

- `navigator.connection.effectiveType`: 유효 연결 유형
- `navigator.connection.saveData`: 데이터 절약 활성화/비활성화
- `navigator.hardwareConcurrency`: CPU 코어 수
- `navigator.deviceMemory`: 장치 메모리

{% Aside %} 자세한 내용은 [네트워크 품질 기반 적응형 게재](/adaptive-serving-based-on-network-quality/)를 참조하세요. {% endAside %}

### 서비스 작업자를 사용하여 자산 캐시

서비스 작업자는 이 글의 앞에서 언급했듯 더 작은 HTML 응답을 제공하는 것을 포함하여 여러 가지 유용한 작업에 사용될 수 있습니다. 또한 반복 요청 시 네트워크에서 대신 브라우저에 제공할 수 있는 정적 리소스를 캐시하는 데 사용할 수도 있습니다.

서비스 작업자를 사용하여 중요한 리소스를 미리 캐싱하면 로드 시간을 크게 줄일 수 있습니다. 연결 상태가 약한 상태에서, 심지어는 오프라인에서 웹 페이지를 다시 로드하는 사용자의 경우 특히 그렇습니다. [Workbox](https://developer.chrome.com/docs/workbox/)와 같은 라이브러리는 사전 캐시된 자산 업데이트 프로세스를 만들 수 있으며 이는 커스텀 서비스 작업자를 작성하는 것보다 쉽습니다.

{% Aside %} 서비스 작업자 및 Workbox에 대해 자세히 알아보려면 [네트워크 안정성](/reliable/)을 참조하세요. {% endAside %}

## 클라이언트 측 렌더링 {: #client-side-rendering }

많은 사이트에서 클라이언트 측 JavaScript 논리를 사용하여 브라우저에서 직접 페이지를 렌더링합니다. [React](https://reactjs.org/) , [Angular](https://angular.io/) 및 [Vue](https://vuejs.org/) 같은 프레임워크 및 라이브러리를 사용하면 웹 페이지의 다양한 측면을 완전히 서버가 아닌 클라이언트에서 처리하는 단일 페이지 애플리케이션을 더 쉽게 구축할 수 있습니다.

대부분 클라이언트에서 렌더링되는 사이트를 구축하는 경우 대규모 JavaScript 번들을 사용한다면 LCP에 미칠 수 있는 영향에 주의해야 합니다. 이를 방지하기 위한 최적화가 이루어지지 않으면 모든 중요한 JavaScript의 다운로드 및 실행이 완료될 때까지 사용자가 페이지의 콘텐츠를 보거나 상호 작용할 수 없습니다.

클라이언트 측 렌더링 사이트를 구축할 때는 다음과 같은 최적화 방식을 고려하세요.

- 중요 JavaScript 최소화
- 서버 측 렌더링 사용
- 사전 렌더링 사용

### 중요 JavaScript 최소화

사이트의 콘텐츠가 일정량의 JavaScript가 다운로드된 후에만 표시되거나 상호 작용할 수 있는 경우 번들의 크기를 최대한 줄여야 합니다. 이를 위해서는 다음과 같은 방법을 사용하세요.

- JavaScript 축소
- 사용하지 않는 JavaScript 지연
- 사용하지 않는 Polyfills 최소화

이러한 최적화에 대해 자세히 알아보려면 [JavaScript 차단 시간 단축](#reduce-javascript-blocking-time) 섹션으로 돌아가세요.

### 서버 측 렌더링 사용

대부분 클라이언트에서 렌더링되는 사이트의 경우 항상 JavaScript의 양을 최소화하는 것에 가장 먼저 집중해야 합니다. 그러나 최대한 LCP를 개선하기 위해 서버 렌더링 경험을 결합하는 것도 고려해볼 수 있습니다.

이 개념은 서버를 사용하여 애플리케이션을 HTML로 렌더링하는 방식으로 작동합니다. 그러면 클라이언트가 모든 JavaScript 및 필수 데이터를 동일한 DOM 콘텐츠에 "[하이드레이션](https://www.gatsbyjs.org/docs/react-hydration/)"합니다. 이렇게 하면 페이지의 주요 콘텐츠가 클라이언트에서만이 아니라 서버에서 먼저 렌더링되도록 하여 LCP를 개선할 수 있지만 몇 가지 단점이 있습니다.

- 서버와 클라이언트에서 동일한 JavaScript 렌더링 애플리케이션을 유지 관리하면 복잡성이 증가할 수 있습니다.
- 서버에서 HTML 파일을 렌더링하기 위해 JavaScript를 실행하면 서버에서 정적 페이지를 제공하는 것과 비교하여 항상 서버 응답 시간(TTFB)이 늘어납니다.
- 서버에서 렌더링된 페이지는 상호 작용할 수 있는 것처럼 보이지만 모든 클라이언트 측 JavaScript가 실행될 때까지 사용자 입력에 응답할 수 없습니다. 이로 인해 [**Time to Interactive**](/tti/)(상호 작용까지의 시간, TTI)는 점수가 낮아집니다.

### 사전 렌더링 사용

사전 렌더링은 서버 측 렌더링보다는 덜 복잡하면서도 LCP를 개선하는 방법을 제공하는 별도의 기술입니다. 사용자 인터페이스가 없는 브라우저인 헤드리스 브라우저는 빌드 시 모든 경로의 정적 HTML 파일을 생성하는 데 사용됩니다. 이러한 파일은 이후 애플리케이션에 필요한 JavaScript 번들과 함께 제공될 수 있습니다.

사전 렌더링을 사용하면 TTI에는 여전히 부정적이지만, 서버 응답 시간은 요청된 후에만 각 페이지를 동적으로 렌더링하는 서버 측 렌더링 솔루션의 경우만큼 영향을 받지 않습니다.

<figure>
  {% Img
    src="image/admin/sm9s16UHfh8a5MDEWjxa.png",
    alt="LCP 개선 예시: 사전 렌더링 이전/이후",
    width="800",
    height="139"
  %}
  <figcaption>
    LCP 개선 예시: 사전 렌더링 이전/이후
  </figcaption>
</figure>

{% Aside %} 다양한 서버 렌더링 아키텍처에 대해 자세히 알아보려면 [웹에서 렌더링하기](/rendering-on-the-web/)를 참조하세요. {% endAside %}

## 개발자 도구

LCP를 측정하고 디버그하는 데 사용할 수 있는 여러 가지 도구가 있습니다.

- [Lighthouse 6.0](https://developer.chrome.com/docs/lighthouse/overview/)은 실험실 설정에서 LCP를 측정할 수 있도록 지원합니다.

  {% Img src="image/admin/Sar3Pa7TDe9ibny6sfq4.jpg", alt="Lighthouse 6.0", width="800", height="309" %}

- Chrome DevTools의 [Performance](https://developer.chrome.com/docs/devtools/evaluate-performance/) 패널에 있는 **Timing** 섹션에는 LCP 마커가 포함되어 있으며 **Related Node** 필드 위로 마우스를 가져가면 해당 LCP와 연결된 요소가 표시됩니다.

  {% Img src="image/admin/sxczQPKH0cvMBsNCx5uH.png", alt="Chrome DevTools의 LCP", width="800", height="509" %}

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/) 는 원본 수준에서 집계된 실제 LCP 값을 제공합니다.

_Philip Walton, Katie Hempenius, Kayce Basques, Ilya Grigorik의 리뷰에 감사드립니다._
