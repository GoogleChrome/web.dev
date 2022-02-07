---
title: 선택기
description: |2

  요소에 CSS를 적용하려면 선택해야 합니다.
  CSS는 이를 수행하는 다양한 방법을 제공합니다.
  이 모듈에서 탐색할 수 있습니다.
audio:
  title: 'CSS 팟캐스트   - 002: 선택기'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_002_v2.0_FINAL.mp3?dest-id=1891556"
  thumbnail: image/forR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
---

기사의 첫 번째 단락인 경우에만 더 크게 빨간색으로 표시하고 싶은 텍스트가 있는 경우 어떻게 합니까?

```html
<article>
  <p>I want to be red and larger than the other text.</p>
  <p>I want to be normal sized and the default color.</p>
</article>
```

CSS 선택기를 사용하여 특정 요소를 찾고 다음과 같이 CSS 규칙을 적용합니다.

```css
article p:first-of-type {
  color: red;
  font-size: 1.5em;
}
```

CSS는 이와 같은 상황을 해결하는 데 도움이 되는 매우 단순한 것부터 매우 복잡한 것까지 요소를 선택하고 요소에 규칙을 적용할 수 있는 많은 옵션을 제공합니다.

{% Codepen { user: 'web-dot-dev', id: 'XWprGYz', height: 250 } %}

## CSS 규칙의 일부

선택기의 작동 방식과 CSS에서의 역할을 이해하려면 CSS 규칙의 일부를 아는 것이 중요합니다. CSS 규칙은 하나 이상의 선택자와 하나 이상의 선언을 포함하는 코드 블록입니다.

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/hFR4OOwyH5zWc5XUIcyu.svg", alt="선택기가 있는 CSS 규칙의 이미지 .my-css-rule", width="800", height="427" %}</figure>

이 CSS 규칙에서 **선택기**는 페이지에서 `my-css-rule` 클래스가 있는 모든 요소를 찾는 `.my-css-rule` 중괄호 안에 세 개의 선언이 있습니다. 선언은 선택자와 일치하는 요소에 스타일을 적용하는 속성 및 값 쌍입니다. CSS 규칙은 원하는 만큼 많은 선언과 선택기를 가질 수 있습니다.

## 단순 선택기

가장 간단한 선택기 그룹은 HTML 요소와 HTML 태그에 추가할 수 있는 클래스, ID 및 기타 속성을 대상으로 합니다.

### 범용 선택기

