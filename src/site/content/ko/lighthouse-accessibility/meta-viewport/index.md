---
layout: post
title: '`[user-scalable="no"]`가 `<meta name="viewport">` 요소에 사용되거나 `[maximum-scale]` 속성이 `5` 미만입니다.'
description: 브라우저 줌이 비활성화되지 않았는지 확인해서 웹 페이지에의 접근성을 높이는 방법을 알아보십시오.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - meta-viewport
---

`<meta name="viewport">` 요소에 대한 `user-scalable="no"` 매개변수는 웹 페이지에서 브라우저 확대/축소를 비활성화합니다. `maximum-scale` 매개변수는 사용자가 확대/축소할 수 있는 크기를 제한합니다. 둘 다 웹 페이지의 내용을 보기 위해 브라우저 확대/축소에 의존하는 시력이 낮은 사용자에게 문제가 됩니다.

## Lighthouse 브라우저 확대/축소 감사가 실패하는 방식

Lighthouse는 브라우저 확대/축소를 비활성화하는 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/84cMMpBDm0rDl6hQISci.png", alt="표시 영역을 표시하는 Lighthouse 감사는 텍스트 크기 조정 및 확대/축소를 비활성화합니다", width="800", height="227" %}</figure>

다음 중 하나와 함께 `<meta name="viewport">` 태그가 포함된 페이지는 감사에 실패합니다.

- `user-scalable="no"` 매개변수가 있는 `content` 속성
- `maximum-scale` 매개변수가 `5` `content` 속성

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 브라우저 확대/축소 비활성화를 피하는 방법

뷰포트 메타 태그에서 `user-scalable="no"` 매개변수를 제거하고 `maximum-scale` 매개변수가 `5` 이상으로 설정되어 있는지 확인하십시오.

## 참고자료

- [**`[user-scalable="no"]`가 `<meta name="viewport">` 요소에 사용되거나 ` [maximum-scale]` 속성이 5 미만**인 소스 코드 감사](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/meta-viewport.js)
- [확대/축소 및 크기 조정을 비활성화하면 안 됩니다(Deque University).](https://dequeuniversity.com/rules/axe/3.3/meta-viewport)
