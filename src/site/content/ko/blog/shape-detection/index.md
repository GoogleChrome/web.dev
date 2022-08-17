---
title: '모양 감지 API: 사진은 천 단어, 얼굴 및 바코드의 가치가 있습니다.'
subhead: 모양 감지 API는 이미지에서 얼굴, 바코드 및 텍스트를 감지합니다.
authors:
  - thomassteiner
description: 모양 감지 API는 이미지에서 얼굴, 바코드 및 텍스트를 감지합니다.
date: 2019-01-07
updated: 2021-02-23
tags:
  - blog
  - capabilities
  - origin-trials
  - progressive-web-apps
hero: image/admin/pcEIwc0D09iF7BPo3TT1.jpg
alt: 휴대폰으로 QR 코드를 스캔하는 중
origin-trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/-2341871806232657919"
feedback:
  - api
---

{% Aside %} 이 API는 새로운 [기능 프로젝트](https://developer.chrome.com/blog/capabilities/)의 일부입니다. Chrome 83에서 바코드 감지 기능이 출시되었습니다. 플래그 뒤에서 얼굴 및 텍스트 감지를 사용할 수 있습니다. 이 게시물은 Shape Detection API가 발전함에 따라 업데이트됩니다. {% endAside %}

## 모양 감지 API란 무엇입니까? {: #무엇 }

[`navigator.mediaDevices.getUserMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia) 및 Android용 Chrome [사진 선택기](https://bugs.chromium.org/p/chromium/issues/detail?id=656015)와 같은 API를 사용하면 장치 카메라에서 이미지 또는 라이브 비디오 데이터를 캡처하거나 로컬 이미지를 업로드하는 것이 상당히 쉬워졌습니다. 지금까지는 이미지에 얼굴, 바코드, 텍스트와 같은 흥미로운 기능이 많이 포함될 수 있지만 페이지의 정적 이미지뿐만 아니라 이 동적 이미지 데이터에 코드로 액세스할 수 없었습니다.

예를 들어 과거에는 개발자가 클라이언트에서 이러한 기능을 추출하여 [QR 코드 리더](https://qrsnapper.appspot.com/)를 구축하려면 외부 JavaScript 라이브러리에 의존해야 했습니다. 이것은 성능 관점에서 비용이 많이 들고 전체 페이지 무게를 증가시킬 수 있습니다. 반면에 Android, iOS 및 macOS를 포함한 운영 체제와 카메라 모듈에 있는 하드웨어 칩에는 일반적으로 Android [`FaceDetector`](https://developer.android.com/reference/android/media/FaceDetector) 또는 iOS 일반 기능 감지기인 [`CIDetector`](https://developer.apple.com/documentation/coreimage/cidetector?language=objc)와 같은 성능이 뛰어나고 최적화된 기능 감지기가 이미 있습니다.

[Shape Detection API](https://wicg.github.io/shape-detection-api)는 JavaScript 인터페이스 세트를 통해 이러한 구현을 노출합니다. 현재 지원되는 기능은 통해 얼굴 인식이다 `FaceDetector` 인터페이스를 관통 바코드 감지 `BarcodeDetector` 스루 인터페이스, 텍스트 감지 (광학 문자 인식 (OCR)) `TextDetector` 인터페이스.

{% Aside 'caution' %} 텍스트 감지는 흥미로운 분야임에도 불구하고 컴퓨팅 플랫폼이나 현재 표준화할 문자 집합에서 충분히 안정적이지 않은 것으로 간주되어 텍스트 감지가 별도의 [정보 사양](https://wicg.github.io/shape-detection-api/text.html)으로 옮겨졌습니다. {% endAside %}

### 제안된 사용 사례 {: #use-cases }

위에서 설명한 것처럼 모양 감지 API는 현재 얼굴, 바코드 및 텍스트 감지를 지원합니다. 다음 글머리 기호 목록에는 세 가지 기능 모두에 대한 사용 사례의 예가 포함되어 있습니다.

#### 얼굴 인식

- 온라인 소셜 네트워킹 또는 사진 공유 사이트는 일반적으로 사용자가 이미지에서 사람들에게 주석을 달 수 있도록 합니다. 감지된 얼굴의 경계를 강조 표시하여 이 작업을 용이하게 할 수 있습니다.
- 콘텐츠 사이트는 다른 경험적 방법에 의존하지 않고 잠재적으로 감지된 얼굴을 기반으로 이미지를 동적으로 자르거나, 스토리 형식의 [Ken Burns](https://en.wikipedia.org/wiki/Ken_Burns_effect)와 같은 패닝 및 확대/축소 효과로 감지된 얼굴을 강조 표시할 수 있습니다.
- 멀티미디어 메시징 사이트를 사용하면 사용자가 감지된 얼굴 랜드마크에 [선글라스나 콧수염](https://beaufortfrancois.github.io/sandbox/media-recorder/mustache.html) 과 같은 재미있는 물체를 오버레이할 수 있습니다.

#### 바코드 감지

- QR 코드를 읽는 웹 애플리케이션은 온라인 결제 또는 웹 탐색과 같은 흥미로운 사용 사례를 잠금 해제하거나 바코드를 사용하여 메신저 애플리케이션에서 소셜 연결을 설정할 수 있습니다.
- 쇼핑 앱을 사용하면 사용자가 [실제 상점에서 품목의 EAN](https://en.wikipedia.org/wiki/International_Article_Number) 또는 [UPC](https://en.wikipedia.org/wiki/Universal_Product_Code) 바코드를 스캔하여 온라인에서 가격을 비교할 수 있습니다.
- 공항에서는 승객이 탑승권의 [Aztec 코드](https://en.wikipedia.org/wiki/Aztec_Code)를 스캔하여 항공편과 관련된 개인화된 정보를 표시할 수 있는 웹 키오스크를 제공할 수 있습니다.

#### 텍스트 감지

- 온라인 소셜 네트워킹 사이트는 다른 설명이 제공되지 않을 때 감지된 텍스트를 `<img>` `alt` 속성으로 추가하여 사용자 생성 이미지 콘텐츠의 접근성을 향상시킬 수 있습니다.
- 콘텐츠 사이트는 텍스트 감지를 사용하여 포함된 텍스트가 있는 영웅 이미지 위에 제목을 배치하지 않도록 할 수 있습니다.
- 웹 애플리케이션은 텍스트 감지를 사용하여 레스토랑 메뉴와 같은 텍스트를 번역할 수 있습니다.

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
<td data-md-type="table_cell"><a href="https://docs.google.com/document/d/1QeCDBOoxkElAB0x7ZpM3VN3TQjS1ub1mejevd2Ik1gQ/edit" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 사양의 초기 초안 작성</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/shape-detection-api" data-md-type="link">진행 중</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">3. 피드백 수집 및 디자인 반복</strong></td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link"><strong data-md-type="double_emphasis">진행 중</strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. 오리진 트라이얼</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/view_trial/-2341871806232657919" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. 출시</strong></td>
<td data-md-type="table_cell">바코드 감지 <strong data-md-type="double_emphasis">완료</strong><br data-md-type="raw_html"> 얼굴 인식 <a href="https://www.chromestatus.com/feature/5678216012365824" data-md-type="link">진행 중</a><br data-md-type="raw_html"> 텍스트 감지 <a href="https://www.chromestatus.com/feature/5644087665360896" data-md-type="link">진행 중</a>
</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## 모양 감지 API 사용 방법 {: #use }

{% Aside 'warning' %} 지금까지는 Chrome 83부터 기본적으로 바코드 감지만 사용할 수 있지만 플래그 뒤에서 얼굴 및 텍스트 감지를 사용할 수 있습니다. `#enable-experimental-web-platform-features` 플래그를 활성화하여 로컬 실험에 항상 Shape Detection API를 사용할 수 있습니다. {% endAside %}

Shape Detection API를 로컬에서 `about://flags`의 `#enable-experimental-web-platform-features` 플래그를 활성화하세요.

`FaceDetector` , `BarcodeDetector` 및 `TextDetector` 세 가지 감지기 인터페이스는 모두 비슷합니다. [`ImageBitmapSource`](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#imagebitmapsource)를 입력(즉, [`CanvasImageSource`](https://html.spec.whatwg.org/multipage/canvas.html#canvasimagesource) ,[`Blob`](https://w3c.github.io/FileAPI/#dfn-Blob) 또는 [`ImageData`](https://html.spec.whatwg.org/multipage/canvas.html#imagedata))으로 받는 `detect()`라는 단일 비동기 메서드를 제공합니다.

`FaceDetector` 및 `BarcodeDetector`의 경우 기본 감지기에 힌트를 제공할 수 있도록 선택적 매개변수를 감지기의 생성자에 전달할 수 있습니다.

다양한 플랫폼에 대한 개요는 [설명자](https://github.com/WICG/shape-detection-api#overview)에서 지원 매트릭스를 주의 깊게 확인하십시오.

{% Aside 'gotchas' %} `ImageBitmapSource`의 [유효 스크립트 오리진](https://html.spec.whatwg.org/multipage/#concept-origin)이 문서의 유효 스크립트 오리진과 다를 경우, `detect()`를 호출하려고 하면 새 `SecurityError` [`DOMException`](https://heycam.github.io/webidl/#idl-DOMException)와 함께 실패합니다. 이미지 원본이 CORS를 지원하는 경우 [`crossorigin`](https://developer.mozilla.org/docs/Web/HTML/CORS_settings_attributes) 특성을 사용하여 CORS 액세스를 요청할 수 있습니다.<br>{% endAside %}

### `BarcodeDetector`로 작업 {: #barcodedetector}

`BarcodeDetector`는 `ImageBitmapSource` 및 경계 상자에서 찾은 바코드 원시 값과 탐지된 바코드 형식과 같은 기타 정보를 반환합니다.

```js
const barcodeDetector = new BarcodeDetector({
  // (Optional) A series of barcode formats to search for.
  // Not all formats may be supported on all platforms
  formats: [
    'aztec',
    'code_128',
    'code_39',
    'code_93',
    'codabar',
    'data_matrix',
    'ean_13',
    'ean_8',
    'itf',
    'pdf417',
    'qr_code',
    'upc_a',
    'upc_e'
  ]
});
try {
  const barcodes = await barcodeDetector.detect(image);
  barcodes.forEach(barcode => searchProductDatabase(barcode));
} catch (e) {
  console.error('Barcode detection failed:', e);
}
```

### `FaceDetector`로 작업 {: #facedetector}

`FaceDetector`는 `ImageBitmapSource` 에서 감지한 얼굴의 경계 상자를 항상 반환합니다. 플랫폼에 따라 눈, 코, 입과 같은 얼굴 랜드마크에 대한 추가 정보가 제공될 수 있습니다. 이 API는 얼굴만 감지한다는 점에 유의해야 합니다. 얼굴이 누구의 것인지 식별하지 않습니다.

```js
const faceDetector = new FaceDetector({
  // (Optional) Hint to try and limit the amount of detected faces
  // on the scene to this maximum number.
  maxDetectedFaces: 5,
  // (Optional) Hint to try and prioritize speed over accuracy
  // by, e.g., operating on a reduced scale or looking for large features.
  fastMode: false
});
try {
  const faces = await faceDetector.detect(image);
  faces.forEach(face => drawMustache(face));
} catch (e) {
  console.error('Face detection failed:', e);
}
```

### `TextDetector`로 작업 {: #textdetector}

`TextDetector`는 항상 감지된 텍스트의 경계 상자를 반환하며 일부 플랫폼에서는 인식된 문자를 반환합니다.

{% Aside 'caution' %} 텍스트 인식은 보편적으로 사용할 수 없습니다. {% endAside %}

```js
const textDetector = new TextDetector();
try {
  const texts = await textDetector.detect(image);
  texts.forEach(text => textToSpeech(text));
} catch (e) {
  console.error('Text detection failed:', e);
}
```

## 기능 감지 {: #featuredetection }

Shape Detection API를 감지하는 생성자의 존재 여부를 순수하게 확인하는 것만으로는 충분하지 않습니다. 인터페이스의 존재는 기본 플랫폼이 기능을 지원하는지 여부를 알려주지 않습니다. 이것은 [의도한 대로](https://crbug.com/920961) 작동합니다. 이것이 우리가 다음과 같이 기능 감지를 수행 *하여 방어적 프로그래밍* 접근 방식을 권장하는 이유입니다.

```js
const supported = await (async () => 'FaceDetector' in window &&
    await new FaceDetector().detect(document.createElement('canvas'))
    .then(_ => true)
    .catch(e => e.name === 'NotSupportedError' ? false : true))();
```

`BarcodeDetector` 인터페이스는 `getSupportedFormats()` 메소드를 포함하도록 업데이트되었으며 유사한 인터페이스가 [`FaceDetector`용](https://github.com/WICG/shape-detection-api/issues/53) 및 [`TextDetector`용](https://github.com/WICG/shape-detection-api/issues/57)에 제안되었습니다.

```js
await BarcodeDetector.getSupportedFormats();
/* On a macOS computer logs
  [
    "aztec",
    "code_128",
    "code_39",
    "code_93",
    "data_matrix",
    "ean_13",
    "ean_8",
    "itf",
    "pdf417",
    "qr_code",
    "upc_e"
  ]
*/
```

이를 통해 QR 코드 스캔과 같이 필요한 특정 기능을 감지할 수 있습니다.

```js
if (('BarcodeDetector' in window) &&
    ((await BarcodeDetector.getSupportedFormats()).includes('qr_code'))) {
  console.log('QR code scanning is supported.');
}
```

플랫폼 간에도 기능이 다를 수 있으므로 개발자가 필요한 기능(예: 특정 바코드 형식 또는 얼굴 랜드마크)을 정확하게 확인하도록 권장해야 하기 때문에 인터페이스를 숨기는 것보다 낫습니다.

## 운영 체제 지원 {: #os-support}

바코드 감지는 macOS, ChromeOS 및 Android에서 사용할 수 있습니다. Android에는 [Google Play 서비스](https://play.google.com/store/apps/details?id=com.google.android.gms)가 필요합니다.

## 모범 사례 {: #bestpractices}

모든 감지기는 비동기식으로 작동합니다. 즉, 메인 스레드를 차단하지 않습니다. 따라서 실시간 감지에 의존하지 말고 감지기가 작동할 시간을 허용하십시오.

[웹 작업자](https://developer.mozilla.org/docs/Web/API/Web_Workers_API)의 팬이라면 탐지기도 거기에 노출되어 있다는 사실을 알게 되어 기쁩니다. `postMessage()`를 통해 작업자에서 기본 앱으로 전달할 수 있습니다. [데모](https://shape-detection-demo.glitch.me/)는 이것을 실제로 보여줍니다.

모든 플랫폼 구현이 모든 기능을 지원하는 것은 아니므로 지원 상황을 주의 깊게 확인하고 API를 점진적 개선으로 사용하십시오. 예를 들어, 일부 플랫폼은 얼굴 감지 자체를 지원하지만 얼굴 랜드마크 감지(눈, 코, 입 등)는 지원하지 않을 수 있습니다. 또는 텍스트의 존재 및 위치는 인식될 수 있지만 텍스트 내용은 인식되지 않습니다.

{% Aside 'caution' %} 이 API는 최적화이며 모든 사용자가 플랫폼에서 사용할 수 있다고 보장되지 않습니다. 개발자는 이를 자체 [이미지 인식 코드](https://github.com/mjyc/opencv)와 결합하고 가능한 경우 플랫폼 최적화를 활용할 것으로 예상됩니다. {% endAside %}

## 피드백 {: #feedback }

Chrome 팀과 웹 표준 커뮤니티는 Shape Detection API에 대한 귀하의 경험을 듣고 싶어합니다.

### API 디자인에 대해 알려주십시오 {: .hide-from-toc }

API에 대해 예상한 대로 작동하지 않는 것이 있습니까? 아니면 아이디어를 구현하는 데 필요한 메서드나 속성이 누락되었습니까? 보안 모델에 대한 질문이나 의견이 있으십니까?

- [Shape Detection API GitHub 리포지토리](https://github.com/WICG/shape-detection-api/issues)에 사양 문제를 제출하거나 기존 문제에 생각을 추가하세요.

### 구현에 문제가 있습니까? {: .hide-from-toc }

Chrome 구현에서 버그를 찾으셨나요? 아니면 구현이 사양과 다른가요?

- [https://new.crbug.com](https://new.crbug.com)에서 버그를 신고하세요. 가능한 한 많은 세부 사항과 간단한 재생산 지침을 포함하고 *구성 요소*를 `Blink>ImageCapture`로 설정하십시오. [Glitch](https://glitch.com)는 빠르고 쉬운 재현을 공유하는 데 유용합니다.

### API를 사용할 계획이신가요? {: .hide-from-toc }

사이트에서 Shape Detection API를 사용할 계획이신가요? 귀하의 공개 지원은 기능의 우선 순위를 정하는 데 도움이 되며 다른 브라우저 공급업체에서 해당 기능을 지원하는 것이 얼마나 중요한지 보여줍니다.

- [WICG Discourse 스레드](https://discourse.wicg.io/t/rfc-proposal-for-face-detection-api/1642/3)에서 사용 계획을 공유하십시오.
- [@ChromiumDev](https://twitter.com/chromiumdev)으로 해시태그 [`#ShapeDetection`](https://twitter.com/search?q=%23ShapeDetection&src=typed_query&f=live)을 포함한 트윗을 보내서 어디에서 어떻게 활용하고 있는지 알려주세요.

## 유용한 링크 {: #helpful }

- [공개 설명자](https://docs.google.com/document/d/1QeCDBOoxkElAB0x7ZpM3VN3TQjS1ub1mejevd2Ik1gQ/edit)
- [API 데모](https://shape-detection-demo.glitch.me/) | [API 데모 소스](https://glitch.com/edit/#!/shape-detection-demo)
- [버그 추적](https://bugs.chromium.org/p/chromium/issues/detail?id=728474)
- [ChromeStatus.com 항목](https://www.chromestatus.com/feature/4757990523535360)
- Blink 구성 요소: `Blink>ImageCapture`
