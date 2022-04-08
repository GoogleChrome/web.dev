---
layout: post
title: 동영상 지연 로드
authors:
  - jlwagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-05
description: |2-

  이 게시물에서는 지연 로딩 및 비디오 지연 로딩 시 사용할 수 있는 옵션에 대해 설명합니다.
tags:
  - performance
feedback:
  - api
---

[이미지 요소](/lazy-loading-images)와 마찬가지로 동영상을 지연 로드할 수도 있습니다. 동영상은 일반적으로 `<video>` 요소를 통해 로드됩니다([`<img>`를 사용하는 대체 방법](https://calendar.perfplanet.com/2017/animated-gif-without-the-gif/)이 등장한 경우에도). `<video>`를 지연 로드하는 *방법*은 사용 사례에 따라 다릅니다. 각각 다른 솔루션이 필요한 몇 가지 시나리오에 대해 논의해 보겠습니다.

## 자동 재생되지 않는 동영상의 경우 {: #video-no-autoplay }

사용자가 재생을 시작한 동영상(즉, 자동 재생 *되지 않는* 동영상)의 경우 `<video>` [`preload` 속성](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-preload)을 지정하는 것이 바람직할 수 있습니다.

```html
<video controls preload="none" poster="one-does-not-simply-placeholder.jpg">
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

위의 예에서는 값이 `none` `preload` 속성을 사용하여 브라우저가 동영상 데이터를 미리 로드 *하지 못하도록 합니다.* `poster` 속성은 동영상이 로드되는 동안 공간을 차지할 자리 표시자를 `<video>`에 제공합니다. 그 이유는 동영상 로드에 대한 기본 동작이 브라우저마다 다를 수 있기 때문입니다.

- `preload`의 기본값은 `auto`였지만 Chrome 64에서는 이제 `metadata`로 기본 설정됩니다. `Content-Range` 헤더를 사용하여 비디오의 일부를 미리 로드할 수 있습니다. Firefox, Edge 및 Internet Explorer 11은 유사하게 작동합니다.
- 데스크톱의 Chrome과 마찬가지로 11.0 데스크톱 버전의 Safari는 다양한 동영상을 미리 로드합니다. 버전 11.2부터 비디오 메타데이터만 미리 로드됩니다. [iOS의 Safari에서는 동영상이 미리 로드되지 않습니다](https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/AudioandVideoTagBasics/AudioandVideoTagBasics.html#//apple_ref/doc/uid/TP40009523-CH2-SW9) .
- [데이터 절약 모드](https://support.google.com/chrome/answer/2392284)가 활성화되면 `preload`가 기본적으로 `none`으로 설정됩니다.

`preload`와 관련된 브라우저 기본 동작은 고정되어 있지 않기 때문에 명시적인 것이 최선의 방법일 것입니다. 사용자가 재생을 시작하는 경우 `preload="none"`을 사용하는 것이 모든 플랫폼에서 동영상 로드를 연기하는 가장 쉬운 방법입니다. `preload` 속성은 동영상 콘텐츠의 로드를 지연시키는 유일한 방법이 아닙니다. [*동영상 사전 로드를 사용한 빠른 재생*](/fast-playback-with-preload/)은 JavaScript에서 동영상 재생 작업에 대한 몇 가지 아이디어와 통찰력을 제공할 수 있습니다.

안타깝게도 다음에 다룰 애니메이션 GIF 대신 동영상을 사용하려는 경우에는 유용하지 않습니다.

## 애니메이션 GIF를 대체하는 동영상의 경우 {: #video-gif-replacement }

애니메이션 GIF는 널리 사용되지만 여러 면에서 특히 파일 크기 면에서 동급의 동영상에 미치지 못합니다. 애니메이션 GIF는 수 메가바이트의 데이터 범위로 확장될 수 있습니다. 비슷한 화질의 비디오는 훨씬 작은 경향이 있습니다.

애니메이션 GIF를 대체하기 위해 `<video>` 요소를 사용하는 `<img>` 요소만큼 간단하지 않습니다. 애니메이션 GIF에는 세 가지 특징이 있습니다.

1. 로드되면 자동으로 재생됩니다.
2. 계속 반복됩니다([항상 그렇지는 않음](https://davidwalsh.name/prevent-gif-loop)).
3. 오디오 트랙이 없습니다.

`<video>` 요소로 이를 달성하는 것은 다음과 같습니다:

```html
<video autoplay muted loop playsinline>
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

`autoplay` , `muted` 및 `loop` 속성은 자명합니다. [`playsinline`은 iOS에서 자동 재생이 발생하는 데 필요합니다](https://webkit.org/blog/6784/new-video-policies-for-ios/). 이제 여러 플랫폼에서 작동하는 서비스 가능한 GIF 대체품이 생겼습니다. 하지만 지연 로딩은 어떻게 할까요? 시작하려면 `<video>` 마크업을 수정하십시오.

```html
<video class="lazy" autoplay muted loop playsinline width="610" height="254" poster="one-does-not-simply.jpg">
  <source data-src="one-does-not-simply.webm" type="video/webm">
  <source data-src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

동영상이 지연 로드될 때까지 `<video>` 요소의 공간을 차지할 자리 표시자를 지정할 수 있는 [`poster` 속성](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-poster)이 추가되었음을 알 수 있습니다. [`<img>` 지연 로딩 예제](/lazy-loading-images/)와 마찬가지로 `<source>` 요소 `data-src` 속성에 동영상 URL을 숨깁니다. 거기에서 Intersection Observer 기반 이미지 지연 로드 예제와 유사한 JavaScript 코드를 사용합니다.

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
```

`<video>` 요소를 지연 로드할 때 모든 하위 `<source>` 요소를 반복하고 해당 `data-src` 속성을 `src` 속성으로 전환해야 합니다. `load` 메서드를 호출하여 동영상 로드를 트리거해야 합니다. `autoplay` 속성에 따라 자동으로 재생되기 시작합니다.

이 방법을 사용하면 애니메이션 GIF 동작을 에뮬레이트하는 동영상 솔루션이 있지만 애니메이션 GIF처럼 집중적인 데이터 사용량이 발생하지 않으며 해당 콘텐츠를 지연 로드할 수 있습니다.

## 지연 로딩 라이브러리 {: #libraries }

다음 라이브러리는 동영상을 지연 로드하는 데 도움이 될 수 있습니다.

- [Vanilla-lazyload](https://github.com/verlok/vanilla-lazyload) 및 [lozad.js](https://github.com/ApoorvSaxena/lozad.js)는 Intersection Observer만 사용하는 초경량 옵션입니다. 따라서 성능이 높지만 이전 브라우저에서 사용하려면 먼저 폴리필해야 합니다.
- [yall.js](https://github.com/malchata/yall.js)는 Intersection Observer를 사용하고 이벤트 핸들러로 폴백하는 라이브러리입니다. IE11 및 주요 브라우저와 호환됩니다.
- React 전용 지연 로딩 라이브러리가 필요한 경우 [react-lazyload](https://github.com/jasonslyvia/react-lazyload)를 고려하세요. 이는 Intersection Observer를 사용하지는 않지만, React로 애플리케이션을 개발하는 데 익숙한 사람들을 위해 이미지를 지연 로드하는 친숙한 방법을 *제공합니다*.

이러한 지연 로딩 라이브러리 각각은 다양한 지연 로딩 노력을 위한 많은 마크업 패턴과 함께 잘 문서화되어 있습니다.