와일드카드라고도 하는 [범용 선택기](https://developer.mozilla.org/docs/Web/CSS/Universal_selectors)는 모든 요소와 일치합니다.

```css
* {
  color: hotpink;
}
```

이 규칙은 페이지의 모든 HTML 요소가 핫핑크 텍스트를 갖도록 합니다.

### 유형 선택기

[유형 선택기](https://developer.mozilla.org/docs/Web/CSS/Type_selectors)는 HTML 요소와 직접 일치합니다.

```css
section {
  padding: 2em;
}
```

이 규칙은 모든 `<section>` 요소가 모든 면에 `padding`의 `2em`을 갖게 합니다.

### 클래스 선택기

HTML은 `class` 속성에 정의된 하나 이상의 항목을 가질 수 있습니다. [클래스 선택기](https://developer.mozilla.org/docs/Web/CSS/Class_selectors)는 해당 클래스가 적용된 모든 요소와 일치합니다.

```html
<div class="my-class"></div>
<button class="my-class"></button>
<p class="my-class"></p>
```

클래스가 적용된 모든 요소는 빨간색으로 표시됩니다.

```css
.my-class {
  color: red;
}
```

`.`이 HTML이 **아닌** CSS에만 있는 방법을 알아두십시오. `.` 문자는 클래스 속성 멤버와 일치하도록 CSS 언어를 지시하기 때문입니다. 이는 특수 문자 또는 문자 집합이 선택기 유형을 정의하는 데 사용되는 CSS의 일반적인 패턴입니다.

`.my-class`의 클래스가 있는 HTML 요소는 다음과 같이 다른 클래스가 여러 개 있더라도 여전히 위의 CSS 규칙과 일치합니다.

```html
<div class="my-class another-class some-other-class"></div>
```

이는 CSS가 해당 클래스를 정확히 일치시키는 것이 아니라 정의된 클래스를 *포함*하는 `class` 속성을 찾기 때문입니다.

{% Aside %} 클래스 속성의 값은 원하는 거의 모든 것이 될 수 있습니다. 한 가지 알아두어야 할 사항은 `.1element`와 같은 숫자로 클래스(또는 ID)를 시작할 수 없다는 것입니다. [사양](https://www.w3.org/TR/CSS21/syndata.html#characters)에서 더 많은 내용을 읽을 수 있습니다. {% endAside %}

### ID 선택기

`id` 속성이 있는 HTML 요소는 해당 ID 값을 가진 페이지의 유일한 요소여야 합니다. 다음과 같이 [ID 선택기](https://developer.mozilla.org/docs/Web/CSS/ID_selectors)로 요소를 선택합니다.

```css
#rad {
  border: 1px solid blue;
}
```

이 CSS는 다음과 같이 `id`가 `rad`인 HTML 요소에 파란색 테두리를 적용합니다.

```html
<div id="rad"></div>
```

클래스 선택기 `.`과 와 유사합니다. `#` 문자를 사용하여 CSS가 뒤에 `id`와 일치하는 요소를 찾도록 지시합니다.

{% Aside %} `id` 인스턴스를 두 개 이상 발견하면 선택기와 일치하는 CSS 규칙을 계속 적용합니다. `id` 속성이 있는 모든 요소에는 고유한 값이 있어야 하므로 단일 요소에 대해 매우 구체적인 CSS를 작성하지 않는 한 `id` 선택기로 스타일을 적용하는 것은 재사용할 수 없음을 의미하므로 피하십시오. 다른 곳에서는 다시 사용할 수 없다는 뜻입니다. {% endAside %}

### 속성 선택기

[속성 선택기](https://developer.mozilla.org/docs/Web/CSS/Attribute_selectors)를 사용하여 특정 HTML 속성이 있거나 HTML 속성에 대한 특정 값이 있는 요소를 찾을 수 있습니다. 대괄호 (`[ ]`)로 묶어 CSS가 속성을 찾도록 지시합니다.

```css
[data-type='primary'] {
  color: red;
}
```

이 CSS는 다음과 같이 `primary` 값을 가진 `data-type` 속성이 있는 모든 요소를 찾습니다.

```html
<div data-type="primary"></div>
```

`data-type`의 특정 값을 찾는 대신 값에 관계없이 속성이 있는 요소를 찾을 수도 있습니다.

```css
[data-type] {
  color: red;
}
```

```html
<div data-type="primary"></div>
<div data-type="secondary"></div>
```

이 `<div>` 요소는 모두 빨간색 텍스트를 갖습니다.

`s` 연산자를 추가하여 대소문자를 구분하는 속성 선택기를 사용할 수 있습니다.

```css
[data-type='primary' s] {
  color: red;
}
```

HTML 요소에 `primary` 대신 `Primary`의 `data-type`가 있던 경우, 빨간색 텍스트를 얻지 않습니다. `i` 연산자를 사용하여 반대(대소문자 구분 안함)를 수행할 수 있습니다.

대소문자 연산자와 함께 속성 값 내의 문자열 부분과 일치하는 연산자에 액세스할 수 있습니다.

```css
/* A href that contains "example.com" */
[href*='example.com'] {
  color: red;
}

/* A href that starts with https */
[href^='https'] {
  color: green;
}

/* A href that ends with .com */
[href$='.com'] {
  color: blue;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'BapBbOy' } %}<figcaption>이 데모에서 속성 선택기의 '$' 연산자는 'href' 속성에서 파일 유형을 가져옵니다. 이렇게 하면 의사 요소를 사용하여 해당 파일 유형에 따라 레이블에 접두사를 붙일 수 있습니다.</figcaption></figure>

### 그룹화 선택기

선택기는 하나의 요소만 일치시킬 필요는 없습니다. 여러 선택기를 쉼표로 구분하여 그룹화할 수 있습니다.

```css
strong,
em,
.my-class,
[lang] {
  color: red;
}
```

이 예는 색상 변경을 `<strong>` 요소와 `<em>` 요소 모두로 확장합니다. `.my-class`라는 크래스와 `lang` 속성이 있는 요소로 확장됩니다.

{% Assessment 'simple-selectors' %}

## 가짜 클래스 및 가짜 요소

CSS는 요소를 가리켰을 때, 요소 *내부*의 구조 또는 요소의 일부와 같은 특정 플랫폼 상태에 초점을 맞춘 유용한 선택기 유형을 제공합니다.

### 가짜 클래스

HTML 요소는 상호 작용하거나 자식 요소 중 하나가 특정 상태에 있기 때문에 다양한 상태에 있습니다.

예를 들어 사용자가 HTML 요소를 마우스 포인터로 가리킬 *수 있거나* 하위 요소를 사용자가 가리킬 수도 있습니다. 이러한 상황에서는 `:hover` 가짜 클래스를 사용하십시오.

```css
/* Our link is hovered */
a:hover {
  outline: 1px dotted green;
}

/* Sets all even paragraphs to have a different background */
p:nth-child(even) {
  background: floralwhite;
}
```

[가짜 클래스 모듈](/learn/css/pseudo-classes)에서 자세히 알아보십시오.

### 가짜 요소

의사 요소는 플랫폼 상태에 응답하는 대신 CSS로 새 요소를 삽입하는 것처럼 작동하기 때문에 의사 클래스와 다릅니다. 콜론(`:`)을 사용하는 대신 이중 콜론(`::`)을 사용하기 때문에 가짜 클래스와 구문적으로 다릅니다.

{% Aside %} 이중 콜론(`::`)은 유사 요소를 유사 클래스와 구별하지만 이러한 구분이 CSS 사양의 이전 버전에는 없었기 때문에 브라우저는 IE8과 같은 이전 브라우저와의 이전 버전 호환성을 돕기 위해 `:before` 및 `:after` 이후와 같은 원래 유사 요소에 대한 단일 콜론을 지원합니다. {% endAside %}

```css
.my-element::before {
  content: 'Prefix - ';
}
```

링크 레이블에 파일 유형을 접두사로 붙인 위의 데모에서와 같이 `::before` 가짜 요소를 사용하여 **요소 시작 부분**에 내용을 삽입하거나 `::after` 가짜 요소를 사용하여 내용을 **요소의 끝**에 삽입합니다.

가짜 요소는 콘텐츠 삽입에만 국한되지 않습니다. 요소의 특정 부분을 대상으로 지정하는 데 사용할 수도 있습니다. 예를 들어 목록이 있다고 가정합니다. `::marker`를 사용하여 목록의 각 글머리 기호(또는 번호)의 스타일을 지정합니다.

```css
/* Your list will now either have red dots, or red numbers */
li::marker {
  color: red;
}
```

또한, `::selection`을 사용하여 사용자가 강조 표시한 콘텐츠의 스타일을 지정할 수도 있습니다.

```css
::selection {
  background: black;
  color: white;
}
```

[가짜 요소에 대한 모듈](/learn/css/pseudo-elements)에서 자세히 알아보십시오.

{% Assessment 'pseudo-selectors' %}

## 복잡한 선택기

이미 방대한 선택기를 보았지만 때로는 CSS를 사용하여 *보다 세밀한 제어가 필요할 것입니다.* 여기에서 복잡한 선택기가 도움을 주기 위해 개입합니다.

이 시점에서 다음 선택자가 더 많은 권한을 제공하지만 하위 요소를 선택하여 **아래쪽으로만 계단식으로 이동**할 수 있다는 점을 기억할 가치가 있습니다. 위쪽을 대상으로 하고 상위 요소를 선택할 수 없습니다. 캐스케이드가 무엇이며 어떻게 작동하는지 [이후 강의](/learn/css/the-cascade)에서 다룹니다.

### 결합기

결합자는 두 선택기 사이에 있는 것입니다. 예를 들어 선택기가 `p > strong`이면 결합기는 `>` 문자입니다. 이러한 결합기를 사용하는 선택기는 문서에서의 위치에 따라 항목을 선택하는 데 도움이 됩니다.

#### 하위 결합기

하위 결합기를 이해하려면 먼저 상위 요소와 하위 요소를 이해해야 합니다.

```html
<p>A paragraph of text with some <strong>bold text for emphasis</strong>.</p>
```

상위 요소는 텍스트를 포함하는 `<p>`입니다. `<p>` 요소 내부는 `<strong>` 요소이며, 내용을 굵게 만듭니다. `<p>` 안에 있기 때문에 하위 요소입니다.

하위 결합기를 사용하면 자식 요소를 대상으로 지정할 수 있습니다. 이것은 공백(` `) 브라우저가 하위 요소를 찾도록 지시합니다.

```css
p strong {
  color: blue;
}
```

이 스니펫은 `<p>` 요소의 하위 요소인 모든 `<strong>` 요소만 선택하여 반복해서 파란색으로 만듭니다.

<figure>{% Codepen { user: 'web-dot-dev', id: 'BapBbGN' } %}<figcaption>하위 결합기는 반복적이기 때문에 각 하위 요소에 추가된 패딩이 적용되어 결과적으로 시차 효과가 발생합니다.</figcaption></figure>

이 효과는 위의 예에서 결합 선택기 `.top div`를 사용하여 더 잘 시각화됩니다. 해당 CSS 규칙은 해당 `<div>` 요소에 왼쪽 패딩을 추가합니다. 결합기는 반복적이기 때문에 `.top`에 있는 `<div>` 요소에는 동일한 패딩이 적용됩니다.

이 데모의 HTML 패널을 보면 `.top` 요소 자체에 `<div>` 하위 요소가 있는 여러 `<div>` 하위 요소가 어떻게 있는지 알 수 있습니다.

#### 다음 형제 결합기

선택기에서 `+` 문자를 사용하여 다른 요소 바로 다음에 오는 요소를 찾을 수 있습니다.

{% Codepen { user: 'web-dot-dev', id: 'JjEPzwB' } %}

`.top`의 하위 요소의 **다음 형제**인 *경우에만* 다음 형제 결합기를 사용하여 공간을 추가하십시오.

다음 선택기를 사용하여 `.top`의 모든 하위 요소에 여백을 추가할 수 있습니다.

```css
.top * {
  margin-top: 1em;
}
```

`.top`의 모든 하위 요소를 선택하기 때문에 이 규칙이 잠재적으로 불필요한 추가 공간을 생성한다는 것입니다. **범용 선택기**와 혼합된 **다음 형제 결합기**는 공간을 확보하는 요소를 제어할 수 있을 뿐만 아니라 **모든 요소**에 공간을 적용할 수 있습니다. `.top`에 어떤 HTML 요소가 표시되는지에 관계없이 장기적인 유연성을 제공합니다.

#### 후속 형제 결합기

후속 결합기는 다음 형제 선택기와 매우 유사합니다. `+` 문자 대신 `~` 문자를 사용하십시오. 이것이 다른 점은 요소가 동일한 부모를 가진 다음 요소가 아니라 동일한 부모를 가진 다른 요소를 따라야 한다는 것입니다.

<figure>{% Codepen { user: 'web-dot-dev', id: 'ZELzPPX', height: 400 } %}<figcaption>후속 선택기를 `:checked` 가짜 클래스와 함께 사용하여 순수 CSS 스위치 요소를 만듭니다.</figcaption></figure>

이 후속 결합기는 강성이 약간 낮아 위의 샘플과 같은 상황에서 유용하며, 관련 확인란이 `:checked` 상태일 때 사용자 지정 스위치의 색상을 변경합니다.

#### 하위 결합기…

하위 결합기(직계 하위 항목이라고도 함)를 사용하면 결합기 선택기와 함께 제공되는 반복에 대한 제어 능력을 높일 수 있습니다. `>` 문자를 사용하면 결합기 선택기가 직계 하위 항목**에만** 적용되도록 제한할 수 있습니다.

이전의 다음 형제 선택기 예를 고려하십시오. **공백은 다음 형제** 각각에 추가되지만 해당 요소 중 하나에 **다음 형제 요소**도 하위로 있으면 바람직하지 않은 추가 공백이 발생할 수 있습니다.

{% Codepen { user: 'web-dot-dev', id: 'ExZYMJL' } %}

이 문제를 완화하려면 하위 결합기를 통합하도록 **다음 형제 선택기**를 `> * + *`로 바꾸십시오. 이제 이 규칙은 `.top`의 직계 하위**에만** 적용됩니다.

{% Codepen { user: 'web-dot-dev', id: 'dyNbrEr' } %}

### 복합 선택기

선택기를 결합하여 특이성과 가독성을 높일 수 있습니다. 예를 들어, `.my-class` 클래스도 포함하는 `<a>` 요소를 대상으로 하려면 다음을 작성하십시오.

```css
a.my-class {
  color: red;
}
```

이것은 모든 링크에 빨간색이 적용되는 것은 아니며 `<a>` 요소일 **경우** `.my-class`에만 빨간색이 적용됩니다. 자세한 내용은 [사양 모듈](/learn/css/specificity)을 참조하십시오.

{% Assessment 'complex-selectors' %}

## 참고 자료

- [CSS 선택기 참조](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors)
- [대화형 선택기 게임](https://flukeout.github.io/)
- [가짜 클래스 및 가짜 요소 참조](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements)
- [CSS 선택기를 일반 영어 설명자로 변환하는 도구](https://kittygiraudel.github.io/selectors-explained/)
