---
layout: post
title: 브라우저 오류가 콘솔에 기록되었습니다
description: |2

  브라우저 오류를 식별하고 수정하는 방법을 알아보세요.
web_lighthouse:
  - errors-in-console
date: 2019-05-02
updated: 2019-08-28
---

대부분의 브라우저에는 개발자 도구가 내장되어 있습니다. 이러한 개발자 도구에는 일반적으로 [콘솔](https://developer.chrome.com/docs/devtools/console/)이 포함됩니다. 콘솔은 현재 실행 중인 페이지에 대한 정보를 제공합니다.

콘솔에 기록된 메시지는 페이지를 만든 웹 개발자나 브라우저 자체에서 온 것입니다. 모든 콘솔 메시지의 심각도 수준은 `Verbose` , `Info` , `Warning` 또는 `Error` 입니다. `Error` 메시지는 페이지에 해결해야 하는 문제가 있음을 의미합니다.

## Lighthouse 브라우저 오류 감사가 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 콘솔에 기록된 모든 브라우저 오류에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/AjfKRZm8E4ZUi2QvQtL3.png", alt="콘솔에서 브라우저 오류를 보여주는 Lighthouse 감사", width="800", height="247" %}</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 브라우저 오류를 수정하는 방법

Lighthouse가 보고하는 각 브라우저 오류를 수정하여 페이지가 모든 사용자에게 예상대로 실행되도록 하세요.

Chrome DevTools에는 오류 원인을 추적하는 데 도움이 되는 몇 가지 도구가 포함되어 있습니다.

- 각 오류의 텍스트 아래에 있는 DevTools Console은 문제가 있는 코드를 실행하게 한 [호출 스택](https://developer.mozilla.org/docs/Glossary/Call_stack)을 보여줍니다.
- 각 오류의 오른쪽 상단에 있는 링크는 오류를 일으킨 코드를 보여줍니다.

예를 들어 이 스크린샷은 두 가지 오류가 있는 페이지를 보여줍니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KBP4iOO12CqHURgmjxaY.png", alt="Chrome DevTools 콘솔의 오류 예", width="800", height="505" %}</figure>

위의 예에서 첫 번째 오류는 [`console.error()`](https://developer.chrome.com/docs/devtools/console/api/#error) 호출을 통해 웹 개발자로부터 발생합니다. 두 번째 오류는 브라우저에서 발생하며 페이지의 스크립트 중 하나에 사용된 변수가 존재하지 않음을 의미합니다.

각 오류의 텍스트 아래에 DevTools 콘솔은 오류가 나타나는 호출 스택을 표시합니다. 예를 들어, 첫 번째 오류의 경우 콘솔은 `doStuff` 함수를 호출하는 `init`이라 명명된 `(anonymous)` 함수를 나타냅니다. 해당 오류의 오른쪽 상단에 `pen.js:9` 링크를 클릭하면 관련 코드가 표시됩니다.

이러한 방식으로 각 오류에 대한 관련 코드를 검토하면 가능한 문제를 식별하고 해결하는 데 도움이 될 수 있습니다.

오류의 원인을 파악할 수 없으면 오류 텍스트를 검색 엔진에 입력해 보십시오. 문제에 대한 솔루션을 찾을 수 없으면 [Stack Overflow](https://stackoverflow.com)에 질문해 보십시오.

오류를 수정할 수 없는 경우 [`try…catch`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/try...catch) 구문을 으로 오류를 감싸서 문제를 인식하고 있음을 코드에 명시적으로 나타내세요. `catch` 블록을 사용하여 오류를 보다 깔끔하게 처리할 수도 있습니다.

## 참고자료

- [**브라우저 오류**에 대한 소스 코드가 콘솔 감사에 기록되었습니다](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/errors-in-console.js)
- [콘솔 개요](https://developer.chrome.com/docs/devtools/console/)
- [Stack Overflow](https://stackoverflow.com/)
- [try…catch](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/try...catch)
