---
layout: post
title: 이미지 요소에는 `[alt]` 속성이 없습니다
description: 대체 텍스트를 제공하여 보조 기술 사용자가 귀하의 웹 페이지의 이미지에 액세스할 수 있도록 하는 방법을 알아보세요.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - image-alt
---

정보 요소는 짧고 설명적인 대체 텍스트를 목표로 해야 합니다. 비어 있는 alt 속성으로 장식 요소를 무시할 수 있습니다.

## Lighthouse 이미지 대체 텍스트 감사가 실패하는 이유

Lighthouse는 `alt` 속성이 없는 `<img>` 요소에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/hb8ypHK5xwmtUZwdxyQG.png", alt="Lighthouse 감사가 alt 속성이 없는 <img> 요소를 표시합니다", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 이미지에 대체 텍스트를 추가하는 방법

`<img>` 요소에 `alt` 속성을 제공하십시오. 이미지 로드에 실패하면 `alt` 텍스트가 자리 표시자로 사용되므로 사용자는 이미지가 전달하려는 내용을 알 수 있습니다([이미지 및 개체에 대한 대체 텍스트 포함하기](/labels-and-text-alternatives#include-text-alternatives-for-images-and-objects)도 참조하세요).

대부분의 이미지에는 짧고 설명적인 텍스트가 있어야 합니다.

```html
<img alt="Audits set-up in Chrome DevTools" src="...">
```

이미지가 장식 역할을 하고 유용한 콘텐츠를 제공하지 않는 경우 빈 `alt=""` 속성을 지정하여 접근성 트리에서 이미지를 제거할 수 있습니다.

```html
<img src="background.png" alt="">
```

{% Aside 'note' %} 또한 ARIA 레이블을 사용하여 이미지를 설명할 수도 있습니다(예: `<img aria-label="Chrome DevTools의 감사 설정" src="...">` [aria-label 속성 사용하기](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) 및 [aria-labelledby 속성 사용하기](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute)도 참조하세요. {% endAside %}

## `alt` 텍스트 작성을 위한 팁

- `alt` 텍스트는 이미지의 의도, 목적 및 의미를 제공해야 합니다.
- 시각 장애인 사용자는 시각 장애가 없는 사용자가 이미지에서 얻는 것만큼 대체 텍스트에서 많은 정보를 얻어야 합니다.
- "차트", "이미지", "다이어그램"과 같이 구체적이지 않은 단어는 사용하지 마세요.

[WebAIM의 대체 텍스트 가이드](https://webaim.org/techniques/alttext/)에서 자세히 알아보세요.

## 참고자료

- [**이미지 요소에 `[alt]` 속성**이 없습니다 감사 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/image-alt.js)
- [이미지에는 대체 텍스트가 있어야 합니다(Deque University)](https://dequeuniversity.com/rules/axe/3.3/image-alt)
