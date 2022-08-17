---
layout: post
title: 양식 요소에 연결된 레이블이 없습니다.
description: 레이블을 제공하여 보조 기술 사용자가 양식 요소에 액세스할 수 있도록 하는 방법을 알아보세요.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - 레이블
---

레이블은 화면 판독기와 같은 보조 기술이 양식 컨트롤을 적절하게 읽도록 해줍니다. 보조 기술 사용자는 이러한 레이블에 의지하여 양식을 탐색합니다. 레이블 텍스트는 클릭 대상을 더 크게 만들므로 마우스 및 터치스크린 사용자도 레이블의 이점을 누릴 수 있습니다.

## 이 Lighthouse 감사에 실패하는 이유

Lighthouse 플래그는 연결된 레이블이 없는 요소를 형성합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMWt5UyiUUskhKHUcYoN.png", alt="관련된 레이블이 없는 양식 요소를 보여주는 Lighthouse 감사", width="800", height="185" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 양식 요소에 레이블을 추가하는 방법

레이블을 양식 요소와 연결하는 두 가지 방법이 있습니다. 먼저, 레이블 요소 내에 입력 요소를 배치합니다.

```html
<label>
  Receive promotional offers?
  <input type="checkbox">
</label>
```

두 번째, 레이블의 `for` 특성을 사용하고 요소의 ID를 참조하세요.

```html
<input id="promo" type="checkbox">
<label for="promo">Receive promotional offers?</label>
```

확인란에 레이블이 올바르게 지정되면 보조 기술이 요소에 확인란 역할이 있고, 선택된 상태이며, 이름이 "프로모션 제안을 받겠습니까?"라고 보고합니다. [레이블 양식 요소](/labels-and-text-alternatives#label-form-elements)를 참조하세요.

## 리소스

- [**양식 요소에 관련 레이블이 없습니다** 감사의 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/label.js)
- [양식 `<input>` 요소에는 레이블이 있어야 합니다(Deque University).](https://dequeuniversity.com/rules/axe/3.3/label)
