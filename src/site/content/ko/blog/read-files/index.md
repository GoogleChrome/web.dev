---
title: JavaScript에서 파일 읽기
subhead: 파일 선택, 파일 메타데이터 및 콘텐츠 읽기, 읽기 진행률 모니터링 방법.
description: |2-

  파일 선택, 파일 메타데이터 및 콘텐츠 읽기, 읽기 진행률 모니터링을 수행하는 방법.
date: 2010-06-18
updated: 2021-03-29
authors:
  - kaycebasques
  - petelepage
  - thomassteiner
tags:
  - blog
  - storage
---

웹에서 가장 일반적으로 사용되는 기능 중 하나로, 사용자는 자신의 로컬 장치에서 파일을 선택하고 상호 작용할 수 있습니다. 이를 통해 사용자는 파일을 선택하여 서버에 업로드할 수 있습니다(예: 사진 업로드 또는 세금 문서 제출 등). 그러나 사이트에서 네트워크를 통해 데이터를 전송할 필요 없이 파일을 읽고 조작할 수도 있습니다.

## 최신 파일 시스템 액세스 API

파일 시스템 액세스 API는 사용자의 로컬 시스템에 있는 파일과 디렉토리를 읽고 쓸 수 있는 간편한 방법을 제공합니다. 이는 현재 Chrome 또는 Edge와 같은 대부분의 Chromium 파생 브라우저에서 사용할 수 있습니다. 자세한 내용은 [파일 시스템 액세스 API](/file-system-access/) 문서를 참조하세요.

파일 시스템 액세스 API는 아직 모든 브라우저와 호환되지 않기 때문에 새로운 API를 사용할 수 있는 곳이라면 어디에서나 사용하지만 그렇지 않은 경우에는 레거시 접근 방식으로 대체하는 도우미 라이브러리인 [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access)를 확인해 보세요.

## 파일 작업, 고전적인 방식

이 가이드에서는 다음을 수행하는 방법을 보여줍니다.

