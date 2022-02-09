---
layout: post
title: SMS OTP 양식 모범 사례
subhead: SMS OTP 양식을 최적화하고 사용자 경험을 개선하는 방법을 알아보세요.
authors:
  - agektmr
date: 2020-12-09
updated: 2020-12-09
hero: image/admin/J3XT84NDBPLlsRN0PhLl.jpg
alt: 네온 채팅 버블 기호.
description: 사용자에게 SMS를 통해 전달되는 OTP(일회성 비밀번호)를 제공하도록 요청하는 것은 사용자의 전화번호를 확인하는 일반적인 방법입니다. 이 게시물에는 훌륭한 사용자 경험을 제공하는 SMS OTP 양식을 구축하기 위한 모범 사례가 제공되어 있습니다.
tags:
  - identity
  - security
  - forms
---

{% YouTube 'sU4MpWYrGSI' %}

사용자에게 SMS를 통해 전달되는 OTP(일회성 비밀번호) 제공하도록 요청하는 것은 사용자의 전화번호를 확인하는 일반적인 방법입니다. SMS OTP에 대한 몇 가지 사용 사례가 있습니다.

- **이중 인증.** 사용자 이름과 비밀번호 외에, SMS OTP는 SMS OTP를 수신한 사람이 해당 계정을 소유하고 있다는 강력한 신호로 사용될 수 있습니다.
- **전화번호 인증.** 일부 서비스는 사용자의 기본 식별자로 전화번호를 사용합니다. 이러한 서비스에서 사용자는 SMS를 통해 수신된 전화번호와 OTP를 입력하여 본인임을 증명할 수 있습니다. PIN과 결합하여 이중 인증을 구성하는 경우도 있습니다.
- **계정 복구.** 사용자가 자신의 계정에 액세스할 수 없게 되면 계정을 복구할 방법이 필요합니다. 등록된 이메일 주소로 이메일을 보내거나 전화번호로 SMS OTP를 보내는 것은 일반적인 계정 복구 방법입니다.
- **지불 확인** 지불 시스템에서 일부 은행 또는 신용카드 발급사는 보안상의 이유로 지불인에게 추가 인증을 요청합니다. SMS OTP는 일반적으로 이러한 용도로 사용됩니다.

이 게시물에서는 위의 사용 사례를 위해 SMS OTP 양식을 구축하는 모범 사례를 설명합니다.

