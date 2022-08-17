---
layout: post
title: 오프스크린 이미지 지연
description: 오프스크린 이미지 감사에 대해 알아봅니다.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - 오프스크린 이미지
---

Lighthouse 보고서의 기회 섹션에는 페이지의 모든 오프스크린 이미지 또는 숨겨진 이미지와 함께 [KiB 단위](https://en.wikipedia.org/wiki/Kibibyte)의 잠재적 절감 효과가 나열됩니다. [상호 작용까지 시간](/tti/)을 낮추기 위해 모든 중요한 리소스가 로드를 완료한 후에 이러한 이미지를 지연 로드하는 것이 좋습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/agMyJtIarLruD8iuz0Mt.png", alt="Lighthouse 오프스크린 이미지 지연 감사를 보여주는 스크린샷", width="800", height="416" %}</figure>

[lazysizes codelab을 사용한 오프스크린 이미지 지연 로드](/codelab-use-lazysizes-to-lazyload-images)도 참조하세요.

## 스택별 지침

### AMP

[`amp-img`](https://amp.dev/documentation/components/amp-img/)로 이미지를 자동으로 지연 로드합니다. [이미지](https://amp.dev/documentation/guides-and-tutorials/develop/media_iframes_3p/#images) 가이드를 참조하세요.

### Drupal

이미지를 지연 로드할 수 있는 [Drupal 모듈](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A67&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=%22lazy+load%22&solrsort=iss_project_release_usage+desc&op=Search)을 설치합니다. 이러한 모듈은 성능을 향상시키기 위해 오프스크린 이미지를 지연시키는 기능을 제공합니다.

### Joomla

오프스크린 이미지를 지연시키는 기능을 제공하는 [lazy-load Joomla 플러그인](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=lazy%20loading)을 설치하거나 해당 기능을 제공하는 템플릿으로 전환합니다. Joomla 4.0부터 "콘텐츠 - 이미지 로딩 지연" 플러그인을 통해 전용 지연 로딩 플러그인을 사용할 수 있습니다. [AMP 플러그인](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=amp) 사용도 고려해 보세요.

### Magento

웹 플랫폼의 [지연 로드](/browser-level-image-lazy-loading/) 기능을 사용하도록 제품 및 카탈로그 템플릿을 수정하는 것이 좋습니다.

### WordPress

오프스크린 이미지를 지연시키는 기능을 제공하는 [lazy-load WordPress 플러그인](https://wordpress.org/plugins/search/lazy+load/)을 설치하거나 해당 기능을 제공하는 테마로 전환합니다. [AMP 플러그인](https://wordpress.org/plugins/amp/) 사용도 고려해 보세요.

## 리소스

- [**오프스크린 이미지 지연** 감사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/offscreen-images.js)
