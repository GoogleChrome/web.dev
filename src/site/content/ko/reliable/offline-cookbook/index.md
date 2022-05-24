---
layout: post
title: 오프라인 요리책
description: 앱이 오프라인에서 작동하도록 하기 위한 몇 가지 일반적인 레시피.
authors:
  - jakearchibald
date: 2014-12-09
updated: 2020-09-28
---

[Service Worker](/service-workers-cache-storage/)를 사용하여 오프라인으로 해결하려는 시도를 포기하고 개발자가 스스로 해결하도록 움직일 수 있는 부분을 제공했습니다. 캐싱 및 요청 처리 방법을 제어할 수 있습니다. 즉, 자신만의 패턴을 만들 수 있습니다. 몇 가지 가능한 패턴을 개별적으로 살펴보겠습니다. 하지만 실제로는 URL과 컨텍스트에 따라 많은 패턴을 함께 사용할 것입니다.

이러한 패턴 중 일부의 작동 데모는 [스킬 훈련](https://jakearchibald.github.io/trained-to-thrill/) 및 성능 영향을 보여주는 [이 비디오](https://www.youtube.com/watch?v=px-J9Ghvcx4)를 참조하십시오.

## 캐시 머신 - 리소스 저장 시기

[Service Worker](/service-workers-cache-storage/)를 사용하면 캐싱과 별개로 요청을 처리할 수 있으므로, 따로 설명하겠습니다. 먼저 캐싱을 언제 수행해야 할까요?

### 설치 시 - 종속성 {: #on-install-as-dependency }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CLdlCeKfoOPfpYDx1s0p.png", alt="설치 시 - 종속성.", width="800", height="498" %}<figcaption> 설치 시 - 종속성.</figcaption></figure>

Service Worker는 `install` 이벤트를 제공합니다. 이를 사용하여 다른 이벤트를 처리하기 전에 준비해야 하는 항목을 준비할 수 있습니다. 이 문제가 발생하는 동안 Service Worker의 이전 버전은 여전히 실행 중이고 페이지를 제공하므로, 여기에서 수행하는 작업이 중단되어서는 안 됩니다.

**이상적인 대상:** CSS, 이미지, 글꼴, JS, 템플릿… 기본적으로 사이트의 해당 "버전"에 대해 정적이라고 생각하는 모든 것.

가져오지 못한 경우, 사이트를 완전히 작동하지 않게 만드는 요소이며, 동등한 플랫폼별 앱이 초기 다운로드의 일부로 만드는 요소입니다.

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mysite-static-v3').then(function (cache) {
      return cache.addAll([
        '/css/whatever-v3.css',
        '/css/imgs/sprites-v6.png',
        '/css/fonts/whatever-v8.woff',
        '/js/all-min-v4.js',
        // etc.
      ]);
    }),
  );
});
```

`event.waitUntil`은 설치의 길이와 성공을 정의하는 약속을 받습니다. 약속이 거부되면 설치가 실패한 것으로 간주되고 이 서비스 워커는 중단됩니다(이전 버전이 실행 중인 경우 그대로 유지됨). `caches.open()` 및 `cache.addAll()` 약속을 반환합니다. 리소스를 가져오는 데 실패하면 `cache.addAll()` 호출이 거부됩니다.

[스킬 훈련](https://jakearchibald.github.io/trained-to-thrill/)에서 [정적 자산](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L3)을 캐시하는 데 이것을 사용합니다.

### 설치 시 - 종속성이 아님 {: #on-install-not }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/S5L9hw95GKGWS1l0ImGl.png", alt="설치 시 - 종속성이 아님.", width="800", height="500" %}<figcaption> 설치 시 - 종속성이 아님.</figcaption></figure>

위와 비슷하지만 설치 완료를 지연시키지 않으며 캐싱이 실패해도 설치가 실패하지 않습니다.

**이상적인 대상:** 게임의 나중 레벨을 위한 자산과 같이 당장 필요하지 않은 더 큰 리소스.

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mygame-core-v1').then(function (cache) {
      cache
        .addAll
        // levels 11–20
        ();
      return cache
        .addAll
        // core assets and levels 1–10
        ();
    }),
  );
});
```

