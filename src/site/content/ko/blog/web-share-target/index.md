---
title: 웹 공유 대상 API로 공유 데이터 수신하기
subhead: 웹 공유 대상 API로 간단해진 모바일 및 데스크탑 공유하기
authors:
  - petelepage
  - joemedley
date: 2019-11-08
updated: 2021-06-07
hero: image/admin/RfxdrfKdh5Fp8camulRt.png
alt: 플랫폼 종속 앱이 이제 웹 앱에 콘텐츠를 공유할 수 있음을 보여주는 그림.
description: 모바일 또는 데스크톱 장치에서, 공유는 공유 버튼을 누르고, 앱을 선택한 후 공유할 사람을 선택하는 것처럼 간단해야 합니다. 웹 공유 대상 API를 사용하면 설치된 웹 앱을 기본 운영 체제에 등록하여 공유 콘텐츠를 수신할 수 있습니다.
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

모바일 또는 데스크톱 장치에서 공유는 **공유** 버튼을 클릭하고, 앱을 선택한 후 공유할 사람을 선택하는 것처럼 간단해야 합니다. 예를 들어, 친구에게 이메일을 보내거나 전세계에 트윗하는 것으로 흥미로운 기사를 공유하고 싶어 할지 모릅니다.

과거에는 플랫폼에 종속된 앱만 운영 체제에 등록하여 설치된 다른 앱의 공유를 받을 수 있었습니다. 그러나 웹 공유 대상 API를 사용하면 설치된 웹 앱을 기본 운영 체제에 공유 대상으로 등록하여 공유 콘텐츠를 수신할 수 있습니다.

{% Aside %} 웹 공유 대상 API는 마법의 절반에 불과합니다. 웹 앱은 웹 공유 API를 사용하여 데이터, 파일, 링크 또는 텍스트를 공유할 수 있습니다. 자세한 내용은 [웹 공유 API](/web-share/)를 참조하세요.{% endAside %}

<figure data-float="right">{% Img src="image/admin/Q4nuOQMpsQrTilpXA3fL.png", alt="'다음을 통해 공유' 메뉴가 펼쳐진 안드로이드 휴대전화.", width="400", height="377" %} <figcaption> 설치된 PWA가 옵션으로 들어가 있는 시스템 차원의 공유 대상 선택기. </figcaption></figure>

## 작동 중인 웹 공유 대상 보기

