---
title: 누적 레이아웃 이동 최적화
subhead: 갑작스러운 레이아웃 이동을 방지해 사용자 경험을 개선하는 방법을 알아봅니다.
authors:
  - addyosmani
date: 2020-05-05
updated: 2021-08-17
hero: image/admin/74TRx6aETydsBGa2IZ7R.png
description: Cumulative Layout Shift(누적 레이아웃 이동, CLS)는 사용자가 페이지 콘텐츠에서 갑작스러운 이동을 경험하는 빈도를 수량화하는 메트릭입니다. 이 가이드에서는 차원이나 동적 콘텐츠가 없는 이미지 및 iframe과 같이 CLS가 발생하는 일반적인 원인을 최적화하는 방법을 알아봅니다.
alt: 레이아웃 이동이 발생하면 읽고 있던 페이지가 갑자기 밀리거나, 페이지의 더 아래 부분을 클릭하게 되는 등 열악한 사용자 경험으로 이어질 수 있습니다. 레이아웃 이동을 일으키는 동적 콘텐츠를 위한 공간을 확보하면 좀 더 원활한 사용자 경험을 조성하는 데 도움이 됩니다.
tags:
  - blog
  - performance
  - web-vitals
---

{% YouTube id='AQqFZ5t8uNc', startTime='88' %}

"저걸 클릭하려고 했는데! 왜 움직인 거야? 😭"

레이아웃 변경은 사용자의 주의를 산만하게 할 수 있습니다. 글을 읽기 시작했는데, 갑자기 요소가 페이지 아래로 이동해서 읽었던 곳을 다시 찾아야 한다고 생각해보세요. 이런 상황은 뉴스를 읽거나 '검색' 또는 '장바구니에 추가' 버튼을 클릭하려고 할 때 등 웹에서 자주 경험할 수 있는 일입니다. 이러한 경험은 시각적으로 거슬리는 데다가 짜증스럽죠. 다른 요소가 갑자기 페이지에 추가되거나 크기 조정으로 인해 시각적 요소가 강제로 이동할 때 자주 발생하는 현상입니다.

[Cumulative Layout Shift(누적 레이아웃 이동, CLS)](/cls)는 [)CoreWeb Vitals](/vitals) 메트릭으로, 사용자 입력 500ms 이내에 발생하지 않는 레이아웃 이동에 대한 점수를 합산하여 콘텐츠의 불안정성을 측정합니다. 뷰포트에서 가시적인 콘텐츠가 얼마나 이동했는지와 영향을 받은 요소가 이동한 거리를 확인합니다.

이 가이드에서는 레이아웃 이동의 일반적인 원인을 최적화하는 방법을 다룹니다.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9mWVASbWDLzdBUpVcjE1.svg" | imgix }}" media="(min-width: 640px)">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg", alt="좋은 CLS 값은 0.1 미만이고 나쁜 값은 0.25보다 크며 그 사이에는 개선이 필요합니다", width="384", height="96" %}
</picture>

열악한 CLS 값이 발생하는 일반적인 이유는 다음과 같습니다.

- 크기가 정해지지 않은 이미지
- 크기가 정해지지 않은 광고, 임베드 및 iframe
- 동적으로 주입된 콘텐츠
- FOIT/FOUT을 유발하는 웹 글꼴
- DOM을 업데이트하기 전에 네트워크 응답을 대기하는 작업

## 크기가 정해지지 않은 이미지 🌆

