---
title: JavaScript를 통해 블루투스 장치와의 통신
subhead: Web Bluetooth API를 사용하면 웹 사이트에서 블루투스 장치와 통신할 수 있습니다.
authors:
  - beaufortfrancois
date: 2015-07-21
updated: 2021-10-01
hero: image/admin/CME5IVhdn0pngs7jAlFX.jpg
thumbnail: image/admin/1J1OTu90a2oH8wFogKnF.jpg
alt: 코인에 들어가 있는 블루투스 칩
description: Web Bluetooth API를 사용하면 웹 사이트에서 블루투스 장치와 통신할 수 있습니다.
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: web-bluetooth
---

웹 사이트가 안전하고 개인 정보를 보호하는 방식으로 근처의 블루투스 장치와 통신할 수 있다고 말한다면 어떻게 될까요? 이런 식으로 심박수 모니터, 노래하는 전구, 심지어 [거북이](https://www.youtube.com/watch?v=1LV1Fk5ZXwA)까지 웹 사이트와 직접 상호작용할 수 있습니다.

지금까지 블루투스 장치와의 상호 작용은 플랫폼별 앱에서만 가능했습니다. Web Bluetooth API는 이러한 한계를 벗어나 웹 브라우저에도 이를 이용 가능하게 하는 것을 목표로 합니다.

## 시작하기 전에

이 문서에서는 독자가 BLE(Bluetooth Low Energy) 및 GATT([Generic Attribute Profile](https://www.bluetooth.com/specifications/gatt/)) 작동 방식에 대한 기본 지식이 있다고 가정합니다.

[Web Bluetooth API 사양](https://webbluetoothcg.github.io/web-bluetooth/)은 아직 확정되지 않았지만 사양 작성자들이 열정적인 개발자를 대상으로 이 API를 사용해 보고 [사양에 대한 피드백](https://github.com/WebBluetoothCG/web-bluetooth/issues)과 [구현에 대한 피드백](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EBluetooth)을 제공할 것을 적극적으로 권하고 있습니다.

Web Bluetooth API의 하위 요소는 ChromeOS, Android 6.0용 Chrome, Mac(Chrome 56) 및 Windows 10(Chrome 70)에서 사용할 수 있습니다. 즉, 가까운 BLE(Bluetooth Low Energy) 장치를 [요청](#request)하여 여기에 [연결](#connect)하고, 블루투스 특성을 [읽고](#read) [쓰며](#write), [GATT 알림을 수신](#notifications)하고 [블루투스 장치의 연결이 끊긴 시점](#disconnect)을 인식하고, 심지어 [블루투스 설명자를 읽고 쓸](#descriptors) 수 있게 될 것입니다. 자세한 내용은 MDN의 [브라우저 호환성](https://developer.mozilla.org/docs/Web/API/Web_Bluetooth_API#Browser_compatibility) 표를 참조하세요.

Linux 및 이전 버전의 Windows의 경우 `about://flags`에서 `#experimental-web-platform-features` 플래그를 활성화합니다.

### 원본 평가에 사용 가능

현장에서 Web Bluetooth API를 사용하는 개발자로부터 최대한 많은 피드백을 얻기 위해 Chrome은 이전에 ChromeOS, Android 및 Mac에 대한 [원본 평가](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)로 Chrome 53에 이 기능을 추가했습니다.

이 평가는 2017년 1월에 성공적으로 종료되었습니다.

## 보안 요구 사항

보안 트레이드오프를 이해하려면 Web Bluetooth API 사양 작업에 참여하고 있는 Chrome 팀의 소프트웨어 엔지니어인 Jeffrey Yasskin의 [웹 블루투스 보안 모델](https://medium.com/@jyasskin/the-web-bluetooth-security-model-666b4e7eed2) 게시물을 읽어볼 것을 추천합니다.

### HTTPS 전용

이 실험적 API는 웹에 추가된 강력한 새로운 기능이기 때문에 [보안 컨텍스트](https://w3c.github.io/webappsec-secure-contexts/#intro)에서만 사용할 수 있습니다. 즉, [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)를 염두에 두고 빌드해야 합니다.

### 사용자 제스처 필요

보안 조치로서, `navigator.bluetooth.requestDevice`를 사용하여 블루투스 장치를 검색하려면 터치 또는 마우스 클릭과 같은 [사용자 제스처](https://html.spec.whatwg.org/multipage/interaction.html#activation)로 트리거해야 합니다. [`pointerup`](https://developer.chrome.com/blog/pointer-events/), `click` 및 `touchend` 이벤트 수신에 대해 이야기하고 있는 것입니다.

```js
button.addEventListener('pointerup', function(event) {
  // Call navigator.bluetooth.requestDevice
});
```

## 코드로 들어가기

Web Bluetooth API는 JavaScript [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)에 크게 의존합니다. 이 내용에 익숙하지 않다면 이 훌륭한 [Promise 튜토리얼](/promises)을 확인해 보세요. 한 가지 더, `() => {}`는 단순히 ECMAScript 2015 [Arrow 함수](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)입니다.

### 블루투스 장치 요청 {: #request }

이 버전의 Web Bluetooth API 사양을 사용하면 중앙 역할에서 실행되는 웹 사이트가 BLE 연결을 통해 원격 GATT 서버에 연결할 수 있습니다. 블루투스 4.0 이상을 구현한 장치간 통신이 지원됩니다.

웹 사이트에서 `navigator.bluetooth.requestDevice`를 사용하여 주변 장치에 대한 액세스를 요청하면 브라우저는 사용자에게 하나의 장치를 선택하거나 단순히 요청을 취소할 수 있는 장치 선택기를 표시합니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/bluetooth/bluetooth-device-chooser.mp4">
  </source></video>
  <figcaption>
    <p data-md-type="paragraph"><a href="https://webbluetoothcg.github.io/demos/playbulb-candle/">블루투스 장치 사용자 프롬프트</a></p>
  </figcaption></figure>

`navigator.bluetooth.requestDevice()` 함수는 필터를 정의하는 필수 객체를 사용합니다. 이러한 필터는 일부 광고된 Bluetooth GATT 서비스 및/또는 장치 이름과 일치하는 장치만 반환하는 데 사용됩니다.

#### 서비스 필터

예를 들어, [Bluetooth GATT 배터리 서비스](https://www.bluetooth.com/specifications/gatt/)를 광고하는 블루투스 장치를 요청하려면 다음과 같이 합니다.

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

하지만 해당 Bluetooth GATT 서비스가 [표준화된 Bluetooth GATT 서비스](https://www.bluetooth.com/specifications/assigned-numbers/) 목록에 없으면 전체 블루투스 UUID 또는 짧은 16비트 또는 32비트 형식을 제공할 수 있습니다.

```js
navigator.bluetooth.requestDevice({
  filters: [{
    services: [0x1234, 0x12345678, '99999999-0000-1000-8000-00805f9b34fb']
  }]
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

#### 이름 필터

`name` 필터 키를 사용하여 광고된 장치 이름, 또는 경우에 따라 `namePrefix`로 이 이름의 접두사를 기반으로 블루투스 장치를 요청할 수 있습니다. 이 경우 서비스 필터에 포함되지 않은 서비스에 액세스할 수 있도록 `optionalServices` 키도 정의해야 합니다. 그렇지 않으면 나중에 액세스하려고 할 때 오류가 발생합니다.

```js
navigator.bluetooth.requestDevice({
  filters: [{
    name: 'Francois robot'
  }],
  optionalServices: ['battery_service'] // Required to access service later.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

#### 제조업체 데이터 필터

`manufacturerData` 필터 키를 이용해 광고된 제조업체별 데이터를 기반으로 블루투스 장치를 요청할 수도 있습니다. 이 키는 `companyIdentifier`라는 필수 [블루투스 회사 식별자](https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers/) 키가 있는 객체의 배열입니다. 시작하는 블루투스 장치에서 제조업체 데이터를 필터링하는 데이터 접두사를 제공할 수도 있습니다. 서비스 필터에 포함되지 않은 서비스에 액세스하려면 `optionalServices` 키도 정의해야 합니다. 그렇지 않으면 나중에 액세스하려고 할 때 오류가 발생합니다.

```js
// Filter Bluetooth devices from Google company with manufacturer data bytes
// that start with [0x01, 0x02].
navigator.bluetooth.requestDevice({
  filters: [{
    manufacturerData: [{
      companyIdentifier: 0x00e0,
      dataPrefix: new Uint8Array([0x01, 0x02])
    }]
  }],
  optionalServices: ['battery_service'] // Required to access service later.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

마스크는 제조업체 데이터의 일부 패턴과 일치시키기 위해 데이터 접두사와 함께 사용할 수도 있습니다. 자세한 내용은 [블루투스 데이터 필터 설명](https://github.com/WebBluetoothCG/web-bluetooth/blob/main/data-filters-explainer.md)을 확인하세요.

{% Aside %} 이 글을 쓰는 시점에서 `manufacturerData` 필터 키는 Chrome 92에서 사용할 수 있습니다. 이전 브라우저와의 하위 호환성이 필요한 경우, 제조업체 데이터 필터는 비어 있는 것으로 간주되므로 대체 옵션을 제공해야 합니다. [예](https://groups.google.com/a/chromium.org/g/blink-dev/c/5Id2LANtFko/m/5SIig7ktAgAJ)를 참조하세요. {% endAside %}

#### 필터 없음

마지막으로, `filters` 대신 `acceptAllDevices` 키를 사용하여 근처의 모든 블루투스 장치를 표시할 수 있습니다. 또한 일부 서비스에 액세스하기 위해 `optionalServices` 키도 정의해야 합니다. 그렇지 않으면 나중에 액세스하려고 할 때 오류가 발생합니다.

```js
navigator.bluetooth.requestDevice({
  acceptAllDevices: true,
  optionalServices: ['battery_service'] // Required to access service later.
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

{% Aside 'caution' %} 이로 인해 선택기에 관련 없는 여러 장치가 표시되고 필터가 없기 때문에 에너지가 낭비될 수 있습니다. 주의해서 사용하세요. {% endAside %}

### 블루투스 장치에 연결 {: #connect }

그렇다면 이제 `BluetoothDevice`를 가지고 무엇을 해야 할까요? 서비스 및 특성 정의를 가지고 있는 블루투스 원격 GATT 서버에 연결해 보겠습니다.

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => {
  // Human-readable name of the device.
  console.log(device.name);

  // Attempts to connect to remote GATT Server.
  return device.gatt.connect();
})
.then(server => { /* … */ })
.catch(error => { console.error(error); });
```

### 블루투스 특성 읽기 {: #read }

여기서 우리는 원격 블루투스 장치의 GATT 서버에 연결됩니다. 이제 기본 GATT 서비스를 얻고 이 서비스에 속하는 특성을 읽으려고 합니다. 예를 들어 장치 배터리의 현재 충전 수준을 읽어 보겠습니다.

아래 예에서 `battery_level`은 [표준화된 배터리 수준 특성](https://www.bluetooth.com/specifications/gatt/)입니다.

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => device.gatt.connect())
.then(server => {
  // Getting Battery Service…
  return server.getPrimaryService('battery_service');
})
.then(service => {
  // Getting Battery Level Characteristic…
  return service.getCharacteristic('battery_level');
})
.then(characteristic => {
  // Reading Battery Level…
  return characteristic.readValue();
})
.then(value => {
  console.log(`Battery percentage is ${value.getUint8(0)}`);
})
.catch(error => { console.error(error); });
```

사용자 지정 블루투스 GATT 특성을 사용하는 경우 전체 블루투스 UUID 또는 짧은 16비트 또는 32비트 형식을 `service.getCharacteristic`에 제공할 수 있습니다.

또한, 특성에서 `characteristicvaluechanged` 이벤트 리스너를 추가하여 값의 판독을 처리할 수도 있습니다. 들어오는 GATT 알림을 선택적으로 처리하는 방법도 알아보려면 [Read Characteristic Value Changed Sample](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html)을 확인하세요.

```js
…
.then(characteristic => {
  // Set up event listener for when characteristic value changes.
  characteristic.addEventListener('characteristicvaluechanged',
                                  handleBatteryLevelChanged);
  // Reading Battery Level…
  return characteristic.readValue();
})
.catch(error => { console.error(error); });

function handleBatteryLevelChanged(event) {
  const batteryLevel = event.target.value.getUint8(0);
  console.log('Battery percentage is ' + batteryLevel);
}
```

### 블루투스 특성에 쓰기 {: #write }

블루투스 GATT 특성에 쓰는 것은 읽는 것만큼 쉽습니다. 이번에는 Heart Rate Control Point를 사용하여 심박수 모니터 장치에서 Energy Expended 필드의 값을 0으로 재설정해 보겠습니다.

여기에 마법 같은 것은 없습니다. [Heart Rate Control Point 특성 페이지](https://www.bluetooth.com/specifications/gatt/)에 모두 설명되어 있습니다.

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_control_point'))
.then(characteristic => {
  // Writing 1 is the signal to reset energy expended.
  const resetEnergyExpended = Uint8Array.of(1);
  return characteristic.writeValue(resetEnergyExpended);
})
.then(_ => {
  console.log('Energy expended has been reset.');
})
.catch(error => { console.error(error); });
```

### GATT 알림 수신 {: #notifications }

이제 장치에서 [심박수 측정](https://www.bluetooth.com/specifications/gatt/) 특성이 변경될 때 알림을 받는 방법을 살펴보겠습니다.

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_measurement'))
.then(characteristic => characteristic.startNotifications())
.then(characteristic => {
  characteristic.addEventListener('characteristicvaluechanged',
                                  handleCharacteristicValueChanged);
  console.log('Notifications have been started.');
})
.catch(error => { console.error(error); });

function handleCharacteristicValueChanged(event) {
  const value = event.target.value;
  console.log('Received ' + value);
  // TODO: Parse Heart Rate Measurement value.
  // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
}
```

[알림 샘플](https://googlechrome.github.io/samples/web-bluetooth/notifications.html)에 `stopNotifications()`를 사용하여 알림을 중단하고 추가된 `characteristicvaluechanged` 이벤트 리스너를 적절하게 제거하는 방법이 나와 있습니다.

### 블루투스 장치에서 연결 해제 {: #disconnect }

더 나은 사용자 경험을 제공하기 위해 연결 중단 이벤트에 수신 대기하고 사용자를 다시 연결하도록 초대할 수 있습니다.

```js
navigator.bluetooth.requestDevice({ filters: [{ name: 'Francois robot' }] })
.then(device => {
  // Set up event listener for when device gets disconnected.
  device.addEventListener('gattserverdisconnected', onDisconnected);

  // Attempts to connect to remote GATT Server.
  return device.gatt.connect();
})
.then(server => { /* … */ })
.catch(error => { console.error(error); });

function onDisconnected(event) {
  const device = event.target;
  console.log(`Device ${device.name} is disconnected.`);
}
```

`device.gatt.disconnect()`를 호출하여 웹 앱을 블루투스 장치에서 연결 해제할 수도 있습니다. 그러면 기존 `gattserverdisconnected` 이벤트 리스너가 트리거됩니다. 다른 앱이 이미 블루투스 장치와 통신하고 있는 경우에는 블루투스 장치 통신이 중단되지 않습니다. 자세히 알아보려면 [장치 연결 해제 샘플](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html) 및 [자동 재연결 샘플](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html)을 확인하세요.

{% Aside 'caution' %} 블루투스 GATT 속성, 서비스, 특성 등은 장치 연결이 끊어지면 무효화됩니다. 즉, 재연결 후에 해당 코드에서 항상 (`getPrimaryService(s)`, `getCharacteristic(s)` 등을 통해) 이러한 속성을 다시 가져와야 합니다. {% endAside %}

### 블루투스 설명자 읽기 및 쓰기 {: #descriptors }

블루투스 GATT 설명자는 특성 값을 설명하는 속성입니다. 블루투스 GATT 특성과 유사한 방식으로 읽고 쓸 수 있습니다.

예를 들어 장치의 건강 체온계의 측정 간격에 대한 사용자 설명을 읽는 방법을 살펴보겠습니다.

아래 예에서 `health_thermometer`는 [건강 체온계 서비스](https://www.bluetooth.com/specifications/gatt/)이고, `measurement_interval`은 [측정 간격 특성](https://www.bluetooth.com/specifications/gatt/)이고, `gatt.characteristic_user_description`은 [특성 사용자 설명 설명자](https://www.bluetooth.com/specifications/assigned-numbers/)입니다.

```js/4-9
navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('health_thermometer'))
.then(service => service.getCharacteristic('measurement_interval'))
.then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
.then(descriptor => descriptor.readValue())
.then(value => {
  const decoder = new TextDecoder('utf-8');
  console.log(`User Description: ${decoder.decode(value)}`);
})
.catch(error => { console.error(error); });
```

장치의 건강 온도계 측정 간격에 대한 사용자 설명을 읽었으므로 이제 이를 업데이트하고 사용자 정의 값을 작성하는 방법을 살펴보겠습니다.

```js/5-9
navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('health_thermometer'))
.then(service => service.getCharacteristic('measurement_interval'))
.then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
.then(descriptor => {
  const encoder = new TextEncoder('utf-8');
  const userDescription = encoder.encode('Defines the time between measurements.');
  return descriptor.writeValue(userDescription);
})
.catch(error => { console.error(error); });
```

## 샘플, 데모 및 코드랩

아래의 모든 [웹 블루투스 샘플](https://googlechrome.github.io/samples/web-bluetooth/index.html)은 성공적으로 테스트되었습니다. 이러한 샘플을 최대한 활용하려면 배터리 서비스, 심박수 서비스 또는 건강 체온계 서비스로 BLE 주변 장치를 시뮬레이션하는 [BLE 주변 장치 시뮬레이터 Android 앱](https://play.google.com/store/apps/details?id=io.github.webbluetoothcg.bletestperipheral)의 설치를 권장합니다.

### 초보자

- [장치 정보](https://googlechrome.github.io/samples/web-bluetooth/device-info.html) - BLE 장치에서 기본 장치 정보를 검색합니다.
- [배터리 수준](https://googlechrome.github.io/samples/web-bluetooth/battery-level.html) - 배터리 정보를 광고하는 BLE 장치에서 배터리 정보를 검색합니다.
- [에너지 재설정](https://googlechrome.github.io/samples/web-bluetooth/reset-energy.html) - 심박수를 알리는 BLE 장치에서 소모된 에너지를 재설정합니다.
- [특성 속성](https://googlechrome.github.io/samples/web-bluetooth/characteristic-properties.html) - BLE 장치의 특정 특성에 대한 모든 속성을 표시합니다.
- [알림](https://googlechrome.github.io/samples/web-bluetooth/notifications.html) - BLE 장치에서 특성 알림을 시작 및 중지합니다.
- [장치 연결 해제](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html) - BLE 장치에 연결한 후 연결을 끊고 연결이 끊어지면 알림을 받습니다.
- [특성 가져오기](https://googlechrome.github.io/samples/web-bluetooth/get-characteristics.html) - BLE 장치에서 광고된 서비스의 모든 특성을 가져옵니다.
- [설명자 가져오기](https://googlechrome.github.io/samples/web-bluetooth/get-descriptors.html) - BLE 장치에서 광고된 서비스의 모든 특성 설명자를 가져옵니다.
- [제조업체 데이터 필터](https://googlechrome.github.io/samples/web-bluetooth/manufacturer-data-filter.html) - BLE 장치에서 제조업체 데이터와 일치하는 기본 장치 정보를 검색합니다.

### 여러 작업 결합

- [GAP 특성](https://googlechrome.github.io/samples/web-bluetooth/gap-characteristics.html) - BLE 장치의 모든 GAP 특성을 가져옵니다.
- [장치 정보 특성](https://googlechrome.github.io/samples/web-bluetooth/device-information-characteristics.html) - BLE 장치의 모든 장치 정보 특성을 가져옵니다.
- [링크 손실](https://googlechrome.github.io/samples/web-bluetooth/link-loss.html) - BLE 장치의 경고 수준 특성(readValue 및 writeValue)을 설정합니다.
- [서비스 및 특성 검색](https://googlechrome.github.io/samples/web-bluetooth/discover-services-and-characteristics.html) - BLE 장치에서 액세스 가능한 모든 기본 서비스와 해당 특성을 검색합니다.
- [자동 재연결](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html) - 지수 백오프 알고리즘을 사용하여 연결이 끊긴 BLE 장치에 다시 연결합니다.
- [변경된 특성 값 읽기](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html) - 배터리 수준을 읽고 BLE 장치에서 변경 사항을 알립니다.
- [설명자 읽기](https://googlechrome.github.io/samples/web-bluetooth/read-descriptors.html) - BLE 장치에서 서비스의 모든 특성 설명자를 읽습니다.
- [설명자 쓰기](https://googlechrome.github.io/samples/web-bluetooth/write-descriptor.html) - BLE 장치의 "특성 사용자 설명" 설명자에 씁니다.

[선별된 웹 블루투스 데모](https://github.com/WebBluetoothCG/demos)와 [공식 웹 블루투스 코드랩](https://github.com/search?q=org%3Agooglecodelabs+bluetooth)도 확인하세요.

## 라이브러리

- [web-bluetooth-utils](https://www.npmjs.com/package/web-bluetooth-utils)는 API에 몇 가지 편의 기능을 추가하는 npm 모듈입니다.
- Web Bluetooth API shim은 가장 널리 사용되는 Node.js BLE 중앙 모듈인 [noble](https://github.com/sandeepmistry/noble)에서 사용할 수 있습니다. 이를 통해 WebSocket 서버 또는 기타 플러그인 없이도 noble을 웹팩/탐색 처리할 수 있습니다.
- [angular-web-bluetooth](https://github.com/manekinekko/angular-web-bluetooth)는 Web Bluetooth API를 구성하는 데 필요한 모든 상용구를 추상화하는 [Angular](https://angularjs.org)용 모듈입니다.

## 도구

- [Get Started with Web Bluetooth](https://beaufortfrancois.github.io/sandbox/web-bluetooth/generator)는 블루투스 장치와 상호 작용을 시작하려고 할 때 모든 JavaScript 상용구 코드를 생성해주는 간단한 웹 앱입니다. 장치 이름, 서비스, 특성을 입력하고 속성을 정의하기만 하면 됩니다.
- 이미 블루투스를 개발 중이라면 [Web Bluetooth Developer Studio Plugin](https://github.com/beaufortfrancois/sandbox/tree/gh-pages/web-bluetooth/bluetooth-developer-studio-plugin)을 이용해 블루투스 장치에 대한 Web Bluetooth JavaScript 코드도 생성할 수 있습니다.

## 팁

Chrome의 `about://bluetooth-internals`에서 제공하는 **Bluetooth Internals** 페이지를 살펴보세요. 상태, 서비스, 특성 및 설명자 등 주변의 블루투스 장치에 대한 모든 것을 검사할 수 있습니다.

<figure>{% Img src="image/admin/nPX2OfcQKwKtU9xBNhMe.jpg", alt="블루투스를 디버깅하기 위한 Chrome의 내부 페이지를 보여주는 스크린샷", width="800", height="572" %}<figcaption> 블루투스 장치 디버깅을 위한 Chrome 내부 페이지입니다.</figcaption></figure>

또한 블루투스 디버깅이 때로 어려울 수 있으므로 공식 [웹 블루투스 버그 신고 방법](https://sites.google.com/a/chromium.org/dev/developers/how-tos/file-web-bluetooth-bugs) 페이지도 확인해 볼 것을 추천합니다.

{% Aside 'caution' %} 블루투스 특성을 동시에 읽고 쓸 경우 플랫폼에 따라 오류가 발생할 수 있습니다. 적절한 경우 GATT 작업 요청을 수동으로 대기열에 추가하는 것이 좋습니다. ["GATT 작업 진행 중 - 처리 방법"](https://github.com/WebBluetoothCG/web-bluetooth/issues/188)을 참조하세요. {% endAside %}

## 향후 계획

먼저 [브라우저 및 플랫폼 구현 현황](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md)을 확인하여 Web Bluetooth API의 어떤 부분이 현재 구현되고 있는지 알아보세요.

아직 불완전하지만 가까운 미래에 무엇을 기대할 수 있는지 살짝 들여다보겠습니다.

- `navigator.bluetooth.requestLEScan()`으로 [주변 BLE 광고 검색](https://github.com/WebBluetoothCG/web-bluetooth/pull/239)이 이루어집니다.
- 새로운 `serviceadded` 이벤트가 새로 발견된 블루투스 GATT 서비스를 추적하고 `serviceremoved` 이벤트는 제거된 서비스를 추적합니다. 블루투스 GATT 서비스에서 특성 및/또는 설명자가 추가되거나 제거되면 새로운 `servicechanged` 이벤트가 발생합니다.

### API에 대한 지원 표시

Web Bluetooth API를 사용할 계획이십니까? Chrome 팀이 기능의 우선 순위를 정하고 브라우저 공급업체에 이 API의 지원이 얼마나 중요한지 보여주기 위해서는 여러분의 공개 지원이 힘이 됩니다.

[`#WebBluetooth`](https://twitter.com/search?q=%23WebBluetooth&src=typed_query&f=live) 해시 태그로 [@ChromiumDev](https://twitter.com/ChromiumDev)에 트윗을 보내어 어디서 어떤 방법으로 이 API를 사용하는지 알려주세요.

## 리소스

- 스택 오버플로: [https://stackoverflow.com/questions/tagged/web-bluetooth](https://stackoverflow.com/questions/tagged/web-bluetooth)
- Chrome 기능 상태: [https://www.chromestatus.com/feature/5264933985976320](https://www.chromestatus.com/feature/5264933985976320)
- Chrome 구현 버그: [https://crbug.com/?q=component:Blink&gt;Bluetooth](https://crbug.com/?q=component:Blink%3EBluetooth)
- 웹 블루투스 사양: [https://webbluetoothcg.github.io/web-bluetooth](https://webbluetoothcg.github.io/web-bluetooth)
- 사양 문제: [https://github.com/WebBluetoothCG/web-bluetooth/issues](https://github.com/WebBluetoothCG/web-bluetooth/issues)
- BLE 주변기기 시뮬레이터 앱: [https://github.com/WebBluetoothCG/ble-test-peripheral-android](https://github.com/WebBluetoothCG/ble-test-peripheral-android)

{% YouTube '_BUwOBdLjzQ' %}

## 감사의 말

이 글을 검토한 [Kayce Basques](https://github.com/kaycebasques)에게 감사의 말을 전합니다. [미국 볼더에 위치한 SparkFun Electronics](https://commons.wikimedia.org/wiki/File:Bluetooth_4.0_Module_-_BR-LE_4.0-S2A_(16804031059).jpg)에서 이미지를 제공했습니다.
