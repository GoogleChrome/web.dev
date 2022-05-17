---
title: 박스(box) 모델
description: |2-

  CSS가 표시하는 모든 것은 박스입니다.
  따라서 CSS Box Model이 작동하는 방식을 이해하는 것은 CSS의 핵심 기반입니다.
audio:
  title: 'CSS 팟캐스트   - 001: 박스 모델'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_001_v2.0.mp3?dest-id=1891556"
  thumbnail: image/forR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
---

다음과 같은 HTML이 있다고 가정해 보겠습니다.

```html
<p>I am a paragraph of text that has a few words in it.</p>
```

그런 다음 이에 대해 이 CSS를 작성합니다.

```css
p {
  width: 100px;
  height: 50px;
  padding: 20px;
  border: 1px solid;
}
```

콘텐츠가 여러분의 요소에서 벗어나게 되고 너비는 100px이 아닌 142px이 될 것입니다. 왜 그럴까요? 박스 모델은 CSS의 핵심 기반이며, CSS의 작동 방식, CSS의 다른 측면에 의해 CSS가 영향을 받는 방식, 그리고 이를 제어하는 방법(중요함)을 이해하면 보다 예측 가능한 CSS를 작성하는 데 도움이 됩니다.

<figure>{% Codepen { user: 'web-dot-dev', id: 'WNRemxN', height: 300 } %}</figure>

CSS를 작성하거나 웹에서 통으로 작업할 때 기억해야 할 정말 중요한 점은 CSS로 표시하는 모든 것이 박스라는 것입니다. `border-radius`을 사용하여 원처럼 보이는 박스이든, 그저 텍스트만 있더라도 모든 것이 박스로 되어 있다는 것을 기억하는 게 중요합니다.

## 콘텐츠 및 크기

박스는 `display` 값, 설정된 치수 및 박스 안에 있는 내용에 따라 다르게 동작합니다. 이러한 콘텐츠는 자식 요소에 의해 생성된 더 많은 수의 박스 또는 일반 텍스트 콘텐츠일 수 있습니다. 어느 쪽이든, 이러한 콘텐츠는 기본적으로 박스의 크기에 영향을 미칩니다.

**외부 크기 조정**을 사용하여 이를 제어하거나 **내부 크기 조정**을 사용하여 콘텐츠 크기를 기반으로 브라우저가 계속 결정하도록 할 수 있습니다.

데모를 사용하여 차이점을 빠르게 살펴보겠습니다.

<figure>{% Codepen { user: 'web-dot-dev', id: 'abpoMBL' } %} <figcaption> 박스가 외부 크기 조정을 사용하는 경우 박스의 경계를 오버플로하기 전까지 추가할 수 있는 콘텐츠의 양에 제한이 있습니다. 이것은 "awesome"이라는 단어가 오버플로되게 만듭니다.</figcaption></figure>

데모에는 고정된 치수와 두꺼운 테두리가 있는 박스에 "CSS is awesome"라는 단어가 있습니다. 박스에는 너비가 있으며 이는 외부 크기입니다. 이것이 자식 콘텐츠의 크기를 제어합니다. 그런데 이것의 문제는 "awesome"이라는 단어가 박스에 비해 너무 커서 부모 박스의 **테두리 박스** 밖으로 오버플로된다는 것입니다(이에 대한 자세한 내용은 나중에 학습 예정). 이렇게 오버플로되는 현상을 방지하는 한 가지 방법은 `width`를 `min-content`로 설정하여 박스의 크기를 내부 크기로 설정하는 것입니다. `min-content` 키워드는 박스가 콘텐츠(단어 "awesome")의 최소 내부 너비만큼만 넓어지도록 지시합니다. 이렇게 하면 박스가 "CSS is awesome"에 완벽하게 맞게 됩니다.

실제 콘텐츠에 대한 다양한 크기 조정의 영향을 확인하기 위해 더 복잡한 내용을 살펴보겠습니다.

<figure>{% Codepen { user: 'web-dot-dev', id: 'wvgwOJV', height: 650 } %}</figure>

내부 크기 조정 토글을 켜고 끄면 외부 크기 조정으로 여러분이 더 많은 제어 권한을 얻을 수 있게 하는 방법과 내부 크기 조정으로 콘텐츠가 더 많은 제어 권한을 갖게 하는 방법을 확인할 수 있습니다. 내부 및 외부 크기 조정의 효과를 확인하려면 카드에 여러 문장의 콘텐츠를 추가합니다. 이 요소가 외부 크기 조정을 사용하는 경우 요소의 경계를 오버플로하기 전까지 추가할 수 있는 콘텐츠의 양에 제한이 있지만 내부 크기 조정토글이 켜져 있는 경우에는 그렇지 않습니다.