1. Android에서 Chrome 76 이상을, 또는 데스크톱에서 Chrome 89 이상을 사용하여 [웹 공유 대상 데모](https://web-share.glitch.me/)를 엽니다.
2. 메시지가 표시되면 **설치**를 클릭하여 앱을 홈 화면에 추가하거나 Chrome 메뉴를 사용하여 홈 화면에 추가합니다.
3. 공유를 지원하는 앱을 열거나 데모 앱에서 공유 버튼을 사용합니다.
4. 대상 선택 화면에서 **웹 공유 테스트**를 선택합니다.

공유 후에는 웹 공유 대상 웹 앱에서 공유된 모든 정보를 볼 수 있습니다.

## 앱을 공유 대상으로 등록

앱을 공유 대상으로 등록하려면 [Chrome의 설치 가능성 기준](https://developers.google.com/web/fundamentals/app-install-banners/#criteria)을 충족해야 합니다. 또한 사용자가 앱에 공유하려면 먼저 해당 앱을 홈 화면에 추가해야 합니다. 이렇게 하면 사용자의 공유 인텐트 목록에 사이트가 무작위로 자기 사이트를 추가하는 것을 막을 수 있고 공유를 사용자가 앱으로 싶어 하는 것으로 만들어 줍니다.

## 웹 앱 매니페스트 업데이트

앱을 공유 대상으로 등록하려면 [웹 앱 매니페스트](/add-manifest/)에 `share_target` 항목을 추가하십시오. 이렇게 하면 운영 체제에서 앱을 인텐트 목록의 옵션으로 포함하도록 지시합니다. 매니페스트에 추가하는 항목은 앱에서 허용할 데이터를 제어합니다. `share_target` 항목에는 세 가지 일반적인 시나리오가 있습니다.

- 기본 정보 수락
- 애플리케이션 변경 수락
- 파일 수락

{% Aside %} 매니페스트당 오직 하나의 `share_target`만 가질 수 있으며, 앱 내의 다른 위치에 공유하려면 해당 위치를 공유 대상 랜딩 페이지 내에서 옵션으로 제공하세요. {% endAside %}

### 기본 정보 수락

대상 앱이 데이터, 링크 및 텍스트와 같은 기본 정보만 허용하는 경우 다음을 `manifest.json` 파일에 추가합니다.

```json
"share_target": {
  "action": "/share-target/",
  "method": "GET",
  "params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}
```

애플리케이션에 이미 공유 URL 체계가 있는 경우 `param` 값을 기존 쿼리 매개변수로 변경할 수 있습니다. 예를 들어 공유 URL 체계가 `text` 대신 `body`를 사용한다면, `"text": "text"` 를 `"text": "body"`로 바꿀 수 있습니다.

`method` 값을 제공하지 않으면 `"GET"`이 디폴트로 설정됩니다. 이 예제에 표시되지 않은 `enctype` 필드는 데이터를 위한 [인코딩 유형](https://developer.mozilla.org/docs/Web/HTML/Element/form#attr-enctype)을 나타냅니다. `"GET"` method의 경우 `enctype`은 `"application/x-www-form-urlencoded"`가 디폴트로 설정되며 다른 것으로 설정되어 있으면 무시됩니다.

### 애플리케이션 변경 수락

공유 데이터가 대상 앱을 어떤 식으로든 변경하는 경우(예: 대상 애플리케이션에 북마크를 저장) `method` 값을 `"POST"`로 설정하고 `enctype` 필드를 넣어줍니다. 아래 예제는 대상 앱에 북마크를 생성하므로 `method`에 `"POST"`를 `enctype`에는 `"multipart/form-data"`를 사용합니다.

```json/4-5
{
  "name": "Bookmark",
  "share_target": {
    "action": "/bookmark",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "url": "link"
    }
  }
}
```

### 파일 수락

애플리케이션 변경과 마찬가지로, 파일을 수락하려면 `method` 값은 `"POST"`이어야 하며 `enctype` 필드가 존재해야 합니다. 또한 `enctype`은 `"multipart/form-data"`로 설정되어야 하며 `files` 항목이 반드시 추가되어야 합니다.

앱에서 허용하는 파일 유형을 정의한 `files` 배열도 추가되어야 합니다. 이 배열은 `name` 필드와 `accept` 필드의 두 가지 요소로 된 항목입니다. `accept` 필드는 MIME 유형, 파일 확장자 또는 두 가지 전부를 포함하는 배열을 사용합니다. 선호하는 운영 체제가 다르기 때문에 MIME 유형과 파일 확장자를 모두 포함하는 배열을 제공하는 것이 가장 좋습니다.

```json/5,10-19
{
  "name": "Aggregator",
  "share_target": {
    "action": "/cgi-bin/aggregate",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "name",
      "text": "description",
      "url": "link",
      "files": [
        {
          "name": "records",
          "accept": ["text/csv", ".csv"]
        },
        {
          "name": "graphs",
          "accept": "image/svg+xml"
        }
      ]
    }
  }
}
```

## 들어오는 콘텐츠 처리

들어오는 공유 데이터를 처리하는 방식은 사용자에게 달려 있으며 앱에 따라 다릅니다. 예를 들어:

- 이메일 클라이언트는 `title`을 이메일 제목으로, `text`와 `url` 본문으로 함께 사용하여 새 이메일 초안을 작성할 수 있습니다.
- SNS 애플리케이션은 `title`을 무시하고 `text`를 메시지 본문으로 사용, `url`을 링크로 추가하는 새 게시물을 작성할 수 있습니다. `text`가 누락된 경우 앱은 본문에서도 `url`을 사용할 수 있습니다. `url`이 없으면 앱이 `text`를 스캔하여 링크로 추가할 수 있습니다.
- 사진 공유 앱은 `title`을 슬라이드쇼 제목으로, `text`를 설명으로, `files`을 슬라이드쇼 이미지로 사용하여 새 슬라이드쇼를 만들 수 있습니다.
- 채팅 앱은 `text`와 `url`을 연결하고 `title`을 삭제하여 새 메시지 초안을 작성할 수 있습니다.

### GET 공유 처리

사용자가 선택한 애플리케이션의 `method` 값이 `"GET"`(기본값)인 경우, 브라우저는 `action` URL에서 새 창을 엽니다. 그런 다음 브라우저는 매니페스트에 제공된 URL 인코딩 값을 사용하여 쿼리 문자열을 생성합니다. 예를 들어 공유 앱이 `title`과 `text`를 제공하는 경우 쿼리 문자열은 `?title=hello&text=world`입니다. 이를 처리하려면 포그라운드 페이지에서 `DOMContentLoaded` 이벤트 리스너를 사용하고 쿼리 문자열을 분석하십시오.

```js
window.addEventListener('DOMContentLoaded', () => {
  const parsedUrl = new URL(window.location);
  // searchParams.get() will properly handle decoding the values.
  console.log('Title shared: ' + parsedUrl.searchParams.get('title'));
  console.log('Text shared: ' + parsedUrl.searchParams.get('text'));
  console.log('URL shared: ' + parsedUrl.searchParams.get('url'));
});
```

사용자가 오프라인인 경우에도 빠르게 로드되고 안정적으로 작동할 수 있도록, 서비스 워커를 사용하여 `action`페이지를 [프리캐싱](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker)하십시오. [Workbox](https://developer.chrome.com/docs/workbox/)는 서비스 워커에서 [프리캐싱을 구현](/precache-with-workbox/)하는 데 도움이 되는 툴입니다.

### POST 공유 처리

`method` 값이 `"POST"`인 경우, 앱이 저장된 북마크 또는 공유 파일을 수락할 때처럼, 들어오는 `"POST"` 리퀘스트의 본문에는 매니페스트에서 제공한 `enctype` 값을 사용하여 인코딩된 애플리케이션이 전달한 데이터가 포함됩니다.

포그라운드 페이지는 이 데이터를 직접 처리할 수 없습니다. 페이지는 데이터를 리퀘스트로 보기 때문에, 페이지는 서비스 워커에게 데이터를 전달하고, 여기서 `fetch` 이벤트 리스너로 데이터를 가로챌 수 있습니다. 여기서 `postMessage()`를 사용하여 데이터를 포그라운드 페이지로 다시 전달하거나 서버로 전달할 수 있습니다.

```js
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // If this is an incoming POST request for the
  // registered "action" URL, respond to it.
  if (event.request.method === 'POST' &&
      url.pathname === '/bookmark') {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const link = formData.get('link') || '';
      const responseUrl = await saveBookmark(link);
      return Response.redirect(responseUrl, 303);
    })());
  }
});
```

### 공유 콘텐츠 확인

<figure data-float="right">{% Img src="image/admin/hSwbgPk8IFgPC81oJbxZ.png", alt="공유 콘텐츠가 있는 데모 앱을 표시하는 Android 휴대전화입니다.", width="400", height="280" %}<figcaption> 샘플 공유 대상 앱.</figcaption></figure>

들어오는 데이터를 확인하도록 하십시오. 유감스럽지만 다른 앱이 올바른 매개변수로 적절한 콘텐츠를 공유한다는 보장은 없습니다.

예를 들어 Android에서 [`url` 필드는 공백으로 나타나는데](https://bugs.chromium.org/p/chromium/issues/detail?id=789379), 이는 Android의 공유 시스템에서 지원되지 않기 때문입니다. 대신 URL은 종종 `text` 필드에 나타나거나 가끔은 `title` 필드에 나타나기도 합니다.

## 브라우저 지원

2021년 초부터 Web Share Target API는 다음에서 지원됩니다.

- Android의 Chrome 및 Edge 76 이상.
- ChromeOS의 Chrome 89 이상.

모든 플랫폼에서, 웹 앱이 공유 데이터를 수신할 수 있는 잠재적 대상으로 표시되려면 그 전에 해당 웹 앱이 [설치](https://developers.google.com/web/fundamentals/app-install-banners/#criteria)된 상태여야 합니다.

## 샘플 애플리케이션

- [스쿼시](https://github.com/GoogleChromeLabs/squoosh)
- [스크랩북 PWA](https://github.com/GoogleChrome/samples/blob/gh-pages/web-share/README.md#web-share-demo)

### API에 대한 지원 표시

웹 공유 대상 API를 사용할 계획인가요? 여러분의 공개적인 지원은 Chromium 팀이 기능의 우선 순위를 지정하는 데 도움이 되며 다른 브라우저 공급업체에게 해당 기능을 지원하는 것이 얼마나 중요한지 보여줍니다.

해시태그 [`#WebShareTarget`](https://twitter.com/search?q=%23WebShareTarget&src=recent_search_click&f=live)와 함께 [@ChromiumDev](https://twitter.com/ChromiumDev)로 트윗을 보내 여러분이 API를 어디서 어떻게 사용하는지 알려주세요.
