---
layout: post
title: "CSS ::marker를 사용한 맞춤 글머리 기호"
subhead: 이제 <ul> 또는 <ol>을 사용할 때 숫자나 글머리 기호의 색상, 크기 또는 유형을 사용자 지정하는 것이 간단합니다.
authors:
  - adamargyle
  - loirooriol
description: 이제 <ul> 또는 <ol>을 사용할 때 숫자나 글머리 기호의 색상, 크기 또는 유형을 사용자 지정하는 것이 간단합니다.
tags:
  - blog
  - css
date: 2020-09-02
updated: 2020-09-02
scheduled: 'true'
hero: image/admin/GPGTyXJOh0cH0wa1PvXH.png
thumbnail: image/admin/jbdOq0tGGzobMtaBsajn.png
alt: 글머리 기호와 텍스트 주위에 별도의 상자를 넣어 단일 목록 항목의 구조 표시
feedback:
  - api
---

Bloomberg가 후원하는 Igalia 덕분에 마침내 스타일링 목록을 쉽게 처리할 수 있습니다. 보세요!

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOmqXrog0YoriZqqIzEZ.png", alt="", width="665", height="384" %} <figcaption> <a href="https://glitch.com/edit/#!/marker-fun-example">소스 보기</a> </figcaption></figure>

