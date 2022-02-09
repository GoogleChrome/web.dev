---
title: 웹에서 USB 장치에 액세스
subhead: WebUSB API는 USB를 웹으로 가져와 더 안전하고 사용하기 쉽게 만듭니다.
authors:
  - beaufortfrancois
date: 2016-03-30
updated: 2021-02-23
hero: image/admin/hhnhxiNuRWMfGqy4NSaH.jpg
thumbnail: image/admin/RyaGPB8fHCuuXUc9Wj9Z.jpg
alt: Arduino Micro 보드의 사진
description: WebUSB API는 USB를 웹으로 가져와 더 안전하고 사용하기 쉽게 만듭니다.
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webusb
---

부연 없이 "USB"라고 하면 곧바로 키보드, 마우스, 오디오, 비디오, 저장 장치 등을 떠올릴 가능성이 큽니다. 맞습니다. 하지만 그 밖에 다른 종류의 USB(Universal Serial Bus) 장치들도 있습니다.

이러한 비표준 USB 장치를 사용하려면 하드웨어 공급업체에서 플랫폼별 드라이버와 SDK를 작성해야 개발자가 이를 사용할 수 있습니다. 안타깝게도 이 플랫폼 고유의 코드는 지금까지 이러한 장치를 웹에서 사용하지 못하게 만드는 걸림돌이었습니다. WebUSB API가 만들어진 이유도 바로 이때문인데, USB 장치 서비스를 웹에 노출하는 방법을 제공하기 위해서입니다. 이 API를 사용하여 하드웨어 제조업체는 해당 장치용 크로스 플랫폼 JavaScript SDK를 구축할 수 있습니다. 그러나 가장 중요한 것은 이것이 **USB를 웹으로 가져옴으로써 USB를 더 안전하고 사용하기 쉽게 만든다는** 것입니다.

WebUSB API가 있을 때 기대할 수 있는 동작을 살펴보겠습니다.

1. USB 장치를 구입합니다.
2. 컴퓨터에 연결합니다. 이 장치에 대해 이동할 올바른 웹사이트와 함께 알림이 즉시 나타납니다.
3. 알림을 클릭합니다. 웹사이트가 있고 사용할 준비가 되었습니다!
4. 클릭하여 연결하면 Chrome에 장치를 선택할 수 있는 USB 장치 선택기가 표시됩니다.

기대하시라!

WebUSB API가 없다면 이 절차는 어떻게 될까요?

