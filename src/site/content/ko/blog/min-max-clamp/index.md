---
title: 'min(), max() 및 clamp(): 오늘날 사용할 수 있는 세 가지 논리적 CSS 함수'
subhead: 잘 지원되는 CSS 기능을 사용하여 요소 크기를 제어하고 적절한 간격을 유지하며 유동적인 타이포그래피를 구현하는 방법을 알아보세요.
authors:
  - una
date: 2020-10-14
hero: image/admin/aVL3BEXD3AF9fFzPGKMf.jpg
alt: 책상 위에 놓인 도구 세트입니다.
description: 최소, 최대 및 클램프는 더 적은 코드를 사용하여 더 반응적인 스타일을 가능하게 하는 몇 가지 강력한 CSS 기능을 제공합니다. 이 게시물은 잘 지원되는 CSS 수학 함수를 사용하여 요소 크기를 제어하고 적절한 간격을 유지하며 유동적인 타이포그래피를 구현하는 방법에 대해 설명합니다.
tags:
  - blog
  - css
  - layout
feedback:
  - api
---

반응형 디자인이 진화하고 점점 더 미묘해짐에 따라 CSS도 끊임없이 진화하고 작성자에게 향상된 제어 기능을 제공합니다. [`min()`](https://developer.mozilla.org/docs/Web/CSS/min) , [`max()`](https://developer.mozilla.org/docs/Web/CSS/max) 및 [`clamp()`](https://developer.mozilla.org/docs/Web/CSS/clamp) 함수는 웹사이트와 앱을 보다 동적이고 반응적으로 제작할 수 있는 최신 도구입니다.

유연하고 유동적인 타이포그래피, 제어된 요소 크기 조정 및 적절한 간격 유지와 관련하여 `min()` , `max()` 및 `clamp()`가 도움이 될 수 있습니다.

## 배경

<blockquote>
  <p>수학 함수인 <code>calc()</code> , <code>min()</code> , <code>max()</code> 및 <code>clamp()</code> 사용하면 덧셈(+), 뺄셈(-), 곱셈(*) 및 나눗셈(/)이 있는 수학 표현식을 구성 요소 값으로 사용할 수 있습니다.</p>
  <cite><p data-md-type="paragraph"><a href="https://www.w3.org/TR/css-values-4/#calc-notation">CSS 값 및 단위 레벨 4</a></p></cite>
</blockquote>

Safari는 2019년 4월에 완전한 기능 세트를 최초로 [출시](https://bugs.webkit.org/show_bug.cgi?id=167000) 했으며, 그해 후반에 Chromium이 버전 79를 출시했습니다. 올해 Firefox [75](https://bugzilla.mozilla.org/show_bug.cgi?id=1519519)가 출시되면서 모든 브라우저가 `min()`, `max()` 및 `clamp()`를 지원하게 되었습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZIgePP41Quh7ubYh54vo.png", alt="", width="800", height="246" %} <figcaption> <a href="https://caniuse.com/css-math-functions">Caniuse</a> 지원 테이블. </figcaption></figure>

## 사용 방법

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-demo.mp4">
  </source></video>
  <figcaption>min() 함수가 옵션 목록과 그 부모를 기반으로 값을 선택하는 방법을 보여줍니다. <a href="https://codepen.io/una/pen/rNeGNVL">Codepen의 데모를 참조하십시오.</a></figcaption></figure>

적절한 경우 CSS 표현식의 오른쪽에 `min()` , `max()` 및 `clamp()` 를 사용할 수 있습니다. `min()` 및 `max()`의 경우 값의 인수 목록을 제공하고 브라우저는 각각 가장 작은 값 또는 가장 큰 값을 결정합니다. 예를 들어 `min(1rem, 50%, 10vw)`의 경우 브라우저는 이러한 상대 단위 중 가장 작은 단위를 계산하고 해당 값을 실제 값으로 사용합니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/max-demo.mp4">
  </source></video>
  <figcaption>max() 함수가 옵션 목록과 그 부모를 기반으로 값을 선택하는 방법을 보여줍니다. <a href="https://codepen.io/una/pen/RwaZXqR">Codepen의 데모를 참조하십시오.</a></figcaption></figure>

`max()` 함수는 쉼표로 구분된 표현식 목록에서 가장 큰 값을 선택합니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/clamp-demo.mp4">
  </source></video>
  <figcaption>clamp() 함수가 옵션 목록과 그 부모를 기반으로 값을 선택하는 방법을 보여줍니다. <a href="https://codepen.io/una/pen/bGpoGdJ">Codepen의 데모를 참조하십시오.</a></figcaption></figure>

`clamp()`를 사용하려면 최소값, 이상적인 값(계산할 값) 및 최대값의 세 가지 값을 입력합니다.

이러한 함수는 `<length>` , `<frequency>` , `<angle>` , `<time>` , `<percentage>` , `<number>` 또는 `<integer>` 가 허용되는 모든 곳에서 사용할 수 있습니다. 이러한 함수는 단독으로 사용하거나(예: `font-size: max(0.5vw, 50%, 2rem)`), `calc()`와 함께 사용하거나(i.e. `font-size: max(calc(0.5vw - 1em), 2rem)`), 구성하여 사용할 수 있습니다((i.e. `font-size: max(min(0.5vw, 1em), 2rem)`).

{% Aside %} `min()` 내부에서 계산하는 경우 `max()`, `clamp()` 또는 `calc()` 호출을 제거할 수 있습니다. 예를 들어 `font-size: max(calc(0.5vw - 1em), 2rem)`는 `font-size: max(0.5vw - 1em, 2rem)`와 동일합니다. {% endAside %}

요약:

- `min(<value-list>)`: 쉼표로 구분된 표현식 목록에서 가장 작은 값을 선택합니다.
- `max(<value-list>)`: 쉼표로 구분된 표현식 목록에서 가장 큰 값을 선택합니다.
- `clamp(<min>, <ideal>, <max>)`: 설정된 이상적인 값을 기준으로 상한과 하한 사이의 값을 고정합니다.

몇 가지 예를 살펴보겠습니다.

## 완벽한 너비

로버트 브링허스트(Robert Bringhurst)의 [타이포그래피 스타일의 요소(Elements of Typographic Style)](http://webtypography.net/2.1.2#:~:text=%E2%80%9CAnything%20from%2045%20to%2075,is%2040%20to%2050%20characters.%E2%80%9D)에 따르면 "텍스트 사이즈가 설정되고 세리프 텍스트 페이스를 사용하는 단일 열 페이지에서 가장 이상적인 줄 당 길이는 45자자에서 75자로 간주된다."고 합니다

텍스트 블록이 45자보다 좁거나 75자보다 넓지 않도록 하려면 `clamp()` 및 `ch`(0-width [character advance](https://developer.mozilla.org/docs/Web/CSS/length)) 단위를 사용하십시오.

```css
p {
  width: clamp(45ch, 50%, 75ch);
}
```

이렇게 하면 브라우저가 단락의 너비를 결정할 수 있습니다. 50%의 너비가 `45ch`보다 작은 경우가 아니면 너비를 50%로 설정하며 작은 경우 `45ch`가 선택됩니다. 50%가 `75ch`보다 넓은 경우도 동일합니다. 이 데모에서는 카드 자체가 고정됩니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/clamp-width.mp4">
  </source></video>
  <figcaption>clamp() 함수를 사용하여 최소 및 최대 너비를 제한합니다. <a href="https://codepen.io/una/pen/QWyLxaL">Codepen의 데모를 참조하십시오.</a></figcaption></figure>

`min()` 또는 `max()` 함수로 이것을 분해할 수 있습니다. 요소의 너비가 `50%`이고 `75ch` 를 초과하지 않도록 하려면(즉, 더 큰 화면에서) 다음과 같이 코드를 작성하세요. `width: min(75ch, 50%);`. 이는 `min()` 함수를 사용하여 "최대" 크기를 설정합니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/max-width.mp4">
  </source></video>
  <figcaption>clamp() 함수를 사용하여 최소 및 최대 너비를 제한합니다.</figcaption></figure>

`max()` 함수를 사용하여 읽을 수 있는 텍스트의 최소 크기를 확인할 수 있습니다. 이것은 다음과 같을 것입니다: `width: max(45ch, 50%);`. 여기서 브라우저는 `45ch` 또는 `50%` 중 더 큰 것을 선택합니다. 이는 요소가 *최소한* `45ch` 이상이어야 함을 의미합니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-width.mp4">
  </source></video>
  <figcaption>clamp() 함수를 사용하여 최소 및 최대 너비를 제한합니다.</figcaption></figure>

## 패딩 관리

`min()` 함수가 "최대" 값을 설정하고 `max()` 가 "최소" 값을 설정하는 위와 같은 개념을 사용하여 `max()`로 최소 패딩 크기를 설정할 수 있습니다. 이 예제는 [CSS Tricks](https://css-tricks.com/using-max-for-an-inner-element-max-width/)에서 가져온 것입니다. 여기에서 독자 Caluã de Lacerda Pataca는 다음과 같은 아이디어를 공유했습니다. 요소가 더 큰 화면 크기에서 추가 패딩을 가질 수 있도록 하고 특히 인라인 패딩에서 더 작은 화면 크기에서는 최소 패딩을 유지하는 것입니다. 이를 달성하려면 `calc()`을 사용하고 양쪽에서 최소 패딩을 뺍니다. `calc((100vw - var(--contentWidth)) / 2)`, *혹은* max를 사용하세요. `max(2rem, 50vw - var(--contentWidth) / 2)`. 합치면 이렇게 됩니다.

```css
footer {
  padding: var(--blockPadding) max(2rem, 50vw - var(--contentWidth) / 2);
}
```

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/min-padding.mp4">
  </source></video>
  <figcaption>max() 함수를 사용하여 구성 요소에 대한 최소 패딩을 설정합니다. <a href="https://codepen.io/chriscoyier/pen/qBZqNKa">Codepen의 데모를 참조하십시오.</a></figcaption></figure>

## 유동적인 타이포그래피

[유동적인 타이포그래피](https://www.smashingmagazine.com/2016/05/fluid-typography/)를 가능하게 하기 위해 [Mike Riethmeuller](https://twitter.com/mikeriethmuller)는 `calc()` 함수를 사용하여 최소 글꼴 크기, 최대 글꼴 크기를 설정하고 최소에서 최대로 크기 조정을 허용하는 기술을 대중화했습니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/min-max-clamp/fliud-type.mp4">
  </source></video>
  <figcaption>clamp()를 사용하여 유동적인 타이포그래피를 만듭니다. <a href="https://codepen.io/una/pen/ExyYXaN">Codepen의 데모를 참조하십시오.</a></figcaption></figure>

`clamp()`를 사용하면 이것을 더 명확하게 작성할 수 있습니다. 복잡한 문자열을 요구하는 대신 브라우저가 작업을 수행할 수 있습니다. 허용되는 최소 글꼴 크기(예 `1.5rem`), 최대 크기(예: `3rem`) 및 이상적인 크기로 `5vw`를 설정 합니다.

이제 훨씬 더 간결한 코드를 사용하여 제한적인 최소값과 최대값에 도달할 때까지 페이지의 표시 영역 너비에 따라 크기가 조정되는 타이포그래피를 얻습니다.

```css
p {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

{% Aside 'warning' %} `max()` 또는 `clamp()`로 얻을 수 있는 텍스트의 크기를 제한하면 [1.4.4 텍스트 크기 조정(AA)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=144#resize-text)에 따라 WCAG 오류가 발생할 수 있습니다. 사용자가 텍스트를 원래 크기의 200%로 조정할 수 없기 때문입니다. [확대/축소로 결과를 테스트](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html)하십시오. {% endAside %}

## 결론

CSS 수학 함수인 `min()` , `max()` 및 `clamp()`는 매우 강력하고 잘 지원되며 반응형 UI를 구축하는 데 도움이 될 수 있습니다. 더 많은 리소스를 보려면 다음을 확인하세요.

- [MDN의 CSS 값 및 단위](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS 값 및 단위 레벨 4 사양](https://www.w3.org/TR/css-values-4/)
- [CSS Trick: 내부 요소 너비에 대한 기사](https://css-tricks.com/using-max-for-an-inner-element-max-width/)
- [Ahmad Shadeed: min(), max(), clamp() 살펴보기](https://ishadeed.com/article/css-min-max-clamp/)

[Unsplash의 @yer_a_wizard](https://unsplash.com/@yer_a_wizard) 표지 이미지.
