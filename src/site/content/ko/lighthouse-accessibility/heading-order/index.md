---
layout: post
title: 제목 요소가 내림차순으로 정렬되어 있지 않음
description: |2

  보조 기술 사용자가 쉽게 탐색할 수 있도록 하는 방법을 배우십시오.

  제목 요소를 올바르게 구성하여 웹 페이지를 만들 수 있습니다.
date: 2019-10-17
updated: 2020-05-07
web_lighthouse:
  - 표제 순서
---

{% include 'content/lighthouse-accessibility/why-headings.njk' %}

## Lighthouse 제목 레벨 감사가 실패하는 방법

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 제목이 하나 이상의 레벨을 건너뛰는 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4dd4TvMxSF6tYJ0wGM64.png", alt="레벨을 건너뛰는 제목을 표시하는 Lighthouse 감사", width="800", height="206" %}</figure>

예를 들어 페이지 제목으로 `<h1>` 요소를 사용한 다음 페이지의 주요 섹션에 대해 `<h3>` 요소를 사용하면 `<h2>` 레벨을 건너뛰기 때문에 감사에 실패합니다.

```html
<h1>Page title</h1>
  <h3>Section heading 1</h3>
  …
  <h3>Section heading 2</h3>
  …
```

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 잘못 구성된 제목을 수정하는 방법

- 모든 제목 요소가 콘텐츠의 구조를 반영하는 논리적인 숫자 순서를 따르도록 합니다.
- 제목 텍스트가 관련 섹션의 내용을 명확하게 전달하는지 확인하세요.

예시:

```html
<h1>Page title</h1>
<section>
  <h2>Section Heading</h2>
  …
    <h3>Sub-section Heading</h3>
</section>
```

제목 구조를 확인하는 한 가지 방법은 "누군가 제목만 사용하여 내 페이지의 개요를 만들었다면 말이 될까요?"라고 묻는 것입니다.

또한 Microsoft의 <a href="https://accessibilityinsights.io/" rel="noopener">Accessibility Insights 확장</a>과 같은 도구를 사용하여 페이지 구조를 시각화하고 잘못된 제목 요소를 잡을 수 있습니다.

{% Aside 'caution' %} 개발자는 원하는 시각적 스타일을 얻기 위해 제목 레벨을 건너뛰는 경우가 있습니다. 예를 들어, `<h2>` 텍스트가 너무 크다고 느끼기 때문에 `<h3>` 요소를 사용할 수도 있습니다. 이는 **안티 패턴**으로 간주됩니다. 대신, 올바른 순서의 표제 구조를 사용하고 CSS를 사용하여 원하는 대로 표제를 시각적으로 스타일 지정하십시오. {% endAside %}

자세한 내용은 [제목 및 랜드마크](/headings-and-landmarks) 게시물을 참조하세요.

## 자원

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/heading-order.js" rel="noopener"><strong>제목 건너뛰기 레벨</strong> 감사를 위한 소스 코드</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/heading-order" rel="noopener">제목 레벨은 1만 증가해야 합니다(Deque University).</a>
