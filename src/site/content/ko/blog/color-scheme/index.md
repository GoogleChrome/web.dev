---
title: "'color-scheme' CSS 속성과 해당 메타 태그를 사용하여 다크 모드 기본 스타일을 개선"
subhead: |2

  'color-scheme' CSS 속성 및 해당 메타 태그

  개발자가 사용자 에이전트 스타일시트의 테마별 기본값으로 페이지를 선택하도록 허용합니다.
authors:
  - thomassteiner
date: 2020-04-08
updated: 2021-10-19
hero: image/admin/rOe3wxcy28m5DCKcHv7E.jpg
alt: 배경에 선명한 흑백 대비가 있는 벽에 있는 비둘기.
description: |2

  색 구성표 CSS 속성 및 해당 메타 태그

  개발자가 사용자 에이전트 스타일시트의 테마별 기본값으로 페이지를 선택할 수 있도록 합니다.

  예를 들어 양식 컨트롤, 스크롤 막대 및 CSS 시스템 색상과 같은 것입니다.

  동시에 이 기능은 브라우저가 자체적으로 변환을 적용하는 것을 방지합니다.
tags:
  - blog
  - css
feedback:
  - api
---

## 배경

### `prefers-color-scheme` 사용자 기본 설정 미디어 기능

[`prefers-color-scheme`](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme) 사용자 기본 설정 미디어 기능을 통해 개발자는 페이지 모양을 완전히 제어할 수 있습니다. 익숙하지 않은 경우 내 기사 [`prefers-color-scheme`: Hello dark, my old friend](/prefers-color-scheme/)를 읽어보세요. 여기에서 놀라운 다크 모드 경험을 만드는 방법에 대해 알고 있는 모든 것을 문서화했습니다.

기사에서 간략하게만 언급된 퍼즐 조각 중 하나는 `color-scheme` CSS 속성과 동일한 이름의 해당 메타 태그입니다. 둘 다 예를 들어 양식 컨트롤, 스크롤 막대 및 CSS 시스템 색상과 같은 사용자 에이전트 스타일시트의 테마별 기본값에 페이지를 선택할 수 있도록 하여 개발자로서의 삶을 더 쉽게 만듭니다. 동시에 이 기능은 브라우저가 자체적으로 변환을 적용하는 것을 방지합니다.

### 사용자 에이전트 스타일시트

