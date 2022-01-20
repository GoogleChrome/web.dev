---
title: 캐스케이드
description: |2

  때로는 두 개 이상의 경쟁 CSS 규칙이 요소에 적용될 수 있습니다.
  이 모듈에서는 브라우저가 사용할 것을 선택하는 방법과 이 선택을 제어하는 방법을 알아봅니다.
audio:
  title: 'CSS 팟캐스트   - 004: 캐스케이드'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_004_v1.0_FINAL.mp3?dest-id=1891556"
  thumbnail: image/forR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
tags:
  - css
---

CSS는 Cascading Stylesheets의 약자입니다. 캐스케이드는 여러 CSS 규칙이 HTML 요소에 적용되는 충돌을 해결하기 위한 알고리즘입니다. 다음 CSS로 스타일이 지정된 버튼의 텍스트가 파란색이 되는 이유입니다.

```css
button {
  color: red;
}

button {
  color: blue;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'GRrgMOm', height: 200 } %}</figure>

캐스케이드 알고리즘을 이해하면 브라우저가 이와 같은 충돌을 해결하는 방법을 이해하는 데 도움이 됩니다. 캐스케이드 알고리즘은 4단계로 나뉩니다.

1. **위치 및 표시 순서**: CSS 규칙이 표시되는 순서
2. **특이성**: 가장 일치하는 CSS 선택자를 결정하는 알고리즘
3. **오리진**: CSS가 나타나는 순서와 출처, 브라우저 스타일인지, 브라우저 확장 프로그램의 CSS인지, 작성한 CSS인지 여부
4. **중요도**: 몇몇 CSS 규칙은 특히 `!important` 규칙 유형의 경우 다른 규칙보다 가중치가 더 높습니다.

## 등장의 위치와 순서

CSS 규칙이 표시되는 순서와 표시 방법은 충돌 해결을 계산하는 동안 캐스케이드에서 고려됩니다.

이 강의 시작 부분에 있는 데모는 위치의 가장 간단한 예입니다. 동일한 특이성의 선택자를 갖는 두 가지 규칙이 있으므로 선언된 마지막 규칙이 이깁니다.

`<link>` 태그, 임베드된 `<style>` 태그, `style` 속성에 정의된 인라인 CSS와 같은 HTML 페이지의 다양한 소스에서 가져올 수 있습니다.

HTML 페이지 상단에 CSS를 포함하는 `<link>`가 있는 경우 페이지 하단에 CSS를 포함하는 다른 `<link>`: 하위 `<link>`가 가장 구체적입니다. 임베드된 ` {style}` 요소에서도 동일한 현상이 발생합니다. 페이지 아래쪽으로 갈수록 구체화됩니다.

<figure>{% Codepen { user: 'web-dot-dev', id: 'NWdPaWv' } %}<figcaption> 버튼의 배경은 <code>&lt;link /&gt;</code> 요소에 의해 포함된 CSS에서 정의된 파란색입니다. 어둡게 설정하는 CSS 규칙은 두 번째 연결된 스타일시트에 있으며 이후 위치 때문에 적용됩니다.</figcaption></figure>

이 순서는 포함된 `<style>` 요소에도 적용됩니다. `<link>` 전에 선언된 경우 연결된 스타일시트의 CSS가 가장 구체적입니다.

<figure>{% Codepen { user: 'web-dot-dev', id: 'xxgbLoB' } %}<figcaption> <code>&lt;style&gt;</code> 요소는 <code>&lt;head&gt;</code>에 선언되고 <code> 요소는 &lt;code&gt;&amp;lt;body&amp;gt;</code>에 선언됩니다. <code>&lt;style&gt;</code> 요소보다 더 구체적임을 의미합니다.</figcaption></figure>

CSS가 선언된 인라인 `style` 속성은 선언에 `!important`가 정의되어 있지 않은 한 위치에 관계없이 다른 모든 CSS를 재정의합니다.

위치는 CSS 규칙의 순서로도 적용됩니다. `background: purple`이 마지막으로 선언되었기 때문에 요소의 배경이 보라색입니다. 녹색 배경은 보라색 배경보다 먼저 선언되었으므로 이제 브라우저에서 무시됩니다.

```css
.my-element {
  background: green;
  background: purple;
}
```

동일한 속성에 대해 두 개의 값을 지정할 수 있다는 것은 특정 값을 지원하지 않는 브라우저에 대한 대체를 생성하는 간단한 방법이 될 수 있습니다. 다음 예에서는 `font-size`가 두 번 선언됩니다. `clamp()`가 지원되면 이전 `font-size` 선언이 삭제됩니다. `clamp()`를 지원하지 않으면 초기 선언이 적용되고 font-size는 1.5rem이 됩니다.

```css
.my-element {
  font-size: 1.5rem;
  font-size: clamp(1.5rem, calc(1rem + 3vw), 2rem);
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'xxgbPMP' } %}</figure>

{% Aside %} 동일한 속성을 두 번 선언하는 이 접근 방식은 브라우저가 이해하지 못하는 값을 무시하기 때문에 작동합니다. 일부 다른 프로그래밍 언어와 달리 CSS는 구문 분석할 수 없는 행을 감지할 때 오류를 발생시키거나 프로그램을 중단하지 않습니다. 구문 분석할 수 없는 값은 유효하지 않으므로 무시됩니다. 그런 다음 브라우저는 이미 이해하고 있는 내용을 깨뜨리지 않고 나머지 CSS를 계속 처리합니다. {% endAside %}

{% Assessment 'position' %}

## 특이성

특정성은 가중치 또는 점수 시스템을 사용하여 계산을 수행하여 어떤 CSS 선택기가 가장 구체적인지를 결정하는 알고리즘입니다. 규칙을 보다 구체적으로 만들면 선택자와 일치하는 다른 CSS가 나중에 CSS에 나타나는 경우에도 규칙이 적용되도록 할 수 있습니다.

