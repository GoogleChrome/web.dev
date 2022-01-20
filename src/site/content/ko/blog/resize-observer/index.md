---
title: 'ResizeObserver: 요소에 대한 document.onresize와 같음'
subhead: "'ResizeObserver'는 요소의 크기가 변경될 때 알려줍니다."
authors:
  - surma
  - joemedley
date: 2016-10-07
updated: 2020-05-26
hero: image/admin/WJ69aw9UMPwsc7ShYvif.jpg
alt: 상자에서 식물 재배.
description: |2

  'ResizeObserver'는 요소의 콘텐츠 사각형이 변경될 때 알려줍니다.

  그에 따라 대응할 수 있도록 크기를 조정합니다.
tags:
  - blog
  - dom
  - javascript
  - layout
  - rendering
feedback:
  - api
---

`ResizeObserver` 이전에는 문서의 `resize` 이벤트에 리스너를 연결하여 뷰포트의 치수 변경에 대한 알림을 받아야 했습니다. 그런 다음 이벤트 핸들러에서 해당 변경의 영향을 받은 요소를 파악하고 적절하게 대응하기 위해 특정 루틴을 호출해야 합니다. 크기 조정 후 요소의 새로운 차원을 필요로 하는 경우, `getBoundingClientRect()` 또는 `getComputedStyle()`를 호출해야 했으며, 그러면 *모든* 읽기와 *모든* 쓰기의 일괄 처리를 관리하지 않는 경우 레이아웃 스래싱이 발생할 수 있습니다.

이것은 메인 창의 크기를 조정하지 않고 요소의 크기를 변경하는 경우도 다루지 않았습니다. 예를 들어, 새 하위 요소를 추가하거나 요소의 `display` 스타일을 `none`으로 설정하거나 유사한 작업을 수행하면 요소, 동종 요소 또는 상위 요소의 크기가 변경될 수 있습니다.

이것이 `ResizeObserver`가 유용한 프리미티브인 이유입니다. 변화의 원인과 상관없이 관찰된 요소의 크기 변화에 반응합니다. 관찰된 요소의 새로운 크기에 대한 액세스도 제공합니다.

## API

`Observer` 접미사가 있는 모든 API는 간단한 API 디자인을 공유합니다. `ResizeObserver`도 예외는 아닙니다. `ResizeObserver` 객체를 만들고 콜백을 생성자에 전달합니다. 콜백에는 요소의 새 차원이 포함된 `ResizeObserverEntry` 개체 배열(관찰된 요소당 하나의 항목)이 전달됩니다.

```js
var ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    const cr = entry.contentRect;
    console.log('Element:', entry.target);
    console.log(`Element size: ${cr.width}px x ${cr.height}px`);
    console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
  }
});

// Observe one or multiple elements
ro.observe(someElement);
```

## 몇 가지 세부 사항

### 보고되는 내용은 무엇입니까?

