---
layout: post
title: 링크에 설명 텍스트가 없습니다.
description: |2

  "링크에 설명 텍스트가 없습니다" Lighthouse 감사에 대해 알아보세요.
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - link-text
---

링크 텍스트는 하이퍼링크에서 클릭할 수 있는 단어 또는 구문입니다. 링크 텍스트가 하이퍼링크의 대상을 명확하게 전달하면 사용자와 검색 엔진 모두 귀하의 콘텐츠와 다른 페이지와의 관계를 보다 쉽게 이해할 수 있습니다.

## Lighthouse 링크 텍스트 감사가 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 설명 텍스트가 없는 링크에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hiv184j4TFNCsmqTCTNY.png", alt="설명 텍스트가 없는 링크를 표시하는 Lighthouse 감사", width="800", height="191" %}</figure>

Lighthouse는 다음의 일반적인 링크 텍스트에 플래그를 지정합니다.

- `여기를 클릭하세요`
- `이것을 클릭하세요`
- `이동`
- `여기`
- `이곳`
- `시작`
- `바로 이곳`
- `더 보기`
- `더 알아보기`

{% include 'content/lighthouse-seo/scoring.njk' %}

## 설명 링크 텍스트를 추가하는 방법

"여기를 클릭하십시오" 및 "자세히 알아보기"와 같은 일반적인 문구를 특정 설명으로 바꾸십시오. 일반적으로 사용자가 하이퍼링크를 따라갈 경우 얻을 수 있는 콘텐츠 유형을 명확하게 나타내는 링크 텍스트를 작성합니다.

```html
<p>To see all of our basketball videos, <a href="videos.html">click here</a>.</p>
```

{% Compare 'worse', 'Don\'t' %} "여기를 클릭하십시오"는 하이퍼링크가 사용자를 어디로 데려갈 것인지 알려주지 않습니다. {% endCompare %}

```html
<p>Check out all of our <a href="videos.html">basketball videos</a>.</p>
```

{% Compare 'better', 'Do' %} "농구 동영상"은 하이퍼링크가 사용자를 동영상 페이지로 안내한다는 것을 명확하게 전달합니다. {% endCompare %}

{% Aside %} 링크 텍스트를 설명적으로 만들기 위해 주변 문장을 수정해야 하는 경우가 많습니다. {% endAside %}

## 링크 텍스트 모범 사례

- 주제를 유지하십시오. 페이지 내용과 관련이 없는 링크 텍스트를 사용하지 마십시오.
- 사이트의 새 주소를 참조하는 것과 같이 합당한 이유가 없는 한 페이지의 URL을 링크 설명으로 사용하지 마십시오.
- 설명을 간결하게 유지하십시오. 몇 단어 또는 짧은 문구를 목표로 합니다.
- 내부 링크에도 주의하십시오. 내부 링크의 품질을 개선하면 사용자와 검색 엔진 모두 사이트를 더 쉽게 탐색할 수 있습니다.

추가 팁은 Google [검색 엔진 최적화(SEO) 시작 가이드](https://support.google.com/webmasters/answer/7451184#uselinkswisely)의 [현명한 링크 사용](https://support.google.com/webmasters/answer/7451184) 섹션을 참조하세요.

## 참고 자료

- [**링크에 설명 텍스트가 없습니다** 감사 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/seo/link-text.js)
- [검색 엔진 최적화(SEO) 시작 가이드](https://support.google.com/webmasters/answer/7451184)
