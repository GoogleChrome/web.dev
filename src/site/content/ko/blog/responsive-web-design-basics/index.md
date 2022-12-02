---
title: 반응형 웹 디자인 기초
subhead: 사이트가 보여지는 장치의 요구와 기능에 대응하도록 사이트를 만드는 방법.
description: 사이트가 보여지는 장치의 요구와 기능에 대응하도록 사이트를 만드는 방법을 소개합니다.
date: 2019-02-12
updated: 2020-05-14
authors:
  - petelepage
  - rachelandrew
tags:
  - blog
  - css
  - layout
  - mobile
  - ux
---

{# TODO(kayce): #1983이 들어오면 이 하드 코딩된 ToC를 제거하십시오. #}

- [뷰포트 설정](#viewport)
- [뷰포트에 맞게 콘텐츠 크기 조정](#size-content)
- [빠른 응답을 위해 CSS 미디어 쿼리 사용](#media-queries)
- [중단점을 선택하는 방법](#breakpoints)
- [Chrome DevTools에서 미디어 쿼리 중단점 보기](#devtools)

웹 서핑을 위한 모바일 장치의 사용은 천문학적인 속도로 계속 증가하고 있으며 이러한 장치는 종종 디스플레이 크기의 제약을 받기 때문에 콘텐츠가 화면에 배치되는 방식에서 새로운 접근 방식이 요구됩니다.

[A List Apart에서 Ethan Marcotte](http://alistapart.com/article/responsive-web-design/)이 처음 정의한 반응형 웹 디자인은 사용자와 사용자가 사용하는 장치의 요구에 대응합니다. 장치의 크기와 기능에 따라 레이아웃이 달라집니다. 예를 들어, 전화 사용자는 하나의 열에 콘텐츠가 표시되는 모습을 볼 수 있지만, 태블릿은 동일한 콘텐츠를 두 개의 열에 표시할 수 있습니다.

<figure>   {% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/8RKRFvbuoXGkOSuEArb7.mp4", autoplay=true, controls=true, loop=true, muted=true, playsinline=true %}</figure>

휴대폰, "패블릿", 태블릿, 데스크톱, 게임 콘솔, TV, 심지어 웨어러블에 이르기까지 다양한 화면 크기가 존재합니다. 화면 크기는 계속해서 변하기 때문에 사이트가 현재 또는 미래의 모든 화면 크기에 적응할 수 있도록 하는 것이 중요합니다. 또한 장치에는 우리가 상호 작용하는 다양한 요소들이 있습니다. 예를 들어 방문자 중 일부는 터치스크린을 사용합니다. 현대적인 반응형 디자인은 이러한 모든 사항을 고려하여 모든 사람의 경험을 최적화합니다.

## 뷰포트 설정 {: #viewport }

다양한 장치에 최적화된 페이지는 문서 헤드에 메타 뷰포트 태그를 포함해야 합니다. 메타 뷰포트 태그는 페이지의 크기와 배율을 제어하는 방법에 대한 정보를 브라우저에 제공합니다.

최상의 경험을 제공하기 위해 모바일 브라우저는 페이지를 데스크톱 화면 너비(일반적으로 약 `980px`, 그러나 장치에 따라 다름)로 렌더링한 다음 글꼴 크기를 늘리고 화면에 맞게 콘텐츠 크기를 조정하여 콘텐츠를 더 보기 좋게 만듭니다. 즉, 사용자에게 글꼴 크기가 일관되지 않게 나타날 수 있어 콘텐츠를 보고 상호 작용하기 위해 사용자가 두 번 탭하거나 핀치하여 확대해야 할 수 있습니다.

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <meta name="viewport" content="width=device-width, initial-scale=1">
    …
  </head>
  …

```

메타 뷰포트 값 `width=device-width`를 사용하면 장치 독립적인 픽셀로 화면 너비를 일치시킬 것을 페이지에 지시합니다. 고밀도 화면에서 많은 물리적 픽셀로 구성될 수 있는 단일 픽셀의 표현인 장치(또는 밀도) 독립 픽셀입니다. 이를 통해 페이지는 작은 휴대폰에서 렌더링하든 큰 데스크톱 모니터에서 렌더링하든 다양한 화면 크기와 일치하도록 콘텐츠를 리플로우할 수 있습니다.

<figure>   {% Img src="image/admin/SrMBH5gokGU06S0GsjLS.png", alt="텍스트가 매우 축소되어 읽기 어려운 페이지를 보여주는 스크린샷", width="500", height="640" %}   <figcaption>     뷰포트 메타 태그가 없는 기기에서 페이지가 로드되는 방식을 보여주는 예입니다. <a href="https://without-vp-meta.glitch.me/">Glitch에서 이 예를 참조하세요</a>.   </figcaption></figure>

<figure>   {% Img src="image/admin/9NrJxt3aEv37A3E7km65.png", alt="텍스트가 읽을 수 있는 크기로 표시된 동일한 페이지의 스크린샷", width="500", height="888" %}   <figcaption>     뷰포트 메타 태그가 있는 기기에서 페이지가 로드되는 방식을 보여주는 예입니다. <a href="https://with-vp-meta.glitch.me/">Glitch에서 이 예를 참조하세요</a>.   </figcaption></figure>

[일부 브라우저](https://css-tricks.com/probably-use-initial-scale1/)는 가로 모드로 회전할 때 페이지의 너비를 일정하게 유지하고 리플로우 대신 확대/축소를 통해 화면을 채웁니다. `initial-scale=1` 값을 추가하면 브라우저가 장치 방향에 관계없이 CSS 픽셀과 장치 독립적인 픽셀 사이에 1:1 관계를 유지하도록 지시하고 페이지에서 전체 가로 너비를 활용할 수 있습니다.

{% Aside 'caution' %} 이전 브라우저에서 속성을 제대로 구문 분석할 수 있도록 쉼표를 사용하여 속성을 구분하세요. {% endAside %}

[`width` 또는 `initial-scale`가 있는 `<meta name="viewport">` 태그가 없습니까](https://developer.chrome.com/docs/lighthouse/pwa/viewport/) Lighthouse 감사는 HTML 문서가 뷰포트 메타 태그를 올바르게 사용하고 있는지 확인하는 프로세스를 자동화하는 데 도움을 줄 수 있습니다.

### 액세스 가능한 뷰포트 확인 {: #accessible-viewport }

`initial-scale`을 설정하는 외에 뷰포트에서 다음 속성을 설정할 수도 있습니다.

- `minimum-scale`
- `maximum-scale`
- `user-scalable`

이러한 속성을 설정하면 사용자가 뷰포트를 확대/축소할 수 없게 되어 잠재적으로 접근성 문제가 발생할 수 있습니다. 따라서 이러한 속성을 사용하지 않는 것이 좋습니다.

## 뷰포트에 맞게 콘텐츠 크기 조정 {: #size-content }

데스크톱과 모바일 기기 모두에서 사용자는 웹사이트를 세로로 스크롤하는 데는 익숙하지만 가로는 그렇지 않습니다. 전체 페이지를 보기 위해 사용자가 가로로 스크롤하거나 축소해야 한다면 사용자 경험이 나빠집니다.

메타 뷰포트 태그가 있는 모바일 사이트를 개발할 때 실제로 지정된 뷰포트에 맞지 않는 페이지 콘텐츠를 제작하는 실수를 하기가 쉽습니다. 예를 들어, 뷰포트보다 넓은 너비로 표시되는 이미지가 있으면 뷰포트를 가로로 스크롤해야 할 수 있습니다. 사용자가 가로로 스크롤할 필요가 없도록 이 콘텐츠를 뷰포트 너비에 맞게 조정해야 합니다.

[뷰포트에 맞게 콘텐츠 크기가 올바르게 지정되지 않았습니다.](/content-width/) Lighthouse 감사를 통해 범위를 넘어가는 콘텐츠를 감지하는 프로세스를 자동화할 수 있습니다.

### 이미지 {: #images }

이미지의 크기는 고정되어 있으며 뷰포트보다 크면 스크롤바가 나타납니다. 이 문제를 처리하는 일반적인 방법은 모든 이미지에 `100%`의 `max-width`를 부여하는 것입니다. 이렇게 하면 뷰포트 크기가 이미지보다 작은 경우 이미지가 공간에 맞게 축소됩니다. 그러나 `width`가 아닌 `max-width`가 `100%`이기 때문에 이미지가 원래 크기보다 크게 늘어나지 않습니다. 일반적으로 이미지가 스크롤바를 유발하는 문제가 발생하지 않도록 스타일시트에 다음을 추가하는 것이 안전합니다.

```css
img {
  max-width: 100%;
  display: block;
}
```

#### img 요소에 이미지 크기 추가 {: #image-dimensions }

`max-width: 100%`를 사용하는 경우 이미지의 자연적인 치수를 무시하는 것이지만 `<img>` 태그에서 `width` 및 `height` 속성을 계속 사용해야 합니다. 이는 최신 브라우저가 이 정보를 사용하여 이미지가 로드되기 전에 해당 공간을 예약하기 때문에 콘텐츠가 로드될 때 [레이아웃이 변경](/optimize-cls/)되는 것을 방지하는 데 도움이 됩니다.

### 레이아웃 {: #layout }

CSS 픽셀의 화면 크기와 너비는 기기(예: 휴대폰과 태블릿, 심지어 휴대폰 간에도)에 따라 크게 다르기 때문에 콘텐츠가 잘 렌더링되기 위해 특정 뷰포트 너비에 의존해서는 안 됩니다.

과거에는 레이아웃을 생성하는 데 사용되는 요소를 백분율로 설정해야 했습니다. 아래 예에서 픽셀을 사용하여 크기가 조정된 부동 요소가 있는 2-열 레이아웃을 볼 수 있습니다. 뷰포트가 열의 전체 너비보다 작아지면 콘텐츠를 보기 위해 가로로 스크롤해야 합니다.

<figure>   {% Img src="image/admin/exFCZNQLUveUnpMFjvcj.jpg", alt="두 번째 열의 대부분이 뷰포트 밖에 있는 2-열 레이아웃을 보여주는 스크린샷", width="800", height="504" %}   <figcaption>     픽셀을 사용하는 부동 레이아웃. <a href="https://layout-floats-px.glitch.me/">Glitch에서 이 예제를 참조하세요</a>.   </figcaption></figure>

너비에 백분율을 사용하면 열이 항상 컨테이너의 특정 비율로 유지됩니다. 즉, 스크롤바를 만드는 대신 열이 좁아집니다.

{% Glitch { id: 'layout-floats-percent', path: 'README.md' } %}

Flexbox, Grid Layout 및 Multicol과 같은 최신 CSS 레이아웃 기술을 사용하면 이러한 유연한 그리드를 훨씬 쉽게 만들 수 있습니다.

#### Flexbox {: #flexbox }

이 레이아웃 방법은 크기가 다른 항목 집합이 있고 작은 항목은 더 적은 공간을 차지하고 큰 항목은 더 많은 공간을 차지하여 한 행 또는 여러 행에 항목이 보기 좋게 놓이도록 하려는 경우에 이상적입니다.

```css
.items {
  display: flex;
  justify-content: space-between;
}
```

반응형 디자인에서 Flexbox를 사용하여 항목을 단일 행으로 표시하거나 사용 가능한 공간이 줄어들면 여러 행으로 래핑할 수 있습니다.

{% Glitch { id: 'responsive-flexbox', height: 220 } %}

[Flexbox에 대해 자세히 알아보기](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Flexbox)

#### CSS 그리드 레이아웃 {: #grid }

CSS 그리드 레이아웃을 사용하면 유연한 그리드를 간단하게 생성할 수 있습니다. 백분율로 열을 만드는 대신 이전의 부동 예제를 고려하면 그리드 레이아웃, 그리고 컨테이너에서 사용 가능한 공간 부분을 나타내는 `fr` 단위를 사용할 수 있습니다.

```css
.container {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
```

{% Glitch 'two-column-grid' %}

그리드를 사용하여 수용 가능한 만큼 많은 항목을 사용하여 일반 그리드 레이아웃을 만들 수도 있습니다. 화면 크기가 줄어들면 사용 가능한 트랙 수가 줄어듭니다. 아래 데모에는 각 행에 들어갈 수 있는 만큼의 카드가 있으며 최소 크기는 `200px`입니다.

{% Glitch 'grid-as-many-as-fit' %}

[CSS 그리드 레이아웃에 대해 자세히 알아보기](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Grids)

#### 다중 열 레이아웃 {: #multicol }

일부 형태의 레이아웃에는 `column-width` 속성으로 여러 개의 반응형 열을 생성할 수 있는 다중 열 레이아웃(Multicol)을 사용할 수 있습니다. 아래 데모에는 또 다른 `200px` 열을 위한 공간이 있는 경우 열이 추가되는 것을 볼 수 있습니다.

{% Glitch { id: 'responsive-multicol', path: 'style.css' } %}

[Multicol에 대해 자세히 알아보기](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Multiple-column_Layout)

## 빠른 응답을 위해 CSS 미디어 쿼리 사용 {: #media-queries }

위에 표시된 기술이 허용하는 것보다 특정 화면 크기를 지원하기 위해 레이아웃을 더 광범위하게 변경해야 할 때가 있습니다. 이 때 미디어 쿼리가 유용합니다.

미디어 쿼리는 CSS 스타일에 적용할 수 있는 간단한 필터입니다. 콘텐츠를 렌더링하는 장치 유형 또는 해당 장치의 특징(예: 너비, 높이, 방향, 호버링 가능 여부, 장치를 터치스크린으로 사용 중인지 여부)에 따라 스타일을 쉽게 변경할 수 있습니다.

다양한 인쇄 스타일을 제공하려면 다음과 같이 인쇄 스타일이 있는 스타일시트를 포함할 수 있도록 출력 *유형*을 지정해야 합니다.

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <link rel="stylesheet" href="print.css" media="print">
    …
  </head>
  …
```

또는 미디어 쿼리를 사용하여 기본 스타일시트에 인쇄 스타일을 포함할 수 있습니다.

```css
@media print {
  /* print styles go here */
}
```

{% Aside 'note' %} `@import` 구문, `@import url(print.css) print;`를 사용하여 기본 CSS 파일에 별도의 스타일시트를 포함할 수도 있지만 이러한 사용은 성능상의 이유로 권장되지 않습니다. 자세한 내용은 [CSS 가져오기 방지](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/page-speed-rules-and-recommendations#avoid_css_imports)를 참조하세요. {% endAside %}

반응형 웹 디자인의 경우 일반적으로 더 작은 화면에 다른 레이아웃을 제공하기 위해, 또는 방문자가 터치스크린을 사용하는 것으로 감지될 때 장치의 *특징*을 쿼리합니다.

### 뷰포트 크기에 따른 미디어 쿼리 {: #viewport-media-queries }

미디어 쿼리를 사용하면 작은 화면, 큰 화면 및 그 중간 화면에 특정 스타일이 적용되는 반응형 경험을 만들 수 있습니다. 따라서 여기에서 감지하는 특징은 화면 크기이며 다음 사항을 테스트할 수 있습니다.

- `width` ( `min-width` , `max-width` )
- `height` ( `min-height` , `max-height` )
- `orientation`
- `aspect-ratio`

{% Glitch { id: 'media-queries-size', path: 'index.html' } %}

이러한 모든 특징은 뛰어난 브라우저 지원을 제공합니다. 브라우저 지원 정보를 포함한 자세한 내용은 MDN의 [너비](https://developer.mozilla.org/docs/Web/CSS/@media/width), [높이](https://developer.mozilla.org/docs/Web/CSS/@media/height), [방향](https://developer.mozilla.org/docs/Web/CSS/@media/orientation) 및 [종횡비](https://developer.mozilla.org/docs/Web/CSS/@media/aspect-ratio)를 참조하세요.

{% Aside 'note' %} 사양에는 `device-width` 및 `device-height`에 대한 테스트가 포함되었습니다. 이러한 테스트는 더 이상 사용되지 않으며 피해야 합니다. `device-width` 및 `device-height`는 실제로 유용하지 않은 장치 창의 실제 크기를 테스트합니다. 예를 들어 사용자가 브라우저 창의 크기를 조정한 경우, 이것은 보고 있는 뷰포트와 다를 수 있기 때문입니다. {% endAside %}

### 장치 기능에 따른 미디어 쿼리 {: #capability-media-queries }

사용 가능한 장치가 늘어남에 따라 모든 대형 장치가 일반 데스크톱 또는 랩톱 컴퓨터라거나, 사람들이 작은 장치에서만 터치스크린을 사용할 것이라고 가정할 수는 없습니다. 미디어 쿼리 사양에 몇 가지 새로운 추가 기능을 사용하여 장치와 상호 작용하는 데 사용되는 포인터 유형 및 사용자가 요소 위로 마우스를 이동할 수 있는지 여부와 같은 기능을 테스트할 수 있습니다.

- `hover`
- `pointer`
- `any-hover`
- `any-pointer`

일반 데스크톱 컴퓨터, 휴대폰 또는 태블릿과 같은 다양한 장치에서 이 데모를 보세요.

{% Glitch 'media-query-pointer' %}

이러한 새로운 기능은 모든 최신 브라우저에서 잘 지원됩니다. MDN 페이지에서 [호버](https://developer.mozilla.org/docs/Web/CSS/@media/hover), [임의의 호버](https://developer.mozilla.org/docs/Web/CSS/@media/any-hover), [포인터](https://developer.mozilla.org/docs/Web/CSS/@media/pointer), [임의의 포인터](https://developer.mozilla.org/docs/Web/CSS/@media/any-pointer)에 대해 자세히 알아보세요.

#### `any-hover` 및 `any-pointer` 사용하기

`any-hover` 및 `any-pointer` 기능은 사용자가 마우스를 가져갈 수 있는지 여부를 테스트하거나, 장치와 상호 작용하는 기본 방식이 아닌 경우에도 해당 유형의 포인터를 사용하는지 여부를 테스트합니다. 사용자가 터치스크린을 사용하고 있을 때 마우스로 전환하도록 만드는 것은 그다지 친절하지 않습니다! 그러나 `any-hover` 및 `any-pointer`는 사용자가 가지고 있는 장치의 종류를 파악하는 것이 중요한 경우 유용할 수 있습니다. 예를 들어, 터치스크린과 트랙 패드가 있는 노트북은 호버링 기능 외에도 거친 포인터와 미세한 포인터를 일치시켜야 합니다.

## 중단점을 선택하는 방법 {: #breakpoints }

장치 클래스를 기반으로 중단점을 정의하지 마세요. 현재 사용 중인 특정 장치, 제품, 브랜드 이름 또는 운영 체제를 기반으로 중단점을 정의하면 유지 관리에서 큰 어려움에 봉착할 수 있습니다. 대신, 콘텐츠 자체에 따라 레이아웃이 컨테이너에 맞게 조정되는 방식이 결정되어야 합니다.

### 작게 시작하여 주요 중단점을 선택하고 점차 확대 {: #major-breakpoints }

먼저 작은 화면 크기에 맞게 콘텐츠를 디자인한 다음 중단점이 필요할 때까지 화면을 확장합니다. 이를 통해 콘텐츠를 기반으로 중단점을 최적화하고 중단점의 수를 가능한 한 최소화할 수 있습니다.

처음에 본 예제인 날씨 예보를 계속 작업해 보겠습니다. 첫 번째 단계는 작은 화면에서 예보가 잘 보이도록 하는 것입니다.

<figure>   {% Img src="image/admin/3KPWtKzDFCwImLyHprRP.png", alt="모바일 너비에 맞춰진 날씨 앱의 스크린샷", width="400", height="667" %}   <figcaption>     너비가 좁은 앱.   </figcaption></figure>

그런 다음, 요소 사이에 공백이 너무 많아 예보가 시각적으로 이상해 보일 때까지 브라우저 크기를 조정합니다. 결정은 다소 주관적이지만 위의 `600px`는 확실히 너무 넓습니다.

<figure>   {% Img src="image/admin/sh1P84rvjvviENlVFED4.png", alt="항목 간 간격이 넓은 날씨 앱의 스크린샷", width="400", height="240" %}   <figcaption>     디자인을 조정해야 한다고 느껴지는 시점까지 이른 앱.   </figcaption></figure>

`600px`에 중단점을 삽입하려면 구성요소의 CSS 끝에 두 개의 미디어 쿼리를 만듭니다. 하나는 브라우저가 `600px` 이하일 때 사용하고 다른 하나는 `600px` 보다 넓을 때 사용합니다.

```css
@media (max-width: 600px) {

}

@media (min-width: 601px) {

}
```

마지막으로, CSS를 리팩토링합니다. `600px`의 `max-width`에 대한 미디어 쿼리 내부에 작은 화면만을 위한 CSS를 추가합니다. `601px`의 `min-width`에 대한 미디어 쿼리 내부에는 더 큰 화면을 위한 CSS를 추가합니다.

#### 필요한 경우 부수적인 중단점 선택

레이아웃이 크게 변경될 때 주요 중단점을 선택하는 외에도 부수적인 변경에 맞게 조정하는 것도 도움이 됩니다. 예를 들어, 주요 중단점 사이에 요소의 여백 또는 패딩을 조정하거나 레이아웃에서 더 자연스럽게 느껴지도록 글꼴 크기를 늘리는 것이 도움이 될 수 있습니다.

작은 화면 레이아웃을 최적화하는 것부터 시작하겠습니다. 이 경우, 뷰포트 너비가 `360px` 이상일 때 글꼴을 키워보겠습니다. 둘째, 공간이 충분할 때 고온과 저온을 분리하여 서로 위, 아래로 놓이지 않고 같은 라인에 있도록 할 수 있습니다. 날씨 아이콘도 좀 더 크게 만들어 보겠습니다.

```css
@media (min-width: 360px) {
  body {
    font-size: 1.0em;
  }
}

@media (min-width: 500px) {
  .seven-day-fc .temp-low,
  .seven-day-fc .temp-high {
    display: inline-block;
    width: 45%;
  }

  .seven-day-fc .seven-day-temp {
    margin-left: 5%;
  }

  .seven-day-fc .icon {
    width: 64px;
    height: 64px;
  }
}
```

마찬가지로 대형 화면의 경우 전체 화면 너비를 사용하지 않도록 예보 패널의 최대 너비로 제한하는 것이 가장 좋습니다.

```css
@media (min-width: 700px) {
  .weather-forecast {
    width: 700px;
  }
}
```

{% Glitch { id: 'responsive-forecast', path: 'style.css' } %}

### 읽기 좋게 텍스트 최적화

고전적인 가독성 이론에 따르면 이상적인 열은 한 줄에 70~80자(영어의 경우 약 8~10단어)를 포함해야 합니다. 따라서 텍스트 블록의 너비가 약 10단어를 초과할 때마다 중단점을 추가하는 것이 좋습니다.

<figure>   {% Img src="image/admin/C4IGJw9hbPXKnTSovEXS.jpg", alt="모바일 장치의 텍스트 페이지를 보여주는 스크린샷", width="400", height="488" %}   <figcaption>     모바일 장치에서 읽혀지는 텍스트.   </figcaption></figure>

<figure>   {% Img src="image/admin/rmsa1EB5FpvWV0vFIpTF.jpg", alt="데스크톱 브라우저의 텍스트 페이지를 보여주는 스크린샷", width="800", height="377" %}   <figcaption>     줄 길이를 제한하기 위해 중단점이 추가된 데스크톱 브라우저에서 읽혀지는 텍스트.   </figcaption></figure>

위의 블로그 게시물 예를 자세히 살펴보겠습니다. 작은 화면에서 `1em`의 Roboto 글꼴은 한 줄에 10단어를 제공하여 완벽하게 작동하지만 큰 화면에서는 중단점이 필요합니다. 이 경우 브라우저 너비가 `575px`보다 크면 이상적인 콘텐츠 너비는 `550px`입니다.

```css
@media (min-width: 575px) {
  article {
    width: 550px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

{% Glitch { id: 'rwd-reading', path: 'index.html' } %}

### 단순히 콘텐츠를 숨기지 말 것

화면 크기에 따라 숨기거나 표시할 콘텐츠를 선택할 때 주의하세요. 단순히 화면에 맞출 수 없다는 이유로 콘텐츠를 숨기지 마세요. 사용자가 원하는 것이 화면 크기에 의해서만 결정되는 것은 아닙니다. 예를 들어, 일기 예보에서 꽃가루 수를 없애면 봄철에 외출할지 여부를 결정하기 위해 이 정보가 꼭 필요한 알레르기 환자에게 심각한 문제가 될 수 있습니다.

## Chrome DevTools에서 미디어 쿼리 중단점 보기 {: #devtools }

미디어 쿼리 중단점을 설정했으면 이로 인해 사이트가 어떻게 표시되는지 확인하고 싶을 것입니다. 브라우저 창의 크기를 조정하여 중단점을 트리거할 수 있지만 Chrome DevTools에는 다양한 중단점에서 페이지가 어떻게 보이는지 쉽게 확인할 수 있는 기능이 기본적으로 제공됩니다.

<figure>   {% Img src="image/admin/DhaeCbVo5AmzZ0CyLtVp.png", alt="날씨 앱이 열려 있고 너비가 822픽셀로 선택된 DevTools의 스크린샷.", width="800", height="522" %}   <figcaption>     더 넓은 뷰포트 크기에서 볼 때 날씨 앱을 보여주는 DevTools.   </figcaption></figure>

<figure>   {% Img src="image/admin/35IEQnhGox93PHvbeglM.png", alt="날씨 앱이 열려 있고 너비가 436픽셀로 선택된 DevTools의 스크린샷.", width="800", height="521" %}   <figcaption>     더 좁은 뷰포트 크기에서 볼 때 날씨 앱을 보여주는 DevTools.   </figcaption></figure>

다른 중단점에서 페이지를 보려면 다음 단계를 따르세요.

[DevTools](https://developer.chrome.com/docs/devtools/open/)를 연 다음 [Device Mode](https://developer.chrome.com/docs/devtools/device-mode/#toggle)를 켭니다. 기본적으로 [반응형 모드](https://developer.chrome.com/docs/devtools/device-mode/#responsive)에서 열립니다.

미디어 쿼리를 보려면 장치 모드 메뉴를 열고 [미디어 쿼리 표시](https://developer.chrome.com/docs/devtools/device-mode/#queries)를 선택하여 중단점을 페이지 위에 컬러 막대로 표시합니다.

해당 미디어 쿼리가 활성화되어 있는 동안 막대 중 하나를 클릭하여 페이지를 봅니다. 막대를 마우스 오른쪽 버튼으로 클릭하면 미디어 쿼리의 정의를 볼 수 있습니다.
