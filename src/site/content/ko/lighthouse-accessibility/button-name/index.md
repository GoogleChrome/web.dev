---
layout: post
title: 버튼에 액세스할 수 있는 이름이 없습니다.
description: 모든 버튼에 보조 기술 사용자가 액세스할 수 있는 이름이 있는지 확인하여 웹 페이지의 접근성을 개선하는 방법에 대해 알아보세요.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - button-name
---

버튼에 액세스 가능한 이름이 없으면 화면 판독기 및 기타 보조 기술이 *버튼*이라고 발표합니다. 이는 사용자에게 버튼이 수행하는 작업에 대한 정보를 제공하지 않습니다.

## Lighthouse 버튼 이름 감사가 실패하는 방식

Lighthouse는 텍스트 콘텐츠 또는 `aria-label` 속성이 없는 버튼을 플래그 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/evoQAq4c1CBchwNMl9Uq.png", alt="Lighthouse 감사 표시 버튼에 액세스할 수 있는 이름이 없음", width="800", height="206" %}</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 버튼에 액세 가능한 이름을 추가하는 방법

레이블이 보이는 버튼의 경우 텍스트 콘텐츠를 `button`에 추가합니다. 레이블을 명백한 작업 호출로 만듭니다. 예:

```html
<button>Book room</button>
```

아이콘 버튼과 같이 레이블이 보이지 않는 버튼의 경우 `aria-label` 속성을 사용하여 보조 기술을 사용하는 모든 사람에게 작업을 명확하게 설명합니다. 예:

{% Glitch { id: 'lh-button-name', path: 'index.html', previewSize: 0, height: 480 } %}

{% Aside %} 이 샘플 앱은 [연결 장치](https://google.github.io/material-design-icons/)를 사용하여 버튼의 내부 텍스트를 아이콘 글리프로 변환하는 Google의 [Material 아이콘 글꼴](https://alistapart.com/article/the-era-of-symbol-fonts/)에 의존합니다. 보조 기술은 버튼을 발표할 때 아이콘 글리프라기 보다 `aria-label`을 의미합니다. {% endAside %}

[레이블 버튼 및 링크](/labels-and-text-alternatives#label-buttons-and-links) 또한 참조하십시오.

## 리소스

- [**액세스 가능한 이름이 없는 버튼** 감사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/accessibility/button-name.js)
- [버튼에는 식별 가능한 텍스트가 있어야 함(Decue University).](https://dequeuniversity.com/rules/axe/3.3/button-name)
