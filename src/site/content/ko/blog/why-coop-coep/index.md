---
title: 강력한 기능을 위해 "cross-origin isolated"가 필요한 이유
subhead: "`SharedArrayBuffer`,  `performance.measureUserAgentSpecificMemory()`와 같은 강력한 기능을 사용하기 위해 출처 간 격리와 더 나은 정밀도의 고해상도 타이머가 필요한 이유를 알아봅니다."
description: 일부 웹 API는 Spectre와 같은 부채널 공격의 위험을 높입니다. 이러한 위험을 완화하기 위해 브라우저는 옵트인(opt-in) 기반의 격리 환경인 cross-origin isolated를 제공합니다.`SharedArrayBuffer`,  `performance.measureUserAgentSpecificMemory()`와 같은 강력한 기능을 사용하기 위해 출처 간 격리와 더 나은 정밀도의 고해상도 타이머가 필요한 이유를 알아봅니다.
authors:
  - agektmr
  - domenic
hero: image/admin/h8g1TQjkfkJSpWJrPakB.jpg
date: 2020-05-04
updated: 2021-08-05
tags:
  - blog
  - security
feedback:
  - api
---

## 소개

COOP 및 COEP를 사용하여 [웹사이트를 "cross-origin isolated"로 만들기](/coop-coep/)에서 COOP 및 COEP를 사용하여 "cross-origin isolated" 상태로 채택하는 방법을 설명했습니다. 이것은 브라우저에서 강력한 기능을 활성화하기 위해 출처 간 격리가 필요한 이유를 설명하는 동반 문서입니다.

{% Aside 'key-term' %} 이 문서에서는 유사하게 들리는 많은 용어를 사용합니다. 더 명확하게 하기 위해 먼저 용어들을 정의해 보겠습니다.

