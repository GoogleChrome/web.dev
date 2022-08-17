---
title: Web Share API로 OS 공유 UI와 통합
subhead: 웹 앱은 플랫폼별 앱과 동일한 시스템 제공 공유 기능을 사용할 수 있습니다.
authors:
  - joemedley
date: 2019-11-08
updated: 2021-07-09
hero: image/admin/ruvEms3AeSZvlEI01DKo.png
alt: 웹 앱이 시스템 제공 공유 UI를 사용할 수 있음을 보여주는 그림.
description: Web Share API를 통해 웹 앱은 플랫폼별 앱과 동일한 시스템 제공 공유 기능을 사용할 수 있습니다. Web Share API를 사용하면 웹 앱이 플랫폼별 앱과 동일한 방식으로 장치에 설치된 다른 앱에 대한 링크, 텍스트 및 파일을 공유할 수 있습니다.
tags:
  - blog
  - capabilities
feedback:
  - api
stack_overflow_tag: web-share
---

Web Share API를 통해 웹 앱은 플랫폼별 앱과 동일한 시스템 제공 공유 기능을 사용할 수 있습니다. Web Share API를 사용하면 웹 앱이 플랫폼별 앱과 동일한 방식으로 장치에 설치된 다른 앱에 대한 링크, 텍스트 및 파일을 공유할 수 있습니다.

{% Aside %} 공유는 마법의 절반에 불과합니다. 웹 앱은 공유 대상이 될 수도 있습니다. 즉, 플랫폼별 또는 웹 앱에서 데이터, 링크, 텍스트 및 파일을 수신할 수 있습니다. 앱을 공유 대상으로 등록하는 방법에 대한 자세한 내용은 [공유 데이터 받기](/web-share-target/) 게시물을 참조하세요. {% endAside %}

## 개념 및 사용법

<figure data-float="right">{% Img src="image/admin/cCXNoHbXAfkAQzTTuS0Z.png", alt="PWA가 옵션으로 설치된 시스템 수준 공유 대상 선택기.", width="370", height="349" %}<figcaption> PWA가 옵션으로 설치된 시스템 수준 공유 대상 선택기.</figcaption></figure>

### 기능 및 제한 사항

웹 공유에는 다음과 같은 기능과 제한 사항이 있습니다.

