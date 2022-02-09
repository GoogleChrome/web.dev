---
title: Flexbox
description: Flexbox는 1차원으로 항목 그룹을 배치하도록 설계된 레이아웃 메커니즘입니다. 이 모듈에서 사용 방법을 알아보세요.
audio:
  title: 'CSS 팟캐스트   - 010: Flexbox'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_010_v1.0.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - rachelandrew
  - andybell
date: 2021-04-21
---

반응형 디자인에서 까다로울 수 있는 디자인 패턴은 일부 콘텐츠와 함께 인라인으로 배치되는 사이드바입니다. 뷰포트 공간이 있는 곳에서 이 패턴은 훌륭하게 작동하지만 좁은 공간에서는 고정 레이아웃이 문제가 될 수 있습니다.

{% Codepen { user: 'web-dot-dev', id: 'poRENWv', height: 420 } %}

플렉서블 박스 레이아웃 모델(Flexbox)은 1차원 콘텐츠용으로 설계된 레이아웃 모델입니다. 크기가 다른 여러 항목을 가져와서 해당 항목에 가장 적합한 레이아웃을 반환하는 데 탁월합니다.

Flexbox는 이 사이드바 패턴에 대한 이상적인 레이아웃 모델입니다. Flexbox는 사이드바와 콘텐츠를 인라인으로 배치하는 데 도움이 될 뿐만 아니라 남은 공간이 충분하지 않은 경우 사이드바가 새 줄로 나뉩니다. Flexbox를 사용하면 브라우저가 따라야 하는 고정 치수를 설정하는 대신 콘텐츠가 표시되는 방식을 조언하는 유연한 경계를 제공할 수 있습니다.

{% Codepen { user: 'web-dot-dev', id: 'xxgERMp', height: 400 } %}

## 플렉스 레이아웃으로 무엇을 할 수 있나요?

플렉스 레이아웃에는 이 가이드에서 탐색할 수 있는 다음과 같은 기능이 있습니다.

- 행 또는 열로 표시할 수 있습니다.
- 문서의 쓰기 모드를 존중합니다.
- 기본적으로 한 줄이지만 여러 줄로 줄 바꿈하도록 요청할 수 있습니다.
- 레이아웃의 항목이 DOM의 순서와 다르게 시각적으로 재정렬될 수 있습니다.
- 공간이 항목 내부에 분산될 수 있으므로 상위 항목의 사용 가능한 공간에 따라 더 커지고 작아집니다.
- 상자 정렬 속성을 사용하여 래핑된 레이아웃의 항목 및 플렉스 라인 주위에 공간을 분배할 수 있습니다.
- 항목 자체를 교차 축에 정렬할 수 있습니다.

## 주축과 교차 축

Flexbox를 이해하려면 주 축과 교차 축의 개념을 이해해야 합니다. 주 축은 `flex-direction` 속성으로 설정한 축입니다. `row`인 경우 여러분의 주 축은 행을 따르며, `column`인 경우 여러분의 주 축은 열을 따릅니다.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/xKtf0cHRw0xQyiyYuuyz.svg", alt="나란히 있는 세 개의 상자, 왼쪽에서 오른쪽으로 가리키는 화살표가 존재하며 화살표에는 '주 축'이라는 표시가 있음.", width="800", height="320" %}</figure>

플렉스 항목은 주 축에서 그룹으로 이동합니다. 기억하기: 우리는 많은 것을 가지고 있으며 우리는 그것들을 위한 최상의 레이아웃을 그룹으로 얻으려고 노력하고 있습니다.

교차 축은 주 축과 다른 방향으로 실행되므로 `flex-direction`이 `row`인 경우 교차 축은 열을 따라 실행됩니다.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/5wCsZcBmK5L33LS7nOmP.svg", alt="나란히 있는 세 개의 상자, 왼쪽에서 오른쪽으로 가리키는 화살표가 존재하며 화살표에는 '주 축'이라는 표시가 있음. 위에서 아래로 향하고 있는 화살표가 하나 더 있으며 이것에는 '교차 축'이라는 표시가 있음.", width="800", height="320" %}</figure>

