---
layout: post
title: 이미지 지연 로딩
authors:
  - jlwagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-09
description: |2-

  이 게시물에서는 지연 로딩과 이미지 지연 로딩 시 사용할 수 있는 옵션에 대해 설명합니다.
tags:
  - performance
  - images
feedback:
  - api
---

`<img>` 요소 또는 CSS 배경 이미지로 인라인되기 때문에 이미지가 웹페이지에 나타날 수 있습니다. 이 게시물에서는 두 가지 유형의 이미지를 지연 로드하는 방법에 대해 알아봅니다.

## 인라인 이미지 {: #images-inline }

가장 일반적인 지연 로딩 후보는 `<img>` 요소에서 사용되는 이미지입니다. 인라인 이미지에는 지연 로딩을 위한 세 가지 옵션이 있으며, 이는 브라우저 간 최상의 호환성을 위해 조합하여 사용할 수 있습니다.

- [브라우저 수준 지연 로딩 사용](#images-inline-browser-level)
- [Intersection Observer 사용](#images-inline-intersection-observer)
- [스크롤 및 크기 조정 이벤트 핸들러 사용](#images-inline-event-handlers)

### 브라우저 수준 지연 로딩 사용 {: #images-inline-browser-level }

Chrome과 Firefox는 모두 `loading` 속성으로 지연 로딩을 지원합니다. 이 속성을 `<img>` 요소와 `<iframe>` 요소에 추가할 수 있습니다. `lazy` 값은 이미지가 뷰포트에 있는 경우 즉시 이미지를 로드하고 사용자가 이미지 근처에서 스크롤할 때 다른 이미지를 가져오도록 브라우저에 지시합니다.

{% Aside %} `<iframe loading="lazy">`가 현재 비표준임에 유의하십시오. Chromium에서 구현되었지만 아직 사양이 없으며 이러한 일이 발생하면 향후 변경될 수 있습니다. 사양의 일부가 될 때까지 `loading` 속성을 사용하여 iframes를 지연 로드하지 않는 것이 좋습니다. {% endAside %}

브라우저 지원에 대한 자세한 내용은 MDN의 [브라우저 호환성](https://developer.mozilla.org/docs/Web/HTML/Element/img#Browser_compatibility) 테이블의 `loading` 필드를 참조하십시오. 브라우저가 지연 로딩을 지원하지 않을 경우 속성이 무시되고 평소와 같이 이미지가 즉시 로드됩니다.

대부분의 웹 사이트에서 이 속성을 인라인 이미지에 추가하면 성능이 향상되고 스크롤할 수 없는 이미지를 로드할 때 시간을 절약할 수 있습니다. 이미지 수가 많고 로딩 지연을 지원하지 않는 브라우저 사용자가 혜택을 받을 수 있도록 하려면 이 방법을 다음에 설명하는 방법 중 하나와 결합해야 합니다.

자세히 알아보려면 [웹용 브라우저 수준 지연 로딩](/browser-level-image-lazy-loading/)을 확인하세요.

### Intersection Observer 사용 {: #images-inline-intersection-observer }

`<img>` 요소의 지연 로딩을 폴리필하기 위해 JavaScript를 사용하여 해당 요소가 뷰포트에 있는지 확인합니다. 그렇다면 `src`(종종 `srcset`) 속성이 원하는 이미지 콘텐츠에 대한 URL로 채워집니다.

이전에 지연 로딩 코드를 작성한 경우, `scroll` 또는 `resize`와 같은 이벤트 핸들러를 사용하여 작업을 완료했을 수 있습니다. 이 접근 방식은 여러 브라우저에서 가장 호환되지만 최신 브라우저는 [Intersection Observer API](https://developer.chrome.com/blog/intersectionobserver/)를 통해 요소 가시성을 확인하는 작업을 수행하는 더 성능적이고 효율적인 방법을 제공합니다.

{% Aside %} Intersection Observer는 모든 브라우저, 특히 IE11 이하에서는 지원되지 않습니다. 브라우저 간 호환성이 중요한 경우 성능은 떨어지지만 호환성은 더 높은 스크롤 및 크기 조정 이벤트 핸들러를 사용하여 이미지를 지연 로드하는 방법을 보여주는 [다음 섹션](#images-inline-event-handlersy)을 읽으십시오. {% endAside %}

Intersection Observer는 지루한 요소 가시성 감지 코드를 작성하는 대신 요소를 감시하기 위해 Observer를 등록하기만 하면 되기 때문에 다양한 이벤트 핸들러에 의존하는 코드보다 사용 및 읽기가 더 쉽습니다. 남은 일은 요소가 표시될 때 무엇을 할지 결정하는 것입니다. 지연 로드된 `<img>` 요소에 대해 다음과 같은 기본 마크업 패턴을 가정해 보겠습니다.

```html
<img class="lazy" src="placeholder-image.jpg" data-src="image-to-lazy-load-1x.jpg" data-srcset="image-to-lazy-load-2x.jpg 2x, image-to-lazy-load-1x.jpg 1x" alt="I'm an image!">
```

이 마크업에서 집중해야 할 세 가지 관련 부분이 있습니다.

1. JavaScript에서 요소를 선택하는 `class` 속성.
2. 페이지가 처음 로드될 때 표시될 자리 표시자 이미지를 참조하는 `src` 속성.
3. 요소가 뷰포트에 있을 때 로드할 이미지의 URL을 포함하는 자리 표시자 속성인 `data-src` 및 `data-srcset` 속성.

이제 JavaScript에서 Intersection Observer를 사용하여 이 마크업 패턴을 사용하여 이미지를 지연 로드하는 방법을 살펴보겠습니다.

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to event handlers here
  }
});
```

문서의 `DOMContentLoaded` 이벤트에서, 이 스크립트는 `lazy`의 등급이 있는 모든 `<img>` 요소에 대한 DOM을 조회합니다. Intersection Observer를 사용 가능한 경우, `img.lazy` 요소가 뷰포인트에 진입할 때 콜백을 실행하는 새로운 Observer를 생성하십시오.

{% Glitch { id: 'lazy-intersection-observer', path: 'index.html', previewSize: 0 } %}

Intersection Observer는 모든 최신 브라우저에서 사용할 수 있습니다. 따라서 이를 `loading="lazy"`에 대한 폴리필로 사용하면 대부분의 방문자가 지연 로딩을 사용할 수 있습니다.

## CSS의 이미지 {: #images-css }

`<img>` 태그는 웹 페이지에서 이미지를 사용하는 가장 일반적인 방법이지만 CSS [`background-image`](https://developer.mozilla.org/docs/Web/CSS/background-image) 속성(및 기타 속성)을 통해 이미지를 호출할 수도 있습니다. 브라우저 수준의 지연 로딩은 CSS 배경 이미지에 적용되지 않으므로 지연 로딩할 배경 이미지가 있는 경우 다른 방법을 고려해야 합니다.

가시성에 관계없이 로드하는 `<img>` 요소와는 달리 CSS의 이미지 로드 동작은 더 많은 추측을 통해 수행됩니다. [문서와 CSS 객체 모델](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model) 및 [렌더 트리](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction)가 구축되면 브라우저는 외부 리소스를 요청하기 전에 CSS가 문서에 어떻게 적용되는지 검사합니다. 브라우저가 외부 리소스를 포함하는 CSS 규칙이 현재 구성된 문서에 적용되지 않는다고 판단한 경우 브라우저는 이를 요청하지 않습니다.

JavaScript를 사용하여 요소가 뷰포트 내에 있는지 확인한 다음 배경 이미지를 호출하는 스타일링을 적용하는 요소에 클래스를 적용하여 CSS에서 이미지 로드를 연기하는 데 이 추측 동작을 사용할 수 있습니다. 이 경우 초기 로드 시점 대신 필요한 시점에 이미지가 다운로드됩니다. 예를 들어 큰 히어로 배경 이미지가 포함된 요소를 가정해 보겠습니다.

```html
<div class="lazy-background">
  <h1>Here's a hero heading to get your attention!</h1>
  <p>Here's hero copy to convince you to buy a thing!</p>
  <a href="/buy-a-thing">Buy a thing!</a>
</div>
```

`div.lazy-background` 요소는 일반적으로 일부 CSS에서 호출하는 히어로 배경 이미지를 포함합니다. 그러나 이 지연 로딩 예제에서는 요소가 뷰포트에 있을 때 요소에 추가된 `visible` 클래스를 통해 `div.lazy-background` 요소의 `background-image` 속성을 격리할 수 있습니다.

```css
.lazy-background {
  background-image: url("hero-placeholder.jpg"); /* Placeholder image */
}

.lazy-background.visible {
  background-image: url("hero.jpg"); /* The final image */
}
```

여기에서 JavaScript를 사용하여 요소가 뷰포트에 있는지 확인하고(Intersection Observer 사용!) 이미지를 로드하는 시점에서 `visible` 클래스를 `div.lazy-background` 요소에 추가합니다.

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));

  if ("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  }
});
```

{% Glitch { id: 'lazy-background', path: 'index.html', previewSize: 0 } %}

## 지연 로딩 라이브러리 {: #libraries }

다음 라이브러리를 사용하여 이미지를 지연 로드할 수 있습니다.

- [lazysizes](https://github.com/aFarkas/lazysizes)는 이미지와 iframe을 지연 로드하는 모든 기능을 갖춘 지연 로드 라이브러리입니다. 이것이 사용하는 패턴은 `lazyload` 클래스를 `<img>` 요소와 자동으로 결합하고 `src` 및/또는 `srcset` 속성으로 각각 스와핑되는 콘텐츠인 `data-src` 및/또는 `data-srcset` 속성으로 이미지 URL을 지정해야 한다는 점에서 여기에 제시된 코드 예제와 상당히 유사합니다. 이는 Intersection Observer(폴리필 가능)을 사용하며 [여러 플러그인](https://github.com/aFarkas/lazysizes#available-plugins-in-this-repo)으로 확장하여 비디오 지연 로드 같은 작업을 수행할 수 있습니다. [lazysizes 사용 방법에 대해 자세히 알아보세요](/use-lazysizes-to-lazyload-images/).
- [Vanilla-lazyload](https://github.com/verlok/vanilla-lazyload)는 이미지, 배경 이미지, 비디오, iframe 및 스크립트를 지연 로드하는 가벼운 옵션입니다. 이는 Intersection Observer를 활용하고 반응형 이미지를 지원하며 브라우저 수준의 지연 로딩을 가능하게 합니다.
- [lozad.js](https://github.com/ApoorvSaxena/lozad.js)는 Intersection Observer만 사용하는 또 다른 가벼운 옵션입니다. 따라서 고성능이지만 이전 브라우저에서 사용하려면 먼저 폴리필해야 합니다.
- [yall.js](https://github.com/malchata/yall.js)는 Intersection Observer를 사용하고 이벤트 핸들러로 폴백하는 라이브러리입니다. IE11 및 주요 브라우저와 호환됩니다.
- React 전용 지연 로딩 라이브러리가 필요한 경우 [react-lazyload](https://github.com/jasonslyvia/react-lazyload)를 고려하세요. 이는 Intersection Observer를 사용하지는 않지만, React로 애플리케이션을 개발하는 데 익숙한 사람들을 위해 이미지를 지연 로드하는 친숙한 방법을 *제공합니다*.
