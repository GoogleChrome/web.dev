---
title: 그리드
description: CSS 그리드 레이아웃은 행과 열의 레이아웃을 제어하는 2차원 레이아웃 시스템을 제공합니다. 이 모듈에서는 그리드에 관한 모든 것을 알아봅니다.
audio:
  title: 'CSS 팟캐스트   - 011: 그리드'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast_Episode_011_v1.0.mp3?dest-id=1891556"
  thumbnail: image/forR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - rachelandrew
  - andybell
date: 2021-04-29
---

웹 디자인에서 정말 일반적인 레이아웃은 머리글, 사이드바, 본문 및 바닥글 레이아웃입니다.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/tj7KmP72RKkffGQRswpA.svg", alt="로고가 포함된 헤더, 사이드바가 있는 탐색 및 기사가 실린 콘텐츠 영역", width="800", height="531" %}

수년에 걸쳐 이 레이아웃을 해결하기 위한 많은 방법이 있었지만 CSS 그리드를 사용하면 문제를 해결하기가 비교적 간단할 뿐만 아니라 많은 옵션이 제공됩니다. 그리드는 외부 크기 조정이 제공하는 컨트롤과 내부 크기 조정의 유연성을 결합하는 데 매우 유용하므로 이러한 종류의 레이아웃에 이상적입니다. 그리드는 2차원 콘텐츠용으로 설계된 레이아웃 방식이기 때문입니다. 즉, 행과 열에 동시에 내용을 배치합니다.

그리드 레이아웃을 생성할 때는 행과 열이 있는 그리드를 정의합니다. 그런 다음 해당 그리드에 항목을 배치하거나 브라우저가 생성된 셀에 항목을 자동으로 배치하도록 합니다. 그리드에 대해 이야기할 것들이 많지만 사용 가능한 것들에 대한 개요를 살펴보면 그리드 레이아웃을 빠르게 만들어 볼 수 있습니다.

## 개요

그리드로 무엇을 할 수 있을까요? 그리드 레이아웃에는 다음과 같은 기능이 있습니다. 이 가이드에서 이들 모두 배울 것입니다.

1. 그리드는 행과 열로 정의할 수 있습니다. 사용자가 이러한 행 및 열 트랙의 크기를 지정하는 방법을 선택하거나 자체적으로 콘텐츠 크기에 반응하도록 할 수 있습니다.
2. 그리드 컨테이너의 바로 아래 하위 요소는 자동으로 이 그리드에 배치됩니다.
3. 또는 원하는 정확한 위치에 항목을 배치할 수 있습니다.
4. 배치를 쉽게 하기 위해 그리드의 라인과 영역에 이름을 지정할 수 있습니다.
5. 그리드 컨테이너의 여유 공간을 트랙 사이에 분배할 수 있습니다.
6. 그리드 항목은 해당 영역 내에서 정렬할 수 있습니다.

## 그리드 용어

그리드에는 많은 새로운 용어가 제공되는데, CSS에 실제 레이아웃 시스템을 갖는 것이 처음이기 때문입니다.

### 그리드 라인

그리드는 가로 및 세로로 이어지는 라인으로 구성됩니다. 그리드에 네 개의 열이 있는 경우, 마지막 열 다음을 포함하여 5개의 열 라인이 있습니다.

라인은 1부터 시작하여 번호가 매겨지며 구성 요소의 쓰기 모드와 스크립트 방향을 따릅니다. 즉, 열 라인 1은 영어와 같은 왼쪽에서 오른쪽으로 쓰는 언어의 경우 왼쪽에 놓여지고 아랍어와 같은 오른쪽에서 왼쪽으로 쓰는 언어의 경우 오른쪽에 놓여집니다.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/Sf8WXYmbhZkbhhPeqTrY.svg", alt="그리드 라인의 다이어그램 표현", width="800", height="434" %}

### 그리드 트랙

트랙은 두 그리드 라인 사이의 공간입니다. 행 트랙은 두 행 라인 사이에 있고 열 트랙은 두 열 라인 사이에 있습니다. 그리드를 생성할 때는 여기에 크기를 할당하여 이러한 트랙을 생성합니다.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/7YkhnpgOQLrcaxjlKmlU.svg", alt="그리드 트랙의 다이어그램 표현", width="800", height="434" %}

### 그리드 셀