위의 예는 `cache.addAll` 11~20레벨 약속을 `event.waitUntil`(으)로 다시 전달하지 못하므로 실패하더라도 게임은 오프라인에서 계속 사용할 수 있습니다. 물론 해당 레벨이 없을 가능성에 대비하고 누락된 경우 캐싱을 다시 시도해야 합니다.

Service Worker는 이벤트 처리가 완료되었기 때문에 레벨 11–20이 다운로드되는 동안 종료될 수 있습니다. 즉, 캐시되지 않습니다. 미래에는 [Web Periodic Background Synchronization API](https://developer.mozilla.org/docs/Web/API/Web_Periodic_Background_Synchronization_API)가 이와 같은 경우와 영화와 같은 대용량 다운로드를 처리할 것입니다. 해당 API는 현재 Chromium 제품군에서만 지원됩니다.

### 활성화 시 {: #on-activate }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/pUH91vKtMTLXNgpHmID2.png", alt="활성화 시.", width="800", height="500" %} <figcaption>활성화 시.</figcaption></figure>

**이상적인 대상:** 정리 및 마이그레이션.

새 Service Worker가 설치되고 이전 버전이 사용되지 않으면 새 Service Worker가 활성화되고 `activate` 이벤트가 발생합니다. 이전 버전이 방해가 되기 때문에 [IndexedDB에서 스키마 마이그레이션](/indexeddb-best-practices/)을 처리하고 사용하지 않는 캐시도 삭제하는 것이 좋습니다.

```js
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          }),
      );
    }),
  );
});
```

`fetch`와 같은 다른 이벤트가 대기열에 들어가므로 긴 활성화는 잠재적으로 페이지 로드를 차단할 수 있습니다. 활성화를 가능한 한 적게 유지하고 이전 버전이 활성화된 동안에는 *할 수 없었던* 작업에만 사용하십시오.

[스릴 훈련](https://jakearchibald.github.io/trained-to-thrill/)에서 이것을 사용하여 [오래된 캐시](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L17)를 제거합니다.

### 사용자 상호작용 시 {: #on-user-interaction }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/q5uUUHvxb3Is8N5Toxja.png", alt="사용자 상호작용 시On user interaction.", width="800", height="222" %} <figcaption>사용자 상호작용 시.</figcaption></figure>

**이상적인 대상:** 전체 사이트를 오프라인으로 전환할 수 없고 사용자가 오프라인에서 사용할 수 있는 콘텐츠를 선택할 수 있도록 선택한 경우. 예를 들어 YouTube와 같은 동영상, Wikipedia의 글, Flickr의 특정 갤러리.

사용자에게 "나중에 읽기" 또는 "오프라인용으로 저장" 버튼을 제공합니다. 클릭하면 네트워크에서 필요한 것을 가져와 캐시에 넣습니다.

```js
document.querySelector('.cache-article').addEventListener('click', function (event) {
  event.preventDefault();

  var id = this.dataset.articleId;
  caches.open('mysite-article-' + id).then(function (cache) {
    fetch('/get-article-urls?id=' + id)
      .then(function (response) {
        // /get-article-urls returns a JSON-encoded array of
        // resource URLs that a given article depends on
        return response.json();
      })
      .then(function (urls) {
        cache.addAll(urls);
      });
  });
});
```

[캐시 API](https://developer.mozilla.org/docs/Web/API/Cache)는 페이지와 Service Worker에서 사용할 수 있습니다. 즉, 캐시에 항목을 추가하기 위해 Service Worker를 포함할 필요가 없습니다.

### 네트워크 응답 시 {: #on-network-response }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/86mv3BK2kjWi8Dm1KWpr.png", alt="네트워크 응답 시.", width="800", height="390" %} <figcaption>네트워크 응답 시.</figcaption></figure>

**이상적인 대상:** 자주 업데이트하는 사용자의 받은 편지함 또는 기사 콘텐츠와 같은 리소스. 아바타와 같은 비필수적인 콘텐츠에도 유용하지만 주의가 필요합니다.

요청이 캐시의 어떤 것과도 일치하지 않으면 네트워크에서 요청을 가져와 페이지로 보내고 동시에 캐시에 추가합니다.

아바타와 같은 URL 범위에 대해 이 작업을 수행하는 경우 원본 저장소가 부풀려지지 않도록 주의해야 합니다. 사용자가 디스크 공간을 회수해야 하는 경우 주요 후보가 되고 싶지 않습니다. 더 이상 필요하지 않은 항목은 캐시에서 제거하십시오.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    }),
  );
});
```

효율적인 메모리 사용을 위해 응답/요청 본문을 한 번만 읽을 수 있습니다. 위의 코드는 [`.clone()`](https://fetch.spec.whatwg.org/#dom-request-clone)을 사용하여 별도로 읽을 수 있는 추가 복사본을 만듭니다.

[스릴 훈련](https://jakearchibald.github.io/trained-to-thrill/)에서 [Flickr 이미지](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L109)를 캐시할 때 사용합니다.

### 오래된 재검증 {: #stale-while-revalidate }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6GyjQkG2pI5tV1xirXSX.png", alt="오래된 재검증.", width="800", height="388" %} <figcaption>오래된 재검증.</figcaption></figure>

**이상적인 대상:** 최신 버전이 필수적이지 않은 자주 업데이트하는 리소스. 아바타는 이 범주에 속할 수 있습니다.

사용 가능한 캐시된 버전이 있는 경우 사용하되 다음 업데이트를 위해 가져옵니다.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fetchPromise = fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    }),
  );
});
```

