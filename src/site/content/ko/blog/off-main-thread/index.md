---
title: 웹 작업자를 사용하여 브라우저의 메인 스레드에서 JavaScript 실행
subhead: 오프 메인 스레드 아키텍처가 앱의 안정성과 사용자 경험을 크게 향상시킬 수 있습니다.
description: 브라우저의 메인 스레드는 엄청나게 과중됩니다. 웹 작업자를 사용하여 메인 스레드에서 코드를 옮기면 앱의 안정성과 사용자 경험을 크게 향상시킬 수 있습니다.
authors:
  - surma
date: 2019-12-05
tags:
  - blog
  - performance
  - test-post
---

지난 20년 동안 웹은 몇 가지 스타일과 이미지가 있는 정적인 문서에서 복잡하고 동적인 응용 프로그램으로 극적으로 발전했습니다. 하지만 한 가지는 거의 변경되지 않은 채 그대로 남아 있습니다. 사이트를 렌더링하고 JavaScript를 실행하는 스레드는 몇 가지 예외 사항을 제외하고 브라우저 탭당 한 개뿐입니다.

결과적으로 메인 스레드는 엄청나게 과중되었습니다. 그리고 웹 앱의 복잡성이 심화됨에 따라 메인 스레드는 성능에 심각한 병목 현상이 발생합니다. 설상가상으로 특정 사용자의 메인 스레드에서 코드를 실행하는 데 소요되는 시간은 장치 기능이 성능에 막대한 영향을 미치기 때문에 **거의 전혀 예측할 수 없습니다.** 사용자가 매우 제한된 피처폰에서 고출력, 고재생률 플래그십 머신에 이르기까지 점점 더 다양한 기기에서 웹에 액세스함에 따라 이러한 예측 불가능성은 더욱 커질 것입니다.

정교한 웹 앱이 [RAIL 모델](/rail/)(인간의 인식과 심리학에 대한 경험적 데이터를 기반으로 함)과 같은 성능 가이드라인을 안정적으로 충족하기를 원한다면 **메인 스레드(OMT)에서** 코드를 실행할 수 있는 방법이 필요합니다.

{% Aside %} OMT 아키텍처 사례에 대해 자세히 알고 싶다면 아래에 제공되어 있는 저의 CDS 2019 강연을 시청하세요. {% endAside %}

{% YouTube '7Rrv9qFMWNM' %}

## 웹 작업자로 스레딩

다른 플랫폼은 일반적으로 스레드에 하나의 기능을 제공하여 병렬 작업을 지원합니다. 이러한 기능은 나머지 프로그램과 병렬로 실행됩니다. 두 스레드에서 동일한 변수에 액세스할 수 있으며 이러한 공유 리소스에 대한 액세스를 뮤텍스 및 세마포와 동기화하여 경쟁 조건을 방지할 수 있습니다.

JavaScript에서는 2007년부터 사용되어 왔으며 2012년부터 모든 주요 브라우저에서 지원되는 웹 작업자로부터 거의 유사한 기능을 얻을 수 있습니다. 웹 작업자는 메인 스레드와 병렬로 실행되지만 OS 스레딩과 달리 변수를 공유할 수 없습니다.

