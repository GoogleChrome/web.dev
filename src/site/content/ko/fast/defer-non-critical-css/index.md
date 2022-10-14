---
layout: post
title: 중요하지 않은 CSS 연기
authors:
  - demianrenzulli
description: 중요 렌더링 경로를 최적화하고 FCP(First Contentful Paint)를 개선하기 위해 중요하지 않은 CSS를 연기하는 방법에 대해 알아보세요.
date: 2019-02-17
updated: 2020-06-12
tags:
  - performance
---

CSS 파일은 [렌더링 차단 리소스](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources)입니다. 브라우저가 페이지를 렌더링하기 전에 로드 및 처리해야 합니다. 불필요하게 큰 스타일이 포함된 웹 페이지는 렌더링하는 데 시간이 더 오래 걸립니다.

이 가이드에서는 [중요 렌더링 경로](/critical-rendering-path/)를 최적화하고 [FCP(First Contentful Paint)](/fcp/)를 개선하기 위해 중요하지 않은 CSS를 연기하는 방법에 대해 배우게 됩니다.

## 차선책으로 CSS 로드하기

다음 예제에는 각각 다른 클래스로 스타일이 지정된 3개의 숨겨진 텍스트 단락이 있는 아코디언이 포함되어 있습니다.

{% Glitch { id: 'defer-css-unoptimized', path: 'index.html' } %}

이 페이지는 8개의 클래스가 있는 CSS 파일을 요청하지만 "보이는" 콘텐츠를 렌더링하는 데 모든 클래스가 필요한 것은 아닙니다.

이 가이드의 목표는 이 페이지를 최적화하는 것이므로 **중요한** 스타일만 동기식으로 로드되고 나머지(예: 단락에 적용된 스타일)는 비차단 방식으로 로드됩니다.

## 측정