HTTP의 [오래된 재검증](https://www.mnot.net/blog/2007/12/12/stale)과 매우 유사합니다.

### 푸시 메시지 {: #on-push-message }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bshuBXOyD2A4zveXQMul.png", alt="푸시 메시지.", width="800", height="498" %}<figcaption> 푸시 메시지.</figcaption></figure>

[푸시 API](/push-notifications/)는 Service Worker 위에 구축된 또 다른 기능입니다. 이를 통해 OS의 메시징 서비스에서 메시지에 대한 응답으로 Service Worker를 깨울 수 있습니다. 이는 사용자가 사이트에 열려 있는 탭이 없는 경우에도 발생합니다. 오직 Service Worker만 깨어납니다. 페이지에서 이 작업을 수행할 수 있는 권한을 요청하면 사용자에게 메시지가 표시됩니다.

**이상적인 대상:** 채팅 메시지, 속보 또는 이메일과 같은 알림과 관련된 콘텐츠. 또한 할 일 목록 업데이트 또는 캘린더 변경과 같이 즉각적인 동기화의 이점을 제공하는 자주 변경하는 콘텐츠.

{% YouTube '0i7YdSEQI1w' %}

일반적인 최종 결과는 알림을 탭하면 관련 페이지가 열리고/포커스되지만 이러한 일이 발생하기 전에 캐시를 업데이트하는 것이 *매우* 중요합니다. 사용자는 푸시 메시지를 수신할 때 분명히 온라인 상태이지만 알림과 최종적으로 상호 작용할 때는 그렇지 않을 수 있으므로 이 콘텐츠를 오프라인에서 사용할 수 있도록 하는 것이 중요합니다.

이 코드는 알림을 표시하기 전에 캐시를 업데이트합니다.

```js
self.addEventListener('push', function (event) {
  if (event.data.text() == 'new-email') {
    event.waitUntil(
      caches
        .open('mysite-dynamic')
        .then(function (cache) {
          return fetch('/inbox.json').then(function (response) {
            cache.put('/inbox.json', response.clone());
            return response.json();
          });
        })
        .then(function (emails) {
          registration.showNotification('New email', {
            body: 'From ' + emails[0].from.name,
            tag: 'new-email',
          });
        }),
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  if (event.notification.tag == 'new-email') {
    // Assume that all of the resources needed to render
    // /inbox/ have previously been cached, e.g. as part
    // of the install handler.
    new WindowClient('/inbox/');
  }
});
```

### 백그라운드 동기화 시 {: #on-background-sync }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tojpjg0cvZZVvZWStG81.png", alt="백그라운드 동기화 시.", width="800", height="219" %} <figcaption>백그라운드 동기화 시.</figcaption></figure>

[백그라운드 동기화](https://developer.chrome.com/blog/background-sync/)는 Service Worker를 기반으로 구축된 또 다른 기능입니다. 이를 통해 일회성 또는 (매우 경험적) 간격으로 백그라운드 데이터 동기화를 요청할 수 있습니다. 이는 사용자가 사이트에 열려 있는 탭이 없는 경우에도 발생합니다. 오직 Service Worker만 깨어납니다. 페이지에서 이 작업을 수행할 수 있는 권한을 요청하면 사용자에게 메시지가 표시됩니다.

**이상적인 대상:** 긴급하지 않은 업데이트, 특히 소셜 타임라인 또는 뉴스 기사와 같이 업데이트당 푸시 메시지가 너무 자주 발생하여 사용자에게 너무 자주 발생하는 업데이트.

```js
self.addEventListener('sync', function (event) {
  if (event.id == 'update-leaderboard') {
    event.waitUntil(
      caches.open('mygame-dynamic').then(function (cache) {
        return cache.add('/leaderboard.json');
      }),
    );
  }
});
```

## 캐시 지속성 {: #cache-persistence }

원본에는 원하는 작업을 수행할 수 있는 특정 양의 여유 공간이 제공됩니다. 그 여유 공간은 [(로컬) 저장소](https://developer.mozilla.org/docs/Web/API/Storage), [IndexedDB](https://developer.mozilla.org/docs/Glossary/IndexedDB), [파일 시스템 액세스](/file-system-access/)는 물론 [캐시](https://developer.mozilla.org/docs/Web/API/Cache) 와 같은 모든 원본 저장소 간에 공유됩니다.

얻는 공간은 정해지지 않습니다. 기기 및 저장소 조건에 따라 다릅니다. 다음을 통해 얼마나 보유하는지 확인할 수 있습니다.

```js
navigator.storageQuota.queryInfo('temporary').then(function (info) {
  console.log(info.quota);
  // Result: <quota in bytes>
  console.log(info.usage);
  // Result: <used data in bytes>
});
```

그러나 모든 브라우저 저장소와 마찬가지로 브라우저는 장치에 저장소 압력이 가해지면 데이터를 자유롭게 버릴 수 있습니다. 불행히도 브라우저는 어떻게 해서든 유지하고 싶은 영화와 별로 신경 쓰지 않는 게임을 구분할 수 없습니다.

이 문제를 해결하려면 [StorageManager](https://developer.mozilla.org/docs/Web/API/StorageManager) 인터페이스를 사용하십시오.

```js
// From a page:
navigator.storage.persist()
.then(function(persisted) {
  if (persisted) {
    // Hurrah, your data is here to stay!
  } else {
   // So sad, your data may get chucked. Sorry.
});
```

물론 사용자가 권한을 부여해야 합니다. 이를 위해 권한 API를 사용합니다.

사용자를 이 흐름의 일부로 만드는 것이 중요합니다. 이제 사용자가 삭제를 제어할 수 있을 것으로 기대할 수 있기 때문입니다. 기기의 저장소가 부족하고 중요하지 않은 데이터를 지워도 문제가 해결되지 않으면 사용자는 어떤 항목을 보관하고 제거할지 판단하게 됩니다.

이것이 작동하려면 운영 체제가 브라우저를 단일 항목으로 보고하는 대신 저장소 사용량 분석에서 "영구적" 출처를 플랫폼별 앱과 동등하게 취급해야 합니다.

## 제안 제공 - 요청에 응답하기 {: #serving-suggestions }

얼마나 많은 캐싱을 하는지는 중요하지 않습니다. Service Worker는 시간과 방법을 알려주지 않는 한 캐시를 사용하지 않을 것입니다. 다음은 요청 처리를 위한 몇 가지 패턴입니다.

### 캐시 전용 {: #cache-only }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ppXImAnXW7Grk4igLRTj.png", alt="캐시 전용.", width="800", height="272" %} <figcaption>캐시 전용.</figcaption></figure>

**이상적인 대상:** 사이트의 특정 "버전"에 대해 정적인 것으로 간주되는 모든 것. 설치 이벤트에서 이러한 항목을 캐시해야 하므로 해당 항목에 의존할 수 있습니다.

```js
self.addEventListener('fetch', function (event) {
  // If a match isn't found in the cache, the response
  // will look like a connection error
  event.respondWith(caches.match(event.request));
});
```

…이 경우를 특별히 처리할 필요는 없지만 [캐시, 네트워크로 폴백](#cache-falling-back-to-network)이 이를 처리합니다.

### 네트워크 전용 {: #network-only }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5piPzi4NRGcgy1snmlEW.png", alt="네트워크 전용.", width="800", height="272" %} <figcaption>네트워크 전용.</figcaption></figure>

**이상적인 대상:** 분석 핑, GET이 아닌 요청과 같이 오프라인에 상응하는 항목이 없는 것.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
  // or simply don't call event.respondWith, which
  // will result in default browser behavior
});
```

…이 경우를 특별히 처리할 필요는 없지만 [캐시, 네트워크로 폴백](#cache-falling-back-to-network)이 이를 처리합니다.

### 캐시, 네트워크로 폴백 {: #cache-falling-back-to-network }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMXq6ya5HdjkNeGjTlAN.png", alt="캐시, 네트워크로 폴백.", width="800", height="395" %} <figcaption>캐시, 네트워크로 폴백.</figcaption></figure>

**이상적인 대상:** 오프라인 우선 구축. 이러한 경우 대부분의 요청을 처리하는 방법입니다. 다른 패턴은 들어오는 요청에 따라 예외가 됩니다.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

이렇게 하면 캐시에 있는 항목에 대한 "캐시 전용" 동작과 캐시되지 않은 항목에 대한 "네트워크 전용" 동작이 제공됩니다(캐시할 수 없기 때문에 모든 GET이 아닌 요청 포함).

### 캐시 및 네트워크 경쟁 {: #cache-and-network-race }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/j6xbmOpm4GbayBJHChNW.png", alt="캐시 및 네트워크 경쟁.", width="800", height="427" %} <figcaption>캐시 및 네트워크 경쟁.</figcaption></figure>

**이상적인 대상:** 디스크 액세스가 느린 장치에서 성능을 추구하는 소규모 애셋.

구형 하드 드라이브, 바이러스 스캐너 및 더 빠른 인터넷 연결의 일부 조합을 사용하면 네트워크에서 리소스를 가져오는 것이 디스크로 이동하는 것보다 빠를 수 있습니다. 그러나 사용자가 기기에 콘텐츠를 가지고 있을 때 네트워크에 접속하는 것은 데이터 낭비일 수 있습니다.

```js
// Promise.race is no good to us because it rejects if
// a promise rejects before fulfilling. Let's make a proper
// race function:
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map((p) => Promise.resolve(p));
    // resolve this promise as soon as one resolves
    promises.forEach((p) => p.then(resolve));
    // reject if all promises reject
    promises.reduce((a, b) => a.catch(() => b)).catch(() => reject(Error('All failed')));
  });
}

