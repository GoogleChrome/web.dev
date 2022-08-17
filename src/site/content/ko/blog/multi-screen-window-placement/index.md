---
title: Multi-Screen Window Placement API로 여러 디스플레이 관리하기
subhead: 연결된 디스플레이에 대한 정보를 얻고 해당 디스플레이와 관련된 창 위치를 지정합니다.
authors:
  - thomassteiner
description: Muti-Screen Window Placement API를 사용하면 컴퓨터에 연결된 디스플레이를 열거하고 특정 화면에 창을 배치할 수 있습니다.
date: 2020-09-14
updated: 2021-11-10
tags:
  - blog
  - capabilities
hero: image/admin/9wQYJACMKOM6aUA0BPsW.jpg
alt: 여러 가짜 암호화폐와 가격 차트를 보여주는 시뮬레이션된 거래 데스크.
origin_trial:
  url: "https://developer.chrome.com/origintrials/#/view_trial/-8087339030850568191"
feedback:
  - api
---

{% Aside %} Multi-Screen Window Placement API는 [기능 프로젝트의](https://developer.chrome.com/blog/fugu-status/) 일부이며 현재 개발 중입니다. 이 게시물은 구현이 진행되는 대로 업데이트됩니다. {% endAside %}

Muti-Screen Window Placement API를 사용하면 컴퓨터에 연결된 디스플레이를 열거하고 특정 화면에 창을 배치할 수 있습니다.

### 제안된 사용 사례 {: #use-cases }

이 API를 사용할 수 있는 사이트의 예는 다음과 같습니다.

- [Gimp의](https://www.gimp.org/release-notes/gimp-2.8.html#single-window-mode) 멀티 윈도우 그래픽 에디터는 정확한 위치의 창에 다양한 편집 도구를 배치할 수 있습니다.
- 가상 트레이딩 데스크는 전체 화면 모드에서 볼 수 있는 여러 창에서 시장 동향을 표시할 수 있습니다.
- 슬라이드쇼 앱은 내부 기본 화면에 발표자 노트를 표시하고 외부 프로젝터에 프레젠테이션을 표시할 수 있습니다.

## 현재 상태 {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">단계</th>
<th data-md-type="table_cell">상태</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. 안내서 만들기</td>
<td data-md-type="table_cell"><a href="https://github.com/webscreens/window-placement/blob/main/EXPLAINER.md" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 사양의 초안 작성</td>
<td data-md-type="table_cell"><a href="https://webscreens.github.io/window-placement/" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. 피드백 수집 및 설계 반복</td>
<td data-md-type="table_cell">진행</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. <strong data-md-type="double_emphasis">원본 평가판</strong>
</td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis"><p data-md-type="paragraph"><a href="https://developer.chrome.com/origintrials/#/view_trial/-8087339030850568191" data-md-type="link">진행</a></p></strong></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. 출시</td>
<td data-md-type="table_cell">시작되지 않음</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Multi-Screen Window Placement API 사용 방법 {: #use }

### about://flags를 통해 활성화

원본 평가판 토큰 없이 로컬에서 Multi-Screen Window Placement API를 실험하려면 `about://flags`에서 `#enable-experimental-web-platform-features`플래그를 활성화하십시오.

### 원본 평가판 단계 동안 지원 활성화

첫 번째 원본 평가판은 Chromium 86에서 Chromium 88로 실행되었습니다. 이 원본 평가판 이후에 API를 일부 [변경](https://github.com/webscreens/window-placement/blob/main/CHANGES.md)했습니다. 이에 따라 기사가 업데이트되었습니다.

Chromium 93부터 Multi-Screen Window Placement API는 Chromium에서 원본 평가판으로 다시 사용할 수 있습니다. 이 두 번째 원본 평가판은 Chromium 96(2021년 12월 15일)에서 종료될 것으로 예상됩니다.

{% include 'content/origin-trials.njk' %}

### 원본 평가판 등록 {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### 문제

오랜 시간 검증된 창 제어 접근 방식인 [`Window.open()`](https://developer.mozilla.org/docs/Web/API/Window/open)은 불행히도 추가 화면을 인식하지 못합니다. 이 API의 일부 측면(예: [`windowFeatures`](https://developer.mozilla.org/docs/Web/API/Window/open#Parameters:~:text=title.-,windowFeatures) `DOMString` 매개변수)은 약간 구식인 것처럼 보이지만 그럼에도 불구하고 수년 동안 우리에게 도움이 되었습니다. 창의 [위치](https://developer.mozilla.org/docs/Web/API/Window/open#Position)를 지정하려면 좌표를 `left`와 `top` (또는 `screenX` 및 `screenY`)으로 전달하고 원하는 [크기](https://developer.mozilla.org/docs/Web/API/Window/open#Size:~:text=well.-,Size)를 `width`와 `height` (또는 `innerWidth` 및 `innerHeight`)로 전달할 수 있습니다. 예를 들어, 왼쪽에서 50픽셀, 위쪽에서 50픽셀 떨어진 400×300 창을 열려면 다음 코드를 사용할 수 있습니다.

```js
const popup = window.open(
  'https://example.com/',
  'My Popup',
  'left=50,top=50,width=400,height=300',
);
```

[`Screen`](https://developer.mozilla.org/docs/Web/API/Screen) 객체를 반환하는 [`window.screen`](https://developer.mozilla.org/docs/Web/API/Window/screen) 속성을 보면 현재 화면에 대한 정보를 얻을 수 있습니다. 이것은 제 MacBook Pro 13″의 출력 입니다.

```js
window.screen;
/* Output from my MacBook Pro 13″:
  availHeight: 969
  availLeft: 0
  availTop: 25
  availWidth: 1680
  colorDepth: 30
  height: 1050
  isExtended: true
  onchange: null
  orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
  pixelDepth: 30
  width: 1680
*/
```

기술 분야에서 일하는 대부분의 사람들과 마찬가지로 저도 새로운 업무 현실에 적응하고 개인 홈 오피스를 설정해야 했습니다. 제 것은 아래 사진과 같습니다(관심이 있다면 [제 설정에 대한 전체 세부 정보](https://blog.tomayac.com/2020/03/23/my-working-from-home-setup-during-covid-19/)를 읽을 수 있습니다). 제 MacBook 옆에 있는 iPad는 [Sidecar](https://support.apple.com/en-us/HT210380)를 통해 노트북에 연결되어 있으므로 필요할 때마다 iPad를 두 번째 화면으로 빠르게 전환할 수 있습니다.

<figure>{% Img src="image/admin/Qt3SlHOLDzxpZ3l3bN5t.jpg", alt="2개의 의자에 놓인 학교 벤치입니다. 학교 벤치 위에는 노트북을 지지하는 신발 상자와 이를 둘러싸고 있는 두 대의 iPad가 있습니다.", width="558", height="520" %}<figcaption> 멀티 스크린 설정.</figcaption></figure>

더 큰 화면을 활용하고 싶다면 위 [코드 샘플](/multi-screen-window-placement/#the-problem)의 팝업을 두 번째 화면에 추가하면 됩니다. 저는 이것을 다음과 같이 했습니다.

```js
popup.moveTo(2500, 50);
```

두 번째 화면의 크기를 알 수 있는 방법이 없기 때문에 이것은 대략적인 추측입니다. `window.screen`의 정보는 빌트인 스크린만 포함하고 iPad 화면은 포함하지 않습니다. 보고 된 빌트인 스크린의 `width`는 `1680`픽셀이며, 저는 그것이 제 맥북의 오른쪽에 있는 것을 알고 있기 때문에 `2500`픽셀 이동하여 창을 iPad로 전환할 수 있을지도 *모릅니다*. 일반적인 경우에는 어떻게 해야 할까요? 추측하는 것보다 더 나은 방법이 있다는 것이 밝혀졌습니다. 이것이 바로 Multi-Screen Window Placement API입니다.

### 기능 감지

Multi-Screen Window Placement API가 지원되는지 확인하려면 다음을 사용하세요.

```js
if ('getScreenDetails' in window) {
  // Multi-Screen Window Placement API가 지원됩니다.
}
```

### `window-placement` 권한

Multi-Screen Window Placement API를 사용하려면 먼저 사용자에게 권한을 요청해야 합니다. 새 `window-placement` 권한은 다음과 같이 [Permissions API](https://developer.mozilla.org/docs/Web/API/Permissions_API)를 사용하여 쿼리할 수 있습니다.

```js
let granted = false;
try {
  const { state } = await navigator.permissions.query({ name: 'window-placement' });
  granted = state === 'granted';
} catch {
  // 없습니다.
}
```

브라우저는 새 API의 방법을 처음 사용하려고 할 때 권한 프롬프트를 동적으로 표시하도록 선택 [가능](https://webscreens.github.io/window-placement/#usage-overview-screen-information:~:text=This%20method%20may%20prompt%20the%20user%20for%20permission)합니다. 자세히 알아보려면 계속 읽어보세요.

### `window.screen.isExtended` 속성

두 개 이상의 화면이 내 장치에 연결되어 있는지 확인하기 위해 `window.screen.isExtended` 속성에 액세스합니다. `true` 또는 `false`를 반환합니다. 제 설정의 경우 `true`를 반환합니다.

```js
window.screen.isExtended;
// `true` 또는 `false`를 반환합니다.
```

### `getScreenDetails()` 메서드

`Window.getScreenDetails()`를 사용하여 두 번째 화면에 대한 자세한 정보를 얻을 수 있습니다. 이 기능을 호출하면 사이트가 열리고 내 화면에 창을 배치할 수 있는지 묻는 권한 프롬프트가 표시됩니다. `ScreenDetailed` 개체로 resolve 되는 promise를 반환합니다. iPad가 연결된 MacBook Pro 13에는 두 개의 `ScreenDetailed` 개체가 있는`screens` 필드를 포함합니다.

```js
await window.getScreenDetails();
/* Output from my MacBook Pro 13″ with the iPad attached:
{
  currentScreen: ScreenDetailed {left: 0, top: 0, isPrimary: true, isInternal: true, devicePixelRatio: 2, …}
  oncurrentscreenchange: null
  onscreenschange: null
  screens: [{
    // MacBook Pro
    availHeight: 969
    availLeft: 0
    availTop: 25
    availWidth: 1680
    colorDepth: 30
    devicePixelRatio: 2
    height: 1050
    isExtended: true
    isInternal: true
    isPrimary: true
    label: ""
    left: 0
    onchange: null
    orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
    pixelDepth: 30
    top: 0
    width: 1680
  },
  {
    // iPad
    availHeight: 999
    availLeft: 1680
    availTop: 25
    availWidth: 1366
    colorDepth: 24
    devicePixelRatio: 2
    height: 1024
    isExtended: true
    isInternal: false
    isPrimary: false
    label: ""
    left: 1680
    onchange: null
    orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
    pixelDepth: 24
    top: 0
    width: 1366
  }]
}
*/
```

연결된 화면에 대한 정보는 `screens` 배열에서 사용할 수 있습니다. iPad에 대한 `left` 값이 빌트인 디스플레이 `width`와 정확히 일치하는 `1680`에서 시작하는 방식에 유의하세요. 이를 통해 화면이 논리적으로 정렬되는 방식을 정확하게 결정할 수 있습니다(서로 나란히, 서로 위에 등). 각 화면에는 그것이 `isInternal`인지와 `isPrimary`인지를 보여주는 데이터도 있습니다. 빌트인 스크린이 [반드시 기본 화면일 필요는 없습니다](https://osxdaily.com/2010/04/27/set-the-primary-display-mac/#:~:text=Click%20on%20the%20Display%20icon,primary%20display%20for%20your%20Mac).

`currentScreen` 필드는 현재 `window.screen`에 해당하는 라이브 객체입니다. 개체는 교차 화면 창 배치 또는 장치 변경 시 업데이트됩니다.

### `screenschange` 이벤트

지금 놓친 유일한 것은 내 화면 설정이 변경될 때 감지하는 방법입니다. 새로운 이벤트인 `screenschange`는 정확히 그 일을 합니다. 화면 구성이 수정될 때마다 발생합니다. ("screens"는 이벤트 이름에서 복수라는 점에 유의하십시오.) 이는 새 화면이나 기존 화면(Sidecar의 경우 물리적으로 또는 가상으로)이 연결되거나 연결 해제될 때마다 이벤트가 발생함을 의미합니다.

새 화면 세부 정보를 비동기식으로 조회해야 하며 `screenschange` 이벤트 자체는 이 데이터를 제공하지 않습니다. 화면 세부 정보를 조회하려면 캐시된 `Screens` 인터페이스에서 라이브 개체를 사용하세요.

```js
const screenDetails = await window.getScreenDetails();
let cachedScreensLength = screenDetails.screens.length;
screenDetails.addEventListener('screenschange', (event) => {
  if (screenDetails.screens.length !== cachedScreensLength) {
    console.log(
      `The screen count changed from ${cachedScreensLength} to ${screenDetails.screens.length}`,
    );
    cachedScreensLength = screenDetails.screens.length;
  }
});
```

### `currentscreenchange` 이벤트

현재 화면의 변경 사항(즉, 라이브 객체 `currentScreen`의 값)에만 관심이 있는 경우, `currentscreenchange` 이벤트를 수신할 수 있습니다.

```js
const screenDetails = await window.getScreenDetails();
screenDetails.addEventListener('currentscreenchange', async (event) => {
  const details = screenDetails.currentScreen;
  console.log('The current screen has changed.', event, details);
});
```

### `change` 이벤트

마지막으로 구체적인 화면의 변경에만 관심이 있는 경우 해당 화면의 `change` 이벤트를 수신할 수 있습니다.

```js
const firstScreen = (await window.getScreenDetails())[0];
firstScreen.addEventListener('change', async (event) => {
  console.log('The first screen has changed.', event, firstScreen);
});
```

### 새로운 전체 화면 옵션

지금까지, 적절한 이름의 [`requestFullScreen()`](https://developer.mozilla.org/docs/Web/API/Element/requestFullscreen) 메서드를 통해 요소가 전체 화면 모드로 표시되도록 요청할 수 있었습니다. 이 메서드는 `FullscreenOptions`를 전달할 수 있는 경우 `options` 매개 변수를 사용합니다. 지금까지 유일한 속성은 [`navigationUI`](https://developer.mozilla.org/docs/Web/API/FullscreenOptions/navigationUI)입니다. Multi-Screen Window Placement API는 전체 화면 보기를 시작할 화면을 결정할 수 `screen` 속성을 추가합니다. 예를 들어 기본 화면을 전체 화면으로 만들려면 다음을 수행합니다.

```js
try {
  const primaryScreen = (await getScreenDetails()).screens.filter((screen) => screen.isPrimary)[0];
  await document.body.requestFullscreen({ screen: primaryScreen });
} catch (err) {
  console.error(err.name, err.message);
}
```

### 폴리필

Multi-Screen Window Placement API를 폴리필할 수는 없지만 모양을 메꿔 다음과 같이 새 API에 대해서만 코딩할 수 있습니다.

```js
if (!('getScreenDetails' in window)) {
  // 현재 스크린에서 one-element 반환,
  // 더 있을 수 있다는 것을 유의합니다.
  window.getScreenDetails = async () => [window.screen];
  // 거짓일 수 있다는 점에 유의하여 'false'로 설정합니다.
  window.screen.isExtended = false;
}
```

API의 다른 측면, 즉, 다양한 화면 변경 이벤트 및 `FullscreenOptions`의 `screen` 속성은 지원되지 않는 브라우저에서 각각 실행되거나 자동으로 무시되지 않습니다.

## 데모

여러분이 저와 같다면 다양한 암호 화폐의 발전을 예의주시하고 있을 겁니다. (사실 저는 이 행성을 사랑하기 때문에 별로 좋아하지 않지만, 이 기사를 위해 그냥 제가 그랬다고 가정합니다.) 제가 소유하고 있는 암호화폐를 추적하기 위해, 나는 내가 볼 수 있는 웹 앱을 개발했습니다. 제 침대의 안락함과 같은 모든 삶의 상황에서 시장은 괜찮은 단일 화면 설정을 가지고 있습니다.

<figure>{% Img src="image/admin/sSLkcAMHuqBaj4AmT5eP.jpg", alt="작가의 다리가 부분적으로 보이는 침대 끝의 거대한 TV 화면 화면에는 가짜 암호 화폐 거래 데스크가 있습니다. ", width=" 800", height="863" %}<figcaption> 휴식과 시장 구경.</figcaption></figure>

이것은 암호화에 관한 것이기 때문에 시장은 언제든지 바빠질 수 있습니다. 이런 일이 발생하면 다중 화면 설정이 있는 책상으로 빠르게 이동할 수 있습니다. 통화 창을 클릭하면 반대쪽 화면의 전체 화면 보기에서 전체 세부 정보를 빠르게 볼 수 있습니다. 아래는 지난 [YCY 유혈 사태](https://www.youtube.com/watch?v=dQw4w9WgXcQ) 중에 찍은 최근 사진입니다. 그것은 저를 완전히 방심하게 했고 저는 [제 얼굴에 손을 얹었습니다](https://www.buzzfeednews.com/article/gavon/brokers-with-hands-on-their-faces).

<figure>{% Img src="image/admin/wFu8TBzOAqaKCgcERr3z.jpg", alt="가짜 암호 화폐 거래 데스크를 바라보는 당황한 얼굴에 손을 얹은 작성자.", width="800", height="600" %}<figcaption> 패닉, YCY  유혈 사태 목격.</figcaption></figure>

아래에 포함된 [데모](https://window-placement.glitch.me/)로 플레이하거나 글리치에서 [소스 코드](https://glitch.com/edit/#!/window-placement)를 볼 수 있습니다.

<!-- Copy and Paste Me -->

<div class="glitch-embed-wrap" style="height: 800px; width: 100%;">   <iframe src="https://window-placement.glitch.me/" title="window-placement on Glitch" allow="fullscreen; window-placement" sandbox="allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## 보안 및 권한

Chrome 팀은 사용자 제어, 투명성 및 인체 공학을 포함하여 [강력한 웹 플랫폼 기능에 대한 액세스 제어](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md)에 정의된 핵심 원칙을 사용하여 다중 화면 창 배치 API를 설계하고 구현했습니다. Multi-Screen Window Placement API는 장치에 연결된 화면에 대한 새로운 정보를 노출하여 사용자, 특히 여러 화면이 장치에 지속적으로 연결된 사용자의 지문 표면을 증가시킵니다. 이러한 개인 정보 보호 문제를 완화하기 위해 노출된 화면 속성은 일반적인 배치 사용 사례에 필요한 최소로 제한됩니다. 사이트가 다중 화면 정보를 얻고 다른 화면에 창을 배치하려면 사용자 권한이 필요합니다.

### 사용자 제어

사용자는 설정 노출을 완전히 제어할 수 있습니다. 브라우저의 사이트 정보 기능을 통해 권한 프롬프트를 수락하거나 거부하고 이전에 부여된 권한을 취소할 수 있습니다.

### 투명도

Multi-Screen Window Placement API를 사용할 수 있는 권한이 부여되었는지 여부는 브라우저의 사이트 정보에 노출되며 Permissions API를 통해서도 조회할 수 있습니다.

### 권한 지속성

브라우저는 권한 부여를 유지합니다. 권한 철회는 브라우저의 사이트 정보를 통해 가능합니다.

## 피드백 {: #feedback }

Chrome 팀은 Multi-Screen Window Placement API 사용 경험에 대해 듣고 싶습니다.

### API 설계에 대해 알려주세요

API에서 예상한 대로 작동하지 않는 부분이 있습니까? 아니면 아이디어를 구현하는 데 필요한 메서드나 속성이 누락되었습니까? 보안 모델에 대한 질문이나 의견이 있으십니까?

- 해당 [GitHub 리포지토리](https://github.com/webscreens/window-placement/issues)에 사양 문제를 제출하거나 기존 문제에 의견을 추가하세요.

### 구현 문제 보고

Chrome 구현에서 버그를 찾으셨나요? 아니면 구현이 사양과 다른가요?

- [https://new.crbug.com](https://new.crbug.com)에서 버그를 신고하세요 . 가능한 한 많은 세부 정보를 포함하고 버그를 재현하기 위한 간단한 지침을 제공하고 **구성 요소** 상자에 [`Blink>WindowDialog`](https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3EWindowDialog)을 입력합니다. [Glitch](https://glitch.com/)는 빠르고 쉬운 재현을 공유하는 데 유용합니다.

### API에 대한 지원 표시

Multi-Screen Window Placement API를 사용할 계획이십니까? Chrome 팀이 기능의 우선 순위를 정하고 브라우저 공급업체에 이 API의 지원이 얼마나 중요한지 보여주기 위해서는 여러분의 공개 지원이 힘이 됩니다.

- [WICG Discourse 스레드](https://discourse.wicg.io/t/proposal-supporting-window-placement-on-multi-screen-devices/3948)에서 사용 계획을 공유하세요.
- [`#WindowPlacement`](https://twitter.com/search?q=%23WindowPlacement&src=typed_query&f=live) 해시 태그로 [@ChromiumDev](https://twitter.com/ChromiumDev)에 트윗을 보내어 어디서 어떤 방법으로 이 API를 사용하는지 알려주세요.
- 다른 브라우저 공급업체에 API 구현을 요청하세요.

## 유용한 링크 {: #helpful }

- [사양 초안](https://webscreens.github.io/window-placement/)
- [공개 설명문](https://github.com/webscreens/window-placement/blob/main/EXPLAINER.md)
- [Muti-Screen Window Placement API 데모](https://window-placement.glitch.me/) | [Muti-Screen Window Placement API 데모 소스](https://glitch.com/edit/#!/window-placement)
- [크롬 버그 추적](https://crbug.com/897300)
- [ChromeStatus.com 항목](https://chromestatus.com/feature/5252960583942144)
- Blink 구성 요소: [`Blink>WindowDialog`](https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3EWindowDialog)
- [TAG 검토](https://github.com/w3ctag/design-reviews/issues/522)
- [실험 의도](https://groups.google.com/a/chromium.org/g/blink-dev/c/C6xw8i1ZIdE/m/TJsr0zXxBwAJ)

## 감사의 말

Multi-Screen Window Placement API 사양은 [Victor Costan](https://www.linkedin.com/in/pwnall)과 [Joshua Bell](https://www.linkedin.com/in/joshuaseanbell)이 편집했습니다. API는 [Mike Wasserman](https://www.linkedin.com/in/mike-wasserman-9900a079/)과 [Adrienne Walker](https://github.com/quisquous)이 구현했습니다. 이 기사는 [Joe Medley](https://github.com/jpmedley), [François Beaufort](https://github.com/beaufortfrancois) 및 [Kayce Basques](https://github.com/kaycebasques)가 검토했습니다. 사진을 제공한 Laura Torrent Puig에게 감사드립니다.
