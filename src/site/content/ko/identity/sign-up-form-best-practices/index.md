---
layout: post
title: 가입 양식 모범 사례
subhead: 사용자가 최소한의 번거로움으로 가입, 로그인 및 계정 세부 정보를 관리하도록 돕습니다.
authors:
  - samdutton
scheduled: 'true'
date: 2020-12-09
updated: 2020-12-11
description: 사용자가 최소한의 번거로움으로 가입, 로그인 및 계정 세부 정보를 관리하도록 돕습니다.
hero: image/admin/YfAltWqxvie1SP19BxBj.jpg
thumbnail: image/admin/7bDPvFWBMFIMynoqDpMc.jpg
alt: 손으로 쓴 심은 채소 목록 페이지를 보여주는 클립보드입니다.
tags:
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
codelabs:
  - 가입 양식 모범 사례 코드랩
---

{% YouTube 'Ev2mCzJZLtY' %}

사용자가 사이트에 로그인해야 하는 경우 좋은 가입 양식 디자인이 중요합니다. 이것은 연결 상태가 좋지 않거나 모바일에서나, 바쁘거나 스트레스를 받는 사람들에게 특히 그렇습니다. 잘못 설계된 가입 양식은 높은 이탈률을 보입니다. 각 이탈은 가입 기회를 놓친 것이 아니라 사용자를 잃었으며 사용자가 불만을 품은 것을 의미할 수 있습니다.

{% Aside 'codelab' %} 실습 가이드를 통해 이러한 모범 사례를 배우고 싶다면 [가입 양식 모범 사례 코드랩](/codelab-sign-up-form-best-practices)을 확인하세요. {% endAside %}

다음은 모든 모범 사례를 보여주는 매우 간단한 가입 양식의 예입니다.

{% Glitch { id: 'signup-form', path: 'index.html', height: 700 } %}

{% Aside 'caution' %} 이 게시물은 양식 모범 사례에 관한 것입니다.

서드파티 ID 제공자(연동 로그인)를 통해 가입을 구현하는 방법이나, 사용자를 인증하고, 자격 증명을 저장하고, 계정을 관리하는 백엔드 서비스를 구축하는 방법은 설명하지 않습니다.