self.addEventListener('fetch', function (event) {
  event.respondWith(promiseAny([caches.match(event.request), fetch(event.request)]));
});
```

### 캐시로 네트워크 폴백 {: #network-falling-back-to-cache }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/efLECR7ZqNiPjmAzvEzO.png", alt="캐시로 네트워크 폴백.", width="800", height="388" %} <figcaption>캐시로 네트워크 폴백.</figcaption></figure>

**이상적인 대상:** 사이트의 "버전" 외부에서 자주 업데이트되는 리소스의 빠른 수정. 예: 글, 아바타, 소셜 미디어 타임라인 및 게임 리더보드.

즉, 온라인 사용자에게는 최신 콘텐츠를 제공하지만 오프라인 사용자에게는 캐시된 이전 버전을 제공합니다. 네트워크 요청이 성공하면 [캐시 항목](#on-network-response)을 업데이트할 가능성이 큽니다.

그러나 이 방법에는 결함이 있습니다. 사용자가 연결이 간헐적이거나 느린 경우 기기에 이미 완벽하게 수용 가능한 콘텐츠를 가져오기 전에 네트워크가 실패할 때까지 기다려야 합니다. 이것은 매우 오랜 시간이 걸릴 수 있으며 실망스러운 사용자 경험입니다. 더 나은 솔루션을 보려면 다음 패턴인 [캐시 후 네트워크](#cache-then-network)를 참조하세요.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    }),
  );
});
```

