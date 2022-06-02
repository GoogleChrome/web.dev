---
layout: post
title: 문서에 메타 설명이 없음
description: |2-

  "문서에 메타 설명이 없음" Lighthouse 감사에 대해 알아봅니다.
date: 2019-05-02
updated: 2021-04-08
web_lighthouse:
  - meta-description
---

`<meta name="description">` 요소는 검색 엔진이 검색 결과에 포함하는 페이지 콘텐츠의 요약을 제공합니다. 고품질의 고유한 메타 설명은 페이지의 관련성을 높이고 검색 트래픽을 증가시킬 수 있습니다.

## Lighthouse 메타 설명 감사가 실패하는 방식

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 메타 설명이 없는 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dtMQ12xujHMJGuEwZ413.png", alt="문서에 메타 데이터가 없음을 보여주는 Lighthouse 감사", width="800", height="74" %}</figure>

다음과 같은 경우 감사가 실패합니다.

- 페이지에 `<meta name=description>` 요소가 없습니다.
- `<meta name=description>` 요소의 `content` 특성이 비어 있습니다.

Lighthouse는 설명의 품질을 평가하지 않습니다.

{% include 'content/lighthouse-seo/scoring.njk' %}

## 메타 설명을 추가하는 방법

각 페이지의 `<head>`에 `<meta name=description>` 요소를 추가합니다.

```html
<meta name="description" content="Put your description here.">
```

해당하는 경우 설명에 명확하게 태그가 지정된 사실을 포함합니다. 예를 들면 다음과 같습니다.

```html
<meta name="description" content="Author: A.N. Author,
    Illustrator: P. Picture, Category: Books, Price: $17.99,
    Length: 784 pages">
```

## 메타 설명 모범 사례

- 각 페이지에 고유한 설명을 사용합니다.
- 설명을 명확하고 간결하게 유지합니다. "집"과 같은 모호한 설명은 피합니다.
- [키워드 스터핑](https://support.google.com/webmasters/answer/66358)을 피합니다. 사용자에게 도움이 되지 않으며 검색 엔진이 페이지를 스팸으로 표시할 수 있습니다.
- 설명이 완전한 문장일 필요는 없습니다. 구조화된 데이터를 포함할 수 있습니다.

다음은 좋은 설명과 나쁜 설명의 예입니다.

{% Compare 'worse' %}

```html
<meta name="description" content="A donut recipe.">
```

{% CompareCaption %} 너무 모호합니다. {% endCompareCaption %} {% endCompare %}

{% Compare 'better' %}

```html
<meta
  name="description"
  content="Mary's simple recipe for maple bacon donuts
           makes a sticky, sweet treat with just a hint
           of salt that you'll keep coming back for.">
```

{% CompareCaption %} 설명적이면서도 간결합니다. {% endCompareCaption %} {% endCompare %}

더 많은 팁을 보려면 Google의 [검색 결과에서 좋은 제목과 스니펫 만들기](https://support.google.com/webmasters/answer/35624#1) 페이지를 참조하세요.

## 리소스

- [**문서에 메타 설명이 없음** 감사의 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/meta-description.js)
- [검색 결과에 좋은 제목과 스니펫 만들기](https://support.google.com/webmasters/answer/35624#1)
- [관련이 없는 키워드](https://support.google.com/webmasters/answer/66358)
