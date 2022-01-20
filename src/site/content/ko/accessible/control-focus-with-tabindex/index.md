---
layout: post
title: tabindex로 포커스 제어
authors:
  - robdodson
date: 2018-11-18
description: "<button> 또는 <input>과 같은 표준 HTML 요소에는 무료로 내장된 키보드 접근성이 있습니다. 맞춤형 상호작용 구성 요소를 구축하는 경우 tabindex를 사용하여 키보드에 액세스할 수 있는지 확인합니다."
---

`<button>` 또는 `<input>` 과 같은 표준 HTML 요소에는 무료로 내장된 키보드 접근성이 있습니다. 그러나 *맞춤형* 상호작용 구성 요소를 구축하는 경우 `tabindex` 속성을 사용하여 키보드에 액세스할 수 있는지 확인합니다.

{% Aside %} 가능하면 사용자 정의 버전을 구축하는 대신 내장 HTML 요소를 사용하세요. 예들 들어, `<button>`은 스타일 지정이 매우 쉽고 이미 완전한 키보드 지원을 제공합니다. `tabindex`를 관리하거나 ARIA로 의미 체계를 추가할 필요가 없습니다. {% endAside %}

## 컨트롤이 키보드에 액세스할 수 있는지 확인

Lighthouse와 같은 도구는 특정 접근성 문제를 감지하는 데 탁월하지만 일부 항목은 사람만 테스트할 수 있습니다.

`Tab` 키를 눌러 사이트를 탐색해 보세요. 페이지의 모든 상호작용 컨트롤에 접근할 수 있나요? 그렇지 않은 경우 [`tabindex`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/tabindex)를 사용하여 해당 컨트롤의 포커스 가능성을 개선해야 할 수 있습니다.

{% Aside 'warning' %} 포커스 표시기가 전혀 표시되지 않으면 CSS에 의해 숨겨져 있을 수 있습니다. 언급된 `:focus { outline: none; }` 스타일이 있는지 확인하세요. [스타일 지정](/style-focus)에 대한 가이드에서 이 문제를 해결하는 방법을 배울 수 있습니다. {% endAside %}

## 탭 순서에 요소 삽입

`tabindex="0"`을 사용하여 자연스러운 탭 순서로 요소를 삽입하세요. 예를 들면 다음과 같습니다.

```html
<div tabindex="0">Focus me with the TAB key</div>
```

요소에 초점을 맞추려면 `Tab` 키를 누르거나 요소의 `focus()` 메서드를 호출합니다.

{% Glitch { id: 'tabindex-zero', path: 'index.html', height: 346 } %}

## 탭 순서에서 요소 제거

`tabindex="-1"`을 사용하여 요소를 제거합니다. 예를 들면 다음과 같습니다.

```html
<button tabindex="-1">Can't reach me with the TAB key!</button>
```

이렇게 하면 자연스러운 탭 순서에서 요소가 제거되지만 `focus()` 메서드를 호출하여 요소에 계속 초점을 맞출 수 있습니다.

{% Glitch { id: 'tabindex-negative-one', path: 'index.html', height: 346 } %}

`tabindex="-1"`을 요소에 적용해도 하위 요소에는 영향을 미치지 않습니다. 자연스럽게 탭 순서에 있거나 `tabindex` 값으로 인해 탭 순서대로 유지됩니다. 탭 순서에서 요소와 모든 하위 요소를 제거하려면 [WICG의 `inert` polyfill](https://github.com/WICG/inert) 사용을 고려하세요. polyfill은 제안된 `inert` 속성의 동작을 모방하여 요소가 보조 기술에 의해 선택되거나 읽히는 것을 방지합니다.

{% Aside 'caution' %} `inert` polyfill은 시험적이며 모든 경우에 예상대로 작동하지 않을 수 있습니다. 프로덕션 환경에서 사용하기 전에 신중하게 테스트하세요. {% endAside %}

## `tabindex > 0` 방지

0보다 큰 모든 `tabindex`는 요소를 자연스러운 탭 순서의 맨 앞으로 옮깁니다. `tabindex`가 0보다 큰 요소가 여러 개 있는 경우 탭 순서는 0보다 큰 가장 낮은 값부터 시작하여 위로 올라갑니다.

0보다 큰 `tabindex`를 사용하면 화면 판독기가 탭 순서가 아니라 DOM 순서로 페이지를 탐색하기 때문에 **안티 패턴**으로 간주됩니다. 한 요소의 탭 순서가 더 빨라야 하는 경우 DOM의 이전 위치로 이동해야 합니다.

`tabindex` &gt; 0인 요소를 쉽게 식별할 수 있습니다. 접근성 감사(Lighthouse &gt; 옵션 &gt; 접근성)를 실행하고 "0보다 큰 [tabindex] 값을 가진 요소가 없습니다"라는 감사 결과를 찾으세요.

## "roving `tabindex` "를 사용하여 액세스 가능한 구성 요소 생성

복잡한 구성 요소를 구축하는 경우 초점을 넘어 추가적인 키보드 지원을 추가해야 할 필요가 있을 수 있습니다. 내장된 `select` 요소를 고려하세요. 초점을 맞출 수 있으며 화살표 키를 사용하여 추가 기능(선택 가능한 옵션)을 표시할 수 있습니다.

고유한 구성 요소에서 유사한 기능을 구현하려면 "roving `tabindex`"라는 기술을 사용하세요. roving tabindex는 현재 활성화된 하위 요소를 제외한 모든 하위 요소에 대해 `tabindex`을 설정하여 작동합니다. 그런 다음 구성 요소는 키보드 이벤트 리스너를 사용하여 사용자가 눌렀던 키를 확인합니다.

이 경우 구성 요소는 이전에 포커스가 맞춰진 하위 요소의 `tabindex`를 -1로 설정하고 포커스를 받을 하위 요소의 `tabindex`를 0으로 설정한 다음 여기에 `focus()` 메서드를 호출합니다.

**이전**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Undo</div>
  <button tabindex="0">Redo</div>
  <button tabindex="-1">Cut</div>
</div>
```

**이후**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Undo</div>
  <button tabindex="-1">Redo</div>
  <button tabindex="0">Cut</div>
</div>
```

{% Glitch { id: 'roving-tabindex', path: 'index.html', height: 346 } %}

{% Aside %} 이러한 `role=""` 속성이 무엇을 위한 것인지 궁금하신가요? 이것들을 사용하면 요소의 의미를 변경하여 스크린 리더로 적절하게 알릴 수 있습니다. [스크린 리더 기본](/semantics-and-screen-readers) 가이드에서 이에 대해 자세히 알아볼 수 있습니다. {% endAside %}

{% Assessment 'self-assessment' %}

## 키보드 액세스 레시피

사용자 지정 구성 요소에 필요한 키보드 지원 수준이 확실하지 않은 경우 [ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/)을 참조하세요. 이 편리한 가이드는 일반적인 UI 패턴을 나열하고 구성 요소가 지원해야 하는 키를 식별합니다.
