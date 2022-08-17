---
layout: post
title: "<video> 및 <source> 태그"
authors:
  - samdutton
  - joemedley
  - derekherman
description: 웹용 비디오 파일을 제대로 준비하고, 정확한 치수와 해상도를 주고, 다양한 브라우저를 위해 별도의 WebM 및 MP4 파일도 생성하셨네요. 그렇지만 모두가 보려면 웹 페이지에 추가해야 합니다.
date: 2014-02-15
updated: 2021-07-05
tags:
  - media
---

웹용 [비디오 파일을 제대로 준비](/prepare-media/)하고, 정확한 치수와 해상도를 주고, 다양한 브라우저를 위해 별도의 WebM 및 MP4 파일도 생성하셨네요. 그렇지만 모두가 보려면 웹 페이지에 추가해야 합니다.

다른 사람이 비디오를 보려면 웹 페이지에 추가해야 합니다. [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video)와 [`<source>`](https://developer.mozilla.org/docs/Web/HTML/Element/source)라는 두 개의 HTML 요소를 추가해야 합니다. 이러한 태그의 기본 사항 외에도 이 문서에서는 우수한 사용자 경험을 만들기 위해 해당 태그에 추가해야 하는 속성에 대해 설명합니다.

{% Aside %} 언제든지 [YouTube](https://www.youtube.com/) 또는 [Vimeo](https://vimeo.com)에 파일을 업로드할 수 있습니다. 대부분의 경우 여기에 설명된 절차보다 이 방법이 더 좋습니다. 이러한 서비스는 형식 지정 및 파일 형식 변환을 처리할 뿐만 아니라 웹 페이지에 비디오를 포함할 수 있는 수단을 제공합니다. 직접 관리해야 하는 경우 계속 읽으십시오. {% endAside %}

## 단일 파일 지정

권장되지는 않지만 비디오 요소를 단독으로 사용할 수 있습니다. 항상 아래와 같이 `type` 속성을 사용하십시오. 브라우저는 이를 사용하여 제공된 비디오 파일을 재생할 수 있는지 확인합니다. 그렇지 않은 경우 동봉된 텍스트가 표시됩니다.

```html
<video src="chrome.webm" type="video/webm">
    <p>Your browser cannot play the provided video file.</p>
</video>
```

### 여러 파일 형식 지정

모든 브라우저가 동일한 비디오 형식을 지원하지 않는다는 것을 [미디어 파일 기본 사항](/media-file-basics/)에서 상기하십시오. `<source>` 요소를 사용하면 사용자의 브라우저가 그 중 하나를 지원하지 않는 경우를 대비하여 여러 형식을 대체 형식으로 지정할 수 있습니다.

아래 예제에서는 이 문서의 뒷부분에서 예제로 사용되는 포함된 비디오를 생성합니다.

```html
<video controls>
  <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.webm" type="video/webm">
  <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4" type="video/mp4">
  <p>Your browser cannot play the provided video file.</p>
</video>
```

[Glitch에서 사용해 보세요](https://track-demonstration.glitch.me)([소스](https://glitch.com/edit/#!/track-demonstration))

{% Aside %} 이전 예에서 `controls` 속성이 도입되었음을 알 수 있습니다. 이것은 사용자가 볼륨, 탐색, 캡션 선택, 재생 일시 중지/재개를 비롯한 비디오 재생을 제어할 수 있도록 브라우저에 지시합니다. {% endAside %}

선택 사항이지만 `<source>` 태그에 `type` 속성을 항상 추가해야 합니다. 이렇게 하면 브라우저가 재생할 수 있는 파일만 다운로드합니다.

이 접근 방식은 특히 모바일에서 다양한 HTML 또는 서버 측 스크립팅을 제공하는 것보다 몇 가지 이점이 있습니다.

- 선호하는 순서대로 형식을 나열할 수 있습니다.
- 클라이언트 측 스위칭은 대기 시간을 줄입니다. 콘텐츠를 가져오기 위해 한 번만 요청됩니다.
- 브라우저가 형식을 선택하도록 하는 것이 사용자 에이전트 감지와 함께 서버 측 지원 데이터베이스를 사용하는 것보다 더 간단하고 빠르며 잠재적으로 더 안정적입니다.
- 각 파일 소스의 유형을 지정하면 네트워크 성능이 향상됩니다. 브라우저는 형식을 "스니핑"하기 위해 비디오의 일부를 다운로드하지 않고도 비디오 소스를 선택할 수 있습니다.

이러한 문제는 대역폭과 대기 시간이 중요하고 사용자의 인내심이 제한될 가능성이 있는 모바일 컨텍스트에서 특히 중요합니다. `type` 속성을 생략하면 지원되지 않는 유형의 소스가 여러 개 있는 경우 성능에 영향을 줄 수 있습니다.

세부 정보를 자세히 알아 볼 수 있는 몇 가지 방법이 있습니다. 비디오와 오디오가 웹에서 어떻게 작동하는지 자세히 알아보려면 [괴짜를 위한 디지털 미디어 입문서](https://www.xiph.org/video/vid1.shtml)를 확인하십시오. 또한 DevTools에서 [원격 디버깅](https://developer.chrome.com/docs/devtools/remote-debugging/)을 사용하여 [유형 속성이 있는](https://googlesamples.github.io/web-fundamentals/fundamentals/media/video-main.html) 네트워크 활동과 [유형 속성이 없는](https://googlesamples.github.io/web-fundamentals/fundamentals/design-and-ux/responsive/notype.html) 네트워크 활동을 비교할 수 있습니다.

{% Aside 'caution' %} 브라우저 개발자 도구에서 응답 헤더를 확인하여 서버가 [올바른 MIME 유형을 보고하는지 확인하십시오](https://developer.mozilla.org/en/docs/Properly_Configuring_Server_MIME_Types). 그렇지 않으면 비디오 소스 유형 검사가 작동하지 않습니다. {% endAside %}

### 시작 및 종료 시간 지정

대역폭을 절약하고 사이트의 반응성을 높이십시오. 미디어 조각을 사용하여 비디오 요소에 시작 및 종료 시간을 추가하십시오.

<figure>
  <video controls width="100%">
    <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.webm#t=5,10" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4#t=5,10" type="video/mp4">
    <p>이 브라우저는 비디오 요소를 지원하지 않습니다.</p>
  </source></source></video></figure>

미디어 조각을 사용하려면 `#t=[start_time][,end_time]`을 추가합니다. 예를 들어, 5초에서 10초 사이의 비디오를 재생하려면 다음을 지정합니다.

```html
<source src="video/chrome.webm#t=5,10" type="video/webm">
```

`<hours>:<minutes>:<seconds>`으로 시간을 지정할 수도 있습니다. 예를 들어 `#t=00:01:05`는 1분 5초에서 동영상을 시작합니다. 비디오의 처음 1분만 재생하려면 `#t=,00:01:00`으로 지정하세요.

이 기능을 사용하면 여러 파일을 인코딩하고 제공할 필요 없이 DVD의 큐 포인트와 같이 동일한 비디오에서 여러 보기를 제공할 수 있습니다.

이 기능이 작동하려면 서버가 범위 요청을 지원해야 하고 해당 기능을 활성화해야 합니다. 대부분의 서버는 기본적으로 범위 요청을 활성화합니다. 일부 호스팅 서비스는 이 기능을 끄므로 사이트에서 조각을 사용하기 위해 범위 요청을 사용할 수 있는지 확인해야 합니다.

다행히 브라우저 개발자 도구에서 이 작업을 수행할 수 있습니다. 예를 들어 Chrome에서는 [네트워크 패널에](https://developer.chrome.com/docs/devtools/#network) 있습니다. `Accept-Ranges` `bytes` 라고 표시되어 있는지 확인합니다. 이미지에서 이 헤더 주위에 빨간색 상자를 그렸습니다. `bytes` 가 표시되지 않으면 호스팅 제공업체에 문의해야 합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/20DlLyicG5PAo6TXBKh3.png", alt="Chrome DevTools 스크린샷. Accept-Ranges: 바이트.", width="800", height="480" %} <figcaption> Chrome DevTools 스크린샷. Accept-Ranges: 바이트.</figcaption></figure>

### 포스터 이미지 포함

`video`를 다운로드하거나 재생을 시작할 필요 없이 요소가 로드되는 즉시 시청자가 어떤 콘텐츠인지 알 수 있도록 비디오 요소에 포스터 속성을 추가하십시오.

```html
<video poster="poster.jpg" ...>
  …
</video>
```

`src`가 손상되었거나 제공된 비디오 형식이 지원되지 않는 경우 포스터가 대체될 수도 있습니다. 포스터 이미지의 유일한 단점은 일부 대역폭을 소비하고 렌더링이 필요한 추가 파일 요청입니다. 자세한 내용은 [이미지를 효율적으로 인코딩](/uses-optimized-images/)을 참조하십시오.

<div class="w-columns">{% Compare 'worse' %}<figure data-float="left"> {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/R8VNeplKwajJhOuVkPDT.png", alt="대체 포스터가 없으면 동영상이 깨져 보입니다.", width="360", height="600" %}</figure>
</div>
<p data-md-type="paragraph">{% CompareCaption %} 대체 포스터가 없으면 동영상이 깨져 보입니다. {% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<p data-md-type="paragraph">{% Compare 'better' %}</p>
<div data-md-type="block_html"><figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rNhydHVGeL2P0sQ0je5k.png", alt="대체 포스터는 첫 번째 프레임이 캡처된 것처럼 보이게 합니다.", width="360", height="600" %}</figure></div>
<p data-md-type="paragraph">{% CompareCaption %} 대체 포스터는 첫 번째 프레임이 캡처된 것처럼 보이게 합니다. {% endCompareCaption %}</p>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

### 동영상이 컨테이너를 넘지 않도록 합니다

비디오 요소가 뷰포트에 비해 너무 크면 컨테이너가 오버플로되어 사용자가 콘텐츠를 보거나 컨트롤을 사용할 수 없게 될 수 있습니다.

<div class="w-columns">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cDl2OfCE3hQivhaNvMUh.png", alt="Android Chrome 스크린샷, 세로: 스타일이 지정되지 않은 동영상 요소가 뷰포트를 초과합니다.", width="338", height="600" %}<figcaption> Android Chrome 스크린샷, 세로: 스타일이 지정되지 않은 동영상 요소가 표시 영역을 넘습니다.</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bCiZsNkZNsAhWbOBsLCs.png", alt="Android Chrome 스크린샷, 가로: 스타일이 지정되지 않은 동영상 요소가 뷰포트를 초과합니다.", width="800", height="450" %}<figcaption> Android Chrome 스크린샷, 가로: 스타일이 지정되지 않은 동영상 요소가 뷰포트를 넘습니다.</figcaption></figure>
</div>

CSS를 사용하여 비디오 크기를 제어할 수 있습니다. CSS가 모든 요구 사항을 충족하지 못하는 경우 YouTube 및 기타 소스의 비디오에 대해서도 [FitVids](http://fitvidsjs.com/)(이 기사의 범위를 벗어남)와 같은 JavaScript 라이브러리 및 플러그인이 도움이 될 수 있습니다. 불행히도 이러한 리소스는 [네트워크 페이로드 크기](/total-byte-weight/)를 증가시켜 수익과 부정적인 결과를 초래하고 사용자에게는 많은 비용이 발생할 수 있습니다.

여기에서 설명하는 것과 같은 간단한 용도의 경우 [CSS 미디어 쿼리](https://developers.google.com/web/fundamentals/design-and-ux/responsive/#css-media-queries)를 사용하여 뷰포트 크기에 따라 요소의 크기를 지정합니다. `max-width: 100%`를 사용하세요.

iframe의 미디어 콘텐츠(예: YouTube 동영상)의 경우 반응형 접근 방식(예: [John Surdakowski가 제안한](http://avexdesigns.com/responsive-youtube-embed/) 방식)을 시도해 보세요.

{% Aside 'caution' %} 원본 동영상과 [가로 세로 비율](https://www.google.com/search?q=aspect+ratio&oq=aspect+ratio&aqs=chrome..69i57j35i39j0l6.1896j0j7&sourceid=chrome&ie=UTF-8)이 다른 요소 크기를 강제로 조정하지 마세요. 찌그러지거나 늘어진 비디오는 끔찍해 보입니다. {% endAside %}

#### CSS

```css
.video-container {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 0;
    height: 0;
    overflow: hidden;
}

.video-container iframe,
.video-container object,
.video-container embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
```

#### HTML

```html
<div class="video-container">
  <iframe src="//www.youtube.com/embed/l-BA9Ee2XuM"
          frameborder="0" width="560" height="315">
  </iframe>
</div>
```

[사용해 보기](https://googlesamples.github.io/web-fundamentals/fundamentals/media/responsive_embed.html)

[반응형 샘플](https://googlesamples.github.io/web-fundamentals/fundamentals/media/responsive_embed.html)을 [비 반응형 버전](https://googlesamples.github.io/web-fundamentals/fundamentals/design-and-ux/responsive/unyt.html)과 비교해 보세요. 보시다시피 응답이 없는 버전은 훌륭한 사용자 경험이 아닙니다.

### 장치 방향

장치 방향은 데스크톱 모니터나 랩톱에서 문제가 되지 않지만 모바일 장치 및 태블릿용 웹 페이지 디자인을 고려할 때 매우 중요합니다.

iPhone의 Safari는 세로 방향과 가로 방향 사이를 잘 전환합니다.

<div class="w-columns">
<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/AmHneDShMOioWZwYG2kF.png", alt="iPhone의 Safari에서 재생되는 비디오 스크린샷(세로).", width="338", height="600" %}<figcaption> iPhone의 Safari에서 재생 중인 비디오의 스크린샷(세로).</figcaption></figure><figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MZwkLJaXVk4g8lruhiKZ.png", alt="iPhone의 Safari에서 재생되는 비디오의 스크린샷(가로).", width="600", height="338" %} <figcaption> iPhone의 Safari에서 재생 중인 비디오의 스크린샷(가로).</figcaption></figure>
</div>

iPad 및 Android Chrome에서 기기 방향은 문제가 될 수 있습니다. 예를 들어, 사용자 정의 없이 iPad에서 가로 방향으로 재생되는 비디오는 다음과 같은 모습입니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9FsExgY6cJFfMkxOPNkl.png", alt="iPad의 Safari에서 재생되는 비디오의 스크린샷(가로)",  width="600", height="450" %}<figcaption> iPad의 Safari에서 재생 중인 비디오의 스크린샷(가로).</figcaption></figure>

CSS를 사용하여 비디오를 `width: 100%` 혹은 `max-width: 100%`로 설정하면 많은 장치 방향 레이아웃 문제를 해결할 수 있습니다.

### 자동 재생

`autoplay` 속성은 브라우저가 비디오를 즉시 다운로드하고 재생할지 여부를 제어합니다. 정확한 작동 방식은 플랫폼과 브라우저에 따라 다릅니다.

- Chrome: 보기가 데스크톱인지, 모바일 사용자가 홈 화면에 사이트 또는 앱을 추가했는지 여부를 포함하되 이에 국한되지 않는 여러 요인에 따라 달라집니다. 자세한 내용은 [자동 재생 모범 사례](/autoplay-best-practices/)를 참조하세요.

- Firefox: 모든 비디오 및 사운드를 차단하지만 사용자에게 모든 사이트 또는 특정 사이트에 대한 이러한 제한을 완화할 수 있는 기능을 제공합니다. 자세한 내용은 [Firefox에서 미디어 자동 재생 허용 또는 차단](https://support.mozilla.org/en-US/kb/block-autoplay)을 참조하세요.

- Safari: 역사적으로 사용자 제스처가 필요했지만 최근 버전에서는 이 요구 사항을 완화했습니다. 자세한 내용은 [iOS용 새 &lt;video&gt; 정책](https://webkit.org/blog/6784/new-video-policies-for-ios/)을 참조하십시오.

자동 재생이 가능한 플랫폼에서도 자동 재생을 활성화하는 것이 좋은지 고려해야 합니다.

- 데이터 요금이 비쌀 수 있습니다.
- 사용자가 원하기 전에 미디어를 재생하면 대역폭과 CPU가 소모되어 페이지 렌더링이 지연될 수 있습니다.
- 사용자가 비디오 또는 오디오 재생이 방해가 되는 상황에 있을 수 있습니다.

### 사전 로드

`preload` 속성은 브라우저에 미리 로드할 정보나 콘텐츠의 양에 대한 힌트를 제공합니다.

<table class="responsive">
  <thead>
    <tr>
      <th>값</th>
      <th>설명</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-th="Value"><code>none</code></td>
      <td data-th="Description">사용자가 비디오를 보지 않기로 선택할 수 있으므로 아무 것도 미리 로드하지 않습니다.</td>
    </tr>
    <tr>
      <td data-th="Value"><code>metadata</code></td>
      <td data-th="Description">메타데이터(시간, 크기, 텍스트 트랙)는 미리 로드하지만 최소한의 동영상만 로드 됩니다.</td>
    </tr>
    <tr>
      <td data-th="Value"><code>auto</code></td>
      <td data-th="Description">전체 비디오를 즉시 다운로드하는 것이 바람직한 것으로 간주됩니다. 빈 문자열은 동일한 결과를 생성합니다.</td>
    </tr>
  </tbody>
</table>

`preload` 속성은 플랫폼마다 다른 영향을 미칩니다. 예를 들어 Chrome은 데스크톱에서 25초 분량의 비디오를 버퍼링하지만 iOS 또는 Android에서는 버퍼링하지 않습니다. 즉, 모바일에서는 데스크톱에서는 발생하지 않는 재생 시작 지연이 있을 수 있습니다. 자세한 내용은 [오디오 및 비디오 사전 로드로 빠른 재생](/fast-playback-with-preload/) 또는 [Steve Souders의 블로그](https://www.stevesouders.com/blog/2013/04/12/html5-video-preload/)를 참조하십시오.

이제 웹 페이지에 미디어를 추가하는 방법을 알았으므로 청각 장애인을 위해 비디오에 캡션을 추가하거나 오디오를 재생할 수 없는 경우를 위한 [미디어 접근성](/media-accessibility/)에 대해 알아볼 차례입니다.
