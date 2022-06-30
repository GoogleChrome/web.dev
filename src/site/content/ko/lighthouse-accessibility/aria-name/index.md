---
layout: post
title: ARIA 항목에 액세스 가능한 이름이 없음
description: |2

  다음을 확인하여 웹 페이지의 접근성을 개선하는 방법을 배우십시오.

  보조 기술 사용자는 ARIA 항목의 이름에 액세스할 수 있습니다.
date: 2020-12-08
web_lighthouse:
  - aria-command-name
  - aria-input-field-name
  - aria-meter-name
  - aria-progressbar-name
  - aria-toggle-field-name
  - aria-tooltip-name
  - aria-treeitem-name
tags:
  - accessibility
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

{% include 'content/lighthouse-accessibility/accessible-names.njk' %}

## Lighthouse가 접근 가능한 이름이 없는 ARIA 항목을 식별하는 방법

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 보조 기술에서 이름에 액세스할 수 없는 사용자 지정 ARIA 항목에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Dnruhkr4IKtq0Pi9Pgny.png", alt="접근 가능한 이름이 없는 사용자 지정 토글 요소를 표시하는 Lighthouse 감사", width="800", height="259" %}</figure>

액세스 가능한 이름을 확인하는 7개의 감사가 있으며 각 감사는 서로 다른 [ARIA 역할](https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex) 집합을 다룹니다. 다음 ARIA 역할 중 하나가 있지만 액세스 가능한 이름이 없는 요소로 인해 이 감사가 실패합니다.

감사 이름 | ARIA 역할
--- | ---
`aria-command-name` | `button` , `link` , `menuitem`
`aria-input-field-name` | `combobox` , `listbox` , `searchbox` `slider` , `spinbutton` , `textbox`
`aria-meter-name` | `meter`
`aria-progressbar-name` | `progressbar`
`aria-toggle-field-name` | `checkbox` , `menu` , `menuitemcheckbox` , `menuitemradio` , `radio` , `radiogroup` , `switch`
`aria-tooltip-name` | `tooltip`
`aria-treeitem-name` | `treeitem`

{% include 'content/lighthouse-accessibility/use-built-in.njk' %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## 예시 1: 사용자 지정 ARIA 토글 필드에 액세스 가능한 이름을 추가하는 방법

### 옵션 1: 요소에 내부 텍스트 추가

대부분의 요소에 액세스 가능한 이름을 제공하는 가장 쉬운 방법은 요소 내부에 텍스트 콘텐츠를 포함하는 것입니다.

예를 들어 이 사용자 지정 확인란은 보조 기술 사용자에게 "신문"으로 발표됩니다.

```html
<div id="checkbox1" role="checkbox">Newspaper</div>
```

[클립 패턴](https://www.a11yproject.com/posts/2013-01-11-how-to-hide-content/)을 사용하면 화면에서 내부 텍스트를 숨길 수 있지만 여전히 보조 기술을 통해 알릴 수 있습니다. 이것은 현지화를 위해 페이지를 번역하는 경우 특히 유용할 수 있습니다.

```html
<a href="/accessible">Learn more <span class="visually-hidden">about accessibility on web.dev</span></a>
```

### 옵션 2: 요소에 `aria-label` 속성 추가

내부 텍스트를 추가할 수 없는 경우(예: 요소의 이름을 표시하지 않으려는 경우) `aria-label` 속성을 사용하십시오.

이 사용자 지정 스위치는 보조 기술 사용자에게 "블루 라이트 전환"으로 발표됩니다.

```html
<div id="switch1"
    role="switch"
    aria-checked="true"
    aria-label="Toggle blue light">
    <span>off</span>
    <span>on</span>
</div>
```

### 옵션 3: `aria-labelledby`를 사용하여 다른 요소 참조

`aria-labelledby` 속성을 사용하여 현재 요소의 이름으로 사용할 ID를 사용하여 다른 요소를 식별합니다.

예를 들어, 이 사용자 정의 메뉴 라디오 버튼은 `menuitem1Label` 단락을 레이블로 참조하며 "Sans-serif"로 발표됩니다.

```html
<p id="menuitem1Label">Sans-serif</p>
<ul role="menu">
    <li id="menuitem1"
        role="menuitemradio"
        aria-labelledby="menuitem1Label"
        aria-checked="true"></li>
</ul>
```

## 예시 2: 사용자 지정 ARIA 입력 필드에 접근 가능한 이름을 추가하는 방법

대부분의 요소에 액세스 가능한 이름을 제공하는 가장 쉬운 방법은 요소에 텍스트 콘텐츠를 포함하는 것입니다. 그러나 사용자 지정 입력 필드에는 일반적으로 내부 텍스트가 없으므로 대신 다음 전략 중 하나를 사용할 수 있습니다.

### 옵션 1: 요소에 `aria-label` 속성 추가

`aria-label` 속성을 사용하여 현재 요소의 이름을 정의합니다.

예를 들어 이 사용자 지정 콤보 상자는 보조 기술 사용자에게 "국가"로 발표됩니다.

```html
<div id="combo1" aria-label="country" role="combobox"></div>
```

### 옵션 2: `aria-labelledby`를 사용하여 다른 요소 참조

`aria-labelledby` 속성을 사용하여 현재 요소의 이름으로 사용할 ID를 사용하여 다른 요소를 식별합니다.

예를 들어 이 사용자 정의 검색 상자는 `searchLabel` 단락을 레이블로 참조하며 "검색 통화 쌍"으로 발표됩니다.

```html
<p id="searchLabel">Search currency pairs:</p>
<div id="search"
    role="searchbox"
    contenteditable="true"
    aria-labelledby="searchLabel"></div>
```

## 리소스

- [**모든 ARIA 토글 필드에 액세스 가능한 이름이 있는 것은 아님** 감사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-toggle-field-name.js)
- [ARIA 버튼, 링크 및 메뉴 항목에는 액세스 가능한 이름이 있어야 함(Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-command-name)
- [ARIA 입력 필드에는 액세스 가능한 이름이 있어야 함(Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-input-field-name)
- [ARIA 미터에는 액세스 가능한 이름이 있어야 함(Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-meter-name)
- [ARIA 진행 표시줄에는 액세스 가능한 이름이 있어야 함(Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-progressbar-name)
- [ARIA 토글 필드에는 액세스 가능한 이름이 있음(Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-toggle-field-label)
- [ARIA 도구 설명에는 액세스 가능한 이름이 있어야 함(Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-tooltip-name)
- [ARIA 트리 항목에는 액세스 가능한 이름이 있어야 함(Deque University)](https://dequeuniversity.com/rules/axe/4.1/aria-treeitem-name)
- [레이블 및 텍스트 대안](/labels-and-text-alternatives)
- [쉬운 키보드 승리를 위해 시맨틱 HTML 사용](/use-semantic-html)
