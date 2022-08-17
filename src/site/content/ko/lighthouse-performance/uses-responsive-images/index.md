---
layout: post
title: 적절한 크기의 이미지
description: |2-

  uses-responsive-images 감사에 대해 알아봅니다.
date: 2019-05-02
updated: 2020-06-20
web_lighthouse:
  - uses-responsive-images
---

Lighthouse 보고서의 '기회' 섹션에는 페이지에서 크기가 적절하지 않은 모든 이미지와 함께 잠재적인 절감량이 [KiB(kibibytes)](https://en.wikipedia.org/wiki/Kibibyte) 단위로 나열됩니다. 이러한 이미지의 크기를 조정하여 데이터를 절약하고 페이지 로드 시간을 개선하세요.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GK6XQhAJcjZsYJe8myka.png", alt="Lighthouse의 적절한 크기의 이미지 감사를 보여주는 스크린샷", width="800", height="264" %}</figure>

## Lighthouse가 과도한 크기의 이미지를 계산하는 방법

페이지의 각 이미지에 대해 Lighthouse는 렌더링된 이미지의 크기를 실제 이미지의 크기와 비교합니다. 렌더링된 크기에는 장치 픽셀 비율도 고려됩니다. 렌더링된 크기가 실제 크기보다 4KiB 이상 작으면 이미지가 감사에 실패합니다.

## 이미지 크기를 적절하게 조정하기 위한 전략

이상적으로, 사용자 화면에 렌더링된 버전보다 큰 이미지가 페이지에 제공되어서는 안 됩니다. 그보다 크면 바이트가 낭비되고 페이지 로드 시간이 느려집니다.

적절한 크기의 이미지를 제공하기 위한 주요 전략을 "반응형 이미지"라고 합니다. 반응형 이미지를 사용하면 각 이미지의 여러 버전을 생성한 다음 미디어 쿼리, 뷰포트 크기 등을 사용하여 HTML 또는 CSS에서 사용할 버전을 지정합니다. 자세한 내용은 [반응형 이미지 제공](/serve-responsive-images)을 참조하세요.

[이미지 CDN](/image-cdns/)은 적절한 크기의 이미지를 제공하기 위한 또 다른 주요 전략입니다. 이미지 변환을 위한 웹 서비스 API와 같은 이미지 CDN을 생각해볼 수 있습니다.

또 다른 전략은 SVG와 같은 벡터 기반 이미지 형식을 사용하는 것입니다. SVG 이미지는 한정된 양의 코드를 사용해 어떤 크기로든 확장할 수 있습니다. 자세한 내용은 [복잡한 아이콘을 SVG로 바꾸기](/responsive-images/#replace-complex-icons-with-svg)를 참조하세요.

[gulp-responsive](https://www.npmjs.com/package/gulp-responsive) 또는 [responsive-images-generator](https://www.npmjs.com/package/responsive-images-generator)와 같은 도구를 사용하면 이미지를 여러 형식으로 변환하는 프로세스를 자동화할 수 있습니다. 이미지를 업로드하거나 페이지에서 이미지를 요청할 때 여러 버전을 생성할 수 있는 이미지 CDN도 있습니다.

## 스택별 지침

### AMP

[`amp-img`](https://amp.dev/documentation/components/amp-img/?format=websites) 구성 요소의 [`srcset`](/use-srcset-to-automatically-choose-the-right-image/) 지원을 사용하여 화면 크기에 따라 사용할 이미지 자산을 지정합니다. [srcset, 크기 및 높이가 있는 반응형 이미지](https://amp.dev/documentation/guides-and-tutorials/develop/style_and_layout/art_direction/)를 참조하세요.

### Angular

CDK(Component Dev Kit)의 [`BreakpointObserver` 유틸리티](https://material.angular.io/cdk/layout/overview)를 사용하여 이미지 중단점을 관리하는 것이 좋습니다.

### Drupal

보기 모드, 보기 또는 WYSIWYG 편집기를 통해 업로드된 이미지를 통해 이미지 필드를 렌더링할 때 내장된 [반응형 이미지 스타일](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8) 기능을 사용합니다(Drupal 8 이상에서 사용 가능).

### Gatsby

[gatsby-image](https://www.gatsbyjs.com/plugins/gatsby-image/) 플러그인을 사용하여 스마트폰 및 태블릿에 사용할 여러 개의 작은 이미지를 생성합니다. 효율적인 지연 로딩을 위해 SVG 이미지 자리 표시자를 만들 수도 있습니다.

### Joomla

[반응형 이미지 플러그인](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=responsive%20images) 사용을 고려하세요.

### WordPress

필요한 이미지 크기를 사용할 수 있도록 [미디어 라이브러리](https://wordpress.org/support/article/media-library-screen/)를 통해 직접 이미지를 업로드한 다음, 미디어 라이브러리에서 이미지를 삽입하거나 이미지 위젯을 사용하여 최적의 이미지 크기(반응형 중단점을 위한 크기 포함)가 사용되도록 합니다. 크기가 용도에 적합한 경우가 아니면 `Full Size` 이미지를 사용하지 마세요. [게시물 및 페이지에 이미지 삽입하기](https://wordpress.org/support/article/inserting-images-into-posts-and-pages/)를 참조하세요.

## 리소스

- [**적절한 크기의 이미지** 감사 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/uses-responsive-images.js)
- [올바른 크기의 이미지 제공](/serve-images-with-correct-dimensions)
