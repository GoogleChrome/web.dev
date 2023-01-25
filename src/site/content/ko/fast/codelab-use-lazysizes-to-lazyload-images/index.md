---
layout: codelab
title: lazysizes를 사용하여 오프스크린 이미지를 지연 로드
authors:
  - katiehempenius
description: 이 코드랩(codelab)에서는 lazysize를 사용하여 현재 뷰포트에 있는 이미지만 로드하는 방법을 알아봅니다.
date: 2018-11-05
glitch: lazysizes
related_post: use-lazysizes-to-lazyload-images
tags:
  - performance
---

지연 로딩은 리소스를 미리 로드하지 않고 필요할 때까지 리소스 로드를 기다리는 접근 방식입니다. 이렇게 하면 초기 페이지 로드 시 로드 및 구문 분석해야 하는 리소스의 양을 줄여 성능을 향상시킬 수 있습니다.

초기 페이지 로드 중에 있는 오프스크린 이미지는 이 기술을 적용하기 좋은 이상적인 후보입니다. 무엇보다도 [lazysizes](https://github.com/aFarkas/lazysizes)를 사용하면 이를 매우 간단하게 구현할 수 있습니다.

## 페이지에 lazysizes 스크립트 추가

{% Instruction 'remix' %}

`lazysizes.min.js`가 이미 다운로드되어 이 글리치(Glitch)에 추가되었습니다. 이를 페이지에 포함하려면:

- 다음 `<script>` 태그를 `index.html`에 추가합니다.

```html/0
  <script src="lazysizes.min.js" async></script>
  <!-- Images End -->
</body>
```

{% Aside %} [lazysizes.min.js](https://raw.githubusercontent.com/aFarkas/lazysizes/gh-pages/lazysizes.min.js) 파일이 이미 이 프로젝트에 추가되었으므로 별도로 추가할 필요가 없습니다. 방금 추가한 스크립트는 이 스크립트를 사용할 수 있습니다. {% endAside %}

lazysizes는 사용자가 페이지를 스크롤할 때 이미지를 지능적으로 로드하고 사용자가 곧 보게 될 이미지의 우선 순위를 지정합니다.

## 지연 로드할 이미지 표시

- 지연 로드해야 하는 이미지에 `lazyload`를 추가합니다. 또한, `src` 속성을 `data-src`로 변경합니다.

예를 들어, `flower3.png` 의 변경 사항은 다음과 같습니다.

```html/1/0
<img src="images/flower3.png" alt="">
<img data-src="images/flower3.png" class="lazyload" alt="">
```

이 예에서는 `flower3.png` , `flower4.jpg` 및 `flower5.jpg`를 지연 로드해보십시오.

{% Aside %} `src` 속성을 `data-src`로 변경해야 하는 이유가 궁금할 것입니다. 이 속성이 변경되지 않으면 모든 이미지가 지연 로드되는 대신 즉시 로드됩니다. `data-src`는 브라우저가 인식하는 속성이 아니므로 이 속성을 포함하는 이미지 태그를 만나면 이미지를 로드하지 않습니다. 이 경우에는 브라우저가 아니라 lazysizes 스크립트가 이미지를 로드해야 하는 시기를 결정할 수 있기 때문에 이는 좋게 해석됩니다. {% endAside %}

## 실제 작동 보기

그게 전부입니다! 이러한 변경 사항이 실제로 작동하는지 확인하려면 다음 단계를 따르십시오.

{% Instruction 'preview' %}

- 콘솔을 열고 방금 추가한 이미지를 찾습니다. 페이지를 아래로 스크롤할 때 클래스가 `lazyload`에서 `lazyloaded`로 변경되어야 합니다.

{% Img src="image/admin/yXej5KAOMzoqoQAB2paq.png", alt="지연 로드되고 있는 이미지", width="428", height="252" %}

- 페이지를 아래로 스크롤할 때 이미지 파일이 개별적으로 로드되는 것을 보려면 네트워크 패널을 보십시오.

{% Img src="image/admin/tcQpLeAubOW1l42eyXiW.png", alt="지연 로드되고 있는 이미지", width="418", height="233" %}

## Lighthouse를 사용하여 확인

마지막으로 Lighthouse를 사용하여 이러한 변경 사항을 확인하는 것이 좋습니다. Lighthouse의 "Defer offscreen images" 성능 감사는 오프스크린 이미지에 지연 로드를 추가하는 것을 잊었는지 여부를 나타냅니다.

{% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

1. **Defer offscreen images** 감사가 통과되었는지 확인합니다.

{% Img src="image/admin/AWMJnCEi3IAgANHhTgiC.png", alt="Lighthouse에서 '효율적으로 이미지 인코딩' 감사 통과", width="800", height="774" %}

성공했습니다! 여러분의 페이지에 이미지를 지연 로드하기 위해 lazysizes를 사용했습니다.
