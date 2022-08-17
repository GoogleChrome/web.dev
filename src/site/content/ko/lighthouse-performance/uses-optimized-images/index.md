---
layout: post
title: 이미지를 효율적으로 인코딩
description: |2-

  uses-optimized-images 감사에 대해 알아보세요.
date: 2019-05-02
updated: 2020-06-20
web_lighthouse:
  - uses-optimized-images
---

Lighthouse 보고서의 기회 섹션에는 [kibibytes (KiB)](https://en.wikipedia.org/wiki/Kibibyte)로 잠재적 절감 효과를 제공하는 최적화되지 않은 모든 이미지가 나열되어 있습니다. 페이지가 더 빨리 로드되고 더 적은 데이터를 소비하도록 이러한 이미지를 최적화합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZbPSZtjpa7j4I1k8DylI.png", alt="Lighthouse 효율적인 이미지 인코딩 감사에 대한 스크린샷", width="800", height="263" %}</figure>

## Lighthouse가 이미지를 최적화 가능한 것으로 플래그 지정하는 방법

Lighthouse는 페이지의 모든 JPEG 또는 BMP 이미지를 수집하고 각 이미지의 압축 수준을 85로 설정한 다음 원본 버전을 압축 버전과 비교합니다. 잠재적인 절감 효과가 4KiB 이상인 경우 Lighthouse는 이미지를 최적화 가능한 것으로 플래그 지정합니다.

## 이미지를 최적화하는 방법

다음을 포함하여 이미지를 최적화하기 위해 취할 수 있는 여러 단계가 있습니다.

- [이미지 CDN 사용](/image-cdns/)
- [이미지 압축](/use-imagemin-to-compress-images)
- [애니메이션 GIF를 비디오로 대체](/replace-gifs-with-videos)
- [이미지 로딩 지연](/use-lazysizes-to-lazyload-images)
- [반응형 이미지 제공](/serve-responsive-images)
- [올바른 크기의 이미지 제공](/serve-images-with-correct-dimensions)
- [WebP 이미지 사용](/serve-images-webp)

## GUI 도구를 사용하여 이미지 최적화

또 다른 접근 방식은 컴퓨터에 설치하고 GUI로 실행하는 최적화 프로그램을 통해 이미지를 실행하는 것입니다. 예를 들어 [ImageOptim](https://imageoptim.com/mac)을 사용하여 이미지를 UI로 끌어다 놓으면 눈에 띄게 품질이 저하되지 않고 이미지가 자동으로 압축됩니다. 소규모 사이트를 운영 중이고 모든 이미지를 수동으로 최적화할 수 있다면 이 옵션이 충분할 것입니다.

[Squoosh](https://squoosh.app/)는 또 다른 옵션입니다. Squoosh는 Google Web DevRel 팀에서 유지 관리합니다.

## 스택별 지침

### Drupal

품질을 유지하면서 사이트를 통해 업로드되는 이미지의 크기를 자동으로 최적화하고 줄이는 [모듈](https://www.drupal.org/project/project_module?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=im_vid_3%3A123&f%5B3%5D=&f%5B4%5D=sm_field_project_type%3Afull&f%5B5%5D=&f%5B6%5D=&text=optimize+images&solrsort=iss_project_release_usage+desc&op=Search)을 사용하는 것이 좋습니다. 또한 사이트에서 렌더링되는 모든 이미지에 대해 Drupal의 내장 [반응형 이미지 스타일](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8)(Drupal 8 이상에서 사용 가능)을 사용하고 있는지 확인하십시오.

### Joomla

품질을 유지하면서 이미지를 압축하는 [이미지 최적화 플러그인](https://extensions.joomla.org/instant-search/?jed_live%5Bquery%5D=performance) 사용을 고려하십시오.

### Magento

[이미지를 최적화하는 타사 Magento 확장 프로그램](https://marketplace.magento.com/catalogsearch/result/?q=optimize%20image)을 사용하는 것이 좋습니다.

### WordPress

품질을 유지하면서 이미지를 압축하는 [이미지 최적화 WordPress 플러그인](https://wordpress.org/plugins/search/optimize+images/) 사용을 고려하십시오.

## 리소스

- [**효율적인 이미지 인코딩** 감사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/uses-optimized-images.js)
