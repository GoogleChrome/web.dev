---
layout: post
title: 양호한 브라우저 버그를 신고하는 방법
subhead: 브라우저에서 발견한 문제에 대해 브라우저 공급업체에 알리는 것은 웹 플랫폼 개선에 필수적인 부분입니다!
authors:
  - robertnyman
  - petelepage
date: 2020-06-15
updated: 2020-06-15
description: 브라우저, 특정 기기 또는 플랫폼에서 발견한 문제를 브라우저 공급업체에 알리는 것은 웹 플랫폼 개선에 필수적인 부분입니다!
tags:
  - blog
---

양호한 버그를 신고하는 것은 어렵지 않지만 약간의 작업이 필요합니다. 목표는 고장 난 것을 쉽게 찾고, 근본 원인을 파악하고, 가장 중요한 점으로는 그것을 고칠 방법을 찾는 것입니다. 빠르게 진행되는 버그는 분명히 예상되는 동작으로 쉽게 재현되는 경향이 있습니다.

## 버그인지 확인

첫 번째 단계는 "올바른" 동작이 무엇인지 파악하는 것입니다.

### 올바른 동작은 무엇입니까?

[MDN](https://developer.mozilla.org/)에서 관련 API 문서를 확인하거나 관련 사양을 찾아보세요. 이 정보는 실제로 손상된 API, 손상된 위치, 예상 동작을 결정하는 데 도움이 될 수 있습니다.

### 다른 브라우저에서 작동합니까?

브라우저 간에 다른 동작은 일반적으로 상호 운용성 문제로 더 높은 우선순위를 가지는데, 특히 버그가 포함된 브라우저가 이상한 경우에 그렇습니다. [BrowserStack](https://www.browserstack.com/)과 같은 도구를 사용하여 최신 버전의 Chrome, Firefox, Safari 및 Edge에서 테스트해보세요.

가능하다면 사용자 에이전트 스니핑으로 인해 페이지가 의도적으로 다르게 동작하지 않는지 확인하세요. Chrome DevTools에서 [`User-Agent` 문자열을 다른 브라우저로 설정](https://developer.chrome.com/docs/devtools/device-mode/override-user-agent/)해보세요.

### 최근 릴리스에서 중단되었습니까?

과거에는 예상대로 작동했지만, 최근 브라우저 릴리스에서 중단되었습니까? 이러한 "회귀"에 대해서는 특히 작동한 버전 번호와 실패한 버전을 제공하는 경우 훨씬 더 빠르게 조치를 취할 수 있습니다. [BrowserStack](https://www.browserstack.com/)과 같은 도구를 사용하면 이전 브라우저 버전을 쉽게 확인할 수 있고 [bisect-builds 도구](https://www.chromium.org/developers/bisect-builds-py)(Chromium용)를 사용하면 변경 사항을 매우 효율적으로 검색할 수 있습니다.

문제가 회귀이고 이를 재현할 수 있는 경우 일반적으로 근본 원인을 빠르게 찾아 수정할 수 있습니다.

### 다른 사람들도 같은 문제를 보고 있습니까?

문제가 발생할 경우 다른 개발자도 같은 문제를 겪고 있을 가능성이 큽니다. 먼저 [Stack Overflow](http://stackoverflow.com/)에서 버그를 검색해보세요. 그러면 추상적인 문제를 손상된 특정 API로 변환하는 데 도움이 될 수 있으며, 버그가 수정될 때까지 단기적인 해결 방법을 찾는 데 도움이 될 수 있습니다.

## 이전에 보고된 적이 있습니까?

버그가 무엇인지 파악했으면 브라우저 버그 데이터베이스를 검색하여 이미 신고된 버그인지 확인할 차례입니다.

- Chromium 기반 브라우저: [https://crbug.com](https://crbug.com/)
- Firefox: [https://bugzilla.mozilla.org/](https://bugzilla.mozilla.org/)
- Safari 및 WebKit 기반 브라우저: [https://bugs.webkit.org/](https://bugs.webkit.org/)

문제를 설명하는 기존 버그를 찾으면 버그에 별표를 표시하거나 즐겨찾기에 추가하거나 댓글을 달아 지원을 추가하세요. 또한 많은 사이트에서 자신을 CC 목록에 추가하고 버그 변경 시 업데이트를 받을 수 있습니다.

버그에 대해 설명하기로 결정했다면 버그가 웹사이트에 미치는 영향에 대한 정보를 포함하세요. 버그 추적기는 일반적으로 모든 댓글에 대해 이메일을 보내므로 "+1" 스타일의 댓글을 추가하지 마세요.

## 버그 신고

이전에 신고된 적 없는 버그인 경우 브라우저 공급업체에 이에 대해 알려야 합니다.

### 최소화된 테스트 케이스 만들기 {: #minified-test-case }

Mozilla에는 [최소화된 테스트 케이스를 만드는 방법](https://developer.mozilla.org/docs/Mozilla/QA/Reducing_testcases)에 대한 훌륭한 기사가 있습니다. 긴 내용을 짧게 요약하자면, 문제에 대한 설명은 훌륭한 시작이지만 문제를 보여주는 버그에 연결된 데모를 제공하는 것보다 나은 방법은 없다는 내용입니다. 빠른 진행 가능성을 최대화하려면 예제에 문제를 보여주는 데 필요한 최소한의 가능한 코드를 포함해야 합니다. 최소한의 코드 샘플은 버그가 수정될 확률을 높이기 위해 할 수 있는 가장 중요한 사항입니다.

다음은 테스트 케이스 최소화를 위한 몇 가지 팁입니다.

- 웹 페이지를 다운로드하고 [`<base href="https://original.url">`](https://developer.mozilla.org/docs/Web/HTML/Element/base)을 추가하고 버그가 로컬에 존재하는지 확인하세요. URL이 HTTPS를 사용하는 경우 라이브 HTTPS 서버가 필요할 수 있습니다.
- 가능한 한 많은 브라우저의 최신 빌드에서 로컬 파일을 테스트하세요.
- 모든 것을 하나의 파일로 압축해보세요.
- 버그가 사라질 때까지 코드를 제거하세요(불필요하다는 사실을 알고 있는 코드부터 시작).
- 버전 제어를 사용하여 작업을 저장하고 잘못된 작업을 실행 취소할 수 있습니다.

#### 축소된 테스트 케이스 호스팅

축소된 테스트 케이스를 호스팅할 좋은 장소를 찾고 있다면 다음과 같은 몇 가지 좋은 장소를 사용할 수 있습니다.

- [Glitch](https://glitch.com)
- [JSBin](https://jsbin.com)
- [JSFiddle](https://jsfiddle.net)
- [CodePen](https://codepen.io)

이들 중 여러 사이트에서는 콘텐츠를 iframe으로 표시하므로 기능이나 버그가 다르게 작동할 수 있습니다.

## 문제 제기

최소화된 테스트 케이스가 있으면 해당 버그를 신고할 준비가 된 것입니다. 올바른 버그 추적 사이트로 이동하여 새 문제를 만드세요.

- Chromium 기반 브라우저 - [https://crbug.com/new](https://crbug.com/new)
- Firefox - [https://bugzilla.mozilla.org/](https://bugzilla.mozilla.org/)
- Safari 및 WebKit 기반 브라우저 - [https://bugs.webkit.org/](https://bugs.webkit.org/)

### 문제에 대한 명확한 설명과 문제를 재현하는 데 필요한 단계를 제공합니다

첫째, 엔지니어가 문제가 무엇인지 신속하게 이해하고 문제를 분류하는 데 도움이 되도록 명확히 설명합니다.

```text
When installing a PWA using the `beforeinstallprompt.prompt()`, the
`appinstalled` event fires before the call to `prompt()` resolves.
```

그런 다음 문제를 재현하는 데 필요한 자세한 단계를 제공합니다. 여기에서 [축소된 테스트 케이스](#minified-test-case)가 등장합니다.

```text
What steps will reproduce the problem?
1. Go to https://basic-pwa.glitch.me/, open DevTools and look at the
   console tab.
2. Click the Install button in the page, you might need to interact with
   the page a bit before it becomes enabled.
3. Click Install on the browser modal install confirmation.
```

마지막으로 *실제* 결과와 *예상* 결과를 설명합니다.

```text
What is the actual result? In the console:
0. INSTALL: Available (logged when `beforeinstallprompt` event fired)
1. INSTALL: Success (logged when `appinstalled` event fired)
2. INSTALL_PROMPT_RESPONSE: {outcome: "accepted", platform: "web"}
   (logged when beforeinstallprompt.prompt()` resolves)

What is the expected result? In the console:
0. INSTALL: Available (logged when `beforeinstallprompt` event fired)
1. INSTALL_PROMPT_RESPONSE: {outcome: "accepted", platform: "web"}
   (logged when beforeinstallprompt.prompt()` resolves)
2. INSTALL: Success (logged when `appinstalled` event fired)
```

자세한 내용은 MDN에서 [버그 보고서 작성 지침](https://developer.mozilla.org/docs/Mozilla/QA/Bug_writing_guidelines)을 확인하세요.

#### 보너스: 문제의 스크린샷 또는 스크린캐스트 추가

필수 사항은 아니지만, 경우에 따라 문제의 스크린샷이나 스크린캐스트를 추가하는 것이 도움이 될 수 있습니다. 이는 버그를 재현하기 위해 몇몇 이상한 단계가 필요할 수 있는 경우에 특히 유용합니다. 스크린캐스트나 스크린샷에서 어떤 일이 일어나는지 볼 수 있으면 도움이 될 수 있을 때가 많습니다.

### 환경 세부 정보 포함

일부 버그는 특정 운영 체제나 특정한 종류의 디스플레이(예: 낮은 dpi 또는 높은 dpi)에서만 재현할 수 있습니다. 사용한 테스트 환경에 대한 세부 정보를 포함해야 합니다.

### 버그 제출

마지막으로 버그를 제출합니다. 그런 다음 버그에 대한 응답이 있는지 이메일을 계속 주시하세요. 일반적으로 조사 도중과 버그 수정 시, 엔지니어가 추가 질문을 할 수도 있고 문제 재현에 어려움이 있는 경우 연락할 수도 있습니다.