[페이지](/discover-performance-opportunities-with-lighthouse/#run-lighthouse-from-chrome-devtools)에서 [Lighthouse](https://defer-css-unoptimized.glitch.me/)를 실행하고 **성능** 섹션으로 이동합니다.

보고서는 값이 "1s"인 **First Contentful Paint** 메트릭과 **style.css** 파일을 가리키는 **렌더 차단 리소스 제거** 기회를 보여줍니다.

<figure>{% Img src="image/admin/eZtuQ2IwL3Mtnmz09bmp.png", alt="'1초'의 FCP 및 'Opportunities' 아래에 'Eliminate blocking resources'가 표시되는 최적화되지 않은 페이지에 대한 Lighthouse 보고서, ", width="800", height="640" %}</figure>

{% Aside %} 이 데모 사이트에 사용하는 CSS는 매우 작습니다. 더 큰 CSS 파일(프로덕션 시나리오에서 흔히 볼 수 있음)을 요청하는 경우 그리고 Lighthouse가 **폴드 상에 있는** 콘텐츠를 렌더링하는 동안 사용되지 않은 2048바이트 이상의 CSS 규칙이 페이지에 있음을 감지하면 **미사용 CSS 제거**라는 제안도 받게 됩니다. {% endAside %}

이 CSS가 렌더링을 차단하는 방법을 시각화하려면:

1. Chrome에서 [페이지](https://defer-css-unoptimized.glitch.me/)를 엽니다. {% Instruction 'devtools-performance', 'ol' %}
2. 성능 패널에서 **다시 로드**를 클릭합니다.

결과 추적에서 CSS가 다음에 대한 로드를 완료한 직후 **FCP** 마커가 배치된 것을 볼 수 있습니다.

<figure>{% Img src="image/admin/WhpaDYb98Rf03JmuPenp.png", alt="CSS 로드 후 FCP 시작을 나타내는 최적화되지 않은 페이지에 대한 DevTools 성능 추적.", width="800", height="352" %}</figure>

즉, 브라우저는 화면에 단일 픽셀을 그리기 전에 모든 CSS가 로드되고 처리될 때까지 기다려야 합니다.

## 최적화

이 페이지를 최적화하려면 "중요"로 간주되는 클래스를 알아야 합니다. 이를 위해 [Coverage Tool](https://developer.chrome.com/docs/devtools/css/reference/#coverage)을 사용합니다.

1. DevTools에서 {`Control+Shift+P` 또는 `Command+Shift+P` (Mac)를 눌러 [명령 메뉴](https://developer.chrome.com/docs/devtools/command-menu/)를 엽니다.
2. "Coverage"를 입력하고 **Show Coverage**를 선택합니다.
3. 페이지를 다시 로드하고 커버리지 캡처를 시작하려면 **리로드** 버튼을 클릭하십시오.

<figure>{% Img src="image/admin/JTFK7wjhlTzd2cCfkpps.png", alt="55.9% 미사용 바이트를 표시하는 CSS 파일 커버리지.", width="800", height="82" %}<br>두 가지 색상으로 표시된 클래스를 보려면 보고서를 두 번 클릭하십시오.</figure>

두 가지 색상으로 표시된 클래스를 보려면 보고서를 두 번 클릭하십시오.

- 녹색(**중요**): 브라우저에서 표시되는 콘텐츠(제목, 부제목, 아코디언 버튼 등)를 렌더링하는 데 필요한 클래스입니다.
- 빨간색(**중요하지 않음**): 이 스타일은 아코디언 안의 단락과 같이 즉시 표시되지 않는 콘텐츠에 적용됩니다.

이 정보를 사용하여 브라우저가 페이지 로드 후 즉시 중요한 스타일을 처리하도록 CSS를 최적화하고 중요하지 않은 CSS는 나중에 처리하도록 합니다.

- Coverage 도구에서 얻은 보고서에서 녹색으로 표시된 클래스 정의를 추출하고 해당 클래스를 페이지 헤드의 `<style>` 블록에 넣습니다.

```html
<style type="text/css">
  .accordion-btn {
    background-color: #add8e6;
    color: #444;
    cursor: pointer;
    padding: 18px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    transition: 0.4s;
  }
  .container {
    padding: 0 18px;
    display: none;
    background-color: white;
    overflow: hidden;
  }
  h1 {
    word-spacing: 5px;
    color: blue;
    font-weight: bold;
    text-align: center;
  }
</style>
```

- 그다음, 다음과 같은 패턴을 적용하여 나머지 클래스를 비동기적으로 로드합니다.

```html
<link
  rel="preload"
  href="styles.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript><link rel="stylesheet" href="styles.css" /></noscript>
```

이것은 CSS를 로드하는 일반적인 방법이 아닙니다. 작동 방식은 다음과 같습니다.

- `link rel="preload" as="style"`은 스타일시트를 비동기적으로 요청합니다. [중요 자산 사전 로드 가이드](/preload-critical-assets)에서 `preload`에 대해 자세히 알 수 있습니다.
- `link`의 `onload` 속성을 사용하면 로드가 완료될 때 CSS를 처리할 수 있습니다.
- `onload` 핸들러를 사용한 후 이를 "nulling"하면 rel 속성을 전환할 때 일부 브라우저가 핸들러를 다시 호출하지 않도록 할 수 있습니다.
- `noscript` 요소 내부의 스타일시트에 대한 참조는 JavaScript를 실행하지 않는 브라우저의 대체 수단으로 작동합니다.

{% Aside %} 이 가이드에서는 바닐라 코드를 사용하여 이 최적화를 구현했습니다. 실제 프로덕션 시나리오에서는 이 동작을 캡슐화하고 여러 브라우저에서 효과적으로 작동할 수 있는 [loadCSS](https://github.com/filamentgroup/loadCSS/blob/master/README.md)와 같은 기능을 사용하는 것이 좋습니다. {% endAside %}

[결과 페이지](https://defer-css-optimized.glitch.me/)는 대부분의 스타일이 비동기식으로 로드되는 경우에도 이전 버전과 정확히 동일해 보입니다. 인라인 스타일과 CSS 파일에 대한 비동기 요청이 HTML 파일에서 어떻게 보이는지 보여줍니다.

<!-- Copy and Paste Me -->

{% Glitch { id: 'defer-css-optimized', path: 'index.html', previewSize: 0 } %}

## 모니터

DevTools를 사용하여 [최적화된 페이지](https://defer-css-optimized.glitch.me/)에서 다른 **성능** 추적을 실행합니다.

**FCP** 마커는 페이지가 CSS를 요청하기 전에 나타납니다. 즉, 브라우저는 페이지를 렌더링하기 전에 CSS가 로드될 때까지 기다릴 필요가 없습니다.

<figure>{% Img src="image/admin/0mVq3q760y37JSn2MmCP.png", alt="CSS라 로드되기 전 FCP 시작을 표시하는 최적화되지 않은 페이지에 대한 DevTools 성능 추적.", width="800", height="389" %}</figure>

마지막 단계로 최적화된 페이지에서 Lighthouse를 실행합니다.

보고서에서 FCP 페이지가 **0.2초** 감소(20% 개선!)된 것을 볼 수 있습니다.

<figure>{% Img src="image/admin/oTDQFSlfQwS9SbqE0D0K.png", alt="'0.8초의 FCP 값을 나타내는 Lighthouse 보고서.", width="800", height="324" %}</figure>

**렌더링 차단 리소스 제거** 제안은 더 이상 **기회** 아래에 없으며 이제 **통과된 감사** 섹션에 속합니다.

<figure>{% Img src="image/admin/yDjEvZAcjPouC6I3I7qB.png", alt="'통과된 감사' 섹션에서 '차단 리소스 제거'를 표시하는 Lighthouse 보고서.", width="800", height="237" %}</figure>

## 다음 단계 및 참조

이 가이드에서는 페이지에서 미사용 코드를 수동으로 추출하여 중요하지 않은 CSS를 연기하는 방법에 대해 배웠습니다. 이에 대한 보완책으로, [중요한 CSS 추출 가이드](/extract-critical-css/)는 중요한 CSS를 추출하는 가장 인기 있는 도구 중 일부를 다루고 있으며 실제로 어떻게 작동하는지 확인할 수 있는 [코드랩](/codelab-extract-and-inline-critical-css/)을 포함하고 있습니다.
