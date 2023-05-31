---
title: SameSite 쿠키 레서피
subhead: SameSite 특성 동작에 대한 향후 변경 사항에 대비하기 위해 사이트의 쿠키를 업데이트하십시오.
authors:
  - rowan_m
date: 2019-10-30
updated: 2020-05-28
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/5f56hyvtMT6Dymo839tc.png
description: |2

  새로운 SameSite=None 속성 값의 도입으로 사이트는 이제

  사이트 간 사용을 위해 쿠키를 명시적으로 표시합니다. 브라우저는 다음으로 이동합니다.

  SameSite 속성이 없는 쿠키는 기본적으로 자사로 작동합니다.

  현재 열려 있는 행동보다 더 안전하고 개인 정보를 보호하는 옵션입니다.

  자사 및 타사를 보장하기 위해 쿠키를 마크업하는 방법 알아보기

  이 변경 사항이 적용되면 쿠키는 계속 작동합니다.
tags:
  - blog
  - security
  - cookies
  - chrome-80
  - test-post
feedback:
  - api
---

{% Aside %} 이 문서는 `SameSite` 쿠키 속성 변경에 대한 시리즈의 일부입니다.

- [SameSite 쿠키 설명](/samesite-cookies-explained/)
- [SameSite 쿠키 레서피](/samesite-cookie-recipes/)
- [계획적인 Same-Site](/schemeful-samesite) {% endAside %}

