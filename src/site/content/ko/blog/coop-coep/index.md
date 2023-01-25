---
layout: post
title: COOP 및 COEP를 사용하여 웹사이트를 "cross-origin isolated"로 만들기
subhead: |-
  COOP 및 COEP를 사용하여 cross-origin isolated 환경을 설정하고
  'SharedArrayBuffer', 'performance.measureUserAgentSpecificMemory()' 및 더 나은 정밀도의 고해상도 타이머와 같이 강력한 기능을 활성화하세요.
description: |-
  일부 웹 API는 Spectre와 같은 부채널 공격의 위험을 높입니다. 이러한 위험을 완화하기 위해 브라우저는
  옵트인(opt-in) 기반의 격리 환경인 cross-origin isolated를 제공합니다. COOP 및 COEP를 사용하여 이러한 환경을 설정하고 'SharedArrayBuffer', 'performance.measureUserAgentSpecificMemory()' 또는 더 나은 정밀도의 고해상도 타이머와 같은 강력한 기능을 활성화하세요.
authors:
  - agektmr
hero: image/admin/Rv8gOTwZwxr2Z7b13Ize.jpg
alt: 팝업, iframe 및 이미지가 있는 웹사이트를 탐색하는 사람의 그림입니다.
date: 2020-04-13
updated: 2021-11-26
tags:
  - blog
  - security
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/register_trial/2780972769901281281"
feedback:
  - api
---

{% Aside 'caution' %}