1. 플랫폼별 애플리케이션을 설치합니다.
2. 내 운영 체제에서 지원되는 경우 올바른 항목을 다운로드했는지 확인합니다.
3. 설치를 수행합니다. 운이 좋다면 인터넷에서 드라이버/애플리케이션 설치를 경고하는 무서운 OS 메시지나 팝업이 표시되지 않습니다. 운이 없으면 설치된 드라이버나 애플리케이션이 오작동하여 컴퓨터를 손상시킵니다(웹은 [오작동하는 웹사이트](https://www.youtube.com/watch?v=29e0CtgXZSI)를 포함하도록 구축된다는 점을 상기).
4. 기능을 한 번만 사용하는 경우 코드는 제거할 때까지 컴퓨터에 남아 있습니다(웹에서는 사용하지 않은 공간이 결국 회수됨.)

## 시작하기 전에

이 문서에서는 USB 작동 방식에 대한 기본적 지식이 있다고 가정합니다. 그렇지 않다면 [USB 요약](http://www.beyondlogic.org/usbnutshell)을 읽어볼 것을 추천합니다. USB에 대한 배경 정보는 [공식 USB 사양](https://www.usb.org/)을 확인하세요.

[WebUSB API](https://wicg.github.io/webusb/)는 Chrome 61에서 사용할 수 있습니다.

### 원본 평가에 사용 가능

현장에서 WebUSB API를 사용하는 개발자들로부터 최대한 많은 피드백을 받기 위해 이전에 Chrome 54 및 Chrome 57에 이 기능을 [원본 평가](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)로 추가했습니다.

최근 평가는 2017년 9월에 성공적으로 종료되었습니다.

## 개인정보보호 및 보안

### HTTPS만

이 기능은 강력하다는 점 때문에 [보안 컨텍스트](https://w3c.github.io/webappsec/specs/powerfulfeatures/#intro)에서만 작동합니다. 즉, [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)를 염두에 두고 빌드해야 합니다.

### 사용자 제스처 필요

보안상의 이유로 `navigator.usb.requestDevice()`는 터치나 마우스 클릭과 같은 사용자 제스처를 통해서만 호출할 수 있습니다.

### 기능 정책

[기능 정책](https://developer.mozilla.org/docs/Web/HTTP/Feature_Policy)은 개발자가 다양한 브라우저 기능과 API를 선택적으로 활성화 및 비활성화할 수 있는 메커니즘입니다. HTTP 헤더 및/또는 iframe "allow" 특성을 통해 정의할 수 있습니다.

USB 특성이 Navigator 객체에서 노출되는지, 즉 WebUSB를 허용하는지 여부를 제어하는 기능 정책을 정의할 수 있습니다.

다음은 WebUSB가 허용되지 않는 헤더 정책의 예입니다.

```http
Feature-Policy: fullscreen "*"; usb "none"; payment "self" https://payment.example.com
```

다음은 USB가 허용되는 컨테이너 정책의 또 다른 예입니다.

```html
<iframe allowpaymentrequest allow="usb; fullscreen"></iframe>
```

## 코딩 시작하기

WebUSB API는 JavaScript [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)에 크게 의존합니다. 이 내용에 익숙하지 않다면 이 훌륭한 [Promise 튜토리얼](/promises)을 확인해 보세요. 한 가지 더, `() => {}`는 단순히 ECMAScript 2015 [Arrow 함수](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)입니다.

### USB 장치에 액세스

`navigator.usb.requestDevice()`를 사용하여 연결된 단일 USB 장치를 선택하도록 사용자에게 메시지를 표시하거나 `navigator.usb.getDevices()`를 호출하여 원본이 액세스할 수 있는 연결된 모든 USB 장치 목록을 가져올 수 있습니다.

`navigator.usb.requestDevice()` 함수는 `filters`를 정의하는 필수 JavaScript 객체를 사용합니다. 이러한 필터는 USB 장치를 지정된 공급업체(`vendorId`) 및 선택적으로 제품(`productId`) 식별자와 일치시키는 데 사용됩니다. `classCode`, `protocolCode`, `serialNumber` 및 `subclassCode` 키도 여기에서 정의할 수 있습니다.

<figure>{% Img src="image/admin/KIbPwUfEqgZZLxugxBOY.png", alt="Chrome의 USB 장치 사용자 프롬프트를 보여주는 스크린샷", width="800", height="533" %}<figcaption> USB 장치 사용자 프롬프트.</figcaption></figure>

예를 들어, 원본을 허용하도록 구성된 연결된 Arduino 장치에 액세스하는 방법은 다음과 같습니다.

```js
navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(device => {
  console.log(device.productName);      // "Arduino Micro"
  console.log(device.manufacturerName); // "Arduino LLC"
})
.catch(error => { console.error(error); });
```

제가 이 `0x2341` 16진수를 마술처럼 생각해낸 것은 아닙니다. 이 [USB ID 목록](http://www.linux-usb.org/usb.ids)에서 단순히 "Arduino"라는 단어를 검색했습니다.

위의 이행된 promise에서 반환된 USB `device`에는 지원되는 USB 버전, 최대 패킷 크기, 공급업체 및 제품 ID, 장치가 가질 수 있는 가능한 구성 수와 같은 장치에 대한 몇 가지 기본적이지만 중요한 정보가 들어 있습니다. 기본적으로 [장치 USB 설명자](http://www.beyondlogic.org/usbnutshell/usb5.shtml#DeviceDescriptors)의 모든 필드를 포함합니다.

그런데 USB 장치가 [WebUSB 지원](https://wicg.github.io/webusb/#webusb-platform-capability-descriptor)을 공표하고 랜딩 페이지 URL을 정의하면 USB 장치가 연결될 때 Chrome에서 지속적인 알림을 표시합니다. 이 알림을 클릭하면 랜딩 페이지가 열립니다.

<figure>{% Img src="image/admin/1gRIz2wY4LYofeFq5cc3.png", alt="Chrome의 WebUSB 알림을 보여주는 스크린샷", width="800", height="450" %}<figcaption> WebUSB 알림.</figcaption></figure>

여기에서 간단히 `navigator.usb.getDevices()`를 호출하고 아래와 같이 Arduino 장치에 액세스할 수 있습니다.

```js
navigator.usb.getDevices().then(devices => {
  devices.forEach(device => {
    console.log(device.productName);      // "Arduino Micro"
    console.log(device.manufacturerName); // "Arduino LLC"
  });
})
```

### Arduino USB 보드와 대화

자, 이제 USB 포트를 통해 WebUSB 호환 Arduino 보드에서 통신하는 것이 얼마나 쉬운지 알아보겠습니다. [https://github.com/webusb/arduino](https://github.com/webusb/arduino)의 지침을 확인하여 여러분의 [스케치](http://www.arduino.cc/en/Tutorial/Sketch)를 WebUSB 활성화하세요.

걱정하지 마세요. 이 문서 뒷부분에서 아래에 언급된 모든 WebUSB 장치 메서드를 다룰 것입니다.

```js
let device;

navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(selectedDevice => {
    device = selectedDevice;
    return device.open(); // Begin a session.
  })
.then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
.then(() => device.claimInterface(2)) // Request exclusive control over interface #2.
.then(() => device.controlTransferOut({
    requestType: 'class',
    recipient: 'interface',
    request: 0x22,
    value: 0x01,
    index: 0x02})) // Ready to receive data
.then(() => device.transferIn(5, 64)) // Waiting for 64 bytes of data from endpoint #5.
.then(result => {
  const decoder = new TextDecoder();
  console.log('Received: ' + decoder.decode(result.data));
})
.catch(error => { console.error(error); });
```

여기에서 사용하고 있는 WebUSB 라이브러리는 하나의 예제 프로토콜(표준 USB 직렬 프로토콜에 기반)을 구현하고 있으며 제조업체는 원하는 모든 유형의 엔드포인트를 만들 수 있다는 점을 염두에 두기 바랍니다. 제어 전송은 버스 우선 순위를 얻고 구조가 잘 정의되어 있으므로 소규모 구성 명령에 특히 좋습니다.

다음은 Arduino 보드에 업로드된 스케치입니다.

```arduino
// Third-party WebUSB Arduino library
#include <WebUSB.h>

WebUSB WebUSBSerial(1 /* https:// */, "webusb.github.io/arduino/demos");

#define Serial WebUSBSerial

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // Wait for serial port to connect.
  }
  Serial.write("WebUSB FTW!");
  Serial.flush();
}

void loop() {
  // Nothing here for now.
}
```

위의 샘플 코드에 사용된 타사 [WebUSB Arduino 라이브러리](https://github.com/webusb/arduino/tree/gh-pages/library/WebUSB)는 기본적으로 두 가지를 수행합니다.

- 장치는 Chrome이 [랜딩 페이지 URL](https://wicg.github.io/webusb/#webusb-platform-capability-descriptor)을 읽을 수 있도록 하는 WebUSB 장치 역할을 합니다.
- 기본 API를 재정의하는 데 사용할 수 있는 WebUSB Serial API를 노출합니다.

JavaScript 코드를 다시 보세요. 사용자가 선택한 `device`를 가져오면 `device.open()`은 모든 플랫폼별 단계를 실행하여 USB 장치와의 세션을 시작합니다. 그러면 `device.selectConfiguration()`으로 사용 가능한 USB 구성을 선택해야 합니다. 구성은 장치에 전원이 공급되는 방식, 최대 전력 소비 및 인터페이스 수를 지정한다는 점을 기억하세요. 인터페이스에 대해 말하자면, 인터페이스가 요청될 때 데이터가 인터페이스 또는 연결된 엔드포인트로만 전송될 수 있기 때문에 `device.claimInterface()`를 사용하여 배타적 액세스도 요청해야 합니다. 마지막으로, WebUSB Serial API를 통해 통신하기 위해 적절한 명령으로 Arduino 장치를 설정하는 데 `device.controlTransferOut()` 호출이 필요합니다.

여기에서 `device.transferIn()`은 호스트가 대량 데이터를 수신할 준비가 되었음을 알리기 위해 장치로 대량 전송을 수행합니다. 그런 다음 적절하게 구문 분석해야 하는 [DataView](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) `data`가 포함된 `result` 객체로 promise가 이행됩니다.

USB에 익숙하다면 이 모든 내용이 상당히 낯익을 것입니다.

### 더 나아가기

WebUSB API를 사용하면 모든 USB 전송/엔드포인트 유형과 상호 작용할 수 있습니다.

- 구성 또는 명령 매개변수를 USB 장치로 보내거나 받는 데 사용되는 CONTROL 전송은 `controlTransferIn(setup, length)` 및 `controlTransferOut(setup, data)`로 처리됩니다.
- 시간에 민감한 소량의 데이터에 사용되는 INTERRUPT 전송은 `transferIn(endpointNumber, length)` 및 `transferOut(endpointNumber, data)`를 사용하는 BULK 전송과 동일한 메서드로 처리됩니다.
- 비디오 및 사운드와 같은 데이터 스트림에 사용되는 ISOCHRONOUS 전송은 `isochronousTransferIn(endpointNumber, packetLengths)` 및 `isochronousTransferOut(endpointNumber, data, packetLengths)`로 처리됩니다.
- 시간에 민감하지 않은 대량의 데이터를 안정적으로 전송하는 데 사용되는 BULK 전송은 `transferIn(endpointNumber, length)` 및 `transferOut(endpointNumber, data)`로 처리됩니다.

또한 WebUSB API용으로 설계된 USB 제어 LED 장치를 구축하는 기초 예제로서 Mike Tsao의 [WebLight 프로젝트](https://github.com/sowbug/weblight)를 살펴보는 것도 유익할 수 있습니다(여기서는 Arduino를 사용하지 않음). 하드웨어, 소프트웨어 및 펌웨어를 찾을 수 있습니다.

## 팁

모든 USB 장치 관련 이벤트를 한 곳에서 볼 수 있는 내부 페이지인 `about://device-log`가 있어 Chrome에서는 USB 디버깅이 간편합니다.

<figure>{% Img src="image/admin/ssq2mMZmxpWtALortfZx.png", alt="Chrome에서 WebUSB를 디버그하기 위한 장치 로그 페이지 스크린샷", width="800", height="442" %}<figcaption> WebUSB API 디버깅을 위한 Chrome의 장치 로그 페이지.</figcaption></figure>

내부 페이지 `about://usb-internals`도 유용하며 가상 WebUSB 장치의 연결 및 분리를 시뮬레이션할 수 있습니다. 실제 하드웨어 없이 UI 테스트를 수행하는 데 유용합니다.

<figure>{% Img src="image/admin/KB5z4p7fZRsvkfhVTNkb.png", alt="Chrome에서 WebUSB를 디버그하기 위한 내부 페이지 스크린샷", width="800", height="294" %}<figcaption> WebUSB API 디버깅을 위한 Chrome의 내부 페이지.</figcaption></figure>

대부분의 Linux 시스템에서 USB 장치는 기본적으로 읽기 전용 권한으로 매핑됩니다. Chrome에서 USB 장치를 열 수 있도록 하려면 새 [udev 규칙](https://www.freedesktop.org/software/systemd/man/udev.html)을 추가해야 합니다. 다음 내용으로 `/etc/udev/rules.d/50-yourdevicename.rules`에 파일을 만듭니다.

```vim
SUBSYSTEM=="usb", ATTR{idVendor}=="[yourdevicevendor]", MODE="0664", GROUP="plugdev"
```

예를 들어 장치가 Arduino인 경우 `[yourdevicevendor]`는 `2341`입니다. 더 구체적인 규칙이 필요할 때는 `ATTR{idProduct}`를 추가할 수도 있습니다. `user`가 `plugdev` 그룹의 [구성원](https://wiki.debian.org/SystemGroups)인지 확인하세요. 그런 다음 장치를 다시 연결하기만 하면 됩니다.

{% Aside  %} Arduino 예제에서 사용된 Microsoft OS 2.0 설명자는 Windows 8.1 이상에서만 작동합니다. 이것이 없으면 Windows 지원을 위해 INF 파일을 수동으로 설치해야 합니다. {% endAside %}

## 리소스

- 스택 오버플로: [https://stackoverflow.com/questions/tagged/webusb](https://stackoverflow.com/questions/tagged/webusb)
- WebUSB API 사양: [http://wigg.github.io/webusb/](https://wicg.github.io/webusb/)
- Chrome 기능 상태: [https://www.chromestatus.com/feature/5651917954875392](https://www.chromestatus.com/feature/5651917954875392)
- 사양 문제: [https://github.com/WICG/webusb/issues](https://github.com/WICG/webusb/issues)
- 구현 버그: [http://crbug.com?q=component:Blink&gt;USB](http://crbug.com?q=component:Blink%3EUSB)
- WebUSB ❤ ️Arduino: [https://github.com/webusb/arduino](https://github.com/webusb/arduino)
- IRC: W3C의 IRC에 관한 [#webusb](irc://irc.w3.org:6665/#webusb)
- WICG 메일링 리스트: [https://lists.w3.org/Archives/Public/public-wicg/](https://lists.w3.org/Archives/Public/public-wicg/)
- WebLight 프로젝트: [https://github.com/sowbug/weblight](https://github.com/sowbug/weblight)

해시태그 [`#WebUSB`](https://twitter.com/search?q=%23WebUSB&src=typed_query&f=live)를 사용하여 [@ChromiumDev][cr-dev-twitter]으로 트윗을 보내어 이러한 리소스를 어디에서 어떻게 사용하고 있는지 알려주세요.

## 감사의 말

이 문서를 검토해준 [Joe Medley](https://github.com/jpmedley)에게 감사드립니다.