**요약:** 이미지 및 비디오 요소에 항상 `width` 및 `height` 크기 속성을 포함하세요. 또는 [CSS 종횡비 상자](https://css-tricks.com/aspect-ratio-boxes/)를 사용하여 필요한 공간을 확보해 두는 방법도 좋습니다. 이러한 접근 방식을 통해 이미지가 로드되는 동안 브라우저가 문서에 올바른 양의 공간을 할당할 수 있습니다.

  <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/10TEOBGBqZm1SEXE7KiC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOQn6K6OQcoElRw0NCkZ.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8wKRITUkK3Zrp5jvQ1Xw.jpg", controls=true, loop=true, muted=true %} <figcaption> 너비와 높이가 지정되지 않은 이미지. </figcaption></figure>

  <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/38UiHViz44OWqlKFe1VC.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/sFxDb36aEMvTPIyZHz1O.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wm4VqJtKvove6qjiIjic.jpg", controls=true, loop=true, muted=true %} <figcaption> 너비와 높이가 지정된 이미지. </figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/A2OyrzSXuW1qYGWAarGx.png", alt="이미지에 대한 치수 설정 후 누적 레이아웃 이동에 미치는 이전/이후 영향을 보여주는 Lighthouse 보고서", width="800", height="148" %} <figcaption> 이미지 치수 설정 후 CLS에 대한 영향을 보여주는 Lighthouse 6.0. </figcaption></figure>

### 역사

웹 초기에 개발자는 브라우저가 이미지 가져오기를 시작하기 전에 페이지에 충분한 공간이 할당되었는지 확인하기 위해 `<img>` 태그에 `width` 및 `height` 속성을 추가하곤 했습니다. 이렇게 하면 재배치나 레이아웃 재구성을 최소화할 수 있기 때문이었죠.

```html
<img src="puppy.jpg" width="640" height="360" alt="강아지와 풍선" />
```

`width`와 `height`에는 단위가 포함되지 않는다는 것을 알 수 있습니다. 이러한 "픽셀" 크기는 640x360의 공간이 확보되도록 합니다. 실제 크기가 일치하는지와는 관계없이 이미지는 이 공간에 맞게 조정됩니다.

