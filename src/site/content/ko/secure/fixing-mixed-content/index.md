---
layout: post
title: 혼합 콘텐츠 수정
authors:
  - johyphenel
  - rachelandrew
date: 2019-09-07
updated: 2020-09-23
description: 사용자를 보호하고 모든 콘텐츠가 로드되도록 하기 위해 웹사이트에서 혼합 콘텐츠 오류를 수정하는 방법을 알아봅니다.
tags:
  - security
  - network
  - privacy
  - html
  - css
  - javascript
  - images
  - media
---

웹사이트에 HTTPS를 지원하는 것은 사이트와 사용자를 공격으로부터 보호하는 중요한 단계이지만 혼합 콘텐츠는 이러한 보호를 무용지물로 만들 수 있습니다. [혼합 콘텐츠란?](/what-is-mixed-content)에 설명된 대로 안전하지 않은 혼합 콘텐츠가 브라우저에 의해 차단되는 경우가 더 많아질 것입니다.

이 가이드에서는 기존 혼합 콘텐츠 문제를 수정하고 새로운 문제가 발생하지 않도록 방지하는 기술과 도구를 소개합니다.

## 사이트를 방문하여 혼합 콘텐츠 찾기

Google Chrome에서 HTTPS 페이지를 방문할 때 브라우저는 혼합 콘텐츠를 JavaScript 콘솔에 오류 및 경고로 나타내줍니다.

[혼합 콘텐츠란?](/what-is-mixed-content)에서 여러 가지 예를 찾아보고 Chrome DevTools에서 문제가 보고되는 방식을 확인할 수 있습니다.

