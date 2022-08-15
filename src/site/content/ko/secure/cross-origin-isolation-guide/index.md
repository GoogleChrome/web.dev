---
layout: post
title: 출처 간 격리를 이용하기 위한 가이드
authors:
  - agektmr
date: 2021-02-09
updated: 2021-08-05
subhead: 출처 간 격리를 이용하면 웹 페이지에서 SharedArrayBuffer와 같은 강력한 기능을 사용할 수 있습니다. 이 문서에서는 웹사이트에서 출처 간 격리를 이용하는 방법을 설명합니다.
description: 출처 간 격리를 이용하면 웹 페이지에서 SharedArrayBuffer와 같은 강력한 기능을 사용할 수 있습니다. 이 문서에서는 웹사이트에서 출처 간 격리를 이용하는 방법을 설명합니다.
tags:
  - security
---

이 가이드에서는 출처 간 격리를 이용하는 방법을 보여줍니다. [`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), [`performance.measureUserAgentSpecificMemory()`](/monitor-total-page-memory-usage/) 또는 [높은 정밀도의 고해상도 타이머](https://developer.chrome.com/blog/cross-origin-isolated-hr-timers/)를 사용하려면 출처 간 격리가 필요합니다.

출처 간 격리를 이용하려는 경우, 이것이 광고 배치와 같은 웹사이트의 다른 출처 간 리소스에 미치는 영향을 평가하세요.

{% Details %} {% DetailsSummary %} 웹사이트에서 `SharedArrayBuffer`가 사용되는 위치를 결정하세요.

Chrome 92부터 출처 간 격리 없이는 `SharedArrayBuffer`를 사용하는 기능이 더 이상 작동하지 않습니다. `SharedArrayBuffer` 사용 중단 메시지 때문에 이 페이지에 오게 되었다면 웹사이트 또는 여기에 내장된 리소스 중 하나가 `SharedArrayBuffer`를 사용하고 있을 가능성이 높습니다. 사용 중단으로 인해 웹사이트에서 아무 문제도 생기지 않도록 우선 이것이 사용되는 위치를 확인하세요.

{% endDetailsSummary %}

{% Aside 'objective' %}

- `SharedArrayBuffer`를 계속 사용하려면 출처 간 격리를 활성화하세요.
- `SharedArrayBuffer`를 사용하는 제3자 코드에 의존하는 경우, 제3자 공급자에게 조치를 취하도록 알리세요. {% endAside %}

사이트에서 `SharedArrayBuffer`가 사용되는 위치를 확실히 모르는 경우, 두 가지 방법으로 알아낼 수 있습니다.

- Chrome DevTools 사용
- (고급) 사용 중단 보고 사용

`SharedArrayBuffer` 사용 위치를 이미 알고 있다면 [출처 간 격리의 영향 분석](#analysis)으로 건너뛰세요.

### Chrome DevTools 사용

개발자는 [Chrome DevTools](https://developer.chrome.com/docs/devtools/open/)를 사용하여 웹사이트를 검사할 수 있습니다.

1. `SharedArrayBuffer`를 사용하고 있다고 의심되는 페이지에서 [Chrome DevTools를 엽니다](https://developer.chrome.com/docs/devtools/open/).
2. **콘솔** 패널을 선택합니다.
3. 페이지가 `SharedArrayBuffer`를 사용하는 경우 다음 메시지가 표시됩니다.
    ```text
    [Deprecation] SharedArrayBuffer will require cross-origin isolation as of M92, around May 2021. See https://developer.chrome.com/blog/enabling-shared-array-buffer/ for more details. common-bundle.js:535
    ```
4. 메시지 끝에 있는 파일 이름과 줄 번호(예: `common-bundle.js:535`)는 `SharedArrayBuffer`가 어디서 출처했는지를 나타냅니다. 제3자 라이브러리인 경우 개발자에게 연락해 문제를 해결하세요. 웹사이트의 일부로 구현된 경우라면 아래 가이드에 따라 출처 간 격리를 활성화하세요.

<figure>{% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/GOgkyjAabePTc8AG22F7.png", alt="출처 간 격리 없이 SharedArrayBuffer를 사용할 때 DevTools 콘솔 경고", width="800", height="163" %} <figcaption>출처 간 격리 없이 SharedArrayBuffer를 사용할 때 DevTools 콘솔 경고</figcaption></figure>

### (고급) 사용 중단 보고 사용

일부 브라우저에는 지정된 엔드포인트에 [API 사용 중단을 보고하는 기능이 있습니다.](https://wicg.github.io/deprecation-reporting/)

1. [사용 중단 보고서 서버를 설정하고 보고 URL을 가져옵니다](/coop-coep/#set-up-reporting-endpoint). 공공 서비스를 사용하거나 직접 구축하여 이를 수행할 수 있습니다.
2. URL을 사용하여 잠재적으로 `SharedArrayBuffer`를 제공할 페이지로 다음 HTTP 헤더를 설정합니다.
    ```http
    Report-To: {"group":"default","max_age":86400,"endpoints":[{"url":"THE_DEPRECATION_ENDPOINT_URL"}]}
    ```
3. 헤더가 전파되기 시작하면 등록한 엔드포인트에서 사용 중단 보고서 수집을 시작합니다.

여기에서 예제 구현을 참조하세요: [https://cross-origin-isolation.glitch.me](https://cross-origin-isolation.glitch.me) .

{% endDetails %}

## 출처 간 격리의 영향 분석 {: #analysis}

실제로 어떤 부분도 건드리지 않고 출처 간 격리를 활성화했을 때 사이트에 미치는 영향을 평가할 수 있다면 좋지 않을까요? [`Cross-Origin-Opener-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) 및 [`Cross-Origin-Embedder-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) HTTP 헤더를 사용하면 그렇게 할 수 있습니다.

1. 최상위 문서에서 [`Cross-Origin-Opener-Policy-Report-Only: same-origin`](/coop-coep/#1.-set-the-cross-origin-opener-policy:-same-origin-header-on-the-top-level-document)을 설정합니다. 이름에서 알 수 있듯이 이 헤더는 `COOP: same-origin`이 사이트에 **잠재적으로 미칠** 영향에 대한 보고서만 보냅니다. 실제로 팝업 창과의 통신을 중단시키지 않습니다.
2. 보고를 설정하고 보고서를 수신하고 저장하도록 웹 서버를 구성합니다.
3. 최상위 문서에서 [`Cross-Origin-Embedder-Policy-Report-Only: require-corp`](/coop-coep/#3.-use-the-coep-report-only-http-header-to-assess-embedded-resources)를 설정합니다. 다시 말하지만, 이 헤더를 사용하면 아직 사이트 기능에 실제로 영향을 주지 않으면서 `COEP: require-corp`을 활성화할 때의 영향을 확인할 수 있습니다. 이전 단계에서 설정한 동일한 보고 서버로 보고서를 보내도록 이 헤더를 구성할 수 있습니다.

{% Aside %} Chrome DevTools **네트워크** 패널에서 [**도메인** 컬럼을 활성화](https://developer.chrome.com/docs/devtools/network/#information)하여 어떤 리소스가 영향을 받는지 전반적으로 파악할 수도 있습니다. {% endAside %}

{% Aside 'caution' %}

출처 간 격리를 활성화하면 명시적으로 선택하지 않은 출처 간 리소스의 로딩이 차단되고 최상위 문서가 팝업 창과 통신할 수 없게 됩니다.

출처 간 격리를 위해서는 모든 하위 리소스를 명시적으로 선택해야 하므로 `Cross-Origin-Resource-Policy`를 대규모로 배포할 방법을 모색했습니다. 그리고 그 반대로 향하는 아이디어를 생각해 냈습니다. 바로, 모든 자격 증명을 제거하여 CORP 헤더 없이 리소스를 로드할 수 있는 [새로운 COEP "자격 증명 없는" 모드](https://github.com/mikewest/credentiallessness/)입니다. 작동 방식에 대한 세부 사항은 고려 중이지만 하위 리소스가 `Cross-Origin-Resource-Policy` 헤더를 보내도록 해야 하는 부담이 덜어지를 바랍니다.

또한, `Cross-Origin-Opener-Policy: same-origin` 헤더는 OAuth 및 결제와 같은 출처 간 창 상호 작용이 필요한 통합을 중단시키는 것으로 알려져 있습니다. 이 문제를 완화하기 위해 `Cross-Origin-Opener-Policy: same-origin-allow-popups`에 대한 출처 간 격리를 활성화하는 [조건을 덜 엄격하게 하는](https://github.com/whatwg/html/issues/6364) 방법을 모색하고 있습니다. 그러면 자체적으로 열리는 창과의 통신이 가능해질 것입니다.

출처 간 격리를 사용하고 싶지만 이러한 문제로 인해 차단된 경우, [최초 평가판에 등록](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial)하고 새 모드를 사용할 수 있을 때까지 기다릴 것을 권장합니다. 이러한 새로운 모드를 사용할 수 있을 때까지 최초 평가판을 종료할 계획이 없습니다.

{% endAside %}

## 출처 간 격리의 영향 완화

출처 간 격리의 영향을 받을 리소스를 결정했으면 이러한 출처 간 리소스를 실제로 선택하는 방법에 대한 다음의 일반 지침을 따르세요.

1. 이미지, 스크립트, 스타일시트, iframe 등과 같은 출처 간 리소스에서 [`Cross-Origin-Resource-Policy: cross-origin`](https://resourcepolicy.fyi/#cross-origin) 헤더를 설정합니다. Same-site 리소스에서는 [`Cross-Origin-Resource-Policy: same-site`](https://resourcepolicy.fyi/#same-origin) 헤더를 설정합니다.
2. 리소스가 [CORS](/cross-origin-resource-sharing/)와 함께 제공되는 경우 최상위 문서의 HTML 태그에 `crossorigin` 특성을 설정합니다(예: `<img src="example.jpg" crossorigin>`).
3. iframe에 로드된 출처 간 리소스에 다른 iframe 레이어가 포함된 경우, 계속 진행하기 전에 이 섹션에 설명된 단계를 재귀적으로 적용하세요.
4. 모든 출처 간 리소스가 선택된 것을 확인한 후, iframe에 로드된 출처 간 리소스에서 `Cross-Origin-Embedder-Policy: require-corp` 헤더를 설정합니다.
5. `postMessage()`를 통한 통신이 필요한 출처 간 팝업 창이 없도록 하세요. 출처 간 격리가 활성화된 경우 이 창이 계속 작동하도록 할 방법이 없습니다. 출처 간에 격리되지 않은 다른 문서로 통신을 이동하거나 다른 통신 방법(예: HTTP 요청)을 사용할 수 있습니다.

## 출처 간 격리 사용하기

출처 간 격리로 인한 영향을 완화한 후에는 출처 간 격리를 활성화하기 위한 다음 일반적 지침을 따르세요.

1. 최상위 문서에서 `Cross-Origin-Opener-Policy: same-origin` 헤더를 설정합니다. `Cross-Origin-Opener-Policy-Report-Only: same-origin`을 설정했다면 대체하세요. 이렇게 하면 최상위 문서와 해당 팝업 창 간의 통신이 차단됩니다.
2. 최상위 문서에서 `Cross-Origin-Embedder-Policy: require-corp` 헤더를 설정합니다. `Cross-Origin-Embedder-Policy-Report-Only: require-corp`를 설정했다면 대체하세요. 이렇게 하면 선택되지 않은 출처 간 리소스의 로드가 차단됩니다.
3. `self.crossOriginIsolated`가 콘솔에서 `true`를 반환하는지 확인하여 페이지가 출처 간에 격리되었는지 검증하세요.

{% Aside 'gotchas' %}

단순한 서버는 헤더 전송을 지원하지 않기 때문에 로컬 서버에서 출처 간 격리를 활성화하는 일은 어려울 수 있습니다. 명령줄 플래그 `--enable-features=SharedArrayBuffer`와 함께 Chrome을 시작하여 출처 간 격리를 사용하지 않고 `SharedArrayBuffer`를 활성화할 수 있습니다. [각 플랫폼에서 명령줄 플래그로 Chrome을 실행하는 방법](https://www.chromium.org/developers/how-tos/run-chromium-with-flags)을 알아보세요.

{% endAside %}

## 리소스

- [COOP 및 COEP를 사용하여 웹사이트를 "출처 간 격리"로 만들기](/coop-coep/)
- [Android Chrome 88 및 Desktop Chrome 92에서 SharedArrayBuffer 업데이트](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