- [COEP: 출처 간 임베더 정책](https://wicg.github.io/cross-origin-embedder-policy/)
- [COOP: 출처 간 오프너 정책](https://github.com/whatwg/html/pull/5334/files)
- [CORP: 출처 간 리소스 정책](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))
- [CORS: 출처 간 리소스 공유](https://developer.mozilla.org/docs/Web/HTTP/CORS)
- [CORB: 출처 간 읽기 차단](https://www.chromium.org/Home/chromium-security/corb-for-developers) {% endAside %}

## 배경

웹은 [동일 출처 정책](/same-origin-policy/)을 기반으로 구축되었습니다. 문서 및 스크립트가 다른 출처의 리소스와 상호 작용할 수 있는 방법을 제한하는 보안 기능입니다. 이 원칙은 웹사이트가 출처 간 리소스에 액세스할 수 있는 방법을 제한합니다. 예를 들어 `https://a.example`의 문서는 `https://b.example`에 호스팅된 데이터에 액세스할 수 없습니다.

그러나 동일 출처 정책에는 몇 가지 역사적 예외가 있었습니다. 모든 웹사이트는 다음을 수행할 수 있습니다.

- 출처 간 iframe 삽입
- 이미지 또는 스크립트와 같은 출처 간 리소스 포함
- DOM 참조로 출처 간 팝업 창 열기

웹을 처음부터 디자인할 수 있다면 이러한 예외는 존재하지 않을 것입니다. 불행히도 웹 커뮤니티가 엄격한 동일 출처 정책의 주요 이점을 깨달았을 때 웹은 이미 이러한 예외에 의존하고 있었습니다.

이러한 느슨한 동일 출처 정책의 보안 부작용은 두 가지 방식으로 패치되었습니다. 한 가지 방법은 서버가 지정된 출처와 리소스를 공유할 수 있도록 하는 목적을 가진 [CORS(Cross Origin Resource Sharing)](https://developer.mozilla.org/docs/Web/HTTP/CORS)라는 새로운 프로토콜을 도입하는 것이었습니다. 다른 방법은 이전 버전과의 호환성을 유지하면서 원본 간 리소스에 대한 직접 스크립트 액세스를 암시적으로 제거하는 것입니다. 이러한 출처 간 리소스를 "불투명한" 리소스라고 합니다. 예를 들어, 이것이 CORS가 이미지에 적용되지 않는 한 `CanvasRenderingContext2D`를 통한 출처 간 이미지의 픽셀 조작이 실패하는 이유입니다.

이러한 모든 정책 결정은 브라우징 컨텍스트 그룹 내에서 발생합니다.

{% Img src="image/admin/z1Gr4mmJMo383dR9FQUk.png", alt="컨텍스트 그룹 탐색", width="800", height="469" %}

오랫동안 CORS와 불투명한 리소스의 조합만으로도 브라우저를 안전하게 만들 수 있었습니다. 때때로 극단적인 경우(예: [JSON 취약점](https://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/))가 발견되어 패치가 필요했지만 전반적으로 출처 간 리소스의 원시 바이트에 대한 직접 읽기 액세스를 허용하지 않는 원칙은 성공적이었습니다.

이것은 모두 [Spectre](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability))로 변경되어 코드와 동일한 브라우징 컨텍스트 그룹에 로드되는 모든 데이터를 잠재적으로 읽을 수 있습니다. 특정 작업에 걸리는 시간을 측정하여 공격자는 CPU 캐시의 내용을 추측할 수 있으며 이를 통해 프로세스 메모리의 내용을 추측할 수 있습니다. 이러한 타이밍 공격은 플랫폼에 존재하는 낮은 세분성 타이머로 가능하지만 명시적(예: `performance.now()`) 및 암시적(예: `SharedArrayBuffer`)과 같은 높은 세분성 타이머로 속도를 높일 수 있습니다. `evil.com`이 출처 간 이미지를 포함하는 경우 Spectre 공격을 사용하여 픽셀 데이터를 읽을 수 있으므로 "불투명성"에 의존하는 보호가 효과가 없습니다.

{% Img src="image/admin/wN636enwMtBrrOfhzEoq.png", alt="Spectr", width="800", height="500" %}

이상적으로는 모든 출처 간 요청은 리소스를 소유한 서버에서 명시적으로 검사해야 합니다. 리소스 소유 서버에서 검사를 제공하지 않으면 데이터가 악의적인 행위자의 탐색 컨텍스트 그룹에 포함되지 않으므로 웹 페이지에서 수행할 수 있는 Spectre 공격의 손이 닿지 않는 곳에 있게 됩니다. 이를 출처 간 격리 상태라고 합니다. 이것이 바로 COOP+COEP에 관한 것입니다.

출처 간 격리 상태에서 요청 사이트는 덜 위험한 것으로 간주되며 `SharedArrayBuffer` , `performance.measureUserAgentSpecificMemory()` 및 Spectre와 같은 공격에 사용할 수 있는 더 나은 정밀도의 [고해상도 타이머](https://www.w3.org/TR/hr-time/)와 같은 강력한 기능을 잠금 해제합니다. 이것은 또한 `document.domain` 수정을 방지합니다.

### 출처 간 임베더 정책 {: #coep }

[COEP(Cross Origin Embedder Policy)](https://wicg.github.io/cross-origin-embedder-policy/)는 CORP 또는 CORS를 사용하여 문서 권한을 명시적으로 부여하지 않는 출처 간 리소스를 문서에서 로드하지 못하도록 합니다. 이 기능을 사용하면 문서에서 이러한 리소스를 로드할 수 없다고 선언할 수 있습니다.

{% Img src="image/admin/MAhaVZdShm8tRntWieU4.png", alt="COEP 작동 방식", width="800", height="410" %}

이 정책을 활성화하려면 문서에 다음 HTTP 헤더를 추가하세요.

```http
Cross-Origin-Embedder-Policy: require-corp
```

`require-corp` 키워드는 COEP에 대해 유일하게 허용되는 값입니다. 이렇게 하면 문서가 동일한 출처의 리소스만 로드하거나 다른 출처에서 명시적으로 로드 가능한 것으로 표시된 리소스만 로드할 수 있는 정책이 시행됩니다.

다른 출처에서 리소스를 로드할 수 있으려면 CORS(Cross Origin Resource Sharing) 또는 CORP(Cross Origin Resource Policy)를 지원해야 합니다.

### 출처 간 리소스 공유 {: #cors }

출처 간 리스소가 [출처 간 리소스 공유(CORS)](https://developer.mozilla.org/docs/Web/HTTP/CORS)를 지원하는 경우 [`crossorigin` 속성](https://developer.mozilla.org/docs/Web/HTML/Attributes/crossorigin)을 사용하여 COEP에 의해 차단되지 않고 이를 웹 페이지에 로드할 수 있습니다.

```html
<img src="https://third-party.example.com/image.jpg" crossorigin>
```

예를 들어 이 이미지 리소스가 CORS 헤더와 함께 제공되는 경우 리소스 패치 요청에서 [CORS 모드](https://developer.mozilla.org/docs/Web/API/Request/mode)를 사용하도록 <br>`crossorigin` 속성을 사용합니다. 이것은 또한 CORS 헤더를 설정하지 않는 한 이미지가 로드되는 것을 방지합니다.

`fetch()` 메서드를 통해 출처 간 데이터를 가져올 수 있습니다. 이 메서드는 서버가 [올바른 HTTP 헤더{/a1로} 응답하는 한 특별한 처리가 필요하지 않습니다.](https://developer.mozilla.org/docs/Web/HTTP/CORS#The_HTTP_response_headers)

### 출처 간 리소스 정책 {: #corp }

[CORP(출처 간 리소스 정책)](https://developer.mozilla.org/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))는 원래 다른 출처에서 리소스를 로드하지 못하도록 보호하기 위해 옵트인(opt-in)으로 도입되었습니다. COEP의 컨텍스트에서 CORP는 리소스를 로드할 수 있는 사람에 대한 리소스 소유자의 정책을 지정할 수 있습니다.

`Cross-Origin-Resource-Policy` 헤더는 다음과 같은 세 가지 가능한 값을 취합니다.

```http
Cross-Origin-Resource-Policy: same-site
```

`same-site`로 표시된 리소스는 동일한 사이트에서만 로드할 수 있습니다.

```http
Cross-Origin-Resource-Policy: same-origin
```

`same-origin`로 표시된 리소스는 동일한 출처에서만 로드할 수 있습니다.

```http
Cross-Origin-Resource-Policy: cross-origin
```

`cross-origin`로 표시된 리소스는 모든 웹사이트에서 로드할 수 있습니다([이 값](https://mikewest.github.io/corpp/#integration-fetch)은 COEP와 함께 CORP 사양에 추가되었습니다.).

{% Aside %} COEP 헤더를 추가하면 서비스 워커를 사용하여 제한을 우회할 수 없습니다. 문서가 COEP 헤더로 보호되는 경우 응답이 문서 프로세스에 들어가기 전이나 문서를 제어하는 서비스 작업자에 들어가기 전에 정책이 준수됩니다. {% endAside %}

### 출처 간 오프너 정책 {: #coop }

[COOP(Cross Origin Opener Policy)](https://github.com/whatwg/html/pull/5334/files)를 사용하면 최상위 창이 다른 최상위 창과 직접 상호 작용할 수 없도록 다른 문서를 다른 탐색 컨텍스트 그룹에 배치하여 다른 문서와 격리되도록 할 수 있습니다. 예를 들어 COOP가 있는 문서에서 팝업이 열리면 해당 `window.opener` 속성은 `null`입니다. 또한 오프너 참조 `.closed` 속성이 `true`를 반환합니다.

{% Img src="image/admin/eUu74n3GIlK1fj9ACxF8.png", alt="COOP", width="800", height="452" %}

`Cross-Origin-Opener-Policy` 헤더는 다음과 같은 세 가지 가능한 값을 취합니다.

```http
Cross-Origin-Opener-Policy: same-origin
```

`same-origin`으로 표시된 문서는 동일한 검색 컨텍스트 그룹을 명시적으로 `same-origin`으로 표시된 동일 출처 문서와 공유할 수 있습니다.

{% Img src="image/admin/he8FaRE2ef67lamrFG60.png", alt="COOP", width="800", height="507" %}

```http
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

`same-origin-allow-popups`가 있는 최상위 문서는 COOP를 설정하지 않았거나 COOP를 `unsafe-none`로 설정하여 격리를 옵트아웃(opt out)하는 팝업에 대한 참조를 유지합니다.

{% Img src="image/admin/AJdm6vFq4fQXUWOTFeFa.png", alt="COOP", width="800", height="537" %}

```http
Cross-Origin-Opener-Policy: unsafe-none
```

`unsafe-none`는 기본값이며 오프너 자체의 COOP가 `same-origin`인 경우가 아니면 문서를 오프너의 탐색 컨텍스트 그룹에 추가할 수 있습니다.

{% Aside %} [`noopener`](https://developer.mozilla.org/docs/Web/API/Window/open#Window_features) 속성은 오프너 측에서만 작동한다는 점을 제외하고 COOP에서 기대하는 것과 유사한 효과를 가집니다. (제3자가 창을 열면 창의 연결을 해제할 수 없습니다.) `window.open(url, '_blank', 'noopener')` 또는 `<a target="_blank" rel="noopener">`와 같은 작업을 수행하여 `noopener`를 첨부하는 경우에, 열려 있는 창에서 창을 의도적으로 분리할 수 있습니다.

`noopener`는 COOP로 대체될 수 있지만 COOP를 지원하지 않는 브라우저에서 웹사이트를 보호하려는 경우에는 여전히 유용합니다. {% endAside %}

## 요약 {: #summary }

`SharedArrayBuffer` , `performance.measureUserAgentSpecificMemory()` 또는 더 나은 정밀도를 가진 [고해상도 타이머](https://www.w3.org/TR/hr-time/)와 같은 강력한 기능에 대한 액세스를 보장하려면 `require-corp` 값을 포함한 COEP와 `same-origin` 값을 포함한 COOP를 모두 사용해야 한다는 점을 기억하세요. 둘 중 하나가 없으면 브라우저는 이러한 강력한 기능을 안전하게 사용할 수 있도록 충분한 격리를 보장하지 않습니다. [`self.crossOriginIsolated`](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/crossOriginIsolated)가 `true`를 반환하는지 확인하여 페이지의 상황을 확인할 수 있습니다.

[COOP 및 COEP를 사용하여 웹사이트를 "출처 간 격리"로 만들기](/coop-coep/)에서 이를 구현하는 단계를 알아보세요.

## 리소스

- [COOP 및 COEP 설명](https://docs.google.com/document/d/1zDlfvfTJ_9e8Jdc8ehuV4zMEu9ySMCiTGMS9y0GU92k/edit)
- [공유 메모리에 대한 계획된 변경 사항 - JavaScript | MDN](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer/Planned_changes)