[패시브 혼합 콘텐츠](https://passive-mixed-content.glitch.me/)의 경우, 다음과 같은 경고가 제공됩니다. `https` URL에서 콘텐츠가 발견되면 브라우저가 이를 자동으로 업그레이드한 다음 메시지를 표시합니다.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Y7b4EWAbSL6BgI07FdQq.jpg", alt="혼합 콘텐츠가 감지되고 업그레이드될 때 표시되는 경고를 보여주는 Chrome DevTools", width="800", height="294" %}</figure>

[액티브 혼합 콘텐츠](https://active-mixed-content.glitch.me/)는 차단되고 경고가 표시됩니다.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KafrfEz1adCP2eUHQEWy.jpg", alt="액티브 혼합 콘텐츠가 차단될 때 표시되는 경고를 보여주는 Chrome DevTools", width="800", height="304" %}</figure>

해당 사이트에서 `http://` URL에 대해 이와 같은 경고를 보게 되면 사이트 소스에서 이를 수정해야 합니다. 이러한 URL을 발견한 페이지와 함께 이러한 URL의 목록을 만들어 수정할 때 사용하는 것이 좋습니다.

{% Aside %} 혼합 콘텐츠 오류 및 경고는 현재 보고 있는 페이지에 대해서만 표시되며 JavaScript 콘솔은 새 페이지로 이동할 때마다 지워집니다. 즉, 이러한 오류를 찾으려면 사이트의 모든 페이지를 개별적으로 확인해야 합니다. {% endAside %}

### 사이트에서 혼합 콘텐츠 찾기

소스 코드에서 직접 혼합 콘텐츠를 검색할 수 있습니다. `http://`를 검색하고 HTTP URL 속성을 포함하는 태그를 찾아보세요. 앵커 태그(`<a>`)의 `href` 속성에 `http://`가 있는 것은 혼합 콘텐츠 문제가 아닌 경우가 많습니다. 이에 대한 몇 가지 주목할 만한 예외에 대해서는 나중에 논의하겠습니다.

해당 사이트가 콘텐츠 관리 시스템을 사용하여 게시되는 경우, 페이지가 게시될 때 안전하지 않은 URL에 대한 링크가 삽입될 수 있습니다. 예를 들어 이미지는 상대 경로가 아닌 전체 URL과 함께 포함될 수 있습니다. CMS 콘텐츠 내에서 이러한 부분을 찾아서 수정해야 합니다.

### 혼합 콘텐츠 수정하기

사이트 소스에서 혼합 콘텐츠를 찾았으면 다음 단계에 따라 수정할 수 있습니다.

리소스 요청이 HTTP에서 HTTPS로 자동 업그레이드되었다는 콘솔 메시지가 표시되면 코드의 리소스에 대한 `http://` URL을 `https://`로 안전하게 변경할 수 있습니다. 또한, 브라우저 URL 표시줄에서 `http://`를 `https://`로 변경하고 브라우저 탭에서 이 URL을 열어 리소스를 안전하게 이용할 수 있는지 여부를 확인할 수도 있습니다.

`https://`를 통해 리소스를 사용할 수 없다면 다음 옵션 중 하나를 고려해야 합니다.

- 사용 가능한 경우 다른 호스트의 리소스를 포함합니다.
- 법적으로 허용된 경우 사이트에서 콘텐츠를 직접 다운로드하고 호스팅합니다.
- 사이트에서 리소스를 완전히 제외시킵니다.

문제를 해결했으면 원래 오류를 발견한 페이지를 열어보고 오류가 더 이상 나타나지 않는지 확인합니다.

### 비표준 태그 사용에 주의

사이트에서 비표준 태그 사용에 주의하세요. 예를 들어, 앵커(`<a>`) 태그 URL은 혼합 콘텐츠 오류를 일으키지 않는데, 브라우저가 새 페이지로 이동하게 만들기 때문입니다. 즉, 일반적으로 수정할 필요가 없습니다. 그러나 일부 이미지 갤러리 스크립트는 `<a>` 태그의 기능을 재정의하고 `href` 속성으로 지정된 HTTP 리소스를 페이지의 라이트박스 디스플레이에 로드하므로 혼합 콘텐츠 문제를 일으킵니다.

## 대규모 혼합 콘텐츠 처리

위의 수동 조치는 소규모 웹사이트에 적합합니다. 그러나 대규모 웹사이트 또는 여러 개발 팀이 있는 사이트의 경우 로드되는 모든 콘텐츠를 추적하기가 어려울 수 있습니다. 이 부분에서 도움을 받으려면 콘텐츠 보안 정책을 사용하여 혼합 콘텐츠에 대해 알림을 제공하도록 브라우저에 지시하고 페이지에 안전하지 않은 리소스가 예기치 않게 로드하지 않도록 할 수 있습니다.

### 콘텐츠 보안 정책

[콘텐츠 보안 정책](/csp/)(CSP)은 혼합 콘텐츠를 대규모로 관리하는 데 사용할 수 있는 다목적 브라우저 기능입니다. CSP 보고 메커니즘을 사용하여 사이트의 혼합 콘텐츠를 추적하고, 혼합 콘텐츠를 업그레이드 또는 차단하여 사용자를 보호하기 위한 시행 정책을 제공할 수 있습니다.

서버에서 보낸 응답에 `Content-Security-Policy` 또는 `Content-Security-Policy-Report-Only` 헤더를 포함시켜 페이지에 대해 이러한 기능을 적용할 수 있습니다. 또한 페이지의 `<head>` 섹션에서 `<meta>` 태그를 사용하여 `Content-Security-Policy`(`Content-Security-Policy-Report-Only`는 **아니지만**)를 설정할 수 있습니다.

{% Aside %} 최신 브라우저는 수신하는 모든 콘텐츠 보안 정책을 시행합니다. 브라우저가 응답 헤더 또는 `<meta>` 요소에서 여러 CSP 헤더 값을 수신하면 이를 결합하고 단일 정책으로 실행합니다. 보고 정책도 마찬가지로 결합됩니다. 정책은 정책의 교차점을 취하여 결합됩니다. 즉, 첫 번째 정책 이후의 각 정책은 허용된 콘텐츠를 더 제한할 수 있을 뿐 확장할 수는 없습니다. {% endAside %}

### 콘텐츠 보안 정책으로 혼합 콘텐츠 찾기

콘텐츠 보안 정책을 사용하여 사이트의 혼합 콘텐츠 보고서를 수집할 수 있습니다. 이 기능을 이용하려면 `Content-Security-Policy-Report-Only` 지시문을 사이트에 대한 응답 헤더로 추가하여 설정합니다.

응답 헤더:

`Content-Security-Policy-Report-Only: default-src https: 'unsafe-inline' 'unsafe-eval'; report-uri https://example.com/reportingEndpoint`

{% Aside %} [report-uri](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri) 응답 헤더는 [report-to](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/report-to)를 위해 더 이상 사용되지 않습니다. `report-to`에 대한 브라우저 지원은 현재 Chrome 및 Edge로 제한됩니다. 두 헤더를 모두 제공할 수 있으며, 이 경우 브라우저가 `report-uri`를 지원하면 `report-to`는 무시됩니다. {% endAside %}

사용자가 사이트의 페이지를 방문할 때마다 브라우저는 콘텐츠 보안 정책을 위반하는 모든 항목에 대한 JSON 형식 보고서를 `https://example.com/reportingEndpoint`로 보냅니다. 이 경우 HTTP를 통해 하위 리소스가 로드될 때마다 보고서가 전송됩니다. 이러한 보고서에는 정책 위반이 발생한 페이지 URL과 정책을 위반한 하위 리소스 URL이 포함됩니다. 이러한 보고서를 기록하도록 보고 엔드포인트를 구성하면 각 페이지를 직접 방문하지 않고도 사이트의 혼합 콘텐츠를 추적할 수 있습니다.

이에 대한 두 가지 주의 사항은 다음과 같습니다.

- 사용자는 CSP 헤더를 이해하는 브라우저에서 페이지를 방문해야 합니다. 이는 대부분의 최신 브라우저에 해당됩니다.
- 사용자가 방문한 페이지에 대한 보고서만 받습니다. 따라서 트래픽이 많지 않은 페이지가 있는 경우 전체 사이트에 대한 보고서를 받기까지 시간이 걸릴 수 있습니다.

[콘텐츠 보안 정책](/csp/) 가이드에 더 많은 정보와 예시 엔드포인트가 나와 있습니다.

### CSP를 사용한 또 다른 보고 방법

사이트가 Blogger와 같은 플랫폼에서 호스팅되는 경우 헤더를 수정하고 CSP를 추가할 수 있는 액세스 권한이 없을 수 있습니다. 이에 대한 대안으로, [HTTPSChecker](https://httpschecker.net/how-it-works#httpsChecker) 또는 [Mixed Content Scan](https://github.com/bramus/mixed-content-scan)과 같은 웹사이트 크롤러를 사용하여 사이트 전체의 문제를 찾을 수 있습니다.

### 안전하지 않은 요청 업그레이드

여러 브라우저에서 안전하지 않은 요청을 업그레이드 및 차단하고 있습니다. CSP 지시문을 사용하여 이러한 자산을 자동으로 업그레이드하거나 차단할 수 있습니다.

[`upgrade-insecure-requests`](https://www.w3.org/TR/upgrade-insecure-requests/) CSP 지시문은 네트워크 요청을 하기 전에 안전하지 않은 URL을 업그레이드하도록 브라우저에 지시합니다.

페이지에 `<img src="http://example.com/image.jpg">`와 같은 HTTP URL이 있는 이미지 태그가 포함된 경우를 예로 들어 보겠습니다.

브라우저는 대신 `https://example.com/image.jpg`에 대한 보안 요청을 하여 혼합 콘텐츠로부터 사용자를 보호합니다.

다음 지시문과 함께 `Content-Security-Policy` 헤더를 전송하여 이 동작을 활성화할 수 있습니다.

```markup
Content-Security-Policy: upgrade-insecure-requests
```

또는 `<meta>` 요소를 사용하여 문서의 `<head>` 섹션에 동일한 지시문을 인라인으로 포함시킵니다.

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

브라우저 자동 업그레이드와 마찬가지로 HTTPS를 통해 리소스를 사용할 수 없으면 업그레이드된 요청이 실패하고 리소스가 로드되지 않습니다. 그러면 페이지의 보안이 유지됩니다. `upgrade-insecure-requests` 지시문은 자동 브라우저 업그레이드에서 더 나아가 브라우저가 현재 적용하지 않는 요청까지 업그레이드합니다.

`upgrade-insecure-requests` 지시문은 `<iframe>` 문서로 캐스케이딩되어 전체 페이지가 보호되도록 합니다.

### 모든 혼합 콘텐츠 차단

사용자를 보호하기 위한 대체 옵션은 [`block-all-mixed-content`](https://www.w3.org/TR/mixed-content/#strict-checking) CSP 지시문입니다. 이 지시문은 브라우저에 혼합 콘텐츠를 로드하지 않도록 지시합니다. 활성 및 수동 혼합 콘텐츠를 포함하여 모든 혼합 콘텐츠 리소스 요청이 차단됩니다. 이 옵션은 또한 `<iframe>` 문서로 캐스케이딩되어 전체 페이지에 혼합 콘텐츠가 없도록 합니다.

페이지는 다음 지시문과 함께 `Content-Security-Policy` 헤더를 전송하여 이 동작을 선택할 수 있습니다.

```markup
Content-Security-Policy: block-all-mixed-content
```

또는 `<meta>` 요소를 사용하여 문서의 `<head>` 섹션에 동일한 지시문을 인라인으로 포함시킵니다.

```html
<meta http-equiv="Content-Security-Policy" content="block-all-mixed-content">
```

{% Aside %} `upgrade-insecure-requests`와 `block-all-mixed-content`를 모두 설정하면 `upgrade-insecure-requests`가 평가되고 먼저 사용됩니다. 브라우저는 더 진행하여 요청을 차단하지 않습니다. 따라서 둘 중 하나를 사용해야 합니다. {% endAside %}