[CSS `::marker`](https://www.w3.org/TR/css-lists-3/#marker-pseudo) 덕분에 글머리 기호와 숫자의 내용과 일부 스타일을 변경할 수 있습니다.

## 브라우저 호환성

`::marker`는 데스크톱 및 Android용 Firefox, 데스크톱 Safari 및 iOS Safari(`color` 및 `font-*` 속성만 해당: [버그 204163](https://bugs.webkit.org/show_bug.cgi?id=204163) 참조), Chromium 기반 데스크톱 및 Android 브라우저에서 지원됩니다. 업데이트는 MDN의 [브라우저 호환성](https://developer.mozilla.org/docs/Web/CSS/::marker#Browser_compatibility) 표를 참조하십시오.

## 의사 요소

다음 필수 HTML 정렬되지 않은 목록을 고려하십시오.

```html
<ul>
  <li>Lorem ipsum dolor sit amet consectetur adipisicing elit</li>
  <li>Dolores quaerat illo totam porro</li>
  <li>Quidem aliquid perferendis voluptates</li>
  <li>Ipsa adipisci fugit assumenda dicta voluptates nihil reprehenderit consequatur alias facilis rem</li>
  <li>Fuga</li>
</ul>
```

결과적으로 다음과 같은 놀라운 렌더링이 발생합니다.

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-plain-list?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

`<li>` 항목의 시작 부분에 있는 점은 공짜입니다! 브라우저는 생성된 마커 상자를 그리고 생성합니다.

오늘 우리는 브라우저가 생성하는 글머리 기호 요소의 스타일을 지정하는 기능을 제공하는 `::marker`의사 요소에 대해 이야기하게 되어 기쁩니다.

{% Aside 'key-term' %} 의사 요소는 문서 트리에 존재하지 않는 문서의 요소를 나타냅니다. 예를 들어, 해당 텍스트 줄을 감싸는 HTML 요소가 없더라도 `p::first-line`을 사용하여 단락의 첫 번째 줄을 선택할 수 있습니다. {% endAside %}

### 마커 만들기

`::marker` 의사 요소 마커 상자는 모든 목록 항목 요소 내에서 실제 내용과 `::before` 의사 요소 앞에 자동으로 생성됩니다.

```css
li::before {
  content: "::before";
  background: lightgray;
  border-radius: 1ch;
  padding-inline: 1ch;
  margin-inline-end: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 340px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-before-example?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

일반적으로 목록 항목은 `<li>` HTML 요소입니다. 그러나 다른 요소도 `display: list-item`을 사용하면 목록 항목이 될 수 있습니다.

```html
<dl>
  <dt>Lorem</dt>
  <dd>Lorem ipsum dolor sit amet consectetur adipisicing elit</dd>
  <dd>Dolores quaerat illo totam porro</dd>

  <dt>Ipsum</dt>
  <dd>Quidem aliquid perferendis voluptates</dd>
</dl>
```

```css/1
dd {
  display: list-item;
  list-style-type: "🤯";
  padding-inline-start: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-definition-list?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### 마커 스타일링

`::marker` 전까지는 `list-style-type` 및 `list-style-image`를 사용하여 목록 스타일을 지정하고 CSS 한 줄로 목록 항목 기호를 변경할 수 있었습니다.

```css
li {
  list-style-image: url(/right-arrow.svg);
  /* OR */
  list-style-type: '👉';
  padding-inline-start: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-list-style-type?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

이것도 편리하지만 더 많은 것이 필요합니다. 색상, 크기, 간격 등을 변경하는 것은 어떨까요? 바로 그럴 때 `::marker`를 쓸 수 있습니다. CSS에서 이러한 유사 요소의 개별 및 전역 타겟팅을 허용합니다.

```css
li::marker {
  color: hotpink;
}

li:first-child::marker {
  font-size: 5rem;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-style-introduction?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

{% Aside 'caution' %} 위 목록에 분홍색 글머리 기호가 없다면 `::marker`가 지원되지 않는 것입니다. {% endAside %}

`list-style-type` 속성은 매우 제한된 스타일 가능성을 제공합니다. `::marker` 의사 요소는 마커 자체를 대상으로 하고 스타일을 직접 적용할 수 있음을 의미합니다. 이것은 훨씬 더 많은 제어를 허용합니다.

`::marker`에서 모든 CSS 속성을 사용할 수는 없습니다. 허용되는 속성과 허용되지 않는 속성 목록은 사양에 명확하게 표시되어 있습니다. 이 의사 요소로 흥미로운 것을 시도했지만 작동하지 않는 경우 아래에서 CSS로 수행할 수 있는 작업과 수행할 수 없는 작업에 대한 지침을 참조하세요.

#### 허용된 CSS `::marker` 속성

- `animation-*`
- `transition-*`
- `color`
- `direction`
- `font-*`
- `content`
- `unicode-bidi`
- `white-space`

`::marker`의 내용 변경은 `list-style-type`이 아닌 `content`으로 수행됩니다. 이 예시의 첫 번째 항목은 `list-style-type`을 사용하여 스타일이 지정되고 두 번째 항목은 `::marker`로 스타일이 지정됩니다. 첫 번째 경우의 속성은 마커뿐만 아니라 전체 목록 항목에 적용됩니다. 즉, 텍스트와 마커에 애니메이션이 적용됩니다. `::marker`를 사용할 때 텍스트가 아닌 마커 상자만 대상으로 지정할 수 있습니다.

또한 허용되지 않는 `background` 속성이 어떻게 영향을 미치지 않는지 확인하십시오.

<div class="switcher">{% Compare 'worse', 'List Styles' %} ```css li:nth-child(1) { list-style-type: '?'; font-size: 2rem; background: hsl(200 20% 88%); animation: color-change 3s ease-in-out infinite; } ```</div>
<p data-md-type="paragraph">{% CompareCaption %} 마커와 목록 항목 간의 혼재된 결과 {% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'better', 'Marker Styles' %}</p>
<pre data-md-type="block_code" data-md-language="css"><code class="language-css">li:nth-child(2)::marker {
  content: '!';
  font-size: 2rem;
  background: hsl(200 20% 88%);
  animation: color-change 3s ease-in-out infinite;
}
</code></pre>
<p data-md-type="paragraph">{% CompareCaption %} 마커와 목록 항목 간의 초점이 맞춰진 결과 {% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

<br>

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-style-vs-list-style-type?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

{% Aside 'gotchas' %} Chromium에서 `white-space`는 위치 지정 마커 내부에만 작동합니다. 외부 위치 마커의 경우 스타일 조정자는 후행 공백을 유지하기 위해 `white-space: pre`를 강제합니다. {% endAside %}

#### 마커의 내용 변경

다음은 마커의 스타일을 지정할 수 있는 몇 가지 방법입니다.

**모든 목록 항목 변경**

```css
li {
  list-style-type: "😍";
}

/* OR */

li::marker {
  content: "😍";
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-change-all?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

**하나의 목록 항목만 변경**

```css
li:last-child::marker {
  content: "😍";
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-change-one?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

**목록 항목을 SVG로 변경**

```css
li::marker {
  content: url(/heart.svg);
  content: url(#heart);
  content: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='24' width='24'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='none' stroke='hotpink' stroke-width='3'/></svg>");
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-inline-svg?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

**번호 매기기 목록 변경** `<ol>`은 어떻까요? 정렬된 목록 항목의 마커는 기본적으로 글머리 기호가 아닌 숫자입니다. CSS에서는 이를 [Counters](https://developer.mozilla.org/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters)라고 하며 매우 강력합니다. 숫자가 시작하고 끝나는 위치를 설정 및 재설정하거나 로마 숫자로 전환하는 속성도 있습니다. 스타일을 지정할 수 있을까요? 예, 마커 콘텐츠 값을 사용하여 고유한 번호 매기기 프레젠테이션을 만들 수도 있습니다.

```css
li::marker {
  content: counter(list-item) "› ";
  color: hotpink;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-numbered-lists?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### 디버깅

Chrome DevTools는 `::marker` 의사 요소에 적용되는 스타일을 검사, 디버그 및 수정하는 데 도움을 줄 준비가 되어 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PYKVXEzycrMhQujXsNxQ.png", alt="DevTools가 사용자 에이전트 및 사용자 스타일의 스타일을 열고 표시합니다.", width="776", height="574", style="max-inline-size: 480px" %}</figure>

### 미래의 의사 요소 스타일링

::marker에 대한 자세한 내용은 다음에서 확인할 수 있습니다.

- [Smashing Magazine](https://www.smashingmagazine.com/)의 [CSS 목록, 마커 및 카운터](https://www.smashingmagazine.com/2019/07/css-lists-markers-counters/)
- [CSS-Tricks](https://css-tricks.com/)의 [CSS 카운터 및 CSS 그리드로 계산](https://css-tricks.com/counting-css-counters-css-grid/)
- [MDN](https://developer.mozilla.org/)의 [CSS 카운터 사용하기](https://developer.mozilla.org/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters)

지금까지 스타일링하기 어려웠던 것에 접근할 수 있어 좋습니다. 자동으로 생성된 다른 요소의 스타일을 지정할 수 있기를 원할 수 있습니다. 여러 브라우저에서 동일한 방식으로 구현되지 않는 `<details>` 또는 검색 입력 자동 완성 표시기에 불만이 있을 수 있습니다. 필요한 것을 공유하는 한 가지 방법은 [https://webwewant.fyi](https://webwewant.fyi)에서 원하는 것을 생성하는 것입니다.
