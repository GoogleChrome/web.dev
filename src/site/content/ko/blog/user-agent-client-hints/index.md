---
layout: post
title: User-Agent Client Hints로 사용자 개인정보 보호 및 개발자 경험 개선
subhead: User-Agent Client Hints는 Client Hints API의 새로운 확장으로, 개발자가 개인정보를 보호하고 인체 공학적인 방식으로 사용자 브라우저에 대한 정보에 액세스할 수 있도록 합니다.
authors:
  - rowan_m
  - yoavweiss
date: 2020-06-25
updated: 2021-02-12
hero: image/admin/xlg4t3uiTp0L5TBThFHQ.jpg
thumbnail: image/admin/hgxRNa56Vb9o3QRwIrm9.jpg
alt: 눈 속의 다양한 발자국. 누가 거기에 있었는지에 대한 힌트.
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% YouTube 'f0YY0o2OAKA' %}

클라이언트 힌트를 사용하여 개발자는 사용자 에이전트(UA) 문자열에서 구문 분석할 필요 없이 사용자의 장치 또는 조건에 대한 정보를 능동적으로 요청할 수 있습니다. 이 대체 경로를 제공하는 것은 결국 사용자 에이전트의 문자열 세분성을 줄이는 첫 번째 단계입니다.

User-Agent Client Hints를 대신 사용하기 위해 User-Agent 문자열 구문 분석에 의존하는 기존 기능을 업데이트하는 방법을 알아보세요.

