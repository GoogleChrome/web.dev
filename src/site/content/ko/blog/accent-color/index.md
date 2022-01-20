---
layout: post
title: CSS `accent-color`
subhead: 한 줄의 코드로 브랜드 색상을 기본 제공 HTML 양식 입력으로 가져옵니다.
authors:
  - adamargyle
  - jarhar
description: 한 줄의 코드로 브랜드 색상을 기본 제공 HTML 양식 입력으로 가져옵니다.
date: 2021-08-11
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/WOcuCLCwMr0M2lF17bmm.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/huEpiCoJQ6dAo8rHGsZT.png
tags:
  - blog
  - css
---

오늘날의 HTML 양식 요소는 [사용자 정의하기가 어렵습니다](https://codepen.io/GeoffreyCrofte/pen/BiHzp). 사용자 정의 스타일이 거의 없거나 전혀 없는 것과 입력 스타일을 재설정하고 처음부터 구축하는 것 중 하나를 선택하는 것처럼 느껴집니다. 처음부터 구축하는 것은 예상보다 훨씬 더 많은 작업이 필요합니다. 또한 요소 상태([불확실한 상태](https://developer.mozilla.org/docs/Web/CSS/:indeterminate), 브라우저가 이를 주시함)에 대한 스타일을 잊어 버리고 기본 제공 접근성 기능이 손실될 수 있습니다. 브라우저가 제공하는 것을 완전히 재창조하기 위해서는 하려고 하는 일보다 더 많은 작업이 필요할 수 있습니다.

```css
accent-color: hotpink;
```

[CSS UI 사양](https://www.w3.org/TR/css-ui-4/#widget-accent)의 CSS `accent-color`는 CSS의 한 라인으로 엘리먼트에 색조를 지정합니다. 이는 브랜드를 엘리먼트로 가져올 수 있는 방법을 제공함으로써 사용자 정의에 대한 노력을 덜어줍니다.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/CfSS3F1XUsfCHIB86xeE.png", alt="체크상자, 라디오 버튼, 범위 슬라이더 및 진행 요소가 모두 색조 지정된 핫핑크인 강조 색상 데모에 대한 밝은 테마 스크린샷.", width="800", height="548" %} <figcaption> <a href="https://codepen.io/web-dot-dev/pen/PomBZdy">데모</a> </figcaption></figure>

`accent-color` 속성은 [`color-scheme`](/color-scheme/)과도 작동하므로 작성자가 밝은 요소와 어두운 요소 모두에 색조를 지정할 수 있습니다. 다음 예에서 사용자는 어두운 테마 활성화를 가지며 페이지는 `color-scheme: light dark`을 사용하고 어두운 테마 핫핑크 색조 지정된 컨트롤을 위해 동일한 `accent-color: hotpink`를 사용합니다.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/3gxeeZoSLY34tsMxkyt9.png", alt="체크상자, 라디오 버튼, 범위 슬라이더 및 진행 요소가 모두 색조 지정된 핫핑크인 강조 색상 데모에 대한 어두운 테마 스크린샷.", width="800", height="548" %} <figcaption> <a href="https://codepen.io/web-dot-dev/pen/PomBZdy">Demo</a> </figcaption></figure>

### 브라우저 지원

이 글을 작성하는 시점에서 Chromium 93+ 및 Firefox 92+는 `accent-color`를 지원합니다.

## 지원 요소

현재, 네 가지 요소 즉, [체크상자](#checkbox), [라디오](#radio), [범위](#range) 및 [진행](#progress)만 `accent-color` 속성을 통해 색조가 지정됩니다. 각각의 요소는 밝고 어두운 색상 구조로 [https://accent-color.glitch.me](https://accent-color.glitch.me)에서 미리 볼 수 있습니다.

{% Aside "warning" %} 다음 데모 요소가 모두 같은 색상이라면 브라우저는 `accent-color`를 지원하지 않는 것입니다. {% endAside %}

### 체크상자

{% Codepen { user: 'web-dot-dev', id: 'dyWjGqZ' } %}

### 라디오

{% Codepen { user: 'web-dot-dev', id: 'WNjKrgB' } %}

### 범위

{% Codepen { user: 'web-dot-dev', id: 'yLbqeRy' } %}

### 진행

{% Codepen { user: 'web-dot-dev', id: 'rNmrxqL' } %}

## 대비 보장

액세스할 수 없는 요소가 존재하는 것을 방지하기 위해 `accent-color`가 있는 브라우저는 사용자 정의 액센트와 함께 사용할 [적격 대비 색상](https://webaim.org/articles/contrast/)을 결정해야 합니다. 다음은 Chrome 94(왼쪽)와 Firefox 92 Nightly(오른쪽)의 알고리즘이 어떻게 다른지 보여주는 스크린샷입니다.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/DJhB56n10Eh8O29RsRdE.png", alt="다양한 색조와 음영으로 전체 체크상자 스펙트럼을 렌더링하는 나란히 놓인 Firefox와 Chromium 스크린샷.", width="800", height="832" %}

여기에서 가장 중요한 것은 **브라우저를 신뢰**하는 것입니다. 브랜드 색상을 제공하고 브라우저가 현명한 결정을 내릴 것이라고 신뢰하세요.

{% Aside %} 브라우저는 어두운 테마에서 색상을 변경하지 않습니다. {% endAside %}

## 추가: 더 많은 색조 지정

이 네 가지 양식 요소보다 더 많은 요소를 색조 지정하는 방법이 궁금한가요? 다음은 색조를 지정하는 최소 샌드박스입니다.

- 초점 링
- 텍스트 선택 하이라이트
- 목록 [마커](/css-marker-pseudo-element/)
- 화살표 표시기(Webkit만 해당)
- 스크롤바 썸(Firefox만 해당)

```css
html {
  --brand: hotpink;
  scrollbar-color: hotpink Canvas;
}

:root { accent-color: var(--brand); }
:focus-visible { outline-color: var(--brand); }
::selection { background-color: var(--brand); }
::marker { color: var(--brand); }

:is(
  ::-webkit-calendar-picker-indicator,
  ::-webkit-clear-button,
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button
) {
  color: var(--brand);
}
```

{% Codepen { user: 'web-dot-dev', id: 'RwVBreJ' } %}

### 잠재적 미래

사양은 본 문서에 제시된 네 가지 요소에 `accent-color`를 적용하는 것을 제한하지 않으며 나중에 더 많은 지원이 추가될 수 있습니다. `<select>`에서 선택한 `<option>`과 같은 요소는 `accent-color`로 강조 표시될 수 있습니다.

웹에서 어떤 것을 색조 지정하고 싶은가요? 선택기로 [@argyleink](https://twitter.com/argyleink)를 트윗하면 이 문서에 추가될 수 있습니다!