[다음 레슨](/learn/css/specificity)에서는 특이성이 계산되는 방법에 대한 세부 정보를 배울 수 있지만 몇 가지 사항을 염두에 두면 너무 많은 특이성 문제를 방지하는 데 도움이 됩니다.

요소의 클래스를 대상으로 하는 CSS는 해당 규칙을 보다 구체적으로 만들므로 요소만 대상으로 하는 CSS보다 적용하는 것이 더 중요합니다. 즉, 다음 CSS에서는 두 규칙이 모두 일치하고 `h1` 선택자에 대한 규칙이 스타일시트의 뒷부분에 나타나더라도 `h1`이 빨간색으로 바뀝니다.

```html
<h1 class="my-element">Heading</h1>
```

```css
.my-element {
  color: red;
}

h1 {
  color: blue;
}
```

`id`는 CSS를 더욱 구체적으로 만들므로 ID에 적용된 스타일은 다른 많은 방법으로 적용된 스타일을 재정의합니다. `id`에 스타일을 추가하는 것이 좋지 않은 이유 중 하나입니다. 해당 스타일을 다른 것으로 덮어쓰기가 어려울 수 있습니다.

### 특이성은 누적됨

다음 강의에서 알 수 있듯이 각 선택기 유형에는 특정 요소를 대상으로 하는 데 사용한 모든 선택기에 대한 점수가 함께 추가되어 구체적인 정도를 나타내는 점수가 부여됩니다. `a.my-class.another-class[href]:hover`와 같은 선택기 목록이 있는 요소를 대상으로 지정하면 다른 CSS로 덮어쓰기가 상당히 어려운 항목을 얻게 됩니다. 이러한 이유로 CSS를 보다 쉽게 재사용할 수 있도록 선택기를 가능한 한 단순하게 유지하는 것이 좋습니다. 필요할 때 요소를 가져오기 위한 도구로 특이성을 사용하지만 가능하면 항상 길고 구체적인 선택기 목록을 리팩토링하는 것을 고려하십시오.

## 오리진

작성한 CSS가 페이지에 적용된 유일한 CSS는 아닙니다. 캐스케이드는 CSS의 출처를 고려합니다. 이 출처에는 브라우저의 내부 스타일시트, 브라우저 확장 또는 운영 체제에 의해 추가된 스타일, 작성한 CSS가 포함됩니다. **이러한 기원의 특이성 순서**는 가장 덜 구체적인 것에서 가장 구체적인 것 순으로 다음과 같습니다.

1. **사용자 에이전트 기본 스타일**. 브라우저가 기본적으로 HTML 요소에 적용하는 스타일입니다.
2. **로컬 사용자 스타일**. 이는 기본 글꼴 크기 또는 감소된 동작 기본 설정과 같은 운영 체제 수준에서 올 수 있습니다. 또한 사용자가 웹 페이지에 대한 사용자 정의 CSS를 작성할 수 있도록 하는 브라우저 확장과 같은 브라우저 확장에서 가져올 수도 있습니다.
3. **작성된 CSS**. 작성하는 CSS입니다.
4. **작성된 `!important`**. 작성한 선언에 추가하는 모든 `!important`.
5. **로컬 사용자 스타일 `!important`**. 운영 체제 수준 또는 브라우저 확장 수준 CSS에서 가져온 모든 `!important`.
6. **사용자 에이전트 `!important`**. 브라우저에서 제공하는 기본 CSS에 정의된 모든 `!important`.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/zPdaZ6G11oYrgJ78EfF7.svg", alt="목록에 설명된 원점 순서를 시각적으로 보여줍니다.", width="800", height="347" %}</figure>

사용자가 작성한 CSS에 `!important` 규칙 유형이 있고 사용자가 사용자 지정 CSS에 `!important` 규칙 유형이 있는 경우 누구의 CSS가 승리합니까?

{% Assessment 'origin' %}

## 중요성

모든 CSS 규칙이 서로 동일하게 계산되거나 서로 동일한 특이성이 부여되는 것은 아닙니다.

**중요성의 순서**는 가장 덜 중요한 것부터 가장 중요한 것 순으로 다음과 같습니다.

1. `font-size` , `background` 또는 `color`와 같은 일반 규칙 유형
2. `animation` 규칙 유형
3. `!important` 규칙 유형(원점과 동일한 순서를 따름)
4. `transition` 규칙 유형

활성 애니메이션 및 전환 규칙 유형은 일반 규칙보다 중요합니다. 전환의 경우 `!important` 규칙 유형보다 중요합니다. 애니메이션이나 전환이 활성화되면 예상되는 동작이 시각적 상태를 변경하기 때문입니다.

## DevTools를 사용하여 일부 CSS가 적용되지 않는 이유 알아보기

브라우저 DevTools는 일반적으로 요소와 일치할 수 있는 모든 CSS를 표시하고 사용되지 않는 CSS는 긋습니다.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/Z6aLsqcqjGAUsWzq7DZs.png", alt="덮어쓴 CSS가 지워진 브라우저 DevTools의 이미지", width="800", height="446" %}</figure>

적용할 것으로 예상한 CSS가 전혀 나타나지 않으면 요소와 일치하지 않는 것입니다. 이 경우 클래스나 요소 이름의 오타나 잘못된 CSS 등 다른 곳을 찾아야 합니다.

{% Assessment 'conclusion' %}

## 참고자료

- [캐스케이드에 대한 고도로 상호 작용하는 설명자](https://wattenberger.com/blog/css-cascade)
- [MDN 캐스케이드 참조](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)