- 파일 선택
    - [HTML 입력 요소 사용](#select-input)
    - [끌어서 놓기 영역 사용](#select-dnd)
- [파일 메타데이터 읽기](#read-metadata)
- [파일 내용 읽기](#read-content)

## 파일 선택 {: #select }

### HTML 입력 요소 {: #select-input }

사용자가 파일을 선택할 수 있도록 하는 가장 쉬운 방법은 모든 주요 브라우저에서 지원되는 `<input type="file">` 요소를 사용하는 것입니다. 이를 클릭하면 사용자가 운영 체제의 내장 파일 선택 UI를 사용하여 하나의 파일, 또는 [`multiple`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Additional_attributes) 속성이 포함된 경우 여러 파일을 선택할 수 있습니다. 사용자가 하나 또는 여러 파일의 선택을 마치면 이 요소의 `change` 이벤트가 시작됩니다. [`FileList`](https://developer.mozilla.org/docs/Web/API/FileList) 객체인 `event.target.files`에서 파일 목록에 액세스할 수 있습니다. `FileList`의 각 항목은 [`File`](https://developer.mozilla.org/docs/Web/API/File) 객체입니다.

```html
<!-- The `multiple` attribute lets users select multiple files. -->
<input type="file" id="file-selector" multiple>
<script>
  const fileSelector = document.getElementById('file-selector');
  fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
  });
</script>
```

{% Aside %} [`window.showOpenFilePicker()`](/file-system-access/#ask-the-user-to-pick-a-file-to-read) 메서드가 해당 사용 사례에 효과적인 대안인지 확인하세요. 읽기와 별도로 파일에 다시 쓸 수 있도록 파일 핸들도 제공하기 때문입니다. 이 메서드는 [폴리필](https://github.com/GoogleChromeLabs/browser-fs-access#opening-files)할 수 있습니다. {% endAside %}

이 예에서는 사용자가 운영 체제의 내장 파일 선택 UI를 사용하여 여러 파일을 선택한 다음 선택한 각 파일을 콘솔에 기록할 수 있습니다.

{% Glitch { id: 'input-type-file', height: 480 } %}

#### 사용자가 선택할 수 있는 파일 유형 제한 {: #accept }

경우에 따라 사용자가 선택할 수 있는 파일 유형을 제한해야 할 수 있습니다. 예를 들어 이미지 편집 앱은 텍스트 파일이 아닌 이미지만 허용해야 합니다. 이를 위해 입력 요소에 [`accept`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Additional_attributes) 속성을 추가하여 어떤 파일이 허용되는지 지정할 수 있습니다.

```html
<input type="file" id="file-selector" accept=".jpg, .jpeg, .png">
```

### 사용자 지정 드래그 앤 드롭 {: #select-dnd }

일부 브라우저에서 `<input type="file">` 요소는 사용자가 파일을 앱으로 끌어다 놓을 수 있도록 하는 드롭 대상이기도 합니다. 그러나 드롭 대상이 작아 사용하기 어려울 수 있습니다. 그래서, `<input type="file">` 요소를 사용하여 핵심 기능을 제공한 후에는 큰 사용자 지정 끌어서 놓기 표면을 제공할 수 있습니다.

{% Aside %} [`DataTransferItem.getAsFileSystemHandle()`](/file-system-access/#drag-and-drop-integration) 메서드가 해당 사용 사례에 효과적인 대안인지 확인하세요. 읽기와 별도로 파일에 다시 쓸 수 있도록 파일 핸들도 제공하기 때문입니다. {% endAside %}

#### 드롭 영역 선택 {: #choose-drop-zone }

드롭 표면은 애플리케이션의 디자인에 따라 다릅니다. 창의 일부만 드롭 표면이 되도록 하거나 잠재적으로 전체 창을 드롭 표면으로 원할 수 있습니다.

<figure>   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xX8UXdqkLmZXu3Ad1Z2q.png", alt="이미지 압축 웹 앱인 Squoosh의 스크린샷.", width="800", height="589" %}   <figcaption>     Squoosh는 전체 창을 드롭 영역으로 만듭니다.   </figcaption></figure>

Squoosh를 사용하면 사용자가 창의 아무 곳이나 이미지를 끌어다 놓을 수 있으며 **이미지 선택**을 클릭하면 `<input type="file">` 요소가 호출됩니다. 드롭 영역으로 무엇을 선택하든 사용자가 파일을 해당 표면으로 끌어다 놓을 수 있다는 점을 분명히 알도록 해야 합니다.

#### 드롭 영역 정의 {: #define-drop-zone }

요소를 드래그 앤 드롭 영역으로 설정하려면 [`dragover`](https://developer.mozilla.org/docs/Web/API/Document/dragover_event) 및 [`drop`](https://developer.mozilla.org/docs/Web/API/Document/drop_event)이라는 두 가지 이벤트에 수신 대기해야 합니다. `dragover` 이벤트는 드래그 앤 드롭 작업으로 파일 복사본이 만들어진다는 것을 시각적으로 나타내도록 브라우저 UI를 업데이트합니다. `drop` 이벤트는 사용자가 파일을 표면에 놓은 후에 시작됩니다. 입력 요소와 유사하게 [`FileList`](https://developer.mozilla.org/docs/Web/API/FileList) 객체인 `event.dataTransfer.files`에서 파일 목록에 액세스할 수 있습니다. `FileList`의 각 항목은 [`File`](https://developer.mozilla.org/docs/Web/API/File) 객체입니다.

```js
const dropArea = document.getElementById('drop-area');

dropArea.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', (event) => {
  event.stopPropagation();
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  console.log(fileList);
});
```

[`event.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) 및 [`event.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault)는 브라우저의 기본 동작이 발생하지 않도록 하고 대신 코드가 실행되도록 합니다. 그렇지 않으면 브라우저가 페이지에서 벗어나 사용자가 브라우저 창에 놓은 파일을 열게 됩니다.

{# 이 예제는 임베드로 작동하지 않습니다. #}

라이브 데모를 보려면 [사용자 지정 드래그 앤 드롭](https://custom-drag-and-drop.glitch.me/)을 확인하세요.

### 디렉토리는 어떻습니까? {: #directories }

불행히도 현재 디렉토리에 액세스할 수 있는 좋은 방법은 없습니다.

`<input type="file">` 요소의 [`webkitdirectory`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/webkitdirectory) 속성을 사용하면 사용자가 디렉토리를 선택할 수 있습니다. 일부 Chromium 기반 브라우저 및 데스크톱 Safari에서는 지원되지만 브라우저 호환성에 대한 [상충되는](https://caniuse.com/#search=webkitdirectory) 보고가 있습니다.

{% Aside %} [`window.showDirectoryPicker()`](/file-system-access/#opening-a-directory-and-enumerating-its-contents) 메서드가 해당 사용 사례에 효과적인 대안인지 확인하세요. 읽기와 별도로 디렉토리에 다시 쓸 수 있도록 디렉토리 핸들도 제공하기 때문입니다. 이 메서드는 [폴리필](https://github.com/GoogleChromeLabs/browser-fs-access#opening-directories)할 수 있습니다. {% endAside %}

드래그 앤 드롭이 활성화된 경우 사용자는 드롭 영역에 디렉토리를 끌어가려고 할 수 있습니다. 드롭 이벤트가 발생하면 여기에 디렉토리에 대한 `File` 객체가 포함되지만 디렉토리 내의 어떤 파일에도 액세스할 수 없습니다.

## 파일 메타데이터 읽기 {: #read-metadata }

[`File`](https://developer.mozilla.org/docs/Web/API/File) 객체에는 파일에 관한 여러 메타데이터 속성이 포함되어 있습니다. 대부분의 브라우저는 파일 이름, 파일 크기 및 MIME 유형을 제공하지만 플랫폼에 따라 브라우저마다 다르거나 추가적인 정보를 제공할 수 있습니다.

```js
function getMetadataForFileList(fileList) {
  for (const file of fileList) {
    // Not supported in Safari for iOS.
    const name = file.name ? file.name : 'NOT SUPPORTED';
    // Not supported in Firefox for Android or Opera for Android.
    const type = file.type ? file.type : 'NOT SUPPORTED';
    // Unknown cross-browser support.
    const size = file.size ? file.size : 'NOT SUPPORTED';
    console.log({file, name, type, size});
  }
}
```

[`input-type-file`](https://input-type-file.glitch.me/) Glitch 데모에서 실제 작동하는 모습을 볼 수 있습니다.

## 파일 내용 읽기 {: #read-content }

파일을 읽으려면 [`FileReader`](https://developer.mozilla.org/docs/Web/API/FileReader)를 사용하세요. 그러면 `File` 객체의 콘텐츠를 메모리로 읽을 수 있습니다. 파일을 [배열 버퍼](https://developer.mozilla.org/docs/Web/API/FileReader/readAsArrayBuffer), [데이터 URL](https://developer.mozilla.org/docs/Web/API/FileReader/readAsDataURL) 또는 [텍스트](https://developer.mozilla.org/docs/Web/API/FileReader/readAsText)로 읽도록 `FileReader`에 지시할 수 있습니다.

```js
function readImage(file) {
  // Check if the file is an image.
  if (file.type && !file.type.startsWith('image/')) {
    console.log('File is not an image.', file.type, file);
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    img.src = event.target.result;
  });
  reader.readAsDataURL(file);
}
```

위의 예는 사용자가 제공한 `File`을 읽어 데이터 URL로 변환하고 해당 데이터 URL을 사용하여 `img` 요소에 이미지를 표시합니다. 사용자가 이미지 파일을 선택했는지 확인하는 방법을 보려면 [`read-image-file`](https://read-image-file.glitch.me/) Glitch를 살펴보세요.

{% Glitch { id: 'read-image-file', height: 480 } %}

### 파일 읽기 진행률 모니터링 {: #monitor-progress }

대용량 파일을 읽을 때 읽기 진행 정도를 나타내는 UX를 제공하면 도움이 될 수 있습니다. 이를 위해 `FileReader`에서 제공하는 [`progress`](https://developer.mozilla.org/docs/Web/API/FileReader/progress_event) 이벤트를 사용합니다. `progress` 이벤트는 두 가지 속성, 즉 읽은 양인 `loaded`와 읽어야 할 총량인 `total`을 제공합니다.

```js/7-12
function readFile(file) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const result = event.target.result;
    // Do something with result
  });

  reader.addEventListener('progress', (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`Progress: ${Math.round(percent)}`);
    }
  });
  reader.readAsDataURL(file);
}
```

[Unsplash](https://unsplash.com/photos/bv_rJXpNU9I)의 Vincent Botta 제공 영웅 이미지
