---
title: 선택적 글꼴 사전 로드로 레이아웃 이동 및 보이지 않는 텍스트의 깜박임(FOIT) 방지
subhead: 'Chrome 83부터 link rel="preload" 및 font-display:  optional을 결합하여 레이아웃 버벅거림을 완전히 제거할 수 있습니다.'
authors:
  - houssein
date: 2020-03-18
hero: image/admin/wv5DLtYiAhHm4lNemN1E.jpg
alt: 흰 탁자 위에 놓인 활자 세트의 큰 문자 A.
description: "Chrome 83은 렌더링 주기를 최적화하여 선택적 글꼴을 사전 로드할 때 레이아웃 이동을 없앱니다. \n<link rel=\"preload\">를 font-display: optional과 결합하는 것은 사용자 정의 글꼴의 버벅거림 없는 렌더링을 보장하는 가장 효과적인 방법입니다."
tags:
  - blog
  - performance
  - fonts
feedback:
  - api
---

{% Aside %} Chrome 83에서는 선택적 글꼴이 사전 로드될 때 레이아웃 이동 및 FOIT(보이지 않는 텍스트) 깜박임을 완전히 없애기 위해 새로운 글꼴 로드 기능이 개선되었습니다. {% endAside %}

Chrome 83은 렌더링 주기를 최적화하여 선택적 글꼴을 사전 로드할 때 레이아웃 이동을 없앱니다. `<link rel="preload">`를 `font-display: optional`과 결합하는 것은 사용자 정의 글꼴의 버벅거림 없는렌더링을 보장하는 가장 효과적인 방법입니다.

## 브라우저 호환성 {: #compatibility }

최신 교차 브라우저 지원 정보는 다음과 같은 MDN의 데이터를 확인하세요.

