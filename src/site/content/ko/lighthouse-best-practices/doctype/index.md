---
layout: post
title: 페이지에 HTML 문서 유형이 없으므로 쿼크 모드가 트리거됩니다
description: |2-

  페이지가 이전 버전으 브라우저에서 쿼크 모드를 트리거하지 않는지 확인하는 방법을 알아봅니다.
web_lighthouse:
  - doctype
date: 2019-05-02
updated: 2019-08-28
---

doctype을 지정하면 브라우저가 페이지가 [예기치 않은 방식으로 렌더링될 수도 있는](https://quirks.spec.whatwg.org/#css) [쿼크 모드](https://developer.mozilla.org/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)로 전환되는 것을 방지합니다.

## Lighthouse 문서 유형 감사가 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 `<!DOCTYPE html>` 선언이 없는 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l6IEjHdtgCa45QimENjb.png", alt="Lighthouse 감사에서 누락된 문서 유형이 표시됨", width="800", height="76" %}</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 문서 유형 선언을 추가하는 방법

HTML 문서의 맨 위에 `<!DOCTYPE html>` 선언을 추가합니다.

```html
<!DOCTYPE html>
<html lang="en">
…
```

자세한 내용은 MDN의 [문서 유형](https://developer.mozilla.org/docs/Glossary/Doctype) 페이지를 참조하세요.

## 참고 자료

- [**페이지의 소스 코드에 HTML 문서 유형이 없으므로 쿼크 모드 감사를 트리거**합니다.](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/doctype.js)
- [문서 유형](https://developer.mozilla.org/docs/Glossary/Doctype)
- [쿼크 모드 및 표준 모드](https://developer.mozilla.org/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)
