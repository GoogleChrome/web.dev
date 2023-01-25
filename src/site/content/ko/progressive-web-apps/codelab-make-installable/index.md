---
layout: codelab
title: 설치 가능하게 만들기
authors:
  - petelepage
date: 2018-11-05
updated: 2021-02-12
description: 이 코드랩에서는 beforeinstallprompt 이벤트를 사용하여 사이트를 설치 가능하게 만드는 방법을 알아봅니다.
glitch: make-it-installable?경로=script.js
related_post: customize-install
tags:
  - progressive-web-apps
---

이 결함에는 [매우 간단한 서비스 작업자](https://glitch.com/edit/#!/make-it-installable?path=service-worker.js)와 [웹 앱 매니페스트](https://glitch.com/edit/#!/make-it-installable?path=manifest.json)를 포함하여 프로그레시브 웹 앱을 설치 가능하게 만드는 데 필요한 중요한 구성 요소가 이미 포함되어 있습니다. 또한 기본적으로 숨겨져 있는 설치 버튼도 있습니다.

## beforeinstallprompt 이벤트 수신 대기

브라우저가 `beforeinstallprompt` 이벤트를 발생시키면, 이는 프로그레시브 웹 앱을 설치할 수 있고 설치 버튼이 사용자에게 표시될 수 있다는 것을 나타냅니다. `beforeinstallprompt` 이벤트는 PWA가 [설치 가능성 기준](/install-criteria/)을 충족할 때 발생합니다.

{% Instruction 'remix', 'ol' %}

1. `window` 객체에 `beforeinstallprompt` 이벤트 핸들러를 추가합니다.
2. `event`를 전역 변수로 저장합니다. 프롬프트를 표시하려면 나중에 필요합니다.
3. 설치 버튼을 숨김 해제합니다.

암호:

```js
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile.
  event.preventDefault();
  console.log('👍', 'beforeinstallprompt', event);
  // Stash the event so it can be triggered later.
  window.deferredPrompt = event;
  // Remove the 'hidden' class from the install button container.
  divInstall.classList.toggle('hidden', false);
});
```

## 설치 버튼 클릭 처리

설치 프롬프트를 표시하려면 저장된 `beforeinstallprompt` 이벤트에서 `prompt()`를 호출합니다. `prompt()`는 사용자 제스처에서 호출해야 하기 때문에 `prompt()` 호출은 설치 버튼 클릭 핸들러에서 수행됩니다.

1. 설치 버튼에 대한 클릭 이벤트 핸들러를 추가합니다.
2. 저장된 `beforeinstallprompt` 이벤트에서 `prompt()`를 호출합니다.
3. 프롬프트 결과를 기록합니다.
4. 저장된 `beforeinstallprompt` 이벤트를 null로 설정합니다.
5. 설치 버튼을 숨깁니다.

코드:

```js
butInstall.addEventListener('click', async () => {
  console.log('👍', 'butInstall-clicked');
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    // The deferred prompt isn't available.
    return;
  }
  // Show the install prompt.
  promptEvent.prompt();
  // Log the result
  const result = await promptEvent.userChoice;
  console.log('👍', 'userChoice', result);
  // Reset the deferred prompt variable, since
  // prompt() can only be called once.
  window.deferredPrompt = null;
  // Hide the install button.
  divInstall.classList.toggle('hidden', true);
});
```

## 설치 이벤트 추적

설치 버튼을 통해 프로그레시브 웹 앱을 설치하는 것은 사용자가 PWA를 설치할 수 있는 한 가지 방법일 뿐입니다. 그 외에 Chrome 메뉴, 미니 정보 표시줄, [검색 주소창의 아이콘](/promote-install/#browser-promotion)을 통해서도 가능합니다. `appinstalled` 이벤트에 수신 대기하여 이러한 모든 설치 방법을 추적할 수 있습니다.

1. `window` 객체에 `appinstalled` 이벤트 핸들러를 추가합니다.
2. 분석 또는 기타 메커니즘에 설치 이벤트를 기록합니다.

코드:

```js
window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event);
  // Clear the deferredPrompt so it can be garbage collected
  window.deferredPrompt = null;
});
```

## 추가 참고 자료

축하합니다. 이제 앱을 설치할 수 있게 되었습니다!

다음은 몇 가지 추가적으로 수행할 수 있는 작업들입니다.

- [앱이 홈 화면에서 실행되었는지 감지](/customize-install/#detect-mode)
- [대신 운영 체제의 앱 설치 프롬프트 표시](https://developer.chrome.com/blog/app-install-banners-native/)