교차 축에서는 두 가지 작업을 수행할 수 있습니다. 항목을 개별적으로 또는 그룹으로 이동하여 서로 및 플렉스 컨테이너에 대해 정렬할 수 있습니다. 또한 플렉스 라인을 래핑한 경우 해당 라인에 공간을 할당하는 방식을 제어하기 위해 이러한 라인을 그룹으로 처리할 수 있습니다. 이 가이드 전체를 통해 이 모든 것이 실제로 어떻게 작동하는지 볼 수 있습니다. 지금은 주 축이 `flex-direction`을 따른다는 점을 명심하세요.

## 플렉스 컨테이너 만들기

크기가 다른 항목 그룹을 가져오고 Flexbox를 사용하여 이를 배치하여 Flexbox가 어떻게 작동하는지 알아봅니다.

```html
<div class="container" id="container">
  <div>One</div>
  <div>Item two</div>
  <div>The item we will refer to as three</div>
</div>
```

Flexbox를 사용하려면 일반 블록 및 인라인 레이아웃이 아닌 플렉스 서식 컨텍스트를 사용할 것을 선언해야 합니다. 이렇게 하려면 `display` 속성을 `flex`로 변경합니다.

```css
.container {
  display: flex;
}
```

[레이아웃 가이드](/learn/css/layout)에서 배웠듯이 이것은 플렉스 항목의 하위 항목이 있는 블록 수준 상자를 제공합니다. 플렉스 항목은 **초기 값**을 사용하여 일부 Flexbox 동작을 즉시 나타내기 시작합니다.

{% Aside %} 모든 CSS 속성에는 초기 동작을 변경하기 위해 CSS를 적용하지 않았을 때 "즉시" 동작하는 방식을 제어하는 초기 값이 있습니다. 플렉스 컨테이너의 하위 항목은 상위 항목이 `display: flex`를 가져오는 즉시 플렉스 항목이 되므로 이러한 초기 값은 일부 Flexbox 동작을 보기 시작한다는 것을 의미합니다. {% endAside %}

초기 값은 다음을 의미합니다.

- 항목이 행으로 표시됩니다.
- 래핑하지 않습니다.
- 컨테이너를 채우기 위해 크기가 확대되지 않습니다.
- 컨테이너의 시작 부분에 줄을 맞춥니다.

## 항목의 방향 제어

아직 `flex-direction` 속성을 추가하지 않았지만 `flex-direction`의 초기 값이 `row`이므로 항목이 행으로 표시됩니다. 여러분이 원하는 것이 행이라면 속성을 추가할 필요가 없습니다. 방향을 변경하려면 속성과 다음 네 가지 값 중 하나를 추가합니다.

- `row` : 항목이 행으로 배치됩니다.
- `row-reverse:` 항목이 플렉스 컨테이너의 끝에서 행으로 배치됩니다.
- `column` : 항목이 열로 배치됩니다.
- `column-reverse` : 항목이 플렉스 컨테이너의 끝에서 열로 배치됩니다.

아래 데모에서 우리의 항목 그룹을 사용하여 모든 값을 시험해 볼 수 있습니다.

{% Codepen { user: 'web-dot-dev', id: 'bGgKNXq' } %}

### 항목 및 접근성의 흐름 리버싱

접근성에 부정적인 영향을 줄 수 있으므로 HTML 문서의 순서와 다르게 시각적 표시를 재정렬하는 속성을 사용할 때는 주의해야 합니다. `row-reverse`와 `column-reverse` 값은 이에 대한 좋은 예시입니다. 재정렬은 논리적 순서가 아닌 시각적 순서에 대해서만 발생합니다. 논리적인 순서는 화면 읽기 프로그램이 내용을 읽고 키보드를 사용하여 탐색하는 모든 사람이 따르는 순서이기에 이를 이해하는 것이 중요합니다.

다음 동영상에서 반전된 열 레이아웃에서 키보드 탐색이 시각적 표시가 아닌 DOM을 따라갈 때 링크 간의 탭 이동이 어떻게 끊어지는지 확인할 수 있습니다.

