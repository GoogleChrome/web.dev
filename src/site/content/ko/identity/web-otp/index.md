---
layout: post
title: WebOTP API로 웹에서 전화번호 확인
subhead: SMS를 통해 수신한 OTP로 사용자 지원
authors:
  - agektmr
date: 2019-10-07
updated: 2021-06-04
hero: image/admin/iVHsQYbBj8qNYZeSZKwK.png
alt: OTP를 사용하여 웹 앱에 로그인하는 여성의 그림.
description: SMS를 통해 전송된 OTP를 찾고, 기억하고, 입력하는 것은 번거롭습니다. WebOTP API는 사용자의 OTP 워크플로를 단순화합니다.
tags:
  - identity
  - capabilities
feedback:
  - api
---

{% Aside 'gotchas' %} WebOTP API를 포함하여 일반적인 SMS OTP 양식 모범 사례를 더 자세히 알아보려면 [SMS OTP 양식 모범 사례](/sms-otp-form)를 확인하세요. {% endAside %}

## WebOTP API란 무엇입니까?

오늘날 전 세계 대부분의 사람들은 모바일 장치를 소유하고 있으며 개발자는 일반적으로 서비스 사용자의 식별자로 전화번호를 사용합니다.

전화번호를 인증하는 방법에는 여러 가지가 있지만 가장 일반적인 방법 중 하나는 무작위로 생성한 OTP(일회성 비밀번호)를 SMS로 전송하는 것입니다. 이 코드를 개발자의 서버로 다시 보내는 것을 통해 전화번호의 제어를 입증합니다.

이 아이디어는 다음을 달성하기 위해 이미 많은 시나리오에 배포되어 있습니다.

- **사용자의 식별자로서의 전화번호.** 새로운 서비스에 가입할 때 일부 웹사이트에서는 이메일 주소 대신 전화번호를 요구하고 이를 계정 식별자로 사용합니다.
- **2단계 인증.** 로그인할 때 웹사이트에서 추가 보안을 위해 비밀번호 또는 기타 지식 팩터 외에 SMS를 통해 전송된 일회성 코드를 요청합니다.
- **결제 확인.** 사용자가 결제할 때 SMS를 통해 전송된 일회성 코드를 요청하면 사용자의 의도를 확인하는 데 도움이 될 수 있습니다.

