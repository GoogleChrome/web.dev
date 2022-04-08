---
title: Fetch Metadata로 웹 공격으로부터 리소스 보호
subhead: CSRF, XSSI 및 교차 출처 정보 누출을 방지합니다.
authors:
  - lwe
date: 2020-06-04
updated: 2020-06-10
hero: image/admin/El8ytnIgMDWVzdsglcfv.jpg
alt: 리소스 격리 정책과 관련된 Python 코드의 스크린샷.
description: Fetch Metadata는 서버가 교차 출처 공격으로부터 자신을 보호할 수 있도록 설계된 새로운 웹 플랫폼 기능입니다.
tags:
  - blog
  - security
feedback:
  - api
---

## 웹 리소스를 격리해야 하는 이유는 무엇인가요?

여러 웹 애플리케이션은 [사이트 간 요청 위조](https://portswigger.net/web-security/csrf) (CSRF), [사이트 간 스크립트 포함](https://portswigger.net/research/json-hijacking-for-the-modern-web) (XSSI), 타이밍 공격, [교차 출처 정보 누출](https://arxiv.org/pdf/1908.02204.pdf) 또는 추측성 실행 사이드 채널 ([Spectre](https://developer.chrome.com/blog/meltdown-spectre/)) 공격과 같은 [교차 출처](/same-site-same-origin/#%22same-origin%22-and-%22cross-origin%22) 공격에 취약합니다.

[Fetch Metadata](https://www.w3.org/TR/fetch-metadata/) 요청 헤더를 통해 강력한 심층 방어 메커니즘(리소스 격리 정책)을 배포하여 이러한 일반적인 교차 출처 공격으로부터 애플리케이션을 보호할 수 있습니다.

특정 웹 애플리케이션에 의해 노출된 리소스는 다른 웹사이트가 아닌 애플리케이션 자체에 의해서만 로드되는 것이 일반적입니다. 이러한 경우 Fetch Metadata 요청 헤더를 기반으로 리소스 격리 정책을 배포하는 것은 그리 힘들지 않으며 동시에 사이트 간 공격으로부터 애플리케이션을 보호합니다.

## 브라우저 호환성 {: #compatibility }

Fetch Metadata 요청 헤더는 Chrome 76 및 기타 Chromium 기반 브라우저에서 지원되며 Firefox에서 개발 중입니다. 최신 브라우저 지원 정보는 [브라우저 호환성](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site#Browser_compatibility)을 참조하십시오.

## 배경

웹은 기본적으로 열려 있고 애플리케이션 서버는 외부 애플리케이션에서 발생하는 통신으로부터 스스로를 쉽게 보호할 수 없기 때문에 많은 사이트 간 공격이 가능합니다. 일반적인 교차 출처 공격은 공격자가 사용자를 자신이 제어하는 사이트로 유인한 다음 사용자가 로그인한 서버에 양식을 제출하는 CSRF(교차 사이트 요청 위조)입니다. 서버는 요청이 다른 도메인(교차 사이트)에서 시작되었는지 알 수 없고 브라우저는 자동으로 쿠키를 교차 사이트 요청에 첨부하므로 서버가 사용자를 대신하여 공격자가 요청한 작업을 실행합니다.

XSSI(교차 사이트 스크립트 포함) 또는 교차 출처 정보 누출과 같은 다른 교차 사이트 공격은 본질적으로 CSRF와 유사하며 공격자가 관리하는 문서에서 공격 대상이 된 애플리케이션의 리소스를 로드하고 공격 대상이 된 애플리케이션에 대한 정보를 누출하는 데 의존합니다. 애플리케이션은 신뢰할 수 있는 요청과 신뢰할 수 없는 요청을 쉽게 구별할 수 없으므로 악의적인 사이트 간 트래픽을 삭제할 수 없습니다.

{% Aside 'gotchas' %} 위에서 설명한 리소스에 대한 공격 외에도 *창 참조*로 인해 출처 간 정보 누출 및 Spectre 공격이 발생할 수 있습니다. `Cross-Origin-Opener-Policy` 응답 헤더를 `same-origin`으로 설정하여 이를 방지할 수 있습니다. {% endAside %}

## 메타데이터 가져오기 도입 {: #introduction }

Fetch Metadata 요청 헤더는 서버가 교차 출처 공격으로부터 스스로를 방어할 수 있도록 설계된 새로운 웹 플랫폼 보안 기능입니다. `Sec-Fetch-*` 헤더 집합에서 HTTP 요청 컨텍스트에 대한 정보를 제공함으로써 응답 서버가 요청을 처리하기 전에 보안 정책을 적용할 수 있습니다. 개발자는 이를 통해 요청이 생성된 방식과 사용될 컨텍스트에 따라 요청을 수락하거나 거부할지 여부를 결정할 수 있으므로 자체 애플리케이션에서 만든 합법적인 요청에만 응답할 수 있습니다.

{% Compare 'better', 'Same-Origin' %} {% CompareCaption %} 자체 서버(동일 출처)에서 제공하는 사이트에서 시작된 요청은 계속 작동합니다. {% endCompareCaption %}

<!--lint disable no-literal-urls-->

{% Img src="image/admin/aRsy2xULTR4TM2sMMsbQ.png", alt="브라우저가 HTTP 요청 헤더 'Sec Fetch-Site: same-origin'을 전송하도록 JavaScript에서 https://site.example/foo.json 리소스에 대한 https://site.example의 가져오기 요청", width="800", height="176" %}

<!--lint enable no-literal-urls-->

{% endCompare %}

{% Compare 'worse', 'Cross-site' %} {% CompareCaption %} `Sec-Fetch-*` 헤더가 제공하는 HTTP 요청의 추가 컨텍스트 때문에 서버에서 악의적인 사이트 간 요청을 거부할 수 있습니다. {% endCompareCaption %}

<!--lint disable no-literal-urls-->

{% Img src="image/admin/xY4yB36JqsVw62wNMIWt.png", alt="브라우저가 HTTP 요청 헤더 'Sec-Fetch-Site: cross-site'를 전송하도록 img 요소의 src 속성을 'https://site.example/foo.json'으로 설정하는 https://evil.example에 대한 이미지.", width="800", height="171" %}

<!--lint enable no-literal-urls-->

{% endCompare %}

### `Sec-Fetch-Site`

`Sec-Fetch-Site`는 요청을 전송한 [사이트](/same-site-same-origin)를 서버에 알려줍니다. 브라우저는 이 값을 다음 중 하나로 설정합니다.

- 요청이 자체 애플리케이션(예: `site.example` )에 의해 이루어진 경우 `same-origin`
- 사이트의 하위 도메인에서 요청한 경우(예: `bar.site.example`) `same-site`
- 사용자 에이전트와 사용자의 상호 작용(예: 책갈피 클릭)으로 인해 요청이 명시적으로 발생한 경우 `none`
- 다른 웹사이트에서 요청을 전송한 경우(예: `evil.example`) `cross-site`

### `Sec-Fetch-Mode`

`Sec-Fetch-Mode`는 요청 [모드](https://developer.mozilla.org/docs/Web/API/Request/mode)를 나타냅니다. 이는 대략적으로 요청 유형에 해당하며 이를 사용하면 탐색 요청과 리소스 로드를 구분할 수 있습니다. 예를 들어, `navigate` 대상은 최상위 탐색 요청을 나타내는 반면 `no-cors`는 이미지 로드와 같은 리소스 요청을 나타냅니다.

### `Sec-Fetch-Dest`

`Sec-Fetch-Dest`는 요청의 [대상](https://developer.mozilla.org/docs/Web/API/Request/destination)을 노출합니다(예: `script` 또는 `img` 태그로 인해 브라우저가 리소스를 요청한 경우).

## 교차 출처 공격으로부터 보호하기 위해 Fetch Metadata를 사용하는 방법

이러한 요청 헤더가 제공하는 추가 정보는 매우 단순하지만 추가 컨텍스트를 통해 단 몇 줄의 코드로 서버 측에서 리소스 격리 정책이라고도 하는 강력한 보안 로직을 구축할 수 있습니다.

### 리소스 격리 정책 구현

리소스 격리 정책은 외부 웹사이트에서 리소스를 요청하는 것을 방지합니다. 이러한 트래픽을 차단하면 CSRF, XSSI, 타이밍 공격 및 교차 출처 정보 누출과 같은 일반적인 교차 사이트 웹 취약점을 완화할 수 있습니다. 이러한 정책은 애플리케이션의 모든 엔드포인트에 대해 활성화할 수 있으며 HTTP `GET` 요청을 통한 직접 탐색 뿐만 아니라 자체 애플리케이션에서 시작되는 모든 리소스 요청을 허용합니다. 교차 사이트 컨텍스트에서 로드되어야 하는 엔드포인트(예: CORS를 사용하여 로드된 엔드포인트)는 이 로직에서 제외될 수 있습니다.

#### 1단계: Fetch Metadata를 전송하지 않는 브라우저의 요청 허용

모든 브라우저가 Fetch Metadata를 지원하는 것은 아니므로 `sec-fetch-site`의 존재 여부를 확인하여 `Sec-Fetch-*` 헤더를 설정하지 않는 요청을 허용해야 합니다.

{% Aside %} 다음 예는 모두 Python 코드에 관한 것입니다. {% endAside %}

```python
if not req['sec-fetch-site']:
  return True  # Allow this request
```

{% Aside 'caution' %} Fetch Metadata는 Chromium 기반 브라우저에서만 지원되므로 기본 방어선이 아닌 [심층 방어 수단](https://static.googleusercontent.com/media/landing.google.com/en//sre/static/pdf/Building_Secure_and_Reliable_Systems.pdf#page=181)으로 사용해야 합니다. {% endAside %}

#### 2단계: 동일한 사이트 및 브라우저 시작 요청 허용

교차 출처 컨텍스트(예: `evil.example`)에서 시작되지 않은 모든 요청이 허용됩니다. 특히 다음과 같은 요청이 이에 해당합니다.

- 자체 애플리케이션에서 시작하는 요청(예: `site.example`이 `site.example/foo.json`을 항상 허용하도록 요청하는 동일한 출처 요청).
- 하위 도메인에서 시작하는 요청.
- 사용자 에이전트와 사용자의 상호 작용(예: 직접 탐색 또는 책갈피 클릭 등)으로 인해 명시적으로 발생하는 요청.

```python
if req['sec-fetch-site'] in ('same-origin', 'same-site', 'none'):
  return True  # Allow this request
```

{% Aside 'gotchas' %} 하위 도메인을 완전히 신뢰할 수 없는 경우, `same-site` 값을 제거하여 하위 도메인의 요청을 차단하여 정책을 더 엄격하게 만들 수 있습니다. {% endAside %}

#### 3단계: 간단한 최상위 탐색 및 iframe 허용

사이트가 다른 사이트에서 계속 링크될 수 있도록 하려면 단순( `HTTP GET`) 최상위 탐색 기능을 허용해야 합니다.

```python
if req['sec-fetch-mode'] == 'navigate' and req.method == 'GET'
  # <object> and <embed> send navigation requests, which we disallow.
  and req['sec-fetch-dest'] not in ('object', 'embed'):
    return True  # Allow this request
```

{% Aside 'gotchas' %} 위의 로직은 애플리케이션의 엔드포인트가 다른 웹사이트에서 리소스로 사용되지 않도록 보호하지만 최상위 탐색 및 임베딩(예: `<iframe>`에서 로드)을 허용합니다. 보안을 더욱 강화하기 위해 Fetch Metadata 헤더를 사용하여 사이트 간 탐색을 허용된 페이지 집합으로만 제한할 수 있습니다. {% endAside %}

#### 4단계: 사이트 간 트래픽을 제공하기 위한 엔드포인트 선택 해제(선택 사항)

어떤 경우에는 애플리케이션이 사이트 간에 로드되도록 의도된 리소스를 제공할 수 있습니다. 이러한 리소스는 경로별 또는 엔드포인트별로 제외되어야 합니다. 이러한 엔드포인트의 예는 다음과 같습니다.

- 교차 출처에 액세스해야 하는 엔드포인트: 애플리케이션이 `CORS` 활성화된 엔드포인트를 제공하는 경우 이러한 엔드포인트에 대한 사이트 간 요청이 여전히 가능한지 확인하기 위해 리소스 격리에서 명시적으로 선택 해제해야 합니다.
- 공개 리소스(예: 이미지, 스타일 등): 다른 사이트에서 교차 출처로 로드할 수 있어야 하는 모든 공개 및 비인증 리소스도 면제될 수 있습니다.

```python
if req.path in ('/my_CORS_endpoint', '/favicon.png'):
  return True
```

{% Aside 'caution' %} 이러한 보안 제한에서 애플리케이션의 일부를 선택 해제하기 전에 해당 항목이 정적이며 민감한 사용자 정보를 포함하고 있지 않는지 확인하세요. {% endAside %}

#### 5단계: 탐색이 아닌 사이트 간 요청을 모두 거부합니다

다른 **사이트 간** 요청은 이 리소스 격리 정책에 의해 거부되므로 일반적인 사이트 간 공격으로부터 애플리케이션을 보호합니다.

{% Aside 'gotchas' %} 기본적으로 정책을 위반하는 요청은 `HTTP 403` 응답으로 거부되어야 하지만 사용 사례에 따라 다음과 같은 다른 작업을 고려할 수도 있습니다.

- **로그 전용 위반**. 이는 정책의 호환성을 테스트하고 선택 해제해야 할 수 있는 엔드포인트를 찾을 때 특히 유용합니다.
- **요청 수정**. 특정 시나리오에서는 랜딩 페이지로 리디렉션하고 인증 자격 증명(예: 쿠키)을 삭제하는 것과 같은 다른 작업을 수행하는 것이 좋습니다. 하지만 이는 Fetch Metadata 기반 정책의 보호 기능을 약화시킬 수 있습니다. {% endAside %}

**예:** 다음 코드는 서버에서 또는 잠재적으로 악의적인 사이트 간 리소스 요청을 거부하는 미들웨어로 강력한 리소스 격리 정책을 완벽하게 구현하는 동시에 간단한 탐색 요청을 허용하는 방법을 보여줍니다.

```python
# Reject cross-origin requests to protect from CSRF, XSSI, and other bugs
def allow_request(req):
  # Allow requests from browsers which don't send Fetch Metadata
  if not req['sec-fetch-site']:
    return True

  # Allow same-site and browser-initiated requests
  if req['sec-fetch-site'] in ('same-origin', 'same-site', 'none'):
    return True

  # Allow simple top-level navigations except <object> and <embed>
  if req['sec-fetch-mode'] == 'navigate' and req.method == 'GET'
    and req['sec-fetch-dest'] not in ('object', 'embed'):
      return True

  # [OPTIONAL] Exempt paths/endpoints meant to be served cross-origin.
  if req.path in ('/my_CORS_endpoint', '/favicon.png'):
    return True

  # Reject all other requests that are cross-site and not navigational
  return False
```

### 리소스 격리 정책 배포

1. 위의 코드 조각과 같은 모듈을 설치하여 사이트가 어떻게 작동하는지 기록하고 모니터링하며 제한 사항이 합법적인 트래픽에 영향을 미치지 않는지 확인합니다.
2. 합법적인 출처 간 엔드포인트를 제외하여 잠재적 위반을 수정합니다.
3. 비준수 요청을 삭제하여 정책을 시행합니다.

### 정책 위반 식별 및 수정

먼저 서버 측 코드의 보고 모드에서 정책을 활성화하여 부작용 없는 방식으로 정책을 테스트하는 것이 좋습니다. 대안으로, 미들웨어에서 이 로직을 구현하거나 정책이 프로덕션 트래픽에 적용될 때 생성할 수 있는 위반 사례를 기록하는 역방향 프록시에서 구현할 수 있습니다.

Google에서 Fetch Metadata 리소그 격리 정책을 배포한 경험에 따르면 대부분의 애플리케이션은 기본적으로 이러한 정책과 호환되며 사이트 간 트래픽을 허용하기 위해 엔드포인트를 제외할 필요가 거의 없습니다.

### 리소스 격리 정책 시행

정책이 합법적인 프로덕션 트래픽에 영향을 미치지 않는지 확인한 이후에는 제한을 적용하여 다른 사이트에서 리소스를 요청할 수 없도록 하고 사이트 간 공격으로부터 사용자를 보호할 준비가 된 것입니다.

{% Aside 'caution' %} 민감한 타이밍 정보가 노출되지 않도록 인증을 확인하거나 다른 요청을 처리하기 전에 유효하지 않은 요청을 거부해야 합니다. {% endAside %}

## 추가 참고 자료

- [W3C 페치 메타데이터 요청 헤더 사양](https://www.w3.org/TR/fetch-metadata/)
- [메타데이터 플레이그라운드 가져오기](https://secmetadata.appspot.com/)
- [Google I/O 토크: 최신 플랫폼 기능으로 웹 앱 보호](https://webappsec.dev/assets/pub/Google_IO-Securing_Web_Apps_with_Modern_Platform_Features.pdf)(슬라이드)

{% YouTube id='DDtM9caQ97I', startTime='1856' %}