- [HTTPS를 통해 액세스](https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features)하는 사이트에서만 사용할 수 있습니다.
- 클릭과 같은 사용자 작업에 대한 응답으로 호출되어야 합니다. `onload` 핸들러를 통해 호출하는 것은 불가능합니다.
- URL, 텍스트 또는 파일을 공유할 수 있습니다.
- 2021년 1월부터 Safari, Chromium 포크의 Android, ChromeOS 및 Windows의 Chrome에서 사용할 수 있습니다. MacOS의 Chrome은 아직 개발 중입니다. 자세한 내용은 [MDN](https://developer.mozilla.org/docs/Web/API/Navigator/share#Browser_compatibility)을 참조하세요.

### 링크 및 텍스트 공유

링크와 텍스트를 공유하려면 필수 속성 객체가 있는 promise 기반 메서드인 `share()` 메서드를 사용합니다. 브라우저가 `TypeError`를 발생시키지 않도록 하려면 `title`, `text`, `url` 또는 `files` 속성 중 하나 이상이 객체에 포함되어야 합니다. 예를 들어 URL 없이 텍스트를 공유하거나 그 반대의 경우도 마찬가지입니다. 세 개의 구성원을 모두 허용하면 사용 사례의 유연성이 확장됩니다. 아래 코드를 실행한 후 사용자가 이메일 애플리케이션을 대상으로 선택했다고 가정해 보겠습니다. `title` 매개변수는 이메일 제목, `text`는 메시지 본문, 그리고 파일은 첨부 파일이 될 수 있습니다.

```js
if (navigator.share) {
  navigator.share({
    title: 'web.dev',
    text: 'Check out web.dev.',
    url: 'https://web.dev/',
  })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
}
```

사이트에 동일한 콘텐츠에 대한 여러 URL이 있는 경우 현재 URL 대신 페이지의 표준 URL을 공유하세요. `document.location.href`를 공유하는 대신, 페이지의 `<head>`에서 표준 URL `<meta>` 태그를 확인하고 이를 공유합니다. 그러면 사용자 경험이 개선됩니다. 이를 통해 리디렉션을 방지할 뿐만 아니라 공유 URL이 특정 클라이언트에 대해 올바른 사용자 경험을 제공하도록 할 수 있습니다. 예를 들어 친구가 모바일 URL을 공유하고 여러분이 데스크톱 컴퓨터에서 이를 보는 경우 데스크톱 버전이 표시되어야 합니다.

```js
let url = document.location.href;
const canonicalElement = document.querySelector('link[rel=canonical]');
if (canonicalElement !== null) {
    url = canonicalElement.href;
}
navigator.share({url});
```

### 파일 공유

파일을 공유하려면 먼저 `navigator.canShare()`를 테스트하고 호출합니다. 그런 다음 `navigator.share()` 호출에 파일 배열을 포함시킵니다.

```js/0-5
if (navigator.canShare && navigator.canShare({ files: filesArray })) {
  navigator.share({
    files: filesArray,
    title: 'Vacation Pictures',
    text: 'Photos from September 27 to October 14.',
  })
  .then(() => console.log('Share was successful.'))
  .catch((error) => console.log('Sharing failed', error));
} else {
  console.log(`Your system doesn't support sharing files.`);
}
```

샘플은 `navigator.share()`가 아닌 `navigator.canShare()`를 테스트하여 기능 감지를 처리합니다. `canShare()`로 전달된 데이터 객체는 `files` 속성만 지원합니다. 이미지, 비디오, 오디오 및 텍스트 파일을 공유할 수 있습니다([Chromium에서 허용되는 파일 확장자](https://docs.google.com/document/d/1tKPkHA5nnJtmh2TgqWmGSREUzXgMUFDL6yMdVZHqUsg/edit?usp=sharing) 참조). 향후 더 많은 파일 형식이 추가될 수 있습니다.

## Santa Tracker 사례 연구

<figure data-float="right">{% Img src="image/admin/2I5iOXaOpzEJlEbM694n.png", alt="공유 버튼을 표시하는 Santa Tracker 앱.", width="343", height="600" %}<figcaption> Santa Tracker 공유 버튼.</figcaption></figure>

오픈 소스 프로젝트인 [Santa Tracker](https://santatracker.google.com/)는 Google의 휴일 전통입니다. 매년 12월이 되면 게임과 교육적 체험으로 시즌을 기념할 수 있습니다.

2016년에 Santa Tracker 팀은 Android에서 Web Share API를 사용했습니다. 이 API는 모바일에 완벽했습니다. 이전 몇 년 동안 팀은 모바일에서 공유 버튼을 제거했는데, 공간이 무엇보다 중요하고 여러 공유 대상을 둔다는 것을 정당화할 수 없었기 때문입니다.

그러나 Web Share API를 사용하면 버튼 하나를 표시할 수 있어 소중한 픽셀을 절약할 수 있었습니다. 또한 API를 사용하지 않는 사용자보다 Web Share와 공유하는 사용자가 20% 정도 더 많다는 사실을 발견했습니다. Web Share가 실제 작동하는 모습을 보려면 [Santa Tracker](https://santatracker.google.com/)로 이동하세요.

## 브라우저 지원

Web Share API에 대한 브라우저 지원은 미묘한 부분이 있으며 특정 방법이 지원된다고 가정하는 대신 기능 감지(이전 코드 샘플에서 설명한 대로)를 사용하는 것이 좋습니다.

2021년 초부터 API를 사용하여 제목, 텍스트 및 URL을 공유하는 기능이 다음 환경에서 지원됩니다.

- macOS 및 iOS에서 Safari 12 이상
- Android에서 Chrome 75 이상, ChromeOS 및 Windows에서 89 이상

API를 사용한 파일 공유는 다음 환경에서 지원됩니다.

- macOS 및 iOS에서 Safari 15 이상
- Android에서 Chrome 75 이상, ChromeOS 및 Windows에서 89 이상

(Edge와 같은 대부분의 Chromium 기반 브라우저는 해당하는 Chrome 버전과 동일하게 이 기능을 지원합니다.)

### API에 대한 지원 표시

Web Share API를 사용할 계획이십니까? Chrome 팀이 기능의 우선 순위를 정하고 브라우저 공급업체에 이 API의 지원이 얼마나 중요한지 보여주기 위해서는 여러분의 공개 지원이 힘이 됩니다.

[@ChromiumDev](https://twitter.com/ChromiumDev)으로 해시태그 [`#WebShare`](https://twitter.com/search?q=%23WebShare&src=recent_search_click&f=live)를 포함한 트윗을 보내서 어디에서 어떻게 이 API를 활용하고 있는지 알려주세요.

## 유용한 링크

- [Web Share 데모](https://w3c.github.io/web-share/demos/share-files.html)
- [Scrapbook PWA](https://github.com/GoogleChrome/samples/blob/gh-pages/web-share/README.md#web-share-demo)