계속하기 전에 사용자 에이전트 스타일시트가 무엇인지 간략하게 설명하겠습니다. 대부분의 경우 *사용자 에이전트* *(UA)라는 단어를 브라우저* 를 말하는 멋진 방법으로 생각할 수 있습니다. UA 스타일시트는 페이지의 기본 모양과 느낌을 결정합니다. 이름에서 알 수 있듯이 UA 스타일시트는 해당 UA에 의존하는 것입니다. [Chrome](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css) (및 Chromium) UA 스타일시트를 보고 [Firefox](https://dxr.mozilla.org/mozilla-central/source/layout/style/res/html.css) 또는 [Safari](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css) (및 WebKit)와 비교할 수 있습니다. 일반적으로 UA 스타일시트는 대부분의 항목에 동의합니다. 예를 들어, 그들은 모두 링크를 파란색, 일반 텍스트 검정색, 배경색을 흰색으로 만들지만 양식 컨트롤의 스타일을 지정하는 방법과 같이 중요하고(때로는 짜증나는) 차이점도 있습니다.

[WebKit의 UA 스타일시트](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)와 이것이 다크 모드와 관련하여 하는 일을 자세히 살펴보십시오. (스타일시트에서 "dark"에 대한 전체 텍스트 검색을 수행하십시오.) 스타일시트에서 제공하는 기본값은 다크 모드가 켜져 있는지 여부에 따라 변경됩니다. [`:matches`](https://css-tricks.com/almanac/selectors/m/matches/) `-apple-system-control-background` 같은 WebKit 내부 변수와 WebKit 내부 전처리기 지시문 `#if defined` 사용하는 CSS 규칙이 있습니다.

```css
input,
input:matches([type="password"], [type="search"]) {
  -webkit-appearance: textfield;
  #if defined(HAVE_OS_DARK_MODE_SUPPORT) &&
      HAVE_OS_DARK_MODE_SUPPORT
    color: text;
    background-color: -apple-system-control-background;
  #else
    background-color: white;
  #endif
  /* snip */
}
```

`color` 및 `background-color` 속성에 대한 일부 비표준 값을 확인할 수 있습니다. `text`나 `-apple-system-control-background` 모두 유효한 CSS 색상이 아닙니다. WebKit 내부 *시맨틱* 색상입니다.

CSS는 의미 체계 색상을 표준화했습니다. [CSS 색상 모듈 레벨 4](https://drafts.csswg.org/css-color/#css-system-colors)에 지정되어 있습니다. 예를 들어 [`Canvas`](https://drafts.csswg.org/css-color/#valdef-system-color-canvas) `<canvas>` 태그와 혼동하지 말 것)는 애플리케이션 콘텐츠 또는 문서의 배경 [`CanvasText`](https://drafts.csswg.org/css-color/#valdef-system-color-canvastext)인 반면 CanvasText는 애플리케이션 콘텐츠 또는 문서의 텍스트용입니다. 이 둘은 함께 사용되며 단독으로 사용하면 안 됩니다.

UA 스타일시트는 고유한 독점 또는 표준화된 의미 체계 색상을 사용하여 기본적으로 HTML 요소를 렌더링하는 방법을 결정할 수 있습니다. 운영 체제가 어두운 모드로 설정되어 있거나 어두운 테마를 사용하는 경우 `CanvasText` (또는 `text`)는 조건부로 흰색으로 설정되고 `Canvas` (또는 `-apple-system-control-background`)는 검은색으로 설정됩니다. 그런 다음 UA 스타일시트는 다음 CSS를 한 번만 할당하고 밝은 모드와 어두운 모드를 모두 포함합니다.

```css
/**
  Not actual UA stylesheet code.
  For illustrative purposes only.
*/
body {
  color: CanvasText;
  background-color: Canvas
}
```

## `color-scheme` CSS 속성

[CSS 색상 조정 모듈 레벨 1](https://drafts.csswg.org/css-color-adjust/) 사양은 다크 모드, 대비 조정 또는 원하는 특정 색상 구성표와 같은 사용자 기본 설정을 처리할 목적으로 사용자 에이전트에 의한 자동 색상 조정에 대한 제어 및 모델을 소개합니다.

[`color-scheme`](https://drafts.csswg.org/css-color-adjust/#color-scheme-prop) 속성은 요소가 렌더링하기에 편안한 색 구성표를 나타낼 수 있도록 합니다. 이러한 값은 사용자의 기본 설정과 협상되어 CSS 시스템 색상의 사용된 값뿐만 아니라 양식 컨트롤 및 스크롤 막대의 기본 색상과 같은 사용자 인터페이스(UI) 항목에 영향을 미치는 선택된 색상 구성표가 생성됩니다. 현재 지원되는 값은 다음과 같습니다.

- *`normal`* 요소가 색 구성표를 전혀 인식하지 못하므로 요소가 브라우저의 기본 색 구성표로 렌더링되어야 함을 나타냅니다.

- *`[ light | dark ]+`* 요소가 나열된 색상 구성표를 인식하고 처리할 수 있음을 나타내며 이들 사이의 정렬된 기본 설정을 나타냅니다.

{% Aside 'note' %} 두 키워드를 모두 제공하면 첫 번째 구성표가 작성자가 선호함을 나타내지만 사용자가 대신 선호하는 경우 두 번째 구성표도 허용됩니다. {% endAside %}

이 목록에서 `light`는 밝은 배경색과 어두운 전경색을 사용하여 밝은 색 구성표를 `dark`는 어두운 배경색과 밝은 전경색으로 반대를 나타냅니다.

모든 요소에 대해 색 구성표로 렌더링하면 요소에 대해 브라우저에서 제공하는 모든 UI에서 사용되는 색이 색 구성표의 의도와 일치해야 합니다. 예를 들면 스크롤 막대, 맞춤법 검사 밑줄, 양식 컨트롤 등이 있습니다.

{% Aside 'note' %} `color-scheme` CSS 속성은 `:root` 수준과 개별 요소 수준 모두에서 사용할 수 있습니다. {% endAside %}

`:root` 요소에서 색 구성표를 사용한 렌더링은 추가로 캔버스의 표면 색상(즉, 전역 배경색), `color` 속성의 초기 값 및 시스템 색상의 사용 값에 영향을 주어야 하며 또한 뷰포트의 스크롤 막대에 영향을 줍니다.

```css
/*
  The page supports both dark and light color schemes,
  and the page author prefers dark.
*/
:root {
  color-scheme: dark light;
}
```

## `color-scheme` 메타 태그

`color-scheme` CSS 속성을 준수하려면 CSS를 먼저 다운로드하고(`<link rel="stylesheet">`를 통해 참조하는 경우) 구문 분석해야 합니다. 사용자 에이전트가 페이지 배경을 원하는 색 구성표로 *즉시* `color-scheme` [`<meta name="color-scheme">`](https://html.spec.whatwg.org/multipage/semantics.html#meta-color-scheme) 요소에 제공할 수도 있습니다.

```html
<!--
  The page supports both dark and light color schemes,
  and the page author prefers dark.
-->
<meta name="color-scheme" content="dark light">
```

## `color-scheme`와 `prefers-color-scheme` 색상 구성표 결합

메타 태그와 CSS 속성(`:root` 요소에 적용된 경우) 모두 결국 동일한 동작을 일으키므로 항상 메타 태그를 통해 색 구성표를 지정하는 것이 좋습니다. 그러면 브라우저가 선호하는 구성표를 더 빨리 채택할 수 있습니다.

절대 기준선 페이지의 경우 추가 CSS 규칙이 필요하지 않지만 일반적인 경우 항상 `color-scheme`과 `prefers-color-scheme`를 결합해야 합니다. 예를 들어 WebKit 및 Chrome에서 클래식 링크 파란색 `rgb(0,0,238)`에 대해 사용하는 독점 WebKit CSS 색상 `-webkit-link`는 검은색 배경에서 명암비가 2.23:1로 충분하지 않으며 WCAG AA는 물론 WCAG AAA [요구 사항](https://www.w3.org/WAI/WCAG21/Understanding/conformance#levels) 둘 다에서 [실패](https://webaim.org/resources/contrastchecker/?fcolor=0000EE&bcolor=000000)합니다.

[Chrome](https://crbug.com/1066811), [WebKit](https://bugs.webkit.org/show_bug.cgi?id=209851) 및 [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1626560)에 대한 버그와 H[TML 표준의 메타 문제](https://github.com/whatwg/html/issues/5426)를 열어 이 문제를 해결했습니다.

## `prefers-color-scheme`와의 상호 작용

`color-scheme` CSS 속성과 해당 메타 태그와 `prefers-color-scheme` 사용자 기본 설정 미디어 기능의 상호 작용은 처음에는 혼란스러워 보일 수 있습니다. 사실 둘이서 정말 잘 놀아요. 이해해야 할 가장 중요한 것은 `color-scheme`이 기본 모양을 독점적으로 결정하는 반면, `prefers-color-scheme`은 스타일 가능한 모양을 결정한다는 것입니다. 이를 명확히 하기 위해 다음 페이지를 가정합니다.

```html
<head>
  <meta name="color-scheme" content="dark light">
  <style>
    fieldset {
      background-color: gainsboro;
    }
    @media (prefers-color-scheme: dark) {
      fieldset {
        background-color: darkslategray;
      }
    }
  </style>
</head>
<body>
  <p>
    Lorem ipsum dolor sit amet, legere ancillae ne vis.
  </p>
  <form>
    <fieldset>
      <legend>Lorem ipsum</legend>
      <button type="button">Lorem ipsum</button>
    </fieldset>
  </form>
</body>
```

페이지의 인라인 CSS 코드는 설정 `<fieldset>` 요소의 `background-color` 하는 `gainsboro` 일반적인 경우에,하고 `darkslategray` 사용자가 선호하는 경우 `dark` 에 따라 색상 `prefers-color-scheme` 사용자 환경 미디어 기능을.

`<meta name="color-scheme" content="dark light">` 요소를 통해 페이지는 브라우저에 어두운 테마에 대한 기본 설정과 함께 어둡고 밝은 테마를 지원한다고 알려줍니다.

운영 체제가 어두운 모드로 설정되어 있는지 밝은 모드로 설정되어 있는지에 따라 사용자 에이전트 스타일시트에 따라 전체 페이지가 어둡게 표시되거나 그 반대의 경우도 마찬가지입니다. 단락 텍스트 또는 페이지의 배경색을 변경하기 위해 개발자가 제공한 추가 CSS가 *없습니다.*

페이지에서 개발자가 제공한 인라인 스타일시트의 규칙에 따라 다크 모드가 활성화되었는지 여부에 따라 `<fieldset>` 요소의 `background-color`가 변화합니다. `gainsboro` 또는 `darkslategray` 중 하나입니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kSgOIiGRqjw2PvRlVCaV.png", alt="밝은 모드의 페이지입니다.", width="800", height="322" %}<figcaption> <strong>라이트 모드:</strong> 개발자와 사용자 에이전트가 지정한 스타일입니다. 사용자 에이전트 스타일시트에 따라 텍스트는 검정색이고 배경은 흰색입니다. <code>&lt;fieldset&gt;</code> 요소의 <code>background-color</code>은 인라인 개발자 스타일시트에 따라 <code>gainsboro</code>입니다.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qqkHz83kerktbDIGCJeG.png", alt="어두운 모드의 페이지입니다.", width="800", height="322" %}<figcaption> <strong>다크 모드:</strong> 개발자와 사용자 에이전트가 지정한 스타일입니다. 사용자 에이전트 스타일시트에 따라 텍스트는 흰색이고 배경은 검은색입니다. <code>&lt;fieldset&gt;</code> 요소의 <code>background-color</code> 은 인라인 개발자 스타일시트에 따라 <code>darkslategray</code>입니다.</figcaption></figure>

`<button>` 요소의 모양은 사용자 에이전트 스타일시트에 의해 제어됩니다. `color`가 [`ButtonText`](https://drafts.csswg.org/css-color/#valdef-system-color-buttontext) 시스템 색상으로 설정되고 `background-color` 및 네 개의 `border-color`는 시스템 색상 [`ButtonFace`](https://drafts.csswg.org/css-color/#valdef-system-color-buttonface)로 설정됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lSNFROIe1P94DlhoVtoV.png", alt="ButtonFace 속성을 사용하는 라이트 모드 페이지입니다.", width="800", height="322" %}<figcaption> <strong>라이트 모드:</strong> <code>background-color</code> 및 다양한 <code>border-color</code>가 <a href="https://drafts.csswg.org/css-color/#valdef-system-color-buttonface">ButtonFace</a> 시스템 색상으로 설정됩니다.</figcaption></figure>

`<button>` 요소의 `border-color`가 어떻게 변경되는지 확인합니다. `border-top-color`과 `border-bottom-color`에 대한 *계산된* 값은 `rgba(0, 0, 0, 0.847)`(어두움)에서 `rgba(255, 255, 255, 0.847)`(밝음)으로 전환합니다. 사용자 에이전트는 색상 구성표에 따라 `ButtonFace`를 동적으로 업데이트하기 때문입니다. 관련 시스템 색상 `ButtonText`에 설정된 `<button>`요소의 `color`에 대해 같은 방식이 적용됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IogmyIzUhokJgnnxUkPi.png", alt="계산된 색상 값이 ButtonFace와 일치함을 표시합니다.", width="800", height="322" %}<figcaption> <strong>라이트 모드:</strong> 사용자 에이전트 스타일시트에서 <code>ButtonFace</code>로 설정된 <code>border-top-color</code> 및 <code>border-bottom-color</code>의 계산된 값 <code>rgba(0, 0, 0, 0.847)</code>입니다.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3sU1uZyt3zNhEgw3gpZJ.png", alt="어두운 모드에서 계산된 색상 값이 ButtonFace와 여전히 일치함을 표시합니다.", width="800", height="322" %}<figcaption> <strong>다크 모드:</strong> 사용자 에이전트 스타일시트에서 <code>ButtonFace</code>로 설정된 <code>border-top-color</code> 및 <code>border-bottom-color</code>의 계산된 값은 이제 <code>rgba(255, 255, 255, 0.847)</code>입니다.</figcaption></figure>

## 데모

[Glitch](https://color-scheme-demo.glitch.me/) 의 데모에서 많은 수의 HTML 요소에 적용된 `color-scheme` 의 효과를 볼 수 있습니다. 데모는 [위의 경고](#using-color-scheme-in-practice)에 언급된 링크 색상으로 WCAG AA 및 WCAG AAA [위반](https://webaim.org/resources/contrastchecker/?fcolor=0000EE&bcolor=000000)을 *의도적으로* 보여줍니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bqXapQKcNbyE3uwEOELO.png", alt="라이트 모드에 있는 데모입니다.", width="800", height="982" %}<figcaption> <a href="https://color-scheme-demo.glitch.me/">데모</a>가 <code>color-scheme: light</code> 전환되었습니다.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9G4hFdtSSwPLOm57zedD.png", alt="다크 모드에 있는 데모입니다.", width="800", height="982" %}<figcaption> <a href="https://color-scheme-demo.glitch.me/">데모</a>가 <code>color-scheme: dark</code> 전환되었습니다. 링크 색상과 함께 WCAG AA 및 WCAG AAA <a href="https://webaim.org/resources/contrastchecker/?fcolor=0000EE&amp;bcolor=000000">위반</a>에 유의하십시오.</figcaption></figure>

## 감사의 말

`color-scheme` CSS 속성과 해당 메타 태그는 [Rune Lillesveen](https://github.com/lilles)에 의해 구현되었습니다. Rune은 CSS 색상 조정 모듈 레벨 1 사양의 공동 편집자이기도 합니다. [Unsplash](https://unsplash.com/@philinit?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)의 [Philippe Leone](https://unsplash.com/photos/dbFfEBOCrkU)의 영웅 이미지.