현재의 프로세스는 사용자에게 마찰을 일으킵니다. SMS 메시지에서 OTP를 찾은 다음 복사하여 양식에 붙여넣는 작업은 번거로우며, 중요한 사용자 여정에서 전환율을 낮춥니다. 다수의 글로벌 개발자들은 오랫동안 웹에서 이를 개선하길 요청해왔습니다. Android에는 [정확히 이 작업을 수행하는 API](https://developers.google.com/identity/sms-retriever/)가 있습니다. [iOS](https://developer.apple.com/documentation/security/password_autofill/about_the_password_autofill_workflow)와 [Safari도](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element) 마찬가지입니다.

WebOTP API를 사용하면 앱이 앱 도메인에 바인딩된 특수 형식의 메시지를 받을 수 있습니다. 이를 통해 SMS 메시지에서 프로그래밍 방식으로 OTP를 얻고 사용자의 전화번호를 보다 쉽게 확인할 수 있습니다.

{% Aside 'warning' %} 공격자는 SMS를 스푸핑하고 개인의 전화번호를 도용할 수 있습니다. 이동통신사는 계정이 폐쇄된 후 전화번호를 재활용하여 새 사용자에게 부여할 수도 있습니다. SMS OTP는 위의 사용 사례에서 전화번호를 확인하는 데 유용하지만, 이러한 사용자에 대한 새 세션을 설정하기 위해 멀티팩터 및 [Web Authentication(웹 인증) API](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API)와 같이 더 강력한 인증 형식을 사용하는 것이 좋습니다. {% endAside %}

## 실제 작동 보기

사용자가 웹사이트에서 전화번호를 확인하려고 한다고 가정해 보겠습니다. 웹사이트는 SMS를 통해 사용자에게 문자 메시지를 보내고 사용자는 메시지의 OTP를 입력하여 전화번호의 소유권을 확인합니다.

WebOTP API를 사용하면 동영상에서 보여지는 것처럼 사용자가 탭 한 번으로 이러한 단계를 수행할 수 있습니다. 문자 메시지가 도착하면 하단 시트가 팝업되고 사용자에게 전화번호를 확인하라는 메시지가 표시됩니다. 하단 시트에서 **확인** 버튼을 클릭한 후 브라우저는 OTP를 양식에 붙여넣고 사용자가 **계속**을 누를 필요 없게 양식이 제출됩니다.

<video autoplay loop muted playsinline>
  <source src="https://storage.googleapis.com/web-dev-assets/web-otp/demo.mp4" type="video/mp4">
  <source src="https://storage.googleapis.com/web-dev-assets/web-otp/demo.webm" type="video/webm"></source></source></video>

전체 프로세스는 아래 이미지에 다이어그램으로 표시되어 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GrFHzEg98jxCOguAQwHe.png", alt="", width="494", height="391" %} <figcaption> WebOTP API 다이어그램 </figcaption><br></figure>

[데모](https://web-otp.glitch.me)를 직접 시도해보십시오. 전화번호를 묻거나 여러분의 장치로 SMS를 보내지 않지만, 데모에 표시된 문자를 복사하여 다른 장치에서 보낼 수 이습니다. WebOTP API를 사용할 때에는 발신자를 중요시하지 않기 때문에 이렇게 작동할 수 있습니다.

1. Android 장치의 Chrome 84 이상에서 [https://web-otp.glitch.me](https://web-otp.glitch.me)로 이동합니다.
2. 다른 전화기에서 다음 SMS 문자 메시지를 여러분의 전화기로 보냅니다.

```text
Your OTP is: 123456.

@web-otp.glitch.me #12345
```

SMS를 받았으며 입력 영역에 코드를 입력하라는 메시지가 표시됩니까? WebOTP API는 사용자에게 이렇게 작동합니다.

{% Aside 'gotchas' %}

대화 상자가 표시되지 않으면 [FAQ](#no-dialog)를 확인하십시오.

{% endAside %}

WebOTP API 사용은 세 부분으로 구성됩니다.

- 적절하게 주석이 달린 `<input>` 태그
- 웹 앱의 JavaScript
- SMS를 통해 전송된 형식화된 메시지 문자

먼저 `<input>` 태그를 다루겠습니다.

## `<input>` 태그에 주석 달기

WebOTP 자체는 HTML 주석이 없어도 작동하지만 브라우저 간 호환성을 위해 사용자가 OTP를 입력할 것으로 예상되는 `<input>`에 `autocomplete="one-time-code"`를 추가하는 것이 좋습니다.

이렇게 하면 WebOTP를 지원하지 않는 경우에도 사용자가 [SMS 메시지 형식 설정](#format)에서 설명된 형식의 SMS를 수신할 경우 OTP로 `<input>` 필드를 자동 완성하도록 Safari 14 이상에서 제안할 수 있습니다.

{% Label %}HTML{% endLabel %}

```html
<form>
  <input autocomplete="one-time-code" required/>
  <input type="submit">
</form>
```

## WebOTP API 사용

WebOTP는 간단하기 때문에 다음 코드를 복사하여 붙여넣기만 하면 됩니다. 무슨 일이 일어나고 있는지는 안내해 드리겠습니다.

{% Label %}JavaScript{% endLabel %}

```js
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    const ac = new AbortController();
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', e => {
        ac.abort();
      });
    }
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
      input.value = otp.code;
      if (form) form.submit();
    }).catch(err => {
      console.log(err);
    });
  });
}
```

### 기능 감지

기능 감지는 다른 많은 API와 동일합니다. `DOMContentLoaded` 이벤트를 수신하면 DOM 트리가 쿼리할 준비가 될 때까지 기다립니다.

{% Label %}JavaScript{% endLabel %}

```js
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    …
    const form = input.closest('form');
    …
  });
}
```

{% Aside 'caution' %}

WebOTP API는 보안 오리진(HTTPS)이 필요합니다. HTTP 웹사이트에서의 기능 감지가 실패합니다.

{% endAside %}

### OTP 처리

WebOTP API 자체는 매우 단순합니다. [`navigator.credentials.get()`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get)을 사용하여 OTP를 가져옵니다. WebOTP는 해당 메서드에 새로운 `otp` 옵션을 추가합니다. 이 옵션에는 `transport`라는 한 가지 속성만 있으며, 그 값은 `'sms'` 문자열이 포함된 배열이어야 합니다.

{% Label %}JavaScript{% endLabel %}

```js/1-2
    …
    navigator.credentials.get({
      otp: { transport:['sms'] }
      …
    }).then(otp => {
    …
```

이것은 SMS 메시지가 도착할 때 브라우저의 권한 흐름을 트리거합니다. 권한이 부여되면 반환된 약속은 `OTPCredential` 개체를 사용하여 확인합니다.

{% Label %}획득한 `OTPCredential` 개체의 내용{% endLabel %}

```json
{
  code: "123456" // Obtained OTP
  type: "otp"  // `type` is always "otp"
}
```

다음으로, OTP 값을 `<input>` 필드에 전달합니다. 양식을 직접 제출하면 사용자가 버튼을 탭해야 하는 단계가 제거됩니다.

{% Label %}JavaScript{% endLabel %}

```js/5-6
    …
    navigator.credentials.get({
      otp: { transport:['sms'] }
      …
    }).then(otp => {
      input.value = otp.code;
      if (form) form.submit();
    }).catch(err => {
      console.error(err);
    });
    …
```

### 메시지 중단 {: #aborting }

사용자가 수동으로 OTP를 입력하고 양식을 제출하는 경우, [`options` 개체](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get#Parameters)의 `AbortController` 인스턴스를 사용하여 `get()` 호출을 취소할 수 있습니다.

{% Label %} JavaScript {% endLabel %}

```js/1,5,11
    …
    const ac = new AbortController();
    …
    if (form) {
      form.addEventListener('submit', e => {
        ac.abort();
      });
    }
    …
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
    …
```

## SMS 메시지 형식 설정 {: #format }

API 자체는 매우 단순해 보이지만 사용하기 전에 알아야 할 몇 가지 사항이 있습니다. 메시지는 `navigator.credentials.get()`이 호출된 후 전송되어야 하며, `get()`이 호출된 장치에서 수신되어야 합니다. 마지막으로, 메시지는 다음 형식을 따라야 합니다.

- 메시지는 사람이 읽을 수 있는 문자로 시작(선택 사항)하며 하나 이상의 숫자를 사용하고 4~10자의 영숫자 문자열을 포함하되 마지막 줄은 URL 및 OTP를 위해 남겨두어야 합니다.
- API를 호출한 웹사이트 URL의 도메인 부분 앞에는 `@`이 있어야 합니다.
- URL은 파운드 기호(' `#` ') 다음에 OTP를 포함해야 합니다.

예를 들면 다음과 같습니다.

```text
Your OTP is: 123456.

@www.example.com #123456
```

다음은 나쁜 예입니다.

잘못된 SMS 문자의 예 | 이것이 작동하지 않는 이유
--- | ---
`Here is your code for @example.com #123456` | `@`는 마지막 줄의 첫 번째 문자여야 합니다.
`Your code for @example.com is #123456` | `@`는 마지막 줄의 첫 번째 문자여야 합니다.
`Your verification code is 123456`<br><br>`@example.com\t#123456` | `@host`와 `#code` 사이에는 공백이 하나만 있어야 합니다.
`Your verification code is 123456`<br><br>`@example.com`<code>  </code>`#123456` | `@host`와 `#code` 사이에는 공백이 하나만 있어야 합니다.
`Your verification code is 123456`<br><br>`@ftp://example.com #123456` | URL 스키마를 포함할 수 없습니다.
`Your verification code is 123456`<br><br>`@https://example.com #123456` | URL 스키마를 포함할 수 없습니다.
`Your verification code is 123456`<br><br>`@example.com:8080 #123456` | 포트를 포함할 수 없습니다.
`Your verification code is 123456`<br><br>`@example.com/foobar #123456` | 경로를 포함할 수 없습니다.
`Your verification code is 123456`<br><br>`@example .com #123456` | 도메인에 공백이 없어야 합니다.
`Your verification code is 123456`<br><br>`@domain-forbiden-chars-#%/:<>?@[] #123456` | 도메인에 [금지된 문자](https://url.spec.whatwg.org/#forbidden-host-code-point)가 없어야 합니다.
`@example.com #123456`<br><br>`Mambo Jumbo` | `@host` 및 `#code`가 마지막 줄에 있어야 합니다.
`@example.com #123456`<br><br>`App hash #oudf08lkjsdf834` | `@host` 및 `#code`가 마지막 줄에 있어야 합니다.
`Your verification code is 123456`<br><br>`@example.com 123456` | `#`가 없습니다.
`Your verification code is 123456`<br><br>`example.com #123456` | `@`가 없습니다.
`Hi mom, did you receive my last text` | `@` 및 `#`가 없습니다.

## 데모

[https://web-otp.glitch.me](https://web-otp.glitch.me)에서 데모로 다양한 메시지를 시도해보십시오.

[https://glitch.com/edit/#!/web-otp](https://glitch.com/edit/#!/web-otp)에서 포크하여 여러분만의 버전을 만들 수도 있습니다.

{% Glitch { id: 'web-otp', path: 'views/index.html', previewSize: 0, allow: [] } %}

## 교차 오리진 iframe에서 WebOTP 사용

교차 오리진 iframe에 SMS OTP를 입력하는 것은 일반적으로 결제 확인, 특히 3D Secure에서 사용됩니다. 교차 오리진 iframe을 지원하는 공통 형식을 갖는 WebOTP API는 중첩된 오리진에 바인딩된 OTP를 제공합니다. 예를 들면 다음과 같습니다.

- 사용자가 신용카드로 신발 한 켤레를 구매하기 위해 `shop.example`에 방문합니다.
- 신용카드 번호를 입력하면 통합 결제 제공업체가 iframe 내에 `bank.example` 양식을 표시하여 사용자에게 빠른 체크아웃을 위한 전화번호 인증을 요청합니다.
- `bank.example`은 OTP가 포함된 SMS를 사용자에게 전송하여 사용자가 OTP를 입력하여 신원을 확인할 수 있도록 합니다.

교차 오리진 iframe 내에서 WebOTP API를 사용하려면 두 가지 작업을 수행해야 합니다.

- SMS 문자 메시지에서 상단 프레임 오리진과 iframe 오리진 모두에 주석을 답니다.
- 교차 오리진 iframe이 사용자로부터 직접 OTP를 수신할 수 있도록 권한 정책을 구성합니다.

<figure>{% Video src="video/YLflGBAPWecgtKJLqCJHSzHqe2J2/Ba3OSkSsB4NwFkHGOuvc.mp4", autoplay="true", controls="true", loop="true", muted="true", preload="auto", width="300", height="600" %} <figcaption> iframe 내에서 WebOTP API가 작동 중에 있습니다. </figcaption></figure>

[https://web-otp-iframe-demo.stackblitz.io](https://web-otp-iframe-demo.stackblitz.io)에서 데모를 시도해볼 수 있습니다.

### SMS 문자 메시지에 바인딩 오리진 주석 달기

WebOTP API가 iframe 내에서 호출되는 경우 SMS 문자 메시지는 `@`이 앞에 오는 상단 프레임 오리진을 포함해야 하며 그 뒤에는 `#`이 앞에 오는 OTP가, 마지막 줄에는 `@`가 앞에 오는 iframe 오리진이 있어야 합니다.

```text
Your verification code is 123456

@shop.example #123456 @bank.exmple
```

### 권한 정책 구성

교차 오리진 iframe에서 WebOTP를 사용하려면 의도하지 않은 동작을 방지하기 위해 임베더는 OTP 자격 증명 [권한 정책](https://www.w3.org/TR/permissions-policy-1)을 통해 이 API에 대한 액세스 권한을 부여해야 합니다. 일반적으로 이 목표를 달성하는 두 가지 방법이 있습니다.

{% Label %}HTTP 헤더를 통해:{% endLabel %}

```http
Permissions-Policy: otp-credentials=(self "https://bank.example")
```

{% Label %}iframe `allow` 속성을 통해:{% endLabel %}

```html
<iframe src="https://bank.example/…" allow="otp-credentials"></iframe>
```

[권한 정책을 지정하는 방법에 대한 더 많은 예](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/)를 참조하십시오.

{% Aside %}

현재 Chrome은 상위 체인에 고유한 오리진이 **하나만** 있는 교차 오리진 iframe의 WebOTP API 호출만 지원합니다. 다음 시나리오에서:

- `a.com` -&gt; `b.com`
- `a.com` -&gt; `b.com` -&gt; `b.com`
- `a.com` -&gt; `a.com` -&gt; `b.com`
- `a.com` -&gt; `b.com` -&gt; `c.com`

`b.com`에서 WebOTP를 사용하는 것은 지원되지만 `c.com`에서 WebOTP를 사용하는 것은 지원되지 않습니다.

다음 시나리오도 수요 부족 및 UX 복잡성으로 인해 지원되지 않습니다.

- `a.com` -&gt; `b.com` -&gt; `a.com` (WebOTP API 호출)

{% endAside %}

## 자주하는 질문

### 올바른 형식의 메시지를 보내고 있는데도 대화 상자가 나타나지 않습니다. 무엇을 잘못하고 있는 걸까요? {: #no-dialog}

API를 테스트할 때 주의해야 할 사항이 몇 가지 있습니다.

- 발신자의 전화번호가 수신자의 연락처 목록에 포함되어 있으면 기본 [SMS 사용자 동의 API](https://developers.google.com/identity/sms-retriever/user-consent/request#2_start_listening_for_incoming_messages)의 설계로 인해 이 API가 트리거되지 않습니다.
- Android 장치에서 직장 프로필을 사용 중이고 WebOTP가 작동하지 않는 경우에는 대신 개인 프로필(예: SMS 메시지를 수신하는 동일한 프로필)에 Chrome을 설치하고 사용해 보십시오.

[형식](#format)으로 돌아가서 SMS 형식이 올바른지 확인하십시오.

### 이 API는 다른 브라우저 간에 호환됩니까?

Chromium과 WebKit은 [SMS 문자 메시지 형식](https://wicg.github.io/sms-one-time-codes)에 동의했으며 [Apple은 iOS 14 및 macOS Big Sur의 Safari에서부터 이를 지원함을 발표](https://developer.apple.com/news/?id=z0i801mg)했습니다. Safari는 WebOTP JavaScript API를 지원하지 않지만 `input` 요소에 `autocomplete=["one-time-code"]` 주석을 추가하면, SMS 메시지가 형식을 준수하는 경우 기본 키보드는 자동으로 OTP를 입력하도록 제안합니다.

### SMS를 인증 수단으로 사용하는 것이 안전합니까?

SMS OTP는 전화번호가 처음 제공될 때 전화번호를 인증하는 용도로는 유용하지만, SMS를 통한 전화번호 인증은 전화번호가 이동통신사에 의해 도용 및 재활용될 수 있으므로 재인증에 사용할 경우에는 신중해야 합니다. WebOTP는 편리한 재인증 및 복구 메커니즘이지만 서비스는 이를 지식 챌린지와 같은 추가 팩터와 결합하거나 강력한 인증을 위해 [Web Authentication(웹 인증) API](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API)를 사용해야 합니다.

### Chrome의 구현 버그는 어디에 보고해야 하나요?

Chrome의 구현에서 버그를 찾으셨습니까?

- [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ESMS)에서 버그를 신고하십시오. 가능한 한 많은 세부 정보와 간단한 재현 지침을 포함하고 <em>구성 요소</em>를 `Blink>WebOTP`로 설정하십시오.

### 이 기능에 도움을 보태려면 어떻게 해야 하나요?

여러분의 공개 지원은 기능의 우선 순위를 정하는 데 도움이 되며 다른 브라우저 공급업체가 해당 기능을 지원하는 일이 얼마나 중요한지 보여줍니다. 해시태그 [<code>#WebOTP</code>](https://twitter.com/chromiumdev)를 사용하여 <a>@ChromiumDev</a>으로 트윗 메시지를 보내고 여러분이 어디에서 어떻게 사용하는지 알려주십시오.

{% Aside %} [설명문의 FAQ 섹션](https://github.com/WICG/WebOTP/blob/master/FAQ.md)에서 더 많은 질문을 찾아보십시오. {% endAside %}