### 캐시 후 네트워크 {: #cache-then-network }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BjxBlbCf14ed9FBQRS6E.png", alt="캐시 후 네트워크.", width="800", height="478" %} <figcaption>캐시 후 네트워크.</figcaption></figure>

**이상적인 대상:** 자주 업데이트되는 콘텐츠. 예: 글, 소셜 미디어 타임라인 및 게임. 리더보드.

이렇게 하려면 페이지에서 캐시에 하나, 네트워크에 하나로 두 가지 요청을 해야 합니다. 아이디어는 캐시된 데이터를 먼저 표시한 다음 네트워크 데이터가 도착할 때 페이지를 업데이트하는 것입니다.

때때로 새로운 데이터가 도착하면(예: 게임 리더보드) 현재 데이터를 교체할 수 있지만, 이는 더 큰 콘텐츠 조각으로 인해 방해가 될 수 있습니다. 기본적으로 사용자가 읽거나 상호 작용할 수 있는 항목을 "사라지게" 하지마십시오.

Twitter는 이전 콘텐츠 위에 새 콘텐츠를 추가하고 사용자가 중단되지 않도록 스크롤 위치를 조정합니다. 이는 Twitter가 대부분 콘텐츠에 대해 선형적인 순서를 유지하기 때문에 가능합니다. 저는 가능한 한 빨리 콘텐츠를 화면에 표시하면서 최신 콘텐츠가 도착하는 즉시 표시하기 위해 [스킬 훈련](https://jakearchibald.github.io/trained-to-thrill/)을 받은 이 패턴을 복사했습니다.

**페이지의 코드:**

```js
var networkDataReceived = false;

startSpinner();

// fetch fresh data
var networkUpdate = fetch('/data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    updatePage(data);
  });

// fetch cached data
caches
  .match('/data.json')
  .then(function (response) {
    if (!response) throw Error('No data');
    return response.json();
  })
  .then(function (data) {
    // don't overwrite newer network data
    if (!networkDataReceived) {
      updatePage(data);
    }
  })
  .catch(function () {
    // we didn't get cached data, the network is our last hope:
    return networkUpdate;
  })
  .catch(showErrorMessage)
  .then(stopSpinner);
```

**Service Worker의 코드:**

항상 네트워크로 이동하고 이동하면서 캐시를 업데이트해야 합니다.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return fetch(event.request).then(function (response) {
        cache.put(event.request, response.clone());
        return response;
      });
    }),
  );
});
```

[스킬 훈련](https://jakearchibald.github.io/trained-to-thrill/)에서 [fetch 대신 XHR](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/utils.js#L3)을 사용하고 Accept 헤더를 남용하여 Service Worker에 결과를 가져올 위치([페이지 코드](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/index.js#L70), [Service Worker 코드](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L61))를 알려줌으로써 이 문제를 해결했습니다.

### 일반 폴백 {: #generic-fallback }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URF7IInbQtWL6GZK9GW3.png", alt="일반 폴백.", width="800", height="389" %} <figcaption>일반 폴백.</figcaption></figure>

캐시 및/또는 네트워크에서 무언가를 제공하는 데 실패하면 일반 폴백을 제공할 수 있습니다.

**이상적인 대상:** 아바타, 실패한 POST 요청, "오프라인에서는 사용할 수 없음"과 같은 2차 이미지. 페이지.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // Try the cache
    caches
      .match(event.request)
      .then(function (response) {
        // Fall back to network
        return response || fetch(event.request);
      })
      .catch(function () {
        // If both fail, show a generic fallback:
        return caches.match('/offline.html');
        // However, in reality you'd have many different
        // fallbacks, depending on URL and headers.
        // Eg, a fallback silhouette image for avatars.
      }),
  );
});
```