기본적으로 이 요소에는 `width`와 `height`가 모두 `400px`로 설정되어 있습니다. 이러한 수치는 요소 내부의 모든 것에 엄격한 경계를 부여하며, 콘텐츠가 박스에 비해 너무 커서 가시적으로 오버플로하는 상황이 발생하지 않는 한 그대로 적용됩니다. 꽃 그림 아래에 여러 줄로 되어 있는 캡션 내용이 박스 높이를 초과하도록 변경하면 이것이 실제로 작동하는 것을 볼 수 있습니다.

{% Aside "key-term" %} 콘텐츠가 박스에 비해 너무 크면 이를 오버플로라고 합니다. `overflow` 속성을 사용하여 요소가 오버플로 콘텐츠를 처리하는 방법을 관리할 수 있습니다. {% endAside %}

기본적으로 이 요소에는 <code>width</code>와 <code>height</code>가 모두 <code>400px</code>로 설정되어 있습니다. 이러한 수치는 요소 내부의 모든 것에 엄격한 경계를 부여하며, 콘텐츠가 박스에 비해 너무 커서 가시적으로 오버플로하는 상황이 발생하지 않는 한 그대로 적용됩니다. 꽃 그림 아래에 여러 줄로 되어 있는 캡션 내용이 박스 높이를 초과하도록 변경하면 이것이 실제로 작동하는 것을 볼 수 있습니다.

## 박스 모델의 영역

박스는 모두 특정 작업을 수행하는 별개의 박스 모델 영역으로 구성되어 있습니다.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/ECuEOJEGnudhXW5JEFih.svg", alt="박스 모델의 네 가지 주요 영역을 보여주는 다이어그램 - 콘텐츠 박스, 패딩 박스, 테두리 박스 및 여백 박스", width="800", height="547" %} <figcaption>박스 모델의 네 가지 주요 영역: 콘텐츠 박스, 패딩 박스, 테두리 박스 및 여백 박스</figcaption></figure>

콘텐츠가 있는 영역인 **콘텐츠 박스**부터 시작합니다. 이전에 배웠듯이 이 콘텐츠는 부모 콘텐츠의 크기를 제어할 수 있으며, 그렇기에 일반적으로 가장 다양한 크기의 영역도 제어합니다.