{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/IgpaIRZd7kOq8sd46eaR.mp4", autoplay=true, controls=true %}

Flexbox 또는 그리드의 항목 순서를 변경할 수 있는 모든 것이 이러한 문제를 일으킬 수 있습니다. 따라서 모든 재정렬에는 일부 사람들이 재정렬로 인해 여러분의 사이트를 사용하기 어렵게 되지 않는지 확인하는 철저한 테스트가 포함되어야 합니다.

자세한 내용은 다음을 참조합니다.

- [콘텐츠 재정렬](/content-reordering/)
- [Flexbox 및 키보드 탐색 연결 끊김](https://tink.uk/flexbox-the-keyboard-navigation-disconnect/)

### 쓰기 모드 및 방향

Flex 항목은 기본적으로 행으로 배치됩니다. 여러분의 쓰기 모드와 스크립트 방향에서 문장이 진행되는 방향으로 행이 실행됩니다. 즉, 오른쪽에서 왼쪽(rtl) 스크립트 방향을 가진 아랍어로 작업하는 경우 항목이 오른쪽에 정렬됩니다. 탭 순서도 아랍어로 문장을 읽는 방식을 따르므로 오른쪽에서 시작됩니다.

{% Codepen { user: 'web-dot-dev', id: 'ExZgwWN' } %}

일부 일본어 서체와 같은 세로 쓰기 모드로 작업하는 경우 행은 위에서 아래로 세로로 실행됩니다. 세로 쓰기 모드를 사용하는 이 데모에서 `flex-direction`을 변경해보세요.

{% Codepen { user: 'web-dot-dev', id: 'qBRaPXX', height: 600 } %}

따라서 플렉스 항목이 기본적으로 동작하는 방식은 문서의 쓰기 모드와 연결되어 있습니다. 대부분의 튜토리얼은 영어, 또는 가로로 왼쪽에서 오른쪽 쓰기 모드를 사용하여 작성됩니다. 이렇게 하면 플렉스 항목이 **왼쪽에** 정렬되고 **가로로** 실행된다고 쉽게 가정할 수 있습니다.

주 축과 교차 축에 더해 쓰기 모드 사용을 고려하면 우리가 Flexbox에서 위, 아래, 왼쪽, 오른쪽보다 **시작**과 **끝**을 이야기한다는 사실이 더 이해하기 쉬울 것입니다. 각 축에는 시작과 끝이 있습니다. 주 축의 시작은 **main-start**로 참조됩니다. 따라서 우리의 플렉스 항목은 처음에 main-start부터 정렬됩니다. 해당 축의 끝은 **main-end**입니다. 교차 축의 시작은 **cross-start**이며 끝은 **cross-end**입니다.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/uSH4TxRv8KNQDTK7Vn8h.svg", alt="위 용어의 레이블이 지정된 다이어그램", width="800", height="382" %}

## 플렉스 항목 래핑

`flex-wrap` 속성의 초기 값은 `nowrap`입니다. 즉, 컨테이너에 공간이 충분하지 않으면 항목이 오버플로됩니다.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/VTUdLS9PeBziBvbOSc4q.jpg", alt="내부에 9개의 항목이 있는 플렉스 컨테이너. 항목이 축소되어 한 단어가 줄에 표시되지만 나란히 표시할 공간이 충분하지 않아 플렉스 항목이 컨테이너 상자 밖으로 확장됨.", width="800", height="282" %} <figcaption> 최소 콘텐츠 크기에 도달하면 플렉스 항목이 컨테이너를 오버플로하기 시작합니다. </figcaption></figure>

초기 값을 사용하여 표시되는 항목은 오버플로가 발생하기 전에 `min-content` 크기까지 최대한 작게 축소됩니다.

항목이 래핑되도록 하려면 플렉스 컨테이너에 `flex-wrap: wrap`을 추가합니다.

```css
.container {
  display: flex;
  flex-wrap: wrap;
}
```

{% Codepen { user: 'web-dot-dev', id: 'WNRGdNZ', height: 601 } %}

플렉스 컨테이너가 래핑되면 여러 **플렉스 라인**이 생성됩니다. 공간 분배 측면에서 각 라인은 새로운 플렉스 컨테이너처럼 작동합니다. 따라서 행을 래핑하는 경우 행 2의 항목을 행 1의 상위 항목과 정렬할 수 없습니다. 이것이 Flexbox가 1차원이라고 하는 의미입니다. 하나의 축, 행 또는 열에서 정렬을 제어할 수 있으며 그리드에서 할 수 있는 것처럼 둘 다 함께 제어할 수는 없습니다.

### 플렉스 플로우 줄임 속성

`flex-flow` 줄임 속성을 사용하여 `flex-direction` 및 `flex-wrap` 속성을 설정할 수 있습니다. 예를 들어 `flex-direction`을 `column`으로 설정하고 항목이 래핑되도록 하려면 다음을 수행합니다.

```css
.container {
  display: flex;
  flex-flow: column wrap;
}
```

## 플렉스 항목 내부 공간 제어하기

우리 컨테이너에 항목을 표시하는 데 필요한 공간보다 더 많은 공간이 있다고 가정할 경우 항목이 처음에 정렬된 후 공간을 채우기 위해 확대되지 않습니다. 최대 콘텐츠 크기에서 항목의 확대가 멈춥니다. 이는 `flex-` 속성의 초기 값이 다음과 같기 때문입니다.

- `flex-grow: 0`: 아이템이 확대되지 않습니다.
- `flex-shrink: 1`: 항목이 `flex-basis`보다 작게 축소될 수 있습니다.
- `flex-basis: auto`: 항목의 기본 크기는 `auto`입니다.

이는 `flex: initial`의 키워드 값으로 나타낼 수 있습니다. `flex` 줄임 속성 또는 `flex-grow`, `flex-shrink` 및 `flex-basis`의 보통 속성이 플렉스 컨테이너의 하위 항목에 적용됩니다.

{% Codepen { user: 'web-dot-dev', id: 'LYxRebE' } %}

큰 항목이 작은 항목보다 더 많은 공간을 갖도록 허용하면서 항목이 확대되도록 하려면 `flex:auto`를 사용합니다. 위의 데모를 사용하여 시도해 볼 수 있습니다. 이렇게 하면 속성이 다음과 같이 설정됩니다.

- `flex-grow: 1`: 항목이 `flex-basis`보다 확대될 수 있습니다.
- `flex-shrink: 1`: 항목이 `flex-basis`보다 작게 축소될 수 있습니다.
- `flex-basis: auto`: 항목의 기본 크기는 `auto`입니다.

`flex: auto`를 사용하면 각 항목이 최대 콘텐츠 크기로 배치된 *후에* 항목 간에 공유되는 공간이 공유되므로 항목의 크기가 서로 달라집니다. 따라서 큰 항목은 더 많은 공간을 갖습니다. 모든 항목을 일관된 크기로 만들고 콘텐츠 크기를 무시하려면 데모에서 `flex:auto`를 `flex: 1`로 변경합니다.

이것은 다음 기능을 해제합니다.

- `flex-grow: 1`: 항목이 `flex-basis`보다 확대될 수 있습니다.
- `flex-shrink: 1`: 항목이 `flex-basis`보다 작게 축소될 수 있습니다.
- `flex-basis: 0`: 항목의 기본 크기는 `0`입니다.

`flex: 1`을 사용하면 모든 항목의 크기가 0이므로 플렉스 컨테이너의 모든 공간을 분배할 수 있습니다. 모든 항목의 `flex-grow` 인자가 `1`이므로 모두 동일한 크기로 확대되고 공간을 동일하게 공유합니다.

{% Aside %} 여기에는 `flex: none` 값도 있으며 이는 확대되거나 축소되지 않아 유연하지 않은 항목을 제공합니다. 이는 여러분이 Flexbox만 사용하여 정렬 속성에 액세스하지만 유연한 동작을 원하지 않는 경우에 유용할 수 있습니다. {% endAside %}

### 항목이 다른 비율로 확대되도록 허용하기

모든 항목에 `flex-grow` 인자를 `1`로 지정할 필요는 없습니다. 여러분의 플렉스 항목에 다른 `flex-grow` 인자를 부여할 수도 있습니다. 아래 데모에서 첫 번째 항목에는 `flex: 1`, 두 번째 항목에는 `flex: 2`, 세 번째 항목에는 `flex: 3`이 있습니다. 이러한 항목이 `0`에서부터 확대됨에 따라 플렉스 컨테이너의 사용 가능한 공간은 6개로 공유됩니다. 첫 번째 항목에 한 부분, 두 번째 항목에 두 부분, 세 번째 항목에 세 부분이 제공됩니다.

{% Codepen { user: 'web-dot-dev', id: 'OJWRzEz' } %}

세 개의 값을 지정해야 하지만 `auto`의 `flex-basis`부터 시작하며 동일한 작업을 수행할 수 있습니다. 첫 번째 값은 `flex-grow`, 두 번째 값은 `flex-shrink`, 세 번째 값은 `flex-basis`입니다.

```css
.item1 {
  flex: 1 1 auto;
}

.item2 {
  flex: 2 1 auto;
}
```

`auto`의 `flex-basis`를 사용하는 이유는 브라우저가 공간 분배를 파악할 수 있도록 하기 위함이기 때문에 이는 덜 일반적인 사용 사례입니다. 여러분이 알고리즘이 결정하는 것보다 항목을 조금 더 확대하고 싶다면 이러한 설정이 유용할 수 있습니다.

## 플렉스 항목 재정렬

플렉스 컨테이너의 항목을 `order` 속성을 사용하여 재정렬할 수 있습니다. 이 속성을 사용하면 **서수 그룹**의 항목 순서를 지정할 수 있습니다. 항목은 `flex-direction`이 지시하는 방향으로 가장 낮은 값부터 먼저 배치됩니다. 둘 이상의 항목에 동일한 값이 있는 경우 해당 값을 가진 다른 항목과 함께 표시됩니다.

아래 예시는 이 순서를 보여줍니다.

{% Codepen { user: 'web-dot-dev', id: 'NWdRXoL' } %}

{% Aside 'warning' %} `order`를 사용하면 `flex-direction`의 `row-reverse` 및 `column-reverse` 값과 동일한 문제가 발생합니다. 일부 사용자를 위해 연결이 해제된 경험을 만드는 것은 매우 쉬울 것입니다. 여러분은 문서에서 순서가 잘못된 것을 수정하고 있으므로 `order`를 사용하지 않아야 합니다. 항목이 논리적으로 다른 순서로 있어야 하는 경우 HTML을 변경하세요! {% endAside %}

{% Assessment 'flex' %}

## Flexbox 정렬 개요

Flexbox는 항목을 정렬하고 항목 사이에 공간을 분배하기 위해 속성 세트를 가져왔습니다. 이러한 속성은 매우 유용하여 이후 자체 사양으로 이동되었으며 그리드 레이아웃에서도 이러한 속성을 볼 수 있습니다. 여기에서 Flexbox를 사용할 때 작동 방식을 확인할 수 있습니다.

속성 집합은 공간 분배 속성 및 정렬 속성의 두 그룹으로 나눌 수 있습니다. 공간을 분배하는 속성은 다음과 같습니다.

- `justify-content`: 주 축의 공간 분배.
- `align-content`: 교차 축의 공간 분배.
- `place-content`: 위의 두 속성을 모두 설정하기 위한 줄임 속성.

Flexbox에서 정렬에 사용되는 속성:

- `align-self`: 교차 축에 단일 항목을 정렬.
- `align-items`: 모든 항목을 교차 축에 그룹으로 정렬.

주 축에서 작업하는 경우 속성은 `justify-`로 시작합니다. 교차 축에서는 `align-`으로 시작합니다.

## 주 축에 공간 분배하기

앞에서 사용한 HTML을 사용할 경우 플렉스 항목이 행으로 배치되며 주 축에 공간이 생깁니다. 항목은 플렉스 컨테이너를 완전히 채울 만큼 크지 않습니다. `justify-content`의 초기 값이 `flex-start`이기 때문에 항목이 플렉스 컨테이너의 시작 부분에 정렬됩니다. 항목은 시작 부분에 정렬되며 추가 공간은 끝부분에 정렬됩니다.

`justify-content` 속성을 플렉스 컨테이너에 추가하고 여기에 `flex-end` 값을 지정하면 항목이 컨테이너 끝에 정렬되고 여유 공간은 시작 부분에 배치됩니다.

```css
.container {
  display: flex;
  justify-content: flex-end;
}
```

`justify-content: space-between`을 사용하여 항목 사이의 공간을 분배할 수도 있습니다.

데모의 값 중 일부를 시험해보고, 가능한 값의 전체 집합은 [MDN을 참조](https://developer.mozilla.org/docs/Web/CSS/justify-content)하세요.

{% Codepen { user: 'web-dot-dev', id: 'JjERpGb' } %}

{% Aside %} `justify-content` 속성이 모든 작업을 수행하려면 주 축의 컨테이너에 여유 공간이 있어야 합니다. 여러분의 항목이 축을 채우면 공유할 공간이 없으므로 속성이 아무 작업도 수행하지 않습니다. {% endAside %}

### `flex-direction: column` 사용하기

`flex-direction`을 `column`으로 변경한 경우 `justify-content`가 해당 열에서 작동합니다. 열로 작업할 때 컨테이너에서 여유 공간을 확보하려면 여러분의 컨테이너에 `height` 또는 `block-size`를 지정해야 합니다. 그렇지 않으면 배포할 여유 공간이 없게 됩니다.

이번에는 Flexbox 열 레이아웃으로 다른 값을 시도해보세요.

{% Codepen { user: 'web-dot-dev', id: 'bGgwLgz', height: 600 } %}

## 플렉스 라인 사이의 공간 분배

래핑된 플렉스 컨테이너를 사용하면 교차 축에 분배할 공간을 가질 수 있습니다. 이 경우 `justify-content`와 동일한 값으로 `align-content` 속성을 사용할 수 있습니다. 기본적으로 항목을 `flex-start`에 정렬하는 `justify-content`와 달리 `align-content`의 초기 값은 `stretch`입니다. 기본 동작을 변경하려면 `align-content` 속성을 플렉스 컨테이너에 추가합니다.

```css
.container {
  align-content: center;
}
```

데모에서 이것을 시도해봅니다. 이 예시에서는 플렉스 항목의 줄이 래핑되어 있으며 컨테이너에는 여유 공간을 확보하기 위한 `block-size`가 있습니다.

{% Codepen { user: 'web-dot-dev', id: 'poREawo' } %}

### `place-content` 줄임 속성

`justify-content`와 `align-content`를 모두 설정하려면 하나 또는 두 개의 값과 함께 `place-content`를 사용할 수 있습니다. 첫 번째 값은 `align-content`에 사용되고 두 번째 값은 `justify-content`에 사용되도록 지정하면 두 축 모두에 단일 값이 사용됩니다.

```css
.container {
  place-content: space-between;
  /* sets both to space-between */
}

.container {
  place-content: center flex-end;
  /* wrapped lines on the cross axis are centered,
  on the main axis items are aligned to the end of the flex container */
}
```

## 교차 축에 항목 정렬하기

교차 축에서 여러분은 `align-items`와 `align-self`를 사용하여 플렉스 라인 내에서 항목을 정렬할 수도 있습니다. 이 정렬에 사용할 수 있는 공간은 플렉스 컨테이너의 높이에 따라 다르며 래핑된 항목 집합의 경우에는 플렉스 라인에 따라 다릅니다.

`align-self`의 초기 값은 `stretch`이며, 이것이 한 행의 플렉스 항목이 기본적으로 가장 높은 항목의 높이까지 늘어나는 이유가 됩니다. 이를 변경하려면 여러분의 플렉스 항목에 `align-self` 속성을 추가합니다.

```css
.container {
  display: flex;
}

.item1 {
  align-self: flex-start;
}
```

다음 값 중 하나를 사용하여 항목을 정렬합니다.

- `flex-start`
- `flex-end`
- `center`
- `stretch`
- `baseline`

[MDN의 전체 값 목록](https://developer.mozilla.org/docs/Web/CSS/align-self)을 참조하세요.

다음 데모에는 `flex-direction: row`가 있는 단일 라인의 플렉스 항목이 있습니다. 마지막 항목은 플렉스 컨테이너의 높이를 정의합니다. 첫 번째 항목에는 값이 `flex-start`인 `align-self` 속성이 있습니다. 해당 속성의 값을 변경하여 교차 축의 공간 내에서 속성이 어떻게 움직이는지 확인합니다.

{% Codepen { user: 'web-dot-dev', id: 'RwKGQee', height: 600 } %}

`align-self` 속성이 개별 항목에 적용됩니다. `align-items` 속성을 플렉스 컨테이너에 적용하여 모든 개별 `align-self` 속성을 그룹으로 설정할 수 있습니다.

```css
.container {
  display: flex;
  align-items: flex-start;
}
```

다음 데모에서는 `align-items` 값을 변경하여 교차 축의 모든 항목을 그룹으로 정렬해 봅니다.

{% Codepen { user: 'web-dot-dev', id: 'QWdKmby', height: 600 } %}

## Flexbox에 justify-self가 없는 이유는 무엇인가요?

Flex 항목은 주 축에서 그룹으로 작동합니다. 따라서 해당 그룹에서 개별 항목을 분리하는 개념이 없습니다.

그리드 레이아웃에서 `justify-self` 및 `justify-items` 속성은 인라인 축에서 작동하여 그리드 영역 내의 해당 축에 항목을 정렬하는 작업을 수행합니다. 플렉스 레이아웃이 항목을 그룹으로 취급하는 방식으로 인해 이러한 속성은 플렉스 컨텍스트에서 구현되지 않습니다.

Flexbox가 자동 여백과 매우 잘 작동한다는 것을 아는 것은 가치가 있습니다. 그룹에서 한 항목을 분리하거나 그룹을 두 그룹으로 분리해야 하는 경우 여백을 적용하여 이를 수행할 수 있습니다. 아래 예시에서 마지막 항목의 왼쪽 여백은 `auto`입니다. 자동 여백은 적용된 방향의 모든 공간을 흡수합니다. 즉, 항목을 오른쪽으로 밀어 그룹을 분할합니다.

{% Codepen { user: 'web-dot-dev', id: 'poRELbR' } %}

## 항목을 세로와 가로 가운데에 정렬하는 방법

정렬 속성을 사용하여 다른 상자 안의 가운데에 항목을 배치할 수 있습니다. `justify-content` 속성은 주 축에 항목을 행으로 정렬합니다. 교차 축은 `align-items` 속성을 사용합니다.

```css
.container {
  width: 400px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

{% Aside %} 미래에는 상위 항목을 플렉스 컨테이너로 만들 필요 없이 이 정렬을 수행할 수 있을 것입니다. 블록 및 인라인 레이아웃에 대해 정렬 속성이 지정됩니다. 현재 어떤 브라우저도 이를 구현하지 않았습니다. 그러나 플렉스 서식 컨텍스트로 전환하면 속성에 액세스할 수 있습니다. 무언가를 정렬해야 하는 경우 이를 수행하는 것이 좋습니다. {% endAside %}

{% Assessment 'conclusion' %}

## 참고 자료

- [MDN CSS Flexible Box Layout](https://developer.mozilla.org/docs/Web/CSS/CSS_Flexible_Box_Layout)에는 예시와 함께 일련의 자세한 가이드가 포함되어 있습니다.
- [Flexbox를 위한 CSS 트릭 가이드](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Flexbox Flex 컨테이너를 생성하면 어떻게 되나요?](https://www.smashingmagazine.com/2018/08/flexbox-display-flex-container/)
- [Flexbox의 정렬에 대해 알아야 할 모든 것](https://www.smashingmagazine.com/2018/08/flexbox-alignment/)
- [저 Flexible Box는 얼마나 큰가요?](https://www.smashingmagazine.com/2018/09/flexbox-sizing-flexible-box/)
- [Flexbox 사용 사례](https://www.smashingmagazine.com/2018/10/flexbox-use-cases/)
