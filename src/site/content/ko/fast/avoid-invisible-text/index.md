---
layout: post
title: 글꼴 로드 중 보이지 않는 텍스트 방지
authors:
  - katiehempenius
description: 글꼴은 로드하는 데 시간이 걸리는 대용량 파일인 경우가 많습니다. 이를 처리하기 위해 일부 브라우저는 글꼴이 로드될 때까지 텍스트를 숨깁니다("보이지 않는 텍스트의 깜박임(FOIT)". 성능을 최적화하는 경우 "보이지 않는 텍스트의 깜박임(FOIT)"을 피하고 시스템 글꼴을 사용하여 즉시 사용자에게 콘텐츠를 표시하고 싶을 것입니다.
date: 2018-11-05
codelabs:
  - codelab-avoid-invisible-text
tags:
  - performance
feedback:
  - api
---

## 왜 신경을 써야 할까요?

글꼴은 로드하는 데 시간이 걸리는 대용량 파일인 경우가 많습니다. 이를 처리하기 위해 일부 브라우저는 글꼴이 로드될 때까지 텍스트를 숨깁니다("보이지 않는 텍스트의 깜박임(FOIT)". 성능을 최적화하는 경우 "보이지 않는 텍스트의 깜박임(FOIT)"을 피하고 시스템 글꼴을 사용하여 즉시 사용자에게 콘텐츠를 표시하고 싶을 것입니다("스타일이 지정되지 않은 텍스트의 깜박임(FOUT)").

## 즉시 텍스트 표시

이 가이드에서는 이를 달성하는 두 가지 방법을 설명합니다. 첫 번째 접근 방식은 매우 간단하지만 범용 브라우저의 [지원](https://caniuse.com/#search=font-display)이 없습니다. 두 번째 접근 방식은 더 많은 작업이 필요하지만 전체 브라우저를 지원합니다. 가장 좋은 선택은 실제로 구현하고 유지 관리하는 것입니다.

## 옵션 #1: font-display 사용

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>이전</th>
        <th>이후</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>@font-face { font-family: Helvetica; }</code>
        </td>
        <td>
<code>@font-face { font-family: Helvetica; &lt;strong&gt;font-display: swap;&lt;/strong&gt; }</code>
        </td>
      </tr>
    </tbody>
  </table>
</div>

[`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display)는 글꼴이 표시되는 방식을 지정하기 위한 API입니다. `swap`은 글꼴을 사용하는 텍스트가 시스템 글꼴을 사용하여 즉시 표시되어야 함을 브라우저에 알립니다. 사용자 정의 글꼴이 준비되면 시스템 글꼴을 대체합니다.

브라우저가 `font-display`를 지원하지 않는 경우 브라우저는 글꼴 로드에 대한 기본 동작을 계속 따릅니다. [여기](https://caniuse.com/#search=font-display)에서 `font-display`를 지원하는 브라우저를 확인하세요.

다음은 일반 브라우저의 기본 글꼴 로드 동작입니다.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th><strong>브라우저</strong></th>
        <th><strong>글꼴이 준비되지 않은 경우 기본 동작...</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Edge</td>
        <td>글꼴이 준비될 때까지 시스템 글꼴을 사용합니다. 글꼴을 바꿉니다.</td>
      </tr>
      <tr>
        <td>Chrome</td>
        <td>최대 3초 동안 텍스트를 숨깁니다. 텍스트가 아직 준비되지 않은 경우 글꼴이 준비될 때까지 시스템 글꼴을 사용합니다. 글꼴을 바꿉니다.</td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>최대 3초 동안 텍스트를 숨깁니다. 텍스트가 아직 준비되지 않은 경우 글꼴이 준비될 때까지 시스템 글꼴을 사용합니다. 글꼴을 바꿉니다.</td>
      </tr>
      <tr>
        <td>Safari</td>
        <td>글꼴이 준비될 때까지 텍스트를 숨깁니다.</td>
      </tr>
    </tbody>
  </table>
</div>

## 옵션 #2: 사용자 정의 글꼴이 로드될 때까지 사용을 대기

조금만 더 노력하면 동일한 동작이 모든 브라우저에서 작동하도록 구현할 수 있습니다.

이 접근 방식은 세 부분으로 이루어져 있습니다.

- 초기 페이지 로드 시 사용자 정의 글꼴을 사용하지 않습니다. 이렇게 하면 브라우저가 시스템 글꼴을 사용하여 텍스트를 즉시 표시합니다.
- 사용자 글꼴이 로드되는 시기를 감지합니다. [FontFaceObserver](https://github.com/bramstein/fontfaceobserver) 라이브러리 덕분에 몇 줄의 JavaScript 코드만으로 이 작업을 수행할 수 있습니다.
- 사용자 정의 글꼴을 사용하도록 페이지 스타일을 업데이트합니다.

이를 구현하기 위한 예상 변경 사항은 다음과 같습니다.

- 초기 페이지 로드 시 사용자 정의 글꼴을 사용하지 않도록 CSS를 리팩터링합니다.
- 페이지에 스크립트를 추가합니다. 이 스크립트는 사용자 정의 글꼴이 로드되는 시기를 감지한 후 페이지 스타일을 업데이트합니다.

{% Aside 'codelab' %} [텍스트를 즉시 표시하려면 Font Face Observer를 사용하십시오.](/codelab-avoid-invisible-text) {% endAside %}

## 확인하기

Lighthouse를 실행하여 사이트에서 `font-display: swap`을 사용하여 텍스트를 표시하는지 확인합니다.

{% Instruction 'audit-performance', 'ol' %}

**webfont를 로드하는 동안 텍스트가 보이는 상태를 유지하는지 확인** 감사를 통과하는지 확인합니다.
