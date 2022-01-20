---
title: HTML5 드래그 앤 드롭 API 사용
authors:
  - ericbidelman
  - rachelandrew
date: 2010-09-30
updated: 2021-08-30
description: |-
  HTML5 DnD(드래그 앤 드롭) API는
  페이지의 거의 모든 요소를 드래그할 수 있음을 의미합니다. 이 게시물에서는 드래그 앤 드롭의 기본 사항에 대해 설명합니다.
tags:
  - blog
  - html
  - javascript
  - file-system
---

HTML5 DnD(드래그 앤 드롭) API는<br>페이지의 거의 모든 요소를 드래그할 수 있음을 의미합니다. 이 게시물에서는 드래그 앤 드롭의 기본 사항에 대해 설명합니다.

## 드래그 가능한 콘텐츠 만들기

대부분의 브라우저에서 텍스트 선택, 이미지 및 링크는 기본적으로 드래그할 수 있습니다. 예를 들어 [Google Search](https://google.com)에서 Google 로고를 드래그하면 고스트 이미지가 표시됩니다. 그다음 이미지가 주소 표시줄, `<input type="file" />` 요소 또는 바탕 화면에 놓일 수 있습니다. 다른 유형의 콘텐츠를 드래그 가능하게 만들려면 HTML5 DnD API를 사용해야 합니다.

개체를 드래그 가능하게 만들려면 해당 요소에서 `draggable=true`를 설정하십시오. 페이지의 이미지, 파일, 링크, 파일 또는 마크업 등 거의 모든 것을 드래그할 수 있습니다.

이 예에서는 CSS 그리드로 배치된 일부 열을 재정렬하는 인터페이스를 만들고 있습니다. 내 열의 기본 마크업은 다음과 같습니다. 각 열에는 `true`로 설정된 `draggable` 속성이 있습니다.

```html
<div class="container">
  <div draggable="true" class="box">A</div>
  <div draggable="true" class="box">B</div>
  <div draggable="true" class="box">C</div>
</div>
```

내 컨테이너 및 상자 요소에 대한 CSS는 다음과 같습니다. DnD 기능과 관련된 유일한 CSS는 [`cursor: move`](https://developer.mozilla.org/docs/Web/CSS/cursor) 속성입니다. 나머지 코드는 컨테이너 및 상자 요소의 레이아웃과 스타일을 제어합니다.

```css/11
.container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.box {
  border: 3px solid #666;
  background-color: #ddd;
  border-radius: .5em;
  padding: 10px;
  cursor: move;
}
```

이 시점에서 항목을 드래그할 수 있지만 다른 일은 일어나지 않습니다. DnD 기능을 추가하려면 JavaScript API를 사용해야 합니다.

## 드래그 이벤트 수신 대기

전체 드래그 앤 드롭 프로세스를 모니터링하기 위해 연결할 수 있는 다양한 이벤트가 있습니다.

- [`dragstart`](https://developer.mozilla.org/docs/Web/API/Document/dragstart_event)
- [`drag`](https://developer.mozilla.org/docs/Web/API/Document/drag_event)
- [`dragenter`](https://developer.mozilla.org/docs/Web/API/Document/dragenter_event)
- [`dragleave`](https://developer.mozilla.org/docs/Web/API/Document/dragleave_event)
- [`dragover`](https://developer.mozilla.org/docs/Web/API/Document/dragover_event)
- [`drop`](https://developer.mozilla.org/docs/Web/API/Document/drop_event)
- [`dragend`](https://developer.mozilla.org/docs/Web/API/Document/dragend_event)

DnD 흐름을 처리하려면 일종의 소스 요소(드래그가 시작되는 위치), 데이터 페이로드(드롭하려는 대상) 및 대상(드롭 캐치 영역)이 필요합니다. 소스 요소는 이미지, 목록, 링크, 파일 개체, HTML 블록 등이 될 수 있습니다. 대상은 사용자가 드롭하려는 데이터를 허용하는 드롭 영역(또는 드롭 영역 집합)입니다. 모든 요소가 대상이 될 수 있는 것은 아닙니다. 예를 들어 이미지는 대상이 될 수 없습니다.

## 드래그 앤 드롭 시퀀스 시작 및 종료

콘텐츠에서 `draggable="true"` 속성을 정의하면 `dragstart` 이벤트 핸들러를 연결하여 각 열에 대한 DnD 시퀀스를 시작합니다.

이 코드는 사용자가 드래그를 시작할 때 열의 불투명도를 40%로 설정하고 드래그 이벤트가 끝나면 100%로 되돌립니다.

```js
function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });
```

결과는 아래 Glitch 데모에서 볼 수 있습니다. 항목을 드래그하면 불투명해집니다. `dragstart` 이벤트의 대상이 소스 요소이므로 `this.style.opacity`를 40%로 설정하면 사용자에게 요소가 이동 중인 현재 선택 항목이라는 시각적 피드백을 제공합니다. 항목을 놓으면 드롭 기능이 제자리에 있지 않아도 소스 요소가 100% 불투명 상태로 되돌아갑니다.

% Glitch { id: 'simple-drag-and-drop-1', path: 'style.css' } %}

## `dragenter`, `dragover` 및 `dragleave`로 시각적 신호 추가

사용자가 인터페이스와 상호 작용하는 방법을 이해하는 데 도움이 되도록 `dragenter`, `dragover` 및 `dragleave` 이벤트 핸들러를 사용하십시오. 이 예에서 열은 드래그 가능할 뿐만 아니라 드롭 대상이기도 합니다. 드래그한 항목을 열 위에 고정할 때 테두리를 파선으로 만들어 사용자가 이해할 수 있도록 지원합니다. 예를 들어 CSS에서 드롭 대상인 요소를 나타내는 `over` 클래스를 만들 수 있습니다.

```css
.box.over {
  border: 3px dotted #666;
}
```

그다음, JavaScript에서 이벤트 핸들러를 설정하고 열을 드래그할 때 `over` 클래스를 추가하고 떠날 때 이를 삭제합니다. `dragend` 핸들러에서 드래그가 끝날 때 클래스를 제거해야 합니다.

```js/9-11,14-28,34-36
document.addEventListener('DOMContentLoaded', (event) => {

  function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';

    items.forEach(function (item) {
      item.classList.remove('over');
    });
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
});
```

{% Glitch { id: 'simple-drag-drop2', path: 'dnd.js' } %}

이 코드에서 다룰 가치가 있는 몇 가지 사항이 있습니다.

- 링크와 같은 것을 드래그할 경우 해당 링크로 이동하는 브라우저의 기본 동작을 방지해야 합니다. 이렇게 하려면 `dragover` 이벤트에서 `e.preventDefault()`를 호출합니다. 또 다른 좋은 방법은 동일한 핸들러에서 `false`를 반환하는 것입니다.
- `dragenter` 이벤트는 `dragover` 대신 `over` 클래스를 토글하는 데 사용됩니다. `dragover`를 사용하는 경우, `dragover` 이벤트가 열 호버링에서 계속 실행됨에 따라 CSS 클래스가 여러 번 토글됩니다. 궁극적으로 이는 바탕 화면의 렌더러가 많은 양의 불필요한 작업을 수행하도록 합니다. 다시 그리기를 최소화하는 것은 항상 좋은 생각입니다. 무언가에 대해 `dragover` 이벤트를 사용해야 하는 경우, [이벤트 리스너를 조절하거나 디바운싱는 것](https://css-tricks.com/debouncing-throttling-explained-examples/)을 고려하십시오.

## 드롭 완료

실제 드롭 작업을 진행하려면 `drop` 이벤트에 대한 이벤트 리스너를 추가하십시오. `drop` 핸들러에서는 일반적으로 일종의 성가신 리디렉션인 드롭에 대한 브라우저의 기본 동작을 방지해야 합니다. `e.stopPropagation()`을 호출하여 이벤트가 DOM을 버블링하는 것을 방지할 수 있습니다.

```js
function handleDrop(e) {
  e.stopPropagation(); // stops the browser from redirecting.
  return false;
}
```

다른 핸들러 사이에 새 핸들러를 등록해야 합니다.

```js/7-7
  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
```

이 시점에서 코드를 실행하면 항목이 새 위치로 드롭되지 않습니다. 이를 위해서는 [`DataTransfer`](https://developer.mozilla.org/docs/Web/API/DataTransfer) 개체를 사용해야 합니다.

`dataTransfer` 속성은 모든 DnD 마술이 일어나는 곳입니다. 드래그 동작으로 전송된 데이터 조각을 보유합니다. `dataTransfer`는 `dragstart` 이벤트에서 설정되고 드롭 이벤트에서 판독/처리됩니다. `e.dataTransfer.setData(mimeType, dataPayload)`를 호출하면 개체의 MIME 유형과 데이터 페이로드를 설정할 수 있습니다.

이 예에서는 사용자가 열의 순서를 다시 정렬할 수 있도록 합니다. 이를 위해 먼저 드래그가 시작될 때 소스 요소의 HTML을 저장해야 합니다.

  <figure>
    <video controls autoplay loop muted>
      <source src="https://storage.googleapis.com/web-dev-assets/drag-and-drop/webdev-dnd.mp4" type="video/mp4">
    </source></video>
  </figure>

```js/3-6
function handleDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}
```

`drop` 이벤트에서 열 드롭을 처리하고 원본 열의 HTML을 사용자가 드롭한 대상 열의 HTML로 설정한 후 먼저 사용자가 드래그한 열과 동일한 열로 드롭하지 않는지 확인합니다.

```js/5-8
function handleDrop(e) {
  e.stopPropagation();

  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  return false;
}
```

다음 데모에서 결과를 볼 수 있습니다. B 열 위에 A 열을 끌어다 놓으면 위치가 어떻게 변경되는지 확인할 수 있습니다.

{% Glitch { id: 'simple-drag-drop', path: 'dnd.js' } %}

## 더 많은 드래그 속성

`dataTransfer` 개체는 속성을 노출하여 드래그 프로세스 동안 사용자에게 시각적 피드백을 제공합니다. 이러한 속성을 사용하여 각 드롭 대상이 특정 데이터 유형에 반응하는 방식을 제어할 수 있습니다.

- [`dataTransfer.effectAllowed`](https://developer.mozilla.org/docs/Web/API/DataTransfer/effectAllowed)는 사용자가 요소에서 수행할 수 있는 '드래그 유형'을 제한합니다. 드래그 앤 드롭 처리 모델에서 `dragenter` 및 `dragover` 이벤트 동안 `dropEffect`를 초기화하는 데 사용됩니다. 속성은 `none`, `copy`, `copyLink`, `copyMove`, `link`, `linkMove`, `move`, `all` 및 `uninitialized` 값으로 설정할 수 있습니다.
- [`dataTransfer.dropEffect`](https://developer.mozilla.org/docs/Web/API/DataTransfer/dropEffect)는 `dragenter` 및 `dragover` 이벤트 동안 사용자에게 제공되는 피드백을 제어합니다. 사용자가 대상 요소 위로 마우스를 가져가면 브라우저의 커서가 어떤 유형의 작업(예: 복사, 이동 등)을 수행할 것인지 나타냅니다. `none`, `copy`, `link`, `move` 값 중 하나에 효과가 나타날 수 있습니다.
- [`e.dataTransfer.setDragImage(imgElement, x, y)`](https://developer.mozilla.org/docs/Web/API/DataTransfer/setDragImage)는 브라우저의 기본 '고스트 이미지' 피드백을 사용하는 대신 선택적으로 드래그 아이콘을 설정할 수 있음을 의미합니다.

## 드래그 앤 드롭으로 파일 업로드

이 간단한 예에서는 열을 드래그 소스와 드래그 대상으로 사용합니다. 이는 사용자에게 항목을 다시 정렬하라고 요청하는 UI에 표시될 수 있습니다. 이러한 상황에서, 사용자가 선택한 이미지를 대상으로 드래그하여 제품에 대한 메인 이미지가 되도록 하나의 이미지를 선택해야 하는 인터페이스 같이 드래그 대상과 소스가 다를 수 있습니다.

드래그 앤 드롭은 사용자가 데스크탑에서 응용 프로그램으로 항목을 드래그하는 데 자주 사용됩니다. 주요 차이점은 `drop` 핸들러에 있습니다. `dataTransfer.getData()`를 사용하여 파일에 액세스하는 대신 데이터가 `dataTransfer.files` 속성에 포함됩니다.

```js
function handleDrop(e) {
  e.stopPropagation(); // Stops some browsers from redirecting.
  e.preventDefault();

  var files = e.dataTransfer.files;
  for (var i = 0, f; f = files[i]; i++) {
    // Read the File objects in this FileList.
  }
}
```

[드래그 앤 드롭 사용자 정의](/read-files/#select-dnd)에서 이에 대한 자세한 정보를 확인할 수 있습니다.

## 추가 리소스

- [드래그 앤 드롭 사양](https://html.spec.whatwg.org/multipage/dnd.html#dnd)
- [MDN HTML 드래그 앤 드롭 API](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)
- [Vanilla JavaScript로 드래그 앤 드롭 파일 업로더를 만드는 방법](https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/)
- [HTML 드래그 앤 드롭 API로 주차 게임 만들기](https://css-tricks.com/creating-a-parking-game-with-the-html-drag-and-drop-api/)
- [React에서 HTML 드래그 앤 드롭 API를 사용하는 방법](https://www.smashingmagazine.com/2020/02/html-drag-drop-api-react/)
