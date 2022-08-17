---
title: 클립보드 액세스 차단 해제
subhead: 텍스트 및 이미지에 대한 더 안전하고 차단되지 않은 클립보드 액세스
authors:
  - developit
  - thomassteiner
description: Async Clipboard API는 사용 권한이 있는 복사 및 붙여넣기를 단순화합니다.
date: 2020-07-31
updated: 2021-07-29
tags:
  - blog
  - capabilities
hero: image/admin/aA9eqo0ZZNHFcFJGUGQs.jpg
alt: 쇼핑 목록이 있는 클립보드
feedback:
  - api
---

지난 몇 년 동안 브라우저는 클립보드 상호 작용에 [`document.execCommand()`](https://developers.google.com/web/updates/2015/04/cut-and-copy-commands)를 사용했습니다. 널리 지원되기는 하지만 이 잘라내어 붙여넣는 방법에는 대가가 필요했습니다. 즉, 클립보드 액세스는 동기식이었고 DOM을 읽고 쓸 수만 있었습니다.

소량의 텍스트라면 문제가 없겠지만 클립보드 전송을 위해 페이지를 차단할 때 문제를 겪는 경우가 많습니다. 콘텐츠를 안전하게 붙여넣으려면 시간이 많이 소요되는 삭제 또는 이미지 디코딩이 필요할 수 있습니다. 브라우저는 붙여넣은 문서에서 연결된 리소스를 로드하거나 인라인 처리해야 할 수 있습니다. 그러면 디스크나 네트워크에 대기하는 동안 페이지가 차단됩니다. 브라우저가 클립보드 액세스를 요청하는 동안 페이지를 차단하도록 요구하는 권한이 여기에 추가된다고 상상해 보세요. 동시에, 클립보드 상호작용을 위해 `document.execCommand()` 주변에 배치된 권한은 느슨하게 정의되며 브라우저마다 다릅니다.

[Async Clipboard API](https://www.w3.org/TR/clipboard-apis/#async-clipboard-api)는 페이지를 차단하지 않는 잘 정의된 권한 모델을 제공하여 이러한 문제를 해결합니다. Safari는 최근 [버전 13.1에서 이에 대한 지원](https://webkit.org/blog/10855/)을 발표했습니다. 이를 통해 주요 브라우저는 기본 수준의 지원을 제공합니다. 이 글을 쓰는 시점에서 Firefox는 텍스트만 지원합니다. 이미지 지원은 일부 브라우저에서 PNG로 제한됩니다. API 사용에 관심이 있는 경우 계속하기 전에 [브라우저 지원 표를 참조](https://developer.mozilla.org/docs/Web/API/Clipboard#Browser_compatibility)하세요.

{% Aside %} Async Clipboard API는 텍스트 및 이미지 처리로 제한됩니다. Chrome 84에는 클립보드가 임의의 데이터 유형을 처리할 수 있는 실험적 기능이 도입되었습니다. {% endAside %}

## 복사: 클립보드에 데이터 쓰기

### writeText()

텍스트를 클립보드에 복사하려면 `writeText()`를 호출하세요. 이 API는 비동기식이므로 `writeText()` 함수는 전달된 텍스트가 성공적으로 복사되었는지 여부에 따라 확인하거나 거부하는 Promise를 반환합니다.

```js
async function copyPageUrl() {
  try {
    await navigator.clipboard.writeText(location.href);
    console.log('Page URL copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
```

### write()

사실, `writeText()`는 이미지를 클립보드에 복사할 수 있도록 해주는 일반 `write()` 메서드의 편의 메서드일 뿐입니다. `writeText()`와 마찬가지로 비동기식이며 Promise를 반환합니다.

클립보드에 이미지를 쓰려면 이미지가 [`blob`](https://developer.mozilla.org/docs/Web/API/blob)으로 필요합니다. 이를 수행하는 한 가지 방법은 `fetch()`를 사용하여 서버에서 이미지를 요청한 다음 응답에서 [`blob()`](https://developer.mozilla.org/docs/Web/API/Body/blob)을 호출하는 것입니다.

서버에서 이미지를 요청하는 것은 여러 가지 이유로 바람직하지 않거나 불가능할 수 있습니다. 다행히 캔버스에 이미지를 추출하고 캔버스의 [`toBlob()`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob) 메서드를 호출할 수도 있습니다.

다음으로, `ClipboardItem` 객체의 배열을 `write()` 메서드에 매개변수로 전달합니다. 현재는 한 번에 하나의 이미지만 전달할 수 있지만 향후 여러 이미지에 대한 지원을 추가할 수 있기를 바랍니다. `ClipboardItem`은 이미지의 MIME 유형을 키로 사용하고 blob을 값으로 사용하는 객체를 취합니다. `fetch()` 또는 `canvas.toBlob()`에서 얻은 Blob 객체의 경우 `blob.type` 속성에는 이미지에 대한 올바른 MIME 유형이 자동으로 포함됩니다.

```js
try {
  const imgURL = '/images/generic/file.png';
  const data = await fetch(imgURL);
  const blob = await data.blob();
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob
    })
  ]);
  console.log('Image copied.');
} catch (err) {
  console.error(err.name, err.message);
}
```

{% Aside 'warning' %} Safari(WebKit)는 사용자 활성화를 Chromium(Blink)과 다르게 취급합니다([WebKit 버그 #222262](https://bugs.webkit.org/show_bug.cgi?id=222262) 참조). Safari의 경우 결과가 `ClipboardItem`에 할당되는 promise에서 모든 비동기 작업을 실행합니다.

```js
new ClipboardItem({
  'foo/bar': new Promise(async (resolve) => {
      // Prepare `blobValue` of type `foo/bar`
      resolve(new Blob([blobValue], { type: 'foo/bar' }));
    }),
  })
```

{% endAside %}

### 복사 이벤트

사용자가 클립보드 복사를 시작하는 경우 텍스트가 아닌 데이터가 자동을 Blob으로 제공됩니다. [`copy` 이벤트](https://developer.mozilla.org/docs/Web/API/Document/copy_event)에는 이미 올바른 형식의 항목이 있는 `clipboardData` 속성이 포함되어 있어 수동으로 Blob을 만들 필요가 없습니다. `preventDefault()`를 호출하여 기본 동작 대신 고유한 논리가 적용되도록 만든 다음, 내용을 클립보드에 복사합니다. 이 예제에서 다루지 않은 것은 Clipboard API가 지원되지 않을 때 이전 API로 대체하는 방법입니다. 이 문서 뒷부분의 [기능 감지](#feature-detection)에서 이에 대해 설명하겠습니다.

```js
document.addEventListener('copy', async (e) => {
    e.preventDefault();
    try {
      let clipboardItems = [];
      for (const item of e.clipboardData.items) {
        if (!item.type.startsWith('image/')) {
          continue;
        }
        clipboardItems.push(
          new ClipboardItem({
            [item.type]: item,
          })
        );
        await navigator.clipboard.write(clipboardItems);
        console.log('Image copied.');
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  });
```

## 붙여넣기: 클립보드에서 데이터 읽기

### readText()

클립보드에서 텍스트를 읽으려면 `navigator.clipboard.readText()`를 호출하고 반환된 Promise가 해결될 때까지 기다립니다.

```js
async function getClipboardContents() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Pasted content: ', text);
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err);
  }
}
```

### read()

`navigator.clipboard.read()` 메서드도 비동기식이며 Promise를 반환합니다. 클립보드에서 이미지를 읽으려면 [`ClipboardItem`](https://developer.mozilla.org/docs/Web/API/ClipboardItem) 객체 목록을 가져온 다음 반복합니다.

각 `ClipboardItem`은 다른 유형의 내용을 가지고 있을 수 있으므로 `for...of` 루프를 다시 사용하여 유형 목록을 반복해야 합니다. 각 유형에 대해, 현재 유형을 인수로 사용한 `getType()` 메서드를 호출하여 해당 Blob을 가져옵니다. 이전과 마찬가지로 이 코드는 이미지에 연결되지 않으며 향후 다른 파일 형식에서도 작동합니다.

```js
async function getClipboardContents() {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        console.log(URL.createObjectURL(blob));
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
}
```

### 붙여넣은 파일 작업

사용자가 <kbd>ctrl</kbd> + <kbd>c</kbd> 및 <kbd>ctrl</kbd> + <kbd>v</kbd>와 같은 클립보드 키보드 단축키를 사용할 수 있으면 유용합니다. Chromium은 아래에 설명된 대로 클립보드에 *읽기 전용* 파일을 노출합니다. 이것은 사용자가 운영 체제의 기본 붙여넣기 단축키를 누르거나 사용자가 브라우저 메뉴 모음에서 **편집**을 클릭한 다음 **붙여넣기**를 클릭할 때 트리거됩니다. 더 이상 배관 코드가 필요하지 않습니다.

```js
document.addEventListener("paste", async e => {
  e.preventDefault();
  if (!e.clipboardData.files.length) {
    return;
  }
  const file = e.clipboardData.files[0];
  // Read the file's contents, assuming it's a text file.
  // There is no way to write back to it.
  console.log(await file.text());
});
```

### 붙여넣기 이벤트

앞서 언급했듯이 Clipboard API와 함께 작동하는 이벤트를 도입할 계획이 있지만 지금은 기존 `paste` 이벤트를 사용할 수 있습니다. 이 이벤트는 클립보드 텍스트를 읽기 위한 새로운 비동기 메서드와 잘 작동합니다. `copy` 이벤트와 마찬가지로 `preventDefault()`를 호출하는 것을 잊지 마세요.

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  const text = await navigator.clipboard.readText();
  console.log('Pasted text: ', text);
});
```

`copy` 이벤트와 마찬가지로 Clipboard API가 지원되지 않을 때 이전 API로 대체하는 동작은 [기능 감지](#feature-detection)에서 다룹니다.

## 여러 파일 형식 처리

대부분의 구현은 단일 잘라내기 또는 복사 작업을 위해 클립보드에 여러 데이터 형식을 넣습니다. 여기에는 두 가지 이유가 있습니다. 앱 개발자 입장에서는 사용자가 텍스트나 이미지를 복사하려는 앱의 기능을 알 수 있는 방법이 없으며 많은 애플리케이션이 구조화된 데이터를 일반 텍스트로 붙여넣기를 지원합니다. 이는 **붙여넣기 및 스타일 일치** 또는 **서식 없이 붙여넣기**와 같은 이름을 가진 **편집** 메뉴 항목으로 사용자에게 제시됩니다.

다음 예제는 이를 수행하는 방법을 보여줍니다. 이 예제에서는 `fetch()`를 사용하여 이미지 데이터를 가져오지만 [`<canvas>`](https://developer.mozilla.org/docs/Web/HTML/Element/canvas) 또는 [File System Access API](/file-system-access/)에서 가져올 수도 있습니다.

```js
async function copy() {
  const image = await fetch('kitten.png');
  const text = new Blob(['Cute sleeping kitten'], {type: 'text/plain'});
  const item = new ClipboardItem({
    'text/plain': text,
    'image/png': image
  });
  await navigator.clipboard.write([item]);
}
```

## 보안 및 권한

클립보드 액세스는 항상 브라우저에 보안 문제를 야기시킵니다. 적절한 권한이 없으면 페이지는 모든 종류의 악성 콘텐츠를 사용자의 클립보드에 자동으로 복사하여, 붙여넣을 때 치명적인 결과를 초래할 수 있습니다. `rm -rf /` 또는 [압축 해제 폭탄 이미지](http://www.aerasec.de/security/advisories/decompression-bomb-vulnerability.html)를 클립보드에 자동으로 복사하는 웹 페이지를 상상해 보세요.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Dt4QpuEuik9ja970Zos1.png", alt="사용자에게 클립보드 권한을 요청하는 브라우저 메시지", width="800", height="338" %}<figcaption> Clipboard API에 대한 권한 요청 메시지.</figcaption></figure>

웹 페이지에 클립보드에 대한 무제한 읽기 액세스 권한을 부여하는 것은 훨씬 큰 문제를 일으킵니다. 사용자가 정기적으로 암호 및 개인 정보와 같은 민감한 정보를 클립보드에 복사한다면 사용자 모르게 모든 페이지에서 이를 읽을 수 있게 됩니다.

많은 새로운 API와 마찬가지로 Clipboard API는 HTTPS를 통해 제공되는 페이지에만 지원됩니다. 악용을 방지하기 위해 페이지가 활성 탭일 때만 클립보드 액세스가 허용됩니다. 활성 탭의 페이지는 권한을 요청하지 않고 클립보드에 쓸 수 있지만 클립보드에서 읽기에는 항상 권한이 필요합니다.

복사 및 붙여넣기 권한이 [Permissions API](https://developers.google.com/web/updates/2015/04/permissions-api-for-the-web)에 추가되었습니다. `clipboard-write` 권한은 페이지가 활성 탭일 때 자동으로 부여됩니다. `clipboard-read` 권한을 요청해야 하며, 이를 위해 클립보드에서 데이터 읽기를 시도할 수 있습니다. 아래 코드는 후자를 보여줍니다.

```js
const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
const permissionStatus = await navigator.permissions.query(queryOpts);
// Will be 'granted', 'denied' or 'prompt':
console.log(permissionStatus.state);

// Listen for changes to the permission state
permissionStatus.onchange = () => {
  console.log(permissionStatus.state);
};
```

`allowWithoutGesture` 옵션을 사용하여 잘라내기 또는 붙여넣기를 호출하기 위해 사용자 제스처가 필요한지 여부를 제어할 수 있습니다. 이 값의 기본값은 브라우저에 따라 다르므로 항상 포함해야 합니다.

바로 여기에서 Clipboard API의 비동기 특성이 매우 유용합니다. 클립보드 데이터를 읽거나 쓰려고 하면 아직 권한이 부여되지 않은 경우 사용자에게 권한을 묻는 메시지가 자동으로 표시됩니다. API는 promise 기반이므로 이는 완전히 투명하며 사용자가 클립보드 권한을 거부하면 promise가 거부되어 페이지가 적절하게 응답할 수 있습니다.

Chrome은 페이지가 활성 탭일 때만 클립보드 액세스를 허용하므로 DevTools에 직접 붙여넣을 경우 여기의 일부 예가 실행되지 않는다는 것을 알게 될 것입니다. DevTools 자체가 활성 탭이기 때문입니다. 요령: `setTimeout()`을 사용하여 클립보드 액세스를 연기한 다음, 함수가 호출되기 전에 페이지 내부를 빠르게 클릭하여 포커스를 옮깁니다.

```js
setTimeout(async () => {
  const text = await navigator.clipboard.readText();
  console.log(text);
}, 2000);
```

## 권한 정책 통합

iframe에서 API를 사용하려면 다양한 브라우저 기능과 API를 선택적으로 활성화 및 비활성화할 수 있는 메커니즘을 정의하는 [권한 정책](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/)으로 이를 활성화해야 합니다. 구체적으로, 앱의 필요에 따라 `clipboard-read` 또는 `clipboard-write` 중 하나 또는 둘 모두를 전달해야 합니다.

```html/2
<iframe
    src="index.html"
    allow="clipboard-read; clipboard-write"
>
</iframe>
```

## 기능 감지

모든 브라우저를 지원하면서 Async Clipboard API를 사용하려면 `navigator.clipboard`에 대해 테스트하고 이전 방법으로 대체하세요. 예를 들어, 다음은 다른 브라우저를 포함하도록 붙여넣기를 구현할 수 있는 방법입니다.

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  let text;
  if (navigator.clipboard) {
    text = await navigator.clipboard.readText();
  }
  else {
    text = e.clipboardData.getData('text/plain');
  }
  console.log('Got pasted text: ', text);
});
```

이것이 전부는 아닙니다. Async Clipboard API 이전에는 웹 브라우저 전반에서 다양한 복사 및 붙여넣기 구현이 혼합되어 있었습니다. 대부분의 브라우저에서 브라우저 자체의 복사 및 붙여넣기는 `document.execCommand('copy')` 및 `document.execCommand('paste')`를 사용하여 트리거할 수 있습니다. 복사할 텍스트가 DOM에 없는 문자열이면 DOM에 삽입하고 선택해야 합니다.

```js
button.addEventListener('click', (e) => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();
  const result = document.execCommand('copy');
  if (result === 'unsuccessful') {
    console.error('Failed to copy text.');
  }
});
```

Internet Explorer에서는 `window.clipboardData`를 통해 클립보드에 액세스할 수도 있습니다. 책임감 있게 권한을 요청하는 일부로서, 클릭 이벤트와 같은 사용자 제스처 내에서 액세스하는 경우 권한 부여 메시지가 표시되지 않습니다.

## 데모

아래 데모에서, 또는 [Glitch에서 직접](https://async-clipboard-api.glitch.me/) Async Clipboard API를 사용해볼 수 있습니다.

첫 번째 예는 클립보드 안팎으로 텍스트를 이동하는 방법을 보여줍니다.

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://async-clipboard-text.glitch.me/" title="async-clipboard-text on Glitch" allow="clipboard-read; clipboard-write" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

이미지로 API를 시도하려면 이 데모를 사용하세요. PNG만 지원되며 [일부 브라우저](https://developer.mozilla.org/docs/Web/API/Clipboard_API#browser_compatibility)에서만 지원된다는 점을 상기하세요.

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://async-clipboard-api.glitch.me/" title="async-clipboard-api on Glitch" allow="clipboard-read; clipboard-write" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## 다음 단계

Chrome은 [Drag and Drop API](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)에 맞춰진 단순화된 이벤트로 Asynchronous Clipboard API를 확장하기 위해 적극적으로 노력하고 있습니다. 잠재적인 위험 때문에 Chrome은 신중하게 진행하고 있습니다. Chrome의 진행 상황에 대한 최신 정보를 얻으려면 이 문서와 [블로그](/blog/)에서 업데이트를 확인하세요.

현재, Clipboard API에 대한 지원은 [여러 브라우저](https://developer.mozilla.org/docs/Web/API/Clipboard#Browser_compatibility)에서 사용할 수 있습니다.

복사 및 붙여넣기 작업을 즐기세요!

## 관련된 링크

- [MDN](https://developer.mozilla.org/docs/Web/API/Clipboard_API)

## 감사의 말

Asynchronous Clipboard API는 [Darwin Huang](https://www.linkedin.com/in/darwinhuang/)과 [Gary Kačmarčík](https://www.linkedin.com/in/garykac/)에 의해 구현되었습니다. Darwin은 데모도 제공했습니다. 이 글을 검토해 준 [Kyarik](https://github.com/kyarik)와 Gary Kačmarčík에게 다시 한 번 감사의 말을 전합니다.

[Unsplash](https://unsplash.com/photos/7iSEHWsxPLw)에서 [Markus Winkler](https://unsplash.com/@markuswinkler)가 영웅 이미지 제공.
