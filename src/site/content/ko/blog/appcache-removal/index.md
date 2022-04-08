---
layou: post
title: AppCache 제거 준비하기
subhead: Chrome 85는 기본적으로 AppCache에 대한 지원을 제거합니다. 대부분의 개발자는 지금 AppCache로부터 마이그레이션해야 하며 더 이상 기다리지 않아야 합니다.
authors:
  - jeffposnick
description: Chrome 및 기타 브라우저의 AppCache 제거 계획에 대한 세부정보입니다.
date: 2020-05-18
updated: 2021-08-23
tags:
  - blog
  - chrome-84
  - origin-trials
  - service-worker
hero: image/admin/YDs2H4gLPhIwPMjPtc8o.jpg
alt: 고풍스러운 저장 용기입니다.
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/1776670052997660673"
---

[이전 발표](https://blog.chromium.org/2020/01/appcache-scope-restricted.html)에 이어 Chrome 및 기타 Chromium 기반 브라우저에서 [AppCache에](https://developer.mozilla.org/docs/Web/API/Window/applicationCache) 대한 지원이 제거됩니다. 개발자는 더 이상 기다리지 말고 지금 AppCache로부터 마이그레이션하는 것이 좋습니다.

현재 브라우저에서 광범위하게 지원되는 [서비스 작업자](https://developer.chrome.com/docs/workbox/service-worker-overview/)는 AppCache가 제공했던 오프라인 경험을 제공하는 대안을 제공합니다. [마이그레이션 전략](#migration-strategies)을 참조하세요.

## 타임라인

Chrome 출시 일정에 대한 [최근 변경사항](https://blog.chromium.org/2020/03/chrome-and-chrome-os-release-updates.html)으로 인해 이러한 단계 중 일부의 시기가 다를 수 있습니다. 우리는 이 일정을 최신 상태로 유지하기 위해 노력할 것이지만 현 시점에서 특정 마일스톤을 기다리지 말고 가능한 한 빨리 AppCache로부터 마이그레이션하세요.

"사용되지 않는" 기능이 여전히 존재하지만 사용을 권장하지 않는 경고 메시지를 기록합니다. "제거된" 기능은 더 이상 브라우저에 존재하지 않습니다.

<div>
  <table>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/UKF8cK0EwMI/m/NLhsIrs-AQAJ">비보안 컨텍스트에서 사용 중단</a></td>
    <td>Chrome 50(2016년 4월)</td>
    </tr>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/ANnafFBhReY/m/1Xdr53KxBAAJ?pli=1">비보안 컨텍스트에서 제거</a></td>
    <td>Chrome 70(2018년 10월)</td>
    </tr>
    <tr>
    <td><a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/FvM-qo7BfkI/m/0daqyD8kCQAJ">보안 컨텍스트에서 사용 중단</a></td>
    <td>Chrome 79(2019년 12월)</td>
    </tr>
    <tr>
    <td><a href="https://blog.chromium.org/2020/01/appcache-scope-restricted.html">AppCache 범위 제한</a></td>
    <td>Chrome 80(2020년 2월)</td>
    </tr>
    <tr>
    <td>"리버스" 원본 평가판 시작</td>
    <td>Chrome 84(2020년 7월)</td>
    </tr>
    <tr>
    <td>
<a href="https://groups.google.com/a/chromium.org/g/blink-dev/c/FvM-qo7BfkI/m/AvxoE6JpBgAJ">보안 컨텍스트에서 제거</a>. 원본 평가판에 옵트인한 경우는 제외</td>
    <td>Chrome 85(2020년 8월)</td>
    </tr>
    <tr>
    <td>원본 평가판 완료와 함께 모든 사람을 위한 보안 컨텍스트에서 제거 완료</td>
    <td>2021년 10월 5일(대략 Chrome 95)</td>
    </tr>
  </table>
</div>

{% Aside %} 이 타임라인은 iOS 이외의 **모든 플랫폼**의 Chrome에 적용됩니다. Android [WebView](https://developer.android.com/reference/android/webkit/WebView) 내에서 사용되는 AppCache를 위한 조정된 타임라인도 있습니다. 자세한 내용은 이 게시물 뒷부분의 [크로스 플랫폼 이야기](#the-cross-platform-story)를 참조하세요. {% endAside %}

## 원본 평가판

이 타임라인에는 제거할 예정인 두 가지 마일스톤이 나열됩니다. Chrome 85부터 AppCache는 기본적으로 Chrome에서 더 이상 사용할 수 없습니다. AppCache로부터 마이그레이션하는 데 추가 시간이 필요한 개발자는 '리버스' [원본 평가판](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)에 [가입](https://developers.chrome.com/origintrials/#/register_trial/1776670052997660673)하여 웹 앱용 AppCache의 가용성을 연장할 수 있습니다. 원본 평가판은 Chrome 84에서 시작되어(Chrome 85에서 기본적으로 제거되기 전에) 2021년 10월 5일(대략 Chrome 95)까지 활성화됩니다. 이 시점에서 AppCache는 원본 평가판에 등록한 사람을 포함하여 모든 사람에 대해 완전히 제거됩니다.

{% Aside %} 우리는 왜 이것을 '리버스' 원본 평가판이라고 부를까요? 일반적으로 원본 평가판을 통해 개발자는 Chrome에서 기본적으로 제공되기 전에 새 기능에 미리 액세스할 수 있도록 선택(옵트인)할 수 있습니다. 이 경우 우리는 개발자가 기존 기술이 Chrome에서 제거된 후에도 일시적으로 사용할 수 있도록 선택(옵트인)할 수 있게 합니다. {% endAside %}

"리버스" 원본 평가판에 참여하려면:

<ol>
<li>여러분의 원본에 대한 <a href="https://developers.chrome.com/origintrials/#/register_trial/1776670052997660673">토큰을 요청</a>하세요.</li>
<li>여러분의 HTML 페이지에 토큰을 추가하세요. <a href="https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md#how-do-i-enable-an-experimental-feature-on-my-origin">두 가지 방법</a>이 있습니다.<ul>
<li> 각 페이지의 헤드에 <code>origin-trial</code> <code>&lt;meta&gt;</code> 태그를 추가합니다. 예: <code>&lt;meta http-equiv="origin-trial" content="TOKEN_GOES_HERE"&gt;</code> </li> <li> <code>Origin-Trial</code> HTTP 헤더가 포함된 응답을 반환하도록 서버를 구성합니다. 결과 응답 헤더는 다음과 같아야 합니다. <code>Origin-Trial: TOKEN_GOES_HERE</code> </li> </ul>
</li>
<li>여러분의 AppCache 매니페스트에 동일한 토큰을 추가합니다. 다음 형식으로 여러분의 매니페스트의 새 필드에서 이 작업을 수행합니다.</li>
</ol>

```text
ORIGIN-TRIAL:
TOKEN_GOES_HERE
```

(`ORIGIN-TRIAL`과 여러분의 토큰 사이에는 새 줄이 있어야 합니다.)





{% Aside %} 매니페스트의 토큰은 매니페스트 자체의 `ORIGIN-TRIAL` 필드에 **반드시** 있어야 합니다. HTML 페이지의 토큰과 달리 HTTP 헤더를 통해 이를 제공할 수 없습니다. {% endAside %}

`index.html` 및 `manifest.appcache` 파일 모두에 올바른 원본 평가판 토큰을 추가하는 방법을 설명하는 샘플 프로젝트가 아래에 포함되어 있는 것을 볼 수 있습니다.

{% Glitch { id: 'appcache-reverse-ot', path: 'manfiest.appcache', height: 480 } %}

### 토큰이 여러 곳에 필요한 이유는 무엇인가요?

**동일한 원본 평가판 토큰**을 다음과 연결해야 합니다.

- AppCache를 사용하는 **여러분의 모든 HTML 페이지**.
- `ORIGIN-TRIAL` 매니페스트 필드를 통한 **여러분의 모든 AppCache 매니페스트**.

과거에 원본 평가판에 참여했다면 여러분의 HTML 페이지에만 토큰을 추가했을 수 있습니다. AppCache "리버스" 원본 평가판은 토큰을 여러분의 각 AppCache 매니페스트에도 연결해야 한다는 점에서 특별합니다.

HTML 페이지에 원본 평가판 토큰을 추가하면 웹 앱 내에서 `window.applicationCache` 인터페이스가 활성화됩니다. 토큰과 연결되지 않은 페이지는 `window.applicationCache` 메서드 및 이벤트를 사용할 수 없습니다. 토큰이 없는 페이지도 AppCache로부터 리소스를 로드할 수 없습니다. Chrome 85부터 AppCache가 존재하지 않는 것처럼 작동합니다.

AppCache 매니페스트에 원본 평가판 토큰을 추가하면 각 매니페스트가 여전히 유효함을 나타냅니다. Chrome 85부터 `ORIGIN-TRIAL` 필드가 없는 매니페스트는 형식이 잘못된 것으로 처리되고 매니페스트 내의 규칙은 무시됩니다.

### 원본 평가판 배포 시기 및 공급

'리버스' 원본 평가판은 공식적으로 Chrome 84부터 시작되지만 여러분은 오늘 원본 평가판에 [가입](https://developers.chrome.com/origintrials/#/register_trial/1776670052997660673)하고 여러분의 HTML 및 AppCache 매니페스트에 토큰을 추가할 수 있습니다. 여러분의 웹 앱 잠재고객이 점차적으로 Chrome 84로 업그레이드함에 따라 여러분이 이미 추가한 모든 토큰이 적용됩니다.

AppCache 매니페스트에 토큰을 추가한 후에는 `about://appcache-internals`를 방문하여 여러분의 Chrome(버전 84 이상)의 로컬 인스턴스가 원본 평가판 토큰을 매니페스트의 캐시된 항목과 올바르게 연결했는지 확인하세요. 여러분의 원본 평가판이 인식되면 해당 페이지에 여러분의 매니페스트와 연결된 `Token Expires: Tue Apr 06 2021...` 필드가 표시되어야 합니다.

<figure>{% Img src="image/admin/Xid94kdPT5yGbQzBL4at.jpg", alt="인식된 토큰을 보여주는 about://appcache-internals 인터페이스.", width="550", height="203" %}</figure>

## 제거 전 테스트

가능한 한 빨리 AppCache로부터 마이그레이션하는 것이 좋습니다. 여러분의 웹 앱에서 AppCache 제거를 테스트하려면 `about://flags/#app-cache` [플래그](https://www.chromium.org/developers/how-tos/run-chromium-with-flags)를 사용하여 제거를 시뮬레이션하세요. 이 플래그는 Chrome 84부터 사용할 수 있습니다.

## 마이그레이션 전략 {: #migration-strategies }

[현재 브라우저에서 광범위하게 지원되는](https://developer.mozilla.org/docs/Web/API/ServiceWorker#Browser_compatibility) 서비스 작업자는 AppCache에서 제공하는 오프라인 경험에 대한 대안을 제공합니다.

우리는 전체 AppCache 인터페이스를 복제하지는 않지만 서비스 작업자를 사용하여 AppCache의 일부 기능을 복제하는 [폴리필](https://github.com/GoogleChromeLabs/sw-appcache-behavior)을 제공했습니다. 이는 특히 `window.applicationCache` 인터페이스 또는 관련 AppCache 이벤트를 대체하지 않습니다.

더 복잡한 경우에는 [Workbox](https://developer.chrome.com/docs/workbox/)와 같은 라이브러리를 사용하여 여러분의 웹 앱용 최신 서비스 작업자를 쉽게 만들 수 있습니다.

### 상호 배타적인 서비스 작업자와 AppCache

마이그레이션 전략을 수행하는 동안 Chrome은 서비스 작업자의 [제어](/service-worker-lifecycle/#scope-and-control) 하에 로드된 모든 페이지에서 AppCache 기능을 비활성화한다는 점을 염두에 두시기 바랍니다. 즉, 특정 페이지를 제어하는 서비스 작업자를 배포하는 즉시 해당 페이지에서 AppCache를 더 이상 사용할 수 없습니다.

이 때문에 서비스 작업자로 하나씩 마이그레이션하지 않는 것이 좋습니다. 캐싱 논리의 일부만 포함하는 서비스 작업자를 배포하는 것은 실수입니다. "차이를 메우기" 위해 AppCache로 물러날 수는 없습니다.

마찬가지로 AppCache를 제거하기 전에 서비스 작업자를 배포한 다음 이전 AppCache 구현으로 롤백해야 하는 경우 해당 서비스 작업자의 [등록을 취소](https://stackoverflow.com/a/33705250/385997)해야 합니다. 지정된 페이지의 범위에 등록된 서비스 작업자가 있는 한 AppCache는 사용되지 않습니다.

## 크로스 플랫폼 이야기

특정 브라우저 공급업체의 AppCache 제거 계획에 대한 자세한 정보를 원하는 경우 해당 공급업체의 후속 작업을 알아보는 것이 좋습니다.

### 모든 플랫폼의 Firefox

Firefox는 릴리스 44(2015년 9월)에서 AppCache를 [사용 중단](https://www.fxsitecompat.dev/en-CA/docs/2015/application-cache-api-has-been-deprecated/)했으며 2019년 9월부터 베타 및 나이틀리 빌드에서 AppCache에 대한 지원을 [제거](https://www.fxsitecompat.dev/en-CA/docs/2019/application-cache-storage-has-been-removed-in-nightly-and-early-beta/)했습니다.

### iOS 및 macOS의 Safari

Safari는 2018년 초에 AppCache를 [사용 중단](https://bugs.webkit.org/show_bug.cgi?id=181764)했습니다.

### iOS의 크롬

iOS용 Chrome은 다른 플랫폼의 Chrome과 다른 브라우저 엔진인 [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview)를 사용하기 때문에 특별한 경우로 봐야 합니다. 서비스 작업자는 현재 WKWebView를 사용하는 iOS 앱에서 지원되지 않으며 Chrome의 AppCache 제거 발표는 [iOS용 Chrome의 AppCache 가용성](https://webkit.org/status/#specification-application-cache)을 다루지 않습니다. 여러분의 웹 앱에 iOS용 Chrome 사용자가 많다는 사실을 알고 있다면 이 점을 염두에 두시기 바랍니다.

### 안드로이드 WebViews

Android 애플리케이션의 일부 개발자는 Chrome [WebView](https://developer.android.com/reference/android/webkit/WebView)를 사용하여 웹 콘텐츠를 표시하고 AppCache를 사용할 수도 있습니다. 그러나 WebView용 원본 평가판을 활성화하는 것은 불가능합니다. 그 점을 고려해볼때 Chrome WebView는 Chrome 90에서 예상되는 최종 제거가 수행될 때까지 원본 평가판 없이 AppCache를 지원합니다.

## 더 알아보기

다음은 AppCache에서 서비스 작업자로 마이그레이션하는 개발자를 위한 몇 가지 참고 자료입니다.

### 문서

- [서비스 작업자: 소개](https://developer.chrome.com/docs/workbox/service-worker-overview/)
- [서비스 작업자 수명 주기](/service-worker-lifecycle/)
- [프로그레시브 웹 앱 교육](https://developers.google.com/web/ilt/pwa)
- [네트워크 안정성](/reliable/)

### 도구

- [AppCache 폴리필](https://github.com/GoogleChromeLabs/sw-appcache-behavior)
- [Workbox](https://developer.chrome.com/docs/workbox/)
- [PWA 빌더](https://www.pwabuilder.com/)

## 지원 받기

특정 도구를 사용할 때 문제가 발생하면 GitHub 리포지토리에서 해당 문제를 엽니다.

<code>[html5-appcache](https://stackoverflow.com/questions/tagged/html5-appcache)</code> 태그를 사용하여 [Stack Overflow](https://stackoverflow.com/)의 AppCache로부터 마이그레이션하는 방법에 대한 일반적인 질문을 할 수 있습니다.

Chrome의 AppCache 제거와 관련된 버그가 발생하면 Chromium 문제 추적기를 사용하여 [신고해주세요](https://crbug.com/new).

*이곳의 이미지는 [Smithsonian Institution Archives, Acc. 11-007, Box 020, 이미지 번호 MNH-4477](https://www.si.edu/object/usnm-storage-drawer:siris_arc_391797)를 기반으로 합니다.*
