---
layout: post
title: sidenav 구성요소 빌드
subhead: 반응형 슬라이드 아웃 sidenav를 구축하는 방법에 대한 기본 개요
authors:
  - adamargyle
description: 반응형 슬라이드 아웃 sidenav를 구축하는 방법에 대한 기본 개요
date: 2021-01-21
hero: image/admin/Zo1KkESK9CfEIYpbWzap.jpg
thumbnail: image/admin/pVZO6FsC9tF3H6QIWpY2.png
codelabs: codelab-building-a-sidenav-component
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

이 게시물에서 반응형, 상태 저장형, 키보드 탐색 지원, JavaScript 유무에 관계없이 작동하고 여러 브라우저에서 작동하는 웹용 sidenav 구성 요소의 프로토타입을 만든 방법을 공유합니다. [데모](https://gui-challenges.web.app/sidenav/dist/)를 사용해 보세요.

비디오를 선호하는 경우 이 게시물의 YouTube 버전이 있습니다.

{% YouTube 'uiZqDLqjGRY' %}

## 개요

반응형 내비게이션 시스템을 구축하는 것은 어렵습니다. 일부 사용자는 키보드를 사용하고 일부는 강력한 데스크톱을 사용하며 일부는 소형 모바일 장치에서 방문합니다. 방문하는 모든 사람이 메뉴를 열고 닫을 수 있어야 합니다.

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gui-sidenav/desktop-demo-1080p.mp4">
  </source></video>
  <figcaption>데스크톱과 모바일에 반응하는 레이아웃 데모</figcaption></figure>

<figure>
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/gui-sidenav/mobile-demo-1080p.mp4">
  </source></video>
  <figcaption>iOS 및 Android에서 작동하는 밝고 어두운 테마</figcaption></figure>

## 웹 전술

이번 구성 요소 탐색에서 몇 가지 중요한 웹 플랫폼 기능을 결합할 수 있었습니다.

1. CSS [`:target`](#target-psuedo-class)
2. CSS [그리드](#grid-stack)
3. CSS [변환](#transforms)
4. 뷰포트 및 사용자 기본 설정에 대한 CSS 미디어 쿼리
5. `focus` [UX 향상](#ux-enhancements)을 위한 JS

저의 해법은 `540px` 이하의 "모바일" 뷰포트에 있을 때만 토글됩니다. `540px`는 모바일 대화형 레이아웃과 정적 데스크톱 레이아웃 간 전환을 결정하는 임계점이 될 것입니다.

### CSS `:target` 의사 클래스 {: #target-psuedo-class }

하나의 `<a>` 링크는 URL 해시를 `#sidenav-open`로 다른 하나는 비어 있음(`''`)으로 설정합니다. 마지막으로 요소에는 해시와 일치하는 `id`가 있습니다.

```html
<a href="#sidenav-open" id="sidenav-button" title="Open Menu" aria-label="Open Menu">

<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>

<aside id="sidenav-open">
  …
</aside>
```

이러한 각 링크를 클릭하면 페이지 URL의 해시 상태가 변경되고 의사 클래스를 사용하여 sidenav를 표시하거나 숨깁니다.

```css
@media (max-width: 540px) {
  #sidenav-open {
    visibility: hidden;
  }

  #sidenav-open:target {
    visibility: visible;
  }
}
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/hash-change.mp4">
  </source></video></figure>

### CSS 그리드 {: #grid-stacks }

과거에는 절대 위치 또는 고정 위치 sidenav 레이아웃 및 구성 요소만 사용했습니다. 그리드의 `grid-area` 구문을 사용하면 동일한 행이나 열에 여러 요소를 할당할 수 있습니다.

#### 스택

기본 레이아웃 요소인 `#sidenav-container`는 1개의 행과 2개의 열을 생성하는 그리드이며, 각각 1개는 `stack`으로 명명됩니다. 공간이 제한되면 CSS는 모든 `<main>` 요소의 자식을 동일한 그리드 이름에 할당하고 모든 요소를 동일한 공간에 배치하여 스택을 만듭니다.

```css
#sidenav-container {
  display: grid;
  grid: [stack] 1fr / min-content [stack] 1fr;
  min-height: 100vh;
}

@media (max-width: 540px) {
  #sidenav-container > * {
    grid-area: stack;
  }
}
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/responsive-stack-demo-1080p.mp4">
  </source></video></figure>

#### 메뉴 배경

`<aside>`는 sidenav를 포함하는 애니메이션 요소입니다. 여기에는 2개의 자식이 있습니다. `[nav]`로 명명된 탐색 컨테이너 `<nav>`와 메뉴를 닫는 데 사용되며 `[escape]`으로 명명된 백드롭 `<a>`입니다.

```css
#sidenav-open {
  display: grid;
  grid-template-columns: [nav] 2fr [escape] 1fr;
}
```

`2fr` 및 `1fr`을 조정하여 메뉴 오버레이와 음수 공간 닫기 버튼에 대해 원하는 비율을 찾습니다.

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/overlay-escape-ratio.mp4">
  </source></video>
  <figcaption>비율을 변경하면 어떻게 되는지를 보여주는 데모입니다.</figcaption></figure>

### CSS 3D 변환 및 전환 {: #transforms }

이제 레이아웃이 모바일 뷰포트 크기로 쌓입니다. 몇 가지 새로운 스타일을 추가할 때까지는 기본적으로 기사를 오버레이합니다. 다음은 이 다음 섹션에서 목표로 하는 몇 가지 UX입니다.

- 열기 및 닫기 애니메이션
- 사용자가 동의하는 경우에만 모션으로 애니메이션을 적용
- `visibility` 애니메이션을 적용하여 키보드 포커스가 오프스크린 요소에 들어가지 않게 하기

모션 애니메이션을 구현할 때 접근성을 최우선으로 생각하고 시작하고 싶습니다.

#### 접근 가능한 모션

모든 사람이 슬라이드 아웃 모션 경험을 원하는 것은 아닙니다. 우리 솔루션에서 이 기본 설정은 미디어 쿼리 내에서 `--duration` CSS 변수를 조정하여 적용됩니다. 미디어 쿼리  값은 동작에 대한 사용자의 운영 체제 기본 설정을 나타냅니다(사용 가능한 경우).

```css
#sidenav-open {
  --duration: .6s;
}

@media (prefers-reduced-motion: reduce) {
  #sidenav-open {
    --duration: 1ms;
  }
}
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/prefers-reduced-motion.mp4">
  </source></video>
  <figcaption>지속 시간이 적용되거나 적용되지 않은 상호 작용의 데모입니다.</figcaption></figure>

이제 sidenav가 열리고 닫힐 때 사용자가 감소된 움직임을 선호하는 경우 움직임이 없는 상태를 유지하면서 요소를 즉시 보기로 이동합니다.

#### 전환, 변형, 번역

##### sidenav out(기본값)

모바일에서 sidenav의 기본 상태를 오프스크린 상태로 설정하려면 `transform: translateX(-110vw)`을 적용하여 요소를 배치합니다.

sidenav의 `box-shadow`가 숨겨져 있을 때 기본 뷰포트를 들여다보지 않도록 하기 위해 일반적인 오프스크린 코드인 `-100vw`에 또 다른 `10vw`를 추가했습니다.

```css
@media (max-width: 540px) {
  #sidenav-open {
    visibility: hidden;
    transform: translateX(-110vw);
    will-change: transform;
    transition:
      transform var(--duration) var(--easeOutExpo),
      visibility 0s linear var(--duration);
  }
}
```

##### sidenav in

`#sidenav` 요소가 `:target`과 일치하면 `translateX()` 위치를 homebase `0`으로 설정하고 URL 해시가 변경될 때 CSS가 요소를 `-110vw` 출력 위치에서 "in" 위치인  `0`으로 `var(--duration)` 동안 슬라이드 아웃하는 것을 지켜보세요.

```css
@media (max-width: 540px) {
  #sidenav-open:target {
    visibility: visible;
    transform: translateX(0);
    transition:
      transform var(--duration) var(--easeOutExpo);
  }
}
```

#### 전환 가시성

이제 목표는 메뉴가 없을 때 화면 판독기에서 메뉴를 숨겨 시스템이 화면 밖의 메뉴에 포커스를 두지 않도록 하는 것입니다. `:target`이 변경될 때 가시성 전환을 설정하여 이를 수행합니다.

- 들어갈 때 가시성을 전환하지 마십시오. 요소가 슬라이드 안으로 들어가고 포커스를 받는 것을 볼 수 있도록 바로 볼 수 있게 합니다.
- 나갈 때에는 가시성을 전환하되 지연시키세요. 전환 과정의 끝에 `hidden`으로 전환됩니다.

### 접근성 UX 개선 사항 {: #ux-enhancements }

#### 링크

이 솔루션은 상태를 관리하기 위해 URL 변경에 의존합니다. 당연히 `<a>` 요소를 사용해야 하며 몇 가지 좋은 접근성 기능을 무료로 얻을 수 있습니다. 의도를 명확하게 나타내는 레이블로 대화형 요소를 장식합시다.

```html
<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>

<a href="#sidenav-open" id="sidenav-button" class="hamburger" title="Open Menu" aria-label="Open Menu">
  <svg>...</svg>
</a>
```

<figure data-size="full">
  <video playsinline controls autoplay loop muted>
    <source src="https://storage.googleapis.com/atoms-sandbox.google.com.a.appspot.com/keyboard-voiceover.mp4">
  </source></video>
  <figcaption>음성 해설 및 키보드 상호 작용 UX의 데모.</figcaption></figure>

이제 기본 상호 작용 버튼이 마우스와 키보드 모두에 대한 의도를 명확하게 나타냅니다.

#### `:is(:hover, :focus)`

이 편리한 CSS 기능 의사 선택기를 사용하면 호버 스타일을 포커스와 공유하여 신속하게 포함할 수 있습니다.

```css
.hamburger:is(:hover, :focus) svg > line {
  stroke: hsl(var(--brandHSL));
}
```

#### JavaScript에 뿌리기

##### 닫으려면 `escape` 를 누르세요

키보드의 `Escape` 키를 누르면 메뉴가 닫히지 않습니까? 연결해 보겠습니다.

```js
const sidenav = document.querySelector('#sidenav-open');

sidenav.addEventListener('keyup', event => {
  if (event.code === 'Escape') document.location.hash = '';
});
```

##### 브라우저 기록

열기 및 닫기 상호 작용이 브라우저 기록에 여러 항목을 쌓는 것을 방지하려면 닫기 버튼에 다음 JavaScript 인라인을 추가하십시오.

```html
<a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu" onchange="history.go(-1)"></a>
```

이렇게 하면 닫을 때 URL 기록 항목이 제거되어 메뉴가 열리지 않은 것처럼 만듭니다.

##### 포커스 UX

다음 스니펫은 열리거나 닫은 후 열기 및 닫기 버튼에 초점을 맞추는 데 도움이 됩니다. 토글을 쉽게 하고 싶습니다.

```js
sidenav.addEventListener('transitionend', e => {
  const isOpen = document.location.hash === '#sidenav-open';

  isOpen
      ? document.querySelector('#sidenav-close').focus()
      : document.querySelector('#sidenav-button').focus();
})
```

sidenav가 열리면 닫기 버튼에 초점을 맞춥니다. sidenav가 닫히면 열기 버튼에 초점을 맞춥니다. JavaScript의 요소에서 `focus()`를 호출하여 이 작업을 수행합니다.

### 결론

이제 제가 어떻게했는지 알아보았습니다. 여러분이라면 어떻게 하시겠습니까? 이것은 재미있는 구성 요소 아키텍처입니다! 슬롯이 있는 1차 버전은 누가 만들까요? 🙂

접근 방식을 다양화하고 웹에서 구축하는 모든 방법을 알아보겠습니다. [Glitch](https://glitch.com)를 만들고 버전을 [트윗](https://twitter.com/argyleink) 하면 아래 [커뮤니티 리믹스](#community-remixes) 섹션에 추가하겠습니다.

## 커뮤니티 리믹스

- [@_developit](https://twitter.com/_developit)의 사용자 정의 요소: [데모 및 코드](https://glitch.com/edit/#!/app-drawer)
- [@mayeedwin1](https://twitter.com/mayeedwin1)의 HTML/CSS/JS: [데모 및 코드](https://glitch.com/edit/#!/maye-gui-challenge)
- [@a_nurella](https://twitter.com/a_nurella)의 Glitch Remix: [데모 및 코드](https://glitch.com/edit/#!/sidenav-with-adam)
- [@EvroMalarkey](https://twitter.com/EvroMalarkey)의 HTML/CSS/JS: [데모 및 코드](https://evromalarkey.github.io/scrollsnap-drawer/index.html)
