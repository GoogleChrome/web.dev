~---
layout: post
title: 로그인 양식 모범 사례
subhead: 교차 플랫폼 브라우저 기능을 사용하여 안전하고 액세스 가능하며 사용하기 쉬운 로그인 양식을 작성하십시오.
authors:
  - samdutton
scheduled: 진실
date: 2020-06-29
updated: 2021-09-27
description: 교차 플랫폼 브라우저 기능을 사용하여 안전하고 액세스 가능하며 사용하기 쉬운 로그인 양식을 작성하십시오.
hero: image/admin/pErOjllBUXhnj68qOhfr.jpg
alt: 전화기를 들고 있는 사람.
tags:
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
codelabs:
  - codelab-sign-in-form-best-practices
---

{% YouTube 'alGcULGtiv8' %}

사용자가 사이트에 로그인해야 하는 경우 올바른 로그인 양식 디자인이 중요합니다. 이것은 연결 상태가 좋지 않거나 모바일, 바쁘거나 스트레스를 받는 사람들에게 특히 그렇습니다. 잘못 설계된 로그인 양식은 높은 이탈률을 보입니다. 각 반송은 로그인 기회를 놓친 것뿐만 아니라 사용자를 잃고 불만을 품은 것을 의미할 수 있습니다.

{% Aside 'codelab' %} 실습 가이드를 통해 이러한 모범 사례를 배우고 싶다면 [로그인 양식 모범 사례 코드랩](/codelab-sign-in-form-best-practices/)을 확인하세요. {% endAside %}

다음은 모든 모범 사례를 보여주는 간단한 로그인 양식의 예입니다.

{% Glitch { id: 'sign-in-form', path: 'index.html', height: 480 } %}

## 체크리스트