{% Aside 'caution' %} 이 게시물에서는 SMS OTP 양식 모범 사례에 대해 논의하지만 SMS OTP는 전화번호가 재활용될 수 있고 때때로 도용될 수 있기 때문에 그 자체로는 가장 안전한 인증 방법이 아니라는 점에 유의하십시오. 그리고 [OTP 자체 개념은 피싱에 취약합니다](https://youtu.be/kGGMgEfSzMw?t=1133).

더 나은 보안을 찾고 있다면 [WebAuthn](https://www.w3.org/TR/webauthn-2/)을 사용하는 것이 좋습니다. Chrome Dev Summit 2019의 ["가입 및 로그인의 새로운 기능](https://goo.gle/webauthn-video)" 강연에서 이에 대해 자세히 알아보고 ["첫 번째 WebAuthn 앱 빌드](https://goo.gle/WebAuthnReauthCodelab)" 코드랩으로 생체 인식 센서를 사용하여 재인증 환경을 구축하세요. {% endAside %}

## 체크리스트

SMS OTP로 최상의 사용자 경험을 제공하려면 다음 단계를 따르세요.

- 다음과 함께 `<input>` 요소를 사용하세요.
    - `type="text"`
    - `inputmode="numeric"`
    - `autocomplete="one-time-code"`
- `@BOUND_DOMAIN #OTP_CODE`를 OTP SMS 메시지의 마지막 줄로 사용합니다.
- [WebOTP API](/web-otp/)를 사용합니다.

## `<input>` 요소 사용

`<input>` 요소가 있는 양식을 사용하는 것은 모든 브라우저에서 효과적이므로 따를 수 있는 가장 중요한 모범 사례입니다. 이 게시물의 다른 제안이 일부 브라우저에서 효과적이지 않더라도 사용자는 여전히 수동으로 OTP를 입력하고 제출할 수 있습니다.

```html
<form action="/verify-otp" method="POST">
  <input type="text"
         inputmode="numeric"
         autocomplete="one-time-code"
         pattern="\d{6}"
         required>
</form>
```

다음은 입력 필드가 브라우저 기능을 최대한 활용할 수 있도록 하는 몇 가지 아이디어입니다.

### `type="text"`

OTP는 일반적으로 5자리 또는 6자리 숫자이므로 입력 필드에 `type="number"`를 사용하는 것은 모바일 키보드를 숫자로만 변경하기 때문에 직관적일 수 있습니다. 브라우저는 입력 필드가 예기치 않은 동작을 유발할 수 있는 여러 숫자의 시퀀스가 아니라 셀 수 있는 숫자일 것으로 예상하므로 권장하지 않습니다. `type="number"`를 사용하면 입력 필드 옆에 위쪽 및 아래쪽 버튼이 표시됩니다. 이 버튼을 누르면 숫자가 증가하거나 감소하고 앞의 0을 제거할 수 있습니다.

대신 `type="text"`를 사용하세요. 이렇게 하면 모바일 키보드가 숫자로만 바뀌지는 않지만 `inputmode="numeric"` 사용에 대한 다음 팁이 해당 작업을 수행하기 때문에 괜찮습니다.

### `inputmode="numeric"`

모바일 키보드를 숫자로만 변경 [`inputmode="numeric"`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/inputmode)을 사용하세요.

일부 웹사이트는 초점을 맞출 때 모바일 키보드를 숫자(`*` 및 `#`)로만 전환하므로 OTP 입력 필드에 `type="tel"`를 사용합니다. 이 해킹 방법은 과거에 `inputmode="numeric"`이 널리 지원되지 않았을 때 사용되었습니다. <a href="https://github.com/mdn/browser-compat-data/pull/6782" data-md-type="link">Firefox에서 `inputmode="numeric"`</a>을 지원하기 시작했으므로 의미론적으로 부정확한 `type="tel"` 해킹 방법을 사용할 필요가 없습니다.

### `autocomplete="one-time-code"`

개발자는 [`autocomplete`](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete) 속성을 사용하여 브라우저가 자동 완성 지원을 제공할 수 있도록 권한을 지정할 수 있고 브라우저에 필드에서 예상되는 정보 유형을 알릴 수 있습니다.

`autocomplete="one-time-code"`를 사용하면 양식이 열려 있는 동안 사용자가 SMS 메시지를 수신할 때마다 운영 체제가 SMS의 OTP를 경험적으로 구문 분석하고 키보드는 사용자가 입력할 수 있도록 OTP를 제안합니다. iOS, iPadOS 및 macOS의 Safari 12 이상에서만 사용할 수 있지만 해당 플랫폼에서 SMS OTP 환경을 개선하는 쉬운 방법이므로 이러한 기능을 사용하는 것이 좋습니다.

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/ios-safari.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/ios-safari.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>실행 중인 `autocomplete="one-time-code"`</figcaption></figure>

`autocomplete="one-time-code"`[는 사용자 경험을 개선하지만 SMS 메시지가 원본 바인딩 메시지 형식을 준수하도록](#format) 하면 더 많은 작업을 수행할 수 있습니다.

{% Aside %} 선택적 속성:

- [`pattern`](https://developer.mozilla.org/docs/Web/HTML/Attributes/pattern)은 입력된 OTP가 일치해야 하는 형식을 지정합니다. 정규식을 사용하여 일치하는 패턴을 지정합니다. 예를 들어, `\d{6}`는 OTP를 6자리 문자열로 제한합니다. [더 복잡한 실시간 유효성 검사를 위해JavaScript 사용] (https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation)에서 `pattern` 속성에 대해 더 자세히 알아보세요.

- [`required`](https://developer.mozilla.org/docs/Web/HTML/Attributes/required)는 필드가 필수임을 나타냅니다.

보다 일반적인 양식 모범 사례는 [Sam Dutton](/authors/samdutton/)의 [로그인 양식 모범 사례](/sign-in-form-best-practices/)를 참조하는 것이 좋습니다. {% endAside %}

## SMS 텍스트 형식 {: #format }

[SMS 사양을 통해 제공되는 원본 바인딩 일회성 코드](https://wicg.github.io/sms-one-time-codes/)를 정렬하여 OTP 입력에 대한 사용자 환경을 개선합니다.

형식 규칙은 간단합니다. `@`가 앞에 오는 수신자 도메인과 `#`이 앞에 오는 OTP로 SMS 메시지를 마칩니다.

예를 들어:

```text
Your OTP is 123456

@web-otp.glitch.me #123456
```

OTP 메시지에 표준 형식을 사용하면 OTP 메시지에서 코드를 더 쉽고 안정적으로 추출할 수 있습니다. OTP 코드를 웹사이트와 연결하면 사용자가 악성 사이트에 코드를 제공하도록 속이기가 더 어려워집니다.

{% Aside %} 정확한 규칙은 다음과 같습니다.

- 메시지는 사람이 읽을 수 있는 문자로 시작(선택 사항)하며 하나 이상의 숫자를 사용하고 4~10자의 영숫자 문자열을 포함하되 마지막 줄은 URL 및 OTP를 위해 남겨두어야 합니다.
- API를 호출한 웹사이트 URL의 도메인 부분 앞에는 `@`이 있어야 합니다.
- URL에는 OTP가 다음에 오는 파운드 기호("`#`")를 포함해야 합니다.

총 글자 수는 140자를 초과하지 않아야 합니다.

Chrome 관련 규칙에 대한 자세한 내용은 [WebOTP API 게시물의 SMS 메시지 형식](/web-otp/#format) 지정 섹션을 참조하세요. {% endAside %}

이 형식을 사용하면 다음과 같은 몇 가지 이점이 있습니다.

- OTP는 도메인에 바인딩됩니다. 사용자가 SMS 메시지에 지정된 도메인 이외의 도메인에 있는 경우 OTP 제안이 나타나지 않습니다. 이는 또한 피싱 공격 및 잠재적인 계정 도용의 위험을 완화합니다.
- 브라우저는 이제 미스터리하고 이상한 휴리스틱에 의존하지 않고 OTP를 안정적으로 추출할 수 있습니다.

웹 사이트에서 `autocomplete="one-time-code"` 를 사용하는 경우 iOS 14 이상이 설치된 Safari는 위의 규칙에 따라 OTP를 제안합니다.

{% Aside %} 사용자가 iOS에서와 동일한 iCloud 계정이 설정된 MacOS Big Sur를 사용하는 데스크톱에 있는 경우, iOS 기기에서 수신된 OTP는 데스크톱 Safari에서도 사용할 수 있습니다.

Apple 플랫폼 가용성에 대한 다른 이점과 미묘한 차이를 자세히 알아보려면 [도메인 바운드 코드로 SMS 전달 코드 보안 강화](https://developer.apple.com/news/?id=z0i801mg)를 읽어보세요. {% endAside %}

이 SMS 메시지 형식은 Safari 이외의 브라우저에도 유용합니다. Android의 Chrome, Opera 및 Vivaldi도 WebOTP API를 사용하여 원본 바인딩 일회성 코드 규칙을 지원하지만 `autocomplete="one-time-code"`를 통해서는 지원하지 않습니다.

## WebOTP API 사용

[WebOTP API](https://wicg.github.io/web-otp/)는 SMS 메시지로 수신된 OTP에 대한 액세스를 제공합니다. `transport`에 `sms`가 포함된 `otp` 유형과 함께 [`navigator.credentials.get()`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get)을 호출하면  웹사이트는 원본 바운딩 일회성 코드를 준수하는 SMS가 전달되고 사용자가 액세스 권한을 부여할 때까지 대기합니다. OTP가 JavaScript로 전달되면 웹 사이트는 이를 양식으로 사용하거나 서버에 직접 게시(POST)할 수 있습니다.

{% Aside 'caution' %} WebOTP API에는 보안 출처(HTTPS)가 필요합니다. {% endAside %}

```js
navigator.credentials.get({
  otp: {transport:['sms']}
})
.then(otp => input.value = otp.code);
```

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/android-chrome.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/android-chrome.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>실행 중인 WebOTP API.</figcaption></figure>

[WebOTP API로 웹에서 전화번호 인증하기](/web-otp/)에서 WebOTP API 사용 방법을 자세히 알아보거나 다음 스니펫을 복사하여 붙여넣으세요. `<form>` 요소에 `action` 및 `method` 속성이 제대로 설정되어 있는지 확인하세요.)

```js
// Feature detection
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    // Cancel the WebOTP API if the form is submitted manually.
    const ac = new AbortController();
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', e => {
        // Cancel the WebOTP API.
        ac.abort();
      });
    }
    // Invoke the WebOTP API
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
      input.value = otp.code;
      // Automatically submit the form when an OTP is obtained.
      if (form) form.submit();
    }).catch(err => {
      console.log(err);
    });
  });
}
```

사진 제공: [Unsplash](https://unsplash.com/photos/mZNRsYE9Qi4)에서 [Jason Leung](https://unsplash.com)
