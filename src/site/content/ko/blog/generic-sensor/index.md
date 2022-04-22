---
title: 웹용 센서
subhead: Generic Sensor API를 사용하여 가속도계, 자이로스코프 및 자력계와 같은 장치 내 센서에 액세스합니다.
authors:
  - alexshalamov
  - pozdnyakov
  - thomassteiner
description: 센서는 해당 센서가 실행되는 장치의 방향이나 가속도를 고려하는 게임과 같은 고급 기능을 지원하기 위해 많은 애플리케이션에서 사용됩니다. Generic Sensor API는 웹에서 이러한 센서 데이터에 액세스하기 위한 일반 인터페이스를 제공합니다.
date: 2017-09-18
updated: 2021-02-17
tags:
  - blog
  # - sensors
  - devices
  - capabilities
hero: image/admin/2AGc7aV66zc69fiqNJBZ.jpg
alt: 간단한 자이로스코프.
---

오늘날 센서 데이터는 몰입형 게임, 피트니스 추적, 증강 현실 또는 가상 현실과 같은 응용 사례를 지원하기 위해 많은 플랫폼별 애플리케이션에서 사용됩니다. 플랫폼별 애플리케이션과 웹 애플리케이션 간의 격차를 메울 수 있다면 멋지지 않을까요? 웹을 위한 [Generic Sensor API](https://www.w3.org/TR/generic-sensor/)가 여기에 있습니다!

## Generic Sensor API란? {: #what-is-generic-sensor-api }

[Generic Sensor API](https://www.w3.org/TR/generic-sensor/)는 센서 장치를 웹 플랫폼에 노출하는 인터페이스 집합입니다. API는 기본 [`Sensor`](https://w3c.github.io/sensors/#the-sensor-interface) 인터페이스와 그 위에 구축된 구체적인 센서 클래스 집합으로 구성됩니다. 기본 인터페이스가 있으면 구체적인 센서 클래스에 대한 구현 및 명세화 프로세스가 간소화됩니다. 예를 들어, [`Gyroscope`](https://w3c.github.io/gyroscope/#gyroscope-interface) 클래스를 살펴보세요. 정말 작습니다! 핵심 기능은 기본 인터페이스에 의해 지정되며 `Gyroscope`는 각속도를 나타내는 세 가지 속성으로 이를 확장할 뿐입니다.

일부 센서 클래스는 가속도계 또는 자이로스코프 클래스와 같은 실제 하드웨어 센서와 인터페이스를 구성합니다. 이를 저수준 센서라고 합니다. [융합 센서](https://w3c.github.io/sensors/#sensor-fusion)라고 하는 다른 센서들은 여러 저수준 센서의 데이터를 병합하여 스크립트가 계산했어야 할 정보를 표시합니다. 예를 들어 [`AbsoluteOrientation`](https://www.w3.org/TR/orientation-sensor/#absoluteorientationsensor) 센서는 가속도계, 자이로스코프 및 자력계에서 얻은 데이터를 기반으로 즉시 사용할 수 있는 4x4 회전 매트릭스를 제공합니다.

웹 플랫폼이 이미 센서 데이터를 제공하고 있다고 생각할 수도 있을 겁니다. 여러분의 생각이 절대적으로 옳습니다! 예를 들어 [`DeviceMotion`](https://developer.mozilla.org/docs/Web/API/DeviceMotionEvent) 및 [`DeviceOrientation`](https://developer.mozilla.org/docs/Web/API/DeviceOrientationEvent) 이벤트는 모션 센서 데이터를 노출합니다. 그렇다면 새로운 API가 필요한 이유는 무엇일까요?

기존 인터페이스와 비교하여 Generic Sensor API는 다음과 같은 많은 이점을 제공합니다.

- Generic Sensor API는 새로운 센서 클래스로 쉽게 확장할 수 있는 센서 프레임워크이며 이러한 각 클래스는 일반 인터페이스를 유지합니다. 한 센서 유형에 대해 작성된 클라이언트 코드는 수정이 거의 없이 다른 유형에 재사용될 수 있습니다!
- 센서를 구성할 수 있습니다. 예를 들어, 사용 목적에 맞는 샘플링 주파수를 설정할 수 있습니다.
- 플랫폼에서 센서를 사용할 수 있는지 여부를 감지할 수 있습니다.
- 센서 판독값에는 매우 정밀한 타임스탬프가 있어 애플리케이션의 다른 활동과 더 효과적으로 동기화할 수 있습니다.
- 센서 데이터 모델과 좌표 시스템이 명확하게 정의되므로 브라우저 공급업체가 상호 운용 가능한 솔루션을 구현할 수 있습니다.
- Generic Sensor 기반 인터페이스는 DOM에 바인딩되지 않습니다(즉, `navigator` 및 `window` 개체가 모두 아님). 그 덕분에 향후 서비스 워커 내에서 API를 사용하거나 임베디드 장치와 같은 헤드리스 JavaScript 런타임에서 API를 구현할 수 있는 기회가 열립니다.
- [보안 및 개인정보보호](#privacy-and-security) 측면은 Generic Sensor API에서 최우선적이며 이전 센서 API에 비해 훨씬 더 우수한 보안을 제공합니다. Permissions API와의 통합이 지원됩니다.
- [화면 좌표와의 자동 통합](#synchronization-with-screen-coordinates)은 `Accelerometer`, `Gyroscope`, `LinearAccelerationSensor`, `AbsoluteOrientationSensor`, `RelativeOrientationSensor` 및 `Magnetometer`에 이용할 수 있습니다.

## 브라우저 호환성

Generic Sensor API는 버전 67부터 Google Chrome에서 지원됩니다. Microsoft Edge, Opera 또는 Samsung Internet과 같은 대부분의 Chromium 파생 브라우저도 이 API를 지원합니다. 다른 브라우저의 경우 [사용할 수 있나요?](https://caniuse.com/mdn-api_sensor)를 참조하세요. Generic Sensor API는 [폴리필(polyfill)](#polyfill)이 가능합니다.

## 사용 가능한 Generic Sensor API {: #available-generic-sensor-apis }

이 글을 쓸 당시를 기준으로 실험해볼 수 있는 몇 가지 센서가 있습니다.

**모션 센서:**

- `Accelerometer`
- `Gyroscope`
- `LinearAccelerationSensor`
- `AbsoluteOrientationSensor`
- `RelativeOrientationSensor`
- `GravitySensor`

**환경 센서:**

- `AmbientLightSensor` (Chromium에서 `#enable-generic-sensor-extra-classes` 플래그 뒤에 있음)
- `Magnetometer` (Chromium에서 `#enable-generic-sensor-extra-classes` 플래그 뒤에 있음)

## 기능 감지 {: #feature-detection }

하드웨어 API의 기능 감지는 까다로운데, 브라우저가 해당 인터페이스를 지원하는지, *그리고* 장치에 해당 센서가 있는지 여부를 모두 감지해야 하기 때문입니다. 브라우저가 인터페이스를 지원하는지 확인하는 부분은 간단합니다. `Accelerometer`를 [위에서](#available-generic-sensor-apis) 언급한 다른 인터페이스로 교체하기만 하면 됩니다.

```js
if ('Accelerometer' in window) {
  // The `Accelerometer` interface is supported by the browser.
  // Does the device have an accelerometer, though?
}
```

실제로 의미 있는 기능 감지 결과를 얻으려면 센서 연결도 시도해야 합니다. 다음 예는 그 방법을 보여줍니다.

```js
let accelerometer = null;
try {
  accelerometer = new Accelerometer({ frequency: 10 });
  accelerometer.onerror = (event) => {
    // Handle runtime errors.
    if (event.error.name === 'NotAllowedError') {
      console.log('Permission to access sensor was denied.');
    } else if (event.error.name === 'NotReadableError') {
      console.log('Cannot connect to the sensor.');
    }
  };
  accelerometer.onreading = (e) => {
    console.log(e);
  };
  accelerometer.start();
} catch (error) {
  // Handle construction errors.
  if (error.name === 'SecurityError') {
    console.log('Sensor construction was blocked by the Permissions Policy.');
  } else if (error.name === 'ReferenceError') {
    console.log('Sensor is not supported by the User Agent.');
  } else {
    throw error;
  }
}
```

## 폴리필

Generic Sensor API를 지원하지 않는 브라우저의 경우 [폴리필](https://github.com/kenchris/sensor-polyfills)을 사용할 수 있습니다. 폴리필을 사용하면 관련 센서의 구현만 로드할 수 있습니다.

```js
// Import the objects you need.
import { Gyroscope, AbsoluteOrientationSensor } from './src/motion-sensors.js';

// And they're ready for use!
const gyroscope = new Gyroscope({ frequency: 15 });
const orientation = new AbsoluteOrientationSensor({ frequency: 60 });
```

## 이 센서들은 모두 무엇이고 어떻게 사용할 수 있나요? {: #what-are-sensors-how-to-use-them }

센서는 간략한 소개가 필요할 수 있는 영역입니다. 센서에 익숙하다면 [실습 코딩 섹션](#lets-code)으로 바로 이동할 수 있습니다. 그렇지 않다면 지원되는 각 센서에 대해 자세히 살펴보겠습니다.

### 가속도계 및 선형 가속도 센서 {: #acceleration-and-linear-accelerometer-sensor }

 <figure>  {% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/FCf9iuCaNASEB3V0x8Ld.mp4", width="800", autoplay="true", loop="true", muted="true" %}   <figcaption>     가속도계 센서 측정   </figcaption></figure>

[`Accelerometer`](https://developer.mozilla.org/docs/Web/API/Accelerometer) 센서는 3개 축(X, Y, Z)에서 센서를 장착한 장치의 가속도를 측정합니다. 이 센서는 관성 센서입니다. 즉, 장치가 선형 자유낙하 상태일 때는 측정된 총 가속도가 0 m/s<sup>2</sup>이고 장치가 테이블 위에 평평하게 놓여져 있을 때는 위쪽 방향(Z 축)의 가속도가 지구 중력인 g ≈ +9.8 m/s<sup>2</sup>와 같습니다(테이블이 장치를 위로 미는 힘을 측정함). 장치를 오른쪽으로 밀면 X축의 가속도가 양수이고 장치가 오른쪽에서 왼쪽으로 가속되면 음수가 됩니다.

가속도계는 걸음 수 계산, 동작 감지 또는 간단한 장치 방향과 같은 용도로 사용할 수 있습니다. 가속도계 측정값을 다른 소스의 데이터와 결합하여 방향 센서와 같은 융합 센서를 구성하는 경우도 꽤 많습니다.

[`LinearAccelerationSensor`](https://developer.mozilla.org/docs/Web/API/LinearAccelerationSensor)는 중력의 영향을 제외하고 센서가 장착된 장치에 인가되는 가속도를 측정합니다. 장치가 정지해 있을 때(예: 테이블 위에 평평하게 놓여져 있을 때) 센서는 세 축에서 ≈ 0 m/s<sup>2</sup>의 가속도를 측정합니다.

### 중력 센서 {: #gravity-sensor }

`Accelerometer` 및 `LinearAccelerometer` 판독값을 수동으로 검사하여 중력 센서의 판독값에 가까운 판독값을 수동으로 유도하는 것이 이미 가능하지만 이는 번거롭고 해당 센서에서 제공하는 값의 정확도에 따라 달라질 수 있습니다. Android와 같은 플랫폼은 운영 체제의 일부로 중력 판독값을 제공할 수 있으며, 이는 연산 측면에서 더 저렴하고 사용자의 하드웨어에 따라 더 정확한 값을 제공하며 API 인체공학 측면에서 사용하기 더 쉽습니다. [`GravitySensor`](https://w3c.github.io/accelerometer/#gravitysensor-interface)는 장치의 X, Y 및 Z축을 따라 중력으로 인한 가속 효과를 반환합니다.

### 자이로스코프 {: #gyroscope-sensor }

 <figure>   {% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/7VItzZMC9Rb2QglsE3s5.mp4", width="800", autoplay="true", loop="true", muted="true" %}   <figcaption>     자이로스코프 센서 측정   </figcaption></figure>

[`Gyroscope`](https://developer.mozilla.org/docs/Web/API/Gyroscope) 센서는 장치의 로컬 X, Y 및 Z축 주변에서 각속도(초당 라디안)를 측정합니다. 대부분의 소비자 장치에는 [관성 Coriolis 힘](https://en.wikipedia.org/wiki/Coriolis_force)을 기반으로 회전 속도를 측정하는 관성 센서인 기계식([MEMS](https://en.wikipedia.org/wiki/Coriolis_force)) 자이로스코프가 있습니다. MEMS 자이로스코프는 센서의 중력 감도로 인해 센서의 내부 기계 시스템이 변형되는 관계로 드리프트가 발생하기 쉽습니다. 자이로스코프는 상대적으로 높은 주파수(예: 10kHz)에서 진동하므로 다른 센서에 비해 더 많은 전력을 소비할 수 있습니다.

### 방향 센서 {: #orientation-sensors }

<figure> {% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/rhpW784mCvR78nwg6rd1.mp4", width="800", autoplay="true", loop="true", muted="true" %}   <figcaption>     절대 방향 센서 측정   </figcaption></figure>

[`AbsoluteOrientationSensor`](https://developer.mozilla.org/docs/Web/API/AbsoluteOrientationSensor)는 지구 좌표계를 기준으로 장치의 회전을 측정하는 융합 센서이며, [`RelativeOrientationSensor`](https://developer.mozilla.org/docs/Web/API/RelativeOrientationSensor)는 고정 참조 좌표계를 기준으로 모션 센서가 장착된 장치의 회전을 나타내는 데이터를 제공합니다.

모든 최신 3D JavaScript 프레임워크는 회전을 나타내는 [쿼터니언](https://en.wikipedia.org/wiki/Quaternion) 및 [회전 행렬](https://en.wikipedia.org/wiki/Rotation_matrix)을 모두 지원합니다. 그러나 WebGL을 직접 사용하는 경우 `OrientationSensor`에 [`quaternion` 속성](https://developer.mozilla.org/docs/Web/API/OrientationSensor/quaternion)과 [`populateMatrix()` 메서드](https://developer.mozilla.org/docs/Web/API/OrientationSensor/populateMatrix)가 모두 있어 편리합니다. 다음은 몇 가지 스니펫입니다.

**[three.js](https://threejs.org/docs/index.html#api/core/Object3D.quaternion)**

```js
let torusGeometry = new THREE.TorusGeometry(7, 1.6, 4, 3, 6.3);
let material = new THREE.MeshBasicMaterial({ color: 0x0071c5 });
let torus = new THREE.Mesh(torusGeometry, material);
scene.add(torus);

// Update mesh rotation using quaternion.
const sensorAbs = new AbsoluteOrientationSensor();
sensorAbs.onreading = () => torus.quaternion.fromArray(sensorAbs.quaternion);
sensorAbs.start();

// Update mesh rotation using rotation matrix.
const sensorRel = new RelativeOrientationSensor();
let rotationMatrix = new Float32Array(16);
sensor_rel.onreading = () => {
  sensorRel.populateMatrix(rotationMatrix);
  torus.matrix.fromArray(rotationMatrix);
};
sensorRel.start();
```

**[BABYLON](https://doc.babylonjs.com/typedoc/classes/babylon.abstractmesh#rotationquaternion)**

```js
const mesh = new BABYLON.Mesh.CreateCylinder('mesh', 0.9, 0.3, 0.6, 9, 1, scene);
const sensorRel = new RelativeOrientationSensor({ frequency: 30 });
sensorRel.onreading = () => mesh.rotationQuaternion.FromArray(sensorRel.quaternion);
sensorRel.start();
```

**[WebGL](https://www.khronos.org/registry/webgl/specs/latest/2.0/)**

```js
// Initialize sensor and update model matrix when new reading is available.
let modMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
const sensorAbs = new AbsoluteOrientationSensor({ frequency: 60 });
sensorAbs.onreading = () => sensorAbs.populateMatrix(modMatrix);
sensorAbs.start();

// Somewhere in rendering code, update vertex shader attribute for the model
gl.uniformMatrix4fv(modMatrixAttr, false, modMatrix);
```

방향 센서를 이용하면 몰입형 게임, 증강 및 가상 현실과 같은 다양한 활용이 가능합니다.

모션 센서, 고급 사용 사례 및 요구 사항에 대한 자세한 내용은 [모션 센서 설명](https://w3c.github.io/motion-sensors/) 문서를 확인하세요.

## 화면 좌표와 동기화 {: #synchronization-with-screen-coordinates }

기본적으로, [공간 센서](https://w3c.github.io/sensors/#spatial-sensor)의 판독값은 장치에 구속되지만 화면 방향을 고려하지 않는 로컬 좌표계에서 확인됩니다.

<figure>   {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/xI2V6To5gx5WbXunpOBh.png", alt="장치 좌표계", width="800", height="520" %}   <figcaption>장치 좌표계</figcaption></figure>

그러나 게임이나 증강 현실 및 가상 현실과 같은 많은 사용 사례에서는 이와 달리 화면 방향에 구속되는 좌표계에서 센서 판독값을 확인해야 합니다.

<figure>   {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/x1PUlYnAXb9QkqwLV04g.png", alt="화면 좌표계", width="800", height="520" %}   <figcaption>화면 좌표계</figcaption></figure>

이전에는 화면 좌표에 대한 센서 판독값의 재매핑을 JavaScript로 구현해야 했습니다. 이 접근 방식은 비효율적이며 웹 애플리케이션 코드의 복잡성을 크게 증가시킵니다. 웹 애플리케이션은 화면 방향의 변화를 관찰하고 센서 판독값에 대한 좌표 변환을 수행해야 하는데, 이는 오일러 각도 또는 쿼터니언에 대해 간단하게 처리할 수 있는 일이 아닙니다.

Generic Sensor API는 훨씬 간단하고 안정적인 솔루션을 제공합니다! 다음과 같은 정의된 모든 공간 센서 클래스에 대해 로컬 좌표계를 구성할 수 있습니다: `Accelerometer`, `Gyroscope`, `LinearAccelerationSensor`, `AbsoluteOrientationSensor`, `RelativeOrientationSensor` 및 `Magnetometer`. 사용자는 `referenceFrame` 옵션을 센서 개체 생성자에 전달하여 반환된 판독값을 [장치](https://w3c.github.io/accelerometer/#device-coordinate-system) 또는 [화면](https://w3c.github.io/accelerometer/#screen-coordinate-system) 좌표에서 확인할지 여부를 정의합니다.

```js
// Sensor readings are resolved in the Device coordinate system by default.
// Alternatively, could be RelativeOrientationSensor({referenceFrame: "device"}).
const sensorRelDevice = new RelativeOrientationSensor();

// Sensor readings are resolved in the Screen coordinate system. No manual remapping is required!
const sensorRelScreen = new RelativeOrientationSensor({ referenceFrame: 'screen' });
```

## 코딩을 해봅시다! {: #lets-code }

Generic Sensor API는 매우 간단하고 사용하기 쉽습니다! 센서 인터페이스에는 센서 상태를 제어하기 위한 [`start()`](https://w3c.github.io/sensors/#sensor-start) 및 [`stop()`](https://w3c.github.io/sensors/#sensor-stop) 메서드와 센서 활성화, 오류 및 새롭게 제공되는 판독값에 대한 알림을 수신하기 위한 여러 이벤트 핸들러가 있습니다. 구체적인 센서 클래스는 일반적으로 기본 클래스에 특정 판독 속성을 추가합니다.

### 개발 환경

개발 중에 `localhost`를 통해 센서를 사용할 수 있습니다. 모바일 장치용으로 개발 중인 경우 로컬 서버용 [포트 포워딩](https://developer.chrome.com/docs/devtools/remote-debugging/local-server/)을 설정하면 바로 사용할 수 있습니다!

코드가 준비되면 HTTPS를 지원하는 서버에 배포합니다. [GitHub 페이지](https://pages.github.com/)는 HTTPS를 통해 제공되므로 데모를 공유하기에 훌륭합니다.

### 3D 모델 회전

이 간단한 예에서는 절대 방향 센서의 데이터를 사용하여 3D 모델의 회전 쿼터니언을 수정합니다. `model`은 [`quaternion`](https://threejs.org/docs/index.html#api/core/Object3D) 속성이 있는 three.js [`Object3D`](https://threejs.org/docs/index.html#api/core/Object3D.quaternion) 클래스 인스턴스입니다. [방향 전화](https://github.com/intel/generic-sensor-demos/tree/master/orientation-phone) 데모의 다음 코드 스니펫은 절대 방향 센서를 사용하여 3D 모델을 회전하는 방법을 보여줍니다.

```js
function initSensor() {
  sensor = new AbsoluteOrientationSensor({ frequency: 60 });
  sensor.onreading = () => model.quaternion.fromArray(sensor.quaternion);
  sensor.onerror = (event) => {
    if (event.error.name == 'NotReadableError') {
      console.log('Sensor is not available.');
    }
  };
  sensor.start();
}
```

장치의 방향은 WebGL 장면 내에서 3D `model` 회전에 반영됩니다.

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/CdYXzmhv0ZNBvETuC6SX.png", alt="센서가 3D 모델의 방향을 업데이트", width="338", height="368" %}<figcaption> 센서가 3D 모델의 방향을 업데이트합니다.</figcaption></figure>

### 펀치미터

다음 코드 스니펫은 [펀치미터 데모](https://github.com/intel/generic-sensor-demos/tree/master/punchmeter)에서 추출한 내용으로, 초기에 정지 상태에 있다는 가정 하에 선형 가속도 센서를 사용하여 장치의 최대 속도를 계산하는 방법을 보여줍니다.

```js
this.maxSpeed = 0;
this.vx = 0;
this.ax = 0;
this.t = 0;

/* … */

this.accel.onreading = () => {
  let dt = (this.accel.timestamp - this.t) * 0.001; // In seconds.
  this.vx += ((this.accel.x + this.ax) / 2) * dt;

  let speed = Math.abs(this.vx);

  if (this.maxSpeed < speed) {
    this.maxSpeed = speed;
  }

  this.t = this.accel.timestamp;
  this.ax = this.accel.x;
};
```

현재 속도는 가속도 함수의 적분에 대한 근사값으로 계산됩니다.

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/37a9DYv1huOcraAMfXpO.png", alt="펀치 속도 측정을 위한 데모 웹 애플리케이션", width="338", height="347" %}<figcaption> 펀치 속도 측정</figcaption></figure>

## Chrome DevTools를 사용한 디버깅 및 센서 재정의

어떤 경우에는 물리적 장치가 없어도 Generic Sensor API를 사용해볼 수 있습니다. Chrome DevTools는 [장치 방향 시뮬레이션](https://developer.chrome.com/docs/devtools/device-mode/orientation/)을 훌륭하게 지원합니다.

<figure>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/OWhCoZXMZllhI7fN7BMR.png", alt="가상 전화의 사용자 지정 방향 데이터를 재정의하는 데 사용되는 Chrome DevTools", width="800", height="648" %}<figcaption> Chrome DevTools로 장치 방향 시뮬레이션</figcaption></figure>

## 개인정보보호 및 보안 {: #privacy-and-security }

센서 판독값은 악성 웹 페이지의 다양한 공격을 받을 수 있는 민감한 데이터입니다. Generic Sensor API를 구현하면 가능한 보안 및 개인정보 위험을 완화하는 몇 가지 제한이 적용됩니다. API를 사용하려는 개발자는 이러한 제한 사항을 고려해야 하므로 간단히 살펴보겠습니다.

### HTTPS 전용

Generic Sensor API는 강력한 기능이므로 브라우저는 보안 컨텍스트에서만 이를 허용합니다. 실질적으로 이것이 의미하는 것은 Generic Sensor API를 사용하려면 HTTPS를 통해 페이지에 액세스해야 한다는 것입니다. 개발 중에는 [http://localhost](http://localhost)를 통해 그렇게 할 수 있지만 프로덕션을 위해서는 서버에 HTTPS가 있어야 합니다. 모범 사례와 지침은 [안전하고 보호된](/secure/) 컬렉션을 참조하세요.

### 권한 정책 통합

Generic Sensor API의 [권한 정책 통합](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/)은 프레임의 센서 데이터에 대한 액세스를 제어합니다.

기본적으로 `Sensor` 개체는 메인 프레임 또는 동일 출처 서브프레임 내에서만 생성될 수 있으므로 교차 출처 iframe이 승인 없이 센서 데이터를 읽는 것을 방지합니다. 이 기본 동작은 해당 [정책 제어 기능](https://w3c.github.io/webappsec-permissions-policy/#features)을 명시적으로 활성화하거나 비활성화하여 수정할 수 있습니다.

아래 스니펫은 교차 출처 iframe에 가속도계 데이터 액세스 권한을 부여하는 방법을 보여줍니다. 즉, 이제 `Accelerometer` 또는 `LinearAccelerationSensor` 개체를 생성할 수 있습니다.

```html
<iframe src="https://third-party.com" allow="accelerometer" />
```

### 센서 판독값 전달이 중단될 수 있습니다

센서 판독값은 보이는 웹 페이지에서만 액세스할 수 있습니다. 즉, 사용자가 실제로 페이지와 상호 작용할 때만 가능합니다. 또한 사용자 포커스가 교차 출처 서브프레임으로 변경되면 센서 데이터가 상위 프레임에 제공되지 않습니다. 그러면 상위 프레임이 사용자 입력을 유추하지 못하게 됩니다.

## 향후 전망 {: #whats-next }

[주변광 센서](https://w3c.github.io/ambient-light/) 또는 [근접 센서](https://w3c.github.io/proximity/)와 같이 가까운 장래에 구현될 일단의 센서 클래스들이 있습니다. 그러나 Generic Sensor 프레임워크의 뛰어난 확장성 덕분에 다양한 센서 유형을 나타내는 훨씬 더 새로운 클래스들이 등장할 것으로 예상됩니다.

향후 작업이 필요한 또 다른 중요 영역은 Generic Sensor API 자체를 개선하는 것입니다. Generic Sensor 사양은 현재 Candidate Recommendation 상태입니다. 즉, 수정 사항을 적용하고 개발자가 필요로 하는 새로운 기능이 나오기까지 아직 시간이 걸릴 것입니다.

## 여러분도 도움을 줄 수 있습니다!

센서 사양이 [Candidate Recommendation](https://www.w3.org/Consortium/Process/Process-19991111/tr.html#RecsCR) 성숙도 수준에 왔으므로 웹 및 브라우저 개발자의 피드백이 많은 도움이 될 수 있습니다. 추가하면 좋을 만한 기능이나 현재 API에서 수정되기를 바라는 부분이 있다면 알려주세요.

Chrome 구현에 대한 [사양 문제](https://github.com/w3c/sensors/issues/new)와 [버그](https://bugs.chromium.org/p/chromium/issues/entry)가 있으면 언제든지 제출해 주세요.

## 리소스

- 데모 프로젝트: [https://intel.github.io/generic-sensor-demos/](https://intel.github.io/generic-sensor-demos/)
- Generic Sensor API 사양: [https://w3c.github.io/sensors/](https://w3c.github.io/sensors/)
- 사양 문제: [https://github.com/w3c/sensors/issues](https://github.com/w3c/sensors/issues)
- W3C 워킹 그룹 메일링 리스트: [public-device-apis@w3.org](mailto:public-device-apis@w3.org)
- Chrome 기능 상태: [https://www.chromestatus.com/feature/5698781827825664](https://www.chromestatus.com/feature/5698781827825664)
- 구현 버그: [http://crbug.com?q=component:Blink&gt;센서](http://crbug.com?q=component:Blink%3ESensor)

## 감사의 말

이 글은 [Joe Medley](https://github.com/jpmedley)와 [Kayce Basques](https://github.com/kaycebasques)가 검토했습니다. [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Simple_Gyroscope.jpg)를 통해 [Misko](https://www.flickr.com/photos/msk13/)가 영웅 이미지를 제공했습니다.