대체할 항목은 [설치 종속성](#on-install-as-dependency)일 가능성이 높습니다.

페이지에서 이메일을 게시하는 경우 서비스 작업자는 이메일을 IndexedDB '발신함'에 저장하는 것으로 대체하고 페이지에 전송에 실패했지만 데이터는 성공적으로 보관되었음을 알려 응답할 수 있습니다.

### Service Worker 측 템플릿 {: #Service Worker-side-templating }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/o5SqtDczlvhw6tPJkr2z.png", alt="Service Worker 측 템플릿.", width="800", height="463" %} <figcaption>Service Worker 측 템플릿.</figcaption></figure>

**이상적인 대상:** 서버 응답을 캐시할 수 없는 페이지.

[서버에서 페이지를 렌더링하면 속도가 빨라지지만](https://jakearchibald.com/2013/progressive-enhancement-is-faster/), "다음으로 로그인"과 같이 캐시에 의미가 없을 수 있는 상태 데이터를 포함할 수 있습니다. 페이지가 Service Worker에 의해 제어되는 경우 대신 템플릿과 함께 JSON 데이터를 요청하고 대신 렌더링하도록 선택할 수 있습니다.

```js
importScripts('templating-engine.js');

self.addEventListener('fetch', function (event) {
  var requestURL = new URL(event.request.url);

  event.respondWith(
    Promise.all([
      caches.match('/article-template.html').then(function (response) {
        return response.text();
      }),
      caches.match(requestURL.path + '.json').then(function (response) {
        return response.json();
      }),
    ]).then(function (responses) {
      var template = responses[0];
      var data = responses[1];

      return new Response(renderTemplate(template, data), {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }),
  );
});
```

## 정리

이러한 방법 중 하나로만 제한되지 않습니다. 실제로 요청 URL에 따라 여러 개를 사용하게 될 것입니다. 예를 들어, [스킬 훈련](https://jakearchibald.github.io/trained-to-thrill/)은 다음을 사용합니다.

- 정적 UI 및 동작에 대한 [설치 시 캐시](#on-install-as-dependency)
- Flickr 이미지 및 데이터에 대한 [네트워크 응답 캐시](#on-network-response)
- 대부분의 요청에 대해 [캐시에서 가져오기, 네트워크로 폴백](#cache-falling-back-to-network)
- Flickr 검색 결과에 대해 [캐시에서 가져온 후 네트워크](#cache-then-network)

요청을 보고 수행할 작업을 결정하십시오.

```js
self.addEventListener('fetch', function (event) {
  // Parse the URL:
  var requestURL = new URL(event.request.url);

  // Handle requests to a particular host specifically
  if (requestURL.hostname == 'api.example.com') {
    event.respondWith(/* some combination of patterns */);
    return;
  }
  // Routing for local URLs
  if (requestURL.origin == location.origin) {
    // Handle article URLs
    if (/^\/article\//.test(requestURL.pathname)) {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (/\.webp$/.test(requestURL.pathname)) {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (request.method == 'POST') {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (/cheese/.test(requestURL.pathname)) {
      event.respondWith(
        new Response('Flagrant cheese error', {
          status: 512,
        }),
      );
      return;
    }
  }

  // A sensible default pattern
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

…그림을 얻습니다.

### 크레딧

…사랑스러운 아이콘:

- Buzzyrobot의 [코드](http://thenounproject.com/term/code/17547/)
- Scott Lewis의 [캘린더](http://thenounproject.com/term/calendar/4672/)
- Ben Rizzo의 [네트워크](http://thenounproject.com/term/network/12676/)
- Thomas Le Bas의 [SD](http://thenounproject.com/term/sd-card/6185/)
- iconsmind.com의 [CPU](http://thenounproject.com/term/cpu/72043/)
- trasnik의 [휴지통](http://thenounproject.com/term/trash/20538/)
- @daosme의 [알림](http://thenounproject.com/term/notification/32514/)
- Mister Pixel의 [레이아웃](http://thenounproject.com/term/layout/36872/)
- P.J. Onori의 [클라우드](http://thenounproject.com/term/cloud/2788/)

"게시"를 누르기 전에 많은 하울링 오류를 잡아준 [}Jeff Posnick](https://twitter.com/jeffposnick)에게 감사드립니다.

### 추가 참고 자료

- [Service Workers—소개](/service-workers-cache-storage/)
- [Service Worker가 준비되었습니까?](https://jakearchibald.github.io/isserviceworkerready/) —기본 브라우저에서 구현 상태 추적
- [JavaScript 약속 - 소개](/promises) - 약속 안내
