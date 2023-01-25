---
title: CSS 한 줄에서 10가지 현대적인 레이아웃 만나보기
subhead: 이 게시물은 대단한 효과를 발휘하고 강력한 현대적 레이아웃을 구축하는 데 도움이 되는 몇 가지 강력한 CSS 라인을 집중 조명합니다.
authors:
  - una
description: 이 게시물은 대단한 효과를 발휘하고 강력한 현대적 레이아웃을 구축하는 데 도움이 되는 몇 가지 강력한 CSS 라인을 집중 조명합니다.
date: 2020-07-07
hero: image/admin/B07IzuMeRRGRLH9UQkwd.png
alt: 성배 레이아웃.
tags:
  - blog
  - css
  - layout
  - mobile
---

{% YouTube 'qm0IfG1GyZU' %}

최신 CSS 레이아웃을 통해 개발자는 몇 번의 키 입력만으로 의미 있고 강력한 스타일 규칙을 작성할 수 있습니다. 위의 논의와 함께 이 후속 게시물에서는 대단한 효과를 발휘하는 CSS의 10가지 강력한 라인을 살펴봅니다.

{% Glitch { id: '1linelayouts', path: 'README.md', height: 480 } %}

이 데모를 따라하거나 직접 시도하려면 위의 Glitch 임베드를 확인하거나 [1linelayouts.glitch.me](https://1linelayouts.glitch.me)를 방문하세요.

## 01. 가운데 맞춤 완전 해결: `place-items: center`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/01-place-items-center.mp4">
  </source></video></figure>

첫 번째 'single-line' 레이아웃의 경우 모든 CSS 영역에서 가장 큰 미스터리인 가운데 맞춤을 해결해 보겠습니다. [`place-items: center`](https://developer.mozilla.org/docs/Web/CSS/place-items)를 사용하면 이것이 생각보다 쉽다는 것을 알려드리려고 합니다.

먼저 `display` 메서드로 `grid`를 지정한 다음, 동일한 요소에 `place-items: center`를 작성합니다. `place-items`는 `align-items`와 `justify-items`를 한 번에 모두 설정하는 축약형입니다. `center`로 설정하면 `align-items`와 `justify-items` 모두 `center`로 설정됩니다.

```css/2
.parent {
  display: grid;
  place-items: center;
}
```

이렇게 하면 본질적인 크기에 관계없이 콘텐츠가 상위 요소 내에서 완벽하게 중앙에 오도록 할 수 있습니다.

## 02. 분해된 팬케이크: `flex: <grow> <shrink> <baseWidth>`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-1.mp4">
  </source></video></figure>

다음은 분해 팬케이크입니다! 이것은 예를 들어 제품의 일부 기능을 설명하는 이미지, 제목 및 일부 텍스트가 포함된 3개의 항목 행이 있을 수 있는 마케팅 사이트에 일반적인 레이아웃입니다. 모바일에서는 콘텐츠를 깔끔하게 쌓아 표시하고 화면 크기가 커지면서 확장되기를 원할 것입니다.

이 효과를 위해 Flexbox를 사용하면 화면 크기가 조정될 때 이러한 요소의 배치를 조정하기 위해 미디어 쿼리가 필요하지 않습니다.

[`flex`](https://developer.mozilla.org/docs/Web/CSS/flex)의 축약형은 `flex: <flex-grow> <flex-shrink> <flex-basis>`를 나타냅니다.

이 때문에 상자가 `<flex-basis>` 크기로 채워지고 더 작은 크기에서는 줄어들되 *늘려서* 추가 공간을 채우지 않게 하려면 다음과 같이 작성합니다: `flex: 0 1 <flex-basis>`. 이 경우 `<flex-basis>`는 `150px`이므로 다음과 같습니다.

```css/5
.parent {
  display: flex;
}

.child {
  flex: 0 1 150px;
}
```

다음 라인으로 줄바꿈할 때 상자가 펼쳐지고 공간을 채우도록 하기를 *원한다면* 다음과 같이 `<flex-grow>`를 `1`로 설정합니다.

```css/5
.parent {
  display: flex;
}

.child {
  flex: 1 1 150px;
}
```

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/02-deconstructed-pancake-2.mp4">
  </source></video></figure>

이제 화면 크기를 늘리거나 줄이면 이러한 플렉스 항목이 줄어들고 늘어납니다.

## 03. 사이드바가 하는 말: `grid-template-columns: minmax(<min>, <max>) …)`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/03-sidebar-says.mp4">
  </source></video></figure>

이 데모는 그리드 레이아웃을 위한 [minmax](https://developer.mozilla.org/docs/Web/CSS/minmax) 함수를 활용합니다. 여기서 하려는 것은 최소 사이드바 크기를 `150px`이 되도록 설정하되, 더 큰 화면에서는 `25%`까지 늘어나도록 하는 것입니다. 사이드바는 상위 수평 공간의 `25%`를 차지하며, 이 `25%`가 `150px`보다 작아질 때까지는 계속 이 상태를 유지합니다.

`minmax(150px, 25%) 1fr` 값을 사용하여 grid-template-columns 값으로 이를 추가합니다. 첫 번째 열의 항목(이 경우 사이드바)은 `25%`에서 `150px`의 `minmax`를 가지며, 두 번째 항목(여기서는 `main` 섹션)은 나머지 공간을 단일 `1fr` 트랙으로 차지합니다.

```css/2
.parent {
  display: grid;
  grid-template-columns: minmax(150px, 25%) 1fr;
}
```

## 04. 팬케이크 스택: `grid-template-rows: auto 1fr auto`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/04-pancake-stack.mp4">
  </source></video></figure>

분해된 팬케이크와 달리 이 예제는 화면 크기가 변경될 때 하위 요소를 래핑하지 않습니다. 일반적으로 [고정 바닥글](https://developer.mozilla.org/docs/Web/CSS/Layout_cookbook/Sticky_footers)이라고 하는 이 레이아웃은 웹사이트와 앱, 모바일 애플리케이션(바닥글은 일반적으로 도구 모음) 및 웹사이트(단일 페이지 애플리케이션은 종종 이 전역 레이아웃을 사용함)에 자주 사용됩니다.

`display: grid`를 구성 요소에 추가하면 단일 열 그리드가 제공되지만 기본 영역은 바닥글이 그 아래에 있는 콘텐츠만큼만 높아집니다.

바닥글을 맨 아래에 고정하려면 다음을 추가합니다.

```css/2
.parent {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
```

이렇게 하면 머리글 및 바닥글 내용이 자동으로 하위 요소의 크기를 사용하도록 설정되고 나머지 공간(`1fr`)이 기본 영역에 적용됩니다. 한편, `auto` 크기 행은 하위 요소의 최소 내용 크기를 사용하므로 해당 내용의 크기가 증가하면 행 자체가 조정되어 커집니다.

## 05. 고전적 성배 레이아웃: `grid-template: auto 1fr auto / auto 1fr auto`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/05-holy-grail.mp4">
  </source></video></figure>

이 고전적 성배 레이아웃의 경우 머리글, 바닥글, 왼쪽 사이드바, 오른쪽 사이드바 및 주요 콘텐츠가 있습니다. 이전 레이아웃과 비슷하지만 이제 사이드바가 있습니다!

한 줄의 코드를 사용하여 이 전체 그리드를 작성하려면 `grid-template` 속성을 사용합니다. 이렇게 하면 행과 열을 동시에 설정할 수 있습니다.

속성 및 값 쌍은 다음과 같습니다: `grid-template: auto 1fr auto / auto 1fr auto`. 공백으로 구분된 첫 번째 목록과 두 번째 목록 사이의 슬래시는 행과 열 사이의 구분선입니다.

```css/2
.parent {
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
}
```

머리글과 바닥글에 자동 크기 조정 콘텐츠가 있는 마지막 예에서와 같이 여기에서 왼쪽 및 오른쪽 사이드바는 하위 요소의 고유 크기에 따라 자동으로 크기가 조정됩니다. 그런데 이번에는 세로(높이)가 아닌 가로(가로) 크기입니다.

## 06. 12-스팬 그리드: `grid-template-columns: repeat(12, 1fr)`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/06-12-span-1.mp4">
  </source></video></figure>

다음으로 또 다른 고전적 레이아웃이 있습니다. 바로 12-스팬 그리드입니다. `repeat()` 함수를 사용하여 CSS에서 그리드를 빠르게 작성할 수 있습니다. 그리드 템플릿 열에 `repeat(12th, 1fr);`을 사용하면 `1fr` 각각에 12개의 열이 제공됩니다.

```css/2,6
.parent {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.child-span-12 {
  grid-column: 1 / 13;
}
```

이제 12열 트랙 그리드가 있으므로 그리드에 하위 요소를 배치할 수 있습니다. 이를 수행하는 한 가지 방법은 그리드 선을 사용하여 배치하는 것입니다. 예를 들어, `grid-column: 1 / 13`은 첫 번째 줄부터 마지막(13번째) 줄까지 확장되고 12개의 열에 걸쳐집니다. `grid-column: 1 / 5;`은 처음 4개에 걸쳐집니다.

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/06-12-span-2.mp4">
  </source></video></figure>

이를 작성하는 또 다른 방법은 `span` 키워드를 사용하는 것입니다. `span`을 사용하면 시작 선을 설정한 다음 해당 시작점에서 몇 개의 열로 확장할지 설정합니다. 이 경우 `grid-column: 1 / span 12`는 `grid-column: 1 / 13`과 같고 `grid-column: 2 / span 6`은 `grid-column: 2 / 8`과 같습니다.

```css/1
.child-span-12 {
  grid-column: 1 / span 12;
}
```

## 07. RAM(Repeat, Auto, MinMax): `grid-template-columns(auto-fit, minmax(<base>, 1fr))`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/07-ram-1.mp4">
  </source></video></figure>

이 일곱 번째 예에서는 이미 배운 개념을 일부 결합하여 자동으로 배치되는 유연한 하위 요소가 있는 반응형 레이아웃을 만듭니다. 상당히 단출합니다. 여기서 기억해야 할 핵심 항은 `repeat`, `auto-(fit|fill)` 및 `minmax()'`이며, 이를 약어 RAM으로 기억하면 쉽습니다.

모두 함께 보면 다음과 같습니다.

```css/2
.parent {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
```

다시 반복을 사용하지만 이번에는 명시적 숫자 값 대신 `auto-fit`을 사용합니다. 이렇게 하면 이러한 하위 요소를 자동으로 배치할 수 있습니다. 이 하위 요소들은 또한 기본 최소값이 `150px`이고 최대값이 `1fr`입니다. 즉, 작은 화면에서는 전체 `1fr` 너비를 차지하고 각각 `150px` 너비에 도달하면 같은 줄로 흐르기 시작합니다.

`auto-fit`을 사용하면 가로 크기가 150px를 초과할 때 상자가 늘어나서 나머지 공간을 모두 채웁니다. 그러나 이것을 `auto-fill`로 변경하면 minmax 함수의 기본 크기가 초과될 때 늘어나지 않습니다.

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/07-ram-2.mp4">
  </source></video></figure>

```css/2
.parent {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}
```

## 08. 라인업: `justify-content: space-between`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/08-lineup.mp4">
  </source></video></figure>

다음 레이아웃의 경우, 여기에서 보여주려는 핵심은 첫 번째 하위 요소와 마지막 하위 요소를 경계 상자의 가장자리에 배치하고 나머지 공간은 요소 사이에 균등하게 분배하는 `justify-content: space-between`입니다. 이러한 카드의 경우, Flexbox 디스플레이 모드에 배치되며 방향은 `flex-direction: column`을 사용하여 열로 설정됩니다.

그러면 제목, 설명 및 이미지 블록이 상위 카드 내부의 세로 열에 배치됩니다. 그런 다음 `justify-content: space-between`을 적용하면 첫 번째(제목) 요소와 마지막(이미지 블록) 요소가 flexbox의 가장자리에 고정되고 그 사이에 있는 설명 텍스트는 각 끝점에 동일한 간격으로 배치됩니다.

```css/3
.parent {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```

## 09. 내 스타일 클램핑: `clamp(<min>, <actual>, <max>)`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/09-clamping.mp4">
  </source></video></figure>

여기에서 [브라우저 지원이 적은](https://caniuse.com/#feat=css-math-functions) 몇 가지 기술에 대해 알아보겠습니다. 이러한 기술은 레이아웃 및 반응형 UI 디자인과 관련해서는 흥미로운 의미를 내포할 수 있습니다. 이 데모에서는 `width: clamp(<min>, <actual>, <max>)`와 같이 클램프를 사용하여 너비를 설정합니다.

이것은 절대 최소 및 최대 크기와 실제 크기를 설정합니다. 값을 사용하면 다음과 같을 수 있습니다.

```css/1
.parent {
  width: clamp(23ch, 60%, 46ch);
}
```

여기서 최소 크기는 `23ch` 또는 23자 단위이고 최대 크기는 `46ch`, 46자입니다. [문자 너비 단위](https://meyerweb.com/eric/thoughts/2018/06/28/what-is-the-css-ch-unit/)는 요소의 글꼴 크기(구체적으로 `0` 글리프의 너비)를 기반으로 합니다. '실제' 크기는 이 요소의 상위 너비의 50%를 나타내는 50%입니다.

여기서 `clamp()` 함수가 하는 일은 50%가 `46ch`(넓은 뷰포트)보다 크거나 `23ch`(작은 뷰포트)보다 작아질 *때까지* 이 요소가 50%의 너비를 유지할 수 있도록 하는 것입니다. 상위 크기를 늘리거나 줄일 때 이 카드의 너비가 클램핑된 최대 지점으로 증가하고 클램핑된 최소 지점으로 감소하는 것을 볼 수 있습니다. 그런 다음 상위의 중앙에 머무르는데, 중앙에 놓이도록 하는 추가 속성을 적용했기 때문입니다. 그 결과, 텍스트가 너무 넓거나(`46ch` 이상) 너무 찌그러지고 좁지(`23ch` 미만) 않으므로 레이아웃을 읽기가 더 쉬워집니다.

이것은 또한 반응형 타이포그래피를 구현하는 좋은 방법입니다. 예를 들어, 다음과 같이 작성할 수 있습니다: `font-size: clamp(1.5rem, 20vw, 3rem)`. 이 경우 헤드라인의 글꼴 크기는 항상 `1.5rem`과 `3rem` 사이에서 클램핑된 상태로 유지되지만 뷰포트의 너비에 맞게 `20vw`의 실제값을 기준으로 증가 및 축소됩니다.

이것은 최소 및 최대 크기 값으로 가독성을 보장하는 훌륭한 기술이지만 모든 최신 브라우저에서 지원되는 것은 아니므로 폴백이 있어야 하고 자신만의 테스트를 수행해야 합니다.

## 10. 종횡비 준수: `aspect-ratio: <width> / <height>`

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/one-line-layouts/10-aspectratio.mp4">
  </source></video></figure>

마지막으로, 이 마지막 레이아웃 도구는 가장 실험적인 도구입니다. 최근 Chromium 84의 Chrome Canary에 도입되었으며 이를 구현하기 위해 Firefox에서 적극적으로 노력하고 있지만 현재 안정적인 브라우저 버전은 아닙니다.

하지만 이는 자주 마주치는 문제이므로 언급하기로 결정했습니다. 이것은 단순히 이미지의 종횡비를 유지하는 문제입니다.

`aspect-ratio` 속성을 사용하면 카드 크기를 조정할 때 녹색 시각 블록은 이 16 x 9의 종횡비를 유지합니다. `aspect-ratio: 16 / 9`를 사용하여 종횡비를 유지합니다.

```css/1
.video {
  aspect-ratio: 16 / 9;
}
```

이 속성 없이 16 x 9 종횡비를 유지하려면 [`padding-top` hack](https://css-tricks.com/aspect-ratio-boxes/)이 필요하며 여기에 `56.25%`의 패딩을 제공하여 top-to-width 비율을 설정해야 합니다. Hack과 백분율 계산 필요성을 피하기 위해 곧 이에 대한 속성이 제공될 것입니다. `1 / 1` 비율로 사각형을 만들고, `2 / 1`로 2대1 비율을 만들고, 설정된 크기 비율로 이 이미지 크기를 조정하는 데 필요한 모든 것을 얻을 수 있을 것입니다.

```css/1
.square {
  aspect-ratio: 1 / 1;
}
```

이 기능은 아직 개발 중이지만 특히 비디오 및 iframe과 관련하여 나 자신이 여러 번 직면했던 많은 개발자 갈등을 해결해주므로 알아두면 좋은 기능입니다.

## 결론

CSS의 10가지 강력한 라인을 알아본 이 여정을 따라와 주셔서 감사합니다. 자세히 알아보려면 [전체 동영상](https://youtu.be/qm0IfG1GyZU)을 시청하고 직접 [데모](https://1linelayouts.glitch.me)를 사용해 보세요.
