---
layout: post
title: 웹용 브라우저 수준 이미지 지연 로딩
subhead: 지연 로딩이 드디어 기본 제공됩니다!
authors:
  - houssein
  - addyosmani
  - mathiasbynens
date: 2019-08-06
updated: 2020-07-16
hero: image/admin/F6VE4QkpCsomiJilTFNG.png
alt: 로딩 이미지와 자산이 있는 전화 개요
description: 이 게시물은 로딩 속성과 이를 이용해 이미지 로딩을 제어하는 방법을 다룹니다.
tags:
  - blog
  - performance
feedback:
  - api
---

이제 웹에서 지연 로딩 이미지에 대한 브라우저 수준 지원이 제공됩니다! 이 비디오에서는 이 기능의 [데모](https://mathiasbynens.be/demo/img-loading-lazy)를 보여줍니다.

<figure data-size="full">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/native-lazy-loading/lazyload.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/native-lazy-loading/lazyload.mp4" type="video/mp4">
  </source></source></video></figure>

Chrome 76 이상에서는 사용자 지정 지연 로딩 코드를 작성하거나 별도의 JavaScript 라이브러리를 사용할 필요 없이 `loading` 속성을 사용하여 이미지를 지연 로딩할 수 있습니다.

## 브라우저 호환성

`<img loading=lazy>`는 가장 널리 사용되는 Chromium 기반 브라우저(Chrome, Edge, Opera) 및 [Firefox](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/75#HTML)에서 지원됩니다. WebKit(Safari) 구현은 [진행 중](https://bugs.webkit.org/show_bug.cgi?id=200764)입니다. [caniuse.com](https://caniuse.com/#feat=loading-lazy-attr)에서 브라우저 간 지원에 대한 자세한 정보를 제공합니다. `loading` 속성을 지원하지 않는 브라우저는 부정적인 영향 없이 이 속성을 간단히 무시합니다.

## 브라우저 수준의 지연 로딩이 필요한 이유는 무엇입니까?

[HTTPArchive](https://httparchive.org/reports/page-weight)에 따르면 이미지는 대부분의 웹사이트에서 가장 많이 요청되는 자산 유형이며 일반적으로 다른 리소스보다 더 많은 대역폭을 차지합니다. 90번째 백분위수에서 사이트는 데스크톱 및 모바일에서 약 4.7MB의 이미지를 보냅니다. [고양이 사진](https://en.wikipedia.org/wiki/Cats_and_the_Internet)이 많네요.

현재 오프스크린 이미지 로드를 지연시키는 방법에는 두 가지가 있습니다.

- [Intersection Observer API](https://developer.chrome.com/blog/intersectionobserver/) 사용
- `scroll`, `resize` 또는 `orientationchange` [이벤트 핸들러](https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/#using_event_handlers_the_most_compatible_way) 사용

어느 옵션이든 개발자는 지연 로딩 기능을 포함할 수 있으며 많은 개발자들이 사용하기 훨씬 쉬운 추상화를 제공하기 위해 타사 라이브러리를 구축했습니다. 그러나 브라우저에서 직접 지원하는 지연 로딩을 사용하면 외부 라이브러리가 필요하지 않습니다. 또한 브라우저 수준의 지연 로딩을 사용하면 클라이언트에서 JavaScript가 비활성화된 경우에도 지연된 이미지 로딩이 계속해서 작동합니다.

## `loading` 속성

현재 Chrome에서는 이미 장치 뷰포트와의 상대적인 위치에 따라 서로 다른 우선 순위를 두고 이미지를 로드합니다. 뷰포트 아래의 이미지는 더 낮은 우선 순위로 로드되지만 여전히 가능한 한 빨리 가져옵니다.

Chrome 76 이상에서는 `loading` 속성을 사용하여 스크롤로 도달할 수 있는 오프스크린 이미지의 로딩을 완전히 지연시킬 수 있습니다.

```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
```

다음은 `loading` 속성에 대해 지원되는 값입니다.

- `auto`: 속성을 포함하지 않는 것과 동일한 브라우저의 기본 지연 로딩 동작입니다.
- `lazy`: 뷰포트로부터 [계산된 거리](#distance-from-viewport-thresholds)에 도달할 때까지 리소스 로딩을 지연시킵니다.
- `eager`: 페이지에서의 위치에 관계없이 리소스를 즉시 로드합니다.

{% Aside 'caution' %} Chromium에서 사용할 수 있지만 `auto` 값은 [사양](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#lazy-loading-attributes)에 언급되어 있지 않습니다. 변경될 수도 있으므로 포함될 때까지 이 값은 사용하지 않는 것이 좋습니다. {% endAside %}

### 뷰포트로부터 거리 임계값

스크롤 없이 바로 볼 수 있는 폴드 위의 모든 이미지는 정상적으로 로드됩니다. 장치 뷰포트보다 훨씬 아래에 있는 이미지는 사용자가 근처까지 스크롤할 때만 가져옵니다.

Chromium에서 구현된 지연 로딩은 사용자가 근처까지 스크롤하면 로딩이 끝날 수 있도록 오프스크린 이미지가 충분히 조기에 로드되도록 합니다. 뷰포트에 표시되기 전에 가까운 이미지를 가져오면 표시될 시점에는 이미 로딩을 마칠 가능성이 최대화됩니다.

JavaScript 지연 로딩 라이브러리와 비교하여 보기 내로 스크롤되는 이미지를 가져오기 위한 임계값은 보수적인 것으로 여겨질 수 있습니다. Chromium은 이러한 임계값을 개발자 기대치에 더 잘 맞추는 방법을 찾고 있습니다.

{% Aside %} Android에서 Chrome을 사용하여 수행한 실험에 따르면 4G에서 지연 로드된 폴드 아래 이미지의 97.5%가 표시 화면에 들어오고 10ms 내에 완전히 로딩되었습니다. 느린 2G 네트워크에서도 폴드 아래 이미지의 92.6%가 10ms 이내에 완전히 로드되었습니다. 이는 브라우저 수준의 지연 로딩이 보기 내로 스크롤되는 요소의 가시성과 관련하여 안정적인 경험을 제공함을 의미합니다. {% endAside %}

거리 임계값은 고정되어 있지 않으며 여러 요인에 따라 다릅니다.

- 가져오는 이미지 리소스의 유형
- Android용 Chrome에서 [Lite 모드](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html) 사용 여부
- [효과적인 연결 유형](https://googlechrome.github.io/samples/network-information/)

[Chromium 소스](https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/frame/settings.json5?l=971-1003&rcl=e8f3cf0bbe085fee0d1b468e84395aad3ebb2cad)에서 다양한 유효 연결 유형에 대한 기본값을 찾을 수 있습니다. 이러한 수치, 그리고 뷰포트로부터 특정 거리에 도달한 경우에만 가져오는 접근 방식은 가까운 장래에 변경될 수 있습니다. Chrome 팀이 로딩 시작 시점을 결정하기 위한 휴리스틱을 개선하고 있기 때문입니다.

{% Aside %} Chrome 77 이상에서는 DevTools에서 [네트워크를 스로틀링](https://developer.chrome.com/docs/devtools/network/#throttle)하여 이러한 다양한 임계값을 실험할 수 있습니다. 한편으로, `about://flags/#force-effective-connection-type` 플래그를 사용하여 브라우저의 유효 연결 유형을 재정의해야 합니다. {% endAside %}

## 향상된 데이터 절약 및 뷰포트로부터 거리 임계값

2020년 7월 기준, Chrome은 개발자 기대치를 더 잘 충족할 수 있도록 이미지 지연 로딩에 대한 뷰포트로부터의 거리 임계값을 조정하는 부분에서 큰 개선을 이루었습니다.

고속 연결(예: 4G)에서는 Chrome에서 뷰포트로부터의 거리 임계값을 `3000px`에서 `1250px`로 줄였으며, 저속 연결(예: 3G)에는 임계값을 `4000px`에서 `2500px`로 줄였습니다. 이러한 변화로 두 가지 긍정적 효과가 나타납니다.

- `<img loading=lazy>`가 JavaScript 지연 로딩 라이브러리가 제공하는 경험에 더 가깝게 작동합니다.
- 새로운 뷰포트로부터 거리 임계값에서도 사용자가 이미지까지 스크롤하는 시점에 이미지가 로드되도록 보장할 수 있습니다.

아래의 고속 연결(4G)에 대한 데모 중 하나에서 뷰포트까지의 거리 임계값을 이전과 이후로 나누어 비교한 결과를 볼 수 있습니다.

이전 임계값과 새 임계값 비교:

<figure>   {% Img src="image/admin/xSZMqpbioBRwRTnenK8f.png", alt="이미지 지연 로딩에 대해 새롭게 향상된 임계값으로 뷰포트로부터 거리 임계값을 3000px에서 1250px로 줄여 연결 속도 개선", width="800", height="460" %}</figure>

그리고 새로운 임계값 대 지연 크기(주요 JS 지연 로딩 라이브러리):

<figure>   {% Img src="image/admin/oHMFvflk9aesT7r0iJbx.png", alt="동일한 네트워크 조건에서 70KB로 로드되는 LazySizes와 비교하여 90KB의 이미지를 로드하는 Chrome의 새로운 뷰포트로부터의 거리 임계값", width="800", height="355" %}</figure>

{% Aside %} 최신 버전의 Chrome 사용자도 새로운 임계값의 이점을 누릴 수 있도록 Chrome 79 - 85에서도 사용할 수 있도록 이러한 변경 사항을 백포트했습니다. 이전 버전과 최신 버전의 Chrome에서 데이터 절약을 비교하려는 경우 이 점을 염두에 두십시오. {% endAside %}

각 브라우저에서 뷰포트로부터의 거리 임계값 접근 방식이 더 개선된 방식으로 정착되도록 웹 표준 커뮤니티에서 활동 노력을 기울이고 있습니다.

### 이미지에는 차원 속성이 포함되어야 합니다

브라우저가 이미지를 로드하는 동안 명시적으로 지정되지 않는 한 이미지의 크기를 즉시 알 수 없습니다. 브라우저가 페이지에서 이미지를 위한 충분한 공간을 확보할 수 있도록 하려면 모든 `<img>` 태그에 `width` 및 `height` 속성이 모두 포함되는 것이 좋습니다. 지정된 치수가 없으면 로드하는 데 시간이 걸리는 페이지에서 더 확연하게 [레이아웃 이동](/cls)이 발생할 수 있습니다.

```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
```

또는 인라인 스타일에서 직접 값을 지정합니다.

```html
<img src="image.png" loading="lazy" alt="…" style="height:200px; width:200px;">
```

치수 설정의 모범 사례는 지연 로드 여부에 관계없이 `<img>` 태그에 적용됩니다. 지연 로딩을 사용하면 관련성이 더 높아질 수 있습니다. 최신 브라우저에서 이미지의 `width` 및 `height`를 설정하면 브라우저가 고유한 크기를 유추할 수도 있습니다.

대부분의 시나리오에서 치수가 포함되지 않은 경우 이미지는 여전히 지연 로드되지만 몇 가지 예외적인 경우를 알고 있어야 합니다. `width`와 `height`가 지정되지 않으면 이미지 크기는 처음에 0×0픽셀입니다. 이러한 이미지 갤러리가 있는 경우 브라우저는 처음에 모두가 뷰포트에 맞는다고 결론내릴 수 있습니다. 각각이 실제로 공간을 차지하지 않고 오프스크린에 이미지가 푸시되지 않기 때문입니다. 이 경우 브라우저는 모든 항목이 사용자에게 표시된다고 결정하고 모든 항목을 로드하기로 결정합니다.

또한 [이미지 크기를 지정하면 레이아웃 변경이 발생할 가능성이 줄어듭니다](https://www.youtube.com/watch?v=4-d_SoCHeWE). 이미지의 크기를 포함할 수 없는 경우 지연 로드는 네트워크 리소스 절약과 잠재적으로 레이아웃 변경의 위험이 더 커지는 것 사이에서 절충일 수 있습니다.

Chromium의 지연 로드는 이미지가 표시되면 로드될 가능성이 있는 방식으로 구현되지만 로드되지 않을 가능성이 아직 작게나마 남아 남아있습니다. 이 경우 이러한 이미지에 `width` 및 `height` 속성이 없으면 누적 레이아웃 이동에 대한 영향이 증가합니다.

{% Aside %} 이 [데모](https://mathiasbynens.be/demo/img-loading-lazy)를 보고 `loading` 속성이 100장의 사진에 대해 어떻게 작동하는지 살펴보세요. {% endAside %}

`<picture>` 요소를 사용하여 정의된 이미지도 지연 로드될 수 있습니다.

```html
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg 1x, larger.jpg 2x">
  <img src="photo.jpg" loading="lazy">
</picture>
```

브라우저가 `<source>` 요소에서 로드할 이미지를 결정하지만 `loading` 속성은 대체 `<img>` 요소에만 포함시키면 됩니다.

## 처음 표시되는 뷰포트에 있는 이미지의 지연 로딩 방지하기

처음 표시되는 뷰포트에 있는 이미지에 대해 `loading=lazy` 설정을 피해야 합니다.

가능하면 접힌 부분 아래에 있는 이미지에만 `loading=lazy`를 추가하는 것이 좋습니다. 즉각적으로 로드된 이미지는 바로 가져올 수 있지만, 지연되어 로드된 이미지에 대해서는 브라우저가 IntersectionObserver 사용 가능 여부에 따라 결정되는 이미지의 페이지 위치에 대해 알 때까지 기다려야 합니다.

{% Aside %} Chromium에서 `loading=lazy`로 표시된 초기 뷰포트의 이미지가 최대 콘텐츠풀 페인트에 미치는 영향은 매우 작습니다. 즉시 로드된 이미지와 비교하여 75 및 99번째 백분위수에서 1% 미만의 회귀를 갖습니다. {% endAside %}

일반적으로, 뷰포트 내의 모든 이미지는 브라우저의 기본값을 사용하여 빠르게 로드되어야 합니다. 뷰포트 내 이미지의 경우 이를 위해 `loading=eager`를 지정할 필요가 없습니다.

```html
<!-- visible in the viewport -->
<img src="product-1.jpg" alt="..." width="200" height="200">
<img src="product-2.jpg" alt="..." width="200" height="200">
<img src="product-3.jpg" alt="..." width="200" height="200">

<!-- offscreen images -->
<img src="product-4.jpg" loading="lazy" alt="..." width="200" height="200">
<img src="product-5.jpg" loading="lazy" alt="..." width="200" height="200">
<img src="product-6.jpg" loading="lazy" alt="..." width="200" height="200">
```

## 단계적 저하

아직 `loading` 속성을 지원하지 않는 브라우저는 그 존재를 무시합니다. 물론 이러한 브라우저는 지연 로딩의 이점을 얻지 못하지만 속성을 포함한다고 해서 브라우저에 부정적인 영향은 없습니다.

## 자주하는 질문

### Chrome에서 이미지를 자동으로 지연 로드할 계획이 있습니까?

Chromium은 Android용 Chrome에서 [Lite 모드](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html)가 활성화된 경우 지연되기에 적합한 이미지를 이미 자동으로 지연 로드합니다. 이것은 주로 데이터 절약에 대해 의식하는 사용자를 대상으로 합니다.

### 로드가 트리거되기 전에 이미지가 얼마나 가까워야 하는지 변경할 수 있습니까?

이러한 값은 하드코딩되어 있으며 API를 통해 변경할 수 없습니다. 그러나 브라우저가 다양한 임계 거리와 변수로 시도됨에 따라 향후 변경될 수 있습니다.

### CSS 배경 이미지가 `loading` 속성을 이용할 수 있습니까?

아니요, 현재 `<img>` 태그로만 사용할 수 있습니다.

### 장치 뷰포트 내에 있는 지연 로딩 이미지의 단점이 있습니까?

Chrome은 사전 로드 스캐너에서 `loading=lazy` 이미지를 사전 로드하지 않으므로 폴드 위 이미지에 `loading=lazy`를 놓지 않는 것이 더 안전합니다.

### `loading` 속성은 뷰포트에 있지만 즉시 보이지 않는 이미지에서 어떻게 작동합니까(예: 캐러셀 뒤에 있거나 특정 화면 크기의 경우 CSS에 의해 숨겨짐)?

[계산된 거리](#distance-from-viewport-thresholds)만큼 장치 뷰포트 아래에 있는 이미지만 느리게 로드됩니다. 뷰포트 위의 모든 이미지는 즉시 표시되는지 여부에 관계없이 정상적으로 로드됩니다.

### 이미 타사 라이브러리나 스크립트를 사용하여 이미지를 지연 로드하고 있는 경우에는 어떻게 합니까?

`loading` 속성은 현재 어떤 방식으로든 자산을 지연 로드하는 코드에 영향을 주지 않지만 고려해야 할 몇 가지 중요한 사항이 있습니다.

1. 사용자 지정 지연 로더가 이미지 또는 프레임을 Chrome이 정상적으로 로드할 때보다 더 빨리(즉, [뷰포트로부터 거리 임계값](#distance-from-viewport-thresholds)보다 큰 거리에서) 로드하려고 하는 경우, 여전히 지연되고 정상적인 브라우저 동작을 기반으로 로드됩니다.
2. 사용자 지정 지연 로더가 브라우저보다 특정 이미지를 로드할 시기를 결정하기 위해 더 짧은 거리를 사용하는 경우 동작은 사용자 지정 설정을 따릅니다.

`loading="lazy"`와 함께 타사 라이브러리를 계속 사용해야 하는 중요한 이유 중 하나는 아직 이 속성을 지원하지 않는 브라우저에 폴리필을 제공하려는 것입니다.

### 아직 지연 로딩을 지원하지 않는 브라우저는 어떻게 처리합니까?

폴리필을 만들거나 타사 라이브러리를 사용하여 사이트에서 이미지를 지연 로드하세요. `loading` 속성을 사용하여 브라우저에서 기능이 지원되는지 확인할 수 있습니다.

```js
if ('loading' in HTMLImageElement.prototype) {
  // supported in browser
} else {
  // fetch polyfill/third-party library
}
```

예를 들어, [lazysizes](https://github.com/aFarkas/lazysizes)는 널리 사용되는 JavaScript 지연 로딩 라이브러리입니다. `loading`이 지원되지 않는 경우에만 지연 크기를 대체 라이브러리로 로드하는 `loading` 속성에 대한 지원을 감지할 수 있습니다. 이것은 다음과 같이 작동합니다.

- 지원되지 않는 브라우저에서 즉시 로드를 방지하려면 `<img src>`를 `<img data-src>` `loading`로 대체합니다. `loading` 속성이 지원되는 경우 `data-src`를 `src`로 바꿉니다.
- `loading`가 지원되지 않는 경우 대체(lazysizes)를 로드하고 시작합니다. lazysize 문서에 따라 `lazyload` 클래스를 지연 로드할 이미지를 lazysize에 표시하는 방법으로 사용합니다.

```html
<!-- Let's load this in-viewport image normally -->
<img src="hero.jpg" alt="…">

<!-- Let's lazy-load the rest of these images -->
<img data-src="unicorn.jpg" alt="…" loading="lazy" class="lazyload">
<img data-src="cats.jpg" alt="…" loading="lazy" class="lazyload">
<img data-src="dogs.jpg" alt="…" loading="lazy" class="lazyload">

<script>
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Dynamically import the LazySizes library
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.1.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
</script>
```

다음은 이 패턴의 [데모](https://lazy-loading.firebaseapp.com/lazy_loading_lib.html)입니다. Firefox 또는 Safari와 같은 브라우저에서 시도하여 대체 동작을 확인하세요.

{% Aside %} lazysizes 라이브러리는 사용 가능한 경우 브라우저 수준의 지연 로드를 사용하지만 필요할 때 라이브러리의 사용자 정의 기능으로 대체하는 [로딩 플러그인](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/native-loading)도 제공합니다. {% endAside %}

### iframe에 대한 지연 로딩도 Chrome에서 지원됩니까?

`<iframe loading=lazy>`는 최근에 표준화되었으며 이미 Chromium에서 구현되었습니다. 이를 통해 `loading` 속성을 사용하여 iframe을 지연 로드할 수 있습니다. iframe 지연 로딩에 대한 전용 문서가 곧 web.dev에 게시될 예정입니다.

`loading` 속성은 iframe이 숨겨져 있는지 여부에 따라 이미지와 다르게 iframe에 영향을 줍니다. (숨겨진 iframe은 종종 분석 또는 커뮤니케이션 목적으로 사용됩니다.) Chrome은 다음 기준을 사용하여 iframe이 숨겨져 있는지 여부를 결정합니다.

- iframe의 너비와 높이가 4픽셀 이하입니다.
- `display: none` 또는 `visibility: hidden`이 적용되었습니다.
- iframe이 음의 X 또는 Y 위치 지정을 사용하여 스크린 외부에 배치됩니다.

iframe이 이러한 조건 중 하나라도 충족하면 Chrome은 이를 숨겨진 것으로 간주하고 대부분의 경우 지연 로드하지 않습니다. 숨겨지지 *않은* Iframe은 [뷰포트로부터 거리 임계값](#distance-from-viewport-thresholds) 내에 있는 경우에만 로드됩니다. 아직 가져오고 있는 지연 로드된 iframe에 대해서는 자리 표시자가 표시됩니다.

### 브라우저 수준의 지연 로딩은 웹 페이지의 광고에 어떤 영향을 줍니까?

이미지 또는 iframe의 형태로 사용자에게 표시되는 모든 광고는 다른 이미지 또는 iframe과 마찬가지로 지연 로드됩니다.

### 웹 페이지가 인쇄될 때 이미지는 어떻게 처리됩니까?

이 기능은 현재 Chrome에 없지만 페이지가 인쇄되면 모든 이미지와 iframe이 즉시 로드되도록 해야 하는 [미해결 문제](https://bugs.chromium.org/p/chromium/issues/detail?id=875403)가 있습니다.

### Lighthouse는 브라우저 수준의 지연 로딩을 인식합니까?

Lighthouse의 이전 버전은 여전히 이미지에서 `loading=lazy`를 사용하는 페이지에 오프스크린 이미지를 로드하기 위한 전략이 필요하다는 점을 강조하여 나타냅니다. [Lighthouse 6.0](/lighthouse-whats-new-6.0/) 이상은 서로 다른 임계값을 사용하여 [오프스크린 이미지 연기](/offscreen-images/) 감사를 통과할 수 있도록 하는 오프 스크린 이미지 지연 로드 접근 방식을 고려합니다.

## 결론

이미지 지연 로딩을 지원하면 웹 페이지의 성능을 훨씬 쉽게 개선할 수 있습니다.

Chrome에서 이 기능을 사용했을 때 비정상적인 동작이 감지되었습니까? [버그를 신고](https://bugs.chromium.org/p/chromium/issues/entry?summary=%5BLazyLoad%5D:&comment=Application%20Version%20%28from%20%22Chrome%20Settings%20%3E%20About%20Chrome%22%29:%20%0DAndroid%20Build%20Number%20%28from%20%22Android%20Settings%20%3E%20About%20Phone/Tablet%22%29:%20%0DDevice:%20%0D%0DSteps%20to%20reproduce:%20%0D%0DObserved%20behavior:%20%0D%0DExpected%20behavior:%20%0D%0DFrequency:%20%0D%3Cnumber%20of%20times%20you%20were%20able%20to%20reproduce%3E%20%0D%0DAdditional%20comments:%20%0D&labels=Pri-2&components=Blink%3ELoader%3ELazyLoad%2C)하세요!