그리드 셀은 행 트랙과 열 트랙의 교차점으로 정의되는 그리드의 가장 작은 공간입니다. 표 셀이나 스프레드시트의 셀과 같습니다. 그리드를 정의하고 어떤 항목도 배치하지 않으면 정의된 각 그리드 셀에 하나의 항목이 자동으로 배치됩니다.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/lpiPCpW6fy4BjFOL6j77.svg", alt="그리드 셀의 다이어그램 표현", width="800", height="434" %}

### 그리드 영역

여러 그리드 셀이 함께 있습니다. 그리드 영역은 항목이 여러 트랙에 걸쳐지도록 하여 생성됩니다.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/pGmMokRfoVbLNxf1VXrF.svg", alt="그리드 영역의 다이어그램 표현", width="800", height="434" %}

### 갭

트랙 사이의 여백 또는 골입니다. 이들은 일반 트랙처럼 작동하여 크기 조정에 이용됩니다. 갭에 콘텐츠를 배치할 수는 없지만 그리드 항목이 갭에 걸쳐지게 할 수는 있습니다.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/JNXSRH4j77loSB099E04.svg", alt="갭이 있는 그리드의 다이어그램 표현", width="800", height="434" %}

### 그리드 컨테이너

`display: grid`가 적용된 HTML 요소로, 직속 하위 요소에 대한 새 그리드 서식 컨텍스트를 만듭니다.

```css
.container {
  display: grid;
}
```

### 그리드 항목

그리드 항목은 그리드 컨테이너의 직계 하위 요소인 항목입니다.

```html/1-3
<div class="container">
  <div class="item"></div>
  <div class="item"></div>
  <div class="item"></div>
</div>
```

## 행과 열

기본 그리드를 생성하기 위해 다음과 같이 3개의 열 트랙, 2개의 행 트랙 및 트랙 사이에 10픽셀 갭으로 구성된 그리드를 정의할 수 있습니다.

```css
.container {
    display: grid;
    grid-template-columns: 5em 100px 30%;
    grid-template-rows: 200px auto;
    gap: 10px;
}
```

이 그리드는 용어 섹션에 설명한 많은 내용을 보여줍니다. 여기에는 3개의 열 트랙이 있습니다. 각 트랙은 서로 다른 길이 단위를 사용합니다. 두 개의 행 트랙이 있는데, 하나는 길이 단위를 사용하고 다른 하나는 자동입니다. 자동 크기 조정 트랙으로 사용하면 콘텐츠만큼 크다고 생각할 수 있습니다. 트랙은 기본적으로 크기가 자동으로 조정됩니다.

`.container` 클래스가 있는 요소에 하위 항목이 있는 경우, 해당 항목은 즉시 이 그리드에 배치됩니다. 아래 데모에서 실제로 작동하는 것을 볼 수 있습니다.

{% Codepen { user: 'web-dot-dev', id: 'NWdbrzr' } %}

Chrome Grid 개발 도구는 그리드의 다양한 부분을 이해하는 데 도움이 될 수 있습니다.