일반적으로 [`ResizeObserverEntry`](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry) [`DOMRectReadOnly`](https://developer.mozilla.org/docs/Web/API/DOMRectReadOnly) 개체를 반환하는 `contentRect`라는 속성을 통해 요소의 콘텐츠 상자를 보고합니다. 콘텐츠 상자는 콘텐츠를 넣을 수 있는 상자입니다. 경계 상자에서 패딩을 뺀 값입니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CKxpe8LNq2CMPFdtLtVK.png", alt="CSS 상자 모델의 다이어그램입니다.", width="727", height="562" %}</figure>

이 때 `ResizeObserver`가 `contentRect`와 패딩의 치수를 모두 *보고*하는 반면, `contentRect`만을 *관찰*합니다. `contentRect`를 요소의 경계 상자와 혼동하지 *마십시오.* `getBoundingClientRect()` 의해 보고된 경계 상자는 전체 요소와 해당 하위 항목을 포함하는 상자입니다. `ResizeObserver`가 경계 상자의 크기를 보고하는 규칙의 예외입니다.

Chrome 84부터 `ResizeObserverEntry`에는 보다 자세한 정보를 제공하는 세 가지 새로운 속성이 있습니다. 이러한 속성 각각은 `blockSize` 속성과 `inlineSize` 속성을 포함하는 `ResizeObserverSize` 객체를 반환합니다. 이 정보는 콜백이 호출될 때 관찰된 요소에 대한 것입니다.

- `borderBoxSize`
- `contentBoxSize`
- `devicePixelContentBoxSize`

이러한 항목은 모두 읽기 전용 배열을 반환합니다. 미래에는 다중 열 시나리오에서 발생하는 여러 조각이 있는 요소를 지원할 수 있기를 기대하기 때문입니다. 현재로서는 이러한 배열에는 하나의 요소만 포함됩니다.

이러한 속성에 대한 플랫폼 지원은 제한적이지만 [Firefox는 이미 처음 두 가지를 지원](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry#Browser_compatibility)합니다.

### 보고 시기

이 사양은 `ResizeObserver`가 페인트 전과 레이아웃 후에 모든 크기 조정 이벤트를 처리해야 한다고 규정합니다. `ResizeObserver`의 콜백을 페이지 레이아웃 변경 이상적인 장소로 만듭니다. `ResizeObserver` 처리는 레이아웃과 페인트 사이에서 발생하기 때문에 그렇게 하면 페인트가 아닌 레이아웃만 무효화됩니다.

### 갓차

콜백 내부에서 관찰된 요소의 크기를 `ResizeObserver`로 변경하면 어떻게 될까요? 답은 바로 콜백에 대한 또 다른 호출을 트리거한다는 것입니다. 다행히 `ResizeObserver`에는 무한 콜백 루프와 순환 종속성을 방지하는 메커니즘이 있습니다. 크기가 조정된 요소가 이전 콜백에서 처리된 *가장 얕은* 요소보다 DOM 트리에서 더 깊은 경우 변경 사항은 동일한 프레임에서만 처리됩니다. 그렇지 않으면 다음 프레임으로 연기됩니다.

## 애플리케이션

`ResizeObserver`를 사용하여 수행할 수 있는 한 가지는 요소별 미디어 쿼리를 구현하는 것입니다. 요소를 관찰함으로써 디자인 중단점을 명령적으로 정의하고 요소의 스타일을 변경할 수 있습니다. 다음 [예](https://googlechrome.github.io/samples/resizeobserver/)에서 두 번째 상자는 너비에 따라 테두리 반경을 변경합니다.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/elem-mq_vp8.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/elem-mq_x264.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

```js
const ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    entry.target.style.borderRadius =
        Math.max(0, 250 - entry.contentRect.width) + 'px';
  }
});
// Only observe the second box
ro.observe(document.querySelector('.box:nth-child(2)'));
```

또 다른 흥미로운 예는 채팅 창입니다. 일반적인 위에서 아래로 대화 레이아웃에서 발생하는 문제는 스크롤 위치 지정입니다. 사용자를 혼란스럽게 하지 않으려면 창이 최신 메시지가 표시되는 대화 하단에 고정되어 있으면 도움이 됩니다. 또한 모든 종류의 레이아웃 변경(가로에서 세로로 또는 그 반대로 휴대폰을 생각하는 것)도 동일하게 달성해야 합니다.

`ResizeObserver`를 사용하면 *두* 시나리오를 모두 처리하는 *단일* 코드를 작성할 수 있습니다. 창 크기 조정은 `ResizeObserver`가 정의에 따라 캡처할 수 있지만, `appendChild()`를 호출하면 해당 요소의 크기도 조정됩니다(`overflow: hidden` 이 설정되지 않은 경우). 왜냐하면 새 요소를 위한 공간을 만들어야 하기 때문입니다. 이를 염두에 두고 원하는 효과를 얻는 데 몇 줄만 사용됩니다.

<figure>
 <video controls autoplay loop muted>
   <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/chat_vp8.webm" type="video/webm; codecs=vp8">
   <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/chat_x264.mp4" type="video/mp4; codecs=h264">
 </source></source></video></figure>

```js
const ro = new ResizeObserver(entries => {
  document.scrollingElement.scrollTop =
    document.scrollingElement.scrollHeight;
});

// Observe the scrollingElement for when the window gets resized
ro.observe(document.scrollingElement);
// Observe the timeline to process new messages
ro.observe(timeline);
```

꽤 깔끔하죠?

여기에서 사용자가 수동으로 위로 스크롤하고 새 메시지가 수신될 때 *해당* 메시지에 고정되도록 스크롤하려는 경우를 처리하기 위해 더 많은 코드를 추가할 수 있습니다.

또 다른 사용 사례는 자체 레이아웃을 수행하는 모든 종류의 사용자 정의 요소에 대한 것입니다. `ResizeObserver` 전까지는 하위 요소를 다시 배치할 수 있도록 치수가 변경될 때 알림을 받는 안정적인 방법이 없었습니다.

## 결론

`ResizeObserver`는 [대부분의 주요 브라우저](https://developer.mozilla.org/docs/Web/API/ResizeObserver#Browser_compatibility)에서 사용할 수 있습니다. 어떤 경우에는 가용성이 지원된 사례는 아주 최근입니다. [일부 polyfills이 가능하긴](https://github.com/WICG/ResizeObserver/issues/3) 하지만 완전히 `ResizeObserver`의 기능을 복제 할 수 없습니다. 현재 구현은 폴링 또는 DOM에 센티넬 요소 추가에 의존합니다. 전자는 CPU를 바쁘게 유지하여 모바일에서 배터리를 소모하는 반면 후자는 DOM을 수정하고 스타일 및 기타 DOM 의존 코드를 엉망으로 만들 수 있습니다.

사진 제공: [Unsplash](https://unsplash.com/@markusspiske?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)에서 [Markus Spiske](https://unsplash.com/s/photos/observe-growth?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
