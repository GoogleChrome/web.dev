---
layout: post
title: 이미지가 잘못된 종횡비로 나타납니다
description: |2

  올바른 종횡비로 반응형 이미지를 표시하는 방법을 알아보세요.
web_lighthouse:
  - 이미지 종횡비
date: 2019-05-02
updated: 2020-04-29
---

렌더링된 이미지의 [종횡비](https://en.wikipedia.org/wiki/Aspect_ratio_(image))가 원본 파일의 종횡비(*자연스러운* 종회비)와 크게 다른 경우, 렌더링된 이미지가 왜곡되어 사용자에게 불쾌감을 줄 수 있습니다.

## Lighthouse 이미지 종횡비 감사가 실패하는 원인

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 기본 비율로 렌더링될 때 예상 크기와 몇 픽셀 이상 다른 렌더링된 크기를 가진 모든 이미지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OSV0HmZeoy84Tf0Vrt9o.png", alt="Lighthouse 감사에서 잘못된 종횡비로 표시된 이미지가 표시됨", width="800", height="198" %}</figure>

잘못된 이미지 종횡비가 나타나는 두 가지 일반적인 원인은 다음과 같습니다.

- 이미지가 원본 이미지의 크기와 다른 명시적 너비 및 높이 값으로 설정됩니다.
- 이미지가 가변 크기 컨테이너의 백분율 너비와 높이로 설정됩니다.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 이미지가 올바른 종횡비로 표시되는지 확인하기

### 이미지 CDN 사용

이미지 CDN을 사용하면 다양한 크기의 이미지를 생성하는 프로세스를 더 쉽게 자동화할 수 있습니다. 개요를 보려면 [이미지 CDN을 사용하여 이미지 최적화하기](/image-cdns/)를, 직접 실습을 원한다면 [Thumbor 이미지 CDN을 설치하는 방법](/install-thumbor/)을 확인하십시오.

### 이미지의 종횡비에 영향을 미치는 CSS 확인하기

잘못된 종횡비를 일으키는 CSS를 찾는 데 문제가 있다면, Chrome DevTools가 주어진 이미지에 영향을 주는 CSS 선언을 표시할 수 있습니다. 자세한 내용은 [요소에 실제로 적용된 CSS만 보기](https://developer.chrome.com/docs/devtools/css/reference/#computed) 페이지를 참조하세요.

### HTML에서 이미지의 `width` 및 `height` 속성 확인하기

가능하면 HTML에 각 이미지의 `width` 와 `height` 속성을 지정하여 브라우저가 이미지에 공간을 할당할 수 있도록 하는 것이 좋습니다. 이 접근 방식은 이미지가 로드된 후 이미지 아래의 콘텐츠가 움직이지 않도록 하는 데 도움이 됩니다.

그러나 반응형 이미지로 작업하는 경우 뷰포트 크기를 알 때까지 너비와 높이를 알 수 있는 방법이 없기 때문에 HTML에서 이미지 크기를 지정하는 것이 어려울 수 있습니다. 반응형 이미지의 종횡비를 유지하려면 [CSS 종횡비](https://www.npmjs.com/package/css-aspect-ratio) 라이브러리 또는 [종횡비 박스](https://css-tricks.com/aspect-ratio-boxes/)를 사용하는 것이 좋습니다.

마지막으로 [올바른 크기의 이미지 제공](/serve-images-with-correct-dimensions) 게시물을 확인하여 각 사용자의 기기에 적합한 크기의 이미지를 제공하는 방법을 알아보세요.

## 리소스

- [**이미지가 잘못된 종횡비로 나타납니다** 검사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/image-aspect-ratio.js)
- [CSS 종횡비](https://www.npmjs.com/package/css-aspect-ratio)
- [종횡비 상자](https://css-tricks.com/aspect-ratio-boxes/)
- [이미지를 올바른 크기로 제공하기](/serve-images-with-correct-dimensions)