Chrome에서 [데모](https://codepen.io/web-dot-dev/full/NWdbrzr)를 엽니다. ID가 `container`인 회색 배경의 요소를 검사합니다. `.container` 요소 옆에서 DOM의 그리드 배지를 선택하여 그리드를 강조 표시합니다. 레이아웃 탭 내의 드롭다운에서 **라인 번호 표시**를 선택하여 그리드의 라인 번호를 확인합니다.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/YxpjWBUDsqQB2fr6rzU3.jpg", alt="캡션 및 지침에 설명된 대로", width="800", height="449" %}<figcaption> 라인 번호, 셀 및 트랙을 표시하는 Chrome DevTools에서 강조 표시된 그리드.</figcaption></figure>

### 고유 크기 조정 키워드

[크기 조정 단위](/learn/css/sizing) 섹션에 설명된 길이 및 백분율 치수 외에도 그리드 트랙은 고유 크기 조정 키워드를 사용할 수 있습니다. 이러한 키워드는 상자 크기 조정 사양에 정의되어 있으며 그리드 트랙뿐만 아니라 CSS에서 상자 크기를 조정하는 추가적인 방법을 더해줍니다.

- `min-content`
- `max-content`
- `fit-content()`

[`min-content`](https://developer.mozilla.org/docs/Web/CSS/min-content) 키워드는 트랙 콘텐츠가 넘치지 않게 하면서 가능한 한 트랙을 작게 만듭니다. 모두 `min-content` 크기로 세 개의 열 트랙을 갖도록 예제 그리드 레이아웃을 변경하면 트랙에서 가장 긴 단어만큼 좁아집니다.

[`max-content`](https://developer.mozilla.org/docs/Web/CSS/max-content) 키워드는 반대 효과가 있습니다. 트랙은 모든 콘텐츠가 끊어지지 않은 하나의 긴 문자열에 표시될 만큼 충분히 넓어집니다. 문자열이 줄바꿈되지 않으므로 오버플로가 발생할 수 있습니다.

[`fit-content()`](https://developer.mozilla.org/docs/Web/CSS/fit-content()) 함수는 처음에는 `max-content` 처럼 작동합니다. 그러나 사용자가 함수에 전달하는 크기에 트랙이 도달하면 콘텐츠가 줄바꿈되기 시작합니다. 따라서 `fit-content(10em)`는 `max-content` 크기가 10em 미만이지만 10em보다 크지 않은 경우 10em 미만의 트랙을 생성합니다.

다음 데모에서 그리드 트랙의 크기를 변경하여 다양한 고유 크기 조정 키워드를 사용해 보십시오.

{% Codepen { user: 'web-dot-dev', id: 'qBRqNgL', height: 600 } %}

{% Aside %} 이 데모에서 자동이 사용될 때 그리드 열이 컨테이너를 채우기 위해 늘어난다는 사실을 알아챘을 수 있습니다. 그리드 컨테이너에 추가 공간이 있으면 자동 크기 조정된 트랙이 기본적으로 늘어납니다. {% endAside %}

### `fr` 단위

우리는 기존 길이 치수, 백분율, 그리고 이러한 새 키워드를 가지고 있습니다. 그리드 레이아웃에서만 작동하는 특별한 크기 조정 방법도 있습니다. 이것은 그리드 컨테이너에서 사용 가능한 공간의 공유를 설명하는 유연한 길이인 `fr` 단위입니다.

`fr` 단위는 flexbox에서 `flex: auto`를 사용하는 것과 유사한 방식으로 작동합니다. 항목이 배치된 후에 공간을 분배합니다. 따라서 사용 가능한 공간을 모두 동일하게 공유하는 세 개의 열을 가지려면 다음과 같아야 합니다.

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
```

fr 단위는 사용 가능한 공간을 공유하므로 고정 크기 갭 또는 고정 크기 트랙과 결합될 수 있습니다. 고정 크기 요소가 있는 구성 요소와 남은 공간을 차지하는 두 번째 트랙을 가지려면 `grid-template-columns: 200px 1fr`의 트랙 목록으로 사용할 수 있습니다.

fr 단위에 다른 값을 사용하면 공간이 비례하여 공유됩니다. 값이 클수록 예비 공간이 더 많이 확보됩니다. 아래 데모에서는 세 번째 트랙의 값을 변경합니다.

{% Codepen { user: 'web-dot-dev', id: 'vYgyXNE', height: 600 } %}

### `minmax()` 함수

이 함수는 트랙의 최소 및 최대 크기를 설정할 수 있음을 의미합니다. 이것은 꽤 유용할 수 있습니다. 나머지 공간을 분배하는 상한인 `fr` 단위를 예로 들어 들면 [`minmax()`](https://developer.mozilla.org/docs/Web/CSS/minmax())를 `minmax(auto, 1fr)`로 사용하여 이를 작성할 수 있습니다. 그리드는 콘텐츠의 고유 크기를 확인한 다음 콘텐츠에 충분한 공간을 제공한 후 사용 가능한 공간을 분배합니다. 즉, 그리드 컨테이너에서 사용 가능한 모든 공간이 각각 동일한 공유를 갖는 트랙을 얻지 못할 수도 있습니다.

트랙이 그리드 컨테이너에서 갭을 뺀 공간을 동일하게 공유하도록 하려면 minmax를 사용합니다. 트랙 크기로 `1fr`을 `minmax(0, 1fr)`로 대체하세요. 그러면 트랙의 최소 크기가 최소 콘텐츠 크기가 아니라 0이 됩니다. 그런 다음 그리드는 컨테이너에서 사용 가능한 모든 크기를 가져오고 갭에 필요한 크기를 뺀 다음 fr 단위에 따라 나머지를 분배합니다.

### `repeat()` 표기법

동일한 열로 12 열 트랙 그리드를 생성하려면 다음 CSS를 사용할 수 있습니다.

```css
.container {
    display: grid;
    grid-template-columns:
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr),
      minmax(0,1fr);
}
```

또는 [`repeat()`](https://developer.mozilla.org/docs/Web/CSS/repeat())를 사용하여 작성할 수 있습니다.

```css
.container {
    display: grid;
    grid-template-columns: repeat(12, minmax(0,1fr));
}
```

`repeat()` 함수는 트랙 목록의 모든 섹션을 반복하는 데 사용할 수 있습니다. 예를 들어 트랙 패턴을 반복할 수 있습니다. 일반 트랙과 반복 섹션을 가질 수도 있습니다.

```css
.container {
    display: grid;
    grid-template-columns: 200px repeat(2, 1fr 2fr) 200px; /*creates 6 tracks*/
}
```

### `auto-fill` 및 `auto-fit`

트랙 크기 지정, `minmax()` 및 반복에 대해 배운 모든 내용을 결합하여 그리드 레이아웃으로 유용한 패턴을 만들 수 있습니다. 열 트랙의 수를 지정하지 않고 대신 컨테이너에 맞는 만큼 많이 만들고 싶을 수도 있을 것입니다.

이를 위해 `repeat()` 및 `auto-fill` 또는 `auto-fit` 키워드를 사용할 수 있습니다. 아래의 데모에서 그리드는 컨테이너에 맞는 만큼 200픽셀 트랙을 생성합니다. 새 창에서 데모를 열고 뷰포트의 크기를 변경함에 따라 그리드가 어떻게 변하는지 확인하세요.

{% Codepen { user: 'web-dot-dev', id: 'XWpNjgO' } %}

데모에서는 최대한 많은 트랙을 얻을 수 있습니다. 그러나 트랙이 유연하지 않습니다. 또 다른 200픽셀 트랙을 위한 충분한 공간이 생길 때까지 끝에 갭이 생깁니다. `minmax()` 함수를 추가하면 최소 200픽셀, 최대 1fr 크기에 맞는 만큼의 트랙을 요청할 수 있습니다. 그러면 그리드가 200픽셀 트랙을 배치하고 남은 공간은 모두 균등하게 분배됩니다.

그러면 미디어 쿼리가 필요 없는 2차원 반응형 레이아웃이 만들어집니다.

{% Codepen { user: 'web-dot-dev', id: 'OJWbRax' } %}

`auto-fill`와 `auto-fit` 사이에는 미묘한 차이가 있습니다. 다음 데모에서는 위에서 설명한 구문을 사용하여 그리드 레이아웃으로 처리하지만 그리드 컨테이너에는 두 개의 그리드 항목만 있습니다. `auto-fill` 키워드를 사용하면 빈 트랙이 생성되었음을 알 수 있습니다. 키워드를 `auto-fit`으로 변경하면 트랙이 0 크기로 축소됩니다. 이는 유연한 트랙이 이제 공간을 차지할 만큼 커짐을 의미합니다.

{% Codepen { user: 'web-dot-dev', id: 'MWJbbNe' } %}

`auto-fill` 및 `auto-fit` 키워드는 그렇지 않으면 정확히 동일한 방식으로 작동합니다. 첫 번째 트랙이 채워지면 둘 사이에는 차이가 없습니다.

## 자동 배치

지금까지 데모에서 그리드 자동 배치가 작동하는 것을 이미 보았습니다. 항목은 소스에 나타나는 순서대로 셀당 하나씩 그리드에 배치됩니다. 많은 레이아웃의 경우에 더 이상 필요한 것은 없을 것입니다. 더 많은 제어가 필요한 경우 몇 가지 작업을 수행할 수 있습니다. 첫 번째는 자동 배치 레이아웃을 조정하는 것입니다.

### 열에 항목 배치

그리드 레이아웃의 기본 동작은 행을 따라 항목을 배치하는 것입니다. 대신, `grid-auto-flow: column`을 사용하여 항목을 열에 배치할 수 있습니다. 행 트랙을 정의해야 하며, 그렇지 않으면 항목이 고유한 열 트랙을 만들고 하나의 긴 행에 모두 배치하게 됩니다.

이러한 값은 문서의 쓰기 모드와 관련이 있습니다. 행은 항상 문서 또는 구성 요소의 쓰기 모드에서 문장이 실행되는 방향으로 실행됩니다. `grid-auto-flow` 및 `writing-mode` 속성의 값을 모드로 변경할 수 있습니다.

{% Codepen { user: 'web-dot-dev', id: 'PoWbWbr', height: 600 } %}

### 여러 트랙에 걸쳐지게 하기

자동 배치 레이아웃의 일부 또는 모든 항목이 둘 이상의 트랙에 걸쳐지도록 할 수 있습니다. `span` 키워드와 걸쳐지게 할 라인 수를 더한 결과를 `grid-column-end` 또는 `grid-row-end`에 대한 값으로 사용하세요.

```css
.item {
    grid-column-end: span 2; /* will span two lines, therefore covering two tracks */
}
```

`grid-column-start`를 지정하지 않았기 때문에 이는 초기 값 `auto`를 사용하고 자동 배치 규칙에 따라 배치됩니다. 단축형인 `grid-column`을 사용하여 동일한 내용을 지정할 수도 있습니다.

```css
.item {
    grid-column: auto / span 2;
}
```

### 갭 채우기

일부 항목이 여러 트랙에 걸쳐진 자동 배치 레이아웃의 경우, 그리드에 일부 채워지지 않은 셀이 생길 수 있습니다. 레이아웃이 완전히 자동 배치된 그리드 레이아웃의 기본 동작은 항상 앞으로 진행하는 것입니다. 항목은 소스의 순서, 또는 `order` 속성을 사용하여 수정된 순서에 따라 배치됩니다. 항목을 넣을 공간이 충분하지 않으면 그리드가 갭을 남기고 다음 트랙으로 이동합니다.

다음 데모에서 이 동작을 보여줍니다. 확인란은 조밀한 패킹 모드를 적용합니다. 이것은 `grid-auto-flow`에 `dense`의 값을 제공하여 활성화됩니다. 이 값을 사용하면 그리드가 나중에 레이아웃에서 항목을 가져와 갭을 채우는 데 사용합니다. 이것은 디스플레이가 논리적 순서에서 분리된다는 것을 의미할 수 있습니다.

{% Codepen { user: 'web-dot-dev', id: 'ZELBLrJ', height: 600 } %}

## 항목 배치하기

CSS 그리드에는 이미 많은 기능이 있습니다. 이제 그리드에 우리가 만든 항목을 배치하는 방법을 살펴보겠습니다.

기억해야 할 첫 번째 사항은 CSS 그리드 레이아웃이 번호가 매겨진 라인의 그리드를 기반으로 한다는 것입니다. 그리드에 내용을 배치하는 가장 간단한 방법은 한 라인에서 다른 라인으로 옮겨가며 배치하는 것입니다. 이 안내서에서 항목을 배치하는 다른 방법도 볼 수 있지만 항상 이러한 번호가 매겨진 라인에 액세스할 수 있습니다.

라인 번호로 항목을 배치하는 데 사용할 수 있는 속성은 다음과 같습니다.

- [`grid-column-start`](https://developer.mozilla.org/docs/Web/CSS/grid-column-start)
- [`grid-column-end`](https://developer.mozilla.org/docs/Web/CSS/grid-column-end)
- [`grid-row-start`](https://developer.mozilla.org/docs/Web/CSS/grid-row-start)
- [`grid-row-end`](https://developer.mozilla.org/docs/Web/CSS/grid-row-end)

한 번에 시작 라인과 끝 라인을 모두 설정할 수 있는 짧은 표기가 있습니다.

- [`grid-column`](https://developer.mozilla.org/docs/Web/CSS/grid-column)
- [`grid-row`](https://developer.mozilla.org/docs/Web/CSS/grid-row)

항목을 배치하려면 배치해야 하는 그리드 영역의 시작 및 끝 라인을 설정합니다.

```css
.container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 200px 100px);
}

.item {
    grid-column-start: 1; /* start at column line 1 */
    grid-column-end: 4; /* end at column line 4 */
    grid-row-start: 2; /*start at row line 2 */
    grid-row-end: 4; /* end at row line 4 */
}
```

Chrome DevTools는 항목이 배치된 위치를 확인하도록 라인에 대한 시각적 가이드를 제공할 수 있습니다.

라인 번호 지정은 구성 요소의 쓰기 모드와 방향을 따릅니다. 다음 데모에서는 쓰기 모드 또는 방향을 변경하여 항목 배치가 텍스트 흐름 방식과 얼마나 잘 일관성을 유지하는지 확인합니다.

{% Codepen { user: 'web-dot-dev', id: 'QWdGdzd', height: 600 } %}

### 항목 적층시키기

라인 기반 위치 지정을 사용하여 그리드의 동일한 셀에 항목을 배치할 수 있습니다. 즉, 항목을 적층시키거나 한 항목이 다른 항목과 부분적으로 겹치도록 할 수 있습니다. 소스에서 나중에 들어오는 항목은 먼저 들어오는 항목 위에 표시됩니다. 배치된 항목과 마찬가지로 `z-index`를 사용하여 이 적층 순서를 변경할 수 있습니다.

{% Codepen { user: 'web-dot-dev', id: 'BapQWQW', height: 600 } %}

### 음수 라인 번호

`grid-template-rows` 및 `grid-template-columns`를 사용하여 그리드를 생성할 때는 **명시적 그리드**라고 하는 것을 생성하게 됩니다. 이것은 사용자가 정의하고 트랙에 크기를 지정한 그리드입니다.

때로 이 명시적 그리드 외부에 표시되는 항목이 있습니다. 예를 들어, 열 트랙을 정의한 다음 행 트랙을 정의하지 않고 그리드 항목의 여러 행을 추가할 수 있습니다. 트랙은 기본적으로 자동으로 크기가 조정됩니다. 정의된 명시적 그리드 외부에 있는 `grid-column-end`를 사용하여 항목을 배치할 수도 있습니다. 이 두 경우 모두 그리드는 레이아웃이 작동하도록 트랙을 생성하며 이러한 트랙을 **암시적 그리드**라고 합니다.

암시적 또는 명시적 그리드로 작업하는 경우 대부분 차이가 없습니다. 그러나 라인 기반 배치를 사용하면 둘 사이의 주된 차이점에 직면할 수 있습니다.

음수 라인 번호를 사용하여 명시적 그리드의 끝 라인에서 항목을 배치할 수 있습니다. 이것은 항목이 첫 번째 열 라인에서 마지막 열 라인까지 확장되도록 하려는 경우에 유용할 수 있습니다. 이 경우에 `grid-column: 1 / -1`을 사용할 수 있습니다. 항목이 명시적 그리드를 가로질러 바로 늘어납니다.

그러나 이것은 명시적 그리드에서만 작동합니다. 첫 번째 항목이 그리드의 끝 라인까지 확장되도록 하려는 자동 배치된 항목의 세 행 레이아웃을 가져옵니다.

{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/Dt8yG376MqSyWJJ8KqPr.svg", alt="8개의 형제 그리드 항목이 있는 사이드바", width="800", height="359" %}

이 항목에 `grid-row: 1 / -1`을 부여할 수 있다고 생각할 수도 있습니다. 아래 데모에서 이것이 작동하지 않는다는 것을 알 수 있습니다. 트랙은 암시적 그리드에서 생성되며 `-1`을 사용하여 그리드 끝에 도달할 수 있는 방법은 없습니다.

{% Codepen { user: 'web-dot-dev', id: 'YzNpZeq' } %}

#### 암시적 트랙 크기 지정

암시적 그리드에서 생성된 트랙은 기본적으로 크기가 자동 조정됩니다. 그러나 행의 크기를 제어하려면 [`grid-auto-rows`](https://developer.mozilla.org/docs/Web/CSS/grid-auto-rows) 속성을 사용하고, 열의 경우 [`grid-auto-columns`](https://developer.mozilla.org/docs/Web/CSS/grid-auto-columns)를 사용합니다.

`10em`의 최소 크기와 `auto`의 최대 크기로 모든 암시적 행을 만들려면 다음을 수행합니다.

```css
.container {
    display: grid;
    grid-auto-rows: minmax(10em, auto);
}
```

100px 및 200px 너비 트랙의 패턴으로 암시적 열을 생성합니다. 이 경우에 첫 번째 암시적 열은 100px, 두 번째는 200px, 세 번째는 100px 등입니다.

```css
.container {
    display: grid;
    grid-auto-columns: 100px 200px;
}
```

## 명명된 그리드 라인

라인에 번호가 아닌 이름이 있는 경우 레이아웃에 항목을 배치하기가 더 쉬워질 수 있습니다. 대괄호 사이에 원하는 이름을 추가하여 그리드의 어떤 라인에든 이름을 지정할 수 있습니다. 동일한 대괄호 내에서 공백으로 구분하여 여러 이름을 추가할 수 있습니다. 이름이 지정된 라인에는 숫자 대신 그 이름을 사용할 수 있습니다.

```css
.container {
    display: grid;
    grid-template-columns:
      [main-start aside-start] 1fr
      [aside-end content-start] 2fr
      [content-end main-end]; /* a two column layout */
}

.sidebar {
    grid-column: aside-start / aside-end;
    /* placed between line 1 and 2*/
}

footer {
    grid-column: main-start / main-end;
    /* right across the layout from line 1 to line 3*/
}
```

## 그리드 템플릿 영역

그리드 영역에 이름을 지정하고 명명된 영역에 항목을 배치할 수도 있습니다. 이것은 CSS에서 구성 요소가 어떻게 보이는지 볼 수 있게 해주므로 멋진 기술이라고 할 수 있습니다.

우선, [`grid-area`](https://developer.mozilla.org/docs/Web/CSS/grid-area) 속성을 사용하여 그리드 컨테이너의 바로 아래 하위 항목에 이름을 지정합니다.

```css
header {
    grid-area: header;
}

.sidebar {
    grid-area: sidebar;
}

.content {
    grid-area: content;
}

footer {
    grid-area: footer;
}
```

`auto` 및 `span` 키워드 외에 원하는 대로 이름을 지정할 수 있습니다. 모든 항목의 이름을 지정했으면 [`grid-template-areas`](https://developer.mozilla.org/docs/Web/CSS/grid-template-areas) 속성을 사용하여 각 항목이 확장될 그리드 셀을 정의합니다. 각 행은 따옴표로 정의됩니다.

```css
.container {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-areas:
        "header header header header"
        "sidebar content content content"
        "sidebar footer footer footer";
}
```

`grid-template-areas`를 사용할 때 몇 가지 규칙이 있습니다.

- 값은 빈 셀이 없는 완전한 그리드여야 합니다.
- 트랙을 확장하려면 이름을 반복합니다.
- 이름을 반복하여 생성된 영역은 직사각형이어야 하며 연결을 끊을 수 없습니다.

위의 규칙 중 하나라도 위반하면 값이 유효하지 않은 것으로 처리되어 폐기됩니다.

그리드에 화이트 공백을 남기려면 `.` 또는 사이에 화이트 공백 없이 이 코드를 여러 번 사용합니다. 예를 들어 그리드의 맨 처음 셀을 비워 두려면 일련의 `.` 문자를 추가할 수 있습니다:

```css
.container {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    grid-template-areas:
        "....... header header header"
        "sidebar content content content"
        "sidebar footer footer footer";
}
```

전체 레이아웃이 한 곳에서 정의되므로 미디어 쿼리를 사용하여 레이아웃을 간단하게 재정의할 수 있습니다. 다음 예제에서는 `grid-template-columns` 및 `grid-template-areas` 값을 재정의하여 3개의 열로 이동하는 2개의 열 레이아웃을 만들었습니다. 뷰포트 크기를 조정하고 레이아웃 변경을 보려면 새 창에서 예제를 엽니다.

다른 그리드 방법과 마찬가지로 `grid-template-areas` 속성이 `writing-mode` 및 방향과 어떻게 관련되는지 확인할 수도 있습니다.

{% Codepen { user: 'web-dot-dev', id: 'oNBYepg', height: 600 } %}

## 짧은 표기 속성

한 번에 많은 그리드 속성을 설정할 수 있는 두 가지 약식 속성이 있습니다. 이것들이 어떻게 서로 어우러지는지 정확히 분석할 때까지는 약간 혼란스러워 보일 수 있습니다. 이 약식 속성을 사용할지, 아니면 더 긴 속성을 사용할지는 여러분에게 달려 있습니다.

### `grid-template`

[`grid-template`](https://developer.mozilla.org/docs/Web/CSS/grid-template) 속성은 `grid-template-rows`, `grid-template-columns` 및 `grid-template-areas`에 대한 약식 표기입니다. `grid-template-areas` 값과 함께 먼저 행이 정의됩니다. 열 크기 조정은 `/` 뒤에 추가됩니다.

```css
.container {
    display: grid;
    grid-template:
      "head head head" minmax(150px, auto)
      "sidebar content content" auto
      "sidebar footer footer" auto / 1fr 1fr 1fr;
}
```

### `grid` 속성

[`grid`](https://developer.mozilla.org/docs/Web/CSS/grid) 약식 표기는 `grid-template`과 정확히 같은 방식으로 사용할 수 있습니다. 이런 식으로 사용하면 받아들이는 다른 그리드 속성을 해당하는 초기값으로 재설정합니다. 전체 세트는 다음과 같습니다.

- `grid-template-rows`
- `grid-template-columns`
- `grid-template-areas`
- `grid-auto-rows`
- `grid-auto-columns`
- `grid-auto-flow`

이 약식 표기를 사용하여 암시적 그리드가 작동하는 방식을 정의할 수 있습니다. 예를 들면 다음과 같습니다.

```css
.container {
    display: grid;
    grid: repeat(2, 80px) / auto-flow  120px;
}
```

## 정렬

그리드 레이아웃은 [flexbox](/learn/css/flexbox) 가이드에서 배운 것과 동일한 정렬 속성을 사용합니다. 그리드에서 `justify-`로 시작하는 속성은 항상 인라인 축에서 사용되고, 쓰기 모드에서 문장이 실행되는 방향입니다.

`align-`으로 시작하는 속성은 블록 축에서 사용되며, 쓰기 모드에서 블록이 배치되는 방향입니다.

- [`justify-content`](https://developer.mozilla.org/docs/Web/CSS/justify-content) 및 [`align-content`](https://developer.mozilla.org/docs/Web/CSS/align-content): 트랙 주변이나 트랙 사이에 그리드 컨테이너에 추가 공간을 분배합니다.
- [`justify-self`](https://developer.mozilla.org/docs/Web/CSS/justify-self) 및 [`align-self`](https://developer.mozilla.org/docs/Web/CSS/align-self): 그리드 항목에 적용되어 해당 항목이 배치된 그리드 영역 내에서 이동합니다.
- [`justify-items`](https://developer.mozilla.org/docs/Web/CSS/justify-items) 및 [`align-items`](https://developer.mozilla.org/docs/Web/CSS/align-items): 항목의 모든 `justify-self` 속성을 설정하기 위해 그리드 컨테이너에 적용됩니다.

### 추가 공간 분배

이 데모에서 그리드는 고정 너비 트랙을 배치하는 데 필요한 공간보다 큽니다. 이는 그리드의 인라인 및 블록 차원 모두에 공간이 있음을 의미합니다. `align-content` 및 `justify-content`에 다른 값을 시도하여 트랙이 어떻게 작동하는지 확인해 보세요.

{% Codepen { user: 'web-dot-dev', id: 'rNjjMVd', height: 650 } %}

`space-between`과 같은 값을 사용할 때 갭이 어떻게 더 커지는지 확인하고, 두 트랙에 걸쳐 있는 그리드 항목도 갭에 더해진 추가 공간을 흡수하기 위해 커집니다.

{% Aside %} flexbox와 마찬가지로 이러한 속성은 배포할 추가 공간이 있는 경우에만 작동합니다. 그리드 트랙이 컨테이너를 깔끔하게 채우면 균등 분배할 공간이 없습니다. {% endAside %}

### 콘텐츠 이동

`justify-self` 및 `align-self`의 초기값이 `stretch`이기 때문에 배경색이 있는 항목은 배치된 그리드 영역을 완전히 채우는 것처럼 보입니다.

{% Aside %} 해당 항목이 이미지 또는 고유 종횡비를 갖는 다른 무엇인 경우 초기값은 모양이 늘어나는 것을 방지하기 위해 `stretch`가 아니라 `start`가 됩니다. {% endAside %}

데모에서 `justify-items` 및 `align-items` 값을 변경하여 이로 인해 레이아웃이 어떻게 변하는지 확인하세요. 그리드 영역은 크기가 변경되지 않고 대신 정의된 영역 내에서 항목이 이동됩니다.

{% Codepen { user: 'web-dot-dev', id: 'YzZOOXB', height: 650 } %}

{% Assessment 'grid' %}

## 리소스

이 가이드는 그리드 레이아웃 사양의 여러 부분에 대한 개요를 제공했습니다. 자세히 알아보려면 다음 리소스를 살펴보세요.

- [MDN CSS 그리드 레이아웃](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout)
- [그리드 완전 가이드](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [그리드 컨테이너 생성](https://www.smashingmagazine.com/2020/01/understanding-css-grid-container/)
- [그리드 종합 학습 자료](https://gridbyexample.com/)