[웹 앱에 Google 로그인 통합](https://developers.google.com/identity/sign-in/web/sign-in)에서는 가입 옵션에 연동 로그인을 추가하는 방법을 설명합니다.

[사용자 계정, 권한 부여 및 암호 관리를 위한 12가지 모범 사례](https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account)는 사용자 계정 관리를 위한 핵심 백엔드 원칙을 간략하게 설명합니다. {% endAside %}

## 체크리스트

- [가능하면 로그인을 피하세요](#no-forced-sign-in).
- [계정을 만드는 방법을 명확히 하세요](#obvious-account-creation).
- [계정 세부 정보에 액세스하는 방법을 명확히 하세요](#obvious-account-details).
- [어수선함을 줄이세요](#cut-clutter).
- [세션 길이를 고려하세요](#session-length).
- [암호 관리자가 암호를 안전하게 제안하고 저장할 수 있도록 돕습니다](#help-password-managers).
- [도용된 비밀번호를 허용하지 마세요](#no-compromised-passwords).
- [암호 붙여넣기를 허용하지 마세요](#allow-password-pasting).
- [암호를 일반 텍스트로 저장하거나 전송하지 마세요](#salt-and-hash).
- [비밀번호 업데이트를 강제하지 마세요](#no-forced-password-updates).
- [암호를 변경하거나 재설정하기 쉽게 만드세요](#password-change).
- [연동 로그인을 활성화하세요](#federated-login).
- [계정 전환을 간단하게 만드세요](#account-switching).
- [다단계 인증 제공을 고려하세요](#multi-factor-authentication).
- [사용자 이름에 주의하세요](#username).
- [랩뿐만 아니라 현장에서도 테스트합니다.](#analytics-rum)
- [다양한 브라우저, 장치 및 플랫폼에서 테스트합니다](#test-platforms).

## 가능하면 로그인을 피하세요. {: #no-forced-sign-in }

가입 양식을 구현하고 사용자에게 사이트에서 계정을 만들도록 요청하기 전에 정말 필요한지 고려하세요. 가능하면 로그인 뒤의 기능을 차단하는 것을 피해야 합니다.

최고의 가입 양식은 가입 양식이 없습니다!

사용자에게 계정을 만들도록 요청하면 사용자와 사용자가 달성하려는 것 사이를 오가게 됩니다. 귀하는 부탁을 하고 사용자에게 개인 데이터를 신뢰하도록 요청합니다. 저장하는 모든 암호와 데이터 항목에는 개인 정보 보호 및 보안 "데이터 부채"가 수반되어 사이트에 대한 비용 및 법적 책임이 됩니다.

사용자에게 계정 생성을 요청하는 주된 이유가 탐색 또는 탐색 세션 사이에 정보를 저장하는 것이라면 [대신 클라이언트 측 저장소](/storage-for-the-web)를 사용하는 것이 좋습니다. 쇼핑 사이트의 경우 사용자가 구매를 위해 계정을 만들도록 강요하는 것이 장바구니 이탈의 주요 원인으로 인용됩니다. [게스트 체크아웃을 기본값으로 설정](/payment-and-address-form-best-practices#guest-checkout) 해야 합니다.

## 로그인을 명확하게 하세요 {: #obvious-account-creation}

예를 들어 페이지 오른쪽 상단의 **로그인(Login)** 또는 **로그인(Sign in)** 버튼을 사용하여 사이트에서 계정을 만드는 방법을 명확하게 만드세요. 모호한 아이콘이나 모호한 문구("탑승하세요!", "합류하기")를 사용하지 말고 탐색 메뉴에서 로그인을 숨기지 마세요. 사용성 전문가인 Steve Krug는 웹사이트 사용성에 대한 접근 방식을 다음과 같이 요약했습니다. [생각하게 하지 마세요!](https://uxplanet.org/dont-make-me-think-20-wise-thoughts-about-usability-from-steve-krug-876b563f1d63) 웹 팀의 다른 사람들을 설득해야 하는 경우 [분석](#analytics-rum)을 사용하여 다양한 옵션의 영향을 보여줍니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KeztoU8KgAqrQ5CKBSWw.jpg", alt="안드로이드 폰에서 본 모의 전자상거래 웹사이트 스크린샷 2장. 왼쪽은 로그인 링크 아이콘을 사용하여 다소 모호한 부분이 있습니다. 오른쪽에 있는 하나는 단순히 '로그인'이라고 되어 있습니다.", width="800", height="737" %}<figcaption> 로그인을 명확하게 합니다. 아이콘이 모호할 수 있지만 <b>로그인</b> 버튼이나 링크는 명확합니다.</figcaption></figure>

{% Aside %} 계정을 생성하기 위한 버튼(또는 링크)을 추가하고 기존 사용자가 로그인할 수 있는 다른 버튼을 추가할지 고민할 수 있습니다. 이제 많은 인기 사이트에서 단일 **로그인** 버튼만 표시합니다. 사용자가 이를 탭하거나 클릭하면 필요한 경우 계정을 생성할 수 있는 링크도 표시됩니다. 이는 이제 일반적인 패턴이며 사용자가 이를 이해할 가능성이 높지만 [상호 작용 분석](#analytics-rum)을 사용하여 단일 버튼이 가장 잘 작동하는지 여부를 모니터링할 수 있습니다. {% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WUgCNqhEgvoWEVwGjfrA.jpg", alt="Gmail 로그인 스크린샷: 로그인 버튼이 표시된 한 페이지, 클릭하면 계정 만들기 링크가 있는 양식으로 연결됩니다.", width ="800", height="545" %} <figcaption>Gmail 로그인 페이지에는 계정을 만들 수 있는 링크가 있습니다.<br> 여기에 표시된 것보다 큰 창 크기에서 Gmail은 <b>로그인</b> 링크 및 <b>계정 만들기</b> 버튼을 보여줍니다.</figcaption></figure>

Google과 같은 ID 제공업체를 통해 가입하고 이메일과 비밀번호를 사용하여 가입하는 사용자의 계정을 연결해야 합니다. ID 공급자의 프로필 데이터에서 사용자의 이메일 주소에 액세스하고 두 계정을 일치시킬 수 있으면 쉽게 할 수 있습니다. 아래 코드는 Google 로그인 사용자의 이메일 데이터에 액세스하는 방법을 보여줍니다.

```js
// auth2가 gapi.auth2.init()로 초기화되었습니다
if (auth2.isSignedIn.get()) {
  var profile = auth2.currentUser.get().getBasicProfile();
  console.log(`Email: ${profile.getEmail()}`);
}
```

{: #obvious-account-details}

사용자가 로그인하면 계정 세부 정보에 액세스하는 방법을 명확히 하세요. 특히 [비밀번호를 변경하거나 재설정](#password-change) 하는 방법을 명확히 하세요.

## 어수선함을 줄이기 {: #cut-clutter}

가입 과정에서 여러분의 임무는 복잡성을 최소화하고 사용자가 집중할 수 있도록 하는 것입니다. 어수선함을 줄입니다. 지금은 주의를 산만하게 하고 유혹할 때가 아닙니다!

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/avoid-distractions.mp4" type="video/mp4">
   </source></video>
  <figcaption>사용자가 가입을 완료하는 데 방해가 되지 않도록 하세요.</figcaption></figure>

가입할 때 가능한 한 적게 요구하세요. 추가 사용자 데이터(예: 이름 및 주소)는 필요한 경우에만 그리고 사용자가 해당 데이터를 제공함으로써 분명한 이점이 있다고 판단되는 경우에만 수집합니다. 통신하고 저장하는 모든 데이터 항목에는 비용과 법적 책임이 따른다는 점을 명심하세요.

사용자의 연락처 세부 정보를 올바르게 얻으려고 입력을 두 배로 늘리지 마세요. 그러면 양식 완성 속도가 느려지고 양식 필드가 자동으로 채워지는 경우 의미가 없습니다. 대신 연락처 세부 정보를 입력한 사용자에게 확인 코드를 보내고 응답이 있으면 계정 생성을 계속합니다. 이것은 일반적인 가입 패턴입니다. 사용자는 이에 익숙합니다.

새 기기나 브라우저에서 로그인할 때마다 사용자에게 코드를 전송하여 비밀번호 없는 로그인을 고려할 수 있습니다. Slack 및 Medium과 같은 사이트는 이 버전을 사용합니다.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/medium-sign-in.mp4" type="video/mp4">
   </source></video>
  <figcaption>medium.com에서 비밀번호 없는 로그인.</figcaption></figure>

연동 로그인과 마찬가지로 이것은 사용자 암호를 관리할 필요가 없다는 추가 이점이 있습니다.

## 세션 길이 고려 {: #session-length}

사용자 ID에 대해 어떤 접근 방식을 취하든 세션 길이에 대해 신중하게 결정해야 합니다. 사용자가 로그인된 상태를 유지하는 시간과 로그아웃을 유발하는 원인이 무엇입니까?

사용자가 모바일인지 데스크탑인지, 데스크탑에서 공유하는지 아니면 장치를 공유하는지 고려하세요.

{% Aside %} 구매가 이루어지거나 계정이 업데이트되는 경우와 같이 민감한 기능에 대해 재인증을 시행하여 공유 기기의 일부 문제를 해결할 수 있습니다. 코드랩 [여러분의 첫 WebAuthn 앱](https://codelabs.developers.google.com/codelabs/webauthn-reauth/#0)에서 재인증을 구현하는 방법에 대해 자세히 알아볼 수 있습니다. {% endAside %}

## 비밀번호 관리자가 비밀번호를 안전하게 제안하고 저장할 수 있도록 도와주세요 {: #help-password-managers}

서드파티 및 빌드인 브라우저 암호 관리자가 암호를 제안하고 저장하도록 도와줄 수 있으므로 사용자가 직접 암호를 선택, 기억 또는 입력할 필요가 없습니다. 암호 관리자는 최신 브라우저에서 잘 작동하여 여러 장치, 플랫폼별 및 웹 앱 및 새 장치에서 계정을 동기화합니다.

따라서 특히 올바른 자동 완성 값을 사용하기 위해 가입 양식을 올바르게 코딩하는 것이 매우 중요합니다. 가입 양식의 경우 새로운 비밀 번호에 대해 `autocomplete="new-password"`를 사용하고, `autocomplete="email"` 및 `autocomplete="tel"`과 같은 가능한 다른 양식 필드에 올바른 자동 완성 값을 추가하세요. `input` , `select` 및 `textarea` 요소와 마찬가지로 `form` 요소 자체에 대해 가입 및 로그인 양식에 `name`과 `id` 값을 사용하여 암호 관리자를 도울 수 있습니다.

또한 적절한 [`type` 속성](https://developer.mozilla.org/docs/Web/HTML/Element/input/email)을 사용하여 모바일에서 올바른 키보드를 제공하고 브라우저에서 기본 빌드인 유효성 검사를 활성화해야 합니다. [지불 및 주소 양식 모범 사례](/payment-and-address-form-best-practices#type)에서 자세히 알아볼 수 있습니다.

{% Aside %} [로그인 양식 모범 사례](/sign-in-form-best-practices)에는 양식 디자인, 레이아웃 및 접근성을 개선하는 방법과 기본 제공 브라우저 기능을 활용하기 위해 양식을 올바르게 코딩하는 방법에 대한 더 많은 팁이 있습니다. {% endAside %}

## 사용자가 보안 암호를 입력하도록 합니다. {: #secure-passwords}

암호 관리자가 암호를 제안할 수 있도록 하는 것이 가장 좋은 방법이며 사용자가 브라우저 및 서드파티 브라우저 관리자가 제안하는 강력한 암호를 수락하도록 권장해야 합니다.

그러나 많은 사용자가 자신의 암호를 입력하기를 원하므로 암호 강도에 대한 규칙을 구현해야 합니다. 미국 국립 표준 기술 연구소(National Institute of Standards and Technology)는 [안전하지 않은 암호를 피하는 방법을](https://pages.nist.gov/800-63-3/sp800-63b.html#5-authenticator-and-verifier-requirements) 설명합니다.

{% Aside 'warning' %} 일부 사이트의 가입 양식에는 브라우저 및 타사 비밀번호 관리자가 생성한 강력한 비밀번호를 허용하지 않는 비밀번호 유효성 검사 규칙이 있습니다. 양식 완성을 방해하고 사용자를 귀찮게 하며 사용자가 암호 관리자가 생성한 암호보다 덜 안전할 수 있는 자신의 암호를 만들어야 하므로 사이트에서 이 작업을 수행하지 않도록 하세요. {% endAside %}

## 유출된 비밀번호 허용 안함 {: #no-compromised-passwords}

비밀번호에 대해 어떤 규칙을 선택하든 [보안 침해](https://haveibeenpwned.com/PwnedWebsites) 에 노출된 비밀번호를 허용해서는 안 됩니다.

사용자가 암호를 입력하면 이미 손상된 암호가 아닌지 확인해야 합니다. [Have I Been Pwned](https://haveibeenpwned.com/Passwords) 사이트는 암호 확인을 위한 API를 제공하거나 이를 서비스로 직접 실행할 수 있습니다.

Google의 비밀번호 관리자를 사용하면 [기존 비밀번호가 도용되었는지 확인](https://passwords.google.com/checkup)할 수도 있습니다.

사용자가 제안한 비밀번호를 거부하는 경우 거부된 이유를 구체적으로 설명하십시오. [문제를 인라인으로 표시하고 해결 방법을 설명](https://baymard.com/blog/inline-form-validation) 하세요. 사용자가 등록 양식을 제출하고 서버의 응답을 기다려야 하는 것이 아니라 사용자가 값을 입력하는 즉시 문제를 해결하는 방법을 설명합니다.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/password-validation.mp4" type="video/mp4">
   </source></video>
  <figcaption>비밀번호가 거부된 이유를 명확히 하세요.</figcaption></figure>

## 비밀번호 붙여넣기를 금지하지 마세요. {: #allow-password-pasting}

일부 사이트에서는 텍스트를 암호 입력에 붙여넣는 것을 허용하지 않습니다.

비밀번호 붙여넣기를 허용하지 않으면 사용자를 짜증 나게 하고 기억하기 쉬운(따라서 손상되기 더 쉬울 수 있음) 비밀번호를 권장하며 영국 국가 사이버 보안 센터(UK National Cyber Security Centre)와 같은 조직에 따르면 실제로 [보안](https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords)이 저하될 수 있습니다. 사용자는 비밀번호를 붙여넣으려는 시도 *후에*만 붙여넣기가 허용되지 않는다는 사실을 알게 되므로 [비밀번호 붙여넣기를 허용하지 않아도 클립보드 취약점을 피할 수는 없습니다](https://github.com/OWASP/owasp-masvs/issues/106).

## 비밀번호를 일반 텍스트로 저장하거나 전송하지 마세요. {: #salt-and-hash}

비밀번호를 [솔트 및 해시](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#Use_a_cryptographically_strong_credential-specific_salt)하고 [자신만의 해시 알고리즘을 만들려고 하지 마세요](https://www.schneier.com/blog/archives/2011/04/schneiers_law.html)!

## 비밀번호 업데이트를 강제하지 마세요 {: #no-forced-password-updates}

[사용자가 임의로 암호를 업데이트하도록 강요하지 마세요.](https://pages.nist.gov/800-63-3/sp800-63b.html#-5112-memorized-secret-verifiers:~:text=Verifiers%20SHOULD%20NOT%20require%20memorized%20secrets%20to%20be%20changed%20arbitrarily%20(e.g.%2C%20periodically).)

강제로 암호를 업데이트하면 IT 부서에 비용이 많이 들고 사용자가 짜증이 날 수 있으며 [보안에 큰 영향을 미치지 않습니다](https://pages.nist.gov/800-63-FAQ/#q-b05). 또한 사람들이 안전하지 않은 기억할 수 있는 암호를 사용하거나 암호의 물리적 기록을 유지하도록 권장할 수 있습니다.

비밀번호 업데이트를 강제하기보다 비정상적인 계정 활동을 모니터링하고 사용자에게 경고해야 합니다. 가능하면 데이터 침해로 인해 도용된 비밀번호도 모니터링해야 합니다.

또한 사용자에게 계정 로그인 기록에 대한 액세스 권한을 제공하여 로그인이 발생한 위치와 시간을 보여주어야 합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zZXmhWc9bZ1GtvrE5Ooq.jpg", alt="Gmail 계정 활동 페이지", width="800", height="469" %}<figcaption> <a href="https://support.google.com/mail/answer/45938?hl=en-GB" title="Gmail 계정 활동을 보는 방법을 알아보세요.">Gmail 계정 활동 페이지</a>.</figcaption></figure>

## 비밀번호를 변경하거나 재설정하기 쉽게 만드세요 {: #password-change}

사용자에게 계정 비밀번호를 **업데이트** 하는 위치와 방법을 명확히 하세요. 일부 사이트에서는 놀라울 정도로 어렵습니다.

물론 사용자가 비밀번호를 잊어버린 경우 쉽게 **재설정**할 수 있도록 해야 합니다. Open Web Application Security Project는 [분실된 암호를 처리하는 방법](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)에 대한 자세한 지침을 제공합니다.

귀하의 비즈니스와 사용자를 안전하게 보호하려면 사용자가 비밀번호가 도용된 것을 발견한 경우 비밀번호를 변경하도록 돕는 것이 특히 중요합니다. 이를 더 쉽게 하려면 [`/.well-known/change-password`](https://w3c.github.io/webappsec-change-password-url/) URL을 사이트에 추가하여 비밀번호 관리 페이지로 리디렉션합니다. 이를 통해 비밀번호 관리자는 사이트의 비밀번호를 변경할 수 있는 페이지로 사용자를 직접 탐색할 수 있습니다. 이 기능은 이제 Safari, Chrome에서 구현되었으며 다른 브라우저에서도 제공될 예정입니다. [비밀번호 변경을 위해 잘 알려진 URL을 추가하여 사용자가 비밀번호를 쉽게 변경](/change-password-url)할 수 있도록 구현하는 방법을 설명합니다.

또한 사용자가 원하는 경우 계정을 쉽게 삭제할 수 있도록 해야 합니다.

## 서드파티 ID 제공업체를 통한 로그인 제공 {: #federated-login}

많은 사용자가 이메일 주소와 비밀번호 등록 양식을 사용하여 웹사이트에 로그인하는 것을 선호합니다. 그러나 사용자가 연동 로그인이라고도 하는 서드파티 ID 공급자를 통해 로그인할 수 있도록 설정해야 합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jubgwX1shLB7qAIiioTU.jpg", alt="워드프레스 로그인 페이지", width="800", height="513" %}<figcaption> Google 및 Apple 로그인 옵션이 있는 WordPress 로그인 페이지.</figcaption></figure>

이 접근 방식에는 몇 가지 장점이 있습니다. 연동 로그인을 사용하여 계정을 만드는 사용자의 경우 비밀번호를 묻거나, 커뮤니케이션하거나, 저장할 필요가 없습니다.

또한 이메일 주소와 같은 연동 로그인을 통해 확인된 추가 프로필 정보에 액세스할 수도 있습니다. 즉, 사용자가 해당 데이터를 입력할 필요가 없고 귀하가 직접 확인할 필요가 없습니다. 연동 로그인은 또한 사용자가 새 장치를 마련했을 때 훨씬 쉽게 만들 수 있습니다.

[웹 앱에 Google 로그인 통합](https://developers.google.com/identity/sign-in/web/sign-in)에서는 가입 옵션에 연동 로그인을 추가하는 방법을 설명합니다. [다른 많은](https://en.wikipedia.org/wiki/Federated_identity#Examples) ID 플랫폼을 사용할 수 있습니다.

{% Aside %} 새 기기를 마련했을 때의 "첫 날 경험"이 점점 더 중요해집니다. 사용자는 휴대전화, 노트북, 데스크톱, 태블릿, TV 또는 자동차를 비롯한 여러 장치에서 로그인할 것을 기대합니다. 가입 및 로그인 양식이 매끄럽지 않은 경우 사용자를 잃거나 최소한 다시 설정될 때까지 접속을 잃을 위험이 있습니다. 새로운 장치를 사용하는 사용자가 사이트를 시작하고 실행할 수 있도록 최대한 빠르고 쉽게 만들어야 합니다. 이것은 연동 로그인이 도움이 될 수 있는 또 다른 영역입니다. {% endAside %}

## 계정 전환을 간단하게 하세요 {: #account-switching}

많은 사용자가 동일한 브라우저를 사용하여 장치를 공유하고 계정 간에 교환합니다. 사용자가 연동 로그인에 액세스하는지 여부에 관계없이 계정 전환을 간단하게 만들어야 합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/sPDZJIY5Vo2ijqyuofCy.jpg", alt="Gmail, 계정 전환 표시 중", width="800", height="494" %}<figcaption> Gmail에서 계정 전환.</figcaption></figure>

## 다중 인증 제공 고려 {: #multi-factor-authentication}

다중 인증은 사용자가 여러 가지 방법으로 인증을 제공하도록 하는 것을 의미합니다. 예를 들어 사용자에게 비밀번호를 설정하도록 요구할 뿐만 아니라 이메일이나 SMS 문자 메시지로 전송된 일회용 비밀번호를 사용하거나 앱 기반 일회용 코드, 보안 키 또는 지문 센서. [SMS OTP 모범 사례](/sms-otp-form) 및 [WebAuthn으로 강력한 인증 활성화](https://developer.chrome.com/blog/webauthn/)에서는 다중 인증을 구현하는 방법을 설명합니다.

사이트에서 개인 정보나 민감한 정보를 처리하는 경우 반드시 다중 인증을 제공(또는 시행)해야 합니다.

## 사용자 이름 {: #username}에 주의하세요

사용자 이름이 필요하지 않은 경우(또는 필요한 때까지) 사용자 이름을 강요하지 마세요. 사용자가 전자 메일 주소(또는 전화 번호)와 암호만 사용하여 가입하고 로그인할 수 있도록 하거나 원하는 경우 [연동 로그인](#federated-login)을 사용하도록 설정합니다. 사용자 이름을 선택하고 기억하도록 강요하지 마세요.

사이트에 사용자 이름이 필요한 경우 사용자에게 불합리한 규칙을 적용하지 말고 사용자가 사용자 이름을 업데이트하는 것을 막지 마세요. 백엔드에서 사용자 이름과 같은 개인 데이터를 기반으로 한 식별자가 아니라 모든 사용자 계정에 대해 고유한 ID를 생성해야 합니다.

사용자 이름에 `autocomplete="username"`을 사용해야 합니다.

{% Aside 'caution' %} 개인 이름과 마찬가지로 사용자 이름이 [라틴 알파벳](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes#Types:~:text=Latin%20alphabet) 문자로 제한되지 않도록 합니다. [지불 및 주소 양식 모범 사례](/payment-and-address-form-best-practices#unicode-matching)는 유니코드 문자 일치를 사용하여 유효성을 검사하는 방법과 일치하는 유니코드 문자를 사용하여 검증해야 하는지 이유를 설명합니다. {% endAside %}

## 다양한 기기, 플랫폼, 브라우저 및 버전에서 테스트하기 {: #test-platforms}

사용자에게 가장 일반적인 플랫폼에서 가입 양식을 테스트합니다. 양식 요소 기능은 다를 수 있으며 뷰포트 크기의 차이로 인해 레이아웃 문제가 발생할 수 있습니다. BrowserStack을 사용하면 다양한 장치와 브라우저에서 [오픈 소스 프로젝트를 무료로 테스트](https://www.browserstack.com/open-source)할 수 있습니다.

## 분석 및 실제 사용자 모니터링 구현 {: #analytics-rum}

사용자가 가입 양식을 경험하는 방식을 이해하려면 [현장 데이터와 랩 데이터](/how-to-measure-speed/#lab-data-vs-field-data)가 필요합니다. 분석 및 [실제 사용자 모니터링](https://developer.mozilla.org/docs/Web/Performance/Rum-vs-Synthetic#Real_User_Monitoring)(RUM)은 가입 페이지를 로드하는 데 걸리는 시간, 사용자가 상호 작용하는(또는 그렇지 않은) UI 구성 요소, 사용자가 가입을 완료하는 데 걸리는 시간과 같은 사용자의 실제 경험에 대한 데이터를 제공합니다.

- **페이지 분석** : 가입 과정의 모든 페이지에 대한 [페이지 조회수, 이탈률 및 종료율.](https://analytics.google.com/analytics/academy/course/6)
- **상호 작용 분석** : [목표 유입 경로](https://support.google.com/analytics/answer/6180923?hl=en) 및 [이벤트](https://developers.google.com/analytics/devguides/collection/gtagjs/events)는 사용자가 가입 과정을 포기한 위치와 가입 페이지의 버튼, 링크 및 기타 구성 요소를 클릭하는 사용자의 비율을 나타냅니다.
- **웹사이트 성능** : [사용자 중심 메트릭](/user-centric-performance-metrics)을 통해 가입 과정이 느리게 로드되거나 [시각적으로 불안정](/cls)한지 여부를 알 수 있습니다.

작은 변경이 가입 양식 완료율에 큰 차이를 만들 수 있습니다. 분석 및 RUM을 사용하면 변경 사항을 최적화하고 우선 순위를 지정하고 로컬 테스트에서 노출되지 않은 문제에 대해 사이트를 모니터링할 수 있습니다.

## 학습 계속 {: #resources}

- [로그인 양식 모범 사례](/sign-in-form-best-practices)
- [지불 및 주소 양식 모범 사례](/payment-and-address-form-best-practices)
- [놀라운 양식 만들기](/learn/forms/)
- [모바일 양식 디자인 모범 사례](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [더 많은 기능을 갖춘 양식 컨트롤](/more-capable-form-controls)
- [액세스 가능한 양식 만들기](https://webaim.org/techniques/forms/)
- [Credential Management API를 사용하여 가입 과정 간소화](https://developer.chrome.com/blog/credential-management-api/)
- [WebOTP API로 웹에서 전화번호 확인](/web-otp)

사진 제공: [Unsplash](https://unsplash.com/photos/lUShu7PHIGA)에서 [@ecowarriorprincess](https://unsplash.com/@ecowarriorprincess).
