---
layout: post
title: 이색적인 HID 장치에 연결
subhead: WebHID API를 사용하면 웹사이트에서 대체 보조 키보드와 이색적인 게임패드에 액세스할 수 있습니다.
authors:
  - beaufortfrancois
date: 2020-09-15
updated: 2021-02-27
hero: image/admin/05NRg2Lw0w5Rv6TToabY.jpg
thumbnail: image/admin/AfLwyZZbL7bh4S4RikYi.jpg
alt: Elgato Stream Deck 사진.
description: WebHID API를 사용하면 웹사이트에서 대체 보조 키보드와 이색적인 게임패드에 액세스할 수 있습니다.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webhid
---

{% Aside 'success' %} [기능 프로젝트](https://developer.chrome.com/blog/fugu-status/)의 일부인 WebHID API는 Chrome 89에서 출시되었습니다. {% endAside %}

시스템의 장치 드라이버에서 액세스할 수 없을 만큼 너무 새롭거나 너무 오래되었거나 너무 희귀한 대체 키보드 또는 이색적 게임패드와 같은 휴먼 인터페이스 장치(HID)는 모두 열거할 수 없을 정도로 많습니다. WebHID API는 JavaScript에서 장치별 로직을 구현하는 수단을 제공함으로써 이 문제를 해결합니다.

## 제안된 사용 사례 {: #use-cases }

HID 장치는 인간으로부터 입력을 받거나 인간에게 출력을 제공합니다. 장치의 예로는 키보드, 포인팅 장치(마우스, 터치스크린 등) 및 게임패드 등이 있습니다. [HID 프로토콜](https://www.usb.org/hid)은 운영 체제 드라이버를 사용하여 데스크톱 컴퓨터에서 이러한 장치에 액세스할 수 있게 해줍니다. 웹 플랫폼은 이러한 드라이버에 의존하여 HID 장치를 지원합니다.

일반적이지 않은 HID 장치에 액세스할 수 없는 상황은 대체 보조 키보드(예: [Elgato Stream Deck](https://www.elgato.com/en/gaming/stream-deck), [Jabra 헤드셋](https://www.jabra.com/business/office-headsets), [X-keys](https://xkeys.com/xkeys.html)) 및 이색적 게임패드 지원과 관련된 경우에 특히 큰 장벽으로 다가옵니다. 데스크톱용으로 설계된 게임패드는 게임패드 입력(버튼, 조이스틱, 트리거) 및 출력(LED, 럼블)에 HID를 사용하는 경우가 많습니다. 안타깝게도 게임패드 입력 및 출력은 표준화가 잘 수립되지 않았으며 웹 브라우저에 종종 특정 장치에 대한 사용자 정의 로직이 필요합니다. 이는 지속 가능하지 않으며 오래되고 흔하지 않은 많은 장치들이 제대로 지원되지 않는 결과로 이어집니다. 또한 브라우저가 특정 장치의 특이한 동작에 의존하게 됩니다.

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
<td data-md-type="table_cell"><a href="https://github.com/WICG/webhid/blob/master/EXPLAINER.md" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 사양 초안 작성</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/webhid/" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. 피드백 수렴 및 디자인 반복</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. 원본 평가판</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/register_trial/1074108511127863297" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. 출시</strong></td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">완료</strong></td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## 용어 {: #terminology }

HID는 보고서와 보고서 설명자의 두 가지 기본 개념으로 구성됩니다. 보고서는 장치와 소프트웨어 클라이언트 간에 교환되는 데이터입니다. 보고서 설명자는 장치가 지원하는 데이터의 형식과 의미를 설명합니다.

HID(Human Interface Device)는 인간으로부터 입력을 받거나 인간에게 출력을 제공하는 일종의 장치입니다. HID는 또한 설치 절차를 단순화하도록 설계된 호스트와 장치 간의 양방향 통신 표준인 HID 프로토콜을 참조합니다. HID 프로토콜은 원래 USB 장치용으로 개발되었지만 이후 블루투스를 비롯한 다른 많은 프로토콜에서 구현되었습니다.

애플리케이션과 HID 장치는 다음 세 가지 보고서 유형을 통해 바이너리 데이터를 교환합니다.

<div>
  <table>
    <thead>
      <tr>
        <th>보고서 유형</th>
        <th>설명</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>입력 보고서</td>
        <td>장치에서 애플리케이션으로 전송되는 데이터(예: 버튼이 눌림)</td>
      </tr>
      <tr>
        <td>출력 보고서</td>
        <td>애플리케이션에서 장치로 전송되는 데이터(예: 키보드 백라이트 켜기 요청)</td>
      </tr>
      <tr>
        <td>기능 보고서</td>
        <td>양방향으로 전송될 수 있는 데이터. 형식은 장치에 따라 다릅니다.</td>
      </tr>
    </tbody>
  </table>
</div>

보고서 설명자는 장치에서 지원하는 보고서의 바이너리 형식을 설명합니다. 구조는 계층적이며 최상위 컬렉션 내에서 보고서를 별개의 컬렉션으로 그룹화할 수 있습니다. 설명자의 [형식](https://gist.github.com/beaufortfrancois/583424dfef66be1ade86231fd1a260c7)은 HID 사양으로 정의됩니다.

HID 사용법은 표준화된 입력 또는 출력을 나타내는 숫자 값입니다. 사용법 값을 통해 장치는 장치의 의도된 용도와 보고서에서 각 필드의 목적을 설명할 수 있습니다. 예를 들어, 마우스의 왼쪽 버튼에 대한 사용법 값이 정의될 수 있습니다. 사용법은 또한 장치 또는 보고서의 상위 수준 범주를 나타내는 사용법 페이지로 구성됩니다.

## WebHID API 사용 {: #use }

### 기능 감지 {: #feature-detection }

WebHID API가 지원되는지 확인하려면 다음을 사용하세요.

```js
if ("hid" in navigator) {
  // The WebHID API is supported.
}
```

### HID 연결 열기 {: #open }

WebHID API는 입력을 기다릴 때 웹사이트 UI가 차단되는 것을 방지하기 위해 비동기로 설계되었습니다. HID 데이터는 언제든지 수신될 수 있어 여기에 수신 대기할 방법이 필요하기 때문에 비동기 작동이 중요합니다.

HID 연결을 열려면 먼저 `HIDDevice` 개체에 액세스합니다. 이를 위해, 사용자에게 `navigator.hid.requestDevice()`를 호출하여 장치를 선택하거나 웹사이트가 이전에 액세스 권한을 부여 받은 장치 목록을 반환하는 `navigator.hid.getDevices()` 중에서 하나를 선택하도록 메시지를 표시할 수 있습니다.

`navigator.hid.requestDevice()` 함수는 필터를 정의하는 필수 개체를 사용합니다. 이는 연결된 장치를 USB 공급업체 식별자(`vendorId`), USB 제품 식별자(`productId`), 사용법 페이지 값(`usagePage`) 및 사용법 값(`usage`)과 매칭시키는 데 사용됩니다. [USB ID 리포지토리](http://www.linux-usb.org/usb-ids.html) 및 [HID 사용법 테이블 문서](https://usb.org/document-library/hid-usage-tables-12)에서 이러한 정보를 얻을 수 있습니다.

이 함수에서 반환된 여러 `HIDDevice` 개체는 동일한 물리적 장치의 여러 HID 인터페이스를 나타냅니다.

```js
// Filter on devices with the Nintendo Switch Joy-Con USB Vendor/Product IDs.
const filters = [
  {
    vendorId: 0x057e, // Nintendo Co., Ltd
    productId: 0x2006 // Joy-Con Left
  },
  {
    vendorId: 0x057e, // Nintendo Co., Ltd
    productId: 0x2007 // Joy-Con Right
  }
];

// Prompt user to select a Joy-Con device.
const [device] = await navigator.hid.requestDevice({ filters });
```

```js
// Get all devices the user has previously granted the website access to.
const devices = await navigator.hid.getDevices();
```

<figure>   {% Img src="image/admin/gaZo8LxG3Y8eU2VirlZ4.jpg", alt="웹사이트의 HID 장치 프롬프트 스크린샷.", width="800", height="513" %}   <figcaption>Nintendo Switch Joy-Con을 선택하기 위한 사용자 프롬프트</figcaption></figure>

`HIDDevice` 개체에는 장치 식별을 위한 USB 공급업체 및 제품 식별자가 포함되어 있습니다. 해당 `collections` 속성은 장치의 보고서 형식에 대한 계층적 설명으로 초기화됩니다.

```js
for (let collection of device.collections) {
  // A HID collection includes usage, usage page, reports, and subcollections.
  console.log(`Usage: ${collection.usage}`);
  console.log(`Usage page: ${collection.usagePage}`);

  for (let inputReport of collection.inputReports) {
    console.log(`Input report: ${inputReport.reportId}`);
    // Loop through inputReport.items
  }

  for (let outputReport of collection.outputReports) {
    console.log(`Output report: ${outputReport.reportId}`);
    // Loop through outputReport.items
  }

  for (let featureReport of collection.featureReports) {
    console.log(`Feature report: ${featureReport.reportId}`);
    // Loop through featureReport.items
  }

  // Loop through subcollections with collection.children
}
```

`HIDDevice` 장치는 기본적으로 "닫힌" 상태로 반환되며 데이터를 보내거나 받으려면 먼저 `open()`를 호출하여 열어야 합니다.

```js
// Wait for the HID connection to open before sending/receiving data.
await device.open();
```

### 입력 보고서 수신 {: #receive-input-reports }

HID 연결이 수립되면 장치에서 `"inputreport"` 이벤트에 수신 대기하여 들어오는 입력 보고서를 처리할 수 있습니다. 이러한 이벤트에는 [`DataView`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) 개체(`data`), 이 개체가 속해 있는 HID 장치(`device`) 및 입력 보고서와 연결된 8비트 보고서 ID(`reportId`) 등의 HID 데이터가 포함됩니다.

<figure>{% Img src="image/admin/Hr4EXZcunl7r2TJwVvQ8.jpg", alt="빨간색 및 파란색 Nintendo Switch 사진.", width="800", height="575" %}<figcaption> Nintendo Switch Joy-Con 장치.</figcaption></figure>

이전 예제를 계속 이어서, 아래 코드는 사용자가 Joy-Con Right 장치에서 어떤 버튼을 눌렀는지 감지하는 방법을 보여줍니다. 아마 여러분도 집에서 시도해 볼 수 있을 겁니다.

```js
device.addEventListener("inputreport", event => {
  const { data, device, reportId } = event;

  // Handle only the Joy-Con Right device and a specific report ID.
  if (device.productId !== 0x2007 && reportId !== 0x3f) return;

  const value = data.getUint8(0);
  if (value === 0) return;

  const someButtons = { 1: "A", 2: "X", 4: "B", 8: "Y" };
  console.log(`User pressed button ${someButtons[value]}.`);
});
```

{% Glitch { id: 'webhid-joycon-button', path: 'script.js', height: 480, allow: 'hid' } %}

### 출력 보고서 보내기 {: #send-output-reports }

출력 보고서를 HID 장치로 보내려면 출력 보고서와 관련된 8비트 보고서 ID(`reportId`) 및 바이트를 `device.sendReport()`에 [`BufferSource`](https://developer.mozilla.org/docs/Web/API/BufferSource)(`data`)로 전달합니다. 보고서가 전송되면 반환된 promise가 확인됩니다. HID 장치가 보고서 ID를 사용하지 않는 경우 `reportId`를 0으로 설정합니다.

아래 예는 Joy-Con 장치에 적용되며 출력 보고서와 함께 럼블하게 만드는 방법을 보여줍니다.

```js
// First, send a command to enable vibration.
// Magical bytes come from https://github.com/mzyy94/joycon-toolweb
const enableVibrationData = [1, 0, 1, 64, 64, 0, 1, 64, 64, 0x48, 0x01];
await device.sendReport(0x01, new Uint8Array(enableVibrationData));

// Then, send a command to make the Joy-Con device rumble.
// Actual bytes are available in the sample below.
const rumbleData = [ /* ... */ ];
await device.sendReport(0x10, new Uint8Array(rumbleData));
```

{% Glitch { id: 'webhid-joycon-rumble', path: 'script.js', height: 480, allow: 'hid' } %}

### 기능 보고서 보내기 및 받기 {: #feature-reports }

기능 보고서는 양방향으로 이동할 수 있는 유일한 형태의 HID 데이터 보고서입니다. 이를 통해 HID 장치와 애플리케이션은 비표준 HID 데이터를 교환할 수 있습니다. 입력 및 출력 보고서와 달리 기능 보고서는 애플리케이션에서 정기적으로 수신하거나 전송하지 않습니다.

<figure>{% Img src="image/admin/QJiKwOCVAtUsAWUnqLxi.jpg", alt="검정색 및 은색 노트북 컴퓨터 사진.", width="800", height="575" %}<figcaption> 노트북 키보드</figcaption></figure>

기능 보고서를 HID 장치로 보내려면 기능 보고서와 관련된 8비트 보고서 ID(`reportId`) 및 바이트를 `device.sendFeatureReport()`에 [`BufferSource`](https://developer.mozilla.org/docs/Web/API/BufferSource)(`data`)로 전달합니다. 보고서가 전송되면 반환된 promise가 확인됩니다. HID 장치가 보고서 ID를 사용하지 않는 경우 `reportId`를 0으로 설정합니다.

다음은 기능 보고서의 예로서, Apple 키보드 백라이트 장치를 요청하고 열어서 깜박이게 하는 방법을 보여줍니다.

```js
const waitFor = duration => new Promise(r => setTimeout(r, duration));

// Prompt user to select an Apple Keyboard Backlight device.
const [device] = await navigator.hid.requestDevice({
  filters: [{ vendorId: 0x05ac, usage: 0x0f, usagePage: 0xff00 }]
});

// Wait for the HID connection to open.
await device.open();

// Blink!
const reportId = 1;
for (let i = 0; i < 10; i++) {
  // Turn off
  await device.sendFeatureReport(reportId, Uint32Array.from([0, 0]));
  await waitFor(100);
  // Turn on
  await device.sendFeatureReport(reportId, Uint32Array.from([512, 0]));
  await waitFor(100);
}
```

{% Glitch { id: 'webhid-apple-keyboard-backlight', path: 'script.js', height: 480, allow: 'hid' } %}

HID 장치에서 기능 보고서를 수신하려면 기능 보고서와 관련된 8비트 보고서 ID(`reportId`)를 `device.receiveFeatureReport()`로 전달합니다. 기능 보고서의 내용을 포함하는 [`DataView`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) 개체로 반환된 promise가 확인됩니다. HID 장치가 보고서 ID를 사용하지 않는 경우 `reportId`를 0으로 설정합니다.

```js
// Request feature report.
const dataView = await device.receiveFeatureReport(/* reportId= */ 1);

// Read feature report contents with dataView.getInt8(), getUint8(), etc...
```

### 연결 및 연결 해제에 수신 대기하기 {: #connection-disconnection }

웹사이트가 HID 장치에 액세스할 권한을 부여 받은 경우, `"connect"` 및 `"disconnect"` 이벤트에 수신 대기하여 연결 및 연결 해제 이벤트를 능동적으로 수신할 수 있습니다.

```js
navigator.hid.addEventListener("connect", event => {
  // Automatically open event.device or warn user a device is available.
});

navigator.hid.addEventListener("disconnect", event => {
  // Remove |event.device| from the UI.
});
```

## 개발자 팁 {: #dev-tips }

Chrome에서 HID를 디버깅하는 작업은 내부 페이지 `about://device-log`에서 쉽게 수행할 수 있습니다. 여기에서 모든 HID 및 USB 장치 관련 이벤트를 일목요연하게 볼 수 있습니다.

<figure>{% Img src="image/admin/zwpr1W7oDsRw0DKsFQ9D.jpg", alt="HID를 디버깅하기 위한 내부 페이지를 보여주는 스크린샷.", width="800", height="575" %}<figcaption> HID 디버깅을 위한 Chrome의 내부 페이지.</figcaption></figure>

## 브라우저 지원 {: #browser-support }

WebHID API는 Chrome 89의 모든 데스크톱 플랫폼(ChromeOS, Linux, macOS 및 Windows)에서 사용할 수 있습니다.

## 데모 {: #demos }

일부 WebHID 데모가 [web.dev/hid-examples](/hid-examples/)에 나열되어 있습니다. 직접 확인해 보세요!

## 보안 및 개인정보보호 {: #security-privacy }

사양 작성자는 사용자 제어, 투명성 및 인체 공학을 포함하여 [강력한 웹 플랫폼 기능에 대한 액세스 제어](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md)에 정의된 핵심 원칙을 사용하여 WebHID API를 설계하고 구현했습니다. 이 API를 사용하는 기능은 주로 한 번에 단일 HID 장치에만 액세스 권한을 부여하는 권한 모델에 의해 제어됩니다. 사용자 프롬프트에 대한 응답으로 사용자는 특정 HID 장치를 선택하기 위한 능동적인 조치를 취해야 합니다.

보안 상충 관계를 이해하려면 WebHID 사양의 [보안 및 개인정보보호 고려 사항](https://wicg.github.io/webhid/#security-and-privacy) 섹션을 확인하세요.

또한 Chrome은 각 최상위 컬렉션의 사용을 검사하고 최상위 컬렉션에 보호된 사용(예: 일반 키보드, 마우스)이 있는 경우 웹사이트는 해당 컬렉션에 정의된 어떤 보고서도 보내고 받을 수 없습니다. 보호된 사용의 전체 목록은 [공개적으로 이용 가능](https://source.chromium.org/chromium/chromium/src/+/master:services/device/public/cpp/hid/hid_usage_and_page.cc)합니다.

보안에 민감한 HID 기기(예: 더 강력한 인증에 사용되는 FIDO HID 기기)도 Chrome에서 차단됩니다. [USB 차단 목록](https://source.chromium.org/chromium/chromium/src/+/master:chrome/browser/usb/usb_blocklist.cc) 및 [HID 차단 목록](https://source.chromium.org/chromium/chromium/src/+/master:services/device/public/cpp/hid/hid_blocklist.cc) 파일을 참조하세요.

## 피드백 {: #feedback }

Chrome 팀은 WebHID API에 대한 여러분들의 생각과 경험을 듣고 싶습니다.

### API 디자인에 대해 알려주세요

API에 예상대로 작동하지 않는 부분이 있나요? 아니면 아이디어를 구현하는 데 필요하지만 찾을 수 없는 메서드나 속성이 있나요?

[WebHID API GitHub 리포지토리](https://github.com/wicg/webhid/issues)에 사양 이슈를 제출하거나 기존 이슈에 대한 여러분의 생각을 덧붙여주세요.

### 구현 문제 보고

Chrome 구현에서 버그를 찾으셨나요? 아니면 구현이 사양과 다른가요?

[https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EHID)에서 버그를 보고해 주세요. 가능한 한 많은 정보를 포함하고 버그를 재현하기 위한 간단한 지침을 제공해 주세요. *구성 요소*를 `Blink>HID`로 설정하는 것도 잊지 마세요. [Glitch](https://glitch.com)는 재현을 쉽고 빠르게 공유하는 데 훌륭합니다.

### 지원 표시

WebHID API를 사용할 계획인가요? Chrome 팀이 기능의 우선 순위를 정하고 브라우저 공급업체에 이 API의 지원이 얼마나 중요한지 보여주기 위해서는 여러분의 공개 지원이 힘이 됩니다.

[`#WebHID`](https://twitter.com/search?q=%23WebHID&src=typed_query&f=live) 해시태그로 [@ChromiumDev](https://twitter.com/chromiumdev)에 트윗을 보내어 이 API를 어디에서 어떻게 활용하고 있는지 알려주세요.

## 유용한 링크 {: #helpful }

- [사양](https://wicg.github.io/webhid/)
- [버그 추적](https://crbug.com/890096)
- [ChromeStatus.com 항목](https://chromestatus.com/feature/5172464636133376)
- Blink 구성 요소: [`Blink>HID`](https://chromestatus.com/features#component%3ABlink%3EHID)

## 감사의 말

이 글을 검토해준 [Matt Reynolds](https://github.com/nondebug)와 [Joe Medley](https://github.com/jpmedley)에게 감사드립니다. Unsplash에서 [Sara Kurfeß](https://unsplash.com/photos/jqpRECmiNEU)가 빨간색과 파란색의 Nintendo Switch 사진을, [Athul Cyriac Ajay](https://unsplash.com/photos/ndokCrfQWrI)가 검정색과 실버색의 노트북 컴퓨터 사진을 제공했습니다.
