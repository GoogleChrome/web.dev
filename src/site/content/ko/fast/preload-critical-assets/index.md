---
layout: post
title: 중요한 자산을 미리 로드하여 로딩 속도 향상
authors:
  - houssein
  - mihajlija
description: 웹 페이지를 여는 즉시 브라우저가 서버에 HTML 문서를 요청하고 HTML 파일의 내용을 구문 분석하며 다른 외부 참조에 대한 별도의 요청을 제출합니다. 중요 요청 체인은 브라우저에서 우선 순위를 지정하고 가져오는 리소스 순서를 나타냅니다.
date: 2018-11-05
updated: 2020-05-27
codelabs:
  - codelab-preload-critical-assets
  - codelab-preload-web-fonts
tags:
  - performance
feedback:
  - api
---

웹 페이지를 열면 브라우저가 서버에서 HTML 문서를 요청하고 해당 내용을 구문 분석하며 참조된 리소스에 대한 별도의 요청을 제출합니다. 개발자는 페이지에 필요한 모든 리소스와 그 중 가장 중요한 리소스를 이미 알고 있습니다. 이러한 지식을 활용하여 중요한 리소스를 미리 요청하고 로딩 프로세스의 속도를 높일 수 있습니다. 이 게시물에서는 `<link rel="preload">`를 사용하여 로딩 프로세서의 속도를 높이는 방법에 대해 설명합니다.

## 사전 로딩 작동 방식

사전 로딩은 일반적으로 브라우저가 늦게 발견한 리소스에 가장 적합합니다.

<figure>{% Img src="image/admin/Ad9PLq3DcQt9Ycp63z6O.png", alt="Chrome DevTools Network 패널에 대한 스크린샷.", width="701", height="509" %} <figcaption>이 예제에서, Pacifico 글꼴은 <a href="/reduce-webfont-size/#defining-a-font-family-with-@font-face)"><code>@font-face</code></a> 규칙을 사용하여 스타일시트에 지정됩니다. 브라우저는 스타일시트 다운로드 및 구문 분석을 완료한 이후에만 글꼴 파일을 로드합니다.</figcaption></figure>

특정 리소스를 미리 로드하면 현재 페이지에 중요하다고 확신하기 때문에 브라우저가 검색할 때보다 더 빨리 가져오고 싶다고 브라우저에 알립니다.

<figure>{% Img src="image/admin/PgRbERrxLGfF439yBMeY.png", alt="사전 로딩 적용 후 Chrome DevTools Network 패널에 대한 스크린샷.", width="701", height="509" %} <figcaption>이 예제에서는 Pacifico 글꼴이 미리 로드되어 있으므로 스타일시트를 사용하는 동시에 다운로드됩니다.</figcaption></figure>

중요한 요청 체인은 브라우저에서 우선순위를 지정하고 가져오는 리소스의 순서를 나타냅니다. Lighthouse는 이 체인의 세 번째 수준에 있는 자산을 늦게 발견한 자산으로 식별합니다. [**사전 로드 키 요청**](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preload/) 감사를 사용하여 사전 로드할 리소스를 식별할 수 있습니다.

{% Img src="image/admin/BPUTHBNZFbeXqb0dVx2f.png", alt="Lighthouse의 사전 로드 키 요청 감사.", width="745", height="97" %}

HTML 문서의 헤드에 `rel="preload"`가 있는 `<link>` 태그를 추가하여 리소스를 미리 로드할 수 있습니다.

```html
<link rel="preload" as="script" href="critical.js">
```

브라우저는 미리 로드된 리소스를 캐시하므로 필요 시 즉시 사용할 수 있습니다. (스크립트를 실행하거나 스타일시트를 적용하지 않습니다.)

{% Aside %} 사전 로딩을 구현한 후 [Shopify, Financial Times 및 Treebo](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)를 포함한 많은 사이트에서 [Interactive 시간](/tti/) 및 [First Contentful Paint](/fcp/)와 같은 사용자 중심 매트릭이 1초 개선되었습니다. {% endAside %}

리소스 힌트(예: [`preconnect`](/preconnect-and-dns-prefetch) 및 [`prefetch`](/link-prefetch))는 브라우저가 적합하다고 판단하는 대로 실행됩니다. 반면에 `preload`는 브라우저에 필수입니다. 최신 브라우저는 이미 리소스의 우선순위를 정하는 데 능숙합니다. `preload` 드물게 사용하고 가장 중요한 리소스만 미리 로드하는 것이 중요하기 때문입니다.

사용되지 않은 프리로드는 `load` 이벤트 후 약 3초 후에 Chrome에서 콘솔 경고를 트리거합니다.

{% Img src="image/admin/z4FbCezjXHxaIhq188TU.png", alt="사용되지 않은 리소스에 대한 Chrome DevTools Console 경고.", width="800", height="228" %}

{% Aside %} `preload`는 모든 최신 브라우저에서 [지원됩니다](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility). {% endAside %}

## 사용 사례

