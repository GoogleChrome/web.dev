---
layout: post
title: document.write() 사용
description: |2

  document.write()를 피하여 페이지 로드 시간을 단축하는 방법을 알아보세요.
web_lighthouse:
  - no-document-write
date: 2019-05-02
updated: 2020-06-04
---

[`document.write()`](https://developer.mozilla.org/docs/Web/API/Document/write)를 사용하면 페이지 콘텐츠 표시가 수십 초 지연될 수 있으며 연결 속도가 느린 사용자에게 특히 문제가 됩니다. 그러므로 Chrome은`document.write()`의 실행을 차단합니다. 따라서 이에 의존해서는 안 됩니다.

`document.write()`를 사용할 때 Chrome DevTools 콘솔에 다음 메시지가 표시됩니다.

```text
[Violation] Avoid using document.write().
```

Firefox DevTools 콘솔에 다음 메시지가 표시됩니다.

```text
An unbalanced tree was written using document.write() causing
data from the network to be reparsed.
```

## Lighthouse `document.write()` 감사가 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 Chrome에서 차단하지 않은 `document.write()` 호출에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5YbEaKuzO2kzulClv1qj.png", alt="document.write 사용을 보여주는 Lighthouse 감사", width="800", height="213" %}</figure>

가장 문제가 되는 사용의 경우 Chrome은 `document.write()` 호출을 차단하거나 이에 대한 콘솔 경고를 표시합니다. 어느 쪽이든 영향을 받는 호출은 DevTools 콘솔에 나타납니다. 자세한 내용은 Google의 <a href="https://developers.google.com/web/updates/2016/08/removing-document-write" data-md-type="link">`document.write()`에 대한 개입</a> 문서를 참조하세요.

Lighthouse는 사용 방식에 상관없이 성능에 부정적인 영향을 미치고 더 나은 대안이 있기 때문에 `document.write()`에 대한 나머지 호출을 보고합니다.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## `document.write()` 피하기

코드에서 `document.write()`을 모두 제거하십시오. 타사 스크립트를 삽입하는 데 사용되는 경우 대신 [비동기식 로딩](/critical-rendering-path-adding-interactivity-with-javascript/#parser-blocking-versus-asynchronous-javascript)을 사용해 보세요.

타사 코드가 `document.write()`를 사용하는 경우 공급자에게 비동기 로드를 지원하도록 요청하세요.

## 참고자료

- [**`document.write()`를 사용합니다** 감사를 위한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/no-document-write.js)
- [`document.write()`에 대한 개입](https://developer.chrome.com/blog/removing-document-write/)
- [파서 차단과 비동기 자바스크립트 비교](/critical-rendering-path-adding-interactivity-with-javascript/#parser-blocking-versus-asynchronous-javascript)
- [추측 파싱](https://developer.mozilla.org/docs/Glossary/speculative_parsing)
