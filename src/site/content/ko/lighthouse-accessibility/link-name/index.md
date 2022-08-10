---
layout: post
title: 링크에 식별 가능한 이름이 없습니다.
description: |2

  웹 페이지의 링크를 보다 쉽게 액세스할 수 있도록 하는 방법을 알아보세요.

  보조 기술이 해석할 수 있는 이름이 있는지 확인합니다.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - link-name
---

식별 가능하고 고유하며 포커스 가능한 링크 텍스트는화면 읽기 프로그램 및 기타 보조 기술 사용자의 탐색 경험을 향상시킵니다.

## 이 Lighthouse 감사가 실패하는 이유

식별 가능한 이름이 없는 Lighthouse 플래그 링크:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6enCwSloHJSyylrNIUF4.png", alt="Lighthouse 감사 표시 링크에 식별 가능한 이름이 없습니다.", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 링크에 액세스 가능한 이름을 추가하는 방법

버튼과 마찬가지로 링크는 주로 텍스트 콘텐츠에서 액세스 가능한 이름을 얻습니다. "여기" 또는 "자세히 알아보기"와 같은 채우기 단어를 사용하지 마십시오. 대신 링크 자체에 가장 의미 있는 텍스트를 넣으십시오.

```html
Check out <a href="…">our guide to creating accessible web pages</a>.
</html>
```

[레이블 버튼 및 링크](/labels-and-text-alternatives#label-buttons-and-links)에서 자세히 알아보십시오.

## 참고 자료

- [**식별 가능한 이름이 없는 링크** 감사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/link-name.js)
- [링크에는 식별 가능한 텍스트가 있어야 함(Deque University).](https://dequeuniversity.com/rules/axe/3.3/link-name)
