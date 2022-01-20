---
title: CSS의 mask-image 속성을 사용하여 이미지에 효과 적용
subhead: CSS 마스킹은 이미지를 마스크 레이어로 사용할 수 있는 옵션을 제공합니다. 즉, 이미지, SVG 또는 그라디언트를 마스크로 사용하여 이미지 편집기 없이도 흥미로운 효과를 만들 수 있습니다.
description: CSS 마스킹은 이미지를 마스크 레이어로 사용할 수 있는 옵션을 제공합니다. 즉, 이미지, SVG 또는 그라디언트를 마스크로 사용하여 이미지 편집기 없이도 흥미로운 효과를 만들 수 있습니다.
authors:
  - rachelandrew
date: 2020-09-14
hero: image/admin/uNWkHLVFNcTDk09OplrA.jpg
alt: 마스크를 쓴 테디베어.
tags:
  - blog
  - css
feedback:
  - api
---

`clip-path` 속성을 사용하여 [요소를 자르면](/css-clipping) 잘린 영역이 보이지 않게 됩니다. 대신 이미지의 일부를 불투명하게 만들거나 이미지에 다른 효과를 적용하려면 마스킹을 사용해야 합니다. 이 게시물은 CSS에서 [`mask-image`](https://developer.mozilla.org/docs/Web/CSS/mask-image) 속성을 사용하는 방법을 설명합니다. 이를 통해 마스크 레이어로 사용할 이미지를 지정할 수 있습니다. 이렇게 하면 세 가지 옵션이 제공됩니다. 즉, 이미지 파일을 마스크, SVG 또는 그라디언트로 사용할 수 있습니다.

## 브라우저 호환성

대부분의 브라우저는 표준 CSS 마스킹 속성을 부분적으로만 지원합니다. 최상의 브라우저 호환성을 얻으려면 표준 속성과 함께 `-webkit-` 접두어를 사용해야 합니다. 전체 브라우저 지원 정보를 보려면 [CSS 마스크를 사용할 수 있습니까?](https://caniuse.com/#feat=css-masks)를 참조하세요.

브라우저가 접두어 속성 사용을 잘 지원하지만 마스킹을 사용하여 이미지 위에 있는 텍스트를 표시할 때 마스킹을 사용할 수 없는 경우 발생할 상황에 주의하세요. `mask-image` 또는 `-webkit-mask-image`에 대한 지원을 감지하기 위한 기능 쿼리를 사용하고 마스킹된 버전을 추가하기 전에 읽기 가능한 대체 수단을 제공하는 것이 좋습니다.

```css
@supports(-webkit-mask-image: url(#mask)) or (mask-image: url(#mask)) {
  /* code that requires mask-image here. */
}
```

## 이미지로 마스킹

`mask-image` 속성은 `background-image` 속성과 유사한 방식으로 작동합니다. `url()` 값을 사용하여 이미지를 전달합니다. 마스크 이미지에는 투명하거나 반투명한 영역이 있어야 합니다.

완전히 투명한 영역은 해당 영역 아래에 있는 이미지의 일부를 보이지 않게 합니다. 그러나 반투명한 영역을 사용하면 원본 이미지의 일부가 관통되어 보일 수 있습니다. 아래에서 Glitch의 차이를 확인할 수 있습니다. 첫 번째 이미지는 마스크가 없는 풍선의 원본 이미지입니다. 마스크가 적용된 두 번째 이미지에는 완전히 투명한 배경에 흰색 별이 있습니다. 세 번째 이미지에는 그라데이션 투명도의 배경에 흰색 별이 있습니다.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-image?path=index.html&amp;previewSize=100" title="mask-image on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

이 예제에서는 값이 `cover`인 `mask-size` 속성도 사용되었습니다. 이 속성은 [`background-size`](https://developer.mozilla.org/docs/Web/CSS/background-size)와 같은 방식으로 작동합니다. `cover` 및 `contain` 키워드를 사용하거나 유효한 길이 단위 또는 백분율을 사용하여 배경 크기를 지정할 수 있습니다.

작은 이미지를 반복 패턴으로 사용하기 위해 배경 이미지를 반복하는 것처럼 마스크를 반복할 수도 있습니다.

## SVG로 마스킹

이미지 파일을 마스크로 사용하는 대신 SVG를 사용할 수 있습니다. 이를 위해 몇 가지 방법을 이용할 수 있습니다. 첫 번째는 `<mask>` 요소를 SVG 내에 두고 `mask-image` 속성에서 해당 요소의 ID를 참조하는 것입니다.

```html
<svg width="0" height="0" viewBox="0 0 400 300">
  <defs>
    <mask id="mask">
      <rect fill="#000000" x="0" y="0" width="400" height="300"></rect>
      <circle fill="#FFFFFF" cx="150" cy="150" r="100" />
      <circle fill="#FFFFFF" cx="50" cy="50" r="150" />
    </mask>
  </defs>
</svg>

<div class="container">
    <img src="balloons.jpg" alt="Balloons">
</div>
```

```css
.container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  -webkit-mask-image: url(#mask);
  mask-image: url(#mask);
}
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3HnPhISiVazDTwezxfcy.jpg", alt="SVG 마스크 사용 예", width="699", height="490" %}</figure>

이 접근 방식의 장점은 마스크가 이미지뿐만 아니라 모든 HTML 요소에 적용될 수 있다는 것입니다. 불행히도 이 접근 방식을 지원하는 브라우저는 Firefox뿐입니다.

그러나 이미지를 마스킹하는 가장 일반적인 시나리오의 경우 SVG에 이미지를 포함할 수 있으므로 모든 것이 손실되지는 않습니다.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-image-svg-image?path=README.md&amp;previewSize=100" title="mask-image-svg-image on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## 그라데이션으로 마스킹

CSS 그라디언트를 마스크로 사용하면 이미지나 SVG를 만드는 수고를 들이지 않고도 마스킹된 영역을 간편하게 얻을 수 있습니다.

예를 들어, 마스크로 사용되는 간단한 선형 그라디언트는 이미지의 하단 부분이 캡션 아래에서 너무 어두워 보이지 않도록 할 수 있습니다.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-linear-gradient?path=README.md&amp;previewSize=100" title="mask-linear-gradient on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

지원되는 모든 그라디언트 유형을 사용하고 원하는 만큼 창의적으로 만들 수 있습니다. 다음 예제에서는 방사형 그라디언트를 사용하여 캡션 뒤를 비추는 원형 마스크를 만듭니다.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-radial-gradient?path=README.md&amp;previewSize=100" title="mask-radial-gradient on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## 여러 마스크 사용

배경 이미지와 마찬가지로 여러 마스크 소스를 지정하고 결합하여 원하는 효과를 얻을 수 있습니다. 이것은 CSS 그라디언트로 생성된 패턴을 마스크로 사용하려는 경우에 특히 유용합니다. 일반적으로 여러 배경 이미지를 사용하므로 마스크로 쉽게 변환할 수 있습니다.

예를 들어 [이 기사](https://cssgradient.io/blog/gradient-patterns/)에서 멋진 바둑판 패턴을 찾았습니다. 배경 이미지를 사용하는 코드는 다음과 같습니다.

```css
background-image:
  linear-gradient(45deg, #ccc 25%, transparent 25%),
  linear-gradient(-45deg, #ccc 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #ccc 75%),
  linear-gradient(-45deg, transparent 75%, #ccc 75%);
background-size:20px 20px;
background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

이 패턴이나 배경 이미지용으로 설계된 다른 패턴을 마스크로 바꾸려면 `background-*` 속성을 `-webkit` 접두어가 붙은 속성을 포함해 관련 `mask` 속성으로 대체해야 합니다.

```css
-webkit-mask-image:
  linear-gradient(45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(-45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(45deg, rgba(0,0,0,0.2) 75%, #000000 75%),
  linear-gradient(-45deg, rgba(0,0,0,0.2) 75%, #000000 75%);
-webkit-mask-size:20px 20px;
  -webkit-mask-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

이미지에 그라디언트 패턴을 적용하면 정말 멋진 효과를 얻을 수 있습니다. Glitch를 다시 결합하고 다른 변형을 테스트해 보세요.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-checkers?path=README.md&amp;previewSize=100" title="mask-checkers on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

클리핑과 함께 CSS 마스크는 그래픽 애플리케이션을 사용하지 않고도 이미지 및 기타 HTML 요소에 흥미를 더할 수 있는 방법입니다.

*<span>Unsplash에서 제공된 <a href="https://unsplash.com/@juliorionaldo">Julio Rionaldo</a>의 사진</span>.*