**패딩 박스**는 콘텐츠 박스를 둘러싸고 있으며 [`padding`](https://developer.mozilla.org/docs/Web/CSS/padding) 속성에 의해 생성된 공간입니다. 패딩이 박스 안에 있기 때문에 박스의 배경을 박스가 만드는 공간에서 볼 수 있습니다. 박스에 `overflow: auto` 또는 `overflow: scroll`과 같은 오버플로 규칙이 설정되어 있으면 스크롤바도 이 공간을 차지하게 됩니다.

<figure>{% Codepen { user: 'web-dot-dev', id: 'BaReoEV' } %}</figure>

**테두리 박스**는 패딩 박스를 둘러싸고 있으며 그 공간은 `border` 값으로 채워집니다. 테두리 박스는 박스의 경계이며 **테두리 가장자리**는 시각적으로 볼 수 있는 영역의 한계입니다. <a href="https://developer.mozilla.org/docs/Web/CSS/border" data-md-type="link">`border`</a> 속성은 요소를 시각적으로 프레임하는 데 사용됩니다.

마지막 영역인 **여백 박스**는 박스의 `margin` 규칙에 의해 정의된 여러분의 박스 주변의 공간입니다. [`outline`](https://developer.mozilla.org/docs/Web/CSS/box-shadow) 및 [`box-shadow`](https://developer.mozilla.org/docs/Web/CSS/box-shadow)와 같은 속성이 페인트처럼 상단을 칠하며 이 공간을 차지하기에 우리 박스의 크기에 영향을 미치지 않습니다. 박스의 `outline-width`가 `200px`일 수 있으며 테두리 박스를 포함하여 내부의 모든 것이 정확히 같은 크기일 수 있습니다.

<figure>{% Codepen { user: 'web-dot-dev', id: 'XWprGea' } %}</figure>

## 유용한 비유

박스 모델은 이해하기 복잡하므로 배운 내용을 유추를 사용하여 요약해 보겠습니다.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/FBaaJXdnuSkvOx1nB0CB.jpg", alt="Three photo frames", width="800", height="562" %}</figure>

이 다이어그램에는 3개의 사진 프레임이 벽에 나란히 걸려 있습니다. 다이어그램에는 프레임의 요소를 박스 모델과 연결하는 레이블이 있습니다.

이 비유를 나누어 분석하면:

- 콘텐츠 박스는 작품입니다.
- 패딩 박스는 프레임과 작품 사이에 있는 흰색 매트입니다.
- 테두리 박스는 작품에 기본적인 테두리를 제공하는 프레임입니다.
- 여백 박스는 각 프레임 사이의 공간입니다.
- 그림자는 여백 박스와 같이 공간을 차지합니다.

## 박스 모델 디버깅

브라우저 DevTools는 선택한 박스의 박스 모델 계산에 대한 시각화를 제공하여 박스 모델이 작동하는 방식과 작업 중인 웹 사이트에 미치는 영향(중요함)을 이해하는 데 도움이 됩니다.

계속해서 여러분의 브라우저에서 다음을 시도합니다.

1. [개발자 도구 열기](https://developer.chrome.com/docs/devtools/open/)
2. [요소 선택](https://developer.chrome.com/docs/devtools/css/reference/#select)
3. 박스 모델 디버거 표시

<figure>{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/sKdHrAfqahgWfDVQEBBT.mp4", controls=true %}</figure>

## 박스 모델 제어

박스 모델을 제어하는 방법을 이해하려면 먼저 브라우저에서 어떤 일이 발생하는지 이해해야 합니다.

모든 브라우저는 HTML 문서에 사용자 에이전트 스타일시트를 적용합니다. 사용되는 CSS는 브라우저마다 다르지만 콘텐츠를 더 쉽게 읽을 수 있도록 합리적인 기본값을 제공합니다. CSS가 정의되지 않은 경우 요소의 모양과 동작을 정의합니다. `display`가 설정되는 곳도 사용자 에이전트 스타일입니다. 예를 들어 일반적인 상황에서 `<div>` 요소의 기본 `display` 값은 `block`이고, `<li>`의 기본 `display` 값은 `list-item`이며, `<span>`의 기본 `display` 값은 `inline` 입니다.

`inline` 요소에는 블록 여백이 있지만, 다른 요소는 이를 따르지 않습니다. `inline-block`을 사용하면 해당 요소는 블록 여백을 따르지만 요소는 `inline` 요소와 동일한 동작을 대부분 유지합니다. `block` 항목은 기본적으로 사용 가능한 **inline space**를 채우는 반면 `inline` 및 `inline-block` 요소는 콘텐츠만큼만 커집니다.

사용자 에이전트 스타일이 각 박스에 미치는 영향에 대한 이해와 함께 박스 크기 계산 방법을 알려주는 `box-sizing`도 이해해야 합니다. 기본적으로 모든 요소에는 `box-sizing: content-box;`와 같은 사용자 에이전트 스타일이 있습니다.

`content-box`를 `box-sizing`의 값으로 갖는 것은 `width` 및 `height`와 같은 치수를 설정할 때 이러한 설정이 **content box**에 적용된다는 것을 의미합니다. 그런 다음 `padding` 및 `border`를 설정하면 이러한 값이 콘텐츠 박스의 크기에 추가됩니다.

{% Assessment 'box-model' %}

이 박스의 실제 너비는 260px입니다. CSS는 기본 `box-sizing: content-box`를 사용하기 때문에 적용되는 너비는 콘텐츠의 너비이며 `padding`과 `border`가 양쪽에 추가됩니다. 따라서 콘텐츠 200px + 패딩 40px + 테두리 20px로 총 260px의 가시 너비를 만듭니다.

하지만 대체 박스 모델인 `border-box`를 사용하도록 다음과 같이 수정하면 이를 제어하는 것이 *가능*합니다.

```css/1
.my-box {
  box-sizing: border-box;
	width: 200px;
	border: 10px solid;
	padding: 20px;
}
```

다음 대화식 데모에서 이것이 어떻게 작동하는지 확인하십시오. `box-sizing` 값을 토글하면 우리의 박스 <em>내부</em>에서 적용되는 CSS가 파란색 배경으로 표시됩니다.

다음 대화식 데모에서 이것이 어떻게 작동하는지 확인하십시오. `box-sizing` 값을 토글하면 우리의 박스 *내부*에서 적용되는 CSS가 파란색 배경으로 표시됩니다.

<figure>{% Codepen { user: 'web-dot-dev', id: 'oNBvVpM', height: 650 } %}</figure>

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

이 CSS 규칙은 문서와 모든 `::before` 및 `::after` 의사 요소에서 모든 요소를 선택하고 `box-sizing: border-box`를 적용합니다. 이것은 이제 모든 요소가 이 대체 박스 모델을 갖게 됨을 의미합니다.

대체 박스 모델이 더 예측 가능하기 때문에 개발자는 종종 이 규칙을 [이와 같은](https://piccalil.li/blog/a-modern-css-reset) 재설정 및 노멀라이저에 추가합니다.

## 리소스

- [박스 모델 소개](https://developer.mozilla.org/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)
- [브라우저 개발자 도구란 무엇입니까?](https://developer.mozilla.org/docs/Learn/Common_questions/What_are_browser_developer_tools)

### 사용자 에이전트 스타일시트

- [Chromium](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css)
- [Firefox](https://searchfox.org/mozilla-central/source/layout/style/res/html.css)
- [Webkit](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)
