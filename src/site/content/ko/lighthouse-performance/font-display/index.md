---
layout: post
title: 웹폰트 로드 중에 텍스트가 계속 표시되도록 하기
description: 글꼴 표시 API를 사용하여 웹 페이지 텍스트가 사용자에게 항상 표시되도록 하는 방법을 알아보세요.
date: 2019-05-02
updated: 2020-04-29
web_lighthouse:
  - 글꼴 표시
---

글꼴은 로드하는 데 시간이 많이 걸리는 대용량 파일인 경우가 많습니다. 일부 브라우저는 글꼴이 로드될 때까지 텍스트를 숨기면서 [보이지 않는 텍스트의 플래시(FOIT)](/avoid-invisible-text)를 일으킵니다.

## Lighthouse 글꼴 표시 감사가 실패하는 방식

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 보이지 않는 텍스트를 플래시시킬 수 있는 모든 글꼴 URL에 플래그를 지정합니다.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/251Gbh9tn89GDJY289zZ.png", alt="웹폰트 로드 중에 텍스트가 계속 표시되도록 하기 Lighthouse 감사의 스크린샷", width="800", height="430" %}</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## 보이지 않는 텍스트가 표시되지 않도록 하는 방법

사용자 정의 글꼴이 로드되는 동안 보이지 않는 텍스트가 표시되지 않도록 하는 가장 쉬운 방법은 시스템 글꼴을 일시적으로 표시하는 것입니다. `@font-face` 스타일에 `font-display: swap`을 포함하면 대부분의 최신 브라우저에서 FOIT를 피할 수 있습니다.

```css
@font-face {
  font-family: 'Pacifico';
  font-style: normal;
  font-weight: 400;
  src: local('Pacifico Regular'), local('Pacifico-Regular'), url(https://fonts.gstatic.com/s/pacifico/v12/FwZY7-Qmy14u9lezJ-6H6MmBp0u-.woff2) format('woff2');
  font-display: swap;
}
```

[글꼴 표시 API](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display)는 글꼴이 표시되는 방식을 지정합니다. `swap`은 글꼴을 사용하는 텍스트가 시스템 글꼴을 사용하여 즉시 표시되어야 함을 브라우저에 알립니다. 사용자 정의 글꼴이 준비되면 시스템 글꼴을 대체합니다. (자세한 내용은 [로드 중 보이지 않는 텍스트의 표시 방지](/avoid-invisible-text) 게시물을 참조하세요.)

### 웹 글꼴 미리 로드

글꼴 파일을 더 일찍 가져오려면 `<link rel="preload" as="font">`를 사용하세요. 자세한 정보:

- [로딩 속도 향상을 위해 웹 글꼴 미리 로드(codelab)](/codelab-preload-web-fonts/)
- [선택적 글꼴을 미리 로드하여 레이아웃 이동 및 보이지 않는 텍스트의 플래시(FOIT) 방지](/preload-optional-fonts/)

### Google 글꼴

Google 글꼴 URL 끝에 `&display=swap` [매개변수](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#Basics_anatomy_of_a_URL)를 추가합니다.

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
```

## 브라우저 지원

모든 주요 브라우저가 `font-display: swap`을 지원하는 것은 아니므로 보이지 않는 텍스트 문제를 해결하기 위해 조금 더 많은 작업이 필요할 수도 있습니다.

{% Aside 'codelab' %} 모든 브라우저에서 FOIT를 피하는 방법을 알아보려면 [보이지 않는 텍스트의 플래시 방지 codelab](/codelab-avoid-invisible-text)을 확인하세요. {% endAside %}

## 스택별 지침

### Drupal

테마에서 사용자 정의 글꼴을 정의할 때 `@font-display`를 지정합니다.

### Magento

[사용자 정의 글꼴을 정의](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/css-topics/using-fonts.html)할 때 `@font-display`를 지정합니다.

## 리소스

- [**웹폰트 로드 중에 텍스트가 계속 표시되도록 하기** 감사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/font-display.js)
- [로딩 중 보이지 않는 텍스트 피하기](/avoid-invisible-text)
- [글꼴 표시로 글꼴 성능 제어](https://developers.google.com/web/updates/2016/02/font-display)
- [로딩 속도 향상을 위해 웹 글꼴 미리 로드(codelab)](/codelab-preload-web-fonts/)
- [선택적 글꼴을 미리 로드하여 레이아웃 이동 및 보이지 않는 텍스트의 플래시(FOIT) 방지](/preload-optional-fonts/)