{% Aside 'caution' %} 작성 시점에서 Chrome에는 우선순위가 더 높은 다른 리소스보다 빨리 가져오는 미리 로드된 요청에 대한 공개 [버그](https://bugs.chromium.org/p/chromium/issues/detail?id=788757)가 있습니다. 이 문제가 해결될 때까지 미리 로드된 리소스가 어떻게 "대기열을 건너뛰고" 원래보다 빠르게 요청될 수 있는지 살펴보세요. {% endAside %}

### CSS에 지정된 리소스 사전 로딩

[`@font-face`](/reduce-webfont-size/#defining-a-font-family-with-@font-face) 규칙으로 지정된 글꼴 또는 CSS 파일에 지정된 배경 이미지는 브라우저가 해당 CSS 파일을 다운로드하고 구문 분석할 때까지 검색되지 않습니다. 이러한 리소스를 미리 로드하면 CSS 파일이 다운로드되기 전에 가져올 수 있습니다.

### CSS 파일 사전 로딩

[중요한 CSS 접근 방식](/extract-critical-css)을 사용하고 있는 경우 CSS를 두 부분으로 나눕니다. 위의 내용을 렌더링하는 데 필요한 중요한 CSS는 문서의 `<head>`에 표시되며 중요하지 않은 CSS는 일반적으로 JavaScript에서 지연 로딩됩니다. 중요하지 않은 CSS를 로드하기 전에 JavaScript가 실행될 때까지 기다리면 사용자가 스크롤할 때 렌더링 지연이 발생합니다. 따라서 다운로드를 더 일찍 시작하려면 `<link rel="preload">`를 사용하는 것이 좋습니다.

### JavaScript 파일 사전 로딩

브라우저는 사전 로드된 파일을 실행하지 않으므로 사전 로딩은 [실행](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/)에서 가져오기를 분리하는 데 유용합니다. 이를 통해  Interactive 시간 같은 매트릭을 개선할 수 있습니다. JavaScript 번들을 [분할](/reduce-javascript-payloads-with-code-splitting)하고 중요한 청크만 미리 로드할 경우 사전 로딩이 가장 적합합니다.

## rel=preload 구현 방법

`preload`를 구현하는 가장 간단한 방법은 문서의 `<head>`에 `<link>` 태그를 추가하는 것입니다.

```html
<head>
  <link rel="preload" as="script" href="critical.js">
</head>
```

`as` 속성을 제공하면 브라우저가 유형에 따라 미리 가져온 리소스의 우선순위를 설정하고, 올바른 헤더를 설정하며, 리소스가 이미 캐시에 있는지 여부를 판단하는 데 도움이 됩니다. 이 속성에 허용되는 값은 `script`, `style`, `font`, `image`  [등](https://developer.mozilla.org/docs/Web/HTML/Element/link#Attributes)입니다.

{% Aside %} 브라우저가 다양한 유형의 리소스에 우선순위를 지정하는 방법에 대해 자세히 알아보려면 [Chrome 리소스 우선순위 및 일정](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit) 문서를 살펴보세요. {% endAside %}

{% Aside 'caution' %} `as` 속성을 생략하거나 유효하지 않은 값을 갖는 것은 [XHR 요청](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)과 같습니다. 여기서 브라우저는 무엇을 가져오는지 알지 못하므로 올바른 우선순위를 판단할 수 없습니다. 또한 스크립트와 같은 일부 리소스를 두 번 가져올 수도 있습니다. {% endAside %}

글꼴과 같은 일부 리소스 유형은 [익명 모드](https://www.w3.org/TR/css-fonts-3/#font-fetching-requirements)로 로드됩니다. `preload`가 있는 `crossorigin`을 설정해야 합니다.

```html
<link rel="preload" href="ComicSans.woff2" as="font" type="font/woff2" crossorigin>
```

{% Aside 'caution' %} `crossorigin` 속성 없이 미리 로드된 글꼴은 두 번 가져옵니다! {% endAside %}

`<link>` 요소는 또한 [`type` 속성](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types)을 수락하는 데 여기에는 링크 연결된 리소스의 [MIME 유형](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types)이 포함됩니다. 브라우저는 `type` 속성을 사용하여 파일 유형이 지원되는 경우에만 리소스를 미리 로드합니다. 브라우저가 지정된 리소스 유형을 지원하지 않을 경우 이는 `<link rel="preload">`를 무시합니다.

{% Aside 'codelab' %}  [웹 글꼴을 미리 로드하여 페이지 성능을 개선합니다](/codelab-preload-web-fonts). {% endAside %}

[`Link` HTTP 헤더](https://developer.mozilla.org/docs/Web/HTTP/Headers/Link)를 통해 모든 유형의 리소스를 미리 로드할 수도 있습니다.

`Link: </css/style.css>; rel="preload"; as="style"`

HTTP 헤더에서 `preload`를 지정함으로써 누릴 수 있는 이점은 브라우저가 문서를 찾기 위해 문서를 구문 분석할 필요가 없다는 데 있습니다. 이는 일부 경우에서 약간의 개선 효과를 제공할 수 있습니다.

### 웹팩을 사용하여 JavaScript 모듈 사전 로딩

애플리케이션의 빌드 파일을 생성하는 모듈 번들러를 사용하는 경우 사전 로드 태그 삽입 기능을 지원하는지 확인해야 합니다. [webpack](https://webpack.js.org/) 버전 4.6.0 이상에서는 사전 로딩 기능이 `import()` 내의 [magic comments](https://webpack.js.org/api/module-methods/#magic-comments)를 사용하여 지원됩니다.

```js
import(_/* webpackPreload: true */_ "CriticalChunk")
```

이전 버전의 웹팩을 사용하는 경우 [preload-webpack-plugin](https://github.com/GoogleChromeLabs/preload-webpack-plugin)과 같은 타사 플러그인을 사용하세요.

## 결론

페이지 속도를 개선하려면 브라우저가 늦게 발견한 중요한 리소스를 미리 로드하십시오. 모든 것을 미리 로드하는 것은 생산성이 떨어질 수 있으므로 `preload`를 조금만 사용하고 [실제 환경에 미치는 영향을 측정하십시오](/fast#measure-performance-in-the-field).
