---
layout: post
title: 웹용 Contact Picker
subhead: Contact Picker API는 사용자가 자신의 연락처 목록에 있는 연락처를 쉽게 공유할 수 있는 방법을 제공합니다.
authors:
  - petelepage
description: 사용자 연락처에 대한 액세스는 (거의) 초기부터 있던 iOS/Android 앱의 기능입니다. Contact Picker API는 사용자가 자신의 연락처 목록에서 항목을 선택하고 선택한 연락처의 제한된 세부 정보를 웹 사이트와 공유할 수 있도록 하는 주문형 API입니다. 이를 통해 사용자는 원하는 시간에 원하는 내용만 공유할 수 있으며 사용자가 친구 및 가족에게 더 쉽게 도달하고 연결할 수 있습니다.
date: 2019-08-07
updated: 2021-02-23
tags:
  - blog
  - capabilities
hero: image/admin/K1IN7zWIjFLjZzJ4Us3J.jpg
alt: 노란색 배경에 전화기입니다.
feedback:
  - api
---

## Contact Picker API란 무엇입니까? {: #what }

&lt;style&gt; #video-demo { max-height: 600px; } &lt;/style&gt;

<figure data-float="right">{% Video src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZYR1SBlPglRDE69Xt2xl.mp4", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/8RbG1WcYhSLn0MQoQjZe.webm"], poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rif9Fh8w8SR78PcVXCO1.jpg", loop=true, autoplay=true, muted=true, linkTo=true, id="video-demo", playsinline=true %}</figure>

모바일 장치에서 사용자의 연락처에 대한 액세스는 (거의) 초기부터 있던 iOS/Android 앱의 기능입니다. 웹 개발자로부터 가장 많이 듣는 기능 요청 중 하나이며 iOS/Android 앱을 빌드하는 주요 이유이기도 합니다.