[Chrome](https://www.chromium.org/updates/same-site) , [Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ) , [Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ) 및 기타는 IETF 제안인 [Incrementally Better Cookies에](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00) 따라 기본 동작을 다음과 같이 변경합니다.

- `SameSite` 속성이 없는 쿠키 `SameSite=Lax`로 처리됩니다. 즉, 기본 동작은 쿠키를 당사자 컨텍스트**로만** 제한하는 것입니다.
- 교차 사이트 사용을 위한 쿠키에서 `SameSite=없음; 보안`을 지정**해야** 타사 컨텍스트에 포함을 사용하도록 설정합니다.

이 기능은 [Chrome 84 안정 버전 이후의 기본 동작](https://blog.chromium.org/2020/05/resuming-samesite-cookie-changes-in-july.html)입니다. 아직 업데이트하지 않았다면 향후 차단되지 않도록 타사 쿠키의 속성을 업데이트해야 합니다.

## 브라우저 간 지원

MDN의 [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) [페이지의 브라우저 호환성](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie#Browser_compatibility) 섹션을 참조하십시오.

## 교차 사이트 또는 타사 쿠키 사용 사례

타사 컨텍스트에서 쿠키를 보내야 하는 일반적인 사용 사례 및 패턴이 많이 있습니다. 이러한 사용 사례 중 하나를 제공하거나 이에 의존하는 경우 서비스가 계속해서 올바르게 작동하도록 귀하 또는 제공자가 쿠키를 업데이트하고 있는지 확인하십시오.

### `<iframe>` 내의 콘텐츠

`<iframe>`에 표시된 다른 사이트의 콘텐츠는 타사 컨텍스트에 있습니다. 표준 사용 사례는 다음과 같습니다.

- 비디오, 지도, 코드 샘플 및 소셜 게시물과 같은 다른 사이트에서 공유된 포함된 콘텐츠.
- 결제, 캘린더, 예약 및 예약 기능과 같은 외부 서비스의 위젯.
- 덜 명확한 `<iframes>`을 생성하는 소셜 버튼 또는 사기 방지 서비스와 같은 위젯.

쿠키는 무엇보다도 세션 상태를 유지하고, 일반 기본 설정을 저장하고, 통계를 활성화하거나, 기존 계정이 있는 사용자를 위해 콘텐츠를 개인화하는 데 사용될 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fTUQP4SffHHcexSipvlz.png", alt="포함된 콘텐츠의 URL이 페이지의 URL과 일치하지 않는 브라우저 창의 다이어그램입니다.", width="468", height="383 ", 스타일="최대 너비: 35vw;" %}<figcaption> 포함된 콘텐츠가 최상위 검색 컨텍스트와 동일한 사이트에서 제공되지 않으면 타사 콘텐츠입니다.</figcaption></figure>

또한 웹은 본질적으로 구성 가능하므로 `<iframes>`는 최상위 또는 자사 컨텍스트에서도 볼 수 있는 콘텐츠를 포함하는 데 사용됩니다. 해당 사이트에서 사용하는 모든 쿠키는 사이트가 프레임 내에 표시될 때 타사 쿠키로 간주됩니다. 쿠키를 사용하여 기능을 수행하면서 다른 사람이 쉽게 포함할 수 있는 사이트를 만드는 경우 사이트 간 사용으로 표시되어 있는지 또는 쿠키 없이도 정상적으로 대체할 수 있는지 확인해야 합니다.

### 사이트 전체에서 "안전하지 않은" 요청

여기서 "안전하지 않음"이 약간 우려되는 것처럼 들릴 수 있지만 이는 상태를 변경하려는 모든 요청을 나타냅니다. 웹에서 주로 POST 요청에 해당합니다. `SameSite=Lax`로 표시된 쿠키는 안전한 최상위 탐색(예: 링크를 클릭하여 다른 사이트로 이동)에서 전송됩니다. 그러나 POST를 통해 다른 사이트로 `<form>` 제출과 같은 것은 쿠키를 포함하지 않습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vddDg7f9Gp93OgaqWwHu.png", alt="한 페이지에서 다른 페이지로 이동하는 요청의 다이어그램입니다.", width="719", height="382", style="max-width: 35vw;" %}<figcaption> 들어오는 요청이 "안전한" 방법을 사용하는 경우 쿠키가 전송됩니다.</figcaption></figure>

이 패턴은 사용자를 원격 서비스로 리디렉션하여 반환하기 전에 일부 작업(예: 타사 ID 공급자로 리디렉션)을 수행하도록 리디렉션할 수 있는 사이트에 사용됩니다. 사용자가 사이트를 떠나기 전에 [CSRF(Cross Site Request Forgery)](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) 공격을 완화하기 위해 반환 요청에서 이 토큰을 확인할 수 있다는 기대와 함께 단일 사용 토큰이 포함된 쿠키가 설정됩니다. 반환 요청이 POST를 통해 오는 경우 쿠키를 `SameSite=None; Secure`로 설정해야 합니다.

### 원격 리소스

`<img>` 태그, `<script>` 태그 등에서 요청과 함께 보낼 쿠키에 의존할 수 있습니다. 일반적인 사용 사례에는 픽셀 추적 및 콘텐츠 개인 설정이 포함됩니다.

`fetch` 또는 `XMLHttpRequest`에 의해 JavaScript에서 시작된 요청에도 적용됩니다. `fetch()` [`credentials: 'include'` 옵션](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch#Sending_a_request_with_credentials_included) 과 함께 호출되면 해당 요청에서 쿠키가 예상될 수 있다는 좋은 표시입니다. `XMLHttpRequest` `true`로 설정되는 [`withCredentials` 속성의](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/withCredentials) 인스턴스를 찾아야 합니다. 이는 해당 요청에서 쿠키가 예상될 수 있음을 나타내는 좋은 표시입니다. 이러한 쿠키는 사이트 간 요청에 포함되도록 적절하게 표시되어야 합니다.

### WebView 내의 콘텐츠

플랫폼별 앱의 WebView는 브라우저에서 구동되며 동일한 제한 사항이나 문제가 적용되는지 테스트해야 합니다. Android에서 WebView가 Chrome에 의해 구동되는 경우 새로운 기본값은 Chrome 84에 즉시 적용되지 **않습니다**. 그러나 향후에 적용할 의도이므로 여전히 테스트하고 이에 대비해야 합니다. 또한 Android에서는 플랫폼별 앱이 [CookieManager API](https://developer.android.com/reference/android/webkit/CookieManager)를 통해 직접 쿠키를 설정할 수 있습니다. 헤더 또는 JavaScript를 통해 설정된 쿠키와 마찬가지로 교차 사이트를 위한 경우 `SameSite=None; Secure`를 포함하도록 고려하십시오.

## 지금 바로 `SameSite`를 구현하는 방법

자사 컨텍스트에서만 필요한 쿠키의 경우 필요에 따라 `SameSite=Lax` 또는 `SameSite=Strict`로 표시하는 것이 좋습니다. 아무 것도 하지 않고 브라우저가 기본값을 적용하도록 선택할 수도 있지만, 이는 브라우저 전반에 걸쳐 일관되지 않은 동작과 각 쿠키에 대한 잠재적인 콘솔 경고의 위험이 있습니다.

```text
Set-Cookie: first_party_var=value; SameSite=Lax
```

타사 컨텍스트에 필요한 쿠키의 경우 `SameSite=None; Secure`로 표기되었는지 확인해야 합니다. 두 속성이 함께 필요하다는 점을 유념하십시오. `Secure` 없이 `None`을 지정하면 쿠키가 거부됩니다. 하지만 브라우저 구현에는 상호 호환되지 않는 차이점이 있으므로 아래의 [호환되지 않는 클라이언트 처리](#handling-incompatible-clients)에 설명된 완화 전략 중 일부를 사용해야 할 수도 있습니다.

```text
Set-Cookie: third_party_var=value; SameSite=None; Secure
```

### 호환되지 않는 클라이언트 처리

`None`을 포함하고 기본 동작을 업데이트하는 이러한 변경 사항은 아직 비교적 새로운 것이기 때문에 이러한 변경 사항을 처리하는 방법에 대해 브라우저 간에 불일치가 있습니다. 현재 알려진 문제에 대해서는 [chromium.org의 업데이트](https://www.chromium.org/updates/same-site/incompatible-clients) 페이지를 참조할 수 있지만 이것이 완전하다고 말할 수는 없습니다. 이것이 이상적이지는 않지만 이 과도기 단계에서 사용할 수 있는 해결 방법이 있습니다. 그러나 일반적인 규칙은 호환되지 않는 클라이언트를 특수한 경우로 취급하는 것입니다. 최신 규칙을 구현하는 브라우저에 대해 예외를 생성하지 마십시오.

첫 번째 옵션은 새 쿠키와 이전 스타일 쿠키를 모두 설정하는 것입니다.

```text
Set-cookie: 3pcookie=value; SameSite=None; Secure
Set-cookie: 3pcookie-legacy=value; Secure
```

새로운 동작을 구현하는 브라우저는 `SameSite` 값으로 쿠키를 설정하지만 다른 브라우저는 쿠키를 무시하거나 잘못 설정할 수 있습니다. 그러나 동일한 브라우저는 `3pcookie-legacy` 쿠키를 설정합니다. 포함된 쿠키를 처리할 때 사이트는 먼저 새 스타일 쿠키의 존재를 확인하고 발견되지 않으면 기존 쿠키로 대체해야 합니다.

아래 예제는 [Express 프레임워크](https://expressjs.com)와 [쿠키 파서](https://www.npmjs.com/package/cookie-parser) 미들웨어를 사용하여 Node.js에서 이 작업을 수행하는 방법을 보여줍니다.

```javascript
const express = require('express');
const cp = require('cookie-parser');
const app = express();
app.use(cp());

app.get('/set', (req, res) => {
  // Set the new style cookie
  res.cookie('3pcookie', 'value', { sameSite: 'none', secure: true });
  // And set the same value in the legacy cookie
  res.cookie('3pcookie-legacy', 'value', { secure: true });
  res.end();
});

app.get('/', (req, res) => {
  let cookieVal = null;

  if (req.cookies['3pcookie']) {
    // check the new style cookie first
    cookieVal = req.cookies['3pcookie'];
  } else if (req.cookies['3pcookie-legacy']) {
    // otherwise fall back to the legacy cookie
    cookieVal = req.cookies['3pcookie-legacy'];
  }

  res.end();
});

app.listen(process.env.PORT);
```

단점은 여기에 모든 브라우저를 포함하도록 중복 쿠키를 설정하는 것과 쿠키를 설정하고 읽는 시점에서 모두 변경해야 한다는 것입니다. 그러나 이 접근 방식은 동작에 관계없이 모든 브라우저를 포괄해야 하며 타사 쿠키가 이전과 같이 계속 작동하도록 해야 합니다.

`Set-Cookie` 헤더를 보내는 시점에서 사용자 에이전트 문자열을 통해 클라이언트를 감지하도록 선택할 수 있습니다. [호환되지 않는 클라이언트 목록](https://www.chromium.org/updates/same-site/incompatible-clients)을 참조한 다음 플랫폼에 적합한 라이브러리(예: Node.js의 [ua-parser-js](https://www.npmjs.com/package/ua-parser-js) 라이브러리)를 사용하십시오. 사용자 에이전트 감지를 처리할 라이브러리를 찾는 것이 좋습니다. 이러한 정규식을 직접 작성하고 싶지 않을 가능성이 높기 때문입니다.

이 접근 방식의 이점은 쿠키를 설정하는 시점에서 한 번만 변경하면 된다는 것입니다. 그러나 여기서 필요한 경고는 사용자 에이전트 스니핑이 본질적으로 취약하고 영향을 받는 모든 사용자를 포착하지 못할 수 있다는 것입니다.

{% Aside %}

어떤 옵션을 선택하든 기존 경로를 통과하는 트래픽 수준을 기록하는 방법이 있는지 확인하는 것이 좋습니다. 해당 수준이 사이트에 허용되는 임계값 아래로 떨어지면 이 해결 방법을 제거하도록 미리 알림이나 경고가 있는지 확인하십시오.

{% endAside %}

## 언어, 라이브러리 및 프레임워크에서 `SameSite=None` 지원

대부분의 언어와 라이브러리는 쿠키에 대해 `SameSite` 특성을 지원하지만, `SameSite=None` 추가하는 것은 여전히 상대적으로 새로운 것이므로 현재로서는 일부 표준 동작을 해결해야 할 수도 있습니다. 이는 GitHub의 <a href="https://github.com/GoogleChromeLabs/samesite-examples" data-md-type="link">`SameSite`</a> 예시 리포지토리에 기록되어 있습니다.

## 지원 받기

쿠키는 도처에 있으며 특히 사이트 간 사용 사례를 혼합하여 설정하고 사용하는 사이트를 완전히 감사하는 경우는 드뭅니다. 문제가 발생하면 누구나 처음으로 문제를 겪을 수 있으므로 주저하지 말고 문의하십시오.

- [GitHub의 `SameSite` 예시 리포지토리](https://github.com/GoogleChromeLabs/samesite-examples)에서 문제를 제기하십시오.
- [StackOverflow의 "samesite" 태그](https://stackoverflow.com/questions/tagged/samesite)에 대한 질문을 블로그에 게시하십시오.
- Chromium의 동작과 관련된 문제의 경우 [[SameSite 쿠키] 문제 템플릿](https://bit.ly/2lJMd5c)을 통해 버그를 제기하세요.
- [`SameSite` 업데이트 페이지](https://www.chromium.org/updates/same-site)에서 Chrome의 진행 상황을 따르십시오.

