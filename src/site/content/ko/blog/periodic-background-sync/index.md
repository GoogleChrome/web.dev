---
layout: post
title: 주기적 백그라운드 동기화 API로 더 풍부한 오프라인 경험
subhead: 더 유사한 경험을 위해 백그라운드에서 웹 앱의 데이터를 동기화하십시오.
authors:
  - jeffposnick
  - joemedley
date: 2019-11-10
updated: 2020-08-18
hero: image/admin/Bz7MndcsUGPLAnQwIMfJ.jpg
alt: 동기화되어 비행하는 다채로운 비행기
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/4048736065006075905"
description: 주기적 백그라운드 동기화를 통해 웹 애플리케이션이 주기적으로 백그라운드에서 데이터를 동기화하여 웹 앱을 iOS/Android/데스크톱 앱에 더 가깝게 만듭니다.
tags:
  - capabilities
  - blog
  - progressive-web-apps
  - service-worker
  - chrome-80
feedback:
  - api
---

{% Aside %} 웹 앱은 iOS/Android/데스크톱 앱이 할 수 있는 모든 작업을 수행할 수 있어야 합니다. 주기적인 백그라운드 동기화가 포함되어 있는 [기능 프로젝트](https://developer.chrome.com/blog/capabilities/)는 이를 목표로 합니다. 다른 기능에 대해 알아보고 진행 상황을 확인하려면 [웹을 위한 새로운 기능 잠금 해제](https://developer.chrome.com/blog/capabilities/)를 따르십시오. {% endAside %}

다음과 같은 상황에 처한 적이 있습니까?

- 기차나 지하철을 탈 때 연결이 불안하거나 아예 끊어짐
- 동영상을 너무 많이 본 후 이동통신사에 의해 속도가 제한됨
- 대역폭이 수요를 못 따라가는 국가에서 생활

그렇다면 웹에서 특정 작업을 수행하는 데 대한 좌절감을 확실히 느끼고 왜 플랫폼별 앱이 이러한 시나리오에서 더 나은 성능을 보이는지 궁금했을 것입니다. 플랫폼별 앱은 뉴스 기사나 날씨 정보와 같은 새로운 콘텐츠를 미리 가져올 수 있습니다. 지하철에 네트워크가 없어도 뉴스를 읽을 수 있습니다.

주기적 백그라운드 동기화를 사용하면 웹 애플리케이션이 백그라운드에서 데이터를 주기적으로 동기화하여 웹 애플리케이션을 플랫폼별 앱의 동작에 더 가깝게 만들 수 있습니다.

## 현재 상태

아래 표는 주기적 백그라운드 동기화 API의 현재 상태를 설명합니다.

<table>
<tr>
<th markdown="block">단계</th>
<th markdown="block">상태</th>
</tr>
<tr>
<td markdown="block">1. 안내서 만들기</td>
<td markdown="block"><a href="https://github.com/WICG/BackgroundSync/tree/master/explainers">완료</a></td>
</tr>
<tr>
<td markdown="block">2. 사양의 초기 초안 작성</td>
<td markdown="block"><a href="https://wicg.github.io/periodic-background-sync/" rel="noopener">완료</a></td>
</tr>
<tr>
<td markdown="block">3. 피드백 수집 및 디자인 반복</td>
<td markdown="block">진행 중</td>
</tr>
<tr>
<td markdown="block">4. 원본 평가판</td>
<td markdown="block"><a>완료</a></td>
</tr>
<tr>
<td markdown="block"><strong>5. 출시</strong></td>
<td markdown="block"><strong>Chrome 80</strong></td>
</tr>
</table>

## 사용해 보기

[라이브 데모 앱](https://webplatformapis.com/periodic_sync/periodicSync_improved.html)을 사용하여 주기적으로 백그라운드 동기화를 사용해 볼 수 있습니다. 사용하기 전에 다음을 확인하십시오.

- Chrome 80 이상을 사용 중입니다.
- 주기적 백그라운드 동기화를 활성화하기 전에 웹 앱을 [설치합니다.](https://developers.google.com/web/fundamentals/app-install-banners/)

## 개념 및 사용법

주기적 백그라운드 동기화를 사용하면 프로그레시브 웹 앱 또는 서비스 작업자 지원 페이지가 시작될 때 새로운 콘텐츠를 표시할 수 있습니다. 앱이나 페이지를 사용하지 않을 때 백그라운드에서 데이터를 다운로드하여 이를 수행합니다. 이렇게 하면 앱 콘텐츠가 표시되는 동안 실행 후 새로 고쳐지지 않습니다. 더 좋은 점은 앱이 새로고침하기 전에 콘텐츠 스피너를 표시하지 않는다는 것입니다.

정기적인 백그라운드 동기화가 없으면 웹 앱은 다른 방법을 사용하여 데이터를 다운로드해야 합니다. 일반적인 예는 푸시 알림을 사용하여 서비스 작업자를 깨우는 것입니다. 사용자는 '새 데이터 사용 가능'과 같은 메시지에 의해 하던 일이 중단됩니다. 데이터 업데이트는 본질적으로 부수적인 효과입니다. 중요한 속보와 같은 정말 중요한 업데이트에 대해 푸시 알림을 사용할 수 있는 옵션이 여전히 있습니다.

주기적 백그라운드 동기화는 백그라운드 동기화와 쉽게 혼동됩니다. 이름은 비슷하지만 사용 사례는 다릅니다. 무엇보다도 백그라운드 동기화는 이전 요청이 실패한 경우 서버에 데이터를 재전송하는 데 가장 일반적으로 사용됩니다.

### 사용자 참여 권한 얻기

잘못 수행하면 정기적인 백그라운드 동기화가 사용자 리소스를 낭비할 수 있습니다. Chrome은 출시하기 전에 테스트 기간을 거쳐 올바른지 확인했습니다. 이 섹션에서는 이 기능을 최대한 유용하게 만들기 위해 Chrome에서 내린 몇 가지 설계 결정에 대해 설명합니다.

Chrome이 내린 첫 번째 설계 결정은 웹 앱은 사람이 기기에 앱을 설치하고 별개의 애플리케이션으로 시작한 후에만 주기적 백그라운드 동기화를 사용할 수 있다는 것입니다. Chrome의 일반 탭 컨텍스트에서는 주기적 백그라운드 동기화를 사용할 수 없습니다.

또한 Chrome은 사용하지 않거나 거의 사용하지 않는 웹 앱이 배터리나 데이터를 불필요하게 소모하는 것을 원하지 않기 때문에 Chrome은 개발자가 사용자에게 가치를 제공하여 권한를 얻을 수 있도록 주기적인 백그라운드 동기화를 설계했습니다. 구체적으로 Chrome은 [사이트 참여 점수](https://www.chromium.org/developers/design-documents/site-engagement)(`about://site-engagement/`)를 사용하여 지정된 웹 앱에 대해 주기적 백그라운드 동기화가 발생할 수 있는지 여부와 빈도를 결정합니다. 즉, 참여 점수가 0보다 크지 않다면 `periodicsync` 이벤트가 전혀 실행되지 않으며, 해당 값은 `periodicsync` 이벤트가 실행되는 빈도에 영향을 줍니다. 이렇게 하면 백그라운드에서 동기화되는 앱이 현재 사용 중인 앱뿐임을 보장합니다.

주기적 백그라운드 동기화는 인기 있는 플랫폼의 기존 API 및 관행과 몇 가지 유사점을 공유합니다. 예를 들어, 일회성 백그라운드 동기화와 푸시 알림을 사용하면 사용자가 페이지를 닫은 후 웹 앱의 로직이 서비스 작업자를 통해 조금 더 오래 지속됩니다. 대부분의 플랫폼에서 사람들은 중요한 업데이트, 콘텐츠 미리 가져오기, 데이터 동기화 등에 대해 더 나은 사용자 경험을 제공하기 위해 백그라운드에서 네트워크에 주기적으로 액세스하는 앱을 설치하는 것이 일반적입니다. 마찬가지로 주기적인 백그라운드 동기화는 웹 앱 논리의 수명을 연장하여 한 번에 몇 분 정도 정기적으로 실행되도록 합니다.

브라우저에서 이러한 상황이 제한 없이 자주 발생하도록 허용한 경우 개인 정보 보호 문제가 발생할 수 있습니다. Chrome이 주기적 백그라운드 동기화에 대한 이러한 위험을 해결한 방법은 다음과 같습니다.

- 백그라운드 동기화 활동은 장치가 이전에 연결된 네트워크에서만 발생합니다. Chrome은 신뢰할 수 있는 당사자가 운영하는 네트워크에만 연결할 것을 권장합니다.
- 모든 인터넷 통신과 마찬가지로 주기적 백그라운드 동기화는 클라이언트의 IP 주소, 통신 중인 서버 및 서버 이름을 노출합니다. 앱이 포그라운드에 있을 때만 동기화할 때의 수준으로 이러한 노출을 줄이기 위해 브라우저는 사용자가 해당 앱을 사용하는 빈도에 맞춰 앱의 백그라운드 동기화 빈도를 제한합니다. 사용자가 앱과 자주 상호 작용하지 않으면 주기적 백그라운드 동기화의 트리거가 중지됩니다. 이는 플랫폼별 앱의 현상 유지에 대한 순 개선입니다.

### 언제 사용할 수 있습니까?

사용 규칙은 브라우저에 따라 다릅니다. 위에서 요약하면 Chrome은 정기적인 백그라운드 동기화에 대해 다음 요구 사항을 적용합니다.

- 특정 사용자 참여 점수.
- 이전에 사용한 네트워크의 존재.

동기화 타이밍은 개발자가 제어하지 않습니다. 동기화 빈도는 앱 사용 빈도와 일치합니다(플랫폼별 앱은 현재 이 작업을 수행하지 않습니다.). 또한 장치의 전원 및 연결 상태도 가져옵니다.

### 언제 사용해야 합니까?

`periodicsync` 이벤트를 처리하기 위해 서비스 작업자가 깨어나면 데이터를 요청할 *기회*가 있지만 그렇게 해야 할 *의무*는 없습니다. 이벤트를 처리할 때 네트워크 조건과 사용 가능한 스토리지를 고려하고 이에 대한 응답으로 다양한 양의 데이터를 다운로드해야 합니다. 다음 리소스를 사용하여 도움을 받을 수 있습니다.

- [네트워크 정보 API](https://developer.mozilla.org/docs/Web/API/Network_Information_API)
- [데이터 절약 모드 감지](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/save-data/#detecting_the_save-data_setting)
- [사용 가능한 저장용량 예상](https://developers.google.com/web/updates/2017/08/estimating-available-storage-space)

### 권한

서비스 작업자가 설치된 후 [권한 API](https://developer.mozilla.org/docs/Web/API/Permissions_API)를 사용하여 `periodic-background-sync`를 쿼리합니다. 창 또는 서비스 작업자 컨텍스트에서 이 작업을 수행할 수 있습니다.

```js
const status = await navigator.permissions.query({
  name: 'periodic-background-sync',
});
if (status.state === 'granted') {
  // Periodic background sync can be used.
} else {
  // Periodic background sync cannot be used.
}
```

### 주기적 동기화 등록

이미 언급했듯이 주기적 백그라운드 동기화에는 서비스 작업자가 필요합니다. `ServiceWorkerRegistration.periodicSync`를 사용하여 `PeriodicSyncManager`를 가져오고 이에 대해 `register()`를 호출합니다. 등록하려면 태그와 최소 동기화 간격( `minInterval` )이 모두 필요합니다. 태그는 여러 동기화를 등록할 수 있도록 등록된 동기화를 식별합니다. 아래 예에서 태그 이름은 `'content-sync'`이고 `minInterval`은 하루입니다.

```js/3-5
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  try {
    await registration.periodicSync.register('content-sync', {
      // An interval of one day.
      minInterval: 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    // Periodic background sync cannot be used.
  }
}
```

### 등록 확인

`periodicSync.getTags()`를 호출하여 등록 태그의 배열을 가져옵니다. 아래 예에서는 태그 이름을 사용하여 캐시 업데이트가 다시 업데이트되지 않도록 활성 상태인지 확인합니다.

```js/2,4
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  const tags = await registration.periodicSync.getTags();
  // Only update content if sync isn't set up.
  if (!tags.includes('content-sync')) {
    updateContentOnPageLoad();
  }
} else {
  // If periodic background sync isn't supported, always update.
  updateContentOnPageLoad();
}
```

또한 `getTags()`를 사용하여 웹 앱의 설정 페이지에 활성 등록 목록을 표시하여 사용자가 특정 유형의 업데이트를 활성화하거나 비활성화할 수 있도록 할 수 있습니다.

### 주기적 백그라운드 동기화 이벤트에 응답

주기적 백그라운드 동기화 이벤트에 응답하려면 서비스 워커에 `periodicsync` 이벤트 핸들러를 추가하세요. 전달된 `event` 객체에는 등록 중에 사용된 값과 일치하는 `tag` 매개 변수가 포함됩니다. 예를 들어 주기적인 백그라운드 동기화가 `'content-sync'`라는 이름으로 등록된 경우 `event.tag`는 `'content-sync'`가 됩니다.

```js
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    // See the "Think before you sync" section for
    // checks you could perform before syncing.
    event.waitUntil(syncContent());
  }
  // Other logic for different tags as needed.
});
```

### 동기화 등록 취소

등록된 동기화를 종료하려면 등록을 취소하려는 동기화 이름을 포함하여 `periodicSync.unregister()`를 호출하세요.

```js
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  await registration.periodicSync.unregister('content-sync');
}
```

## 인터페이스

다음은 주기적 백그라운드 동기화 API에서 제공하는 인터페이스에 대한 간략한 설명입니다.

- `PeriodicSyncEvent`. 브라우저가 선택할 때 `ServiceWorkerGlobalScope.onperiodicsync` 이벤트 핸들러에 전달됩니다.
- `PeriodicSyncManager`. 주기적 동기화를 등록 및 등록 해제하고 등록된 동기화에 대한 태그를 제공합니다. ServiceWorkerRegistration.periodicSync` 속성에서 이 클래스의 인스턴스를 검색합니다.
- `ServiceWorkerGlobalScope.onperiodicsync`. `PeriodicSyncEvent`를 수신하는 핸들러를 등록합니다.
- `ServiceWorkerRegistration.periodicSync`. `PeriodicSyncManager` 대한 참조를 반환합니다.

## 예시

### 콘텐츠 업데이트

다음 예에서는 정기적인 백그라운드 동기화를 사용하여 뉴스 사이트 또는 블로그에 대한 최신 기사를 다운로드하고 캐시합니다. 어떤 종류의 동기화인지(`'update-articles'`)를 나타내는 태그 이름을 확인하세요. `updateArticles()`에 대한 호출은 `event.waitUntil()`에 싸여 있기 때문에 기사가 다운로드되고 저장되기 전에 서비스 작업자가 종료할 수 없습니다.

```js/7
async function updateArticles() {
  const articlesCache = await caches.open('articles');
  await articlesCache.add('/api/articles');
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-articles') {
    event.waitUntil(updateArticles());
  }
});
```

### 기존 웹 앱에 주기적 백그라운드 동기화 추가

[이번 변경](https://github.com/GoogleChromeLabs/so-pwa/pull/11)은 [기존 PWA](https://so-pwa.firebaseapp.com/)에 주기적 백그라운드 동기화를 추가하는 데 필요했습니다. 이 예에는 웹 앱의 주기적 백그라운드 동기화 상태를 설명하는 여러 유용한 로깅 문이 포함되어 있습니다.

## 디버깅

로컬에서 테스트하는 동안 주기적인 백그라운드 동기화를 확인하고 종단 간 보기를 수행하는 것은 어려울 수 있습니다. 활성 등록, 대략적인 동기화 간격 및 과거 동기화 이벤트의 로그에 대한 정보는 웹 앱의 동작을 디버깅하는 동안 귀중한 컨텍스트를 제공합니다. 다행히 Chrome DevTools의 실험 기능을 통해 모든 정보를 찾을 수 있습니다.

{% Aside %} Chrome 81 이상에서는 주기적 백그라운드 동기화 디버깅이 사용 설정되었습니다. {% endAside %}

### 로컬 활동 기록

DevTools의 **주기적인 백그라운드 동기화** 섹션은 주기적인 백그라운드 동기화 수명 주기의 주요 이벤트(동기화 등록, 배경 동기화 수행 및 등록 취소)를 중심으로 구성되어 있습니다. 이러한 이벤트에 대한 정보를 얻으려면 **기록 시작**을 클릭하십시오.

<figure>{% Img src="image/admin/wcl5Bm6Pe9xn5Dps6IN6.png", alt="DevTools의 기록 버튼", width="708", height="90" %}<figcaption> DevTools의 기록 버튼</figcaption></figure>

기록하는 동안 항목은 이벤트에 해당하는 DevTools에 표시되며 각각에 대해 기록된 컨텍스트 및 메타데이터와 함께 표시됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/m92Art0OwiM0VyI7czFB.png", alt="기록된 주기적 백그라운드 동기화 데이터의 예",  width="800", height="357", style="max-width: 75%" %}<figcaption> 기록된 주기적인 백그라운드 동기화 데이터의 예</figcaption></figure>

기록을 한 번 활성화하면 최대 3일 동안 활성화된 상태로 유지되어 DevTools가 향후 몇 시간 동안 발생할 수 있는 백그라운드 동기화에 대한 로컬 디버깅 정보를 캡처할 수 있습니다.

### 이벤트 시뮬레이션

백그라운드 활동을 기록하는 것이 도움이 될 수 있지만 이벤트가 정상적인 케이던스에서 이벤트가 시작되는 것을 기다릴 필요 없이 `periodicsync` 핸들러를 즉시 테스트하고 싶은 때가 있을 수 있습니다.

Chrome DevTools의 애플리케이션 패널에 있는 **서비스 작업자** 섹션을 통해 이 작업을 수행할 수 있습니다. **주기적 동기화** 필드를 사용하면 이벤트에 사용할 태그를 제공하고 원하는 만큼 여러 번 트리거할 수 있습니다.

{% Aside %} `periodicsync` 동기화 이벤트를 수동으로 트리거하려면 Chrome 81 이상이 필요합니다. {% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BQ5QdjwaRDP42cHqW98W.png", alt="응용 프로그램 패널의 '서비스 작업자' 섹션에 '주기적 동기화' 텍스트 필드와 버튼이 표시됩니다.", width="800", height="321", style="max-width: 90%" %}</figure>

## DevTools 인터페이스 사용

Chrome 81부터 DevTools *애플리케이션* 패널에 **주기적 백그라운드 동기화** 섹션이 표시됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eYJtJfZ9Qo145lUQe4Ur.png", alt="주기적인 백그라운드 동기화 섹션을 보여주는 응용 프로그램 패널", width="382", height="253", style="max-width: 75%" %}</figure>
