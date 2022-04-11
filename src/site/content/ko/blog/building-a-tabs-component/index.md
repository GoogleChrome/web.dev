---
layout: post
title: 탭 구성 요소 빌드
subhead: iOS 및 Android 앱에서 발견할 수 있는 것과 유사한 탭 구성 요소를 빌드하는 방법에 대한 기본 개요입니다.
authors:
  - adamargyle
description: iOS 및 Android 앱에서 발견할 수 있는 것과 유사한 탭 구성 요소를 빌드하는 방법에 대한 기본 개요입니다.
date: 2021-02-17
hero: image/admin/sq79nDAthaQGcdQkqazJ.png
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

이 게시물에서는 반응형이고 여러 장치 입력을 지원하며 여러 브라우저에서 작동하는 웹용 탭 구성 요소를 구축하는 방법에 대한 생각을 공유합니다. [데모](https://gui-challenges.web.app/tabs/dist/)를 사용해 보세요.

<figure data-size="full">{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/IBDNCMVCysfM9fYC9bnP.mp4", autoplay="true", loop="true", muted="true" %} <figcaption> <a href="https://gui-challenges.web.app/tabs/dist/">데모</a> </figcaption></figure>

동영상을 선호하는 경우 이 게시물의 YouTube 버전이 있습니다.

{% YouTube 'mMBcHcvxuuA' %}

## 개요

탭은 디자인 시스템의 일반적인 구성 요소이지만 다양한 모양과 형태를 취할 수 있습니다. 처음에는 `<frame>` 요소를 기반으로 하는 데스크톱 탭이 있었으며 이제 물리적 속성을 기반으로 콘텐츠에 애니메이션을 적용하는 버터 같은 모바일 구성 요소가 있습니다. 그들은 모두 같은 일을 하려고 합니다. 바로 공간 절약입니다.

오늘날 탭 사용자 경험의 핵심은 디스플레이 프레임에서 콘텐츠의 가시성을 토글하는 버튼 탐색 영역입니다. 많은 다른 콘텐츠 영역이 동일한 공간을 공유하지만 이들은 탐색에서 선택한 버튼을 기반으로 조건부로 표시됩니다.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/eAaQ44VAmzVOO9Cy5Wc8.png", alt="웹이 구성 요소 개념에 적용한 스타일의 거대한 다양성으로 인해 콜라주가 매우 혼란스럽습니다.", width="800", height="500" %} <figcaption> 지난 10년 동안의 탭 구성 요소 웹 디자인 스타일의 콜라주 </figcaption></figure>

## 웹 전술

몇 가지 중요한 웹 플랫폼 기능 덕분에 이 구성 요소를 빌드하기가 대체적으로 매우 간단하다는 것을 알게 되었습니다.

- 적절한 스크롤 정지 위치와 함께 우아한 스와이프 및 키보드 상호 작용을 위한 `scroll-snap-points`
- 인페이지 앵커링 및 공유 지원을 처리한 브라우저를 위한 URL 해시를 통한 [딥링크](https://en.wikipedia.org/wiki/Deep_linking)
- `<a>` 및 `id="#hash"` 요소 마크업을 통한 스크린 리더 지원
- 크로스페이드 전환 및 즉각적인 인페이지 스크롤을 활성화하기 위한 `prefers-reduced-motion`
- 선택한 탭에 동적으로 밑줄을 긋고 색상을 변경하는 초안 상태(in-draft)의 `@scroll-timeline` 웹 기능

### HTML {: #markup }

기본적인 UX는 다음과 같습니다. 링크를 클릭하고 URL이 중첩된 페이지 상태를 나타내도록 한 다음, 일치하는 요소로 브라우저가 스크롤할 때 콘텐츠 영역 업데이트를 확인합니다.

여기에는 링크 및 `:target`과 같은 구조적 콘텐츠 구성 요소가 있습니다. 우리는 `<nav>`가 유용한 링크 목록과 `<section>`가 유용한 `<article>` 요소의 목록이 필요합니다. 각 링크 해시는 섹션과 일치하게 되며 브라우저가 앵커링을 통해 스크롤할 수 있도록 합니다.

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Pr8BrPDjq8ga9NyoHLJk.mp4", autoplay="true", loop="true", muted="true" %} <figcaption> 링크 버튼을 클릭하면 초점이 맞춰진 콘텐츠가 슬라이딩됩니다. </figcaption></figure>

예를 들어 링크를 클릭하면 Chrome 89의 `:target` 기사에 자동으로 초점이 맞춰지며 JS가 필요하지 않습니다. 그러면 사용자는 언제나처럼 입력 장치로 기사 콘텐츠를 스크롤할 수 있습니다. 이는 마크업에 표시된 대로 무료 콘텐츠입니다.

저는 다음 마크업을 사용하여 탭을 구성했습니다.

```html
<snap-tabs>
  <header>
    <nav>
      <a></a>
      <a></a>
      <a></a>
      <a></a>
    </nav>
  </header>
  <section>
    <article></article>
    <article></article>
    <article></article>
    <article></article>
  </section>
</snap-tabs>
```

저는 다음과 같이 `href` 및 `id` 속성을 사용하여 `<a>` 및 `<article>` 요소 간의 연결을 설정할 수 있습니다.

```html/3,10
<snap-tabs>
  <header>
    <nav>
      <a href="#responsive"></a>
      <a href="#accessible"></a>
      <a href="#overscroll"></a>
      <a href="#more"></a>
    </nav>
  </header>
  <section>
    <article id="responsive"></article>
    <article id="accessible"></article>
    <article id="overscroll"></article>
    <article id="more"></article>
  </section>
</snap-tabs>
```

다음으로 저는 혼합된 양의 lorem으로 문서를 채우고 혼합된 길이와 이미지 세트의 제목으로 링크를 채웠습니다. 우리는 작업할 콘텐츠로 레이아웃을 시작할 수 있습니다.

### 스크롤 레이아웃 {: #overscroll }

이 구성 요소에는 3가지 유형의 스크롤 영역이 있습니다.

- 탐색<b style="color: #FF00E2;">(분홍색)</b>은 가로로 스크롤 할 수 있습니다.
- 콘텐츠 영역<b style="color: #008CFF;">(파란색)</b>은 가로로 스크롤 할 수 있습니다.
- 각 문서 항목<b style="color: #2FD800;">(녹색)</b>은 세로로 스크롤 할 수 있습니다.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/qVmUKMwbeoCBffP0aY55.png", alt="스크롤 영역의 윤곽을 표시하고 스크롤 방향을 표시하는 색 맞추기 방향 화살표와 3가지 색상의 상자.", width="800", height="450" %}</figure>

스크롤과 관련된 두 가지 유형의 요소가 있습니다.

1. **창(window)** <br>`overflow` 속성 스타일이 있는 정의된 치수가 있는 상자입니다.
2. **오버사이즈 표면** <br>이 레이아웃에서는 탐색 링크, 섹션 문서 및 문서 콘텐츠와 같은 목록 컨테이너입니다.

#### `<snap-tabs>` 레이아웃 {: #tabs-layout }

제가 선택한 최상위 레이아웃은 flex(Flexbox)였습니다. 저는 헤더와 섹션이 세로로 정렬되도록 방향을 `column`으로 설정했습니다. 이것은 우리의 첫 번째 스크롤 창이며 오버플로가 숨겨져 있는 모든 것을 숨깁니다. 헤더와 섹션은 곧 오버스크롤을 개별 영역으로 사용할 것입니다.

{% Compare 'better', 'HTML' %}

```html
<snap-tabs>
  <header></header>
  <section></section>
</snap-tabs>
```

{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
snap-tabs {
  display: flex;
  flex-direction: column;

  /* establish primary containing box */
  overflow: hidden;
  position: relative;

  & > section {
    /* be pushy about consuming all space */
    block-size: 100%;
  }

  & > header {
    /* defend against <section> needing 100% */
    flex-shrink: 0;
    /* fixes cross browser quarks */
    min-block-size: fit-content;
  }
}
```

{% endCompare %}

3색 스크롤 다이어그램으로 다시 돌아가 살펴보면:

- `<header>`는 이제 <b style="color: #FF00E2;">(분홍색)</b> 스크롤 컨테이너가 될 준비가 되었습니다.
- `<section>`은 <b style="color: #008CFF;">(파란색)</b> 스크롤 컨테이너가 될 준비가 되었습니다.

아래에서 [VisBug](https://a.nerdy.dev/gimme-visbug)로 강조 표시한 프레임은 스크롤 컨테이너가 생성한 **창**을 확인하는 데 도움이 됩니다.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/Fyl0rTuETjORBigkIBx5.png", alt="이 헤더 및 섹션 요소에 핫핑크색의 오버레이가 있으며 이는 구성 요소에서 차지하는 공간을 설명합니다.", width="800", height="620" %}</figure>

#### 탭 `<header>` 레이아웃 {: #tabs-header }

다음 레이아웃은 거의 동일합니다. 저는 flex를 사용하여 세로 순서를 만듭니다.

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html/1-4
<snap-tabs>
  <header>
    <nav></nav>
    <span class="snap-indicator"></span>
  </header>
  <section></section>
</snap-tabs>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css/1-2
header {
  display: flex;
  flex-direction: column;
}
```
{% endCompare %}
</div>

`.snap-indicator`는 링크 그룹과 함께 세로로 이동해야 하며, 이 헤더 레이아웃은 해당 단계를 설정하는 데 도움이 됩니다. 여기에는 절대 위치 요소가 없습니다!

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/EGNIrpw4gEzIZEcsAt5R.png", alt="nav 및 span.indicator 요소에는 구성 요소에서 이들이 차지하는 공간을 설명하는 핫핑크색 오버레이가 있습니다.", width="800", height="368" %}</figure>

다음은 스크롤 스타일입니다. 우리가 2개의 가로 스크롤 영역(헤더 및 섹션) 간에 스크롤 스타일을 공유할 수 있다는 것이 밝혀졌기에 저는 유틸리티 클래스인 `.scroll-snap-x`를 만들었습니다.

```css
.scroll-snap-x {
  /* browser decide if x is ok to scroll and show bars on, y hidden */
  overflow: auto hidden;
  /* prevent scroll chaining on x scroll */
  overscroll-behavior-x: contain;
  /* scrolling should snap children on x */
  scroll-snap-type: x mandatory;

  @media (hover: none) {
    scrollbar-width: none;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
}
```

각각은 x축에 오버플로가 필요하며, 오버스크롤을 트래핑하기 위한 스크롤 포함, 터치 장치용 숨겨진 스크롤 막대, 마지막으로 콘텐츠 표시 영역을 잠그기 위한 스크롤 스냅이 필요합니다. 우리의 키보드 탭 순서는 액세스할 수 있으며 모든 상호 작용 가이드는 자연스럽게 초점을 맞춥니다. 또한, 스크롤 스냅 컨테이너는 각각의 키보드에서 멋진 캐러셀 스타일 상호 작용을 얻습니다.

#### 탭 헤더 `<nav>` 레이아웃 {: #tabs-header-nav }

nav 링크는 줄 바꿈 없이 세로로 가운데에 배치되어야 하며 각 링크 항목은 스크롤 스냅 컨테이너에 맞춰져야 합니다. 2021 CSS를 위한 신속한 작업입니다!

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html/1-4
<nav>
  <a></a>
  <a></a>
  <a></a>
  <a></a>
</nav>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
nav {
  display: flex;

  & a {
    scroll-snap-align: start;

    display: inline-flex;
    align-items: center;
    white-space: nowrap;
  }
}
```
{% endCompare %}
</div>

각 링크는 자체적으로 스타일과 크기를 지정하므로 nav 레이아웃은 방향과 흐름만 지정하면 됩니다. nav 항목의 고유한 너비는 표시기가 새 대상에 맞게 너비를 조정할 때 탭 간 전환을 재미있게 만듭니다. 여기에 있는 요소의 수에 따라 브라우저는 스크롤 막대를 렌더링할지 여부를 결정합니다.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/P7Vm3EvhO1wrTK1boU6y.png", alt="이 nav 요소에는 핫핑크색 오버레이가 표시되어 이들이 구성 요소에서 차지하는 공간과 오버플로되는 위치를 설명합니다.", width="800", height="327" %}</figure>

#### 탭 `<section>` 레이아웃 {: #tabs-section }

이 섹션은 flex 항목이며 공간의 기준 소비자가 되어야 합니다. 또한 문서를 배치할 열을 생성해야 합니다. 다시 말하지만, CSS 2021를 위한 신속한 작업입니다! `block-size: 100%`는 상위 항목을 최대한 채우도록 이 요소를 확장한 다음 자체 레이아웃을 위해 상위 항목의 너비가 `100%`인 일련의 열을 만듭니다. 상위 항목에 대한 강력한 제약 조건을 작성했기 때문에 백분율은 여기에서 훌륭하게 작동합니다.

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html/1-4
<section>
  <article></article>
  <article></article>
  <article></article>
  <article></article>
</section>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
section {
  block-size: 100%;

  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
}
```
{% endCompare %}
</div>

이는 마치 우리가 "강제적으로라도 세로로 최대한 확장하세요"하는 것과 같으며(`flex-shrink: 0`으로 설정한 헤더를 기억하세요. 이는 확장 압력에 대한 방어제입니다), 이는 전체 높이 열의 세트의 행 높이를 설정합니다. `auto-flow` 스타일은 상위 창을 오버플로하기 위해 그리드로 하여금 항상 우리가 원하는 대로 하위 항목을 줄 바꿈 없이 세로로 배치하도록 지시합니다.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/FYroCMocutCGg1X8kfdG.png", alt="이 문서 요소에는 구성 요소에서 이들이 차지하는 공간과 오버플로되는 위치를 설명하는 핫핑크색 오버레이가 있습니다.", width="800", height="512" %}</figure>

저는 때때로 이러한 내용이 이해하기 어렵다는 것을 발견합니다! 이 섹션 요소는 상자로 구분하고 있지만 상자 세트도 생성했습니다. 시각 자료와 설명이 도움이 되었으면 합니다.

#### 탭 `<article>` 레이아웃 {: #tabs-article }

사용자는 문서 콘텐츠를 스크롤할 수 있어야 하며 스크롤 막대는 오버플로가 있는 경우에만 표시되어야 합니다. 이러한 문서 요소는 깔끔한 위치에 있습니다. 그들은 동시에 스크롤 상위 요소이자 스크롤 하위 요소입니다. 브라우저는 여기에서 우리를 위해 까다로운 터치, 마우스 및 키보드 상호 작용을 실제로 처리합니다.

<div class="switcher">
{% Compare 'better', 'HTML' %}
```html
<article>
  <h2></h2>
  <p></p>
  <p></p>
  <h2></h2>
  <p></p>
  <p></p>
  ...
</article>
```
{% endCompare %}

{% Compare 'better', 'CSS' %}

```css
article {
  scroll-snap-align: start;

  overflow-y: auto;
  overscroll-behavior-y: contain;
}
```
{% endCompare %}
</div>

저는 이 문서가 상위 스크롤러 내에서 스냅되도록 선택했습니다. 저는 탐색 링크 항목과 문서 요소가 각각의 스크롤 컨테이너의 인라인 시작에 스냅하는 방식을 정말 좋아합니다. 그것이 조화로운 관계처럼 보이고 느껴지기 때문입니다.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/O8gJp7AxBty8yND4fFGr.png", alt="문서 요소와 그 하위 요소에 핫핑크색의 오버레이가 있으며 구성 요소에서 그들이 차지하는 공간과 오버플로 방향을 설명합니다.", width="800", height="808" %}</figure>

이 문서는 그리드의 하위 요소이며 우리가 스크롤 UX를 제공하고자 하는 뷰포트 영역으로 크기가 미리 정해져 있습니다. 이것은 제가 높이나 너비 스타일이 필요하지 않다는 것을 의미하며, 저는 오버플로 방식을 정의하기만 하면 됩니다. 저는 overflow-y를 auto로 설정한 다음 편리한 overscroll-behavior 속성으로 스크롤 상호 작용을 트래핑합니다.

#### 3개의 스크롤 영역 요약 {: #scroll-areas-recap }

아래에서 저는 시스템 설정에서 "항상 스크롤 막대 표시"를 선택했습니다. 레이아웃과 스크롤 오케스트레이션을 검토해야 하기 때문에 저는 이 설정이 켜진 상태에서 레이아웃이 작동하는 것이 두 배로 중요하다고 생각합니다.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/6I6TI9PI4rvrJ9lr8T99.png", alt="3개의 스크롤 막대가 표시되도록 설정되어 이제 레이아웃 공간을 소비하고 있으며, 구성 요소는 여전히 멋있어 보입니다.", width="500", height="607" %}</figure>

저는 이 구성 요소에서 스크롤 막대의 여백을 보는 것은 스크롤 영역이 어디에 있는지, 스크롤 영역이 지원하는 방향 및 서로 상호 작용하는 방식을 명확하게 표시하는 데 도움이 된다고 생각합니다. 이러한 스크롤 창 프레임 각각이 레이아웃의 플렉스 또는 그리드 상위 요소가 되는 방법을 고려하세요.

DevTools는 다음을 시각화하는 데 도움이 될 수 있습니다.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/GFJwc3IggHY4G5fBMiu9.png", alt="스크롤 영역에 그리드 및 플렉스박스(Flexbox) 도구 오버레이가 있어 구성 요소에서 차지하는 공간과 오버플로 방향을 설명합니다.", width="800", height="455" %} <figcaption> 앵커 요소로 가득 찬 플렉스박스 nav 요소 레이아웃, 문서 요소로 가득 찬 그리드 섹션 레이아웃, 단락과 제목 요소로 가득 찬 문서 요소를 보여주는 Chromium Devtools. </figcaption></figure>

스냅핑, 딥 링크 및 키보드 액세스 등 스크롤 레이아웃이 완료되었습니다. UX 향상, 스타일 및 즐거움을 위한 강력한 기반입니다.

#### 기능 하이라이트

스크롤 스냅된 자식은 크기 조정 중에 잠긴 위치를 유지합니다. 즉, JavaScript는 장치 회전 또는 브라우저 크기 조정 시 아무 것도 표시할 필요가 없습니다. Chromium DevTools [장치 모드](https://developer.chrome.com/docs/devtools/device-mode/)에서 **반응형** 이외의 모드를 선택한 다음 장치 프레임 크기를 조정하여 사용해 보세요. 요소는 계속 표시되며 콘텐츠와 함께 잠겨 있음에 유의하세요. 이것은 Chromium이 사양과 일치하도록 구현을 업데이트한 이후에 사용할 수 있었습니다. 다음은 이에 대한 [블로그 게시물](/snap-after-layout/)입니다.

### 애니메이션 {: #animation }

여기서 애니메이션 작업의 목표는 상호 작용을 UI 피드백과 명확하게 연결하는 것입니다. 이는 사용자가 모든 콘텐츠를 원활하게(잘 될 경우) 찾을 수 있도록 안내하거나 지원하는 데 도움이 됩니다. 저는 목적과 조건부로 모션을 추가하겠습니다. 이제 사용자는 자신의 운영체제에서 [자신의 모션 선호 설정](/prefers-reduced-motion/)을 지정할 수 있으며, 저는 저의 인터페이스에서 사용자의 선호 설정에 응답하는 것을 즐깁니다.

기사 스크롤 위치에 탭 밑줄을 연결하겠습니다. 스냅핑은 정렬을 잘하기 위해 사용할 뿐만 아니라  애니메이션의 시작과 끝을 고정시키는 역할도 합니다. 이렇게 하면 [미니 맵](https://en.wikipedia.org/wiki/Mini-map)과 같은 역할을 하는 `<nav>`가 콘텐츠에 연결된 상태로 유지됩니다. 우리는 CSS와 JS 모두에서 사용자의 모션 선호 설정을 확인할 것입니다. 고려해야 할 몇 가지 좋은 위치가 있습니다!

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/D4zfhetqvhqlcPdTRtLZ.mp4", autoplay="true", loop="true", muted="true" %}</figure>

#### 스크롤 동작 {: #scroll-behavior }

`:target` 및 `element.scrollIntoView()` 모두의 모션 동작을 향상시킬 수 있습니다. 기본적으로 이는 인스턴트입니다. 브라우저는 스크롤 위치만 설정합니다. 그럼, 우리가 거기에서 깜박이는 대신 스크롤 위치로 전환하려면 어떻게 해야 할까요?

```css
@media (prefers-reduced-motion: no-preference) {
  .scroll-snap-x {
    scroll-behavior: smooth;
  }
}
```

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Q4JDplhM9gEd4PoiXqs6.mp4", autoplay="true", loop="true", muted="true" %}</figure>

여기에서 우리는 모션과 사용자가 제어하지 않는 모션(예: 스크롤)을 소개하므로 우리는 사용자가 자신의 운영 체제에 모션 감소에 대한 선호 설정이 없는 경우에만 이 스타일을 적용합니다. 이런 식으로, 우리는 이런 설정에 대해 괜찮아하는 사람들에게만 스크롤 동작을 소개합니다.

#### 탭 표시기 {: #tabs-indicator }

이 애니메이션의 목적은 표시기를 콘텐츠 상태와 연결하는 데 도움이 되는 것입니다. 저는 모션 감소를 선호하는 사용자를 위해 색상 지정 크로스페이드 `border-bottom` 스타일을 사용하고 모션 사용에 동의하는 사용자에게 스크롤 링크 슬라이딩 + 색상 페이드 애니메이션을 사용하기로 결정했습니다.

Chromium Devtools에서 저는 선호 설정을 토글 설정하고 2가지 다른 전환 스타일을 시연할 수 있습니다. 저는 이것을 구축하는 데 많은 재미를 느꼈습니다.

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/NVoLHgjGjf7fZw5HFpF6.mp4", autoplay="true", loop="true", muted="true" %}</figure>

```css
@media (prefers-reduced-motion: reduce) {
  snap-tabs > header a {
    border-block-end: var(--indicator-size) solid hsl(var(--accent) / 0%);
    transition: color .7s ease, border-color .5s ease;

    &:is(:target,:active,[active]) {
      color: var(--text-active-color);
      border-block-end-color: hsl(var(--accent));
    }
  }

  snap-tabs .snap-indicator {
    visibility: hidden;
  }
}
```

저는 더 이상 필요로 하지 않기 때문에 사용자가 모션 감소를 선호하는 경우 저는 `.snap-indicator`를 숨깁니다. 그런 다음 이를 `border-block-end` 스타일과 `transition`으로 교체합니다. 또한 탭 상호 작용에서 활성 nav 항목이 있는 탭 상호 작용 알림에 브랜드 밑줄 강조 표시가 있을 뿐만 아니라 텍스트 색상이 더 어둡다는 것을 알 수 있습니다. 활성 요소는 더 높은 텍스트 색상 대비와 밝은 언더라이트 액센트가 있습니다.

CSS를 몇 줄만 추가하면 누군가가 본 듯한 느낌을 받을 수 있습니다(우리가 그들의 모션 선호 설정을 신중하게 존중한다는 의미에서). 저는 그것을 좋아합니다.

#### `@scroll-timeline` {: #scroll-timeline }

위의 섹션에서는 저는 여러분께 모션 감소 크로스페이드 스타일을 처리하는 방법을 보여 드렸습니다. 앞으로 이 섹션에서는 표시기와 스크롤 영역을 함께 연결하는 방법을 보여 드리겠습니다. 다음은 재미있는 실험적인 내용입니다. 여러분들도 저만큼 즐기시길 바랍니다.

```js
const { matches:motionOK } = window.matchMedia(
  '(prefers-reduced-motion: no-preference)'
);
```

저는 먼저 JavaScript에서 사용자의 모션 선호 설정을 확인합니다. 결과가 `false`(사용자가 모션 감소를 선호함을 의미함)인 경우 스크롤 링크 동작 효과를 실행하지 않습니다.

```js
if (motionOK) {
  // motion based animation code
}
```

이 글을 작성하는 시점에는 [`@scroll-timeline`에 대한 브라우저 지원](https://caniuse.com/css-scroll-timeline)이 없었습니다. 이는 실험적 구현만 포함된 [초안 사양](https://drafts.csswg.org/scroll-animations-1/)입니다. 하지만 제가 사용하는 이 데모인 보충 기능(polyfill)이 있습니다.

##### ` ScrollTimeline`

CSS와 JavaScript는 모두 스크롤 타임라인을 생성할 수 있지만 저는 JavaScript를 선택하였고, 그래서 애니메이션에서 라이브 요소 측정을 사용할 수 있었습니다.

```js
const sectionScrollTimeline = new ScrollTimeline({
  scrollSource: tabsection,  // snap-tabs > section
  orientation: 'inline',     // scroll in the direction letters flow
  fill: 'both',              // bi-directional linking
});
```

저는 1개 항목이 다른 항목의 스크롤 위치를 따르길 바라며, `ScrollTimeline`을 생성하는 작업을 통해 스크롤 링크의 드라이버인 `scrollSource`를 정의합니다. 일반적으로 웹의 애니메이션은 전역 시간 프레임 틱에 대해 실행되지만, 메모리에 사용자 지정 `sectionScrollTimeline`이 있으면 저는 모든 것을 변경할 수 있습니다.

```js
tabindicator.animate({
    transform: ...,
    width: ...,
  }, {
    duration: 1000,
    fill: 'both',
    timeline: sectionScrollTimeline,
  }
);
```

애니메이션의 키프레임으로 들어가기 전에 스크롤의 팔로워인 `tabindicator`가 사용자 지정 타임라인, 즉 우리 섹션의 스크롤을 기반으로 애니메이션 작업을 수행하도록 가리키는 것이 중요하다고 생각합니다. 이렇게 하면 연결을 완료하지만, 애니메이션을 적용할 상태 저장 지점 혹은 키프레임이라고 부르는 최종 구성 요소가 누락되어 있습니다.

#### 동적 키프레임

`@scroll-timeline`으로 애니메이션을 적용하는 정말 강력한 순수한 선언적 CSS 방식이 있지만 제가 선택한 애니메이션은 너무 동적이었습니다. `auto` 너비 간에 전환할 수 있는 방법은 없으며, 하위 요소 길이를 기반으로 다수의 키프레임을 동적으로 생성할 수 있는 방법도 없습니다.

JavaScript는 해당 정보를 얻는 방법을 알고 있기에 우리는 하위 요소를 직접 반복하고 런타임에 계산된 값을 가져올 것입니다.

```js
tabindicator.animate({
    transform: [...tabnavitems].map(({offsetLeft}) =>
      `translateX(${offsetLeft}px)`),
    width: [...tabnavitems].map(({offsetWidth}) =>
      `${offsetWidth}px`)
  }, {
    duration: 1000,
    fill: 'both',
    timeline: sectionScrollTimeline,
  }
);
```

각 `tabnavitem`에 대해 `offsetLeft` 위치를 구조 분해(destructure)하고 이를 `translateX` 값으로 사용하는 문자열을 반환합니다. 그러면 애니메이션에 대한 4개의 변환 키프레임이 생성됩니다. 이는 너비에 대해서도 동일하게 수행되며, 각각의 동적 너비가 무엇인지 묻고 이를 키프레임 값으로 사용합니다.

다음은 저의 글꼴 및 브라우저 선호 설정을 기반으로 한 출력의 예입니다.

TranslateX 키프레임:

```js
[...tabnavitems].map(({offsetLeft}) =>
  `translateX(${offsetLeft}px)`)

// results in 4 array items, which represent 4 keyframe states
// ["translateX(0px)", "translateX(121px)", "translateX(238px)", "translateX(464px)"]
```

너비 키프레임:

```js
[...tabnavitems].map(({offsetWidth}) =>
  `${offsetWidth}px`)

// results in 4 array items, which represent 4 keyframe states
// ["121px", "117px", "226px", "67px"]
```

전략을 요약하자면, 섹션 스크롤러의 스크롤 스냅 위치에 따라 탭 표시기가 4개의 키프레임에 걸쳐 애니메이션 작업을 수행합니다. 스냅 포인트는 우리의 키프레임 사이를 명확하게 설명하고 애니메이션의 동기화된 느낌에 실제로 추가합니다.

<figure>{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/jV5X2JMkgUQSIpcivvTJ.png", alt="활성 탭과 비활성 탭은 VisBug 오버레이와 함께 표시되어 두 가지 모두에 대한 통과 대비 점수를 보여줍니다.", width="540", height="400" %}</figure>

사용자는 상호 작용으로 애니메이션을 구동하며, 표시기의 너비와 위치가 한 섹션에서 다음 섹션으로 변경되는 것을 보고 스크롤을 사용하여 완벽하게 추적합니다.

눈치채지 못하셨겠지만 저는 강조 표시된 탐색 항목이 선택될 때 색상이 변하는 것을 매우 자랑스럽게 생각합니다.

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/qoxGO8SR2t6GPuCWhwvu.mp4", autoplay="true", loop="true", muted="true" %}</figure>

강조 표시된 항목의 대비가 더 높을 때 선택하지 않은 밝은 회색이 항목이 훨씬 더 뒤로 밀려 나타납니다. 마우스를 가져갔을 때와 선택했을 때와 같이 텍스트의 색상을 전환하는 것이 일반적이며, 밑줄 표시기와 동기화되어 스크롤할 때 해당 색상을 전환하는 것은 다음 단계입니다.

제가 한 방법은 다음과 같습니다.

```js
tabnavitems.forEach(navitem => {
  navitem.animate({
      color: [...tabnavitems].map(item =>
        item === navitem
          ? `var(--text-active-color)`
          : `var(--text-color)`)
    }, {
      duration: 1000,
      fill: 'both',
      timeline: sectionScrollTimeline,
    }
  );
});
```

각 탭 nav 링크에는 밑줄 표시기와 동일한 스크롤 타임라인을 추적하는 이 새로운 색상 애니메이션이 필요합니다. 저는 이전과 동일한 타임라인을 사용합니다. 이것의 역할은 스크롤 시 눈금을 내보내는 것이기 때문에 우리는 원하는 모든 유형의 애니메이션에서 해당 눈금을 사용할 수 있습니다. 이전과 마찬가지로 저는 루프에 4개의 키프레임을 만들고 색상을 반환합니다.

```js
[...tabnavitems].map(item =>
  item === navitem
    ? `var(--text-active-color)`
    : `var(--text-color)`)

// results in 4 array items, which represent 4 keyframe states
// [
  "var(--text-active-color)",
  "var(--text-color)",
  "var(--text-color)",
  "var(--text-color)",
]
```

색상이 `var(--text-active-color)`인 키프레임은 링크를 강조 표시하며 그렇지 않을 경우에는 표준 텍스트 색상입니다. 외부 루프는 각 nav 항목이고 내부 루프는 각 navitem의 개인 키프레임이기 때문에 중첩 루프는 비교적 간단합니다. 저는 외부 루프 요소가 내부 루프 요소와 동일한지 확인하며, 이를 사용하여 언제 선택되었는지 알 수 있습니다.

저는 이러한 내용을 작성하며 매우 즐거웠습니다. 정말 즐거웠습니다.

### 더 많은 JavaScript 개선 사항 {: #js }

여기에서 보여드리는 핵심이 JavaScript 없이 작동한다는 점을 상기할 가치가 있습니다. JS를 사용할 수 있을 때 이를 어떻게 향상시킬 수 있는지 살펴보겠습니다.

#### 딥 링크

딥링크는 모바일 용어에 가깝지만 탭 콘텐츠에 대한 URL을 직접 공유할 수 있다는 점에서 딥링크의 의도가 탭을 사용하는 여기에서 충족된다고 생각합니다. 브라우저는 URL 해시와 일치하는 ID로 페이지 내 탐색을 수행합니다. 저는 이 `onload` 핸들러가 플랫폼 전반에 영향을 미친다는 것을 알았습니다.

```js
window.onload = () => {
  if (location.hash) {
    tabsection.scrollLeft = document
      .querySelector(location.hash)
      .offsetLeft;
  }
}
```

#### 스크롤 종료 동기화

우리의 사용자들은 항상 클릭하거나 키보드를 사용하는 것은 아니며, 때때로 그들은, 당연히 할 수 있기에, 그저 자유롭게 스크롤합니다. 섹션 스크롤러가 스크롤을 멈췄을 때, 그것이 멈춘 위치가 어디든지 상단 탐색 모음과 일치해야 합니다.

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/syltOES9Gxc0ihOsgTIV.mp4", autoplay="true", loop="true", muted="true" %}</figure>

제가 스크롤 종료를 기다리는 방법은 다음과 같습니다.

```js
tabsection.addEventListener('scroll', () => {
  clearTimeout(tabsection.scrollEndTimer);
  tabsection.scrollEndTimer = setTimeout(determineActiveTabSection, 100);
});
```

섹션이 스크롤될 때마다 섹션 시간 초과가 있는 경우 이를 지우고 새 섹션을 시작합니다. 섹션 스크롤이 중지되면 시간 초과를 지우지 않고 휴식 후 100ms를 실행합니다. 실행되면 사용자가 멈춘 위치를 파악하는 함수를 호출합니다.

```js
const determineActiveTabSection = () => {
  const i = tabsection.scrollLeft / tabsection.clientWidth;
  const matchingNavItem = tabnavitems[i];

  matchingNavItem && setActiveTab(matchingNavItem);
};
```

스크롤이 스냅되었다고 가정하고 스크롤 영역의 너비에서 현재 스크롤 위치를 나누면 소수점이 아닌 정수가 됩니다. 그런 다음 저는 이 계산된 인덱스를 통해 캐시에서 navitem을 가져오려고 시도하며, 무언가를 찾은 경우 저는 일치 항목을 전송하여 활성이 설정되도록 합니다.

```js
const setActiveTab = tabbtn => {
  tabnav
    .querySelector(':scope a[active]')
    .removeAttribute('active');

  tabbtn.setAttribute('active', '');
  tabbtn.scrollIntoView();
};
```

활성 탭 설정은 현재 활성 탭을 지우고 들어오는 nav 항목에 활성 상태 속성을 부여하는 것으로 시작됩니다. `scrollIntoView()`에 대한 호출에는 주목할 가치가 있는 CSS와의 재미있는 상호 작용이 있습니다.

<figure>{% Video src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/nsiyMgZ2QGF2fx9gVRgu.mp4", autoplay="true", loop="true", muted="true" %}</figure>

```css
.scroll-snap-x {
  overflow: auto hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;

  @media (prefers-reduced-motion: no-preference) {
    scroll-behavior: smooth;
  }
}
```

수평 스크롤 스냅 유틸리티 CSS에서 우리는 사용자가 모션에 내성이 있는 경우 `smooth` 스크롤을 적용하는 미디어 쿼리를 [중첩했습니다](https://drafts.csswg.org/css-nesting-1/). JavaScript는 스크롤 요소를 뷰로 자유롭게 호출할 수 있으며, CSS는 UX를 선언적으로 관리할 수 있습니다. 그들이 때때로 만드는 아주 유쾌한 작은 매칭입니다.

### 결론

이제 제가 어떻게 했는지 알아보았습니다. 여러분이라면 어떻게 하시겠습니까?! 이것은 재미있는 구성 요소 아키텍처를 만듭니다! 가장 좋아하는 프레임워크에 슬롯이 있는 첫 번째 버전은 누가 만들까요? 🙂

접근 방식을 다양화하고 웹에서 구축하는 모든 방법을 알아보겠습니다. [Glitch](https://glitch.com)를 만들고 여러분의 버전을 [트윗](https://twitter.com/argyleink)하면 아래 [커뮤니티 리믹스](#community-remixes) 섹션에 추가하겠습니다.

## 커뮤니티 리믹스

- [@devnook](https://twitter.com/devnook), [@rob_dodson](https://twitter.com/rob_dodson) 및 [@DasSurma](https://twitter.com/DasSurma)(웹 구성 요소 포함): [article](https://developers.google.com/web/fundamentals/web-components/examples/howto-tabs).
- [@jhvanderschee](https://twitter.com/jhvanderschee) 버튼: [Codepen](https://codepen.io/joosts/pen/PoKdZYP).
