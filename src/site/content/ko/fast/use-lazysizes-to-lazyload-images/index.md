---
layout: post
title: lazysizes를 사용하여 이미지 지연 로드
authors:
  - katiehempenius
description: 지연 로드는 리소스를 미리 로드하는 것이 아니라 필요한 대로 로드하는 전략입니다. 이 방법은 초기 페이지 로드 중에 리소스를 확보하고 사용되지 않는 애셋을 로드하지 않습니다.
date: 2018-11-05
updated: 2019-04-10
codelabs:
  - codelab-use-lazysizes-to-lazyload-images
tags:
  - performance
  - images
feedback:
  - api
---

{% Aside 'note' %} 이제 브라우저 수준의 지연 로딩을 사용할 수 있습니다! `loading` 속성을 사용하는 방법과 아직 지원하지 않는 브라우저에 대한 fallback으로 lazysize를 활용하는 방법을 알아보려면 [웹용 내장 지연 로드](/browser-level-image-lazy-loading/) 문서를 참조하세요. {% endAside %}

**지연 로드**는 리소스를 미리 로드하는 것이 아니라 필요한 대로 로드하는 전략입니다. 이 방법은 초기 페이지 로드 중에 리소스를 확보하고 사용되지 않는 애셋을 로드하지 않습니다.

초기 페이지 로드 중에 있는 오프스크린 이미지는 이 기술을 적용하기 좋은 이상적인 후보입니다. 무엇보다도 [lazysizes](https://github.com/aFarkas/lazysizes)를 사용하면 이를 매우 간단하게 구현할 수 있습니다.

## lazysizes란 무엇입니까?

[lazysizes](https://github.com/aFarkas/lazysizes)는 이미지를 지연 로드하는 데 가장 널리 사용되는 라이브러리입니다. 사용자가 페이지를 이동할 때 이미지를 지능적으로 로드하고 사용자가 곧 보게 될 이미지의 우선 순위를 지정하는 스크립트입니다.

## lazysizes 추가

lazysizes를 추가하는 것은 간단합니다.

- 페이지에 lazysizes 스크립트를 추가합니다.
- 지연 로드할 이미지를 선택합니다.
- 해당 이미지에 대한 `<img>` 및/또는 `<picture>` 태그를 업데이트합니다.

### lazysizes 스크립트 추가

페이지에 [lazysizes 스크립트](https://github.com/aFarkas/lazysizes/blob/gh-pages/lazysizes.min.js)를 추가합니다.

```html
<script src="lazysizes.min.js" async></script>
```

### `<img>` 및/또는 `<picture>` 태그 업데이트

**`<img>` 태그 지침**

**이전:**

```html
<img src="flower.jpg" alt="">
```

**이후:**

```html
<img data-src="flower.jpg" class="lazyload" alt="">
```

`<img>` 태그를 업데이트할 때 두 가지를 변경합니다.

- **`lazyload` 클래스 추가**: 이는 이미지가 지연 로드되어야 함을 lazysizes에 나타냅니다.
- **`src` 속성을 `data-src`로 변경**: 이미지를 로드할 때 lazysizes 코드는 `data-src` 속성의 값을 사용하여 `src` 속성을 설정합니다.

**`<picture>` 태그 지침**

**이전:**

```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

**이후:**

```html
<picture>
  <source type="image/webp" data-srcset="flower.webp">
  <source type="image/jpeg" data-srcset="flower.jpg">
  <img data-src="flower.jpg" class="lazyload" alt="">
</picture>
```

`<picture>` 태그를 업데이트할 때 다음 두 가지를 변경합니다.

- `<img>` 태그에 `lazyload` 클래스를 추가합니다.
- `<source>` 태그 `srcset` 속성을 `data-srcset` 변경하십시오.

{% Aside 'codelab' %} [현재 표시 영역에 있는 이미지만 로드하려면 lazysizes를 사용](/codelab-use-lazysizes-to-lazyload-images)합니다. {% endAside %}

## 확인하기

DevTools를 열고 페이지를 아래로 스크롤하여 이러한 변경 사항이 실제로 적용되는지 확인합니다. 스크롤하면 새로운 네트워크 요청이 발생하고 `<img>` 태그 클래스가 `lazyload`에서 `lazyloaded`로 변경됩니다.

또한 Lighthouse를 사용하여 오프스크린 이미지를 지연 로드하는 것을 잊지 않았는지 확인할 수 있습니다. Lighthouse 성능 감사(**Lighthouse &gt; 옵션 &gt; 성능**)를 실행하고 **오프스크린 이미지 연기** 감사 결과를 찾습니다.