{% Aside %} 웹 작업자를 [서비스 작업자](/service-workers-cache-storage) 또는 [worklet](https://developer.mozilla.org/docs/Web/API/Worklet)과 혼동하지 마십시오. 이름은 비슷하지만 기능과 용도는 다릅니다. {% endAside %}

웹 작업자를 만들려면 작업자 생성자에 파일을 전달하세요. 그러면 작업자 생성자가 별도의 스레드에서 해당 파일을 실행하기 시작합니다.

```js
const worker = new Worker("./worker.js");
```

[`postMessage` API](https://developer.mozilla.org/docs/Web/API/Window/postMessage)를 통해 메시지를 전송하여 웹 작업자와 통신합니다. `postMessage` 호출의 매개변수로 메시지 값을 전달한 다음 메시지 이벤트 리스너를 작업자에 추가합니다.

<!--lint disable no-duplicate-headings-in-section-->

### `main.js`

```js/1
const worker = new Worker("./worker.js");
worker.postMessage([40, 2]);
```

### `worker.js`

```js
addEventListener("message", event => {
  const [a, b] = event.data;
  // Do stuff with the message
});
```

메인 스레드로 메시지를 다시 보내려면 웹 작업자에서 동일한 `postMessage` API를 사용하고 메인 스레드에서 이벤트 리스너를 설정하세요.

### `main.js`

```js/2-4
const worker = new Worker("./worker.js");
worker.postMessage([40, 2]);
worker.addEventListener("message", event => {
  console.log(event.data);
});
```

### `worker.js`

```js/3
addEventListener("message", event => {
  const [a, b] = event.data;
  // Do stuff with the message
  postMessage(a+b);
});
```

물론 이 접근 방식은 다소 제한적입니다. 역사적으로 웹 작업자는 주로 메인 스레드에서 힘든 작업의 한 부분을 옮기는 데 사용되었습니다. 단일 웹 작업자로 여러 작업을 처리하려고 하면 빠르게 다루는 것이 어려워집니다. 매개변수뿐만 아니라 메시지의 작업도 인코딩해야 하고 요청에 대한 응답을 일치시키기 위해 부기를 수행해야 합니다. 웹 작업자가 더 널리 채택되지 않은 이유는 이러한 복잡성 때문일 수 있습니다.

그러나 메인 스레드와 웹 작업자 간의 일부 통신 어려움을 제거할 수 있다면 이 모델은 많은 사용 사례에 매우 적합할 것입니다. 그리고 운 좋게도 그와 같은 일을 하는 라이브러리가 있습니다!

## Comlink: 웹 작업자가 작업을 덜 수행하도록 하기

[Comlink](http://npm.im/comlink)는 `postMessage`의 세부 사항에 대해 생각할 필요 없이 웹 작업자를 사용할 수 있도록 하는 것을 목표로 하는 라이브러리입니다. Comlink를 사용하면 스레딩을 지원하는 다른 프로그래밍 언어처럼 웹 작업자와 메인 스레드 간에 변수를 공유할 수 있습니다.

웹 작업자에서 가져오고 메인 스레드에 노출할 함수 집합을 정의하여 Comlink를 설정합니다. 그런 다음 메인 스레드에서 Comlink를 가져오고 작업자를 래핑하고 노출된 함수에 액세스합니다.

### `worker.js`

```js
import {expose} from "comlink";

const api = {
  someMethod() { /* … */ }
}
expose(api);
```

### `main.js`

```js
import {wrap} from "comlink";

const worker = new Worker("./worker.js");
const api = wrap(worker);
```

메인 스레드의 `api` 변수는 모든 함수가 값 자체가 아닌 값에 대한 약속을 반환한다는 점을 제외하면 웹 작업자의 변수와 동일하게 동작합니다.

## 웹 작업자로 이동해야 하는 코드는 무엇입니까?

웹 작업자는 DOM 및 [WebUSB](https://developer.mozilla.org/docs/Web/API/USB), [WebRTC](https://developer.mozilla.org/docs/Web/API/WebRTC_API) 또는 [Web Audio](https://developer.mozilla.org/docs/Web/API/Web_Audio_API)와 같은 많은 API에 액세스할 수 없으므로 작업자에 이러한 액세스에 의존하는 앱 조각을 넣을 수 없습니다. 그럼에도 불구하고, 작업자에게 이동되는 모든 작은 코드 조각은 사용자 인터페이스 업데이트와 같이 거기에 *있어야 하는* 항목에 대해 기본 스레드에서 더 많은 여유 공간을 구입합니다.

{% Aside %} 메인 스레드에 대한 UI 액세스를 제한하는 것은 실제로 다른 언어에서 일반적입니다. 사실 iOS와 Android 모두 메인 스레드를 *UI 스레드*라고 부릅니다. {% endAside %}

웹 개발자의 한 가지 문제는 대부분의 웹 앱이 Vue 또는 React와 같은 UI 프레임워크에 의존하여 앱의 모든 것을 오케스트레이션한다는 것입니다. 모든 것은 프레임워크의 구성 요소이므로 본질적으로 DOM에 연결됩니다. 이는 OMT 아키텍처로의 마이그레이션을 어렵게 만드는 것 처럼 보입니다.

하지만 UI 문제가 상태 관리와 같이 다른 문제와 분리된 모델로 전환하면 웹 작업자가 프레임워크 기반 앱에서도 상당히 유용할 수 있습니다. 이것이 바로 PROXX에서 취한 접근 방식입니다.

## PROXX: OMT 사례 연구

Google Chrome 팀은 오프라인 작업 및 매력적인 사용자 경험을 포함하여 [Progressive Web App](/load-faster-like-proxx/) 요구 사항을 충족하는 Minesweeper 클론으로 [PROXX](https://developers.google.com/web/progressive-web-apps)를 개발했습니다. 불행히도 게임의 초기 버전은 피처폰과 같은 제한된 장치에서 제대로 수행되지 않아 팀은 메인 스레드가 병목 현상임을 깨닫게 되었습니다.

팀은 웹 작업자를 사용하여 게임의 시각적 상태를 로직과 분리하기로 결정했습니다.

- 메인 스레드는 애니메이션 및 전환 렌더링을 처리합니다.
- 웹 작업자는 순전히 계산적인 게임 로직을 처리합니다.

{% Aside %} 이 접근 방식은 Redux [Flux 패턴](https://facebook.github.io/flux/)과 유사하므로 많은 Flux 앱을 OMT 아키텍처로 상당히 쉽게 마이그레이션할 수 있습니다. Redux 앱에 OMT를 적용하는 방법에 대해 자세히 알아보려면 [이 블로그 게시물](http://dassur.ma/things/react-redux-comlink/)을 살펴보세요. {% endAside %}

OMT는 PROXX의 피처폰 성능에 흥미로운 영향을 미쳤습니다. 비 OMT 버전에서 UI는 사용자가 상호 작용한 후 6초 동안 정지됩니다. 피드백이 없으며 사용자는 다른 작업을 수행하기 전에 6초 동안 기다려야 합니다.

<figure>
  <video controls muted style="max-width: 400px;">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-nonomt.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-nonomt.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption><strong>비-OMT</strong> 버전의 PROXX에서 UI 응답 시간.</figcaption></figure>

하지만 OMT 버전에서는 게임이 UI 업데이트를 완료하는 데 *12초*가 걸립니다. 성능 손실처럼 보이지만 실제로는 사용자에 대한 피드백을 증가시킵니다. 앱이 프레임을 전혀 전달하지 않는 비-OMT 버전보다 더 많은 프레임을 전달하기 때문에 속도가 느려집니다. 따라서 사용자는 어떤 일이 일어나고 있는지 알고 UI가 업데이트될 때 계속 플레이할 수 있으므로 더 나은 게임 환경을 누릴 수 있습니다.

<figure>
  <video controls muted style="max-width: 400px;">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-omt.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-omt.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>PROXX의 <strong>OMT</strong> 버전에서 UI 응답 시간.</figcaption></figure>

이것은 의식적인 트레이드 오프입니다 : 우리가 제한된 장치의 사용자에게 하이 엔드 기기의 사용자를 처벌하지 않고 더 나은 *느낌* 경험을 제공합니다.

## OMT 아키텍처의 의미

PROXX 예에서 볼 수 있듯이 OMT는 앱이 더 넓은 범위의 기기에서 안정적으로 실행되도록 하지만 앱을 더 빠르게 만들지는 않습니다.

- 작업을 줄이는 것이 아니라 메인 스레드에서 작업을 옮기는 것일 뿐입니다.
- 웹 작업자와 메인 스레드 간의 추가 통신 오버헤드로 인해 작업이 약간 느려지는 경우도 있습니다.

### 절충안 고려

메인 스레드는 JavaScript가 실행되는 동안 스크롤과 같은 사용자 상호 작용을 자유롭게 처리할 수 있으므로 총 대기 시간이 약간 더 길더라도 삭제된 프레임이 더 적습니다. 삭제된 프레임의 경우 오류 한계가 더 작으므로 프레임을 삭제하는 것보다 사용자를 조금 더 기다리게 하는 것이 좋습니다. 프레임 삭제는 밀리초 내에 발생하지만 사용자가 대기 시간을 인식하기 전에 *수백 밀리초*가 있습니다.

장치 전반에서 성능을 예측할 수 없기 때문에 OMT 아키텍처의 목표는 병렬화에 대한 성능 혜택에 관한 것이 아니라 실제로 **위험을 감소**(매우 다양한 런타임 조건에서 애플리케이션을 더욱 강력하게 만듦)하는 것에 관한 것입니다. UX의 탄력성과 개선 효과를 증대하는 것은 속도를 약간 절충하는 것보다 가치가 있습니다.

{% Aside %} 개발자는 메인 스레드와 웹 작업자 간에 복잡한 개체를 복사하는 비용에 대해 우려하는 경우가 종종 있습니다. 자세한 내용은 제 강연에 나와 있지만 일반적으로 개체의 문자열화된 JSON 표현이 10KB 미만인 경우 성능 예산을 초과하지 않아야 합니다. 더 큰 개체를 복사해야 하는 경우 [ArrayBuffer](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 또는 [WebAssembly](https://webassembly.org/)를 사용하는 것이 좋습니다. 이 문제에 대한 자세한 내용은 [`postMessage` 성능에 대한 이 블로그 게시물](https://dassur.ma/things/is-postmessage-slow)에서 읽을 수 있습니다. {% endAside %}

### 툴링에 대한 참고 사항

웹 작업자는 아직 주류가 아니므로 [WebPack](https://webpack.js.org/) 및 [Rollup](https://github.com/rollup/rollup)과 같은 대부분의 모듈 도구는 즉시 지원하지 않습니다. ([Parcel](https://parceljs.org/)은 지원하지만 말이죠!) 다행히도 웹 작업자를 WebPack과 Rollup으로 *작업*할 수 있는 플러그인이 있습니다.

- WebPack용 [작업자 플러그인](https://github.com/GoogleChromeLabs/worker-plugin)
- 롤업용 [rollup-plugin-off-main-thread](https://github.com/surma/rollup-plugin-off-main-thread)

## 요약

특히 점점 더 글로벌화되고 있는 시장에서 우리 앱이 가능한 한 안정적이고 액세스 가능하도록 하려면 제한된 장치를 지원해야 합니다. 이는 전 세계 대부분의 사용자가 웹에 액세스하는 방식입니다. OMT는 고급 장치 사용자에게 부정적인 영향을 주지 않으면서 이러한 장치의 성능을 증대할 수 있는 유망한 방법을 제공합니다.

또한 OMT에는 다음과 같은 부차적인 이점이 있습니다.

- JavaScript 실행 비용을 별도의 스레드로 전가합니다.
- *구문 분석* 비용이 전가되므로 UI 부팅이 더 빨라집니다. 그러면 [First Contentful Paint](/fcp/) 또는 [Time to Interactive](/tti/)가 줄어 역으로 [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) 점수가 증가할 수 있습니다.

웹 작업자는 두려워할 필요가 없습니다. Comlink와 같은 도구는 작업자로부터 작업을 빼앗고 다양한 웹 애플리케이션을 위한 실용적인 선택이 될 수 있습니다.
