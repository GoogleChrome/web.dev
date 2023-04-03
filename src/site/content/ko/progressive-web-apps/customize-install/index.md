---
layout: post
title: 자신만의 인앱 설치 경험을 제공하는 방법
authors:
  - petelepage
date: 2020-02-14
updated: 2021-05-19
description: |2-

  beforeinstallprompt 이벤트를 사용하여 사용자에게 원활한 맞춤형 인앱 설치 환경을 제공하십시오.
tags:
  - progressive-web-apps
---

여러 브라우저를 사용하면 PWA의 사용자 인터페이스 내에서 직접 프로그레시브 웹 앱(PWA) 설치를 활성화하고 승격할 수 있습니다. 설치(이전에는 '홈 화면에 추가'라고도 함)를 사용하면 사용자가 모바일 또는 데스크톱 장치에 PWA를 쉽게 설치할 수 있습니다. PWA를 설치하면 사용자의 시작 프로그램에 PWA를 추가하여 설치된 다른 앱처럼 실행할 수 있습니다.

[브라우저에서 제공하는 설치 환경](/promote-install/#browser-promotion) 외에도 앱 내에서 직접 사용자 지정 설치 흐름을 제공할 수 있습니다.

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SW3unIBfyMRTZNK0DRIw.png", alt="Spotify PWA에 제공되어 있는 앱 설치 버튼", width="491", height="550" %}<figcaption> Spotify PWA에 제공되어 있는 "앱 설치" 버튼</figcaption></figure>

설치를 승격할지 여부를 고려할 때 사용자가 일반적으로 PWA를 사용하는 방법에 대해 생각하는 것이 가장 좋습니다. 예를 들어, 일주일에 여러 번 PWA를 사용하는 사용자 집합이 있는 경우 이러한 사용자들은 스마트폰 홈 화면이나 데스크톱 운영 체제의 시작 메뉴에서 앱을 시작하는 추가 편의성 이점을 누릴 수 있습니다. 일부 생산성 및 엔터테인먼트 애플리케이션도 설치된 `독립 실행형` 또는 `minimal-ui` 모드에서 창에서 브라우저 도구 모음을 제거하여 생성된 추가 화면 실물의 이점을 누릴 수 있습니다.

## 설치 승격 {: #promote-installation }

프로그레시브 웹 앱(PWA)을 설치할 수 있음을 표시하고 사용자 지정 인앱 설치 흐름을 제공하는 방법:

1. `beforeinstallprompt` 이벤트를 실행합니다.
2. 나중에 설치 흐름을 트리거하는 데 사용할 수 있도록 `beforeinstallprompt` 이벤트를 저장합니다.
3. PWA를 설치할 수 있음을 사용자에게 알리고 인앱 설치 흐름을 시작하는 버튼 또는 기타 요소를 제공합니다.

{% Aside %} `beforeinstallprompt` 이벤트 및 `appinstalled` 이벤트가 웹 앱 매니페스트 사양에서 자체 [인큐베이터](https://github.com/WICG/beforeinstallprompt)로 이동되었습니다. Chrome 팀은 이를 계속 지원하기 위해 최선을 다하고 있으며 지원을 제거하거나 중단할 계획이 없습니다. Google의 Web DevRel 팀은 사용자 지정 설치 환경을 제공하기 위해 이를 지속적으로 사용하도록 권장합니다. {% endAside %}

### `beforeinstallprompt` 이벤트 {: #beforeinstallprompt } 수신

프로그레시브 웹 앱(PWA)이 필수 [설치 기준](/install-criteria/)을 충족하는 경우 브라우저는 `beforeinstallprompt` 이벤트를 실행합니다. 이벤트에 대한 참조 정보를 저장하고 사용자가 PWA를 설치할 수 있음을 나타내도록 사용자 인터페이스를 업데이트합니다. 이는 아래에 강조 표시되어 있습니다.

```js
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});
```

{% Aside %} 사용자에게 앱을 설치할 수 있음을 알리고 인앱 설치 흐름을 제공하는 데 사용할 수 있는 다양한 [패턴](/promote-install/)이 있습니다(예: 헤더의 버튼, 탐색 메뉴의 항목 또는 콘텐츠 피드의 항목). {% endAside %}

### 인앱 설치 흐름 {: #in-app-flow }

인앱 설치를 제공하려면 사용자가 앱을 설치하기 위해 클릭할 수 있는 버튼 또는 기타 인터페이스 요소를 제공하십시오. 요소를 클릭하면 저장된 `beforeinstallprompt` 이벤트(`deferredPrompt` 변수에 저장됨)에서 `prompt()`를 호출합니다. 사용자에게 PWA를 설치할지 확인하라는 모달 설치 대화상자를 표시합니다.

```js
buttonInstall.addEventListener('click', async () => {
  // Hide the app provided install promotion
  hideInstallPromotion();
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Optionally, send analytics event with outcome of user choice
  console.log(`User response to the install prompt: ${outcome}`);
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt = null;
});
```

`userChoice` 속성은 사용자의 선택으로 해결되는 약속입니다. 지연된 이벤트에 대해 한 번만 `prompt()`를 호출할 수 있습니다. 일반적으로 `userChoice` 속성이 해결된 직후에 `beforeinstallprompt` 이벤트가 다시 실행될 때까지 기다려야 합니다.

{% Aside 'codelab' %} [beforeinstallprompt 이벤트를 사용하여 사이트를 설치 가능하게 만드세요](/codelab-make-installable) . {% endAside %}

## PWA가 성공적으로 설치되었을 때 감지 {: #detect-install }

`userChoice` 속성을 사용하여 사용자가 사용자 인터페이스 내에서 앱을 설치했는지 판별할 수 있습니다. 그러나 사용자가 주소 표시줄이나 다른 브라우저 구성 요소에서 PWA를 설치하면 `userChoice`가 도움이 되지 않습니다. 대신, `appinstalled` 이벤트를 실행해야 합니다. PWA를 설치하는 데 사용되는 메커니즘에 관계없이 PWA가 설치될 때마다 실행됩니다.

```js
window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  hideInstallPromotion();
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
});
```

## PWA 시작 방법 감지 {: #detect-launch-type }

CSS `display-mode` 미디어 쿼리는 브라우저 탭에서 또는 설치된 PWA로 PWA가 시작된 방법을 나타냅니다. 이를 통해 앱 시작 방법에 따라 다양한 스타일을 적용할 수 있습니다. 예를 들어, 설치된 PWA로 시작할 때 항상 설치 버튼을 숨기고 뒤로 이동 버튼을 제공합니다.

### PWA 시작 방법 추적

사용자가 PWA 시작 방법을 추적하려면 `matchMedia()`를 사용하여 `display-mode` 미디어 쿼리를 테스트해야 합니다. iOS의 Safari는 이 기능을 아직 지원하지 않으므로 `navigator.standalone`을 확인해야 합니다. 이 기능은 브라우저가 독립 실행형 모드에서 실행 중인지 여부를 나타내는 부울 값을 반환합니다.

```js
function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  } else if (navigator.standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}
```

### 디스플레이 모드 변경 시 추적

`standalone`과 `browser tab` 사이에서 사용자 변경 사항을 추적하려면 `display-mode` 미디어 쿼리에 대한 변경 사항을 실행합니다.

```js
window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
  let displayMode = 'browser';
  if (evt.matches) {
    displayMode = 'standalone';
  }
  // Log display mode change to analytics
  console.log('DISPLAY_MODE_CHANGED', displayMode);
});
```

### 현재 디스플레이 모드를 기반으로 UI 업데이트

설치된 PWA로 시작할 때 PWA에 다른 배경색을 적용하려면 다음과 같은 조건부 CSS를 사용하십시오.

```css
@media all and (display-mode: standalone) {
  body {
    background-color: yellow;
  }
}
```

## 앱 아이콘 및 이름 업데이트

앱 이름을 업데이트하거나 새 아이콘을 제공해야 하는 경우 어떻게 하시겠습니까? [Chrome에서 웹 앱 매니페스트에 대한 업데이트를 처리하는 방법](/manifest-updates/)을 확인하여 이러한 변경 사항이 Chrome에 언제 어떻게 반영되는지 확인하세요.