그러다가 [반응형 웹 디자인](https://www.smashingmagazine.com/2011/01/guidelines-for-responsive-web-design/)이 도입되며 `width`와 `height`를 생략하고, 대신 CSS를 사용하여 이미지 크기를 조정하기 시작했습니다.

```css
img {
  width: 100%; /* or max-width: 100%; */
  height: auto;
}
```

이 접근 방식의 단점은 이미지가 다운로드되기 시작하고 브라우저가 크기를 결정할 수 있을 때만 이미지에 대한 공간을 할당할 수 있다는 것입니다. 이미지가 로드되면 각 이미지가 화면에 나타날 때 페이지가 재배치되면서 텍스트가 갑자기 화면 아래로 사라져 버리는 것이 일반적이었습니다. 전혀 원활한 사용자 경험을 제공하지 못했죠.

여기서 종횡비가 등장하게 됩니다. 이미지의 종횡비란 너비와 높이의 비율로, 콜론으로 구분된 두 개의 숫자로 표현하는 것이 일반적입니다(예: 16:9 또는 4:3). x:y 종횡비의 경우 이미지의 너비는 x 단위이고 높이는 y 단위입니다.

즉, 크기 중 하나를 알고 있으면 다른 크기를 결정할 수 있다는 의미입니다. 16:9 종횡비의 경우 다음과 같이 계산됩니다.

- puppy.jpg의 높이가 360px인 경우 너비는 360 x (16 / 9) = 640px입니다.
- puppy.jpg의 너비가 640픽셀인 경우 높이는 640 x (9 / 16) = 360픽셀입니다.

종횡비를 알면 브라우저에서 높이 및 관련 영역에 대한 충분한 공간을 계산하고 할당할 수 있습니다.

### 최신 모범 사례

최신 브라우저는 이제 이미지의 너비 및 높이 속성을 기반으로 이미지의 기본 종횡비를 설정하므로 레이아웃 이동을 방지하도록 설정하는 것이 중요합니다. CSS Working Group 덕분에 개발자는 `width`와 `height`를 일반적으로 설정하기만 하면 됩니다.

```html
<!-- set a 640:360 i.e a 16:9 - aspect ratio -->
<img src="puppy.jpg" width="640" height="360" alt="강아지와 풍선" />
```

… 그리고 모든 브라우저의 [UA 스타일시트](https://developer.mozilla.org/docs/Web/CSS/Cascade#User-agent_stylesheets) 는 요소의 기존 `width` 및 `height` 속성을 기반으로 [기본 종횡비](https://html.spec.whatwg.org/multipage/rendering.html#attributes-for-embedded-content-and-images)를 추가합니다.

```css
img {
  aspect-ratio: attr(width) / attr(height);
}
```

이것은 이미지가 로드되기 전에 `width` 및 `height` 속성을 기반으로 종횡비를 계산하고 레이아웃 계산이 시작되는 그 시점에 이러한 정보를 제공합니다. 이미지에 특정 너비(예: `width: 100%`)가 지정되면 종횡비를 사용하여 높이를 계산합니다.

팁: 종횡비를 파악하기가 어렵다면 편리한 [계산기](https://aspectratiocalculator.com/16-9.html)를 사용할 수 있습니다.

위 이미지 종횡비 변화는 [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1547231). [Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=979891)에 제공되었으며 [WebKit](https://twitter.com/smfr/status/1220051332767174656)(Safari)에 적용됩니다.

반응형 이미지와 종횡비에 대해 더욱 심층적으로 알아보려면 [미디어 종횡비를 사용해 원활하게 페이지 로드하기](https://blog.logrocket.com/jank-free-page-loading-with-media-aspect-ratios/)를 참조하세요

이미지가 컨테이너 안에 있다면 CSS를 사용하여 이 컨테이너의 너비에 맞게 이미지 크기를 조정할 수 있습니다. 여기에서는 이미지 높이의 값이 고정되지 않도록(예: `360px`) `height: auto;`를 설정합니다.

```css
img {
  height: auto;
  width: 100%;
}
```

**그렇다면 반응형 이미지는요?**

[반응형 이미지](/serve-responsive-images) 작업 시에는 `srcset`을 통해 브라우저에서 선택하고 각 이미지의 크기를 결정하도록 허용할 이미지를 정의합니다. `<img>` 너비 및 높이 속성을 설정할 수 있도록 하려면 각 이미지가 동일한 종횡비를 사용해야 합니다.

```html
<img
  width="1000"
  height="1000"
  src="puppy-1000.jpg"
  srcset="puppy-1000.jpg 1000w, puppy-2000.jpg 2000w, puppy-3000.jpg 3000w"
  alt="강아지와 풍선"
/>
```

[아트 디렉션](https://developer.mozilla.org/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#Art_direction)은요?

페이지는 데스크톱에 표시되는 전체 이미지와 함께 좁은 뷰포트에 이미지의 잘린 부분을 포함하려고 할 수 있습니다.

```html
<picture>
  <source media="(max-width: 799px)" srcset="puppy-480w-cropped.jpg" />
  <source media="(min-width: 800px)" srcset="puppy-800w.jpg" />
  <img src="puppy-800w.jpg" alt="강아지와 풍선" />
</picture>
```

이러한 이미지는 다른 종횡비를 가질 수 있으며 브라우저는 여전히 모든 소스에서 크기를 지정하는 방법을 비롯해 가장 효율적인 솔루션이 무엇인지 평가하고 있습니다. 솔루션이 결정될 때까지는 여전히 레이아웃 재구성이 발생할 가능성이 있습니다.

## 크기가 정해지지 않은 광고, 임베드 및 iframe 📢😱

### 광고

광고는 웹에서 레이아웃 이동에 가장 크게 기여하는 요소 중 하나입니다. 광고 네트워크 및 게시자는 동적 광고 크기를 지원하는 경우가 많습니다. 광고의 크기는 경매에서 더 높은 클릭률과 더 많은 광고로 이어져 성능/수익을 높이는 요소이기 때문이죠. 안타깝게도 광고는 사용자가 보는 콘텐츠를 페이지 아래로 밀어내기 때문에 최적의 사용자 경험과는 멀어지게 됩니다.

광고 수명 주기 동안 여러 지점에서 레이아웃 이동이 발생할 수 있습니다.

- 사이트가 DOM에 광고 컨테이너를 삽입하는 경우
- 사이트에서 자사 코드로 광고 컨테이너의 크기를 조정하는 경우
- 광고 태그 라이브러리가 로드되고 광고 컨테이너의 크기가 조정되는 경우
- 광고가 컨테이너를 채우며 최종 광고의 크기가 달라 크기를 조정하는 경우

다행히도 사이트에서는 광고 이동을 줄이기 위한 모범 사례를 따를 수 있습니다. 사이트는 다음을 통해 이러한 레이아웃 이동을 경감시킬 수 있습니다.

- 광고 슬롯을 위한 고정 공간을 확보합니다.
    - 즉, 광고 태그 라이브러리가 로드되기 전에 요소의 스타일을 지정합니다.
    - 콘텐츠 흐름에 따라 광고를 배치하는 경우 슬롯 크기를 미리 확보하여 이동이 없도록 합니다. 이러한 광고는 화면 밖에서 로드되는 경우 레이아웃 이동을 일으키지 *않아야 합니다.*
- 뷰포트 상단 근처에 비고정 광고를 배치하는 경우 주의를 기울여야 합니다.
    - 아래 예에서는 광고를 "world vision" 로고 아래로 이동하고 해당 슬롯에 대한 충분한 공간을 확보하는 것이 좋습니다.
- 자리 표시자를 표시하여 광고 슬롯이 표시될 때 반환된 광고가 없는 경우 할당된 공간이 축소되지 않도록 합니다.
- 광고 슬롯에 대해 가능한 가장 큰 크기를 할당해 이동이 없도록 합니다.
    - 이것 또한 방법이긴 하지만, 더 작은 광고 크리에이티브가 해당 슬롯을 채우면 빈 공간이 생길 위험이 있습니다.
- 과거 데이터를 기반으로 광고 슬롯에 가장 적합한 크기를 선택합니다.

일부 사이트에서는 광고 슬롯이 채워지지 않을 경우 초기에 슬롯을 축소하면 레이아웃 이동을 줄일 수 있다는 사실을 발견할 수도 있습니다. 게시되는 광고를 직접 제어하지 않는 한 매번 정확한 크기를 쉽게 선택할 수 있는 방법은 없습니다.

  <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/bmxqj3kZyplh0ncMAt7x.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/60c4T7aYOsKtZlaWBndS.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg", controls=true, loop=true, muted=true %} <figcaption> 충분한 공간이 확보되지 않은 광고. </figcaption></figure>

  <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tyUFKrue5vI9o5qKjP42.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/hVxty51kdN1w5BuUvj2O.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rW77UoJQBHHehihkw2Rd.jpg", controls=true, loop=true, muted=true %} <figcaption> 충분한 공간이 확보된 광고. </figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cX6R4ACb4uVKlUb0cv1c.png", alt="광고와 같은 배너를 위한 공간을 확보했을 경우 누적 레이아웃 이동에 미치는 이전/이후 영향을 보여주는 Lighthouse 보고", width="800", height="148" %} <figcaption> 이 배너에 대한 공간 확보 후 CLS에 대한 영향을 보여주는 Lighthouse 6.0.</figcaption></figure>

#### 광고 슬롯을 위한 고정 공간 확보

태그 라이브러리에 전달된 동일한 크기로 슬롯 DOM 요소에 고정 스타일을 지정합니다. 이렇게 하면 라이브러리가 로드될 때 레이아웃 이동이 발생하지 않도록 할 수 있습니다. 이렇게 하지 않는 경우 라이브러리가 페이지 레이아웃 후 슬롯 요소의 크기를 변경할 수 있습니다.

더 작은 광고가 게시되는 경우도 고려해야 합니다. 더 작은 광고가 게재되는 경우 게시자는 레이아웃 이동을 피하기 위해 더 큰 컨테이너의 스타일을 지정할 수 있습니다. 이 접근 방식의 단점은 빈 공간의 양이 증가한다는 것으로, 균형에 신경을 써야 합니다.

#### 뷰포트 상단 근처에 광고 배치하지 않기

뷰포트 상단 근처에 있는 광고는 중간에 있는 광고보다 더 큰 레이아웃 이동을 일으킬 수 있습니다. 이는 일반적으로 상단에 있는 광고가 더 많은 콘텐츠를 아래로 밀어내기 때문입니다. 즉, 광고가 이동을 발생시키는 경우 더 많은 요소가 이동한다는 의미죠. 반대로 뷰포트 중앙 근처에 있는 광고는 위쪽에 있는 콘텐츠가 이동할 가능성이 적으므로 그리 많은 요소가 이동하지 않는 경우가 많습니다.

### 임베드 및 iframe

임베딩 가능한 위젯을 사용하면 페이지에 이식 가능한 웹 콘텐츠(예: YouTube의 비디오, Google Maps의 지도, 소셜 미디어 게시물 등)를 포함할 수 있습니다. 이러한 임베드는 다음과 같은 다양한 형식을 취할 수 있습니다.

- 대체를 멋진 임베딩으로 변환해주는 HTML 대체 및 JavaScript 태그
- 인라인 HTML 코드 조각
- iframe 임베드

이러한 임베드는 그 크기를 미리 알지 못하는 경우가 많습니다. 예를 들어 소셜 미디어 게시물의 경우 임베딩되는 것이 이미지인지 동영상인지 여러 줄의 텍스트인지 알 수 없습니다. 그 결과 임베드를 제공하는 플랫폼에서 항상 임베드에 대한 충분한 공간을 확보할 수 있는 것은 아니며, 이로 인해 최종적으로 로드될 때 레이아웃 이동이 발생할 수 있습니다.

  <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/NRhY88MbNJxe4o0F52eS.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/PzOpQnPH88Ymbe3MCH7B.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w0TM1JilKPQktQgb94un.jpg", controls=true, loop=true, muted=true %} <figcaption> 확보된 공간이 없는 임베드. </figcaption></figure>

  <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/aA8IoNeQTCEudE45hYzh.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/xjCWjSv4Z3YB29jSDGae.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gtYqKkoEse47ErJPqVjg.jpg", controls=true, loop=true, muted=true %} <figcaption> 확보된 공간이 있는 임베드 </figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2XaMbZBmUit1Vz8UBshH.png", alt="이 임베드를 위한 공간을 확보한 경우 누적 레이아웃 이동에 미치는 이전/이후 영향을 보여주는 Lighthouse 보고", width="800", height="148" %} <figcaption> 이 임베드에 대한 공간 확보 후 CLS에 대한 영향을 보여주는 Lighthouse 6.0. </figcaption></figure>

이 문제를 해결하려면 자리 표시자 또는 대체가 있는 포함을 위한 충분한 공간을 미리 계산하여 CLS를 최소화할 수 있습니다. 포함에 사용할 수 있는 하나의 워크플로:

- 브라우저 개발자 도구를 사용하여 최종 임베드 높이를 확인합니다.
- 임베드가 로드되면 포함된 iframe의 크기가 해당 콘텐츠에 맞게 조정됩니다.

임베드를 위한 자리 표시자의 크기와 스타일을 기록해두세요. 미디어 쿼리를 사용하여 다양한 폼 팩터 간에 광고/자리 표시자 크기의 미묘한 차이를 설명해야 하는 경우도 있습니다.

### 동적 콘텐츠 📐

**요약:** 사용자 상호 작용에 대한 응답을 제외하고는 기존 콘텐츠 위에 콘텐츠를 삽입하는 것을 피하는 것이 좋습니다. 이렇게 하면 레이아웃 이동이 발생하기 때문입니다.

사이트를 로드하려고 할 때 뷰포트의 상단 또는 하단에 팝업되는 UI 때문에 레이아웃이 이동하는 것을 경험하신 적이 있을 겁니다. 광고와 마찬가지로 이는 페이지의 나머지 콘텐츠를 이동시키는 배너 및 양식이 있을 때 발생하는 경우가 많습니다.

- "뉴스레터에 가입하세요!" (천천히 해! 우린 방금 만났잖아!)

- "관련 콘텐츠"

- "[iOS/Android] 앱 설치"

- "주문하세요"

- "GDPR 공지"

    <figure>{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/LEicZ7zHqGFrXl67Olve.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/XFvOHc2OB8vUD9GbpL2w.mp4"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PF9ulVHDQOvoWendb6ea.jpg", controls=true, loop=true, muted=true %} <figcaption> 공간이 확보된 동적 콘텐츠. </figcaption></figure>

이러한 유형의 UI 어포던스를 표시해야 하는 경우 미리 뷰포트에 충분한 공간을 확보하여(예: 자리 표시자 또는 스켈레톤 UI 사용) 로드 시 페이지의 콘텐츠가 크게 이동하는 일이 없도록 합니다.

동적으로 콘텐츠를 추가하는 것이 사용자 경험에 중요할 때도 있습니다. 예를 들어 항목 목록에 더 많은 제품을 로드하거나 라이브 피드 콘텐츠를 업데이트할 때와 같은 경우죠. 이러한 경우 예기치 않은 레이아웃 이동을 방지하는 몇 가지 방법이 있습니다.

- 고정 크기 컨테이너에서 이전 콘텐츠를 새 콘텐츠로 교체하거나 전환이 이루어진 후 캐러셀을 사용해 이전 콘텐츠를 제거합니다. 새 콘텐츠를 가져오는 동안 우발적인 클릭이나 탭을 방지하기 위해 전환이 완료될 때까지는 모든 링크와 컨트롤을 비활성화해야 합니다.
- 사용자가 새 콘텐츠 로드를 시작하도록 하여 이동을 예측할 수 있도록 합니다(예: "더 로드" 또는 "새로고침" 버튼 사용). 콘텐츠가 즉시 표시되도록 사용자 상호 작용 전에 콘텐츠를 미리 가져오는 것이 좋습니다. 참고로 사용자 입력 후 500ms 이내에 발생하는 레이아웃 이동은 CLS 계산에 포함되지 않습니다.
- 콘텐츠를 화면 밖에서 원활하게 로드하고 사용자에게 사용 가능하다는 메시지를 오버레이합니다(예: "위로 스크롤" 버튼 사용).

<figure>{% Img src="image/OcYv93SYnIg1kfTihK6xqRDebvB2/TjsYVkcDf03ZOVCcsizv.png", alt="Twitter 및 Chloé 웹사이트로 본 예기치 않은 레이아웃 이동이 없는 동적 콘텐츠 로딩 예시", width="800", height="458" %} <figcaption> 예기치 않은 레이아웃 이동이 없는 동적 콘텐츠 로딩 예시. 왼쪽: Twitter의 실시간 피드 콘텐츠 로딩. 오른쪽: Chloé 웹사이트의 "Load More"(더 로드하기) 예시. YNAP 팀이 <a href="https://medium.com/ynap-tech/how-to-optimize-for-cls-when-having-to-load-more-content-3f60f0cf561c">더 많은 콘텐츠 로드 시 CLS를 최적화한 방법</a>을 알아보세요.</figcaption></figure>

### FOUT/FOIT를 유발하는 웹 글꼴 📝

웹 글꼴을 다운로드하고 렌더링하면 두 가지 방식으로 레이아웃이 변경될 수 있습니다.

- 대체 글꼴이 새 글꼴로 바뀝니다(FOUT - 스타일이 지정되지 않은 텍스트 플래시).
- "보이지 않는" 텍스트는 새 글꼴이 렌더링될 때까지 표시됩니다(FOIT - 보이지 않는 텍스트 플래시).

다음 도구를 사용하면 이를 최소화할 수 있습니다.

- <code>[font-display](/font-display/)</code>를 사용하면 <code>auto</code>, <code>swap</code>, <code>block</code>, <code>fallback</code> 및 <code>optional</code>과 같은 값으로 커스텀 글꼴의 렌더링 동작을 수정할 수 있습니다. 하지만 [optional](http://crrev.com/749080)을 제외한 이 모든 값이 위와 같은 방식 중 하나로 레이아웃 재구성을 발생시킬 수 있습니다.
- [Font Loading API](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#the_font_loading_api)를 사용하면 필요한 글꼴을 가져오는 데 걸리는 시간을 줄일 수 있습니다.

Chrome 83부터 다음과 같은 방식을 추천합니다.

- 핵심 웹 글꼴에 `<link rel=preload>` 사용: 미리 로드된 글꼴은 최초 페인트를 충족할 가능성이 더 높으며 이 경우 레이아웃 이동이 발생하지 않습니다.
- `<link rel=preload>` 및 `font-display: optional` 조합

자세한 내용은 [선택적 글꼴 사전 로드로 레이아웃 이동 및 보이지 않는 텍스트의 깜박임(FOIT) 방지](/preload-optional-fonts/)를 참조하세요.

### 애니메이션 🏃‍♀️

**요약:** 레이아웃 이동을 유발하는 속성의 애니메이션보다 `transform` 애니메이션을 권장합니다.

CSS 속성 값을 변경하면 브라우저가 이러한 변경 사항에 반응해야 할 수 있습니다. `box-shadow` 및 `box-sizing`과 같은 많은 값이 레이아웃 재구성, 페인트 및 합성을 트리거합니다. 보다 비용이 적게 드는 방식으로 다수의 CSS 속성을 변경할 수 있습니다.

어떤 CSS 속성이 레이아웃을 트리거하는지 자세히 알아보려면 [CSS 트리거](https://csstriggers.com/) 및 [고성능 애니메이션](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)을 참조하세요.

### 개발자 도구 🔧

다행히도 누적 레이아웃 이동(CLS)을 측정하고 디버그하는 데 사용할 수 있는 다양한 도구가 있습니다.

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) [6.0](https://github.com/GoogleChrome/lighthouse/releases) 이상에서는 실험실 환경에서 CLS 측정할 수 있도록 지원합니다. 이 버전에서는 가장 많은 레이아웃 이동을 일으키는 노드도 강조 표시해줍니다.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J11KOGFVAOjRMdihwX5t.jpg", alt="Lighthouse 6.0은 메트릭 섹션에서 CLS 측정을 위한 지원도 포함합니다.", width="800", height="309" %}

DevTools의 [Performance 패널](https://developer.chrome.com/docs/devtools/evaluate-performance/)은 Chrome 84부터 **Experience** 섹션에 레이아웃 이동을 강조 표시해줍니다. `Layout Shift` 기록의 **Summary** 보기에는 영향을 받는 부분을 보여주는 직사각형 오버레이와 함께 누적 레이아웃 이동 점수를 표시합니다.

<figure>{% Img src="image/admin/ApDKifKCRNGWI2SXSR1g.jpg", alt="Experience 섹션 확장 시 Chrome DevTools Performance 패널에 표시되는 Layout Shift 기록", width="800", height="438" %} <figcaption>Performance 패널에 새로운 흔적이 기록되면 결과의 <b>Experience</b> 섹션에 <code>Layout Shift</code> 기록이 붉은색 막대와 함께 표시됩니다. 해당 기록을 클릭하면 영향을 받는 요소(예: Moved from/to 항목 참조)가 드릴다운됩니다.</figcaption></figure>

[Chrome User Experience Report](/chrome-ux-report-bigquery/)를 사용해 원본 수준에서 집계된 실제 CLS를 측정할 수도 있습니다. CrUX CLS 데이터는 BigQuery를 통해 제공되며 CLS 성능을 확인하기 위한 [샘플 쿼리](https://github.com/GoogleChrome/CrUX/blob/master/sql/cls-summary.sql)도 사용할 수 있습니다.

이 가이드는 여기까지입니다. 페이지 이동을 줄이는 데 도움이 되기를 바랍니다. :)

*검토해주신 Philip Walton, Kenji Baheux, Warren Maresca, Annie Sullivan, Steve Kobes 및 Gilberto Cocchi에게 감사드립니다.*
