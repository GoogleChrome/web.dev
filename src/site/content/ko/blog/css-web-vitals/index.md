---
title: Web Vitals용 CSS
subhead: Web Vitals 최적화를 위한 CSS 관련 기술
authors:
  - katiehempenius
  - una
date: 2021-06-02
hero: image/j2RDdG43oidUy6AL6LovThjeX9c2/uq7JQlKJo7KBETXnVuTf.jpg
alt: 멀티 컬러 그라디언트
description: 이 문서에서는 Web Vitals를 최적화하기 위한 CSS 관련 기술을 다룹니다.
tags:
  - blog
  - performance
  - css
---

스타일을 작성하고 레이아웃을 작성하는 방식은 [핵심 성능 향상](/collection/)에 큰 영향을 미칠 수 있습니다. [이는 CLS(Cumulative Layout Shift)](/cls) 및 [LCP(Large Contentful Paint)](/lcp)에 특히 해당됩니다.

이 문서에서는 Web Vitals를 최적화하기 위한 CSS 관련 기술을 다룹니다. 이러한 최적화는 페이지의 다양한 측면(레이아웃, 이미지, 글꼴, 애니메이션, 로딩)으로 분류됩니다. 그 과정에서 [예제 페이지](https://codepen.io/una/pen/vYyLKvY)를 개선하는 방법을 살펴보겠습니다.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/pgmpMOmweK7BVBsVkQ5g.png", alt="예제 사이트의 스크린샷", width="800", height="646" %}

## 레이아웃

### DOM에 콘텐츠 삽입

주변 콘텐츠가 이미 로드된 후 페이지에 콘텐츠를 삽입하면 페이지의 다른 모든 항목이 아래로 밀려납니다. 이로 인해 [레이아웃이 변경](/cls/#layout-shifts-in-detail)됩니다.

[쿠키 알림](/cookie-notice-best-practices/), 특히 페이지 상단에 있는 쿠키 알림은 이 문제의 일반적인 예입니다. 로드할 때 이러한 유형의 레이아웃 이동을 자주 일으키는 다른 페이지 요소에는 광고 및 포함이 있습니다.

#### 식별

Lighthouse "대규모 레이아웃 변경 방지" 감사는 변경된 페이지 요소를 식별합니다. 이 데모의 경우 결과는 다음과 같습니다.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/jaHtgwzDXCjx3vAFOO33.png", alt="Lighthouse의 '대규모 레이아웃 변경 방지' 감사", width="800", height="500" %}

쿠키 알림이 로드될 때 쿠키 알림 자체가 이동하지 않기 때문에 쿠키 알림은 이러한 결과에 나열되지 않습니다. 오히려 페이지에서 그 아래에 있는 항목(즉, `div.hero` 및 `article`)이 이동합니다. 레이아웃 이동 식별 및 수정에 대한 자세한 내용은 [레이아웃 이동 디버깅](/debugging-layout-shifts)을 참조하십시오.

{% Aside %}

Lighthouse는 "페이지 로드" 이벤트까지만 페이지 성능을 분석합니다. 쿠키 배너, 광고 및 기타 위젯은 페이지가 로드될 때까지 로드되지 않는 경우가 있습니다. 이러한 레이아웃 변경은 Lighthouse에서 플래그를 지정하지 않은 경우에도 여전히 사용자에게 영향을 줍니다.

{% endAside %}

#### 수정

절대 위치 또는 고정 위치를 사용하여 페이지 하단에 쿠키 알림을 배치합니다.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/YBYLT9jJ9AXrbsaRNVoa.png", alt="페이지 하단에 쿠키 알림 표시", width="800", height="656" %}

이전:

```css
.banner {
  position: sticky;
  top: 0;
}
```

이후:

```css
.banner {
  position: fixed;
  bottom: 0;
}
```

이 레이아웃 이동을 수정하는 또 다른 방법은 화면 상단에 쿠키 알림을 위한 공간을 예약하는 것입니다. 이 접근 방식은 똑같이 효과적입니다. 자세한 내용은 [쿠키 공지 모범 사례](/cookie-notice-best-practices/)를 참조하십시오.

{% Aside %}

쿠키 알림은 로드될 때 레이아웃 이동을 유발하는 여러 페이지 요소 중 하나입니다. 이러한 페이지 요소를 자세히 살펴보는 데 도움이 되도록 후속 데모 단계에는 쿠키 알림이 포함되지 않습니다.

{% endAside %}

## 이미지

### 이미지 및 최대 내용이 포함된 페인트(LCP)

이미지는 일반적으로 페이지의 LCP(Large Contentful Paint) 요소입니다. [LCP 요소가 될 수 있는 다른 페이지 요소](/lcp/#what-elements-are-considered)에는 텍스트 블록 및 비디오 포스터 이미지가 있습니다. LCP 요소가 로드되는 시간에 따라 LCP가 결정됩니다.

페이지의 LCP 요소는 페이지가 처음 표시될 때 사용자에게 표시되는 콘텐츠에 따라 페이지 로드마다 다를 수 있습니다. 예를 들어, 이 데모에서 쿠키 알림의 배경, 영웅 이미지 및 기사 텍스트는 잠재적인 LCP 요소의 일부입니다.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/bMoAoohyLOgTqV6B7lHr.png", alt="다양한 시나리오에서 페이지의 LCP 요소를 강조하는 다이어그램.", width="800", height="498" %}

예시 사이트에서 쿠키 알림의 배경 이미지는 사실 큰 이미지입니다. LCP를 개선하려면 효과를 생성하기 위해 이미지를 로드하는 대신 CSS에서 그라디언트를 칠할 수 있습니다.

#### 수정

이미지 대신 CSS 그라디언트를 사용 `.banner` CSS를 변경합니다.

이전:

```css
background: url("https://cdn.pixabay.com/photo/2015/07/15/06/14/gradient-845701\_960\_720.jpg")
```

이후:

```css
background: linear-gradient(135deg, #fbc6ff 20%, #bdfff9 90%);
```

### 이미지 및 레이아웃 변경

브라우저는 이미지가 로드된 후에만 이미지의 크기를 결정할 수 있습니다. 페이지가 렌더링된 후 이미지 로드가 발생하지만 이미지를 위한 공간이 예약되지 않은 경우 이미지가 나타날 때 레이아웃 이동이 발생합니다. 데모에서 영웅 이미지가 로드될 때 레이아웃 이동을 일으키고 있습니다.

{% Aside %} 이미지 로드가 느린 상황(예: 연결 속도가 느리거나 파일 크기가 특히 큰 이미지를 로드할 때)에서 레이아웃 이동을 유발하는 이미지 현상이 더 분명합니다. {% endAside %}

#### 식별

`width`와 `height`가 없는 이미지를 식별하려면 Lighthouse의 "이미지 요소에 너비와 높이가 명시적" 감사를 사용합니다.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/wDGRVi7JaUOTjD9ODOk9.png", alt="Lighthouse의 '이미지 요소에 너비와 높이가 명시적'", width="800", height="274" %}

이 예에서 영웅 이미지와 기사 이미지 모두 `width`와 `height` 속성이 없습니다.

#### 수정

레이아웃 이동을 방지하려면 이러한 이미지 `width` 및 `height` 속성을 설정하십시오.

이전:

```html
<img src="https://source.unsplash.com/random/2000x600" alt="image to load in">
<img src="https://source.unsplash.com/random/800x600" alt="image to load in">
```

이후:

```html
<img src="https://source.unsplash.com/random/2000x600" width="2000" height="600" alt="image to load in">
<img src="https://source.unsplash.com/random/800x600" width="800" height="600" alt="image to load in">
```

<figure>{% Video src="video/j2RDdG43oidUy6AL6LovThjeX9c2/fLUscMGOlGhKnNHef2py.mp4" %} <figcaption> 이제 이미지가 레이아웃 이동 없이 로드됩니다.</figcaption></figure>

{% Aside %} 이미지를 로드하는 또 다른 방법은 `width` 및 `height` 속성 지정과 함께 [`srcset`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset) 및 [`sizes`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) 속성을 사용하는 것입니다. 이렇게 하면 다른 장치에 다른 크기의 이미지를 제공할 수 있는 추가적인 성능 이점이 있습니다. 자세한 내용은 [반응형 이미지 제공](/serve-responsive-images/)을 참조하십시오. {% endAside %}

## 글꼴

글꼴로 인해 텍스트 렌더링이 지연되고 레이아웃이 변경될 수 있습니다. 결과적으로 글꼴을 빨리 전달하는 것이 중요합니다.

### 지연된 텍스트 렌더링

기본적으로 브라우저는 연결된 웹 글꼴이 아직 로드되지 않은 경우 텍스트 요소를 즉시 렌더링하지 않습니다. 이것은 ["스타일이 지정되지 않은 텍스트의 플래시"(FOUT)](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)를 방지하기 위해 수행됩니다. 많은 상황에서 이로 인해 [FCP(First Contentful Paint)](/fcp)가 지연됩니다. 어떤 상황에서는 이것이 LCP(Large Contentful Paint)를 지연시킵니다.

{% Aside %}

기본적으로 Chromium 기반 및 Firefox 브라우저는 연결된 웹 글꼴이 로드되지 않은 경우 [최대 3초 동안 텍스트 렌더링을 차단](https://developers.google.com/web/updates/2016/02/font-display)합니다. Safari는 텍스트 렌더링을 무기한 차단합니다. [차단 기간](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#the_font_display_timeline)은 브라우저가 웹 글꼴을 요청할 때 시작됩니다. 차단 기간이 끝날 때까지 글꼴이 로드되지 않은 경우 브라우저는 대체 글꼴을 사용하여 텍스트를 렌더링하고 사용 가능한 경우 웹 글꼴로 교체합니다.

{% endAside %}

### 레이아웃 변경

글꼴 스와핑은 사용자에게 콘텐츠를 빠르게 표시하는 데 탁월하지만 레이아웃 이동을 유발할 가능성이 있습니다. 이러한 레이아웃 변경은 웹 글꼴과 해당 대체 글꼴이 페이지에서 다른 양의 공간을 차지할 때 발생합니다. 비슷한 비율의 글꼴을 사용하면 이러한 레이아웃 이동의 크기가 최소화됩니다.

<figure>{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/g0892nhvz3SnSaasaO1b.png", alt="글꼴 교체로 인한 레이아웃 이동을 보여주는 다이어그램", width="800", height="452" %} <figcaption> 이 예에서 글꼴 교체로 인해 페이지 요소가 5픽셀 위쪽으로 이동했습니다.</figcaption></figure>

#### 식별

특정 페이지에 로드되는 글꼴을 보려면 DevTools에서 **네트워크** 탭을 열고 **글꼴**로 필터링하십시오. 글꼴은 큰 파일일 수 있으므로 일반적으로 더 적은 수의 글꼴만 사용하는 것이 성능에 더 좋습니다.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/Ts38bQtR6x0SDgufA9vz.png", alt="DevTools에 표시된 글꼴의 스크린샷", width="800", height="252" %}

글꼴을 요청하는 데 걸리는 시간을 보려면 **타이밍** 탭을 클릭하십시오. 글꼴을 더 빨리 요청할수록 더 빨리 로드하여 사용할 수 있습니다.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/wfS7qVThKMkGA7SHd439.png", alt="DevTools의 '타이밍' 탭 스크린샷", width="800", height="340" %}

글꼴에 대한 요청 체인을 보려면 **개시자** 탭을 클릭하십시오. 일반적으로 요청 체인이 짧을수록 글꼴을 더 빨리 요청할 수 있습니다.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/0tau1GQnZfj5vPhzwnIQ.png", alt="DevTools의 '초기자' 탭 스크린샷", width="800", height="189" %}

#### 수정

이 데모는 Google Fonts API를 사용합니다. `<link>` 태그 또는 `@import` 구문을 통해 글꼴을 로드하는 옵션을 제공합니다. `<link>` 코드 조각에는 `preconnect` 리소스 힌트가 포함되어 있습니다. `@import` 버전을 사용하는 것보다 스타일시트를 더 빠르게 전달할 수 있습니다.

매우 높은 수준에서 [리소스 힌트](https://www.w3.org/TR/resource-hints/#resource-hints)는 브라우저에 특정 연결을 설정하거나 특정 리소스를 다운로드해야 한다는 힌트를 주는 방법으로 생각할 수 있습니다. 결과적으로 브라우저는 이러한 작업의 우선 순위를 지정합니다. 리소스 힌트를 사용할 때 특정 작업의 우선 순위를 지정하면 다른 작업에서 브라우저 리소스가 제거된다는 점에 유의하십시오. 따라서 리소스 힌트는 모든 것이 아니라 신중하게 사용해야 합니다. 자세한 내용은 [인지되는 페이지 속도를 개선하기 위해 조기에 네트워크 연결 설정](/preconnect-and-dns-prefetch/)을 참조하십시오.

스타일시트에서 `@import` 구문을 제거하십시오.

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400&family=Roboto:wght@300&display=swap');
```

문서의 `<head>` 다음에 `<link>` 태그를 추가합니다.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet">
```

이러한 링크 태그는 브라우저에 Google 글꼴이 사용하는 원본에 대한 초기 연결을 설정하고 Montserrat 및 Roboto에 대한 글꼴 선언이 포함된 스타일시트를 로드하도록 지시합니다. 이러한 `<link>` 태그가 `<head>`에 가능한 한 일찍 배치되어야 합니다.

{% Aside %}

Google 글꼴에서 글꼴의 하위 집합만 로드하려면 [`?text=`](https://developers.google.com/fonts/docs/getting_started) API 매개변수를 추가합니다. 예를 들어 `?text=ABC`는 "ABC"를 렌더링하는 데 필요한 문자만 로드합니다. 이것은 글꼴의 파일 크기를 줄이는 좋은 방법입니다.

{% endAside %}

## 애니메이션

애니메이션이 Web Vitals에 영향을 미치는 주요 방법은 레이아웃 변경을 일으키는 경우입니다. 사용을 피해야 하는 두 가지 유형의 애니메이션이 있습니다. [레이아웃을 트리거하는 애니메이션](/animations-guide/#triggers)과 페이지 요소를 이동하는 "애니메이션과 유사한" 효과입니다. [`transform`](https://developer.mozilla.org/docs/Web/CSS/transform) , [`opacity`](https://developer.mozilla.org/docs/Web/CSS/opacity) 및 [`filter`](https://developer.mozilla.org/docs/Web/CSS/filter)와 같은 CSS 속성을 사용하여 보다 성능이 뛰어난 동등한 애니메이션으로 대체할 수 있습니다. 자세한 내용은 [고성능 CSS 애니메이션을 만드는 방법](/animations/)을 참조하십시오.

### 식별

Lighthouse의 "비합성 애니메이션 피하기" 감사는 성능이 좋지 않은 애니메이션을 식별하는 데 도움이 될 수 있습니다.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/mXgypW9x3qgvmWDLbIZx.png", alt="Lighthouse의 '비합성 애니메이션 방지' 감사", width="512", height="132" %}

{% Aside 'caution' %}

Lighthouse의 "비합성 애니메이션 방지" 감사는 성능이 저하된 *CSS 애니메이션*만 식별합니다. JavaScript 기반 애니메이션(예: [`setInterval()`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) 사용)은 성능에 좋지 않지만 이 감사에서 플래그가 지정되지 않습니다.

{% endAside %}

### 수정

`margin-left` 속성을 전환하는 대신 `transform: translateX()` `slideIn` 애니메이션 시퀀스를 변경합니다.

이전:

```css
.header {
  animation: slideIn 1s 1 ease;
}

@keyframes slideIn {
  from {
    margin-left: -100%;
  }
  to {
    margin-left: 0;
  }
}
```

이후:

```css
.header {
  animation: slideIn 1s 1 ease;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}
```

## 중요한 CSS

스타일시트는 렌더링 차단입니다. 즉, 브라우저가 스타일시트를 만나면 브라우저가 스타일시트를 다운로드하고 구문 분석할 때까지 다른 리소스 다운로드를 중지합니다. 이것은 LCP를 지연시킬 수 있습니다. 성능을 향상시키려면 [사용하지 않는 CSS를 제거](https://css-tricks.com/how-do-you-remove-unused-css-from-a-site/)하고 [중요한 CSS를 인라인](/extract-critical-css/)하고 [중요하지 않은 CSS를 연기](/defer-non-critical-css/#optimize)하는 것을 고려하십시오.

## 결론

추가 개선의 여지가 있지만(예: [이미지 압축](/use-imagemin-to-compress-images/)을 사용하여 이미지를 더 빠르게 전달) 이러한 변경으로 인해 이 사이트의 Web Vital이 크게 향상되었습니다. 이것이 실제 사이트인 경우 다음 단계는 [실제 사용자로부터 성능 데이터를 수집](/vitals-measurement-getting-started/#measuring-web-vitals-using-rum-data)하여 [대부분의 사용자에 대한 Web Vitals 임계값을 충족](/vitals-measurement-getting-started/#data-interpretation)하는지 평가하는 것입니다. Web Vitals에 대한 자세한 내용은 [Web Vitals 학습](/collection/)을 참조하십시오.