{% Aside 'caution' %} 이미 User-Agent Client Hints를 사용하고 있다면 향후 적용될 변경 사항에 주의하세요. `Accept-CH` 토큰이 반환된 헤더와 정확히 일치하도록 헤더 형식이 변경됩니다. 이전에는 사이트가 `Sec-CH-UA-Platform` 헤더를 수신하기 위해 `Accept-CH: UA-Platform`을 보낼 수 있었고 이제는 해당 사이트에서 `Accept-CH: Sec-CH-UA-Platform`을 보내야 합니다. User-Agent Client Hints를 이미 구현했다면 안정적인 Chromium에서 변경 사항이 완전히 배포될 때까지 두 형식을 모두 전송하세요. 업데이트에 대한 [제거 의도: User-Agent Client Hint ACCEPT-CH 토큰 이름 바꾸기](https://groups.google.com/a/chromium.org/g/blink-dev/c/t-S9nnos9qU/m/pUFJb00jBAAJ)를 참조하세요. {% endAside %}

## 배경

웹 브라우저가 요청을 보낼 때 서버가 분석을 사용하고 응답을 사용자 지정할 수 있도록 여기에 브라우저와 해당 환경에 대한 정보가 포함됩니다. 이러한 사항은 1996년에 정의되었습니다(HTTP/1.0의 경우 RFC 1945). 여기에서 다음과 같은 예를 포함하는 [User-Agent 문자열에 대한 원래 정의](https://tools.ietf.org/html/rfc1945#section-10.15)를 찾을 수 있습니다.

```text
User-Agent: CERN-LineMode/2.15 libwww/2.17b3
```

이 헤더는 제품(예: 브라우저 또는 라이브러리) 및 주석(예: 버전)을 중요한 순서대로 지정하기 위한 것이었습니다.

### 사용자 에이전트 문자열의 상태

그 사이 *수십 년 동안* 이 문자열은 요청을 하는 클라이언트에 대한 다양한 추가 세부 정보를 축적했습니다(역호환성으로 인한 불필요한 잔존물도 포함). Chrome의 현재 User-Agent 문자열을 보면 다음과 같은 사실을 알 수 있습니다.

```text
Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4076.0 Mobile Safari/537.36
```

위의 문자열에는 사용자의 운영 체제 및 버전, 장치 모델, 브라우저의 브랜드 및 정식 버전에 대한 정보 등 모바일 브라우저를 추론하기에 충분한 단서들 뿐만 아니라 기록 목적으로 유지되는 다른 다양한 브라우저 참조 정보도 포함됩니다.

가능한 값이 워낙 다양한 데다가 이러한 매개변수가 조합되면 User-Agent 문자열에 개별 사용자를 고유하게 식별할 수 있는 충분한 정보가 포함될 수 있습니다. [AmIUnique](https://amiunique.org/)에서 자신의 브라우저를 테스트해 보면 **자신**의 User-Agent 문자열이 **자신**을 얼마나 가깝게 식별하는지 알 수 있습니다. 결과적인 "유사성 비율"이 낮을수록, 그리고 요청이 더 고유할수록 서버가 은밀하게 사용자를 추적하기가 더 쉽습니다.

User-Agent 문자열은 많은 합법적인 [사용 사례](https://github.com/WICG/ua-client-hints/blob/main/README.md#use-cases)를 가능하게 하며 개발자와 사이트 소유자에게 중요한 목적을 제공합니다. 그러나 은밀한 추적 방법으로부터 사용자의 개인정보를 보호하는 것도 중요하며 기본적으로 UA 정보를 보내는 것은 이러한 목표에 어긋납니다.

User-Agent 문자열과 관련하여 웹 호환성을 개선할 필요도 있습니다. 구조화되어 있지 않으므로 이를 구문 분석하면 불필요한 복잡성이 생겨나 사용자에게 피해를 주는 버그 및 사이트 호환성 문제의 원인이 됩니다. 이러한 문제는 덜 일반적인 브라우저의 사용자에게도 피해를 주는데, 사이트가 해당 구성에 대해 테스트되지 못했을 수도 있기 때문입니다.

## 새로운 User-Agent Client Hints 도입

[User-Agent Client Hints](https://github.com/WICG/ua-client-hints#explainer-reducing-user-agent-granularity)는 개인정보를 더 안전하게 지키는 방식으로 동일한 정보에 대한 액세스를 제공하므로 브라우저가 결국 모든 것을 브로드캐스트하는 User-Agent 문자열의 기본 동작을 줄일 수 있습니다. [Client Hints](https://tools.ietf.org/html/draft-ietf-httpbis-client-hints)는 서버가 브라우저에 클라이언트에 대한 데이터 집합(힌트)을 요청해야 하고 브라우저가 자체 정책 또는 사용자 구성을 적용하여 반환되는 데이터를 결정하는 모델을 실행합니다. 즉, 기본적으로 **모든** User-Agent 정보를 노출하는 대신 액세스가 이제 명시적이고 감사 가능한 방식으로 관리됩니다. 개발자는 또한 더 이상 정규 표현식이 필요 없는 더 간단한 API의 이점을 누릴 수 있습니다!

현재 Client Hints 세트는 주로 브라우저의 표시 및 연결 기능을 설명합니다. [Client Hints를 사용하여 리소스 선택 자동화](https://developer.chrome.com/blog/automating-resource-selection-with-client-hints/)에서 자세한 내용을 알아볼 수 있지만 여기에는 프로세스만 간단히 되짚어봅니다.

서버는 헤더를 통해 특정한 Client Hints를 요청합니다.

⬇️ *서버의 응답*

```text
Accept-CH: Viewport-Width, Width
```

또는 메타 태그:

```html
<meta http-equiv="Accept-CH" content="Viewport-Width, Width" />
```

그런 다음 브라우저는 후속 요청에서 다음 헤더를 다시 보내도록 선택할 수 있습니다.

⬆️ *후속 요청*

```text
Viewport-Width: 460
Width: 230
```

서버는 예를 들어 적절한 해상도로 이미지를 제공하여 응답을 변경할 수 있습니다.

{% Aside %} 초기 요청에서 Client Hints를 활성화하는 방법에 대한 논의가 진행 중이지만 이 경로를 따르기 전에 [반응형 설계](/responsive-web-design-basics) 또는 점진적 개선을 고려해야 합니다. {% endAside %}

User-Agent Client Hints는 `Accept-CH` 서버 응답 헤더를 통해 지정할 수 있는 `Sec-CH-UA` 접두사로 속성 범위를 확장합니다. 자세히 알아보기 위해 [소개 내용](https://github.com/WICG/ua-client-hints/blob/main/README.md)으로 시작하고, 이어서 [전체 제안](https://wicg.github.io/ua-client-hints/)을 살펴봅니다.

{% Aside %} Client Hints는 **보안 연결을 통해서만 전송**되므로 [사이트를 HTTPS로 마이그레이션](/why-https-matters)했는지 확인하세요. {% endAside %}

새로운 힌트 세트는 Chromium 84부터 사용할 수 있으므로 이 모든 것이 어떻게 작동하는지 살펴보겠습니다.

## Chromium 84의 User-Agent Client Hints

User-Agent Client Hint는 [호환성 문제](https://bugs.chromium.org/p/chromium/issues/detail?id=1091285)가 해결됨에 따라 Chrome Stable에서 점진적으로 지원될 것입니다. 테스트를 위해 기능을 강제 실행하려면:

- Chrome 84 **베타** 또는 이에 상응하는 버전을 사용하세요.
- `about://flags/#enable-experimental-web-platform-features` 플래그를 활성화합니다.

기본적으로, 브라우저는 브라우저 브랜드, 주/부 버전 및 클라이언트가 모바일 장치인지 여부를 나타내는 표시자를 반환합니다.

⬆️ *모든 요청*

```text
Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
```

{% Aside 'caution' %} 이러한 속성은 단일 값 이상으로 복잡하므로 목록과 부울을 나타내기 위해 [구조화된 헤더](https://httpwg.org/http-extensions/draft-ietf-httpbis-header-structure.html)가 사용됩니다. {% endAside %}

### 사용자 에이전트 응답 및 요청 헤더

<style>
.table-wrapper th:nth-of-type(1), .table-wrapper th:nth-of-type(2) {
    width: 28ch;
}

.table-wrapper td {
  padding: 4px 8px 4px 0;
}
</style>

⬇️ 응답 `Accept-CH`<br> ⬆️ 요청 헤더 | ⬆️ 요청<br> 예시 값 | 설명
--- | --- | ---
`Sec-CH-UA` | `"Chromium";v="84",`<br>`"Google Chrome";v="84"` | 브라우저 브랜드 및 주요 버전 목록
`Sec-CH-UA-Mobile` | `?1` | 브라우저가 모바일 장치에 있는지(true인 경우 `?1`) 그렇지 않은지(false의 경우 `?0`)를 나타내는 부울
`Sec-CH-UA-Full-Version` | `"84.0.4143.2"` | 브라우저의 전체 버전
`Sec-CH-UA-Platform` | `"Android"` | 장치 플랫폼, 일반적으로 운영 체제(OS)
`Sec-CH-UA-Platform-Version` | `"10"` | 플랫폼 또는 OS의 버전
`Sec-CH-UA-Arch` | `"arm"` | 장치의 기본 아키텍처입니다. 페이지 표시와 관련이 없을 수 있지만 사이트에서 기본적으로 올바른 형식으로 다운로드를 제공하려고 할 수 있습니다.
`Sec-CH-UA-Model` | `"Pixel 3"` | 장치 모델

{% Aside 'gotchas' %} 개인정보 보호와 호환성을 고려한다면 값은 비어 있거나 반환되지 않거나 다양한 값으로 채워질 수 있습니다. 이것을 [GREASE](https://wicg.github.io/ua-client-hints/#grease)라고 합니다. {% endAside %}

### 예제 교환

예제 교환은 다음과 같습니다.

⬆️ *브라우저의 초기 요청*<br> 브라우저는 사이트로부터 `/downloads` 페이지를 요청하고 기본으로 지정된 기본 User-Agent를 보냅니다.

```text
GET /downloads HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
```

⬇️ *서버의 응답*<br> 서버는 페이지를 다시 보내고 추가로 전체 브라우저 버전과 플랫폼을 요청합니다.

```text
HTTP/1.1 200 OK
Accept-CH: Sec-CH-UA-Full-Version, Sec-CH-UA-Platform
```

⬆️ *후속 요청*<br> 브라우저는 서버에 추가 정보에 대한 액세스 권한을 부여하고 이후의 모든 응답에서 추가 힌트를 다시 보냅니다.

```text
GET /downloads/app1 HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
Sec-CH-UA-Full-Version: "84.0.4143.2"
Sec-CH-UA-Platform: "Android"
```

### JavaScript API

헤더와 함께 User-Agent는 `navigator.userAgentData`를 통해 JavaScript에서 액세스할 수도 있습니다. 기본 `Sec-CH-UA` 및 `Sec-CH-UA-Mobile` 헤더 정보는 각각 `brands` 및 `mobile` 속성을 통해 액세스할 수 있습니다.

```js
// Log the brand data
console.log(navigator.userAgentData.brands);

// output
[
  {
    brand: 'Chromium',
    version: '84',
  },
  {
    brand: 'Google Chrome',
    version: '84',
  },
];

// Log the mobile indicator
console.log(navigator.userAgentData.mobile);

// output
false;
```

추가 값은 `getHighEntropyValues()` 호출을 통해 액세스됩니다. "높은 엔트로피"라는 용어는 [정보 엔트로피](https://en.wikipedia.org/wiki/Entropy_(information_theory))를 말합니다. 즉, 이러한 값이 사용자의 브라우저에 대해 드러내는 정보의 양을 나타냅니다. 추가 헤더를 요청할 때와 마찬가지로 반환되는 값은 브라우저에 달려 있습니다.

```js
// Log the full user-agent data
navigator
  .userAgentData.getHighEntropyValues(
    ["architecture", "model", "platform", "platformVersion",
     "uaFullVersion"])
  .then(ua => { console.log(ua) });

// output
{
  "architecture": "x86",
  "model": "",
  "platform": "Linux",
  "platformVersion": "",
  "uaFullVersion": "84.0.4143.2"
}
```

### 데모

[user-agent-client-hints.glitch.me](https://user-agent-client-hints.glitch.me)에서 자신의 기기에 대해 헤더와 JavaScript API를 모두 사용해 볼 수 있습니다.

{% Aside %} `about://flags/#enable-experimental-web-platform-features`가 활성화된 Chrome 84 베타 또는 이에 상응하는 버전을 사용 중인지 확인하세요. {% endAside %}

### 힌트 수명 및 재설정

`Accept-CH` 헤더를 통해 지정된 힌트는 브라우저 세션 기간 동안 또는 다른 힌트 세트가 지정될 때까지 전송됩니다.

이는 서버가 다음을 보내는 경우,

⬇️ *응답*

```text
Accept-CH: Sec-CH-UA-Full-Version
```

브라우저가 닫힐 때까지 해당 사이트에 대한 모든 요청에 대해 브라우저가 `Sec-CH-UA-Full-Version` 헤더를 보낸다는 것을 의미합니다.

⬆️ *후속 요청*

```text
Sec-CH-UA-Full-Version: "84.0.4143.2"
```

그러나 또 다른 `Accept-CH` 헤더가 수신되면 이 헤더가 브라우저가 보내는 현재 힌트를 **완전히 대체**합니다.

⬇️ *응답*

```text
Accept-CH: Sec-CH-UA-Platform
```

⬆️ *후속 요청*

```text
Sec-CH-UA-Platform: "Android"
```

이전에 요청한 `Sec-CH-UA-Full-Version`은 **전송되지 않습니다**.

`Accept-CH` 헤더를 해당 페이지에 대해 원하는 전체 힌트 세트를 지정하는 것으로 생각하는 것이 가장 좋습니다. 즉, 브라우저는 해당 페이지의 모든 하위 리소스에 대해 지정된 힌트를 보냅니다. 힌트는 다음 탐색까지 지속되지만 사이트는 힌트가 전달될 것이라고 가정하거나 의존해서는 안 됩니다.

{% Aside 'success' %} 이 정보 없이도 항상 의미 있는 경험을 제공할 수 있도록 하세요. 이는 사용자 경험을 정의하는 것이 아니라 향상시키기 위한 것입니다. 그래서 "답변"이나 "요구사항"이 아니라 "힌트"라고 불리는 것입니다! {% endAside %}

응답에서 빈 `Accept-CH`를 보내 브라우저에서 보내는 모든 힌트를 효과적으로 지우는 데도 이를 사용할 수 있습니다. 사용자가 환경 설정을 재설정하거나 사이트에서 로그아웃하는 모든 위치에 이를 추가하는 것이 좋습니다.

이 패턴은 힌트가 `<meta http-equiv="Accept-CH" …>` 태그를 통해 작동하는 방식과도 일치합니다. 요청된 힌트는 페이지에서 시작된 요청에 대해서만 전송되며 후속 탐색에는 전송되지 않습니다.

### 힌트 범위 및 교차 출처 요청

기본적으로, Client Hints는 동일한 출처 요청에 대해서만 전송됩니다. 즉, `https://example.com`에서 특정한 힌트를 요청하지만 최적화하려는 리소스는 `https://downloads.example.com`에 있는 경우, 어떤 힌트도 받을 수 **없습니다.**

교차 출처 요청에서 힌트를 이용할 수 있게 하려면 `Feature-Policy` 헤더로 각 힌트와 출처를 지정해야 합니다. 이것을 User-Agent Client Hint에 적용하려면 힌트를 소문자로 처리하고 `sec-` 접두사를 제거해야 합니다. 예를 들면 다음과 같습니다.

⬇️ *`example.com`에서 응답*

```text
Accept-CH: Sec-CH-UA-Platform, DPR
Feature-Policy: ch-ua-platform downloads.example.com;
                ch-dpr cdn.provider img.example.com
```

⬆️ *`downloads.example.com`*에 요청

```text
Sec-CH-UA-Platform: "Android"
```

⬆️ *Requests to `cdn.provider` 또는 `img.example.com`*

```text
DPR: 2
```

## User-Agent Client Hints는 어디에서 사용합니까?

간략하게 대답하자면, User-Agent Client Hints를 대신 사용하기 위해 User-Agent 헤더를 구문 분석하거나 동일한 정보(예: `navigator.userAgent`, `navigator.appVersion` 또는 `navigator.platform`)에 액세스하는 JavaScript 호출을 사용하는 모든 인스턴스를 리팩토링해야 한다는 것입니다.

여기서 한 단계 더 나아가, 사용자 에이전트 정보의 사용을 재검토하고 가능하면 이를 다른 방법으로 대체해야 합니다. 점진적 향상, 기능 감지 또는 [반응형 설계](/responsive-web-design-basics)를 사용하여 동일한 목표를 달성할 수 있는 경우가 많습니다. 사용자 에이전트 데이터에 의존할 때의 기본적인 문제는 검사하는 속성과 속성이 활성화하는 동작 간의 매핑을 항상 유지 관리해야 한다는 것입니다. 포괄적 감지가 이루어지고 최신 상태를 유지하도록 하는 데는 많은 관리 부담이 따릅니다.

이러한 주의 사항을 염두에 두고 [User-Agent Client Hints 저장소에는 사이트에 대한 몇 가지 유효한 사용 사례가 나열](https://github.com/WICG/ua-client-hints#use-cases)되어 있습니다.

## User-Agent 문자열은 어떻게 됩니까?

기존 사이트에 과도한 중단을 일으키지 않으면서 기존 User-Agent 문자열에 의해 노출되는 식별 정보의 양을 줄여 웹에서 은밀하게 추적할 수 있는 가능성을 최소화한다는 것이 계획입니다. User-Agent Client Hints를 도입하면 이제 User-Agent 문자열에 변경 사항이 적용되기 전에 새로운 기능을 이해하고 실험할 수 있습니다.

[결국](https://groups.google.com/a/chromium.org/d/msg/blink-dev/-2JIRNMWJ7s/u-YzXjZ8BAAJ), 기본 힌트에 따라 동일한 상위 수준 브라우저 및 중요한 버전 정보만 제공하면서 레거시 형식을 유지하도록 User-Agent 문자열의 정보가 축소됩니다. Chromium에서는 생태계가 새로운 User Agent Client Hints 기능을 평가할 추가 시간을 주기 위해 이러한 변경이 최소 2021년까지 연기되었습니다.

Chrome 93에서 `about://flags/#reduce-user-agent` 플래그를 활성화하여 이 버전을 테스트할 수 있습니다(참고: 이 플래그는 Chrome 84 -92 버전에서 `about://flags/#freeze-user-agent`로 명명됨). 이렇게 하면 호환성을 위해 기록 항목이 포함된 문자열이 반환되지만 세부 사항은 삭제됩니다. 예를 들면 다음과 같습니다.

```text
Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.0.0 Mobile Safari/537.36
```

*사진 제공: [Unsplash](https://unsplash.com/photos/m9qMoh-scfE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)에서 [Sergey Zolkin](https://unsplash.com/@szolkin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*
