---
layout: post
title: 미디어 쿼리로 CSS 배경 이미지 최적화
authors:
  - demianrenzulli
description: 미디어 쿼리를 사용하여 필요한 만큼만 이미지를 전송합니다. 이는 일반적으로 반응형 이미지라고 하는 기술입니다.
date: 2020-03-05
updated: 2020-03-05
tags:
  - performance
---

많은 사이트에서 특정 화면에 최적화되지 않은 이미지, 즉 많은 리소스를 요청하고 일부 장치에서는 절대 사용하지 않을 스타일이 포함된 대용량 CSS 파일을 보냅니다. 미디어 쿼리를 사용하는 것은 사용자에게 전송되는 데이터의 양을 줄이고 페이지 로드 성능을 개선하기 위함이며, 미디어 쿼리는 맞춤형 스타일시트와 자산을 다양한 화면에 전달하는 데 널리 사용되는 기술입니다. 이 가이드에서는 **반응형 이미지**라고 하는 기술인 미디어 쿼리를 사용하여 일반적으로 필요한 만큼만 이미지를 보내는 방법을 보여줍니다.

## 전제 조건

이 가이드는 사용자가 [Chrome DevTools](https://developer.chrome.com/docs/devtools/)에 익숙하다고 가정합니다. 원하는 경우 다른 브라우저의 DevTools를 대신 사용할 수 있습니다. 이 가이드의 Chrome DevTools 스크린샷을 선택한 브라우저의 관련 기능에 다시 매핑하기만 하면 됩니다.

## 반응형 배경 이미지의 이해하기

먼저 최적화되지 않은 데모의 네트워크 트래픽을 분석합니다.

1. 새 Chrome 탭에서 [최적화되지 않은 데모](https://use-media-queries-unoptimized.glitch.me/)를 엽니다. {% Instruction 'devtools-network', 'ol' %} {% Instruction 'reload-page', 'ol' %}

{% Aside %} DevTools에 대해 더 많은 도움이 필요하면 [Chrome DevTools로 네트워크 활동 검사하기](https://developer.chrome.com/docs/devtools/network/)를 확인하세요. {% endAside %}

요청되는 유일한 이미지는 **1006KB** 크기인 `background-desktop.jpg`입니다.

<figure>{% Img src="image/admin/K8P4MHp2FSnZYTw3ZVkG.png", alt="최적화되지 않은 배경 이미지에 대한 DevTools 네트워크 추적.", width="800", height="126" %}</figure>

브라우저 창의 크기를 조정하고 네트워크 로그에 페이지에서 수행하는 새 요청이 표시되지 않는지 확인합니다. 이는 모든 화면 크기에 동일한 이미지 배경이 사용됨을 의미합니다.

[style.css](https://use-media-queries-unoptimized.glitch.me/style.css)에서 배경 이미지를 제어하는 스타일을 볼 수 있습니다.

```css
body {
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat; background-size: cover;
  background-image: url(images/background-desktop.jpg);
}
```

사용된 각 속성의 의미는 다음과 같습니다.

- `background-position: center center`: 이미지를 세로와 가로의 중앙에 배치합니다.
- `background-repeat: no-repeat`: 이미지를 한 번만 표시합니다.
- `background-attachment: fixed`: 배경 이미지가 스크롤되지 않도록 합니다.
- `background-size: cover`: 전체 컨테이너를 덮도록 이미지 크기를 조정합니다.
- `background-image: url(images/background-desktop.jpg)`: 이미지의 URL입니다.

이러한 스타일 속성을 결합하여 사용하면 배경 이미지를 다양한 화면 높이와 너비에 맞게 조정하도록 브라우저에 지시합니다. 이것은 반응형 배경을 달성하기 위한 첫 번째 단계입니다.

모든 화면 크기에 단일 배경 이미지를 사용하는 경우 몇 가지 제한 사항이 있습니다.

- 휴대전화와 같은 일부 장치의 경우 더 작고 가벼운 이미지 배경을 사용해도 똑같이 좋아 보여도 화면 크기에 관계없이 동일한 양의 바이트가 전송됩니다. 일반적으로 여러분은 성능을 향상하고 사용자 데이터를 절약하기 위해 사용자 화면에서 좋아 보이는 가능한 작은 이미지를 보내려고 합니다.
- 더 작은 장치에서는 이미지가 전체 화면을 덮도록 늘이거나 일부를 잘라 표시하여 사용자에게 배경의 관련 부분을 잠재적으로 숨길 수 있습니다.

다음 섹션에서는 사용자 장치에 따라 다양한 배경 이미지를 로드하기 위해 최적화를 적용하는 방법을 배웁니다.

## 미디어 쿼리 사용하기

미디어 쿼리를 사용하는 것은 특정 미디어 또는 장치 유형에만 적용되는 스타일시트를 선언하는 일반적인 기술입니다. 특정 스타일이 정의되는 일련의 중단점을 정의할 수 있는 [@media 규칙](https://developer.mozilla.org/docs/Web/CSS/@media)을 사용하여 구현됩니다. `@media` 규칙에서 정의한 조건(예: 특정 화면 너비)이 충족되면 중단점 내부에 정의된 스타일 그룹이 적용됩니다.

다음 단계를 사용하여 페이지를 요청하는 장치의 최대 너비에 따라 다른 이미지가 사용되도록 [사이트](https://use-media-queries-unoptimized.glitch.me/)에 미디어 쿼리를 적용할 수 있습니다.

- `style.css`에서 배경 이미지 URL이 포함된 줄을 제거합니다.

```css//4
body {
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat; background-size: cover;
  background-image: url(images/background-desktop.jpg);
}
```

- 다음으로, 모바일, 태블릿 및 데스크톱 화면이 일반적으로 갖는 픽셀 단위의 공통 치수를 기반으로 각 화면 너비에 대한 중단점을 생성합니다.

모바일의 경우:

```css
@media (max-width: 480px) {
    body {
        background-image: url(images/background-mobile.jpg);
    }
}
```

태블릿의 경우:

```css
@media (min-width: 481px) and (max-width: 1024px) {
    body {
        background-image: url(images/background-tablet.jpg);
    }
}
```

데스크톱 장치의 경우:

```css
@media (min-width: 1025px) {
    body {
	    background-image: url(images/background-desktop.jpg);
   }
}
```

여러분의 브라우저에 최적화된 버전의 [style.css](https://use-media-queries-optimized.glitch.me/style.css)를 열어 변경 사항을 확인합니다.

{% Aside %} 최적화된 데모에 사용된 이미지는 이미 다양한 화면 크기에 맞게 크기가 조정되어 있습니다. 이미지 크기를 조정하는 방법을 보여주는 것은 이 가이드의 범위를 벗어납니다. 그러나 이에 대해 더 알고 싶다면 [반응형 이미지 제공 가이드](/serve-responsive-images/)에서 다루는 [선명한 npm 패키지](https://www.npmjs.com/package/sharp) 및 [ImageMagick CLI](https://www.imagemagick.org/script/index.php)와 같은 유용한 도구를 확인하세요. {% endAside %}

## 다른 장치 측정

다음으로 다양한 화면 크기와 시뮬레이션된 모바일 장치로 결과 사이트를 시각화합니다.

1. 새 Chrome 탭에서 [최적화된 사이트](https://use-media-queries-optimized.glitch.me/)를 엽니다.
2. 뷰포트를 좁게 만듭니다(`480px` 미만). {% Instruction 'devtools-network', 'ol' %} {% Instruction 'reload-page', 'ol' %} `background-mobile.jpg` 이미지가 어떻게 요청되었는지 확인합니다.
3. 뷰포트를 더 넓게 만듭니다. `480px`보다 넓은 경우 `background-tablet.jpg`가 어떻게 요청되는지 확인합니다. `1025px` 보다 넓은 경우 `background-desktop.jpg`가 어떻게 요청되는지 확인합니다.

브라우저 화면의 너비가 변경되면 새 이미지가 요청됩니다.

특히 너비가 모바일 중단점에서 정의한 값 미만(480px)인 경우 다음 네트워크 로그가 표시됩니다.

<figure>{% Img src="image/admin/jd2kHIefYf91udpFEmvx.png", alt="최적화된 배경 이미지를 위한 DevTools 네트워크 추적.", width="800", height="125" %}</figure>

새로운 모바일 배경의 크기는 데스크톱보다 **67% 작습니다**.

## 요약

이 가이드에서는 미디어 쿼리를 적용하여 특정 화면 크기에 맞게 조정된 배경 이미지를 요청하고, 휴대폰과 같은 작은 장치에서 사이트에 액세스할 때 바이트를 절약하는 방법을 배웠습니다. 여러분은 `@media` 규칙을 사용하여 반응형 배경을 구현했습니다. 이 기술은 모든 브라우저에서 널리 지원됩니다. 새로운 CSS 기능인 [image-set()](https://www.w3.org/TR/css-images-4/#image-set-notation)은 더 적은 수의 코드로 동일한 목적을 달성할 수 있습니다. 이 글을 작성하는 시점에 이 기능은 모든 브라우저에서 지원되고 있지 않지만 이 기술에 대한 흥미로운 대안이 될 수 있으므로 기술 적용이 어떻게 발전하는지 계속 주시하고 싶을 것입니다.