Android의 Chrome 80에서 사용할 수 있는 [Contact Picker API](https://wicg.github.io/contact-api/spec/)는 사용자가 자신의 연락처 목록에서 항목을 선택하고 선택한 항목의 제한된 세부 정보를 웹 사이트와 공유할 수 있도록 하는 주문형 API입니다. 이를 통해 사용자는 원하는 시간에 원하는 내용만 공유할 수 있으며 사용자가 친구 및 가족에게 더 쉽게 도달하고 연결할 수 있습니다.

예를 들어 웹 기반 이메일 클라이언트는 Contact Picker API를 사용하여 이메일 수신자를 선택할 수 있습니다. Voice-over-IP 앱은 전화를 걸 전화 번호를 조회할 수 있습니다. 또는 소셜 네트워크는 사용자가 이미 가입한 친구를 찾는 데 도움이 될 수 있습니다.

{% Aside 'caution' %} Chrome 팀은 사람들이 선택한 내용만 브라우저에서 공유할 수 있도록 Contact Picker API의 설계 및 구현에 많은 고민을 했습니다. 아래 [보안 및 개인 정보 보호](#security-considerations) 섹션을 참조하십시오. {% endAside %}

## 현재 상태 {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">단계</th>
<th data-md-type="table_cell">상태</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. 설명자 만들기</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/contact-api/" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 사양의 초안 작성</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/contact-api/spec/" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. 피드백 수집 및 설계 반복</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/contact-api/spec/" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. 원본 평가판</td>
<td data-md-type="table_cell"><a>완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. 출시</strong></td>
<td data-md-type="table_cell">
<strong data-md-type="double_emphasis">Chrome 80</strong><br> Android에서만 사용할 수 있습니다.</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Contact Picker API 사용 {: #how-to-use }

Contact Picker API는 원하는 연락처 정보 유형을 지정하는 옵션 매개변수가 있는 메서드 호출을 필요로 합니다. 두 번째 방법은 기본 시스템이 제공할 정보를 알려줍니다.

{% Aside %} [Contact Picker API 데모](https://contact-picker.glitch.me)와 [소스](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0)를 확인하세요. {% endAside %}

### 기능 감지

Contact Picker API가 지원되는지 확인하려면 다음을 사용하세요.

```js
const supported = ('contacts' in navigator && 'ContactsManager' in window);
```

또한 Android에서 Contact Picker를 사용하려면 Android M 이상이 필요합니다.

### Contact Picker 열기

Contact Picker API의 진입점은 `navigator.contacts.select()` 입니다. 호출되면 프라미스를 반환하고 Contact Picker를 표시하여 사용자가 사이트와 공유할 연락처를 선택할 수 있도록 합니다. 공유할 항목을 선택하고 **완료**를 클릭하면 프라미스는 사용자가 선택한 연락처 배열을 처리합니다.

`select()`를 호출할 때 첫 번째 매개변수로 반환하려는 속성 배열(허용되는 값: `'name'`, ` 'email'`, `'tel'`, `'address'` 또는 `'icon'`)과 선택적으로 여러 연락처를 두 번째 매개변수로 선택할 수 있는지 여부를 제공해야 합니다.

```js
const props = ['name', 'email', 'tel', 'address', 'icon'];
const opts = {multiple: true};

try {
  const contacts = await navigator.contacts.select(props, opts);
  handleResults(contacts);
} catch (ex) {
  // Handle any errors here.
}
```

{% Aside 'caution' %} `'address'` 및 `'icon'`을 지원하려면 Chrome 84 이상이 필요합니다. {% endAside %}

Contact Picker API는 [안전한](https://w3c.github.io/webappsec-secure-contexts/) 최상위 탐색 컨텍스트에서만 호출할 수 있으며 다른 강력한 API와 마찬가지로 사용자 동작이 필요합니다.

### 사용 가능한 속성 감지

사용 가능한 속성을 감지하려면 `navigator.contacts.getProperties()`를 호출합니다. 사용 가능한 속성을 나타내는 문자열 배열을 처리하는 프라미스를 반환합니다. 예: `['name', 'email', 'tel', 'address']`. 이러한 값을 `select()`로 전달할 수 있습니다.

속성은 항상 사용할 수 있는 것은 아니며 새 속성이 추가될 수도 있습니다. 나중에는 다른 플랫폼 및 연락처 소스에서 공유되는 속성을 제한할 수도 있습니다.

### 결과 처리

Contact Picker API는 연락처 배열을 반환하고 각 연락처에는 요청된 속성의 배열이 포함됩니다. 연락처에 요청된 속성에 대한 데이터가 없거나 사용자가 특정 속성을 공유하지 않도록 선택하는 경우 API는 빈 배열을 반환합니다. ([사용자 제어](#security-control) 섹션을 통해 사용자가  속성을 선택하는 방법을 설명합니다.)

예를 들어 사이트에서 `name`, `email`, `tel`을 요청하고 사용자가 이름 필드에 데이터가 있는 단일 연락처를 선택하는 경우 두 개의 전화번호를 제공하지만 이메일 주소가 없는 경우 반환되는 응답은 다음과 같습니다.

```json
[{
  "email": [],
  "name": ["Queen O'Hearts"],
  "tel": ["+1-206-555-1000", "+1-206-555-1111"]
}]
```

{% Aside 'caution' %} 연락처 필드의 레이블 및 기타 의미 체계 정보는 삭제됩니다. {% endAside %}

## 보안 및 권한 {: #security-considerations }

Chrome 팀은 사용자 제어, 투명성, 인체 공학을 포함하여 [강력한 웹 플랫폼 기능에 대한 액세스 제어](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md)에 정의된 핵심 원칙을 사용하여 Contact Picker API를 설계하고 구현했습니다. 각각에 대해 설명하겠습니다.

### 사용자 제어 {: #security-control }

사용자 연락처에 대한 액세스는 선택기를 통해 이루어지며 [안전한](https://w3c.github.io/webappsec-secure-contexts/) 최상위 탐색 컨텍스트에서 사용자 동작으로만 호출할 수 있습니다. 이렇게 하면 사이트가 페이지 로드 시 선택기를 표시하거나 컨텍스트 없이 선택기를 무작위로 표시할 수 없습니다.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EiHIOYdno52DZ6TNHcfI.jpg", alt="스크린샷, 사용자는 공유할 속성을 선택할 수 있습니다.", width="800", height="639" %} <figcaption> 사용자는 일부 속성을 공유하지 않도록 선택할 수 있습니다. 이 스크린샷에서 사용자는 '전화번호' 버튼의 선택을 해제했습니다. 사이트에서 전화번호를 요청하더라도 사이트와 공유되지 않습니다. </figcaption></figure>

사용자가 특정 웹사이트에 대해 공유해야 하는 연락처만 선택할 수 있도록 모든 연락처를 일괄 선택하는 옵션은 없습니다. 사용자는 선택기 상단에 있는 속성 버튼을 토글하여 사이트와 공유되는 속성을 제어할 수도 있습니다.

### 투명성 {: #security-transparency }

공유되는 연락처 세부 정보를 명확히 하기 위해 선택기는 항상 연락처의 이름 및 아이콘과 함께 사이트에서 요청한 모든 속성을 표시합니다. 예를 들어 사이트에서 `name`, `email`, `tel`을 요청하면 세 가지 속성이 모두 선택기에 표시됩니다. 또는 사이트에서 `tel`만 요청하는 경우 선택기에 이름과 전화번호만 표시됩니다.

<div class="switcher">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ig9SBKtJPlSE3mCjR2Go.jpg", alt="사이트에 대해 모든 속성을 요청하는 선택기 스크린샷.", width="800", height="639" %} <figcaption> 선택기, 사이트에서 <code>name</code>, <code>email</code>, <code>tel</code>를 요청, 하나의 연락처가 선택됨. </figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vOB2nPSrfi1GnmtitElf.jpg", alt="사이트에 대해 전화번호만 요청하는 선택기의 스크린샷.", width="800", height="639" %} <figcaption> 선택기, <code>tel</code>만 요청하는 사이트, 하나의 연락처가 선택됨. </figcaption></figure>
</div>

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qLxdnKZwW0e4teyw2OOU.jpg", alt="연락처를 길게 눌렀을 때의 선택기 스크린샷.", width="800", height="389" %} <figcaption> 연락처를 길게 눌렀을 경우의 결과. </figcaption></figure>

연락처를 길게 누르면 연락처를 선택할 경우 공유되는 모든 정보가 표시됩니다. (Cheshire Cat 연락처 이미지 참조.)

### 권한 지속성 없음 {: #security-persistence }

연락처에 대한 액세스는 주문형이며 지속되지 않습니다. 사이트에서 액세스를 원할 때마다 사용자 동작으로 `navigator.contacts.select()`를 호출해야 하며 사용자는 사이트와 공유할 연락처를 개별적으로 선택해야 합니다.

## 피드백 {: #feedback }

Chrome 팀은 Contact Picker API에 대한 귀하의 경험을 듣고 싶습니다.

### 구현에 문제가 있습니까?

Chrome 구현에서 버그를 찾으셨나요? 아니면 구현이 사양과 다른가요?

- [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EContacts)에서 버그를 신고하세요. 가능한 한 많은 세부 정보를 포함하고 버그를 재현하기 위한 간단한 지침을 제공하고 *구성요소*를 `Blink>Contacts`로 설정해 주세요. [Glitch](https://glitch.com)는 빠르고 쉽게 문제 재현을 공유하는 데 유용합니다.

### API를 사용할 계획이 있으신가요?

Contact Picker API를 사용할 계획입니까? Chrome 팀이 기능의 우선 순위를 정하고 브라우저 공급업체에 이 API의 지원이 얼마나 중요한지 보여주기 위해서는 여러분의 공개 지원이 큰 힘이 됩니다.

- [WICG Discourse 스레드](https://discourse.wicg.io/t/proposal-contact-picker-api/3507)에서 사용 계획을 공유하세요.
- [`#ContactPicker`](https://twitter.com/search?q=%23ContactPicker&src=typed_query&f=live)로 해시태그 [@ChromiumDev](https://twitter.com/chromiumdev)를 포함한 트윗을 보내서 어디에서 어떻게 활용하고 있는지 알려주세요.

## 유용한 링크 {: #helpful }

- [공개 설명문](https://github.com/WICG/contact-api/)
- [Contact Picker 사양](https://wicg.github.io/contact-api/spec/)
- [Contact Picker API 데모](https://contact-picker.glitch.me) 및 [Contact Picker API 데모 소스](https://glitch.com/edit/#!/contact-picker?path=demo.js:20:0)
- [버그 추적](https://bugs.chromium.org/p/chromium/issues/detail?id=860467)
- [ChromeStatus.com 항목](https://www.chromestatus.com/feature/6511327140904960)
- Blink 구성 요소: `Blink>Contacts`

### 감사의 말

이 기능을 구현하고 있는 Finnur Thorarinsson과 Rayan Kanso, 그리고 데모를 위해 뻔뻔하지만 제가 [코드](https://tests.peter.sh/contact-api/)를 <strike>도용하고</strike> 리팩토링한 대상인 Peter Beverloo에게 감사의 인사를 전합니다.

추신: 제 Contact Picker의 이름은 이상한 나라의 앨리스에 나오는 캐릭터에서 가져왔습니다.
