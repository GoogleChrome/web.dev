---
title: 설치된 웹 애플리케이션을 파일 핸들러로 사용
subhead: 앱을 운영 체제에 파일 핸들러로 등록합니다.
authors:
  - thomassteiner
Description: 운영 체제에 파일 핸들러로 앱을 등록하여 적절한 앱으로 파일을 여세요.
date: 2020-10-22
updated: 2021-12-03
tags:
  - blog
  - capabilities
hero: image/admin/tf0sUZX6G7AM8PvU1t0B.jpg
alt: 다양한 색상의 바인더.
---

{% Aside %} 파일 처리 API는 [기능 프로젝트](https://developer.chrome.com/blog/fugu-status/)의 일부이며 현재 개발 중입니다. 이 게시물은 구현이 진행되는 대로 업데이트됩니다. {% endAside %}

이제 웹 앱이 [파일을 읽고 쓸 수 있으므로](/file-system-access/) 다음 논리적 단계는 개발자가 이러한 웹 앱을 앱이 만들고 처리할 수 있는 파일에 대한 파일 핸들러로 선언하도록 하는 것입니다. 파일 처리 API를 사용하면 정확히 이 작업을 수행할 수 있습니다. 텍스트 편집기 앱을 파일 핸들러로 등록하고 설치한 후 macOS에서 `.txt` 파일을 마우스 오른쪽 버튼으로 클릭하고 "정보 가져오기"를 선택한 다음 OS에 항상 이 앱을 기본으로 사용하여 `.txt`를 열도록 지시합니다.

### 파일 처리 API {: #use-cases }에 대한 권장 사용 사례

이 API를 사용할 수 있는 사이트의 예는 다음과 같습니다.

- 텍스트 편집기, 스프레드시트 앱 및 슬라이드쇼 작성기와 같은 Office 응용 프로그램.
- 그래픽 편집기 및 그리기 도구.
- 비디오 게임 레벨 편집기 도구.

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
<td data-md-type="table_cell"><a href="https://github.com/WICG/file-handling/blob/main/explainer.md" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 사양의 초기 초안 작성</td>
<td data-md-type="table_cell">시작되지 않음</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. 피드백 수집 및 디자인 반복</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">진행 중</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. 오리진 트라이얼</td>
<td data-md-type="table_cell"><a>완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. 출시</td>
<td data-md-type="table_cell">시작되지 않음</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## 파일 처리 API 사용 방법 {: #use }

### about://flags를 통해 활성화

원본 평가판 토큰 없이 로컬에서 파일 처리 API를 실험하려면 `about://flags`에서 `#file-handling-api` 플래그를 활성화하십시오.

### 점진적 향상

파일 처리 API 자체는 폴리필할 수 없습니다. 그러나 웹 앱으로 파일을 여는 기능은 두 가지 다른 방법을 통해 달성할 수 있습니다.

- [웹 공유 대상 API](/web-share-target/)를 사용하면 개발자가 앱을 공유 대상으로 지정할 수 있으므로 운영 체제의 공유 시트에서 파일을 열 수 있습니다.
- [파일 시스템 액세스 API](/file-system-access/)는 파일 드래그 앤 드롭과 통합될 수 있으므로 개발자는 이미 열려 있는 앱에서 드롭된 파일을 처리할 수 있습니다.

### 기능 감지

파일 처리 API가 지원되는지 확인하려면 다음을 사용하십시오.

```javascript
if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  // The File Handling API is supported.
}
```

{% Aside %} 파일 처리는 현재 데스크톱 운영 체제로 제한됩니다. {% endAside %}

### 파일 처리 API의 선언적 부분

첫 번째 단계로 웹 앱은 [웹 앱 매니페스트](/add-manifest/)에서 처리할 수 있는 파일의 종류를 선언적으로 설명해야 합니다. 파일 처리 API는 파일 처리기의 배열을 허용하는 `"file_handlers"`라는 새로운 속성으로 웹 앱 매니페스트를 확장합니다. 파일 핸들러는 두 가지 속성을 가진 객체입니다.

- 앱 범위 내의 URL을 값으로 가리키는 `"action"`
- MIME 유형의 개체를 키로 사용하고 파일 확장자 목록을 값으로 사용하는 `"accept"`
- [`ImageResource`](https://www.w3.org/TR/image-resource/) 아이콘 배열이 있는 `"icons"` 속성. 일부 운영 체제에서는 파일 형식이 연결된 응용 프로그램의 아이콘뿐만 아니라 응용 프로그램과 함께 해당 파일 형식을 사용하는 것과 관련된 특수 아이콘을 표시하도록 허용합니다.

웹 앱 매니페스트의 관련 발췌 부분만 보여주는 아래의 예는 이를 더 명확히 보여줍니다.

```json
{
  "file_handlers": [
    {
      "action": "/open-csv",
      "accept": {
        "text/csv": [".csv"]
      },
      "icons": [
        {
          "src": "csv-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
    },
    {
      "action": "/open-svg",
      "accept": {
        "image/svg+xml": ".svg"
      },
      "icons": [
        {
          "src": "svg-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
    },
    {
      "action": "/open-graf",
      "accept": {
        "application/vnd.grafr.graph": [".grafr", ".graf"],
        "application/vnd.alternative-graph-app.graph": ".graph"
      },
      "icons": [
        {
          "src": "graf-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
    }
  ]
}
```

이 예시는 쉼표로 구분된 값을 저장한 파일(`.csv`은 `/open-csv`에서, 스케일러블 벡터 그래픽스 파일(`.svg`)은 (`.svg`)에서,  `.grafr`, `.graf`, or `.graph` 중 하나의 확장자를 사용하는 임의로 만들어진 Grafr 파일 형식은 `/open-graf`에서 처리하는 가상의 애플리케이션입니다.

{% Aside %} 이 선언이 적용되려면 애플리케이션이 설치되어 있어야 합니다. [앱을 설치 가능하게 만드는 방법](/progressive-web-apps/#make-it-installable)에 대한 바로 이 사이트의 기사 시리즈에서 자세히 알아볼 수 있습니다. {% endAside %}

### 파일 처리 API의 필수 부분

이제 앱은 이론적으로 범위 내 URL에서 처리할 수 있는 파일을 선언했으므로 실제로 들어오는 파일에 대해 명령적으로 작업을 수행해야 합니다. 여기에서 `launchQueue`를 활용할 수 있습니다. 실행된 파일에 액세스하려면 사이트에서 `window.launchQueue` 객체에 대한 소비자를 지정해야 합니다. 실행은 지정된 소비자가 처리할 때까지 대기열에 있으며 각 실행에 대해 정확히 한 번 호출됩니다. 이러한 방식으로 소비자가 지정된 시기에 관계없이 모든 실행이 처리됩니다.

```js
if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  launchQueue.setConsumer((launchParams) => {
    // Nothing to do when the queue is empty.
    if (!launchParams.files.length) {
      return;
    }
    for (const fileHandle of launchParams.files) {
      // Handle the file.
    }
  });
}
```

### DevTools 지원

이 글을 쓰는 시점에는 DevTools 지원이 없지만 지원을 추가하기 위해 [기능 요청](https://bugs.chromium.org/p/chromium/issues/detail?id=1130552)을 제출했습니다.

## 데모

만화 스타일의 그리기 앱인 [Excalidraw](https://excalidraw.com/)에 파일 처리 지원을 추가했습니다. 테스트하려면 먼저 Excalidraw를 설치해야 합니다. 그런 다음 이 파일을 사용하여 파일을 만들고 파일 시스템의 어딘가에 저장할 때 더블 클릭을 통해 파일을 열거나 마우스 오른쪽 버튼을 클릭한 다음 컨텍스트 메뉴에서 "Excalidraw"를 선택할 수 있습니다. 소스 코드에서 [구현](https://github.com/excalidraw/excalidraw/search?q=launchqueue&type=code)을 확인할 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TMh8Qev0XdwgIx7jJlP5.png", alt="Excalidraw 파일이 있는 macOS 찾기 창입니다.", width="800", height="422" %}<figcaption> 운영 체제의 파일 탐색기에서 파일을 두 번 클릭하거나 마우스 오른쪽 버튼으로 클릭합니다.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wCNbMl6kJ11XziG3LO65.png", alt="'Excalidraw...으로 열기' 항목이 강조 표시된 파일을 마우스 오른쪽 버튼으로 클릭하면 나타나는 컨텍스트 메뉴입니다.", width="488", height="266" %}<figcaption> Excalidraw은 <code>.excalidraw</code> 파일의 기본 파일 핸들러입니다.</figcaption></figure>

## 보안

Chrome 팀은 사용자 제어, 투명성, 인체 공학을 포함 [하여 강력한 웹 플랫폼 기능에 대한 액세스 제어](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md)에 정의된 핵심 원칙을 사용하여 파일 처리 API를 설계하고 구현했습니다.

## 권한, 권한 지속성 및 파일 핸들러 업데이트

파일 처리 API를 사용하여 파일을 열 때 사용자 신뢰와 사용자 파일의 안전을 보장하기 위해 PWA가 파일을 보기 전에 권한 프롬프트가 표시됩니다. 이 권한 프롬프트는 사용자가 파일을 열기 위해 PWA를 선택한 직후에 표시되므로 권한이 PWA를 사용하여 파일을 여는 작업과 밀접하게 연결되어 더 이해하기 쉽고 관련성이 있습니다.

이 권한은 사용자가 사이트의 파일 처리를 **허용** 또는 **차단**을 클릭하거나 프롬프트를 세 번 무시할 때까지 매번 표시됩니다(그 후에 Chromium은 이 권한을 금지하고 차단함). 선택한 설정은 PWA를 닫았다가 다시 여는 동안 유지됩니다.

매니페스트 업데이트 및 `"file_handlers"` 섹션의 변경 사항이 감지되면 권한이 재설정됩니다.

### 파일 관련 고려 사항

웹사이트가 파일에 액세스할 수 있도록 허용함으로써 열리는  큰 범주의 공격 벡터가 있습니다. 이는 [파일 시스템 액세스 API에 대한 문서](/file-system-access/#security-considerations)에 설명되어 있습니다. 파일 처리 API가 파일 시스템 액세스 API를 통해 제공하는 추가 보안 관련 기능은 웹 애플리케이션에 표시된 파일 선택기를 통하지 않고 운영 체제의 내장 UI를 통해 특정 파일에 대한 액세스 권한을 부여하는 기능입니다.

사용자가 의도하지 않게 파일을 열어 웹 응용 프로그램에 액세스 권한을 부여할 수 있는 위험이 여전히 있습니다. 그러나 일반적으로 파일을 열면 파일을 여는 응용 프로그램에서 해당 파일을 읽거나 조작할 수 있습니다. 따라서 "연결 프로그램…" 컨텍스트 메뉴 등을 통해 사용자가 파일을 설치된 애플리케이션으로 실행하겠다고 명시적으로 선택을 한다면 이는 해당 애플리케이션을 충분히 신뢰하고 있다는 신호로 해석할 수 있습니다.

### 기본 핸들러 관련 고려 사항

이에 대한 예외는 호스트 시스템에 지정된 파일 형식에 대한 응용 프로그램이 없는 경우입니다. 이 경우 일부 호스트 운영 체제는 자동으로 새로 등록된 핸들러를 해당 파일 유형에 대한 기본 핸들러로 사용자의 개입 없이 자동으로 승격할 수 있습니다. 즉, 사용자가 해당 유형의 파일을 두 번 클릭하면 등록된 웹 앱에서 자동으로 열립니다. 이러한 호스트 운영 체제에서 사용자 에이전트가 파일 형식에 대한 기존 기본 핸들러가 없다고 판단하면 사용자의 동의 없이 파일 내용을 웹 응용 프로그램에 실수로 보내는 것을 방지하기 위해 명시적 권한 프롬프트가 필요할 수 있습니다.

### 사용자 제어

사양에 따르면 브라우저는 파일을 처리할 수 있는 모든 사이트를 파일 핸들러로 등록해서는 안 됩니다. 대신, 파일 핸들러 등록은 설치 뒤에 진행되어야 있어야 하며 특히 사이트가 기본 처리기가 되는 경우 명시적인 사용자 확인 없이는 발생하지 않아야 합니다. 사용자가 이미 기본 핸들러를 등록했을 수 있는 `.json`과 같은 기존 확장자를 가로채기보다는 사이트에서 자체 확장자를 만드는 것을 고려해야 합니다.

### 투명성

모든 운영 체제에서 사용자는 현재 파일 연결을 변경할 수 있습니다. 이것은 브라우저의 범위를 벗어납니다.

## 피드백 {: #feedback }

Chrome 팀은 파일 처리 API 사용 경험에 대해 듣고 싶습니다.

### API 설계에 대해 알려주세요

API에서 예상한 대로 작동하지 않는 부분이 있습니까? 아니면 아이디어를 구현하는 데 필요한 메서드나 속성이 누락되었습니까? 보안 모델에 대한 질문이나 의견이 있으십니까?

- [해당 GitHub 리포지토리](https://github.com/WICG/file-handling/issues)에 사양 문제를 제출하거나 기존 문제에 의견을 추가하세요.

### 구현 문제 보고

Chrome 구현에서 버그를 찾으셨나요? 아니면 구현이 사양과 다른가요?

- [https://new.crbug.com](https://new.crbug.com)에서 버그를 신고하세요 . 가능한 한 많은 세부 정보를 포함하고 버그를 재현하기 위한 간단한 지침을 제공하고 **구성 요소** 상자에 `Mobile>WebAppInstalls/FileHandling`을 입력합니다. [Glitch](https://glitch.com/) 는 빠르고 쉬운 재현을 공유하는 데 유용합니다.

### API에 대한 지원 표시

파일 처리 API를 사용할 계획이십니까? Chrome 팀이 기능의 우선 순위를 정하고 브라우저 공급업체에 이 API의 지원이 얼마나 중요한지 보여주기 위해서는 여러분의 공개 지원이 힘이 됩니다.

- [WICG Discourse 스레드](https://discourse.wicg.io/t/proposal-ability-to-register-file-handlers/3084)에서 사용 계획을 공유하십시오.
- [<code>#FileHandling</code>](https://twitter.com/ChromiumDev) 해시 태그로 <a>@ChromiumDev</a>에 트윗을 보내어 어디서 어떤 방법으로 이 API를 사용하는지 알려주세요.

## 유용한 링크 {: #helpful }

- [공개 설명문](https://github.com/WICG/file-handling/blob/main/explainer.md)
- [파일 처리 API 데모](https://excalidraw.com/) | [파일 처리 API 데모 소스](https://github.com/excalidraw/excalidraw/search?q=launchqueue&type=code)
- [Chrome 버그 추적](https://bugs.chromium.org/p/chromium/issues/detail?id=829689)
- [ChromeStatus.com 항목](https://chromestatus.com/feature/5721776357113856)
- Blink 구성 요소: [`UI>Browser>WebAppInstalls>FileHandling`](https://bugs.chromium.org/p/chromium/issues/list?q=component:UI%3EBrowser%3EWebAppInstalls%3EFileHandling)
- [TAG 검토](https://github.com/w3ctag/design-reviews/issues/371)
- [Mozilla 표준 입장](https://github.com/mozilla/standards-positions/issues/158)

## 감사의 말

파일 처리 API는 [Eric Willigers](https://github.com/ericwilligers) , [Jay Harris](https://github.com/fallaciousreasoning) 및 [Raymes Khoury](https://github.com/raymeskhoury)가 구체화했습니다. 이 기사는 [Joe Medley](https://github.com/jpmedley)가 검토했습니다.
