---
layout: post
title: 오디오 및 비디오 사전 로드로 빠른 재생
subhead: 리소스를 능동적으로 미리 로드하여 미디어 재생을 가속화하는 방법.
authors:
  - beaufortfrancois
description: 더 빠른 재생 시작은 더 많은 사람들이 귀하의 비디오를 보거나 오디오를 듣고 있음을 의미합니다. 이것은 알려진 사실입니다. 이 기사에서는 사용 사례에 따라 리소스를 능동적으로 미리 로드하여 미디어 재생을 가속화하는 데 사용할 수 있는 기술을 살펴보겠습니다.
date: 2017-08-17
updated: 2020-11-16
tags:
  - media
  - performance
  - network
---

더 빠른 재생 시작은 더 많은 사람들이 귀하의 비디오를 보거나 오디오를 듣고 있음을 의미합니다. [이것은 알려진 사실](https://www.digitaltrends.com/web/buffer-rage/)입니다. 이 기사에서는 사용 사례에 따라 리소스를 능동적으로 미리 로드하여 오디오 및 비디오 재생을 가속화하는 데 사용할 수 있는 기술을 살펴보겠습니다.

<figure>
  <video controls muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/fast-playback-with-preload/video-preload-hero.webm#t=1.1" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/fast-playback-with-preload/video-preload-hero.mp4#t=1.1" type="video/mp4">
  </source></source></video>
  <figcaption>
    <p>크레딧: copyright Blender Foundation | <a href="http://www.blender.org">www.blender.org</a> .</p>
  </figcaption></figure>

미디어 파일을 미리 로드하는 세 가지 방법을 장단점부터 설명하겠습니다.

<table>
  <tbody>
    <tr>
      <th></th>
      <th>장점...</th>
      <th>단점...</th>
    </tr>
    <tr>
      <td rowspan="3" style="white-space: nowrap"><a href="#video_preload_attribute">동영상 미리 로드 속성</a></td>
      <td rowspan="3">웹 서버에서 호스팅되는 고유한 파일에 사용하기 쉽습니다.</td>
      <td>브라우저는 속성을 완전히 무시할 수 있습니다.</td>
    </tr>
<tr>
      <td>HTML 문서가 완전히 로드되고 구문 분석되면 리소스 가져오기가 시작됩니다.</td>
    </tr>
    <tr>
      <td>MSE(Media Source Extensions)는 앱이 MSE에 미디어를 제공해야 하기 때문에 미디어 요소에서 <code>preload</code> 특성을 무시합니다.</td>
    </tr>
    <tr>
      <td rowspan="2" style="white-space: nowrap"><a href="#link_preload">링크 사전 로드</a></td>
      <td>
<code>onload</code> 이벤트를 차단하지 않고 브라우저가 비디오 리소스를 요청하도록 합니다.</td>
      <td>HTTP 범위 요청은 호환되지 않습니다.</td>
    </tr>
<tr>
      <td>MSE 및 파일 세그먼트와 호환됩니다.</td>
      <td>전체 리소스를 가져올 때 작은 미디어 파일(&lt;5MB)에만 사용해야 합니다.</td>
    </tr>
    <tr>
      <td><a href="#manual_buffering">수동 버퍼링</a></td>
      <td>완전 통제</td>
      <td>복잡한 오류 처리는 웹사이트의 책임입니다.</td>
    </tr>
  </tbody>
</table>

## 동영상 미리 로드 속성

비디오 소스가 웹 서버에서 호스팅되는 고유한 파일인 경우 비디오 `preload` 속성을 사용하여 [사전 로드할 정보 또는 콘텐츠의 크기](/video-and-source-tags/#preload)에 대한 힌트를 브라우저에 제공할 수 있습니다. 이는 [MSE(Media Source Extensions)](https://developer.mozilla.org/docs/Web/API/Media_Source_Extensions_API)가 `preload`와 호환되지 않음을 의미합니다.

리소스 가져오기는 초기 HTML 문서가 완전히 로드되고 구문 분석된 경우에만 시작되는 반면(예: `DOMContentLoaded` 이벤트가 시작됨), 리소스를 실제로 불러올 때 아주 다른 `load` 이벤트가 시작합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/De8tMHJUn3XyzFfosVLb.svg", alt="", width="800", height="234" %}</figure>

`preload` 속성을 `metadata`로 설정하면 사용자에게 비디오가 필요하지 않을 것으로 예상되지만 해당 메타데이터(크기, 트랙 목록, 지속 시간 등)를 가져오는 것이 바람직함을 나타냅니다. [Chrome 64](https://developers.google.com/web/updates/2017/12/chrome-63-64-media-updates#media-preload-defaults-metadata)부터 `preload`의 기본값은 `metadata`입니다. (`auto`였음)

```html
<video id="video" preload="metadata" src="file.mp4" controls></video>

<script>
  video.addEventListener('loadedmetadata', function() {
    if (video.buffered.length === 0) return;

    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`${bufferedSeconds} seconds of video are ready to play.`);
  });
</script>
```

`preload` 속성을 `auto`로 설정하면 브라우저가 추가 버퍼링을 위해 중지할 필요 없이 완전한 재생이 가능한 충분한 데이터를 캐시할 수 있음을 나타냅니다.

```html
<video id="video" preload="auto" src="file.mp4" controls></video>

<script>
  video.addEventListener('loadedmetadata', function() {
    if (video.buffered.length === 0) return;

    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`${bufferedSeconds} seconds of video are ready to play.`);
  });
</script>
```

그러나 몇 가지 주의 사항이 있습니다. 이것은 힌트일 뿐이므로 브라우저는 `preload` 속성을 완전히 무시할 수 있습니다. 작성 당시 Chrome에 적용되는 몇 가지 규칙은 다음과 같습니다.

- [데이터 세이버](https://support.google.com/chrome/answer/2392284)가 사용 설정되면 Chrome은 강제로 `preload` 값을 `none`으로 설정합니다.
- Android 4.3에서 Chrome은 [Android 버그](https://bugs.chromium.org/p/chromium/issues/detail?id=612909)로 인해 `preload` 값을 `none`으로 설정합니다.
- 셀룰러 연결(2G, 3G, 4G)에서 Chrome은 `preload` 값을 `metadata`로 강제 적용합니다.

### 팁

웹사이트에 동일한 도메인에 많은 비디오 리소스가 포함되어 있는 경우 `preload` 값을 `metadata`로 설정하거나 `poster` 속성을 정의하고 `preload`를 `none`으로 설정하는 것이 좋습니다. 그렇게 하면 리소스 로드를 중단할 수 있는 동일한 도메인에 대한 최대 HTTP 연결 수(HTTP 1.1 사양에 따라 6개)에 도달하는 것을 방지할 수 있습니다. 동영상이 핵심 사용자 경험의 일부가 아닌 경우 이렇게 하면 페이지 속도가 향상될 수도 있습니다.

## 링크 프리로드

다른 [기사](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/)에서 [다루었듯이](https://developers.google.com/web/updates/2016/03/link-rel-preload) [링크 미리 로드](https://w3c.github.io/preload/)는 `load` 이벤트를 차단하지 않고 페이지가 다운로드되는 동안 브라우저가 리소스를 요청하도록 하는 선언적 가져오기입니다. `<link rel="preload">`를 통해 로드된 리소스는 브라우저에 로컬로 저장되며 DOM, JavaScript 또는 CSS에서 명시적으로 참조될 때까지 효과적으로 비활성화됩니다.

미리 로드는 현재 탐색에 초점을 맞추고 유형(스크립트, 스타일, 글꼴, 비디오, 오디오 등)에 따라 우선적으로 리소스를 가져오는 점에서 프리페치와 다릅니다. 현재 세션에 대한 브라우저 캐시를 워밍업하는 데 사용해야 합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/g5fQKJMivvcsHajmMmi2.svg", alt="", width="800", height="234" %}</figure>

### 전체 비디오 미리 로드

다음은 웹사이트에 전체 동영상을 미리 로드하여 자바스크립트가 동영상 콘텐츠를 가져오도록 요청할 때 브라우저에서 리소스를 이미 캐시했을 수 있으므로 캐시에서 읽도록 하는 방법입니다. 사전 로드 요청이 아직 완료되지 않은 경우 일반 네트워크 가져오기가 발생합니다.

```js
<link rel="preload" as="video" href="https://cdn.com/small-file.mp4">

<video id="video" controls></video>

<script>
  // Later on, after some condition has been met, set video source to the
  // preloaded video URL.
  video.src = 'https://cdn.com/small-file.mp4';
  video.play().then(() => {
    // If preloaded video URL was already cached, playback started immediately.
  });
</script>
```

{% Aside %} 작은 미디어 파일(5MB 미만)에만 사용하는 것이 좋습니다. {% endAside %}

예에서 미리 로드된 리소스는 비디오 요소에서 소비될 것이기 때문에 `as` 미리 로드 링크 값은 `video`입니다. 오디오 요소인 경우 `as="audio"`가 됩니다.

### 첫 번째 세그먼트 미리 로드

`<link rel="preload">`를 사용하여 비디오의 첫 번째 세그먼트를 미리 로드하고 미디어 소스 확장과 함께 사용하는 방법을 보여줍니다. MSE JavaScript API에 익숙하지 않은 경우 [MSE 기본 사항](https://developer.mozilla.org/docs/Web/API/Media_Source_Extensions_API)을 참조하십시오.

`file_1.webm` , `file_2.webm` , `file_3.webm` 등과 같은 더 작은 파일로 분할되었다고 가정해 보겠습니다.

```html
<link rel="preload" as="fetch" href="https://cdn.com/file_1.webm">

<video id="video" controls></video>

<script>
  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

  function sourceOpen() {
    URL.revokeObjectURL(video.src);
    const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');

    // If video is preloaded already, fetch will return immediately a response
    // from the browser cache (memory cache). Otherwise, it will perform a
    // regular network fetch.
    fetch('https://cdn.com/file_1.webm')
    .then(response => response.arrayBuffer())
    .then(data => {
      // Append the data into the new sourceBuffer.
      sourceBuffer.appendBuffer(data);
      // TODO: Fetch file_2.webm when user starts playing video.
    })
    .catch(error => {
      // TODO: Show "Video is not available" message to user.
    });
  }
</script>
```

{% Aside 'warning' %} 교차 출처 리소스의 경우 CORS 헤더가 올바르게 설정되었는지 확인하십시오. `fetch(videoFileUrl, { mode: 'no-cors' })`로 검색된 불투명 응답에서 배열 버퍼를 만들 수 없으므로 비디오 또는 오디오 요소를 공급할 수 없습니다. {% endAside %}

### 지원

미리 로드를 지원하는 브라우저를 확인하려면 MDN의 [브라우저 호환성](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility) 표를 참조하십시오. 성능 측정 항목을 조정하기 위해 아래 스니펫으로 가용성을 감지할 수 있습니다.

```js
function preloadFullVideoSupported() {
  const link = document.createElement('link');
  link.as = 'video';
  return (link.as === 'video');
}

function preloadFirstSegmentSupported() {
  const link = document.createElement('link');
  link.as = 'fetch';
  return (link.as === 'fetch');
}
```

## 수동 버퍼링

[Cache API](https://developer.mozilla.org/docs/Web/API/Cache)와 서비스 워커에 대해 알아보기 전에 MSE로 비디오를 수동으로 버퍼링하는 방법을 살펴보겠습니다. 아래 예에서는 웹 서버가 HTTP [`Range`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Range) 요청을 지원한다고 가정하지만 이는 파일 세그먼트와 매우 유사합니다. [Google의 Shaka Player](https://github.com/google/shaka-player) , [JW Player](https://developer.jwplayer.com/) 및 [Video.js](http://videojs.com/)와 같은 일부 미들웨어 라이브러리는 이를 처리하도록 빌드되었습니다.

```html
<video id="video" controls></video>

<script>
  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

  function sourceOpen() {
    URL.revokeObjectURL(video.src);
    const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');

    // Fetch beginning of the video by setting the Range HTTP request header.
    fetch('file.webm', { headers: { range: 'bytes=0-567139' } })
    .then(response => response.arrayBuffer())
    .then(data => {
      sourceBuffer.appendBuffer(data);
      sourceBuffer.addEventListener('updateend', updateEnd, { once: true });
    });
  }

  function updateEnd() {
    // Video is now ready to play!
    const bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
    console.log(`${bufferedSeconds} seconds of video are ready to play.`);

    // Fetch the next segment of video when user starts playing the video.
    video.addEventListener('playing', fetchNextSegment, { once: true });
  }

  function fetchNextSegment() {
    fetch('file.webm', { headers: { range: 'bytes=567140-1196488' } })
    .then(response => response.arrayBuffer())
    .then(data => {
      const sourceBuffer = mediaSource.sourceBuffers[0];
      sourceBuffer.appendBuffer(data);
      // TODO: Fetch further segment and append it.
    });
  }
</script>
```

### 고려 사항

이제 전체 미디어 버퍼링 경험을 제어할 수 있으므로 사전 로드를 고려할 때 장치의 배터리 수준, "데이터 절약 모드" 사용자 기본 설정 및 네트워크 정보를 고려하는 것이 좋습니다.

#### 배터리 인식

동영상을 미리 로드하기 전에 사용자 기기의 배터리 잔량을 고려하세요. 이렇게 하면 전력 수준이 낮을 때 배터리 수명이 보존됩니다.

기기의 배터리가 부족할 때 미리 로드를 비활성화하거나 최소한 저해상도 비디오를 미리 로드합니다.

```js
if ('getBattery' in navigator) {
  navigator.getBattery()
  .then(battery => {
    // If battery is charging or battery level is high enough
    if (battery.charging || battery.level > 0.15) {
      // TODO: Preload the first segment of a video.
    }
  });
}
```

#### "데이터 세이버" 감지

`Save-Data` 클라이언트 힌트 요청 헤더를 사용하여 브라우저에서 "데이터 절약" 모드를 선택한 사용자에게 빠르고 가벼운 애플리케이션을 제공합니다. 이 요청 헤더를 식별함으로써 애플리케이션은 비용 및 성능 제약이 있는 사용자에게 최적화된 사용자 경험을 사용자 지정하고 제공할 수 있습니다.

자세한 내용은 [Save-Data로 빠르고 가벼운 애플리케이션 제공](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/save-data)을 참조하십시오.

#### 네트워크 정보 기반 스마트 로드

미리 로드하기 전에 `navigator.connection.type`을 확인하고 싶을 수 있습니다. `cellular`로 설정하면 사전 로드를 방지하고 모바일 네트워크 운영자가 대역폭에 대해 요금을 부과할 수 있음을 사용자에게 알리고 이전에 캐시된 콘텐츠의 자동 재생만 시작할 수 있습니다.

```js
if ('connection' in navigator) {
  if (navigator.connection.type == 'cellular') {
    // TODO: Prompt user before preloading video
  } else {
    // TODO: Preload the first segment of a video.
  }
}
```

[네트워크 정보 샘플](https://googlechrome.github.io/samples/network-information/)을 확인하여 네트워크 변경 사항에 대응하는 방법도 알아보십시오.

### 여러 개의 첫 번째 세그먼트를 사전 캐시

이제 사용자가 결국 선택할 미디어를 모른 채 일부 미디어 콘텐츠를 추측에 따라 미리 로드하려면 어떻게 해야 합니까? 사용자가 10개의 비디오가 포함된 웹 페이지에 있는 경우 각각에서 하나의 세그먼트 파일을 가져오기에 충분한 메모리가 있지만 10개의 숨겨진 `<video>` 요소와 10개의 `MediaSource` 객체를 만들고 해당 데이터를 공급하기 시작해서는 안 됩니다.

아래의 두 부분으로 구성된 예제는 강력하고 사용하기 쉬운 [Cache API](/cache-api-quick-guide/) 를 사용하여 비디오의 여러 첫 번째 세그먼트를 미리 캐싱하는 방법을 보여줍니다. IndexedDB에서도 비슷한 것을 얻을 수 있습니다. `window` 개체에서도 액세스할 수 있으므로 아직 서비스 워커를 사용하지 않습니다.

#### 불러오기 및 캐시

```js
const videoFileUrls = [
  'bat_video_file_1.webm',
  'cow_video_file_1.webm',
  'dog_video_file_1.webm',
  'fox_video_file_1.webm',
];

// Let's create a video pre-cache and store all first segments of videos inside.
window.caches.open('video-pre-cache')
.then(cache => Promise.all(videoFileUrls.map(videoFileUrl => fetchAndCache(videoFileUrl, cache))));

function fetchAndCache(videoFileUrl, cache) {
  // Check first if video is in the cache.
  return cache.match(videoFileUrl)
  .then(cacheResponse => {
    // Let's return cached response if video is already in the cache.
    if (cacheResponse) {
      return cacheResponse;
    }
    // Otherwise, fetch the video from the network.
    return fetch(videoFileUrl)
    .then(networkResponse => {
      // Add the response to the cache and return network response in parallel.
      cache.put(videoFileUrl, networkResponse.clone());
      return networkResponse;
    });
  });
}
```

HTTP `Range` 요청을 사용하려면 Cache API가 [아직](https://github.com/whatwg/fetch/issues/144) `Range` 응답을 지원하지 않기 때문에 `Response` 객체를 수동으로 다시 생성해야 합니다. `networkResponse.arrayBuffer()`를 호출하면 응답의 전체 내용을 한 번에 렌더러 메모리로 가져오므로 작은 범위를 사용하는 것이 좋습니다.

참고로, HTTP 범위 요청을 비디오 프리캐시에 저장하기 위해 위의 예시의 일부를 수정했습니다.

```js
    ...
    return fetch(videoFileUrl, { headers: { range: 'bytes=0-567139' } })
    .then(networkResponse => networkResponse.arrayBuffer())
    .then(data => {
      const response = new Response(data);
      // Add the response to the cache and return network response in parallel.
      cache.put(videoFileUrl, response.clone());
      return response;
    });
```

#### 동영상 재생

사용자가 재생 버튼을 클릭하면 Cache API에서 사용 가능한 비디오의 첫 번째 세그먼트를 가져와 사용 가능한 경우 즉시 재생이 시작되도록 합니다. 그렇지 않으면 단순히 네트워크에서 가져옵니다. 브라우저와 사용자는 [캐시](/storage-for-the-web/#eviction)를 지우기로 결정할 수 있습니다.

앞에서 본 것처럼 MSE를 사용하여 비디오의 첫 번째 세그먼트를 비디오 요소에 공급합니다.

```js
function onPlayButtonClick(videoFileUrl) {
  video.load(); // Used to be able to play video later.

  window.caches.open('video-pre-cache')
  .then(cache => fetchAndCache(videoFileUrl, cache)) // Defined above.
  .then(response => response.arrayBuffer())
  .then(data => {
    const mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

    function sourceOpen() {
      URL.revokeObjectURL(video.src);

      const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');
      sourceBuffer.appendBuffer(data);

      video.play().then(() => {
        // TODO: Fetch the rest of the video when user starts playing video.
      });
    }
  });
}
```

{% Aside 'warning' %} 교차 출처 리소스의 경우 CORS 헤더가 올바르게 설정되었는지 확인하십시오. `fetch(videoFileUrl, { mode: 'no-cors' })`로 검색된 불투명 응답에서 배열 버퍼를 만들 수 없으므로 비디오 또는 오디오 요소를 공급할 수 없습니다. {% endAside %}

### 서비스 워커로 범위 응답 생성

이제 전체 비디오 파일을 가져와서 Cache API에 저장했다면 어떻게 될까요? 브라우저가 HTTP `Range` 요청을 보낼 때 캐시 API가 [아직](https://github.com/whatwg/fetch/issues/144) `Range` 응답을 지원하지 않기 때문에 전체 비디오를 렌더러 메모리로 가져오고 싶지 않을 것입니다.

따라서 이러한 요청을 가로채서 서비스 작업자로부터 사용자 지정된 `Range` 응답을 반환하는 방법을 보여드리겠습니다.

```js
addEventListener('fetch', event => {
  event.respondWith(loadFromCacheOrFetch(event.request));
});

function loadFromCacheOrFetch(request) {
  // Search through all available caches for this request.
  return caches.match(request)
  .then(response => {

    // Fetch from network if it's not already in the cache.
    if (!response) {
      return fetch(request);
      // Note that we may want to add the response to the cache and return
      // network response in parallel as well.
    }

    // Browser sends a HTTP Range request. Let's provide one reconstructed
    // manually from the cache.
    if (request.headers.has('range')) {
      return response.blob()
      .then(data => {

        // Get start position from Range request header.
        const pos = Number(/^bytes\=(\d+)\-/g.exec(request.headers.get('range'))[1]);
        const options = {
          status: 206,
          statusText: 'Partial Content',
          headers: response.headers
        }
        const slicedResponse = new Response(data.slice(pos), options);
        slicedResponse.setHeaders('Content-Range': 'bytes ' + pos + '-' +
            (data.size - 1) + '/' + data.size);
        slicedResponse.setHeaders('X-From-Cache': 'true');

        return slicedResponse;
      });
    }

    return response;
  }
}
```

`response.arrayBuffer()`가 전체 파일을 렌더러 메모리로 가져오는 동안 단순히 파일에 대한 핸들을 제공하기 때문에 이 슬라이스 응답을 재생성하기 위해 `response.blob()`을 사용했다는 점에 유의하는 것이 중요합니다.

내 사용자 지정 `X-From-Cache` HTTP 헤더를 사용하여 이 요청이 캐시에서 왔는지 네트워크에서 왔는지 알 수 있습니다. [ShakaPlayer](https://github.com/google/shaka-player/blob/master/docs/tutorials/service-worker.md)와 같은 플레이어는 응답 시간을 네트워크 속도의 지표로 무시하는 데 사용할 수 있습니다.

{% YouTube 'f8EGZa32Mts' %}

`Range` 요청을 처리하는 방법에 대한 완전한 솔루션은 공식 [샘플 미디어 앱](https://github.com/GoogleChrome/sample-media-pwa) 과 특히 [ranged-response.js](https://github.com/GoogleChrome/sample-media-pwa/blob/master/src/client/scripts/ranged-response.js) 파일을 살펴보십시오.