- [`<link rel="preload">`](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility)
- [`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#Browser_compatibility)

## 글꼴 렌더링

레이아웃 이동 또는 재레이아웃은 웹 페이지의 리소스가 동적으로 변경되어 콘텐츠가 "이동"할 때 발생합니다. 웹 글꼴을 가져오고 렌더링 하면 다음 두 가지 방법 중 하나로 레이아웃이 바로 이동할 수 있습니다.

- 폴백 글꼴이 새 글꼴로 바뀝니다("스타일이 지정되지 않은 텍스트 깜박임")
- "보이지 않는" 텍스트는 새 글꼴이 페이지에 렌더링될 때까지 표시됩니다("보이지 않는 텍스트 플래시").

CSS [`font-display`](https://font-display.glitch.me/) 속성은 다양한 범위의 값 (`auto`, `block`, `swap`, `fallback` 및 `optional` )을 통해 사용자 정의 글꼴의 렌더링 동작을 수정하는 방법을 제공합니다. 사용할 값을 선택하는 것은 비동기적으로 로드된 글꼴의 기본 동작에 따라 다릅니다. 그러나 지원되는 이러한 모든 값은 지금까지 위에 나열된 두 가지 방법 중 하나로 레이아웃을 다시 트리거 할 수 있습니다!

{% Aside %} [누적 레이아웃 이동](/cls/) 측정 항목을 사용하면 웹페이지의 레이아웃 불안정성을 측정할 수 있습니다. {% endAside %}

## 선택적 글꼴

`font-display` 속성은 세 가지 기간의 타임라인을 사용하여 렌더링 되기 전에 다운로드해야 하는 글꼴을 처리합니다.

- **차단:** "보이지 않는" 텍스트를 렌더링하지만 로드가 완료되는 즉시 웹 글꼴로 전환합니다.
- **교체:** 폴백 시스템 글꼴을 사용하여 텍스트를 렌더링하지만 로드가 완료되는 즉시 웹 글꼴로 전환합니다.
- **실패:** 폴백 시스템 글꼴을 사용하여 텍스트를 렌더링합니다.

이전에 `font-display: optional`로 지정된 글꼴에는 100ms의 차단 기간이 있고 교체 기간이 없었습니다. 이는 "보이지 않는" 텍스트가 폴백 글꼴로 전환되기 전에 매우 짧게 표시되는 것을 의미합니다. 글꼴이 100ms 이내에 다운로드되지 않으면 폴백 글꼴이 사용되며 폴백이 발생하지 않습니다.

<figure>{% Img src="image/admin/WHLORYEu864QRRveFQUz.png", alt="글꼴 로드 실패 시 이전 선택적 글꼴 동작을 보여주는 다이어그램", width="800", height="340" %}<figcaption> 100ms 차단 기간 <b>이후</b> 글꼴을 다운로드할 때 Chrome에서 이전 <code>font-display: optional</code> 동작 </figcaption></figure>

단, 100ms의 차단 기간이 끝나기 전에 글꼴을 다운로드 한 경우, 사용자 정의 글꼴을 렌더링하여 페이지에 사용합니다.

<figure>{% Img src="image/admin/mordYRjmCCDtlMcNXEOU.png", alt="글꼴이 제시간에 로드될 때 이전 선택적 글꼴 동작을 보여주는 다이어그램", width="800", height="318" %}<figcaption> 100ms 차단 기간 <b>이전</b> 글꼴을 다운로드할 때 Chrome에서 이전 <code>font-display: optional</code> 동작</figcaption></figure>

Chrome은 폴백 글꼴이 사용되는지나 맞춤 글꼴이 제시간에 로드를 완료하는지에 관계없이 두 경우 모두에서 페이지를 **두 번** 다시 렌더링합니다. 이에 따라 보이지 않는 텍스트가 약간 깜박이고 새 글꼴이 렌더링 되는 경우 페이지 내용의 일부를 옮기는 레이아웃 버벅거림이 발생합니다. 이는 글꼴이 브라우저의 디스크 캐시에 저장되어 있고 차단 기간이 완료되기 전에 로드될 수 있는 경우에도 발생합니다.

[`<link rel="preload'>`](/codelab-preload-web-fonts/)로 미리 로드된 선택적 글꼴의 첫 번째 렌더링 주기를 완전히 없애기 위해 Chrome 83에 [최적화](https://bugs.chromium.org/p/chromium/issues/detail?id=1040632)가 적용되었습니다. 대신 맞춤 글꼴 로드가 완료되거나 일정 시간이 경과할 때까지 렌더링이 차단됩니다. 이 시간 초과 기간은 현재 100ms로 설정되어 있지만 성능을 최적화하기 위해 가까운 시일 내에 변경될 수 있습니다.

<figure>{% Img src="image/admin/zLldiq9J3duBTaeRN88e.png", alt="글꼴 로드 실패 시 새로운 미리 로드된 선택적 글꼴 동작을 보여주는 다이어그램", width="800", height="353" %} <figcaption> 글꼴이 미리 로드되고 100ms 차단 기간(보이지 않는 텍스트의 깜박임 없음) <b>이후</b> 글꼴이 다운로드될 때 Chrome에서 <figcaption> 새로운 <code>font-display: optional</code> 동작 </figcaption></figcaption></figure>

<figure>{% Img src="image/admin/OEHClGFMFspaWjb3xXLY.png", alt="글꼴이 제시간에 로드될 때 미리 로드된 선택적 글꼴 동작을 보여주는 다이어그램", width="800", height="346" %}<figcaption> 100ms 차단 기간(보이지 않는 텍스트의 플래시 없음) <b>이전</b> 글꼴이 미리 로드되고 글꼴을 다운로드할 때 Chrome에서 새로운 <code>font-display: optional</code> 동작</figcaption></figure>

Chrome에서 선택적 글꼴을 미리 로드하면 레이아웃이 버벅거릴 가능성과 스타일이 지정되지 않은 텍스트의 깜박임이 없어집니다. 이것은 [CSS Fonts Module Level 4](https://drafts.csswg.org/css-fonts-4/#valdef-font-face-font-display-optional)에 지정된 필수 동작과 일치합니다. 선택적 글꼴은 레이아웃이 다시 발생하지 않도록 해야 하고 사용자 에이전트는 대신 적절한 시간 동안 렌더링을 지연할 수 있습니다.

선택적 글꼴을 미리 로드할 필요는 없지만, 특히 브라우저의 캐시에 선택적 글꼴이 아직 저장되지 않은 경우 첫 번째 렌더링 주기 전에 로드할 가능성이 매우 높아집니다.

## 결론

Chrome 팀은 이러한 새로운 최적화가 적용된 선택적 글꼴을 미리 로드한 경험을 듣고 싶습니다! 문제가 발생하거나 기능 제안을 삭제하려면 [문제](https://bugs.chromium.org/p/chromium/issues/entry)를 알리세요.