- [의미 있는 HTML 요소 사용](#meaningful-html): `<form>` , `<input>` , `<label>` 및 `<button>`.
- [각 입력에`<label>` 레이블을 지정하십시오](#label).
- 요소 속성을 사용하여 [내장 브라우저 기능(](#element-attributes)`type`, `name`, `autocomplete`, `required`)에 액세스합니다.
- 입력 `name` 및 `id` 속성은 페이지 로드나 웹사이트 배포 간에 변하지 않는 안정적인 값을 부여합니다.
- [자체 &lt;form&gt; 요소에](#form) 로그인을 넣습니다.
- [성공적인 양식 제출을 확인하십시오](#submission) .
- 로그인 양식의 비밀번호 입력과 재설정 비밀번호 형식의 새 비밀번호 입력에는 [`autocomplete="new-password"`](#new-password) 및 [`id="new-password"`](#new-password)를 사용합니다.
- 로그인 비밀번호 입력에 [`autocomplete="current-password"`](#current-password) 및 [`id="current-password"`](#current-password)를 사용합니다.
- [비밀번호 표시](#show-password) 기능을 제공합니다.
- 비밀번호 입력에 [`aria-label` 및 `aria-describedby`](#accessible-password-inputs)를 사용합니다.
- [입력을 이중화하지 마십시오](#no-double-inputs).
- [모바일 키보드가 입력이나 버튼을 가리지 않도록](#keyboard-obstruction) 양식을 디자인합니다.
- 모바일에서 양식을 사용할 수 있는지 확인: [읽기 쉬운 텍스트](#size-text-correctly)를 사용하고 입력과 버튼이 [터치 대상으로 작동할 수 있을 만큼 충분히 커야 합니다](#tap-targets).
- 가입 페이지와 로그인 페이지에서 [브랜딩과 스타일을 유지하세요.](#general-guidelines)
- [현장 및 실험실 테스트](#analytics): 페이지 분석, 상호 작용 분석 및 사용자 중심 성능 측정을 가입 및 로그인 흐름에 구축합니다.
- [브라우저 및 장치에서 테스트](#devices): 양식 동작은 플랫폼에 따라 크게 다릅니다.

{% Aside %} 이 도움말은 프론트엔드 권장 사항에 관한 것입니다. 사용자 인증, 자격 증명 저장 또는 계정 관리를 위한 백엔드 서비스를 구축하는 방법은 설명하지 않습니다. [사용자 계정, 권한 부여 및 비밀번호 관리를 위한 12가지 모범 사례](https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account)는 자체 백엔드를 실행하기 위한 핵심 원칙을 간략하게 설명합니다. 전 세계의 다른 지역에 사용자가 있는 경우 사이트의 콘텐츠와 타사 ID 서비스 사용을 현지화하는 것을 고려해야 합니다.

또한 더 나은 로그인 환경을 구축하는 데 도움이 될 수 있는 이 문서에서 다루지 않은 두 가지 비교적 새로운 API가 있습니다.

- [**WebOTP**](/web-otp/): SMS를 통해 휴대폰으로 일회용 비밀번호 또는 PIN 번호를 전달합니다. 이를 통해 사용자는 전화번호를 식별자로 선택할 수 있고(이메일 주소를 입력할 필요가 없음!) 로그인을 위한 2단계 인증과 결제 확인을 위한 일회성 코드를 사용할 수 있습니다.
- [**자격 증명 관리**](https://developer.chrome.com/blog/credential-management-api/): 개발자가 비밀번호 자격 증명 및 연합 자격 증명을 프로그래밍 방식으로 저장 및 검색할 수 있도록 합니다. {% endAside %}

## 의미 있는 HTML 사용 {: #meaningful-html }

작업을 위해 제작된 요소 사용: `<form>`, `<label>` 및 `<button>`. 이를 통해 내장 브라우저 기능을 활성화하고 접근성을 개선하며 마크업에 의미를 추가합니다.

### `<form>` 사용 {: #form }

`<div>`로 래핑하고 순수 자바스크립트로 입력 데이터 제출을 처리하고 싶을 수 있습니다. [`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form) 요소를 사용하는 것이 좋습니다. 이렇게 하면 화면 판독기 및 기타 보조 장치에서 사이트에 액세스할 수 있고, 다양한 내장 브라우저 기능이 활성화되고, 이전 브라우저를 위한 기본 기능 로그인을 더 간단하게 구축할 수 있으며, JavaScript가 실패하더라도 계속 작동할 수 있습니다.

{% Aside 'gotchas' %} 일반적인 실수는 전체 웹페이지를 단일 형식으로 래핑하는 것이지만 이는 브라우저 비밀번호 관리자 및 자동 완성에 문제를 일으킬 수 있습니다. 양식이 필요한 각 UI 구성 요소에 대해 다른 &lt;form&gt;을 사용합니다. 예를 들어 동일한 페이지에서 로그인과 검색이 있는 경우 두 개의 양식 요소를 사용해야 합니다. {% endAside %}

### `<label>` 사용 {: #label }

입력에 레이블을 지정하려면 [`<label>`](https://developer.mozilla.org/docs/Web/HTML/Element/label)을 사용하십시오!

```html
<label for="email">Email</label>
<input id="email" …>
```

두 가지 이유:

- 레이블을 탭하거나 클릭하면 포커스가 해당 입력으로 이동합니다. `for` `name` 또는 `id`와 함께 사용하여 레이블을 입력과 연결합니다.
- 스크린리더는 레이블 또는 레이블의 입력이 포커스를 받으면 레이블 텍스트를 알립니다.

자리 표시자를 입력 레이블로 사용하지 마십시오. 사람들은 특히 주의가 산만해지는 경우("이메일 주소, 전화번호 또는 계정 ID를 입력했나요?") 텍스트를 입력하기 시작하면 입력 내용을 잊어버리기 쉽습니다. 자리 표시자에는 다른 많은 잠재적인 문제가 있습니다. 확신이 없으면 [자리 표시자 특성을 사용하지 말고](https://www.nngroup.com/articles/form-design-placeholders/) [양식 필드의 자리 표시자는 해로움](https://www.smashingmagazine.com/2018/06/placeholder-attribute/)을 참조하십시오.

레이블을 입력 위에 두는 것이 가장 좋습니다. 이를 통해 모바일과 데스크톱에서 일관된 디자인이 가능하며 [Google AI 연구](https://ai.googleblog.com/2014/07/simple-is-better-making-your-web-forms.html)에 따르면 사용자가 더 빠르게 스캔할 수 있습니다. 전체 너비 레이블 및 입력을 얻을 수 있으며 레이블 텍스트에 맞게 레이블 및 입력 너비를 조정할 필요가 없습니다.

<figure>{% Img src="image/admin/k0ioJa9CqnMI8vyAvQPS.png", alt="모바일에서 양식 입력 레이블 위치를 보여주는 스크린샷: 입력 옆 및 입력 위.", width="500", height="253" %} <figcaption>레이블과 입력 너비는 둘 다 같은 줄에 있을 때 제한됩니다.</figcaption></figure>

모바일 장치에서 [레이블 위치](https://label-position.glitch.me) Glitch를 열어 직접 확인하십시오.

### `<button>` 사용 {: #버튼 }

버튼에는 [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button)을 사용하세요! 버튼 요소는 액세스 가능한 동작과 기본 제공 양식 제출 기능을 제공하며 쉽게 스타일을 지정할 수 있습니다. `<div>`나 버튼인 척하는 다른 요소를 사용하는 것은 의미가 없습니다.

제출 버튼이 무엇을 하는지 확인하십시오. 예에는 **제출** 또는 **시작**이 아닌 **계정 만들기** 또는 **로그인**이 있습니다.

### 성공적인 양식 제출 확인 {: #submission }

비밀번호 관리자가 양식이 제출되었음을 이해하도록 돕습니다. 두 가지 방법이 있습니다.

- 다른 페이지로 이동합니다.
- `History.pushState()` 또는 `History.replaceState()`로 탐색을 에뮬레이트하고 비밀번호 양식을 제거하십시오.

`XMLHttpRequest` 또는 `fetch` 요청을 사용하여 로그인 성공이 응답으로 보고되고 DOM에서 양식을 가져오고 사용자에게 성공을 표시하여 처리되는지 확인합니다.

사용자가 **로그인** 버튼을 탭하거나 클릭하면 비활성화하는 것이 좋습니다. 빠르고 반응이 빠른 사이트에서도 [많은 사용자가 버튼을 여러 번 클릭](https://baymard.com/blog/users-double-click-online)합니다. 그러면 상호 작용이 느려지고 서버 부하가 늘어납니다.

반대로 사용자 입력을 기다리는 양식 제출을 비활성화하지 마십시오. 예를 들어 사용자가 고객 PIN을 입력하지 않은 경우 **로그인** 버튼을 비활성화하지 마십시오. 사용자는 양식에서 무언가를 놓친 다음(비활성화됨) **로그인** 버튼을 반복해서 탭하고 작동하지 않는다고 생각할 수 있습니다. 최소한 양식 제출을 비활성화해야 하는 경우 비활성화된 버튼을 클릭할 때 누락된 사항을 사용자에게 설명하십시오.

{% Aside 'caution' %} 양식에 있는 버튼의 기본 유형은 `submit`입니다. 양식에 다른 버튼을 추가하려면(예: **비밀번호 표시**의 경우) `type="button"`을 추가합니다. 그렇지 않으면 버튼을 클릭하거나 탭하면 양식이 제출됩니다.

양식 필드에 포커스가 있는 동안 `Enter` 키를 누르면 `submit` 버튼 클릭을 시뮬레이션합니다. 양식에 **제출** 버튼 앞에 버튼을 포함하고 유형을 지정하지 않으면 해당 버튼은 양식의 버튼에 대한 기본 유형(`submit`)을 가지며 양식이 제출되기 전에 클릭 이벤트를 수신합니다. 이에 대한 예는 [데모](https://enter-button.glitch.me/)를 보고 양식을 채운 다음 `Enter`를 누릅니다. {% endAside %}

### 입력을 두 배로 늘리지 않기 {: #no-double-inputs }

일부 사이트에서는 사용자가 이메일이나 비밀번호를 두 번 입력하도록 합니다. 그러면 일부 사용자의 오류가 줄어들 수 있지만 *모든* 사용자에게 추가 작업이 발생하고 [이탈률이 높아집니다](https://uxmovement.com/forms/why-the-confirm-password-field-must-die/). 브라우저가 이메일 주소를 자동 완성하거나 강력한 비밀번호를 제안하는 위치를 두 번 묻는 것도 의미가 없습니다. 사용자가 이메일 주소를 확인할 수 있도록 하고(어쨌든 그렇게 해야 함) 필요한 경우 비밀번호를 쉽게 재설정할 수 있도록 하는 것이 좋습니다.

## 요소 속성을 최대한 활용 {: #element-attributes }

마법이 실제로 일어나는 곳입니다! 브라우저에는 입력 요소 속성을 사용하는 여러 가지 유용한 내장 기능이 있습니다.

## 비밀번호를 비공개로 유지하되 사용자가 원할 때 비밀번호를 볼 수 있게 하기 {: #show-password }

비밀번호 텍스트를 숨기고 브라우저가 비밀번호용 입력임을 이해하는 데 도움이 되도록 비밀번호 입력에는 `type="password"`가 있어야 합니다. (브라우저는 입력 역할을 이해하고 비밀번호 저장을 제안할지 여부를 결정하기 위해 [다양한 기술](#autofill)을 사용합니다.)

사용자가 입력한 텍스트를 확인할 수 있도록 **비밀번호 표시** 아이콘 또는 버튼을 추가해야 하며 **비밀번호 분실** 링크를 추가하는 것을 잊지 마십시오. [비밀번호 표시 활성화](#password-display)를 참조하십시오.

<figure>{% Img src="image/admin/58suVe0HnSLaJvNjKY53.png", alt="비밀번호 표시 아이콘을 표시하는 Google 로그인 양식.", width="300", height="107" %} <figcaption>Google 로그인 양식에서 비밀번호 입력: <strong>비밀번호 표시</strong> 아이콘 및 <strong>비밀번호 찾기</strong> 링크가 있습니다.</figcaption></figure>

## 모바일 사용자에게 적합한 키보드 제공 {: #mobile-keyboards }

`<input type="email">`을 사용하여 모바일 사용자에게 적절한 키보드를 제공하고 브라우저에서 기본 내장 이메일 주소 유효성 검사를 활성화합니다. JavaScript가 필요하지 않습니다!

이메일 주소 대신 전화번호를 사용해야 하는 경우 `<input type="tel">`은 모바일에서 전화 키패드를 활성화합니다. `inputmode` 속성을 사용할 수도 있습니다 `inputmode="numeric"`은 PIN 번호에 이상적입니다. [입력 모드에 대해 알고 싶었던 모든 것](https://css-tricks.com/everything-you-ever-wanted-to-know-about-inputmode/)에서 더 자세한 정보를 얻을 수 있습니다.

{% Aside 'caution' %} `type="number"`는 위/아래 화살표를 추가하여 숫자를 증가시키므로 ID 및 계정 번호와 같이 증가할 의도가 없는 숫자에는 사용하지 마십시오. {% endAside %}

### 모바일 키보드가 **로그인** 버튼을 가리지 않도록 방지 {: #keyboard-obstruction }

유감스럽게도 조심하지 않으면 모바일 키보드가 양식을 덮거나 더 심하게는 **로그인** 버튼을 부분적으로 가리게 될 수 있습니다. 사용자는 무슨 일이 일어났는지 깨닫기도 전에 포기할 수 있습니다.

<figure>{% Img src="image/admin/rLo5sW9LBpTcJU7KNnb7.png", alt="Android 휴대전화 로그인 양식의 두 스크린샷: 제출 버튼이 휴대전화 키보드에 가려지는 방식을 보여주는 스크린샷", width="400", height="360" %}<figcaption><b>로그인</b> 버튼: 지금은 표시되지만 이제는 표시되지 않습니다.</figcaption></figure>

가능하면 **로그인** 페이지 상단에 이메일/전화 및 비밀번호 입력과 로그인 버튼만 표시하여 이를 방지하십시오. 아래에 다른 내용을 넣으십시오.

<figure>{% Img src="image/admin/0OebKiAP4sTgaXbcbvYx.png", alt="Android 휴대폰의 로그인 양식 스크린샷: 로그인 버튼이 휴대폰 키보드에 가려지지 않습니다.", width="200", height="342" %} <figcaption>키보드가 <b>로그인</b> 버튼을 가리지 않습니다.</figcaption></figure>

#### 다양한 기기에서 테스트 {: #devices }

대상 고객을 위해 다양한 장치에서 테스트하고 그에 따라 조정해야 합니다. BrowserStack을 사용하면 다양한 실제 장치 및 브라우저에서 [오픈 소스 프로젝트를 무료로 테스트](https://www.browserstack.com/open-source)할 수 있습니다.

<figure>{% Img src="image/admin/jToMlWgjS3J2WKmjs1hx.png", alt="iPhone 7, 8 및 11의 로그인 양식 스크린샷. iPhone 7 및 8의 로그인 버튼은 전화 키보드로 가려져 있지만 iPhone 11에는 없음", width="800", height="522" %}<figcaption><b>로그인</b> 버튼: iPhone 7 및 8에서는 가려져 있지만 iPhone 11에서는 보이지 않습니다.</figcaption></figure>

#### 두 페이지 사용 고려 {: #two-pages }

일부 사이트(Amazon 및 eBay 포함)는 두 페이지에 이메일/전화 및 비밀번호를 요청하여 문제를 방지합니다. 이 접근 방식은 또한 경험을 단순화합니다. 사용자는 한 번에 한 가지만 수행해야 합니다.

<figure>{% Img src="image/admin/CxpObjYZMs0MMFo66f4P.png", alt="Amazon 웹사이트의 로그인 양식 스크린샷: 두 개의 별도 '페이지'에 있는 이메일/전화 및 비밀번호.", width="400", height="385" %} <figcaption>2단계 로그인: 이메일 또는 전화, 비밀번호</figcaption></figure>

이상적으로는 단일 &lt;form&gt;으로 구현되어야 합니다. JavaScript를 사용하여 처음에 이메일 입력만 표시한 다음 숨기고 비밀번호 입력을 표시합니다. 사용자가 이메일과 비밀번호를 입력하는 사이에 새 페이지로 이동하도록 해야 하는 경우 두 번째 페이지의 양식에는 비밀번호 관리자가 올바른 값을 저장할 수 있도록 이메일 값과 함께 숨겨진 입력 요소가 있어야 합니다. [Chromium이 이해하는 비밀번호 양식 스타일](https://www.chromium.org/developers/design-documents/form-styles-that-chromium-understands)은 코드 예제를 제공합니다.

### 사용자가 데이터를 다시 입력하지 않도록 돕기 {: #autofill }

브라우저가 데이터를 올바르게 저장하고 입력을 자동 완성하도록 도와 사용자가 이메일 및 비밀번호 값을 입력하는 것을 기억할 필요가 없습니다. 이는 모바일에서 특히 중요하며 [포기율이 높은](https://www.formisimo.com/blog/conversion-rate-increases-57-with-form-analytics-case-study/) 이메일 입력에 중요합니다.

여기에는 두 부분이 있습니다.

1. `autocomplete` , `name` , `id` 및 `type` 속성은 브라우저가 나중에 자동 완성에 사용할 수 있는 데이터를 저장하기 위해 입력의 역할을 이해하는 데 도움이 됩니다. 자동 채우기를 위해 데이터를 저장할 수 있도록 최신 브라우저는 안정적인 `name` 또는 `id` 값(각 페이지 로드 또는 사이트 배포 시 무작위로 생성되지 않음)을 갖고 `submit` 버튼이 있는 &lt;form&gt; 형식이어야 하는 입력도 필요합니다.

2. `autocomplete` 속성은 브라우저가 저장된 데이터를 사용하여 입력을 올바르게 자동 완성하는 데 도움이 됩니다.

이메일 입력의 경우 `autocomplete="username"` . 왜냐하면 `type="email"`을 사용해야 하고 `id="email"` 및 `name="email"` `username`은 최신 브라우저의 비밀번호 관리자에 의해 인식되기 때문입니다.

비밀번호 입력의 경우 적절한 `autocomplete` 및 `id` 값을 사용하여 브라우저가 새 비밀번호와 현재 비밀번호를 구별할 수 있도록 합니다.

### 새 비밀번호 {: #new-password }에 `autocomplete="new-password"` 및 `id="new-password"` 사용

- `autocomplete="new-password"` 및 `id="new-password"`를 사용하거나 비밀번호 변경 양식의 새 비밀번호를 사용하세요.

### 기존 비밀번호 {: #current-password }에 `autocomplete="current-password"` 및 `id="current-password"` 사용

- 로그인 양식의 비밀번호 입력 또는 비밀번호 변경 양식의 사용자 이전 비밀번호 입력에 `autocomplete="current-password"` 및 `id="current-password"`를 사용하십시오. 이것은 사이트에 대해 저장된 현재 비밀번호를 사용하기를 원한다는 것을 브라우저에 알립니다.

가입 양식:

```html
<input type="password" autocomplete="new-password" id="new-password" …>
```

로그인:

```html
<input type="password" autocomplete="current-password" id="current-password" …>
```

{% Aside %} Chrome과 같은 브라우저는 브라우저의 비밀번호 관리자를 사용하여 재방문 사용자의 로그인 과정에서 필드를 자동 완성할 수 있습니다. 이러한 기능이 작동하려면 브라우저가 사용자가 비밀번호를 변경할 때 이를 구별할 수 있어야 합니다.

특히 새 비밀번호를 설정한 후 사용자 비밀번호 변경 양식을 지우거나 페이지에서 숨겨야 합니다. 비밀번호 변경이 발생한 후에도 사용자 비밀번호 변경 양식이 페이지에 계속 채워져 있으면 브라우저에서 업데이트를 기록하지 못할 수 있습니다. {% endAside %}

### 비밀번호 관리자 지원 {: #password-managers }

브라우저마다 이메일 자동 완성 및 비밀번호 제안을 다소 다르게 처리하지만 효과는 거의 동일합니다. 예를 들어 데스크톱의 Safari 11 이상에서는 비밀번호 관리자가 표시된 다음 가능한 경우 생체 인증(지문 또는 얼굴 인식)이 사용됩니다.

<figure>{% Img src="image/admin/UjBRRYaLbX9bh3LDFcAM.png", alt="데스크톱용 Safari의 3단계 로그인 프로세스 스크린샷: 비밀번호 관리자, 생체 인증, 자동 완성.", width="800", height="234" %} <figcaption>자동 완성으로 로그인 - 텍스트 입력이 필요하지 않습니다!</figcaption></figure>

데스크톱의 Chrome은 이메일 제안을 표시하고 비밀번호 관리자를 표시하며 비밀번호를 자동 완성합니다.

<figure>{% Img src="image/admin/mDm1cstWZB9jJDzMmzgE.png", alt="데스크톱용 Chrome 로그인 프로세스의 4단계 스크린샷: 이메일 완성, 이메일 제안, 비밀번호 관리자, 선택 시 자동 완성.", width="800", height="232" %} <figcaption>Chrome 84의 자동 완성 로그인 흐름.</figcaption></figure>

브라우저 비밀번호 및 자동 완성 시스템은 간단하지 않습니다. 값을 추측, 저장 및 표시하는 알고리즘은 표준화되지 않았으며 플랫폼마다 다릅니다. 예를 들어, [Hidde de Vries](https://hiddedevries.nl/en/blog/2018-01-13-making-password-managers-play-ball-with-your-login-form)가 지적한 바와 같이: "Firefox의 비밀번호 관리자는 [레시피 시스템](https://bugzilla.mozilla.org/show_bug.cgi?id=1119454)으로 휴리스틱을 보완합니다."

[자동 완성: 웹 개발자가 알아야 하지만](https://cloudfour.com/thinks/autofill-what-web-devs-should-know-but-dont) `name` 및 `autocomplete` 사용에 대한 추가 정보가 없습니다. [HTML 사양](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#inappropriate-for-the-control)은 59개의 가능한 값을 모두 나열합니다.

{% Aside %} 가입 및 로그인 양식에서 `input` , `select` 및 `textarea` 요소는 물론 `form` 요소 자체에 `name` 과 `id` 값을 사용하여 비밀번호 관리자를 도울 수 있습니다. {% endAside %}

### 브라우저에 강력한 비밀번호 제안 가능 {: #password-suggestions }

최신 브라우저는 경험적 방법을 사용하여 비밀번호 관리자 UI를 표시하고 강력한 비밀번호를 제안할 시기를 결정합니다.

다음은 Safari가 데스크톱에서 수행하는 방법입니다.

<figure>{% Img src="image/admin/B1DlZK0CllVjrOUbb5xB.png", alt="데스크톱의 Firefox 비밀번호 관리자 스크린샷", width="800", height="229" %} <figcaption>Safari의 비밀번호 제안 흐름.</figcaption></figure>

(강력한 고유 비밀번호 제안은 버전 12.0부터 Safari에서 사용할 수 있습니다.)

내장된 브라우저 비밀번호 생성기는 사용자와 개발자가 "강력한 비밀번호"가 무엇인지 알아낼 필요가 없음을 의미합니다. 브라우저는 비밀번호를 안전하게 저장하고 필요에 따라 자동 완성할 수 있으므로 사용자가 비밀번호를 기억하거나 입력할 필요가 없습니다. 사용자가 내장된 브라우저 비밀번호 생성기를 활용하도록 권장하면 사이트에서 고유하고 강력한 비밀번호를 사용할 가능성이 높아지고 다른 곳에서 손상될 수 있는 비밀번호를 재사용할 가능성이 줄어듭니다.

{% Aside %} 이 접근 방식의 단점은 플랫폼 간에 비밀번호를 공유할 수 있는 방법이 없다는 것입니다. 예를 들어 사용자는 iPhone에서 Safari를 사용하고 Windows 노트북에서 Chrome을 사용할 수 있습니다. {% endAside %}

### 실수로 누락된 입력으로부터 사용자를 저장하도록 돕기 {: #required-fields }

이메일 및 비밀번호 필드 모두에 `required` 속성을 추가하십시오. 최신 브라우저는 누락된 데이터에 대해 자동으로 메시지를 표시하고 초점을 설정합니다. JavaScript가 필요하지 않습니다!

<figure>{% Img src="image/admin/n5Nr290upVmQGvlc263U.png", alt="데스크톱 Firefox 및 Android용 Chrome의 스크린샷에 누락된 데이터에 대한 '이 필드를 작성하십시오' 프롬프트가 표시됩니다.", width="600", height="392" %} <figcaption>데스크톱용 Firefox(버전 76) 및 Android용 Chrome(버전 83)에서 누락된 데이터에 대한 프롬프트 및 포커스.</figcaption></figure>

## 손가락과 엄지손가락을 위한 디자인 {: #mobile-design }

입력 요소 및 버튼과 관련된 거의 모든 것에 대한 기본 브라우저 크기는 특히 모바일에서 너무 작습니다. 이것은 명백해 보일 수 있지만 많은 사이트의 로그인 양식에서 흔히 발생하는 문제입니다.

### 입력과 버튼이 충분히 큰지 확인 {: #tap-targets }

입력 및 버튼의 기본 크기와 패딩은 데스크톱에서 너무 작고 모바일에서는 더 작습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lJNO6w2dOyp4cYKl5b3y.png", alt="데스크톱용 Chrome 및 Android용 Chrome의 스타일이 지정되지 않은 양식 스크린샷", width="800", height="434" %}</figure>

[Android 접근성 지침](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB)에 따르면 터치스크린 개체의 권장 대상 크기는 7–10mm입니다. Apple 인터페이스 지침은 48x48 픽셀을 제안하고 W3C는 [최소 44x44 CSS 픽셀](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)을 제안합니다. 이를 기반으로 모바일의 경우 입력 요소 및 버튼에 약 15픽셀, 데스크톱에서 약 10픽셀의 패딩을 추가합니다. 실제 모바일 장치와 실제 손가락 또는 엄지 손가락으로 이것을 시도하십시오. 각 입력과 버튼을 편안하게 누를 수 있어야 합니다.

[탭 대상의 크기가 적절하지 않습니다.](https://developer.chrome.com/docs/lighthouse/seo/http-status-code/) Lighthouse 감사는 너무 작은 입력 요소를 감지하는 프로세스를 자동화하는 데 도움이 될 수 있습니다.

#### 엄지손가락을 위한 디자인 {: #design-for-thumbs }

[터치 대상](https://www.google.com/search?q=touch+target)을 검색하면 많은 집게손가락 사진을 볼 수 있습니다. 그러나 현실 세계에서 많은 사람들이 엄지손가락을 사용하여 휴대폰과 상호 작용합니다. 엄지손가락은 집게손가락보다 크고 컨트롤은 덜 정확합니다. 적절한 크기의 터치 대상에 대한 더 많은 이유입니다.

### 텍스트를 충분히 크게 만들기 {: #size-text-correctly }

크기 및 패딩과 마찬가지로 입력 요소 및 버튼의 기본 브라우저 글꼴 크기는 특히 모바일에서 너무 작습니다.

<figure>{% Img src="image/admin/EeIsqWhLbot15p4SYpo2.png", alt="데스크톱 및 Android의 Chrome에서 스타일이 지정되지 않은 양식의 스크린샷", width="800", height="494" %} <figcaption>데스크탑 및 모바일의 기본 스타일: 입력 텍스트가 너무 작아서 많은 사용자가 읽을 수 없습니다.</figcaption></figure>

다른 플랫폼의 브라우저는 글꼴 크기를 다르게 지정하므로 모든 곳에서 잘 작동하는 특정 글꼴 크기를 지정하기가 어렵습니다. 인기 있는 웹사이트에 대한 간단한 설문조사는 데스크톱에서 13-16픽셀 크기를 보여줍니다. 모바일에서 텍스트의 경우 물리적 크기와 일치하는 것이 좋은 최소값입니다.

즉, 모바일에서는 더 큰 픽셀 크기를 사용해야 합니다. `16px`는 꽤 읽을 수 있지만 시력이 좋아도 Android용 Chrome에서는 `16px` [미디어 쿼리](https://developers.google.com/web/fundamentals/design-and-ux/responsive#apply_media_queries_based_on_viewport_size)를 사용하여 다양한 표시 영역 크기에 대해 다른 글꼴 픽셀 크기를 설정할 수 있습니다. `20px`가 적당하지만 시력이 좋지 않은 친구나 동료와 함께 테스트해야 합니다.

[문서에서 읽을 수 있는 글꼴 크기를 사용하지 않습니다.](https://developer.chrome.com/docs/lighthouse/seo/font-size/) Lighthouse 감사를 사용하면 너무 작은 텍스트를 감지하는 프로세스를 자동화할 수 있습니다.

### 입력 사이에 충분한 공간 제공 {: #size-margins-correctly }

입력이 터치 대상으로 잘 작동하도록 충분한 여백을 추가합니다. 즉, 여백의 손가락 너비 정도를 목표로 합니다.

### 입력이 명확하게 보이는지 확인 {: #visible-inputs }

입력에 대한 기본 테두리 스타일은 입력을 보기 어렵게 만듭니다. Android용 Chrome과 같은 일부 플랫폼에서는 거의 보이지 않습니다.

패딩뿐만 아니라 테두리를 추가합니다. 흰색 배경에 `#ccc` 또는 더 어두운 색을 사용하는 것이 일반적인 규칙입니다.

<figure>{% Img src="image/admin/OgDJ5V2N7imHXSBkN4pr.png", alt="Android의 Chrome에서 스타일이 지정된 양식의 스크린샷.", width="250", height="525" %} <figcaption>읽기 쉬운 텍스트, 눈에 보이는 입력 테두리, 적절한 패딩 및 여백.</figcaption></figure>

### 내장 브라우저 기능을 사용하여 잘못된 입력 값 경고 {: #built-in-validation }

브라우저에는 `type` 속성에 대한 기본 양식 유효성 검사를 수행하는 기능이 내장되어 있습니다. 브라우저는 잘못된 값으로 양식을 제출할 때 경고하고 문제가 있는 입력에 초점을 맞춥니다.

<figure>{% Img src="image/admin/Phf9m5J66lIX9x5brzOL.png", alt="잘못된 이메일 값에 대한 브라우저 프롬프트 및 포커스를 표시하는 데스크톱의 Chrome 로그인 양식 스크린샷.", width="300", height="290" %} <figcaption>브라우저에 의한 기본 내장 유효성 검사.</figcaption></figure>

`:invalid` CSS 선택기를 사용하여 잘못된 데이터를 강조 표시할 수 있습니다. 내용이 없는 입력을 선택하지 않으려면 `:not(:placeholder-shown)`을 사용하십시오.

```css
input[type=email]:not(:placeholder-shown):invalid {
  color: red;
  outline-color: red;
}
```

유효하지 않은 값이 있는 입력을 강조 표시하는 다양한 방법을 시도해 보십시오.

## 필요한 경우 JavaScript 사용 {: #javascript }

### 비밀번호 표시 전환 {: #password-display }

사용자가 입력한 텍스트를 확인할 수 있도록 **비밀번호 표시** 아이콘 또는 버튼을 추가해야 합니다. 사용자가 입력한 텍스트를 볼 수 없으면 [사용성이 저하](https://www.nngroup.com/articles/stop-password-masking/)됩니다. [구현 계획](https://twitter.com/sw12/status/1251191795377156099)은 있지만 현재로서는 이를 수행할 수 있는 기본 제공 방법이 없습니다. 대신 JavaScript를 사용해야 합니다.

<figure><img src="./show-password-google.png" width="350" alt="비밀번호 표시 아이콘이 표시된 Google 로그인 양식."><figcaption> Google 로그인 양식: <strong>비밀번호 표시</strong> 아이콘 및 <strong>비밀번호 찾기</strong> 링크가 있습니다.</figcaption></figure>

다음 코드는 텍스트 버튼을 사용하여 **비밀번호 표시** 기능을 추가합니다.

HTML:

```html/2
<section>
  <label for="password">Password</label>
  <button id="toggle-password" type="button" aria-label="Show password as plain text. Warning: this will display your password on the screen.">Show password</button>
  <input id="password" name="password" type="password" autocomplete="current-password" required>
</section>
```

다음은 버튼을 일반 텍스트처럼 보이게 하는 CSS입니다.

```css
button#toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  /* Media query isn't shown here. */
  font-size: var(--mobile-font-size);
  font-weight: 300;
  padding: 0;
  /* Display at the top right of the container */
  position: absolute;
  top: 0;
  right: 0;
}
```

그리고 비밀번호를 보여주는 자바스크립트:

```js
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('toggle-password');

togglePasswordButton.addEventListener('click', togglePassword);

function togglePassword() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePasswordButton.textContent = 'Hide password';
    togglePasswordButton.setAttribute('aria-label',
      'Hide password.');
  } else {
    passwordInput.type = 'password';
    togglePasswordButton.textContent = 'Show password';
    togglePasswordButton.setAttribute('aria-label',
      'Show password as plain text. ' +
      'Warning: this will display your password on the screen.');
  }
}
```

최종 결과는 다음과 같습니다.

<figure>{% Img src="image/admin/x4NP9JMf1KI8PapQ9JFh.png", alt="Mac 및 iPhone 7의 Safari에서 비밀번호 텍스트 '버튼' 표시가 있는 로그인 양식 스크린샷.", width="800", height="468" %} <figcaption>Mac 및 iPhone 7의 Safari에서 <strong>비밀번호</strong> 텍스트 '버튼' 표시가 있는 로그인 양식.</figcaption></figure>

### 비밀번호 입력에 액세스할 수 있도록 설정 {: #accessible-password-inputs }

제약 조건을 설명하는 요소의 ID를 지정하여 비밀번호 규칙을 간략하게 `aria-describedby`를 사용하십시오. 스크린 리더는 레이블 텍스트, 입력 유형(비밀번호), 설명을 차례로 제공합니다.

```html
<input type="password" aria-describedby="password-constraints" …>
<div id="password-constraints">Eight or more characters with a mix of letters, numbers and symbols.</div>
```

**비밀번호 표시** 기능을 추가할 때 비밀번호가 표시될 것임을 경고하는 `aria-label`을 포함해야 합니다. 그렇지 않으면 사용자가 실수로 비밀번호를 공개할 수 있습니다.

```html/1-2
<button id="toggle-password"
        aria-label="Show password as plain text.
                    Warning: this will display your password on the screen.">
  Show password
</button>
```

다음 Glitch에서 두 ARIA 기능이 모두 작동하는 것을 볼 수 있습니다.

{% Glitch { id: 'sign-in-form', path: 'index.html', height: 480 } %}

[액세스 가능한 양식 만들기](https://webaim.org/techniques/forms/)에는 액세스 가능한 양식을 만드는 데 도움이 되는 추가 팁이 있습니다.

### 제출하기 전에 실시간으로 확인 {: #validation }

HTML 양식 요소 및 속성에는 기본 유효성 검사를 위한 기본 제공 기능이 있지만 사용자가 데이터를 입력하는 동안 및 양식 제출을 시도할 때 JavaScript를 사용하여 더욱 강력한 유효성 검사를 수행해야 합니다.

{% Aside 'warning' %} 클라이언트측 유효성 검사는 사용자가 데이터를 입력하는 데 도움이 되며 불필요한 서버 로드를 방지할 수 있지만 항상 백엔드에서 데이터를 유효성 검사하고 삭제해야 합니다. {% endAside %}

로그인 양식 코드랩의 [5단계](https://glitch.com/edit/#!/sign-in-form-codelab-5)에서는 [Constraint Validation API](https://html.spec.whatwg.org/multipage/forms.html#constraints)([광범위하게 지원됨](https://caniuse.com/#feat=constraint-validation))를 사용하여 기본 제공 브라우저 UI를 사용하여 사용자 지정 유효성 검사를 추가하여 포커스를 설정하고 프롬프트를 표시합니다.

자세히 알아보기: [보다 복잡한 실시간 유효성 검사를 위해 JavaScript를 사용하십시오](https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation).

### 분석 및 RUM {: #analytics }

"측정할 수 없는 것은 개선할 수 없습니다"는 가입 및 로그인 양식에 특히 해당됩니다. 목표를 설정하고, 성공을 측정하고, 사이트를 개선하고, 반복해야 합니다.

[할인 사용성 테스트](https://www.nngroup.com/articles/discount-usability-20-years/)는 변경 사항을 시도하는 데 도움이 될 수 있지만 사용자가 가입 및 로그인 양식을 경험하는 방식을 실제로 이해하려면 실제 데이터가 필요합니다.

- **페이지 분석**: 가입 및 로그인 페이지 조회수, 이탈률 및 이탈.
- **상호 작용 분석**: [목표 유입 경로](https://support.google.com/analytics/answer/6180923?hl=en)(사용자가 로그인 또는 로그인 흐름을 포기하는 위치) 및 [이벤트](https://developers.google.com/analytics/devguides/collection/gtagjs/events)(사용자가 양식과 상호 작용할 때 취하는 작업은 무엇입니까?)
- **웹 사이트 성능**: [사용자 중심 메트릭](/user-centric-performance-metrics)(어떤 이유로 가입 및 로그인 양식이 느리고, 그렇다면 원인은 무엇입니까?).

가입 및 로그인에 대한 다양한 접근 방식을 시도하기 위해 A/B 테스트를 구현하고 모든 사용자에게 변경 사항을 릴리스하기 전에 일부 사용자의 변경 사항을 검증하기 위한 단계적 출시를 고려할 수도 있습니다.

## 일반 지침 {: #general-guidelines }

잘 설계된 UI 및 UX는 로그인 양식 포기를 줄일 수 있습니다.

- 사용자가 로그인을 찾도록 만들지 마십시오! **로그인** , **계정 만들기** 또는 **등록**과 같이 잘 알려진 문구를 사용하여 페이지 상단에 로그인 양식에 대한 링크를 넣으십시오.
- 집중하세요! 가입 양식은 제안 및 기타 사이트 기능으로 사람들의 주의를 산만하게 하는 곳이 아닙니다.
- 가입 복잡성을 최소화합니다. 다른 사용자 데이터(예: 주소 또는 신용 카드 세부 정보)는 사용자가 해당 데이터를 제공함으로써 얻을 수 있는 분명한 이점이 있는 경우에만 수집합니다.
- 사용자가 가입 양식을 작성하기 전에 가치 제안이 무엇인지 명확히 하십시오. 로그인하면 어떤 이점이 있습니까? 사용자에게 가입 완료에 대한 구체적인 인센티브를 제공합니다.
- 일부 사용자는 이메일을 사용하지 않을 수 있으므로 가능하면 사용자가 이메일 주소 대신 휴대전화 번호로 자신을 식별할 수 있도록 합니다.
- 사용자가 비밀번호를 쉽게 재설정할 수 있도록 하고 **비밀번호를 잊어버리셨습니까?** 링크를 만들어야 합니다.
- 서비스 약관 및 개인 정보 보호 정책 문서에 대한 링크: 처음부터 사용자에게 데이터를 보호하는 방법을 명확히 하십시오.
- 가입 및 로그인 페이지에 회사 또는 조직의 로고와 이름을 포함하고 언어, 글꼴 및 스타일이 사이트의 나머지 부분과 일치하는지 확인하십시오. 일부 양식은 특히 URL이 크게 다른 경우 다른 콘텐츠와 동일한 사이트에 속해 있다고 느껴지지 않습니다.

## 학습 계속 {: #resources }

- [놀라운 양식 만들기](/learn/forms/)
- [모바일 양식 디자인 모범 사례](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [더 많은 기능을 갖춘 양식 컨트롤](/more-capable-form-controls)
- [액세스 가능한 양식 만들기](https://webaim.org/techniques/forms/)
- [Credential Management API를 사용하여 로그인 흐름 간소화](https://developer.chrome.com/blog/credential-management-api/)
- [WebOTP API로 웹에서 전화번호 확인](/web-otp/)

사진 제공: [Unsplash](https://unsplash.com)에서 [Meghan Schiereck](https://unsplash.com/photos/_XFObcM_7KU)
