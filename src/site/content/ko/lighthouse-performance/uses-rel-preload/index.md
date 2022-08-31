---
layout: post
title: 주요 요청 사전 로드
description: |2-

  uses-rel-preload 감사에 대해 알아봅니다.
date: 2019-05-02
updated: 2020-06-04
web_lighthouse:
  - use-rel-preload
---

Lighthouse 보고서의 '기회' 섹션에는 중요 요청 체인에 있는 세 번째 수준의 요청이 사전 로드 후보로 표시됩니다.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fvwBQLvwfogd6ukq4vTZ.png", alt="Lighthouse 주요 요청 사전 로드 감사를 보여주는 스크린샷", width="800", height="214" %}</figure>

## Lighthouse 플래그가 사전 로드 후보를 결정하는 방법

페이지의 [중요 요청 체인](/critical-request-chains)이 다음과 같다고 가정합니다.

```html
index.html
|--app.js
   |--styles.css
   |--ui.js
```

`index.html` 파일은 `<script src="app.js">`를 선언합니다. `app.js`가 실행되면 `styles.css` 및 `ui.js`를 다운로드하기 위해 `fetch()`가 호출됩니다. 마지막 2개의 리소스가 다운로드되어 구문 분석 및 실행될 때까지 페이지가 완료된 것으로 표시되지 않습니다. 위의 예를 사용했을 때 Lighthouse는 `styles.css` 및 `ui.js`를 후보로 플래그 지정합니다.

잠재적 절감 효과는 사전 로드 링크를 선언한 경우 브라우저가 요청을 얼마나 일찍 시작할 수 있는가에 달려 있습니다. 예를 들어, `app.js`를 다운로드하여 구문 분석하고 실행하는 데 200ms가 걸린다면 각 리소스에 대한 잠재적인 절감 효과는 200ms입니다. `app.js`는 더 이상 각 요청에 병목을 일으키지 않기 때문입니다.

요청을 사전 로드하면 페이지가 더 빨리 로드될 수 있습니다.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OiT1gArpZxNliikhBgx7.png", alt="사전 로드 링크가 없으면 style.css 및 ui.js는 app.js가 다운로드되어 구문 분석 및 실행된 후에만 요청됩니다.", width="800", height="486" %}   <figcaption>     사전 로드 링크가 없으면 <code>app.js</code>가 다운로드되어 구문 분석 및 실행된 후에만 <code>styles.css</code> 및 <code>ui.js</code>가 요청됩니다.   </figcaption></figure>

여기서 문제는, `app.js`를 다운로드하여 구문 분석하고 실행한 후에만 브라우저가 마지막 2개의 리소스를 인식하게 된다는 데 있습니다. 그러나 이러한 리소스는 중요하므로 가능한 한 빨리 다운로드해야 합니다.

## 사전 로드 링크 선언

HTML에 사전 로드 링크를 선언하여 브라우저가 가능한 한 빨리 주요 리소스를 다운로드하도록 지시합니다.

```html
<head>
  ...
  <link rel="preload" href="styles.css" as="style">
  <link rel="preload" href="ui.js" as="script">
  ...
</head>
```

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tJLJXH2qXcrDBUfsSAK5.png", alt="사전 로드 링크를 사용하면 style.css 및 ui.js가 app.js와 동시에 요청됩니다.", width="800", height="478" %}   <figcaption>     사전 로드 링크를 사용하면 <code>styles.css</code> 및 <code>ui.js</code>가 <code>app.js</code>와 동시에 요청됩니다.   </figcaption></figure>

추가 지침은 [중요 자산을 사전 로드하여 로딩 속도 개선하기](/preload-critical-assets)를 참조하세요.

### 브라우저 호환성

2020년 6월부터 Chromium 기반 브라우저에서 사전 로드가 지원됩니다. 업데이트는 [브라우저 호환성](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility)을 참조하세요.

### 사전 로드를 위한 빌드 도구 지원 {: #tools }

[Tooling.Report의 자산 사전 로드](https://bundlers.tooling.report/non-js-resources/html/preload-assets/?utm_source=web.dev&utm_campaign=lighthouse&utm_medium=uses-rel-preload) 페이지를 참조하세요.

## 스택별 지침

### Angular

탐색 속도를 높이려면 미리 [경로를 사전 로드](/route-preloading-in-angular/)하세요.

### Magento

[테마 레이아웃을 수정](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/xml-manage.html)하고 `<link rel=preload>` 태그를 추가하세요.

## 리소스

- [**주요 요청 사전 로드** 감사의 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/uses-rel-preload.js)
