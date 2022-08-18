---
layout: post
title: 설치 전략을 정의하는 방법
authors:
  - demianrenzulli
  - petelepage
date: 2020-05-12
updated: 2020-08-20
description: |2

  다양한 설치 제품을 결합하여 설치 속도를 높이고 플랫폼 경쟁 및 자기잠식을 방지하기 위한 모범 사례입니다.
tags:
  - progressive-web-apps
---

{% YouTube '6R9pupbDXYw' %}

과거에는 앱 설치가 플랫폼별 애플리케이션 컨텍스트에서만 가능했습니다. 오늘날 최신 웹 앱은 플랫폼별 앱과 동일한 수준의 통합 및 안정성을 제공하는 설치 가능한 환경을 제공합니다.

다음과 같은 다양한 방법으로 이를 달성할 수 있습니다.

- [브라우저](/customize-install/)에서 PWA 설치.
- [앱 스토어](https://developer.chrome.com/docs/android/trusted-web-activity/)에서 PWA 설치.

다양한 유통 채널을 보유하는 것은 광범위한 사용자에게 다가갈 수 있는 강력한 방법이지만 사용자를 홍보할 올바른 전략을 선택하는 것은 어려울 수 있습니다.

이 가이드에서는 설치 속도를 높이고 플랫폼 경쟁 및 자기잠식을 피하기 위해 다양한 설치 제품을 결합하는 모범 사례를 살펴봅니다. 적용되는 설치 오퍼링에는 브라우저와 App Store 모두에서 설치된 PWA와 플랫폼별 앱이 포함됩니다.

## 웹 앱을 설치 가능하게 만드는 이유는 무엇입니까?

설치된 Progressive Web Apps는 브라우저 탭 대신 독립 실행형 창에서 실행됩니다. 사용자의 홈 화면, 독, 작업 표시줄 또는 선반에서 실행할 수 있습니다. 기기에서 검색하고 앱 전환기로 전환하여 해당 기기가 설치된 기기의 일부인 것처럼 느낄 수 있습니다.

그러나 설치 가능한 웹 앱과 플랫폼별 앱을 모두 사용하는 것은 사용자에게 혼란을 줄 수 있습니다. 일부 사용자에게는 플랫폼별 앱이 최선의 선택일 수 있지만 다른 사용자에게는 다음과 같은 몇 가지 단점이 있을 수 있습니다.

- **저장 공간 제약:** 새 앱을 설치하면 다른 앱을 삭제하거나 중요한 콘텐츠를 제거하여 공간을 정리할 수 있습니다. 이것은 저사양 기기 사용자에게 특히 불리합니다.
- **사용 가능한 대역폭:** 앱 다운로드는 비용이 많이 들고 느린 프로세스가 될 수 있으며 느린 연결과 값비싼 데이터 요금제를 사용하는 사용자에게는 더욱 그렇습니다.
- **마찰:** 웹 사이트를 떠나 앱을 다운로드하기 위해 스토어로 이동하면 추가적인 마찰이 발생하고 웹에서 직접 수행할 수 있는 사용자 작업이 지연됩니다.
- **업데이트 주기:** 플랫폼별 앱을 변경하려면 앱 검토 프로세스를 거쳐야 할 수 있으며, 이로 인해 변경 및 실험(예: A/B 테스트)이 느려질 수 있습니다.

어떤 경우에는 플랫폼별 앱을 다운로드하지 않는 사용자의 비율이 클 수 있습니다. 예를 들어 앱을 자주 사용하지 않을 것이라고 생각하거나 몇 메가바이트의 데이터. 예를 들어 분석 설정을 사용하여 "모바일 웹 전용" 사용자의 비율을 추적하는 등 여러 가지 방법으로 이 세그먼트의 크기를 결정할 수 있습니다.

이 세그먼트의 크기가 상당한 경우 경험을 설치하는 대체 방법을 제공해야 한다는 좋은 표시입니다.

## 브라우저를 통해 PWA 설치 촉진

고품질 PWA가 있는 경우 플랫폼별 앱보다 설치를 홍보하는 것이 더 나을 수 있습니다. 예를 들어 플랫폼별 앱에 PWA에서 제공하는 기능이 없거나 한동안 업데이트되지 않은 경우입니다. 플랫폼별 앱이 ChromeOS와 같이 더 큰 화면에 최적화되지 않은 경우 PWA 설치를 홍보하는 것도 도움이 될 수 있습니다.

일부 앱의 경우 플랫폼별 앱 설치를 유도하는 것이 비즈니스 모델의 핵심 부분입니다. 이 경우 플랫폼별 앱 설치 프로모션을 표시하는 것이 비즈니스에 합리적입니다. 그러나 일부 사용자는 웹에 머무르는 것이 더 편할 수 있습니다. 해당 세그먼트를 식별할 수 있는 경우 PWA 프롬프트는 해당 세그먼트에만 표시될 수 있습니다("폴백으로서의 PWA"라고 함).

이 섹션에서는 브라우저를 통해 설치된 PWA의 설치 속도를 최대화하는 다양한 방법을 탐색합니다.

### 기본 설치 가능한 환경으로서의 PWA

PWA가 [설치 가능성 기준](/install-criteria/)을 충족하면 대부분의 브라우저에 PWA를 설치할 수 있다는 표시가 표시됩니다. 예를 들어 데스크톱 Chrome은 주소 표시줄에 설치 가능한 아이콘을 표시하고 모바일에서는 미니 정보 표시줄을 표시합니다.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1VOvbQjeenZOBAmzjVN5.png", alt="미니 정보 표시줄이라는 표준 Chrome 설치 프롬프트", width="800", height="417" %}<figcaption> 미니 정보 표시줄</figcaption></figure>

일부 경험에는 충분할 수 있지만 목표가 PWA 설치를 유도하는 것이라면 [`BeforeInstallPromptEvent`](https://developer.mozilla.org/docs/Web/API/BeforeInstallPromptEvent)를 듣고 PWA [설치를 승격하기 위한 패턴](/promote-install/)을 따르는 것이 좋습니다.

## PWA가 플랫폼별 앱 설치율을 잠식하지 못하도록 방지

경우에 따라 PWA를 통해 플랫폼별 앱 설치를 홍보하도록 선택할 수 있지만 이 경우에도 사용자가 PWA를 설치할 수 있도록 하는 메커니즘을 제공하는 것이 좋습니다. 이 대체 옵션을 사용하면 플랫폼별 앱을 설치할 수 없거나 설치하지 않으려는 사용자가 유사한 설치 환경을 얻을 수 있습니다.

이 전략을 구현하는 첫 번째 단계는 사용자에게 PWA에 대한 설치 프로모션을 표시할 시기에 대한 경험적 방법을 정의하는 것입니다. 예를 들면 다음과 같습니다.

**PWA 사용자는 플랫폼별 앱 설치 프롬프트를 보고 플랫폼별 앱을 설치하지 않은 사용자입니다. 이들은 최소 5번 이상 사이트에 돌아왔거나, 앱 배너를 클릭했지만, 대신 웹사이트를 계속 사용하고 있습니다.**

그런 다음 휴리스틱을 다음과 같이 구현할 수 있습니다.

1. 플랫폼별 앱 설치 배너를 표시합니다.
2. 사용자가 배너를 닫으면 해당 정보로 쿠키를 설정합니다(예: `document.cookie = "app-install-banner=dismissed"`).
3. 다른 쿠키를 사용하여 사이트에 대한 사용자 방문 수를 추적합니다(예: `document.cookie = "user-visits=1"`).
4. 사용자가 "PWA 사용자"로 간주되는지 확인하기 위해 [`getInstalledRelatedApps()`](/get-installed-related-apps/) API와 함께 쿠키에 이전에 저장된 정보를 사용하는 `isPWAUser()`와 같은 함수를 작성하십시오.
5. 사용자가 의미 있는 작업을 수행하는 순간 `isPWAUser()`를 호출합니다. 함수가 true를 반환하고 PWA 설치 프롬프트가 이전에 저장된 경우 PWA 설치 버튼을 표시할 수 있습니다.

## 앱 스토어를 통해 PWA 설치 촉진

앱 스토어에서 사용할 수 있는 앱은 PWA 기술을 비롯한 다양한 기술로 구축할 수 있습니다. [PWA를 기본 환경에 혼합](https://youtu.be/V7YX4cZ_Cto)에서 해당 목적에 사용할 수 있는 기술 요약을 찾을 수 있습니다.

이 섹션에서는 스토어의 앱을 두 그룹으로 분류합니다.

- **플랫폼별 앱:** 이러한 앱은 대부분 플랫폼별 코드로 빌드됩니다. 크기는 플랫폼에 따라 다르지만 일반적으로 Android에서는 10MB 이상, iOS에서는 30MB 이상입니다. PWA가 없거나 플랫폼별 앱이 더 완전한 기능 세트를 제공하는 경우 플랫폼별 앱을 홍보할 수 있습니다.
- **경량 앱:** 이러한 앱은 플랫폼별 코드로도 빌드할 수 있지만 일반적으로 플랫폼별 래퍼에 패키지된 웹 기술로 빌드됩니다. 전체 PWA도 상점에 업로드할 수 있습니다. 일부 회사는 이를 "라이트" 경험으로 제공하기로 선택하고 다른 회사는 주력(핵심) 앱에도 이 접근 방식을 사용했습니다.

### 가벼운 앱 홍보

[Google Play 연구](https://medium.com/googleplaydev/shrinking-apks-growing-installs-5d3fcba23ce2)에 따르면 APK 크기가 6MB 증가할 때마다 설치 전환율은 1%씩 감소합니다. 즉, 10MB 앱의 다운로드 완료율은 **100MB 앱보다 약 30% 더 높을 수 있습니다!**

이 문제를 해결하기 위해 일부 회사에서는 PWA를 활용하여 신뢰할 수 있는 웹 활동을 사용하여 Play 스토어에서 앱의 경량 버전을 제공하고 있습니다. [신뢰할 수 있는 웹 활동](https://developer.chrome.com/docs/android/trusted-web-activity/)을 통해 Play 스토어에서 PWA를 제공할 수 있으며 웹을 사용하여 구축되기 때문에 앱 크기는 일반적으로 몇 메가바이트에 불과합니다.

인도의 가장 큰 환대 회사 중 하나인 Oyo는 [앱의 Lite 버전](/oyo-lite-twa/)을 만들고 TWA를 사용하여 Play 스토어에서 사용할 수 있도록 했습니다. Android 앱 크기의 7%에 불과한 850KB에 불과합니다. 그리고 일단 설치되면 Android 앱과 구별할 수 없습니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/oyo-case-study/oyo-lite.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>작동 중인 OYO Lite.</figcaption></figure>

Oyo는 플래그십 및 "lite" 앱 버전을 모두 스토어에 보관했으며 최종 결정은 사용자에게 맡겼습니다.

#### 가벼운 웹 경험 제공

직관적으로 저가형 기기의 사용자는 고급형 기기의 사용자보다 경량 버전의 앱을 다운로드하는 경향이 더 높을 수 있습니다. 따라서 사용자의 기기를 식별할 수 있다면 플랫폼별 앱 버전보다 가벼운 앱 설치 배너를 우선시할 수 있습니다.

웹에서는 장치 신호를 가져와 장치 범주(예: "높음", "중간" 또는 "낮음")에 대략적으로 매핑할 수 있습니다. JavaScript API 또는 클라이언트 힌트를 사용하여 다양한 방법으로 이 정보를 얻을 수 있습니다.

#### JavaScript API 사용

[navigator.hardwareConcurrency](https://developer.mozilla.org/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency), [navigator.deviceMemory](https://developer.mozilla.org/docs/Web/API/Navigator/deviceMemory) 및 [navigator.connection](https://developer.mozilla.org/docs/Web/API/Navigator/connection)과 같은 JavaScript API를 사용하여 각각 장치 CPU, 메모리 및 네트워크 상태에 대한 정보를 얻을 수 있습니다. 예시:

```javascript
const deviceCategory = req.get('Device-Memory') < 1 ? 'lite' : 'full';`
```

#### 클라이언트 힌트 사용

장치 신호는 [클라이언트 힌트](https://developer.mozilla.org/docs/Glossary/Client_hints)를 통해 HTTP 요청 헤더에서 유추할 수도 있습니다. 클라이언트 힌트를 사용하여 장치 메모리에 대한 이전 코드를 구현하는 방법은 다음과 같습니다.

먼저, 모든 자사 요청에 대한 HTTP 응답 헤더에서 장치 메모리 힌트를 수신하는 데 관심이 있다고 브라우저에 알립니다.

```html
HTTP/1.1 200 OK
Content-Type: text/html
Accept-CH: Device-Memory
```

그런 다음 HTTP 요청의 요청 헤더에서 Device-Memory 정보를 수신하기 시작합니다.

```html
GET /main.js HTTP/1.1
Device-Memory: 0.5
```

백엔드에서 이 정보를 사용하여 사용자 기기 카테고리와 함께 쿠키를 저장할 수 있습니다.

```javascript
app.get('/route', (req, res) => {
  // Determine device category

 const deviceCategory = req.get('Device-Memory') < 1 ? 'lite' : 'full';

  // Set cookie
  res.setCookie('Device-Category', deviceCategory);
  …
});
```

마지막으로 이 정보를 장치 범주에 매핑하는 고유한 논리를 만들고 각 경우에 해당하는 앱 설치 프롬프트를 표시합니다.

```javascript
if (isDeviceMidOrLowEnd()) {
   // show "Lite app" install banner or PWA A2HS prompt
} else {
  // show "Core app" install banner
}
```

{% Aside %} 기기 신호를 기기 카테고리에 매핑하는 방법에 대한 심층적인 기술은 이 가이드의 범위를 벗어나지만 Addy Osmani의 [적응형 로딩 가이드](https://dev.to/addyosmani/adaptive-loading-improving-web-performance-on-low-end-devices-1m69), Philip Walton의 [The Device Memory API](https://developer.chrome.com/blog/device-memory/) 및 Jeremy Wagner의 [Adapting to Users with Client](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints/)를 확인할 수 있습니다. 이에 대한 모범 사례에 대한 자세한 정보는 힌트입니다. {% endAside %}

## 결론

사용자의 홈 화면에 아이콘을 표시하는 기능은 응용 프로그램의 가장 매력적인 기능 중 하나입니다. 역사적으로 이것은 앱 스토어에서 설치된 앱에서만 가능했다는 점을 감안할 때 기업은 앱 스토어 설치 배너를 표시하는 것으로 사용자가 경험을 설치하도록 설득하기에 충분하다고 생각할 수 있습니다. 현재 상점에서 가벼운 앱 경험을 제공하고 사용자가 웹사이트에서 직접 PWA를 추가하도록 하여 PWA를 홈 화면에 추가할 수 있도록 하는 등 사용자가 앱을 설치하도록 하는 더 많은 옵션이 있습니다.
