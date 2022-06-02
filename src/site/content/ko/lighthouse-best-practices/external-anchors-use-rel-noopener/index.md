---
layout: post
title: 교차 출처 대상에 대한 링크는 안전하지 않습니다
description: 다른 호스트의 리소스에 안전하게 링크하는 방법을 알아보세요.
web_lighthouse:
  - external-anchors-use-rel-noopener
date: 2019-05-02
updated: 2019-08-28
---

`target="_blank"` 속성을 사용하여 다른 사이트의 페이지에 링크하면 사이트가 성능 및 보안 문제에 노출될 수 있습니다.

- 다른 페이지가 해당 페이지와 동일한 프로세스에서 실행될 수 있습니다. 다른 페이지에서 많은 JavaScript를 실행하는 경우 페이지의 성능이 저하될 수 있습니다.
- 다른 페이지가 `window.opener` 속성을 사용하여 `window` 객체에 액세스할 수 있습니다. 그러면 다른 페이지에서 해당 페이지를 악성 URL로 리디렉션할 수 있습니다.

`rel="noopener"` 또는 `rel="noreferrer"`를 `target="_blank"`에 추가하면 이러한 문제를 피할 수 있습니다.

{% Aside %} Chromium 버전 88부터 `target="_blank"`를 포함한 앵커는 기본적으로 [`noopener`](https://www.chromestatus.com/feature/6140064063029248) 동작을 자동으로 가져옵니다. `rel="noopener"`의 명시적 사양은 Edge Legacy 및 Internet Explorer를 포함한 레거시 브라우저 사용자를 보호하는 데 도움을 줍니다. {% endAside %}

## Lighthouse 교차 출처 대상 감사가 실패하는 방식

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 교차 출처 대상에 대한 안전하지 않은 링크를 표시합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ztiQKS8eOfdzONC7bocp.png", alt="교차 출처 대상에 대한 안전하지 않은 링크를 표시하는 Lighthouse 감사", width="800", height="213" %}</figure>

Lighthouse는 다음 프로세스를 사용하여 링크를 안전하지 않은 것으로 식별합니다.

1. `target="_blank"` 속성은 포함하지만 `rel="noopener"` 또는 `rel="noreferrer"` 속성은 포함하지 않는 모든 `<a>` 태그를 수집합니다.
2. 모든 동일 호스트 링크를 필터링합니다.

Lighthouse는 동일 호스트 링크를 걸러내기 때문에 대규모 사이트에서 작업하는 경우 주의해야 하는 경우가 있습니다. `rel="noopener"`를 사용하지 않고 사이트의 다른 페이지에 대한 `target="_blank"` 링크를 포함하는 페이지가 있는 경우, 이 감사의 성능 문제가 적용됩니다. 그러나 Lighthouse 결과에서는 이러한 링크를 볼 수 없습니다.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## 사이트 성능을 개선하고 보안 취약점을 방지하는 방법

Lighthouse 보고서에서 식별된 각 링크에 `rel="noopener"` 또는 `rel="noreferrer"`를 추가합니다. 일반적으로, `target="_blank"`를 사용하는 경우, 항상 `rel="noopener"` 또는 `rel="noreferrer"`를 추가하세요.

```html
<a href="https://examplepetstore.com" target="_blank" rel="noopener">
  Example Pet Store
</a>
```

- `rel="noopener"`는 새 페이지가 `window.opener` 속성에 액세스할 수 없도록 하고 별도의 프로세스에서 실행되도록 합니다.
- `rel="noreferrer"`는 동일한 효과를 갖지만 `Referer` 헤더가 새 페이지로 전송되는 것을 방지합니다. [링크 유형 "noreferrer"](https://html.spec.whatwg.org/multipage/links.html#link-type-noreferrer)를 참조하세요.

자세한 내용은 [교차 출처 리소스를 안전하게 공유](/cross-origin-resource-sharing/) 게시물을 참조하세요.

## 리소스

- [**교차 출처 대상에 대한 링크가 안전하지 않음** 감사의 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/external-anchors-use-rel-noopener.js)
- [교차 출처 리소스를 안전하게 공유](/cross-origin-resource-sharing/)
- [웹 개발자를 위한 사이트 격리](https://developers.google.com/web/updates/2018/07/site-isolation)
