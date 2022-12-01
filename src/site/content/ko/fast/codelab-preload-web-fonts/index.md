---
layout: codelab
title: 웹 글꼴을 미리 로드하여 로딩 속도 개
authors:
  - gmimani
description: 이 코드랩에서는 웹 글꼴을 미리 로드하여 페이시 성능을 개선하는 방법에 대해 알아봅니다.
date: 2018-04-23
glitch: web-dev-preload-webfont?path=index.html
related_post: preload-critical-assets
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

이 코드랩에는 `rel="preload"`를 사용하여 웹 글꼴을 미리 로드하여 스타일이 지정되지 않은 텍스트(FOUT)의 플래시를 제거하는 방법이 제시되어 있습니다.

## 측정

최적화를 추가하기 전에 먼저 웹사이트의 성능을 측정하십시오. {% Instruction 'preview', 'ol' %} {% Instruction 'audit-performance', 'ol' %}

생성된 Lighthouse 보고서에는 **최대 중요 경로 대기 시간** 아래에 리소스 가져오기 순서가 표시됩니다.

{% Img src="image/admin/eperh8ZUnjhsDlnJdNIG.png", alt="웹 글꼴은 중요 요청 체인에 나타납니다.", width="704", height="198" %}

위의 감사에서 웹 글꼴은 중요한 요청 체인의 일부이며 마지막으로 가져옵니다. [**중요 요청 체인**](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/)은 브라우저에서 우선 순위를 지정하고 가져오는 리소스의 순서를 나타냅니다. 이 애플리케이션에서 웹 글꼴(Pacfico 및 Pacifico-Bold)은 [@font-face](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization#defining_a_font_family_with_font-face) 규칙을 사용하여 지정되며 중요 요청 체인에서 브라우저가 가져온 마지막 리소스입니다. 일반적으로 웹 글꼴은 늦게 로드됩니다. 이는 중요 리소스(CSS, JS)가 다운로드될 때까지 로드되지 않음을 의미합니다.

다음은 애플리케이션에서 가져온 리소스의 순서입니다.

{% Img src="image/admin/9oBNjZORrBj6X8RVlr9t.png", alt="웹 글꼴이 늦게 로드되었습니다.", width="583", height="256" %}

## 웹 글꼴 미리 로드

FOUT을 방지하기 위해 즉시 필요한 웹 글꼴을 미리 로드할 수 있습니다. 문서 헤드에 이 애플리케이션에 대한 `Link` 요소를 추가합니다.

```html
<head>
 <!-- ... -->
 <link rel="preload" href="/assets/Pacifico-Bold.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

`as="font" type="font/woff2"` 속성은 브라우저에 이 리소스를 글꼴로 다운로드하도록 지시하고 리소스 대기열의 우선 순위를 지정하는 데 도움이 됩니다.

`crossorigin` 속성은 글꼴이 다른 도메인에서 올 수 있으므로 CORS 요청으로 리소스를 가져와야 하는지 여부를 나타냅니다. 이 속성이 없으면 브라우저에서 미리 로드된 글꼴을 무시합니다.

페이지 헤더에 Pacifico-Bold가 사용되므로 더 빨리 가져올 수 있도록 사전 로드 태그를 추가했습니다. Pacifico.woff2 글꼴은 접힌 부분 아래에 있는 텍스트의 스타일을 지정하기 때문에 미리 로드하는 것은 그리 중요하지 않습니다.

애플리케이션을 다시 로드하고 Lighthouse를 다시 실행하십시오. **최대 중요 경로 대기 시간** 섹션을 확인하십시오.

{% Img src="image/admin/lC85s7XSc8zEXgtwLsFu.png", alt="Pacifico-Bold 웹 글꼴이 사전 로드되어 중요 요청 체인에서 제거됨", width="645", height="166" %}

`Pacifico-Bold.woff2`가 중요 요청 체인에서 어떻게 제거되었는지 확인하십시오. 애플리케이션에서 더 일찍 패치됩니다.

{% Img src="image/admin/BrXidcKZfCbbUbkcSwas.png", alt="Pacifico-Bold 웹폰트가 미리 로드됨", width="553", height="254" %}

사전 로드 시 브라우저는 이 파일을 더 일찍 다운로드해야 한다는 것을 알고 있습니다. 적절히 사용하지 않으면 사전 로드가 사용되지 않는 리소스에 대해 불필요한 요청을 하여 성능을 저하시킬 수 있다는 점에 유의하는 것이 중요합니다.