`SharedArrayBuffer`는 Chrome 92부터 교차 출처 격리가 필요합니다. [Android Chrome 88 및 데스크톱 Chrome 92의 SharedArrayBuffer 업데이트](https://developer.chrome.com/blog/enabling-shared-array-buffer/)에서 자세히 알아보세요.

{% endAside %}

**업데이트**

- **2021년 8월 5일**: JS Self-Profiling API는 교차 출처 격리가 필요한 API 중 하나로 언급되었으나 [최신 방향성 변경](https://github.com/shhnjk/shhnjk.github.io/tree/main/investigations/js-self-profiling#conclusion)을 반영하여 삭제되었습니다.
- **2021년 5월 6일**: 보고된 피드백 및 문제를 기반으로 Chrome M92에서 `SharedArrayBuffer`이 사용될 때의 타임라인을 조정하여 cross-origin isolated가 적용되지 않은 사이트에서 사용하는 것을 제한하였습니다.
- **2021년 4월 16일**: [새로운 COEP 무 자격 증명 모드](https://github.com/mikewest/credentiallessness/) 및 교차 출처 격리를 위해 조건이 완화된 [COOP same-origin-allow-popups](https://github.com/whatwg/html/issues/6364)에 대한 참고 사항을 추가했습니다.
- **2021년 3월 5일**: `SharedArrayBuffer` , `performance.measureUserAgentSpecificMemory()` 및 디버깅 기능에 대한 제한이 제거되었습니다. 이 기능은 이제 Chrome 89에서 완전히 활성화됩니다. 앞으로 더 높은 정밀도를 갖게 될 `performance.now()` 및 `performance.timeOrigin`을 추가했습니다.
- **2021년 2월 19일**: `allow="cross-origin-isolated"` 및 디버깅 기능에 대한 참고 사항을 추가했습니다.
- **2020년 10월 15일** : `self.crossOriginIsolated` 는 Chrome 87에서 사용할 수 있습니다. 이를 반영하여 `self.crossOriginIsolated` 가 `true` `document.domain`을 변경할 수 없습니다. `performance.measureUserAgentSpecificMemory()`는 원본 평가판을 종료하고 Chrome 89에서 기본적으로 활성화됩니다. Android Chrome의 공유 배열 버퍼는 Chrome 88에서 사용할 수 있습니다.

{% YouTube 'XLNJYhjA-0c' %}

일부 웹 API는 Spectre와 같은 부채널 공격의 위험을 높입니다. 이러한 위험을 완화하기 위해 브라우저는 옵트인 기반 격리 환경인 cross-origin isolated를 제공합니다. cross-origin isolated가 적용된 상태에서 웹 페이지는 다음과 같은 특별 기능을 사용할 수 있습니다.

<div>
  <table>
    <thead>
      <tr>
        <th>API</th>
        <th>설명</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer">
          <code>SharedArrayBuffer</code></a>
        </td>
        <td>WebAssembly 스레드에 필요합니다. 이 API는 Android Chrome 88에서 사용할 수 있습니다. 데스크톱 버전은 현재 <a href="https://www.chromium.org/Home/chromium-security/site-isolation">사이트 격리</a>의 도움으로 기본적으로 활성화되어 있지만 cross-origin isolated 상태가 필요하며 <a href="https://developer.chrome.com/blog/enabling-shared-array-buffer/">Chrome 92에서는 기본적으로 비활성화됩니다</a> .</td>
      </tr>
      <tr>
        <td>
          <a href="/monitor-total-page-memory-usage/">
          <code>performance.measureUserAgentSpecificMemory()</code></a>
        </td>
        <td>Chrome 89부터 사용할 수 있습니다.</td>
      </tr>
      <tr>
        <td><a href="https://crbug.com/1180178"><code>performance.now()</code> , <code>performance.timeOrigin</code></a></td>
        <td>현재 해상도가 100마이크로초 이상으로 제한된 많은 브라우저에서 사용할 수 있습니다. 교차 출처 격리를 사용하면 해상도가 5마이크로초 이상일 수 있습니다.</td>
      </tr>
    </tbody>
    <caption>cross-origin isolated 상태에서 사용할 수 있는 기능입니다.</caption>
  </table>
</div>

cross-origin isolated 상태는 `document.domain` 수정도 방지합니다(`document.domain`을 변경할 수 있다는 것은 동일한 사이트의 문서들 간의 통신을 가능하게 하며, 동일 출처 정책의 허점으로 여겨져 왔습니다).

cross-origin isolated 상태를 선택하려면 기본 문서에서 다음 HTTP 헤더를 보내야 합니다.

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

이 헤더는 교차 출처 문서에 의해 로드되도록 선택하지 않은 리소스 또는 iframe의 로드를 차단하고 교차 출처 창이 문서와 직접 상호 작용하는 것을 방지하도록 브라우저에 지시합니다. 이는 교차 출처로 로드되는 리소스에 옵트인이 필요함을 의미합니다.

[`self.crossOriginIsolated`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated)를 검사하여 웹 페이지가 cross-origin isolated 상태인지 여부를 확인할 수 있습니다.

이 문서에서는 이러한 새 헤더를 사용하는 방법을 보여줍니다. [후속 기사](/why-coop-coep)에서 더 많은 배경과 맥락을 제공할 것입니다.

{% Aside %}

이 기사는 `SharedArrayBuffer` , WebAssembly 스레드, `performance.measureUserAgentSpecificMemory()` 또는 고해상도 타이머를 브라우저 플랫폼 전반에 걸쳐 보다 강력한 방식으로 보다 정밀하게 사용할 수 있도록 준비하려는 사람들을 대상으로 합니다.

{% endAside %}

{% Aside 'key-term' %} 이 문서에서는 유사하게 들리는 많은 용어를 사용합니다. 더 명확하게 하기 위해 먼저 용어들을 정의해 보겠습니다.

- [COEP: 교차 출처 임베더 정책](https://wicg.github.io/cross-origin-embedder-policy/)
- [COOP: 교차 출처 오프너 정책](https://github.com/whatwg/html/pull/5334/files)
- [CORP: 교차 출처 리소스 정책](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))
- [CORS: 교차 출처 리소스 공유](https://developer.mozilla.org/docs/Web/HTTP/CORS)
- [CORB: 교차 출처 읽기 차단](https://www.chromium.org/Home/chromium-security/corb-for-developers) {% endAside %}

## COOP 및 COEP를 배포하여 웹 사이트를 cross-origin isolated로 만들기

{% Aside %} [교차 출처 격리를 활성화하기 위한 가이드](/cross-origin-isolation-guide/)에서 교차 출처 격리를 활성화하는 실제 단계를 알아보세요. {% endAside %}

### COOP 및 COEP 통합

#### 1. `Cross-Origin-Opener-Policy: same-origin` 헤더를 최상위 문서에 설정합니다

최상위 문서에서 `COOP: same-origin`을 활성화하면 동일한 출처를 가진 창과 해당 문서에서 열린 창은 동일한 출처에 동일한 COOP 설정으로 있지 않는 한 별도의 탐색 컨텍스트 그룹을 갖게 됩니다. 따라서 열린 창에 대해 격리가 적용되고 두 창 간의 상호 통신이 비활성화됩니다.

{% Aside 'caution' %}

이렇게 하면 OAuth 및 결제와 같은 같은 출처 간 창 상호 작용이 필요한 통합이 중단됩니다. 이 문제를 완화하기 위해 `Cross-Origin-Opener-Policy: same-origin-allow-popups` 대한 교차 출처 격리의 활성화 [조건을 완화하는 방법을 모색하고 있습니다](https://github.com/whatwg/html/issues/6364). 이렇게 하면 저절로 열리는 창과의 통신이 가능합니다.

교차 출처 격리를 활성화하고 싶지만 이 문제로 차단된 [경우 출처 평가판에 등록](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial)하고 새 조건을 사용할 수 있을 때까지 기다리는 것이 좋습니다. 이 문제가 안전하게 해결될 때까지 원본 평가판을 종료할 계획이 없습니다.

{% endAside %}

브라우징 컨텍스트 그룹은 동일한 컨텍스트를 공유하는 탭, 창 또는 iframe의 그룹입니다. 예를 들어 웹사이트(`https://a.example`)가 팝업 창(`https://b.example`)을 열면 오프너 창과 팝업 창은 동일한 브라우징 컨텍스트를 공유하며 `window.opener`와 같은 DOM API를 통해 서로 액세스할 수 있습니다.

{% Img src="image/admin/g42eZMpIKNbUL0cN6yjC.png", alt="탐색 컨텍스트 그룹", width="470", height="469" %}

[DevTools에서](#devtools-coop) 창 오프너와 열린 창이 별도의 탐색 컨텍스트 그룹에 있는지 확인할 수 있습니다.

{% Aside 'codelab' %} [다양한 COOP 매개변수의 영향을 확인하세요](https://cross-origin-isolation.glitch.me/coop) . {% endAside %}

#### 2. 리소스에 CORP 또는 CORS가 활성화되어 있는지 확인

페이지의 모든 리소스가 CORP 또는 CORS HTTP 헤더와 함께 로드되었는지 확인합니다. 이 단계는 [COEP를 활성화하는 네 번째 단계](#enable-coep)에 필요합니다.

리소스의 특성에 따라 수행해야 하는 작업은 다음과 같습니다.

- **리소스가 동일한 출처에서만** 로드될 것으로 예상되는 경우 `Cross-Origin-Resource-Policy: same-origin` 헤더를 설정합니다.
- **리소스가 동일한 사이트이지만 교차 출처에서** 로드될 것으로 예상되는 경우 `Cross-Origin-Resource-Policy: same-site` 헤더를 설정합니다.
- 리소스가 **사용자 제어 하에 교차 출처에서 로드되는** 경우 가능하면 `Cross-Origin-Resource-Policy: cross-origin` 헤더를 설정하십시오.
- 제어할 수 없는 교차 출처 리소스의 경우:
    - 리소스가 CORS와 함께 제공되는 경우 로딩 HTML 태그에서 `crossorigin` 속성을 사용하십시오(예: `<img src="***" crossorigin>`).
    - 리소스 소유자에게 CORS 또는 CORP를 지원하도록 요청하십시오.
- iframe의 경우 CORP 및 COEP 헤더를 다음과 같이 사용합니다. `Cross-Origin-Resource-Policy: same-origin` (또는 컨텍스트에 따라 `same-site` , `cross-origin`) 혹은 `Cross-Origin-Embedder-Policy: require-corp`.

{% Aside 'gotchas' %} `allow="cross-origin-isolated"` 기능 정책을 `<iframe>` 태그에에 적용하고 이 문서에 설명된 것과 동일한 조건을 충족하여 iframe 내에 포함된 문서에서 교차 출처 격리를 활성화할 수 있습니다. 상위 프레임과 하위 프레임을 포함한 전체 문서 체인도 교차 출처에서 격리되어야 합니다. {% endAside %}

{% Aside 'key-term' %} "동일 사이트"와 "동일 출처"의 차이점을 이해하는 것이 중요합니다. [동일 사이트 및 동일 출처 이해하기](/same-site-same-origin)에서 차이점에 대해 알아보세요. {% endAside %}

#### 3. COEP 보고서 전용 HTTP 헤더를 사용하여 포함된 리소스 평가

`Cross-Origin-Embedder-Policy-Report-Only` 헤더를 사용하여 테스트 실행을 수행하여 정책이 실제로 작동하는지 검사할 수 있습니다. 포함된 콘텐츠를 차단하지 않고 보고서를 받게 됩니다. 이를 모든 문서에 재귀적으로 적용합니다. 보고 전용 HTTP 헤더에 대한 정보는  [보고 API를 사용하여 문제 관찰](#observe-issues-using-the-reporting-api)을 참조하십시오.

#### 4. COEP 활성화 {: #enable-coep }

모든 것이 작동하고 모든 리소스가 성공적으로 로드되는 것을 확인한 후 iframe을 통해 포함된 문서를 포함한 모든 문서에 `Cross-Origin-Embedder-Policy: require-corp` HTTP 헤더를 적용하세요.

{% Aside 'codelab' %} [다양한 COEP/CORP 매개변수의 영향을 확인하세요](https://cross-origin-isolation.glitch.me/coep) . {% endAside %}

{% Aside %} [Squoosh](https://squoosh.app)(이미지 최적화 PWA)는 [이제 COOP/COEP를 사용하여](https://github.com/GoogleChromeLabs/squoosh/pull/829/files#diff-316f969413f2d9a065fcc08c7a5589c088dd1e21deebadccfc5a4372ac5e0cbbR22-R23) Android Chrome에서도 Wasm Threads(및 Shared Array Buffer)에 액세스할 수 있습니다. {% endAside %}

{% Aside 'caution' %}

`Cross-Origin-Resource-Policy`를 대규모로 배포하는 방법을 모색해 왔습니다. 교차 출처 격리를 위해서는 모든 하위 리소스가 명시적으로 옵트인해야 하기 때문입니다. 그리고 우리는 반대 방향으로 가는 아이디어를 생각해 냈습니다. 모든 자격 증명을 제거하여 CORP 헤더 없이 리소스를 로드할 수 있는 [새로운 COEP "무 자격 증명" 모드](https://github.com/mikewest/credentiallessness/)입니다. 작동 방식에 관한 세부 사항을 파악하고 있지만 이 모드가 하위 `Cross-Origin-Resource-Policy` 헤더를 보내고 있는지 확인하는 부담을 덜어주기를 바랍니다.

교차 출처 격리를 활성화하고 싶지만 이에 의해 차단되는 [경우 출처 평가판에 등록](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial) 하고 새 모드를 사용할 수 있을 때까지 기다리는 것이 좋습니다. 새 모드를 사용할 수 있을 때까지 원본 평가판을 종료할 계획이 없습니다.

{% endAside %}

### `self.crossOriginIsolated` 격리 성공 여부 확인

`self.crossOriginIsolated` 속성은 웹 페이지가 원본 간 격리 상태이고 모든 리소스와 창이 동일한 탐색 컨텍스트 그룹 내에서 격리된 경우 `true`를 반환합니다. 이 API를 활용하여 탐색 컨텍스트 그룹이 성공적으로 격리되고 `performance.measureUserAgentSpecificMemory()`와 같은 강력한 기능에 대한 액세스 권한을 얻었는지 확인할 수 있습니다.

### Chrome DevTools를 사용하여 문제 디버그

{% YouTube 'D5DLVo_TlEA' %}

이미지와 같이 화면에 렌더링되는 리소스의 경우 요청이 차단되고 페이지에 누락된 이미지가 표시되기 때문에 COEP 문제를 감지하기가 상당히 쉽습니다. 그러나 스크립트나 스타일과 같이 시각적 영향이 반드시 필요하지 않은 리소스의 경우 COEP 문제가 눈에 띄지 않을 수 있습니다. 이를 위해 DevTools 네트워크 패널을 사용하십시오. COEP에 문제가 있는 경우 **상태** 열에 `(blocked:NotSameOriginAfterDefaultedToSameOriginByCoep)`를 볼 수 있습니다.

<figure>{% Img src="image/admin/iGwe4M1EgHzKb2Tvt5bl.jpg", alt="네트워크 패널의 상태 열에 나타난 COEP 문제", width="800", height="444" %}</figure>

그런 다음 항목을 클릭하여 자세한 내용을 볼 수 있습니다.

<figure>{% Img src="image/admin/1oTBjS9q8KGHWsWYGq1N.jpg", alt="COEP 문제에 대한 세부정보는 네트워크 패널에서 네트워크 리소스를 클릭하면 헤더 탭에 표시됩니다.", width="800", height=" 241" %}</figure>

**응용 프로그램** 패널을 통해 iframe 및 팝업 창의 상태를 확인할 수도 있습니다. 왼쪽의 "프레임" 섹션으로 이동하고 "상단"을 확장하여 리소스 구조의 분석을 확인합니다.

<span id="devtools-coep-iframe">'SharedArrayBuffer' 사용 가능 여부 등 iframe의 상태를 확인할 수 있습니다.</span>

<figure>{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/9titfaieIs0gwSKnkL3S.png", alt="Chrome DevTools iframe 검사기", width="800", height="480" %}</figure>

<span id="devtools-coop">또한 교차 출처 격리 여부와 같은 팝업 창의 상태를 확인할 수 있습니다.</span>

<figure>{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/kKvPUo2ZODZu8byK7gTB.png", alt="Chrome DevTools 팝업 창 검사기", width="800", height="480" %}</figure>

### 보고 API를 사용하여 문제 관찰

[보고 API](/reporting-api)는 다양한 문제를 감지할 수 있는 또 다른 메커니즘입니다. COEP가 리소스 로드를 차단하거나 COOP가 팝업 창을 분리할 때마다 보고서를 보내도록 사용자의 브라우저에 지시하도록 보고 API를 구성할 수 있습니다. Chrome은 COEP 및 COOP를 비롯한 다양한 용도로 버전 69부터 보고 API를 지원해 왔습니다.

{% Aside %}

보고 API와 `Report-To` 헤더를 사용할 준비가 되셨나요? Chrome은 `Report-To`를 `Reporting-Endpoints`로 대체하는 보고 API의 새 버전으로 전환하고 있습니다. 새 버전으로 마이그레이션하는 것을 고려하십시오. 자세한 내용은 [보고 API v1로 마이그레이션](/reporting-api-migration)을 확인하세요.

{% endAside %}

보고 API를 구성하고 보고서를 수신하도록 서버를 설정하는 방법을 배우려면 보고 [API 사용](/reporting-api/#using-the-reporting-api)으로 이동하십시오.

#### COEP 보고서 예시

교차 출처 리소스가 차단된 경우 [COEP 보고서](https://html.spec.whatwg.org/multipage/origin.html#coep-report-type) 페이로드의 예는 다음과 같습니다.

```json
[{
  "age": 25101,
  "body": {
    "blocked-url": "https://third-party-test.glitch.me/check.svg?",
    "blockedURL": "https://third-party-test.glitch.me/check.svg?",
    "destination": "image",
    "disposition": "enforce",
    "type": "corp"
  },
  "type": "coep",
  "url": "https://cross-origin-isolation.glitch.me/?coep=require-corp&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4249.0 Safari/537.36"
}]
```

{% Aside 'caution' %} `blocked-url`은 이전 버전과의 호환성을 위해서만 존재하며 [추후에 제거됩니다](https://github.com/whatwg/html/pull/5848). {% endAside %}

#### COOP 보고서 예시

팝업 창이 분리되어 열릴 때의 [COOP 보고서](https://html.spec.whatwg.org/multipage/origin.html#reporting) 페이로드의 예는 다음과 같습니다.

```json
[{
  "age": 7,
  "body": {
    "disposition": "enforce",
    "effectivePolicy": "same-origin",
    "nextResponseURL": "https://third-party-test.glitch.me/popup?report-only&coop=same-origin&",
    "type": "navigation-from-response"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
}]
```

다른 브라우징 컨텍스트 그룹이 서로 액세스를 시도하면("보고 전용" 모드에서만) COOP도 보고서를 보냅니다. 예를 들어 `postMessage()`가 시도될 때의 보고서는 다음과 같습니다.

```json
[{
  "age": 51785,
  "body": {
    "columnNumber": 18,
    "disposition": "reporting",
    "effectivePolicy": "same-origin",
    "lineNumber": 83,
    "property": "postMessage",
    "sourceFile": "https://cross-origin-isolation.glitch.me/popup.js",
    "type": "access-from-coop-page-to-openee"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?report-only&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
},
{
  "age": 51785,
  "body": {
    "disposition": "reporting",
    "effectivePolicy": "same-origin",
    "property": "postMessage",
    "type": "access-to-coop-page-from-openee"
  },
  "type": "coop",
  "url": "https://cross-origin-isolation.glitch.me/coop?report-only&coop=same-origin&",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4246.0 Safari/537.36"
}]
```

## 결론

COOP 및 COEP HTTP 헤더의 조합을 사용하여 웹 페이지를 특별한 교차 출처 격리 상태로 선택하십시오. `self.crossOriginIsolated`를 검사하여 웹 페이지가 원본 간 격리 상태인지 여부를 확인할 수 있습니다.

이 교차 출처 격리 상태에 새로운 기능이 제공되고 COOP 및 COEP와 관련된 DevTools에 대한 추가 개선이 이루어지면 이 게시물을 계속 업데이트하겠습니다.

## 자원

- [강력한 기능을 위해 "교차 출처 격리"가 필요한 이유](/why-coop-coep/)
- [교차 출처 격리를 가능하게 하는 가이드](/cross-origin-isolation-guide/)
- [Android Chrome 88 및 Desktop Chrome 92의 SharedArrayBuffer 업데이트](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
- [`measureUserAgentSpecificMemory()`를 사용하여 웹 페이지의 총 메모리 사용량을 모니터링](/monitor-total-page-memory-usage/)
